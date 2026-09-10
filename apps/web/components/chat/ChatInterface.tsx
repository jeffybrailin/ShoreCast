"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Waves, User, MapPin, AlertTriangle } from "lucide-react";
import { streamChat } from "@/lib/api";
import AgentThought from "./AgentThought";

interface Message {
  role: "user" | "assistant";
  content: string;
  thoughts?: Array<{ type: string; tool?: string; input?: string; agent?: string; content?: string }>;
}

const QUICK_PROMPTS = [
  { label: "🏖️ Best Goa beaches", text: "What are the best beaches in Goa for November?" },
  { label: "🌊 Radhanagar safety", text: "Is Radhanagar Beach safe for swimming this week?" },
  { label: "🏨 Hotels near Marina", text: "Find hotels near Marina Beach Chennai" },
  { label: "🎯 Kovalam attractions", text: "Top tourist spots near Kovalam Beach Kerala?" },
  { label: "🤿 Snorkeling beaches", text: "Best Indian beaches for snorkeling and scuba diving?" },
  { label: "🐢 Turtle beaches", text: "Which beaches have olive ridley turtle nesting in India?" },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl w-fit"
      style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg, loading, isLast }: { msg: Message; loading: boolean; isLast: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "linear-gradient(135deg,#FBBF24,#06B6D4)" }}>
          <Waves className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[82%] flex flex-col ${isUser ? "items-end" : "items-start"} gap-1`}>
        {msg.thoughts && msg.thoughts.length > 0 && (
          <div className="flex flex-wrap gap-1 max-w-full">
            {msg.thoughts.map((t, j) => (
              <AgentThought key={j} {...t} />
            ))}
          </div>
        )}
        {loading && isLast && !isUser && !msg.content ? (
          <TypingDots />
        ) : msg.content ? (
          <div className="px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed font-medium"
            style={isUser
              ? { background: "#FBBF24", color: "#0F172A", borderRadius: "1rem 1rem 0.25rem 1rem" }
              : { background: "var(--c-card)", border: "1px solid var(--c-border)", color: "var(--c-text)", borderRadius: "1rem 1rem 1rem 0.25rem" }
            }>
            {msg.content}
            {loading && isLast && !isUser && (
              <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse ml-1 align-middle" />
            )}
          </div>
        ) : null}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "var(--c-hover)", border: "1px solid var(--c-border)" }}>
          <User className="w-3.5 h-3.5" style={{ color: "var(--c-muted)" }} />
        </div>
      )}
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content:
      "👋 Hi! I'm Shorecast's AI Agent — your coastal intelligence assistant.\n\n" +
      "I know 112+ Indian beaches across all coastal states. Ask me about:\n" +
      "🌊 Beach safety & live conditions\n" +
      "🏨 Nearby hotels & restaurants\n" +
      "🎯 Tourist attractions & activities\n" +
      "📅 Best seasons & travel planning\n\n" +
      "Try one of the quick prompts below, or just type your question!",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [noApi, setNoApi] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startVoice = () => {
    if (typeof window === "undefined") return;
    const SR =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported."); return; }
    const rec = new (SR as new () => {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: (e: { results: { transcript: string }[][] }) => void;
      onend: () => void; start: () => void; stop: () => void;
    })();
    rec.lang = "en-IN"; rec.continuous = false; rec.interimResults = false;
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onend = () => setListening(false);
    rec.start(); recognitionRef.current = rec; setListening(true);
  };

  const stopVoice = () => {
    (recognitionRef.current as { stop: () => void } | null)?.stop();
    setListening(false);
  };

  const sendMessage = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput(""); setLoading(true); setNoApi(false);
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    const assistantMsg: Message = { role: "assistant", content: "", thoughts: [] };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      for await (const event of streamChat({ message: userMsg, session_id: "web_session_1", agent_mode: "planner" })) {
        if (event.type === "token") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: last.content + (event.content || "") }];
          });
        } else if (["tool_start", "tool_end", "start"].includes(event.type)) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, thoughts: [...(last.thoughts || []), event as NonNullable<Message["thoughts"]>[number]] }];
          });
        }
      }
    } catch {
      setNoApi(true);
      setMessages((prev) => [...prev.slice(0, -1), {
        role: "assistant",
        content:
          "⚠️ Cannot connect to the Shorecast API server.\n\n" +
          "Start the backend:\ncd apps/api\nuvicorn main:app --reload\n\n" +
          "Also add GROQ_API_KEY to apps/api/.env for full AI responses (free at console.groq.com)",
      }]);
    }
    setLoading(false); inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--c-bg)" }}>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} loading={loading} isLast={i === messages.length - 1} />
        ))}
        <div ref={bottomRef} />
      </div>

      {noApi && (
        <div className="mx-4 mb-2 flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", color: "#EA580C" }}>
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>API offline. Run <code className="font-mono px-1 rounded" style={{ background: "rgba(249,115,22,0.15)" }}>uvicorn main:app --reload</code> in apps/api</span>
        </div>
      )}

      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Quick Prompts</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button key={p.label} onClick={() => sendMessage(p.text)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
                style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-4 pt-2 shrink-0" style={{ borderTop: "1px solid var(--c-border)", background: "var(--c-card)" }}>
        <div className="flex gap-2 items-center">
          <button onClick={listening ? stopVoice : startVoice}
            className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all"
            style={listening
              ? { background: "#DC2626", color: "white" }
              : { background: "var(--c-hover)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}>
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--c-subtle)" }} />
            <input ref={inputRef} type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={listening ? "Listening..." : "Ask about any Indian beach..."}
              disabled={loading}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }} />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all active:scale-95"
            style={input.trim() && !loading
              ? { background: "#FBBF24", color: "#0F172A" }
              : { background: "var(--c-hover)", color: "var(--c-subtle)", opacity: 0.5 }}>
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2 font-medium" style={{ color: "var(--c-subtle)" }}>
          Powered by LangGraph · Groq Llama 3.3 · Open-Meteo · INCOIS · OpenStreetMap
        </p>
      </div>
    </div>
  );
}
