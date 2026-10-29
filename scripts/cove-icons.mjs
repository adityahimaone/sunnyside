#!/usr/bin/env node
/**
 * Render the Cove favicon / app-icon PNGs from the shipped mark geometry.
 *
 * The mark is drawn on the abyss tile, not reversed: a light tile would be
 * invisible on a light browser chrome and a transparent tile would lose the
 * reading at 16px. A dark tile with the ink block survives both chromes, and
 * the lumen reading stays the one saturated pixel in the tab strip.
 *
 * The compact drawing is used at 16 and 32 — the full mark's six-unit channel
 * closes below about 24px.
 */
import { chromium } from '@playwright/test'

const ABYSS = '#060B18'
const INK = '#E9F0FF'
const LUMEN = '#3FE3C6'

const fullMark = (ink = INK, reading = LUMEN) => `
  <path d="M8 8H56V30H30V56H8Z" fill="${ink}"/>
  <path d="M36 36H50V50H36Z" fill="${reading}"/>`

const compactMark = (ink = INK) => `<path d="M8 8H56V33H33V56H8Z" fill="${ink}"/>`

const box = (id, size, body) => `
  <div id="${id}" style="width:${size}px;height:${size}px;overflow:hidden">
    <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${body}</svg>
  </div>`

/** The mark's bounding box is 48 units centred on (32, 32), so centring a
 *  scaled copy is one translate of `size/2 - 32 * scale`. */
const tile = (size, radius) => {
  const scale = (size * 0.52) / 48
  const t = size / 2 - 32 * scale
  return `
    <rect width="${size}" height="${size}" rx="${radius}" fill="${ABYSS}"/>
    <g transform="translate(${t.toFixed(2)} ${t.toFixed(2)}) scale(${scale.toFixed(4)})">
      ${fullMark()}
    </g>`
}

const favicon = (size) =>
  box(
    `fav${size}`,
    size,
    `<rect width="64" height="64" fill="${ABYSS}"/>${
      size <= 32 ? compactMark() : fullMark()
    }`,
  )

const tileIcon = (id, size, radius) => `
  <div id="${id}" style="width:${size}px;height:${size}px;overflow:hidden">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${tile(size, radius)}</svg>
  </div>`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent}
  body{display:flex;gap:24px;align-items:flex-start;padding:24px}
  svg{display:block}
</style></head><body>
${favicon(16)}${favicon(32)}${favicon(48)}
${tileIcon('app192', 192, 39)}
${tileIcon('app512', 512, 104)}
${tileIcon('apple', 180, 0)}
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1400, height: 700 },
  deviceScaleFactor: 1,
})
await page.setContent(html, { waitUntil: 'load' })
await page.waitForTimeout(200)

const shots = [
  ['#fav16', 'public/brand/cove/favicon-16.png'],
  ['#fav32', 'public/brand/cove/favicon-32.png'],
  ['#fav48', 'public/brand/cove/favicon-48.png'],
  ['#app192', 'public/brand/cove/icon-192.png'],
  ['#app512', 'public/brand/cove/icon-512.png'],
  ['#apple', 'public/brand/cove/apple-icon-180.png'],
]
for (const [selector, path] of shots) {
  await page.locator(selector).screenshot({ path, omitBackground: true })
}

await page.setViewportSize({ width: 1120, height: 1120 })
await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}</style></head><body>${tileIcon('mark1024', 1024, 208)}</body></html>`,
  { waitUntil: 'load' },
)
await page.locator('#mark1024').screenshot({
  path: 'public/brand/cove/mark-1024.png',
  omitBackground: true,
})

await browser.close()
console.log('cove icons rendered')
