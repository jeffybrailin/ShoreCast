"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, Star, ExternalLink, Phone, Globe, RefreshCw, SlidersHorizontal, X } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { Waves } from "lucide-react";

const API = "http://localhost:8000";

const CATEGORIES = [
  { id: "all",        label: "All",         icon: "🗺️" },
  { id: "hotel",      label: "Hotels",      icon: "🏨" },
  { id: "restaurant", label: "Restaurants", icon: "🍽️" },
  { id: "mall",       label: "Malls",       icon: "🛍️" },
  { id: "attraction", label: "Attractions", icon: "🎯" },
];

const RATINGS = [
  { label: "Any",  value: 0   },
  { label: "2★+",  value: 2.0 },
  { label: "3★+",  value: 3.0 },
  { label: "4★+",  value: 4.0 },
  { label: "4.5★+",value: 4.5 },
];

const RADII = [
  { label: "2 km",  value: 2  },
  { label: "5 km",  value: 5  },
  { label: "10 km", value: 10 },
  { label: "20 km", value: 20 },
];

interface Place {
  id: string; name: string; category: string; type_label: string;
  rating: number; review_count: number; address: string;
  phone: string; website: string; is_open: boolean | null;
  distance_m: number; photos: string[]; cover_photo: string | null;
  gradient: string; maps_url: string; source: string; price_level: number;
}

function StarRow({ rating, count }: { rating: number; count: number }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array(full).fill(0).map((_,i)  => <Star key={`f${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
        {half && <Star className="w-3 h-3 fill-amber-400 text-amber-400 opacity-60" />}
        {Array(empty).fill(0).map((_,i) => <Star key={`e${i}`} className="w-3 h-3 text-gray-300" />)}
      </div>
      <span className="text-[10px] font-bold" style={{ color: "var(--c-muted)" }}>
        {rating > 0 ? rating.toFixed(1) : "N/A"}
        {count > 0 && ` (${count.toLocaleString()})`}
      </span>
    </div>
  );
}

function PriceLevel({ level }: { level: number }) {
  if (!level) return null;
  return (
    <span className="text-[10px] font-bold" style={{ color: "var(--c-muted)" }}>
      {"₹".repeat(level)}{"₹".repeat(Math.max(0, 4 - level)).split("").map(() => <span key={Math.random()} className="opacity-20">₹</span>)}
    </span>
  );
}

function PlaceCard({ place }: { place: Place }) {
  const [imgError, setImgError] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const distLabel = place.distance_m < 1000
    ? `${place.distance_m}m`
    : `${(place.distance_m / 1000).toFixed(1)} km`;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
      {/* Photo / gradient */}
      <div className="relative h-44 overflow-hidden shrink-0">
        {place.cover_photo && !imgError ? (
          <img
            src={place.cover_photo}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white text-4xl" style={{ background: place.gradient }}>
            <span>{CATEGORIES.find(c => c.id === place.category)?.icon ?? "📍"}</span>
            <span className="text-xs mt-2 font-semibold opacity-80">{place.type_label}</span>
          </div>
        )}
        {/* Multiple photos strip */}
        {place.photos.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {place.photos.slice(0, 4).map((_, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIdx ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
            {place.type_label}
          </span>
          {place.is_open === true  && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-500 text-white">Open</span>}
          {place.is_open === false && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">Closed</span>}
        </div>
        <div className="absolute top-2 right-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", color: "white" }}>
            <MapPin className="w-2.5 h-2.5" />{distLabel}
          </span>
        </div>
        {place.source === "osm" && (
          <div className="absolute bottom-2 right-2">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.7)" }}>OSM</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="text-sm font-black leading-tight" style={{ color: "var(--c-text)" }}>{place.name}</h3>
          <StarRow rating={place.rating} count={place.review_count} />
        </div>
        {place.address && (
          <p className="text-[11px] leading-snug line-clamp-2" style={{ color: "var(--c-muted)" }}>
            📍 {place.address}
          </p>
        )}
        <div className="flex gap-2 mt-auto pt-1">
          <a href={place.maps_url} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "#4285F4" }}>
            <ExternalLink className="w-3 h-3" /> Maps
          </a>
          {place.phone && (
            <a href={`tel:${place.phone}`}
              className="flex items-center justify-center px-3 py-2 rounded-xl"
              style={{ background: "var(--c-hover)", border: "1px solid var(--c-border)" }}>
              <Phone className="w-3.5 h-3.5" style={{ color: "var(--c-muted)" }} />
            </a>
          )}
          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2 rounded-xl"
              style={{ background: "var(--c-hover)", border: "1px solid var(--c-border)" }}>
              <Globe className="w-3.5 h-3.5" style={{ color: "var(--c-muted)" }} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
      <div className="h-44" style={{ background: "var(--c-hover)" }} />
      <div className="p-3 space-y-2">
        <div className="h-4 rounded-lg w-3/4" style={{ background: "var(--c-hover)" }} />
        <div className="h-3 rounded-lg w-1/2" style={{ background: "var(--c-hover)" }} />
        <div className="h-3 rounded-lg w-full" style={{ background: "var(--c-hover)" }} />
        <div className="h-8 rounded-xl w-full mt-2" style={{ background: "var(--c-hover)" }} />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [places, setPlaces]         = useState<Place[]>([]);
  const [loading, setLoading]       = useState(false);
  const [category, setCategory]     = useState("all");
  const [minRating, setMinRating]   = useState(0);
  const [radius, setRadius]         = useState(5);
  const [pos, setPos]               = useState<{ lat: number; lon: number } | null>(null);
  const [locError, setLocError]     = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [noApi, setNoApi]           = useState(false);
  const [source, setSource]         = useState("");
  const hasFetched = useRef(false);

  const fetchPlaces = useCallback(async (p: { lat: number; lon: number }, cat: string, rat: number, rad: number) => {
    setLoading(true); setNoApi(false);
    try {
      const url = `${API}/api/places/nearby?lat=${p.lat}&lon=${p.lon}&category=${cat}&radius_km=${rad}&min_rating=${rat}&limit=30`;
      const r = await fetch(url);
      const d = await r.json();
      setPlaces(d.results ?? []);
      setSource(d.source ?? "");
    } catch {
      setNoApi(true);
      setPlaces([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        const coords = { lat: p.coords.latitude, lon: p.coords.longitude };
        setPos(coords);
        if (!hasFetched.current) {
          hasFetched.current = true;
          fetchPlaces(coords, category, minRating, radius);
        }
      },
      () => setLocError(true)
    );
  }, [fetchPlaces, category, minRating, radius]);

  const refresh = () => {
    if (pos) fetchPlaces(pos, category, minRating, radius);
  };

  const onCategory = (cat: string) => {
    setCategory(cat);
    if (pos) fetchPlaces(pos, cat, minRating, radius);
  };

  const onRating = (r: number) => {
    setMinRating(r);
    if (pos) fetchPlaces(pos, category, r, radius);
  };

  const onRadius = (r: number) => {
    setRadius(r);
    if (pos) fetchPlaces(pos, category, minRating, r);
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--c-bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 pt-3 pb-0" style={{ background: "var(--c-card)", borderBottom: "1px solid var(--c-border)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FBBF24,#06B6D4)" }}>
              <span className="text-sm">🗺️</span>
            </div>
            <div>
              <h1 className="text-sm font-black" style={{ color: "var(--c-text)" }}>Explore Nearby</h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>
                {pos ? `${radius}km radius` : "Getting location..."}
                {source === "google" && " · Google Places"}
                {source === "osm" && " · OpenStreetMap"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(s => !s)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl"
              style={{ background: showFilters ? "#FBBF24" : "var(--c-hover)", color: showFilters ? "#0F172A" : "var(--c-muted)", border: "1px solid var(--c-border)" }}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
            </button>
            <button onClick={refresh} disabled={loading || !pos}
              className="p-2 rounded-xl disabled:opacity-40"
              style={{ background: "var(--c-hover)", border: "1px solid var(--c-border)" }}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} style={{ color: "var(--c-muted)" }} />
            </button>
            <Link href="/dashboard"><Waves className="w-4 h-4" style={{ color: "var(--c-muted)" }} /></Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => onCategory(c.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all"
              style={category === c.id
                ? { background: "#FBBF24", color: "#0F172A" }
                : { background: "var(--c-hover)", color: "var(--c-muted)", border: "1px solid var(--c-border)" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="sticky top-[105px] z-30 px-4 py-3 space-y-3" style={{ background: "var(--c-card)", borderBottom: "1px solid var(--c-border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black" style={{ color: "var(--c-text)" }}>Filters</span>
            <button onClick={() => setShowFilters(false)}><X className="w-4 h-4" style={{ color: "var(--c-muted)" }} /></button>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Min Rating</p>
            <div className="flex gap-2">
              {RATINGS.map(r => (
                <button key={r.value} onClick={() => onRating(r.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={minRating === r.value
                    ? { background: "#FBBF24", color: "#0F172A" }
                    : { background: "var(--c-hover)", color: "var(--c-muted)", border: "1px solid var(--c-border)" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Search Radius</p>
            <div className="flex gap-2">
              {RADII.map(r => (
                <button key={r.value} onClick={() => onRadius(r.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={radius === r.value
                    ? { background: "#06B6D4", color: "white" }
                    : { background: "var(--c-hover)", color: "var(--c-muted)", border: "1px solid var(--c-border)" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* API key notice */}
        {!noApi && source === "osm" && (
          <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl text-xs"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#92400E" }}>
            <span className="shrink-0">💡</span>
            <span>
              Add <code className="font-mono px-1 rounded" style={{ background: "rgba(251,191,36,0.2)" }}>GOOGLE_PLACES_API_KEY</code> to <strong>apps/api/.env</strong> for real photos, accurate ratings, and opening hours from Google Maps.
            </span>
          </div>
        )}

        {locError && (
          <div className="mb-4 text-center py-8 space-y-2">
            <p className="text-2xl">📍</p>
            <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>Location Required</p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>Please enable location access to find nearby places.</p>
          </div>
        )}

        {noApi && (
          <div className="mb-4 text-center py-8 space-y-2">
            <p className="text-2xl">⚠️</p>
            <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>API Server Offline</p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>Run the FastAPI backend to see nearby places.</p>
          </div>
        )}

        {/* Results count */}
        {!loading && places.length > 0 && (
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--c-muted)" }}>
            {places.length} place{places.length !== 1 ? "s" : ""} found
            {minRating > 0 && ` · ${minRating}★+ only`}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : places.map(p => <PlaceCard key={p.id} place={p} />)
          }
        </div>

        {!loading && !locError && !noApi && places.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-3xl">{CATEGORIES.find(c => c.id === category)?.icon ?? "🗺️"}</p>
            <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>No {category === "all" ? "places" : CATEGORIES.find(c=>c.id===category)?.label} found</p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>Try increasing the radius or lowering the rating filter.</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
