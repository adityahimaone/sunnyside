// Vesper — one source, three layers, two scopes.
//
//   node vesper/scripts/build-tokens.mjs
//
// Writes features/vesper/tokens.json, features/vesper/vesper-tokens.css and a
// copy under public/brand/vesper/. Every contrast ratio in tokens.json is
// computed here from the hex values, never typed: a stated ratio that does not
// match its own colours is the cheapest lie a design system can tell.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

// ── colour maths ────────────────────────────────────────────────────────────

const lum = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100
}

// ── primitives: the material, named once ────────────────────────────────────
// Sampled from the three artworks: the cobalt ink runs #083b86 to #2f51ae, the
// cream ground #e1be91 to #e8cba0. Nothing here names a job.

const P = {
  chalk: { value: '#f6efe1', role: 'Unprinted stock. The page in daylight.' },
  plate: { value: '#fcf8ef', role: 'A plate laid on the stock. Surfaces only.' },
  stock: { value: '#e6cfa8', role: 'The cream ink itself. Fields, not text.' },
  dusk: { value: '#c9d2e4', role: 'The pale blue second impression. Night-side metadata.' },
  cobalt: { value: '#1b3fa2', role: 'The cobalt ink. The one accent — ≤10% of a viewport.' },
  night: { value: '#0a2a6b', role: 'The sky at its deepest. The night scope’s ground.' },
  lampblack: { value: '#0d1526', role: 'The silhouette. All text on light.' },
  muted: { value: '#565d73', role: 'The third voice. Captions and metadata.' },
}

const primitives = Object.entries(P).map(([name, v]) => ({ name, ...v }))

// ── semantic: the job, in two scopes ────────────────────────────────────────

const light = [
  ['surface-page', 'var(--vs-chalk)', 'The page.'],
  ['surface-plate', 'var(--vs-plate)', 'A card, a table row, a form.'],
  ['surface-wash', 'var(--vs-stock)', 'The quiet field. Behind a specimen.'],
  ['surface-loud', 'var(--vs-cobalt)', 'The one loud field. Two per page, maximum.'],
  ['surface-night', 'var(--vs-night)', 'The night scope, when used as a band.'],
  ['text-primary', 'var(--vs-lampblack)', 'Body and display.'],
  ['text-secondary', 'var(--vs-muted)', 'Captions, metadata, the second voice.'],
  ['text-accent', 'var(--vs-cobalt)', 'One emphasis per view.'],
  ['text-on-loud', 'var(--vs-chalk)', 'Type on the cobalt field.'],
  ['line-subtle', 'rgb(13 21 38 / 0.14)', 'Hairline. Inside a plate.'],
  ['line-strong', 'rgb(13 21 38 / 0.34)', 'Section rule. Between plates.'],
  ['focus-ring', 'var(--vs-cobalt)', '2px, 2px offset, never removed.'],
]

const nightSemantic = [
  ['surface-page', 'var(--vs-night)', 'The page after dark.'],
  ['surface-plate', '#0e327a', 'A plate on the night field.'],
  ['surface-wash', 'var(--vs-cobalt)', 'The cobalt field, now the quiet one.'],
  ['surface-loud', 'var(--vs-stock)', 'The loud field inverts: cream on blue.'],
  ['surface-night', 'var(--vs-night)', 'Unchanged — it is already the ground.'],
  ['text-primary', 'var(--vs-chalk)', 'Body and display.'],
  ['text-secondary', 'var(--vs-dusk)', 'Captions, metadata.'],
  ['text-accent', 'var(--vs-stock)', 'The accent flips to cream.'],
  ['text-on-loud', 'var(--vs-lampblack)', 'Type on the cream field.'],
  ['line-subtle', 'rgb(246 239 225 / 0.16)', 'Hairline on night.'],
  ['line-strong', 'rgb(246 239 225 / 0.38)', 'Section rule on night.'],
  ['focus-ring', 'var(--vs-stock)', 'Cream ring — cobalt would vanish here.'],
]

// ── contrast: every pair computed, each with its allowed job ────────────────
// The pairs that fail are published with the job they may therefore not do.
// A palette that only shows its passes is a brochure.

const pairSpec = [
  ['Lampblack on chalk — body and display', 'lampblack', 'chalk', 'text'],
  ['Muted on chalk — captions', 'muted', 'chalk', 'text'],
  ['Muted on plate — captions in a card', 'muted', 'plate', 'text'],
  ['Cobalt on chalk — accent text and links', 'cobalt', 'chalk', 'text'],
  ['Cobalt on plate — accent in a card', 'cobalt', 'plate', 'text'],
  ['Cobalt on stock — accent on the wash', 'cobalt', 'stock', 'text'],
  ['Chalk on cobalt — the button label', 'chalk', 'cobalt', 'text'],
  ['Chalk on night — body after dark', 'chalk', 'night', 'text'],
  ['Dusk on night — captions after dark', 'dusk', 'night', 'text'],
  ['Stock on night — the accent after dark', 'stock', 'night', 'text'],
  ['Lampblack on stock — type on the cream field', 'lampblack', 'stock', 'text'],
  ['Stock on chalk — the wash against the page', 'stock', 'chalk', 'surface'],
  ['Dusk on chalk — the second impression', 'dusk', 'chalk', 'graphic'],
  ['Cobalt on night — cobalt inside the sky', 'cobalt', 'night', 'graphic'],
]

const contrast = pairSpec.map(([label, fg, bg, job]) => {
  const f = P[fg].value
  const b = P[bg].value
  const r = ratio(f, b)
  const pass = r >= 4.5
  return {
    label,
    fg: f,
    bg: b,
    ratio: r,
    job: pass ? job : job === 'text' ? 'none — fails as text' : job,
    pass,
  }
})

// ── type ────────────────────────────────────────────────────────────────────

const type = [
  { name: 'display-1', value: 'Fraunces', size: 108, leading: 0.92, tracking: -0.035, weight: 300, use: 'One per page: the name, or the idea.' },
  { name: 'display-2', value: 'Fraunces', size: 66, leading: 0.98, tracking: -0.03, weight: 300, use: 'Section titles.' },
  { name: 'display-3', value: 'Fraunces', size: 42, leading: 1.06, tracking: -0.022, weight: 400, use: 'Card headlines, pull quotes.' },
  { name: 'title-1', value: 'Archivo', size: 27, leading: 1.18, tracking: -0.018, weight: 600, use: 'Sub-heads inside a section.' },
  { name: 'title-2', value: 'Archivo', size: 20, leading: 1.3, tracking: -0.012, weight: 600, use: 'Card titles, form legends.' },
  { name: 'body-1', value: 'Archivo', size: 18, leading: 1.62, tracking: -0.003, weight: 400, use: 'Reading copy, 60–68ch.' },
  { name: 'body-2', value: 'Archivo', size: 16, leading: 1.6, tracking: 0, weight: 400, use: 'Interface copy.' },
  { name: 'caption', value: 'Archivo', size: 13.5, leading: 1.45, tracking: 0.002, weight: 400, use: 'Captions, credits, notes.' },
  { name: 'label', value: 'Archivo', size: 11.5, leading: 1.2, tracking: 0.16, weight: 600, use: 'Uppercase. Always above what it names.' },
  { name: 'mono', value: 'DM Mono', size: 12.5, leading: 1.5, tracking: 0.02, weight: 400, use: 'Tokens, measurements, file paths.' },
  { name: 'figure', value: 'Archivo', size: 54, leading: 1, tracking: -0.03, weight: 500, use: 'Tabular, right-aligned, never on a rule.' },
]

const space = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160]
const radius = { none: 0, hair: 2, chip: 4, pill: 999 }
const motion = [
  { name: 'strike', value: '90ms cubic-bezier(.2,0,0,1)', use: 'Anything the user caused. A press is a press.' },
  { name: 'settle', value: '520ms cubic-bezier(.22,.61,.24,1)', use: 'A plate arriving. Once per view.' },
  { name: 'impress', value: '1100ms cubic-bezier(.16,.84,.24,1)', use: 'The field building itself. Once per page load.' },
]

const meta = {
  name: 'Vesper',
  slug: 'vesper',
  namespace: '--vs-',
  version: '1.0.0',
  year: 2026,
  author: 'Sunnyside',
  archetype: 'minimal',
  primaryAccent: 'signal',
  essence: 'Two inks, one horizon, and the star that stayed.',
  promise: 'Everything made with this looks printed at night, not rendered in it.',
  family: 'One star, one line, one cut.',
  track: 'drawn',
  oneSentence:
    'Vesper is a two-ink print system for the evening: a cobalt sky and a cream ground, a four-point star resting on the horizon, and a mark that is drawn once and never redrawn by a theme.',
  gate: 'v3.6',
  contrastPairs: contrast.length,
  failingPairs: contrast.filter((c) => !c.pass).length,
}

const tokens = {
  meta,
  theme: {
    family: 'drawn — one subject, one cut line, one flat fill',
    material: 'two inks on uncoated cream stock: cobalt and cream, a pale blue second impression',
    edge: 'square. A printed plate has corners; nothing here is a rounded card except the pill.',
    offset: 'the second impression sits 2.2px down and right, never more',
    stroke: 'no strokes anywhere — the horizon is a filled bar, not a line',
    tile: 'square with a 4-unit chip radius; the pill is reserved for navigation',
    radius: '0 / 2 / 4 / 999 — the pill is the only curve',
    ring: 'cobalt at 2px, 2px offset; cream in the night scope',
    density: '112px section rhythm, 24px paragraph rhythm, 1.62 leading',
    label: 'uppercase Archivo, 0.16em, always above the thing it names',
    'field-recipe': 'cobalt ground, cream stipple rays from a single point, a horizon, a moon',
    'mark-form': 'a four-point star whose lower point rests on the horizon bar',
  },
  sections: ['field', 'premise', 'star', 'ink', 'surfaces', 'voice', 'kit', 'cast', 'sheet', 'ledger'],
  primitives,
  semantic: { light: light.map(([name, value, role]) => ({ name, value, role })), night: nightSemantic.map(([name, value, role]) => ({ name, value, role })) },
  type,
  space,
  radius,
  motion,
  contrast,
}

// ── css ─────────────────────────────────────────────────────────────────────
// Three layers, in order. The night scope swaps the semantic layer only: every
// primitive keeps its name and its value, which is why a theme flip cannot drift.

const css = `/* Vesper — ${meta.version} · namespace ${meta.namespace}
   Generated by vesper/scripts/build-tokens.mjs. Do not edit.
   One source, three layers, two scopes. A night surface is a scope, not a
   second palette: the primitives below never change under [data-vesper]. */

:root{
  /* 1 · primitive — the material, named once */
${primitives.map((p) => `  --vs-${p.name}: ${p.value};`).join('\n')}

  /* 2 · semantic — the job */
${light.map(([n, v]) => `  --vs-${n}: ${v};`).join('\n')}

  /* 3 · component — the only place a component knows its colour */
  --vs-button-bg: var(--vs-surface-loud);
  --vs-button-text: var(--vs-text-on-loud);
  --vs-button-border: var(--vs-surface-loud);
  --vs-chip-bg: transparent;
  --vs-chip-border: var(--vs-line-strong);
  --vs-input-bg: var(--vs-surface-plate);
  --vs-input-border: var(--vs-line-strong);
  --vs-input-border-focus: var(--vs-focus-ring);
  --vs-table-rule: var(--vs-line-subtle);
  --vs-mark-fill: var(--vs-text-primary);
  --vs-mark-on-loud: var(--vs-text-on-loud);

  /* type */
${type.map((t) => `  --vs-${t.name}: ${t.weight} ${t.size}px/${t.leading} '${t.value}';`).join('\n')}
  --vs-tracking-display: -0.035em;
  --vs-tracking-label: 0.16em;

  /* space, radius, motion */
${space.map((s) => `  --vs-space-${s}: ${s}px;`).join('\n')}
${Object.entries(radius).map(([k, v]) => `  --vs-radius-${k}: ${v}px;`).join('\n')}
${motion.map((m) => `  --vs-motion-${m.name}: ${m.value};`).join('\n')}

  /* fonts — declared in the page layout, referenced here */
  --vs-font-display: 'Fraunces', 'Iowan Old Style', Georgia, serif;
  --vs-font-reading: 'Archivo', 'Helvetica Neue', system-ui, sans-serif;
  --vs-font-mono: 'DM Mono', ui-monospace, 'SFMono-Regular', monospace;
}

/* The night scope. Only the semantic layer moves. */
html[data-vesper='night']{
${nightSemantic.map(([n, v]) => `  --vs-${n}: ${v};`).join('\n')}
  --vs-button-bg: var(--vs-surface-loud);
  --vs-button-text: var(--vs-text-on-loud);
  --vs-chip-bg: transparent;
  --vs-input-bg: var(--vs-surface-plate);
  --vs-mark-fill: var(--vs-text-primary);
}

@media (prefers-reduced-motion: reduce){
  :root{
    --vs-motion-strike: 1ms linear;
    --vs-motion-settle: 1ms linear;
    --vs-motion-impress: 1ms linear;
  }
}
`

// ── write ───────────────────────────────────────────────────────────────────

const targets = [
  join(root, 'features', 'vesper'),
  join(root, 'public', 'brand', 'vesper'),
]
for (const dir of targets) {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')
  writeFileSync(join(dir, 'vesper-tokens.css'), css)
}

const failing = contrast.filter((c) => !c.pass)
console.log(`\n  Vesper — tokens\n`)
console.log(`  primitives ${primitives.length} · semantic ${light.length} light / ${nightSemantic.length} night`)
console.log(`  contrast   ${contrast.length} pairs computed, ${failing.length} published as failing`)
for (const f of failing) console.log(`    ✗ ${f.ratio.toFixed(2)}  ${f.label}`)
console.log(`\n  wrote features/vesper/ and public/brand/vesper/\n`)
