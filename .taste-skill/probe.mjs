import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
p.on('console', m => console.log('LOG', m.type(), m.text()))
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const r = await p.evaluate(() => {
  const loupe = [...document.querySelectorAll('#home div')].find(d => d.className.includes('loupe'))
  if (!loupe) return 'no loupe'
  const cs = getComputedStyle(loupe)
  return { left: cs.left, top: cs.top, transform: cs.transform, inline: loupe.getAttribute('style'), w: loupe.getBoundingClientRect().width }
})
console.log(r)
await b.close()
