// Wildflower Wind — the mark is a record of one gust, not a formula.
//
// A petal is narrow at the base, widest at 72% of its length, rounded at the tip, and
// slightly bent. Four of them hold the calyx at irregular spacing. The fifth is
// already gone: it sits in the 134° gap the wind opened, small, further out, and it
// is the only place the accent is allowed in the mark.
//
// Every file in public/brand/wildflower-wind/ is generated here. Nothing is traced
// from the photograph and nothing is drawn twice.

import { writeFile, mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'
import { curvedPetal } from './petal.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '..', 'public', 'brand', 'wildflower-wind')
const fonts = join(here, '..', 'assets', 'fonts')

const INK = '#2a1e33' // deep aubergine — the ink the glass resolves to
const SIGNAL = '#8f2a90' // cosmos, refracted — the one accent
const PAPER = '#e7e3ee' // the haze behind the pane
const BLUSH = '#d98ac8' // the accent, lifted for a dark ground

const n2 = (v) => Number(v.toFixed(2))
const svgOpen = (w, h, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n2(w)} ${n2(h)}" width="${n2(w)}" height="${n2(h)}" role="img" aria-label="${label}">`

/* ── the placement table ──────────────────────────────────────────────────────
   a  angle from up, clockwise (degrees)
   r  distance of the petal's base from the centre
   l  petal length
   w  half-width as a fraction of the length
   b  bend, as a fraction of the length
   ─────────────────────────────────────────────────────────────────────────── */

const MARK = [
  { a: 2, r: 4.6, l: 21, w: 0.35, b: 0.1 },
  { a: 76, r: 5.4, l: 19.5, w: 0.35, b: 0.14 },
  { a: 148, r: 4.8, l: 20.5, w: 0.35, b: 0.08 },
  { a: 228, r: 6.0, l: 18.5, w: 0.35, b: 0.16 },
  { a: 296, r: 16.6, l: 10.5, w: 0.38, b: 0.2, taken: true },
]

// Compact is a different drawing, not a smaller one: three petals, blunter, the
// taken petal pulled back in so the silhouette survives 16px.
const COMPACT = [
  { a: 6, r: 3.4, l: 22, w: 0.42, b: 0.08 },
  { a: 106, r: 4.2, l: 20, w: 0.42, b: 0.12 },
  { a: 208, r: 3.8, l: 21, w: 0.42, b: 0.1 },
  { a: 290, r: 13.2, l: 11.5, w: 0.44, b: 0.16, taken: true },
]

// Glyph is the calyx alone, four petals closed up: a favicon has no room for a story.
const GLYPH = [
  { a: 0, r: 3.2, l: 22, w: 0.42, b: 0.06 },
  { a: 92, r: 3.6, l: 20.5, w: 0.42, b: 0.1 },
  { a: 184, r: 3.2, l: 21.5, w: 0.42, b: 0.06 },
  { a: 274, r: 3.6, l: 20, w: 0.42, b: 0.1 },
]

/**
 * Glass. A petal is a translucent lens, so two petals that overlap do not sit on
 * top of each other — they multiply, and the crossing is the darkest thing in the
 * mark. That is the whole argument of the identity in one rule: the flower is not
 * drawn, it is the sum of what shows through.
 */
function glassDefs(id, tint, accent) {
  return `<defs>
    <linearGradient id="${id}-fill" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${tint}" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="${tint}" stop-opacity="0.46"/>
      <stop offset="1" stop-color="${tint}" stop-opacity="0.62"/>
    </linearGradient>
    <linearGradient id="${id}-taken" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.46"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0.78"/>
    </linearGradient>
    <linearGradient id="${id}-sheen" x1="0" y1="0" x2="0.55" y2="0.8">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.78"/>
      <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>`
}

function markBody({ table = MARK, size = 64, ink = INK, accent = SIGNAL, uid = 'wi' } = {}) {
  const c = size / 2
  const k = size / 64
  const petals = table.map((p) => {
    const len = p.l * k
    const rad = (p.a * Math.PI) / 180
    const x = c + p.r * k * Math.sin(rad)
    const y = c - p.r * k * Math.cos(rad)
    const d = curvedPetal(len, len * p.w, p.b)
    const fill = p.taken ? `url(#${uid}-taken)` : `url(#${uid}-fill)`
    return `<g transform="translate(${n2(x)} ${n2(y)}) rotate(${p.a})" style="mix-blend-mode:multiply">
      <path d="${d}" fill="${fill}"/>
      <path d="${d}" fill="url(#${uid}-sheen)" style="mix-blend-mode:screen"/>
    </g>`
  })
  // the rim: a hairline of light around the whole flower, which is what a pane has
  const outline = table
    .map((p) => {
      const len = p.l * k
      const rad = (p.a * Math.PI) / 180
      const x = c + p.r * k * Math.sin(rad)
      const y = c - p.r * k * Math.cos(rad)
      return `<path d="${curvedPetal(len, len * p.w, p.b)}" transform="translate(${n2(x)} ${n2(y)}) rotate(${p.a})" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="${n2(0.7 * k)}"/>`
    })
    .join('')
  return `${glassDefs(uid, ink, accent)}${petals.join('')}${outline}`
}

const mark = (o = {}) => {
  const s = o.size ?? 64
  return `${svgOpen(s, s, 'Wildflower Wind')}${markBody({ ...o, size: s })}</svg>`
}
const compact = (o = {}) => mark({ ...o, table: COMPACT })
const glyph = (o = {}) => mark({ ...o, table: GLYPH, size: o.size ?? 32 })

/* icon — the mark on a tile, for the places that insist on a square */
function icon({ size = 512, bg = INK, ink = PAPER, accent = BLUSH } = {}) {
  const inner = size * 0.82
  const off = (size - inner) / 2
  return `${svgOpen(size, size, 'Wildflower Wind')}<rect width="${size}" height="${size}" rx="${n2(size * 0.23)}" fill="${bg}"/><g transform="translate(${n2(off)} ${n2(off)})">${markBody({ ink, accent, size: inner })}</g></svg>`
}

/* ── wordmark: outlined from the font file, never live text ──────────────── */

const loadFace = (file) => {
  const buf = readFileSync(join(fonts, file))
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
}

const face = { roman: loadFace('InstrumentSerif-Regular.ttf'), italic: loadFace('InstrumentSerif-Italic.ttf') }

// "Wildflower" set tight; "Wind" leans and opens up. The second word is the one
// the wind is in, and that is the only typographic joke in the identity.
const RUNS = [
  { text: 'Wildflower', face: 'roman', track: -0.008 },
  { text: 'Wind', face: 'italic', track: 0.012, space: 0.26 },
]

function wordmarkGeometry(size = 100) {
  let x = 0
  const parts = []
  const box = new opentype.Path()
  let first = true
  for (const run of RUNS) {
    const f = face[run.face]
    if (!first) x += run.space * size
    for (const ch of run.text) {
      const path = f.getPath(ch, x, 0, size)
      parts.push(path.toPathData(2))
      box.extend(path)
      x += ((f.charToGlyph(ch).advanceWidth ?? 0) * size) / f.unitsPerEm + run.track * size
    }
    first = false
  }
  return { d: parts.join(' '), bb: box.getBoundingBox() }
}

function wordmark({ ink = INK, size = 34 } = {}) {
  const { d, bb } = wordmarkGeometry(100)
  const pad = 3
  const w = bb.x2 - bb.x1 + pad * 2
  const h = bb.y2 - bb.y1 + pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n2(bb.x1 - pad)} ${n2(bb.y1 - pad)} ${n2(w)} ${n2(h)}" height="${n2((h / 100) * size)}" role="img" aria-label="Wildflower Wind"><path d="${d}" fill="${ink}"/></svg>`
}

/* ── lockups ─────────────────────────────────────────────────────────────── */

// The gap between mark and name is half a mark, so the eye finishes the flower
// before it starts reading.
function lockup({ ink = INK, accent = SIGNAL, stacked = false } = {}) {
  const M = 64
  const { d, bb } = wordmarkGeometry(100)
  const wmW = bb.x2 - bb.x1
  const wmH = bb.y2 - bb.y1
  const gap = M * 0.5

  if (stacked) {
    const targetW = M * 3.5
    const scale = targetW / wmW
    const W = Math.max(M, targetW)
    const H = M + gap * 0.85 + wmH * scale
    const markX = (W - M) / 2
    const wmX = (W - wmW * scale) / 2 - bb.x1 * scale
    const wmY = M + gap * 0.85 - bb.y1 * scale
    return `${svgOpen(W, H, 'Wildflower Wind')}<g transform="translate(${n2(markX)} 0)">${markBody({ ink, accent, size: M })}</g><g transform="translate(${n2(wmX)} ${n2(wmY)}) scale(${n2(scale)})"><path d="${d}" fill="${ink}"/></g></svg>`
  }

  const scale = (M * 0.74) / wmH
  const W = M + gap + wmW * scale
  const H = M
  const y = H / 2 - ((bb.y1 + bb.y2) / 2) * scale
  return `${svgOpen(W, H, 'Wildflower Wind')}${markBody({ ink, accent, size: M })}<g transform="translate(${n2(M + gap - bb.x1 * scale)} ${n2(y)}) scale(${n2(scale)})"><path d="${d}" fill="${ink}"/></g></svg>`
}

/* ── the drift: the same petal, scattered. Decoration, never the mark. ───── */

function drift({ size = 720, seed = 11, n = 30, ink = SIGNAL } = {}) {
  let s = seed
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648
  const parts = []
  for (let i = 0; i < n; i++) {
    const len = size * (0.03 + rnd() * 0.05)
    parts.push(
      `<path d="${curvedPetal(len, len * 0.3, 0.1 + rnd() * 0.16)}" transform="translate(${n2(rnd() * size)} ${n2(rnd() * size)}) rotate(${n2(10 + rnd() * 70)})" fill="${ink}" opacity="${n2(0.16 + rnd() * 0.4)}"/>`,
    )
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${parts.join('')}</svg>`
}

/* ── write ───────────────────────────────────────────────────────────────── */

async function build() {
  await mkdir(out, { recursive: true })
  const write = (name, body) => writeFile(join(out, name), body)

  await write('mark.svg', mark())
  await write('mark-reverse.svg', mark({ ink: PAPER, accent: BLUSH }))
  await write('mark-mono.svg', mark({ accent: INK }))
  await write('mark-compact.svg', compact())
  await write('mark-compact-reverse.svg', compact({ ink: PAPER, accent: BLUSH }))
  await write('glyph.svg', glyph())
  await write('icon.svg', icon({ size: 512 }))
  await write('wordmark.svg', wordmark({ ink: INK }))
  await write('wordmark-reverse.svg', wordmark({ ink: PAPER }))
  await write('lockup.svg', lockup())
  await write('lockup-reverse.svg', lockup({ ink: PAPER, accent: BLUSH }))
  await write('lockup-stacked.svg', lockup({ stacked: true }))
  await write('lockup-stacked-reverse.svg', lockup({ stacked: true, ink: PAPER, accent: BLUSH }))
  await write('drift.svg', drift({ size: 720, seed: 11, n: 30 }))

  console.log(`mark family → ${out}`)
}

export { markBody, mark, compact, glyph, icon, wordmark, lockup, drift, MARK, COMPACT, GLYPH, INK, SIGNAL, PAPER, BLUSH, svgOpen, n2 }

if (process.argv[1] === fileURLToPath(import.meta.url)) await build()
