# Lessons from Case 01 and Case 02

## Case 01: the bar

Sunnyside is the best result because it ships a **mark system**, not a mark:

- one primary mark, a separate compact drawing and a glyph;
- a hand-drawn marker wordmark, frozen as outlines;
- a cast of six supporting marks with one cut line, one fill and one job each;
- a four-movement marks composition: logo card, wordmark scale, cast drawer,
  one usage rule;
- a dark stage, paper cards, rails, specs and do/don't that make the system
  inspectable in one screen.

The rule is not “add a smiley”. It is: **copy the principle, not the sun.** A
database brand with a sun and a smiley is lying. A database brand can still have
a drawn wordmark, a 4–6 cast derived from its own world, and the composition.

## Case 02: the caution

The Vitrine audit is the evidence for this revision. It shipped a new brand, a
design system, forms, a case page and a case library; the failures below are the
ones worth turning into rules.

## 1. What the audit found

- Skill resources: 16/16 present; 10 used as shipped, 4 substituted, 2 not used.
- Output contract: 12/12 shipped.
- dithercn: 31 files installed, engine current, one custom shader, no example.
- Gaps: board size, no social/print crops, no automated visual/axe CI, favicon
  uses a field instead of a transparent mark, no generated imagery, Chromium-only.

The lesson is not “write more docs”. It is “make the proof cheap to re-run”.

## 2. Specific failures and the rule that prevents them

### 2.1 Generic image rules beat state classes

`.lockup img { display: block }` overrode `.onlyDark { display: none }`, so both
the light and dark logos rendered and the hidden one left a dotted edge.

**Rule:** never let a generic element rule set `display` on an asset that has a
theme/state class. Scope the image rule under the component, or raise the state
class's specificity. Test both themes with a computed `display` check.

### 2.2 Broad link rules beat component colours

`.page a { color: inherit }` overrode `.primaryButton`, so the Signal button had
light text (about 1.2:1) instead of Case (17:1).

**Rule:** broad resets (`a`, `button`, `img`) are traps. Use `:where()` for a
zero-specificity reset, or explicitly re-assert component colour with
`.page a.primaryButton`. Add a computed-style assertion for the primary CTA.

### 2.3 Scripted edits can break state selectors

A global replace of `.switchThumb {` also matched `.switchOn .switchThumb {`,
turning it into `.switchOn .switch::before` and applying the on-state transform
to every thumb. The off switch looked on.

**Rule:** after a CSS edit, test the state pair (off/on, light/dark) through
computed transform, background and `aria-checked`. A screenshot of one state is
not enough.

### 2.4 Route moves are a checklist

Moving the case from `/design-system` to `/design-system/vitrine` touched:
canonical, OG URL, route icons, favicon files, sitemap, Markdown twin, board
URLs, the design-engineering manual, docs, screenshots and generated route types.

**Rule:** use a route-rename checklist. Run `next typegen` or restart the dev
server. Stale `.next/dev/types/validator.ts` is generated, not a source error.

### 2.5 Dark inverse scopes drift

`.onCase` duplicated the dark semantic/component tokens so dark plates could
live inside a light page. It works, but it is a second copy of the dark values.

**Rule:** prefer a `data-theme="dark"` wrapper or generate both token blocks from
one source. If you duplicate, add a sync check that compares every token name
and value.

### 2.6 Boards overflow silently

A cover meta line pushed the sub/URL below the 554px panel and the board clipped
it. The full board looked fine at 50% but not at 100%.

**Rule:** after rendering, inspect the cover and every panel at 100% and 50%.
Check text clipping, overlap, and the URL/meta fit. Remove redundant meta before
shrinking type.

### 2.7 A transparent dark favicon disappears

The mark is Case ink; a transparent favicon vanished on dark browser chrome.

**Rule:** give the favicon a field (Signal) or ship light/dark variants and test
at 16px on both chromes. The compact mark is a separate drawing, not a scaled one.

### 2.8 Token tables get stale

The page, the JSON, the CSS and the docs each had token values. The generator
solved it; hand edits would not.

**Rule:** one token source → generated CSS + JSON + page data. Never hand-edit
generated output. The audit compares the exported pairs, not the prose.

### 2.9 QA by screenshot misses computed style

The switch, the button colour and the logo duplication were all CSS specificity
bugs. A screenshot at one state looked plausible; computed styles exposed them.

**Rule:** the QA script records overflow, console errors, shader state and the
computed styles of the CTA, the switch (off/on) and the theme logos. It is one
run, not a reading of every file.

### 2.10 Fewer artifacts, more proof

The first version put the full case at `/design-system`, then added a case
library and a manual block. The final structure is better: an index, one full
case, one manual section, one board. Five near-duplicate pages would have been
worse.

**Rule:** one case page, one index card, one manual section, one board, one
Markdown twin. If a fact appears twice, one copy links to the other.

## 3. The audit that changed this skill

The Vitrine audit is in `docs/vitrine-design-system-audit.md` in the Sunnyside
repository. The useful parts to copy into a new case:

- a resource table (present / used / substituted / not used);
- an output-contract table (shipped / partial / gap);
- a dither or engine check (files, version, one effect, reduced motion);
- six named gaps, not a vague “future work”;
- screenshot paths for each viewport/theme/state.

The audit is a gate, not a brochure. If it has no failing check and no gap, it
probably did not look.

## 4. What to keep doing

- Brief before canvas; one sentence the work can be rejected against.
- Choose the track: constructed (v2.3 gate) or drawn (v2.4 gate).
- Six marks in one file; one kept; five rejected with reasons.
- Wordmark as outlines or a frozen drawing; compact mark as a separate drawing.
- A drawn identity ships a 4–6 cast and the marks composition.
- One token source → CSS + JSON; no raw hex in components.
- One signature effect; everything else quiet.
- One full HTML board rendered from source; one downscaled web copy.
- The page readable without JavaScript, with a Markdown twin.
- One `qa.mjs` command (audit + score + browser), one look, one fix pass, stop.
