"use client";
import { useShorecastStore } from "@/lib/store";
import { useState } from "react";

export default function AlertBanner() {
  const { alerts } = useShorecastStore();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const active = alerts.filter((_, i) => !dismissed.has(i));
  if (active.length === 0) return null;
  const colors: Record<string, string> = {
    LOW: "#0ea5e9", MEDIUM: "#f97316", HIGH: "#dc2626", CRITICAL: "#7c3aed",
  };
  return (
    <div className="space-y-2 mb-2">
      {active.slice(0, 3).map((a, i) => {
        const c = colors[a.severity] || "#f97316";
        return (
          <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg border animate-fade-in"
            style={{ borderColor: c, backgroundColor: `${c}12` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ backgroundColor: c }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">{a.beach_name} &mdash; {a.severity}</p>
              <p className="text-[11px] text-[#aaa] mt-0.5 truncate">{a.message}</p>
            </div>
            <button onClick={() => setDismissed((s) => new Set([...s, i]))}
              className="text-[#555] hover:text-white text-xs transition-colors">&#x2715;</button>
          </div>
        );
      })}
    </div>
  );
}
