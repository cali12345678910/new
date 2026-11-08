import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import {
  Home,
  BookOpen,
  Clock,
  Compass,
  Sparkles,
  CircleDot,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV = [
  { to: "/", icon: Home, key: "nav_home" as const },
  { to: "/prayer-times", icon: Clock, key: "nav_prayer" as const },
  { to: "/quran", icon: BookOpen, key: "nav_quran" as const },
  { to: "/hadith", icon: BookMarked, key: "nav_hadith" as const },
  { to: "/dhikr", icon: Sparkles, key: "nav_dhikr" as const },
  { to: "/qibla", icon: Compass, key: "nav_qibla" as const },
  { to: "/tasbeeh", icon: CircleDot, key: "nav_tasbeeh" as const },
];

export function SideDockNav() {
  const { t, lang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [side, setSide] = useState<"right" | "left">("right");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedSide = localStorage.getItem("al-maqam-dock-side");
      if (savedSide === "left" || savedSide === "right") setSide(savedSide);
      const savedCol = localStorage.getItem("al-maqam-dock-collapsed");
      if (savedCol === "true") setCollapsed(true);
    } catch {}
  }, []);

  const toggleSide = () => {
    const nextSide = side === "right" ? "left" : "right";
    setSide(nextSide);
    try {
      localStorage.setItem("al-maqam-dock-side", nextSide);
      window.dispatchEvent(new CustomEvent("al-maqam-dock-side-change", { detail: nextSide }));
    } catch {}
  };

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("al-maqam-dock-collapsed", String(next));
    } catch {}
  };

  const isRight = side === "right";

  return (
    <aside
      className={`fixed z-40 top-1/2 -translate-y-1/2 select-none print:hidden transition-all duration-300 ease-out ${
        isRight ? "right-2 sm:right-3.5" : "left-2 sm:left-3.5"
      }`}
      aria-label={lang === "ar" ? "شريط التنقل الجانبي الذكي" : "Side navigation dock"}
    >
      <div
        className="relative flex flex-col items-center p-1.5 sm:p-2 rounded-full gold-border bg-card/90 backdrop-blur-2xl shadow-2xl transition-all duration-300"
        style={{
          boxShadow: "0 14px 45px -8px rgba(0,0,0,0.8), 0 0 24px -2px rgb(var(--accent-rgb) / 0.18)",
        }}
      >
        {/* Collapsed Mode Mini-Pill */}
        {collapsed ? (
          <div className="py-1 flex flex-col items-center gap-2">
            <button
              onClick={toggleCollapsed}
              className="p-1 rounded-full text-primary hover:bg-accent/80 transition-transform active:scale-90"
              title={lang === "ar" ? "توسيع شريط التنقل" : "Expand navigation dock"}
              aria-label="Expand dock"
            >
              {isRight ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>

            {NAV.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  preload="intent"
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 active:scale-125 ${
                    active
                      ? "bg-primary scale-125 ring-2 ring-primary/50 shadow-sm"
                      : "bg-muted-foreground/35 hover:bg-muted-foreground"
                  }`}
                  title={t(n.key)}
                />
              );
            })}
          </div>
        ) : (
          /* Expanded Full Floating Icons Dock */
          <div className="flex flex-col items-center gap-1">
            <nav className="flex flex-col items-center gap-1.5">
              {NAV.map((n) => {
                const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
                const Icon = n.icon;

                return (
                  <div key={n.to} className="relative group flex items-center">
                    <Link
                      to={n.to}
                      preload="intent"
                      className={`relative p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 ${
                        active
                          ? "gold-fill text-black font-bold shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                      }`}
                      aria-label={t(n.key)}
                    >
                      <Icon className="size-4 sm:size-4.5" />
                    </Link>

                    {/* Flyout Label Tooltip on hover / touch */}
                    <div
                      className={`absolute ${
                        isRight
                          ? "right-full mr-3 translate-x-1 group-hover:translate-x-0"
                          : "left-full ml-3 -translate-x-1 group-hover:translate-x-0"
                      } opacity-0 group-hover:opacity-100 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap gold-border bg-card/95 text-foreground shadow-2xl backdrop-blur-md pointer-events-none z-50 transition-all duration-150`}
                    >
                      {t(n.key)}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Dock Controls: Collapse & Switch Side (Right/Left) */}
            <div className="mt-1 pt-1.5 border-t border-border/50 flex flex-col items-center gap-1">
              <button
                onClick={toggleSide}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-transform active:scale-90"
                title={
                  isRight
                    ? lang === "ar"
                      ? "نقل القائمة إلى اليسار"
                      : "Move dock to left"
                    : lang === "ar"
                    ? "نقل القائمة إلى اليمين"
                    : "Move dock to right"
                }
                aria-label="Toggle side dock position"
              >
                <ArrowLeftRight className="size-3 text-muted-foreground/80 hover:text-primary" />
              </button>

              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-transform active:scale-90"
                title={lang === "ar" ? "تصغير القائمة" : "Minimize dock"}
                aria-label="Minimize dock"
              >
                {isRight ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
