/**
 * Manual pass for /design-system/hachure.
 *
 *   npx next start -p 3100
 *   node scripts/verify-hachure.mjs
 *
 * Checks the route and its metadata, that the two dither fields actually drew
 * (pixels, not class names), that the night ramp repaints them, the contrast of
 * the printed margin, the draft/save/restore path in the form kit, the
 * case-library card and cover, 390px horizontal scroll, the Markdown twin and
 * the sitemap entry. This is not the Playwright e2e suite; that is skipped for
 * this case.
 */
import { chromium } from 'playwright-core'

const BASE = process.env.HACHURE_BASE ?? 'http://localhost:3100'
const browser = await chromium.launch({
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

/* ---------- the same contrast maths the brand build uses ---------- */
const chan = (c) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) =>
  0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
const contrast = (a, b) => {
  const x = lum(a)
  const y = lum(b)
  return Number(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2))
}
const rgb = (s) =>
  s
    .match(/\d+(\.\d+)?/g)
    .slice(0, 3)
    .map(Number)

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
await page.waitForTimeout(2600)
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

/* ---------- the fields: assert pixels, not class names ---------- */

/**
 * A style that silently does not apply is indistinguishable from one that was
 * never written. So each field is measured: it must be non-blank, it must be
 * paper at the top and terrain at the bottom, and it must span the viewport.
 */
const readField = (sel) =>
  page.evaluate((s) => {
    const host = document.querySelector(s)
    const c = host?.querySelector('canvas')
    if (!c) return { found: false }
    const g = c.getContext('2d')
    const d = g.getImageData(0, 0, c.width, c.height).data
    const L = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
    const row = (y) => {
      let sum = 0
      for (let x = 0; x < c.width; x++) sum += L((y * c.width + x) * 4)
      return Math.round(sum / c.width)
    }
    const tones = new Set()
    for (let i = 0; i < d.length; i += 4 * 37)
      tones.add(`${d[i]},${d[i + 1]},${d[i + 2]}`)
    return {
      found: true,
      cells: `${c.width}x${c.height}`,
      css: `${Math.round(c.getBoundingClientRect().width)}x${Math.round(c.getBoundingClientRect().height)}`,
      top: row(0),
      mid: row(c.height >> 1),
      bottom: row(c.height - 1),
      tones: tones.size,
    }
  }, sel)

const hero = await readField('[class*="heroField"]')
const foot = await readField('[class*="footerField"]')
console.log('field:hero', JSON.stringify(hero))
console.log('field:footer', JSON.stringify(foot))

const drawn = (f) => f.found && f.tones > 2 && f.top > f.bottom
const fullBleed = hero.found && hero.css.split('x')[0] === '1440'
console.log(
  'field:verdict',
  drawn(hero) && drawn(foot) && fullBleed
    ? 'ok — both drawn, full-bleed, darkening downward'
    : `FAIL hero=${JSON.stringify(hero)} footer=${JSON.stringify(foot)}`,
)

/* printed margin: measured on the composited colours, both themes */
const marginOf = () =>
  page.evaluate(() => {
    const band = document.querySelector('[class*="heroMargin"]')
    const item = band?.querySelector('[class*="marginItem"]')
    if (!band) return null
    return {
      bg: getComputedStyle(band).backgroundColor,
      fg: getComputedStyle(band).color,
      muted: item ? getComputedStyle(item).color : null,
    }
  })

const readMargin = async (label) => {
  const m = await marginOf()
  if (!m) return console.log(`margin:${label}`, 'FAIL — no band')
  const fg = contrast(rgb(m.fg), rgb(m.bg))
  const muted = m.muted ? contrast(rgb(m.muted), rgb(m.bg)) : null
  console.log(
    `margin:${label}`,
    JSON.stringify({
      bg: m.bg,
      fg,
      muted,
      pass: fg >= 4.5 && (muted === null || muted >= 4.5),
    }),
  )
}

await readMargin('ground')

/* the night ramp must repaint, not just re-tokenise */
await page.click('button[title="Range at night"]')
await page.waitForTimeout(900)
const heroNight = await readField('[class*="heroField"]')
const rampSwapped = heroNight.found && heroNight.mid < hero.mid - 40
console.log(
  'field:night',
  JSON.stringify(heroNight),
  rampSwapped ? 'ok — ramp swapped' : 'FAIL — canvas did not repaint',
)
await readMargin('night')

/* the mark: two paths, and the cap must resolve to the sheet token */
const mark = await page.evaluate(() => {
  const svg = document.querySelector('header a svg')
  const [body, cap] = svg.querySelectorAll('path')
  return {
    paths: svg.querySelectorAll('path').length,
    body: getComputedStyle(body).fill,
    cap: getComputedStyle(cap).fill,
    box: svg.getAttribute('viewBox'),
  }
})
console.log('mark', JSON.stringify(mark))

await page.click('button[title="Survey paper"]')
await page.waitForTimeout(400)

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
