import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sun,
  Sunrise,
  SunMedium,
  Sunset,
  Moon,
  MoonStar,
  Compass,
  BookOpen,
  Sparkles,
  Bell,
  BellRing,
} from "lucide-react";

import { LocationBar } from "@/components/LocationBar";
import { loadLocation, qiblaBearing, type Loc } from "@/lib/location";
import {
  fetchToday,
  formatTime12,
  nextPrayer,
  formatHMS,
  PRAYER_KEYS,
  type PrayerKey,
} from "@/lib/prayer-times";
import { useI18n } from "@/lib/i18n";
import { AYAH_OF_DAY, DHIKR } from "@/lib/dhikr-data";
import { requestNotificationPermission, scheduleAthan, playAthan, stopAthan } from "@/lib/athan";
import { useSettings } from "@/lib/settings";
import { RadialCountdown } from "@/components/RadialCountdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الْمَقَام | Al-Maqam — Prayer Times, Qur'an & Dhikr" },
      {
        name: "description",
        content:
          "Al-Maqam: a luxury Islamic platform for accurate prayer times, Qibla, Qur'an with reciter selection, and Hisn al-Muslim dhikr.",
      },
    ],
  }),
  component: Dashboard,
});

const ICONS: Record<PrayerKey, React.ComponentType<{ className?: string }>> = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: SunMedium,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

function Dashboard() {
  const { t, lang } = useI18n();
  const [settings] = useSettings();
  const [loc, setLoc] = useState<Loc>(() => loadLocation());
  const [tick, setTick] = useState(0);
  const [athanOn, setAthanOn] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["today", loc.lat, loc.lng, settings.calcMethod],
    queryFn: () => fetchToday(loc.lat, loc.lng, settings.calcMethod),
    staleTime: 5 * 60 * 1000,
  });

  // Recompute only when the prayer data changes or the active countdown rolls
  // over to the next prayer (signalled by LiveCountdown), not every second.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `tick` is the rollover trigger
  const next = useMemo(() => (data ? nextPrayer(data.timings) : null), [data, tick]);
  const bearing = useMemo(() => qiblaBearing(loc.lat, loc.lng), [loc]);
  const onCountdownComplete = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (athanOn && data) scheduleAthan(data.timings, lang);
  }, [athanOn, data, lang]);

  async function toggleAthan() {
    if (athanOn) {
      setAthanOn(false);
      stopAthan();
      return;
    }
    const perm = await requestNotificationPermission();
    if (perm === "granted") {
      setAthanOn(true);
      playAthan();
      setTimeout(stopAthan, 4000);
    } else alert(lang === "ar" ? "يرجى السماح بالتنبيهات" : "Please allow notifications");
  }

  const morning = DHIKR.find((c) => c.id === "morning") ?? DHIKR[0];
  const todayDhikr = morning.items[7] ?? morning.items[0];
  const arScale = settings.fontScale;

  return (
    <div className="space-y-4">
      <LocationBar loc={loc} onChange={setLoc} />

      {/* Hero with radial countdown */}
      <section className="rounded-3xl gold-border gold-gradient card-shadow p-5 sm:p-7 overflow-hidden relative">
        <Ornament />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center relative">
          <div className="min-w-0 order-2 md:order-1">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {t("next_prayer")}
            </div>
            <div className="mt-2 flex items-baseline gap-3 flex-wrap">
              <div className="font-display text-5xl sm:text-6xl gold-text leading-none">
                {next ? t(next.key.toLowerCase() as Parameters<typeof t>[0]) : "—"}
              </div>
              {data && next && (
                <div className="text-base text-muted-foreground tabular-nums">
                  {formatTime12(data.timings[next.key], lang)}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("hijri")}
              </div>
              <div className="font-display text-base">
                {data
                  ? `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year}`
                  : "—"}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {data
                ? `${data.date.gregorian.weekday.en}, ${data.date.gregorian.day} ${data.date.gregorian.month.en} ${data.date.gregorian.year}`
                : "—"}
            </div>

            <button
              onClick={toggleAthan}
              className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                athanOn
                  ? "gold-fill text-black animate-gold-pulse"
                  : "bg-background/70 gold-border hover:bg-accent"
              }`}
            >
              {athanOn ? <BellRing className="size-4" /> : <Bell className="size-4" />}
              {athanOn ? t("athan_enabled") : t("enable_athan")}
            </button>
          </div>

          <div className="order-1 md:order-2 grid place-items-center">
            {next ? (
              <LiveCountdown next={next} onComplete={onCountdownComplete} />
            ) : (
              <RadialCountdown size={240} stroke={12} progress={0}>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {t("in_time")}
                  </div>
                  <div className="font-mono tabular-nums text-3xl gold-text font-bold mt-1">
                    --:--:--
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1" />
                </div>
              </RadialCountdown>
            )}
          </div>
        </div>
      </section>

      {/* Prayer cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        {data &&
          PRAYER_KEYS.map((k) => {
            const Icon = ICONS[k];
            const isNext = next?.key === k;
            return (
              <div
                key={k}
                className={`rounded-2xl p-3 transition card-shadow ${
                  isNext
                    ? "gold-fill text-black border-transparent animate-gold-pulse"
                    : "bg-card gold-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-4 opacity-80" />
                  {isNext && (
                    <span className="text-[10px] uppercase tracking-wider opacity-80">●</span>
                  )}
                </div>
                <div className="mt-2 font-display text-lg leading-tight">
                  {t(k.toLowerCase() as Parameters<typeof t>[0])}
                </div>
                <div
                  className={`text-sm font-mono tabular-nums ${isNext ? "" : "text-muted-foreground"}`}
                >
                  {formatTime12(data.timings[k], lang)}
                </div>
              </div>
            );
          })}
        {data && (
          <div className="rounded-2xl gold-border bg-card p-3 col-span-2 sm:col-span-3 lg:col-span-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MoonStar className="size-3.5 text-primary" /> {t("midnight")}
              </span>
              <span className="font-mono tabular-nums text-foreground">
                {formatTime12(data.timings.Midnight, lang)}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Qibla + Dhikr + Ayah */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          to="/qibla"
          className="rounded-3xl gold-border bg-card card-shadow p-5 hover:-translate-y-0.5 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("qibla_dir")}
            </div>
            <Compass className="size-4 text-primary group-hover:rotate-12 transition" />
          </div>
          <div className="mt-2 font-display text-5xl gold-text">{bearing.toFixed(0)}°</div>
          <div className="text-xs text-muted-foreground mt-1">{t("degrees_to_kaaba")}</div>
          <CompassMini bearing={bearing} />
        </Link>

        <Link
          to="/dhikr"
          className="rounded-3xl gold-border bg-card card-shadow p-5 hover:-translate-y-0.5 transition"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("today_dhikr")}
            </div>
            <Sparkles className="size-4 text-primary" />
          </div>
          <p
            className="mt-3 arabic leading-relaxed line-clamp-4"
            style={{ fontSize: `${1.25 * arScale}rem` }}
          >
            {todayDhikr.ar}
          </p>
          {lang === "en" && todayDhikr.en && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{todayDhikr.en}</p>
          )}
        </Link>

        <Link
          to="/quran"
          className="rounded-3xl gold-border bg-card card-shadow p-5 hover:-translate-y-0.5 transition"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {lang === "ar" ? "آية اليوم" : "Ayah of the day"}
            </div>
            <BookOpen className="size-4 text-primary" />
          </div>
          <p className="mt-3 arabic leading-relaxed" style={{ fontSize: `${1.25 * arScale}rem` }}>
            {AYAH_OF_DAY.ar}
          </p>
          {lang === "en" && <p className="text-xs text-muted-foreground mt-2">{AYAH_OF_DAY.en}</p>}
          <p className="text-[11px] text-muted-foreground mt-2">{AYAH_OF_DAY.ref}</p>
        </Link>
      </section>
    </div>
  );
}

type NextPrayer = NonNullable<ReturnType<typeof nextPrayer>>;

// Owns the 1s ticker so only the ring/timer re-renders each second instead of
// the whole dashboard. Calls onComplete when the active prayer time arrives.
function LiveCountdown({ next, onComplete }: { next: NextPrayer; onComplete: () => void }) {
  const { t } = useI18n();
  const [msLeft, setMsLeft] = useState(() => next.at.getTime() - Date.now());

  useEffect(() => {
    setMsLeft(next.at.getTime() - Date.now());
    const id = setInterval(() => {
      const left = next.at.getTime() - Date.now();
      setMsLeft(left);
      if (left <= 0) onComplete();
    }, 1000);
    return () => clearInterval(id);
  }, [next, onComplete]);

  const progress = 1 - msLeft / next.intervalMs;

  return (
    <RadialCountdown size={240} stroke={12} progress={progress}>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("in_time")}
        </div>
        <div className="font-mono tabular-nums text-3xl gold-text font-bold mt-1">
          {formatHMS(msLeft)}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {t(next.key.toLowerCase() as Parameters<typeof t>[0])}
        </div>
      </div>
    </RadialCountdown>
  );
}

function CompassMini({ bearing }: { bearing: number }) {
  return (
    <div className="mt-4 mx-auto relative size-28 rounded-full gold-border bg-background grid place-items-center">
      <div className="absolute inset-2 rounded-full border border-border/60" />
      <div
        className="absolute h-1/2 w-0.5 origin-bottom rounded-full"
        style={{
          transform: `rotate(${bearing}deg)`,
          background: "linear-gradient(to top, transparent, var(--gold-bright))",
        }}
      />
      <div className="absolute top-1.5 text-[10px] text-muted-foreground">N</div>
      <div className="text-[10px] font-mono">{bearing.toFixed(0)}°</div>
    </div>
  );
}

function Ornament() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -end-12 -top-12 size-56 opacity-20 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="60" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="100" y1="100" x2="100" y2="20" transform={`rotate(${i * 30} 100 100)`} />
      ))}
    </svg>
  );
}
