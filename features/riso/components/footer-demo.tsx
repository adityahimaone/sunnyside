'use client'

import * as React from 'react'

import PushpinTearFooter from '@/components/ui/pushpin-tear-footer'

import styles from '../riso.module.css'
import { RisoMark } from './brand'

const EMAIL = 'orders@risoco.berlin'

/**
 * The specimen, not a mock of it: the real component, fed the real tokens.
 *
 * The one prop that matters is `sheetInk`. The component defaults to white on
 * the sheet, which is 3.36:1 on this orange and fails AA for the sizes it is
 * set at. Carbon on the same orange is 5.30:1, so the demo prints black — which
 * is also what a risograph does when the second drum is black.
 */
export function FooterDemo() {
  const [drum, setDrum] = React.useState<'a' | 'b'>('a')
  const [seed, setSeed] = React.useState(23)

  const sheet = drum === 'a' ? '#f2542d' : '#1d63ff'

  return (
    <div className={styles.specimen}>
      <div className={styles.specimenBar}>
        <div className={styles.specimenGroup}>
          <span className={styles.label}>Drum</span>
          <div className={styles.segmented} role="group" aria-label="Drum">
            <button
              type="button"
              aria-pressed={drum === 'a'}
              onClick={() => setDrum('a')}
              data-ink="a"
            >
              Orange
            </button>
            <button
              type="button"
              aria-pressed={drum === 'b'}
              onClick={() => setDrum('b')}
              data-ink="b"
            >
              Blue
            </button>
          </div>
        </div>

        <div className={styles.specimenGroup}>
          <span className={styles.label}>Seed</span>
          <span className={styles.seed}>{seed}</span>
          <button type="button" className={styles.ghostButton} onClick={() => setSeed((s) => s + 1)}>
            Re-tear ↻
          </button>
        </div>

        <p className={styles.specimenNote}>
          Scroll it into view. The chrome assembles, the pin drops, and the sheet rips from the
          pin outward.
        </p>
      </div>

      <div className={styles.specimenStage}>
        <PushpinTearFooter
          brand="ink."
          name="riso co."
          logoHref="#specimen"
          logo={<RisoMark size={52} />}
          sheet={sheet}
          paper="#f1ede4"
          paperInk="#1b1712"
          sheetInk="#1b1712"
          seed={seed}
          email={EMAIL}
          newsletter={{ label: 'new prints, every other friday', placeholder: 'your@email' }}
          status={{ label: 'taking print orders' }}
          mark="run 0412"
          timeZone="Europe/Berlin"
          timeLabel="BER"
          socials={[
            { icon: 'ig', label: 'Instagram', href: '#' },
            { icon: 'x', label: 'X', href: '#' },
          ]}
          columns={[
            {
              title: 'shop',
              links: [
                { label: 'Broadside posters', href: '#' },
                { label: 'Risograph zines', href: '#' },
                { label: 'Uncut paper stock', href: '#' },
              ],
              cta: { label: 'shop.', href: '#' },
            },
            {
              title: 'studio',
              links: [
                { label: 'Stockists', href: '#' },
                { label: 'Wholesale runs', href: '#' },
                { label: 'Workshop visit', href: '#' },
              ],
              cta: { label: 'order.', href: `mailto:${EMAIL}` },
            },
          ]}
          sideLinks={[
            { icon: 'globe', label: 'shipping', href: '#' },
            { icon: 'doc', label: 'terms', href: '#' },
          ]}
          chat={{ label: 'order' }}
          copyright="© 2026 ink. riso co."
          credit="printed by hand in berlin"
          handle={{ label: '@ink.riso', href: '#' }}
          fontSans="var(--font-geist), system-ui, sans-serif"
          onRepin={(next) => setSeed(next)}
        />
      </div>
    </div>
  )
}
