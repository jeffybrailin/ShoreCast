import { getSuitabilityColor, getSuitabilityLabel } from "@/lib/mapConfig";

interface SuitabilityBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function SuitabilityBadge({ score, size = "md" }: SuitabilityBadgeProps) {
  const color = getSuitabilityColor(score);
  const label = getSuitabilityLabel(score);
  const r = size === "lg" ? 24 : size === "md" ? 20 : 16;
  const stroke = 3;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const svgSize = (r + stroke) * 2 + 4;

  return (
    <div className="flex items-center gap-3 bg-[#06B6D4] rounded-2xl px-4 py-3 shadow-sm">
      <span className="text-white font-bold text-sm flex-1">Suitability Score:</span>
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={r}
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={stroke}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={r}
            fill="none"
            stroke="white"
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-black"
            fontSize={r * 0.7}
            fill="white"
            fontWeight="900"
          >
            {score}
          </text>
        </svg>
      </div>
    </div>
  );
}
