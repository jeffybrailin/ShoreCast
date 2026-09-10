const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Beach {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  suitability_score: number;
}

export interface LiveBeachData extends Beach {
  live_suitability: {
    score: number;
    category: string;
    color: string;
    components: Record<string, number | string>;
  };
  marine_data: Record<string, unknown>;
  weather_data: Record<string, unknown>;
  alerts: Array<{ severity: string; message: string }>;
}

export async function fetchBeaches(params?: {
  lat?: number;
  lon?: number;
  min_score?: number;
}): Promise<{ beaches: Beach[] }> {
  const query = new URLSearchParams();
  if (params?.lat) query.set("lat", String(params.lat));
  if (params?.lon) query.set("lon", String(params.lon));
  if (params?.min_score) query.set("min_score", String(params.min_score));
  const res = await fetch(`${API_BASE}/api/beaches?${query}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch beaches");
  return res.json();
}

export async function fetchBeachDetail(id: string): Promise<LiveBeachData> {
  const res = await fetch(`${API_BASE}/api/beaches/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch beach detail");
  return res.json();
}

export async function fetchMarineData(lat: number, lon: number) {
  const res = await fetch(`${API_BASE}/api/marine?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch marine data");
  return res.json();
}

export async function* streamChat(request: {
  message: string;
  session_id?: string;
  agent_mode?: string;
  beach_context?: Record<string, unknown>;
}): AsyncGenerator<{ type: string; content?: string; tool?: string; input?: string; agent?: string }> {
  const res = await fetch(`${API_BASE}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok || !res.body) throw new Error("Stream failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try { yield JSON.parse(line.slice(6)); } catch { /* skip */ }
      }
    }
  }
}
