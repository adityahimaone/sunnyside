#!/usr/bin/env node
/**
 * field-forge.mjs — Generate token-locked SVG hero backgrounds, gradient meshes,
 * dither/grain/grid overlays, and scrim/duotone CSS recipes from tokens.json.
 *
 * Zero dependencies. Runs in <100ms.
 *
 * Usage:
 *   node scripts/field-forge.mjs --slug porphyry [--recipe mesh|bands|grain|dither|glass|grid|all] [--root .]
 *   node scripts/field-forge.mjs --tokens features/jakarta/tokens.json --recipe bands --out public/brand/jakarta
 *   node scripts/field-forge.mjs --list
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { findTokens, readTokens } from './lib/tokens.mjs'

const RECIPES = ['mesh', 'bands', 'grain', 'dither', 'glass', 'grid']

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

if (has('list')) {
  console.log(RECIPES.join('\n'))
  process.exit(0)
}

const root = resolve(flag('root', '.'))
const slugArg = flag('slug', '')
const tokensArg = flag('tokens', '')
const recipeArg = flag('recipe', 'all')

if (!slugArg && !tokensArg) {
  console.error(`Usage:
  node scripts/field-forge.mjs --slug <slug> [--recipe mesh|bands|grain|dither|glass|grid|all] [--root .]
  node scripts/field-forge.mjs --tokens <path/to/tokens.json> [--recipe all] [--out public/brand/<slug>]`)
  process.exit(1)
}

const tokenPath = tokensArg ? resolve(root, tokensArg) : findTokens(root, slugArg)

if (!tokenPath || !existsSync(tokenPath)) {
  console.error(`field-forge: tokens file not found for ${tokensArg || slugArg}`)
  process.exit(1)
}

const norm = readTokens(tokenPath)
const slug = slugArg || (norm.name ? norm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'brand')
const ns = norm.namespace ? `--${norm.namespace}-` : `--${slug.slice(0, 2)}-`
const outDir = resolve(root, flag('out', join('public', 'brand', slug)))

// Extract key palette hexes from primitives
const byRole = {}
for (const p of norm.primitives) {
  const key = String(p.name || '').replace(/^--[a-z0-9]+-/, '').toLowerCase()
  if (/^#[0-9a-f]{6}$/i.test(p.hex)) byRole[key] = p.hex
}
const allHex = norm.primitives.map((p) => p.hex).filter((h) => /^#[0-9a-f]{6}$/i.test(h))
const pick = (...keys) => {
  for (const k of keys) if (byRole[k]) return byRole[k]
  return null
}

const ground = pick('ground', 'paper', 'cream', 'parchment', 'chalk', 'sand', 'stone', 'canvas', 'porcelain', 'bone', 'vellum', 'abyss', 'void', 'night') || allHex[0] || '#f5f1e8'
const plate = pick('plate', 'paper-hi', 'paperhi', 'white', 'ivory', 'card', 'surface', 'linen', 'alabaster', 'slate') || allHex[1] || '#ffffff'
const ink = pick('ink', 'charcoal', 'obsidian', 'void', 'slate', 'graphite', 'espresso', 'basalt', 'pine', 'ivory') || allHex[2] || '#161822'
const muted = pick('muted', 'ash', 'dust', 'pewter', 'umber', 'secondary') || allHex[3] || '#606476'
const wash = pick('wash', 'tint', 'mist', 'sage', 'foam', 'blush') || allHex[4] || ground
const signal = pick('signal', 'accent', 'cobalt', 'vermilion', 'amber', 'gold', 'emerald', 'terracotta', 'crimson', 'rust', 'copper', 'cyan', 'lime') || allHex[allHex.length - 1] || '#d84b2a'

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

function mixHex(a, b, t = 0.5) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const enc = (v) => Math.round(v).toString(16).padStart(2, '0')
  return `#${enc(r1 + (r2 - r1) * t)}${enc(g1 + (g2 - g1) * t)}${enc(b1 + (b2 - b1) * t)}`
}

const generators = {
  /**
   * 1. MESH — Multi-stop atmospheric radial gradient mesh (Ledger / Vitrine style)
   */
  mesh() {
    const mid = mixHex(ground, signal, 0.22)
    const deep = mixHex(ground, ink, 0.14)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${norm.name} mesh field">
  <defs>
    <radialGradient id="${slug}-mesh-a" cx="78%" cy="22%" r="62%">
      <stop offset="0%" stop-color="${signal}" stop-opacity="0.28"/>
      <stop offset="52%" stop-color="${mid}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${ground}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${slug}-mesh-b" cx="18%" cy="82%" r="68%">
      <stop offset="0%" stop-color="${wash}" stop-opacity="0.65"/>
      <stop offset="60%" stop-color="${deep}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${ground}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${slug}-mesh-base" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${plate}"/>
      <stop offset="55%" stop-color="${ground}"/>
      <stop offset="100%" stop-color="${wash}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#${slug}-mesh-base)"/>
  <rect width="1600" height="1000" fill="url(#${slug}-mesh-b)"/>
  <rect width="1600" height="1000" fill="url(#${slug}-mesh-a)"/>
</svg>\n`
  },

  /**
   * 2. BANDS — Stepped hard-stop diagonal colour bands at 112° (Jakarta style)
   */
  bands() {
    const stops = [
      mixHex(ink, ground, 0.08),
      mixHex(ink, signal, 0.22),
      mixHex(ink, signal, 0.42),
      mixHex(signal, ink, 0.35),
      signal,
      mixHex(signal, plate, 0.25),
      mixHex(signal, wash, 0.48),
      wash,
      mixHex(wash, ground, 0.5),
      ground,
    ]
    const n = stops.length
    const bandW = 2200 / n
    const rects = stops
      .map((col, i) => `<rect x="${Math.round(i * bandW - 300)}" y="-300" width="${Math.ceil(bandW + 2)}" height="1600" fill="${col}"/>`)
      .join('\n    ')
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${norm.name} stepped bands field">
  <rect width="1600" height="1000" fill="${ground}"/>
  <g transform="rotate(-22 800 500)">
    ${rects}
  </g>
</svg>\n`
  },

  /**
   * 3. GRAIN — Tactile paper fractalNoise + 15px halftone dot matrix (Sunnyside / Riso style)
   */
  grain() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${norm.name} paper grain and halftone field">
  <defs>
    <pattern id="${slug}-dots" width="15" height="15" patternUnits="userSpaceOnUse">
      <circle cx="7.5" cy="7.5" r="1.25" fill="${ink}" fill-opacity="0.09"/>
    </pattern>
    <radialGradient id="${slug}-sun-wash" cx="76%" cy="24%" r="58%">
      <stop offset="0%" stop-color="${signal}" stop-opacity="0.22"/>
      <stop offset="65%" stop-color="${wash}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${ground}" stop-opacity="0"/>
    </radialGradient>
    <filter id="${slug}-paper-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" in="noise" result="grain"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="${ground}"/>
  <rect width="1600" height="1000" fill="url(#${slug}-sun-wash)"/>
  <rect width="1600" height="1000" fill="url(#${slug}-dots)"/>
  <rect width="1600" height="1000" filter="url(#${slug}-paper-grain)"/>
</svg>\n`
  },

  /**
   * 4. DITHER — Ordered 4×4 Bayer dither dissolve matrix (Huginn / Hachure / Vitrine style)
   */
  dither() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${norm.name} ordered Bayer dither field">
  <defs>
    <pattern id="${slug}-bayer-dense" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="${ground}"/>
      <path d="M0 0h2v2H0zM4 0h2v2H4zM2 2h2v2H2zM6 2h2v2H6zM0 4h2v2H0zM4 4h2v2H4zM2 6h2v2H2zM6 6h2v2H6z" fill="${wash}"/>
      <path d="M0 0h2v2H0zM4 4h2v2H4z" fill="${signal}" fill-opacity="0.28"/>
    </pattern>
    <pattern id="${slug}-bayer-sparse" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M0 0h2v2H0zM8 8h2v2H8z" fill="${ink}" fill-opacity="0.12"/>
      <path d="M8 0h2v2H8zM0 8h2v2H0z" fill="${signal}" fill-opacity="0.22"/>
    </pattern>
    <linearGradient id="${slug}-dither-fade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${ground}" stop-opacity="0.15"/>
      <stop offset="68%" stop-color="${ground}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${ground}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#${slug}-bayer-dense)"/>
  <rect width="1600" height="1000" fill="url(#${slug}-bayer-sparse)"/>
  <rect width="1600" height="1000" fill="url(#${slug}-dither-fade)"/>
</svg>\n`
  },

  /**
   * 5. GLASS — 158deg sea-glass / painted-glass pane + specular top edge (Strand / Clearing style)
   */
  glass() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${norm.name} glass and atmospheric horizon field">
  <defs>
    <linearGradient id="${slug}-glass-sky" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="${plate}"/>
      <stop offset="52%" stop-color="${ground}"/>
      <stop offset="100%" stop-color="${wash}"/>
    </linearGradient>
    <linearGradient id="${slug}-glass-pane" x1="0%" y1="0%" x2="38%" y2="100%">
      <stop offset="0%" stop-color="${plate}" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="${wash}" stop-opacity="0.46"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#${slug}-glass-sky)"/>
  <circle cx="1180" cy="280" r="340" fill="${signal}" fill-opacity="0.18"/>
  <circle cx="420" cy="740" r="420" fill="${wash}" fill-opacity="0.55"/>
  <rect x="140" y="120" width="1320" height="760" rx="24" fill="url(#${slug}-glass-pane)" stroke="${plate}" stroke-width="1.5"/>
  <line x1="164" y1="121" x2="1436" y2="121" stroke="${plate}" stroke-width="2" stroke-opacity="0.9"/>
</svg>\n`
  },

  /**
   * 6. GRID — Architectural / harbor survey hairline grid + crosshair registration ticks (Ledger / Hachure style)
   */
  grid() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${norm.name} architectural survey grid field">
  <defs>
    <pattern id="${slug}-subgrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${ink}" stroke-width="0.5" stroke-opacity="0.06"/>
    </pattern>
    <pattern id="${slug}-majgrid" width="200" height="200" patternUnits="userSpaceOnUse">
      <rect width="200" height="200" fill="url(#${slug}-subgrid)"/>
      <path d="M 200 0 L 0 0 0 200" fill="none" stroke="${ink}" stroke-width="1" stroke-opacity="0.12"/>
      <path d="M -6 0 L 6 0 M 0 -6 L 0 6" fill="none" stroke="${signal}" stroke-width="1.5" stroke-opacity="0.55"/>
    </pattern>
  </defs>
  <rect width="1600" height="1000" fill="${ground}"/>
  <rect width="1600" height="1000" fill="url(#${slug}-majgrid)"/>
  <line x1="0" y1="200" x2="1600" y2="200" stroke="${signal}" stroke-width="1" stroke-opacity="0.35"/>
</svg>\n`
  },
}

const selected = recipeArg === 'all' ? RECIPES : [recipeArg]
for (const r of selected) {
  if (!generators[r]) {
    console.error(`field-forge: unknown recipe "${r}". Choose from: ${RECIPES.join(', ')}, all`)
    process.exit(1)
  }
}

await mkdir(outDir, { recursive: true })
const written = []
for (const r of selected) {
  const file = `field-${r}.svg`
  await writeFile(join(outDir, file), generators[r](), 'utf8')
  written.push(file)
}

// Also write a ready-to-use CSS helper file with scrim, duotone photo filter, and background utility classes
const defaultRecipe = selected[0] || 'mesh'
const cssContent = `/* ${norm.name} — Field, Gradient, Scrim & Duotone Surface Recipes
   Generated by scripts/field-forge.mjs from tokens.json (${ns}). */

.fieldStage {
  position: relative;
  overflow: hidden;
  background-color: var(${ns}surface-page, ${ground});
  background-image: url('/brand/${slug}/field-${defaultRecipe}.svg');
  background-size: cover;
  background-position: center;
}

/* Measured reading scrim — guarantees >= 4.5:1 over busy fields or photography */
.fieldScrim {
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(${ns}surface-page, ${ground}) 32%, transparent) 0%,
    color-mix(in oklab, var(${ns}surface-page, ${ground}) 86%, transparent) 72%,
    var(${ns}surface-page, ${ground}) 100%
  );
}

/* Solid reading plate — paragraphs >= 3 lines must sit on an opaque plate */
.readingPlate {
  background: var(${ns}surface-plate, ${plate});
  color: var(${ns}text-primary, ${ink});
  border: 1px solid color-mix(in oklab, var(${ns}text-primary, ${ink}) 12%, transparent);
}

/* Token-locked duotone photo treatment (use on stock photography from assets.mjs) */
.photoDuotone {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: var(${ns}ink, ${ink});
}

.photoDuotone img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.12);
  mix-blend-mode: luminosity;
  opacity: 0.88;
}

.photoDuotone::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(${ns}surface-page, ${ground}) 72%, transparent),
    color-mix(in oklab, var(${ns}accent, ${signal}) 24%, transparent)
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}
`

const cssFile = `${slug}-field.css`
await writeFile(join(outDir, cssFile), cssContent, 'utf8')
written.push(cssFile)

console.log(`field-forge · ${norm.name} (${slug}) · ${written.length} files → ${outDir}`)
for (const f of written) console.log(`  + ${f}`)
