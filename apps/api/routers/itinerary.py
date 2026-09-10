"""Itinerary management with agent mutation support."""
import json, os, uuid, logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/itinerary", tags=["itinerary"])

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "itineraries.json")
os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)

def _load() -> dict:
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE) as f: return json.load(f)
        except Exception: pass
    return {}

def _save(data: dict):
    with open(DB_FILE, "w") as f: json.dump(data, f, indent=2)

class ItineraryCreate(BaseModel):
    user_id: str
    title: str
    destination: str
    days: int = 3
    interests: list[str] = []

class ActivityItem(BaseModel):
    time: str
    activity: str
    location: str
    beach_id: Optional[str] = None
    weather_dependency: bool = False
    tide_dependency: Optional[str] = None

class MutateRequest(BaseModel):
    hazard: dict
    affected_item_ids: list[str]

TEMPLATE_ACTIVITIES = {
    "surfing":     [{"time":"07:00","activity":"Early morning surf session","weather_dependency":True},{"time":"16:00","activity":"Sunset surf & bodyboard","weather_dependency":True}],
    "snorkeling":  [{"time":"09:00","activity":"Snorkeling expedition","weather_dependency":True,"tide_dependency":"low"},{"time":"14:00","activity":"Marine life identification","weather_dependency":True}],
    "heritage":    [{"time":"08:00","activity":"Temple/Fort heritage walk","weather_dependency":False},{"time":"11:00","activity":"Archaeological site visit","weather_dependency":False}],
    "family":      [{"time":"08:30","activity":"Beach morning walk & breakfast","weather_dependency":False},{"time":"10:30","activity":"Beach games & sandcastle building","weather_dependency":False},{"time":"16:00","activity":"Sunset at beach with snacks","weather_dependency":False}],
    "pilgrimage":  [{"time":"06:00","activity":"Morning puja at seafront temple","weather_dependency":False},{"time":"10:00","activity":"Sacred bathing ghat ritual","weather_dependency":False}],
    "eco":         [{"time":"06:30","activity":"Turtle nesting site tour (guide required)","weather_dependency":False},{"time":"09:00","activity":"Mangrove boat safari","weather_dependency":True},{"time":"16:00","activity":"Marine conservation volunteer activity","weather_dependency":False}],
}

def _build_days(days_count: int, interests: list[str], destination: str) -> list[dict]:
    from datetime import date, timedelta
    today = date.today()
    result = []
    for d in range(days_count):
        activities = []
        for interest in (interests or ["family"]):
            templates = TEMPLATE_ACTIVITIES.get(interest, TEMPLATE_ACTIVITIES["family"])
            for t in templates[:2]:
                activities.append({
                    "id": str(uuid.uuid4())[:8],
                    "time": t["time"],
                    "activity": t["activity"],
                    "location": destination,
                    "beach_id": None,
                    "status": "scheduled",
                    "weather_dependency": t.get("weather_dependency", False),
                    "tide_dependency": t.get("tide_dependency"),
                    "agent_notes": None,
                })
        # Standard meals
        activities += [
            {"id": str(uuid.uuid4())[:8],"time":"07:30","activity":"Breakfast at beachside cafe","location":destination,"status":"scheduled","weather_dependency":False,"tide_dependency":None,"agent_notes":None},
            {"id": str(uuid.uuid4())[:8],"time":"13:00","activity":"Fresh seafood lunch at local restaurant","location":destination,"status":"scheduled","weather_dependency":False,"tide_dependency":None,"agent_notes":None},
            {"id": str(uuid.uuid4())[:8],"time":"19:30","activity":"Sunset dinner & evening stroll","location":destination,"status":"scheduled","weather_dependency":False,"tide_dependency":None,"agent_notes":None},
        ]
        activities.sort(key=lambda x: x["time"])
        result.append({"date": str(today + timedelta(days=d)), "items": activities})
    return result

@router.get("/user/{user_id}")
async def list_itineraries(user_id: str):
    db = _load()
    user_its = [v for v in db.values() if v.get("user_id") == user_id]
    user_its.sort(key=lambda x: x.get("created_at",""), reverse=True)
    return {"itineraries": user_its}

@router.post("")
async def create_itinerary(req: ItineraryCreate):
    db = _load()
    iid = str(uuid.uuid4())
    it = {
        "id": iid, "user_id": req.user_id, "title": req.title,
        "destination": req.destination, "status": "active",
        "days": _build_days(req.days, req.interests, req.destination),
        "mutations": [], "created_at": datetime.now(timezone.utc).isoformat(),
    }
    db[iid] = it
    _save(db)
    return it

@router.get("/{itinerary_id}")
async def get_itinerary(itinerary_id: str):
    db = _load()
    it = db.get(itinerary_id)
    if not it: raise HTTPException(404, "Itinerary not found")
    return it

@router.post("/{itinerary_id}/agent-mutate")
async def agent_mutate(itinerary_id: str, req: MutateRequest):
    db = _load()
    it = db.get(itinerary_id)
    if not it: raise HTTPException(404, "Itinerary not found")
    mutations = []
    for day in it["days"]:
        for item in day["items"]:
            if item["id"] not in req.affected_item_ids: continue
            sev = req.hazard.get("max_severity","MEDIUM")
            if sev == "CRITICAL":
                item["status"] = "cancelled"; action = "cancelled"
            else:
                from datetime import datetime as DT, timedelta as TD
                try:
                    t = DT.strptime(item["time"],"%H:%M") + TD(hours=4)
                    item["time"] = t.strftime("%H:%M")
                except Exception: pass
                item["status"] = "rescheduled"; action = "rescheduled"
            msg = req.hazard.get("hazards",[{}])[0].get("message","Marine hazard alert") if req.hazard.get("hazards") else "Marine hazard alert"
            item["agent_notes"] = f"Auto-{action} by Marine Safety Agent. Reason: {msg} (Severity: {sev})"
            mutations.append({"item_id":item["id"],"action":action,"reason":msg,"agent":"marine_safety_agent","timestamp":datetime.now(timezone.utc).isoformat()})
    it["mutations"].extend(mutations)
    if any(m["action"]=="cancelled" for m in mutations): it["status"] = "emergency_pivoted"
    db[itinerary_id] = it
    _save(db)
    return {"mutated_count":len(mutations),"mutations":mutations,"itinerary_status":it["status"]}

@router.get("/{itinerary_id}/mutations")
async def get_mutations(itinerary_id: str):
    db = _load()
    it = db.get(itinerary_id)
    if not it: raise HTTPException(404, "Itinerary not found")
    return {"mutations": it.get("mutations",[])}
