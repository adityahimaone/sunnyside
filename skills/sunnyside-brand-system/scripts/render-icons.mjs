#!/usr/bin/env node
/**
 * Render one SVG mark at exact pixel sizes, transparent.
 *
 *   node scripts/render-icons.mjs --svg mark.svg --out-dir public/brand \
 *     --sizes 16,32,48,192,512
 *
 * Then build the ICO and the opaque app icons with favicons.py.
 * Requires Playwright.
 */
import { mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
let chromium

try {
  ;({ chromium } = await import('playwright'))
} catch {
  ;({ chromium } = await import('@playwright/test'))
}

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const svgPath = resolve(process.cwd(), flag('svg', 'mark.svg'))
const outDir = resolve(process.cwd(), flag('out-dir', 'icons'))
const sizes = flag('sizes', '16,32,48,192,512')
  .split(',')
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value > 0)

const svg = await readFile(svgPath, 'utf8')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ reducedMotion: 'reduce' })

for (const size of sizes) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<!doctype html><style>
      html,body{margin:0;width:100%;height:100%;background:transparent}
      svg{display:block;width:100%;height:100%}
    </style>${svg}`,
  )
  await page.screenshot({
    path: resolve(outDir, `icon-${size}.png`),
    omitBackground: true,
  })
  console.log(`icon-${size}.png`)
}

await browser.close()
