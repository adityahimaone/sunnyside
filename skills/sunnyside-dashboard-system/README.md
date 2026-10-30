# sunnyside-dashboard-system

The dashboard branch of the Sunnyside method. Extends `sunnyside-brand-system`
with the parts a data interface needs: a 56px shell line, tabular figures, glass
budgets, hand-drawn charts, a form kit, and six gates.

Written from the Ledger case (Tactile Glass & Crisp Grid), which shipped on
shadcn/ui and then moved into a Next 16 portfolio app.

Two base tracks, one brand layer:

- **shadcn/ui** — default. No opinions to fight; every token is yours.
- **Arc UI** — option. Registry + MCP server + its own design rules; see the
  conflict table in `references/bases.md`.

```bash
node scripts/contrast.mjs --pairs tokens.json          # gate 3
node scripts/layout-gate.mjs --url http://localhost:3000 # gates 1, 2, 6
```

`templates/tokens.css` is the scoped three-layer token block.
`templates/board.html` is the 1500 × 1125 case board.
