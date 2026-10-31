> **Historical.** This file records the first and second passes. The current mark is the v2.2 bake-off at the end of the file.

# Six directions, one kept — Hachure

All six were drawn on the same 64 grid, in one colour, and judged at 32px and
16px before any of them were coloured. The test order matters: a mark that only
works large is a poster, not a mark.

---

## 01 · Nested contours

Three closed curves, one inside the other, with a dot at the centre — the way a
hill is drawn on a topographic sheet.

**Why it lost.** At 16px the rings close up and the whole thing becomes a grey
blob. Shrinking the ring gap fixes the blob but makes the outer ring too thin to
print. It also reads as a radio button, which is a worse failure than being
unreadable.

**What would have saved it.** Two rings instead of three, with the inner one
filled. That is no longer a contour diagram; it is a target.

## 02 · Benchmark triangle

The survey trig point: a triangle with a dot punched through it, stamped on a
brass plate.

**Why it lost.** Triangle-plus-centre-dot is the international hazard and
"attention" glyph. You cannot own a symbol that already means *warning* in every
airport on earth, no matter how good the provenance is.

**What would have saved it.** Nothing. The reference is correct and the symbol is
taken.

## 03 · The peak that prints into paper — **kept**

An asymmetric ridge profile: a steep left face to an offset apex, a knee, then a
long right shoulder twice the length of the left face. The foot is not drawn with
a line — it is punched into 4-unit cells whose coverage falls from 1.0 to 0.35,
so the base dissolves into the paper.

**Why it works.**
- The silhouette is a *profile*, not a triangle. Offset apex plus unequal
  shoulders is what terrain looks like; a centred isosceles triangle is what an
  icon looks like.
- One path. No mask, no clip id, no second colour.
- At 16px the dissolve collapses into a two-pixel speckled base and reads as a
  soft foot. At 64px you can count the cells.
- It is the footer in miniature: the same Bayer matrix, the same "dots become
  paper" operation, at glyph scale.

## 04 · Quadrangle corner

An L of two rules with crop marks, the corner of a map sheet.

**Why it lost.** It has no centre of gravity. In a 16px favicon it reads as a
UI bracket or a broken border, and a mark that looks like chrome is worse than no
mark.

## 05 · Hachure tile

A square filled with vertical strokes that lengthen left to right — density
encoding slope, literally the thing the name means.

**Why it lost.** The ramp is only legible above roughly 48px. At 32px it is a
grey square; at 16px it is a grey dot. The idea is right and the scale is wrong,
which is the most common way a good idea dies.

**What would have saved it.** Fewer strokes, much heavier — but at that point it
is a striped square, and stripes are not hachure.

## 06 · Spot height

A dot with a small numeral beside it: the smallest unit of terrain data.

**Why it lost.** The numeral is the whole idea and it is unreadable at 16px,
leaving a plain dot. A mark cannot depend on text it cannot carry.

---

## The decision

03 keeps the component's actual subject — *density standing in for depth* — in a
single silhouette that survives being 16 pixels wide. The other five each kept
the metaphor and lost the scale.

Rejection notes are the guide: the mark section of the proof page states the
construction rule, not the story.

---

# The second pass — the brandkit pass

The first pass was judged at 16px and passed. It should not have. Printed small,
the ridge is the peak glyph every terrain app uses; the asymmetry that reads at
96px disappears in eleven pixels, and the foot cells become a speckle. A mark
that only works large is a poster.

So the brandkit pass drew again, on the same 64 grid, with one rule added: the
mark must survive 16px *as a shape*, not as a texture. Six directions:

## 07 · Ridge with gullies

The kept ridge from the first pass, with three narrow slots cut into its face.
At 96px the slots read as ravines; at 64px they close into a tent; at 32px the
mark becomes a badge with a white triangle in it. **Lost.**

## 08 · Comb ridge

Five vertical bars whose tops trace the ridge profile, so the mark is literally
hachure. At 96px it is a skyline; at 32px it is a barcode; at 16px it is a
smudge. Hachure needs more strokes than a mark can afford. **Lost.**

## 09 · Range pair

A solid near ridge with a dotted far ridge behind it — depth by density, the
system's actual sentence. At 96px the dots read as sparks above the peak. At
32px they are gone, leaving the first pass's ridge. **Lost.**

## 10 · H, solid

The initial, with the stem tops cut on a shallow ridge. Clean at every size, and
completely plain: a letter with no operation in it. **Lost.**

## 11 · H, hachured stem

The left stem split into three vertical bars, the right one solid: two densities
in one letter. At 64px it reads as a printer's registration mark; at 32px it
reads as a glitch. The idea is right and the balance is wrong. **Lost.**

## 12 · H, printed feet — **kept**

An H on the 64 grid — stems 12, counter 20, crossbar 6 — with the stem tops cut
on a shallow ridge and the base cut at row 46. Each stem finishes in three
4-unit cells — two columns with a 4-unit gap, the outer column two rows deep and
the inner one row — so the foot steps into the paper.

**Why it works.**

- At 16px it is an H. Not a peak, not a barcode — the initial, in eleven pixels.
- At 96px the feet dissolve into cells, so the letter carries the system's own
  operation: ink running out into paper.
- It is not a mountain. The range is still the footer's subject; the mark no
  longer has to repeat it.
- One path, no mask, 6 cells. It favicons without a redraw at 32 and 180; the
  16px compact only redraws the feet on a 2-unit grid.

---

## The decision, again

12 replaces 03. The first pass's six remain the honest history of the idea — and
the reason the second pass had something to reject. A mark is allowed a second
pass; a system that hides its first one is a brochure.

---

# The v2.3 bake-off — the current mark (supersedes the H and the knoll)

The H passed 16px but never drew the slope. The v2.3 gate bans circles and
outlines, so the five allowed families were drawn with solid fills only:

| # | Family | Idea | Verdict |
| --- | --- | --- | --- |
| 01 | architectural monogram | notched letter | a letter, not a slope |
| 02 | offset planes | sheared sheets | an overprint, not terrain |
| 03 | louvers | solid stepped bars | **kept** |
| 04 | ribbon | one folded beam | one beam, no range |
| 05 | horizon | baseline + keystone | a line, not relief |

The kept mark is four solid wedge-bars, 8 / 10 / 12 / 14 wide, with a lichen
diamond apex. The compact is three bars on a 32 grid. The H, the knoll and the
thin hachure lines remain in this file as history, not as the current mark.

---

## v3.0 — the mark drawn from the technique, not the picture

The v2.3 winner was wrong in a way that only showed up when it was set beside
the other eight case marks: it used **height** to mean rise. Four bars getting
taller is a bar chart, and a bar chart is the one thing a terrain system must
not be. So the mark was drawn again — not from the picture of a hill, but from
the technique the system is named after.

Nine marks, four rounds. Round one drew five; rounds two to four refined the
only two that survived contact with a 16px favicon.

| # | Family | Idea | Verdict |
| --- | --- | --- | --- |
| 01 | contour chevrons | nested chevrons, lichen centre | an upload icon at 16px |
| 02 | dither tile | one square of dither, four tones | noise, not a mark |
| 03 | even bars, lichen cap | seven equal bars, top one lime | a striped square with no focal point |
| 04 | bars cut diagonally | bars growing 16 → 64, bottom lime | reads as signal strength |
| 05 | right-aligned summit | left ends tracing a ridge in negative space | the best idea of the round; muddy below 32px |
| 06 | contour diamonds | nested diamonds, `fill-rule="evenodd"`, lichen core | a thin wireframe beside eight solid siblings |
| 07 | sheared stack, descending | equal bars stepping down-right | reads as falling, not as a slope |
| 08 | slab ridge | silhouette cut by channels that narrow as they climb | a mountain, so a photo icon |
| 09 | **sheared stack, climbing** | equal bars stepping up-right, lichen cap | **kept** |

### Why 09

Equal lengths are the argument. Nothing is plotted, so nothing can be misread
as data; the only variable is the offset. In a real hachure the strokes are
drawn down the line of steepest slope, so a sheared stack *is* a slope and the
lean *is* its aspect. The mark is the technique, not an illustration of terrain.

The lichen cap stayed where the old apex diamond was, so the accent did not
move — only the grammar did.

### What changed around it

- **The channel became a number.** `2.2` on the 64 grid, the same gap the
  dither leaves between cells, so the mark and the field are ruled alike.
- **Clear space became a rule.** The first v3.0 drawing ran to the edge of its
  box, which made it optically larger than the wordmark and impossible to align
  with anything. It now sits in a channel and a half on every side.
- **The cap stopped being an off-token lime.** The React component hard-coded
  `#B8CC3B`, a colour in no token file. It reads `--hx-sheet` (`#C9D94E`), which
  is what the SVG files always claimed.

## v4.0 — the reset, and why 09 was not enough

09 was argued well and still read weak. The argument was right about charts and
wrong about weight, because a mark is judged in a row rather than on its own.

Rendering all eight siblings at 112px settles it:

| Sibling | Kind |
| --- | --- |
| `cove`, `huginn`, `ledger`, `porphyry`, `strand`, `vitrine` | solid saturated tiles |
| `riso` | two-plane paper collage |
| `clearing` | the only free-standing line drawing |

Six solid masses, one collage, one drawing — and Hachure, a stack of hairlines.
At 46px it sits in the row as a list icon next to a set of blocks. No amount of
shear tuning fixes a weight failure.

### The round

| # | Family | Idea | Verdict |
| --- | --- | --- | --- |
| 01 | stepped silhouette | quantised steps up-right | a staircase at 16px |
| 02 | single stroke | one thick diagonal | reads as a pen nib |
| 03 | map key | two stacked legend bars | a bar chart with a legend |
| 04 | quantised edge | solid field, torn right edge | a sheet of paper |
| 05 | banded solid | solid mass cut into bands | five stripes, still a list icon |
| 06 | contour arc | thick arc on a contour | a rainbow |
| 07 | weight ramp ×3 | equal bars thickening upward | flip it and the meaning flips |
| 08 | heavy base, lit summit | 07 reversed | bedrock under a cap |
| 09 | **solid mass, lit crest** | one section, crest cut from the edge | **kept** |

### Why 09, and why 07 lost

07 was the best drawing of the round. Equal bars with thickness climbing encode
density literally — it is the technique, drawn. Then it was flipped so the heavy
stroke sat at the base, and it said the opposite thing: bedrock under a cap
rather than a lit summit. **A mark whose orientation reverses its reading is a
diagram, not an identity.** That is the whole reason 09 wins: a solid mass with
one lit crest says "slope" whichever way you turn it, because the slope is the
silhouette and not an arrangement of parts.

09 is a section through rising ground. Flat bottom, vertical sides, a top edge
climbing 24 units over 58 — a 22° slope — and a 7-unit band cut from that edge,
so the highest surface of the silhouette is the lichen. The accent is the
ground, not a stripe laid on it. Nothing is hatched inside the mass.

### What the reset removed

- **The compact drawing.** It existed because seven 2.2-unit channels closed
  into a block below 24px. This drawing has no channel to close, so
  `mark-compact.svg` was deleted and the `compact` prop came off `HachureMark`.
- **The lockup's 0.86.** The old ink was 58 × 58 of the 64 grid; the new ink is
  58 × 52, so holding 0.86 would have shrunk the mark by the height it lost.
  The factor is now 0.95, which keeps the ink at 1.4 × the wordmark height.
