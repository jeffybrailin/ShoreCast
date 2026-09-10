"""Nearby Places router — Google Places API + OSM fallback."""
import logging
from typing import Optional
from fastapi import APIRouter, Query
from services.google_places import search_nearby

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/places", tags=["places"])

@router.get("/nearby")
async def nearby_places(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    category: str = Query("all", description="hotel|restaurant|mall|attraction|all"),
    radius_km: float = Query(5.0, description="Search radius in km"),
    min_rating: float = Query(0.0, description="Minimum star rating 1.0-5.0"),
    limit: int = Query(20, description="Max results"),
):
    results = await search_nearby(
        lat=lat, lon=lon,
        category=category,
        radius_m=int(radius_km * 1000),
        min_rating=min_rating,
        max_results=min(limit, 40),
    )
    return {
        "results": results,
        "count": len(results),
        "category": category,
        "radius_km": radius_km,
        "min_rating": min_rating,
        "source": results[0]["source"] if results else "none",
    }

@router.get("/categories")
async def list_categories():
    return {
        "categories": [
            {"id": "all",        "label": "All Places",    "icon": "🗺️"},
            {"id": "hotel",      "label": "Hotels",        "icon": "🏨"},
            {"id": "restaurant", "label": "Restaurants",   "icon": "🍽️"},
            {"id": "mall",       "label": "Malls & Shops", "icon": "🛍️"},
            {"id": "attraction", "label": "Attractions",   "icon": "🎯"},
        ]
    }
