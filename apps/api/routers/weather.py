from fastapi import APIRouter, Query
from services.open_meteo import get_marine_data, get_weather_data
from services.incois import get_incois_alerts
from services.overpass import query_amenities, query_tourist_attractions
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["weather"])


@router.get("/marine")
async def get_marine(
    lat: float = Query(...),
    lon: float = Query(...),
    days: int = Query(3, le=7)
):
    marine = await get_marine_data(lat, lon, days)
    weather = await get_weather_data(lat, lon, days)
    alerts = await get_incois_alerts(lat, lon)
    return {"marine": marine, "weather": weather, "alerts": alerts}


@router.get("/pois")
async def get_pois(
    lat: float = Query(...),
    lon: float = Query(...),
    amenity: str = Query("restaurant"),
    radius_km: float = Query(5.0)
):
    amenities = await query_amenities(lat, lon, amenity, radius_m=int(radius_km * 1000))
    attractions = await query_tourist_attractions(lat, lon, radius_m=int(radius_km * 1000))
    return {"amenities": amenities, "attractions": attractions}
