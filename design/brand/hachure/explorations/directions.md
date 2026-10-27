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
on a shallow ridge and the base cut at row 46. Eight 4-unit cells at 82% and 44%
coverage finish the feet, thresholded with the same Bayer matrix the footer
samples.

**Why it works.**

- At 16px it is an H. Not a peak, not a barcode — the initial, in eleven pixels.
- At 96px the feet dissolve into cells, so the letter carries the system's own
  operation: ink running out into paper.
- It is not a mountain. The range is still the footer's subject; the mark no
  longer has to repeat it.
- One path, no mask, 8 cells. It favicons without a redraw at 32 and 180; the
  16px compact only redraws the feet on a 2-unit grid.

---

## The decision, again

12 replaces 03. The first pass's six remain the honest history of the idea — and
the reason the second pass had something to reject. A mark is allowed a second
pass; a system that hides its first one is a brochure.
