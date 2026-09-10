"""Shorecast Agent Tools — All 4 agent toolsets."""
import asyncio
from langchain_core.tools import tool
from services.open_meteo import get_marine_data, get_weather_data
from services.overpass import query_amenities, query_tourist_attractions
from services.incois import get_incois_alerts
from services.suitability import calculate_suitability_score
from services.tides import get_tide_windows
from db.emergency_seed import find_nearest_stations
from data.beaches_india import find_beach, beaches_by_state, BEACHES


@tool
def lookup_beach_by_name(name: str) -> dict:
    """Look up any Indian beach by name to get coordinates and description.
    ALWAYS call this first when user mentions a beach name."""
    beach = find_beach(name)
    if beach:
        return {"found": True, **beach}
    q = name.lower()
    matches = [b for b in BEACHES if q in b["name"].lower() or b["state"].lower() in q][:5]
    if matches:
        return {"found": False, "suggestions": [{"name":b["name"],"state":b["state"],"id":b["id"]} for b in matches]}
    return {"found": False, "message": f"No beach found for '{name}'."}


@tool
def list_beaches_by_state(state: str) -> list:
    """List all known beaches in a given Indian state or union territory."""
    results = beaches_by_state(state)
    if not results: return [{"error": f"No beaches found for: {state}"}]
    return [{"id":b["id"],"name":b["name"],"region":b["region"],"lat":b["lat"],"lon":b["lon"],"tags":b["tags"],"best_season":b["best_season"]} for b in results]


@tool
def get_beach_conditions(lat: float, lon: float, beach_name: str = "") -> dict:
    """Get live marine and weather conditions for a beach location.
    Use AFTER lookup_beach_by_name to get coordinates."""
    loop = asyncio.new_event_loop()
    try:
        marine, weather, alerts = loop.run_until_complete(asyncio.gather(
            get_marine_data(lat, lon, days=3),
            get_weather_data(lat, lon, days=3),
            get_incois_alerts(lat, lon),
        ))
    finally: loop.close()
    wh = (marine or {}).get("hourly",{}).get("wave_height",[1.0])
    uv = (weather or {}).get("hourly",{}).get("uv_index",[3.0])
    ws = (weather or {}).get("hourly",{}).get("wind_speed_10m",[10.0])
    tp = (weather or {}).get("hourly",{}).get("temperature_2m",[28.0])
    cw,cu,cws,ct = (wh[0] if wh else 1.0),(uv[0] if uv else 3.0),(ws[0] if ws else 10.0),(tp[0] if tp else 28.0)
    sev = (alerts[0]["severity"] if alerts else "LOW") if not isinstance(alerts, Exception) else "LOW"
    score = calculate_suitability_score(wave_height=cw, uv_index=cu, alert_severity=sev)
    return {
        "beach_name": beach_name or f"({lat},{lon})",
        "suitability": score, "lat": lat, "lon": lon,
        "marine": {"wave_height_m": round(cw,2), "swell_height_m": (marine or {}).get("hourly",{}).get("swell_wave_height",[0.5])[0] if not isinstance(marine,Exception) else 0.5},
        "weather": {"uv_index": cu, "temperature_c": ct, "wind_speed_kmh": cws},
        "alerts": alerts if not isinstance(alerts, Exception) else [],
    }


@tool
def get_tide_windows_for_beach(beach_name: str) -> dict:
    """Get low-tide windows for the next 3 days at a named Indian beach.
    Use before scheduling tide-pool visits, sea cave exploration, or sandbar crossings."""
    beach = find_beach(beach_name)
    if not beach: return {"error": f"Beach not found: {beach_name}"}
    loop = asyncio.new_event_loop()
    try:
        windows = loop.run_until_complete(get_tide_windows(beach["lat"], beach["lon"], days=3))
    finally: loop.close()
    return {
        "beach": beach["name"], "state": beach["state"],
        "low_tide_windows": windows,
        "tip": "Plan activities during low-tide windows for best access to reefs and caves.",
    }


@tool
def get_nearest_emergency_help(lat: float, lon: float) -> dict:
    """Find the nearest police, marine police, coast guard, and lifeguard stations.
    Use when user asks about safety, emergency contacts, or coastal law enforcement."""
    police = find_nearest_stations(lat, lon, station_type="police", limit=1)
    marine = find_nearest_stations(lat, lon, station_type="marine_police", limit=1)
    coast  = find_nearest_stations(lat, lon, station_type="coast_guard", limit=1)
    life   = find_nearest_stations(lat, lon, station_type="lifeguard", limit=1)
    return {
        "nearest_police":       police[0] if police else None,
        "nearest_marine_police": marine[0] if marine else None,
        "nearest_coast_guard":  coast[0] if coast else None,
        "nearest_lifeguard":    life[0] if life else None,
        "emergency_number":     "112",
        "coastguard_number":    "1554",
    }


@tool
def plan_coastal_itinerary(destination: str, days: int, interests: list) -> dict:
    """Plan a multi-day coastal itinerary for an Indian beach destination.
    Args:
        destination: State or beach name (e.g. 'Goa', 'Kerala', 'Andaman')
        days: Number of days (1-7)
        interests: List from: surfing, snorkeling, heritage, family, pilgrimage, eco, party
    """
    beaches_in_dest = beaches_by_state(destination) or [b for b in BEACHES if destination.lower() in b["name"].lower()]
    if not beaches_in_dest:
        return {"error": f"No beaches found in: {destination}"}
    # Pick beaches matching interests
    interest_tag_map = {"surfing":"surfing","snorkeling":"snorkeling","heritage":"heritage","eco":"turtles","pilgrimage":"pilgrimage","party":"nightlife","family":"family"}
    selected = []
    for interest in interests:
        tag = interest_tag_map.get(interest, interest)
        tagged = [b for b in beaches_in_dest if tag in b.get("tags",[])]
        selected.extend(tagged[:2])
    if not selected: selected = beaches_in_dest[:min(days*2, len(beaches_in_dest))]
    plan = {
        "destination": destination,
        "days": min(days, 7),
        "interests": interests,
        "recommended_beaches": [{"name":b["name"],"region":b["region"],"best_season":b["best_season"],"tags":b["tags"]} for b in selected[:days*2]],
        "daily_structure": {
            "morning": "Beach activity or water sport (tide/weather permitting)",
            "midday": "Heritage/culture visit or rest (avoid peak UV 11am-3pm)",
            "afternoon": "Water sports or marine exploration",
            "evening": "Sunset at beach + local seafood dinner",
        },
        "safety_tips": [
            f"Check suitability score before each water activity",
            f"Best season for {destination}: {beaches_in_dest[0].get('best_season','Oct-Mar') if beaches_in_dest else 'Oct-Mar'}",
            "Save nearest marine police number offline",
            "Never swim alone at unfamiliar beaches",
        ],
        "how_to_book": "Ask me to find hotels, restaurants or transport options near any specific beach.",
    }
    return plan


@tool
def find_nearby_amenities(lat: float, lon: float, amenity_type: str = "restaurant", radius_km: float = 5.0) -> list:
    """Find nearby hotels, restaurants, cafes, or other amenities using OpenStreetMap data."""
    loop = asyncio.new_event_loop()
    try:
        results = loop.run_until_complete(query_amenities(lat, lon, amenity_type, radius_m=int(radius_km*1000)))
    finally: loop.close()
    return results[:15]


@tool
def find_tourist_attractions(lat: float, lon: float, radius_km: float = 10.0) -> list:
    """Find tourist attractions, viewpoints, museums near a location."""
    loop = asyncio.new_event_loop()
    try:
        results = loop.run_until_complete(query_tourist_attractions(lat, lon, radius_m=int(radius_km*1000)))
    finally: loop.close()
    return results


@tool
def calculate_beach_suitability(wave_height: float, uv_index: float, tide_level: float = 1.0, alert_severity: str = "LOW") -> dict:
    """Calculate a coastal safety suitability score (0-100) from environmental parameters."""
    return calculate_suitability_score(wave_height, uv_index, tide_level, alert_severity)


PLANNER_TOOLS = [
    lookup_beach_by_name, list_beaches_by_state,
    get_beach_conditions, get_tide_windows_for_beach,
    get_nearest_emergency_help, plan_coastal_itinerary,
    find_nearby_amenities, find_tourist_attractions,
    calculate_beach_suitability,
]
SENTINEL_TOOLS = [get_beach_conditions, calculate_beach_suitability]
