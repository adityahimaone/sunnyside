# sunnyside-brand-system

An installable agent skill for shipping **brand kits** and **design systems** from a brief:
one idea, a mark family, tokens, a board, an immersive proof page, Figma and DESIGN.md exports,
and an audit that names what it could not verify.

Built from shipped cases (listed in `references/case-evidence.md`), starting with Sunnyside, Vitrine, Huginn, Riso Co., Hachure, Cove, Strand, Clearing, Porphyry, Jakarta, Bluewater, Vesper, Halation, and Tavola. The method travels; the marks do not.

## v4.6: eight hero shapes, four footer shapes, and two new audit gates

- **Hero shapes grew from 5 to 8.** Step 0's hero question now offers A · Banner then a number row, B · Text left photo right, C · Live demo on top, D · One giant sheet, E · Full-screen photo, F · One object isolated, G · No photo all type, H · Stacked colour bands. Every option opens by stating where the type sits relative to the image — below, beside, inside, on, around, or in a rhythm — because that relation, not the layout, is what a picker is actually choosing.
- **Pillar V is now a non-template law, not a catalogue.** It opens by naming the hero the library had been drifting into (left reading plate, right floating glass card, 4-cell bottom row) and bans it. Shapes are specified by relation, at most two shapes may contain a rectangular type panel, and no case may pick a shape the two most recent cases already used.
- **Pillar VII · Footer Shapes is new.** The skill previously had zero footer templates — one doctrine sentence in `references/immersive.md` and three skeletons that were all the same shape. There are now four: F1 Bench echo, F2 Reversed split, F3 Frozen specimen, F4 Torn receipt, with a hero→footer pairing table, a five-item content contract (mark, one closing statement, 3–4 real links, provenance row, back-link — nothing else), and a rule that a footer must look finished under `prefers-reduced-motion`.
- **Two audit-gate items added.** *Hero relation declared* — one shape letter plus one relation in a comment, and never both a rounded text panel and a second floating card. *Footer shape declared* — F1–F4 named, pairing respected, all five contract items present, and two consecutive cases in `src/data/cases.ts` may not share a footer family.
- **Applied to the library.** Manifest moved to Shape D (a kraft waybill with the type inside the sheet and an 18-tooth tear), Daybook and Tavola to Shape E done strictly (type directly on the photograph, no plate and no floating readout), Quieta to Shape G, Arête to Shape H. Footers went to F4, F2, F3, F1 and F2 respectively, so no two consecutive cases share a family.

## v4.5: plain-geometry Step 0, 18-surface catalogue, and scope parity

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
