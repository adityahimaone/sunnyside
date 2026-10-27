'use client'

import { useRef } from 'react'

import styles from './golden-horizon.module.css'
import { useGoldenHorizon } from './use-golden-horizon'

const TITLE = ['Let’s', 'build', 'something', 'warm.'] as const

/** Deterministic star field: positions are fixed so server and client agree. */
const STARS = Array.from({ length: 34 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453
  const b = Math.sin(i * 78.233) * 12345.6789
  const fa = a - Math.floor(a)
  const fb = b - Math.floor(b)
  return {
    left: `${(fa * 100).toFixed(2)}%`,
    top: `${(fb * 52).toFixed(2)}%`,
    size: 1 + ((i * 7) % 3),
    delay: `${((i * 0.37) % 3).toFixed(2)}s`,
  }
})

const RAYS = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2
  const inner = 150
  const outer = i % 3 === 0 ? 285 : i % 2 === 0 ? 240 : 205
  return {
    x1: Math.cos(angle) * inner,
    y1: Math.sin(angle) * inner,
    x2: Math.cos(angle) * outer,
    y2: Math.sin(angle) * outer,
    long: i % 3 === 0,
  }
})

/**
 * The seam between Work and Contact.
 *
 * Work ends on a dark equipment wall and Contact is a cream chassis; this is
 * the sun going down behind the first and coming up on the second. A sticky
 * stage plays one scrubbed scene — stars fade, the sky warms, the sun climbs
 * out from behind three hill layers, a ring of rays turns, the title rises
 * word by word — and the front hill is the chassis colour, so the last frame
 * *is* the top of Contact with no hard edge.
 *
 * The resting markup is the finished scene, so reduced-motion visitors and
 * no-JS renders see the settled sunrise, not an empty stage.
 */
export function GoldenHorizon() {
  const root = useRef<HTMLElement>(null)
  useGoldenHorizon(root)

  return (
    <section
      ref={root}
      className={styles.horizon}
      aria-label="Golden hour, on to contact"
      data-horizon
    >
      <div className={styles.stage}>
        <div className={styles.sky} aria-hidden="true" />
        <div className={styles.skyDay} data-gh="sky-day" aria-hidden="true" />
        <div className={styles.stars} data-gh="stars" aria-hidden="true">
          {STARS.map((star, i) => (
            <i
              key={i}
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <div className={styles.sunWrap} data-gh="sun" aria-hidden="true">
          <div className={styles.glow} data-gh="glow" />
          <svg
            className={styles.rays}
            data-gh="rays"
            viewBox="-300 -300 600 600"
          >
            {RAYS.map((ray, i) => (
              <line
                key={i}
                x1={ray.x1}
                y1={ray.y1}
                x2={ray.x2}
                y2={ray.y2}
                strokeWidth={ray.long ? 3 : 1.5}
              />
            ))}
          </svg>
          <svg
            className={styles.rings}
            data-gh="rings"
            viewBox="-300 -300 600 600"
          >
            <circle r="124" />
            <circle r="168" strokeDasharray="2 10" />
            <circle r="212" strokeDasharray="28 18" />
          </svg>
          <div className={styles.disc} />
        </div>

        <i
          className={`${styles.cloud} ${styles.cloudA}`}
          data-gh="cloud"
          aria-hidden="true"
        />
        <i
          className={`${styles.cloud} ${styles.cloudB}`}
          data-gh="cloud"
          aria-hidden="true"
        />
        <i
          className={`${styles.cloud} ${styles.cloudC}`}
          data-gh="cloud"
          aria-hidden="true"
        />

        <svg
          className={`${styles.hill} ${styles.hillBack}`}
          data-gh="hill-back"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 230C180 120 360 150 520 210S860 270 1040 170 1320 90 1440 160V400H0Z" />
        </svg>
        <svg
          className={`${styles.hill} ${styles.hillMid}`}
          data-gh="hill-mid"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 190C220 260 420 120 640 170S1040 290 1240 200 1380 150 1440 180V400H0Z" />
        </svg>
        <svg
          className={`${styles.hill} ${styles.hillFront}`}
          data-gh="hill-front"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 240C260 170 520 280 760 230S1200 160 1440 220V400H0Z" />
        </svg>

        <div className={styles.copy}>
          <p className={styles.label} data-gh="label">
            <span>GOLDEN HOUR / 06-07</span>
          </p>
          <h2 className={styles.title} aria-label="Let’s build something warm.">
            {TITLE.map((word, w) => (
              <span key={word} className={styles.word} aria-hidden="true">
                {Array.from(word).map((ch, i) => (
                  <span
                    key={`${w}-${i}`}
                    data-gh="letter"
                    className={styles.letter}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <a className={styles.cta} href="#contact" data-gh="cta">
            Say hello
          </a>
        </div>
      </div>
    </section>
  )
}
