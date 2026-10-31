import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(900)
const names = await p.$$eval('button[aria-pressed]', els => els.map(e => e.getAttribute('aria-label')))
const out = []
for (let i = 0; i < names.length; i++) {
  const btn = p.locator('button[aria-pressed]').nth(i)
  const box = await btn.boundingBox()
  let res = 'ok'
  try { await btn.hover({ timeout: 2500 }); await btn.click({ timeout: 2500 }) }
  catch (e) { res = String(e).split('\n')[0].slice(0, 90) }
  await p.waitForTimeout(250)
  const active = await p.$$eval('button[aria-pressed]', els => els.findIndex(e => e.getAttribute('aria-pressed') === 'true'))
  out.push({ i, label: names[i], box: box && { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) }, res, active })
}
console.log(JSON.stringify(out, null, 1))
await b.close()
