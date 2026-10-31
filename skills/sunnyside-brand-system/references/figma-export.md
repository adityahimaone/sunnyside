# Figma, by script

A design system that only exists as HTML is a website. The export to Figma is
what makes it a system other people can use: variables someone can bind, styles
someone can apply, components someone can instance.

This file is the contract for `scripts/figma-forge.mjs`. One token source, two
emitters, and a list of what neither of them can carry.

## Why a generator

A hand-written Figma plugin is a second implementation of the palette. It drifts
the first time the brand moves, and nobody notices until a designer uses a
swatch that was retired two months ago.

`figma-forge.mjs` reads the same `tokens.json` the page reads and writes the
plugin. When the tokens change you re-run one command; the plugin is not edited,
it is replaced.

```bash
node scripts/figma-forge.mjs \
  --tokens features/<slug>/tokens.json \
  --css    public/brand/<slug>/<slug>-tokens.css \
  --brand  public/brand/<slug> \
  --html   app/design-system/<slug>/page.html \
  --slug   <slug> --name "<Name>" --essence "<one line>" \
  --out    design/figma/<slug> --target both
```

`--check` prints what it resolved and writes nothing. Run it first: it is the
cheap way to find out that the token file uses a shape the forge does not know.

## The two emitters

| | `figma` | `openpencil` |
| --- | --- | --- |
| Output | `manifest.json` + `code.js` | `openpencil.build.js` + a real `.fig` |
| Runs in | Figma desktop | the OpenPencil CLI, headless |
| Variables | yes, Light + Dark modes | no |
| Paint / text / effect / grid styles | yes | no |
| Components with variants | yes | no |
| Vector marks | yes | yes |
| Fidelity of the page layout | rebuilt from tokens | imported from the HTML |

The second column is not a lesser version of the first. The OpenPencil headless
runtime has `createPage`, `createFrame`, `createText`, `createComponent`,
`createNodeFromSvg` — and **no** `figma.variables`, `createTextStyle`,
`createPaintStyle`, `createEffectStyle` or `createGridStyle`. Verified against
`openpencil 0.16.0`:

```
$ openpencil eval d.fig -c 'typeof figma.variables'
"undefined"
```

So the `.fig` path is geometry: the page, the sections, the marks. The plugin is
the system: the tokens as variables, the roles as styles, the states as variants.

## The mapping

| Token | Figma construct | Notes |
| --- | --- | --- |
| `color.primitive.*` | variable in `Colour`, both modes | one value, both modes — a primitive does not change at night |
| `color.light.*` / `color.dark.*` | the same variable, per mode | an alias when `$ref`/`var()` names a primitive, a literal when it does not |
| semantic colour | paint style `Colour/Semantic/<name>` | the paint is *bound* to the variable, so a mode flip recolours it |
| `type.*` | text style `Type/<name>` | size in px, line height as a percent, tracking converted from em to px |
| `space.*` | FLOAT variable in `Spacing` | |
| `radius.*` | FLOAT variable in `Radius` | |
| `motion.*` | FLOAT variable in `Motion` | milliseconds, so the name says `dur-` and the unit is not a guess |
| `shadow.*` | effect style `Elevation/<name>` | only when the token file has shadows; nothing is invented |
| a base of 8 in `space` | grid style `Layout/Columns` | 12 columns, gutter from the token file |
| every `*.svg` in the brand folder | `createNodeFromSvg`, one cell each | outlines, never live text |

## Gates

Run these before saying the export is done. Each one has failed here.

**1 · The plugin builds.** `scripts/figma-smoke.mjs` runs the generated plugin
against a stub of the Figma API and reports what it created.

```bash
node scripts/figma-smoke.mjs design/figma/<slug>/code.js
```

It fails on: a variable written before its collection, a text style whose font
was never loaded, an alias pointing at a variable that does not exist, a colour
channel outside 0–1, a variant combined into a set that is not its parent, and a
plugin that reports success after swallowing an exception.

A plugin that has never been opened is a plugin nobody has tested. This is not
the same as opening it — it is the same as not shipping an obvious typo.

**2 · The counts match the tokens.** The smoke report prints
`N pages, N variables, N text styles, N components`. Variables must equal
primitives + semantic names (a semantic that reuses a primitive name reuses the
variable) + spacing + radius + motion. If `semantic` and `primitive` counts are
equal and the total looks doubled, the alias resolver is not firing — check that
`$ref` is being read, not only `var()`.

**3 · The font is installed where the file will be opened.** A text style named
`Type/text-display` set in a family Figma does not have falls back silently. The
name survives, the face does not, and the specimen lies. `--fig-font brand`
keeps the brand face in the `.fig`; the default resolves to a family the
headless rasterizer can draw, because a blank proof reads as a broken export.

**4 · The `.fig` opens and the sections are named.** `openpencil info` and
`openpencil tree` are the proof, not the script's summary.

```bash
openpencil info design/figma/<slug>/<slug>.fig
openpencil tree design/figma/<slug>/<slug>.fig --depth 2
```

Every section frame must read `01 · foundation`, not `foundation`. An unnamed
stack of frames is a screenshot of a page, not a document.

## What neither emitter carries

- **Behaviour.** No component reads an API. States are drawn.
- **Text as a live wordmark.** The wordmark is outlines, always. That is the
  point of it.
- **A page's media queries.** The import takes one viewport. The Figma pages are
  rebuilt at a fixed width, so a 390px layout is a separate frame somebody has
  to draw, not something the export derives.
- **Dither, grain and clip-path edges.** They are CSS. The Figma file gets the
  flat plate and the mark; the texture stays on the page.

## Case: Clearing, and the six things it broke

Clearing is the first case exported that was not written for this script. It uses
the oldest token shape (a flat `color` dict, one `semantic` group, `type` as a
dict of families plus a `scale`), a `--cl-` namespace, and a night scope that
lives only in the CSS. Every item below was a real failure on the first run, not
a hypothetical.

| Symptom | Cause | Fix |
| --- | --- | --- |
| `semantic.light` = 5 of 9, `dark` = 0 | The header comment contains `html[data-clearing='night'] .cl-scope`. The scope splitter searched the raw text, found the comment first, and cut the sheet inside it | Strip `/* … */` before scanning, then take the dark rule that declares the most custom properties |
| Every light token came out as its night value | The theme block was read back into the light scope after being read as dark | Light is everything the theme block is not |
| `families` all `Inter` | CSS declares `--cl-font-display`; the reader looked for `font-display` | Register the bare name next to the namespaced one, once, right after the split |
| `motion` = 4, one at 0ms | `ease: "cubic-bezier(…)"` sits in the same group as the durations, and `toPx(x) \|\| 0` turned it into a zero | A duration is `N` or `Nms`; anything else is not a FLOAT variable |
| `accent` = the body ink | `textPrimary` matches `/primary/` and comes first in the semantic list | Match `accent\|brand` first, and exclude text/ink roles outright |
| No aliases at all | `var(--surface-page)` names a semantic, not a primitive, so `ref` resolved to nothing | One hop through the CSS (`--cl-surface-page: var(--cl-cream)`) recovers the primitive; 6 of 9 semantic tokens then alias |

And in the `.fig` pass:

- **The imported frame arrives with a white fill.** A mark on a cream sheet
  rendered on a white tile. Set `node.fills = []` right after
  `createNodeFromSvg`.
- **Capping the scale at 1 makes a postage stamp.** A 64-unit mark in a 300px
  cell stayed 64px. Scale up as well as down, with a sanity ceiling.
- **A reverse cut is cream.** On a cream ground it vanishes. The cell needs the
  brand's own night ground, taken from the dark semantic surface.
- **A cream swatch has no edge on a cream sheet.** Clearing ships exactly one.
  Every swatch gets a 1px hairline at 30% of the muted ink.
- **Board mode left the 1×1 seed page.** It is an artefact of giving `eval` a
  document to open, not part of the deliverable; remove it.

Result on the second run: 33 variables (15 colour across two modes, 18 numbers),
6 aliases, 15 paint styles, 7 text styles, 10 components, 6 pages; a `.fig` with
3 pages, 259 nodes and 10 vector marks.

## The board, and why it is drawn in ops

`--target openpencil` no longer imports an HTML page. It builds a board from
`scripts/board.mjs`, which emits **drawing instructions** — rect, line, circle,
text, vector — and `templates/openpencil-board.js` turns them into real nodes.

That is not a preference. It is what survived four failed approaches:

| Tried | Result |
| --- | --- |
| One SVG per section, text as `<path>` with `transform="translate() scale()"` | "Clearing" rendered as "Cle". The importer truncates a path placed by a transform |
| Same, with the position baked into the coordinates | Exact near the origin, truncated past x≈600 — "textPrimary" became "te" at x=944 |
| One SVG node per string, positioned by `node.x` | Long strings still truncated; short ones fine |
| One SVG node per 6-glyph chunk | Works — this is what the display voice uses |

So: **the display voice is outlined** (chunks of six glyphs, absolute
coordinates, one node each) and **every other voice is a live text node**.

The reason is the rasterizer, not the importer. It substitutes an unknown sans or
mono for Inter and draws it; it does **not** substitute a serif — a Georgia text
node renders completely blank. A cover with no title is worse than a cover in the
wrong sans, so the serif is outlined and the rest stays editable.

Two more things the runtime drops, both worked around in the forge:

- `<image href="data:…">` inside an SVG is ignored. Rasters go in with
  `figma.createImage(bytes)` and an `IMAGE` fill on a rectangle.
- `createNodeFromSvg` returns a **frame with a white fill**. A mark on a cream
  sheet lands on a white tile until that fill is cleared.

And one asset class needs preprocessing: the clearing wordmark is drawn inside
`<g transform="scale(1,-1)">`, which the importer mangles into a row of dashes.
`foldFlip()` negates the y coordinates and mirrors the viewBox — only when that
flip is the file's *only* transform, because guessing at a matrix turned the
stacked lockup into a knot.

## Fonts, honestly

**A `.fig` stores family names, not font data.** No tool can embed a font in one,
so "export with the font inside" is not a thing that exists — not here, not in
Figma, not in any converter. What the export does instead:

1. names the real families on every text node and text style;
2. ships the `.ttf` files it resolved in `fonts/`, with the voice each answers;
3. outlines the display voice, so the one face that cannot be substituted is
   never missing.

Installing the two files is one drag onto Font Book, and after that the file is
exact everywhere. Without them Figma substitutes and the layout still holds —
which is the correct behaviour, and the reason the layout is built on measured
advances rather than on the fallback's metrics.

## Traps

| Trap | Fix |
| --- | --- |
| `figma.variables` is undefined in `openpencil eval` | The headless runtime is geometry-only. Use the plugin for variables and styles; use `eval` for pages, frames, vectors |
| Text set in a font the rasterizer does not bundle exports blank | Only the bundled families draw. `--fig-font Inter` to proof the layout, `--fig-font brand` to keep the real face in the file |
| `openpencil import` needs a file that exists | It does not create a document from nothing. Import the page (or a 1×1 seed) first, then `eval` |
| `figma.root.insertChild(0, page)` does not reorder pages | Page order in the headless runtime is append-only. Name pages `00 ·`, `01 ·` so the order is readable even when it is not enforced |
| A section frame is named `foundation` in the import | Rename to `NN · name` in the build pass; the tree is the index |
| `var(--x)` in an SVG fill is dropped | `sanitizeSvg()` unwraps to the fallback hex before import. `var()` with no fallback becomes `currentColor` and renders black |
| The root `<svg>` has `width`/`height` and no `viewBox` | The forge synthesises a `viewBox` from the pair, then strips both, so every importer sizes from the box |
| `combineAsVariants` throws | Every component must already be a child of the same parent. Build them into the host frame first, combine second |
| A paint style binds to a variable that was skipped | `buildVariables` fails per-variable and keeps going; `buildPaintStyles` binds only what exists and falls back to a literal |
| The light palette comes out as the night palette | The CSS comment names the dark selector. Strip comments before splitting, and never read the theme block back into the light scope |
| A duration variable is 0ms | `ease` shares the group with the durations. Only `N` and `Nms` are durations |
| Marks render as small tiles on a white square | `createNodeFromSvg` returns a frame with a white fill, and the scale was capped at 1. Clear the fill, scale up |
| A reverse mark disappears | It is cream on cream. Give its cell the brand's dark ground |
| A long outlined path loses its tail | Chunk it: six glyphs per node, absolute coordinates. The importer truncates past roughly twenty sub-paths, and sooner the further the path sits from the origin |
| An outlined path with a `transform` renders short | Bake the position into the coordinates |
| A serif text node renders blank | The rasterizer substitutes sans and mono, not serif. Outline the display voice |
| `<image>` inside an SVG is ignored | `figma.createImage(bytes)` and an `IMAGE` fill on a rectangle |
| A mark sits on a white tile | `createNodeFromSvg` returns a frame with a white fill; clear it |
| A flipped group imports as dashes | Fold `scale(1,-1)` into the coordinates, and only when it is the file's only transform |
| The default `Page 1` survives | The plugin removes an empty `Page N` at the end. A file whose first page is empty reads as unfinished |
