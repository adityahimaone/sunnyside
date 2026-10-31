import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const w of [1440, 1024, 768, 390, 360]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(700)
  out[w] = await p.evaluate(() => {
    const h = document.querySelector('#hero-title')
    const sheet = document.querySelector('article')
    const cs = getComputedStyle(h)
    const lh = parseFloat(cs.lineHeight)
    const hr = h.getBoundingClientRect()
    const sr = sheet.getBoundingClientRect()
    const span = h.querySelector('span')
    const sp = span.getBoundingClientRect()
    // per-line boxes of the raw text nodes only
    const r = document.createRange()
    const byTop = new Map()
    const walk = n => {
      if (n.nodeType === 3) {
        r.selectNodeContents(n)
        for (const b of r.getClientRects()) {
          if (b.width < 1) continue
          const k = Math.round(b.top)
          const v = byTop.get(k) ?? { l: 1e9, r: -1e9, txt: '' }
          v.l = Math.min(v.l, b.left); v.r = Math.max(v.r, b.right); v.txt += n.textContent.slice(0, 14)
          byTop.set(k, v)
        }
      } else for (const c of n.childNodes) walk(c)
    }
    walk(h)
    const lines = [...byTop.entries()].sort((a, b) => a[0] - b[0]).map(([t, v]) => ({ top: t, w: Math.round(v.r - v.l), l: Math.round(v.l), r: Math.round(v.r), txt: v.txt.trim() }))
    return {
      font: cs.fontSize, lh: Math.round(lh), h1h: Math.round(hr.height), linesByHeight: Math.round(hr.height / lh),
      h1: { l: Math.round(hr.left), r: Math.round(hr.right) },
      sheet: { l: Math.round(sr.left), r: Math.round(sr.right) },
      lines,
    }
  })
  await p.close()
}
writeFileSync('/tmp/lines2.json', JSON.stringify(out, null, 2))
await b.close()
