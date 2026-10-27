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
