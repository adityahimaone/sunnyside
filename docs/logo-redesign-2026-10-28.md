# Mark redesign v2.3 — Huginn, Riso Co., Hachure

**Skill:** `sunnyside-brand-system` v2.3 (`metadata.version: '2.3'`).
**Trigger:** the v2.2 output was three overlapping-circle/Venn variants with
thin outlines — the exact failure the v2.3 gate exists to stop.

The v2.3 gate was applied before drawing:

- **Zero-circle / zero-Venn.** No overlapping circles, concentric rings, orbit
  badges or circular containers. No two logos share an outer silhouette.
- **Fill-only.** No `fill` + `stroke` on one shape. Solid, unstroked paths with
  ≥8% viewBox negative channels (5.1 units on 64).
- **2–4 solid primitives**, monochrome first (`#141413`), one accent maximum.
- **Five allowed families**, one per brand: architectural monogram, offset
  planes, louvers, ribbon, horizon.

## The bake-off

Each brand ran the five families on its own palette and material. The final
marks pass `score-mark.py` with no FAIL and no WARN.

| Family | Huginn | Riso Co. | Hachure |
| --- | --- | --- | --- |
| Architectural monogram | **kept** | lost — a letter, not print | lost — a letter, not a slope |
| Offset planes | lost — a print diagram, not a mind | **kept** | lost — an overprint, not terrain |
| Louvers | lost — a chart, not a name | lost — a chart, not a sheet | **kept** |
| Ribbon | lost — one beam, no bridge | lost — one beam, no two passes | lost — one beam, no range |
| Horizon | lost — too quiet | lost — no overprint corner | lost — a line, not relief |

The three final marks:

```
PASS huginn   bracket   3 solids, 0 strokes, 0 circles
PASS riso     planes    3 solids, 0 strokes, 0 circles
PASS hachure  louvers   2 solids, 0 strokes, 0 circles
```

## Huginn — architectural monogram

Two solid L-brackets face each other; the H bridge is a vermilion diamond
keystone. Charcoal `#141413`, keystone `#E03C1F`. The compact widens the
channels; the favicon uses paper brackets on the field with an ink keystone.
No circle, no detached accent. The system's cells remain the operation for the
picture and the wordmark; the bracket H is the named exception.

## Riso Co. — offset geometric planes

Two sheared, unstroked sheets: orange `#F2542D`, blue `#1D63FF`, shifted
diagonally. The overlap is a solid overprint polygon `#2B192E`. The compact
isolates the overprint; the mono is the union. No black outlines. The Riso
system inks were moved to the same three values, so the mark and the page share
one palette.

## Hachure — brutalist louvers

Four solid wedge-bars rise and thicken left to right: widths 8 / 10 / 12 / 14,
gaps 5.3, tops 36 / 26 / 16 / 8, base 56. A lichen diamond `#B8CC3B` caps the
summit. The compact drops to three bars with wider channels; `mono` collapses
the apex. No circle, no thin hachure line, no enclosing ring.

## SVG checklist

- No `<circle>` as an outer container or Venn: **pass** (scorer + manual).
- No element with both `fill` and `stroke`: **pass** (scorer).
- 2–4 solid primitives: **pass** (bracket 3, planes 3, louvers 2).
- Different outer silhouettes from 3 metres: **pass** — H / sheared plane /
  rising ridge.
- Monochrome first: all three collapse to `#141413`; only the keystone/apex is
  the accent.
- 16px: compact marks are separate 32-grid drawings; the scorer passes.

## What changed

- Skill: `SKILL.md` v2.3, `references/logo-brainstorm.md` v2.3 gate, five-family
  bake-off, `brand-forge.mjs` concepts `bracket/planes/louvers/ribbon/horizon`,
  `score-mark.py` circle/stroke/primitive checks.
- Huginn: `scripts/build-huginn-mark.mjs`, mark/compact/keystone/lockup/favicons,
  specimen symbols and mark section.
- Riso: `scripts/build-riso-brand.mjs`, mark/compact/mono/lockup/favicons, the
  page mark family, board and tokens.
- Hachure: `scripts/build-hachure-brand.mjs`, mark/compact/mono/lockup/favicons,
  the page mark family, board, llms, brief, DESIGN and audit.
- Boards and case-library/design-engineering covers regenerated.

## Not verified

- Print/PDF proof of the new marks.
- OS-level favicon rendering (SVGs inspected at 16/32/180).
- The Hachure hero canvas was blank in `next dev` during this pass; the mark
  screens, boards and static SVGs are the evidence used.
