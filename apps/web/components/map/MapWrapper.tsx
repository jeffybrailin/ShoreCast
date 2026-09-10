"use client";
import dynamic from "next/dynamic";
import type { Beach } from "@/lib/api";

const ShorecastMap = dynamic(() => import("@/components/map/ShorecastMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-[#444] text-sm">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper({ beaches }: { beaches: Beach[] }) {
  return <ShorecastMap beaches={beaches} />;
}