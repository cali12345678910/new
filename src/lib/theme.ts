// UI customization engine for Al-Maqam v3.
// Accents, appearance (background) presets, Arabic fonts and a reading scale
// are stored in Settings and applied as CSS custom properties on <html>.

export type AccentId = string;

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

// --- Color math (shared by accents + the custom color picker) ----------------
// Kept tiny and dependency-free so the same logic can be mirrored inside the
// synchronous <head> init script (see buildThemeInitScript).
function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function mix(a: [number, number, number], b: [number, number, number], t: number): string {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const BLACK: [number, number, number] = [0, 0, 0];
const WHITE: [number, number, number] = [255, 255, 255];

/** Derive a full accent ramp (deep/base/bright/tint + rgb triplet) from one hex. */
export function deriveAccent(hex: string): Omit<Accent, "id" | "ar" | "en"> | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return {
    rgb: rgb.join(" "),
    deep: mix(rgb, BLACK, 0.45),
    base: mix(rgb, BLACK, 0),
    bright: mix(rgb, WHITE, 0.32),
    tint: mix(rgb, WHITE, 0.8),
  };
}

/** Accent built purely from a base hex, used for the extended palette. */
function accent(id: string, ar: string, en: string, base: string): Accent {
  const d = deriveAccent(base)!;
  return { id, ar, en, ...d };
}

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
  // Extended accents (derived from a single base hex for a consistent ramp).
  accent("amber", "كهرماني", "Amber", "#f59e0b"),
  accent("sky", "سماوي", "Sky", "#0ea5e9"),
  accent("indigo", "نيلي", "Indigo", "#6366f1"),
  accent("lime", "ليموني", "Lime", "#84cc16"),
  accent("crimson", "قرمزي", "Crimson", "#dc2626"),
  accent("magenta", "أرجواني", "Magenta", "#d946ef"),
  accent("cyan", "سماوي فاتح", "Cyan", "#06b6d4"),
  accent("forest", "أخضر غابي", "Forest", "#15803d"),
  accent("copper", "نحاسي", "Copper", "#b45309"),
  accent("slate", "رمادي أزرق", "Slate", "#64748b"),
  accent("turquoise", "تركوازي", "Turquoise", "#0d9488"),
  accent("plum", "خوخي", "Plum", "#9333ea"),
];

export type AppearanceId = string;

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

// Compact appearance factory: a theme is fully described by 7 colors. Popover
// mirrors card and the foregrounds are shared, which keeps the 50+ palette below
// readable and consistent while preserving the full Appearance shape.
function mkAppearance(
  id: string,
  ar: string,
  en: string,
  dark: boolean,
  c: {
    bg: string;
    fg: string;
    card: string;
    secondary: string;
    muted: string;
    mutedFg: string;
    accent: string;
  },
): Appearance {
  return {
    id,
    ar,
    en,
    dark,
    vars: {
      background: c.bg,
      foreground: c.fg,
      card: c.card,
      cardForeground: c.fg,
      popover: c.card,
      popoverForeground: c.fg,
      secondary: c.secondary,
      secondaryForeground: c.fg,
      muted: c.muted,
      mutedForeground: c.mutedFg,
      accent: c.accent,
      accentForeground: c.fg,
    },
  };
}

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

  // ---- Deep / jewel-tone dark themes (Islamic geometric aesthetics) ----
  mkAppearance("emerald-night", "زمرّد ليلي", "Emerald Night", true, {
    bg: "#04130d",
    fg: "#d7f5e6",
    card: "#081d14",
    secondary: "#0c281c",
    muted: "#0a2218",
    mutedFg: "#84c7a6",
    accent: "#103024",
  }),
  mkAppearance("royal-blue", "أزرق ملكي", "Royal Blue", true, {
    bg: "#060c1c",
    fg: "#e3eaff",
    card: "#0b1430",
    secondary: "#111d44",
    muted: "#0e1838",
    mutedFg: "#9fb2e0",
    accent: "#16245a",
  }),
  mkAppearance("deep-purple", "بنفسجي عميق", "Deep Purple", true, {
    bg: "#0f0720",
    fg: "#ece4ff",
    card: "#170d30",
    secondary: "#221546",
    muted: "#1c1038",
    mutedFg: "#b9a6e6",
    accent: "#2a1a55",
  }),
  mkAppearance("wine", "نبيذي", "Wine", true, {
    bg: "#1a0510",
    fg: "#ffe1ec",
    card: "#260a18",
    secondary: "#361022",
    muted: "#2d0c1c",
    mutedFg: "#d99bb4",
    accent: "#431428",
  }),
  mkAppearance("teal-deep", "فيروزي عميق", "Deep Teal", true, {
    bg: "#03120f",
    fg: "#d5f3ee",
    card: "#07201b",
    secondary: "#0b2c26",
    muted: "#0a2620",
    mutedFg: "#80c6bb",
    accent: "#0f352d",
  }),
  mkAppearance("forest-night", "غابة ليلية", "Forest Night", true, {
    bg: "#07140a",
    fg: "#dcf3da",
    card: "#0c2011",
    secondary: "#122c18",
    muted: "#102714",
    mutedFg: "#93c596",
    accent: "#173420",
  }),
  mkAppearance("espresso", "إسبريسو", "Espresso", true, {
    bg: "#140d08",
    fg: "#f0e2d2",
    card: "#20150c",
    secondary: "#2c1d11",
    muted: "#261810",
    mutedFg: "#c4a888",
    accent: "#34230f",
  }),
  mkAppearance("graphite", "جرافيت", "Graphite", true, {
    bg: "#0d0f12",
    fg: "#e6eaef",
    card: "#14171c",
    secondary: "#1d2128",
    muted: "#181c22",
    mutedFg: "#9aa3b0",
    accent: "#232830",
  }),
  mkAppearance("navy", "كحلي", "Navy", true, {
    bg: "#04081a",
    fg: "#dfe6f5",
    card: "#0a1130",
    secondary: "#101a44",
    muted: "#0d1638",
    mutedFg: "#93a4cc",
    accent: "#15224f",
  }),
  mkAppearance("plum-night", "برقوقي ليلي", "Plum Night", true, {
    bg: "#16071a",
    fg: "#f4e2f7",
    card: "#220c28",
    secondary: "#311338",
    muted: "#29102f",
    mutedFg: "#cb9ed1",
    accent: "#3d1846",
  }),
  mkAppearance("crimson-night", "قرمزي ليلي", "Crimson Night", true, {
    bg: "#1a0606",
    fg: "#ffe0e0",
    card: "#270b0b",
    secondary: "#371010",
    muted: "#2e0c0c",
    mutedFg: "#dc9b9b",
    accent: "#441616",
  }),
  mkAppearance("ocean", "محيطي", "Ocean", true, {
    bg: "#04121a",
    fg: "#d4f0fb",
    card: "#082029",
    secondary: "#0c2c39",
    muted: "#0a2731",
    mutedFg: "#82c4dc",
    accent: "#0f3545",
  }),
  mkAppearance("olive-dark", "زيتوني داكن", "Dark Olive", true, {
    bg: "#0f1106",
    fg: "#ecefd2",
    card: "#191c0c",
    secondary: "#232711",
    muted: "#1d2110",
    mutedFg: "#b9c088",
    accent: "#2b3014",
  }),
  mkAppearance("indigo-night", "نيلي ليلي", "Indigo Night", true, {
    bg: "#0a0820",
    fg: "#e6e6ff",
    card: "#110f30",
    secondary: "#1a1846",
    muted: "#151338",
    mutedFg: "#a6a6e6",
    accent: "#221f58",
  }),
  mkAppearance("slate-dark", "إردوازي داكن", "Dark Slate", true, {
    bg: "#0b0f14",
    fg: "#e2e8f0",
    card: "#131922",
    secondary: "#1c232e",
    muted: "#171d26",
    mutedFg: "#94a3b8",
    accent: "#222b38",
  }),
  mkAppearance("mocha", "موكا", "Mocha", true, {
    bg: "#120c0a",
    fg: "#efe3dc",
    card: "#1d1410",
    secondary: "#281c16",
    muted: "#221813",
    mutedFg: "#c2a594",
    accent: "#312218",
  }),
  mkAppearance("blackcurrant", "كشمش أسود", "Blackcurrant", true, {
    bg: "#0d0716",
    fg: "#e9e1f5",
    card: "#160c24",
    secondary: "#201233",
    muted: "#1a0f2b",
    mutedFg: "#b3a0cf",
    accent: "#281850",
  }),
  mkAppearance("pine", "صنوبري", "Pine", true, {
    bg: "#06160e",
    fg: "#d4efe4",
    card: "#0a201b",
    secondary: "#102c25",
    muted: "#0d261f",
    mutedFg: "#82c2ab",
    accent: "#143329",
  }),
  mkAppearance("petrol", "أزرق بترولي", "Petrol", true, {
    bg: "#041417",
    fg: "#d2f0f2",
    card: "#082327",
    secondary: "#0c3036",
    muted: "#0a2a30",
    mutedFg: "#80c5cc",
    accent: "#0f3a42",
  }),
  mkAppearance("aubergine", "باذنجاني", "Aubergine", true, {
    bg: "#14081a",
    fg: "#f0e3f5",
    card: "#1f0e28",
    secondary: "#2c1538",
    muted: "#25102f",
    mutedFg: "#c6a3d1",
    accent: "#371a48",
  }),

  // ---- Warm sands / earthy ----
  mkAppearance("desert-sand", "رمال صحراوية", "Desert Sand", false, {
    bg: "#f7efe0",
    fg: "#3a2e1c",
    card: "#fff9ee",
    secondary: "#efe3cd",
    muted: "#f1e6d3",
    mutedFg: "#8a7551",
    accent: "#ead9bb",
  }),
  mkAppearance("dune", "كثبان", "Dune", false, {
    bg: "#f5eede",
    fg: "#41331f",
    card: "#fdf7ea",
    secondary: "#ece0c8",
    muted: "#efe4cf",
    mutedFg: "#927a52",
    accent: "#e6d6b6",
  }),
  mkAppearance("terracotta", "طيني", "Terracotta", false, {
    bg: "#f8ede6",
    fg: "#4a2c1e",
    card: "#fff6f0",
    secondary: "#f0ddd0",
    muted: "#f2e1d6",
    mutedFg: "#9c6f57",
    accent: "#ecccba",
  }),
  mkAppearance("clay-dark", "طيني داكن", "Dark Clay", true, {
    bg: "#1a0f09",
    fg: "#f3e0d2",
    card: "#271810",
    secondary: "#352016",
    muted: "#2d1b12",
    mutedFg: "#c79e84",
    accent: "#3f2718",
  }),
  mkAppearance("camel", "جملي", "Camel", false, {
    bg: "#f6efe3",
    fg: "#43341f",
    card: "#fef8ed",
    secondary: "#ece1cb",
    muted: "#efe5d1",
    mutedFg: "#927c54",
    accent: "#e7d8ba",
  }),
  mkAppearance("sahara", "صحراء", "Sahara", false, {
    bg: "#faf2dd",
    fg: "#463413",
    card: "#fff9e8",
    secondary: "#f2e6c4",
    muted: "#f5ead0",
    mutedFg: "#997f47",
    accent: "#eedcae",
  }),

  // ---- Organic greens ----
  mkAppearance("sage", "ميرمية", "Sage", false, {
    bg: "#eef2e9",
    fg: "#2c3424",
    card: "#f8fbf3",
    secondary: "#e1e9d6",
    muted: "#e6edda",
    mutedFg: "#6c7a5b",
    accent: "#d8e3c8",
  }),
  mkAppearance("mint", "نعناعي", "Mint", false, {
    bg: "#e9f5ee",
    fg: "#1f3a2c",
    card: "#f4fbf7",
    secondary: "#d6ebe0",
    muted: "#ddeee5",
    mutedFg: "#5d8270",
    accent: "#cbe6d6",
  }),
  mkAppearance("moss", "طحلبي", "Moss", false, {
    bg: "#eef0e4",
    fg: "#313620",
    card: "#f7f9ee",
    secondary: "#e0e4cf",
    muted: "#e6e9d6",
    mutedFg: "#6f7650",
    accent: "#d6dcbe",
  }),
  mkAppearance("matcha", "ماتشا", "Matcha", false, {
    bg: "#eef4e2",
    fg: "#2f3a1c",
    card: "#f7fbee",
    secondary: "#e2eccd",
    muted: "#e8efd5",
    mutedFg: "#6f7e4c",
    accent: "#d9e6bb",
  }),
  mkAppearance("olive-light", "زيتوني فاتح", "Light Olive", false, {
    bg: "#f1f1e3",
    fg: "#36381f",
    card: "#fafaef",
    secondary: "#e5e5cb",
    muted: "#ebebd4",
    mutedFg: "#74754f",
    accent: "#dcdcb8",
  }),
  mkAppearance("fern", "سرخسي", "Fern", false, {
    bg: "#e8f3e9",
    fg: "#213a26",
    card: "#f3faf4",
    secondary: "#d4ebd7",
    muted: "#dceedd",
    mutedFg: "#5a8060",
    accent: "#c9e6cd",
  }),

  // ---- Soft pastels ----
  mkAppearance("blush", "وردي خجول", "Blush", false, {
    bg: "#fcedf1",
    fg: "#3f1f2a",
    card: "#fff6f8",
    secondary: "#f6dce3",
    muted: "#f8e3e9",
    mutedFg: "#9c6577",
    accent: "#f1ccd6",
  }),
  mkAppearance("lavender", "خزامى", "Lavender", false, {
    bg: "#f1ecfb",
    fg: "#2e2542",
    card: "#f9f6ff",
    secondary: "#e5dbf5",
    muted: "#ebe3f8",
    mutedFg: "#74679c",
    accent: "#ddd0f0",
  }),
  mkAppearance("sky-pastel", "سماوي باستيل", "Sky Pastel", false, {
    bg: "#e9f2fc",
    fg: "#1f2e42",
    card: "#f4f9ff",
    secondary: "#d6e6f6",
    muted: "#dfecf9",
    mutedFg: "#5d7896",
    accent: "#cbe0f3",
  }),
  mkAppearance("peach", "خوخي فاتح", "Peach", false, {
    bg: "#fdeee3",
    fg: "#432d1c",
    card: "#fff7f0",
    secondary: "#f8ddcc",
    muted: "#fae4d6",
    mutedFg: "#a17252",
    accent: "#f3cdb4",
  }),
  mkAppearance("lemon-cream", "كريمة الليمون", "Lemon Cream", false, {
    bg: "#fbf6df",
    fg: "#3f3814",
    card: "#fffcef",
    secondary: "#f4ecc4",
    muted: "#f7f0d1",
    mutedFg: "#908347",
    accent: "#eee3ac",
  }),
  mkAppearance("seafoam", "زبد البحر", "Seafoam", false, {
    bg: "#e6f5f1",
    fg: "#1c3a34",
    card: "#f2fbf8",
    secondary: "#d2ebe4",
    muted: "#dbeee9",
    mutedFg: "#588078",
    accent: "#c6e6dd",
  }),
  mkAppearance("periwinkle", "بنفسج فاتح", "Periwinkle", false, {
    bg: "#ecedfb",
    fg: "#28294a",
    card: "#f6f6ff",
    secondary: "#dde0f6",
    muted: "#e6e8f9",
    mutedFg: "#6a6d9c",
    accent: "#d2d6f1",
  }),
  mkAppearance("rosewater", "ماء الورد", "Rosewater", false, {
    bg: "#fceef0",
    fg: "#41262c",
    card: "#fff7f8",
    secondary: "#f6dee2",
    muted: "#f8e5e8",
    mutedFg: "#9d6b74",
    accent: "#f1cfd5",
  }),
  mkAppearance("powder-blue", "أزرق بودرة", "Powder Blue", false, {
    bg: "#eaf3f7",
    fg: "#1e333c",
    card: "#f4fafc",
    secondary: "#d8e9f0",
    muted: "#e0eef3",
    mutedFg: "#5c7d8a",
    accent: "#cce2eb",
  }),
  mkAppearance("lilac", "ليلكي", "Lilac", false, {
    bg: "#f4ecf8",
    fg: "#342440",
    card: "#fbf6fe",
    secondary: "#e9dcf2",
    muted: "#efe4f6",
    mutedFg: "#7e689c",
    accent: "#e2d2f0",
  }),

  // ---- Light papers / neutrals ----
  mkAppearance("paper-white", "أبيض ورقي", "Paper White", false, {
    bg: "#fbfbf9",
    fg: "#1d1d1b",
    card: "#ffffff",
    secondary: "#f0f0ec",
    muted: "#f4f4f0",
    mutedFg: "#6b6b64",
    accent: "#ebebe6",
  }),
  mkAppearance("linen", "كتّاني", "Linen", false, {
    bg: "#f6f3ec",
    fg: "#2e2a22",
    card: "#fdfbf5",
    secondary: "#eae5d9",
    muted: "#efeae0",
    mutedFg: "#7c7464",
    accent: "#e2dccd",
  }),
  mkAppearance("cloud", "غائم", "Cloud", false, {
    bg: "#f1f3f6",
    fg: "#21262e",
    card: "#fafbfd",
    secondary: "#e2e6ec",
    muted: "#e9edf2",
    mutedFg: "#66707e",
    accent: "#dbe0e8",
  }),
  mkAppearance("porcelain", "خزفي", "Porcelain", false, {
    bg: "#f8f9fb",
    fg: "#1f242b",
    card: "#ffffff",
    secondary: "#eceff3",
    muted: "#f1f3f7",
    mutedFg: "#69707c",
    accent: "#e4e8ee",
  }),
  mkAppearance("parchment", "رقّ", "Parchment", false, {
    bg: "#f5efe1",
    fg: "#36301d",
    card: "#fdf9ee",
    secondary: "#eae1cc",
    muted: "#efe7d4",
    mutedFg: "#847a5c",
    accent: "#e3d8bf",
  }),
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
  // Optional custom accent hex from the color picker; overrides `accent` when set.
  customAccent?: string | null;
  appearance: AppearanceId;
  arabicFont: ArabicFontId;
  fontScale: number;
  reduceMotion: boolean;
};

export const DEFAULT_THEME: ThemeSettings = {
  accent: "gold",
  customAccent: null,
  appearance: "obsidian",
  arabicFont: "amiri-quran",
  fontScale: 1,
  reduceMotion: false,
};

export function getAccent(id: AccentId): Accent {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}

/** The accent ramp actually applied: a valid custom hex wins over the preset. */
export function resolveAccent(t: Pick<ThemeSettings, "accent" | "customAccent">): Accent {
  if (t.customAccent) {
    const d = deriveAccent(t.customAccent);
    if (d) return { id: "custom", ar: "مخصّص", en: "Custom", ...d };
  }
  return getAccent(t.accent);
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
  return `(function(){try{var D=${data};var r=document.documentElement;var s={};try{s=JSON.parse(localStorage.getItem("almaqam.settings")||"{}")||{}}catch(e){}var t=Object.assign({},D.def,s);var hx=function(c){return c.map(function(v){return("0"+Math.round(v).toString(16)).slice(-2)}).join("")};var mix=function(a,b,k){return"#"+hx([a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k])};var dv=function(h){h=(""+h).trim().replace(/^#/,"");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];if(!/^[0-9a-f]{6}$/i.test(h))return null;var c=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];return{rgb:c.join(" "),deep:mix(c,[0,0,0],0.45),base:mix(c,[0,0,0],0),bright:mix(c,[255,255,255],0.32),tint:mix(c,[255,255,255],0.8)}};var ac=(t.customAccent&&dv(t.customAccent))||D.accents[t.accent]||D.accents[D.def.accent];var ap=D.appearances[t.appearance]||D.appearances[D.def.appearance];var fn=D.fonts[t.arabicFont]||D.fonts[D.def.arabicFont];var set=function(k,v){r.style.setProperty(k,v)};set("--accent-rgb",ac.rgb);set("--gold-deep",ac.deep);set("--gold",ac.base);set("--gold-bright",ac.bright);set("--gold-tint",ap.dark?ac.tint:ac.deep);set("--primary",ac.base);set("--primary-foreground","#0a0a0a");set("--ring",ac.base);var v=ap.vars;set("--background",v.background);set("--foreground",v.foreground);set("--card",v.card);set("--card-foreground",v.cardForeground);set("--popover",v.popover);set("--popover-foreground",v.popoverForeground);set("--secondary",v.secondary);set("--secondary-foreground",v.secondaryForeground);set("--muted",v.muted);set("--muted-foreground",v.mutedForeground);set("--accent",v.accent);set("--accent-foreground",v.accentForeground);set("--font-arabic",fn);set("--reader-scale",String(t.fontScale));r.classList.toggle("dark",!!ap.dark);r.classList.toggle("reduce-motion",!!t.reduceMotion);r.style.colorScheme=ap.dark?"dark":"light";var lang=null;try{lang=localStorage.getItem("lang")}catch(e){}if(lang==="ar"||lang==="en"){r.lang=lang;r.dir=lang==="ar"?"rtl":"ltr"}}catch(e){}})();`;
}

export function applyTheme(t: ThemeSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const accent = resolveAccent(t);
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
