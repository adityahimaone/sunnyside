# Routes (Next.js App Router, `app/`)

- `/` → `app/page.tsx` → `features/landing-page/index.ts` → `Studio` (Side A landing page, single scroll, chapters 01–06). Contains the **Selected work** section (`#work`).
- `/projects` → `app/(booth)/projects/page.tsx` — full catalogue grid.
- `/projects/[slug]` → `app/(booth)/projects/[slug]/page.tsx` — case detail.
- `/design-system` → `app/design-system/page.tsx` — documented design-system index (all cases, brand-kit covers).
- `/design-system/<slug>` → `app/design-system/{bluewater,clearing,cove,hachure,huginn,jakarta,ledger,porphyry,riso,strand,vitrine,wildflower-wind}/page.tsx` — per-system specimens.
- `/sunnyside` → `app/sunnyside/page.tsx` — interactive design-system specimen + token export.
- `/blog`, `/blog/[slug]`, `/bookmarks`, `/design-engineering`, `/design-engineering/learning`, `/guides/*`, `/skills`, `/music`, `/ui`, `/spotify-setup` (noindex).

Key composition: `features/landing-page/studio/studio.tsx` renders `SiteHeader → Hero → About → Projects (id="work") → Showcase → Skills → StickerJourney → Contact → SiteFooter`. Chapter order drives `ChapterRail` and `usePagePosition`.
