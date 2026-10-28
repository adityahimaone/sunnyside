> **Historical.** This file records the v3.0 exploration. The current mark is the v2.2 bake-off at the end of the file.

# Six Directions on a 64 Grid — Riso Co.

Each direction was drawn on a 64×64 unit coordinate system to test silhouette, reduction, scale (16px), and ownability.

| # | Concept | Geometry | Outcome | Rejection / Selection Reason |
|---|---|---|---|---|
| 01 | **Ink Drum Roller** | Cylindrical barrel with diagonal emulsion hatching | Rejected | Too literal; reads like an office toner cartridge or battery at 16px. |
| 02 | **Registration Crosshair** | Precision crosshair with offset ink dots | Rejected | Generic print-industry cliche; lacks the tactile warmth of torn paper. |
| 03 | **The Pushpin & Deckle** | Domed pushpin puncturing a torn sheet corner | **KEPT (Winner)** | Instantly communicates paper tension and puncture; sharp silhouette that survives down to 16px favicon. |
| 04 | **Folded Sheet Monogram "R"** | Folded corner sheet forming the leg of an R | Rejected | Looks like an origami app or file folder icon. |
| 05 | **Serrated Tear Line** | Diagonal jagged lightning tear dividing the square | Rejected | Lacks focal point; does not communicate the anchor or origin of the tear. |
| 06 | **Soy Bean Stamped Ink** | Organic bean silhouette filled with half-tone raster | Rejected | Organic shape lacks architectural structure and conflicts with mechanical hardware. |

## Winning Mark: The Pushpin & Deckle (03)
- Domed cap and waisted collar in upper quadrant (y: 8 to 28).
- Sharp needle passing through a diagonally torn poster leaf (y: 28 to 56).
- Compact version strips secondary highlight lines for clean 16px icon rendering.

---

# The v2.3 bake-off — the current mark (supersedes the pushpin and the sheet)

The v2.0 sheet was a silhouette with an offset effect; at 16px it was a smudge.
The v2.3 five-family gate kept **offset planes** — two sheared sheets, one
overprint — because the press behaviour is the shape, not an effect applied to
a shape.

| # | Family | Idea | Verdict |
| --- | --- | --- | --- |
| 01 | architectural monogram | notched letter | a letter, not print |
| 02 | offset planes | two sheared sheets | **kept** |
| 03 | louvers | solid stepped bars | a chart, not a sheet |
| 04 | ribbon | one folded beam | one beam, not two passes |
| 05 | horizon | baseline + keystone | no overprint corner |

Primary: orange #F2542D and blue #1D63FF sheared sheets, overprint #2B192E,
no strokes. Compact: the overprint polygon alone. Mono: the union.
`score-mark.py` passes with no warnings under the v2.3 gate.
