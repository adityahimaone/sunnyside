#!/usr/bin/env node
/**
 * tokens.json → DESIGN.md (the Google Labs spec, version alpha).
 *
 *   node scripts/design-md.mjs --slug <slug> [--root .] [--out public/brand/<slug>/DESIGN.md] [--lint]
 *
 * Why: DESIGN.md is becoming the file other agents and tools (Stitch, the ricoui workspace,
 * `npx @google/design.md export`) read to learn a system. A case that ships HTML, Figma and an
 * llms.txt but not this is invisible to them. This writes it from the same tokens.json, so it
 * cannot drift into a second source of truth.
 *
 * It emits only what the tokens contain. No Do's and Don'ts, no components, no invented
 * rationale — a section with nothing real in it is listed under `omitted` instead, which is the
 * spec's own way to say "left out on purpose". Prose comes from each primitive's `role`.
 *
 * Colour mapping to the spec's roles (primary / secondary / tertiary / neutral):
 *   primary   the darkest primitive           secondary the quietest mid-tone
 *   tertiary  the accent (name hint, else the most chromatic)    neutral the lightest
 * These are *aliases added beside* the real names, never replacements.
 *
 * `--lint` runs `npx @google/design.md lint` on the result and prints its findings.
 * Zero dependencies of its own.
 */
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const args = process.argv.slice(2)
const flag = (n, d) => (args.includes(`--${n}`) ? (args[args.indexOf(`--${n}`) + 1]?.startsWith('--') ? true : args[args.indexOf(`--${n}`) + 1]) : d)
const slug = flag('slug')
if (!slug || slug === true) {
  console.error('Usage: node scripts/design-md.mjs --slug <slug> [--root .] [--out <file>] [--lint]')
  process.exit(1)
}
const root = resolve(flag('root', '.'))
const src = join(root, 'features', slug, 'tokens.json')
if (!existsSync(src)) {
  console.error(`No ${src}`)
  process.exit(1)
}
const tokens = JSON.parse(await readFile(src, 'utf8'))

/* ── helpers ─────────────────────────────────────────────────────────────── */

const kebab = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const hex6 = (v) => (/^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : /^#[0-9a-f]{3}$/i.test(v) ? `#${[...v.slice(1)].map((c) => c + c).join('')}`.toUpperCase() : null)
const q = (s) => JSON.stringify(String(s)) // YAML-safe double-quoted scalar

function oklch(hex) {
  const f = hex.slice(1)
  const lin = (i) => {
    const c = parseInt(f.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = [0, 2, 4].map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(A, B) }
}

const dimension = (v) => (/^-?\d*\.?\d+(px|rem|em)$/.test(String(v).trim()) ? String(v).trim() : null)
const generic = /^(sans-serif|serif|monospace|system-ui|ui-[a-z-]+|-apple-system|var\(.*)$/i
const family = (stack) =>
  String(stack ?? '')
    .split(',')
    .map((p) => p.replace(/['"]/g, '').trim())
    .find((p) => p && !generic.test(p)) ?? null

/* ── colours ─────────────────────────────────────────────────────────────── */

const prims = (tokens.primitives ?? [])
  .map((p) => ({ name: kebab(p.name), hex: hex6(p.value), role: p.role ?? '' }))
  .filter((p) => p.hex && p.name)
if (!prims.length) {
  console.error('tokens.json has no hex primitives — nothing to export')
  process.exit(1)
}
const scored = prims.map((p) => ({ ...p, ...oklch(p.hex) }))
const byL = [...scored].sort((a, b) => a.L - b.L)
const accent = scored.find((p) => /signal|accent|brand|loud|focal|glint/i.test(`${p.name} ${p.role}`)) ?? [...scored].sort((a, b) => b.C - a.C)[0]
const mids = scored.filter((p) => p.L > 0.35 && p.L < 0.8 && p.C < 0.06)
const roleOf = {
  primary: byL[0],
  neutral: byL[byL.length - 1],
  tertiary: accent,
  secondary: mids[0] ?? byL[1],
}
const colors = Object.fromEntries(prims.map((p) => [p.name, p.hex]))
for (const [role, p] of Object.entries(roleOf)) if (p && !(role in colors)) colors[role] = p.hex

/* ── typography, rounded, spacing — only where a real value exists ───────── */

const typography = {}
let skippedFaces = 0
for (const t of Array.isArray(tokens.type) ? tokens.type : []) {
  const name = kebab(t.name ?? t.role ?? '')
  const fam = family(t.value ?? t.face)
  // a bare alias such as "mono" is a CSS variable name, not a typeface — do not publish it as one
  if (!name || !fam || /^(mono|sans|serif|display|body|reading)$/i.test(fam)) {
    if (name) skippedFaces += 1
    continue
  }
  typography[name] = { fontFamily: fam, ...(t.size && dimension(t.size) ? { fontSize: dimension(t.size) } : {}), ...(Number(t.weight) ? { fontWeight: Number(t.weight) } : {}) }
}
const scale = (list) =>
  Object.fromEntries((Array.isArray(list) ? list : []).map((r) => [kebab(String(r.name).replace(/^(radius|space)-/, '')), dimension(r.value)]).filter(([k, v]) => k && v))
const rounded = scale(tokens.radius)
const spacing = scale(tokens.space)

const omitted = [
  ...(Object.keys(typography).length ? [] : [{ section: 'typography', reason: 'faces are CSS aliases in tokens.json, not resolvable family names' }]),
  ...(Object.keys(rounded).length ? [] : [{ section: 'rounded', reason: 'tokens.json defines no radius scale' }]),
  ...(Object.keys(spacing).length ? [] : [{ section: 'spacing', reason: 'tokens.json defines no spacing scale' }]),
  { section: 'components', reason: 'component tokens live in the case CSS module, not tokens.json' },
]

/* ── emit ────────────────────────────────────────────────────────────────── */

const name = tokens.name ?? tokens.meta?.name ?? slug
const idea = tokens.idea ?? tokens.meta?.essence ?? tokens.meta?.oneSentence ?? ''
const y = []
y.push('---', 'version: alpha', `name: ${q(name)}`)
if (idea) y.push(`description: ${q(idea)}`)
y.push('colors:', ...Object.entries(colors).map(([k, v]) => `  ${k}: ${q(v)}`))
if (Object.keys(typography).length) {
  y.push('typography:')
  for (const [k, t] of Object.entries(typography)) y.push(`  ${k}:`, ...Object.entries(t).map(([a, b]) => `    ${a}: ${typeof b === 'number' ? b : q(b)}`))
}
for (const [label, map] of [['rounded', rounded], ['spacing', spacing]])
  if (Object.keys(map).length) y.push(`${label}:`, ...Object.entries(map).map(([k, v]) => `  ${k}: ${q(v)}`))
y.push('omitted:', ...omitted.flatMap((o) => [`  - section: ${o.section}`, `    reason: ${q(o.reason)}`]), '---')

const body = []
body.push(`# ${name}`, '', '## Overview', '', idea || `${name} design system.`, '', 'Generated from `features/' + slug + '/tokens.json`; edit the tokens, not this file.', '')
body.push('## Colors', '')
for (const p of prims) body.push(`- **${p.name} (${p.hex}):** ${p.role || 'no role written in tokens.json'}`)
body.push('', `Role aliases added for tooling: ${Object.entries(roleOf).filter(([r, p]) => p && !prims.some((x) => x.name === r)).map(([r, p]) => `\`${r}\` = ${p.name}`).join(', ') || 'none'}.`, '')
if (Object.keys(typography).length) {
  body.push('## Typography', '')
  for (const [k, t] of Object.entries(typography)) body.push(`- **${k}:** ${t.fontFamily}${t.fontSize ? ` at ${t.fontSize}` : ''}.`)
  body.push('')
}

const out = resolve(flag('out', join(root, 'public', 'brand', slug, 'DESIGN.md')))
await mkdir(dirname(out), { recursive: true })
await writeFile(out, `${y.join('\n')}\n\n${body.join('\n')}\n`)
console.log(`${out}\n  ${Object.keys(colors).length} colours (${Object.keys(roleOf).length} role aliases) · ${Object.keys(typography).length} type · ${Object.keys(rounded).length} rounded · ${Object.keys(spacing).length} spacing${skippedFaces ? ` · ${skippedFaces} face(s) skipped (alias, not a family)` : ''}`)

if (args.includes('--lint')) {
  try {
    const { stdout } = await run('npx', ['--yes', '@google/design.md', 'lint', '--format', 'json', out], { maxBuffer: 1 << 24, timeout: 120000 })
    report(stdout)
  } catch (e) {
    if (e.stdout) report(e.stdout)
    else {
      console.error(`lint did not run: ${String(e.stderr ?? e.message).split('\n')[0]} (needs npm registry access)`)
      process.exit(1)
    }
  }
}

function report(json) {
  const data = JSON.parse(json)
  const f = data.findings ?? []
  const s = data.summary ?? {}
  console.log(`\n  lint: ${s.errors ?? 0} error(s), ${s.warnings ?? 0} warning(s), ${s.info ?? 0} info`)
  f.forEach((x) => console.log(`  ${String(x.severity).padEnd(7)} ${x.path ?? ''} ${x.message}`))
  if ((s.errors ?? 0) > 0) process.exitCode = 1
}
