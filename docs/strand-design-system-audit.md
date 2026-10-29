# Strand — design-system audit

> **Rewritten 29 October 2026 — v2.0, sea-glass.** v2.0 replaces the v1.x
> S-monogram with **two sheared planes and a six-unit strand**, replaces the flat
> quartz plate with a **pane of sea-glass**, moves the display face from Syne to
> **Instrument Sans**, and moves the signal from tide green to **sun**
> (`#A85A22`). The footer is now a full-bleed coast rather than a framed card.
> The live scorecard — the one that counts — is rendered on the page at
> `/design-system/strand#audit`. Where this document and
> `features/strand/tokens.json` disagree, the tokens win.

**Scope:** the v3.0 `sunnyside-brand-system` resources, the constructed-track
mark, the sea-glass material, the component set, and the shipped case at
`/design-system/strand`.
**Method:** tokens → CSS/JSON → brand assets → specimen page → static audit,
mark score, detach score, and a browser QA pass at 1440 and 390 on both
surfaces.
**Date:** 29 October 2026.

## Verdict

The material, the mark and the type pass. **Detach does not.** The worst pair is
59/100 against Clearing, against a floor of 70, because the sun shares a hue
family with Clearing's hart. That failure is reported on the page and in
`design/brand/strand/story.md § Gap`; it is not rounded up, and the hue was not
nudged nine degrees to clear a threshold while keeping the resemblance.

- Mark score: **PASS** — zero circles, no strokes, two primitives in the
  primary, one in the compact, dominant field 61%.
- Detach: **81 Cove · 75 Vitrine · 73 Hachure · 69 Riso · 59 Clearing**.
  Worst pair 59/100 (floor 70).
- Tokens: **127 CSS custom properties** across primitive, semantic and component
  layers, mirrored in `tokens.json` (13 primitives, 16 semantic keys per surface).
- Palette: **11 measured contrast pairs**; body on the pane at 15.71:1, night body
  at 12.61:1.
- Page: **11 sections**, all rendered, no horizontal overflow at 390 or 1440.
- Gaps: **7 named disclosures** in §6.

## 1. What is new in v2.0

| | v1.x | v2.0 |
| --- | --- | --- |
| Mark | S-monogram, 7.1° shoreline cut, 1.1-unit gap | Two sheared planes, 18.4° shear, six-unit channel |
| Material | Flat quartz plate, one hairline | Sea-glass pane: 158° gradient, 24px blur, specular edge, long shadow |
| Signal | Tide green `#16716F` | Sun `#A85A22` |
| Display | Syne | Instrument Sans |
| Footer | Framed card on the page ground | Full-bleed photograph, edge to edge |
| Sections | foundation, material, marks, horizon, type, forms, motion, budget, applications, tokens, audit | foundation, glass, marks, horizon, palette, type, parts, motion, voice, tokens, audit |

## 2. The constructed gate (v3.0)

- Zero circles, zero Venn diagrams, fill-only geometry.
- 2 solid regions in the primary: sun above the channel, marine below.
- 1 solid primitive in the compact, a separate drawing with a seven-unit channel.
- No shape carries both `fill` and `stroke`; the channel is a gap, not a line.
- `score-mark.py` returns **PASS** with a note: *dominant field 61% (v2.3 solid
  mass; channels are the negative space)*.

## 3. The mark: two planes, one channel

The bounding box is **52 × 46** on the 64 grid. The upper plane is
`M26 9H58L52 27H20Z`, the lower is `M12 33H52L46 55H6Z`, and the six units
between them are the only part of the mark that is not drawn — 9.4% of the grid.

Both planes are sheared 18.4°. The upper overhangs the lower by eight units on
the right, which is what makes the pair read as one cut through one body rather
than as two stacked bars. Nothing is rounded, so nothing degrades into a pill at
small sizes.

Below 28px the component swaps to a separate compact drawing: the channel widens
to seven units and the fine alignment is dropped, because six units at 16px is
1.5 device pixels. The crossover is chosen by the component, not by the reader.

**Constructions rejected in this pass** (drawn at 240px, checked at 32 and 16):
generic trapezoid stacks, wedges, louvers, rounded pills, arcs, and an inverted
pair that read as a letterform. The reason is consistent: anything with a curve
or a stroke loses its identity below 24px, and anything with three masses stops
being two planes.

## 4. Tokens and contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| Marine on quartz | 16.13:1 | Body copy on the solid plate inside a pane |
| Marine on dune | 14.17:1 | Headings directly on the ground |
| Marine on glass | 15.71:1 | Copy on the pane composite (measured, not guessed) |
| Haze on quartz | 5.75:1 | Secondary copy, captions, rail labels |
| White on sun | 5.06:1 | Primary button label, 14px and up |
| Sun ink on quartz | 6.82:1 | Signal as text — links, tag labels |
| Depth on quartz | 7.07:1 | The rare cool ink, used once per section |
| Night ink on night ground | 16.25:1 | Body copy after dusk |
| Night ink on night glass | 12.61:1 | Copy on the night pane composite |
| Night haze on night ground | 7.76:1 | Secondary copy after dusk |
| Night ground on night sun | 9.05:1 | Primary button label on the night surface |

A paragraph never sits on glass. The pane is a container; the plate inside it is
the reading surface. That is what keeps the ratio a number instead of a function
of the photograph underneath.

## 5. The page

Eleven sections: foundation, glass, marks, horizon, palette, type, parts, motion,
voice, tokens, audit. The marks section is built as four movements — logo stage,
spec table, wordmark scale, cast — rather than a row of equal logo tiles. The
palette section prints the contrast table it was built from. The audit section
prints the detach scores it earned.

## 6. Gaps

1. **Detach against Clearing is 59/100 against a floor of 70.** Sun is 9° from
   hart in OKLCH hue and night-sun sits on the same hue. A 35° signal would pass
   the threshold and stay within 27° of the same accent, so the number would move
   and the resemblance would not. The accent is shared; the surfaces are not.
2. The footer photograph is a 1916 × 821 WebP, not a responsive art-directed set.
   On a 4K display it is upscaled by roughly 1.4×.
3. Pane composites are computed from the declared opacity and gradient midpoint.
   A browser that renders the gradient differently lands within a few tenths of
   15.71:1, not exactly on it.
4. Instrument Sans is served through `next/font`, so a heading can swap on first
   paint. The wordmark is outlined and cannot swap.
5. The 2% signal budget is measured by hand on a 1440 × 900 viewport, not computed
   at runtime.
6. The compact mark is a separate drawing, not a downscale, so the two are not
   pixel-identical between 20px and 28px.
7. 24px blur is under the 30px threshold where frame time visibly degrades on a
   2020-era GPU, but it has not been profiled on real hardware here.

## 7. Reproducing the numbers

```sh
# mark craft gate
DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib \
  /opt/homebrew/bin/python3 skills/sunnyside-brand-system/scripts/score-mark.py \
  --dir public/brand/strand
# → PASS  strand   NOTE dominant field 61%

# detach gate, scored on the weakest pair
node skills/sunnyside-brand-system/scripts/detach-check.mjs \
  --new features/strand/tokens.json \
  --ref features/cove/tokens.json --ref features/hachure/tokens.json \
  --ref features/riso/tokens.json --ref features/vitrine/tokens.json \
  --ref public/brand/clearing/clearing-tokens.json
# → 81 Cove · 73 Hachure · 69 Riso · 75 Vitrine · 59 Clearing
# → worst pair 59/100 (threshold 70) — FAIL, disclosed
```

Clearing has no `features/clearing/tokens.json`; its token file lives at
`public/brand/clearing/clearing-tokens.json`. A scorecard that cannot be
re-derived from these two commands is a claim, not a measurement.
