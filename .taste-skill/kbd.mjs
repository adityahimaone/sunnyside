import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(800)
// tab until we reach the first swatch
let found = null
for (let i = 0; i < 25; i++) {
  await p.keyboard.press('Tab')
  found = await p.evaluate(() => {
    const a = document.activeElement
    if (!a) return null
    return { tag: a.tagName, label: a.getAttribute('aria-label') || a.textContent?.trim().slice(0, 30), pressed: a.getAttribute('aria-pressed') }
  })
  if (found && found.pressed !== null) break
}
const seq = [found]
for (let i = 0; i < 4; i++) {
  await p.keyboard.press('Tab')
  seq.push(await p.evaluate(() => { const a = document.activeElement; return { label: a.getAttribute('aria-label') || a.textContent?.trim().slice(0, 30), pressed: a.getAttribute('aria-pressed') } }))
}
await p.keyboard.press('Enter')
await p.waitForTimeout(400)
const active = await p.evaluate(() => [...document.querySelectorAll('button[aria-pressed="true"]')].map(e => e.getAttribute('aria-label')))
const ring = await p.evaluate(() => {
  const e = document.activeElement
  const cs = getComputedStyle(e)
  return { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, shadow: cs.boxShadow.slice(0, 40) }
})
console.log(JSON.stringify({ seq, active, ring }, null, 1))
await b.close()
