import { useRef, useState } from "react";
import { Share2, Download, X, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export type ShareContent = {
  kind: "dhikr" | "ayah";
  ar: string;
  translit?: string;
  en?: string;
  source?: string; // hadith source or surah reference
};

// "Share as Image" — renders an elegant, self-branded Al-Maqam card and exports
// it to PNG fully client-side via html-to-image. The card uses a fixed luxury
// palette (matte black + gold) and only open-licensed assets: the in-repo SVG
// logo and OFL Google Fonts already bundled with the app.
export function ShareButton({ content, className }: { content: ShareContent; className?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={(e) => {
          // Works even when nested inside a <Link> card.
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={
          className ??
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] gold-border bg-secondary/60 hover:bg-accent"
        }
        aria-label={t("share_image")}
      >
        <Share2 className="size-3" /> {t("share_image")}
      </button>
      {open && <ShareModal content={content} onClose={() => setOpen(false)} />}
    </>
  );
}

function ShareModal({ content, onClose }: { content: ShareContent; onClose: () => void }) {
  const { t, lang } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function render(): Promise<Blob | null> {
    if (!cardRef.current) return null;
    const { toBlob } = await import("html-to-image");
    return toBlob(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#0a0a0a",
    });
  }

  async function download() {
    setBusy(true);
    try {
      const blob = await render();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "al-maqam.png";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    setBusy(true);
    try {
      const blob = await render();
      if (!blob) return;
      const file = new File([blob], "al-maqam.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Al-Maqam" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "al-maqam.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      /* user cancelled share */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg gold-text">{t("share_image")}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-accent"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* The exported node. Fixed brand palette so output is consistent. */}
        <div className="overflow-hidden rounded-2xl">
          <div
            ref={cardRef}
            dir="rtl"
            style={{
              width: "100%",
              background: "linear-gradient(160deg, #0e0e0e 0%, #0a0a0a 60%, #14110a 100%)",
              padding: "32px 28px",
              position: "relative",
              fontFamily: '"Amiri Quran","Amiri","Scheherazade New",serif',
            }}
          >
            <BrandStar />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  textAlign: "center",
                  color: "#b8a96b",
                  letterSpacing: "0.3em",
                  fontSize: "11px",
                  marginBottom: "18px",
                }}
              >
                {content.kind === "ayah" ? "آية" : "ذكر"}
              </div>
              <p
                style={{
                  color: "#f5e9c8",
                  fontSize: "26px",
                  lineHeight: 2,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {content.ar}
              </p>
              {content.translit && (
                <p
                  style={{
                    color: "#b8a96b",
                    fontStyle: "italic",
                    fontSize: "13px",
                    textAlign: "center",
                    marginTop: "14px",
                    direction: "ltr",
                  }}
                >
                  {content.translit}
                </p>
              )}
              {content.en && (
                <p
                  style={{
                    color: "rgba(245,233,200,0.85)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    textAlign: "center",
                    marginTop: "12px",
                    direction: "ltr",
                  }}
                >
                  {content.en}
                </p>
              )}
              {content.source && (
                <p
                  style={{
                    color: "#8a7c4a",
                    fontSize: "12px",
                    textAlign: "center",
                    marginTop: "14px",
                    direction: "ltr",
                  }}
                >
                  {content.source}
                </p>
              )}

              <div
                style={{
                  marginTop: "26px",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(212,175,55,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <BrandLogo />
                <div style={{ textAlign: lang === "ar" ? "right" : "left", direction: "ltr" }}>
                  <div style={{ color: "#f5e9c8", fontSize: "16px", fontWeight: 700 }}>
                    الْمَقَام
                  </div>
                  <div style={{ color: "#b8a96b", fontSize: "9px", letterSpacing: "0.25em" }}>
                    AL-MAQAM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={download}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl gold-border bg-secondary px-4 py-2.5 text-sm hover:bg-accent disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {lang === "ar" ? "تنزيل" : "Download"}
          </button>
          <button
            onClick={share}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl gold-fill text-black px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            <Share2 className="size-4" />
            {lang === "ar" ? "مشاركة" : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandStar() {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        position: "absolute",
        top: "-40px",
        insetInlineEnd: "-40px",
        width: "180px",
        height: "180px",
        opacity: 0.12,
      }}
      fill="none"
      stroke="#d4af37"
      strokeWidth="0.8"
    >
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="60" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="100" y1="100" x2="100" y2="20" transform={`rotate(${i * 30} 100 100)`} />
      ))}
    </svg>
  );
}

function BrandLogo() {
  return (
    <svg viewBox="0 0 64 64" width={36} height={36} aria-hidden="true">
      <defs>
        <linearGradient id="share-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6b1a" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#f5e9c8" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="14"
        fill="#0a0a0a"
        stroke="url(#share-gold)"
        strokeWidth="1.2"
      />
      <g
        transform="translate(32 32)"
        stroke="url(#share-gold)"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      >
        <polygon points="0,-16 3.8,-3.8 16,0 3.8,3.8 0,16 -3.8,3.8 -16,0 -3.8,-3.8" />
        <polygon
          points="0,-16 3.8,-3.8 16,0 3.8,3.8 0,16 -3.8,3.8 -16,0 -3.8,-3.8"
          transform="rotate(45)"
          opacity="0.85"
        />
        <circle r="3" fill="url(#share-gold)" stroke="none" />
      </g>
    </svg>
  );
}
