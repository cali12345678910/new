// Circular radial progress ring with a slowly ticking golden arc.
export function RadialCountdown({
  size = 260,
  stroke = 14,
  progress, // 0..1 (1 = full ring = full interval elapsed)
  children,
}: {
  size?: number;
  stroke?: number;
  progress: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - p);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
        <defs>
          <linearGradient id="rc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a6b1a" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="80%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#f5e9c8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(212,175,55,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#rc-gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center px-4">{children}</div>
    </div>
  );
}
