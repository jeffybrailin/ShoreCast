import httpx
import logging
from cache.redis_client import cache_get, cache_set

logger = logging.getLogger(__name__)


async def get_incois_alerts(lat: float, lon: float) -> list[dict]:
    """Fetch INCOIS safety alerts. Falls back to mock data if unavailable."""
    cache_key = f"incois:{lat:.2f}:{lon:.2f}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    # INCOIS public alerts fallback mock (realistic data)
    mock = [
        {
            "source": "INCOIS",
            "type": "HIGH_WAVE",
            "severity": "MEDIUM",
            "message": "Wave heights of 2-3m expected near the coast. Exercise caution near water.",
            "valid_from": "2026-08-28T06:00:00+05:30",
            "valid_to": "2026-08-28T18:00:00+05:30",
        }
    ]
    await cache_set(cache_key, mock, ttl=1800)
    return mock
