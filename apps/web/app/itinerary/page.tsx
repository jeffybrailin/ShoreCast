"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Plus, ChevronDown, ChevronUp, Bot, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { Waves } from "lucide-react";

const API = "http://localhost:8000";
const USER_ID = "demo_user";

interface ActivityItem { id: string; time: string; activity: string; location: string; status: string; agent_notes: string | null; weather_dependency: boolean }
interface ItineraryDay { date: string; items: ActivityItem[] }
interface Itinerary { id: string; title: string; destination: string; status: string; days: ItineraryDay[]; mutations: object[]; created_at: string }

const STATUS_ICON: Record<string, React.ReactNode> = {
  scheduled: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  rescheduled: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  cancelled: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  completed: <CheckCircle className="w-3.5 h-3.5 text-blue-500" />,
};
const STATUS_COLOR: Record<string, string> = { scheduled: "rgba(34,197,94,0.12)", rescheduled: "rgba(251,191,36,0.12)", cancelled: "rgba(220,38,38,0.12)", completed: "rgba(59,130,246,0.12)" };

const INTERESTS = ["surfing","snorkeling","heritage","family","pilgrimage","eco","party"];
const STATES = ["Goa","Kerala","Maharashtra","Tamil Nadu","Andhra Pradesh","Karnataka","Gujarat","West Bengal","Odisha","Puducherry","Andaman and Nicobar","Lakshadweep"];

export default function ItineraryPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", destination: "Goa", days: 3, interests: ["family"] });

  const load = async () => {
    try {
      const r = await fetch(`${API}/api/itinerary/user/${USER_ID}`);
      const d = await r.json();
      setItineraries(d.itineraries || []);
    } catch { /* offline */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title) return;
    setCreating(true);
    try {
      const r = await fetch(`${API}/api/itinerary`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, ...form }),
      });
      const it = await r.json();
      setItineraries(prev => [it, ...prev]);
      setShowCreate(false);
      setExpanded(it.id);
    } catch { alert("Could not connect to API. Start the backend first."); }
    setCreating(false);
  };

  const toggleInterest = (i: string) => {
    setForm(f => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x=>x!==i) : [...f.interests, i] }));
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--c-bg)" }}>
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: "var(--c-card)", borderBottom: "1px solid var(--c-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FBBF24,#06B6D4)" }}>
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black" style={{ color: "var(--c-text)" }}>My Itineraries</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>AI Trip Planner</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard"><Waves className="w-4 h-4" style={{ color: "var(--c-muted)" }} /></Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <button onClick={() => setShowCreate(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black" style={{ background: "#FBBF24", color: "#0F172A" }}>
          <Plus className="w-4 h-4" /> Plan a New Coastal Trip
        </button>

        {/* Create modal */}
        {showCreate && (
          <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--c-card)", border: "2px solid #FBBF24" }}>
            <h3 className="text-sm font-black" style={{ color: "var(--c-text)" }}>✈️ New Coastal Itinerary</h3>
            <input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Trip title (e.g. Goa Adventure 2025)"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--c-muted)" }}>Destination</label>
                <select value={form.destination} onChange={e => setForm({...form,destination:e.target.value})}
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none" style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--c-muted)" }}>Days</label>
                <select value={form.days} onChange={e => setForm({...form,days:Number(e.target.value)})}
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none" style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>
                  {[1,2,3,4,5,6,7].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--c-muted)" }}>Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full capitalize transition-all"
                    style={form.interests.includes(i)
                      ? { background: "#FBBF24", color: "#0F172A" }
                      : { background: "var(--c-hover)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{ background: "var(--c-hover)", color: "var(--c-muted)" }}>Cancel</button>
              <button onClick={create} disabled={creating || !form.title} className="flex-1 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50" style={{ background: "#0F172A" }}>
                {creating ? "Creating..." : "Create Trip ✈️"}
              </button>
            </div>
          </div>
        )}

        {loading && <p className="text-sm text-center py-8" style={{ color: "var(--c-muted)" }}>Loading itineraries...</p>}

        {!loading && itineraries.length === 0 && !showCreate && (
          <div className="text-center py-12 space-y-3">
            <p className="text-4xl">🏖️</p>
            <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>No trips planned yet</p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>Create a trip above, or ask the AI to plan one for you</p>
            <Link href="/chat" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "#0F172A" }}>
              <Bot className="w-4 h-4" /> Ask AI to Plan
            </Link>
          </div>
        )}

        {itineraries.map(it => (
          <div key={it.id} className="rounded-2xl overflow-hidden" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
            <button className="w-full px-4 py-4 flex items-start justify-between gap-3" onClick={() => setExpanded(expanded===it.id ? null : it.id)}>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${it.status==="emergency_pivoted" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{it.status.replace("_"," ").toUpperCase()}</span>
                  {it.mutations.length > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{it.mutations.length} agent update{it.mutations.length>1?"s":""}</span>}
                </div>
                <p className="text-sm font-black" style={{ color: "var(--c-text)" }}>{it.title}</p>
                <p className="text-xs" style={{ color: "var(--c-muted)" }}>{it.destination} · {it.days.length} day{it.days.length>1?"s":""}</p>
              </div>
              {expanded===it.id ? <ChevronUp className="w-4 h-4 mt-1 shrink-0" style={{ color: "var(--c-muted)" }} /> : <ChevronDown className="w-4 h-4 mt-1 shrink-0" style={{ color: "var(--c-muted)" }} />}
            </button>

            {expanded===it.id && (
              <div className="border-t px-4 pb-4 space-y-4" style={{ borderColor: "var(--c-border)" }}>
                {it.days.map((day, di) => (
                  <div key={di}>
                    <p className="text-xs font-black uppercase tracking-wider py-2" style={{ color: "var(--c-muted)" }}>
                      Day {di+1} — {new Date(day.date).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}
                    </p>
                    <div className="space-y-2">
                      {day.items.map(item => (
                        <div key={item.id} className="flex gap-3 rounded-xl px-3 py-2.5" style={{ background: STATUS_COLOR[item.status] || "var(--c-hover)" }}>
                          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                            <div className="flex items-center gap-1 text-[10px] font-black" style={{ color: "var(--c-muted)" }}>
                              <Clock className="w-2.5 h-2.5" />{item.time}
                            </div>
                            {STATUS_ICON[item.status]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate" style={{ color: "var(--c-text)" }}>{item.activity}</p>
                            {item.agent_notes && (
                              <p className="text-[10px] mt-0.5 font-medium" style={{ color: item.status==="cancelled" ? "#DC2626" : "#D97706" }}>
                                ⚠️ {item.agent_notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
