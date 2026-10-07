/**
 * An actual overhead football pitch — mowed-grass stripes, boundary lines,
 * halfway line, center circle, penalty boxes, six-yard boxes, penalty arcs,
 * goal frames and corner arcs. Pure SVG so it stays crisp and cheap at any
 * viewport size; colors are fixed grass/line tones (not the theme's --brand
 * token) so it always reads as a real pitch, never a generic green tint.
 */
export function FootballFieldScene() {
  const STRIPE_COLOR_A = "oklch(0.4 0.085 142)";
  const STRIPE_COLOR_B = "oklch(0.45 0.09 142)";
  const LINE = "oklch(0.98 0 0 / 60%)";
  const stripeWidth = 1200 / 12;

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="presentation"
    >
      {/* mowed-grass stripes */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={i * stripeWidth}
          y={0}
          width={stripeWidth}
          height={800}
          fill={i % 2 === 0 ? STRIPE_COLOR_A : STRIPE_COLOR_B}
        />
      ))}

      <g fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round">
        {/* touchline / goal line boundary */}
        <rect x={50} y={50} width={1100} height={700} />
        {/* halfway line */}
        <line x1={600} y1={50} x2={600} y2={750} />
        {/* center circle + spot */}
        <circle cx={600} cy={400} r={92} />
        <circle cx={600} cy={400} r={4} fill={LINE} stroke="none" />

        {/* left penalty box + six-yard box + arc + spot */}
        <rect x={50} y={210} width={200} height={380} />
        <rect x={50} y={300} width={75} height={200} />
        <path d="M 250 322 A 92 92 0 0 1 250 478" />
        <circle cx={168} cy={400} r={4} fill={LINE} stroke="none" />

        {/* right penalty box + six-yard box + arc + spot */}
        <rect x={950} y={210} width={200} height={380} />
        <rect x={1075} y={300} width={75} height={200} />
        <path d="M 950 322 A 92 92 0 0 0 950 478" />
        <circle cx={1032} cy={400} r={4} fill={LINE} stroke="none" />

        {/* goal frames */}
        <rect x={38} y={364} width={12} height={72} />
        <rect x={1150} y={364} width={12} height={72} />

        {/* corner arcs */}
        <path d="M 50 72 A 22 22 0 0 1 72 50" />
        <path d="M 1128 50 A 22 22 0 0 1 1150 72" />
        <path d="M 1150 728 A 22 22 0 0 1 1128 750" />
        <path d="M 72 750 A 22 22 0 0 1 50 728" />
      </g>
    </svg>
  );
}
