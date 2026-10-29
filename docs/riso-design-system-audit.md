# Riso Co. — design system audit, v4.0 (29 Oct 2026)

**What changed.** v3.0 was "two passes, one sheet": two offset parallelograms as the mark, a
2.5px misregistration on type. v4.0 is "one pin holds the sheet": the mark is a sheet pinned at
the top and torn from the pin, the right flap 4,3 out of register. The pushpin-and-tear footer
that v3 already ended on is now the source of the identity rather than its last panel.

Rebuilt in this pass: the mark family, the lockups, the favicons, the token layer, the page
module, the data file, the six primitives, the board, the brief and the README. Removed: the old
`riso.module.css` (2,173 lines), `brand-paths.ts`, `tokens.json`, five components, the old page,
and the generator `scripts/build-riso-brand.mjs` — it wrote the v3 geometry and would have
silently overwritten the new drawings.

## This pass (hero poster, footer last)

- The hero is now **the sheet itself**: one full-bleed orange band, pinned at the top, torn
  along the bottom, printed as a poster. It reuses the footer's parts instead of inventing a
  second language — the **pin**, the **chrome row** (chevron, socials, live status, run
  number, Berlin clock) and the **tear**. The mark is printed on drum A with the reverse
  variant, because the two-drum mark cannot sit on drum A.
- The tear is a 22-tooth clip-path with **irregular depths** (2.0–4.4%); a constant amplitude
  read as a sawtooth border rather than torn paper.
- The sheet's emphasis is **paper, not the accent**: `--rs-accent` (#C22E08) on #F2542D is
  invisible, so `.heroSheet .display em` switches to vellum.
- The footer band is now the **last section (09)** and sits outside the shell, so it is edge
  to edge by being a block. Sections renumbered: tokens 07, audit 08, the sheet 09.
- Fixed: the voice block reused `.rejectList`, whose `200px 1fr` grid dropped the
  "Not: …" span into the label column. It has its own `.voiceList` now, with the bad example
  struck through under the sentence.

## Previous pass (footer band)

- Section 07's stage is now **full-bleed**: the band escapes the reading column with
  `margin-left: calc(-1 * (inset + rail + gap))` / `margin-right: calc(-1 * inset)`, where
  `--rs-inset` is the distance from the shell's edge to the viewport's edge. Measured at
  1440, 1100, 1024 and 390: the band is exactly the viewport width and the document does not
  scroll horizontally.
- The hero carries two assets up from the footer: the **pushpin** (redrawn flat, one ink, so
  it prints) sitting on the sheet's top edge, and the footer's **live status** ("taking print
  orders") as a chip with the ping ring. The pin sits outside `.stageSheet` because that
  element's clip-path would cut anything drawn above its own box.
- `pushpin-tear-footer` gained an optional `pinColor` prop; the demo passes carbon, because
  the default paints the pin in the sheet colour and a pin the colour of the paper it holds
  is not a pin.
- Fixed: the footer wrapper used `styles.specimen`, which is the **type specimen row** class
  (a 120px + 1fr grid). The footer was being laid out as a two-column table. Renamed to
  `.footerSpecimen`.

## Verified

| Check | Result | Evidence |
| --- | --- | --- |
| mark at 16 / 24 / 32 / 64 / 128 | Pass | Contact sheet rendered in Chromium at 2×; both flaps and the pin read at 32 |
| compact at 16px | Pass | Separate drawing, two shapes, wider channel, no pin |
| wordmark | Pass | Outlined from Space Grotesk; no `<text>` in any logo file |
| lockups | Pass | `lockup.svg` (carbon), `lockup-mono.svg` (paper, for dark stages), `lockup-on-drum.svg` (paper + carbon) |
| contrast | Pass | 13 pairs computed; lowest body pair 5.19:1; 3.63:1 is large-text only; two pairs published as failures |
| type | Pass | Space Grotesk display, Geist body, Geist Mono labels; display 0.98 leading, body 1.6 |
| keyboard | Pass | 2px carbon focus ring, 2px offset, on every control; the pin is `aria-pressed` and changes its words |
| reduced motion | Pass | Transitions collapse; the footer's tear keeps its still frame |
| 390 / 1440 | Pass | Single column at 390, no horizontal scroll, no clipped teeth |
| night surface | Pass | `html[data-riso='safelight']`; the drums keep their hex and the paper inverts |

Screenshots reviewed: hero, marks (dark stage), parts, the footer band, the ink grid, 390 light,
1440 safelight.

## Not verified

- **Print proof.** No pull on 270gsm vellum; drum coverage and the tear's behaviour on real stock
  are unmeasured.
- **The tear as a physical edge.** The clip-path is a simulation of a deckle, and it is documented
  as one.
- **Charts.** Two drums cannot carry a categorical scale; a four-step tint ramp does not exist.
- **Forms beyond the field.** The error summary, file field and password toggle are not built.
- **Visual regression.** No baseline images; every check above is a manual review.

## Known sharp edges

- The two-drum mark cannot sit on drum A (orange on orange is 1:1). Use `lockup-on-drum.svg`.
- `currentColor` resolves to black inside an `<img>`, so every lockup bakes its ink in. Rebuild
  with `scripts/build-lockup.mjs` rather than editing the file.
- `features/riso/brand-paths.ts` mirrors the SVG geometry by hand. If a point moves, it moves in
  both places.
