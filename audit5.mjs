import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 780 } })
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(3000)
const clips = [
  ['railL', { x: 60, y: 420, width: 320, height: 180 }],
  ['railR', { x: 1150, y: 420, width: 290, height: 180 }],
  ['sun', { x: 900, y: 60, width: 540, height: 420 }],
  ['swag', { x: 700, y: 40, width: 740, height: 260 }],
]
for (const [n, c] of clips) {
  await page.screenshot({ path: `/tmp/g2-${n}.jpg`, type: 'jpeg', quality: 92, clip: c })
}
await browser.close()
console.log('ok')
