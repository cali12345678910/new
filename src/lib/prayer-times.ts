export type Timings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Midnight: string;
};
export type DayData = {
  timings: Timings;
  date: {
    readable: string;
    gregorian: {
      date: string;
      weekday: { en: string };
      month: { en: string };
      year: string;
      day: string;
    };
    hijri: {
      date: string;
      day: string;
      month: { ar: string; en: string; number: number };
      year: string;
      weekday: { ar: string; en: string };
    };
  };
};

const BASE = "https://api.aladhan.com/v1";

export async function fetchToday(lat: number, lng: number, method = 4): Promise<DayData> {
  const r = await fetch(`${BASE}/timings?latitude=${lat}&longitude=${lng}&method=${method}`);
  if (!r.ok) throw new Error(`Prayer times request failed (${r.status})`);
  const j = await r.json();
  if (!j?.data) throw new Error("Malformed prayer times response");
  return j.data as DayData;
}

export async function fetchMonth(
  lat: number,
  lng: number,
  year: number,
  month: number,
  calcMethod = 4,
): Promise<DayData[]> {
  const r = await fetch(
    `${BASE}/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${calcMethod}`,
  );
  if (!r.ok) throw new Error(`Prayer calendar request failed (${r.status})`);
  const j = await r.json();
  if (!Array.isArray(j?.data)) throw new Error("Malformed prayer calendar response");
  return j.data as DayData[];
}

export const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export function parseTimeToday(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function cleanTime(t: string): string {
  return t.split(" ")[0];
}

export function nextPrayer(timings: Timings): {
  key: PrayerKey;
  at: Date;
  msLeft: number;
  prevAt: Date;
  intervalMs: number;
} {
  const now = new Date();
  const allKeys = PRAYER_KEYS.filter((k) => k !== "Sunrise");
  const times = allKeys.map((k) => ({ key: k, at: parseTimeToday(cleanTime(timings[k])) }));

  for (let i = 0; i < times.length; i++) {
    if (times[i].at.getTime() > now.getTime()) {
      const prev =
        i === 0
          ? (() => {
              const p = parseTimeToday(cleanTime(timings.Isha));
              p.setDate(p.getDate() - 1);
              return p;
            })()
          : times[i - 1].at;
      return {
        key: times[i].key,
        at: times[i].at,
        msLeft: times[i].at.getTime() - now.getTime(),
        prevAt: prev,
        intervalMs: times[i].at.getTime() - prev.getTime(),
      };
    }
  }
  const at = parseTimeToday(cleanTime(timings.Fajr));
  at.setDate(at.getDate() + 1);
  const prev = parseTimeToday(cleanTime(timings.Isha));
  return {
    key: "Fajr",
    at,
    msLeft: at.getTime() - now.getTime(),
    prevAt: prev,
    intervalMs: at.getTime() - prev.getTime(),
  };
}

export function formatHMS(ms: number): string {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function formatTime12(hhmm: string, lang: "ar" | "en"): string {
  const [h, m] = cleanTime(hhmm)
    .split(":")
    .map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}
