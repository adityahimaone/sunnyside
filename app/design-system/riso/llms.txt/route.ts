import tokens from '@/features/riso/tokens.json'

const rows = (items: { name?: string; value?: string; role: string }[]) =>
  items.map((item) => `| ${item.name ?? item.role} | ${item.value ?? ''} | ${item.role} |`).join('\n')

export function GET() {
  const content = `# Riso Co. / Atelier Ink — design system

> A torn poster pinned to studio cork.

Riso Co. is Case 04 in the design-system library: a tactile identity and interface specimen for a risograph print edition workshop and paper lab.

## Direction

The identity pairs raw unbleached 270gsm rag vellum with electric vermilion and federal cobalt ink sheets. Algorithmic deckle-edge physics is the signature effect: an 84-point ridge and 6 curled flaps with drop shadow generated deterministically via Mulberry32 PRNG. A glossy mechanical pushpin stabs and anchors the sheet.

## Mark

The Pin & Deckle mark combines the domed silhouette of a pushpin puncturing a torn paper corner. Grid: 64 units. Tested at 16px silhouette for favicon rendering. Clear space is half the mark height.

## Palette

${rows(tokens.primitives)}

## Semantic tokens

${rows(tokens.semantic.light)}

## Component Specimen

- Pushpin Tear Footer ('components/ui/pushpin-tear-footer.tsx'): A site footer built as a torn poster. An electric dyed sheet carries the footer's chrome (back to top, socials, monogram, email-copy toast, newsletter input, availability beacon, live city clock, and link columns).
- When scrolled into view, chrome assembles, the pushpin drops and stabs, and the sheet rips outward from the pin with a white fiber deckle rim and curled flaps casting shadows.
- Clicking the pushpin re-pins a fresh seed and tears a new edge.
- No external image dependencies: 100% SVG and canvas generated mathematically from numbers.

## Assets and files

- Tokens: 'features/riso/tokens.json' -> 'features/riso/riso-tokens.css' and 'public/brand/riso/riso-tokens.json'.
- Route: 'app/design-system/riso/page.tsx'.
- Component: 'components/ui/pushpin-tear-footer.tsx'.
- Standalone demo: 'components/ui/demo.tsx'.
- Brand vectors: 'public/brand/riso/cover.svg', 'public/brand/riso/mark.svg', 'public/brand/riso/lockup.svg'.

Source: https://adityahimaone.space/design-system/riso
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
