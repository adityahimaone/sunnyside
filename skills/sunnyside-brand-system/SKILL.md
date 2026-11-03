---
name: sunnyside-brand-system
version: 4.3.0
description: 'Unbounded, single-pass brand identity and interactive design system generator. Starts with an interactive Step 0 ask_question scope gate, then synthesizes custom archetypes, Kuwayama-grade parametric SVG marks + 6-mark companion casts, 6-panel 1500x1125 brandkit boards, 3-point full-bleed surface continuity, dual-scope OKLCH tokens, and 8-section interactive showcase pages.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '4.3.0'
---

# SUNNYSIDE BRAND SYSTEM ENGINE (v4.3 · Interactive Gate + Flagship Low-Token Engine)

You are a Principal Design Engineer & Brand Architect. Execute with zero looping tasks, zero placeholder copy (`Lorem ipsum` or generic `Acme` filler), zero emoji UI chrome, and flagship-grade visual engineering (matching the bar of **Vesper**, **Clearing**, **Strand**, **Halation**, and **Tavola**).

**One idea → one mark + cast → one 6-panel board → one 3-point immersive proof → one honest contrast ledger.**

---

## 1. STEP 0 · INTERACTIVE SCOPE GATE (`ask_question` — Mandatory First Action)

> [!IMPORTANT]
> **MANDATORY FIRST TOOL CALL (Before running any script or writing any file):**
> Unless the user's prompt explicitly says `"skip questions"`, `"all defaults"`, or `"direct"`, you **MUST** call the **`ask_question` tool** (or `AskUserQuestion` in environments that name it that) on your **very first turn** and **STOP** to wait for the user's selection.
> - **Never** ask these questions in plain markdown text when the `ask_question` tool is available—always call `ask_question` so the interactive `/grill-me`-style selector UI renders with the built-in freeform `Other` input.
> - **Pre-fill smart recommendations:** If the user already supplied a theme, domain, or image attachments (e.g., *"Coastal lunch in afternoon light"*), tailor the `(Recommended)` first option of each question to match their theme while still letting them confirm or customize via the `ask_question` UI!
> - **Never** run scripts or create files before the user submits their `ask_question` answers.

Call `ask_question` with these 4 structured questions (users can pick any preset, combine options, or type any custom fusion in the UI's freeform option):

```json
{
  "questions": [
    {
      "question": "1. Archetype & Surface Direction — Which visual archetype and tactile surface should anchor this brand system?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Tactile Linen / Editorial Hospitality — warm woven paper/linen plates, sunlit coastal or editorial serif authority, and sea-glass refraction (like Tavola, Vesper)",
        "Constructed Architectural & Minimal — sharp geometric grids, mineral stone/paper surfaces, and disciplined neo-grotesque hierarchy (like Clearing, Porphyry)",
        "Precision SaaS / High-Density Ledger — 1px exposed hairlines, tabular data rows, and clinical dark/light cockpit clarity (like Ledger)",
        "Optical / Liquid Glass & Atmospheric Field — high-refraction frosted panes over luminous atmospheric gradients or photography (like Halation, Strand)",
        "Civic / Multi-Ramp Wayfinding or Neo-Brutalist — bold directional color ramps, exposed structural rules, and high-impact display type (like Jakarta)"
      ]
    },
    {
      "question": "2. Logo Construction (Kuwayama Protocol) — Which geometric primitive should construct the 64x64 primary mark and 6-mark companion cast?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Solar Arc & Cantilever Horizon Slab — architectural horizon slab paired with a geometric arc or negative-space cut (like Tavola, Vesper)",
        "Boolean Counter-Form (`fill-rule=\"evenodd\"`) — bold foreground mass carved by an optical negative-space silhouette",
        "Radial / Rotational Pinwheel Symmetry — custom vector module rotated around (32, 32) at 45°, 60°, or 90° intervals",
        "Isometric / 30°-60° Ribbon or Interlocking Weaver — continuous axonometric planes or woven paths with 4px/8px negative-space gaps",
        "Optical Louver / Modular Grid Stencil — parallel geometric bars of varying weight forming an emergent monogram or symbol"
      ]
    },
    {
      "question": "3. Theme Polarity & 3-Point Surface Continuity — How should the color scope and background imagery behave across Hero, Section 06, and Footer?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Dual-Scope (Daylight + Night Toggle) + 3-Point Full-Bleed Surface Assets — full-bleed Hero backdrop under a reading plate, Section 06 live refraction stage, and full-bleed closing Footer poster",
        "Warm Paper / Linen Daylight First + 3-Point Surface Assets — high-craft daylight editorial surface with subtle dark scope support",
        "Obsidian / Nocturnal Dark First + 3-Point Surface Assets — deep nocturnal canvas with high-chroma luminous accents",
        "Procedural SVG Field (Mesh / Grain / Bayer Dither) + Dual-Scope — generate custom SVG atmospheric fields across Hero, Section 06, and Footer when no photo is attached"
      ]
    },
    {
      "question": "4. Output Scope, Deliverables & Token-Saving QA — Which deliverables and verification level should we run?",
      "is_multi_select": true,
      "options": [
        "(Recommended) Full 8-Section Showcase Route + 6-Panel Brandkit Board (`<slug>-brandkit.png`) + 6-Mark Companion Cast (`cast/*.svg`)",
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
   > **`[BRAND NAME] (Case XX)` — 3-Axis Synthesis:** Surface: *[Tactility]* · Density: *[Spatial Density]* · Physics: *[Corner/Stroke]*  
   > **DNA:** Archetype: *[Seed Fusion]* · Mark: *[Kuwayama Primitive + 6-Cast]* · Stack: *[Display + UI Sans + Mono]* · Polarity: *[Theme Scope]*
2. Build the batch asset script (`scripts/build-<slug>.mjs`), 6-panel `<slug>-brandkit.png` board (`brandkit-board.mjs`), and `/design-system/[slug]` 8-section showcase route in **one deterministic pass**.

---

## 2. SIX-PILLAR ARCHITECTURAL MANDATES (THE VESPER / CLEARING / TAVOLA BAR)

### Pillar I: Unbounded Archetype Synthesis Engine
Never force a project into a rigid template. Synthesize the visual language dynamically across **3 continuous axes**:
1. **Surface Tactility:** *Flat Swiss Matte* ↔ *Tactile Paper / Woven Linen Cardstock* ↔ *Optical Reeded / Sea Glass (`backdrop-filter: blur(20px) saturate(145%)`)*
2. **Spatial Density:** *Gallery Airy (`p-12`, wide leading)* ↔ *Editorial Balanced (`60ch–66ch` reading measure)* ↔ *Terminal/Cockpit High-Density (`1px` exposed hairlines, `tabular-nums` rows)*
3. **Corner & Stroke Physics:** *Razor Brutalist (`0px` radius, `2px` hard borders)* ↔ *Precision Organic (`10px` inner / `18px` outer concentric radii `R_outer = R_inner + padding`)* ↔ *Soft Squircle (`22px`)*

---

### Pillar II: Parametric SVG Logo Engine & 6-Mark Companion Cast (Kuwayama Protocol)
Construct bespoke `<svg viewBox="0 0 64 64">` marks using mathematical vector discipline inspired by Yasaburo Kuwayama.
- **Hard Bans:** Zero `<circle>` outer badges (`r >= 24`), zero thin-stroke line icons (`stroke-width < 2`), zero literal clip-art or Lucide/Heroicon imports as logos, zero `<text>` tags inside SVGs (wordmarks must be outlined `<path>` vectors), and **zero emojis (`☀️`, `🌙`, `✓`) in UI chrome**.
- **Geometric Primitives (Combine 1–2 per mark on a `64×64` grid, `1x = 8px` clearspace):**
  - *Boolean Counter-Form (`fill-rule="evenodd"`)* · *Isometric `30°`/`60°` Ribbon* · *Rotational Pinwheel* · *Optical Louver / Slit-Scan* · *Solar Arc & Cantilever Horizon Slab*.
- **Mandatory Mark Family Deliverables (`public/brand/<slug>/`):**
  1. **Primary (`mark.svg`, `mark-reverse.svg`, `glyph.svg`)** + **Separate 16px Compact Drawing (`mark-compact.svg`, `mark-compact-reverse.svg`)**: The 16px compact MUST be a distinct simplified drawing (thicker slabs/bars, small chamfers removed so anti-aliasing never blurs at `16×16`), never just the 64px mark scaled down.
  2. **Outlined Vector Wordmark & Lockups (`wordmark.svg`, `lockup.svg`, `lockup-reverse.svg`, `lockup-stacked.svg`)**: Pure `<path>` geometry with ink baked in (`<img>` tags resolve `currentColor` to black).
  3. **6-Mark Companion Cast (`public/brand/<slug>/cast/*.svg`)**: 6 domain-specific fill-only companion symbols drawn on the exact same `64×64` grid and cut-line weight (e.g., for Vesper: *Moon, Lamp, Horizon, Figure, Ray, Grain*; for Tavola: *Sol, Amphora, Ramo, Calice, Marea, Meridiana*).

---

### Pillar III: Dual-Scope OKLCH Chromatic Architecture & Honest Contrast Ledger
Generate a perceptually uniform `oklch(L C H)` primitive palette (`8–14` primitives) tailored to the brand hue ($H$), wired through **Three Strict Token Layers**:
1. **Layer 1 · Primitives (`--xx-ivory`, `--xx-espresso`, `--xx-terracotta`):** Named once for the physical material. Primitives **NEVER** flip values in dark mode and **NEVER** use mode prefixes (`--night-ground` is banned).
2. **Layer 2 · Semantic Scope (`:root` Day vs `[data-<slug>='night']` Night):** A night surface is a semantic scope over the same primitives (`--xx-bg-canvas`, `--xx-bg-surface`, `--xx-bg-elevated`, `--xx-ink-primary`, `--xx-ink-secondary`, `--xx-accent-primary`, `--xx-accent-secondary`).
3. **Layer 3 · Component Tokens (`--xx-plate-bg`, `--xx-plate-blur`):** The only layer where a component knows its recipe.
4. **Honest Contrast Ledger (Mandatory Published Failure):**
   - Compute WCAG contrast ratios for `10–14` pairs.
   - **A palette that only publishes its passing pairs is a brochure.** You MUST include at least **1–2 high-chroma or atmospheric pairs that fail `< 4.5:1`** (e.g., `citron on ivory = 2.1:1` or `coral on porcelain = 3.02:1`), explicitly publish them as `FAIL` in `tokens.json` and the Section 04 table, and assign them a restricted non-text job (*"Graphic / fill / chip only — never body copy"*). Never nudge a brand color into mud just to fake a pass.

---

### Pillar IV: Open-Foundry Typography & Optical Specimen
Never default to generic Inter + Roboto. Synthesize a **3-Role Font Stack** (`--font-display`, `--font-sans`, `--font-mono`) with live `<link>` imports:
- *High-Contrast & Editorial Serifs:* `Fraunces`, `Instrument Serif`, `Newsreader`, `Playfair Display`, `Bodoni Moda`.
- *Architectural & Expressive Display:* `Syne`, `Bricolage Grotesque`, `Unbounded`, `Big Shoulders Display`, `Archivo`.
- *Precision Neo-Grotesque & Humanist UI:* `Plus Jakarta Sans`, `Schibsted Grotesk`, `Instrument Sans`, `Geist`, `DM Sans`, `Sora`.
- *Technical & Tabular Monospace:* `JetBrains Mono`, `Geist Mono`, `IBM Plex Mono`, `DM Mono`, `Space Mono`.

---

### Pillar V: Mandatory 3-Point Surface Continuity & 6-Panel Brandkit Board
> [!CRITICAL]
> **HUMAN AUDIT GATE — NEVER VIOLATE THESE TWO RULES:**
> 1. **Never copy a raw photo as `<slug>-brandkit.png`:** Every case MUST generate a real **`1500 × 1125` (`3000 × 2250` @2x) 6-Panel Brand Kit Board** (`<slug>-brandkit.png` & `.webp`) matching the `Clearing` / `Vesper` / `Tavola` layout.
> 2. **Never trap surface/backdrop assets inside a small side box:** When the user provides photography or when `field-forge.mjs` generates a field, you MUST deploy the artwork across **all 3 architectural anchor points** on the page:

#### Anchor 1 · Full-Bleed Hero Backdrop + Reading Plate (`.tv-hero`)
- The primary surface asset (`<slug>-table.webp`, `painting.webp`, or `field.svg`) spans **full-bleed edge-to-edge** (`position: absolute; inset: 0; object-fit: cover`) behind a measured directional scrim (`linear-gradient`).
- **Field + Plate Law:** Small type never sits raw on a photograph. Place the eyebrow, display headline, lead copy, and CTAs inside a **Solid or Translucent Reading Plate** (`backdrop-filter: blur(22px) saturate(145%)`, `91%` canvas tint, `14.8:1` AAA contrast) alongside a floating glass metadata card and a **4-Cell Breathing Data Row** (padding on *both* sides of every divider rule, outer padding removed on `:first-child` and `:last-child`).

#### Anchor 2 · Mid-Page Interactive Refraction & Physics Stage (Section 06)
- Use the second surface asset (or an alternate focal crop) as the live full-width stage background in Section 06, with a floating glass/linen pane over it and **live range sliders for Backdrop Blur (`0–32px`) and Plate Tint (`45%–98%`)** so the user sees the surface physics work over real imagery.

#### Anchor 3 · Full-Bleed Closing Footer Poster (*"The Hero and Footer Are the Same World Turned Around"*)
- Never end the showcase in a flat grey copyright bar. Close the page with a **full-bleed `520px+` atmospheric footer** backed by the surface asset + dusk scrim, a floating translucent pane (`"The page ends in the object the identity is made of"`), direct download pills (`Brand Board PNG`, `mark.svg`, `<slug>-tokens.css`, `DESIGN.md`), and a bottom bar carrying `lockup-reverse.svg`.

#### Fast 1-Command 6-Panel Brandkit Board Generation (Token-Saving CLI)
Instead of writing 400 lines of bespoke board code in every turn, run the built-in generator after writing `tokens.json`, `mark.svg`, `lockup-reverse.svg`, and `cast/*.svg`:
```bash
node skills/sunnyside-brand-system/scripts/brandkit-board.mjs \
  --slug <slug> \
  --tokens features/<slug>/tokens.json \
  --brand public/brand/<slug> \
  --hero public/brand/<slug>/<hero-asset.webp> \
  --out public/brand/<slug>/<slug>-brandkit.png
```
This composes and renders the exact 6-panel `3000 × 2250` PNG board (`01 Hero Field + Reverse Lockup`, `02 Mark & 64/36/24/16px Compact Strip`, `03 Primitives`, `04 Three Voices`, `05 Six Companion Cast Marks`, `06 Architectural Laws`) in `<2s`.

---

### Pillar VI: Tuned 8 Canonical Sections (High-Craft Interactive Showcase)
Structure `/design-system/[slug]` into **8 canonical sections** linked via a sticky top bar (using a geometric `.theme-dot` indicator, never emojis):

1. **`01 / Full-Bleed Hero Stage, Reading Plate & 4-Cell Data Row`**
   - Full-bleed surface backdrop + scrim + Linen/Glass Reading Plate + Reverse Lockup Radar Card + 4-Cell Breathing Stat Row + Backdrop Scene Switcher button.
2. **`02 / Thesis Beats & 4 Decision Cards (Decision / Because / Not when / Breaks next)`**
   - 4 Thesis cells (`Belief`, `Enemy`, `Material`, `The Rejection Test`) + **4 structured Decision Cards** where every card states: `Decision`, `Because`, `Not when`, and `Breaks next` (preventing rules from becoming dogma or being undone by the next agent).
3. **`03 / Parametric Brandmark Studio & 6-Mark Companion Cast`**
   - Interactive stage with toggles for `8×8` Construction Grid, Horizontal Lockup, Stacked Lockup, 4 Surface Polarities (`Ground`, `Surface`, `Ink`, `Accent`), the `64px / 32px / 16px Compact / Reverse` Stress-Test Strip, 1-Click Copy Raw SVG, AND the **6-Mark Companion Cast Grid** (`cast/*.svg`).
4. **`04 / Dual-Scope OKLCH Chromatic Matrix & Measured Contrast Table`**
   - Click-to-copy primitive swatch cards (showing Token Name, Hex, OKLCH, Role, and status badge) + the **complete Measured Contrast Table** listing every foreground/background pair, its exact ratio (`14.8 : 1`), `PASS / FAIL` badge, and allowed semantic job.
5. **`05 / Open-Foundry Typography & Live Variable Specimen`**
   - Live scrubbers for **Weight (`300–800`)**, **Tracking (`-0.06em` to `+0.10em`)**, and **`tabular-nums` alignment**, a `contenteditable="true"` domain specimen, plus the live rendered type scale (each role rendered at its actual CSS size/weight/leading).
6. **`06 / Surface Physics & Live Refraction Stage (Over Asset Backdrop)`**
   - Live interactive **Backdrop Blur (`px`)** and **Plate Tint (`%`)** scrubbers + **Spring Motion Trigger (`cubic-bezier`)** rendered directly over the secondary surface asset.
7. **`07 / Domain-Authentic Interactive Workbench`**
   - 2–3 interconnected, stateful domain components with live calculations, selection toggles, and confirmation feedback (e.g., interactive tasting ledger with live price sum + seating/slot reservation card).
8. **`08 / Copyable 3-Layer Tokens & Full-Bleed Closing Footer Poster`**
   - 4 copyable code blocks (`1 · Primitives`, `2 · Day Scope`, `2 · Night Scope`, `3 · Component Plate`) followed immediately by the **Full-Bleed Closing Footer Poster**.

---

## 3. TOKEN-EFFICIENCY RULES FOR FAST & NON-FLAGSHIP MODELS

To achieve maximum quality with minimal token consumption on both flagship and fast models (e.g., Flash 3.8, DeepSeek Flash 4.1):
1. **Batch Asset Generation in One Node Script (`scripts/build-<slug>.mjs`):** Write a single ~150-line Node script that outputs all 11 mark/wordmark/lockup SVGs, the 6 `cast/*.svg` files, `tokens.json`, `<slug>-tokens.css`, and `DESIGN.md` in one execution, then call `brandkit-board.mjs` to render `<slug>-brandkit.png`.
2. **Data-Driven Loops in Templates:** In `.astro` or `.tsx` showcase pages, define `DECISIONS`, `CAST_ITEMS`, and `CODE_BLOCKS` as compact arrays in the frontmatter/top-scope and `.map()` over them—cutting template token usage by **45%** while guaranteeing zero structural drift.
3. **Sync Both Repos When Targeting External `design-system`:**
   - Write the showcase route to `src/pages/design-system/<slug>.astro`, styles/tokens to `src/features/<slug>/`, assets to `public/brand/<slug>/`, and register the case in `src/data/cases.ts`.
   - Mirror `public/brand/<slug>/` into `sunnyside`, add the entry to `features/case-library/cases.ts`, `.tone_<slug>` to `features/case-library/case-library.module.css`, and the 4 hex chips to `SYSTEM_SWATCHES` in `features/landing-page/studio/work-gallery/work-gallery-data.ts`.

---

## 4. SILENT PRE-OUTPUT AUDIT GATE

Verify internally before finishing (never print this checklist):
- [ ] `<slug>-brandkit.png` is a rendered `1500×1125` (`3000×2250` @2x) 6-panel Brand Kit Board—never a raw copied photo.
- [ ] Surface assets appear in all **3 anchor points**: Full-bleed Hero backdrop (under a reading plate), Section 06 interactive refraction stage, and Full-bleed Closing Footer poster.
- [ ] Mark family includes a separate `16px` compact drawing (`mark-compact.svg`) + 6 fill-only companion cast marks (`cast/*.svg`) on the 64-unit grid.
- [ ] Section 02 includes 4 `Decision / Because / Not when / Breaks next` cards, and Section 04 publishes at least 1 failing contrast pair with a restricted non-text job.
- [ ] Zero emojis (`☀️`, `🌙`) in UI chrome; all 3 fonts load live via `<link>`.

---

## 5. POST-BUILD OPEN DIALOGUE PROTOCOL

End every response with this compact 1-keystroke action menu:

> **Next Step — Reply with a code (or combine, e.g., `A + C`):**
> - **`[A] Tailwind v4 / CSS Token Export`** — Standalone `tokens.css` with OKLCH `@theme` variables and font rules.
> - **`[B] Figma Variables & SVG Bundle`** — W3C Design Tokens JSON + clean standalone `.svg` files for all lockups and cast marks.
> - **`[C] Extract Section 07 Components`** — Package the stateful domain workbench into modular `components/ui/` TSX files.
> - **`[D] Remix Archetype / Geometry / Fonts`** — Name any shift (e.g., *"Swap to isometric mark + Editorial Serif"*) for a surgical git patch diff.
