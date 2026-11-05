#!/usr/bin/env node
/**
 * figma-manifest — execute the sheet's own `buildFigmaManifest()` in headless
 * Chrome and write the JSON to disk, so a replay plugin can be seeded without
 * anyone copying anything.
 *
 *   node scripts/figma-manifest.mjs --html public/brand/vesper/vesper-figma.html \
 *     --out design/figma/vesper.manifest.json
 *
 * playwright-core is an OPTIONAL dependency. It is looked up in the workspace's
 * node_modules, the current directory, or PLAYWRIGHT_CORE. Chrome is looked up
 * in CHROME_PATH or the usual macOS locations. If either is missing the script
 * exits 2 with a clear message; the handoff orchestrator treats that as
 * "no seed" and carries on with the paste-in-UI flow.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const one = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const htmlPath = resolve(one('html', ''))
const outPath = resolve(one('out', join(dirname(htmlPath || '.'), 'figma.manifest.json')))
if (!htmlPath || !existsSync(htmlPath)) throw new Error(`--html not found: ${htmlPath || '(empty)'}`)

const require = createRequire(import.meta.url)
const candidates = [
  process.env.PLAYWRIGHT_CORE,
  join(process.cwd(), 'node_modules', 'playwright-core'),
  join(dirname(htmlPath), 'node_modules', 'playwright-core'),
  'playwright-core',
].filter(Boolean)

let chromium = null
for (const c of candidates) {
  try {
    const mod = require(c)
    chromium = mod.chromium || (mod.default && mod.default.chromium)
    if (chromium) break
  } catch (e) { /* try the next */ }
}
if (!chromium) {
  console.error('  · playwright-core not found — no seed manifest written.')
  console.error('    Install it in the workspace, or set PLAYWRIGHT_CORE=/path/to/playwright-core.')
  process.exit(2)
}

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const executablePath = chromeCandidates.find(existsSync)
if (!executablePath) {
  console.error('  · Chrome/Chromium not found — no seed manifest written.')
  console.error('    Set CHROME_PATH=/path/to/Chrome.')
  process.exit(2)
}

let browser = null
try {
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
  await page.waitForFunction(() => typeof window.buildFigmaManifest === 'function', { timeout: 10000 })
  const manifest = await page.evaluate(() => window.buildFigmaManifest())
  if (!manifest || manifest.kind !== 'sunnyside/figma-manifest') throw new Error('the page did not return a Sunnyside manifest')
  if (!manifest.sheets || !manifest.sheets.length) throw new Error('the manifest has no sheets (are all sheets filtered out?)')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, JSON.stringify(manifest), 'utf8')
  console.log(`  ✓ ${outPath}`)
  console.log(`    ${manifest.brand} · ${manifest.sheets.length} sheets · ${manifest.nodes} nodes · ${JSON.stringify(manifest).length.toLocaleString()} chars`)
} catch (e) {
  console.error('  ✗ manifest extraction failed: ' + ((e && e.message) || String(e)))
  process.exitCode = 1
} finally {
  if (browser) await browser.close()
}
