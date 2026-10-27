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

## Deliverables

- [x] one-page brief (this file)
- [x] six explorations, one kept, five rejected with reasons
- [x] mark, compact mark, glyph
- [x] wordmark as outlines
- [x] horizontal, stacked and reversed lockups
- [x] 3 × 3 brand board rendered from HTML
- [x] favicon set and app icons
- [x] primitive → semantic → component tokens, CSS and JSON
- [x] `/design-system/vitrine` case page with live components and forms
- [x] skill-resource audit

## Non-goals

- A second published component package. The route is a specimen and case.
- A dark-only brand. Both themes must look intentional.
- Animated logos, 3D orbs, or a mascot.
- Replacing Sunnyside. Vitrine is the new case, not a retheme of Side A.
- Print collateral beyond the board.

## Success

After 30 seconds a reviewer can say: “The V is two panes meeting at a point, one
solid and one dithered; the glass holds the content, and the form fields are
actually usable.” They can find the tokens, the favicon and the component code.

## Voice

**Precise, lit, unhurried.** Short sentences. Museum labels, not marketing.
Example: “One case. One object. The rest is clearance.”

## Assumptions

- `ASSUMPTION` The brand is a new system called **Vitrine**, not a variant of
  Sunnyside. If it should sit inside Sunnyside, the palette and mark must change
  again.
- `ASSUMPTION` The page lives at `/design-system/vitrine` and is indexable, under the `/design-system` case library. `/sunnyside`
  remains the Side A specimen.
- `ASSUMPTION` The signature dither is a hero lens-caustic field spilling through
  card edges, chosen by the owner in this session.
