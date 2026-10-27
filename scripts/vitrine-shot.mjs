#!/usr/bin/env node
/**
 * Screenshot a local HTML file or route for Vitrine brand QA.
 * Usage: node scripts/vitrine-shot.mjs <url> <out> [width] [height]
 */
import { chromium } from '@playwright/test'

const [, , url, out, width = '1200', height = '900'] = process.argv
if (!url || !out) {
  console.error('usage: node scripts/vitrine-shot.mjs <url> <out> [width] [height]')
  process.exit(1)
}
const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
})
await page.goto(url, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log(`Rendered ${url} → ${out}`)
