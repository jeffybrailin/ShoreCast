import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS-variable-driven theme tokens
        surface:   "var(--c-bg)",
        elevated:  "var(--c-card)",
        "t-border":"var(--c-border)",
        ink:       "var(--c-text)",
        "ink-muted":"var(--c-muted)",
        "ink-subtle":"var(--c-subtle)",
        // Suitability
        safe:     "#0ea5e9",
        caution:  "#f97316",
        danger:   "#dc2626",
        critical: "#7c3aed",
        // Brand palette
        amber: {
          DEFAULT: "#FBBF24",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        ocean: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        navy: {
          DEFAULT: "#0F172A",
          800: "#1E293B",
          900: "#0F172A",
        },
        coral: "#FF6B6B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "login-gradient": "linear-gradient(160deg, #FEF9C3 0%, #FDE68A 28%, #BAE6FD 65%, #93C5FD 100%)",
        "login-gradient-dark": "linear-gradient(160deg, #0F172A 0%, #1E293B 40%, #0C4A6E 100%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-out",
        "slide-up":   "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        beach: "0 8px 32px rgba(251,191,36,0.15)",
        card:  "0 4px 24px rgba(0,0,0,0.08)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;