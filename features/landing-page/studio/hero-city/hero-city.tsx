'use client'

import { useEffect, useRef } from 'react'

import { CuttingMatMarks, type HeroSurface } from '../hero/hero'
import { mountPaperCity } from './paper-city-scene'
import styles from './hero-city.module.css'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

/**
 * Paper City 3D Isometric Hero (Three.js Orthographic Miniature over the Blue Cutting Mat).
 */
export function HeroCity({ surface = 'cobalt' }: Props = {}) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ctrl = mountPaperCity({ el })
    return () => {
      ctrl?.dispose()
    }
  }, [])

  return (
    <section
      id="home"
      className={styles.hero}
      data-surface={surface}
      aria-labelledby="hero-title"
    >
      <CuttingMatMarks />
      <h1 id="hero-title" className={styles.srOnly}>
        Interfaces with a pulse
      </h1>
      <div className={styles.stageWrap}>
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
