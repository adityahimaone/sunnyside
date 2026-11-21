'use client'

import { ArrowUpRight } from 'lucide-react'
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { Oswald } from 'next/font/google'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { round } from '@/components/ui/sticker-slap-footer'
import { cn } from '@/lib/utils'

import { gearPath, starPath } from '../diorama/geometry'
import { scrollToSection } from '../studio-data'
import { Protractor } from './paper-protractor'
import styles from './hero.module.css'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--font-hero-display',
})

export type HeroSurface = 'cobalt' | 'sky' | 'paper'
export type HeroScene = 'studio' | 'world'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

const PAPER_EASE = [0.22, 1, 0.36, 1] as const

const vars = (values: Record<string, string | number>) =>
  values as CSSProperties

/* ── Sunnyside Palette Constants ────────────────────────────────────────── */

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

/* ── Scene-Reactive & Click-to-Cycle Copy ───────────────────────────────── */

const SLOT_1_WORDS = ['CLARITY', 'WARMTH', 'CRAFT', 'STRUCTURE'] as const
const SLOT_2_WORDS = ['CRAFT', 'DETAIL', 'MOTION', 'TASTE'] as const
const SLOT_3_PAIRS = [
  { before: 'WEB', after: 'SYSTEMS' },
  { before: 'LIVE', after: 'PRODUCTS' },
  { before: 'REACT', after: 'INTERFACES' },
  { before: 'SAAS', after: 'PLATFORMS' },
] as const

/* ── Shared Diorama Primitive Helpers ────────────────────────────────────── */

type Lobe = { cx: number; cy: number; r: number }

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

function Out({
  at = 0,
  dx = 0,
  dy = 0,
  rot = 0,
  filterId,
  children,
}: {
  at?: number
  dx?: number
  dy?: number
  rot?: number
  filterId?: string
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
      filter={filterId ? `url(#${filterId})` : undefined}
    >
      {children}
    </g>
  )
}

function In({
  at = 0.25,
  dy = 48,
  filterId,
  children,
}: {
  at?: number
  dy?: number
  filterId?: string
  children: ReactNode
}) {
  return (
    <g
      className={styles.enterB}
      style={vars({ '--at': at, '--dy': `${dy}px` })}
      filter={filterId ? `url(#${filterId})` : undefined}
    >
      {children}
    </g>
  )
}

function DraftingGridDefs({
  idPrefix,
  cell = 20,
}: {
  idPrefix: string
  cell?: number
}) {
  const half = cell / 2
  return (
    <defs>
      <filter
        id={`${idPrefix}-soft`}
        x="-25%"
        y="-25%"
        width="150%"
        height="160%"
      >
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="3.5"
          floodColor="#091232"
          floodOpacity="0.24"
        />
      </filter>
      <pattern
        id={`${idPrefix}-grid`}
        width={cell}
        height={cell}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M${cell} 0H0V${cell}`}
          fill="none"
          stroke={COBALT}
          strokeOpacity="0.16"
          strokeWidth="0.9"
        />
        <path
          d={`M${half} 0V${cell}M0 ${half}H${cell}`}
          fill="none"
          stroke={COBALT}
          strokeOpacity="0.06"
          strokeWidth="0.6"
        />
      </pattern>
      <pattern
        id={`${idPrefix}-grid-light`}
        width={cell}
        height={cell}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M${cell} 0H0V${cell}`}
          fill="none"
          stroke={PAPER}
          strokeOpacity="0.14"
          strokeWidth="0.9"
        />
      </pattern>
      <linearGradient id={`${idPrefix}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4e73f8" />
        <stop offset="100%" stopColor="#7aa7ff" />
      </linearGradient>
    </defs>
  )
}

function MiniGear({
  x,
  y,
  r,
  teeth,
  fill,
  dir = 1,
  dur = 26,
}: {
  x: number
  y: number
  r: number
  teeth: number
  fill: string
  dir?: 1 | -1
  dur?: number
}) {
  const d = useMemo(() => gearPath(0, 0, r, r * 0.78, teeth), [r, teeth])
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className={dir > 0 ? styles.spinCw : styles.spinCcw}
        style={vars({ '--dur': `${dur}s` })}
      >
        <circle r={r} fill="none" />
        <path d={d} fill={fill} />
        <circle r={r * 0.52} fill="rgb(255 250 241 / 0.58)" />
        <circle r={r * 0.22} fill={INK} opacity={0.84} />
      </g>
    </g>
  )
}

function MiniMountain({
  left,
  peakX,
  peakY,
  right,
  base,
  fill,
}: {
  left: number
  peakX: number
  peakY: number
  right: number
  base: number
  fill: string
}) {
  const f = 0.26
  const lx = peakX + (left - peakX) * f
  const rx = peakX + (right - peakX) * f
  const ly = peakY + (base - peakY) * f
  const step = (rx - lx) / 4
  const snow = `M${peakX} ${peakY} L${lx} ${ly} L${round(lx + step)} ${ly + 7} L${round(lx + step * 2)} ${ly + 2} L${round(lx + step * 3)} ${ly + 8} L${rx} ${ly} Z`
  return (
    <g>
      <path
        d={`M${left} ${base} L${peakX} ${peakY} L${right} ${base} Z`}
        fill={fill}
      />
      <path
        d={`M${peakX} ${peakY} L${right} ${base} H${peakX} Z`}
        fill="#091232"
        opacity={0.09}
      />
      <path d={snow} fill={PAPER} />
    </g>
  )
}

function MiniTurbine({
  x,
  y,
  h,
  bladeR,
  dur,
}: {
  x: number
  y: number
  h: number
  bladeR: number
  dur: number
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M-2.5 0 L-1.2 ${-h} L1.2 ${-h} L2.5 0 Z`} fill={PAPER} />
      <g transform={`translate(0 ${-h})`}>
        <g className={styles.spinCw} style={vars({ '--dur': `${dur}s` })}>
          <circle r={bladeR} fill="none" />
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d={`M0 0 C3 ${round(-bladeR * 0.22)} 3 ${round(-bladeR * 0.72)} 0 ${-bladeR} C-3 ${round(-bladeR * 0.72)} -3 ${round(-bladeR * 0.22)} 0 0 Z`}
              fill={PAPER}
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r={3.5} fill={BUTTER} />
        </g>
      </g>
    </g>
  )
}

function MiniCottage({
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
  const roofH = Math.round(w * 0.52)
  const pane = Math.max(4, Math.round(w * 0.22))
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={round(w * 0.16)}
        y={-h - roofH + 2}
        width={round(w * 0.18)}
        height={round(roofH * 0.7)}
        fill={INK}
        opacity={0.78}
      />
      <rect x={-w / 2} y={-h} width={w} height={h + 4} fill={wall} />
      <path
        d={`M${-w / 2 - 3} ${-h + 1} L0 ${-h - roofH} L${w / 2 + 3} ${-h + 1} Z`}
        fill={roof}
      />
      {[-w * 0.28, w * 0.08].map((px) => (
        <rect
          key={px}
          x={round(px)}
          y={round(-h * 0.72)}
          width={pane}
          height={pane}
          rx={1}
          fill={COBALT}
        />
      ))}
      <path
        d={`M${round(-w * 0.12)} 4 V${round(-h * 0.28)} Q0 ${round(-h * 0.42)} ${round(w * 0.12)} ${round(-h * 0.28)} V4 Z`}
        fill={TANGERINE}
      />
    </g>
  )
}

function MiniPine({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2.5} y={-8} width={5} height={10} fill="#b8602a" />
      <path d="M0 -42 L11 -25 H-11 Z" fill="#3ea06f" />
      <path d="M0 -33 L13 -14 H-13 Z" fill={GREEN} />
      <path d="M0 -22 L16 -4 H-16 Z" fill="#3ea06f" />
    </g>
  )
}

function MiniSolar({ x, y, s = 0.5 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-4} y={24} width={8} height={42} fill={PAPER} />
      <path d="M-16 66 L-4 44 H4 L16 66 Z" fill={PAPER_LO} />
      <path
        d="M-48 8 L28 -10 L50 28 L-26 46 Z"
        fill="#5f7cf0"
        stroke={PAPER}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M-23 2 L-1 40 M2 -4 L24 34 M-37 26 L39 8"
        stroke={PAPER}
        strokeOpacity={0.78}
        strokeWidth={1.6}
        fill="none"
      />
    </g>
  )
}

function MiniCar({
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
    <g transform={`translate(${x} ${y}) scale(${flip ? -0.58 : 0.58} 0.58)`}>
      <g
        className={styles.drive}
        style={vars({ '--amp': `${amp}px`, '--dur': `${dur}s` })}
      >
        <ellipse cx={4} cy={10} rx={48} ry={5} fill="#091232" opacity={0.28} />
        <path
          d="M-42 4 V-12 Q-42 -21 -32 -21 H-21 L-10 -40 H22 L34 -21 H44 Q52 -21 52 -12 V4 Z"
          fill={color}
        />
        <path d="M-6 -35 H8 V-22 H-15 Z" fill={SKY} />
        <path d="M13 -35 H21 L29 -22 H13 Z" fill={SKY} />
        <circle cx={48} cy={-9} r={3.2} fill={BUTTER} />
        <circle cx={-21} cy={4} r={10} fill={INK} />
        <circle cx={30} cy={4} r={10} fill={INK} />
        <circle cx={-21} cy={4} r={4} fill={PAPER} />
        <circle cx={30} cy={4} r={4} fill={PAPER} />
      </g>
    </g>
  )
}

/* ── Pill 1 Diorama: Calibration Dial & Gears ↔ Sun & Wind Turbines ───── */

function PillOneDiorama() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const softId = `${uid}-soft`
  const serratedSun = useMemo(() => starPath(160, 26, 46, 36, 16), [])

  return (
    <div className={styles.pillStage} aria-hidden="true">
      <svg
        className={styles.pillSvg}
        viewBox="0 0 320 140"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <DraftingGridDefs idPrefix={uid} cell={18} />

        {/* Scene A: Studio (Technic Calibration Dial & Gears) */}
        <g className={styles.sceneALayer}>
          <rect width={320} height={140} fill={PAPER_LO} />
          <path d="M0 0 H182 L130 140 H0 Z" fill={COBALT_WASH} />
          <path d="M174 0 H194 L142 140 H122 Z" fill={BUTTER} />
          <rect width={320} height={140} fill={`url(#${uid}-grid)`} />

          <Out at={0.04} dx={-80} dy={-40} rot={-65} filterId={softId}>
            <MiniGear x={74} y={56} r={34} teeth={12} fill={COBALT} dur={28} />
            <MiniGear
              x={38}
              y={104}
              r={21}
              teeth={8}
              fill={BUTTER}
              dir={-1}
              dur={18}
            />
          </Out>

          <Out at={0.06} dx={85} dy={45} rot={40} filterId={softId}>
            <g transform="translate(226 74)">
              <circle r={54} fill={PAPER} opacity={0.9} />
              <circle
                r={50}
                fill="none"
                stroke={COBALT}
                strokeWidth={1.8}
                strokeDasharray="3 5"
              />
              <circle r={39} fill={TANGERINE} />
              <circle r={28} fill={PAPER} />
              <circle r={19} fill={COBALT} />
              <circle r={11} fill={BUTTER} />
              <g className={styles.spinCw} style={vars({ '--dur': '11s' })}>
                <path
                  d="M0 0 L0 -25"
                  stroke={INK}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <circle cy={-25} r={3} fill={TANGERINE} />
              </g>
              <circle r={4} fill={INK} />
            </g>
          </Out>
        </g>

        {/* Scene B: World (Paper Town Sun, Mountains & Wind Turbines) */}
        <g className={cn(styles.sceneBLayer, styles.irisCenter)}>
          <rect width={320} height={140} fill={`url(#${uid}-sky)`} />
          <rect
            width={320}
            height={140}
            fill={`url(#${uid}-grid-light)`}
            opacity={0.7}
          />

          <In at={0.18} dy={-28} filterId={softId}>
            <g transform="translate(160 26)">
              <g className={styles.spinCw} style={vars({ '--dur': '48s' })}>
                <path
                  d={serratedSun}
                  transform="translate(-160 -26)"
                  fill={BUTTER}
                />
                <circle r={24} fill="#ffe27a" />
              </g>
            </g>
          </In>

          <In at={0.22} dy={44} filterId={softId}>
            <MiniMountain
              left={-18}
              peakX={56}
              peakY={84}
              right={136}
              base={146}
              fill="#79c2a0"
            />
            <MiniMountain
              left={182}
              peakX={258}
              peakY={80}
              right={338}
              base={146}
              fill="#8fd0b0"
            />
            <MiniMountain
              left={66}
              peakX={160}
              peakY={94}
              right={254}
              base={146}
              fill="#69b692"
            />
          </In>

          <In at={0.28} dy={52} filterId={softId}>
            <path
              d="M-10 120 Q80 108 160 116 Q240 124 330 114 V146 H-10 Z"
              fill={MINT}
            />
            <MiniTurbine x={72} y={122} h={50} bladeR={28} dur={7.5} />
            <MiniTurbine x={162} y={124} h={42} bladeR={23} dur={6.2} />
            <MiniTurbine x={238} y={120} h={52} bladeR={29} dur={8.4} />
          </In>
        </g>
      </svg>
    </div>
  )
}

/* ── Pill 2 Diorama: Drafting Protractor & Compass ↔ Paper Town Panorama ─ */

function PillTwoDiorama() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const softId = `${uid}-soft`
  const cloudD = useMemo(
    () =>
      cloudPath(
        [
          { cx: 484, cy: 36, r: 10 },
          { cx: 500, cy: 29, r: 15 },
          { cx: 518, cy: 34, r: 11 },
        ],
        44,
      ),
    [],
  )

  return (
    <div className={styles.pillStage} aria-hidden="true">
      <svg
        className={styles.pillSvg}
        viewBox="0 0 640 140"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <DraftingGridDefs idPrefix={uid} cell={18} />

        {/* Scene A: Studio (Drafting Table Beam, Interlocking Gears, Compass) */}
        <g className={styles.sceneALayer}>
          <rect width={640} height={140} fill={PAPER} />
          <path d="M0 0 H290 L220 140 H0 Z" fill={PAPER_LO} opacity={0.75} />
          <rect width={640} height={140} fill={`url(#${uid}-grid)`} />

          {/* Construction dashed guides */}
          <g
            fill="none"
            stroke={COBALT}
            strokeOpacity={0.28}
            strokeWidth={1.2}
            strokeDasharray="5 5"
          >
            <circle cx={320} cy={70} r={54} />
            <line x1={180} y1={70} x2={460} y2={70} />
          </g>

          {/* Yellow slanted beam + interlocking gears */}
          <Out at={0.04} dx={-120} dy={30} rot={-35} filterId={softId}>
            <path d="M235 140 L310 -8 H332 L257 140 Z" fill={BUTTER} />
            <MiniGear x={314} y={52} r={33} teeth={11} fill={BUTTER} dur={30} />
            <MiniGear
              x={358}
              y={88}
              r={25}
              teeth={10}
              fill={TANGERINE}
              dir={-1}
              dur={22}
            />
            <MiniGear
              x={306}
              y={108}
              r={18}
              teeth={8}
              fill={TANGERINE}
              dir={-1}
              dur={17}
            />
          </Out>

          {/* Two-legged Drafting Compass on the right */}
          <Out at={0.08} dx={110} dy={-70} rot={18} filterId={softId}>
            <g transform="translate(495 36) scale(0.42)">
              <path
                d="M-6 -2 L6 -2 L-58 188 L-70 188 Z"
                fill={PAPER_LO}
                stroke={INK}
                strokeOpacity={0.5}
                strokeWidth={2}
              />
              <path d="M-70 188 L-58 188 L-64 214 Z" fill={INK} />
              <path
                d="M-6 -2 L6 -2 L72 182 L60 182 Z"
                fill={PAPER_LO}
                stroke={INK}
                strokeOpacity={0.5}
                strokeWidth={2}
              />
              <rect
                x={58}
                y={176}
                width={16}
                height={26}
                rx={2}
                fill={BUTTER}
              />
              <path d="M58 202 L74 202 L66 216 Z" fill={INK} />
              <rect
                x={-7}
                y={-52}
                width={14}
                height={40}
                rx={7}
                fill={TANGERINE}
              />
              <circle r={17} fill={TANGERINE} />
              <circle r={7} fill={PAPER} />
            </g>
          </Out>
        </g>

        {/* Scene B: World (Paper Town Sky & Backdrop) */}
        <g className={cn(styles.sceneBLayer, styles.irisRight)}>
          <rect width={640} height={140} fill={`url(#${uid}-sky)`} />
          <rect
            width={640}
            height={140}
            fill={`url(#${uid}-grid-light)`}
            opacity={0.45}
          />
          <In at={0.2} dy={-20} filterId={softId}>
            <path
              d="M96 0 V24"
              stroke={PAPER}
              strokeOpacity={0.75}
              strokeWidth={1.6}
            />
            <path d={starPath(96, 30, 12, 5.5, 5)} fill={BUTTER} />
            <path d={cloudD} fill={PAPER} />
          </In>
        </g>

        {/* Shared morphing Protractor: Drafting tool left (Studio) → Rising Sun Arch center (World) */}
        <g
          className={styles.sharedProtractorPillTwo}
          filter={`url(#${softId})`}
        >
          <Protractor
            radius={82}
            inner={48}
            fill={BUTTER}
            core="#ffe27a"
            coreClassName={styles.sharedCore}
            foot={false}
          />
        </g>

        {/* Scene B Foreground: Connected Mountains, Wind Turbines, Solar & Houses */}
        <g className={cn(styles.sceneBLayer, styles.irisRight)}>
          <In at={0.24} dy={54} filterId={softId}>
            <MiniMountain
              left={-10}
              peakX={62}
              peakY={46}
              right={148}
              base={144}
              fill="#8fd0b0"
            />
            <MiniMountain
              left={84}
              peakX={148}
              peakY={64}
              right={230}
              base={144}
              fill="#79c2a0"
            />
            <MiniMountain
              left={410}
              peakX={496}
              peakY={62}
              right={578}
              base={144}
              fill="#79c2a0"
            />
            <MiniMountain
              left={490}
              peakX={584}
              peakY={44}
              right={660}
              base={144}
              fill="#8fd0b0"
            />
          </In>

          <In at={0.32} dy={40} filterId={softId}>
            <path
              d="M-10 112 Q160 100 320 112 Q480 122 650 108 V146 H-10 Z"
              fill={MINT_DEEP}
            />
            <MiniTurbine x={228} y={114} h={52} bladeR={24} dur={8} />
            <MiniTurbine x={392} y={114} h={46} bladeR={21} dur={6.8} />
            <MiniSolar x={460} y={84} s={0.46} />
            <MiniPine x={175} y={126} s={0.85} />
            <MiniCottage
              x={84}
              y={130}
              w={32}
              h={24}
              wall={PAPER}
              roof={TANGERINE}
            />
            <MiniCottage
              x={130}
              y={132}
              w={28}
              h={22}
              wall={PINK}
              roof={COBALT_INK}
            />
            <MiniPine x={515} y={128} s={0.78} />
            <MiniCottage
              x={558}
              y={130}
              w={30}
              h={24}
              wall={BUTTER}
              roof={COBALT_INK}
            />
          </In>
        </g>
      </svg>
    </div>
  )
}

/* ── Pill 3 Diorama: Vector Curves & Ruler ↔ Paper Town Road & Cars ────── */

function PillThreeDiorama() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const softId = `${uid}-soft`
  const cloudD = useMemo(
    () =>
      cloudPath(
        [
          { cx: 212, cy: 26, r: 9 },
          { cx: 226, cy: 20, r: 13 },
          { cx: 242, cy: 25, r: 10 },
        ],
        34,
      ),
    [],
  )

  return (
    <div className={styles.pillStage} aria-hidden="true">
      <svg
        className={styles.pillSvg}
        viewBox="0 0 320 140"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <DraftingGridDefs idPrefix={uid} cell={18} />

        {/* Scene A: Studio (Vector Splines, Control Handles, Ruler & Pencil) */}
        <g className={styles.sceneALayer}>
          <rect width={320} height={140} fill={COBALT_WASH} />
          <rect width={320} height={140} fill={`url(#${uid}-grid)`} />

          <Out at={0.04} dx={-80} dy={-40} rot={-30} filterId={softId}>
            <MiniGear
              x={46}
              y={34}
              r={18}
              teeth={8}
              fill={TANGERINE}
              dur={20}
            />
          </Out>

          <Out at={0.08} dx={85} dy={-40} rot={25} filterId={softId}>
            <g transform="translate(194 26) rotate(-8) scale(0.48)">
              <rect x={6} y={8} width={150} height={24} rx={3} fill={BUTTER} />
              <rect
                x={6}
                y={8}
                width={150}
                height={7}
                rx={3}
                fill={TANGERINE}
              />
              <rect x={150} y={8} width={14} height={24} fill={PAPER_LO} />
              <path d="M164 8 L212 20 L164 32 Z" fill={PAPER_UNDER} />
              <path d="M196 16 L212 20 L196 24 Z" fill={INK} />
              <rect
                x={0}
                y={8}
                width={12}
                height={24}
                rx={4}
                fill={TANGERINE}
              />
            </g>
          </Out>

          {/* Bezier spline curves + handles */}
          <Out at={0.05} dy={30} filterId={softId}>
            <g fill="none" strokeLinecap="round" strokeWidth={4.5}>
              <path
                d="M40 82 C92 52 132 100 184 74 C228 52 260 88 286 72"
                stroke={COBALT}
              />
              <path
                d="M34 98 C88 74 136 114 196 92 C238 78 264 102 292 90"
                stroke={TANGERINE}
              />
            </g>
            <g
              fill="none"
              stroke={COBALT}
              strokeWidth={1.3}
              strokeDasharray="3 3"
            >
              <path d="M40 82 L88 50 M286 72 L248 44" />
            </g>
            <circle cx={88} cy={50} r={3.5} fill={COBALT} />
            <circle cx={248} cy={44} r={3.5} fill={COBALT} />
            <rect
              x={35}
              y={77}
              width={10}
              height={10}
              rx={2}
              fill={PAPER}
              stroke={COBALT}
              strokeWidth={2}
            />
            <rect
              x={281}
              y={67}
              width={10}
              height={10}
              rx={2}
              fill={PAPER}
              stroke={COBALT}
              strokeWidth={2}
            />
          </Out>

          {/* Bottom drafting ruler */}
          <Out at={0.1} dx={-40} dy={50} filterId={softId}>
            <g transform="translate(56 104)">
              <rect width={166} height={20} rx={4} fill={PAPER} />
              {Array.from({ length: 18 }, (_, i) => (
                <line
                  key={i}
                  x1={8 + i * 8.8}
                  x2={8 + i * 8.8}
                  y1={0}
                  y2={i % 5 === 0 ? 11 : 6}
                  stroke={INK}
                  strokeOpacity={0.55}
                  strokeWidth={1.3}
                />
              ))}
            </g>
          </Out>
        </g>

        {/* Scene B: World (Paper Town Village Horizon, Asphalt Road & Two Cars) */}
        <g className={cn(styles.sceneBLayer, styles.irisCenter)}>
          <rect width={320} height={140} fill={`url(#${uid}-sky)`} />

          <In at={0.16} dy={-22} filterId={softId}>
            <path d={cloudD} fill={PAPER} />
          </In>

          {/* Connected mountains */}
          <In at={0.22} dy={48} filterId={softId}>
            <MiniMountain
              left={-12}
              peakX={48}
              peakY={34}
              right={114}
              base={94}
              fill="#79c2a0"
            />
            <MiniMountain
              left={188}
              peakX={252}
              peakY={30}
              right={326}
              base={94}
              fill="#79c2a0"
            />
            <MiniMountain
              left={84}
              peakX={152}
              peakY={22}
              right={224}
              base={94}
              fill="#8fd0b0"
            />
          </In>

          {/* Houses, trees & grass ridge */}
          <In at={0.28} dy={42} filterId={softId}>
            <path
              d="M-10 74 Q80 62 160 70 Q240 78 330 66 V146 H-10 Z"
              fill={MINT_DEEP}
            />
            <MiniCottage
              x={64}
              y={74}
              w={24}
              h={18}
              wall={PINK}
              roof={COBALT_INK}
            />
            <MiniPine x={98} y={76} s={0.56} />
            <MiniCottage
              x={168}
              y={74}
              w={24}
              h={19}
              wall={PAPER}
              roof={TANGERINE}
            />
            <MiniCottage
              x={238}
              y={74}
              w={26}
              h={20}
              wall={BUTTER}
              roof={COBALT_INK}
            />
            <MiniPine x={280} y={74} s={0.62} />
          </In>

          {/* Curved dark asphalt road + cars (raised so full cars & wheels show cleanly) */}
          <In at={0.34} dy={32} filterId={softId}>
            <path d="M-20 96 Q160 72 340 96 V146 H-20 Z" fill="#2b2f52" />
            <path d="M-20 101 Q160 77 340 101 V146 H-20 Z" fill="#3b3f63" />
            <path
              d="M-10 112 Q160 88 330 112"
              fill="none"
              stroke={PAPER}
              strokeOpacity={0.85}
              strokeWidth={2}
              strokeDasharray="10 8"
            />
            <MiniCar x={106} y={99} color={COBALT} amp={24} dur={6.5} />
            <MiniCar
              x={216}
              y={104}
              color={TANGERINE}
              amp={-22}
              dur={7.5}
              flip
            />
          </In>
        </g>
      </svg>
    </div>
  )
}

/* ── Die-Cut Stickers ───────────────────────────────────────────────────── */

function HiSticker() {
  return (
    <span
      className={styles.hiSticker}
      data-hero-sticker="burst"
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className={styles.stickerSvg}>
        <defs>
          <filter
            id="hi-sticker-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="3"
              floodColor="#191a2e"
              floodOpacity="0.22"
            />
          </filter>
        </defs>
        <g filter="url(#hi-sticker-shadow)">
          <path
            d={starPath(50, 50, 40, 29, 12)}
            fill={TANGERINE}
            stroke={PAPER}
            strokeWidth={7}
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fill={PAPER}
            fontFamily="var(--font-syne), system-ui, sans-serif"
            fontSize="24"
            fontWeight="800"
            letterSpacing="-0.04em"
          >
            hi!
          </text>
        </g>
      </svg>
    </span>
  )
}

function FlowerSticker() {
  return (
    <span
      className={styles.flowerSticker}
      data-hero-sticker="daisy"
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className={styles.stickerSvg}>
        <defs>
          <filter
            id="flower-sticker-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="3"
              floodColor="#191a2e"
              floodOpacity="0.22"
            />
          </filter>
          <g id="daisy-petals">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse
                key={i}
                cx="50"
                cy="25"
                rx="13.5"
                ry="16"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
          </g>
        </defs>
        <g filter="url(#flower-sticker-shadow)">
          <use
            href="#daisy-petals"
            fill={PAPER}
            stroke={PAPER}
            strokeWidth={11}
            strokeLinejoin="round"
          />
          <use href="#daisy-petals" fill={BUTTER} />
          <circle cx="50" cy="50" r="16.5" fill={TANGERINE} />
          <circle cx="44.5" cy="47.5" r="2" fill={INK} />
          <circle cx="55.5" cy="47.5" r="2" fill={INK} />
          <path
            d="M44 53.5 Q50 59 56 53.5"
            fill="none"
            stroke={INK}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </g>
      </svg>
    </span>
  )
}

/* ── Blue Cutting-Mat Markings Overlay ──────────────────────────────────── */

const MAT_RULER_NUMS = Array.from({ length: 24 }, (_, i) => ({
  index: i + 1,
  label: String(i + 1).padStart(2, '0'),
  x: 60 + i * 57.4,
}))

const MAT_TICKS = Array.from({ length: 97 }, (_, i) => ({
  index: i,
  x: 60 + i * 14.35,
  major: i % 4 === 0,
}))

const MAT_CORNERS = [
  [42, 42],
  [1398, 42],
  [42, 858],
  [1398, 858],
] as const

function CuttingMatMarks() {
  return (
    <div className={styles.cuttingMatOverlay} aria-hidden="true">
      <svg
        className={styles.cuttingMatSvg}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        {/* Inner mat hairline border */}
        <rect
          x={28}
          y={28}
          width={1384}
          height={844}
          rx={18}
          fill="none"
          stroke={PAPER}
          strokeOpacity={0.14}
          strokeWidth={1.2}
        />

        {/* Top & bottom ruler tick bars */}
        <g stroke={PAPER} strokeLinecap="round">
          {MAT_TICKS.map((t) => (
            <g key={t.index}>
              <line
                x1={t.x}
                x2={t.x}
                y1={28}
                y2={t.major ? 40 : 34}
                strokeOpacity={t.major ? 0.28 : 0.14}
                strokeWidth={t.major ? 1.2 : 0.8}
              />
              <line
                x1={t.x}
                x2={t.x}
                y1={872}
                y2={t.major ? 860 : 866}
                strokeOpacity={t.major ? 0.28 : 0.14}
                strokeWidth={t.major ? 1.2 : 0.8}
              />
            </g>
          ))}
        </g>

        {/* Monospace ruler numbers 01..24 */}
        <g
          fill={PAPER}
          fillOpacity={0.24}
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10"
          fontWeight="600"
          textAnchor="middle"
        >
          {MAT_RULER_NUMS.map((n) => (
            <g key={n.index}>
              <text x={n.x} y={53}>
                {n.label}
              </text>
              <text x={n.x} y={854}>
                {n.label}
              </text>
            </g>
          ))}
        </g>

        {/* Cutting-mat 30° / 45° / 60° protractor guide arcs */}
        <g
          fill="none"
          stroke={PAPER}
          strokeOpacity={0.11}
          strokeWidth={1.2}
          strokeDasharray="6 6"
        >
          <path d="M 720 872 A 420 420 0 0 1 1140 452" />
          <path d="M 720 872 A 420 420 0 0 0 300 452" />
          <line x1={720} y1={872} x2={1140} y2={452} />
          <line x1={720} y1={872} x2={300} y2={452} />
          <line x1={720} y1={872} x2={1084} y2={662} />
          <line x1={720} y1={872} x2={356} y2={662} />
          <line x1={720} y1={872} x2={930} y2={508} />
          <line x1={720} y1={872} x2={510} y2={508} />
        </g>

        {/* Corner registration crosshairs (+) */}
        <g stroke={PAPER} strokeOpacity={0.28} strokeWidth={1.4}>
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

/* ── Cycle Word Slot ────────────────────────────────────────────────────── */

function CycleWord({
  word,
  onClick,
  reduced,
  label,
}: {
  word: string
  onClick: () => void
  reduced: boolean
  label: string
}) {
  return (
    <button
      type="button"
      className={cn(styles.word, styles.wordInteractive)}
      onClick={onClick}
      aria-label={`${word} — click to cycle phrasing (${label})`}
      title="Click to cycle"
    >
      <span className={styles.wordViewport}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            className={styles.wordInner}
            initial={reduced ? false : { y: '65%', opacity: 0, scale: 0.95 }}
            animate={{ y: '0%', opacity: 1, scale: 1 }}
            exit={
              reduced ? { opacity: 0 } : { y: '-65%', opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.28, ease: PAPER_EASE }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

/**
 * Sunnyside Typographic Inline-Pill Diorama Hero.
 *
 * Three oversized condensed typographic rows frame three inline pill
 * diorama windows over a Cobalt Blue cutting mat. When idle, dynamic words
 * cycle smoothly across rows on a steady beat; toggling Studio ↔ World (or
 * clicking any pill window) morphs all three windows simultaneously between
 * Technic Drafting (`Studio`) and Paper Town (`World`).
 */
export function Hero({ surface = 'cobalt' }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false

  const [scene, setScene] = useState<HeroScene>('studio')
  const [slot1, setSlot1] = useState(0)
  const [slot2, setSlot2] = useState(0)
  const [slot3, setSlot3] = useState(0)
  const [isHeld, setIsHeld] = useState(false)

  const tValue = useMotionValue(0)
  const tweenRef = useRef<ReturnType<typeof animate> | null>(null)

  useMotionValueEvent(tValue, 'change', (v) => {
    sectionRef.current?.style.setProperty('--t', v.toFixed(4))
  })

  const staggerTimersRef = useRef<number[]>([])

  const clearStaggers = useCallback(() => {
    for (const id of staggerTimersRef.current) {
      window.clearTimeout(id)
    }
    staggerTimersRef.current = []
  }, [])

  const switchScene = useCallback(
    (next: HeroScene) => {
      clearStaggers()
      setScene(next)
      // Sync copy preset with active scene while keeping manual clicking available
      if (next === 'studio') {
        setSlot1(0)
        setSlot2(0)
        setSlot3(0)
      } else {
        setSlot1(1)
        setSlot2(1)
        setSlot3(1)
      }

      const target = next === 'world' ? 1 : 0
      tweenRef.current?.stop()
      if (reduced) {
        tValue.set(target)
        return
      }
      tweenRef.current = animate(tValue, target, {
        duration: 0.72,
        ease: PAPER_EASE,
      })
    },
    [clearStaggers, reduced, tValue],
  )

  useEffect(() => () => tweenRef.current?.stop(), [])

  const advanceAllRows = useCallback(() => {
    clearStaggers()
    setSlot1((i) => (i + 1) % SLOT_1_WORDS.length)
    const t2 = window.setTimeout(() => {
      setSlot2((i) => (i + 1) % SLOT_2_WORDS.length)
    }, 90)
    const t3 = window.setTimeout(() => {
      setSlot3((i) => (i + 1) % SLOT_3_PAIRS.length)
    }, 180)
    staggerTimersRef.current = [t2, t3]
  }, [clearStaggers])

  useEffect(() => () => clearStaggers(), [clearStaggers])

  // Idle auto-switching text beat with staggered cascade (pauses on hover/focus/offscreen/reduced)
  useEffect(() => {
    if (reduced || isHeld) return
    const section = sectionRef.current
    if (!section) return

    const BEAT = 3400
    let mainTimer = 0
    let onScreen = true

    const schedule = () => {
      window.clearTimeout(mainTimer)
      if (document.hidden || !onScreen || isHeld) {
        clearStaggers()
        return
      }
      mainTimer = window.setTimeout(() => {
        advanceAllRows()
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
            { threshold: 0.25 },
          )
    observer?.observe(section)

    document.addEventListener('visibilitychange', schedule)
    schedule()

    return () => {
      window.clearTimeout(mainTimer)
      clearStaggers()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [reduced, isHeld, advanceAllRows, clearStaggers])

  const toggleScene = useCallback(
    () => switchScene(scene === 'studio' ? 'world' : 'studio'),
    [scene, switchScene],
  )

  const word1 = SLOT_1_WORDS[slot1 % SLOT_1_WORDS.length]
  const word2 = SLOT_2_WORDS[slot2 % SLOT_2_WORDS.length]
  const pair3 = SLOT_3_PAIRS[slot3 % SLOT_3_PAIRS.length]

  const cycleAll = advanceAllRows

  return (
    <section
      id="home"
      ref={sectionRef}
      className={cn(styles.hero, oswald.variable)}
      data-surface={surface}
      data-scene={scene}
      aria-labelledby="hero-title"
    >
      <CuttingMatMarks />
      <MotionConfig reducedMotion="user">
        <div className={styles.heroContainer}>
          <h1 id="hero-title" className={styles.srOnly}>
            I bring {word1.toLowerCase()} and {word2.toLowerCase()} to{' '}
            {pair3.before.toLowerCase()} {pair3.after.toLowerCase()}
          </h1>

          {/* 3-Row Oversized Typographic + Inline Pill Diorama Grid */}
          <div
            className={styles.headlineGrid}
            onPointerEnter={() => setIsHeld(true)}
            onPointerLeave={() => setIsHeld(false)}
            onFocusCapture={() => setIsHeld(true)}
            onBlurCapture={() => setIsHeld(false)}
          >
            {/* Row 1: I BRING [Pill 1] CLARITY / WARMTH */}
            <div className={styles.row}>
              <span className={styles.word}>I BRING</span>
              <button
                type="button"
                className={styles.pillWindow}
                onClick={toggleScene}
                aria-label={`Interactive diorama window 1 (${
                  scene === 'studio' ? 'Technic studio' : 'Paper town world'
                }) — click to switch scene`}
              >
                <PillOneDiorama />
              </button>
              <CycleWord
                word={word1}
                onClick={cycleAll}
                reduced={reduced}
                label="row 1"
              />
            </div>

            {/* Row 2: & [Wide Pill 2] CRAFT / DETAIL */}
            <div className={styles.row}>
              <span className={styles.word}>&amp;</span>
              <button
                type="button"
                className={cn(styles.pillWindow, styles.pillWindowWide)}
                onClick={toggleScene}
                aria-label={`Interactive diorama window 2 (${
                  scene === 'studio'
                    ? 'Drafting workshop'
                    : 'Paper town panorama'
                }) — click to switch scene`}
              >
                <PillTwoDiorama />
              </button>
              <CycleWord
                word={word2}
                onClick={cycleAll}
                reduced={reduced}
                label="row 2"
              />
            </div>

            {/* Row 3: TO(hi!) WEB [Pill 3](daisy) SYSTEMS / PRODUCT [Pill 3] UI */}
            <div className={styles.row}>
              <span className={styles.tokenWithSticker}>
                <span className={styles.word}>TO</span>
                <HiSticker />
              </span>
              <CycleWord
                word={pair3.before}
                onClick={cycleAll}
                reduced={reduced}
                label="row 3 qualifier"
              />
              <span className={styles.pillThreeWrap}>
                <button
                  type="button"
                  className={cn(styles.pillWindow, styles.pillWindowThree)}
                  onClick={toggleScene}
                  aria-label={`Interactive diorama window 3 (${
                    scene === 'studio' ? 'Vector splines' : 'Paper town street'
                  }) — click to switch scene`}
                >
                  <PillThreeDiorama />
                </button>
                <FlowerSticker />
              </span>
              <CycleWord
                word={pair3.after}
                onClick={cycleAll}
                reduced={reduced}
                label="row 3 noun"
              />
            </div>
          </div>

          {/* Bottom Bar Chrome */}
          <div className={styles.bottomBar}>
            <div className={styles.bottomLeft}>
              <button
                type="button"
                className={styles.seeWorkBtn}
                onClick={() => scrollToSection('work', reduced)}
              >
                <span>See work</span>
                <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden />
              </button>
              <span className={styles.metaPill}>Jakarta · GMT+7</span>
              <button
                type="button"
                className={cn(styles.metaPill, styles.metaPillBtn)}
                onClick={() => scrollToSection('contact', reduced)}
              >
                Available for projects
              </button>
            </div>

            <div
              className={styles.sceneSwitch}
              role="group"
              aria-label="Hero diorama scene"
            >
              {(['studio', 'world'] as const).map((mode) => {
                const isActive = scene === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    className={styles.sceneBtn}
                    aria-pressed={isActive}
                    onClick={() => switchScene(mode)}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="hero-scene-pill"
                        className={styles.sceneThumb}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className={styles.sceneLabel}>
                      {mode === 'studio' ? 'Studio' : 'World'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Hidden compatibility hooks for About sticker gravity tray */}
          <div className={styles.hooks} aria-hidden="true">
            <span data-hero-sticker="smiley" data-slot="smiley" />
            <span data-hero-sticker="bolt" data-slot="bolt" />
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
