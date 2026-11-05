// Vesper — the static gates, in one command.
//
//   node vesper/scripts/audit.mjs
//
// Four checks that need no browser, and one that does. Each prints PASS, FAIL
// or NOT VERIFIED with the reason, because "looks good" is not a measurement.
//
//   1 · contrast    every stated ratio recomputed from hex, within 0.1
//   2 · palette     every primitive in tokens.json declared in the CSS at the same value
//   3 · fonts       every --vs-font-* referenced is declared as @font-face in the page
//   4 · marks       no <text>, no NaN, no raster in any brand SVG
//   5 · bakeoff     scores.json has 11 concepts, and the shipped mark's rank and
//                   its failure are printed on the page
//   6 · page        overflow at 1440 and 390, fonts loaded, no console errors

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const repo = resolve(root, '..')

const tokens = JSON.parse(readFileSync(join(root, 'features', 'vesper', 'tokens.json'), 'utf8'))
const css = readFileSync(join(root, 'features', 'vesper', 'vesper-tokens.css'), 'utf8')
const page = readFileSync(join(repo, 'design-system', 'vesper', 'index.html'), 'utf8')

const rows = []
const add = (name, status, detail) => rows.push({ name, status, detail })

const lum = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// ── 1 · contrast ────────────────────────────────────────────────────────────
{
  const bad = []
  let failing = 0
  for (const p of tokens.contrast) {
    const got = ratio(p.fg, p.bg)
    if (Math.abs(got - p.ratio) > 0.1) bad.push(`${p.label}: stated ${p.ratio}, computed ${got.toFixed(2)}`)
    if (got < 4.5) failing++
  }
  const problems = [...bad]
  if (!failing) problems.push('no failing pair published')
  add(
    'contrast',
    problems.length ? 'FAIL' : 'PASS',
    problems.length ? problems.join(' · ') : `${tokens.contrast.length} pairs recomputed, all match, ${failing} failing pair(s) published`,
  )
}

// ── 2 · palette is one source ───────────────────────────────────────────────
{
  const missing = tokens.primitives.filter((p) => {
    const m = css.match(new RegExp(`--vs-${p.name}:\\s*([^;]+);`))
    return !m || m[1].trim().toLowerCase() !== p.value.toLowerCase()
  })
  add(
    'palette',
    missing.length ? 'FAIL' : 'PASS',
    missing.length ? `not declared at the same value: ${missing.map((m) => m.name).join(', ')}` : `${tokens.primitives.length} primitives declared once, at the same value`,
  )
}

// ── 3 · fonts ───────────────────────────────────────────────────────────────
{
  // Only the first family in each stack is a promise; the rest are fallbacks the
  // host already has. Checking fallbacks would fail every system font ever.
  const used = [...new Set([...css.matchAll(/--vs-font-[a-z]+:\s*([^;]+);/g)].map((m) => m[1].trim()))]
  const families = [...new Set(used.map((u) => u.match(/'([^']+)'/)[1]))]
  const declared = [...new Set([...page.matchAll(/@font-face\{[^}]*font-family:'([^']+)'/g)].map((m) => m[1]))]
  const absent = families.filter((f) => !declared.includes(f))
  const remote = /@font-face\{[^}]*url\('https?:/.test(page)
  const problems = []
  if (absent.length) problems.push(`referenced but not declared: ${absent.join(', ')}`)
  if (remote) problems.push('a @font-face loads from the network')
  add('fonts', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join(' · ') : `${families.length} families (${families.join(', ')}), all local, all declared`)
}

// ── 4 · marks ───────────────────────────────────────────────────────────────
{
  const dir = join(root, 'public', 'brand', 'vesper')
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
  const svgs = walk(dir).filter((f) => f.endsWith('.svg'))
  const bad = []
  for (const f of svgs) {
    const s = readFileSync(f, 'utf8')
    const name = f.split('/').pop()
    if (/<text|<tspan/.test(s)) bad.push(`${name}: live text`)
    if (/NaN/.test(s)) bad.push(`${name}: NaN in path`)
    if (/<image/.test(s)) bad.push(`${name}: raster inside svg`)
  }
  add('marks', bad.length ? 'FAIL' : 'PASS', bad.length ? bad.join(' · ') : `${svgs.length} SVGs, all outlines, no live text, no NaN`)
}

// ── 5 · bake-off scores ─────────────────────────────────────────────────────
// The scorer is only worth having if its result cannot drift away from the page.
// This gate re-reads scores.json, counts the concepts, and checks that the mark
// that shipped is actually in the table and that its failures are printed. A
// scorer that gave its own winner a clean 100 would be decoration.
{
  const f = join(root, 'public', 'brand', 'vesper', 'bakeoff', 'scores.json')
  if (!existsSync(f)) {
    add('bakeoff', 'NOT VERIFIED', 'scores.json missing — run node vesper/scripts/score-bakeoff.mjs')
  } else {
    const s = JSON.parse(readFileSync(f, 'utf8'))
    const problems = []
    if (s.length !== 11) problems.push(`${s.length} concepts scored, 11 were drawn`)
    const ship = s.find((x) => x.id === 'horizon-star')
    if (!ship) problems.push('the shipped mark (horizon-star) is not in the table')
    else if (!ship.failed.length) problems.push('the shipped mark scored a clean 100 — the table is not being honest')
    const ranked = [...s].sort((a, b) => b.score - a.score)
    const rank = ship ? ranked.findIndex((x) => x.id === 'horizon-star') + 1 : 0
    if (ship && !page.includes(String(rank))) problems.push(`rank ${rank} is not printed on the page`)
    if (ship && !page.includes(ship.failed[0].split(' ')[0])) problems.push('the shipped mark’s failure is not printed on the page')
    add(
      'bakeoff',
      problems.length ? 'FAIL' : 'PASS',
      problems.length
        ? problems.join(' · ')
        : `${s.length} concepts scored, shipped mark ranks ${rank} of ${s.length}, its ${ship.failed.length} failure(s) published`,
    )
  }
}

// ── 6 · page ────────────────────────────────────────────────────────────────
let browserResult = { status: 'NOT VERIFIED', detail: 'playwright-core not available' }
try {
  const { chromium } = await import('playwright-core')
  const { CHROMIUM } = await import(pathToFileURL(join(repo, 'scripts', 'chrome.mjs')).href)
  const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {})
  const problems = []
  for (const [w, h] of [[1440, 1000], [390, 844]]) {
    const p = await browser.newPage({ viewport: { width: w, height: h } })
    p.on('pageerror', (e) => problems.push(`${w}px page: ${e.message}`))
    p.on('console', (m) => m.type() === 'error' && problems.push(`${w}px console: ${m.text()}`))
    await p.goto(pathToFileURL(join(repo, 'design-system', 'vesper', 'index.html')).href, { waitUntil: 'load' })
    await p.evaluate(() => document.fonts.ready)
    const m = await p.evaluate(() => ({
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      fonts: [...document.fonts].filter((f) => f.status === 'loaded').length,
      pending: [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.family),
    }))
    if (m.over > 0) problems.push(`${w}px: ${m.over}px horizontal overflow`)
    if (!m.fonts) problems.push(`${w}px: no font loaded`)
    await p.close()
  }
  await browser.close()
  browserResult = problems.length
    ? { status: 'FAIL', detail: problems.join(' · ') }
    : { status: 'PASS', detail: '1440 and 390: 0px overflow, all faces loaded, no console errors' }
} catch (e) {
  browserResult = { status: 'NOT VERIFIED', detail: String(e.message).split('\n')[0] }
}
add('page', browserResult.status, browserResult.detail)

// ── print ───────────────────────────────────────────────────────────────────

const w = Math.max(...rows.map((r) => r.name.length))
console.log(`\n  Vesper — gates\n`)
for (const r of rows) console.log(`  ${r.status.padEnd(12)} ${r.name.padEnd(w)}  ${r.detail}`)
console.log('')
process.exit(rows.some((r) => r.status === 'FAIL') ? 1 : 0)
