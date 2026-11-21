import { chromium } from '@playwright/test'

const OUT = 'docs/shots/hero'
const b = await chromium.launch({ channel: 'chrome' })
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const p = await ctx.newPage()
p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERR:', m.text().slice(0, 200)) })
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(4000)

// what's on screen first?
const boot = await p.evaluate(() => document.documentElement.dataset.boot || 'none')
console.log('boot attr:', boot)
console.log('scrollY:', await p.evaluate(() => window.scrollY))
await p.screenshot({ path: `${OUT}-00-first-view.png` })

// dismiss any gate
const gate = await p.locator('[data-landing-gate]').count()
console.log('gate count:', gate)
if (gate) {
  await p.mouse.click(720, 450)
  await p.waitForTimeout(1200)
}

await p.screenshot({ path: `${OUT}-01-closed.png` })

// pull it
const pullBtn = p.locator('button[aria-label="Pull the stage open"]')
console.log('pull button:', await pullBtn.count())
if (await pullBtn.count()) {
  await pullBtn.first().click()
  await p.waitForTimeout(1800)
}
await p.screenshot({ path: `${OUT}-02-open.png` })

// scroll a bit to see the transition
await p.mouse.wheel(0, 500)
await p.waitForTimeout(1200)
await p.screenshot({ path: `${OUT}-03-scrolled.png` })

// mobile
const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const mp = await m.newPage()
await mp.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
await mp.waitForTimeout(3500)
await mp.screenshot({ path: `${OUT}-04-mobile.png`, fullPage: false })

await b.close()
