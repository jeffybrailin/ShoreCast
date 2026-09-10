"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export interface WSMessage { type: string; [key: string]: unknown }

export function useWebSocket(sessionId: string) {
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/alerts/${sessionId}`);
      wsRef.current = ws;
      ws.onopen = () => { setConnected(true); };
      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 3000);
      };
      ws.onerror = () => { ws.close(); };
      ws.onmessage = (e) => {
        try { setLastMessage(JSON.parse(e.data)); } catch { /* ignore */ }
      };
    } catch { /* ignore */ }
  }, [sessionId]);

  const reconnect = useCallback(() => {
    wsRef.current?.close();
    connect();
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { lastMessage, connected, reconnect };
}
