---
name: sunnyside-brand-system
description: Design and ship a brand kit or design system from a brief — one idea, a mark family, a board, tokens, an immersive proof page, and an audit that names what it could not verify. v3.1 is written from eight shipped cases: a fast path you can run in one sitting, six gates that each failed something real, and the recipes that make a page feel printed rather than decorated. Use when creating, initialising or auditing an identity, a design-system page, or a single-page proof.
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '3.1'
---

# Sunnyside brand system

**One idea → one mark → one system → one proof → one audit.**

Eight systems were built with this method: Sunnyside, Vitrine, Huginn, Riso Co., Hachure,
Cove, Strand and Clearing. Every rule below is here because it survived one of them, and
every gate is here because it caught something in one of them. Nothing is here because it
sounded good.

v3.1 is the fast version. The whole method is this file; four references hold the evidence and
the code. If you read only this page you can still ship a case.

## The fast path

Ten steps. A case that follows them takes one sitting, not one week.

```bash
# 0 · where does it sit? (skip on an empty repo)
node scripts/init-system.mjs --slug <slug> --name "<Name>" --hue <n> --peek
node scripts/init-system.mjs --slug <slug> --name "<Name>" --hue <n> --mode light
node scripts/detach-check.mjs --new features/<slug>/tokens.json --ref features/<ref>/tokens.json
```

1. **Brief, in six lines.** Name, category, audience, promise, enemy, one sentence the work
   can be rejected against. If the sentence needs a comma splice, the idea is not ready.
2. **Pick the track.** Constructed (geometry, systems, infrastructure) or drawn (editorial,
   warm, object-led). One per brand, never mixed. See *Two tracks*.
3. **Draw six, keep one.** Six marks in one file, one render. Score them, keep one, write why
   the other five lost — that paragraph becomes the guide.
4. **Generate the family.** `brand-forge.mjs` for constructed, hand-cut SVGs for drawn.
   Primary + compact + glyph, then a lockup. The compact is a *separate drawing*.
5. **Write the tokens.** One source, three layers, two surfaces. Never a mode-prefixed
   primitive.
6. **Build the board.** 1500 × 1125, local fonts, rendered at 2×. It is the thumbnail.
7. **Build the proof page.** Hero, contents, the six sections the system actually needs,
   tokens, audit. This is the deliverable that gets linked.
8. **Compose the marks section.** Logo card, wordmark scale, cast drawer, one usage rule. A
   row of equal logo tiles is not a mark system.
9. **Run the gates.** One command each. Fix only what fails.
10. **Name the gaps.** A guide that hides its gaps is a brochure.

## The six gates

Each of these failed a shipped case. Run them; do not reason about them.

| Gate | Pass | Evidence |
| --- | --- | --- |
| **Detach** | ≥ 70/100 against *every* sibling, no hard fails | Strand vs Clearing measured **59** — published, not averaged |
| **Display face** | different from every sibling | Vitrine and Riso Co. both set Space Grotesk; the gate calls that a hard fail |
| **Font registered** | the family named in the token is declared in the layout | Cove shipped `var(--font-sora)` with no Sora in `app/layout.tsx` — a silent fallback |
| **Contrast** | every pair computed from the semantic layer | Riso publishes two failures (2.96:1, 2.03:1) on purpose |
| **Mark at 16px** | the compact is a different drawing | Riso's pin closes up; Huginn's 3-unit gap vanishes |
| **Reduced motion** | the still frame is the design | the Wild Hunt footer keeps a finished frame, not a frozen one |

Full thresholds, the 100-point breakdown and the QA checklist: `references/gates.md`.

**The fourth matters most.** A palette that only publishes its passes is a brochure. Every
case prints the pair that fails and the job it is therefore not allowed to do.

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

If a mark ships as an SVG used with `<img>`, **bake the ink in**. `currentColor` resolves to
black inside that document; every lockup in the eight cases is generated with
`scripts/build-lockup.mjs --ink <hex>` for exactly this reason.

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
public/brand/<slug>/    mark, compact, glyph, mono, reverse, wordmark, lockups,
                        favicons, <slug>-tokens.css/json, <slug>-brandkit.png
docs/                   <slug>-design-system-audit.md, <slug>-qa.md
```

Every asset has a use, a size and a source; every claim points to a file or a route. A case
without a board is a logo; a case without an audit is a brochure.

## Failure modes

- A ninth case that is the eighth renamed: same section ids, same material, same display face.
  The detach gate exists for this and it is the first thing to run.
- An accent within 8° of a neighbour, explained as "different because the material is
  different". It is not different.
- A namespace collision (`--st-` twice) that silently merges two token sets.
- Mode-prefixed primitives (`--night-ground`), so the semantic layer points at names that do
  not exist after a theme flip.
- A `TODO` in the DNA object. The next agent fills it with the neighbour's material.
- A detach score reported as an average instead of the weakest pair.
- A component museum with no form kit, or a form kit with no error state.
- "Looks good" with no computed values or file paths.

## References

Read only what the task needs. Four files, not twenty.

| File | Read when | Holds |
| --- | --- | --- |
| `references/case-evidence.md` | you need a precedent, a number, or a decision already made | the eight cases, their facts, the detach data, the recurring decisions |
| `references/immersive.md` | the page is correct but flat | the seven recipes with code, and the numbers behind them |
| `references/gates.md` | before shipping, and when a gate fails | detach thresholds, the 100-point breakdown, type gate, contrast, QA checklist |
| `references/tokens-and-docs.md` | you are writing the token layer or the llms twin | layers, ramps, the agent-readable doc shape |

Kept from v3.0 because the cases used them: `references/logo-system.md` (grid, family,
favicon), `references/form-theming.md` (the form kit every case ships),
`references/craft-bar.md` (the drawn-track bar and the marks composition).

## Scripts

| Script | Does |
| --- | --- |
| `init-system.mjs` | scaffold a case: namespace, hue-seeded palette, DNA, tokens, CSS, data, page |
| `detach-check.mjs` | OKLCH separation scorecard, `--scan` for the whole portfolio |
| `brand-forge.mjs` | the constructed mark family, `--bakeoff` for five families |
| `cast-forge.mjs` | a 4–6 drawn cast |
| `score-mark.py` | circles, strokes, primitives, 16px |
| `audit.mjs` | static audit of the manifest |
| `qa.mjs` | one command: audit + score + browser pass |
| `render-board.mjs`, `render-icons.mjs`, `favicons.py` | the board and the icon set |
| `extract-wordmark.py` | outlines a wordmark from a font file |

## How to use this well

1. **Run the detach check before drawing.** A duplicated palette cannot be rescued by a better
   mark.
2. **Write the sentence before the mark.** If it needs two clauses, cut one.
3. **Draw six, keep one, and write the rejection.** The rejection is the guide.
4. **Build the board and the page in the same pass.** They drift apart in a week otherwise.
5. **Publish one failing pair.** It is the difference between a system and a moodboard.
6. **Stop at the acceptance test.** Extra sections are not "more complete".
