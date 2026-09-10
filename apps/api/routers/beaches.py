from fastapi import APIRouter, Query
from db.connection import get_conn
from services.open_meteo import get_marine_data, get_weather_data
from services.suitability import calculate_suitability_score
from services.incois import get_incois_alerts
from services.overpass import query_amenities, query_tourist_attractions
from data.beaches_india import BEACHES as MASTER_BEACHES, find_beach
import asyncio, logging
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["beaches"])

FALLBACK_BEACHES = [
    {"id": b["id"], "name": b["name"], "state": b["state"],
     "lat": b["lat"], "lon": b["lon"], "suitability_score": 75.0}
    for b in MASTER_BEACHES[:20]
]


@router.get("/beaches")
async def list_beaches(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    radius_km: float = Query(500),
    min_score: float = Query(0),
    state: Optional[str] = Query(None),
):
    async with get_conn() as conn:
        if conn is None:
            beaches = FALLBACK_BEACHES
            if state:
                beaches = [b for b in MASTER_BEACHES if state.lower() in b["state"].lower()]
                beaches = [{"id": b["id"], "name": b["name"], "state": b["state"],
                            "lat": b["lat"], "lon": b["lon"], "suitability_score": 75.0}
                           for b in beaches]
            beaches = [b for b in beaches if b.get("suitability_score", 0) >= min_score]
            return {"beaches": beaches, "source": "fallback", "total": len(MASTER_BEACHES)}

        if lat is not None and lon is not None:
            rows = await conn.fetch(
                """SELECT id::text, name, state,
                          ST_Y(location::geometry) as lat,
                          ST_X(location::geometry) as lon,
                          suitability_score
                   FROM beaches
                   WHERE ST_DWithin(location::geography,
                       ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
                   AND suitability_score >= $4
                   ORDER BY suitability_score DESC""",
                lon, lat, radius_km * 1000, min_score
            )
        else:
            rows = await conn.fetch(
                "SELECT id::text, name, state, ST_Y(location::geometry) as lat, "
                "ST_X(location::geometry) as lon, suitability_score FROM beaches "
                "WHERE suitability_score >= $1 ORDER BY suitability_score DESC",
                min_score
            )
        return {"beaches": [dict(r) for r in rows], "source": "database"}


@router.get("/beaches/{beach_id}")
async def get_beach_detail(beach_id: str):
    async with get_conn() as conn:
        if conn is None:
            # Try master DB first
            master = next((b for b in MASTER_BEACHES if b["id"] == beach_id), None)
            if master:
                beach = {"id": master["id"], "name": master["name"],
                         "state": master["state"], "description": master["description"],
                         "lat": master["lat"], "lon": master["lon"],
                         "tags": master["tags"], "best_season": master["best_season"],
                         "suitability_score": 75.0}
            else:
                return {"error": "Beach not found"}
            lat, lon = beach["lat"], beach["lon"]
        else:
            row = await conn.fetchrow(
                "SELECT id::text, name, state, description, "
                "ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon, "
                "suitability_score FROM beaches WHERE id = $1",
                beach_id
            )
            if not row:
                return {"error": "Beach not found"}
            beach = dict(row)
            lat, lon = beach["lat"], beach["lon"]

    # Fetch live data + nearby places concurrently
    marine, weather, alerts, hotels, restaurants, attractions = await asyncio.gather(
        get_marine_data(lat, lon),
        get_weather_data(lat, lon),
        get_incois_alerts(lat, lon),
        query_amenities(lat, lon, "hotel", radius_m=5000),
        query_amenities(lat, lon, "restaurant", radius_m=3000),
        query_tourist_attractions(lat, lon, radius_m=10000),
        return_exceptions=True
    )

    wave_heights = (marine or {}).get("hourly", {}).get("wave_height", [1.0]) if not isinstance(marine, Exception) else [1.0]
    uv_indices   = (weather or {}).get("hourly", {}).get("uv_index", [3.0])   if not isinstance(weather, Exception) else [3.0]

    score = calculate_suitability_score(
        wave_height=wave_heights[0] if wave_heights else 1.0,
        uv_index=uv_indices[0]      if uv_indices   else 3.0,
        alert_severity=(alerts[0]["severity"] if alerts and not isinstance(alerts, Exception) else "LOW"),
    )

    return {
        **beach,
        "live_suitability": score,
        "marine_data":   (marine or {}).get("daily", {})  if not isinstance(marine, Exception) else {},
        "weather_data":  (weather or {}).get("daily", {}) if not isinstance(weather, Exception) else {},
        "alerts":        alerts if not isinstance(alerts, Exception) else [],
        "nearby": {
            "hotels":      (hotels or [])[:8]       if not isinstance(hotels, Exception) else [],
            "restaurants": (restaurants or [])[:8]   if not isinstance(restaurants, Exception) else [],
            "attractions": (attractions or [])[:10]  if not isinstance(attractions, Exception) else [],
        },
    }


@router.get("/beaches/search/{query}")
async def search_beaches(query: str):
    """Search beaches by name across the master database."""
    q = query.lower()
    results = [b for b in MASTER_BEACHES if q in b["name"].lower() or q in b["state"].lower() or q in b["region"].lower()]
    return {"results": results[:20], "total": len(results)}


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "shorecast-api", "beach_count": len(MASTER_BEACHES)}