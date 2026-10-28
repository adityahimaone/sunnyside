# Worked brainstorm: Huginn, Riso Co., Hachure

The v2.0 sheet gave each brand a letter or a blob. This is the same brief run
through `references/logo-brainstorm.md`. Configs are in `examples/configs/`.

```bash
node scripts/brand-forge.mjs --config examples/configs/huginn.json  --out out/huginn
node scripts/brand-forge.mjs --config examples/configs/riso-co.json --out out/riso-co
node scripts/brand-forge.mjs --config examples/configs/hachure.json --out out/hachure
python3 scripts/score-mark.py --dir out
```

## Huginn

- **Name says:** one of Odin's two ravens; Huginn is thought, Muninn is memory.
- **Kept idea:** `overprint`. Two discs, thought (bone) and memory (ash); where
  they overlap the field is cut away. *What two minds agree on is the answer.*
- **Why not the H:** a letter says nothing about thinking, and the detached
  square read as a typo.
- **Lost:** `nodes` (right idea, reads as generic AI), `dotmatrix` (too
  decorative for a calm product), `monogram H` (the original sheet).
- **Next:** try a raven silhouette by hand on the same 64 grid; the overlap
  lens could become the raven's eye.

## Riso Co.

- **Name says:** risograph; two spot inks printed in two passes.
- **Kept idea:** `overprint`, in real riso inks (fluorescent pink, blue); the
  lens is the colour the inks actually make where they overlap.
- **Why not the pennant:** a shield has no relation to print, and the
  misregistration offset was the *only* idea; at 16px it became a smudge.
- **Lost:** `stack` (layers, but reads as a design tool), `lines` (halftone
  reading is too fine at 16px).
- **Next:** a second compact for single-colour stamps: the lens only.

## Hachure

- **Name says:** the short parallel lines that shade slopes on old maps.
- **Kept idea:** `hatch`. A lit disc, a shaded side drawn in lines that fall
  off toward the light. *Relief, drawn the old way.*
- **Why not the notched H:** it never drew a line, so the name was missing.
- **Lost:** `lines` (reads as a striped planet), `orbit` (wrong domain).
- **Next:** make the line spacing follow the slope of a real contour.

## What changed in the pipeline

- Six different families, not six tweaks of one letter.
- `score-mark.py` flags the orphan square pattern, thin compacts and blob
  silhouettes before a human sees them.
- Compact marks drop offsets and heavy detail by rule.
