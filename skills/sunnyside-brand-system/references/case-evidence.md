# Case evidence

The first eight systems are tabled below; the cases added since follow them. This file is the precedent shelf: what each one argued,
what it shipped, and the numbers that were measured. When a decision is unclear, find the case
that already made it.

## The eight

| # | Case | Track | Material | Display | Signal | One sentence |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | Sunnyside | drawn | paper + ink | Syne | cobalt `#3d53d6` | A studio wall, not a template. |
| 02 | Vitrine | constructed | glass + dither | Space Grotesk | signal `#d9ff43` | A glass case for a low-resolution light. |
| 03 | Huginn | constructed | cells + painting | Bodoni Moda | vermilion `#e2281b` | A picture becomes cells; a name becomes cells. |
| 04 | Riso Co. | constructed | vellum + two drums | Space Grotesk | drum A `#f2542d` | One pin holds the sheet; the tear is what the second drum prints. |
| 05 | Hachure | constructed | survey paper + ridges | Geist Mono | lichen `#c9d94e` | Relief drawn by density, never by shadow. |
| 06 | Cove | constructed | blue glass + ice | Sora | lumen `#3fe3c6` | A calmer kind of depth. |
| 07 | Strand | constructed | quartz + basalt | Instrument Sans | sun `#a85a22` | Where the dunes meet the tide. |
| 08 | Clearing | drawn | painted light + glass | Iowan Old Style | emerald `#0f4a3c` | A sighting, not a sticker. |

## What the eight prove

**1 · Two tracks, chosen by subject.** Sunnyside and Clearing are drawn because their subjects
are objects (a sun, a stag). The other six are constructed because their subjects are systems
(a grid, a drum, a ridge, a plane). The track follows the subject; it is never a style choice.

**2 · Every case ships five things.** A mark family, a token layer, a proof page, a board and
an audit. A case with three of those is a logo with a moodboard attached.

**3 · One signal, and it is punctuation.** Cobalt, signal, lichen, lumen, sun, emerald. Two
loud fields on a page cancel each other, and every case states that rule and enforces it.

**4 · Two cases share a display face — a hard fail.** Vitrine and Riso Co. both set Space
Grotesk. Both shipped before the detach gate existed. Fixing it means re-cutting one of them;
it does not mean adjusting the score.

**5 · A font referenced but never registered is a fallback.** Cove declared
`--cv-font-display: var(--font-sora)` and never registered Sora in the root layout, so its
headings were the system sans on every machine without Sora. The token was right; the font was
missing. Check that every `var(--font-*)` in a token file is declared in `app/layout.tsx`.

**6 · Night is a scope, never a second palette.** Riso keeps its drums, Huginn keeps its field,
Clearing keeps its emerald. The semantic layer swaps under `html[data-<slug>]`; the primitives
do not move.

**7 · The proof page is the contract.** Each case is a route with a hero, a contents rail,
marks, colour, type, parts, a signature surface, tokens and an audit. It can be linked,
screenshotted and diffed. A PDF cannot.

**8 · The weakest pair is published.** Strand against Clearing measures **59/100**, below the
70 floor: Strand's sun sits 9° from Clearing's hart in OKLCH and the night-sun lands on the
same hue. Everything else differs — track, material, geometry, type, structure — and the score
is still on both pages rather than averaged away.

## The measured detach data

From the two cases that ran the gate across the whole shelf:

| New case | Against | Score | Finding |
| --- | --- | --- | --- |
| Strand | Cove | 81 | Hue 154° apart; different serif; four section ids do not exist in Cove |
| Strand | Vitrine | 75 | Both declare glass; separated by hue 59°, radius, labels, section order |
| Strand | Hachure | 73 | Hue 55°; hachure declares no DNA keys, so material scores neutral |
| Strand | Riso Co. | 69 | **Below floor.** Accent hues 17° apart, Riso chroma nearly double |
| Strand | Clearing | 59 | **Weakest pair.** Sun 9° from hart; every other axis differs |
| Cove | Strand | 70 | Exactly at the floor; nine of twelve section ids shared |
| Cove | Hachure | 73 | Geometry and copy carry it; Hachure has no DNA object |
| Cove | Riso Co. | 74 | Chroma nearly double Riso's; no shared section ids |

Two lessons: a score near the floor is usually a **structure** problem (shared section ids),
not a colour problem. And a case with no DNA object cannot be compared on material — the gate
should report that as a limitation, not a pass.

## Recurring decisions

These appear in three or more cases. They are safe defaults; break one only with a reason.

- **Zero radius on the loud surfaces.** Cards, fields, buttons and stages are square. A rounded
  card on a printed surface reads as an app.
- **The compact mark is a separate drawing.** Never a scaled primary: the gaps close, the
  strokes merge, the accent becomes a speck.
- **The wordmark is outlines.** Never live text.
- **One accent per view.** The accent is a verb, not a noun.
- **The audit names its gaps.** Every case lists what it could not verify (print proof, visual
  regression, a second script).
- **The board is rendered, not exported.** HTML at 1500 × 1125, local fonts, 2× capture.
- **`currentColor` never reaches an `<img>`.** Bake the ink into every lockup.

## Where the code lives

Each case is a folder under `features/<slug>/` and a route under `app/design-system/<slug>/`.
The two most useful to read first:

- **`features/clearing/`** — the drawn track done fully: a stag on a horizon, an outlined
  wordmark with a disc tittle, a five-mark cast, a glass recipe with a fallback.
- **`features/riso/`** — the constructed track with two inks: a pinned sheet torn from the pin,
  a 2.2px register ghost, a clip-path tear, and two contrast pairs published as failures.

## The eleven (measured 2026-11-01)

Facts only, from `gates.mjs` and the repo on that day; rerun `node scripts/gates.mjs --slug <slug>` before quoting any of this.

| # | Case | Track | Archetype | Material | Display | Signal | Weakest Detach | Palette & Contrast |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | **Sunnyside** (`/sunnyside`) | drawn | `minimal` | paper + ink + hard offset | Syne | cobalt `#3d53d6` | **69** vs Vitrine | 13 prims PASS · 8 pairs (2 fail) PASS |
| 02 | **Vitrine** (`/design-system/vitrine`) | constructed | `minimal` | liquid-glass + dither | Space Grotesk (H3 vs Riso) | signal `#d9ff43` | **60** vs Hachure | 16 prims PASS · 10 pairs (1 fail) PASS |
| 03 | **Huginn** (`/design-system/huginn`) | constructed | `minimal` | vermilion field + ordered cells | Bodoni Moda | vermilion `#e2281b` | **59** vs Riso Co. | 13 prims PASS · 11 pairs (2 fail) PASS |
| 04 | **Riso Co.** (`/design-system/riso`) | constructed | `minimal` | uncoated vellum + two drums | Space Grotesk (H3 vs Vitrine) | drum A `#f2542d` | **59** vs Huginn | 9 prims PASS · 13 pairs (3 fail) PASS |
| 05 | **Hachure** (`/design-system/hachure`) | constructed | `minimal` | survey stock + Bayer hachure | Geist Mono | lichen `#c9d94e` | **60** vs Clearing | 9 prims PASS · 18 pairs (2 fail) PASS |
| 06 | **Cove** (`/design-system/cove`) | constructed | `minimal` | ink-and-lumen | Sora | lumen `#3fe3c6` | **61** vs Clearing | 14 prims PASS · 12 pairs (1 fail) PASS |
| 07 | **Strand** (`/design-system/strand`) | constructed | `minimal` | sea-glass | Instrument Sans | sun `#a85a22` | **53** vs Clearing | 13 prims PASS · 12 pairs (1 fail) PASS |
| 08 | **Clearing** (`/design-system/clearing`) | drawn | `minimal` | painted glass | Iowan Old Style | emerald `#0f4a3c` | **53** vs Strand | 6 prims PASS · 8 pairs (1 fail) PASS · Figma PASS |
| 09 | **Ledger** (`/design-system/ledger`) | constructed | `ui-ramp` | tactile glass + harbor grid | Geist Sans | indigo `#19398d` | **67** vs Riso Co. | 26 prims PASS · 13 pairs (1 fail) PASS |
| 10 | **Porphyry** (`/design-system/porphyry`) | constructed | `minimal` | porphyry + marble + gold leaf | Cinzel | gold `#c9a45c` | **81** vs Clearing (PASS) | 18 prims PASS · 11 pairs (2 fail) PASS |
| 11 | **Jakarta** (`/design-system/jakarta`) | constructed | `multi-ramp` | enamel + vinyl + one orange | Plus Jakarta Sans | senja `#f7481b` | **67** vs Riso Co. | 46 prims PASS · 14 pairs (8 fail) PASS |

What the full 11-case shelf teaches:

- **Every case now ships a unified, scorable `tokens.json` and `*-tokens.css`.** All 11 cases pass `palette`, `font`, and `contrast` in `gates.mjs`, and every case publishes at least one failing contrast pair with the job it is forbidden to do.
- **Porphyry (81/100 weakest) is the detach model** and is guarded in CI (`.github/workflows/skill-check.yml`).
- **Jakarta is the Type & Foundations and Multi-Ramp model:** 9 place-named district ramps (46 primitives), `primaryAccent: "senja-100"` for detach comparison, live visual `TYPE_SCALE` rows rendered at each role's actual size/leading/tracking, and visual `SPACE_SCALE`, `RADIUS_SCALE`, `SHADOW_SCALE`, and `MOTION_SCALE` cards.
- **Historical hue clusters are honest, not hidden:**
  - *Warm Orange-Red cluster (30°–35° OKLCH):* Huginn (`#e2281b`, 30°), Jakarta (`#f7481b`, 34°), and Riso Co. (`#f2542d`, 35°) sit within 5° of each other, so their pairwise hue score is 0–5/25 even though their materials, tracks, and typography earn 67–72/100.
  - *Teal/Emerald & Sand/Amber cluster:* Cove (`#3fe3c6`, 178°) vs Clearing (`#0f4a3c`, 173°) are 5° apart; Strand (`#a85a22`, 52°) vs Clearing (`#a9713f`, 61°) are 9° apart.
  - *Historical H3 display face:* Vitrine and Riso Co. both set `Space Grotesk` (shipped before the detach gate existed).

