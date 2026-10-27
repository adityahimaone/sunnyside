# Riso Co. / Atelier Ink — Identity & Design System

## Core Idea
A torn poster pinned to a studio wall. Vibrant risograph ink sheets on raw warm vellum, anchored by a high-gloss pushpin.

## Assets & Structure
- `design/brand/riso/brief.md`: Strategic brief and domain constraints.
- `design/brand/riso/explorations/directions.md`: The six mark directions evaluated and the rejection log.
- `public/brand/riso/`: Vector marks, lockups, brand board, and exported tokens.
- `features/riso/`: Tokens, scoped styles, form kit, and interactive component specimens.
- `app/design-system/riso/page.tsx`: The full interactive specimen route.
- `app/design-system/riso/llms.txt/route.ts`: Agent-readable Markdown documentation twin.
- `components/ui/pushpin-tear-footer.tsx`: The canonical pushpin tear footer component.
- `components/ui/demo.tsx`: The Riso Co. vermilion edition demo.

## Color Roles
- `--rs-sheet`: Vibrant top poster sheet (`#ff4a1c` vermilion, or `#1a7ff0` cobalt).
- `--rs-paper`: Underlying unbleached fiber pulp (`#f1ede4`).
- `--rs-ink`: Deep soot carbon for typographic legibility (`#1b1712`).
- `--rs-steel`: Calibrated steel metalwork for mechanical accents (`#5b616b`).

## Accessibility & Contrast
All contrast pairings exceed WCAG AA 4.5:1 for body copy and 3.0:1 for large display elements. Keyboard focus rings utilize high-contrast 2px offset outlines.
