#!/usr/bin/env node
/**
 * Sunnyside print — a 4:5 showcase card, in the language of the Show & tell
 * studies (Sun Club, Peel Here, Type Tray, Spring study).
 *
 *   node scripts/print.mjs --template poster --title "Sun Club" --out out/sun-club.html
 *   node scripts/print.mjs --template sheet  --title "Peel Here" --out out/peel-here.html
 *
 * Each template is a print artefact drawn in code: a field, a mono rail, one
 * very large piece of type, and one piece of evidence. The card frame (2px ink,
 * 18px radius, offset shadow) is the only chrome; `--no-frame` gives the bare
 * artefact so the app can put its own frame around it.
 *
 * Fonts are referenced by relative path from the output file, so the HTML keeps
 * working wherever it is written. Missing fonts fall back to the stack in
 * references/palette.md and the artefact still reads.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(HERE, '..', 'assets')

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const TEMPLATES = ['poster', 'sheet', 'specimen', 'curve']
const template = flag('template', 'poster')
if (!TEMPLATES.includes(template)) {
  console.error(`--template must be one of: ${TEMPLATES.join(', ')}`)
  process.exit(1)
}

const title = flag('title', 'Untitled print')
const kicker = flag('kicker', 'est. 2026')
const meta = flag('meta', 'No. 001')
const caption = flag('caption', 'Drawn in code')
const field = flag('field', '')
const W = Number(flag('width', 640))
const H = Number(flag('height', 800))
const frame = !args.includes('--no-frame')
const out = resolve(flag('out', `out/${slugify(title)}.html`))

const P = {
  paper: '#f3ecdf',
  paperHi: '#fffaf1',
  paperLo: '#e9dfcf',
  ink: '#191a2e',
  muted: '#5f5b6e',
  line: 'rgb(25 26 46 / 0.16)',
  cobalt: '#3d53d6',
  cobaltInk: '#2c3cae',
  tangerine: '#ff6a2b',
  butter: '#ffd23f',
  pink: '#ffb6e1',
  mint: '#b7e4c7',
  sky: '#a9c8ff',
}

const FIELDS = {
  cobalt: { bg: P.cobalt, fg: P.paperHi },
  butter: { bg: P.butter, fg: P.ink },
  pink: { bg: P.pink, fg: P.ink },
  mint: { bg: P.mint, fg: P.ink },
  paper: { bg: P.paperHi, fg: P.ink },
  ink: { bg: P.ink, fg: P.paperHi },
}

const fontUrl = (file) => relative(dirname(out), join(ASSETS, file)).split('\\').join('/')

const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)} — Sunnyside print</title>
<!-- Sunnyside print · ${template}. Recipe: references/print.md -->
<style>
  @font-face{font-family:'Syne';src:url('${fontUrl('syne.woff2')}') format('woff2');font-weight:400 800;font-display:block}
  @font-face{font-family:'Geist Mono';src:url('${fontUrl('GeistMono.ttf')}') format('truetype');font-weight:100 900;font-display:block}
  :root{
    --paper:${P.paper};--paper-hi:${P.paperHi};--paper-lo:${P.paperLo};
    --ink:${P.ink};--muted:${P.muted};--line:${P.line};
    --cobalt:${P.cobalt};--cobalt-ink:${P.cobaltInk};
    --tangerine:${P.tangerine};--butter:${P.butter};--pink:${P.pink};--mint:${P.mint};--sky:${P.sky};
    --display:'Syne','Space Grotesk',system-ui,sans-serif;
    --mono:'Geist Mono',ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:transparent}
  body{display:grid;place-items:center;padding:30px}
  .frame{
    width:${W}px;height:${H}px;overflow:hidden;position:relative;
    ${frame ? `border:2px solid var(--ink);border-radius:18px;box-shadow:8px 9px 0 rgb(25 26 46 / 0.12);` : 'border-radius:0;'}
  }
  .print{position:relative;height:100%;display:flex;flex-direction:column;overflow:hidden}
  .rail{position:relative;z-index:2;display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
        font-family:var(--mono);font-size:8px;letter-spacing:0.18em;text-transform:uppercase}
  .rail b{font-family:var(--display);font-size:1rem;font-weight:800;letter-spacing:-0.03em;text-transform:none}
  .foot{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:1rem;
        font-family:var(--mono);font-size:8px;letter-spacing:0.18em;text-transform:uppercase}
  .barcode{display:flex;align-items:stretch;gap:2px;height:1rem}
  .barcode i{display:block;width:2px;background:currentColor}
  .barcode i:nth-child(3n){width:4px}
</style>
</head>
<body>
<div class="frame">
`

const tail = `</div>
</body>
</html>
`


/* ── templates ───────────────────────────────────────────────────────────── */

function poster() {
  const f = FIELDS[field] ?? FIELDS.cobalt
  const discWord = flag('disc', (title.split(/\s+/)[0] ?? title).slice(0, 5).toUpperCase())

  return `<div class="print" style="background:${f.bg};color:${f.fg};padding:26px">
  <div style="position:absolute;inset:0;background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:9px 9px;opacity:.18;pointer-events:none"></div>
  <div style="position:absolute;right:-35%;bottom:-28%;width:115%;aspect-ratio:1;border-radius:50%;background:repeating-conic-gradient(from 8deg,var(--butter) 0 7deg,transparent 7deg 14deg);opacity:.9"></div>
  <div style="position:absolute;right:-14%;bottom:-8%;width:74%;aspect-ratio:1;border-radius:50%;background:var(--tangerine);border:2px solid var(--ink);display:grid;place-items:center">
    <span style="font-family:var(--display);font-weight:800;font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.06em;color:var(--ink);transform:rotate(-12deg)">${esc(discWord)}</span>
  </div>

  <div class="rail"><span>${esc(title)} / ${esc(kicker)}</span><span>${esc(meta)}</span></div>

  <p style="position:relative;z-index:2;margin-top:auto;margin-bottom:auto;max-width:7ch;font-family:var(--display);font-weight:800;font-size:${Math.round(W * 0.09)}px;line-height:.86;letter-spacing:-.06em;text-transform:uppercase">${esc(title)}</p>

  <div class="foot">
    <span>${esc(caption)}</span>
    <span class="barcode">${Array.from({ length: 18 }, () => '<i></i>').join('')}</span>
  </div>
</div>`
}

function sheet() {
  const marks = [
    smiley(P.butter),
    daisy(P.pink),
    heart(P.tangerine),
    bolt(P.cobalt),
    burst(P.butter),
    sun(P.tangerine),
    sparkle(P.cobalt),
    smiley(P.mint),
    daisy(P.pink),
  ]

  return `<div class="print" style="background:var(--paper-hi);color:var(--ink);padding:24px">
  <div class="rail"><b>${esc(title)}</b><span>9 die-cuts</span></div>

  <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4rem;margin-top:.9rem;flex:1">
    ${marks
      .map(
        (mark) =>
          `<span style="position:relative;display:grid;place-items:center;padding:.35rem;border:1px dashed rgb(25 26 46 / .35);border-radius:4px">${mark}</span>`,
      )
      .join('\n    ')}
  </div>

  <p style="margin-top:.7rem;font-family:var(--mono);font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">${esc(caption)} · cut, don’t tear</p>
</div>`
}

function specimen() {
  const f = FIELDS[field] ?? FIELDS.butter
  const rows = [
    ['Syne', 'display', '700 / 800'],
    ['Geist', 'reading', '400 / 500'],
    ['Geist Mono', 'labels', '500'],
  ]

  return `<div class="print" style="background:${f.bg};color:${f.fg};padding:26px">
  <div class="rail"><span>${esc(title)} / ${esc(kicker)}</span><span>3 voices</span></div>

  <p style="font-family:var(--display);font-weight:800;font-size:${Math.round(W * 0.28)}px;line-height:.9;letter-spacing:-.05em;margin-top:auto">Aa</p>

  <div style="margin:1.4rem 0 1.6rem;border-top:1.5px solid currentColor">
    ${rows
      .map(
        ([family, role, weights]) =>
          `<div style="display:flex;align-items:baseline;justify-content:space-between;gap:1rem;padding:.5rem 0;border-bottom:1px solid currentColor;font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase">
        <span style="font-family:var(--display);font-size:15px;font-weight:700;letter-spacing:-.02em;text-transform:none">${family}</span>
        <span>${role}</span>
        <span>${weights}</span>
      </div>`,
      )
      .join('\n    ')}
  </div>

  <div class="foot"><span>${esc(caption)}</span><span>${esc(meta)}</span></div>
</div>`
}

function curve() {
  const curves = [
    { d: 'M24 148C84 148 148 36 236 36', cls: 'soft', label: 'soft' },
    { d: 'M24 148C50 148 74 36 236 36', cls: 'snap', label: 'snap' },
    { d: 'M24 148C118 148 112 6 236 36', cls: 'loose', label: 'loose' },
  ]
  const colours = { soft: P.cobalt, snap: P.tangerine, loose: P.mint }

  return `<div class="print" style="background:var(--paper-hi);color:var(--ink);padding:26px">
  <div class="rail"><span>${esc(title)} / ${esc(kicker)}</span><span>Same distance</span></div>

  <svg viewBox="0 0 260 170" preserveAspectRatio="xMidYMid meet" style="width:100%;flex:1;min-height:0;display:block;margin-top:1.2rem" aria-hidden="true">
    <g stroke="rgb(25 26 46 / .16)" stroke-width="1" fill="none">
      <path d="M24 36H236M24 92H236M24 148H236"/>
      <path d="M24 30V154M77 30V154M130 30V154M183 30V154"/>
    </g>
    ${curves
      .map(
        (c) =>
          `<path d="${c.d}" fill="none" stroke="${colours[c.cls]}" stroke-width="2.4" stroke-linecap="round"/>`,
      )
      .join('\n    ')}
    <circle cx="236" cy="36" r="4" fill="${P.cobalt}"/>
    <circle cx="236" cy="36" r="4" fill="${P.tangerine}" opacity=".5"/>
  </svg>

  <div class="foot" style="margin-top:auto">
    <span>${curves.map((c) => esc(c.label)).join('</span><span>')}</span>
  </div>
</div>`
}

/* ── die-cut marks, drawn at 60 × 60 ─────────────────────────────────────── */

/**
 * A die-cut sticker: a solid shape in one ink, with the same paper halo behind
 * every one of them (`paint-order: stroke` draws the halo first, so it reads as
 * a cut edge rather than as a border eating the shape).
 */
const mark = (inner, ink = P.ink) =>
  `<svg viewBox="0 0 60 60" style="width:82%;display:block" aria-hidden="true">
    <g fill="${ink}" stroke="${P.paperHi}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke">${inner}</g>
  </svg>`

const smiley = (ink) =>
  mark(
    `<circle cx="30" cy="30" r="22"/><circle cx="22" cy="25" r="2.6" fill="${P.paperHi}"/><circle cx="38" cy="25" r="2.6" fill="${P.paperHi}"/><path d="M19 36c3.4 6 18.6 6 22 0" fill="none" stroke="${P.paperHi}" stroke-width="3"/>`,
    ink,
  )

const daisy = (ink) =>
  mark(
    [0, 60, 120, 180, 240, 300]
      .map((a) => `<ellipse cx="30" cy="13" rx="8" ry="11" transform="rotate(${a} 30 30)"/>`)
      .join('') + `<circle cx="30" cy="30" r="6.5" fill="${P.butter}" stroke="none"/>`,
    ink,
  )

const heart = (ink) =>
  mark(`<path d="M30 50C13 39 9 30 12 22c3-8 13-9 18-1 5-8 15-7 18 1 3 8-1 17-18 28Z"/>`, ink)

const bolt = (ink) => mark(`<path d="M35 8 15 34h11l-3 18 20-26H32l3-18Z"/>`, ink)

const burst = (ink) =>
  mark(`<path d="M30 7 37 20l14-3-6 13 10 10-14 2-2 14-9-10-13 6 3-14L10 29l13-4 7-18Z"/>`, ink)

const sun = (ink) =>
  mark(
    `<circle cx="30" cy="30" r="12" fill="none" stroke="${ink}" stroke-width="5"/>` +
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        const x1 = 30 + Math.cos(a) * 17
        const y1 = 30 + Math.sin(a) * 17
        const x2 = 30 + Math.cos(a) * 23
        const y2 = 30 + Math.sin(a) * 23
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${ink}" stroke-width="4" fill="none"/>`
      }).join(''),
    ink,
  )

const sparkle = (ink) =>
  mark(`<path d="M30 6c2 14 10 22 24 24-14 2-22 10-24 24-2-14-10-22-24-24 14-2 22-10 24-24Z"/>`, ink)

/* ── helpers ─────────────────────────────────────────────────────────────── */

function initials(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/* ── write ───────────────────────────────────────────────────────────────── */

const body = (() => {
  switch (template) {
    case 'poster':
      return poster()
    case 'sheet':
      return sheet()
    case 'specimen':
      return specimen()
    default:
      return curve()
  }
})()

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, head + body + tail)
console.log(`${out}  ·  ${template}  ·  ${W}×${H}${frame ? ' · framed' : ''}`)
