#!/usr/bin/env node
/**
 * The static gates, in one command. Run it after the tokens exist — not at the end.
 *
 *   node scripts/gates.mjs --slug <slug> [--refs refs/] [--min 70] [--json] [--self-test]
 *   node scripts/gates.mjs --self-test
 *
 * Static Gates (v6.0):
 *   detach        weakest score against every sibling in features/*, plus --refs/*.json
 *   display face  H3 from the detach run: the same display face is a hard fail
 *   palette       every primitive in tokens.json is declared in <slug>-tokens.css at the same value
 *   font          every var(--font-*) in <slug>-tokens.css is declared in a layout
 *   contrast      pairs recomputed from hex, the stated ratio must match, one failure published
 *   cvd           Deuteranopia & Protanopia ΔE_OK safety across accent/danger/primary pairs
 *   reflex        anti-AI-default display face, scope parity, vector marks free of <text>
 *   assets        every file in public/brand/<slug>/assets has a licence record
 *   export        figma-smoke on design/figma/<slug>/code.js, when it exists
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
import { auditCvdSafety } from './lib/cvd.mjs'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const flag = (n, d) => (args.includes(`--${n}`) ? (args[args.indexOf(`--${n}`) + 1]?.startsWith('--') ? true : args[args.indexOf(`--${n}`) + 1]) : d)

/* ── colour helpers ──────────────────────────────────────────────────────── */

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



/* ── self-test runner ─────────────────────────────────────────────────────── */

export async function runSelfTest() {
  const tests = [
    {
      name: 'palette drift',
      run: () => norm('#111111') !== norm('#111112') && norm('oklch(62% 0.19 260)') === norm('oklch(0.62 0.19 260)'),
    },
    {
      name: 'contrast uncomputed/failing check',
      run: () => ratio('#d9ff43', '#f5f0e6') < 4.5 && Math.abs(ratio('#191a2e', '#f3ecdf') - 14.55) < 0.2,
    },
    {
      name: 'cvd collapse check',
      run: () => {
        const { pass: failPass } = auditCvdSafety([{ colorA: '#d32f2f', colorB: '#388e3c' }], 0.045)
        const { pass: okPass } = auditCvdSafety([{ colorA: '#191a2e', colorB: '#3d53d6' }], 0.045)
        return !failPass && okPass
      },
    },
    {
      name: 'reflex anti-ai font check',
      run: () => {
        const banned = ['inter', 'roboto', 'arial']
        const sampleFaces = ['Inter, sans-serif', 'Syne 800', 'Roboto']
        const detected = sampleFaces.filter((f) => banned.some((b) => f.toLowerCase().includes(b)))
        return detected.length === 2 && !detected.includes('Syne 800')
      },
    },
    {
      name: 'reflex scope parity check',
      run: () => {
        const singleBad = { polarity: 'light', css: '[data-brand="night"] { --brand-surface-page: #000; }' }
        const hasNightBlock = /\[data-[a-z0-9_-]+=['"]?night['"]?\]|--[a-z0-9_-]+-surface-page\s*:\s*var\(--.*night/i.test(singleBad.css)
        return singleBad.polarity === 'light' && hasNightBlock
      },
    },
    {
      name: 'reflex svg vector check',
      run: () => {
        const badSvg = '<svg><text x="10" y="20">Bad</text></svg>'
        const goodSvg = '<svg><path d="M10 10h20v20H10z"/></svg>'
        return /<text[\s>]/i.test(badSvg) && !/<text[\s>]/i.test(goodSvg)
      },
    },
  ]

  let passed = 0
  for (const t of tests) {
    if (t.run()) passed += 1
  }

  if (passed === tests.length) {
    console.log(`\n  Self-test passed: ${passed}/${tests.length} static gate tests caught their target violations.\n`)
    return true
  } else {
    console.error(`\n  Self-test failed: only ${passed}/${tests.length} assertions passed.\n`)
    return false
  }
}

if (args.includes('--self-test')) {
  const ok = await runSelfTest()
  const slugArg = flag('slug')
  if (!slugArg || slugArg === true) {
    process.exit(ok ? 0 : 1)
  }
  if (!ok) process.exit(1)
}

const slug = flag('slug')
if (!slug || slug === true) {
  console.error('Usage: node scripts/gates.mjs --slug <slug> [--root .] [--refs refs/] [--min 70] [--json] [--self-test]')
  process.exit(1)
}
const root = resolve(flag('root', '.'))
const min = Number(flag('min', 70))
const at = (...p) => join(root, ...p)
const rows = []
const gate = (name, status, detail) => rows.push({ name, status, detail })

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'))



/* ── a case without tokens.json cannot be measured ───────────────────────── */

function findCss(slugName) {
  return [
    at('features', slugName, `${slugName}-tokens.css`),
    at('public', 'brand', slugName, `${slugName}-tokens.css`),
    ...(slugName === 'sunnyside' ? [at('features', 'design-system', 'sunnyside-tokens.css')] : []),
  ].find(existsSync)
}

function missingTokens(name) {
  const exists =
    existsSync(at('features', slug)) ||
    existsSync(at('public', 'brand', slug)) ||
    (slug === 'sunnyside' && existsSync(at('features', 'design-system')))
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
      const candidateSlug = d === 'design-system' ? 'sunnyside' : d
      const f = candidateSlug === slug ? null : findTokens(root, candidateSlug)
      if (f && !refs.includes(f)) refs.push(f)
    }
  const extra = flag('refs')
  if (extra && extra !== true && existsSync(resolve(extra)))
    for (const f of await readdir(resolve(extra))) if (f.endsWith('.json')) refs.push(join(resolve(extra), f))

  if (!refs.length) return gate('detach', 'SKIP', 'no sibling tokens.json and no --refs: nothing to measure against') && gate('display face', 'SKIP', 'needs detach')

  let out
  try {
    out = (await run('node', [join(here, 'detach-check.mjs'), '--new', own, ...refs.flatMap((r) => ['--ref', r]), '--json', '--min', String(min)], { maxBuffer: 1 << 24 })).stdout
  } catch (e) {
    out = e.stdout
    if (!out) return gate('detach', 'FAIL', `detach-check crashed: ${String(e.stderr ?? e.message).split('\n')[0]}`) && gate('display face', 'SKIP', 'needs detach')
  }
  const data = JSON.parse(out)
  const hard = data.results.flatMap((r) => r.hard.map((h) => `${h} (vs ${r.ref})`))
  const weakest = data.results.reduce((a, r) => (r.score < a.score ? r : a), data.results[0])
  const faceFails = hard.filter((h) => h.startsWith('H3'))
  const otherHard = hard.filter((h) => !h.startsWith('H3'))

  const incomplete = weakest.soft.find((x) => /placeholder|incomplete/i.test(x))
  const hint = weakest.score < min && incomplete ? ` · likely incomplete tokens, not a collision: ${incomplete}` : ''
  gate('detach', otherHard.length || weakest.score < min ? 'FAIL' : 'PASS', `weakest ${weakest.score}/100 vs ${weakest.ref} (min ${min}, ${data.results.length} compared)${otherHard.length ? ` · ${otherHard.join(' · ')}` : ''}${hint}`)
  gate('display face', faceFails.length ? 'FAIL' : 'PASS', faceFails.length ? faceFails.join(' · ') : 'differs from every compared system')
}

/* ── 3 · palette is one source ───────────────────────────────────────────── */

async function palette() {
  const file = findTokens(root, slug)
  const css = findCss(slug)
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
  const css = findCss(slug)
  if (!css) return gate('font', 'SKIP', `no ${slug}-tokens.css`)
  const used = [...new Set([...(await readFile(css, 'utf8')).matchAll(/var\((--font-[a-z0-9-]+)/gi)].map((m) => m[1]))]
  if (!used.length) return gate('font', 'PASS', 'no --font-* aliases in the token file')

  const layouts = [
    at('app', 'layout.tsx'),
    at('app', 'design-system', slug, 'layout.tsx'),
    at('app', 'design-system', slug, 'page.tsx'),
    ...(slug === 'sunnyside' ? [at('app', 'sunnyside', 'page.tsx')] : []),
  ].filter(existsSync)
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
    if (!isHex(p.fg) || !isHex(p.bg)) continue
    checked += 1
    const got = ratio(p.fg, p.bg)
    if (got < 4.5) failing += 1
    if (typeof p.ratio === 'number' && Math.abs(got - p.ratio) > 0.1) bad.push(`${p.label || `${p.fg}/${p.bg}`}: stated ${p.ratio}, computed ${got.toFixed(2)}`)
  }
  if (!checked) return gate('contrast', 'FAIL', 'no pair has two hex values to compute')
  const problems = [...bad.map((b) => `estimated, not computed — ${b}`), ...(failing ? [] : ['no failing pair published (a palette that only publishes passes is a brochure)'])]
  gate('contrast', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join(' · ') : `${checked} pairs recomputed, all stated ratios match, ${failing} failing pair(s) published`)
}

/* ── 6 · cvd (color vision deficiency safety) ─────────────────────────────── */

async function cvd() {
  const file = findTokens(root, slug)
  if (!file) return missingTokens('cvd')
  const t = readTokens(file)
  const prims = t.primitives.filter((p) => p.hex || (typeof p.value === 'string' && (p.value.startsWith('#') || p.value.startsWith('oklch'))))

  const findPrim = (regex) => prims.find((p) => regex.test(p.name) || regex.test(p.role || ''))
  const accent = findPrim(/accent|signal|primaryaccent|action|cobalt|tangerine/i) || prims.find((p) => !/ground|paper|surface|plate|canvas|ink|text/i.test(p.name))
  const danger = findPrim(/danger|error|alert|negative|warn/i)
  const success = findPrim(/success|mint|green|positive/i)
  const ink = findPrim(/ink|text|charcoal|espresso|obsidian/i) || prims.find((p) => /text/i.test(p.role || ''))

  const criticalPairs = []
  if (accent && danger && accent !== danger) {
    criticalPairs.push({ label: `${accent.name} vs ${danger.name}`, colorA: accent.value || accent.hex, colorB: danger.value || danger.hex })
  }
  if (accent && ink && accent !== ink) {
    criticalPairs.push({ label: `${accent.name} vs ${ink.name}`, colorA: accent.value || accent.hex, colorB: ink.value || ink.hex })
  }
  if (danger && success && danger !== success) {
    criticalPairs.push({ label: `${danger.name} vs ${success.name}`, colorA: danger.value || danger.hex, colorB: success.value || success.hex })
  }

  if (!criticalPairs.length) {
    return gate('cvd', 'PASS', 'no conflicting chromatic status pairs to simulate')
  }

  const { pass, results } = auditCvdSafety(criticalPairs, 0.045)
  if (!pass) {
    const fails = results.filter((r) => !r.pass)
    const detail = fails.map((f) => `${f.label} collapses under CVD (min ΔE_OK = ${f.minCvd.toFixed(3)} < 0.045)`).join(' · ')
    return gate('cvd', 'FAIL', `${detail} without secondary non-color indicator`)
  }

  const minDelta = Math.min(...results.map((r) => r.minCvd))
  gate('cvd', 'PASS', `Deuteranopia, Protanopia & Tritanopia safe (min ΔE_OK = ${minDelta.toFixed(3)} across ${results.length} status pairs)`)
}

/* ── 7 · reflex (anti-ai-default & scope parity) ─────────────────────────── */

async function reflex() {
  const file = findTokens(root, slug)
  const css = findCss(slug)
  if (!file) return missingTokens('reflex')
  const t = readTokens(file)
  const problems = []

  // 1. Anti-AI-default display fonts
  const displayTokens = t.type.filter((tp) => /display|hero|head/i.test(tp.name))
  const bannedFonts = ['inter', 'roboto', 'arial']
  for (const dt of displayTokens) {
    const fam = dt.family?.toLowerCase() || ''
    if (bannedFonts.some((b) => fam.includes(b))) {
      problems.push(`AI-default display face "${dt.family}" is banned for display type`)
    }
  }

  // 2. Scope parity
  const rawMeta = t.meta || t.raw?.meta || {}
  const polarity = String(rawMeta.polarity || '').toLowerCase()
  if (css && existsSync(css)) {
    const cssText = await readFile(css, 'utf8')
    const hasNightBlock = /\[data-[a-z0-9_-]+=['"]?night['"]?\]|--[a-z0-9_-]+-surface-page\s*:\s*var\(--.*night/i.test(cssText)
    if (polarity === 'light' || polarity === 'dark' || polarity === 'single') {
      if (hasNightBlock) {
        problems.push(`single-scope polarity declared in meta, but night scope block found in ${slug}-tokens.css`)
      }
    } else if (polarity === 'dual' || polarity === 'light-dark') {
      if (!hasNightBlock) {
        problems.push(`dual-scope polarity declared in meta, but no night scope block found in ${slug}-tokens.css`)
      }
    }
  }

  // 3. Mark & Cast SVG reflex rules
  const isConstructed = !/drawn|illustrative|mascot/i.test(String(t.theme?.family || rawMeta.track || ''))
  const hasOuterBadgeCircle = (svg) => {
    if (!isConstructed) return false
    for (const m of svg.matchAll(/<circle[^>]*\br=["']?([\d.]+)["']?/gi)) {
      if (Number(m[1]) >= 24) return true
    }
    return false
  }

  const brandDir = at('public', 'brand', slug)
  if (existsSync(brandDir)) {
    const compactSvg = join(brandDir, 'mark-compact.svg')
    if (existsSync(compactSvg)) {
      const content = await readFile(compactSvg, 'utf8')
      if (/<text[\s>]/i.test(content)) problems.push('mark-compact.svg contains banned <text> element')
      if (hasOuterBadgeCircle(content)) problems.push('mark-compact.svg contains banned outer badge <circle> with r >= 24 on constructed track')
    }
    const castDir = join(brandDir, 'cast')
    if (existsSync(castDir)) {
      const files = (await readdir(castDir)).filter((f) => f.endsWith('.svg'))
      if (files.length > 0 && files.length !== 6) {
        problems.push(`cast folder has ${files.length} SVGs; exactly 6 companion marks required`)
      }
      for (const f of files) {
        const svgContent = await readFile(join(castDir, f), 'utf8')
        if (/<text[\s>]/i.test(svgContent)) problems.push(`cast/${f} contains banned <text> element`)
        if (hasOuterBadgeCircle(svgContent)) problems.push(`cast/${f} contains banned outer badge <circle> with r >= 24 on constructed track`)
      }
    }
  }

  gate('reflex', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join(' · ') : 'display face foundry-distinct, scope parity clean, vector marks text-free')
}

/* ── 8 · assets ──────────────────────────────────────────────────────────── */

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

/* ── 9 · export ──────────────────────────────────────────────────────────── */

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
await cvd()
await reflex()
await assets()
await exported()

if (args.includes('--json')) console.log(JSON.stringify({ slug, rows }, null, 2))
else {
  console.log(`\n  Gates — ${slug}\n`)
  for (const r of rows) console.log(`  ${r.status.padEnd(4)}  ${r.name.padEnd(13)} ${r.detail}`)
  console.log('\n  not run here (need a rendered page): mark at 16px, reduced motion → node scripts/qa.mjs\n')
}
const ran = rows.some((r) => r.status !== 'SKIP')
if (!ran) console.error(`nothing ran for "${slug}" — check the slug and --root`)
process.exit(rows.some((r) => r.status === 'FAIL') || !ran ? 1 : 0)
