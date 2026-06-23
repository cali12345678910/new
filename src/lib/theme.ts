// UI customization engine for Al-Maqam v3.
// Accents, appearance (background) presets, Arabic fonts and a reading scale
// are stored in Settings and applied as CSS custom properties on <html>.

export type AccentId =
  | "gold"
  | "emerald"
  | "sapphire"
  | "ruby"
  | "amethyst"
  | "rose"
  | "teal"
  | "bronze";

export type Accent = {
  id: AccentId;
  ar: string;
  en: string;
  rgb: string; // space-separated "r g b" for rgb(var() / a)
  deep: string;
  base: string;
  bright: string;
  tint: string;
};

export const ACCENTS: Accent[] = [
  {
    id: "gold",
    ar: "ذهبي",
    en: "Gold",
    rgb: "212 175 55",
    deep: "#8a6b1a",
    base: "#d4af37",
    bright: "#ffd700",
    tint: "#f5e9c8",
  },
  {
    id: "emerald",
    ar: "زمردي",
    en: "Emerald",
    rgb: "16 185 129",
    deep: "#065f46",
    base: "#10b981",
    bright: "#34d399",
    tint: "#d1fae5",
  },
  {
    id: "sapphire",
    ar: "ياقوتي أزرق",
    en: "Sapphire",
    rgb: "59 130 246",
    deep: "#1e3a8a",
    base: "#3b82f6",
    bright: "#60a5fa",
    tint: "#dbeafe",
  },
  {
    id: "ruby",
    ar: "ياقوتي أحمر",
    en: "Ruby",
    rgb: "225 29 72",
    deep: "#881337",
    base: "#e11d48",
    bright: "#fb7185",
    tint: "#ffe4e6",
  },
  {
    id: "amethyst",
    ar: "جمشتي",
    en: "Amethyst",
    rgb: "139 92 246",
    deep: "#4c1d95",
    base: "#8b5cf6",
    bright: "#a78bfa",
    tint: "#ede9fe",
  },
  {
    id: "rose",
    ar: "وردي",
    en: "Rose",
    rgb: "236 72 153",
    deep: "#9d174d",
    base: "#ec4899",
    bright: "#f9a8d4",
    tint: "#fce7f3",
  },
  {
    id: "teal",
    ar: "فيروزي",
    en: "Teal",
    rgb: "20 184 166",
    deep: "#134e4a",
    base: "#14b8a6",
    bright: "#2dd4bf",
    tint: "#ccfbf1",
  },
  {
    id: "bronze",
    ar: "برونزي",
    en: "Bronze",
    rgb: "192 132 86",
    deep: "#7c4a21",
    base: "#c08456",
    bright: "#e0b088",
    tint: "#f3e2d0",
  },
];

export type AppearanceId = "obsidian" | "midnight" | "charcoal" | "sepia" | "ivory";

export type Appearance = {
  id: AppearanceId;
  ar: string;
  en: string;
  dark: boolean;
  vars: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
  };
};

export const APPEARANCES: Appearance[] = [
  {
    id: "obsidian",
    ar: "الأسود الفاخر",
    en: "Obsidian",
    dark: true,
    vars: {
      background: "#0a0a0a",
      foreground: "#f5e9c8",
      card: "#111111",
      cardForeground: "#f5e9c8",
      popover: "#0f0f0f",
      popoverForeground: "#f5e9c8",
      secondary: "#161616",
      secondaryForeground: "#f5e9c8",
      muted: "#141414",
      mutedForeground: "#b8a96b",
      accent: "#1c1710",
      accentForeground: "#f5e9c8",
    },
  },
  {
    id: "midnight",
    ar: "أزرق ليلي",
    en: "Midnight",
    dark: true,
    vars: {
      background: "#070b14",
      foreground: "#e7edf8",
      card: "#0d1320",
      cardForeground: "#e7edf8",
      popover: "#0b1019",
      popoverForeground: "#e7edf8",
      secondary: "#111a2b",
      secondaryForeground: "#e7edf8",
      muted: "#0f1726",
      mutedForeground: "#9fb0c9",
      accent: "#16203a",
      accentForeground: "#e7edf8",
    },
  },
  {
    id: "charcoal",
    ar: "رمادي فحمي",
    en: "Charcoal",
    dark: true,
    vars: {
      background: "#161616",
      foreground: "#ededed",
      card: "#1e1e1e",
      cardForeground: "#ededed",
      popover: "#1a1a1a",
      popoverForeground: "#ededed",
      secondary: "#242424",
      secondaryForeground: "#ededed",
      muted: "#202020",
      mutedForeground: "#a8a8a8",
      accent: "#2a2a2a",
      accentForeground: "#ededed",
    },
  },
  {
    id: "sepia",
    ar: "ورقي دافئ",
    en: "Sepia",
    dark: false,
    vars: {
      background: "#f3ead6",
      foreground: "#2c2415",
      card: "#fbf4e4",
      cardForeground: "#2c2415",
      popover: "#fbf4e4",
      popoverForeground: "#2c2415",
      secondary: "#ece0c6",
      secondaryForeground: "#2c2415",
      muted: "#ece1c8",
      mutedForeground: "#7a6b4a",
      accent: "#e6d6b4",
      accentForeground: "#2c2415",
    },
  },
  {
    id: "ivory",
    ar: "عاجي فاتح",
    en: "Ivory",
    dark: false,
    vars: {
      background: "#fafaf7",
      foreground: "#1b1b1a",
      card: "#ffffff",
      cardForeground: "#1b1b1a",
      popover: "#ffffff",
      popoverForeground: "#1b1b1a",
      secondary: "#f1f1ee",
      secondaryForeground: "#1b1b1a",
      muted: "#f3f3f0",
      mutedForeground: "#6b6b66",
      accent: "#ececea",
      accentForeground: "#1b1b1a",
    },
  },
];

export type ArabicFontId = "amiri-quran" | "amiri" | "scheherazade" | "naskh" | "cairo" | "reem";

export const ARABIC_FONTS: { id: ArabicFontId; ar: string; en: string; stack: string }[] = [
  {
    id: "amiri-quran",
    ar: "أميري قرآن",
    en: "Amiri Quran",
    stack: '"Amiri Quran", "Amiri", serif',
  },
  { id: "amiri", ar: "أميري", en: "Amiri", stack: '"Amiri", "Amiri Quran", serif' },
  {
    id: "scheherazade",
    ar: "شهرزاد",
    en: "Scheherazade",
    stack: '"Scheherazade New", "Amiri", serif',
  },
  { id: "naskh", ar: "نسخ", en: "Naskh", stack: '"Noto Naskh Arabic", "Amiri", serif' },
  { id: "cairo", ar: "القاهرة", en: "Cairo", stack: '"Cairo", sans-serif' },
  { id: "reem", ar: "ريم كوفي", en: "Reem Kufi", stack: '"Reem Kufi", "Cairo", sans-serif' },
];

export const FONT_SCALES: { id: string; ar: string; en: string; value: number }[] = [
  { id: "sm", ar: "صغير", en: "Small", value: 0.9 },
  { id: "md", ar: "متوسط", en: "Medium", value: 1 },
  { id: "lg", ar: "كبير", en: "Large", value: 1.15 },
  { id: "xl", ar: "أكبر", en: "Extra", value: 1.3 },
];

export type ThemeSettings = {
  accent: AccentId;
  appearance: AppearanceId;
  arabicFont: ArabicFontId;
  fontScale: number;
  reduceMotion: boolean;
};

export const DEFAULT_THEME: ThemeSettings = {
  accent: "gold",
  appearance: "obsidian",
  arabicFont: "amiri-quran",
  fontScale: 1,
  reduceMotion: false,
};

export function getAccent(id: AccentId): Accent {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}

export function getAppearance(id: AppearanceId): Appearance {
  return APPEARANCES.find((a) => a.id === id) ?? APPEARANCES[0];
}

/**
 * Builds a tiny synchronous script (run in <head> before first paint) that
 * applies the saved theme/lang from localStorage. This prevents a flash of the
 * default obsidian/gold theme when the user has saved a different appearance.
 * It mirrors applyTheme + I18nProvider's dir/lang side-effects, reusing the same
 * lookup tables so there is a single source of truth.
 */
export function buildThemeInitScript(): string {
  const accents = Object.fromEntries(
    ACCENTS.map((a) => [
      a.id,
      { rgb: a.rgb, deep: a.deep, base: a.base, bright: a.bright, tint: a.tint },
    ]),
  );
  const appearances = Object.fromEntries(
    APPEARANCES.map((a) => [a.id, { dark: a.dark, vars: a.vars }]),
  );
  const fonts = Object.fromEntries(ARABIC_FONTS.map((f) => [f.id, f.stack]));
  const data = JSON.stringify({ accents, appearances, fonts, def: DEFAULT_THEME });
  return `(function(){try{var D=${data};var r=document.documentElement;var s={};try{s=JSON.parse(localStorage.getItem("almaqam.settings")||"{}")||{}}catch(e){}var t=Object.assign({},D.def,s);var ac=D.accents[t.accent]||D.accents[D.def.accent];var ap=D.appearances[t.appearance]||D.appearances[D.def.appearance];var fn=D.fonts[t.arabicFont]||D.fonts[D.def.arabicFont];var set=function(k,v){r.style.setProperty(k,v)};set("--accent-rgb",ac.rgb);set("--gold-deep",ac.deep);set("--gold",ac.base);set("--gold-bright",ac.bright);set("--gold-tint",ap.dark?ac.tint:ac.deep);set("--primary",ac.base);set("--primary-foreground","#0a0a0a");set("--ring",ac.base);var v=ap.vars;set("--background",v.background);set("--foreground",v.foreground);set("--card",v.card);set("--card-foreground",v.cardForeground);set("--popover",v.popover);set("--popover-foreground",v.popoverForeground);set("--secondary",v.secondary);set("--secondary-foreground",v.secondaryForeground);set("--muted",v.muted);set("--muted-foreground",v.mutedForeground);set("--accent",v.accent);set("--accent-foreground",v.accentForeground);set("--font-arabic",fn);set("--reader-scale",String(t.fontScale));r.classList.toggle("dark",!!ap.dark);r.classList.toggle("reduce-motion",!!t.reduceMotion);r.style.colorScheme=ap.dark?"dark":"light";var lang=null;try{lang=localStorage.getItem("lang")}catch(e){}if(lang==="ar"||lang==="en"){r.lang=lang;r.dir=lang==="ar"?"rtl":"ltr"}}catch(e){}})();`;
}

export function applyTheme(t: ThemeSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const accent = getAccent(t.accent);
  const appearance = getAppearance(t.appearance);
  const font = ARABIC_FONTS.find((f) => f.id === t.arabicFont) ?? ARABIC_FONTS[0];

  const set = (k: string, v: string) => root.style.setProperty(k, v);

  set("--accent-rgb", accent.rgb);
  set("--gold-deep", accent.deep);
  set("--gold", accent.base);
  set("--gold-bright", accent.bright);
  set("--gold-tint", appearance.dark ? accent.tint : accent.deep);
  set("--primary", accent.base);
  set("--primary-foreground", appearance.dark ? "#0a0a0a" : "#0a0a0a");
  set("--ring", accent.base);

  const v = appearance.vars;
  set("--background", v.background);
  set("--foreground", v.foreground);
  set("--card", v.card);
  set("--card-foreground", v.cardForeground);
  set("--popover", v.popover);
  set("--popover-foreground", v.popoverForeground);
  set("--secondary", v.secondary);
  set("--secondary-foreground", v.secondaryForeground);
  set("--muted", v.muted);
  set("--muted-foreground", v.mutedForeground);
  set("--accent", v.accent);
  set("--accent-foreground", v.accentForeground);

  set("--font-arabic", font.stack);
  set("--reader-scale", String(t.fontScale));

  root.classList.toggle("dark", appearance.dark);
  root.classList.toggle("reduce-motion", t.reduceMotion);
  root.style.colorScheme = appearance.dark ? "dark" : "light";
}
