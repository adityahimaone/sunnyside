'use client'

import { ArrowRight, Moon, Sun as SunIcon } from 'lucide-react'
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

/* The "I BRING" row uses Kubai icons with a palette accent each. They act
   themselves out on every word change — driven by the controlled `hover`
   prop with `trigger="none"`, so no pointer is needed. The "&" and "TO" rows
   keep their original text glyphs. */
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

/* ── Time of day ──────────────────────────────────────────────────────────
   One number drives the whole diorama. `t` runs 0 (noon) → 1 (midnight); the
   pull tab, the sky wheel, the palette, the stars and the lit windows are all
   functions of it, written as CSS custom properties on the stage. That is
   what lets a drag scrub the scene as smoothly as a click plays it.

   Negative `t` is dawn: the page opens at BOOT_T with the sun still behind
   the hills and the sky peach, then the wheel turns it up to noon. */

const BOOT_T = -0.42

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

function paintTime(el: HTMLElement, t: number) {
  // `ta` blends noon → dusk (and dawn → noon); `tb` blends dusk → night.
  const ta = Math.max(clamp(t * 2, 0, 1), clamp(-t * 3, 0, 1))
  const tb = clamp(t * 2 - 1, 0, 1)
  el.style.setProperty('--t', t.toFixed(4))
  el.style.setProperty('--ta', `${(ta * 100).toFixed(2)}%`)
  el.style.setProperty('--tb', `${(tb * 100).toFixed(2)}%`)
}

type Triplet = readonly [day: string, dusk: string, night: string]

/* Sunnyside paper in three lights. Every slot keeps its role (sky, hill,
   roof…) and only the light changes, so the pull reads as the same
   diorama turning, not a different picture. */
const PALETTE = {
  sky: ['#a9c8ff', '#ffb59a', '#141a52'],
  ring1: ['#bcd3ff', '#ffc8a6', '#1a2169'],
  ring2: ['#d2e1ff', '#ffd7ad', '#222b85'],
  ring3: ['#fff0c6', '#ffe6a6', '#2d3bb0'],
  far: ['#8fb0f5', '#d69bb4', '#27369a'],
  mid: ['#b7e4c7', '#efb9ae', '#1d5a76'],
  near: ['#7fcf9d', '#e29f9a', '#17495f'],
  bank: ['#fffaf1', '#ffe9d8', '#2c3cae'],
  fg: ['#191a2e', '#191a2e', '#fffaf1'],
  cloud: ['#fffaf1', '#ffe0d0', '#4f62d8'],
  win: ['#a9c8ff', '#ffd9a0', '#ffd23f'],
  title: ['#fffaf1', '#fffaf1', '#ffd23f'],
  trunk: ['#c9692f', '#b95a3a', '#7a3d3a'],
  treeA: ['#58b98a', '#d28a7e', '#1c6b66'],
  treeB: ['#ffb6e1', '#f4a0b8', '#9a5db0'],
  wallA: ['#fffaf1', '#ffe3cf', '#8b93d6'],
  wallB: ['#ffb6e1', '#f6a3b3', '#8e5fae'],
  wallC: ['#ffd23f', '#ffbd5a', '#b88a2e'],
  roofA: ['#ff6a2b', '#e5532f', '#a03b3a'],
  roofB: ['#3d53d6', '#5a56b8', '#232f96'],
} as const satisfies Record<string, Triplet>

type Token = keyof typeof PALETTE

const mixLight = ([day, dusk, night]: Triplet) =>
  `color-mix(in srgb, color-mix(in srgb, ${day} calc(100% - var(--ta)), ${dusk}) calc(100% - var(--tb)), ${night})`

const PAPER_VARS = Object.fromEntries(
  Object.entries(PALETTE).map(([token, triplet]) => [
    `--c-${token}`,
    mixLight(triplet),
  ]),
) as CSSProperties

const fillOf = (token: Token): CSSProperties => ({ fill: `var(--c-${token})` })

const vars = (values: Record<string, string | number>) =>
  values as CSSProperties

/* ── Paper ────────────────────────────────────────────────────────────────
   Every shape is a sheet: a flat fill, a printed ink edge, and a hard
   offset copy underneath standing in for the shadow. No blur, no glass. */

function Paper({
  d,
  fill,
  shade = [0, 8],
  className,
}: {
  d: string
  fill: Token
  shade?: readonly [number, number] | null
  className?: string
}) {
  return (
    <>
      {shade ? (
        <path
          d={d}
          className={styles.shade}
          style={{ translate: `${shade[0]}px ${shade[1]}px` }}
        />
      ) : null}
      <path d={d} className={cn(styles.ink, className)} style={fillOf(fill)} />
    </>
  )
}

type Lobe = { cx: number; cy: number; r: number }

/** A cloud outline as one path: arcs over each lobe, valley to valley, then
 *  a flat base — the cut-paper silhouette with no inner seams. */
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

/* ── Scene geometry (1440 × 860 stage units) ──────────────────────────── */

const WHEEL = { cx: 720, cy: 720, r: 430 } as const

const RINGS = [
  { r: 760, token: 'ring1', delay: 0.08 },
  { r: 610, token: 'ring2', delay: 0.18 },
  { r: 480, token: 'ring3', delay: 0.28 },
] as const

/* The orbit's stitching: dots that ride the wheel, so a pull is visible even
   where the sun and moon are hidden behind a hill. */
const ORBIT_DOTS = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * Math.PI * 2
  return {
    x: round(Math.cos(a) * WHEEL.r),
    y: round(Math.sin(a) * WHEEL.r),
    r: i % 3 === 0 ? 4.6 : 2.8,
    color: i % 3 === 0 ? 'var(--h-tangerine)' : 'var(--h-paper)',
  }
})

/** `at` is the time of night a star switches on, so they arrive in turn. */
const STARS = [
  { x: 120, y: 150, k: 0.7, at: 0.62, tw: 0.2 },
  { x: 262, y: 300, k: 0.5, at: 0.7, tw: 1.1 },
  { x: 384, y: 118, k: 0.8, at: 0.58, tw: 0.6 },
  { x: 520, y: 214, k: 0.45, at: 0.8, tw: 1.7 },
  { x: 612, y: 92, k: 0.6, at: 0.66, tw: 0.9 },
  { x: 858, y: 108, k: 0.55, at: 0.74, tw: 1.4 },
  { x: 982, y: 232, k: 0.75, at: 0.6, tw: 0.3 },
  { x: 1090, y: 126, k: 0.5, at: 0.84, tw: 1.9 },
  { x: 1204, y: 304, k: 0.65, at: 0.68, tw: 0.7 },
  { x: 1312, y: 168, k: 0.8, at: 0.76, tw: 1.2 },
  { x: 1384, y: 366, k: 0.45, at: 0.88, tw: 0.5 },
  { x: 62, y: 332, k: 0.6, at: 0.9, tw: 1.6 },
  { x: 462, y: 404, k: 0.4, at: 0.92, tw: 0.1 },
  { x: 1012, y: 404, k: 0.45, at: 0.78, tw: 1.0 },
] as const

const SPARKLE =
  'M0 -21C2.5 -8 8 -2.5 21 0C8 2.5 2.5 8 0 21C-2.5 8 -8 2.5 -21 0C-8 -2.5 -2.5 -8 0 -21Z'

const CLOUDS = [
  {
    id: 'a',
    lobes: [
      { cx: 196, cy: 318, r: 30 },
      { cx: 240, cy: 298, r: 42 },
      { cx: 294, cy: 310, r: 34 },
      { cx: 332, cy: 326, r: 22 },
    ],
    base: 346,
    from: -380,
    delay: 0.62,
    dir: 1,
    amp: 22,
    dur: 36,
    depth: 0.5,
  },
  {
    id: 'b',
    lobes: [
      { cx: 1100, cy: 206, r: 26 },
      { cx: 1140, cy: 188, r: 40 },
      { cx: 1196, cy: 196, r: 34 },
      { cx: 1236, cy: 212, r: 24 },
    ],
    base: 232,
    from: 380,
    delay: 0.78,
    dir: -1,
    amp: 26,
    dur: 42,
    depth: 0.56,
  },
  {
    id: 'c',
    lobes: [
      { cx: 1030, cy: 500, r: 22 },
      { cx: 1066, cy: 484, r: 32 },
      { cx: 1108, cy: 496, r: 25 },
    ],
    base: 520,
    from: 320,
    delay: 0.94,
    dir: 1,
    amp: 16,
    dur: 30,
    depth: 0.62,
  },
  {
    id: 'd',
    lobes: [
      { cx: 420, cy: 484, r: 20 },
      { cx: 452, cy: 470, r: 29 },
      { cx: 492, cy: 482, r: 22 },
    ],
    base: 502,
    from: -320,
    delay: 1.02,
    dir: -1,
    amp: 18,
    dur: 33,
    depth: 0.66,
  },
] as const

const FAR_HILL =
  'M-40 860 V640 C60 600 160 570 280 580 C400 590 470 628 600 626 C720 624 800 586 920 580 C1040 574 1130 584 1250 580 C1340 577 1410 590 1480 610 V860 Z'
const MID_LEFT_HILL =
  'M-40 860 V700 C60 660 160 640 280 646 C400 652 480 690 600 700 C690 706 760 730 820 760 V860 Z'
const MID_RIGHT_HILL =
  'M560 860 V740 C660 720 760 676 900 650 C1020 628 1140 622 1260 640 C1350 654 1420 650 1480 640 V860 Z'
const BANK =
  'M-40 860 V704 C80 684 200 676 330 686 C470 698 560 738 740 746 C900 752 1020 730 1160 712 C1280 697 1390 698 1480 712 V860 Z'

type HouseSpec = {
  x: number
  y: number
  w: number
  h: number
  wall: Token
  roof: Token
  delay: number
  chimney?: boolean
}

const HOUSES: readonly HouseSpec[] = [
  { x: 330, y: 604, w: 66, h: 54, wall: 'wallC', roof: 'roofB', delay: 1.05 },
  { x: 1018, y: 598, w: 70, h: 58, wall: 'wallA', roof: 'roofA', delay: 1.12 },
  {
    x: 1104,
    y: 592,
    w: 58,
    h: 78,
    wall: 'wallB',
    roof: 'roofB',
    delay: 1.2,
    chimney: true,
  },
  { x: 1190, y: 590, w: 80, h: 60, wall: 'wallC', roof: 'roofA', delay: 1.28 },
  { x: 1282, y: 598, w: 54, h: 46, wall: 'wallA', roof: 'roofB', delay: 1.36 },
]

const TREES = [
  { x: 130, y: 656, s: 1.1, crown: 'treeA', delay: 1.1, lean: 1.6 },
  { x: 232, y: 650, s: 0.88, crown: 'treeB', delay: 1.18, lean: -1.4 },
  { x: 440, y: 678, s: 0.68, crown: 'treeA', delay: 1.26, lean: 1.2 },
  { x: 1332, y: 658, s: 1, crown: 'treeB', delay: 1.3, lean: -1.6 },
  { x: 1408, y: 652, s: 0.8, crown: 'treeA', delay: 1.38, lean: 1.4 },
] as const

const FLOWERS = [
  { x: 600, y: 742, h: 30, petal: 'wallB', delay: 1.5 },
  { x: 665, y: 750, h: 40, petal: 'wallA', delay: 1.56 },
  { x: 770, y: 757, h: 28, petal: 'roofA', delay: 1.62 },
  { x: 870, y: 756, h: 36, petal: 'wallB', delay: 1.68 },
  { x: 990, y: 745, h: 26, petal: 'wallA', delay: 1.74 },
  { x: 1090, y: 732, h: 38, petal: 'roofA', delay: 1.8 },
  { x: 1190, y: 718, h: 30, petal: 'wallB', delay: 1.86 },
  { x: 1300, y: 710, h: 40, petal: 'wallA', delay: 1.92 },
  { x: 1390, y: 712, h: 28, petal: 'roofA', delay: 1.98 },
] as const

/* ── Scene parts ──────────────────────────────────────────────────────── */

function SunArt() {
  const rays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 - Math.PI / 2
        const outer = i % 2 === 0 ? 114 : 98
        const at = (angle: number, radius: number) =>
          `${round(Math.cos(angle) * radius)},${round(Math.sin(angle) * radius)}`
        return `${at(a - 0.15, 62)} ${at(a, outer)} ${at(a + 0.15, 62)}`
      }),
    [],
  )

  return (
    <>
      <g className={styles.sunRays}>
        {/* An invisible disc keeps the group's box symmetric, so the rays
            turn about the sun's centre and not about their own bounds. */}
        <circle r={116} fill="none" />
        {rays.map((points, i) => (
          <polygon
            key={i}
            points={points}
            className={styles.ink}
            style={{
              fill: i % 2 === 0 ? 'var(--h-butter)' : 'var(--h-tangerine)',
            }}
          />
        ))}
      </g>
      <circle
        r={66}
        className={styles.ink}
        style={{ fill: 'var(--h-butter)' }}
      />
      <circle cx={-21} cy={-8} r={5.6} fill="var(--h-ink)" />
      <circle cx={21} cy={-8} r={5.6} fill="var(--h-ink)" />
      <ellipse
        cx={-37}
        cy={10}
        rx={10}
        ry={6}
        fill="var(--h-tangerine)"
        opacity={0.55}
      />
      <ellipse
        cx={37}
        cy={10}
        rx={10}
        ry={6}
        fill="var(--h-tangerine)"
        opacity={0.55}
      />
      <path
        d="M-23 14 Q0 38 23 14"
        className={styles.mark}
        fill="none"
        strokeWidth={5}
      />
    </>
  )
}

function MoonArt() {
  return (
    <>
      <circle r={100} fill="var(--h-paper)" opacity={0.14} />
      <circle
        r={72}
        className={styles.ink}
        style={{ fill: 'var(--h-paper)' }}
      />
      <circle cx={26} cy={-24} r={11} fill="#ddd2b6" />
      <circle cx={34} cy={14} r={7.5} fill="#ddd2b6" />
      <circle cx={-6} cy={34} r={5} fill="#ddd2b6" />
      <circle cx={-44} cy={-26} r={4} fill="#ddd2b6" />
      <path
        d="M-30 -6 Q-21 1 -12 -6"
        className={styles.mark}
        fill="none"
        strokeWidth={4.4}
      />
      <path
        d="M12 -6 Q21 1 30 -6"
        className={styles.mark}
        fill="none"
        strokeWidth={4.4}
      />
      <path
        d="M-8 12 Q0 19 8 12"
        className={styles.mark}
        fill="none"
        strokeWidth={4}
      />
      <ellipse
        cx={-34}
        cy={8}
        rx={9}
        ry={5.4}
        fill="var(--h-pink)"
        opacity={0.7}
      />
      <ellipse
        cx={34}
        cy={8}
        rx={9}
        ry={5.4}
        fill="var(--h-pink)"
        opacity={0.7}
      />
    </>
  )
}

function Cloud({ spec }: { spec: (typeof CLOUDS)[number] }) {
  const d = useMemo(() => cloudPath(spec.lobes, spec.base), [spec])
  return (
    <g className={styles.px} style={vars({ '--depth': spec.depth })}>
      {/* slide: tied to the time of day. in: the entrance. drift: the rest. */}
      <g className={styles.cloudSlide} style={vars({ '--dir': spec.dir })}>
        <g
          className={styles.cloudIn}
          style={vars({ '--from': `${spec.from}px`, '--d': `${spec.delay}s` })}
        >
          <g
            className={styles.cloudDrift}
            style={vars({ '--amp': `${spec.amp}px`, '--dur': `${spec.dur}s` })}
          >
            <Paper d={d} fill="cloud" shade={[5, 9]} />
          </g>
        </g>
      </g>
    </g>
  )
}

function House({ spec }: { spec: HouseSpec }) {
  const { x, y, w, h, wall, roof, delay, chimney } = spec
  const roofH = Math.round(w * 0.5)
  const body = `M${-w / 2} 0 V${-h} H${w / 2} V0 Z`
  const lid = `M${-w / 2 - 7} ${-h} L0 ${-h - roofH} L${w / 2 + 7} ${-h} Z`
  const pane = round(w * 0.22)
  const paneY = round(-h * 0.72)
  const paneX = round(w * 0.14)

  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={styles.pop} style={vars({ '--d': `${delay}s` })}>
        <g className={styles.sway} style={vars({ '--sw': '0.8deg' })}>
          <path
            d={body}
            className={styles.shade}
            style={{ translate: '6px 5px' }}
          />
          <path
            d={lid}
            className={styles.shade}
            style={{ translate: '6px 5px' }}
          />
          {chimney ? (
            <rect
              x={round(w * 0.16)}
              y={-h - roofH * 0.82}
              width={10}
              height={roofH * 0.6}
              className={styles.ink}
              style={fillOf('roofA')}
            />
          ) : null}
          <path d={body} className={styles.ink} style={fillOf(wall)} />
          <path d={lid} className={styles.ink} style={fillOf(roof)} />
          {[-1, 1].map((side) => {
            const px = side < 0 ? -paneX - pane : paneX
            return (
              <g key={side}>
                <circle
                  className={styles.glow}
                  cx={round(px + pane / 2)}
                  cy={round(paneY + pane / 2)}
                  r={round(w * 0.3)}
                />
                <rect
                  x={px}
                  y={paneY}
                  width={pane}
                  height={pane}
                  rx={2}
                  className={styles.ink}
                  style={fillOf('win')}
                />
              </g>
            )
          })}
          <rect
            x={round(-w * 0.1)}
            y={round(-h * 0.36)}
            width={round(w * 0.2)}
            height={round(h * 0.36)}
            className={styles.ink}
            style={fillOf('roofA')}
          />
        </g>
      </g>
    </g>
  )
}

function Tree({ spec }: { spec: (typeof TREES)[number] }) {
  return (
    <g transform={`translate(${spec.x} ${spec.y}) scale(${spec.s})`}>
      <g className={styles.pop} style={vars({ '--d': `${spec.delay}s` })}>
        <g className={styles.sway} style={vars({ '--sw': `${spec.lean}deg` })}>
          <rect
            x={-6}
            y={-40}
            width={12}
            height={40}
            className={styles.ink}
            style={fillOf('trunk')}
          />
          <circle
            cx={0}
            cy={-70}
            r={34}
            className={styles.ink}
            style={fillOf(spec.crown)}
          />
          <path
            d="M-18 -78 Q-8 -94 8 -90"
            className={styles.mark}
            fill="none"
            stroke="var(--h-paper)"
            strokeWidth={4}
            opacity={0.7}
          />
        </g>
      </g>
    </g>
  )
}

function Flower({ spec }: { spec: (typeof FLOWERS)[number] }) {
  return (
    <g transform={`translate(${spec.x} ${spec.y})`}>
      <g className={styles.bloom} style={vars({ '--d': `${spec.delay}s` })}>
        <g className={styles.sway} style={vars({ '--sw': '3deg' })}>
          <path
            d={`M0 0 V${-spec.h}`}
            className={styles.ink}
            fill="none"
            style={{ stroke: 'var(--h-ink)' }}
          />
          {[0, 72, 144, 216, 288].map((deg) => (
            <circle
              key={deg}
              cx={round(Math.sin((deg * Math.PI) / 180) * 9)}
              cy={round(-spec.h - Math.cos((deg * Math.PI) / 180) * 9)}
              r={7.5}
              className={styles.ink}
              style={fillOf(spec.petal)}
            />
          ))}
          <circle
            cx={0}
            cy={-spec.h}
            r={6.5}
            className={styles.ink}
            style={{ fill: 'var(--h-butter)' }}
          />
        </g>
      </g>
    </g>
  )
}

/* ── Headline rows ────────────────────────────────────────────────────── */

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
        style={{ stroke }}
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
          style={{ stroke }}
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
 * One row of the headline: a fixed lead word and a gold pill holding the word
 * that changes.
 *
 * The pill keeps its width behind an invisible sizer, so a swap never reflows
 * the sentence around it. The words ride a tape behind a clipped window — the
 * retiring word leaves through the top edge while the next rises from below.
 * Kubai icons get a controlled `hover` pulse on every word change, so they act
 * themselves out without a pointer.
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
          <span className={styles.pillIcon}>{renderIcon(widest, false)}</span>
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
              <span className={styles.pillIcon}>
                {renderIcon(current, true)}
              </span>
              <span>{current.word}</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

const TRACK_PAD = 4

/**
 * Sunnyside Diorama Hero.
 *
 * A paper shadow box with a working mechanism. A sky wheel hides behind the
 * hills with the sun on one end and the moon on the other; the pull tab on the
 * top rail slides it, and everything else — sky, hills, stars, lit windows,
 * the title's colour — follows one time-of-day value. The page opens on that
 * wheel turning: the sun climbs out from behind the hills while the paper
 * sheets rise into place one depth at a time.
 */
export function Hero({ surface = 'cobalt' }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  const [act, setAct] = useState<'day' | 'night'>('day')
  const [physicsOn, setPhysicsOn] = useState(true)
  const [writeKey, setWriteKey] = useState(0)
  const [phrase, setPhrase] = useState(0)
  const [phraseHeld, setPhraseHeld] = useState(false)
  const physicsActive = physicsOn && !reduced

  // ── Time of day ───────────────────────────────────────────────────────
  const progress = useMotionValue(BOOT_T)
  const tween = useRef<ReturnType<typeof animate> | null>(null)
  const actRef = useRef<'day' | 'night'>('day')

  useMotionValueEvent(progress, 'change', (t) => {
    if (stageRef.current) paintTime(stageRef.current, t)
  })

  // The sunrise: the stage is already at dawn from the first paint (CSS
  // `data-boot`), so this only has to hand over and turn the wheel.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (reduced) {
      progress.set(0)
      paintTime(el, 0)
      delete el.dataset.boot
      return
    }
    paintTime(el, BOOT_T)
    delete el.dataset.boot
    const controls = animate(progress, 0, {
      duration: 2.7,
      delay: 0.3,
      ease: [0.3, 0, 0.15, 1],
    })
    tween.current = controls
    return () => controls.stop()
  }, [reduced, progress])

  const goTo = useCallback(
    (to: 0 | 1) => {
      tween.current?.stop()
      const next = to === 1 ? 'night' : 'day'
      actRef.current = next
      setAct(next)
      if (reduced) {
        progress.set(to)
        return
      }
      const el = stageRef.current
      if (el) el.dataset.pulling = 'true'
      /* A spring, not a tween: the wheel is a heavy paper disc, so it
         overshoots a few degrees and settles. */
      tween.current = animate(progress, to, {
        type: 'spring',
        stiffness: 46,
        damping: 9.5,
        restDelta: 0.0008,
        restSpeed: 0.004,
        onComplete: () => {
          if (stageRef.current) delete stageRef.current.dataset.pulling
        },
      })
    },
    [progress, reduced],
  )

  useEffect(() => () => tween.current?.stop(), [])

  // ── The pull tab: click, key, or drag along its slot ──────────────────
  const dragRef = useRef<{
    startX: number
    startT: number
    moved: boolean
  } | null>(null)
  const swallowClick = useRef(false)

  const toggle = useCallback(
    () => goTo(actRef.current === 'day' ? 1 : 0),
    [goTo],
  )

  const onTabDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    tween.current?.stop()
    dragRef.current = {
      startX: event.clientX,
      startT: progress.get(),
      moved: false,
    }
  }

  const onTabMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return
    const dx = event.clientX - drag.startX
    if (!drag.moved && Math.abs(dx) < 5) return
    drag.moved = true
    const range = Math.max(
      1,
      track.clientWidth - event.currentTarget.offsetWidth - TRACK_PAD * 2,
    )
    progress.set(clamp(drag.startT + dx / range, 0, 1))
  }

  const onTabUp = () => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return
    swallowClick.current = true
    if (drag.moved) goTo(progress.get() >= 0.5 ? 1 : 0)
    else toggle()
  }

  const onTabClick = () => {
    // A pointer press already toggled on release; this is the keyboard path.
    if (swallowClick.current) {
      swallowClick.current = false
      return
    }
    toggle()
  }

  const onTabKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(1)
    } else if (event.key === 'ArrowLeft') {
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

  // Scrolling away lets the layers separate; the far ones lag the page.
  // The same observer idles the ambient loops while the hero is off-screen.
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
  // All three rows turn over on one beat. It holds whenever a visitor takes
  // over — pointer over the stack, focus in it, the tab hidden, the hero
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
        <div className={styles.box}>
          <span className={cn(styles.tape, styles.tapeLeft)} aria-hidden />
          <span className={cn(styles.tape, styles.tapeRight)} aria-hidden />

          <div
            ref={stageRef}
            className={styles.window}
            style={PAPER_VARS}
            data-boot="true"
            data-act={act}
          >
            {/* ── Scene ───────────────────────────────────────────────── */}
            <div className={styles.scene}>
              {/* Back sheets: sky, the wheel, clouds, the far hill and the
                  town on it. */}
              <svg
                className={cn(styles.svg, styles.svgBack)}
                viewBox="0 0 1440 860"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden
                focusable="false"
              >
                <g className={styles.px} style={vars({ '--depth': 0.1 })}>
                  <rect
                    x={-160}
                    y={-160}
                    width={1760}
                    height={1180}
                    style={fillOf('sky')}
                  />
                  {RINGS.map((ring) => (
                    <g
                      key={ring.r}
                      className={styles.ringIn}
                      style={vars({ '--d': `${ring.delay}s` })}
                    >
                      <circle
                        cx={WHEEL.cx}
                        cy={WHEEL.cy}
                        r={ring.r}
                        className={styles.ring}
                        style={fillOf(ring.token)}
                      />
                    </g>
                  ))}
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.2 })}>
                  {STARS.map((star, i) => (
                    <g
                      key={i}
                      transform={`translate(${star.x} ${star.y}) scale(${star.k})`}
                    >
                      <g
                        className={styles.star}
                        style={vars({ '--at': star.at })}
                      >
                        <path
                          d={SPARKLE}
                          className={styles.starGlyph}
                          style={vars({ '--tw': `${star.tw}s` })}
                        />
                      </g>
                    </g>
                  ))}
                  <g className={styles.shoot}>
                    <path d="M0 0 L-120 -34" className={styles.shootTail} />
                    <circle r={4.5} fill="var(--h-paper)" />
                  </g>
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.34 })}>
                  <g className={styles.wheel}>
                    <circle
                      cx={WHEEL.cx}
                      cy={WHEEL.cy}
                      r={WHEEL.r}
                      className={styles.orbit}
                    />
                    <g transform={`translate(${WHEEL.cx} ${WHEEL.cy})`}>
                      {ORBIT_DOTS.map((dot, i) => (
                        <circle
                          key={i}
                          cx={dot.x}
                          cy={dot.y}
                          r={dot.r}
                          fill={dot.color}
                          opacity={0.9}
                        />
                      ))}
                    </g>
                    <g
                      transform={`translate(${WHEEL.cx} ${WHEEL.cy - WHEEL.r})`}
                    >
                      <g className={styles.upright}>
                        <SunArt />
                      </g>
                    </g>
                    <g
                      transform={`translate(${WHEEL.cx} ${WHEEL.cy + WHEEL.r})`}
                    >
                      <g className={styles.upright}>
                        <MoonArt />
                      </g>
                    </g>
                  </g>
                </g>

                {CLOUDS.map((cloud) => (
                  <Cloud key={cloud.id} spec={cloud} />
                ))}

                <g className={styles.px} style={vars({ '--depth': 0.5 })}>
                  <g className={styles.slideFar}>
                    <g
                      className={styles.rise}
                      style={vars({ '--d': '0.4s', '--from': '170px' })}
                    >
                      <Paper d={FAR_HILL} fill="far" shade={[0, -12]} />
                      {HOUSES.map((house) => (
                        <House key={house.x} spec={house} />
                      ))}
                    </g>
                  </g>
                </g>
              </svg>

              {/* The title stands between the far and the near sheets. */}
              <div className={styles.titlePlane}>
                <div className={styles.px} style={vars({ '--depth': 0.7 })}>
                  <div className={styles.titleCut}>
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
                          transform="translate(2.4 3.4) skewX(-9)"
                          stroke="var(--h-ink)"
                          strokeWidth={SCRIPT_STROKE + 3.8}
                          opacity={0.32}
                        />
                        <ScriptStrokeLayer
                          word={word}
                          reduced={reduced}
                          delay={0.94}
                          transform="skewX(-9)"
                          stroke="var(--h-ink)"
                          strokeWidth={SCRIPT_STROKE + 3.3}
                        />
                        <ScriptStrokeLayer
                          word={word}
                          reduced={reduced}
                          delay={0.9}
                          transform="skewX(-9)"
                          stroke="var(--c-title)"
                          strokeWidth={SCRIPT_STROKE + 0.7}
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Near sheets: the two front hills, the planted trees and
                  flowers, and the meadow bank the headline stands on. */}
              <svg
                className={cn(styles.svg, styles.svgFront)}
                viewBox="0 0 1440 860"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden
                focusable="false"
              >
                <g className={styles.px} style={vars({ '--depth': 0.8 })}>
                  <g className={styles.slideLeft}>
                    <g
                      className={styles.rise}
                      style={vars({ '--d': '0.58s', '--from': '190px' })}
                    >
                      <Paper d={MID_LEFT_HILL} fill="mid" shade={[0, -12]} />
                      {TREES.filter((tree) => tree.x < 700).map((tree) => (
                        <Tree key={tree.x} spec={tree} />
                      ))}
                    </g>
                  </g>
                </g>

                <g className={styles.px} style={vars({ '--depth': 0.9 })}>
                  <g className={styles.slideRight}>
                    <g
                      className={styles.rise}
                      style={vars({ '--d': '0.7s', '--from': '200px' })}
                    >
                      <Paper d={MID_RIGHT_HILL} fill="near" shade={[0, -12]} />
                      {TREES.filter((tree) => tree.x >= 700).map((tree) => (
                        <Tree key={tree.x} spec={tree} />
                      ))}
                    </g>
                  </g>
                </g>

                <g className={styles.px} style={vars({ '--depth': 1.05 })}>
                  {FLOWERS.map((flower) => (
                    <Flower key={flower.x} spec={flower} />
                  ))}
                  <g
                    className={styles.rise}
                    style={vars({ '--d': '0.84s', '--from': '230px' })}
                  >
                    <Paper d={BANK} fill="bank" shade={[0, -14]} />
                  </g>
                </g>
              </svg>

              <div className={styles.veil} aria-hidden />

              {/* Die-cut stickers pasted on the box. The About tray peels
                  these four, so the data hooks stay. */}
              <div className={styles.stickers} aria-hidden>
                <div
                  className={cn(styles.sticker, styles.stickerSmiley)}
                  data-hero-sticker="smiley"
                  data-slot="smiley"
                >
                  <Smiley />
                </div>
                <div
                  className={cn(styles.sticker, styles.stickerBurst)}
                  data-hero-sticker="burst"
                  data-slot="burst"
                >
                  <Burst text="hi!" />
                </div>
                <div
                  className={cn(styles.sticker, styles.stickerDaisy)}
                  data-hero-sticker="daisy"
                  data-slot="daisy"
                >
                  <Daisy />
                </div>
                <div
                  className={cn(styles.sticker, styles.stickerBolt)}
                  data-hero-sticker="bolt"
                  data-slot="bolt"
                >
                  <Bolt />
                </div>
              </div>
            </div>

            {/* ── Controls ───────────────────────────────────────────── */}
            <div className={styles.tag} aria-hidden>
              <span>
                {act === 'day' ? 'Fig. 01 — Daytime' : 'Fig. 02 — Nighttime'}
              </span>
            </div>

            <button
              type="button"
              className={styles.parallaxChip}
              aria-pressed={physicsOn}
              onClick={togglePhysics}
            >
              <span className={styles.chipDot} aria-hidden />
              Parallax
            </button>

            <div className={styles.pull}>
              <span className={styles.endIcon} aria-hidden>
                <SunIcon size={24} strokeWidth={2.4} color="#ff6a2b" />
              </span>
              <div ref={trackRef} className={styles.track}>
                <button
                  type="button"
                  className={styles.tab}
                  onPointerDown={onTabDown}
                  onPointerMove={onTabMove}
                  onPointerUp={onTabUp}
                  onPointerCancel={onTabUp}
                  onClick={onTabClick}
                  onKeyDown={onTabKey}
                >
                  <span>{act === 'day' ? 'Pull me' : 'Push back'}</span>
                  <ArrowRight
                    size={18}
                    strokeWidth={2.6}
                    aria-hidden
                    className={styles.tabArrow}
                  />
                </button>
              </div>
              <span className={styles.endIcon} aria-hidden>
                <Moon size={22} strokeWidth={2.4} color="#3d53d6" />
              </span>
            </div>

            {/* ── Headline and CTA ───────────────────────────────────── */}
            <div className={styles.foreground} data-hero-copy>
              <div className={styles.shell}>
                <div className={styles.foregroundRow}>
                  <div
                    id="hero-title"
                    className={styles.headlineCard}
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

                  <div className={styles.lowerRightAction}>
                    <button
                      type="button"
                      className={styles.paperPillBtn}
                      onClick={() => scrollToSection('work', reduced)}
                    >
                      <span>See work</span>
                      <ArrowRight size={20} strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
