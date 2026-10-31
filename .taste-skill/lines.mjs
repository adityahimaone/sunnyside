import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const w of [1600, 1440, 1366, 1280, 1180, 1100, 1024, 900, 768, 640, 480, 390, 360]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(700)
  out[w] = await p.evaluate(() => {
    const h = document.querySelector('#hero-title')
    const sheet = document.querySelector('article')
    const r = document.createRange()
    const rects = []
    const walk = (n) => {
      if (n.nodeType === 3) { r.selectNodeContents(n); for (const b of r.getClientRects()) if (b.width > 1) rects.push(b) }
      else for (const c of n.childNodes) walk(c)
    }
    walk(h)
    const lines = new Map()
    for (const b of rects) { const k = Math.round(b.top); const v = lines.get(k) ?? { l: Infinity, r: -Infinity }; v.l = Math.min(v.l, b.left); v.r = Math.max(v.r, b.right); lines.set(k, v) }
    const widths = [...lines.values()].map(v => Math.round(v.r - v.l))
    const sr = sheet.getBoundingClientRect()
    return {
      font: getComputedStyle(h).fontSize,
      lines: widths,
      sheetInner: Math.round(sr.width - 2 * parseFloat(getComputedStyle(sheet).paddingLeft) - 4),
      overflow: Math.round(Math.max(...widths) - (sr.width - 2 * parseFloat(getComputedStyle(sheet).paddingLeft) - 4)),
    }
  })
  await p.close()
}
writeFileSync('/tmp/lines.json', JSON.stringify(out, null, 2))
await b.close()
