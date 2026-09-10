import asyncpg
import logging
from contextlib import asynccontextmanager
from config import get_settings

logger = logging.getLogger(__name__)
_pool: asyncpg.Pool | None = None


async def init_db():
    global _pool
    settings = get_settings()
    try:
        _pool = await asyncpg.create_pool(
            dsn=settings.database_url,
            min_size=2,
            max_size=10,
            command_timeout=60,
        )
        logger.info("Database pool initialized")
    except Exception as e:
        logger.warning(f"Database connection failed (running without DB): {e}")


async def close_db():
    global _pool
    if _pool:
        await _pool.close()
        logger.info("Database pool closed")


def get_pool() -> asyncpg.Pool | None:
    return _pool


@asynccontextmanager
async def get_conn():
    if _pool is None:
        yield None
        return
    async with _pool.acquire() as conn:
        yield conn
