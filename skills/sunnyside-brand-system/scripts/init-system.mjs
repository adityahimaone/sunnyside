#!/usr/bin/env node
/**
 * Fresh init — scaffold a design system that inherits nothing.
 *
 *   node scripts/init-system.mjs --slug tidewater --name "Tidewater" --case 09 \
 *     --hue 28 --essence "Warm clay, low sun." [--root .] [--dry-run]
 *
 *   node scripts/init-system.mjs --slug x --name "X" --hue 200 --peek
 *
 * What it does, in order:
 *   1. refuses if the slug exists, or the name/hue collides with a sibling case;
 *   2. allocates a namespace that no sibling uses (`--tw-`, not `--st-`);
 *   3. derives a 5+1 palette from a hue seed and prints its measured contrast,
 *      so the accent is chosen as a *distance from the neighbours*, not a taste;
 *   4. writes a compiling skeleton: features/<slug>/ (tokens, CSS module, data,
 *      brand components) + app/design-system/<slug>/ (page, layout, llms.txt) +
 *      public/brand/<slug>/ for the forge to fill + brand/<slug>/brief.md.
 *
 * It does not draw the mark, invent the story or write the copy. Those are the
 * decisions; this only removes the blank page and the inherited habits.
 *
 * Zero dependencies. `--dry-run` prints the tree and writes nothing.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

/* ── args ────────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2)
const one = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const slug = (one('slug', '') || '').trim()
const name = (one('name', '') || '').trim()
const caseNo = one('case', '')
const hue = Number(one('hue', NaN))
const essence = one('essence', '')
const mode = one('mode', 'light')
const root = resolve(one('root', '.'))
const dry = has('dry-run')
const peek = has('peek')

const die = (message) => {
  console.error(`\n  ✗ ${message}\n`)
  process.exit(1)
}

if (!slug || !name || Number.isNaN(hue)) {
  console.error(`Usage:
  node scripts/init-system.mjs --slug <kebab-slug> --name "<Display Name>" --hue <0-360>
    [--case 09] [--essence "..."] [--mode light|dark] [--root .] [--dry-run] [--peek]`)
  process.exit(1)
}
if (!/^[a-z][a-z0-9-]{1,23}$/.test(slug)) die(`slug "${slug}" must be kebab-case, 2–24 chars, starting with a letter`)
if (!/^\d{2}$/.test(caseNo) && caseNo !== '') die(`--case must be two digits, e.g. 09`)

/* ── colour: OKLCH → sRGB hex ────────────────────────────────────────────── */

function oklchToHex(L, C, H) {
  const rad = (H * Math.PI) / 180
  const a = C * Math.cos(rad)
  const b = C * Math.sin(rad)

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

  const encode = (v) => {
    const c = Math.min(1, Math.max(0, v))
    const srgb = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
    return Math.round(Math.min(1, Math.max(0, srgb)) * 255)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${lin.map(encode).join('')}`
}

function luminance(hex) {
  const raw = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(raw.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/* ── palette from a hue seed ─────────────────────────────────────────────── */

/**
 * The 5 + 1 law: ground, plate, ink, muted, wash + one signal.
 * Values are fixed by role, not by taste, so the hue seed and the value mode are
 * the only free variables — which is exactly what the detach gate measures.
 *
 * Both ramps use the same primitive names. Only the values change, so the
 * semantic layer (`--x-surface-page: var(--x-ground)`) never breaks when the
 * theme flips. A mode-prefixed primitive name is the classic way to break dark
 * mode on day two.
 */
function ramp(seedHue, valueMode) {
  const h = ((seedHue % 360) + 360) % 360
  const dark = valueMode === 'dark'

  const base = dark
    ? {
        ground: [0.19, 0.022],
        plate: [0.24, 0.026],
        ink: [0.95, 0.012],
        muted: [0.7, 0.022],
        wash: [0.3, 0.04],
        signal: [0.76, 0.1],
      }
    : {
        ground: [0.965, 0.012],
        plate: [0.995, 0.004],
        ink: [0.2, 0.024],
        muted: [0.48, 0.024],
        wash: [0.93, 0.032],
        signal: [0.5, 0.11],
      }

  // A tiny hue shift per role keeps the ramp from reading as one flat tint.
  const shift = { ground: -6, plate: 0, ink: 4, muted: 2, wash: -10, signal: 0 }

  const out = {}
  for (const key of Object.keys(base)) {
    const [L, C] = base[key]
    out[key] = { value: oklchToHex(L, C, h + shift[key]), lch: `${L} ${C} ${Math.round(h + shift[key])}` }
  }
  return out
}

const ROLES = {
  ground: 'Page ground',
  plate: 'Solid reading plate',
  ink: 'Primary ink and mark',
  muted: 'Secondary text, metadata',
  wash: 'Tinted surface',
  signal: 'The one accent — ≤ 8% of a viewport',
}

/* ── sibling scan ────────────────────────────────────────────────────────── */

const toLinear = (channel) => {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/**
 * Hue and chroma of a hex, in OKLCH. A near-neutral (a dark "abyss", a cream)
 * has a mathematically defined but perceptually meaningless hue, so callers
 * must filter on chroma before comparing hue families.
 */
function hueOf(hex) {
  const raw = String(hex).replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(raw)) return null
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(raw.slice(i, i + 2), 16)))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return { H, C }
}

/** Below this chroma a colour reads as grey; its hue cannot collide with anything. */
const HUE_FLOOR = 0.045

async function scanSiblings(dir) {
  const out = []
  if (!existsSync(dir)) return out
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    const tokenPath = join(dir, entry.name, 'tokens.json')
    if (!existsSync(tokenPath)) continue
    try {
      const tokens = JSON.parse(await readFile(tokenPath, 'utf8'))
      const meta = tokens.meta ?? {}
      const prims = Array.isArray(tokens.primitives)
        ? tokens.primitives
        : Object.entries(tokens.color ?? {}).map(([k, v]) => ({ name: k, value: v }))
      const hues = prims
        .map((p) => {
          const oklch = hueOf(p.value)
          return oklch && oklch.C >= HUE_FLOOR ? { name: p.name, hue: oklch.H, chroma: oklch.C } : null
        })
        .filter(Boolean)
      out.push({
        slug: entry.name,
        name: meta.name ?? tokens.name ?? entry.name,
        namespace: meta.namespace ?? tokens.namespace ?? '',
        material: tokens.theme?.material ?? tokens.material ?? '',
        display: String(tokens.type?.display ?? (Array.isArray(tokens.type) ? tokens.type.find((t) => /display/.test(t.name))?.value : '') ?? ''),
        hues,
      })
    } catch {
      /* a broken sibling must not block the new one */
    }
  }
  return out
}

const siblings = await scanSiblings(join(root, 'features'))

/* ── refusals ────────────────────────────────────────────────────────────── */

if (existsSync(join(root, 'features', slug))) die(`features/${slug} already exists — pick another slug or use the existing case`)
if (existsSync(join(root, 'app', 'design-system', slug))) die(`app/design-system/${slug} already exists`)
if (siblings.some((s) => s.slug === slug)) die(`slug "${slug}" is taken by a sibling case`)

/* ── namespace ───────────────────────────────────────────────────────────── */

const taken = new Set(siblings.map((s) => s.namespace).filter(Boolean))
const letters = name.toLowerCase().replace(/[^a-z]/g, '')
const candidates = [
  letters.slice(0, 2),
  letters[0] + (letters.at(-1) ?? ''),
  letters[0] + (letters[2] ?? 'x'),
  ...letters.split('').map((c) => c + (letters[1] ?? 'x')),
]
const ns = candidates.find((c) => c.length === 2 && !taken.has(`--${c}-`)) ?? null
if (!ns) die(`could not allocate a free 2-letter namespace (taken: ${[...taken].join(' ')})`)
const prefix = `--${ns}-`

/* ── palette + the hue distance report ───────────────────────────────────── */

const defaultMode = mode === 'dark' ? 'dark' : 'light'
const overrideMode = defaultMode === 'dark' ? 'light' : 'dark'

const lightRamp = ramp(hue, 'light')
const darkRamp = ramp(hue, 'dark')
const pal = defaultMode === 'dark' ? darkRamp : lightRamp
const prims = Object.keys(ROLES).map((key) => ({
  name: key,
  value: pal[key].value,
  role: ROLES[key],
  lch: pal[key].lch,
}))
const signal = pal.signal
const ground = pal.ground
const ink = pal.ink

const neighbours = siblings
  .map((s) => {
    let min = 180
    let culprit = null
    for (const p of s.hues) {
      const d = Math.abs(p.hue - hue) % 360
      const dist = d > 180 ? 360 - d : d
      if (dist < min) {
        min = dist
        culprit = p
      }
    }
    return { ...s, distance: min, culprit }
  })
  .sort((a, b) => a.distance - b.distance)

const closest = neighbours[0]

/**
 * With eight finished cases the hue wheel is crowded. Rather than refuse every
 * seed, show the free arcs: an occupied arc is a sibling's chromatic hue ± 25°.
 */
function freeArcs(margin = 25, minWidth = 18) {
  const occupied = []
  for (const s of siblings) {
    for (const p of s.hues) {
      occupied.push([p.hue - margin, p.hue + margin])
    }
  }
  if (!occupied.length) return [[0, 360]]
  const norm = occupied.map(([a, b]) => {
    let start = ((a % 360) + 360) % 360
    let end = start + (b - a)
    if (end > 360) return [[start, 360], [0, end - 360]]
    return [[start, end]]
  }).flat().sort((x, y) => x[0] - y[0])

  const merged = []
  for (const [a, b] of norm) {
    const last = merged.at(-1)
    if (last && a <= last[1]) last[1] = Math.max(last[1], b)
    else merged.push([a, b])
  }
  const arcs = []
  for (let i = 0; i < merged.length; i += 1) {
    const end = merged[i][1]
    const next = merged[i + 1]?.[0] ?? 360
    if (next - end >= minWidth) arcs.push([Math.round(end), Math.round(next)])
  }
  if (merged.length === 1 && merged[0][0] > minWidth) arcs.unshift([0, Math.round(merged[0][0])])
  return arcs
}

const arcs = freeArcs()

if (closest && closest.culprit && closest.distance < 8 && !has('force')) {
  const widest = arcs.sort((a, b) => b[1] - b[0] - (a[1] - a[0]))[0]
  const advice = widest
    ? `    Free arcs: ${arcs.map(([a, b]) => `${a}–${b}°`).join(', ')}\n    Try --hue ${Math.round((widest[0] + widest[1]) / 2)}, or --force to keep this hue and separate by material and value.`
    : `    The wheel is full at eight cases. Hue is 25 of 100 points — differentiate by\n    value (--mode dark), material and geometry instead, or pass --force.`
  die(
    `hue ${hue}° is ${closest.distance.toFixed(0)}° from ${closest.name} (${closest.culprit.name}, chroma ${closest.culprit.chroma.toFixed(3)}) — same family.\n${advice}`,
  )
}

/* ── files ───────────────────────────────────────────────────────────────── */

const S = slug
const N = name
const NS = ns
const TITLE = caseNo ? `Case ${caseNo}` : 'Case'
const sections = ['hero', 'foundation', 'material', 'marks', 'type', 'forms', 'tokens', 'audit']
const oneSentence =
  essence || `${N} is a design system: [one material], [one ink], [one signal], and [the signature that only this brand has].`

const tokensJson = {
  meta: {
    name: N,
    version: '0.1.0',
    year: new Date().getFullYear(),
    author: 'TODO',
    case: TITLE,
    namespace: prefix,
    essence: essence || 'TODO — one line, ≤ 8 words',
    promise: 'TODO — what the interface promises the reader',
    family: 'TODO — constructed family or drawn subject',
    track: 'TODO — constructed | drawn',
    gate: 'v3.0',
    oneSentence,
    fieldImage: `/brand/${S}/${S}-field.webp`,
  },
  theme: {
    family: 'TODO',
    material: 'TODO — a material, not a trend (e.g. painted-glass, quartz-plate)',
    edge: 'TODO',
    offset: 'TODO',
    stroke: 'TODO',
    tile: 'TODO',
    radius: 'TODO',
    ring: 'TODO',
    density: 'TODO',
    label: 'TODO',
    'field-recipe': 'TODO',
    'mark-form': 'TODO',
  },
  sections,
  primitives: prims.map(({ name: pName, value, role }) => ({ name: pName, value, role })),
  type: [
    { name: 'font-display', value: "TODO, 'TODO', sans-serif" },
    { name: 'font-reading', value: "TODO, 'TODO', sans-serif" },
    { name: 'font-mono', value: "'Geist Mono', ui-monospace, monospace" },
  ],
  semantic: {
    light: [
      { name: 'surface-page', value: `var(${prefix}ground)`, role: 'Page ground' },
      { name: 'surface-plate', value: `var(${prefix}plate)`, role: 'Reading plate' },
      { name: 'text-primary', value: `var(${prefix}ink)`, role: 'Body ink' },
      { name: 'text-secondary', value: `var(${prefix}muted)`, role: 'Metadata' },
      { name: 'accent', value: `var(${prefix}signal)`, role: 'One accent' },
    ],
  },
  contrast: [
    { label: 'ink on plate', fg: ink.value, bg: pal.plate.value },
    { label: 'ink on ground', fg: ink.value, bg: ground.value },
    { label: 'signal on plate', fg: signal.value, bg: pal.plate.value },
  ].map((c) => ({ ...c, ratio: Number(contrast(c.fg, c.bg).toFixed(1)) })),
  radius: { xs: 4, sm: 8, md: 12, lg: 20, pill: 999 },
}

const otherRamp = defaultMode === 'dark' ? lightRamp : darkRamp
const primKeys = Object.keys(ROLES)

const tokensCss = `/* Generated by scripts/init-system.mjs — edit tokens.json, then regenerate.
   Three layers: primitive → semantic → component. Namespaced ${prefix} so it
   never touches the host's tokens.

   Both ramps use the same primitive names; only the values change. The page
   default is ${defaultMode}; the toggle sets html[data-${S}='${overrideMode}']. */

.${ns}-scope {
  /* Theme DNA — the mark, the pane and the fields all read this object */
  --${ns}-dna-family: TODO;
  --${ns}-dna-material: TODO;
  --${ns}-dna-edge: TODO;
  --${ns}-dna-offset: TODO;
  --${ns}-dna-stroke: TODO;
  --${ns}-dna-tile: TODO;
  --${ns}-dna-radius: TODO;
  --${ns}-dna-ring: TODO;
  --${ns}-dna-density: TODO;
  --${ns}-dna-label: TODO;

  /* 1 · primitive — ${defaultMode} ramp */
${primKeys.map((k) => `  ${prefix}${k}: ${pal[k].value};`).join('\n')}

  /* 2 · semantic */
  ${prefix}surface-page: var(${prefix}ground);
  ${prefix}surface-plate: var(${prefix}plate);
  ${prefix}surface-tint: var(${prefix}wash);
  ${prefix}text-primary: var(${prefix}ink);
  ${prefix}text-secondary: var(${prefix}muted);
  ${prefix}accent: var(${prefix}signal);
  ${prefix}focus-ring: var(${prefix}signal);
  ${prefix}line-subtle: color-mix(in oklab, var(${prefix}ink) 12%, transparent);
  ${prefix}line-strong: color-mix(in oklab, var(${prefix}ink) 28%, transparent);

  /* type */
  ${prefix}font-display: var(--font-display, 'TODO'), sans-serif;
  ${prefix}font-reading: var(--font-reading, 'TODO'), sans-serif;
  ${prefix}font-mono: 'Geist Mono', ui-monospace, monospace;

  /* 3 · component */
  ${prefix}button-bg: var(${prefix}accent);
  ${prefix}button-ink: var(${prefix}plate);
  ${prefix}card-bg: var(${prefix}surface-plate);
}

/* ${overrideMode} ramp — same names, different values */
html[data-${S}='${overrideMode}'] .${ns}-scope {
${primKeys.map((k) => `  ${prefix}${k}: ${otherRamp[k].value};`).join('\n')}
}
`

const moduleCss = `/* ${N} — layout only. Colour and type come from ${prefix} tokens, never raw hex. */

.root {
  background: var(${prefix}surface-page);
  color: var(${prefix}text-primary);
  min-height: 100vh;
}

.shell {
  width: min(1120px, 100% - 3rem);
  margin-inline: auto;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in oklab, var(${prefix}text-primary) 12%, transparent);
}

.topbarInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.875rem;
}

.nav {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.navLink {
  font-size: 0.8125rem;
  color: var(${prefix}text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: color 160ms ease;
}

.navLink:hover {
  color: var(${prefix}text-primary);
}

.hero {
  padding-block: clamp(3rem, 8vw, 6rem) clamp(2rem, 4vw, 3rem);
}

.heroTitle {
  font-family: var(${prefix}font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  text-wrap: balance;
  margin: 0.75rem 0 1rem;
}

.heroDeck {
  max-width: 62ch;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(${prefix}text-secondary);
  text-wrap: pretty;
}

.section {
  padding-block: clamp(2.5rem, 5vw, 4rem);
  border-top: 1px solid color-mix(in oklab, var(${prefix}text-primary) 10%, transparent);
}

.sectionHeader {
  max-width: 62ch;
  margin-bottom: 2rem;
}

.sectionLabel {
  font-family: var(${prefix}font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(${prefix}text-secondary);
}

.sectionTitle {
  font-family: var(${prefix}font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.25rem);
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0.5rem 0 0.5rem;
}

.sectionDesc {
  color: var(${prefix}text-secondary);
  line-height: 1.6;
}

.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  background: var(${prefix}card-bg);
  border: 1px solid color-mix(in oklab, var(${prefix}text-primary) 12%, transparent);
  border-radius: 12px;
  padding: 1.25rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table th,
.table td {
  text-align: left;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid color-mix(in oklab, var(${prefix}text-primary) 10%, transparent);
}

.table th {
  font-family: var(${prefix}font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(${prefix}text-secondary);
}

.footer {
  border-top: 1px solid color-mix(in oklab, var(${prefix}text-primary) 12%, transparent);
  padding-block: 2rem;
  color: var(${prefix}text-secondary);
  font-size: 0.875rem;
}

.onlyLight { display: block; }
.onlyDark { display: block; }

/* One rule hides the asset that does not belong to the current theme. Anchor the
   test on <html> only — a scope-local :not() always matches somewhere. */
:global(html:not([data-${S}='${defaultMode === 'dark' ? 'light' : 'dark'}'])) .only${defaultMode === 'dark' ? 'Light' : 'Dark'} {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .root * { animation: none !important; transition: none !important; }
}
`

const dataTs = `/**
 * ${N} — the copy and the gate records. Every string here is a claim the page
 * makes; keep them true or delete them.
 *
 * TODO(detach): these eight section ids are the scaffold default. Change at
 * least two of them to sections this system actually needs — the detach gate
 * fails a page whose section list matches a sibling's.
 */

export const NAV = [
${sections.map((s) => `  { id: '${s}', label: '${s[0].toUpperCase()}${s.slice(1)}' },`).join('\n')}
] as const

export const DECISIONS = [
  {
    title: 'TODO — the decision, as a noun phrase',
    decision: 'TODO — what the system does',
    because: 'TODO — the physical or optical reason',
    breaksNext: 'TODO — what this makes harder later',
  },
]

export const STORY_BEATS = [
  { beat: 'Belief', line: 'TODO' },
  { beat: 'Enemy', line: 'TODO' },
  { beat: 'Mark', line: 'TODO' },
  { beat: 'Material', line: 'TODO' },
  { beat: 'Proof', line: 'TODO' },
  { beat: 'Gap', line: 'TODO' },
]

export const MARK_GATE = [
  { rule: 'Zero circle / zero Venn', note: 'TODO — or "n/a, drawn track subject circle"' },
  { rule: 'Fill only, no fill+stroke', note: 'TODO' },
  { rule: '2–4 solid primitives', note: 'TODO' },
  { rule: 'One accent', note: 'TODO' },
  { rule: 'Reads at 16px', note: 'TODO' },
]

export const TYPE_GATE = [
  { rule: 'Body 16–18px', note: 'TODO' },
  { rule: 'Measure 60–75ch', note: 'TODO' },
  { rule: 'Unitless line-height', note: 'TODO' },
  { rule: 'Contrast 4.5:1 body', note: 'TODO' },
]

export const GAPS = ['TODO — name what is missing; a guide that hides its gaps is a brochure.']

export const OUTPUT_CONTRACT = [
  { path: \`public/brand/${S}/mark.svg\`, role: 'Primary mark' },
  { path: \`public/brand/${S}/mark-compact.svg\`, role: 'Compact drawing' },
  { path: \`public/brand/${S}/wordmark.svg\`, role: 'Outlined wordmark' },
  { path: \`features/${S}/tokens.json\`, role: 'Token source' },
  { path: \`features/${S}/${S}-tokens.css\`, role: 'Generated tokens' },
]
`

const brandTsx = `import Image from 'next/image'

import styles from '../${S}.module.css'

const BASE = '/brand/${S}'

/**
 * The mark family. Every component renders both inks and lets CSS pick, so the
 * theme toggle never needs a JS re-render to swap a logo.
 *
 * TODO: the SVGs do not exist yet. Generate them with brand-forge.mjs, or drop
 * hand-drawn files into public/brand/${S}/ with these exact names.
 */

type Size = { className?: string; size?: number }

export function ${N.replace(/[^A-Za-z]/g, '')}Mark({ className, size = 32 }: Size) {
  const compact = size < 32
  const file = compact ? 'mark-compact' : 'mark'
  return (
    <span
      className={[\`\${styles.mark} \${className ?? ''}\`].join(' ')}
      style={{ width: size, height: size }}
      role="img"
      aria-label="${N}"
    >
      <Image src={\`\${BASE}/\${file}.svg\`} alt="" width={64} height={64} className={styles.onlyLight} />
      <Image src={\`\${BASE}/\${file}-reverse.svg\`} alt="" width={64} height={64} className={styles.onlyDark} />
    </span>
  )
}

export function ${N.replace(/[^A-Za-z]/g, '')}Wordmark({ className, size = 24 }: Size) {
  return (
    <span className={className} style={{ height: size }} role="img" aria-label="${N}">
      <Image src={\`\${BASE}/wordmark.svg\`} alt="" width={132} height={25} className={styles.onlyLight} />
      <Image src={\`\${BASE}/wordmark-reverse.svg\`} alt="" width={132} height={25} className={styles.onlyDark} />
    </span>
  )
}

export function ${N.replace(/[^A-Za-z]/g, '')}Lockup({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={className} role="img" aria-label="${N}">
      <Image src={\`\${BASE}/lockup.svg\`} alt="" width={130} height={36} priority={priority} className={styles.onlyLight} />
      <Image src={\`\${BASE}/lockup-reverse.svg\`} alt="" width={130} height={36} priority={priority} className={styles.onlyDark} />
    </span>
  )
}
`

const pageTsx = `import type { Metadata } from 'next'
import Link from 'next/link'

import '@/features/${S}/${S}-tokens.css'

import { DECISIONS, GAPS, MARK_GATE, NAV, OUTPUT_CONTRACT, STORY_BEATS, TYPE_GATE } from '@/features/${S}/${S}-data'
import { ${N.replace(/[^A-Za-z]/g, '')}Lockup, ${N.replace(/[^A-Za-z]/g, '')}Mark, ${N.replace(/[^A-Za-z]/g, '')}Wordmark } from '@/features/${S}/components/brand'
import tokens from '@/features/${S}/tokens.json'
import styles from '@/features/${S}/${S}.module.css'

export const metadata: Metadata = {
  title: '${N} — ${TITLE} | Design System',
  description: '${oneSentence.replace(/'/g, "\\'")}',
  alternates: {
    canonical: '/design-system/${S}',
    types: { 'text/markdown': '/design-system/${S}/llms.txt' },
  },
}

export default function ${N.replace(/[^A-Za-z]/g, '')}Page() {
  return (
    <div className={styles.root} id="top">
      <header className={styles.topbar}>
        <div className={\`\${styles.shell} \${styles.topbarInner}\`}>
          <Link href="#top" aria-label="${N}, back to top">
            <${N.replace(/[^A-Za-z]/g, '')}Lockup priority />
          </Link>
          <nav className={styles.nav} aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.id} href={\`#\${item.id}\`} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.sectionLabel}>${TITLE} · ${prefix}</span>
          <h1 className={styles.heroTitle}>TODO — the one sentence, as a headline.</h1>
          <p className={styles.heroDeck}>{tokens.meta.oneSentence}</p>
        </section>

        <section id="foundation" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>01 / Foundation</span>
            <h2 className={styles.sectionTitle}>Decisions</h2>
            <p className={styles.sectionDesc}>Each rule exists to remove a specific friction.</p>
          </div>
          <div className={styles.cardGrid}>
            {DECISIONS.map((d) => (
              <div key={d.title} className={styles.card}>
                <h3>{d.title}</h3>
                <p>{d.decision}</p>
                <p>{d.because}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="material" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>02 / Material &amp; Colour</span>
            <h2 className={styles.sectionTitle}>The palette</h2>
          </div>
          <div className={styles.cardGrid}>
            {tokens.primitives.map((p) => (
              <div key={p.name} className={styles.card}>
                <div style={{ height: 64, background: p.value, borderRadius: 8 }} />
                <strong>{p.name}</strong>
                <div style={{ fontFamily: 'var(${prefix}font-mono)', fontSize: 12 }}>{p.value}</div>
                <p>{p.role}</p>
              </div>
            ))}
          </div>
          <table className={styles.table} style={{ marginTop: '1.5rem' }}>
            <thead>
              <tr><th>Pair</th><th>Ratio</th></tr>
            </thead>
            <tbody>
              {tokens.contrast.map((c) => (
                <tr key={c.label}><td>{c.label}</td><td>{c.ratio}:1</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="marks" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>03 / Marks</span>
            <h2 className={styles.sectionTitle}>The mark system</h2>
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card}><${N.replace(/[^A-Za-z]/g, '')}Mark size={64} /><p>Primary</p></div>
            <div className={styles.card}><${N.replace(/[^A-Za-z]/g, '')}Mark size={16} /><p>Compact (16px)</p></div>
            <div className={styles.card}><${N.replace(/[^A-Za-z]/g, '')}Wordmark /><p>Wordmark</p></div>
          </div>
        </section>

        <section id="type" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>04 / Typography</span>
            <h2 className={styles.sectionTitle}>Type</h2>
          </div>
          <table className={styles.table}>
            <thead><tr><th>Rule</th><th>Note</th></tr></thead>
            <tbody>
              {TYPE_GATE.map((t) => (
                <tr key={t.rule}><td>{t.rule}</td><td>{t.note}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="audit" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>05 / Audit</span>
            <h2 className={styles.sectionTitle}>Verification</h2>
          </div>
          <table className={styles.table}>
            <thead><tr><th>Gate</th><th>Note</th></tr></thead>
            <tbody>
              {MARK_GATE.map((r) => (
                <tr key={r.rule}><td>{r.rule}</td><td>{r.note}</td></tr>
              ))}
            </tbody>
          </table>
          <div className={styles.card} style={{ marginTop: '1.5rem' }}>
            <strong>Known gaps</strong>
            <ul>{GAPS.map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
          <table className={styles.table} style={{ marginTop: '1.5rem' }}>
            <thead><tr><th>Output</th><th>Role</th></tr></thead>
            <tbody>
              {OUTPUT_CONTRACT.map((o) => (
                <tr key={o.path}><td><code>{o.path}</code></td><td>{o.role}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>${N} · ${TITLE} · {STORY_BEATS.length} story beats recorded</div>
      </footer>
    </div>
  )
}
`

const layoutTsx = `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${N} — ${TITLE} | Design System',
  description: '${oneSentence.replace(/'/g, "\\'")}',
  alternates: { canonical: '/design-system/${S}' },
}

export default function ${N.replace(/[^A-Za-z]/g, '')}Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="${ns}-scope">{children}</div>
}
`

const llmsRoute = `import { NextResponse } from 'next/server'

import { DECISIONS, GAPS, NAV, OUTPUT_CONTRACT } from '@/features/${S}/${S}-data'
import tokens from '@/features/${S}/tokens.json'

export const dynamic = 'force-static'

export function GET() {
  const body = [
    \`# ${N}\`,
    '',
    tokens.meta.oneSentence,
    '',
    \`Case: \${tokens.meta.case} · namespace \${tokens.meta.namespace} · \${tokens.meta.track} track\`,
    '',
    '## Sections',
    ...NAV.map((s) => \`- \${s.label} (#\${s.id})\`),
    '',
    '## Decisions',
    ...DECISIONS.map((d) => \`- **\${d.title}** — \${d.decision}\`),
    '',
    '## Tokens',
    ...tokens.primitives.map((p) => \`- \\\`\${tokens.meta.namespace}\${p.name}\\\`: \${p.value} — \${p.role}\`),
    '',
    '## Gaps',
    ...GAPS.map((g) => \`- \${g}\`),
    '',
    '## Outputs',
    ...OUTPUT_CONTRACT.map((o) => \`- \\\`\${o.path}\\\` — \${o.role}\`),
  ].join('\\n')

  return new NextResponse(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
`

const briefMd = `# ${N} — brief

**Case:** ${TITLE}
**Namespace:** \`${prefix}\`
**Hue seed:** ${hue}° (closest sibling: ${closest ? `${closest.name} at ${closest.distance.toFixed(0)}°` : 'none'})

## One sentence

${oneSentence}

## Track

TODO — **constructed** (corporate, technical, architectural) or **drawn**
(editorial, warm, object-led). Pick before drawing anything.

## Domain before defaults

TODO — five concepts from the product's world, five colours from the physical
version of that world, one signature, three obvious category defaults to avoid.

## Assumptions

- ASSUMPTION: the palette above is generated from a hue seed and a value mode;
  every role is a placeholder until a physical material is named.
- ASSUMPTION: no mark exists yet. \`public/brand/${S}/\` is empty on purpose.

## Not yet decided

- the mark family and its cut line
- the display face
- the signature element
- the two sections that make this page not a copy of its neighbours
`

/* ── write ───────────────────────────────────────────────────────────────── */

const files = {
  [`features/${S}/tokens.json`]: `${JSON.stringify(tokensJson, null, 2)}\n`,
  [`features/${S}/${S}-tokens.css`]: tokensCss,
  [`features/${S}/${S}.module.css`]: moduleCss,
  [`features/${S}/${S}-data.ts`]: dataTs,
  [`features/${S}/components/brand.tsx`]: brandTsx,
  [`app/design-system/${S}/page.tsx`]: pageTsx,
  [`app/design-system/${S}/layout.tsx`]: layoutTsx,
  [`app/design-system/${S}/llms.txt/route.ts`]: llmsRoute,
  [`public/brand/${S}/README.md`]: `# ${N} brand assets\n\nThe mark family does not exist yet. Generate it, then keep these names:\n\n- \`mark.svg\` / \`mark-reverse.svg\` — primary, 64 grid\n- \`mark-compact.svg\` / \`mark-compact-reverse.svg\` — separate drawing for 16px\n- \`glyph.svg\` — one-colour silhouette\n- \`wordmark.svg\` / \`wordmark-reverse.svg\` — outlines, never live text\n- \`lockup.svg\` / \`lockup-reverse.svg\` — horizontal\n- \`lockup-stacked.svg\` / \`lockup-stacked-reverse.svg\` — stacked\n`,
  [`brand/${S}/brief.md`]: briefMd,
}

const tree = Object.keys(files).sort()

if (peek || dry) {
  console.log(`\n  ${N} · ${TITLE} · namespace ${prefix} · hue ${hue}° · ${mode}\n`)
  console.log(`  palette                       L C H            on plate`)
  for (const p of prims) {
    const ratio = contrast(p.value, pal.plate.value)
    console.log(`    ${p.name.padEnd(14)} ${p.value}  ${p.lch.padEnd(16)} ${ratio.toFixed(1)}:1`)
  }

  console.log(`\n  nearest neighbours`)
  for (const s of neighbours.slice(0, 4)) {
    const c = s.culprit
    console.log(
      `    ${String(s.distance.toFixed(0)).padStart(3)}°  ${s.name.padEnd(22)} ${c ? `${c.name} ${c.hue.toFixed(0)}° c${c.chroma.toFixed(2)}` : '—'}`,
    )
  }
  if (closest && closest.distance < 25) {
    console.log(`    ! under 25° — same family. Separate by material, value and geometry, or move the hue.`)
  }

  console.log(`\n  free hue arcs (±25° around every sibling accent)`)
  console.log(`    ${arcs.length ? arcs.map(([a, b]) => `${a}–${b}°`).join('   ') : 'none — the wheel is full; differentiate by value and material'}`)

  console.log(`\n  files`)
  for (const file of tree) console.log(`    ${file}`)
  console.log('')
  if (peek) process.exit(0)
}

if (!dry) {
  for (const [path, body] of Object.entries(files)) {
    const full = join(root, path)
    await mkdir(resolve(full, '..'), { recursive: true })
    await writeFile(full, body, 'utf8')
  }
  await mkdir(join(root, 'public', 'brand', S), { recursive: true })
}

/* ── report ──────────────────────────────────────────────────────────────── */

const inkOnPlate = contrast(ink.value, pal.plate.value)
const signalOnPlate = contrast(signal.value, pal.plate.value)

console.log(`\n  ${dry ? 'DRY RUN — nothing written' : 'Fresh system scaffolded'}: ${N} (${TITLE})`)
console.log(`  namespace ${prefix} · hue ${hue}° · ${mode} mode · ${tree.length} files\n`)
console.log(`  contrast: ink on plate ${inkOnPlate.toFixed(1)}:1 · signal on plate ${signalOnPlate.toFixed(1)}:1`)
if (inkOnPlate < 7) console.log('  ! ink on plate is below 7:1 — reading plates need more than AA')
if (signalOnPlate < 4.5) console.log('  ! signal on plate is below 4.5:1 — it cannot carry text')
console.log(`\n  next`)
console.log(`    1. write brand/${S}/brief.md — track, 5 concepts, 5 physical colours, 3 defaults to avoid`)
console.log(`    2. fill theme.* in features/${S}/tokens.json, then regenerate the CSS`)
console.log(`    3. draw six marks, keep one; generate the family with brand-forge.mjs`)
console.log(`    4. detach: node scripts/detach-check.mjs --new features/${S}/tokens.json --ref <sibling>/tokens.json`)
console.log(`    5. replace ≥ 2 section ids in ${S}-data.ts so the page is not a copy\n`)
