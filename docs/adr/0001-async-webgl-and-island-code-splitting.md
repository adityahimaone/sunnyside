# ADR 0001: Asynchronous Paper City WebGL & Dead-Import Elimination on `/`

- **Status**: Accepted
- **Date**: 2026-11-24
- **Context**: Side A Landing Page (`/` — `app/page.tsx`, `features/landing-page/studio/`)

## Context & Problem Statement

The Side A landing page (`/`) shipped a single monolithic `'use client'` root (`features/landing-page/studio/studio.tsx`) that synchronously imported:

1. `mountPaperCity` (`paper-city-scene.ts`, 2,953 lines) and `three` (~600 KB minified), blocking hydration of the entire page even though the hero's first `1.2s` is dedicated to the inline-SVG `"himaone"` backdrop wordmark (`INTRO_WRITE_MS = 1000`, `INTRO_DROP_DELAY_S = 1.2`).
2. `CuttingMatMarks` and `HeroSurface` from `../hero/hero` (`1,643` lines), which pulled an unused alternate hero implementation and triggered a top-level `next/font/google` `Oswald` font declaration on `/`.
3. Pure marker-script layout helpers (`layoutScript`, `round`, `TRACK`) from `@/components/ui/sticker-slap-footer` (`1,589` lines), forcing the entire footer component and its draggable sticker runtime into the top-of-page bundle.
4. `paper-city-scene.ts` rendered a `1536×1536` `PCFSoftShadowMap` on every `requestAnimationFrame` tick even after static buildings finished their sky-drop entrance, and ran recursive `raycaster.intersectObjects(world.children, true)` across extruded meshes and `EdgesGeometry` line segments on every raw `pointermove` event.
5. `app/page.tsx` awaited `getRepos()` and serialized `toArchiveRepos(repos)` into `<LandingPage>`, where `views/landing-page.tsx` discarded it (`void archiveRepos`).

## Decision

1. **Asynchronous Paper City Scene Chunk**: Keep `HeroCity`'s cutting mat and SVG `"himaone"` backdrop wordmark in the immediate SSR/hydration shell, and load `paper-city-scene.ts` + `three` via dynamic `import('./paper-city-scene')` on mount so WebGL downloads in parallel with the `1.0s` wordmark stroke animation without blocking critical hydration.
2. **GPU Shadow & DPR Discipline**: Cap WebGL pixel ratio to `1.5` on compact/mobile viewports (`<= 768px`, `2.0` on desktop), freeze `renderer.shadowMap.autoUpdate = false` (or refresh only when dynamic shadow casters require it / use a tighter shadow map on compact screens) after the sky-drop settles, and throttle pointer raycasting to once per animation frame against registered `hotItems` bounding hierarchies (skipping `LineSegments` edge helpers).
3. **Sever Dead & Tangled Module Edges**:
   - Extract `CuttingMatMarks` and `HeroSurface` into a standalone lightweight module (`features/landing-page/studio/hero/cutting-mat-marks.tsx`) so `hero/hero.tsx` and `Oswald` are never bundled on `/`.
   - Extract pure single-stroke marker alphabet math (`SCRIPT`, `layoutScript`, `round`, `TRACK`, `SX`, `WORD_GAP`, `place`) into a zero-dependency pure module (`lib/script-alphabet.ts`) shared by `HeroCity`, `ScriptWord`, and `StickerSlapFooter`.
4. **SSR-Preserved Code Splitting for Below-the-Fold Runtimes**: Keep semantic SSR HTML intact for SEO, critical CSS extraction (`scripts/inline-critical-css.mjs`), and zero CLS, while splitting heavy below-the-fold client runtimes (`StickerSlapFooter`, `WorkGallery`, `Skills` pop-up book runtime, `StickerPit` physics, and `StickerJourney`) into separate async chunks / idle-deferred effects.
5. **Drop Unused Server Work & Root Overhead**:
   - Remove `getRepos()` / `archiveRepos` from `app/page.tsx` and `views/landing-page.tsx`.
   - Move `<GlassFilter id="liquid-glass-bar" />` from `app/layout.tsx` into `ArchiveShell` (`features/archive/archive-shell.tsx`), the only shell whose CSS (`archive.module.css`) references `url(#liquid-glass-bar)`.
   - Lazy-instantiate `new Audio(...)` inside `AudioProvider` on first playback request rather than eagerly in a root `useEffect` on every page load.

## Consequences

- **Positive**: Removes Three.js, 2,953 lines of procedural 3D geometry, 1,643 lines of unused `hero.tsx` + `Oswald` font CSS, and 1,589 lines of footer code from the synchronous top-of-page bundle; eliminates raw `pointermove` raycast spikes; cuts steady-state WebGL GPU load; removes unused SSR/root work.
- **Trade-offs**: On very slow 3G connections where the async Three.js chunk finishes after `1.2s`, the sky-drop starts cleanly as soon as the chunk resolves (`data-scene-ready`), with the `"himaone"` script wordmark holding the cobalt cutting mat gracefully in the interim.

## Measured Verification (2026-11-24)

- **Initial synchronous JS (`index.html` scripts)**: `1,642.8 KB` (19 chunks) -> `913.4 KB` (18 chunks) (`-729.4 KB` / `-44.4%`).
- **Prerendered HTML (`index.html`)**: `472.8 KB` -> `328.6 KB` (`-144.2 KB` / `-30.5%`), with `103 KB` inline critical CSS across `4` stylesheets.
- **Image payload on `/` (initial / full scroll)**: `11.7 KB` above fold; `728.3 KB` across full scroll (down from `>8.2 MB`, `-91.1%`).
- **CLS (initial & full `12,404px` scroll)**: `0.000`.
- **Console / page / HTTP `>=400` errors**: `0`.
