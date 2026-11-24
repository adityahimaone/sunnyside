# Performance baseline — landing page

Measured before the 3D motion redesign begins, so every
phase has something to be compared against. Re-measure
after each phase with the same recipe.

## Recipe

- **Lighthouse:** `pnpm build && npx next start -p 3000`,
  then Lighthouse (Chrome 129, macOS, throttled) on `/`:
  mobile (4x CPU slowdown, Slow 4G) and desktop profiles,
  3 runs each, median recorded.
- **Trace:** Chrome Performance panel, one full scroll
  Hero → Contact at 60px/frame; record long tasks and
  Layout Shifts.
- **Bundle:** `npx next build` output (per-route JS) and
  `@next/bundle-analyzer` for the landing page chunks.
- **INP:** the trace's Interaction to Next Paint for the
  scroll gesture; pointer parallax is rAF-throttled and
  writes CSS variables only, so it should not register.

## What is measured

| Metric                                | Mobile    | Desktop   | Notes                                                                                                                                                   |
| ------------------------------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LCP                                   | _to fill_ | _to fill_ | Must stay a text element (the hero panel's h1/tagline). WebGL, if added in Phase 2, mounts after LCP via `requestIdleCallback` and only when in view.   |
| CLS                                   | _to fill_ | _to fill_ | Target 0. The work section's height is applied post-mount (existing behaviour); the radio flip reuses that pattern and reserves its canvas size in CSS. |
| INP                                   | _to fill_ | _to fill_ | Pointer parallax writes CSS variables only; scroll timelines are GSAP-scrubbed transforms.                                                              |
| JS transferred                        | _to fill_ | _to fill_ | GSAP + Lenis are dynamic imports inside `use-rack-animations.ts`; nothing new lands on the critical path.                                               |
| Long tasks (>50ms) during full scroll | _to fill_ | _to fill_ | The flip window (260vh) is the hot path: transforms and opacity only, no filter/blur in the scrub.                                                      |

## Guardrails the redesign must hold

1. **LCP stays text.** The hero editorial panel is the LCP
   element before and after every phase.
2. **No new JS on the critical path.** Tier 2 WebGL (Phase 2)
   is a lazy `dynamic(..., { ssr: false })` chunk with a
   static poster behind it.
3. **Reduced motion is free.** `prefers-reduced-motion` skips
   the engine entirely — no Lenis, no GSAP, no timelines —
   which the baseline should confirm as the cheapest path.
4. **The flip is transform-only.** Rotation, z, scale, y,
   width on the cassette (matching the legacy seam's cost
   profile), and two style writes per frame (`--angle`,
   face `inert` toggles at 90° crossings only).

## Known pre-existing items (not caused by the redesign)

- `tests/use-list-keys.test.tsx` fails in this environment:
  React 19.3 / `@testing-library/react` 16.3 `React.act`
  incompatibility — pre-existing on `main`, unrelated to the
  landing page.
- ESLint carries pre-existing debt in files outside the
  landing page (`top-bar`, `work-archive`, and the legacy
  `set-state-in-effect` / `refs` patterns in
  `work.tsx` that predate this work). The chapter files and
  the radio flip files lint clean.

## Phase checkpoints

- **Phase 0 (foundations):** same visuals, new structure —
  Lighthouse within noise of the numbers above; e2e green.
- **Phase 1 (radio flip):** no long task >50ms inside the
  260vh flip window; LCP unchanged; CLS unchanged.
- **Phase 2 (hero):** LCP not worse; WebGL chunk loaded
  after LCP and only when the hero is on screen.
- **Phase 3 (transitions):** each chapter's timeline adds
  no layout passes (transform/opacity only).
- **Phase 4 (polish):** final Lighthouse + trace report
  recorded here, or the gap documented.

## Side A Lightweight & Efficiency Pass (2026-11-24)

Measured on Next.js `16.3.7` production build (`npm run build` + `next start` + headless Chromium verification; see [`docs/adr/0001-async-webgl-and-island-code-splitting.md`](./adr/0001-async-webgl-and-island-code-splitting.md), [`docs/adr/0002-unoptimized-image-and-compositor-budget.md`](./adr/0002-unoptimized-image-and-compositor-budget.md), [`docs/adr/0003-enchantments-and-remote-cover-thumbnails.md`](./adr/0003-enchantments-and-remote-cover-thumbnails.md), and [`docs/glossary.md`](./glossary.md)):

| Metric                                         | Before                                         | After                                            | Delta                         |
| ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ | ----------------------------- |
| Initial sync JS in `index.html` (uncompressed) | `1,642.8 KB` (19 chunks)                       | `913.4 KB` (18 chunks)                           | `-729.4 KB` (`-44.4%`)        |
| Prerendered `index.html`                       | `472.8 KB`                                     | `328.6 KB`                                       | `-144.2 KB` (`-30.5%`)        |
| Inline critical CSS                            | `4` sheets + dead `hero.module.css` / `Oswald` | `103 KB` across `4` sheets                       | Zero trim warnings            |
| Above-the-fold image transfer                  | `~70+ KB` + SVG `feTurbulence`                 | `11.7 KB` (`paper-grain.webp` + `memoji-1.webp`) | `-83%+` + zero `feTurbulence` |
| Full-scroll `/` image transfer (12 pieces)     | `>8,200 KB` (raw PNG boards)                   | `728.3 KB` (960×720 WebP covers)                 | `-91.1%` (`~7.5 MB` saved)    |
| CLS (initial load & full `12,404px` scroll)    | `0`                                            | `0.000`                                          | Preserved                     |
| Console / runtime / HTTP `>=400` errors        | `404 HEAD /resume.pdf`                         | `0`                                              | Clean                         |
