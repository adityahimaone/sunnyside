# Sunnyside Landing Page — Domain & Performance Glossary

Living domain glossary maintained alongside Architecture Decision Records (`docs/adr/`) during the Side A landing-page lightweight & efficiency initiative.

## Surface & Identity Terms

- **Side A (Studio Wall)**: The active landing-page direction on `/` (`features/landing-page/studio/`). Composed of warm paper (`#f3ecdf`), dark ink (`#191a2e`), restrained cobalt (`#3d53d6`), tactile paper edges, and purposeful die-cut stickers across six chapters (`Intro`, `About`, `Show & tell`, `Work`, `Skills`, `Contact`) plus `SiteFooter`.
- **Archive Wing**: Secondary routes (`/projects`, `/bookmarks`, `/skills`, `/blog`, `/design-engineering`) sharing `--ss-*` namespaced tokens and the archive shell (`features/archive/`), distinct from Side A's feature-owned studio layout.
- **Paper Tooth (`.grain`)**: The subtle tactile noise texture over the Studio Wall (`studio.module.css`). Must feel printed without forcing expensive per-frame SVG `<feTurbulence>` rasterization or full-viewport backdrop readbacks over WebGL and scroll animations.
- **Top Notch Island (`SiteHeader`)**: Fixed chapter navigation bar that shifts from obsidian black on the hero to frosted glass over paper chapters, expanding into a destination card drawer (`#chapter-menu`).

## Interactive Stage & Chapter Terms

- **Backdrop Wordmark**: The single-stroke SVG marker script (`"himaone"`) rendered behind the hero stage (`HeroCity`). Draws in during the `writing` phase (`0–1.0s`), parts horizontally during `dropping`/`compact`, and settles behind the 3D miniature.
- **Paper City Stage (`HeroCity` / `mountPaperCity`)**: Orthographic Three.js isometric miniature (`features/landing-page/studio/hero-city/paper-city-scene.ts`) featuring plinth zones, a C2-continuous figure-8 railway viaduct (`INTERFACES`), trains, road vehicles, billboard slides, and sky-drop entrance choreography starting at `1.2s`.
- **Hot Item (`HotItem`)**: An interactive 3D group in Paper City (buildings, trains, billboard, profile card, park) that responds to pointer hover with spring lift and click actions.
- **Release Liner (`StickerPit`)**: Interactive tray in Chapter 01 (`About`) simulating 2D rigid-body gravity (`gravity/pit-runtime.ts`) for seven peeled die-cut stickers once scrolled into view; degrades cleanly to static dashed resting spots under `prefers-reduced-motion`.
- **Show & Tell Track (`Showcase`)**: Horizontal drag/scroll study rail in Chapter 02 rendering four code-drawn print specimens (`Sun Club`, `Peel here`, `Type tray`, `Spring study`) with a native `<dialog>` detail sheet.
- **Papercraft Moodboard (`WorkGallery`)**: Corkboard in Chapter 03 (`Work`) framing up to 12 curated pieces (`Releases` and `Systems`) with washi tape, pushpins, sagging SVG yarn strands (`YarnLayer`), hover cover prints (`Peek`), draggable edge stickers (`MatStickers`), and approval stamps.
- **Cover Plate (`CoverPlate`)**: Aspect-reserved thumbnail frame on the moodboard and detail drawer. Because Cloudflare Workers / OpenNext runs with `images: { unoptimized: true }`, Cover Plates serve static files directly from `public/` or `DESIGN_SYSTEM_URL` without `/_next/image` runtime resizing.
- **Pop-Up Book (`Skills` / `useBookScroll`)**: Sticky scroll-scrubbed diorama in Chapter 04 (`diorama/`) where a book opens (`0.04–0.40`) and four layered SVG stations (`Build`, `Motion`, `The rest`, `Systems`) fold upright (`0.40–0.92`) on desktop, collapsing into cropped station cards on mobile.
- **Sticker Journey (`StickerJourney`)**: Document-space decorative layer (`journey/journey-runtime.ts`) flying stickers from dock to dock across section boundaries with landing squash, sparks, and tinted shockwave rings.
- **Sticker Slap Footer (`SiteFooter` / `StickerSlapFooter`)**: Chapter outro (`#outro`) drawing the marker wordmark and slapping draggable die-cut stickers as it enters the viewport.

## Performance & Delivery Terms

- **Hydration Critical Path**: All JavaScript downloaded, parsed, and executed before the top-of-page UI (`SiteHeader`, `HeroCity` backdrop wordmark, navigation) becomes interactive.
- **Dead-Import Pull**: Bundler inclusion of unused modules/fonts caused by barrel or cross-file imports (e.g., importing `CuttingMatMarks` from the 1,643-line legacy `hero/hero.tsx`, or importing pure `layoutScript` math from the 1,589-line `sticker-slap-footer.tsx`).
- **Offscreen Idle Discipline**: Ensuring every rAF loop, physics step, WebGL renderer, and scroll geometry reader sleeps (`0` CPU/GPU cost) when its stage is offscreen, settled, tab-hidden, or under `prefers-reduced-motion: reduce`.
