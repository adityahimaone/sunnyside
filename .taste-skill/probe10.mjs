import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
p.on('console', m => logs.push(m.type() + ' ' + m.text().slice(0, 200)))
p.on('pageerror', e => logs.push('PAGEERROR ' + e.message.slice(0, 300)))
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
const info = await p.evaluate(() => ({
  scriptCount: document.querySelectorAll('script[src]').length,
  srcs: [...document.querySelectorAll('script[src]')].map(s => s.src.split('/').pop()),
  nextType: typeof window.next,
  nextfType: typeof window.__next_f,
  park: window.__park ?? null,
}))
writeFileSync('/tmp/probe.json', JSON.stringify({ info, logs }, null, 2))
await b.close()
