'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Side A's scroll choreography.
 *
 * Everything here is transform/opacity only and lives in one GSAP context,
 * initialized during browser idle time so it never competes with critical
 * hydration. Dead legacy selectors and transforms owned by `StickerJourney`
 * (`marquee`, `about-photo`) are excluded so two loops never fight over one DOM
 * element. Reduced motion skips building the timelines altogether.
 */
export function useLandingMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let revert = () => {}

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      const root = rootRef.current
      if (!root) return

      gsap.registerPlugin(ScrollTrigger)
      const q = gsap.utils.selector(root)

      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (context.conditions?.reduce) return

          // Chapter opener: the number lands, the rule draws.
          q('[data-head-number]').forEach((el) => {
            gsap.from(el, {
              scale: 0.55,
              rotation: -24,
              opacity: 0,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            })
          })
          q('[data-head-rule]').forEach((el) => {
            gsap.from(el, {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 91%', once: true },
            })
          })

          // About: the now-card drifts gently (`photo` drift is owned by StickerJourney).
          const now = q('[data-about-now]')
          if (now.length) {
            gsap.to(now, {
              y: 24,
              ease: 'none',
              scrollTrigger: {
                trigger: now[0],
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }

          // The study prints fan out of the wall in 3D.
          const studies = q('[data-study]')
          if (studies.length) {
            gsap.from(studies, {
              y: 64,
              opacity: 0,
              rotateY: -16,
              transformPerspective: 1200,
              transformOrigin: 'center center',
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.075,
              scrollTrigger: {
                trigger: '#showcase',
                start: 'top 70%',
                once: true,
              },
            })
          }

          // Work: a large sun turns behind the shelf.
          const workSun = q('[data-work-sun]')
          if (workSun.length) {
            gsap.to(workSun, {
              rotate: 26,
              scale: 1.06,
              ease: 'none',
              scrollTrigger: {
                trigger: '#work',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }

          // Contact postcard keeps a little altitude.
          const postcard = q('[data-contact-postcard]')
          if (postcard.length) {
            gsap.to(postcard, {
              y: -30,
              rotate: -0.6,
              ease: 'none',
              scrollTrigger: {
                trigger: postcard[0],
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }
        },
      )

      revert = () => {
        mm.revert()
      }
    }

    const hasIdle = 'requestIdleCallback' in window
    const idleId = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 1200 })
      : window.setTimeout(() => void start(), 200)

    return () => {
      cancelled = true
      if (hasIdle) window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
      revert()
    }
  }, [rootRef])
}
