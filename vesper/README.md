# Vesper

A two-ink print system for the evening. Cobalt and cream, one horizon, one star
that came down and stayed.

Open **`design-system/vesper/index.html`** — it is the whole thing: one file, no
build step, no network request. Ten sections from the field to the audit.

![The board](brand/vesper-board.png)

## The idea

A design system is a horizon, not a spotlight.

The artwork that seeded it — three surreal vintage prints, a lamppost under a
stippled starfield — shares one grammar: two inks, a stipple, a horizon, and a
single small figure under a very large sky. Vesper takes the grammar and leaves
the pictures.

The mark is a four-point star, 46 × 40 units, whose lower point lands exactly on
a 44 × 4 bar. Six concepts were drawn; five lost because they stood on a plinth,
and a head on a plinth is a trophy. The bar is the horizon, not a base.

The palette is sampled from the files and normalised to eight primitives. Every
contrast ratio in the page is recomputed from hex by `build-tokens.mjs`, and the
three pairs that fail are printed with the job they may not do.

The hero is not a photograph and not a stock image: it is 60,000 cream ticks
drawn along 340 streamlines from one point, generated at 1600 × 900 from a fixed
seed by `field.mjs`.

## Read in this order

| File | What it is |
| --- | --- |
| `../design-system/vesper/index.html` | the specimen. The primary artefact. |
| `brand/brief.md` | the six-line brief, the decisions, and what was assumed |
| `public/brand/vesper/DESIGN.md` | the agent-readable spec — tokens, type, rules |
| `docs/vesper-design-system-audit.md` | what is proved, by which command, and what is not |
| `brand/vesper-board.png` | the board, 3000 × 2250 |
| `public/brand/vesper/bakeoff/sheet.html` | the ten that lost, and why, each with its measured score |

## Check it

```bash
node vesper/scripts/audit.mjs
```

```
PASS  contrast  14 pairs recomputed, all match, 3 failing pair(s) published
PASS  palette   8 primitives declared once, at the same value
PASS  fonts     3 families (Fraunces, Archivo, DM Mono), all local, all declared
PASS  marks     26 SVGs, all outlines, no live text, no NaN
PASS  bakeoff   11 concepts scored, shipped mark ranks 4 of 11, its 1 failure(s) published
PASS  page      1440 and 390: 0px overflow, all faces loaded, no console errors
```

The bake-off gate reads `scores.json` and fails if the shipped mark is missing
from the table, if it scored a clean 100, or if its rank and first failure are
not printed on the page. The scorer runs in Chrome — no `cairosvg`, no `Pillow`:

```bash
node vesper/scripts/score-bakeoff.mjs   # 11 concepts × 128/40/16 → scores.json
```

## Regenerate

Generated files are never edited by hand. Edit the source, then re-run in order:

```bash
node vesper/scripts/build-tokens.mjs     # tokens.json + tokens css, contrast computed
python3 vesper/scripts/outline-wordmark.py \
  --font vesper/assets/fonts/Fraunces-Regular-Display.ttf \
  --text VESPER --cap 26 --tracking 0.012 \
  --out vesper/public/brand/vesper/wordmark.json
node vesper/scripts/build-brand.mjs      # 26 SVGs: mark family, lockups, icon, cast
node vesper/scripts/field.mjs            # stipple.png + dither.png
node vesper/scripts/score-bakeoff.mjs    # bakeoff/scores.json, read by the page
node vesper/scripts/bakeoff.mjs          # bakeoff/sheet.html, with the scores on it
node vesper/scripts/build-page.mjs       # design-system/vesper/index.html
node vesper/scripts/build-board.mjs      # brand/board.html
```

The board is a screenshot of `brand/board.html` at 1500 × 1125, 2×:

```bash
node scripts/shot.mjs --url vesper/brand/board.html \
  --out vesper/brand/vesper-board.png --w 1500 --h 1125 --scale 2
```

## Licence

Type is SIL OFL 1.1 — Fraunces, Archivo, DM Mono — shipped locally as woff2. The
wordmark is outlined from Fraunces at wght 400 / opsz 144 / SOFT 30 and is never
live text. The field is generated, not traced from the supplied prints.
