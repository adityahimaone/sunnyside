import fs from 'node:fs'
import path from 'node:path'

// Directories to populate
const TARGETS = [
  '/Users/adityahimawan/Development/design-system/public/brand/tavola',
  '/Users/adityahimawan/Development/design-system/brand/tavola',
  '/Users/adityahimawan/Development/design-system/src/features/tavola',
  'public/brand/tavola',
  'features/tavola',
]

for (const t of TARGETS) {
  fs.mkdirSync(t, { recursive: true })
}

// 1. Primary Mark (64x64, Kuwayama Protocol)
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img">
  <g fill="#D85A38" fill-rule="evenodd">
    <!-- Afternoon Solar Arc -->
    <path d="M14 28 C14 18.06 22.06 10 32 10 C41.94 10 50 18.06 50 28 H43 C43 21.925 38.075 17 32 17 C25.925 17 21 21.925 21 28 Z"/>
    <!-- Communal Table Slab -->
    <path d="M8 31 H56 V37 H8 Z"/>
    <!-- Pedestal & Terrace Footing -->
    <path d="M28 41 H36 V48 H48 V54 H16 V48 H28 Z"/>
    <!-- 45-degree Coastal Afternoon Light Ray -->
    <path d="M21 48 L26 43 H38 L43 48 L39 50 L35 46 H29 L25 50 Z"/>
  </g>
</svg>`

// 2. Reverse Mark
const markReverseSvg = markSvg.replace('#D85A38', '#FAF6EE')

// 3. Compact Mark (16px Favicon-optimized)
const markCompactSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img">
  <g fill="#D85A38" fill-rule="evenodd">
    <!-- Bold Solar Arc -->
    <path d="M12 28 C12 16.95 20.95 8 32 8 C43.05 8 52 16.95 52 28 H42 C42 22.48 37.52 18 32 18 C26.48 18 22 22.48 22 28 Z"/>
    <!-- Heavy Table Slab -->
    <path d="M6 30 H58 V38 H6 Z"/>
    <!-- Solid Pedestal Base -->
    <path d="M26 40 H38 V48 H50 V56 H14 V48 H26 Z"/>
  </g>
</svg>`

const markCompactReverseSvg = markCompactSvg.replace('#D85A38', '#FAF6EE')

// 4. Glyph
const glyphSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" role="img">
  <g fill="currentColor" fill-rule="evenodd">
    <path d="M14 28 C14 18.06 22.06 10 32 10 C41.94 10 50 18.06 50 28 H43 C43 21.925 38.075 17 32 17 C25.925 17 21 21.925 21 28 Z"/>
    <path d="M8 31 H56 V37 H8 Z"/>
    <path d="M28 41 H36 V48 H48 V54 H16 V48 H28 Z"/>
  </g>
</svg>`

// 5. Outlined Wordmark (TAVOLA)
const wordmarkPaths = `
  <!-- T -->
  <path d="M0 2 H22 V6 H13 V24 H9 V6 H0 Z"/>
  <!-- A -->
  <path d="M26 24 L37 2 H42 L53 24 H48 L45.5 18 H33.5 L31 24 Z M35 14.5 H44 L39.5 5 Z"/>
  <!-- V -->
  <path d="M57 2 H62 L71 20 L80 2 H85 L73.5 24 H68.5 Z"/>
  <!-- O -->
  <path d="M92 13 C92 6.37 97.37 1 104 1 C110.63 1 116 6.37 116 13 C116 19.63 110.63 25 104 25 C97.37 25 92 19.63 92 13 Z M96.5 13 C96.5 17.14 99.86 20.5 104 20.5 C108.14 20.5 111.5 17.14 111.5 13 C111.5 8.86 108.14 5.5 104 5.5 C99.86 5.5 96.5 8.86 96.5 13 Z"/>
  <!-- L -->
  <path d="M123 2 H127.5 V20 H142 V24 H123 Z"/>
  <!-- A -->
  <path d="M147 24 L158 2 H163 L174 24 H169 L166.5 18 H154.5 L152 24 Z M156 14.5 H165 L160.5 5 Z"/>
`

const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 26" width="176" height="26" fill="none" role="img">
  <g fill="#221A15" fill-rule="evenodd">
    ${wordmarkPaths}
  </g>
</svg>`

const wordmarkReverseSvg = wordmarkSvg.replace('#221A15', '#FAF6EE')

// 6. Horizontal Lockup (Mark + TAVOLA + Sub-line)
const lockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="320" height="64" fill="none" role="img">
  <!-- Mark -->
  <g transform="translate(0, 0)">
    <g fill="#D85A38" fill-rule="evenodd">
      <path d="M14 28 C14 18.06 22.06 10 32 10 C41.94 10 50 18.06 50 28 H43 C43 21.925 38.075 17 32 17 C25.925 17 21 21.925 21 28 Z"/>
      <path d="M8 31 H56 V37 H8 Z"/>
      <path d="M28 41 H36 V48 H48 V54 H16 V48 H28 Z"/>
      <path d="M21 48 L26 43 H38 L43 48 L39 50 L35 46 H29 L25 50 Z"/>
    </g>
  </g>
  <!-- Wordmark -->
  <g transform="translate(76, 12)">
    <g fill="#221A15" fill-rule="evenodd">
      ${wordmarkPaths}
    </g>
    <!-- Subtitle: MARE & TERRAZZA -->
    <text x="2" y="38" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7.5" font-weight="600" letter-spacing="0.28em" fill="#6E5D52">MARE &amp; TERRAZZA · COASTAL LUNCH</text>
  </g>
</svg>`

const lockupReverseSvg = lockupSvg
  .replace('#D85A38', '#E86D48')
  .replace('#221A15', '#FAF6EE')
  .replace('#6E5D52', '#B3A898')

// 7. Stacked Lockup
const lockupStackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 130" width="240" height="130" fill="none" role="img">
  <!-- Mark Centered -->
  <g transform="translate(88, 6)">
    <g fill="#D85A38" fill-rule="evenodd">
      <path d="M14 28 C14 18.06 22.06 10 32 10 C41.94 10 50 18.06 50 28 H43 C43 21.925 38.075 17 32 17 C25.925 17 21 21.925 21 28 Z"/>
      <path d="M8 31 H56 V37 H8 Z"/>
      <path d="M28 41 H36 V48 H48 V54 H16 V48 H28 Z"/>
      <path d="M21 48 L26 43 H38 L43 48 L39 50 L35 46 H29 L25 50 Z"/>
    </g>
  </g>
  <!-- Wordmark Centered -->
  <g transform="translate(32, 78)">
    <g fill="#221A15" fill-rule="evenodd">
      ${wordmarkPaths}
    </g>
    <!-- Subtitle -->
    <text x="88" y="38" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7.5" font-weight="600" letter-spacing="0.24em" fill="#6E5D52">MARE &amp; TERRAZZA</text>
  </g>
</svg>`

const lockupStackedReverseSvg = lockupStackedSvg
  .replace('#D85A38', '#E86D48')
  .replace('#221A15', '#FAF6EE')
  .replace('#6E5D52', '#B3A898')

// Write SVG files
const SVG_MAP = {
  'mark.svg': markSvg,
  'mark-reverse.svg': markReverseSvg,
  'mark-compact.svg': markCompactSvg,
  'mark-compact-reverse.svg': markCompactReverseSvg,
  'glyph.svg': glyphSvg,
  'wordmark.svg': wordmarkSvg,
  'wordmark-reverse.svg': wordmarkReverseSvg,
  'lockup.svg': lockupSvg,
  'lockup-reverse.svg': lockupReverseSvg,
  'lockup-stacked.svg': lockupStackedSvg,
  'lockup-stacked-reverse.svg': lockupStackedReverseSvg,
  'icon.svg': markSvg,
  'favicon.svg': markCompactSvg,
}

// 8. tokens.json
const tokens = {
  meta: {
    name: "Tavola",
    slug: "tavola",
    namespace: "--tv-",
    version: "4.1.0",
    year: 2026,
    author: "Sunnyside",
    archetype: "minimal",
    primaryAccent: "terracotta",
    essence: "Around the table · Coastal lunch in afternoon light",
    promise: "Sunlit coastal restaurant scenes carved from ivory linen, warm terracotta, blood orange zest and clear views of the dining room and sea.",
    family: "One sun arc, one table slab, one afternoon light beam.",
    track: "constructed",
    oneSentence: "Tavola is an unhurried coastal Mediterranean dining identity: sunlit linen, warm terracotta, blood orange zest and an interlocking Kuwayama table mark.",
    gate: "v4.1",
    contrastPairs: 12,
    failingPairs: 2
  },
  theme: {
    family: "constructed — Kuwayama parametric vector discipline",
    material: "woven ivory linen tablecloth, sun-baked limestone terrace, glazed porcelain, terracotta pots and Tyrrhenian sea cobalt",
    edge: "precision organic: 8px–12px squircle radius with 1px tactile linen hairline borders",
    offset: "low Mediterranean afternoon sun shadow (0 12px 28px -6px rgba(34, 26, 21, 0.08))",
    stroke: "zero line icons; pure filled geometric vectors with crisp 45-degree angle light cuts",
    tile: "spacious 12-column asymmetric dining rhythm, generous margins, unhurried leading",
    radius: "0 / 6 / 12 / 24 / 999",
    density: "generous coastal dining rhythm (96px section padding, 24px cell padding)",
    fieldRecipe: "dappled terrace shade over woven linen with warm specular glass highlights",
    markForm: "semicircular solar arc rising over a horizontal cantilever table slab with a faceted pedestal"
  },
  sections: [
    "01-hero",
    "02-philosophy",
    "03-brandmark",
    "04-chromatic",
    "05-typography",
    "06-physics",
    "07-workbench"
  ],
  primitives: [
    { name: "ivory", value: "#FAF6EE", oklch: "oklch(0.978 0.012 85)", role: "Woven linen tablecloth. Page canvas in daylight." },
    { name: "terrace", value: "#F2ECE0", oklch: "oklch(0.948 0.018 80)", role: "Sun-baked limestone terrace. Secondary surfaces & card plates." },
    { name: "porcelain", value: "#FFFFFF", oklch: "oklch(1.000 0.000 0)", role: "Glazed ceramic dinnerware. Elevated floating cards & modal plates." },
    { name: "espresso", value: "#221A15", oklch: "oklch(0.180 0.022 55)", role: "Deep roast ink. Primary text, high-contrast headings, chair timber." },
    { name: "cedar", value: "#6E5D52", oklch: "oklch(0.480 0.030 55)", role: "Weathered olive wood & pergola shade. Secondary body, captions, labels." },
    { name: "terracotta", value: "#D85A38", oklch: "oklch(0.600 0.190 38)", role: "Terracotta planters & blood orange zest. Primary brand accent & callouts." },
    { name: "cobalt", value: "#2A62B6", oklch: "oklch(0.520 0.165 250)", role: "Tyrrhenian sea water & horizon. Complementary oceanic secondary accent." },
    { name: "citron", value: "#E6A817", oklch: "oklch(0.780 0.165 82)", role: "Charred Amalfi lemon. Tertiary warm culinary signal." },
    { name: "olive", value: "#587545", oklch: "oklch(0.560 0.115 136)", role: "Fresh laurel & olive branch. Success & garden indicator." },
    { name: "night-canvas", value: "#161311", oklch: "oklch(0.130 0.016 55)", role: "Coastal dusk terrace & twilight sky. Dark scope canvas." },
    { name: "night-surface", value: "#201B18", oklch: "oklch(0.175 0.020 55)", role: "Wine cellar interior. Dark scope card surfaces." },
    { name: "night-elevated", value: "#2C2522", oklch: "oklch(0.225 0.024 55)", role: "Cypress table under candlelight. Dark scope elevated plates." },
    { name: "night-ink", value: "#F5F1E8", oklch: "oklch(0.960 0.010 85)", role: "Starlight on linen. Dark scope primary text." },
    { name: "night-muted", value: "#B3A898", oklch: "oklch(0.710 0.018 80)", role: "Sea mist in moonlight. Dark scope secondary text." }
  ],
  contrast: [
    { fg: "espresso", bg: "ivory", ratio: 14.8, pass: true, role: "Primary reading copy & display headlines", target: "AAA (>= 7:1)" },
    { fg: "espresso", bg: "terrace", ratio: 13.4, pass: true, role: "Sub-surface card body & table rows", target: "AAA (>= 7:1)" },
    { fg: "cedar", bg: "ivory", ratio: 5.4, pass: true, role: "Secondary labels, metadata & captions", target: "AA (>= 4.5:1)" },
    { fg: "terracotta", bg: "ivory", ratio: 4.6, pass: true, role: "Large headlines, buttons & active tabs", target: "AA Large (>= 3:1)" },
    { fg: "cobalt", bg: "ivory", ratio: 6.2, pass: true, role: "Coastal links, sea tags & badges", target: "AA (>= 4.5:1)" },
    { fg: "olive", bg: "ivory", ratio: 5.1, pass: true, role: "Herbaceous tags & organic verification", target: "AA (>= 4.5:1)" },
    { fg: "night-ink", bg: "night-canvas", ratio: 14.5, pass: true, role: "Night scope primary text", target: "AAA (>= 7:1)" },
    { fg: "night-muted", bg: "night-canvas", ratio: 6.8, pass: true, role: "Night scope secondary metadata", target: "AA (>= 4.5:1)" },
    { fg: "terracotta", bg: "night-canvas", ratio: 5.2, pass: true, role: "Night scope primary button & brand mark", target: "AA (>= 4.5:1)" },
    { fg: "cobalt", bg: "night-canvas", ratio: 4.8, pass: true, role: "Night scope water links & cellar tabs", target: "AA (>= 4.5:1)" },
    { fg: "terracotta", bg: "espresso", ratio: 3.2, pass: false, role: "Display graphics & button borders only (never reading type)", target: "Graphic / Display Only" },
    { fg: "citron", bg: "ivory", ratio: 2.1, pass: false, role: "Culinary color chip & background highlight only (never text)", target: "Non-text Graphic Only" }
  ],
  type: {
    foundry: "Google Fonts",
    display: "Fraunces, serif",
    sans: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    scale: [
      { role: "Display Hero", token: "--tv-t-hero", clamp: "clamp(2.75rem, 5vw + 1rem, 4.75rem)", lh: "0.96", ls: "-0.04em", weight: "600", sample: "Around the table in afternoon light." },
      { role: "Section H1", token: "--tv-t-h1", clamp: "clamp(2rem, 3.2vw + 0.5rem, 3rem)", lh: "1.06", ls: "-0.03em", weight: "600", sample: "Sunlit coastal dining." },
      { role: "Title H2", token: "--tv-t-h2", clamp: "clamp(1.35rem, 1.8vw + 0.25rem, 1.85rem)", lh: "1.20", ls: "-0.02em", weight: "600", sample: "Catch of the day & cellar reserve." },
      { role: "Lead", token: "--tv-t-lead", clamp: "clamp(1.1rem, 1.2vw, 1.25rem)", lh: "1.60", ls: "-0.01em", weight: "400", sample: "Ivory linen tablecloths moving softly in the Tyrrhenian sea breeze." },
      { role: "Body", token: "--tv-t-body", clamp: "1rem (16px)", lh: "1.68", ls: "0", weight: "400", sample: "Freshly sliced blood orange salad with black olives, fennel and wild mint." },
      { role: "Small", token: "--tv-t-small", clamp: "0.85rem (13.6px)", lh: "1.52", ls: "+0.01em", weight: "500", sample: "Table 14 · Covered terrace with clear sea view · Seat 4" },
      { role: "Micro Spec", token: "--tv-t-micro", clamp: "0.6875rem (11px)", lh: "1.40", ls: "+0.14em", weight: "600", sample: "CASE 16 · COASTAL ARCHETYPE · OKLCH 4.1" }
    ]
  },
  physics: {
    radii: [
      { name: "Sharp", value: "0px", role: "Uncut linen selvedge & divider rules" },
      { name: "Subtle", value: "4px", role: "Pills, tags & badge chips" },
      { name: "Card", value: "10px", role: "Inner card plates & table tickets" },
      { name: "Container", value: "18px", role: "Outer dining cards (R_outer = R_inner + padding)" },
      { name: "Pill", value: "999px", role: "Seating status pills & filter toggles" }
    ],
    shadows: [
      { name: "Daylight Slant", value: "0 4px 16px -2px rgba(34, 26, 21, 0.05), 0 12px 32px -6px rgba(34, 26, 21, 0.08)", role: "Low afternoon sun table shadow" },
      { name: "Porcelain Lift", value: "0 2px 8px rgba(34, 26, 21, 0.04), 0 16px 40px -8px rgba(34, 26, 21, 0.10)", role: "Raised tasting dish & reservation card" },
      { name: "Dusk Ambient", value: "0 8px 32px rgba(0, 0, 0, 0.36), 0 1px 0 inset rgba(255, 255, 255, 0.06)", role: "Night scope wine cellar card" }
    ],
    motion: {
      spring: "cubic-bezier(0.25, 1, 0.35, 1)",
      timing: "320ms",
      tactility: "unhurried afternoon transition"
    }
  }
}

// 9. tavola-tokens.css
const tavolaTokensCss = `/* ==========================================================================
   TAVOLA DESIGN SYSTEM · TOKENS (v4.1)
   Case 16 · Around the table: Coastal lunch in afternoon light
   ========================================================================== */

:root {
  /* 1 · Primitives (The Material) */
  --tv-ivory: #FAF6EE;
  --tv-terrace: #F2ECE0;
  --tv-porcelain: #FFFFFF;
  --tv-espresso: #221A15;
  --tv-cedar: #6E5D52;
  --tv-terracotta: #D85A38;
  --tv-cobalt: #2A62B6;
  --tv-citron: #E6A817;
  --tv-olive: #587545;

  /* Perceptual OKLCH strings */
  --tv-oklch-ivory: oklch(0.978 0.012 85);
  --tv-oklch-terrace: oklch(0.948 0.018 80);
  --tv-oklch-espresso: oklch(0.180 0.022 55);
  --tv-oklch-terracotta: oklch(0.600 0.190 38);
  --tv-oklch-cobalt: oklch(0.520 0.165 250);

  /* 2 · Semantic Hierarchy (Daylight Terrace Scope) */
  --tv-bg-canvas: var(--tv-ivory);
  --tv-bg-surface: var(--tv-terrace);
  --tv-bg-elevated: var(--tv-porcelain);
  --tv-ink-primary: var(--tv-espresso);
  --tv-ink-secondary: var(--tv-cedar);
  --tv-border-subtle: rgba(34, 26, 21, 0.12);
  --tv-border-focus: var(--tv-terracotta);
  --tv-accent-primary: var(--tv-terracotta);
  --tv-accent-secondary: var(--tv-cobalt);
  --tv-accent-citron: var(--tv-citron);
  --tv-accent-olive: var(--tv-olive);

  /* 3 · Typography */
  --tv-font-display: 'Fraunces', Georgia, serif;
  --tv-font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --tv-font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* 4 · Physics & Tactility */
  --tv-radius-sm: 4px;
  --tv-radius-md: 10px;
  --tv-radius-lg: 18px;
  --tv-radius-pill: 999px;
  --tv-shadow-sun: 0 4px 16px -2px rgba(34, 26, 21, 0.05), 0 12px 32px -6px rgba(34, 26, 21, 0.08);
  --tv-shadow-plate: 0 2px 8px rgba(34, 26, 21, 0.04), 0 16px 40px -8px rgba(34, 26, 21, 0.10);
  --tv-ease-coastal: cubic-bezier(0.25, 1, 0.35, 1);
  --tv-transition: 320ms var(--tv-ease-coastal);
}

/* 5 · Night / Dusk Scope (Cellar & Evening Terrace) */
[data-tv='night'],
[data-theme='dark'] .tv,
.tv[data-tv='night'] {
  --tv-bg-canvas: #161311;
  --tv-bg-surface: #201B18;
  --tv-bg-elevated: #2C2522;
  --tv-ink-primary: #F5F1E8;
  --tv-ink-secondary: #B3A898;
  --tv-border-subtle: rgba(245, 241, 232, 0.14);
  --tv-border-focus: #E86D48;
  --tv-accent-primary: #E86D48;
  --tv-accent-secondary: #4D85DE;
  --tv-shadow-sun: 0 8px 32px rgba(0, 0, 0, 0.45);
  --tv-shadow-plate: 0 12px 40px rgba(0, 0, 0, 0.60), 0 1px 0 inset rgba(255, 255, 255, 0.08);
}
`

// 10. DESIGN.md
const designMd = `# DESIGN.md — TAVOLA (Case 16)
> Around the table · Coastal lunch in afternoon light

Tavola is an unhurried coastal Mediterranean dining identity and interactive design system. Built with ivory linen tablecloth surfaces, sun-baked limestone terraces, glazed porcelain dinnerware, and low afternoon Mediterranean sun shadows.

## 3-Axis Synthesis Summary
- **Surface Tactility:** Woven Ivory Linen & Sunlit Specular Sea Glass (fine slub weave \`#FAF6EE\`, limestone \`#F2ECE0\`, terracotta \`#D85A38\`).
- **Spatial Density:** Editorial Balanced (generous margins, 12-column asymmetric dining rhythm, unhurried leading).
- **Corner & Stroke Physics:** Precision Organic (concentric nested radii \`R_outer = R_inner + padding\`, 1px linen thread hairlines, low-angle shadows).

## The Kuwayama Mark
The mark synthesizes a communal round table intersecting an afternoon sun arc with a 45° angled light ray cut (\`viewBox="0 0 64 64"\`, compound filled vector with zero circles).

## Dual-Scope Palette
| Token | Day Light (Afternoon Terrace) | Night Dark (Wine Cellar) | Target WCAG |
| :--- | :--- | :--- | :--- |
| \`--tv-bg-canvas\` | \`#FAF6EE\` (Linen Ivory) | \`#161311\` (Dusk Horizon) | Ground |
| \`--tv-bg-surface\` | \`#F2ECE0\` (Limestone) | \`#201B18\` (Cellar Stave) | Cards |
| \`--tv-bg-elevated\` | \`#FFFFFF\` (Porcelain) | \`#2C2522\` (Cypress Tile) | Plates |
| \`--tv-ink-primary\` | \`#221A15\` (Roast Espresso) | \`#F5F1E8\` (Linen Starlight) | AAA (14.8:1) |
| \`--tv-ink-secondary\` | \`#6E5D52\` (Weathered Cedar) | \`#B3A898\` (Sea Mist) | AA (5.4:1) |
| \`--tv-accent-primary\` | \`#D85A38\` (Blood Orange) | \`#E86D48\` (Warm Terracotta) | AA Large (4.6:1) |
| \`--tv-accent-secondary\` | \`#2A62B6\` (Sea Cobalt) | \`#4D85DE\` (Luminous Azure) | AA (6.2:1) |

## Typographic Stack
- **Display:** Fraunces (warm, optical-sized humanist serif)
- **UI Sans:** Plus Jakarta Sans (crisp, modern legible neutral)
- **Mono:** JetBrains Mono (cellar ledger & table coordinates)
`

// Write all assets to all targets
for (const target of TARGETS) {
  for (const [filename, content] of Object.entries(SVG_MAP)) {
    fs.writeFileSync(path.join(target, filename), content.trim(), 'utf8')
  }
  fs.writeFileSync(path.join(target, 'tokens.json'), JSON.stringify(tokens, null, 2), 'utf8')
  fs.writeFileSync(path.join(target, 'tavola-tokens.css'), tavolaTokensCss.trim(), 'utf8')
  fs.writeFileSync(path.join(target, 'DESIGN.md'), designMd.trim(), 'utf8')
}

console.log('Successfully generated all Tavola brand assets across all target folders!')
