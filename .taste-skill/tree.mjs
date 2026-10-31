import { chromium } from '@playwright/test'

const url = process.argv[2] ?? 'http://localhost:3111/'
const w = Number(process.argv[3] ?? 1440)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: w, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const out = await page.evaluate(() => {
  const rows = []
  const walk = (el, depth) => {
    const r = el.getBoundingClientRect()
    const cls = (el.className || '').toString().split(' ').filter(c => c.includes('__')).map(c => c.split('__')[1]).join(' ')
    if (depth < 5 && r.height > 0) {
      rows.push(
        `${'  '.repeat(depth)}${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
      )
    }
    if (depth < 4) for (const c of el.children) walk(c, depth + 1)
  }
  const mat = document.querySelector('#home [data-journey="hero-art"]')
  if (mat) walk(mat, 0)
  return rows.join('\n')
})
console.log(out)
await browser.close()
