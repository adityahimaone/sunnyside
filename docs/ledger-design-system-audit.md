# Ledger — design-system audit

Case 09 in the library. A commerce dashboard built on shadcn/ui (radix), Tailwind
v4 and one WebGL field.

- Case: `/design-system/ledger`
- Live dashboard: `/design-system/ledger/dashboard`
- Markdown twin: `/design-system/ledger/llms.txt`
- Feature: `features/ledger/`

---

## 1 · What the system claims

| Claim | Where it is enforced |
| --- | --- |
| One surface. Cards are 65% card + 24px blur. | `.glass-panel` in `features/ledger/ledger-tokens.css` |
| One grid. 12 columns, 16px gutters, 1px rules. | `features/ledger/dashboard/dashboard.tsx` |
| One signal colour, state only. | `--signal` / `--signal-ink`, used in three places |
| Figures are tabular and tight. | `.fig`, base `TableCell`, every KPI |
| The shell is one continuous line. | 56px rail header + 56px top bar, both `border-border/50` |

## 2 · Scope, not a second palette

The site's shadcn role tokens (`--background`, `--card`, `--border`…) stay at
`:root`. Ledger re-declares them inside `[data-ledger]`, so the dashboard and the
case page swap the semantic layer for the length of one subtree. Both the case
page and the dashboard render inside that attribute, and nothing outside it
changes. Dark is `.dark [data-ledger]` — the site's `next-themes` class — with
`[data-ledger].dark` as the standalone fallback.

## 3 · Measured

Computed OKLCh → linear sRGB → WCAG against the composited surface (65% card
over canvas), not a nominal white.

| Pair | Light | Dark |
| --- | --- | --- |
| foreground on canvas | 16.05:1 | 17.51:1 |
| foreground on glass | 17.26:1 | 16.40:1 |
| muted on canvas | 4.69:1 | 7.37:1 |
| muted on glass | 5.04:1 | 6.90:1 |
| signal-ink on glass | 6.79:1 | 7.74:1 |

Layout: `documentElement.scrollWidth − clientWidth` = 0 at 1440 / 1024 / 390.
The rail is 255px and the top bar starts at x=256; both headers are 56px.

## 4 · Decisions

**D1 — The field sits behind the glass, never behind the type.** A moving
gradient under body text cannot hold a contrast promise. *Not when* the page is a
hero with no panels. *Breaks next* if the field opacity is raised or the wash
gradient removed.

**D2 — Fields go in, panels come up.** A dashboard is mostly input; if fields
were also frosted, the panel would lose its meaning. *Not when* the field sits on
a solid surface — there the inner shadow is enough.

**D3 — Focus is ink, not blue.** The signal colour belongs to state the data
owns (live, pending). *Not when* a high-contrast mode ships; then focus should be
2px solid foreground.

**D4 — Positive deltas are ink, negative deltas are destructive.** In a
monochrome system growth is the norm and does not need colour; a decline does.
*Not when* the audience expects green/red (trading surfaces).

**D5 — Charts are hand-drawn SVG, not a chart library.** Three series do not
justify 120 KB, and the system's "no grid lines" rule is easier to hold in 200
lines of path maths than in library defaults. The monotone cubic cannot
overshoot below zero. *Breaks next* if a chart needs brushing, zoom or stacking —
then install a library and delete `dashboard/charts/`.

## 5 · Known gaps

1. Contrast against the moving field is not measured; no body text sits on it.
2. No drawn wordmark — the name is set in Geist, only the mark is fixed.
3. The "In context" plate is a static capture of `/design-system/ledger/dashboard`
   and goes stale when the dashboard changes.
4. `cva` is a local 60-line shim (`features/ledger/lib/cva.ts`), not the npm
   package: the four primitives that need it use variants, defaults and compound
   variants only. Install the real package if slots or config composition appear.
5. Mobile tables scroll inside their own container; the document does not.
