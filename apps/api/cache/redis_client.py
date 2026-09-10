import redis.asyncio as aioredis
import logging
import json
from typing import Any, Optional
from config import get_settings

logger = logging.getLogger(__name__)
_redis: aioredis.Redis | None = None


async def init_redis():
    global _redis
    settings = get_settings()
    try:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
        await _redis.ping()
        logger.info("Redis connected")
    except Exception as e:
        logger.warning(f"Redis unavailable (running without cache): {e}")


async def close_redis():
    global _redis
    if _redis:
        await _redis.close()


def get_redis() -> aioredis.Redis | None:
    return _redis


async def cache_set(key: str, value: Any, ttl: int = 300):
    if _redis is None:
        return
    await _redis.setex(key, ttl, json.dumps(value))


async def cache_get(key: str) -> Optional[Any]:
    if _redis is None:
        return None
    val = await _redis.get(key)
    if val:
        return json.loads(val)
    return None


async def force_logout(session_id: str, reason: str = "anomaly_detected"):
    """Sentinel-triggered forced session termination."""
    if _redis is None:
        return
    await _redis.setex(f"logout:{session_id}", 3600, reason)
    await _redis.publish("session_events", json.dumps({
        "event": "FORCE_LOGOUT",
        "session_id": session_id,
        "reason": reason
    }))
    logger.warning(f"Force logout triggered for session {session_id}: {reason}")


async def check_force_logout(session_id: str) -> Optional[str]:
    if _redis is None:
        return None
    return await _redis.get(f"logout:{session_id}")
