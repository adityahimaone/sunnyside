#!/usr/bin/env node
/**
 * Re-shoot the "In context" plates on the Ledger case page.
 *
 *   node scripts/shot-ledger-plate.mjs [baseUrl]
 *
 * The case page shows a full-page capture of the live dashboard, swapped by the
 * `dark` class with no JS. That capture goes stale the moment a token, the rail
 * or the KPI row changes — and a stale plate is a lie printed at 1524 × 1800.
 *
 * Run against a production build (`next build && next start -p 3100`). The
 * theme is set through localStorage because next-themes ignores the emulated
 * colour scheme; the page is reloaded after the write.
 */

import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const base = process.argv[2] ?? 'http://localhost:3100'
const target = `${base}/design-system/ledger/dashboard`
const outDir = join(root, 'public/ledger')

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })

for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1700 },
    deviceScaleFactor: 2,
  })

  await page.addInitScript((value) => {
    localStorage.setItem('theme', value)
  }, theme)

  await page.goto(target, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1400)

  const path = join(outDir, `dashboard-${theme}.png`)
  await page.screenshot({ path, fullPage: true })

  const size = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
  }))

  console.log(
    `${theme.padEnd(5)} → public/ledger/dashboard-${theme}.png  ` +
      `${size.scrollWidth}×${size.height}  overflow ${size.scrollWidth - size.clientWidth}`,
  )

  await page.close()
}

await browser.close()
