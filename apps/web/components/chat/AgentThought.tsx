"use client";

interface AgentThoughtProps {
  type: string;
  tool?: string;
  input?: string;
  agent?: string;
  content?: string;
}

const TOOL_ICONS: Record<string, string> = {
  lookup_beach_by_name: "🔍",
  list_beaches_by_state: "📋",
  get_beach_conditions: "🌊",
  find_nearby_amenities: "📍",
  find_tourist_attractions: "🎯",
  calculate_beach_suitability: "📊",
};

export default function AgentThought({ type, tool }: AgentThoughtProps) {
  if (type === "start") {
    return (
      <div className="flex items-center gap-2 text-[11px] font-semibold mb-1" style={{ color: "var(--c-muted)" }}>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Shorecast AI is thinking...
      </div>
    );
  }
  if (type === "tool_start" && tool) {
    const icon = TOOL_ICONS[tool] || "⚙️";
    const label = tool.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mr-1 mb-1"
        style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", color: "#D97706" }}>
        <span>{icon}</span>
        <span>{label}</span>
        <span className="opacity-60 text-[9px]">Running...</span>
      </div>
    );
  }
  if (type === "tool_end" && tool) {
    const label = tool.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mr-1 mb-1"
        style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#16A34A" }}>
        <span>✓</span>
        <span>{label}</span>
      </div>
    );
  }
  return null;
}
