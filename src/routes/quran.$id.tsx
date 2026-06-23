import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Play, Pause, Bookmark, BookmarkCheck, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { RECITERS } from "@/lib/dhikr-data";

type Ayah = { number: number; numberInSurah: number; text: string };
type SurahDetail = { number: number; name: string; englishName: string; englishNameTranslation: string; ayahs: Ayah[] };

const BOOKMARK_KEY = "almaqam.bookmarks";
const PROGRESS_KEY = "almaqam.reading-progress";

export const Route = createFileRoute("/quran/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `سورة ${params.id} — Al-Maqam` },
      { name: "description", content: "Read and listen to this Surah of the Holy Qur'an in Uthmani script with a luxurious reciter player." },
    ],
  }),
  component: SurahPage,
});

function SurahPage() {
  const { id } = Route.useParams();
  const { lang } = useI18n();
  const [settings, setSettings] = useSettings();
  const [showTr, setShowTr] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { data: arabic, isLoading } = useQuery({
    queryKey: ["surah-ar", id],
    queryFn: async (): Promise<SurahDetail> => {
      const r = await fetch(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`);
      if (!r.ok) throw new Error(`Failed to load surah ${id}`);
      const j = await r.json();
      if (!j?.data) throw new Error(`Malformed surah response for ${id}`);
      return j.data;
    },
    staleTime: Infinity,
  });

  const { data: english } = useQuery({
    queryKey: ["surah-en", id],
    queryFn: async (): Promise<SurahDetail> => {
      const r = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.sahih`);
      if (!r.ok) throw new Error(`Failed to load translation for surah ${id}`);
      const j = await r.json();
      if (!j?.data) throw new Error(`Malformed translation response for ${id}`);
      return j.data;
    },
    staleTime: Infinity,
  });

  const reciter = RECITERS.find((r) => r.id === settings.reciter) ?? RECITERS[0];
  const fullAudio = `https://server${reciter.server}.mp3quran.net/${reciter.mp3}/${String(id).padStart(3, "0")}.mp3`;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setPlaying(!a.paused);
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    a.addEventListener("play", on);
    a.addEventListener("pause", off);
    a.addEventListener("ended", off);
    return () => { a.removeEventListener("play", on); a.removeEventListener("pause", off); a.removeEventListener("ended", off); };
  }, [fullAudio]);

  // Save reading progress + bookmark state
  useEffect(() => {
    try {
      const bm: number[] = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
      setBookmarked(bm.includes(Number(id)));
      const prog = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      prog.lastSurah = Number(id);
      prog.lastAt = Date.now();
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
    } catch {}
  }, [id]);

  function toggleBookmark() {
    try {
      const list: number[] = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
      const n = Number(id);
      const next = list.includes(n) ? list.filter((x) => x !== n) : [...list, n];
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      setBookmarked(next.includes(n));
    } catch {}
  }

  const sId = Number(id);
  const prevId = Math.max(1, sId - 1);
  const nextId = Math.min(114, sId + 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/quran" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4 rtl:rotate-180" />
          {lang === "ar" ? "السور" : "All Surahs"}
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleBookmark} className="text-xs rounded-full gold-border bg-card px-3 py-1.5 hover:bg-accent inline-flex items-center gap-1.5">
            {bookmarked ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
            {bookmarked ? (lang === "ar" ? "محفوظ" : "Saved") : (lang === "ar" ? "حفظ" : "Bookmark")}
          </button>
          <button onClick={() => setShowTr((v) => !v)} className="text-xs rounded-full gold-border bg-card px-3 py-1.5 hover:bg-accent">
            {showTr ? (lang === "ar" ? "إخفاء الترجمة" : "Hide translation") : (lang === "ar" ? "عرض الترجمة" : "Show translation")}
          </button>
        </div>
      </div>

      {arabic && (
        <header className="rounded-3xl gold-border gold-gradient card-shadow p-6 text-center relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Surah {arabic.number}</div>
          <h1 className="font-display text-4xl gold-text mt-1">{arabic.englishName}</h1>
          <div className="arabic text-4xl mt-2 gold-text">{arabic.name}</div>
          <div className="text-xs text-muted-foreground mt-1">{arabic.englishNameTranslation} · {arabic.ayahs.length} {lang === "ar" ? "آية" : "verses"}</div>
        </header>
      )}

      {/* Premium reciter player */}
      <div className="rounded-2xl gold-border-strong bg-card card-shadow p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-3 min-w-0">
            <Link to="/quran/$id" params={{ id: String(prevId) }} className="rounded-full p-2 gold-border hover:bg-accent" aria-label="prev">
              <SkipBack className="size-4 rtl:rotate-180" />
            </Link>
            <button
              onClick={() => {
                const a = audioRef.current;
                if (!a) return;
                if (playing) a.pause();
                else a.play().catch(() => {});
              }}
              className="grid place-items-center size-14 rounded-full gold-fill text-black hover:scale-105 transition shadow-lg"
              aria-label={playing ? "pause" : "play"}
            >
              {playing ? <Pause className="size-6" /> : <Play className="size-6 ms-0.5" />}
            </button>
            <Link to="/quran/$id" params={{ id: String(nextId) }} className="rounded-full p-2 gold-border hover:bg-accent" aria-label="next">
              <SkipForward className="size-4 rtl:rotate-180" />
            </Link>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{lang === "ar" ? "القارئ" : "Reciter"}</div>
              <div className="text-sm gold-text font-display truncate">{lang === "ar" ? reciter.ar : reciter.en}</div>
            </div>
          </div>
          <select
            value={settings.reciter}
            onChange={(e) => setSettings({ reciter: e.target.value })}
            className="rounded-xl gold-border bg-secondary px-3 py-2 text-sm"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id} className="bg-card">{lang === "ar" ? r.ar : r.en}</option>
            ))}
          </select>
        </div>
        <audio key={fullAudio} ref={audioRef} src={fullAudio} preload="none" className="mt-3 w-full" controls />
        <div className="mt-2 text-[10px] text-muted-foreground inline-flex items-center gap-1.5">
          <Volume2 className="size-3" /> {lang === "ar" ? "يتم تشغيل التلاوة في الخلفية أثناء القراءة." : "Recitation plays in background while you read."}
        </div>
      </div>

      <div className="space-y-2.5">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}
        {arabic?.ayahs.map((a, i) => {
          const en = english?.ayahs[i];
          return (
            <div key={a.number} className="rounded-2xl gold-border bg-card card-shadow p-4 hover:gold-border-strong transition">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="inline-grid place-items-center size-8 rounded-full gold-fill text-black font-mono text-xs font-bold">
                  {a.numberInSurah}
                </span>
              </div>
              <p className="arabic text-3xl leading-loose mt-3 text-end" style={{ textShadow: "0 0 30px rgba(212,175,55,0.15)" }}>{a.text}</p>
              {showTr && en && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{en.text}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
