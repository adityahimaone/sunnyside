# Jakarta — QA

Case 11. What was measured on the build, by which command, and what was not.

Run from the repo root:

```bash
npx tsc --noEmit                     # types
NODE_OPTIONS="" npx next build       # route builds, prerenders
npx next start -p 3011               # the build under test
# then a one-off Playwright pass (not committed):
# 1440 / 768 / 390, night scope, reduced motion, llms.txt
```

The browser pass was Playwright driving the installed Chrome against the
production build on `localhost:3011`, not a dev server.

## Build

| Check | Result |
| --- | --- |
| `next build` | `✓ Compiled successfully`, `/design-system/jakarta` prerendered as static (`○`), 230 KB of HTML |
| `tsc --noEmit` | Clean |
| `eslint` | Clean on the changed files |
| Font | `document.fonts.check('16px "Plus Jakarta Sans"') === true`; self-hosted from `/fonts/plus-jakarta-sans-var.woff2` |
| Console | No page errors or failed requests on the case page |

## Layout

Measured with smooth scrolling disabled. `scrollWidth − clientWidth = 0` at every
width, so the page never scrolls horizontally.

| Width | `scrollWidth` | `clientWidth` | Overflow | Page height | Hero |
| --- | --- | --- | --- | --- | --- |
| 1440 | 1440 | 1440 | **0** | 15 440 px | 880 px |
| 768 | 768 | 768 | **0** | 18 933 px | 760 px |
| 390 | 390 | 390 | **0** | 23 205 px | 726 px |

The applications wall was measured as four figures:

| Width | Row 1 | Row 2 |
| --- | --- | --- |
| 1440 | phone 380 × 801 · card 780 × 801 | panel 380 × 498 · livery 780 × 498 |
| 768 | phone 358 × 773 · card 358 × 773 (true 2 × 2) | panel 358 × 449 · livery 358 × 449 |
| 390 | one column, 350 px wide | stacked |

The three wide tables (semantic roles, type scale, audit) scroll inside
`.tableWrap`; the page itself never does. Section heads reflow to three explicit
rows below 700 px so the meta line stops sitting above the section number.

## Interactions

| Control | Assertion |
| --- | --- |
| Theme toggle | `html[data-jk]` becomes `night`; the token layer swaps the semantic layer only. In the same click the hero's `--jk-hero-night` flips 0 → 1, crossfading Semanggi to the light-trail plate with no JS branch. Card surfaces resolve to `malam-200` (29, 35, 41) |
| Hero field | Ten hard-stop bands; the plates are masked at the reading edge and blended `luminosity`, so the palette supplies hue and the photograph supplies light |
| Hero sign | One tinted plate (0.58 with backdrop blur, 0.72 without), one cream type colour, no accent type. Worst cream-on-band 5,64:1 |
| Palette line | Ten solid segments, edge to edge, no gaps, no separators; the whole line leans 6°. 42px at 1440, 28px at 390 |
| Hero tear | A `clip-path` polygon with irregular 2–4,4% teeth. Paper, not a texture; the teeth are the only edge |
| JakLingko card | Redrawn from scratch: Laut field on the hero diagonal, Senja edge, right-angle route, outlined Jakarta lockup (mark + wordmark as paths). Operator wordmark is 24px cream on Laut at 3,41:1 — large text only |
| Applications wall | Cards lift 3 px and move their shadow on hover; under `prefers-reduced-motion: reduce` the computed hover transform is `none` and transitions collapse (`1e-05s`) |
| Copy buttons | Write `tokens.css` / `tokens.json` to the clipboard; the code stays selectable if the clipboard is blocked (last verified in the previous round, not re-run this round) |
| `llms.txt` | `/design-system/jakarta/llms.txt` returns **200** `text/plain; charset=utf-8` and includes the new hero, applications, seventeen checks and the seventh contrast failure |

## What this does not prove

- **No automated a11y run.** No axe or Lighthouse pass was recorded for this case;
  contrast is computed from the token layer, which is a different claim from “the
  rendered page passes”.
- **No e2e test.** The interactions above were asserted by a Playwright script, not
  committed as a spec like the contact-flow tests.
- **No print proof.** The audit says so: enamel and vinyl are untested, and Senja at
  3,24:1 is a screen measurement.
- **Six district contrast pairs fail by design** and are published on the page. They
  are not regressions to fix; they are the rule the palette depends on. A seventh,
  `text-faint` at 4,09:1, is now also published and removed from small type.
- **No stock-licence record.** The five plates are attributed in the colophon but
  there is no `credits.json` beside them.
- **The sticky header is composited into element screenshots.** A full-element shot of
  `#apps` shows the sticky topbar mid-plate; that is a capture artefact, not a layout
  fault. The viewport measurements above are the evidence.
