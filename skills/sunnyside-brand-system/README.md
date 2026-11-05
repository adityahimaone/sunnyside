# sunnyside-brand-system

An installable agent skill for shipping **brand kits** and **design systems** from a brief:
one idea, a mark family, tokens, a board, an immersive proof page, Figma and DESIGN.md exports,
and an audit that names what it could not verify.

Built from shipped cases (listed in `references/case-evidence.md`), starting with Sunnyside, Vitrine, Huginn, Riso Co., Hachure, Cove, Strand, Clearing, Porphyry, Jakarta, Bluewater, Vesper, Halation, and Tavola. The method travels; the marks do not.

## v5.1.0: excellent layers — nothing blank, nothing wrapped, nothing off-canvas

Fixed the defects measured from `test ds 4.fig` (Causeway + Mullion export) and
four canvas screenshots.

- **Pages 06/07 were nearly blank.** `buildComponentLibrary()` cloned COMPONENT
  nodes nested in the sheet and passed a not-yet-parented frame to
  `combineAsVariants`. Figma reparented their containers (`surface-box`,
  `grid-2-cols`, `modal-stage`) to the page root, leaving the sheet body empty.
  The library is now rebuilt from the manifest into fresh page-level masters —
  no `clone()`, nothing in the sheet is touched. Verified: **0 detached frames**
  across all 25 cases.
- **The library was off-canvas** at x=1640 in a 420×120 frame with 17 children.
  It is now a full-width (1440px) auto-layout board **above the sheet** on every
  page that carries components (05 assets, 06 components, 07 overlays), with a
  heading, one labelled section per family, variant sets and live instances.
- **Action groups were not full width.** HORIZONTAL frames hugged their primary
  axis (= width), so the grey modal footer collapsed around its buttons and
  `justify: flex-end` had nowhere to push. HORIZONTAL now keeps the measured
  width (`FIXED`) and only hugs the cross axis. Verified 622px / 444px — exactly
  the card widths.
- **Buttons, badges, titles and headings wrapped.** `box.h <= fontSize × 1.6`
  misclassified padded labels as multi-line and gave them `HEIGHT` + a fixed
  width. One-line detection now uses the inner line box (`box.h − paddingY` vs
  computed `lineHeight`), honours `whiteSpace: nowrap`, and chip labels are
  always `WIDTH_AND_HEIGHT`. Wrapped text fell from ~every label to **1–4%**
  (only genuinely long copy). The HTML also declares `white-space: nowrap` on
  all one-line labels so Doop / html.to.design imports stay one line too, with
  **zero** nowrap overflow measured.
- **Assets icons are real components now.** The 6 companion cast marks, 8 system
  icons and 4 spot illustrations carry `data-figma-component` / variant /
  description and `data-figma-role="icon"`. Component families went 4 → **7**,
  component refs 16 → **34**, sets 4 → **7**, instances 16 → **34** per kit.
- **Icons and manifest layers.** SVG captures now keep `componentRef`, `role`
  and `tokenRef`; modal footers are named `action-group` layers; the spec records
  `whiteSpace` / `textOverflow` on every node.
- **Parity gate grew to 17 gates**: action groups full width, zero detached
  sheet frames, library boards above the sheet, and ≤5% wrapped labels. Smoke
  gained matching regression assertions (padded label, full-width action row,
  library position). **25/25 design-system cases + 3 workspace kits green**,
  39/39 unit tests.

## v5.0.0: one canonical spec, plugin-only handoff, real component library

Rebuilt around the audit of `test ds 3.fig` (Mullion). The Doop page had 1575
nodes / **0** auto layout / **0** variables / **0** bound styles; the plugin
pages had 127 auto layouts but only 998 nodes. The two flows were describing
different documents. Strategy chosen: **plugin-only + upgrader**; Doop becomes
preview/reference; sheet 08 stays optional in Figma.

- **Deterministic capture.** `buildFigmaManifest()` now clones the document into
  a fixed 1440px iframe, clears every body mode, reveals all 8 sheets and
  records coordinates relative to each sheet root. Verified byte-identical
  checksums and sheet heights at 1440 / 2504 (Canvas Grid) / 820 / 1920 px and
  with `?sheet=3`. No more equalised grid row heights (logo 1189 vs 842,
  overlays 3052 vs 708). Toolbar, Plugin ZIP and `figma-manifest.mjs` all call
  the same async function.
- **Complete system spec.** New `scripts/lib/canonical.mjs` folds tokens.json +
  the sheet's ramps, CSS custom properties, canonical type roles, spacing,
  radius, elevation, fonts, grid and component definitions into one `system`
  object. A kit whose tokens.json has only `meta/primitives/contrast` now ships
  82 colours and 21 type roles instead of 12 colours and zero roles.
- **Signed manifest.** v2 carries `dsId`, `capture{viewport:1440, sheets:8,
  mode:'canonical-v2', checksum}` and per-node `id / role / tokenRef / styleRef
  / componentRef`. `CHECKSUM_JS` is injected verbatim from the Node module so
  browser and Node compute the same FNV-1a signature.
- **Idempotent system.** Collections, variables and paint/text/effect/grid styles
  are looked up by name and updated in place. Re-running a Vesper build reuses
  97 variables and leaves **zero** duplicate collections. Every generated
  `NN · …` page is replaced; designer pages are untouched.
- **Everything bound.** All 589 solid fills (including text ink) bind to a
  colour variable; all 369 text nodes bind to a text style — 100% on both.
  Auto-layout spacing/padding bind to FLOAT variables (184 bindings).
- **Real component library.** `data-figma-component` / `data-figma-variant` /
  `data-figma-description` on buttons, badges, inputs and modals produce 4
  variant sets, 16 described components and 16 live instances in a
  `◆ Component Library` frame beside the sheet.
- **Upgrader.** New **Upgrade existing pages** action rebinds flat Doop /
  html.to.design layers in place, with optional `inferredAutoLayout`. In-place,
  idempotent, and never touches generated pages.
- **Parity gate.** New `scripts/figma-parity.mjs` asserts the 13 gates below and
  is wired into `figma-handoff.mjs --with-replay`. Vesper: 13/13 green —
  953/953 nodes, 428/428 texts, 0px geometry delta, 68/68 colours, 100% text
  styles, 100% fill bindings, 16 instances / 4 components, 0 duplicates.
- **Tests.** 39/39 unit tests (7 new canonical tests), replay smoke extended
  with binding/component/upgrade/idempotency assertions.

## v4.9.6: no copy chrome, round badges, no patterns page

Diagnosed from a second exported `.fig` (9 pages, 1242 nodes).

- **Copy pills never reach Figma.** The 41 `swatch-copy-pill` "Copy" controls were browser chrome: a `position:absolute` span with `opacity: 0` until hover, which the manifest happily captured. They now carry `data-figma-ignore`, and the manifest builder skips that attribute, the known copy classes, and any element whose computed `opacity` is 0. Text nodes per brand dropped 469 → 369.
- **Badges keep their size.** A chip plate was still going through `applyLayout()`, so a 32×32 number badge hugged its 14×18 label and stopped being a circle. Chips now skip layout entirely; the plate stays at its CSS size and centres the label.
- **The number badge is a circle.** `.sheet-num-badge` was `border-radius: 8px` on a 32×32 box — a rounded square. It is now `50%`, so Figma receives `cornerRadius: 50` and clamps to a true 16px radius.
- **The patterns page is off by default.** It is mostly CSS token dumps and copy buttons. `build()` filters sheets matching `/patterns|tokens/i`; a new **Include the patterns / token-sheet page** checkbox turns it back on. Vesper now builds 7 pages instead of 8, and the summary reports `skipped 1 sheet(s)`.
- Smoke fixture grew a `patterns` sheet and a chip, and now asserts the chip plate keeps its 72×24 box, that one page is filtered, and that the skip is reported.

## v4.9.5: rows stop overflowing, and chips keep their plate

Diagnosed from a real exported `.fig` (8 pages, 1139 nodes): **37 text nodes spilled out of their parent**, starting with `sheet-title-row`, where "Vesper Color System" wrapped to two lines inside a row sized for one.

- **One-line text stays one line.** A label whose measured height is within one line (`box.h <= fontSize × 1.6`) is created `WIDTH_AND_HEIGHT`; only genuinely wrapped copy gets `HEIGHT` + the measured column. A 1–3% font-metric difference used to tip a heading into a second line the row could not hold.
- **`space-between` keeps its length.** Hugging a frame with `SPACE_BETWEEN` collapses the distribution — the banner's right block sat next to the title instead of at the far edge. Distributed justification now forces the primary axis to `FIXED`.
- **Horizontal rows hug their height.** `counterAxisSizingMode` is `AUTO` for HORIZONTAL and `FIXED` for VERTICAL, so a taller-than-measured line grows its row instead of overflowing it.
- **Text with a background becomes a chip frame.** A leaf that carried both text and a plate (badges, pills, PASS/FAIL tags) was flattened to a TEXT node and lost its background. It is now a frame with the plate plus a centred text child — 103 / 105 / 179 chips per brand, and 236 auto-layout frames for Vesper instead of 182.
- **Absolute boxes grow to fit.** Frames with `layoutMode: NONE` cannot hug, so a post-pass grows them to their children's union. Never shrinks — the browser height is still the intent.
- **Verified against the exported file:** applying the new rules to `test ds.fig` in openpencil took vertical overflow from **37 → 3**, and the fit pass took it to **0**. The smoke fixture now also asserts a chip frame, a one-line label at `WIDTH_AND_HEIGHT`, and a paragraph at `HEIGHT`.

## v4.9.4: the replay actually looks like the sheet

- **Invisible text, fixed at the root.** `applyStyle()` writes the CSS *background* into `fills`. For text, the visible ink is CSS `color`, and 366 of 469 Vesper labels have a transparent background — so the overwrite blanked 78% of all type. Text ink is now applied after the style pass. Every text node reports `inked` in the summary (469/469, 480/480, 731/731).
- **Text wraps instead of running off.** Text nodes now get `textAutoResize: HEIGHT` and the measured column width, plus `lineHeight` from computed CSS. Before, Figma's default auto-width turned long labels into single lines.
- **Fixed-height frames no longer leave voids.** Auto-layout frames hug the primary axis unless a child actually needs FILL. A CSS `min-height` box used to become a 3,000px frame with everything stacked at the top.
- **Shadows survive.** `boxShadow` is captured per node and mapped to `DROP_SHADOW` / `INNER_SHADOW` (first shadow only, colour parsed from either end of the string). Cards no longer render flat — 57 / 58 / 95 shadows per brand.
- **Brand faces are the sheet's faces.** `--font-sans` / `--font-body` / `--font-mono` were hardcoded to Plus Jakarta Sans / Inter / JetBrains Mono; they now lead with the brand's reading and mono faces, keeping the old defaults as fallbacks. Vesper's manifest went from 222 JetBrains Mono + 212 Plus Jakarta Sans nodes to 237 Archivo + 224 DM Mono, and font fallbacks dropped to **0**.
- **Font matching is spelling-aware.** `SemiBold` vs `Semi Bold` is a different string in Figma and a miss silently falls back to Inter. `loadFont` now tries every spelling, skips CSS generics, and reports any real fallback in the summary.
- **Vectors scale to their box** instead of keeping the SVG's intrinsic size.
- **New UI option:** *Raise text below 12px to 12px* (on by default) — 133 / 135 / 209 labels per brand. Turn it off for exact type sizes.
- **Installable fonts ship with the plugin.** `figma-replay.mjs` copies `.ttf`/`.otf` from the brand's `assets/fonts` into `<out>/fonts/` for a one-drag Font Book install; woff2 is skipped because Font Book will not take it.
- Smoke tests now fail on any text node without a fill, assert the caption is boosted and `HEIGHT`-sized, and the stub accepts Figma's Google Fonts roster so the fallback count is realistic. All suites and 32 unit tests pass.

## v4.9.3: dynamic-page compatibility fix

- **Fixed a real Figma runtime error:** `set_currentPage: Cannot call with documentAccess: dynamic-page. Use figma.setCurrentPageAsync instead.` The replay manifest declares `documentAccess: "dynamic-page"`, which makes `figma.currentPage` read-only. Both Figma plugin templates now go through a `usePage()` helper that awaits `figma.setCurrentPageAsync(page)` and only falls back to the synchronous setter on runtimes without it (OpenPencil, older editors).
- Page cleanup and replace-mode loops now call `figma.loadAllPagesAsync()` when available and guard each page individually, so an unloaded page's `children` cannot throw a false "failed" report.
- **Regression guards:** `figma-smoke.mjs` reads the sibling `manifest.json` and fails any `documentAccess: dynamic-page` plugin that still writes `figma.currentPage`; `figma-replay-smoke.mjs` always fails on a sync write. Verified that an old generated plugin now fails with exactly that message.
- `figma-forge.mjs` now reuses the existing `manifest.json` `id` on regeneration instead of minting one from `Date.now()`. A changing id made Figma treat the local plugin as new and forced a re-import after every token edit. All three brand plugin IDs are stable again.
- All six affected `code.js` files regenerated for vesper, wildflower-wind and jakarta. Every smoke suite and all 32 unit tests pass; `syncPageWrites: 0`.

## v4.9.2: Auto Layout from the HTML page, and a native replay path

- **The generated sheet now has an `⇄ Auto Layout` toggle.** `?autolayout=1` outlines CSS flex/grid flow containers and flags absolute/transform/`backdrop-filter` layers that an importer cannot infer. Non-invasive: outlines only, no geometry changes, so the inspected layout is the imported layout.
- **`⤓ Copy for Figma` emits a `sunnyside/figma-manifest`.** The page measures its own DOM (`getComputedStyle` + `getBoundingClientRect`) and serialises the layout tree, colours, type, token payload, inline SVG and `data-figma-node` component names. A compact token payload is embedded in the sheet from `tokens.json`, so both emitters read one source.
- **New `scripts/figma-manifest.mjs`** runs that function in headless Chrome (`playwright-core` + Chrome are optional; a missing browser degrades to the paste-in-UI flow instead of failing the handoff). Real Vesper sheet: 8 sheets, 994 nodes, 561 KB.
- **New `scripts/figma-replay.mjs` + `templates/figma-replay-plugin.js` + `templates/figma-replay-ui.html`.** One Figma plugin rebuilds the manifest natively: HORIZONTAL / VERTICAL / GRID auto layout with padding, spacing, alignment, wrap, `layoutGrow`, absolute children; variable collections; paint styles bound to variables; text styles; live text; rectangles; SVG vectors; named components. Not a general CSS parser — a replay of a known schema.
- **New `scripts/figma-replay-smoke.mjs`.** Executes the plugin against a Figma API stub with a fixture and, optionally, a real sheet manifest; asserts auto-layout modes, variables, bound paints, text and vector nodes, components and a clean close.
- **`figma-handoff.mjs --with-replay`** chains sheet → manifest → replay plugin → all three smoke tests, and prints both Figma paths. Verified on vesper (182 auto layouts), wildflower-wind (184) and jakarta (154).
- Why this is not the converter ruled out in v4.9.1: the HTML page we generate does the measurement and emits a typed manifest; the plugin replays it. No arbitrary CSS, no heuristics, no third-party importer.
- **Idempotent migration.** The replay UI has a **Replace existing generated pages** checkbox (on by default). Re-running into an existing file removes only the `NN · <sheet>` pages about to be recreated, so a designer's own pages are untouched. `figma-replay-smoke.mjs` pre-seeds a duplicate page and asserts it is replaced. `references/figma-export.md` now has a full Import & migration step-by-step (desktop-app requirement, both paths, in-place upgrade of legacy files, verification checklist, troubleshooting).

## v4.9.1: Figma handoff without a new converter

- **Synced the upstream Figma HTML sheet into this build.** `scripts/figma-html.mjs` + `templates/figma-doc.html` generate an 8-sheet white `<slug>-figma.html` for `html.to.design`, Builder.io, Stitch to Figma, Penpot and OpenPencil. Added `--tokens <path>`, `--check`, and `--all` discovery that also finds per-case roots (`<case>/src/tokens.json`, `<case>/features/<slug>/tokens.json`). Verified against all three token shapes in the workspace: `primitives[]` (vesper, wildflower-wind) and `color{}` (jakarta, 46 primitives).
- **New `scripts/figma-bind.mjs` + `templates/figma-bind-plugin.js`.** A thin post-processor, not a second HTML-to-Figma converter. It binds SOLID fills/strokes to local COLOR variables by measured RGB, applies local text styles by font size + family, and optionally re-applies Figma's `inferredAutoLayout` to flat imports (`--infer-layout`, off by default). Falls back to creating the primitive colour collection when no system exists yet.
- **New `scripts/figma-bind-smoke.mjs`.** Runs the generated plugin against a Figma API stub twice — with a system present and on an empty file — and fails on unbound paints, unstyled text, modified frames that already had auto layout, swallowed exceptions, or a success message after doing nothing.
- **New `scripts/figma-handoff.mjs`.** One command runs the sheet, the build plugin, the binder and both smoke tests, deriving CSS / brand / name from the token file. `--check` is a dry run; `--skip-*` and `--no-smoke` allow single-step regeneration.
- **Two real bugs fixed in `scripts/figma-forge.mjs`.** `byName()` was called at four colour fallbacks but never defined, so `--check` crashed for any brand without a matching semantic token. `collectTypeRoles()` passed array-shaped `type[]` rows through `entries()`, which drops `size`/`leading`/`tracking` — every role was skipped and the exported file had zero text styles. Vesper now exports 11 text styles instead of 0.
- **The decision behind it.** Figma's Plugin API can set auto layout (`layoutMode`, `itemSpacing`, `padding*`, `HUG`/`FILL`, `GRID`), but rebuilding a general HTML→Figma converter duplicates a mature category. Doop's Copy for Figma is documented as "a snapshot, not a sync: auto layout, variables, and components aren't recreated", so HTML now goes straight to an importer. `figma-forge.mjs` owns the system; the binder owns the page.
- **`SKILL.md` gained a FIGMA HANDOFF section** with the three commands, the order of operations in Figma, the `--infer-layout` warning, honest limits and an audit gate. The post-build `[B]` option now names the full handoff.
- All 32 existing unit tests still pass.

## v4.9: one Surface & Style selector, 28-contract style library, and scoped modern overrides

- **Q1 is now one `Surface & Style` question, not a second style question.** Step 0 stays at seven questions and shows **Auto + 7 named picks**: Paper & ink (#1), Cardboard & steel (#5), Liquid glass (#19), Frosted glass (#15), Boxes of different sizes (#20 + R4), Blueprint grid (#4) and Cockpit panel (#13). A freeform `Other` word resolves through aliases to a contract, composition recipe, behaviour or "out of scope"; there is no Q8.
- **New `references/styles.md`.** It indexes the 18 canonical contracts, defines 10 modern contracts (#19–#28) on the same nine slots, and adds 8 composition recipes, 5 behaviours, an alias table, recency flags, modern prompt signals and scoped house-rule overrides. Determinism law: a style name is not implementable until it resolves to all nine slots, and unknown or out-of-scope words fall back to Auto with a one-line explanation.
- **`references/surfaces.md` repositioned** as the canonical #1–#18 implementation shelf. Its prompt map now carries modern signals, and the old "eight materials in the question" rationale has been rewritten around the 28-contract library and the freeform `Other` input.
- **`references/form-theming.md` extended** with exact field recipes for every named Q1 contract and modern style #19–#28, a one-row-per-contract rule, and a scoped glass / mesh / hard-offset contrast clause.
- **Pillar V and the silent audit gate updated.** Scoped overrides allow `backdrop-filter` only for #15 / #19 / #21 / #27 panes and nav chrome, one glow or mesh gradient for #21 / #22, and one hard offset shadow at rest for #26 / #28. Every other hero house rule remains absolute; reading copy stays on solid plates or measured scrims, and pane / mesh contrast failures must be published in §03.
- **Section 04 can now explore modern idioms** such as Frosted plate — Rejected or Scroll-reactive glass — Shipped — navbar. A rejected modern idiom still counts toward the stated "tried" number, and its reason must name the house rule or contrast pair it broke.
- **Historical note.** The v4.5 and v4.6 entries below are retained as changelog history. Where they say "eight surfaces in the question" or "four footer shapes", the current engine uses the v4.9 selector and five footer shapes.

## v4.6: eight hero shapes, four footer shapes, and two new audit gates

> Historical: v4.9 ships five footer shapes. This entry records when the fourth was added.

- **Hero shapes grew from 5 to 8.** Step 0's hero question now offers A · Banner then a number row, B · Text left photo right, C · Live demo on top, D · One giant sheet, E · Full-screen photo, F · One object isolated, G · No photo all type, H · Stacked colour bands. Every option opens by stating where the type sits relative to the image — below, beside, inside, on, around, or in a rhythm — because that relation, not the layout, is what a picker is actually choosing.
- **Pillar V is now a non-template law, not a catalogue.** It opens by naming the hero the library had been drifting into (left reading plate, right floating glass card, 4-cell bottom row) and bans it. Shapes are specified by relation, at most two shapes may contain a rectangular type panel, and no case may pick a shape the two most recent cases already used.
- **Pillar VII · Footer Shapes is new.** The skill previously had zero footer templates — one doctrine sentence in `references/immersive.md` and three skeletons that were all the same shape. There are now four: F1 Bench echo, F2 Reversed split, F3 Frozen specimen, F4 Torn receipt, with a hero→footer pairing table, a five-item content contract (mark, one closing statement, 3–4 real links, provenance row, back-link — nothing else), and a rule that a footer must look finished under `prefers-reduced-motion`.
- **Two audit-gate items added.** *Hero relation declared* — one shape letter plus one relation in a comment, and never both a rounded text panel and a second floating card. *Footer shape declared* — F1–F4 named, pairing respected, all five contract items present, and two consecutive cases in `src/data/cases.ts` may not share a footer family.
- **Applied to the library.** Manifest moved to Shape D (a kraft waybill with the type inside the sheet and an 18-tooth tear), Daybook and Tavola to Shape E done strictly (type directly on the photograph, no plate and no floating readout), Quieta to Shape G, Arête to Shape H. Footers went to F4, F2, F3, F1 and F2 respectively, so no two consecutive cases share a family.

## v4.5: plain-geometry Step 0, 18-surface catalogue, and scope parity

> Historical: v4.9 replaces the eight-material Q1 with one `Surface & Style` selector and a 28-contract library. This entry records the original 18-surface catalogue.

- **Step 0 rewritten as seven plain-English questions.** Every option is now named by what a non-designer already knows — *Cardboard & steel*, *Airport signage*, *Text left, photo right*, *Shape with a hole cut out* — instead of a case codename or a design term. Labels cap at 45 characters; the exact geometry moves into each option's `description`. Rail and Hero are split into two independent questions so a Rail B choice can no longer silently pull in a Hero the user did not pick.
- **18-surface catalogue (`references/surfaces.md`).** Eight surfaces ship in the question; the other ten are reached through a prompt-mapping table, so a brief that says "I'm building a metro app" resolves to *Transit map* without a second question. Each surface fixes the same nine slots — `ground`, `plate`, `text`, `text2`, `rule`, `radius`, `texture`, `type`, `motion` — plus a "fails loudly if" guardrail, so two agents given the same surface land on the same CSS.
- **Scope parity is now an audit gate.** A single-scope build has no navbar toggle, no second token sheet, no `[data-<slug>='night']` block and no dark-mode audit line; a dual scope has all four. Previously Pillar III mandated a night block and Pillar VI mandated a toggle regardless of the Step 0 answer, so choosing "Daylight only" still produced a dark mode.
- **Count parity is now an audit gate.** The surface intro line, the card count, the token-sheet count and the cast size must match what actually renders. The surface grid is locked to 4, 6 or 8 cards so the last row is never ragged.
- **Case codenames removed from every question, pillar heading and section title.** Codenames survive only in `references/case-evidence.md` and this changelog, where they are evidence rather than labels.

## v4.4: Vesper / Clearing Rail Architecture, 5 Flagship Non-Template Heroes, and Comparative Surface Exploration Grid

- **Unnumbered Hero & Clean Navbar (`01..07` in Left Rail Only).** The Hero stage is never counted as `01`, and topbar navigation links carry zero numbers (`Idea`, `Mark`, `Colour`, `Surfaces`, `Type`, `Kit`, `Tokens`). Section numbers (`01`..`07`) live inside the left rail, with Step 0 (`ask_question`) letting the user choose between **Vesper's Per-Section Rail** (`176px` sticky `.rail` + `.body` inside each `.sec > .wrap`) and **Clearing's Sticky Contents TOC Sidebar** (`.shell.layout` wrapping a scroll-spy `<ol>` rail + content column).
- **Vesper Comparative Surface Exploration Grid (`04 / Surfaces`).** Replaces the mandatory blur/tint range-slider stage from Quieta/Arête with Vesper's `"Six surfaces were tried. Four survived."` comparative 2-column `.surf` grid: 4–6 explored surface cards, each with a `210px` live visual `.demo`, a `Shipped` or `Rejected` verdict tag, and the architectural reason why it survived or was rejected.
- **5 Curated High-Scoring Hero Variants (Anti-Template Law).** Retires the single repetitive `.plate + .glass-card` box hero in favor of 5 flagship hero architectures drawn from the highest-scoring cases: **Variant A** (Vesper Split Field + `-30px` Overlapping 5-Cell Stat Bench), **Variant B** (Clearing / Strand 2-Col Editorial + Framed Media with Single Floating Pane), **Variant C** (Porphyry / Hachure Live Specimen Stage First + Printed Survey Margin), **Variant D** (Jakarta / Riso Physical Sheet, Oversized Hoarding Mark & Torn Polygon Edge), and **Variant E** (Cove / Tavola Full-Bleed Atmospheric Plate + Station Readout).

## v3.7: universal 22-concept logo forge, built-in outlined wordmark, track-aware scoring, and optional background field generator

- **Universal 22-Concept Logo Forge (`brand-forge.mjs`).** Expanded with 6 new battle-tested archetypes from shipped cases (`junction`, `carved`, `cells`, `tear`, `portal`, `archmono`, plus drawn `crest`), fixed `mark-compact.svg` so all compact marks sit natively on the `64 × 64` viewBox (never scaled into a `32 × 32` top-left corner), and added `--tokens features/<slug>/tokens.json` so a full brand kit can be forged directly from `tokens.json` without a separate `brand.json`.
- **Zero-Dependency Built-In Outlined Wordmark.** When `--wordmark` is omitted, `brand-forge.mjs` now synthesizes pure-`<path>` geometric outlined `wordmark.svg` and `wordmark-reverse.svg` (zero `<text>` tags) and builds all 4 lockups (`lockup.svg`, `lockup-reverse.svg`, `lockup-stacked.svg`, `lockup-stacked-reverse.svg`) plus `mark-compact-reverse.svg` out of the box.
- **Track-Aware Mark Scorer (`score-mark.py --track constructed|drawn|auto`).** Auto-detects track from `tokens.json` (`meta.track` / `dna.edge`) so constructed marks enforce zero-circle / fill-only / 2–4 primitives while drawn marks allow subject circles and cut-line strokes (`>= 2.4` in compact) while still enforcing 16px contrast and silhouette coverage.
- **Optional Hero Background & Field Generator (`field-forge.mjs` + `init-system.mjs --field`).** Generates token-locked `1600 × 1000` SVG hero fields (`mesh`, `bands`, `grain`, `dither`, `glass`, `grid`) and `<slug>-field.css` (`.fieldStage`, `.fieldScrim`, `.readingPlate`, `.photoDuotone`) in `<100ms` with zero API tokens.
- **Multi-Format Token Exports & Interactive Motion Track.** `init-system.mjs` now scaffolds copyable `CSS Custom Properties`, `Tailwind v4 @theme`, and `shadcn / Radix CSS Bridge` blocks plus an interactive hover/focus motion track previewing easing tokens.

## v3.6: interactive scope gate, Jakarta + Porphyry type standard, adaptive archetypes, and 11-case audit

- **Interactive Scope Gate (Step 1).** Replaces the rigid "ask nothing" rule with one upfront
  multi-select question so the user picks optional deliverables (`Form Kit`, `Cast/Illustrations`,
  `Applications Wall`, `Figma Export`, `DESIGN.md`, `Browser QA`) while always shipping the core
  proof (`Hero + Idea + Marks + Palette + Type & Foundations + Tokens + Static Audit`).
- **Jakarta + Porphyry Type & Foundations Standard.** `init-system.mjs` and `SKILL.md` now require
  and scaffold live rendered `TYPE_SCALE` rows (each role rendered at its actual size, leading,
  tracking and weight) plus visual foundation cards (`SPACE_SCALE` bars, `RADIUS_SCALE` chips,
  `SHADOW_SCALE` plates, and `MOTION_SCALE` tokens) alongside the three domain specimens.
- **Adaptive Archetypes (`--archetype minimal|multi-ramp|ui-ramp`).** Supports 5+1 minimal brand
  systems, multi-ramp civic/wayfinding systems (like Jakarta's 9 district ramps with
  `primaryAccent`), and 14-step UI/dashboard ramps (like Ledger).
- **Tiered Audit Pipeline.** Tier 1 (`gates.mjs`, <2s, 0 browser tokens) is mandatory; Tier 2
  (`qa.mjs --quick`) runs only when `Browser QA` is selected; Tier 3 (full screenshot `qa.mjs`)
  runs only on explicit request.
- **All 11 systems backfilled and measured.** Added `features/jakarta/tokens.json`,
  `features/design-system/tokens.json` + `sunnyside-tokens.css`, full `theme` DNA across Huginn,
  Riso Co., Hachure, Clearing, and Ledger, and published failing contrast pairs across Vitrine,
  Cove, and Strand. Every one of the 11 systems now passes `palette`, `font`, and `contrast` in
  `gates.mjs`.

## v3.5: one token reader, a CI guard, and tests

- **One loader.** `scripts/lib/tokens.mjs` reads every `tokens.json` shape in the repo and finds
  it in `features/` or `public/brand/`. `gates.mjs` and `design-md.mjs` use it. Huginn and
  Clearing, previously invisible to the gates, now run them, and the loader exposed a real
  collision: Cove and Clearing accents are 5° apart (65/100).
- **CI.** `.github/workflows/skill-check.yml` fails on a stale `.agents/` mirror, failing tests,
  or a regression on the known-good case (Porphyry).
- **Tests.** 27 unit tests (`node --test "scripts/test/*.test.mjs"`) cover the loader, the gates
  (including mutation cases for palette drift, contrast, fonts, detach and credits), the detach
  display-face fix, external references, and the asset licence check. All use temp fixtures;
  none touch the network.
- **Not done:** `detach-check.mjs` still reads its own subset of the token shapes.

## v3.4: audited against the cases that came after it

Written after checking an outside review (Gemini's audit of the published page) against the
repo. Adopted what held up, rejected what would have cost more than it saved.

- **Adopted, adapted:** one retry then publish (never tune a number until it passes); a three-
  specimen type proof at real copy; the page must prove five jobs; at most one question before
  building; a stated side-effects table.
- **Rejected:** a locked six-section spine (the detach gate scores shared section ids, so it
  would make each case less separate from the last); a mandatory post-build menu and a three-
  question intake (extra turns, and the tracks already answer "which kind"); a rewritten
  stub Figma exporter (`figma-forge.mjs` already exists and is smoke-tested); generic Tailwind
  blueprints (they duplicate `immersive.md`); a promise that scanner warnings will clear.
- **New gate, from a shipped bug:** *palette is one source* (tokens.json against the token CSS,
  hex and oklch, with mutation tests). It is the portable form of Ledger's `check-palette.mjs`.
- **Fixed in the gates:** a case folder with no `tokens.json` (Jakarta) used to pass its font
  check and skip the rest; it now fails.
- **Hardened:** `design-md.mjs --lint` pins `@google/design.md@0.4.0` instead of floating.
- **No more counts in prose.** "Eight systems" no longer matched the repo (Jakarta, Ledger and
  Porphyry exist); `case-evidence.md` is the one place that keeps a list.

## What is in the box

```
SKILL.md                      the whole method in one read
references/research.md        studying a category, DESIGN.md, free-asset licences
references/case-evidence.md   every case, their numbers, the recurring decisions
references/surfaces.md       18 canonical nine-slot contracts (#1-#18)
references/styles.md         28-contract library, aliases, recipes, behaviours, overrides
references/gates.md           the gate checks and the QA checklist
references/immersive.md       the seven recipes with code
references/tokens-and-docs.md token layers and the llms twin
references/figma-export.md    tokens to Figma, the emitters, the traps
references/logo-system.md     grid, family, favicon
references/form-theming.md    the form kit every case ships
references/craft-bar.md       the drawn-track bar and the marks composition
scripts/                      init, detach, gates, brand-ref, assets, design-md, forge, cast,
                              score, audit, qa, board, icons, figma, sync-skill.sh
templates/                    design system page, single page, case page, guidelines, audit
examples/                     Sunnyside and Vitrine, plus brand-forge configs
```

## Install

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
```

Network use (all optional): `brand-ref.mjs` needs raw.githubusercontent.com; `assets.mjs` needs
its source host, plus `PEXELS_API_KEY` or `UNSPLASH_ACCESS_KEY` for those two; `design-md.mjs
--lint` needs the npm registry.

Companion: **`implement-brand-system`** turns an approved kit into an HTML/TSX proof without
redesigning it.
