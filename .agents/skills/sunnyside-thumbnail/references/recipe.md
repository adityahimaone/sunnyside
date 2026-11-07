# The measured recipe

Every number here was taken off the shipped card at **349 × 218 px** (the
work-gallery tile at a 1440 viewport, captured at 2×), then expressed as a
fraction of the card so it holds at any size. `scripts/make-sleeve.mjs` holds
the same table in its `G` constant — if the two disagree, the script is right
and this file is stale.

Source of truth: `features/landing-page/studio/work-gallery/`
— `work-gallery.tsx` (`GeneratedCover`) and `work-gallery.module.css`.

## Coordinate space

Draw in a `1000 × (1000 / ratio)` viewBox. `W = 1000`, `H = 1000 / ratio`.
Default ratio `1.6` → `H = 625`. Type sizes are fractions of **W**; vertical
positions are fractions of **H**. That split is what keeps the composition
identical from 320 px to 3000 px.

## Ground and texture

| part | value | note |
| --- | --- | --- |
| ground | one flat fill | no gradient, no vignette, no shadow |
| dot grid | cell `0.0258W`, dot `r 0.0018W` | 9 px cell, 1 px dot on the original |
| dot ink | the card ink at `0.12` | `currentColor`, so it inverts with the ground |

The dot screen is the only texture. On cobalt it reads as a faint print screen;
on mint it reads as paper. Drawing it in white instead of the ink makes it
vanish on every light ground.

## Type

| part | size | tracking | position | fill |
| --- | --- | --- | --- | --- |
| code | `0.0215W` | `0.16em` | `x 0.055W`, baseline `0.128H` | ink @ `0.78` |
| word | `0.22W` | `-0.085em` | `x 0.057W`, baseline `0.612H` | ink @ 1 |
| note | `0.0215W` | `0.16em` | `x 0.055W`, baseline `0.903H` | ink @ `0.78` |

- **Display face:** Syne, weight 800. Cap height lands at `0.222H` for a
  `0.22W` font size — that ratio (≈ 0.63 cap/em) is what makes the word look
  as large as it does without touching the margins.
- **Mono face:** Geist Mono, weight 400, uppercase.
- Both are **variable**. Pin `font-weight: 400 800` on the Syne `@font-face` or
  weight 800 synthesises and the counters fill in.
- The word's `x` is `0.002W` past the margin, not more. Syne's left sidebearing
  on a cap already supplies the rest; adding a visible inset double-spaces it
  against the labels above and below.

## The ring

| property | value |
| --- | --- |
| centre | `(0.77W, 0.604H)` |
| radius | `0.41W` |
| stroke | `0.0057W` |
| opacity | `0.45` |

`0.604H` is the number people get wrong. The source CSS says
`right: -18%; bottom: -26%; width: 82%`. The horizontal offsets resolve against
**width**, the vertical against **height** — so the centre is
`H + 0.26H − 0.41W`, not `0.76H`. Use `0.76H` and the arc drops below the card
and misses the top edge entirely.

The circle is mostly off-card: it enters the top edge at `0.61W` and leaves the
bottom edge at `0.44W`. That single arc is the whole structure.

## Ornament: orbit

| property | value |
| --- | --- |
| centre | `(0.65W, 0.57H)` |
| half-length | `0.41W` |
| angle | `−24°` |
| stroke | `0.0057W` in the accent, opacity `0.9` |
| end dots | `r 0.0125W`, fill = ground, stroke = ink at `0.0043W` |

The dots are **filled with the ground colour**, which is what makes them read
as punched holes in the line rather than beads on it. The right-hand dot is
almost always off-card; that is correct.

## Ornament: petri

| cell | centre | radius |
| --- | --- | --- |
| large | `(0.64W, 0.464H)` | `0.19W` |
| small | `(0.795W, 0.552H)` | `0.095W` |

- Stroke: ink at `0.0043W`, group opacity `0.75`.
- Glow: radial, centre `38% / 34%` of each cell, `r 0.5` of the cell box,
  stops `0.82 → 0.28 → 0` at `0 / 0.62 / 1`.
- **The glow is butter, never the accent.** The source hardcodes
  `var(--butter)`; a dark accent on a light ground (cobalt on pink) renders as a
  muddy smudge instead of light arriving through a cell. Where butter is the
  ground, use tangerine.

## Paint order

1. ground
2. dot screen
3. ring
4. ornament
5. type

The ring is behind the word (in the source the word carries `z-index: 2` and the
ring does not), and the ornament is behind the word but in front of the ring.
The whole group is clipped to the card — the word, the ring and the orbit line
are all meant to bleed.

## Calibration targets

Generate a 3-character word at 16:10 and measure the ink bounding box. It must
land on:

```
x0 0.073   y0 0.387   x1 0.726   y1 0.610
```

Measured on the reproduction against the original: all four edges within
`0.003` of the card. If a run drifts, the cause is almost always the font —
a missing `@font-face` falls back to Helvetica, which is wider and shorter.
