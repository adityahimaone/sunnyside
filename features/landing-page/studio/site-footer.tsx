'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ComponentType } from 'react'

import type StickerSlapFooterType from '@/components/ui/sticker-slap-footer'

import { CONTACT, PALETTE, SOCIALS, scrollToSection } from './studio-data'
import styles from './studio.module.css'

type FooterComp = ComponentType<
  React.ComponentProps<typeof StickerSlapFooterType>
>

export function SiteFooter() {
  const reduced = useReducedMotion() ?? false
  const wrapRef = useRef<HTMLDivElement>(null)
  const [Footer, setFooter] = useState<FooterComp | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || Footer) return
    let cancelled = false

    const load = () => {
      void import('@/components/ui/sticker-slap-footer')
        .then((mod) => {
          if (cancelled) return
          const raw = mod as unknown as {
            StickerSlapFooter?: unknown
            default?: unknown
          }
          const nestedDefault =
            raw.default && typeof raw.default === 'object'
              ? (raw.default as { default?: unknown }).default
              : undefined
          const candidate =
            typeof raw.StickerSlapFooter === 'function'
              ? (raw.StickerSlapFooter as FooterComp)
              : typeof raw.default === 'function'
                ? (raw.default as FooterComp)
                : typeof nestedDefault === 'function'
                  ? (nestedDefault as FooterComp)
                  : null
          if (candidate) setFooter(() => candidate)
        })
        .catch(() => {
          // Keep the semantic fallback <footer> mounted if the chunk fails to load.
        })
    }

    if (typeof IntersectionObserver === 'undefined') {
      load()
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          load()
        }
      },
      { rootMargin: '1200px 0px' },
    )
    observer.observe(el)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [Footer])

  return (
    <div id="outro" ref={wrapRef} className={styles.footerWrap}>
      <div className={styles.footerTop}>
        <button
          type="button"
          onClick={() => scrollToSection('home', reduced)}
          className={styles.footerTopButton}
        >
          Back to the top <span aria-hidden>↑</span>
        </button>
      </div>

      {Footer ? (
        <Footer
          wordmark="himaone"
          logoWordmark="aditya"
          homeHref="#home"
          navLabel="hi"
          navHref="#contact"
          chatHref={CONTACT.href}
          chatLabel="send a note"
          jobsLabel="open to"
          jobs={[
            { title: 'product teams' },
            { title: 'design systems' },
            { title: 'short rescues' },
          ]}
          officeLabel="based in"
          address={[CONTACT.location, `${CONTACT.timezone} · remote-friendly`]}
          mapLabel="Open the map"
          mapHref="https://www.google.com/maps/place/Jakarta"
          contactLabel="contact"
          email={CONTACT.email}
          copiedLabel="copied, talk soon"
          note="No forms, no funnels. Email is the fastest way."
          socials={[
            { kind: 'github', href: SOCIALS[0].href },
            { kind: 'linkedin', href: SOCIALS[1].href },
            { kind: 'x', href: SOCIALS[2].href },
          ]}
          stickers={[
            { kind: 'burst', text: 'hi!' },
            { kind: 'smiley' },
            { kind: 'daisy' },
            { kind: 'heart' },
            { kind: 'bubble', text: 'say hi' },
            { kind: 'bolt' },
          ]}
          credits={[
            { role: 'design & code', name: 'himaone' },
            { role: 'stickers', name: 'drawn in code, peel freely' },
            { role: 'type', name: 'syne, geist, geist mono' },
          ]}
          height="100svh"
          wordmarkMaxHeight="48svh"
          paper={PALETTE.paper}
          panel={PALETTE.cobalt}
          ink={PALETTE.ink}
          cream={PALETTE.paperHi}
          accent={PALETTE.tangerine}
          fontSans="var(--font-geist), 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
        />
      ) : (
        <footer
          aria-label="Site footer"
          style={{ minHeight: '100svh', background: PALETTE.paper }}
        />
      )}
    </div>
  )
}
