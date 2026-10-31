#!/usr/bin/env node
/**
 * Brand reference library — study what a category already looks like, then leave it.
 *
 *   node scripts/brand-ref.mjs list   [--category fintech] [--tag minimal]
 *   node scripts/brand-ref.mjs search <words…>
 *   node scripts/brand-ref.mjs near   --hue 28 [--within 25]     # who already owns this hue
 *   node scripts/brand-ref.mjs show   <id>                       # summary + DESIGN.md head
 *   node scripts/brand-ref.mjs pull   <id…> [--out dir]          # DESIGN.md + tokens.json
 *   node scripts/brand-ref.mjs ref    <id…> --out refs/          # detach-check input
 *
 * Source: github.com/ricocc/brands-design-md (the collection behind
 * design.ricoui.com/brands). 69 unofficial, "inspired by" analyses, one folder per brand.
 *
 * Why it fetches instead of shipping a copy: that repository carries no LICENSE file and
 * calls itself an unaffiliated reference. Redistributing it inside this repo would be a
 * licence we do not hold. Files go to the OS temp directory, never into the project.
 *
 * Why it exists: the detach gate measures a new system against its *siblings*. A
 * stranger's brand is a sibling too — an accent within 25° of Stripe's indigo is a
 * resemblance a client will name in the first meeting. `ref` turns a brand into a file the
 * existing gate can score, so "different from the category" becomes a number.
 *
 * Zero dependencies. Needs network (raw.githubusercontent.com); BRAND_REFS_BASE overrides
 * the source, which is how the tests run offline.
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const BASE = (process.env.BRAND_REFS_BASE ?? 'https://raw.githubusercontent.com/ricocc/brands-design-md/master').replace(/\/$/, '')
const CACHE = join(tmpdir(), 'sunnyside-brand-refs')
const TTL_MS = 24 * 60 * 60 * 1000

/* ── args ────────────────────────────────────────────────────────────────── */

const [cmd, ...rest] = process.argv.slice(2)
const flags = {}
const pos = []
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i].startsWith('--')) flags[rest[i].slice(2)] = rest[i + 1]?.startsWith('--') || rest[i + 1] === undefined ? true : rest[(i += 1)]
  else pos.push(rest[i])
}

const die = (message) => {
  console.error(message)
  process.exit(1)
}

/* ── network, with a cache that expires ──────────────────────────────────── */

async function fetchText(path, { fresh = false } = {}) {
  const file = join(CACHE, path.replace(/[^a-z0-9._-]/gi, '_'))
  if (!fresh) {
    try {
      const info = await stat(file)
      if (Date.now() - info.mtimeMs < TTL_MS) return await readFile(file, 'utf8')
    } catch {
      /* miss */
    }
  }
  let res
  try {
    res = await fetch(`${BASE}/${path}`)
  } catch (error) {
    die(`Cannot reach ${BASE} (${error.cause?.code ?? error.message}). If this host is blocked, allow raw.githubusercontent.com or set BRAND_REFS_BASE.`)
  }
  if (!res.ok) die(`${res.status} for ${path}`)
  const text = await res.text()
  await mkdir(CACHE, { recursive: true })
  await writeFile(file, text)
  return text
}

const registry = async () => JSON.parse(await fetchText('registry.json'))

function findBrand(list, id) {
  const wanted = String(id).toLowerCase()
  const hit = list.find((b) => b.id.toLowerCase() === wanted || b.folder.toLowerCase() === wanted)
  if (hit) return hit
  const near = list.filter((b) => b.id.includes(wanted) || b.name.toLowerCase().includes(wanted)).map((b) => b.id)
  die(`No brand "${id}".${near.length ? ` Did you mean: ${near.slice(0, 6).join(', ')}?` : ' Run `list`.'}`)
}

/* ── colour: hex → OKLCH hue (kept local; detach-check is a CLI, not a module) ── */

function hueOf(hex) {
  const raw = String(hex).trim().replace('#', '')
  const full = raw.length === 3 ? [...raw].map((c) => c + c).join('') : raw
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  const lin = (i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = [0, 2, 4].map(lin)
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
const arc = (a, b) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/* ── DTCG tokens → the flat shape detach-check already normalises ─────────── */

function collectColors(node, trail, out) {
  if (!node || typeof node !== 'object') return
  if (typeof node.$value === 'string') {
    if (/^#[0-9a-f]{3,8}$/i.test(node.$value)) out[trail.join('-')] = node.$value.slice(0, 7)
    return
  }
  for (const [key, child] of Object.entries(node)) if (!key.startsWith('$')) collectColors(child, [...trail, key], out)
}

function firstFamily(value) {
  const family = typeof value === 'string' ? value : value?.fontFamily
  if (!family) return ''
  return (
    String(family)
      .split(',')
      .map((p) => p.replace(/['"]/g, '').trim())
      .find((p) => p && !/^(sans-serif|serif|monospace|system-ui|var\()/i.test(p)) ?? ''
  )
}

function toDetachShape(brand, tokens) {
  const color = {}
  collectColors(tokens.color, [], color)

  // Display = the first typography entry that reads as a headline; otherwise the first entry.
  const entries = Object.entries(tokens.typography ?? {})
  const pick = entries.find(([k]) => /display|hero|h1|heading|headline/i.test(k)) ?? entries[0]
  const display = pick ? firstFamily(pick[1].$value) : ''
  const radiusValues = Object.values(tokens.radius ?? {}).map((r) => r.$value).filter((v) => /px$/.test(v))

  return {
    _external: true, // tells detach-check to score hue, value and type only
    meta: { name: brand.name, namespace: `ref-${brand.id}`, oneSentence: brand.description },
    // detach-check only scores what it can read; a reference has no DNA, so those keys stay absent
    // and are reported as "not scored" instead of earning points for differing.
    color,
    type: display ? { display } : {},
    radius: radiusValues[1] ?? radiusValues[0],
    _source: `${BASE}/brands/${brand.folder}/tokens.json`,
  }
}

/* ── commands ────────────────────────────────────────────────────────────── */

const line = (b) => `${b.id.padEnd(16)} ${b.name.padEnd(18)} ${b.category.padEnd(28)} ${(b.previewColors ?? []).slice(0, 3).join(' ')}`

async function main() {
  if (!cmd || cmd === 'help' || flags.help) {
    console.log(`Usage:
  brand-ref.mjs list   [--category <text>] [--tag <text>]
  brand-ref.mjs search <words…>
  brand-ref.mjs near   --hue <0-360> [--within 25]
  brand-ref.mjs show   <id>
  brand-ref.mjs pull   <id…> [--out <dir>]
  brand-ref.mjs ref    <id…> --out <dir>`)
    return
  }
  const list = await registry()

  if (cmd === 'list') {
    const cat = flags.category && String(flags.category).toLowerCase()
    const tag = flags.tag && String(flags.tag).toLowerCase()
    const rows = list.filter(
      (b) => (!cat || b.category.toLowerCase().includes(cat)) && (!tag || b.tags.some((t) => t.toLowerCase().includes(tag))),
    )
    rows.forEach((b) => console.log(line(b)))
    console.log(`\n${rows.length} of ${list.length} brands`)
    return
  }

  if (cmd === 'search') {
    if (!pos.length) die('search needs at least one word')
    const words = pos.map((w) => w.toLowerCase())
    const scored = list
      .map((b) => {
        const hay = `${b.name} ${b.category} ${b.tags.join(' ')} ${b.description}`.toLowerCase()
        return { b, n: words.filter((w) => hay.includes(w)).length }
      })
      .filter((x) => x.n)
      .sort((a, c) => c.n - a.n)
    scored.slice(0, 12).forEach(({ b }) => console.log(line(b)))
    if (!scored.length) console.log('no match')
    return
  }

  if (cmd === 'near') {
    const hue = Number(flags.hue)
    if (!Number.isFinite(hue)) die('near needs --hue <0-360>')
    const within = Number(flags.within ?? 25)
    const hits = []
    for (const b of list) {
      for (const hex of b.previewColors ?? []) {
        const o = hueOf(hex)
        if (!o || o.C < 0.06) continue // greys do not own a hue
        const d = arc(o.H, hue)
        if (d <= within) hits.push({ b, hex, d })
      }
    }
    const seen = new Set()
    const rows = hits.sort((a, c) => a.d - c.d).filter((h) => !seen.has(h.b.id) && seen.add(h.b.id))
    rows.forEach((h) => console.log(`${h.b.name.padEnd(18)} ${h.hex}  ${h.d.toFixed(0)}° away   (${h.b.category})`))
    console.log(`\n${rows.length} brand(s) with a chromatic colour within ${within}° of hue ${hue}. These are the resemblances a client will name.`)
    return
  }

  if (cmd === 'show') {
    const b = findBrand(list, pos[0])
    console.log(`${b.name} — ${b.category}\n${b.website}\n${b.description}\nTags: ${b.tags.join(', ')}\nColours: ${b.previewColors.join(' ')}\n`)
    const md = await fetchText(`brands/${b.folder}/DESIGN.md`)
    console.log(md.split('\n').slice(0, 40).join('\n'))
    console.log(`\n… (${md.split('\n').length} lines) — \`pull ${b.id}\` to keep it.`)
    return
  }

  if (cmd === 'pull' || cmd === 'ref') {
    if (!pos.length) die(`${cmd} needs at least one brand id`)
    const out = resolve(String(flags.out ?? (cmd === 'ref' ? 'refs' : join(CACHE, 'pulled'))))
    await mkdir(out, { recursive: true })
    for (const id of pos) {
      const b = findBrand(list, id)
      if (cmd === 'pull') {
        for (const f of ['DESIGN.md', 'tokens.json']) {
          if (!b.files.includes(f)) continue
          await writeFile(join(out, `${b.id}.${f}`), await fetchText(`brands/${b.folder}/${f}`))
        }
        console.log(`pulled ${b.id} → ${out}`)
      } else {
        if (!b.files.includes('tokens.json')) {
          console.error(`skip ${b.id}: no tokens.json`)
          continue
        }
        const shaped = toDetachShape(b, JSON.parse(await fetchText(`brands/${b.folder}/tokens.json`)))
        const n = Object.keys(shaped.color).length
        if (!n) {
          console.error(`skip ${b.id}: no hex colours in tokens.json`)
          continue
        }
        await writeFile(join(out, `${b.id}.json`), JSON.stringify(shaped, null, 2))
        console.log(`ref ${b.id} → ${join(out, `${b.id}.json`)}  (${n} colours, display "${shaped.type.display ?? '—'}")`)
      }
    }
    if (cmd === 'ref')
      console.log(`\nScore against them:\n  node scripts/detach-check.mjs --new features/<slug>/tokens.json ${pos.map((i) => `--ref ${join(String(flags.out ?? 'refs'), `${i}.json`)}`).join(' ')}\nHue, value and display face are scored; DNA, structure and copy are not (a reference has none).`)
    return
  }

  die(`Unknown command "${cmd}". Try: list, search, near, show, pull, ref`)
}

await main()
