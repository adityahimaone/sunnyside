import { chromium } from '@playwright/test'

const url = process.argv[2] ?? 'http://localhost:3111/sunnyside'
const browser = await chromium.launch()
for (const w of [1440, 1024, 768, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const data = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    }
    const cs = (sel, prop) => {
      const el = document.querySelector(sel)
      return el ? getComputedStyle(el)[prop] : null
    }
    return {
      hero: pick('#home'),
      title: pick('#hero-title'),
      titleSize: cs('#hero-title', 'fontSize'),
      titleLines: (() => {
        const el = document.querySelector('#hero-title')
        if (!el) return null
        const lh = parseFloat(getComputedStyle(el).lineHeight)
        return Math.round(el.getBoundingClientRect().height / lh)
      })(),
      art: pick('[data-hero-art]'),
      stage: pick('[data-journey="hero-art"]'),
      lede: pick('#hero-title + *'),
      scrollW: document.documentElement.scrollWidth,
      docW: document.documentElement.clientWidth,
    }
  })
  console.log(w, JSON.stringify(data))
  await page.close()
}
await browser.close()
