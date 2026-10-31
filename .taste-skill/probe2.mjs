import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
console.log(await p.evaluate(() => window.__park ?? 'NOT SET'))
await b.close()
