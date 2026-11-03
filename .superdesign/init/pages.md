# Key pages — dependency trees

## / (Side A landing)
Entry: `app/page.tsx` → `features/landing-page/index.ts` → `features/landing-page/studio/studio.tsx`
- `features/landing-page/studio/site-header.tsx`
- `features/landing-page/studio/hero/`
- `features/landing-page/studio/about.tsx`
- `features/landing-page/studio/projects.tsx`  ← target chapter
  - `features/landing-page/studio/work-gallery/work-gallery.tsx`
    - `features/landing-page/studio/work-gallery/work-gallery-data.ts`
    - `features/landing-page/studio/work-gallery/work-gallery.module.css`
    - `data/projects.ts`
    - `features/case-library/cases.ts`
  - `features/landing-page/studio/section-head.tsx`
    - `features/landing-page/studio/script-word.tsx`
    - `features/landing-page/studio/reveal.tsx`
      - `features/landing-page/studio/use-in-view.ts`
    - `features/landing-page/studio/doodles.tsx`
  - `features/landing-page/studio/studio.module.css`
- `features/landing-page/studio/showcase.tsx`, `skills.tsx`, `journey/sticker-journey.tsx`, `contact.tsx`, `site-footer.tsx`
- `features/landing-page/studio/chapter-rail.tsx`, `use-page-position.ts`, `use-landing-motion.ts`

## /design-system
Entry: `app/design-system/page.tsx` → `features/design-system/*` + `features/case-library/cases.ts` (`DESIGN_CASES`).

## /projects
Entry: `app/(booth)/projects/page.tsx` → `data/projects.ts` (`WORK_PROJECTS`), archive chrome.

## /sunnyside
Entry: `app/sunnyside/page.tsx` → `features/design-system/sunnyside-data.ts` (token specimen, exports).
