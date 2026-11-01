#!/usr/bin/env node
/**
 * Bluewater Freight — the mark family.
 *
 * One drawing, generated in every size the case ships. The mark is the hull and
 * the waterline: a full-width rule, the passage cut into it in the signal, and a
 * hollow keel falling to a point below. Two drawings exist, not one: `compact`
 * fills the keel and widens the rule so the shape survives 16px, where the
 * hollow arms of the primary would collapse into a smudge.
 *
 *   node scripts/build-bluewater-marks.mjs [--out public/brand/bluewater]
 *
 * The wordmark is outlined from Archivo (scripts/extract-wordmark.py), not set
 * live: a font failure must not change the name.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d)
const out = resolve(flag('out', 'public/brand/bluewater'))
const wordmarkSource = resolve(flag('wordmark', '/tmp/bw-wordmark.svg'))
mkdirSync(out, { recursive: true })

const C = {
  ink: '#E9F1F8',
  wake: '#8FB6D6',
  slate: '#07131F',
  wakeDeep: '#17608C',
  deep: '#08141F',
  abyss: '#040B14',
  foam: '#F4F9FD',
}

/* ── the drawing, on the 64 grid ─────────────────────────────────────────── */

// Primary: a waterline rule at y13–20, the passage cut out of it in the signal,
// and a hollow keel curving from x20/x44 down to a point at (32,58).
const waterline = 'M4 13H29V20H4ZM35 13H60V20H35Z'
const passage = 'M29 13H35V24H29Z'
const keel = 'M20 20C20 40 26 52 32 58C38 52 44 40 44 20ZM27 20C27 37 29 45 32 50C35 45 37 37 37 20Z'

// Compact: a separate drawing. The keel is filled and the rule is thicker, so
// the silhouette holds when the whole mark is 16px wide.
const waterlineC = 'M3 14H28V24H3ZM36 14H61V24H36Z'
const passageC = 'M28 14H36V24H28Z'
const keelC = 'M18 24C18 42 24 52 32 59C40 52 46 42 46 24Z'

function markBody({ ink, wake, compact = false, mono = false }) {
  const body = compact
    ? `<path d="${waterlineC}" fill="${ink}"/><path d="${passageC}" fill="${mono ? ink : wake}"/><path d="${keelC}" fill="${ink}"/>`
    : `<path d="${waterline}" fill="${ink}"/><path d="${keel}" fill="${ink}" fill-rule="evenodd"/><path d="${passage}" fill="${mono ? ink : wake}"/>`
  // The drawing spans y13–58 on the 64 grid; centring it on y32 keeps the mark
  // optically balanced in every square tile it is ever dropped into.
  return compact ? `<g transform="translate(0 -3)">${body}</g>` : `<g transform="translate(0 -3)">${body}</g>`
}

const svg = (label, w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${inner}</svg>\n`

const ARIA = 'Bluewater Freight'

/* ── wordmark: Archivo outlines, baked ───────────────────────────────────── */

function readWordmark(fill) {
  const raw = readFileSync(wordmarkSource, 'utf8')
  const vb = raw.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)
  const inner = raw.match(/<g[^>]*>([\s\S]*)<\/g>/)[1]
  const H = 24
  const scale = H / vb[3]
  const W = +(vb[2] * scale).toFixed(2)
  const body = `<g transform="scale(${(scale * 1).toFixed(6)}) translate(0 ${(vb[3] * 0).toFixed(2)})" fill="${fill}">${inner}</g>`
  return { W, H, body }
}

const wmInk = readWordmark(C.ink)
const wmSlate = readWordmark(C.slate)

/* ── lockups ─────────────────────────────────────────────────────────────── */

const GAP = 14
function lockup({ ink, wake, wm, compact = false, stacked = false }) {
  const M = 64
  if (stacked) {
    const W = Math.max(M, wm.W)
    const H = M + 18 + wm.H
    const mx = (W - M) / 2
    const wx = (W - wm.W) / 2
    return {
      W: +W.toFixed(2),
      H: +H.toFixed(2),
      body: `<g transform="translate(${mx} 0)">${markBody({ ink, wake, compact })}</g><g transform="translate(${wx} ${M + 18})">${wm.body}</g>`,
    }
  }
  const W = M + GAP + wm.W
  const H = M
  const wy = (M - wm.H) / 2
  return {
    W: +W.toFixed(2),
    H,
    body: `<g>${markBody({ ink, wake, compact })}</g><g transform="translate(${M + GAP} ${wy})">${wm.body}</g>`,
  }
}

/* ── emit ────────────────────────────────────────────────────────────────── */

const files = {}

files['mark.svg'] = svg(ARIA, 64, 64, markBody({ ink: C.ink, wake: C.wake }))
files['mark-reverse.svg'] = svg(ARIA, 64, 64, markBody({ ink: C.slate, wake: C.wakeDeep }))
files['mark-mono.svg'] = svg(ARIA, 64, 64, markBody({ ink: C.ink, wake: C.wake, mono: true }))
files['mark-compact.svg'] = svg(ARIA, 64, 64, markBody({ ink: C.ink, wake: C.wake, compact: true }))
files['mark-compact-reverse.svg'] = svg(ARIA, 64, 64, markBody({ ink: C.slate, wake: C.wakeDeep, compact: true }))
files['glyph.svg'] = svg(ARIA, 32, 32, `<g transform="scale(0.5)">${markBody({ ink: C.ink, wake: C.wake, compact: true })}</g>`)
files['icon.svg'] = svg(
  ARIA,
  64,
  64,
  `<rect width="64" height="64" rx="6" fill="${C.abyss}"/><g transform="translate(4 4) scale(0.875)">${markBody({ ink: C.ink, wake: C.wake, compact: true })}</g>`,
)
files['wordmark.svg'] = svg(ARIA, wmInk.W, wmInk.H, wmInk.body)
files['wordmark-reverse.svg'] = svg(ARIA, wmSlate.W, wmSlate.H, wmSlate.body)

const lk = lockup({ ink: C.ink, wake: C.wake, wm: wmInk })
const lkR = lockup({ ink: C.slate, wake: C.wakeDeep, wm: wmSlate })
const st = lockup({ ink: C.ink, wake: C.wake, wm: wmInk, stacked: true })
const stR = lockup({ ink: C.slate, wake: C.wakeDeep, wm: wmSlate, stacked: true })
files['lockup.svg'] = svg(ARIA, lk.W, lk.H, lk.body)
files['lockup-reverse.svg'] = svg(ARIA, lkR.W, lkR.H, lkR.body)
files['lockup-stacked.svg'] = svg(ARIA, st.W, st.H, st.body)
files['lockup-stacked-reverse.svg'] = svg(ARIA, stR.W, stR.H, stR.body)

for (const [name, body] of Object.entries(files)) writeFileSync(join(out, name), body)

/* ── the sheet, for judging at 16px ──────────────────────────────────────── */

const sheet = `<!doctype html><meta charset="utf-8"><title>Bluewater Freight — mark sheet</title>
<style>
:root{--abyss:#040B14;--deep:#08141F;--ink:#E9F1F8;--haze:#7C93A7;--wake:#8FB6D6;--mist:#EDF3F8;--slate:#07131F;--line:#16283a}
body{margin:0;background:var(--abyss);color:var(--ink);font:13px/1.5 ui-monospace,SFMono-Regular,monospace;padding:44px}
h1{font:600 13px/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--haze);margin:0 0 26px}
.row{display:flex;gap:26px;flex-wrap:wrap;align-items:flex-end;margin-bottom:34px}
figure{margin:0;text-align:center;color:var(--haze);font-size:11px;letter-spacing:.1em}
.tile{display:grid;place-items:center;background:var(--deep);border:1px solid var(--line)}
.tile img{display:block}
.light{background:var(--mist);border-color:#cfdde8}
.cap{margin-top:8px}
</style>
<h1>Bluewater Freight — hull and waterline</h1>
<div class="row">
  <figure><div class="tile" style="width:180px;height:180px"><img src="mark.svg" width="140"></div><div class="cap">mark 140</div></figure>
  <figure><div class="tile" style="width:110px;height:110px"><img src="mark.svg" width="88"></div><div class="cap">88</div></figure>
  <figure><div class="tile" style="width:66px;height:66px"><img src="mark.svg" width="48"></div><div class="cap">48</div></figure>
  <figure><div class="tile" style="width:44px;height:44px"><img src="mark.svg" width="32"></div><div class="cap">32</div></figure>
  <figure><div class="tile" style="width:32px;height:32px"><img src="mark.svg" width="24"></div><div class="cap">24</div></figure>
  <figure><div class="tile" style="width:24px;height:24px"><img src="mark.svg" width="16"></div><div class="cap">16</div></figure>
  <figure><div class="tile" style="width:24px;height:24px"><img src="mark-compact.svg" width="16"></div><div class="cap">compact 16</div></figure>
  <figure><div class="tile" style="width:32px;height:32px"><img src="glyph.svg" width="32"></div><div class="cap">glyph</div></figure>
  <figure><div class="tile" style="width:64px;height:64px;background:none;border:0"><img src="icon.svg" width="46"></div><div class="cap">icon</div></figure>
</div>
<div class="row">
  <figure><img src="lockup.svg" height="48"><div class="cap">lockup</div></figure>
  <figure><img src="lockup-stacked.svg" height="86"><div class="cap">stacked</div></figure>
</div>
<div class="row" style="padding:22px;background:var(--mist);border-radius:2px">
  <figure style="color:#46586A"><img src="lockup-reverse.svg" height="48"><div class="cap">lockup reverse</div></figure>
  <figure style="color:#46586A"><img src="mark-reverse.svg" width="56"><div class="cap">mark reverse</div></figure>
</div>`
writeFileSync(join(out, 'sheet.html'), sheet)

console.log(`bluewater marks → ${out} (${Object.keys(files).length} svg + sheet.html)`)
if (!existsSync(wordmarkSource)) console.warn(`wordmark source missing: ${wordmarkSource}`)
