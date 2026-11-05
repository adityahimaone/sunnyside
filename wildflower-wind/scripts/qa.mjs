// The browser pass: what the static gates cannot see.
//
//   node scripts/qa.mjs
//
// Serves the case folder, opens index.html at 1440 and 390, in light and dusk, and
// again with reduced motion, then reports only what failed. Writes
// docs/wildflower-wind-qa.md and docs/qa.json. Screenshots go to docs/shots/.

import { chromium } from '../../node_modules/playwright-core/index.mjs'
import { CHROMIUM } from '../../scripts/chrome.mjs'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}

const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(req.url.split('?')[0])
    const file = join(root, p === '/' ? '/index.html' : p)
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}/`

await mkdir(join(root, 'docs', 'shots'), { recursive: true })

const browser = await chromium.launch({ executablePath: CHROMIUM })
const rows = []
const add = (check, pass, detail) => rows.push({ check, pass, detail })

async function open({ width = 1440, height = 950, theme = 'light', motion = 'no-preference' } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: motion })
  const errors = []
  const failed = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('requestfailed', (r) => failed.push(r.url()))
  await page.goto(base + 'index.html', { waitUntil: 'networkidle' })
  await page.evaluate((t) => (document.documentElement.dataset.wildflowerWind = t), theme)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  return { page, errors, failed }
}

/* 1 · 1440, light */
{
  const { page, errors, failed } = await open({ width: 1440, height: 950 })
  const overflow = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: innerWidth }))
  add('No horizontal overflow at 1440', overflow.doc <= overflow.win + 1, `${overflow.doc}px of ${overflow.win}px`)
  add('No console or page errors at 1440', errors.length === 0, errors.slice(0, 3).join(' · ') || 'none')
  add('No failed requests at 1440', failed.length === 0, failed.slice(0, 3).join(' · ') || 'none')

  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))
  add('Three faces loaded from disk', new Set(fonts).size >= 3, [...new Set(fonts)].join(', '))

  const panes = await page.evaluate(() => document.querySelectorAll('.pane').length)
  add('Every section is a pane', panes >= 8, `${panes} panes`)

  const blur = await page.evaluate(() => getComputedStyle(document.querySelector('.pane')).backdropFilter)
  add('Panes carry a backdrop blur', /blur/.test(blur), blur)

  const radius = await page.evaluate(() => getComputedStyle(document.querySelector('.pane')).borderRadius)
  add('Panes are rounded', parseFloat(radius) >= 20, radius)

  const pairs = await page.evaluate(() => document.querySelectorAll('.pairTable tbody tr').length)
  add('Contrast table renders from the tokens', pairs === 15, `${pairs} pairs`)

  const failures = await page.evaluate(() => document.querySelectorAll('.pairTable tr.fail').length)
  add('The failing pairs are published', failures === 2, `${failures} rows marked`)

  const signal = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--wi-signal').trim())
  add('Signal is the token value', signal === '#8f2a90', signal)

  const scale = await page.evaluate(() => document.querySelectorAll('.scaleRow').length)
  add('Type scale renders every role', scale === 11, `${scale} rows`)

  await page.screenshot({ path: join(root, 'docs', 'shots', '1440-light.png') })
  await page.close()
}

/* 2 · 1440, dusk */
{
  const { page } = await open({ width: 1440, height: 950, theme: 'dark' })
  const haze = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--wi-haze').trim())
  add('Dusk swaps the primitives, not the names', haze === '#141019', haze)
  const chip = await page.evaluate(() => getComputedStyle(document.querySelector('.chipSwatch')).backgroundColor)
  add('Swatches keep the light-scope material in dusk', chip === 'rgb(231, 227, 238)', chip)
  await page.screenshot({ path: join(root, 'docs', 'shots', '1440-dusk.png') })
  await page.close()
}

/* 3 · 390 */
{
  const { page, errors } = await open({ width: 390, height: 844 })
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement.scrollWidth
    const win = innerWidth
    const wide = [...document.querySelectorAll('body *')]
      .filter(
        (el) =>
          el.getBoundingClientRect().right > win + 2 &&
          !el.closest('.specDisplay') &&
          getComputedStyle(el).position !== 'fixed',
      )
      .slice(0, 4)
      .map((el) => el.className || el.tagName)
    return { doc, win, wide }
  })
  add(
    'No horizontal overflow at 390',
    overflow.doc <= overflow.win + 1,
    `${overflow.doc}px of ${overflow.win}px${overflow.wide.length ? ` · ${overflow.wide.join(', ')}` : ''}`,
  )
  add('No console errors at 390', errors.length === 0, errors.slice(0, 2).join(' · ') || 'none')
  await page.screenshot({ path: join(root, 'docs', 'shots', '390-light.png') })
  await page.close()
}

/* 4 · the mark at 16px: the compact must be a different drawing, not a scaled one */
{
  const { page } = await open({ width: 400, height: 200 })
  const diff = await page.evaluate(async () => {
    const draw = async (src, px) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const c = document.createElement('canvas')
      c.width = px
      c.height = px
      const g = c.getContext('2d')
      g.drawImage(img, 0, 0, px, px)
      return g.getImageData(0, 0, px, px).data
    }
    const a = await draw('public/brand/wildflower-wind/mark.svg', 16)
    const b = await draw('public/brand/wildflower-wind/mark-compact.svg', 16)
    let n = 0
    for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i + 3] - b[i + 3]) > 24) n++
    return Math.round((n / (16 * 16)) * 100)
  })
  add('Compact at 16px is a different drawing', diff > 10, `${diff}% of pixels differ from the primary`)
  await page.close()
}

/* 5 · reduced motion */
{
  const { page } = await open({ width: 1440, height: 950, motion: 'reduce' })
  const still = await page.evaluate(() => getComputedStyle(document.querySelector('.pane')).transitionDuration)
  add('Reduced motion stills the surfaces', parseFloat(still) < 0.01, still)
  await page.screenshot({ path: join(root, 'docs', 'shots', '1440-reduced-motion.png') })
  await page.close()
}

await browser.close()
server.close()

const failedRows = rows.filter((r) => !r.pass)
const md = `# Wildflower Wind — QA

Generated by \`node scripts/qa.mjs\` against \`index.html\` on a local server.
${failedRows.length ? `\n**${failedRows.length} check(s) failed.**\n` : '\nAll checks passed.\n'}
| Check | Result | Detail |
| --- | --- | --- |
${rows.map((r) => `| ${r.check} | ${r.pass ? 'Pass' : 'Fail'} | ${r.detail} |`).join('\n')}

Screenshots: \`docs/shots/\`. Not covered here: backdrop-blur parity across GPUs, print,
and whether Instrument Serif is installed on the machine that opens the Figma file.
`
await writeFile(join(root, 'docs', 'wildflower-wind-qa.md'), md)
await writeFile(join(root, 'docs', 'qa.json'), JSON.stringify({ rows }, null, 2) + '\n')

for (const r of rows) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.check.padEnd(44)} ${r.detail}`)
process.exit(failedRows.length ? 1 : 0)
