// Vesper — the field.
//
//   node vesper/scripts/field.mjs
//
// A two-ink stipple field, generated as a raster because the texture is the
// point: 60,000 marks is a print, and 60,000 <path> elements is a browser
// problem. Cobalt ground, cream stipple streaming from one point, a horizon,
// a moon, and the lamp in silhouette.
//
// Deterministic: the same seed draws the same field every time, so the page can
// be rebuilt and compared.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const outDir = join(root, 'public', 'brand', 'vesper', 'field')
mkdirSync(outDir, { recursive: true })

const W = 1600
const H = 900

const SKY = [27, 63, 162] // #1b3fa2 — cobalt
const CREAM = [230, 207, 168] // #e6cfa8 — stock
const INK = [13, 21, 38] // #0d1526 — lampblack
const NIGHT = [10, 42, 107] // #0a2a6b

// ── canvas ──────────────────────────────────────────────────────────────────

const px = new Float32Array(W * H * 3)
const put = (i, c) => {
  px[i] = c[0]
  px[i + 1] = c[1]
  px[i + 2] = c[2]
}
const mix = (i, c, a) => {
  px[i] += (c[0] - px[i]) * a
  px[i + 1] += (c[1] - px[i + 1]) * a
  px[i + 2] += (c[2] - px[i + 2]) * a
}

// Vertical wash: the sky is deepest at the top, cobalt at the horizon.
for (let y = 0; y < H; y++) {
  const t = Math.min(1, y / 620)
  const e = Math.pow(t, 1.35)
  const c = [NIGHT[0] + (SKY[0] - NIGHT[0]) * e, NIGHT[1] + (SKY[1] - NIGHT[1]) * e, NIGHT[2] + (SKY[2] - NIGHT[2]) * e]
  for (let x = 0; x < W; x++) put((y * W + x) * 3, c)
}

// ── rng ─────────────────────────────────────────────────────────────────────

let seed = 0x5eed1e
const rnd = () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// ── a dot, with coverage so the stipple does not alias ──────────────────────

function dot(x, y, r, colour, alpha = 1) {
  const x0 = Math.max(0, Math.floor(x - r - 1))
  const x1 = Math.min(W - 1, Math.ceil(x + r + 1))
  const y0 = Math.max(0, Math.floor(y - r - 1))
  const y1 = Math.min(H - 1, Math.ceil(y + r + 1))
  for (let yy = y0; yy <= y1; yy++) {
    for (let xx = x0; xx <= x1; xx++) {
      const d = Math.hypot(xx + 0.5 - x, yy + 0.5 - y)
      const cov = Math.max(0, Math.min(1, r + 0.5 - d))
      if (cov > 0) mix((yy * W + xx) * 3, colour, cov * alpha)
    }
  }
}

// A tick: a short stroke along the flow, which is what the artwork uses.
function tick(x, y, ang, len, w, colour, alpha = 1) {
  const steps = Math.max(2, Math.ceil(len))
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    dot(x + Math.cos(ang) * len * (t - 0.5), y + Math.sin(ang) * len * (t - 0.5), w, colour, alpha)
  }
}

// ── the horizon ─────────────────────────────────────────────────────────────
// Not a straight line: the ground rises 6px over 1600 and the edge is broken by
// a 1.5px jitter, so the cream does not look cut with a ruler.

const horizonAt = (x) => 596 - (x / W) * 8 + Math.sin(x * 0.011) * 2.2 + Math.sin(x * 0.031 + 1.7) * 1.4

for (let x = 0; x < W; x++) {
  const hy = Math.round(horizonAt(x))
  for (let y = hy; y < H; y++) put((y * W + x) * 3, CREAM)
}

// ── the sky: streamlines from one point ─────────────────────────────────────
// 320 lines leave a point just above the lamp, each curving the same way. The
// curve is what makes it a vortex rather than a sunburst.

const F = { x: 800, y: 505 }
const LINES = 340

for (let i = 0; i < LINES; i++) {
  const a0 = rnd() * Math.PI * 2
  const swirl = 1.55 + rnd() * 0.5
  const r0 = 26 + rnd() * 40
  const rMax = 520 + rnd() * 900
  const rStep = 2.6 + rnd() * 1.6
  const drift = 0.55 + rnd() * 0.9
  for (let r = r0; r < rMax; r += rStep) {
    const k = r / 900
    const a = a0 + swirl * Math.pow(k, 1.25)
    const x = F.x + Math.cos(a) * r + (rnd() - 0.5) * drift * 3
    const y = F.y + Math.sin(a) * r * 0.82 + (rnd() - 0.5) * drift * 3
    if (y > horizonAt(x) - 3) continue
    // Density: heavy near the focal point and along the horizon, thinning out.
    const near = Math.max(0, 1 - r / 700)
    const band = Math.max(0, 1 - Math.abs(y - horizonAt(x)) / 420)
    const p = 0.16 + near * 0.5 + band * 0.34
    if (rnd() > p) continue
    const w = 0.7 + rnd() * 0.75 - Math.min(0.35, r / 2600)
    tick(x, y, a + Math.PI / 2, 1.2 + rnd() * 2.6, Math.max(0.55, w), CREAM, 0.55 + rnd() * 0.45)
  }
}

// A second, tighter pass at the focal point so the light reads as a source.
for (let i = 0; i < 5200; i++) {
  const a = rnd() * Math.PI * 2
  const r = Math.pow(rnd(), 1.7) * 150
  const x = F.x + Math.cos(a) * r
  const y = F.y + Math.sin(a) * r * 0.9
  if (y > horizonAt(x) - 2) continue
  dot(x, y, 0.55 + rnd() * 0.75, CREAM, 0.5 + rnd() * 0.5)
}

// ── the ground: perspective streaks ─────────────────────────────────────────
// Straight rays from the vanishing point, which is what a floor looks like in
// one-point perspective. Density falls with distance; the ticks run along the
// ray, so the ground has a direction instead of a noise field.

{
  const V = { x: 800, y: horizonAt(800) }
  const RAYS = 300
  for (let i = 0; i < RAYS; i++) {
    const a = (rnd() - 0.5) * 2.6
    const t0 = 0.004 + rnd() * 0.05
    const tMax = 0.55 + rnd() * 0.75
    const step = 0.004 + rnd() * 0.006
    for (let t = t0; t < tMax; t += step) {
      const x = V.x + Math.tan(a) * t * 1500
      const y = V.y + t * 340 + Math.pow(t, 1.6) * 40
      if (x < -20 || x > W + 20 || y > H + 10) continue
      const p = 0.5 * (1 - t / tMax) + 0.1
      if (rnd() > p) continue
      const len = 1.2 + rnd() * 2.4 + t * 2
      tick(x, y, Math.atan2(340, Math.tan(a) * 1500), len, 0.6 + rnd() * 0.65, SKY, 0.35 + rnd() * 0.5)
    }
  }
  // A low sun-glare of cream grit just under the horizon, where the two inks meet.
  for (let i = 0; i < 14000; i++) {
    const t = Math.pow(rnd(), 2.2)
    const x = V.x + (rnd() - 0.5) * 1400 * t
    const y = V.y + t * 200
    dot(x, y, 0.5 + rnd() * 1.0, rnd() > 0.5 ? CREAM : SKY, 0.25 + rnd() * 0.45)
  }
}

// Horizon grit: a broken band right on the edge, both inks.
for (let i = 0; i < 9000; i++) {
  const x = rnd() * W
  const hy = horizonAt(x)
  const y = hy + (rnd() - 0.5) * 26
  if (y < 0 || y > H) continue
  const c = rnd() > 0.45 ? SKY : CREAM
  dot(x, y, 0.5 + rnd() * 1.1, c, 0.35 + rnd() * 0.5)
}

// ── the moon ────────────────────────────────────────────────────────────────
// Cream, 27px radius, offset inner disc — the same construction as the cast mark.

{
  const cx = 1318
  const cy = 132
  const ro = 30
  const ix = cx + 13
  const iy = cy - 7
  const ri = 25
  for (let y = cy - ro - 2; y <= cy + ro + 2; y++) {
    for (let x = cx - ro - 2; x <= cx + ro + 2; x++) {
      const d1 = Math.hypot(x - cx, y - cy)
      const d2 = Math.hypot(x - ix, y - iy)
      const cov = Math.max(0, Math.min(1, ro + 0.5 - d1)) * Math.max(0, Math.min(1, d2 + 0.5 - ri))
      if (cov > 0) mix((y * W + x) * 3, CREAM, cov * 0.94)
    }
  }
}

// ── the lamp ────────────────────────────────────────────────────────────────
// A silhouette, drawn as filled spans: post, lantern head, cap, base, and the
// small bracket under the head. The base sits on the horizon.

function span(y, x0, x1, colour = INK) {
  for (let x = Math.max(0, Math.floor(x0)); x < Math.min(W, Math.ceil(x1)); x++) {
    const cov = Math.min(1, x + 1 - x0, x1 - x) * Math.min(1, 1)
    if (cov > 0) mix((y * W + x) * 3, colour, cov)
  }
}

{
  const cx = 800
  const base = horizonAt(cx) + 2
  // plinth: two steps, the way a cast-iron base is bolted down
  for (let y = base - 8; y < base; y++) span(y, cx - 34, cx + 34)
  for (let y = base - 18; y < base - 8; y++) span(y, cx - 22, cx + 22)
  // post, tapering 11 → 7
  for (let y = 392; y < base - 18; y++) {
    const t = (y - 392) / (base - 18 - 392)
    const w = 11 - t * 4
    span(y, cx - w / 2, cx + w / 2)
  }
  // collar under the lantern
  for (let y = 380; y < 394; y++) span(y, cx - 8, cx + 8)
  // sill: the widest part of the lantern
  for (let y = 368; y < 381; y++) span(y, cx - 25, cx + 25)
  // body: 42 at the sill, 36 at the shoulder
  for (let y = 312; y < 368; y++) {
    const t = (y - 312) / 56
    const w = 36 + t * 6
    span(y, cx - w / 2, cx + w / 2)
  }
  // shoulder band
  for (let y = 306; y < 314; y++) span(y, cx - 20, cx + 20)
  // roof: 40 at the eaves, 14 at the ridge
  for (let y = 288; y < 307; y++) {
    const t = (y - 288) / 19
    span(y, cx - (14 + Math.pow(t, 0.7) * 6), cx + (14 + Math.pow(t, 0.7) * 6))
  }
  // cornice
  for (let y = 280; y < 289; y++) span(y, cx - 21, cx + 21)
  // finial
  for (let y = 268; y < 281; y++) span(y, cx - 3.5, cx + 3.5)
  dot(cx, 264, 4.6, INK)
}

// A shadow on the ground, thrown left of the lamp.
for (let i = 0; i < 2600; i++) {
  const t = rnd()
  const x = 800 - Math.pow(t, 1.4) * 190 + (rnd() - 0.5) * 22
  const y = horizonAt(x) + 4 + Math.pow(t, 1.2) * 26 + (rnd() - 0.5) * 8
  dot(x, y, 0.7 + rnd() * 1.6, INK, 0.05 + (1 - t) * 0.16)
}

// ── png ─────────────────────────────────────────────────────────────────────

const CRC = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
const crc32 = (buf) => {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function encodePng(width, height, floats) {
  const raw = Buffer.alloc((width * 3 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3
      const o = y * (width * 3 + 1) + 1 + x * 3
      raw[o] = Math.max(0, Math.min(255, Math.round(floats[i])))
      raw[o + 1] = Math.max(0, Math.min(255, Math.round(floats[i + 1])))
      raw[o + 2] = Math.max(0, Math.min(255, Math.round(floats[i + 2])))
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const t = Buffer.from(type, 'ascii')
    const c = Buffer.alloc(4)
    c.writeUInt32BE(crc32(Buffer.concat([t, data])))
    return Buffer.concat([len, t, data, c])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const png = encodePng(W, H, px)
const file = join(outDir, 'stipple.png')
writeFileSync(file, png)
console.log(`\n  field  ${W} × ${H}  ${(png.length / 1024).toFixed(0)} KB  →  public/brand/vesper/field/stipple.png\n`)

// ── dither band ─────────────────────────────────────────────────────────────
// A 4 × 4 ordered Bayer matrix over a cobalt → cream ramp. Used as the divider
// between a cobalt band and the cream page: a printed gradient is dots, not a
// blur, and the dots survive a screenshot and a photocopy.

{
  const DW = 1600
  const DH = 140
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]
  const buf = Buffer.alloc(DW * DH * 3)
  for (let y = 0; y < DH; y++) {
    for (let x = 0; x < DW; x++) {
      // Ramp holds at both ends so the band meets the plates without a seam.
      const t = Math.max(0, Math.min(1, (y / DH - 0.16) / 0.68))
      const v = t * t * (3 - 2 * t)
      const th = (BAYER[y % 4][x % 4] + 0.5) / 16
      const c = v > th ? CREAM : SKY
      const o = (y * DW + x) * 3
      buf[o] = c[0]
      buf[o + 1] = c[1]
      buf[o + 2] = c[2]
    }
  }
  const raw = Buffer.alloc((DW * 3 + 1) * DH)
  for (let y = 0; y < DH; y++) {
    raw[y * (DW * 3 + 1)] = 0
    buf.copy(raw, y * (DW * 3 + 1) + 1, y * DW * 3, (y + 1) * DW * 3)
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const t = Buffer.from(type, 'ascii')
    const c = Buffer.alloc(4)
    c.writeUInt32BE(crc32(Buffer.concat([t, data])))
    return Buffer.concat([len, t, data, c])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(DW, 0)
  ihdr.writeUInt32BE(DH, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const dith = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
  writeFileSync(join(outDir, 'dither.png'), dith)
  console.log(`  dither ${DW} × ${DH}  ${(dith.length / 1024).toFixed(0)} KB  →  public/brand/vesper/field/dither.png`)
}
