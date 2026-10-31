#!/usr/bin/env node
/**
 * The static gates, in one command. Run it after the tokens exist — not at the end.
 *
 *   node scripts/gates.mjs --slug <slug> [--refs refs/] [--min 70] [--json]
 *
 * Before this existed, "run the gates" meant five commands read in five formats, and the
 * cheap ones (a font that is never loaded, a contrast pair nobody computed) were found
 * after the board, the page and the Figma export had already been built on top of them.
 *
 *   detach        weakest score against every sibling in features/*, plus --refs/*.json
 *   display face  H3 from the detach run: the same display face is a hard fail
 *   palette       every primitive in tokens.json is declared in <slug>-tokens.css at the same value
 *   font          every var(--font-*) in <slug>-tokens.css is declared in a layout
 *   contrast      pairs recomputed from hex, the stated ratio must match, one failure published
 *   assets        every file in public/brand/<slug>/assets has a licence record
 *   export        figma-smoke on design/figma/<slug>/code.js, when it exists
 *
 * Not here, because they need a rendered page: mark at 16px and reduced motion — qa.mjs.
 *
 * Paths follow the output contract in SKILL.md. Exit 1 on any FAIL; SKIP is not a pass,
 * it is a gate that could not run, and it says why. Zero dependencies.
 */
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { findTokens, readTokens } from './lib/tokens.mjs'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const flag = (n, d) => (args.includes(`--${n}`) ? (args[args.indexOf(`--${n}`) + 1]?.startsWith('--') ? true : args[args.indexOf(`--${n}`) + 1]) : d)

const slug = flag('slug')
if (!slug || slug === true) {
  console.error('Usage: node scripts/gates.mjs --slug <slug> [--root .] [--refs refs/] [--min 70] [--json]')
  process.exit(1)
}
const root = resolve(flag('root', '.'))
const min = Number(flag('min', 70))
const at = (...p) => join(root, ...p)
const rows = []
const gate = (name, status, detail) => rows.push({ name, status, detail })

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'))

/* ── colour ──────────────────────────────────────────────────────────────── */

const lum = (hex) => {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6)
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(f.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const isHex = (v) => typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})/i.test(v)

/* ── a case without tokens.json cannot be measured ───────────────────────── */

// The output contract says every case ships features/<slug>/tokens.json. When the case folder
// exists without it, that is a defect to report, not a gate to skip: a green font check beside
// four silent skips reads as "passed" to anyone skimming the table.
function missingTokens(name) {
  const exists = existsSync(at('features', slug)) || existsSync(at('public', 'brand', slug))
  gate(name, exists ? 'FAIL' : 'SKIP', exists ? `no tokens.json (looked in features/${slug}/ and public/brand/${slug}/) — the output contract requires one, and without it nothing here can be measured` : `no features/${slug} or public/brand/${slug}`)
  return true
}

/* ── 1 + 2 · detach and display face ─────────────────────────────────────── */

async function detach() {
  const own = findTokens(root, slug)
  if (!own) return missingTokens('detach') && gate('display face', 'SKIP', 'needs detach')

  const refs = []
  const featuresDir = at('features')
  if (existsSync(featuresDir))
    for (const d of await readdir(featuresDir)) {
      const f = d === slug ? null : findTokens(root, d)
      if (f) refs.push(f)
    }
  const extra = flag('refs')
  if (extra && extra !== true && existsSync(resolve(extra)))
    for (const f of await readdir(resolve(extra))) if (f.endsWith('.json')) refs.push(join(resolve(extra), f))

  if (!refs.length) return gate('detach', 'SKIP', 'no sibling tokens.json and no --refs: nothing to measure against') && gate('display face', 'SKIP', 'needs detach')

  let out
  try {
    out = (await run('node', [join(here, 'detach-check.mjs'), '--new', own, ...refs.flatMap((r) => ['--ref', r]), '--json', '--min', String(min)], { maxBuffer: 1 << 24 })).stdout
  } catch (e) {
    out = e.stdout // exit 1 is a verdict, not a crash
    if (!out) return gate('detach', 'FAIL', `detach-check crashed: ${String(e.stderr ?? e.message).split('\n')[0]}`) && gate('display face', 'SKIP', 'needs detach')
  }
  const data = JSON.parse(out)
  const hard = data.results.flatMap((r) => r.hard.map((h) => `${h} (vs ${r.ref})`))
  const weakest = data.results.reduce((a, r) => (r.score < a.score ? r : a), data.results[0])
  const faceFails = hard.filter((h) => h.startsWith('H3'))
  const otherHard = hard.filter((h) => !h.startsWith('H3'))

  // A low score from an empty DNA object is a missing file section, not a collision: moving the hue
  // would not fix it. Say which it is, so the next edit goes to the right place.
  const incomplete = weakest.soft.find((x) => /placeholder|incomplete/i.test(x))
  const hint = weakest.score < min && incomplete ? ` · likely incomplete tokens, not a collision: ${incomplete}` : ''
  gate('detach', otherHard.length || weakest.score < min ? 'FAIL' : 'PASS', `weakest ${weakest.score}/100 vs ${weakest.ref} (min ${min}, ${data.results.length} compared)${otherHard.length ? ` · ${otherHard.join(' · ')}` : ''}${hint}`)
  gate('display face', faceFails.length ? 'FAIL' : 'PASS', faceFails.length ? faceFails.join(' · ') : 'differs from every compared system')
}

/* ── 3 · palette is one source ───────────────────────────────────────────── */

// The page draws swatches from tokens.json; the product draws colour from the CSS. If they
// disagree the page lies, and a name in one that the other never declares renders as nothing.
// (This is what shipped once in Ledger: var(--zinc-050) against a sheet that declared --lg-zinc-050.)
// `oklch(62% …)` and `oklch(0.62 …)` are the same colour, and an alpha channel is part of the
// value: `/ 0.5` never matches an opaque token. Normalize both sides before comparing.
const norm = (v) => {
  const m = String(v).match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)/i)
  if (m) {
    const f = (n) => Number(n).toFixed(3)
    const l = Number(m[1]) / (m[2] === '%' ? 100 : 1)
    const a = m[5] === undefined ? null : Number(m[5]) / (m[6] === '%' ? 100 : 1)
    return `oklch(${f(l)} ${f(m[3])} ${f(m[4])}${a === null || a === 1 ? '' : ` / ${f(a)}`})`
  }
  const h = String(v).trim().toLowerCase()
  return /^#[0-9a-f]{3}$/.test(h) ? `#${[...h.slice(1)].map((c) => c + c).join('')}` : h.replace(/\s+/g, ' ')
}
const comparable = (v) => /^#[0-9a-f]{3,8}$/i.test(String(v).trim()) || /^oklch\(/i.test(String(v).trim())

async function palette() {
  const file = findTokens(root, slug)
  const css = [at('features', slug, `${slug}-tokens.css`), at('public', 'brand', slug, `${slug}-tokens.css`)].find(existsSync)
  if (!file) return missingTokens('palette')
  if (!css) return gate('palette', 'SKIP', `no ${slug}-tokens.css`)
  const t = readTokens(file)
  if (!t.primitives.length) return gate('palette', 'SKIP', `${t.shape} tokens.json has no primitives this gate can read (see lib/tokens.mjs)`)

  const decl = new Map()
  const source = (await readFile(css, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '')
  for (const m of source.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) decl.set(m[1], [...(decl.get(m[1]) ?? []), norm(m[2])])

  const bad = []
  let checked = 0
  let skipped = 0
  for (const { name, value } of t.primitives) {
    if (!comparable(value)) {
      skipped += 1
      continue
    }
    const exact = [t.namespace && `--${t.namespace}-${name}`, `--${name}`].filter(Boolean).find((n) => decl.has(n))
    const names = exact ? [exact] : [...decl.keys()].filter((n) => n.endsWith(`-${name}`))
    if (!names.length) {
      bad.push(`${name} is in tokens.json but not declared in the CSS`)
      continue
    }
    checked += 1
    const want = norm(value)
    if (!names.some((n) => decl.get(n).includes(want))) bad.push(`${name}: tokens ${want}, css ${decl.get(names[0]).join(' | ')}`)
  }
  gate('palette', bad.length ? 'FAIL' : checked ? 'PASS' : 'SKIP', bad.length ? `${bad.length} mismatch(es): ${bad.slice(0, 3).join(' · ')}${bad.length > 3 ? ' …' : ''}` : checked ? `${checked} primitives match the CSS${skipped ? ` (${skipped} not hex/oklch, not compared)` : ''}` : 'no comparable primitive values')
}

/* ── 4 · font registered ─────────────────────────────────────────────────── */

async function fonts() {
  const css = [at('features', slug, `${slug}-tokens.css`), at('public', 'brand', slug, `${slug}-tokens.css`)].find(existsSync)
  if (!css) return gate('font', 'SKIP', `no ${slug}-tokens.css`)
  const used = [...new Set([...(await readFile(css, 'utf8')).matchAll(/var\((--font-[a-z0-9-]+)/gi)].map((m) => m[1]))]
  if (!used.length) return gate('font', 'PASS', 'no --font-* aliases in the token file')

  // A case may register its own face at the route; the root layout is not the only place.
  const layouts = [at('app', 'layout.tsx'), at('app', 'design-system', slug, 'layout.tsx'), at('app', 'design-system', slug, 'page.tsx')].filter(existsSync)
  if (!layouts.length) return gate('font', 'SKIP', 'no app/layout.tsx to check against')
  const text = (await Promise.all(layouts.map((l) => readFile(l, 'utf8')))).join('\n')
  const missing = used.filter((u) => !text.includes(`'${u}'`) && !text.includes(`"${u}"`))
  gate('font', missing.length ? 'FAIL' : 'PASS', missing.length ? `${missing.join(', ')} used in tokens, never declared as a font variable — silent fallback` : `${used.length} alias(es) declared (${used.join(', ')})`)
}

/* ── 5 · contrast ────────────────────────────────────────────────────────── */

async function contrast() {
  const file = findTokens(root, slug)
  if (!file) return missingTokens('contrast')
  const pairs = readTokens(file).contrast
  if (!pairs.length) return gate('contrast', 'FAIL', 'tokens.json publishes no contrast pairs')

  const bad = []
  let failing = 0
  let checked = 0
  for (const p of pairs) {
    if (!isHex(p.fg) || !isHex(p.bg)) continue // gradients and alphas cannot be computed; they are not passed either
    checked += 1
    const got = ratio(p.fg, p.bg)
    if (got < 4.5) failing += 1
    if (typeof p.ratio === 'number' && Math.abs(got - p.ratio) > 0.1) bad.push(`${p.label || `${p.fg}/${p.bg}`}: stated ${p.ratio}, computed ${got.toFixed(2)}`)
  }
  if (!checked) return gate('contrast', 'FAIL', 'no pair has two hex values to compute')
  const problems = [...bad.map((b) => `estimated, not computed — ${b}`), ...(failing ? [] : ['no failing pair published (a palette that only publishes passes is a brochure)'])]
  gate('contrast', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join(' · ') : `${checked} pairs recomputed, all stated ratios match, ${failing} failing pair(s) published`)
}

/* ── 6 · assets ──────────────────────────────────────────────────────────── */

async function assets() {
  const dir = at('public', 'brand', slug, 'assets')
  if (!existsSync(dir)) return gate('assets', 'SKIP', 'no stock assets (nothing to license)')
  try {
    const { stdout } = await run('node', [join(here, 'assets.mjs'), 'credits', '--dir', dir])
    gate('assets', 'PASS', `${stdout.trim().split('\n').length} file(s), every one recorded`)
  } catch (e) {
    gate('assets', 'FAIL', String(e.stdout ?? '').split('\n').filter((l) => l.startsWith('FAIL')).map((l) => l.replace(/\s+/g, ' ')).join(' · ') || 'credits check failed')
  }
}

/* ── 7 · export ──────────────────────────────────────────────────────────── */

async function exported() {
  const code = at('design', 'figma', slug, 'code.js')
  if (!existsSync(code)) return gate('export', 'SKIP', 'not exported yet')
  try {
    await run('node', [join(here, 'figma-smoke.mjs'), code], { maxBuffer: 1 << 24 })
    gate('export', 'PASS', 'figma-smoke exit 0')
  } catch (e) {
    gate('export', 'FAIL', String(e.stdout ?? e.stderr ?? e.message).trim().split('\n').slice(-2).join(' · '))
  }
}

await detach()
await palette()
await fonts()
await contrast()
await assets()
await exported()

if (args.includes('--json')) console.log(JSON.stringify({ slug, rows }, null, 2))
else {
  console.log(`\n  Gates — ${slug}\n`)
  for (const r of rows) console.log(`  ${r.status.padEnd(4)}  ${r.name.padEnd(13)} ${r.detail}`)
  console.log('\n  not run here (need a rendered page): mark at 16px, reduced motion → node scripts/qa.mjs\n')
}
// Nothing ran (a typo'd slug skips every gate) is not a pass.
const ran = rows.some((r) => r.status !== 'SKIP')
if (!ran) console.error(`nothing ran for "${slug}" — check the slug and --root`)
process.exit(rows.some((r) => r.status === 'FAIL') || !ran ? 1 : 0)
