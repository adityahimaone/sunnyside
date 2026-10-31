---
name: openpencil-design-canvas
description: Use when a design system has to land on a canvas as an editable .fig — the design-system page, its sections, its marks, its tokens — or when an existing .fig has to be inspected, linted, split or exported. Headless first, with no app and no MCP token; the running-app path is the fallback for edits on a live canvas.
metadata:
  author: adityahimaone
  source: open-pencil/open-pencil skills/open-pencil (MIT) + sunnyside brand pipeline
  version: '3.0'
---

# OpenPencil design canvas

OpenPencil is a canvas app for `.fig` files with a CLI, a headless document mode,
and an MCP server. This skill drives it to put a **design system on a canvas** and
to inspect, lint and export any `.fig`.

Two other tools look similar and are not this one:

```
pen.dev      pen CLI, DSL execute(), needs PEN_CLI_KEY     -> skill: pen-dev
OpenPencil   CLI + app + MCP, .fig native, JSX render()     -> this skill
```

Upstream documentation is vendored, do not re-fetch it:

```
references/openpencil-cli.md      full CLI + MCP + tool reference (upstream, MIT)
references/design-authoring.md    JSX authoring rules for render() (upstream, MIT)
```

When a command name or flag is in doubt, `references/openpencil-cli.md` wins for
syntax; this file wins for what to build and what has burned us.

## Headless first

v3.0 is rebuilt around one finding: **`import` and `eval` need no app.** The old
path — a live window, a token read out of `Library/Application Support`, an RPC
that caps at 20s — carried every failure this skill used to document: the token
rotating on relaunch, `RPC timeout`, a `save_file` that returns success and leaves
a stale file, `Too many active MCP sessions`.

```bash
bun add -g @open-pencil/cli     # provides `openpencil`
openpencil --version            # 0.16.0
```

Over SSH the shell is non-interactive and bun/node are not on PATH:

```bash
export PATH=$HOME/.bun/bin:/opt/homebrew/bin:$PATH
```

Use the app only for what genuinely needs it: editing the canvas a person is
looking at, `export_image` of a live window, and the 122 MCP tools that are not
in the headless runtime.

## Build the canvas from the page

The design system already exists as a page. The canvas should be that page, not a
re-invention of it: same sections, same order, same marks.

```bash
node scripts/canvas.mjs build \
  --html   design-system.html \
  --css    tokens/<slug>.tokens.css \
  --tokens tokens/<slug>.tokens.json \
  --brand  public/brand/<slug> \
  --name   "<Name>" --essence "<one line>" \
  --out    design/<slug>.fig
```

Three passes, one command:

1. **`openpencil import`** — HTML/CSS becomes frames and text. `--css` is not
   optional: without it, `font-family: var(--font-reading)` resolves to nothing
   and every heading lands in the default face. With it, the import reports the
   real families (`Inter, Iowan Old Style, JetBrains Mono`).
2. **`openpencil eval`** — renames the sections to `01 · foundation` … so the
   tree reads as an index, adds a cover page with the palette strip and the mark,
   and imports every brand SVG as vectors.
3. **`canvas.mjs verify`** — runs itself at the end of `build`.

The section names come from the HTML (`<section id="…">`), not from a list in
this skill. A page that grows a section gets it on the canvas.

### What the sections are

The real page, in reading order — not the generic 01–11 board of v2:

```
01 foundation  02 material  03 marks   04 colour  05 type  06 parts
07 motion      08 voice     09 tokens  10 audit   11 surface
```

`references/design-system-to-pen.md` holds the token → frame mapping and the four
token schemas in the wild. Read it when a brand's tokens do not parse.

## Verify

```bash
node scripts/canvas.mjs verify --file design/<slug>.fig --expect 11
```

One JSON object: pages, nodes, fonts, the numbered section list, and the lint
counts. It fails when no frame is named `NN · name` or the count is wrong — a
wall of unnamed frames is a screenshot, not a document.

`lint` exits 1 whenever it finds anything, and **its JSON truncates over a pipe**
(65KB came back as `Unexpected end of JSON input`). Redirect to a file and parse
the file; `canvas.mjs` does this already.

Read the counts, not the total. `pixel-perfect` and `no-default-names` fire
hundreds of times on imported vectors and mean nothing. `color-contrast` with a
`ratio` near 1.0 is the one to look at: it usually means the import dropped a
fill, not that the brand fails.

## Two things headless cannot do

Verified against 0.16.0, and the reason the Figma export lives in
`sunnyside-brand-system`:

```bash
$ openpencil eval d.fig -c 'typeof figma.variables'
"undefined"                      # also createTextStyle, createPaintStyle,
                                 # createEffectStyle, createGridStyle
```

- **No variables, no styles.** The headless runtime creates pages, frames, text,
  components and vectors. Tokens as variables and roles as text styles belong to
  the Figma plugin (`scripts/figma-forge.mjs` in `sunnyside-brand-system`).
- **No font substitution.** Only the bundled families draw. A text node set in
  any other family is correct in the file and **blank in a PNG proof** — the CLI
  prints `Font substitution` and then renders nothing. `canvas.mjs` defaults to
  `--font Inter` for exactly this; pass `--font brand` when the file is going to
  be opened in the desktop app, which has the system fonts.

## The token-only board (no page to import)

`scripts/brand_to_pen.py` builds an eleven-section board straight from a brand
folder when there is no design-system page — a brand kit rather than a product
page. It needs the running app and the MCP token:

```bash
export MCP_TOKEN=$(python3 -c "import json,pathlib;print(json.loads(pathlib.Path.home().joinpath('Library/Application Support/OpenPencil/mcp.json').read_text())['authToken'])")
python3 brand_to_pen.py \
  --brand-dir <brand> --tokens <brand>/<slug>-tokens.json \
  --out ~/openpencil-assets/<slug>/<slug>-brand.fig --export ~/openpencil-assets/<slug>
```

The token rotates on every app relaunch — re-read it each session. Token schemas
drift across brands (v1 `color` dict, v2 `type[]` with per-role sizes, v3
`[{name,value}]` lists, v4 `primitives` + `semantic.light/dark`); `normalize()` is
the only place that knows the shapes. Run the script over **every** brand before
calling it done.

Per-brand overrides live in an optional `openpencil.json` in the brand folder
(`mark_size`, `skip`, `ground`, `ink`, `mono_marks`): `templates/brand-manifest.json`.

### Legibility contract

```
T_TITLE 54 · T_NAME 22 · T_ROW 16 · T_HEX 15 · T_TIER 15 · T_ROLE 14
```

- Nothing below 14px on the sheet. The one exception is the type-scale specimen:
  it must be drawn at the brand's real size even when that is 11px, and lint warns
  `min-text-size` for it. That warning is expected — do not "fix" it by enlarging
  the specimen.
- Text on a filled shape takes `on_fill(fill)` — `ratio(INK, fill)` versus
  `ratio(CREAM, fill)`, winner takes it. A luminance threshold puts cream on
  mid-grey and fails AA.
- **The label must be a child of the filled frame**, not a sibling beside it. A
  sibling text is measured against the section ground, so lint reports
  `Contrast ratio 1.00:1` on a chip that looks perfect. Nesting took clearing from
  35 contrast errors to 1.
- A pair the brand grades "large / graphic only" is sampled at 26px, so it is
  graded against the 3:1 large-text bar — the size states the approved use.

## File format

`.fig` is read **and** written; `.pen` is read-only — the app accepts the
extension on save but does not write that format, so the result is mislabelled. A
`save_file` ack is not evidence of format support.

`save_file` writes an OpenPencil **project bundle** (a zip) whatever the extension:

```
<name>.fig
  canvas.fig      # fig-kiwi magic + Zstd/Kiwi NodeChange[] — the real document
  images/         # blob assets
  meta.json       # {"version":1,"app":"OpenPencil","createdAt":...}
  thumbnail.png   # 1×1 placeholder; Figma wants a Cover page for preview
```

Check `xxd -l 8` (`PK`) then `unzip -l`. Files written by `openpencil import` and
`openpencil eval` are plain `.fig` binaries — `openpencil info` is the proof they
reload.

## Build a page by hand

1. `new_document({path})` for a fresh file, or `activate_document` to switch tabs.
2. `render({jsx})` — JSX subset: `Frame`, `Rectangle`, `Text` with absolute
   `x/y/width/height`. No flexbox; `layout` is silently ignored. Read
   `references/design-authoring.md` before writing JSX by hand.
3. Give **every** section frame an explicit fill. A frameless section exports
   transparent and reads as black.
4. Import real vectors with `import_svg` / `createNodeFromSvg`; never draw a mark
   or wordmark as text.
5. `save_file({path})`, then confirm with `openpencil info`.

Copy comes from the repo's own voice samples (`features/<slug>/*-data.ts`), not
from invention — a page built from the brand name alone reads generic.

## Export

- `export_svg` works headless — use it for proof.
- `openpencil export <file> --page "<name>" -o out.png` works headless for a
  **page**; a whole imported design-system page (950+ nodes) can abort the
  rasterizer. Export the cover, the tokens page or one section, not everything.
- `export_image` needs a live window and fails `No visible nodes to export` once
  the app is backgrounded; it also caps one RPC at ~20s, so step `maxEdge` down.
- Export paths must resolve **under `$HOME`**; `/tmp` returns
  `Path is outside the allowed root` in app mode.
- Convert SVG→PNG off-Mac: `cairosvg` in a venv (`~/.venv-svg`), or crop with PIL
  before `vision_analyze`.

## Traps

Format and CLI detail in `references/openpencil-cli.md`, handshake detail in
`references/mcp-http.md`.

| Trap | Fix |
| --- | --- |
| `figma.variables` / `createTextStyle` is undefined in `eval` | The headless runtime is geometry-only. Variables and styles are the Figma plugin's job |
| Text exports blank, CLI prints `Font substitution` | Only bundled families draw. `--font Inter` to proof the layout, `--font brand` for a file opened in the app |
| `openpencil eval ./new.fig` → `ENOENT` | `eval` opens an existing document; it does not create one. `import` a page (or a 1×1 seed SVG) first |
| `openpencil import` loses the fonts | Pass `--css <tokens.css>`. Without it `var(--font-reading)` resolves to nothing |
| `figma.root.insertChild(0, page)` does not move a page to the front | Page order is append-only headless. Name pages `00 ·`, `01 ·` so order is readable when it is not enforced |
| `lint --json` → `Unexpected end of JSON input` | The JSON truncates over a pipe at ~65KB. Redirect to a file, then parse the file |
| `lint` exits 1 on a clean-looking page | It exits 1 whenever it finds anything. Read `errorCount`, then filter by `ruleId` |
| `Contrast ratio 1.00:1` on a chip that looks right | Label is a sibling of the fill, so lint measures it against the section ground — nest the text inside the filled frame |
| Contrast errors clustered on imported text | The import dropped a fill. Check the HTML; if it passes there, the `.fig` is a structural copy, not a colour proof |
| `ModuleNotFoundError: No module named 'requests'` | Only `/usr/bin/python3` (3.9) has `requests` on the Mac; homebrew 3.14 does not. Pin the interpreter (`PY=/usr/bin/python3`) while keeping homebrew on PATH for `node`/`openpencil` |
| `env: node: No such file or directory` over SSH | Non-interactive PATH: `export PATH=$HOME/.bun/bin:/opt/homebrew/bin:$PATH` |
| `save_file` returns `RPC timeout (20s)` and the `.fig` mtime never moves | The app degrades after a few documents. Reopen OpenPencil per document, re-read the token, and **check mtime** — the script still prints its board summary, so a stale file reads as success |
| Text edits throw `Cannot write to node with unloaded font` | `figma.loadFontAsync` every font first, as in Figma; the built-in text tools do it for you |
| `import_svg` bails `No supported SVG elements found` | Root `<svg>` already has `width`/`height`; strip them, then inject one pair |
| Shapes vanish after import | `fill="var(--x, #hex)"` is dropped — unwrap to the fallback hex first |
| Imported art sits on a white tile | `set_fill` the returned frame to the section ground right after import |
| Mark renders at viewBox size inside a big frame | `node_resize` only moves the box; inject `width`/`height` into the root `<svg>` |
| `find_nodes` returns several nodes | It matches substrings — iterate all matches, do not assume one |
| Node ids stop working | Ids are per-document; resolve with `find_nodes`/`query` every run |
| Saved file will not open elsewhere | `save_file` writes a bundle whatever the extension — check `xxd -l 8` (`PK`) and `unzip -l`, and use `.fig` |
| `to_px("clamp(...)")` returns `None` | A blanket `"(" in value` guard for `cubic-bezier` also eats `clamp()`; test clamp first |
| A proof SVG survives from an earlier run | `--export` must delete `{slug}-NN.svg` before writing, or a skipped export leaves a stale frame that reads as current |
| App stops answering (`RPC timeout`, `KeyError: 'children'`) | Too many tabs or one dead session: quit and reopen OpenPencil, re-read the token, rerun — the document on disk is safe |
| `Too many active MCP sessions` | A script died before `DELETE`; relaunch the app and re-read the token |

## Files

```
scripts/canvas.mjs                  headless CLI: build | verify | split | export
scripts/openpencil.py               HTTP MCP client (handshake, SSE, verify, export)
scripts/brand_to_pen.py             brand folder + tokens -> 11-section brand board (app mode)
references/openpencil-cli.md        upstream CLI/MCP/tool reference (MIT, verbatim)
references/design-authoring.md      upstream JSX authoring rules (MIT, verbatim)
references/mcp-http.md              handshake, tool contract, SVG quirks, critique loop
references/design-system-to-pen.md  token layer -> frame mapping, manifest schema
references/upstream-LICENSE.txt     MIT notice for the vendored upstream files
templates/brand-manifest.json       optional per-brand overrides
```

## Related

- `sunnyside-brand-system` owns what a brand kit is, where its files live, and the
  Figma export (`figma-forge.mjs` writes the plugin that carries variables and
  styles this runtime cannot).
- `pen-dev` owns pen.dev; its OpenPencil notes point here instead of duplicating.
