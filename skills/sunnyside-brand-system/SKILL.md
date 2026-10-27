---
name: sunnyside-brand-system
description: Design and ship a complete brand kit and design-system guideline set from a written brief, including the logo family, a 3×3 brand board, favicon and app icons, design tokens, and the images that document them. Use when creating or auditing a brand identity, logo system, brand guidelines, design tokens, or a design-system docs page. Built from the Sunnyside portfolio case as a worked example.
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
---

# Sunnyside brand system

A method for turning a written brief into a brand kit **and** the design-system
guidelines that make it usable: the strategy, the mark, the wordmark, the
lockup, the favicon, the board, the images that document it, the tokens, and the
docs.

This is a general method. It uses the Sunnyside case as evidence, not as a
template to copy. If the brand is not Sunnyside, the mark, palette, type and
metaphor must be different.

## What you produce

- A one-page brand strategy: audience, promise, constraints, one metaphor.
- A logo family: primary mark, wordmark, horizontal lockup, stacked lockup,
  reversed variants, compact/favicon mark.
- A **3 × 3 brand board** as a real image (PNG), editable as HTML/CSS.
- A favicon set: 16/32/48 ICO, SVG, 180 apple, 192/512 app icons.
- Design tokens: primitive → semantic → component, as CSS and JSON.
- Guidelines: construction, clear space, minimum sizes, colour, type, do/don't,
  implementation notes.
- Verification evidence: every size, contrast pair and file path checked.

## When to use

Use this skill when asked to:

- create a logo, wordmark or logo family;
- design a brand kit, identity board or brand guidelines;
- turn a brand into a token system or design-system docs;
- make favicon/app icon sets;
- audit an identity for consistency, scale, contrast or genericness;
- generate the images that document a brand system.

Do **not** use it for a quick one-off icon with no system, or to copy an
existing identity. If the request is "make it look like [famous brand]", stop
and ask what the brand needs to say instead.

## Inputs

If no brief exists, ask for these before drawing. If the user cannot answer,
state the assumptions you are making and mark them for review.

1. **Name** and, if relevant, the studio/person behind it.
2. **Category** and what the thing actually does.
3. **Audience** and the context they arrive in.
4. **Promise** in one sentence, in the audience's words.
5. **Positioning**: what it is not, and what it should never look like.
6. **Constraints**: stack, media, sizes, accessibility, timeline, budget.
7. **References**: three, with a note on what specifically to take from each.
8. **Deliverables**: board, favicon, docs, print, social, app icon.

Write the brief to `brief.md` before the first canvas. It is the document every
review is held against. A template is in `references/brief.md`.

## Non-negotiables

- **One idea.** A brand can carry one metaphor and one loud field. If you need
  two metaphors to explain the mark, it is not reduced enough.
- **Draw, do not source.** A mark should be built from geometry, not assembled
  from clipart. No stock logos, no traced famous marks, no AI-generated mark
  that you cannot redraw as a clean vector.
- **Test at the smallest size first.** If it fails at 16px, it is not a mark
  yet. The favicon is a design constraint, not an afterthought.
- **The wordmark is a drawing.** Set it in outlines, not live text. A logo that
  changes when a font fails is not a logo.
- **One palette, used by role.** Base, ink, one loud field, two or three accents.
  Accents are punctuation, not body text.
- **Document the decision.** A file that only says *what* is a screenshot. The
  guide says *why*, *when not*, and *what breaks next*.

## Workflow

### 0. Read the brief, then write it down

Restate the job in one sentence. List the constraints and the things this
version will not do. Do not open the canvas until this exists.

### 1. Choose the one idea

Pick a metaphor from the product's action or the name's meaning. Use one of:

- **Monogram + meaning** — an initial cut by the product's action.
- **Product action** — build, protect, measure, send, reveal.
- **Metaphor fusion** — two ideas reduced into one shape.
- **Negative space** — the meaning lives in the hole, not the ink.
- **Construction geometry** — circles, cuts, grids, clipped rays.

Write the sentence the work can be rejected against. For Sunnyside it was
"a studio wall, not a template": paper, one cobalt field, drawn marks.

### 2. Explore six, keep one

Sketch at least six directions on the same 64-unit grid. Judge them on:

| Test | Pass condition |
| --- | --- |
| Silhouette | Recognisable as a black shape at 32px. |
| Reduction | No more than three shapes or one continuous stroke. |
| Meaning | Explainable in one sentence without naming the visual. |
| Scale | Holds at 16, 32, 64, 512 and on a favicon tile. |
| Ownability | Not a generic sun, bolt, leaf, shield or app-store glyph. |
| System | Leaves room for a wordmark, favicon and board. |

Keep one. Write down why the other five lost. That note becomes the guide.

### 3. Build the mark

Build in SVG on a 64-unit grid. Use exact values, not eyeballed points.

- Place the tile and the mark on a shared grid; clip rays or strokes at the tile
  edge if the mark should feel cut from paper.
- Use one flat fill per role. Outlines are ink; accents are flat.
- Give the mark a hard offset shadow if the system uses one. Never blur it.
- Build a **compact variant** for 16–24px: fewer details, no shadow, larger core,
  thicker edges. It is a separate drawing, not a scaled-down primary.
- Export `mark.svg` and `mark-compact.svg` with the same viewBox and colours.

Do not add a face or a mascot unless the brand's voice is explicitly playful and
the face survives the 16px test. A face that turns to mud at 16px is decoration.

### 4. Set the wordmark

Choose one of two routes:

1. **Type outlines** — instance the font at the required weight (e.g. Syne 800),
   shape it with the real kerning, apply tracking, then convert to paths.
2. **Drawn hand** — use the product's existing single-stroke marker alphabet, or
   draw one, and freeze the paths.

Either way the wordmark ships as outlines, not `<text>`. Use
`scripts/extract-wordmark.py` for the type route. Test the wordmark at 16, 24,
32, 64 and 160px wide. Avoid a wordmark that only reads at poster size.

Lock the wordmark to the mark with an **optical gap**, not an equal gap. Record
the gap, the wordmark height and the name size in the guidelines.

### 5. Build the family

The family is what makes it a system:

- horizontal lockup: mark + wordmark (the primary)
- stacked lockup: for square placements, covers and stamps
- mark only: for 1:1 placements
- compact mark: for 16–24px and favicons
- reversed wordmark/lockup: for ink or cobalt grounds
- glyph: the mark without its tile, for pattern and stickers

Define:

- **clear space**: half the mark's height on every side
- **minimums**: full mark, compact mark, wordmark width, lockup width
- **responsive lockup**: at what widths the name, then the wordmark, drop away
- **favicon**: the compact mark at 16/32/48, an SVG, and a 180 apple icon

### 6. Make the board

The board is the review artefact. Build it as HTML/CSS, not as a generated image;
you need exact typography and repeatable output.

- Canvas: 2400 × 1800 (4:3), 3 × 3 grid, 54px outer padding, 14px gutters.
- Panels: cover, index/positioning, construction, digital application, colour,
  type, icon, image direction, essence. One loud panel, the rest quiet.
- Use the real brand assets and the real fonts. Use sparse text: labels, one
  headline, one tagline, short captions.
- Render at 2× with Playwright, then downscale to 3000 × 2250 with Lanczos.
- Keep the HTML in the repo as the editable source.

The full recipe and panel map are in `references/board-and-images.md`. The
starter is `templates/brandkit.html`. Render it with
`scripts/render-board.mjs`.

### 7. Art-direct the images

Separate the **guideline image** from the **brand image**:

- The board is rendered HTML. Do not use an image model for type, logos or
  layout; it will misspell the name and redraw the mark.
- Generated imagery is for atmosphere, photography, texture or illustration
  *inside* the brand world. It never replaces the mark, the wordmark or the
  token documentation.
- Prompt the light, material, grain, palette, subject and crop. Say what must
  **not** appear (text, logos, stock smiles, gradients, extra fingers).
- Store the prompt, model, seed and source next to the image. A generated image
  with no provenance is a liability.
- For a brand board, a CSS/SVG atmosphere panel is often stronger than an AI
  image: it uses the actual palette, stays on-brand and has no uncanny artefacts.

Prompts and provenance rules are in `references/image-direction.md`.

### 8. Make the icons

- Render the compact mark through Playwright at 16, 32 and 48px with a
  transparent background.
- Build the ICO with `scripts/favicons.py` (Pillow).
- Build the 180 apple icon on a paper/background colour, with the mark centred.
- Keep the 192/512 PNGs for app/PWA use.
- Check the 16px result at 1× on light and dark chrome before shipping.

### 9. Write the tokens

Use three layers, in this order:

1. **Primitive** — raw values: paper, ink, cobalt, butter, tangerine.
2. **Semantic** — roles: surface, text, border, action, focus, accent.
3. **Component** — button background, card border, focus ring.

Rules:

- No raw hex in components; components read semantic tokens.
- Namespace the design-system tokens (e.g. `--brand-*`) where the app already
  owns common names such as `--muted` or `--border`.
- Export CSS custom properties and a JSON token file from one source.
- Type, spacing, radius and motion are tokens too.

### 10. Write the docs

Ship a brand guide and a system guide, not a folder of exports:

- the idea and the one-sentence essence
- the mark, construction, clear space and minimums
- the wordmark and lockups
- colour, with roles and contrast pairs
- type, with real specimens
- favicon and app icons
- do/don't, including the mistakes you actually made
- implementation paths and file names
- what is still missing

A docs page should be readable without JavaScript. Use semantic headings,
descriptive links, real tables, and one raw Markdown twin if the site can serve
it. Agents read the HTML; do not hide the only copy of a rule in a tab or an
image.

### 11. Verify

Run the checklist in `references/verification.md`. At minimum:

- the mark at 16, 32, 34, 64, 512 and as a favicon on light/dark chrome
- the lockup at desktop, 480, 360 and 320
- the favicon ICO contains 16, 32 and 48
- contrast: body 4.5:1, large 3:1
- every exported file has a stated use and minimum size
- every guideline claim points to a shipped file or route
- no stock marks, no fake logos, no invented metrics

## The Sunnyside case

The case is the worked example. It is not a template; its values are specific.

- **Category**: a design engineer's portfolio and design system.
- **Metaphor**: the sunny side of a record, a day, a page. A sun cut from paper.
- **Mark**: a 64-unit grid, 58 × 58 cobalt tile with a 16 radius and 2.6 ink
  edge; butter sun at 31 / 29.5 with a 16.5 radius; twelve 30° rays clipped by
  the tile; 2.5 hard ink offset; a face with bar eyes, a 2.7 smile and two
  tangerine cheeks at 55%.
- **Compact mark**: no shadow, eight rays, 3.2 edges, larger sun for 16px.
- **Wordmark**: the site's marker alphabet, frozen as outlines. Header: 34px
  mark, 10px optical gap, 87.7 × 25 wordmark, 8.5px name at 0.14em. Name drops
  at 480, wordmark at 360.
- **Palette**: paper `#f3ecdf`, ink `#191a2e`, cobalt `#3d53d6`, butter
  `#ffd23f`, tangerine `#ff6a2b`. Ink on paper 14.55:1; cream on cobalt 5.93:1.
- **Type**: Syne 800 display, Geist 400 reading, Geist Mono 500 labels at
  0.14–0.2em, the marker for annotations.
- **Board**: 2400 × 1800, 8 panels with the cover spanning two columns, rendered
  at 2× and downscaled to 3000 × 2250.
- **Docs**: `design/brand/README.md`, `design.md`, `/sunnyside`, a downloadable
  brand board and SVG lockups, plus a Markdown/llms route for agents.
- **Still open**: no committed performance baseline, no visual/a11y CI, no
  generated-imagery pipeline with provenance, the Pen.dev loop is manual, no
  component-level docs, no published motion spec.

The point of the case is not the sun. It is the chain: one idea → one mark →
one family → one board → one token set → one guide → one verification pass.

## Failure modes

- **The emoji sun.** A face drawn without construction reads as an emoji. Build
  it on a grid and test it at 16px before adding charm.
- **The app-store tile.** A rounded square with a glyph is not automatically a
  brand. The mark inside has to carry the meaning.
- **The type logo.** Using live Syne text as the wordmark means the logo breaks
  when the font does. Convert to outlines.
- **The one-off board.** A beautiful board with no exportable mark, favicon or
  token file is a poster, not a kit.
- **The invisible system.** Guidelines that only live in a PDF or a Figma file
  are not in the product. Put them on a route with real links.
- **The AI image brand.** Generated imagery cannot establish the mark or the
  type. Use it only where a photograph or atmosphere is the point.

## Output contract

A complete delivery looks like:

```
brand/
  brandkit.html
  sunnyside-brandkit.png        # 3000 × 2250
  assets/
    wordmark.woff2
    ...
public/brand/
  mark.svg
  mark-compact.svg
  wordmark.svg
  lockup.svg
  lockup-reverse.svg
  lockup-stacked.svg
  glyph.svg
  favicon-16.png
  favicon-32.png
  favicon-48.png
  icon-192.png
  icon-512.png
  mark-1024.png
app/
  favicon.ico
  icon.svg
  apple-icon.png
docs/
  brand-guide.md
```

Adapt the paths to the host project. The contract is: every asset has a use, a
size and a source; the guide explains why; the icons are tested at 16px.

## References

- `references/brief.md` — the brief, the constraints and the output contract.
- `references/logo-system.md` — concepts, geometry, lockups, clear space, favicon.
- `references/board-and-images.md` — the 3 × 3 board, render pipeline, image QA.
- `references/image-direction.md` — prompts and provenance for generated imagery.
- `references/tokens-and-docs.md` — token layers, docs structure, agent-readable docs.
- `references/verification.md` — the ship checklist.

## Scripts and templates

- `scripts/render-board.mjs` — render an HTML board to PNG with Playwright.
- `scripts/favicons.py` — build PNG/ICO/app icons with Pillow.
- `scripts/extract-wordmark.py` — convert shaped text to SVG outlines.
- `templates/brandkit.html` — a 3 × 3 board starter.
- `templates/guidelines.md` — a brand-guide starter.

## How to use this skill well

1. Read the brief before you draw. Write the one-sentence direction.
2. Explore six, keep one, and write down why.
3. Build the mark and wordmark as vectors; test them at 16px.
4. Build the family and the board; do not skip the favicon.
5. Render the board from HTML; keep the source.
6. Art-direct only the images that need to be photographs.
7. Write the tokens and the guide; make them readable without JS.
8. Verify every size, contrast pair and link.
9. Name what is missing. A guide that hides its gaps is a brochure.
