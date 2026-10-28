#!/usr/bin/env node
/**
 * Draw an identity cast: 4–6 supporting marks in one cut line and one flat fill.
 * The cast is punctuation, not a second logo set. It is optional.
 *
 *   node scripts/cast-forge.mjs --config brand.json --out public/brand/<slug>
 *   node scripts/cast-forge.mjs --config brand.json --list
 *   node scripts/cast-forge.mjs --init > cast.json
 *
 * The config can be the same brand.json used by brand-forge. Add a `cast`
 * array of ids or objects:
 *
 *   "cast": ["spark", "arc", "burst", "eye", "drop", "bolt"]
 *   "cast": [{ "id": "sun", "name": "Sun", "note": "Warmth, a welcome" }]
 *
 * Output: <out>/cast/<id>.svg, <out>/cast.html, <out>/cast.json.
 * Exit code 1 if a shape is unknown or an SVG fails its basic checks.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const has = (name) => args.includes(`--${name}`)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const fail = (message) => {
  console.error(`cast-forge: ${message}`)
  process.exit(1)
}
const round = (n) => Math.round(n * 10) / 10
const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const DEFAULTS = {
  spark: ['Spark', 'A small celebration'],
  arc: ['Arc', 'A welcome'],
  burst: ['Burst', 'A loud note, never a headline'],
  eye: ['Eye', 'Attention, used once'],
  drop: ['Drop', 'A material detail'],
  bolt: ['Bolt', 'A little energy'],
  sun: ['Sun', 'Warmth, a welcome'],
  smiley: ['Smiley', 'A friendly aside'],
  daisy: ['Daisy', 'A small celebration'],
  heart: ['Heart', 'For the things worth keeping'],
  leaf: ['Leaf', 'A material detail'],
  star: ['Star', 'A good mark, used sparingly'],
  wave: ['Wave', 'A signal, a transition'],
}

const shapeNames = Object.keys(DEFAULTS)

const starter = {
  name: 'Your brand',
  slug: 'your-brand',
  palette: {
    paper: '#f4f1ea',
    paperHi: '#fffdf8',
    ink: '#141413',
    field: '#3d53d6',
    core: '#3d53d6',
    spark: '#ff6a2b',
    muted: '#62636b',
    danger: '#a31810',
    success: '#2c5b45',
  },
  cast: ['spark', 'arc', 'burst', 'eye', 'drop', 'bolt'],
}

if (has('list')) {
  console.log(shapeNames.join('\n'))
  process.exit(0)
}
if (has('init')) {
  console.log(JSON.stringify(starter, null, 2))
  process.exit(0)
}

const configPath = flag('config')
if (!configPath) fail('--config <brand.json> is required (try --init)')

const cfg = JSON.parse(
  await readFile(resolve(process.cwd(), configPath), 'utf8'),
)
const palette = { ...starter.palette, ...cfg.palette }
for (const [key, value] of Object.entries(palette)) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    fail(`palette.${key} must be #rrggbb, got ${value}`)
  }
}

const rawCast = cfg.cast ?? starter.cast
const cast = rawCast.map((item) => {
  const value = typeof item === 'string' ? { id: item } : item
  const id = String(value.id ?? '').toLowerCase()
  if (!DEFAULTS[id])
    fail(`unknown cast shape "${id}". Use: ${shapeNames.join(', ')}`)
  const [defaultName, defaultNote] = DEFAULTS[id]
  return {
    id,
    name: value.name ?? defaultName,
    note: value.note ?? defaultNote,
    fill: value.fill ?? 'core',
  }
})

if (cast.length < 4 || cast.length > 6) {
  console.warn(
    `cast-forge: ${cast.length} marks; the bar is 4–6. More is a clip-art folder.`,
  )
}
const fills = new Set(cast.map((item) => item.fill))
if (fills.has('core') && fills.has('spark')) {
  console.warn('cast-forge: two accent fills (core + spark); use one accent.')
}
for (const item of cast) {
  if (!['core', 'spark', 'ink', 'paper'].includes(item.fill)) {
    fail(`cast "${item.id}" fill must be core, spark, ink or paper`)
  }
}

const color = (role, item) => {
  if (role === 'fill') return palette[item.fill]
  if (role === 'ink') return palette.ink
  if (role === 'paper') return palette.paperHi
  return palette[role]
}

const shapes = {
  spark: (f, k) =>
    `<path d="M32 6L38 26L58 32L38 38L32 58L26 38L6 32L26 26Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  arc: (f, k) =>
    `<path d="M6 50A26 26 0 0 1 58 50V58H6Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  burst: (f, k) =>
    `<path d="M32 4L38 24L58 18L44 32L58 46L38 40L32 60L26 40L6 46L20 32L6 18L26 24Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  eye: (f, k) =>
    `<path d="M4 32Q32 8 60 32Q32 56 4 32Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/><circle cx="32" cy="32" r="8" fill="${k}"/>`,
  drop: (f, k) =>
    `<path d="M32 4C32 4 54 28 54 40A22 22 0 0 1 10 40C10 28 32 4 32 4Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  bolt: (f, k) =>
    `<path d="M36 4L12 36H30L26 60L52 26H34Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  sun: (f, k) => {
    let rays = ''
    for (let i = 0; i < 8; i += 1) {
      const a = (i * 45 * Math.PI) / 180
      rays += `<line x1="${round(32 + Math.cos(a) * 22)}" y1="${round(32 + Math.sin(a) * 22)}" x2="${round(32 + Math.cos(a) * 31)}" y2="${round(32 + Math.sin(a) * 31)}" stroke="${k}" stroke-width="3.2" stroke-linecap="round"/>`
    }
    return `<circle cx="32" cy="32" r="13" fill="${f}" stroke="${k}" stroke-width="3.2"/>${rays}`
  },
  smiley: (f, k) =>
    `<circle cx="32" cy="32" r="24" fill="${f}" stroke="${k}" stroke-width="3.2"/><rect x="24" y="25" width="3" height="7" rx="1.5" fill="${k}"/><rect x="37" y="25" width="3" height="7" rx="1.5" fill="${k}"/><path d="M23 37Q32 45 41 37" fill="none" stroke="${k}" stroke-width="3.2" stroke-linecap="round"/>`,
  daisy: (f, k) => {
    let petals = ''
    for (let i = 0; i < 8; i += 1) {
      const a = (i * 45 * Math.PI) / 180
      const x = round(32 + Math.cos(a) * 14)
      const y = round(32 + Math.sin(a) * 14)
      petals += `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" transform="rotate(${i * 45} ${x} ${y})" fill="${f}" stroke="${k}" stroke-width="3.2"/>`
    }
    return `${petals}<circle cx="32" cy="32" r="7" fill="${k}"/>`
  },
  heart: (f, k) =>
    `<path d="M32 56C14 44 6 34 6 22A14 14 0 0 1 32 14A14 14 0 0 1 58 22C58 34 50 44 32 56Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  leaf: (f, k) =>
    `<path d="M10 54C10 28 28 10 54 10C54 36 36 54 10 54Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/><path d="M18 46C28 36 36 28 46 18" fill="none" stroke="${k}" stroke-width="3.2" stroke-linecap="round"/>`,
  star: (f, k) =>
    `<path d="M32 4L38.5 24.5L60 24.5L42.5 37.5L49 58L32 45L15 58L21.5 37.5L4 24.5L25.5 24.5Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
  wave: (f, k) =>
    `<path d="M4 38C12 26 20 26 28 38C36 50 44 50 52 38L58 44C48 58 38 58 28 44C20 34 12 34 4 44Z" fill="${f}" stroke="${k}" stroke-width="3.2" stroke-linejoin="round"/>`,
}

const out = resolve(
  process.cwd(),
  flag('out', join('public', 'brand', cfg.slug ?? 'cast-out')),
)
const castDir = join(out, 'cast')
await mkdir(castDir, { recursive: true })

const files = []
for (const item of cast) {
  const fill = color('fill', item)
  const ink = color('ink')
  const body = shapes[item.id](fill, ink)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${esc(item.name)}">${body}</svg>\n`
  if (/<text[\s>]/.test(svg)) fail(`cast/${item.id}.svg contains live <text>`)
  if (!/viewBox="0 0 64 64"/.test(svg))
    fail(`cast/${item.id}.svg has no 64 viewBox`)
  await writeFile(join(castDir, `${item.id}.svg`), svg)
  files.push({ ...item, file: `cast/${item.id}.svg`, svg })
}

const tile = (item) => `<article class="tile">
  <div class="art" aria-hidden="true">${item.svg}</div>
  <div><b>${esc(item.name)}</b><span>${esc(item.note)}</span></div>
</article>`

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(cfg.name ?? 'Brand')} — identity cast</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: clamp(20px, 5vw, 56px);
        background: ${palette.paper};
        color: ${palette.ink};
        font: 14px/1.5 ui-sans-serif, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      main { max-width: 1100px; margin: 0 auto; }
      .kicker {
        display: flex;
        gap: 10px;
        margin: 0 0 12px;
        color: ${palette.muted};
        font: 500 10px/1.3 ui-monospace, monospace;
        letter-spacing: .16em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 18ch;
        margin: 0 0 10px;
        font-size: clamp(2rem, 5vw, 3.6rem);
        font-weight: 700;
        letter-spacing: -.055em;
        line-height: .95;
        text-wrap: balance;
      }
      .lede {
        max-width: 70ch;
        margin: 0 0 24px;
        color: ${palette.muted};
        font-size: 15px;
        line-height: 1.6;
        text-wrap: pretty;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 12px;
      }
      .tile {
        display: flex;
        min-height: 180px;
        flex-direction: column;
        justify-content: space-between;
        gap: 14px;
        padding: 16px;
        border: 1.5px solid ${palette.ink};
        border-radius: 14px;
        background: ${palette.paperHi};
        box-shadow: 6px 7px 0 rgb(0 0 0 / .14);
      }
      .art svg { display: block; width: 64px; height: 64px; }
      b { display: block; font-size: 18px; letter-spacing: -.02em; }
      span { display: block; margin-top: 3px; color: ${palette.muted}; font-size: 12px; line-height: 1.4; }
      .rule {
        max-width: 58ch;
        margin: 24px 0 0;
        padding-top: 14px;
        border-top: 1px solid ${palette.muted}44;
        color: ${palette.muted};
        font-size: 13px;
        line-height: 1.55;
      }
      .rule b { display: inline; font: 600 10px/1.5 ui-monospace, monospace; letter-spacing: .1em; text-transform: uppercase; }
      @media (max-width: 520px) { .grid { grid-template-columns: 1fr 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <p class="kicker"><span>Cast</span><span>one cut line · one fill</span></p>
      <h1>The small marks are punctuation.</h1>
      <p class="lede">Four to six marks, each with one job. The cast shares the primary's cut line and flat fill; it is never structure, never the only place a fact lives, and never a second logo set.</p>
      <div class="grid">${files.map(tile).join('\n')}</div>
      <p class="rule"><b>Rule</b> Use the cast to welcome, celebrate, point or keep. Four to six per composition. If a mark has no one-line job, delete it.</p>
    </main>
  </body>
</html>
`

await writeFile(join(out, 'cast.html'), html)
await writeFile(
  join(out, 'cast.json'),
  `${JSON.stringify(
    {
      name: cfg.name,
      slug: cfg.slug,
      palette,
      cast: files.map((item) => ({
        id: item.id,
        name: item.name,
        note: item.note,
        fill: item.fill,
        file: item.file,
      })),
    },
    null,
    2,
  )}\n`,
)

console.log(`cast-forge: ${cast.length} marks → ${out}/cast.html`)
console.log(`shapes: ${cast.map((item) => item.id).join(', ')}`)
