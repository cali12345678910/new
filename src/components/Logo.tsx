// Al-Maqam — "المقام" Arabic calligraphy under a golden geometric Islamic star, on matte black.
export function Logo({ size = 40, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        aria-label="Al-Maqam"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="alm-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a6b1a" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#f5e9c8" />
          </linearGradient>
          <radialGradient id="alm-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,215,0,0.35)" />
            <stop offset="100%" stopColor="rgba(255,215,0,0)" />
          </radialGradient>
        </defs>
        {/* matte black rounded backdrop */}
        <rect x="1" y="1" width="62" height="62" rx="14" fill="#0a0a0a" stroke="url(#alm-gold)" strokeWidth="1.2" />
        <circle cx="32" cy="22" r="14" fill="url(#alm-glow)" />
        {/* 8-point geometric Islamic star */}
        <g transform="translate(32 22)" stroke="url(#alm-gold)" strokeWidth="1.4" fill="none" strokeLinejoin="round">
          <polygon points="0,-11 2.6,-2.6 11,0 2.6,2.6 0,11 -2.6,2.6 -11,0 -2.6,-2.6" />
          <polygon
            points="0,-11 2.6,-2.6 11,0 2.6,2.6 0,11 -2.6,2.6 -11,0 -2.6,-2.6"
            transform="rotate(45)"
            opacity="0.85"
          />
          <circle r="2.2" fill="url(#alm-gold)" stroke="none" />
        </g>
        {/* "المقام" calligraphic mark — stylized */}
        <text
          x="32"
          y="52"
          textAnchor="middle"
          fontFamily="'Amiri Quran','Amiri',serif"
          fontSize="14"
          fontWeight="700"
          fill="url(#alm-gold)"
          style={{ letterSpacing: "0.5px" }}
        >
          المقام
        </text>
      </svg>
      {withText && (
        <div className="min-w-0 leading-tight">
          <div className="font-display text-lg gold-text">الْمَقَام</div>
          <div className="text-[10px] text-muted-foreground tracking-widest">AL-MAQAM</div>
        </div>
      )}
    </div>
  );
}
