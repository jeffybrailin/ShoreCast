import { getBeachById, ALL_BEACHES } from "@/lib/beaches-data";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  ArrowLeft, Waves, MessageSquare, Hotel, UtensilsCrossed,
  Landmark, Star, MapPin, Calendar, Tag, ExternalLink,
  Wind, Thermometer, Sun, Activity, Sailboat, PersonStanding,
} from "lucide-react";
import Link from "next/link";

interface TideEntry { time: string; height_m: number; activity: string; Icon: React.ElementType; color: string }

function generateTides(score: number): { date: string; tides: TideEntry[] }[] {
  const today = new Date();
  return Array.from({ length: 3 }, (_, dayIdx) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayIdx);
    const label = dayIdx === 0 ? "Today" : dayIdx === 1 ? "Tomorrow"
      : d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
    const base = 0.6 + (score / 200);
    return {
      date: label,
      tides: [
        { time: "06:00", height_m: parseFloat((base + 0.8).toFixed(2)), activity: "Surfing",  Icon: Activity,        color: "#F59E0B" },
        { time: "12:30", height_m: parseFloat((base - 0.3).toFixed(2)), activity: "Swimming", Icon: PersonStanding,  color: "#06B6D4" },
        { time: "19:00", height_m: parseFloat((base + 1.1).toFixed(2)), activity: "Kayaking", Icon: Sailboat,        color: "#8B5CF6" },
      ],
    };
  });
}

function NearbyCard({ item, color, icon: Icon }: {
  item: { name: string; type: string; rating: number; distance: string; description: string; mapsQuery: string };
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl p-4 card-hover"
      style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight" style={{ color: "var(--c-text)", fontFamily: "var(--font-display)" }}>
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${color}12`, color }}>
                {item.type}
              </span>
              <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "var(--c-muted)" }}>
                <MapPin className="w-2.5 h-2.5" /> {item.distance}
              </span>
            </div>
          </div>
        </div>
        {item.rating > 0 && (
          <span className="flex items-center gap-0.5 text-xs font-black shrink-0"
            style={{ color: "#F59E0B" }}>
            <Star className="w-3 h-3 fill-current" /> {item.rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--c-muted)" }}>{item.description}</p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl w-fit"
        style={{ background: "#4285F420", color: "#4285F4" }}
      >
        <ExternalLink className="w-3 h-3" /> Open in Maps
      </a>
    </div>
  );
}

export async function generateStaticParams() {
  return ALL_BEACHES.map(b => ({ id: b.id }));
}

export default async function BeachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beach = getBeachById(id) ?? ALL_BEACHES[0];

  const score = beach.suitability_score;
  const tides = generateTides(score);
  const { hotels, restaurants, famousPlaces } = beach.nearby;

  const scoreColor = score >= 75 ? "#10B981" : score >= 50 ? "#F97316" : "#EF4444";
  const scoreLabel = score >= 75 ? "SAFE" : score >= 50 ? "CAUTION" : "DANGER";

  const miniStats = [
    { label: "Wave Height", value: (1.2 + score / 100).toFixed(1), unit: "m",     Icon: Waves,       color: "#06B6D4" },
    { label: "Wind Speed",  value: String(15 + Math.floor((100 - score) / 5)),     unit: "km/h", Icon: Wind,        color: "#8B5CF6" },
    { label: "UV Index",    value: String(Math.floor(3 + (100 - score) / 20)),     unit: "",     Icon: Sun,         color: "#F59E0B" },
    { label: "Temp",        value: String(26 + Math.floor(score / 20)),             unit: "°C",   Icon: Thermometer, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={beach.heroImage}
          alt={beach.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe pt-4">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-semibold glass-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full glass-sm text-white/90">
              {beach.state}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${scoreColor}CC`, color: "white" }}>
              {scoreLabel} · {score}/100
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg leading-tight"
            style={{ fontFamily: "var(--font-display)" }}>
            {beach.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-white/80 text-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-400">{beach.rating.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-1 text-white/70 text-xs">
              <Calendar className="w-3 h-3" /> Best: {beach.best_season}
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-5 pb-28 md:pb-8 space-y-6">

        {/* Description */}
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(6,182,212,0.1))", border: "1px solid rgba(245,158,11,0.2)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#F59E0B" }}>About</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--c-text)" }}>{beach.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {beach.tags.map(tag => (
            <span key={tag}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}>
              <Tag className="w-2.5 h-2.5" />
              {tag.replace(/_/g, " ")}
            </span>
          ))}
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-2">
          {miniStats.map(({ label, value, unit, Icon, color }) => (
            <div key={label} className="rounded-2xl p-3 text-center glass"
              style={{ border: "1px solid var(--c-border)" }}>
              <div className="flex justify-center mb-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>
              <p className="text-base font-black" style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
                {value}<span className="text-xs font-normal" style={{ color: "var(--c-muted)" }}>{unit}</span>
              </p>
              <p className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "var(--c-muted)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Suitability bar */}
        <div className="rounded-2xl p-4" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black uppercase tracking-wide" style={{ color: "var(--c-text)" }}>Suitability Score</p>
            <span className="text-xl font-black" style={{ fontFamily: "var(--font-display)", color: scoreColor }}>
              {score}<span className="text-sm font-normal">/100</span>
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--c-hover)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${score}%`, background: scoreColor }} />
          </div>
          <p className="text-[10px] mt-2" style={{ color: "var(--c-muted)" }}>
            {score >= 75 ? "Excellent conditions for swimming, water sports, and beach activities."
              : score >= 50 ? "Moderate conditions — exercise caution, especially for children and non-swimmers."
              : "Poor conditions — avoid entering the water. Strong currents or rough seas."}
          </p>
        </div>

        {/* Tides */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
            <Waves className="w-4 h-4" style={{ color: "#06B6D4" }} /> Tide Windows
          </h2>
          <div className="space-y-3">
            {tides.map((day) => (
              <div key={day.date}>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--c-muted)" }}>{day.date}</p>
                <div className="grid grid-cols-3 gap-2">
                  {day.tides.map((t) => (
                    <div key={t.time} className="rounded-2xl p-3 text-center glass"
                      style={{ border: "1px solid var(--c-border)" }}>
                      <div className="flex justify-center mb-2">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${t.color}18` }}>
                          <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                        </div>
                      </div>
                      <p className="text-xs font-bold font-mono" style={{ color: "var(--c-text)" }}>{t.time}</p>
                      <p className="text-xs font-semibold" style={{ color: "#06B6D4" }}>{t.height_m}m</p>
                      <p className="text-[9px] mt-0.5" style={{ color: "var(--c-muted)" }}>{t.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NEARBY HOTELS ──────────────────────────────── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
            <Hotel className="w-4 h-4" style={{ color: "#F59E0B" }} /> Nearby Hotels
          </h2>
          <div className="space-y-3">
            {hotels.map(h => (
              <NearbyCard key={h.name} item={h} color="#F59E0B" icon={Hotel} />
            ))}
          </div>
        </div>

        {/* ── NEARBY RESTAURANTS ─────────────────────────── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
            <UtensilsCrossed className="w-4 h-4" style={{ color: "#06B6D4" }} /> Restaurants & Food
          </h2>
          <div className="space-y-3">
            {restaurants.map(r => (
              <NearbyCard key={r.name} item={r} color="#06B6D4" icon={UtensilsCrossed} />
            ))}
          </div>
        </div>

        {/* ── FAMOUS PLACES ──────────────────────────────── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wide mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
            <Landmark className="w-4 h-4" style={{ color: "#8B5CF6" }} /> Famous Places Nearby
          </h2>
          <div className="space-y-3">
            {famousPlaces.map(p => (
              <NearbyCard key={p.name} item={p} color="#8B5CF6" icon={Landmark} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/chat"
            className="flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#F59E0B,#F97316)", color: "white" }}>
            <MessageSquare className="w-4 h-4" /> Ask AI
          </Link>
          <Link href="/explore"
            className="flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>
            <Waves className="w-4 h-4" /> Explore More
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
