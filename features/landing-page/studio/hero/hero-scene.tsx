import type { CSSProperties } from 'react'

import { Bolt, Burst, Daisy, Smiley, Sparkle, Sun } from '../doodles'
import styles from './hero-scene.module.css'

/** Layers of cardboard behind the sun's face. Six reads as a thick cut-out. */
const SLICES = 6

const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  const r = (n: number) => Math.round(n * 1e6) / 1e6
  return {
    x1: r(100 + Math.cos(a) * 74),
    y1: r(100 + Math.sin(a) * 74),
    x2: r(100 + Math.cos(a) * 93),
    y2: r(100 + Math.sin(a) * 93),
  }
})

/** The sun's outline as one flat colour: the edge of a die-cut. */
function Silhouette() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="9.5" strokeLinecap="round">
        {RAYS.map((ray) => (
          <line key={`${ray.x1}-${ray.y1}`} {...ray} />
        ))}
      </g>
      <circle cx="100" cy="100" r="68.5" fill="currentColor" />
    </svg>
  )
}

function Cloud() {
  return (
    <svg viewBox="0 0 136 80" aria-hidden focusable="false">
      <path
        d="M22 71C8 71 6 54 20 49C18 33 36 26 47 34C52 14 79 10 89 27C104 17 124 29 118 45C132 48 131 71 113 71Z"
        fill="var(--paper-hi)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M34 58C40 56 44 56 50 58"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".3"
      />
    </svg>
  )
}

/** Wavy edges that stretch to any width; strokes stay a constant 3px. */
function Hills() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M0 70C140 18 300 24 470 62C640 100 760 14 960 30C1160 46 1300 96 1440 52V200H0Z"
        fill="var(--cobalt-ink)"
        stroke="var(--ink)"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function Ground() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M0 34C160 6 300 46 520 24C720 4 900 40 1100 20C1260 4 1360 26 1440 18V200H0Z"
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

type Placed = {
  /** Offset from the sun's centre, in sun-diameters. */
  x: number
  y: number
}

const at = ({ x, y }: Placed, extra?: CSSProperties) =>
  ({ '--ox': x, '--oy': y, ...extra }) as CSSProperties

const CLOUDS = [
  { place: { x: -0.58, y: -0.82 }, depth: 0.7, scale: 0.8, delay: 0.55 },
  { place: { x: 0.34, y: -0.98 }, depth: 1.1, scale: 1, delay: 0.7 },
  { place: { x: 0.74, y: -0.5 }, depth: 1.5, scale: 0.7, delay: 0.85 },
] as const

const SPARKLES = [
  { place: { x: -0.2, y: -0.62 }, tone: 'butter', delay: 0 },
  { place: { x: 0.62, y: -0.82 }, tone: 'paper', delay: 1.1 },
  { place: { x: 0.78, y: 0.1 }, tone: 'butter', delay: 2.1 },
  { place: { x: -0.74, y: -0.1 }, tone: 'paper', delay: 0.6 },
  { place: { x: 0.12, y: -1.08 }, tone: 'paper', delay: 1.7 },
] as const

/**
 * The hero's sky: a paper-cut sunrise built from real depth.
 *
 * Planes, back to front: flat cobalt bands and halftone dots, a ring of rays,
 * a far hill, the sun (a stack of ink cut-outs under its painted face, so it
 * has an edge when it tilts), clouds and the four stickers that sit in front,
 * then the paper ground the sun is rising from. A parallax hook moves each
 * `data-depth` wrapper with the pointer and the scroll. Wrappers move with the
 * individual `translate` / `rotate` properties and the elements inside run the
 * entrance with `transform`, so the two never fight over one property.
 *
 * Everything is decoration: the scene is hidden from assistive tech, and a
 * reduced-motion visitor gets the finished picture.
 */
export function HeroScene() {
  return (
    <div className={styles.scene} aria-hidden data-hero-scene>
      <div className={styles.sky} />

      <div className={styles.anchor}>
        <div className={styles.rays} data-rays />
        <div className={styles.dots} />
      </div>

      <div className={styles.farHill} data-depth="0.35">
        <Hills />
      </div>

      <div className={styles.anchor}>
        <div className={styles.sunLift} data-sun-lift>
          <div className={styles.sunRise}>
            <div className={styles.sunBody} data-sun-body>
              <i className={styles.pulse} />
              <i className={styles.pulse} />
              <i className={styles.pulse} />
              <div className={`${styles.layer} ${styles.plate}`}>
                <Silhouette />
              </div>
              {Array.from({ length: SLICES }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.layer} ${styles.slice}`}
                  style={{ '--i': i + 1 } as CSSProperties}
                >
                  <Silhouette />
                </div>
              ))}
              <div className={`${styles.layer} ${styles.face}`}>
                <Sun />
              </div>
            </div>
          </div>
        </div>

        {CLOUDS.map((cloud, i) => (
          <div
            key={i}
            className={styles.item}
            data-depth={cloud.depth}
            style={at(cloud.place)}
          >
            <div
              className={styles.cloud}
              style={
                {
                  '--s': cloud.scale,
                  '--delay': `${cloud.delay}s`,
                } as CSSProperties
              }
            >
              <Cloud />
            </div>
          </div>
        ))}

        {SPARKLES.map((spark, i) => (
          <div
            key={i}
            className={styles.item}
            data-depth="1.2"
            style={at(spark.place)}
          >
            <Sparkle
              className={`${styles.sparkle} ${spark.tone === 'paper' ? styles.sparkPaper : ''}`}
            />
          </div>
        ))}

        <StickerSlot
          id="smiley"
          place={{ x: -0.44, y: -0.68 }}
          depth={1.9}
          delay={1.0}
        >
          <Smiley />
        </StickerSlot>
        <StickerSlot
          id="burst"
          place={{ x: 0.52, y: -0.6 }}
          depth={2.3}
          delay={1.12}
        >
          <Burst text="hi!" />
        </StickerSlot>
        <StickerSlot
          id="daisy"
          place={{ x: 0.66, y: 0.06 }}
          depth={2.0}
          delay={1.24}
        >
          <Daisy />
        </StickerSlot>
        <StickerSlot
          id="bolt"
          place={{ x: -0.5, y: 0.14 }}
          depth={2.6}
          delay={1.36}
        >
          <Bolt />
        </StickerSlot>
      </div>

      <div className={styles.ground} data-depth="1">
        <Ground />
      </div>
    </div>
  )
}

function StickerSlot({
  id,
  place,
  depth,
  delay,
  children,
}: {
  id: string
  place: Placed
  depth: number
  delay: number
  children: React.ReactNode
}) {
  return (
    <div className={styles.item} data-depth={depth} style={at(place)}>
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
