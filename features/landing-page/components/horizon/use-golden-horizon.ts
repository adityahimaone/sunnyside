'use client'

import type { RefObject } from 'react'
import { useEffect } from 'react'

import { subscribeScroll } from '../sunlight/scroll-bus'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Scrubs the golden-hour scene.
 *
 * Progress is read from the section's own bounding box on every scroll sample
 * rather than from a ScrollTrigger. Pin spacers elsewhere on the page are
 * inserted after this mounts, and a trigger created before them measures the
 * wrong start and end until something refreshes it; a live rect cannot go
 * stale. The timeline itself is a paused GSAP timeline that follows that
 * number through a short tween, which is what makes the Lenis steps glide.
 *
 * Nothing runs under reduced motion; the markup rests in its finished state.
 */
export function useGoldenHorizon(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return

    let cancelled = false
    let unsubscribe: (() => void) | undefined
    let revert: (() => void) | undefined

    void import('gsap').then(({ gsap }) => {
      if (cancelled || !root.current) return

      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el)
        const letters = q('[data-gh="letter"]')
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

        // Night → day.
        tl.fromTo(
          q('[data-gh="sky-day"]'),
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          0,
        )
        tl.fromTo(
          q('[data-gh="stars"]'),
          { opacity: 1 },
          { opacity: 0, duration: 0.45 },
          0,
        )

        // The sun climbs out from behind the hills, growing as it clears them.
        tl.fromTo(
          q('[data-gh="sun"]'),
          { yPercent: 62, scale: 0.62 },
          { yPercent: -6, scale: 1.12, duration: 0.85, ease: 'power2.out' },
          0.04,
        )
        tl.fromTo(
          q('[data-gh="glow"]'),
          { opacity: 0.2, scale: 0.7 },
          { opacity: 1, scale: 1.25, duration: 0.85 },
          0.04,
        )
        tl.fromTo(
          q('[data-gh="rays"]'),
          { rotation: 0 },
          { rotation: 140, duration: 1 },
          0,
        )
        tl.fromTo(
          q('[data-gh="rings"]'),
          { rotation: 0 },
          { rotation: -90, duration: 1 },
          0,
        )

        // The land rises, back to front.
        tl.fromTo(
          q('[data-gh="hill-back"]'),
          { yPercent: 55 },
          { yPercent: 0, duration: 0.55, ease: 'power2.out' },
          0.02,
        )
        tl.fromTo(
          q('[data-gh="hill-mid"]'),
          { yPercent: 70 },
          { yPercent: 0, duration: 0.55, ease: 'power2.out' },
          0.12,
        )
        tl.fromTo(
          q('[data-gh="hill-front"]'),
          { yPercent: 90 },
          { yPercent: 0, duration: 0.55, ease: 'power2.out' },
          0.24,
        )

        // Clouds drift at three speeds.
        q('[data-gh="cloud"]').forEach((cloud, i) => {
          tl.fromTo(
            cloud,
            { xPercent: -30 - i * 25 },
            { xPercent: 40 + i * 30, duration: 1 },
            0,
          )
        })

        // Title: letters rise out of the horizon line.
        tl.fromTo(
          q('[data-gh="label"]'),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
          0.5,
        )
        tl.fromTo(
          letters,
          { yPercent: 120, rotateX: -70, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.012,
            ease: 'back.out(1.5)',
          },
          0.54,
        )
        tl.fromTo(
          q('[data-gh="cta"]'),
          { opacity: 0, y: 18, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: 'power2.out' },
          0.86,
        )

        const follow = gsap.quickTo(tl, 'progress', {
          duration: 0.55,
          ease: 'power3.out',
        })
        tl.progress(0)

        unsubscribe = subscribeScroll(({ vh }) => {
          const rect = el.getBoundingClientRect()
          // Starts when the section is 40% into the frame, ends when the sticky
          // stage releases (section bottom reaches the viewport bottom).
          const start = vh * 0.6
          const end = rect.height - vh
          follow(clamp01((start - rect.top) / Math.max(1, start + end)))
        })
      }, el)
      revert = () => ctx.revert()
    })

    return () => {
      cancelled = true
      unsubscribe?.()
      revert?.()
    }
  }, [root])
}
