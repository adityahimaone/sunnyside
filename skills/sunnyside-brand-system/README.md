# sunnyside-brand-system

An installable agent skill for designing a brand kit **and** a design-system
guideline set from a written brief: logo family, 3 × 3 board, favicon/app icons,
tokens, documentation, and the images that document it.

It is built from the [Sunnyside](https://adityahimaone.space/design-engineering)
case: a paper-and-ink portfolio identity with a sun mark, a marker wordmark, a
compact favicon, a board rendered from HTML, and docs that are readable by
humans and agents.

## Install

From the repository:

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
```

Or point an agent that supports local skills at this folder:

```bash
npx skills add ./skills/sunnyside-brand-system
```

The skill follows the standard `SKILL.md` format. It works with any agent that
can read local skill folders; the install command is the `skills.sh` convention.

## What is inside

```
sunnyside-brand-system/
  SKILL.md                     the method, workflow and output contract
  references/
    brief.md                   the one-page brief and review gates
    logo-system.md             concepts, grid, family, favicon, tests
    board-and-images.md        the 3 × 3 board and the render pipeline
    image-direction.md         prompts, provenance and QA for generated images
    tokens-and-docs.md         token layers and agent-readable docs
    verification.md            the ship checklist
  scripts/
    render-board.mjs           HTML board → PNG (Playwright)
    render-icons.mjs           SVG → exact-size transparent PNGs
    favicons.py                PNG → favicon ICO, apple and app icons (Pillow)
    downscale.py               Lanczos downscale for the web copy
    extract-wordmark.py        shaped text → SVG outlines (fontTools + HarfBuzz)
  templates/
    brandkit.html              a 3 × 3 board starter
    guidelines.md              a brand-guide starter
  examples/
    sunnyside.md               the case, in numbers, with links
```

## Quick start

```bash
# render the starter board at 2×
node scripts/render-board.mjs \
  --html templates/brandkit.html \
  --out brandkit.png \
  --width 2400 --height 1800 --scale 2

# make a web copy
python scripts/downscale.py brandkit.png brandkit-web.png 3000 2250
```

Prerequisites:

```bash
npm i -D playwright && npx playwright install chromium
pip install pillow fonttools brotli uharfbuzz
```

## The method in one screen

1. Write the brief and the one-sentence direction.
2. Explore six marks; keep one; write down why the others lost.
3. Build the mark on a 64 grid, plus a separate compact mark for 16px.
4. Set the wordmark in outlines, then build the family and the responsive lockup.
5. Build the 3 × 3 board in HTML/CSS; render it at 2×; downscale.
6. Generate only the atmosphere/photography that needs to be an image; keep
   provenance; never generate the logo, type or board.
7. Build the favicon/app icon set and test at 1×.
8. Ship tokens and docs that are readable without JavaScript, with a raw
   Markdown twin.
9. Verify every size, contrast pair and link; name what is missing.

## What this skill refuses

- AI-generated logos, wordmarks, type specimens or whole boards.
- Live text as the wordmark.
- A mark that only reads at poster size.
- Boards with no exportable assets.
- Guidelines that live only in a PDF or a Figma file.
- Invented metrics or fake case studies.

## Publish to skills.sh

The skill is a normal GitHub-backed skill. Once the repository is public and the
folder is on the default branch, it can be listed and installed with the command
above. If you maintain a fork, replace the owner in the command.

## Credits

The method, the Sunnyside case and the templates are by
[Aditya Himawan](https://adityahimaone.space). The craft references that inform
the review pass are from [Craft](https://craft.gustavofior.com).
