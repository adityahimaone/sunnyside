'use client'

import * as React from 'react'
import PushpinTearFooter from '@/components/ui/pushpin-tear-footer'

export function FooterDemo() {
  const [edition, setEdition] = React.useState<'vermilion' | 'cobalt'>('vermilion')
  const [seed, setSeed] = React.useState(23)

  const isVermilion = edition === 'vermilion'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Specimen control bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--rs-surface-card)',
          borderBottom: '1px solid var(--rs-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--rs-text-subtle)' }}>
            Drum Edition:
          </span>
          <button
            type="button"
            onClick={() => setEdition('vermilion')}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: '99px',
              border: isVermilion ? '1.5px solid #ff4a1c' : '1px solid var(--rs-border)',
              backgroundColor: isVermilion ? '#fff0ec' : 'transparent',
              color: isVermilion ? '#ff4a1c' : 'var(--rs-text)',
              cursor: 'pointer',
            }}
          >
            Vermilion Run (#ff4a1c)
          </button>
          <button
            type="button"
            onClick={() => setEdition('cobalt')}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: '99px',
              border: !isVermilion ? '1.5px solid #1a7ff0' : '1px solid var(--rs-border)',
              backgroundColor: !isVermilion ? '#edf5fe' : 'transparent',
              color: !isVermilion ? '#1a7ff0' : 'var(--rs-text)',
              cursor: 'pointer',
            }}
          >
            Electric Cobalt (#1a7ff0)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--rs-text-subtle)' }}>
            Mulberry32 Seed: <strong>{seed}</strong>
          </span>
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--rs-border)',
              backgroundColor: 'var(--rs-surface)',
              color: 'var(--rs-text)',
              cursor: 'pointer',
            }}
          >
            Re-rip New Edge ⟳
          </button>
        </div>
      </div>

      {/* The Pushpin Tear Footer Specimen */}
      <div style={{ width: '100%', minHeight: '640px' }}>
        <PushpinTearFooter
          brand="ink."
          name="riso co."
          logoHref="#"
          logo={
            <span style={{ fontSize: '1.5em', fontWeight: 700, letterSpacing: '-0.04em' }}>
              ink.
            </span>
          }
          sheet={isVermilion ? '#ff4a1c' : '#1a7ff0'}
          paper="#f1ede4"
          paperInk="#1b1712"
          seed={seed}
          email="orders@risoco.berlin"
          newsletter={{ label: 'new prints, every other friday', placeholder: 'your@email' }}
          status={{ label: 'taking print orders' }}
          mark="run 0412"
          timeZone="Europe/Berlin"
          timeLabel="BER"
          socials={[
            { icon: 'ig', label: 'Instagram', href: 'https://instagram.com' },
            { icon: 'x', label: 'X', href: 'https://x.com' },
            { icon: 'github', label: 'GitHub', href: 'https://github.com' },
          ]}
          columns={[
            {
              title: 'shop',
              links: [
                { label: 'Broadside Posters', href: '#' },
                { label: 'Risograph Zines', href: '#' },
                { label: 'Uncut Paper Stock', href: '#' },
              ],
              cta: { label: 'shop.', href: '#' },
            },
            {
              title: 'studio',
              links: [
                { label: 'Stockists', href: '#' },
                { label: 'Wholesale Runs', href: '#' },
                { label: 'Workshop Visit', href: '#' },
              ],
              cta: { label: 'order.', href: 'mailto:orders@risoco.berlin' },
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
          onRepin={(newSeed) => setSeed(newSeed)}
        />
      </div>
    </div>
  )
}
