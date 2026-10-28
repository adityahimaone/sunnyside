# Vitrine — brand brief

## Job

Give a new design system a face that proves glass and dither can be legible
together — then document it as a working case, not a moodboard.

## Audience

Design engineers and product teams building data-dense, AI-assisted tools. They
already know shadcn, Tailwind and Figma. They meet Vitrine on a case page, a
favicon, a form field and a component sheet, not in a pitch deck.

## Promise

Depth without fog: glass containers that hold one clear object, and a dithered
information layer that stays readable at 16px and 4.5:1.

## Positioning

Not the generic frosted card with a gradient blob. Not a 1-bit retro toy. Not a
Sunnyside re-skin. Vitrine is a **case**, not a filter: the glass is the
container, the dither is the printed label inside it. The nearest thing it must
not look like is a dribbble glassmorphism shot with unreadable body copy.

## Domain before defaults

The product's world is a museum vitrine, not a dashboard.

- **Five concepts:** the case, the printed museum label, halftone dot gain, the
  specular arc of a lens, and the clearance around one lit object.
- **Five colours from the physical world:** case-black, frost glass, the
  chartreuse of a safety label, iris flare from a lens, and clay from a
  registration error.
- **Signature:** one V split by its material — the ink arm is the glass, the
  Signal arm is the light; the plinth is flat.
- **Obvious defaults to avoid:** a frosted card with a gradient blob, a 1-bit
  retro toy, an app-store tile with an initial, and a circular orbit badge.
  Vitrine uses none of them.

## Constraints

- Stack: Next.js 16, React 19, Tailwind CSS v4, dithercn engine in `lib/dither`.
- Sizes: compact mark at 16, full mark at 32/64/512, lockup at 130/240/512,
  page at 1440 and 390.
- Accessibility: WCAG AA body text, visible focus, 44px touch targets,
  `prefers-reduced-motion: reduce` keeps a finished dither frame.
- Performance: at most 8 live DitherShaders; forms are native elements, no
  component runtime.
- Must not change: Sunnyside's paper, cobalt and sun; the archive shell; the
  existing `/sunnyside` route.
- Maintainer: Aditya Himawan, with agent-readable docs in the repo.

## References

1. Museum vitrines — take: a lit object inside a hard-edged case, with a small
   printed label as the only ornament.
2. Risograph and newspaper halftone — take: one accent ink, visible dot gain,
   information carried by density, not gradient.
3. Optical instruments — take: the aperture, the specular arc, the idea that a
   lens is a frame for looking, not a decoration.

## v2.5 direction

- **Family:** architectural monogram. One V, split vertically at x32; the left
  arm is Case, the right arm is Signal. The flat plinth makes the letter a case
  in section.
- **Gate:** the constructed v2.3 gate — zero circle, fill-only, two primitives in
  the primary, one in the compact, one Signal arm.
- **Bake-off:** the five families were re-judged. The open case was retired
  because it drew the container and withheld the light; the half-light V won.
- **Theme DNA:** hard edge, square tile, solid ring, cosy density. The mark and
  the fields read the same object.

## Deliverables

- [x] one-page brief (this file)
- [x] five-family constructed v2.3 bake-off, one kept, four rejected with reasons
- [x] story spine, eight decision cards and a voice card
- [x] mark, compact mark, glyph, mono mark
- [x] wordmark as outlines
- [x] horizontal, stacked and reversed lockups
- [x] 3 × 3 brand board rendered from HTML
- [x] favicon set and app icons
- [x] theme DNA + primitive → semantic → component tokens, CSS and JSON
- [x] portable form kit CSS and HTML
- [x] `/design-system/vitrine` case page with live components and forms
- [x] v2.5 skill-resource audit and objective mark score

## Non-goals

- A second published component package. The route is a specimen and case.
- A dark-only brand. Both themes must look intentional.
- Animated logos, 3D orbs, or a mascot.
- Replacing Sunnyside. Vitrine is the new case, not a retheme of Side A.
- Print collateral beyond the board.

## Success

After 30 seconds a reviewer can say: “The V is split by its material: one arm is
glass, one is the light; the compact drops the Signal arm; the glass holds the
content, and the form fields are actually usable.” They can find the tokens,
the favicon, the story and the component code.

## Voice

**Precise, lit, unhurried.** Short sentences. Museum labels, not marketing.
Example: “One case. One object. The rest is clearance.”

## Assumptions

- `ASSUMPTION` The brand is a new system called **Vitrine**, not a variant of
  Sunnyside. If it should sit inside Sunnyside, the palette and mark must change
  again.
- `ASSUMPTION` The page lives at `/design-system/vitrine` and is indexable, under
  the `/design-system` case library. `/sunnyside` remains the Side A specimen.
- `ASSUMPTION` The signature dither is a hero lens-caustic field spilling through
  card edges, chosen by the owner in this session.
- `ASSUMPTION` The v2.5 mark replaces the open case with the half-light V, not a
  new name. The open case and the earlier folded V are retired; the split V, the
  glass and the flat plinth carry the identity.
