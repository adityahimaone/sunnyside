export type HeroSurface = 'cobalt' | 'sky' | 'paper'

const PAPER = '#fffaf1'

const MAT_RULER_NUMS = Array.from({ length: 24 }, (_, i) => ({
  index: i + 1,
  label: String(i + 1).padStart(2, '0'),
  x: 60 + i * 57.4,
}))

// Mobile shows 01..12, one label per two major ticks, so the ruler still
// spans the full mat width instead of stopping halfway.
const MAT_RULER_NUMS_MOBILE = Array.from({ length: 12 }, (_, i) => ({
  index: i + 1,
  label: String(i + 1).padStart(2, '0'),
  x: 60 + i * 114.8,
}))

const MAT_TICKS = Array.from({ length: 97 }, (_, i) => ({
  index: i,
  x: 60 + i * 14.35,
  major: i % 4 === 0,
}))

// Mobile ticks mirror the desktop set at half density: 12 numbered majors
// (one per mobile label) with 3 minor ticks between them, same span.
const MAT_TICKS_MOBILE = Array.from({ length: 49 }, (_, i) => ({
  index: i,
  x: 60 + i * 28.7,
  major: i % 4 === 0,
}))

const MAT_CORNERS = [
  [42, 42],
  [1398, 42],
  [42, 858],
  [1398, 858],
] as const

function TickLines({ ticks }: { ticks: typeof MAT_TICKS }) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t.index}>
          <line
            x1={t.x}
            x2={t.x}
            y1={22}
            y2={t.major ? 35 : 29}
            strokeOpacity={t.major ? 0.44 : 0.22}
            strokeWidth={t.major ? 1.3 : 0.9}
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={t.x}
            x2={t.x}
            y1={878}
            y2={t.major ? 865 : 871}
            strokeOpacity={t.major ? 0.44 : 0.22}
            strokeWidth={t.major ? 1.3 : 0.9}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </>
  )
}

/**
 * Blue Cutting-Mat Markings Overlay shared by HeroCity and Hero without pulling
 * the alternate inline-pill Hero bundle or its extra Google Font (`Oswald`).
 */
export function CuttingMatMarks() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <svg
        style={{ display: 'block', width: '100%', height: '100%' }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        focusable="false"
      >
        {/* Inner mat hairline border */}
        <rect
          x={24}
          y={22}
          width={1392}
          height={856}
          rx={18}
          fill="none"
          stroke={PAPER}
          strokeOpacity={0.26}
          strokeWidth={1.3}
          vectorEffect="non-scaling-stroke"
        />

        {/* Top & bottom ruler tick bars: 24 numbered majors on desktop,
            12 on mobile, matching the numbers on each breakpoint. */}
        <g stroke={PAPER} strokeLinecap="round" className="max-sm:hidden">
          <TickLines ticks={MAT_TICKS} />
        </g>
        <g stroke={PAPER} strokeLinecap="round" className="hidden max-sm:block">
          <TickLines ticks={MAT_TICKS_MOBILE} />
        </g>

        {/* Monospace ruler numbers: 01..24 on desktop, 01..12 on mobile.
            The 1440-wide ruler is squeezed to phone width, so 24 labels
            collide and blur. Mobile labels sit on every mobile major tick,
            so the ruler still spans the full mat width. */}
        <g
          fill={PAPER}
          fillOpacity={0.42}
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10.5"
          fontWeight="600"
          textAnchor="middle"
          className="max-sm:hidden"
        >
          {MAT_RULER_NUMS.map((n) => (
            <g key={n.index}>
              <text x={n.x} y={48}>
                {n.label}
              </text>
              <text x={n.x} y={859}>
                {n.label}
              </text>
            </g>
          ))}
        </g>
        <g
          fill={PAPER}
          fillOpacity={0.42}
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10.5"
          fontWeight="600"
          textAnchor="middle"
          className="hidden max-sm:block"
        >
          {MAT_RULER_NUMS_MOBILE.map((n) => (
            <g key={n.index}>
              <text x={n.x} y={48}>
                {n.label}
              </text>
              <text x={n.x} y={859}>
                {n.label}
              </text>
            </g>
          ))}
        </g>

        {/* Cutting-mat 30° / 45° / 60° protractor guide arcs */}
        <g
          fill="none"
          stroke={PAPER}
          strokeOpacity={0.15}
          strokeWidth={1.2}
          strokeDasharray="6 6"
        >
          <path d="M 720 878 A 420 420 0 0 1 1140 458" />
          <path d="M 720 878 A 420 420 0 0 0 300 458" />
          <line x1={720} y1={878} x2={1140} y2={458} />
          <line x1={720} y1={878} x2={300} y2={458} />
          <line x1={720} y1={878} x2={1084} y2={668} />
          <line x1={720} y1={878} x2={356} y2={668} />
          <line x1={720} y1={878} x2={930} y2={514} />
          <line x1={720} y1={878} x2={510} y2={514} />
        </g>

        {/* Corner registration crosshairs (+) */}
        <g stroke={PAPER} strokeOpacity={0.42} strokeWidth={1.4}>
          {MAT_CORNERS.map(([cx, cy]) => (
            <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
              <line x1={-8} y1={0} x2={8} y2={0} />
              <line x1={0} y1={-8} x2={0} y2={8} />
              <circle r={4} fill="none" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
