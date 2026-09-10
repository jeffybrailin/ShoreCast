from fastapi import APIRouter, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from cache.redis_client import force_logout, check_force_logout, cache_set, cache_get
from config import get_settings
import logging
import math

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


class LoginRequest(BaseModel):
    username: str
    password: str = "demo"
    lat: float = 0.0
    lon: float = 0.0


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    session_id: str


def _create_token(data: dict) -> str:
    settings = get_settings()
    to_encode = {**data, "exp": datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)}
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    session_id = f"sess_{request.username}_{int(datetime.utcnow().timestamp())}"
    token = _create_token({"sub": request.username, "session_id": session_id})

    await cache_set(f"session:{session_id}", {
        "user": request.username,
        "last_lat": request.lat,
        "last_lon": request.lon,
        "last_active": datetime.utcnow().isoformat(),
    }, ttl=3600)

    return TokenResponse(access_token=token, session_id=session_id)


@router.post("/location-update")
async def update_location(session_id: str, lat: float, lon: float):
    """Sentinel governance: detect anomalous location shifts."""
    session_data = await cache_get(f"session:{session_id}")
    if not session_data:
        return {"status": "no_session"}

    last_lat = session_data.get("last_lat", lat)
    last_lon = session_data.get("last_lon", lon)

    R = 6371
    dlat = math.radians(lat - last_lat)
    dlon = math.radians(lon - last_lon)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(last_lat)) * math.cos(math.radians(lat)) * math.sin(dlon / 2) ** 2
    distance_km = 2 * R * math.asin(math.sqrt(a))

    if distance_km > 500:
        await force_logout(session_id, reason=f"anomalous_location_shift_{distance_km:.0f}km")
        raise HTTPException(status_code=401, detail="Session terminated: anomalous location detected")

    session_data.update({"last_lat": lat, "last_lon": lon})
    await cache_set(f"session:{session_id}", session_data, ttl=3600)
    return {"status": "ok", "distance_km": round(distance_km, 2)}


@router.get("/session/{session_id}")
async def check_session(session_id: str):
    force_reason = await check_force_logout(session_id)
    if force_reason:
        raise HTTPException(status_code=401, detail=f"Session force-terminated: {force_reason}")
    data = await cache_get(f"session:{session_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Session not found")
    return data
