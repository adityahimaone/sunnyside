# Riso Co. — brand assets v4.0

The mark is hand-cut on the 64 grid. There is no generator any more: `build-riso-brand.mjs`
was deleted with v3.0 because it wrote the old parallelogram geometry and would have quietly
overwritten the new drawings.

## Files

| File | Use |
| --- | --- |
| `public/brand/riso/mark.svg` | Primary, 64 grid, three shapes (drum A, drum B, pin) |
| `mark-compact.svg` | 16px — two shapes, wider channel, no pin |
| `mark-mono.svg` | One ink; the pin is punched through both flaps (`fill-rule: evenodd`) |
| `mark-reverse.svg` | On the orange sheet: paper + carbon, because blue on orange is 1.24:1 |
| `glyph.svg` | The tear alone, one ink |
| `wordmark.svg` | Space Grotesk 700, outlined by `scripts/riso-wordmark.py` |
| `lockup.svg` | Mark + wordmark, carbon ink, for light grounds |
| `lockup-mono.svg` | Mark + wordmark, paper ink, for dark stages |
| `lockup-on-drum.svg` | Mark + wordmark, paper + carbon, for the orange sheet |
| `favicons/` | 16 · 32 · 180, from the compact |

## Rebuilding a lockup

`scripts/build-lockup.mjs` composes a lockup from an existing mark and wordmark and bakes the
ink in, because `currentColor` resolves to black inside an `<img>`:

```bash
node scripts/build-lockup.mjs --mark public/brand/riso/mark.svg \
  --wordmark public/brand/riso/wordmark.svg --out public/brand/riso/lockup.svg \
  --mark-size 56 --word-height 32 --gap 14 --ink "#1b1712" --label "Riso Co."
```

## The board

`design/brand/riso/brandkit.html` is authored at 1500 × 1125 with local TTF files in
`assets/`. Render it at 2× and write straight to `public/brand/riso/riso-brandkit.png`:

```bash
node scripts/render-board.mjs --html design/brand/riso/brandkit.html \
  --out public/brand/riso/riso-brandkit.png --width 1500 --height 1125 --scale 2
```

## The code side

`features/riso/brand-paths.ts` mirrors the SVG geometry so the React mark can inherit the drum
tokens. If a point moves, it moves in both places.
