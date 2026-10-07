/**
 * An e-commerce operations floor: a cardboard shipping box, an invoice/
 * receipt card, a shopping bag, a barcode strip, and a dashed delivery
 * route from a small warehouse to a doorstep. All drawn as flat-shaded
 * SVG shapes (a "packaging blueprint" style) so it reads as a tasteful
 * operations-dashboard illustration rather than literal clipart.
 */
export function EcommerceScene() {
  const BOX_TOP = "oklch(0.62 0.09 55)";
  const BOX_LEFT = "oklch(0.42 0.07 55)";
  const BOX_RIGHT = "oklch(0.5 0.08 55)";
  const PAPER = "oklch(0.93 0.01 90 / 92%)";
  const INK = "oklch(0.3 0.01 90 / 85%)";
  const LINE = "var(--brand)";

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="presentation"
    >
      {/* dashed delivery route: warehouse -> doorstep */}
      <g
        fill="none"
        stroke={LINE}
        strokeOpacity={0.55}
        strokeWidth={4}
        strokeDasharray="2 14"
        strokeLinecap="round"
      >
        <path d="M 220 190 C 440 90, 700 640, 960 560" />
      </g>
      <path d="M 940 548 L 972 556 L 948 578 Z" fill="var(--brand)" fillOpacity={0.55} />

      {/* warehouse glyph */}
      <g
        transform="translate(150,140)"
        fill="none"
        stroke={LINE}
        strokeOpacity={0.6}
        strokeWidth={4}
      >
        <rect x={0} y={20} width={90} height={55} />
        <path d="M -8 20 L 45 -14 L 98 20" />
        <rect x={38} y={48} width={22} height={27} />
      </g>

      {/* doorstep / house glyph */}
      <g
        transform="translate(930,520)"
        fill="none"
        stroke={LINE}
        strokeOpacity={0.6}
        strokeWidth={4}
      >
        <path d="M 0 55 L 0 10 L 35 -22 L 70 10 L 70 55 Z" />
        <rect x={28} y={28} width={16} height={27} />
      </g>

      {/* isometric shipping box, bottom-left */}
      <g transform="translate(70,520)" opacity={0.95}>
        <polygon points="0,70 110,15 220,70 110,125" fill={BOX_TOP} />
        <polygon points="0,70 110,125 110,250 0,195" fill={BOX_LEFT} />
        <polygon points="220,70 110,125 110,250 220,195" fill={BOX_RIGHT} />
        <line x1={110} y1={125} x2={110} y2={250} stroke="oklch(0.3 0.05 55)" strokeWidth={3} />
        <line
          x1={0}
          y1={195}
          x2={110}
          y2={250}
          stroke="oklch(0.3 0.05 55)"
          strokeWidth={2}
          opacity={0.5}
        />
        <line
          x1={220}
          y1={195}
          x2={110}
          y2={250}
          stroke="oklch(0.3 0.05 55)"
          strokeWidth={2}
          opacity={0.5}
        />
        {/* shipping label with barcode */}
        <rect x={140} y={150} width={60} height={40} rx={2} fill={PAPER} />
        {[0, 6, 12, 18, 24, 30, 36, 42, 48, 54].map((dx, i) => (
          <rect
            key={dx}
            x={146 + dx}
            y={158}
            width={i % 3 === 0 ? 3 : 1.5}
            height={16}
            fill={INK}
          />
        ))}
      </g>

      {/* invoice / receipt card, top-right */}
      <g transform="translate(960,70)">
        <path
          d="M 0 0 H 170 V 230 L 157 222 L 144 230 L 131 222 L 118 230 L 105 222 L 92 230 L 79 222 L 66 230 L 53 222 L 40 230 L 27 222 L 14 230 L 0 222 Z"
          fill={PAPER}
        />
        <rect x={16} y={20} width={110} height={10} rx={2} fill={INK} opacity={0.75} />
        <rect x={16} y={44} width={138} height={4} fill={INK} opacity={0.3} />
        {[68, 84, 100, 116, 132].map((y) => (
          <g key={y}>
            <rect x={16} y={y} width={80} height={5} fill={INK} opacity={0.35} />
            <rect x={122} y={y} width={32} height={5} fill={INK} opacity={0.45} />
          </g>
        ))}
        <rect x={16} y={160} width={138} height={3} fill={INK} opacity={0.3} />
        <rect x={16} y={176} width={60} height={8} fill={INK} opacity={0.6} />
        <rect x={110} y={176} width={44} height={8} fill="var(--brand)" opacity={0.65} />
      </g>

      {/* shopping bag, mid-right */}
      <g
        transform="translate(1030,380)"
        fill="none"
        stroke={LINE}
        strokeOpacity={0.6}
        strokeWidth={4}
      >
        <path d="M 10 30 L 100 30 L 112 170 L -2 170 Z" />
        <path d="M 28 30 C 28 -4, 82 -4, 82 30" />
      </g>

      {/* standalone barcode accent, bottom-right */}
      <g transform="translate(1000,700)" opacity={0.5}>
        {[0, 5, 9, 16, 21, 24, 30, 36, 41, 45, 50, 56, 62, 67, 73].map((dx, i) => (
          <rect key={dx} x={dx * 1.6} y={0} width={i % 4 === 0 ? 4 : 2} height={44} fill={LINE} />
        ))}
      </g>
    </svg>
  );
}
