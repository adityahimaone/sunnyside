#!/usr/bin/env node
/**
 * Every palette × every ornament, on one sheet.
 *
 * Use this to choose, and to prove the set reads as one family: the margins,
 * the dot density and the label size are identical on all sixteen cards — only
 * the ground, the word and the ornament change.
 *
 *   node scripts/contact-sheet.mjs --out out/sheet.png
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSvg, PALETTES, VARIANTS, contrast } from './make-sleeve.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))

const CARD = 360
const GAP = 22
const COLS = 4
const ROWS = Math.ceil((Object.keys(PALETTES).length * VARIANTS.length) / COLS)
const PAD = 34

function build() {
  const cells = []
  let i = 0
  for (const key of Object.keys(PALETTES)) {
    for (const variant of VARIANTS) {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const x = PAD + col * (CARD + GAP)
      const y = PAD + row * (CARD / 1.6 + 46 + GAP)
      const svg = buildSvg({
        word: key.slice(0, 3).toUpperCase(),
        variant,
        palette: key,
        ratio: 1.6,
        width: CARD,
      })
      // keep the defs (clip, dot pattern, glow) and the drawing group, drop the
      // outer <svg> but re-wrap in one with the right viewBox — a bare <g> in
      // HTML is not SVG and renders as nothing at all
      const defs = (svg.match(/<defs>[\s\S]*?<\/defs>/) ?? [''])[0]
      // the card's markup ends with `</g>\n</svg>`, so anchoring on `</g>$`
      // matches nothing and every cell comes out empty — stop at the last `</g>`
      const body = (svg.match(/<g clip-path[\s\S]*<\/g>/) ?? [''])[0]
      const inner = `<svg viewBox="0 0 1000 625" width="${CARD}" height="${CARD / 1.6}">${defs}${body}</svg>`
      cells.push({ x, y, inner, key, variant, c: contrast(PALETTES[key].ink, PALETTES[key].ground) })
      i++
    }
  }

  const W = PAD * 2 + COLS * CARD + (COLS - 1) * GAP
  const H = PAD * 2 + ROWS * (CARD / 1.6 + 46) + (ROWS - 1) * GAP

  const head = buildSvg({ word: 'A', palette: 'ink', variant: 'orbit', ratio: 1.6, width: CARD })
  const fontStyle = (head.match(/<style>[\s\S]*?<\/style>/) ?? [''])[0]

  return `<!doctype html><html><head><meta charset="utf-8">${fontStyle}<style>
    html,body{margin:0;background:#101014}
    .sheet{position:relative;width:${W}px;height:${H}px;background:#101014;font-family:'Sleeve Mono',ui-monospace,monospace}
    .cell{position:absolute}
    .cap{position:absolute;left:0;top:calc(100% + 10px);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8b8b96;white-space:nowrap}
    .cap b{color:#e8e8ee;font-weight:500}
  </style></head><body><div class="sheet">
    ${cells
      .map(
        (c) => `<div class="cell" style="left:${c.x}px;top:${c.y}px;width:${CARD}px;height:${CARD / 1.6}px">
      ${c.inner}
      <span class="cap"><b>${c.key}</b> / ${c.variant} &nbsp;·&nbsp; ${c.c.toFixed(2)}:1</span>
    </div>`,
      )
      .join('\n')}
  </div></body></html>`
}

async function main() {
  const out = process.argv.includes('--out')
    ? path.resolve(process.argv[process.argv.indexOf('--out') + 1])
    : path.resolve('sleeve-sheet.png')
  fs.mkdirSync(path.dirname(out), { recursive: true })

  const html = build()
  const htmlPath = out.replace(/\.\w+$/, '.html')
  fs.writeFileSync(htmlPath, html)

  let chromium
  try {
    ;({ chromium } = await import('@playwright/test'))
  } catch {
    try {
      ;({ chromium } = await import('playwright'))
    } catch {
      console.log(`wrote ${htmlPath} — open it in a browser (no Playwright found)`)
      return
    }
  }

  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())
  const page = await browser.newPage({ deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const el = await page.$('.sheet')
  await el.screenshot({ path: out })
  await browser.close()
  console.log(`wrote ${path.basename(out)}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}

export { build as buildSheet, HERE }
