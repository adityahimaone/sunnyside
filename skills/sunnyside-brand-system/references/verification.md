# Verification

Run this before calling the kit finished. A kit is not done when the board looks
good; it is done when the smallest file works.

## Lean path

Do not read every file. Run the static audit, one browser pass, and look at the
screens the scripts cannot judge.

```bash
node scripts/audit.mjs --manifest audit.json
node scripts/qa.mjs --url http://localhost:3000/design-system/<slug> \
  --out docs/screenshots --name <slug>
```

Then inspect:

1. the mark at 16px and the header size, light and dark;
2. the lockup at 130/240 and the 390px header;
3. the board at 100% and 50%;
4. form focus, error, disabled and success;
5. one dark and one light section with the effect behind text;
6. no horizontal scroll at 390 and no console/shader errors.

Write **Not verified** for anything you could not inspect. Never approve
coverage you did not see.

## Audit format

One table, one row per root cause, every location:

| Status | Item | Evidence | Note |
| --- | --- | --- | --- |
| pass | Mark at 16/32/64/512 | `public/brand/...` | compact is a separate drawing |
| fail | Contrast on Signal button | `features/...:line` | 1.2:1, must be 4.5:1 |
| gap | No visual regression CI | — | named, not hidden |

Finish with `PASS` only when every row is pass and the gaps are named. A case
with no gap probably did not look.

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
- [ ] Type scale has real sizes, unitless line-height and `em` tracking.
- [ ] Body 16–18px; labels 8–11px with 0.14–0.2em; no 100–300 weight under 18px.
- [ ] Measure capped at 60–75 characters; no paragraph set in the display face.
- [ ] `text-wrap: balance` on headings, `pretty` on paragraphs only.
- [ ] `tabular-nums` on counters, prices and numeric columns.
- [ ] Inputs at 16px on mobile, or the documented alternative.
- [ ] The board's labels are readable at 50%.
- [ ] `references/typography.md` gate complete.

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
- [ ] The case route and the case-library index both resolve; icons are segment-local.
- [ ] A moved route updated canonical, OG, sitemap, llms, links and tests.
- [ ] The page has a Markdown twin at `<case>/llms.txt`.
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
- the page's only copy is behind a tab or a script;
- a stale generated route type or `.next` artifact is being treated as source.

Otherwise `Approve` and leave the remaining polish as work to do.
