#!/usr/bin/env node
/**
 * Detach gate — measure how far a new system is from the systems it sits next to.
 *
 *   node scripts/detach-check.mjs --new features/<slug>/tokens.json \
 *     --ref features/clearing/tokens.json --ref features/strand/tokens.json
 *
 *   node scripts/detach-check.mjs --new a.json --ref b.json --json
 *   node scripts/detach-check.mjs --scan features          # every pair, matrix
 *
 * Why this exists: a new case is easy to write and hard to make distinct. Sitting
 * next to eight finished systems, an agent will quietly inherit the neighbour's
 * hue family, its radius, its display face and its section order, and call the
 * result a new identity. The gate turns "it feels different" into a number.
 *
 * Reads tokens.json files with { meta, theme, primitives[], sections? }.
 * Zero dependencies. Exit 1 on any hard fail or a score below --min (default 70).
 *
 * Hard fails (no score can rescue them):
 *   H1 same namespace            H2 same material string
 *   H3 same display face         H4 same accent hex
 *   H5 one-sentence Jaccard > 0.6 (same sentence, new nouns)
 *
 * Scored (0–100):
 *   hue 25 · value 15 · material 15 · geometry 15 · type 10 · structure 10 · copy 10
 */
import { readFile, readdir } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'

/* ── colour maths: hex → OKLCH ───────────────────────────────────────────── */

const toLinear = (channel) => {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function hexToOklch(hex) {
  const raw = String(hex).trim().replace('#', '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(full.slice(i, i + 2), 16)))

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const C = Math.hypot(A, B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return { L, C, H, hex: `#${full.toLowerCase()}` }
}

/** Signed shortest arc between two hues, in degrees (0–180). */
function hueDelta(h1, h2) {
  const d = Math.abs(h1 - h2) % 360
  return d > 180 ? 360 - d : d
}

/** OKLab distance scaled to a familiar 0–100 range. */
function deltaE(a, b) {
  return Math.hypot(a.L - b.L, a.C * Math.cos((a.H * Math.PI) / 180) - b.C * Math.cos((b.H * Math.PI) / 180), a.C * Math.sin((a.H * Math.PI) / 180) - b.C * Math.sin((b.H * Math.PI) / 180)) * 100
}

/* ── tokens ──────────────────────────────────────────────────────────────── */

const ACCENT_HINT = /signal|accent|brand|mark|loud|focal|glint/i

/**
 * Token files in the wild are not uniform: one case stores `primitives[]` and a
 * `theme{}` DNA object, the next stores `color{}` and `radius{}` with a `track`
 * string. Normalise before comparing, or the gate reports differences that are
 * only differences in file layout.
 */
function normalize(tokens) {
  const meta = tokens.meta ?? {}
  const rawRadius = tokens.radius
  const radius =
    rawRadius == null
      ? undefined
      : typeof rawRadius === 'object'
        ? `${rawRadius.md ?? rawRadius.sm ?? Object.values(rawRadius)[0]}px`
        : String(rawRadius)

  const theme = {
    family: tokens.theme?.family ?? meta.family ?? tokens.track,
    material: tokens.theme?.material ?? meta.material ?? tokens.material,
    edge: tokens.theme?.edge,
    offset: tokens.theme?.offset,
    stroke: tokens.theme?.stroke,
    tile: tokens.theme?.tile,
    radius: tokens.theme?.radius ?? radius,
    ring: tokens.theme?.ring,
    density: tokens.theme?.density,
    label: tokens.theme?.label,
    'field-recipe': tokens.theme?.['field-recipe'] ?? tokens.theme?.fieldRecipe,
    'mark-form': tokens.theme?.['mark-form'] ?? tokens.theme?.markForm ?? meta.markForm,
  }

  const primitives = Array.isArray(tokens.primitives)
    ? tokens.primitives
    : Object.entries(tokens.color ?? {}).map(([name, value]) => ({ name, value, role: '' }))

  const typeEntries = Array.isArray(tokens.type)
    ? tokens.type.map((t) => ({
        // `name/value` (Cove, Strand, Vitrine) or `role/face` (Hachure). Reading only
        // the first shape made the display-face hard fail blind for the second.
        name: String(t.name ?? t.role ?? ''),
        value: String(t.value ?? t.face ?? ''),
      }))
    : Object.entries(tokens.type ?? {}).map(([name, value]) => ({
        name,
        value: typeof value === 'string' ? value : '',
      }))

  const pick = (pattern) => {
    const hit = typeEntries.find((t) => pattern.test(t.name) && t.value)
    if (!hit) return ''
    // "var(--font-syne), 'Syne', sans-serif" → "Syne": the CSS var is a host
    // alias, not a face, so it must never be the compared identity.
    const parts = hit.value
      .split(',')
      .map((p) => p.replace(/['"]/g, '').trim())
      .filter((p) => p && !p.startsWith('var(') && !/^(sans-serif|serif|monospace|system-ui)$/i.test(p))
    return (parts[0] ?? '').toLowerCase()
  }

  return {
    meta: {
      name: meta.name ?? tokens.name,
      namespace: meta.namespace ?? tokens.namespace,
      essence: meta.essence,
      promise: meta.promise,
      oneSentence: meta.oneSentence ?? tokens.oneSentence,
    },
    theme,
    primitives,
    type: {
      display: pick(/display/i),
      body: pick(/reading|body|sans|workhorse/i),
    },
    sections: tokens.sections ?? meta.sections ?? [],
  }
}

function primitivesOf(tokens) {
  const list = Array.isArray(tokens.primitives) ? tokens.primitives : []
  return list
    .filter((p) => p && typeof p.value === 'string' && p.value.startsWith('#'))
    .map((p) => {
      const oklch = hexToOklch(p.value)
      return oklch
        ? { name: p.name ?? 'unnamed', role: p.role ?? '', ...oklch }
        : null
    })
    .filter(Boolean)
}

const accentsOf = (prims) => {
  const hinted = prims.filter((p) => ACCENT_HINT.test(p.name) || ACCENT_HINT.test(p.role))
  return hinted.length ? hinted : prims.filter((p) => p.C > 0.05)
}

const chromaOf = (prims) => {
  const chromatic = prims.filter((p) => p.C > 0.02)
  if (!chromatic.length) return 0
  return chromatic.reduce((sum, p) => sum + p.C, 0) / chromatic.length
}

const lightnessSpread = (prims) => {
  if (!prims.length) return 0
  const ls = prims.map((p) => p.L)
  return Math.max(...ls) - Math.min(...ls)
}

const meanL = (prims) => (prims.length ? prims.reduce((s, p) => s + p.L, 0) / prims.length : 0)

/* ── text ────────────────────────────────────────────────────────────────── */

const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'for', 'to', 'in', 'on', 'with', 'that', 'is', 'it', 'its', 'as', 'at', 'by', 'from', 'this'])

const words = (text) =>
  new Set(
    String(text ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  )

function jaccard(a, b) {
  if (!a.size || !b.size) return 0
  let shared = 0
  for (const w of a) if (b.has(w)) shared += 1
  return shared / (a.size + b.size - shared)
}

/**
 * A scaffold ships with TODO in every DNA key. A placeholder is not a decision,
 * so it must never earn points for "differing" from the neighbour — otherwise
 * the fastest way to a high score is to leave the work undone.
 */
const isPlaceholder = (value) => {
  const v = String(value ?? '').trim()
  return v === '' || /^(todo|tbd|placeholder|xxx|n\/a)\b/i.test(v) || /\btodo\b/i.test(v)
}

/* ── comparison ──────────────────────────────────────────────────────────── */

function compare(newRaw, refRaw, refName) {
  const newTokens = normalize(newRaw)
  const refTokens = normalize(refRaw)
  const hard = []
  const soft = []
  const evidence = []

  const nMeta = newTokens.meta
  const rMeta = refTokens.meta
  const nTheme = newTokens.theme
  const rTheme = refTokens.theme

  const nPrims = primitivesOf(newTokens)
  const rPrims = primitivesOf(refTokens)

  /* H1 namespace */
  const nNs = nMeta.namespace ?? ''
  const rNs = rMeta.namespace ?? ''
  if (nNs && nNs === rNs) hard.push(`H1 namespace collision: both use "${nNs}"`)

  /* H2 material */
  if (nTheme.material && nTheme.material === rTheme.material)
    hard.push(`H2 same material: "${nTheme.material}"`)

  /* H3 display face */
  const nFace = newTokens.type.display.toLowerCase()
  const rFace = refTokens.type.display.toLowerCase()
  if (nFace && nFace === rFace && !isPlaceholder(nFace)) hard.push(`H3 same display face: "${nFace}"`)

  /* H4 accent hex */
  const nAcc = accentsOf(nPrims)
  const rAcc = accentsOf(rPrims)
  for (const a of nAcc) {
    for (const b of rAcc) {
      if (a.hex === b.hex) hard.push(`H4 accent hex shared: ${a.name} = ${b.name} = ${a.hex}`)
    }
  }

  /* H5 same sentence */
  const nSent = words(nMeta.oneSentence ?? nMeta.promise ?? nMeta.essence)
  const rSent = words(rMeta.oneSentence ?? rMeta.promise ?? rMeta.essence)
  const sentOverlap = jaccard(nSent, rSent)
  if (sentOverlap > 0.6)
    hard.push(`H5 one-sentence overlap ${(sentOverlap * 100).toFixed(0)}% — same claim, new nouns`)

  /* ── scored: hue ── */
  let hueScore = 25
  let minHue = 180
  if (nAcc.length && rAcc.length) {
    for (const a of nAcc) {
      for (const b of rAcc) {
        if (a.C < 0.03 || b.C < 0.03) continue
        const d = hueDelta(a.H, b.H)
        minHue = Math.min(minHue, d)
        if (d < 12) evidence.push(`hue ${a.name}(${a.H.toFixed(0)}°) vs ${b.name}(${b.H.toFixed(0)}°) = ${d.toFixed(0)}° — same family`)
      }
    }
    if (minHue === 180 && nAcc.every((a) => a.C < 0.03)) minHue = 180
    // 25° separation earns full marks; 0° earns none.
    hueScore = Math.max(0, Math.min(25, (minHue / 25) * 25))
    evidence.push(`closest accent hue: ${minHue.toFixed(0)}° from ${refName} (≥ 25° passes)`)
    if (minHue < 25) soft.push(`hue: ${minHue.toFixed(0)}° is too close — move the accent family`)
  } else {
    hueScore = 12
    soft.push('no chromatic accent found in one side — hue scored neutral')
  }

  /* ── scored: value structure ── */
  const lSpreadN = lightnessSpread(nPrims)
  const lSpreadR = lightnessSpread(rPrims)
  const meanDiff = Math.abs(meanL(nPrims) - meanL(rPrims))
  const chromaDiff = Math.abs(chromaOf(nPrims) - chromaOf(rPrims))
  // A different value *structure* (not just a different tint) is what separates
  // a night system from a paper system from a mid-tone system.
  let valueScore = 0
  valueScore += Math.min(1, meanDiff / 0.12) * 8
  valueScore += Math.min(1, chromaDiff / 0.05) * 4
  valueScore += Math.min(1, Math.abs(lSpreadN - lSpreadR) / 0.2) * 3
  valueScore = Math.min(15, valueScore)
  evidence.push(
    `value: mean L ${meanL(nPrims).toFixed(2)} vs ${meanL(rPrims).toFixed(2)} · chroma ${chromaOf(nPrims).toFixed(3)} vs ${chromaOf(rPrims).toFixed(3)}`,
  )

  /* ── scored: material ── */
  const dnaKeys = ['family', 'material', 'edge', 'offset', 'stroke', 'tile', 'radius', 'ring', 'density', 'label', 'field-recipe', 'mark-form']
  const placeholders = dnaKeys.filter((k) => isPlaceholder(nTheme[k]))
  const comparable = dnaKeys.filter((k) => !isPlaceholder(nTheme[k]) && !isPlaceholder(rTheme[k]))
  const dnaDiff = comparable.filter((k) => String(nTheme[k] ?? '') !== String(rTheme[k] ?? ''))
  let materialScore = comparable.length ? Math.min(15, (dnaDiff.length / comparable.length) * 15) : 0
  if (!isPlaceholder(nTheme.material) && String(nTheme.material) !== String(rTheme.material ?? ''))
    materialScore = Math.min(15, materialScore + 3)
  if (placeholders.length) {
    soft.push(`theme DNA: ${placeholders.length} of 12 keys are placeholders (${placeholders.slice(0, 4).join(', ')}${placeholders.length > 4 ? ', …' : ''}) — not scored`)
  }
  if (comparable.length < 6 && !placeholders.length) {
    soft.push(`only ${comparable.length}/12 DNA keys are declared on both sides — the reference may predate the DNA object`)
  }
  evidence.push(`theme DNA differs on ${dnaDiff.length}/${comparable.length} comparable keys`)

  /* ── scored: geometry ── */
  const geoKeys = ['radius', 'edge', 'tile', 'offset', 'stroke']
  const geoDecided = geoKeys.filter((k) => !isPlaceholder(nTheme[k]))
  const geoDiff = geoDecided.filter((k) => String(nTheme[k] ?? '') !== String(rTheme[k] ?? ''))
  const geometryScore = geoDecided.length ? Math.min(15, (geoDiff.length / geoKeys.length) * 15) : 0
  if (geoDecided.length && geoDiff.length < 2) soft.push(`geometry: only ${geoDiff.length}/5 differ (need ≥ 2)`)

  /* ── scored: type ── */
  const nBody = newTokens.type.body.toLowerCase()
  const rBody = refTokens.type.body.toLowerCase()
  const facePlaceholder = isPlaceholder(newTokens.type.display)
  let typeScore = 10
  if (facePlaceholder) {
    typeScore = 0
    soft.push('display face is a placeholder — 0/10')
  } else if (nFace === rFace) {
    typeScore = 0
  } else if (nBody && nBody === rBody) {
    typeScore = 4
  }
  if (nFace && rFace && nFace !== rFace && !facePlaceholder) evidence.push(`display: ${nFace} vs ${rFace}`)

  /* ── scored: structure ── */
  const nSec = newTokens.sections.map((s) => String(s).toLowerCase())
  const rSec = refTokens.sections.map((s) => String(s).toLowerCase())
  let structureScore = 5
  if (nSec.length && rSec.length) {
    const fresh = nSec.filter((s) => !rSec.includes(s))
    structureScore = Math.min(10, (fresh.length / Math.max(1, Math.ceil(rSec.length / 2))) * 5 + 5)
    if (fresh.length < 2) soft.push(`structure: only ${fresh.length} section(s) not in ${refName} (need ≥ 2)`)
    evidence.push(`sections: ${fresh.length}/${nSec.length} not present in ${refName}`)
  } else {
    soft.push('no sections[] in tokens.json — structure scored neutral')
  }

  /* ── scored: copy ── */
  const claim = nMeta.oneSentence ?? nMeta.promise ?? nMeta.essence
  const copyScore = isPlaceholder(claim) ? 0 : Math.max(0, 10 - sentOverlap * 10 * 1.6)
  if (isPlaceholder(claim)) soft.push('one sentence is a placeholder — 0/10')

  // An external reference (brand-ref.mjs) has no DNA, sections or one-sentence claim, so
  // material, geometry, structure and copy would all award points for differing from nothing.
  // Score only what can be measured — hue, value, type — and scale that 50 to 100.
  const external = refRaw._external === true
  if (external) soft.push('external reference: hue, value and type only, scaled to 100 (DNA, structure and copy are not measurable)')
  const measured = Math.max(0, hueScore) + valueScore + typeScore
  const score = external
    ? Math.round((measured / 50) * 100)
    : Math.round(Math.max(0, hueScore) + valueScore + materialScore + geometryScore + typeScore + structureScore + copyScore)

  const zero = external ? () => 0 : (n) => n
  return { ref: refName, score, hard, soft, evidence, parts: {
    hue: Math.round(hueScore), value: Math.round(valueScore), material: zero(Math.round(materialScore)),
    geometry: zero(Math.round(geometryScore)), type: typeScore, structure: zero(Math.round(structureScore)), copy: zero(Math.round(copyScore)),
  } }
}

/* ── cli ─────────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2)
const many = (name) => args.reduce((acc, a, i) => (a === `--${name}` ? [...acc, args[i + 1]] : acc), []).filter(Boolean)
const one = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const min = Number(one('min', 70))
const asJson = has('json')
const scanDir = one('scan', null)

const load = async (path) => JSON.parse(await readFile(path, 'utf8'))
const label = (path) => {
  const tokens = path
  try {
    return basename(resolve(path, '..')) || tokens
  } catch {
    return tokens
  }
}

/**
 * Most cases keep their section list in `<slug>-data.ts` as the NAV array, not
 * in tokens.json. Read it from the sibling folder so the structure check works
 * on systems that were never written with this gate in mind — and so nobody has
 * to edit eight finished cases to score a ninth.
 */
async function sectionsFromDataFile(tokensPath, tokens) {
  const direct = tokens.sections ?? tokens.meta?.sections
  if (Array.isArray(direct) && direct.length) return tokens

  const dir = resolve(tokensPath, '..')
  const slug = basename(dir)
  for (const candidate of [`${slug}-data.ts`, `${slug}-data.tsx`, 'data.ts']) {
    try {
      const source = await readFile(join(dir, candidate), 'utf8')
      // Tolerates `export const NAV = [` and `export const NAV: readonly NavItem[] = [`.
      const navBlock = source.match(/export\s+const\s+NAV\b[^=]*=\s*\[([\s\S]*?)\]\s*(?:as\s+const|\n|$)/)
      if (!navBlock) continue
      const ids = [...navBlock[1].matchAll(/id:\s*['"`]([a-z0-9-]+)['"`]/gi)].map((m) => m[1])
      if (ids.length) return { ...tokens, sections: ids }
    } catch {
      /* no data file — fine */
    }
  }
  return tokens
}

async function collectScan(dir) {
  const out = []
  const walk = async (current, depth = 0) => {
    if (depth > 2) return
    const entries = await readdir(current, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const full = join(current, entry.name)
      if (entry.isDirectory()) await walk(full, depth + 1)
      else if (entry.name.endsWith('tokens.json')) out.push(full)
    }
  }
  await walk(resolve(dir))
  return out
}

if (scanDir) {
  const files = await collectScan(scanDir)
  if (files.length < 2) {
    console.error(`Need at least two tokens.json under ${scanDir}`)
    process.exit(1)
  }
  const systems = await Promise.all(
    files.map(async (file) => {
      const raw = await load(file)
      const tokens = await sectionsFromDataFile(file, raw)
      return { file, tokens, name: normalize(tokens).meta.name ?? basename(resolve(file, '..')) }
    }),
  )
  const rows = []
  let worst = { score: 100 }
  for (let i = 0; i < systems.length; i += 1) {
    for (let j = i + 1; j < systems.length; j += 1) {
      const result = compare(systems[i].tokens, systems[j].tokens, systems[j].name)
      rows.push({ a: systems[i].name, b: systems[j].name, ...result })
      // A placeholder-driven score says nothing about visual similarity, so it
      // must not be reported as the portfolio's closest pair.
      const placeholder = result.soft.some((s) => /placeholder/i.test(s))
      if (!placeholder && result.score < worst.score) {
        worst = { score: result.score, a: systems[i].name, b: systems[j].name }
      }
    }
  }
  rows.sort((x, y) => x.score - y.score)
  if (asJson) {
    console.log(JSON.stringify({ pairs: rows }, null, 2))
  } else {
    console.log(`\n  Detach matrix — ${systems.length} systems, ${rows.length} pairs\n`)
    const w = Math.max(10, ...systems.map((s) => s.name.length)) + 2
    // A is scored; B is the reference it is scored against. Without this the
    // row reads as if the score belonged to B, which is how "Hachure × Strand
    // 40" gets mistaken for Strand's own result.
    console.log(`  ${'A (scored)'.padEnd(w)}${'B (reference)'.padEnd(w)}score   verdict`)
    for (const r of rows) {
      // A low score driven by TODO/empty keys is a data gap in A's tokens, not
      // evidence that the two systems look alike. Say which one it is.
      const incomplete = r.soft.some((s) => /placeholder/i.test(s))
      const verdict = r.hard.length
        ? `FAIL  ${r.hard[0]}`
        : incomplete
          ? 'incomplete tokens'
          : r.score < min
            ? 'weak'
            : 'ok'
      console.log(`  ${r.a.padEnd(w)}${r.b.padEnd(w)}${String(r.score).padEnd(8)}${verdict}`)
    }
    console.log(
      `\n  weakest pair: ${worst.a} (scored) × ${worst.b} (reference) = ${worst.score}` +
        `\n  To read a system's own worst score, run --new for that system against each --ref.\n`,
    )
  }
  const failed = rows.some((r) => r.hard.length || r.score < min)
  process.exit(failed ? 1 : 0)
}

const newPath = one('new', null)
const refPaths = many('ref')
if (!newPath || !refPaths.length) {
  console.error(`Usage:
  node scripts/detach-check.mjs --new features/<slug>/tokens.json --ref features/<ref>/tokens.json [--ref ...]
  node scripts/detach-check.mjs --scan features [--min 70] [--json]`)
  process.exit(1)
}

const newTokens = await sectionsFromDataFile(newPath, await load(newPath))
const newName = normalize(newTokens).meta.name ?? basename(resolve(newPath, '..'))
const results = []
for (const refPath of refPaths) {
  const refTokens = await sectionsFromDataFile(refPath, await load(refPath))
  results.push(compare(newTokens, refTokens, normalize(refTokens).meta.name ?? basename(resolve(refPath, '..'))))
}

const worst = results.reduce((a, b) => (b.score < a.score ? b : a))
const hardFails = results.flatMap((r) => r.hard)

if (asJson) {
  console.log(JSON.stringify({ system: newName, worst: worst.score, results }, null, 2))
} else {
  console.log(`\n  Detach gate — ${newName}\n`)
  for (const r of results) {
    const verdict = r.hard.length ? 'FAIL' : r.score >= min ? 'PASS' : 'WEAK'
    console.log(`  ${verdict.padEnd(5)} ${String(r.score).padStart(3)}/100  vs ${r.ref}`)
    console.log(
      `        hue ${String(r.parts.hue).padStart(2)} · value ${String(r.parts.value).padStart(2)} · material ${String(r.parts.material).padStart(2)} · geo ${String(r.parts.geometry).padStart(2)} · type ${String(r.parts.type).padStart(2)} · structure ${String(r.parts.structure).padStart(2)} · copy ${String(r.parts.copy).padStart(2)}`,
    )
    for (const line of r.evidence) console.log(`        · ${line}`)
    for (const line of r.soft) console.log(`        ! ${line}`)
    for (const line of r.hard) console.log(`        ✗ ${line}`)
    console.log('')
  }
  console.log(`  worst pair: ${worst.score}/100 (threshold ${min})`)
  if (hardFails.length) console.log(`  ${hardFails.length} hard fail(s) — fix these before drawing anything.\n`)
  else console.log('')
}

process.exit(hardFails.length || worst.score < min ? 1 : 0)
