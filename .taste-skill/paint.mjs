import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)
const info = await p.evaluate(() => {
  const cs = s => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null }
  const mat = cs('[data-hero-art] div[class*="mat"]')
  const sheet = cs('article')
  const tape = cs('[data-hero-art] article > span')
  const note = cs('[data-hero-art] div[class*="sheetNote"]')
  const chip = cs('[data-hero-art] span[class*="inkChip"]')
  const badge = cs('[data-hero-art] span[class*="sheetBadge"]')
  const scale = cs('[data-hero-art] p[class*="matScale"]')
  const ring = cs('#hero-title span')
  return {
    matBg: mat.backgroundColor, matImg: mat.backgroundImage.slice(0, 160), matBorder: mat.borderTopWidth,
    sheetBg: sheet.backgroundColor, sheetShadow: sheet.boxShadow, sheetTransform: sheet.transform,
    tapeBg: tape.backgroundColor, tapeTransform: tape.transform,
    noteBg: note.backgroundColor, chipBg: chip.backgroundColor, badgeBg: badge.backgroundColor,
    scaleBg: scale.backgroundColor, scaleColor: scale.color, scaleSize: scale.fontSize,
    ringColor: ring.color,
    ringAfter: getComputedStyle(document.querySelector('#hero-title span'), '::after').borderTopColor,
  }
})
writeFileSync('/tmp/paint.json', JSON.stringify(info, null, 2))
await b.close()
