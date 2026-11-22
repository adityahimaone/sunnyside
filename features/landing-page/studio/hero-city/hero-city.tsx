'use client'

import { useEffect, useRef } from 'react'

import { CuttingMatMarks, type HeroSurface } from '../hero/hero'
import styles from './hero-city.module.css'

type Props = {
  surface?: HeroSurface
  onSurfaceChange?: (surface: HeroSurface) => void
}

type DioramaFigure = { name: string }
type DioramaContext = { destroy: () => void }
type DioramaKernel = {
  figures: DioramaFigure[]
  mount: (fig: DioramaFigure, opts: { el: HTMLElement }) => DioramaContext
}
type DioramaWindow = Window & { Diorama?: DioramaKernel }

/* The kernel and the figure are plain scripts in public/diorama/. The figure
   file there is the source of truth: edit it in place. */
const KERNEL_SRC = '/diorama/diorama.js'
const FIGURE_SRC = '/diorama/paper-city.js'
const FIGURE_NAME = 'paper-city'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-diorama-src="${src}"]`,
    )
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve()
      else {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error(src)))
      }
      return
    }
    const el = document.createElement('script')
    el.src = src
    el.async = false
    el.dataset.dioramaSrc = src
    el.addEventListener('load', () => {
      el.dataset.loaded = 'true'
      resolve()
    })
    el.addEventListener('error', () => reject(new Error(src)))
    document.head.appendChild(el)
  })
}

/**
 * Paper City: an elevated figure-8 railway on the blue cutting mat. Two
 * trains run it, a bus circles the park, and the words sit on the bridge, the
 * orange train and the billboard.
 */
export function HeroCity({ surface = 'cobalt' }: Props = {}) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    let ctx: DioramaContext | null = null
    let cancelled = false

    loadScript(KERNEL_SRC)
      .then(() => loadScript(FIGURE_SRC))
      .then(() => {
        if (cancelled) return
        const kernel = (window as DioramaWindow).Diorama
        const fig = kernel?.figures.find((f) => f.name === FIGURE_NAME)
        if (kernel && fig) ctx = kernel.mount(fig, { el })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      ctx?.destroy()
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
          aria-label="An isometric paper city: a figure-8 railway crosses itself on a bridge, two trains ride it, and a bus circles a park."
        />
        <p className={styles.hint}>
          Hover a train or tower · tap the billboard
        </p>
      </div>
    </section>
  )
}
