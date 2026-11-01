# Bluewater Freight — design system audit

Case 12 in the Sunnyside library. Route `/design-system/bluewater`, tokens at
`features/bluewater/tokens.json`, CSS at `features/bluewater/bluewater-tokens.css`,
board at `design/brand/bluewater/brandkit.html`.

Written against measured output, not intent. Where a check fails, the failure and
its cause are stated rather than smoothed over.

---

## 1. The idea

**Constructed**: the sea is a chart, not a picture. The system is drawn from
passage notation — waterlines, bearings, soundings, hatches — rather than from
mood photography. Photography is evidence: three plates of the same north
Atlantic light, keyed into the same near-black ground so they read as one body.

- Essence — *the wake is the only bright thing.*
- Promise — *read the passage, not the picture.*

Everything follows from the second sentence: the surface is a document, so
separations are rules, corners are square, and nothing is elevated.

---

## 2. Mark

*Hull and waterline*, drawn on a 64 grid.

| Part | Path | Fill |
| --- | --- | --- |
| Waterline | `M4 13H29V20H4ZM35 13H60V20H35Z` | ink |
| Keel (hollow, evenodd) | `M20 20C20 40 26 52 32 58C38 52 44 40 44 20ZM27 20C27 37 29 45 32 50C35 45 37 37 37 20Z` | ink |
| Passage | `M29 13H35V24H29Z` | wake |

The passage notch is the idea stated once: the wake runs from the rule down into
the hull. Reverse ink is slate `#07131F` + `#17608C` for the fog ground.

**Compact is a different drawing**, not a scaled one — filled keel, thicker rule
(10 units), wider gap, so it survives 16px:

```
M3 14H28V24H3Z  M36 14H61V24H36Z  M28 14H36V24H28Z
M18 24C18 42 24 52 32 59C40 52 46 42 46 24Z
```

Verified on `public/brand/bluewater/sheet.html` at 2× across 140 / 88 / 48 / 32 /
24 / 16. All read; compact holds at 16.

Wordmark is outlined from Archivo 620 at `-0.02` tracking (`extract-wordmark.py`),
never live text. 13 files in the family.

---

## 3. Colour

Two grounds, one signal. Dark ("deep") is the default; light ("fog") is a scope
on `<html data-bluewater="light">`, not a second palette.

| Primitive | Hex | Role |
| --- | --- | --- |
| Abyss | `#040B14` | page |
| Deep | `#08141F` | plate |
| Raise | `#0D1D2C` | raised plate |
| Ink | `#E9F1F8` | primary text |
| Haze | `#7C93A7` | secondary text |
| Wake | `#8FB6D6` | signal (dark ground) |
| Wake ink | `#04121B` | text on signal |
| Foam | `#F4F9FD` | brightest ink |
| Mist | `#EDF3F8` | fog page |
| Quartz | `#FFFFFF` | fog plate |
| Slate | `#07131F` | fog text |
| Slate mute | `#46586A` | fog secondary |
| Wake deep | `#17608C` | fog signal |

### Measured contrast (15 pairs)

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Ink on Abyss | 17.31 | AAA |
| Ink on Deep | 16.28 | AAA |
| Ink on Raise | 14.97 | AAA |
| Haze on Abyss | 6.20 | AA |
| Haze on Deep | 5.83 | AA |
| Wake on Abyss | 9.25 | AAA |
| Wake ink on Wake | 8.88 | AAA |
| Foam on Abyss | 18.64 | AAA |
| Slate on Mist | 16.74 | AAA |
| Slate on Quartz | 18.72 | AAA |
| Slate mute on Mist | 6.56 | AA |
| Wake deep on Mist | 6.08 | AA |
| Wake deep on Quartz | 6.80 | AA |
| **Wake on Mist** | **1.91** | **prohibited** |

`Wake on Mist` is published as a failing pair on purpose. The signal cannot be one
hex across both grounds — silver at 1.91:1 is not a text colour — so the fog scope
darkens the signal to `#17608C` (6.08:1). The failing measurement is the evidence
for that rule, so it stays in the tokens rather than being quietly replaced.

---

## 4. Type

| Role | Family | Use |
| --- | --- | --- |
| Display | Archivo 600 | headlines, figures, wordmark source |
| Reading | Inter | body copy, interface |
| Mono | Geist Mono | labels, kickers, tabular numbers |

Archivo was chosen because the library's other display faces are Syne, Space
Grotesk, Bodoni Moda, Geist, Sora, Instrument Sans and Plus Jakarta Sans —
Archivo is the only grotesque in that set with a true condensed-adjacent width
and a 600 that holds at 74px without looking like a UI button.

Scale runs 16 → 74 with `-0.042em` tracking at the top and `0` at body. Numbers
are tabular everywhere they sit in a column.

### The specimen (`#type`)

The type section is a specimen, not a caption. Each voice gets one row:

| Column | Contents |
| --- | --- |
| rail | voice name, family, weights, tracking, leading — all mono, all measured |
| stage | the sample set at the size it ships, then two paragraphs of argument |

Three voices, three samples:

- **Archivo** — `North Atlantic` at `clamp(2.2rem, 5vw, 3.6rem)`, 620, `-0.03em`.
  Floor: never below 20px; the counters close and it stops reading as signage.
- **Inter** — `The passage clears Ushant at 04:12 and holds 18 knots.` at 22px/1.45,
  capped at 34ch. Floor: 16px on any input, because below that iOS zooms on focus.
- **Geist Mono** — `BW-0412 · 18,240 TEU · ETA +21d` at 17px, tabular. Floor:
  never sentence case above 20px; it is a label voice, not a headline.

Below the rows: **the ladder** (every `scale-*` token read straight out of
`tokens.json` with its permitted use), **sizes + stacks** per voice, and four
rules. The rules are the argued part:

1. One tracked voice, and it is caps. Tracking exists at `-0.03em` display and
   `+0.16em` mono caps only; body copy is never tracked.
2. The number is mono, the name is display, the port is Inter. Nothing is asked
   to be both legible and authoritative.
3. Measure stops at 62ch prose / 58ch lede.
4. Two weights per family, never three.

---

## 5. Tokens

Three layers, prefix `--bw-`:

- **primitive** — 13 hexes, never referenced by components directly.
- **semantic** — `--bw-surface-page/plate/raise`, `--bw-text-primary/secondary/bright`,
  `--bw-accent`, `--bw-accent-ink`, `--bw-on-photo`, `--bw-line`, `--bw-line-strong`,
  `--bw-field`, `--bw-grid`, `--bw-scrim`, `--bw-focus-ring`.
- **component** — `--bw-btn-*`, `--bw-field-*`, `--bw-row-hover`, `--bw-rule`,
  `--bw-chart-line`, `--bw-topbar-bg`.

Geometry: `radius-none 0`, `radius-line 1px`, `radius-sm 2px`, `radius-pill 9999`.
Focus ring is `2px` at `outline-offset: 2px` — offset is part of the DNA, not an
afterthought.

---

## 6. Sections

`crossing` (full-bleed hero), `charter`, `grain`, `keel`, `signal`, `type`,
`manifest`, `wake`, `chart`, `survey`. Ten sections, all named for passage work;
none reuse the vocabulary of a sibling case.

Three sections carry a **side plate** — a 4:5 crop keyed down to the same abyss,
sticky beside the reading column:

| Section | Plate | Crop | Key |
| --- | --- | --- | --- |
| `charter` | `side-charter.webp` | ship on the horizon, right third of the hero | brightness 0.55, chroma 0.50 |
| `keel` | `side-keel.webp` | hull and churn, left third of the wake plate | brightness 0.62, chroma 0.55 |
| `signal` | `side-signal.webp` | open water, 58% across the horizon plate | brightness 0.92, chroma 0.80 |

They are crops of the three supplied photographs, not new art: the brief gave
three plates, so the system reuses them rather than inventing a fourth look.
Below 900px each plate un-sticks and drops to a single column.

### The footer

The closing band sits on `footer.webp` — a 16:9 crop of the horizon plate,
brightness 1.05, chroma 0.78 — with a four-stop scrim from `--bw-abyss` at the
top (`0.9` at 30%, `0.52` at 58%, `0.66` at 100%) so the photograph reads as a
photograph and the luminous lockup clears AA.

Only the **brand block** sits on the plate. The waybill rail and the colophon sit
on solid `--bw-abyss` inside `.footerRailWrap`, and that is a deliberate retreat:
sampling the rendered band found the photograph reaching `(158,179,193)` behind
the note text, where `--bw-on-photo-muted` `#A9BECD` measures **1.13:1**. Mono
caps at 11px cannot be promised over arbitrary photo luminance, so the rule is
photo behind the mark, solid ground behind the words. Both are honest; only the
second is measurable.

Footer copy uses `--bw-on-photo-muted` `#A9BECD` on abyss — **10.28:1**. Not
Haze: Haze is 6.20:1 and the band needs the plate's own weight.

The mark in the footer is pinned to the **luminous** ink in both ramps — the
reverse files are slate for light grounds and would vanish into this plate:

```css
:global(html) .footer .lockup img:first-child { display: block; }
:global(html) .footer .lockup img:last-child  { display: none; }
```

The hero is full-bleed by construction:

```css
.crossing {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  min-height: min(92svh, 900px);
}
```

---

## 7. Detachment — measured against every sibling

Floor is 70. `detach-check.mjs` scores hue 25 · value 15 · material 15 · geometry
15 · type 10 · structure 10 · copy 10.

| Against | Score |
| --- | --- |
| Cove | **77** (weakest) |
| Strand | 84 |
| Riso Co. | 84 |
| Porphyry | 84 |
| Ledger | 88 |
| Hachure | 88 |
| Vitrine | 89 |
| Jakarta | 96 |

Cove is the weakest because both systems run a cool near-black ground and land on
the same mean lightness (L 0.55). Bluewater separates on everything else:
constructed track, 1px chart rules instead of glass panels, zero radius, and an
Inter/Archivo pairing rather than one grotesque.

---

## 8. Gates

```
PASS  detach         weakest 77/100 vs Cove (min 70, 11 compared)
PASS  display face   differs from every compared system
PASS  palette        13 primitives match the CSS
PASS  font           3 alias(es): --font-archivo, --font-inter, --font-geist-mono
PASS  contrast       15 pairs recomputed, all ratios match, 1 failing pair published
SKIP  assets         no stock assets
SKIP  export         not exported yet
```

Rendered QA (`qa.mjs`, 1440 + 390, both grounds, reduced motion):

```
PASS — 20 pass, 0 warn, 0 fail
```

Covers: theme switching round-trip, no horizontal overflow at 390, no shader
state, input `font-size` at 1rem (below 16px iOS zooms the viewport on focus),
no console or page errors, no failed requests, reduced motion honoured.

---

## 9. Gaps and known false negatives

1. **`score-mark.py` 16px contrast — fails, and it is the checker that is wrong.**
   The script rasterises `mark-compact.svg` at 16px over `#ffffff` and requires a
   luminance spread ≥ 0.10. Bluewater's ink is `#E9F1F8`; on white that measures
   0.045. Cove's ink is `#E9F0FF` and measures **0.029** — cove fails the identical
   check, verified by running an instrumented copy of the script against both
   directories. Every shipped near-white-ink case in the library fails it. The
   real judgement was made on a rendered sheet at 1× and 2×.
   Fix, when someone owns the script: rasterise light inks on the abyss ground,
   since that is the ground they ship on.
2. **No Figma export.** The export gate is skipped. `board.mjs` emits drawing ops
   and `design/brand/bluewater/brandkit.html` is the renderable board (1500×1125
   at 2×), but nothing has been pushed to a Figma file.
3. **Mark on photography is only half solved.** The footer and the hero both pin
   the *luminous* ink over a plate, which is correct there because both grounds
   are dark. There is still no third reverse for a light photograph — over the fog
   ramp the mark has no version that works on, say, a bright midday plate. The
   footer override is a local patch, not a documented ink.
4. **No motion vocabulary for the chart.** `CHART` animates a single path draw and
   that is the whole motion story. A system called "constructed" should probably
   have a rule for how a bearing appears.

---

## 10. Files

| Path | What |
| --- | --- |
| `features/bluewater/tokens.json` | tokens, contrast, DNA, mark spec |
| `features/bluewater/bluewater-tokens.css` | `--bw-` declarations, `.bw-scope`, fog override |
| `features/bluewater/bluewater-data.ts` | all page copy and data |
| `features/bluewater/bluewater.module.css` | the case sheet |
| `features/bluewater/components/brand.tsx` | mark, lockup, stacked, wordmark |
| `features/bluewater/components/theme-toggle.tsx` | deep / fog ramp |
| `app/design-system/bluewater/page.tsx` | the route |
| `scripts/build-bluewater-marks.mjs` | mark family generator |
| `public/brand/bluewater/` | 13 SVGs, sheet, 3 plates, 3 side plates, footer band, board PNG |
| `design/brand/bluewater/brandkit.html` | 1500×1125 board source |
| `docs/bluewater-qa.md` | rendered QA report |
