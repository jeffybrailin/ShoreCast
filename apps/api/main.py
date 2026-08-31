import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from db.connection import init_db, close_db
from cache.redis_client import init_redis, close_redis
from routers import chat, beaches, weather, auth
from agents.sentinel import sentinel_loop, stop_sentinel

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Starting Shorecast API...")
    await init_db()
    await init_redis()

    sentinel_task = asyncio.create_task(
        sentinel_loop(interval_seconds=settings.sentinel_interval_seconds)
    )
    logger.info("Sentinel Agent running in background")

    yield

    logger.info("Shutting down Shorecast API...")
    stop_sentinel()
    sentinel_task.cancel()
    try:
        await sentinel_task
    except asyncio.CancelledError:
        pass
    await close_db()
    await close_redis()


app = FastAPI(
    title="Shorecast API",
    description="Agentic AI Coastal Safety and Tourism Platform",
    version="1.0.0",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(beaches.router)
app.include_router(weather.router)
app.include_router(auth.router)


@app.get("/")
async def root():
    return {
        "service": "Shorecast API",
        "version": "1.0.0",
        "docs": "/docs",
        "agents": ["planner", "sentinel"],
        "data_sources": ["Open-Meteo", "INCOIS", "OpenStreetMap/Overpass"],
    }
