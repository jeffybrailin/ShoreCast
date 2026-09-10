import Link from "next/link";
import { Waves, ArrowLeft, Activity } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import ThemeToggle from "@/components/ui/ThemeToggle";
import BottomNav from "@/components/layout/BottomNav";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <header
        className="shrink-0 flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: "var(--c-card)", borderBottom: "1px solid var(--c-border)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 rounded-xl" style={{ color: "var(--c-muted)" }}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#FBBF24,#06B6D4)" }}>
            <Waves className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black" style={{ color: "var(--c-text)" }}>
              Shore<span style={{ color: "#F59E0B" }}>cast</span> AI
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>
                Planner Agent Active
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
            style={{ background: "var(--c-hover)", color: "var(--c-muted)" }}>
            <Activity className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
      <BottomNav />
    </div>
  );
}
