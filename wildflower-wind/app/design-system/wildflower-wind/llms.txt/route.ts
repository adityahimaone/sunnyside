import { NextResponse } from 'next/server'

import tokens from '@/features/wildflower-wind/tokens.json'

// The agent-readable twin of the specimen: one file, no HTML, every claim traceable
// to tokens.json. Read from the tokens, never from a second copy of the copy.
export const dynamic = 'force-static'

const SECTIONS: [string, string][] = [
  ['field', 'the photograph, the name, the promise'],
  ['premise', 'belief, enemy, material, four decisions'],
  ['calyx', 'the mark family, the placement table, the rules'],
  ['press', 'nine primitives, every pair computed'],
  ['setting', 'type specimens and foundations'],
  ['kit', 'the form kit'],
  ['companions', 'four marks from the same petal'],
  ['season', 'applications'],
  ['sheet', 'copyable tokens'],
  ['ledger', 'proved, not verified, known gaps'],
]

export function GET() {
  const body = [
    '# Wildflower Wind',
    '',
    tokens.meta.oneSentence,
    '',
    `Namespace \`${tokens.meta.namespace}\` · ${tokens.meta.archetype} archetype · ${tokens.meta.track} track · v${tokens.meta.version}`,
    `Essence: ${tokens.meta.essence}`,
    `Rejection test: ${tokens.meta.promise}`,
    '',
    '## Sections',
    ...SECTIONS.map(([id, what]) => `- \`#${id}\` — ${what}`),
    '',
    '## Primitives',
    ...tokens.primitives.map((p) => `- \`${tokens.meta.namespace}${p.name}\`: ${p.value} — ${p.role}`),
    '',
    '## Contrast (computed)',
    ...tokens.contrast.map((c) => `- ${c.label}: ${c.ratio.toFixed(2)}:1 — ${c.pass ? 'pass' : 'FAILS'}`),
    '',
    '## Type',
    ...tokens.type.map((t) => `- \`${t.name}\`: ${t.value} ${t.weight} · ${t.size}px · lh ${t.leading} · ls ${t.tracking}em`),
    '',
    '## Files',
    '- `index.html` — the specimen',
    '- `tokens/wildflower-wind.tokens.json` — the source',
    '- `public/brand/wildflower-wind/` — the mark family, tokens, DESIGN.md',
    '- `docs/wildflower-wind-design-system-audit.md` — what is proved and what is not',
    '',
    '## Rules that are not negotiable',
    '- The mark is a placement table of five petals; four hold, one is taken. Never redraw it as a closed rosette.',
    '- One accent, and it belongs to the petal that left. Primary buttons are ink.',
    '- If a layout could be centred without losing anything, it is wrong.',
    '',
  ].join('\n')

  return new NextResponse(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
