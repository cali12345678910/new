import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Compass as CompassIcon, AlertTriangle } from "lucide-react";

import { LocationBar } from "@/components/LocationBar";
import { loadLocation, qiblaBearing, type Loc } from "@/lib/location";
import { useI18n } from "@/lib/i18n";

// iOS 13+ exposes a permission gate on the DeviceOrientationEvent constructor
// that isn't in the standard DOM lib types.
type DeviceOrientationEventStatic = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied" | "default">;
};

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [
      { title: "القبلة | Qibla — Al-Maqam" },
      {
        name: "description",
        content:
          "Find the precise direction of the Kaaba using your live location with a luxurious golden compass.",
      },
    ],
  }),
  component: QiblaPage,
});

function QiblaPage() {
  const { t, lang } = useI18n();
  const [loc, setLoc] = useState<Loc>(() => loadLocation());
  const [heading, setHeading] = useState<number | null>(null);
  const [supported, setSupported] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  const bearing = qiblaBearing(loc.lat, loc.lng);

  const onOrientRef = useRef((e: DeviceOrientationEvent) => {
    const compassHeading =
      (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
      (e.alpha !== null ? 360 - e.alpha : null);
    if (typeof compassHeading === "number") setHeading(compassHeading);
  });

  useEffect(() => {
    const onOrient = onOrientRef.current;
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setSupported(true);
      const doe = window.DeviceOrientationEvent as DeviceOrientationEventStatic;
      if (typeof doe.requestPermission === "function") {
        setNeedsPermission(true);
      } else {
        window.addEventListener("deviceorientationabsolute", onOrient as EventListener, true);
        window.addEventListener("deviceorientation", onOrient, true);
      }
    }
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrient as EventListener, true);
      window.removeEventListener("deviceorientation", onOrient, true);
    };
  }, []);

  async function requestPerm() {
    const doe = window.DeviceOrientationEvent as DeviceOrientationEventStatic;
    try {
      const res = await doe.requestPermission?.();
      if (res === "granted") {
        setNeedsPermission(false);
        window.addEventListener("deviceorientation", onOrientRef.current, true);
      }
    } catch {
      /* ignore */
    }
  }

  const needle = heading !== null ? (bearing - heading + 360) % 360 : bearing;
  const angularDelta = heading !== null ? Math.abs(((bearing - heading + 540) % 360) - 180) : null;
  const aligned = angularDelta !== null && angularDelta < 5;

  return (
    <div className="space-y-4">
      <LocationBar loc={loc} onChange={setLoc} />

      <div className="rounded-3xl gold-border gold-gradient card-shadow p-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("qibla_dir")}
        </div>
        <div className="font-display text-6xl gold-text mt-1 tabular-nums">
          {bearing.toFixed(1)}°
        </div>
        <div className="text-xs text-muted-foreground">{t("degrees_to_kaaba")}</div>

        {angularDelta !== null && (
          <div className="mt-2 text-xs text-muted-foreground tabular-nums">
            {lang === "ar" ? "الفرق: " : "Delta: "}
            <span className="text-foreground font-mono">{angularDelta.toFixed(1)}°</span>
          </div>
        )}

        <div className="mx-auto mt-6 relative size-72 sm:size-80 rounded-full gold-border-strong bg-background grid place-items-center">
          {/* outer tick ring */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full text-primary opacity-70">
            {Array.from({ length: 72 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="8"
                x2="100"
                y2={i % 6 === 0 ? "18" : "13"}
                stroke="currentColor"
                strokeWidth={i % 6 === 0 ? 1.4 : 0.6}
                transform={`rotate(${i * 5} 100 100)`}
              />
            ))}
          </svg>
          {["N", "E", "S", "W"].map((d, i) => (
            <div
              key={d}
              className="absolute text-xs font-display text-primary"
              style={{
                top: i === 0 ? 18 : i === 2 ? "auto" : "50%",
                bottom: i === 2 ? 18 : "auto",
                left: i === 3 ? 18 : i === 1 ? "auto" : "50%",
                right: i === 1 ? 18 : "auto",
                transform: i === 0 || i === 2 ? "translateX(-50%)" : "translateY(-50%)",
              }}
            >
              {d}
            </div>
          ))}

          {/* Kaaba marker (anchored at top, always pointing where the Kaaba lies) */}
          <div
            className="absolute inset-0 grid place-items-center pointer-events-none"
            style={{
              transform: `rotate(${needle}deg)`,
              transition: "transform 600ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            <div className="absolute top-3 grid place-items-center size-9 rounded-md gold-fill text-black text-[10px] font-bold shadow-md">
              ⌂
            </div>
            {/* golden needle */}
            <div
              className="absolute h-1/2 origin-bottom"
              style={{
                top: 0,
                width: 4,
                background:
                  "linear-gradient(to top, transparent 0%, rgba(212,175,55,0.4) 20%, #FFD700 80%, #fff8d6 100%)",
                borderRadius: 4,
                boxShadow: aligned
                  ? "0 0 24px #FFD700, 0 0 48px rgba(255,215,0,0.6)"
                  : "0 0 12px rgba(212,175,55,0.5)",
              }}
            />
          </div>

          {/* center pivot */}
          <div className="absolute size-5 rounded-full gold-fill ring-2 ring-black/40" />

          <div className="absolute bottom-4 text-[10px] text-muted-foreground">
            {heading !== null
              ? lang === "ar"
                ? `اتجاهك ${heading.toFixed(0)}°`
                : `Heading ${heading.toFixed(0)}°`
              : ""}
          </div>
        </div>

        {aligned && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full gold-fill text-black px-4 py-1.5 text-sm font-medium animate-gold-pulse">
            ✓ {lang === "ar" ? "أنت في اتجاه القبلة" : "You are facing the Qibla"}
          </div>
        )}

        {needsPermission && (
          <button
            onClick={requestPerm}
            className="mt-4 rounded-full gold-fill text-black px-4 py-2 text-sm font-medium"
          >
            {lang === "ar" ? "السماح بالبوصلة" : "Enable compass"}
          </button>
        )}

        {!supported && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
            <AlertTriangle className="size-3.5" />
            {lang === "ar"
              ? "البوصلة غير مدعومة في هذا الجهاز — يُعرض الاتجاه المحسوب."
              : "Compass not supported here — showing computed bearing."}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-secondary/60 gold-border p-3">
            <div className="text-muted-foreground">{lang === "ar" ? "موقعك" : "Your location"}</div>
            <div className="font-mono mt-1 tabular-nums">
              {loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}
            </div>
          </div>
          <div className="rounded-xl bg-secondary/60 gold-border p-3">
            <div className="text-muted-foreground">{lang === "ar" ? "الكعبة" : "Kaaba"}</div>
            <div className="font-mono mt-1 tabular-nums">21.422°, 39.826°</div>
          </div>
        </div>
      </div>
    </div>
  );
}
