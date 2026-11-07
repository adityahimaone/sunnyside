---
name: sunnyside-thumbnail
description: 'Generate Sunnyside "generated sleeve" thumbnails — the flat-colour card with a dot screen, two mono micro-labels, one oversized word, a thin ring and a single geometric ornament. Use when a project, post, case study or page has no screenshot and needs a cover that looks designed rather than empty: work-gallery tiles, project cards, OG/social images, blog covers, album art, favicons, or placeholder art for a list. Outputs a self-contained SVG plus PNG/WebP at any size or ratio, or an in-app React component.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '1.0'
---

# Sunnyside thumbnail — the generated sleeve

When a portfolio item has no screenshot, the temptation is a grey box or a
gradient. This skill draws the alternative the Sunnyside site already uses: a
**generated sleeve** — flat ground, dot screen, two mono labels, one enormous
word, one thin ring, one geometric ornament. Zero images, deterministic, and it
reads as art direction rather than a fallback.

The style is not invented here. It is lifted from `GeneratedCover` in
`features/landing-page/studio/work-gallery/`, where it renders the SeaPhantom
P2P and Labgrownbeasts cards, and every measurement in
`references/recipe.md` was taken off that card at 349 × 218.

## The idea in one line

**A record sleeve for something that has no photograph.** The word is the
subject, the mono labels are the catalogue data, and the ornament is the one
piece of evidence that this is a technical object.

## When to use it

- A project card, gallery tile or list row with no image of its own.
- OG / social / email cards where a screenshot would be illegible at 1200 × 630.
- Blog or note covers, album art, favicon-scale placeholders.
- A whole set that must look like one family — the seed keeps it consistent.

## When not to use it

- The item **has** a real screenshot. Use it. This is the fallback, not the
  default — the site only draws generated art when `cover` is empty.
- The word needs to be a full title. This is a sleeve, not a poster; 2–6
  characters, one word.
- The brand already owns a photographic or gradient system. Do not mix.

## Quickstart

```bash
# one sleeve, deterministic from a slug (palette + ornament picked for you)
node scripts/make-sleeve.mjs --seed seaphantom-p2p \
  --word P2P --code "AH—005" --note "peer to peer / settle" \
  --out out/seaphantom-p2p

# choose everything explicitly
node scripts/make-sleeve.mjs --word LAB --code "AH—006" \
  --note "grown, not assembled" --variant petri --palette mint \
  --width 1600 --ratio 16:10 --out out/labgrownbeasts

# a 1200 × 630 social card, square album art, an OG image
node scripts/make-sleeve.mjs --word ORBIT --palette ink --ratio 16:9 --width 1200 --out out/og
node scripts/make-sleeve.mjs --word WAVE  --palette pink --ratio 1:1  --width 1200 --out out/album

# what can I pick from?
node scripts/make-sleeve.mjs --list

# every palette × ornament as one sheet, for choosing
node scripts/contact-sheet.mjs --out out/sheet.png
```

Writes `<out>.svg` (self-contained, fonts embedded) and, when Playwright is
present, `<out>.png` + `<out>.webp`.

| flag | meaning |
| --- | --- |
| `--word` | the oversized word. 2–6 characters. Falls back to initials of `--title`. |
| `--code` | top-left catalogue line, e.g. `AH—005`. Suffixed `/ GENERATED SLEEVE`. |
| `--note` | bottom-left line. Lowercase is uppercased for you. |
| `--variant` | `orbit` or `petri`. Default `orbit`. |
| `--palette` | a key from `--list`. Default `cobalt`. |
| `--seed` | a slug. Picks palette + variant deterministically instead. |
| `--ratio` | `16:10` (default), `1:1`, `4:3`, `16:9`, `3:2`, `2:1`, `4:5`, or a number. |
| `--width` | output width in px. Default 1600. |
| `--radius` | corner radius in viewBox units (1000-wide space). Default 0. |
| `--suffix` | override the `/ GENERATED SLEEVE` tail. `--suffix` alone drops it. |
| `--svg-only` | skip rasterising. |

## The anatomy

Five parts, painted in this order. Nothing else goes on the card.

1. **Ground** — one flat colour. No gradient, no vignette, no shadow. Ever.
2. **Dot screen** — `1.8`-unit dots on a `25.8`-unit grid at `12%` opacity, drawn
   in the *ink* so it inverts with the ground. This is the only texture.
3. **Ring** — a `0.41W` circle centred at `(0.77W, 0.604H)`, stroke `0.0057W`, at
   `45%`. Mostly off-card, so it reads as an arc. It is structure, not decoration:
   it is always behind the word.
4. **Ornament** — `orbit` or `petri`, at full accent strength. One per card.
5. **Type** — the word at `0.22W` in Syne 800 with `-0.085em` tracking, plus two
   mono labels at `0.0215W` with `0.16em` tracking and `78%` opacity.

Type positions, as fractions: code baseline `0.128H`, word baseline `0.612H`,
note baseline `0.903H`, all on a `0.055W` left margin. The word sits on the same
margin as the labels — do not inset it further, the left sidebearing already
provides the optical gap.

## The two ornaments

- **`orbit`** — a `0.82W` line in the accent at `-24°`, centred `(0.65W, 0.57H)`,
  with a small ringed dot at each end filled in the ground colour. Reads as a
  trade, a transfer, a route. Use for anything with two sides.
- **`petri`** — two ringed cells at `r = 0.19W` and `0.095W`, each filled with a
  soft radial accent glow at `38% / 34%`, `75%` opacity. Reads as something
  grown. Use for organic, scientific or editorial subjects.

Adding a third ornament is allowed — see `references/variants.md` for the rules
(a single shape, accent-coloured or ink-ringed, never two ideas at once).

## Palettes

Eight grounds, each with a fixed ink and one accent. All of them clear **4.5:1**
for ink-on-ground; `make-sleeve --list` prints the measured ratio and flags
anything that slips.

`cobalt` · `mint` · `ink` · `paper` · `butter` · `pink` · `sky` · `tangerine`

Values come from the studio wall (`features/landing-page/studio/studio.module.css`).
Do not invent a ninth ground outside that palette; the sleeve has to sit beside
the rest of the page.

## Picking the word

- 2–6 characters, one word, uppercase. `P2P`, `LAB`, `ORBIT`, `WAVE`.
- It is **clipped, never scaled down**. An 8-character word fills the card edge
  to edge and that is the correct behaviour — the crop is part of the look.
- Never a full title, never a sentence, never the client's legal name.
- The word is the one thing a reader remembers; pick the concept, not the brand.

## In-app version

To draw the same sleeve inside a React app instead of as a file — same geometry,
same CSS custom properties, seeded from the slug — use the component and the
module CSS in `references/react.md`. That file is the original, running source;
the SVG script is the port.

## QA

Before shipping a set, check four things. `references/qa.md` has the method.

1. Ink-on-ground ratio is printed and ≥ 4.5:1.
2. The word's bounding box lands at `x 0.073W → 0.72–0.75W`, `y 0.387H → 0.610H`
   for a 3-character word. That is the calibration; drift means a font or a
   metric changed.
3. The ornament never covers a label, and the ring never crosses the word's cap
   height in a way that muddies it.
4. A set of six cards reads as one family: same margins, same dot density, same
   label size — only ground, word and ornament change.

## Gotchas

- **The ring's vertical centre is `0.604H`, not `0.76H`.** The source CSS says
  `bottom: -26%`, which resolves against the *height*, not the width. Getting
  this wrong drops the arc a third of a card too low and it misses the top edge.
- **Embed the fonts in the SVG.** Syne and Geist Mono are not system faces; an
  SVG that names them without an `@font-face` falls back to Helvetica and the
  card stops looking like itself. `make-sleeve` inlines both as base64.
- **`letter-spacing` on a left-anchored SVG `<text>` adds a trailing gap** after
  the last glyph. Harmless here (nothing follows), but do not centre-anchor
  tracked text without compensating.
- **The dot screen is drawn in the ink at 12%.** Drawing it in white looks
  correct on cobalt and invisible on mint. Always currentColor.
- **No `overflow: visible`.** The word, the ring and the orbit line are all
  meant to bleed past the edge. Clip the whole group to the card.
- **`sharp` may be absent.** The script then writes PNG only and says so; do not
  treat a missing `.webp` as a failure.

## Files

```
SKILL.md                     this file
references/recipe.md         the measured spec, and where each number came from
references/variants.md       orbit, petri, and how to add a third
references/react.md          the in-app component + module CSS
references/qa.md             how to verify a set
scripts/make-sleeve.mjs      SVG + PNG/WebP generator
scripts/contact-sheet.mjs    every palette × ornament on one sheet
assets/fonts/                Syne + Geist Mono (woff2, variable)
examples/                    the two reference cards, reproduced
```
