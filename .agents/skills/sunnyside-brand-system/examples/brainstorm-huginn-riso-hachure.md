# Worked v2.3 brainstorm: Huginn, Riso Co., Hachure

The v2.2 sheet failed the gate: all three marks were overlapping circles,
discs with ring outlines, or a striped disc. Three brands, one silhouette. The
v2.3 five-family bake-off gives each a different outer geometry and removes
every stroke.

```bash
node scripts/brand-forge.mjs --bakeoff examples/configs/huginn.json  --out out/huginn
node scripts/brand-forge.mjs --bakeoff examples/configs/riso-co.json --out out/riso-co
node scripts/brand-forge.mjs --bakeoff examples/configs/hachure.json --out out/hachure
python3 scripts/score-mark.py --dir out
```

## Huginn — architectural monogram

- **Kept:** two solid L-brackets facing each other; the H bridge is a vermilion
  diamond keystone. Charcoal `#141413`, keystone `#E03C1F`.
- **Why:** the name is a relationship (thought + memory), and the letter finally
  has a structural job. No circle, no detached accent.
- **Lost:** planes (a print diagram, not a mind), louvers (a chart, not a name),
  ribbon (one beam, no bridge), horizon (too quiet).
- **Compact:** wider channels, no thin strokes; the keystone is the only accent.

## Riso Co. — offset geometric planes

- **Kept:** two sheared, unstroked sheets — orange `#F2542D`, blue `#1D63FF` —
  shifted diagonally. The overlap is a solid overprint polygon `#2B192E`.
- **Why:** two print passes are planar, not circular; the overprint is the
  shape, not an offset applied to a silhouette.
- **Lost:** bracket (a letter, not print), louvers (a chart), ribbon (one beam,
  no two passes), horizon (no overprint corner).
- **Compact:** the overprint polygon alone; the mono is the union.

## Hachure — brutalist louvers

- **Kept:** four solid wedge-bars that rise and thicken left to right; a lichen
  diamond `#B8CC3B` caps the summit.
- **Why:** the name means hachure; the mark draws slope as density, using solid
  bar weight instead of thin lines. No enclosing circle.
- **Lost:** bracket (a letter), planes (an overprint, not terrain), ribbon (one
  beam, no range), horizon (a line, not relief).
- **Compact:** three bars, wider channels; the apex stays.

## What changed in the pipeline

- Five different families, one per brand, enforced by the v2.3 gate.
- `score-mark.py` fails circles, fill+stroke and >4 primitives; all three final
  marks pass with no FAIL or WARN.
- The generator's default `--bakeoff` now runs the five families; the old
  circle/line concepts remain as legacy only.
