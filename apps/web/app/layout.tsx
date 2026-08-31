import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shorecast — Agentic AI Coastal Intelligence",
  description: "Real-time coastal safety, marine intelligence, and AI-driven travel planning for Indian beaches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
