# Ornaments

One ornament per card. It is the single piece of "evidence" that the subject is
a technical object rather than a poster — so it has to be a *diagram*, not a
decoration.

## Shipped: `orbit`

A straight line with a ringed dot at each end, at −24°.

Reads as: a trade, a transfer, a route, a two-sided market, a handoff.

Use it when the subject has **two sides** or a **direction** — P2P settlement,
an API, a pipeline, a before/after, a send/receive.

Rules:

- The dots are filled with the ground, never with the ink. They are holes.
- The line is the accent at full strength; it is the only saturated element on
  the card besides the glow.
- The far dot going off-card is the point. Do not shorten the line to fit.

## Shipped: `petri`

Two ringed cells with a soft warm glow at 38% / 34%.

Reads as: something grown, cultured, sampled, incubated.

Use it when the subject is **organic, scientific or editorial** — biotech,
research, a lab, a study, a slow process, a collection that accumulates.

Rules:

- Two cells, never three. The overlap is what makes it read as a field.
- The glow is butter (or tangerine where the ground is butter). Never the
  accent — see `recipe.md`.
- The glow is offset up-left, not centred. Light arrives from one side.

## Adding a third

Allowed, but it has to pass all four of these:

1. **One shape family.** Circles with circles, lines with lines. An orbit line
   plus a cell is two ideas and reads as clip art.
2. **Drawn in ink or accent, nothing else.** No third colour. The palette is
   ground + ink + one accent, full stop.
3. **It must survive being cropped.** Place it so at least a third of it is off
   the card. A shape floating fully inside the frame reads as a sticker.
4. **It must not touch the type.** The word owns the horizontal band from
   `0.387H` to `0.610H`. An ornament may cross it only as a thin stroke, and
   only if the word stays legible — the word is always painted last.

Good candidates that pass:

- **`scan`** — three parallel hairlines at −24°, evenly spaced, one of them
  heavier. Reads as a read-head, a barcode sweep, a spectrogram.
- **`gate`** — a single thick vertical bar with a small notch cut out of it.
  Reads as a checkpoint, a filter, a commit.

Reject: stars, sparkles, blobs, arrows with heads, anything with a gradient
larger than one cell, anything that needs a second colour to read.

## Where to put the code

`scripts/make-sleeve.mjs`:

- add the geometry to the `G` object, as fractions of `W` / `H`;
- add a branch next to the `variant === 'petri' ? … : orbit(…)` ternary, or give
  it its own function that returns a `<g>`;
- add the name to the exported `VARIANTS` array so `--seed` can pick it and the
  contact sheet renders it.
