import { useState } from "react";
import { MapPin, LocateFixed, Search, Loader2 } from "lucide-react";
import { detectLocation, saveLocation, searchPlace, type Loc } from "@/lib/location";
import { useI18n } from "@/lib/i18n";

export function LocationBar({ loc, onChange }: { loc: Loc; onChange: (l: Loc) => void }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Loc[]>([]);
  const [busy, setBusy] = useState(false);

  async function doDetect() {
    setBusy(true);
    try {
      const l = await detectLocation();
      saveLocation(l);
      onChange(l);
      setOpen(false);
    } catch (e) {
      alert(lang === "ar" ? "تعذّر تحديد الموقع" : "Could not detect location");
    } finally {
      setBusy(false);
    }
  }

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try {
      setResults(await searchPlace(q.trim()));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl gold-border bg-card card-shadow p-3 sm:p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate text-sm">{loc.label}</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-full gold-fill text-black text-xs font-medium px-3 py-1.5 hover:opacity-90 transition"
        >
          {t("change_location")}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-2">
          <button
            onClick={doDetect}
            disabled={busy}
            className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LocateFixed className="size-4" />
            )}
            {t("detect_location")}
          </button>
          <form onSubmit={doSearch} className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن مدينة…" : "Search a city…"}
              className="flex-1 min-w-0 rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="rounded-xl bg-secondary px-3 py-2 text-sm hover:bg-accent">
              <Search className="size-4" />
            </button>
          </form>
          {results.length > 0 && (
            <ul className="max-h-64 overflow-auto divide-y divide-border rounded-xl border border-border bg-card">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      saveLocation(r);
                      onChange(r);
                      setOpen(false);
                      setResults([]);
                      setQ("");
                    }}
                    className="w-full text-start px-3 py-2 text-sm hover:bg-accent"
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
