// Six records of one gust. The mark is a table of placements, not a formula: the
// flower is the shape the wind left it in, so the table is irregular on purpose.
import { writeFile } from 'node:fs/promises'
import { curvedPetal } from './petal.mjs'

const INK = '#22181b'
const SIGNAL = '#b42a5e'
const n2 = (v) => Number(v.toFixed(2))

// a: angle from up, clockwise · r: base distance from centre · l: length · b: bend
const table = (rows) => rows.map(([a, r, l, b, ink]) => ({ a, r, l, b, ink }))

const body = (rows, size = 64) => {
  const c = size / 2
  const k = size / 64
  return rows
    .map(
      (p) =>
        `<path d="${curvedPetal(p.l * k, p.l * k * (p.w ?? 0.36), p.b ?? 0.12)}" transform="translate(${n2(c + p.r * k * Math.sin((p.a * Math.PI) / 180))} ${n2(c - p.r * k * Math.cos((p.a * Math.PI) / 180))}) rotate(${p.a})" fill="${p.ink ?? INK}"/>`,
    )
    .join('')
}

const svg = (size, b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${b}</svg>`

// G — four attached, one taken. The gap is 134°, and the flying petal sits in it.
const G = table([
  [2, 4.6, 21, 0.1],
  [76, 5.4, 19.5, 0.14],
  [148, 4.8, 20.5, 0.08],
  [228, 6.0, 18.5, 0.16],
  [294, 16.4, 11.5, 0.2, SIGNAL],
])

// H — same gap, wider petals, tighter flying petal
const H = table([
  [4, 4.2, 21.5, 0.08],
  [78, 5.0, 20, 0.12],
  [150, 4.4, 21, 0.06],
  [230, 5.6, 19, 0.14],
  [296, 15.2, 12.5, 0.16, SIGNAL],
])

// I — five attached at irregular spacing, no detachment (a gust, not a loss)
const I = table([
  [-6, 4.4, 21, 0.1],
  [62, 5.2, 19, 0.12],
  [136, 4.6, 22, 0.08],
  [212, 5.8, 18, 0.14],
  [286, 4.2, 20, 0.1],
])

// J — four petals only, one accent, bigger and blunter
const J = table([
  [6, 4.8, 22, 0.1],
  [84, 5.6, 20, 0.12],
  [162, 5.0, 21, 0.08],
  [246, 6.2, 19, 0.14, SIGNAL],
])

// K — the flying petal further out and smaller, more air
const K = table([
  [0, 4.4, 20, 0.1],
  [74, 5.0, 18.5, 0.14],
  [146, 4.6, 19.5, 0.08],
  [226, 5.6, 17.5, 0.16],
  [292, 19.5, 9, 0.22, SIGNAL],
])

// L — slimmer, more air between petals
const L = table([
  [4, 5.2, 22, 0.1],
  [78, 6.0, 20, 0.12],
  [150, 5.4, 21, 0.08],
  [230, 6.6, 19, 0.14],
  [296, 17.5, 11, 0.18, SIGNAL],
]).map((p) => ({ ...p, w: 0.31 }))

const variants = [
  ['G · four + one taken', G],
  ['H · wider petals', H],
  ['I · five, irregular', I],
  ['J · four only', J],
  ['K · more air', K],
  ['L · slim', L],
]

const cell = ([k, rows]) => {
  const big = svg(240, `<g transform="translate(120 120) scale(3.75) translate(-32 -32)">${body(rows)}</g>`)
  const small = [64, 32, 16].map((s) => svg(s, body(rows, s))).join('')
  return `<figure><div class="big">${big}</div><div class="small">${small}</div><figcaption>${k}</figcaption></figure>`
}

const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#f7f0e4;font:11px ui-monospace,monospace;color:${INK};padding:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
figure{margin:0;background:#fffcf6;padding:14px;border:1px solid rgba(34,24,27,.12)}
.big{display:flex;justify-content:center;margin-bottom:12px}
.small{display:flex;gap:12px;align-items:flex-end;justify-content:center;padding-bottom:10px}
figcaption{text-align:center;letter-spacing:.04em;opacity:.7}
</style>${variants.map(cell).join('')}`

await writeFile(new URL('../_variants.html', import.meta.url), html)
console.log('wrote _variants.html')
