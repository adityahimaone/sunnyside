'use client'

import { ArrowUpRight, Zap } from 'lucide-react'
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

import { gearPath, starPath } from '../diorama/geometry'
import { Protractor } from './paper-protractor'

import { scrollToSection } from '../studio-data'
import styles from './hero.module.css'

export type HeroSurface = 'cobalt' | 'sky' | 'paper'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

/* ── The marker wordmark ──────────────────────────────────────────────────
   The site's single-stroke marker alphabet, with a capital A and a
   trailing tail on the final a, matching the footer's marker hand. */

const SCRIPT_STROKE = 3.45
const SCRIPT_OUTLINE = 2.4
const SCRIPT_SLANT = 0.1584

const SCRIPT_A_CAPITAL: [number, string, string?] = [
  15.2,
  'M1.5 -1C3 -3.8 5.6 -11.5 8.4 -19C9 -19.6 9.4 -19.6 9.8 -19C11.6 -12 13 -5.5 13.8 -1C14.1 -0.2 14.6 -0.6 15.2 -1',
  'M4.6 -8.2C7.2 -8.5 10.2 -8.5 12.8 -8.2',
]

const SCRIPT_A_TAIL: [number, string] = [
  14.2,
  'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 -3C7.8 -0.4 8.6 0.4 10.4 0.3C12.2 0.2 14.2 -0.4 15.8 -1.4C16.8 -2 17.6 -2.8 18.2 -3.4',
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
   the others keep crisp monochrome glyphs/icons on butter yellow. */
const CRAFT_ICONS = [
  { Icon: Sparkles, color: '#2c3cae', word: 'SYSTEMS' },
  { Icon: Sun, color: '#191a2e', word: 'CRAFT' },
  { Icon: Circle, color: '#191a2e', word: 'WARMTH' },
  { Icon: Diamond, color: '#2c3cae', word: 'CLARITY' },
] as const

const MADLIB_SLOTS = {
  craft: CRAFT_ICONS,
  taste: [
    { icon: '❖', word: 'MOTION' },
    { icon: '✎', word: 'TASTE' },
    { icon: '◈', word: 'DETAIL' },
    { icon: 'bolt', word: 'FEEL' },
  ],
  products: [
    { icon: '▤', word: 'DIGITAL WORK' },
    { icon: '⚛', word: 'REACT APPS' },
    { icon: '>_', word: 'WEB SYSTEMS' },
    { icon: 'bolt', word: 'PRODUCT UI' },
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
const PAPER_UNDER = '#e9dfcf'
const COBALT = '#3d53d6'
const COBALT_INK = '#2c3cae'
const COBALT_WASH = '#e8ebff'
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
const GRID_LIGHT = 'sunnyside-hero-grid-light'

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
    fill: COBALT,
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
    fill: TANGERINE,
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
    fill: SKY,
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
    () => gearPath(0, 0, spec.r, spec.r * 0.8, spec.teeth),
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
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i / 6) * Math.PI * 2
              return (
                <circle
                  key={i}
                  cx={round(Math.cos(a) * spec.r * 0.38)}
                  cy={round(Math.sin(a) * spec.r * 0.38)}
                  r={round(spec.r * 0.085)}
                  fill={spec.fill}
                />
              )
            })}
            <circle r={spec.r * 0.2} fill={INK} opacity={0.82} />
          </g>
        </Enter>
      </Out>
    </g>
  )
}

/* ── Pieces that spill out of the frame ───────────────────────────────── */

/** Cut-paper props that hang over the bezel, so the box reads as a shadow
 *  box with things leaning into the room. Technic props go as the town
 *  arrives, and the town's come in after them. */
function Ornaments() {
  const gear = useMemo(() => gearPath(0, 0, 54, 43, 12), [])
  const gearSm = useMemo(() => gearPath(0, 0, 30, 24, 9), [])
  return (
    <>
      <span className={cn(styles.orn, styles.ornA, styles.ornGear)} aria-hidden>
        <svg viewBox="-60 -60 120 120" className={styles.ornSvg}>
          <g className={styles.spinCw} style={vars({ '--dur': '36s' })}>
            <path
              d={gear}
              fill="#091232"
              opacity={0.25}
              transform="translate(0 6)"
            />
            <path d={gear} fill={BUTTER} />
            <circle r={30} fill="rgb(255 250 241 / 0.6)" />
            <circle r={9} fill={INK} opacity={0.82} />
          </g>
        </svg>
      </span>
      <span
        className={cn(styles.orn, styles.ornA, styles.ornGearSm)}
        aria-hidden
      >
        <svg viewBox="-34 -34 68 68" className={styles.ornSvg}>
          <g className={styles.spinCcw} style={vars({ '--dur': '22s' })}>
            <path
              d={gearSm}
              fill="#091232"
              opacity={0.25}
              transform="translate(0 4)"
            />
            <path d={gearSm} fill={TANGERINE} />
            <circle r={16} fill="rgb(255 250 241 / 0.6)" />
            <circle r={5} fill={INK} opacity={0.82} />
          </g>
        </svg>
      </span>
      <span
        className={cn(styles.orn, styles.ornA, styles.ornPencil)}
        aria-hidden
      >
        <svg viewBox="0 0 220 40" className={styles.ornSvg}>
          <g className={styles.bob}>
            <rect x={6} y={8} width={150} height={24} rx={3} fill={BUTTER} />
            <rect x={6} y={8} width={150} height={7} rx={3} fill={TANGERINE} />
            <rect x={150} y={8} width={14} height={24} fill={PAPER_LO} />
            <path d="M164 8 L212 20 L164 32 Z" fill={PAPER_UNDER} />
            <path d="M196 16 L212 20 L196 24 Z" fill={INK} />
            <rect x={0} y={8} width={12} height={24} rx={4} fill={TANGERINE} />
          </g>
        </svg>
      </span>
      <span
        className={cn(styles.orn, styles.ornA, styles.ornScrew)}
        aria-hidden
      >
        <svg viewBox="-30 -30 60 60" className={styles.ornSvg}>
          <g className={styles.spinCw} style={vars({ '--dur': '30s' })}>
            <circle r={24} fill="#091232" opacity={0.25} cy={4} />
            <circle r={24} fill={PAPER} />
            <circle r={19} fill={PAPER_LO} />
            <path
              d="M-13 -13 L13 13"
              stroke={INK}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.7}
            />
          </g>
        </svg>
      </span>

      <span
        className={cn(styles.orn, styles.ornB, styles.ornCloud)}
        aria-hidden
      >
        <svg viewBox="126 108 170 90" className={styles.ornSvg}>
          <g
            className={styles.drift}
            style={vars({ '--amp': '10px', '--dur': '9s' })}
          >
            <path
              d={cloudPath(CLOUD_LOBES.left, 186)}
              fill="#091232"
              opacity={0.22}
              transform="translate(0 6)"
            />
            <path d={cloudPath(CLOUD_LOBES.left, 186)} fill={PAPER} />
          </g>
        </svg>
      </span>
      <span className={cn(styles.orn, styles.ornB, styles.ornStar)} aria-hidden>
        <svg viewBox="-60 0 120 190" className={styles.ornSvg}>
          <g className={styles.sway}>
            <path d="M0 0 V104" stroke={PAPER} strokeWidth={3} />
            <path
              d={starPath(0, 140, 40, 18, 5)}
              fill="#091232"
              opacity={0.25}
              transform="translate(0 6)"
            />
            <path d={starPath(0, 140, 40, 18, 5)} fill={BUTTER} />
            <path d={starPath(0, 140, 22, 10, 5)} fill="#ffe27a" />
          </g>
        </svg>
      </span>
      <span className={cn(styles.orn, styles.ornB, styles.ornBird)} aria-hidden>
        <svg viewBox="0 0 80 50" className={styles.ornSvg}>
          <g className={styles.bob}>
            <path
              d="M6 30 C20 8 34 10 42 26 C48 12 62 8 74 24 C60 22 52 32 42 44 C34 34 20 30 6 30 Z"
              fill={PINK}
            />
            <path
              d="M42 26 C48 12 62 8 74 24 C60 22 52 32 42 44 Z"
              fill={TANGERINE}
            />
            <circle cx={42} cy={27} r={2.4} fill={INK} />
          </g>
        </svg>
      </span>
      <span className={cn(styles.orn, styles.ornB, styles.ornTree)} aria-hidden>
        <svg viewBox="-40 -150 80 150" className={styles.ornSvg}>
          <g className={styles.sway} style={vars({ '--origin': '50% 100%' })}>
            <rect x={-6} y={-46} width={12} height={46} rx={3} fill="#3b3f63" />
            <circle cy={-92} r={44} fill="#091232" opacity={0.2} />
            <circle cy={-96} r={44} fill={GREEN} />
            <circle cx={-12} cy={-110} r={14} fill={MINT} opacity={0.7} />
          </g>
        </svg>
      </span>
    </>
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
      <g className={styles.spinSlow} style={vars({ '--dur': '40s' })}>
        <path
          d="M-146 0 A146 146 0 0 1 0 -146"
          fill="none"
          stroke={COBALT}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M-8 -158 L6 -146 L-8 -134"
          fill="none"
          stroke={COBALT}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M146 0 A146 146 0 0 1 0 146"
          fill="none"
          stroke={COBALT}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="1 14"
        />
      </g>
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
  dx = 0,
  dy = 0,
}: {
  dx?: number
  dy?: number
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
        <path d={d} fill={PAPER} transform={`translate(${dx} ${dy})`} />
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
  chimney = true,
}: {
  x: number
  y: number
  w: number
  h: number
  wall: string
  roof: string
  chimney?: boolean
}) {
  const roofH = Math.round(w * 0.55)
  const pane = round(w * 0.2)
  const over = 8
  return (
    <In x={x} dy={90} filter={SOFT_S}>
      <g transform={`translate(${x} ${y})`}>
        {chimney ? (
          <rect
            x={round(w * 0.16)}
            y={-h - roofH + 4}
            width={round(w * 0.16)}
            height={round(roofH * 0.7)}
            fill={INK}
            opacity={0.78}
          />
        ) : null}
        <rect x={-w / 2} y={-h} width={w} height={h + 6} fill={wall} />
        <rect
          x={-w / 2}
          y={-h}
          width={w}
          height={7}
          fill="#091232"
          opacity={0.1}
        />
        <path
          d={`M${-w / 2 - over} ${-h + 2} L0 ${-h - roofH} L${w / 2 + over} ${-h + 2} Z`}
          fill={roof}
        />
        <path
          d={`M${-w / 2 - over} ${-h + 2} L${w / 2 + over} ${-h + 2} L${w / 2 + over - 5} ${-h - 4} L${-w / 2 - over + 5} ${-h - 4} Z`}
          fill="#091232"
          opacity={0.14}
        />
        {[round(-w * 0.34), round(w * 0.14)].map((px) => (
          <g key={px}>
            <rect
              x={px - 2}
              y={round(-h * 0.7) - 2}
              width={pane + 4}
              height={pane + 4}
              rx={3}
              fill={PAPER}
            />
            <rect
              x={px}
              y={round(-h * 0.7)}
              width={pane}
              height={pane}
              rx={2}
              fill={COBALT}
            />
          </g>
        ))}
        <path
          d={`M${round(-w * 0.11)} 6 V${round(-h * 0.26)} Q0 ${round(-h * 0.42)} ${round(w * 0.11)} ${round(-h * 0.26)} V6 Z`}
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
        <rect x={-5} y={-18} width={10} height={22} fill="#b8602a" />
        <path d="M0 -112 L24 -70 H-24 Z" fill="#3ea06f" />
        <path d="M0 -88 L30 -42 H-30 Z" fill={GREEN} />
        <path d="M0 -62 L38 -14 H-38 Z" fill="#3ea06f" />
        <path d="M0 -62 L38 -14 H0 Z" fill="#091232" opacity={0.1} />
      </g>
    </In>
  )
}

/** A cut-paper mobile piece: hangs from the frame's top edge by a string, so
 *  nothing in the sky floats free. `top` is where the shape begins. */
function Hung({
  x,
  top,
  children,
}: {
  x: number
  top: number
  children: ReactNode
}) {
  return (
    <In x={x} dy={-150} filter={SOFT_S}>
      <path
        d={`M${x} -40 V${top + 2}`}
        stroke={PAPER}
        strokeOpacity={0.75}
        strokeWidth={2.4}
        fill="none"
      />
      {children}
    </In>
  )
}

/** A mountain whose snow cap follows both slopes exactly, with a shaded
 *  side. The base runs below the ground line so layers never show a gap. */
function Mountain({
  left,
  peakX,
  peakY,
  right,
  base,
  fill,
  shade = '#091232',
}: {
  left: number
  peakX: number
  peakY: number
  right: number
  base: number
  fill: string
  shade?: string
}) {
  const f = 0.22
  const lx = peakX + (left - peakX) * f
  const rx = peakX + (right - peakX) * f
  const ly = peakY + (base - peakY) * f
  const step = (rx - lx) / 4
  const snow = `M${peakX} ${peakY} L${lx} ${ly} L${round(lx + step)} ${ly + 22} L${round(lx + step * 2)} ${ly + 4} L${round(lx + step * 3)} ${ly + 24} L${rx} ${ly} Z`
  return (
    <In x={peakX} dy={170} filter={SOFT_S}>
      <path
        d={`M${left} ${base} L${peakX} ${peakY} L${right} ${base} Z`}
        fill={fill}
      />
      <path
        d={`M${peakX} ${peakY} L${right} ${base} H${peakX} Z`}
        fill={shade}
        opacity={0.09}
      />
      <path d={snow} fill={PAPER} />
    </In>
  )
}

/** Solar panel on a post that reaches the ground. */
function Solar({ x, top, ground }: { x: number; top: number; ground: number }) {
  const P = [
    [x - 96, top + 30],
    [x + 54, top],
    [x + 96, top + 78],
    [x - 54, top + 112],
  ]
  const at = (u: number, v: number) => {
    const ax = P[0][0] + (P[1][0] - P[0][0]) * u
    const ay = P[0][1] + (P[1][1] - P[0][1]) * u
    const bx = P[3][0] + (P[2][0] - P[3][0]) * u
    const by = P[3][1] + (P[2][1] - P[3][1]) * u
    return `${round(ax + (bx - ax) * v)} ${round(ay + (by - ay) * v)}`
  }
  const lines: string[] = []
  for (let i = 1; i < 4; i += 1) {
    lines.push(`M${at(i / 4, 0)} L${at(i / 4, 1)}`)
    lines.push(`M${at(0, i / 3.2)} L${at(1, i / 3.2)}`)
  }
  const mid = at(0.5, 1).split(' ').map(Number)
  return (
    <In x={x} dy={150} filter={SOFT_S}>
      <path
        d={`M${x - 7} ${mid[1] - 4} H${x + 7} V${ground} H${x - 7} Z`}
        fill={PAPER}
      />
      <path
        d={`M${x - 30} ${ground} L${x - 7} ${ground - 40} H${x + 7} L${x + 30} ${ground} Z`}
        fill={PAPER_LO}
      />
      <path
        d={`M${P.map((p) => p.join(' ')).join(' L')} Z`}
        fill="#5f7cf0"
        stroke={PAPER}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path
        d={lines.join(' ')}
        stroke={PAPER}
        strokeOpacity={0.8}
        strokeWidth={2}
        fill="none"
      />
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
  flip = false,
}: {
  x: number
  y: number
  color: string
  amp: number
  dur: number
  flip?: boolean
}) {
  return (
    <In x={x} dy={60} filter={SOFT_S}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -1.2 : 1.2} 1.2)`}>
        <g
          className={styles.drive}
          style={vars({ '--amp': `${amp}px`, '--dur': `${dur}s` })}
        >
          <ellipse
            cx={4}
            cy={11}
            rx={54}
            ry={6}
            fill="#091232"
            opacity={0.28}
          />
          <path
            d="M-44 4 V-12 Q-44 -22 -33 -22 H-22 L-10 -42 H22 L35 -22 H46 Q54 -22 54 -12 V4 Z"
            fill={color}
          />
          <path d="M-44 -2 H54 V4 H-44 Z" fill="#091232" opacity={0.18} />
          <path d="M-6 -37 H8 V-23 H-15 Z" fill={SKY} />
          <path d="M13 -37 H21 L29 -23 H13 Z" fill={SKY} />
          <circle cx={50} cy={-10} r={3.4} fill={BUTTER} />
          <circle cx={-22} cy={4} r={11} fill={INK} />
          <circle cx={32} cy={4} r={11} fill={INK} />
          <circle cx={-22} cy={4} r={4.5} fill={PAPER} />
          <circle cx={32} cy={4} r={4.5} fill={PAPER} />
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
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.05, delay, ease: PAPER_EASE },
          opacity: { duration: 0.01, delay },
        }}
      />
      {word.extra.map((d, index) => {
        const extraDelay = delay + 0.95 + index * 0.12
        return (
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
              pathLength: {
                duration: 0.25,
                delay: extraDelay,
                ease: 'easeOut',
              },
              opacity: { duration: 0.01, delay: extraDelay },
            }}
          />
        )
      })}
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
    ) : it.icon === 'bolt' ? (
      <Zap size={14} strokeWidth={2.6} aria-hidden />
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
          {items.map((it) => (
            <span key={it.word} className={styles.swapSizerItem}>
              <span className={styles.pillIcon}>{renderIcon(it, false)}</span>
              <span>{it.word}</span>
            </span>
          ))}
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
    const val = t.toFixed(4)
    sectionRef.current?.style.setProperty('--t', val)
    stageRef.current?.style.setProperty('--t', val)
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
    startX: number
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
      startX: event.clientX,
      startY: event.clientY,
      startT: progress.get(),
      moved: false,
    }
  }

  const onPillMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = drag.startX - event.clientX
    const dy = event.clientY - drag.startY
    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy
    if (!drag.moved && Math.abs(delta) < 5) return
    drag.moved = true
    progress.set(clamp(drag.startT + delta / PULL_RANGE, 0, 1))
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
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
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
    const pad = (SCRIPT_STROKE + SCRIPT_OUTLINE) / 2 + 2.2
    const vbX = -1.6 - pad
    const vbY = word.top - pad
    const vbW =
      Math.max(word.width, 1) + 3.6 + pad * 2 - word.top * SCRIPT_SLANT
    const vbH = word.bottom + pad - vbY + 2.2
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
        {/* Left screen edge tab: parallax on / off */}
        <button
          type="button"
          className={styles.physicsTab}
          aria-pressed={physicsOn}
          onClick={togglePhysics}
        >
          <span className={styles.physicsLabel}>physics on/off</span>
        </button>

        <div ref={stageRef} className={styles.box} data-act={act}>
          <div className={styles.window}>
            {/* ── Technic: the drafting table ─────────────────────────── */}
            <div className={cn(styles.layer, styles.sceneA)}>
              <svg
                className={styles.svg}
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMax slice"
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
                      strokeOpacity="0.18"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M12 0V48M24 0V48M36 0V48M0 12H48M0 24H48M0 36H48"
                      fill="none"
                      stroke={COBALT}
                      strokeOpacity="0.06"
                      strokeWidth="0.8"
                    />
                  </pattern>
                  <pattern
                    id={GRID_LIGHT}
                    width="48"
                    height="48"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M48 0H0V48"
                      fill="none"
                      stroke={PAPER}
                      strokeOpacity="0.16"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M24 0V48M0 24H48"
                      fill="none"
                      stroke={PAPER}
                      strokeOpacity="0.06"
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
                      <path d="M-80 -80 H852 L540 880 H-80 Z" fill={BUTTER} />
                      <path
                        d="M-80 -80 H800 L470 880 H-80 Z"
                        fill={COBALT_WASH}
                      />
                      <path
                        d="M-80 -80 H800 L470 880 H-80 Z"
                        fill={`url(#${GRID})`}
                        opacity={0.7}
                      />
                    </Enter>
                  </Out>
                  <Out at={0.1} dx={-300} dy={300} rot={0}>
                    <Enter kind="fly" delay={0.4} fy={320}>
                      <circle cx={470} cy={858} r={170} fill={PAPER} />
                      <circle cx={470} cy={858} r={120} fill={PAPER_UNDER} />
                    </Enter>
                  </Out>
                  <Out at={0.12} dx={420} dy={260} rot={0}>
                    <Enter kind="fly" delay={0.3} fy={320}>
                      <path
                        d="M820 880 L1040 560 H1520 V880 Z"
                        fill={PAPER_UNDER}
                      />
                      <rect
                        x={1010}
                        y={500}
                        width={470}
                        height={330}
                        rx={46}
                        fill={PAPER}
                        stroke={INK}
                        strokeOpacity={0.1}
                        strokeWidth={2}
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
                          stroke={COBALT}
                          pathLength={1}
                        />
                      </Enter>
                      <Enter kind="draw" delay={1.3}>
                        <path
                          d="M400 700 C500 668 640 760 760 722 S920 690 1000 736"
                          stroke={TANGERINE}
                          pathLength={1}
                        />
                      </Enter>
                    </g>
                    <g
                      fill="none"
                      stroke={COBALT}
                      strokeWidth={2}
                      strokeDasharray="6 6"
                    >
                      <path d="M420 668 L520 612 M960 704 L900 640" />
                    </g>
                    <circle cx={520} cy={612} r={6} fill={COBALT} />
                    <circle cx={900} cy={640} r={6} fill={COBALT} />
                    <rect
                      x={411}
                      y={659}
                      width={18}
                      height={18}
                      rx={3}
                      fill={PAPER}
                      stroke={COBALT}
                      strokeWidth={3}
                    />
                    <rect
                      x={951}
                      y={695}
                      width={18}
                      height={18}
                      rx={3}
                      fill={PAPER}
                      stroke={COBALT}
                      strokeWidth={3}
                    />
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
                preserveAspectRatio="xMidYMax slice"
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
                    fill={`url(#${GRID_LIGHT})`}
                  />
                </g>
              </svg>
            </div>

            {/* ── The one tool both scenes share ──────────────────────── */}
            <div className={cn(styles.layer, styles.shared)}>
              <svg
                className={styles.svg}
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden
                focusable="false"
              >
                <g className={styles.px} style={vars({ '--depth': 0.6 })}>
                  <g className={styles.sharedTool}>
                    <Enter kind="sweep" delay={0.75}>
                      <g filter={`url(#${SOFT})`}>
                        <Protractor
                          radius={200}
                          inner={118}
                          fill={BUTTER}
                          core="#ffe27a"
                          coreClassName={styles.sharedCore}
                        />
                      </g>
                    </Enter>
                  </g>
                </g>
              </svg>
            </div>

            <div className={cn(styles.layer, styles.sceneB, styles.sceneFront)}>
              <svg
                className={styles.svg}
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden
                focusable="false"
              >
                {/* Mobile pieces hang from the top edge on strings. */}
                <g className={styles.px} style={vars({ '--depth': 0.2 })}>
                  <Hung x={330} top={166}>
                    <path d={starPath(330, 192, 28, 13, 5)} fill={BUTTER} />
                  </Hung>
                  <Hung x={1290} top={96}>
                    <path d={starPath(1290, 120, 26, 12, 5)} fill={BUTTER} />
                  </Hung>
                  <Hung x={384} top={214}>
                    <path
                      d="M384 214 l26 15 v30 l-26 15 -26 -15 v-30 z"
                      fill={PINK}
                    />
                  </Hung>
                  <Hung x={250} top={296}>
                    <circle
                      cx={250}
                      cy={324}
                      r={28}
                      fill="none"
                      stroke={MINT}
                      strokeWidth={13}
                    />
                  </Hung>
                  <Hung x={150} top={388}>
                    <circle cx={150} cy={430} r={42} fill={GREEN} />
                    <circle cx={150} cy={430} r={28} fill={BUTTER} />
                    <circle cx={150} cy={430} r={14} fill={PAPER} />
                  </Hung>
                  <Hung x={1350} top={256}>
                    <path
                      d={starPath(1350, 300, 44, 20, 5, 8)}
                      fill={TANGERINE}
                    />
                    <path d={starPath(1350, 300, 25, 11, 5, 8)} fill={PINK} />
                  </Hung>
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
                    x={860}
                    dx={300}
                    dy={-130}
                    amp={16}
                    dur={29}
                  />
                  <TownCloud
                    lobes={CLOUD_LOBES.right}
                    base={354}
                    x={1270}
                    dy={-30}
                    amp={22}
                    dur={38}
                  />
                </g>

                {/* Mountains: bases sink into the ground. */}
                <g className={styles.px} style={vars({ '--depth': 0.45 })}>
                  <Mountain
                    left={-60}
                    peakX={120}
                    peakY={440}
                    right={400}
                    base={760}
                    fill="#8fd0b0"
                  />
                  <Mountain
                    left={180}
                    peakX={300}
                    peakY={520}
                    right={520}
                    base={760}
                    fill="#79c2a0"
                  />
                  <Mountain
                    left={900}
                    peakX={1130}
                    peakY={510}
                    right={1380}
                    base={760}
                    fill="#79c2a0"
                  />
                  <Mountain
                    left={1040}
                    peakX={1320}
                    peakY={430}
                    right={1560}
                    base={760}
                    fill="#8fd0b0"
                  />
                </g>

                {/* Back ground: one continuous sheet, deeper than the frame. */}
                <g className={styles.px} style={vars({ '--depth': 0.6 })}>
                  <In x={720} dy={150}>
                    <path
                      d="M-160 712 C80 668 300 676 500 706 C640 728 800 728 940 706 C1140 676 1360 668 1600 712 V940 H-160 Z"
                      fill="#a9e0c1"
                    />
                  </In>
                  <Turbine x={560} y={706} h={170} dur={9} />
                  <Turbine x={900} y={706} h={150} dur={7} />
                  <Cottage
                    x={110}
                    y={732}
                    w={78}
                    h={62}
                    wall={PAPER}
                    roof={TANGERINE}
                  />
                  <Cottage
                    x={210}
                    y={728}
                    w={64}
                    h={84}
                    wall={PINK}
                    roof={COBALT_INK}
                  />
                  <Cottage
                    x={300}
                    y={730}
                    w={72}
                    h={58}
                    wall={BUTTER}
                    roof={TANGERINE}
                    chimney={false}
                  />
                  <Pine x={400} y={734} s={0.85} />
                  <Pine x={1062} y={736} s={0.7} />
                  <Cottage
                    x={1130}
                    y={730}
                    w={78}
                    h={66}
                    wall={PAPER}
                    roof={COBALT_INK}
                  />
                  <Cottage
                    x={1228}
                    y={732}
                    w={66}
                    h={82}
                    wall={MINT}
                    roof={TANGERINE}
                  />
                  <Cottage
                    x={1318}
                    y={730}
                    w={74}
                    h={58}
                    wall={PINK}
                    roof={COBALT_INK}
                    chimney={false}
                  />
                  <Solar x={990} top={470} ground={734} />
                </g>

                {/* Front ground, road and cars. */}
                <g className={styles.px} style={vars({ '--depth': 0.85 })}>
                  <In x={720} dy={110}>
                    <path
                      d="M-160 764 C100 736 380 746 560 772 C680 748 760 748 880 772 C1060 746 1340 736 1600 764 V940 H-160 Z"
                      fill={MINT_DEEP}
                    />
                    <path
                      d="M200 840 C440 716 1000 716 1240 840"
                      fill="none"
                      stroke="#2b2f52"
                      strokeWidth={96}
                    />
                    <path
                      d="M200 840 C440 716 1000 716 1240 840"
                      fill="none"
                      stroke="#3b3f63"
                      strokeWidth={84}
                    />
                    <path
                      d="M200 840 C440 716 1000 716 1240 840"
                      fill="none"
                      stroke={PAPER}
                      strokeWidth={3.5}
                      strokeDasharray="18 14"
                      opacity={0.85}
                    />
                  </In>
                  <Pine x={110} y={796} s={1.1} />
                  <Lolly x={1350} y={792} s={1.1} fill={PINK} />
                  <Car x={600} y={760} color={COBALT} amp={90} dur={9} />
                  <Car
                    x={860}
                    y={786}
                    color={TANGERINE}
                    amp={-80}
                    dur={11}
                    flip
                  />
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
                      transform="translate(1.4 2.3) skewX(-9)"
                      stroke={INK}
                      strokeWidth={SCRIPT_STROKE + SCRIPT_OUTLINE}
                      opacity={0.38}
                    />
                    <ScriptStrokeLayer
                      word={word}
                      reduced={reduced}
                      delay={0.94}
                      transform="skewX(-9)"
                      stroke={COBALT_INK}
                      strokeWidth={SCRIPT_STROKE + SCRIPT_OUTLINE}
                    />
                    <ScriptStrokeLayer
                      word={word}
                      reduced={reduced}
                      delay={0.9}
                      transform="skewX(-9)"
                      stroke={PAPER}
                      strokeWidth={SCRIPT_STROKE}
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

            <button
              type="button"
              className={styles.seeWork}
              onClick={() => scrollToSection('work', reduced)}
            >
              <span>See work</span>
              <ArrowUpRight size={18} strokeWidth={2.6} aria-hidden />
            </button>

            {/* Hidden hooks: the About tray peels stickers from these. */}
            <div className={styles.hooks} aria-hidden>
              {(['smiley', 'burst', 'daisy', 'bolt'] as const).map((slot) => (
                <span key={slot} data-hero-sticker={slot} data-slot={slot} />
              ))}
            </div>
          </div>

          <Ornaments />
        </div>

        {/* ── Screen-right pull tab ───────────────────────────────────── */}
        <div className={styles.pullWrap}>
          <span className={styles.pullRibbon} aria-hidden />
          <span key={act} className={styles.pullBurst} aria-hidden />
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={act}
                  className={styles.pullLabel}
                  initial={reduced ? false : { y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -6, opacity: 0 }}
                  transition={{ duration: 0.2, ease: PAPER_EASE }}
                >
                  {act === 'technic' ? 'Pull me' : 'Push back'}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className={styles.pullIcon} aria-hidden>
              <ArrowUpRight size={17} strokeWidth={2.6} />
            </span>
          </button>
        </div>
      </MotionConfig>
    </section>
  )
}
