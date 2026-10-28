# Verification

Run this before calling the kit finished. A kit is not done when the board looks
good; it is done when the smallest file works.

## Lean path

Do not read every file. Run one command, then look at the screens the script
cannot judge.

```bash
node scripts/qa.mjs --url http://localhost:3000/design-system/<slug> \
  --slug <slug> --manifest audit.json --mark public/brand/<slug> --sections
```

It runs `audit.mjs` from the manifest directory, `score-mark.py` on the mark
directory, and one browser pass at 1440 and 390, light and dark, plus reduced
motion. It writes `docs/<slug>-qa.md` and a JSON twin. `--quick` skips the 390
dark run, full-page captures and sections. Use `localhost`, not `127.0.0.1`, for
Next dev; the script rewrites the IP and says so.

Then inspect:

1. the mark at 16px and the header size, light and dark;
2. the lockup at 130/240 and the 390px header;
3. the marks composition: logo card, wordmark scale, cast drawer, usage rule;
4. the board at 100% and 50%;
5. form focus, error, disabled and success;
6. one dark and one light section with the effect behind text;
7. no horizontal scroll at 390 and no console/shader errors.

Write **Not verified** for anything you could not inspect. Never approve
coverage you did not see. The generated report is the audit; a screenshot alone
is not a verdict.

## Review order and escalation

Review in this order so foundation failures are not hidden by polish:
**accessibility → layout → writing → typography → colour → UI polish.** If an
owning skill is unavailable, mark that domain **Not reviewed**; never claim it.

These are `HIGH` on sight, whatever the style guide says:

- an interactive control with no accessible name;
- a keyboard-reachable control with no visible focus;
- a pointer-only control or path;
- motion or autoplay that ignores `prefers-reduced-motion`;
- content clipped, overlapped or unreachable at 320px or 200% zoom;
- body/control text whose rendered contrast pair fails;
- state or meaning carried by colour alone;
- a destructive action with no confirmation, undo or distinct treatment;
- truncated content with no way to reach the full value;
- content behind a scroll edge or disclosure with no visible cue;
- an error that names no recovery;
- a semantic colour used against its meaning;
- a state change carried by motion alone.

Prefer the cheaper fix, in this order: **delete → use the platform → reuse what
the project has → correct the value → add.** One root cause is one row, with every
location. Cap the report at 15 findings; a short report is valid. A finding needs
`path:line` plus a rendered/runtime check; source alone cannot prove a visual
finding, and a screenshot alone cannot prove a code finding.

## Layout gate

- Space groups first; separators last. The gap between groups is at least 2× the
  gap within one.
- Controls are visually distinct from content; one primary action per view.
- Shared alignment edges; DOM order matches visual order.
- Direction-dependent layout uses logical properties; test the RTL mirror.
- Hidden or truncated content has a visible cue and a way to the full value.
- Controls stay inside the margins and safe areas; content may bleed.
- `minmax(0, 1fr)` / `min-width: 0` for long text and tables; `100dvh` not
  `100vh`; `min-height` on text boxes; `scroll-padding-block-start` under sticky
  chrome.
- Test 320px, 200% zoom and the largest supported width; clip or overlap is
  `HIGH`.

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

## Mark system

- [ ] The track is named (constructed or drawn) and the gate matches it.
- [ ] The primary, compact and glyph exist; the compact is a separate drawing.
- [ ] The wordmark is drawn or outlined; no `<text>`; clear space and minimum.
- [ ] Drawn track: one cut line, one flat fill, one hard offset, 2–3 inks.
- [ ] The cast has 4–6 marks; each has a one-line job; one cut line, one fill.
- [ ] Drawn track: `"cast"` is in `audit.json`; the audit checks 64 grid, cut line, live text and 4–6.
- [ ] The cast is `aria-hidden` and never carries a fact alone.
- [ ] The marks composition has a logo card, wordmark scale, cast drawer and one rule.
- [ ] The composition reads at 1440 and 390; the cast drawer does not become a table.
- [ ] The guide says when to use the cast and when to skip it.

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
- [ ] The marks composition is present: logo card, wordmark, cast or rule.
- [ ] The real fonts loaded; no fallback visible.
- [ ] Sparse text, no fake copy.
- [ ] One loud field, quiet cover.
- [ ] Exported at 2× and downscaled with Lanczos.
- [ ] Web copy under ~1 MB; full-resolution source kept.
- [ ] Board image referenced from the guide.

## Docs

- [ ] The idea, the mark, the family, colour, type, icons, do/don't, gaps.
- [ ] The wordmark route is named (drawn or outlined) and frozen.
- [ ] The cast, if present, has 4–6 jobs and one usage rule; if absent, say why.
- [ ] Clear space and minimums are specific.
- [ ] Every claim points to a shipped file or route.
- [ ] File paths are real.
- [ ] One h1; headings in order; section IDs.
- [ ] Raw Markdown twin exists and is linked, if the host publishes docs.
- [ ] Last updated and version shown.
- [ ] No invented metrics or fake screenshots.

## Accessibility and interaction

- [ ] Keyboard path through every control.
- [ ] Visible focus on every surface/theme.
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
- [ ] If a web route exists: sitemap, canonical, OG and icons are correct; otherwise **Not applicable**.
- [ ] If a case library exists: the case and index resolve; icons are segment-local; otherwise **Not applicable**.
- [ ] If a route moved: canonical, OG, sitemap, llms, links and tests are updated.
- [ ] If the host publishes one: the Markdown twin exists; otherwise **Not applicable**.
- [ ] For Storybook/standalone/pen/print: the surface's own checks pass (stories, console, exports, crops).
- [ ] The installation command for the skill works.
- [ ] The gaps are named.

## Sign-off

`Block` if any of these is true:

- the mark fails at 16 or 32px;
- the wordmark is live text or missing;
- there is no compact/favicon variant;
- a brand kit or design system has no marks composition (logo card, wordmark
  scale, cast or rule);
- a drawn identity has no cast and no reason to skip it;
- contrast fails on body text;
- the guide hides a known gap;
- the board is an AI image with the logo in it;
- the page's only copy is behind a tab or a script;
- a stale generated route type or `.next` artifact is being treated as source.

Otherwise `Approve` and leave the remaining polish as work to do.
