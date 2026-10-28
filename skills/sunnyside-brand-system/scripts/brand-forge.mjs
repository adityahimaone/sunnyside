#!/usr/bin/env node
/**
 * brand-forge — generate a full, drawn (no live text) brand kit from one JSON
 * config. Dependency-free Node. Every shape sits on a 64-unit grid.
 *
 *   node scripts/brand-forge.mjs --config brand.json --out public/brand/<slug>
 *   node scripts/brand-forge.mjs --init sunburst > brand.json      # starter config
 *   node scripts/brand-forge.mjs --list                            # concepts
 *
 * Writes (all SVG are text-free, share one viewBox per family member):
 *   mark.svg  mark-compact.svg  glyph.svg  mark-reverse.svg  mark-mono.svg
 *   icon.svg (favicon field)  lockup.svg  lockup-reverse.svg  lockup-stacked.svg
 *   <slug>-tokens.css  <slug>-tokens.json   (audit.mjs schema + contrast pairs)
 *   <slug>-forms.css   forms.html           (form kit derived from the theme DNA)
 *   sheet.html                              (16/32/64/128 proof on light + dark)
 *   story.md                                (brand story scaffold from config.story)
 *
 * The wordmark is outlined by extract-wordmark.py. Pass its output with
 * --wordmark wordmark.svg so lockups embed real paths. Without it the lockups
 * are skipped and the report says so; never fake a wordmark with <text>.
 *
 * Concepts are construction methods, not clip art:
 *   sunburst  rays cut by the tile (Sunnyside)     aperture  n-blade iris
 *   orbit     rings + one moving dot               hatch     negative-space lines
 *   stack     offset layered plates                 facet     circle cut by a diagonal
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const CONCEPTS = ['sunburst', 'aperture', 'orbit', 'hatch', 'stack', 'facet']

const STARTER = {
  name: 'Sunnyside',
  slug: 'sunnyside',
  concept: 'sunburst',
  palette: {
    paper: '#f3ecdf',
    paperHi: '#fffaf1',
    ink: '#191a2e',
    field: '#3d53d6',
    core: '#ffd23f',
    spark: '#ff6a2b',
    muted: '#5f5b6e',
    danger: '#b3261e',
    success: '#1f7a4d',
  },
  // Theme DNA. One material, read by the mark AND the form kit.
  dna: {
    edge: 'hard', // hard | soft | none
    offset: 2.5, // hard shadow offset on the 64 grid (0 for none)
    stroke: 2.6, // ink edge on the 64 grid
    radius: 16, // tile corner radius on the 64 grid
    tile: 'rounded', // rounded | circle | square
    face: false,
    density: 'cosy', // compact | cosy | roomy
    label: 'sentence', // sentence | mono-caps | small-caps
    ring: 'offset', // offset | solid | glow
    font: { display: 'Syne', ui: 'Geist', mono: 'Geist Mono' },
  },
  params: { rays: 12, compactRays: 8, sunRadius: 16.5 },
  story: {
    belief: 'Work should feel made by a person.',
    enemy: 'Identity that looks generated and cannot be inspected.',
    promise: 'A system you can read, copy and extend without asking.',
    proof: 'Every asset has a size, a source and a reason.',
  },
}

if (has('list')) {
  console.log(CONCEPTS.join('\n'))
  process.exit(0)
}
if (has('init')) {
  const concept = flag('init', 'sunburst')
  if (!CONCEPTS.includes(concept)) fail(`unknown concept: ${concept}`)
  const cfg = structuredClone(STARTER)
  cfg.concept = concept
  if (concept === 'hatch' || concept === 'facet') {
    cfg.dna.offset = 0
    cfg.dna.edge = 'none'
    cfg.dna.tile = 'square'
    cfg.dna.radius = 6
  }
  if (concept === 'orbit') cfg.dna.tile = 'circle'
  console.log(JSON.stringify(cfg, null, 2))
  process.exit(0)
}

function fail(message) {
  console.error(`brand-forge: ${message}`)
  process.exit(1)
}

const configPath = flag('config')
if (!configPath) fail('--config <brand.json> is required (try --init sunburst)')
const outDir = resolve(process.cwd(), flag('out', 'brand-out'))
const cfg = JSON.parse(await readFile(resolve(process.cwd(), configPath), 'utf8'))
const merged = {
  ...STARTER,
  ...cfg,
  palette: { ...STARTER.palette, ...cfg.palette },
  dna: { ...STARTER.dna, ...cfg.dna, font: { ...STARTER.dna.font, ...cfg.dna?.font } },
  params: { ...STARTER.params, ...cfg.params },
  story: { ...STARTER.story, ...cfg.story },
}
const { name, slug, concept, palette: P, dna, params, story } = merged
if (!CONCEPTS.includes(concept)) fail(`unknown concept "${concept}". Use: ${CONCEPTS.join(', ')}`)
for (const [key, value] of Object.entries(P)) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) fail(`palette.${key} must be #rrggbb, got ${value}`)
}

// ───────────────────────── maths ─────────────────────────
const r = (n) => Math.round(n * 100) / 100
const rad = (deg) => (deg * Math.PI) / 180
const pt = (cx, cy, radius, deg) => [cx + radius * Math.cos(rad(deg)), cy + radius * Math.sin(rad(deg))]
const lum = (hex) => {
  const c = hex
    .slice(1)
    .match(/.{2}/g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const x = lum(a)
  const y = lum(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
// Pick the readable one of two inks on a field.
const onField = (bg) => (ratio(P.ink, bg) >= ratio(P.paperHi, bg) ? P.ink : P.paperHi)

// ───────────────────────── tile ─────────────────────────
const T = { x: 3, y: 3, s: 58 } // 58 square on the 64 grid; offset eats the margin
function tileShape(extra = '', inset = 0) {
  const x = T.x + inset
  const y = T.y + inset
  const s = T.s - inset * 2
  if (dna.tile === 'circle') return `<circle cx="${r(x + s / 2)}" cy="${r(y + s / 2)}" r="${r(s / 2)}" ${extra}/>`
  const rx = dna.tile === 'square' ? Math.min(dna.radius, 4) : Math.max(dna.radius - inset, 2)
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(s)}" height="${r(s)}" rx="${r(rx)}" ${extra}/>`
}
const clipId = `${slug}-tile`

// ───────────────────────── concepts ─────────────────────────
// Each returns inner SVG for the content sitting INSIDE the tile, in a palette
// object c = {field, core, spark, ink}. `compact` builds a separate drawing.
const concepts = {
  sunburst(c, compact) {
    const cx = 32
    const cy = compact ? 32 : 31
    const n = compact ? params.compactRays : params.rays
    const sun = compact ? params.sunRadius + 3.5 : params.sunRadius
    const w = compact ? 3.4 : 2.2
    const rays = []
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i - 90
      const [x1, y1] = pt(cx, cy, sun + 3, a)
      const [x2, y2] = pt(cx, cy, 46, a)
      rays.push(`M${r(x1)} ${r(y1)}L${r(x2)} ${r(y2)}`)
    }
    const eyes = !dna.face || compact ? '' : face(cx, cy, c)
    return (
      `<g clip-path="url(#${clipId})">` +
      `<path d="${rays.join('')}" fill="none" stroke="${c.ink}" stroke-width="${w}" stroke-linecap="round"/>` +
      `</g>` +
      `<circle cx="${cx}" cy="${cy}" r="${sun}" fill="${c.core}" stroke="${c.ink}" stroke-width="${compact ? 3 : dna.stroke}"/>` +
      eyes
    )
  },
  aperture(c, compact) {
    const n = compact ? 5 : 6
    const rOut = compact ? 24 : 22
    const rIn = compact ? 8 : 6
    const blades = []
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i - 90
      const [x1, y1] = pt(32, 32, rOut, a)
      const [x2, y2] = pt(32, 32, rOut, a + 360 / n - 6)
      const [x3, y3] = pt(32, 32, rIn, a + 360 / n + 40)
      blades.push(
        `<path d="M${r(x1)} ${r(y1)}A${rOut} ${rOut} 0 0 1 ${r(x2)} ${r(y2)}L${r(x3)} ${r(y3)}Z" fill="${i % 2 ? c.core : c.spark}" stroke="${c.ink}" stroke-width="${compact ? 2.4 : 1.8}" stroke-linejoin="round"/>`,
      )
    }
    return blades.join('')
  },
  orbit(c, compact) {
    const rings = compact ? [18] : [9, 16, 23]
    const stroke = compact ? 4 : 2.4
    const body = rings
      .map((rr) => `<circle cx="32" cy="32" r="${rr}" fill="none" stroke="${c.ink}" stroke-width="${stroke}"/>`)
      .join('')
    const [dx, dy] = pt(32, 32, rings[rings.length - 1], -48)
    return (
      body +
      `<circle cx="32" cy="32" r="${compact ? 6 : 5}" fill="${c.core}" stroke="${c.ink}" stroke-width="${compact ? 2.6 : 1.8}"/>` +
      `<circle cx="${r(dx)}" cy="${r(dy)}" r="${compact ? 5 : 4}" fill="${c.spark}" stroke="${c.ink}" stroke-width="${compact ? 2.4 : 1.8}"/>`
    )
  },
  hatch(c, compact) {
    const gap = compact ? 9 : 5.5
    const w = compact ? 3.6 : 2
    const lines = []
    for (let x = -64; x < 128; x += gap) lines.push(`M${r(x)} 64L${r(x + 64)} 0`)
    const orb = compact ? 13 : 15
    return (
      `<g clip-path="url(#${clipId})"><path d="${lines.join('')}" fill="none" stroke="${c.ink}" stroke-width="${w}"/></g>` +
      `<circle cx="32" cy="32" r="${orb}" fill="${c.core}" stroke="${c.ink}" stroke-width="${compact ? 3 : 2.4}"/>`
    )
  },
  stack(c, compact) {
    const plates = compact ? 2 : 3
    const size = compact ? 28 : 25
    const step = compact ? 9 : 7.5
    const fills = [c.spark, c.core, c.paper]
    let out = ''
    for (let i = 0; i < plates; i++) {
      const x = 32 - size / 2 - ((plates - 1) * step) / 2 + i * step
      const y = 32 - size / 2 + ((plates - 1) * step) / 2 - i * step
      out += `<rect x="${r(x)}" y="${r(y)}" width="${size}" height="${size}" rx="${compact ? 5 : 4}" fill="${fills[i]}" stroke="${c.ink}" stroke-width="${compact ? 3 : 2.2}"/>`
    }
    return out
  },
  facet(c, compact) {
    const rr = compact ? 19 : 17
    const cut = compact ? 4 : 3
    return (
      `<defs><clipPath id="${slug}-fa"><circle cx="32" cy="32" r="${rr}"/></clipPath></defs>` +
      `<g clip-path="url(#${slug}-fa)">` +
      `<rect x="10" y="10" width="44" height="44" fill="${c.core}"/>` +
      `<path d="M8 44L44 8L56 8L56 20L20 56L8 56Z" fill="${c.spark}"/>` +
      `<path d="M8 44L44 8" stroke="${c.ink}" stroke-width="${cut}"/></g>` +
      `<circle cx="32" cy="32" r="${rr}" fill="none" stroke="${c.ink}" stroke-width="${compact ? 3.2 : 2.4}"/>`
    )
  },
}

function face(cx, cy, c) {
  const e = 5.4
  const y = cy - 2
  return (
    `<path d="M${cx - e - 2} ${y}h4M${cx + e - 2} ${y}h4" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M${cx - 6} ${cy + 4.5}Q${cx} ${cy + 10} ${cx + 6} ${cy + 4.5}" fill="none" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<circle cx="${cx - 10.5}" cy="${cy + 4}" r="2.1" fill="${c.spark}" opacity=".55"/><circle cx="${cx + 10.5}" cy="${cy + 4}" r="2.1" fill="${c.spark}" opacity=".55"/>`
  )
}

// ───────────────────────── assemblies ─────────────────────────
const svgOpen = (w = 64, h = 64, title = name) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">`

function buildMark({ colors, compact = false, tile = true, shadow = true, field = colors.field }) {
  const off = compact || !shadow || dna.edge === 'none' ? 0 : dna.offset
  const stroke = compact ? 3.2 : dna.stroke
  const defs = `<defs><clipPath id="${clipId}">${tileShape('', 0)}</clipPath></defs>`
  const edge = dna.edge === 'none' ? 'none' : colors.ink
  const parts = [defs]
  if (tile && off > 0) parts.push(`<g transform="translate(${off} ${off})">${tileShape(`fill="${colors.ink}"`)}</g>`)
  if (tile) parts.push(tileShape(`fill="${field}" stroke="${edge}" stroke-width="${edge === 'none' ? 0 : stroke}"`))
  parts.push(concepts[concept](colors, compact))
  return `${svgOpen()}${parts.join('')}</svg>\n`
}
const base = { field: P.field, core: P.core, spark: P.spark, ink: P.ink, paper: P.paperHi }
const outputs = {}
outputs['mark.svg'] = buildMark({ colors: base })
outputs['mark-compact.svg'] = buildMark({ colors: base, compact: true })
outputs['glyph.svg'] = buildMark({ colors: base, tile: false, shadow: false })
// Reversed: tile in ink, drawing lines in paper so it holds on a dark ground.
outputs['mark-reverse.svg'] = buildMark({
  colors: { field: P.ink, core: P.core, spark: P.spark, ink: P.paperHi, paper: P.ink },
  shadow: false,
})
// One-colour stamp is DRAWN: all fills collapse to ink/paper with the same geometry.
outputs['mark-mono.svg'] = buildMark({
  colors: { field: P.paperHi, core: P.paperHi, spark: P.paperHi, ink: P.ink, paper: P.paperHi },
  shadow: dna.edge === 'hard',
})
// Favicon field: the compact mark, with an opaque ground so it never vanishes on chrome.
outputs['icon.svg'] = buildMark({ colors: base, compact: true })

// Lockups (need an outlined wordmark)
const wordPath = flag('wordmark')
let reportLockup = 'skipped (pass --wordmark from extract-wordmark.py)'
if (wordPath) {
  const raw = await readFile(resolve(process.cwd(), wordPath), 'utf8')
  const vb = raw.match(/viewBox\s*=\s*["']([\d.\s-]+)["']/)
  if (!vb) fail('wordmark.svg has no viewBox')
  if (/<text[\s>]/.test(raw)) fail('wordmark.svg contains live <text>; outline it first')
  const [, , ww, wh] = vb[1].trim().split(/\s+/).map(Number)
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  const markH = 64
  const targetH = 20 // wordmark cap height on the 64 grid
  const scale = targetH / wh
  const gap = 12
  const wordW = ww * scale
  const place = (fill, markSvg, stacked) => {
    const body = markSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(new RegExp(clipId, 'g'), `${clipId}-l${stacked ? 's' : 'h'}${fill === P.paperHi ? 'r' : ''}`)
    const word = `<g transform="translate(${stacked ? r((Math.max(64, wordW) - wordW) / 2) : 64 + gap} ${stacked ? markH + 8 : r((markH - targetH) / 2)}) scale(${r(scale * 1000) / 1000})" fill="${fill}" color="${fill}">${inner}</g>`
    const markX = stacked ? r((Math.max(64, wordW) - 64) / 2) : 0
    const w = stacked ? Math.max(64, wordW) : 64 + gap + wordW
    const h = stacked ? markH + 8 + targetH : markH
    return `${svgOpen(r(w), r(h), name)}<g transform="translate(${markX} 0)">${body}</g>${word}</svg>\n`
  }
  outputs['lockup.svg'] = place(P.ink, outputs['mark.svg'], false)
  outputs['lockup-reverse.svg'] = place(P.paperHi, outputs['mark-reverse.svg'], false)
  outputs['lockup-stacked.svg'] = place(P.ink, outputs['mark.svg'], true)
  outputs['wordmark.svg'] = raw
  reportLockup = `built from ${wordPath}`
}

// ───────────────────────── tokens ─────────────────────────
const dens = { compact: { field: 36, gap: 12, pad: 10 }, cosy: { field: 44, gap: 16, pad: 12 }, roomy: { field: 52, gap: 20, pad: 16 } }[dna.density]
const ringShadow = {
  offset: `0 0 0 2px ${P.paperHi}, 0 0 0 4px ${P.field}`,
  solid: `0 0 0 3px ${P.field}`,
  glow: `0 0 0 3px ${P.field}55, 0 0 18px ${P.field}66`,
}[dna.ring]
const fieldShadow = dna.edge === 'hard' ? `${dna.offset / 16}rem ${dna.offset / 16}rem 0 ${P.ink}` : dna.edge === 'soft' ? `0 1px 2px ${P.ink}22` : 'none'
const fieldRadius = dna.tile === 'circle' ? '999px' : dna.tile === 'square' ? '4px' : `${Math.round(dna.radius * 0.5)}px`
const fieldBorder = dna.edge === 'none' ? `1px solid ${P.ink}55` : `${Math.max(1.5, dna.stroke * 0.6).toFixed(1)}px solid ${P.ink}`

const tokensRaw = {
  primitives: Object.entries(P).map(([k, v]) => ({ name: `--${slug}-${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`, value: v })),
  semantic: {
    light: [
      ['--bg', P.paper], ['--surface', P.paperHi], ['--fg', P.ink], ['--muted', P.muted],
      ['--border', P.ink], ['--accent', P.field], ['--accent-ink', onField(P.field)],
      ['--focus', P.field], ['--danger', P.danger], ['--success', P.success],
    ],
    dark: [
      ['--bg', P.ink], ['--surface', '#262742'], ['--fg', P.paper], ['--muted', '#b6b2c4'],
      ['--border', P.paper], ['--accent', P.core], ['--accent-ink', onField(P.core)],
      ['--focus', P.core], ['--danger', '#ff8a80'], ['--success', '#6fdc9f'],
    ],
  },
  components: {
    light: [
      ['--field-bg', P.paperHi], ['--field-fg', P.ink], ['--field-border', fieldBorder],
      ['--field-radius', fieldRadius], ['--field-shadow', fieldShadow], ['--field-h', `${dens.field}px`],
      ['--field-gap', `${dens.gap}px`], ['--field-pad', `${dens.pad}px`], ['--field-ring', ringShadow],
      ['--button-bg', P.field], ['--button-ink', onField(P.field)],
    ],
    dark: [
      ['--field-bg', '#262742'], ['--field-fg', P.paper], ['--field-border', fieldBorder.replace(P.ink, P.paper)],
      ['--field-radius', fieldRadius], ['--field-shadow', dna.edge === 'hard' ? `${dna.offset / 16}rem ${dna.offset / 16}rem 0 ${P.core}` : fieldShadow],
      ['--field-h', `${dens.field}px`], ['--field-gap', `${dens.gap}px`], ['--field-pad', `${dens.pad}px`],
      ['--field-ring', ringShadow.replaceAll(P.paperHi, P.ink).replaceAll(P.field, P.core)],
      ['--button-bg', P.core], ['--button-ink', onField(P.core)],
    ],
  },
}
const asObj = (arr) => arr.map(([name, value]) => ({ name, value }))
const contrastPairs = [
  ['ink on paper', P.ink, P.paper], ['ink on surface', P.ink, P.paperHi],
  ['muted on paper', P.muted, P.paper, 4.5], ['button ink on accent', onField(P.field), P.field],
  ['danger on surface', P.danger, P.paperHi], ['success on surface', P.success, P.paperHi],
  ['paper on ink (dark bg)', P.paper, P.ink], ['ink on core (dark button)', onField(P.core), P.core],
].map(([label, fg, bg, min]) => ({ label, fg, bg, ratio: r(ratio(fg, bg)), min: min ?? 4.5 }))

const tokens = {
  name,
  version: '1.0',
  concept,
  dna,
  primitives: tokensRaw.primitives,
  semantic: { light: asObj(tokensRaw.semantic.light), dark: asObj(tokensRaw.semantic.dark) },
  components: { light: asObj(tokensRaw.components.light), dark: asObj(tokensRaw.components.dark) },
  contrast: contrastPairs,
}
outputs[`${slug}-tokens.json`] = JSON.stringify(tokens, null, 2) + '\n'
const cssBlock = (sel, rows) => `${sel} {\n${rows.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`
outputs[`${slug}-tokens.css`] =
  `/* ${name} tokens — generated by brand-forge. Do not hand-edit. */\n` +
  cssBlock(':root', [...tokensRaw.primitives.map((t) => [t.name, t.value]), ...tokensRaw.semantic.light, ...tokensRaw.components.light]) +
  cssBlock(`:root[data-theme='dark']`, [...tokensRaw.semantic.dark, ...tokensRaw.components.dark]) +
  `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${[...tokensRaw.semantic.dark, ...tokensRaw.components.dark].map(([k, v]) => `    ${k}: ${v};`).join('\n')}\n  }\n}\n`

// ───────────────────────── form kit ─────────────────────────
const labelCss = {
  sentence: 'font: 600 0.875rem/1.3 var(--ui); letter-spacing: 0;',
  'mono-caps': 'font: 500 0.75rem/1.3 var(--mono); letter-spacing: 0.08em; text-transform: uppercase;',
  'small-caps': 'font: 600 0.8125rem/1.3 var(--ui); font-variant-caps: all-small-caps; letter-spacing: 0.06em;',
}[dna.label]
const formsCss = `/* ${name} form kit — derived from theme DNA (${dna.edge} edge, ${dna.tile} tile, ${dna.ring} ring, ${dna.density}).
   Reads ONLY semantic/component tokens from ${slug}-tokens.css. No raw hex below. */
.ff { --ui: '${dna.font.ui}', system-ui, sans-serif; --mono: '${dna.font.mono}', ui-monospace, monospace;
  display: grid; gap: var(--field-gap); font-family: var(--ui); color: var(--fg); max-width: 34rem; }
.ff-row { display: grid; gap: 6px; }
.ff-label { ${labelCss} }
.ff-hint, .ff-error { font: 400 0.8125rem/1.4 var(--ui); margin: 0; }
.ff-hint { color: var(--muted); }
.ff-error { color: var(--danger); }
.ff-error::before { content: '! '; font-weight: 700; } /* not colour alone */
.ff-input, .ff-select, .ff-textarea {
  box-sizing: border-box; width: 100%; min-height: var(--field-h); padding: 0 var(--field-pad);
  background: var(--field-bg); color: var(--field-fg); border: var(--field-border);
  border-radius: var(--field-radius); box-shadow: var(--field-shadow);
  font: 400 1rem/1.4 var(--ui); transition: box-shadow 160ms ease, transform 160ms ease; }
.ff-textarea { min-height: calc(var(--field-h) * 2.4); padding-block: var(--field-pad); resize: vertical; }
.ff-input::placeholder, .ff-textarea::placeholder { color: var(--muted); opacity: 1; }
.ff-input:hover, .ff-select:hover, .ff-textarea:hover { transform: translate(-1px, -1px); }
.ff-input:focus-visible, .ff-select:focus-visible, .ff-textarea:focus-visible,
.ff-check:focus-visible, .ff-btn:focus-visible, .ff-switch:focus-visible { outline: none; box-shadow: var(--field-ring); }
.ff-input[aria-invalid='true'], .ff-textarea[aria-invalid='true'], .ff-select[aria-invalid='true'] { border-color: var(--danger); }
.ff-input:disabled, .ff-select:disabled, .ff-textarea:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; transform: none; }
.ff-check { appearance: none; inline-size: 1.4rem; block-size: 1.4rem; margin: 0; flex: none; display: grid; place-content: center;
  background: var(--field-bg); border: var(--field-border); border-radius: calc(var(--field-radius) / 2); }
.ff-check[type='radio'] { border-radius: 50%; }
.ff-check:checked { background: var(--accent); }
.ff-check:checked::after { content: ''; inline-size: 0.5rem; block-size: 0.8rem; border: solid var(--accent-ink); border-width: 0 2.5px 2.5px 0; transform: translateY(-1px) rotate(45deg); }
.ff-check[type='radio']:checked::after { inline-size: 0.55rem; block-size: 0.55rem; border: 0; border-radius: 50%; background: var(--accent-ink); transform: none; }
.ff-inline { display: flex; align-items: center; gap: 10px; min-height: 44px; }
.ff-switch { position: relative; inline-size: 3rem; block-size: 1.7rem; padding: 0; background: var(--field-bg); border: var(--field-border); border-radius: 999px; cursor: pointer; }
.ff-switch::after { content: ''; position: absolute; inset-block: 3px; inset-inline-start: 3px; inline-size: 1.1rem; border-radius: 50%; background: var(--fg); transition: transform 160ms ease; }
.ff-switch[aria-checked='true'] { background: var(--accent); }
.ff-switch[aria-checked='true']::after { transform: translateX(1.3rem); background: var(--accent-ink); }
.ff-btn { min-height: var(--field-h); padding: 0 calc(var(--field-pad) * 1.5); border: var(--field-border); border-radius: var(--field-radius);
  background: var(--button-bg); color: var(--button-ink); font: 700 1rem/1 var(--ui); box-shadow: var(--field-shadow); cursor: pointer; }
.ff-btn.ghost { background: var(--field-bg); color: var(--field-fg); }
.ff-btn:active { transform: translate(2px, 2px); box-shadow: none; }
.ff-summary { border: var(--field-border); border-radius: var(--field-radius); padding: var(--field-pad); background: var(--surface); }
.ff-summary[hidden] { display: none; }
.ff-count { font: 500 0.75rem/1 var(--mono); font-variant-numeric: tabular-nums; color: var(--muted); justify-self: end; }
@media (prefers-reduced-motion: reduce) { .ff * { transition: none !important; } .ff-input:hover { transform: none; } }
`
outputs[`${slug}-forms.css`] = formsCss

outputs['forms.html'] = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} — form kit</title>
<link rel="stylesheet" href="${slug}-tokens.css"><link rel="stylesheet" href="${slug}-forms.css">
<style>body{margin:0;padding:clamp(16px,5vw,48px);background:var(--bg);color:var(--fg);font-family:'${dna.font.ui}',system-ui,sans-serif}
h1{font:800 clamp(1.6rem,4vw,2.4rem)/1.1 '${dna.font.display}',system-ui,sans-serif;text-wrap:balance;margin:0 0 .5rem}
p.lede{max-width:60ch;color:var(--muted);text-wrap:pretty;margin:0 0 2rem}</style></head>
<body><h1>${name} form kit</h1>
<p class="lede">Fields inherit the same material as the mark: ${dna.edge} edge, ${dna.tile} corners, ${dna.ring} focus. ${story.belief}</p>
<form class="ff" id="kit" novalidate>
  <div class="ff-summary" id="summary" role="alert" tabindex="-1" hidden><strong>Fix these first</strong><ul id="summary-list"></ul></div>
  <div class="ff-row"><label class="ff-label" for="name">Name</label>
    <input class="ff-input" id="name" name="name" autocomplete="name" required aria-describedby="name-h"><p class="ff-hint" id="name-h">As it should appear on the page.</p></div>
  <div class="ff-row"><label class="ff-label" for="email">Email</label>
    <input class="ff-input" id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-h"><p class="ff-hint" id="email-h">We only use it to reply.</p></div>
  <div class="ff-row"><label class="ff-label" for="pw">Password</label>
    <div style="display:flex;gap:8px"><input class="ff-input" id="pw" name="pw" type="password" autocomplete="new-password" minlength="8">
    <button class="ff-btn ghost" type="button" id="eye" aria-controls="pw" aria-pressed="false">Show</button></div></div>
  <div class="ff-row"><label class="ff-label" for="topic">Topic</label>
    <select class="ff-select" id="topic" name="topic"><option>Brand kit</option><option>Design system</option><option>Audit</option></select></div>
  <div class="ff-row"><label class="ff-label" for="msg">Message</label>
    <textarea class="ff-textarea" id="msg" name="msg" maxlength="280" aria-describedby="msg-c"></textarea><span class="ff-count" id="msg-c">0 / 280</span></div>
  <fieldset style="border:0;padding:0;margin:0;display:grid;gap:4px"><legend class="ff-label">Delivery</legend>
    <label class="ff-inline"><input class="ff-check" type="radio" name="d" checked> Board only</label>
    <label class="ff-inline"><input class="ff-check" type="radio" name="d"> Board + tokens</label></fieldset>
  <label class="ff-inline"><input class="ff-check" type="checkbox" name="ok"> I have a brief</label>
  <div class="ff-inline"><button class="ff-switch" type="button" role="switch" aria-checked="false" id="sw" aria-labelledby="sw-l"></button><span id="sw-l">Reduced motion</span></div>
  <div class="ff-row"><label class="ff-label" for="rng">Density</label><input id="rng" name="rng" type="range" min="0" max="2" value="1"></div>
  <div class="ff-row"><label class="ff-label" for="f">Reference file</label><input class="ff-input" id="f" type="file" style="padding-block:8px"></div>
  <div class="ff-row"><label class="ff-label" for="dis">Locked field</label><input class="ff-input" id="dis" value="Read-only value" disabled></div>
  <div class="ff-inline"><button class="ff-btn" type="submit">Send</button><button class="ff-btn ghost" type="reset">Reset</button></div>
</form>
<script>
const f=document.getElementById('kit'),s=document.getElementById('summary'),l=document.getElementById('summary-list');
const msg=document.getElementById('msg'),c=document.getElementById('msg-c');
msg.addEventListener('input',()=>{c.textContent=msg.value.length+' / 280'});
document.getElementById('eye').addEventListener('click',e=>{const p=document.getElementById('pw'),on=p.type==='password';p.type=on?'text':'password';e.target.textContent=on?'Hide':'Show';e.target.setAttribute('aria-pressed',on)});
const sw=document.getElementById('sw');sw.addEventListener('click',()=>sw.setAttribute('aria-checked',sw.getAttribute('aria-checked')!=='true'));
function err(el,m){let e=document.getElementById(el.id+'-e');if(!e){e=document.createElement('p');e.className='ff-error';e.id=el.id+'-e';el.closest('.ff-row').appendChild(e)}e.textContent=m;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',[el.getAttribute('aria-describedby'),e.id].filter(Boolean).join(' '))}
function clear(el){const e=document.getElementById(el.id+'-e');if(e)e.remove();el.removeAttribute('aria-invalid')}
f.addEventListener('input',e=>{if(e.target.id)clear(e.target)});
f.addEventListener('submit',ev=>{ev.preventDefault();l.innerHTML='';
 for(const el of f.querySelectorAll('[required]')){clear(el);if(!el.checkValidity()){const m=el.validity.valueMissing?'Required':'Check the format';err(el,m);const li=document.createElement('li');li.innerHTML='<a href="#'+el.id+'">'+el.labels[0].textContent+': '+m+'</a>';l.appendChild(li)}}
 s.hidden=!l.children.length;if(l.children.length)s.focus()});
</script></body></html>
`

// ───────────────────────── proof sheet ─────────────────────────
const proofSizes = [16, 32, 64, 128]
const proofAssets = ['mark.svg', 'mark-compact.svg', 'glyph.svg', 'mark-reverse.svg', 'mark-mono.svg']
const cell = (file, size, bg) =>
  `<figure style="margin:0;display:grid;gap:6px;justify-items:center"><div style="background:${bg};padding:10px;border-radius:8px"><img src="${file}" width="${size}" height="${size}" alt=""></div><figcaption style="font:11px ui-monospace,monospace;opacity:.7">${file} ${size}px</figcaption></figure>`
outputs['sheet.html'] = `<!doctype html><meta charset="utf-8"><title>${name} — proof sheet</title>
<body style="margin:0;font-family:system-ui;background:#888;display:grid;grid-template-columns:1fr 1fr">
${[P.paperHi, P.ink]
  .map(
    (bg) =>
      `<section style="background:${bg};color:${bg === P.ink ? P.paper : P.ink};padding:24px;display:grid;gap:18px"><h2 style="margin:0;font-size:14px">${bg === P.ink ? 'dark chrome' : 'light chrome'}</h2>${proofAssets
        .map((a) => `<div style="display:flex;gap:16px;align-items:end;flex-wrap:wrap">${proofSizes.map((s) => cell(a, s, 'transparent')).join('')}</div>`)
        .join('')}</section>`,
  )
  .join('')}</body>
`

// ───────────────────────── story scaffold ─────────────────────────
outputs['story.md'] = `# ${name} — brand story

> One sentence the work can be rejected against: **${story.promise}**

## 1. The belief
${story.belief}

## 2. The enemy
${story.enemy}

## 3. The mark, as an argument
- **Concept:** ${concept}. State in one sentence what it says without naming the shape: _TODO_
- **Why this one:** _TODO (the winning reason)_
- **Why the other five lost:** _TODO (one line each; this becomes the guide)_

## 4. The material
Edge **${dna.edge}**, corners **${dna.tile}**, focus **${dna.ring}**, density **${dna.density}**. The mark and the form fields read the same DNA, so a field should look like it was cut from the same sheet as the logo.

## 5. The proof
${story.proof}
- Contrast pairs: ${contrastPairs.map((p) => `${p.label} ${p.ratio}:1`).join('; ')}

## 6. The decision cards
Use the shape in \`references/storytelling.md\`: Decision, Because, Not when, Breaks next.

## 7. What is missing
_TODO: name the gaps. A guide that hides its gaps is a brochure._
`

// ───────────────────────── write + verify ─────────────────────────
await mkdir(outDir, { recursive: true })
for (const [file, content] of Object.entries(outputs)) await writeFile(join(outDir, file), content)

const problems = []
for (const [file, content] of Object.entries(outputs)) {
  if (!file.endsWith('.svg')) continue
  if (/<text[\s>]/.test(content)) problems.push(`${file}: live <text>`)
  if (!/viewBox=/.test(content)) problems.push(`${file}: no viewBox`)
  if (!/<(path|circle|rect)/.test(content)) problems.push(`${file}: empty drawing`)
  const open = (content.match(/<(g|defs|clipPath|svg)[\s>]/g) || []).length
  const close = (content.match(/<\/(g|defs|clipPath|svg)>/g) || []).length
  if (open !== close) problems.push(`${file}: unbalanced tags (${open}/${close})`)
}
const weak = contrastPairs.filter((p) => p.ratio + 0.005 < p.min)

console.log(`brand-forge · ${name} · concept=${concept} · ${Object.keys(outputs).length} files → ${outDir}`)
console.log(`lockups: ${reportLockup}`)
for (const p of contrastPairs) console.log(`${p.ratio + 0.005 >= p.min ? 'PASS' : 'FAIL'}  ${p.label} ${p.ratio}:1 (min ${p.min})`)
for (const p of problems) console.log(`FAIL  ${p}`)
console.log('Next: judge sheet.html at 16px, then fill story.md TODOs. Mark compact is a separate drawing, check it alone.')
process.exit(problems.length || weak.length ? 1 : 0)
