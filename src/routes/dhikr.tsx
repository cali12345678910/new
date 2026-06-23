import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  Check,
  RotateCcw,
  Search,
  Star,
  BookMarked,
  Quote,
  Sun,
  Sunrise,
  Moon,
  Sparkles,
  Droplet,
  Landmark,
  House,
  Utensils,
  DoorOpen,
  Heart,
  Plane,
  Bed,
  BookOpen,
} from "lucide-react";
import { DHIKR, type DhikrItem } from "@/lib/dhikr-data";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/dhikr")({
  head: () => ({
    meta: [
      { title: "حصن المسلم | Hisn al-Muslim — Al-Maqam" },
      {
        name: "description",
        content:
          "Hisn al-Muslim — comprehensive authentic adhkar: morning, evening, after-prayer, travel, sleep and more, with transliteration, sources and interactive counters.",
      },
    ],
  }),
  component: DhikrPage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sunrise: Sunrise,
  sun: Sun,
  moon: Moon,
  sparkles: Sparkles,
  droplet: Droplet,
  landmark: Landmark,
  house: House,
  utensils: Utensils,
  "door-open": DoorOpen,
  heart: Heart,
  "rotate-ccw": RotateCcw,
  star: Star,
  plane: Plane,
  bed: Bed,
  "book-open": BookOpen,
  "circle-dot": CircleDot,
};

const FAV_KEY = "almaqam.dhikr.favs";

function loadFavs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

type Row = { catId: string; catTitle: string; idx: number; item: DhikrItem };

function DhikrPage() {
  const { t, lang } = useI18n();
  const [settings] = useSettings();
  const [active, setActive] = useState<string>(DHIKR[0].id);
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    setFavs(loadFavs());
  }, []);

  function toggleFav(key: string) {
    setFavs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      if (typeof window !== "undefined") localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }

  const term = query.trim().toLowerCase();

  const rows: Row[] = useMemo(() => {
    const all: Row[] = [];
    for (const cat of DHIKR) {
      cat.items.forEach((item, idx) => {
        all.push({
          catId: cat.id,
          catTitle: lang === "ar" ? cat.title_ar : cat.title_en,
          idx,
          item,
        });
      });
    }
    if (term) {
      return all.filter(
        (r) =>
          r.item.ar.includes(query.trim()) ||
          r.item.en?.toLowerCase().includes(term) ||
          r.item.translit?.toLowerCase().includes(term) ||
          r.catTitle.toLowerCase().includes(term),
      );
    }
    if (active === "__favs") return all.filter((r) => favs.includes(`${r.catId}:${r.idx}`));
    return all.filter((r) => r.catId === active);
  }, [active, term, query, favs, lang]);

  const showingList = term || active === "__favs";

  return (
    <div className="space-y-4">
      <header className="rounded-3xl gold-border gold-gradient card-shadow p-5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-3xl gold-text">
              {lang === "ar" ? "حصن المسلم" : "Hisn al-Muslim"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "أذكار وأدعية من الكتاب والسنّة"
                : "Fortress of the Muslim — adhkar from the Qur'an & Sunnah"}
            </p>
          </div>
          <Link
            to="/tasbeeh"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full gold-fill text-black px-3 py-1.5 text-xs hover:opacity-90 font-medium"
          >
            <CircleDot className="size-3.5" /> {t("nav_tasbeeh")}
          </Link>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث في الأذكار…" : "Search the adhkar…"}
            className="w-full rounded-2xl gold-border bg-background/60 ps-10 pe-3 py-2.5 text-sm outline-none focus:gold-border-strong"
          />
        </div>
      </header>

      {!term && (
        <nav className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActive("__favs")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition ${
              active === "__favs"
                ? "gold-fill text-black font-medium"
                : "bg-card gold-border hover:bg-accent"
            }`}
          >
            <Star className="size-3.5" />
            {lang === "ar" ? "المفضّلة" : "Favorites"}
            {favs.length > 0 && <span className="text-[10px] opacity-80">{favs.length}</span>}
          </button>
          {DHIKR.map((c) => {
            const Icon = ICONS[c.icon] ?? Sparkles;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition ${
                  active === c.id
                    ? "gold-fill text-black font-medium"
                    : "bg-card gold-border hover:bg-accent"
                }`}
              >
                <Icon className="size-3.5" />
                {lang === "ar" ? c.title_ar : c.title_en}
              </button>
            );
          })}
        </nav>
      )}

      {!showingList && <CategoryIntro id={active} />}

      {rows.length === 0 ? (
        <div className="rounded-2xl gold-border bg-card p-8 text-center text-sm text-muted-foreground">
          {active === "__favs" && !term
            ? lang === "ar"
              ? "لا توجد أذكار مفضّلة بعد. اضغط النجمة لإضافتها."
              : "No favorites yet. Tap the star on any dhikr to save it."
            : lang === "ar"
              ? "لا توجد نتائج."
              : "No results."}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const key = `${r.catId}:${r.idx}`;
            return (
              <DhikrCard
                key={key}
                row={r}
                showCategory={Boolean(showingList)}
                fav={favs.includes(key)}
                onFav={() => toggleFav(key)}
                fontScale={settings.fontScale}
                showTranslit={settings.showTranslit}
                showTranslation={settings.showTranslation || lang === "en"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategoryIntro({ id }: { id: string }) {
  const { lang } = useI18n();
  const cat = DHIKR.find((c) => c.id === id);
  if (!cat) return null;
  const desc = lang === "ar" ? cat.desc_ar : cat.desc_en;
  if (!desc) return null;
  const Icon = ICONS[cat.icon] ?? Sparkles;
  return (
    <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary" />
      {desc}
    </div>
  );
}

function DhikrCard({
  row,
  showCategory,
  fav,
  onFav,
  fontScale,
  showTranslit,
  showTranslation,
}: {
  row: Row;
  showCategory: boolean;
  fav: boolean;
  onFav: () => void;
  fontScale: number;
  showTranslit: boolean;
  showTranslation: boolean;
}) {
  const { lang } = useI18n();
  const { item, idx } = row;
  const [open, setOpen] = useState(true);
  const target = item.times ?? 1;
  const [remaining, setRemaining] = useState(target);
  const [glow, setGlow] = useState(false);
  const ranOnce = useRef(false);

  function tap() {
    if (remaining <= 0) return;
    if ("vibrate" in navigator) navigator.vibrate?.(10);
    setRemaining((r) => {
      const nr = Math.max(0, r - 1);
      if (nr === 0 && !ranOnce.current) {
        ranOnce.current = true;
        setGlow(true);
        setTimeout(() => setGlow(false), 1800);
      }
      return nr;
    });
  }

  function reset() {
    setRemaining(target);
    ranOnce.current = false;
    setGlow(false);
  }

  const pct = ((target - remaining) / target) * 100;
  const finished = remaining === 0;

  return (
    <div
      className={`rounded-2xl gold-border bg-card card-shadow p-4 transition-all duration-500 ${
        glow ? "gold-glow scale-[1.01]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-start"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full gold-border text-[10px] text-muted-foreground">
            {idx + 1}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{target}×</span>
          {showCategory && (
            <span className="truncate text-[11px] text-primary/80">{row.catTitle}</span>
          )}
          {finished && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] gold-text font-medium">
              <Check className="size-3" /> {lang === "ar" ? "اكتمل" : "Done"}
            </span>
          )}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onFav}
            className="rounded-full p-1.5 hover:bg-accent"
            aria-label="favorite"
          >
            <Star
              className={`size-4 ${fav ? "fill-current text-primary" : "text-muted-foreground"}`}
            />
          </button>
          <button onClick={() => setOpen((v) => !v)} className="rounded-full p-1.5 hover:bg-accent">
            {open ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          <p
            className="arabic leading-loose mt-3 text-end"
            style={{ fontSize: `${1.5 * fontScale}rem` }}
          >
            {item.ar}
          </p>

          {showTranslit && item.translit && (
            <p
              className="mt-2 italic text-muted-foreground"
              style={{ fontSize: `${0.85 * fontScale}rem` }}
            >
              {item.translit}
            </p>
          )}

          {showTranslation && item.en && (
            <p
              className="mt-2 text-foreground/85 leading-relaxed"
              style={{ fontSize: `${0.9 * fontScale}rem` }}
            >
              {item.en}
            </p>
          )}

          {(item.benefit_ar || item.benefit_en) && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/50 gold-border p-2.5 text-xs text-muted-foreground">
              <Quote className="size-3.5 shrink-0 text-primary mt-0.5" />
              <span>
                {lang === "ar"
                  ? (item.benefit_ar ?? item.benefit_en)
                  : (item.benefit_en ?? item.benefit_ar)}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              {item.source && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <BookMarked className="size-3" /> {item.source}
                </span>
              )}
              <button
                onClick={reset}
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] gold-border bg-secondary/60 hover:bg-accent"
                aria-label="reset"
              >
                <RotateCcw className="size-3" /> {lang === "ar" ? "إعادة" : "Reset"}
              </button>
            </div>

            <button
              onClick={tap}
              disabled={finished}
              className="relative grid size-24 place-items-center rounded-full transition active:scale-95 select-none disabled:opacity-80"
              style={{
                background: `conic-gradient(var(--gold-bright) ${pct}%, rgb(var(--accent-rgb) / 0.10) ${pct}% 100%)`,
                boxShadow: finished
                  ? "0 0 24px rgb(var(--accent-rgb) / 0.6)"
                  : "0 6px 24px rgba(0,0,0,0.4)",
              }}
              aria-label="count"
            >
              <div className="grid size-[88px] place-items-center rounded-full bg-card">
                <div className="font-display text-3xl gold-text tabular-nums">{remaining}</div>
                <div className="text-[9px] text-muted-foreground -mt-0.5">
                  {lang === "ar" ? "متبقّي" : "left"}
                </div>
              </div>
            </button>

            <div className="text-xs text-muted-foreground tabular-nums">
              {target - remaining}/{target}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
