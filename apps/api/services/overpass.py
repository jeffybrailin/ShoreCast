import httpx
import logging
from cache.redis_client import cache_get, cache_set

logger = logging.getLogger(__name__)
OVERPASS_API = "https://overpass-api.de/api/interpreter"


async def query_amenities(
    lat: float,
    lon: float,
    amenity_type: str = "hotel",
    radius_m: int = 5000,
    max_results: int = 20,
) -> list[dict]:
    cache_key = f"overpass:{lat:.3f}:{lon:.3f}:{amenity_type}:{radius_m}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="{amenity_type}"](around:{radius_m},{lat},{lon});
      way["amenity"="{amenity_type}"](around:{radius_m},{lat},{lon});
    );
    out body center {max_results};
    """

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(OVERPASS_API, data=query)
            resp.raise_for_status()
            elements = resp.json().get("elements", [])
            results = []
            for el in elements:
                tags = el.get("tags", {})
                coords = el.get("center") or el
                results.append({
                    "id": el.get("id"),
                    "name": tags.get("name", "Unknown"),
                    "amenity": amenity_type,
                    "lat": coords.get("lat"),
                    "lon": coords.get("lon"),
                    "tags": tags,
                    "cuisine": tags.get("cuisine"),
                    "website": tags.get("website"),
                    "phone": tags.get("phone"),
                })
            await cache_set(cache_key, results, ttl=3600)
            return results
    except Exception as e:
        logger.error(f"Overpass query failed: {e}")
        return []


async def query_tourist_attractions(lat: float, lon: float, radius_m: int = 10000) -> list[dict]:
    query = f"""
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|viewpoint|museum|beach"](around:{radius_m},{lat},{lon});
    );
    out body center 30;
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(OVERPASS_API, data=query)
            resp.raise_for_status()
            elements = resp.json().get("elements", [])
            return [{
                "id": el.get("id"),
                "name": el.get("tags", {}).get("name", "Unknown"),
                "tourism": el.get("tags", {}).get("tourism"),
                "lat": el.get("lat") or el.get("center", {}).get("lat"),
                "lon": el.get("lon") or el.get("center", {}).get("lon"),
                "tags": el.get("tags", {}),
            } for el in elements]
    except Exception as e:
        logger.error(f"Overpass tourist query failed: {e}")
        return []
