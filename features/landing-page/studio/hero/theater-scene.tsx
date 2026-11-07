'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

import { gearPath } from '../diorama/geometry'
import { Bolt, Burst, Daisy, Smiley, Sparkle, Sun } from '../doodles'
import styles from './hero-theater.module.css'

/**
 * The hero's stage: a paper theatre built from real depth.
 *
 * Every plane is a full-bleed layer at its own distance from the glass, inside
 * a `preserve-3d` stage that the pointer tilts, so the planes slide against one
 * another like cut card. Back to front:
 *
 *   backdrop sky and halftone → paper gears → the dark arch frame → the blue
 *   ring inside it → the floor → clouds → the two halves of the orange curtain
 *   → the layered wings at either edge → the sun, hung on a string
 *
 * `pull` (0 to 1) is the mechanism. Dragging the Pulse frame writes it, and the
 * curtain halves and wings slide apart, the gears turn, the sun swings. Nothing
 * here reads as a sunrise any more: the sun is a prop, not the sky.
 *
 * Everything is decoration and hidden from assistive tech; the stickers keep the
 * `data-hero-sticker` hooks the About tray peels them from.
 */

/** Distance of the eye from the stage, in px. Planes are scaled to cancel it. */
const EYE = 1500
/** Bleed, so a tilting stage never shows its own edge. */
const BLEED = 1

const kFor = (z: number) => ((EYE - z) / EYE) * BLEED

const planeVars = (z: number) =>
  ({ '--z': `${z}px`, '--k': String(kFor(z)) }) as CSSProperties

const FRAME = 'M-200 -200H1800V1100H-200Z'
/** An arch opening centred on x = 800 whose springing line is y = 620. */
const arch = (r: number) =>
  `M${800 - r} 900V620A${r} ${r} 0 0 1 ${800 + r} 620V900Z`

const INK = '#191a2e'

function Plane({
  z,
  shadow,
  children,
}: {
  z: number
  shadow?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={styles.plane}
      style={planeVars(z)}
      data-shadow={shadow || undefined}
    >
      {children}
    </div>
  )
}

function Art({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      focusable="false"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function Defs() {
  return (
    <defs>
      <radialGradient id="ht-sky" cx="50%" cy="40%" r="72%">
        <stop offset="0" stopColor="#8aa0fa" />
        <stop offset="0.5" stopColor="#4d66e6" />
        <stop offset="1" stopColor="#2c3cae" />
      </radialGradient>
      <pattern
        id="ht-dots"
        width="26"
        height="26"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="13" cy="13" r="2.2" fill="#fff" fillOpacity="0.13" />
      </pattern>
      <pattern
        id="ht-fold"
        width="46"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <rect width="46" height="10" fill="#ff6a2b" />
        <rect x="8" width="9" height="10" fill="#ff8d56" />
        <rect x="27" width="9" height="10" fill="#d9501a" />
      </pattern>
      <pattern id="ht-corr" width="9" height="10" patternUnits="userSpaceOnUse">
        <rect width="9" height="10" fill="#cba777" />
        <rect width="3" height="10" fill="#8c6a3a" fillOpacity="0.22" />
      </pattern>
    </defs>
  )
}

/* ── planes ──────────────────────────────────────────────────────────────── */

function Backdrop() {
  return (
    <Art>
      <Defs />
      <rect x="-200" y="-200" width="2000" height="1300" fill="url(#ht-sky)" />
      <rect x="-200" y="-200" width="2000" height="1300" fill="url(#ht-dots)" />
    </Art>
  )
}

/** The dark outer frame: the whole stage minus an arch-shaped opening. */
function ArchFrame() {
  return (
    <Art>
      <path
        d={`${FRAME}${arch(560)}`}
        fillRule="evenodd"
        fill="#2c3cae"
        stroke={INK}
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`${FRAME}${arch(560)}`}
        fillRule="evenodd"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.12"
        strokeWidth="2"
        transform="translate(-6 -6)"
        vectorEffect="non-scaling-stroke"
      />
    </Art>
  )
}

/** The lighter ring between the frame and the curtain. */
function Ring() {
  return (
    <Art>
      <path
        d={`${arch(560)}${arch(470)}`}
        fillRule="evenodd"
        fill="#4a62e0"
        stroke={INK}
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
    </Art>
  )
}

function Floor() {
  return (
    <Art>
      <path
        d="M-200 792H1800V1100H-200Z"
        fill="url(#ht-corr)"
        stroke={INK}
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-200 792H1800V818H-200Z"
        fill="#a88252"
        stroke={INK}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-200 820H1800"
        stroke="#fff"
        strokeOpacity="0.28"
        strokeWidth="2"
      />
    </Art>
  )
}

const CLOUD =
  'M22 71C8 71 6 54 20 49C18 33 36 26 47 34C52 14 79 10 89 27C104 17 124 29 118 45C132 48 131 71 113 71Z'

const CLOUDS = [
  { x: 360, y: 668, s: 1.5, d: 0, dx: 14 },
  { x: 640, y: 700, s: 1.1, d: -3, dx: -12 },
  { x: 1010, y: 676, s: 1.35, d: -5, dx: 16 },
  { x: 1240, y: 704, s: 1, d: -1, dx: -10 },
] as const

function Clouds() {
  return (
    <Art>
      {CLOUDS.map((cloud, i) => (
        <g
          key={i}
          transform={`translate(${cloud.x} ${cloud.y}) scale(${cloud.s})`}
        >
          <g
            className={styles.cloud}
            style={
              { '--dx': `${cloud.dx}px`, '--d': `${cloud.d}s` } as CSSProperties
            }
          >
            <path
              d={CLOUD}
              fill="#fffaf1"
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M34 58C40 56 44 56 50 58"
              fill="none"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity=".3"
            />
          </g>
        </g>
      ))}
    </Art>
  )
}

/** One half of the orange curtain, hugging the arch down to the floor. */
function Drape({ side }: { side: 'left' | 'right' }) {
  const d =
    side === 'left'
      ? 'M330 900V620A470 470 0 0 1 800 150V248A372 372 0 0 0 428 620V900Z'
      : 'M1270 900V620A470 470 0 0 0 800 150V248A372 372 0 0 1 1172 620V900Z'
  const tieX = side === 'left' ? 330 : 1074
  return (
    <Art>
      <path
        d={d}
        fill="url(#ht-fold)"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="2"
        transform="translate(4 4)"
        vectorEffect="non-scaling-stroke"
      />
      {/* the tie-back that holds it to the wing */}
      <rect
        x={tieX}
        y="690"
        width="196"
        height="26"
        rx="6"
        fill="#c29b66"
        stroke={INK}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M${tieX + 8} 703H${tieX + 188}`}
        stroke="#8c6a3a"
        strokeWidth="2"
        strokeDasharray="6 5"
      />
    </Art>
  )
}

const WING_TONES = ['#2c3cae', '#ff6a2b', '#4a62e0'] as const

/** A slat of the stage wings: a tall strip with a rounded inner edge. */
function Wing({
  side,
  tone,
  inset,
}: {
  side: 'left' | 'right'
  tone: string
  inset: number
}) {
  const w = 190
  const x = side === 'right' ? 1600 - w + inset : -inset
  return (
    <Art>
      <rect
        x={x}
        y="-80"
        width={w}
        height="1100"
        rx="60"
        fill={tone}
        stroke={INK}
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x={x + 14}
        y="-60"
        width="10"
        height="1060"
        rx="5"
        fill="#fff"
        opacity="0.14"
      />
    </Art>
  )
}

function Gear({
  pull,
  x,
  y,
  size,
  turn,
  fill,
  z,
}: {
  pull: MotionValue<number>
  x: string
  y: string
  size: string
  turn: number
  fill: string
  z: number
}) {
  const rotate = useTransform(pull, [0, 1], [0, turn])
  return (
    <div
      className={styles.gearSlot}
      style={{ left: x, top: y, width: size, ...planeVars(z) }}
    >
      <motion.div className={styles.gear} style={{ rotate }}>
        <svg
          viewBox="0 0 100 100"
          className={styles.gearSvg}
          focusable="false"
          aria-hidden
        >
          <path
            d={gearPath(50, 50, 48, 40, 14)}
            fill={fill}
            stroke={INK}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke={INK}
            strokeOpacity="0.4"
            strokeWidth="1.6"
          />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <circle
                key={i}
                cx={Number((50 + Math.cos(a) * 20).toFixed(2))}
                cy={Number((50 + Math.sin(a) * 20).toFixed(2))}
                r="6.4"
                fill="#7a5a33"
                stroke={INK}
                strokeWidth="1.6"
              />
            )
          })}
          <circle
            cx="50"
            cy="50"
            r="9"
            fill={fill}
            stroke={INK}
            strokeWidth="2.2"
          />
        </svg>
        <i className={styles.brad} />
      </motion.div>
    </div>
  )
}

/* ── stickers and sparkles (the About tray peels the stickers off) ───────── */

type Spot = { x: string; y: string; xs?: string; ys?: string }

const spot = ({ x, y, xs, ys }: Spot) =>
  ({
    '--lx': x,
    '--ty': y,
    '--lxs': xs ?? x,
    '--tys': ys ?? y,
  }) as CSSProperties

function StickerSlot({
  id,
  place,
  depth,
  delay,
  children,
}: {
  id: string
  place: Spot
  depth: number
  delay: number
  children: ReactNode
}) {
  return (
    <div className={styles.item} data-depth={depth} style={spot(place)}>
      <div
        className={styles.sticker}
        data-hero-sticker={id}
        data-slot={id}
        style={{ '--delay': `${delay}s` } as CSSProperties}
      >
        <span className={styles.float}>{children}</span>
      </div>
    </div>
  )
}

const SPARKLES = [
  { place: { x: '34%', y: '17%' }, tone: 'butter', delay: 0 },
  { place: { x: '66%', y: '20%' }, tone: 'paper', delay: 1.1 },
  { place: { x: '44%', y: '70%' }, tone: 'butter', delay: 2.1 },
  { place: { x: '20%', y: '32%' }, tone: 'paper', delay: 0.6 },
] as const

/**
 * `pull` comes from the hero: it is owned by whatever the visitor is dragging,
 * so the scene only reads it.
 */
export function TheaterScene({ pull }: { pull: MotionValue<number> }) {
  const curtainL = useTransform(pull, [0, 1], [0, -150])
  const curtainR = useTransform(pull, [0, 1], [0, 150])
  // Motion writes `transform` itself, so these planes carry their own depth
  // compensation (`kFor`) instead of the stylesheet's.
  const curtainScaleX = useTransform(pull, [0, 1], [kFor(56), kFor(56) * 0.82])
  const ringScale = useTransform(pull, [0, 1], [kFor(-30), kFor(-30) * 1.035])
  const wingR = [
    useTransform(pull, [0, 1], [0, 90]),
    useTransform(pull, [0, 1], [0, 140]),
    useTransform(pull, [0, 1], [0, 190]),
  ]
  const wingL = [
    useTransform(pull, [0, 1], [0, -90]),
    useTransform(pull, [0, 1], [0, -140]),
    useTransform(pull, [0, 1], [0, -190]),
  ]
  const sunSwing = useTransform(pull, [0, 1], [0, 18])

  return (
    <div className={styles.scene} aria-hidden data-hero-scene>
      <div className={styles.stage3d} data-stage>
        <Plane z={-170}>
          <Backdrop />
        </Plane>

        <Gear
          pull={pull}
          x="26%"
          y="60%"
          size="clamp(7rem, 15vw, 15rem)"
          turn={540}
          fill="#e8b94a"
          z={-120}
        />
        <Gear
          pull={pull}
          x="52%"
          y="14%"
          size="clamp(3.6rem, 7vw, 7rem)"
          turn={-900}
          fill="#d4b283"
          z={-110}
        />
        <Gear
          pull={pull}
          x="72%"
          y="58%"
          size="clamp(4rem, 8vw, 8rem)"
          turn={-760}
          fill="#d4b283"
          z={-100}
        />

        <Plane z={-60} shadow>
          <ArchFrame />
        </Plane>

        <motion.div
          className={styles.plane}
          style={{ z: -30, scale: ringScale }}
          data-shadow
        >
          <Ring />
        </motion.div>

        <Plane z={0} shadow>
          <Floor />
        </Plane>

        <Plane z={26}>
          <Clouds />
        </Plane>

        <motion.div
          className={styles.plane}
          style={{
            x: curtainL,
            z: 56,
            scaleX: curtainScaleX,
            scaleY: kFor(56),
            transformOrigin: '0% 50%',
          }}
          data-shadow
        >
          <Drape side="left" />
        </motion.div>
        <motion.div
          className={styles.plane}
          style={{
            x: curtainR,
            z: 56,
            scaleX: curtainScaleX,
            scaleY: kFor(56),
            transformOrigin: '100% 50%',
          }}
          data-shadow
        >
          <Drape side="right" />
        </motion.div>

        {WING_TONES.map((tone, i) => (
          <motion.div
            key={`r${i}`}
            className={styles.plane}
            style={{ x: wingR[i], z: 80 + i * 18, scale: kFor(80 + i * 18) }}
            data-shadow
          >
            <Wing side="right" tone={tone} inset={i * 52} />
          </motion.div>
        ))}
        {WING_TONES.map((tone, i) => (
          <motion.div
            key={`l${i}`}
            className={styles.plane}
            style={{ x: wingL[i], z: 80 + i * 18, scale: kFor(80 + i * 18) }}
            data-shadow
          >
            <Wing side="left" tone={tone} inset={i * 52} />
          </motion.div>
        ))}

        {/* the sun, demoted to a prop on a string */}
        <motion.div
          className={styles.sunSlot}
          style={{
            rotate: sunSwing,
            z: 70,
            scale: kFor(70),
            transformOrigin: '50% 0%',
          }}
        >
          <div className={styles.sunSwing}>
            <i className={styles.string} />
            <Sun className={styles.sunProp} />
          </div>
        </motion.div>

        {SPARKLES.map((spark, i) => (
          <div
            key={i}
            className={styles.item}
            data-depth="1.2"
            style={spot(spark.place)}
          >
            <Sparkle
              className={`${styles.sparkle} ${spark.tone === 'paper' ? styles.sparkPaper : ''}`}
            />
          </div>
        ))}

        <StickerSlot
          id="smiley"
          place={{ x: '90%', y: '47%', xs: '86%', ys: '30%' }}
          depth={1.9}
          delay={1.0}
        >
          <Smiley />
        </StickerSlot>
        <StickerSlot
          id="burst"
          place={{ x: '77%', y: '27%', xs: '80%', ys: '12%' }}
          depth={2.3}
          delay={1.12}
        >
          <Burst text="hi!" />
        </StickerSlot>
        <StickerSlot
          id="daisy"
          place={{ x: '8%', y: '24%', xs: '12%', ys: '14%' }}
          depth={2.0}
          delay={1.24}
        >
          <Daisy />
        </StickerSlot>
        <StickerSlot
          id="bolt"
          place={{ x: '16%', y: '45%', xs: '9%', ys: '34%' }}
          depth={2.6}
          delay={1.36}
        >
          <Bolt />
        </StickerSlot>
      </div>
    </div>
  )
}
