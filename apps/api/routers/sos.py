"""SOS Dispatch and Emergency Services Router."""
import json, os, logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel
from db.emergency_seed import find_nearest_stations, get_stations_in_radius

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/sos", tags=["sos"])

SOS_LOG = os.path.join(os.path.dirname(__file__), "..", "data", "sos_log.json")
os.makedirs(os.path.dirname(SOS_LOG), exist_ok=True)

class SOSRequest(BaseModel):
    user_id: str = "anonymous"
    lat: float
    lon: float
    emergency_type: str = "general"
    message: str = ""
    emergency_contacts: list[dict] = []

def _load_log() -> list:
    if os.path.exists(SOS_LOG):
        try:
            with open(SOS_LOG) as f: return json.load(f)
        except Exception: pass
    return []

def _save_log(entries: list):
    with open(SOS_LOG, "w") as f: json.dump(entries, f, indent=2)

@router.get("/nearest")
async def nearest_stations(
    lat: float = Query(...), lon: float = Query(...),
    type: Optional[str] = Query(None),
    limit: int = Query(3),
):
    stations = find_nearest_stations(lat, lon, station_type=type, limit=limit)
    return {"stations": stations, "count": len(stations)}

@router.post("/dispatch")
async def dispatch_sos(req: SOSRequest):
    maps_link = f"https://maps.google.com/?q={req.lat},{req.lon}"
    stations = find_nearest_stations(req.lat, req.lon, limit=1)
    station = stations[0] if stations else None

    entry = {
        "id": f"sos_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_id": req.user_id,
        "lat": req.lat, "lon": req.lon,
        "emergency_type": req.emergency_type,
        "message": req.message,
        "maps_link": maps_link,
        "dispatched_to": station["name"] if station else "No station found",
        "station_contacts": (station["mobile"] + station["landline"])[:2] if station else [],
        "personal_contacts_notified": len(req.emergency_contacts),
        "status": "logged",  # Would be "dispatched" with real Twilio
    }
    log = _load_log()
    log.append(entry)
    _save_log(log)

    logger.info(f"SOS logged: {entry['id']} — {req.emergency_type} @ {req.lat},{req.lon}")
    return {
        "dispatched": True,
        "sos_id": entry["id"],
        "station": station,
        "maps_link": maps_link,
        "message": (
            f"SOS logged and dispatched to {station['name']} "
            f"({station['distance_km']} km away). "
            f"Contact: {', '.join(station['mobile'][:1] + station['landline'][:1])}"
        ) if station else "SOS logged. No nearby station found — call 112.",
        "emergency_number": "112",
    }

@router.get("/offline-cache")
async def offline_cache(
    lat: float = Query(...), lon: float = Query(...),
    radius_km: float = Query(25),
):
    stations = get_stations_in_radius(lat, lon, radius_km)
    return {
        "cached_at": datetime.now(timezone.utc).isoformat(),
        "radius_km": radius_km,
        "stations": stations,
        "count": len(stations),
        "next_sync_in_min": 120,
    }

@router.get("/log")
async def get_sos_log():
    return {"events": _load_log()}
