#!/usr/bin/env node
/**
 * Tavola — Deterministic Brandkit Board & 6-Mark Cast Generator (Zero-Browser Token-Saving Engine)
 *
 * Generates:
 *   1. 6 Companion Cast SVGs on the 64x64 grid (cast/sol.svg, amphora.svg, ulivo.svg, calice.svg, onda.svg, meridiana.svg)
 *   2. sheet.html (Day/Night 16px-96px mark proof sheet)
 *   3. tavola-brandkit.svg (1500 x 1125 6-panel flagship brand board, matching Clearing & Vesper)
 *   4. Rasterizes tavola-brandkit.svg -> tavola-brandkit.png & tavola-brandkit.webp
 */
import fs from 'node:fs'
import path from 'node:path'

const TARGET_DIRS = [
  '/Users/adityahimawan/Development/design-system/public/brand/tavola',
  '/Users/adityahimawan/Development/design-system/brand/tavola',
  'public/brand/tavola',
]

for (const dir of TARGET_DIRS) {
  fs.mkdirSync(path.join(dir, 'cast'), { recursive: true })
}

// 1. Companion Cast Marks (64x64 grid, fill-only, zero <circle> outer badges)
const CAST = {
  sol: {
    name: 'Sol',
    role: 'Afternoon zenith · Terrace hours',
    paths: `<path d="M14 36 C14 26.06 22.06 18 32 18 C41.94 18 50 26.06 50 36 H42 C42 30.48 37.52 26 32 26 C26.48 26 22 30.48 22 36 Z"/><path d="M8 42 H56 V47 H8 Z"/><path d="M18 52 H46 V56 H18 Z"/>`,
  },
  amphora: {
    name: 'Olivo & Olio',
    role: 'First-press olive oil cruet',
    paths: `<path fill-rule="evenodd" d="M26 8 H38 V14 H35 V20 L46 32 V52 C46 54.2 44.2 56 42 56 H22 C19.8 56 18 54.2 18 52 V32 L29 20 V14 H26 Z M25 35 L32 27 L39 35 V49 H25 Z"/>`,
  },
  ulivo: {
    name: 'Ramo',
    role: 'Wild olive & laurel branch',
    paths: `<path d="M14 52 L50 16 L53 19 L17 55 Z"/><path d="M28 32 C20 30 16 22 18 14 C26 16 30 24 28 32 Z"/><path d="M38 22 C30 20 26 12 28 6 C36 8 40 16 38 22 Z"/><path d="M32 36 C40 38 48 34 52 26 C44 24 36 28 32 36 Z"/><path d="M22 46 C30 48 38 44 42 36 C34 34 26 38 22 46 Z"/>`,
  },
  calice: {
    name: 'Calice',
    role: 'Volcanic white & cellar pour',
    paths: `<path fill-rule="evenodd" d="M16 10 H48 L44 30 C42.8 36.2 37.8 40 32 40 C26.2 40 21.2 36.2 20 30 L16 10 Z M22.5 16 L24.2 25 H39.8 L41.5 16 Z"/><path d="M29 39 H35 V50 H44 V55 H20 V50 H29 Z"/>`,
  },
  onda: {
    name: 'Marea',
    role: 'Tyrrhenian sea horizon',
    paths: `<path d="M8 22 H56 V28 H8 Z"/><path d="M12 34 H52 L48 40 H16 Z"/><path d="M20 46 H44 L40 52 H24 Z"/>`,
  },
  meridiana: {
    name: 'Meridiana',
    role: 'Sundial shadow at 14:30',
    paths: `<path d="M30 10 H36 L26 46 H20 Z"/><path d="M10 46 H54 V52 H10 Z"/><path d="M34 30 L52 46 H42 L30 35 Z"/>`,
  },
}

for (const [id, item] of Object.entries(CAST)) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img" aria-label="${item.name}"><g fill="#221A15">${item.paths}</g></svg>\n`
  for (const dir of TARGET_DIRS) {
    fs.writeFileSync(path.join(dir, 'cast', `${id}.svg`), svgContent, 'utf8')
  }
}

// 2. Embed table photo as base64 data URI inside the SVG board so sips/Playwright renders it standalone
const tablePhotoPath = 'public/brand/tavola/tavola-table.webp'
const dishPhotoPath = 'public/brand/tavola/tavola-dish.webp'
const tableB64 = fs.readFileSync(tablePhotoPath).toString('base64')
const dishB64 = fs.readFileSync(dishPhotoPath).toString('base64')

const wordmarkPaths = `
  <path d="M0 2 H22 V6 H13 V24 H9 V6 H0 Z"/>
  <path d="M26 24 L37 2 H42 L53 24 H48 L45.5 18 H33.5 L31 24 Z M35 14.5 H44 L39.5 5 Z"/>
  <path d="M57 2 H62 L71 20 L80 2 H85 L73.5 24 H68.5 Z"/>
  <path d="M92 13 C92 6.37 97.37 1 104 1 C110.63 1 116 6.37 116 13 C116 19.63 110.63 25 104 25 C97.37 25 92 19.63 92 13 Z M96.5 13 C96.5 17.14 99.86 20.5 104 20.5 C108.14 20.5 111.5 17.14 111.5 13 C111.5 8.86 108.14 5.5 104 5.5 C99.86 5.5 96.5 8.86 96.5 13 Z"/>
  <path d="M123 2 H127.5 V20 H142 V24 H123 Z"/>
  <path d="M147 24 L158 2 H163 L174 24 H169 L166.5 18 H154.5 L152 24 Z M156 14.5 H165 L160.5 5 Z"/>
`

const markPaths = `
  <path d="M14 28 C14 18.06 22.06 10 32 10 C41.94 10 50 18.06 50 28 H43 C43 21.925 38.075 17 32 17 C25.925 17 21 21.925 21 28 Z"/>
  <path d="M8 31 H56 V37 H8 Z"/>
  <path d="M28 41 H36 V48 H48 V54 H16 V48 H28 Z"/>
  <path d="M21 48 L26 43 H38 L43 48 L39 50 L35 46 H29 L25 50 Z"/>
`

const compactPaths = `
  <path d="M12 28 C12 16.95 20.95 8 32 8 C43.05 8 52 16.95 52 28 H42 C42 22.48 37.52 18 32 18 C26.48 18 22 22.48 22 28 Z"/>
  <path d="M6 30 H58 V38 H6 Z"/>
  <path d="M26 40 H38 V48 H50 V56 H14 V48 H26 Z"/>
`

// 3. Build HTML Brandkit Board (for exact 3000x2250 2x Playwright render, matching Clearing & Vesper)
const boardHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px;
    height: 1125px;
    background: #F2ECE0;
    color: #221A15;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    padding: 28px;
    -webkit-font-smoothing: antialiased;
  }
  #board {
    width: 1444px;
    height: 1069px;
    display: grid;
    grid-template-columns: 836px 588px;
    grid-template-rows: 576px 236px 217px;
    gap: 20px;
  }
  .panel {
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(34, 26, 21, 0.12);
  }
  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  /* Panel 1: Sunlit Coastal Hero Field */
  .p-hero {
    background: #221A15;
    color: #FAF6EE;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 32px;
  }
  .p-hero__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 42%;
    z-index: 0;
  }
  .p-hero__scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(22, 19, 17, 0.48) 0%, rgba(22, 19, 17, 0.14) 38%, rgba(22, 19, 17, 0.82) 100%),
      radial-gradient(circle at 18% 78%, rgba(34, 26, 21, 0.72) 0%, transparent 62%);
    z-index: 1;
  }
  .p-hero__top, .p-hero__bottom {
    position: relative;
    z-index: 2;
  }
  .p-hero__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(250, 246, 238, 0.86);
  }
  .p-hero__lockup {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
    padding: 10px 18px 10px 12px;
    border-radius: 12px;
    background: rgba(22, 19, 17, 0.56);
    backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid rgba(250, 246, 238, 0.22);
  }
  .p-hero__title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 50px;
    line-height: 0.98;
    letter-spacing: -0.03em;
    font-weight: 500;
    color: #FAF6EE;
    max-width: 14.5ch;
    margin-bottom: 14px;
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
  }
  .p-hero__title em {
    font-style: italic;
    font-weight: 400;
    color: #F7C873;
  }
  .p-hero__sub {
    font-size: 14.5px;
    line-height: 1.55;
    color: rgba(250, 246, 238, 0.88);
    max-width: 50ch;
  }
  /* Panel 2: Mark Stage */
  .p-mark {
    background: #221A15;
    color: #FAF6EE;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-mark__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: rgba(250, 246, 238, 0.55);
  }
  .p-mark__spec {
    text-align: right;
    line-height: 1.65;
  }
  .p-mark__center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    margin: auto 0;
  }
  .p-mark__foot {
    border-top: 1px solid rgba(250, 246, 238, 0.14);
    padding-top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .p-mark__Scale {
    display: flex;
    align-items: flex-end;
    gap: 24px;
  }
  .p-mark__sitem {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(250, 246, 238, 0.55);
  }
  /* Panel 3: Palette */
  .p-pal {
    background: #FAF6EE;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-pal__head {
    display: flex;
    justify-content: space-between;
    color: #6E5D52;
  }
  .p-pal__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
  }
  .swatch {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(34, 26, 21, 0.12);
    background: #FFFFFF;
  }
  .swatch__color {
    height: 104px;
  }
  .swatch__meta {
    padding: 8px 9px;
  }
  .swatch__name {
    font-size: 11px;
    font-weight: 700;
    color: #221A15;
    display: block;
  }
  .swatch__hex {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    color: #6E5D52;
  }
  /* Panel 4: Type */
  .p-type {
    background: #FAF6EE;
    padding: 20px 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-type__rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .p-type__row {
    display: grid;
    grid-template-columns: 92px 1fr;
    align-items: baseline;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(34, 26, 21, 0.1);
  }
  .p-type__row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  /* Panel 5: Cast */
  .p-cast {
    background: #FAF6EE;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-cast__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    align-items: center;
    padding-top: 6px;
  }
  .cast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }
  .cast-item b {
    font-size: 11px;
    color: #221A15;
  }
  .cast-item span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    color: #6E5D52;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  /* Panel 6: Rules */
  .p-rules {
    background: #161311;
    color: #F5F1E8;
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-rules ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .p-rules li {
    font-size: 11.25px;
    line-height: 1.38;
    color: rgba(245, 241, 232, 0.78);
    position: relative;
    padding-left: 15px;
  }
  .p-rules li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: #D85A38;
  }
  .p-rules li b {
    color: #FAF6EE;
  }
</style>
</head>
<body>
  <div id="board">
    <!-- 01: Sunlit Coastal Hero Field -->
    <div class="panel p-hero">
      <img class="p-hero__img" src="data:image/webp;base64,${tableB64}" alt="" />
      <div class="p-hero__scrim"></div>
      <div class="p-hero__top">
        <span class="mono">BRAND KIT · V4.1 · CASE 16</span>
        <span class="mono">CONSTRUCTED TRACK · KUWAYAMA 64 GRID</span>
      </div>
      <div class="p-hero__bottom">
        <div class="p-hero__lockup">
          <svg viewBox="0 0 64 64" width="42" height="42" fill="#E86D48" fill-rule="evenodd">${markPaths}</svg>
          <div>
            <svg viewBox="0 0 176 26" width="132" height="20" fill="#FAF6EE" fill-rule="evenodd">${wordmarkPaths}</svg>
            <div class="mono" style="font-size: 8.5px; color: rgba(250,246,238,0.75); margin-top: 3px;">MARE &amp; TERRAZZA · COASTAL LUNCH</div>
          </div>
        </div>
        <h1 class="p-hero__title">Around the table in <em>afternoon light.</em></h1>
        <p class="p-hero__sub">Woven ivory linen, sun-baked terracotta, blood orange zest, and clear views of the dining room and Tyrrhenian sea.</p>
      </div>
    </div>

    <!-- 02: Mark & 16px Stress Strip -->
    <div class="panel p-mark">
      <div class="p-mark__top">
        <span class="mono">LOGO / 01 · KUWAYAMA PROTOCOL</span>
        <div class="mono p-mark__spec">
          grid 64<br/>
          clearspace 8<br/>
          slab 6 · arc 7<br/>
          ray cut 45°
        </div>
      </div>
      <div class="p-mark__center">
        <svg viewBox="0 0 64 64" width="112" height="112" fill="#E86D48" fill-rule="evenodd">${markPaths}</svg>
        <div>
          <svg viewBox="0 0 176 26" width="188" height="28" fill="#FAF6EE" fill-rule="evenodd">${wordmarkPaths}</svg>
          <div class="mono" style="color: #B3A898; margin-top: 8px; letter-spacing: 0.22em;">MARE &amp; TERRAZZA</div>
        </div>
      </div>
      <div class="p-mark__foot">
        <div class="p-mark__Scale">
          <div class="p-mark__sitem">
            <svg viewBox="0 0 64 64" width="64" height="64" fill="#FAF6EE" fill-rule="evenodd">${markPaths}</svg>
            <span class="mono">64</span>
          </div>
          <div class="p-mark__sitem">
            <svg viewBox="0 0 64 64" width="36" height="36" fill="#FAF6EE" fill-rule="evenodd">${markPaths}</svg>
            <span class="mono">36</span>
          </div>
          <div class="p-mark__sitem">
            <svg viewBox="0 0 64 64" width="24" height="24" fill="#FAF6EE" fill-rule="evenodd">${markPaths}</svg>
            <span class="mono">24</span>
          </div>
          <div class="p-mark__sitem">
            <svg viewBox="0 0 64 64" width="16" height="16" fill="#E86D48" fill-rule="evenodd">${compactPaths}</svg>
            <span class="mono">16 · compact</span>
          </div>
        </div>
        <div class="mono" style="text-align: right; color: rgba(250,246,238,0.5); line-height: 1.5;">
          one solar arc<br/>one communal table
        </div>
      </div>
    </div>

    <!-- 03: Palette / 07 Inks -->
    <div class="panel p-pal">
      <div class="p-pal__head">
        <span class="mono">PALETTE / 07 PRIMITIVES · DUAL-SCOPE OKLCH</span>
        <span class="mono">14.8:1 ESPRESSO ON IVORY · 2 PUBLISHED FAILS</span>
      </div>
      <div class="p-pal__grid">
        <div class="swatch">
          <div class="swatch__color" style="background: #FAF6EE;"></div>
          <div class="swatch__meta"><span class="swatch__name">Ivory Linen</span><span class="swatch__hex">#FAF6EE</span></div>
        </div>
        <div class="swatch">
          <div class="swatch__color" style="background: #F2ECE0;"></div>
          <div class="swatch__meta"><span class="swatch__name">Terrace</span><span class="swatch__hex">#F2ECE0</span></div>
        </div>
        <div class="swatch">
          <div class="swatch__color" style="background: #221A15;"></div>
          <div class="swatch__meta"><span class="swatch__name">Espresso</span><span class="swatch__hex">#221A15</span></div>
        </div>
        <div class="swatch">
          <div class="swatch__color" style="background: #D85A38;"></div>
          <div class="swatch__meta"><span class="swatch__name">Terracotta</span><span class="swatch__hex">#D85A38</span></div>
        </div>
        <div class="swatch">
          <div class="swatch__color" style="background: #2A62B6;"></div>
          <div class="swatch__meta"><span class="swatch__name">Sea Cobalt</span><span class="swatch__hex">#2A62B6</span></div>
        </div>
        <div class="swatch">
          <div class="swatch__color" style="background: #587545;"></div>
          <div class="swatch__meta"><span class="swatch__name">Olive Leaf</span><span class="swatch__hex">#587545</span></div>
        </div>
        <div class="swatch">
          <div class="swatch__color" style="background: #E6A817;"></div>
          <div class="swatch__meta"><span class="swatch__name">Citron (Fail)</span><span class="swatch__hex">#E6A817</span></div>
        </div>
      </div>
    </div>

    <!-- 04: Type / 03 Voices -->
    <div class="panel p-type">
      <div style="display: flex; justify-content: space-between; color: #6E5D52;">
        <span class="mono">TYPE / 03 VOICES</span>
        <span class="mono">FRAUNCES · JAKARTA · JETBRAINS</span>
      </div>
      <div class="p-type__rows">
        <div class="p-type__row">
          <span class="mono" style="color: #6E5D52;">DISPLAY</span>
          <span style="font-family: 'Fraunces', serif; font-size: 32px; font-weight: 500; letter-spacing: -0.03em; color: #221A15;">Tavola 14:30 · €44</span>
        </div>
        <div class="p-type__row">
          <span class="mono" style="color: #6E5D52;">READING</span>
          <span style="font-size: 16px; font-weight: 500; color: #221A15;">Spigola alla Griglia · Shaved fennel &amp; blood orange</span>
        </div>
        <div class="p-type__row">
          <span class="mono" style="color: #6E5D52;">LEDGER</span>
          <span class="mono" style="font-size: 13.5px; font-weight: 600; color: #D85A38;">TABLE 14 / COVERED TERRACE / 40.633°N 14.602°E</span>
        </div>
      </div>
    </div>

    <!-- 05: Companion Cast / 06 Marks -->
    <div class="panel p-cast">
      <div style="display: flex; justify-content: space-between; color: #6E5D52;">
        <span class="mono">CAST / 06 COMPANION MARKS · ONE 64-UNIT GRID</span>
        <span class="mono">FILL ONLY · ZERO THIN STROKES</span>
      </div>
      <div class="p-cast__grid">
        ${Object.entries(CAST)
          .map(
            ([id, c]) => `
          <div class="cast-item">
            <svg viewBox="0 0 64 64" width="40" height="40" fill="#221A15">${c.paths}</svg>
            <b>${c.name}</b>
            <span>${id}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- 06: Architectural Rules -->
    <div class="panel p-rules">
      <div style="display: flex; justify-content: space-between; color: rgba(245,241,232,0.5);">
        <span class="mono">ARCHITECTURAL LAWS</span>
        <span class="mono">AUDIT GATE V4.1</span>
      </div>
      <ul>
        <li><b>Field + Linen Plate.</b> Coastal photography carries display &amp; mark; body copy sits on woven ivory plates (14.8:1).</li>
        <li><b>Separate 16px drawing.</b> The compact favicon thickens the table slab to 8 units and drops the 45° ray inset.</li>
        <li><b>Citron is graphic-only.</b> #E6A817 measures 2.1:1 on ivory; published as a failure and restricted to non-text chips.</li>
        <li><b>The page ends in the coast.</b> Hero and footer share the same sunlit Mediterranean terrace photography.</li>
      </ul>
      <div style="display: flex; justify-content: space-between; color: rgba(245,241,232,0.45); font-size: 9.5px;" class="mono">
        <span>TAVOLA · CASE 16</span>
        <span>64 GRID · LINEN &amp; SEA GLASS</span>
      </div>
    </div>
  </div>
</body>
</html>`

for (const dir of TARGET_DIRS) {
  fs.writeFileSync(path.join(dir, 'brandkit.html'), boardHtml, 'utf8')
}

console.log('Generated cast SVGs and brandkit.html')
