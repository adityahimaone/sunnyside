---
name: sunnyside-brand-system
version: 4.6.0
description: 'Unbounded, single-pass brand identity and interactive design system generator. Starts with a 7-question Step 0 ask_question scope gate written in plain geometry, not case names: surface material, rail (2 shapes), hero (8 shapes), mark construction, colour polarity (1 or 2 scopes, binding on the toggle and token sheets), build scope, and add-ons. Then synthesizes a custom archetype, Kuwayama-grade parametric SVG marks + a 6-mark companion cast, a 6-panel 1500x1125 brandkit board, a comparative surface exploration grid, OKLCH tokens in the chosen polarity, an unnumbered-hero 7-section interactive showcase page, and a footer shape derived from the hero rather than copied from the last case.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '4.6.0'
---

# SUNNYSIDE BRAND SYSTEM ENGINE (v4.6 · Two Rails + 8 Hero Shapes + 4 Footer Shapes + Surface Grid)

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
      "header": "Material",
      "question": "1. Surface & Material — if this brand were a physical object, what would it be made of? Eight of the eighteen surfaces are here; the rest are reached through references/surfaces.md.",
      "multi_select": false,
      "options": [
        { "label": "(Recommended) Paper & ink", "description": "Like a book page or a screen-printed poster. Warm uncoated stock, flat solid colour, no glow, no blur, no gradient, 0px corners." },
        { "label": "Cardboard & steel", "description": "Like a warehouse or a shipping container. Kraft and cold grey, sharp rectangular grid, 1px rules, 0px corners, plain sans type." },
        { "label": "Linen & daylight", "description": "Like an interior magazine. Sunlit warm background, editorial serif headlines, soft panels with real blur, 12px corners." },
        { "label": "Cockpit panel", "description": "Like an aircraft dashboard. Near-black ground, dense table rows, 1px hairlines, very high contrast, monospace numbers everywhere." },
        { "label": "Airport signage", "description": "Like a terminal direction sign. Bold signal colour blocks, oversized numerals, heavy structural lines, no cards, no rules." },
        { "label": "Concrete & rebar", "description": "Like a poured concrete wall. Cool mid-grey, matte, fine grain, 2px rules, 2px corners, heavy grotesque type." },
        { "label": "Phosphor terminal", "description": "Like a CRT monitor. True black, green or amber text, scanlines, mono only, 80ms snap, 0px corners." },
        { "label": "Marble & brass", "description": "Like a hotel lobby. Off-white marble with faint veining, warm brass as the plate, high-contrast serif, small-caps labels." }
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

### Step 1 · Single-Pass Deterministic Execution (Immediately after `ask_question` is answered)
Once the user answers the `ask_question` prompt (or immediately on Turn 1 if the user explicitly wrote `"skip questions"`):
1. State your **3-Axis Synthesis** in a tight 2-line architectural header summary at the top of your response:
   > **`[BRAND NAME] (Case XX)` — 3-Axis Synthesis:** Surface: *[Tactility]* · Rail: *[A 176px per-section / B 200px contents list]* · Hero: *[A–E shape]* · Physics: *[Corner/Stroke]*  
   > **DNA:** Archetype: *[Seed Fusion]* · Mark: *[Kuwayama Primitive + 6-Cast]* · Stack: *[Display + UI Sans + Mono]* · Polarity: *[Theme Scope]*
2. Build the batch asset script (`scripts/build-<slug>.mjs`), 6-panel `<slug>-brandkit.png` board (`brandkit-board.mjs`), and `/design-system/[slug]` showcase route in **one deterministic pass**.

**Reading the seven answers — every one changes a file, or it should not have been asked:**

| Answer | What it decides |
|---|---|
| `surface` | The nine slots in `references/surfaces.md` — `ground`, `plate`, `text`, `text2`, `rule`, `radius`, `texture`, `type`, `motion`. Fill all nine before writing a component; two agents given the same surface must land on the same CSS |
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
1. **Surface Tactility — one of the eighteen catalogued materials (`references/surfaces.md`), never a blend:** *Paper & ink* (uncoated stock, flat ink, stipple or register ghost) · *Cardboard & steel* (kraft, grey metal, 1px rules, 0px corners) · *Linen & daylight* (warm sunlit ground, editorial serif, real-blur glass) · *Cockpit panel* (dense tabular rows, hairlines, monospace, clinical contrast) · *Airport signage* (signal colour blocks, oversized numerals, heavy structural lines) · *Concrete & rebar* (cool mid-grey, matte grain, 2px rules, 2px corners) · *Phosphor terminal* (true black, green or amber, scanlines, mono only) · *Marble & brass* (off-white veined ground, brass plate, high-contrast serif, small caps). Whichever was chosen sets the nine slots in `references/surfaces.md` — `ground`, `plate`, `text`, `text2`, `rule`, `radius`, `texture`, `type`, `motion` — and those nine must be filled before any component is written. A second material may appear only as a one-off accent, never as a competing system. If the brief's theme implies a surface that is not one of the eight in Step 0, use the prompt-mapping table in `references/surfaces.md` and state the choice in one line.
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
| `beside` | type on bare ground, artwork in its own column | B |
| `inside` | the hero *is* a printed object and the type is printed on it | D |
| `on` | type sits directly on a full-bleed image, no panel, no card | E |
| `around` | one isolated object, type wrapping the empty space | F |
| `none` / `rhythm` | no artwork at all, or type carried by bands of colour | G, H |

#### Variant A · Full-Width Field + Overlapping Stat Bench · relation `below`
- **Top Field (`.xx-field`):** full-width `height: min(78vh, 720px)` stage holding the artwork/stipple/photo edge-to-edge, with a minimal bottom-aligned monospace `.xx-stamp` bar (`Brand · material · year` / `Primary hex / ground hex`). **No headline sits on the artwork.**
- **Opening Below (`.xx-opening`):** a 5-cell exposed-hairline `.xx-bench` (`margin-top: -30px; position: relative; z-index: 2; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--xx-line-strong)`) bridges the seam. Below the bench: oversized `<h1>` (`clamp(52px, 8.4vw, 112px)`, `line-height: 0.9`, optional register-ghost `text-shadow`), a `56ch` lede, split-arrow CTAs.

#### Variant B · Split Editorial + Framed Media · relation `beside`
- **2-column asymmetric grid:** left column on the bare ground — eyebrow, editorial `<h1>`, `60ch` lede, 4 compact `.pill` badges (`<b>27</b> tokens`, `<b>8.71:1</b> cream on emerald`, `<b>6</b> cast marks`, `<b>64</b> unit grid`).
- **Right framed artwork:** high-resolution painting or photograph, `overflow: hidden`, **plus one** small pane carrying `lockup-reverse.svg` and a 2-line caption. One pane, not a card stack. Followed by a 4-cell stat row.
- *Vary it:* alternate the text column left/right by case, and let the framed artwork bleed off the right viewport edge on wide screens. A B-hero with the image inset 40px from every edge is a different hero.

#### Variant C · Live Specimen Stage First · relation `below`
- **Top specimen stage:** the system's signature interactive or procedural object across the full shell or viewport — a live `DitherField` with a printed cartographic `.xx-margin` scale bar (`Sheet 05 · 0—1 km · 1:25 000 · seed 7`), or a stage header (`Fig. 01 · the stage, live`) plus an interactive specimen.
- **Hero foot below:** eyebrow, display headline, narrative lede, actions, 4-cell stat column.

#### Variant D · Physical Sheet & Torn Edge · relation `inside`
- **Sheet / hoarding stage:** the hero is a physical printed sheet or civic hoarding — pinned top edge (`<Pin />` + live run/clock metadata row), an oversized `760px` mark impression, bold display typography **printed on the sheet**, and a bottom edge cut with an irregular 18-tooth polygon `clip-path`, or a Bayer dither dissolve into a solid paper plate below.

#### Variant E · Full-Bleed Atmospheric Plate · relation `on`
- **Full-bleed image + type directly on it:** photograph covers the section, a *directional* scrim (not a flat 50% black) carries contrast, and the headline, lede and a stat row are set **on the image itself**.
- **Hard bans for E:** no solid reading panel, no frosted card, no "live readout" box floating in a corner. Those three are the tell that a hero was assembled rather than composed. Text sits on the photograph or the shape is not E — pick F or G instead.
- Type on a photograph needs `text-shadow: 0 1px 24px rgba(0,0,0,.35)` or a 1px dark rule under the baseline; verify the real contrast against the *lightest* region behind each line, not against the scrim colour.

#### Variant F · One Object, Isolated · relation `around`
- **Plain ground, one subject:** a single product, tool, specimen or printed object, large, on an unscrimmed ground (paper, seamless, single flat colour). No full-bleed photo.
- **Type wraps it:** the `<h1>` occupies the empty band above or beside the object, the lede and stat row take the opposite corner, and the object's own shadow or edge is the only depth on the page. Because the object is isolated, the page reads as a catalogue plate — the most expensive-looking hero available and the least used.
- Use this whenever the brief's photographs contain **one dominant object** rather than a scene.

#### Variant G · Typographic Cover · relation `none`
- **No artwork.** A typeset cover: one enormous display line filling the measure (`clamp(64px, 12vw, 190px)`, `letter-spacing: -0.04em`), two rules, the case numbers set as a small ledger, the mark 40px in a corner, and one `56ch` lede. Background is the material itself — paper, kraft, ink, frost.
- This is the correct answer when the brand has **no usable photograph**, or when the photographs would only ever be decorative. A type-only cover cannot look templated, because there is nothing to arrange but the type.

#### Variant H · Stacked Colour Bands · relation `rhythm`
- **3–5 full-bleed horizontal bands** of different colour or material, each holding exactly one line of the argument (a claim, a number, a material name), separated by `1px` rules or by nothing at all. The `<h1>` lands in the widest band; the mark sits in the narrowest.
- **Why it works:** the eye reads the page as a printed chart rather than a layout, and the bands are made of the brand's own primitives, so it cannot drift toward another case's look.

#### The composition clause — read this before drawing any hero
1. **State the relation in one line** at the top of the hero section comment: `hero: E · relation on · scrim 118deg · type on image`.
2. **A `plate` is not the default.** At most two shapes (B, D) may contain a rectangular panel of type. If your hero has a rounded rectangle holding an eyebrow, a headline and a paragraph, and a second smaller rounded rectangle beside it, you have built the banned generic hero — stop and re-pick.
3. **Photographs are material, not wallpaper.** If the brief supplies photographs and you pick A, C, F or H, at least one of them must be used as a *texture* — a blurred light field behind panes, a band fill, an isolated cut-out, a dither source — not only as a hero backdrop.
4. **Vary across the library.** Before choosing, list the shapes already used by the cases in `src/data/cases.ts`. Do not pick a shape that the two most recent cases already use; if the Step 0 answer points at one of those, say so in one line and take the nearest shape with a different relation.

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
   - *Companion Cast Placement:* Either render the **6-Mark Companion Cast** here in Section 02, OR render it as a **full-bleed inverted `.castband`** (a full-bleed inverted band between `06 Kit` and `07 Tokens`, with its own `176px` `.rail` + 3×2 `.castgrid`).
3. **`03 / Ink (or Colour)`**
   - Click-to-copy primitive swatch cards (`grid-template-columns: repeat(4, 1fr); gap: 1px`, showing color chip, token name, hex/OKLCH, and role) + the **complete Measured Contrast Ledger** (`.pairs` rows with dual 30×30 color chips, pair label, computed ratio, and assigned semantic job—explicitly highlighting the `1–3` failing pairs and what job they may *not* do).
4. **`04 / Surfaces` (Comparative Surface Grid — No Range-Slider Stage)**
   - **Never build a fake blur/tint range-slider stage unless explicitly requested.** Instead, use the count-then-cut architecture — state the real number tried and the real number kept in the intro line (`"Eight surfaces were tried. Five survived."`), and never write a count that does not match the cards rendered:
   - Render a `2-column` `.surf` hairline grid (`grid-template-columns: 1fr 1fr; gap: 1px; background: var(--xx-line-subtle)`) of **4, 6 or 8 explored surface cards** (`.sc`) — an even count, so the last row never ends ragged.
   - Each card has:
     1. A `210px` live visual `.demo` box at the top demonstrating that exact surface treatment in real CSS/SVG/imagery (e.g., *Stipple / Artwork field*, *Ordered Bayer dither band*, *Register ghost type*, *Ruled ledger rows*, *Frosted pane that smudges the texture*, *Torn/cut clip-path edge*, or *Lifted paper seam*).
     2. A `.txt` body below with a flex header (`<b>Surface Title</b>` + monospace verdict tag `Shipped — the hero`, `Shipped — section dividers`, or `Rejected`) and a concise paragraph explaining *why* it survived or *why* it was rejected so nobody re-proposes it in six months. Cards with `rejected: true` get `.rej` (`filter: saturate(0.55)` on `.demo` and muted verdict tag).
5. **`05 / Type (or Voice)`**
   - Live rendered type scale rows (`.tscale`: `132px` metadata column with role/font/weight/size/leading/tracking + live sample rendered at its real CSS size) + **2-column domain specimens** (`Display` multi-line specimen + `Reading` 66ch paragraphs + `Figures` tabular right-aligned table + `Labels` tracking rule).
6. **`06 / The Kit (or Domain Workbench)`**
   - A `2×2` `.kit` hairline grid of pressed/tactile UI controls and domain components (`Buttons` with primary/ghost/small/disabled states, `Chips & tags` with status indicators, `Fields` with a double-reported error summary + `aria-invalid="true"` input state, and `Data rows / Domain workbench` with `tabular-nums` alignment and live interactive selection).
7. **`07 / Tokens (and Honest Audit Ledger)`**
   - `2-column` `.sheet` grid of copyable code blocks — 4 cells on a single scope, 5 on a dual scope (`1 · Primitives`, `2 · Day Scope`, `3 · Component Tokens`, `4 · Physics` on a single scope — insert `3 · Night Scope` and shift the last two to `4` / `5` **only on a dual scope**) with 1-click `Copy` buttons + optional **Audit & Known Gaps** ledger (`What is verified, and what is not` + `2×2` `.gaps` cards), then the closing band and the footer built per Pillar VII.

### Pillar VII: Footer Shapes — The Hero Turned Around

> [!CRITICAL]
> **FOOTER LAW — THE FOOTER IS A SECOND COMPOSITION, NOT A CREDIT LINE:**
> The generic footer is `mono line · 1px border-top · two spans pushed apart`. That is a colophon, not a design. It is also the single most reliable tell that a page was assembled from a template, because it is identical on every page. **Four footer shapes ship, and the footer shape is derived from the hero shape — never copied from the last case.**

**The pairing table.** Pick the footer from the hero answer, then vary the one dimension named in the last column. Two cases may share a footer family; they must never share the variation.

| Hero | Footer shape | Why the pairing holds | Vary by |
|---|---|---|---|
| A · Banner + bench | **F1 · Bench echo** — the same 5-cell hairline grid returns at the bottom, holding contact, city, year, licence, one link | the bench that opened the page closes it | which cells carry links vs. plain data |
| B · Text left, photo right | **F2 · Reversed split** — the framed artwork returns on the *left*, the closing statement and links sit on the *right* | the composition flips, the page bookends | image crop / scrim direction |
| C · Live demo | **F3 · Frozen specimen** — a small, static, final frame of the live object (same seed, last state) above the colophon | the live thing is shown stopped | whether the frame is captioned `Fig. 07 · final state` |
| D · One giant sheet | **F4 · Torn receipt** — a paper strip with a torn or perforated top edge carrying the sign-off, then a plain colophon underneath | the sheet is torn off and kept | tooth count / which side is torn |
| E · Full-screen photo | **F1 or F2** — a full-bleed band at `min(46vh, 420px)` with a *strong* two-axis scrim and the reverse lockup on it, then a thin bar | the photograph returns, quieter | scrim angle / lockup alignment |
| F · One object | **F3 or F1** — the isolated object repeated small and alone on the plain ground, sign-off beside it | catalogue-plate bookend | object scale / which side it sits |
| G · Typographic cover | **F4 or F1** — a final typeset block: one large line, a rule, the ledger of case numbers | type opened, type closes | number of rules |
| H · Stacked bands | **F2 or F4** — the last band widens and holds the sign-off, or the bands invert to a single tall band | the rhythm resolves | band count / inverted order |

#### Shape F1 · Bench echo
A `repeat(5, 1fr)` hairline grid (`gap: 1px; background: var(--xx-line-strong)`) with 5 cells, each `padding: 22px 20px`, holding a mono label above a value. Cells 1–3 are data (city, year, licence), cell 4 is one real link, cell 5 is the mark at 28px. Below it, a `56px` bar with the copyright and the back-link. **Ban:** no photo, no glass, no card.

#### Shape F2 · Reversed split
`grid-template-columns: 0.92fr 1.08fr; gap: 1px` — the framed artwork occupies the left column at `aspect-ratio: 4/3` with `overflow: hidden` and one directional scrim, the right column carries eyebrow, a `34ch` closing statement at `clamp(24px, 2.6vw, 34px)`, a `48ch` sub-line, and the link row. On mobile the artwork goes *below* the statement (opposite of the hero, where it went above).

#### Shape F3 · Frozen specimen
A `min(340px, 42vh)` stage holding a static final frame of the brand's own live object — the dither field at its last seed, the specimen at rest, the chart at its final value — with a mono caption (`Fig. 07 · final state · seed 11`) at its bottom-left. No scrim, no overlay type: the object is the whole composition. Colophon bar below.

#### Shape F4 · Torn receipt
A paper or kraft strip (`background: var(--xx-surface-plate)`, `clip-path` with 14–20 teeth on the top edge, `margin-top: -1px`) carrying: the reverse lockup at 30px, one `30ch` sign-off line, and the mark small at the far right. Then a plain `1px` rule and a single-line colophon. **Ban:** never combine the torn edge with a photograph; the strip must read as paper.

**Footer content contract — every footer carries all five, and nothing else:**
1. The mark or the lockup (one of them, not both).
2. One closing line that is a *statement*, not a thank-you (`Every parcel leaves a paper trail.`).
3. Three to four real links, each a real destination on the page or in the brand.
4. The provenance row: city, year, licence or version.
5. The back-link to the shelf.

Anything else — a newsletter field, a social icon row, a sitemap — is filler and must be cut. If a footer cell has nothing real to say, delete the cell and re-balance the grid; never pad it.

**Immersive-footer clause (applies to F2, F3, F4).** The footer must survive `prefers-reduced-motion` looking finished, and any animation in it must be a *completion*, not an entrance — the last state is what a screenshot shows. A footer whose lockup only appears after a scroll-triggered fade has no footer in a static capture, which is how it gets judged.

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
- [ ] **Count parity:** every stated number matches what renders — the surface intro line ("Eight surfaces were tried. Five survived.") matches the card count and the verdict tags, the token-sheet count matches the scope answer, and the cast is exactly 6.
- [ ] **Hero relation declared:** the hero section comment names one shape letter and one relation (`below` / `beside` / `inside` / `on` / `around` / `none` / `rhythm`), and the built hero matches it. No hero contains both a rounded text panel *and* a second smaller floating card.
- [ ] **Footer shape declared:** the footer names one of F1–F4 in a comment, that shape is the one Pillar VII pairs with the chosen hero, and it carries all five contract items and no filler. Two consecutive cases in `src/data/cases.ts` do not share a footer family.
- [ ] Zero emojis (`☀️`, `🌙`) in UI chrome; all 3 fonts load live.

---

## 5. POST-BUILD OPEN DIALOGUE PROTOCOL

End every response with this compact 1-keystroke action menu:

> **Next Step — Reply with a code (or combine, e.g., `A + C`):**
> - **`[A] Tailwind v4 / CSS Token Export`** — Standalone `tokens.css` with OKLCH `@theme` variables and font rules.
> - **`[B] Figma Variables & SVG Bundle`** — W3C Design Tokens JSON + clean standalone `.svg` files for all lockups and cast marks.
> - **`[C] Extract Section 06 Kit Components`** — Package the kit and domain controls into modular `components/ui/` TSX files.
> - **`[D] Remix Rail / Hero / Archetype`** — Name any shift (e.g., *"Switch to Rail B + Hero B"*) for a surgical git patch diff.
