# Case 01: Sunnyside

The worked example that sets the v2.4 bar. The files live in the repository:

- Board: `design/brand/brandkit.html` → `design/brand/sunnyside-brandkit.png`
- Brand guide: `design/brand/README.md`
- Visual reference: `design.md`
- Specimen: `https://adityahimaone.space/sunnyside`
- Manual: `https://adityahimaone.space/design-engineering`
- Cast config: `examples/configs/sunnyside-cast.json`

## Brief

Make a portfolio that feels made by a person, and make the system behind it
inspectable. It has to carry a studio landing, archive rooms, a design-system
specimen, a brand kit and a 16px favicon without becoming five different brands.

Constraints: Next.js on Cloudflare Workers; warm paper, one cobalt field; no
stock marks or generated identity; real content, real routes, real focus states;
documented as a page, not a PDF.

Direction: **a studio wall, not a template.**

## Why this is the bar

A single good mark is not a brand. Sunnyside ships a **mark system**:

1. a primary mark (the sun cut into a cobalt tile);
2. a compact drawing with fewer rays and no shadow;
3. a glyph without the tile;
4. a **hand-drawn marker wordmark**, frozen as outlines;
5. a **cast of six supporting marks** (sun, smiley, daisy, burst, heart, bolt);
6. a **four-movement marks composition** that stages the system with a logo
   card, wordmark scale, cast drawer and one usage rule.

The Vitrine v2.3 mark is a strong constructed mark, but its marks section is a
construction card plus a gate. That is the gap this example closes.

## The mark, in numbers

- 64-unit grid; 58 × 58 tile, radius 16, 2.6 ink edge.
- Sun centre 31 / 29.5, radius 16.5; 12 rays at 30°, clipped by the tile.
- 2.5 hard ink offset; bar eyes, 2.7 smile, tangerine cheeks at 55% opacity.
- Compact: 8 rays, 3.2 edges, larger sun, no shadow.
- Header: 34px mark, 10px gap, 87.7 × 25 wordmark, 8.5px name; name drops at
  480, wordmark at 360.
- Palette: `#f3ecdf` paper, `#191a2e` ink, `#3d53d6` cobalt, `#ffd23f` butter,
  `#ff6a2b` tangerine. Ink/paper 14.55:1; cream/cobalt 5.93:1.
- Board: 2400 × 1800, 8 panels, 2× → 3000 × 2250.

The numbers are not the style. They are the evidence that the drawing was
constructed, not eyeballed.

## The wordmark

The name is the site's marker alphabet, not a system font:

- a single-stroke path, 3.3 wide, round caps and joins;
- `skewX(-9)` so the hand leans;
- a 116.15 × 33.1 viewBox;
- one dot/extra path for the `i`;
- seven named paths in the logo component; no `<text>`;
- the same hand writes the logo, the footer and the section annotations.

That continuity is the cheapest identity signal on the page. A brand with a
drawn mark and a typed wordmark is half-finished.

## The cast

Six supporting marks, drawn in one material:

| Mark | Job |
| --- | --- |
| Sun | Welcome, stamp, chapter mark |
| Smiley | A friendly aside |
| Daisy | A small celebration |
| Burst | A loud note, never a headline |
| Heart | For the things worth keeping |
| Bolt | A little energy, used once |

The rule is one paragraph and it is load-bearing: **stickers are punctuation.
Never structure, never the only place a fact lives, never over type. Four to six
per composition is plenty.**

The cast is optional for corporate brands. It is not a second logo set, and it
is not a sticker pack. Each mark has one job, one cut line and one flat fill.
`scripts/cast-forge.mjs --config examples/configs/sunnyside-cast.json` draws a
starting set; the real assets are hand-refined.

## The composition

The marks section is four movements:

1. **Logo card.** Dark stage, clear-space box, lockup, rail (`Logo / 01 · mark +
   wordmark`), specs (header, minimum, clear space, favicon), icons at 48/32/16,
   two downloads, do/don't. The card is paper on a dark section; the stage is
   ink; the mark is the only loud thing inside it.
2. **Wordmark card.** One large specimen, a dashed clear-space box, a 40/24/16
   scale row, a sentence about when the hand is allowed and when the reading
   face takes over.
3. **Cast drawer.** A 12-column grid with uneven spans (4 / 5 / 4 / 3 / …). Each
   tile: the mark at 64–96, its name, its job. The uneven spans are deliberate;
   an equal grid reads as a table.
4. **Usage rule.** One paragraph in the brand voice. It is the difference
   between a sticker folder and a system.

A page with five logo variants and no wordmark, cast or rule fails the bar.
`templates/marks-section.html` is the copyable implementation.

## What to copy

- One drawn subject, cut into a field; one cut line across the family.
- A compact mark that is a separate drawing, not a scale-down.
- A drawn wordmark in the same hand as the annotations.
- A 4–6 cast with one job per mark; punctuation, not structure.
- A dark stage, paper cards, rails, specs, a drawer and a rule.
- Hard offsets and one loud field; no gradients or soft glow.
- Real copy and real numbers on every claim.

## What not to copy

- The sun, smiley, daisy and heart. They belong to a warm studio, not to every
  brand.
- The exact palette, radii and offsets. Use the brand's material.
- A cast of 12. Four to six is the bar.
- A circle as a container for an unrelated letter. In the drawn track a circle
  is allowed only when it is the subject.
- A drawn mark without a cast or a wordmark. That is a logo, not a system.

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

## What the skill takes from this case

- `references/craft-bar.md` — the two tracks, the drawn gate, the mark system,
  the Case 01 numbers and the anti-slop list.
- `templates/marks-section.html` — the four-movement composition.
- `scripts/cast-forge.mjs` — a 4–6 cast from one config.
- `references/gates.md` — the mark-system checks and the QA pass.
- `scripts/qa.mjs` — one command for audit + score + browser.

## What to improve next time

- Commit a performance baseline, not just a measurement recipe.
- Add visual regression and an automated accessibility pass.
- Add a generated-imagery pipeline with provenance, or commit to drawn imagery.
- Publish component-level docs for the UI primitives.
- Publish the motion spec.
- Extend the cast to a second product surface, not just the specimen.
