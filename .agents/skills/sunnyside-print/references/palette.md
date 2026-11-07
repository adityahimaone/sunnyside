# The palette, the type, the voice

Six colours and two faces. Every value here is copied from the live site
(`features/landing-page/studio/studio.module.css`) and every ratio is measured, not chosen.

## Colour

| Token | Hex | Job |
| --- | --- | --- |
| `--paper` | `#f3ecdf` | The page ground. Warm, uncoated. |
| `--paper-hi` | `#fffaf1` | The raised sheet: cards, sticker stock, text on cobalt. |
| `--paper-lo` | `#e9dfcf` | Sunken panels. Rare. |
| `--ink` | `#191a2e` | Every word, every rule, every die-cut edge. |
| `--muted` | `#5f5b6e` | Captions and footnotes only. |
| `--cobalt` | `#3d53d6` | The one loud field. A sleeve ground, a poster ground. |
| `--cobalt-ink` | `#2c3cae` | Cobalt as type on paper. |
| `--tangerine` | `#ff6a2b` | Evidence: the orbit line, the disc, a sticker. |
| `--butter` | `#ffd23f` | Evidence: rays, a specimen ground, a sticker. |
| `--pink` | `#ffb6e1` | Evidence, low weight. |
| `--mint` | `#b7e4c7` | The second sleeve ground. |
| `--sky` | `#a9c8ff` | Rare. Behind glass, never as text. |

### Measured pairs

| Pair | Ratio | Verdict |
| --- | --- | --- |
| paper-hi on cobalt | 5.93:1 | AA — the only text pair on the cobalt field |
| ink on cobalt | 2.77:1 | **Fail** — never set ink on cobalt |
| tangerine on cobalt | 2.16:1 | **Fail** — graphics only, never a word |
| butter on cobalt | 4.27:1 | Large text only |
| ink on tangerine | 5.98:1 | AA |
| ink on butter | 11.84:1 | AAA |
| ink on mint | 12.16:1 | AAA |
| ink on pink | 10.61:1 | AAA |
| ink on paper | 14.55:1 | AAA |
| ink on paper-hi | 16.44:1 | AAA |
| paper-hi on ink | 16.44:1 | AAA — the inverted ground |
| muted on paper-hi | 6.30:1 | AA — captions |

The two failures are the ones that matter. A cobalt sleeve takes paper-hi for its shout and
for both labels, and nothing else. If a design needs ink on cobalt, the field is wrong, not
the ink.

## Type

| Role | Face | Weight | Size on a 640-wide print |
| --- | --- | --- | --- |
| Shout | Syne | 800 | 9% of the width (58px), line 0.86, tracking −0.06em |
| Shout, sleeve | Syne | 800 | 20.5% of the width, line 0.7, tracking −0.085em |
| Sub-head | Syne | 800 | 1rem, tracking −0.03em |
| Label | Geist Mono | 400–500 | 8px, tracking 0.16–0.18em, uppercase |
| Caption | Geist Mono | 400 | 8px, tracking 0.14em, `--muted` |

Two faces, three sizes, no third voice. Syne shouts and Geist Mono annotates; anything else
is a different print.

Both faces are OFL and ship in `assets/`. The sleeve embeds Syne as base64 because an SVG
opened as an image cannot load an external font; the print references both by relative path
because it is always rendered next to its assets.

Fallbacks, in order: `'Syne', 'Space Grotesk', system-ui` and `'Geist Mono', ui-monospace,
SFMono-Regular, Menlo, Consolas`. Space Grotesk is a different width — a sleeve rendered
without Syne will look right but measure wrong, so keep the font next to the script.

## Voice

The labels are not captions; they are the printer's annotations.

- **Catalog line** — `AH—003 / generated sleeve`. An index and what the thing is. Em dash, no
  spaces around it, uppercase.
- **Note** — `peer to peer / settle`, `grown, not assembled`, `cut, don't tear`. Six words at
  most, lowercase, a slash or a comma where a sentence would go. It states a fact about the
  artefact, never a benefit.
- **Kicker** — `est. 2026`, `2025`, `No. 001`. A date or a number, never both.

Not: "Designed with love", "A new way to trade", "Explore the collection". If the label could
appear on a different brand's card, it is not a Sunnyside label.
