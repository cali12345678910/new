// User-configurable settings: calculation method, athan muezzin, volume,
// notifications, plus full UI customization (theme/appearance/fonts) for v3.
import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, type AccentId, type AppearanceId, type ArabicFontId } from "./theme";
import { DEFAULT_SECTION_ORDER, normalizeOrder, type SectionId } from "./sections";

export const CALC_METHODS = [
  { id: 4, ar: "أم القرى (مكة المكرمة)", en: "Umm Al-Qura, Makkah" },
  { id: 3, ar: "رابطة العالم الإسلامي", en: "Muslim World League" },
  { id: 2, ar: "الجمعية الإسلامية لأمريكا الشمالية", en: "ISNA (North America)" },
  { id: 5, ar: "الهيئة المصرية العامة للمساحة", en: "Egyptian General Authority" },
  { id: 1, ar: "جامعة كراتشي", en: "University of Karachi" },
  { id: 8, ar: "دول الخليج", en: "Gulf Region" },
  { id: 9, ar: "الكويت", en: "Kuwait" },
  { id: 10, ar: "قطر", en: "Qatar" },
  { id: 13, ar: "ديانة (تركيا)", en: "Diyanet (Turkey)" },
  { id: 15, ar: "لجنة رؤية الهلال العالمية", en: "Moonsighting Worldwide" },
] as const;

export type MuezzinId = "makkah" | "madinah" | "aqsa" | "alafasy";

export const MUEZZINS: { id: MuezzinId; ar: string; en: string; url: string }[] = [
  {
    id: "makkah",
    ar: "الحرم المكي",
    en: "Makkah — Al-Haram",
    url: "https://www.islamcan.com/audio/adhan/azan2.mp3",
  },
  {
    id: "madinah",
    ar: "المسجد النبوي",
    en: "Madinah — Al-Nabawi",
    url: "https://www.islamcan.com/audio/adhan/azan1.mp3",
  },
  {
    id: "aqsa",
    ar: "المسجد الأقصى",
    en: "Al-Aqsa",
    url: "https://www.islamcan.com/audio/adhan/azan4.mp3",
  },
  {
    id: "alafasy",
    ar: "مشاري العفاسي",
    en: "Mishary Al-Afasy",
    url: "https://www.islamcan.com/audio/adhan/azan3.mp3",
  },
];

export type Settings = {
  calcMethod: number;
  muezzin: MuezzinId;
  volume: number; // 0..1
  notifications: boolean;
  reciter: string;
  // UI customization (v3)
  accent: AccentId;
  appearance: AppearanceId;
  arabicFont: ArabicFontId;
  fontScale: number;
  reduceMotion: boolean;
  showTranslit: boolean;
  showTranslation: boolean;
  // v4: optional custom accent hex (overrides `accent`) + dashboard section order
  customAccent: string | null;
  sectionOrder: SectionId[];
};

const KEY = "almaqam.settings";

export const DEFAULT_SETTINGS: Settings = {
  calcMethod: 4,
  muezzin: "makkah",
  volume: 0.85,
  notifications: false,
  reciter: "ar.alafasy",
  accent: DEFAULT_THEME.accent,
  appearance: DEFAULT_THEME.appearance,
  arabicFont: DEFAULT_THEME.arabicFont,
  fontScale: DEFAULT_THEME.fontScale,
  reduceMotion: DEFAULT_THEME.reduceMotion,
  showTranslit: true,
  showTranslation: true,
  customAccent: null,
  sectionOrder: DEFAULT_SECTION_ORDER,
};

let _settings: Settings = DEFAULT_SETTINGS;
const listeners = new Set<() => void>();

function load(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const merged = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      merged.sectionOrder = normalizeOrder(merged.sectionOrder);
      return merged;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

if (typeof window !== "undefined") _settings = load();

export function getSettings(): Settings {
  return _settings;
}
export function setSettings(patch: Partial<Settings>) {
  _settings = { ..._settings, ...patch };
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(_settings));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSettings(): [Settings, (p: Partial<Settings>) => void] {
  const s = useSyncExternalStore(
    subscribe,
    () => _settings,
    () => DEFAULT_SETTINGS,
  );
  return [s, setSettings];
}
