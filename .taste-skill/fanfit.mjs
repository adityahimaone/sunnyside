import { chromium } from '@playwright/test'
const b = await chromium.launch()
for (const vw of [1440, 1024, 768, 390]) {
  const p = await b.newPage({ viewport: { width: vw, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(800)
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s)
    const fan = q('[data-hero-art] div[class*="swatchFan"]')
    const ink = q('[data-hero-art] dl[class*="inkCard"]')
    const note = q('[data-hero-art] div[class*="sheetNote"]')
    const box = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } }
    const cards = [...document.querySelectorAll('button[aria-pressed]')].map(e => {
      const b = e.getBoundingClientRect()
      const hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)
      return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), self: hit === e || e.contains(hit) }
    })
    const uni = cards.reduce((a, c) => ({ t: Math.min(a.t, c.y), b: Math.max(a.b, c.y + c.h), l: Math.min(a.l, c.x), r: Math.max(a.r, c.x + c.w) }), { t: 1e9, b: -1e9, l: 1e9, r: -1e9 })
    const ov = (A, B) => (!A || !B) ? 0 : Math.max(0, Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x)) * Math.max(0, Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y))
    return { fan: box(fan), ink: box(ink), note: box(note), cards, union: uni, ovInk: ov({ x: uni.l, y: uni.t, w: uni.r - uni.l, h: uni.b - uni.t }, box(ink)), ovNote: ov({ x: uni.l, y: uni.t, w: uni.r - uni.l, h: uni.b - uni.t }, box(note)) }
  })
  console.log(vw, JSON.stringify(r))
  await p.close()
}
await b.close()
