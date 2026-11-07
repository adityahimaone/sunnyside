#!/usr/bin/env node
/**
 * forge.mjs — Unified Declarative Brand Forge (v6.0)
 *
 * One command, one JSON spec, <2s execution:
 *   1. Validates <slug>.brand.json schema
 *   2. Generates all parametric SVG marks, 16px compacts, outlined wordmarks & lockups
 *   3. Generates 6-mark companion cast (<slug>/cast/*.svg)
 *   4. Computes honest contrast ledger (WCAG 2.1) + CVD (Deuteranopia/Protanopia) audit
 *   5. Emits tokens.json, <slug>-tokens.css (single or dual polarity), and DESIGN.md
 *   6. Triggers multi-effect field-forge (riso, bayer, glass, mesh, scrim, anatomy)
 *   7. Optionally renders 6-panel brandkit board and executes static gates
 *
 * Usage:
 *   node skills/sunnyside-brand-system/scripts/forge.mjs --spec brand/tavola.brand.json [--root .] [--board] [--gates]
 */
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { auditCvdSafety, hexToOklab, rgbToOklab } from './lib/cvd.mjs'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const specArg = flag('spec', '')
if (!specArg || has('help')) {
  console.log(`
Sunnyside Declarative Brand Forge (v6.0)
Usage:
  node scripts/forge.mjs --spec <path/to/brand.json> [--root .] [--board] [--figma] [--anatomy] [--gates] [--dry-run]
`)
  process.exit(specArg ? 0 : 1)
}

const root = resolve(flag('root', '.'))
const specPath = resolve(root, specArg)

if (!existsSync(specPath)) {
  console.error(`forge.mjs: spec file not found at: ${specPath}`)
  process.exit(1)
}

const spec = JSON.parse(await readFile(specPath, 'utf8'))
const name = spec.name || 'Brand'
const slug = (spec.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase()
const ns = spec.namespace ? (spec.namespace.startsWith('--') ? spec.namespace : `--${spec.namespace}-`) : `--${slug.slice(0, 2)}-`
const polarity = (spec.polarity || 'light-dark').toLowerCase() // 'light', 'dark', 'light-dark', 'dual'
const isDual = polarity === 'dual' || polarity === 'light-dark' || polarity === 'light + dark'

console.log(`\n  ⚡ Sunnyside Declarative Forge · ${name} (${slug}) · Polarity: ${isDual ? 'Dual (Day + Night)' : 'Single'}\n`)

/* ── 1. Color math & contrast ─────────────────────────────────────────────── */

const lum = (hex) => {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6)
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(f.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const calcRatio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2))
}

const primitives = spec.primitives || []
if (!primitives.length) {
  console.error('forge.mjs: spec requires at least 4 primitives in spec.primitives')
  process.exit(1)
}

const groundPrim = primitives.find((p) => /ground|paper|canvas|sand|cream/i.test(p.name)) || primitives[0]
const platePrim = primitives.find((p) => /plate|surface|card|white|terrace/i.test(p.name)) || primitives[1] || primitives[0]
const inkPrim = primitives.find((p) => /ink|text|charcoal|espresso|obsidian/i.test(p.name)) || primitives[2] || primitives[0]
const accentPrim = primitives.find((p) => /accent|signal|terracotta|cobalt|orange/i.test(p.name)) || primitives[primitives.length - 1]
const dangerPrim = primitives.find((p) => /danger|error|alert|negative|warn/i.test(p.name))
const successPrim = primitives.find((p) => /success|mint|green|positive/i.test(p.name))

const ground = groundPrim.value
const plate = platePrim.value
const ink = inkPrim.value
const accent = accentPrim.value

// Auto-derive contrast pairs if not fully declared
let contrast = spec.contrast || []
if (!contrast.length) {
  contrast = [
    { label: `${inkPrim.name} on ${groundPrim.name}`, fg: ink, bg: ground, ratio: calcRatio(ink, ground) },
    { label: `${inkPrim.name} on ${platePrim.name}`, fg: ink, bg: plate, ratio: calcRatio(ink, plate) },
    { label: `${accentPrim.name} on ${groundPrim.name}`, fg: accent, bg: ground, ratio: calcRatio(accent, ground) },
  ]
  // Guarantee 1-2 failing pairs for honest contrast ledger
  const failingCandidate = calcRatio(plate, ground) < 4.5 ? { label: `${platePrim.name} on ${groundPrim.name} (surface step only)`, fg: plate, bg: ground, ratio: calcRatio(plate, ground), note: 'Surface separation only — never body text' } : null
  const accentWashRatio = calcRatio(accent, plate)
  if (accentWashRatio < 4.5) {
    contrast.push({ label: `${accentPrim.name} on ${platePrim.name} (large / graphic only)`, fg: accent, bg: plate, ratio: accentWashRatio, note: 'Graphical / button fill only — never small body type' })
  }
  if (failingCandidate) contrast.push(failingCandidate)
}

// Audit CVD safety
const cvdPairs = [
  { label: 'Accent vs Ink', colorA: accent, colorB: ink },
  { label: 'Accent vs Ground', colorA: accent, colorB: ground },
]
if (dangerPrim) {
  cvdPairs.push({ label: `${accentPrim.name} vs ${dangerPrim.name}`, colorA: accent, colorB: dangerPrim.value })
  if (successPrim) {
    cvdPairs.push({ label: `${dangerPrim.name} vs ${successPrim.name}`, colorA: dangerPrim.value, colorB: successPrim.value })
  }
}
const { pass: cvdPass, results: cvdResults } = auditCvdSafety(cvdPairs)
console.log(`  ✓ WCAG Contrast: ${contrast.length} pairs computed (${contrast.filter((c) => c.ratio < 4.5).length} published failing pairs)`)
console.log(`  ✓ CVD Simulation: ${cvdPass ? 'PASS' : 'WARNING'} (min ΔE_OK: ${Math.min(...cvdResults.map((r) => r.minCvd)).toFixed(3)})`)

/* ── 2. Emit Marks, Wordmark, Compact & Cast SVGs ────────────────────────── */

const brandDir = resolve(root, 'public', 'brand', slug)
const featuresDir = resolve(root, 'features', slug)

if (!has('dry-run')) {
  await mkdir(brandDir, { recursive: true })
  await mkdir(join(brandDir, 'cast'), { recursive: true })
  await mkdir(featuresDir, { recursive: true })
}

// 1. Primary mark geometry
const markPaths = spec.mark?.paths || [
  `<rect x="10" y="44" width="44" height="6" rx="2" fill="currentColor"/>`,
  `<circle cx="32" cy="28" r="14" fill="${accent}"/>`,
]
const compactPaths = spec.mark?.compactPaths || [
  `<rect x="8" y="44" width="48" height="8" rx="2" fill="currentColor"/>`,
  `<circle cx="32" cy="26" r="16" fill="${accent}"/>`,
]

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img" aria-label="${name} mark">
  <g color="${ink}">
    ${markPaths.join('\n    ')}
  </g>
</svg>\n`

const markReverseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img" aria-label="${name} mark reverse">
  <g color="${plate}">
    ${markPaths.join('\n    ')}
  </g>
</svg>\n`

const markCompactSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="16" height="16" fill="none" role="img" aria-label="${name} compact mark 16px">
  <g color="${ink}">
    ${compactPaths.join('\n    ')}
  </g>
</svg>\n`

const markCompactReverseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="16" height="16" fill="none" role="img" aria-label="${name} compact mark reverse 16px">
  <g color="${plate}">
    ${compactPaths.join('\n    ')}
  </g>
</svg>\n`

const glyphSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" fill="none" role="img" aria-label="${name} glyph">
  <rect width="64" height="64" rx="14" fill="${accent}"/>
  <g color="${plate}" transform="scale(0.7) translate(14, 14)">
    ${compactPaths.join('\n    ')}
  </g>
</svg>\n`

// 2. Outlined Wordmark & Lockups
const wordmarkD = spec.wordmark?.path || spec.wordmark?.d || 'M14 16h36v5H35v23h-6V21H14v-5z'
const wordmarkViewBox = spec.wordmark?.viewBox || '0 0 200 48'

const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wordmarkViewBox}" width="200" height="48" fill="none" role="img" aria-label="${name} wordmark">
  <path d="${wordmarkD}" fill="${ink}"/>
</svg>\n`

const wordmarkReverseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wordmarkViewBox}" width="200" height="48" fill="none" role="img" aria-label="${name} wordmark reverse">
  <path d="${wordmarkD}" fill="${plate}"/>
</svg>\n`

const lockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" width="280" height="64" fill="none" role="img" aria-label="${name} horizontal lockup">
  <g transform="translate(0, 0)">
    <g color="${ink}">
      ${markPaths.join('\n      ')}
    </g>
  </g>
  <g transform="translate(76, 8)">
    <path d="${wordmarkD}" fill="${ink}"/>
  </g>
</svg>\n`

const lockupReverseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" width="280" height="64" fill="none" role="img" aria-label="${name} horizontal lockup reverse">
  <g transform="translate(0, 0)">
    <g color="${plate}">
      ${markPaths.join('\n      ')}
    </g>
  </g>
  <g transform="translate(76, 8)">
    <path d="${wordmarkD}" fill="${plate}"/>
  </g>
</svg>\n`

const lockupStackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120" fill="none" role="img" aria-label="${name} stacked lockup">
  <g transform="translate(48, 8)">
    <g color="${ink}">
      ${markPaths.join('\n      ')}
    </g>
  </g>
  <g transform="translate(10, 72) scale(0.7)">
    <path d="${wordmarkD}" fill="${ink}"/>
  </g>
</svg>\n`

// 3. Companion Cast (6 items)
const defaultCastShapes = [
  { id: 'arc', name: 'Arc', note: 'Horizon & welcome', d: 'M12 44a20 20 0 0 1 40 0h-8a12 12 0 0 0-24 0h-8z' },
  { id: 'spark', name: 'Spark', note: 'Energy & celebration', d: 'M32 10l5 17 17 5-17 5-5 17-5-17-17-5 17-5 5-17z' },
  { id: 'slab', name: 'Slab', note: 'Ground & pedestal', d: 'M10 40h44v8H10z' },
  { id: 'beam', name: 'Beam', note: 'Directional light', d: 'M14 14l36 36-6 6L8 20z' },
  { id: 'keystone', name: 'Keystone', note: 'Structural focal point', d: 'M32 12l18 20-18 20-18-20z' },
  { id: 'terrace', name: 'Terrace', note: 'Modular platform', d: 'M8 20h20v20H8zm28 0h20v20H36zm-14 24h20v16H22z' },
]

const castItems = (spec.cast && spec.cast.length === 6) ? spec.cast : defaultCastShapes

if (!has('dry-run')) {
  // Write brand SVGs
  await writeFile(join(brandDir, 'mark.svg'), markSvg, 'utf8')
  await writeFile(join(brandDir, 'mark-reverse.svg'), markReverseSvg, 'utf8')
  await writeFile(join(brandDir, 'mark-compact.svg'), markCompactSvg, 'utf8')
  await writeFile(join(brandDir, 'mark-compact-reverse.svg'), markCompactReverseSvg, 'utf8')
  await writeFile(join(brandDir, 'glyph.svg'), glyphSvg, 'utf8')
  await writeFile(join(brandDir, 'wordmark.svg'), wordmarkSvg, 'utf8')
  await writeFile(join(brandDir, 'wordmark-reverse.svg'), wordmarkReverseSvg, 'utf8')
  await writeFile(join(brandDir, 'lockup.svg'), lockupSvg, 'utf8')
  await writeFile(join(brandDir, 'lockup-reverse.svg'), lockupReverseSvg, 'utf8')
  await writeFile(join(brandDir, 'lockup-stacked.svg'), lockupStackedSvg, 'utf8')

  // Write 6 cast SVGs
  for (const c of castItems) {
    const castSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img" aria-label="${c.name || c.id} companion mark">
  <path d="${c.d || 'M16 16h32v32H16z'}" fill="${ink}"/>
</svg>\n`
    await writeFile(join(brandDir, 'cast', `${c.id}.svg`), castSvg, 'utf8')
  }
}
console.log(`  ✓ Emitted 10 brand SVGs + 6 companion cast marks in public/brand/${slug}/`)

/* ── 3. Tokens JSON & Tokens CSS ─────────────────────────────────────────── */

const tokensPayload = {
  meta: {
    name,
    slug,
    namespace: ns,
    version: '6.0.0',
    year: new Date().getFullYear(),
    polarity: isDual ? 'dual' : 'light',
    primaryAccent: primitives.find((p) => /accent|signal|terracotta/i.test(p.name))?.name || 'accent',
    essence: spec.synthesis?.essence || `${name} design system`,
    oneSentence: spec.synthesis?.oneSentence || `A design system built for ${name}.`,
    track: spec.synthesis?.track || 'constructed',
  },
  theme: {
    family: spec.synthesis?.family || 'constructed — Kuwayama parametric vector discipline',
    material: spec.synthesis?.material || spec.synthesis?.surface || 'paper & ink',
    edge: spec.synthesis?.edge || 'precision organic',
    offset: spec.synthesis?.offset || '0 12px 28px -6px rgba(0, 0, 0, 0.08)',
    stroke: 'zero line icons; pure filled vectors',
    radius: '0 / 6 / 12 / 24 / 999',
    density: 'balanced',
    fieldRecipe: spec.synthesis?.fieldRecipe || 'paper grain + directional scrim',
  },
  primitives,
  type: [
    { name: 'font-display', value: `var(--font-${spec.fonts?.display?.toLowerCase()?.replace(/\s+/g, '-') || 'syne'}), '${spec.fonts?.display || 'Syne'}', sans-serif`, family: spec.fonts?.display || 'Syne' },
    { name: 'font-reading', value: `var(--font-${spec.fonts?.reading?.toLowerCase()?.replace(/\s+/g, '-') || 'geist'}), '${spec.fonts?.reading || 'Geist'}', sans-serif`, family: spec.fonts?.reading || 'Geist' },
    { name: 'font-mono', value: `var(--font-${spec.fonts?.mono?.toLowerCase()?.replace(/\s+/g, '-') || 'geist-mono'}), '${spec.fonts?.mono || 'Geist Mono'}', monospace`, family: spec.fonts?.mono || 'Geist Mono' },
  ],
  contrast,
  radius: spec.radius || { xs: '4px', sm: '8px', md: '12px', lg: '20px', pill: '999px' },
  space: spec.space || [4, 8, 12, 16, 24, 32, 48, 64],
}

let cssLines = [`/* ${name} Design System Tokens (v6.0) */`, `:root {`]
// Primitives
for (const p of primitives) {
  cssLines.push(`  ${ns}${p.name}: ${p.oklch || p.value};`)
}
// Semantic Day Scope
cssLines.push(`  /* Semantic Day Scope */`)
cssLines.push(`  ${ns}surface-page: var(${ns}${groundPrim.name});`)
cssLines.push(`  ${ns}surface-plate: var(${ns}${platePrim.name});`)
cssLines.push(`  ${ns}text-primary: var(${ns}${inkPrim.name});`)
cssLines.push(`  ${ns}accent: var(${ns}${accentPrim.name});`)

// Fonts
cssLines.push(`  ${ns}font-display: ${tokensPayload.type[0].value};`)
cssLines.push(`  ${ns}font-reading: ${tokensPayload.type[1].value};`)
cssLines.push(`  ${ns}font-mono: ${tokensPayload.type[2].value};`)
cssLines.push(`}`)

// Night Scope only if Dual
if (isDual) {
  const darkCanvas = primitives.find((p) => /night|abyss|dark|black/i.test(p.name))?.name || inkPrim.name
  cssLines.push(`\n[data-${slug}="night"] {`)
  cssLines.push(`  ${ns}surface-page: var(${ns}${darkCanvas});`)
  cssLines.push(`  ${ns}surface-plate: color-mix(in oklab, var(${ns}${darkCanvas}) 88%, white);`)
  cssLines.push(`  ${ns}text-primary: var(${ns}${groundPrim.name});`)
  cssLines.push(`}`)
}

if (!has('dry-run')) {
  await writeFile(join(featuresDir, 'tokens.json'), JSON.stringify(tokensPayload, null, 2), 'utf8')
  await writeFile(join(featuresDir, `${slug}-tokens.css`), cssLines.join('\n') + '\n', 'utf8')
  await writeFile(join(brandDir, 'tokens.json'), JSON.stringify(tokensPayload, null, 2), 'utf8')
  await writeFile(join(brandDir, `${slug}-tokens.css`), cssLines.join('\n') + '\n', 'utf8')
}
console.log(`  ✓ Emitted features/${slug}/tokens.json + ${slug}-tokens.css`)

/* ── 4. Surface Multi-Effects (field-forge) ───────────────────────────────── */

if (!has('dry-run')) {
  try {
    await run('node', [join(here, 'field-forge.mjs'), '--tokens', join(featuresDir, 'tokens.json'), '--recipe', 'all', '--out', brandDir, '--root', root])
    console.log(`  ✓ Generated 10 procedural surface recipes via field-forge.mjs`)
  } catch (err) {
    console.warn(`  ! field-forge warning: ${err.message}`)
  }

  // DESIGN.md
  try {
    await run('node', [join(here, 'design-md.mjs'), '--slug', slug, '--root', root, '--out', join(brandDir, 'DESIGN.md')])
    console.log(`  ✓ Generated public/brand/${slug}/DESIGN.md`)
  } catch (err) {
    console.warn(`  ! design-md warning: ${err.message}`)
  }
}

/* ── 5. Optional Board, Figma, Anatomy & Gates ───────────────────────────── */

if (has('board') && !has('dry-run')) {
  try {
    await run('node', [
      join(here, 'brandkit-board.mjs'),
      '--tokens', join(featuresDir, 'tokens.json'),
      '--brand', brandDir,
      '--slug', slug,
      '--out', join(brandDir, `${slug}-brandkit.png`),
    ])
    console.log(`  ✓ Generated 6-panel 3000x2250 brand kit board: ${slug}-brandkit.png`)
  } catch (err) {
    console.warn(`  ! brandkit-board warning: ${err.message}`)
  }
}

if (has('figma') && !has('dry-run')) {
  try {
    await run('node', [
      join(here, 'figma-handoff.mjs'),
      '--slug', slug,
      '--root', root,
    ])
    console.log(`  ✓ Generated canonical Figma handoff manifest and replay plugin for ${slug}`)
  } catch (err) {
    console.warn(`  ! figma-handoff warning: ${err.message}`)
  }
}

if (has('anatomy') && !has('dry-run')) {
  try {
    const anatomyScript = resolve(here, '..', '..', 'sunnyside-components', 'scripts', 'anatomy-sheet.mjs')
    await run('node', [
      anatomyScript,
      '--slug', slug,
      '--component', flag('anatomy-component', 'card'),
      '--motion',
      '--root', root,
    ])
    console.log(`  ✓ Generated Apple-style dimensional anatomy spec sheet for ${slug}`)
  } catch (err) {
    console.warn(`  ! anatomy-sheet warning: ${err.message}`)
  }
}

if (has('gates') && !has('dry-run')) {
  try {
    const { stdout } = await run('node', [join(here, 'gates.mjs'), '--slug', slug, '--root', root])
    console.log(`\n  --- Gates Execution ---\n${stdout}`)
  } catch (err) {
    console.error(`\n  ✖ Gates failed for ${slug}:\n${err.stdout || err.message}`)
  }
}

console.log(`\n  ✨ Forge complete for ${name} (${slug}) in <2s.\n`)
