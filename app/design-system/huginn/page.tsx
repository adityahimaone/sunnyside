import type { Metadata } from 'next'
import Link from 'next/link'

import styles from './embed.module.css'

export const metadata: Metadata = {
  title: 'Huginn — Design System',
  description:
    'A picture becomes cells. A name becomes cells. Huginn is a print-first identity: Arbo’s Åsgårdsreien as an ordered dither, a blackletter wordmark cut into a 22-row cell grid, one vermilion field and an honest audit.',
  alternates: {
    canonical: '/design-system/huginn',
    types: { 'text/markdown': '/design-system/huginn/llms.txt' },
  },
  openGraph: {
    title: 'Huginn — Design System',
    description: 'A picture becomes cells. A name becomes cells.',
    url: '/design-system/huginn',
    type: 'website',
    images: [
      {
        url: '/brand/huginn/huginn-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Huginn brand board: the two-bracket keystone mark, the drawn blackletter wordmark, the vermilion field and the ordered-dither painting.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huginn — Design System',
    description: 'A picture becomes cells. A name becomes cells.',
    images: ['/brand/huginn/huginn-brandkit.png'],
  },
}

/**
 * The specimen is a complete document — its own styles, its own theme script,
 * its own sticky contents — so it is served as one rather than re-implemented
 * in React. It lives at public/design-system/huginn/specimen.html, copied
 * straight from the standalone build, so there is only ever one copy of the
 * specimen and the case page cannot drift from it.
 *
 * The filename is load-bearing. Cloudflare serves static assets ahead of the
 * worker, so an `index.html` in this same directory resolves
 * `/design-system/huginn` to the document and this page never runs — which is
 * exactly what happened on the first deploy: correct under `next dev`, dead in
 * production. `specimen.html` leaves the route alone.
 *
 * That copy is also the one path exempted from the site-wide
 * `X-Frame-Options: DENY` in next.config.mjs. Remove the exemption and the
 * iframe goes blank with ERR_BLOCKED_BY_RESPONSE under any host that applies
 * Next's headers to static files; remove the iframe and the exemption is dead
 * weight.
 */
export default function HuginnCasePage() {
  return (
    <div className={styles.embed}>
      <div className={styles.bar}>
        <Link href="/design-system">← All design systems</Link>
        <span>
          Huginn <b>·</b> Case 03
        </span>
        <a href="/design-system/huginn/specimen.html" target="_blank" rel="noreferrer">
          Open standalone ↗
        </a>
      </div>
      <iframe
        src="/design-system/huginn/specimen.html"
        title="Huginn design system specimen"
        className={styles.frame}
      />
    </div>
  )
}
