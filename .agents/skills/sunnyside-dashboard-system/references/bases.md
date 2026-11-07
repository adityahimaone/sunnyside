# Bases — shadcn/ui and Arc UI

The brand layer is base-agnostic. Tokens, shell, charts and data rules live in
`features/<slug>/` and never import from the base folder. Only `ui/` (shadcn) or
`arc/` (Arc) is swapped, and `base.ts` is the one file that knows which is installed.

```
features/<slug>/
  <slug>-tokens.css      ← brand, base-agnostic
  dashboard/             ← brand, base-agnostic
  ui/   or   arc/        ← the only base-specific folder
  base.ts                ← the seam
```

---

## 1 · shadcn/ui — the default

Use it unless the project already ships Arc. It has no opinions to fight: every
token is yours, every primitive is a file you can edit.

### Setup

```bash
npx shadcn@latest init            # tailwind v4, css variables, new-york
npx shadcn@latest add card table input label textarea select checkbox switch \
  radio-group badge button separator tooltip dropdown-menu sidebar chart
```

`init` writes `components.json` with `aliases.ui = "@/components/ui"`. Keep it.

### What to restyle, in this order

1. **`card.tsx`** — replace `bg-card border shadow-sm` with the panel class. No shadow;
   the hairline and the inset highlight are the depth.
2. **`table.tsx`** — `TableCell` gets `tabular-nums tracking-tight`; `TableHead` becomes a
   10px mono eyebrow; `TableRow` gets the 2% ink hover and `border-border/50`.
3. **`input.tsx` / `textarea.tsx` / `select.tsx`** — the recess recipe: 2% ink fill,
   1px border, 2px inner shadow, focus border 60% + 3px ring at 15%.
4. **`sidebar.tsx`** — translucent (`bg-background/70 backdrop-blur-md`), `border-border/50`,
   and make sure the rail header and the top bar share a height.
5. **`chart.tsx`** — if you keep it, fix the id bug below. If you hand-draw, delete it.

### Two shadcn traps, both real

- **The generated `cn` import.** A CLI version on some machines writes
  `import { cn } from "cn"` instead of `@/lib/utils`. Sweep it:
  `grep -rl 'from "cn"' components | xargs perl -pi -e 's{from "cn"}{from "@/lib/utils"}'`
- **`[data-chart=chart-«r0»]`.** React 19's `useId()` returns guillemets, and shadcn's
  `chart-${id.replace(/:/g,"")}` builds an invalid selector, so `--color-*` never
  applies and every series renders invisible. Strip everything non-selector-safe:
  `id.replace(/[^a-zA-Z0-9_-]/g, "")`.

---

## 2 · Arc UI — the option

Arc is a React component and block library built for AI-assisted frontend work. It
ships a machine-readable registry, an MCP server and its own agent skill. Components
install into `components/arc/` and come with Arc's design tokens.

Docs: <https://uiarc.dev/docs/ai>

### Setup, free tier

`components.json`:

```json
{
  "registries": {
    "@uiarc": "https://uiarc.dev/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @uiarc/button @uiarc/dialog
```

Then import the foundation stylesheet **once**, in the root layout:

```tsx
import '@/components/arc/foundation.css'
```

### Setup, Pro (optional)

Pro items live behind a personal access token. Create one at
`uiarc.dev/account#pro-access`; it is shown once.

```json
{
  "registries": {
    "@uiarc": "https://uiarc.dev/r/{name}.json",
    "@uiarc-pro": {
      "url": "https://uiarc.dev/r/pro/{name}.json",
      "headers": { "Authorization": "Bearer ${ARC_PRO_TOKEN}" }
    }
  }
}
```

```bash
# .env.local — never commit
ARC_PRO_TOKEN=arc_pro_...
```

```bash
npx shadcn@latest add @uiarc-pro/dock
```

The shadcn CLI expands `${ARC_PRO_TOKEN}` from the environment or `.env.local`. Keep
both registry entries: free dependencies come from `@uiarc`, Pro ones from `@uiarc-pro`.

### The MCP server

Remote, read-only, no key to copy — the first connection opens Arc's sign-in.

```bash
claude mcp add --transport http arc https://uiarc.dev/api/mcp
# add --scope project to share through .mcp.json
# Pro: --header "Authorization: Bearer arc_pro_..." with --scope user
```

Five tools. Use them instead of guessing at component names:

| Tool | Ask it | Use it when |
| --- | --- | --- |
| `search_components` | "confirm a destructive action" | you know the job, not the component |
| `list_components` | category, tag, tier, kind | you are choosing the shelf |
| `get_component` | one id | before installing: usage, props, a11y, motion, responsive, perf notes, install command |
| `get_install_command` | several ids | to get one command with setup notes |
| `get_skill` | entry, design, copy, components, composition, motion, accessibility, responsive, checklist, examples | when you need Arc's own rules for a region |

### The Arc agent skill

```bash
npx shadcn@latest add https://uiarc.dev/r/arc-skill.json   # → .claude/skills/arc
```

Or read it directly: <https://uiarc.dev/r/skills/arc/SKILL.md>, with
`INSTRUCTIONS.md` pasted into `AGENTS.md` / `CLAUDE.md` for always-on rules.

### Context files

| File | Size | Use |
| --- | --- | --- |
| `llms-small.txt` | overview + one line per item | small context windows |
| `llms.txt` | index with links | targeted lookups |
| `llms-full.txt` | the whole library | a single load |
| `r/catalog.json` | metadata for every item, no source | choosing without pulling source |
| `r/registry.json` | 142 installable items | scripted discovery |
| `components/<name>/markdown` | one component | the cheapest accurate read |

---

## 3 · Mapping the jobs

You do not need Arc's ids memorised — the MCP server resolves them. This is the shape
of the mapping, and the two places where Arc changes the build.

| Job | shadcn | Arc | Note |
| --- | --- | --- | --- |
| Panel | `card` | search `card` / `panel` | restyle to the brand panel; do not stack Arc's shadow |
| KPI row | `card` × 4 | search `stat` / `kpi` | figures are yours: tabular + tight |
| Data table | `table` | search `data table` | header eyebrow + 2% hover are brand rules |
| Field | `input` + `label` | search `input` / `field` | recess, not pane |
| Select | `select` (radix) | search `select` | native `<select>` is fine for a demo route |
| Dialog / sheet | `dialog`, `sheet` | search `dialog` / `sheet` | one float level only |
| Menu | `dropdown-menu` | search `menu` | float glass, not black |
| Chart | `chart` (recharts) | search `chart` | or hand-draw; see `patterns.md` |
| Shell | `sidebar` | search `sidebar` / `app shell` | the 56px line is a brand rule, not a base one |

When the base cannot express a brand rule — a hand-drawn monotone area chart, a
`stroke-dasharray` donut — write it in `features/<slug>/dashboard/charts/` and note it
in the audit. That is not a failure; it is the seam doing its job.

---

## 4 · Switching bases mid-project

Switching is a folder swap plus one import. It is not a rewrite, and it should never
touch `dashboard/`.

1. Add the other base's folder (`arc/` or `ui/`).
2. Update `base.ts` and the imports in `dashboard/` that point at primitives.
3. Re-apply the five restyles from §1 to the new primitives — a base arrives with its
   own card, its own field, its own table header.
4. Delete the old folder once nothing imports it.
5. Re-run all six gates. The shell and overflow gates exist because a base swap is
   exactly when a rail header loses its 56px.

**Do not** run both bases in one tree "just in case". Two cards is how a system stops
being a system.

---

## 5 · Where Arc and this system disagree

Arc has opinions. Three of them collide with a dashboard brand. Decide once, write the
decision into the audit, and hold it.

| Arc says | This system says | Resolution on an Arc base |
| --- | --- | --- |
| Focus without rings | 3px ring at 15% ink + border to 60% | keep the ring-less focus, require a 2px solid foreground border. The gate is "visible at arm's length", not "has a ring". |
| Concentric radii | one radius (0.75rem) for panels and fields | one radius for panels; concentric only for chips nested inside a panel |
| No eyebrows | a 10px mono eyebrow labels every KPI | KPI labels are data labels, not editorial eyebrows. Keep them. Drop decorative eyebrows above headings. |

Shared and non-negotiable on both bases: sentence case, no em dashes, verbs on buttons,
honest claims, visible focus, and a still frame under `prefers-reduced-motion`.
