const PRIMITIVES: [string, string, string][] = [
  ['--hug-vermilion-300', '#FF5B4A', 'Field ink, lifted for dark grounds'],
  ['--hug-vermilion-500', '#E2281B', 'The poster field. Display and fills only'],
  ['--hug-vermilion-600', '#C11D12', 'Pressed field'],
  ['--hug-vermilion-700', '#A31810', 'Field ink that must carry small type'],
  ['--hug-cobalt-300', '#93A4FF', 'Focus ring on ink'],
  ['--hug-cobalt-500', '#1B2DB0', 'Focus ring on bone. The only cold note'],
  ['--hug-ink-950', '#080706', 'Sunken ground'],
  ['--hug-ink-900', '#100F0E', 'Ink, and the dark ground'],
  ['--hug-ink-800', '#1B1815', 'Raised ground in dark'],
  ['--hug-bone-000', '#FFFDF9', 'Paper white. Small type on the field'],
  ['--hug-bone-100', '#F4EFE5', 'Chalk. Raised ground, ink on dark'],
  ['--hug-bone-200', '#EBE5D8', 'The sheet'],
  ['--hug-bone-300', '#DFD6C3', 'Sunken ground'],
  ['--hug-bone-400', '#C9BFA9', 'Disabled ink'],
  ['--hug-moss-300', '#7FC49A', 'Success on ink'],
  ['--hug-moss-700', '#2C5B45', 'Success on bone'],
]

const SEMANTIC: [string, string, string][] = [
  ['--surface', '#EBE5D8', 'Page ground'],
  ['--surface-raised', '#F4EFE5', 'Cards, sheets, inputs'],
  ['--surface-sunken', '#DFD6C3', 'Wells, code, inert areas'],
  ['--ink', '#100F0E', 'Body text, edges'],
  ['--ink-muted', '#5A5346', 'Secondary text. 6.06:1'],
  ['--ink-on-field', '#FFFDF9', 'Type under 18px on the field'],
  ['--line', 'rgb(16 15 14 / 0.18)', 'Hairlines, input edges'],
  ['--line-strong', 'rgb(16 15 14 / 0.42)', 'Rules that must hold'],
  ['--accent', '#A31810', 'Links, buttons, action'],
  ['--accent-field', '#E2281B', 'The loud field. Display and fills'],
  ['--accent-ink', '#F4EFE5', 'Ink on accent'],
  ['--focus', '#1B2DB0', 'Focus ring. Never decorative'],
  ['--danger', '#A31810', 'Error text and error edge'],
  ['--ok', '#2C5B45', 'Success'],
  ['--selection', 'rgb(226 40 27 / 0.22)', 'Text selection'],
  ['--radius', '0px', 'Corners are cut, not rounded'],
]

const rows = (items: [string, string, string][]) =>
  items.map(([name, value, role]) => `| \`${name}\` | \`${value}\` | ${role} |`).join('\n')

export function GET() {
  const content = `# Huginn — design system

> A picture becomes cells. A name becomes cells.

Huginn is Case 03 in the design-system library: a print-first identity for a fictional software studio. It is a standalone specimen, served as one document — not a Sunnyside re-skin, and its footer component is not the portfolio-wide footer.

## Direction

Everything follows from one sentence: a picture becomes cells, a name becomes cells. The painting is reduced to an ordered dither, the wordmark is cut from a 22-row cell grid, and the dissolve between them runs the same grid at a different resolution. One operation, three scales.

The reference is the printed broadside — one colour, no resolution, type set by hand — not a dashboard. Corners are cut, not rounded. Nothing loops.

## Mark

The H is missing a cell. It sits one half-cell to the right of the stem, in the air, still flying. That omission is the whole logo: it is why the mark reads at 16px, and it is why the mark is never redrawn or cleaned up.

- Primary: 65 × 50, stray cell included. Clear space is one cell on every side.
- Compact: 30 × 30, single glyph, stray cell dropped — below 16px the flying cell is noise.
- Wordmark: 950 × 200, 95 columns, 760 cells, one path. Never live text.

## Palette

| Token | Value | Role |
| --- | --- | --- |
${rows(PRIMITIVES)}

## Semantic tokens (light)

| Token | Value | Role |
| --- | --- | --- |
${rows(SEMANTIC)}

Dark mode swaps the same sixteen roles; it does not introduce new colours.

## Type

Three voices, none of them a webfont: the drawn blackletter for the name only, the host's serif for reading, the host's mono for labels. No typeface is embedded or required, so the name renders identically offline and in print.

## The field

The field is a display surface, not a background for a page of text. Its measured contrast against paper white is 4.54:1 — enough for body-size type and no more. That single number governs the footer: on the field, hierarchy is carried by size and tracking, never by opacity. An earlier build dimmed its captions and measured 2.40:1.

## Components

- The Wild Hunt footer: a painting dissolved into the field by an ordered-dither mask, a drawn wordmark, reticle, grain, link columns and a colophon. Configurable wordmark, palette, image, dissolve, grain and interactivity.
- Native form specimen: label, hint, error, error summary with focus management, \`aria-invalid\`, \`aria-describedby\`.
- Focus: 3px cobalt ring at 3px offset. Cobalt means "keyboard focus here" and nothing else.
- Reduced motion lands on a finished still — the resolved wordmark and revealed captions are valid frames.

## Assets

- Specimen: \`public/design-system/huginn/index.html\` (self-contained; zero network requests)
- Marks: \`public/brand/huginn/{mark,mark-compact,wordmark,lockup}.svg\`
- Tokens: \`public/brand/huginn/huginn-tokens.{css,json}\`
- Board: \`public/brand/huginn/huginn-brandkit.png\`
- Audit: \`public/design-system/huginn/audit.md\`
- Decisions: \`public/design-system/huginn/DESIGN.md\`

## Gaps

Verified in Chromium only: 43 rendered elements × 2 themes at 0 contrast failures, 53 focusables all ringed, reduced motion landing on a still, no horizontal overflow at 1440 or 390. Not verified: Safari and Firefox rendering, the print sheet, screen reader output, and real content.

Source: https://adityahimaone.space/design-system/huginn
`
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
