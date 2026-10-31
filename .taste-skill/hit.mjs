import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(900)
const r = await p.evaluate(() => {
  const btns = [...document.querySelectorAll('button[aria-pressed]')]
  return btns.map((el, i) => {
    const b = el.getBoundingClientRect()
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2
    const hit = document.elementFromPoint(cx, cy)
    const own = hit === el || el.contains(hit)
    const cs = getComputedStyle(el)
    return { i, label: el.getAttribute('aria-label'), w: Math.round(b.width), h: Math.round(b.height), rot: cs.transform, hitSelf: own, hitLabel: hit && (hit.closest('button') || hit).className?.toString().slice(0, 40) }
  })
})
console.log(JSON.stringify(r, null, 1))
await b.close()
