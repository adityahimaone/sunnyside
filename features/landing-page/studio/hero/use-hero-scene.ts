'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Drives the hero stage from the pointer and the scroll, with no React state:
 * every number goes straight to an element's style.
 *
 * - The stage (every depth plane) tilts toward the pointer inside its
 *   perspective, so the planes slide against one another. The signs tilt a
 *   little less and the bio card not at all, so text stays crisp.
 * - Anything with `data-depth` (stickers, sparkles) also drifts, further the
 *   nearer it is.
 * - Scrolling lifts the card away slowly.
 * - When the hero leaves the screen the idle animations are paused, so a page
 *   scrolled elsewhere costs nothing here.
 *
 * Reduced motion switches the tilt and drift off entirely.
 */
export function useHeroScene(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    const stage = root.querySelector<HTMLElement>('[data-stage]')
    const planks = root.querySelector<HTMLElement>('[data-stage-planks]')
    const copy = root.querySelector<HTMLElement>('[data-hero-copy]')
    const layers = Array.from(
      root.querySelectorAll<HTMLElement>('[data-depth]'),
    )

    // Idle animations only run while the hero is on screen.
    const watcher = new IntersectionObserver(
      ([entry]) => {
        root.dataset.sceneIdle = String(!entry.isIntersecting)
      },
      { threshold: 0.05 },
    )
    watcher.observe(root)

    let frame = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const paint = () => {
      cx += (tx - cx) * 0.09
      cy += (ty - cy) * 0.09
      const settled = Math.abs(tx - cx) < 0.001 && Math.abs(ty - cy) < 0.001
      if (settled) {
        cx = tx
        cy = ty
      }

      if (stage) {
        stage.style.transform = `scale(1.05) rotateX(${(-cy * 3.2).toFixed(3)}deg) rotateY(${(cx * 4.4).toFixed(3)}deg)`
      }
      if (planks) {
        planks.style.transform = `perspective(1400px) rotateX(${(-cy * 1.3).toFixed(3)}deg) rotateY(${(cx * 1.9).toFixed(3)}deg)`
      }
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth) || 1
        layer.style.translate = `${(cx * depth * -7).toFixed(2)}px ${(cy * depth * -5).toFixed(2)}px`
      }

      frame = settled ? 0 : requestAnimationFrame(paint)
    }

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect()
      tx = Math.max(
        -1,
        Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2),
      )
      ty = Math.max(
        -1,
        Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2),
      )
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const onLeave = () => {
      tx = 0
      ty = 0
      if (!frame) frame = requestAnimationFrame(paint)
    }

    let scrollFrame = 0
    const onScroll = () => {
      if (scrollFrame || !copy) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        const lift = Math.min(window.scrollY, window.innerHeight) * 0.07
        copy.style.translate = `0 ${(-lift).toFixed(1)}px`
      })
    }

    if (!calm && fine) {
      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerleave', onLeave)
    }
    if (!calm) window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      watcher.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(scrollFrame)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ref])
}
