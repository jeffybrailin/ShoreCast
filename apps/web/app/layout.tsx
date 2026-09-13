import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import SOSButton from "@/components/ui/SOSButton";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300","400","500","600","700","800","900"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400","600","700","800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400","500","700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shorecast — India's Coastal Intelligence",
  description: "Discover 130+ Indian beaches with real-time safety scores, nearby hotels, restaurants, and AI-driven travel planning.",
  keywords: ["India beaches", "coastal safety", "beach travel", "Goa", "Kerala", "Maharashtra"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${mono.variable} antialiased min-h-screen`}
        style={{ background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--font-sans)" }}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <SOSButton />
        </ThemeProvider>
      </body>
    </html>
  );
}