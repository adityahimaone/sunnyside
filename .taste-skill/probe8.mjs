import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
const a = await p.evaluate(() => ({
  halo: document.querySelector('[data-hero-halo]')?.getAttribute('style')?.slice(0, 90) ?? null,
  lenis: !!document.documentElement.classList.toString(),
  cls: document.documentElement.className,
  body: document.body.className.slice(0, 60),
}))
await p.mouse.wheel(0, 600)
await p.waitForTimeout(900)
const c = await p.evaluate(() => ({
  halo: document.querySelector('[data-hero-halo]')?.getAttribute('style')?.slice(0, 90) ?? null,
  header: document.querySelector('header')?.className?.slice(0, 60),
}))
console.log(a, c)
await b.close()
