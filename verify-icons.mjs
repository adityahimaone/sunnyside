import { chromium } from '@playwright/test'

const browser = await chromium.launch({ channel: 'chrome' })
for (const vp of [
  { name: 'mb1440', width: 1440, height: 900 },
  { name: 'mb1280', width: 1280, height: 800 },
  { name: 'laptop1512', width: 1512, height: 982 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2800)
  const m = await page.evaluate(() => {
    const bar = document.querySelector('[class*=bar]')?.getBoundingClientRect()
    const rail = document.querySelector('[class*=balustrade]')?.getBoundingClientRect()
    // The proscenium frame's cobalt: find the first row of deep-cobalt pixels
    // by scanning a vertical strip at 10% x (over the left leg).
    const vp = document.querySelector('[class*=dioramaViewport]')?.getBoundingClientRect()
    const railLeft = rail ? ((rail.left - vp.left) / vp.width) * 100 : null
    const railRight = rail ? ((vp.right - rail.right) / vp.width) * 100 : null
    const icon = document.querySelector('[class*=pillIcon] svg')
    return {
      barBottom: bar?.bottom,
      vpTop: vp?.top,
      railLeftPct: railLeft?.toFixed(2),
      railRightPct: railRight?.toFixed(2),
      pillIconSvg: icon ? { w: icon.getAttribute('width'), ariaHidden: icon.getAttribute('aria-hidden') } : null,
      headerSvgCount: document.querySelectorAll('header svg').length,
    }
  })
  console.log(vp.name, JSON.stringify(m))
  await page.screenshot({ path: `/tmp/k-${vp.name}.jpg`, type: 'jpeg', quality: 80 })
  await page.close()
}
await browser.close()
console.log('ok')
