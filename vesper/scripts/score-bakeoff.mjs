// The bake-off scorer. The audit originally said this could not run because
// `score-mark.py` needs cairosvg + Pillow, neither of which is installed. That
// was true of Python, not of this machine: Chrome can rasterise an SVG into a
// canvas and hand back pixels, so the measurement happens there and the
// dependency disappears.
//
// What it measures, and why each one is on the list:
//
//   cover       ink area / canvas area at 16px. Below ~8% the mark greys out at
//               favicon size; above ~32% the counters close and it turns into a
//               blob. This is the one that kills floating-dot concepts.
//   parts       connected ink components at 16px. A mark that needs six specks
//               to be itself is six specks that will merge or vanish.
//   retention   cover@16 / cover@40. Aliasing drops thin features first, so a
//               mark that keeps less than three quarters of its ink between 40
//               and 16 is a mark whose drawing is not surviving the downscale.
//               This is the direct measure of "holds at small size".
//   collapse    parts@128 − parts@16. Separate elements merging into one is the
//               other way a drawing dies at size: six stars become one blob.
//   balance     centroid distance from the canvas centre, as a fraction of size.
//   grid        ink bounding box, longest side / canvas. A mark that uses a third
//               of its own grid looks small in a 40px slot next to its siblings.
//   primitives  author-declared subpath count. Fewer parts, fewer ways to break.
//   distinct    max IoU against every other concept at 128px, ignoring the
//               concept this one was revised from. Comparing a mark to the
//               version it replaced is a diff, not a distinctness test.
//
// `stroke` (how many 1px erosions the ink survives) is computed and printed but
// is NOT a gate. It measures boldness, not survival: a 4-unit rule on a 64 grid
// is 1px at 16px and can never contain a 3 × 3 solid block, so every fine
// cut-line mark scores 0 no matter how well it reads. Gating on it would have
// quietly demanded a fatter mark than the artwork supports.
//
// Every criterion is a pass/fail with a stated threshold, so the total is an
// argument you can audit, not a number that fell out of a model.

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { concepts, svg as svg1 } from './marks.mjs'
import { round2 } from './marks2.mjs'

const here = dirname(fileURLToPath(import.meta.url))

// Round two did not add five ideas; it replaced the plinth. These are the
// ancestor pairs: a concept and the concept it was revised from. Distinctness is
// not measured across them, because they are supposed to be the same idea.
const ANCESTORS = { 'horizon-star': ['lodestar'], way: ['rung'] }

const all = [
  ...concepts.map((c) => ({ ...c, round: 1, svg: svg1(c.paths, { fill: '#000' }) })),
  ...round2.map((c) => ({ ...c, round: 2, svg: svg1(c.paths, { fill: '#000' }) })),
]

const SIZES = [128, 40, 16]

// --- the browser does the rasterising ---------------------------------------
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const page = await browser.newPage({ viewport: { width: 400, height: 400 } })
await page.setContent('<canvas id="c"></canvas>')

const raster = async (svgText, size) => {
  // No devicePixelRatio here: we want the true 16 × 16 grid, aliasing and all.
  return page.evaluate(
    async ({ svgText, size }) => {
      const img = new Image()
      img.src = 'data:image/svg+xml;base64,' + btoa(svgText)
      await img.decode()
      const cv = document.getElementById('c')
      cv.width = size
      cv.height = size
      const cx = cv.getContext('2d', { willReadFrequently: true })
      cx.clearRect(0, 0, size, size)
      cx.drawImage(img, 0, 0, size, size)
      const d = cx.getImageData(0, 0, size, size).data
      const m = new Uint8Array(size * size)
      for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 96 ? 1 : 0
      return Array.from(m)
    },
    { svgText, size },
  )
}

// --- measurements -----------------------------------------------------------
const components = (m, n) => {
  const seen = new Uint8Array(n * n)
  let count = 0
  const stack = []
  for (let i = 0; i < m.length; i++) {
    if (!m[i] || seen[i]) continue
    count++
    stack.push(i)
    seen[i] = 1
    while (stack.length) {
      const p = stack.pop()
      const x = p % n
      const y = (p - x) / n
      const nb = [
        x > 0 ? p - 1 : -1,
        x < n - 1 ? p + 1 : -1,
        y > 0 ? p - n : -1,
        y < n - 1 ? p + n : -1,
      ]
      for (const q of nb) {
        if (q >= 0 && m[q] && !seen[q]) {
          seen[q] = 1
          stack.push(q)
        }
      }
    }
  }
  return count
}

const erode = (m, n) => {
  const o = new Uint8Array(n * n)
  for (let y = 1; y < n - 1; y++)
    for (let x = 1; x < n - 1; x++) {
      const p = y * n + x
      if (
        m[p] &&
        m[p - 1] && m[p + 1] && m[p - n] && m[p + n] &&
        m[p - n - 1] && m[p - n + 1] && m[p + n - 1] && m[p + n + 1]
      )
        o[p] = 1
    }
  return o
}

const measure = (m, n) => {
  let ink = 0, sx = 0, sy = 0
  let x0 = n, y0 = n, x1 = -1, y1 = -1
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (m[y * n + x]) {
        ink++
        sx += x + 0.5
        sy += y + 0.5
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
  let stroke = 0
  let cur = m
  while (stroke < 12) {
    const e = erode(cur, n)
    let any = 0
    for (let i = 0; i < e.length; i++) if (e[i]) { any = 1; break }
    if (!any) break
    stroke++
    cur = e
  }
  const cx = ink ? sx / ink : n / 2
  const cy = ink ? sy / ink : n / 2
  const off = Math.hypot(cx - n / 2, cy - n / 2) / n
  const span = ink ? Math.max(x1 - x0 + 1, y1 - y0 + 1) / n : 0
  return {
    ink,
    cover: ink / (n * n),
    parts: components(m, n),
    stroke,
    balance: off,
    grid: span,
  }
}

// --- score ------------------------------------------------------------------
const T = {
  coverMin: 0.08,
  coverMax: 0.32,
  parts: 3,
  retention: 0.75,
  collapse: 1,
  balance: 0.06,
  grid: 0.7,
  primitives: 3,
  distinct: 0.62,
}

const results = []
for (const c of all) {
  const m128 = await raster(c.svg, 128)
  const m40 = await raster(c.svg, 40)
  const m16 = await raster(c.svg, 16)
  results.push({
    id: c.id,
    name: c.name,
    round: c.round,
    primitives: c.primitives,
    at128: measure(m128, 128),
    at40: measure(m40, 40),
    at16: measure(m16, 16),
    m128,
  })
}

// pairwise distinctness at 128, on the union of both masks, skipping ancestors
for (const a of results) {
  let worst = 0
  let against = null
  const skip = new Set([...(ANCESTORS[a.id] || []), a.id])
  for (const b of results) {
    if (skip.has(b.id)) continue
    let inter = 0
    let union = 0
    for (let i = 0; i < a.m128.length; i++) {
      const x = a.m128[i]
      const y = b.m128[i]
      if (x || y) union++
      if (x && y) inter++
    }
    const iou = union ? inter / union : 0
    if (iou > worst) { worst = iou; against = b.id }
  }
  a.iouWorst = worst
  a.iouAgainst = against
}

const judge = (r) => {
  const s = r.at16
  const m = r.at40
  const retention = m.cover ? s.cover / m.cover : 0
  const collapse = r.at128.parts - s.parts
  r.retention = retention
  r.collapse = collapse
  const checks = [
    ['holds at 16', s.cover >= T.coverMin && s.cover <= T.coverMax, `cover ${(s.cover * 100).toFixed(1)}%`],
    ['one piece', s.parts <= T.parts, `${s.parts} part${s.parts === 1 ? '' : 's'}`],
    ['keeps its ink', retention >= T.retention, `retention ${(retention * 100).toFixed(0)}%`],
    ['nothing merges', collapse <= T.collapse, `${collapse} merged`],
    ['balanced', s.balance <= T.balance, `offset ${(s.balance * 100).toFixed(1)}%`],
    ['fills its grid', r.at128.grid >= T.grid, `grid ${(r.at128.grid * 100).toFixed(0)}%`],
    ['few parts', r.primitives <= T.primitives, `${r.primitives} primitives`],
    ['distinct', r.iouWorst <= T.distinct, `IoU ${r.iouWorst.toFixed(2)} vs ${r.iouAgainst}`],
  ]
  const passed = checks.filter((c) => c[1]).length
  return { checks, passed, score: Math.round((passed / checks.length) * 100) }
}

for (const r of results) Object.assign(r, judge(r))
results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))

// --- report -----------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n)
const bar = (v) => '█'.repeat(Math.round(v * 40)).padEnd(40, '·')

let out = `\n  Vesper — bake-off, scored\n\n`
out += `  ${pad('', 3)}${pad('concept', 16)}${pad('score', 7)}${pad('cover@16', 10)}${pad('parts', 7)}${pad('retain', 8)}${pad('merge', 7)}${pad('balance', 9)}${pad('IoU', 6)}stroke\n`
out += `  ${'-'.repeat(78)}\n`
results.forEach((r, i) => {
  out += `  ${pad(i + 1, 3)}${pad(r.name, 16)}${pad(r.score, 7)}${pad((r.at16.cover * 100).toFixed(1) + '%', 10)}${pad(r.at16.parts, 7)}${pad((r.retention * 100).toFixed(0) + '%', 8)}${pad(r.collapse, 7)}${pad((r.at16.balance * 100).toFixed(1) + '%', 9)}${pad(r.iouWorst.toFixed(2), 6)}${r.at16.stroke}px\n`
})
out += `\n  coverage at 16px (band ${T.coverMin * 100}–${T.coverMax * 100}%)\n`
for (const r of results) out += `  ${pad(r.name, 16)}${bar(r.at16.cover)} ${(r.at16.cover * 100).toFixed(1)}%\n`

const fail = (r) => r.checks.filter((c) => !c[1]).map((c) => `${c[0]} (${c[2]})`)
out += `\n  what each one loses\n`
for (const r of results) {
  const f = fail(r)
  out += `  ${pad(r.name, 16)}${f.length ? f.join('; ') : 'nothing'}\n`
}

// Does the scorer agree with the mark that shipped?
const shipped = results.find((r) => r.id === 'horizon-star')
const winner = results[0]
out += `\n  shipped mark: Horizon Star — rank ${results.indexOf(shipped) + 1} of ${results.length}, score ${shipped.score}\n`
out += `  top of table: ${winner.name} — score ${winner.score}\n`
out += `\n  note: this scores survival, not meaning. Nothing here can tell whether a\n`
out += `  shape says "lamp" or "evening"; that judgement stays with the brief.\n`

console.log(out)

writeFileSync(
  resolve(here, '../public/brand/vesper/bakeoff/scores.json'),
  JSON.stringify(
    results.map((r) => ({
      id: r.id,
      name: r.name,
      round: r.round,
      score: r.score,
      primitives: r.primitives,
      cover16: +r.at16.cover.toFixed(4),
      parts16: r.at16.parts,
      stroke16: r.at16.stroke,
      retention: +r.retention.toFixed(3),
      collapse: r.collapse,
      balance16: +r.at16.balance.toFixed(4),
      grid128: +r.at128.grid.toFixed(4),
      iouWorst: +r.iouWorst.toFixed(3),
      iouAgainst: r.iouAgainst,
      failed: fail(r),
    })),
    null,
    2,
  ) + '\n',
)

await browser.close()
