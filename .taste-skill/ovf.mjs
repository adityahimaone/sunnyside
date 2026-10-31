import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const w of [320, 360, 390, 414, 480, 640, 768, 900, 1024, 1180, 1280, 1440, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(600)
  out[w] = await p.evaluate(() => {
    const de = document.documentElement
    const wide = [...document.querySelectorAll('#home *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > window.innerWidth + 1 || r.left < -1 }).map(e => `${e.tagName}.${(e.className || '').toString().split(' ')[0]}@${Math.round(e.getBoundingClientRect().left)}-${Math.round(e.getBoundingClientRect().right)}`).slice(0, 8)
    const ring = document.querySelector('#hero-title span')
    const rr = ring?.getBoundingClientRect()
    const sheet = document.querySelector('article')?.getBoundingClientRect()
    return {
      scrollW: de.scrollWidth, clientW: de.clientWidth,
      ring: rr ? { l: Math.round(rr.left), r: Math.round(rr.right), w: Math.round(rr.width) } : null,
      ringInSheet: rr && sheet ? Math.round(rr.right) <= Math.round(sheet.right) : null,
      wide,
    }
  })
  await p.close()
}
writeFileSync('/tmp/ovf.json', JSON.stringify(out, null, 2))
await b.close()
