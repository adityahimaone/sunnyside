# Cove — design-system audit (v2.0)

Case 09 · `--cv-*` · night-first · 29 Oct 2026
Route: `/design-system/cove` · machine-readable: `/design-system/cove/llms.txt`

This document is the audit of the shipped system, not a plan. Every number below was
produced by a script in this repository; the commands are at the end so anyone can re-run
them and get the same answer — or a different one, which would be a finding.

## Verdict

**Passes the v3.0 gate, with the detach margin at zero.**

- Constructed mark gate: 7/7. Two filled quadrilaterals, no circle, no stroke, one accent,
  six-unit channel (9.4% of the 64 grid), legible at 16px through a separate compact
  drawing.
- Contrast: 11 pairs measured, all above AA for their stated use. The lowest text pair is
  the day ramp's signal at **5.06:1** (tide on mist), which was darkened twice to get there
  — it started at 4.32:1.
- Detach: **70 / 100 against Strand**, exactly at the floor of 70. Hachure 73, Riso 74,
  Vitrine 75. Clearing is **unscored** — it ships no `tokens.json`. See § 6.
- Honesty: the readings are a fixed sample and the page says so in three places. No live
  feed is claimed.

## 1. What is new in v2.0

v1.0 was a blue liquid-glass system — one glass layer, one solid plate, a squared C, an
eleven-ink palette and Instrument Sans/Serif. It failed the detach gate against Strand on
type, material and hue. v2.0 keeps the name and the route and replaces everything else:

| | v1.0 | v2.0 |
| --- | --- | --- |
| Idea | glass over the world | the cut and the reading |
| Ramp | light-first, dark variant | **night-first**, day is the override |
| Material | one glass layer | flat panels + hairlines, one shadow |
| Display face | Instrument Serif | **Sora 600** |
| Label face | Instrument Sans | **JetBrains Mono 500** |
| Palette | 11 inks | 14 primitives, 7 semantic roles, 1 signal |
| Mark | squared C | **carved corner + nested reading** |
| Sections | generic | 12, with `tide` and `instruments` |

The two section ids no other case uses are the ones that carry the identity: `tide` is the
data layer, `instruments` is the component set that only exists to show a number.

## 2. The constructed gate (v3.0)

| Rule | Result | Evidence |
| --- | --- | --- |
| Zero circles | pass | Two quadrilaterals; both paths contain only line and close commands |
| Fill only | pass | No path in the family carries a `stroke`; the channel is negative space |
| 2–4 primitives | pass | Block + reading (2). The compact is 1 |
| One accent | pass | Lumen on the reading only, in the primary and the reverse |
| Channel ≥ 8% | pass | 6 units of 64 = 9.4% |
| Reads at 16px | pass | Compact drops the reading and thickens the arms to 25 units; verified at 16/24/32/64 |
| No live text | pass | Wordmark outlined from Sora SemiBold at −30/1000, frozen in `wordmark-path.ts` |

Rejected drawings, recorded so they are not re-attempted: the tide staff (column + two
dashes — a tuning fork at 16px), the comb (four bars — reads as an E), the wedge, the
isobath rings, the ripple pair, the mooring ring, the stepped quay, the chevron cut, and
the negative-space C.

## 3. Tokens and contrast

`features/cove/tokens.json` is the source. `scripts/generate-cove-tokens.mjs` writes
**112 declarations** into `features/cove/cove-tokens.css` and both public exports. Three
layers, strictly: primitive → semantic → component. A component may read a semantic name; a
page may read a semantic or a component name; nothing reads a raw hex.

Night is the base. `.cv-scope` carries the night ramp and `color-scheme: dark`;
`html[data-cove='day'] .cv-scope` overrides the semantic and component layers. Both ramps
declare the **same primitive names**, because a mode-prefixed primitive
(`--cv-night-plate`) breaks the semantic layer the moment someone toggles.

| Pair | Ratio | Use |
| --- | --- | --- |
| Ink on abyss | 17.19:1 | Body, headings |
| Ink on deep | 16.18:1 | Copy inside a panel |
| Haze on abyss | 7.68:1 | Captions, axis labels |
| Lumen on abyss | 12.18:1 | A live value as text |
| Abyss on lumen | 12.18:1 | Primary button label |
| Ember on abyss | 8.16:1 | Threshold, as text |
| Slate on mist | 16.47:1 | Day body |
| Slate on quartz | 18.67:1 | Day copy on a panel |
| Slate-mute on mist | 5.84:1 | Day captions |
| Tide on mist | 5.06:1 | Day signal as text |
| Quartz on tide | 5.74:1 | Day primary label |

All eleven are computed sRGB → linear → relative luminance (WCAG 2.1) inside the generator
and travel into `tokens.json`, so a palette edit cannot silently break a pair: the next run
recomputes them.

## 4. The mark, measured

```
grid      64 units, 8-unit margins
block     M8 8H56V30H30V56H8Z    48 × 48, cut 26 × 26
reading   M36 36H50V50H36Z       14 × 14, 6 units of ground on every side
compact   M8 8H56V33H33V56H8Z    one shape, arms 25 units
```

The reading's inset is 6 units on all four sides, which is what makes the channel read as
ground rather than as a stroke. The compact is not a downscale — it is a different drawing,
and the page says so, because a 14-unit block cannot survive a 3.5px gap.

Icon sizes shipped: 16, 32, 48 (ICO), 180 (apple), 192, 512, 1024. Favicons use the compact
at 16/32 and the full mark at 48.

## 5. The page

Twelve sections, all rendered, no placeholders. The skeleton follows the house pattern —
sticky topbar, contents rail, section heads, tables, tokens, audit — because that pattern is
the portfolio's, not a neighbour's identity. What differs:

- **Hero and footer are full-bleed.** The section is the viewport and the `.shell` inside it
  is the measure; the photograph is a CSS `background-image`, which is the only way to
  escape a `max-width` wrapper without a second container.
- **A reading plate in the hero.** Four readings, mono, with their times — the plate is the
  only element in the system allowed a shadow, because it floats over a photograph.
- **`tide`** draws a 24-point sample with one threshold line and five reading cards.
- **`instruments`** shows the gauge, sparkline, reading card, log row and threshold alert,
  each with its job and its rule.
- **The detach scorecard is on the page**, not only in this document, including the zero
  margin against Strand and the fact that Clearing could not be scored.

## 6. Gaps

1. **Detach margin is zero.** 70 against Strand is a pass and nothing more. The gate's
   structure dimension is what nearly fails: nine of twelve section ids are shared, because
   a specimen page has a shape. Closing this properly would mean dropping a shared section,
   and the page would get worse — so it is disclosed rather than fixed.
2. **Clearing is unscored.** No `tokens.json`, so no measurement. The claim that Cove is
   unlike Clearing is a design argument — serif against mono labels, cream against abyss,
   one pane against flat panels — not a number.
3. **No live feed.** The readings are a 24-point array. Every surface that shows them says
   "sample".
4. **The photographs are 1916 × 821.** Above 2× they upscale. The day ramp reaches them
   through a mist scrim rather than a second exposure, which is a compromise, not a
   solution.
5. **Fonts swap.** Sora and JetBrains Mono load through `next/font` with `preload: false`,
   so the hero line can swap on first paint. The wordmark cannot, because it is outlined.
6. **The compact mark is not the same drawing as the mark.** Deliberate, documented, and
   still a difference someone will file as a bug.

## 7. Reproducing the numbers

```bash
# tokens + contrast (writes 112 declarations and recomputes all 11 pairs)
node scripts/generate-cove-tokens.mjs

# detach gate
node skills/sunnyside-brand-system/scripts/detach-check.mjs \
  --new features/cove/tokens.json \
  --ref features/strand/tokens.json \
  --ref features/hachure/tokens.json \
  --ref features/riso/tokens.json \
  --ref features/vitrine/tokens.json
# → PASS 70 vs Strand · PASS 73 vs Hachure · PASS 74 vs Riso · PASS 75 vs Vitrine
# → worst pair 70/100 (threshold 70) — passes, with no margin

# form kit (fails loudly if it references a token the sheet does not declare)
node scripts/generate-cove-forms.mjs

# icons + board
node scripts/cove-icons.mjs && python3 scripts/cove-ico.py
node scripts/render-board.mjs --html design/brand/cove/brandkit.html \
  --out design/brand/cove/cove-brandkit.png --width 1500 --height 1125 --scale 2
```

Screenshots for this audit: `docs/shots/cove-1440-night-full.png`,
`cove-1440-day-full.png`, `cove-390-night-full.png`, plus per-section captures.
