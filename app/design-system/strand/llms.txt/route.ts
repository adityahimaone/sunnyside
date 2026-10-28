import {
  GAPS,
  MARK_GATE,
  OUTPUT_CONTRACT,
  STORY_BEATS,
  TYPE_GATE,
} from '@/features/strand/strand-data'
import tokens from '@/features/strand/tokens.json'

const palette = (rows: { name: string; value: string; role: string }[]) =>
  rows.map((t) => `\`--st-${t.name}\`: \`${t.value}\` — ${t.role}`).join('\n')

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Strand — design system, brand guide and audit (v1.0)

> Where the dunes meet the tide.

Strand is Case 07 in the Sunnyside portfolio: an architectural coastal design system at
https://adityahimaone.space/design-system/strand.

## 1. The one idea

**White quartz sand plates, marine basalt ink, and dual coastal vista framing.** All reading copy rests on solid quartz plates, while the real coastal dune photograph grounds both the entrance (hero) and departure (footer).

- Essence: where the dunes meet the tide.
- Promise: quiet surfaces, sharp natural geometry.
- Family: architectural monogram.
- Gate: v3.0 constructed — zero circle, fill-only, 2 primitives, one accent, detach ≥ 70 against every sibling.
- Voice: serene, architectural, unhurried.
- Not this: neon gradients, floating glass pills, cartoon beach icons.

## 2. Mark

The mark is **Dune Crest S**: one architectural monogram cut by a single 7.1° shoreline, with a 1.1-unit strand left open between the sand and the sea. The two materials never touch — the gap is the beach. Everything below the cut is tide, 48% of the letter, so the accent is structure rather than ornament. Counters run 5.2–8.5 units; below 32px a separate one-tone compact drawing takes over and the gap closes optically.

${table(
  ['Rule', 'Status', 'Note'],
  MARK_GATE.map((r) => [r.rule, r.pass ? 'PASS' : 'FAIL', r.note]),
)}

## 3. Story spine

${table(
  ['Beat', 'Thesis'],
  STORY_BEATS.map((s) => [s.beat, s.line]),
)}

## 4. Palette

### Dune (light)

${palette(tokens.semantic.light)}

### Night Tide (dark)

${palette(tokens.semantic.dark)}

Measured contrast pairs (WCAG 2.1, sRGB):

${table(
  ['Pair', 'Ratio', 'Use'],
  tokens.contrast.map((c) => [c.label, `${c.ratio}:1`, c.use]),
)}

## 5. Typography gate

${table(
  ['Rule', 'Status', 'Implementation'],
  TYPE_GATE.map((t) => [t.rule, t.pass ? 'PASS' : 'FAIL', t.note]),
)}

## 6. Output contract

${table(
  ['Path', 'Role'],
  OUTPUT_CONTRACT.map((o) => [o.path, o.role]),
)}

## 7. Known gaps

${GAPS.map((g) => `- ${g}`).join('\n')}
`

  return new Response(brand, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
