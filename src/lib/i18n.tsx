import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const t_dict: Dict = {
  app_name: { ar: "الْمَقَام", en: "Al-Maqam" },
  app_name_full: { ar: "الْمَقَام", en: "Al-Maqam" },
  app_tag: { ar: "منصّتك الإسلامية الفاخرة للصلاة والقرآن والذكر", en: "Your premium Islamic platform for prayer, Qur'an & dhikr" },
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_prayer: { ar: "الصلاة", en: "Prayer Times" },
  nav_quran: { ar: "القرآن", en: "Qur'an" },
  nav_dhikr: { ar: "الأذكار", en: "Dhikr" },
  nav_qibla: { ar: "القبلة", en: "Qibla" },
  nav_tasbeeh: { ar: "المسبحة", en: "Tasbeeh" },
  change_location: { ar: "تغيير الموقع", en: "Change location" },
  detect_location: { ar: "تحديد موقعي", en: "Detect my location" },
  next_prayer: { ar: "الصلاة القادمة", en: "Next prayer" },
  in_time: { ar: "بعد", en: "in" },
  fajr: { ar: "الفجر", en: "Fajr" },
  sunrise: { ar: "الشروق", en: "Sunrise" },
  dhuhr: { ar: "الظهر", en: "Dhuhr" },
  asr: { ar: "العصر", en: "Asr" },
  maghrib: { ar: "المغرب", en: "Maghrib" },
  isha: { ar: "العشاء", en: "Isha" },
  midnight: { ar: "منتصف الليل", en: "Midnight" },
  today_dhikr: { ar: "ذكر اليوم", en: "Today's dhikr" },
  qibla_dir: { ar: "اتجاه القبلة", en: "Qibla direction" },
  degrees_to_kaaba: { ar: "درجة إلى الكعبة", en: "Degrees to the Kaaba" },
  degrees_from_north: { ar: "درجة من الشمال", en: "from North" },
  monthly_calendar: { ar: "تقويم الشهر", en: "Monthly calendar" },
  surah: { ar: "سورة", en: "Surah" },
  juz: { ar: "جزء", en: "Juz" },
  bookmarks: { ar: "العلامات", en: "Bookmarks" },
  reciter: { ar: "القارئ", en: "Reciter" },
  play: { ar: "استماع", en: "Listen" },
  search: { ar: "بحث", en: "Search" },
  reset: { ar: "إعادة", en: "Reset" },
  count: { ar: "العدد", en: "Count" },
  cycle: { ar: "دورة", en: "Cycles" },
  enable_athan: { ar: "تفعيل الأذان", en: "Enable Athan" },
  athan_enabled: { ar: "الأذان مُفعّل", en: "Athan enabled" },
  preview_athan: { ar: "استماع تجريبي", en: "Preview athan" },
  muezzin: { ar: "المؤذن", en: "Muezzin" },
  volume: { ar: "مستوى الصوت", en: "Volume" },
  settings: { ar: "الإعدادات", en: "Settings" },
  calc_method: { ar: "طريقة الحساب", en: "Calculation method" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  save: { ar: "حفظ", en: "Save" },
  close: { ar: "إغلاق", en: "Close" },
  install_app: { ar: "تثبيت التطبيق", en: "Install app" },
  loading: { ar: "جاري التحميل…", en: "Loading…" },
  morning: { ar: "أذكار الصباح", en: "Morning remembrance" },
  evening: { ar: "أذكار المساء", en: "Evening remembrance" },
  after_prayer: { ar: "أذكار بعد الصلاة", en: "After-prayer dhikr" },
  sleep: { ar: "أذكار النوم", en: "Before sleep" },
  travel: { ar: "أذكار السفر", en: "Travel dhikr" },
  general: { ar: "أذكار عامة", en: "General dhikr" },
  open: { ar: "فتح", en: "Open" },
  back: { ar: "رجوع", en: "Back" },
  hijri: { ar: "هجري", en: "Hijri" },
  gregorian: { ar: "ميلادي", en: "Gregorian" },
  language: { ar: "اللغة", en: "Language" },
  privacy_note: { ar: "بدون إعلانات • منصّة فاخرة • تحترم خصوصيتك", en: "Ad-free • Premium platform • Respects your privacy" },
  completed: { ar: "اكتمل", en: "Completed" },
  tap_to_count: { ar: "اضغط للعد", en: "Tap to count" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof t_dict) => string; dir: "rtl" | "ltr" };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.add("dark");
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: keyof typeof t_dict) => t_dict[k]?.[lang] ?? String(k);
  return <I18nCtx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("I18nProvider missing");
  return c;
}
