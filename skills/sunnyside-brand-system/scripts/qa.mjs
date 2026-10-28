#!/usr/bin/env node
/**
 * One-command verification for a brand-system surface.
 *
 *   node scripts/qa.mjs --url http://localhost:3000/design-system/<slug> \
 *     --slug <slug> --manifest audit.json --mark public/brand/<slug> --sections
 *
 * Runs the static audit and mark score when paths are given, then one browser
 * pass at 1440 and 390, light and dark, plus reduced motion. Checks theme
 * switching, overflow, shader state, typography, form errors, console/page
 * errors and failed requests. Writes a Markdown report and a JSON summary.
 *
 * Flags:
 *   --url        surface URL (127.0.0.1 is rewritten to localhost for Next dev)
 *   --slug       report/file name; defaults to "page"
 *   --out        screenshot directory; defaults to docs/screenshots
 *   --report     Markdown report; defaults to docs/<slug>-qa.md
 *   --json       JSON report; defaults to <out>/<slug>-qa.json
 *   --manifest   audit manifest; audit.mjs runs from the manifest directory
 *   --mark       mark family directory; score-mark.py runs on it
 *   --sections   also capture #foundation, #marks, #colour, #applications
 *   --quick      skip the 390 dark run, full-page captures and sections
 *   --no-full    viewport screenshots only
 *   --no-audit   skip the static audit
 *   --no-score   skip the mark score
 *
 * Requires Playwright in the host project. The static scripts are optional;
 * a missing Python/cairosvg is a skip, not a crash.
 */
import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const has = (name) => args.includes(`--${name}`)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const rawUrl = flag('url', 'http://localhost:3000')
const slug = flag('slug', flag('name', 'page'))
const out = resolve(flag('out', 'docs/screenshots'))
const reportPath = resolve(flag('report', `docs/${slug}-qa.md`))
const jsonPath = resolve(flag('json', join(out, `${slug}-qa.json`)))
const manifest = flag('manifest')
const mark = flag('mark')
const sections = has('sections')
const quick = has('quick')
const fullPage = !has('no-full') && !quick
const runAudit = Boolean(manifest) && !has('no-audit')
const runScore = Boolean(mark) && !has('no-score')

const startedAt = new Date().toISOString()
const checks = []
const runs = []
const notes = []
const screenshots = []
const statics = { audit: null, score: null }

const add = (status, check, evidence) => {
  checks.push({ status, check, evidence })
}
const pass = (check, evidence) => add('pass', check, evidence)
const warn = (check, evidence) => add('warn', check, evidence)
const fail = (check, evidence) => add('fail', check, evidence)
const skip = (check, evidence) => add('skip', check, evidence)

let url = rawUrl
if (/127\.0\.0\.1/.test(url)) {
  url = url.replace('127.0.0.1', 'localhost')
  notes.push(
    `Rewrote ${rawUrl} → ${url}. Next.js 16 blocks dev resources from 127.0.0.1; use localhost for hydration.`,
  )
}

const clipped = (value, length = 6000) =>
  value.length > length ? `${value.slice(0, length)}\n…` : value

async function runCommand(command, commandArgs, cwd, timeout = 180000) {
  try {
    const { stdout, stderr } = await exec(command, commandArgs, {
      cwd,
      timeout,
      maxBuffer: 12 * 1024 * 1024,
    })
    return { ok: true, output: clipped(`${stdout}${stderr}`.trim()) }
  } catch (error) {
    return {
      ok: false,
      code: error.code ?? 1,
      output: clipped(
        `${error.stdout ?? ''}${error.stderr ?? ''}${error.message}`.trim(),
      ),
    }
  }
}

async function checkAudit() {
  if (!runAudit) return
  const manifestPath = resolve(manifest)
  const result = await runCommand(
    process.execPath,
    [join(here, 'audit.mjs'), '--manifest', manifestPath],
    dirname(manifestPath),
  )
  statics.audit = result
  if (result.ok && /Audit: PASS/.test(result.output)) {
    pass('Static audit', result.output.split('\n').slice(-1)[0])
  } else {
    fail('Static audit', result.output.split('\n').slice(-6).join(' / '))
  }
}

async function checkScore() {
  if (!runScore) return
  const markPath = resolve(mark)
  const result = await runCommand(
    'python3',
    [join(here, 'score-mark.py'), '--dir', markPath],
    process.cwd(),
  )
  statics.score = result
  if (!result.ok && /cairosvg|No module named/i.test(result.output)) {
    skip(
      'Mark score',
      'cairosvg/Pillow missing; install them to score the mark.',
    )
    return
  }
  if (result.ok && /PASS/.test(result.output) && !/FAIL/.test(result.output)) {
    pass('Mark score', result.output.split('\n')[0])
  } else {
    fail('Mark score', result.output.split('\n').slice(0, 6).join(' / '))
  }
}

const cleanMessages = (messages) =>
  messages.filter(
    (message) =>
      !/WebSocket|hmr|HMR|React DevTools|Download the React DevTools/i.test(
        message.text,
      ),
  )

const isShaderNoise = (message) =>
  message.type === 'warning' &&
  /WebGL|ReadPixels|GL Driver|shader|dither/i.test(message.text)

const themeOf = (page) =>
  page.evaluate(() => {
    const root = document.documentElement
    if (root.dataset.theme)
      return root.dataset.theme === 'dark' ? 'dark' : 'light'
    return root.classList.contains('dark') ? 'dark' : 'light'
  })

async function applyTheme(page, theme) {
  const button = page
    .getByRole('button', {
      name: theme === 'dark' ? /dark/i : /light/i,
    })
    .first()
  if ((await button.count()) > 0) {
    await button.click({ timeout: 1500 }).catch(() => {})
    await page.waitForTimeout(250)
  }
  if ((await themeOf(page)) !== theme) {
    await page.evaluate((next) => {
      const root = document.documentElement
      root.classList.toggle('dark', next === 'dark')
      root.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* storage can be unavailable */
      }
    }, theme)
    await page.waitForTimeout(150)
  }
}

async function probeThemeToggle(page) {
  const dark = page.getByRole('button', { name: /dark/i }).first()
  if ((await dark.count()) === 0) {
    skip(
      'Theme toggle',
      'No Dark/Light button found; theme forced for screenshots.',
    )
    return
  }
  const before = await themeOf(page)
  await dark.click({ timeout: 1500 }).catch(() => {})
  await page.waitForTimeout(300)
  const after = await themeOf(page)
  if (after === 'dark') {
    pass('Theme toggle', `${before} → ${after}`)
  } else {
    fail('Theme toggle', `Clicking Dark left the theme ${after}.`)
  }
  const light = page.getByRole('button', { name: /light/i }).first()
  if ((await light.count()) > 0) await light.click().catch(() => {})
  await page.waitForTimeout(250)
  const back = await themeOf(page)
  if (back !== 'light')
    warn('Theme toggle back', `Light button left the theme ${back}.`)
}

async function checkForm(page) {
  const form = page.locator('form').first()
  if ((await form.count()) === 0) {
    skip('Form states', 'No <form> found.')
    return
  }
  const submit = form.locator('button[type="submit"]').first()
  if ((await submit.count()) === 0) {
    skip('Form states', 'Form has no submit button.')
    return
  }
  const urlBefore = page.url()
  await submit.click({ timeout: 2000 }).catch(() => {})
  await page.waitForTimeout(350)
  const info = await page.evaluate(() => ({
    alerts: document.querySelectorAll('[role="alert"]').length,
    invalid: [...document.querySelectorAll('[aria-invalid="true"]')].map(
      (node) => node.id || node.getAttribute('name') || 'unnamed',
    ),
    focused:
      document.activeElement?.getAttribute('role') ??
      document.activeElement?.tagName?.toLowerCase() ??
      null,
  }))
  if (page.url() !== urlBefore) {
    warn('Form states', 'Submit navigated; this may be a native/server form.')
  }
  if (info.alerts > 0 && info.invalid.length > 0) {
    pass(
      'Form states',
      `${info.alerts} alert(s); invalid: ${info.invalid.join(', ')}; focus ${info.focused}.`,
    )
  } else {
    warn(
      'Form states',
      `No error summary/invalid pair after submit (alerts ${info.alerts}, invalid ${info.invalid.length}).`,
    )
  }
  const target = (await page.locator('#forms').count())
    ? page.locator('#forms')
    : form
  await target
    .screenshot({ path: join(out, `${slug}-form-errors.png`) })
    .catch(() => {})
  screenshots.push(`${slug}-form-errors.png`)
  const firstInvalid = page.locator('[aria-invalid="true"]').first()
  if ((await firstInvalid.count()) > 0) {
    await firstInvalid.focus().catch(() => {})
    await target
      .screenshot({ path: join(out, `${slug}-form-focus.png`) })
      .catch(() => {})
    screenshots.push(`${slug}-form-focus.png`)
  }
}

async function checkTypography(page, width, key) {
  const info = await page.evaluate(() => {
    const px = (selector) => {
      const node = document.querySelector(selector)
      return node ? parseFloat(getComputedStyle(node).fontSize) : null
    }
    const input = document.querySelector(
      'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]), textarea, select',
    )
    const heading = document.querySelector('h1')
    return {
      body: px('body'),
      input: input ? parseFloat(getComputedStyle(input).fontSize) : null,
      headingWeight: heading
        ? Number(getComputedStyle(heading).fontWeight)
        : null,
    }
  })
  if (info.body !== null && info.body < 16) {
    fail(`Typography body ${key}`, `${info.body}px; the floor is 16px.`)
  } else if (info.body !== null) {
    pass(`Typography body ${key}`, `${info.body}px`)
  }
  if (info.headingWeight !== null && info.headingWeight < 600) {
    warn(
      `Typography heading ${key}`,
      `h1 weight ${info.headingWeight}; 600+ is expected.`,
    )
  }
  if (info.input !== null && width <= 720 && info.input < 16) {
    fail(
      `Typography mobile input ${key}`,
      `${info.input}px; iOS zooms below 16px.`,
    )
  } else if (info.input !== null) {
    pass(`Typography input ${key}`, `${info.input}px at ${width}px`)
  }
  return info
}

async function run({
  width,
  height,
  theme,
  reduced = false,
  probe = false,
  form = false,
}) {
  const key = `${width}-${theme}${reduced ? '-reduced' : ''}`
  const messages = []
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    colorScheme: theme,
  })
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      messages.push({ type: message.type(), text: message.text() })
    }
  })
  page.on('pageerror', (error) =>
    messages.push({ type: 'pageerror', text: error.message }),
  )
  page.on('requestfailed', (request) =>
    messages.push({
      type: 'requestfailed',
      text: `${request.failure()?.errorText ?? 'failed'} ${request.url()}`,
    }),
  )

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  } catch {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {})
    notes.push(`${key}: networkidle timed out; used load.`)
  }
  await page
    .addStyleTag({ content: 'nextjs-portal{display:none!important}' })
    .catch(() => {})
  await page.evaluate(() => document.fonts.ready).catch(() => {})
  await page.waitForTimeout(reduced ? 2200 : 600)

  if (probe) await probeThemeToggle(page)
  await applyTheme(page, theme)
  await page.waitForTimeout(reduced ? 300 : 350)

  const info = await page.evaluate(() => {
    const root = document.documentElement
    const shader = document.querySelector('.group\\/dither, [data-state]')
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      theme:
        root.dataset.theme === 'dark' || root.classList.contains('dark')
          ? 'dark'
          : 'light',
      overflow: root.scrollWidth - window.innerWidth,
      height: root.scrollHeight,
      shader: shader ? shader.getAttribute('data-state') : null,
    }
  })
  const typography = await checkTypography(page, width, key)
  const cleaned = cleanMessages(messages)
  const shaderNoise = cleaned.filter(isShaderNoise)
  const errors = cleaned.filter(
    (message) => message.type !== 'warning' || !isShaderNoise(message),
  )

  if (info.overflow > 0) {
    fail(`Overflow ${key}`, `${info.overflow}px horizontal overflow.`)
  } else {
    pass(`Overflow ${key}`, '0px')
  }
  if (info.shader && reduced) {
    if (info.shader === 'static')
      pass(`Reduced motion ${key}`, 'data-state="static"')
    else if (info.shader === 'fallback')
      warn(
        `Reduced motion ${key}`,
        'data-state="fallback"; the static fallback is shown.',
      )
    else fail(`Reduced motion ${key}`, `data-state="${info.shader}"`)
  } else if (info.shader) {
    pass(`Shader ${key}`, `data-state="${info.shader}"`)
  } else {
    skip(`Shader ${key}`, 'No dither data-state on the page.')
  }
  if (errors.length) {
    fail(`Console ${key}`, errors.map((message) => message.text).join(' / '))
  } else {
    pass(`Console ${key}`, 'No page errors; no non-shader console errors.')
  }
  if (shaderNoise.length) {
    warn(`GPU ${key}`, `${shaderNoise.length} WebGL performance warning(s).`)
  }

  if (!reduced) {
    const suffix = theme === 'dark' ? 'dark' : 'light'
    const full = `${slug}-${width}-${suffix}.jpg`
    await page
      .screenshot({
        path: join(out, full),
        fullPage,
        type: 'jpeg',
        quality: 82,
      })
      .catch(() => {})
    screenshots.push(full)
    if (width === 1440) {
      const hero = `${slug}-hero-${suffix}.png`
      await page.screenshot({ path: join(out, hero) }).catch(() => {})
      screenshots.push(hero)
    }
  }
  if (reduced) {
    const file = `${slug}-reduced-motion.png`
    await page.screenshot({ path: join(out, file) }).catch(() => {})
    screenshots.push(file)
  }

  if (form) await checkForm(page)

  if (sections && width === 1440 && !reduced && theme === 'light') {
    for (const id of ['foundation', 'marks', 'colour', 'applications']) {
      const target = page.locator(`#${id}`)
      if ((await target.count()) === 0) continue
      const file = `${slug}-section-${id}.jpg`
      await target
        .screenshot({
          path: join(out, file),
          type: 'jpeg',
          quality: 84,
        })
        .catch(() => {})
      screenshots.push(file)
    }
  }

  runs.push({
    key,
    width,
    height,
    theme,
    reduced,
    ...info,
    typography,
    errors: errors.map((message) => message.text),
    warnings: shaderNoise.map((message) => message.text),
  })
  await page.close()
}

let browser
try {
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    ;({ chromium } = await import('@playwright/test'))
  }
  await mkdir(out, { recursive: true })
  browser = await chromium.launch()
  await checkAudit()
  await checkScore()

  await run({
    width: 1440,
    height: 1000,
    theme: 'light',
    probe: true,
    form: true,
  })
  await run({ width: 1440, height: 1000, theme: 'dark' })
  await run({ width: 390, height: 844, theme: 'light' })
  if (!quick) await run({ width: 390, height: 844, theme: 'dark' })
  await run({ width: 1440, height: 1000, theme: 'light', reduced: true })
} catch (error) {
  fail('QA runner', error.message)
} finally {
  await browser?.close()
}

const failures = checks.filter((check) => check.status === 'fail')
const warnings = checks.filter((check) => check.status === 'warn')
const verdict = failures.length ? 'FAIL' : 'PASS'
const report = {
  url,
  slug,
  startedAt,
  finishedAt: new Date().toISOString(),
  verdict,
  checks,
  runs,
  statics,
  notes,
  screenshots,
}

await mkdir(dirname(reportPath), { recursive: true })
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`)

const table = (rows) =>
  [
    '| Status | Check | Evidence |',
    '| --- | --- | --- |',
    ...rows.map(
      (check) =>
        `| ${check.status} | ${check.check} | ${check.evidence.replaceAll('\n', ' ').replaceAll('|', '\\|')} |`,
    ),
  ].join('\n')

const markdown = `# ${slug} — QA

**URL:** ${url}
**Run:** ${startedAt} → ${new Date().toISOString()}
**Verdict:** **${verdict}** — ${checks.filter((check) => check.status === 'pass').length} pass, ${warnings.length} warn, ${failures.length} fail.

${notes.length ? `## Notes\n\n${notes.map((note) => `- ${note}`).join('\n')}\n` : ''}

## Checks

${table(checks)}

## Runs

| Run | Theme | Overflow | Shader | Console errors |
| --- | --- | --- | --- | --- |
${runs.map((run) => `| ${run.key} | ${run.theme} | ${run.overflow}px | ${run.shader ?? 'n/a'} | ${run.errors.length} |`).join('\n')}

## Screenshots

${screenshots.length ? screenshots.map((file) => `- \`${file}\``).join('\n') : 'None.'}

## Static audit

${statics.audit ? `\`\`\`\n${statics.audit.output}\n\`\`\`` : 'Not run.'}

## Mark score

${statics.score ? `\`\`\`\n${statics.score.output}\n\`\`\`` : 'Not run.'}

## Not verified

Safari and Firefox; a production build; visual regression; axe CI; print and
social crops. Add them to the host's CI if the surface ships.
`
await writeFile(reportPath, markdown)

console.log(
  `${verdict} — ${checks.filter((check) => check.status === 'pass').length} pass, ${warnings.length} warn, ${failures.length} fail`,
)
for (const check of failures)
  console.log(`FAIL  ${check.check}: ${check.evidence}`)
for (const check of warnings)
  console.log(`WARN  ${check.check}: ${check.evidence}`)
console.log(`\nMarkdown: ${reportPath}\nJSON: ${jsonPath}`)
process.exit(failures.length ? 1 : 0)
