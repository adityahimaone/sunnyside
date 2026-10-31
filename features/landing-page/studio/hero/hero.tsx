'use client'

import { useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

import { Reveal } from '../reveal'
import { CHAPTERS, HERO_FACTS, scrollToSection } from '../studio-data'
import styles from '../studio.module.css'
import { HeroScene } from './hero-scene'
import { useHeroScene } from './use-hero-scene'

const NEXT = CHAPTERS[1]

/**
 * Sunrise. A full-bleed cobalt sky, the page's one loud field, with a die-cut
 * sun rising from behind the paper the rest of the site is printed on. The
 * copy sits on the sky at the left; the scene is decoration and lives in
 * `HeroScene`. The four stickers on the sky are the same ones that drop into
 * the About tray further down.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  useHeroScene(sectionRef)

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <HeroScene />

      <div className={cn(styles.shell, styles.heroGrid)}>
        <div className={styles.heroCopy} data-hero-copy>
          <Reveal>
            <span className={styles.nameTag}>
              <span aria-hidden>✳</span>
              Aditya Himawan
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <div className={cn(styles.heroEyebrow, 'mt-5')}>
              <span>Design engineer</span>
              <span aria-hidden>·</span>
              <span>Jakarta, GMT+7</span>
              <span aria-hidden>·</span>
              <span>open to good problems</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 id="hero-title" className={styles.heroTitle}>
              Interfaces
              <br />
              with a <span className={styles.pulseWord}>pulse</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className={styles.heroLede}>
              I&apos;m Aditya, a design engineer who builds product interfaces
              in React and TypeScript, then sweats the{' '}
              <strong>motion, type and tiny moments</strong> that make them feel
              alive. Four years in, still convinced the details are the product.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
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
          </Reveal>

          <Reveal delay={0.3}>
            <dl className={styles.heroStats}>
              {HERO_FACTS.map((fact) => (
                <div key={fact.label} className={styles.heroStat}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <b>{fact.value}</b>
                    <span aria-hidden>{fact.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.36}>
            <button
              type="button"
              className={styles.heroScroll}
              onClick={() => scrollToSection(NEXT.id, reduced)}
            >
              <span>
                {NEXT.number} · {NEXT.label}
              </span>
              <svg
                viewBox="0 0 24 34"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <path d="M12 2v25" />
                <path d="M5 21l7 8 7-8" />
              </svg>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
