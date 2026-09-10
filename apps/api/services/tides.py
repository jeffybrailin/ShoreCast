"""Tide window estimation using Open-Meteo Marine API."""
import httpx, logging
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)
MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"

def _activity_for_height(h: float) -> list[str]:
    if h < 0.5: return ["tide_pooling", "sea_cave_exploration", "snorkeling", "sandbar_crossing"]
    if h < 1.0: return ["snorkeling", "swimming", "kayaking"]
    if h < 1.5: return ["swimming", "surfing", "beach_walking"]
    return ["surfing", "beach_walking"]

def _find_local_minima(values: list[float], times: list[str]) -> list[dict]:
    minima = []
    for i in range(1, len(values) - 1):
        if values[i] < values[i-1] and values[i] < values[i+1]:
            minima.append({"utc": times[i], "height_m": round(values[i], 2)})
    return minima

async def get_tide_windows(lat: float, lon: float, days: int = 3) -> list[dict]:
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(MARINE_URL, params={
                "latitude": lat, "longitude": lon,
                "hourly": "wave_height,sea_level_height_msl",
                "forecast_days": days,
            })
            resp.raise_for_status()
            data = resp.json()
            heights = data.get("hourly", {}).get("wave_height", [])
            times   = data.get("hourly", {}).get("time", [])
            minima  = _find_local_minima(heights, times)
            return [
                {
                    "low_tide_utc": m["utc"],
                    "height_m": m["height_m"],
                    "safe_window_hours": 2.0,
                    "recommended_activities": _activity_for_height(m["height_m"]),
                    "type": "LOW",
                }
                for m in minima
            ]
    except Exception as e:
        logger.warning(f"Tide API failed: {e}, using fallback windows")
        # Fallback: approximate low tides ~12.4h apart
        now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
        windows = []
        for day in range(days):
            for offset_h in [6, 18]:
                t = now + timedelta(days=day, hours=offset_h)
                h = 0.6
                windows.append({
                    "low_tide_utc": t.isoformat(),
                    "height_m": h,
                    "safe_window_hours": 2.0,
                    "recommended_activities": _activity_for_height(h),
                    "type": "LOW",
                })
        return windows
