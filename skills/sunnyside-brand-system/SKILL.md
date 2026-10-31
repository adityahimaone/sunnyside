---
name: sunnyside-brand-system
description: 'Design and ship a brand kit or design system from a brief: one idea, a mark family, tokens, a board, an immersive proof page, Figma and DESIGN.md exports, and a measured audit. Use when creating, initialising, auditing or exporting an identity, a design-system page, or a single-page proof.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '3.3'
---

# Sunnyside brand system

**One idea → one mark → one system → one proof → one audit.**

Eight systems were built with this method: Sunnyside, Vitrine, Huginn, Riso Co., Hachure, Cove,
Strand and Clearing. Every rule is here because it survived one of them and every gate because
it caught something in one. This file is the whole method; the references hold evidence and code.

## The fast path

Eleven steps after a pre-flight. **Each step has one exit and nothing loops back:** when a gate
fails, go to the step the gate table names, fix only that, and re-run only that gate.

```bash
# 0 · pre-flight, once
node scripts/init-system.mjs --slug <slug> --name "<Name>" --hue <n> --peek
node scripts/brand-ref.mjs near --hue <n>            # who already owns this hue (needs network)
```

1. **Brief, in six lines.** Name, category, audience, promise, enemy, one sentence the work can
   be rejected against. If it needs a comma splice, the idea is not ready.
2. **Pick the track.** Constructed or drawn, one per brand. See *Two tracks*.
3. **Study the neighbours** (skip with no category). `brand-ref.mjs search <category>`, `pull`
   two or three, note their accent hue, display face and what they refuse; `ref` them for the
   gate. Study, never copy: `references/research.md`.
4. **Draw six, keep one.** Six marks in one file, one render, scored. Write why the other five
   lost; that paragraph becomes the guide.
5. **Generate the family.** `brand-forge.mjs` (constructed) or hand-cut SVGs (drawn): primary,
   compact, glyph, lockup. The compact is a separate drawing.
6. **Write the tokens, then run the gates.** One source, three layers, two surfaces, never a
   mode-prefixed primitive. Then `node scripts/gates.mjs --slug <slug> --refs refs/`. The cheap
   failures (a font never loaded, a contrast pair never computed) surface here, before the board,
   page and export are built on top of them.
7. **Build the board.** 1500 × 1125, local fonts, rendered at 2×. It is the thumbnail.
8. **Build the proof page, with its marks section.** Hero, contents, the sections the system
   needs, tokens, audit; a logo card, wordmark scale, cast drawer and one usage rule. A row of
   equal logo tiles is not a mark system. Need a photograph? `assets.mjs`, imagery only.
9. **Export.** `figma-forge.mjs` (plugin + `.fig`) and `design-md.mjs` (`DESIGN.md`), both from
   the tokens, both regenerated, never edited.
10. **Final gates.** `gates.mjs` again, then `qa.mjs` for the two that need a rendered page.
11. **Name the gaps.** A guide that hides its gaps is a brochure.

## The gates

Each failed a shipped case. Run them; do not reason about them.

| Gate | Pass | Run by | If it fails, go to |
| --- | --- | --- | --- |
| **Detach** | ≥ 70/100 against every sibling and `--refs`, no hard fails | `gates.mjs` | 6, hue or material (an "incomplete tokens" note means fix the file, not the hue) |
| **Display face** | differs from every sibling | `gates.mjs` | 6, type roles |
| **Font registered** | every `--font-*` in the token CSS is declared in a layout | `gates.mjs` | 6, layout |
| **Contrast** | pairs recomputed from hex, stated ratios match, at least one failure published | `gates.mjs` | 6, semantic layer |
| **Assets licensed** | every stock file has a `credits.json` entry with licence and credit | `gates.mjs` | 8, `assets.mjs get` |
| **Export builds** | `figma-smoke.mjs` exits 0 | `gates.mjs` | 9, regenerate |
| **Mark at 16px** | the compact is a different drawing | `qa.mjs` | 5 |
| **Reduced motion** | the still frame is the design | `qa.mjs` | 8 |

Evidence per gate, thresholds and the 100-point breakdown: `references/gates.md`. **Contrast
matters most:** a palette that only publishes its passes is a brochure, so a case prints the
pair that fails and the job it may therefore not do.

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

Six of the eight cases are constructed; Sunnyside and Clearing are drawn. The difference is
the subject, not the taste. Do not mix tracks in one brand.

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

## Output contract

```
features/<slug>/        tokens.json, <slug>-tokens.css, <slug>.module.css,
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

- A ninth case that is the eighth renamed: same sections, material and display face. Run detach
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

## References

Read only what the task needs.

| File | Read when | Holds |
| --- | --- | --- |
| `references/case-evidence.md` | you need a precedent, a number or a decision | the eight cases, detach data, recurring decisions |
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
| `gates.mjs` | the six static gates in one command |
| `brand-forge.mjs` / `cast-forge.mjs` | the constructed family (`--bakeoff`) / a 4–6 drawn cast |
| `score-mark.py` | circles, strokes, primitives, 16px |
| `assets.mjs` | search and fetch free photos and icons with licence records |
| `audit.mjs`, `qa.mjs` | static audit; audit + score + browser pass |
| `render-board.mjs`, `render-icons.mjs`, `favicons.py`, `downscale.py` | board, icon set, favicons, image shrink |
| `extract-wordmark.py` | outlines a wordmark from a font file |
| `figma-forge.mjs`, `board.mjs`, `glyphs.mjs`, `figma-smoke.mjs` | Figma export and its check |
| `design-md.mjs` | tokens → `DESIGN.md`, `--lint` with Google's linter |
| `sync-skill.sh` | mirror this folder into `.agents/skills/` after any edit |
