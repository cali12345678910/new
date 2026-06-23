export type Loc = { lat: number; lng: number; label: string };

const KEY = "muadhin.location";

export const DEFAULT_LOC: Loc = { lat: 21.4225, lng: 39.8262, label: "Makkah, Saudi Arabia" };

export function loadLocation(): Loc {
  if (typeof window === "undefined") return DEFAULT_LOC;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Loc;
  } catch {}
  return DEFAULT_LOC;
}

export function saveLocation(loc: Loc) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(loc));
}

export async function detectLocation(): Promise<Loc> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let label = `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`);
          const j = await r.json();
          const a = j.address ?? {};
          label = [a.city || a.town || a.village || a.county, a.country].filter(Boolean).join(", ") || label;
        } catch {}
        resolve({ lat, lng, label });
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  });
}

export async function searchPlace(q: string): Promise<Loc[]> {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`);
  const arr = (await r.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  return arr.map((x) => ({ lat: parseFloat(x.lat), lng: parseFloat(x.lon), label: x.display_name }));
}

/** Great-circle bearing from (lat,lng) to Kaaba in degrees from true North. */
export function qiblaBearing(lat: number, lng: number): number {
  const KAABA = { lat: 21.4225, lng: 39.8262 };
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(lat), φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lng - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
