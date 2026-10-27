import { chromium } from 'playwright-core'

const BASE = 'http://localhost:3100'
const routes = ['/design-system', '/design-engineering', '/design-system/riso']
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)))
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)))

  for (const route of routes) {
    errors.length = 0
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      h: document.body.scrollHeight,
    }))
    console.log(
      `${width} ${route} ${res?.status()} h=${m.h} sw=${m.sw} cw=${m.cw} ${m.sw === m.cw ? 'no-x-scroll' : 'X-SCROLL'} errors=${errors.length ? errors.join(' | ') : 'none'}`,
    )
  }
  await ctx.close()
}

const ctx = await browser.newContext()
const page = await ctx.newPage()
const res = await page.goto(`${BASE}/design-system/riso/llms.txt`)
const body = await res.text()
console.log(
  `llms.txt ${res.status()} bytes=${body.length} idea=${body.includes('Two passes, one sheet.')} seven=${body.includes('seven ridge points')} fail=${body.includes('2.88:1')}`,
)
await ctx.close()
await browser.close()
