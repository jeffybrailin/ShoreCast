import ChatInterface from "@/components/chat/ChatInterface";
import { Waves } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-[#1a1a1a] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider">SHORECAST</h1>
            <p className="text-[10px] text-[#555] uppercase tracking-widest">AI Agent · Planner Mode</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs text-[#888] hover:text-white transition-colors">Dashboard</Link>
          <Link href="/chat" className="text-xs text-blue-400">AI Agent</Link>
        </nav>
      </header>
      <div className="flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        <ChatInterface />
      </div>
    </div>
  );
}
