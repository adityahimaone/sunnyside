// Vesper — the mark family, the wordmark and the cast, generated from one
// geometry file. Nothing here is edited by hand: change a number, re-run.
//
//   node vesper/scripts/build-brand.mjs
//
// The winner of the bake-off is "Horizon Star": a four-point star whose lower
// point becomes the post, standing on a 44-unit horizon. The plinth that lost
// round one is gone; the line under the mark is the horizon, not a base.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = join(root, 'public', 'brand', 'vesper')
mkdirSync(join(out, 'cast'), { recursive: true })

export const INK = '#0d1526'
export const CREAM = '#f4ebda'
export const COBALT = '#1b3fa2'
const GRID = 64

// ── geometry ────────────────────────────────────────────────────────────────
// Every number below is a grid unit. The star's arms are quadratic curves whose
// control points sit 3.5 units from the centre line: the cut bows inward by
// exactly 1 unit at the midpoint, which is what makes it read as cut paper
// rather than as a sparkle glyph.

const star = ({ t, r, b, l, cx = 32, cy = 25, bow = 3.5 }) =>
  `M${cx} ${t} Q${cx + bow} ${cy - bow} ${r} ${cy} Q${cx + bow} ${cy + bow} ${cx} ${b} ` +
  `Q${cx - bow} ${cy + bow} ${l} ${cy} Q${cx - bow} ${cy - bow} ${cx} ${t} Z`

const rect = (x, y, w, h) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`

// The mark: a four-point star whose lower point rests on a 44-unit horizon.
// Star 46 wide × 40 tall (10→50), horizon 4 tall at y 50, both centred in 64.
// There is no stem. Round one had one, and a star on a stem on a base is a
// trophy; the horizon is what makes it a setting star.
const mark = [star({ t: 8, r: 55, b: 52, l: 9, cy: 30, bow: 1.6 }), rect(10, 52, 44, 4)]

// The compact is a different drawing, not a scale: fatter arms (bow 4.6), a
// 5-unit horizon and a shorter star, so the silhouette survives 16px.
const compact = [star({ t: 9, r: 55, b: 50, l: 9, cy: 29.5, bow: 2.6 }), rect(12, 50, 40, 5)]

// The glyph is the star alone — the spark used inline, in lists, at 16px,
// where a 4-unit rule would fall below a pixel.
const glyph = [star({ t: 7, r: 57, b: 55, l: 7, cy: 31, bow: 2.6 })]

// ── circle intersection, for the crescent ───────────────────────────────────
// Two arcs, not two circles: an even-odd subtraction leaves the part of the
// inner disc that sticks out, which is a sliver, not a crescent.

function crescent(cx, cy, ro, ix, iy, ri) {
  const dx = ix - cx
  const dy = iy - cy
  const d = Math.hypot(dx, dy)
  const a = (ro * ro - ri * ri + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, ro * ro - a * a))
  const mx = cx + (a * dx) / d
  const my = cy + (a * dy) / d
  const px = (-dy / d) * h
  const py = (dx / d) * h
  const p1 = [mx + px, my + py]
  const p2 = [mx - px, my - py]
  const f = (n) => Math.round(n * 100) / 100
  return `M${f(p1[0])} ${f(p1[1])} A${ro} ${ro} 0 1 1 ${f(p2[0])} ${f(p2[1])} A${ri} ${ri} 0 1 0 ${f(p1[0])} ${f(p1[1])} Z`
}

// ── the cast ────────────────────────────────────────────────────────────────
// Six companion marks for editorial use, drawn on the same 64 grid with the
// same fill-only rule. They are not logos; they are the system's vocabulary.

const cast = {
  moon: {
    line: 'The moon, off-centre.',
    paths: [crescent(32, 32, 24, 42, 26, 19)],
  },
  horizon: {
    line: 'The line, and what sits on it.',
    paths: ['M8 46 A24 24 0 0 1 56 46 Z', rect(6, 50, 52, 4)],
  },
  lamp: {
    line: 'The object itself.',
    paths: [rect(28, 2, 8, 6), 'M26 8 H38 L42 24 H22 Z', rect(29, 24, 6, 28), rect(24, 52, 16, 4)],
  },
  figure: {
    line: 'Someone already out there.',
    paths: [
      'M29 6 H35 V13 H29 Z',
      'M27 15 H37 L39 34 H35 L34 30 H30 L29 34 H25 Z',
      'M29 34 H31 V50 H29 Z M33 34 H35 V50 H33 Z',
      rect(28, 50, 3, 6),
      rect(33, 50, 3, 6),
    ],
  },
  ray: {
    line: 'Light, before the object.',
    paths: [
      'M31 30 L9 12 L12 8 L32 27 Z',
      'M32 27 L24 4 L29 2 L34 26 Z',
      'M33 26 L41 3 L46 5 L35 27 Z',
      'M32 27 L55 9 L58 13 L34 30 Z',
    ],
  },
  grain: {
    line: 'The stipple, as a unit.',
    paths: [
      'M10 18 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',
      'M22 12 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
      'M38 14 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0',
      'M50 20 m-4.5 0 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0',
      'M14 32 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
      'M30 30 m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0',
      'M46 34 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',
      'M20 46 m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0',
      'M36 44 m-4.5 0 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0',
      'M50 50 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0',
      'M8 54 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0',
      'M28 56 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0',
    ],
  },
}

// ── wordmark ────────────────────────────────────────────────────────────────
// Outlined once from the Fraunces display instance (wght 400, opsz 144,
// SOFT 30). Cap height is normalised to 26 units so it locks to the mark.

const wm = JSON.parse(readFileSync(join(out, 'wordmark.json'), 'utf8'))
const wordW = wm.width
const wmH = wm.height
// The run is drawn in font units and flipped once by this transform, so a
// lockup only has to translate it.
const wmTransform = (x, y) => `translate(${x} ${y}) ${wm.transform}`

// ── writers ─────────────────────────────────────────────────────────────────

const svg = ({ w, h, paths, fill, extra = '' }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img">` +
  `<g fill="${fill}" fill-rule="evenodd">${paths.map((d) => `<path d="${d}"/>`).join('')}</g>${extra}</svg>\n`

const write = (name, content) => {
  writeFileSync(join(out, name), content)
  return name
}

const written = []

// The mark, four inks.
written.push(write('mark.svg', svg({ w: GRID, h: GRID, paths: mark, fill: INK })))
written.push(write('mark-reverse.svg', svg({ w: GRID, h: GRID, paths: mark, fill: CREAM })))
written.push(write('mark-mono.svg', svg({ w: GRID, h: GRID, paths: mark, fill: '#000000' })))
written.push(write('mark-compact.svg', svg({ w: GRID, h: GRID, paths: compact, fill: INK })))
written.push(write('mark-compact-reverse.svg', svg({ w: GRID, h: GRID, paths: compact, fill: CREAM })))
written.push(write('glyph.svg', svg({ w: GRID, h: GRID, paths: glyph, fill: INK })))

// The app icon: the mark reversed on cobalt, 12-unit radius, 4-unit optical inset.
written.push(
  write(
    'icon.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" width="${GRID}" height="${GRID}" role="img">` +
      `<rect width="${GRID}" height="${GRID}" rx="13" fill="${COBALT}"/>` +
      `<g fill="${CREAM}" fill-rule="evenodd" transform="translate(3 3) scale(.906)">${mark
        .map((d) => `<path d="${d}"/>`)
        .join('')}</g></svg>\n`,
  ),
)

// Wordmark, and its reverse. The box is the ink, not the advance.
written.push(
  write(
    'wordmark.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wordW} ${wmH}" width="${wordW}" height="${wmH}" role="img"><path d="${wm.path}" fill="${INK}" transform="${wm.transform}"/></svg>\n`,
  ),
)
written.push(
  write(
    'wordmark-reverse.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wordW} ${wmH}" width="${wordW}" height="${wmH}" role="img"><path d="${wm.path}" fill="${CREAM}" transform="${wm.transform}"/></svg>\n`,
  ),
)

// Lockups: horizontal (gap 18) and stacked (gap 10, wordmark centred under the mark).
const gapH = 18
const lockW = GRID + gapH + wordW
const lockH = GRID
const lockup = (fill, wmFill) =>
  svg({
    w: Math.round(lockW),
    h: lockH,
    paths: mark,
    fill,
    extra: `<path d="${wm.path}" fill="${wmFill}" transform="${wmTransform(GRID + gapH, (GRID - wmH) / 2)}"/>`,
  })
written.push(write('lockup.svg', lockup(INK, INK)))
written.push(write('lockup-reverse.svg', lockup(CREAM, CREAM)))

const stackW = Math.max(GRID, wordW)
const stackH = GRID + 8 + wmH
const stacked = (fill, wmFill) =>
  svg({
    w: Math.round(stackW),
    h: Math.round(stackH),
    paths: mark,
    fill,
    extra: `<path d="${wm.path}" fill="${wmFill}" transform="${wmTransform((stackW - wordW) / 2, GRID + 8)}"/>`,
  })
written.push(write('lockup-stacked.svg', stacked(INK, INK)))
written.push(write('lockup-stacked-reverse.svg', stacked(CREAM, CREAM)))

// Cast
for (const [id, c] of Object.entries(cast)) {
  written.push(write(join('cast', `${id}.svg`), svg({ w: GRID, h: GRID, paths: c.paths, fill: INK })))
  written.push(write(join('cast', `${id}-reverse.svg`), svg({ w: GRID, h: GRID, paths: c.paths, fill: CREAM })))
}

// A favicon that is the icon at 16 — same file, the browser scales it.
writeFileSync(join(out, 'favicon.svg'), readFileSync(join(out, 'icon.svg')))

console.log(`\n  Vesper — brand family\n`)
console.log(`  wordmark   ${wordW} × ${wmH} units (Fraunces 400 / opsz 144 / SOFT 30)`)
console.log(`  lockup     ${Math.round(lockW)} × ${lockH}`)
console.log(`  stacked    ${Math.round(stackW)} × ${Math.round(stackH)}`)
console.log(`  files      ${written.length + 1} written to public/brand/vesper\n`)
