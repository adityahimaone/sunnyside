# The logo system

A logo is not a picture of the brand. It is a set of shapes that survive every
size, ground and handoff the brand will meet.

## 1. Find the one idea

Pick one method. Do not combine four.

| Method | What it does | Example logic |
| --- | --- | --- |
| **Monogram + meaning** | Cuts an initial with the product's action | `S` + a sun path |
| **Product action** | Turns the main verb into a shape | build → frame, send → path |
| **Metaphor fusion** | Merges two meaningful forms | sun + record, sun + paper |
| **Negative space** | Puts the meaning in the hole | an `A` cut from light |
| **Construction geometry** | Builds from a grid, rays, circles | a cut sunburst |

Write the sentence the mark must express. For Sunnyside: *the sunny side of a
record, a day, a page — a sun cut from paper and stuck on the page.*

## 2. Explore six

Draw six on the same 64-unit grid. Judge them with the same table:

| Test | Pass |
| --- | --- |
| Silhouette | A black shape at 32px still reads |
| Reduction | ≤ three shapes, or one stroke |
| Meaning | One sentence, without naming the visual |
| Scale | 16, 32, 64, 512 |
| Ownability | Not a stock sun/bolt/leaf/shield |
| System | Leaves room for a wordmark and a favicon |

Keep one. Write down why the other five lost. That note is the guide.

## 3. Build the mark on a grid

Use a 64-unit viewBox. Put every point on the grid. Example, Sunnyside:

| Part | Value |
| --- | --- |
| Tile | 58 × 58, corner radius 16, 2.6 ink edge |
| Tile offset | 2.5 down-right, solid ink, no blur |
| Sun centre | 31 / 29.5 |
| Sun radius | 16.5 |
| Rays | 12 at 30°, from r 19.4 to r 32, clipped by the tile |
| Compact mark | 8 rays, 3.2 edges, larger sun, no shadow |

Rules:

- One flat fill per role. Ink for structure, one accent for the core, one for a
  small detail.
- Clip rays at the tile edge; the crop is what makes it feel cut from paper.
- If the system uses hard offsets, keep them hard. A soft shadow changes the
  material.
- Do not add a face unless the voice is playful and the face survives 16px.
  Build the face on the grid: bar eyes, an arc smile, cheeks at 55%.
- Build the compact mark as a separate drawing. Do not scale the primary.

## 4. The wordmark

Two routes, both ending in outlines:

1. **Type** — instance the font at the needed weight, shape with real kerning,
   apply tracking, convert to paths. Use `scripts/extract-wordmark.py`.
2. **Hand** — use the product's marker alphabet, or draw one, and freeze the
   paths.

Test the wordmark at 16, 24, 32, 64 and 160px wide. The mark and wordmark should
share an optical baseline, not a geometric one. Record the gap, the wordmark
height, the name size and the tracking.

Do not use `<text>` in the final lockup. A logo that changes when a font fails is
not a logo.

## 5. The family

Every complete brand needs:

- **horizontal lockup** — mark + wordmark, the primary
- **stacked lockup** — for square placements and covers
- **mark only** — app icons, social avatars
- **compact mark** — 16–24px, favicon
- **reversed lockup/wordmark** — for ink or cobalt
- **glyph** — the mark without its tile, for pattern and stickers

Define **clear space** (half the mark height), **minimums** (full mark 24,
compact 16, wordmark 72 wide, lockup 130 wide) and the **responsive lockup**
(e.g. name drops at 480, wordmark at 360).

## 6. Favicon and app icon

- Use the compact mark at 16/32/48, transparent background.
- Put the sizes in one ICO; ship an SVG and a 180 apple icon on a background.
- Test at 1× on light and dark chrome. If it reads as a smudge, remove detail.
- Do not use the glyph (the mark without its tile) as a favicon; it has no field.
- Add a 192 and 512 PNG for app use.

## 7. Colour variants

The primary mark is the colour master. Then:

- **on paper / light** — full colour
- **on ink / dark** — full colour; the ink edge may vanish, the tile still holds
- **reversed wordmark** — paper wordmark on dark
- **one-colour stamp** — optional; draw it, do not just flatten the fills

Do not recolour the core, the face or the cheeks for a campaign. The brand
palette is the system, not a mood.

## 8. Acceptance tests

- [ ] silhouette at 32px
- [ ] face reads at 32px (if it has one)
- [ ] compact mark reads at 16px
- [ ] favicon on light and dark chrome
- [ ] lockup at 130px, 240px, 512px
- [ ] clear space drawn and measured
- [ ] lockup responsive at 480 and 360
- [ ] reversed assets exist
- [ ] all SVGs use the same viewBox and colours
- [ ] no clipart, no copied mark, no live text
- [ ] the guide explains why this mark, not just what it is
