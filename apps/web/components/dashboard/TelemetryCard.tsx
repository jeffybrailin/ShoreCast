"use client";
import { getSuitabilityColor, getSuitabilityLabel } from "@/lib/mapConfig";

interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  score?: number;
}

export default function TelemetryCard({ title, value, unit, subtitle, score }: TelemetryCardProps) {
  const color = score !== undefined ? getSuitabilityColor(score) : "#06B6D4";
  const label = score !== undefined ? getSuitabilityLabel(score) : null;
  return (
    <div className="rounded-xl p-3 transition-all"
      style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
      <p className="text-[9px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: "var(--c-muted)" }}>{title}</p>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black font-mono" style={{ color: score !== undefined ? color : "var(--c-text)" }}>
          {value}
        </span>
        {unit && <span className="text-xs mb-0.5 font-medium" style={{ color: "var(--c-muted)" }}>{unit}</span>}
      </div>
      {label && (
        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 text-white"
          style={{ backgroundColor: color }}>
          {label}
        </span>
      )}
      {subtitle && <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--c-subtle)" }}>{subtitle}</p>}
    </div>
  );
}