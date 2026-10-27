/**
 * Render the Hachure brand board to the 4:3 thumbnail the case library uses.
 *
 *   node scripts/render-hachure-board.mjs
 *
 * The board is authored at 1500 × 1125 and captured at 2× so the type is crisp
 * before downscaling. The plate on the board is drawn by the page's own script;
 * this only waits for fonts and the first paint.
 */
import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(ROOT, 'design/brand/hachure/brandkit.html')
const OUT = join(ROOT, 'public/brand/hachure/hachure-brandkit.png')

const CHROME = process.env.CHROME_PATH
const launch = async () => {
  try {
    return await chromium.launch(CHROME ? { executablePath: CHROME } : {})
  } catch (error) {
    const fallback = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    if (existsSync(fallback)) return chromium.launch({ executablePath: fallback })
    throw error
  }
}

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1125 }, deviceScaleFactor: 2 })
await page.goto(`file://${SOURCE}`, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(450)
await page.screenshot({ path: OUT, type: 'png' })
await browser.close()

// 3000 × 2250 → 1500 × 1125, the 4:3 crop the case cards expect.
const tmp = mkdtempSync(join(tmpdir(), 'hachure-board-'))
try {
  execFileSync('sips', ['-z', '1125', '1500', OUT, '--out', join(tmp, 'out.png')], { stdio: 'ignore' })
  execFileSync('cp', [join(tmp, 'out.png'), OUT])
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`board → ${OUT}`)
