import { chromium } from '@playwright/test'

const url = process.argv[2] ?? 'http://localhost:3111/sunnyside'
const out = process.argv[3] ?? '.taste-skill/out'
const widths = [1440, 768, 390]

const browser = await chromium.launch()
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/hero-${w}.png` })
  await page.close()
}
await browser.close()
console.log('ok', out)
