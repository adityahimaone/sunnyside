# Gates

Six checks. Each one failed a shipped case, so each one is a command, not an opinion.
Run them in this order; stop fixing when the gate passes.

```bash
node scripts/layout-gate.mjs --url http://localhost:3000 --widths 1440,1024,768,390
node scripts/contrast.mjs --pairs tokens.json --composite 65
```

---

## Gate 1 · Shell

**Pass:** the rail header and the top bar are the same height, their borders meet, and
the rail's width is an exact pixel value the header starts after.

| Measure | Expected | Ledger |
| --- | --- | --- |
| rail width | any, but integer | 255px |
| header x | rail + 1 (the hairline) | 256px |
| rail header height | top bar height | 56px |
| top bar height | same | 56px |
| both border tokens | identical | `--border` at 50% |

**Failed when:** the sidebar used `variant="floating"` (8px inset, rounded) beside a
full-bleed header — two objects, one seam, 8px of nothing between them.

```js
const rail = document.querySelector('[data-slot="sidebar-inner"]').getBoundingClientRect()
const bar  = document.querySelector('header').getBoundingClientRect()
console.log({ railW: rail.width, barX: bar.x, railH: rail.height, barH: bar.height })
```

---

## Gate 2 · Overflow

**Pass:** `documentElement.scrollWidth − clientWidth === 0` at 1440, 1024, 768, 390.

**Failed when:** a sticky header carried `-mx-4 md:-mx-6` inside an inset with no padding.
It added exactly 24px at every width — the same number, which is why it read as
"the page is a bit wide" instead of a bug.

The gate also lists offenders, so a table that scrolls inside its own container is not
mistaken for page overflow:

```js
[...document.querySelectorAll('*')]
  .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
```

---

## Gate 3 · Contrast, on the composited surface

A panel is not white. It is `65% card` over the canvas, and the canvas may carry a
field. Measure the composite:

```
panel = mix(card, background, 0.65)      // in linear or oklab
ratio = WCAG(ink, panel)
```

| Pair | Floor | Ledger light | Ledger dark |
| --- | --- | --- | --- |
| foreground on canvas | 12:1 | 16.05:1 | 17.51:1 |
| foreground on panel | 12:1 | 17.26:1 | 16.40:1 |
| muted on canvas | 4.5:1 | 4.69:1 | 7.37:1 |
| muted on panel | 4.5:1 | 5.04:1 | 6.90:1 |
| signal ink on panel | 4.5:1 | 6.79:1 | 7.74:1 |
| axis ink on panel | 4.5:1 | 5.04:1 | 6.90:1 |

**Failed when:** muted ink measured 4.31:1 on the canvas — a pass on the panel and a fail
on the page, because the page description sits on the canvas, not on a card. The fix was
one primitive: `--zinc-500` from L 0.552 to 0.532.

**Publish the pair that fails.** A system that only lists its passes is a moodboard. In
Ledger the published gap is the moving field: contrast against the shader is *not*
measured, which is exactly why no body text sits on it.

---

## Gate 4 · Figures

**Pass:** every number is tabular, money is right-aligned, and two adjacent rows of the
same column have their decimal points on the same pixel.

```js
// every cell that renders money
getComputedStyle(cell).fontVariantNumeric === 'tabular-nums'
```

Also check: the KPI has a comparison, the delta sign is in the arrow (not only the
colour), and no number is set in a display face.

---

## Gate 5 · Focus

**Pass:** focus is visible without hover, on both themes, at 3:1 against the adjacent
surface, and it does not move the layout.

| Base | The move |
| --- | --- |
| shadcn | `border-foreground/60` + `ring-[3px] ring-foreground/15` |
| Arc | Arc's ring-less focus, plus a 2px solid foreground border |

**Failed when:** a 10% ink ring on a near-white panel measured ~1.2:1. It was in the
build for a day and passed a visual review because the reviewer knew where to look.

Tab through the proof page and the dashboard once. Not the happy path — the whole form.

---

## Gate 6 · Motion

**Pass:** under `prefers-reduced-motion: reduce` the page is the design, not a frozen
frame; no `requestAnimationFrame` loop keeps running; the tab-hidden pause works.

```js
// the shader must draw once and stop
if (matchMedia('(prefers-reduced-motion: reduce)').matches) draw(0)  // no RAF
document.addEventListener('visibilitychange', …)                     // pause when hidden
```

CSS transitions collapse to `0.01ms` in the same stylesheet that declares them:

```css
@media (prefers-reduced-motion: reduce) {
  [data-<slug>] *, [data-<slug>] *::before, [data-<slug>] *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## The audit table

Put this in `docs/<slug>-design-system-audit.md` and on the proof page. Real numbers,
or the row does not exist.

| Claim | How | Result |
| --- | --- | --- |
| No horizontal overflow | scrollWidth − clientWidth at 1440/1024/768/390 | 0 / 0 / 0 / 0 |
| Rail meets top bar | both 56px, borders meet at x=256 | pass |
| Body ink on canvas | oklch → sRGB → WCAG, light / dark | 16.05 / 17.51 |
| Muted ink on canvas | same | 4.69 / 7.37 |
| Muted ink on glass | composited 65% panel | 5.04 / 6.90 |
| Signal ink on glass | pending badge | 6.79 / 7.74 |
| Figures | tabular + right-aligned, spot-check 3 columns | pass |
| Focus visible | tab through the form, both themes | pass |
| Reduced motion | still frame, loop skipped | pass |

Then, in the same document:

```
## Not verified
Contrast against the moving field is not measured; no body text sits on it.

## Known gaps
No drawn wordmark — the name is set in Geist, only the mark is fixed.
The preview plate is a static capture and goes stale when the dashboard changes.
Mobile tables scroll inside their own container; the document does not.
```

---

## QA checklist

Before you call it done:

- [ ] Every panel has default, loading, empty and error.
- [ ] Every KPI has a baseline and a signed delta.
- [ ] Every chart has one hover state and no grid.
- [ ] Every field has six states and a visible focus.
- [ ] The rail and the bar are one line at 1440 and 390.
- [ ] Nothing scrolls horizontally that should not.
- [ ] Light and dark were both screenshotted, not just built.
- [ ] The board exists and is 1500 × 1125.
- [ ] The case is in the site's case list, and the counts read from it.
- [ ] The audit names what could not be verified.
