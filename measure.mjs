import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4000)
const m = await page.evaluate(() => {
  const r = (s) => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, h: b.height } }
  return {
    headerBar: r('[class*=bar]'),
    viewport: r('[class*=dioramaViewport]'),
    hero: r('[class*=hero]'),
    planeTitle: r('[class*=planeTitle]'),
    titleSvg: r('[class*=scriptSvg]'),
  }
})
console.log(JSON.stringify(m, null, 1))
await browser.close()
