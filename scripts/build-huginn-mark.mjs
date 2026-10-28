/**
 * Huginn mark assets — one source, no hand-edited copies.
 *
 *   node scripts/build-huginn-mark.mjs
 *
 * v2.3: two solid, unstroked L-brackets face each other and form the H; the
 * bridge is a vermilion diamond keystone. No circles, no strokes, no orphan
 * parts. Charcoal #141413, keystone #E03C1F. Compact widens the channels.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BRAND = join(ROOT, 'public/brand/huginn')
const DS = join(ROOT, 'public/design-system/huginn')
const SPECIMEN = join(DS, 'specimen.html')
const LOCK = 50
const LOCK_W = 329
const WM_X = 91
const WM_SCALE = 0.25

const INK = 'var(--hug-mark-ink, #141413)'
const KEY = 'var(--hug-mark-key, #E03C1F)'

const MARK = {
  box: 64,
  left: 'M8 8H20V28H30V36H20V56H8Z',
  right: 'M56 8H44V28H34V36H44V56H56Z',
  key: 'M32 22L38 32L32 42L26 32Z',
}
const COMPACT = {
  box: 32,
  left: 'M4 4H10V13H15V19H10V28H4Z',
  right: 'M28 4H22V13H17V19H22V28H28Z',
  key: 'M16 11L19 16L16 21L13 16Z',
}

const markInner = (v, keyFill = KEY, inkFill = 'currentColor') =>
  `<path d="${v.left}" fill="${inkFill}"/><path d="${v.right}" fill="${inkFill}"/><path d="${v.key}" fill="${keyFill}"/>`

const markSVG = (v, size, keyFill = KEY) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v.box} ${v.box}" width="${size}" height="${size}" color="#141413" fill="currentColor" role="img" aria-label="Huginn">${markInner(v, keyFill)}</svg>
`
const mark = markSVG(MARK, 64)
const compact = markSVG(COMPACT, 32)
const keystone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Huginn keystone"><path d="${MARK.key}" fill="${KEY}"/></svg>`
const mono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" color="#141413" fill="currentColor" role="img" aria-label="Huginn mono"><path d="${MARK.left}"/><path d="${MARK.right}"/><path d="${MARK.key}"/></svg>`

/* The wordmark from the outlined blackletter. */
const word = readFileSync(join(BRAND, 'wordmark.svg'), 'utf8')
const wordPath = word.match(/<path[^>]*d="([^"]+)"/)[1]
const wordFill = word.match(/fill="([^"]+)"/)?.[1] ?? 'currentColor'

const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOCK_W} 50" width="${LOCK_W}" height="50" color="#141413" fill="currentColor" role="img" aria-label="Huginn">
  <g transform="scale(${LOCK / 64})">${markInner(MARK)}</g>
  <g transform="translate(${WM_X} 0) scale(${WM_SCALE})"><path d="${wordPath}" fill="${wordFill}"/></g>
</svg>
`

/* Favicons: the red field, paper brackets, an ink keystone. */
function favicon(size) {
  const v = size <= 32 ? COMPACT : MARK
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#E03C1F"/>
  <g transform="scale(${size / v.box})" color="#F4EFE5">${markInner(v, '#141413', '#F4EFE5')}</g>
</svg>
`
}

const write = (path, body) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, body)
}

write(join(BRAND, 'mark.svg'), mark)
write(join(BRAND, 'mark-compact.svg'), compact)
write(join(BRAND, 'keystone.svg'), keystone)
write(join(BRAND, 'mark-mono.svg'), mono)
write(join(BRAND, 'lockup.svg'), lockup)
write(join(BRAND, 'favicon.svg'), favicon(32))
for (const size of [16, 32, 180]) write(join(BRAND, `favicon-${size}.svg`), favicon(size))

write(join(DS, 'brand/mark.svg'), mark)
write(join(DS, 'brand/mark-compact.svg'), compact)
write(join(DS, 'brand/keystone.svg'), keystone)
write(join(DS, 'brand/mark-mono.svg'), mono)
write(join(DS, 'brand/lockup.svg'), lockup)
for (const size of [16, 32, 180]) write(join(DS, `brand/favicons/favicon-${size}.svg`), favicon(size))
write(join(DS, 'brand/favicons/favicon.svg'), favicon(32))
write(
  join(ROOT, 'app/design-system/huginn/icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" fill="#E03C1F"/><g color="#F4EFE5">${markInner(COMPACT, '#141413')}</g></svg>`,
)

/* The standalone specimen inlines symbols; keep them in sync from one source. */
let html = readFileSync(SPECIMEN, 'utf8')
const mk = `<symbol id="mk" viewBox="0 0 64 64">${markInner(MARK)}</symbol>`
const mkc = `<symbol id="mkc" viewBox="0 0 32 32">${markInner(COMPACT)}</symbol>`
const lk = `<symbol id="lk" viewBox="0 0 ${LOCK_W} 50"><g transform="scale(${LOCK / 64})">${markInner(MARK)}</g><g transform="translate(${WM_X} 0) scale(${WM_SCALE})"><path d="${wordPath}" fill="${wordFill}"/></g></symbol>`
html = html.replace(/<symbol id="mk"[\s\S]*?<\/symbol>/, mk)
html = html.replace(/<symbol id="mkc"[\s\S]*?<\/symbol>/, mkc)
html = html.replace(/<symbol id="lk"[\s\S]*?<\/symbol>/, lk)
html = html.replace(/\.art-mark \{ width: 64px; aspect-ratio: 1; \}/, '.art-mark { width: 64px; aspect-ratio: 1; }')
html = html.replace(/\.art-mark-compact \{ width: 32px; aspect-ratio: 1; \}/, '.art-mark-compact { width: 32px; aspect-ratio: 1; }')
if (!html.includes('--hug-mark-ink: #141413')) {
  const vars = `<link rel="stylesheet" href="tokens/huginn.tokens.css" />\n    <style>:root { --hug-mark-ink: #141413; --hug-mark-key: #E03C1F; } [data-theme='dark'] { --hug-mark-ink: #F4EFE5; }</style>`
  html = html.replace('<link rel="stylesheet" href="tokens/huginn.tokens.css" />', vars)
}
writeFileSync(SPECIMEN, html)

console.log('mark     64 grid, two brackets + keystone; compact 32 grid')
console.log('lockup   ' + LOCK_W + ' × 50')
console.log('favicons 16 / 32 / 180')
