// Athan reminder using Notification + real high-quality Athan audio.
import type { PrayerKey, Timings } from "./prayer-times";
import { cleanTime } from "./prayer-times";
import { getSettings, MUEZZINS } from "./settings";

const NAME: Record<PrayerKey, { ar: string; en: string }> = {
  Fajr: { ar: "الفجر", en: "Fajr" },
  Sunrise: { ar: "الشروق", en: "Sunrise" },
  Dhuhr: { ar: "الظهر", en: "Dhuhr" },
  Asr: { ar: "العصر", en: "Asr" },
  Maghrib: { ar: "المغرب", en: "Maghrib" },
  Isha: { ar: "العشاء", en: "Isha" },
};

let timers: number[] = [];
const fired = new Set<string>();
let currentAudio: HTMLAudioElement | null = null;

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission === "default") return await Notification.requestPermission();
  return Notification.permission;
}

export function clearAthanSchedule() {
  timers.forEach((id) => window.clearTimeout(id));
  timers = [];
}

export function muezzinUrl(id?: string): string {
  const m = MUEZZINS.find((x) => x.id === (id ?? getSettings().muezzin)) ?? MUEZZINS[0];
  return m.url;
}

export function playAthan(opts?: { muezzinId?: string; volume?: number }) {
  stopAthan();
  const url = muezzinUrl(opts?.muezzinId);
  const vol = opts?.volume ?? getSettings().volume;
  const a = new Audio(url);
  a.volume = Math.max(0, Math.min(1, vol));
  a.preload = "auto";
  a.play().catch(() => {/* user gesture required */});
  currentAudio = a;
  return a;
}

export function stopAthan() {
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch {}
    currentAudio = null;
  }
}

export function scheduleAthan(timings: Timings, lang: "ar" | "en") {
  clearAthanSchedule();
  const now = Date.now();
  (Object.keys(NAME) as PrayerKey[]).forEach((key) => {
    if (key === "Sunrise") return;
    const [h, m] = cleanTime(timings[key]).split(":").map((x) => parseInt(x, 10));
    const at = new Date();
    at.setHours(h, m, 0, 0);
    const tag = `${at.toDateString()}-${key}`;
    if (fired.has(tag)) return;
    const delay = at.getTime() - now;
    if (delay <= 0 || delay > 24 * 3600 * 1000) return;
    const id = window.setTimeout(() => {
      fired.add(tag);
      playAthan();
      try {
        new Notification(lang === "ar" ? `حان الآن وقت ${NAME[key].ar}` : `It's time for ${NAME[key].en}`, {
          body: lang === "ar" ? "حيّ على الصلاة • حيّ على الفلاح" : "Hayya 'ala as-salah • Hayya 'ala al-falah",
          silent: false,
        });
      } catch {}
    }, delay);
    timers.push(id);
  });
}

export function playChime() {
  try {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const now = ctx.currentTime;
    const tones = [523.25, 659.25, 783.99, 1046.5];
    tones.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + i * 0.35);
      g.gain.exponentialRampToValueAtTime(0.18, now + i * 0.35 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 0.55);
      o.connect(g).connect(ctx.destination);
      o.start(now + i * 0.35);
      o.stop(now + i * 0.35 + 0.6);
    });
    setTimeout(() => ctx.close(), 3000);
  } catch {}
}
