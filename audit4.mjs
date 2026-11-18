import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4500)
const m = await page.evaluate(() => {
  const bar = document.querySelector('[class*=bar]')?.getBoundingClientRect()
  const vp = document.querySelector('[class*=dioramaViewport]')?.getBoundingClientRect()
  const title = document.querySelector('[class*=scriptSvg]')?.getBoundingClientRect()
  return { barBottom: bar?.bottom, vpTop: vp?.top, titleTop: title?.top }
})
console.log(JSON.stringify(m))
await page.screenshot({ path: '/tmp/h-full.jpg', type: 'jpeg', quality: 84 })
await page.screenshot({ path: '/tmp/h-nav.jpg', type: 'jpeg', quality: 90, clip: { x: 300, y: 0, width: 1140, height: 200 } })
await page.screenshot({ path: '/tmp/h-orange.jpg', type: 'jpeg', quality: 90, clip: { x: 120, y: 120, width: 520, height: 420 } })
await browser.close()
console.log('ok')
