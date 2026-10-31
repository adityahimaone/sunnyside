import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.slice(0, 500)))
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ' ' + m.text().slice(0, 500)) })
await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(4000)
const has = await p.evaluate(() => ({
  reactRoot: !!document.querySelector('[data-reactroot], #__next, body > div'),
  scripts: document.querySelectorAll('script[src]').length,
  nextData: !!window.__NEXT_DATA__,
}))
console.log(has)
console.log(errs.join('\n'))
await b.close()
