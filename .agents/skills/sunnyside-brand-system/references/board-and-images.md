# The board and the guideline images

The board is the review artefact: one image that proves the brand can hold a
logo, a palette, type, an application and a point of view. It is also the
document that gets shared when nobody opens the source file.

## 1. Build it as HTML, not as a generated image

A brand board has exact type, exact spacing and the brand's real assets. An image
model will misspell the name, redraw the mark and flatten the type. Render HTML
with Playwright instead:

- you control the type, the kerning and the grid;
- the mark is the real SVG;
- the board is repeatable when a colour changes;
- the source is editable and diffable;
- there are no generated artefacts on the logo.

Use an image model for the **atmosphere panel**, photography or texture — never
for the logo, the wordmark, the type or the layout. See
`image-direction.md`.

## 2. Canvas and grid

| Setting | Value |
| --- | --- |
| Canvas | 2400 × 1800 (4:3) |
| Outer padding | 54px |
| Columns | 3, gap 14px |
| Rows | 3, gap 14px |
| Panel radius | 18px |
| Export | 2× → 4800 × 3600, downscale to 3000 × 2250 |
| Outer canvas | deep ink / charcoal, not the brand paper |
| Type | the brand's display + mono; body at 14–18px minimum |

The 3 × 3 map:

1. **Cover** (spans 2 columns): lockup, one line, version, date.
2. **Index / positioning** (1 column): the one-sentence idea or a giant initial.
3. **Construction**: the mark on a grid with guides, measurements, specs.
4. **Digital application**: navbar/browser frame, real proportions.
5. **Colour**: swatches with names, hex and role.
6. **Type**: one large specimen + two working voices.
7. **Application / icon**: favicon sizes, tab, app icon, sticker.
8. **Image direction**: the atmosphere panel, one loud field.
9. **Essence** or a second application: a quiet final panel.

Do not make every panel equally loud. The rhythm is: quiet cover, functional
application, technical construction, colour, type, playful icon, loud
atmosphere, quiet essence. One loud field is enough.

## 3. Text rules

- Brand name, one tagline, one URL, 2–5 section labels, short captions.
- No paragraphs, no fake body copy, no lorem, no menu lists.
- A label at 2400px is ~14–16px; do not go below 12px. The image will be viewed
  at 1200px wide, so 12px becomes 6px.
- Keep labels in mono, headlines in display. Do not set a paragraph in the
  display face.

## 4. Assets and fonts

- Use the real SVG mark and wordmark. Do not paste a PNG into the board.
- Load the brand fonts locally with `@font-face`; a board that depends on Google
  Fonts can fail offline or render a fallback.
- Use real project screenshots only if they are the brand's actual product.
  Otherwise use a UI frame built from the system.
- Keep the source assets next to the board: `design/brand/assets/`.
- The board is a build artifact; keep the HTML and the assets, not only the PNG.

## 5. Render

```bash
# from the repo root
node scripts/render-board.mjs \
  --html design/brand/brandkit.html \
  --out design/brand/sunnyside-brandkit.png \
  --width 2400 --height 1800 --scale 2

# downscale for the web
python scripts/downscale.py design/brand/sunnyside-brandkit.png 3000 2250
```

`scripts/render-board.mjs` uses Playwright. It waits for `document.fonts.ready`
and for the page to settle, then screenshots the viewport at the exact size.
Install Playwright if needed:

```bash
npm i -D playwright
npx playwright install chromium
```

Downscale with Lanczos, not nearest. A 3000px board is enough for a web deck and
keeps the file around 500–800 KB.

## 6. The image QA pass

Before shipping the board:

- [ ] view at 100%: every label is readable, nothing clipped;
- [ ] view at 50%: the hierarchy still reads, one loud field;
- [ ] the lockup is the actual SVG, not a screenshot;
- [ ] the palette chips are opaque (a common bug: a parent opacity washes them);
- [ ] the grid and gutters are consistent;
- [ ] no placeholder text, no broken asset, no emoji as an icon;
- [ ] the board image is under ~1 MB for the web download;
- [ ] the full-resolution source is kept in the repo;
- [ ] the board is referenced by the brand guide and the design-system page.

## 7. The Sunnyside board, concretely

- 2400 × 1800, 54px outer, 14px gaps, 18px panel radius.
- 8 panels: cover (2 columns), index, construction, navbar, colour, type, icon,
  atmosphere.
- Cover: 582 × 150 lockup, "Paper, cobalt, and a little noise."
- Construction: 294px mark with dashed 64 box, r 16.5 circle, 30° rays.
- Navbar: 34px mark, 87.7 × 25 wordmark, 8.5px name, 420px browser frame.
- Colour: paper, ink, cobalt, butter, tangerine, with roles.
- Type: "sunny / side" at 104px Syne 800; 3 rows for display, label, hand.
- Icon: a tab mock at 16px, 48/32/16 marks, a sticker chip.
- Atmosphere: cobalt, a giant glyph, halftone dots, "Stay on the sunny side."
- Exported at 2× and downscaled from 4800 × 3600 to 3000 × 2250.

The source is `design/brand/brandkit.html`; the images are in
`design/brand/sunnyside-brandkit.png` and `public/brand/sunnyside-brandkit.png`
(the lighter web copy).

## 8. If the board has to be an AI image

Do not generate the whole board. Generate one panel at most, at the exact aspect
ratio, with no text or logos, then composite it into the HTML board. A generated
board will fail the one test that matters: the name.

If the client insists on an AI-generated board, the deliverable is a moodboard,
not a brand kit. Say so.

## Story panel

One of the nine panels should argue, not display: the one sentence, the mark's
argument, and the line "why the other five lost". Pull it from `story.md`. If the
board has no panel that explains a decision, it is a poster. Palette and tokens
come from `brand.json`; do not hard-code the starter's Sunnyside colours.
