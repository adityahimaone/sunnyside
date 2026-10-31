import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const w of [1440, 1024, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)
  out[w] = await p.evaluate(() => {
    const fan = document.querySelector('[data-hero-art] div[class*="swatchFan"]')
    const fr = fan.getBoundingClientRect()
    const cards = [...fan.querySelectorAll('button')].map(e => { const r = e.getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) } })
    const mat = document.querySelector('[data-hero-art] div[class*="mat"]').getBoundingClientRect()
    const over = cards.filter(c => c.l < mat.left + 2 || c.r > mat.right - 2 || c.b > mat.bottom - 2 || c.t < mat.top + 2)
    return { fan: { l: Math.round(fr.left), r: Math.round(fr.right), t: Math.round(fr.top), b: Math.round(fr.bottom) }, cards, mat: { l: Math.round(mat.left), r: Math.round(mat.right), b: Math.round(mat.bottom) }, over: over.length }
  })
  await p.close()
}
writeFileSync('/tmp/fan.json', JSON.stringify(out, null, 2))
await b.close()
