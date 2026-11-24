# ADR 0002: Static Image Budget & Compositor-Only Scroll Discipline

- **Status**: Accepted
- **Date**: 2026-11-24
- **Context**: Side A Landing Page (`/` — `studio.module.css`, `work-gallery/`, `about.tsx`, scroll hooks)

## Context & Problem Statement

1. **Unoptimized Multi-Megabyte PNGs**: Because `next.config.mjs` sets `images: { unoptimized: true }` for Cloudflare Workers / OpenNext compatibility, `<Image>` serves raw source files directly. On `/`, `WorkGallery` and `About` served full-resolution PNGs (`tavola-brandkit.png` at `2.5 MB`, `sunnyside-brandkit.png` at `746 KB`, `memoji-1.png` at `70 KB`, plus remote 3000×2250 `.png` brand boards) inside `~280–420px` frames.
2. **Full-Viewport SVG Turbulence Blend**: `.grain::after` in `studio.module.css` used `position: fixed; inset: 0; z-index: 80; mix-blend-mode: multiply` backed by an inline `<feTurbulence numOctaves="3">` SVG filter, forcing full-screen backdrop blending and filter rasterization over animated WebGL, sticky 3D pop-up layers, and scroll transforms.
3. **Overlapping & Dead Scroll Listeners**:
   - `useLandingMotion` loaded GSAP eagerly on mount (before idle) and queried removed selectors (`[data-marquee]`, `[data-project-card]`, `[data-skill-chips]`) while conflicting with `runJourney` on the About photo (`[data-about-photo]` vs `[data-journey="photo"]`).
   - `useBookScroll` (`Skills`) attached a global `scroll` listener running `getBoundingClientRect()` from `T=0` even when `#skills` was thousands of pixels offscreen.
   - `PaperPiece` (`WorkGallery`) called `artRef.current?.getBoundingClientRect()` on every pointer move across any card.

## Decision

1. **Dedicated Lightweight WebP Card Assets**: Generate and wire appropriately sized WebP assets for landing-page frames (`memoji-1.webp`, `sunnyside` card cover WebP, `tavola` WebP, etc.) while preserving all original high-resolution `/brand/*-brandkit.png` files untouched for specimen pages and brand-kit downloads.
2. **Pre-Baked Paper Grain Tile**: Replace the live `<feTurbulence>` filter data URI in `.grain::after` with a tiny repeatable static monochrome alpha noise tile (eliminating `feTurbulence` CPU/GPU evaluation and avoiding `mix-blend-mode: multiply` full-screen backdrop readback while preserving the exact warm paper tooth).
3. **Idle-Gated & Intersection-Scoped Scroll Loops**:
   - Defer `useLandingMotion` GSAP dynamic import until `requestIdleCallback` so hydration and first scroll frames never compete with GSAP plugin registration.
   - Remove dead selectors in `useLandingMotion` and deduplicate the About photo / Marquee scroll transforms between `useLandingMotion` and `runJourney`.
   - Gate `useBookScroll`'s active `scroll` listener via `IntersectionObserver` so `#skills` performs zero geometry reads when offscreen.
   - Cache card frame bounds on pointer enter / resize in `WorkGallery` instead of calling `getBoundingClientRect()` on every `pointermove`.

## Consequences

- **Positive**: Saves multiple megabytes of image transfer on `/`; eliminates full-viewport SVG filter compositing overhead; guarantees zero offscreen scroll-loop work and smoother INP/scroll frame pacing.
- **Trade-offs**: Landing-page card cover overrides must stay aligned if a case's visual identity board is redesigned in the future.
