# The sleeve

The generated cover for a release with no artwork. Reference: **SeaPhantom P2P** (orbit,
cobalt) and **Labgrownbeasts** (petri, mint) in the work gallery.

## Geometry

Measured against the card width `W`, so a 320-wide sleeve and a 348-wide card agree. The
default box is 16:10 — that is the work-gallery media, and a 1:1 sleeve is a different object
(the booth's `Cover`), available with `--ratio 1`.

| Part | Value | Notes |
| --- | --- | --- |
| Box | `320 × 200` | `--ratio 1.6`; `--ratio 1` gives 200 × 200 |
| Padding | `0.058 W` | ~19 units at 320 |
| Dot screen | pitch `0.026 W`, dot `0.0029 W`, opacity `.12` | `currentColor`, so it follows the ink |
| Catalog line | `0.0215 W`, tracking `0.16em`, baseline `0.15 H` | top-left, opacity `.78` |
| Shout | `0.205 W`, tracking `−0.085em`, baseline `0.64 H` | Syne 800, max 4 characters |
| Note | same size as the catalog, baseline `0.87 H` | bottom-left |
| Ring | `r 0.41 W`, centre `(0.77 W, 1.26 H − r)`, `2px` stroke at `.4` | cropped by the right and bottom edges |
| Orbit | from `0.08 W` to `0.92 W` at `0.52 H`, rotated `−22°` | `2px` tangerine line, two nodes `0.023 W` |
| Petri cells | large `0.38 W` at `(0.45 W, 0.16 H)`; small `0.19 W` at `(0.70 W, 0.40 H)` | `1.5px` outline over a butter radial |

The ring is the only thing that is cropped. Everything else sits inside the padding — that
tension is the composition.

## The two variants

**orbit** — a line with a node at each end, crossing the sleeve from lower-left to upper-right.
It reads as a connection, a route, a settlement path. Use it for anything peer-to-peer,
networked, or transactional.

**petri** — two outlined cells with a butter glow, one large one small, in the upper right. It
reads as something grown rather than built. Use it for biology, research, anything that
cultures.

Pick one. A sleeve with both is a diagram.

## The shout

Two to four characters, uppercase, from the title:

- **Multi-word title** → the last word, up to four characters. `SeaPhantom P2P` → `P2P`.
- **Single-word title** → its first three letters. `Labgrownbeasts` → `LAB`.
- Override with `--ghost` whenever the derivation is wrong. `Sun Club` should be `SUN`, not
  `CLUB` — the last word is not always the subject.

The shout is set at the bottom-left, baseline at 64% of the height, and the note sits under it
at 87%. If the shout is four characters it will reach ~75% of the width; that is correct. If
it reaches 90%, the size is wrong, not the word.

## What the sleeve is not

- **Not a screenshot.** There is a separate skill (`generate-project-covers`) for capturing a
  live URL. This one draws.
- **Not a poster.** No title in sentence case, no body copy, no second ring.
- **Not a logo.** The mark never appears; the sleeve is packaging, and packaging carries a
  catalog number, not a brand.

## Using it in the site

The component lives in `features/landing-page/studio/work-gallery/work-gallery.tsx` and
switches variant on the slug:

```tsx
const lab = project.slug === 'labgrownbeasts'
<div data-variant={lab ? 'petri' : 'orbit'}>…</div>
```

A generated sleeve is a fallback, not a default: if `project.cover` is set, the image wins. The
two releases that use it are the two that shipped without artwork.

## Files

`scripts/sleeve.mjs` writes one `.svg` with Syne embedded as base64 (~48KB). That weight is
deliberate: an SVG with an external font renders in the fallback face the moment it is opened
from disk, emailed, or used as an `<img>`, and a sleeve whose shout is the wrong width is a
different sleeve.
