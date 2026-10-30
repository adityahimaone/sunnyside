# OpenPencil desktop — raw HTTP MCP

Driving the OpenPencil macOS app from a remote host (SSH/Tailscale) without the
`pen` CLI. Use when the user says "access the Mac, use the MCP on :7600, open
OpenPencil".

## Discovery and handshake

- Endpoint: `http://127.0.0.1:7600/mcp` (app-local; reach it from the Mac, not
  from the remote host).
- Token: `~/Library/Application Support/OpenPencil/mcp.json`, field `authToken`.
  It **rotates on every app relaunch** — re-read it at the start of each session
  instead of reusing a token from an earlier transcript.
- Required headers on every request:
  `Authorization: Bearer <token>`, `Content-Type: application/json`,
  `Accept: application/json, text/event-stream`.
- Order: `initialize` (`protocolVersion: "2024-11-05"`, `capabilities: {}`,
  `clientInfo`) → capture the `mcp-session-id` **response header** → POST
  `notifications/initialized` → `tools/call`. Responses may come back as SSE;
  parse the `data: ` lines, then `json.loads(result.content[0].text)` — the tool
  payload is a JSON *string* inside `content[0].text`.
- Close with `DELETE` on the endpoint when the script finishes.

## Session leak

A script that dies before `DELETE` leaves a live session. After a few, every
call fails with `{"error":"Too many active MCP sessions"}` (HTTP 503).
Recovery: quit and relaunch the app, then re-read the token.

```bash
osascript -e 'quit app "OpenPencil"'
sleep 3 && open -a OpenPencil && sleep 25
```

Never kill the app with a fuzzy `pkill -f`/`pgrep -f` pattern — the pattern can
match the MCP wrapper or an unrelated process list, and killing the app makes
the server answer `OpenPencil app is not connected`, which loses the canvas.

## Tool contract

| Tool | Args | Notes |
| --- | --- | --- |
| `new_document` | `{name}` | Fresh start; prefer this over patching a frame the user rejected |
| `get_page_tree` | `{}` | Page + node tree; ids look like `1763375033:444` |
| `find_nodes` | `{name}` | Resolve a node id by name. It matches **substrings**, so `find_nodes {name: "Cast"}` returns `Cast`, `CastTitle`, `CastIcon0..4`; and after a re-import it returns both the old and new node, so iterate all of them when recolouring |
| `render` | `{jsx}` or `{jsx, parent_id, x, y}` | Absolute `x/y/width/height`; with `parent_id` it appends one node into an existing frame using parent-relative coords |
| `update_node` | `{id, x, y, width, height}` | Position and size |
| `node_resize` | `{id, width, height}` | Resize a node |
| `set_fill` / `set_stroke` | `{id, color}` | Solid hex only |
| `set_text` / `set_font` / `set_text_properties` | `{id, ...}` | `set_text_properties` carries only alignment / auto-resize / direction / decoration — size lives in `set_font` |
| `set_image_fill` | `{id, image_data, scale_mode}` | `image_data` is **raw base64, no `data:` prefix** |
| `import_svg` | `{svg, name, color, parent_id, x, y}` | Returns a FRAME — read the SVG quirks below before using it |
| `export_svg` | `{ids: [...], path}` | Works headless. **Use this for proof** |
| `export_pdf` | `{ids: [...]}` | Returns inline base64 in the tool result |
| `export_image` | `{ids: [...], format, scale, maxEdge, path}` | `ids` is an array, not `id`; needs a live window render |
| `set_visible` | `{id, value}` | Not `visible` |
| `list_documents` / `activate_document` | `{}` / `{document_id}` | Tabs are `tab-6`; the newly created doc is not always the rendered one |
| `save_file` | `{path}` | May exceed the app's RPC timeout on a tall document |

### `render`

- No `layout` prop — it is silently ignored (`Unsupported prop layout ... is
  ignored` in the warning list). Position children absolutely.
- Compute block height before placing the next element: lines × line-height.
  A 4-line body at `lh=32` from `y=300` ends at 428 and collides with a button
  at `y=404`. Widen the measure to drop a line, then move the next element.
- Multi-line text: put a **real newline** in the JSX attribute. A `\\n` escape is
  printed literally in the canvas.

### Pill buttons

A pill label is only centred when the text node is as wide as the pill and
centre-aligned; otherwise it sits at the left inset and the pill reads empty:

```python
call("update_node", {"id": label, "x": pill_x, "width": pill_w,
                     "y": pill_y + (pill_h - size) // 2 - 2})
call("set_text_properties", {"id": label, "align_horizontal": "CENTER"})
```

## SVG assets

`import_svg` is the only way to get a real vector mark onto the canvas, and it
has six traps that each cost a review cycle:

0. **Duplicate `width`/`height` kills the parse.** Any brand SVG that already
   carries `width="64" height="64"` on the root fails with
   `No supported SVG elements found in the markup` the moment you inject a second
   pair. Strip the root's own attributes, then inject:
   ```python
   def root(m):
       attrs = re.sub(r'\s(?:width|height)="[^"]*"', "", m.group(1))
       return f'<svg width="{size}" height="{size}"{attrs}>'
   svg = re.sub(r"<svg\b([^>]*)>", root, svg, 1)
   ```
0b. **`var(--x, #hex)` fills are dropped.** The renderer supports neither the
   custom property nor its fallback, so every shape using one vanishes and the
   import looks empty. Unwrap to the fallback first:
   ```python
   VAR = re.compile(r"var\([^,()]+,\s*(#[0-9a-fA-F]{3,8})\)")
   svg = VAR.sub(r"\1", svg)
   ```
   Keep the brand's own colours unless the sheet is deliberately mono.

1. **Hardcoded fills win over the `color` arg.** A brand SVG with `fill="#0F4A3C"`
   on every path ignores `color`, so a "reversed" mark stays the light colour and
   vanishes on a light ground. Regex-replace the brand hexes in the markup before
   importing:
   ```python
   HEX = re.compile(r"#(?:0F4A3C|0E211C|F3EDDE|2F7A5E|CBDD82|A9713F)", re.I)
   svg = HEX.sub(target_color, path.read_text())
   ```
2. **The imported frame gets a solid white fill.** On a cream or emerald section
   it reads as a pasted white tile with the mark inside. Always `set_fill` the
   returned frame to the section's ground colour right after import.
3. **`node_resize` does not scale the artwork.** It resizes the frame box; the
   drawing stays at its viewBox size, so a mark asked for at 220px still renders
   at 64px inside a 220px box. Inject the size into the root `<svg>` instead, then
   import:
   ```python
   svg = re.sub(r"<svg\b", f'<svg width="{size}" height="{size}"', svg, count=1)
   ```
4. **Import into the SECTION frame, not into the placeholder.** Passing the
   placeholder rectangle's id as `parent_id` and then deleting the placeholder
   takes the imported child with it — the marks silently disappear. Import with
   `parent_id` = the section frame and section-relative `x`/`y`, then delete the
   placeholder separately.

Wordmarks whose viewBox is flipped or offset (`transform="scale(1,-1)"`, negative
`y` in the viewBox) import far below their origin and push everything else off the
frame. When that happens, render the reading face as a TEXT node at the same size
instead of fighting the outline.

## Writes that silently don't stick

- `update_node` and `set_fill` can answer `{"updated": ["y"]}` while the value is
  unchanged. The usual cause is a reused `jsonrpc` `id` across a loop. Give every
  call a unique id, then **re-read with `get_node` / `node_bounds` and compare**;
  re-issue once on mismatch. Never trust the ack alone — an unchanged coordinate
  shows up later as an overlapping label or a button with no text.
- `set_opacity` on a hairline rect is unreliable. Precompute the tint instead:
  bark at 16% over cream is `#ceccbf`. A deterministic hex beats a stacking effect
  you cannot verify from the export.

## Section frames and export

- Give **every** section frame its own fill. A frame without a fill exports
  transparent, which reads as black in the PNG, so all the dark text "fails
  contrast" and you chase a phantom legibility bug that does not exist.
- Export each section frame on its own (`maxEdge: 1440`) for the critique loop.
  The whole tall frame is unreadable when scaled down and the full-page export at
  `maxEdge >= 2600` hits the 20s RPC cap.
- The app caps a single RPC at ~20s. Step `maxEdge` down until it returns
  `{"written": ...}`.
- **`export_image` needs a live window render.** After a `new_document`, or once
  the app is backgrounded, every node answers
  `{"error": "No visible nodes to export"}` — including nodes that exported
  minutes earlier. `open -a OpenPencil` revives it sometimes, not reliably.
  `export_svg` works headless: use it for proof and convert off-Mac with
  `cairosvg` in a venv (`~/.venv-svg`). `qlmanage`/`sips` do not convert SVG.
- Export paths must resolve **under `$HOME`**. `/tmp` returns
  `Path is outside the allowed root: /Users/<user>`.

### Images

`set_image_fill` rejects payloads over ~4MB. Downscale big photos on the Mac
before reading them:

```bash
sips -Z 1600 in.webp --out /tmp/in-small.jpg
```

## Script transport

`scripts/openpencil.py` (in this skill) already carries the handshake, the
SSE parse, `find/first/get/verify/render/export/save` and the export step-down.
Copy it to the Mac and use it; do not retype the client.

Node ids are per-document and change when the `.pen` is reopened (`0:4` instead
of `1763375033:506`). Always resolve ids with `find_nodes` at the start of a run
rather than reusing ids from an earlier transcript.

Heredocs inside `ssh '...'` mangle quotes and fail with `unexpected EOF while
looking for matching \`'\``. Write the Python file locally with `write_file`,
`scp` it to the Mac, then run it there. Always `export MCP_TOKEN=<fresh token>`
on the command line rather than baking it into the script.

`hermes` is not on the PATH of a non-interactive SSH shell on the Mac. Use the
absolute binary `/Users/<user>/.hermes/hermes-agent/.hermes/bin/hermes`, and
verify model routing with `hermes -z 'say OK' -m cheap` (and `-m main`).

## Critique loop

1. Build/render → `export_image` per section → `scp` the PNGs to the working host.
2. The full page is too tall for the vision endpoint (large images return HTTP
   413). Crop per band with PIL, or convert to JPEG quality ~80, before
   `vision_analyze`.
3. Fix defects with `update_node` / `node_resize` on the named nodes. Do not
   rebuild the document for a spacing or alignment defect — rebuilding is only
   for a rejected resource or a wrong brief.
4. Re-export and re-critique. Two passes is the ceiling for taste; verify each
   write with `get_node` in between so a stale coordinate does not cost a pass.
5. Vision is not ground truth. Before acting on "text is invisible", sample the
   pixels with PIL — the model has called legible dark-on-light text invisible
   more than once, and reported a cropped crop as clipped artwork.
