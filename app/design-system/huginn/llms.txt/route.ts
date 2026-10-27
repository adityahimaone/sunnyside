import tokens from '@/features/huginn/tokens.json'

const rows = (items: { name?: string; value?: string; role: string }[]) =>
  items
    .map(
      (item) =>
        `| ${item.name ?? item.role} | ${item.value ?? ''} | ${item.role} |`,
    )
    .join('\n')

export function GET() {
  const content = `# Huginn Studio — design system

> A thought crosses the threshold and returns in print.

Huginn Studio is Case 03 in the design-system library: a standalone specimen for a fictional software studio. It is not a Sunnyside re-skin and its footer component is not the portfolio-wide footer.

## Direction

The identity pairs bone paper and iron ink with one vermilion field. Ordered dither is the signature effect: it marks an image crossing into print. No raven, rune circle or generic agency crest.

## Mark

The Threshold / Print mark is an H-like frame interrupted by a small, ordered dot trace. Grid: 64 units. The compact mark removes the dots and preserves the solid silhouette for 16px. Clear space is half the mark height. Wordmark artwork is SVG paths, not live text.

## Palette

${rows(tokens.primitives)}

## Semantic tokens

${rows(tokens.semantic.light)}

## Components

- The Wild Hunt Footer accepts image source/alt/position/optional transparent cutout, wordmark, palette/preset, image height/dissolve, captions, link columns, legal/citation copy, grain and interactivity controls.
- Native form specimen: name, email, select, textarea, radio group, checkbox, switch and disabled file input; error summary and success feedback.
- Focus: brass outline with offset. Reduced motion displays a completed frame.

## Assets and files

- Tokens: 'features/huginn/tokens.json' -> 'features/huginn/huginn-tokens.css' and 'public/brand/huginn/huginn-tokens.json'.
- Route: 'app/design-system/huginn/page.tsx'.
- Component: 'components/ui/wild-hunt-footer.tsx'.
- Guide and board: 'design/brand/huginn/', 'public/brand/huginn/cover.svg'.

## Gaps

Remote image-host availability is not controlled by this project. Browser checks outside the verified local Chromium pass are not claimed. No automated visual regression or axe CI is included.

Source: https://adityahimaone.space/design-system/huginn
`
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
