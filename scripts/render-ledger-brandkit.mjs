#!/usr/bin/env node
/**
 * Render the Ledger brand board — the OG image and the library card cover.
 *
 *   node scripts/render-ledger-brandkit.mjs
 *
 * Two things make this different from a hand-drawn board:
 *
 *   1. Every colour is read from `features/ledger/tokens.json`. The board cannot
 *      drift from the palette the case page documents, because it has no colours
 *      of its own. Re-tint the tokens and re-run; the board follows.
 *   2. It renders *inside the running app* rather than from a file:// document,
 *      so it inherits the real Geist Sans / Geist Mono faces that next/font
 *      downloaded at build time. No font plumbing, no fallback to system-ui.
 *
 * Start the server first (`next start -p 3100`), then run this.
 */
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
let chromium

try {
  ;({ chromium } = await import('playwright'))
} catch {
  ;({ chromium } = await import('@playwright/test'))
}

const WIDTH = 1500
const HEIGHT = 1125
const BASE = process.env.LEDGER_BASE ?? 'http://localhost:3100'
const OUT = 'public/brand/ledger/ledger-brandkit.png'

const tokens = JSON.parse(
  await readFile(resolve('features/ledger/tokens.json'), 'utf8'),
)

/** Hex for a primitive token, by bare name (`lg-harbor-050`). */
const hex = (name) => {
  const entry = tokens.primitive[name]
  if (!entry?.hex) throw new Error(`[brandkit] no hex for primitive ${name}`)
  return entry.hex
}
const bare = (token) => token.replace(/^--/, '')

const C = {
  canvas: hex('lg-harbor-050'),
  paper: hex('lg-harbor-000'),
  popover: hex('lg-harbor-025'),
  hairline: hex('lg-harbor-200'),
  recess: hex('lg-harbor-150'),
  muted: hex('lg-harbor-500'),
  ink: hex('lg-harbor-900'),
  deep: hex('lg-harbor-deep'),
  signal: hex('lg-indigo-600'),
  signalInk: hex('lg-indigo-300'),
  lift: hex('lg-indigo-400'),
  wash: hex('lg-indigo-100'),
  wash2: hex('lg-indigo-200'),
}

/* The mark: three filled cells and one lifted tile, exactly as LedgerMark. */
const mark = (size, accent = C.signalInk) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="8" height="8" rx="2" fill="${C.ink}"/>
  <rect x="15" y="1" width="8" height="8" rx="2" fill="${C.ink}"/>
  <rect x="1" y="15" width="8" height="8" rx="2" fill="${C.ink}"/>
  <rect x="16" y="16" width="7" height="7" rx="1.75" fill="${accent}"/>
</svg>`

const mono = (text, size = 9.5, color = C.muted) =>
  `<span style="font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:${size}px;letter-spacing:0.14em;text-transform:uppercase;color:${color};white-space:nowrap">${text}</span>`

const rampSwatch = (step) => {
  const bg = hex(bare(step.token))
  const label = bare(step.token).replace('lg-harbor-', '')
  return `<div style="display:flex;flex-direction:column;gap:5px">
    <div style="height:38px;border-radius:5px;background:${bg};box-shadow:inset 0 0 0 1px ${C.hairline}"></div>
    <span style="font-family:var(--font-geist-mono),monospace;font-size:8px;letter-spacing:0.06em;color:${C.muted}">${label}</span>
  </div>`
}

const signalSwatch = (step) => {
  const bg = hex(bare(step.token))
  const label = bare(step.token).replace('lg-indigo-', '')
  return `<div style="display:flex;flex-direction:column;gap:5px">
    <div style="height:26px;border-radius:5px;background:${bg};box-shadow:inset 0 0 0 1px rgba(10,16,36,0.08)"></div>
    <span style="font-family:var(--font-geist-mono),monospace;font-size:8px;letter-spacing:0.06em;color:${C.muted}">${label}</span>
  </div>`
}

const card = (inner, extra = '') =>
  `<div style="background:${C.paper};border:1px solid ${C.hairline};border-radius:12px;padding:16px 18px;${extra}">${inner}</div>`

const board = `
<div id="board" style="
  width:${WIDTH}px;height:${HEIGHT}px;box-sizing:border-box;padding:54px 56px 44px;
  display:flex;flex-direction:column;
  background:
    radial-gradient(90% 60% at 12% 0%, ${C.wash2}66 0%, transparent 58%),
    radial-gradient(70% 50% at 100% 8%, ${C.wash}99 0%, transparent 62%),
    ${C.canvas};
  font-family:var(--font-geist),ui-sans-serif,system-ui,sans-serif;
  color:${C.ink};overflow:hidden;position:relative">

  <!-- header -->
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:11px">
      <span style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;
        background:linear-gradient(148deg,${C.signal} 0%,${C.deep} 58%,#050a14 100%);
        box-shadow:inset 0 1px 0 0 rgba(255,255,255,0.22),inset 0 0 0 1px rgba(255,255,255,0.06),0 1px 2px 0 rgba(0,27,60,0.45)">
        ${mark(17, C.signalInk)}
      </span>
      <span style="font-size:16px;font-weight:500;letter-spacing:-0.02em">Ledger</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px">
      ${mono('Indigo Harbor', 9.5)}
      <span style="width:1px;height:11px;background:${C.hairline}"></span>
      ${mono(tokens.version, 9.5)}
    </div>
  </div>

  <!-- headline -->
  <div style="margin-top:26px;display:flex;align-items:flex-end;justify-content:space-between;gap:40px">
    <h1 style="margin:0;font-size:58px;font-weight:600;line-height:0.98;letter-spacing:-0.042em;max-width:640px">
      The surface is<br>the only decoration.
    </h1>
    <div style="max-width:400px;padding-bottom:5px">
      <p style="margin:0;font-size:13.5px;line-height:1.5;color:${C.muted}">
        A commerce dashboard on shadcn/ui: one frosted plane, one hairline grid,
        one harbor-indigo signal, and every figure tabular so the money lines up.
      </p>
    </div>
  </div>

  <!-- body -->
  <div style="margin-top:26px;flex:1;display:flex;gap:24px;min-height:0">

    <!-- the specimen -->
    <div style="flex:1;min-width:0;min-height:0;display:flex;flex-direction:column">
      <div style="flex:1;min-height:0;border-radius:18px;padding:7px;box-sizing:border-box;overflow:hidden;
        background:linear-gradient(170deg,${C.wash2} 0%,${C.wash} 42%,${C.signalInk} 100%);
        box-shadow:0 26px 50px -34px rgba(0,27,60,0.5)">
        <div style="height:100%;border-radius:12px;overflow:hidden;background:${C.paper};
          border:1px solid rgba(255,255,255,0.55);display:flex;flex-direction:column">
          <div style="height:29px;flex:none;display:flex;align-items:center;gap:5px;padding:0 11px;
            border-bottom:1px solid ${C.recess};background:${C.popover}">
            <span style="width:6px;height:6px;border-radius:50%;background:#dfe4f0"></span>
            <span style="width:6px;height:6px;border-radius:50%;background:#dfe4f0"></span>
            <span style="width:6px;height:6px;border-radius:50%;background:#dfe4f0"></span>
            <span style="margin:0 auto;display:flex;align-items:center;gap:6px;padding:2px 10px;border-radius:20px;
              background:${C.recess};font-family:var(--font-geist-mono),monospace;font-size:8px;color:${C.muted}">
              ledger.local <span style="opacity:0.45">/</span> dashboard
            </span>
            <span style="width:26px"></span>
          </div>
          <img src="${BASE}/ledger/dashboard-light.png" alt=""
            style="display:block;width:100%;flex:1;min-height:0;object-fit:cover;object-position:top">
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:9px;flex:none">
        ${mono('Fig. 01 · Commerce overview · 1440', 9)}
        ${mono('Light / dark', 9)}
      </div>
    </div>

    <!-- the kit -->
    <div style="width:456px;flex:none;display:flex;flex-direction:column;justify-content:space-between;gap:11px">

      ${card(`
        <div style="display:flex;align-items:center;gap:22px">
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
            ${mark(56, C.lift)}
            <span style="font-family:var(--font-geist-mono),monospace;font-size:8px;color:${C.muted}">56</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
            ${mark(26, C.lift)}
            <span style="font-family:var(--font-geist-mono),monospace;font-size:8px;color:${C.muted}">26</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
            ${mark(15, C.lift)}
            <span style="font-family:var(--font-geist-mono),monospace;font-size:8px;color:${C.muted}">15</span>
          </div>
          <div style="border-left:1px solid ${C.hairline};padding-left:20px">
            <p style="margin:0;font-size:13px;font-weight:500;letter-spacing:-0.01em">The grid holds.<br>One tile floats.</p>
            <p style="margin:5px 0 0;font-size:10.5px;line-height:1.45;color:${C.muted}">
              24-unit box, 1-unit gap. The lifted tile is one unit smaller and offset by one, so it reads as coming off the surface.
            </p>
          </div>
        </div>
      `)}

      ${card(`
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">
          ${mono('Indigo harbor · one signal', 9)}
          ${mono(tokens.ramp.length + ' steps', 8.5, '#97a3c0')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(${tokens.ramp.length},1fr);gap:5px">
          ${tokens.ramp.map(rampSwatch).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(${tokens.signal.steps.length},1fr);gap:5px;margin-top:11px">
          ${tokens.signal.steps.map(signalSwatch).join('')}
        </div>
      `)}

      ${card(`
        <div style="display:flex;align-items:center;gap:18px">
          <span style="font-size:44px;font-weight:600;letter-spacing:-0.045em;line-height:1">Aa</span>
          <div style="display:flex;flex-direction:column;gap:3px">
            <span style="font-size:11px;font-weight:500">Geist Sans 600 <span style="color:${C.muted};font-weight:400">· −0.035em</span></span>
            <span style="font-family:var(--font-geist-mono),monospace;font-size:10px;color:${C.muted}">Geist Mono 10 · 0.14em · tabular figures</span>
            <span style="font-family:var(--font-geist-mono),monospace;font-size:10px;color:${C.muted}">${tokens.radius} radius · ${tokens.type.scale.display.size} display</span>
          </div>
        </div>
      `)}

      ${card(
        `
        <div style="margin-bottom:8px">${mono('The glass', 9)}</div>
        <div style="font-family:var(--font-geist-mono),monospace;font-size:9.5px;line-height:1.65;color:${C.muted};white-space:pre-wrap">background: color-mix(in oklab, var(--card) 65%, transparent);
backdrop-filter: blur(24px) saturate(140%);
border: 1px solid rgb(0 0 0 / 0.06);
box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15);</div>
        <div style="margin-top:10px;padding-top:9px;border-top:1px solid ${C.recess};display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-size:10.5px;color:${C.muted}">Panel · float · menu</span>
          <span style="font-size:10.5px;color:${C.muted}">never behind a word of type</span>
        </div>
      `,
        '',
      )}

      ${card(`
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:9px">
          ${mono('Measured · light', 9)}
          ${mono('WCAG AA is 4.5', 8.5, '#97a3c0')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 18px">
          ${Object.entries(tokens.contrast.light)
            .map(
              ([label, ratio]) => `
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
              <span style="font-size:10.5px;color:${C.muted}">${label}</span>
              <span style="font-family:var(--font-geist-mono),monospace;font-size:10px;color:${C.ink}">${ratio}</span>
            </div>`,
            )
            .join('')}
        </div>
      `)}
    </div>
  </div>

  <!-- footer -->
  <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid ${C.hairline};padding-top:11px">
    ${mono('Case 09 · The Sunnyside design-system library · a dashboard on shadcn/ui, one WebGL field', 9)}
    ${mono('adityahimawan.space / design-system / ledger', 9, '#97a3c0')}
  </div>
</div>`

/* ── render ─────────────────────────────────────────────────── */
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
})

await page.goto(`${BASE}/design-system/ledger`, { waitUntil: 'networkidle' })
await page.waitForFunction(() => document.fonts.status === 'loaded')

const fontOk = await page.evaluate(() => ({
  geist: document.fonts.check('16px Geist'),
  mono: document.fonts.check('16px "Geist Mono"'),
  geistVar: getComputedStyle(document.documentElement)
    .getPropertyValue('--font-geist')
    .trim()
    .slice(0, 40),
}))

await page.evaluate((html) => {
  document.body.innerHTML = html
  document.body.style.margin = '0'
  document.documentElement.style.background = '#f3f5fb'
}, board)

// The plate is an <img>; wait for it to actually decode.
await page.waitForFunction(() => {
  const img = document.querySelector('#board img')
  return img && img.complete && img.naturalWidth > 0
})

const el = await page.locator('#board')
await el.screenshot({ path: OUT })

const box = await el.boundingBox()
await browser.close()

const bytes = (await readFile(resolve(OUT))).length
await mkdir(resolve('public/brand/ledger'), { recursive: true })

console.log(
  `fonts   geist=${fontOk.geist} mono=${fontOk.mono} var=${fontOk.geistVar}`,
)
console.log(
  `board   ${Math.round(box.width)}×${Math.round(box.height)} → ${OUT}`,
)
console.log(`file    ${(bytes / 1024).toFixed(0)} KB`)
if (!fontOk.geist)
  console.warn(
    'warning: Geist did not load; the board fell back to a system face',
  )
