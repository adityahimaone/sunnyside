import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
const info = await p.evaluate(() => {
  const node = document.querySelector('#hero-title')
  const keys = node ? Object.keys(node).filter(k => k.startsWith('__react')) : []
  const root = document.body.firstElementChild
  const rootKeys = root ? Object.keys(root).filter(k => k.startsWith('__react')) : []
  return { titleKeys: keys, rootKeys, bodyChildren: document.body.children.length }
})
writeFileSync('/tmp/probe2.json', JSON.stringify(info, null, 2))
await b.close()
