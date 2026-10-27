---
name: pen-dev
description: Create and edit pen.dev (.pen) design files for brand kits, boards and design-system frames. Use the delegated pen CLI agent for exploration, or the MCP-in-the-loop workflow (pen interactive) for exact, token-aware edits and exports. Use when the user asks for pen.dev, a .pen file, a design canvas, or a board that starts in pen before it becomes HTML/TSX.
metadata:
  author: adityahimaone
  source: https://pen.dev
  version: '1.0'
---

# pen.dev

pen.dev is a design canvas with an MCP tool layer. Two ways to use it:

1. **Delegated pen agent** — the CLI runs an AI agent that edits the `.pen` file.
   Fast for exploration and a first board.
2. **MCP-in-the-loop** — your coding agent drives the canvas through
   `pen interactive` and the MCP tools. Slower, exact, token-aware.

The final product is still HTML/TSX. The `.pen` file is a design source, not the
implementation.

## Before you start

```bash
pen status                 # auth, email, workspace
pen --list-workspaces      # optional
pen version
```

- Auth is session-based or `PEN_CLI_KEY` for CI.
- Set the workspace if the default is wrong: `pen --workspace <slug>`.
- Read the built-in pen skill before any MCP edit:
  - `read_skill()`
  - `read_skill({ path: "pen-schema.md" })`
  - `read_skill({ path: "execute.md" })`

Do not guess the `.pen` schema. The skill is the schema.

## Choose the path

| Situation | Use | Why |
| --- | --- | --- |
| Fresh board, moodboard, divergent directions | Delegated agent | One prompt produces a canvas; cheap for exploration |
| Exact tokens, existing frames, final board | MCP-in-the-loop | You can inspect and edit one node at a time |
| Import a live HTML page as editable layers | MCP browser tool | `browser({ action: "import-to-canvas" })` |
| One small correction to a `.pen` | MCP `execute` | No new prompt, no full regeneration |
| The final product page | Neither | Build HTML/TSX from the code tokens |

## Path A: delegated agent

Use the brief as the prompt and attach references/images. Do not paste a novel
into `--prompt`; the attached brief carries the detail.

```bash
pen \
  --out design/brand/<slug>/<slug>-board.pen \
  --prompt "Create a 2400×1800 brand board for <brand>. Follow the attached brief. Three columns, nine panels: cover, index, construction, digital application, colour, type, icons, atmosphere, essence. Use the attached mark and board references. No generated logo, no live-text wordmark." \
  --prompt-file design/brand/<slug>/brief.md \
  --export design/brand/<slug>/exports/<slug>-board@2x.png \
  --export-scale 2 \
  --usage design/brand/<slug>/pen-usage.json \
  --max-failed-calls 3 \
  --agent claude
```

- `--in` edits an existing file; `--out` is required.
- `--prompt-file` attaches images (PNG/JPEG/GIF/WebP) or text; it does not replace the prompt. Import the real SVG mark through the MCP or place a PNG reference; do not rely on live text for the wordmark.
- `--library pencil:shadcn.lib.pen` imports the shadcn component library when the
  board needs UI frames. A brand board usually does not.
- `--export` writes one PNG; `--export-scale 2` for a 3000×2250 web copy.
- `--usage` records cost; keep it next to the file.
- `--max-failed-calls 3` stops a loop early.
- One run is usually enough for exploration. At most two regeneration passes.

Check the export, not just the prompt result. The agent can produce a beautiful
canvas with a misspelled name or a live-text wordmark.

## Path B: MCP-in-the-loop

Start the interactive shell (headless is reproducible; `--app desktop` connects
to a running app):

```bash
pen interactive \
  --out design/brand/<slug>/<slug>-board.pen \
  --enable-preview \
  --preview-output design/brand/<slug>/exports/preview.png
```

Then use the MCP tools:

```js
read_skill()
read_skill({ path: "pen-schema.md" })
read_skill({ path: "execute.md" })
get_app_state()
```

The useful tools:

| Tool | Use |
| --- | --- |
| `get_app_state()` | Read the current document, page and node tree |
| `execute({ input })` | Run the pen DSL: Get, Insert, Set, Export, screenshots |
| `get_style({ name, params })` | Read a style archetype; it does not save variables |
| `browser({ action, ... })` | Load a page, import it to canvas, screenshot, return DOM |
| `save()` | Write the `.pen` file (shell command) |
| `import_library({ path })` | Import `pencil:shadcn.lib.pen` or a local library |
| `list_libraries()` | Check what is imported |

Common DSL patterns (confirm in `execute.md` first):

```js
// list top-level nodes
execute({ input: 'Get((n, c) => { c.skipChildren(); Print(n.id, n.name) })' })

// create a frame and export it in one call
execute({ input: 'frame = Insert(document, { type: "frame", width: 2400, height: 1800, fill: "#0B0D10" }); Export([frame], "png", "./exports")' })

// screenshot one frame into the conversation
execute({ input: 'TakeScreenshot([frame])' })
```

Variables created by `execute` may not persist between calls. If a later call
cannot see a node, read its id with `get_app_state()` or `Get`, then pass the id
inside the same `execute`. Confirm the exact syntax in `execute.md`.

For a live page:

```js
browser({ action: "load-page", url: "http://localhost:3000/design-system" })
browser({ action: "return-screenshot", target: "query", querySelector: "#case" })
browser({ action: "import-to-canvas", target: "query", querySelector: "#case" })
```

Importing a page is useful for a case page or a component frame. The imported
layers are design nodes; do not think in HTML after the import.

## Workflow: brand kit

1. Write `brief.md` and the token values first. Decide the one idea, the one
   loud field and the type voices.
2. Draw the mark and wordmark as SVG. Keep the wordmark as outlines.
3. Create page frames:
   - board: 2400 × 1800;
   - desktop case: 1440 × 900 or 1440 × 1000;
   - phone: 390 × 844;
   - optional 1:1 icon frame.
4. Build the board panels with the real SVG/PNG assets. No live-text wordmark,
   no generated logo.
5. Export the board at 2×; save the `.pen`; keep `pen-usage.json`.
6. Reconcile: confirm the hex values, type sizes, names and logo against the code
   tokens. If they disagree, the code tokens win unless the brief says otherwise.
7. Run the brand-system audit and QA scripts against the HTML/TSX proof.

## Workflow: design system

1. Tokens first (primitive → semantic → component). Put the values in the brief.
2. In pen, build one frame per component group, not one frame per component:
   buttons, fields, select, checkbox/radio, switch, dialog, tabs.
3. Use the shadcn library for the component structure; restyle with the brand
   tokens. Do not invent a new visual language for a select.
4. Build one form frame and one case-page frame. Real copy, real error/disabled
   states.
5. Export the form and the case frame; save the `.pen`.
6. Implement the final components in the host's shadcn/Radix + tokens. The `.pen`
   is the reference, not the runtime.

## Guardrails

- **Never** ask pen to generate the logo, wordmark, type specimen or whole board
  as a bitmap. Import the real vector or place the real PNG.
- **Never** accept live text as the final wordmark. The wordmark is a drawing.
- **Never** let the `.pen` become the source of truth for tokens. The code token
  source is.
- **Never** run ten exploratory prompts. One delegated run + at most two MCP
  correction passes.
- **Never** trust the preview for spelling. Check the brand name at 100%.
- **Never** export a board without checking the panel crop and the 1500px web
  copy.
- **Do** record the prompt, model, usage and date next to the `.pen`.
- **Do** keep the `.pen`, the exports and the brief in the same folder.
- **Do** use `--max-failed-calls` and `--usage` in CI.
- **Do** stop when the board/page is readable and the code proof passes.

## Output contract

```
design/brand/<slug>/
  brief.md
  <slug>-board.pen
  pen-usage.json
  exports/
    <slug>-board@2x.png
    <slug>-board.png          # downscaled web copy
    preview.png
```

For a design system, add `case-page.pen`, `form.pen` or frames inside one file,
plus the exported component/form PNGs. Keep the editable `.pen` and the exports;
do not ship only the PNG.

## Cost and failure notes

- The delegated agent bills per run. Use `--agent claude`/`--model` deliberately;
  start with the default and escalate only if the board is wrong.
- A failed export usually means a wrong node id or a missing frame; call
  `get_app_state()` and `Get` before retrying.
- A blank/partial canvas usually means the prompt had no explicit size, palette
  or panel map; restate them in the prompt.
- The MCP shell is stateful. `save()` after each coherent change, not after every
  node.
- If auth fails, run `pen login`; CI uses `PEN_CLI_KEY`.
