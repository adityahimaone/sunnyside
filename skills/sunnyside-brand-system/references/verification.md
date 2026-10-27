# Verification

Run this before calling the kit finished. A kit is not done when the board looks
good; it is done when the smallest file works.

## Mark

- [ ] Silhouette reads at 32px.
- [ ] Compact mark reads at 16px on paper and on ink.
- [ ] Face reads at 32px (if present).
- [ ] SVG viewBox is square and the same across variants.
- [ ] No live text, no embedded raster, no clipart.
- [ ] Hard offset is solid and consistent; no blur.
- [ ] Reversed version exists and uses the paper wordmark.
- [ ] The glyph (no tile) is not used as a favicon.

## Family

- [ ] Mark, wordmark, horizontal lockup, stacked lockup, compact mark.
- [ ] Clear space drawn at half the mark height.
- [ ] Minimum sizes written down.
- [ ] Responsive lockup tested at 480 and 360.
- [ ] The name and wordmark line up optically in the header.
- [ ] The lockup holds at 130px, 240px and 512px.

## Favicon and app icons

- [ ] ICO contains 16, 32 and 48.
- [ ] SVG icon exists.
- [ ] Apple icon is 180 × 180 with a background.
- [ ] 192 and 512 app icons exist.
- [ ] 16px checked at 1× on light and dark chrome.
- [ ] Transparent corners, no stray shadow.

## Colour

- [ ] Body text at 4.5:1; large text at 3:1.
- [ ] Ink on paper, cream on cobalt, ink on butter tested.
- [ ] Accent colours are not used for small body text.
- [ ] One loud field per view.
- [ ] Colour is not the only carrier of meaning.
- [ ] Swatches in the board are opaque (check parent opacity).

## Type

- [ ] Display, reading and label faces named.
- [ ] Wordmark is outlined, not live text.
- [ ] Type scale has real sizes and tracking.
- [ ] Labels at 8–11px with 0.14–0.2em tracking.
- [ ] No paragraph set in the display face.
- [ ] The board's labels are readable at 50%.

## Board

- [ ] 2400 × 1800, 3 × 3, 54px outer padding, 14px gutters.
- [ ] The real SVG mark, not a screenshot.
- [ ] The real fonts loaded; no fallback visible.
- [ ] Sparse text, no fake copy.
- [ ] One loud field, quiet cover.
- [ ] Exported at 2× and downscaled with Lanczos.
- [ ] Web copy under ~1 MB; full-resolution source kept.
- [ ] Board image referenced from the guide.

## Docs

- [ ] The idea, the mark, the family, colour, type, icons, do/don't, gaps.
- [ ] Clear space and minimums are specific.
- [ ] Every claim points to a shipped file or route.
- [ ] File paths are real.
- [ ] One h1; headings in order; section IDs.
- [ ] Raw Markdown twin exists and is linked.
- [ ] Last updated and version shown.
- [ ] No invented metrics or fake screenshots.

## Accessibility and interaction

- [ ] Keyboard path through every control.
- [ ] Visible focus on paper, ink and cobalt.
- [ ] 44px targets with 8px between.
- [ ] Reduced motion path; no motion-only state.
- [ ] Hover only under `@media (hover: hover)`.
- [ ] Press feedback (scale 0.96, 150ms) on buttons, never on disabled.
- [ ] Transitions name properties; no `transition: all`.
- [ ] Images have an outline or a border.
- [ ] Tables have headers and a reading order.

## Delivery

- [ ] SVG, PNG, ICO and token files exist at the stated paths.
- [ ] The guide's links resolve.
- [ ] The page is in the sitemap and has a canonical URL.
- [ ] The OG/social card uses the mark.
- [ ] The installation command for the skill works.
- [ ] The gaps are named.

## Sign-off

`Block` if any of these is true:

- the mark fails at 16 or 32px;
- the wordmark is live text;
- there is no compact/favicon variant;
- contrast fails on body text;
- the guide hides a known gap;
- the board is an AI image with the logo in it;
- the page's only copy is behind a tab or a script.

Otherwise `Approve` and leave the remaining polish as work to do.
