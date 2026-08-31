import { Suspense } from "react";
import { fetchBeaches } from "@/lib/api";
import dynamic from "next/dynamic";
import WeatherPanel from "@/components/dashboard/WeatherPanel";
import AlertBanner from "@/components/dashboard/AlertBanner";
import { Waves, Activity, Map } from "lucide-react";
import Link from "next/link";

const ShorecastMap = dynamic(() => import("@/components/map/ShorecastMap"), { ssr: false });

export default async function DashboardPage() {
  let beaches = [];
  try {
    const data = await fetchBeaches();
    beaches = data.beaches;
  } catch {
    beaches = [
      { id: "1", name: "Marina Beach", state: "Tamil Nadu", lat: 13.0500, lon: 80.2785, suitability_score: 72 },
      { id: "2", name: "Juhu Beach", state: "Maharashtra", lat: 19.1075, lon: 72.8264, suitability_score: 58 },
      { id: "3", name: "Calangute Beach", state: "Goa", lat: 15.5440, lon: 73.7553, suitability_score: 80 },
      { id: "4", name: "Radhanagar Beach", state: "Andaman", lat: 11.9916, lon: 92.9762, suitability_score: 91 },
      { id: "5", name: "Puri Beach", state: "Odisha", lat: 19.7979, lon: 85.8245, suitability_score: 65 },
      { id: "6", name: "Kovalam Beach", state: "Kerala", lat: 8.3988, lon: 76.9827, suitability_score: 83 },
      { id: "7", name: "Rushikonda Beach", state: "Andhra Pradesh", lat: 17.7760, lon: 83.3800, suitability_score: 87 },
      { id: "8", name: "Varkala Beach", state: "Kerala", lat: 8.7379, lon: 76.7163, suitability_score: 76 },
      { id: "9", name: "Diu Beach", state: "Diu", lat: 20.7142, lon: 70.9878, suitability_score: 78 },
      { id: "10", name: "Tarkarli Beach", state: "Maharashtra", lat: 16.0167, lon: 73.4698, suitability_score: 85 },
    ];
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-[#1a1a1a] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider">SHORECAST</h1>
            <p className="text-[10px] text-[#555] uppercase tracking-widest">Agentic Coastal Intelligence</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs text-[#888] hover:text-white flex items-center gap-1.5 transition-colors">
            <Map className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <Link href="/chat" className="text-xs text-[#888] hover:text-white flex items-center gap-1.5 transition-colors">
            <Activity className="w-3.5 h-3.5" /> AI Agent
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </nav>
      </header>

      <div className="px-6 pt-3">
        <AlertBanner />
      </div>

      <div className="flex-1 flex gap-0 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        <div className="flex-1 p-4">
          <div className="h-full rounded-xl overflow-hidden border border-[#1a1a1a]">
            <Suspense fallback={<div className="h-full flex items-center justify-center text-[#444] text-sm">Loading map...</div>}>
              <ShorecastMap beaches={beaches} />
            </Suspense>
          </div>
        </div>

        <div className="w-80 border-l border-[#1a1a1a] flex flex-col bg-black">
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">{beaches.length}</p>
                <p className="text-[10px] text-[#555] uppercase">Beaches</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">
                  {beaches.filter((b) => b.suitability_score >= 75).length}
                </p>
                <p className="text-[10px] text-[#555] uppercase">Safe</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-orange-400">
                  {beaches.filter((b) => b.suitability_score < 75).length}
                </p>
                <p className="text-[10px] text-[#555] uppercase">Caution</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <WeatherPanel />
          </div>

          <div className="p-4 border-t border-[#1a1a1a]">
            <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Suitability Legend</p>
            <div className="space-y-1.5">
              {[
                { color: "#0ea5e9", label: "SAFE", range: "75–100" },
                { color: "#f97316", label: "CAUTION", range: "50–74" },
                { color: "#dc2626", label: "DANGER", range: "25–49" },
                { color: "#7c3aed", label: "CRITICAL", range: "0–24" },
              ].map(({ color, label, range }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-[#888]">{label}</span>
                  <span className="text-xs text-[#444] ml-auto">{range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
