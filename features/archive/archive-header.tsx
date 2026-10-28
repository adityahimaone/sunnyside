'use client'

import { AnimatePresence, motion, useScroll } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import {
  SunnysideMark,
  SunnysideWordmark,
} from '@/components/ui/sunnyside-logo'
import { cn } from '@/lib/utils'

import styles from './archive.module.css'

const ROUTES = [
  { href: '/projects', label: 'Projects', number: '01' },
  { href: '/design-system', label: 'Design System', number: '02' },
  { href: '/bookmarks', label: 'Bookmarks', number: '03' },
  { href: '/skills', label: 'Skills', number: '04' },
  { href: '/blog', label: 'Blog', number: '05' },
  { href: '/design-engineering', label: 'Practice', number: '06' },
] as const

const ELSEWHERE = [
  { href: '/', label: 'Side A' },
  { href: '/music', label: 'Mixtape' },
  { href: '/sunnyside', label: 'The system' },
] as const

const SOCIALS = [
  { href: 'https://github.com/adityahimaone', label: 'GitHub' },
  { href: 'https://linkedin.com/in/adityahimaone', label: 'LinkedIn' },
  { href: 'https://x.com/adityahimaone', label: 'X' },
] as const

function isHere(href: string, pathname: string) {
  if (href === '/blog' && pathname.startsWith('/guides')) return true
  // The case library and its Sunnyside specimen share one nav entry.
  if (
    href === '/design-system' &&
    (pathname === '/sunnyside' || pathname.startsWith('/design-system'))
  )
    return true
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * The archive's topbar.
 *
 * Side A's header is a chapter selector for one long scroll. Here the reader is
 * moving between the archive rooms, so the bar names them instead: the wordmark
 * returns to the studio, the shelves and the practice manual sit in the middle,
 * and the one action
 * is the same "Say hi" the landing page offers. The cobalt phone panel is the
 * landing menu's pattern, not a second navigation idea.
 */
export function ArchiveHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 8)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
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
        'a[href], button:not([disabled])',
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
    }
  }, [open])

  return (
    <>
      <header className={styles.header}>
        <motion.div
          aria-hidden
          className={styles.progress}
          style={{ scaleX: scrollYProgress }}
        />
        <div className={cn(styles.bar, scrolled && styles.barScrolled)}>
          <div className={styles.inner}>
            <Link
              href="/"
              className={styles.brand}
              aria-label="Sunnyside — Aditya Himawan, back to Side A"
            >
              <SunnysideMark className={styles.mark} />
              <span className={styles.brandText}>
                <SunnysideWordmark className={styles.brandWord} />
                <span className={styles.brandRole}>Aditya Himawan</span>
              </span>
            </Link>

            <nav className={styles.nav} aria-label="Archive">
              {ROUTES.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={styles.navLink}
                  aria-current={
                    isHere(route.href, pathname) ? 'page' : undefined
                  }
                >
                  {route.label}
                </Link>
              ))}
            </nav>

            <div className={styles.headerTools}>
              <Link href="/#contact" className={styles.cta} aria-label="Say hi">
                <span className={styles.ctaLabel}>Say hi</span>
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </Link>
              <button
                type="button"
                className={styles.menuButton}
                aria-label="Open the archive menu"
                aria-expanded={open}
                aria-controls="archive-menu"
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
            id="archive-menu"
            className={styles.menuPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Archive menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className={styles.menuTop}>
              <span className={styles.menuLabel}>
                The back room, every shelf
              </span>
              <button
                ref={closeRef}
                type="button"
                className={styles.menuClose}
                aria-label="Close the archive menu"
                onClick={() => setOpen(false)}
              >
                <X size={19} aria-hidden />
              </button>
            </div>

            <nav className={styles.menuNav} aria-label="Archive sections">
              {ROUTES.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={styles.menuLink}
                  aria-current={
                    isHere(route.href, pathname) ? 'page' : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  {route.label}
                  <span className={styles.menuNum}>{route.number}</span>
                </Link>
              ))}
            </nav>

            <div className={styles.menuFoot}>
              <div className={styles.menuFootLinks}>
                {ELSEWHERE.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.menuFootLink}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {SOCIALS.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.menuFootLink}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <span className={styles.menuNote}>Jakarta, GMT+7</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
