#!/usr/bin/env node
/**
 * Browser QA for the Vitrine case: desktop/mobile, light/dark, reduced motion,
 * console errors, shader state, and horizontal overflow.
 *
 *   node scripts/vitrine-qa.mjs http://127.0.0.1:3000/design-system
 */
import { chromium } from '@playwright/test'

const base = process.argv[2] ?? 'http://localhost:3000/design-system/vitrine'
const out = 'docs/screenshots'
const browser = await chromium.launch()
const report = []

async function open(width, height, reducedMotion = 'no-preference') {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
    colorScheme: 'light',
  })
  const page = await context.newPage()
  const messages = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      messages.push(`${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.addStyleTag({
    content: 'nextjs-portal { display: none !important; }',
  })
  await page.evaluate(() => document.fonts.ready)
  return { context, page, messages }
}

async function shoot(page, name, fullPage = true) {
  await page.screenshot({ path: `${out}/${name}`, fullPage })
  report.push({ name, ok: true })
}

{
  const { context, page, messages } = await open(1440, 1000)
  await page.waitForTimeout(1200)
  const shaderState = await page
    .locator('.group\\/dither')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-state')))
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  await shoot(page, 'vitrine-1440-light.png')
  await page.screenshot({ path: `${out}/vitrine-hero-light.png` })

  await page.getByRole('button', { name: 'Dark' }).click()
  await page.waitForTimeout(800)
  await shoot(page, 'vitrine-1440-dark.png')
  await page.screenshot({ path: `${out}/vitrine-hero-dark.png` })

  await page.locator('#forms').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${out}/vitrine-forms-light.png` })
  await page.getByRole('button', { name: 'Light' }).click()

  report.push({
    viewport: '1440',
    shaderState,
    overflow,
    console: messages,
  })
  await context.close()
}

{
  const { context, page, messages } = await open(390, 844)
  await page.waitForTimeout(1000)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  await shoot(page, 'vitrine-390-light.png')
  await page.getByRole('button', { name: 'Dark' }).click()
  await page.waitForTimeout(800)
  await shoot(page, 'vitrine-390-dark.png')
  report.push({ viewport: '390', overflow, console: messages })
  await context.close()
}

{
  const { context, page, messages } = await open(1440, 1000, 'reduce')
  await page.waitForTimeout(2500)
  const shaderState = await page
    .locator('.group\\/dither')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-state')))
  await page.screenshot({ path: `${out}/vitrine-reduced-motion.png` })
  report.push({ viewport: '1440 reduced', shaderState, console: messages })
  await context.close()
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
