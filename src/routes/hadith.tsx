import { createFileRoute } from "@tanstack/react-router";
import { memo, useDeferredValue, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  Search,
  Star,
  BookMarked,
  Quote,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { HADITHS_DATA, CATEGORIES } from "@/data/hadiths";
import type { HadithItem, CategoryId } from "@/types";
import { matchesQuery, stripTashkeel } from "@/utils/arabic";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { ShareButton } from "@/components/ShareCard";

export const Route = createFileRoute("/hadith")({
  head: () => ({
    meta: [
      { title: "مكتبة الأحاديث النبوية | Hadith Library — Al-Maqam" },
      {
        name: "description",
        content:
          "Authentic Hadith Library — verified prophetic traditions and supplications from Sahih al-Bukhari, Sahih Muslim, Hisn al-Muslim, and the 40 Hadith of Imam al-Nawawi.",
      },
    ],
  }),
  component: HadithPage,
});

const PAGE_SIZE = 20;

function HadithPage() {
  const { lang } = useI18n();
  const [settings] = useSettings();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [showTashkeel, setShowTashkeel] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Favorites in localStorage
  const [favs, setFavs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("maqam_hadith_favs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("maqam_hadith_favs", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = HADITHS_DATA;
    if (activeCategory === "bookmarks") {
      list = list.filter((h) => favs.includes(h.id));
    } else if (activeCategory !== "all") {
      list = list.filter((h) => h.category === activeCategory);
    }
    if (deferredQuery.trim()) {
      list = list.filter(
        (h) =>
          matchesQuery(h.title, deferredQuery) ||
          matchesQuery(h.text, deferredQuery) ||
          matchesQuery(h.sourceBook, deferredQuery) ||
          matchesQuery(h.reference, deferredQuery) ||
          (h.virtue && matchesQuery(h.virtue, deferredQuery)) ||
          (h.notes && matchesQuery(h.notes, deferredQuery)),
      );
    }
    return list;
  }, [activeCategory, deferredQuery, favs]);

  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const handleSelectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="rounded-3xl gold-border bg-card card-shadow p-5 sm:p-7 relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-primary font-medium">
              <ShieldCheck className="size-4" />
              <span>{lang === "ar" ? "تحقيق معتمد · نصوص نبوية صحيحة" : "Authentic Verified Traditions"}</span>
              <span className="opacity-40">·</span>
              <span className="font-mono">{HADITHS_DATA.length} {lang === "ar" ? "حديثاً وذكراً" : "items"}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl gold-text">
              {lang === "ar" ? "مكتبة الأحاديث النبوية" : "Hadith Library"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              {lang === "ar"
                ? "موسوعة جامعة للأحاديث الصحيحة والحسنة من حصن المسلم وصحيحي البخاري ومسلم والأربعين النووية بالتشكيل الكامل."
                : "Verified prophetic traditions from Sahih al-Bukhari, Sahih Muslim, Hisn al-Muslim, and the 40 Hadith of Imam Nawawi."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTashkeel(!showTashkeel)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs gold-border bg-secondary/70 hover:bg-accent transition active:scale-95"
            >
              <span>{showTashkeel ? (lang === "ar" ? "إخفاء التشكيل" : "Hide Tashkeel") : (lang === "ar" ? "إظهار التشكيل" : "Show Tashkeel")}</span>
            </button>
          </div>
        </div>

        {/* Search Bar with Deferred Optimization */}
        <div className="mt-5 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={lang === "ar" ? "ابحث في الأحاديث والأدعية..." : "Search hadiths and duas..."}
            className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm rounded-2xl bg-background border gold-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-shadow"
          />
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Category Pills Navigation with Smooth CSS Transitions */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === "all"
              ? HADITHS_DATA.length
              : cat.id === "bookmarks"
              ? favs.length
              : HADITHS_DATA.filter((h) => h.category === cat.id).length;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                isActive
                  ? "gold-fill text-black font-semibold shadow-md"
                  : "bg-card gold-border hover:bg-accent text-foreground/80"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono tabular-nums ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </nav>

      {/* Hadith List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl gold-border bg-card p-12 text-center text-sm text-muted-foreground">
          {activeCategory === "bookmarks"
            ? lang === "ar"
              ? "لا توجد أحاديث في المفضلة بعد. اضغط على أيقونة النجمة لحفظ أي حديث."
              : "No bookmarked hadiths yet. Click the star on any card to save it."
            : lang === "ar"
            ? "لم يتم العثور على نتائج مطابقة."
            : "No matching hadiths found."}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleItems.map((item) => (
            <HadithCardItem
              key={item.id}
              item={item}
              showTashkeel={showTashkeel}
              isFav={favs.includes(item.id)}
              onToggleFav={() => toggleFav(item.id)}
              fontScale={settings.fontScale}
            />
          ))}

          {/* Lazy Load More Button if filtered exceeds visible */}
          {visibleCount < filtered.length && (
            <div className="pt-4 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gold-fill text-black font-semibold text-xs shadow-md hover:opacity-90 transition active:scale-95"
              >
                <span>{lang === "ar" ? `عرض المزيد (${filtered.length - visibleCount} متبقٍ)` : `Load more (${filtered.length - visibleCount} remaining)`}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const HadithCardItem = memo(function HadithCardItem({
  item,
  showTashkeel,
  isFav,
  onToggleFav,
  fontScale,
}: {
  item: HadithItem;
  showTashkeel: boolean;
  isFav: boolean;
  onToggleFav: () => void;
  fontScale: number;
}) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const target = item.repeatCount || 1;
  const [remaining, setRemaining] = useState(target);

  const tap = () => {
    if (remaining <= 0) return;
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate?.(18);
      } catch {}
    }
    setRemaining((r) => Math.max(0, r - 1));
  };

  const reset = () => {
    setRemaining(target);
  };

  const handleCopy = async () => {
    const copyContent = `${item.title}\n\n${item.text}\n\n[المصدر: ${item.sourceBook} - ${item.reference} (${item.grading})]`;
    await navigator.clipboard.writeText(copyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pct = ((target - remaining) / target) * 100;
  const finished = remaining === 0;
  const renderedText = showTashkeel ? item.text : stripTashkeel(item.text);

  return (
    <div className="rounded-3xl gold-border bg-card card-shadow p-5 sm:p-6 transition-all duration-200 hover:border-primary/50 content-visibility-auto">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-start min-w-0"
          >
            <span className="font-display font-semibold text-sm sm:text-base text-foreground truncate">
              {item.title}
            </span>
          </button>
          {target > 1 && (
            <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
              {target}×
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleFav}
            className="rounded-full p-1.5 hover:bg-accent text-muted-foreground transition active:scale-125"
            aria-label="favorite"
          >
            <Star className={`size-4 ${isFav ? "fill-current text-primary" : ""}`} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-full p-1.5 hover:bg-accent text-muted-foreground transition"
          >
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          {/* Hadith Arabic Text */}
          <p
            className="arabic leading-loose text-end text-foreground/95"
            style={{ fontSize: `${1.4 * fontScale}rem` }}
          >
            {renderedText}
          </p>

          {/* Virtue / Benefit / Notes */}
          {(item.virtue || item.notes) && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-secondary/50 gold-border p-3 text-xs text-muted-foreground">
              <Quote className="size-3.5 shrink-0 text-primary mt-0.5" />
              <span className="leading-relaxed">{item.virtue || item.notes}</span>
            </div>
          )}

          {/* Attribution & Counter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border/40">
            {/* Attribution Footnote */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <BookMarked className="size-3.5 text-primary" />
                  <span>{item.sourceBook}</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground font-mono">{item.reference}</span>
                <span className="text-muted-foreground">·</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary border border-primary/20">
                  {item.grading}
                </span>
              </div>
            </div>

            {/* Actions & Repetition Counter */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs gold-border bg-secondary/70 hover:bg-accent transition active:scale-95"
                >
                  {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  <span>{copied ? (lang === "ar" ? "تم النسخ" : "Copied") : (lang === "ar" ? "نسخ" : "Copy")}</span>
                </button>
                <ShareButton
                  content={{
                    kind: "dhikr",
                    ar: item.text,
                    en: item.title,
                    source: `${item.sourceBook} - ${item.reference}`,
                  }}
                />
              </div>

              {/* Repetition Button if repeatCount > 1 */}
              {target > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={reset}
                    className="p-1.5 rounded-full hover:bg-accent text-muted-foreground text-xs transition active:scale-90"
                    title={lang === "ar" ? "إعادة" : "Reset"}
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                  <button
                    onClick={tap}
                    disabled={finished}
                    className="relative grid size-14 place-items-center rounded-full transition-transform active:scale-90 select-none disabled:opacity-80"
                    style={{
                      background: `conic-gradient(var(--gold-bright) ${pct}%, rgb(var(--accent-rgb) / 0.10) ${pct}% 100%)`,
                    }}
                  >
                    <div className="grid size-12 place-items-center rounded-full bg-card">
                      <div className="font-display text-base font-bold gold-text tabular-nums">
                        {remaining}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
