'use client'

import { MotionConfig, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { Reveal } from '../reveal'
import { HERO_FACTS, scrollToSection } from '../studio-data'
import styles from '../studio.module.css'
import { HeroScene } from './hero-scene'
import { useHeroScene } from './use-hero-scene'

/**
 * Sunrise, rebuilt as a workbench. The sun is still the page's one loud field,
 * still rising behind the paper the rest of the site is printed on — but the
 * type is now laid out like a canvas being worked on: the display line spans
 * the canopy, the sun sits centred behind it, and the lower-right word carries
 * a selection frame you can push around. The name tag, the bio dock and the
 * coordinate readout are the same tactile furniture as the rest of Side A.
 *
 * The scene (`HeroScene`) is untouched decoration; only its composition vars
 * moved. Everything here is real text, so nothing depends on the marks.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const [coords, setCoords] = useState({ x: 420, y: 180 })
  useHeroScene(sectionRef)

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <HeroScene />

      <MotionConfig reducedMotion="user">
        <div className={cn(styles.shell, styles.heroStage)}>
          <p className={styles.heroTelemetry}>
            x: {Math.round(coords.x)}, y: {Math.round(coords.y)}
          </p>

          {/* 1 · Canopy: the display line, with the name tag pinned to it. */}
          <div className={styles.heroCanopy}>
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0.15}
              onDrag={(_, info) => setCoords(info.point)}
              className={styles.heroSticker}
            >
              <span aria-hidden>✳</span>
              Aditya Himawan
            </motion.div>

            <Reveal>
              <h1 id="hero-title" className={styles.heroDisplay}>
                Interfaces
              </h1>
            </Reveal>
          </div>

          {/* 2 · Lower band: the dock on the left, the worked word on the right. */}
          <div className={styles.heroLower} data-hero-copy>
            <Reveal delay={0.12}>
              <div className={styles.heroDock}>
                <div className={styles.heroDockHead}>
                  <span>Design engineer</span>
                  <span aria-hidden>·</span>
                  <span>Jakarta, GMT+7</span>
                </div>

                <p className={styles.heroLede}>
                  I&apos;m Aditya, a design engineer working in React and
                  TypeScript. I bridge design and code: prototyping in the
                  browser, building the design system under the screens, and
                  sweating the <strong>motion and type</strong> that make
                  software feel alive.
                </p>

                <div className={styles.heroActions}>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => scrollToSection('work', reduced)}
                  >
                    See the work
                    <ArrowRight size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={styles.ghostLink}
                    onClick={() => scrollToSection('contact', reduced)}
                  >
                    Say hello
                    <ArrowUpRight size={15} aria-hidden />
                  </button>
                </div>

                <dl className={styles.heroFacts}>
                  {HERO_FACTS.map((fact) => (
                    <div key={fact.label} className={styles.heroFact}>
                      <dt className="sr-only">{fact.label}</dt>
                      <dd>
                        <b>{fact.value}</b>
                        <span aria-hidden>{fact.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className={styles.heroPulseBlock}>
                <div className={styles.heroWithRow}>
                  <span className={styles.heroWithA}>with a</span>
                  <span className={styles.heroChip}>Open to good problems</span>
                </div>

                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.1}
                  dragConstraints={{
                    left: -48,
                    right: 32,
                    top: -34,
                    bottom: 26,
                  }}
                  onDrag={(_, info) => setCoords(info.point)}
                  className={styles.heroPulseBox}
                >
                  <span className={styles.heroPulse}>
                    Pulse<span className={styles.heroPulseDot}>.</span>
                  </span>

                  <svg
                    className={styles.heroScribble}
                    viewBox="0 0 400 140"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden
                    focusable="false"
                  >
                    <ellipse
                      cx="200"
                      cy="70"
                      rx="190"
                      ry="55"
                      stroke="var(--tangerine)"
                      strokeWidth="3.5"
                      transform="rotate(-2 200 70)"
                    />
                    <ellipse
                      cx="200"
                      cy="70"
                      rx="184"
                      ry="48"
                      stroke="var(--tangerine)"
                      strokeWidth="2.5"
                      transform="rotate(1 200 70)"
                    />
                  </svg>

                  {HANDLES.map((handle) => (
                    <i
                      key={handle}
                      className={styles.heroHandle}
                      data-handle={handle}
                      aria-hidden
                    />
                  ))}
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}

/** The eight CAD grips: 4 corners plus 4 edge midpoints. */
const HANDLES = ['tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br'] as const
