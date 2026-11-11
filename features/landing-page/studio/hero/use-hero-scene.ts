'use client'

import { useEffect, type RefObject } from 'react'

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

/**
 * Pointer and scroll for the hero's sunrise.
 *
 * One rAF loop that runs only while the hero is on screen and something is
 * still moving. It writes the individual `translate` / `rotate` / `scale`
 * properties (never `transform`, which the entrance owns), so a frame is a
 * handful of composited changes and no layout.
 *
 *  - The pointer is a gentle lamp: each `data-depth` layer slides against it in
 *    proportion to its depth, and the sun's cut-out tilts toward it, which is
 *    what makes the stacked slices show an edge.
 *  - Scroll lifts the sun, turns its rays and lets the layers separate, so
 *    leaving the hero feels like the sun is climbing.
 *
 * Touch screens have no hover, so they get the scroll half only. Reduced
 * motion builds nothing and keeps the finished picture.
 */
export function useHeroScene(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layers = Array.from(
      root.querySelectorAll<HTMLElement>('[data-depth]'),
    ).map((el) => ({ el, depth: Number(el.dataset.depth) || 0 }))
    const rays = root.querySelector<HTMLElement>('[data-rays]')
    const sunBody = root.querySelector<HTMLElement>('[data-sun-body]')
    const sunLift = root.querySelector<HTMLElement>('[data-sun-lift]')
    const copy = root.querySelector<HTMLElement>('[data-hero-copy]')
    const scene = root.querySelector<HTMLElement>('[data-hero-scene]')

    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    let progress = 0
    let height = root.offsetHeight || window.innerHeight
    let onScreen = true
    let frame = 0
    let dirty = true
    let disposed = false

    const readScroll = () => {
      progress = clamp(window.scrollY / Math.max(1, height), 0, 1)
      dirty = true
    }

    const draw = () => {
      frame = 0
      if (disposed || !onScreen) return

      px += (tx - px) * 0.075
      py += (ty - py) * 0.075
      const settled = Math.abs(tx - px) < 0.002 && Math.abs(ty - py) < 0.002
      if (settled) {
        px = tx
        py = ty
      }

      for (const { el, depth } of layers) {
        const x = -px * depth * 20
        const y = -py * depth * 12 + (1 - depth) * progress * 110
        el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`
      }
      if (sunBody) {
        sunBody.style.transform = `perspective(1100px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 14).toFixed(2)}deg)`
      }
      if (sunLift) {
        sunLift.style.translate = `0 ${(-progress * 84).toFixed(2)}px`
        sunLift.style.scale = `${(1 + progress * 0.07).toFixed(4)}`
      }
      if (rays) rays.style.rotate = `${(progress * 55 + px * 5).toFixed(2)}deg`
      if (copy) copy.style.translate = `0 ${(progress * 56).toFixed(2)}px`

      dirty = false
      if (!settled || dirty) schedule()
    }

    function schedule() {
      if (!frame && !disposed) frame = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = root.getBoundingClientRect()
      tx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
      ty = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)
      schedule()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      schedule()
    }
    const onScroll = () => {
      readScroll()
      schedule()
    }
    const onResize = () => {
      height = root.offsetHeight || window.innerHeight
      onScroll()
    }

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting
            if (scene) scene.dataset.sceneIdle = String(!onScreen)
            if (onScreen) {
              readScroll()
              schedule()
            }
          })
    observer?.observe(root)

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    readScroll()
    schedule()

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      for (const { el } of layers) el.style.translate = ''
      for (const el of [sunBody, sunLift, rays, copy]) {
        if (!el) continue
        el.style.transform = ''
        el.style.translate = ''
        el.style.scale = ''
        el.style.rotate = ''
      }
    }
  }, [ref])
}
