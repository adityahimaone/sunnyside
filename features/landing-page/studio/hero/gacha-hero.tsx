'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import type { WorkProject } from '@/data/projects'

import { Reveal } from '../reveal'
import {
  Atom,
  Bolt,
  Burst,
  Daisy,
  Heart,
  Smiley,
  Sparkle,
  Sun,
} from '../doodles'
import { HERO_FACTS, scrollToSection } from '../studio-data'
import {
  CATALOGUE_TOTAL,
  GACHA_KINDS,
  pickProject,
  poolFor,
  stickerFor,
  type GachaKind,
  type StickerName,
} from './gacha-pool'
import styles from './gacha-hero.module.css'

/**
 * The hero is a paper capsule machine.
 *
 * Press a button and a capsule drops, rolls into the chute and pops open on
 * one real project: cover, a line about it, a link, and a sticker. Collected
 * stickers are remembered in `localStorage`, so a returning visitor sees what
 * they have already pulled and the machine prefers what they have not.
 *
 * The headline stays real text in an `h1`. The result is announced through a
 * polite live region, every control is a native button, and with reduced
 * motion the capsule skips straight to its prize.
 */

type Phase = 'idle' | 'dropping' | 'opening' | 'revealed'

const STORAGE_KEY = 'sunnyside:gacha:collected'

/** Capsule colours: the page's own palette, top half and bottom half. */
const CAPSULES = [
  ['var(--cobalt)', 'var(--paper-hi)'],
  ['var(--tangerine)', 'var(--paper-hi)'],
  ['var(--butter)', 'var(--paper-hi)'],
  ['var(--paper-hi)', 'var(--cobalt)'],
  ['var(--cobalt-ink)', 'var(--butter)'],
  ['var(--tangerine)', 'var(--cobalt-wash)'],
  ['var(--butter)', 'var(--cobalt)'],
  ['var(--cobalt)', 'var(--tangerine)'],
  ['var(--paper-hi)', 'var(--tangerine)'],
  ['var(--butter)', 'var(--paper-hi)'],
] as const

const CAPSULE_SPOTS = [
  { x: 14, y: 62, r: -12, s: 1 },
  { x: 36, y: 70, r: 18, s: 1.08 },
  { x: 60, y: 66, r: -6, s: 1 },
  { x: 80, y: 60, r: 14, s: 0.96 },
  { x: 24, y: 40, r: 8, s: 0.94 },
  { x: 48, y: 46, r: -20, s: 1.04 },
  { x: 70, y: 38, r: 22, s: 0.92 },
  { x: 10, y: 26, r: -4, s: 0.88 },
  { x: 38, y: 22, r: 12, s: 0.9 },
  { x: 62, y: 18, r: -14, s: 0.86 },
] as const

const STICKERS: Record<StickerName, typeof Smiley> = {
  smiley: Smiley,
  daisy: Daisy,
  burst: Burst,
  bolt: Bolt,
  heart: Heart,
  atom: Atom,
  sun: Sun,
}

function readCollected(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

function writeCollected(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  } catch {
    // Private mode or a full quota: the machine still works, it just forgets.
  }
}

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const [phase, setPhase] = useState<Phase>('idle')
  const [kind, setKind] = useState<GachaKind | null>(null)
  const [prize, setPrize] = useState<WorkProject | null>(null)
  const [collected, setCollected] = useState<string[]>([])
  const timers = useRef<number[]>([])

  // Read once on the client: the server and the first client render both see
  // an empty shelf, so hydration matches.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCollected(readCollected()))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const later = useCallback((ms: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, ms))
  }, [])

  const pull = useCallback(
    (next: GachaKind) => {
      if (phase === 'dropping' || phase === 'opening') return
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []

      const project = pickProject(poolFor(next), collected)
      setKind(next)
      setPrize(project)

      const finish = () => {
        setPhase('revealed')
        setCollected((current) => {
          if (current.includes(project.slug)) return current
          const updated = [...current, project.slug]
          writeCollected(updated)
          return updated
        })
      }

      if (reduced) {
        finish()
        return
      }

      setPhase('dropping')
      later(1000, () => setPhase('opening'))
      later(1600, finish)
    },
    [phase, collected, reduced, later],
  )

  const busy = phase === 'dropping' || phase === 'opening'
  const Sticker = prize ? STICKERS[stickerFor(prize)] : null
  const kindLabel = GACHA_KINDS.find((item) => item.id === kind)?.label

  return (
    <section
      id="home"
      className={styles.hero}
      aria-labelledby="hero-title"
      data-phase={phase}
    >
      <div className={styles.dots} aria-hidden />

      <MotionConfig reducedMotion="user">
        <div className={styles.inner}>
          <div className={styles.copy} data-hero-copy>
            <Reveal className={styles.copyInner}>
              <span className={styles.nameTag}>
                <span aria-hidden>✳</span>
                Aditya Himawan
              </span>

              <h1 id="hero-title" className={styles.display}>
                <span className={styles.line}>Interfaces</span>
                <span className={styles.line}>
                  <span className={styles.with}>with a</span>
                  <span className={styles.pulse}>Pulse.</span>
                </span>
              </h1>

              <div className={styles.cardHead}>
                <span>Design engineer</span>
                <span aria-hidden>·</span>
                <span>Jakarta, GMT+7</span>
              </div>

              <p className={styles.lede}>
                I&apos;m Aditya, a design engineer working in React and
                TypeScript. I bridge design and code: prototyping in the
                browser, building the design system under the screens, and
                sweating the <strong>motion and type</strong> that make
                software feel alive.
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
                <span className={styles.chip}>Open to good problems</span>
              </div>

              <dl className={styles.facts}>
                {HERO_FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className={styles.machineWrap}>
            <Stickers />

            <div className={styles.machine} role="group" aria-label="Capsule machine: pull a project">
              <div className={styles.sign}>
                <span aria-hidden>✳</span>
                Capsule club
                <small>one pull = one project</small>
              </div>

              <div className={styles.dome} aria-hidden>
                {CAPSULES.map(([top, bottom], index) => {
                  const spot = CAPSULE_SPOTS[index]
                  return (
                    <i
                      key={index}
                      className={styles.capsule}
                      style={
                        {
                          '--top': top,
                          '--bottom': bottom,
                          '--x': `${spot.x}%`,
                          '--y': `${spot.y}%`,
                          '--r': `${spot.r}deg`,
                          '--s': spot.s,
                          '--i': index,
                        } as CSSProperties
                      }
                      data-shaking={busy && index % 2 === 0 ? 'true' : undefined}
                    />
                  )
                })}
                <span className={styles.glint} />
              </div>

              <div className={styles.panel}>
                <p className={styles.panelLabel}>Pick a flavour</p>
                <div className={styles.buttons}>
                  {GACHA_KINDS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.pick}
                      data-kind={item.id}
                      data-active={kind === item.id ? 'true' : undefined}
                      disabled={busy}
                      onClick={() => pull(item.id)}
                    >
                      <span>{item.label}</span>
                      <small>{item.hint}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.chute}>
                <div className={styles.slot} aria-hidden>
                  <AnimatePresence>
                    {phase === 'dropping' || phase === 'opening' ? (
                      <motion.div
                        key={`${prize?.slug}-capsule`}
                        className={styles.dropped}
                        initial={{ y: -230, rotate: -30, opacity: 0 }}
                        animate={{
                          y: [-230, 0, -26, 0, -8, 0],
                          rotate: [-30, 12, -6, 4, 0, 0],
                          opacity: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: 1,
                          times: [0, 0.4, 0.58, 0.74, 0.88, 1],
                          ease: 'easeOut',
                        }}
                      >
                        <motion.i
                          className={styles.half}
                          data-half="top"
                          animate={
                            phase === 'opening'
                              ? { y: -34, rotate: -28, x: -14 }
                              : { y: 0, rotate: 0, x: 0 }
                          }
                          transition={{ duration: 0.45, ease: 'backOut' }}
                        />
                        <motion.i
                          className={styles.half}
                          data-half="bottom"
                          animate={
                            phase === 'opening'
                              ? { y: 8, rotate: 10, x: 8 }
                              : { y: 0, rotate: 0, x: 0 }
                          }
                          transition={{ duration: 0.45, ease: 'backOut' }}
                        />
                        {phase === 'opening' ? (
                          <motion.span
                            className={styles.pop}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2.4, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  {phase === 'idle' ? (
                    <span className={styles.hint}>
                      Press a button, catch a capsule
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              className={styles.prizeArea}
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                {phase === 'revealed' && prize ? (
                  <motion.article
                    key={prize.slug}
                    className={styles.prize}
                    initial={
                      reduced
                        ? false
                        : { y: 36, rotate: -3, opacity: 0, scale: 0.94 }
                    }
                    animate={{ y: 0, rotate: -1.2, opacity: 1, scale: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 19,
                    }}
                  >
                    <div className={styles.cover}>
                      {prize.cover ? (
                        <Image
                          src={prize.cover}
                          alt=""
                          fill
                          sizes="96px"
                          className={styles.coverImg}
                        />
                      ) : (
                        <span
                          className={styles.coverFallback}
                          style={
                            {
                              '--a': prize.palette.a,
                              '--b': prize.palette.b,
                            } as CSSProperties
                          }
                          aria-hidden
                        >
                          {prize.title.slice(0, 1)}
                        </span>
                      )}
                      {Sticker ? (
                        <span className={styles.prizeSticker} aria-hidden>
                          <Sticker />
                        </span>
                      ) : null}
                    </div>

                    <div className={styles.prizeBody}>
                      <p className={styles.prizeKicker}>
                        {kindLabel} pull · {prize.genre} · {prize.year}
                      </p>
                      <h2 className={styles.prizeTitle}>{prize.title}</h2>
                      <p className={styles.prizeLine}>{prize.highlights[0]}</p>
                      <a
                        className={styles.prizeLink}
                        href={prize.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open {prize.title}
                        <ArrowUpRight size={14} aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </div>
                  </motion.article>
                ) : (
                  <p className={styles.prizeEmpty} key="empty">
                    {busy
                      ? 'Something is rolling down the chute…'
                      : 'Your prize shows up here.'}
                  </p>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.shelf}>
              <span className={styles.shelfCount}>
                Collected {Math.min(collected.length, CATALOGUE_TOTAL)}/
                {CATALOGUE_TOTAL}
              </span>
              <span className={styles.pips} aria-hidden>
                {Array.from({ length: CATALOGUE_TOTAL }, (_, index) => (
                  <i
                    key={index}
                    data-on={index < collected.length ? 'true' : undefined}
                  />
                ))}
              </span>
              <span className="sr-only">
                {collected.length} of {CATALOGUE_TOTAL} projects pulled so far.
              </span>
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}

/**
 * Decorative stickers around the machine. They keep the `data-hero-sticker`
 * hooks, so the About tray still peels its stickers off the hero.
 */
const STICKER_SPOTS = [
  { id: 'smiley', Art: Smiley, x: '-3%', y: '8%', size: '4.6rem', rot: -10 },
  { id: 'burst', Art: Burst, x: '88%', y: '2%', size: '5rem', rot: 12 },
  { id: 'daisy', Art: Daisy, x: '92%', y: '62%', size: '4.4rem', rot: -6 },
  { id: 'bolt', Art: Bolt, x: '-5%', y: '66%', size: '3.8rem', rot: 14 },
] as const

function Stickers() {
  return (
    <>
      {STICKER_SPOTS.map(({ id, Art, x, y, size, rot }, index) => (
        <div
          key={id}
          className={styles.stickerPos}
          style={{ '--x': x, '--y': y, '--size': size } as CSSProperties}
        >
          <div
            className={styles.sticker}
            data-hero-sticker={id}
            data-slot={id}
            style={
              {
                '--rot': `${rot}deg`,
                '--delay': `${0.5 + index * 0.18}s`,
              } as CSSProperties
            }
          >
            <span className={styles.float}>
              <Art />
            </span>
          </div>
        </div>
      ))}
      <Sparkle className={styles.sparkleA} />
      <Sparkle className={styles.sparkleB} />
    </>
  )
}