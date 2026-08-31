"use client";
import { Wrench, CheckCircle, Loader2 } from "lucide-react";

interface AgentThoughtProps {
  type: "tool_start" | "tool_end" | "token" | "start" | "done";
  tool?: string;
  input?: string;
  agent?: string;
}

export default function AgentThought({ type, tool, input, agent }: AgentThoughtProps) {
  if (type === "start") {
    return (
      <div className="flex items-center gap-2 text-xs text-[#888] py-1 font-mono">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span>{agent === "sentinel" ? "🛡️ Sentinel" : "🧭 Planner"} Agent activated</span>
      </div>
    );
  }

  if (type === "tool_start") {
    return (
      <div className="flex items-start gap-2 py-1.5 px-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-xs font-mono">
        <Loader2 className="w-3 h-3 mt-0.5 text-blue-400 animate-spin shrink-0" />
        <div>
          <span className="text-blue-400">{tool}</span>
          {input && <p className="text-[#666] mt-0.5 truncate max-w-xs">{input}</p>}
        </div>
      </div>
    );
  }

  if (type === "tool_end") {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-[#555]">
        <CheckCircle className="w-3 h-3 text-green-500" />
        <span>{tool} completed</span>
      </div>
    );
  }

  return null;
}
