// Vesper — the two copies, measured against each other.
//
//   node vesper/scripts/parity.mjs
//
// The design system exists twice: as generated HTML in this repo, and as a React
// route in the app repo. Two copies drift. This script is the only honest way to
// know whether they have.
//
// The trick is picking a key that survives the port. Class names do not (the
// port prefixes every one with `vs-`), and neither does DOM structure (React
// renders it in a different order). What survives is the words. So every leaf
// text node is keyed by `tag|text`, and compared on:
//
//   · paint    colour, font-size, font-weight, background
//   · geometry width, height, and left offset — never `y`, which is just the
//              running total of everything above it
//
// Geometry is the font check. If the app resolved `Fraunces` and the static page
// resolved `Fraunces`, a 112px heading measures the same width. If it fell back
// to Georgia it does not. That is why `fontFamily` is deliberately not compared:
// Next emits `__Fraunces_abc123` and the static page emits `Fraunces`, and the
// two strings differ while the rendering is identical. Comparing names would
// report a false failure; comparing pixels cannot.
//
// Left offset is compared but `y` is not, so a section that grows by 37px shows
// up exactly once — in the section height table — instead of as 200 cascading
// "diffs" that all mean the same thing.
//
// Three passes: desktop day, mobile day, desktop night. Day is where the layout
// lives, mobile is where the breakpoints live, and night is where 16 token
// overrides live. All three have to agree.

import { chromium } from 'playwright-core'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')
const STATIC = pathToFileURL(resolve(root, 'design-system/vesper/index.html')).href
const APP = 'http://localhost:3000/design-system/vesper'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const PASSES = [
  { label: 'desktop · day', width: 1440, mode: 'day' },
  { label: 'mobile · day', width: 390, mode: 'day' },
  { label: 'desktop · night', width: 1440, mode: 'night' },
]

// The one place the two copies are *meant* to differ. The static page hid its
// skip link with an inline `left:-9999px`; a React port cannot carry an inline
// style, so the porter gave it a real rule — and made it visible on focus, which
// the original never did. That is a repair, not a regression, so it is named
// here rather than silently tolerated.
const INTENTIONAL = new Map([
  ['a|Skip to the idea', 'skip link is a real :focus rule in the port, inline style in the static page'],
])

// ── the in-page probe ────────────────────────────────────────────────────────
// Runs in both documents, unchanged, so the two results are comparable.
function probe() {
  const paint = ['color', 'fontSize', 'fontWeight', 'backgroundColor']
  const box = (el) => {
    const r = el.getBoundingClientRect()
    return {
      x: Math.round(r.x * 100) / 100,
      w: Math.round(r.width * 100) / 100,
      h: Math.round(r.height * 100) / 100,
    }
  }
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim()

  const sections = [...document.querySelectorAll('section')].map((s, i) => {
    const h = s.querySelector('h1,h2,h3')
    const r = s.getBoundingClientRect()
    return {
      i,
      key: clean(h ? h.textContent : '') || `section-${i}`,
      h: Math.round(r.height * 100) / 100,
    }
  })

  // Leaf text nodes only. An element with element children duplicates the text
  // of its descendants and would double-count every diff.
  const leaf =
    'h1,h2,h3,h4,h5,h6,p,li,th,td,figcaption,dt,dd,blockquote,span,a,button,code,summary,label'
  const nodes = []
  for (const el of document.querySelectorAll(leaf)) {
    if (el.childElementCount > 0) continue
    const text = clean(el.textContent)
    if (!text) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    const rec = { tag: el.tagName.toLowerCase(), text: text.slice(0, 80), ...box(el) }
    for (const p of paint) rec[p] = cs[p]
    nodes.push(rec)
  }

  return {
    height: Math.round(document.documentElement.scrollHeight),
    scrollW: Math.round(document.documentElement.scrollWidth),
    sections,
    nodes,
  }
}

async function load(browser, url, width, mode) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  if (mode === 'night') {
    // The static page puts the attribute on <html>; the port puts it on the
    // scope root, because the app's <html> belongs to the site shell. Set both
    // so neither copy gets an unfair advantage.
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-vesper', 'night')
      document.querySelector('.vs-scope')?.setAttribute('data-vesper', 'night')
    })
  }

  // Kill motion. Entrance animations set transform and opacity, never layout, but
  // a 0.6s stagger means some elements are still at opacity 0 when we measure,
  // and an opacity-0 element is skipped by the probe. Flatten it.
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}`,
  })
  await page.waitForTimeout(350)

  return { data: await page.evaluate(probe), errors }
}

// ── the diff ────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n)
const padL = (s, n) => String(s).padStart(n)
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const OFF = '\x1b[0m'

const browser = await chromium.launch({ executablePath: CHROME })
let totalFailures = 0

for (const pass of PASSES) {
  const a = await load(browser, STATIC, pass.width, pass.mode)
  const b = await load(browser, APP, pass.width, pass.mode)

  let failures = 0
  const fail = (msg) => {
    failures++
    console.log(`${RED}FAIL${OFF}  ${msg}`)
  }

  console.log(`\n\x1b[1mVesper parity — ${pass.label} @ ${pass.width}px\x1b[0m`)
  console.log(`${DIM}static ${a.data.scrollW}×${a.data.height}   app ${b.data.scrollW}×${b.data.height}${OFF}`)

  // 1 · document height
  const dh = b.data.height - a.data.height
  if (dh === 0) console.log(`${GREEN}PASS${OFF}  document height identical (${a.data.height}px)`)
  else fail(`document height ${dh > 0 ? '+' : ''}${dh}px  (static ${a.data.height}, app ${b.data.height})`)

  // 2 · sections
  const byKey = (list) => new Map(list.map((s) => [s.key, s]))
  const sa = byKey(a.data.sections)
  const sb = byKey(b.data.sections)
  let drifted = 0
  for (const k of new Set([...sa.keys(), ...sb.keys()])) {
    const x = sa.get(k)
    const y = sb.get(k)
    const label = k.length > 44 ? k.slice(0, 44) + '…' : k
    if (!x || !y) {
      drifted++
      console.log(`${DIM}${x ? 'only-static' : 'only-app'}${OFF} ${pad(label, 46)} ${x ? x.h : y.h}`)
      continue
    }
    const d = Math.round((y.h - x.h) * 100) / 100
    if (Math.abs(d) < 1) continue
    drifted++
    console.log(`${RED}DIFF${OFF}  ${pad(label, 46)} ${padL(x.h, 8)} → ${padL(y.h, 8)}  ${d > 0 ? '+' : ''}${d}px`)
  }
  if (drifted === 0) console.log(`${GREEN}PASS${OFF}  all ${sa.size} section heights identical`)

  // 3 · nodes
  const index = (list) => {
    const m = new Map()
    for (const n of list) {
      const k = `${n.tag}|${n.text}`
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(n)
    }
    return m
  }
  const na = index(a.data.nodes)
  const nb = index(b.data.nodes)

  let compared = 0
  const paintDiffs = []
  const geomDiffs = []
  const excused = new Map()
  const onlyStatic = []
  const onlyApp = []

  for (const [k, list] of na) {
    const other = nb.get(k)
    if (!other) {
      onlyStatic.push(`${k} ×${list.length}`)
      continue
    }
    const n = Math.min(list.length, other.length)
    if (list.length !== other.length) onlyStatic.push(`${k} ×${list.length - n}`)
    for (let i = 0; i < n; i++) {
      const x = list[i]
      const y = other[i]
      compared++
      const diffs = []
      for (const p of ['color', 'fontSize', 'fontWeight', 'backgroundColor']) {
        if (x[p] !== y[p]) diffs.push({ p, a: x[p], b: y[p] })
      }
      for (const p of ['x', 'w', 'h']) {
        const d = Math.round((y[p] - x[p]) * 100) / 100
        if (Math.abs(d) >= 1) diffs.push({ p, a: x[p], b: y[p], d })
      }
      if (!diffs.length) continue
      if (INTENTIONAL.has(k)) {
        excused.set(k, (excused.get(k) || 0) + 1)
        continue
      }
      for (const d of diffs) (d.p === 'x' || d.p === 'w' || d.p === 'h' ? geomDiffs : paintDiffs).push({ k, ...d })
    }
  }
  for (const [k, list] of nb) {
    const other = na.get(k)
    if (!other) onlyApp.push(`${k} ×${list.length}`)
    else if (list.length > other.length) onlyApp.push(`${k} ×${list.length - other.length}`)
  }

  if (!paintDiffs.length && !geomDiffs.length) {
    console.log(`${GREEN}PASS${OFF}  ${compared} leaf text nodes match on colour, size, weight, background, width, height and left offset`)
    console.log(`${DIM}      (the box check is the font check: a fallback face would change the measured width)${OFF}`)
  } else {
    if (paintDiffs.length) {
      fail(`${paintDiffs.length} paint differences`)
      for (const d of paintDiffs.slice(0, 12)) console.log(`        ${d.p.padEnd(15)} ${d.a} → ${d.b}   ${DIM}${d.k.slice(0, 48)}${OFF}`)
      if (paintDiffs.length > 12) console.log(`        ${DIM}… ${paintDiffs.length - 12} more${OFF}`)
    }
    if (geomDiffs.length) {
      fail(`${geomDiffs.length} geometry differences`)
      for (const d of geomDiffs.slice(0, 12))
        console.log(`        ${d.p.padEnd(3)} ${padL(d.a, 8)} → ${padL(d.b, 8)}  ${d.d > 0 ? '+' : ''}${d.d}   ${DIM}${d.k.slice(0, 44)}${OFF}`)
      if (geomDiffs.length > 12) console.log(`        ${DIM}… ${geomDiffs.length - 12} more${OFF}`)
    }
  }

  for (const [k, n] of excused) console.log(`${DIM}excused${OFF} ${k.slice(0, 40)} ×${n} — ${INTENTIONAL.get(k)}`)

  if (onlyStatic.length) {
    console.log(`\n${DIM}only in static (${onlyStatic.length})${OFF}`)
    for (const k of onlyStatic.slice(0, 10)) console.log(`        ${DIM}${k.slice(0, 68)}${OFF}`)
  }
  if (onlyApp.length) {
    console.log(`\n${DIM}only in app (${onlyApp.length})${OFF}`)
    for (const k of onlyApp.slice(0, 10)) console.log(`        ${DIM}${k.slice(0, 68)}${OFF}`)
  }

  // 4 · console
  const errs = [...a.errors, ...b.errors]
  if (errs.length) fail(`${errs.length} console errors: ${errs.slice(0, 3).join(' | ')}`)
  else console.log(`${GREEN}PASS${OFF}  no console errors in either copy`)

  totalFailures += failures
}

await browser.close()

console.log(
  `\n${
    totalFailures === 0
      ? `${GREEN}${'─'.repeat(54)}\n  parity holds across all ${PASSES.length} passes${OFF}`
      : `${RED}${'─'.repeat(54)}\n  ${totalFailures} failing check${totalFailures > 1 ? 's' : ''}${OFF}`
  }\n`,
)
process.exit(totalFailures === 0 ? 0 : 1)
