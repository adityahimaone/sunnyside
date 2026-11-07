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
brief → sunnyside-brand-system → approved kit → sunnyside-taste-ui / implement-brand-system → proof page
```

> [!NOTE]
> **Sunnyside v6.0 Modular Suite:**
> - For full landing pages, marketing sites, and product screens with faux-UI stages, see **[`sunnyside-taste-ui`](../sunnyside-taste-ui/SKILL.md)**.
> - For UI component kits (8-state primitives), Apple-style dimensional anatomy drawings, and component docs, see **[`sunnyside-components`](../sunnyside-components/SKILL.md)**.
> - `implement-brand-system` remains active as a unified single-page execution reference.

## Inputs

| Input | Needed for | If missing |
| --- | --- | --- |
| `brief.md` | Audience, promise, constraints, references | Ask for the one-sentence promise and the stack |
| `DESIGN.md` / `design.md` / the project's design guide | Decisions, tokens, component rules, what not to do | Derive a short one from the tokens and board; do not invent intent |
| `tokens.json` + `tokens.css` | Every colour, type, space and radius decision | Stop; the brand pass is not done |
| `public/brand/<slug>/` | Mark, wordmark, lockups, favicon, icons, `<slug>-figma.html` | Stop; do not redraw the mark |
| Board PNG + `brandkit.html` + `<slug>-figma.html` | Visual reference, section composition, and 8-sheet Convertible Figma HTML doc | Use the tokens; generate `<slug>-figma.html` via `scripts/figma-html.mjs` if missing |
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

## Choose the target (`ask_question` — Mandatory when not specified)

> [!IMPORTANT]
> If the target format, optional page sections, or audit/E2E preference are not explicitly specified in the user's prompt, call the **`ask_question` tool** (never plain text) before writing code and wait for the user's answer:
> - **Question 1 (`is_multi_select: false`)**: `"1. Implementation Target — What kind of page or surface should we build?"`
>   - `"(Recommended) Next.js Product Route (TSX) — full design-system page inside the app with theme toggle & copyable tokens"`
>   - `"Standalone HTML Specimen — self-contained design-system.html file with zero build step"`
>   - `"Single-Page Mockup (HTML) — compact single-page proof rendered at 2x"`
>   - `"Pen Canvas (.pen) — editable pen.dev design board + synced code tokens"`
> - **Question 2 (`is_multi_select: true`)**: `"2. Page Sections & Modules — Which interactive modules should we include on the page?"`
>   - `"(Recommended) Live Type Scale & Physical Foundations — visual font specimens, spacing bars, radius chips, shadows & motion track"`
>   - `"(Recommended) Multi-Format Token Exports — copyable CSS Variables, Tailwind v4 @theme, and shadcn/Radix bridge"`
>   - `"(Recommended) Interactive Form Kit — live inputs, select menus, checkboxes, focus rings, and validation states"`
>   - `"Hero Background Field / Scrim — procedural vector mesh/bands/grain/dither background or duotone photo plate"`
>   - `"Real-World Mockups (Applications Wall) — 12-column bento grid showing cards, badges, tickets, or UI in use"`
>   - `"Companion Illustrations (Mark Cast) — drawer of 4 to 6 secondary brand marks and usage rules"`
> - **Question 3 (`is_multi_select: false`)**: `"3. Audit & Browser E2E Testing — Do you want to skip audit and E2E tests for now to save API tokens?"`
>   - `"(Recommended) Skip Audit & E2E Tests (Test Later) — fastest build, saves API tokens; skips audit section, static gates, and browser screenshots"`
>   - `"Lightweight Static Check Only — runs fast <2s contrast & token math check (gates.mjs), skips browser E2E"`
>   - `"Full Audit + Headless Browser E2E QA — builds audit docs and runs Playwright 1440/390 & screenshot checks (uses more tokens)"`

| Target | Use when | Rules |
| --- | --- | --- |
| **System specimen (HTML)** | Single-page design system, styleguide, docs | `design-system.html`; topbar + contents + hero + sections; one material |
| **Product route (TSX)** | Design system inside an existing app | Host route or settings page; server page + small client islands; shadcn/Radix |
| **Storybook/Ladle** | Component library with no page route | Stories + docs; the story is the proof; no metadata/sitemap |
| **Simple mockup** | Board, static case, one-page proof | `single-page.html`; one file; no build; render at 2× |
| **Pen** | A `.pen` source already exists | Use `pen-dev`; the code tokens and page are still the product |

Use `templates/design-system.html` for a specimen, `templates/single-page.html`
for a mockup, `templates/figma-doc.html` (generated via `scripts/figma-html.mjs`)
for the 8-sheet white-background Convertible Figma / HTML-to-Design sheet at
`public/brand/<slug>/<slug>-figma.html`, and `templates/case-page.tsx` for a case
route. Always link to `/brand/<slug>/<slug>-figma.html` in the Hero and Footer of
the showcase page. Copy them; do not rebuild a page shell. If the host has no
route, do not create one. For a TSX specimen, keep the page server-rendered and
move theme/nav/copy controls into small client islands.

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

Choose the page order from the surface, not a template:

- **System specimen** (closest to `/sunnyside`): topbar → contents → hero →
  foundation → material → marks → colour → type → parts → motion → voice →
  applications → tokens → audit/endcap.
- **Product page:** hero → material → components → forms → tokens → audit.
- **Case page:** brief → idea → decisions → system → outcome → audit.
- **No page:** Storybook story, single HTML file or `.pen`; use the same section
  order only where it helps.

Keep the hero to one idea, one effect, one sentence, 2 CTAs and 3–4 facts. The
material section shows the effect and the rule that keeps content readable. The
parts/forms section is the proof. The tokens section is the source. The audit
names the gaps.

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

Metadata — only if the host renders web pages:

- Title, description, canonical and `og:url` agree; OG/Twitter images are
  absolute; icons and `theme-color` are intentional; JSON-LD only when it maps to
  real content.
- One metadata owner per page; no duplicates.

Routes — only if the host has a router:

- Use the host's route convention. Do not invent `/design-system`,
  `/design-engineering` or a case library.
- If a case index exists, link the case, index and any Markdown twin. If not,
  skip it.
- A moved route updates canonical, OG, icons, sitemap, llms, nav/footer, board
  URLs, audit evidence and tests. Run `next typegen` or restart the dev server;
  `.next` generated types are not source.
- If there is no route (standalone HTML, Storybook, pen), skip this block and
  report **Not applicable**; do not create empty metadata or a sitemap.

Read `sunnyside-brand-system/references/workspace-contexts.md` for the full
context matrix.

Optional QA (skipped by default when `"Skip Audit & E2E Tests (Test Later)"` is chosen to save API tokens; run only when requested, or print these commands for the user to run later):

```bash
node <path-to-sunnyside-brand-system>/scripts/gates.mjs --slug <slug>
node <path-to-sunnyside-brand-system>/scripts/audit.mjs --manifest audit.json
node <path-to-sunnyside-brand-system>/scripts/qa.mjs \
  --url <the surface URL or file:// path> \
  --out docs/screenshots --name <slug> --quick
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
- ship the surface; add metadata and a Markdown twin only if the host has them.

**Do not**

- redesign the mark, palette, type or effect;
- introduce a second accent, a second effect or a new font;
- build a component museum instead of the page;
- invent a route, case library, sitemap or `llms.txt` the host does not have;
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
design-system.html / <host-route>          # the proof surface
features/<slug>/                            # tokens, CSS modules, components
public/brand/<slug>/                        # real assets used by the page
docs/<slug>-design-system-audit.md         # evidence + gaps
```

Then, only if they exist: sitemap, canonical, OG, icons, llms twin and the manual
section. For Storybook, add stories and docs; for pen, add `.pen` + exports; for
print, add PDF/PNG + rules. Keep generated output generated.

## References

- `sunnyside-brand-system/SKILL.md` — the brand decision and handoff.
- `sunnyside-brand-system/references/ui-skills-fusion.md` — the audit and fused
  rules behind this skill.
- `sunnyside-brand-system/references/visual-directions.md` — modern material systems.
- `sunnyside-brand-system/references/workspace-contexts.md` — app, docs, portfolio,
  standalone, Storybook, pen, print.
- `sunnyside-brand-system/references/design-systems.md` — shadcn/Radix, forms.
- `sunnyside-brand-system/references/typography.md` — type gate.
- `sunnyside-brand-system/references/verification.md` — ship checklist.
- `pen-dev/SKILL.md` — if the source is a `.pen`.
- `sunnyside-brand-system/templates/` — `design-system.html`, `single-page.html`,
  `case-page.tsx`, `brandkit.html`.
