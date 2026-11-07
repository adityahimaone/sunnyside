#!/usr/bin/env node
/**
 * Acceptance checks for a sleeve.
 *
 * Measures the real geometry in a browser instead of eyeballing a PNG: renders
 * the card, asks the DOM for the word's bounding box in viewBox units, and
 * compares it to the calibration targets in references/recipe.md. Also proves
 * the fonts actually loaded — a missing face is the single most common reason a
 * sleeve stops looking like itself, and it fails silently.
 *
 *   node scripts/qa.mjs
 */

import { buildSvg, PALETTES, contrast } from './make-sleeve.mjs'

const TARGETS = { x0: 0.073, y0: 0.387, x1: 0.726, y1: 0.61 }
const TOL = 0.012

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`

let failures = 0
const fail = (msg) => {
  failures++
  console.log(`  ${red('✗')} ${msg}`)
}

async function main() {
  console.log('\ncontrast — ink on ground, floor 4.5:1')
  for (const [key, p] of Object.entries(PALETTES)) {
    const c = contrast(p.ink, p.ground)
    if (c < 4.5) fail(`${key.padEnd(10)} ${c.toFixed(2)}:1`)
    else console.log(`  ${green('✓')} ${key.padEnd(10)} ${c.toFixed(2)}:1`)
  }

  let chromium
  try {
    ;({ chromium } = await import('@playwright/test'))
  } catch {
    try {
      ;({ chromium } = await import('playwright'))
    } catch {
      console.log('\nno Playwright — skipped geometry and font checks')
      process.exit(failures ? 1 : 0)
    }
  }

  const svg = buildSvg({ word: 'LAB', palette: 'mint', ratio: 1.6, width: 1000, plain: true })
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })
  await page.setContent(`<!doctype html><html><body style="margin:0">${svg}</body></html>`, {
    waitUntil: 'load',
  })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)

  const r = await page.evaluate(async (spec) => {
    const svg = document.querySelector('svg')
    const vb = svg.viewBox.baseVal

    // `getBBox()` on <text> returns the em box (ascent to descent), not the ink
    // box — it reads ~0.42H tall for a word whose caps are 0.22H. So rasterise
    // the card and scan pixels, which is how the reference numbers were taken.
    const blob = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(blob)))}`
    await img.decode()

    const W = 1000
    const H = Math.round(1000 / spec.ratio)
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, W, H)
    const { data } = ctx.getImageData(0, 0, W, H)

    const [ir, ig, ib] = spec.ink
    let x0 = W, y0 = H, x1 = 0, y1 = 0
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4
        const d = Math.abs(data[i] - ir) + Math.abs(data[i + 1] - ig) + Math.abs(data[i + 2] - ib)
        // 75%-alpha ink (the petri cell stroke) blends to ~128 away from the
        // ink, so 120 caught the ornament and inflated the box; solid ink is 0
        if (d < 60) {
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
      }
    }

    await document.fonts.load('400 21px "Sleeve Mono"')
    await document.fonts.load('800 220px "Sleeve Display"')

    return {
      x0: x0 / W,
      y0: y0 / H,
      x1: x1 / W,
      y1: y1 / H,
      displayLoaded: document.fonts.check('800 220px "Sleeve Display"'),
      monoLoaded: document.fonts.check('400 21px "Sleeve Mono"'),
    }
  }, { ratio: 1.6, ink: hexToRgb(PALETTES.mint.ink) })
  await browser.close()

  console.log('\nfonts')
  console.log(`  ${r.displayLoaded ? green('✓') : red('✗')} Syne 800 loaded`)
  console.log(`  ${r.monoLoaded ? green('✓') : red('✗')} Geist Mono loaded`)
  if (!r.displayLoaded || !r.monoLoaded) failures++

  console.log('\ngeometry — 3-character word, 16:10')
  for (const k of Object.keys(TARGETS)) {
    const got = r[k]
    const want = TARGETS[k]
    const ok = Math.abs(got - want) <= TOL
    console.log(
      `  ${ok ? green('✓') : red('✗')} ${k}  ${got.toFixed(3)}  ${dim(`target ${want.toFixed(3)}`)}`,
    )
    if (!ok) failures++
  }

  console.log(
    failures === 0
      ? `\n${green('pass')} — ${Object.keys(PALETTES).length} palettes, geometry on target\n`
      : `\n${red(`${failures} failure${failures === 1 ? '' : 's'}`)}\n`,
  )
  process.exit(failures ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
