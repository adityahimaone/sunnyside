'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useCallback, useId, useMemo, useRef, useState } from 'react'

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
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

/**
 * A paper-cut cloud bank: an even run of overlapping puffs sitting on a solid
 * base. Puffs are near-identical on purpose — a hand-cut paper edge repeats,
 * and uneven bumps are what read as "messy" rather than "made".
 *
 * `r` is explicit so several stacked banks can share one scallop rhythm while
 * their crests sit at different heights.
 */
function CloudBank({
  x,
  w,
  top,
  r,
  base,
  seed,
  density = 1,
  fill,
  filter,
  className,
}: CloudBankSpec & { fill: string; filter?: string; className?: string }) {
  const rand = seededRandom(seed)
  const puffs = Math.max(2, Math.round((w / (r * 1.5)) * density))
  const step = w / puffs
  const shapes: { cx: number; cy: number; r: number }[] = []

  for (let i = 0; i <= puffs; i += 1) {
    shapes.push({
      cx: x + step * i,
      cy: top + r,
      r: r * (0.985 + rand() * 0.03),
    })
  }

  return (
    <g className={className} fill={fill} filter={filter}>
      <rect
        x={round(x)}
        y={round(top + r * 0.62)}
        width={round(w)}
        height={round(Math.max(2, base - (top + r * 0.62) + 10))}
      />
      {shapes.map(({ cx, cy, r: pr }, i) => (
        <circle key={i} cx={round(cx)} cy={round(cy)} r={round(pr)} />
      ))}
    </g>
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

const CLOUDS = {
  /* Amber banks shouldering the arch, just outside the paper window */
  bankLeft: { x: 118, w: 436, top: 344, r: 110, base: 640, seed: 4201 },
  bankRight: { x: 892, w: 436, top: 334, r: 110, base: 650, seed: 4219 },
  /* Pale band sitting inside the window, right behind the railing */
  shelfCream: { x: 214, w: 1012, top: 516, r: 62, base: 660, seed: 5303 },
  shelfWhite: { x: 268, w: 904, top: 536, r: 58, base: 660, seed: 5321 },
  /* Two-tone cloud sea rolling in front of the shelf, under the railing */
  seaAmber: { x: 168, w: 1104, top: 560, r: 92, base: 800, seed: 9103 },
  seaGold: { x: 168, w: 1104, top: 606, r: 80, base: 820, seed: 9127 },
}

/* Foreground stack, drawn in a 1440 × 380 box stretched to the plane height.
   Back to front: amber lip, cream, then the crisp white banks the headline and
   the CTA sit on, closed by a cream base ridge. */
const FOREGROUND_CLOUDS = {
  amber: { x: -46, w: 1532, top: 54, r: 140, base: 392, seed: 7701 },
  cream: { x: -46, w: 1532, top: 92, r: 140, base: 392, seed: 7717 },
  left: { x: -120, w: 1040, top: 130, r: 150, base: 392, seed: 7741 },
  right: { x: 560, w: 1000, top: 148, r: 144, base: 392, seed: 7753 },
  base: { x: -46, w: 1532, top: 340, r: 100, base: 392, seed: 7763 },
}

/* Narrow screens get their own stack rather than a 3× squashed version of the
   wide one: a 480-wide box matches the mobile plane's aspect almost exactly. */
const NARROW_CLOUDS = {
  left: { x: -70, w: 420, top: 92, r: 150, base: 392, seed: 8741 },
  right: { x: 130, w: 420, top: 116, r: 140, base: 392, seed: 8753 },
  base: { x: -30, w: 540, top: 348, r: 100, base: 392, seed: 8763 },
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
}

function ScriptStrokeLayer({
  word,
  reduced,
  transform,
  stroke,
  strokeWidth,
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
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
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
            delay: 0.95 + index * 0.12,
            ease: 'easeOut',
          }}
        />
      ))}
    </g>
  )
}

function HeadlineSwapRow({
  lead,
  icon,
  word,
  ariaLabel,
  reduced,
  onSwap,
}: {
  lead: string
  icon: string
  word: string
  ariaLabel: string
  reduced: boolean
  onSwap: () => void
}) {
  return (
    <div className={styles.headlineRow}>
      <span className={styles.leadLabel}>{lead}</span>
      <button
        type="button"
        className={styles.swapPill}
        onClick={onSwap}
        aria-label={ariaLabel}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            className={styles.swapPillInner}
            initial={reduced ? false : { y: -12, opacity: 0, rotateX: 35 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={reduced ? undefined : { y: 12, opacity: 0, rotateX: -35 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.pillIcon} aria-hidden>
              {icon}
            </span>
            <span>{word}</span>
          </motion.span>
        </AnimatePresence>
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
  const [madlib, setMadlib] = useState({ craft: 0, taste: 0, products: 0 })

  const physicsActive = physicsOn && !reduced

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

  const cycleMadlib = useCallback((slot: keyof typeof MADLIB_SLOTS) => {
    setMadlib((prev) => ({
      ...prev,
      [slot]: (prev[slot] + 1) % MADLIB_SLOTS[slot].length,
    }))
  }, [])

  const currentCraft = MADLIB_SLOTS.craft[madlib.craft]
  const currentTaste = MADLIB_SLOTS.taste[madlib.taste]
  const currentProduct = MADLIB_SLOTS.products[madlib.products]

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
                <rect x="200" y="44" width="1040" height="820" fill="#1E3EC4" />
                <rect
                  x="200"
                  y="44"
                  width="1040"
                  height="820"
                  fill={`url(#${gridId})`}
                />

                {/* Outer sunburst-yellow arch curtain ring */}
                <path
                  d="M205 45 H1235 V860 H1115 C1115 245 955 92 700 92 C445 92 285 245 285 860 H205 Z"
                  fill="#F7C627"
                  filter={`url(#${shadowFilterId})`}
                />
                {/* Warm-amber arch ring tucked inside the yellow */}
                <path
                  d="M205 45 H1235 V860 H1065 C1065 275 915 118 700 118 C485 118 335 275 335 860 H205 Z"
                  fill="#E89418"
                  filter={`url(#${shadowFilterId})`}
                />
                {/* Thick off-white paper rim framing the blueprint window.
                    Rim and scallops share one filter so the shadow traces a
                    single cut edge instead of stacking two. */}
                <g filter={`url(#${shadowFilterId})`}>
                  <path
                    d="M335 860 C335 275 485 118 700 118 C915 118 1065 275 1065 860 H1017 C1017 300 887 162 700 162 C513 162 383 300 383 860 Z"
                    fill="#FAF9F6"
                  />
                  <ArchScallops points={ARCH_SCALLOPS} r={52} fill="#FAF9F6" />
                </g>

                {/* Warm amber cloud banks shouldering the arch, left & right */}
                <g className={styles.cloudSideBanks}>
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
                </g>

                {/* Pale cloud band sitting inside the window, behind the railing */}
                <CloudBank
                  {...CLOUDS.shelfCream}
                  fill="#F2E3BE"
                  filter={`url(#${shadowFilterId})`}
                />
                <CloudBank
                  {...CLOUDS.shelfWhite}
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
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
                {/* Upper-left & upper-right white clouds framing Aditya.
                    Both close on a rounded underside — a straight chord here
                    reads as a cloud sliced with a ruler. */}
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
                {/* Left mid-wing & right lower-wing white cloud poufs. Their
                    flat sides run past the frame so the cut is never on show. */}
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
                {/* Lower-left sky-blue cloud puff behind white foreground dome */}
                <path
                  d="M188 465 C285 455 338 492 345 545 C395 545 438 585 445 645 H188 Z"
                  fill="#9CC0E6"
                  filter={`url(#${shadowFilterId})`}
                />
                {/* Two-tone cloud sea rolling in front of the shelf, under the railing */}
                <CloudBank
                  {...CLOUDS.seaAmber}
                  fill="#EE9B1B"
                  filter={`url(#${shadowFilterId})`}
                />
                <CloudBank
                  {...CLOUDS.seaGold}
                  fill="#F5C42C"
                  filter={`url(#${shadowFilterId})`}
                />

                {/* Tall narrow stages leave a gap between title and railing —
                    one extra sky-blue bank keeps the window from going empty. */}
                <g className={styles.cloudNarrowOnly}>
                  <CloudBank
                    x={452}
                    w={520}
                    top={436}
                    r={70}
                    base={620}
                    seed={6101}
                    fill="#A7C7E7"
                    filter={`url(#${shadowFilterId})`}
                  />
                </g>
              </g>

              {/* Layer 3: Inner Royal-Blue 3D Rounded Rectangular Proscenium Frame (#2242D6) */}
              <path
                d="M182 860 V72 C182 46 202 28 228 28 H1212 C1238 28 1258 46 1258 72 V860 H1206 V96 C1206 82 1194 72 1180 72 H260 C246 72 234 82 234 96 V860 Z"
                fill="#2242D6"
                filter={`url(#${shadowFilterId})`}
              />
              <path
                d="M184 855 V72 C184 48 203 30 228 30 H1212 C1237 30 1256 48 1256 72 V855"
                fill="none"
                stroke="rgb(250 249 246 / 0.22)"
                strokeWidth="2"
              />

              {/* Top-right white cloud swags over sky-blue mat */}
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
            </svg>
          </motion.div>

          {/* Depth Plane 4: Smiling Paper Sun behind white stage cloud + Balustrade + Bunting + Stars */}
          <motion.div
            className={styles.planeStageProps}
            style={physicsActive ? { x: sunX, y: sunY } : undefined}
          >
            {/* Hanging Star Bunting (Top-Left Corner) */}
            <div className={styles.buntingWrap} aria-hidden>
              <svg viewBox="0 0 420 140" className={styles.buntingSvg}>
                <path
                  d="M0 24 Q190 92 385 0"
                  fill="none"
                  stroke="#FAF9F6"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  filter={`url(#${shadowFilterId})`}
                />
              </svg>
              <div className={styles.buntingStar1}>
                <FivePointStar fill="#F5A623" stroke="none" strokeWidth={0} />
              </div>
              <div className={styles.buntingStar2}>
                <FivePointStar fill="#FAF9F6" stroke="none" strokeWidth={0} />
              </div>
              <div className={styles.buntingStar3}>
                <FivePointStar fill="#F5A623" stroke="none" strokeWidth={0} />
              </div>
              <div className={styles.buntingStar4}>
                <FivePointStar fill="#FFD12E" stroke="none" strokeWidth={0} />
              </div>
            </div>

            {/* Smiling Paper Sun peeking over a white stage cloud */}
            <div className={styles.sunCluster} aria-hidden>
              <div className={styles.sunDisc}>
                <PaperSun className={styles.sunSvg} />
              </div>
              <svg
                viewBox="0 0 380 150"
                className={styles.sunCloudCover}
                focusable="false"
              >
                <path
                  d="M12 118 C8 82 42 58 78 68 C112 28 178 28 212 64 C248 42 298 52 318 86 C352 86 368 112 358 136 C315 146 245 144 185 142 C115 144 45 142 12 118 Z"
                  fill="#EFE0B0"
                  filter={`url(#${shadowFilterId})`}
                />
                <path
                  d="M28 102 C24 72 54 52 86 62 C118 24 182 24 214 58 C246 38 292 48 308 78 C336 80 348 100 338 118 C285 126 225 124 175 122 C115 124 58 120 28 102 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
              </svg>
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

            {/* White Paper Stage Balustrade / Railing behind lower half of Aditya */}
            <div className={styles.balustrade} aria-hidden>
              <div className={styles.balustradeTopRail} />
              <div className={styles.balustradeSpindles}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className={styles.balustradePost} />
                ))}
              </div>
            </div>

            {/* Scattered Cutout Stars + Preserved data-hero-sticker Hooks for About Gravity Pit */}
            <div className={styles.starScatter} aria-hidden>
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

          {/* Depth Plane 5: Elevated 3D Off-White Paper Cutout `Aditya` Main Title */}
          <motion.div
            className={styles.planeTitle}
            style={physicsActive ? { x: titleX, y: titleY } : undefined}
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
                  transform="translate(1.8 2.6) skewX(-9)"
                  stroke="rgb(17 24 39 / 0.34)"
                  strokeWidth={SCRIPT_STROKE + 2.1}
                />
                <ScriptStrokeLayer
                  word={word}
                  reduced={reduced}
                  transform="translate(0.95 1.35) skewX(-9)"
                  stroke="#111827"
                  strokeWidth={SCRIPT_STROKE + 1.85}
                />
                <ScriptStrokeLayer
                  word={word}
                  reduced={reduced}
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

          {/* Upper-Right Stage CTA Pill: Say hi ↗ */}
          <div className={styles.upperRightAction}>
            <button
              type="button"
              className={styles.paperPillBtn}
              onClick={() => scrollToSection('contact', reduced)}
            >
              <span>Say hi</span>
              <ArrowUpRight size={17} strokeWidth={2.3} aria-hidden />
            </button>
          </div>

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
              <CloudBank
                {...FOREGROUND_CLOUDS.amber}
                fill="#F2A22A"
                filter={`url(#${shadowFilterId})`}
              />
              {/* Layer 2 — Soft cream bank (#F5ECCD) */}
              <CloudBank
                {...FOREGROUND_CLOUDS.cream}
                fill="#F0DDB0"
                filter={`url(#${shadowFilterId})`}
              />
              {/* Layer 3 — Bottom-left white bank the headline sits on (#FAF9F6) */}
              <CloudBank
                {...FOREGROUND_CLOUDS.left}
                fill="#FAF9F6"
                filter={`url(#${deepShadowId})`}
              />
              {/* Layer 4 — Bottom-right crisp white bank (#FAF9F6) */}
              <CloudBank
                {...FOREGROUND_CLOUDS.right}
                fill="#FAF9F6"
                filter={`url(#${deepShadowId})`}
              />
              {/* Layer 5 — Cream base ridge closing the bottom edge */}
              <CloudBank
                {...FOREGROUND_CLOUDS.base}
                fill="#F0DDB0"
                filter={`url(#${deepShadowId})`}
              />
            </svg>

            <svg
              viewBox="0 0 480 380"
              preserveAspectRatio="none"
              className={cn(styles.cloudsSvg, styles.cloudsNarrow)}
            >
              <CloudBank
                {...NARROW_CLOUDS.left}
                fill="#FAF9F6"
                filter={`url(#${deepShadowId})`}
              />
              <CloudBank
                {...NARROW_CLOUDS.right}
                fill="#FAF9F6"
                filter={`url(#${deepShadowId})`}
              />
              <CloudBank
                {...NARROW_CLOUDS.base}
                fill="#F0DDB0"
                filter={`url(#${deepShadowId})`}
              />
            </svg>
          </motion.div>

          {/* Depth Plane 7: Foreground Left Typography Stack & Lower-Right CTA */}
          <div className={styles.foregroundContent} data-hero-copy>
            <div className={styles.shell}>
              <div className={styles.foregroundRow}>
                {/* Left-Aligned Typography Stack anchored on white cloud bank */}
                <div
                  id="hero-title"
                  className={styles.headlineStack}
                  role="heading"
                  aria-level={1}
                >
                  <HeadlineSwapRow
                    lead="I BRING"
                    icon={currentCraft.icon}
                    word={currentCraft.word}
                    ariaLabel={`Current craft focus: ${currentCraft.word}. Click to swap`}
                    reduced={reduced}
                    onSwap={() => cycleMadlib('craft')}
                  />
                  <HeadlineSwapRow
                    lead="&"
                    icon={currentTaste.icon}
                    word={currentTaste.word}
                    ariaLabel={`Current craft dimension: ${currentTaste.word}. Click to swap`}
                    reduced={reduced}
                    onSwap={() => cycleMadlib('taste')}
                  />
                  <HeadlineSwapRow
                    lead="TO"
                    icon={currentProduct.icon}
                    word={currentProduct.word}
                    ariaLabel={`Current work domain: ${currentProduct.word}. Click to swap`}
                    reduced={reduced}
                    onSwap={() => cycleMadlib('products')}
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
