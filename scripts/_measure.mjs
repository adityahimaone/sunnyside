import { chromium } from 'playwright-core'
import { CHROMIUM } from './chrome.mjs'
import { readFileSync } from 'node:fs'

const file = process.argv[2]
const b64 = readFileSync(file).toString('base64')
const browser = await chromium.launch({ executablePath: CHROMIUM })
const page = await browser.newPage()
const res = await page.evaluate(async (b64) => {
  const img = new Image()
  img.src = 'data:image/png;base64,' + b64
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.naturalWidth; c.height = img.naturalHeight
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, c.width, c.height).data
  const W = c.width, H = c.height
  const ink = (x, y) => { const i = (y * W + x) * 4; return d[i+3] > 128 && (d[i] + d[i+1] + d[i+2]) / 3 < 128 }
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ink(x, y)) { if (x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y }
  // row spans
  const rows = []
  for (let y = 0; y < H; y += Math.max(1, Math.round(H/40))) {
    let mn = 1e9, mx = -1
    for (let x = 0; x < W; x++) if (ink(x, y)) { if (x<mn)mn=x; if(x>mx)mx=x }
    if (mx >= 0) rows.push([y, mn, mx])
  }
  // column spans
  const cols = []
  for (let x = 0; x < W; x += Math.max(1, Math.round(W/40))) {
    let mn = 1e9, mx = -1
    for (let y = 0; y < H; y++) if (ink(x, y)) { if (y<mn)mn=y; if(y>mx)mx=y }
    if (mx >= 0) cols.push([x, mn, mx])
  }
  // stroke width at top stem: scan row y0+5
  let sw = 0, sx0 = 1e9, sx1 = -1
  for (let x = 0; x < W; x++) if (ink(x, y0 + 4)) { sw++; if (x<sx0)sx0=x; if(x>sx1)sx1=x }
  // horizontal arm thickness at left: scan col x0+5
  let ah = 0, ay0 = 1e9, ay1 = -1
  for (let y = 0; y < H; y++) if (ink(x0 + 4, y)) { ah++; if (y<ay0)ay0=y; if(y>ay1)ay1=y }
  return { W, H, bbox: [x0, y0, x1, y1], rows, cols, stem: { w: sw, x0: sx0, x1: sx1 }, arm: { h: ah, y0: ay0, y1: ay1 } }
}, b64)
console.log(JSON.stringify(res, null, 1))
await browser.close()
