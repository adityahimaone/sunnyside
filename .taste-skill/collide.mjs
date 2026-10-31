import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const w of [1440, 1280, 1024, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1000)
  out[w] = await p.evaluate(() => {
    const box = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } }
    const inter = (a, c) => {
      const x = Math.max(0, Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x))
      const y = Math.max(0, Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y))
      return Math.round(x * y)
    }
    const stickers = [...document.querySelectorAll('[data-journey-from]')].map(e => ({ name: e.dataset.journeyFrom, ...box(e) }))
    const targets = {
      h1: document.querySelector('#hero-title'),
      lede: document.querySelector('#home p[class*="heroLede"]'),
      dl: document.querySelector('dl'),
      actions: document.querySelector('#home div[class*="heroActions"]'),
      fan: document.querySelector('[data-hero-art] div[class*="swatchFan"]'),
      note: document.querySelector('[data-hero-art] div[class*="sheetNote"]'),
      mat: document.querySelector('[data-hero-art] div[class*="mat"]'),
    }
    const tb = {}
    for (const [k, v] of Object.entries(targets)) if (v) tb[k] = box(v)
    const hits = []
    for (const s of stickers) for (const [k, t] of Object.entries(tb)) {
      if (k === 'mat') continue
      const a = inter(s, t)
      if (a > 40) hits.push(`${s.name}×${k}=${a}`)
    }
    const matBox = tb.mat
    const outside = stickers.filter(s => s.x < matBox.x - 40 || s.x + s.w > matBox.x + matBox.w + 40 || s.y < matBox.y - 40).map(s => s.name)
    return { stickers, targets: tb, hits, outside }
  })
  await p.close()
}
writeFileSync('/tmp/collide.json', JSON.stringify(out, null, 2))
await b.close()
