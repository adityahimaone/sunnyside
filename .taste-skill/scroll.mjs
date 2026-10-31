import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.slice(0, 300)))
p.on('console', m => { if (m.type() === 'error' && !m.text().includes('hmr')) errs.push(m.text().slice(0, 200)) })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const snaps = []
for (const y of [0, 300, 900, 1600, 2400]) {
  await p.evaluate(v => window.scrollTo(0, v), y)
  await p.waitForTimeout(700)
  snaps.push(await p.evaluate(() => {
    const g = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height), t: (e.style.transform || '').slice(0, 60) } }
    return {
      y: Math.round(window.scrollY),
      halo: g('[data-hero-halo]'), dots: g('[data-hero-dots]'), art: g('[data-hero-art]'), stage: g('[data-journey="hero-art"]'),
      smiley: g('[data-journey-from="smiley"]'),
      flyers: document.querySelectorAll('[data-journey-flyer]').length,
    }
  }))
}
writeFileSync('/tmp/scroll.json', JSON.stringify({ snaps, errs }, null, 2))
await b.close()
