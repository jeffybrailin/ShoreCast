import asyncio
import logging
import json
from datetime import datetime
from db.connection import get_conn
from services.open_meteo import get_marine_data
from services.suitability import classify_anomaly, calculate_suitability_score
from cache.redis_client import get_redis

logger = logging.getLogger(__name__)
SENTINEL_RUNNING = False


async def sentinel_loop(interval_seconds: int = 30):
    """Background Sentinel Agent that monitors all beaches for anomalies."""
    global SENTINEL_RUNNING
    SENTINEL_RUNNING = True
    logger.info("Sentinel Agent started")

    baselines: dict[str, float] = {}

    while SENTINEL_RUNNING:
        try:
            async with get_conn() as conn:
                if conn is None:
                    await asyncio.sleep(interval_seconds)
                    continue

                beaches = await conn.fetch(
                    "SELECT id, name, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon FROM beaches"
                )

                for beach in beaches:
                    beach_id = str(beach["id"])
                    lat, lon = beach["lat"], beach["lon"]

                    marine = await get_marine_data(lat, lon, days=1)
                    wave_heights = marine.get("hourly", {}).get("wave_height", [1.0])
                    current_wave = wave_heights[0] if wave_heights else 1.0
                    baseline = baselines.get(beach_id, current_wave)

                    if classify_anomaly(current_wave, baseline):
                        score_data = calculate_suitability_score(
                            wave_height=current_wave,
                            uv_index=8.0,
                            alert_severity="HIGH"
                        )

                        await conn.execute(
                            """
                            INSERT INTO alerts (beach_id, severity, category, message, expires_at)
                            VALUES ($1, $2, $3, $4, NOW() + INTERVAL '6 hours')
                            """,
                            beach["id"],
                            score_data["category"],
                            "MARINE_ANOMALY",
                            f"Wave surge at {beach['name']}: {current_wave:.1f}m (score: {score_data['score']}/100)"
                        )

                        redis = get_redis()
                        if redis:
                            await redis.publish("alerts", json.dumps({
                                "beach_id": beach_id,
                                "beach_name": beach["name"],
                                "wave_height": current_wave,
                                "score": score_data["score"],
                                "category": score_data["category"],
                                "timestamp": datetime.utcnow().isoformat(),
                            }))

                        logger.warning(f"Sentinel Alert: {beach['name']} - wave {current_wave:.1f}m")

                    baselines[beach_id] = current_wave

        except Exception as e:
            logger.error(f"Sentinel loop error: {e}")

        await asyncio.sleep(interval_seconds)


def stop_sentinel():
    global SENTINEL_RUNNING
    SENTINEL_RUNNING = False
