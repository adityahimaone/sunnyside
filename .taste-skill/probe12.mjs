import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const out = {}
for (const path of ['/', '/sunnyside', '/design-system']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  const logs = []
  p.on('pageerror', e => logs.push('PAGEERROR ' + e.message.slice(0, 200)))
  await p.goto('http://localhost:3111' + path, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2500)
  out[path] = await p.evaluate(() => {
    const els = [...document.querySelectorAll('*')]
    const fibers = els.filter(e => Object.keys(e).some(k => k.startsWith('__react'))).length
    return { fibers, total: els.length }
  })
  out[path].logs = logs
  await p.close()
}
writeFileSync('/tmp/probe3.json', JSON.stringify(out, null, 2))
await b.close()
