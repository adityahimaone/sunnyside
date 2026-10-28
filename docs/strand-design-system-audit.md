# Strand — design-system audit

> **Amended 28 October 2026 — v1.2 mark pass.** This document records the
> original v1.0 audit under the v2.5 skill, the v1.1 v3.0 detach pass, and the
> v1.2 mark pass. v1.1 moved the signal from aquamarine (`#327B8A`, 213°) to
> tide green (`#16716F`, 192°) and made the theme DNA true in CSS. v1.2 opened
> the shoreline cut into a **1.1-unit strand gap**, so the sand and the sea are
> held apart instead of welded. The live detach scorecard — the one that counts
> — is rendered on the page at `/design-system/strand#audit`. Where this
> document and `features/strand/tokens.json` disagree, the tokens win.

**Scope:** the v3.0 `sunnyside-brand-system` resources, the constructed-track
architectural mark, the portable form kit, and the shipped Strand case at
`/design-system/strand`.
**Method:** sampling physical coastal dunes and tide line from the attached image,
architectural S monogram on a 64 grid, sixteen further constructions drawn and
rejected, tokens → CSS/JSON → form kit → proof page → board, then static audit,
mark score, and browser QA pass.
**Date:** 28 October 2026.

## Verdict

The method is **fulfilled with zero failures**. The constructed track is
selected; the S monogram passes the v3.0 hard gate and the geometric craft
check; the kit ships a brief, a story, theme DNA, a portable form kit, a
3000 × 2250 board, and an honest disclosure list.

- Mark score: **PASS** — zero circles, no strokes, 2 primitives in primary, 1 in
  compact, tide 47.6% of the letter, dominant field 52%.
- Detach: **78–82** against all five siblings, scored on the weakest pair
  (threshold 70).
- Tokens: **96 CSS custom properties** across theme DNA, primitive, semantic and
  component layers, mirrored in `tokens.json`.
- Palette: **6 measured contrast pairs**, body text at 16.6:1 on the quartz plate.
- Forms: accessible native controls, validation alert summary, and a tide gap
  ring on focus.
- Imagery: real coastal sand photograph (`strand-vista.webp`) anchored in both
  Hero and Footer.
- Gaps: **7 named disclosures** in §6.

## 1. What is new

Strand is Case 07 in the portfolio. Where Cove was deep blue liquid glass, Strand
is a quiet coastal architecture of flat white quartz reading plates, deep basalt
stone ink, and a single shallow-tide green signal.

| System | Material | Mark | Primary Signal |
| --- | --- | --- | --- |
| Sunnyside (01) | Paper + Cobalt | Sunburst | Tangerine |
| Vitrine (02) | Glass + Dither | Half-light V | Signal Lime |
| Huginn (03) | Print + Blackletter | Keystone Brackets | Vermilion |
| Riso Co. (04) | Risograph | Overprint Sheets | Federal Blue |
| Hachure (05) | Survey Paper | Ridge Bars | Lichen Green |
| Cove (06) | Blue Glass | Squared C | Ice Cyan |
| Strand (07) | Quartz Sand Plate | Dune Crest S | Shallow Tide |

## 2. The constructed gate (v3.0)

- Zero circles, zero Venn diagrams, fill-only geometry.
- 2 solid regions in the primary — basalt above the 7.1° shoreline, tide below.
- 1 solid primitive in the compact, a separate drawing with counters of
  5.2–8.5 units.
- Geometric craft check: 14 path commands, smooth Bezier counters, one straight
  cut.
- No shape carries both `fill` and `stroke`; the shoreline is a gap, not a line.

## 3. The mark: one cut, one gap

The letter occupies 50 × 48 of the 64 grid, leaving 6 units of margin on the
left and 8 on the other three sides. A single shoreline runs from y = 36 at
x = 0 to y = 28 at x = 64 — 8 units of drop, 7.1°, taken from the angle of the
shore in the reference photograph.

The cut is **1.1 units wide**. Sand and sea never touch. Everything below the
cut is tide: 47.6% of the letter's painted area, measured by pixel count on a
640 × 640 raster. Delete the tide and the S loses its foot; the accent is
structure, not ornament.

At 16px the gap is a third of a pixel wide and closes optically, so the mark
reads as a solid S. That is the intended degradation, and it is why the compact
mark is a separate one-tone drawing rather than a downscale.

**Constructions rejected in this pass** (drawn at 240px, then checked at 32 and
16): severed foot, sheared halves, terminals cut at 7.1°, waterline reflection,
wave-shaped cut, ramped swell, wedge of sea, dune-profile counters, pool in the
bay, 4° and 6° lean, and a cut on the letter's own horizontal at y = 40. Each
failed for a recorded reason; see `design/brand/strand/story.md`.

## 4. Tokens and contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| Basalt on Quartz | 16.6:1 | Body copy on the reading plate |
| Basalt on Linen | 15.5:1 | Body copy on the page ground |
| Haze on Quartz | 5.0:1 | Metadata and captions |
| Quartz on Tide | 5.8:1 | Text on the primary action |
| Pale sand on Basalt | 14.4:1 | Night reading plate |
| Night mist on Basalt | 6.1:1 | Night metadata |

Plates are flat: offset 0, no drop shadows, one hairline rule. Focus is a
plate-coloured gap ring, not a glow.

## 5. The page

Eleven sections, each on the 64-unit rhythm: foundation, material, marks,
horizon, type, forms, motion, budget, applications, tokens, audit. The marks
section is built as four movements — logo card, wordmark scale, construction
drawing, one usage rule — rather than a row of equal logo tiles.

## 6. Gaps

1. The vista photograph is a static WebP asset; no tide or weather feed is integrated.
2. Syne is served through the project webfont layout, not a self-hosted woff2 subset.
3. The theme toggle reads localStorage on mount, so first paint is the dune surface before the stored choice applies.
4. The budget shares are measured by hand on a 1440 × 900 viewport, not computed at runtime.
5. Four of the five neighbours predate the v3 token shape: they carry no `meta.sections` and only 0–3 of 12 DNA keys, so their structure key scores neutral (5/10). The detach scores are a floor, not a precise measure.
6. The strand gap is 1.1 units — deliberately below the 8% channel floor (5.1 units on this grid). It is a drawn separation, not a counter, so the floor does not govern it; below 32px it closes optically. The gap is a large-size detail.
7. The compact mark is a separate one-tone drawing, not a downscale of the primary, so the two are not pixel-identical at the crossover.

## 7. Reproducing the numbers

```sh
# mark craft gate
DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib \
  python skills/sunnyside-brand-system/scripts/score-mark.py --dir public/brand/strand
# → PASS  strand   NOTE dominant field 52%

# detach gate, scored on the weakest pair
node skills/sunnyside-brand-system/scripts/detach-check.mjs \
  --new features/strand/tokens.json \
  --ref features/cove/tokens.json --ref features/hachure/tokens.json \
  --ref features/riso/tokens.json --ref features/vitrine/tokens.json \
  --ref public/brand/clearing/clearing-tokens.json
# → 78 Cove · 78 Hachure · 80 Riso Co. · 78 Vitrine · 82 Clearing
# → worst pair 78/100 (threshold 70)
```

Clearing has no `features/clearing/tokens.json`; its token file lives at
`public/brand/clearing/clearing-tokens.json`. A scorecard that cannot be
re-derived from these two commands is a claim, not a measurement.
