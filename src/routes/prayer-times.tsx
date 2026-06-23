import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { LocationBar } from "@/components/LocationBar";
import { loadLocation, type Loc } from "@/lib/location";
import { fetchMonth, formatTime12, PRAYER_KEYS } from "@/lib/prayer-times";
import { useI18n } from "@/lib/i18n";
import { useSettings, CALC_METHODS } from "@/lib/settings";

export const Route = createFileRoute("/prayer-times")({
  head: () => ({
    meta: [
      { title: "مواقيت الصلاة | Prayer Times — Al-Maqam" },
      { name: "description", content: "Monthly prayer times calendar — Umm Al-Qura, MWL and more — with luxurious dark presentation." },
    ],
  }),
  component: PrayerTimesPage,
});

function PrayerTimesPage() {
  const { t, lang } = useI18n();
  const [settings] = useSettings();
  const [loc, setLoc] = useState<Loc>(() => loadLocation());
  const [cursor, setCursor] = useState(() => new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;

  const { data, isLoading } = useQuery({
    queryKey: ["month", loc.lat, loc.lng, year, month, settings.calcMethod],
    queryFn: () => fetchMonth(loc.lat, loc.lng, year, month, settings.calcMethod),
    staleTime: 60 * 60 * 1000,
  });

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", { month: "long", year: "numeric" }).format(cursor),
    [cursor, lang]
  );

  const today = new Date().toDateString();
  const method = CALC_METHODS.find((m) => m.id === settings.calcMethod);

  return (
    <div className="space-y-4">
      <LocationBar loc={loc} onChange={setLoc} />

      <div className="rounded-2xl gold-border bg-card p-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{t("calc_method")}:</span>
        <span className="gold-text font-medium">{method ? (lang === "ar" ? method.ar : method.en) : ""}</span>
      </div>

      <div className="flex items-center justify-between rounded-2xl gold-border bg-card p-3">
        <button onClick={() => setCursor(new Date(year, month - 2, 1))} className="rounded-full p-2 hover:bg-accent">
          <ChevronLeft className="size-4" />
        </button>
        <div className="font-display text-lg gold-text">{t("monthly_calendar")} — {monthLabel}</div>
        <button onClick={() => setCursor(new Date(year, month, 1))} className="rounded-full p-2 hover:bg-accent">
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="rounded-2xl gold-border bg-card card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr>
                <th className="px-3 py-2 text-start">{t("gregorian")}</th>
                <th className="px-3 py-2 text-start">{t("hijri")}</th>
                {PRAYER_KEYS.map((k) => (
                  <th key={k} className="px-3 py-2 text-start font-display gold-text">{t(k.toLowerCase() as any)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="p-3"><div className="h-5 rounded bg-muted animate-pulse" /></td></tr>
              ))}
              {data?.map((d) => {
                const greg = new Date(parseInt(d.date.gregorian.year), new Date(`${d.date.gregorian.month.en} 1`).getMonth(), parseInt(d.date.gregorian.day));
                const isToday = greg.toDateString() === today;
                return (
                  <tr key={d.date.gregorian.date} className={`border-t border-border/60 ${isToday ? "bg-primary/10" : ""}`}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="font-medium">{d.date.gregorian.day}</div>
                      <div className="text-[11px] text-muted-foreground">{d.date.gregorian.weekday.en}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="font-medium">{d.date.hijri.day}</div>
                      <div className="text-[11px] text-muted-foreground">{lang === "ar" ? d.date.hijri.month.ar : d.date.hijri.month.en}</div>
                    </td>
                    {PRAYER_KEYS.map((k) => (
                      <td key={k} className="px-3 py-2 font-mono tabular-nums whitespace-nowrap">
                        {formatTime12(d.timings[k], lang)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
