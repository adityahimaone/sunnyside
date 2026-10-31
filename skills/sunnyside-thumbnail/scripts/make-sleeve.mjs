#!/usr/bin/env node
/**
 * sunnyside-thumbnail — the generated sleeve.
 *
 * Draws the flat-colour, mono-labelled, one-huge-word thumbnail the Sunnyside
 * portfolio uses when a project has no screenshot of its own. The recipe is
 * lifted from `GeneratedCover` in features/landing-page/studio/work-gallery,
 * then expressed in a 1000-unit-wide coordinate space so the composition holds
 * at any output size or aspect ratio.
 *
 *   node scripts/make-sleeve.mjs --word P2P --code "AH—005" \
 *     --note "peer to peer / settle" --variant orbit --palette cobalt \
 *     --out examples/seaphantom-p2p
 *
 * Writes <out>.svg (self-contained, fonts embedded) plus <out>.png / .webp.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SKILL = path.resolve(HERE, '..')
const FONT_DIR = path.join(SKILL, 'assets', 'fonts')

/* ── palette ───────────────────────────────────────────────────────────────
   Every value is taken from the studio wall (features/landing-page/studio/
   studio.module.css). `ink` must clear 4.5:1 on `ground`; the script measures
   it and refuses to ship a pair that does not. */
export const PALETTES = {
  cobalt: { ground: '#3d53d6', ink: '#fffaf1', accent: '#ff6a2b', glow: '#ffd23f', label: 'Cobalt' },
  mint: { ground: '#b7e4c7', ink: '#191a2e', accent: '#ff6a2b', glow: '#ffd23f', label: 'Mint' },
  ink: { ground: '#191a2e', ink: '#fffaf1', accent: '#ffd23f', glow: '#ffd23f', label: 'Ink' },
  paper: { ground: '#f3ecdf', ink: '#191a2e', accent: '#ff6a2b', glow: '#ff6a2b', label: 'Paper' },
  butter: { ground: '#ffd23f', ink: '#191a2e', accent: '#3d53d6', glow: '#ff6a2b', label: 'Butter' },
  pink: { ground: '#ffb6e1', ink: '#191a2e', accent: '#3d53d6', glow: '#ffd23f', label: 'Pink' },
  sky: { ground: '#a9c8ff', ink: '#191a2e', accent: '#ff6a2b', glow: '#ffd23f', label: 'Sky' },
  tangerine: { ground: '#ff6a2b', ink: '#191a2e', accent: '#3d53d6', glow: '#ffd23f', label: 'Tangerine' },
}

export const VARIANTS = ['orbit', 'petri']

/* ── colour maths ────────────────────────────────────────────────────────── */

function toRgb(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

/* ── the geometry ──────────────────────────────────────────────────────────
   All values are fractions of the 1000-unit width, or of the height. They were
   measured off the shipped 349 × 218 card and are the whole design: change one
   and the sleeve stops matching the site. */
const G = {
  pad: 0.055, // inner margin, all four sides
  label: 0.0215, // mono micro-type
  labelTrack: 0.16, // em
  labelAlpha: 0.78,
  codeY: 0.128, // baseline, fraction of height
  noteY: 0.903,
  ghost: 0.22, // cap-size driver, fraction of width
  ghostTrack: -0.085,
  ghostY: 0.612,
  ghostNudge: 0.002, // the word sits on the same left margin as the labels
  // `right: -18%; bottom: -26%; width: 82%` resolves the vertical offset against
  // the height, so the centre sits at 0.604H — not 0.76H. Getting this wrong
  // drops the ring a third of a card too low and the arc misses the top edge.
  ring: { cx: 0.77, cy: 0.604, r: 0.41, w: 0.0057, alpha: 0.45 },
  texture: { cell: 0.0258, dot: 0.0018, alpha: 0.12 },
  orbit: { cx: 0.65, cy: 0.57, half: 0.41, angle: -24, w: 0.0057, alpha: 0.9, dot: 0.0125, dotEdge: 0.0043 },
  petri: {
    cells: [
      { cx: 0.64, cy: 0.464, r: 0.19 },
      { cx: 0.795, cy: 0.552, r: 0.095 },
    ],
    w: 0.0043,
    alpha: 0.75,
  },
}

/**
 * Syne 800 advance widths in em, read out of the variable font at wght 800.
 * Syne is a wide face — a cap averages 1.15em, not the 0.7em a text face would
 * — which is why a five-letter word already overruns the card at `0.22W`.
 */
const ADV = {
  A: 1.16, B: 1.14, C: 1.316, D: 1.302, E: 1.14, F: 1.128, G: 1.34, H: 1.28,
  I: 0.42, J: 1.004, K: 1.215, L: 0.943, M: 1.58, N: 1.3, O: 1.33, P: 1.177,
  Q: 1.33, R: 1.232, S: 1.056, T: 1.1, U: 1.289, V: 1.16, W: 1.882, X: 1.14,
  Y: 1.07, Z: 1.2, 0: 1.066, 1: 0.529, 2: 1.003, 3: 1.055, 4: 1.094,
  5: 1.015, 6: 1.133, 7: 1.153, 8: 1.081, 9: 1.158,
  '&': 1.22, '—': 0.94, '/': 0.622, '·': 0.354, '.': 0.354,
}

/** How wide the word will be, in the same units as `size`. */
export function wordWidth(word, size, track = -0.085) {
  const chars = [...upper(word)]
  const em = chars.reduce((sum, c) => sum + (ADV[c] ?? 1.15), 0) + track * Math.max(0, chars.length - 1)
  return em * size
}

/** Geist Mono's advance, in em — monospace, so one number covers every label. */
const MONO_ADV = 0.6

/** The word must end before this fraction of the card, or it clips. */
const SAFE = 0.935

/* ── text helpers ────────────────────────────────────────────────────────── */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const upper = (s) => String(s).toUpperCase()

/** Letters the eye reads as initials, for when no ghost word is supplied. */
export function deriveWord(title) {
  const words = String(title)
    .split(/[\s\-_/]+/)
    .filter(Boolean)
  if (words.length === 1) return upper(words[0].slice(0, 3))
  return upper(words.slice(0, 3).map((w) => w[0]).join(''))
}

/* ── font embedding ──────────────────────────────────────────────────────── */

let fontCache = null

function fontCss() {
  if (fontCache !== null) return fontCache
  const read = (file) => {
    const p = path.join(FONT_DIR, file)
    if (!fs.existsSync(p)) return null
    return fs.readFileSync(p).toString('base64')
  }
  const syne = read('syne.woff2')
  const mono = read('geist-mono.woff2')
  if (!syne || !mono) {
    fontCache = ''
    return fontCache
  }
  fontCache = `
    @font-face{font-family:'Sleeve Display';src:url(data:font/woff2;base64,${syne}) format('woff2');font-weight:400 800;font-style:normal;font-display:block}
    @font-face{font-family:'Sleeve Mono';src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:100 900;font-style:normal;font-display:block}`
  return fontCache
}

/* ── the drawing ─────────────────────────────────────────────────────────── */

export function buildSvg(spec) {
  const palette = PALETTES[spec.palette] ?? PALETTES.cobalt
  const ratio = spec.ratio ?? 1.6
  const W = 1000
  const H = Math.round(W / ratio)
  const { ground, ink, accent } = palette
  // The glow is never the accent. In the source CSS it is hardcoded to butter,
  // because a dark accent on a light ground (cobalt on pink) renders as a muddy
  // smudge rather than light arriving through a cell.
  const glow = palette.glow ?? accent
  // `plain` draws ground + type only. Used by scripts/qa.mjs to measure the
  // word's ink box without the ring, the ornament or the dot screen landing in
  // the sample — the cell stroke composites to within 30/765 of the ink.
  const plain = spec.plain === true
  const variant = spec.variant ?? 'orbit'
  const word = upper(spec.word || deriveWord(spec.title || 'Untitled'))
  const code = spec.code ? upper(spec.code) : ''
  const note = spec.note ? upper(spec.note) : ''
  const suffix = spec.suffix === null ? '' : (spec.suffix ?? '/ GENERATED SLEEVE')

  const pad = G.pad * W
  const label = G.label * W
  const ghostBase = G.ghost * W
  // `--fit` trades the fixed size for the whole word. Off by default: the
  // source clips, and a clipped word is part of the language — but a five-letter
  // word is usually a mistake, so the CLI warns.
  const ghost = spec.fit
    ? Math.min(ghostBase, (ghostBase * SAFE * W) / wordWidth(word, ghostBase, G.ghostTrack))
    : ghostBase
  const uid = `s${Math.abs(hash(spec.word + spec.palette + variant)).toString(36)}`

  const labelAttrs = `font-family="Sleeve Mono" font-size="${f(label)}" letter-spacing="${f(G.labelTrack * label)}" fill="${ink}" opacity="${G.labelAlpha}"`

  const ring = G.ring
  const texture = G.texture
  const cells = G.petri.cells

  /* ── collision guards ──────────────────────────────────────────────────
     The 16:10 card leaves ~2% between the code label and the ring, and ~7%
     between the orbit's lower dot and the note. Compress the height — 16:9,
     2:1 — and both close up, because the labels sit on H while the ornaments
     are sized from W. Nudge the ornament; never move the type. At 16:10 both
     guards are inert, so the reference card is untouched. */
  const codeText = code ? `${code}${suffix ? ` ${upper(suffix)}` : ''}` : ''
  const codeEnd = pad + [...codeText].length * (MONO_ADV + G.labelTrack) * label
  const labelY = G.codeY * H

  let ringCy = ring.cy * H
  const ringTargetX = codeEnd + 0.02 * W
  if (codeText) {
    const chord = ring.cx * W - ringTargetX
    const minDrop = Math.sqrt(Math.max(0, (ring.r * W) ** 2 - chord ** 2))
    if (ringCy - labelY < minDrop) ringCy = labelY + minDrop
  }

  const noteY = G.noteY * H
  const orbitShift = note
    ? Math.max(
        0,
        G.orbit.cy * H +
          Math.abs(Math.sin((G.orbit.angle * Math.PI) / 180) * G.orbit.half * W) +
          G.orbit.dot * W -
          (noteY - 0.02 * W),
      )
    : 0

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width ?? 1600}" height="${Math.round((spec.width ?? 1600) / ratio)}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(word)} — generated sleeve">
  <title>${esc(word)} — generated sleeve</title>
  <style>${fontCss()}</style>
  <defs>
    <clipPath id="card-${uid}"><rect width="${W}" height="${H}" rx="${spec.radius ?? 0}"/></clipPath>
    <pattern id="dots-${uid}" width="${f(texture.cell * W)}" height="${f(texture.cell * W)}" patternUnits="userSpaceOnUse">
      <circle cx="${f(texture.cell * W / 2)}" cy="${f(texture.cell * W / 2)}" r="${f(texture.dot * W)}" fill="${ink}"/>
    </pattern>
    <radialGradient id="glow-${uid}" cx="0.38" cy="0.34" r="0.5">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.82"/>
      <stop offset="0.62" stop-color="${glow}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <g clip-path="url(#card-${uid})">
    <rect width="${W}" height="${H}" fill="${ground}"/>

    <!-- texture: a dot screen at 12%, drawn in the ink so it inverts with the ground -->
    ${plain ? '' : `<rect width="${W}" height="${H}" fill="url(#dots-${uid})" opacity="${texture.alpha}"/>`}

    <!-- the oversized ring, always behind the type -->
    ${plain ? '' : `<circle cx="${f(ring.cx * W)}" cy="${f(ringCy)}" r="${f(ring.r * W)}" fill="none" stroke="${ink}" stroke-width="${f(ring.w * W)}" opacity="${ring.alpha}"/>`}

    ${plain ? '' : `${
      variant === 'petri'
        ? cells
            .map(
              (c) => `<g opacity="${G.petri.alpha}">
      <circle cx="${f(c.cx * W)}" cy="${f(c.cy * H)}" r="${f(c.r * W)}" fill="url(#glow-${uid})" stroke="${ink}" stroke-width="${f(G.petri.w * W)}"/>
    </g>`,
            )
            .join('\n    ')
        : orbit(W, H, ink, accent, ground, orbitShift)
    }`}

    <!-- type -->
    ${code ? `<text x="${f(pad)}" y="${f(G.codeY * H)}" ${labelAttrs}>${esc(code)}${suffix ? ` ${esc(upper(suffix))}` : ''}</text>` : ''}
    <text x="${f(pad + G.ghostNudge * W)}" y="${f(G.ghostY * H)}" font-family="Sleeve Display" font-size="${f(ghost)}" font-weight="800" letter-spacing="${f(G.ghostTrack * ghost)}" fill="${ink}">${esc(word)}</text>
    ${note ? `<text x="${f(pad)}" y="${f(G.noteY * H)}" ${labelAttrs}>${esc(note)}</text>` : ''}
  </g>
</svg>
`
}

function orbit(W, H, ink, accent, ground, shift = 0) {
  const o = G.orbit
  const cx = o.cx * W
  const cy = o.cy * H
  const rad = (o.angle * Math.PI) / 180
  const dx = Math.cos(rad) * o.half * W
  const dy = Math.sin(rad) * o.half * W
  const dot = (x, y) =>
    `<circle cx="${f(x)}" cy="${f(y)}" r="${f(o.dot * W)}" fill="${ground}" stroke="${ink}" stroke-width="${f(o.dotEdge * W)}"/>`
  return `<g opacity="${o.alpha}"${shift ? ` transform="translate(0 ${f(-shift)})"` : ''}>
      <line x1="${f(cx - dx)}" y1="${f(cy - dy)}" x2="${f(cx + dx)}" y2="${f(cy + dy)}" stroke="${accent}" stroke-width="${f(o.w * W)}"/>
      ${dot(cx - dx, cy - dy)}
      ${dot(cx + dx, cy + dy)}
    </g>`
}

function f(n) {
  return Number(n.toFixed(3))
}

function hash(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Palette + variant from a slug, so the same project always draws the same art. */
export function seed(slug) {
  const h = hash(slug)
  const keys = Object.keys(PALETTES)
  return {
    palette: keys[h % keys.length],
    variant: VARIANTS[(h >>> 8) % VARIANTS.length],
  }
}

/* ── raster ──────────────────────────────────────────────────────────────── */

async function rasterise(svg, out, width, scale) {
  let chromium
  try {
    ;({ chromium } = await import('@playwright/test'))
  } catch {
    try {
      ;({ chromium } = await import('playwright'))
    } catch {
      return null
    }
  }

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;background:transparent}
    #sleeve{width:${width}px;height:${Math.round(width / (svg.match(/viewBox="0 0 (\d+) (\d+)"/)[1] / svg.match(/viewBox="0 0 (\d+) (\d+)"/)[2]))}px}
    #sleeve svg{display:block;width:100%;height:100%}
  </style></head><body><div id="sleeve">${svg.replace(/^<svg[^>]*>/, (m) => m.replace(/width="[^"]*"/, `width="${width}"`).replace(/height="[^"]*"/, ''))}</div></body></html>`

  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
  const page = await browser.newPage({ viewport: { width, height: 400 }, deviceScaleFactor: scale })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const el = await page.$('#sleeve')
  await el.screenshot({ path: out.replace(/\.\w+$/, '.png') })
  await browser.close()
  return out.replace(/\.\w+$/, '.png')
}

async function toWebp(png, webp) {
  try {
    const sharp = (await import('sharp')).default
    await sharp(png).webp({ quality: 90, effort: 5 }).toFile(webp)
    return webp
  } catch {
    return null
  }
}

/* ── CLI ─────────────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[key] = true
    else {
      out[key] = next
      i++
    }
  }
  return out
}

const RATIOS = { '16:10': 1.6, '1:1': 1, '4:3': 4 / 3, '16:9': 16 / 9, '3:2': 1.5, '2:1': 2, '4:5': 0.8 }

async function main() {
  const a = parseArgs(process.argv.slice(2))

  if (a.list) {
    console.log('palette     ground    ink       contrast')
    for (const [k, p] of Object.entries(PALETTES)) {
      const c = contrast(p.ink, p.ground)
      console.log(
        `${k.padEnd(11)} ${p.ground}  ${p.ink}  ${c.toFixed(2)}:1${c < 4.5 ? '  ✗ below 4.5' : ''}`,
      )
    }
    return
  }

  const ratio = a.ratio ? (RATIOS[a.ratio] ?? Number(a.ratio)) : 1.6
  const width = Number(a.width ?? 1600)
  const picked = a.palette ? { palette: a.palette } : a.seed ? seed(String(a.seed)) : { palette: 'cobalt' }
  const variant = a.variant ?? picked.variant ?? 'orbit'

  const spec = {
    title: a.title,
    word: a.word,
    code: a.code,
    note: a.note,
    suffix: a.suffix === true ? null : a.suffix,
    variant,
    palette: picked.palette,
    ratio,
    width,
    fit: a.fit === true,
    radius: a.radius ? Number(a.radius) : 0,
  }

  const svg = buildSvg(spec)

  const target = a.out ? path.resolve(String(a.out)) : path.resolve(`sleeve-${Date.now()}`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(`${target}.svg`, svg)

  const c = contrast(PALETTES[spec.palette].ink, PALETTES[spec.palette].ground)
  const wRatio = wordWidth(spec.word || deriveWord(spec.title || ''), 1, -0.085) * G.ghost / SAFE
  if (wRatio > 1 && !a.fit) {
    console.log(
      `  ! "${spec.word || deriveWord(spec.title || '')}" needs ${wRatio.toFixed(2)}× the card width — it will clip. Use 2–4 characters, or --fit`,
    )
  }
  console.log(`${path.basename(target)}.svg  ·  ${spec.palette}/${variant}  ·  ${spec.word ?? spec.title ?? '—'}  ·  ink ${c.toFixed(2)}:1`)
  if (c < 4.5) console.log(`  ✗ ink on ground is below 4.5:1 — pick another palette`)

  if (!a['svg-only']) {
    const png = await rasterise(svg, `${target}.png`, width, Number(a.scale ?? 1))
    if (!png) {
      console.log('  ! no Playwright found, SVG only')
      return
    }
    const webp = await toWebp(png, `${target}.webp`)
    console.log(`  → ${path.basename(png)}${webp ? `, ${path.basename(webp)}` : ''}`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
