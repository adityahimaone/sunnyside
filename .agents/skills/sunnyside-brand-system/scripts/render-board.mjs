#!/usr/bin/env node
/**
 * Render an HTML brand board to a pixel-exact PNG.
 *
 *   node scripts/render-board.mjs --html brandkit.html --out brandkit.png \
 *     --width 2400 --height 1800 --scale 2
 *
 * Requires Playwright:
 *   npm i -D playwright && npx playwright install chromium
 *
 * The board must live at a stable size. This script does not resize, compress
 * or crop; it screenshots the element at the viewport size, at the requested
 * device scale. Downscale the result with `downscale.py` when shipping to web.
 */
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
let chromium

try {
  ;({ chromium } = await import('playwright'))
} catch {
  ;({ chromium } = await import('@playwright/test'))
}

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const html = flag('html', 'brandkit.html')
const out = flag('out', 'brandkit.png')
const width = Number(flag('width', 2400))
const height = Number(flag('height', 1800))
const scale = Number(flag('scale', 2))
const selector = flag('selector', '#board')
const transparent = args.includes('--transparent')

if (!Number.isFinite(width) || !Number.isFinite(height) || scale <= 0) {
  console.error('Width, height and scale must be positive numbers.')
  process.exit(1)
}

const htmlPath = resolve(process.cwd(), html)
const outPath = resolve(process.cwd(), out)

try {
  await access(htmlPath)
} catch {
  console.error(`HTML not found: ${htmlPath}`)
  process.exit(1)
}

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: scale,
  reducedMotion: 'reduce',
})

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)

const target = page.locator(selector)
if ((await target.count()) === 0) {
  console.error(`Selector not found: ${selector}`)
  await browser.close()
  process.exit(1)
}

await target.screenshot({ path: outPath, omitBackground: transparent })
console.log(`Rendered ${selector} → ${outPath} (${width * scale} × ${height * scale})`)
await browser.close()
