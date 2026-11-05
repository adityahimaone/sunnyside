# Vesper — the brief

**Name** Vesper. The evening star; also the evening office. A lamp lit for someone
still out in the dark.

**Category** A two-ink print system for products used after dark: on-call consoles,
ledgers, runbooks, documentation nobody reads at noon.

**Audience** Design and engineering teams who ship at night and inherit each
other's screens at 3am. They do not need a brand that performs; they need one that
tells them where they are.

**Promise** Everything made with this looks printed at night, not rendered in it.

**Enemy** The AI dashboard: a frosted pane floating over a violet gradient, every
edge lit, no horizon anywhere. Expensive-looking, and it never says where you are.

**Reject it when** Anyone can say: *"it looks like every other AI product and I
cannot tell which page I am on."*

---

## Where it came from

Three surreal vintage prints were the brief: a lamppost under a stippled
starfield, a figure standing in a ringed plain, a staircase running to the
horizon. They share one grammar — **two inks, a stipple, a horizon, and a single
small figure under a very large sky**.

The system takes the grammar, not the pictures:

- the inks were sampled from the files (cobalt `#083b86`–`#2f51ae`, cream
  `#e1be91`–`#e8cba0`) and normalised to two primitives;
- the horizon became the mark's bar and the page's section rule;
- the stipple became a generated field (`field.mjs`, 60,000 marks, one seed);
- the lamppost became the cast's `lamp`, and its light became the `ray`.

## The mark

Eleven concepts were drawn across two rounds on one 64-unit grid, then ten were dropped.

The first round all stood on a wide plinth, and a head on a plinth is a trophy.
Round two removed the plinth and replaced it with the horizon. The winner is a
four-point star, 46 × 40 units, whose lower point lands exactly on a 44 × 4 bar.

- **Star** 46 wide, 40 tall, arm bow 1.6 units — sharp enough to read as a star,
  not as a leaf.
- **Bar** 44 × 4, the same weight at 16px and at eight metres.
- **Compact** a different drawing: bow 2.6, bar 40 × 5.
- **Glyph** the star alone, for 16px inline use.

The other ten lost for the reasons written beside them in
`public/brand/vesper/bakeoff/sheet.html`.

The sheet now carries a measured score as well as a reason. Eleven concepts were
rasterised at 128, 40 and 16 and put through eight pass-or-fail checks — ink
coverage at 16px, piece count, ink retained between 40 and 16, elements merging,
centroid offset, grid use, subpath count, overlap with the rest of the set. **The
chosen mark ranks fourth, not first.** Horn and Post survive downscaling better
and lost anyway, because Post reads as a door until you are told it is a lamp —
and no rasteriser can measure that. The mark keeps one red flag: its mass sits
8.4% below centre, which is what a drawing standing on a horizon is supposed to
do, and the flag is printed rather than waived. `score-bakeoff.mjs` is the
scorer; `scores.json` is its output; the audit gate refuses the table if the
shipped mark is missing from it or if it scored a clean 100.

## Four decisions

| Decision | Because | Not when | Breaks next |
| --- | --- | --- | --- |
| Two flat inks. No gradient, no glow. | A gradient is a photograph of light; a second flat ink is a print of it, and it survives a photocopy. | A photograph is the subject, not the ground. | Someone adds a radial gradient to a hero "for depth". |
| The horizon is a filled bar, never a stroke. | A 1px stroke disappears at 16px and at eight metres. | The rule belongs to a document — then it is a hairline. | A border creeps onto the mark. |
| The star is never redrawn, only re-inked. | Geometry is fixed at 64 units; a theme swaps the file, never the drawing. | The mark sits on a photograph: use `mark-reverse` at full opacity. | `filter: invert()` on the logo. |
| Square plates. One pill, and only for navigation. | A printed plate has corners; the pill floats, so it curves. | A touch target falls under 44px. | Every card rounded to 12px "to feel modern". |

## What was assumed

- **No product was named in the brief.** Vesper is a studio-grade brand kit, not
  a product identity, so the page speaks to the team that would adopt it.
- **The reference screenshot was used as a layout register, not a palette.** The
  floating pill nav, the logo bench overlapping the hero, the split button with
  an arrow tile and the bordered card grid are borrowed; the glass, the violet
  and the gradient are not.
- **The artwork is treated as a brief, not as an asset.** Nothing is traced or
  recoloured; the field is generated from the same grammar at 1600 × 900.
- **Type is licensed, not owned.** Fraunces, Archivo and DM Mono are all SIL OFL
  1.1 and are shipped locally as woff2.
