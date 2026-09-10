"use client";
import { useState, useEffect } from "react";
import { X, Phone, ShieldAlert, MapPin, Loader2 } from "lucide-react";

interface Station { name: string; station_type: string; distance_km: number; mobile: string[]; landline: string[]; address: string }

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("general");
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true); setSent(false); setMsg("");
    navigator.geolocation?.getCurrentPosition(
      async (p) => {
        const lat = p.coords.latitude, lon = p.coords.longitude;
        setPos({ lat, lon });
        try {
          const r = await fetch(`http://localhost:8000/api/sos/nearest?lat=${lat}&lon=${lon}&limit=1`);
          const d = await r.json();
          setStation(d.stations?.[0] ?? null);
        } catch { setStation(null); }
        setLoading(false);
      },
      () => { setLoading(false); }
    );
  }, [open]);

  const dispatch = async () => {
    if (!pos) return;
    setLoading(true);
    try {
      const r = await fetch("http://localhost:8000/api/sos/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "demo_user", lat: pos.lat, lon: pos.lon, emergency_type: type, message: msg }),
      });
      const d = await r.json();
      setSent(true);
      alert(`✅ SOS Dispatched!\n${d.message}\n\nStation: ${d.station?.name ?? "N/A"}\nEmergency: Call 112`);
      setOpen(false);
    } catch { alert("⚠️ Could not reach API. Call 112 directly."); }
    setLoading(false);
  };

  return (
    <>
      {/* Persistent SOS button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg font-black text-sm text-white"
        style={{ background: "#DC2626", boxShadow: "0 0 0 4px rgba(220,38,38,0.3)" }}
        aria-label="Emergency SOS"
      >
        <span className="text-base">🆘</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl p-5 space-y-4" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-black" style={{ color: "var(--c-text)" }}>Emergency SOS</h2>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: "var(--c-muted)" }}><X className="w-5 h-5" /></button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--c-muted)" }}>
                <Loader2 className="w-4 h-4 animate-spin" /> Locating nearest station...
              </div>
            )}

            {pos && (
              <div className="flex items-center gap-2 text-xs rounded-xl px-3 py-2" style={{ background: "var(--c-hover)", color: "var(--c-muted)" }}>
                <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span>GPS: {pos.lat.toFixed(5)}, {pos.lon.toFixed(5)}</span>
              </div>
            )}

            {station && (
              <div className="rounded-xl p-3 space-y-1" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <p className="text-xs font-bold text-red-600">Nearest Station ({station.distance_km} km)</p>
                <p className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>{station.name}</p>
                <p className="text-xs" style={{ color: "var(--c-muted)" }}>{station.address}</p>
                <div className="flex gap-2 mt-2">
                  {[...station.mobile, ...station.landline].slice(0,2).map(num => (
                    <a key={num} href={`tel:${num}`}
                      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl"
                      style={{ background: "#DC2626", color: "white" }}>
                      <Phone className="w-3 h-3" /> {num}
                    </a>
                  ))}
                  <a href="tel:112" className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl" style={{ background: "#7C3AED", color: "white" }}>
                    <Phone className="w-3 h-3" /> 112
                  </a>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--c-muted)" }}>Emergency Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>
                {["drowning","medical","lost","crime","general"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--c-muted)" }}>Additional Info (optional)</label>
              <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe the situation..."
                className="w-full rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "var(--c-hover)", color: "var(--c-muted)" }}>Cancel</button>
              <button onClick={dispatch} disabled={loading || !pos}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50"
                style={{ background: "#DC2626" }}>
                {loading ? "Dispatching..." : "🆘 DISPATCH SOS"}
              </button>
            </div>
            <p className="text-center text-xs font-medium" style={{ color: "var(--c-subtle)" }}>
              Always call <strong>112</strong> for immediate life-threatening emergencies
            </p>
          </div>
        </div>
      )}
    </>
  );
}
