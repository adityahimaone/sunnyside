import type { CSSProperties, ReactNode } from 'react'

import {
  coilPath,
  domeRibs,
  gearPath,
  starPath,
  VIEWBOX,
  vars,
} from './geometry'
import s from './diorama.module.css'

/**
 * The drawn half of the diorama. Every shape is in the reference capture's own
 * pixel space (see geometry.ts), grouped into one SVG per physical layer so the
 * stage can move them against each other. All of it is decorative: the words,
 * numbers, sliders and buttons are real HTML in the overlay.
 */

const INK = '#2b2118'
const CARD = '#6d5330'

function Layer({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="none"
      className={s.art}
      data-art={label}
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Shared gradients and soft shadows. Referenced by id from every layer. */
export function DioramaDefs() {
  return (
    <svg className={s.defs} width="0" height="0" aria-hidden focusable="false">
      <defs>
        <filter id="dg-s1" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0.8"
            dy="1.6"
            stdDeviation="1.1"
            floodColor="#1a0f08"
            floodOpacity="0.42"
          />
        </filter>
        <filter id="dg-s2" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow
            dx="2"
            dy="3.2"
            stdDeviation="2.6"
            floodColor="#140a05"
            floodOpacity="0.5"
          />
        </filter>
        <filter id="dg-s3" x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow
            dx="3.4"
            dy="5"
            stdDeviation="4.4"
            floodColor="#0c0603"
            floodOpacity="0.6"
          />
        </filter>
        <linearGradient id="dg-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4262c8" />
          <stop offset="0.55" stopColor="#3453ad" />
          <stop offset="1" stopColor="#2a418f" />
        </linearGradient>
        <linearGradient id="dg-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9cf48" />
          <stop offset="0.6" stopColor="#f2bd32" />
          <stop offset="1" stopColor="#e4a824" />
        </linearGradient>
        <linearGradient id="dg-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4bad2" />
          <stop offset="1" stopColor="#ecaac6" />
        </linearGradient>
        <linearGradient id="dg-tan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3bd98" />
          <stop offset="1" stopColor="#c0a67d" />
        </linearGradient>
        <linearGradient id="dg-cardboard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5a373" />
          <stop offset="1" stopColor="#a98557" />
        </linearGradient>
        <radialGradient id="dg-dome" cx="0.38" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#5876d6" />
          <stop offset="0.6" stopColor="#4561c4" />
          <stop offset="1" stopColor="#2f48a4" />
        </radialGradient>
        <linearGradient id="bk-cloth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f55d4" />
          <stop offset="0.6" stopColor="#3347bd" />
          <stop offset="1" stopColor="#27379a" />
        </linearGradient>
        <linearGradient id="bk-cloth-in" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c3da6" />
          <stop offset="1" stopColor="#202e86" />
        </linearGradient>
        <pattern
          id="bk-weave"
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 0L3 3M3 0L0 3"
            stroke="#0e1650"
            strokeOpacity="0.35"
            strokeWidth="0.4"
          />
        </pattern>
        <pattern
          id="bk-dots"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="1.5"
            cy="1.5"
            r="0.55"
            fill="#8c7a55"
            fillOpacity="0.22"
          />
        </pattern>
        <linearGradient id="bk-gutter-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2a10" stopOpacity="0.34" />
          <stop offset="0.35" stopColor="#3a2a10" stopOpacity="0.1" />
          <stop offset="1" stopColor="#3a2a10" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bk-gutter-l" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#3a2a10" stopOpacity="0.34" />
          <stop offset="0.35" stopColor="#3a2a10" stopOpacity="0.1" />
          <stop offset="1" stopColor="#3a2a10" stopOpacity="0" />
        </linearGradient>
        <pattern
          id="dg-corrugate"
          width="3"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 0V10"
            stroke="#6b4a26"
            strokeOpacity="0.22"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
    </svg>
  )
}

/* ── small parts ─────────────────────────────────────────────────────────── */

function Cloud({
  x,
  y,
  w,
  h,
  fill,
  shade,
  stroke,
  className,
  style,
}: {
  x: number
  y: number
  w: number
  h: number
  fill: string
  shade: string
  stroke: string
  className?: string
  style?: CSSProperties
}) {
  const d =
    'M16 52C5 52-2 44 3 35C7 28 15 26 20 28C19 15 31 6 44 10C50 1 70 1 75 14C88 11 99 21 94 33C101 43 94 52 82 52Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${w / 100} ${h / 56})`}>
      <g className={className} style={style}>
        <path d={d} fill={shade} transform="translate(1.5 4)" opacity="0.55" />
        <path
          d={d}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M20 30C22 18 32 12 44 14C52 6 68 7 73 17"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.38"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

function Sparkle4({
  x,
  y,
  r,
  delay,
}: {
  x: number
  y: number
  r: number
  delay: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 8})`}>
      <path
        d="M0-8C1-2 2-1 8 0C2 1 1 2 0 8C-1 2-2 1-8 0C-2-1-1-2 0-8Z"
        fill="#86a8f2"
        stroke="#2b43a2"
        strokeWidth="0.7"
        className={s.twinkle}
        style={vars({ '--delay': `${delay}s` })}
      />
    </g>
  )
}

function Coil({
  x,
  y1,
  y2,
  className,
  style,
  color = '#8a6a3c',
}: {
  x: number
  y1: number
  y2: number
  className?: string
  style?: CSSProperties
  color?: string
}) {
  const d = coilPath(x, y1, y2, 7.5, 5)
  return (
    <g className={className} style={style}>
      <path
        d={d}
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  )
}

function Gear({
  cx,
  cy,
  outer,
  root,
  teeth,
  fill,
  stroke,
  hub,
  holes,
  holeRadius,
  holeFill,
  className,
  style,
}: {
  cx: number
  cy: number
  outer: number
  root: number
  teeth: number
  fill: string
  stroke: string
  hub: number
  holes: number
  holeRadius: number
  holeFill: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <g className={className} style={style} filter="url(#dg-s2)">
      <path
        d={gearPath(cx, cy, outer, root, teeth)}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <circle
        cx={cx}
        cy={cy}
        r={root - 3}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.55"
        strokeWidth="0.6"
      />
      {Array.from({ length: holes }, (_, i) => {
        const a = (i / holes) * Math.PI * 2
        const rr = (root - 3 + hub) / 2
        return (
          <circle
            key={i}
            cx={Number((cx + Math.cos(a) * rr).toFixed(2))}
            cy={Number((cy + Math.sin(a) * rr).toFixed(2))}
            r={holeRadius}
            fill={holeFill}
            stroke={stroke}
            strokeWidth="0.6"
          />
        )
      })}
      <circle
        cx={cx}
        cy={cy}
        r={hub}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.9"
      />
      <circle
        cx={cx}
        cy={cy}
        r={hub * 0.42}
        fill="#e9e1cd"
        stroke={stroke}
        strokeWidth="0.7"
      />
    </g>
  )
}

/* ── Build ───────────────────────────────────────────────────────────────── */

const TAG_X = [166, 220, 278, 340, 402]

export function BuildArt() {
  const ribs = domeRibs(281.5, 265, 81.5, 3)
  return (
    <Layer label="build">
      <rect
        x="155"
        y="118"
        width="386"
        height="262"
        rx="20"
        fill="url(#dg-blue)"
        filter="url(#dg-s3)"
      />
      <rect
        x="155.5"
        y="118.5"
        width="385"
        height="261"
        rx="19.5"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.14"
      />

      {/* faint annotations, like pencil on a blueprint */}
      <g
        className={s.annot}
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        fill="#fff"
        fillOpacity="0.55"
        fontSize="5.4"
        letterSpacing="0.6"
      >
        <path
          d="M318 142H336"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
        <text x="337" y="144">
          +2000
        </text>
        <path
          d="M335 152V170"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
        <text x="340" y="160">
          TROPOSPHERE
        </text>
        <path
          d="M487 180V190"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
        <text x="463" y="196">
          MESOSPHERE
        </text>
        <path
          d="M485 207V216"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
        <text x="489" y="226">
          STRATEGY
        </text>
        <path
          d="M458 245H476"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="0.7"
          strokeDasharray="3 3"
        />
        <text x="478" y="247">
          9
        </text>
        <text x="171" y="258">
          SHALOR
        </text>
        <path
          d="M184 258H194"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
      </g>

      <Sparkle4 x={303} y={141} r={7} delay={0} />
      <Sparkle4 x={353} y={190} r={9} delay={0.9} />
      <Sparkle4 x={205} y={212} r={7} delay={1.6} />
      <Sparkle4 x={181} y={225} r={6} delay={0.4} />
      <Sparkle4 x={486} y={234} r={7} delay={1.2} />

      {/* the lattice under the scaffold, behind the pink wall */}
      <g stroke="#1f3280" strokeWidth="4" strokeLinecap="square">
        {[185, 225, 265, 305, 345].map((x) => (
          <path key={x} d={`M${x} 320V372`} />
        ))}
        {[185, 225, 265, 305].map((x) => (
          <path
            key={`x${x}`}
            d={`M${x} 322L${x + 40} 370M${x + 40} 322L${x} 370`}
            strokeWidth="3"
          />
        ))}
      </g>
      <g stroke="#4c6ad0" strokeWidth="1.5" opacity="0.9">
        {[185, 225, 265, 305, 345].map((x) => (
          <path key={x} d={`M${x} 320V372`} />
        ))}
        {[185, 225, 265, 305].map((x) => (
          <path
            key={`x${x}`}
            d={`M${x} 322L${x + 40} 370M${x + 40} 322L${x} 370`}
          />
        ))}
      </g>

      {/* dome */}
      <g filter="url(#dg-s2)">
        <path
          d="M200 265A81.5 81.5 0 0 1 363 265Z"
          fill="url(#dg-dome)"
          stroke="#223a96"
          strokeWidth="1.2"
        />
        <path
          d="M207 275H357V317H207Z"
          fill="#3552b4"
          stroke="#223a96"
          strokeWidth="1"
        />
      </g>
      <g fill="none" stroke="#1f3585" strokeOpacity="0.62" strokeWidth="0.9">
        {ribs.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path
        d="M200 265A81.5 81.5 0 0 1 363 265"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.16"
        strokeWidth="1.2"
      />
      <g className={s.sweep}>
        <path
          d="M262 186C250 210 248 240 252 265H268C266 240 268 210 275 187Z"
          fill="#fff"
          opacity="0.1"
        />
      </g>
      <rect
        x="198"
        y="265"
        width="167"
        height="10"
        rx="3"
        fill="#3b59bd"
        stroke="#223a96"
        strokeWidth="1"
      />
      <rect
        x="199"
        y="266"
        width="165"
        height="2"
        rx="1"
        fill="#fff"
        opacity="0.18"
      />
      <path
        d="M232 275V317M331 275V317"
        stroke="#223a96"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      <g
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        fill="#fff"
        fillOpacity="0.62"
        fontSize="5.2"
        className={s.annot}
      >
        <path
          d="M308 215V259"
          stroke="#fff"
          strokeOpacity="0.6"
          strokeWidth="0.8"
        />
        <path
          d="M308 215h4M308 237h4M308 259h4"
          stroke="#fff"
          strokeOpacity="0.6"
          strokeWidth="0.8"
        />
        <text x="314" y="217">
          05
        </text>
        <text x="314" y="239">
          2203
        </text>
        <text x="314" y="261">
          2004
        </text>
        <text x="296" y="312" fillOpacity="0.5">
          DOME-01
        </text>
      </g>

      {/* ladder */}
      <g stroke={CARD} strokeWidth="0.9" fill="#c9a874">
        <path
          d="M180 272L175 314M191 270L186 313"
          fill="none"
          strokeWidth="2.2"
          stroke="#b08a56"
        />
        {[280, 288, 296, 304].map((y, i) => (
          <path
            key={y}
            d={`M${179 - i * 0.9} ${y}H${190 - i * 0.9}`}
            fill="none"
            strokeWidth="1.5"
            stroke="#8a6a3c"
          />
        ))}
      </g>

      {/* tower */}
      <g filter="url(#dg-s2)">
        <rect x="395" y="252" width="6" height="74" fill="#2f4aa8" />
        <rect x="439" y="252" width="6" height="74" fill="#2f4aa8" />
        <rect
          x="380"
          y="218"
          width="82"
          height="5"
          rx="1"
          fill="#a9bde6"
          stroke="#6277b8"
          strokeWidth="0.8"
        />
        <rect
          x="386"
          y="223"
          width="70"
          height="30"
          fill="#3a58bd"
          stroke="#223a96"
          strokeWidth="1"
        />
      </g>
      <g stroke="#223a96" strokeWidth="3.4">
        <path d="M401 262L439 300M439 262L401 300M401 300L439 326M439 300L401 326" />
        <path d="M401 258H439M401 296H439" strokeWidth="2.6" />
      </g>
      <g stroke="#4c6ad0" strokeWidth="1.4">
        <path d="M401 262L439 300M439 262L401 300M401 300L439 326M439 300L401 326" />
        <path d="M401 258H439M401 296H439" />
      </g>
      <g fill="#1a2760" stroke="#9fb4e6" strokeWidth="0.7">
        <rect x="397" y="228" width="16" height="10" />
        <rect x="416" y="228" width="12" height="10" />
        <rect x="431" y="228" width="16" height="10" />
        <rect x="385" y="228" width="6" height="11" />
        <rect x="451" y="228" width="6" height="11" />
      </g>
      <g className={s.windowGlow} fill="#7fc4ff" opacity="0.5">
        <rect x="398" y="234" width="14" height="3" />
        <rect x="417" y="234" width="10" height="3" />
        <rect x="432" y="234" width="14" height="3" />
      </g>

      {/* bridge */}
      <g stroke={CARD} strokeWidth="0.8">
        <rect x="354" y="238" width="32" height="14" fill="#c8a46d" />
        <path
          d="M354 238L386 252M386 238L354 252M370 238V252"
          fill="none"
          strokeWidth="0.7"
        />
      </g>

      {/* scaffold beam, with a tick pattern like a ruler */}
      <rect
        x="160"
        y="313"
        width="238"
        height="8"
        rx="1"
        fill="#c5a26c"
        stroke={CARD}
        strokeWidth="0.9"
        filter="url(#dg-s1)"
      />
      <path
        d="M162 317H396"
        stroke="#5a4326"
        strokeWidth="2.2"
        strokeDasharray="1 2.6"
        opacity="0.7"
      />

      {/* react atom on springs */}
      <Coil
        x={405}
        y1={203}
        y2={219}
        className={s.squash}
        style={vars({ '--delay': '0s' })}
      />
      <Coil
        x={433}
        y1={203}
        y2={219}
        className={s.squash}
        style={vars({ '--delay': '0.35s' })}
      />
      <g className={s.atom} filter="url(#dg-s2)">
        {[0, 60, 120].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 418 166)`}>
            <ellipse
              cx="418"
              cy="168"
              rx="40"
              ry="15"
              fill="none"
              stroke="#5f93b8"
              strokeWidth="5"
              opacity="0.55"
            />
            <ellipse
              cx="418"
              cy="166"
              rx="40"
              ry="15"
              fill="none"
              stroke="#a6dcf0"
              strokeWidth="3.6"
            />
            <ellipse
              cx="418"
              cy="166"
              rx="40"
              ry="15"
              fill="none"
              stroke="#d6f1fb"
              strokeWidth="0.9"
              opacity="0.8"
            />
          </g>
        ))}
        <circle
          cx="418"
          cy="166"
          r="8"
          fill="#9fd8ec"
          stroke="#6fb0d2"
          strokeWidth="1.2"
          className={s.pulse}
        />
      </g>

      {/* the pie-chart gauge on a cardboard arm */}
      <g filter="url(#dg-s2)">
        <path
          d="M485 326L488 303Q490 296 498 296L502 296L500 326Z"
          fill="#b98f5c"
          stroke={CARD}
          strokeWidth="0.9"
        />
        <g className={s.slowSpin} style={vars({ '--dur': '30s' })}>
          <circle
            cx="504"
            cy="292"
            r="15"
            fill="#f0eadb"
            stroke={CARD}
            strokeWidth="1"
          />
          <path
            d="M504 292L504 277A15 15 0 0 1 519 292Z"
            fill="#f2c23a"
            stroke={CARD}
            strokeWidth="0.8"
          />
          <path d="M504 292L489 292" stroke={CARD} strokeWidth="0.8" />
        </g>
        <circle
          cx="504"
          cy="292"
          r="2.2"
          fill="#c9bfa4"
          stroke={CARD}
          strokeWidth="0.6"
        />
      </g>

      {/* clouds */}
      <Cloud
        x={149}
        y={166}
        w={74}
        h={34}
        fill="#5f9bd1"
        shade="#2c5d9a"
        stroke="#2f5f9c"
        className={s.drift}
        style={vars({ '--dur': '11s', '--dx': '5px' })}
      />
      <Cloud
        x={469}
        y={146}
        w={58}
        h={27}
        fill="#6aa7dd"
        shade="#2c5d9a"
        stroke="#2f5f9c"
        className={s.drift}
        style={vars({ '--dur': '9s', '--dx': '-4px', '--delay': '-2s' })}
      />
      <Cloud
        x={497}
        y={170}
        w={54}
        h={36}
        fill="#5c9ad0"
        shade="#2c5d9a"
        stroke="#2f5f9c"
        className={s.drift}
        style={vars({ '--dur': '13s', '--dx': '4px', '--delay': '-5s' })}
      />

      {/* coils under each tag, in time with it */}
      {TAG_X.map((x, i) => (
        <Coil
          key={x}
          x={x}
          y1={300}
          y2={314}
          className={s.squashTag}
          style={vars({ '--delay': `${i * 0.4}s` })}
        />
      ))}
    </Layer>
  )
}

/* ── Motion ──────────────────────────────────────────────────────────────── */

export function MotionArt() {
  const rays = starPath(660, 237, 49, 37, 12)
  const rays2 = starPath(660, 237, 41, 33, 12, 15)
  return (
    <Layer label="motion">
      <rect
        x="551"
        y="117"
        width="321"
        height="262"
        rx="18"
        fill="url(#dg-yellow)"
        filter="url(#dg-s3)"
      />
      <rect
        x="551.5"
        y="117.5"
        width="320"
        height="261"
        rx="17.5"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.28"
      />

      {/* belt */}
      <g fill="none" stroke="#2c2630" strokeLinejoin="round">
        <path
          d="M697 198L727 187A14 14 0 0 1 747 201L751 262A12 12 0 0 1 739 275L705 262A55 55 0 0 0 697 198Z"
          strokeWidth="1.7"
        />
        <path
          d="M697 198L727 187A14 14 0 0 1 747 201L751 262A12 12 0 0 1 739 275L705 262A55 55 0 0 0 697 198Z"
          stroke="#f1c64a"
          strokeWidth="1"
          strokeDasharray="1.2 7"
          className={s.belt}
        />
        <path d="M703 266L722 300M692 277L712 304" strokeWidth="0.9" />
      </g>
      {/* pulleys */}
      <g filter="url(#dg-s2)">
        <circle
          cx="733"
          cy="200"
          r="14"
          fill="#cdb287"
          stroke={CARD}
          strokeWidth="1"
        />
        <g className={s.spinCW} style={vars({ '--dur': '9s' })}>
          <circle
            cx="733"
            cy="200"
            r="8"
            fill="#b99468"
            stroke={CARD}
            strokeWidth="0.8"
          />
          <path d="M733 192V208M725 200H741" stroke={CARD} strokeWidth="0.8" />
        </g>
        <circle
          cx="733"
          cy="200"
          r="2.6"
          fill="#e9e0cc"
          stroke={CARD}
          strokeWidth="0.6"
        />
        <circle
          cx="739"
          cy="263"
          r="12"
          fill="#cdb287"
          stroke={CARD}
          strokeWidth="1"
        />
        <g className={s.spinCW} style={vars({ '--dur': '9s' })}>
          <circle
            cx="739"
            cy="263"
            r="7"
            fill="#b99468"
            stroke={CARD}
            strokeWidth="0.8"
          />
          <path d="M739 256V270M732 263H746" stroke={CARD} strokeWidth="0.8" />
        </g>
        <circle
          cx="739"
          cy="263"
          r="2.4"
          fill="#e9e0cc"
          stroke={CARD}
          strokeWidth="0.6"
        />
      </g>

      {/* post, discs and crank under the sun */}
      <g filter="url(#dg-s2)">
        <rect
          x="654"
          y="288"
          width="13"
          height="56"
          fill="#c7a574"
          stroke={CARD}
          strokeWidth="0.9"
        />
        <path
          d="M658 290V342M663 290V342"
          stroke={CARD}
          strokeWidth="0.5"
          opacity="0.6"
        />
        {[338, 343, 348].map((y, i) => (
          <ellipse
            key={y}
            cx="661"
            cy={y}
            rx="26"
            ry="5"
            fill={['#bfa078', '#dcc79f', '#b99468'][i]}
            stroke={CARD}
            strokeWidth="0.8"
          />
        ))}
        <ellipse
          cx="661"
          cy="376"
          rx="39"
          ry="6"
          fill="#c9a572"
          stroke={CARD}
          strokeWidth="0.9"
        />
        <ellipse cx="661" cy="376" rx="39" ry="6" fill="url(#dg-corrugate)" />
        <path
          d="M676 346L702 352"
          stroke={CARD}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M676 346L702 352"
          stroke="#c7a574"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <g className={s.crank}>
          <rect
            x="699"
            y="350"
            width="21"
            height="7.5"
            rx="3.2"
            fill="#ee7a4c"
            stroke="#a04a24"
            strokeWidth="0.9"
          />
        </g>
      </g>
      <g filter="url(#dg-s1)" stroke={CARD} strokeWidth="0.7">
        <rect x="618" y="311" width="104" height="5" rx="1" fill="#c9a572" />
        <rect x="640" y="300" width="42" height="4" rx="1" fill="#c9a572" />
        <path
          d="M620 313.5H720"
          stroke="#5a4326"
          strokeWidth="2"
          strokeDasharray="1 2.6"
          opacity="0.6"
        />
      </g>

      {/* gears */}
      <Gear
        cx={562}
        cy={259}
        outer={41}
        root={34}
        teeth={14}
        fill="#f2c33b"
        stroke="#80601a"
        hub={11}
        holes={6}
        holeRadius={5.6}
        holeFill="#7a5a33"
        className={s.spinCW}
        style={vars({ '--dur': '26s' })}
      />
      <circle
        cx="562"
        cy="259"
        r="26"
        fill="#b99468"
        stroke={CARD}
        strokeWidth="0.8"
        opacity="0.55"
        className={s.spinCW}
        style={vars({ '--dur': '26s' })}
      />
      <Gear
        cx={612}
        cy={302}
        outer={31}
        root={26}
        teeth={14}
        fill="#efe6d0"
        stroke="#8a7a56"
        hub={6}
        holes={6}
        holeRadius={5}
        holeFill="#c99d34"
        className={s.spinCCW}
        style={vars({ '--dur': '19s' })}
      />
      <Gear
        cx={729}
        cy={314}
        outer={23}
        root={19}
        teeth={12}
        fill="#efe6d0"
        stroke="#8a7a56"
        hub={4.4}
        holes={5}
        holeRadius={3.6}
        holeFill="#c99d34"
        className={s.spinCW}
        style={vars({ '--dur': '14s' })}
      />

      {/* the sun automaton */}
      <g filter="url(#dg-s3)">
        <circle
          cx="660"
          cy="237"
          r="55"
          fill="#f4e2a0"
          stroke="#bd922f"
          strokeWidth="1"
        />
        <circle
          cx="660"
          cy="237"
          r="50.5"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.45"
          strokeWidth="0.8"
        />
      </g>
      <g className={s.spinCW} style={vars({ '--dur': '60s' })}>
        <path
          d={rays}
          fill="#f29a2c"
          stroke="#b9701a"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <path
          d={rays2}
          fill="#f8b53a"
          stroke="#c27b1c"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      </g>
      <circle
        cx="660"
        cy="237"
        r="33"
        fill="#f6b73b"
        stroke="#c97f1d"
        strokeWidth="1"
      />
      <circle
        cx="660"
        cy="237"
        r="27.5"
        fill="#fadb4d"
        stroke="#d9a21f"
        strokeWidth="0.9"
        className={s.sunFace}
      />
      <g className={s.blink}>
        <path
          d="M650 236Q654 231 658 236M663 236Q667 231 671 236"
          fill="none"
          stroke="#2a2118"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
      <circle cx="646.5" cy="245" r="4.2" fill="#ef8f78" opacity="0.85" />
      <circle cx="673.5" cy="245" r="4.2" fill="#ef8f78" opacity="0.85" />
      <path d="M652 245.5Q660 256 668 245.5Z" fill="#2a2118" />

      {/* wind banners */}
      <g
        className={s.sway}
        style={vars({ '--dur': '7s' })}
        filter="url(#dg-s1)"
      >
        <path
          d="M764 150Q790 144 818 150T875 148V172Q850 178 822 172T766 177Z"
          fill="#d4e1ea"
          stroke="#8aa0b3"
          strokeWidth="0.8"
        />
        <Cloud
          x={768}
          y={146}
          w={58}
          h={30}
          fill="#f5f4f0"
          shade="#9aa3ad"
          stroke="#9aa3ad"
        />
      </g>
      <g
        className={s.sway}
        style={vars({ '--dur': '8.5s', '--delay': '-3s' })}
        filter="url(#dg-s1)"
      >
        <path
          d="M764 197Q790 191 818 197T875 195V222Q850 228 822 222T766 226Z"
          fill="#d4e1ea"
          stroke="#8aa0b3"
          strokeWidth="0.8"
        />
        <Cloud
          x={768}
          y={193}
          w={42}
          h={30}
          fill="#f5f4f0"
          shade="#9aa3ad"
          stroke="#9aa3ad"
        />
        <g
          fill="none"
          stroke="#7e8fa0"
          strokeWidth="1.1"
          strokeLinecap="round"
          className={s.flow}
        >
          <path d="M824 203C836 199 844 205 852 201C858 198 864 200 866 204" />
          <path d="M822 209C838 206 848 212 858 208C862 206 868 208 868 212" />
          <path d="M826 214C834 212 840 216 848 214" />
        </g>
      </g>

      {/* weather card (the words and sliders are HTML on top) and its lever */}
      <rect
        x="764"
        y="237"
        width="100"
        height="70"
        rx="6"
        fill="#f7de8c"
        stroke="#7a5f1c"
        strokeWidth="1"
        filter="url(#dg-s2)"
      />
      <path
        d="M817 308C819 330 812 350 816 376"
        fill="none"
        stroke="#2f3a55"
        strokeWidth="1.6"
      />
      <g className={s.lever}>
        <path
          d="M856 262L833 328"
          stroke={CARD}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M856 262L833 328"
          stroke="#cfb58a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle
          cx="833"
          cy="328"
          r="5"
          fill="#e0c9a0"
          stroke={CARD}
          strokeWidth="1"
        />
      </g>

      {/* the stand the play button sits on */}
      <g filter="url(#dg-s1)" stroke={CARD} strokeWidth="0.8">
        <path d="M726 382L737 366H760V382Z" fill="#b99468" />
        <rect x="737" y="360" width="90" height="6" rx="2" fill="#c9a572" />
      </g>
    </Layer>
  )
}

/* ── The rest ────────────────────────────────────────────────────────────── */

export function RestArt({ folderCount }: { folderCount: number }) {
  const folders = [
    { x: 635, w: 53, y: 452, fill: '#3f5fc8', dark: '#27408f' },
    { x: 698, w: 55, y: 452, fill: '#f2c23a', dark: '#b8881a' },
    { x: 755, w: 53, y: 448, fill: '#ee8f8a', dark: '#b35a56' },
    { x: 813, w: 59, y: 452, fill: '#efe8d8', dark: '#9a8f78' },
  ].slice(0, folderCount)
  return (
    <Layer label="rest">
      <rect
        x="578"
        y="386"
        width="320"
        height="139"
        fill="url(#dg-tan)"
        filter="url(#dg-s3)"
      />
      <rect x="578" y="378" width="327" height="10" fill="#b48f5f" />
      <rect x="578" y="378" width="327" height="10" fill="url(#dg-corrugate)" />
      <path
        d="M578 386.5H905"
        stroke="#5f4528"
        strokeWidth="1.3"
        strokeDasharray="1.4 1.8"
        opacity="0.85"
      />
      <rect
        x="578"
        y="378"
        width="327"
        height="1.2"
        fill="#e8d2ab"
        opacity="0.8"
      />

      {/* folders standing in the drawer, tabs showing */}
      {folders.map((f, i) => (
        <g
          key={f.x}
          className={s.folder}
          style={vars({ '--delay': `${i * 0.5}s` })}
          filter="url(#dg-s1)"
        >
          <path
            d={`M${f.x} ${f.y + 12}V${f.y + 3}Q${f.x} ${f.y} ${f.x + 3} ${f.y}H${f.x + 22}L${f.x + 26} ${f.y + 4}H${f.x + f.w - 3}Q${f.x + f.w} ${f.y + 4} ${f.x + f.w} ${f.y + 7}V${f.y + 12}Z`}
            fill={f.fill}
            stroke={f.dark}
            strokeWidth="0.9"
          />
          <path
            d={`M${f.x + 1} ${f.y + 5}H${f.x + f.w - 1}`}
            stroke="#fff"
            strokeOpacity="0.3"
            strokeWidth="0.7"
          />
        </g>
      ))}

      {/* the drawer itself */}
      <g filter="url(#dg-s2)">
        <path d="M610 454H893V461H618Z" fill="#6a4d30" />
        <path
          d="M610 454L618 461V519L610 512Z"
          fill="#9f7d55"
          stroke="#6a4d30"
          strokeWidth="0.7"
        />
        <path
          d="M618 461H893V519H618Z"
          fill="#b9976d"
          stroke="#6a4d30"
          strokeWidth="1"
        />
        <path d="M618 461H893V464H618Z" fill="#000" opacity="0.14" />
        <path d="M618 518H893" stroke="#8a6a3c" strokeWidth="1.2" />
      </g>
    </Layer>
  )
}

/* ── Systems ─────────────────────────────────────────────────────────────── */

function Needle({
  cx,
  cy,
  angle,
  delay,
}: {
  cx: number
  cy: number
  angle: number
  delay: number
}) {
  return (
    <g
      className={s.needle}
      style={vars({ '--delay': `${delay}s`, '--rot': `${angle}deg` })}
    >
      <path
        d={`M${cx} ${cy}L${cx} ${cy - 12}`}
        stroke="#2a3a8a"
        strokeWidth="1.6"
        strokeLinecap="round"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    </g>
  )
}

function Shield({ x, y, left }: { x: number; y: number; left: boolean }) {
  return (
    <g filter="url(#dg-s1)" transform={`translate(${x} ${y})`}>
      <path
        d="M0-24L18-18V3Q18 18 0 26Q-18 18-18 3V-18Z"
        fill="#d6b88a"
        stroke="#8a6a3e"
        strokeWidth="1.2"
      />
      <path
        d="M0-20L14-15V3Q14 15 0 22Q-14 15-14 3V-15Z"
        fill="#ecebe0"
        stroke="#8a6a3e"
        strokeWidth="0.7"
      />
      <path
        d="M-9 -2A10 10 0 0 1 -3 -10"
        fill="none"
        stroke="#3f5fd0"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M-3 -10A10 10 0 0 1 5 -9"
        fill="none"
        stroke="#f2c23a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M5 -9A10 10 0 0 1 9 -2"
        fill="none"
        stroke="#ee6f5a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d={left ? 'M-5 14H5M-4 17H4' : 'M0 12c-3 3-3 6 0 7c3-1 3-4 0-7Z'}
        fill={left ? 'none' : '#3f5fd0'}
        stroke="#3f5fd0"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <g transform={`translate(0 2)`}>
        <Needle cx={0} cy={0} angle={left ? 35 : -35} delay={left ? 0 : 0.8} />
      </g>
      <circle cx="0" cy="2" r="2" fill="#2a3a8a" />
    </g>
  )
}

function Plunger({
  x,
  top,
  side,
  delay,
}: {
  x: number
  top: string
  side: string
  delay: number
}) {
  return (
    <g
      className={s.plunger}
      style={vars({ '--delay': `${delay}s` })}
      filter="url(#dg-s1)"
    >
      <path
        d={`M${x - 19} 492L${x - 11} 478H${x + 11}L${x + 19} 492Z`}
        fill="#bf9a68"
        stroke={CARD}
        strokeWidth="0.9"
      />
      <path d={`M${x - 19} 492H${x + 19}`} stroke={CARD} strokeWidth="1.6" />
      <g className={s.plungerTop}>
        <Coil x={x} y1={456} y2={479} color="#6a6058" />
        <rect
          x={x - 17}
          y="443"
          width="34"
          height="13"
          rx="3"
          fill={side}
          stroke={CARD}
          strokeWidth="0.8"
        />
        <ellipse
          cx={x}
          cy="443"
          rx="17"
          ry="6.4"
          fill={top}
          stroke={CARD}
          strokeWidth="0.8"
        />
      </g>
    </g>
  )
}

export function SystemsArt() {
  return (
    <Layer label="systems">
      {/* the low wall on the left, crenellated like a gatehouse */}
      <g filter="url(#dg-s3)">
        <path
          d="M157 460V365H175V380H195V365H215V380H233V365H253V380H271V365H291V380H308V365H328V380H347V460Z"
          fill="url(#dg-pink)"
          stroke="#cf86a7"
          strokeWidth="0.9"
        />
        <rect
          x="147"
          y="460"
          width="200"
          height="72"
          fill="#f3b8d0"
          stroke="#cf86a7"
          strokeWidth="0.9"
        />
      </g>
      <rect x="147" y="460" width="200" height="3" fill="#fff" opacity="0.32" />
      <rect
        x="147"
        y="522"
        width="200"
        height="10"
        fill="#d98aad"
        opacity="0.45"
      />
      <path
        d="M157 365H175M195 365H215M233 365H253M271 365H291M308 365H328"
        stroke="#fff"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />

      {/* gauges, toggles and levers on the wall */}
      <Shield x={187} y={411} left />
      <Shield x={238} y={411} left={false} />

      <g filter="url(#dg-s1)">
        <rect
          x="272"
          y="391"
          width="24"
          height="44"
          rx="2"
          fill="#cba577"
          stroke="#7c5c34"
          strokeWidth="0.9"
        />
        <path
          d="M278 399L281 404L279 409"
          fill="none"
          stroke="#7c5c34"
          strokeWidth="0.7"
        />
        <rect x="277" y="421" width="14" height="4" fill="#7c5c34" />
        <rect
          x="280"
          y="418"
          width="8"
          height="10"
          rx="1"
          fill="#e6ddc8"
          stroke="#7c5c34"
          strokeWidth="0.7"
          className={s.slideKnob}
        />
      </g>
      <g filter="url(#dg-s1)">
        {[393, 408, 423].map((y, i) => (
          <g key={y}>
            <rect
              x="307"
              y={y}
              width="26"
              height="10"
              rx="5"
              fill={i === 2 ? '#f0735a' : '#e6ddc8'}
              stroke="#7c5c34"
              strokeWidth="0.9"
            />
            <circle
              cx={i === 2 ? 328 : 312}
              cy={y + 5}
              r="4"
              fill="#f4eee0"
              stroke="#7c5c34"
              strokeWidth="0.8"
              className={s.toggleKnob}
              style={vars({
                '--delay': `${i * 1.4}s`,
                '--dx': i === 2 ? '-15px' : '15px',
              })}
            />
          </g>
        ))}
      </g>

      <Plunger x={182} top="#f6d24d" side="#f3c63c" delay={0} />
      <Plunger x={236} top="#f48470" side="#ee6f5a" delay={0.9} />

      <g filter="url(#dg-s1)">
        <rect
          x="278"
          y="466"
          width="14"
          height="22"
          rx="2"
          fill="#a88454"
          stroke={CARD}
          strokeWidth="0.8"
        />
        <rect x="283" y="470" width="4" height="16" fill="#3a2a18" />
        <g className={s.leverA}>
          <circle
            cx="285"
            cy="458"
            r="5"
            fill="#cfa86f"
            stroke={CARD}
            strokeWidth="0.9"
          />
          <rect
            x="283.5"
            y="460"
            width="3"
            height="14"
            fill="#cfa86f"
            stroke={CARD}
            strokeWidth="0.7"
          />
        </g>
        <rect
          x="308"
          y="478"
          width="18"
          height="12"
          rx="2"
          fill="#a88454"
          stroke={CARD}
          strokeWidth="0.8"
        />
        <g className={s.leverB}>
          <rect
            x="314"
            y="455"
            width="4"
            height="26"
            fill="#cfa86f"
            stroke={CARD}
            strokeWidth="0.7"
          />
          <rect
            x="305"
            y="445"
            width="23"
            height="8"
            rx="2"
            fill="#c9a574"
            stroke={CARD}
            strokeWidth="0.8"
          />
        </g>
      </g>

      {/* the cords */}
      <g fill="none" strokeLinecap="round">
        <path
          d="M258 477C268 482 270 506 290 512C310 516 330 513 345 513"
          stroke="#8a5f38"
          strokeWidth="3.2"
          opacity="0.5"
        />
        <path
          d="M258 477C268 482 270 506 290 512C310 516 330 513 345 513"
          stroke="#d1a06c"
          strokeWidth="2"
        />
        <path
          d="M299 474C312 476 332 472 338 462C342 452 340 430 345 418"
          stroke="#8a5f38"
          strokeWidth="3.2"
          opacity="0.5"
        />
        <path
          d="M299 474C312 476 332 472 338 462C342 452 340 430 345 418"
          stroke="#d1a06c"
          strokeWidth="2"
        />
      </g>

      {/* the main panel, rounded at the top right */}
      <path
        d="M345 326H556A22 22 0 0 1 578 348V532H345Z"
        fill="url(#dg-pink)"
        stroke="#cf86a7"
        strokeWidth="0.9"
        filter="url(#dg-s3)"
      />
      <path
        d="M346 327H556A21 21 0 0 1 577 348"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {/* icon tiles and their cords */}
      <g filter="url(#dg-s1)">
        <rect
          x="489"
          y="388"
          width="14"
          height="14"
          rx="1.5"
          fill="#cba577"
          stroke="#7c5c34"
          strokeWidth="0.8"
        />
        <rect
          x="507"
          y="388"
          width="14"
          height="14"
          rx="1.5"
          fill="#cba577"
          stroke="#7c5c34"
          strokeWidth="0.8"
        />
        <path
          d="M491 396l3-3 3 3 3-4M509 395l3 2 3-4 3 3"
          fill="none"
          stroke="#5a4326"
          strokeWidth="0.8"
        />
      </g>
      <g fill="none" strokeLinecap="round">
        <path
          d="M494 403V457"
          stroke="#8a6a1c"
          strokeWidth="2.8"
          opacity="0.45"
        />
        <path d="M494 403V457" stroke="#e3b64a" strokeWidth="1.8" />
        <path
          d="M514 403V470C514 490 500 497 483 500"
          stroke="#1f2f80"
          strokeWidth="2.8"
          opacity="0.45"
        />
        <path
          d="M514 403V470C514 490 500 497 483 500"
          stroke="#3f5fd0"
          strokeWidth="1.8"
        />
        <path
          d="M494 403V457M514 403V470"
          stroke="#fff"
          strokeWidth="1"
          strokeDasharray="1 9"
          opacity="0.8"
          className={s.signal}
        />
      </g>
      <rect
        x="493"
        y="455"
        width="22"
        height="12"
        rx="2"
        fill="#cba577"
        stroke="#7c5c34"
        strokeWidth="0.8"
        filter="url(#dg-s1)"
      />

      {/* the flag pole */}
      <path
        d="M531 410V493"
        stroke="#e8e0cf"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M531 410V493" stroke="#9c9380" strokeWidth="0.6" />
      <circle
        cx="531"
        cy="494"
        r="3.6"
        fill="none"
        stroke="#9c9380"
        strokeWidth="1.2"
      />

      {/* the gatehouse in front */}
      <g filter="url(#dg-s3)">
        <path
          d="M345 443H482V532H345Z"
          fill="#f2b3cd"
          stroke="#cf86a7"
          strokeWidth="0.9"
        />
        <path
          d="M345 415H482V443H345Z"
          fill="#f5c0d6"
          stroke="#cf86a7"
          strokeWidth="0.9"
        />
        <path d="M482 417H486V532H482Z" fill="#df8fb0" />
      </g>
      <path
        d="M346 416H481"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <path
        d="M388 531V505A25 25 0 0 1 438 505V531Z"
        fill="#b78f5e"
        stroke={CARD}
        strokeWidth="1"
      />
      <path
        d="M392 531V505A21 21 0 0 1 434 505V531Z"
        fill="#8a6a3c"
        opacity="0.5"
      />
      <g className={s.door}>
        <path
          d="M388 531V505A25 25 0 0 1 413 480V531Z"
          fill="#b78f5e"
          stroke={CARD}
          strokeWidth="1"
          className={s.doorL}
        />
        <path
          d="M438 531V505A25 25 0 0 0 413 480V531Z"
          fill="#b78f5e"
          stroke={CARD}
          strokeWidth="1"
          className={s.doorR}
        />
      </g>
      <g fill="none" stroke="#cf7c9f" strokeWidth="0.9">
        <rect x="447" y="480" width="13" height="6.4" rx="1.4" />
        <rect x="454" y="486.4" width="13" height="6.4" rx="1.4" />
        <rect x="355" y="507" width="13" height="6.4" rx="1.4" />
        <rect x="362" y="513.4" width="13" height="6.4" rx="1.4" />
      </g>
    </Layer>
  )
}
