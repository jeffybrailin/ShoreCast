import { fetchBeaches } from "@/lib/api";
import WeatherPanel from "@/components/dashboard/WeatherPanel";
import AlertBanner from "@/components/dashboard/AlertBanner";
import SearchBar from "@/components/dashboard/SearchBar";
import HeroBanner from "@/components/dashboard/HeroBanner";
import BeachCard from "@/components/dashboard/BeachCard";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Waves, Activity, Map, Bell } from "lucide-react";
import Link from "next/link";

const FALLBACK_BEACHES = [
  { id:"1",  name:"Marina Beach",      state:"Tamil Nadu",      lat:13.0500, lon:80.2785, suitability_score:72, rating:4.5, distanceKm:4.5,  weather:{rainPercent:2,  tempC:31, tideLevel:"High Tide"} },
  { id:"2",  name:"Juhu Beach",        state:"Maharashtra",     lat:19.1075, lon:72.8264, suitability_score:58, rating:3.8, distanceKm:12.1, weather:{rainPercent:5,  tempC:29, tideLevel:"Low Tide"} },
  { id:"3",  name:"Calangute Beach",   state:"Goa",             lat:15.5440, lon:73.7553, suitability_score:80, rating:4.7, distanceKm:8.3,  weather:{rainPercent:10, tempC:28, tideLevel:"Mid Tide"} },
  { id:"4",  name:"Radhanagar Beach",  state:"Andaman",         lat:11.9916, lon:92.9762, suitability_score:91, rating:4.9, distanceKm:22.0, weather:{rainPercent:1,  tempC:27, tideLevel:"Low Tide"} },
  { id:"5",  name:"Puri Beach",        state:"Odisha",          lat:19.7979, lon:85.8245, suitability_score:65, rating:4.0, distanceKm:5.6,  weather:{rainPercent:8,  tempC:30, tideLevel:"High Tide"} },
  { id:"6",  name:"Kovalam Beach",     state:"Kerala",          lat:8.3988,  lon:76.9827, suitability_score:83, rating:4.6, distanceKm:15.2, weather:{rainPercent:3,  tempC:26, tideLevel:"Mid Tide"} },
  { id:"7",  name:"Rushikonda Beach",  state:"Andhra Pradesh",  lat:17.7760, lon:83.3800, suitability_score:87, rating:4.7, distanceKm:9.8,  weather:{rainPercent:2,  tempC:28, tideLevel:"Low Tide"} },
  { id:"8",  name:"Varkala Beach",     state:"Kerala",          lat:8.7379,  lon:76.7163, suitability_score:76, rating:4.4, distanceKm:11.5, weather:{rainPercent:6,  tempC:27, tideLevel:"High Tide"} },
  { id:"9",  name:"Diu Beach",         state:"Diu",             lat:20.7142, lon:70.9878, suitability_score:78, rating:4.3, distanceKm:6.2,  weather:{rainPercent:0,  tempC:32, tideLevel:"Mid Tide"} },
  { id:"10", name:"Tarkarli Beach",    state:"Maharashtra",     lat:16.0167, lon:73.4698, suitability_score:85, rating:4.8, distanceKm:18.7, weather:{rainPercent:4,  tempC:27, tideLevel:"Low Tide"} },
];

export default async function DashboardPage() {
  let beaches: typeof FALLBACK_BEACHES = FALLBACK_BEACHES;
  try {
    const data = await fetchBeaches();
    if (data.beaches && data.beaches.length > 0) {
      beaches = data.beaches.map((b: { id:string; name:string; state:string; lat:number; lon:number; suitability_score:number }) => ({
        ...b,
        rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        distanceKm: parseFloat((Math.random() * 25 + 1).toFixed(1)),
        weather: {
          rainPercent: Math.floor(Math.random() * 15),
          tempC: 27 + Math.floor(Math.random() * 6),
          tideLevel: ["High Tide","Low Tide","Mid Tide"][Math.floor(Math.random() * 3)],
        },
      }));
    }
  } catch { /* fallback */ }

  const safeCount    = beaches.filter((b) => b.suitability_score >= 75).length;
  const cautionCount = beaches.filter((b) => b.suitability_score < 75).length;
  const topBeaches   = [...beaches].sort((a,b) => b.suitability_score - a.suitability_score).slice(0, 6);

  const statItems = [
    { label:"Beaches", value:beaches.length, color:"#06B6D4" },
    { label:"Safe",    value:safeCount,       color:"#22C55E" },
    { label:"Caution", value:cautionCount,    color:"#F97316" },
  ];

  const legendItems = [
    { color:"#0ea5e9", label:"SAFE",     range:"75-100" },
    { color:"#f97316", label:"CAUTION",  range:"50-74"  },
    { color:"#dc2626", label:"DANGER",   range:"25-49"  },
    { color:"#7c3aed", label:"CRITICAL", range:"0-24"   },
  ];

  return (
    <div className="min-h-screen" style={{ background:"var(--c-bg)" }}>

      {/* ── DESKTOP HEADER ──────────────────────────────────── */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 sticky top-0 z-40"
        style={{ background:"var(--c-card)", borderBottom:"1px solid var(--c-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#FBBF24,#06B6D4)" }}>
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest" style={{ color:"var(--c-text)" }}>SHORECAST</h1>
            <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color:"var(--c-muted)" }}>Agentic Coastal Intelligence</p>
          </div>
        </div>
        <nav className="flex items-center gap-5">
          <Link href="/dashboard" className="text-xs font-bold flex items-center gap-1.5" style={{ color:"#F59E0B" }}>
            <Map className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <Link href="/chat" className="text-xs font-semibold flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color:"var(--c-muted)" }}>
            <Activity className="w-3.5 h-3.5" /> AI Agent
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
          </div>
          <ThemeToggle />
        </nav>
      </header>

      {/* ── MOBILE HEADER ───────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 px-4 pt-4 pb-3"
        style={{ background:"var(--c-card)", borderBottom:"1px solid var(--c-border)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#FBBF24,#06B6D4)" }}>
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black" style={{ color:"var(--c-text)" }}>
              Shore<span style={{ color:"#F59E0B" }}>cast</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 rounded-xl" style={{ background:"var(--c-hover)" }}>
              <Bell className="w-4 h-4" style={{ color:"var(--c-muted)" }} />
            </button>
          </div>
        </div>
        <SearchBar placeholder="Search beaches..." />
      </header>

      {/* ── ALERT BANNER ────────────────────────────────────── */}
      <div className="px-4 md:px-6 pt-3"><AlertBanner /></div>

      {/* ── MAIN LAYOUT ─────────────────────────────────────── */}
      <div className="md:flex md:h-[calc(100vh-64px)] md:overflow-hidden">

        {/* Beach list sidebar */}
        <div className="md:w-96 md:overflow-y-auto flex-shrink-0"
          style={{ borderRight:"1px solid var(--c-border)", background:"var(--c-bg)" }}>

          {/* Desktop search */}
          <div className="hidden md:block p-4" style={{ borderBottom:"1px solid var(--c-border)" }}>
            <SearchBar placeholder="Search beaches..." />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center px-4 py-3"
            style={{ borderBottom:"1px solid var(--c-border)", background:"var(--c-card)" }}>
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="py-1">
                <p className="text-xl font-black" style={{ color }}>{value}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color:"var(--c-muted)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Hero */}
          <div className="px-4 py-3">
            <HeroBanner title="Top Rated Beaches Near You"
              imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" />
          </div>

          {/* Cards */}
          <div className="px-4 pb-24 md:pb-4 space-y-3">
            {topBeaches.map((beach) => (
              <BeachCard key={beach.id} id={beach.id} name={beach.name} state={beach.state}
                distanceKm={beach.distanceKm} suitabilityScore={beach.suitability_score}
                rating={beach.rating} weather={beach.weather} />
            ))}
          </div>
        </div>

        {/* Map + weather (desktop) */}
        <div className="hidden md:flex flex-1 overflow-hidden justify-center items-center">
          <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
            <div className="w-full h-full rounded-2xl flex items-center justify-center bg-opacity-50" style={{ border:"1px dashed var(--c-border)", background:"var(--c-hover)" }}>
               <p className="text-sm font-semibold" style={{ color:"var(--c-muted)" }}>Map removed as requested.</p>
            </div>
          </div>

          {/* Weather sidebar */}
          <div className="w-72 flex flex-col overflow-y-auto"
            style={{ borderLeft:"1px solid var(--c-border)", background:"var(--c-card)" }}>
            <div className="p-4 flex-1"><WeatherPanel /></div>

            {/* Legend */}
            <div className="p-4" style={{ borderTop:"1px solid var(--c-border)" }}>
              <p className="text-[9px] uppercase tracking-wider mb-2 font-semibold" style={{ color:"var(--c-muted)" }}>Suitability Legend</p>
              <div className="space-y-1.5">
                {legendItems.map(({ color, label, range }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor:color }} />
                    <span className="text-xs font-semibold" style={{ color:"var(--c-text)" }}>{label}</span>
                    <span className="text-xs font-mono ml-auto" style={{ color:"var(--c-subtle)" }}>{range}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3" style={{ borderTop:"1px solid var(--c-border)" }}>
                <Link href="/chat"
                  className="flex items-center justify-center gap-2 w-full text-white text-xs py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                  style={{ background:"linear-gradient(135deg,#FBBF24,#F59E0B)", color:"#0F172A" }}>
                  <Activity className="w-3.5 h-3.5" /> Open AI Agent Chat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile map link removed */}

      <BottomNav />
    </div>
  );
}