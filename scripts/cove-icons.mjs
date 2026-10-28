#!/usr/bin/env node
/**
 * Render the Cove favicon/app-icon PNGs from the compact and primary marks.
 * The favicon uses the Ice field so it survives light and dark chrome; the app
 * icons use the Abyss field. ICO packing is done by cove-ico.py.
 */
import { chromium } from '@playwright/test'

const compact = (color) => `
  <path d="M56 6H30L6 24V40L30 58H56V44H30L22 36V28L30 20H56Z" fill="${color}"/>`

const fullReverse = `
  <path d="M56 8H28L8 24V40L28 56H56V44H28L20 36V28L28 20H56Z" fill="#E9F6FB"/>
  <path d="M40 36H56V44H40Z" fill="#7CE7FF"/>`

const icon = (id, size, body, bg) => `
  <div id="${id}" style="width:${size}px;height:${size}px;background:${bg};overflow:hidden">
    <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${body}</svg>
  </div>`

const favicon = (size) =>
  icon(
    `fav${size}`,
    size,
    `<rect width="64" height="64" fill="#7CE7FF"/>${compact('#06121C')}`,
    'transparent',
  )

const appIcon = (size) =>
  icon(
    `app${size}`,
    size,
    `<rect width="64" height="64" fill="#06121C"/>${fullReverse}`,
    'transparent',
  )

const appleIcon = () =>
  icon(
    'apple',
    180,
    `<rect width="64" height="64" fill="#06121C"/>${fullReverse}`,
    'transparent',
  )

const mark1024 = () =>
  icon(
    'mark1024',
    1024,
    `<rect width="64" height="64" fill="#06121C"/>${fullReverse}`,
    'transparent',
  )

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent}
  body{display:flex;gap:24px;align-items:flex-start;padding:24px}
  svg{display:block}
</style></head><body>
${favicon(16)}${favicon(32)}${favicon(48)}
${appIcon(192)}${appIcon(512)}
${appleIcon()}
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 700 },
  deviceScaleFactor: 1,
})
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
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
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}</style></head><body>${mark1024()}</body></html>`,
  { waitUntil: 'load' },
)
await page.locator('#mark1024').screenshot({
  path: 'public/brand/cove/mark-1024.png',
  omitBackground: true,
})

await browser.close()
console.log('cove icons rendered')
