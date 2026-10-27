# Case: Sunnyside

A worked example of the method. The files live in the repository:

- Board: `design/brand/brandkit.html` → `design/brand/sunnyside-brandkit.png`
- Brand guide: `design/brand/README.md`
- Visual reference: `design.md`
- Specimen: `https://adityahimaone.space/sunnyside`
- Manual: `https://adityahimaone.space/design-engineering`
- Live: `https://adityahimaone.space`

## Brief

Make a portfolio that feels made by a person, and make the system behind it
inspectable. It has to carry a studio landing, the archive rooms, a design-system
specimen, a brand kit and a 16px favicon without becoming five different brands.

Constraints: Next.js on Cloudflare Workers; warm paper, one cobalt field; no
stock marks or generated identity; real content, real routes, real focus states;
documented as a page, not a PDF.

Direction: **a studio wall, not a template.**

## Decisions

1. **One paper world, two wings.** Side A is the studio wall; the archive is the
   back room. Same shell, same tokens, different density.
2. **Tokens before components.** Namespaced `--ss-*` values; CSS and JSON
   exported from the specimen.
3. **Draw the marks.** Sun, marker, logo and favicon are code or SVG. No image
   assets in the identity.
4. **The specimen is the contract.** When the prose and the page disagree, the
   page wins.
5. **Docs ship with the product.** `design.md`, the brand guide, the README and
   the design-engineering manual.
6. **Design sources live in the repo.** Pen.dev `.pen` files, a manifest and 2×
   exports in `design/`.

## The mark, in numbers

- 64-unit grid; 58 × 58 tile, radius 16, 2.6 ink edge.
- Sun centre 31 / 29.5, radius 16.5; 12 rays at 30°, clipped by the tile.
- 2.5 hard ink offset; bar eyes, 2.7 smile, tangerine cheeks at 55%.
- Compact: 8 rays, 3.2 edges, larger sun, no shadow.
- Header: 34px mark, 10px gap, 87.7 × 25 wordmark, 8.5px name; name drops at
  480, wordmark at 360.
- Palette: `#f3ecdf` paper, `#191a2e` ink, `#3d53d6` cobalt, `#ffd23f` butter,
  `#ff6a2b` tangerine. Ink/paper 14.55:1; cream/cobalt 5.93:1.
- Board: 2400 × 1800, 8 panels, 2× → 3000 × 2250.

## What worked

- The mark survives 16px because the compact variant is a separate drawing.
- The hard offset and the cropped rays make a simple sun feel cut, not emoji.
- The board is HTML, so the type and the mark are exact and repeatable.
- The specimen and the brand guide make the system inspectable without a PDF.
- A raw Markdown twin makes the docs usable by agents.

## What to improve next time

- Commit a performance baseline, not just a measurement recipe.
- Add visual regression and an automated accessibility pass.
- Add a generated-imagery pipeline with provenance, or commit to drawn imagery.
- Make the Pen.dev loop live (brief → frame → code) rather than manual.
- Publish component-level docs for the UI primitives.
- Publish the motion spec.

## How this skill came from the case

The method is the generalisation:

- the brief and the direction → `references/brief.md`
- the six concepts and the 64 grid → `references/logo-system.md`
- the 3 × 3 board and the images → `references/board-and-images.md`
- the prompts and provenance → `references/image-direction.md`
- the tokens and the docs → `references/tokens-and-docs.md`
- the ship checklist → `references/verification.md`
