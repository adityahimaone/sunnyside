#!/usr/bin/env node
/**
 * Render the Vitrine favicon/app-icon PNGs from the compact and full marks.
 * The favicon uses the Signal field so it survives light and dark chrome;
 * the app icons use the Case field. ICO packing is done by vitrine-ico.py.
 */
import { chromium } from '@playwright/test'

const compact = (color, dot = '#0B0D10') => `
  <path d="M13 13 30 47" stroke="${color}" stroke-width="15" stroke-linecap="square"/>
  <path d="M34 47 51 13" stroke="${color}" stroke-width="15" stroke-linecap="square"/>
  <circle cx="32" cy="48" r="3.6" fill="${dot}"/>`

const fullReverse = `
  <defs>
    <pattern id="d" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="2" height="2" fill="#F2F6F8"/>
      <rect x="2" y="2" width="2" height="2" fill="#F2F6F8"/>
    </pattern>
  </defs>
  <path d="M16 14 32 49" stroke="#F2F6F8" stroke-width="13" stroke-linecap="square"/>
  <path d="M32 49 48 14" stroke="url(#d)" stroke-width="13" stroke-linecap="square"/>
  <circle cx="32" cy="49" r="3.2" fill="#D9FF43"/>`

const icon = (id, size, body, bg) => `
  <div id="${id}" style="width:${size}px;height:${size}px;background:${bg};overflow:hidden">
    <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${body}</svg>
  </div>`

const favicon = (size) =>
  icon(
    `fav${size}`,
    size,
    `<rect width="64" height="64" rx="14" fill="#D9FF43"/>${compact('#0B0D10')}`,
    'transparent',
  )

const appIcon = (size) =>
  icon(
    `app${size}`,
    size,
    `<rect width="64" height="64" fill="#0B0D10"/>${compact('#F2F6F8', '#D9FF43')}`,
    'transparent',
  )

const appleIcon = () =>
  icon(
    'apple',
    180,
    `<rect width="64" height="64" fill="#0B0D10"/>${compact('#F2F6F8', '#D9FF43')}`,
    'transparent',
  )

const mark1024 = () =>
  icon(
    'mark1024',
    1024,
    `<rect width="64" height="64" fill="#0B0D10"/>${fullReverse}`,
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
  ['#fav16', 'public/brand/vitrine/favicon-16.png'],
  ['#fav32', 'public/brand/vitrine/favicon-32.png'],
  ['#fav48', 'public/brand/vitrine/favicon-48.png'],
  ['#app192', 'public/brand/vitrine/icon-192.png'],
  ['#app512', 'public/brand/vitrine/icon-512.png'],
  ['#apple', 'public/brand/vitrine/apple-icon-180.png'],
]
for (const [selector, path] of shots) {
  await page.locator(selector).screenshot({ path, omitBackground: true })
}

// Large tiles need their own page so the viewport can hold them at 1x.
await page.setViewportSize({ width: 1120, height: 1120 })
await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}</style></head><body>${mark1024()}</body></html>`,
  { waitUntil: 'load' },
)
await page.locator('#mark1024').screenshot({ path: 'public/brand/vitrine/mark-1024.png', omitBackground: true })

await browser.close()
console.log('icons rendered')
