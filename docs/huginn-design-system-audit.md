# Huginn — design system audit, v3.0 (29 Oct 2026)

**What changed.** v2.x was two L-brackets facing each other with a vermilion diamond keystone —
an architectural diagram. v3.0 makes the studio's actual material the identity: one 14-unit cell
on a 3-unit gap, which draws the painting (ordered dither), the wordmark (22 rows) and the mark
(five cells in the grid, one that has left). The Wild Hunt footer that v2 ended on is now the
source of the system rather than its last panel.

Rebuilt in this pass: the mark family, the lockups, the favicon, the token layer, the page module,
the data file, the six primitives, the dither plate, the board and the brief. Removed: the
`iframe` specimen and its 141KB static copy (`public/design-system/huginn/`), `embed.module.css`,
the old page, `scripts/build-huginn-mark.mjs`, and the dead `X-Frame-Options` exemption in
`next.config.mjs` that existed only to let the page frame itself.

**Type.** The page adds Bodoni Moda (`--font-bodoni`, `preload: false`) as the display face. It is
the only new font family, it has one consumer, and the board carries a copy of the latin subset in
`design/brand/huginn/assets/bodoni-moda.woff2` so the PNG does not depend on the network.

## This pass (hero poster, footer last)

- The hero is now a **poster in three bands**: the painting, the field, the plate. The
  painting dissolves down into the field with the surface band's own 4 × 4 Bayer matrix, so
  the page opens the way it closes. The field carries only the display and the mark — every
  piece of small type sits on the bone plate, because 4.54:1 is not a licence to set 13px on
  the field.
- The dither is a **canvas**, not a grid of elements: at 6px cells the painting needs about
  13,000 cells and 13,000 `<span>`s is not a hero. The grid is derived from the element's own
  width, so a phone gets the same 6px screen instead of a 1.6px moiré. The image also carries
  a CSS fade, so with scripts off it thins instead of ending on a hard edge.
- The surface band is now the **last section (09)** and sits outside the shell. Sections
  renumbered: tokens 07, audit 08, the surface 09.
- Fixed: the voice block reused `.rejectList`, whose `200px 1fr` grid dropped the
  "Not: …" span into the label column. It has its own `.voiceList` now.

## Previous pass (footer band, and the animation that was not running)

- **The Wild Hunt footer had never animated.** `swashRef` was declared and passed to the
  effect's guard, but no `<svg>` in the JSX carried `ref={swashRef}`, so `swash` was always
  null and the effect returned before it did anything: no dither, no wordmark, no grain, no
  entrance, no IntersectionObserver. One `ref` restores all of it — the canvas now sizes
  itself, `is-in` lands, and the dissolve paints.
- Section 07's stage is now **full-bleed** (`--hg-inset` + rail + gap on the left, inset on
  the right). Measured at 1440, 1100, 1024 and 390: exact viewport width, no horizontal
  scroll.
- The hero carries three assets up from the footer: the **painting** (`asgardsreien-1872.jpg`),
  the **dither** (a 64 × 20 markup overlay driven by the same 4 × 4 Bayer matrix, so the hero
  and the surface cannot drift apart), and the **sigil** from the colophon.
- The footer's chrome text is now set in the mono face; it was inheriting the Didone, which
  is a display face and cannot set 10px uppercase labels.

## Verified

| Check | Result | Evidence |
| --- | --- | --- |
| mark at 16 / 24 / 32 / 64 | Pass | Contact sheet at 2×; the cell cluster and the escapee read at 32 |
| compact at 16px | Pass | Separate drawing, three cells at 8 units, wider channel |
| escapee | Pass | 6 units off-grid in every variant, including the one-colour stamp |
| wordmark | Pass | 22 rows of cells, outlined; no `<text>`, no blackletter font anywhere |
| lockups | Pass | `lockup.svg` (ink), `lockup-reverse.svg` (bone, for the field and dark stages) |
| contrast | Pass | 11 pairs computed; lowest large-text pair 4.15:1; one pair published as a failure |
| dither plate | Pass | 22 × 22 cells from a 4 × 4 Bayer matrix, rendered in markup with no JavaScript |
| keyboard | Pass | 2px cobalt focus ring, 2px offset; the cell switch is `aria-pressed` and changes its words |
| 390 / 1440 | Pass | Single column at 390, no horizontal scroll, the field plate keeps its rails |
| night surface | Pass | `html[data-huginn='night']`; the field keeps its vermilion and the paper inverts |

Screenshots reviewed: hero, the dissolve (both plates), marks (dark stage), parts, the footer
surface, 390 light, 1440 night.

## Not verified

- **Print proof.** No pull on uncoated stock; field coverage and the dither as a separation are
  unmeasured. The dither is a canvas and a markup plate, not a halftone screen.
- **The footer's animation on low-power devices.** Reviewed at 1440 only; the dissolve's cost on
  a mid-range phone is not measured.
- **Forms beyond the slip.** The error summary and file field are not built.
- **A second script.** The cell drawing is Latin-only.
- **Visual regression.** No baseline images.

## Known sharp edges

- The escapee must not be snapped to a 14px grid; place the mark by its box.
- `mark-reverse.svg` prints the escapee in the field colour, which is correct on the field and on
  a dark stage, and wrong on chalk (it disappears). On chalk use `mark.svg`.
- The footer's default image points at a CDN; the specimen passes the local plate instead, because
  a brand page that needs the network to show its own artwork is not a brand page.
