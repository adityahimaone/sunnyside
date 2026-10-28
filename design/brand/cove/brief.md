# Cove — brand brief

## Job

Give the portfolio a sixth design system that proves blue liquid glass can be
minimal: one glass layer, one solid reading plate, one ice accent. The page has
to stay readable at 16px and 390px, not just photogenic.

## Audience

Design engineers and product teams building interfaces that sit over imagery,
video or a rendered field: media tools, AI surfaces, dashboards with a
background. They already know shadcn, Tailwind and Figma. They meet Cove on a
case page, a favicon, a form field and a component sheet.

## Promise

**Clarity you can see through.** Depth without the fog.

## Positioning

Not the frosted card with a gradient blob. Not glass everywhere. Not a
blue-purple AI mesh, not a teardrop icon, not a Vitrine re-skin. Cove is a
**material study with one layer**: the field carries the atmosphere, the glass
carries the chrome, and the reading plate carries the words. The nearest thing it
must not look like is a dribbble glassmorphism shot with unreadable body copy.

## Domain before defaults

The product's world is a cove: sheltered water against a stone edge.

- **Five concepts:** the cove (a sheltered curve), the waterline, the meniscus,
  the caustic ring, the depth sounding.
- **Five colours from the physical world:** abyss, foam, ice, horizon, mist.
- **Signature:** a squared C with one ice inlay on the lower lip — the cove and
  its waterline in one letter.
- **Obvious defaults to avoid:** the frosted card over a gradient, the
  glass-everywhere dashboard, the blue-purple mesh, the teardrop, the blurry
  hero.

## Constraints

- Stack: Next.js 16, React 19, TypeScript, CSS modules; no component runtime.
- Sizes: mark at 16, 32, 64, 128; lockup at 30; page at 1440 and 390.
- Accessibility: WCAG AA body text, visible focus, 44px touch targets,
  `prefers-reduced-motion: reduce` keeps a still field.
- Deep is the default surface; Frost is the light scope. The hero, material and
  mark stages and the footer stay Deep in both.
- Glass is CSS `backdrop-filter`, not true lensing. Do not claim otherwise.
- The supplied background image was **not present in the workspace**. The page
  ships a CSS caustic field and exposes `--cv-field-image` as the single swap
  point.
- Must not change Sunnyside, Vitrine, Huginn, Riso Co. or Hachure.

## References

1. Apple Liquid Glass (WWDC25 / HIG Materials) — take: one translucent layer that
   borrows the backdrop, a lit edge, one specular, and restraint.
2. Instrument Serif + Instrument Sans (Google Fonts / TypePairs) — take: a
   high-contrast serif for the few display moments, a Swiss-neutral sans for the
   work.
3. Photographic caustics and menisci — take: a blue field with one ring of light,
   not a gradient mesh.

## Type research

Instrument Serif and Instrument Sans were drawn as a pair. The serif has the
contrast and the calm for the hero and the outlined wordmark; the sans is neutral
enough for 14px inputs, 16px body, tables and labels. Geist Mono is already the
project's label face, so Cove adds two families, not three.

| Voice | Face | Use |
| --- | --- | --- |
| Display | Instrument Serif 400 / 400 italic | Hero, section titles, wordmark, the one pull quote |
| Reading | Instrument Sans 400–600 | Body, controls, tables, UI |
| Label | Geist Mono 500 | Metadata, sizes, token names, ratios |

Instrument Serif ships **one weight**. Do not synthesise a bold; raise the size
or use the italic. The serif is never used for a paragraph.

Sources:

- [TypePairs — Instrument Serif + Instrument Sans](https://typepairs.com/pairs/instrument-serif-instrument-sans)
- [Google Fonts — Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- [Google Fonts — Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [better-typography](https://www.ui-skills.com/skills/jakubkrehel/better-typography)

## v1.0 direction

- **Track:** constructed. The C is an architectural monogram, not a drawn mascot.
- **Family:** architectural monogram. One C with 45° walls and one ice inlay.
- **Gate:** v2.3 constructed — zero circle, fill-only, 2–4 primitives, one
  accent.
- **Material:** one glass layer over one field; a solid reading plate; a lit cut
  edge; one specular; a low-opacity grain on the field only.
- **Palette:** Abyss `#06121C`, Foam `#E9F6FB`, Ice `#7CE7FF`, Horizon
  `#2E5F78`, Mist `#9DBCCB`, plus Clay, Moss and Amber for status.
- **Type:** Instrument Serif / Instrument Sans / Geist Mono.
- **Theme DNA:** lit-cut edge, 1px offset, square tile, halo ring, airy density,
  mono-caps label.

## Deliverables

- [x] one-page brief (this file)
- [x] four mark directions, one kept, three rejected with reasons
- [x] story spine, six decision cards and a voice card
- [x] mark, compact mark, glyph, mono, reverse
- [x] wordmark as outlines (Instrument Serif)
- [x] horizontal, stacked and reversed lockups
- [x] brand board rendered from HTML
- [x] favicon set and app icons
- [x] theme DNA + primitive → semantic → component tokens, CSS and JSON
- [x] portable form kit CSS and HTML
- [x] `/design-system/cove` case page with ten native controls
- [x] v2.4 skill-resource audit and objective mark score

## Non-goals

- A second published component package. The route is a specimen and case.
- A light-only system. Deep is the signature; Frost is a surface variant.
- A shader/refraction layer. CSS glass only.
- Generated atmosphere imagery. The field is CSS until the supplied image is
  added.
- Replacing Vitrine or Sunnyside. Cove is Case 06.

## Success

After 30 seconds a reviewer can say: “One glass layer over one blue field; the
copy sits on a solid plate; the C has one ice waterline; the form is actually
usable.” They can find the tokens, the favicon, the story and the component code.

## Voice

**Calm, exact, unhurried.** Museum wall text, not a launch post. Example:
“One layer. Read on the plate.”

## Assumptions

- `ASSUMPTION` The case is **Cove**, Case 06, at `/design-system/cove`.
- `ASSUMPTION` Deep is the default; Frost is the light scope. The hero, material
  and mark stages and the footer stay Deep.
- `ASSUMPTION` The supplied background image is missing from the workspace. The
  CSS caustic is a fallback, not a replacement; `--cv-field-image` swaps it.
- `ASSUMPTION` The field can be photographic or rendered; the system does not
  ship a generated image, so there is no image provenance yet.
- `ASSUMPTION` The C mark is the identity; the wordmark is outlined Instrument
  Serif, not a custom-drawn letter.
