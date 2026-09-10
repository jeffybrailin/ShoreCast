"use client";
import { useShorecastStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { useWebSocket, WSMessage } from "@/hooks/useWebSocket";

export default function AlertBanner({ sessionId = "global" }: { sessionId?: string }) {
  const { alerts } = useShorecastStore();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [wsAlerts, setWsAlerts] = useState<WSMessage[]>([]);
  const [dismissedWs, setDismissedWs] = useState<Set<number>>(new Set());

  const { lastMessage } = useWebSocket(sessionId);

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "marine_alert" && lastMessage.message) {
      setWsAlerts((prev) => {
        const key = `${lastMessage.beach_name}-${lastMessage.message}`;
        if (prev.some((a) => `${a.beach_name}-${a.message}` === key)) return prev;
        return [lastMessage, ...prev].slice(0, 5);
      });
    }
  }, [lastMessage]);

  const storeActive = alerts.filter((_, i) => !dismissed.has(i));
  const wsActive = wsAlerts.filter((_, i) => !dismissedWs.has(i));

  if (storeActive.length === 0 && wsActive.length === 0) return null;

  const colors: Record<string, string> = {
    LOW: "#0ea5e9", MEDIUM: "#f97316", HIGH: "#dc2626", CRITICAL: "#7c3aed",
  };

  return (
    <div className="space-y-2 mb-2">
      {wsActive.slice(0, 2).map((a, i) => {
        const c = colors[(a.severity as string) ?? "MEDIUM"] ?? "#f97316";
        return (
          <div
            key={`ws-${i}`}
            className="flex items-start gap-3 px-4 py-3 rounded-xl animate-fade-in"
            style={{ borderLeft: `3px solid ${c}`, background: `${c}18`, border: `1px solid ${c}30` }}
          >
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ backgroundColor: c }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--c-text)" }}>
                <span
                  className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full"
                  style={{ background: c, color: "#fff" }}
                >
                  LIVE
                </span>
                {a.beach_name as string} &mdash; {a.severity as string}
              </p>
              <p className="text-[11px] mt-0.5 truncate font-medium" style={{ color: "var(--c-muted)" }}>{a.message as string}</p>
            </div>
            <button
              onClick={() => setDismissedWs((s) => new Set([...s, i]))}
              className="text-xs transition-colors font-bold hover:opacity-100 opacity-50"
              style={{ color: "var(--c-text)" }}
            >
              &#x2715;
            </button>
          </div>
        );
      })}
      {storeActive.slice(0, 3).map((a, i) => {
        const c = colors[a.severity] || "#f97316";
        return (
          <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl animate-fade-in"
            style={{ borderLeft: `3px solid ${c}`, background: `${c}18`, border: `1px solid ${c}30` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ backgroundColor: c }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: "var(--c-text)" }}>{a.beach_name} &mdash; {a.severity}</p>
              <p className="text-[11px] mt-0.5 truncate font-medium" style={{ color: "var(--c-muted)" }}>{a.message}</p>
            </div>
            <button onClick={() => setDismissed((s) => new Set([...s, i]))}
              className="text-xs transition-colors font-bold hover:opacity-100 opacity-50"
              style={{ color: "var(--c-text)" }}>&#x2715;</button>
          </div>
        );
      })}
    </div>
  );
}