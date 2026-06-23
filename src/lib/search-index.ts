// Local search corpus for the global fuzzy search bar (Feature 1, v4).
// Everything is built from in-repo data (DHIKR + SURAHS) so search is fully
// offline, instant, and never touches a third-party text feed (see CONTENT-POLICY).
import Fuse, { type IFuseOptions } from "fuse.js";
import { DHIKR } from "./dhikr-data";
import { SURAHS } from "./quran-meta";

export type SearchDoc = {
  kind: "dhikr" | "quran";
  id: string;
  // Display fields
  primary: string; // main (Arabic) line
  secondary: string; // translation / latin name
  translit: string; // optional transliteration (dhikr)
  meta: string; // category / surah label
  // Navigation
  to: string;
  param?: string; // value for the $id route param when present
  // Searchable-only helpers
  numberStr: string;
};

function buildDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const cat of DHIKR) {
    cat.items.forEach((item, idx) => {
      docs.push({
        kind: "dhikr",
        id: `dhikr:${cat.id}:${idx}`,
        primary: item.ar,
        secondary: item.en ?? "",
        translit: item.translit ?? "",
        meta: cat.title_ar,
        to: "/dhikr",
        numberStr: "",
      });
    });
  }

  for (const s of SURAHS) {
    docs.push({
      kind: "quran",
      id: `quran:${s.number}`,
      primary: s.name,
      secondary: `${s.englishName} · ${s.englishNameTranslation}`,
      translit: "",
      meta: `${s.number} · ${s.revelationType}`,
      to: "/quran/$id",
      param: String(s.number),
      numberStr: String(s.number),
    });
  }

  return docs;
}

export const SEARCH_DOCS: SearchDoc[] = buildDocs();

const OPTIONS: IFuseOptions<SearchDoc> = {
  includeMatches: true,
  threshold: 0.4, // typo tolerance
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: "primary", weight: 2 },
    { name: "secondary", weight: 1.5 },
    { name: "translit", weight: 1 },
    { name: "meta", weight: 0.5 },
    { name: "numberStr", weight: 0.5 },
  ],
};

export const searchFuse = new Fuse(SEARCH_DOCS, OPTIONS);
