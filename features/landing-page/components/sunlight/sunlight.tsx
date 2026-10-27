'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './sunlight.module.css'
import type { SunLive } from './sun-canvas'
import { sunFrame } from './sun-path'
import { subscribeScroll } from './scroll-bus'

const SunCanvas = dynamic(() => import('./sun-canvas'), { ssr: false })

/** Minimum gap between two boundary beams, so a fast scroll is one flash. */
const BEAM_COOLDOWN_MS = 1100

/**
 * The landing page's light.
 *
 * One fixed, click-through layer holding:
 *  - the WebGL sun (R3F, lazy, watchdogged) that travels the whole page,
 *  - a beam of light that crosses the frame at every section boundary, which
 *    is the connective tissue between components that otherwise only meet at
 *    a hard edge.
 *
 * It is portalled to `<body>` so no transformed ancestor can turn `fixed` into
 * `absolute`, and it mounts after idle so it never competes with the hero's
 * first paint or the boot sequence.
 */
export function Sunlight() {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [compact, setCompact] = useState(false)
  const [visible, setVisible] = useState(true)
  const layerRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<HTMLDivElement>(null)
  const thinRef = useRef<HTMLDivElement>(null)
  // Handed to the render loop as the ref itself (never read during render),
  // the same convention the pad sea uses for its scroll bridge.
  const live = useRef<SunLive>({
    progress: 0,
    velocity: 0,
    pointerX: 0,
    pointerY: 0,
    dark: false,
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // `requestIdleCallback` is missing in Safari, so feature-test it by name
    // rather than assuming the type's promise that it always exists.
    const start = () => {
      setCompact(window.innerWidth < 769)
      setEnabled(true)
    }
    const hasIdle = 'requestIdleCallback' in window
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1400)
    return () => {
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])

  // Scroll, theme, pointer and tab visibility, all written into the mutable
  // `live` object the render loop reads.
  useEffect(() => {
    if (!enabled) return
    const state = live.current
    const root = document.documentElement
    const syncTheme = () => {
      state.dark = root.classList.contains('dark')
    }
    syncTheme()
    const themeObserver = new MutationObserver(syncTheme)
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1
      state.pointerY = 1 - (event.clientY / window.innerHeight) * 2
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const onVisibility = () =>
      setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)

    // Boundary beams: fire when a section's top edge crosses the 55% line.
    let lastBeam = 0
    const crossed = new WeakMap<Element, boolean>()
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-rack-section], #about, [data-horizon]',
      ),
    )
    sections.forEach((el) =>
      crossed.set(
        el,
        el.getBoundingClientRect().top < window.innerHeight * 0.55,
      ),
    )

    const fireBeam = (direction: 1 | -1, rgb: string) => {
      const beam = beamRef.current
      const thin = thinRef.current
      if (!beam || !thin) return
      beam.style.setProperty('--sun-rgb', rgb)
      const from = direction === 1 ? '-70%' : '260%'
      const to = direction === 1 ? '260%' : '-70%'
      const keyframes = (peak: number): Keyframe[] => [
        { transform: `translate3d(${from},0,0) skewX(-18deg)`, opacity: 0 },
        { opacity: peak, offset: 0.35 },
        { transform: `translate3d(${to},0,0) skewX(-18deg)`, opacity: 0 },
      ]
      beam.animate(keyframes(1), {
        duration: 1400,
        easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)',
      })
      thin.animate(keyframes(0.9), {
        duration: 1000,
        delay: 140,
        easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)',
      })
    }

    const unsubscribe = subscribeScroll((sample) => {
      state.progress = sample.progress
      state.velocity = sample.velocity
      const now = performance.now()
      const line = sample.vh * 0.55
      for (const el of sections) {
        const was = crossed.get(el) ?? false
        const isNow = el.getBoundingClientRect().top < line
        if (was === isNow) continue
        crossed.set(el, isNow)
        if (now - lastBeam < BEAM_COOLDOWN_MS) continue
        lastBeam = now
        const c = sunFrame(sample.progress).color
        fireBeam(
          isNow ? 1 : -1,
          `${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(c[2] * 255)}`,
        )
      }
    })

    return () => {
      unsubscribe()
      themeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled, live])

  if (!enabled) return null

  return createPortal(
    <div
      ref={layerRef}
      className={styles.layer}
      data-ready={ready}
      aria-hidden="true"
    >
      <SunCanvas
        live={live}
        compact={compact}
        active={visible}
        onReady={() => setReady(true)}
        onGiveUp={() => setEnabled(false)}
      />
      <div ref={beamRef} className={styles.beam} />
      <div ref={thinRef} className={`${styles.beam} ${styles.beamThin}`} />
    </div>,
    document.body,
  )
}
