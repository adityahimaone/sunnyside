# pen-dev

A companion skill for designing `.pen` files with pen.dev, then handing the
result back to the brand-system method.

## Install

```bash
npx skills add adityahimaone/sunnyside --skill pen-dev --full-depth
```

Requires the pen.dev CLI and an authenticated session:

```bash
pen status
```

## Two paths

| Path | Use | Entry |
| --- | --- | --- |
| **Delegated agent** | Exploration, first board, divergent directions | `pen --out board.pen --prompt "…" --agent claude` |
| **MCP-in-the-loop** | Exact, token-aware edits and exports | `pen interactive --out board.pen --enable-preview` |

The delegated path is fast and cheap for a first canvas. The MCP path is slower
and exact; use it to reconcile the final board with the code tokens.

## The rule

The `.pen` is a design source. The code tokens and the HTML/TSX page are the
product. Do not let pen replace the final wordmark, type or implementation; do
not let it invent a logo.

## What is inside

- `SKILL.md` — auth, both paths, MCP tool loop, brand/design-system workflows,
  exports, guardrails, output contract and cost notes.
- It depends on the pen.dev built-in skills: `pen-schema.md` and `execute.md`.
  Read them through `read_skill()` before the first `execute`.

## Output

```
design/brand/<slug>/
  <slug>-board.pen
  pen-usage.json
  exports/<slug>-board@2x.png
  exports/<slug>-board.png
```

Keep the `.pen` and the exports together. Reconcile the board with
`skills/sunnyside-brand-system/` tokens and run its `audit.mjs` and `qa.mjs`
against the code proof.

## Credits

The workflow follows the pen.dev CLI and MCP tools. The brand method is
[sunnyside-brand-system](../sunnyside-brand-system/SKILL.md).
