#!/usr/bin/env node
/**
 * Gates 1, 2 and 6 — shell geometry, horizontal overflow, and a screenshot to
 * prove the still frame.
 *
 *   node layout-gate.mjs --url http://localhost:3000 \
 *     --widths 1440,1024,768,390 [--out ./.gate] [--wait 2500] [--no-shot]
 *
 * Needs playwright-core and a Chromium on the machine. Resolution order:
 *   CHROME_PATH → the usual macOS install locations → playwright's own.
 * Exits 1 when a width overflows or the shell does not meet.
 */

import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const url = flag('url')
if (!url) {
  console.error('Missing --url')
  process.exit(2)
}

const widths = flag('widths', '1440,1024,768,390')
  .split(',')
  .map((w) => Number(w.trim()))
  .filter(Boolean)
const outDir = resolve(flag('out', './.gate'))
const wait = Number(flag('wait', '2500'))
const shot = !args.includes('--no-shot')

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const { chromium } = await (async () => {
  // Resolve from the project being tested, not from this skill folder.
  const { createRequire } = await import('node:module')
  const require = createRequire(resolve(process.cwd(), 'noop.js'))
  try {
    return require('playwright-core')
  } catch {
    console.error(
      'playwright-core is not installed in this project.\n' +
        '  npm i -D playwright-core   (or pnpm add -D playwright-core)',
    )
    process.exit(2)
  }
})()

let browser
for (const executablePath of [...CANDIDATES, undefined]) {
  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {})
    break
  } catch (error) {
    if (!executablePath) throw error
  }
}

let failures = 0

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: width < 700 ? 844 : 900 },
    deviceScaleFactor: 1,
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(wait)

  const report = await page.evaluate(() => {
    const de = document.documentElement
    const overflow = de.scrollWidth - de.clientWidth

    const offenders = [...document.querySelectorAll('*')]
      .map((el) => ({ el, box: el.getBoundingClientRect() }))
      .filter(({ box }) => box.right > de.clientWidth + 1 && box.width > 0)
      .slice(0, 6)
      .map(({ el, box }) => ({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 64),
        right: Math.round(box.right),
      }))

    const rect = (selector) => {
      const el = document.querySelector(selector)
      if (!el) return null
      const b = el.getBoundingClientRect()
      return { x: Math.round(b.x), w: Math.round(b.width), h: Math.round(b.height) }
    }

    const rail = rect('[data-slot="sidebar-inner"]') ?? rect('aside')
    const railHeader = rect('[data-slot="sidebar-header"]')
    const bar = rect('header')

    return { overflow, offenders, rail, railHeader, bar }
  })

  const shellOk =
    !report.rail ||
    !report.bar ||
    (report.railHeader && report.bar && report.railHeader.h === report.bar.h)

  if (report.overflow !== 0) failures += 1
  if (!shellOk) failures += 1

  console.log(`\n${width}px  overflow ${report.overflow}`)
  if (report.rail) console.log(`  rail        x${report.rail.x} w${report.rail.w}`)
  if (report.railHeader) console.log(`  rail header h${report.railHeader.h}`)
  if (report.bar) console.log(`  top bar     x${report.bar.x} h${report.bar.h}`)
  if (report.rail && report.bar) {
    console.log(`  junction    ${report.bar.x - (report.rail.x + report.rail.w)}px gap`)
  }
  if (report.railHeader && report.bar && report.railHeader.h !== report.bar.h) {
    console.log('  SHELL: rail header and top bar are different heights')
  }
  for (const offender of report.offenders) {
    console.log(`  offender    <${offender.tag}> right:${offender.right} ${offender.cls}`)
  }

  if (shot) {
    mkdirSync(outDir, { recursive: true })
    const file = resolve(outDir, `${width}.png`)
    await page.screenshot({ path: file })
    console.log(`  shot        ${file}`)
  }

  await page.close()
}

await browser.close()

console.log(
  failures
    ? `\n${failures} gate failure(s).`
    : '\nShell meets, nothing overflows.',
)
process.exit(failures ? 1 : 0)
