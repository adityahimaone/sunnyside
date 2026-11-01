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
import { execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const CONCEPTS = [
  // Constructed (fill-only, zero circle, zero stroke, 2–4 solid primitives, passes v2.3 constructed gate)
  'bracket', 'planes', 'louvers', 'ribbon', 'horizon', 'junction', 'carved', 'cells', 'tear', 'portal', 'archmono',
  // Drawn (subject-led, cut-line stroke, hard offset, tactile tile, passes drawn gate)
  'sunburst', 'aperture', 'orbit', 'hatch', 'stack', 'facet', 'dotmatrix', 'lines', 'overprint', 'nodes', 'monogram', 'crest',
]
const CONSTRUCTED_CONCEPTS = new Set(['bracket', 'planes', 'louvers', 'ribbon', 'horizon', 'junction', 'carved', 'cells', 'tear', 'portal', 'archmono'])
// Default 6-concept bake-off across distinct families
const BAKEOFF = ['bracket', 'planes', 'louvers', 'ribbon', 'horizon', 'junction']
const DRAWN_BAKEOFF = ['sunburst', 'aperture', 'overprint', 'hatch', 'stack', 'crest']

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
  if (CONSTRUCTED_CONCEPTS.has(concept)) {
    cfg.dna.offset = 0
    cfg.dna.edge = 'none'
    cfg.dna.tile = 'none'
    cfg.dna.radius = 0
  } else if (concept === 'hatch' || concept === 'facet') {
    cfg.dna.offset = 0
    cfg.dna.edge = 'none'
    cfg.dna.tile = 'square'
    cfg.dna.radius = 6
  }
  if (concept === 'orbit') cfg.dna.tile = 'circle'
  if (concept === 'monogram' || concept === 'archmono') cfg.params.letter = cfg.name[0]
  console.log(JSON.stringify(cfg, null, 2))
  process.exit(0)
}

/**
 * Convert a universal tokens.json into a brand-forge config object so callers
 * can run `node scripts/brand-forge.mjs --tokens features/<slug>/tokens.json --concept <concept> --out public/brand/<slug>`
 * without authoring a separate brand.json.
 */
function configFromTokens(tokensObj, sourcePath = 'tokens.json') {
  const meta = tokensObj.meta ?? {}
  const theme = tokensObj.theme ?? tokensObj.dna ?? {}
  const primList = Array.isArray(tokensObj.primitives)
    ? tokensObj.primitives
    : Object.entries(tokensObj.color ?? {}).map(([k, v]) => ({ name: k, value: v }))
  const byKey = {}
  for (const p of primList) {
    const clean = String(p.name || '').replace(/^--[a-z0-9]+-/, '').toLowerCase()
    if (/^#[0-9a-f]{6}$/i.test(p.value)) byKey[clean] = p.value
  }
  const pick = (...keys) => {
    for (const k of keys) if (byKey[k]) return byKey[k]
    return null
  }
  const allHex = Object.values(byKey)
  const slugGuess =
    meta.slug ||
    (meta.name ? String(meta.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '') ||
    sourcePath.split('/').slice(-2, -1)[0] ||
    'brand'
  const nameGuess = meta.name || tokensObj.name || slugGuess
  const conceptGuess = flag('concept') || tokensObj.concept || (meta.track === 'drawn' ? 'sunburst' : 'bracket')
  const isConstructed = CONSTRUCTED_CONCEPTS.has(conceptGuess)
  const paper = pick('ground', 'paper', 'cream', 'parchment', 'chalk', 'sand', 'stone', 'canvas', 'porcelain', 'bone', 'vellum') || allHex[0] || STARTER.palette.paper
  const paperHi = pick('plate', 'paper-hi', 'paperhi', 'white', 'ivory', 'card', 'surface', 'linen', 'alabaster') || allHex[1] || paper
  const ink = pick('ink', 'charcoal', 'obsidian', 'void', 'slate', 'graphite', 'espresso', 'basalt', 'night', 'pine') || allHex[2] || STARTER.palette.ink
  const muted = pick('muted', 'ash', 'dust', 'slate-muted', 'pewter', 'umber', 'secondary') || allHex[3] || STARTER.palette.muted
  const signal = pick('signal', 'accent', 'cobalt', 'vermilion', 'amber', 'gold', 'emerald', 'terracotta', 'crimson', 'rust', 'copper', 'cyan', 'lime') || allHex[allHex.length - 1] || STARTER.palette.field
  const wash = pick('wash', 'tint', 'mist', 'sage', 'foam', 'blush') || signal

  return {
    name: nameGuess,
    slug: slugGuess,
    concept: conceptGuess,
    palette: {
      paper,
      paperHi,
      ink,
      field: signal,
      core: signal,
      spark: signal,
      muted,
      danger: pick('danger', 'error', 'crimson') || STARTER.palette.danger,
      success: pick('success', 'ok', 'emerald', 'moss') || STARTER.palette.success,
    },
    dna: {
      edge: isConstructed ? 'none' : (['hard', 'soft', 'none'].includes(theme.edge) ? theme.edge : 'hard'),
      offset: isConstructed ? 0 : (Number.isFinite(Number(theme.offset)) ? Number(theme.offset) : 2.5),
      stroke: isConstructed ? 0 : (Number.isFinite(Number(theme.stroke)) ? Number(theme.stroke) : 2.6),
      radius: isConstructed ? 0 : (Number.isFinite(Number(theme.radius)) ? Number(theme.radius) : 14),
      tile: isConstructed ? 'none' : (['rounded', 'circle', 'square', 'none'].includes(theme.tile) ? theme.tile : 'rounded'),
      face: Boolean(theme.face),
      density: ['compact', 'cosy', 'roomy'].includes(theme.density) ? theme.density : 'cosy',
      label: ['sentence', 'mono-caps', 'small-caps'].includes(theme.label) ? theme.label : 'sentence',
      ring: ['offset', 'solid', 'glow'].includes(theme.ring) ? theme.ring : 'offset',
      font: { display: 'Syne', ui: 'Geist', mono: 'Geist Mono' },
    },
    params: {
      letter: flag('letter', String(nameGuess)[0] || 'A'),
      lens: wash !== signal ? wash : ink,
    },
    story: {
      belief: meta.essence || STARTER.story.belief,
      enemy: STARTER.story.enemy,
      promise: meta.promise || meta.oneSentence || STARTER.story.promise,
      proof: STARTER.story.proof,
    },
  }
}

// ───────────────────────── bake-off ─────────────────────────
// Six concepts from six different families, same palette and material (theme DNA),
// so the only variable is the idea. Pick one; write down why five lost.
if (has('bakeoff')) {
  const bakeArg = flag('bakeoff')
  const outRoot = resolve(process.cwd(), flag('out', 'bakeoff'))
  const rawInput = JSON.parse(await readFile(resolve(process.cwd(), bakeArg), 'utf8'))
  const base0 = rawInput.primitives || rawInput.meta ? configFromTokens(rawInput, bakeArg) : rawInput
  const trackFlag = flag('track', base0.dna?.edge === 'none' ? 'constructed' : 'constructed')
  const families = {
    aperture: 'pure geometry (drawn)',
    dotmatrix: 'dot matrix',
    lines: 'line system',
    overprint: 'dots + geometry (two inks)',
    hatch: 'lines + geometry (hachure)',
    nodes: 'node network',
    sunburst: 'cut-ray emblem (drawn)',
    stack: 'stepped offset plates (drawn)',
    crest: 'emblem & horizon silhouette (drawn)',
    bracket: 'architectural monogram (constructed)',
    planes: 'offset sheared planes (constructed)',
    louvers: 'stepped brutalist louvers (constructed)',
    ribbon: 'folded beam & counter-cut (constructed)',
    horizon: 'grounded bar & keystone (constructed)',
    junction: 'single-stroke turn & stop (constructed)',
    carved: 'carved block & nested plate (constructed)',
    cells: 'ordered cell matrix & escape (constructed)',
    tear: 'pinned sheet & 5-tooth seam (constructed)',
    portal: 'architectural threshold arch (constructed)',
    archmono: 'solid architectural initial (constructed)',
  }
  const defaultPicks = trackFlag === 'drawn' ? DRAWN_BAKEOFF : BAKEOFF
  const picks = (base0.bakeoff ?? defaultPicks).filter((c) => CONCEPTS.includes(c))
  if (base0.params?.letter || base0.letter) {
    const monoConcept = trackFlag === 'drawn' ? 'monogram' : 'archmono'
    if (!picks.includes(monoConcept)) picks.splice(picks.length > 5 ? 5 : picks.length, picks.length > 5 ? 1 : 0, monoConcept)
  }
  await mkdir(outRoot, { recursive: true })
  for (const c of picks) {
    const tmp = join(outRoot, `.${c}.json`)
    const itemCfg = structuredClone(base0)
    itemCfg.concept = c
    if (CONSTRUCTED_CONCEPTS.has(c)) {
      itemCfg.dna = { ...itemCfg.dna, edge: 'none', offset: 0, stroke: 0, tile: 'none', radius: 0 }
    }
    await writeFile(tmp, JSON.stringify(itemCfg))
    try {
      execFileSync(process.execPath, [process.argv[1], '--config', tmp, '--out', join(outRoot, c)], { stdio: 'pipe' })
    } catch (error) {
      console.error(`bake-off: ${c} failed\n${error.stdout?.toString() ?? ''}`)
    }
  }
  const sizes = [16, 32, 64, 128]
  const card = (c, i) => {
    const row = (bg, fg) =>
      `<div style="background:${bg};color:${fg};padding:12px;display:flex;gap:14px;align-items:end;border-radius:8px">${sizes
        .map((z) => `<img src="${c}/${z <= 32 ? 'mark-compact' : 'mark'}.svg" width="${z}" height="${z}" alt="">`)
        .join('')}</div>`
    return `<article style="background:#fff;border:1px solid #0002;border-radius:12px;padding:18px;display:grid;gap:12px">
<header style="display:flex;justify-content:space-between;font:600 13px ui-monospace,monospace"><span>${String(i + 1).padStart(2, '0')} · ${c}</span><span style="opacity:.6">${families[c] ?? 'monogram'}</span></header>
<img src="${c}/mark.svg" width="180" height="180" alt="${c} mark" style="justify-self:center">
<img src="${c}/lockup.svg" height="36" alt="${c} lockup" style="justify-self:center;max-width:100%">
${row('#f6f1e7', '#111')}${row('#14141f', '#fff')}
<p style="font:12px/1.4 system-ui;margin:0;color:#444">One sentence this mark argues (no shape names): <br><strong>________________</strong></p>
<p style="font:12px/1.4 system-ui;margin:0;color:#444">Keep / lost because: <strong>________________</strong></p></article>`
  }
  await writeFile(
    join(outRoot, 'bakeoff.html'),
    `<!doctype html><meta charset="utf-8"><title>${base0.name ?? 'brand'} — v3.7 bake-off</title>
<body style="margin:0;padding:28px;background:#e9e4d8;font-family:system-ui"><h1 style="font:700 20px system-ui;margin:0 0 6px">${base0.name ?? 'brand'} — ${picks.length} ideas, one material</h1>
<p style="margin:0 0 20px;max-width:70ch;color:#444;font-size:14px">Same palette and theme DNA; only the idea changes. Judge at 16px first. Keep one. Write why the rest lost: that note becomes the guide.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">${picks.map(card).join('')}</div></body>
`,
  )
  console.log(`bake-off · ${picks.join(', ')} → ${outRoot}/bakeoff.html`)
  console.log('Next: python3 scripts/score-mark.py --dir ' + outRoot + ' (objective checks), then choose and refine.')
  process.exit(0)
}

function fail(message) {
  console.error(`brand-forge: ${message}`)
  process.exit(1)
}

const configPath = flag('config')
const tokensPath = flag('tokens')
if (!configPath && !tokensPath) fail('--config <brand.json> or --tokens <tokens.json> is required (try --init sunburst)')
const outDir = resolve(process.cwd(), flag('out', 'brand-out'))
const rawCfg = JSON.parse(await readFile(resolve(process.cwd(), configPath || tokensPath), 'utf8'))
const cfg = rawCfg.primitives || rawCfg.meta ? configFromTokens(rawCfg, configPath || tokensPath) : rawCfg
if (flag('concept')) cfg.concept = flag('concept')
if (flag('letter')) cfg.params = { ...cfg.params, letter: flag('letter') }
const merged = {
  ...STARTER,
  ...cfg,
  palette: { ...STARTER.palette, ...cfg.palette },
  dna: { ...STARTER.dna, ...cfg.dna, font: { ...STARTER.dna.font, ...cfg.dna?.font } },
  params: { ...STARTER.params, ...cfg.params },
  story: { ...STARTER.story, ...cfg.story },
}
if (CONSTRUCTED_CONCEPTS.has(merged.concept) && !rawCfg.dna?.tile) {
  merged.dna.tile = 'none'
  merged.dna.edge = 'none'
  merged.dna.offset = 0
  merged.dna.stroke = 0
}
let { concept } = merged
const { name, slug, palette: P, dna, params, story } = merged
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
  if (dna.tile === 'none') return `<rect x="${r(x)}" y="${r(y)}" width="${r(s)}" height="${r(s)}" rx="4" ${extra}/>`
  if (dna.tile === 'circle') return `<circle cx="${r(x + s / 2)}" cy="${r(y + s / 2)}" r="${r(s / 2)}" ${extra}/>`
  const rx = dna.tile === 'square' ? Math.min(dna.radius, 4) : Math.max(dna.radius - inset, 2)
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(s)}" height="${r(s)}" rx="${r(rx)}" ${extra}/>`
}
const clipId = `${slug}-tile`

// Solid filled geometric capitals on a 0..18 × 0..24 box (for built-in outlined wordmark + archmono)
const FILLED_GLYPHS = {
  A: { w: 18, d: 'M7 0H11L18 24H13.5L12.1 19H5.9L4.5 24H0L7 0ZM7.1 15H10.9L9 7.8L7.1 15Z' },
  B: { w: 17, d: 'M0 0H10.5C14.2 0 16.5 2.1 16.5 5.8C16.5 8.4 15.1 10.3 12.8 11.2C15.6 12 17 14.2 17 17.4C17 21.6 14.4 24 10.2 24H0V0ZM4.5 4V9.6H9.8C11.3 9.6 12.2 8.7 12.2 6.8C12.2 4.9 11.3 4 9.8 4H4.5ZM4.5 13.4V20H10C11.7 20 12.6 19 12.6 16.7C12.6 14.4 11.7 13.4 10 13.4H4.5Z' },
  C: { w: 17, d: 'M17 7.5H12.4C11.9 5.1 10.5 4 8.6 4C5.9 4 4.5 6.4 4.5 12C4.5 17.6 5.9 20 8.6 20C10.5 20 11.9 18.9 12.4 16.5H17C16.3 21.3 13.3 24 8.5 24C3.1 24 0 19.6 0 12C0 4.4 3.1 0 8.5 0C13.3 0 16.3 2.7 17 7.5Z' },
  D: { w: 18, d: 'M0 0H8.8C14.6 0 18 4.2 18 12C18 19.8 14.6 24 8.8 24H0V0ZM4.5 4V20H8.5C11.8 20 13.5 17.3 13.5 12C13.5 6.7 11.8 4 8.5 4H4.5Z' },
  E: { w: 16, d: 'M0 0H15.5V4H4.5V9.8H14V13.8H4.5V20H16V24H0V0Z' },
  F: { w: 15, d: 'M0 0H15V4H4.5V10.2H13.5V14.2H4.5V24H0V0Z' },
  G: { w: 18, d: 'M17.6 7.5H13C12.4 5.1 11 4 8.9 4C6 4 4.5 6.4 4.5 12C4.5 17.6 6 20 9.1 20C11.6 20 13.3 18.5 13.5 15.2H9.2V11.4H18V24H14.6L14.1 21.1C12.7 23.1 10.7 24 8.2 24C2.9 24 0 19.6 0 12C0 4.4 3.1 0 8.8 0C13.8 0 16.9 2.7 17.6 7.5Z' },
  H: { w: 18, d: 'M0 0H4.5V9.8H13.5V0H18V24H13.5V13.8H4.5V24H0V0Z' },
  I: { w: 10, d: 'M0 0H10V4H7.25V20H10V24H0V20H2.75V4H0V0Z' },
  J: { w: 15, d: 'M10.5 0H15V16.2C15 21.3 12.2 24 7.4 24C2.7 24 0 21.5 0 16.5V15H4.4V16.4C4.4 18.8 5.4 20 7.4 20C9.5 20 10.5 18.8 10.5 16.2V0Z' },
  K: { w: 18, d: 'M0 0H4.5V10.2L13.2 0H18.4L10.3 9.4L18.8 24H13.6L7.2 12.8L4.5 15.9V24H0V0Z' },
  L: { w: 15, d: 'M0 0H4.5V20H15V24H0V0Z' },
  M: { w: 21, d: 'M0 0H5.2L10.5 14.8L15.8 0H21V24H16.6V8.2L11.9 21.2H9.1L4.4 8.2V24H0V0Z' },
  N: { w: 18, d: 'M0 0H4.8L13.5 15.8V0H18V24H13.2L4.5 8.2V24H0V0Z' },
  O: { w: 18, d: 'M9 0C14.7 0 18 4.4 18 12C18 19.6 14.7 24 9 24C3.3 24 0 19.6 0 12C0 4.4 3.3 0 9 0ZM9 4C6.1 4 4.5 6.4 4.5 12C4.5 17.6 6.1 20 9 20C11.9 20 13.5 17.6 13.5 12C13.5 6.4 11.9 4 9 4Z' },
  P: { w: 17, d: 'M0 0H10.2C14.6 0 17 2.7 17 7.6C17 12.5 14.6 15.2 10.2 15.2H4.5V24H0V0ZM4.5 4V11.2H9.6C11.5 11.2 12.5 10 12.5 7.6C12.5 5.2 11.5 4 9.6 4H4.5Z' },
  Q: { w: 19, d: 'M9 0C14.7 0 18 4.4 18 12C18 15.6 17 18.6 15.2 20.6L18.6 24H13.2L11.6 22.4C10.8 22.8 9.9 23 9 23C3.3 23 0 18.8 0 11.5C0 4.2 3.3 0 9 0ZM9 4C6.1 4 4.5 6.4 4.5 11.5C4.5 16.6 6.1 19 9 19C11.9 19 13.5 16.6 13.5 11.5C13.5 6.4 11.9 4 9 4Z' },
  R: { w: 18, d: 'M0 0H10.2C14.6 0 17 2.5 17 7.2C17 10.6 15.5 13 12.8 14L18 24H13L8.4 14.6H4.5V24H0V0ZM4.5 4V10.8H9.6C11.5 10.8 12.5 9.6 12.5 7.4C12.5 5.2 11.5 4 9.6 4H4.5Z' },
  S: { w: 17, d: 'M16.5 6.8H12C11.8 4.8 10.5 3.8 8.4 3.8C6.3 3.8 5 4.7 5 6.3C5 7.9 6.3 8.6 9.8 9.6C14.2 10.8 17 12.5 17 16.9C17 21.5 13.7 24 8.5 24C3.1 24 0 21.3 0 16.5H4.5C4.7 19 6.2 20.2 8.7 20.2C11.1 20.2 12.5 19.1 12.5 17.3C12.5 15.5 11.2 14.7 7.6 13.7C3.2 12.5 0.5 10.8 0.5 6.6C0.5 2.4 3.7 0 8.5 0C13.5 0 16.3 2.5 16.5 6.8Z' },
  T: { w: 17, d: 'M0 0H17V4H10.75V24H6.25V4H0V0Z' },
  U: { w: 18, d: 'M0 0H4.5V15.2C4.5 18.4 6.1 20 9 20C11.9 20 13.5 18.4 13.5 15.2V0H18V15.4C18 21 14.6 24 9 24C3.4 24 0 21 0 15.4V0Z' },
  V: { w: 18, d: 'M0 0H4.8L9 17.6L13.2 0H18L11.4 24H6.6L0 0Z' },
  W: { w: 23, d: 'M0 0H4.5L7.1 16.4L10.1 0H13.9L16.9 16.4L19.5 0H24L19.2 24H14.8L12 9.4L9.2 24H4.8L0 0Z' },
  X: { w: 18, d: 'M0 0H5.1L9 7.8L12.9 0H18L11.6 11.8L18.4 24H13.3L9 15.8L4.7 24H-0.4L6.4 11.8L0 0Z' },
  Y: { w: 18, d: 'M0 0H5L9 9.6L13 0H18L11.25 14.6V24H6.75V14.6L0 0Z' },
  Z: { w: 17, d: 'M0 0H17V3.8L5.4 20H17V24H0V20.2L11.6 4H0V0Z' },
  0: { w: 17, d: 'M8.5 0C13.9 0 17 4.2 17 12C17 19.8 13.9 24 8.5 24C3.1 24 0 19.8 0 12C0 4.2 3.1 0 8.5 0ZM8.5 4C5.8 4 4.4 6.5 4.4 12C4.4 17.5 5.8 20 8.5 20C11.2 20 12.6 17.5 12.6 12C12.6 6.5 11.2 4 8.5 4Z' },
  1: { w: 12, d: 'M0 4.2L5.2 0H9.5V20H12.5V24H0.5V20H5V5.2L0 8.8V4.2Z' },
  2: { w: 16, d: 'M0.4 7.6C0.6 2.8 3.6 0 8.3 0C13 0 16 2.6 16 6.8C16 10.1 14.3 12.4 10.2 15.6L5.6 19.8H16V24H0V20.2L7.6 13.2C10.5 10.5 11.5 9 11.5 6.9C11.5 4.9 10.2 3.8 8.2 3.8C6 3.8 4.7 5.1 4.6 7.6H0.4Z' },
  3: { w: 16, d: 'M0.5 6.4C0.9 2.4 3.8 0 8.3 0C12.9 0 15.8 2.4 15.8 6.3C15.8 9.1 14.3 10.9 11.8 11.6C14.7 12.3 16.4 14.3 16.4 17.4C16.4 21.6 13.2 24 8.3 24C3.4 24 0.3 21.4 0 17.2H4.4C4.6 19.2 6 20.2 8.3 20.2C10.6 20.2 12 19 12 17C12 14.9 10.5 13.8 7.6 13.8H5.8V10.1H7.6C10.2 10.1 11.4 9 11.4 6.9C11.4 4.9 10.2 3.8 8.2 3.8C6.1 3.8 4.8 4.8 4.6 6.4H0.5Z' },
  4: { w: 17, d: 'M9.8 0H14.2V15H17V18.8H14.2V24H9.8V18.8H0V15.2L9.8 0ZM9.8 6.2L4.2 15H9.8V6.2Z' },
  5: { w: 16, d: 'M1.2 0H15.2V4H5L4.5 9.6C5.6 8.6 7.2 8 9.2 8C13.6 8 16.4 10.9 16.4 15.8C16.4 21 13.1 24 8.1 24C3.3 24 0.3 21.3 0 17H4.4C4.6 19.1 6 20.2 8.2 20.2C10.6 20.2 12 18.6 12 15.8C12 13.1 10.6 11.6 8.2 11.6C6.4 11.6 5.1 12.3 4.5 13.6L0.4 12.8L1.2 0Z' },
  6: { w: 17, d: 'M16.2 6.2H11.8C11.4 4.5 10.3 3.8 8.7 3.8C5.9 3.8 4.4 6.4 4.4 11.2C5.6 9.6 7.4 8.8 9.6 8.8C14 8.8 17 11.7 17 16.3C17 21.1 13.7 24 8.7 24C3.2 24 0 19.9 0 12.4C0 4.3 3.3 0 8.8 0C13.2 0 15.8 2.3 16.2 6.2ZM8.6 12.4C6.2 12.4 4.7 13.9 4.7 16.3C4.7 18.8 6.2 20.3 8.6 20.3C11 20.3 12.5 18.8 12.5 16.3C12.5 13.9 11 12.4 8.6 12.4Z' },
  7: { w: 16, d: 'M0 0H16V3.8L7.4 24H2.6L11.2 4H0V0Z' },
  8: { w: 17, d: 'M8.5 0C13.2 0 16.2 2.4 16.2 6.2C16.2 8.8 14.8 10.7 12.4 11.5C15.2 12.4 16.8 14.5 16.8 17.5C16.8 21.6 13.5 24 8.5 24C3.5 24 0.2 21.6 0.2 17.5C0.2 14.5 1.8 12.4 4.6 11.5C2.2 10.7 0.8 8.8 0.8 6.2C0.8 2.4 3.8 0 8.5 0ZM8.5 3.6C6.4 3.6 5.1 4.7 5.1 6.6C5.1 8.5 6.4 9.7 8.5 9.7C10.6 9.7 11.9 8.5 11.9 6.6C11.9 4.7 10.6 3.6 8.5 3.6ZM8.5 13.4C6.1 13.4 4.6 14.8 4.6 17.1C4.6 19.3 6.1 20.4 8.5 20.4C10.9 20.4 12.4 19.3 12.4 17.1C12.4 14.8 10.9 13.4 8.5 13.4Z' },
  9: { w: 17, d: 'M0.8 17.8H5.2C5.6 19.5 6.7 20.2 8.3 20.2C11.1 20.2 12.6 17.6 12.6 12.8C11.4 14.4 9.6 15.2 7.4 15.2C3 15.2 0 12.3 0 7.7C0 2.9 3.3 0 8.3 0C13.8 0 17 4.1 17 11.6C17 19.7 13.7 24 8.2 24C3.8 24 1.2 21.7 0.8 17.8ZM8.4 3.7C6 3.7 4.5 5.2 4.5 7.7C4.5 10.1 6 11.6 8.4 11.6C10.8 11.6 12.3 10.1 12.3 7.7C12.3 5.2 10.8 3.7 8.4 3.7Z' },
  '-': { w: 10, d: 'M0 10H10V14H0V10Z' },
  '.': { w: 6, d: 'M0.5 18.5H5.5V24H0.5V18.5Z' },
  '&': { w: 19, d: 'M14.2 24L12.3 21.8C10.7 23.3 8.7 24 6.4 24C2.4 24 0 21.5 0 17.6C0 14.5 1.8 12.4 4.8 11C3.3 9.1 2.6 7.5 2.6 5.6C2.6 2.2 5.2 0 9.1 0C12.9 0 15.4 2.2 15.4 5.5C15.4 8.4 13.5 10.4 10.1 11.9L13.2 15.6C13.9 14.2 14.3 12.5 14.5 10.6H18.4C18.1 13.9 17.2 16.6 15.7 18.7L19.4 24H14.2ZM6.8 14C4.9 14.9 4.1 16 4.1 17.5C4.1 19.3 5.2 20.4 7 20.4C8.4 20.4 9.6 19.8 10.6 18.7L6.8 14ZM9.1 3.4C7.5 3.4 6.5 4.3 6.5 5.7C6.5 7 7.2 8.1 8.5 9.5C10.5 8.5 11.5 7.3 11.5 5.7C11.5 4.3 10.5 3.4 9.1 3.4Z' },
}

/**
 * Synthesize a pure-<path> outlined wordmark SVG (zero <text> elements) from
 * any brand name when --wordmark is not supplied.
 */
function buildOutlinedWordmark(text, fill = P.ink) {
  const clean = String(text || 'BRAND').toUpperCase()
  const tracking = 2.8
  let x = 0
  const groups = []
  for (const ch of clean) {
    if (ch === ' ') {
      x += 8
      continue
    }
    const g = FILLED_GLYPHS[ch]
    if (!g) continue
    groups.push(`<path transform="translate(${r(x)} 0)" d="${g.d}"/>`)
    x += g.w + tracking
  }
  const totalW = Math.max(24, r(x - tracking))
  const totalH = 24
  return `${svgOpen(totalW, totalH, text)}<g fill="${fill}" fill-rule="evenodd">${groups.join('')}</g></svg>\n`
}


// Geometric monoline capitals on a 40 × 48 box (stroke is applied by the concept).
const LETTERS = {
  A: 'M2 48L20 2L38 48M9 31H31', B: 'M3 2V46M3 2H20A11 11 0 0 1 20 24H3M3 24H22A11 11 0 0 1 22 46H3',
  C: 'M37.3 11.1A20 20 0 1 0 37.3 36.9', D: 'M3 2V46H16A22 22 0 0 0 16 2Z',
  E: 'M37 2H3V46H37M3 24H29', F: 'M37 2H3V46M3 24H29',
  G: 'M37.3 11.1A20 20 0 1 0 41 24H24', H: 'M3 2V46M37 2V46M3 24H37',
  I: 'M10 2H30M20 2V46M10 46H30', J: 'M33 2V30A13 13 0 0 1 7 30',
  K: 'M3 2V46M37 2L3 28M12 20L37 46', L: 'M3 2V46H37',
  M: 'M3 46V2L20 30L37 2V46', N: 'M3 46V2L37 46V2',
  O: 'M20 2A17 22 0 0 0 20 46A17 22 0 0 0 20 2Z', P: 'M3 46V2H20A12 12 0 0 1 20 26H3',
  Q: 'M20 2A17 22 0 0 0 20 46A17 22 0 0 0 20 2ZM26 34L39 48', R: 'M3 46V2H20A12 12 0 0 1 20 26H3M19 26L37 46',
  S: 'M35 9C28 0 5 0 5 12C5 25 35 21 35 36C35 49 10 48 3 39', T: 'M2 2H38M20 2V46',
  U: 'M3 2V28A17 17 0 0 0 37 28V2', V: 'M2 2L20 46L38 2',
  W: 'M0 2L10 46L20 14L30 46L40 2', X: 'M3 2L37 46M37 2L3 46',
  Y: 'M2 2L20 24L38 2M20 24V46', Z: 'M3 2H37L3 46H37',
}

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
    // Hachure: short strokes on the shaded side only, steepest at the edge; the lit half stays empty.
    const gap = compact ? 9 : 5
    const w = compact ? 3.6 : 1.9
    const segs = []
    for (let k = 64 + gap * 1.5; k < 124; k += gap * 1.4142) {
      const t = (k - 64) / 60
      const inset = (1 - t) * 10 // lines start further in near the lit side: a falling-off shade
      segs.push(`M${r(k - 64 + inset)} ${r(64 - inset)}L${r(64 - inset)} ${r(k - 64 + inset)}`)
    }
    const orb = compact ? 13 : 14
    const ring = dna.tile === 'none' ? `<circle cx="32" cy="32" r="${compact ? 27 : 27.4}" fill="none" stroke="${c.lead}" stroke-width="${compact ? 3 : 1.8}"/>` : ''
    return (
      `<g clip-path="url(#${clipId})"><path d="${segs.join('')}" fill="none" stroke="${c.lead}" stroke-width="${w}" stroke-linecap="butt"/></g>` +
      ring +
      `<circle cx="28.5" cy="28.5" r="${orb}" fill="${c.core}" stroke="${c.ink}" stroke-width="${compact ? 3 : 2.4}"/>`
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
  dotmatrix(c, compact) {
    // Concentric dots, empty centre, one wedge removed: tension without noise.
    const rings = compact ? [[6, 10, 4.4], [12, 21, 3.4]] : [[6, 9, 3.4], [12, 18, 2.9], [18, 26.5, 2.4]]
    const gapAt = -50 // degrees; the wedge opens to the upper right
    const gapHalf = compact ? 30 : 24
    let out = ''
    for (const [n, ringR, dotR] of rings) {
      for (let i = 0; i < n; i++) {
        const a = (360 / n) * i - 90
        const d = Math.abs((((a - gapAt) % 360) + 540) % 360 - 180)
        if (d < gapHalf) continue
        const [x, y] = pt(32, 32, ringR, a)
        out += `<circle cx="${r(x)}" cy="${r(y)}" r="${dotR}" fill="${c.lead}"/>`
      }
    }
    const [ax, ay] = pt(32, 32, compact ? 21 : 26, gapAt)
    return out + `<circle cx="${r(ax)}" cy="${r(ay)}" r="${compact ? 5 : 4.4}" fill="${c.core}" stroke="${c.ink}" stroke-width="${compact ? 2.4 : 1.8}"/>`
  },
  lines(c, compact) {
    // A disc hatched with lines whose weight swells through the middle (a lit sphere, drawn).
    const n = compact ? 5 : 9
    const R = compact ? 23 : 22
    const top = 32 - R
    const step = (2 * R) / n
    let out = `<defs><clipPath id="${slug}-disc"><circle cx="32" cy="32" r="${R}"/></clipPath></defs><g clip-path="url(#${slug}-disc)">`
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n
      const w = (compact ? 2.2 : 1.1) + Math.sin(t * Math.PI) * (compact ? 3.4 : 3.1)
      const y = top + (i + 0.5) * step
      out += `<line x1="6" y1="${r(y)}" x2="58" y2="${r(y)}" stroke="${c.lead}" stroke-width="${r(w)}"/>`
    }
    out += '</g>'
    const [sx, sy] = pt(32, 32, R + 1, -45)
    return out + `<circle cx="${r(sx)}" cy="${r(sy)}" r="${compact ? 5.4 : 4.6}" fill="${c.core}" stroke="${c.ink}" stroke-width="${compact ? 2.4 : 1.8}"/>`
  },
  overprint(c, compact) {
    // Two inks, one lens. Flat fills only; the lens is clipped, not blended.
    const rr = compact ? 15.5 : 16
    const a = [compact ? 25 : 24.5, compact ? 35 : 36]
    const b = [compact ? 39 : 39.5, compact ? 29 : 28]
    const sw = compact ? 2.8 : 2
    return (
      `<defs><clipPath id="${slug}-lens"><circle cx="${a[0]}" cy="${a[1]}" r="${rr}"/></clipPath></defs>` +
      `<circle cx="${a[0]}" cy="${a[1]}" r="${rr}" fill="${c.spark}"/>` +
      `<circle cx="${b[0]}" cy="${b[1]}" r="${rr}" fill="${c.core}"/>` +
      `<circle cx="${b[0]}" cy="${b[1]}" r="${rr}" fill="${params.lens && c.ink === P.ink ? params.lens : c.ink}" clip-path="url(#${slug}-lens)"/>` +
      `<circle cx="${a[0]}" cy="${a[1]}" r="${rr}" fill="none" stroke="${c.ink}" stroke-width="${sw}"/>` +
      `<circle cx="${b[0]}" cy="${b[1]}" r="${rr}" fill="none" stroke="${c.ink}" stroke-width="${sw}"/>`
    )
  },
  nodes(c, compact) {
    // Three nodes on a diagonal, thick edges, one satellite. Asymmetric on purpose.
    const N = compact ? [[17, 44, 7], [45, 20, 8]] : [[16, 45, 6.4], [30, 28, 7.8], [48, 20, 5.4]]
    const w = compact ? 3.8 : 3
    let edges = ''
    for (let i = 0; i < N.length - 1; i++) {
      const [x1, y1] = N[i]
      const [x2, y2] = N[i + 1]
      const mx = (x1 + x2) / 2 + (i % 2 ? 6 : -6)
      const my = (y1 + y2) / 2 + (i % 2 ? 6 : 6)
      edges += `<path d="M${x1} ${y1}Q${r(mx)} ${r(my)} ${x2} ${y2}" fill="none" stroke="${c.lead}" stroke-width="${w}" stroke-linecap="round"/>`
    }
    const fills = [c.spark, c.core, c.lead]
    const nodes = N.map(([x, y, rr], i) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${fills[i % 3]}" stroke="${c.ink}" stroke-width="${compact ? 2.6 : 2}"/>`).join('')
    return edges + nodes
  },
  bracket(c, compact) {
    // Constructed family 1: two solid L-brackets on the 64 grid, one keystone; no strokes.
    // Compact widens the inner channel and thickens the arms so it reads cleanly at 16px.
    const v = compact
      ? { l: 'M6 6H22V24H28V40H22V58H6Z', r: 'M58 6H42V24H36V40H42V58H58Z', k: 'M32 18L40 32L32 46L24 32Z' }
      : { l: 'M8 8H20V28H30V36H20V56H8Z', r: 'M56 8H44V28H34V36H44V56H56Z', k: 'M32 22L38 32L32 42L26 32Z' }
    return `<path d="${v.l}" fill="${c.lead}"/><path d="${v.r}" fill="${c.lead}"/><path d="${v.k}" fill="${c.spark}"/>`
  },
  planes(c, compact) {
    // Constructed family 2: two sheared sheets on the 64 grid, one clipped overprint (Strand).
    const v = compact
      ? { a: 'M20 8H50L34 56H6Z', b: 'M30 4H58L42 52H14Z' }
      : { a: 'M24 10H52L36 54H8Z', b: 'M34 4H62L46 48H18Z' }
    const id = `${slug}-planes-${compact ? 'c' : 'f'}`
    const over = params.lens || c.ink
    return `<defs><clipPath id="${id}"><path d="${v.a}"/></clipPath></defs><path d="${v.a}" fill="${c.core}"/><path d="${v.b}" fill="${c.spark}"/><path d="${v.b}" fill="${over}" clip-path="url(#${id})"/>`
  },
  louvers(c, compact) {
    // Constructed family 3: solid wedge bars on the 64 grid, one apex (Ledger).
    // Compact drops from 4 bars to 3 wider bars so the channels never clog at 16px.
    const v = compact
      ? { bars: 'M4 58V36L16 44V58Z M22 58V22L36 30V58Z M42 58V12L58 20V58Z', apex: 'M50 2L60 12L50 22L40 12Z' }
      : { bars: 'M2 56V36L10 42V56Z M15.3 56V26L25.3 32V56Z M30.6 56V16L42.6 22V56Z M47.9 56V8L61.9 14V56Z', apex: 'M54.9 2L61.9 8L54.9 14L47.9 8Z' }
    return `<path d="${v.bars}" fill="${c.lead}"/><path d="${v.apex}" fill="${c.core}"/>`
  },
  ribbon(c, compact) {
    // Constructed family 4: two interlocked folded beams + accent corner lock.
    const v = compact
      ? {
          beams: 'M6 10H28L44 26H58V40H38L22 24H6Z M6 32H22L38 48H58V56H32L16 40H6Z',
          lock: 'M46 10H58V22L46 10Z',
        }
      : {
          beams: 'M8 12H28L44 28H56V40H38L22 24H8Z M8 32H24L40 48H56V56H34L18 40H8Z',
          lock: 'M44 12H56V24L44 12Z',
        }
    return `<path d="${v.beams}" fill="${c.lead}"/><path d="${v.lock}" fill="${c.spark}"/>`
  },
  horizon(c, compact) {
    // Constructed family 5: grounded architectural plinth with notch + floating keystone.
    const v = compact
      ? { bar: 'M6 40H24L32 48L40 40H58V56H6Z', key: 'M32 8L46 24L32 40L18 24Z' }
      : { bar: 'M8 40H25L32 47L39 40H56V54H8Z', key: 'M32 8L44 23L32 38L20 23Z' }
    return `<path d="${v.bar}" fill="${c.lead}"/><path d="${v.key}" fill="${c.spark}"/>`
  },
  junction(c, compact) {
    // Constructed family 6 (Jakarta): single-stroke 90° turn with 2S outer / 1S inner chamfer + signal stop block.
    const v = compact
      ? { turn: 'M8 8H26V28L36 38H56V56H28L8 36V8Z', stop: 'M36 8H56V28H36Z' }
      : { turn: 'M8 8H24V28L36 40H56V56H28L8 36V8Z', stop: 'M38 8H56V26H38Z' }
    return `<path d="${v.turn}" fill="${c.lead}"/><path d="${v.stop}" fill="${c.spark}"/>`
  },
  carved(c, compact) {
    // Constructed family 7 (Cove): 48×48 stone block with upper-right quadrant carved out + nested signal reading block.
    const v = compact
      ? { block: 'M6 6H58V28H28V58H6Z', inner: 'M36 36H58V58H36Z' }
      : { block: 'M8 8H56V30H30V56H8Z', inner: 'M36 36H56V56H36Z' }
    return `<path d="${v.block}" fill="${c.lead}"/><path d="${v.inner}" fill="${c.spark}"/>`
  },
  cells(c, compact) {
    // Constructed family 8 (Huginn): ordered matrix cells + one escaping cell [+6, -6].
    const v = compact
      ? {
          grid: 'M8 12H26V30H8Z M8 36H26V54H8Z M32 36H50V54H32Z',
          escape: 'M38 6H58V26H38Z',
        }
      : {
          grid: 'M8 10H21V23H8Z M25 10H38V23H25Z M8 27H21V40H8Z M25 27H38V40H25Z M8 44H21V57H8Z M25 44H38V57H25Z M42 27H55V40H42Z M42 44H55V57H42Z',
          escape: 'M45 4H59V18H45Z',
        }
    return `<path d="${v.grid}" fill="${c.lead}"/><path d="${v.escape}" fill="${c.spark}"/>`
  },
  tear(c, compact) {
    // Constructed family 9 (Riso): pinned sheet with irregular tooth seam + diamond registration pin.
    const v = compact
      ? {
          sheet: 'M8 6H56V36L44 44L32 34L18 46L8 38Z',
          drum: 'M12 44L22 52L34 42L46 52L56 44V58H12Z',
          pin: 'M32 14L39 21L32 28L25 21Z',
        }
      : {
          sheet: 'M8 6H56V34L48 42L38 33L28 43L18 35L8 42Z',
          drum: 'M11 45L20 39L30 47L40 37L50 46L56 40V58H11Z',
          pin: 'M32 14L38 20L32 26L26 20Z',
        }
    return `<path d="${v.drum}" fill="${c.spark}"/><path d="${v.sheet} ${v.pin}" fill="${c.lead}" fill-rule="evenodd"/>`
  },
  portal(c, compact) {
    // Constructed family 10 (Porphyry): monumental stone block with stepped architectural portal + gold threshold bar.
    const v = compact
      ? {
          monolith: 'M8 6H56V50H42V22H22V50H8Z',
          threshold: 'M8 54H56V60H8Z',
        }
      : {
          monolith: 'M8 6H56V48H42V24L32 16L22 24V48H8Z',
          threshold: 'M8 52H56V58H8Z',
        }
    return `<path d="${v.monolith}" fill="${c.lead}"/><path d="${v.threshold}" fill="${c.spark}"/>`
  },
  archmono(c, compact) {
    // Constructed family 11: solid fill-only architectural monogram for any letter A–Z + signal keystone cut.
    const ch = String(params.letter || name[0] || 'A').toUpperCase()
    const g = FILLED_GLYPHS[ch] || FILLED_GLYPHS.A
    const scale = compact ? 1.95 : 1.85
    const gw = g.w * scale
    const gh = 24 * scale
    const tx = r((64 - gw) / 2 - 2)
    const ty = r((64 - gh) / 2)
    const badge = compact
      ? 'M48 8H58V18H48Z'
      : 'M48 8L58 8L58 18L48 18Z'
    return (
      `<g transform="translate(${tx} ${ty}) scale(${scale})" fill="${c.lead}" fill-rule="evenodd"><path d="${g.d}"/></g>` +
      `<path d="${badge}" fill="${c.spark}"/>`
    )
  },
  crest(c, compact) {
    // Drawn family 12 (Clearing): horizon valley crest + rising sun disc + cut-line frame.
    const sw = compact ? 3 : 2.4
    const sunR = compact ? 9 : 8
    return (
      `<circle cx="32" cy="22" r="${sunR}" fill="${c.core}" stroke="${c.ink}" stroke-width="${sw}"/>` +
      `<path d="M6 48L20 30L32 42L44 28L58 48V56H6Z" fill="${c.spark}" stroke="${c.ink}" stroke-width="${sw}" stroke-linejoin="round"/>`
    )
  },
  monogram(c, compact) {
    const ch = String(params.letter || name[0] || 'A').toUpperCase()
    const glyph = LETTERS[ch]
    if (!glyph) return ''
    const w = compact ? 7.4 : 6
    const s = compact ? 0.82 : 0.8
    const tx = 32 - 20 * s
    const ty = 32 - 24 * s
    const lay = (stroke, dx, dy) =>
      `<g transform="translate(${r(tx + dx)} ${r(ty + dy)}) scale(${s})" fill="none" stroke="${stroke}" stroke-width="${r(w / s)}" stroke-linecap="round" stroke-linejoin="round"><path d="${glyph}"/></g>`
    // printed offset sits behind the letter; compact drops it (it dies below 1.5px at 16px)
    return (compact ? '' : lay(c.core, 2.2, 2.2)) + lay(c.lead, 0, 0)
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

function buildMark({ colors, compact = false, tile = true, shadow = true, field = colors.field, forceTile = false }) {
  if (dna.tile === 'none' && !forceTile) { tile = false; shadow = false }
  const off = compact || !shadow || dna.edge === 'none' ? 0 : dna.offset
  const stroke = compact ? 3.2 : dna.stroke
  const defs = dna.tile === 'none' ? '' : `<defs><clipPath id="${clipId}">${tileShape('', 0)}</clipPath></defs>`
  const edge = dna.edge === 'none' ? 'none' : colors.ink
  const parts = defs ? [defs] : []
  if (tile && off > 0) parts.push(`<g transform="translate(${off} ${off})">${tileShape(`fill="${colors.ink}"`)}</g>`)
  if (tile) {
    const squareIcon = forceTile && dna.tile === 'none'
    parts.push(
      squareIcon
        ? `<rect x="0" y="0" width="64" height="64" fill="${field}"/>`
        : tileShape(`fill="${field}" stroke="${edge}" stroke-width="${edge === 'none' ? 0 : stroke}"`),
    )
  }
  parts.push(concepts[concept](colors, compact))
  return `${svgOpen()}${parts.join('')}</svg>\n`
}
const base = { field: P.field, core: P.core, spark: P.spark, ink: P.ink, paper: P.paperHi, lead: dna.tile === 'none' ? P.ink : P.paperHi }
const reverseColors = { field: P.ink, core: P.core, spark: P.spark, ink: P.paperHi, paper: P.ink, lead: P.paperHi }
const outputs = {}
outputs['mark.svg'] = buildMark({ colors: base })
outputs['mark-compact.svg'] = buildMark({ colors: base, compact: true })
outputs['mark-compact-reverse.svg'] = buildMark({ colors: reverseColors, compact: true, shadow: false })
outputs['glyph.svg'] = buildMark({ colors: base, tile: false, shadow: false })
// Reversed: tile in ink, drawing lines in paper so it holds on a dark ground.
outputs['mark-reverse.svg'] = buildMark({
  colors: reverseColors,
  shadow: false,
})
// One-colour stamp is DRAWN: all fills collapse to ink/paper with the same geometry.
outputs['mark-mono.svg'] = buildMark({
  // One ink, one silhouette. The accent collapses into the same fill; the
  // counters/channels are the only negative space.
  colors: { field: P.ink, core: P.ink, spark: P.ink, ink: P.ink, paper: P.ink, lead: P.ink },
  shadow: dna.edge === 'hard',
})
// Favicon field: the compact mark, with an opaque ground so it never vanishes on chrome.
outputs['icon.svg'] = buildMark({ colors: base, compact: true, forceTile: true })

// Lockups (use --wordmark if passed, otherwise synthesize outlined vector wordmark automatically)
const wordPath = flag('wordmark')
let reportLockup = 'built with built-in vector wordmark outlines'
{
  const raw = wordPath
    ? await readFile(resolve(process.cwd(), wordPath), 'utf8')
    : buildOutlinedWordmark(name, P.ink)
  const vb = raw.match(/viewBox\s*=\s*["']([\d.\s-]+)["']/)
  if (!vb) fail('wordmark.svg has no viewBox')
  if (/<text[\s>]/.test(raw)) fail('wordmark.svg contains live <text>; outline it first')
  const [, , ww, wh] = vb[1].trim().split(/\s+/).map(Number)
  const inner = raw
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/\bfill="[^"]*"/g, '')
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
  outputs['lockup-stacked-reverse.svg'] = place(P.paperHi, outputs['mark-reverse.svg'], true)
  outputs['wordmark.svg'] = wordPath ? raw : buildOutlinedWordmark(name, P.ink)
  outputs['wordmark-reverse.svg'] = wordPath
    ? `${svgOpen(ww, wh, name)}<g fill="${P.paperHi}" color="${P.paperHi}">${inner}</g></svg>\n`
    : buildOutlinedWordmark(name, P.paperHi)
  if (wordPath) reportLockup = `built from ${wordPath}`
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
const isConstructedMark = CONSTRUCTED_CONCEPTS.has(concept)
for (const [file, content] of Object.entries(outputs)) {
  if (!file.endsWith('.svg')) continue
  if (/<text[\s>]/.test(content)) problems.push(`${file}: live <text>`)
  if (!/viewBox=/.test(content)) problems.push(`${file}: no viewBox`)
  if (!/<(path|circle|rect)/.test(content)) problems.push(`${file}: empty drawing`)
  const open = (content.match(/<(g|defs|clipPath|svg)[\s>]/g) || []).length
  const close = (content.match(/<\/(g|defs|clipPath|svg)>/g) || []).length
  if (open !== close) problems.push(`${file}: unbalanced tags (${open}/${close})`)
  if (isConstructedMark && (file === 'mark.svg' || file === 'mark-compact.svg' || file === 'glyph.svg')) {
    if (/<(circle|ellipse)[\s>]/.test(content)) problems.push(`${file}: constructed mark contains <circle>/<ellipse>`)
    if (/\bstroke=/.test(content)) problems.push(`${file}: constructed mark contains stroke=`)
  }
}
const weak = contrastPairs.filter((p) => p.ratio + 0.005 < p.min)

console.log(`brand-forge · ${name} · concept=${concept} · ${Object.keys(outputs).length} files → ${outDir}`)
console.log(`lockups: ${reportLockup}`)
for (const p of contrastPairs) console.log(`${p.ratio + 0.005 >= p.min ? 'PASS' : 'FAIL'}  ${p.label} ${p.ratio}:1 (min ${p.min})`)
for (const p of problems) console.log(`FAIL  ${p}`)
console.log('Next: judge sheet.html at 16px, then fill story.md TODOs. Mark compact is a separate drawing, check it alone.')
process.exit(problems.length || weak.length ? 1 : 0)
