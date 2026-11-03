# Extractable components

## PaperCard (gallery card)
- Source: `features/landing-page/studio/work-gallery/work-gallery.tsx`
- Category: basic
- Description: taped paper card with cover frame, drawer, meta row, title
- Extractable props: `title`, `categoryLabel`, `year`, `index`, `href`, `kind` ("project" | "design-system"), `cover`
- Hardcoded: tape SVG clip path, ink outline, drag/parallax CSS

## ChapterHead (SectionHead)
- Source: `features/landing-page/studio/section-head.tsx`
- Category: layout
- Description: numbered chapter opener with marker script
- Extractable props: `number`, `label`, `script`, `title`, `intro`, `onDark`

## FilterPillBar (GalleryFilters)
- Source: `features/landing-page/studio/work-gallery/work-gallery.tsx`
- Category: basic
- Description: tablist of pill filters with counts and a moving butter pill
- Extractable props: `active`, `counts`
