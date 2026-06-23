import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw, Vibrate } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tasbeeh")({
  head: () => ({
    meta: [
      { title: "المسبحة | Tasbeeh — Al-Maqam" },
      { name: "description", content: "A premium digital tasbeeh — count your dhikr with luxurious golden visuals and daily totals." },
    ],
  }),
  component: TasbeehPage,
});

const PRESETS = [
  { ar: "سبحان الله", en: "SubhanAllah", target: 33 },
  { ar: "الحمد لله", en: "Alhamdulillah", target: 33 },
  { ar: "الله أكبر", en: "Allahu Akbar", target: 34 },
  { ar: "لا إله إلا الله", en: "La ilaha illa Allah", target: 100 },
  { ar: "أستغفر الله", en: "Astaghfirullah", target: 100 },
];

const KEY = "muadhin.tasbeeh";

type TState = { count: number; preset: number; total: number };

function load(): TState {
  if (typeof window === "undefined") return { count: 0, preset: 0, total: 0 };
  try { return (JSON.parse(localStorage.getItem(KEY) || "") as TState) || { count: 0, preset: 0, total: 0 }; }
  catch { return { count: 0, preset: 0, total: 0 }; }
}

function TasbeehPage() {
  const { lang } = useI18n();
  const [state, setState] = useState(load);
  const preset = PRESETS[state.preset];
  const cycles = Math.floor(state.count / preset.target);
  const inCycle = state.count % preset.target;
  const pct = (inCycle / preset.target) * 100;

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);

  function tap() {
    if ("vibrate" in navigator) navigator.vibrate?.(15);
    setState((s) => ({ ...s, count: s.count + 1, total: s.total + 1 }));
  }
  function reset() { setState((s) => ({ ...s, count: 0 })); }
  function pickPreset(i: number) { setState((s) => ({ ...s, preset: i, count: 0 })); }

  return (
    <div className="space-y-4">
      <header className="rounded-3xl gold-border gold-gradient card-shadow p-5 text-center">
        <h1 className="font-display text-2xl gold-text">{lang === "ar" ? "المسبحة الإلكترونية" : "Digital Tasbeeh"}</h1>
        <p className="text-xs text-muted-foreground mt-1">{lang === "ar" ? "اضغط لتسبح" : "Tap to count"}</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => pickPreset(i)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
              i === state.preset ? "bg-primary text-primary-foreground" : "bg-card gold-border hover:bg-accent"
            }`}
          >
            <span className={lang === "ar" ? "arabic" : ""}>{lang === "ar" ? p.ar : p.en}</span>
            <span className="ms-2 text-[10px] opacity-80">{p.target}×</span>
          </button>
        ))}
      </div>

      <div className="rounded-3xl gold-border bg-card card-shadow p-6 text-center">
        <div className="arabic text-3xl">{preset.ar}</div>
        <div className="text-xs text-muted-foreground mt-1">{preset.en}</div>

        <button
          onClick={tap}
          className="relative mx-auto mt-6 grid place-items-center size-64 sm:size-72 rounded-full gold-border-strong card-shadow active:scale-95 transition select-none"
          style={{
            background: `conic-gradient(#FFD700 ${pct}%, rgba(212,175,55,0.10) ${pct}% 100%)`,
            boxShadow: "0 0 60px rgba(212,175,55,0.35), 0 0 0 1px rgba(212,175,55,0.5)",
          }}
        >
          <div className="grid place-items-center size-52 sm:size-60 rounded-full bg-card">
            <div className="font-display text-7xl gold-text tabular-nums">{inCycle}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? `من ${preset.target}` : `of ${preset.target}`}
            </div>
          </div>
        </button>

        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <Stat label={lang === "ar" ? "دورات" : "Cycles"} value={cycles} />
          <Stat label={lang === "ar" ? "الإجمالي" : "Total"} value={state.count} />
          <Stat label={lang === "ar" ? "كل الوقت" : "All-time"} value={state.total} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-accent">
            <RotateCcw className="size-4" /> {lang === "ar" ? "تصفير" : "Reset"}
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Vibrate className="size-3.5" /> {lang === "ar" ? "اهتزاز" : "Haptic"}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <div className="font-display text-xl gold-text tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
