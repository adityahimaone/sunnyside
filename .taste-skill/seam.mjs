import { chromium } from '@playwright/test'
const b = await chromium.launch()
for (const w of [1440, 1024, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)
  const r = await p.evaluate(() => {
    const home = document.querySelector('#home').getBoundingClientRect()
    const next = document.querySelector('#home').nextElementSibling
    const nb = next.getBoundingClientRect()
    const scroll = document.querySelector('#home button[class*="heroScroll"]').getBoundingClientRect()
    return {
      heroBottom: Math.round(home.bottom), nextTag: next.tagName + '.' + (next.className || '').split(' ')[0].slice(0, 20),
      nextTop: Math.round(nb.top), gap: Math.round(nb.top - home.bottom),
      scrollBottomToHero: Math.round(home.bottom - scroll.bottom),
      docH: document.documentElement.scrollHeight,
    }
  })
  console.log(w, JSON.stringify(r))
  await p.close()
}
await b.close()
