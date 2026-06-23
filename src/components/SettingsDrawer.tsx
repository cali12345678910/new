import { useState } from "react";
import { X, Bell, Volume2, Play, Square, Palette, Type, Check } from "lucide-react";
import { CALC_METHODS, MUEZZINS, useSettings } from "@/lib/settings";
import { useI18n } from "@/lib/i18n";
import { playAthan, stopAthan, requestNotificationPermission } from "@/lib/athan";
import { RECITERS } from "@/lib/dhikr-data";
import { ACCENTS, APPEARANCES, ARABIC_FONTS, FONT_SCALES } from "@/lib/theme";

export function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [s, setS] = useSettings();
  const [previewing, setPreviewing] = useState(false);

  if (!open) return null;

  function previewAthan() {
    if (previewing) {
      stopAthan();
      setPreviewing(false);
      return;
    }
    const a = playAthan({ muezzinId: s.muezzin, volume: s.volume });
    setPreviewing(true);
    a.addEventListener("ended", () => setPreviewing(false));
    a.addEventListener("pause", () => setPreviewing(false));
  }

  async function toggleNotifs(v: boolean) {
    if (v) {
      const p = await requestNotificationPermission();
      setS({ notifications: p === "granted" });
    } else setS({ notifications: false });
  }

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          stopAthan();
          onClose();
        }}
      />
      <aside className="relative ms-auto h-full w-full max-w-md bg-card gold-border-strong card-shadow overflow-y-auto p-5 animate-slide-in-right">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl gold-text">{t("settings")}</h2>
          <button
            onClick={() => {
              stopAthan();
              onClose();
            }}
            className="rounded-full p-2 hover:bg-accent"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Appearance / UI customization */}
        <section className="mt-5">
          <h3 className="text-sm font-semibold mb-2 text-foreground/90 inline-flex items-center gap-2">
            <Palette className="size-4 text-primary" /> {t("appearance")}
          </h3>

          {/* Accent color swatches */}
          <div className="mb-1 text-xs text-muted-foreground">{t("accent_color")}</div>
          <div className="grid grid-cols-8 gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setS({ accent: a.id })}
                title={lang === "ar" ? a.ar : a.en}
                aria-label={lang === "ar" ? a.ar : a.en}
                className={`grid aspect-square place-items-center rounded-full transition ${
                  s.accent === a.id ? "ring-2 ring-offset-2 ring-offset-card" : "hover:scale-105"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${a.deep}, ${a.base} 55%, ${a.bright})`,
                  // @ts-expect-error CSS var for ring color
                  "--tw-ring-color": a.base,
                }}
              >
                {s.accent === a.id && <Check className="size-3.5 text-black/80" />}
              </button>
            ))}
          </div>

          {/* Theme mode */}
          <div className="mt-4 mb-1 text-xs text-muted-foreground">{t("theme_mode")}</div>
          <div className="grid grid-cols-3 gap-2">
            {APPEARANCES.map((ap) => (
              <button
                key={ap.id}
                onClick={() => setS({ appearance: ap.id })}
                className={`rounded-xl px-2 py-2 text-xs transition border ${
                  s.appearance === ap.id
                    ? "gold-border-strong text-foreground"
                    : "border-transparent hover:bg-accent"
                }`}
                style={{ background: ap.vars.card, color: ap.vars.foreground }}
              >
                {lang === "ar" ? ap.ar : ap.en}
              </button>
            ))}
          </div>
        </section>

        {/* Reading: fonts, size, translation toggles */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2 text-foreground/90 inline-flex items-center gap-2">
            <Type className="size-4 text-primary" /> {t("reading")}
          </h3>

          <div className="mb-1 text-xs text-muted-foreground">{t("arabic_font")}</div>
          <div className="grid grid-cols-3 gap-2">
            {ARABIC_FONTS.map((f) => (
              <button
                key={f.id}
                onClick={() => setS({ arabicFont: f.id })}
                className={`rounded-xl px-2 py-2.5 text-base transition border ${
                  s.arabicFont === f.id
                    ? "bg-primary/15 gold-border-strong text-foreground"
                    : "bg-secondary/60 border-transparent hover:bg-accent"
                }`}
                style={{ fontFamily: f.stack }}
              >
                {f.ar}
              </button>
            ))}
          </div>

          <div className="mt-4 mb-1 text-xs text-muted-foreground">{t("font_size")}</div>
          <div className="grid grid-cols-4 gap-2">
            {FONT_SCALES.map((fs) => (
              <button
                key={fs.id}
                onClick={() => setS({ fontScale: fs.value })}
                className={`rounded-xl px-2 py-2 text-sm transition border ${
                  s.fontScale === fs.value
                    ? "gold-fill text-black border-transparent"
                    : "bg-secondary/60 gold-border hover:bg-accent"
                }`}
              >
                {lang === "ar" ? fs.ar : fs.en}
              </button>
            ))}
          </div>

          {/* Live Arabic preview */}
          <div className="mt-3 rounded-xl gold-border bg-secondary/50 p-3">
            <p
              className="arabic text-end leading-loose"
              style={{ fontSize: `${1.5 * s.fontScale}rem` }}
            >
              سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            <Toggle
              label={t("show_translit")}
              checked={s.showTranslit}
              onChange={(v) => setS({ showTranslit: v })}
            />
            <Toggle
              label={t("show_translation")}
              checked={s.showTranslation}
              onChange={(v) => setS({ showTranslation: v })}
            />
            <Toggle
              label={t("reduce_motion")}
              checked={s.reduceMotion}
              onChange={(v) => setS({ reduceMotion: v })}
            />
          </div>
        </section>

        {/* Calculation method */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2 text-foreground/90">{t("calc_method")}</h3>
          <div className="grid gap-1.5">
            {CALC_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setS({ calcMethod: m.id })}
                className={`text-start rounded-xl px-3 py-2.5 text-sm transition border ${
                  s.calcMethod === m.id
                    ? "bg-primary/15 gold-border-strong text-foreground"
                    : "bg-secondary/60 border-transparent hover:bg-accent"
                }`}
              >
                {lang === "ar" ? m.ar : m.en}
              </button>
            ))}
          </div>
        </section>

        {/* Muezzin */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2 text-foreground/90">{t("muezzin")}</h3>
          <div className="grid grid-cols-2 gap-2">
            {MUEZZINS.map((m) => (
              <button
                key={m.id}
                onClick={() => setS({ muezzin: m.id })}
                className={`rounded-xl px-3 py-2.5 text-sm transition border ${
                  s.muezzin === m.id
                    ? "gold-fill text-black border-transparent"
                    : "bg-secondary/60 gold-border hover:bg-accent"
                }`}
              >
                {lang === "ar" ? m.ar : m.en}
              </button>
            ))}
          </div>
          <button
            onClick={previewAthan}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl gold-border bg-secondary px-4 py-2.5 text-sm hover:bg-accent"
          >
            {previewing ? <Square className="size-4" /> : <Play className="size-4" />}
            {previewing ? (lang === "ar" ? "إيقاف" : "Stop") : t("preview_athan")}
          </button>
        </section>

        {/* Volume */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2 text-foreground/90 inline-flex items-center gap-2">
            <Volume2 className="size-4" /> {t("volume")}
          </h3>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={s.volume}
            onChange={(e) => setS({ volume: parseFloat(e.target.value) })}
            className="w-full accent-[var(--gold)]"
          />
          <div className="text-xs text-muted-foreground mt-1 tabular-nums">
            {Math.round(s.volume * 100)}%
          </div>
        </section>

        {/* Reciter */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-2 text-foreground/90">{t("reciter")}</h3>
          <select
            value={s.reciter}
            onChange={(e) => setS({ reciter: e.target.value })}
            className="w-full rounded-xl gold-border bg-secondary px-3 py-2.5 text-sm"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id} className="bg-card">
                {lang === "ar" ? r.ar : r.en}
              </option>
            ))}
          </select>
        </section>

        {/* Notifications */}
        <section className="mt-6">
          <label className="flex items-center justify-between rounded-xl gold-border bg-secondary/60 px-3 py-3">
            <span className="inline-flex items-center gap-2 text-sm">
              <Bell className="size-4 text-primary" /> {t("notifications")}
            </span>
            <input
              type="checkbox"
              checked={s.notifications}
              onChange={(e) => toggleNotifs(e.target.checked)}
              className="size-5 accent-[var(--gold)]"
            />
          </label>
        </section>

        <p className="mt-6 text-[11px] text-muted-foreground">
          {lang === "ar"
            ? "تُحفظ إعداداتك محليًا على هذا الجهاز فقط."
            : "Your settings are saved locally on this device only."}
        </p>
      </aside>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl gold-border bg-secondary/60 px-3 py-2.5 cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "gold-fill" : "bg-muted gold-border"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${
            checked ? "start-[1.375rem]" : "start-0.5"
          }`}
        />
      </button>
    </label>
  );
}
