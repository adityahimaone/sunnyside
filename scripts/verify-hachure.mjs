/**
 * Manual pass for /design-system/hachure.
 *
 *   npx next start -p 3100
 *   node scripts/verify-hachure.mjs
 *
 * Checks the route and its metadata, the draft/save/restore path in the form
 * kit, the case-library card and cover, 390px horizontal scroll, the Markdown
 * twin and the sitemap entry. This is not the Playwright e2e suite; that is
 * skipped for this case.
 */
import { chromium } from 'playwright-core'

const BASE = 'http://localhost:3100'
const browser = await chromium.launch({
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
})
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))
page.on(
  'console',
  (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)),
)

const res = await page.goto(`${BASE}/design-system/hachure`, {
  waitUntil: 'networkidle',
  timeout: 90000,
})
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(2000)
const meta = await page.evaluate(() => ({
  title: document.title,
  canonical: document
    .querySelector('link[rel="canonical"]')
    ?.getAttribute('href'),
  og: document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute('content'),
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
  h: document.body.scrollHeight,
  h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
  h2s: [...document.querySelectorAll('h2')].length,
  imgs: [...document.images].filter((i) => i.offsetParent !== null).length,
  schemes: [...document.querySelectorAll('section[id]')]
    .map((s) => s.id)
    .join(','),
}))
console.log('page', res.status(), JSON.stringify(meta))

// draft: fill, save, reload, restore
await page.locator('#parts').scrollIntoViewIfNeeded()
await page.fill('#hx-station', 'Test Ridge')
await page.fill('#hx-email', 'draft@survey.example')
await page.fill('#hx-height', '1990')
await page.getByRole('button', { name: 'Save as draft' }).click()
await page.waitForTimeout(200)
const saved = await page.locator('[role="status"]').first().textContent()
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const restored = await page.evaluate(() => ({
  station: document.querySelector('#hx-station')?.value,
  height: document.querySelector('#hx-height')?.value,
}))
await page.locator('#parts').scrollIntoViewIfNeeded()
await page.getByRole('button', { name: 'File the report' }).click()
await page.waitForTimeout(400)
const filed = await page.locator('[role="status"]').first().textContent()
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.locator('#parts').scrollIntoViewIfNeeded()
const cleared = await page.evaluate(
  () => document.querySelector('#hx-station')?.value,
)
console.log(
  'draft',
  JSON.stringify({
    saved: saved?.trim(),
    restored,
    filed: filed?.trim().slice(0, 60),
    cleared,
  }),
)

// case library card + cover
await page.goto(`${BASE}/design-system`, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const card = await page.evaluate(async () => {
  const link = document.querySelector('a[href="/design-system/hachure"]')
  if (!link) return { found: false }
  const img = link.querySelector('img')
  return {
    found: true,
    heading: link.querySelector('h2,h3')?.textContent?.trim(),
    cover: img?.getAttribute('src'),
    loaded: img ? img.complete && img.naturalWidth > 0 : false,
  }
})
const lib = await page.evaluate(() =>
  document.querySelector('h1')?.textContent?.trim(),
)
console.log('library', JSON.stringify({ lib, card }))

// 390
await ctx.close()
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mpage = await mctx.newPage()
const merrors = []
mpage.on('pageerror', (e) => merrors.push(String(e).slice(0, 200)))
await mpage.goto(`${BASE}/design-system/hachure`, {
  waitUntil: 'networkidle',
  timeout: 90000,
})
await mpage.waitForTimeout(1200)
const mobile = await mpage.evaluate(() => ({
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
}))
console.log(
  'mobile',
  JSON.stringify(mobile),
  'errors',
  errors.concat(merrors).join(' | ') || 'none',
)

// twins and sitemap
for (const path of ['/design-system/hachure/llms.txt', '/sitemap.xml']) {
  const r = await mpage.goto(BASE + path)
  const body = await r.text()
  console.log(
    path,
    r.status(),
    body.length,
    path.includes('sitemap')
      ? body.includes('/design-system/hachure')
      : body.includes('4.82:1'),
  )
}

await browser.close()
