import {
  DITHER_AUDIT,
  GAPS,
  OUTPUT_CONTRACT,
  SKILL_RESOURCES,
} from '@/features/vitrine/audit'
import tokens from '@/features/vitrine/tokens.json'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const dark = Object.fromEntries(
    tokens.semantic.dark.map((token) => [token.name, token]),
  ) as Record<string, { value: string; resolved?: string; role: string }>

  const brand = `# Vitrine — design system, brand guide and audit

> A glass case for a low-resolution light.

Vitrine is the second case in the Sunnyside portfolio: a glass-and-dither
design system documented at https://adityahimaone.space/design-system/vitrine. It is a
separate system from Sunnyside (paper, cobalt, sun). The source of truth is the
live route and the files below; this Markdown twin is for agents and for readers
who do not run JavaScript.

## 1. The one idea

**The case and the grain.** A vitrine holds one lit object; the halftone label
is the only print. In the interface, glass is the container and dither is the
information layer. The glass never becomes the content, and the dither never
sits under the words that explain it.

- Essence: a glass case for a low-resolution light.
- Promise: depth without fog.
- Voice: precise, lit, unhurried. Museum labels, not marketing.
- Not this: a frosted card with an unreadable paragraph, a gradient blob, a
  1-bit retro toy, or a Sunnyside re-skin.

## 2. Mark

The mark is **Split V**: two panes meeting at a point, one solid, one dithered.

| Property | Value |
| --- | --- |
| ViewBox | 64 × 64 |
| Stroke | 13 units, square caps |
| Apex | 32, 49 |
| Left pane | M16 14 32 49, solid |
| Right pane | M32 49 48 14, 4-unit checker dither |
| Dot | Signal, r 3.2 at the apex |
| Compact mark | 15-unit strokes, both panes solid, 2-unit seam, 16–24px |
| Full mark minimum | 32px |
| Compact minimum | 16px |
| Clear space | Half the mark height on every side |

Files: \`public/brand/vitrine/mark.svg\`, \`mark-reverse.svg\`,
\`mark-compact.svg\`, \`mark-compact-reverse.svg\`, \`glyph.svg\`.

### Why the other five lost

1. **Aperture** — a split lens; read as a camera shutter and collapsed to a dot
   at 16px.
2. **Case tile** — the app-store tile failure: a rounded square with a glyph.
3. **Stacked panes** — unreadable at 16px and too close to a bar chart.
4. **Halftone V** — the dots vanished at 32px; no silhouette.
5. **Lens bar** — a pill at small sizes; no letter and no meaning.

## 3. Wordmark and lockups

The wordmark is the real type, frozen as outlines: Space Grotesk 700,
\`vitrine\`, tracking −0.04em, seven glyph paths, no \`<text>\`. It is 2.87 ×
0.76 em. At 25px high it is 94.8px wide.

| Lockup | File | Spec |
| --- | --- | --- |
| Horizontal | \`lockup.svg\` | mark 34, gap 10, wordmark 25 high |
| Horizontal reverse | \`lockup-reverse.svg\` | Frost on Case |
| Stacked | \`lockup-stacked.svg\` | mark 48, gap 12, wordmark 28 |
| Stacked reverse | \`lockup-stacked-reverse.svg\` | Frost on Case |
| Wordmark | \`wordmark.svg\` | currentColor; reverse copy exists |

Minimum lockup width: 130px. At 480px the name is not used in this identity; the
lockup is the mark plus the wordmark at every width. Below 360px use the compact
mark alone for a header.

## 4. Palette

| Token | Value | Role | Contrast |
| --- | --- | --- | --- |
| \`--vt-case\` | #0B0D10 | Ground, ink, the case | 17.89:1 on Frost |
| \`--vt-frost\` | #F2F6F8 | Light ground, glass white | 17.89:1 on Case |
| \`--vt-graphite\` | #45525B | Secondary text on light | 7.40:1 on Frost |
| \`--vt-signal\` | #D9FF43 | The one loud field | 16.99:1 with Case |
| \`--vt-iris\` | #5B4BE8 | Focus, links, cool accent | 5.34:1 on Frost |
| \`--vt-clay\` | #B23A1D | Error on light | 5.49:1 on Frost |
| \`--vt-mint\` | #7CF0C4 | Success on dark | 14.01:1 on Case |

Rules: one loud field per page. Signal is the field; the rest are surfaces,
text roles or status accents. Glass is a material, not a colour. The mark is
Case on light, Frost on dark, with a Signal dot.

## 5. Type

| Voice | Face | Size / tracking |
| --- | --- | --- |
| Display | Space Grotesk 700 | 64–190px, −0.055em, 0.94 leading |
| Reading | Geist 400 | 16–18px, 1.6 leading |
| Label | Geist Mono 500 | 10–12px, 0.14em, uppercase |

## 6. Tokens

The token source is \`features/vitrine/tokens.json\`. It generates
\`features/vitrine/vitrine-tokens.css\` and the public JSON/CSS downloads.
125 declarations across three layers:

1. **Primitive** — Case, Frost, Graphite, Signal, Iris, Clay, Mint.
2. **Semantic** — bg, fg, muted, border, surface, accent, focus, danger,
   glass-fill, dither-ink, dither-paper.
3. **Component** — field-bg, field-border, field-focus-ring, button-bg,
   card-bg, tab-bg, chip-bg.

### Semantic roles

${table(
  ['Token', 'Light', 'Dark', 'Role'],
  tokens.semantic.light.map((token) => [
    `--vt-${token.name}`,
    token.resolved ?? token.value,
    dark[token.name]?.resolved ?? dark[token.name]?.value ?? '',
    token.role,
  ]),
)}

### Component roles

${table(
  ['Token', 'Light', 'Dark', 'Role'],
  tokens.components.light.map((token) => {
    const darkToken = tokens.components.dark.find(
      (candidate) => candidate.name === token.name,
    )
    return [
      `--vt-${token.name}`,
      token.value,
      darkToken?.value ?? '',
      token.role,
    ]
  }),
)}

### Glass recipe

- Fill: 58% white on light, 9% white on case.
- Edge: 1px \`--vt-glass-edge\`.
- Specular: \`inset 0 1px 0 --vt-glass-highlight\`.
- Hard line: \`0 1px 0 --vt-glass-edge\`; the soft lift is lighting only.
- Blur: 18px with saturate 1.45. Never on body copy.

### Contrast pairs

${table(
  ['Pair', 'Ratio', 'Use'],
  tokens.contrast.map((pair) => [pair.label, `${pair.ratio}:1`, pair.use]),
)}

## 7. Components

The case page ships ten native controls in one specimen form. There is no
component package; the page is the reference and the CSS lives with the feature.

- Text input (name), email, password with show/hide.
- Native select, styled with a chevron and \`appearance: none\`.
- Textarea with a 280-character counter.
- Radio group (team size) in a \`<fieldset>\` with a \`<legend>\`.
- Checkbox (updates) and a button with \`role="switch"\`.
- Range input with a visible value.
- File input inside a dropzone label.
- Disabled example, hint text, error text, error summary with links.
- Focus: 2px outline plus a 3px ring; never removed.
- Error summary takes focus; fields use \`aria-invalid\` and
  \`aria-describedby\`.

Paths: \`features/vitrine/components/form-demo.tsx\`,
\`features/vitrine/vitrine.module.css\`,
\`app/design-system/vitrine/page.tsx\`.

## 8. Dither

The dithercn engine is installed in \`lib/dither\` (13 files) with the agent
skill in \`.agents/skills/dithercn\` and \`.claude/skills/dithercn\` (9 files
each). The engine is current: \`colorField\` is present.

The signature field is \`features/vitrine/components/dither-lens.tsx\`: a
refraction lens. The field computes a caustic ring map in square units, and the
colour field runs iris at the core to signal at the rim. It uses
\`palette={['--vt-bg', '--vt-iris', '--vt-signal']}\`, \`matrix="bayer8"\`,
\`levels={17}\`, \`cell={4}\`, \`stillTime={6}\`. Under
\`prefers-reduced-motion: reduce\` the engine holds a finished frame
(\`data-state="static"\`).

No example component was installed: none of the examples is a lens case. The
rest of the page uses CSS dot fields (the card edge, material study and case
quote), so only one WebGL context is live.

## 9. Audit

Skill resources: ${SKILL_RESOURCES.filter((r) => r.present).length}/${SKILL_RESOURCES.length} present.
Used as shipped: ${SKILL_RESOURCES.filter((r) => r.status === 'used').length};
substituted: ${SKILL_RESOURCES.filter((r) => r.status === 'substituted').length};
not used: ${SKILL_RESOURCES.filter((r) => r.status === 'not used').length}.

Output contract: ${OUTPUT_CONTRACT.filter((i) => i.status === 'shipped').length}/${OUTPUT_CONTRACT.length} shipped.

### Skill resources

${table(
  ['Resource', 'Present', 'Use', 'Evidence'],
  SKILL_RESOURCES.map((resource) => [
    `\`${resource.path.replace('skills/sunnyside-brand-system/', '')}\``,
    resource.present ? 'yes' : 'no',
    resource.status,
    resource.evidence,
  ]),
)}

### Output contract

${table(
  ['Item', 'Status', 'Evidence'],
  OUTPUT_CONTRACT.map((item) => [item.item, item.status, item.evidence]),
)}

### Dithercn check

${table(
  ['Item', 'Status', 'Evidence'],
  DITHER_AUDIT.map((item) => [item.item, item.status, item.evidence]),
)}

### Known gaps

${GAPS.map((gap) => `- ${gap}`).join('\n')}

## 10. File map

| Concern | Path |
| --- | --- |
| Route and tokens | \`app/design-system/vitrine/page.tsx\` (\`.vt-scope\` on the page root) |
| Token source | \`features/vitrine/tokens.json\` |
| Generated CSS | \`features/vitrine/vitrine-tokens.css\` |
| Page CSS | \`features/vitrine/vitrine.module.css\` |
| Form specimen | \`features/vitrine/components/form-demo.tsx\` |
| Dither lens | \`features/vitrine/components/dither-lens.tsx\` |
| Brand components | \`features/vitrine/components/brand.tsx\` |
| Audit data | \`features/vitrine/audit.ts\` |
| Brand brief | \`design/brand/vitrine/brief.md\` |
| Brand board | \`design/brand/vitrine/vitrine-brandkit.png\` |
| Board source | \`design/brand/vitrine/brandkit.html\` |
| Guide | \`design/brand/vitrine/README.md\` |
| Logo SVGs | \`public/brand/vitrine/\` |
| Favicon | \`public/brand/vitrine/favicon.ico\` |
| Tokens download | \`public/brand/vitrine/vitrine-tokens.json\` |

## 11. Verification

- Mark tested at 16, 24, 32, 64, 512 and as a favicon on light/dark chrome.
- Lockup tested at 130, 240 and 512; compact mark at 16 and 24.
- ICO contains 16, 32 and 48.
- Body contrast 4.5:1; large 3:1; every pair listed in section 6.
- Page checked at 1440 and 390, light and dark, reduced motion, in Chromium.
- Page is readable without JavaScript: the prose, tables and downloads are
  server-rendered; the dither and form states need JS.

---

Source: https://adityahimaone.space/design-system/vitrine
Brand board: https://adityahimaone.space/brand/vitrine/vitrine-brandkit.png
Engine: https://dithercn.dev
`

  return new Response(brand, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
