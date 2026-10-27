# Visual directions

A direction is a **material system**, not a filter. Pick one signature, then let
every surface follow it. The brief decides; the trend does not.

Use this with `references/brief.md`. If the brief names no direction, propose two
from different families and show a swatch/type specimen before building.

## Selection table

| Direction | Use when | Signature | Main trap |
| --- | --- | --- | --- |
| **Liquid glass / glassmorphism** | Layered product UI, media behind chrome, premium/OS feel | Translucent surface + blur + edge highlight + one accent | Glass everywhere; unreadable text on blur; huge animated blur |
| **Dither / halftone / 1-bit** | Music, dev tools, editorial, archive, lo-fi culture | Ordered dot grid or error diffusion in two colours | Dither under body text; animating full-resolution canvas |
| **Neo-brutalist / raw** | Culture, indie, utility, strong point of view | Thick border, hard offset shadow, flat loud field | Thin type + low contrast; decoration without structure |
| **Editorial / Swiss** | Studio, publication, luxury, type-led product | Strict grid, type hierarchy, asymmetric whitespace | All-caps labels; decorative numbering; weak focal point |
| **Bento / modular** | Feature launches, dashboards, product overviews | Varied cell spans, one focal cell, tight gaps | Equal card soup; no hierarchy |
| **Gradient mesh / aurora** | Creative tools, AI, atmospheric launch pages | Low-frequency colour field, one accent | Purple-blue AI slop; text on busy gradients |
| **Grain / paper / risograph** | Craft, publishing, warm brands, analog feel | Paper ground, ink, one spot colour, subtle noise | Noise over text; fake texture on every card |
| **3D / WebGL** | One product moment, hardware, immersive story | One centerpiece with a fallback | Scroll hijack; heavy scene on every page |
| **Monochrome / pixel / ASCII** | Technical, terminal, archive, game culture | One hue/value scale, pixel or glyph texture | Novelty over legibility |

## Liquid glass / glassmorphism

**What it is:** a translucent layer that borrows the backdrop, with an edge that
catches light. Apple's Liquid Glass adds lensing, refraction, specular edges and
fluid motion; CSS usually approximates the first layer only.

**Recipe (CSS approximation):**

```css
.glass {
  background: color-mix(in srgb, var(--surface) 62%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid color-mix(in srgb, white 28%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 35%, transparent),
    0 18px 50px rgb(0 0 0 / 0.18);
}
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: var(--surface); }
}
```

**Rules:**

- One glass layer per view; put copy on a solid inner plate, not directly on blur.
- Use it for chrome that floats over media (topbar, sheet, command palette), not
  for body cards.
- Measure text against the composite, not the page background.
- Do not animate blur or a large backdrop; `backdrop-filter` is expensive.
- Keep a solid fallback for unsupported browsers and reduced transparency.
- CSS `backdrop-filter` is frosted glass, not true lensing. Do not claim liquid
  glass unless you ship a shader/refraction layer with a fallback.

**Sources:** [Apple — Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/),
[Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials),
[HTML-in-Canvas — Liquid Glass](https://html-in-canvas.dev/liquid-glass-effect/).

## Dither / halftone / 1-bit

**What it is:** faking many tones with two colours by scattering the rounding
error. Ordered/Bayer is stateless and fast; Floyd–Steinberg/Atkinson is organic
and sequential.

**When:** a lo-fi image, a texture, a logo treatment, a chart or a hero that
reveals itself. Not body copy, not a whole dashboard.

**Recipe (Bayer, still or low-frame):**

```js
const BAYER4 = [
  [0, 8, 2, 10], [12, 4, 14, 6],
  [3, 11, 1, 9], [15, 7, 13, 5],
]
// Downscale first; one dot = 2–8 screen pixels.
// Read luminance, compare with (BAYER4[y%4][x%4] + 0.5) * 16,
// write the two palette colours back. Use image-rendering: pixelated.
```

**Rules:**

- Bayer for motion; error diffusion for a still frame.
- Downscale the canvas; never dither at screen resolution.
- `getContext('2d', { willReadFrequently: true })` for repeated reads.
- Canvas is decoration: `aria-hidden="true"`, real HTML on top.
- Respect `prefers-reduced-motion`; render one static frame.
- On touch there is no cursor; choose a good static frame or a slow automatic path.
- Give the canvas explicit dimensions to avoid layout shift.

**Sources:** [Effect.Labs — Dither effect](https://effect-labs.com/en/pages/blog/dither-effect-website.html),
the local `dithercn` skill for React/shadcn.

## Neo-brutalist / raw

- 2px borders, hard offset shadows, flat loud field, no blur.
- One accent; high contrast; type heavy enough for small sizes.
- The structure must carry meaning; a thick border on a generic card is costume.
- Use a real grid; the “raw” look still needs alignment.
- Respect focus and motion rules; rawness is not an excuse for inaccessible type.

## Editorial / Swiss

- A strict column grid, a clear type ratio, asymmetric whitespace, one accent.
- Hierarchy through size, weight and space; not lines on every section.
- No decorative numbering unless the content is a sequence.
- One display voice; body at 60–75ch; captions and labels have a job.
- Test at 390: the grid should reflow, not just shrink.

## Bento / modular

- 2–6 cells; one cell is the focal point; vary spans and density.
- The grid is information: group by meaning, not by equal rectangles.
- One card style; no nested cards; no card-inside-card-inside-card.
- Mobile becomes a single column with a clear order; no horizontal scroll.

## Gradient mesh / aurora

- 2–3 hues, low frequency, `in oklab` interpolation; one accent.
- Keep text on a solid plate or a quiet area of the gradient.
- Avoid the default purple-blue “AI” gradient unless the brief owns it.
- No animated full-screen gradient behind body copy.

## Grain / paper / risograph

- Paper ground, ink, one spot colour; grain at 3–8% opacity.
- Use an SVG `feTurbulence` data URI or a tiny tiled noise PNG; do not ship a
  large texture.
- Keep grain off text; use it on the ground or an image plate.
- Print cues (registration marks, halftone) must mean something, not decorate.

## 3D / WebGL

- One centerpiece, lazy-loaded, with a static fallback.
- Pause off-screen; respect reduced motion; no scroll hijack.
- Keep UI in HTML above the canvas; the canvas is not the only content.
- Budget the scene: one material, one light, one interaction.

## Monochrome / pixel / ASCII

- One hue/value scale; type and spacing do the work.
- Pixel/ASCII texture is a surface, not a substitute for hierarchy.
- Real HTML for names, headings and controls; texture is `aria-hidden`.
- Check contrast at small sizes; pixel fonts are often unreadable below 14px.

## The selection worksheet

Before building, answer:

1. **What is the one signature?** A material, a mark, a type treatment, a motion.
2. **Where does it appear?** One or two places, not every surface.
3. **What stays quiet?** Most of the page.
4. **What is the fallback?** Solid surface, static frame, system font.
5. **What is the cost?** Paint, GPU, bytes, motion, accessibility.
6. **What would make it generic?** Glass on every card, gradient behind text,
   equal bento cells, purple mesh, dither on body copy.

## Resource shelf

- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple — Meet Liquid Glass (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/219/)
- [HTML-in-Canvas — Liquid Glass in CSS and WebGL](https://html-in-canvas.dev/liquid-glass-effect/)
- [Effect.Labs — Dither effect](https://effect-labs.com/en/pages/blog/dither-effect-website.html)
- [Awwwards](https://www.awwwards.com/) · [Godly](https://godly.website/) ·
  [Land-book](https://land-book.com/) · [SiteInspire](https://www.siteinspire.com/)
- [Cosmos](https://www.cosmos.so/) · [Minimal Gallery](https://minimal.gallery/)
- [Typewolf](https://www.typewolf.com/) · [Fonts In Use](https://fontsinuse.com/)
- [Dither it](https://ditherit.com/) · [Paper Shaders](https://shaders.paper.design/)
- [Motion](https://motion.dev/) · [Rive](https://rive.app/)

Use references to find a **move**, not to copy a page. Credit the source when a
treatment is borrowed.
