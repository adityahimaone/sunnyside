---
name: sunnyside-brand-system
description: 'Design and ship a brand kit or design system from a brief: one idea, a mark family, tokens, a board, an immersive proof page, Figma and DESIGN.md exports, and a measured audit. Use when creating, initialising, auditing or exporting an identity, a design-system page, or a single-page proof.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '3.7'
---

# Sunnyside brand system

**One idea → one mark → one system → one proof → one audit.**

Every shipped case is listed in `references/case-evidence.md`. Every rule is here because it
survived one of them and every gate because it caught something in one. This file is the whole
method; the references hold evidence and code. (No case counts in prose: they go stale as cases are
added, so the evidence file is the only place that keeps one.)

## The fast path

Eleven steps after the interactive scope gate. **Each step has one exit and nothing loops back:** when a gate
fails, go to the step the gate table names, fix only that, and re-run only that gate.

### Step 0 · Interactive Scope Gate (`ask_question` — Mandatory First Action)

> [!IMPORTANT]
> **MANDATORY FIRST TOOL CALL (Before running any script or writing any file):**
> Unless the user's prompt explicitly says `"skip questions"` or `"all defaults"`, you **MUST** call the **`ask_question` tool** (or `AskUserQuestion` in environments that name it that) on your **very first turn** and **STOP** to wait for the user's selection.
> - **Never** ask these questions in plain markdown text—always use the `ask_question` tool so the interactive `/grill-me`-style selector UI renders.
> - **Never** run `init-system.mjs` or create files before the user submits their answers.

Call `ask_question` with these structured questions (skipping any question the user already answered explicitly in their prompt, and adding a domain/concept question if the brief is underspecified):

```json
{
  "questions": [
    {
      "question": "Which track and palette archetype fits this system?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Constructed + Minimal (5+1 palette, fill-only geometric mark)",
        "Drawn + Minimal (5+1 palette, tactile cut-line mark & companion cast)",
        "Multi-Ramp Civic / Wayfinding (named district or product-line ramps, like Jakarta)",
        "UI Workbench Ramp (10–14 step neutral + signal ramp for dense apps, like Ledger)"
      ]
    },
    {
      "question": "Which hero background or surface field should we generate?",
      "is_multi_select": false,
      "options": [
        "(Recommended) Procedural SVG Field — Gradient Mesh or Stepped Bands (field-forge.mjs)",
        "Procedural SVG Field — Paper Grain, Halftone or 4x4 Bayer Dither (field-forge.mjs)",
        "Procedural SVG Field — Frosted Glass Pane or Survey Grid (field-forge.mjs)",
        "Licensed Stock Photo + Token-Locked Duotone Scrim (assets.mjs + field-forge.mjs)",
        "Solid Material Surface Only (no background asset)"
      ]
    },
    {
      "question": "Which optional deliverables and exports should we include beyond the core proof (Hero + Idea + Marks + Palette + Type & Foundations + Tokens + Static Audit)?",
      "is_multi_select": true,
      "options": [
        "(Recommended) 6-Concept Logo Bake-Off (compare 6 mark families before locking)",
        "(Recommended) Interactive Form Kit (inputs, error summary, focus & disabled states)",
        "Mark Cast / Companion Illustrations (4–6 secondary marks via cast-forge.mjs)",
        "Applications Wall (12-column bento of real-world artifacts)",
        "Figma Plugin & .fig Export (figma-forge.mjs + figma-smoke.mjs)",
        "DESIGN.md Export (agent-readable specification via design-md.mjs)",
        "Browser QA Pass (headless 1440/390 overflow & 16px mark check via qa.mjs --quick)"
      ]
    }
  ]
}
```

### Step 1–11 · Execution Pipeline (Run after `ask_question` is answered)

```bash
# 1 · pre-flight & scaffold using the user's selected flags from Step 0
node scripts/init-system.mjs --slug <slug> --name "<Name>" --hue <n> \
  [--archetype minimal|multi-ramp|ui-ramp] [--concept <concept>] \
  [--field mesh|bands|grain|dither|glass|grid|all] \
  [--modules forms,cast,apps,figma,design-md,qa] --peek
node scripts/brand-ref.mjs near --hue <n>            # who already owns this hue (needs network)
```

1. **Lock the brief.** Write the brief in six lines (`brand/<slug>/brief.md`): name, category,
   audience, promise, enemy, and one sentence the work can be rejected against (if it needs a
   comma splice, the idea is not ready).
2. **Apply the selected track and archetype.** Constructed or drawn (*Two tracks*), and `minimal`
   (5+1 palette), `multi-ramp` (civic/place ramps like Jakarta), or `ui-ramp` (10–14 step neutral +
   signal ramp like Ledger) from the user's Step 0 selection. See *Three archetypes*.
3. **Study the neighbours** (skip with no category). `brand-ref.mjs search <category>`, `pull`
   two or three, note their accent hue, display face and what they refuse; `ref` them for the
   gate. Study, never copy: `references/research.md`.
4. **Draw six, keep one.** Run `node scripts/brand-forge.mjs --bakeoff features/<slug>/tokens.json --out public/brand/<slug>/bakeoff` (or hand-draw six concepts in one file), score with `python3 scripts/score-mark.py --dir public/brand/<slug>/bakeoff --track constructed|drawn`, and write why the other five lost; that paragraph becomes the guide.
5. **Generate the family.** `node scripts/brand-forge.mjs --tokens features/<slug>/tokens.json --concept <winner> --out public/brand/<slug>` generates the full 12-file text-free SVG family (`mark.svg`, `mark-compact.svg`, `mark-compact-reverse.svg`, `glyph.svg`, `mark-reverse.svg`, `mark-mono.svg`, `icon.svg`, outlined `wordmark.svg` + `wordmark-reverse.svg`, `lockup.svg`, `lockup-reverse.svg`, `lockup-stacked.svg`, `lockup-stacked-reverse.svg`) plus `sheet.html` and `forms.html` in one pass. Across 22 built-in archetypes:
   - **Constructed (11):** `bracket`, `planes`, `louvers`, `ribbon`, `horizon`, `junction`, `carved`, `cells`, `tear`, `portal`, `archmono` (solid filled A–Z monogram).
   - **Drawn (11):** `sunburst`, `aperture`, `orbit`, `hatch`, `stack`, `facet`, `dotmatrix`, `lines`, `overprint`, `nodes`, `monogram`, `crest`.
   Pass `--wordmark <custom.svg>` if outlined from a specific `.ttf` via `extract-wordmark.py`; otherwise `brand-forge.mjs` synthesizes a pure-`<path>` geometric outlined wordmark automatically (never `<text>`).
6. **Write the tokens, then run the gates.** One source, three layers, two surfaces, never a
   mode-prefixed primitive. Then `node scripts/gates.mjs --slug <slug> --refs refs/`. The cheap
   failures (a font never loaded, a contrast pair never computed) surface here, before the board,
   page and export are built on top of them.
7. **Build the board & optional background fields.** 1500 × 1125 board, local fonts, rendered at 2×. If the page needs a hero field, gradient mesh, stepped bands, grain, Bayer dither, glass pane or grid, run `node scripts/field-forge.mjs --slug <slug> --recipe <mesh|bands|grain|dither|glass|grid|all>` to generate token-locked SVGs and `<slug>-field.css` (with `.fieldScrim`, `.readingPlate`, and `.photoDuotone`).
8. **Build the proof page, with its marks section.** Hero, contents, the sections the system
   needs, tokens, audit; a logo card, wordmark scale, cast drawer and one usage rule. A row of
   equal logo tiles is not a mark system. Need a photograph? `assets.mjs`, imagery only. The page
   must prove five jobs (see *What the page proves*); the ids and order are the case's own.
9. **Export (when selected in Step 1).** `figma-forge.mjs` (plugin + `.fig`) and `design-md.mjs`
   (`DESIGN.md`), both from the tokens, both regenerated, never edited.
10. **Tiered audit pipeline.**
    - **Tier 1 (Mandatory, <2s, 0 browser tokens):** `node scripts/gates.mjs --slug <slug>`.
    - **Tier 2 (Optional, when `Browser QA` is selected):** `node scripts/qa.mjs --quick` for
      1440/390 overflow, mark at 16px, and reduced motion without full-page screenshot bloat.
    - **Tier 3 (On explicit request only):** full `qa.mjs --sections` with full-page captures.
11. **Name the gaps.** A guide that hides its gaps is a brochure.

## The gates

Each failed a shipped case. Run them; do not reason about them.

**One retry, then publish.** Compute each value once. A colour pair under 4.5:1 is *assigned a
job* (ground, graphic or large type only) and printed as a failure, never nudged until it passes.
A gate that still fails after one fix is recorded in the audit as *Fails* or *Known gap*, not
iterated on. Marks are built from stated grid units in one write and redrawn at most once. A
passing number reached by tuning is evidence of the tuning, not of the design.

| Gate | Pass | Run by | If it fails, go to |
| --- | --- | --- | --- |
| **Detach** | ≥ 70/100 against every sibling and `--refs`, no hard fails | `gates.mjs` | 6, hue or material (an "incomplete tokens" note means fix the file, not the hue) |
| **Display face** | differs from every sibling | `gates.mjs` | 6, type roles |
| **Palette is one source** | every primitive in `tokens.json` is declared in the token CSS at the same value | `gates.mjs` | 6, whichever file is wrong |
| **Font registered** | every `--font-*` in the token CSS is declared in a layout | `gates.mjs` | 6, layout |
| **Contrast** | pairs recomputed from hex, stated ratios match, at least one failure published | `gates.mjs` | 6, semantic layer |
| **Assets licensed** | every stock file has a `credits.json` entry with licence and credit | `gates.mjs` | 8, `assets.mjs get` |
| **Export builds** | `figma-smoke.mjs` exits 0 | `gates.mjs` | 9, regenerate |
| **Mark at 16px** | the compact is a different drawing | `qa.mjs` | 5 |
| **Reduced motion** | the still frame is the design | `qa.mjs` | 8 |

A case folder with no `features/<slug>/tokens.json` **fails**, it is not skipped: the output
contract requires it and nothing else can be measured without it. Evidence per gate, thresholds
and the 100-point breakdown: `references/gates.md`. **Contrast
matters most:** a palette that only publishes its passes is a brochure, so a case prints the
pair that fails and the job it may therefore not do.

## What the page proves

Five jobs, not five ids. Name and order them as the case needs: the detach gate scores shared
section ids against every sibling, so a universal spine would make every new case less separate
from the last (Cove nearly failed on nine of twelve shared ids).

1. **Idea** — belief, enemy, material, and four decisions as *Decision / Because / Not when /
   Breaks next*.
2. **Mark** — primary, compact (a separate drawing) and glyph, the wordmark, and how it breaks.
3. **Colour** — every pair computed, each with its allowed job, and the one that fails.
4. **Type & Foundations (Jakarta + Porphyry standard)** — three domain specimens at real copy
   (never lorem): the display face at its real size with tracking stated, one reading paragraph at
   60–68ch with leading stated, and right-aligned tabular figures; **plus** a live visual type
   scale (every role rendered at its actual `--s`, `--lh`, `--ls`, `--w`, never just a static text
   table) and visual foundations (proportional spacing bars, radius chips, shadow/elevation cards,
   and motion easing tokens). A missing specimen is a *Known gap* in the audit.
5. **Tokens and audit** — copyable tokens in both scopes, then *Fails*, *Not verified*, *Known gap*.

## Three archetypes (universal theme & variant support)

Not every prompt is a 6-colour studio site. Pass `--archetype` to `init-system.mjs` and record
`meta.archetype` + `meta.primaryAccent` in `tokens.json`:

| Archetype | Use when | Palette & contrast rule | Precedent |
| --- | --- | --- | --- |
| **`minimal`** (default) | Brand identity, editorial specimen, focused product | 5+1 (`ground`, `plate`, `ink`, `muted`, `wash` + 1 `signal`), 1+ failing pair published | Sunnyside, Vitrine, Cove, Strand, Porphyry |
| **`multi-ramp`** | City, festival, institution, multi-district or multi-line wayfinding | Named 4-step ramps (places, lines or domains), semantic job table, `primaryAccent` declared so detach compares the primary civic action rather than every ramp | Jakarta (9 district ramps, 46 primitives, 7 failing pairs published) |
| **`ui-ramp`** | Dense dashboard, financial ledger, shadcn/Radix workbench | 10–14 step neutral ramp biased toward one hue + 5–7 step signal ramp + tabular figure scale | Ledger (14 harbor steps + 7 indigo steps, OKLCH + hex) |

## Figma is a build target, not a handoff

```bash
node scripts/figma-forge.mjs --tokens features/<slug>/tokens.json \
  --css public/brand/<slug>/<slug>-tokens.css --brand public/brand/<slug> \
  --html app/design-system/<slug>/page.html --slug <slug> --name "<Name>" \
  --out design/figma/<slug> --target both
node scripts/figma-smoke.mjs design/figma/<slug>/code.js
node scripts/design-md.mjs --slug <slug> --lint       # → public/brand/<slug>/DESIGN.md
```

`figma` writes a plugin (variables with Light/Dark, paint and text styles, components, a page per
section); `openpencil` writes a `.fig` headlessly (geometry only). `DESIGN.md` is the same tokens
in Google's open format, so other agents can read the system.

- **Regenerate, do not edit.** A hand edit does not survive the next token change.
- **The primitive does not flip modes.** Only the semantic layer differs.
- **A `.fig` cannot carry a font.** Ship the `.ttf` files and outline the display voice.

Mapping, traps and the six Clearing failures: `references/figma-export.md`.

## Immersive, not decorated

A page feels designed when one idea is carried to the edges. These seven recipes are the ones
the cases proved; each is a few lines of CSS, none is an image, and each has a fallback.

1. **One loud field, full bleed.** A section that escapes the reading column, carrying the
   system's single colour. The field is punctuation: two per page cancel.
2. **A clip-path edge.** A torn or cut edge is a polygon, not a texture. Irregular teeth
   (2–4% amplitude) read as paper; a constant amplitude reads as a sawtooth border.
3. **A dither, computed.** An ordered 4 × 4 Bayer matrix over a photograph or a plate. Canvas
   when it must be fine, markup when it must survive scripts off.
4. **A register ghost.** Display type with a 2.2px second impression in the second ink. It is a
   `text-shadow`, so it prints, screenshots and PDFs.
5. **Field + plate.** The loud surface carries the display and the mark; every piece of small
   type sits on a solid plate beside it. Never set 13px on a field that measures 4.5:1.
6. **A surface that is the mark.** The page should end in the object the identity is made of —
   the tear, the dither, the cell — built from the same tokens, not a screenshot of it.
7. **A data row that breathes.** A divider needs padding on *both* sides, and the outer padding
   is removed, not the inner. The number must never sit on the rule.

Code for all seven, with the numbers: `references/immersive.md`.

## Two tracks

| Track | Use when | Ships |
| --- | --- | --- |
| **Constructed** | The brand is a system: cells, planes, ridges, louvers, grids. | Mark + compact + glyph + lockup. Fill only, 2–4 primitives, one accent, zero circles. |
| **Drawn** | The brand is an object: a sun, a stag, a face, a tool. | Mark + compact + glyph + **drawn wordmark** + a 4–6 mark cast. One subject, one cut line, one flat fill, one hard offset. |

Cove and Strand are constructed; Sunnyside and Clearing are drawn. The difference is the
subject, not the taste. Do not mix tracks in one brand.

## The wordmark is a drawing

Outlined from the font file (`extract-wordmark.py`), or cut in cells. Never live text: a font
failure must not change the name. Below 40px the reading face carries the name.

An SVG used with `<img>` must **bake the ink in**, because `currentColor` resolves to black in
that document. `brand-forge.mjs --wordmark` does this for constructed lockups; drawn lockups
must do it by hand.

## Story: five beats and four cards

- **Belief** — what the product thinks is true.
- **Enemy** — the default it refuses. Be specific: a competitor's homepage, not "complexity".
- **Mark** — why this shape argues the belief.
- **Material** — the physical thing it is printed on or made of.
- **Proof / Gap** — the measured number, and the thing not measured.

Then **decision cards**, at most eight: *Decision / Because / Not when / Breaks next*. The
"not when" stops the rule becoming dogma; the "breaks next" stops the next agent undoing it.

## Tokens

Three layers, always:

```css
/* 1 · primitive — the material, named once */
--xx-paper: #f3ecdf;  --xx-ink: #191a2e;  --xx-cobalt: #3d53d6;

/* 2 · semantic — the job */
--xx-surface: var(--xx-paper);
--xx-text: var(--xx-ink);
--xx-accent: var(--xx-cobalt);

/* 3 · component — the only place a button knows its colour */
--xx-button-bg: var(--xx-surface-loud);
```

A night surface is a **scope**, never a second palette: swap the semantic layer under
`html[data-<slug>]` and keep the primitives. Every case with a dark surface does this, which is
why none of them drift.

## Side effects

Scripts read and write inside the repo. The exceptions are optional, and the agent says which
host and why **once, before the first network call** (and skips the step if the user declines or
the host is blocked; steps 3 and 8 and `--lint` are optional by design):

| Script | Network | Writes outside the case |
| --- | --- | --- |
| `brand-ref.mjs` | `raw.githubusercontent.com` (read) | cache in the OS temp directory |
| `assets.mjs` | the chosen source only | none; files go to `--out` |
| `design-md.mjs --lint` | npm registry, one pinned package (`@google/design.md@0.4.0`) | none |

API keys (`PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY`) are read from the environment and never
written to a file or printed. Nothing installs globally and no project file is uploaded anywhere.

## Output contract

```
features/<slug>/        tokens.json (gates also find public/brand/<slug>/<slug>-tokens.json),
                        <slug>-tokens.css, <slug>.module.css,
                        <slug>-data.ts, components/brand.tsx, theme-toggle.tsx
app/design-system/<slug>/  page.tsx, layout.tsx, llms.txt/route.ts, icon.svg
public/brand/<slug>/    mark, compact, glyph, mono, reverse, wordmark, lockups, favicons,
                        <slug>-tokens.css/json, DESIGN.md, <slug>-brandkit.png,
                        assets/ (+ credits.json, only if stock images are used)
design/figma/<slug>/    manifest.json, code.js, tokens.figma.json, openpencil-board.js,
                        assets/, fonts/, README.md
docs/                   <slug>-design-system-audit.md, <slug>-qa.md
```

Every asset has a use, a size and a source; every claim points to a file or a route. A case
without a board is a logo; a case without an audit is a brochure.

## Failure modes

- A new case that is an earlier one renamed: same sections, material and display face. Run detach
  first, and against outside brands too (`brand-ref.mjs ref`).
- An accent within 8° of a neighbour "because the material differs". It does not.
- A namespace collision (`--st-` twice) that silently merges two token sets.
- Mode-prefixed primitives (`--night-ground`) that vanish after a theme flip.
- A `TODO` in the DNA object; the next agent fills it with the neighbour's material.
- A detach score averaged instead of reported as the weakest pair.
- A component museum with no form kit, or a form kit with no error state.
- "Looks good" with no computed values or file paths.
- A hand-built Figma file, or an export reported done because a script printed `ok`. The proof is
  `figma-smoke.mjs`.
- A stock photo used as, traced into, or recoloured as the mark; or shipped with no credit.
- An outside brand copied instead of studied.
- A colour nudged until it passes, or a gate iterated past one retry: the number is then evidence
  of the tuning. Assign the job, print the failure.
- A universal section spine copied from the last case: it scores as shared structure.

## References

Read only what the task needs.

| File | Read when | Holds |
| --- | --- | --- |
| `references/case-evidence.md` | you need a precedent, a number or a decision | every case, detach data, recurring decisions |
| `references/research.md` | studying a category, or you need a photo or icon | brand library rules, DESIGN.md, asset licences |
| `references/gates.md` | before shipping, and when a gate fails | thresholds, 100-point breakdown, QA checklist |
| `references/immersive.md` | the page is correct but flat | the seven recipes with code |
| `references/tokens-and-docs.md` | writing the token layer or the llms twin | layers, ramps, agent-readable doc shape |
| `references/figma-export.md` | the system has to leave HTML | token → Figma mapping, emitters, traps |
| `references/logo-system.md` | drawing the family | grid, family, favicon |
| `references/form-theming.md` | building the form kit | the kit every case ships |
| `references/craft-bar.md` | the drawn track, or composing marks | the drawn-track bar, marks composition |

Templates: `templates/design-system.html` (full page), `single-page.html` (single-page proof),
`case-page.tsx`, `guidelines.md` (brand guide), `audit.json` (audit manifest),
`figma-plugin.js`. Worked examples: `examples/sunnyside.md`, `examples/vitrine.md`,
`examples/configs/` (`brand-forge` inputs).

## Scripts

| Script | Does |
| --- | --- |
| `init-system.mjs` | scaffold a case: namespace, hue-seeded palette, DNA, tokens, CSS, data, page |
| `brand-ref.mjs` | search 69 outside brands, `near` a hue, `pull` their DESIGN.md, `ref` them into detach |
| `detach-check.mjs` | OKLCH separation scorecard; `--scan` the portfolio |
| `gates.mjs` | every static gate in one command |
| `lib/tokens.mjs` | the one reader for every `tokens.json` shape and location; scripts import it |
| `test/` | unit tests: `node --test "scripts/test/*.test.mjs"` (CI runs them) |
| `brand-forge.mjs` / `cast-forge.mjs` | 22-concept universal mark & outlined wordmark generator (`--tokens`, `--bakeoff`) / a 4–6 drawn cast |
| `field-forge.mjs` | optional procedural SVG hero backgrounds (`mesh`, `bands`, `grain`, `dither`, `glass`, `grid`) + scrim & duotone CSS from `tokens.json` |
| `score-mark.py` | track-aware (`--track constructed|drawn|auto`) craft, circle, stroke, primitive & 16px scorer |
| `assets.mjs` | search and fetch free photos and icons with licence records |
| `audit.mjs`, `qa.mjs` | static audit; audit + score + browser pass |
| `render-board.mjs`, `render-icons.mjs`, `favicons.py`, `downscale.py` | board, icon set, favicons, image shrink |
| `extract-wordmark.py` | outlines a wordmark from a font file |
| `figma-forge.mjs`, `board.mjs`, `glyphs.mjs`, `figma-smoke.mjs` | Figma export and its check |
| `design-md.mjs` | tokens → `DESIGN.md`, `--lint` with Google's linter |
| `sync-skill.sh` | mirror this folder into `.agents/skills/` after any edit |
