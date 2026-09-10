import httpx
import logging
from cache.redis_client import cache_get, cache_set

logger = logging.getLogger(__name__)

OPEN_METEO_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"
OPEN_METEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


async def get_marine_data(lat: float, lon: float, days: int = 3) -> dict:
    cache_key = f"marine:{lat:.3f}:{lon:.3f}:{days}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "wave_height,wave_period,wave_direction,swell_wave_height,ocean_current_velocity",
        "daily": "wave_height_max,wave_period_max",
        "forecast_days": days,
        "timezone": "Asia/Kolkata",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(OPEN_METEO_MARINE_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            await cache_set(cache_key, data, ttl=600)
            return data
    except Exception as e:
        logger.error(f"Open-Meteo marine API error: {e}")
        return _mock_marine_data(lat, lon)


async def get_weather_data(lat: float, lon: float, days: int = 3) -> dict:
    cache_key = f"weather:{lat:.3f}:{lon:.3f}:{days}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "uv_index,temperature_2m,wind_speed_10m,precipitation",
        "daily": "uv_index_max,temperature_2m_max,wind_speed_10m_max",
        "forecast_days": days,
        "timezone": "Asia/Kolkata",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(OPEN_METEO_WEATHER_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            await cache_set(cache_key, data, ttl=600)
            return data
    except Exception as e:
        logger.error(f"Open-Meteo weather API error: {e}")
        return _mock_weather_data(lat, lon)


def _mock_marine_data(lat: float, lon: float) -> dict:
    return {
        "latitude": lat, "longitude": lon,
        "hourly": {
            "time": ["2026-08-28T00:00", "2026-08-28T01:00"],
            "wave_height": [1.2, 1.3],
            "wave_period": [8.0, 8.2],
            "wave_direction": [180, 185],
            "swell_wave_height": [0.8, 0.9],
            "ocean_current_velocity": [0.3, 0.3],
        },
        "daily": {
            "time": ["2026-08-28"],
            "wave_height_max": [1.8],
            "wave_period_max": [9.0],
        },
        "_mock": True
    }


def _mock_weather_data(lat: float, lon: float) -> dict:
    return {
        "latitude": lat, "longitude": lon,
        "hourly": {
            "time": ["2026-08-28T00:00", "2026-08-28T01:00"],
            "uv_index": [3.0, 4.0],
            "temperature_2m": [28.5, 29.0],
            "wind_speed_10m": [12.0, 14.0],
            "precipitation": [0.0, 0.0],
        },
        "daily": {
            "time": ["2026-08-28"],
            "uv_index_max": [8.0],
            "temperature_2m_max": [33.0],
            "wind_speed_10m_max": [22.0],
        },
        "_mock": True
    }
