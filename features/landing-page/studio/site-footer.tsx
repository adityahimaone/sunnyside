'use client'

import { useReducedMotion } from 'motion/react'

import StickerSlapFooter from '@/components/ui/sticker-slap-footer'

import { CONTACT, PALETTE, SOCIALS, scrollToSection } from './studio-data'
import styles from './studio.module.css'

export function SiteFooter() {
  const reduced = useReducedMotion() ?? false

  return (
    <div id="outro" className={styles.footerWrap}>
      <div className={styles.footerTop}>
        <button
          type="button"
          onClick={() => scrollToSection('home', reduced)}
          className={styles.footerTopButton}
        >
          Back to the top <span aria-hidden>↑</span>
        </button>
      </div>

      <StickerSlapFooter
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
    </div>
  )
}
