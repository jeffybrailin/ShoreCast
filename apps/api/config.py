from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://shorecast:shorecast_secret@localhost:5432/shorecast"
    redis_url: str = "redis://localhost:6379"
    groq_api_key: str = ""
    jwt_secret: str = "shorecast_dev_secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60
    allowed_origins: list[str] = ["http://localhost:3000"]
    sentinel_interval_seconds: int = 30
    suitability_wave_weight: float = 0.35
    suitability_uv_weight: float = 0.20
    suitability_tide_weight: float = 0.25
    suitability_alert_weight: float = 0.20

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
