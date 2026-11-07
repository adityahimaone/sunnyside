'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react'

import { Reveal } from '../reveal'
import { HERO_FACTS, scrollToSection } from '../studio-data'
import styles from './hero-theater.module.css'
import { TheaterScene } from './theater-scene'
import { useHeroScene } from './use-hero-scene'

/**
 * A pop-up paper theatre, run by one pull-tab.
 *
 * The headline is two cardboard signs on the stage. The lower one, "Pulse.",
 * is the mechanism: it carries the same CAD selection frame it always had, and
 * dragging it (or pressing its PULL tab) writes `pull`, a number from 0 to 1.
 * Everything that moves is a function of that one number: the curtain halves and
 * wings slide apart, the paper gears turn, the sun swings on its string, and the
 * letters of "Interfaces" fold forward on alternating creases like an
 * accordion. Let go and it snaps to open or shut on a spring.
 *
 * All the type is real text; the letters are split for the fold and hidden from
 * assistive tech behind a plain-text copy. The pull is also a button, so it
 * works from the keyboard and without a pointer.
 */

/** How far the sign travels, in px: enough to feel pulled, never off the stage. */
const rangeFor = (width: number) =>
  Math.round(Math.min(240, Math.max(64, width * 0.12)))

function subscribeResize(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function useRange() {
  return useSyncExternalStore(
    subscribeResize,
    () => rangeFor(window.innerWidth),
    () => 240,
  )
}

/** The eight CAD grips: 4 corners plus 4 edge midpoints. */
const HANDLES = ['tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br'] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const range = useRange()
  const [open, setOpen] = useState(false)
  useHeroScene(sectionRef)

  const x = useMotionValue(0)
  const pull = useTransform(x, [0, range], [0, 1], { clamp: true })

  const settle = (to: boolean) => {
    setOpen(to)
    animate(
      x,
      to ? range : 0,
      reduced
        ? { duration: 0 }
        : { type: 'spring', stiffness: 230, damping: 22, mass: 0.9 },
    )
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      settle(true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      settle(false)
    }
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <TheaterScene pull={pull} />

      <MotionConfig reducedMotion="user">
        <div className={styles.front}>
          <div className={styles.planks} data-stage-planks>
            {/* 1 · Interfaces: the first sign, hung from two cardboard struts. */}
            <div className={styles.signA}>
              <Rods pull={pull} />
              <Brads />
              <span className={styles.nameTag}>
                <span aria-hidden>✳</span>
                Aditya Himawan
              </span>
              <h1 id="hero-title" className={styles.display}>
                <span className="sr-only">Interfaces</span>
                <Letters text="INTERFACES" pull={pull} tone="cream" />
              </h1>
            </div>

            {/* 2 · Pulse: the pull-tab. Drag it, or press PULL. */}
            <motion.div
              className={styles.signB}
              drag="x"
              dragConstraints={{ left: 0, right: range }}
              dragElastic={0.04}
              dragMomentum={false}
              style={{ x }}
              onDragEnd={() => settle(x.get() > range * 0.45)}
            >
              <Brads />
              <div className={styles.withRow}>
                <span className={styles.withA}>with a</span>
                <span className={styles.chip}>Open to good problems</span>
              </div>

              <span className={styles.pulseWord}>
                <span className="sr-only">Pulse.</span>
                <Letters text="PULSE." pull={pull} tone="butter" />
              </span>

              {HANDLES.map((handle) => (
                <i
                  key={handle}
                  className={styles.handle}
                  data-handle={handle}
                  aria-hidden
                />
              ))}

              <span className={styles.arm} aria-hidden>
                <i className={styles.armBrad} />
                <b className={styles.armTab}>Pull ▸</b>
              </span>

              <button
                type="button"
                className={styles.pullTab}
                aria-pressed={open}
                aria-label="Pull the stage open"
                onClick={() => settle(!open)}
                onKeyDown={onKeyDown}
              >
                Pull <span aria-hidden>▸▸</span>
              </button>
            </motion.div>
          </div>

          {/* 3 · The paper card with the bio, on top of the stage. */}
          <div className={styles.card} data-hero-copy>
            <Reveal delay={0.12} className={styles.cardInner}>
              <div className={styles.cardHead}>
                <span>Design engineer</span>
                <span aria-hidden>·</span>
                <span>Jakarta, GMT+7</span>
              </div>

              <p className={styles.lede}>
                I&apos;m Aditya, a design engineer working in React and
                TypeScript. I bridge design and code: prototyping in the
                browser, building the design system under the screens, and
                sweating the <strong>motion and type</strong> that make software
                feel alive.
              </p>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cta}
                  onClick={() => scrollToSection('work', reduced)}
                >
                  See the work
                  <ArrowRight size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  className={styles.link}
                  onClick={() => scrollToSection('contact', reduced)}
                >
                  Say hello
                  <ArrowUpRight size={15} aria-hidden />
                </button>
              </div>

              <dl className={styles.facts}>
                {HERO_FACTS.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt className="sr-only">{fact.label}</dt>
                    <dd>
                      <b>{fact.value}</b>
                      <span aria-hidden>{fact.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}

function Brads() {
  return (
    <>
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <i
          key={corner}
          className={styles.brad}
          data-corner={corner}
          aria-hidden
        />
      ))}
    </>
  )
}

/** Two cardboard struts hold the sign up; they swing as the stage is pulled. */
function Rods({ pull }: { pull: MotionValue<number> }) {
  const left = useTransform(pull, [0, 1], [-14, -4])
  const right = useTransform(pull, [0, 1], [14, 4])
  return (
    <>
      <motion.i
        className={styles.rod}
        data-side="left"
        style={{ rotate: left }}
        aria-hidden
      />
      <motion.i
        className={styles.rod}
        data-side="right"
        style={{ rotate: right }}
        aria-hidden
      />
    </>
  )
}

/**
 * Letters on an accordion. Each one is a card standing on the sign: as `pull`
 * rises it comes forward and turns about its own edge, alternately left and
 * right, so neighbours meet at a crease, and each takes the light differently.
 */
function Letters({
  text,
  pull,
  tone,
}: {
  text: string
  pull: MotionValue<number>
  tone: 'cream' | 'butter'
}) {
  return (
    <span className={styles.letters} aria-hidden>
      {Array.from(text).map((char, i) => (
        <Letter
          key={`${char}-${i}`}
          char={char}
          index={i}
          pull={pull}
          tone={tone}
        />
      ))}
    </span>
  )
}

function Letter({
  char,
  index,
  pull,
  tone,
}: {
  char: string
  index: number
  pull: MotionValue<number>
  tone: 'cream' | 'butter'
}) {
  const dir = index % 2 ? 1 : -1
  const z = useTransform(pull, [0, 1], [0, 26 + (index % 3) * 9])
  const rotateY = useTransform(pull, [0, 1], [0, dir * 26])
  const rotateX = useTransform(pull, [0, 1], [0, -7])
  // Folds that turn toward the light brighten, folds that turn away fall into
  // shade: that alternation is what makes the creases read as paper.
  const filter = useTransform(
    pull,
    [0, 1],
    ['brightness(1)', dir > 0 ? 'brightness(0.78)' : 'brightness(1.1)'],
  )

  return (
    <motion.span
      className={styles.letter}
      data-tone={char === '.' ? 'dot' : tone}
      style={{ z, rotateY, rotateX, filter }}
    >
      {char}
    </motion.span>
  )
}
