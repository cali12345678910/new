import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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
  BookMarked,
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
import { ShareButton } from "@/components/ShareCard";
import { getSection, type SectionId } from "@/lib/sections";

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
  const [loc, setLoc] = useState<Loc>(loadLocation);
  const [settings] = useSettings();
  const [athanOn, setAthanOn] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["prayer-today", loc.lat, loc.lng, settings.method, settings.asrMethod],
    queryFn: () =>
      fetchToday(loc, {
        method: settings.method,
        asrMethod: settings.asrMethod,
        highLatitude: settings.highLatitude,
      }),
    refetchInterval: 60_000,
  });

  const next = useMemo(() => (data ? nextPrayer(data.timings) : null), [data]);
  const bearing = useMemo(() => qiblaBearing(loc), [loc]);

  // Daily Athan scheduling when enabled
  useEffect(() => {
    if (!athanOn || !data) return;
    const cancel = scheduleAthan(data.timings, (prayer) => {
      playAthan(settings.reciter);
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(t("athan_call"), {
          body: `${t(prayer.toLowerCase() as Parameters<typeof t>[0])} — ${formatTime12(
            data.timings[prayer],
            lang,
          )}`,
          icon: "/favicon.ico",
        });
      }
    });
    return cancel;
  }, [athanOn, data, settings.reciter, lang, t]);

  const toggleAthan = useCallback(async () => {
    if (!athanOn) {
      const ok = await requestNotificationPermission();
      if (!ok) {
        alert(
          lang === "ar"
            ? "يرجى السماح بالإشعارات لتلقي تنبيهات الأذان."
            : "Please allow notifications to receive Athan alerts.",
        );
      }
      setAthanOn(true);
    } else {
      stopAthan();
      setAthanOn(false);
    }
  }, [athanOn, lang]);

  const onCountdownComplete = useCallback(() => {
    // When countdown hits zero, trigger athan if enabled
    if (athanOn) playAthan(settings.reciter);
  }, [athanOn, settings.reciter]);

  const morning = DHIKR.categories[0];
  const todayDhikr = morning.items[7] ?? morning.items[0];
  const arScale = settings.fontScale;

  const sectionNodes: Record<SectionId, ReactNode> = {
    prayer: (
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
              className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition active:scale-95 ${
                athanOn
                  ? "gold-fill text-black animate-gold-pulse shadow-md"
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
    ),

    times: (
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
                className={`rounded-2xl p-3 transition-all duration-200 card-shadow select-none hover:scale-[1.02] active:scale-[0.98] ${
                  isNext
                    ? "gold-fill text-black border-transparent animate-gold-pulse shadow-lg"
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
    ),

    qibla: (
      <Link
        to="/qibla"
        className="block h-full rounded-3xl gold-border bg-card card-shadow p-5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] group"
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
    ),

    dhikr: (
      <Link
        to="/dhikr"
        className="block h-full rounded-3xl gold-border bg-card card-shadow p-5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("today_dhikr")}
          </div>
          <div className="flex items-center gap-2">
            <ShareButton
              content={{
                kind: "dhikr",
                ar: todayDhikr.ar,
                translit: todayDhikr.translit,
                en: todayDhikr.en,
                source: todayDhikr.source,
              }}
            />
            <Sparkles className="size-4 text-primary" />
          </div>
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
    ),

    quran: (
      <Link
        to="/quran"
        className="block h-full rounded-3xl gold-border bg-card card-shadow p-5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {lang === "ar" ? "آية اليوم" : "Ayah of the day"}
          </div>
          <div className="flex items-center gap-2">
            <ShareButton
              content={{
                kind: "ayah",
                ar: AYAH_OF_DAY.ar,
                en: AYAH_OF_DAY.en,
                source: AYAH_OF_DAY.ref,
              }}
            />
            <BookOpen className="size-4 text-primary" />
          </div>
        </div>
        <p className="mt-3 arabic leading-relaxed" style={{ fontSize: `${1.25 * arScale}rem` }}>
          {AYAH_OF_DAY.ar}
        </p>
        {lang === "en" && <p className="text-xs text-muted-foreground mt-2">{AYAH_OF_DAY.en}</p>}
        <p className="text-[11px] text-muted-foreground mt-2">{AYAH_OF_DAY.ref}</p>
      </Link>
    ),

    hadith: (
      <Link
        to="/hadith"
        className="block h-full rounded-3xl gold-border bg-card card-shadow p-5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] group"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {lang === "ar" ? "مكتبة الأحاديث" : "Hadith Library"}
          </div>
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-primary group-hover:scale-110 transition" />
          </div>
        </div>
        <p className="mt-3 arabic leading-relaxed line-clamp-3 text-foreground" style={{ fontSize: `${1.25 * arScale}rem` }}>
          «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»
        </p>
        <p className="text-[11px] text-muted-foreground mt-2 font-mono">متفق عليه · صحيح البخاري (1)</p>
      </Link>
    ),
  };

  return (
    <div className="space-y-4">
      <LocationBar loc={loc} onChange={setLoc} />
      {renderOrderedSections(settings.sectionOrder, sectionNodes)}
    </div>
  );
}

// Renders dashboard sections in the user's saved order, grouping consecutive
// "card" sections into a responsive 2-up / 3-up grid for tablet and mobile
function renderOrderedSections(order: SectionId[], nodes: Record<SectionId, ReactNode>) {
  const out: ReactNode[] = [];
  let cards: ReactNode[] = [];

  const flush = () => {
    if (cards.length) {
      out.push(
        <section key={`cards-${out.length}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {cards}
        </section>,
      );
      cards = [];
    }
  };

  for (const id of order) {
    const node = nodes[id];
    if (!node) continue;
    if (getSection(id).kind === "card") {
      cards.push(<Fragment key={id}>{node}</Fragment>);
    } else {
      flush();
      out.push(<Fragment key={id}>{node}</Fragment>);
    }
  }
  flush();
  return out;
}

type NextPrayer = NonNullable<ReturnType<typeof nextPrayer>>;

function LiveCountdown({
  next,
  onComplete,
}: {
  next: NextPrayer;
  onComplete?: () => void;
}) {
  const { t } = useI18n();
  const [msLeft, setMsLeft] = useState(() => Math.max(0, next.at.getTime() - Date.now()));

  useEffect(() => {
    setMsLeft(Math.max(0, next.at.getTime() - Date.now()));
    const iv = setInterval(() => {
      const left = Math.max(0, next.at.getTime() - Date.now());
      setMsLeft(left);
      if (left <= 0) {
        clearInterval(iv);
        onComplete?.();
      }
    }, 250);
    return () => clearInterval(iv);
  }, [next, onComplete]);

  const progress = next.intervalMs > 0 ? 1 - msLeft / next.intervalMs : 0;

  return (
    <RadialCountdown size={240} stroke={12} progress={progress}>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("in_time")}
        </div>
        <div className="font-mono tabular-nums text-4xl gold-text font-bold mt-1 tracking-tight">
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
    <div className="mt-4 flex items-center justify-center">
      <div className="relative size-20 rounded-full border border-border/80 bg-background/50 flex items-center justify-center">
        <div className="absolute top-1 text-[9px] font-mono text-muted-foreground">N</div>
        <div
          className="size-12 transition-transform duration-700 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          <div className="w-0.5 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
          <div className="absolute top-0 size-2 rounded-full gold-fill shadow-sm" />
        </div>
        <div className="size-2 rounded-full bg-foreground/60" />
      </div>
    </div>
  );
}

function Ornament() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 bg-[radial-gradient(circle,var(--gold-bright)_0%,transparent_70%)] blur-2xl"
    />
  );
}
