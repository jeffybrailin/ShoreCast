import asyncio
from langchain_core.tools import tool
from services.open_meteo import get_marine_data, get_weather_data
from services.overpass import query_amenities, query_tourist_attractions
from services.incois import get_incois_alerts
from services.suitability import calculate_suitability_score


@tool
def get_beach_conditions(lat: float, lon: float, beach_name: str = "") -> dict:
    """Get comprehensive marine and weather conditions for a coastal location.
    Use this to check wave heights, UV index, tide levels, and safety scores.
    Args:
        lat: Latitude of the beach location
        lon: Longitude of the beach location
        beach_name: Optional name of the beach for reference
    """
    loop = asyncio.new_event_loop()
    try:
        marine = loop.run_until_complete(get_marine_data(lat, lon, days=3))
        weather = loop.run_until_complete(get_weather_data(lat, lon, days=3))
        alerts = loop.run_until_complete(get_incois_alerts(lat, lon))
    finally:
        loop.close()

    wave_heights = marine.get("hourly", {}).get("wave_height", [1.0])
    uv_indices = weather.get("hourly", {}).get("uv_index", [3.0])
    wind_speeds = weather.get("hourly", {}).get("wind_speed_10m", [10.0])

    current_wave = wave_heights[0] if wave_heights else 1.0
    current_uv = uv_indices[0] if uv_indices else 3.0
    current_wind = wind_speeds[0] if wind_speeds else 10.0
    alert_severity = alerts[0]["severity"] if alerts else "LOW"

    suitability = calculate_suitability_score(
        wave_height=current_wave,
        uv_index=current_uv,
        alert_severity=alert_severity,
        wind_speed=current_wind,
    )

    return {
        "beach_name": beach_name or f"Location ({lat}, {lon})",
        "lat": lat,
        "lon": lon,
        "suitability": suitability,
        "marine": {
            "wave_height_m": current_wave,
            "wave_period_s": marine.get("hourly", {}).get("wave_period", [8.0])[0],
            "swell_height_m": marine.get("hourly", {}).get("swell_wave_height", [0.5])[0],
        },
        "weather": {
            "uv_index": current_uv,
            "temperature_c": weather.get("hourly", {}).get("temperature_2m", [28.0])[0],
            "wind_speed_kmh": current_wind,
        },
        "alerts": alerts,
    }


@tool
def find_nearby_amenities(
    lat: float,
    lon: float,
    amenity_type: str = "restaurant",
    radius_km: float = 5.0
) -> list:
    """Find nearby hotels, restaurants, or other amenities using OpenStreetMap data.
    Args:
        lat: Latitude of the search center
        lon: Longitude of the search center
        amenity_type: Type of amenity (hotel, restaurant, cafe, hospital, pharmacy)
        radius_km: Search radius in kilometers
    """
    loop = asyncio.new_event_loop()
    try:
        results = loop.run_until_complete(
            query_amenities(lat, lon, amenity_type, radius_m=int(radius_km * 1000))
        )
    finally:
        loop.close()
    return results[:15]


@tool
def find_tourist_attractions(lat: float, lon: float, radius_km: float = 10.0) -> list:
    """Find tourist attractions, viewpoints, and points of interest near a location.
    Args:
        lat: Latitude
        lon: Longitude
        radius_km: Search radius in kilometers
    """
    loop = asyncio.new_event_loop()
    try:
        results = loop.run_until_complete(
            query_tourist_attractions(lat, lon, radius_m=int(radius_km * 1000))
        )
    finally:
        loop.close()
    return results


@tool
def calculate_beach_suitability(
    wave_height: float,
    uv_index: float,
    tide_level: float = 1.0,
    alert_severity: str = "LOW"
) -> dict:
    """Calculate a coastal suitability safety score from environmental parameters.
    Returns a score from 0 (extremely dangerous) to 100 (perfectly safe).
    Args:
        wave_height: Current wave height in meters
        uv_index: Current UV index (0-11+)
        tide_level: Current tide level in meters
        alert_severity: INCOIS alert level (LOW, MEDIUM, HIGH, CRITICAL)
    """
    return calculate_suitability_score(wave_height, uv_index, tide_level, alert_severity)


PLANNER_TOOLS = [get_beach_conditions, find_nearby_amenities, find_tourist_attractions, calculate_beach_suitability]
SENTINEL_TOOLS = [get_beach_conditions, calculate_beach_suitability]
