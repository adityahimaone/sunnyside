#!/usr/bin/env node
/**
 * Free assets, with the paperwork — photographs and UI icons for a proof page.
 *
 *   node scripts/assets.mjs search "dune at dawn" [--source openverse] [--orientation landscape] [--n 6]
 *   node scripts/assets.mjs get openverse:<id>   --out public/brand/<slug>/assets [--name hero]
 *   node scripts/assets.mjs get pexels:<id>      --out …  [--size large]
 *   node scripts/assets.mjs get unsplash:<id>    --out …
 *   node scripts/assets.mjs search "arrow" --source iconify
 *   node scripts/assets.mjs get iconify:lucide:arrow-right --out …
 *   node scripts/assets.mjs credits --dir public/brand/<slug>/assets     # verify every file has a record
 *
 * Sources
 *   openverse  no key.  Default filter cc0 + pdm: nothing to attribute. Widen with --license by,by-sa.
 *   pexels     PEXELS_API_KEY.     Free key, instant. Credit the photographer and Pexels.
 *   unsplash   UNSPLASH_ACCESS_KEY. Free key. Hotlink + download tracking + utm credit are rules,
 *              and the API is meant for human-chosen images, so search is capped at 8 results.
 *   iconify    no key.  Licence varies per icon set; it is read and recorded, never assumed.
 *
 * Not for marks. A logo is drawn (brand-forge / cast-forge); a stock image is imagery — a hero
 * plate, a dither source, a texture. Never trace, recolour or ship one as the identity.
 *
 * Every `get` appends to <out>/credits.json. A file in assets/ with no entry fails `gates.mjs`.
 *
 * Zero dependencies. *_BASE env vars override each host, which is how the tests run offline.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

const HOSTS = {
  openverse: process.env.ASSETS_OPENVERSE_BASE ?? 'https://api.openverse.org/v1',
  pexels: process.env.ASSETS_PEXELS_BASE ?? 'https://api.pexels.com/v1',
  unsplash: process.env.ASSETS_UNSPLASH_BASE ?? 'https://api.unsplash.com',
  iconify: process.env.ASSETS_ICONIFY_BASE ?? 'https://api.iconify.design',
}
const UTM = 'utm_source=sunnyside_brand_system&utm_medium=referral'
const MAX_BYTES = 20 * 1024 * 1024
const UA = 'sunnyside-brand-system/3.3 (+https://github.com/adityahimaone/sunnyside)'

const [cmd, ...rest] = process.argv.slice(2)
const flags = {}
const pos = []
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i].startsWith('--')) flags[rest[i].slice(2)] = rest[i + 1] === undefined || rest[i + 1].startsWith('--') ? true : rest[(i += 1)]
  else pos.push(rest[i])
}
const die = (m) => {
  console.error(m)
  process.exit(1)
}

/* ── http ────────────────────────────────────────────────────────────────── */

async function getJson(url, headers = {}) {
  let res
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } })
  } catch (e) {
    die(`Cannot reach ${new URL(url).host} (${e.cause?.code ?? e.message}). If the host is blocked, allow it in the network settings.`)
  }
  if (res.status === 401 || res.status === 403) die(`${new URL(url).host} refused the key (${res.status}).`)
  if (res.status === 429) die(`${new URL(url).host} is rate-limiting this client (429). Wait, and ask for fewer results.`)
  if (!res.ok) die(`${res.status} from ${new URL(url).host}${new URL(url).pathname}`)
  return res.json()
}

async function getBytes(url) {
  let res
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA } })
  } catch (e) {
    die(`Download failed (${e.cause?.code ?? e.message}): ${url}`)
  }
  if (!res.ok) die(`${res.status} downloading ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > MAX_BYTES) die(`${(buf.length / 1048576).toFixed(1)} MB is over the ${MAX_BYTES / 1048576} MB cap — pick a smaller size.`)
  return { buf, type: res.headers.get('content-type') ?? '' }
}

const key = (name, where) => {
  const v = process.env[name]
  if (!v) die(`${name} is not set. Free key: ${where}. (openverse and iconify need none.)`)
  return v
}
const q = (o) => new URLSearchParams(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')).toString()
const extOf = (url, type) => {
  const fromType = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/svg+xml': '.svg', 'image/gif': '.gif' }[type.split(';')[0].trim()]
  return fromType ?? (extname(new URL(url).pathname) || '.jpg')
}

/* ── each source speaks the same two verbs: find() → candidates, one() → a record ── */

const sources = {
  openverse: {
    async find(text, o) {
      const data = await getJson(`${HOSTS.openverse}/images/?${q({ q: text, license: o.license ?? 'cc0,pdm', page_size: o.n, aspect_ratio: { landscape: 'wide', portrait: 'tall', square: 'square' }[o.orientation] })}`)
      return (data.results ?? []).map(normOpenverse)
    },
    one: async (id) => normOpenverse(await getJson(`${HOSTS.openverse}/images/${id}/`)),
  },
  pexels: {
    async find(text, o) {
      const data = await getJson(`${HOSTS.pexels}/search?${q({ query: text, per_page: o.n, orientation: o.orientation })}`, { Authorization: key('PEXELS_API_KEY', 'pexels.com/api') })
      return (data.photos ?? []).map(normPexels)
    },
    one: async (id, o) => normPexels(await getJson(`${HOSTS.pexels}/photos/${id}`, { Authorization: key('PEXELS_API_KEY', 'pexels.com/api') }), o.size),
  },
  unsplash: {
    async find(text, o) {
      const data = await getJson(`${HOSTS.unsplash}/search/photos?${q({ query: text, per_page: Math.min(o.n, 8), orientation: o.orientation })}`, { Authorization: `Client-ID ${key('UNSPLASH_ACCESS_KEY', 'unsplash.com/developers')}`, 'Accept-Version': 'v1' })
      return (data.results ?? []).map(normUnsplash)
    },
    one: async (id) => normUnsplash(await getJson(`${HOSTS.unsplash}/photos/${id}`, { Authorization: `Client-ID ${key('UNSPLASH_ACCESS_KEY', 'unsplash.com/developers')}`, 'Accept-Version': 'v1' })),
    // The API requires a call to download_location when an image is chosen for use.
    async track(rec) {
      if (!rec._track) return
      await getJson(rec._track, { Authorization: `Client-ID ${key('UNSPLASH_ACCESS_KEY', 'unsplash.com/developers')}`, 'Accept-Version': 'v1' })
    },
  },
  iconify: {
    async find(text, o) {
      const data = await getJson(`${HOSTS.iconify}/search?${q({ query: text, limit: o.n })}`)
      return (data.icons ?? []).map((name) => {
        const [prefix] = name.split(':')
        return normIconify(name, data.collections?.[prefix])
      })
    },
    async one(name) {
      const [prefix] = name.split(':')
      const all = await getJson(`${HOSTS.iconify}/collections?${q({ prefixes: prefix })}`)
      return normIconify(name, all?.[prefix])
    },
  },
}

/* ── normalisers: one record shape, so credits.json never varies by source ── */

function normOpenverse(r) {
  const lic = [r.license, r.license_version].filter(Boolean).join(' ').toUpperCase()
  return {
    source: 'openverse', id: r.id, title: r.title || 'untitled', creator: r.creator ?? null, creator_url: r.creator_url ?? null,
    license: lic || 'unknown', license_url: r.license_url ?? null, page: r.foreign_landing_url ?? null,
    download: r.url, thumb: r.thumbnail ?? null, width: r.width ?? null, height: r.height ?? null,
    attribution: r.attribution ?? null, // Openverse writes the exact sentence the licence needs
    attributionRequired: !/^(CC0|PDM)/.test(lic),
    note: r.provider ? `via ${r.provider}` : '',
  }
}
function normPexels(r, size = 'large') {
  return {
    source: 'pexels', id: String(r.id), title: r.alt || `Pexels ${r.id}`, creator: r.photographer, creator_url: r.photographer_url,
    license: 'Pexels License', license_url: 'https://www.pexels.com/license/', page: r.url,
    download: r.src?.[size] ?? r.src?.large, thumb: r.src?.medium ?? null, width: r.width, height: r.height,
    attribution: `Photo by ${r.photographer} on Pexels`, attributionRequired: true, note: r.avg_color ? `avg ${r.avg_color}` : '',
  }
}
function normUnsplash(r) {
  const who = r.user?.name ?? 'Unknown'
  const profile = `${r.user?.links?.html ?? 'https://unsplash.com'}?${UTM}`
  return {
    source: 'unsplash', id: r.id, title: r.alt_description || r.description || `Unsplash ${r.id}`, creator: who, creator_url: profile,
    license: 'Unsplash License', license_url: 'https://unsplash.com/license', page: `${r.links?.html ?? 'https://unsplash.com'}?${UTM}`,
    download: r.urls?.regular ?? r.urls?.full, hotlink: r.urls?.regular, thumb: r.urls?.small ?? null, width: r.width, height: r.height,
    attribution: `Photo by ${who} on Unsplash`, attributionRequired: true,
    attributionHtml: `Photo by <a href="${profile}">${who}</a> on <a href="https://unsplash.com/?${UTM}">Unsplash</a>`,
    note: 'hotlink urls.regular if the page is published; download_location is pinged on get', _track: r.links?.download_location,
  }
}
function normIconify(name, set) {
  const lic = set?.license
  return {
    source: 'iconify', id: name, title: name, creator: set?.author?.name ?? null, creator_url: set?.author?.url ?? null,
    license: lic?.spdx ?? lic?.title ?? 'unknown — check the icon set', license_url: lic?.url ?? null, page: `https://icon-sets.iconify.design/${name.replace(':', '/')}/`,
    download: `${HOSTS.iconify}/${name.replace(':', '/')}.svg`, thumb: null, width: null, height: null,
    attribution: set?.author?.name ? `${name} by ${set.author.name} (${lic?.title ?? 'licence unknown'})` : null,
    attributionRequired: !/^(MIT|ISC|Apache-2\.0|CC0|0BSD|Unlicense)/i.test(lic?.spdx ?? ''), note: set?.name ?? '',
  }
}

/* ── commands ────────────────────────────────────────────────────────────── */

const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

async function main() {
  if (!cmd || cmd === 'help' || flags.help) {
    console.log(`Usage:
  assets.mjs search "<words>" [--source openverse|pexels|unsplash|iconify] [--orientation landscape|portrait|square] [--n 6] [--license cc0,pdm]
  assets.mjs get <source>:<id> --out <dir> [--name <file-stem>] [--size large]
  assets.mjs credits --dir <dir>`)
    return
  }

  if (cmd === 'search') {
    const text = pos.join(' ')
    if (!text) die('search needs words')
    const name = String(flags.source ?? 'openverse')
    const src = sources[name] ?? die(`Unknown source "${name}". Use: ${Object.keys(sources).join(', ')}`)
    const rows = await src.find(text, { n: Number(flags.n ?? 6), orientation: flags.orientation, license: flags.license })
    if (!rows.length) return console.log('no results — try fewer, plainer words')
    for (const r of rows) {
      console.log(`${r.source}:${r.id}`)
      console.log(`   ${clip(r.title, 70)} — ${r.creator ?? 'unknown creator'} · ${r.license}${r.width ? ` · ${r.width}×${r.height}` : ''}`)
      if (r.thumb) console.log(`   preview ${r.thumb}`)
    }
    console.log(`\n${rows.length} result(s). Pick by eye, then: assets.mjs get <id above> --out public/brand/<slug>/assets`)
    return
  }

  if (cmd === 'get') {
    const [spec] = pos
    const m = /^(openverse|pexels|unsplash|iconify):(.+)$/.exec(spec ?? '')
    if (!m) die('get needs <source>:<id>, e.g. openverse:3f2a… or iconify:lucide:sun')
    if (!flags.out) die('get needs --out <dir>')
    const [, name, id] = m
    const rec = await sources[name].one(id, { size: flags.size })
    if (!rec.download) die('the source returned no downloadable url')
    if (rec.attributionRequired && !rec.attribution && !/^unknown/.test(rec.license)) console.error(`warning: ${rec.license} requires attribution but the source supplied none — write one before shipping.`)
    if (/^unknown/.test(rec.license)) console.error('warning: licence unknown — do not ship until you have read the set page: ' + rec.page)

    const { buf, type } = await getBytes(rec.download)
    const out = resolve(String(flags.out))
    await mkdir(out, { recursive: true })
    const stem = String(flags.name ?? `${rec.source}-${rec.id.replace(/[^a-z0-9]+/gi, '-')}`).replace(/[^a-z0-9._-]/gi, '-')
    const file = `${stem}${extOf(rec.download, type)}`
    await writeFile(join(out, file), buf)
    await sources[name].track?.(rec)

    const credits = await readCredits(out)
    const { _track, ...clean } = rec
    credits.push({ file, ...clean, retrieved: new Date().toISOString().slice(0, 10) })
    await writeFile(join(out, 'credits.json'), `${JSON.stringify(credits.filter((c, i, a) => a.findLastIndex((x) => x.file === c.file) === i), null, 2)}\n`)

    console.log(`${join(flags.out, file)}  (${(buf.length / 1024).toFixed(0)} KB)`)
    console.log(`credit: ${rec.attribution ?? '(none supplied)'}  [${rec.license}]`)
    if (rec.source === 'unsplash') console.log('note: Unsplash asks apps to hotlink urls.regular and to credit with the utm links in credits.json (attributionHtml).')
    if (rec.source !== 'iconify') console.log('next: python3 scripts/downscale.py <file> <out> <w> <h>   # a hero rarely needs more than 1600px')
    return
  }

  if (cmd === 'credits') {
    const dir = resolve(String(flags.dir ?? die('credits needs --dir <dir>')))
    const credits = await readCredits(dir)
    const files = (await readdir(dir).catch(() => die(`no such directory: ${dir}`))).filter((f) => f !== 'credits.json' && !f.startsWith('.'))
    const known = new Set(credits.map((c) => c.file))
    const orphans = files.filter((f) => !known.has(f))
    const gone = credits.filter((c) => !files.includes(c.file)).map((c) => c.file)
    // A record is not enough: an unknown licence, or a licence that demands credit with none written,
    // is a file we cannot lawfully ship.
    const unsafe = (c) => /^unknown/.test(c.license) || (c.attributionRequired && !c.attribution)
    let failed = orphans.length
    credits.forEach((c) => {
      if (unsafe(c)) {
        failed += 1
        console.log(`FAIL ${c.file.padEnd(34)} ${c.license} — ${/^unknown/.test(c.license) ? 'read the set page and edit credits.json' : 'attribution required, none written'}`)
      } else console.log(`ok   ${c.file.padEnd(34)} ${c.license.padEnd(18)} ${c.attribution ?? ''}`)
    })
    orphans.forEach((f) => console.log(`FAIL ${f.padEnd(34)} no credits.json entry — source and licence unknown`))
    gone.forEach((f) => console.log(`warn ${f.padEnd(34)} recorded but not on disk`))
    process.exit(failed ? 1 : 0)
  }

  die(`Unknown command "${cmd}". Try: search, get, credits`)
}

async function readCredits(dir) {
  try {
    return JSON.parse(await readFile(join(dir, 'credits.json'), 'utf8'))
  } catch {
    return []
  }
}

await main()
