'use client'

import WildHuntFooter from '@/components/ui/wild-hunt-footer'

export function FooterDemo() {
  return (
    <WildHuntFooter
      wordmark="HUGINN"
      image={{
        src: 'https://cdn.21st.dev/assets/mirror/67/671b69b8614847816a300a1d11ee5704a7b2f5c51b8b50d45f17dfc49af09b68.jpg',
        alt: 'Åsgårdsreien, the Wild Hunt of Odin, by Peter Nicolai Arbo, 1872',
        position: '50% 26%',
        cutout:
          'https://cdn.21st.dev/assets/mirror/69/692fb74acc74e0097901ca85075b1efbfdeebcb4d5edfe99874e9ec7e4847e0a.webp',
      }}
      palette={{ background: '#b82117', ink: '#f4efe5' }}
      tagline="Thought flies out at dawn · the print remembers its way home"
      sideNote="Huginn Studio · software made with intention"
      columns={[
        {
          title: 'Case',
          links: [
            { label: 'The idea', href: '#case' },
            { label: 'The effect', href: '#material' },
          ],
        },
        {
          title: 'System',
          links: [
            { label: 'Form states', href: '#system' },
            { label: 'Tokens', href: '#tokens' },
          ],
        },
        {
          title: 'Files',
          links: [
            { label: 'Brand guide', href: '/brand/huginn/README.md' },
            { label: 'Case library', href: '/design-system' },
          ],
        },
        {
          title: 'Source',
          links: [{ label: 'Case attribution', href: '#material' }],
        },
      ]}
      legal="© 2026 Huginn Studio · Case 03"
      colophon="Painting by Peter Nicolai Arbo, 1872 · Nasjonalmuseet, Oslo · public domain. Pointer and scan are optional; links remain ordinary anchors."
      grain={0.32}
      interactive
      height="min(100svh, 760px)"
      className="hg-footer-demo"
    />
  )
}
