#!/usr/bin/env node
/**
 * One browser QA pass for a brand-system page.
 *
 *   node scripts/qa.mjs --url http://localhost:3000/design-system/vitrine \
 *     --out docs/screenshots --name vitrine
 *
 * Checks 1440 and 390, light and dark, plus one reduced-motion run:
 * console errors, horizontal overflow, shader/data-state, computed CTA/switch
 * styles, and screenshots. Writes a compact JSON report and one PNG per run.
 *
 * Requires Playwright in the host project:
 *   npm i -D playwright && npx playwright install chromium
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const url = flag('url', 'http://localhost:3000')
const out = resolve(flag('out', 'qa-screenshots'))
const name = flag('name', 'page')
const full = args.includes('--full')
const reportPath = resolve(flag('report', join(out, `${name}-qa.json`)))

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  ;({ chromium } = await import('@playwright/test'))
}

await mkdir(out, { recursive: true })

const browser = await chromium.launch()
const report = {
  url,
  name,
  startedAt: new Date().toISOString(),
  runs: [],
}

const errorsOf = (messages) =>
  messages.filter(
    (message) =>
      message.type === 'error' &&
      !/WebSocket|hmr|HMR|React DevTools/i.test(message.text),
  )

async function applyTheme(page, theme) {
  const button = page
    .getByRole('button', { name: theme === 'dark' ? /dark/i : /light/i })
    .first()
  if ((await button.count()) > 0) {
    await button.click({ timeout: 1200 }).catch(() => {})
  }
  await page.evaluate((nextTheme) => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    if (nextTheme === 'dark' && !isDark) root.classList.add('dark')
    if (nextTheme === 'light' && isDark) root.classList.remove('dark')
    root.dataset.theme = nextTheme
    try {
      localStorage.setItem('theme', nextTheme)
    } catch {
      /* storage can be unavailable */
    }
  }, theme)
  await page.waitForTimeout(350)
}

async function run({ width, height, theme, reduced = false }) {
  const key = `${width}-${theme}${reduced ? '-reduced' : ''}`
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    colorScheme: theme,
  })
  const messages = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      messages.push({ type: message.type(), text: message.text() })
    }
  })
  page.on('pageerror', (error) =>
    messages.push({ type: 'pageerror', text: error.message }),
  )

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.addStyleTag({
    content: 'nextjs-portal { display: none !important; }',
  })
  await page.evaluate(() => document.fonts.ready)
  await applyTheme(page, theme)
  await page.waitForTimeout(reduced ? 1200 : 600)

  const info = await page.evaluate(() => {
    const computed = (selector) => {
      const element = document.querySelector(selector)
      if (!element) return null
      const style = getComputedStyle(element)
      return {
        color: style.color,
        background: style.backgroundColor,
        border: style.borderColor,
        shadow: style.boxShadow,
        display: style.display,
        transform: style.transform,
      }
    }
    const root = document.documentElement
    const shader = document.querySelector('.group\\/dither')
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      theme: root.classList.contains('dark') ? 'dark' : 'light',
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      textColor: getComputedStyle(document.body).color,
      overflow: root.scrollWidth - window.innerWidth,
      height: root.scrollHeight,
      shader: shader
        ? {
            state: shader.getAttribute('data-state'),
            canvas: Boolean(shader.querySelector('canvas')),
          }
        : null,
      cta: computed('a[class*="primaryButton"], button[class*="primaryButton"]'),
      switch: computed('[role="switch"]'),
    }
  })

  const file = join(out, `${name}-${key}.png`)
  await page.screenshot({ path: file, fullPage: full && width === 1440 })

  const result = {
    key,
    width,
    height,
    theme,
    reduced,
    ...info,
    console: errorsOf(messages),
    warnings: messages.filter(
      (message) => message.type === 'warning' && /dither|shader/i.test(message.text),
    ),
    screenshot: file,
  }
  report.runs.push(result)
  await page.close()
  return result
}

for (const width of [1440, 390]) {
  const height = width === 1440 ? 1000 : 844
  for (const theme of ['light', 'dark']) {
    const result = await run({ width, height, theme })
    console.log(
      `${result.key}: overflow ${result.overflow}, theme ${result.theme}, shader ${result.shader?.state ?? 'n/a'}, errors ${result.console.length}`,
    )
  }
}

const reduced = await run({ width: 1440, height: 1000, theme: 'light', reduced: true })
console.log(
  `${reduced.key}: shader ${reduced.shader?.state ?? 'n/a'}, errors ${reduced.console.length}`,
)

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
await browser.close()

const failures = report.runs.flatMap((result) => [
  ...(result.overflow !== 0 ? [`${result.key}: horizontal overflow ${result.overflow}px`] : []),
  ...result.console.map((message) => `${result.key}: ${message.text}`),
])
console.log(`\nReport: ${reportPath}`)
console.log(failures.length === 0 ? 'QA: PASS' : `QA: FAIL\n${failures.join('\n')}`)
process.exit(failures.length === 0 ? 0 : 1)
