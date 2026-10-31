# Immersive surfaces

Seven recipes that make a page feel designed rather than decorated. Every one shipped in a case,
every one is geometry or type (no images), and every one has a fallback. Copy the numbers, not
the colours.

The rule underneath all six: **one idea carried to the edges.** Two effects on one page is a
moodboard.

## 1 · One loud field, full bleed

The system's single colour gets a band that escapes the reading column and reaches both edges.
It is the loudest thing on the page and there is exactly one.

```css
/* the reading column is a grid: rail | content */
.layout { display: grid; grid-template-columns: var(--rail) minmax(0, 1fr); gap: var(--gap); }

/* the band escapes it: left = shell inset + rail + gap, right = shell inset */
.band {
  margin-left: calc(-1 * (var(--inset) + var(--rail) + var(--gap)));
  margin-right: calc(-1 * var(--inset));
}

/* 100vw includes the scrollbar, so the band overshoots by half of it and
   overflow-x: clip trims it — which is the edge it wanted to reach anyway */
:root { --inset: max(20px, calc((100vw - 1240px) / 2)); }

@media (max-width: 1020px) {
  .band { margin-left: calc(-1 * var(--inset)); margin-right: calc(-1 * var(--inset)); }
}
```

A simpler variant when the band is the last thing on the page: put it **outside** the shell as
a sibling of the layout grid. Then it is edge to edge by being a block, and no `vw` maths is
involved. Riso Co. and Huginn both end this way.

## 2 · A clip-path edge

A torn or cut edge is a polygon. No texture file, no SVG filter, no PNG.

```css
.sheet {
  clip-path: polygon(
    0 0, 100% 0, 100% 97%,
    94.44% 100%, 88.89% 97%, 83.33% 100%, 77.78% 97%, 72.22% 100%,
    66.67% 97%, 61.11% 100%, 55.56% 97%, 50% 100%, 44.44% 97%,
    38.89% 100%, 33.33% 97%, 27.78% 100%, 22.22% 97%, 16.67% 100%,
    11.11% 97%, 5.56% 100%, 0 97%
  );
}
```

- **Irregular depths (2.0–4.4%) read as paper.** A constant amplitude reads as a sawtooth
  border — that is the single most common way this recipe fails.
- A clipped element clips its children. A pin that hangs over the top edge must live outside
  the clipped box, positioned against the parent.
- At 18–22 teeth a 1440-wide band gets ~70px teeth. Fewer teeth makes it a zigzag; more makes
  it a fringe.

## 3 · A dither, computed

An ordered 4 × 4 Bayer matrix decides which cells print. It is the same rule at every scale:
the painting, the plate, the hero.

```js
const BAYER = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
const on = (BAYER[y % 4][x % 4] + 0.5) / 16 < coverage   // coverage ramps 0 → 1
```

- **Canvas** when it must be fine (6px cells over a 1440 × 340 band is ~13,000 cells; that is
  not DOM). Derive the grid from `clientWidth / cell` so a phone gets the same 6px screen
  instead of a 1.6px moiré.
- **Markup** when it must survive scripts off: a 22 × 22 grid of `<span>`s is 484 nodes and
  reads as a plate.
- Always give the underlying image a CSS fade as well, so with JS off it thins instead of
  ending on a hard edge.

## 4 · A register ghost

Display type with a second impression, offset by the system's registration.

```css
.display {
  text-shadow: 2.2px -2.2px 0 var(--ghost-ink); /* e.g. rgb(29 99 255 / .55) */
}
```

- Use **alpha** in the ghost colour. A solid second pass at display size reads as a drop
  shadow, not as ink.
- On a loud field the ghost must be the paper, not the accent: `--accent` on its own field is
  invisible.
- Disable it under 640px — at that width the offset is a blur.

## 5 · Field + plate

The loud surface carries the display and the mark; every piece of small type sits on a solid
plate beside or below it. This is how a poster carries a caption.

```tsx
<section class="poster">      {/* the field: one colour, the display, the mark */}
<section class="plate">       {/* paper: lede, actions, stats, meta */}
```

- The field never carries type below 24px. Bone on vermilion measures 4.54:1 — technically AA
  for body text, and it fails the moment the field prints at less than full coverage.
- The plate is where the eyebrow, the buttons and the numbers live. It also gives the eye a
  rest between two loud bands.

## 6 · A surface that is the mark

The page should end in the object the identity is made of, built from the same tokens rather
than a screenshot of it.

- Riso Co. ends in the pushpin-and-tear footer: the sheet rips from the pin, the chrome
  assembles behind it, and the mark's tear is the same polygon at page scale.
- Huginn ends in the Wild Hunt footer: the painting dissolves into the field by the same Bayer
  matrix the hero uses, and the wordmark resolves out of the same cells.
- The hero and the footer should be the same poster, one turned around. If they are two
  different compositions, the page has two identities.

## 7 · A data row that breathes

Every case has a row of numbers under the hero. It is the most common place a page goes
cheap, because a divider with padding on one side only makes the number look printed on the
rule.

```css
.row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--rule); }

.cell {
  padding: 0.9rem 1.1rem 1rem 1.1rem;   /* both sides of the rule, always */
  border-right: 1px solid var(--rule);
}
.cell:first-child { padding-left: 0; }   /* the row still starts on the margin */
.cell:last-child  { padding-right: 0; border-right: 0; }

@media (max-width: 720px) {
  .row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cell:nth-child(2n)     { border-right: 0; padding-right: 0; }
  .cell:nth-child(2n + 1) { padding-left: 0; }   /* the cell that starts a row */
}
```

Three rules that keep it right:

- **Padding both sides of the rule, not just one.** `padding-right: 18px` alone puts the next
  cell's number on the divider.
- **Remove the outer padding, not the inner.** The first cell keeps the row on the margin; the
  last cell ends it at the edge.
- **Re-do it at every breakpoint.** In a two-column layout the cell that starts a row needs its
  left padding removed again — this is the half everyone forgets.

## Motion, briefly

- Two durations are enough: `110–180ms` for a decision, `320–420ms` for an arrival.
- One ease: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animate `transform`, `opacity` and `clip-path`. Never `width`, `height`, `top`, `left`.
- Every animation needs a still frame that is the design, not a frozen one. Under
  `prefers-reduced-motion` the footer should look finished, not paused.

## What makes a page feel cheap

- A shadow that is a black blur instead of an offset in the ink colour.
- A gradient where a flat field would do, or a flat field where the system has a second ink.
- Two accent colours in one viewport.
- A card with a 16px radius on a system whose mark has square corners.
- A divider with padding on one side only, so the number sits on the rule.
- A hover effect that scales the whole card. Lift it 2–3px and move the shadow; scaling blurs
  the type.
- A section that could belong to any other case in the portfolio. If it could, the detach gate
  would have said so.
