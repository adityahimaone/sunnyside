#!/usr/bin/env node
/**
 * Gate 3 — contrast on the composited surface.
 *
 *   node contrast.mjs --pairs tokens.json [--composite 65]
 *   node contrast.mjs --fg "#17171a" --bg "#f1f2f5"
 *
 * tokens.json may be either shape:
 *   { "light": { "background": "oklch(…)", "card": "…", … }, "dark": { … } }
 *   { "semantic": { "light": { "name": "value", … }, "dark": { … } } }
 *
 * No dependencies. Exits 1 if a pair misses its floor, so it can run in CI.
 */

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

/* ── colour ─────────────────────────────────────────────────── */

const clamp = (x) => Math.min(1, Math.max(0, x))

function parseColour(input) {
  if (!input) return null
  const value = String(input).trim().toLowerCase()

  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/)
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1]
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  }

  const rgb = value.match(/^rgba?\(([^)]+)\)$/)
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255]
  }

  const oklch = value.match(/^oklch\(([^)]+)\)$/)
  if (oklch) {
    const parts = oklch[1].split(/[\s/]+/).filter(Boolean)
    const L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0])
    const C = parseFloat(parts[1] ?? '0')
    const H = parseFloat(parts[2] ?? '0')
    return oklchToSrgb(L, C, H)
  }

  return null
}

function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]

  return lin.map((x) => {
    const v = clamp(x)
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
  })
}

const luminance = ([r, g, b]) => {
  const f = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const mix = (top, bottom, weight) =>
  top.map((channel, i) => channel * weight + bottom[i] * (1 - weight))

const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')

/* ── report ─────────────────────────────────────────────────── */

const FLOORS = [
  ['foreground on canvas', 'foreground', 'background', 12],
  ['foreground on panel', 'foreground', 'panel', 12],
  ['muted on canvas', 'muted-foreground', 'background', 4.5],
  ['muted on panel', 'muted-foreground', 'panel', 4.5],
  ['signal ink on panel', 'signal-ink', 'panel', 4.5],
  ['axis ink on panel', 'muted-foreground', 'panel', 4.5],
]

const pad = (s, n) => String(s).padEnd(n)
let failed = 0
let evaluated = 0

/** Follow `var(--x)` into the theme, then into `primitive`. */
function resolve(value, scopes, depth = 0) {
  if (value && typeof value === 'object' && 'value' in value) value = value.value
  if (typeof value !== 'string' || depth > 6) return null

  const ref = value.trim().match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/i)
  if (ref) {
    const name = ref[1]
    for (const scope of scopes) {
      const hit = scope[name] ?? scope[name.replace(/^--/, '')]
      if (hit !== undefined) return resolve(hit, scopes, depth + 1)
    }
    return null
  }

  if (/^(color-)?mix\(|^color-mix/i.test(value.trim())) {
    console.warn(`  · skipped a computed colour (${value.slice(0, 32)}…)`)
    return null
  }

  return parseColour(value)
}

function runTheme(name, tokens, primitives, composite) {
  const scopes = [tokens, primitives]
  const bg = resolve(tokens.background, scopes)
  const card = resolve(tokens.card ?? tokens.background, scopes)
  if (!bg || !card) {
    console.log(`\n${name}: missing a usable background or card, skipped`)
    return
  }

  const panel = mix(card, bg, composite / 100)
  const resolved = { background: bg, panel }

  for (const key of ['foreground', 'muted-foreground', 'signal-ink', 'signal']) {
    const colour = resolve(tokens[key], scopes)
    if (colour) resolved[key] = colour
  }

  console.log(`\n${name}  (panel = ${composite}% card over canvas → ${hex(panel)})`)
  console.log(`${pad('pair', 26)}${pad('ratio', 10)}${pad('floor', 8)}result`)

  for (const [label, fgKey, bgKey, floor] of FLOORS) {
    const fg = resolved[fgKey]
    if (!fg) continue
    evaluated += 1
    const value = ratio(fg, resolved[bgKey])
    const ok = value >= floor
    if (!ok) failed += 1
    console.log(
      `${pad(label, 26)}${pad(value.toFixed(2) + ':1', 10)}${pad(floor + ':1', 8)}${ok ? 'pass' : 'FAIL'}`,
    )
  }
}

const pairsFile = flag('pairs')
const composite = Number(flag('composite', '65'))

if (pairsFile) {
  const { readFileSync } = await import('node:fs')
  const raw = JSON.parse(readFileSync(pairsFile, 'utf8'))
  const themes = raw.semantic ?? raw
  const primitives = raw.primitive ?? {}

  for (const [name, tokens] of Object.entries(themes)) {
    if (!tokens || typeof tokens !== 'object') continue
    runTheme(name, tokens, primitives, composite)
  }

  if (!evaluated) {
    console.error(
      '\nNo pair could be evaluated. The file needs a `background` and a `card`\n' +
        'per theme, as oklch(), hex or rgb(), or as var() pointing at `primitive`.',
    )
    process.exit(2)
  }
} else {
  const fg = parseColour(flag('fg'))
  const bg = parseColour(flag('bg'))
  if (!fg || !bg) {
    console.error('Usage: node contrast.mjs --pairs tokens.json [--composite 65]')
    console.error('       node contrast.mjs --fg "#17171a" --bg "#f1f2f5"')
    process.exit(2)
  }
  console.log(`${hex(fg)} on ${hex(bg)} → ${ratio(fg, bg).toFixed(2)}:1`)
}

console.log(failed ? `\n${failed} pair(s) below the floor.` : '\nAll pairs pass.')
process.exit(failed ? 1 : 0)
