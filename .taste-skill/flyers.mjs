import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)
const info = await p.evaluate(() => ({
  flyers: document.querySelectorAll('[data-flyer]').length,
  froms: ['smiley', 'burst', 'daisy', 'bolt'].map(f => !!document.querySelector(`[data-journey-from="${f}"]`)),
  docks: ['about-flower', 'about-bolt'].map(d => !!document.querySelector(`[data-journey-dock="${d}"]`)),
}))
await p.evaluate(() => window.scrollTo(0, 2200))
await p.waitForTimeout(1500)
const after = await p.evaluate(() => [...document.querySelectorAll('[data-flyer]')].map(e => ({ id: e.dataset.flyer, op: getComputedStyle(e).opacity.slice(0, 4), t: (e.style.transform || '').slice(0, 40) })))
writeFileSync('/tmp/flyers.json', JSON.stringify({ info, after }, null, 2))
await b.close()
