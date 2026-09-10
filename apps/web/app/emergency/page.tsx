"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, Phone, MapPin, Plus, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { Waves } from "lucide-react";

interface Station { id: string; name: string; station_type: string; distance_km: number; mobile: string[]; landline: string[]; address: string; staffed_24h: boolean }
interface Contact { name: string; phone: string; relation: string }

const TYPE_BADGE: Record<string, string> = { marine_police: "Marine Police", police: "Police", coast_guard: "Coast Guard", lifeguard: "Lifeguard" };
const TYPE_COLOR: Record<string, string> = { marine_police: "#0EA5E9", police: "#6366F1", coast_guard: "#F59E0B", lifeguard: "#10B981" };

const TIPS = [
  { title: "Caught in a Rip Current?", icon: "🌊", steps: ["Don't panic — rip currents won't drag you under","Swim parallel to shore (not against the current)","Once free, swim diagonally back to beach","Wave and yell for lifeguard help"] },
  { title: "Jellyfish Sting?", icon: "🪼", steps: ["Do NOT rub the sting — remove tentacles carefully","Rinse with sea water (not fresh water)","Apply heat pack or hot water (45°C) for 20 min","Seek medical help if breathing is affected"] },
  { title: "Getting Lost at Sea?", icon: "🚤", steps: ["Stay with the vessel — it's easier to spot than a person","Signal with mirror, whistle, or bright cloth","Call coast guard: 1554","Activate EPIRB if available"] },
];

export default function EmergencyPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("shorecast_emergency_contacts");
    if (saved) setContacts(JSON.parse(saved));
    navigator.geolocation?.getCurrentPosition(
      async (p) => {
        try {
          const r = await fetch(`http://localhost:8000/api/sos/nearest?lat=${p.coords.latitude}&lon=${p.coords.longitude}&limit=5`);
          const d = await r.json();
          setStations(d.stations || []);
        } catch { /* fallback */ }
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const saveContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem("shorecast_emergency_contacts", JSON.stringify(updated));
  };
  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    saveContacts([...contacts, newContact]);
    setNewContact({ name: "", phone: "", relation: "" });
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--c-bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: "var(--c-card)", borderBottom: "1px solid var(--c-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black" style={{ color: "var(--c-text)" }}>Coastal Safety</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>Emergency Registry</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard"><Waves className="w-4 h-4" style={{ color: "var(--c-muted)" }} /></Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">
        {/* Emergency Quick Dial */}
        <div className="grid grid-cols-2 gap-3">
          {[{ label:"National Emergency", num:"112", color:"#DC2626" }, { label:"Coast Guard", num:"1554", color:"#0EA5E9" }, { label:"Police", num:"100", color:"#6366F1" }, { label:"Ambulance", num:"108", color:"#10B981" }].map(({label,num,color}) => (
            <a key={num} href={`tel:${num}`} className="flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-white" style={{ background: color }}>
              <span className="text-sm">{label}</span>
              <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /><span className="text-lg font-black">{num}</span></div>
            </a>
          ))}
        </div>

        {/* Nearest Stations */}
        <div>
          <h2 className="text-sm font-black mb-3" style={{ color: "var(--c-text)" }}>📍 Nearest Emergency Stations</h2>
          {loading ? (
            <p className="text-sm" style={{ color: "var(--c-muted)" }}>Locating nearest stations...</p>
          ) : stations.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--c-muted)" }}>Enable location to find nearest stations.</p>
          ) : (
            <div className="space-y-3">
              {stations.map(s => (
                <div key={s.id} className="rounded-2xl p-4 space-y-2" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: TYPE_COLOR[s.station_type] || "#666" }}>{TYPE_BADGE[s.station_type] || s.station_type}</span>
                        {s.staffed_24h && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">24h</span>}
                      </div>
                      <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>{s.name}</p>
                      <p className="text-xs" style={{ color: "var(--c-muted)" }}>{s.address}</p>
                    </div>
                    <div className="text-xs font-bold shrink-0" style={{ color: "#F59E0B" }}>{s.distance_km} km</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...s.mobile, ...s.landline].slice(0,3).map(num => (
                      <a key={num} href={`tel:${num}`} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl"
                        style={{ background: "rgba(220,38,38,0.1)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)" }}>
                        <Phone className="w-3 h-3" /> {num}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personal Emergency Contacts */}
        <div>
          <h2 className="text-sm font-black mb-3" style={{ color: "var(--c-text)" }}>👥 My Emergency Contacts</h2>
          <div className="space-y-2 mb-3">
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>{c.name} <span className="text-xs font-normal" style={{ color: "var(--c-muted)" }}>({c.relation})</span></p>
                  <a href={`tel:${c.phone}`} className="text-xs" style={{ color: "#F59E0B" }}>{c.phone}</a>
                </div>
                <button onClick={() => saveContacts(contacts.filter((_,j) => j!==i))}><Trash2 className="w-4 h-4" style={{ color: "var(--c-subtle)" }} /></button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
            <div className="grid grid-cols-2 gap-2">
              {(["name","phone","relation"] as const).map(field => (
                <input key={field} value={newContact[field]} onChange={e => setNewContact({...newContact,[field]:e.target.value})} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  className={`rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${field==="name" ? "col-span-2" : ""}`}
                  style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }} />
              ))}
            </div>
            <button onClick={addContact} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#FBBF24", color: "#0F172A" }}>
              <Plus className="w-4 h-4" /> Add Contact
            </button>
          </div>
        </div>

        {/* Safety Tips */}
        <div>
          <h2 className="text-sm font-black mb-3" style={{ color: "var(--c-text)" }}>🛟 Coastal Safety Tips</h2>
          <div className="space-y-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
                <button className="w-full flex items-center justify-between px-4 py-3" onClick={() => setExpandedTip(expandedTip===i ? null : i)}>
                  <span className="text-sm font-bold" style={{ color: "var(--c-text)" }}>{tip.icon} {tip.title}</span>
                  {expandedTip===i ? <ChevronUp className="w-4 h-4" style={{ color: "var(--c-muted)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "var(--c-muted)" }} />}
                </button>
                {expandedTip===i && (
                  <div className="px-4 pb-4 space-y-1.5">
                    {tip.steps.map((step,j) => (
                      <div key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--c-text)" }}>
                        <span className="text-amber-500 font-bold shrink-0">{j+1}.</span><span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
