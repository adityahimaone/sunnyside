import { chromium } from '@playwright/test'
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(2500)
// find the generated covers
const n = await p.locator('[class*="generatedCover"]').count()
console.log('generated covers found:', n)
for (let i = 0; i < n; i++) {
  const el = p.locator('[class*="generatedCover"]').nth(i)
  await el.scrollIntoViewIfNeeded()
  await p.waitForTimeout(500)
  const box = await el.boundingBox()
  const info = await el.evaluate((node) => {
    const cs = getComputedStyle(node)
    const ghost = node.querySelector('[class*="genGhost"]')
    return {
      variant: node.dataset.variant,
      bg: cs.backgroundColor,
      color: cs.color,
      w: Math.round(node.getBoundingClientRect().width),
      h: Math.round(node.getBoundingClientRect().height),
      ghostText: ghost ? ghost.textContent : null,
      ghostFont: ghost ? getComputedStyle(ghost).fontFamily : null,
      ghostSize: ghost ? getComputedStyle(ghost).fontSize : null,
      text: node.textContent,
    }
  })
  console.log(i, JSON.stringify(info))
  await el.screenshot({ path: `docs/shots/gen-cover-${i}.png` })
}
await b.close()
