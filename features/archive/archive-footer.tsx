'use client'

import Link from 'next/link'

import { ScriptWord } from '@/features/landing-page/studio/script-word'

import styles from './archive.module.css'

const BROWSE = [
  { href: '/', label: 'Side A' },
  { href: '/projects', label: 'Projects' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/skills', label: 'Skills' },
  { href: '/design-engineering', label: 'Practice' },
  { href: '/blog', label: 'Blog' },
  { href: '/music', label: 'Mixtape' },
] as const

const ELSEWHERE = [
  { href: 'https://github.com/adityahimaone', label: 'GitHub' },
  { href: 'https://linkedin.com/in/adityahimaone', label: 'LinkedIn' },
  {
    href: 'https://open.spotify.com/user/212nmrqpklzmvpntgorzpavgq',
    label: 'Spotify',
  },
  { href: 'mailto:adityahimaone@gmail.com', label: 'Email' },
] as const

/**
 * The archive's sign-off.
 *
 * The landing page ends with a full-viewport sticker sheet and a wordmark the
 * height of a door. This is the same cobalt, the same hand and the same one
 * sticker, at the scale of a colophon: the address, two link columns, a
 * baseline. Four routes end the same way, so the footer is deliberately the
 * quietest loud thing in the wing.
 */
export function ArchiveFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div>
            <ScriptWord text="say hi" className={styles.footerScript} />
            <a
              href="mailto:adityahimaone@gmail.com?subject=Hello%20Aditya"
              className={styles.footerMail}
            >
              adityahimaone@gmail.com
            </a>
            <p className={styles.footerNote}>
              Frontend work, design engineering, and the occasional hard
              interface problem. Replies within a couple of days.
            </p>
          </div>

          <div className={styles.footerCols}>
            <nav aria-label="Browse the archive">
              <h2 className={styles.footerColTitle}>Browse</h2>
              <ul className={styles.footerList}>
                {BROWSE.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Elsewhere">
              <h2 className={styles.footerColTitle}>Elsewhere</h2>
              <ul className={styles.footerList}>
                {ELSEWHERE.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={styles.footerLink}
                      target={
                        item.href.startsWith('mailto:') ? undefined : '_blank'
                      }
                      rel={
                        item.href.startsWith('mailto:')
                          ? undefined
                          : 'noopener noreferrer'
                      }
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className={styles.footerBase}>
          <span>© {year} Aditya Himawan</span>
          <span>Made on Side A, Jakarta GMT+7</span>
          <Link href="/sunnyside" className={styles.footerBaseLink}>
            The Sunnyside system
          </Link>
          <button
            type="button"
            className={styles.footerTopButton}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                  .matches
                  ? 'auto'
                  : 'smooth',
              })
            }
          >
            Back to top
            <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
