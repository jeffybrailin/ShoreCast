import { fetchBeaches } from "@/lib/api";
import RatingHistogram from "@/components/beach/RatingHistogram";
import SuitabilityBadge from "@/components/beach/SuitabilityBadge";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ArrowLeft, Waves, MessageSquare, Menu, Hotel, UtensilsCrossed, Landmark } from "lucide-react";
import Link from "next/link";

const FALLBACK_BEACHES = [
  { id:"1",  name:"Marina Beach",     state:"Tamil Nadu",     lat:13.0500, lon:80.2785, suitability_score:72 },
  { id:"2",  name:"Juhu Beach",       state:"Maharashtra",    lat:19.1075, lon:72.8264, suitability_score:58 },
  { id:"3",  name:"Calangute Beach",  state:"Goa",            lat:15.5440, lon:73.7553, suitability_score:80 },
  { id:"4",  name:"Radhanagar Beach", state:"Andaman",        lat:11.9916, lon:92.9762, suitability_score:91 },
  { id:"5",  name:"Puri Beach",       state:"Odisha",         lat:19.7979, lon:85.8245, suitability_score:65 },
  { id:"6",  name:"Kovalam Beach",    state:"Kerala",         lat:8.3988,  lon:76.9827, suitability_score:83 },
  { id:"7",  name:"Rushikonda Beach", state:"Andhra Pradesh", lat:17.7760, lon:83.3800, suitability_score:87 },
  { id:"8",  name:"Varkala Beach",    state:"Kerala",         lat:8.7379,  lon:76.7163, suitability_score:76 },
  { id:"9",  name:"Diu Beach",        state:"Diu",            lat:20.7142, lon:70.9878, suitability_score:78 },
  { id:"10", name:"Tarkarli Beach",   state:"Maharashtra",    lat:16.0167, lon:73.4698, suitability_score:85 },
];

const DESCRIPTIONS: Record<string,string> = {
  "1":"Marina Beach in Chennai, India's longest and the world's second-longest beach, stretches 12 km from Besant Nagar to Fort St. George.",
  "2":"Juhu Beach in Mumbai is a popular stretch of shoreline known for its vibrant street food scene, sunsets, and celebrity sightings.",
  "3":"Calangute Beach is Goa's most popular beach, with bustling markets, water sports, and a lively nightlife scene.",
  "4":"Radhanagar Beach on Havelock Island is ranked among Asia's best beaches, known for its pristine white sands and turquoise waters.",
  "5":"Puri Beach in Odisha is one of India's most sacred shores, home to the famous Rath Yatra and stunning sunrise views.",
  "6":"Kovalam Beach in Kerala is a crescent-shaped cove famous for its lighthouse, Ayurvedic resorts, and serene backwaters.",
  "7":"Rushikonda Beach in Vizag is a clean, scenic beach popular for its calm waters, perfect for swimming and water sports.",
  "8":"Varkala Beach in Kerala sits atop dramatic red cliffs overlooking the Arabian Sea, known for its mineral springs and yoga retreats.",
  "9":"Diu Beach on the Gujarat coast is a tranquil escape with Portuguese heritage, clear blue waters, and excellent seafood.",
  "10":"Tarkarli Beach in Maharashtra is famous for its crystal-clear waters, ideal for scuba diving and snorkeling in the Sindhudurg district.",
};

const HERO_IMAGES: Record<string,string> = {
  "1":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "4":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
  "6":"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
};

interface TideEntry { time: string; height_m: number; activity: string; emoji: string }
interface NearbyItem { name: string; rating?: number; type?: string; distance?: string }

// Generate fallback tide data for 3 days
function generateTides(score: number): { date: string; tides: TideEntry[] }[] {
  const today = new Date();
  return Array.from({ length: 3 }, (_, dayIdx) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayIdx);
    const label = dayIdx === 0 ? "Today" : dayIdx === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
    const base = 0.6 + (score / 200);
    return {
      date: label,
      tides: [
        { time: "06:00", height_m: parseFloat((base + 0.8).toFixed(2)), activity: "Surfing", emoji: "🏄" },
        { time: "12:30", height_m: parseFloat((base - 0.3).toFixed(2)), activity: "Swimming", emoji: "🏊" },
        { time: "19:00", height_m: parseFloat((base + 1.1).toFixed(2)), activity: "Kayaking", emoji: "🛶" },
      ],
    };
  });
}

function generateNearby(beachName: string): { hotels: NearbyItem[]; restaurants: NearbyItem[]; attractions: NearbyItem[] } {
  return {
    hotels: [
      { name: `${beachName} Grand Resort`, rating: 4.5, type: "5-star", distance: "0.4 km" },
      { name: "SeaBreeze Inn", rating: 4.1, type: "3-star", distance: "0.9 km" },
      { name: "Coastal Heritage Hotel", rating: 4.3, type: "4-star", distance: "1.2 km" },
    ],
    restaurants: [
      { name: "The Fisherman's Catch", rating: 4.6, type: "Seafood", distance: "0.3 km" },
      { name: "Sunset Dhaba", rating: 4.2, type: "Indian", distance: "0.5 km" },
      { name: "Blue Lagoon Café", rating: 4.4, type: "Multi-cuisine", distance: "0.8 km" },
    ],
    attractions: [
      { name: "Lighthouse View Point", type: "Landmark", distance: "1.1 km" },
      { name: "Fishermen's Village Walk", type: "Cultural", distance: "0.6 km" },
      { name: "Coastal Nature Trail", type: "Eco", distance: "1.5 km" },
    ],
  };
}

export default async function BeachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let beach = FALLBACK_BEACHES.find((b) => b.id === id) ?? FALLBACK_BEACHES[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let apiDetail: any = null;
  try {
    const data = await fetchBeaches();
    if (data.beaches?.length > 0) {
      const found = data.beaches.find((b: { id:string }) => b.id === id);
      if (found) beach = found;
    }
    // Try to get detail data for nearby / tides
    const detailRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/beaches/${id}`, { cache: "no-store" });
    if (detailRes.ok) apiDetail = await detailRes.json();
  } catch { /* fallback */ }

  const score = beach.suitability_score;
  const description = DESCRIPTIONS[id] ?? `${beach.name} is a beautiful beach located in ${beach.state}, India.`;
  const heroImage = HERO_IMAGES[id] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
  const rating = parseFloat((4.0 + (score / 100) * 0.9).toFixed(1));

  const miniStats = [
    { label:"Wave Height", value:(1.2 + score/100).toFixed(1), unit:"m" },
    { label:"Wind Speed",  value:String(15 + Math.floor((100-score)/5)), unit:"km/h" },
    { label:"UV Index",    value:String(Math.floor(3 + (100-score)/20)), unit:"" },
  ];

  const tides: { date: string; tides: TideEntry[] }[] = apiDetail?.tides ?? generateTides(score);
  const nearby: { hotels: NearbyItem[]; restaurants: NearbyItem[]; attractions: NearbyItem[] } =
    apiDetail?.nearby ?? generateNearby(beach.name);

  return (
    <div className="min-h-screen" style={{ background:"var(--c-bg)" }}>

      {/* Hero */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden">
        <img src={heroImage} alt={beach.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, rgba(15,23,42,0.5) 0%, transparent 40%, rgba(15,23,42,0.75) 100%)" }} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
          <Link href="/dashboard" className="p-2 rounded-xl text-white backdrop-blur-sm"
            style={{ background:"rgba(0,0,0,0.35)" }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-white font-bold text-base drop-shadow-lg">{beach.name}</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle className="backdrop-blur-sm" />
            <button className="p-2 rounded-xl text-white backdrop-blur-sm" style={{ background:"rgba(0,0,0,0.35)" }}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p className="text-white/80 text-xs font-semibold">{beach.state}, India</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4 pb-24 md:pb-8 space-y-4">

        {/* Description */}
        <div className="rounded-2xl p-4" style={{ background:"#FBBF24" }}>
          <p className="text-xs font-black uppercase tracking-wide mb-1" style={{ color:"#0F172A" }}>Description:</p>
          <p className="text-sm font-medium leading-relaxed" style={{ color:"#0F172A" }}>{description}</p>
        </div>

        {/* Rating histogram */}
        <RatingHistogram averageRating={rating} totalReviews={Math.floor(score*3.5)}
          recommendedPercent={Math.min(98, Math.floor(score*1.05))}
          distribution={{ 5:Math.floor(score*2), 4:Math.floor(score*0.5), 3:Math.floor(score*0.15), 2:Math.floor(score*0.07), 1:Math.floor(score*0.03) }} />

        {/* Write a review */}
        <button className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl text-sm transition-all active:scale-95"
          style={{ background:"var(--c-text)", color:"var(--c-bg)" }}>
          <MessageSquare className="w-4 h-4" />
          Write a review
        </button>

        {/* Suitability score */}
        <SuitabilityBadge score={score} size="md" />

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3">
          {miniStats.map(({ label, value, unit }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background:"var(--c-card)", border:"1px solid var(--c-border)" }}>
              <p className="text-[9px] uppercase tracking-wider font-semibold mb-1" style={{ color:"var(--c-muted)" }}>{label}</p>
              <p className="text-lg font-black font-mono" style={{ color:"var(--c-text)" }}>
                {value}<span className="text-xs ml-0.5" style={{ color:"var(--c-muted)" }}>{unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ── Tide Windows ── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color:"var(--c-text)" }}>
            <Waves className="w-4 h-4" style={{ color:"#06B6D4" }} /> Tide Windows
          </h2>
          <div className="space-y-3">
            {tides.map((day) => (
              <div key={day.date}>
                <p className="text-xs font-bold mb-2" style={{ color:"var(--c-muted)" }}>{day.date}</p>
                <div className="grid grid-cols-3 gap-2">
                  {day.tides.map((t) => (
                    <div
                      key={t.time}
                      className="rounded-2xl p-3 text-center"
                      style={{ background:"var(--c-card)", border:"1px solid var(--c-border)" }}
                    >
                      <p className="text-lg mb-0.5">{t.emoji}</p>
                      <p className="text-[10px] font-bold font-mono" style={{ color:"var(--c-text)" }}>{t.time}</p>
                      <p className="text-[10px] font-semibold" style={{ color:"#06B6D4" }}>{t.height_m}m</p>
                      <p className="text-[9px] mt-0.5" style={{ color:"var(--c-muted)" }}>{t.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nearby Hotels ── */}
        {nearby.hotels.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color:"var(--c-text)" }}>
              <Hotel className="w-4 h-4" style={{ color:"#FBBF24" }} /> Nearby Hotels
            </h2>
            <div className="space-y-2">
              {nearby.hotels.map((h) => (
                <div
                  key={h.name}
                  className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{ background:"var(--c-card)", border:"1px solid var(--c-border)" }}
                >
                  <div>
                    <p className="text-sm font-bold" style={{ color:"var(--c-text)" }}>{h.name}</p>
                    <p className="text-xs" style={{ color:"var(--c-muted)" }}>{h.type} &middot; {h.distance}</p>
                  </div>
                  {h.rating && (
                    <span className="text-xs font-black px-2 py-1 rounded-xl" style={{ background:"#FBBF2420", color:"#FBBF24" }}>
                      &#9733; {h.rating}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Nearby Restaurants ── */}
        {nearby.restaurants.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color:"var(--c-text)" }}>
              <UtensilsCrossed className="w-4 h-4" style={{ color:"#06B6D4" }} /> Nearby Restaurants
            </h2>
            <div className="space-y-2">
              {nearby.restaurants.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{ background:"var(--c-card)", border:"1px solid var(--c-border)" }}
                >
                  <div>
                    <p className="text-sm font-bold" style={{ color:"var(--c-text)" }}>{r.name}</p>
                    <p className="text-xs" style={{ color:"var(--c-muted)" }}>{r.type} &middot; {r.distance}</p>
                  </div>
                  {r.rating && (
                    <span className="text-xs font-black px-2 py-1 rounded-xl" style={{ background:"#06B6D420", color:"#06B6D4" }}>
                      &#9733; {r.rating}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tourist Attractions ── */}
        {nearby.attractions.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color:"var(--c-text)" }}>
              <Landmark className="w-4 h-4" style={{ color:"#8b5cf6" }} /> Tourist Attractions
            </h2>
            <div className="space-y-2">
              {nearby.attractions.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{ background:"var(--c-card)", border:"1px solid var(--c-border)" }}
                >
                  <div>
                    <p className="text-sm font-bold" style={{ color:"var(--c-text)" }}>{a.name}</p>
                    <p className="text-xs" style={{ color:"var(--c-muted)" }}>{a.type} &middot; {a.distance}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-xl" style={{ background:"#8b5cf620", color:"#8b5cf6" }}>
                    Visit
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Chat CTA */}
        <Link href="/chat"
          className="flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-2xl text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background:"linear-gradient(135deg,#FBBF24,#F59E0B)", color:"#0F172A" }}>
          <Waves className="w-4 h-4" />
          Ask AI about this beach
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
