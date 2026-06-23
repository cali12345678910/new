import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import {
  Home,
  BookOpen,
  Clock,
  Compass,
  Sparkles,
  CircleDot,
  Languages,
  Settings as SettingsIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { SettingsDrawer } from "./SettingsDrawer";
import { useSettings } from "@/lib/settings";
import { applyTheme } from "@/lib/theme";

const NAV = [
  { to: "/", icon: Home, key: "nav_home" as const },
  { to: "/prayer-times", icon: Clock, key: "nav_prayer" as const },
  { to: "/quran", icon: BookOpen, key: "nav_quran" as const },
  { to: "/dhikr", icon: Sparkles, key: "nav_dhikr" as const },
  { to: "/qibla", icon: Compass, key: "nav_qibla" as const },
  { to: "/tasbeeh", icon: CircleDot, key: "nav_tasbeeh" as const },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings] = useSettings();

  useEffect(() => {
    applyTheme({
      accent: settings.accent,
      appearance: settings.appearance,
      arabicFont: settings.arabicFont,
      fontScale: settings.fontScale,
      reduceMotion: settings.reduceMotion,
    });
  }, [
    settings.accent,
    settings.appearance,
    settings.arabicFont,
    settings.fontScale,
    settings.reduceMotion,
  ]);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <Logo size={44} />
            <div className="min-w-0 leading-tight">
              <div className="font-display text-2xl gold-text">{t("app_name")}</div>
              <div className="text-[10px] tracking-[0.25em] text-muted-foreground">AL-MAQAM</div>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="inline-flex items-center gap-1.5 rounded-full gold-border bg-card px-3 py-1.5 text-xs hover:bg-accent transition"
              aria-label={t("language")}
            >
              <Languages className="size-3.5" />
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full gold-border bg-card px-3 py-1.5 text-xs hover:bg-accent transition"
              aria-label={t("settings")}
            >
              <SettingsIcon className="size-3.5" />
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-2 pb-2 hidden md:flex gap-1 overflow-x-auto">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition whitespace-nowrap ${
                  active ? "gold-fill text-black shadow-md" : "text-foreground/70 hover:bg-accent"
                }`}
              >
                <Icon className="size-4" />
                {t(n.key)}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-5 pb-24 md:pb-8">{children}</main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border/70 bg-background/95 backdrop-blur">
        <div className="grid grid-cols-6">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                <span className="truncate">{t(n.key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        {t("privacy_note")}
      </footer>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
