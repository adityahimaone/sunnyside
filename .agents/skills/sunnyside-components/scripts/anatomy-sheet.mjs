#!/usr/bin/env node
/**
 * anatomy-sheet.mjs — Apple-Style Dimensional Component Anatomy & Motion Spec Sheet Generator
 *
 * Generates an Apple-grade 1700×1060 technical redline spec sheet with:
 *   - Mathematical dimension chains (S# spacing, H# height formulas, R# concentric radii)
 *   - Exploded axonometric layer stack (matrix(.94, .17, -.34, .47, tx, ty-z))
 *   - HUG / FLEX / FILL slot architecture
 *   - Title block & variable ledger
 *   - Optional 60fps pure-time render(t) motion timeline (--motion)
 *
 * Usage:
 *   node skills/sunnyside-components/scripts/anatomy-sheet.mjs --slug <slug> --component card [--motion] [--out <path>]
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

if (has('help') || !args.length) {
  console.log(`
Apple-Style Dimensional Anatomy Generator
Usage:
  node anatomy-sheet.mjs --slug <slug> [--component card|dialog|button|field] [--motion] [--out <path>] [--dry-run] [--root .]
`)
  process.exit(0)
}

const root = resolve(flag('root', '.'))
const slug = flag('slug', '').toLowerCase()
const component = flag('component', 'card').toLowerCase()
const withMotion = has('motion')
const dryRun = has('dry-run')

if (!slug) {
  console.error('anatomy-sheet: --slug <slug> is required.')
  process.exit(1)
}

// Find tokens
const candidateTokens = [
  join(root, 'features', slug, 'tokens.json'),
  join(root, 'features', 'design-system', 'tokens.json'),
  join(root, 'public', 'brand', slug, 'tokens.json'),
]
const tokenPath = candidateTokens.find(existsSync)
if (!tokenPath) {
  console.error(`anatomy-sheet: tokens.json not found for slug "${slug}"`)
  process.exit(1)
}

const tokens = JSON.parse(await readFile(tokenPath, 'utf8'))
const meta = tokens.meta || {}
const brandName = meta.name || slug
const ns = meta.namespace || `--${slug.slice(0, 2)}-`

const defaultOut = join(root, 'public', 'brand', slug, `${component}-anatomy.html`)
const outFile = resolve(root, flag('out', defaultOut))

// Resolve token colors
const prims = tokens.primitives || []
const ground = prims[0]?.value || '#0C0D12'
const plate = prims[1]?.value || '#161822'
const ink = prims[2]?.value || '#FFFFFF'
const accent = prims.find((p) => /accent|signal|terracotta|cobalt/i.test(p.name))?.value || '#D84B2A'
const line = 'rgba(255, 255, 255, 0.15)'
const cyan = '#4FD1C5'

console.log(`  ⚡ Generating Apple-style Dimensional Anatomy for ${brandName} · Component: ${component}`)

const sheetHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} · ${component.toUpperCase()} — Technical Dimensional Spec</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090A0F;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Geist", sans-serif;
      display: grid;
      place-items: center;
      min-height: 100vh;
      padding: 24px;
      overflow-x: hidden;
    }
    .sheetContainer {
      width: 1700px;
      height: 1060px;
      background: #0D0E15;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
      position: relative;
      overflow: hidden;
    }
    svg.specCanvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    .gridText {
      font-family: "SF Mono", "Geist Mono", "DM Mono", monospace;
      font-size: 11px;
      fill: rgba(255, 255, 255, 0.45);
      letter-spacing: 0.05em;
    }
    .formulaText {
      font-family: "SF Mono", "Geist Mono", monospace;
      font-size: 12px;
      fill: #4FD1C5;
      font-weight: 500;
    }
    .dimLabel {
      font-family: "SF Mono", monospace;
      font-size: 10.5px;
      fill: #F6AD55;
      font-weight: 600;
    }
    .tagHug {
      font-family: "SF Mono", monospace;
      font-size: 9px;
      fill: #68D391;
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    ${withMotion ? `
    .timelineControls {
      position: absolute;
      bottom: 24px;
      left: 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(20, 22, 32, 0.85);
      backdrop-filter: blur(16px);
      padding: 10px 20px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      z-index: 10;
    }
    .timelineBtn {
      background: #4FD1C5;
      color: #000;
      border: none;
      padding: 6px 14px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
    }
    .timelineSlider {
      width: 280px;
      accent-color: #4FD1C5;
      cursor: pointer;
    }
    ` : ''}
  </style>
</head>
<body>

<div class="sheetContainer" id="sheet">
  <svg class="specCanvas" viewBox="0 0 1700 1060" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Engineering grid pattern -->
      <pattern id="subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
      </pattern>
      <pattern id="majgrid" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#subgrid)"/>
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/>
        <circle cx="0" cy="0" r="1.5" fill="rgba(79, 209, 197, 0.4)"/>
      </pattern>
      <!-- Dimension Arrowheads -->
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 2 L 8 5 L 0 8 z" fill="#F6AD55"/>
      </marker>
      <marker id="tick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <line x1="2" y1="0" x2="8" y2="10" stroke="#F6AD55" stroke-width="1.5"/>
      </marker>
    </defs>

    <!-- Background Grid -->
    <rect width="1700" height="1060" fill="url(#majgrid)"/>

    <!-- Sheet Border -->
    <rect x="24" y="24" width="1652" height="1012" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <rect x="28" y="28" width="1644" height="1004" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>

    <!-- Top Engineering Header Block -->
    <g transform="translate(48, 64)">
      <text class="gridText" x="0" y="0">SPECIFICATION NO: DWG-${slug.toUpperCase()}-001</text>
      <text class="gridText" x="0" y="18">SUBJECT: ${brandName.toUpperCase()} · ${component.toUpperCase()} COMPONENT ARCHITECTURE</text>
      <text class="gridText" x="0" y="36">STANDARDS: ISO 128-20 / WCAG 2.1 AA / APPLE HIG</text>
    </g>

    <!-- =================================================================== -->
    <!-- VIEW A: PLAN VIEW WITH S# SPACING & H# HEIGHT CHAINS                 -->
    <!-- =================================================================== -->
    <g id="planView" transform="translate(100, 160)">
      <text class="gridText" x="0" y="-20" font-weight="700" fill="#FFF">FIG 1.0 · ORTHOGRAPHIC PLAN VIEW &amp; CONCENTRIC RADII</text>
      
      <!-- Outer Component Chassis (R1 outer radius) -->
      <rect id="chassis" x="0" y="0" width="560" height="380" rx="20" fill="#141722" stroke="#4FD1C5" stroke-width="1.5"/>
      
      <!-- Inset Plate (R2 concentric radius: R2 = R1 - padding) -->
      <rect id="insetPlate" x="24" y="24" width="512" height="332" rx="12" fill="#1C1F2E" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

      <!-- Slots / Elements -->
      <!-- Header slot -->
      <rect x="48" y="48" width="280" height="28" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 2"/>
      <text class="tagHug" x="54" y="66">SLOT [HEADER] · HUG</text>
      
      <!-- Body slot -->
      <rect x="48" y="96" width="464" height="160" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" stroke-dasharray="4 2"/>
      <text class="tagHug" x="54" y="114">SLOT [BODY CONTENT] · FLEX: 1 1 AUTO</text>

      <!-- Action Button (R3 radius) -->
      <rect x="368" y="280" width="144" height="44" rx="8" fill="${accent}"/>
      <text class="tagHug" x="384" y="306" fill="#FFF">ACTION [HUG]</text>

      <!-- Redline Dimension Lines -->
      <!-- H1 Height Dimension Chain -->
      <g stroke="#F6AD55" stroke-width="1">
        <line x1="-30" y1="0" x2="-30" y2="380" marker-start="url(#tick)" marker-end="url(#tick)"/>
        <line x1="-40" y1="0" x2="-10" y2="0"/>
        <line x1="-40" y1="380" x2="-10" y2="380"/>
        <text class="dimLabel" x="-110" y="195">H1 = 380px</text>

        <!-- S1 Padding Extension -->
        <line x1="575" y1="0" x2="575" y2="24" marker-start="url(#tick)" marker-end="url(#tick)"/>
        <text class="dimLabel" x="585" y="16">S1 = 24px</text>

        <!-- W1 Width Dimension Chain -->
        <line x1="0" y1="400" x2="560" y2="400" marker-start="url(#tick)" marker-end="url(#tick)"/>
        <line x1="0" y1="390" x2="0" y2="415"/>
        <line x1="560" y1="390" x2="560" y2="415"/>
        <text class="dimLabel" x="240" y="425">W1 = 560px [FILL / CLAMP]</text>
      </g>

      <!-- Radius Callouts -->
      <path d="M 545 10 L 600 -20 L 640 -20" fill="none" stroke="#4FD1C5" stroke-width="1"/>
      <text class="formulaText" x="645" y="-16">R1 = 20px (Outer squircle)</text>

      <path d="M 525 35 L 580 5 L 640 5" fill="none" stroke="#4FD1C5" stroke-width="1"/>
      <text class="formulaText" x="645" y="9">R2 = R1 − B − S6 = 12px (Concentric)</text>
    </g>

    <!-- =================================================================== -->
    <!-- VIEW B: EXPLODED AXONOMETRIC 2.5D LAYER STACK                        -->
    <!-- =================================================================== -->
    <g id="axonView" transform="translate(1080, 220)">
      <text class="gridText" x="-80" y="-80" font-weight="700" fill="#FFF">FIG 2.0 · EXPLODED AXONOMETRIC LAYER STACK · matrix(0.94, 0.17, -0.34, 0.47, tx, ty-z)</text>
      
      <!-- Layer 1: Page Canvas -->
      <g id="layer0" transform="matrix(0.94 0.17 -0.34 0.47 0 160)">
        <rect width="440" height="280" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-dasharray="6 4"/>
      </g>
      <text class="gridText" x="380" y="240">L0: Page Canvas (${ground})</text>

      <!-- Layer 2: Drop Shadow & Scrim Envelope (E1, E2, E3) -->
      <g id="layer1" transform="matrix(0.94 0.17 -0.34 0.47 0 100)">
        <rect width="440" height="280" rx="20" fill="rgba(0,0,0,0.5)" filter="blur(8px)"/>
      </g>
      <text class="gridText" x="380" y="170">L1: Shadow Envelope E1/E2/E3 (0 24px 48px rgba(0,0,0,0.24))</text>

      <!-- Layer 3: Component Chassis Container -->
      <g id="layer2" transform="matrix(0.94 0.17 -0.34 0.47 0 40)">
        <rect width="440" height="280" rx="20" fill="#141722" stroke="#4FD1C5" stroke-width="1.5"/>
      </g>
      <text class="gridText" x="380" y="90">L2: Container Plate (R1=20px)</text>

      <!-- Layer 4: Inset Content Plate -->
      <g id="layer3" transform="matrix(0.94 0.17 -0.34 0.47 0 -20)">
        <rect x="20" y="20" width="400" height="240" rx="12" fill="#1C1F2E" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      </g>
      <text class="gridText" x="380" y="10">L3: Inset Plate (R2 = R1 − B − S6 = 12px)</text>

      <!-- Layer 5: Controls & Actions -->
      <g id="layer4" transform="matrix(0.94 0.17 -0.34 0.47 0 -80)">
        <rect x="280" y="190" width="120" height="38" rx="8" fill="${accent}"/>
        <rect x="40" y="40" width="200" height="20" rx="4" fill="rgba(255,255,255,0.4)"/>
      </g>
      <text class="gridText" x="380" y="-70">L4: Slots (HUG / FLEX / FILL) &amp; Controls</text>
    </g>

    <!-- =================================================================== -->
    <!-- CLOSED-FORM FORMULAS & VARIABLE TABLE (BOTTOM LEFT)                  -->
    <!-- =================================================================== -->
    <g transform="translate(80, 720)">
      <rect width="840" height="260" rx="8" fill="#11131C" stroke="rgba(255,255,255,0.1)"/>
      <text class="gridText" x="24" y="32" font-weight="700" fill="#FFF">TECHNICAL VARIABLE SPECIFICATION</text>
      
      <text class="formulaText" x="24" y="68">H1_total   = 2 · S1 + H3                                [380px]</text>
      <text class="formulaText" x="24" y="96">R2_inner   = R1 − B − S6                                [12px = 20px − 1px − 7px]</text>
      <text class="formulaText" x="24" y="124">R3_action  = max(4px, R2_inner − 4px)                   [8px]</text>
      <text class="formulaText" x="24" y="152">Envelope   = E1 (0 2px 4px), E2 (0 12px 24px), E3 (0 24px 48px)</text>
      <text class="formulaText" x="24" y="180">Motion(t)  = 140ms cubic-bezier(0.22, 1, 0.36, 1)       [Active press: scale(0.97)]</text>
      <text class="formulaText" x="24" y="208">FocusRing  = 2px solid ${cyan} offset 2px               [Contrast &gt;= 3:1]</text>
    </g>

    <!-- =================================================================== -->
    <!-- TITLE BLOCK (BOTTOM RIGHT)                                          -->
    <!-- =================================================================== -->
    <g transform="translate(1180, 720)">
      <rect width="480" height="260" rx="6" fill="#11131C" stroke="rgba(255,255,255,0.15)"/>
      <!-- Internal Title Block Grid -->
      <line x1="0" y1="50" x2="480" y2="50" stroke="rgba(255,255,255,0.1)"/>
      <line x1="0" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.1)"/>
      <line x1="0" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.1)"/>
      <line x1="240" y1="180" x2="240" y2="260" stroke="rgba(255,255,255,0.1)"/>

      <text class="gridText" x="16" y="32">DWG NO: DWG-${slug.toUpperCase()}-001 · BRAND: ${brandName.toUpperCase()}</text>
      <text class="gridText" x="16" y="82">SYSTEM: SUNNYSIDE DESIGN SYSTEM v6.0 · UNITS: PX</text>
      <text class="gridText" x="16" y="132" font-size="14px" font-weight="700" fill="#FFF">COMPONENT: ${component.toUpperCase()}</text>
      <text class="gridText" x="16" y="156">DIMENSIONAL DRAWING &amp; MOTION BREAKDOWN</text>
      
      <text class="gridText" x="16" y="210">REV: 6.0.0</text>
      <text class="gridText" x="16" y="235">SCALE: 1:1 @ 1700×1060 · UNITS: PX</text>
      <text class="gridText" x="256" y="210">STATUS: APPROVED FOR PROD</text>
      <text class="gridText" x="256" y="235">DATE: ${new Date().toISOString().slice(0, 10)}</text>
    </g>
  </svg>

  ${withMotion ? `
  <div class="timelineControls">
    <button class="timelineBtn" id="playBtn">Pause</button>
    <input type="range" min="0" max="100" value="0" class="timelineSlider" id="scrubber">
    <span class="gridText" id="timeLabel">0.00s / 10.00s</span>
  </div>
  ` : ''}
</div>

${withMotion ? `
<script>
  let isPlaying = true;
  let progress = 0; // 0 to 1
  const duration = 10000; // 10 seconds
  let lastTime = performance.now();

  const playBtn = document.getElementById('playBtn');
  const scrubber = document.getElementById('scrubber');
  const timeLabel = document.getElementById('timeLabel');
  const svgCanvas = document.querySelector('svg.specCanvas');

  const l0 = document.getElementById('layer0');
  const l1 = document.getElementById('layer1');
  const l2 = document.getElementById('layer2');
  const l3 = document.getElementById('layer3');
  const l4 = document.getElementById('layer4');

  function render(t) {
    // Pure time function: t is 0..1
    // 1. Stroke draw in on chassis (strokeDashoffset: 1 -> 0)
    const chassis = document.getElementById('chassis');
    if (chassis) {
      chassis.style.strokeDasharray = '2000';
      chassis.style.strokeDashoffset = String(Math.max(0, (1 - t * 2.5) * 2000));
    }

    // 2. Camera log-zoom from 4.2x header close-up to 1.0x full sheet
    const zoomPhase = Math.min(1, Math.max(0, (t - 0.15) / 0.55));
    const easeOut = 1 - Math.pow(1 - zoomPhase, 3);
    const zoom = 4.2 * Math.pow(1 / 4.2, easeOut);
    if (svgCanvas) {
      const vw = 1700 / zoom;
      const vh = 1060 / zoom;
      const vx = (1 - easeOut) * 80;
      const vy = (1 - easeOut) * 120;
      svgCanvas.setAttribute('viewBox', vx.toFixed(1) + ' ' + vy.toFixed(1) + ' ' + vw.toFixed(1) + ' ' + vh.toFixed(1));
    }

    // 3. Axonometric layer lift explosion
    const lift = Math.min(1, Math.max(0, (t - 0.3) * 1.6));
    l0.setAttribute('transform', 'matrix(0.94 0.17 -0.34 0.47 0 ' + (160 + (1 - lift) * -160) + ')');
    l1.setAttribute('transform', 'matrix(0.94 0.17 -0.34 0.47 0 ' + (100 + (1 - lift) * -100) + ')');
    l2.setAttribute('transform', 'matrix(0.94 0.17 -0.34 0.47 0 ' + (40 + (1 - lift) * -40) + ')');
    l3.setAttribute('transform', 'matrix(0.94 0.17 -0.34 0.47 0 ' + (-20 + (1 - lift) * 20) + ')');
    l4.setAttribute('transform', 'matrix(0.94 0.17 -0.34 0.47 0 ' + (-80 + (1 - lift) * 80) + ')');

    scrubber.value = String(t * 100);
    timeLabel.textContent = (t * 10).toFixed(2) + 's / 10.00s';
  }

  function loop(now) {
    if (isPlaying) {
      const delta = now - lastTime;
      progress = (progress + delta / duration) % 1;
      render(progress);
    }
    lastTime = now;
    requestAnimationFrame(loop);
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? 'Pause' : 'Play';
  });

  scrubber.addEventListener('input', (e) => {
    isPlaying = false;
    playBtn.textContent = 'Play';
    progress = Number(e.target.value) / 100;
    render(progress);
  });

  requestAnimationFrame(loop);
</script>
` : ''}

</body>
</html>
`

if (!dryRun) {
  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, sheetHtml, 'utf8')
  const svgMatch = sheetHtml.match(/<svg class="specCanvas"[\s\S]*?<\/svg>/)
  if (svgMatch) {
    const svgOutFile = outFile.replace(/\.html$/i, '.svg')
    await writeFile(svgOutFile, svgMatch[0] + '\n', 'utf8')
  }
  console.log(`  ✓ Written Apple-style dimensional spec sheet → ${outFile}`)
} else {
  console.log(`  ✓ Dry-run: validated parameters for ${component} anatomy spec sheet.`)
}
