import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)
const out = []
const sw = p.locator('button[aria-pressed]')
for (let i = 0; i < 5; i++) {
  await sw.nth(i).click({ force: true })
  await p.waitForTimeout(350)
  out.push(await p.evaluate(() => {
    const mat = document.querySelector('[data-hero-art] div[class*="mat"]')
    const lbl = document.querySelector('[data-hero-art] p[class*="toolsLabel"]')
    return { name: lbl ? lbl.textContent : '', bg: getComputedStyle(mat).backgroundColor, img: getComputedStyle(mat).backgroundImage.slice(0, 120), labelColor: lbl && getComputedStyle(lbl).color }
  }))
}
writeFileSync('/tmp/tint.json', JSON.stringify(out, null, 2))
await b.close()
