---
name: implement-brand-system
description: Implement an approved brand kit or design system as a single-page HTML/TSX build — token mapping, shadcn/Radix primitives, forms, responsive and dark states, motion, metadata and lean QA. Use after sunnyside-brand-system; implement the identity faithfully, do not redesign it.
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '1.0'
---

# Implement a brand system

Take the kit, ship the proof. This skill starts **after** the brand decision is
approved. If the mark, palette, type or one effect is still moving, stop and use
`sunnyside-brand-system` first.

It is the execution half of the flow, built from the same
[ui-skills audit](../sunnyside-brand-system/references/ui-skills-fusion.md):

```
brief → sunnyside-brand-system → approved kit → implement-brand-system → proof page
```

## Inputs

| Input | Needed for | If missing |
| --- | --- | --- |
| `brief.md` | Audience, promise, constraints, references | Ask for the one-sentence promise and the stack |
| `DESIGN.md` / `design.md` / the project's design guide | Decisions, tokens, component rules, what not to do | Derive a short one from the tokens and board; do not invent intent |
| `tokens.json` + `tokens.css` | Every colour, type, space and radius decision | Stop; the brand pass is not done |
| `public/brand/<slug>/` | Mark, wordmark, lockups, favicon, icons | Stop; do not redraw the mark |
| Board PNG + `brandkit.html` | Visual reference, section composition | Use the tokens; do not screenshot the board as the page |
| System notes | Components, forms, motion, voice, gaps | Ask for the 5–10 primitives and the one effect |
| Target route + stack | Where this ships | Ask: HTML mockup, TSX page, or pen source |

Use the smallest input set. Do not re-run discovery on a kit that already has a
brief, tokens and a board. Do not create a second token schema.

## Handoff contract

A kit is ready to implement when it has:

- a one-sentence direction and a short `DESIGN.md`;
- primitive → semantic → component tokens, exported as CSS and JSON;
- mark, compact mark, outlined wordmark and lockups at real paths;
- a favicon and app-icon set tested at 16px;
- a board rendered from source, plus the source HTML;
- the component inventory, form states and the one effect;
- an audit with named gaps.

If the kit has all of that, do not redesign it. If it is missing one item, ask for
that item or record `GAP` and proceed only when the missing piece does not change
the identity.

## First pass: audit the kit

1. Read the brief, `DESIGN.md`, tokens and the board.
2. Check that every asset is a **real vector**, not `<text>` or a screenshot.
3. Confirm the token count and the contrast pairs in the rendered themes.
4. List the page sections and the components the kit promises.
5. Name what is missing before writing code.

Report the gap list in one table:

| Status | Item | Evidence | Action |
| --- | --- | --- | --- |
| ready / gap / not verified | … | path or URL | … |

Do not turn a gap into a redesign. A missing hover state is a gap; a different
palette is a different brand.

## Choose the target

| Target | Use when | Rules |
| --- | --- | --- |
| **Single HTML** | Board, static case, mockup | One file + token block; native form; no build; render at 2× |
| **TSX** | Design system, forms, interactive case | Server page + small client islands; shadcn/Radix; metadata API |
| **Both** | Board + product page | One token source; HTML is the review artefact, TSX is the product |
| **Pen** | A `.pen` source already exists | Use `pen-dev`; the code tokens and page are still the product |

Use the brand skill's `templates/single-page.html` and
`templates/case-page.tsx` as scaffolds. Copy them; do not rebuild a page shell.

## Implementation sequence

### 1. Tokens first

- Preserve the token names. Map primitives → semantic → component.
- Components read semantic/component tokens; no raw hex in a component.
- One neutral ramp, one accent, only the status colours the UI renders.
- One filled primary action per view; the accent is not body text.
- Dark tokens come from the same source. Do not duplicate a second dark set in an
  inverse scope without a sync check.
- Measure the **rendered** foreground/background pair, including alpha and the
  effect behind it. Body 4.5:1, large text 3:1.

```css
:root {
  --paper: #f3ecdf;
  --ink: #191a2e;
  --accent: #3d53d6;
  --accent-ink: #fffaf1;
  --focus: #ffd23f;
}
```

If the project uses Tailwind v4, expose the same decisions as theme variables;
do not create `brand-blue` and `primary` in parallel.

### 2. Shell

- Nav with the real lockup, 3–5 in-page links, and a theme toggle only if the
  system has two themes.
- Skip link, `main` landmark, one `h1`, semantic section headings.
- Footer with the brand, downloads and what the case is not.
- Static content must render without JavaScript.

### 3. Sections

One route is enough for a proof page:

1. **Hero** — the one idea, the one effect, one sentence, 2 CTAs, 3–4 facts.
2. **Material** — show the effect and the rule that keeps content readable.
3. **System** — one real form plus an anatomy/states aside.
4. **Tokens** — three layers, a small table, contrast pairs, downloads.
5. **Audit** — resources, contract, engine check, named gaps.
6. **Footer** — brand, downloads, links.

Use the brief's real copy. No lorem. If you use numbers, they must be an actual
sequence; otherwise remove the numbered markers. If you accent one word, it must
name the material or the decision, not decorate the headline.

### 3.5 Composition checkpoint

For each high-value section or component, state the decisions before writing it:

```
Intent:     who is this for, what must they do, how should it feel
Hierarchy:  the one focal element, and how it wins (size / weight / contrast / space)
Palette:    the roles used, and why they fit this world
Depth:      borders, shadows or surface shifts — one strategy
Surfaces:   the elevation scale
Typography: family, size/weight/colour levers
Spacing:    base unit and chosen density
```

If you cannot fill that in, you are defaulting. One focal point per view; a type
ratio around 1.2–1.333 with weight and colour doing as much work as size; a
chosen density repeated; roughly 60/30/10 neutral/secondary/accent; one depth
strategy; inputs slightly darker than their surface. Squint: the hierarchy should
survive, and nothing should jump out.

### 4. Components

Classify every section before writing it:

- `already-connected` — reuse the existing component;
- `exact-swap` — a shadcn/Radix primitive fits;
- `compose-from-primitives` — build from existing primitives;
- `blocked` — the system has no primitive; document a local exception.

Then:

- Use shadcn/Radix for keyboard/focus behavior; native elements for text, email,
  password, textarea, checkbox, radio, file.
- Use the **installed** shadcn version. If it lacks `FieldGroup`/`InputGroup`, use
  a native label + input with the same ARIA; do not upgrade the library for a
  wrapper.
- No custom select, dialog, switch or tabs when a primitive exists.
- One focus system; never remove a visible focus ring.
- Icon-only buttons get an `aria-label`; decorative icons are `aria-hidden`.
- No manual `z-index` on overlays; let the primitive portal.
- No `transition: all`; no layout-property animation.

Minimum state set: default, hover, focus-visible, active, disabled, invalid,
loading. Add selected/checked where relevant.

### 5. Forms

- Visible label for every control; placeholder is not a label.
- Hint or reason when the format is non-obvious.
- Error text linked by `aria-describedby`; `aria-invalid="true"` on the control.
- Error summary: `role="alert"`, `tabindex="-1"`, focused on invalid submit,
  each item links to its field.
- Keep values and labels visible when disabled; explain a disabled submit.
- 44px targets where practical; 16px inputs on mobile.
- Password reveal is a button with an accessible name, not an eye icon alone.
- Use a fieldset + legend for radio/checkbox groups.

```tsx
// error is a string | undefined
<label htmlFor="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  aria-invalid={Boolean(error)}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error ? <p id="email-error">{error}</p> : null}
```

### 6. Type, colour, layout, responsive, dark

- Run the typography gate before the first screenshot: 2–3 families, 16–18px
  body, unitless leading, 60–75ch, `em` tracking, `text-balance`/`pretty`,
  `tabular-nums` on changing values.
- Keep the project's colour notation. For a new system, `oklch()` is a good
  default; for an existing hex system, stay in hex. One colour, one meaning.
- Test 390, 768 and 1440. No horizontal overflow. Reflow the nav, hero and form;
  do not just shrink type.
- Layout: group with space before lines; the gap between groups is ≥2× the gap
  within. Shared edges; DOM order matches visual order; one primary action.
- Use `minmax(0, 1fr)` / `min-width: 0` for long text and tables; `100dvh` not
  `100vh`; `min-height` on text boxes; `scroll-padding-block-start` under sticky
  chrome.
- Direction-dependent layout uses logical properties (`margin-inline-start`,
  `padding-inline-end`, `text-align: start`); test the RTL mirror.
- Content may bleed; controls stay inside margins and safe areas. Hidden or
  truncated content has a cue and a way to the full value.
- Test 320px and 200% zoom as well as 390/1440; clipping or overlap is a blocker.
- Dark mode uses one switching mechanism (`.dark` or `data-theme`), not both.
  Test computed colors for CTA, fields, borders and the effect.

### 7. Motion, material and performance

- Decide **whether** it should animate before choosing how. Frequency decides:
  high-frequency interactions get no or ≤150ms feedback.
- Animate `transform`/`opacity`; do not animate width, height, top/left, margin or
  padding. Do not poll scroll; use IntersectionObserver or scroll/view timelines.
- `ease-out` on entrance, shorter exits. Press scale `0.96` over `150ms` or the
  project's documented equivalent; never on disabled.
- Springs: critically damped by default; bounce only after a gesture carried
  momentum. Reduced motion gets a finished, static state.
- Glass: one material, content on solid fields, no continuous blur animation,
  no blur on large surfaces. If the effect sits behind text, measure the actual
  composite. Provide a `@supports` fallback.
- Server first; small client islands. No heavy animation library for a hover.

### 8. Metadata, routes and QA

Metadata:

- Title, description, canonical and `og:url` agree; OG/Twitter images are
  absolute; icons and `theme-color` are intentional; JSON-LD only when it maps to
  real content.
- One metadata owner per page; no duplicates.

Routes:

- Case page, index card, manual section and `<case>/llms.txt` link to each other.
- A moved route updates canonical, OG, icons, sitemap, llms, nav/footer, board
  URLs, audit evidence and tests. Run `next typegen` or restart the dev server;
  `.next` generated types are not source.
- Case icons are segment-local.

QA (run from the brand skill folder, or copy `scripts/` into the project):

```bash
node <path-to-sunnyside-brand-system>/scripts/audit.mjs --manifest audit.json
node <path-to-sunnyside-brand-system>/scripts/qa.mjs \
  --url http://localhost:3000/design-system/<slug> \
  --out docs/screenshots --name <slug>
```

Review in this order: **accessibility → layout → writing → typography → colour →
polish.** The escalation triggers in the brand verification reference are `HIGH`
on sight; do not average them down because the surface is minor. Prefer the
cheaper fix: delete → platform → reuse → correct value → add.

Then check by keyboard and eye:

- tab order, focus visibility, dialog trap/restore, Escape;
- form error summary takes focus and links to the fields;
- computed styles for CTA, switch off/on, field invalid, light/dark;
- 390/1440 overflow, text over the effect, reduced-motion still state;
- no console errors, no shader fallback stuck.

Fix the root cause (specificity, token, state selector), not the screenshot. Re-run
only the failing check. Report every unrun check as **Not verified**. End with a
pass/gap table, not “looks good”.

## Fidelity contract

**Do**

- use the kit's real tokens, type, assets and one effect;
- use the brief's real content and labels;
- reuse the project's primitives and conventions;
- measure contrast and states;
- ship the page, its metadata and its Markdown twin.

**Do not**

- redesign the mark, palette, type or effect;
- introduce a second accent, a second effect or a new font;
- build a component museum instead of the page;
- use live text as the wordmark;
- hand-build a select/dialog/switch or focus trap;
- use `transition: all`, gradient soup, glow as a primary affordance, or
  `will-change` left on;
- ship without keyboard, 390, dark and reduced-motion checks.

## Efficiency

- Load this skill + the brand skill; add **one** reviewer only for the failing
  area (`better-typography`, `better-colors`, `fixing-accessibility`, etc.).
- Copy the templates and scripts; do not re-derive a page shell.
- 3–6 primitives + one real form is a system. Twenty variants is a distraction.
- One implementation pass, one QA pass, one fix pass. Stop at the acceptance
  contract.
- If a `.pen` exists, use `pen-dev` to read/export it; do not let pen replace the
  code tokens.

## Output contract

```
app/design-system/page.tsx                 # case library (if multi-case)
app/design-system/<slug>/page.tsx          # the proof
app/design-system/<slug>/llms.txt/route.ts # Markdown twin
features/<slug>/                            # tokens, module CSS, components
public/brand/<slug>/                        # real assets used by the page
docs/<slug>-design-system-audit.md         # evidence + gaps
```

Update sitemap, canonical, OG, icons, docs and the manual section in the same
change. Keep generated output generated.

## References

- `sunnyside-brand-system/SKILL.md` — the brand decision and handoff.
- `sunnyside-brand-system/references/ui-skills-fusion.md` — the audit and fused
  rules behind this skill.
- `sunnyside-brand-system/references/design-systems.md` — shadcn/Radix, forms.
- `sunnyside-brand-system/references/typography.md` — type gate.
- `sunnyside-brand-system/references/verification.md` — ship checklist.
- `pen-dev/SKILL.md` — if the source is a `.pen`.
- `sunnyside-brand-system/templates/` — page and board scaffolds.
