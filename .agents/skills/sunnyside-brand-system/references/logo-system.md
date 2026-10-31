# The logo system

## Hard gate (read first)

1. **Zero-circle / zero-Venn.** No overlapping circle Venns, concentric rings,
   orbit badges, or circular containers. Across a showcase, no two logos share
   an outer silhouette. Use the five families: architectural monogram, offset
   planes, louvers, ribbon, horizon.
2. **Fill-only.** No `fill` + `stroke` on one shape, no wireframe rings. Solid
   unstroked paths with ≥8% viewBox negative channels (5.1 on 64).
3. **2–4 primitives, one accent.** Monochrome `#141413` first. A letter only
   earns its place as an architectural monogram (cut / joined / lit), never as
   a typed initial with an ornament.

Sections 1–9 below are the working method; where one disagrees with the gate above, the gate wins.

## The mark system

A logo is half the identity. The full system is primary + compact + glyph +
wordmark + cast + composition. Read `references/craft-bar.md` before choosing a
method.

- **Constructed track:** the five v2.3 families. Corporate, technical and
  infrastructure brands. Wordmark may be outlined type.
- **Drawn track:** one subject, one cut line, one flat fill, one hard offset,
  2–3 inks, 16px. Warm, editorial and object-led brands. A circle is allowed
  only when it is the subject (sun, lens, face), never a badge or Venn. Ships a
  drawn wordmark and an optional 4–6 mark cast.
- **Cast:** punctuation, not a second logo set. One cut line, one flat fill, one
  job per mark. Use `scripts/cast-forge.mjs` for a starting set.
- **Composition:** logo card, wordmark scale, cast drawer, one rule. A row of
  equal logo tiles is not a mark system.

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
- **cast** — optional 4–6 supporting marks for the drawn track; each has one job

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
- [ ] wordmark is drawn or outlined; no live text
- [ ] drawn track: 4–6 cast marks, one cut line, one fill, one job each
- [ ] marks composition: logo card, wordmark scale, cast drawer, usage rule
- [ ] all SVGs use the same viewBox and colours
- [ ] no clipart, no copied mark, no live text
- [ ] the guide explains why this mark, not just what it is

## 9. Generating the family (vector, text-free)

`scripts/brand-forge.mjs` implements the build above as code so every run starts
with a complete, tested family instead of a blank file.

| Concept | Construction | Reads as | Watch for |
| --- | --- | --- | --- |
| `sunburst` | n rays clipped by the tile, one disc | day, warmth, output | the stock sun; fix with material (offset, crop, stroke) |
| `aperture` | n blades around a hole | focus, capture, decision | blade count above 6 turns to mud at 16px |
| `orbit` | concentric rings + one dot | system, cycle, signal | compact needs a single ring |
| `hatch` | diagonal lines + a disc | drawing, shading, craft | line gap must grow in the compact |
| `stack` | offset plates | layers, versions, depth | keep ≤ 3 plates, 2 in compact |
| `facet` | circle cut by a diagonal | decision, split, light | thin cut disappears at 16px |
| `dotmatrix` | aligned rings of dots, empty centre, one gap | data, signal, texture | dots under 4 units wide vanish at 16px; keep two rings in compact |
| `lines` | disc hatched with weight-swelling lines | flow, shading, signal | reads as a striped planet unless the story is shading |
| `overprint` | two flat discs, clipped lens | merge, agreement, two inks | lens colour must be a real third colour, not a blend mode |
| `nodes` | asymmetric nodes + thick edges | agents, links, route | no orphan satellites; every dot attached |
| `monogram` | geometric monoline letter + printed offset | initial | a letter alone is not an idea: add a cut, join or light |

Process: `--bakeoff brand.json` (six families, one material) → `score-mark.py` →
compare at 16px → keep one → write why the rest lost → hand-refine points on
the grid → re-run. Vary **theme DNA** before geometry; material is what makes the
mark yours.

Guarantees the generator makes (and `audit.mjs` re-checks): one viewBox for the
whole family, no `<text>`, compact has fewer shapes, reverse and mono are drawn
not flattened, every contrast pair measured.

Not guaranteed: that the idea is good. A generated mark is a draft. Judge it with
the six tests in §2, then argue for it in `story.md` — the five beats and the decision cards in `SKILL.md`.
