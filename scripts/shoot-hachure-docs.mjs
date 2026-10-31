/**
 * Re-capture the screenshots the Hachure audit references.
 *
 *   npx next start -p 3100
 *   node scripts/shoot-hachure-docs.mjs
 *
 * Writes into docs/screenshots/. Override the origin with HACHURE_BASE.
 *
 * The site-wide music player is a fixed global control that is not part of this
 * case and sits on top of the footer terrain, so it is hidden before each
 * capture. Nothing else is altered.
 */
import { chromium } from 'playwright-core'

const BASE = process.env.HACHURE_BASE ?? 'http://localhost:3100'
const OUT = 'docs/screenshots'

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

const shot = async (page, sel, file, last = false, wait = 400) => {
  await page.addStyleTag({
    content: '[class*="bottom-24"][class*="fixed"]{display:none!important}',
  })
  if (sel) {
    const el = last ? page.locator(sel).last() : page.locator(sel).first()
    // Land the element 96px down the viewport, the same clearance the
    // stylesheet's scroll-margin-top gives a real anchor jump. A bare
    // scrollIntoViewIfNeeded stops at the minimum, which tucks the heading
    // under the sticky nav.
    await el.evaluate((node) => {
      const top = node.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo(0, Math.max(0, top))
    })
    await page.waitForTimeout(wait)
    await el.screenshot({ path: `${OUT}/${file}` })
  } else {
    await page.screenshot({ path: `${OUT}/${file}` })
  }
  console.log('→', file)
}

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()
await page.goto(`${BASE}/design-system/hachure`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(2800)

await shot(page, null, 'hachure-1440-hero.png')
await shot(page, '#mark', 'hachure-1440-mark.png')
// the footer demo reveals on scroll; give it its 1.4s before capturing
await shot(page, '#specimen', 'hachure-1440-specimen.png', false, 2600)
await shot(page, '#material', 'hachure-1440-study.png', false, 1600)

/* the footer field is the second exposure of the same range */
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(900)
await shot(page, 'footer', 'hachure-1440-footer.png', true)

await page.evaluate(() => window.scrollTo(0, 0))
await page.click('button[title="Range at night"]')
await page.waitForTimeout(1000)
await shot(page, null, 'hachure-1440-dark.png')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(800)
await shot(page, 'footer', 'hachure-1440-footer-dark.png', true)

const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})
const m = await mctx.newPage()
await m.goto(`${BASE}/design-system/hachure`, { waitUntil: 'networkidle' })
await m.evaluate(() => document.fonts.ready)
await m.waitForTimeout(2400)
await m.addStyleTag({
  content: '[class*="bottom-24"][class*="fixed"]{display:none!important}',
})
await m.screenshot({ path: `${OUT}/hachure-390-hero.png` })
console.log('→ hachure-390-hero.png')

await browser.close()
