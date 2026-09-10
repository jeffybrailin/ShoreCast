import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import SOSButton from "@/components/ui/SOSButton";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shorecast — Coastal Intelligence",
  description: "Real-time coastal safety, marine intelligence, and AI-driven travel planning for Indian beaches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${mono.variable} antialiased min-h-screen`}
            style={{ background: "var(--c-bg)", color: "var(--c-text)" }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <SOSButton />
        </ThemeProvider>
      </body>
    </html>
  );
}