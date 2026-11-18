'use client'

import { ArrowRight } from 'lucide-react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  SCRIPT,
  SX,
  TRACK,
  place,
  round,
  type ScriptWord,
} from '@/components/ui/sticker-slap-footer'
import { cn } from '@/lib/utils'

import { Bolt, Burst, Daisy, Smiley } from '../doodles'
import { scrollToSection } from '../studio-data'
import styles from './hero.module.css'

export type HeroSurface = 'cobalt' | 'sky' | 'paper'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

const SCRIPT_STROKE = 3.3
const SCRIPT_SLANT = 0.1584

/**
 * Capital 'A' majuscule for single-stroke script.
 * Sign-painter anatomy with rising left arch, rounded apex (y = -19),
 * descending right stem chaining cleanly into 'd' at (advance, -1), and
 * crisp calligraphic waist crossbar drawn after the main stroke.
 */
const SCRIPT_A_CAPITAL: [number, string, string?] = [
  15.2,
  'M1.5 -1C3 -3.8 5.6 -11.5 8.4 -19C9 -19.6 9.4 -19.6 9.8 -19C11.6 -12 13 -5.5 13.8 -1C14.1 -0.2 14.6 -0.6 15.2 -1',
  'M4.6 -8.2C7.2 -8.5 10.2 -8.5 12.8 -8.2',
]

/**
 * Final 'a' with a restrained calligraphic tail curving upward at the end.
 */
const SCRIPT_A_TAIL: [number, string] = [
  13.2,
  'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 -3C7.8 -0.6 8.6 0.2 10.2 0.2C11.8 0.2 13.5 -0.2 14.8 -1C15.8 -1.5 16.8 -2 17.5 -2.6',
]

/**
 * Lays out `Aditya` with Capital 'A' and tailed final 'a' in one continuous path.
 */
function layoutAdityaWord(): ScriptWord {
  const letters: [number, string, string?, number?][] = [
    SCRIPT_A_CAPITAL,
    SCRIPT.d,
    SCRIPT.i,
    SCRIPT.t,
    SCRIPT.y,
    SCRIPT_A_TAIL,
  ]
  let x = 0
  let main = ''
  const extra: string[] = []
  let lift = true
  let top = 0
  let bottom = 0

  for (const g of letters) {
    const [adv, dMain, dExtra, liftsAfter] = g
    const pMain = place(dMain, x)
    main += lift ? pMain : 'L' + pMain.slice(1)

    if (dExtra) extra.push(place(dExtra, x))

    const allNums =
      (dMain + (dExtra || '')).match(/-?\d*\.?\d+/g)?.map(Number) ?? []
    const ys = allNums.filter((_, i) => i % 2 === 1)
    top = Math.min(top, ...ys)
    bottom = Math.max(bottom, ...ys)

    lift = Boolean(liftsAfter)
    x += adv * SX + TRACK
  }
  const width = round(x - TRACK)
  return { main, extra, width, top, bottom, boxes: [] }
}

const MADLIB_SLOTS = {
  craft: [
    { icon: '✦', word: 'SYSTEMS' },
    { icon: '☀', word: 'CRAFT' },
    { icon: '◉', word: 'WARMTH' },
    { icon: '◈', word: 'CLARITY' },
  ],
  taste: [
    { icon: '❖', word: 'MOTION' },
    { icon: '✏', word: 'TASTE' },
    { icon: '◈', word: 'DETAIL' },
    { icon: '⚡', word: 'FEEL' },
  ],
  products: [
    { icon: '▤', word: 'DIGITAL WORK' },
    { icon: '⚛', word: 'REACT APPS' },
    { icon: '>_', word: 'WEB SYSTEMS' },
    { icon: '⚡', word: 'PRODUCT UI' },
  ],
} as const

function FivePointStar({
  className,
  fill = '#FFD12E',
  stroke = '#111827',
  strokeWidth = 3,
}: {
  className?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      focusable="false"
    >
      <polygon
        points="32,4 39.8,22.4 59.6,24 44.4,37 49,56.5 32,46 15,56.5 19.6,37 4.4,24 24.2,22.4"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FourPointSparkle({
  className,
  fill = '#FAF9F6',
  innerFill = '#A7C7E7',
}: {
  className?: string
  fill?: string
  innerFill?: string
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d="M24 3C26.5 16 32 21.5 45 24C32 26.5 26.5 32 24 45C21.5 32 16 26.5 3 24C16 21.5 21.5 16 24 3Z"
        fill={fill}
        stroke="#111827"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M24 12C25.2 19 29 22.8 36 24C29 25.2 25.2 29 24 36C22.8 29 19 25.2 12 24C19 22.8 22.8 19 24 12Z"
        fill={innerFill}
      />
    </svg>
  )
}

/* ── Paper-cut cloud geometry ───────────────────────────────────────────────
   Every cloud in the diorama is built from overlapping puffs that union into
   one silhouette, so a single drop shadow traces the whole cut edge. Banks
   share a puff radius, which is what keeps a stack of five layers reading as
   one hand-cut scene instead of five unrelated blobs. */

type CloudBankSpec = {
  x: number
  w: number
  /** y of the crest */
  top: number
  /** puff radius — the scallop size. Shared radii keep the stack in rhythm. */
  r: number
  /** how far down the solid fill reaches */
  base: number
  seed: number
  /** >1 packs more, shallower puffs (cleaner field for type) */
  density?: number
  /**
   * How strongly the lobes vary in size, 0–1. At 0 it is the old even scallop
   * run; near 1 it billows — big lobes with small puffs tucked between them and
   * deep notches where they meet.
   */
  billow?: number
}

/** The one curve every layer in this hero arrives on. */
const PAPER_EASE = [0.22, 1, 0.36, 1] as const

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

/**
 * A paper-cut cloud bank.
 *
 * With `billow` at 0 this is a tidy run of near-identical puffs — a scalloped
 * edge, good for narrow bands that sit behind type. As `billow` rises two
 * things happen, and both are needed to make a cloud rather than a bumpy line:
 *
 *  1. The puffs spread out. Two circles of radius r whose centres are 1.5r
 *     apart only notch ~0.34r deep, so the edge stays soft. At 1.85r apart the
 *     notch is ~0.58r — a real valley between two lobes.
 *  2. The lobes stop being identical. Radii and crest heights wander, so the
 *     silhouette swells and settles instead of repeating.
 *
 * The outline is one path: an arc over each lobe, handed off at the exact point
 * where it meets its neighbour, then closed straight down to the base. Drawing
 * it this way — rather than unioning circles over a rectangle — is what keeps
 * the valleys as clean cusps with no slivers of the layer behind leaking
 * through underneath them.
 */
function CloudBank({
  x,
  w,
  top,
  r,
  base,
  seed,
  density = 1,
  billow = 0,
  fill,
  filter,
  className,
}: CloudBankSpec & { fill: string; filter?: string; className?: string }) {
  const rand = seededRandom(seed)

  // Deeper notches come from spacing the lobes further apart — but only up to
  // just under 2r, where neighbouring circles still touch. Past that they come
  // apart and the outline gains a vertical gap instead of a valley.
  const maxStep = r * 1.92
  const spacing = Math.min(maxStep, (r * (1.5 + billow * 0.42)) / density)
  // ceil, not round: rounding down can overshoot maxStep and open a gap.
  const count = Math.max(2, Math.ceil(w / spacing))
  const step = w / count

  const lobes: { cx: number; cy: number; r: number }[] = []
  for (let i = 0; i <= count; i += 1) {
    const size = 1 + (rand() - 0.5) * 0.3 * billow
    const radius = r * size
    const lift = (rand() - 0.5) * r * 0.16 * billow
    lobes.push({ cx: x + step * i, cy: top + radius + lift, r: radius })
  }

  /**
   * Where the outline hands off from lobe `a` to lobe `b`: the lower of their
   * two crossings, which is the bottom of the valley between them. Falls back
   * to a's right extreme when the two do not meet.
   */
  const handoff = (
    a: { cx: number; cy: number; r: number },
    b: { cx: number; cy: number; r: number },
  ) => {
    const d = Math.hypot(b.cx - a.cx, b.cy - a.cy)
    if (d === 0 || d >= a.r + b.r) return { x: a.cx + a.r, y: a.cy }
    const along = (a.r * a.r - b.r * b.r + d * d) / (2 * d)
    const half = Math.sqrt(Math.max(0, a.r * a.r - along * along))
    const ux = (b.cx - a.cx) / d
    const uy = (b.cy - a.cy) / d
    // Both crossings share an x; the lower one is the valley floor.
    const y = a.cy + uy * along + Math.abs(ux) * half
    const dy = y - a.cy
    const dx = Math.sqrt(Math.max(0, a.r * a.r - dy * dy))
    return { x: a.cx + Math.sign(b.cx - a.cx) * dx, y }
  }

  /** Angle of a point on a circle, in SVG's y-down frame. */
  const angleOf = (
    lobe: { cx: number; cy: number },
    point: { x: number; y: number },
  ) => Math.atan2(point.y - lobe.cy, point.x - lobe.cx)

  // The outline enters each lobe at the valley it shares with the lobe before
  // it and leaves at the valley it shares with the one after, so the seam is
  // drawn once, exactly where the two arcs cross.
  let cursor = { x: lobes[0].cx - lobes[0].r, y: lobes[0].cy }
  let d = `M ${round(cursor.x)} ${round(cursor.y)}`

  for (let i = 0; i < lobes.length; i += 1) {
    const lobe = lobes[i]
    const next = lobes[i + 1]
    const end = next ? handoff(lobe, next) : { x: lobe.cx + lobe.r, y: lobe.cy }

    // Travelling rightwards over a lobe is clockwise in a y-down frame, so the
    // sweep flag is 1. Whether that arc passes the half-circle depends on where
    // the valley sits, so large-arc has to be derived rather than assumed.
    const swept =
      (angleOf(lobe, end) - angleOf(lobe, cursor) + Math.PI * 2) % (Math.PI * 2)
    const largeArc = swept > Math.PI ? 1 : 0

    d += ` A ${round(lobe.r)} ${round(lobe.r)} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`
    cursor = end
  }

  d += ` L ${round(x + w)} ${round(base)} L ${round(x)} ${round(base)} Z`

  /**
   * The scalloped edge is a real hole at every valley, and whatever sits behind
   * shows through it — often the balustrade, which then reads as white slivers
   * floating between the clouds.
   *
   * A rect whose top sits at 0.62r plugs every valley. That line is above the
   * lobe centres (which are at `top + r`), so the rect's own top edge stays
   * buried inside the lobes and never shows as a straight line across the
   * silhouette — it only ever fills the valleys.
   */
  const plugTop = top + r * 0.62

  return (
    <g className={className} fill={fill} filter={filter}>
      <rect
        x={round(x)}
        y={round(plugTop)}
        width={round(w)}
        height={round(Math.max(2, base - plugTop + 10))}
      />
      <path d={d} />
    </g>
  )
}

/**
 * One sheet of the diorama arriving.
 *
 * Every plane in the stage is a stack of these, each a beat later than the one
 * behind it, which is what makes the scene assemble as cut paper set down one
 * layer at a time rather than a single crossfade. `from` is the depth of the
 * drop: the further back the sheet, the smaller the rise, so the stack settles
 * from the back forwards.
 */
function PaperLayer({
  delay = 0,
  from = 46,
  still,
  className,
  children,
}: {
  delay?: number
  from?: number
  still: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <motion.g
      className={className}
      initial={still ? false : { y: from, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        still
          ? undefined
          : {
              y: { duration: 0.85, delay, ease: PAPER_EASE },
              opacity: { duration: 0.16, delay },
            }
      }
    >
      {children}
    </motion.g>
  )
}

type Point = { x: number; y: number }

function cubicPoint(a: Point, b: Point, c: Point, d: Point, t: number): Point {
  const mt = 1 - t
  const k0 = mt * mt * mt
  const k1 = 3 * mt * mt * t
  const k2 = 3 * mt * t * t
  const k3 = t * t * t
  return {
    x: k0 * a.x + k1 * b.x + k2 * c.x + k3 * d.x,
    y: k0 * a.y + k1 * b.y + k2 * c.y + k3 * d.y,
  }
}

/**
 * Points spaced evenly along the paper window's inner arch, measured by arc
 * length. Sampling the real curve — rather than an ellipse that only resembles
 * it — is what keeps every scallop the same size and on the cut line.
 */
function archEdgePoints(spacing: number) {
  const segments: [Point, Point, Point, Point][] = [
    [
      { x: 383, y: 860 },
      { x: 383, y: 300 },
      { x: 513, y: 162 },
      { x: 700, y: 162 },
    ],
    [
      { x: 700, y: 162 },
      { x: 887, y: 162 },
      { x: 1017, y: 300 },
      { x: 1017, y: 860 },
    ],
  ]

  const raw: Point[] = []
  for (const [a, b, c, d] of segments) {
    for (let i = 0; i <= 240; i += 1) {
      if (raw.length > 0 && i === 0) continue
      raw.push(cubicPoint(a, b, c, d, i / 240))
    }
  }

  const cum = [0]
  for (let i = 1; i < raw.length; i += 1) {
    cum.push(
      cum[i - 1] + Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y),
    )
  }

  const total = cum[cum.length - 1]
  const count = Math.max(4, Math.round(total / spacing))
  const points: Point[] = []
  let cursor = 0

  for (let i = 0; i <= count; i += 1) {
    const target = (total * i) / count
    while (cursor < cum.length - 2 && cum[cursor + 1] < target) cursor += 1
    const span = cum[cursor + 1] - cum[cursor] || 1
    const t = (target - cum[cursor]) / span
    points.push({
      x: raw[cursor].x + (raw[cursor + 1].x - raw[cursor].x) * t,
      y: raw[cursor].y + (raw[cursor + 1].y - raw[cursor].y) * t,
    })
  }

  return points
}

/* Only the top of the arch is scalloped — below this the edge is the straight
   side of the window, where the big side clouds already cover the cut. */
const ARCH_SCALLOPS = archEdgePoints(84).filter((p) => p.y < 650)

/**
 * The paper window's top edge is cut as a cloud, not an arc: a run of puffs
 * laid on the cut line so only their inner halves scallop into the blueprint.
 * Drawn inside the rim's filter group, so the two pieces share one shadow and
 * read as a single sheet of paper.
 */
function ArchScallops({
  points,
  r,
  fill,
}: {
  points: Point[]
  r: number
  fill: string
}) {
  return (
    <g fill={fill}>
      {points.map((p, i) => (
        <circle key={i} cx={round(p.x)} cy={round(p.y)} r={r} />
      ))}
    </g>
  )
}

/* ── Hanging bunting ────────────────────────────────────────────────────────
   The string is a quadratic curve and the stars are hung on it by solving that
   same curve, so a star can never drift off its own line the way four
   hand-placed `top` values always eventually do. Each star pivots at its knot,
   which is what a paper star on a thread actually does. */

const BUNTING = {
  from: { x: 0, y: 26 },
  control: { x: 190, y: 96 },
  to: { x: 385, y: 2 },
  /** Where along the string each star hangs, as a 0–1 fraction. */
  anchors: [0.14, 0.4, 0.65, 0.88],
} as const

function buntingPoint(t: number) {
  const mt = 1 - t
  return {
    x:
      mt * mt * BUNTING.from.x +
      2 * mt * t * BUNTING.control.x +
      t * t * BUNTING.to.x,
    y:
      mt * mt * BUNTING.from.y +
      2 * mt * t * BUNTING.control.y +
      t * t * BUNTING.to.y,
  }
}

/** A five-point star whose top vertex sits at the origin, so it hangs from (0,0). */
function starPoints(outer: number, inner = outer * 0.46) {
  const points: string[] = []
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius + outer
    points.push(`${round(x)},${round(y)}`)
  }
  return points.join(' ')
}

const BUNTING_STARS = BUNTING.anchors.map((t, i) => {
  const point = buntingPoint(t)
  return {
    ...point,
    span: 22 + (i % 2) * 5,
    tilt: [-9, 5, -6, 10][i],
    sway: 3.4 + (i % 3) * 0.5,
    delay: 0.5 + i * 0.11,
    fill: ['#F5A623', '#FAF9F6', '#F5A623', '#FFD12E'][i],
  }
})

function Bunting({ still, shadowId }: { still: boolean; shadowId: string }) {
  return (
    <div className={styles.buntingWrap} aria-hidden>
      <svg viewBox="0 0 420 150" className={styles.buntingSvg}>
        <g filter={`url(#${shadowId})`}>
          <motion.path
            d={`M${BUNTING.from.x} ${BUNTING.from.y} Q${BUNTING.control.x} ${BUNTING.control.y} ${BUNTING.to.x} ${BUNTING.to.y}`}
            fill="none"
            stroke="#FAF9F6"
            strokeWidth="4"
            strokeLinecap="round"
            initial={still ? false : { pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          />
        </g>

        {BUNTING_STARS.map((star, i) => (
          <motion.g
            key={i}
            initial={still ? false : { y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: still ? 0 : star.delay,
              ease: PAPER_EASE,
            }}
          >
            <motion.g
              style={{
                transformOrigin: `${round(star.x)}px ${round(star.y)}px`,
              }}
              animate={
                still
                  ? undefined
                  : {
                      rotate: [
                        star.tilt - star.sway,
                        star.tilt + star.sway,
                        star.tilt - star.sway,
                      ],
                    }
              }
              transition={
                still
                  ? undefined
                  : {
                      duration: 4.6 + (i % 3) * 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              <circle
                cx={round(star.x)}
                cy={round(star.y)}
                r="2.4"
                fill="#FAF9F6"
              />
              <polygon
                points={starPoints(star.span)}
                transform={`translate(${round(star.x)} ${round(star.y)})`}
                fill={star.fill}
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </motion.g>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

const CLOUDS = {
  /* Amber banks shouldering the arch, just outside the paper window */
  bankLeft: {
    x: 118,
    w: 436,
    top: 344,
    r: 96,
    base: 640,
    seed: 4201,
    billow: 0.8,
  },
  bankRight: {
    x: 892,
    w: 436,
    top: 334,
    r: 96,
    base: 650,
    seed: 4219,
    billow: 0.8,
  },
  /* Pale band sitting inside the window, right behind the railing */
  shelfCream: { x: 214, w: 1012, top: 516, r: 62, base: 660, seed: 5303 },
  shelfWhite: { x: 268, w: 904, top: 536, r: 58, base: 660, seed: 5321 },
  /* Two-tone cloud sea rolling in front of the shelf, under the railing.
     Even scallops, not billows: these crests stand right in front of the
     balustrade, and a deep valley lets the rail show through. */
  seaAmber: { x: 168, w: 1104, top: 560, r: 92, base: 800, seed: 9103 },
  seaGold: { x: 168, w: 1104, top: 606, r: 80, base: 820, seed: 9127 },
}

/* Foreground stack, drawn in a 1440 × 380 box stretched to the plane height.
   Back to front: amber lip, cream, then the crisp white banks the headline and
   the CTA sit on, closed by a cream base ridge.

   The white banks carry the billow. They are the largest sheets and the ones
   the eye reads as cloud, so they get wide lobes with deep valleys between
   them — that alternating swell is what turns a run of bumps into a cloud.

   The sheets behind them keep their even, shallow scallop. Wherever a scalloped
   edge dips, whatever is behind shows through, and behind these is the
   balustrade — deep notches there leave the rail poking out as fragments. */
const FOREGROUND_CLOUDS = {
  amber: {
    x: -46,
    w: 1532,
    top: 54,
    r: 140,
    base: 392,
    seed: 7701,
  },
  cream: {
    x: -46,
    w: 1532,
    top: 96,
    r: 138,
    base: 392,
    seed: 7717,
  },
  left: {
    x: -120,
    w: 1040,
    top: 96,
    r: 168,
    base: 392,
    seed: 7741,
    billow: 0.95,
  },
  right: {
    x: 560,
    w: 1000,
    top: 116,
    r: 156,
    base: 392,
    seed: 7753,
    billow: 0.9,
  },
  base: {
    x: -46,
    w: 1532,
    top: 336,
    r: 92,
    base: 392,
    seed: 7763,
  },
}

/* Narrow screens get their own stack rather than a 3× squashed version of the
   wide one: a 480-wide box matches the mobile plane's aspect almost exactly. */
const NARROW_CLOUDS = {
  left: {
    x: -70,
    w: 420,
    top: 84,
    r: 104,
    base: 392,
    seed: 8741,
    billow: 0.9,
  },
  right: {
    x: 130,
    w: 420,
    top: 110,
    r: 98,
    base: 392,
    seed: 8753,
    billow: 0.85,
  },
  base: {
    x: -30,
    w: 540,
    top: 344,
    r: 88,
    base: 392,
    seed: 8763,
    billow: 0.5,
  },
}

function PaperSun({ className }: { className?: string }) {
  const rays = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const aLeft = angle - 0.14
        const aRight = angle + 0.14
        const rInner = 56
        const rOuter = i % 2 === 0 ? 88 : 80
        const x1 = round(100 + Math.cos(aLeft) * rInner)
        const y1 = round(100 + Math.sin(aLeft) * rInner)
        const x2 = round(100 + Math.cos(angle) * rOuter)
        const y2 = round(100 + Math.sin(angle) * rOuter)
        const x3 = round(100 + Math.cos(aRight) * rInner)
        const y3 = round(100 + Math.sin(aRight) * rInner)
        return `${x1},${y1} ${x2},${y2} ${x3},${y3}`
      }),
    [],
  )

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden
      focusable="false"
    >
      {rays.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill={i % 2 === 0 ? '#FFD12E' : '#F5A623'}
          stroke="#E08E1B"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
      <circle
        cx="100"
        cy="100"
        r="56"
        fill="#FFD12E"
        stroke="#F5A623"
        strokeWidth="3"
      />
      <circle cx="80" cy="92" r="5" fill="#111827" />
      <circle cx="120" cy="92" r="5" fill="#111827" />
      <ellipse cx="69" cy="105" rx="7" ry="4" fill="#F5A623" opacity="0.7" />
      <ellipse cx="131" cy="105" rx="7" ry="4" fill="#F5A623" opacity="0.7" />
      <path
        d="M82 108Q100 128 118 108"
        fill="none"
        stroke="#111827"
        strokeWidth="4.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

type ScriptLayerProps = {
  word: ScriptWord
  reduced: boolean
  transform: string
  stroke: string
  strokeWidth: number
  delay?: number
}

function ScriptStrokeLayer({
  word,
  reduced,
  transform,
  stroke,
  strokeWidth,
  delay = 0,
}: ScriptLayerProps) {
  return (
    <g transform={transform}>
      <motion.path
        d={word.main}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      {word.extra.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: delay + 0.95 + index * 0.12,
            ease: 'easeOut',
          }}
        />
      ))}
    </g>
  )
}

/**
 * One row of the headline: a fixed lead word and a yellow paper pill holding the
 * word that changes.
 *
 * The pill reserves the width of its longest candidate behind an invisible
 * sizer, so a swap never nudges the layout. The words ride a tape behind a
 * clipped window — the outgoing word leaves through the top edge while the next
 * one comes up from below — so the pill is never empty and the two never sit
 * on top of each other.
 */
function HeadlineSwapRow({
  lead,
  items,
  index,
  reduced,
  onAdvance,
  onHoverChange,
}: {
  lead: string
  items: readonly { icon: string; word: string }[]
  index: number
  reduced: boolean
  onAdvance: () => void
  onHoverChange: (hovering: boolean) => void
}) {
  const current = items[index % items.length]
  const widest = items.reduce((a, b) => (b.word.length > a.word.length ? b : a))

  return (
    <div className={styles.headlineRow}>
      <span className={styles.leadLabel}>{lead}</span>
      <button
        type="button"
        className={styles.swapPill}
        onClick={onAdvance}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        aria-label={`${lead} ${current.word}. Choose the next word`}
      >
        <span className={styles.swapSizer} aria-hidden>
          <span className={styles.pillIcon}>{widest.icon}</span>
          <span>{widest.word}</span>
        </span>
        <span className={styles.swapWindow} aria-hidden>
          <AnimatePresence initial={false}>
            <motion.span
              key={current.word}
              className={styles.swapPillInner}
              initial={reduced ? false : { y: '100%' }}
              animate={{ y: '0%' }}
              exit={reduced ? undefined : { y: '-100%' }}
              transition={{ duration: 0.42, ease: PAPER_EASE }}
            >
              <span className={styles.pillIcon}>{current.icon}</span>
              <span>{current.word}</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  )
}

/**
 * Pop-Up Theatre Diorama Hero.
 *
 * Layered 3D paper-cut stage with royal-blue proscenium wings, blueprint grid
 * backdrop, hanging star bunting, smiling yellow paper sun peeking above a
 * stage cloud, balustrade railing, thick off-white `Aditya` script cutout,
 * triple-layer bottom paper clouds, left-aligned word-swapper headline, and
 * tactile yellow CTA controls.
 */
export function Hero({ surface = 'cobalt' }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const gridId = useId()
  const shadowFilterId = useId()
  const deepShadowId = useId()
  const stageClipId = useId()

  const [physicsOn, setPhysicsOn] = useState(true)
  const [writeKey, setWriteKey] = useState(0)
  const [phrase, setPhrase] = useState(0)
  const [phraseHeld, setPhraseHeld] = useState(false)

  const physicsActive = physicsOn && !reduced
  // A reduced-motion visit gets the finished diorama, not a slow build of it.
  const still = reduced

  // Normalized pointer offset in [-1, 1] for 3D paper parallax
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springConfig = { stiffness: 110, damping: 22, mass: 0.7 }
  const smoothX = useSpring(pointerX, springConfig)
  const smoothY = useSpring(pointerY, springConfig)

  const curtainX = useTransform(smoothX, (v) => v * -10)
  const curtainY = useTransform(smoothY, (v) => v * -7)
  const midX = useTransform(smoothX, (v) => v * 6)
  const midY = useTransform(smoothY, (v) => v * 5)
  const sunX = useTransform(smoothX, (v) => v * 12)
  const sunY = useTransform(smoothY, (v) => v * 9)
  const titleX = useTransform(smoothX, (v) => v * 16)
  const titleY = useTransform(smoothY, (v) => v * 11)
  const cloudsFrontX = useTransform(smoothX, (v) => v * 20)
  const cloudsFrontY = useTransform(smoothY, (v) => v * 8)

  const word = useMemo(() => layoutAdityaWord(), [])
  const scriptBox = useMemo(() => {
    const pad = SCRIPT_STROKE / 2 + 2.4
    const vbX = -1.6 - pad
    const vbY = word.top - pad
    const vbW =
      Math.max(word.width, 1) + 4.4 + pad * 2 - word.top * SCRIPT_SLANT
    const vbH = word.bottom + pad - vbY + 2.5
    return [vbX, vbY, vbW, vbH].map(round).join(' ')
  }, [word])

  const handleStageMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (
        !physicsActive ||
        event.pointerType !== 'mouse' ||
        !sectionRef.current
      )
        return
      const rect = sectionRef.current.getBoundingClientRect()
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
      pointerX.set(Math.max(-1, Math.min(1, nx)))
      pointerY.set(Math.max(-1, Math.min(1, ny)))
    },
    [physicsActive, pointerX, pointerY],
  )

  const handleStageLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  const togglePhysics = useCallback(() => {
    setPhysicsOn((prev) => {
      const next = !prev
      if (!next) {
        pointerX.set(0)
        pointerY.set(0)
      }
      return next
    })
  }, [pointerX, pointerY])

  const replayWrite = useCallback(() => {
    setWriteKey((k) => k + 1)
  }, [])

  const advancePhrase = useCallback(() => {
    setPhrase((prev) => prev + 1)
  }, [])

  /**
   * The headline writes itself.
   *
   * All three rows turn over on one beat, so what changes is a whole sentence
   * ("I bring systems & craft to digital work") rather than three separate
   * widgets each doing their own thing. The three candidate lists have
   * different lengths, so the combinations still keep moving.
   *
   * It holds whenever a visitor takes over — pointer over the stack, focus in
   * it, the tab hidden, the hero scrolled past — and never starts under reduced
   * motion, where the first phrase simply stays put.
   */
  useEffect(() => {
    if (reduced || phraseHeld) return
    const section = sectionRef.current
    if (!section) return

    const BEAT = 3800
    let timer = 0
    let onScreen = true

    const stop = () => {
      window.clearTimeout(timer)
      timer = 0
    }

    const schedule = () => {
      stop()
      if (document.hidden || !onScreen || phraseHeld) return
      timer = window.setTimeout(() => {
        setPhrase((prev) => prev + 1)
        schedule()
      }, BEAT)
    }

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting
              schedule()
            },
            { threshold: 0.35 },
          )
    observer?.observe(section)

    document.addEventListener('visibilitychange', schedule)
    schedule()

    return () => {
      stop()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [reduced, phraseHeld])

  const holdPhrase = useCallback((held: boolean) => setPhraseHeld(held), [])

  const craftIndex = phrase % MADLIB_SLOTS.craft.length
  const tasteIndex = phrase % MADLIB_SLOTS.taste.length
  const productIndex = phrase % MADLIB_SLOTS.products.length

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      data-surface={surface}
      data-physics={physicsActive ? 'on' : 'off'}
      aria-labelledby="hero-title"
      onPointerMove={handleStageMove}
      onPointerLeave={handleStageLeave}
    >
      <MotionConfig reducedMotion="user">
        {/* Global SVG filter & stage clip/pattern defs for 4-layer shadow-box */}
        <svg className={styles.svgDefs} aria-hidden focusable="false">
          <defs>
            <filter
              id={shadowFilterId}
              x="-14%"
              y="-14%"
              width="128%"
              height="134%"
            >
              <feDropShadow
                dx="0"
                dy="7"
                stdDeviation="4.5"
                floodColor="#0c1538"
                floodOpacity="0.42"
              />
            </filter>
            {/* Deeper cast shadow for the foreground banks that sit nearest the viewer */}
            <filter
              id={deepShadowId}
              x="-14%"
              y="-14%"
              width="128%"
              height="134%"
            >
              <feDropShadow
                dx="0"
                dy="11"
                stdDeviation="7"
                floodColor="#0c1538"
                floodOpacity="0.4"
              />
            </filter>
            <pattern
              id={gridId}
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="rgb(250 249 246 / 0.14)"
                strokeWidth="1"
              />
              <path
                d="M 12 0 V 48 M 24 0 V 48 M 36 0 V 48 M 0 12 H 48 M 0 24 H 48 M 0 36 H 48"
                fill="none"
                stroke="rgb(250 249 246 / 0.055)"
                strokeWidth="0.75"
              />
            </pattern>
            <clipPath id={stageClipId}>
              <rect x="208" y="48" width="1024" height="812" rx="22" />
            </clipPath>
          </defs>
        </svg>

        {/* Left Edge Interactive Tab: physics on/off */}
        <button
          type="button"
          className={styles.physicsTab}
          aria-pressed={physicsOn}
          onClick={togglePhysics}
        >
          <span className={styles.physicsLabel}>physics on/off</span>
        </button>

        {/* Layer 1: Outer Proscenium Royal-Blue Side Walls (behind physics tab & right rail) */}
        <div className={styles.wingLeftOuter} aria-hidden>
          <div className={styles.wingFoldLeft} />
        </div>
        <div className={styles.wingRightOuter} aria-hidden>
          <div className={styles.wingFoldRight} />
        </div>

        {/* Layer 2: Sky-Blue Recessed Rectangle (#AFC8E6) extending cleanly to navbar */}
        <div className={styles.dioramaViewport}>
          {/* Layer 4a: Clipped Blueprint Grid, Concentric Curtains & Lowered Amber Clouds */}
          <motion.div
            className={styles.planeCurtains}
            style={physicsActive ? { x: curtainX, y: curtainY } : undefined}
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 860"
              preserveAspectRatio="xMidYMid slice"
              className={styles.stageSvg}
            >
              <g clipPath={`url(#${stageClipId})`}>
                {/* Recessed Royal Blue Blueprint Backdrop */}
                <PaperLayer still={still} from={-18}>
                  <rect
                    x="200"
                    y="44"
                    width="1040"
                    height="820"
                    fill="#1E3EC4"
                  />
                  <rect
                    x="200"
                    y="44"
                    width="1040"
                    height="820"
                    fill={`url(#${gridId})`}
                  />
                </PaperLayer>

                {/* Outer sunburst-yellow arch curtain ring */}
                <PaperLayer still={still} delay={0.1} from={30}>
                  <path
                    d="M205 45 H1235 V860 H1115 C1115 245 955 92 700 92 C445 92 285 245 285 860 H205 Z"
                    fill="#F7C627"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
                {/* Warm-amber arch ring tucked inside the yellow */}
                <PaperLayer still={still} delay={0.16} from={30}>
                  <path
                    d="M205 45 H1235 V860 H1065 C1065 275 915 118 700 118 C485 118 335 275 335 860 H205 Z"
                    fill="#E89418"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
                {/* Thick off-white paper rim framing the blueprint window.
                    Rim and scallops share one filter so the shadow traces a
                    single cut edge instead of stacking two. */}
                <PaperLayer still={still} delay={0.24} from={34}>
                  <g filter={`url(#${shadowFilterId})`}>
                    <path
                      d="M335 860 C335 275 485 118 700 118 C915 118 1065 275 1065 860 H1017 C1017 300 887 162 700 162 C513 162 383 300 383 860 Z"
                      fill="#FAF9F6"
                    />
                    <ArchScallops
                      points={ARCH_SCALLOPS}
                      r={52}
                      fill="#FAF9F6"
                    />
                  </g>
                </PaperLayer>

                {/* Warm amber cloud banks shouldering the arch, left & right */}
                <PaperLayer
                  still={still}
                  delay={0.34}
                  from={40}
                  className={styles.cloudSideBanks}
                >
                  <CloudBank
                    {...CLOUDS.bankLeft}
                    fill="#EB9619"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <CloudBank
                    {...CLOUDS.bankRight}
                    fill="#EB9619"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                {/* Pale cloud band sitting inside the window, behind the railing */}
                <PaperLayer still={still} delay={0.42} from={44}>
                  <CloudBank
                    {...CLOUDS.shelfCream}
                    fill="#F2E3BE"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
                <PaperLayer still={still} delay={0.48} from={44}>
                  <CloudBank
                    {...CLOUDS.shelfWhite}
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
              </g>
            </svg>
          </motion.div>

          {/* Layer 3 & 4b: Sky-Blue Curtains + Stage Clouds (clipped) & Inner Royal-Blue Rectangle */}
          <motion.div
            className={styles.planeProscenium}
            style={physicsActive ? { x: midX, y: midY } : undefined}
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 860"
              preserveAspectRatio="xMidYMid slice"
              className={styles.stageSvg}
            >
              <g clipPath={`url(#${stageClipId})`}>
                {/* Curtains and swags: the painted sky pieces that hang in
                    front of the blueprint, so they land after the backdrop. */}
                <PaperLayer still={still} delay={0.18} from={-26}>
                  {/* Top-left sky-blue curved curtain swag */}
                  <path
                    d="M225 68 H465 C445 148 395 208 325 225 C302 230 278 222 262 205 L225 245 Z"
                    fill="#9CC0E6"
                    filter={`url(#${shadowFilterId})`}
                  />
                  {/* Top-center scalloped ice-white cloud valance */}
                  <path
                    d="M455 68 H715 C708 112 672 128 640 105 C612 135 562 135 535 105 C502 128 462 112 455 68 Z"
                    fill="#EBF1F8"
                    filter={`url(#${shadowFilterId})`}
                  />
                  {/* Top-right small sky-blue cloud tuck */}
                  <path
                    d="M815 68 H945 C935 105 895 118 860 98 C840 108 820 92 815 68 Z"
                    fill="#9CC0E6"
                    filter={`url(#${shadowFilterId})`}
                  />
                  {/* Right sky-blue scalloped curtain wing */}
                  <path
                    d="M995 68 H1215 V560 H1135 C1105 495 1110 420 1152 370 C1102 330 1098 265 1142 220 C1055 205 1002 148 995 68 Z"
                    fill="#9CC0E6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                {/* Upper-left & upper-right white clouds framing Aditya.
                    Both close on a rounded underside — a straight chord here
                    reads as a cloud sliced with a ruler. */}
                <PaperLayer still={still} delay={0.3} from={34}>
                  <path
                    d="M275 288 C268 252 298 225 332 235 C355 198 408 202 428 238 C458 234 478 260 470 288 C450 316 418 330 372 330 C326 330 292 316 275 288 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <path
                    d="M945 285 C938 248 970 220 1004 230 C1030 194 1086 198 1108 234 C1140 230 1162 256 1154 285 C1134 313 1102 327 1050 327 C998 327 962 313 945 285 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                {/* Left mid-wing & right lower-wing white cloud poufs. Their
                    flat sides run past the frame so the cut is never on show. */}
                <PaperLayer still={still} delay={0.36} from={38}>
                  <path
                    d="M188 315 C278 315 308 352 295 402 C312 428 295 472 252 482 H188 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <path
                    d="M1252 322 C1180 322 1112 358 1125 405 C1082 418 1072 472 1112 502 C1135 518 1180 515 1252 505 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                {/* Lower-left sky-blue cloud puff behind white foreground dome */}
                <PaperLayer still={still} delay={0.4} from={40}>
                  <path
                    d="M188 465 C285 455 338 492 345 545 C395 545 438 585 445 645 H188 Z"
                    fill="#9CC0E6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                {/* Two-tone cloud sea rolling in front of the shelf, under the railing */}
                <PaperLayer still={still} delay={0.5} from={46}>
                  <CloudBank
                    {...CLOUDS.seaAmber}
                    fill="#EE9B1B"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
                <PaperLayer still={still} delay={0.56} from={48}>
                  <CloudBank
                    {...CLOUDS.seaGold}
                    fill="#F5C42C"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                {/* Tall narrow stages crop to the centre of this 1440-wide
                    drawing, so the arch banks and the cloud sea are cut away
                    and the stage's middle is left as bare sky. These three
                    banks fill that gap.

                    Each base runs well below the next bank's crest, so the flat
                    bottom of a bank is never visible above the lobes in front
                    of it — the only edges on show are scallops. */}
                <PaperLayer
                  still={still}
                  delay={0.44}
                  from={42}
                  className={styles.cloudNarrowOnly}
                >
                  <CloudBank
                    x={250}
                    w={960}
                    top={300}
                    r={68}
                    base={470}
                    seed={6113}
                    billow={0.85}
                    fill="#9CC0E6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
                <PaperLayer
                  still={still}
                  delay={0.5}
                  from={44}
                  className={styles.cloudNarrowOnly}
                >
                  <CloudBank
                    x={222}
                    w={1010}
                    top={404}
                    r={74}
                    base={578}
                    seed={6121}
                    billow={0.75}
                    fill="#A7C7E7"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
                <PaperLayer
                  still={still}
                  delay={0.56}
                  from={46}
                  className={styles.cloudNarrowOnly}
                >
                  <CloudBank
                    x={250}
                    w={960}
                    top={520}
                    r={66}
                    base={700}
                    seed={6131}
                    billow={0.65}
                    fill="#C3D8EF"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
              </g>

              {/* Layer 3: Inner Royal-Blue 3D Rounded Rectangular Proscenium Frame (#2242D6) */}
              <PaperLayer still={still} delay={0.04} from={-14}>
                <path
                  d="M182 860 V72 C182 46 202 28 228 28 H1212 C1238 28 1258 46 1258 72 V860 H1206 V96 C1206 82 1194 72 1180 72 H260 C246 72 234 82 234 96 V860 Z"
                  fill="#2242D6"
                  filter={`url(#${shadowFilterId})`}
                />
              </PaperLayer>
              <PaperLayer still={still} delay={0.08} from={-14}>
                <path
                  d="M184 855 V72 C184 48 203 30 228 30 H1212 C1237 30 1256 48 1256 72 V855"
                  fill="none"
                  stroke="rgb(250 249 246 / 0.22)"
                  strokeWidth="2"
                />
              </PaperLayer>

              {/* Top-right white cloud swags over sky-blue mat */}
              <PaperLayer still={still} delay={0.2} from={-22}>
                <path
                  d="M905 0 H1005 C998 36 962 48 932 32 C915 24 908 12 905 0 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
                <path
                  d="M1070 0 H1440 V105 H1345 C1295 115 1255 95 1230 68 C1185 95 1130 82 1105 45 C1082 52 1072 28 1070 0 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
              </PaperLayer>
            </svg>
          </motion.div>

          {/* Depth Plane 4: Smiling Paper Sun behind white stage cloud + Balustrade + Bunting + Stars */}
          <motion.div
            className={styles.planeStageProps}
            style={physicsActive ? { x: sunX, y: sunY } : undefined}
          >
            {/* Hanging Star Bunting (Top-Left Corner) */}
            <Bunting still={still} shadowId={shadowFilterId} />

            {/* Smiling Paper Sun peeking over a white stage cloud */}
            <div className={styles.sunCluster} aria-hidden>
              <motion.div
                className={styles.sunDisc}
                initial={still ? false : { y: 34, scale: 0.92, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={
                  still
                    ? undefined
                    : {
                        y: { duration: 0.9, delay: 0.5, ease: PAPER_EASE },
                        scale: { duration: 0.9, delay: 0.5, ease: PAPER_EASE },
                        opacity: { duration: 0.16, delay: 0.5 },
                      }
                }
              >
                <PaperSun className={styles.sunSvg} />
              </motion.div>
              <motion.svg
                viewBox="0 0 380 150"
                className={styles.sunCloudCover}
                focusable="false"
                initial={still ? false : { y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  still
                    ? undefined
                    : {
                        y: { duration: 0.85, delay: 0.64, ease: PAPER_EASE },
                        opacity: { duration: 0.16, delay: 0.64 },
                      }
                }
              >
                {/* One sheet. A second cream copy offset below the silhouette
                    showed as a flat slab, because the cloud closes on a chord —
                    the die-cut shadow is the paper edge here. */}
                <path
                  d="M12 118 C8 82 42 58 78 68 C112 28 178 28 212 64 C248 42 298 52 318 86 C352 86 368 112 358 136 C315 146 245 144 185 142 C115 144 45 142 12 118 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
              </motion.svg>
            </div>

            {/* Right stage cloud accent behind upper-right CTA */}
            <div className={styles.rightStageCloud} aria-hidden>
              <svg viewBox="0 0 260 120" focusable="false">
                <path
                  d="M20 98 Q42 42 104 56 Q146 16 206 48 Q248 56 246 98 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
              </svg>
            </div>

            {/* White Paper Stage Balustrade / Railing behind lower half of Aditya.
                The rail is drawn as one sheet: top rail, turned balusters and a
                bottom rail, so it reads as a cut balustrade rather than a fence
                of loose slats. */}
            <motion.div
              className={styles.balustrade}
              aria-hidden
              initial={still ? false : { y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={
                still
                  ? undefined
                  : {
                      y: { duration: 0.8, delay: 0.72, ease: PAPER_EASE },
                      opacity: { duration: 0.16, delay: 0.72 },
                    }
              }
            >
              <div className={styles.balustradeTopRail} />
              <div className={styles.balustradeSpindles}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className={styles.balustradePost} />
                ))}
              </div>
              <div className={styles.balustradeBottomRail} />
            </motion.div>

            {/* Scattered Cutout Stars + Preserved data-hero-sticker Hooks for About Gravity Pit.
                Each sparkle is a scrap dropped onto the finished stage, so they
                settle last, one after another (see the CSS stagger). */}
            <div className={styles.starScatter} data-still={still} aria-hidden>
              <div
                className={cn(styles.cutoutStar, styles.starPos1)}
                data-hero-sticker="smiley"
                data-slot="smiley"
              >
                <FourPointSparkle fill="#FAF9F6" innerFill="#2948E8" />
                <span className={styles.hiddenHook}>
                  <Smiley />
                </span>
              </div>

              <div
                className={cn(styles.cutoutStar, styles.starPos2)}
                data-hero-sticker="burst"
                data-slot="burst"
              >
                <FivePointStar
                  fill="#FFD12E"
                  stroke="#111827"
                  strokeWidth={2.5}
                />
                <span className={styles.hiddenHook}>
                  <Burst text="hi!" />
                </span>
              </div>

              <div
                className={cn(styles.cutoutStar, styles.starPos3)}
                data-hero-sticker="daisy"
                data-slot="daisy"
              >
                <FourPointSparkle fill="#FAF9F6" innerFill="#A7C7E7" />
                <span className={styles.hiddenHook}>
                  <Daisy />
                </span>
              </div>

              <div
                className={cn(styles.cutoutStar, styles.starPos4)}
                data-hero-sticker="bolt"
                data-slot="bolt"
              >
                <FivePointStar
                  fill="#F5A623"
                  stroke="#111827"
                  strokeWidth={2.5}
                />
                <span className={styles.hiddenHook}>
                  <Bolt />
                </span>
              </div>

              <div className={cn(styles.cutoutStar, styles.starPos5)}>
                <FourPointSparkle fill="#FAF9F6" innerFill="#A7C7E7" />
              </div>
              <div className={cn(styles.cutoutStar, styles.starPos6)}>
                <FivePointStar
                  fill="#FAF9F6"
                  stroke="#111827"
                  strokeWidth={2.5}
                />
              </div>
              <div className={cn(styles.cutoutStar, styles.starPos7)}>
                <FourPointSparkle fill="#FAF9F6" innerFill="#A7C7E7" />
              </div>
              <div className={cn(styles.cutoutStar, styles.starPos8)}>
                <FourPointSparkle fill="#FAF9F6" innerFill="#F5A623" />
              </div>
              <div className={cn(styles.cutoutStar, styles.starPos9)}>
                <FivePointStar
                  fill="#FAF9F6"
                  stroke="#111827"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </motion.div>

          {/* Depth Plane 5: Elevated 3D Off-White Paper Cutout `Aditya` Main Title.
              The entrance lives on the inner button: the outer plane's `y` is
              already owned by the pointer parallax spring. */}
          <motion.div
            className={styles.planeTitle}
            style={physicsActive ? { x: titleX, y: titleY } : undefined}
          >
            <motion.div
              initial={still ? false : { y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={
                still
                  ? undefined
                  : {
                      y: { duration: 0.8, delay: 0.78, ease: PAPER_EASE },
                      opacity: { duration: 0.16, delay: 0.78 },
                    }
              }
            >
              <button
                type="button"
                className={styles.scriptBtn}
                onClick={replayWrite}
                aria-label="Aditya — click to replay title animation"
              >
                <svg
                  key={writeKey}
                  viewBox={scriptBox}
                  className={styles.scriptSvg}
                  aria-hidden
                  focusable="false"
                >
                  <ScriptStrokeLayer
                    word={word}
                    reduced={reduced}
                    delay={0.34}
                    transform="translate(1.8 2.6) skewX(-9)"
                    stroke="rgb(17 24 39 / 0.34)"
                    strokeWidth={SCRIPT_STROKE + 2.1}
                  />
                  <ScriptStrokeLayer
                    word={word}
                    reduced={reduced}
                    delay={0.22}
                    transform="translate(0.95 1.35) skewX(-9)"
                    stroke="#111827"
                    strokeWidth={SCRIPT_STROKE + 1.85}
                  />
                  <ScriptStrokeLayer
                    word={word}
                    reduced={reduced}
                    delay={0.1}
                    transform="skewX(-9)"
                    stroke="#172554"
                    strokeWidth={SCRIPT_STROKE + 1.25}
                  />
                  <ScriptStrokeLayer
                    word={word}
                    reduced={reduced}
                    transform="skewX(-9)"
                    stroke="#FAF9F6"
                    strokeWidth={SCRIPT_STROKE}
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Upper-Right Stage CTA Pill: Say hi ↗ — deliberately not repeated
              here; the fixed header already carries this exact action a few
              pixels above, and two identical pills read as a mistake. */}

          {/* Depth Plane 6: Overlapping Bottom Paper Clouds (#F5A623 -> #F5ECCD -> #FAF9F6) */}
          <motion.div
            className={styles.planeForegroundClouds}
            style={
              physicsActive ? { x: cloudsFrontX, y: cloudsFrontY } : undefined
            }
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 380"
              preserveAspectRatio="none"
              className={cn(styles.cloudsSvg, styles.cloudsWide)}
            >
              {/* Layer 1 — Warm amber back bank (#F5A623) */}
              <PaperLayer still={still} delay={0.56} from={54}>
                <CloudBank
                  {...FOREGROUND_CLOUDS.amber}
                  fill="#F2A22A"
                  filter={`url(#${shadowFilterId})`}
                />
              </PaperLayer>
              {/* Layer 2 — Soft cream bank (#F5ECCD) */}
              <PaperLayer still={still} delay={0.63} from={54}>
                <CloudBank
                  {...FOREGROUND_CLOUDS.cream}
                  fill="#F0DDB0"
                  filter={`url(#${shadowFilterId})`}
                />
              </PaperLayer>
              {/* Layer 3 — Bottom-left white bank the headline sits on (#FAF9F6) */}
              <PaperLayer still={still} delay={0.7} from={58}>
                <CloudBank
                  {...FOREGROUND_CLOUDS.left}
                  fill="#FAF9F6"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
              {/* Layer 4 — Bottom-right crisp white bank (#FAF9F6) */}
              <PaperLayer still={still} delay={0.7} from={58}>
                <CloudBank
                  {...FOREGROUND_CLOUDS.right}
                  fill="#FAF9F6"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
              {/* Layer 5 — Cream base ridge closing the bottom edge */}
              <PaperLayer still={still} delay={0.78} from={62}>
                <CloudBank
                  {...FOREGROUND_CLOUDS.base}
                  fill="#F0DDB0"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
            </svg>

            <svg
              viewBox="0 0 480 380"
              preserveAspectRatio="none"
              className={cn(styles.cloudsSvg, styles.cloudsNarrow)}
            >
              <PaperLayer still={still} delay={0.6} from={54}>
                <CloudBank
                  {...NARROW_CLOUDS.left}
                  fill="#FAF9F6"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
              <PaperLayer still={still} delay={0.6} from={54}>
                <CloudBank
                  {...NARROW_CLOUDS.right}
                  fill="#FAF9F6"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
              <PaperLayer still={still} delay={0.72} from={60}>
                <CloudBank
                  {...NARROW_CLOUDS.base}
                  fill="#F0DDB0"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
            </svg>
          </motion.div>

          {/* Depth Plane 7: Foreground Left Typography Stack & Lower-Right CTA */}
          <div
            className={styles.foregroundContent}
            data-hero-copy
            data-still={still}
          >
            <div className={styles.shell}>
              <div className={styles.foregroundRow}>
                {/* Left-Aligned Typography Stack anchored on white cloud bank */}
                <div
                  id="hero-title"
                  className={styles.headlineStack}
                  role="heading"
                  aria-level={1}
                  onPointerEnter={() => holdPhrase(true)}
                  onPointerLeave={() => holdPhrase(false)}
                  onFocusCapture={() => holdPhrase(true)}
                  onBlurCapture={() => holdPhrase(false)}
                >
                  <HeadlineSwapRow
                    lead="I BRING"
                    items={MADLIB_SLOTS.craft}
                    index={craftIndex}
                    reduced={reduced}
                    onAdvance={advancePhrase}
                    onHoverChange={holdPhrase}
                  />
                  <HeadlineSwapRow
                    lead="&"
                    items={MADLIB_SLOTS.taste}
                    index={tasteIndex}
                    reduced={reduced}
                    onAdvance={advancePhrase}
                    onHoverChange={holdPhrase}
                  />
                  <HeadlineSwapRow
                    lead="TO"
                    items={MADLIB_SLOTS.products}
                    index={productIndex}
                    reduced={reduced}
                    onAdvance={advancePhrase}
                    onHoverChange={holdPhrase}
                  />
                </div>

                {/* Lower-Right Foreground CTA: See work → */}
                <div className={styles.lowerRightAction}>
                  <button
                    type="button"
                    className={styles.paperPillBtn}
                    onClick={() => scrollToSection('work', reduced)}
                  >
                    <span>See work</span>
                    <ArrowRight size={17} strokeWidth={2.3} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
