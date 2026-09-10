"use client";
import { useShorecastStore } from "@/lib/store";
import TelemetryCard from "./TelemetryCard";
import { Waves } from "lucide-react";

export default function WeatherPanel() {
  const { selectedBeach } = useShorecastStore();
  if (!selectedBeach) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
          style={{ background: "var(--c-hover)" }}>
          <Waves className="w-7 h-7" style={{ color: "var(--c-subtle)" }} />
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--c-muted)" }}>Click a beach on the map</p>
        <p className="text-xs mt-1 font-medium" style={{ color: "var(--c-subtle)" }}>to view live telemetry</p>
      </div>
    );
  }
  const s = selectedBeach;
  const score = s.live_suitability?.score ?? s.suitability_score;
  const comp = s.live_suitability?.components ?? {};
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm" style={{ color: "var(--c-text)" }}>{s.name}</h3>
        <span className="text-[10px] font-semibold" style={{ color: "var(--c-muted)" }}>{s.state}</span>
      </div>
      <TelemetryCard title="Suitability Score" value={score?.toFixed(0) ?? "—"} unit="/100" score={score} subtitle={s.live_suitability?.category ?? "Live"} />
      <div className="grid grid-cols-2 gap-2">
        <TelemetryCard title="Wave Height" value={(comp.wave_height_m as number)?.toFixed(1) ?? "—"} unit="m" />
        <TelemetryCard title="UV Index"    value={(comp.uv_index as number)?.toFixed(0) ?? "—"} />
        <TelemetryCard title="Wind"        value={(comp.wind_speed_kmh as number)?.toFixed(0) ?? "—"} unit="km/h" />
        <TelemetryCard title="Alert"       value={String(comp.alert_severity ?? "LOW")} />
      </div>
      {s.alerts && s.alerts.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--c-muted)" }}>Active Alerts</p>
          {s.alerts.map((a, i) => (
            <div key={i} className="text-[11px] rounded-xl p-2 leading-relaxed font-medium"
              style={{ color: "#f97316", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              {a.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}