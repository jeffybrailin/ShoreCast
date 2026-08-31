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
        background: "#000000",
        foreground: "#ffffff",
        card: "#0a0a0a",
        border: "#1a1a1a",
        muted: "#111111",
        "muted-foreground": "#888888",
        primary: "#0ea5e9",
        accent: "#f97316",
        safe: "#0ea5e9",
        caution: "#f97316",
        danger: "#dc2626",
        critical: "#7c3aed",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
