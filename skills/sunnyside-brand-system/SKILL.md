---
name: sunnyside-brand-system
version: 4.9.0
description: 'Unbounded, single-pass brand identity and interactive design system generator. Starts with a 7-question Step 0 ask_question scope gate written in plain geometry, not case names: surface/style (Auto + 7 picks resolving into a 28-contract style library), rail (2 shapes), hero (8 shapes plus 8 composition recipes), mark construction, colour polarity (1 or 2 scopes, binding on the toggle and token sheets), build scope, and add-ons. Then synthesizes a custom archetype, Kuwayama-grade parametric SVG marks + a 6-mark companion cast, a 6-panel 1500x1125 brandkit board, a comparative surface exploration grid, OKLCH tokens in the chosen polarity, an unnumbered-hero 7-section interactive showcase page, a cast that belongs to the mark argument rather than to the end of the page, and a footer shape derived from the hero rather than copied from the last case. Pillars V and VII carry a house-rules layer curated from shipped builds: no eyebrow, no monospace labels outside code, no outlined chips or 1px stat boxes, no gradient except one directional scrim drawn in the surface’s own colour or a scoped glass/mesh/hard-offset override from the style library, one accent on the action, a two-line headline cap, and a footer that is a band with a real photograph rather than a colophon strip.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '4.9.0'
---

# SUNNYSIDE BRAND SYSTEM ENGINE (v4.9 · Two Rails + 8 Hero Shapes + 5 Footer Shapes + 28-Contract Style Library)

You are a Principal Design Engineer & Brand Architect. Execute with zero looping tasks, zero placeholder copy (`Lorem ipsum` or generic `Acme` filler), zero emoji UI chrome, and flagship-grade visual engineering.

**One idea → one mark + cast → one 6-panel board → one non-template hero → one comparative surface grid → one honest contrast ledger.**

---

## 1. STEP 0 · INTERACTIVE SCOPE GATE (`ask_question` — Mandatory First Action)

> [!IMPORTANT]
> **MANDATORY FIRST TOOL CALL (Before running any script or writing any file):**
> Unless the user's prompt explicitly says `"skip questions"`, `"all defaults"`, or `"direct"`, you **MUST** call the **`ask_question` tool** (or `AskUserQuestion` in environments that name it that) on your **very first turn** and **STOP** to wait for the user's selection.
> - **Never** ask these questions in plain markdown text when the `ask_question` tool is available—always call `ask_question` so the interactive `/grill-me`-style selector UI renders with the built-in freeform `Other` input.
> - **Pre-fill smart recommendations:** If the user already supplied a theme, domain, or image attachments (e.g., *"Two-ink evening print"* or *"Field journal"*), tailor the `(Recommended)` first option of each question to match their theme while still letting them confirm or customize via the `ask_question` UI!
> - **Never** run scripts or create files before the user submits their `ask_question` answers.

Call `ask_question` with these 7 questions, verbatim. The JSON below is already in the tool schema — `id`, `header`, `question`, `multi_select`, and options as `{label, description}` objects.

**Label rule:** every `label` names the thing by what a non-designer already knows — *Paper & ink*, *Airport signage*, *Text left, photo right*, *Shape with a hole cut out*. Never name an option after a case, a project, or a design term the reader has to look up. Keep `label` under 45 characters (it is what the selector renders) and let `description` carry the exact geometry. **Keep it English, keep it plain.** Call the tool with these English labels as written — do not translate them into the user's language, and do not swap in fancier English. A reader who has never opened a design book should still understand every option: *Cardboard & steel*, not *Constructed industrial*; *Text left, photo right*, not *Split editorial*; *Shape with a hole cut out*, not *Boolean counter-form*. If an option needs a term defined, the label is wrong — move the term into `description` or drop it.

```json
{
  "questions": [
    {
      "id": "surface",
      "header": "Material / Style",
      "question": "1. Surface & Style — pick a material (what the page is made of) or a style (the idiom it reads as). Both resolve to the same kind of nine-slot contract; all 28 are indexed in references/styles.md. Leave it on Auto and the brief and photographs decide, or type any style name in Other.",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) Auto — decide from my brief", "description": "The model reads the theme and photographs and picks any of the 28 contracts through the prompt map. Nothing is forced onto the page; the choice is stated in one line." },
        { "label": "Paper & ink", "description": "Like a book page or a screen-printed poster. Warm uncoated stock, flat solid colour, no glow, no blur, no gradient, 0px corners. Contract #1." },
        { "label": "Cardboard & steel", "description": "Like a warehouse or a shipping container. Kraft and cold grey, sharp rectangular grid, 1px rules, 0px corners, plain sans type. Contract #5." },
        { "label": "Liquid glass", "description": "Like looking up through a glass tower floor. A 26px refracting pane, 22px corners, 1px mullions and one lit top edge; reading copy sits on a solid plate. Contract #19." },
        { "label": "Frosted glass", "description": "Also called glassmorphism. A soft 8-12% white panel with an 18px blur over a photograph, a 1px light edge and 16px corners; no coloured bloom. Contract #15." },
        { "label": "Boxes of different sizes", "description": "Also called bento or a modular grid. Uneven compartments on a 12-column grid, one corner radius, 1px hairlines, one real object in a compartment - never equal spans. Contract #20." },
        { "label": "Blueprint grid", "description": "Like an architect's drawing. Deep blue ground with a 24px repeating grid, white dimension ticks, monospace figures, 0px corners. Contract #4." },
        { "label": "Cockpit panel", "description": "Like an aircraft dashboard. Near-black ground, dense table rows, 1px hairlines, very high contrast, monospace numbers everywhere. Contract #13." }
      ]
    },
    {
      "id": "rail",
      "header": "Rail",
      "question": "2. Rail — where should the section numbers 01–07 sit?",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) Rail A · one per section", "description": "A 176px sticky column inside every section, holding that section's number and label beside its content, with a 1px rule above each section." },
        { "label": "Rail B · one list for the page", "description": "A single 200px sticky sidebar for the whole page listing 01–07, highlighting the section you are reading, with content in one column beside it." }
      ]
    },
    {
      "id": "hero",
      "header": "Hero",
      "question": "3. Hero — what does the very top of the page look like? Each shape puts the type in a different place relative to the artwork, and the footer follows from this answer.",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) A · Banner, then a number row", "description": "Type sits BELOW the art. A wide banner on top, five number cells overlapping its bottom edge, then the headline." },
        { "label": "B · Text left, photo right", "description": "Type sits BESIDE the art. Words on the left, a framed photo on the right with one small logo pane in its corner." },
        { "label": "C · Live demo on top", "description": "Type sits BELOW a live thing. An animated field or specimen runs full width first, then the headline and numbers." },
        { "label": "D · One giant sheet", "description": "Type sits INSIDE the object. The hero is one big printed sheet with a torn bottom edge and the headline printed on it." },
        { "label": "E · Full-screen photo", "description": "Type sits ON the photo. A full-bleed image with a directional scrim, headline and paragraph right on top. No panel." },
        { "label": "F · One object, isolated", "description": "Type sits AROUND one object. A single product alone on a plain ground, headline and numbers in the empty space." },
        { "label": "G · No photo, all type", "description": "No photo at all. One enormous line of type filling the width, a rule, the numbers set as a ledger." },
        { "label": "H · Stacked colour bands", "description": "Type in a rhythm. Three to five full-width colour bands, one line of the argument in each." }
      ]
    },
    {
      "id": "mark",
      "header": "Logo",
      "question": "4. Logo — how should the 64×64 mark be drawn?",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) Bar + something on it", "description": "One horizontal bar 4 units thick, with a star, an arc or a simple subject resting on top of it." },
        { "label": "Shape with a hole cut out", "description": "One bold solid shape, with a silhouette or arrow removed from inside it using fill-rule=\"evenodd\"." },
        { "label": "Square grid, one cell off", "description": "Modular squares on the 64 grid, with exactly one square pushed off the grid to break the pattern." },
        { "label": "Two offset blocks", "description": "Two masses shifted against each other with a 6-unit gap between them, or one continuous stroke that turns a corner." },
        { "label": "Solid block + bright band", "description": "A rising solid mass with a 7-unit highlight band across it, or parallel slit-scan bars." }
      ]
    },
    {
      "id": "polarity",
      "header": "Colour",
      "question": "5. Colour — how many colour scopes ship? This one is binding: it decides the navbar toggle, how many token sheets Section 07 shows, and whether the audit lists a dark-mode gap.",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) Light + dark", "description": "Both ship: a night token block, a navbar toggle, and both a Day and a Night sheet in Section 07." },
        { "label": "Light only", "description": "One scope and nothing else: no night block, no toggle, no Night sheet, no dark-mode audit line. State the reason in Section 07." },
        { "label": "Light + dark, dark first", "description": "The page opens on the dark scope and light is the secondary one, toggle still present." },
        { "label": "Dark only", "description": "A single scope whose page ground is the dark material (lampblack or deep ink paper). No toggle, no second sheet." }
      ]
    },
    {
      "id": "build",
      "header": "Build",
      "question": "6. Deliverables — what should be built?",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) Full page + board + icons", "description": "The unnumbered hero with 7 sections, the 6-panel 3000×2250 brandkit board, and the 6-mark companion cast." },
        { "label": "Board only, no web page", "description": "Token CSS, the parametric SVG kit and the 6-panel board. No showcase route, no rail, no hero." }
      ]
    },
    {
      "id": "addons",
      "header": "Add-ons",
      "question": "7. Add-ons — tick anything that applies, or nothing.",
      "multi_select": true,
      "options": [
        { "label": "Skip browser tests", "description": "Compute the honest contrast table in one pass instead of running headless QA loops." },
        { "label": "List it on the site", "description": "Add the case to the design-system index and the landing case library." },
        { "label": "Export spec files", "description": "A standalone DESIGN.md agent spec, W3C tokens.json and the 3-layer CSS bundle." }
      ]
    }
  ]
}
```

### Step 0.1 · Style resolution (read before Step 1)

`references/styles.md` is the depth behind Q1: **28 surface contracts** (the 18 canonical ones in
`references/surfaces.md` §1–§18 plus the 10 modern ones §19–§28), **8 composition recipes** that bind
to the hero, and **5 behaviours** that bind to motion or polarity. Q1 shows only Auto + 7.

| Q1 answer | Engine behaviour |
|---|---|
| `Auto — decide from my brief` | Brief + photographs → prompt map (`surfaces.md` §Choosing one + `styles.md` §9) → any of the 28. State the contract number, name and one-line reason. |
| A named option | Use that exact contract. No second question, no substitution. |
| Freeform `Other` | Resolve through `styles.md` §5 alias table. A word that maps to a **contract** uses that exact contract; a **composition recipe** R1–R8 or **behaviour** B1–B5 keeps Auto for the material and binds to the hero, motion or scope; an **unknown** or **out-of-scope** word falls back to Auto. State the resolution in one line. |
| Words and photographs disagree | The **photographs** win. A kraft-carton photograph cannot carry a refracting pane. |
| A style hint and an explicit Q5 polarity answer disagree | The explicit Q5 answer stays binding; the style line says so. A `dark-first` hint becomes behaviour B4, never a second palette. |

- **Never** blend two contracts. A hard-offset field next to a glass card is two brands.
- **Never** add a second style question. Step 0 stays at seven questions; the freeform `Other` input is what makes the vocabulary unbounded.
- **Every** style name must resolve to nine slots before a component is written. A bare trend word is not a contract.
- **Scoped overrides** for glass, mesh and hard-offset contracts live in `styles.md` §8. They waive only the three named Pillar V bans (blur / `backdrop-filter`, one gradient, one hard offset shadow) for the contracts listed there; every other hero house rule stays in force.
- **Recency:** `archival` trend labels (soft UI, Y2K, skeuomorphism, neubrutalism and their aliases) stay reachable but are never presented as "latest 2026". An archival label describes the trend, not the canonical material it resolves to.

### Step 1 · Single-Pass Deterministic Execution (Immediately after `ask_question` is answered)
Once the user answers the `ask_question` prompt (or immediately on Turn 1 if the user explicitly wrote `"skip questions"`):
1. State your **3-Axis Synthesis** in a tight 2-line architectural header summary at the top of your response:
   > **`[BRAND NAME] (Case XX)` — 3-Axis Synthesis:** Surface: *[Tactility]* · Style: *[contract # + name from references/styles.md]* · Rail: *[A 176px per-section / B 200px contents list]* · Hero: *[A–H shape · relation `<relation>` · recipe R1–R8 if any]* · Physics: *[Corner/Stroke]* 
   > **DNA:** Archetype: *[Seed Fusion]* · Mark: *[Kuwayama Primitive + 6-Cast]* · Stack: *[Display + UI Sans + Mono]* · Polarity: *[Theme Scope]*
2. Build the batch asset script (`scripts/build-<slug>.mjs`), 6-panel `<slug>-brandkit.png` board (`brandkit-board.mjs`), and `/design-system/[slug]` showcase route in **one deterministic pass**.

**Reading the seven answers — every one changes a file, or it should not have been asked:**

| Answer | What it decides |
|---|---|
| `surface` | The nine slots in `references/surfaces.md` (§1–§18) or `references/styles.md` (§19–§28) — `ground`, `plate`, `text`, `text2`, `rule`, `radius`, `texture`, `type`, `motion`. Fill all nine before writing a component; two agents given the same contract must land on the same CSS. Auto resolves through the prompt map; a freeform word resolves through the alias table. The chosen contract number is declared in the 3-Axis Synthesis |
| `rail` | `176px` per-section column **or** `200px` contents list — the two layouts are not interchangeable; do not build both |
| `hero` | Exactly one of A–H for the opening stage, and it also decides the footer shape (Pillar VII pairing table). The rail never changes which hero you pick |
| `mark` | The geometric primitive set for `mark.svg`, and the cast must share its cut-line weight |
| `polarity` | Number of `[data-<slug>]` scopes, presence of the navbar toggle, how many token sheets Section 07 renders (4 vs 5), and whether the audit lists a dark-mode gap |
| `build` | *Full page + board + icons* → the showcase route, the board and the cast. *Board only, no web page* → no `src/pages/design-system/<slug>.astro`, no 7 sections, no rail, no hero variants; the board is the deliverable |
| `addons` | *Skip browser tests* → compute contrast in-script, no headless loops. *List it on the site* → `src/data/cases.ts` entry + cover path. *Export spec files* → `DESIGN.md`, `tokens.json`, `<slug>-tokens.css` |

If an answer changes nothing you build, say which answer it changed and where — otherwise you asked a question you ignored.

---

## 2. SEVEN-PILLAR ARCHITECTURAL MANDATES (THE FLAGSHIP BAR)

### Pillar I: Unbounded Archetype Synthesis Engine
Never force a project into a rigid template. Synthesize the visual language dynamically across **3 continuous axes**:
1. **Surface Tactility — one of the 28 catalogued contracts, never a blend:** the 18 canonical materials in `references/surfaces.md` (*Paper & ink*, *Newsprint*, *Risograph*, *Blueprint*, *Cardboard & steel*, *Concrete & rebar*, *Enamel sign*, *Transit map*, *Linen & daylight*, *Marble & brass*, *Chalk plaster*, *Museum wall label*, *Cockpit panel*, *Phosphor terminal*, *Glass & light*, *Pixel grid*, *Airport signage*, *Civic document*) and the 10 modern ones in `references/styles.md` (*Liquid glass*, *Bento / modular grid*, *Scroll-reactive glass*, *Aurora / mesh glow*, *OLED dark-first*, *Exaggerated minimalism*, *Organic biophilic*, *Dimensional layering*, *Spatial / VisionOS depth*, *Neubrutalism*). The Q1 answer fixes the nine slots — `ground`, `plate`, `text`, `text2`, `rule`, `radius`, `texture`, `type`, `motion` — in `surfaces.md` (§1–§18) or `styles.md` (§19–§28), and those nine must be filled before any component is written. A second material may appear only as a one-off accent, never as a competing system. Auto and freeform style words resolve through **Step 0.1**; state the contract number and the reason in one line.
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
  3. **6-Mark Companion Cast (`public/brand/<slug>/cast/*.svg`)**: 6 domain-specific companion symbols drawn on the exact same `64×64` grid and cut-line weight (six nouns from the brand's own operational vocabulary, never generic icons — a shipping identity gets *Parcel, Docket, Pallet, Tape, Route, Depot*; a print studio gets *Sheet, Plate, Squeegee, Register, Drier, Trim*).

> [!CRITICAL]
> **CAST IS CONTENT, NOT A CLOSING COMPOSITION.** The cast is the proof that the mark was drawn as a family, so it belongs to the argument, not to the end of the page. Render it **inside `02 / The Mark`**, under the scale strip, as a `6 × 1` (or `3 × 2`) hairline grid on the page ground — heading, six marks, six nouns, six one-line notes. It may also be a **mid-page inverted band** bounded by `06 Kit` above and `07 Tokens` below. It may **not** be the last band before the footer: a full-bleed band carrying a photograph *and* a lockup *and* a caption, sitting directly above a footer that also carries a photograph and a lockup, makes the page end twice and spends the one closing composition the footer is for. **A band owns one of three things — a photograph, a lockup, or a statement. The footer owns all three, which is why nothing else may sit beside it holding two.**

---

### Pillar III: OKLCH Chromatic Architecture (One or Two Scopes) & Honest Contrast Ledger
Generate a perceptually uniform `oklch(L C H)` primitive palette (`6–12` primitives) tailored to the brand hue ($H$), wired through **Three Strict Token Layers**:
1. **Layer 1 · Primitives (`--xx-cobalt`, `--xx-stock`, `--xx-chalk`):** Named once for the physical material. Primitives **NEVER** flip values in dark mode and **NEVER** use mode prefixes (`--night-ground` is banned).
2. **Layer 2 · Semantic Scope — count follows the Step 0 polarity answer, never a default:**
   - *Daylight only:* `:root` alone. No night block, no `[data-<slug>='night']`, no toggle, no Night sheet, no dark-mode audit line. Write one sentence in Section 07 saying why (a waybill is a white document; a dark one is a different product).
   - *Dual scope, day default:* `:root` plus a second `[data-<slug>='night']` semantic scope over the same primitives (`--xx-surface-page`, `--xx-surface-plate`, `--xx-text-primary`, `--xx-text-secondary`, `--xx-line-strong`, `--xx-line-subtle`).
   - *Dual scope, night default:* the same two blocks, but the page ground is the night scope on load and the toggle switches to day. Never ship a toggle whose two states resolve to the same colours.
   - *Single scope on a dark ground:* one `:root` whose page ground is the dark material. Still no toggle — a single scope is a single scope whatever its lightness.
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

### Pillar V: Non-Template Hero Exploration (8 Flagship Shapes) & 6-Panel Brandkit Board

> [!CRITICAL]
> **ANTI-TEMPLATE HERO LAW — THE SHAPE IS THE RELATION, NOT THE DECORATION:**
> The generic hero is `left reading plate + right glass radar card + 4-cell bottom row`. Every case that reaches for "a panel of text over a photo, plus a small floating card" produces that same page. **Eight shapes ship, and each one is defined by where the type sits relative to the artwork** — that relation is the thing a reader perceives, so changing the photo, the palette or the font does not make a new hero.

**The six relations.** Every hero must declare exactly one, and the shape you picked in Step 0 already fixes it:

| Relation | What the reader sees | Shapes |
|---|---|---|
| `below` | artwork or object first, type underneath on the page ground | A, C |
| `beside` | type on bare ground, artwork in its own column that bleeds to a viewport edge | B |
| `inside` | the hero *is* a printed object and the type is printed on it | D |
| `on` | type sits directly on a full-bleed image, no panel, no card | E |
| `around` | one isolated object, type wrapping the empty space | F |
| `none` / `rhythm` | no artwork at all, or type carried by bands of colour | G, H |

#### The house rules every hero inherits — no exceptions, whatever the shape

These are the laws the shapes below are already shaped by. They were written after a curated build in which a hero passed the anti-template test and still read as assembled: it had an eyebrow, four outlined chips, a hairline docket, a 4-cell strip with `1px` borders and an accent-coloured word in the headline. The composition was fine. Every ornament was the tell.

| Rule | Instead |
|---|---|
| **No eyebrow.** No small label, case number, category line or pill above the `<h1>`. | The headline says what this is. `Case 19 — Identity · design system` above `Every parcel leaves a paper trail.` deletes itself. |
| **No monospace in the hero**, and no tiny uppercase letter-spaced labels anywhere. | The reading face, sentence case, at a size someone reads. Mono is legal in exactly four places on the whole page: the rail number, tabular figures in a ledger, a code sheet, and one data stamp on a photograph. Never a hero label, a nav link or a colophon. |
| **No outlined chips, pill rows, `1px` stat strips or hairline boxes.** | A plain `2×2` `<dl>`: labels at `62%` ink at `13px`, values at `15px/600` with `font-variant-numeric: tabular-nums`, separated by space only. A boundary, if one is truly needed, is a step in tone — never a stroke. |
| **Rules are material, not decoration.** A paper or cardboard surface may print `1px` rules as its own grain (the rail, a ledger row). | A rule may never box a chip, a stat cell or a button, and never separates two blocks that space could separate. |
| **No gradients.** | One compositional exception: a *directional scrim* that lets type sit on a photograph, drawn in the surface's own colour (paper falling away, not black laid on) and described in the hero comment as `scrim 96deg paper → transparent`. The only other exception is the single `#21` / `#22` glow or mesh override in `references/styles.md` §8. |
| **No shadows on anything at rest.** No glow, no blur, no glass, no `backdrop-filter` — including the navbar. Scoped exceptions for glass / mesh / hard-offset contracts are listed in `references/styles.md` §8 and in the table below; nothing else is waived. | A tone step between surfaces; the navbar is a plain bar on the page ground with no border. |
| **No styled accent word.** No italic, coloured, underlined or serif-swapped word inside the headline. | One face, one colour. The words carry the emphasis. |
| **One accent, on the action.** | The accent fill appears on the primary button and nowhere else in the first screen. A second link is plain ink with ` →`. |
| **One dominant image, at least ~45% of the first screen** whenever the brief supplies photographs. | Not a framed thumbnail beside six chips. The photo bleeds to a viewport edge or fills a full column. |
| **The `<h1>` is two lines or fewer at every width** (1440 / 1024 / 390), measured, not assumed. | Cap it in `ch` (`max-width: 18ch`), then shrink the `clamp()`. 33 characters at `15ch` renders as three lines — one character-width of `ch` is the difference between composed and cramped. |
| **A statement is a paragraph.** The lede is `16.5–18px` at `1.55` leading, `44–48ch` wide, in full ink, right under the headline. | Not a `58ch` grey block, not a sentence set at display size. |

#### Scoped overrides for modern contracts

The bans above are waived **only** for the contracts named in `references/styles.md` §8, and only
inside the scope listed there. Everything else — no eyebrow, no monospace hero label, no outlined chip
or `1px` stat box, no styled accent word, one accent on the action, `<h1>` ≤ 2 lines, one dominant
image ≥ 45% when photographs are supplied — is **never** waived.

| Contract | Allowed | Still banned |
|---|---|---|
| `#15` `#19` `#21` `#27` | `backdrop-filter` on panes and nav chrome only | Blur behind reading copy, a coloured bloom, a second blur radius, a frosted hero card |
| `#19` | 1px mullions and one specular top highlight | Gaps plus opaque filler between panes, more than one highlight |
| `#21` `#22` | exactly **one** directional glow or mesh gradient | Text on the mesh, stacked scrims, a gradient behind the `<h1>` |
| `#26` `#28` | exactly **one** hard offset shadow at rest, no blur | A soft shadow, a second lifted element, a second light source |

Every reading surface stays a **solid plate** or a measured scrim. Compute the pane or mesh contrast
and **publish the failing pair in §03** with the job it may not do. Reduced motion keeps the finished
state for every scroll-linked and parallax behaviour.

#### Variant A · Full-Width Field + Overlapping Stat Bench · relation `below`
- **Top Field (`.xx-field`):** full-width `height: min(78vh, 720px)` stage holding the artwork edge-to-edge with a minimal bottom-aligned `.xx-stamp` (`Brand · material · year`). **No headline sits on the artwork.**
- **Opening Below (`.xx-opening`):** a 5-cell `.xx-bench` (`margin-top: -30px; position: relative; z-index: 2; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--xx-line-strong)`) bridges the seam. Below the bench: oversized `<h1>` (`clamp(52px, 8.4vw, 112px)`, `line-height: 0.9`), a `56ch` lede, split-arrow CTAs.
- **Trap:** the bench is the only hairline grid the shape may own, and its five cells are data — never `10 primitives · 6.25:1 · 6 cast marks`, which is a chip row wearing a grid.

#### Variant B · Split Editorial + Full-Bleed Media · relation `beside`
- **The curated build (shipping identity, `Cardboard & steel`):** `.xx-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr); min-height: min(78vh, 730px); background: var(--xx-kraft) }`. The left column is a flex column, `justify-content: center`, gap `clamp(18px, 2vw, 26px)`, with `padding-left: max(clamp(24px, 3.4vw, 56px), calc((100% - 1180px) / 2))` so the type sits on the page's own left edge. The right column is the photograph, `overflow: hidden`, running off the right viewport edge — no frame, no inset, no `border-radius`.
- **Type block:** `<h1>` `clamp(38px, 4.5vw, 68px)`, `line-height: 0.96`, `letter-spacing: -0.032em`, `max-width: 18ch` → two lines at 1440, 1024 and 390. Lede `16.5px/1.56`, `44ch`, full ink. One accent-filled button, one plain `See the mark →` link.
- **Facts:** the `2×2` `<dl>` from the house rules, `16px 28px` gap, pushed `clamp(10px, 2.2vh, 30px)` below the actions.
- **Mobile:** one column, plate `order: 2; height: clamp(240px, 52vw, 380px)`, type column loses its `max()` padding.
- **Crop from the source, not from a default.** `object-position` is a measurement: a landscape photograph whose subject is a torso shot crops at `center top`; a scene with the horizon in the lower third crops at `center 30%`. Look at the asset before writing the value.

#### Variant C · Live Specimen Stage First · relation `below`
- **Top specimen stage:** the system's signature interactive or procedural object across the full shell or viewport, with a `.xx-margin` scale bar (`Sheet 05 · 0—1 km · 1:25 000 · seed 7`).
- **Hero foot below:** display headline, narrative lede, actions, and the `2×2` fact list — not a 4-cell strip.
- The stage must be the brand's own object. A generic "live dashboard" of grey bars is the fake-dashboard tell; if there is no real object, take G.

#### Variant D · Physical Sheet & Torn Edge · relation `inside`
- **Sheet / hoarding stage:** the hero is a physical printed sheet — pinned top edge (`<Pin />` + run/clock metadata row), an oversized mark impression, bold display typography **printed on the sheet**, and a bottom edge cut with an irregular 18-tooth polygon `clip-path`.
- **Trap, learned the hard way:** a printed sheet with a pin row, a docket `<dl>` with hairlines, four chips, a 4-cell strip and a tear is five ornaments deep. Keep exactly two of them. The curated rebuild of this hero dropped the pin row, the chips, the hairline docket and the strip, and kept only the sheet and the photograph; the sheet alone does not earn a hero.
- A tear or perforation on the sheet is legal **once**. If the footer later tears too (F4), one of the two goes.

#### Variant E · Full-Bleed Atmospheric Plate · relation `on`
- **The curated build (mountain identity, `Paper & ink`):** `.xx-hero { min-height: min(88vh, 820px) }` with the photograph `object-fit: cover` and a *measured* `object-position` — the asset was three-quarters bare paper, so the frame was pinned at `84% 100%` to put the ridge in the composition.
- **The scrim follows the photograph's luminance, not a formula.** That source is a paper-white sky over a dark ridge, so the wash is the *paper colour falling away*: `linear-gradient(96deg, paper 97% → 92% 32% → 46% 54% → transparent 68%)` plus `linear-gradient(180deg, paper 78% → 18% 46% → transparent 62%)`. Type inherits indigo-on-paper at `15.8:1`. A `50%` black scrim here would have produced a grey page with a dark stripe.
- **Type on the image:** the `<h1>` at `clamp(50px, 7vw, 104px)/0.9`, one lede of `44ch`, actions, and the `2×2` facts — all on the paper side of the wash. `text-shadow` is a crutch; if the type needs one, the scrim is in the wrong place.
- **Hard bans for E:** no solid reading panel, no frosted card, no "live readout" box in a corner, no lockup pill floating on the photo. Those are the tell that a hero was assembled.
- **Caption:** if a caption belongs on the image, give it a paper bar with `padding: 12px max(var(--xx-gutter), calc((100% - var(--xx-wrap)) / 2 + var(--xx-gutter)))`. Do not stack a `padding-block` shorthand after a `padding-inline` — the shorthand silently wins and the caption drifts off the margin.

#### Variant F · One Object, Isolated · relation `around`
- **Plain ground, one subject:** a single product, tool, specimen or printed object, large, on an unscrimmed ground (paper, seamless, single flat colour). No full-bleed photo.
- **Type wraps it:** the `<h1>` occupies the empty band above or beside the object, the lede and fact list take the opposite corner, and the object's own edge is the only depth on the page.
- Use this whenever the brief's photographs contain **one dominant object** rather than a scene, and the background plate must be a real photograph of that object, never a cut-out on a flat colour that the brand invented.

#### Variant G · Typographic Cover · relation `none`
- **No artwork.** One enormous display line filling the measure (`clamp(64px, 12vw, 190px)`, `letter-spacing: -0.04em`), the case numbers set as a small ledger, the mark `40px` in a corner, one `56ch` lede. Ground is the material itself.
- **Trap:** a hero grid of `auto 1fr auto` rows with `min-height: min(76vh, 720px)` stretches the middle row and opens a 125px canyon between the headline and the lede. Use `auto auto auto` with a `clamp(1.6rem, 2.6vw, 2.4rem)` gap and let the section's `min-height` come from the sum.
- This is the correct answer when the brand has **no usable photograph**, or when the photographs would only ever be decorative.

#### Variant H · Stacked Colour Bands · relation `rhythm`
- **3–5 full-bleed horizontal bands** of different colour or material, each holding exactly one line of the argument, separated by `1px` rules or by nothing at all. The `<h1>` lands in the widest band; the mark in the narrowest.
- **Why it works:** the eye reads the page as a printed chart rather than a layout, and the bands are made of the brand's own primitives, so it cannot drift toward another case's look.
- **Trap:** the bands must carry the argument, not the palette. Five bands of five colours with no sentence in them is a swatch test.

#### Composition recipes (from `references/styles.md` §6)

A style word that names a **layout** does not change the surface. It binds to one of the eight hero
shapes above and to a section. Declare it in the hero comment as `recipe: R1` etc.

| Recipe | Binds to | One-line contract |
|---|---|---|
| R1 · Icon mosaic wall | G / A | A dense grid of *real* app icons with one giant type line threaded through it; no invented logos, no icon library, no card shadows. |
| R2 · Gallery / index grid | §04 / §06 | 12-column thumbnail grid, minimal chrome, one radius, no card shadows, one caption per card. |
| R3 · Live counter band | A bench | Tabular figures bound to real data only; a fake live dashboard is the tell that a hero was assembled. |
| R4 · Bento wall | `#20` + A | Uneven spans, one radius family, one real object per compartment. |
| R5 · Kinetic type cover | `#24` + G | One enormous line, one rule, no eyebrow, two lines or fewer. |
| R6 · Storytelling scroll | H / C, `#27` | 3–5 bands, one line of the argument per band; reduced motion freezes the final frame. |
| R7 · Interactive product demo | C | The stage must be the brand's own object; with no real object, take G. |
| R8 · Full-bleed atmospheric plate | E | One dominant image, one directional scrim in the surface's own colour, no panel. |

#### The composition clause — read this before drawing any hero
1. **State the relation in one line** in the hero section comment: `hero: E · relation on · scrim 96deg paper → transparent · type on image`.
2. **A `plate` is not the default.** Only B and D may hold a rectangular panel of type, and on B the panel is the *page ground itself*, not a card. If your hero has a rounded rectangle holding an eyebrow, a headline and a paragraph, and a second smaller rounded rectangle beside it, you have built the banned generic hero — stop and re-pick.
3. **Photographs are material, not wallpaper.** If the brief supplies photographs and you pick A, C, F or H, at least one must be used as a *texture* — a band fill, an isolated cut-out, a dither source — not only as a backdrop.
4. **Measure the crop and the line count.** `object-position` comes from the asset's actual composition; the `<h1>` line count is verified at 1440 / 1024 / 390 before the hero is called done.
5. **Vary across the library.** Before choosing, list the shapes already used by the cases in `src/data/cases.ts`. Do not pick a shape the two most recent cases already use; if the Step 0 answer points at one of those, say so in one line and take the nearest shape with a different relation.
6. **Verify the frame before shipping:** `scrollWidth === clientWidth` at 1440 / 1024 / 768 / 390, zero console errors, and the hero's own height printed once (`702px` at 1440 is a hero; `1149px` is a hero with a canyon in it).

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
> **NAVIGATION & RAIL MANDATE (BOTH SUPPORTED RAILS):**
> 1. **Hero is Unnumbered:** The Hero / Opening stage is **never** numbered `01`. Section numbering (`01` through `07`) begins at the first content section below the hero (`01 / Premise` or `01 / Idea`).
> 2. **Navbar Links Have Zero Numbers:** The sticky top navigation bar carries the brand mark + name on the left, **clean word-only section links without numbers** (`Idea`, `Mark`, `Colour`, `Surfaces`, `Type`, `Kit`, `Tokens`) in the center, and the theme scope toggle on the right **only if Step 0 chose a dual scope** (a geometric `.dot` or `<i>` square, never emojis) — a single-scope build has no toggle at all.
> 3. **Section Numbers Live in the Left Rail (Two Supported Architectures):**
>    - **Option 1 · Per-Section Rail (Rail A, default):** Each `.sec` has a `1px` top border (`border-top: 1px solid var(--xx-line-strong)`) and wraps both `.rail` and `.body` inside `.sec > .wrap`:
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
>    - **Option 2 · Sticky Contents List (Rail B):** Below the hero, a single outer `<div class="shell layout">` (`display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 56px; align-items: start`) holds a sticky `<nav class="contents" aria-label="Contents">` sidebar with an `<ol>` of `01`..`07` links (highlighting `aria-current="true"` via `IntersectionObserver` or scroll position) alongside the `<div>` stack of all 7 sections.

#### The 7 Canonical Numbered Sections (Below the Unnumbered Hero)

1. **`01 / Premise (or Idea)`**
   - Section headline (`h2`) + lead paragraph (`p.big`) + 4 Premise cells (`Belief`, `Enemy`, `Material`, `Reject it when` in a `2×2` `.two` hairline grid) + **4 structured Decision Cards** (`.decs` `2×2` grid) where every card states: `Decision` (`h3`), `Because`, `Not when`, and `Breaks next`.
2. **`02 / The Mark`**
   - Kuwayama construction narrative + 4-tile `.logo-grid` (`Primary`, `Reverse` on a loud ground, `Compact · 16–24px`, `Glyph`) + horizontal/reverse/stacked `.lock` rows + multi-size scale strip (`96`, `48`, `32`, `24 compact`, `16 compact`, `16 glyph`) + 3 structural rules (`Clear space`, `Never`, `Below 24px`) + optional scored concept bake-off table or 1-click SVG copy.
   - *Companion Cast Placement:* **Default — render the 6-Mark Companion Cast here**, directly under the scale strip, as a `6 × 1` hairline grid on the page ground (`.castin`): a `13px` heading, six `26px` marks, six nouns, six one-line notes. *Exception —* a mid-page inverted band between `06 Kit` and `07 Tokens` is allowed **only** with flat ink ground, six marks and one heading: no photograph, no lockup, no caption (see the Pillar II cast law). Never place it after `07 Tokens` or immediately above the footer.
3. **`03 / Ink (or Colour)`**
   - Click-to-copy primitive swatch cards (`grid-template-columns: repeat(4, 1fr); gap: 1px`, showing color chip, token name, hex/OKLCH, and role) + the **complete Measured Contrast Ledger** (`.pairs` rows with dual 30×30 color chips, pair label, computed ratio, and assigned semantic job—explicitly highlighting the `1–3` failing pairs and what job they may *not* do).
4. **`04 / Surfaces` (Comparative Surface Grid — No Range-Slider Stage)**
   - **Never build a fake blur/tint range-slider stage unless explicitly requested.** Instead, use the count-then-cut architecture — state the real number tried and the real number kept in the intro line (`"Eight surfaces were tried. Five survived."`), and never write a count that does not match the cards rendered:
   - Render a `2-column` `.surf` hairline grid (`grid-template-columns: 1fr 1fr; gap: 1px; background: var(--xx-line-subtle)`) of **4, 6 or 8 explored surface cards** (`.sc`) — an even count, so the last row never ends ragged.
   - Each card has:
     1. A `210px` live visual `.demo` box at the top demonstrating that exact surface treatment in real CSS/SVG/imagery (e.g., *Stipple / Artwork field*, *Ordered Bayer dither band*, *Register ghost type*, *Ruled ledger rows*, *Frosted pane that smudges the texture*, *Torn/cut clip-path edge*, or *Lifted paper seam*).
     2. A `.txt` body below with a flex header (`<b>Surface Title</b>` + monospace verdict tag `Shipped — the hero`, `Shipped — section dividers`, or `Rejected`) and a concise paragraph explaining *why* it survived or *why* it was rejected so nobody re-proposes it in six months. Cards with `rejected: true` get `.rej` (`filter: saturate(0.55)` on `.demo` and muted verdict tag).
   - Explored cards may include modern idioms from `references/styles.md` (e.g. *Frosted plate — Rejected*, *Scroll-reactive glass — Shipped — navbar*). A rejected modern idiom still counts toward the stated "tried" number, and its reason must name the house rule or the contrast pair it broke.
5. **`05 / Type (or Voice)`**
   - Live rendered type scale rows (`.tscale`: `132px` metadata column with role/font/weight/size/leading/tracking + live sample rendered at its real CSS size) + **2-column domain specimens** (`Display` multi-line specimen + `Reading` 66ch paragraphs + `Figures` tabular right-aligned table + `Labels` tracking rule).
6. **`06 / The Kit (or Domain Workbench)`**
   - A `2×2` `.kit` hairline grid of pressed/tactile UI controls and domain components (`Buttons` with primary/ghost/small/disabled states, `Chips & tags` with status indicators, `Fields` with a double-reported error summary + `aria-invalid="true"` input state, and `Data rows / Domain workbench` with `tabular-nums` alignment and live interactive selection).
7. **`07 / Tokens (and Honest Audit Ledger)`**
   - `2-column` `.sheet` grid of copyable code blocks — 4 cells on a single scope, 5 on a dual scope (`1 · Primitives`, `2 · Day Scope`, `3 · Component Tokens`, `4 · Physics` on a single scope — insert `3 · Night Scope` and shift the last two to `4` / `5` **only on a dual scope**) with 1-click `Copy` buttons + optional **Audit & Known Gaps** ledger (`What is verified, and what is not` + `2×2` `.gaps` cards), then the closing band and the footer built per Pillar VII.

### Pillar VII: Footer Shapes — The Hero Turned Around

> [!CRITICAL]
> **FOOTER LAW — THE FOOTER IS A SECOND COMPOSITION, NOT A CREDIT LINE:**
> The generic footer is `mono line · 1px border-top · two spans pushed apart`. That is a colophon, not a design. It is also the single most reliable tell that a page was assembled from a template, because it is identical on every page. **Five footer shapes ship, and the footer shape is derived from the hero shape — never copied from the last case.**

**The pairing table.** Pick the footer from the hero answer, then vary the one dimension named in the last column. Two cases may share a footer family; they must never share the variation.

| Hero | Footer shape | Why the pairing holds | Vary by |
|---|---|---|---|
| A · Banner + bench | **F1 · Bench echo** — the same 5-cell grid returns at the bottom, holding place, year, licence, one link, the mark | the bench that opened the page closes it | which cells carry links vs. plain data |
| B · Text left, photo right | **F5 · Plate & receipt** — the photograph returns as a full-width band, then a receipt row underneath carrying the lockup, one statement and the data | the column that opened becomes the band that closes | which receipt field leads, and the plate's height |
| C · Live demo | **F3 · Frozen specimen** — a small, static, final frame of the live object (same seed, last state) above the colophon | the live thing is shown stopped | whether the frame is captioned `Fig. 07 · final state` |
| D · One giant sheet | **F4 · Torn receipt** — a paper strip with a torn or perforated top edge carrying the sign-off, then a plain colophon underneath | the sheet is torn off and kept | tooth count / which side is torn |
| E · Full-screen photo | **F2 · Reversed split** — the photograph returns on the *left*, the closing statement and links on the *right* | the composition flips, the page bookends | image crop / which side the scrim falls from |
| F · One object | **F3 or F1** — the isolated object repeated small and alone on the plain ground, sign-off beside it | catalogue-plate bookend | object scale / which side it sits |
| G · Typographic cover | **F4 or F1** — a final typeset block: one large line, the ledger of case numbers | type opened, type closes | number of rules |
| H · Stacked bands | **F2 or F4** — the last band widens and holds the sign-off, or the bands invert to a single tall band | the rhythm resolves | band count / inverted order |

#### Shape F1 · Bench echo
A `repeat(5, 1fr)` grid (`gap: 1px; background: var(--xx-line-strong)`) with 5 cells, each `padding: 22px 20px`, holding a label above a value. Cells 1–3 are data (place, year, licence), cell 4 is one real link, cell 5 is the mark at `28px`. Below it a `56px` bar with the copyright and the back-link. **Bans:** no photo, no glass, no card, and no mono label — sentence case at a size someone reads.

#### Shape F2 · Reversed split — the curated build
```css
.xx-foot__split { display: grid; grid-template-columns: 0.92fr 1.08fr; gap: 1px; }
.xx-foot__art   { position: relative; overflow: hidden; min-height: clamp(300px, 34vw, 440px); background: var(--xx-surface-plate); }
.xx-foot__say   { background: var(--xx-surface-page); }   /* ← required, see trap 2 */
.xx-foot__art > img      { width: 100%; height: 100%; object-fit: cover; object-position: center 52%; }
.xx-foot__art > img.xx-foot__lock { position: absolute; width: auto; height: 26px; left: clamp(20px, 3vw, 40px); bottom: clamp(46px, 5vw, 64px); max-width: 60%; object-fit: contain; filter: none; }
```
- **Trap 1 — specificity.** `.xx-foot__art img { width:100%; height:100% }` is `(0,1,1)` and silently beats `.xx-foot__lock` at `(0,1,0)`: the lockup scales to the column and gets clipped to two letters. Scope the photo rule with `>` and put the lockup rule at `.xx-foot__art > img.xx-foot__lock`. Measure it afterwards (`86.9 × 26px` is right; `200px` tall is the bug).
- **Trap 2 — the 1px split gap.** `gap: 1px` exposes the parent's background between the columns. If the statement column has no explicit `background`, the page's own ground bleeds through as a grey stripe down the footer. Give it a surface token.
- **Right column content:** one statement at `clamp(24px, 2.6vw, 34px)` on a `34ch` measure, a `48ch` sub-line, and the link row. No eyebrow above the statement — the statement is the opening line.
- **Mobile:** the artwork goes *below* the statement (opposite of the hero, where it went above).

#### Shape F3 · Frozen specimen
A `min(340px, 42vh)` stage holding a static final frame of the brand's own live object — the dither field at its last seed, the chart at its final value — captioned at the bottom-left. No scrim, no overlay type: the object is the whole composition. Colophon bar below.

#### Shape F4 · Torn receipt
A paper or kraft strip (`background: var(--xx-surface-plate)`, `clip-path` with 14–20 teeth on the top edge, `margin-top: -1px`) carrying the reverse lockup at `30px`, one `30ch` sign-off line, and the mark small at the far right. Then a plain rule and a single-line colophon. **Ban:** never combine the torn edge with a photograph; the strip must read as paper. If the hero is D (a torn sheet), the footer may not tear as well — one tear per page.

#### Shape F5 · Plate & receipt — the curated workhorse
For any case whose hero carries a photograph band: the photograph returns full-width, and the receipt is set underneath it as a real form, not a link row.
- **The plate.** `height: clamp(230px, 25vw, 350px)`, `object-fit: cover`, `object-position` measured from the asset (`34% 50%` put the hands and the signed tablet in frame), caption as a small chip on the surface colour at the bottom-left, e.g. `Plate 02 · the receipt, signed at the threshold`.
- **The receipt row.** `grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) auto; gap: 28px; padding-block: 34px 30px`:
  1. lockup at `22px` + the closing statement on a `22ch` measure;
  2. a `<dl>` of three real fields (received in / gross weight / signed at), carrying `border-left: 1px solid` at `26%` ink so the gap reads as a ruled form cell — the one place a rule is the material;
  3. the mark inside a bordered cell with one line of provenance (`1 of 1`).
- **Alternates from the same family, already shipped:** *plate above a statement* (a `clamp(210px, 26vw, 330px)` full-bleed plate, caption chip, statement below on the ground) and *plate beside the stage* (`.xx-foot__stage { display: flex; gap: clamp(1.5rem, 3vw, 3rem); min-height: clamp(300px, 34vw, 430px) }` with the figure at `flex: 0 0 40%`, the sign-off in the remaining space, stacking under 900px with the photo at `208px`).
- **The footer photograph is never the hero photograph.** If the hero used the table, the footer uses the dish; if the hero used the handoff, the footer uses the signature. A repeated image reads as a mistake, not a bookend.

**Footer content contract — every footer carries all five, and nothing else:**
1. The mark or the lockup, one of them, not both.
2. One closing line that is a *statement*, not a thank-you (`Every parcel leaves a paper trail.`).
3. Three to four real links, each a real destination on the page or in the brand.
4. The provenance row: place, year, licence or version.
5. The back-link to the shelf.

Anything else — a newsletter field, a social icon row, a sitemap — is filler and must be cut. If a cell has nothing real to say, delete it and re-balance the grid; never pad it.

> [!CRITICAL]
> **ONE CLOSING COMPOSITION PER PAGE.** The footer is the page's only full-bleed closing band. Anything above it that carries a photograph with a lockup on it is a second footer, and the first one wins: the real footer then reads as an afterthought. If the cast, a CTA or an "endcap" band wants that slot, it gives up its photograph or it moves into a section — and if the closing band *is* the design you want, it becomes the footer and the footer's data folds into it.

**Footer house rules.**
- **A footer is a band, not a strip.** Give it `min-height` or a plate: `220–440px` of composition, not a `52px` bar with two spans.
- **The statement carries the footer.** `clamp(24px, 2.6vw, 34px)`, two lines at most, in full ink on its own surface.
- **No mono colophon.** The provenance row is set in the reading face; tabular figures where numbers align.
- **No gradient on the plate** except one directional scrim in the surface's own colour when the lockup sits on the photograph.
- **Two consecutive cases in `src/data/cases.ts` never share a footer family**, and no two cases share the family *and* the variation.
- **The caption names what the picture is** (`Plate 03 · the run`) — never a sentence about where the picture came from.

**Immersive-footer clause (applies to F2–F5).** The footer must survive `prefers-reduced-motion` looking finished, and any animation in it must be a *completion*, not an entrance — the last state is what a screenshot shows. A footer whose lockup only appears after a scroll-triggered fade has no footer in a static capture, which is how it gets judged.

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
- [ ] Hero is **unnumbered**, uses the **Hero shape chosen in Step 0 Q3** (not the generic two-card hero), and the sticky navbar links have **zero numbers** (`Idea`, `Mark`, `Colour`, `Surfaces`, `Type`, `Kit`, `Tokens`).
- [ ] Section numbers (`01`..`07`) live inside the left rail—either the **Per-Section Rail** (`.sec > .wrap` wrapping a `176px` sticky `.rail` + `.body`) or the **Sticky Contents List** (`.shell.layout` wrapping a scroll-spy `<ol>` + content column).
- [ ] Section `04 / Surfaces` uses the **Comparative Surface Grid** (`2-col` grid of 4, 6 or 8 `.sc` cards — an even count so the last row is never ragged — with `210px` live `.demo` boxes + `Shipped` / `Rejected` verdicts, no range-slider stage).
- [ ] Mark family includes a separate `16px` compact drawing (`mark-compact.svg`) + 6 companion cast marks (`cast/*.svg`) on the 64-unit grid.
- [ ] Section `01` includes 4 `Decision / Because / Not when / Breaks next` cards, and Section `03` publishes at least 1–3 failing contrast pairs with a restricted non-text job.
- [ ] **Scope parity:** the shipped page matches the Step 0 polarity answer exactly. A single scope has no theme toggle in the navbar, no second token sheet, no `[data-<slug>='night']` block, and no dark-mode audit line. A dual scope has all four. Never leave a toggle that does nothing, and never leave a "no dark mode" sentence in a page that has one.
- [ ] **Count parity:** every stated number matches what renders — the surface intro line ("Eight surfaces were tried. Five survived.") matches the card count and the verdict tags, the token-sheet count matches the scope answer, the Q1 selector has 8 options (Auto + 7 named picks), and the cast is exactly 6.
- [ ] **Style contract declared:** the 3-Axis Synthesis names exactly one of the 28 contracts, all nine slots are filled, and no two contracts are blended. A freeform style word resolves through `references/styles.md` §5 as a contract, recipe R1–R8, behaviour B1–B5, or out of scope; an `archival` style is never called a 2026 trend.
- [ ] **Hero relation declared:** the hero section comment names one shape letter and one relation (`below` / `beside` / `inside` / `on` / `around` / `none` / `rhythm`), and the built hero matches it. No hero contains both a rounded text panel *and* a second smaller floating card.
- [ ] **Hero house rules:** no eyebrow, no mono label outside code, no outlined chip/pill row, no `1px` stat strip or hairline box, no gradient except one directional scrim in the surface's own colour or one scoped `#21` / `#22` mesh override, no shadow or `backdrop-filter` at rest except the `references/styles.md` §8 contracts (panes / nav chrome only, plus one hard offset for `#26` / `#28`), no accent-coloured word in the `<h1>`, and the accent appears on the primary action only. Reading copy stays on solid plates or measured scrims, and any pane / mesh contrast failure is published in §03.
- [ ] **Hero measured:** the `<h1>` is two lines or fewer at 1440 / 1024 / 390, the lede is `44–48ch` in full ink, the crop's `object-position` was chosen from the asset (not a default), and `scrollWidth === clientWidth` at all four widths.
- [ ] **Footer shape declared:** the footer names one of F1–F5 in a comment, that shape is the one Pillar VII pairs with the chosen hero, and it carries all five contract items and no filler. Two consecutive cases in `src/data/cases.ts` do not share a footer family.
- [ ] **Cast placement:** the 6-mark cast sits inside `02 / The Mark` (or as one mid-page inverted band between 06 and 07), it carries no photograph, no lockup and no caption, and nothing that carries a photograph *and* a lockup sits immediately above the footer.
- [ ] **Footer is a band, not a strip:** it has real height (`min-height` clamp or a photograph plate), its statement is set at `clamp(24px, 2.6vw, 34px)`, its photograph is a *different* asset from the hero's, and its lockup measures `≈26px` tall (`width: auto; object-fit: contain`) with the rule scoped as `.foot__art > img.foot__lock`.
- [ ] Zero emojis (`☀️`, `🌙`) in UI chrome; all 3 fonts load live.

---

## FIGMA HANDOFF · ONE CANONICAL SPEC → NATIVE PLUGIN

A design system that only exists as HTML is a website. Since **v5.0.0** the
handoff is **plugin-only**: the HTML sheet emits one signed canonical spec, and
the native replay plugin is the only Figma import. Doop / html.to.design become
**preview and reference only** — their docs call the result "a snapshot, not a
sync: auto layout, variables, and components aren't recreated." A migration
action upgrades an existing flat import in place instead of asking for a
re-import.

Why: the audit of `test ds 3.fig` measured a Doop page at 1575 nodes with
**0** auto layout / **0** variables / **0** bound styles, against plugin pages
that had 127 auto layouts but only 998 nodes — the two flows were measuring
different documents. Root causes: the live window was captured at 2504px while
headless used 1440px; Canvas Grid equalised row heights; the token payload was
empty for kits that only ship `meta/primitives/contrast`; and re-running left
stray collections behind. All four are fixed below.

**One source, three emitters — all regenerated from the same `tokens.json`:**

| Script | Output | What it owns |
| --- | --- | --- |
| `scripts/figma-html.mjs` | `public/brand/<slug>/<slug>-figma.html` | 8 white sheets, inlined SVG, canonical 1440px v2 manifest + embedded Plugin ZIP, `data-figma-component` variants, `?clean=1`, canvas-grid preview |
| `scripts/figma-forge.mjs` | `manifest.json` + `code.js` | variables (Light/Dark + aliases), paint/text/effect/grid styles, component variants |
| `scripts/figma-bind.mjs` | `manifest.json` + `code.js` | binds imported layers back to those variables and styles by measured value |

One command runs all three emitters, derives CSS / brand / name from the token
file, and executes both smoke tests. `--check` is a dry run; `--infer-layout`
passes through to the binder for flat Doop imports.

```bash
node scripts/figma-handoff.mjs --slug <slug> --root . --check
node scripts/figma-handoff.mjs --slug <slug> --root .
```

Or run the emitters individually:

```bash
# 1 · the sheet (accepts --tokens for layouts that keep tokens outside features/)
node scripts/figma-html.mjs --slug <slug> --root . --check
node scripts/figma-html.mjs --slug <slug> --root .

# 2 · the system (see references/figma-export.md for the full forge contract)
node scripts/figma-forge.mjs --tokens <tokens.json> --css <tokens.css> \
  --brand <brand dir> --html <page.html> --slug <slug> --name "<Name>" \
  --out design/figma/<slug> --target figma

# 3 · the binder (post-processor, ~one screen of Figma API)
node scripts/figma-bind.mjs --slug <slug> --root . --check
node scripts/figma-bind.mjs --slug <slug> --root . --out design/figma/<slug>-bind
node scripts/figma-bind-smoke.mjs design/figma/<slug>-bind/code.js
```

### Canonical capture (v2 manifest)

`scripts/lib/canonical.mjs` is the shared contract. `buildSystemSpec()` folds
tokens.json **plus** the sheet's own scales, CSS custom properties, canonical
type roles, spacing/radius scales, elevation effects, fonts, grid and component
definitions into one `system` object — a Mullion-style kit with only
`meta/primitives/contrast` still ships 60–90 colours and 10+ type roles.

The page's `buildFigmaManifest()` clones the document into a **fixed 1440px
iframe** with all body modes cleared, all 8 sheets visible, and coordinates
relative to each sheet root. The toolbar buttons, the Plugin ZIP seed and
`figma-manifest.mjs` all call that same async function, so a 2504px Canvas Grid
window, an 820px window, `?sheet=3` and headless Chrome produce the **same
checksum and the same geometry**. Every node carries `id`, `role`, `tokenRef`,
`styleRef` and `componentRef`; the manifest is signed with an FNV-1a checksum
(`CHECKSUM_JS` is injected verbatim, so browser and Node cannot drift).

Top-bar controls: **⇄ Auto Layout** (inspector), **⤓ Copy for Figma**,
**⤓ Manifest**, **⤓ Plugin** (a self-contained ZIP with the canonical manifest
baked in). **Sheet 08 · Patterns & Tokens is always in the spec but stays
optional in Figma** — the checkbox defaults off.

The plugin builds a complete, **idempotent** library: colour collections (primitives
+ three 10-step ramps + semantic surfaces + on-demand `Auto/#RRGGBB` for any
colour the token file omits), spacing/radius FLOAT variables, paint / text /
effect / grid styles, all upserted by name. Every SOLID fill — including text
ink — is bound to a variable; every TEXT node is bound to a text style (minted
from its own metrics when no token role matches, so binding never changes
appearance). Components become real variant sets with descriptions and live
instances in a `◆ Component Library` frame. **Upgrade existing pages** binds a
flat Doop import in place; re-running reports zero changes.

```bash
node scripts/figma-handoff.mjs --slug <slug> --root . --with-replay
node scripts/figma-replay-smoke.mjs design/figma/<slug>-replay/code.js \
  --manifest design/figma/<slug>.manifest.json
node scripts/figma-parity.mjs --manifest design/figma/<slug>.manifest.json \
  --plugin design/figma/<slug>-replay/code.js --fig "test ds 3.fig"
```

`figma-parity.mjs` gates the handoff: node/text counts within 2%, sheet geometry
within 2px, exact colours, ≥95% text bound to styles, ≥90% fills bound to
variables, ≥1 instance per component, zero duplicate collections, and a safe
re-run. The `.fig` delta is reported as an informational reference — Doop is a
snapshot importer, not a contract.

Paths:

- **B · native replay (default)** — `--with-replay` → one plugin, no importer.
- **A · legacy importer** — build plugin → import with html.to.design / Stitch →
  bind plugin. Kept for reference, not the recommended handoff.

For path A, in Figma: run the **build** plugin → import `<slug>-figma.html` →
select the imported frames → run **`<Name>` — bind**.

`--infer-layout` on the binder opts into Figma's `inferredAutoLayout` heuristic
for flat imports (Doop, screenshots, hand-drawn frames). **Leave it off** after
an HTML importer: re-applying `layoutMode` to a frame that already reflows
correctly moves its children. The binder always binds SOLID fills/strokes by
measured RGB and text nodes by font size + family; it never guesses a colour by
name. If no local COLOR variables exist it creates the primitive colour
collection from the token file and says so on close — colours only, not styles.

**Honest limits:** CSS gradients/scrims, `clip-path` edges, grain/dither,
pseudo-elements, `backdrop-filter`, transforms, `object-position` crops and
responsive breakpoints do not survive. A `.fig` stores font family names, not
font data — ship the `.ttf` files and outline the display face. One viewport per
frame; 390px is a separate frame someone has to draw.

**Audit gate:** a Figma handoff is not done until `figma-smoke.mjs` passes on the
build plugin, `figma-bind-smoke.mjs` passes on the binder, `figma-replay-smoke.mjs`
passes on the native plugin (including the upgrader), `figma-parity.mjs` reports
all **17** gates green, and the sheet opens in a browser with all 8 sections.

### v5.1.0 · layer quality (from `test ds 4.fig`)

Four defects were measured on a real export: blank components/overlays pages,
an off-canvas 420×120 library, collapsed modal action bars, and wrapped button /
badge / title text. Fixes: never `clone()` a sheet-nested component — rebuild
variant masters from the manifest into page-level COMPONENTs; put a full-width
library board **above** the sheet on the component-bearing pages; keep the
measured width of HORIZONTAL frames (`FIXED` primary axis); detect one line from
`box.h − paddingY` vs `lineHeight` / `whiteSpace`, never from `box.h` alone. The
HTML also declares `white-space: nowrap` for one-line labels so a Doop import
does not substitute a wider font and wrap them. Assets icons are now real
components (7 families, 34 refs, 7 sets, 34 instances per kit). Parity added
four structural gates; all 25 cases + 3 kits pass.

**v5.2.0** (from `test ds 5.fig`): **never put a COMPONENT node inside a sheet**
— Figma promotes its container to the page root, which blanked pages 05/06/07.
Sheets are plain FRAMEs; only library masters are COMPONENTs. Duplicate generated
pages are removed in a final pass (a stale page survived `replace` under
dynamic-page). The library board uses explicit geometry with `clipsContent=false`
(auto-layout height stayed 120px and clipped 1036px of sections). Circles clamp
`cornerRadius` to `min(w,h)/2` and every appended child is re-pinned to its
measured box (a 52×52 logo had become 52×30). `?clean=1&doop=1` renders a
single-column, chrome-free, shadow-free sheet for Doop / html.to.design imports,
with slack on one-line labels so a substituted font cannot clip them. Parity is
now **19 gates** (added *no components in sheet*, *circles stay round*).

**v5.1.1 hardening** (after a real Figma run still hugged a footer): every
HORIZONTAL frame is re-pinned to its measured width *after* children are
appended, and `stretchRows()` sets `layoutAlign = STRETCH` on horizontal
children of VERTICAL frames — rows can no longer collapse. `boundFill()` falls
back to a plain SOLID paint when a variable binding is rejected, so library
chrome can never render as an empty fill. The board sits at the page origin and
the sheet is offset below it. The toast/UI are stamped `v5.1.1` and the plugin is
named `<Brand> — replay v5.1.1`; if the toast does not start with that, Figma is
running an older imported build — re-import the Plugin ZIP.

---

## 5. POST-BUILD OPEN DIALOGUE PROTOCOL

End every response with this compact 1-keystroke action menu:

> **Next Step — Reply with a code (or combine, e.g., `A + C`):**
> - **`[A] Tailwind v4 / CSS Token Export`** — Standalone `tokens.css` with OKLCH `@theme` variables and font rules.
> - **`[B] Figma Handoff`** — `<slug>-figma.html` 8-sheet import doc, the generated variables/styles/components build plugin, and the bind plugin that reconnects imported layers. See *FIGMA HANDOFF* above.
> - **`[C] Extract Section 06 Kit Components`** — Package the kit and domain controls into modular `components/ui/` TSX files.
> - **`[D] Remix Rail / Hero / Archetype`** — Name any shift (e.g., *"Switch to Rail B + Hero B"*) for a surgical git patch diff.
