import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, BookOpen, Sparkles } from "lucide-react";
import type { FuseResultMatch } from "fuse.js";
import { searchFuse, type SearchDoc } from "@/lib/search-index";
import { useI18n } from "@/lib/i18n";

type Range = readonly [number, number];

// Render `text` with the matched character ranges (from Fuse) wrapped in <mark>.
function Highlight({ text, ranges }: { text: string; ranges: readonly Range[] | undefined }) {
  if (!ranges || ranges.length === 0 || !text) return <>{text}</>;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach(([start, end], i) => {
    if (start > cursor) out.push(text.slice(cursor, start));
    out.push(
      <mark key={i} className="rounded bg-primary/30 text-foreground px-0.5">
        {text.slice(start, end + 1)}
      </mark>,
    );
    cursor = end + 1;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return <>{out}</>;
}

function rangesFor(
  matches: readonly FuseResultMatch[] | undefined,
  key: string,
): Range[] | undefined {
  return matches?.find((m) => m.key === key)?.indices as Range[] | undefined;
}

export function GlobalSearch() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim();
    if (term.length < 2) return [];
    return searchFuse.search(term, { limit: 24 });
  }, [q]);

  useEffect(() => setActive(0), [q]);

  // Close the results panel on outside click.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function go(doc: SearchDoc) {
    setOpen(false);
    setQ("");
    if (doc.to === "/quran/$id" && doc.param) {
      navigate({ to: "/quran/$id", params: { id: doc.param } });
    } else {
      navigate({ to: doc.to });
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r.item);
    }
  }

  const showPanel = open && q.trim().length >= 1;

  return (
    <div className="fixed inset-x-0 bottom-[68px] md:bottom-4 z-40 px-3 pointer-events-none">
      <div ref={wrapRef} className="mx-auto w-full max-w-2xl pointer-events-auto">
        {showPanel && (
          <div className="mb-2 max-h-[55vh] overflow-y-auto rounded-2xl gold-border-strong bg-popover/95 backdrop-blur-xl card-shadow p-1.5">
            {results.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {q.trim().length < 2 ? t("search_hint") : t("no_results")}
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((r, i) => {
                  const d = r.item;
                  const isQuran = d.kind === "quran";
                  const Icon = isQuran ? BookOpen : Sparkles;
                  return (
                    <li key={d.id}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(d)}
                        className={`w-full text-start rounded-xl px-3 py-2.5 transition flex items-start gap-3 ${
                          i === active ? "bg-primary/15" : "hover:bg-accent"
                        }`}
                      >
                        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full gold-border bg-secondary/60 px-2 py-0.5 text-[10px] text-primary">
                          <Icon className="size-3" />
                          {isQuran ? t("nav_quran") : t("nav_dhikr")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block arabic text-base leading-relaxed line-clamp-2 text-end">
                            <Highlight text={d.primary} ranges={rangesFor(r.matches, "primary")} />
                          </span>
                          {d.secondary && (
                            <span className="block text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              <Highlight
                                text={d.secondary}
                                ranges={rangesFor(r.matches, "secondary")}
                              />
                            </span>
                          )}
                          <span className="block text-[10px] text-primary/70 mt-0.5">
                            <Highlight text={d.meta} ranges={rangesFor(r.matches, "meta")} />
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <div className="relative">
          <Search
            className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "end-4" : "start-4"} size-4 text-muted-foreground`}
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={t("search_all")}
            aria-label={t("search_all")}
            className={`w-full rounded-full gold-border-strong bg-card/95 backdrop-blur-xl card-shadow py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 ${
              lang === "ar" ? "pe-11 ps-10" : "ps-11 pe-10"
            }`}
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                setOpen(false);
              }}
              aria-label={t("clear")}
              className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "start-3" : "end-3"} rounded-full p-1 hover:bg-accent`}
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
