import Link from "next/link";
import { Cloud, Thermometer, Waves, Star } from "lucide-react";
import { getSuitabilityColor } from "@/lib/mapConfig";

interface BeachCardProps {
  id: string;
  name: string;
  state: string;
  distanceKm?: number;
  suitabilityScore: number;
  rating?: number;
  weather?: { rainPercent?: number; tempC?: number; tideLevel?: string };
  imageUrl?: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className="w-3 h-3"
          fill={i <= Math.round(rating) ? "#FBBF24" : "none"}
          stroke={i <= Math.round(rating) ? "#FBBF24" : "var(--c-border)"}
          strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function BeachCard({ id, name, state, distanceKm, suitabilityScore, rating = 4.5, weather, imageUrl }: BeachCardProps) {
  const scoreColor = getSuitabilityColor(suitabilityScore);
  return (
    <Link href={`/beach/${id}`} className="block group">
      <div
        className="flex items-stretch gap-3 rounded-2xl overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5"
        style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}
      >
        {/* Thumbnail */}
        <div className="w-24 h-24 shrink-0 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0891B2, #0F172A)" }}>
              <Waves className="w-8 h-8 text-white/40" />
            </div>
          )}
          <div className="absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
            style={{ background: scoreColor }}>
            {suitabilityScore}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
          {/* Weather chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {weather?.rainPercent !== undefined && (
              <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--c-muted)" }}>
                <Cloud className="w-3 h-3" />{weather.rainPercent}%
              </span>
            )}
            {weather?.tempC !== undefined && (
              <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--c-muted)" }}>
                <Thermometer className="w-3 h-3" />{weather.tempC}°C
              </span>
            )}
            {weather?.tideLevel && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#06B6D4]">
                <Waves className="w-3 h-3" />{weather.tideLevel}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-bold truncate" style={{ color: "var(--c-text)" }}>{name}</p>
            <p className="text-[10px] font-medium" style={{ color: "var(--c-muted)" }}>{state}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Stars rating={rating} />
              <span className="text-[10px] font-semibold" style={{ color: "var(--c-muted)" }}>{rating.toFixed(1)}/5</span>
            </div>
            {distanceKm !== undefined && (
              <span className="text-[10px] font-medium" style={{ color: "var(--c-subtle)" }}>{distanceKm} km</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}