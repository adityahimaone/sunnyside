'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Menu, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import {
  SunnysideMark,
  SunnysideWordmark,
} from '@/components/ui/sunnyside-logo'
import { cn } from '@/lib/utils'

import type { HeroSurface } from './hero/cutting-mat-marks'
import { CHAPTERS, SOCIALS, scrollToSection } from './studio-data'
import styles from './studio.module.css'

type Props = {
  active: string
  scrolled: boolean
  footerVisible: boolean
  heroSurface?: HeroSurface
}

export type IslandSurfaceMode = 'auto' | 'black' | 'glass'

const NAV = CHAPTERS.filter((chapter) => chapter.id !== 'home')

/**
 * The menu's destinations.
 *
 * Rendered inside the expanded Supaste-style notch island drawer as visual
 * shelf cards, paired with the chapter pill bar above them.
 */
const DESTINATIONS = [
  {
    href: '/sunnyside',
    label: 'Sunnyside',
    note: 'the specimen',
    number: '00',
    tone: 'butter',
    tag: 'Tokens & Type',
  },
  {
    href: '/design-system',
    label: 'Design System',
    note: 'the case library',
    number: '01',
    tone: 'cobalt',
    tag: 'Systems',
  },
  {
    href: '/projects',
    label: 'Projects',
    note: 'the shelf',
    number: '02',
    tone: 'tangerine',
    tag: 'Selected Work',
  },
  {
    href: '/bookmarks',
    label: 'Bookmarks',
    note: 'the crate',
    number: '03',
    tone: 'mint',
    tag: 'Curated Links',
  },
  {
    href: '/skills',
    label: 'Skills',
    note: 'the toolbox',
    number: '04',
    tone: 'sky',
    tag: 'Capabilities',
  },
  {
    href: '/blog',
    label: 'Blog',
    note: 'field notes',
    number: '05',
    tone: 'pink',
    tag: 'Essays',
  },
  {
    href: '/design-engineering',
    label: 'Practice',
    note: 'the field manual',
    number: '06',
    tone: 'paper',
    tag: 'Handbook',
  },
] as const

export function SiteHeader({
  active,
  scrolled,
  footerVisible,
  heroSurface = 'cobalt',
}: Props) {
  const reduced = useReducedMotion() ?? false
  const [open, setOpen] = useState(false)
  const [surfaceMode, setSurfaceMode] = useState<IslandSurfaceMode>('auto')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const islandRef = useRef<HTMLDivElement>(null)

  // Resolve effective surface ('black' or 'glass'):
  // In 'auto' mode, the island is pitch black on the hero (like Supaste's top notch)
  // and when the drawer is open, and shifts to liquid glass once scrolled onto the paper chapters.
  const onHero = active === 'home' && !scrolled
  const resolvedSurface: 'black' | 'glass' =
    surfaceMode === 'auto' ? (open || onHero ? 'black' : 'glass') : surfaceMode

  // When liquid glass is over the blue hero at the top, keep light foreground text;
  // when over the warm paper chapters, use dark ink text.
  const glassTone: 'on-dark' | 'on-light' =
    active === 'home' && heroSurface === 'cobalt' && !scrolled
      ? 'on-dark'
      : 'on-light'

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = islandRef.current?.querySelectorAll<HTMLElement>(
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
    }
  }, [open])

  const go = (id: string) => {
    const wasOpen = open
    setOpen(false)
    window.setTimeout(
      () => scrollToSection(id, reduced),
      wasOpen && !reduced ? 140 : 0,
    )
  }

  return (
    <>
      <div
        className={styles.islandBackdrop}
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <header
        className={cn(
          styles.islandHeader,
          footerVisible && styles.headerHidden,
        )}
        inert={footerVisible}
      >
        <div
          ref={islandRef}
          className={cn(
            styles.island,
            open && styles.islandOpen,
            scrolled && styles.islandScrolled,
          )}
          data-surface={resolvedSurface}
          data-glass-tone={glassTone}
          data-open={open ? 'true' : 'false'}
          role={open ? 'dialog' : undefined}
          aria-modal={open ? 'true' : undefined}
          aria-label={open ? 'Site navigation' : undefined}
        >
          {/* Unified single-element surface + concave top ears (zero seam in Liquid Glass & Black) */}
          <span className={styles.islandSurface} aria-hidden="true" />
          {/* Continuous specular rim that curves smoothly through both concave top ears */}
          <span className={styles.islandRim} aria-hidden="true" />

          {/* Top bar of the island (always visible, anchors both collapsed & expanded states) */}
          <div className={styles.islandBar}>
            <a
              href="#home"
              className={styles.islandBrand}
              aria-label="Sunnyside, Aditya Himawan, back to the top"
              onClick={(event) => {
                event.preventDefault()
                go('home')
              }}
            >
              <SunnysideMark className={styles.islandMark} />
              <span className={styles.islandBrandText}>
                <SunnysideWordmark className={styles.islandBrandWord} />
              </span>
            </a>

            <nav className={styles.islandNav} aria-label="Chapters">
              {NAV.map((chapter) => {
                const isActive = active === chapter.id
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    className={styles.islandNavLink}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={() => go(chapter.id)}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="island-nav-pill"
                        className={styles.islandNavActivePill}
                        transition={{
                          type: 'spring',
                          duration: 0.34,
                          bounce: 0.12,
                        }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className={styles.islandNavLinkLabel}>
                      {chapter.label}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className={styles.islandActions}>
              <button
                type="button"
                className={styles.islandCta}
                onClick={() => go('contact')}
              >
                <span>Say hi</span>
                <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden />
              </button>

              <button
                ref={triggerRef}
                type="button"
                className={styles.islandMenuBtn}
                aria-label={
                  open ? 'Close the navigation menu' : 'Open the chapter menu'
                }
                aria-expanded={open}
                aria-controls="chapter-menu"
                onClick={() => setOpen((prev) => !prev)}
              >
                <span
                  className={cn(
                    styles.islandMenuIcon,
                    styles.islandMenuIconOpen,
                  )}
                  data-visible={open ? 'false' : 'true'}
                  aria-hidden="true"
                >
                  <Menu size={16} strokeWidth={2.2} />
                </span>
                <span
                  className={cn(
                    styles.islandMenuIcon,
                    styles.islandMenuIconClose,
                  )}
                  data-visible={open ? 'true' : 'false'}
                  aria-hidden="true"
                >
                  <X size={16} strokeWidth={2.2} />
                </span>
              </button>
            </div>
          </div>

          {/* Seamless Expanded Island Tray (always mounted, interruptible CSS grid-row collapse) */}
          <div
            id="chapter-menu"
            className={styles.islandTray}
            data-open={open ? 'true' : 'false'}
            aria-hidden={!open}
            inert={!open}
          >
            <div className={styles.islandTrayClip}>
              <div className={styles.islandTrayInner}>
                {/* Row 1: Supaste-style horizontal pill tabs for page chapters + surface switcher */}
                <div className={styles.islandTrayToolbar}>
                  <div
                    className={styles.islandChapterPills}
                    role="group"
                    aria-label="Jump to page section"
                  >
                    {CHAPTERS.map((chapter) => {
                      const isCurrent = active === chapter.id
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          className={styles.islandChapterPill}
                          data-active={isCurrent ? 'true' : 'false'}
                          onClick={() => go(chapter.id)}
                        >
                          <span>{chapter.label}</span>
                          <span className={styles.islandChapterCount}>
                            {chapter.number}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div
                    className={styles.islandSurfacePills}
                    role="group"
                    aria-label="Navbar surface theme"
                  >
                    <button
                      type="button"
                      className={styles.islandSurfaceChoice}
                      data-selected={
                        resolvedSurface === 'black' ? 'true' : 'false'
                      }
                      onClick={() => setSurfaceMode('black')}
                    >
                      Black
                    </button>
                    <button
                      type="button"
                      className={styles.islandSurfaceChoice}
                      data-selected={
                        resolvedSurface === 'glass' ? 'true' : 'false'
                      }
                      onClick={() => setSurfaceMode('glass')}
                    >
                      <Sparkles size={11} aria-hidden />
                      Liquid Glass
                    </button>
                  </div>
                </div>

                {/* Row 2: Supaste-style visual card shelf for site destinations */}
                <nav
                  className={styles.islandCardsGrid}
                  aria-label="Site destinations"
                >
                  {DESTINATIONS.map((destination, index) => (
                    <div
                      key={destination.href}
                      className={styles.islandCardSlot}
                      style={{ '--card-i': index } as React.CSSProperties}
                    >
                      <Link
                        href={destination.href}
                        prefetch={open ? undefined : false}
                        className={styles.islandCard}
                        data-tone={destination.tone}
                        onClick={() => setOpen(false)}
                      >
                        <div className={styles.islandCardPreview}>
                          <span className={styles.islandCardNum}>
                            {destination.number}
                          </span>
                          <span className={styles.islandCardTag}>
                            {destination.tag}
                          </span>
                          <ArrowUpRight
                            size={15}
                            className={styles.islandCardArrow}
                            aria-hidden
                          />
                        </div>
                        <div className={styles.islandCardBody}>
                          <span className={styles.islandCardTitle}>
                            {destination.label}
                          </span>
                          <span className={styles.islandCardNote}>
                            {destination.note}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </nav>

                {/* Row 3: Compact footer bar inside the expanded island */}
                <div className={styles.islandTrayFoot}>
                  <div className={styles.islandFootLinks}>
                    <Link
                      href="/music"
                      prefetch={open ? undefined : false}
                      className={styles.islandFootLink}
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
                        className={styles.islandFootLink}
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                  <span className={styles.islandFootMeta}>
                    Aditya Himawan · Side A · Jakarta, GMT+7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
