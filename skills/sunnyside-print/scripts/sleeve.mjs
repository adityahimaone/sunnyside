#!/usr/bin/env node
/**
 * Sunnyside sleeve — a generated cover in the language of the two releases that
 * ship without artwork (SeaPhantom P2P, Labgrownbeasts).
 *
 *   node scripts/sleeve.mjs --title "SeaPhantom P2P" --index 3 \
 *     --variant orbit --field cobalt --out out/seaphantom-p2p.svg
 *
 * The reference is the work-gallery card at 16:10, so that is the default box.
 * `--ratio 1` gives the square sleeve the booth uses.
 *
 * Everything is geometry and type: a solid field, a dot screen, a mono catalog
 * line, one very large ghost word, an outlined ring cropped by two edges, and
 * one piece of evidence — an orbit (a line with two nodes) or two petri cells.
 * No image, no gradient mesh, no drop shadow. Syne is embedded, so the ghost
 * word keeps its width wherever the file is opened.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(HERE, '..', 'assets')

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const title = flag('title')
if (!title) {
  console.error('Need --title. Try: node scripts/sleeve.mjs --title "Sun Club" --out out/sun-club.svg')
  process.exit(1)
}

const FIELDS = {
  cobalt: { bg: '#3d53d6', fg: '#fffaf1' },
  mint: { bg: '#b7e4c7', fg: '#191a2e' },
  butter: { bg: '#ffd23f', fg: '#191a2e' },
  pink: { bg: '#ffb6e1', fg: '#191a2e' },
  sky: { bg: '#a9c8ff', fg: '#191a2e' },
  paper: { bg: '#f3ecdf', fg: '#191a2e' },
}

const variant = flag('variant', 'orbit')
if (!['orbit', 'petri'].includes(variant)) {
  console.error('--variant must be orbit or petri')
  process.exit(1)
}

const fieldName = flag('field', variant === 'petri' ? 'mint' : 'cobalt')
const field = FIELDS[fieldName]
if (!field) {
  console.error(`Unknown --field "${fieldName}". One of: ${Object.keys(FIELDS).join(', ')}`)
  process.exit(1)
}

const TANGERINE = '#ff6a2b'
const BUTTER = '#ffd23f'
const cellsFill = fieldName === 'butter' ? TANGERINE : BUTTER

/** 16:10 by default — the work-gallery card. `--ratio 1` for the square sleeve. */
const ratio = Number(flag('ratio', 1.6))
const W = Number(flag('width', 320))
const H = Math.round(W / ratio)

/** Two to four characters. The last word wins; a single word gives its first three. */
function ghostFor(value) {
  const words = value.trim().split(/\s+/).filter(Boolean)
  if (words.length > 1) return (words[words.length - 1] ?? value).slice(0, 4).toUpperCase()
  return value.slice(0, 3).toUpperCase()
}

const ghost = (flag('ghost') ?? ghostFor(title)).toUpperCase().slice(0, 4)
const index = String(flag('index', '1')).padStart(3, '0')
const catalog = flag('catalog', `AH—${index} / generated sleeve`)
const note = flag('note', variant === 'petri' ? 'grown, not assembled' : 'peer to peer / settle')
const out = resolve(flag('out', `out/${slugify(title)}-sleeve.svg`))

const fontFile = resolve(flag('font', join(ASSETS, 'syne.woff2')))
const font = existsSync(fontFile) ? readFileSync(fontFile).toString('base64') : ''
if (!font) console.warn(`No display font at ${fontFile} — the ghost word will fall back.`)

// Every number below is the CSS in features/landing-page/studio/work-gallery
// measured against the card width, so a 320-wide sleeve and a 348-wide card
// agree. See references/sleeve.md.
const pad = round(W * 0.058)
const ghostSize = round(W * 0.205)
const tracking = round(-ghostSize * 0.085)
const label = round(W * 0.0215)
const labelTrack = round(label * 0.16)

const codeY = round(H * 0.15)
const ghostY = round(H * 0.64)
const noteY = round(H * 0.87)

const ringR = round(W * 0.41)
const ringCx = round(W * 0.77)
const ringCy = round(H * 1.26 - ringR)
const ringStroke = round(W * 0.0057)

// The orbit crosses the sleeve from lower-left to upper-right and must clear
// both the catalog line and the note: 0.52H with a 22° tilt is the widest it
// can be without a node landing on a label.
const orbitY = round(H * 0.52)
const orbitX1 = round(W * 0.08)
const orbitX2 = round(W * 0.92)
const nodeR = round(W * 0.023)

const cellLg = round(W * 0.38)
const cellSm = round(W * 0.19)

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)} cover">
  <title>${esc(title)} — generated sleeve</title>
  <!-- Sunnyside sleeve · ${variant} · ${fieldName} · ${W}×${H}. Numbers: references/sleeve.md -->
  <defs>
    <style>
      ${
        font
          ? `@font-face{font-family:SunnysideDisplay;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:400 800;font-style:normal;}`
          : ''
      }
      .ghost{font-family:${font ? 'SunnysideDisplay,' : ''}'Syne','Space Grotesk',system-ui,sans-serif;font-weight:800;font-size:${ghostSize}px;letter-spacing:${tracking}px}
      .code,.note{font-family:ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;font-size:${label}px;letter-spacing:${labelTrack}px;text-transform:uppercase;opacity:.78}
    </style>
    <pattern id="dots" width="${round(W * 0.026)}" height="${round(W * 0.026)}" patternUnits="userSpaceOnUse">
      <circle cx="${round(W * 0.003)}" cy="${round(W * 0.003)}" r="${round(W * 0.0029)}" fill="${field.fg}"/>
    </pattern>
    <radialGradient id="cell" cx="0.38" cy="0.34" r="0.66">
      <stop offset="0" stop-color="${cellsFill}" stop-opacity="0.82"/>
      <stop offset="0.62" stop-color="${cellsFill}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${field.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" opacity="0.12"/>

  <circle cx="${ringCx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="${field.fg}" stroke-width="${ringStroke}" opacity="0.4"/>

  ${
    variant === 'orbit'
      ? `<g transform="rotate(-22 ${round((orbitX1 + orbitX2) / 2)} ${orbitY})">
    <line x1="${orbitX1}" y1="${orbitY}" x2="${orbitX2}" y2="${orbitY}" stroke="${TANGERINE}" stroke-width="${round(W * 0.0062)}"/>
    <circle cx="${orbitX1}" cy="${orbitY}" r="${nodeR}" fill="${field.bg}" stroke="${field.fg}" stroke-width="${round(W * 0.0047)}"/>
    <circle cx="${orbitX2}" cy="${orbitY}" r="${nodeR}" fill="${field.bg}" stroke="${field.fg}" stroke-width="${round(W * 0.0047)}"/>
  </g>`
      : `<circle cx="${round(W * 0.45 + cellLg / 2)}" cy="${round(H * 0.16 + cellLg / 2)}" r="${round(cellLg / 2)}" fill="url(#cell)" stroke="${field.fg}" stroke-width="${round(W * 0.0047)}" opacity="0.8"/>
  <circle cx="${round(W * 0.7 + cellSm / 2)}" cy="${round(H * 0.4 + cellSm / 2)}" r="${round(cellSm / 2)}" fill="url(#cell)" stroke="${field.fg}" stroke-width="${round(W * 0.0047)}" opacity="0.8"/>`
  }

  <text class="code" x="${pad}" y="${codeY}" fill="${field.fg}">${esc(catalog)}</text>
  <text class="ghost" x="${round(pad * 1.1)}" y="${ghostY}" fill="${field.fg}">${esc(ghost)}</text>
  <text class="note" x="${pad}" y="${noteY}" fill="${field.fg}">${esc(note)}</text>
</svg>
`

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, svg)
console.log(`${out}  ·  ${W}×${H}  ·  ${variant}/${fieldName}  ·  ghost "${ghost}"`)

function round(value) {
  return Math.round(value * 100) / 100
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
