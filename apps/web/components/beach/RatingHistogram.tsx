interface RatingHistogramProps {
  distribution?: Record<number, number>;
  totalReviews?: number;
  recommendedPercent?: number;
  averageRating?: number;
}

export default function RatingHistogram({
  distribution = { 5: 200, 4: 48, 3: 15, 2: 7, 1: 3 },
  totalReviews = 273,
  recommendedPercent = 88,
  averageRating = 4.5,
}: RatingHistogramProps) {
  const max = Math.max(...Object.values(distribution));
  return (
    <div className="rounded-2xl p-4" style={{ background: "var(--c-card)", border: "1px solid var(--c-border)" }}>
      <h3 className="text-sm font-bold mb-3" style={{ color: "var(--c-text)" }}>Summary</h3>
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map((star) => {
            const count = distribution[star] ?? 0;
            const width = max > 0 ? (count / max) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] font-semibold w-2 shrink-0" style={{ color: "var(--c-muted)" }}>{star}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--c-border)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${width}%`, background: "#FBBF24" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black" style={{ color: "var(--c-text)" }}>{averageRating.toFixed(1)}</span>
            <svg className="w-5 h-5 text-[#FBBF24]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-[10px] font-semibold" style={{ color: "var(--c-muted)" }}>{totalReviews} Reviews</p>
          <div className="text-right mt-1">
            <p className="text-lg font-black" style={{ color: "var(--c-text)" }}>{recommendedPercent}%</p>
            <p className="text-[10px] font-medium" style={{ color: "var(--c-muted)" }}>Recommended</p>
          </div>
        </div>
      </div>
    </div>
  );
}