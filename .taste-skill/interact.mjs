import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)
  const mat = p.locator('[data-hero-art] [style*="--desk-accent"]').first()
  const before = await p.evaluate(() => getComputedStyle(document.querySelector('[data-hero-art]')).getPropertyValue('--desk-accent').trim())
  const swatches = p.locator('button[aria-pressed]')
  const n = await swatches.count()
  let after = before, pressed = []
  if (n) {
    await swatches.nth(4).click({ force: true })
    await p.waitForTimeout(400)
    after = await p.evaluate(() => {
      const el = document.querySelector('[data-hero-art] [style*="--desk-accent"]')
      return el ? el.style.getPropertyValue('--desk-accent').trim() : 'none'
    })
    pressed = await p.evaluate(() => [...document.querySelectorAll('button[aria-pressed="true"]')].map(e => e.getAttribute('aria-label')))
  }
  // loupe movement
  const art = await p.locator('[data-hero-art]').boundingBox()
  await p.mouse.move(art.x + art.width * 0.8, art.y + art.height * 0.7)
  await p.waitForTimeout(600)
  const loupe = await p.evaluate(() => {
    const l = document.querySelector('[data-hero-art] div[class*="loupe"]')
    if (!l) return null
    const r = l.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), txt: l.textContent }
  })
  const boxes = await p.evaluate(() => {
    const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }
    return {
      sheet: q('article'), tray: q('[data-hero-art] div[class*="tools"]'),
      fan: q('[data-hero-art] div[class*="swatchFan"]'),
      note: q('[data-hero-art] div[class*="sheetNote"]'),
      spec: q('dl'),
      scroll: q('#home button[class*="heroScroll"]'),
    }
  })
  out[w] = { before, after, n, pressed, loupe, boxes }
  await p.close()
}
writeFileSync('/tmp/interact.json', JSON.stringify(out, null, 2))
await b.close()
