# Al-Maqam — Content & Asset Policy

Al-Maqam is, and must remain, an **Islamic utility and text-reference app**. This
policy is a hard guardrail for every contributor (human or AI).

## 1. Text content is local and authentic only

- All reference text shipped with the app lives in-repo and is verified Islamic
  content only:
  - `src/lib/dhikr-data.ts` — Hisn al-Muslim adhkar with sources (Bukhari,
    Muslim, etc.) and the daily ayah.
  - `src/lib/quran-meta.ts` — Qur'an surah metadata (114 surahs), generated once
    from a known Qur'an source and then stored locally.
- **Do not** integrate any third-party content library, external book feed,
  general-purpose text API, user-generated-content source, or any unverified
  endpoint that could surface profane, inappropriate, or non-Islamic explicit
  material.
- The only runtime network calls allowed fetch **authentic Qur'an / prayer
  data** from reputable Islamic APIs:
  - Qur'an ayah text/audio (`api.alquran.cloud`) — Qur'anic scripture only.
  - Prayer times / Hijri date (`api.aladhan.com`).
  - Geocoding for the location picker (coordinates only, no text content).
    The fuzzy search index and the surah list are fully offline.

## 2. Assets are public-domain or open-licensed only

- Fonts: Google Fonts under the SIL Open Font License (Amiri, Scheherazade New,
  Noto Naskh Arabic, Cairo, Reem Kufi). No copyrighted/commercial fonts.
- Icons: `lucide-react` (ISC license) and in-repo SVGs.
- Branding (logo, "Share as Image" card): original in-repo SVGs only.
- No copyrighted images, icons, or external media assets may be added.

## 3. Adding new content

Any new dhikr/ayah must be authentic, sourced, and added to the local data files
— never fetched from an unverified feed. New dependencies must be open-licensed
and must not act as a conduit for arbitrary external text.
