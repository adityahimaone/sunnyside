---
name: openpencil-design-canvas
description: Use when building or inspecting OpenPencil .fig boards — brand design systems, JSX render, lint, export.
metadata:
  author: adityahimaone
  source: open-pencil/open-pencil skills/open-pencil (MIT) + sunnyside brand pipeline
  version: '2.0'
---

# OpenPencil design canvas

OpenPencil is a canvas app for `.fig` files with a CLI, a headless document mode,
and an MCP server. This skill drives it to build **brand design-system boards** and
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

## Install and path

```bash
bun add -g @open-pencil/cli          # provides `openpencil`
openpencil --version                 # 0.16.0 on the Mac
```

Over SSH the shell is non-interactive, so bun and node are **not on PATH**. Every
remote call needs this first, or you get `env: node: No such file or directory`:

```bash
export PATH=$HOME/.bun/bin:/opt/homebrew/bin:$PATH
```

Two modes, same binary:

```bash
openpencil info design.fig       # headless — works with no app running
openpencil tree                  # app mode — the document open in the editor
```

Prefer headless for reading and verification: no token, no app, no timeouts. App
mode is only for writing to the canvas the user is looking at.

## Build a brand design-system board

`scripts/brand_to_pen.py` reads a sunnyside-style brand folder and emits one frame
per section, in the order a person reads a spec:

```
01 Cover   02 Color   03 Typography   04 Logo   05 Spacing   06 Radius
07 Elevation   08 Motion   09 Components   10 Accessibility   11 Imagery
```

A section with no tokens is skipped, so numbers stay stable ids with gaps
(huginn ships no space/radius/components: `01 02 03 04 08 10 11`).

```bash
export MCP_TOKEN=$(python3 -c "import json,pathlib;print(json.loads(pathlib.Path.home().joinpath('Library/Application Support/OpenPencil/mcp.json').read_text())['authToken'])")
python3 brand_to_pen.py \
  --brand-dir ~/Development/sunnyside/public/brand/clearing \
  --tokens    ~/Development/sunnyside/public/brand/clearing/clearing-tokens.json \
  --out       ~/openpencil-assets/clearing/clearing-brand.fig \
  --export    ~/openpencil-assets/clearing
```

The token rotates on every app relaunch — re-read it each session.

Token schemas drift across brands (v1 `color` dict, v2 `type[]` with per-role
sizes, v3 `[{name,value}]` lists, v4 `primitives` + `semantic.light/dark`).
`normalize()` is the only place that knows the shapes; extend it there. Run the
script over **every** brand before calling it done — the schema you skipped is the
one that raises `AttributeError: 'list' object has no attribute 'get'`.

Per-brand overrides live in an optional `openpencil.json` in the brand folder
(`mark_size`, `skip`, `ground`, `ink`, `mono_marks`). Template:
`templates/brand-manifest.json`.

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
- **The label must be a child of the filled frame**, not a sibling beside it (see
  `panel()`). A sibling text is measured against the section ground, so lint
  reports `Contrast ratio 1.00:1` on a chip that looks perfect. Nesting took
  clearing from 35 contrast errors to 1.
- A pair the brand grades "large / graphic only" is sampled at 26px, so it is
  graded against the 3:1 large-text bar — the size states the approved use.

## Verify before declaring done

The CLI audits the result; an eyeball is not verification.

```bash
cd ~/openpencil-assets/<slug>
openpencil lint <slug>-brand.fig --json > /tmp/lint.json   # exit 1 when it finds anything
openpencil analyze typography <slug>-brand.fig --group-by size
openpencil analyze colors <slug>-brand.fig --similar --threshold 10
```

`lint --json` is one object: `{messages, errorCount, warningCount, infoCount}`,
each message `{ruleId, severity, message, nodeId, nodePath, suggest, data}` —
`data.ratio` plus `data.foreground/background` are what you grade. Write it to a
file and parse it; piping a large document's JSON into a second process truncates
mid-string and you get `Unterminated string`.

Read the counts, not the total: `pixel-perfect` and `no-default-names` fire
hundreds of times on imported SVG vectors and mean nothing. `color-contrast` with
`ratio > 1` is a real finding in the brand's own tokens.

The board is clean when every remaining error is an `AySample` node — those are
the brand's own pairs graded `Fail`, which the sheet exists to surface. Any error
on a chip, mark or label node is a board bug, not a brand defect:

```bash
/usr/bin/python3 -c "
import json, sys
d = json.load(open('/tmp/lint.json'))
bad = [m for m in d['messages']
       if m['severity'] == 'error' and not m['nodePath'][-1].startswith('Ay')]
print(d['errorCount'], 'errors,', len(bad), 'not brand-pair findings')
sys.exit(1 if bad else 0)"
```

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

Check `xxd -l 8` (`PK`) then `unzip -l`. Keep the bundle as the deliverable;
extract `canvas.fig` only if someone needs the raw binary. Confirm the round trip
once with `open -a OpenPencil <file>` then `openpencil info` — frame names and
heights are the proof it reloaded.

## Build a page by hand

1. `new_document({path})` for a fresh file, or `activate_document` to switch tabs.
2. `render({jsx})` — JSX subset: `Frame`, `Rectangle`, `Text` with absolute
   `x/y/width/height`. No flexbox; `layout` is silently ignored. Read
   `references/design-authoring.md` before writing JSX by hand.
3. Give **every** section frame an explicit fill. A frameless section exports
   transparent and reads as black.
4. Import real vectors with `import_svg`; never draw a mark or wordmark as text.
5. `save_file({path})`, then confirm with `openpencil info` or `get_node`.

Copy comes from the repo's own voice samples (`features/<slug>/*-data.ts`), not
from invention — a page built from the brand name alone reads generic.

## Export

- `export_svg` works headless — use it for proof.
- `export_image` needs a live window and fails `No visible nodes to export` once
  the app is backgrounded; it also caps one RPC at ~20s, so step `maxEdge` down.
- Export paths must resolve **under `$HOME`**; `/tmp` returns
  `Path is outside the allowed root`.
- Convert SVG→PNG off-Mac: `cairosvg` in a venv (`~/.venv-svg`), or crop with PIL
  before `vision_analyze`.

## Traps

Format and CLI detail in `references/openpencil-cli.md`, handshake detail in
`references/mcp-http.md`.

| Trap | Fix |
| --- | --- |
| `ModuleNotFoundError: No module named 'requests'` | Only `/usr/bin/python3` (3.9) has `requests` on the Mac; homebrew 3.14 does not. Pin the interpreter (`PY=/usr/bin/python3`) while keeping homebrew on PATH for `node`/`openpencil` |
| `env: node: No such file or directory` over SSH | Non-interactive PATH: `export PATH=$HOME/.bun/bin:/opt/homebrew/bin:$PATH` |
| `save_file` returns `RPC timeout (20s)` and the `.fig` mtime never moves | The app degrades after a few documents. Reopen OpenPencil per document, re-read the token, and **check mtime** — the script still prints its board summary, so a stale file reads as success |
| `Contrast ratio 1.00:1` on a chip that looks right | Label is a sibling of the fill, so lint measures it against the section ground — nest the text inside the filled frame |
| `lint --json` truncated / `Unterminated string` | Write to a file, then parse; do not pipe a large document's JSON |
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
| Clearspace diagram overlaps the marks grid | Header furniture gets its own band; start the asset grid below it, measured |
| App stops answering (`RPC timeout (20s)`, `KeyError: 'children'`) | Too many tabs or one dead session: quit and reopen OpenPencil, re-read the token, rerun — the document on disk is safe |
| `Too many active MCP sessions` | A script died before `DELETE`; relaunch the app and re-read the token |

## Files

```
scripts/openpencil.py               HTTP MCP client (handshake, SSE, verify, export)
scripts/brand_to_pen.py             brand folder + tokens -> 11-section design-system .fig
references/openpencil-cli.md        upstream CLI/MCP/tool reference (MIT, verbatim)
references/design-authoring.md      upstream JSX authoring rules (MIT, verbatim)
references/mcp-http.md              handshake, tool contract, SVG quirks, critique loop
references/design-system-to-pen.md  token layer -> frame mapping, manifest schema
references/upstream-LICENSE.txt     MIT notice for the vendored upstream files
templates/brand-manifest.json       optional per-brand overrides
```

## Related

- `sunnyside-brand-system` owns what a brand kit is and where its files live.
- `pen-dev` owns pen.dev; its OpenPencil notes point here instead of duplicating.
