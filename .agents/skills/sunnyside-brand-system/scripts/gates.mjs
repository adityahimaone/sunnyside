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

/* ── 1 + 2 · detach and display face ─────────────────────────────────────── */

async function detach() {
  const own = at('features', slug, 'tokens.json')
  if (!existsSync(own)) return gate('detach', 'SKIP', `no ${own.replace(`${root}/`, '')}`) && gate('display face', 'SKIP', 'needs detach')

  const refs = []
  const featuresDir = at('features')
  if (existsSync(featuresDir))
    for (const d of await readdir(featuresDir)) {
      const f = join(featuresDir, d, 'tokens.json')
      if (d !== slug && existsSync(f)) refs.push(f)
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

/* ── 3 · font registered ─────────────────────────────────────────────────── */

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

/* ── 4 · contrast ────────────────────────────────────────────────────────── */

async function contrast() {
  const file = at('features', slug, 'tokens.json')
  if (!existsSync(file)) return gate('contrast', 'SKIP', 'no tokens.json')
  const pairs = (await readJson(file)).contrast
  if (!Array.isArray(pairs) || !pairs.length) return gate('contrast', 'FAIL', 'tokens.json publishes no contrast pairs')

  const bad = []
  let failing = 0
  let checked = 0
  for (const p of pairs) {
    const fg = p.fg ?? p.a
    const bg = p.bg ?? p.b
    if (!isHex(fg) || !isHex(bg)) continue // gradients and alphas cannot be computed; they are not passed either
    checked += 1
    const got = ratio(fg, bg)
    if (got < 4.5) failing += 1
    if (typeof p.ratio === 'number' && Math.abs(got - p.ratio) > 0.1) bad.push(`${p.label ?? `${fg}/${bg}`}: stated ${p.ratio}, computed ${got.toFixed(2)}`)
  }
  if (!checked) return gate('contrast', 'FAIL', 'no pair has two hex values to compute')
  const problems = [...bad.map((b) => `estimated, not computed — ${b}`), ...(failing ? [] : ['no failing pair published (a palette that only publishes passes is a brochure)'])]
  gate('contrast', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join(' · ') : `${checked} pairs recomputed, all stated ratios match, ${failing} failing pair(s) published`)
}

/* ── 5 · assets ──────────────────────────────────────────────────────────── */

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

/* ── 6 · export ──────────────────────────────────────────────────────────── */

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
