'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Circle, Diamond, Sparkles, Sun } from 'kubai-icons-react'
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

function FivePointStar({
  className,
  fill = '#FFD12E',
  stroke = '#111827',
  strokeWidth = 2.6,
  innerFill,
}: {
  className?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  innerFill?: string
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
      {innerFill ? (
        <polygon
          points="32,15 36.4,25.4 47.6,26.3 39,33.7 41.6,44.7 32,38.8 22.4,44.7 25,33.7 16.4,26.3 27.6,25.4"
          fill={innerFill}
          stroke={stroke}
          strokeWidth={Math.max(1.4, strokeWidth * 0.65)}
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  )
}

function FourPointSparkle({
  className,
  fill = '#FAF9F6',
  innerFill = '#5E97E8',
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

function EightPointBurst({
  className,
  fill = '#FAF9F6',
}: {
  className?: string
  fill?: string
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      focusable="false"
    >
      <polygon
        points="24,3 28.5,14.8 40,9 34.2,20.5 45,24 34.2,27.5 40,39 28.5,33.2 24,45 19.5,33.2 8,39 13.8,27.5 3,24 13.8,20.5 8,9 19.5,14.8"
        fill={fill}
        stroke="#111827"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── Sculpted paper clouds ─────────────────────────────────────────────────
   A cloud is a list of lobes — circles with their own centre and radius —
   unioned over a base. The silhouettes are authored rather than generated,
   which is what lets a bank rise and settle the way a hand-cut paper cloud
   does: a big shoulder, a few middling swells, a low tail. Puffs that all
   share one radius can only ever read as a scalloped edge. */

type LobeSpec = {
  cx: number
  cy: number
  r: number
}

function SculptedCloud({
  lobes,
  baseY,
  leftX,
  rightX,
  fill,
  filter,
  className,
}: {
  lobes: readonly LobeSpec[]
  baseY: number
  leftX?: number
  rightX?: number
  fill: string
  filter?: string
  className?: string
}) {
  const minX = leftX ?? Math.min(...lobes.map((l) => l.cx - l.r))
  const maxX = rightX ?? Math.max(...lobes.map((l) => l.cx + l.r))

  /**
   * Where the silhouettes of two neighbouring lobes cross — the floor of the
   * valley between them. Undefined when the lobes do not touch.
   */
  const valley = (a: LobeSpec, b: LobeSpec) => {
    const d = Math.hypot(b.cx - a.cx, b.cy - a.cy)
    if (d === 0 || d >= a.r + b.r) return undefined
    const along = (a.r * a.r - b.r * b.r + d * d) / (2 * d)
    const half = Math.sqrt(Math.max(0, a.r * a.r - along * along))
    const ux = (b.cx - a.cx) / d
    const uy = (b.cy - a.cy) / d
    // Both crossings share a y; the lower one is the valley floor.
    const y = a.cy + uy * along + Math.abs(ux) * half
    const dy = y - a.cy
    const dx = Math.sqrt(Math.max(0, a.r * a.r - dy * dy))
    return { x: a.cx + Math.sign(b.cx - a.cx) * dx, y }
  }

  /** Angle of a point on a lobe, in SVG's y-down frame. */
  const angleOf = (lobe: LobeSpec, point: { x: number; y: number }) =>
    Math.atan2(point.y - lobe.cy, point.x - lobe.cx)

  /**
   * The outline as one path: enter each lobe at the valley it shares with the
   * lobe before it, arc over the top, leave at the valley it shares with the
   * lobe after it, then close down to the base.
   *
   * Drawing the true union — rather than unioning circles over a rectangle — is
   * what keeps the apron solid. A rect has to start below every valley to fill
   * them, which for lobes of very different heights means it reaches far above
   * the low ones and shows as a flat block in the sky.
   */
  const start = { x: lobes[0].cx - lobes[0].r, y: lobes[0].cy }
  let d = `M ${round(start.x)} ${round(start.y)}`
  let cursor = start

  for (let i = 0; i < lobes.length; i += 1) {
    const lobe = lobes[i]
    const next = lobes[i + 1]
    const end = next
      ? (valley(lobe, next) ?? { x: lobe.cx + lobe.r, y: lobe.cy })
      : { x: lobe.cx + lobe.r, y: lobe.cy }

    // Travelling rightwards over a lobe is clockwise in a y-down frame, so the
    // sweep flag is 1. Whether the arc passes half a circle depends on where
    // the valley sits, so large-arc has to be derived rather than assumed.
    const swept =
      (angleOf(lobe, end) - angleOf(lobe, cursor) + Math.PI * 2) % (Math.PI * 2)
    const largeArc = swept > Math.PI ? 1 : 0

    d += ` A ${round(lobe.r)} ${round(lobe.r)} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`
    cursor = end
  }

  d += ` L ${round(maxX)} ${round(baseY)} L ${round(minX)} ${round(baseY)} Z`

  return <path className={className} d={d} fill={fill} filter={filter} />
}

function PaperLayer({
  delay = 0,
  from = 42,
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
              y: { duration: 0.82, delay, ease: PAPER_EASE },
              opacity: { duration: 0.18, delay },
            }
      }
    >
      {children}
    </motion.g>
  )
}

const BUNTING = {
  from: { x: -12, y: 40 },
  control: { x: 205, y: 132 },
  to: { x: 442, y: 52 },
  anchors: [0.14, 0.37, 0.6, 0.84],
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

/** A star whose top vertex sits just below the origin, so it hangs from (0,0). */
function starPoints(outer: number, inner = outer * 0.48) {
  const points: string[] = []
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius + outer * 0.85
    points.push(`${round(x)},${round(y)}`)
  }
  return points.join(' ')
}

const BUNTING_STARS = BUNTING.anchors.map((t, i) => {
  const point = buntingPoint(t)
  return {
    ...point,
    span: [33, 35, 32, 34][i],
    tilt: [-14, 6, -10, 14][i],
    sway: 3.2 + (i % 3) * 0.5,
    delay: 0.45 + i * 0.1,
    fill: ['#F59E1B', '#FAF9F6', '#F59E1B', '#F7C627'][i],
  }
})

function Bunting({ still, shadowId }: { still: boolean; shadowId: string }) {
  return (
    <div className={styles.buntingWrap} aria-hidden>
      <svg viewBox="0 0 450 165" className={styles.buntingSvg}>
        <g filter={`url(#${shadowId})`}>
          <motion.path
            d={`M${BUNTING.from.x} ${BUNTING.from.y} Q${BUNTING.control.x} ${BUNTING.control.y} ${BUNTING.to.x} ${BUNTING.to.y}`}
            fill="none"
            stroke="#FAF9F6"
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={still ? false : { pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.05, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Both ends are pinned, so the swag reads as tied rather than cut. */}
          <circle
            cx={BUNTING.from.x}
            cy={BUNTING.from.y}
            r="3.4"
            fill="#FAF9F6"
          />
          <circle cx={BUNTING.to.x} cy={BUNTING.to.y} r="3.4" fill="#FAF9F6" />
        </g>

        {BUNTING_STARS.map((star, i) => (
          <motion.g
            key={i}
            filter={`url(#${shadowId})`}
            initial={still ? false : { y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.68,
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
                      duration: 4.4 + (i % 3) * 0.7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              <polygon
                points={starPoints(star.span)}
                transform={`translate(${round(star.x)} ${round(star.y - 4)})`}
                fill={star.fill}
              />
            </motion.g>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

/* Stage clouds: the amber shoulders beside the arch, and the banks behind the
   balustrade. */
const STAGE_CLOUDS = {
  /* The outermost lobes reach past the proscenium legs (168 / 1272), so the
     vertical closing edges sit behind the frame instead of slicing the amber. */
  amberMidLeft: [
    { cx: 255, cy: 445, r: 95 },
    { cx: 360, cy: 425, r: 85 },
    { cx: 462, cy: 448, r: 80 },
  ],
  amberMidRight: [
    { cx: 1000, cy: 448, r: 85 },
    { cx: 1095, cy: 420, r: 90 },
    { cx: 1180, cy: 428, r: 95 },
  ],
  balustradeBackAmber: [
    { cx: 455, cy: 556, r: 44 },
    { cx: 520, cy: 540, r: 52 },
    { cx: 595, cy: 548, r: 48 },
    { cx: 675, cy: 542, r: 50 },
    { cx: 760, cy: 550, r: 48 },
    { cx: 830, cy: 540, r: 52 },
  ],
  balustradeBackGold: [
    { cx: 872, cy: 560, r: 50 },
    { cx: 965, cy: 534, r: 66 },
    { cx: 1055, cy: 518, r: 76 },
    { cx: 1145, cy: 538, r: 68 },
  ],
} as const

/* Foreground apron, drawn in a 1440 × 420 box. Back to front: the amber lip on
   the horizon, the cream sheet that shows as a paper edge beneath it, then the
   two white banks the headline and the CTA rest on. */
const FOREGROUND_CLOUDS = {
  amberWave: [
    { cx: 480, cy: 235, r: 72 },
    { cx: 585, cy: 218, r: 78 },
    { cx: 695, cy: 205, r: 84 },
    { cx: 810, cy: 222, r: 76 },
    { cx: 935, cy: 200, r: 88 },
    { cx: 1045, cy: 175, r: 96 },
    { cx: 1165, cy: 168, r: 94 },
    { cx: 1280, cy: 190, r: 86 },
  ],
  creamWave: [
    { cx: 540, cy: 278, r: 74 },
    { cx: 650, cy: 252, r: 84 },
    { cx: 760, cy: 276, r: 72 },
    { cx: 865, cy: 262, r: 82 },
    { cx: 985, cy: 230, r: 96 },
    { cx: 1105, cy: 208, r: 104 },
    { cx: 1225, cy: 185, r: 108 },
    { cx: 1345, cy: 145, r: 115 },
    { cx: 1435, cy: 195, r: 98 },
  ],
  leftHeroMound: [
    { cx: -25, cy: 268, r: 115 },
    { cx: 82, cy: 205, r: 118 },
    { cx: 175, cy: 128, r: 92 },
    { cx: 282, cy: 112, r: 110 },
    { cx: 388, cy: 158, r: 102 },
    { cx: 492, cy: 215, r: 98 },
    { cx: 598, cy: 265, r: 96 },
    { cx: 685, cy: 332, r: 88 },
    { cx: 795, cy: 382, r: 86 },
  ],
  rightWhiteBank: [
    { cx: 930, cy: 392, r: 76 },
    { cx: 1035, cy: 332, r: 94 },
    { cx: 1148, cy: 296, r: 104 },
    { cx: 1265, cy: 278, r: 108 },
    { cx: 1385, cy: 265, r: 112 },
    { cx: 1475, cy: 305, r: 96 },
  ],
} as const

function PaperSun({ className }: { className?: string }) {
  const rays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2
        const aLeft = angle - 0.15
        const aRight = angle + 0.15
        const rInner = 55
        const rOuter = i % 2 === 0 ? 86 : 79
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
          fill={i % 2 === 0 ? '#FFD12E' : '#F59E1B'}
          stroke="#E08612"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      ))}
      <circle
        cx="100"
        cy="100"
        r="56"
        fill="#FFD438"
        stroke="#F5A623"
        strokeWidth="2.5"
      />
      <circle cx="81" cy="91" r="5.2" fill="#111827" />
      <circle cx="119" cy="91" r="5.2" fill="#111827" />
      <ellipse
        cx="69"
        cy="103"
        rx="7.5"
        ry="4.5"
        fill="#F59E1B"
        opacity="0.78"
      />
      <ellipse
        cx="131"
        cy="103"
        rx="7.5"
        ry="4.5"
        fill="#F59E1B"
        opacity="0.78"
      />
      <path
        d="M84 106 Q100 124 116 106"
        fill="none"
        stroke="#111827"
        strokeWidth="4.6"
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
 * One row of the headline: a fixed lead word and a gold pill holding the word
 * that changes.
 *
 * The pill keeps its width behind an invisible sizer, so a swap never reflows
 * the sentence around it. The words ride a tape behind a clipped window — the
 * retiring word leaves through the top edge while the next rises from below —
 * so the pill is never empty and the two never share the frame.
 */
type PillIcon = (typeof CRAFT_ICONS)[number]

/** A row's item is either a Kubai icon reference or a plain text glyph. */
type KubaiItem = { Icon: PillIcon['Icon']; color: string; word: string }
type GlyphItem = { icon: string; word: string }
type PillItem = KubaiItem | GlyphItem

function hasIcon(it: PillItem): it is KubaiItem {
  return 'Icon' in it
}

/**
 * Kubai icons get a controlled `hover` pulse on every word change, so they
 * act themselves out without a pointer. Reduced motion keeps the rest pose.
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

/**
 * Pop-Up Theatre Diorama Hero.
 *
 * A paper-cut stage in five depth planes: the blueprint grid and arch rings,
 * the royal-blue proscenium with its screen-printed curtains, the sun and
 * balustrade, the thick off-white `Aditya` cutout, and the foreground cloud
 * apron the headline sits on.
 */
export function Hero({ surface = 'cobalt' }: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const gridId = useId()
  const shadowFilterId = useId()
  const softShadowId = useId()
  const deepShadowId = useId()
  const stageClipId = useId()

  const [physicsOn, setPhysicsOn] = useState(true)
  const [writeKey, setWriteKey] = useState(0)
  const [phrase, setPhrase] = useState(0)
  const [phraseHeld, setPhraseHeld] = useState(false)

  const physicsActive = physicsOn && !reduced
  // A reduced-motion visit gets the finished diorama, not a slow build of it.
  const still = reduced

  // Normalized pointer offset in [-1, 1] for the paper parallax
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
    const pad = SCRIPT_STROKE / 2 + 2.8
    const vbX = -1.8 - pad
    const vbY = word.top - pad
    const vbW =
      Math.max(word.width, 1) + 4.8 + pad * 2 - word.top * SCRIPT_SLANT
    const vbH = word.bottom + pad - vbY + 3.2
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
   * rather than three separate widgets each doing their own thing. The lists
   * differ in length, so the pairings still keep moving.
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
        {/* Global filters, grid pattern and stage clip for the shadow-box */}
        <svg className={styles.svgDefs} aria-hidden focusable="false">
          <defs>
            <filter
              id={shadowFilterId}
              x="-16%"
              y="-16%"
              width="132%"
              height="138%"
            >
              <feDropShadow
                dx="0"
                dy="7"
                stdDeviation="5"
                floodColor="#091232"
                floodOpacity="0.44"
              />
            </filter>
            <filter
              id={deepShadowId}
              x="-16%"
              y="-18%"
              width="132%"
              height="142%"
            >
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="7.5"
                floodColor="#091232"
                floodOpacity="0.46"
              />
            </filter>
            {/* Light touch for the small hanging pieces — the bunting string
                and its stars. The stage shadow paints a second line under the
                string and a tail under every star at this scale. */}
            <filter
              id={softShadowId}
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="2.5"
                stdDeviation="2.2"
                floodColor="#091232"
                floodOpacity="0.26"
              />
            </filter>
            <pattern
              id={gridId}
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 44 0 L 0 0 0 44"
                fill="none"
                stroke="rgb(250 249 246 / 0.16)"
                strokeWidth="1"
              />
              <path
                d="M 11 0 V 44 M 22 0 V 44 M 33 0 V 44 M 0 11 H 44 M 0 22 H 44 M 0 33 H 44"
                fill="none"
                stroke="rgb(250 249 246 / 0.06)"
                strokeWidth="0.75"
              />
            </pattern>
            <clipPath id={stageClipId}>
              <rect x="146" y="74" width="1148" height="778" rx="18" />
            </clipPath>
          </defs>
        </svg>

        {/* Left edge cardstock tab: physics on/off */}
        <button
          type="button"
          className={styles.physicsTab}
          aria-pressed={physicsOn}
          onClick={togglePhysics}
        >
          <span className={styles.physicsLabel}>physics on/off</span>
        </button>

        {/* Outer proscenium royal-blue side walls */}
        <div className={styles.wingLeftOuter} aria-hidden>
          <div className={styles.wingFoldLeft} />
        </div>
        <div className={styles.wingRightOuter} aria-hidden>
          <div className={styles.wingFoldRight} />
        </div>

        {/* Sky-blue recessed diorama viewport */}
        <div className={styles.dioramaViewport}>
          {/* Plane 1: blueprint grid and arch rings */}
          <motion.div
            className={styles.planeCurtains}
            style={physicsActive ? { x: curtainX, y: curtainY } : undefined}
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 860"
              preserveAspectRatio="xMidYMin slice"
              className={styles.stageSvg}
            >
              <g clipPath={`url(#${stageClipId})`}>
                <PaperLayer still={still} from={-18}>
                  <rect
                    x="130"
                    y="60"
                    width="1180"
                    height="796"
                    fill="#1B42CC"
                  />
                  <rect
                    x="130"
                    y="60"
                    width="1180"
                    height="796"
                    fill={`url(#${gridId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.08} from={26}>
                  <path
                    d="M130 60 H1310 V860 H1085 C1085 270 935 90 710 90 C485 90 335 270 335 860 H130 Z"
                    fill="#F5C227"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.14} from={28}>
                  <path
                    d="M130 60 H1310 V860 H1038 C1038 298 900 126 710 126 C520 126 382 298 382 860 H130 Z"
                    fill="#E59018"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.2} from={30}>
                  <g filter={`url(#${shadowFilterId})`}>
                    <path
                      d="M382 860 C382 298 520 126 710 126 C900 126 1038 298 1038 860 H1016 C1016 314 884 150 710 150 C536 150 404 314 404 860 Z"
                      fill="#FAF9F6"
                    />
                    <path
                      d="M495 96 H765 C762 154 722 180 682 154 C654 190 594 190 566 154 C528 178 496 152 495 96 Z"
                      fill="#FAF9F6"
                    />
                  </g>
                </PaperLayer>

                <PaperLayer still={still} delay={0.28} from={36}>
                  <SculptedCloud
                    lobes={STAGE_CLOUDS.amberMidLeft}
                    baseY={680}
                    fill="#EA9316"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <SculptedCloud
                    lobes={STAGE_CLOUDS.amberMidRight}
                    baseY={680}
                    fill="#EA9316"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
              </g>
            </svg>
          </motion.div>

          {/* Plane 2: proscenium frame and screen-printed curtains */}
          <motion.div
            className={styles.planeProscenium}
            style={physicsActive ? { x: midX, y: midY } : undefined}
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 860"
              preserveAspectRatio="xMidYMin slice"
              className={styles.stageSvg}
            >
              <g clipPath={`url(#${stageClipId})`}>
                <PaperLayer still={still} delay={0.18} from={-24}>
                  <path
                    d="M148 70 H435 C420 177 358 257 275 317 L148 347 Z"
                    fill="#E5B122"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <path
                    d="M148 70 H410 C395 154 342 216 264 238 L148 250 Z"
                    fill="#A1C5E8"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <path
                    d="M720 70 H1080 V242 C1025 184 955 144 865 138 C795 134 745 110 720 70 Z"
                    fill="#EEB826"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <SculptedCloud
                    lobes={[
                      { cx: 1140, cy: 148, r: 92 },
                      { cx: 1252, cy: 116, r: 102 },
                      { cx: 1336, cy: 168, r: 92 },
                      { cx: 1310, cy: 268, r: 96 },
                      { cx: 1206, cy: 240, r: 90 },
                      { cx: 1300, cy: 356, r: 84 },
                    ]}
                    baseY={452}
                    leftX={1052}
                    rightX={1348}
                    fill="#A1C5E8"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.28} from={32}>
                  <path
                    d="M312 310 C302 280 326 252 356 260 C378 226 428 228 446 262 C474 258 494 282 484 310 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <path
                    d="M956 308 C944 272 976 240 1012 250 C1038 210 1098 214 1120 252 C1154 248 1176 276 1166 308 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.34} from={36}>
                  <path
                    d="M148 340 C284 340 312 380 296 430 C312 458 292 500 248 512 H148 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <path
                    d="M1292 344 C1228 344 1178 384 1192 434 C1150 448 1140 504 1182 534 C1208 550 1250 547 1292 538 Z"
                    fill="#FAF9F6"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.38} from={38}>
                  <path
                    d="M148 474 C310 466 368 508 376 568 C428 568 472 610 478 672 H148 Z"
                    fill="#A1C5E8"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>

                <PaperLayer still={still} delay={0.44} from={42}>
                  <SculptedCloud
                    lobes={STAGE_CLOUDS.balustradeBackAmber}
                    baseY={680}
                    leftX={410}
                    rightX={830}
                    fill="#EA9316"
                    filter={`url(#${shadowFilterId})`}
                  />
                  <SculptedCloud
                    lobes={STAGE_CLOUDS.balustradeBackGold}
                    baseY={680}
                    leftX={830}
                    rightX={1310}
                    fill="#F4C129"
                    filter={`url(#${shadowFilterId})`}
                  />
                </PaperLayer>
              </g>

              <PaperLayer still={still} delay={0.04} from={-14}>
                <path
                  d="M118 860 V70 C118 44 138 26 164 26 H1276 C1302 26 1322 44 1322 70 V860 H1272 V94 C1272 80 1260 70 1246 70 H194 C180 70 168 80 168 94 V860 Z"
                  fill="#1F44D6"
                  filter={`url(#${deepShadowId})`}
                />
                <path
                  d="M120 855 V70 C120 46 139 28 164 28 H1276 C1301 28 1320 46 1320 70 V855"
                  fill="none"
                  stroke="rgb(250 249 246 / 0.24)"
                  strokeWidth="2"
                />
              </PaperLayer>

              <PaperLayer still={still} delay={0.22} from={-20}>
                <path
                  d="M846 0 H1018 C1012 40 972 58 934 40 C912 30 902 16 896 0 Z"
                  fill="#D9E7F5"
                  filter={`url(#${shadowFilterId})`}
                />
                <path
                  d="M1030 0 H1330 C1330 46 1298 74 1258 66 C1236 96 1188 106 1152 86 C1116 110 1064 104 1040 72 C1024 50 1022 22 1030 0 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
              </PaperLayer>
            </svg>
          </motion.div>

          {/* Plane 3: sun, balustrade and bunting */}
          <motion.div
            className={styles.planeStageProps}
            style={physicsActive ? { x: sunX, y: sunY } : undefined}
          >
            <Bunting still={still} shadowId={softShadowId} />

            <div className={styles.sunCluster} aria-hidden>
              <motion.div
                className={styles.sunDisc}
                initial={still ? false : { y: 34, scale: 0.92, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={
                  still
                    ? undefined
                    : {
                        y: { duration: 0.88, delay: 0.46, ease: PAPER_EASE },
                        scale: {
                          duration: 0.88,
                          delay: 0.46,
                          ease: PAPER_EASE,
                        },
                        opacity: { duration: 0.16, delay: 0.46 },
                      }
                }
              >
                <PaperSun className={styles.sunSvg} />
              </motion.div>
              <motion.svg
                viewBox="0 0 380 155"
                className={styles.sunCloudCover}
                focusable="false"
                initial={still ? false : { y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  still
                    ? undefined
                    : {
                        y: { duration: 0.82, delay: 0.58, ease: PAPER_EASE },
                        opacity: { duration: 0.16, delay: 0.58 },
                      }
                }
              >
                <path
                  d="M18 112 C12 76 44 52 80 62 C114 22 180 22 214 58 C250 36 300 46 320 80 C352 82 366 106 356 128 H18 Z"
                  fill="#F1E2B3"
                  filter={`url(#${shadowFilterId})`}
                />
                <path
                  d="M34 128 C28 94 58 72 92 80 C124 44 188 44 218 76 C252 56 298 66 314 96 C342 98 354 116 344 134 H34 Z"
                  fill="#FAF9F6"
                  filter={`url(#${shadowFilterId})`}
                />
              </motion.svg>
            </div>

            {/* Cut-out stars, plus the data-hero-sticker hooks the About
                gravity pit peels from. */}
            <div className={styles.starScatter} data-still={still} aria-hidden>
              <div
                className={cn(styles.cutoutStar, styles.starPos1)}
                data-hero-sticker="smiley"
                data-slot="smiley"
              >
                <FourPointSparkle fill="#2647D8" innerFill="#74A9F0" />
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
                  innerFill="#FAF9F6"
                  stroke="#111827"
                  strokeWidth={2.6}
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
                <FourPointSparkle fill="#FAF9F6" innerFill="#8AB8EE" />
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
                  innerFill="#FFD12E"
                  stroke="#111827"
                  strokeWidth={2.6}
                />
                <span className={styles.hiddenHook}>
                  <Bolt />
                </span>
              </div>

              <div className={cn(styles.cutoutStar, styles.starPos5)}>
                <FourPointSparkle fill="#FAF9F6" innerFill="#7EB0EC" />
              </div>

              <div className={cn(styles.cutoutStar, styles.starPos6)}>
                <EightPointBurst fill="#FAF9F6" />
              </div>

              <div className={cn(styles.cutoutStar, styles.starPos7)}>
                <FourPointSparkle fill="#FAF9F6" innerFill="#F5A623" />
              </div>

              <div className={cn(styles.cutoutStar, styles.starPos8)}>
                <FivePointStar
                  fill="#FAF9F6"
                  stroke="#111827"
                  strokeWidth={2.6}
                />
              </div>
            </div>
          </motion.div>

          {/* Plane 4: the thick off-white Aditya cutout */}
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
                      y: { duration: 0.8, delay: 0.72, ease: PAPER_EASE },
                      opacity: { duration: 0.16, delay: 0.72 },
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
                    delay={0.32}
                    transform="translate(2.1 3.1) skewX(-9)"
                    stroke="rgb(9 18 50 / 0.38)"
                    strokeWidth={SCRIPT_STROKE + 2.4}
                  />
                  <ScriptStrokeLayer
                    word={word}
                    reduced={reduced}
                    delay={0.22}
                    transform="translate(1.15 1.65) skewX(-9)"
                    stroke="#0F1B4C"
                    strokeWidth={SCRIPT_STROKE + 2.1}
                  />
                  <ScriptStrokeLayer
                    word={word}
                    reduced={reduced}
                    delay={0.1}
                    transform="skewX(-9)"
                    stroke="#16296B"
                    strokeWidth={SCRIPT_STROKE + 1.45}
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

          {/* Plane 5b: the balustrade, above the foreground apron. Its ends
              land on the proscenium legs — if the apron covered them, the rail
              would read as floating mid-stage with no anchor. */}
          <div className={styles.planeBalustrade} aria-hidden>
            <motion.div
              className={styles.balustrade}
              aria-hidden
              initial={still ? false : { y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={
                still
                  ? undefined
                  : {
                      y: { duration: 0.78, delay: 0.64, ease: PAPER_EASE },
                      opacity: { duration: 0.16, delay: 0.64 },
                    }
              }
            >
              <div className={styles.balustradeTopRail} />
              <div className={styles.balustradeSpindles}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <span key={i} className={styles.balustradePost} />
                ))}
              </div>
              <div className={styles.balustradeBottomRail} />
            </motion.div>
          </div>

          {/* Upper-right docked stage CTA tab.
              Kept off the narrow breakpoints: the fixed header already carries
              this exact action, and below 900px the two pills collide. */}
          <div className={styles.upperRightAction}>
            <button
              type="button"
              className={styles.paperPillBtn}
              onClick={() => scrollToSection('contact', reduced)}
            >
              <span>Say hi</span>
              <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden />
            </button>
          </div>

          {/* Plane 5: foreground cloud apron */}
          <motion.div
            className={styles.planeForegroundClouds}
            style={
              physicsActive ? { x: cloudsFrontX, y: cloudsFrontY } : undefined
            }
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 420"
              preserveAspectRatio="xMidYMin slice"
              className={styles.cloudsSvg}
            >
              <PaperLayer still={still} delay={0.54} from={52}>
                <SculptedCloud
                  lobes={FOREGROUND_CLOUDS.amberWave}
                  baseY={430}
                  leftX={380}
                  rightX={1440}
                  fill="#EE9617"
                  filter={`url(#${shadowFilterId})`}
                />
              </PaperLayer>

              <PaperLayer still={still} delay={0.62} from={54}>
                <SculptedCloud
                  lobes={FOREGROUND_CLOUDS.creamWave}
                  baseY={430}
                  leftX={450}
                  rightX={1460}
                  fill="#F2E2AA"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>

              <PaperLayer still={still} delay={0.68} from={58}>
                <SculptedCloud
                  lobes={FOREGROUND_CLOUDS.rightWhiteBank}
                  baseY={430}
                  leftX={850}
                  rightX={1480}
                  fill="#FAF9F6"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>

              <PaperLayer still={still} delay={0.72} from={60}>
                <SculptedCloud
                  lobes={FOREGROUND_CLOUDS.leftHeroMound}
                  baseY={430}
                  leftX={-120}
                  rightX={880}
                  fill="#FAF9F6"
                  filter={`url(#${deepShadowId})`}
                />
              </PaperLayer>
            </svg>
          </motion.div>

          {/* Plane 6: foreground typography stack and lower-right CTA */}
          <div
            className={styles.foregroundContent}
            data-hero-copy
            data-still={still}
          >
            <div className={styles.shell}>
              <div className={styles.foregroundRow}>
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
      </MotionConfig>
    </section>
  )
}
