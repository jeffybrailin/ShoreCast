"use client";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value = "", onChange, placeholder = "Search beaches..." }: SearchBarProps) {
  const [locationOn, setLocationOn] = useState(false);
  const [query, setQuery] = useState(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--c-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange?.(e.target.value); }}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBF24] transition-all"
          style={{
            background: "var(--c-input)",
            border: "1px solid var(--c-border)",
            color: "var(--c-text)",
          }}
        />
      </div>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--c-muted)" }}>
          <MapPin className="w-3.5 h-3.5" />
          <span>Turn On Location</span>
        </div>
        <button
          onClick={() => setLocationOn((v) => !v)}
          className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ background: locationOn ? "#FBBF24" : "var(--c-border)" }}
          aria-label="Toggle location"
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
            style={{ transform: locationOn ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
      </div>
    </div>
  );
}