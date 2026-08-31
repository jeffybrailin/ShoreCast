"use client";
import { useShorecastStore } from "@/lib/store";
import TelemetryCard from "./TelemetryCard";

export default function WeatherPanel() {
  const { selectedBeach } = useShorecastStore();
  if (!selectedBeach) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#444]">
        <svg className="w-10 h-10 mb-3 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 12h18M3 6c0 8.284 3.134 15 9 15s9-6.716 9-15" />
        </svg>
        <p className="text-sm">Click a beach on the map</p>
        <p className="text-xs mt-1">to view live telemetry</p>
      </div>
    );
  }
  const s = selectedBeach;
  const score = s.live_suitability?.score ?? s.suitability_score;
  const comp = s.live_suitability?.components ?? {};
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white text-sm">{s.name}</h3>
        <span className="text-[10px] text-[#666]">{s.state}</span>
      </div>
      <TelemetryCard title="Suitability Score" value={score?.toFixed(0) ?? "—"} unit="/100" score={score} subtitle={s.live_suitability?.category ?? "Live"} />
      <div className="grid grid-cols-2 gap-2">
        <TelemetryCard title="Wave Height" value={(comp.wave_height_m as number)?.toFixed(1) ?? "—"} unit="m" />
        <TelemetryCard title="UV Index" value={(comp.uv_index as number)?.toFixed(0) ?? "—"} />
        <TelemetryCard title="Wind" value={(comp.wind_speed_kmh as number)?.toFixed(0) ?? "—"} unit="km/h" />
        <TelemetryCard title="Alert" value={String(comp.alert_severity ?? "LOW")} />
      </div>
      {s.alerts && s.alerts.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] text-[#666] uppercase tracking-wider">Active Alerts</p>
          {s.alerts.map((a, i) => (
            <div key={i} className="text-[11px] text-orange-400 bg-orange-950/20 border border-orange-900/30 rounded p-2 leading-relaxed">
              {a.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
