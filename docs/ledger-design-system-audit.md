# Ledger — design-system audit

Case 09 in the library. A commerce dashboard built on shadcn/ui (radix), Tailwind
v4 and one WebGL field.

- Case: `/design-system/ledger`
- Live dashboard: `/design-system/ledger/dashboard`
- Markdown twin: `/design-system/ledger/llms.txt`
- Feature: `features/ledger/`
- Material: **Indigo Harbor** (v1.1)

---

## 1 · What the system claims

| Claim | Where it is enforced |
| --- | --- |
| One surface. Cards are 65% card + 24px blur. | `.glass-panel` in `features/ledger/ledger-tokens.css` |
| One grid. 12 columns, 16px gutters, 1px rules. | `features/ledger/dashboard/dashboard.tsx` |
| One signal colour, state only. | `--signal` / `--signal-ink`, harbor indigo `#19398d` |
| Figures are tabular and tight. | `.fig`, base `TableCell`, every KPI |
| The shell is one continuous line. | 56px rail header + 56px top bar, both `border-border/50` |
| The palette is one source. | `scripts/check-palette.mjs` — css, tokens.json, page |

## 2 · Scope, not a second palette

The site's shadcn role tokens (`--background`, `--card`, `--border`…) stay at
`:root`. Ledger re-declares them inside `[data-ledger]`, so the dashboard and the
case page swap the semantic layer for the length of one subtree. Both the case
page and the dashboard render inside that attribute, and nothing outside it
changes. Dark is `.dark [data-ledger]` — the site's `next-themes` class — with
`[data-ledger].dark` as the standalone fallback.

## 3 · The material

Harbor water, not zinc. Every neutral carries chroma toward hue 267 at the
lightness a zinc step would have had: the paper is `#f3f5fb`, the ink `#0a1024`,
the hairline `#dce2f0`. That is why the surface reads cool rather than grey, and
why an indigo signal does not look pasted on.

| Family | Anchor | Job |
| --- | --- | --- |
| `--lg-harbor-*` | 14 steps, `#ffffff` → `#050a14` | every neutral in the interface |
| `--lg-indigo-*` | 7 steps, `#e2e9fb` → `#142e73` | the action, the state, the chart order |
| `--lg-harbor-deep` | `#001b3c` | the mark plate, every float shadow |
| `--lg-teal-500` | `#119b8e` | the donut's remainder slice, nothing else |
| `--lg-crimson-600` | `#9b0033` | destructive, never a delta |

The deep navy is deliberately off the lightness ramp: it is bluer than its
lightness allows, which is what makes the mark plate read as water rather than
as another grey.

## 4 · Measured

Computed OKLCh → linear sRGB → WCAG against the composited surface (65% card
over canvas), not a nominal white.

| Pair | Light | Dark |
| --- | --- | --- |
| foreground on canvas | 17.29:1 | 17.26:1 |
| foreground on glass | 18.30:1 | 16.69:1 |
| muted on canvas | 4.93:1 | 8.71:1 |
| muted on glass | 5.22:1 | 8.42:1 |
| signal ink on its wash | 10.56:1 | 7.01:1 |
| primary on card | 10.44:1 | 5.70:1 |

Layout: `documentElement.scrollWidth − clientWidth` = 0 at 1440 / 1024 / 390.
The rail is 255px and the top bar starts at x=256; both headers are 56px.

**Published failure.** `chart-4` `#b9c8ee` on glass measures **1.93:1**. It is a
fill, not ink: it is only legible as the fourth step of an ordered ramp, never as
a standalone colour, and never behind a number.

## 5 · The bug this version fixed

The ramp rendered as ten empty outlines. The page drew each swatch with
`var(--zinc-050)` while the stylesheet declared `--lg-zinc-050` — a rename that
landed in the CSS and never in the JSX. A missing custom property is not an
error in CSS; it is `background-color: unset`, so ten squares silently became
nothing and looked like a design decision.

Three changes so it cannot happen again:

1. `tokens.json` carries the **hex each primitive renders**, not just the oklch.
2. `features/ledger/palette.ts` is the only way the page reads a colour, and an
   unknown token **throws during render** instead of drawing an empty box.
3. `scripts/check-palette.mjs` proves the CSS declares every primitive once, at
   the same value, that every `var()` resolves, and that every hex round-trips.

The same failure shape reappeared one layer up, and it is worth naming because
the fix looks identical from the outside. The account menu rendered in the
portfolio's cream and gold instead of the harbor palette. Radix portals the menu
to `<body>`, outside `[data-ledger]`, so it inherited the site's own `:root`
tokens. Marking the portalled element with `data-ledger` restores the tokens —
but the surface recipe was written `[data-ledger] .menu-surface`, a *descendant*
selector, and an element is not its own descendant. The tokens resolved; the
recipe did not; the menu drew a transparent box. Both recipes that can be
portalled now also match themselves:

```css
[data-ledger] .menu-surface,
[data-ledger].menu-surface { … }
```

The lesson is the same in both cases: **a style that silently does not apply is
indistinguishable from a style that was never written.** The gate is to assert
the computed value, not the class name — which is why the collapsed rail and the
menu are now verified by reading `getBoundingClientRect()` and `getComputedStyle`
back out of a real browser rather than by looking at the JSX.

## 6 · Decisions

**D1 — The field sits behind the glass, never behind the type.** A moving
gradient under body text cannot hold a contrast promise. *Not when* the page is a
hero with no panels. *Breaks next* if the field opacity is raised or the wash
gradient removed.

**D2 — Fields go in, panels come up.** A dashboard is mostly input; if fields
were also frosted, the panel would lose its meaning. *Not when* the field sits on
a solid surface — there the inner shadow is enough.

**D3 — Focus is ink, not indigo.** The signal colour belongs to state the data
owns (live, pending). Indigo on a focus ring would make every tab stop look like
a status change. *Not when* a high-contrast mode ships; then focus should be 2px
solid foreground.

**D4 — Positive deltas are ink, negative deltas are destructive.** Growth is the
norm and does not need colour; a decline does. *Not when* the audience expects
green/red (trading surfaces).

**D5 — Charts are hand-drawn SVG, not a chart library.** Three series do not
justify 120 KB, and the system's "no grid lines" rule is easier to hold in 200
lines of path maths than in library defaults. The monotone cubic cannot
overshoot below zero. *Breaks next* if a chart needs brushing, zoom or stacking —
then install a library and delete `dashboard/charts/`.

**D6 — The rail stays paper.** `--sidebar` is a harbor neutral, not the deep
navy, even though the reference palette put `#001b3c` there. The rail is
translucent (`bg-background/70` + 24px blur) so the field reads through it; a
solid navy rail would hide the field, give the shell two grounds, and break the
T-junction where the 56px header meets the rail border. The navy still carries
the mark plate and every float shadow. *Not when* the shell ships a variant with
an opaque rail — then the rail needs its own `--sidebar-foreground` pass across
six components before it can go dark.

**D7 — Indigo fills one shape per region.** The rail's *Add product* and the
page's *Export*; there is no third. Everywhere else indigo is a wash, an ink or
a 1px stroke. A filled secondary button, a filled badge and a filled tab would
turn the action into decoration. *Breaks next* if a feature needs two
equally-weighted actions in one region.

**D8 — The teal is a remainder, not a category.** `--chart-5` is the only place a
second hue appears, and it is reserved for the "Others" slice, because a
remainder is not a category and should not compete for the same hue as one.
*Not when* a chart needs five real categories — then the ramp goes back to five
indigo steps and the teal leaves the palette.

**D9 — The collapsed rail is an icon column, not a narrow sidebar.** At 48px
every row is a 32px target on one centre line, the logo plate is 28px, and every
label is removed from the tree rather than faded to zero opacity — a
`opacity-0` box still reserves its 100px, which is what pushed the changelog card
out of the rail. The search button is wrapped in a `div` because `Button` already
sets `inline-flex` and `twMerge` drops a `hidden` passed alongside it; fighting
the merge loses, wrapping wins. Leaf items carry a tooltip because an icon-only
rail without one is a memory test. *Not when* the rail gains a flyout submenu —
then the collapsible parents need one too, and they cannot take the `tooltip`
prop as-is (see gap 8).

**D10 — A menu is a card, not a float.** The float is glass because it sits over
a panel; a menu is a list someone reads, so it gets the popover colour, one
hairline, a 12px radius and a harbor-tinted shadow. Hierarchy is carried by
grouping, not by rules: identity, then *how do I work faster*, then *what am I
paying for*, with a separator only where the question changes. *Not when* a menu
holds one group — then it is a list, and the identity block is the whole header.

## 7 · Known gaps

1. Contrast against the moving field is not measured; no body text sits on it.
2. No drawn wordmark — the name is set in Geist, only the mark is fixed.
3. The hero plate is a static capture of `/design-system/ledger/dashboard` and
   goes stale when the dashboard changes. It is **re-shot for Indigo Harbor** at
   1440×1701, 2× DPR, in both themes; re-run `pnpm shot:ledger` after any
   dashboard change, before touching the page.
4. `cva` is a local 60-line shim (`features/ledger/lib/cva.ts`), not the npm
   package: the four primitives that need it use variants, defaults and compound
   variants only. Install the real package if slots or config composition appear.
5. Mobile tables scroll inside their own container; the document does not.
6. The Figma export under `design/figma/` has not been regenerated for the new
   palette; the tokens are the source, so it must be re-emitted, never patched.
7. ~~The brand board was drawn from the zinc ramp.~~ **Resolved.** The board is
   now generated — `pnpm brandkit:ledger` reads every colour out of
   `features/ledger/tokens.json` and renders inside the running app so it
   inherits the real Geist faces. It cannot drift, because it has no colours of
   its own. Re-run it after any token change; it writes both the Open Graph image
   and the library card cover.
8. Collapsible nav parents (Orders, Products, Billing) have no tooltip in the
   collapsed rail. `SidebarMenuButton` implements `tooltip` by wrapping itself in
   a Radix `Tooltip`, and the parent is already inside a `CollapsibleTrigger`
   `asChild` — a `Slot` cannot merge props onto a provider. Fixing it means
   inverting the nesting in `nav-group.tsx`; until then those three rows are the
   only unlabelled targets in the rail.

## 8 · Re-shooting the plate and the board

Both artefacts are captures, so both have a command. Neither is hand-drawn.

```bash
NODE_OPTIONS="" ./node_modules/.bin/next build
NODE_OPTIONS="" ./node_modules/.bin/next start -p 3100

pnpm shot:ledger       # public/ledger/dashboard-{light,dark}.png
pnpm brandkit:ledger   # public/brand/ledger/ledger-brandkit.png
pnpm check:palette     # the gate: 26 primitives, 12 references, both scopes
```

`brandkit:ledger` needs the server running: it opens the case page, waits for
`document.fonts.status === "loaded"`, then replaces the document body with the
board so the board renders in the app's own Geist faces. It reads every colour
from `tokens.json`; there is nothing to hand-tune.
