'use client'

import * as React from 'react'

import styles from '../hachure.module.css'
import { drawRange } from '../dither-field'

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The plate in the hero: the same engine, stopped mid-development so the first
 * thing on the page is a print coming up rather than a finished illustration.
 * It runs once. Nothing on this case animates forever.
 */
export function HeroPlate({ tones, seed }: { tones: string[]; seed: number }) {
  const host = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const stage = host.current
    const node = canvas.current
    if (!stage || !node) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    let raf = 0
    const start = performance.now()

    const paint = (develop: number) => {
      drawRange(node, stage, {
        tones,
        layers: 7,
        seed,
        mist: 0.92,
        pixel: 2,
        develop,
      })
    }

    const tick = (now: number) => {
      const t = reduced ? 1 : Math.min(1, (now - start) / 1800)
      paint(ease(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    paint(reduced ? 1 : 0)
    if (!reduced) raf = requestAnimationFrame(tick)

    const ro = new ResizeObserver(() =>
      paint(
        reduced ? 1 : ease(Math.min(1, (performance.now() - start) / 1800)),
      ),
    )
    ro.observe(stage)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [tones, seed])

  return (
    <div ref={host} className={styles.plateStage}>
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  )
}
