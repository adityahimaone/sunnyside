import {
  GAPS,
  MARK_FAMILIES,
  MARK_GATE,
  OUTPUT_CONTRACT,
  RESOURCES,
  STORY_BEATS,
  TYPE_RESEARCH,
} from '@/features/cove/cove-data'
import tokens from '@/features/cove/tokens.json'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const frost = Object.fromEntries(
    tokens.semantic.light.map((token) => [token.name, token]),
  ) as Record<string, { value: string; resolved?: string; role: string }>

  const brand = `# Cove — design system, brand guide and audit (v1.0)

> A calmer kind of depth.

Cove is Case 06 in the Sunnyside portfolio: a blue liquid-glass design system at
https://adityahimaone.space/design-system/cove. It is a separate system from
Sunnyside (paper/cobalt), Vitrine (glass/dither), Huginn (print), Riso Co.
(misregistration) and Hachure (survey dither).

## 1. The one idea

**The glass layer and the reading plate.** The field carries the atmosphere, the
glass carries the chrome, and a solid plate carries the words. The glass never
becomes the content, and the field never sits under the copy.

- Essence: a calmer kind of depth.
- Promise: clarity you can see through.
- Family: architectural monogram.
- Gate: v2.3 constructed — zero circle, fill-only, 2–4 primitives, one accent.
- Voice: calm, exact, unhurried.
- Not this: glass everywhere, body copy on a blur, a blue-purple mesh.

## 2. Mark

The mark is **Half-light C**: one squared architectural monogram with 45° walls
and one Ice inlay on the lower lip. The ink letter is the cove; the inlay is the
waterline. Remove the inlay and the C still stands.

| Property | Value |
| --- | --- |
| ViewBox | 64 × 64 |
| Family | Architectural monogram |
| C path | M56 8H28L8 24V40L28 56H56V44H28L20 36V28L28 20H56Z |
| Inlay | M40 36H56V44H40Z, Ice |
| Compact path | M56 6H30L6 24V40L30 58H56V44H30L22 36V28L30 20H56Z |
| Primitive count | 2 primary / 1 compact |
| Frame | 8 units |
| Opening | 24 units |
| Arm | 12 units |
| Inlay | 16 × 8 units |
| Bbox | 48 × 48 units |
| Full mark minimum | 32px |
| Compact minimum | 16px |
| Clear space | Half the mark height on every side |

Files: \`public/brand/cove/mark.svg\`, \`mark-reverse.svg\`,
\`mark-compact.svg\`, \`mark-compact-reverse.svg\`, \`glyph.svg\`,
\`mark-mono.svg\`.

### Four directions, one material

${table(
  ['Direction', 'Family', 'Result'],
  MARK_FAMILIES.map((family) => [
    family.name,
    family.family,
    family.verdict === 'kept' ? 'Kept' : `Lost — ${family.reason}`,
  ]),
)}

### The constructed gate (v2.3)

${table(
  ['Gate', 'Result', 'Evidence'],
  MARK_GATE.map((check) => [
    `${check.gate}. ${check.title}`,
    'Pass',
    check.evidence,
  ]),
)}

## 3. Wordmark and lockups

The wordmark is Instrument Serif 400 frozen as outlines: \`cove\`, tracking
−0.02em, four glyph paths, no \`<text>\`. It is 2.56 × 1.0 em (1422 × 555
units). At 25px high it is 64px wide.

| Lockup | File | Spec |
| --- | --- | --- |
| Horizontal | \`lockup.svg\` | mark 34, gap 10, wordmark 25 high (108 × 34) |
| Horizontal reverse | \`lockup-reverse.svg\` | Foam on Abyss |
| Stacked | \`lockup-stacked.svg\` | mark 48, gap 12, wordmark 28 (72 × 88) |
| Stacked reverse | \`lockup-stacked-reverse.svg\` | Foam on Abyss |
| Wordmark | \`wordmark.svg\` | currentColor; reverse copy exists |

Minimum lockup width: 100px. The Ice inlay stays Ice in both surfaces. The header
uses the horizontal lockup at 30px high; the footer uses the wordmark at 44px.

## 4. Palette

| Token | Value | Role | Contrast |
| --- | --- | --- | --- |
| \`--cv-abyss\` | #06121C | Ground, ink, the deep plate | 17.14:1 with Foam |
| \`--cv-foam\` | #E9F6FB | Body text, light ground | 17.14:1 on Abyss |
| \`--cv-ice\` | #7CE7FF | The one loud field | 13.26:1 with Abyss |
| \`--cv-horizon\` | #2E5F78 | Structure, mid-tone | surface |
| \`--cv-mist\` | #9DBCCB | Secondary on Deep | 9.44:1 on Abyss |
| \`--cv-frost\` | #EAF4F8 | Light ground | 15.66:1 with Ink |
| \`--cv-ink\` | #0A1B28 | Body on Frost | 15.66:1 on Frost |
| \`--cv-graphite\` | #4A6575 | Secondary on Frost | 5.51:1 |
| \`--cv-fog\` | #55707F | Hints and placeholders | 4.69:1 |
| \`--cv-clay\` | #FF8F80 | Error on Deep | 8.54:1 |
| \`--cv-moss\` | #7BE0C3 | Success on Deep | 11.96:1 |
| \`--cv-amber\` | #FFD08A | Warning on Deep | 13.18:1 |

Rules: one loud field per page. Ice is the field; the rest are surfaces, text
roles or status accents. Glass is a material, not a colour. The mark is Abyss on
Frost, Foam on Deep, with the Ice inlay fixed.

### Contrast pairs

${table(
  ['Pair', 'Ratio', 'Use'],
  tokens.contrast.map((pair) => [pair.label, `${pair.ratio}:1`, pair.use]),
)}

## 5. Type

| Voice | Face | Size / tracking |
| --- | --- | --- |
| Display | Instrument Serif 400 / italic | 6.2rem, −0.035em, 0.94 leading |
| Reading | Instrument Sans 400–600 | 16–18px, 1.6 leading |
| Label | Geist Mono 500 | 10–12px, 0.14em, uppercase |

Instrument Serif ships one weight. Do not synthesise a bold; raise the size or
use the italic. The serif is limited to the hero, section titles, the wordmark
and one pull quote. It is never used for a paragraph.

${TYPE_RESEARCH.body}

Sources:

${TYPE_RESEARCH.sources.map((source) => `- [${source.label}](${source.href})`).join('\n')}

Typography gate: three voices; body 16–18px; inputs 14px, 16px on mobile;
captions 13px; unitless leading; balance on headings, pretty on paragraphs;
tracking in em; tabular numbers; outlined wordmark; real specimens.

## 6. Tokens

The token source is \`features/cove/tokens.json\`. It generates
\`features/cove/cove-tokens.css\` and the public CSS/JSON. 161 declarations:

1. **Theme DNA** — architectural monogram, liquid glass, lit-cut edge, 1px
   offset, square tile, halo ring, airy density, mono-caps label, mark geometry.
2. **Primitive** — Abyss, Deep, Glass, Horizon, Line, Mist, Foam, Ice, Ice ink,
   Clay, Moss, Amber, Frost, Ink, Graphite, Fog, Frost line.
3. **Semantic** — Deep and Frost: bg, fg, muted, subtle, border, surface,
   accent, focus, status, glass fill/edge/highlight/shadow, field image.
4. **Component** — field-*, button-*, card-*, chip-*, table-*.

### Theme DNA

${table(
  ['Token', 'Value'],
  Object.entries(tokens.theme).map(([name, value]) => [
    `--cv-dna-${name}`,
    value,
  ]),
)}

### Semantic roles

${table(
  ['Token', 'Deep', 'Frost', 'Role'],
  tokens.semantic.dark.map((token) => [
    `--cv-${token.name}`,
    token.resolved ?? token.value,
    frost[token.name]?.resolved ?? frost[token.name]?.value ?? '',
    token.role,
  ]),
)}

### Glass recipe

- Fill: 8% Foam on Deep, 62% white on Frost.
- Edge: 1px \`--cv-glass-edge\`.
- Specular: \`inset 0 1px 0 --cv-glass-highlight\`, top only.
- Hard line: \`0 1px 0 --cv-glass-edge\`; the soft lift is lighting only.
- Blur: 18px with saturate 1.45. Containers only, never body copy.
- Grain: \`feTurbulence\` at 0.16 opacity on the field, never on the plate.
- The field image swaps in at \`--cv-field-image\`.

## 7. Forms

Ten native controls in one specimen: text, email, password (show/hide), select,
radio group, textarea, checkbox, switch, range and file. Labels are visible;
hints and errors use \`aria-describedby\`; the error summary takes focus; the
password toggle is a real button with \`aria-pressed\`.

Focus is a 2px outline plus a 3px ring. The field sits on a solid token ground,
so text contrast never depends on the blur. The portable kit is
\`public/brand/cove/cove-forms.css\` with \`cove-forms.html\`; it has no raw
colours and includes focus, invalid, disabled, switch, range, file and reduced
motion.

## 8. Story spine

${table(
  ['Beat', 'Line'],
  STORY_BEATS.map((beat) => [beat.beat, beat.line]),
)}

## 9. Audit

Resources: ${RESOURCES.length} listed; used as shipped:
${RESOURCES.filter((resource) => resource.status === 'used').length};
not used: ${RESOURCES.filter((resource) => resource.status === 'not used').length}.
Output contract: ${OUTPUT_CONTRACT.filter((item) => item.status === 'shipped').length}/${OUTPUT_CONTRACT.length} shipped.

### Skill resources

${table(
  ['Resource', 'Use', 'Evidence'],
  RESOURCES.map((resource) => [
    `\`${resource.path}\``,
    resource.status,
    resource.evidence,
  ]),
)}

### Output contract

${table(
  ['Item', 'Status', 'Evidence'],
  OUTPUT_CONTRACT.map((item) => [item.item, item.status, item.evidence]),
)}

### Known gaps

${GAPS.map((gap) => `- ${gap}`).join('\n')}

## 10. File map

| Concern | Path |
| --- | --- |
| Route | \`app/design-system/cove/page.tsx\` |
| Fonts | \`app/design-system/cove/layout.tsx\` + \`fonts/\` |
| Token source | \`features/cove/tokens.json\` |
| Generated CSS | \`features/cove/cove-tokens.css\` |
| Page CSS | \`features/cove/cove.module.css\` |
| Forms | \`features/cove/components/form-demo.tsx\` |
| Brand | \`features/cove/components/brand.tsx\` |
| Data | \`features/cove/cove-data.ts\` |
| Brief | \`design/brand/cove/brief.md\` |
| Story | \`design/brand/cove/story.md\` |
| Board | \`design/brand/cove/cove-brandkit.png\` |
| Board source | \`design/brand/cove/brandkit.html\` |
| Guide | \`design/brand/cove/README.md\` |
| Audit | \`docs/cove-design-system-audit.md\` |
| Logo SVGs | \`public/brand/cove/\` |
| Favicon | \`public/brand/cove/favicon.ico\` |
| Tokens download | \`public/brand/cove/cove-tokens.json\` |
| Form download | \`public/brand/cove/cove-forms.css\` |

## 11. Verification

- Mark at 16, 24, 32, 64, 512 and as a favicon on light/dark chrome.
- Lockup at 100, 240, 512; compact at 16 and 24.
- ICO contains 16, 32 and 48.
- 14 contrast pairs measured; body at least 4.69:1.
- Page at 1440 and 390, Deep and Frost, reduced motion, in Chromium.
- Form empty submit focuses the error summary and marks three fields invalid.
- Typography: body 16px, desktop input 14px, mobile 16px, h1 400 Instrument
  Serif.
- Dev note: use \`localhost\`, not \`127.0.0.1\`; Next 16 blocks dev resources
  from the IP by default.
- The page is readable without JavaScript: the prose, tables and downloads are
  server-rendered; the theme switch and form states need JS.

---

Source: https://adityahimaone.space/design-system/cove
Brand board: https://adityahimaone.space/brand/cove/cove-brandkit.png
`

  return new Response(brand, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
