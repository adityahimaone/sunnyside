import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
p.on('console', m => console.log('LOG', m.type(), m.text().slice(0, 300)))
p.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0, 400)))
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
console.log('park=', await p.evaluate(() => window.__park ?? 'NOT SET'))
await b.close()
