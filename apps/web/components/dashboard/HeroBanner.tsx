interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function HeroBanner({ title, subtitle, imageUrl }: HeroBannerProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden h-36">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0F172A, #1E3A5F)" }} />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)" }} />
      <div className="relative z-10 flex flex-col justify-end h-full p-4">
        <h2 className="text-white font-extrabold text-lg uppercase tracking-wide leading-tight drop-shadow-lg">
          {title}
        </h2>
        {subtitle && <p className="text-white/70 text-xs mt-0.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}