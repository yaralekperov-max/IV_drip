/** Декоративная SVG-капельница из прототипа (лендинг Hero). */
export function IvDripSvg() {
  return (
    <svg
      className="h-full w-auto overflow-visible drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      viewBox="0 0 280 560"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Капельница"
      role="img"
    >
      <defs>
        <linearGradient id="bagGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="0.16" stopColor="#ffffff" stopOpacity="0.20" />
          <stop offset="0.32" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.62" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="0.82" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="fluidGrad" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#C9A86A" stopOpacity="0.30" />
          <stop offset="0.35" stopColor="#E3C78D" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#C9A86A" stopOpacity="0.42" />
          <stop offset="1" stopColor="#A8854A" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="fluidTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E3C78D" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#F2E6C8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#E3C78D" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="hubGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E3C78D" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E3C78D" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bagClip">
          <path d="M70 80 Q66 74 78 70 L202 70 Q214 74 210 80 Q218 110 216 180 L216 360 Q216 408 188 420 L172 426 Q140 436 108 426 L92 420 Q64 408 64 360 L64 180 Q62 110 70 80 Z" />
        </clipPath>
      </defs>

      <path d="M140 18 Q126 18 126 34 L126 52" fill="none" stroke="rgba(242,239,232,0.35)" strokeWidth="3" strokeLinecap="round" />
      <path d="M140 18 Q154 18 154 34 L154 52" fill="none" stroke="rgba(242,239,232,0.22)" strokeWidth="3" strokeLinecap="round" />
      <rect x="128" y="50" width="24" height="12" rx="6" fill="none" stroke="rgba(242,239,232,0.3)" strokeWidth="2" />

      <g>
        <path d="M70 80 Q66 74 78 70 L202 70 Q214 74 210 80 Z" fill="rgba(242,239,232,0.16)" stroke="rgba(242,239,232,0.3)" strokeWidth="1.5" />
        <line x1="80" y1="76" x2="200" y2="76" stroke="rgba(242,239,232,0.25)" strokeWidth="1" strokeDasharray="2 3" />
        <path
          d="M70 80 Q66 74 78 70 L202 70 Q214 74 210 80 Q218 110 216 180 L216 360 Q216 408 188 420 L172 426 Q140 436 108 426 L92 420 Q64 408 64 360 L64 180 Q62 110 70 80 Z"
          fill="url(#bagGlass)"
          stroke="rgba(242,239,232,0.4)"
          strokeWidth="2"
        />
        <g clipPath="url(#bagClip)">
          <rect x="60" y="250" width="160" height="200" fill="url(#fluidGrad)" />
          <rect className="animate-fluidslosh origin-center" x="60" y="248" width="160" height="6" fill="url(#fluidTop)" />
          <ellipse cx="110" cy="330" rx="26" ry="60" fill="#ffffff" opacity="0.06" />
        </g>
        <path d="M96 96 Q104 200 92 330 Q88 380 100 408" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.12" />
        <path d="M150 86 Q156 220 150 410" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.07" />
        <path d="M186 100 Q178 210 192 340 Q196 384 182 410" fill="none" stroke="#000000" strokeWidth="2" opacity="0.10" />
        <path d="M82 100 Q92 110 88 200 Q86 250 92 300" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.18" strokeLinecap="round" />
        <path d="M84 110 Q90 150 88 210" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
        <g stroke="rgba(242,239,232,0.4)" strokeWidth="1.5">
          <line x1="80" y1="170" x2="92" y2="170" />
          <line x1="80" y1="205" x2="88" y2="205" />
          <line x1="80" y1="240" x2="92" y2="240" />
          <line x1="80" y1="275" x2="88" y2="275" />
          <line x1="80" y1="310" x2="92" y2="310" />
        </g>
        <rect x="158" y="300" width="40" height="26" rx="2" fill="rgba(20,20,18,0.35)" stroke="rgba(242,239,232,0.18)" strokeWidth="1" />
        <line x1="164" y1="308" x2="192" y2="308" stroke="rgba(242,239,232,0.3)" strokeWidth="1.5" />
        <line x1="164" y1="314" x2="186" y2="314" stroke="rgba(242,239,232,0.22)" strokeWidth="1.5" />
        <line x1="164" y1="320" x2="190" y2="320" stroke="rgba(242,239,232,0.22)" strokeWidth="1.5" />
      </g>

      <path d="M126 426 L154 426 L148 452 L132 452 Z" fill="rgba(242,239,232,0.12)" stroke="rgba(242,239,232,0.3)" strokeWidth="1.5" />
      <rect x="133" y="450" width="14" height="16" rx="2" fill="rgba(242,239,232,0.10)" stroke="rgba(242,239,232,0.28)" strokeWidth="1.5" />

      <rect x="126" y="466" width="28" height="60" rx="9" fill="rgba(242,239,232,0.06)" stroke="rgba(242,239,232,0.3)" strokeWidth="1.5" />
      <path d="M127 508 Q140 504 153 508 L153 517 Q140 524 127 517 Z" fill="#C9A86A" opacity="0.5" />
      <ellipse className="animate-dripfall" cx="140" cy="476" rx="3.2" ry="4" fill="#F2E6C8" />
      <line x1="132" y1="472" x2="132" y2="514" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" />

      <path d="M140 526 Q138 545 141 560" fill="none" stroke="rgba(242,239,232,0.3)" strokeWidth="3" strokeLinecap="round" />
      <rect x="132" y="536" width="16" height="20" rx="3" fill="rgba(242,239,232,0.12)" stroke="rgba(242,239,232,0.3)" strokeWidth="1.5" />
      <circle cx="140" cy="546" r="3" fill="rgba(242,239,232,0.35)" />

      <circle className="animate-hubpulse" style={{ transformOrigin: "140px 552px" }} cx="140" cy="552" r="70" fill="url(#hubGlow)" />
    </svg>
  );
}
