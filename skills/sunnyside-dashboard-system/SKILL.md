---
name: sunnyside-dashboard-system
description: 'Build the brand kit and design system for a dashboard — one surface, one 56px shell line, tabular figures, hand-drawn charts, a form kit and an audit that names what it could not verify. v1.0 is written from the Ledger case (Tactile Glass & Crisp Grid): a fast path you can run in one sitting, six gates that each caught something real, and two base tracks — shadcn/ui by default, Arc UI when the project asks for it. Use when starting, refactoring or auditing a dashboard identity, its tokens, its shell, or its proof page.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '1.0'
  extends: sunnyside-brand-system
---

# Sunnyside dashboard system

**One surface → one shell → one set of figures → one proof → one audit.**

This is the dashboard branch of the Sunnyside method. The parent skill draws a mark
and a printed page; a dashboard is a different animal: it is mostly numbers, it is
used at 9am under fluorescent light, and its brand lives in the *surface* rather
than the poster. Ledger is the case this file was written from.

Read this page and you can ship a dashboard case. Three references hold the setup,
the patterns and the gates. Nothing here is here because it sounded good.

## 1 · The fast path

Twelve steps. A case takes one sitting.

```bash
# 0 · where does it sit?
node scripts/layout-gate.mjs --url http://localhost:3000 --widths 1440,1024,390   # before you touch it
```

1. **Brief in five lines.** Name, category, audience, the number it is judged on, the
   default it refuses. If the brief needs a comma splice, it is not ready.
2. **Pick the base.** `shadcn` (default) or `arc` (see §2). Write the choice down; the
   seam is one folder, and switching later must not touch the brand layer.
3. **Write the tokens first.** Three layers, scoped to `[data-<slug>]`, never `:root`.
   `--radius: 0.75rem`, one signal colour, a 5-step monochrome chart ramp.
4. **Build the shell.** Rail + top bar at the same height, one hairline, one T-junction.
5. **Build the figure row.** Four KPIs, tabular numerals, a delta that means something.
6. **Build one chart.** Hand-drawn. No grid lines. One hover dot.
7. **Build the table.** Mono eyebrow header, 1px rows at 50%, 2% ink hover.
8. **Build the form kit.** Fields are recesses, not panes. Six states, no exceptions.
9. **Give every panel four states.** Default, loading, empty, error — an empty panel is
   a design decision, not a bug report.
10. **Build the proof page.** Tokens, surfaces, form kit, data rules, audit.
11. **Render the board.** 1500 × 1125, the mark at three sizes, the ramp, the glass
    recipe, one live crop. It is the thumbnail.
12. **Run the gates.** Six commands. Fix only what fails. Publish the failure.

## 2 · Two base tracks

The brand layer never imports from the base layer. Tokens, shell, data rules and
charts live in `features/<slug>/`; only the primitives folder changes.

| | **shadcn/ui** — default | **Arc UI** — when asked |
| --- | --- | --- |
| Install | `npx shadcn@latest init`, then `add card table input …` | add the registry, then `add @uiarc/card @uiarc/table …` |
| Lands in | `components/ui/` | `components/arc/` |
| Extra step | none | import `@/components/arc/foundation.css` once in the root layout |
| Agent context | read the component source | MCP server + `llms.txt`; `get_component` returns props, a11y, motion notes |
| Design opinions | none — you own every token | Arc ships its own rules; see the conflict table in `references/bases.md` |
| When | you are building the identity | the project already uses Arc, or wants its blocks |

```bash
# Arc, free tier
# components.json → "registries": { "@uiarc": "https://uiarc.dev/r/{name}.json" }
npx shadcn@latest add @uiarc/button @uiarc/dialog

# Arc Pro (optional) — token from the account page, never committed
# "@uiarc-pro": { "url": "https://uiarc.dev/r/pro/{name}.json",
#                 "headers": { "Authorization": "Bearer ${ARC_PRO_TOKEN}" } }
npx shadcn@latest add @uiarc-pro/dock

# MCP, so the agent can search the catalog instead of guessing
claude mcp add --transport http arc https://uiarc.dev/api/mcp

# Arc's own agent skill — sits beside this one, not instead of it
npx shadcn@latest add https://uiarc.dev/r/arc-skill.json    # → .claude/skills/arc
```

Arc's skill teaches the agent *when to reach for Arc and how to install it*; this skill
teaches it *what the dashboard brand is*. Install both when the base is Arc, and read
`references/bases.md` before the first install — it has the Pro registry, the token
handling and the tool list.

**The seam.** One file maps the jobs to the base:

```ts
// features/<slug>/base.ts — the only file that knows which base is installed
export const base = 'shadcn' as 'shadcn' | 'arc'
export const ui = {
  card: 'shadcn', table: 'shadcn', chart: 'hand-drawn', field: 'shadcn',
} as const
```

If a component cannot be expressed in the chosen base, write it in the feature
folder and say so in the audit. Do not bend the base into the brand.

## 3 · What a dashboard system actually is

Seven rules. Each one is here because it broke something.

1. **One shell line.** Rail header and top bar are the same height (56) with the same
   1px border, so their borders meet at a T. Two floating edges is the default failure.
2. **The surface is the decoration.** One frosted panel at 65% card, 24px blur, a 1px
   hairline and an inset top highlight. One float level for popovers. Three levels is mud.
3. **Figures are typography.** `font-variant-numeric: tabular-nums` and `letter-spacing:
   -0.01em` on every number, money right-aligned on the decimal. A dashboard without
   tabular figures looks broken in a column, because it is.
4. **Charts carry no grid.** Four y-ticks, 10px mono axis ink, a monotone line that
   cannot dip below zero, one hover dot and one crosshair. A grid behind a gradient is noise.
5. **Fields go in, panels come up.** A field is a recess: 2% ink fill, 1px border, 2px
   inner shadow. If fields are also frosted, the panel loses its meaning.
6. **The field sits behind glass, never behind type.** A moving gradient under body text
   cannot hold a contrast promise. No exceptions, including "it's only 8% opacity".
7. **Every panel has four states.** Default, loading, empty, error. Ship the skeleton in
   the same commit as the data.

## 4 · The six gates

Each one failed a real case. Run them; do not reason about them.

| Gate | Pass | Why it exists |
| --- | --- | --- |
| **Shell** | rail 255px, header 56px, borders meet at x=256 | the first screenshot of Ledger showed a floating rail beside a full-bleed bar |
| **Overflow** | `scrollWidth − clientWidth` = 0 at 1440 / 1024 / 768 / 390 | a header with `-mx-4` inside an unpadded shell added 24px at every width |
| **Contrast** | fg ≥ 12:1, muted ≥ 4.5:1, signal ink ≥ 4.5:1 — on the *composited* panel | muted ink measured 4.31:1 on canvas and passed a naive check |
| **Figures** | every number tabular, money right-aligned, no ragged column | the table looked "almost right" for two revisions |
| **Focus** | visible without hover, ≥ 3:1 against the adjacent surface | a 10% ink ring was invisible on glass |
| **Motion** | one still frame under `prefers-reduced-motion`, no RAF loop | the WebGL field kept drawing behind `reduce` |

```bash
node scripts/contrast.mjs --pairs tokens.json          # gate 3
node scripts/layout-gate.mjs --url http://localhost:3000 # gates 1, 2, 6
```

Thresholds, the audit table and the QA checklist: `references/gates.md`.

## 5 · Recipes

Each is a few lines of CSS, no images, and has a fallback.

**The panel.**
```css
[data-<slug>] .glass-panel {
  background-color: color-mix(in oklab, var(--card) 65%, transparent);
  backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid rgb(0 0 0 / 0.06);          /* dark: white / 0.08 */
  box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15);
}
```

**The shell line.** Rail header and top bar both `h-14 border-b border-border/50`;
the rail carries `border-r` in the same token. The junction is the design.

**The KPI.** Mono eyebrow at 10px / 0.14em, the figure at 26px tabular, the delta at
12px with the sign in the arrow, not the colour — ink for up, destructive for down.

**The hover.** A 2% ink veil via `::after`, never a background swap. Swapping the
background removes the glass and the panel jumps a tone.

**The chart.** Monotone cubic (Fritsch–Carlson), real pixel widths via
`ResizeObserver`, `niceCeil` on a 1/1.5/2/2.5/3/4/5/6/8/10 ladder. A 1/2/5 ladder put
a 4.8% series on a 0–10% axis and flattened it into the baseline.

**The donut.** One `<circle>` per slice, `stroke-dasharray` + `stroke-dashoffset`, a 2px
gap. No arc maths, no library.

Code for all of these, with the numbers: `references/patterns.md`.

## 6 · The two bases, one brand

When the base is Arc, three of its rules fight this system. Decide once, write it down:

| Arc says | This system says | Resolution on an Arc base |
| --- | --- | --- |
| focus without rings | 3px ring at 15% ink + border to 60% | keep the ring-less focus, but require a 2px solid foreground border; the gate is "visible at arm's length", not "has a ring" |
| concentric radii | one radius for cards and fields | one radius for panels; concentric only for chips nested inside them |
| no eyebrows | a mono eyebrow labels every KPI | KPI labels are data labels, not editorial eyebrows; keep them, drop decorative eyebrows above headings |

Everything else — sentence case, no em dashes, verbs on buttons, honest claims — is
shared, and the parent skill's copy rules apply unchanged.

## 7 · Output contract

```
features/<slug>/
  <slug>-tokens.css        three layers, scoped to [data-<slug>]
  tokens.json              the same values, machine-readable
  data.ts                  name, tagline, status, role, material, tags
  ui/  |  arc/             the primitives, restyled (the only base-specific folder)
  dashboard/               shell, KPIs, charts, table, form kit
  case/                    the proof page
  visual/                  any shader, dither or canvas
app/design-system/<slug>/  page.tsx, llms.txt/route.ts, icon.svg
public/brand/<slug>/       brandkit.png (1500 × 1125), mark, reverse, favicon
public/<slug>/             dashboard-light.png, dashboard-dark.png
docs/<slug>-design-system-audit.md
```

Register the case once in the site's case list; the library grid, the landing
gallery and the counts should all read from it. If they do not, fix the data layer
before adding the case.

## 8 · Failure modes

- **Two shells.** A floating rail and a full-bleed bar. Measured, not eyeballed.
- **A glass panel on a glass panel on a glass panel.** Three levels; nothing reads.
- **A chart library's defaults.** Grid lines, 6px axis text, a tooltip with a black box.
- **Numbers set in a display face.** Beautiful in a mockup, ragged in a column.
- **A KPI with no comparison.** A number without a baseline is a decoration.
- **A field that is also a pane.** The panel stops meaning anything.
- **An empty state nobody designed.** A blank rectangle reads as a bug.
- **A shader behind the type.** It will pass review and fail a contrast audit.
- **A case added to the page but not to the data.** The count says eight when there are nine.
- **"Looks good" with no measured number or file path.**

## 9 · References

Read only what the task needs. Three files, not twenty.

| File | Read when | Holds |
| --- | --- | --- |
| `references/bases.md` | before installing anything | shadcn and Arc setup end to end, MCP tools, registry entries, the component mapping, the conflict table |
| `references/patterns.md` | you are building the shell, a KPI, a chart, a table or a field | the code, the numbers, the four states |
| `references/gates.md` | before shipping, and when a gate fails | thresholds, the audit template, the QA checklist |

Scripts: `contrast.mjs` (OKLCh → WCAG on composited surfaces), `layout-gate.mjs`
(overflow, shell geometry, screenshots via playwright-core).
Templates: `tokens.css` (the scoped three layers), `board.html` (the 1500 × 1125 board).

## 10 · How to use this well

1. **Run the layout gate before you change anything.** A baseline turns "it feels off"
   into a number.
2. **Write the base decision down.** The next agent will otherwise install the other one.
3. **Build the proof page and the board in the same pass.** They drift apart in a week.
4. **Publish one failing pair.** A system that only lists its passes is a moodboard.
5. **Stop at the acceptance test.** More sections are not more complete.
