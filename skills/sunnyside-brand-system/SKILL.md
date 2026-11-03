---
name: sunnyside-brand-system
version: 4.4.0
description: 'Unbounded, single-pass brand identity and interactive design system generator. Starts with an interactive Step 0 ask_question scope gate (including Vesper Per-Section Rail vs Clearing Sticky Contents Rail and 5 Flagship Hero Variants), then synthesizes custom archetypes, Kuwayama-grade parametric SVG marks + 6-mark companion casts, 6-panel 1500x1125 brandkit boards, Vesper-style comparative surface exploration grids, dual-scope OKLCH tokens, and unnumbered-hero 7-section interactive showcase pages.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '4.4.0'
---

# SUNNYSIDE BRAND SYSTEM ENGINE (v4.4 · Vesper / Clearing Rail + 5 Flagship Heroes + Surface Exploration Grid)

You are a Principal Design Engineer & Brand Architect. Execute with zero looping tasks, zero placeholder copy (`Lorem ipsum` or generic `Acme` filler), zero emoji UI chrome, and flagship-grade visual engineering (matching the bar of **Vesper**, **Clearing**, **Strand**, **Porphyry**, **Jakarta**, **Hachure**, **Riso Co.**, **Huginn**, and **Tavola**).

**One idea → one mark + cast → one 6-panel board → one non-template hero → one comparative surface grid → one honest contrast ledger.**

---

## 1. STEP 0 · INTERACTIVE SCOPE GATE (`ask_question` — Mandatory First Action)

> [!IMPORTANT]
> **MANDATORY FIRST TOOL CALL (Before running any script or writing any file):**
> Unless the user's prompt explicitly says `"skip questions"`, `"all defaults"`, or `"direct"`, you **MUST** call the **`ask_question` tool** (or `AskUserQuestion` in environments that name it that) on your **very first turn** and **STOP** to wait for the user's selection.
> - **Never** ask these questions in plain markdown text when the `ask_question` tool is available—always call `ask_question` so the interactive `/grill-me`-style selector UI renders with the built-in freeform `Other` input.
> - **Pre-fill smart recommendations:** If the user already supplied a theme, domain, or image attachments (e.g., *"Two-ink evening print"* or *"Field journal"*), tailor the `(Recommended)` first option of each question to match their theme while still letting them confirm or customize via the `ask_question` UI!
> - **Never** run scripts or create files before the user submits their `ask_question` answers.

Call `ask_question` with these 5 structured questions (users can pick any preset, combine options, or type any custom fusion in the UI's freeform option):

```json
{
  "questions": [
    {
      "question": "1. Archetype & Surface Direction — Which visual archetype and tactile surface should anchor this brand system?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Two-Ink Print / Editorial Stipple & Paper — warm uncoated stock, flat ink impressions, register ghost or ordered dither, zero glow (like Vesper, Riso Co., Huginn)",
        "Constructed Architectural & Field Journal — sharp geometric grids, mineral stone/paper surfaces, and disciplined neo-grotesque or old-style hierarchy (like Clearing, Porphyry, Hachure)",
        "Tactile Linen / Editorial Hospitality — warm woven paper/linen plates, sunlit coastal or editorial serif authority, and sea-glass panes (like Tavola, Strand)",
        "Precision SaaS / Night-First Instrument — 1px exposed hairlines, tabular data rows, and clinical dark/light cockpit clarity (like Cove, Bluewater, Ledger)",
        "Civic / Multi-Ramp Wayfinding or Prismatic Glass — bold directional color ramps, exposed structural rules, or reeded optical refraction (like Jakarta, Halation)"
      ]
    },
    {
      "question": "2. Navigation, Section Rail & Hero Architecture — Which rail layout (Hero is unnumbered; topbar links carry no numbers) and Hero variant should structure the page?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Vesper Per-Section Rail (`176px` sticky `.rail` + `.body` inside each `.sec > .wrap`) + Variant A: Vesper Split Field & Overlapping Stat Bench (`78vh` art field top, `-30px` overlapping 5-cell bench, oversized display + lede below)",
        "Clearing Sticky Contents TOC Sidebar (`.shell.layout` wrapping a scroll-spy `<ol>` rail `01..07` + content column) + Variant B: Clearing / Strand Split Editorial & Framed Media Pane (2-col editorial copy + pill badges left, framed artwork with floating lockup pane right)",
        "Vesper Per-Section Rail + Variant C: Porphyry / Hachure Live Specimen Stage First (interactive diorama, dither canvas, or printed survey margin at the top edge, followed by display title + 4-stat ledger)",
        "Clearing Sticky Contents TOC Sidebar + Variant D: Jakarta / Riso Physical Artifact & Hoarding Stage (oversized 760px watermark mark or pushpin sheet + torn polygon bottom edge + tinted panel)",
        "Vesper Per-Section Rail + Variant E: Cove / Tavola Full-Bleed Atmospheric Plate (full-bleed field with solid reading plate + live station/specimen card)"
      ]
    },
    {
      "question": "3. Logo Construction (Kuwayama Protocol) — Which geometric primitive should construct the 64x64 primary mark and 6-mark companion cast?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Horizon Bar & Resting Star / Subject — a 4-unit structural horizon slab with a geometric star, arc, or drawn subject resting on it (like Vesper, Clearing, Tavola)",
        "Boolean Counter-Form (`fill-rule=\"evenodd\"`) — bold foreground mass carved by an optical negative-space silhouette or portal (like Porphyry, Cove)",
        "Cell Matrix / Offset Register Tear — modular grid cells with one off-grid escapee or a two-drum torn seam bridged by a single pin (like Huginn, Riso Co.)",
        "Sheared Parallel Planes / Continuous Junction Stroke — two sheared masses separated by a 6-unit channel or one continuous ribbon turning a corner (like Strand, Jakarta)",
        "Solid Mass with Lit Crest / Optical Louver — asymmetric rising ground with a contrasting 7-unit lit crest or parallel slit-scan bars (like Hachure, Halation)"
      ]
    },
    {
      "question": "4. Theme Polarity & Surface Exploration — How should the color scope and Section 04 (`Surfaces`) behave?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Dual-Scope (Daylight + Night Toggle) + Vesper Comparative Surface Grid (4–6 explored surfaces in a 2-col grid with `210px` live visual demos, showing both `Shipped` and `Rejected` surfaces with zero range sliders)",
        "Warm Stock / Paper Daylight First + Vesper Comparative Surface Grid + Full-Bleed Closing Band (dither divider, inverted cast band, or closing artwork)",
        "Abyssal / Nocturnal Dark First + Vesper Comparative Surface Grid — night is the default surface, daylight is the secondary scope (like Cove, Bluewater, Porphyry)",
        "Procedural Field (`field-forge.mjs`: stipple / dither / bands / mesh) + Vesper Comparative Surface Grid (when no photo is attached)"
      ]
    },
    {
      "question": "5. Output Scope, Deliverables & Token-Saving QA — Which deliverables and verification level should we run?",
      "is_multi_select": true,
      "options": [
        "(Recommended) Full Unnumbered-Hero + 7-Section Showcase Route + 6-Panel Brandkit Board (`<slug>-brandkit.png`) + 6-Mark Companion Cast (`cast/*.svg`)",
        "(Recommended) Skip Browser E2E & Heavy QA Scripts (Fastest / Saves API Tokens) — builds the honest on-page contrast table directly in one pass without headless browser loops",
        "Sync Both Repos (`design-system` + `sunnyside` Landing Page & Case Library registration)",
        "Export Standalone `DESIGN.md` Agent Spec + W3C `tokens.json` + 3-Layer CSS Bundle",
        "Token CSS + Parametric SVG Kit + 6-Panel Board Only (Skip full showcase route)"
      ]
    }
  ]
}
```

### Step 1 · Single-Pass Deterministic Execution (Immediately after `ask_question` is answered)
Once the user answers the `ask_question` prompt (or immediately on Turn 1 if the user explicitly wrote `"skip questions"`):
1. State your **3-Axis Synthesis** in a tight 2-line architectural header summary at the top of your response:
   > **`[BRAND NAME] (Case XX)` — 3-Axis Synthesis:** Surface: *[Tactility]* · Rail & Hero: *[Vesper Rail / Clearing TOC + Hero Variant]* · Physics: *[Corner/Stroke]*  
   > **DNA:** Archetype: *[Seed Fusion]* · Mark: *[Kuwayama Primitive + 6-Cast]* · Stack: *[Display + UI Sans + Mono]* · Polarity: *[Theme Scope]*
2. Build the batch asset script (`scripts/build-<slug>.mjs`), 6-panel `<slug>-brandkit.png` board (`brandkit-board.mjs`), and `/design-system/[slug]` showcase route in **one deterministic pass**.

---

## 2. SIX-PILLAR ARCHITECTURAL MANDATES (THE VESPER / CLEARING / PORPHYRY / HACHURE BAR)

### Pillar I: Unbounded Archetype Synthesis Engine
Never force a project into a rigid template. Synthesize the visual language dynamically across **3 continuous axes**:
1. **Surface Tactility:** *Two-Ink Uncoated Print / Stipple* ↔ *Tactile Paper / Woven Linen Cardstock* ↔ *Optical Reeded / Sea Glass*
2. **Spatial Density:** *Gallery Airy (`p-12`, wide leading)* ↔ *Editorial Balanced (`60ch–66ch` reading measure)* ↔ *Terminal/Instrument High-Density (`1px` exposed hairlines, `tabular-nums` rows)*
3. **Corner & Stroke Physics:** *Razor Printed (`0px` radius, `1px` exposed hairlines)* ↔ *Precision Organic (`10px` inner / `18px` outer concentric radii)* ↔ *Soft Squircle (`22px`)*

---

### Pillar II: Parametric SVG Logo Engine & 6-Mark Companion Cast (Kuwayama Protocol)
Construct bespoke `<svg viewBox="0 0 64 64">` marks using mathematical vector discipline inspired by Yasaburo Kuwayama.
- **Hard Bans:** Zero `<circle>` outer badges (`r >= 24`), zero thin-stroke line icons (`stroke-width < 2`), zero literal clip-art or Lucide/Heroicon imports as logos, zero `<text>` tags inside SVGs (wordmarks must be outlined `<path>` vectors), and **zero emojis (`☀️`, `🌙`, `✓`) in UI chrome**.
- **Geometric Primitives (Combine 1–2 per mark on a `64×64` grid, `1x = 4px–8px` clearspace):**
  - *Horizon Bar & Resting Star/Subject* · *Boolean Counter-Form (`fill-rule="evenodd"`)* · *Cell Matrix with Off-Grid Escapee* · *Two-Drum Offset Tear + Pin* · *Sheared Parallel Planes* · *Solid Mass with Lit Crest*.
- **Mandatory Mark Family Deliverables (`public/brand/<slug>/`):**
  1. **Primary (`mark.svg`, `mark-reverse.svg`, `glyph.svg`)** + **Separate 16px Compact Drawing (`mark-compact.svg`, `mark-compact-reverse.svg`)**: The 16px compact MUST be a distinct simplified drawing (fatter arms/bars, wider channels, small details removed so anti-aliasing never blurs at `16×16`), never just the 64px mark scaled down.
  2. **Outlined Vector Wordmark & Lockups (`wordmark.svg`, `lockup.svg`, `lockup-reverse.svg`, `lockup-stacked.svg`)**: Pure `<path>` geometry with ink baked in (`<img>` tags resolve `currentColor` to black).
  3. **6-Mark Companion Cast (`public/brand/<slug>/cast/*.svg`)**: 6 domain-specific companion symbols drawn on the exact same `64×64` grid and cut-line weight (e.g., for Vesper: *Moon, Lamp, Horizon, Figure, Ray, Grain*; for Clearing: *Dawn, Track, Antler, Rain, Call*).

---

### Pillar III: Dual-Scope OKLCH Chromatic Architecture & Honest Contrast Ledger
Generate a perceptually uniform `oklch(L C H)` primitive palette (`6–12` primitives) tailored to the brand hue ($H$), wired through **Three Strict Token Layers**:
1. **Layer 1 · Primitives (`--xx-cobalt`, `--xx-stock`, `--xx-chalk`):** Named once for the physical material. Primitives **NEVER** flip values in dark mode and **NEVER** use mode prefixes (`--night-ground` is banned).
2. **Layer 2 · Semantic Scope (`:root` Day vs `[data-<slug>='night']` Night):** A night surface is a semantic scope over the same primitives (`--xx-surface-page`, `--xx-surface-plate`, `--xx-text-primary`, `--xx-text-secondary`, `--xx-line-strong`, `--xx-line-subtle`).
3. **Layer 3 · Component Tokens (`--xx-button-bg`, `--xx-chip-border`):** The only layer where a component knows its recipe.
4. **Honest Contrast Ledger (Mandatory Published Failure):**
   - Compute WCAG contrast ratios from hex for `10–16` pairs.
   - **A palette that only publishes its passing pairs is a brochure.** You MUST include at least **1–3 pairs that fail `< 4.5:1`** (e.g., `stock on chalk = 1.32:1` or `citron on ivory = 2.1:1`), explicitly publish them as `FAIL` in `tokens.json` and the Section 03 (`Colour / Ink`) ledger, and assign them a restricted non-text job (*"Wash / fill / graphic only — never type"*). Never nudge a brand color into mud just to fake a pass.

---

### Pillar IV: Open-Foundry Typography & Optical Specimen
Never default to generic Inter + Roboto. Synthesize a **3-Role Font Stack** (`--xx-font-display`, `--xx-font-reading`, `--xx-font-mono`) with live `<link>` or `@font-face` imports:
- *High-Contrast & Editorial Serifs:* `Fraunces`, `Instrument Serif`, `Newsreader`, `Playfair Display`, `Bodoni Moda`, `Cinzel`.
- *Architectural & Expressive Display:* `Syne`, `Bricolage Grotesque`, `Space Grotesk`, `Archivo`, `Sora`.
- *Precision Neo-Grotesque & Humanist Reading:* `Plus Jakarta Sans`, `Schibsted Grotesk`, `Instrument Sans`, `Geist`, `Archivo`, `Jost`.
- *Technical & Tabular Monospace:* `DM Mono`, `Geist Mono`, `JetBrains Mono`, `IBM Plex Mono`, `Space Mono`.

---

### Pillar V: Non-Template Hero Exploration (5 Flagship Variants) & 6-Panel Brandkit Board

> [!CRITICAL]
> **ANTI-TEMPLATE HERO LAW — NEVER REUSE THE SAME HERO BOX LAYOUT:**
> Do **not** default every brand to the old `Quieta / Arête / Tavola` two-card hero (`left reading plate + right glass radar card + 4-cell bottom row`). Instead, build the Hero as an **unnumbered opening stage** using one of these **5 high-scoring flagship architectures** (chosen in Step 0 or matched to the brand's material):

#### Variant A · Vesper Split Field + Overlapping Stat Bench (`vesper/page.tsx`)
- **Top Field (`.vs-field`):** A full-width `height: min(78vh, 720px)` visual stage holding the primary artwork/stipple/photo edge-to-edge, with a minimal bottom-aligned monospace `.vs-stamp` bar (`Vesper · two inks · 2026` / `Cobalt #1b3fa2 / stock #e6cfa8`). No headline sits on top of the artwork.
- **Opening Below (`.vs-opening`):** Immediately below the field, a 5-cell exposed-hairline `.vs-bench` (`margin-top: -30px; position: relative; z-index: 2; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--xx-line-strong)`) bridges the seam between the artwork and the paper ground. Below the bench sits the oversized display `<h1>` (`clamp(52px, 8.4vw, 112px)`, `line-height: 0.9`, with optional register-ghost `text-shadow`), a `56ch` `.vs-lede`, and split-arrow `.vs-btn` CTAs.

#### Variant B · Clearing / Strand Split Editorial + Framed Media Pane (`clearing/page.tsx`, `strand/page.tsx`)
- **2-Column Asymmetric Grid (`.heroGrid`):** Left column sits directly on the page ground with eyebrow, editorial `<h1>`, `60ch` lede, and 4 compact `.pill` metadata badges (`<b>27</b> tokens`, `<b>8.71:1</b> cream on emerald`, `<b>6</b> cast marks`, `<b>64</b> unit grid`).
- **Right Framed Artwork + Single Floating Pane (`.heroMedia`):** A framed high-resolution painting or photograph (`border-radius`, `overflow: hidden`) with a single translucent bottom-left/right `.heroPane` carrying `lockup-reverse.svg` and a 2-line caption (`One pane / over painted light`). Followed by a 4-cell `.heroStats` row below.

#### Variant C · Porphyry / Hachure Live Specimen Stage First (`porphyry/page.tsx`, `hachure/page.tsx`)
- **Top Specimen Stage:** The hero opens with the system's signature interactive or procedural object across the full shell or viewport—such as Hachure's live `DitherField` + printed cartographic `.heroMargin` scale bar (`Sheet 05 · 0—1 km · 1:25 000 · seed 7`), or Porphyry's live stage header (`Fig. 01 · the stage, live`) + interactive diorama specimen.
- **Hero Foot Below (`.heroFoot` / `.heroInner`):** Below the specimen sits the eyebrow, display headline, narrative lede, action buttons, and a 4-cell stat column/row.

#### Variant D · Jakarta / Riso Physical Artifact & Torn Edge (`jakarta/page.tsx`, `riso/page.tsx`, `huginn/page.tsx`)
- **Physical Sheet / Hoarding Stage:** The hero is a physical printed sheet or civic hoarding—featuring an oversized `760px` decorative mark impression or a pinned top edge (`<Pin />` + live run/clock metadata row), bold display typography, and a bottom edge cut with an irregular 18-tooth polygon `clip-path` (`.heroFloor` / `.heroSheet`) or a Bayer dither dissolve into a solid paper `.heroPlate` below.

#### Variant E · Cove / Tavola Full-Bleed Atmospheric Plate (`cove/page.tsx`, `tavola.astro`)
- **Full-Bleed Backdrop + Solid Reading Plate:** Full-bleed dark or sunlit photography behind a directional scrim, pairing a high-contrast reading plate with a live domain instrument/station readout card (`Station 04 · live readings` or `Coordinates + 4-axis spec`) and a breathing stat row.

#### Mandatory 6-Panel Brandkit Board (`brandkit-board.mjs`)
Every case MUST generate a real **`1500 × 1125` (`3000 × 2250` @2x) 6-Panel Brand Kit Board** (`<slug>-brandkit.png` & `.webp`)—never copy a raw photo as `<slug>-brandkit.png`:
```bash
node skills/sunnyside-brand-system/scripts/brandkit-board.mjs \
  --slug <slug> \
  --tokens features/<slug>/tokens.json \
  --brand public/brand/<slug> \
  --hero public/brand/<slug>/<hero-asset.webp> \
  --out public/brand/<slug>/<slug>-brandkit.png
```

---

### Pillar VI: Navigation, Rail Options & 7 Canonical Numbered Sections

> [!CRITICAL]
> **NAVIGATION & RAIL MANDATE (THE VESPER & CLEARING STANDARD):**
> 1. **Hero is Unnumbered:** The Hero / Opening stage is **never** numbered `01`. Section numbering (`01` through `07`) begins at the first content section below the hero (`01 / Premise` or `01 / Idea`).
> 2. **Navbar Links Have Zero Numbers:** The sticky top navigation bar carries the brand mark + name on the left, **clean word-only section links without numbers** (`Idea`, `Mark`, `Colour`, `Surfaces`, `Type`, `Kit`, `Tokens`) in the center, and the theme scope toggle (using a geometric `.dot` or `<i>` square, never emojis) on the right.
> 3. **Section Numbers Live in the Left Rail (Two Supported Architectures):**
>    - **Option 1 · Vesper Per-Section Rail (Default):** Each `.sec` has a `1px` top border (`border-top: 1px solid var(--xx-line-strong)`) and wraps both `.rail` and `.body` inside `.sec > .wrap`:
>      ```css
>      .sec { padding-block: 96px; border-top: 1px solid var(--xx-line-strong); scroll-margin-top: 92px; }
>      .sec > .wrap { display: grid; grid-template-columns: 176px minmax(0, 1fr); gap: 40px; }
>      .rail { position: sticky; top: 88px; align-self: start; display: flex; flex-direction: column; gap: 6px; }
>      .rail .n { font-family: var(--xx-font-mono); font-size: 11px; letter-spacing: 0.1em; color: var(--xx-text-secondary); }
>      .rail .lbl { font-size: 11.5px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; color: var(--xx-text-primary); }
>      .body { min-width: 0; }
>      @media (max-width: 1080px) {
>        .sec > .wrap { grid-template-columns: 1fr; gap: 22px; }
>        .rail { position: static; flex-direction: row; align-items: baseline; gap: 12px; }
>      }
>      ```
>    - **Option 2 · Clearing Sticky Contents TOC Sidebar:** Below the hero, a single outer `<div class="shell layout">` (`display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 56px; align-items: start`) holds a sticky `<nav class="contents" aria-label="Contents">` sidebar with an `<ol>` of `01`..`07` links (highlighting `aria-current="true"` via `IntersectionObserver` or scroll position) alongside the `<div>` stack of all 7 sections.

#### The 7 Canonical Numbered Sections (Below the Unnumbered Hero)

1. **`01 / Premise (or Idea)`**
   - Section headline (`h2`) + lead paragraph (`p.big`) + 4 Premise cells (`Belief`, `Enemy`, `Material`, `Reject it when` in a `2×2` `.two` hairline grid) + **4 structured Decision Cards** (`.decs` `2×2` grid) where every card states: `Decision` (`h3`), `Because`, `Not when`, and `Breaks next`.
2. **`02 / The Mark`**
   - Kuwayama construction narrative + 4-tile `.logo-grid` (`Primary`, `Reverse` on loud/night ground, `Compact · 16–24px`, `Glyph`) + horizontal/reverse/stacked `.lock` rows + multi-size scale strip (`96`, `48`, `32`, `24 compact`, `16 compact`, `16 glyph`) + 3 structural rules (`Clear space`, `Never`, `Below 24px`) + optional scored concept bake-off table or 1-click SVG copy.
   - *Companion Cast Placement:* Either render the **6-Mark Companion Cast** here in Section 02, OR render it as a **full-bleed inverted `.castband`** (like Vesper's cobalt cast band between `06 Kit` and `07 Tokens`, with its own `176px` `.rail` + 3×2 `.castgrid`).
3. **`03 / Ink (or Colour)`**
   - Click-to-copy primitive swatch cards (`grid-template-columns: repeat(4, 1fr); gap: 1px`, showing color chip, token name, hex/OKLCH, and role) + the **complete Measured Contrast Ledger** (`.pairs` rows with dual 30×30 color chips, pair label, computed ratio, and assigned semantic job—explicitly highlighting the `1–3` failing pairs and what job they may *not* do).
4. **`04 / Surfaces` (Vesper Comparative Surface Exploration Grid — No Range-Slider Stage)**
   - **Never build a fake blur/tint range-slider stage unless explicitly requested.** Instead, follow Vesper's `"Six surfaces were tried. Four survived."` architecture:
   - Render a `2-column` `.surf` hairline grid (`grid-template-columns: 1fr 1fr; gap: 1px; background: var(--xx-line-subtle)`) of **4 to 6 explored surface cards** (`.sc`).
   - Each card has:
     1. A `210px` live visual `.demo` box at the top demonstrating that exact surface treatment in real CSS/SVG/imagery (e.g., *Stipple / Artwork field*, *Ordered Bayer dither band*, *Register ghost type*, *Ruled ledger rows*, *Frosted pane that smudges the texture*, *Torn/cut clip-path edge*, or *Lifted paper seam*).
     2. A `.txt` body below with a flex header (`<b>Surface Title</b>` + monospace verdict tag `Shipped — the hero`, `Shipped — section dividers`, or `Rejected`) and a concise paragraph explaining *why* it survived or *why* it was rejected so nobody re-proposes it in six months. Cards with `rejected: true` get `.rej` (`filter: saturate(0.55)` on `.demo` and muted verdict tag).
5. **`05 / Type (or Voice)`**
   - Live rendered type scale rows (`.tscale`: `132px` metadata column with role/font/weight/size/leading/tracking + live sample rendered at its real CSS size) + **2-column domain specimens** (`Display` multi-line specimen + `Reading` 66ch paragraphs + `Figures` tabular right-aligned table + `Labels` tracking rule).
6. **`06 / The Kit (or Domain Workbench)`**
   - A `2×2` `.kit` hairline grid of pressed/tactile UI controls and domain components (`Buttons` with primary/ghost/small/disabled states, `Chips & tags` with status indicators, `Fields` with a double-reported error summary + `aria-invalid="true"` input state, and `Data rows / Domain workbench` with `tabular-nums` alignment and live interactive selection).
7. **`07 / Tokens (and Honest Audit Ledger)`**
   - `2×2` `.sheet` grid of copyable code blocks (`1 · Primitives`, `2 · Day Scope`, `2 · Night Scope`, `3 · Component Tokens` with 1-click `Copy` buttons) + optional **Audit & Known Gaps** ledger (`What is verified, and what is not` + `2×2` `.gaps` cards) + closing full-bleed band or architectural footer.

---

## 3. TOKEN-EFFICIENCY RULES FOR FAST & NON-FLAGSHIP MODELS

To achieve maximum quality with minimal token consumption on both flagship and fast models:
1. **Batch Asset Generation in One Node Script (`scripts/build-<slug>.mjs`):** Write a single ~150-line Node script that outputs all mark/wordmark/lockup SVGs, the 6 `cast/*.svg` files, `tokens.json`, `<slug>-tokens.css`, and `DESIGN.md` in one execution, then call `brandkit-board.mjs` to render `<slug>-brandkit.png`.
2. **Data-Driven Loops in Templates:** In `.astro` or `.tsx` showcase pages, define `NAV`, `STATS`, `PREMISE`, `DECISIONS`, `SURFACES`, `CAST`, and `CODE_BLOCKS` as compact arrays in the frontmatter/data file and `.map()` over them—cutting template token usage by **45%** while guaranteeing zero structural drift.
3. **Sync Both Repos When Targeting External `design-system`:**
   - Write the showcase route to `src/pages/design-system/<slug>.astro`, styles/tokens to `src/features/<slug>/`, assets to `public/brand/<slug>/`, and register the case in `src/data/cases.ts`.
   - Mirror `public/brand/<slug>/` into `sunnyside`, add the entry to `features/case-library/cases.ts`, `.tone_<slug>` to `features/case-library/case-library.module.css`, and the 4 hex chips to `SYSTEM_SWATCHES` in `features/landing-page/studio/work-gallery/work-gallery-data.ts`.

---

## 4. SILENT PRE-OUTPUT AUDIT GATE

Verify internally before finishing (never print this checklist):
- [ ] `<slug>-brandkit.png` is a rendered `1500×1125` (`3000×2250` @2x) 6-panel Brand Kit Board—never a raw copied photo.
- [ ] Hero is **unnumbered**, uses one of the **5 flagship Hero variants** (not a copy-paste of Quieta/Arête), and the sticky navbar links have **zero numbers** (`Idea`, `Mark`, `Colour`, `Surfaces`, `Type`, `Kit`, `Tokens`).
- [ ] Section numbers (`01`..`07`) live inside the left rail—either **Vesper's Per-Section Rail** (`.sec > .wrap` wrapping `176px` sticky `.rail` + `.body`) or **Clearing's Sticky Contents Sidebar** (`.shell.layout` wrapping a scroll-spy `<ol>` + content column).
- [ ] Section `04 / Surfaces` uses **Vesper's Comparative Surface Exploration Grid** (`2-col` grid of 4–6 `.sc` cards with `210px` live `.demo` boxes + `Shipped` / `Rejected` verdicts, no range-slider stage).
- [ ] Mark family includes a separate `16px` compact drawing (`mark-compact.svg`) + 6 companion cast marks (`cast/*.svg`) on the 64-unit grid.
- [ ] Section `01` includes 4 `Decision / Because / Not when / Breaks next` cards, and Section `03` publishes at least 1–3 failing contrast pairs with a restricted non-text job.
- [ ] Zero emojis (`☀️`, `🌙`) in UI chrome; all 3 fonts load live.

---

## 5. POST-BUILD OPEN DIALOGUE PROTOCOL

End every response with this compact 1-keystroke action menu:

> **Next Step — Reply with a code (or combine, e.g., `A + C`):**
> - **`[A] Tailwind v4 / CSS Token Export`** — Standalone `tokens.css` with OKLCH `@theme` variables and font rules.
> - **`[B] Figma Variables & SVG Bundle`** — W3C Design Tokens JSON + clean standalone `.svg` files for all lockups and cast marks.
> - **`[C] Extract Section 06 Kit Components`** — Package the kit and domain controls into modular `components/ui/` TSX files.
> - **`[D] Remix Hero Variant / Rail / Archetype`** — Name any shift (e.g., *"Switch to Clearing TOC rail + Variant B Split Hero"*) for a surgical git patch diff.
