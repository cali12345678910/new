/**
 * Utilities for Arabic text normalization, diacritics stripping, and search
 */

// Regex for Arabic diacritics (Harakat and Tanween)
const TASHKEEL_REGEX = /[\u064B-\u065F\u0670\u0640]/g;

/**
 * Removes all Arabic diacritics and tatweel (kashida) from a string
 */
export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(TASHKEEL_REGEX, '');
}

/**
 * Normalizes Arabic text for flexible searching:
 * - Removes diacritics
 * - Normalizes various forms of Alif (أ, إ, آ, ٱ -> ا)
 * - Normalizes Taa Marbutah to Haa (ة -> ه)
 * - Normalizes Alif Maqsurah to Yaa (ى -> ي)
 * - Normalizes Hamzas (ؤ -> و, ئ -> ي)
 * - Trims and squashes multiple spaces
 */
export function normalizeArabicForSearch(text: string): string {
  if (!text) return '';
  return stripTashkeel(text)
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a search term matches a candidate string
 */
export function matchesQuery(candidate: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  const normalizedCandidate = normalizeArabicForSearch(candidate);
  const normalizedQuery = normalizeArabicForSearch(query);
  
  // Split query into words to match all tokens
  const tokens = normalizedQuery.split(' ').filter(Boolean);
  return tokens.every(token => normalizedCandidate.includes(token));
}
