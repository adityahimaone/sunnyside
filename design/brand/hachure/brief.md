# Brand Brief — Hachure

> Case 05 — a cartographic interface system for terrain, weather and field data.
> v1.1.0. Built from the `RidgelineDitherFooter` component. The mark took a
> second pass for the brandkit; the first one is kept as history in §4.

## 1. The component, read closely

The supplied component is a footer, but what it actually is is a **tone engine**:

- Six ridges generated from **ridged fractal noise** (`rdfRidgeline`), each with its own base, amplitude, frequency, flank and tilt.
- Tone quantised through the classic **8×8 Bayer matrix** (`RDF_BAYER`), sampled at 2 CSS px, and mapped onto a **7-step palette** that starts at the paper colour.
- A **mist field** at half resolution that drifts, and a **pointer clearing** that parts it.
- A reveal that develops the range back-to-front, each ridge climbing while its dither threshold sweeps from paper to full tone.

So the component's real subject is not mountains. It is **density standing in for depth**. The mountains are the occasion.

That matters for the design system: if the system is "a mountain footer", it is a component. If the system is "density is the only depth control", it is a system — and the footer becomes its largest specimen.

## 2. The one sentence

**Relief drawn by density, never by shadow.**

Every rule below is a consequence of that sentence, and the sentence is the thing to reject the work against.

## 3. Domain before defaults

### Five things from the physical world of relief mapping

1. **Hachure** — the pre-contour way of drawing a slope: short strokes whose *spacing* encodes steepness. Dense = steep. The direct ancestor of the dither.
2. **Contour interval** — the vertical distance between lines. A map's hierarchy is a set of nested closed curves, not a stack of cards.
3. **Benchmark / trig point** — a known elevation stamped into rock, marked with a triangle and a number.
4. **The quadrangle sheet** — a 7.5-minute tile with margins, a legend, a scale bar and a title block. The original design system.
5. **Valley mist** — the atmosphere that hides the far ridges. Depth cue by obscuration, not by blur or shadow.

### Five colours from that world

| Primitive | Value | Where it comes from |
| --- | --- | --- |
| `stock` | `#F2F4EE` | Cold survey paper, faintly green |
| `stock-deep` | `#E5E9DF` | The same stock in shadow |
| `ink` | `#16211B` | Pine black, the printed line |
| `pine` | `#1E3B2C` | Deep forest, the far ridge |
| `lichen` | `#C9D94E` | Chartreuse lichen — the one loud field |
| `mist` | `#A9BBB0` | Valley fog |
| `night` | `#0A110D` | A range at night, no moon |
| `alert` | `#A82A1C` | Survey red — errors only, never identity |

### The signature

**The range dissolves upward into the page.** Not a fade, not a gradient: the dots get sparser until they *are* the paper, because the first palette step is the paper colour. Depth is not layered on top of the surface; it is the surface, thinning.

### Three category defaults rejected

1. **No shadows.** A `box-shadow` is the default way to say "this sits above that". This system draws elevation with a hairline and dot density instead. Checkable: `box-shadow` appears nowhere.
2. **No gradient as depth.** A CSS gradient blends two colours; it cannot be printed. Every tonal step here is a discrete palette index.
3. **No mountain-as-logo.** A triangle is the most generic mark in this category. The mark has to earn its silhouette (see §4).

## 4. Explore six, keep one

All six on the same 64 grid, all one colour, judged at 32px and 16px.

| # | Direction | Why it lost |
| --- | --- | --- |
| 01 | **Nested contours** — three closed rings with a dot at the centre | At 16px the rings merge into a blob. Also reads as a radio button. |
| 02 | **Benchmark triangle** — trig point, triangle with a centre dot | The triangle-with-a-dot is the international hazard glyph. Unusable. |
| 03 | **The peak that prints into paper** — asymmetric profile, foot dithered out | **Kept.** |
| 04 | **Quadrangle corner** — an L of two rules with crop marks | No centre of gravity; reads as a UI bracket, not a mark. |
| 05 | **Hachure tile** — a square of strokes lengthening left to right | Below 48px the ramp is invisible and it reads as a grey square or a barcode. |
| 06 | **Spot height** — a dot with a small numeral | The numeral is unreadable at 16px, leaving a plain dot. |

**Kept: 03.** The body is clipped at row 42, not 34: cutting above the knee at
`(38, 34)` reduces an asymmetric ridge to an isosceles triangle, which is the
category default the direction set out to reject. One silhouette (an asymmetric ridge: steep left face, a knee, a long right shoulder), one operation (the foot dissolves into 4-unit cells whose coverage falls from 1.0 to 0.35). The reasoning was that it survives 16px because the silhouette is a *profile*,
not a triangle — the apex is offset to the left and the right shoulder is twice
as long as the left face, which is what terrain looks like and what a peak glyph
does not. **That reasoning was too generous.** At 16px the asymmetry disappears
and the dissolve becomes a speckle; the second pass below replaces it.

The compact variant dropped the dissolve entirely and spent its budget on stroke
weight.

### Second pass — the brandkit pass

The first pass's winner did not survive the brandkit. At 16px the ridge is a
generic peak, and a mark that only works at 96px is a poster. A second pass drew
six more on the same grid:

| # | Direction | Why it lost |
| --- | --- | --- |
| 07 | Ridge + gullies — three slots cut into the face | Reads as a tent or a badge |
| 08 | Comb ridge — five bars whose tops trace the profile | A barcode skyline; no silhouette at 16px |
| 09 | Range pair — solid near ridge, dotted far ridge | The dots read as sparks; they vanish at 32px |
| 10 | H, solid — sloped stem tops | Clean, but a plain letter with no operation |
| 11 | H, hachured stem — one stem in stripes | Reads as a glitch, not a system |
| 12 | **H, printed feet** — the base breaks into cells | **Kept** |

The H was the second pass, not the last word. It passed 16px, but it never drew
the thing the name means: a line on a slope. A v2.3 round replaced it with four
wedge-bars that used height to mean rise — which turned out to be the grammar of
a bar chart. The mark was drawn again in v3.0, this time from the technique
rather than from the picture of a hill.

### The v3.0 bake-off

| # | Family | Idea | Verdict |
| --- | --- | --- | --- |
| 01 | contour chevrons | nested chevrons | an upload icon at 16px |
| 02 | dither tile | one square of dither | noise, not a mark |
| 03 | even bars, cap | equal bars, lichen top | a striped square, no focus |
| 04 | bars cut diagonally | erosion toward a corner | signal strength, not slope |
| 05 | right-aligned summit | ridge in negative space | muddy below 32px |
| 06 | contour diamonds | nested diamonds, lichen core | a wireframe beside solid siblings |
| 07 | sheared stack, descending | equal bars stepping down-right | reads as falling |
| 08 | slab ridge | silhouette cut by channels | a mountain, so a photo icon |
| 09 | **sheared stack, climbing** | equal bars stepping up-right | **kept** |

The v2.3 winner — four wedge-bars rising and thickening — used **height** to
mean rise, which is the grammar of a bar chart. A terrain system cannot be a
bar chart, so the mark was drawn again from the technique rather than from the
picture of a hill.

### The v4.0 bake-off

v3.0 kept the climbing shear and it still read weak, for a reason no bake-off
table could show: the mark is judged in a row. Rendering all eight sibling
marks at 112px makes the failure plain — six of them are solid, saturated
tiles, one is a two-plane collage, one is a line drawing, and Hachure was a
stack of hairlines. At 46px it was a list icon beside a set of blocks.

| # | Family | Idea | Verdict |
| --- | --- | --- | --- |
| 01 | stepped silhouette | quantised steps up to the right | a staircase at 16px |
| 02 | single stroke | one thick diagonal | reads as a pen, not a slope |
| 03 | map key | two stacked legend bars | a bar chart with a legend |
| 04 | quantised edge | solid field, torn right edge | a sheet of paper |
| 05 | banded solid | solid mass cut into bands | five stripes — still a list icon |
| 06 | contour arc | thick arc following a contour | a rainbow |
| 07 | weight ramp ×3 | equal bars thickening upward | flip it and the meaning flips |
| 08 | heavy base, lit summit | the ramp reversed | reads as bedrock under a cap |
| 09 | **solid mass, lit crest** | one section, crest cut from the edge | **kept** |

The kept mark is **a section through rising ground**: flat bottom, vertical
sides, a top edge that climbs, and a band of constant thickness cut from that
edge so the highest surface of the silhouette is the lichen. The accent is the
ground, not a stripe laid on it. Nothing is hatched inside the mass — internal
hatching is exactly what fails at 16px — so density is carried by the slope of
the top edge instead of by a stroke count.

The decisive rejection is **07**: the weight ramp was the best drawing of the
round, and reversing it changed what it said. A mark whose orientation flips
its meaning is a diagram.

## 5. The mark's construction

- 64 grid. Flat bottom at `y57`, sides at `x3` / `x61`, top edge climbing `24`
  over `58` — a 22° slope. Crest band `7`.
- Clear space: `3` left and right, `5` above, `7` below — the bottom gets more
  because the mass is bottom-heavy.
- Body reads `--hx-mark-ink` (#16211B on ground, the paper ink at night); the
  crest reads `--hx-sheet` (#C9D94E). No stroke, no circle.
- **No compact variant.** There is no channel to close, so 16px and 512px are
  the same geometry.
- `mono` collapses the crest to currentColor; the slope remains the silhouette.
- Lockup: the mark is drawn at 0.95 of the lockup size so its ink lands at
  1.4 × the wordmark height.
- Favicon: opaque paper, the same drawing at 16, 32 and 180.

## 6. Elevation as the hierarchy

The system's unusual rule, and the one that makes it more than a footer:

| Band | Altitude | What lives there |
| --- | --- | --- |
| **Ground** | 0 m | The page. Paper. Nothing is below it. |
| **Bench** | 40 m | Inset panels, fields, table headers — one hairline above the page. |
| **Range** | 400–3,000 m | The footer, and only the footer. Nothing else in the system may use the range. |

That is the whole depth model. There are three levels because there are three levels of meaning in the interface, and the range is reserved so that reaching it means something.

## 7. Palette by role

- **Lichen `#C9D94E` is a fill, never a letter.** On stock it measures 1.34:1 — worse than the orange in Case 04. Lichen is for fields, marks, and the dither's brightest ridge.
- **Moss `#4A6B33` is the type-safe green** for eyebrows, numerals and links (4.9:1).
- **Pine `#1E3B2C`** carries the far ridges and the dark-theme accent.
- **Survey red `#A82A1C`** is functional only. It never appears in the identity.

## 8. Type

- **Geist Mono** for display, labels, coordinates, altitudes and the wordmark. A map's margin is all numbers; making the display face mono is the system's most legible cartographic move.
- **Geist** for body copy only.
- Two families, both already loaded by the host. No new webfont.
- The wordmark is **outlined from Geist Mono Bold** — never live text.

## 9. Deliverables

- `features/hachure/tokens.json` → `features/hachure/hachure-tokens.css`, `public/brand/hachure/hachure-tokens.{css,json}`.
- `public/brand/hachure/` — `mark.svg`, `mark-mono.svg`, `wordmark.svg`, `lockup.svg`, `favicons/`, `hachure-brandkit.png`.
- `design/brand/hachure/brandkit.html` — the 1500×1125 board.
- `app/design-system/hachure` — the proof page, plus an `llms.txt` twin.
- `components/ui/ridgeline-dither-footer.tsx` — the component, unmodified in behaviour.
- A form kit, a density ramp, an elevation study, and the footer as a full-bleed specimen.

## 10. Not verified

Print output. The palette is a screen approximation of a two-ink print. Actual halftone at 2px, paper absorption, and the lichen ink's real appearance have not been proofed.
