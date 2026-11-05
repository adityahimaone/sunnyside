// Local screenshots without a build step: serve the case folder, shoot, close.
//   node scripts/shot.mjs --url _sheet.html --out /tmp/sheet.png --w 1400 --h 900 [--full] [--scale 2]
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { chromium } from '../../node_modules/playwright-core/index.mjs'
import { CHROMIUM } from '../../scripts/chrome.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`)
  return i === -1 ? d : process.argv[i + 1]
}
const has = (n) => process.argv.includes(`--${n}`)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
}

const server = createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
    const file = join(root, path === '/' ? '/index.html' : path)
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})

await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port

const browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--force-color-profile=srgb', '--hide-scrollbars'] })
const page = await browser.newPage({
  viewport: { width: Number(arg('w', 1440)), height: Number(arg('h', 900)) },
  deviceScaleFactor: Number(arg('scale', 2)),
})
await page.goto(`http://127.0.0.1:${port}/${arg('url', 'index.html')}`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)
if (has('theme')) await page.evaluate((t) => document.documentElement.setAttribute('data-wildflower-wind', t), arg('theme', 'dark'))
await page.waitForTimeout(200)
if (arg('sel')) {
  const el = page.locator(arg('sel')).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  await el.screenshot({ path: arg('out', '/tmp/shot.png') })
} else {
  if (arg('y')) {
    await page.evaluate((y) => window.scrollTo(0, Number(y)), arg('y', '0'))
    await page.waitForTimeout(250)
  }
  await page.screenshot({ path: arg('out', '/tmp/shot.png'), fullPage: has('full') })
}

await browser.close()
server.close()
console.log('→', arg('out', '/tmp/shot.png'))
