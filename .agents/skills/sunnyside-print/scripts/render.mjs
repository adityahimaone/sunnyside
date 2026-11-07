#!/usr/bin/env node
/**
 * Sunnyside print renderer — HTML or SVG to PNG, at 2× by default.
 *
 *   node scripts/render.mjs --in out/sun-club.html --out out/sun-club.png
 *   node scripts/render.mjs --in out/sleeve.svg --out out/sleeve.png --size 440
 *
 * Playwright is the only dependency, and it is not installed here: the script
 * borrows the copy in the project it runs from (this skill is a folder inside a
 * repo that already has @playwright/test). Run it from that repo.
 */
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

let chromium
try {
  ;({ chromium } = await import('@playwright/test'))
} catch {
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.error(
      'No Playwright found. Run this from a project that has @playwright/test installed\n' +
        '(the Sunnyside repo does), or `npm i -D @playwright/test` first.',
    )
    process.exit(1)
  }
}

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const input = flag('in')
const out = flag('out')
if (!input || !out) {
  console.error('Need --in <html|svg> and --out <png>.')
  process.exit(1)
}

const inputPath = resolve(input)
const outPath = resolve(out)
await access(inputPath)

const isSvg = inputPath.toLowerCase().endsWith('.svg')
const size = Number(flag('size', 0))
const width = Number(flag('width', size || 640))
const height = Number(flag('height', size || 800))
const scale = Number(flag('scale', 2))
const selector = flag('selector', '')
const transparent = args.includes('--transparent')

let url
let tempDir = ''
if (isSvg) {
  // An SVG opened directly has no page background and no margin control, so it
  // is wrapped in a page that is exactly its own size.
  tempDir = await mkdtemp(join(tmpdir(), 'sunnyside-render-'))
  const wrapper = join(tempDir, 'wrap.html')
  await writeFile(
    wrapper,
    `<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;background:transparent}
      svg{display:block;width:${width}px;height:${height}px}
    </style></head><body><img src="${pathToFileURL(inputPath).href}" width="${width}" height="${height}" alt=""></body></html>`,
  )
  url = pathToFileURL(wrapper).href
} else {
  url = pathToFileURL(inputPath).href
}

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: scale,
})
await page.goto(url, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(250)

const target = selector ? await page.$(selector) : null
if (selector && !target) {
  console.error(`No element matched ${selector}`)
  await browser.close()
  process.exit(1)
}

if (target) {
  await target.screenshot({ path: outPath, omitBackground: transparent })
} else {
  await page.screenshot({ path: outPath, omitBackground: transparent })
}

await browser.close()
if (tempDir) await rm(tempDir, { recursive: true, force: true })

console.log(`${outPath}  ·  ${width}×${height} @${scale}×`)
