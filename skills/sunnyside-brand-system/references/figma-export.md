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

## The third emitter: an HTML sheet, and a binder

The two emitters above rebuild the *system* from tokens. Neither one imports the
*page*. That job belongs to an HTML importer, and the repo now ships the input
for it plus the plugin that reconnects the result.

```
tokens.json ─┬─ figma-html.mjs   → <slug>-figma.html ─→ html.to.design / Stitch ─┐
             ├─ figma-forge.mjs  → build plugin (variables, styles, variants) ──┼→ Figma
             └─ figma-bind.mjs   → bind plugin  (measured RGB → variables) ─────┘
```

`scripts/figma-html.mjs` writes one self-contained white-background HTML file
with eight sheets — colours, primitives, typography, logo, cast, components,
overlays, patterns — inlined SVG marks, `data-figma-node` labels, `?clean=1` for
a chrome-free capture, and a 1440px two-column canvas-grid mode sized for Doop
and Figma import limits. It is **not** a Figma file and emits **no** auto-layout
metadata; standard CSS flex/grid is what the importer reads.

```bash
node scripts/figma-html.mjs --slug <slug> --root . --check
node scripts/figma-html.mjs --slug <slug> --root .
```

`--tokens <path>` overrides discovery for repos that keep tokens at
`<case>/src/tokens.json`. `--all` scans both root-level `features/` and per-case
folders. Both `primitives[]` and `color{}` token shapes are supported; a case
with no `contrast` array simply gets an empty ledger.

`templates/figma-doc.html` is the shipped reference output for Setout (Case 24).
The generator builds its HTML inline, so that file is documentation, not an
input — do not wire it into the build.

### Why a binder and not another converter

Figma's Plugin API can set `layoutMode`, `itemSpacing`, `padding*`, HUG/FILL,
`GRID` tracks and `layoutPositioning` programmatically, so auto layout during
generation is entirely possible. It is also already done: html.to.design,
Stitch to Figma, Builder.io and Web to Design all map DOM + computed CSS to
native Figma Auto Layout. A home-grown converter would duplicate that category
and lose on fidelity — a July 2026 comparison put html.to.design at ~65% on a
grid dashboard with imperfect Auto Layout grouping.

What no importer does is bind your OKLCH tokens to Figma variables. That is the
one honest gap, and it is ~one screen of API:

```bash
node scripts/figma-bind.mjs --slug <slug> --root . --out design/figma/<slug>-bind
node scripts/figma-bind-smoke.mjs design/figma/<slug>-bind/code.js
```

The generated plugin walks the selection (or the whole page), matches each SOLID
fill and stroke to a local COLOR variable by **measured RGB**, and each text node
to a local text style by font size + family. Nothing is guessed by name. If no
local COLOR variables exist it creates the primitive collection from the token
file and reports that it did — colours only, not modes, aliases or styles.

`--infer-layout` turns on `FrameNode.inferredAutoLayout`, Figma's own heuristic,
for flat imports such as **Doop's Copy for Figma**. Doop's docs are explicit:
*"It's a snapshot, not a sync: auto layout, variables, and components aren't
recreated."* Use the heuristic only there. Applying `layoutMode` to frames that
an HTML importer already laid out reflows their children and wrecks the import,
so the option is off by default and the smoke test asserts untouched frames stay
untouched.

### Auto Layout straight from the page

No HTML attribute can give Figma variables, components or auto layout.
`data-figma-node="❖ …"` is a human label shown in Figma Specs mode, not an
import directive. An importer infers flow only from computed CSS, so the sheet
ships two controls that do what a page actually can:

- **⇄ Auto Layout** (`?autolayout=1`) outlines every flex/grid container and
  flags absolute, transform and `backdrop-filter` layers. The Setout reference
  has 49 flex rules, 16 grid rules, 50 gaps and only 2 absolute layers — a good
  import surface, with the two absolute layers to fix by hand.
- **⤓ Copy for Figma** walks the live DOM and emits a
  `sunnyside/figma-manifest`: layout tree, colours, type, tokens, inline SVG and
  component names. `scripts/figma-manifest.mjs` does the same in headless
  Chrome; `scripts/figma-replay.mjs` seeds that JSON into a Figma plugin that
  builds HORIZONTAL / VERTICAL / GRID auto layout, variables, bound paint
  styles, text styles, live text, vectors and components in one pass.

```bash
node scripts/figma-handoff.mjs --slug <slug> --root . --with-replay
```

That is the only case here where a plugin was built, and it is **not** a general
HTML-to-Figma converter: a page we generate measures itself and emits a typed
manifest; the plugin replays it. No CSS parsing, no guessing, no heuristic. It
also removes the third-party importer, which is why `--with-replay` is a
separate path rather than the default.

### One command

`scripts/figma-handoff.mjs` runs all three emitters and both smoke tests,
deriving CSS, brand folder, name and essence from the token file:

```bash
node scripts/figma-handoff.mjs --slug <slug> --root . --check
node scripts/figma-handoff.mjs --slug <slug> --root .
```

`--skip-sheet`, `--skip-forge`, `--skip-bind` and `--no-smoke` let one step be
regenerated alone; `--infer-layout` passes through to the binder.

### Why a replay can look empty, and what to check

A sheet that imports as coloured rectangles with blank space is almost always
one of four things, in this order:

1. **Text has no fill.** `applyStyle()` sets `fills` from CSS `background-color`.
   Text ink is CSS `color`, and most labels have a transparent background — so
   the style pass blanks them. Ink must be applied *after* the style pass. The
   summary reports `N texts (N inked)`; if those numbers differ, this regressed.
2. **Text is auto-width.** Without `textAutoResize: HEIGHT` and a measured
   column width, Figma turns long labels into one very wide line.
3. **A frame kept its CSS height.** `min-height` and grid tracks become a tall
   fixed frame with children stacked at the top. Hug the primary axis unless a
   child needs FILL.
4. **The font never loaded.** A missing family falls back to Inter silently.
   `SemiBold` and `Semi Bold` are different strings. The summary names the
   fallback count; `fonts/` next to the plugin holds the installable faces.
5. **A text node spilled out of its row.** A heading measured as one line in the
   browser can wrap to two in Figma — a 1–3% metric difference is enough — while
   the row keeps the browser's one-line height. One-line labels must be
   `WIDTH_AND_HEIGHT`, genuinely wrapped copy `HEIGHT` + the measured column,
   horizontal rows must hug their height, and a `layoutMode: NONE` box must grow
   to its children. `sheet-title-row` was the first casualty of getting this
   wrong; the exported `.fig` showed 37 such overflows.
6. **A badge lost its plate.** A leaf that carries both text and a background is
   a chip. Flattening it to a TEXT node keeps the ink and drops the plate, so it
   has to be a frame with the plate plus a centred text child. The plate must
   then skip auto layout: a 32×32 badge that hugs a 14×18 label is no longer a
   circle.
7. **Browser chrome shipped into the file.** Copy pills are absolutely
   positioned, `opacity: 0` until hover, and still land in the manifest — 41 of
   them per brand. Mark them `data-figma-ignore` in the sheet, and have the
   builder skip that attribute, the copy classes and any zero-opacity element.
8. **A page nobody needs.** The patterns / token-sheet page is a CSS dump; it is
   filtered by default and the UI has an opt-in checkbox.

To check an exported file rather than guess: `openpencil info <file>.fig`, then
`openpencil eval <file>.fig --stdin` with a walk that compares each child's
`y + height` against its parent's `height`. That is how the 37 overflows were
found, and the same walk proves the fix (37 → 0).

### Order of operations in Figma

1. Run the **build** plugin from `figma-forge.mjs` in a new file.
2. Import `<slug>-figma.html` with an HTML-to-Figma importer.
3. Select the imported frames and run **`<Name>` — bind**.

Do not insert Doop between steps 1 and 2 for the Figma deliverable. The skill
writes HTML directly; Doop is a multiplayer canvas and MCP surface, and its
export discards the structure you just built.

## Import & migration, step by step

Local plugins require the **Figma desktop app** (browser Figma cannot import a
local `manifest.json`). A Figma **Design** file must be open — not FigJam,
Slides or Buzz. Install the brand `.ttf` files first; a `.fig` stores family
names, not font data.

**Path B · native replay (one plugin, everything)**

1. `node scripts/figma-handoff.mjs --slug <slug> --root . --with-replay`
2. Figma desktop → open/create the Design file → Figma menu → **Plugins →
   Development → Import plugin from manifest…** →
   `design/figma/<slug>-replay/manifest.json`
3. **Plugins → Development → `<Name>` — replay**. The textarea is pre-filled
   from the seed manifest; click **Build in Figma**.
4. Leave **Replace existing generated pages** checked when re-importing. It
   removes only the `NN · <sheet>` pages about to be recreated, so your own
   pages are never touched. Uncheck it to deliberately append a second set.

Without headless Chrome there is no seed: open the sheet, click
**⤓ Copy for Figma**, paste into the textarea, then build.

**Path A · importer + bind**

1. Import `design/figma/<slug>/manifest.json` (the build plugin) and run it, so
   variables, paint styles and text styles exist *before* anything is bound.
2. Serve the sheet if the capture extension will not read `file://`:
   `python3 -m http.server 8080 --directory public/brand/<slug>` then open
   `http://localhost:8080/<slug>-figma.html?clean=1&grid=1`.
3. Capture with html.to.design / Stitch to Figma → import into the file.
4. Import `design/figma/<slug>-bind/manifest.json`, select the imported frames
   (or nothing for the whole page), run **`<Name>` — bind**.

**Migrating an existing Figma file without re-importing**

Run the build plugin on that file, then select the existing frames and run the
bind plugin. Colours bind by measured RGB and text by font size + family, so
legacy layers are upgraded in place. If those layers are flat, regenerate the
binder with `--infer-layout` to add Figma's heuristic auto layout. For the
reverse direction (Figma → HTML/tokens), Doop's Figma import takes a file link
plus a `figd_` personal access token with `file_content:read`; for tokens only,
the Figma REST variables endpoint is the machine-readable source.

**Verify after import:** variables panel shows `<Name> / Colour` (Light),
`/ Spacing`, `/ Radius`; paint styles `Colour/*` and text styles `Type/*` exist;
frames show the auto-layout badge and reflow when resized; components carry the
`❖` names. A substituted font means the `.ttf` files are not installed.
Figma's 10,000px frame limit is why the sheet offers `?grid=1` (2-column
canvas) and `?sheet=N` (one sheet at a time).

**Troubleshooting:** no *Import plugin from manifest* entry → you are in browser
Figma; use the desktop app and right-click the canvas → Plugins → Development.
`set_currentPage: Cannot call with documentAccess: dynamic-page` → the plugin
was generated before v4.9.3. Regenerate with `figma-handoff.mjs --with-replay`
(or `figma-replay.mjs`); local dev plugins re-read `code.js` on every run, so no
re-import is needed. The generated code must call `await
figma.setCurrentPageAsync(page)` — assigning `figma.currentPage` is read-only
under dynamic-page, and the smoke tests now fail on any such write.
Manifest rejected → delete the `id` line (local plugins do not need a published
ID) or generate one with **New Plugin…**. `Loading n pages for plugin` → our
manifests already set `documentAccess: dynamic-page`. Nothing bound → the build
plugin was not run first, or a colour is not in the token file. Re-running the
replay with Replace unchecked adds a second set of 8 pages — it is a build, not
a sync.

## Canonical handoff v2 (v5.0.0, plugin-only)

The older Path A / Path B choice above is superseded. **The HTML sheet's Plugin
ZIP is the only Figma import**; Doop and html.to.design are preview/reference,
and existing flat imports are upgraded in place.

### The contract

`scripts/lib/canonical.mjs` owns the spec. `buildSystemSpec()` returns:

| Field | Contents |
| --- | --- |
| `colours` | primitives, three 10-step ramps, 23 semantic surfaces, CSS custom properties |
| `type` | token roles + 10 canonical sheet roles (family, size, leading, tracking, weight) |
| `space` / `radius` | token values, or the sheet's own scales when tokens.json has none |
| `effects` / `grid` | three elevation shadows and the 12-column house grid |
| `fonts` / `components` | display / reading / mono; Button, Badge, Input, Modal with variants |
| `sheets` | the canonical 8; only `patterns` is `optional: true` |

`finalizeManifest()` signs the envelope with an 8-char FNV-1a checksum over
`{dsId, version, viewport, sheets, mode, generator, system, tokens, sheetsTree,
nodes}`. `source` is deliberately excluded so a `file://` path cannot change the
signature. `CHECKSUM_JS` is injected verbatim into the page — one algorithm, two
runtimes, no drift.

### Capture

`buildFigmaManifest()` is async. It clones `document.documentElement` into a
`DOMParser` document, strips scripts (including the ~600 KB embedded plugin
bundle), clears body classes, removes `hidden-sheet`, appends a capture
stylesheet, and writes the result into a 1440px iframe parked offscreen. It
awaits `document.fonts.ready` with a 1.5s timeout race, then walks each
`.figma-sheet` with `getComputedStyle` / `getBoundingClientRect` relative to
that sheet's own origin. `MAX_DEPTH = 12`, `MAX_NODES = 4000`.

Result: the same checksum and the same 8 sheet heights at 1440, 2504
(`?grid=1`), 820 (`?clean=1`) and 1920 (`?sheet=3`) px. If DOMParser or the
iframe is unavailable it falls back to the live document and marks
`capture.mode = 'live-window-fallback'`; `figma-manifest.mjs` rejects that
rather than silently shipping a non-canonical seed.

### Replay

`templates/figma-replay-plugin.js` reads `manifest.system` (v1 `tokens` still
works). `buildSystem()` is idempotent: `getLocalVariableCollectionsAsync`,
`getLocalVariablesAsync` and the four `getLocal*StylesAsync` getters are used to
upsert by name. Colours the DOM uses but the token file omits get an
`Auto/#RRGGBB` variable, so binding reaches 100% without inventing a colour.
`textStyleFor()` mints a style from the text node's own metrics when no token
role matches, so `textStyleId` never changes the look.

`data-figma-component` / `data-figma-variant` / `data-figma-description` become
COMPONENT nodes (leaf specimens get a component host). Clones are combined with
`figma.combineAsVariants()` into sets named `Component / <Name>`, and each
variant gets an `INSTANCE` in a `◆ Component Library` frame placed beside the
sheet root. Original specimens stay exactly where the sheet put them.

### Upgrade in place

The UI's **Upgrade existing pages** sends `{type:'upgrade', allPages,
inferLayout}`. The plugin walks flat pages, rebinds SOLID fills to colour
variables and TEXT nodes to text styles, optionally applies
`inferredAutoLayout`, and skips every `NN · …` generated page. A second run
reports zero changes.

### Parity gate

```bash
node scripts/figma-parity.mjs \
  --manifest design/figma/<slug>.manifest.json \
  --plugin design/figma/<slug>-replay/code.js \
  --fig "test ds 3.fig" --out design/figma/<slug>.parity.json
```

Thirteen gates: signature, capture mode, 8 sheets, node count ≤2%, text count
≤2%, sheet geometry ≤2px, exact colours, ≥95% text→styles, ≥90% fills→variables,
≥1 instance per component, 0 duplicate collections, safe re-run, 0 console
errors. Node counts are adjusted for intentional wrappers (chip plates + leaf
component hosts), which is why Vesper reports `953 vs 953 (+76 wrappers)`.
`--fig` uses `openpencil info --json` to report the Doop delta as information,
not a gate: Doop imports invisible chrome and cannot reconstruct a system.

`figma-handoff.mjs --with-replay` runs the gate automatically after the replay
smoke test and writes `<slug>.parity.json`.

### v5.1.0 layer-quality fixes

Measured on `test ds 4.fig` and four canvas screenshots. **Never call `clone()`
on a COMPONENT that is nested in the sheet** — Figma reparented its container
(`surface-box`, `grid-2-cols`, `modal-stage`) to the page root when the clone was
combined into a variant set, leaving pages 06/07 blank. Variant masters are now
rebuilt from `manifestNode` into fresh page-level COMPONENTs; the sheet keeps its
own components and the board shows INSTANCEs of them.

The library is a 1440px vertical auto-layout board placed **above** the sheet
(`y = -(height + 96)`) on every page with components (05/06/07), with a heading
and one labelled section per family. HORIZONTAL frames keep their measured width
(`primaryAxisSizingMode = 'FIXED'`) — only VERTICAL stacks hug — so a modal
footer with `justify: flex-end` stays full width. One-line detection uses
`innerH = box.h − paddingY` against the computed `lineHeight`, plus `whiteSpace:
nowrap`; chip labels are always `WIDTH_AND_HEIGHT`. The HTML declares
`white-space: nowrap` on all one-line labels for importer robustness and names
modal footers `action-group`.

Assets icons (6 cast marks, 8 system icons, 4 spot illustrations) now carry
`data-figma-component` / variant / description and become real components —
7 families, 34 refs, 7 sets, 34 instances per kit.

Four extra parity gates lock this in: action groups within 2px of their measured
width, zero detached sheet frames, one library board above each component page,
and ≤5% of TEXT nodes using `HEIGHT`. Thirteen gates became **17**; all 25
design-system cases and 3 workspace kits pass.

### v5.2.0 — `test ds 5.fig` (sheets detached, library clipped, circles oval)

Three defects measured on a real export:

1. **Pages 05/06/07 were blank again**, and `07 · overlays` existed twice. Any
   `COMPONENT` node created *inside* the sheet tree makes Figma promote its
   container (`surface-box`, `grid-2-cols`, `modal-stage`, `cast-grid-6`,
   `icon-grid-8`, `grid-4-cols`) to the page root. **Never create COMPONENTs in
   a sheet** — build plain FRAMEs there and reserve COMPONENT for library
   masters. A final pass also removes duplicate generated pages by name, because
   `replace` can miss an unloaded page under `dynamic-page`.
2. **The library was clipped to 120px.** `resize(1440,120)` plus
   `primaryAxisSizingMode: AUTO` never grew, while sections measured 196 / 338 /
   441px. The board and sections now use `layoutMode: NONE`, explicit sizes
   computed from the sets and instance rows, and `clipsContent = false`.
   Component sets live at page level (Figma's safest place) and are positioned
   over their section; instances sit inside the section.
3. **Circles were not round.** `border-radius: 9999px` was assigned directly to
   `cornerRadius` (rejected, leaving a mixed value) and auto-layout stretched the
   52×52 logo to 52×30. Radius is clamped to `min(w,h)/2`, and `pinChild()`
   re-asserts `layoutAlign: INHERIT` plus `layoutSizing*: FIXED` and re-resizes
   every appended child to its measured box.

`?clean=1&doop=1` is the importer mode: one 1440px column, no sticky bar, no
2-column grid, no shadows/transforms, 28px slack on one-line labels. The Doop
Helper copies that URL first.

Parity is now **19 gates** — added *no components in sheet* (must be 0) and
*circles stay round* (square, radius = width/2). 30/30 sheets pass.
