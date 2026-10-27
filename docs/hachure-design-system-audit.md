# Hachure — design-system audit (Case 05)

**Verdict: ship, with the gaps below named.** The system has a brief, a kept
mark, one token source, a form kit, a proof page, a board and a raw Markdown
twin. Print output and a screen-reader pass are not verified, and the Playwright e2e
suite was skipped by instruction; a manual Playwright pass covered the page,
the form, the draft and the case card.

- Route: `/design-system/hachure`
- Board: `public/brand/hachure/hachure-brandkit.png`
- Tokens: `features/hachure/tokens.json`
- Decisions: `design/brand/hachure/brief.md`, `design/brand/hachure/DESIGN.md`
- Screenshots: `docs/screenshots/hachure-1440-{hero,study,specimen,dark}.png`, `hachure-390-hero.png`

## Scorecard

| Dimension | Result | Evidence |
| --- | --- | --- |
| One-sentence brief | Pass | “Relief drawn by density, never by shadow.” in `brief.md` and `DESIGN.md` |
| Six directions, one kept | Pass | `design/brand/hachure/explorations/directions.md`; the page's section 04 lists all six and why five lost |
| Mark at 16 / 32 / 64 | Pass | `public/brand/hachure/mark.svg`, `mark-compact.svg`, `favicons/favicon-{16,32,180}.svg`; one path, 14 foot cells |
| Tokens, one source | Pass | `features/hachure/tokens.json` → `hachure-tokens.css`, public CSS/JSON and `brand-paths.ts` by `scripts/build-hachure-brand.mjs`; nothing downstream hand-edited |
| Contrast measured, not typed | Pass | 18 pairs computed in the build from the semantic layer |
| Typography gate | Pass | Two families (Geist Mono / Geist); body 17px at 1.6; labels 11px at 0.14em; measure ≤ 68ch; tabular numerals; `text-wrap: balance` on headings |
| Form kit | Pass | 11 native controls, error summary with focus, success state, visible focus; `features/hachure/components/form-demo.tsx` |
| Responsive 1440 / 390 | Pass | `scrollWidth === clientWidth` at both; no clipped grids. Mobile page height ≈21.6k px |
| Dark theme | Pass | `data-theme` on `data-hachure-root`; the footer follows via `MutationObserver` and gets its own night ramp, not an inversion |
| Reduced motion | Pass | Footer resolves to the finished plate; `rdf-in` and opacity 1 under `reducedMotion: 'reduce'` |
| Board | Pass | 1500 × 1125 PNG rendered at 2× and downscaled; the plate on it is drawn by the browser |
| Docs twin | Pass | `/design-system/hachure/llms.txt` → 200, 12,001 bytes, contains the sentence and the 4.82:1 accent ratio |
| Case library | Pass | `/design-system` card 05 links to the route, cover `hachure-brandkit.png` |
| E2E | **Skipped** | Explicitly out of scope; the manual pass in `scripts/verify-hachure.mjs` still ran |

## Measured

- **Contrast:** 18 pairs. 17 pass AA. One fails by rule: lichen `#C9D94E` as
  type is **1.40:1** on stock (3:1 floor for display, 4.5:1 for text), so it is a
  fill-only colour. The range accent (tone 5) is **4.82:1** light and **5.06:1**
  night, which is why it is the only tone allowed to set footer links, badges and
  the focus ring. Night body text is 16.21:1.
- **Tone ramp:** seven steps per theme. Night is a separate ramp
  (`#0A110D → #A6D2B0`) where near ridges get lighter; it is not the light ramp
  inverted.
- **Mark:** 64 grid, 14 foot cells, one path; compact redrawn on a 2-unit grid.
- **Page weight:** no images at runtime on the route; the hero, study and range
  thumb are canvas drawn by the same engine, and every mark is SVG.
- **Keyboard:** the skip link is the first tab stop; submitting the empty form
  moves focus to the `role="alert"` summary and marks three fields
  `aria-invalid="true"`; a valid submit replaces the form with a `role="status"`
  confirmation.

## Fixes made during this pass

1. **The mark clipped its own knee.** `BODY_BOTTOM` was 34, which cut the
   profile above the knee at `(38, 34)` and turned an asymmetric ridge back into
   a triangle. Moved to 42 with two dissolve rows at 82% / 44% coverage — the
   geometry the brief already described.
2. **The plate's fade ran the wrong way.** `drawRange` faded from the middle
   *down*, leaving the top of every plate empty and only the bottom 42% printed.
   It now dissolves upward into the paper, as the component does.
3. **The accent tone was under 4.5:1.** Light tone 5 moved `#5C7C55` → `#557347`
   (4.24 → 4.82), and the night ramp was retuned so tone 5 measures 5.06:1.
4. **The fusion rows overflowed.** The note column was `auto`, so long verdicts
   pushed the grid past its track. It is now a sized track that wraps, with the
   note left-aligned.
5. **The altimeter wrapped its unit.** `2,480 m` split across lines; the value is
   now `flex: none` and `nowrap`.
6. **One lint failure in the supplied component.** A ref was mutated during
   render (`opts.current = …`). Moved into an effect; behaviour is unchanged and
   the draw loop still reads the latest props each frame.
7. **“Save as draft” was a dead control.** It now writes the report to
   `localStorage` and restores it on the next visit; filing a report clears the
   draft. The note under the form is true.

## Not verified

- **Print.** The palette is a screen approximation of a two-ink survey sheet;
  halftone at 2px, paper absorption and the real lichen ink have not been
  proofed. The board is a screen render of a paper artefact.
- **The altimeter's number** is a generated elevation, not a surveyed one.
- **Safari.** The component's `backdrop-filter` badge was not checked in Safari.
- **Screen reader.** Focus and ARIA were checked structurally, not with
  VoiceOver/NVDA.
- **Performance.** No Lighthouse/INP run. Three canvases draw on this route (hero,
  study, range thumb) plus the footer; the hero and footer stop after their
  entrance, and the study redraws only on control change or resize.
- **The board's plate** uses a mirrored copy of the ridge maths because the board
  is a standalone HTML file. `features/hachure/dither-field.ts` and the component
  remain the source of truth; a change to the tone formula must be mirrored in
  `design/brand/hachure/brandkit.html`.
- **E2E** was skipped as instructed (`npm run test:e2e` not run).
- **Automated axe/Lighthouse** was not run; contrast is computed, focus is
  structured, but there is no automated accessibility scan in CI.

## Next

1. Proof one sheet: a real raster at 2px, lichen and pine on uncoated stock.
2. Feed the altimeter real elevation tiles, or label it “modelled” in the
   component.
3. Add a Storybook/Ladle story for the footer if the host ever gains one; until
   then the route is the only surface.
4. Run the full browser pass on the case once e2e is back in scope.
