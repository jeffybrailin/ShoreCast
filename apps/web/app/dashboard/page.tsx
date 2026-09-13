"use client";
import { useState, useMemo } from "react";
import { ALL_BEACHES, getStates } from "@/lib/beaches-data";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import {
  Waves, Bot, Compass, Map, ShieldAlert, Search,
  TrendingUp, Sun, Wind, ChevronRight, Sparkles, Bell, Star, X,
} from "lucide-react";

const STATES = ["All", ...getStates()];

function ScorePill({ score }: { score: number }) {
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F97316" : "#EF4444";
  const label = score >= 75 ? "Safe" : score >= 50 ? "Caution" : "Danger";
  return (
    <span
      className="text-[10px] font-black px-2 py-0.5 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {label} {score}
    </span>
  );
}

function BeachCard({ beach }: { beach: typeof ALL_BEACHES[0] }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link href={`/beach/${beach.id}`} className="block card-hover group">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          {!imgError ? (
            <img
              src={beach.heroImage}
              alt={beach.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--g-ocean)" }}>
              <Waves className="w-10 h-10 text-white/60" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          {/* Score pill */}
          <div className="absolute top-2 right-2">
            <ScorePill score={beach.suitability_score} />
          </div>
          {/* State tag */}
          <div className="absolute top-2 left-2">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white glass-sm">
              {beach.region || beach.state}
            </span>
          </div>
          {/* Name on image */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--font-display)" }}>{beach.name}</h3>
            <p className="text-white/70 text-[10px] mt-0.5">{beach.state}</p>
          </div>
        </div>

        {/* Info strip */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold" style={{ color: "var(--c-text)" }}>{beach.rating.toFixed(1)}</span>
            <span className="text-[10px]" style={{ color: "var(--c-subtle)" }}>{beach.best_season}</span>
          </div>
          <div className="flex gap-1">
            {beach.tags.slice(0, 2).map(t => (
              <span key={t} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full capitalize"
                style={{ background: "var(--c-hover)", color: "var(--c-muted)" }}>
                {t.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string | number; label: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-1">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1" style={{ background: `${color}20` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--c-muted)" }}>{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = ALL_BEACHES;
    if (selectedState !== "All") list = list.filter(b => b.state === selectedState);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedState, search]);

  const safeCount = ALL_BEACHES.filter(b => b.suitability_score >= 75).length;
  const topBeaches = [...ALL_BEACHES].sort((a, b) => b.suitability_score - a.suitability_score).slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── DESKTOP HEADER ──────────────────────────────── */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-40 glass"
        style={{ borderBottom: "1px solid var(--c-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#F59E0B,#06B6D4)" }}>
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider" style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
              Shore<span style={{ color: "#F59E0B" }}>cast</span>
            </h1>
            <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>
              Coastal Intelligence · India
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          {[
            { href: "/dashboard", icon: Map, label: "Dashboard", active: true },
            { href: "/explore", icon: Compass, label: "Explore" },
            { href: "/itinerary", icon: TrendingUp, label: "Plan" },
            { href: "/emergency", icon: ShieldAlert, label: "Safety" },
            { href: "/chat", icon: Bot, label: "AI Agent" },
          ].map(({ href, icon: Icon, label, active }) => (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
              style={active
                ? { color: "#F59E0B", background: "rgba(245,158,11,0.1)" }
                : { color: "var(--c-muted)" }
              }>
              <Icon className="w-3.5 h-3.5" /> {label}
            </Link>
          ))}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
          </div>
          <ThemeToggle />
        </nav>
      </header>

      {/* ── MOBILE HEADER ───────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 glass" style={{ borderBottom: "1px solid var(--c-border)" }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#F59E0B,#06B6D4)" }}>
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black" style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
              Shore<span style={{ color: "#F59E0B" }}>cast</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 rounded-xl glass-sm">
              <Bell className="w-4 h-4" style={{ color: "var(--c-muted)" }} />
            </button>
          </div>
        </div>
        {/* Mobile search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "var(--c-hover)", border: "1px solid var(--c-border)" }}>
            <Search className="w-4 h-4 shrink-0" style={{ color: "var(--c-muted)" }} />
            <input
              type="text"
              placeholder="Search beaches, states, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:opacity-60"
              style={{ color: "var(--c-text)" }}
            />
          </div>
        </div>
      </header>

      {/* ── HERO BANNER (mobile only) ────────────────────── */}
      <div className="md:hidden relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0C4A6E 100%)", minHeight: 180 }}>
        {/* Background beach image */}
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"
          alt="beach" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative px-4 py-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">India's #1 Beach Guide</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Discover India's<br /><span className="text-amber-400">Best Beaches</span>
          </h2>
          <p className="text-white/60 text-xs mb-4">{ALL_BEACHES.length} beaches across 12 states & UTs</p>
          {/* Mini stats row */}
          <div className="flex gap-3">
            {[
              { value: ALL_BEACHES.length, label: "Beaches" },
              { value: safeCount, label: "Safe Now" },
              { value: getStates().length, label: "States" },
            ].map(({ value, label }) => (
              <div key={label} className="glass-sm rounded-xl px-3 py-2 text-center">
                <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ──────────────────────────────── */}
      <div className="md:grid md:grid-cols-[1fr_320px] max-w-screen-2xl mx-auto">

        {/* Main column */}
        <div className="min-h-screen">
          {/* Desktop hero */}
          <div className="hidden md:block relative overflow-hidden mx-6 mt-6 rounded-3xl"
            style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0C4A6E 100%)", minHeight: 200 }}>
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
              alt="beach" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="relative px-8 py-8 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">India's Coastal Intelligence</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Discover <span className="text-amber-400">{ALL_BEACHES.length}+</span> Indian Beaches
                </h2>
                <p className="text-white/60 text-sm">Real-time safety scores · Nearby hotels & restaurants · AI planning</p>
              </div>
              <div className="flex gap-4">
                {[
                  { value: ALL_BEACHES.length, label: "Total Beaches", icon: Waves, color: "#06B6D4" },
                  { value: safeCount, label: "Safe Today", icon: Sun, color: "#10B981" },
                  { value: getStates().length, label: "States / UTs", icon: Map, color: "#F59E0B" },
                ].map(({ value, label, icon: Icon, color }) => (
                  <div key={label} className="glass-sm rounded-2xl px-5 py-4 text-center">
                    <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                    <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
                    <p className="text-[9px] text-white/60 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-3 mx-6 mt-4">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
              style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: "var(--c-muted)" }} />
              <input
                type="text"
                placeholder="Search beaches by name, state, or tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: "var(--c-text)" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-0.5 rounded-lg" style={{ color: "var(--c-muted)" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Link href="/chat"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#F59E0B,#06B6D4)" }}>
              <Bot className="w-4 h-4" /> Ask AI
            </Link>
          </div>

          {/* State filter chips */}
          <div className="px-4 md:px-6 mt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {STATES.map(state => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all"
                  style={selectedState === state
                    ? { background: "linear-gradient(135deg,#F59E0B,#06B6D4)", color: "white", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }
                    : { background: "var(--c-card)", color: "var(--c-muted)", border: "1px solid var(--c-border)" }
                  }
                >
                  {state === "All" ? (
                    <span className="flex items-center gap-1.5"><Waves className="w-3 h-3" /> All ({ALL_BEACHES.length})</span>
                  ) : state}
                </button>
              ))}
            </div>
          </div>

          {/* Top Picks (horizontal scroll) */}
          {selectedState === "All" && !search && (
            <div className="px-4 md:px-6 mt-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black uppercase tracking-wide flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Top Rated Picks
                </h2>
                <button className="text-xs font-semibold flex items-center gap-0.5" style={{ color: "#06B6D4" }}>
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                {topBeaches.map((beach, i) => (
                  <Link key={beach.id} href={`/beach/${beach.id}`} className="shrink-0 w-48 group">
                    <div className="rounded-2xl overflow-hidden card-hover"
                      style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
                      <div className="relative h-28 overflow-hidden">
                        <img src={beach.heroImage} alt={beach.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={e => (e.currentTarget.style.display = "none")} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.9)", color: "white" }}>
                          #{i + 1}
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white font-bold text-xs leading-tight truncate">{beach.name}</p>
                        </div>
                      </div>
                      <div className="px-2.5 py-2 flex items-center justify-between">
                        <span className="text-[10px]" style={{ color: "var(--c-muted)" }}>{beach.state}</span>
                        <ScorePill score={beach.suitability_score} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Beach grid */}
          <div className="px-4 md:px-6 mt-5 pb-28 md:pb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black uppercase tracking-wide flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}>
                <Waves className="w-4 h-4" style={{ color: "#06B6D4" }} />
                {selectedState === "All" ? "All Beaches" : `${selectedState} Beaches`}
              </h2>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ background: "var(--c-hover)", color: "var(--c-muted)" }}>
                {filtered.length} found
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
                  <Waves className="w-7 h-7" style={{ color: "var(--c-muted)" }} />
                </div>
                <p className="font-bold" style={{ color: "var(--c-text)" }}>No beaches found</p>
                <p className="text-sm mt-1" style={{ color: "var(--c-muted)" }}>Try a different search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filtered.map(beach => <BeachCard key={beach.id} beach={beach} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── DESKTOP SIDEBAR ──────────────────────────── */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto"
          style={{ borderLeft: "1px solid var(--c-border)", background: "var(--c-card)" }}>
          <div className="p-5 space-y-5">
            {/* Suitability legend */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black mb-3" style={{ color: "var(--c-muted)" }}>
                Suitability Legend
              </p>
              <div className="space-y-2">
                {[
                  { color: "#10B981", label: "SAFE", range: "75–100", desc: "Great conditions" },
                  { color: "#F97316", label: "CAUTION", range: "50–74", desc: "Some risks" },
                  { color: "#EF4444", label: "DANGER", range: "25–49", desc: "Avoid swimming" },
                  { color: "#8B5CF6", label: "CRITICAL", range: "0–24", desc: "Stay away" },
                ].map(({ color, label, range, desc }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl p-2.5"
                    style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black" style={{ color }}>{label}</p>
                      <p className="text-[9px]" style={{ color: "var(--c-muted)" }}>{desc}</p>
                    </div>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: "var(--c-subtle)" }}>{range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black mb-3" style={{ color: "var(--c-muted)" }}>Overview</p>
              <div className="grid grid-cols-2 gap-2">
                <StatCard icon={Waves} value={ALL_BEACHES.length} label="Total Beaches" color="#06B6D4" />
                <StatCard icon={Sun} value={safeCount} label="Safe Today" color="#10B981" />
                <StatCard icon={Map} value={getStates().length} label="States / UTs" color="#F59E0B" />
                <StatCard icon={Wind} value="Live" label="Conditions" color="#8B5CF6" />
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-2">
              {[
                { href: "/chat", icon: Bot, label: "AI Beach Assistant", desc: "Ask anything about beaches", color: "#F59E0B" },
                { href: "/explore", icon: Compass, label: "Explore Nearby", desc: "Hotels, restaurants & more", color: "#06B6D4" },
                { href: "/emergency", icon: ShieldAlert, label: "Safety & Emergency", desc: "Coastal safety info", color: "#EF4444" },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 rounded-2xl p-3 transition-all hover:opacity-90"
                  style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: "var(--c-text)" }}>{label}</p>
                    <p className="text-[10px]" style={{ color: "var(--c-muted)" }}>{desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--c-muted)" }} />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <BottomNav />
    </div>
  );
}