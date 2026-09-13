"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, Compass, CalendarDays, ShieldAlert, Bot } from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: Waves,        label: "Home"    },
  { href: "/explore",   icon: Compass,      label: "Explore" },
  { href: "/itinerary", icon: CalendarDays, label: "Plan"    },
  { href: "/emergency", icon: ShieldAlert,  label: "Safety"  },
  { href: "/chat",      icon: Bot,          label: "AI"      },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-pb glass"
      style={{ borderTop: "1px solid var(--c-border)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all"
              style={{ color: active ? "#F59E0B" : "var(--c-muted)" }}
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(245,158,11,0.1)" }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[9px] font-bold tracking-wide relative z-10">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
