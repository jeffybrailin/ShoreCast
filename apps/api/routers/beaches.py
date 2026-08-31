from fastapi import APIRouter, Query
from db.connection import get_conn
from services.open_meteo import get_marine_data, get_weather_data
from services.suitability import calculate_suitability_score
from services.incois import get_incois_alerts
import logging
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["beaches"])

FALLBACK_BEACHES = [
    {"id": "1", "name": "Marina Beach", "state": "Tamil Nadu", "lat": 13.0500, "lon": 80.2785, "suitability_score": 72.0},
    {"id": "2", "name": "Juhu Beach", "state": "Maharashtra", "lat": 19.1075, "lon": 72.8264, "suitability_score": 58.0},
    {"id": "3", "name": "Calangute Beach", "state": "Goa", "lat": 15.5440, "lon": 73.7553, "suitability_score": 80.0},
    {"id": "4", "name": "Radhanagar Beach", "state": "Andaman", "lat": 11.9916, "lon": 92.9762, "suitability_score": 91.0},
    {"id": "5", "name": "Puri Beach", "state": "Odisha", "lat": 19.7979, "lon": 85.8245, "suitability_score": 65.0},
    {"id": "6", "name": "Kovalam Beach", "state": "Kerala", "lat": 8.3988, "lon": 76.9827, "suitability_score": 83.0},
    {"id": "7", "name": "Rushikonda Beach", "state": "Andhra Pradesh", "lat": 17.7760, "lon": 83.3800, "suitability_score": 87.0},
    {"id": "8", "name": "Varkala Beach", "state": "Kerala", "lat": 8.7379, "lon": 76.7163, "suitability_score": 76.0},
    {"id": "9", "name": "Diu Beach", "state": "Diu", "lat": 20.7142, "lon": 70.9878, "suitability_score": 78.0},
    {"id": "10", "name": "Tarkarli Beach", "state": "Maharashtra", "lat": 16.0167, "lon": 73.4698, "suitability_score": 85.0},
]


@router.get("/beaches")
async def list_beaches(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    radius_km: float = Query(500),
    min_score: float = Query(0),
):
    async with get_conn() as conn:
        if conn is None:
            beaches = [b for b in FALLBACK_BEACHES if b["suitability_score"] >= min_score]
            return {"beaches": beaches, "source": "fallback"}

        if lat is not None and lon is not None:
            rows = await conn.fetch(
                """
                SELECT id::text, name, state,
                       ST_Y(location::geometry) as lat,
                       ST_X(location::geometry) as lon,
                       suitability_score
                FROM beaches
                WHERE ST_DWithin(
                    location::geography,
                    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                    $3
                )
                AND suitability_score >= $4
                ORDER BY suitability_score DESC
                """,
                lon, lat, radius_km * 1000, min_score
            )
        else:
            rows = await conn.fetch(
                "SELECT id::text, name, state, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon, suitability_score FROM beaches WHERE suitability_score >= $1 ORDER BY suitability_score DESC",
                min_score
            )

        return {"beaches": [dict(r) for r in rows], "source": "database"}


@router.get("/beaches/{beach_id}")
async def get_beach_detail(beach_id: str):
    async with get_conn() as conn:
        if conn is None:
            beach = next((b for b in FALLBACK_BEACHES if b["id"] == beach_id), None)
            if not beach:
                return {"error": "Beach not found"}
            lat, lon = beach["lat"], beach["lon"]
        else:
            row = await conn.fetchrow(
                "SELECT id::text, name, state, description, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon, suitability_score FROM beaches WHERE id = $1",
                beach_id
            )
            if not row:
                return {"error": "Beach not found"}
            beach = dict(row)
            lat, lon = beach["lat"], beach["lon"]

    marine = await get_marine_data(lat, lon)
    weather = await get_weather_data(lat, lon)
    alerts = await get_incois_alerts(lat, lon)

    wave_heights = marine.get("hourly", {}).get("wave_height", [1.0])
    uv_indices = weather.get("hourly", {}).get("uv_index", [3.0])

    score = calculate_suitability_score(
        wave_height=wave_heights[0] if wave_heights else 1.0,
        uv_index=uv_indices[0] if uv_indices else 3.0,
        alert_severity=alerts[0]["severity"] if alerts else "LOW",
    )

    return {
        **beach,
        "live_suitability": score,
        "marine_data": marine.get("daily", {}),
        "weather_data": weather.get("daily", {}),
        "alerts": alerts,
    }


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "shorecast-api"}
