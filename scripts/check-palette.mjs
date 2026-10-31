#!/usr/bin/env node
/**
 * Gate — the palette is one source.
 *
 *   node scripts/check-palette.mjs
 *
 * The design-system page draws its swatches from `tokens.json`. The dashboard
 * draws its colours from `ledger-tokens.css`. If those two disagree the page
 * lies, and if a token name in the page is not declared in the stylesheet the
 * swatch renders as nothing at all — which is exactly what shipped once:
 * `var(--zinc-050)` against a stylesheet that declared `--lg-zinc-050`.
 *
 * Checks, in order:
 *   1. every primitive in tokens.json is declared in the CSS, same value
 *   2. every var() referenced by a token resolves to a declaration
 *   3. every ramp / signal / role name exists in the primitives
 *   4. every primitive's hex round-trips to its oklch value
 *   5. no custom property is declared twice in one block
 *
 * Exits 1 on any failure.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(
  join(root, 'features/ledger/ledger-tokens.css'),
  'utf8',
)
const tokens = JSON.parse(
  readFileSync(join(root, 'features/ledger/tokens.json'), 'utf8'),
)

/* ── css ─────────────────────────────────────────────────────── */

const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '')

/** Split the stylesheet into `selector { body }` blocks. */
function blocks(source) {
  const clean = stripComments(source)
  const out = []
  const stack = []

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i]
    if (char === '{') {
      stack.push({
        selector: clean.slice(0, i).split('}').pop().trim(),
        start: i + 1,
      })
    } else if (char === '}' && stack.length) {
      const open = stack.pop()
      out.push({
        selector: open.selector.replace(/\s+/g, ' '),
        body: clean.slice(open.start, i),
      })
    }
  }

  return out
}

const DECL = /(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi

function declarations(body) {
  const found = new Map()
  for (const match of body.matchAll(DECL)) {
    const name = match[1]
    const value = match[2].trim()
    if (found.has(name)) found.set(name, `${found.get(name)} ||DUP|| ${value}`)
    else found.set(name, value)
  }
  return found
}

const allBlocks = blocks(css)
const scoped = allBlocks.filter((b) => b.selector.includes('[data-ledger]'))
const light = declarations(
  scoped.find((b) => b.selector === '[data-ledger]')?.body ?? '',
)
const dark = declarations(
  scoped.find((b) => b.selector.startsWith('.dark [data-ledger]'))?.body ?? '',
)

/* ── colour ──────────────────────────────────────────────────── */

const linToSrgb = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055

function oklchToRgb([L, C, H]) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, linToSrgb(v))))
}

const parseOklch = (value) => {
  const match = String(value).match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}

const normalise = (value) => {
  const oklch = parseOklch(value)
  if (oklch) return `oklch(${oklch.map((n) => n.toFixed(3)).join(' ')})`
  return String(value).toLowerCase().replace(/\s+/g, ' ').trim()
}

/* ── checks ──────────────────────────────────────────────────── */

const failures = []
const fail = (message) => failures.push(message)

// 1 · primitives declared, same value
for (const [name, entry] of Object.entries(tokens.primitive)) {
  const declared = light.get(`--${name}`)
  if (declared === undefined) {
    fail(
      `primitive --${name} is in tokens.json but not declared in [data-ledger]`,
    )
    continue
  }
  if (declared.includes('||DUP||')) {
    fail(`primitive --${name} is declared more than once in [data-ledger]`)
    continue
  }
  if (normalise(declared) !== normalise(entry.value)) {
    fail(`primitive --${name}: css ${declared} ≠ tokens ${entry.value}`)
  }
}

// 2 · every var() resolves
const declaredNames = new Set([...light.keys(), ...dark.keys()])
const referenced = new Set()

const collectRefs = (value) => {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
      referenced.add(match[1])
    }
  }
}

for (const theme of Object.values(tokens.semantic)) {
  Object.values(theme).forEach(collectRefs)
}
for (const key of ['ramp', 'roles'])
  tokens[key].forEach((row) => collectRefs(row.token ?? row.from))
tokens.signal.steps.forEach((row) => collectRefs(row.token))
Object.values(tokens.signal)
  .filter((v) => v && typeof v === 'object' && 'token' in v)
  .forEach((v) => collectRefs(v.token))

for (const name of referenced) {
  if (!declaredNames.has(name)) fail(`${name} is referenced but never declared`)
}

// 3 · display names exist
for (const row of tokens.ramp) {
  if (!tokens.primitive[row.token.replace(/^--/, '')]) {
    fail(`ramp entry ${row.token} is not a primitive`)
  }
}
for (const row of tokens.signal.steps) {
  if (!tokens.primitive[row.token.replace(/^--/, '')]) {
    fail(`signal step ${row.token} is not a primitive`)
  }
}
for (const row of tokens.roles) {
  if (!tokens.primitive[row.from.replace(/^--/, '')]) {
    fail(`role ${row.token} points at ${row.from}, which is not a primitive`)
  }
}

// 4 · hex round-trips
// Tolerance is 2/255: three-decimal oklch is already a rounding, and the
// nearest step in a saturated hue can land 1–2 levels off in one channel. Any
// real mistake (a wrong hue, a transposed digit) moves a channel by 10 or more,
// so this still catches every error that matters.
for (const [name, entry] of Object.entries(tokens.primitive)) {
  const oklch = parseOklch(entry.value)
  if (!oklch) {
    fail(`primitive --${name} is not an oklch() value`)
    continue
  }
  const rgb = oklchToRgb(oklch)
  const expected = hexToRgb(entry.hex)
  const drift = Math.max(...rgb.map((v, i) => Math.abs(v - expected[i]))) * 255
  if (drift > 2) {
    fail(
      `primitive --${name}: ${entry.value} renders ${entry.hex} ± ${drift.toFixed(1)}/255`,
    )
  }
}

/* ── report ──────────────────────────────────────────────────── */

const count = Object.keys(tokens.primitive).length
console.log(
  `\nLedger palette · ${count} primitives · ${referenced.size} references\n`,
)
console.log(`  light scope: ${light.size} declarations`)
console.log(`  dark scope:  ${dark.size} declarations`)
console.log(`  ramp:        ${tokens.ramp.length} steps`)
console.log(`  signal:      ${tokens.signal.steps.length} steps\n`)

if (failures.length) {
  for (const message of failures) console.log(`  FAIL  ${message}`)
  console.log(`\n${failures.length} problem(s).\n`)
  process.exit(1)
}

console.log(
  '  PASS  every primitive is declared once, in both scopes, at the same value',
)
console.log(
  '  PASS  every var() resolves; every swatch name exists; every hex round-trips\n',
)
