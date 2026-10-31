import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const bad = []
p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().slice(0, 120)) })
p.on('requestfailed', r => bad.push('FAILED ' + r.url().slice(0, 120) + ' ' + r.failure()?.errorText))
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
console.log(bad.length ? bad.join('\n') : 'no failed requests')
console.log('park=', await p.evaluate(() => window.__park ?? 'NOT SET'))
await b.close()
