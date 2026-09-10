"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, Compass, CalendarDays, ShieldAlert, Bot } from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: Waves,        label: "Home"     },
  { href: "/explore",   icon: Compass,      label: "Explore"  },
  { href: "/itinerary", icon: CalendarDays, label: "Plan"     },
  { href: "/emergency", icon: ShieldAlert,  label: "Safety"   },
  { href: "/chat",      icon: Bot,          label: "AI"       },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 safe-area-pb"
      style={{ background: "var(--c-card)", borderTop: "1px solid var(--c-border)" }}>
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = path === href || (href !== "/dashboard" && path.startsWith(href));
        return (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            style={{ color: active ? "#F59E0B" : "var(--c-muted)" }}>
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[9px] font-bold tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
