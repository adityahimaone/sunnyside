# Jakarta — design system audit

Seventeen checks. Each one is a command or a measurement, not an opinion. Five are
not clean — three partial and two open — and one of the partials is the reason the
palette works at all.

Re-run everything:

```bash
# design-system workspace — produced the values in this file
node jakarta/scripts/build-tokens.mjs                          # contrast, both scopes
node jakarta/scripts/verify-mark.mjs                           # redraw vs bitmap
node jakarta/scripts/verify-mark.mjs compact                   # compact, by design different
node jakarta/scripts/shots.mjs                                 # 1440, every section
node jakarta/scripts/shots.mjs --w 390                         # 390, overflow measured
node jakarta/scripts/figma-smoke.mjs design/figma/jakarta/code.js

# this repo — the rendered checks
npx tsc --noEmit
NODE_OPTIONS="" npx next build
npx next start -p 3011
# then a one-off Playwright pass at 1440 / 768 / 390, light + night,
# with reduced motion emulated; the measurements are in jakarta-qa.md
```

On this build the two rendered checks were run with Chrome at 1440 × 1000 and
390 × 844; `scrollWidth − clientWidth = 0` at both widths.

## Round 2 — the immersive pass

The page had a correct palette and a flat performance. This round changed the two
surfaces a visitor actually remembers, and fixed the audit findings the first pass
had papered over.

**The hero is now the identity at hoarding scale.** The blurred ten-stop wash
became ten **hard-stop bands** on a 112° axis — flat district colour, not a
gradient — with the Semanggi junction plate masked at the reading edge and blended
`luminosity`. The mark is repeated at 760px behind the composition, so the stroke
that turns the corner is the page's architecture rather than a logo in a corner.
The headline lives on one **tinted plate**, not a sign: one type colour, a 1px
hairline edge, no cap and no offset, so the field's tone shows through while the
words stay legible (cream on the worst band is 5,20:1 at 0.55 tint, 5,64:1 at 0.58
with backdrop blur). The palette is one **continuous ten-segment line** at the floor
— solid segments, no gaps, no separators, leaning 6° at the field's angle — and the
hero ends in a **clip-path tear** with irregular teeth (2–4,4% amplitude), not a
texture.

*(Round 2 was superseded: see Round 3 below for the current hero floor, headline and
the per-section accents.)*

**Applications became a wall, not a column.** Four artifacts on a 12-column bento
— a tall phone stage, a wide card plate, a panel and a livery — each on its own
28px grid plate with a numbered caption and the three token roles it spends. The
livery is wide because a bus is a horizontal object. Cards lift 3px and move their
shadow; reduced motion removes the lift. The section opens on the palette itself
(a full-bleed rule of ten colours) and then returns to paper, so the page has one
loud field, not two.

**The audit corrected itself.** The first pass claimed the page obeyed “a district
colour is never a word” while setting accent kickers, rule numbers, verdicts and
ratios in Senja at 10–14px. Every one of those is now a mark — a bar, a rule, a
chip, a dot or an underline — and no small accent type remains. The only type on an
accent ground is ink on Senja at 4,56:1 (the primary button and the wall index
chips). The first pass also missed `text-faint` on paper at **4,09:1**; every
tertiary label now uses `text-muted` (6,29:1) and the faint role is reserved for
24px and up.

## The table

| Check | Result | Evidence |
| --- | --- | --- |
| Mark redrawn, not traced | **Pass** | The supplied 6000 × 5008 bitmap and the SVG are rasterised at 600 × 501 and compared pixel by pixel: **0,989 IoU**. 768 px of surplus in the original, 473 in the redraw — all antialiasing along the arc. `scripts/verify-mark.mjs` |
| Mark at 32px | **Pass** | Hook, 2:1 corner and stop resolve on paper, on ink and on Senja. Checked at 96, 48, 32 and 24px on the real grounds. |
| Compact at 16px | **Partial** | The compact is a separate drawing — 0,78S stop, 0,44S gap, no clear space — and it holds at 16 and 24 (0,918 IoU against the primary's 0,989: the difference *is* the redesign). It keeps two shapes, so the gate's “fewer shapes than the primary” rule is **not met**. The one-shape drawing in this family is the glyph, which is what actually ships at 16px. |
| Wordmark | **Pass** | Outlined from the variable TTF at wght 800, −0,045em tracking. No `<text>` element in any file in `brand/`. |
| Contrast — light | **Partial** | Computed from the semantic layer: six district colours fail and are published below. A seventh pair, `text-faint` on paper at **4,09:1**, is also a failure — every tertiary label now ships in `text-muted` at **6,29:1** and the faint token is reserved for 24px and up. |
| Contrast — night | **Pass** | 14 pairs, **13 pass**. The one failure is Langit-300 as a label on Malam-100 at 4,23:1 — large text only. |
| Accent is never type | **Pass** | No small accent type remains: every accent label is a bar, rule, chip, dot or underline, and the only type on an accent ground is ink on Senja at **4,56:1** (the primary button and the wall index chips). |
| Hero field + plate | **Pass** | Ten hard-stop bands on a 112° axis; the Semanggi plate is masked at the reading edge and blended `luminosity`; the mark is repeated at hoarding scale. The copy sits on one 620px tinted plate — cream on the worst band measures **5,20:1** at 0.55 tint, **5,64:1** at 0.58 with backdrop blur — with one type colour and no accent type: a 40px/600 headline and a 10,5px eyebrow. The field tears off instead of stopping: the photograph dissolves before the floor, the last stretch is flat palette, and the hero's own bottom edge is cut on a sixteen-tooth line with paper showing through. |
| Section accents | **Pass** | Seven sections each spend one district colour as decoration — a 88×3 registration rule above the head, the numeral chip, a 7px tick on every block label, four ticks on the stats. Chip ink is a printed pair per colour, minimum **4,56:1** (ink on Senja) and **5,57:1** where ink would have failed (Laut, Menteng take pure black: tinta reads 4,34 and 4,35). No colour carries body type. |
| Stats band | **Pass** | Four columns on `repeat(4, minmax(0, 1fr))`, each column carrying its own district rail (kebayoran · doger · ancol · laut) in place of the single ink rule. `min-width: 0` plus `overflow-wrap: anywhere` means a value can never push through its column edge — measured at 1440, 1024, 900 and 390 with no dt or dd crossing a rule and `scrollWidth − clientWidth = 0`. |
| Applications wall | **Pass** | A 12-column bento — 4 + 8 on both rows at 1440, 1 + 2 at 1000, one column at 700. Each artifact sits on a 28px grid plate with a numbered caption and three token chips. The JakLingko card is drawn from scratch with the outlined Jakarta lockup (mark and wordmark as paths), not a traced bitmap. Card lift is 3px with a shadow shift, removed under reduced motion; the index chips are ink on Senja at 4,56:1. |
| Font registered | **Pass** | Plus Jakarta Sans, variable, wght 200–800, latin subset, 27 kB, embedded as a base64 data URI and applied to `body`. The page renders identically with the network off. |
| Reduced motion | **Pass** | Durations collapse, the reveal state is applied immediately, image hover transforms are removed and the app cards stop lifting. The still frame is the finished composition. |
| 390 and 1440 | **Pass** | Single column at 390; `scrollWidth − clientWidth = 0` at 390, 768 and 1440. Hero is 726px at 390 and 880px at 1440. The app wall folds at 1000 and 700. Rail hidden below 1320. Tables reflow to stacked rows. |
| Night scope | **Pass** | `html[data-jk="night"]` swaps the semantic layer only. All 46 primitives identical in both scopes; nothing is mode-prefixed. |
| Figma export | **Pass** | `figma-smoke.mjs` exits 0: **6 pages, 87 variables, 11 text styles, 10 components**. 87 = 46 primitives + 21 semantic + 12 space + 5 radius + 3 motion, exactly. |
| Photography brief vs assets | **Partial** | The brief assigns one supplied file to “Kota Tua heritage”. The file is a daytime skyline over kampung rooftops. It is captioned by content; the heritage slot is unfilled. The hero now uses the Semanggi junction plate, which is the file the brief assigned to the hero. |
| Print proof | **Open** | No pull on enamel or vinyl, no CMYK conversion tested. Senja at 3,24:1 is a screen measurement; on matte vinyl in afternoon sun it will be worse. |
| Audience testing | **Open** | No resident, driver or district officer has seen this. Every claim about clarity is a hypothesis. |

## The six published failures

Computed from the semantic layer, not from a swatch. Body text needs 4,5:1; large text
(24px+, or 19px bold) needs 3:1.

| Pair | Ratio | Therefore |
| --- | --- | --- |
| `accent` #F7481B on `surface` #F7F4EE | **3,24:1** | May be a rule, a band, a bullet, a 24px word. May not be 14px body copy. |
| `transit` #148BCD on surface | **3,41:1** | Same. Transit labels are set in ink with a blue dot, never in blue. |
| `alert` #F53D3F on surface | **3,40:1** | The alert *field* is red; the alert *text* is ink. |
| `park` #00A062 on surface | **3,08:1** | Passes 3:1 by 0,08. Graphics and 24px only. |
| `digital` #F194AF on surface | **1,99:1** | Surface only. Never type, at any size. |
| `heritage` #FCD260 on surface | **1,32:1** | Surface only. Not “hard to read” — invisible. |

This is the load-bearing finding of the whole system. Six of the nine district colours
cannot set small type on paper, and two cannot set type at all. The palette is the
client's and it is not going to change, so the rule is what makes it usable: **a
district colour is a ground, a mark, a field, a stripe — never a word.**

A seventh pair is not a district colour: **`text-faint` on paper is 4,09:1**, below
the 4,5:1 body threshold. The page now sets every tertiary label in `text-muted`
(6,29:1); the faint token remains for 24px and up. Publishing only the colours would
have hidden a real failure.

The corollary that decided the button: **white on Senja is 3,56:1 and fails**, while
**ink on Senja is 4,56:1 and passes**. So the primary button is dark-on-orange. That
is a measurement, not a taste, and it happens to look like a sign — which is the right
answer for a city.

## Round 3 — the v3.7 pass

Three surfaces were rebuilt and one colour system was added. Same tokens, same
photographs, same audit — the arguments are unchanged, but two of the three objects a
visitor remembers are now made by the system instead of around it.

**The headline stopped shouting.** At 88px/800 the hero was a hoarding competing with
a field that is already ten colours wide. It is now **40px/600 at -0,028em**, two
lines, one colour, balanced — with a **10,5px eyebrow** above it carrying *HUT ke–499
Kota Jakarta*. The anniversary does the captioning the display used to do; the field
does the shouting.

**The field is torn off instead of stopping.** The old floor was three devices
arguing: an ink slab, ten skewed chips and a second paper tear, none of them on the
field's 112° axis. Now there is no object at all. The photograph dissolves to nothing
before the floor (a second `mask-image` layer at 62→94%, composited `intersect`), the
last stretch of hero is flat palette, the scrim releases over the final 16% so the
colours being torn are palette colours and not shadow, and the **sixteen-tooth
clip-path lives on `.hero` itself** — unequal widths, 4–52px depths — so the page's
paper is what shows through the tears. The band and the skew are gone; the tear
survives as the field's own edge.

**Every section spends one district colour — as decoration.** Seven sections carry
`langit · senja · laut · ancol · daun · aspal · menteng`; the stats spend `kebayoran ·
doger · ancol · laut`. The colour appears as an 88×3 registration rule above the head,
the numeral chip, and a 7px tick on every block label. No colour ever sets body type,
and every chip ink is a printed pair rather than a nudge: **langit** cream 7,89 ·
**senja** ink 4,56 · **laut** black 5,57 · **ancol** ink 4,87 · **daun** ink 4,80 ·
**aspal** cream 10,64 · **menteng** black 5,68. The two blacks are the honest entries —
tinta on Laut Sunda reads 4,34 and on Merah Menteng 4,35, both under 4,5 for an 11px
chip.

**The stats band had lost its grid.** A regression in the first v3.7 pass deleted the
base `.stats` rule while removing the old settle strip, so the four `<div class=stat>`
stacked and the ink rule and column borders cut straight through the type. It is back
with its own drawing rather than the old one: four explicit columns, a district rail
per column (kebayoran · doger · ancol · laut) taking the place of the single ink rule,
`min-width: 0` and `overflow-wrap: anywhere` so `0,989` or `8/14` cannot cross a rule,
and tabular figures so the four values sit on one baseline.

**The card became a card.** The old plate was a poster: a 640-unit lockup on a
1000-unit card, a diagonal field that ran past the rounded corner, text scattered at
poster sizes. It is now drawn at ID-1 proportions — the ten-colour **issuer ribbon**
along the top edge, the outlined lockup at **2,9mm**, chip with contacts, contactless
arcs, the number in tabular mono, a foil disc, one Senja edge, and a Laut operator
panel with the mark knocked out of it and one right-angle route. The operator word is
21px/800 at **3,41:1** — large text, which clears 3:1. No small cream type is set on
Laut, because 8px cream on Laut reads 3,41 and would fail; the fine print moved to the
paper, where aspal-200 reads **6,29:1**.

**The board carries the same drawing.** `design/brand/jakarta/brandkit.html` is
authored at 1500 × 1125 and rendered at 2× — the field on its own 112° with the tear,
the nine ramps with computed ratios, the four stats, the section accents, the type
scale, mark sizes and the card. The card in the board is the shipped component
captured to `public/brand/jakarta/jaklingko-card.png`, not a redrawing. Render with
`CHROME_PATH=… node scripts/render-board.mjs --html design/brand/jakarta/brandkit.html
--out public/brand/jakarta/jakarta-brandkit.png --width 1500 --height 1125 --scale 2`.

## Named gaps

- **No citizen has seen it.** The palette is the client's; the argument is a designer's.
- **No print proof.** Enamel and vinyl behave differently from a screen.
- **No Pegon or Arabic script.** Plus Jakarta Sans covers Latin only. A Jakarta
  identity that cannot set a street name in Pegon is incomplete, and this one cannot.
- **No motion identity.** The durations exist; a signature transition does not. A
  deliberate omission, not a finished decision.
- **No accessibility review by a person who uses it.** Contrast is computed;
  wayfinding under glare, at 1,4 m, by someone with low vision, is not.
- **The detach gate is still red — 67/100 against Riso Co.** `senja-100` (34°) sits 0°
  from Riso's `drum-a` (35°): the same orange family, and no other part of the score
  can carry it. The campaign orange is the client's, so the arithmetic is right and
  the comparison is right; the fix is a brand decision (re-key the primary accent to
  `menteng-100`, 1°, which clears 25°) and not a token edit.
- **No stock-licence record.** The five plates are attributed to Unsplash
  contributors in the colophon but there is no `credits.json` beside them, so the
  “assets licensed” gate cannot pass as a file check.
- **The `.fig` is not in the repo.** `design/figma/jakarta/openpencil.build.js` is, and
  it needs the OpenPencil CLI, which is not installed on this machine. The Figma
  plugin (`code.js` + `manifest.json`) is the working export.
- **The export ships substitute TTFs beside the real one.** The headless rasterizer
  cannot install a font, so `design/figma/jakarta/fonts/` holds Arial, Georgia and
  Andale Mono next to `PlusJakartaSans.ttf`; the plugin names the real family and will
  use it wherever Plus Jakarta Sans is installed.

## What would have to be true to ship

A physical proof of the mark at 24px on enamel, in daylight, photographed. A reading
test of the type scale at 1,4 metres. One district office rebuilding a poster from the
tokens without help. If those three pass, the system is real; until then it is a very
well-argued proposal, which is what a design system is before it meets a bus shelter.
