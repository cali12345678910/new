import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, CircleDot, Sparkles, Check, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DHIKR } from "@/lib/dhikr-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dhikr")({
  head: () => ({
    meta: [
      { title: "الأذكار | Dhikr — Al-Maqam" },
      { name: "description", content: "Hisn al-Muslim — morning, evening, after-prayer, travel and sleep remembrance with interactive countdown counters." },
    ],
  }),
  component: DhikrPage,
});

function DhikrPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<string>(DHIKR[0].id);
  const cat = DHIKR.find((c) => c.id === active)!;
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => { setCompleted(new Set()); }, [active]);

  return (
    <div className="space-y-4">
      <header className="rounded-3xl gold-border gold-gradient card-shadow p-5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl gold-text">{lang === "ar" ? "حصن المسلم" : "Hisn al-Muslim"}</h1>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "أذكار من الكتاب والسنّة" : "Daily remembrance from the Qur'an & Sunnah"}</p>
          </div>
          <Link to="/tasbeeh" className="inline-flex items-center gap-1.5 rounded-full gold-fill text-black px-3 py-1.5 text-xs hover:opacity-90 font-medium">
            <CircleDot className="size-3.5" /> {t("nav_tasbeeh")}
          </Link>
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-1">
        {DHIKR.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
              active === c.id ? "gold-fill text-black font-medium" : "bg-card gold-border hover:bg-accent"
            }`}
          >
            {lang === "ar" ? c.title_ar : c.title_en}
          </button>
        ))}
      </nav>

      <div className="space-y-3">
        {cat.items.map((item, idx) => (
          <DhikrCard
            key={`${cat.id}-${idx}`}
            item={item}
            index={idx}
            done={completed.has(idx)}
            onDone={() => {
              setCompleted((s) => new Set(s).add(idx));
              // auto-scroll to next card
              setTimeout(() => {
                const next = document.getElementById(`dhikr-${cat.id}-${idx + 1}`);
                next?.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 700);
            }}
            id={`dhikr-${cat.id}-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}

function DhikrCard({
  item, index, done, onDone, id,
}: {
  item: typeof DHIKR[0]["items"][0]; index: number; done: boolean; onDone: () => void; id: string;
}) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(true);
  const target = item.times ?? 1;
  // Counts DOWN: target -> 0
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
        setTimeout(() => onDone(), 500);
        setTimeout(() => setGlow(false), 1800);
      }
      return nr;
    });
  }

  function reset() { setRemaining(target); ranOnce.current = false; setGlow(false); }

  const pct = ((target - remaining) / target) * 100;
  const finished = remaining === 0;

  return (
    <div
      id={id}
      className={`rounded-2xl gold-border bg-card card-shadow p-4 transition-all duration-500 ${
        glow ? "gold-glow scale-[1.01]" : ""
      } ${done && !glow ? "opacity-70" : ""}`}
    >
      <button onClick={() => setOpen((v) => !v)} className="w-full text-start flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground">#{index + 1} · {target}×</span>
          {finished && <span className="inline-flex items-center gap-1 text-[10px] gold-text font-medium"><Check className="size-3" /> {lang === "ar" ? "اكتمل" : "Completed"}</span>}
        </div>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <>
          <p className="arabic text-2xl leading-loose mt-3 text-end">{item.ar}</p>
          {lang === "en" && item.en && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.en}</p>}

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={reset}
              className="rounded-full p-2 gold-border bg-secondary/60 hover:bg-accent"
              aria-label="reset"
            >
              <RotateCcw className="size-4" />
            </button>

            {/* Circular countdown button */}
            <button
              onClick={tap}
              disabled={finished}
              className="relative grid place-items-center size-24 rounded-full active:scale-95 transition select-none disabled:opacity-80"
              style={{
                background: `conic-gradient(#FFD700 ${pct}%, rgba(212,175,55,0.10) ${pct}% 100%)`,
                boxShadow: finished ? "0 0 24px rgba(255,215,0,0.6)" : "0 6px 24px rgba(0,0,0,0.4)",
              }}
              aria-label="count"
            >
              <div className="grid place-items-center size-[88px] rounded-full bg-card">
                <div className="font-display text-3xl gold-text tabular-nums">{remaining}</div>
                <div className="text-[9px] text-muted-foreground -mt-0.5">{lang === "ar" ? "متبقّي" : "left"}</div>
              </div>
            </button>

            <div className="text-xs text-muted-foreground tabular-nums">{target - remaining}/{target}</div>
          </div>
        </>
      )}
    </div>
  );
}
