'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Side A's scroll choreography.
 *
 * Everything here is transform/opacity only and lives in one GSAP context:
 * the hero's paper stage lifts away in 3D, the tape band tilts as it crosses
 * the viewport, section numbers and rules draw, the study prints fan in, the
 * release covers drift inside their frames, and the postcard floats. The
 * reduced-motion query never builds the timelines; it returns the finished
 * page exactly as CSS has it.
 */
export function useLandingMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
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
          desktop: '(min-width: 900px)',
        },
        (context) => {
          if (context.conditions?.reduce) return
          const desktop = Boolean(context.conditions?.desktop)

          // Hero background drifts slower than the sheet.
          const halo = q('[data-hero-halo]')
          const dots = q('[data-hero-dots]')
          if (halo.length) {
            gsap.to(halo, {
              yPercent: 16,
              rotate: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }
          if (dots.length) {
            gsap.to(dots, {
              yPercent: 11,
              ease: 'none',
              scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }

          // The paper stage leaves the hero by tipping back into the wall.
          const heroArt = q('[data-hero-art]')
          if (desktop && heroArt.length) {
            gsap.to(heroArt, {
              y: 72,
              rotationX: 8,
              scale: 0.97,
              opacity: 0.5,
              transformPerspective: 1100,
              transformOrigin: 'center center',
              ease: 'none',
              scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }

          // The tape band turns a little as it crosses the viewport.
          const marquee = q('[data-marquee]')
          if (marquee.length) {
            gsap.fromTo(
              marquee,
              { rotate: -2, scale: 1.03, yPercent: 0 },
              {
                rotate: 0.7,
                scale: 1.045,
                yPercent: -3,
                ease: 'none',
                scrollTrigger: {
                  trigger: marquee[0],
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                },
              },
            )
          }

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

          // About: the photo and the now-card drift at different speeds.
          const photo = q('[data-about-photo]')
          if (photo.length) {
            gsap.to(photo, {
              y: -36,
              rotate: -0.8,
              ease: 'none',
              scrollTrigger: {
                trigger: photo[0],
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }
          const now = q('[data-about-now]')
          if (now.length) {
            gsap.to(now, {
              y: 30,
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

          // Work: a large sun turns behind the shelf, and each cover drifts.
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
          q('[data-project-card]').forEach((card) => {
            const image = card.querySelector('[data-project-media] img')
            if (!image) return
            gsap.fromTo(
              image,
              { yPercent: -4, scale: 1.08 },
              {
                yPercent: 4,
                scale: 1.08,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                },
              },
            )
          })

          // Skill chips settle one after another, once.
          q('[data-skill-chips]').forEach((list) => {
            gsap.from(list.children, {
              y: 9,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.035,
              scrollTrigger: { trigger: list, start: 'top 92%', once: true },
            })
          })

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

    void start()
    return () => {
      cancelled = true
      revert()
    }
  }, [rootRef])
}
