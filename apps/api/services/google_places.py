"""
Google Places API (New) service with OpenStreetMap Overpass fallback.
Falls back to OSM when GOOGLE_PLACES_API_KEY is not set.
"""
import httpx, asyncio, logging, math
from typing import Optional
from config import get_settings

logger = logging.getLogger(__name__)

PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby"
PLACES_PHOTO_URL  = "https://places.googleapis.com/v1/{name}/media"

CATEGORY_TYPES = {
    "hotel":       ["lodging", "hotel", "motel", "resort_hotel", "guest_house"],
    "restaurant":  ["restaurant", "food", "cafe", "bar", "seafood_restaurant", "meal_takeaway"],
    "mall":        ["shopping_mall", "department_store", "market", "supermarket"],
    "attraction":  ["tourist_attraction", "museum", "park", "amusement_park", "place_of_worship",
                    "historic_site", "landmark", "art_gallery", "aquarium", "zoo"],
    "all":         ["lodging", "restaurant", "shopping_mall", "tourist_attraction", "cafe"],
}

OSM_AMENITY_MAP = {
    "hotel":      ["hotel", "hostel", "guest_house", "motel", "resort"],
    "restaurant": ["restaurant", "cafe", "bar", "fast_food", "food_court"],
    "mall":       ["marketplace", "supermarket"],
    "attraction": ["attraction", "museum", "place_of_worship", "viewpoint", "park"],
    "all":        ["hotel", "restaurant", "cafe", "marketplace", "attraction", "museum"],
}

OSM_TOURISM_MAP = {
    "hotel":      ["hotel", "hostel", "guest_house", "motel"],
    "restaurant": [],
    "mall":       [],
    "attraction": ["attraction", "museum", "viewpoint", "artwork", "theme_park", "zoo"],
    "all":        ["hotel", "attraction", "museum", "viewpoint"],
}

PRICE_TO_STARS = {0: None, 1: 2.0, 2: 3.0, 3: 4.0, 4: 5.0}

def _haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371000.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def _make_photo_url(photo_name: str, api_key: str, size: int = 400) -> str:
    return f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx={size}&maxWidthPx={size}&key={api_key}&skipHttpRedirect=true"

def _category_gradient(category: str) -> str:
    GRAD = {
        "hotel":      "linear-gradient(135deg,#1e3a5f,#2563eb)",
        "restaurant": "linear-gradient(135deg,#7c2d12,#f97316)",
        "mall":       "linear-gradient(135deg,#4a044e,#a855f7)",
        "attraction": "linear-gradient(135deg,#064e3b,#10b981)",
        "all":        "linear-gradient(135deg,#1e293b,#0ea5e9)",
    }
    return GRAD.get(category, GRAD["all"])

async def search_nearby_google(
    lat: float, lon: float,
    category: str = "all",
    radius_m: int = 5000,
    min_rating: float = 0.0,
    max_results: int = 20,
    api_key: str = "",
) -> list[dict]:
    types = CATEGORY_TYPES.get(category, CATEGORY_TYPES["all"])
    body = {
        "includedTypes": types[:5],
        "maxResultCount": min(max_results, 20),
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lon},
                "radius": float(radius_m),
            }
        },
        "rankPreference": "DISTANCE",
    }
    if min_rating > 0:
        body["minRating"] = min_rating

    field_mask = ",".join([
        "places.id", "places.displayName", "places.rating",
        "places.userRatingCount", "places.formattedAddress",
        "places.photos", "places.currentOpeningHours", "places.priceLevel",
        "places.websiteUri", "places.internationalPhoneNumber",
        "places.location", "places.primaryTypeDisplayName",
    ])

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                PLACES_SEARCH_URL,
                json=body,
                headers={
                    "X-Goog-Api-Key": api_key,
                    "X-Goog-FieldMask": field_mask,
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
            data = resp.json()

        results = []
        for p in data.get("places", []):
            loc = p.get("location", {})
            dist = _haversine(lat, lon, loc.get("latitude", lat), loc.get("longitude", lon))
            photos = p.get("photos", [])
            photo_urls = [_make_photo_url(ph["name"], api_key) for ph in photos[:4]]
            rating = p.get("rating", 0.0)
            if min_rating > 0 and rating < min_rating:
                continue
            results.append({
                "id":           p.get("id", ""),
                "name":         p.get("displayName", {}).get("text", "Unknown"),
                "category":     category,
                "type_label":   p.get("primaryTypeDisplayName", {}).get("text", category.title()),
                "rating":       round(rating, 1),
                "review_count": p.get("userRatingCount", 0),
                "address":      p.get("formattedAddress", ""),
                "phone":        p.get("internationalPhoneNumber", ""),
                "website":      p.get("websiteUri", ""),
                "is_open":      p.get("currentOpeningHours", {}).get("openNow"),
                "price_level":  p.get("priceLevel", 0),
                "lat":          loc.get("latitude", lat),
                "lon":          loc.get("longitude", lon),
                "distance_m":   round(dist),
                "photos":       photo_urls,
                "cover_photo":  photo_urls[0] if photo_urls else None,
                "gradient":     _category_gradient(category),
                "maps_url":     f"https://www.google.com/maps/place/?q=place_id:{p.get('id','')}",
                "source":       "google",
            })
        results.sort(key=lambda x: x["distance_m"])
        return results

    except Exception as e:
        logger.warning(f"Google Places API failed: {e}")
        return []

async def search_nearby_osm(
    lat: float, lon: float,
    category: str = "all",
    radius_m: int = 5000,
    min_rating: float = 0.0,
    max_results: int = 20,
) -> list[dict]:
    """Fallback: OpenStreetMap Overpass API — no photos, estimated ratings from stars tag."""
    amenities = OSM_AMENITY_MAP.get(category, OSM_AMENITY_MAP["all"])
    tourism   = OSM_TOURISM_MAP.get(category, OSM_TOURISM_MAP["all"])

    amenity_filter = "|".join(amenities)
    tourism_filter = "|".join(tourism) if tourism else ""

    query = f"""
[out:json][timeout:15];
(
  node[amenity~"^({amenity_filter})$"](around:{radius_m},{lat},{lon});
  way[amenity~"^({amenity_filter})$"](around:{radius_m},{lat},{lon});
  {"node[tourism~'^("+tourism_filter+")$'](around:"+str(radius_m)+","+str(lat)+","+str(lon)+");way[tourism~'^("+tourism_filter+")$'](around:"+str(radius_m)+","+str(lat)+","+str(lon)+");" if tourism_filter else ""}
);
out center {max_results};
"""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://overpass-api.de/api/interpreter",
                data={"data": query},
            )
            resp.raise_for_status()
            elements = resp.json().get("elements", [])
    except Exception as e:
        logger.warning(f"OSM fallback failed: {e}")
        return []

    results = []
    for el in elements:
        tags = el.get("tags", {})
        if not tags.get("name"):
            continue
        elat = el.get("lat") or el.get("center", {}).get("lat", lat)
        elon = el.get("lon") or el.get("center", {}).get("lon", lon)
        dist = _haversine(lat, lon, elat, elon)

        # Estimate rating from OSM stars tag (hotels) or tourism grade
        osm_stars = tags.get("stars") or tags.get("star_rating")
        est_rating = float(osm_stars) if osm_stars and osm_stars.replace(".","").isdigit() else 3.5
        if min_rating > 0 and est_rating < min_rating:
            continue

        name = tags.get("name", "Unknown")
        amenity = tags.get("amenity") or tags.get("tourism") or category
        results.append({
            "id":           str(el.get("id", "")),
            "name":         name,
            "category":     category,
            "type_label":   amenity.replace("_", " ").title(),
            "rating":       round(est_rating, 1),
            "review_count": 0,
            "address":      ", ".join(filter(None, [
                                tags.get("addr:housenumber",""),
                                tags.get("addr:street",""),
                                tags.get("addr:city",""),
                            ])) or tags.get("addr:full",""),
            "phone":        tags.get("phone","") or tags.get("contact:phone",""),
            "website":      tags.get("website","") or tags.get("contact:website",""),
            "is_open":      None,
            "price_level":  0,
            "lat":          elat,
            "lon":          elon,
            "distance_m":   round(dist),
            "photos":       [],
            "cover_photo":  None,
            "gradient":     _category_gradient(category),
            "maps_url":     f"https://www.google.com/maps/search/?api=1&query={elat},{elon}",
            "source":       "osm",
        })

    results.sort(key=lambda x: (-x["rating"], x["distance_m"]))
    return results[:max_results]

async def search_nearby(
    lat: float, lon: float,
    category: str = "all",
    radius_m: int = 5000,
    min_rating: float = 0.0,
    max_results: int = 20,
) -> list[dict]:
    """Main entry point — uses Google if key available, else OSM."""
    settings = get_settings()
    api_key = getattr(settings, "google_places_api_key", "") or ""
    if api_key:
        results = await search_nearby_google(lat, lon, category, radius_m, min_rating, max_results, api_key)
        if results:
            return results
        logger.info("Google Places returned empty — falling back to OSM")
    return await search_nearby_osm(lat, lon, category, radius_m, min_rating, max_results)
