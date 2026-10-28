# Huginn — brand assets

> A picture becomes cells. A name becomes cells.

Case 03 of the design-system library. A print-first identity: Arbo's
*Åsgårdsreien* dissolved into one vermilion field by an ordered dither, and a
blackletter wordmark cut from a 22-row cell grid.

- Live case: `/design-system/huginn`
- Case library: `/design-system`
- Specimen (self-contained): `/design-system/huginn/specimen.html`
- Board: `/brand/huginn/huginn-brandkit.png`
- Audit: `/design-system/huginn/audit.md`
- Decisions: `/design-system/huginn/DESIGN.md`
- Agent twin: `/design-system/huginn/llms.txt`

## Files

| File | Use |
| --- | --- |
| `mark.svg` | primary mark, 64 × 64. Two brackets; the keystone is the field vermilion |
| `mark-compact.svg` | 32 × 32. The same two brackets at half scale, wider channels |
| `keystone.svg` | the vermilion diamond alone; the stamp and the only accent |
| `mark-mono.svg` | the same drawing in one ink; no field, no stroke |
| `wordmark.svg` | 950 × 200, 95 columns, 760 cells, one path. Outlined — never live text |
| `lockup.svg` | mark + name, 329 × 50 |
| `favicon.svg`, `favicon-{16,32,180}.svg` | the stamp at four sizes |
| `icon-{180,192,512}.png`, `apple-icon-180.png` | raster app icons, rendered from `favicon-180.svg` |
| `huginn-brandkit.png` | the board: 1500 × 1125 |
| `huginn-tokens.{css,json}` | the token layer, exported for consumers |
| `asgardsreien-1872.jpg` | the painting. Public domain |
| `asgardsreien-riders.webp` | the riders with alpha, for the footer cutout |

## The mark

Two brackets, one bridge. Two solid L-brackets face each other; the H's bridge
is a vermilion diamond keystone. The primary is never redrawn, outlined or
"cleaned up".

Clear space is the 8-unit margin the 64 box already carries, measured from the
outermost stem. The compact is the same two brackets at half scale with wider
channels. The favicon on the field uses paper for the brackets and ink for the
keystone, so it reads at 16 px.

## Colour

| Role | Value |
| --- | --- |
| Sheet | `#EBE5D8` |
| Chalk | `#F4EFE5` |
| Ink | `#100F0E` |
| Field | `#E2281B` — display and fills only |
| Accent | `#A31810` — links, buttons, small type |
| Focus | `#1B2DB0` — the ring, and nothing else |

Paper white on the field measures 4.54:1. That is the ceiling, not a target:
on the field, hierarchy comes from size and tracking, never from opacity.

## Licence

The painting is public domain (Peter Nicolai Arbo, *Åsgårdsreien*, 1872,
Nasjonalmuseet, Oslo, via Wikimedia Commons). The blackletter is drawn — no
typeface is embedded, referenced or required.
