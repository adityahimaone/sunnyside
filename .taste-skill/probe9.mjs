import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
p.on('console', m => logs.push(m.type() + ' ' + m.text().slice(0, 200)))
p.on('pageerror', e => logs.push('PAGEERROR ' + e.message.slice(0, 300)))
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
const info = await p.evaluate(() => ({
  scripts: [...document.querySelectorAll('script')].map(s => `${s.type || 'classic'}:${(s.src || 'inline').slice(-40)}`),
  next: typeof window.next,
  nextf: typeof window.__next_f,
  reactHook: !!document.querySelector('script[src*="_next"]'),
}))
console.log(info.scripts.join('\n'))
console.log('next=', info.next, 'nextf=', info.nextf)
console.log(logs.join('\n'))
await b.close()
