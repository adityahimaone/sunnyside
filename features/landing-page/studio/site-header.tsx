'use client'

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
} from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

import {
  SunnysideMark,
  SunnysideWordmark,
} from '@/components/ui/sunnyside-logo'
import archive from '@/features/archive/archive.module.css'
import { cn } from '@/lib/utils'

import { CHAPTERS, SOCIALS, scrollToSection } from './studio-data'
import styles from './studio.module.css'

type Props = {
  active: string
  scrolled: boolean
  footerVisible: boolean
}

const NAV = CHAPTERS.filter((chapter) => chapter.id !== 'home')

/**
 * The menu's destinations.
 *
 * These are places, not chapters: the design system, the archive rooms and the
 * practice manual. The chapter list still exists, one step below, because a
 * phone reader
 * loses every section jump if the only menu becomes a route index.
 */
const DESTINATIONS = [
  {
    href: '/sunnyside',
    label: 'Sunnyside',
    note: 'the specimen',
    number: '00',
  },
  {
    href: '/design-system',
    label: 'Design System',
    note: 'the case library',
    number: '01',
  },
  { href: '/projects', label: 'Projects', note: 'the shelf', number: '02' },
  { href: '/bookmarks', label: 'Bookmarks', note: 'the crate', number: '03' },
  { href: '/skills', label: 'Skills', note: 'the toolbox', number: '04' },
  { href: '/blog', label: 'Blog', note: 'field notes', number: '05' },
  {
    href: '/design-engineering',
    label: 'Practice',
    note: 'the field manual',
    number: '06',
  },
] as const

export function SiteHeader({ active, scrolled, footerVisible }: Props) {
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
      trigger?.focus()
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // Let the overlay leave before the page moves under it.
    window.setTimeout(() => scrollToSection(id, reduced), reduced ? 0 : 180)
  }

  return (
    <>
      <header
        className={cn(archive.header, footerVisible && styles.headerHidden)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
        inert={footerVisible}
      >
        <motion.div
          aria-hidden
          className={archive.progress}
          style={{ scaleX: scrollYProgress }}
        />
        <div
          className={cn(
            archive.bar,
            scrolled && archive.barScrolled,
            active === 'home' && archive.barHero,
          )}
        >
          <div className={archive.inner}>
            <a
              href="#home"
              className={archive.brand}
              aria-label="Sunnyside, Aditya Himawan, back to the top"
              onClick={(event) => {
                event.preventDefault()
                go('home')
              }}
            >
              <SunnysideMark className={archive.mark} />
              <span className={archive.brandText}>
                <SunnysideWordmark className={archive.brandWord} />
                <span className={archive.brandRole}>Aditya Himawan</span>
              </span>
            </a>

            <nav className={archive.nav} aria-label="Chapters">
              {NAV.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  className={archive.navLink}
                  aria-current={active === chapter.id ? 'location' : undefined}
                  onClick={() => go(chapter.id)}
                >
                  {chapter.label}
                </button>
              ))}
            </nav>

            <div className={archive.headerTools}>
              <button
                type="button"
                className={archive.cta}
                onClick={() => go('contact')}
              >
                <span className={archive.ctaLabel}>Say hi</span>
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </button>
              <button
                ref={triggerRef}
                type="button"
                className={cn(archive.menuButton, archive.menuButtonWide)}
                aria-label="Open the chapter menu"
                aria-expanded={open}
                aria-controls="chapter-menu"
                onClick={() => setOpen(true)}
              >
                <Menu size={17} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="chapter-menu"
            className={cn(archive.menuPanel, styles.menuPanel)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className={styles.menuContent}>
              <div className={cn(archive.menuTop, styles.menuTop)}>
                <span className={archive.menuLabel}>
                  Aditya Himawan, Side A
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  className={archive.menuClose}
                  onClick={() => setOpen(false)}
                  aria-label="Close the menu"
                >
                  <X size={19} aria-hidden />
                </button>
              </div>

              <motion.nav
                className={cn(archive.menuNav, styles.menuNav)}
                aria-label="Site"
                style={{ '--rows': DESTINATIONS.length } as CSSProperties}
                initial={reduced ? false : { y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.28,
                  delay: 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {DESTINATIONS.map((destination) => (
                  <Link
                    key={destination.href}
                    href={destination.href}
                    className={cn(archive.menuLink, styles.menuLink)}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.menuLinkCopy}>
                      {destination.label}
                      <small className={styles.menuLinkNote}>
                        {destination.note}
                      </small>
                    </span>
                    <span className={archive.menuNum}>
                      {destination.number}
                    </span>
                  </Link>
                ))}
              </motion.nav>

              <div className={cn(archive.menuFoot, styles.menuFoot)}>
                <div className={archive.menuFootLinks}>
                  <Link
                    href="/music"
                    className={archive.menuFootLink}
                    onClick={() => setOpen(false)}
                  >
                    Mixtape
                  </Link>
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={archive.menuFootLink}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
                <span className={archive.menuNote}>Jakarta, GMT+7</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
