// Dashboard section model for v4's "Section Management" feature.
// The home page renders these blocks in the user's saved order (Settings →
// Layout). `kind` lets the dashboard group consecutive "card" sections into a
// responsive grid so the default order keeps the original 3-up card row.

export type SectionId = "prayer" | "times" | "qibla" | "dhikr" | "quran";

export type SectionMeta = {
  id: SectionId;
  ar: string;
  en: string;
  kind: "block" | "card";
};

export const SECTIONS: SectionMeta[] = [
  { id: "prayer", ar: "الصلاة القادمة", en: "Next Prayer", kind: "block" },
  { id: "times", ar: "مواقيت اليوم", en: "Prayer Times", kind: "block" },
  { id: "qibla", ar: "اتجاه القبلة", en: "Qibla", kind: "card" },
  { id: "dhikr", ar: "ذكر اليوم", en: "Today's Dhikr", kind: "card" },
  { id: "quran", ar: "آية اليوم", en: "Ayah of the Day", kind: "card" },
];

export const DEFAULT_SECTION_ORDER: SectionId[] = SECTIONS.map((s) => s.id);

const VALID = new Set<string>(DEFAULT_SECTION_ORDER);

/** Sanitize a stored order: keep known ids, drop dupes, append any missing. */
export function normalizeOrder(order: readonly string[] | undefined): SectionId[] {
  const seen = new Set<SectionId>();
  const out: SectionId[] = [];
  for (const id of order ?? []) {
    if (VALID.has(id) && !seen.has(id as SectionId)) {
      seen.add(id as SectionId);
      out.push(id as SectionId);
    }
  }
  for (const id of DEFAULT_SECTION_ORDER) if (!seen.has(id)) out.push(id);
  return out;
}

export function getSection(id: SectionId): SectionMeta {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
}

/** Move an item up (-1) or down (+1) within the order, returning a new array. */
export function moveSection(order: SectionId[], id: SectionId, dir: -1 | 1): SectionId[] {
  const i = order.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= order.length) return order;
  const next = order.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
