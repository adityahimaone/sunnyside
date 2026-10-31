# Hachure — design system notes

> Relief drawn by density, never by shadow.

Case 05. A cartographic interface system built from the supplied
`RidgelineDitherFooter`. This file is the decision record: what the component
actually is, which fusion was chosen and why, and the rules that follow from it.
The brief is in [`brief.md`](./brief.md); the audit is in
[`docs/hachure-design-system-audit.md`](../../../docs/hachure-design-system-audit.md).

## 1. What the component is

The supplied file is a footer, but its engine is a **tone system**:

- six ridges from ridged fractal noise, each with its own base, amplitude,
  frequency, flank and tilt;
- tone quantised through an 8×8 Bayer matrix at 2 CSS px and mapped onto a
  seven-step palette whose first step is the paper;
- a half-resolution mist field that drifts, with a pointer clearing;
- a reveal that develops the range back to front, each ridge climbing a few
  pixels while its threshold sweeps from paper to full tone.

So the subject is not mountains. The subject is **density standing in for
depth**. That distinction decides everything: a system built on "a mountain
footer" is a component; a system built on "density is the only depth control" is
a system, and the footer becomes its largest specimen.

## 2. Modern design read

Dither and halftone are current again, and most of that revival is decoration: a
grain overlay, a picture, a hover. The modern move that survives is different —
**treat the dither as a surface with a budget**. A short palette plus a
threshold matrix is a print technology, and print technology brings print
discipline with it: no gradients, no opacity tints, no shadows, no rounded
corners. That is a more interesting answer to "modern" in 2026 than another
glass card.

Six fusions were considered for the component's interface:

| # | Direction | Verdict |
| --- | --- | --- |
| 01 | Terrain console — dark UI, phosphor dots, telemetry | Refused: night radar is a cliché and the contrast is worse |
| 02 | Editorial riso zine — paper, overprint, halftone | Refused: that is Case 04, and it earned it |
| 03 | Data-relief dashboard — dither as chart encoding | Borrowed: the chart has to be honest, so contrast is measured in the build |
| 04 | Cartographic survey sheet — hachure, margins, benchmark | **Kept** |
| 05 | Mist-lens explorer — pointer reveals hidden data | Borrowed: the pointer parts the mist and reads a crest |
| 06 | Bento relief cards — dither inside rounded cards | Refused: dither as garnish in a rounded box |

The kept direction works because a survey sheet already refuses the category
defaults: a soft card shadow, a gradient sky, and the isosceles-triangle peak
logo. Nothing had to be bolted on — the component stops being a mountain and
becomes the largest plate in a system that was always tonal.

**Category defaults rejected, explicitly:**

1. **No soft shadow.** A hairline and a bench tone say "this sits above"; the
   only thing that reaches altitude is the footer.
2. **No gradient sky.** A CSS gradient cannot be printed. Tonal steps are
   discrete palette indices.
3. **No peak logo.** The triangle is the most used mark in this category, so the
   test is whether the shape narrows to a point. This one never does: flat
   bottom, two vertical sides, a top edge that climbs — a *section* through
   ground, not a summit. The crest is lit; no circle.

## 3. Domain

From the physical world of relief mapping: **hachure** (stroke spacing encodes
slope), the **contour interval** (hierarchy as nested curves), the **benchmark**
(a known elevation stamped in rock), the **quadrangle sheet** (margins, legend,
scale bar, title block), and **valley mist** (depth by obscuration).

Materials, from the same world: cold survey stock `#F2F4EE`, stock in shadow
`#E5E9DF`, pine black `#16211B`, deep forest `#1E3B2C`, chartreuse lichen
`#C9D94E`, moss `#4A6B33`, valley fog `#A9BBB0`, a range at night `#0A110D`, and
survey red `#A82A1C` for errors only.

The signature: **the range dissolves upward into the page.** Not a fade — the
first palette step *is* the paper, so the dots get sparser until they are the
surface. Depth is the surface thinning.

## 4. Token architecture

`features/hachure/tokens.json` is the only source. `scripts/build-hachure-brand.mjs`
generates the CSS, the public JSON and the React geometry. Nothing is hand-edited
downstream.

Three tiers:

- **Primitives** — the nine materials above. Nothing knows what it is for.
- **Semantic roles** — `surface`, `surface-alt`, `sheet`, `ink`, `ink-muted`,
  `rule`, `accent`, `range-accent`, `field`, `focus`, `alert`, and their night
  values. CSS: `--hx-*`.
- **Component/press settings** — radius `0`, hairline `1px`, field height
  `46px`, focus `2px/3px`, dither cell `2px`.

Also generated: the six-step type scale, the 4→104px space scale, four motion
durations, and the seven-tone ramp for light and night. Contrast is **computed**
in the build from the token values; a ratio is never typed next to a colour.

## 5. Elevation

| Band | Altitude | What lives there |
| --- | --- | --- |
| Range | 400–3,000 m | The site footer, and only the footer |
| Bench | 40 m | Panels, inputs, table headers — one hairline and one tone |
| Ground | 0 m | The page, survey stock, reading type |

Three bands because an interface has three levels of meaning. The range is
reserved so that reaching it means the page has ended.

## 6. Type

Geist Mono carries the display, the labels, coordinates, altitudes and the
wordmark; Geist reads. Two families, both already loaded by the host — no new
webfont. Display is `clamp(2.5rem, 7.2vw, 6.25rem)` at `0.92` / `-0.03em`; body
is 17px at 1.6 with a 68-character measure; labels are 11px mono at `0.14em`.
Every changing number is tabular.

The wordmark is Geist Mono 700, outlined once by `scripts/hachure-wordmark.py`.
It is never live text.

## 7. Mark

The mark is the name's operation at full weight: relief drawn by density.

One solid mass, one lit crest. The mass is a section through rising ground —
flat bottom, vertical sides, a top edge that climbs left to right. The crest is
a band of constant thickness cut from that edge, so the highest surface of the
silhouette is the lichen: the accent is the ground, not a stripe laid on it.
Nothing is hatched inside the mass. No circle, no enclosing ring, no stroke.

- 64 grid: flat bottom at `y57`, sides at `x3` / `x61`, a top edge climbing
  `24` over `58` (a 22° slope); crest band `7`; clear space `3` left and right,
  `5` above, `7` below — the bottom gets more because the mass is bottom-heavy.
- The body reads `--hx-mark-ink` (`#16211B` on ground, the paper ink at night);
  the crest reads `--hx-sheet` (`#C9D94E`).
- **No compact variant.** There is no channel to close, so 16px and 512px are
  the same geometry. A second drawing would be the same bytes.
- `mono` collapses the crest to currentColor, leaving the slope as the only
  distinguishing feature — which is enough, because the slope is the silhouette.
- The lockup draws the mark at 0.95 of the lockup size, so its ink lands at
  1.4 × the wordmark height.
- The favicon is opaque paper so the ink survives a dark chrome.

The H and its foot cells are gone, and so is the v2.3 louver family. That mark
used **height** to mean rise — four bars getting taller — which is the grammar
of a bar chart, and a bar chart is the one thing a terrain system must not be.
v3.0 replaced it with seven sheared strokes, which argued well and read weak:
measured against its seven siblings at 112px it was the only mark built from
hairlines, so at 46px it sat in the row as a list icon next to a set of blocks.
v4.0 is the reset. The rejection notes for both rounds are in
[`explorations/directions.md`](./explorations/directions.md) and on the page's
mark section.

## 8. Motion

One entrance, then stillness:

1. frame guides draw down (1.4s);
2. brand mark and name rise out of a soft blur (140ms);
3. ridges develop back to front, 170ms apart (380ms);
4. copyright and credit line (1250ms);
5. altimeter armed, mist keeps drifting (1600ms).

Reduced motion resolves to the finished plate: no reveal, no drift, no pointer
clearing, and the altimeter still reads because it never depended on animation.
The page's own studies animate nothing indefinitely.

## 9. Rules

**Do** use the dither plate only in the range band; keep every edge square; use a
hairline plus a bench tone for elevation; let lichen be a field and moss be
type; measure a contrast pair before adding a colour; declare the palette
explicitly when feeding the footer, so it never falls back to stock defaults.

**Don't** add a `box-shadow`, a gradient, an opacity tint, a rounded corner or a
blur; put lichen type on stock; use survey red in the identity; use the range in
a hero; scale the primary mark down to 16px; set the wordmark as live text;
animate the mist forever without a way to stop it.

## 10. Files

| Concern | Path |
| --- | --- |
| Tokens | `features/hachure/tokens.json` → `hachure-tokens.css` |
| Generator | `scripts/build-hachure-brand.mjs` |
| Wordmark outlines | `scripts/hachure-wordmark.py` → `assets/wordmark-path.json` |
| Board | `design/brand/hachure/brandkit.html` → `hachure-brandkit.png` |
| Board renderer | `scripts/render-hachure-board.mjs` |
| Marks and favicons | `public/brand/hachure/` |
| Route | `app/design-system/hachure/page.tsx` |
| Markdown twin | `app/design-system/hachure/llms.txt/route.ts` |
| Component | `components/ui/ridgeline-dither-footer.tsx` |

## 11. Gaps

Print is unverified: the palette is a screen approximation, and the lichen ink on
paper has not been proofed. The altimeter reads a generated elevation, not a
surveyed one. The component's `backdrop-filter` badge has not been checked in
Safari. The Playwright e2e suite was skipped for this case.
