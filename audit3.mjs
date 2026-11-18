import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4500)
await page.screenshot({ path: '/tmp/g-full.jpg', type: 'jpeg', quality: 84 })
const clips = [
  ['navgap', { x: 0, y: 0, width: 1440, height: 180 }],
  ['orangeleft', { x: 100, y: 100, width: 500, height: 400 }],
  ['rail', { x: 200, y: 480, width: 1040, height: 240 }],
]
for (const [n, c] of clips) {
  await page.screenshot({ path: `/tmp/g-${n}.jpg`, type: 'jpeg', quality: 90, clip: c })
}
await browser.close()
console.log('ok')
