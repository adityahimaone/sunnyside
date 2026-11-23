'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { layoutScript, round, TRACK } from '@/components/ui/sticker-slap-footer'

import { CuttingMatMarks, type HeroSurface } from '../hero/hero'
import { mountPaperCity } from './paper-city-scene'
import styles from './hero-city.module.css'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

type IntroPhase = 'writing' | 'dropping' | 'settled'

const INTRO_WRITE_MS = 1000
const INTRO_DROP_DELAY_S = 1.2
const STROKE_WIDTH = 3.3
const SLANT = 0.1584
const PART_SHIFT = 6.5

/**
 * Paper City 3D Isometric Hero (Three.js Orthographic Miniature over the Blue Cutting Mat)
 * with the footer's "himaone" single-stroke script wordmark as an interactive backdrop.
 */
export function HeroCity({ surface = 'cobalt' }: Props = {}) {
  const reduced = useReducedMotion() ?? false
  const stageRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<IntroPhase>(() =>
    reduced ? 'settled' : 'writing',
  )
  const [isCompact, setIsCompact] = useState<boolean>(() => !reduced)
  const userToggledRef = useRef(false)

  const scriptLayout = useMemo(() => {
    const hima = layoutScript('hima')
    const one = layoutScript('one')
    const full = layoutScript('himaone')
    const oneOffset = hima.width + TRACK
    const pad = STROKE_WIDTH / 2 + 0.6
    const vbX = -1.4 - pad - PART_SHIFT
    const vbW = full.width + 2.8 + pad * 2 - full.top * SLANT + PART_SHIFT * 2
    const vbY = full.top - pad
    const vbH = full.bottom + pad - vbY
    const dxHima = -PART_SHIFT
    const dxOne = PART_SHIFT
    return {
      hima,
      one,
      oneOffset,
      dxHima,
      dxOne,
      viewBox: [vbX, vbY, vbW, vbH].map(round).join(' '),
    }
  }, [])

  const toggleScale = useCallback(() => {
    userToggledRef.current = true
    setPhase('settled')
    setIsCompact((prev) => !prev)
  }, [])

  useEffect(() => {
    if (reduced) {
      setPhase('settled')
      setIsCompact(false)
      return
    }

    const writeTimer = window.setTimeout(() => {
      setPhase((curr) => (curr === 'writing' ? 'dropping' : curr))
    }, INTRO_WRITE_MS)

    return () => {
      window.clearTimeout(writeTimer)
    }
  }, [reduced])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ctrl = mountPaperCity({
      el,
      introDelay: reduced ? 0 : INTRO_DROP_DELAY_S,
      onToggleScale: toggleScale,
      onIntroComplete: () => {
        setPhase('settled')
        if (!userToggledRef.current) {
          setIsCompact(false)
        }
      },
    })
    return () => {
      ctrl?.dispose()
    }
  }, [reduced, toggleScale])

  const parted = phase !== 'writing' && isCompact

  const onStageKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleScale()
    }
  }

  return (
    <section
      id="home"
      className={styles.hero}
      data-surface={surface}
      data-phase={phase}
      data-compact={isCompact ? 'true' : 'false'}
      aria-labelledby="hero-title"
    >
      <CuttingMatMarks />
      <h1 id="hero-title" className={styles.srOnly}>
        himaone — Interfaces with a pulse
      </h1>

      <div
        className={styles.backdropWordmark}
        data-parted={parted ? 'true' : 'false'}
        data-settled={phase === 'settled' && !isCompact ? 'true' : 'false'}
        aria-hidden="true"
      >
        <svg
          className={styles.backdropSvg}
          viewBox={scriptLayout.viewBox}
          focusable="false"
        >
          <g transform={`skewX(${-Math.round((Math.atan(SLANT) * 180) / Math.PI)})`}>
            <g
              className={styles.wordHalf}
              style={{
                transform: parted
                  ? `translateX(${round(scriptLayout.dxHima)}px)`
                  : 'translateX(0px)',
              }}
            >
              <motion.path
                d={scriptLayout.hima.main}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.56, ease: [0.45, 0.05, 0.35, 1] },
                  opacity: { duration: 0.12 },
                }}
              />
              {scriptLayout.hima.extra.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.22,
                    delay: reduced ? 0 : 0.72 + i * 0.12,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </g>

            <g
              className={styles.wordHalf}
              style={{
                transform: parted
                  ? `translateX(${round(scriptLayout.dxOne)}px)`
                  : 'translateX(0px)',
              }}
            >
              <g transform={`translate(${round(scriptLayout.oneOffset)} 0)`}>
                <motion.path
                  d={scriptLayout.one.main}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: {
                      duration: 0.38,
                      delay: reduced ? 0 : 0.5,
                      ease: [0.45, 0.05, 0.35, 1],
                    },
                    opacity: { duration: 0.1, delay: reduced ? 0 : 0.5 },
                  }}
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div
        className={styles.stageWrap}
        data-compact={isCompact ? 'true' : 'false'}
        data-writing={phase === 'writing' ? 'true' : 'false'}
        role="button"
        tabIndex={0}
        aria-expanded={!isCompact}
        aria-label={
          isCompact
            ? 'Paper city diorama (compact). Click to expand to full size.'
            : 'Paper city diorama (full size). Click to scale down.'
        }
        onKeyDown={onStageKeyDown}
      >
        <div
          ref={stageRef}
          className={styles.stage}
          role="img"
          aria-label="An isometric 3D paper city on a blue cutting mat: a figure-8 railway arches over the INTERFACES bridge while two trains, a bus, and cars move through the city."
        />
      </div>
    </section>
  )
}
