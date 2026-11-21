'use client'

import { ArrowRight, Hand } from 'lucide-react'
import { Circle, Diamond, Sparkles, Sun } from 'kubai-icons-react'
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
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

import { scrollToSection } from '../studio-data'
import styles from './hero.module.css'

export type HeroSurface = 'cobalt' | 'sky' | 'paper'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

/* ── The marker wordmark ──────────────────────────────────────────────────
   The site's single-stroke marker alphabet, laid out as one word. */

const SCRIPT_STROKE = 3.45
const SCRIPT_SLANT = 0.1584

const SCRIPT_A_CAPITAL: [number, string, string?] = [
  15.2,
  'M1.5 -1C3 -3.8 5.6 -11.5 8.4 -19C9 -19.6 9.4 -19.6 9.8 -19C11.6 -12 13 -5.5 13.8 -1C14.1 -0.2 14.6 -0.6 15.2 -1',
  'M4.6 -8.2C7.2 -8.5 10.2 -8.5 12.8 -8.2',
]

const SCRIPT_A_TAIL: [number, string] = [
  13.2,
  'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 -3C7.8 -0.6 8.6 0.2 10.2 0.2C11.8 0.2 13.5 -0.2 14.8 -1C15.8 -1.5 16.8 -2 17.5 -2.6',
]

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

/* The three headline pills. The first row's icons are Kubai icons that act
   themselves out on every word change (controlled `hover`, `trigger="none"`);
   the others keep their text glyphs. */
const CRAFT_ICONS = [
  { Icon: Sparkles, color: '#3d53d6', word: 'SYSTEMS' },
  { Icon: Sun, color: '#ff6a2b', word: 'CRAFT' },
  { Icon: Circle, color: '#ff6a2b', word: 'WARMTH' },
  { Icon: Diamond, color: '#3d53d6', word: 'CLARITY' },
] as const

const MADLIB_SLOTS = {
  craft: CRAFT_ICONS,
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

const PAPER_EASE = [0.22, 1, 0.36, 1] as const

/* ── Two scenes, one number ───────────────────────────────────────────────
   The hero opens on a TECHNIC drafting table: a blueprint grid, gears, a
   protractor, a compass and a dial, all in Sunnyside paper. The pull tab
   runs `t` from 0 to 1. The technic pieces fold away, an iris opens from the
   right edge, and a PAPER TOWN builds itself inside it. Both directions are
   the same scrub, so a drag shows exactly what a click plays. */

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

const vars = (values: Record<string, string | number>) =>
  values as CSSProperties

const INK = '#191a2e'
const PAPER = '#fffaf1'
const PAPER_LO = '#f3ecdf'
const COBALT = '#3d53d6'
const COBALT_INK = '#2c3cae'
const TANGERINE = '#ff6a2b'
const BUTTER = '#ffd23f'
const PINK = '#ffb6e1'
const MINT = '#b7e4c7'
const MINT_DEEP = '#7fcf9d'
const GREEN = '#58b98a'
const SKY = '#a9c8ff'

const SOFT = 'sunnyside-hero-soft'
const SOFT_S = 'sunnyside-hero-soft-s'
const GRID = 'sunnyside-hero-grid'

/** Fades and moves a technic piece away as `t` passes its own threshold. */
function Out({
  at = 0,
  dx = 0,
  dy = 0,
  rot = 0,
  filter = SOFT,
  children,
}: {
  at?: number
  dx?: number
  dy?: number
  rot?: number
  filter?: string | null
  children: ReactNode
}) {
  return (
    <g
      className={styles.exitA}
      style={vars({
        '--at': at,
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
        '--rot': `${rot}deg`,
      })}
      filter={filter ? `url(#${filter})` : undefined}
    >
      {children}
    </g>
  )
}

/** Raises a town piece out of the ground as `t` passes its threshold. Pieces
 *  on the right arrive first, because the iris opens from the right. */
function In({
  x = 720,
  at,
  dy = 110,
  filter = SOFT,
  children,
}: {
  x?: number
  at?: number
  dy?: number
  filter?: string | null
  children: ReactNode
}) {
  const when = at ?? round(0.2 + (1 - x / 1440) * 0.55)
  return (
    <g
      className={styles.enterB}
      style={vars({ '--at': when, '--dy': `${dy}px` })}
      filter={filter ? `url(#${filter})` : undefined}
    >
      {children}
    </g>
  )
}

/** The first-load entrance for a piece: a CSS keyframe, kept off the element
 *  the pull moves so the two never fight over one property. */
function Enter({
  kind,
  delay,
  fx = 0,
  fy = 0,
  r0 = 0,
  children,
}: {
  kind: 'fly' | 'spinIn' | 'sweep' | 'scalePop' | 'draw' | 'fade' | 'open'
  delay: number
  fx?: number
  fy?: number
  r0?: number
  children: ReactNode
}) {
  return (
    <g
      className={styles[kind]}
      style={vars({
        '--d': `${delay}s`,
        '--fx': `${fx}px`,
        '--fy': `${fy}px`,
        '--r0': `${r0}deg`,
      })}
    >
      {children}
    </g>
  )
}

/* ── Technic parts ────────────────────────────────────────────────────── */

function gearPath(outer: number, root: number, teeth: number) {
  const step = (Math.PI * 2) / teeth
  const at = (angle: number, radius: number) =>
    `${round(Math.cos(angle) * radius)} ${round(Math.sin(angle) * radius)}`
  let d = ''
  for (let i = 0; i < teeth; i += 1) {
    const a = i * step - Math.PI / 2
    d += `${i === 0 ? 'M' : 'L'}${at(a - step * 0.3, root)} L${at(a - step * 0.17, outer)} L${at(a + step * 0.17, outer)} L${at(a + step * 0.3, root)} A${root} ${root} 0 0 1 ${at(a + step - step * 0.3, root)} `
  }
  return `${d}Z`
}

type GearSpec = {
  x: number
  y: number
  r: number
  teeth: number
  fill: string
  dir: 1 | -1
  dur: number
  delay: number
  at: number
  dx: number
  dy: number
}

const GEARS: readonly GearSpec[] = [
  {
    x: 168,
    y: 150,
    r: 74,
    teeth: 14,
    fill: MINT,
    dir: 1,
    dur: 40,
    delay: 0.55,
    at: 0.02,
    dx: -260,
    dy: -200,
  },
  {
    x: 274,
    y: 84,
    r: 44,
    teeth: 9,
    fill: BUTTER,
    dir: -1,
    dur: 26,
    delay: 0.68,
    at: 0.06,
    dx: -80,
    dy: -260,
  },
  {
    x: 72,
    y: 262,
    r: 40,
    teeth: 8,
    fill: PINK,
    dir: -1,
    dur: 24,
    delay: 0.8,
    at: 0.1,
    dx: -260,
    dy: 60,
  },
  {
    x: 1118,
    y: 92,
    r: 48,
    teeth: 10,
    fill: MINT,
    dir: 1,
    dur: 32,
    delay: 0.92,
    at: 0.04,
    dx: 120,
    dy: -260,
  },
  {
    x: 1204,
    y: 158,
    r: 32,
    teeth: 7,
    fill: BUTTER,
    dir: -1,
    dur: 20,
    delay: 1.02,
    at: 0.08,
    dx: 260,
    dy: -120,
  },
]

function Gear({ spec }: { spec: GearSpec }) {
  const d = useMemo(
    () => gearPath(spec.r, spec.r * 0.8, spec.teeth),
    [spec.r, spec.teeth],
  )
  return (
    <g transform={`translate(${spec.x} ${spec.y})`}>
      <Out at={spec.at} dx={spec.dx} dy={spec.dy} rot={spec.dir * 140}>
        <Enter kind="spinIn" delay={spec.delay}>
          <g
            className={spec.dir > 0 ? styles.spinCw : styles.spinCcw}
            style={vars({ '--dur': `${spec.dur}s` })}
          >
            <circle r={spec.r} fill="none" />
            <path d={d} fill={spec.fill} />
            <circle r={spec.r * 0.56} fill="rgb(255 250 241 / 0.55)" />
            <circle r={spec.r * 0.2} fill={INK} opacity={0.82} />
          </g>
        </Enter>
      </Out>
    </g>
  )
}

/** A half-ring protractor, flat edge on y = 0, hub at the origin. */
function Protractor({
  radius,
  inner,
  fill,
}: {
  radius: number
  inner: number
  fill: string
}) {
  const ticks = useMemo(
    () =>
      Array.from({ length: 37 }, (_, i) => {
        const deg = i * 5
        const a = (deg * Math.PI) / 180
        const len = deg % 10 === 0 ? 24 : 14
        const r1 = radius - 6
        const r2 = radius - 6 - len
        return {
          key: deg,
          x1: round(-Math.cos(a) * r1),
          y1: round(-Math.sin(a) * r1),
          x2: round(-Math.cos(a) * r2),
          y2: round(-Math.sin(a) * r2),
        }
      }),
    [radius],
  )
  return (
    <g>
      <path
        d={`M${-radius} 0 A${radius} ${radius} 0 0 1 ${radius} 0 L${inner} 0 A${inner} ${inner} 0 0 0 ${-inner} 0 Z`}
        fill={fill}
      />
      <rect
        x={-radius}
        y={0}
        width={radius * 2}
        height={24}
        rx={6}
        fill={fill}
      />
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={INK}
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
      <circle cy={12} r={5} fill={INK} opacity={0.5} />
    </g>
  )
}

function Compass() {
  return (
    <g>
      <g className={styles.pivot}>
        <Enter kind="open" delay={1.05} r0={34}>
          <path
            d="M-6 -2 L6 -2 L-58 188 L-70 188 Z"
            fill={PAPER_LO}
            stroke={INK}
            strokeOpacity={0.5}
            strokeWidth={1.5}
          />
          <path d="M-70 188 L-58 188 L-64 214 Z" fill={INK} />
        </Enter>
      </g>
      <g className={styles.pivot}>
        <Enter kind="open" delay={1.05} r0={-34}>
          <path
            d="M-6 -2 L6 -2 L72 182 L60 182 Z"
            fill={PAPER_LO}
            stroke={INK}
            strokeOpacity={0.5}
            strokeWidth={1.5}
          />
          <rect x={58} y={176} width={16} height={26} rx={2} fill={BUTTER} />
          <path d="M58 202 L74 202 L66 216 Z" fill={INK} />
        </Enter>
      </g>
      <rect x={-7} y={-52} width={14} height={40} rx={7} fill={TANGERINE} />
      <circle r={17} fill={TANGERINE} />
      <circle r={7} fill={PAPER} />
    </g>
  )
}

function Dial() {
  const ticks = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2
        const len = i % 4 === 0 ? 12 : 6
        return {
          key: i,
          x1: round(Math.cos(a) * 112),
          y1: round(Math.sin(a) * 112),
          x2: round(Math.cos(a) * (112 + len)),
          y2: round(Math.sin(a) * (112 + len)),
        }
      }),
    [],
  )
  return (
    <g>
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={COBALT_INK}
          strokeOpacity={0.6}
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
      <circle r={96} fill={TANGERINE} />
      <circle r={70} fill={PAPER} />
      <circle r={48} fill={COBALT} />
      <circle r={30} fill={BUTTER} />
      <g className={styles.spinCw} style={vars({ '--dur': '14s' })}>
        <circle r={60} fill="none" />
        <path
          d="M0 0 L0 -58"
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cy={-58} r={6} fill={TANGERINE} />
      </g>
      <circle r={9} fill={INK} />
    </g>
  )
}

function Ruler() {
  return (
    <g>
      <rect width={250} height={40} rx={6} fill={PAPER} />
      {Array.from({ length: 26 }, (_, i) => (
        <line
          key={i}
          x1={10 + i * 9.2}
          x2={10 + i * 9.2}
          y1={0}
          y2={i % 5 === 0 ? 20 : 11}
          stroke={INK}
          strokeOpacity={0.55}
          strokeWidth={1.8}
        />
      ))}
    </g>
  )
}

/* ── Town parts ───────────────────────────────────────────────────────── */

const CLOUD_LOBES = {
  left: [
    { cx: 150, cy: 168, r: 26 },
    { cx: 190, cy: 150, r: 38 },
    { cx: 240, cy: 160, r: 30 },
    { cx: 274, cy: 174, r: 20 },
  ],
  mid: [
    { cx: 520, cy: 270, r: 20 },
    { cx: 552, cy: 254, r: 30 },
    { cx: 592, cy: 266, r: 22 },
  ],
  right: [
    { cx: 1230, cy: 338, r: 22 },
    { cx: 1264, cy: 320, r: 32 },
    { cx: 1308, cy: 332, r: 24 },
  ],
} as const

type Lobe = { cx: number; cy: number; r: number }

/** A cloud as one outline: arcs over each lobe, valley to valley, flat base. */
function cloudPath(lobes: readonly Lobe[], baseY: number) {
  const valley = (a: Lobe, b: Lobe) => {
    const d = Math.hypot(b.cx - a.cx, b.cy - a.cy)
    if (d === 0 || d >= a.r + b.r) return undefined
    const along = (a.r * a.r - b.r * b.r + d * d) / (2 * d)
    const half = Math.sqrt(Math.max(0, a.r * a.r - along * along))
    const ux = (b.cx - a.cx) / d
    const uy = (b.cy - a.cy) / d
    const y = a.cy + uy * along + Math.abs(ux) * half
    const dy = y - a.cy
    const dx = Math.sqrt(Math.max(0, a.r * a.r - dy * dy))
    return { x: a.cx + Math.sign(b.cx - a.cx) * dx, y }
  }
  const angleOf = (lobe: Lobe, p: { x: number; y: number }) =>
    Math.atan2(p.y - lobe.cy, p.x - lobe.cx)

  const first = lobes[0]
  const last = lobes[lobes.length - 1]
  const start = { x: first.cx - first.r, y: first.cy }
  let d = `M ${round(start.x)} ${round(start.y)}`
  let cursor = start
  for (let i = 0; i < lobes.length; i += 1) {
    const lobe = lobes[i]
    const next = lobes[i + 1]
    const end = (next && valley(lobe, next)) ?? {
      x: lobe.cx + lobe.r,
      y: lobe.cy,
    }
    const swept =
      (angleOf(lobe, end) - angleOf(lobe, cursor) + Math.PI * 2) % (Math.PI * 2)
    d += ` A ${round(lobe.r)} ${round(lobe.r)} 0 ${swept > Math.PI ? 1 : 0} 1 ${round(end.x)} ${round(end.y)}`
    cursor = end
  }
  d += ` L ${round(last.cx + last.r)} ${round(baseY)} L ${round(start.x)} ${round(baseY)} Z`
  return d
}

function TownCloud({
  lobes,
  base,
  x,
  amp,
  dur,
}: {
  lobes: readonly Lobe[]
  base: number
  x: number
  amp: number
  dur: number
}) {
  const d = useMemo(() => cloudPath(lobes, base), [lobes, base])
  return (
    <In x={x} dy={-60}>
      <g
        className={styles.drift}
        style={vars({ '--amp': `${amp}px`, '--dur': `${dur}s` })}
      >
        <path d={d} fill={PAPER} />
      </g>
    </In>
  )
}

function Cottage({
  x,
  y,
  w,
  h,
  wall,
  roof,
}: {
  x: number
  y: number
  w: number
  h: number
  wall: string
  roof: string
}) {
  const roofH = Math.round(w * 0.5)
  const pane = round(w * 0.2)
  return (
    <In x={x} dy={90} filter={SOFT_S}>
      <g transform={`translate(${x} ${y})`}>
        <rect x={-w / 2} y={-h} width={w} height={h} fill={wall} />
        <path
          d={`M${-w / 2 - 7} ${-h} L0 ${-h - roofH} L${w / 2 + 7} ${-h} Z`}
          fill={roof}
        />
        <rect
          x={round(-w * 0.34)}
          y={round(-h * 0.7)}
          width={pane}
          height={pane}
          rx={2}
          fill={COBALT}
        />
        <rect
          x={round(w * 0.14)}
          y={round(-h * 0.7)}
          width={pane}
          height={pane}
          rx={2}
          fill={COBALT}
        />
        <rect
          x={round(-w * 0.11)}
          y={round(-h * 0.36)}
          width={round(w * 0.22)}
          height={round(h * 0.36)}
          rx={2}
          fill={TANGERINE}
        />
      </g>
    </In>
  )
}

function Lolly({
  x,
  y,
  s,
  fill,
}: {
  x: number
  y: number
  s: number
  fill: string
}) {
  return (
    <In x={x} dy={80} filter={SOFT_S}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-5} y={-36} width={10} height={36} fill="#c9692f" />
        <circle cy={-60} r={28} fill={fill} />
        <circle cx={-9} cy={-70} r={7} fill="rgb(255 250 241 / 0.4)" />
      </g>
    </In>
  )
}

function Pine({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <In x={x} dy={80} filter={SOFT_S}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-4} y={-14} width={8} height={14} fill="#c9692f" />
        <path d="M0 -92 L26 -48 H-26 Z" fill="#3ea06f" />
        <path d="M0 -70 L32 -22 H-32 Z" fill={GREEN} />
      </g>
    </In>
  )
}

function Turbine({
  x,
  y,
  h,
  dur,
}: {
  x: number
  y: number
  h: number
  dur: number
}) {
  return (
    <In x={x} dy={120} filter={SOFT_S}>
      <g transform={`translate(${x} ${y})`}>
        <path d={`M-6 0 L-2.5 ${-h} L2.5 ${-h} L6 0 Z`} fill={PAPER} />
        <g transform={`translate(0 ${-h})`}>
          <g className={styles.spinCw} style={vars({ '--dur': `${dur}s` })}>
            <circle r={68} fill="none" />
            {[0, 120, 240].map((deg) => (
              <path
                key={deg}
                d="M0 0 C7 -12 7 -48 0 -66 C-7 -48 -7 -12 0 0 Z"
                fill={PAPER}
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r={8} fill={BUTTER} />
          </g>
        </g>
      </g>
    </In>
  )
}

function Car({
  x,
  y,
  color,
  amp,
  dur,
}: {
  x: number
  y: number
  color: string
  amp: number
  dur: number
}) {
  return (
    <In x={x} dy={60} filter={SOFT_S}>
      <g transform={`translate(${x} ${y})`}>
        <g
          className={styles.drive}
          style={vars({ '--amp': `${amp}px`, '--dur': `${dur}s` })}
        >
          <path
            d="M-40 0 V-14 Q-40 -22 -30 -22 H-20 L-9 -40 H22 L33 -22 H42 Q50 -22 50 -14 V0 Z"
            fill={color}
          />
          <path d="M-5 -34 H8 V-22 H-13 Z" fill={SKY} />
          <path d="M12 -34 H20 L27 -22 H12 Z" fill={SKY} />
          <circle cx={-22} cy={0} r={10} fill={INK} />
          <circle cx={30} cy={0} r={10} fill={INK} />
          <circle cx={-22} cy={0} r={4} fill={PAPER} />
          <circle cx={30} cy={0} r={4} fill={PAPER} />
        </g>
      </g>
    </In>
  )
}

/* ── Headline pills ───────────────────────────────────────────────────── */

type ScriptLayerProps = {
  word: ScriptWord
  reduced: boolean
  transform: string
  stroke: string
  strokeWidth: number
  delay?: number
  opacity?: number
}

function ScriptStrokeLayer({
  word,
  reduced,
  transform,
  stroke,
  strokeWidth,
  delay = 0,
  opacity = 1,
}: ScriptLayerProps) {
  return (
    <g transform={transform} opacity={opacity}>
      <motion.path
        d={word.main}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.05, delay, ease: PAPER_EASE }}
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
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
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

type PillIcon = (typeof CRAFT_ICONS)[number]

/** A row's item is either a Kubai icon reference or a plain text glyph. */
type KubaiItem = { Icon: PillIcon['Icon']; color: string; word: string }
type GlyphItem = { icon: string; word: string }
type PillItem = KubaiItem | GlyphItem

function hasIcon(it: PillItem): it is KubaiItem {
  return 'Icon' in it
}

/**
 * One white pill of the headline: a lead word, an icon and the word that
 * changes. The pill holds its width behind an invisible sizer, so a swap never
 * reflows its neighbours; the retiring word leaves through the top edge while
 * the next rises from below.
 */
function SwapPill({
  lead,
  items,
  index,
  reduced,
  onAdvance,
  onHoverChange,
}: {
  lead: string
  items: readonly PillItem[]
  index: number
  reduced: boolean
  onAdvance: () => void
  onHoverChange: (hovering: boolean) => void
}) {
  const current = items[index % items.length]
  const widest = items.reduce((a, b) => (b.word.length > a.word.length ? b : a))

  const [acting, setActing] = useState(false)
  useEffect(() => {
    if (reduced) return
    // Scheduled rather than set in the effect body — one frame nobody can see,
    // and the compiler lint stays happy. Same trick as use-in-view.
    const frame = requestAnimationFrame(() => setActing(true))
    const timer = window.setTimeout(() => setActing(false), 1200)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [current.word, reduced])

  const renderIcon = (it: PillItem, animated: boolean) =>
    hasIcon(it) ? (
      <it.Icon
        size="1em"
        color={it.color}
        trigger="none"
        hover={animated ? acting : undefined}
      />
    ) : (
      it.icon
    )

  return (
    <button
      type="button"
      className={styles.pill}
      onClick={onAdvance}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      aria-label={`${lead} ${current.word}. Choose the next word`}
    >
      <span className={styles.pillLead}>{lead}</span>
      <span className={styles.pillBody}>
        <span className={styles.swapSizer} aria-hidden>
          <span className={styles.pillIcon}>{renderIcon(widest, false)}</span>
          <span>{widest.word}</span>
        </span>
        <span className={styles.swapWindow} aria-hidden>
          <AnimatePresence initial={false}>
            <motion.span
              key={current.word}
              className={styles.swapInner}
              initial={reduced ? false : { y: '100%' }}
              animate={{ y: '0%' }}
              exit={reduced ? undefined : { y: '-100%' }}
              transition={{ duration: 0.42, ease: PAPER_EASE }}
            >
              <span className={styles.pillIcon}>
                {renderIcon(current, true)}
              </span>
              <span>{current.word}</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </button>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

const PULL_RANGE = 56

/**
 * Sunnyside Diorama Hero.
 *
 * Opens on a technic drafting table and, on the pull, builds a paper town.
 * Both scenes are layers of cut paper with soft shadows; one number (`--t`)
 * runs between them, so the vertical pull pill on the right can be clicked,
 * keyed or dragged, and the scene follows the finger.
 */
export function Hero({ surface = 'cobalt' }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  const [act, setAct] = useState<'technic' | 'town'>('technic')
  const [physicsOn, setPhysicsOn] = useState(true)
  const [writeKey, setWriteKey] = useState(0)
  const [phrase, setPhrase] = useState(0)
  const [phraseHeld, setPhraseHeld] = useState(false)
  const physicsActive = physicsOn && !reduced

  // ── The pull ──────────────────────────────────────────────────────────
  const progress = useMotionValue(0)
  const tween = useRef<ReturnType<typeof animate> | null>(null)
  const actRef = useRef<'technic' | 'town'>('technic')

  useMotionValueEvent(progress, 'change', (t) => {
    stageRef.current?.style.setProperty('--t', t.toFixed(4))
  })

  const goTo = useCallback(
    (to: 0 | 1) => {
      tween.current?.stop()
      const next = to === 1 ? 'town' : 'technic'
      actRef.current = next
      setAct(next)
      if (reduced) {
        progress.set(to)
        return
      }
      tween.current = animate(progress, to, {
        type: 'spring',
        stiffness: 52,
        damping: 14,
        restDelta: 0.0008,
        restSpeed: 0.004,
      })
    },
    [progress, reduced],
  )

  useEffect(() => () => tween.current?.stop(), [])

  const dragRef = useRef<{
    startY: number
    startT: number
    moved: boolean
  } | null>(null)
  const swallowClick = useRef(false)

  const toggle = useCallback(
    () => goTo(actRef.current === 'technic' ? 1 : 0),
    [goTo],
  )

  const onPillDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    tween.current?.stop()
    dragRef.current = {
      startY: event.clientY,
      startT: progress.get(),
      moved: false,
    }
  }

  const onPillMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.abs(dy) < 5) return
    drag.moved = true
    progress.set(clamp(drag.startT + dy / PULL_RANGE, 0, 1))
  }

  const onPillUp = () => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return
    swallowClick.current = true
    if (drag.moved) goTo(progress.get() >= 0.5 ? 1 : 0)
    else toggle()
  }

  const onPillClick = () => {
    // A pointer press already toggled on release; this is the keyboard path.
    if (swallowClick.current) {
      swallowClick.current = false
      return
    }
    toggle()
  }

  const onPillKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      goTo(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      goTo(0)
    }
  }

  // ── Pointer and scroll parallax ───────────────────────────────────────
  const pointerX = useSpring(0, { stiffness: 90, damping: 20, mass: 0.7 })
  const pointerY = useSpring(0, { stiffness: 90, damping: 20, mass: 0.7 })
  useMotionValueEvent(pointerX, 'change', (v) =>
    stageRef.current?.style.setProperty('--px', v.toFixed(3)),
  )
  useMotionValueEvent(pointerY, 'change', (v) =>
    stageRef.current?.style.setProperty('--py', v.toFixed(3)),
  )

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!physicsActive || event.pointerType !== 'mouse') return
      const rect = event.currentTarget.getBoundingClientRect()
      pointerX.set(
        clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      )
      pointerY.set(
        clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
      )
    },
    [physicsActive, pointerX, pointerY],
  )

  const handleLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  // Scrolling away lets the layers separate; the far ones lag the page. The
  // same observer idles the ambient loops while the hero is off-screen.
  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    let frame = 0
    const write = () => {
      frame = 0
      const sy = clamp(window.scrollY / Math.max(1, section.offsetHeight), 0, 1)
      stage.style.setProperty('--sy', physicsActive ? sy.toFixed(3) : '0')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write)
    }

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            stage.dataset.idle = String(!entry.isIntersecting)
          })
    observer?.observe(section)

    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [physicsActive])

  const togglePhysics = useCallback(() => {
    setPhysicsOn((prev) => {
      if (prev) {
        pointerX.set(0)
        pointerY.set(0)
      }
      return !prev
    })
  }, [pointerX, pointerY])

  // ── Title ─────────────────────────────────────────────────────────────
  const word = useMemo(() => layoutAdityaWord(), [])
  const scriptBox = useMemo(() => {
    const pad = SCRIPT_STROKE / 2 + 4.6
    const vbX = -1.8 - pad
    const vbY = word.top - pad
    const vbW =
      Math.max(word.width, 1) + 4.8 + pad * 2 - word.top * SCRIPT_SLANT
    const vbH = word.bottom + pad - vbY + 3.2
    return [vbX, vbY, vbW, vbH].map(round).join(' ')
  }, [word])

  const replayWrite = useCallback(() => setWriteKey((k) => k + 1), [])

  // ── The headline writes itself ────────────────────────────────────────
  // All three pills turn over on one beat. It holds whenever a visitor takes
  // over — pointer over the row, focus in it, the tab hidden, the hero
  // scrolled past — and never starts under reduced motion.
  const advancePhrase = useCallback(() => setPhrase((p) => p + 1), [])
  const holdPhrase = useCallback((held: boolean) => setPhraseHeld(held), [])

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
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <MotionConfig reducedMotion="user">
        {/* Left edge tab: parallax on / off */}
        <button
          type="button"
          className={styles.physicsTab}
          aria-pressed={physicsOn}
          onClick={togglePhysics}
        >
          <span className={styles.physicsLabel}>physics on/off</span>
        </button>

        <div ref={stageRef} className={styles.box} data-act={act}>
          <span className={styles.figure} aria-hidden>
            {act === 'technic' ? 'Fig. 01 — Technic' : 'Fig. 02 — Paper town'}
          </span>

          <div className={styles.window}>
            {/* ── Technic: the drafting table ─────────────────────────── */}
            <div className={cn(styles.layer, styles.sceneA)}>
              <svg
                className={styles.svg}
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
                focusable="false"
              >
                <defs>
                  <filter
                    id={SOFT}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="150%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="8"
                      stdDeviation="7"
                      floodColor="#091232"
                      floodOpacity="0.3"
                    />
                  </filter>
                  <filter
                    id={SOFT_S}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="150%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="3.5"
                      floodColor="#091232"
                      floodOpacity="0.3"
                    />
                  </filter>
                  <pattern
                    id={GRID}
                    width="48"
                    height="48"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M48 0H0V48"
                      fill="none"
                      stroke={COBALT}
                      strokeOpacity="0.2"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M12 0V48M24 0V48M36 0V48M0 12H48M0 24H48M0 36H48"
                      fill="none"
                      stroke={COBALT}
                      strokeOpacity="0.07"
                      strokeWidth="0.8"
                    />
                  </pattern>
                </defs>

                <g className={styles.px} style={vars({ '--depth': 0.1 })}>
                  <rect
                    x={-80}
                    y={-80}
                    width={1600}
                    height={960}
                    fill={PAPER_LO}
                  />
                  <Enter kind="fade" delay={0.1}>
                    <rect
                      x={-80}
                      y={-80}
                      width={1600}
                      height={960}
                      fill={`url(#${GRID})`}
                    />
                  </Enter>
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.25 })}>
                  <Out at={0.04} dx={-620} dy={0} rot={0}>
                    <Enter kind="fly" delay={0.15} fx={-640}>
                      <path
                        d="M-80 -80 H800 L470 880 H-80 Z"
                        fill={TANGERINE}
                      />
                      <path
                        d="M-80 -80 H800 L470 880 H-80 Z"
                        fill={`url(#${GRID})`}
                        opacity={0.6}
                      />
                    </Enter>
                  </Out>
                  <Out at={0.12} dx={420} dy={260} rot={0}>
                    <Enter kind="fly" delay={0.3} fy={320}>
                      <rect
                        x={1010}
                        y={500}
                        width={470}
                        height={330}
                        rx={46}
                        fill={MINT}
                      />
                    </Enter>
                  </Out>
                </g>

                {/* Blueprint construction lines through the title. */}
                <g className={styles.px} style={vars({ '--depth': 0.3 })}>
                  <Out at={0.02} filter={null}>
                    <Enter kind="fade" delay={1.1}>
                      <g
                        fill="none"
                        stroke={COBALT}
                        strokeOpacity={0.5}
                        strokeWidth={2}
                        strokeDasharray="10 9"
                      >
                        <circle cx={720} cy={400} r={250} />
                        <path d="M420 400 H1020 M720 120 V680" />
                      </g>
                    </Enter>
                  </Out>
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.5 })}>
                  {GEARS.map((spec) => (
                    <Gear key={`${spec.x}-${spec.y}`} spec={spec} />
                  ))}
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.6 })}>
                  <g transform="translate(230 700) rotate(-26)">
                    <Out at={0.1} dx={-420} dy={120} rot={-30}>
                      <Enter kind="sweep" delay={0.75}>
                        <Protractor radius={200} inner={118} fill={BUTTER} />
                      </Enter>
                    </Out>
                  </g>
                  <g transform="translate(1330 70) rotate(58)">
                    <Out at={0.08} dx={420} dy={-160} rot={36}>
                      <Enter kind="sweep" delay={0.85}>
                        <Protractor radius={190} inner={132} fill={TANGERINE} />
                      </Enter>
                    </Out>
                  </g>
                  <g transform="translate(970 280)">
                    <Out at={0.14} dx={0} dy={-480} rot={0}>
                      <Compass />
                    </Out>
                  </g>
                </g>

                {/* Wires and sketch lines draw themselves. */}
                <g className={styles.px} style={vars({ '--depth': 0.7 })}>
                  <Out at={0.1} filter={null}>
                    <g fill="none" strokeLinecap="round" strokeWidth={7}>
                      <Enter kind="draw" delay={1.15}>
                        <path
                          d="M420 668 C520 612 600 724 720 690 S900 640 960 704"
                          stroke={MINT_DEEP}
                          pathLength={1}
                        />
                      </Enter>
                      <Enter kind="draw" delay={1.3}>
                        <path
                          d="M400 700 C500 668 640 760 760 722 S920 690 1000 736"
                          stroke={PINK}
                          pathLength={1}
                        />
                      </Enter>
                    </g>
                    <circle cx={420} cy={668} r={9} fill={PAPER} />
                    <circle cx={960} cy={704} r={9} fill={PAPER} />
                  </Out>
                  <g transform="translate(420 748)">
                    <Out at={0.16} dx={-260} dy={200} rot={0}>
                      <Enter kind="fly" delay={1.3} fy={160}>
                        <Ruler />
                      </Enter>
                    </Out>
                  </g>
                  <g transform="translate(1240 650)">
                    <Out at={0.18} dx={260} dy={260} rot={40}>
                      <Enter kind="scalePop" delay={1.2}>
                        <Dial />
                      </Enter>
                    </Out>
                  </g>
                </g>
              </svg>
            </div>

            {/* ── Paper town: opens in an iris from the pull side ─────── */}
            <div className={cn(styles.layer, styles.sceneB)}>
              <svg
                className={styles.svg}
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
                focusable="false"
              >
                <g className={styles.px} style={vars({ '--depth': 0.1 })}>
                  <rect
                    x={-80}
                    y={-80}
                    width={1600}
                    height={960}
                    fill={COBALT}
                  />
                  <rect
                    x={-80}
                    y={-80}
                    width={1600}
                    height={960}
                    fill={`url(#${GRID})`}
                    opacity={0.5}
                  />
                </g>

                {/* The sun arch, with its stitched tick ring. */}
                <g className={styles.px} style={vars({ '--depth': 0.2 })}>
                  <g transform="translate(720 660)">
                    <In at={0.3} dy={200}>
                      <circle r={360} fill={BUTTER} />
                      <circle r={326} fill="#ffe27a" />
                      <circle r={262} fill={BUTTER} />
                      <circle r={150} fill="#fff1b8" />
                      <g className={styles.spinSlow}>
                        <circle
                          r={344}
                          fill="none"
                          stroke={TANGERINE}
                          strokeOpacity={0.55}
                          strokeWidth={7}
                          strokeDasharray="2 11"
                        />
                      </g>
                    </In>
                  </g>
                  {[
                    [330, 170],
                    [1290, 120],
                  ].map(([x, y]) => (
                    <In key={x} x={x} dy={-120} filter={SOFT_S}>
                      <path
                        d={`M${x} ${y - 20} l6 14 15 1 -11 10 4 15 -14 -8 -14 8 4 -15 -11 -10 15 -1 z`}
                        fill={BUTTER}
                      />
                    </In>
                  ))}
                  <In x={360} dy={-140} filter={SOFT_S}>
                    <path
                      d="M360 224 l24 -14 24 14 v28 l-24 14 -24 -14 z"
                      fill={PINK}
                    />
                  </In>
                  <In x={250} dy={-120} filter={SOFT_S}>
                    <circle
                      cx={250}
                      cy={330}
                      r={26}
                      fill="none"
                      stroke={MINT}
                      strokeWidth={13}
                    />
                  </In>
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.35 })}>
                  <TownCloud
                    lobes={CLOUD_LOBES.left}
                    base={186}
                    x={210}
                    amp={20}
                    dur={34}
                  />
                  <TownCloud
                    lobes={CLOUD_LOBES.mid}
                    base={286}
                    x={560}
                    amp={16}
                    dur={29}
                  />
                  <TownCloud
                    lobes={CLOUD_LOBES.right}
                    base={354}
                    x={1270}
                    amp={22}
                    dur={38}
                  />
                  {/* Solar panel on its post */}
                  <In x={1120} dy={130} filter={SOFT_S}>
                    <rect
                      x={1114}
                      y={262}
                      width={12}
                      height={150}
                      fill={PAPER}
                    />
                    <path
                      d="M1030 250 L1180 218 L1220 296 L1070 330 Z"
                      fill={COBALT_INK}
                    />
                    <path
                      d="M1050 246 L1200 214 M1058 262 L1208 230 M1066 278 L1216 246 M1074 294 L1224 262 M1080 240 L1118 322 M1112 232 L1150 314 M1144 224 L1182 306"
                      stroke={SKY}
                      strokeOpacity={0.7}
                      strokeWidth={1.8}
                    />
                  </In>
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.5 })}>
                  <In x={140} dy={160}>
                    <path
                      d="M-40 640 L100 470 L160 530 L240 444 L380 640 Z"
                      fill="#8fd0b0"
                    />
                    <path
                      d="M100 470 L72 504 L100 496 L124 510 Z M240 444 L216 478 L240 470 L262 484 Z"
                      fill={PAPER}
                    />
                  </In>
                  <In x={1290} dy={160}>
                    <path
                      d="M1060 640 L1200 450 L1264 520 L1336 430 L1480 640 Z"
                      fill="#8fd0b0"
                    />
                    <path
                      d="M1200 450 L1176 486 L1200 478 L1224 492 Z M1336 430 L1312 466 L1336 458 L1360 472 Z"
                      fill={PAPER}
                    />
                  </In>
                  <Turbine x={430} y={640} h={190} dur={7} />
                  <Turbine x={1010} y={640} h={170} dur={9} />
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.7 })}>
                  <In x={200} dy={140}>
                    <path
                      d="M-40 700 C120 624 330 640 500 696 V820 H-40 Z"
                      fill={MINT}
                    />
                  </In>
                  <In x={1180} dy={140}>
                    <path
                      d="M880 706 C1030 628 1250 620 1480 690 V820 H880 Z"
                      fill="#9fdab8"
                    />
                  </In>
                  <Lolly x={64} y={706} s={1.1} fill={GREEN} />
                  <Pine x={470} y={708} s={0.9} />
                  <Pine x={1380} y={700} s={1} />
                  <Lolly x={1000} y={712} s={0.9} fill={PINK} />
                  <Cottage
                    x={140}
                    y={742}
                    w={74}
                    h={62}
                    wall={PAPER}
                    roof={TANGERINE}
                  />
                  <Cottage
                    x={236}
                    y={738}
                    w={62}
                    h={80}
                    wall={PINK}
                    roof={COBALT_INK}
                  />
                  <Cottage
                    x={326}
                    y={744}
                    w={72}
                    h={56}
                    wall={BUTTER}
                    roof={TANGERINE}
                  />
                  <Cottage
                    x={1120}
                    y={734}
                    w={76}
                    h={64}
                    wall={PAPER}
                    roof={COBALT_INK}
                  />
                  <Cottage
                    x={1216}
                    y={738}
                    w={66}
                    h={76}
                    wall={MINT}
                    roof={TANGERINE}
                  />
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.9 })}>
                  <In x={720} dy={110}>
                    <path
                      d="M-40 820 V770 C200 736 480 786 720 782 C960 778 1200 738 1480 772 V820 Z"
                      fill={MINT_DEEP}
                    />
                    <path
                      d="M300 800 C480 742 900 740 1140 800"
                      fill="none"
                      stroke="#3b3f63"
                      strokeWidth={42}
                      strokeLinecap="round"
                    />
                    <path
                      d="M330 796 C500 748 900 748 1110 796"
                      fill="none"
                      stroke={PAPER}
                      strokeWidth={3}
                      strokeDasharray="16 12"
                      opacity={0.8}
                    />
                  </In>
                  <Car x={560} y={762} color={COBALT} amp={90} dur={9} />
                  <Car x={900} y={764} color={TANGERINE} amp={-80} dur={11} />
                </g>
              </svg>
            </div>

            {/* ── The name, with its selection box ───────────────────── */}
            <div className={styles.titleStage}>
              <div className={styles.titleWrap}>
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
                      delay={1.0}
                      transform="translate(2.2 3.6) skewX(-9)"
                      stroke="#091232"
                      strokeWidth={SCRIPT_STROKE + 3.6}
                      opacity={0.3}
                    />
                    <ScriptStrokeLayer
                      word={word}
                      reduced={reduced}
                      delay={0.94}
                      transform="skewX(-9)"
                      stroke={COBALT_INK}
                      strokeWidth={SCRIPT_STROKE + 3.4}
                    />
                    <ScriptStrokeLayer
                      word={word}
                      reduced={reduced}
                      delay={0.9}
                      transform="skewX(-9)"
                      stroke={PAPER}
                      strokeWidth={SCRIPT_STROKE + 0.8}
                    />
                  </svg>
                </button>

                {/* The designer's selection box: technic only. */}
                <div className={styles.select} aria-hidden>
                  <span className={styles.selectRotate} />
                  {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((h) => (
                    <span key={h} className={cn(styles.handle, styles[h])} />
                  ))}
                  <span className={styles.selectDot} />
                </div>
              </div>
            </div>

            {/* ── Furniture ───────────────────────────────────────────── */}
            <div className={styles.pillRow}>
              <SwapPill
                lead="I BRING"
                items={MADLIB_SLOTS.craft}
                index={craftIndex}
                reduced={reduced}
                onAdvance={advancePhrase}
                onHoverChange={holdPhrase}
              />
              <SwapPill
                lead="&"
                items={MADLIB_SLOTS.taste}
                index={tasteIndex}
                reduced={reduced}
                onAdvance={advancePhrase}
                onHoverChange={holdPhrase}
              />
              <SwapPill
                lead="TO"
                items={MADLIB_SLOTS.products}
                index={productIndex}
                reduced={reduced}
                onAdvance={advancePhrase}
                onHoverChange={holdPhrase}
              />
            </div>

            <h1 id="hero-title" className={styles.srOnly}>
              Aditya — I bring{' '}
              {MADLIB_SLOTS.craft[craftIndex].word.toLowerCase()} and{' '}
              {MADLIB_SLOTS.taste[tasteIndex].word.toLowerCase()} to{' '}
              {MADLIB_SLOTS.products[productIndex].word.toLowerCase()}
            </h1>

            <span className={styles.label} aria-hidden>
              <span className={styles.labelA}>Tech &amp; Builder</span>
              <span className={styles.labelB}>Paper Town</span>
            </span>

            <button
              type="button"
              className={styles.seeWork}
              onClick={() => scrollToSection('work', reduced)}
            >
              <span>See work</span>
              <ArrowRight size={18} strokeWidth={2.6} aria-hidden />
            </button>

            {/* Hidden hooks: the About tray peels stickers from these. */}
            <div className={styles.hooks} aria-hidden>
              {(['smiley', 'burst', 'daisy', 'bolt'] as const).map((slot) => (
                <span key={slot} data-hero-sticker={slot} data-slot={slot} />
              ))}
            </div>
          </div>

          {/* ── The touch pill: pull the scene down, or push it back ──── */}
          <button
            type="button"
            className={styles.pull}
            onPointerDown={onPillDown}
            onPointerMove={onPillMove}
            onPointerUp={onPillUp}
            onPointerCancel={onPillUp}
            onClick={onPillClick}
            onKeyDown={onPillKey}
          >
            <span className={styles.pullText}>
              {act === 'technic' ? 'Pull me' : 'Push back'}
            </span>
            <Hand size={20} strokeWidth={2.4} aria-hidden />
          </button>
        </div>
      </MotionConfig>
    </section>
  )
}
