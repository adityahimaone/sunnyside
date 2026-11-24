# ADR 0003: Zero-Weight Enchantments & Local WebP System Card Thumbnails

- **Status**: Accepted
- **Date**: 2026-11-24
- **Context**: Side A Landing Page (`/` — `hero-city/`, `studio.tsx`, `contact.tsx`, `work-gallery/`)

## Context & Problem Statement

1. **Remote Multi-Megabyte Design-System Boards**: On `WorkGallery` (`Everything` and `Systems` tabs), 10 of the 12 featured design-system cards resolved via `DESIGN_SYSTEM_URL` to remote `3000×2250` PNG brandkit boards (`design-system.adityahimaone.space/brand/<slug>/<slug>-brandkit.png`), while local `sunnyside` (`746 KB`) and `tavola` (`2.5 MB`) also pointed at full-resolution PNGs. With `images: { unoptimized: true }`, browsers downloaded full raw PNGs for `~280px` moodboard cards.
2. **Async WebGL Entrance Seam**: Splitting `paper-city-scene.ts` into an async chunk requires a clean visual readiness transition (`data-scene-ready`) so the isometric stage never pops abruptly on slower networks while `"himaone"` finishes writing.
3. **Disconnected & Conflicting Scroll Details**:
   - `Marquee` in `studio.tsx` lacked `data-marquee`, leaving `useLandingMotion`'s subtle tape-band scroll tilt inert while `runJourney` also mutated `marquee.style.rotate` on scroll.
   - `About`'s photo card (`[data-about-photo]` / `[data-journey="photo"]`) had both GSAP (`y: -36, rotate: -0.8`) and `runJourney` (`photo.style.translate`) competing on scroll frames.
4. **Unnecessary Runtime `HEAD` Fetch in `Contact`**: `Contact` issued `fetch(CONTACT.resume, { method: 'HEAD' })` on every landing-page mount solely to fall back from `/Aditya_Himawan_Resume.pdf` to `/resume` when the static PDF is absent.

## Decision

1. **Local WebP Thumbnail Overrides for Moodboard Cards**: Generate/cache sized `16:10` / `4:3` WebP card thumbnails under `public/work/systems/<slug>.webp` (plus `public/memoji-1.webp` for `About`) and map known slugs in `work-gallery-data.ts` to those lightweight WebP files, while keeping `cases.ts` / specimen brandkit PNGs intact and automatically falling back to `item.cover` for any newly added remote case.
2. **Graceful `HeroCity` Scene-Ready Handoff**: Track `sceneReady` state on `HeroCity` (`data-scene-ready="true"`) with a smooth compositor opacity reveal on `.stage` and `prefers-reduced-motion` instant settlement.
3. **Single-Owner Scroll Choreography & `content-visibility` Hints**:
   - Let `runJourney` own velocity-reactive marquee swing/playback when active, and eliminate duplicate `About` photo scroll transforms so only one compositor transform drives each element.
   - Apply safe CSS `contain: layout style` / offscreen paint discipline where fixed/sticky stacking permits without clipping `StickerJourney` or `Peek` overlays.
4. **Static Resume Link Resolution**: Point `Contact` directly to the canonical resume route (`/resume`, or static PDF if present at build time) without firing a client-side `HEAD` request on every pageview.

## Consequences

- **Positive**: Eliminates multi-megabyte remote PNG downloads on `WorkGallery`; removes a wasted network request on every visit; restores cohesive, conflict-free scroll micro-interactions; keeps all original components and Sunnyside Side A visual rules intact.
- **Trade-offs**: Known featured design-system cases carry compact (~25–55 KB) WebP thumbnails in `public/work/systems/`.
