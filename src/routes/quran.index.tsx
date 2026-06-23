import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronRight, BookOpen, Bookmark } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export const Route = createFileRoute("/quran/")({
  head: () => ({
    meta: [
      { title: "القرآن الكريم | Qur'an — Al-Maqam" },
      {
        name: "description",
        content:
          "Read and listen to the Holy Qur'an in Uthmani script — by Surah or Juz, with bookmarks and reciter selection.",
      },
    ],
  }),
  component: QuranIndex,
});

type Tab = "surah" | "juz" | "bookmarks";

function QuranIndex() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("surah");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem("almaqam.bookmarks") || "[]"));
    } catch {
      /* ignore */
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: async (): Promise<Surah[]> => {
      const r = await fetch("https://api.alquran.cloud/v1/surah");
      if (!r.ok) throw new Error(`Failed to load surah list (${r.status})`);
      const j = await r.json();
      if (!Array.isArray(j?.data)) throw new Error("Malformed surah list response");
      return j.data;
    },
    staleTime: Infinity,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data;
    if (tab === "bookmarks") list = data.filter((s) => bookmarks.includes(s.number));
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (s) =>
        s.englishName.toLowerCase().includes(term) ||
        s.englishNameTranslation.toLowerCase().includes(term) ||
        s.name.includes(term) ||
        String(s.number) === term,
    );
  }, [data, q, tab, bookmarks]);

  return (
    <div className="space-y-4">
      <header className="rounded-3xl gold-border gold-gradient card-shadow p-5">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center size-14 rounded-2xl gold-fill text-black shadow-md">
            <BookOpen className="size-7" />
          </div>
          <div>
            <h1 className="font-display text-3xl gold-text">
              {lang === "ar" ? "القرآن الكريم" : "The Holy Qur'an"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "١١٤ سورة • اقرأ واستمع برسم عثماني فاخر"
                : "114 Surahs — luxurious Uthmani script with audio"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {(
            [
              ["surah", t("surah")],
              ["juz", t("juz")],
              ["bookmarks", t("bookmarks")],
            ] as [Tab, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                tab === k
                  ? "gold-fill text-black font-medium"
                  : "gold-border bg-card hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن سورة…" : "Search for a Surah…"}
            className="w-full rounded-2xl gold-border bg-secondary/70 ps-10 pe-3 py-2.5 text-sm outline-none focus:gold-border-strong"
          />
        </div>
      </header>

      {tab === "juz" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
            <div key={j} className="rounded-2xl gold-border bg-card card-shadow p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Juz</div>
              <div className="font-display text-3xl gold-text">{j}</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {lang === "ar" ? `الجزء ${j}` : `Part ${j}`}
              </div>
            </div>
          ))}
          <div className="col-span-full text-center text-xs text-muted-foreground">
            {lang === "ar"
              ? "اضغط على سورة من تبويب «سورة» لبدء القراءة."
              : "Open any surah from the Surah tab to start reading."}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {isLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))}
          {!isLoading && filtered.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-8">
              {tab === "bookmarks"
                ? lang === "ar"
                  ? "لا توجد سور محفوظة بعد."
                  : "No bookmarked surahs yet."
                : lang === "ar"
                  ? "لا نتائج."
                  : "No results."}
            </div>
          )}
          {filtered.map((s) => (
            <Link
              key={s.number}
              to="/quran/$id"
              params={{ id: String(s.number) }}
              className="group rounded-2xl gold-border bg-card card-shadow p-3.5 flex items-center gap-3 hover:gold-border-strong hover:-translate-y-0.5 transition"
            >
              <div className="grid place-items-center size-12 shrink-0 rounded-xl gold-fill text-black font-display text-lg font-bold">
                {s.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-display text-lg truncate">{s.englishName}</div>
                  <div className="arabic text-xl shrink-0 gold-text">{s.name}</div>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {s.englishNameTranslation} · {s.numberOfAyahs} {lang === "ar" ? "آية" : "verses"}{" "}
                  · {s.revelationType}
                </div>
              </div>
              {bookmarks.includes(s.number) && (
                <Bookmark className="size-4 text-primary fill-current" />
              )}
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180 group-hover:translate-x-0.5 transition" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
