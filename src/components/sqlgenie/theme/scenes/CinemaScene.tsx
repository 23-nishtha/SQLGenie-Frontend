/**
 * A cinema set: film-strip letterbox bars (top/bottom, sprocket holes and
 * all) framing the viewport, pleated theater curtains at the left/right
 * edges, a spotlight beam over the stage, and small film-reel/ticket-stub
 * accents in the corners. Pure SVG, fixed cinema tones so it reads as a
 * real theater rather than "dark background with a red tint".
 */
export function CinemaScene() {
  const FILM = "oklch(0.07 0 0 / 88%)";
  const CURTAIN_LIGHT = "oklch(0.32 0.1 18 / 70%)";
  const CURTAIN_DARK = "oklch(0.2 0.08 18 / 75%)";
  const LINE = "var(--brand)";

  const holes = Array.from({ length: 28 }, (_, i) => 20 + i * 42);

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="presentation"
    >
      <defs>
        <radialGradient id="cinema-spotlight" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} />
          <stop offset="55%" stopColor="var(--brand)" stopOpacity={0.08} />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* spotlight beam over the stage */}
      <polygon points="470,0 730,0 980,760 220,760" fill="url(#cinema-spotlight)" />

      {/* pleated curtains, left + right */}
      <g opacity={0.9}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`l${i}`}
            x={i * 24}
            y={46}
            width={26}
            height={708}
            fill={i % 2 === 0 ? CURTAIN_DARK : CURTAIN_LIGHT}
            rx={13}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`r${i}`}
            x={1200 - 24 - i * 24 - 26}
            y={46}
            width={26}
            height={708}
            fill={i % 2 === 0 ? CURTAIN_DARK : CURTAIN_LIGHT}
            rx={13}
          />
        ))}
      </g>

      {/* film-strip letterbox bars, top + bottom */}
      {[0, 754].map((y) => (
        <g key={y}>
          <rect x={0} y={y} width={1200} height={46} fill={FILM} />
          {holes.map((x) => (
            <rect
              key={`${y}-a-${x}`}
              x={x}
              y={y + 8}
              width={18}
              height={12}
              rx={3}
              fill="var(--background)"
            />
          ))}
          {holes.map((x) => (
            <rect
              key={`${y}-b-${x}`}
              x={x}
              y={y + 26}
              width={18}
              height={12}
              rx={3}
              fill="var(--background)"
            />
          ))}
        </g>
      ))}

      {/* film reel accent, bottom-left */}
      <g
        transform="translate(96,690)"
        fill="none"
        stroke={LINE}
        strokeOpacity={0.55}
        strokeWidth={3}
      >
        <circle r={34} />
        <circle r={7} fill={LINE} fillOpacity={0.55} stroke="none" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1={0}
            y1={0}
            x2={30 * Math.cos((deg * Math.PI) / 180)}
            y2={30 * Math.sin((deg * Math.PI) / 180)}
          />
        ))}
      </g>

      {/* ticket stub accent, bottom-right */}
      <g transform="translate(1040,672)">
        <rect
          x={0}
          y={0}
          width={110}
          height={56}
          rx={6}
          fill="none"
          stroke={LINE}
          strokeOpacity={0.5}
          strokeWidth={3}
        />
        <circle cx={70} cy={0} r={7} fill="var(--background)" />
        <circle cx={70} cy={56} r={7} fill="var(--background)" />
        <line
          x1={70}
          y1={10}
          x2={70}
          y2={46}
          stroke={LINE}
          strokeOpacity={0.4}
          strokeWidth={2}
          strokeDasharray="3 4"
        />
        <text x={35} y={33} fontSize={20} fill={LINE} fillOpacity={0.6} textAnchor="middle">
          ★
        </text>
      </g>
    </svg>
  );
}
