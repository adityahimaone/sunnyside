# Research: neighbours, DESIGN.md, free assets

Used at step 3 (study the category) and step 8 (a photograph or icon). Skip both for a case
with no category and no imagery.

## Studying the category

```bash
node scripts/brand-ref.mjs search fintech payments     # find brands
node scripts/brand-ref.mjs near --hue 275 --within 25  # who already owns this hue
node scripts/brand-ref.mjs pull stripe linear.app      # read their DESIGN.md
node scripts/brand-ref.mjs ref stripe linear.app --out refs/
node scripts/gates.mjs --slug <slug> --refs refs/      # detach now includes them
```

Source: `ricocc/brands-design-md`, the collection behind design.ricoui.com/brands: 69 brands, each
a `DESIGN.md` plus a DTCG `tokens.json`, plus `registry.json`.

**Three rules.**

1. **Study, never copy.** These are unofficial, "inspired by" analyses of other companies' brands.
   Read one for the accent hue, the display face, the radius, the density and what the brand
   refuses; then leave. The detach gate is how "different from the category" becomes a number.
2. **Fetch, do not vendor.** The repository has no LICENSE file, so this skill does not
   redistribute it. Files go to the OS temp directory (`BRAND_REFS_BASE` overrides the source).
3. **A reference is half-measurable.** It has no DNA or sections, so it is scored on hue, value
   and type only. A pass against Stripe says the palette differs, not that the system does.

Other catalogs exist (`awesome-design-md`, getdesign.md, designmd.app). They are not wired in;
the same rules apply, and check each licence before copying anything into a repo.

## DESIGN.md

Google Labs' open format (`google-labs-code/design.md`, version alpha): YAML front matter of
tokens (colors, typography, rounded, spacing, components) plus prose sections in a fixed order.
`design-md.mjs --slug <slug> --lint` writes it from `tokens.json` and runs the official linter.

- Colours keep their own names; `primary` (darkest), `secondary` (quiet mid-tone), `tertiary`
  (the accent) and `neutral` (lightest) are added beside them as aliases.
- A face that is only a CSS alias (`mono`) is skipped, never published as a typeface.
- No Do's and Don'ts and no components are invented; sections with nothing real are listed
  under `omitted`. Edit the tokens, not the file.

## Free assets

```bash
node scripts/assets.mjs search "dune at dawn" --orientation landscape     # openverse, no key
node scripts/assets.mjs get openverse:<id> --out public/brand/<slug>/assets --name hero
node scripts/assets.mjs credits --dir public/brand/<slug>/assets          # also run by gates.mjs
```

| Source | Key | Licence and duty | Use for |
| --- | --- | --- | --- |
| Openverse | none | default filter CC0 + public domain: nothing to credit; `--license by` widens it and a credit is then required | the default |
| Pexels | `PEXELS_API_KEY` | Pexels licence; credit photographer and Pexels | photographs |
| Unsplash | `UNSPLASH_ACCESS_KEY` | Unsplash licence; the API wants hotlinked URLs, a download ping on use, a utm-linked credit, and human-chosen images, so search is capped at 8 and the ping is sent | photographs, by eye |
| Iconify | none | per icon set; read and recorded, never assumed | UI icons |

**Rules.** Assets are imagery (a hero plate, a dither source, a texture), never the mark: a stock
image is not an identity, so do not trace, recolour or ship one as the logo. Every file in
`assets/` needs a `credits.json` entry; an unknown licence, or one that needs credit with none
written, fails the assets gate. Shrink first (`downscale.py`), then dither (`immersive.md` §3).
If the page is published and uses Unsplash, hotlink the `hotlink` URL in `credits.json`.

Status: written from each service's documentation and tested against a local mock of the
documented response shapes; not run against the live hosts when it was built.
