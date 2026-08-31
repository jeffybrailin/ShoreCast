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
  const color = score !== undefined ? getSuitabilityColor(score) : "#0ea5e9";
  const label = score !== undefined ? getSuitabilityLabel(score) : null;
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 hover:border-[#333] transition-colors">
      <p className="text-[#888] text-[10px] uppercase tracking-widest mb-2 font-mono">{title}</p>
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold font-mono" style={{ color: score !== undefined ? color : "#fff" }}>
          {value}
        </span>
        {unit && <span className="text-[#666] text-sm mb-1">{unit}</span>}
      </div>
      {label && (
        <span
          className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-2"
          style={{ backgroundColor: color, color: "#000" }}
        >
          {label}
        </span>
      )}
      {subtitle && <p className="text-[#555] text-[11px] mt-1.5">{subtitle}</p>}
    </div>
  );
}
