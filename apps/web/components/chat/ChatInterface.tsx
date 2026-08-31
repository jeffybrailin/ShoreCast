"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Waves, User } from "lucide-react";
import { streamChat } from "@/lib/api";
import AgentThought from "./AgentThought";

interface Message {
  role: "user" | "assistant";
  content: string;
  thoughts?: Array<{ type: "tool_start" | "tool_end" | "token" | "start" | "done"; tool?: string; input?: string; agent?: string }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Shorecast\u2019s AI assistant. Ask me anything about coastal safety, beach conditions, nearby hotels, or travel planning.\n\nTry: \"Is Marina Beach safe for swimming tomorrow?\" or \"Find budget hotels near Goa beaches\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startVoice = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const recognition = new (SpeechRecognition as new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: { results: { transcript: string }[][] }) => void;
      onend: () => void;
      start: () => void;
      stop: () => void;
    })();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopVoice = () => {
    (recognitionRef.current as { stop: () => void } | null)?.stop();
    setListening(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    const assistantMsg: Message = { role: "assistant", content: "", thoughts: [] };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      for await (const event of streamChat({
        message: userMsg,
        session_id: "web_session_1",
        agent_mode: "planner",
      })) {
        if (event.type === "token") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: last.content + (event.content || "") }];
          });
        } else if (event.type === "tool_start" || event.type === "tool_end" || event.type === "start") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              {
                ...last,
                thoughts: [...(last.thoughts || []), event as { type: "tool_start" | "tool_end" | "token" | "start" | "done"; tool?: string; input?: string; agent?: string }],
              },
            ];
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Connection error. Ensure the FastAPI server is running at localhost:8000." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                <Waves className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              {msg.thoughts && msg.thoughts.length > 0 && (
                <div className="space-y-1 w-full">
                  {msg.thoughts.map((t, j) => (
                    <AgentThought key={j} {...t} />
                  ))}
                </div>
              )}
              {msg.content && (
                <div
                  className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-[#0a0a0a] border border-[#1a1a1a] text-white rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                    <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1" />
                  )}
                </div>
              )}
              {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <div className="thinking rounded-2xl px-4 py-3 h-10 w-32" />
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[#1a1a1a] bg-black">
        <div className="flex gap-2">
          <button
            onClick={listening ? stopVoice : startVoice}
            className={`p-2.5 rounded-lg transition-colors ${
              listening ? "bg-red-600 text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={listening ? "Listening..." : "Ask about beach safety, hotels, conditions..."}
            className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#444] text-xs mt-2 text-center">
          Powered by LangGraph + Groq Llama 3.3 · Open-Meteo · INCOIS · OSM
        </p>
      </div>
    </div>
  );
}
