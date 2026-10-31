import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2000)
const r = await p.evaluate(() => {
  const btns = [...document.querySelectorAll('#home button[aria-pressed]')]
  const mat = document.querySelector('#home article')?.parentElement
  const before = mat ? getComputedStyle(mat).getPropertyValue('--desk-accent') : null
  btns[1].click()
  const btn = btns[1].getBoundingClientRect()
  const top = document.elementFromPoint(btn.x + btn.width / 2, btn.y + btn.height / 2)
  return { before, cls: top?.className?.toString().slice(0, 60), tag: top?.tagName }
})
await p.waitForTimeout(300)
const after = await p.evaluate(() => getComputedStyle(document.querySelector('#home article').parentElement).getPropertyValue('--desk-accent'))
console.log(r, 'after=', after, 'park=', await p.evaluate(() => window.__park ?? 'NOT SET'))
await b.close()
