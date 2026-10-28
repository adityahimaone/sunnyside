# Design systems: shadcn, Radix and the form kit

Use this reference for the **design-system** mode. The goal is a small, usable
system, not a component museum.

## 1. Start with tokens, not components

One source, three layers:

```
primitives  →  semantic  →  component
#0B0D10        --bg          --field-bg
#F2F6F8        --fg          --field-border
#D9FF43        --accent      --button-bg
```

Generate CSS and JSON from the same source. A component reads semantic or
component tokens; it never reads a raw hex. Namespace tokens when the host app
already owns names such as `--muted`, `--border`, `--primary`.

Minimum token set:

- colour: bg, fg, muted, subtle, border, surface, surface-sunken, accent,
  accent-ink, focus, danger, success, warning;
- glass/material: fill, edge, highlight, shadow (only if the brand uses it);
- type: display, reading, label, 4–6 sizes, tracking, leading;
- space: 4/8/12/16/24/32/48/64/96;
- radius: 4/8/12/16/24/pill;
- motion: fast/base/slow + one ease.

## 2. Use the project's primitives

If the app uses shadcn/ui and Radix, do not rebuild the accessible primitives.
Use them and style with the brand tokens.

| Need | Use | Why |
| --- | --- | --- |
| Text, email, password, textarea | Native `<input>` / `<textarea>` | Small, accessible, no JS |
| Checkbox, radio | Native input + styled label | Keyboard and form semantics free |
| Select | Radix `Select` or native `<select>` | Native is fine for a simple list; Radix for rich options |
| Switch | Radix `Switch` or a `button role="switch"` | State + keyboard |
| Dialog / sheet | Radix `Dialog` | Focus trap, escape, portal |
| Tabs / accordion | Radix | Roving focus / disclosure |
| Slider / progress | Radix `Slider` / native range | Keyboard and ARIA |
| Tooltip / popover | Radix | Positioning and dismissal |

Rules:

- Copy shadcn source into the repo. Own it.
- Keep `data-slot`, `data-state` and ARIA behaviour.
- Style with semantic tokens; do not fork the primitive to change a colour.
- Keep one focus system: a visible ring from `--focus` with a 2–3px offset.
- Do not install 20 components. Install the 3–6 you will actually document.

## 3. The form kit

A design system is proved by its forms. Ship one real form with:

1. text input
2. email input
3. password with show/hide
4. select / combobox
5. textarea with a counter
6. checkbox
7. radio group (fieldset + legend)
8. switch
9. range
10. file input
11. submit + reset
12. disabled example

Every control:

- has a visible `<label>` (placeholder is not a label);
- has a hint or a reason when the format is non-obvious;
- has an error linked by `aria-describedby` and `aria-invalid`;
- has a 44px minimum target where practical;
- keeps its value and label when disabled;
- is reachable and operable by keyboard.

The form-level error summary:

- `role="alert"`, `tabindex="-1"`, focused on invalid submit;
- lists each error as a link to the field;
- clears a field's error when that field is edited;
- does not steal focus again on every keystroke.

Do not use a custom div as a checkbox, radio, select or switch. Do not hide the
only focus indicator. Do not use colour as the only error signal.

## 3b. Theme the form kit

A form kit that ignores the brand is a different product. Derive the fields from
the same theme DNA as the mark (edge, offset, stroke, radius, ring, density,
label): see `form-theming.md` for the material → field recipe table, state rules
and shadcn mapping. `scripts/brand-forge.mjs` generates `--field-*` tokens,
`<slug>-forms.css` and a working `forms.html`. Field CSS reads tokens only; the
audit fails raw colours.

## 4. Page anatomy

Choose the surface before the route. A proof does not require a router.

**System specimen (closest to `/sunnyside`)** — use
`templates/design-system.html`:

topbar → contents → hero (name, version, promise, stats, sheet) → foundation →
material → marks (logo card + wordmark + cast drawer + rule) → colour → type →
parts → motion → voice → applications → tokens → audit/endcap.

The marks section is the identity proof, not a logo grid. It has four movements:
logo card, wordmark scale, cast drawer, one usage rule. A drawn track also
publishes its 4–6 cast marks. `templates/marks-section.html` is the page-scale
implementation; `references/craft-bar.md` is the reasoning.

**Product or case page:** nav → hero → material → components/forms → tokens →
audit → footer. Use only the sections the brief needs.

**No page:** Storybook story, standalone HTML or `.pen`; skip the topbar/contents
if there is no page.

Keep the page readable without JavaScript. The prose, tables and downloads are
server-rendered; only the interactive islands need JS. A theme toggle is optional;
if the system has no dark theme, do not add one.

## 5. HTML or TSX?

| Situation | Choose | Why |
| --- | --- | --- |
| Brand board, static case, mockup | Single HTML | No build, exact type, easy to render |
| Interactive design system in Next | TSX | Real state, shadcn/Radix, route metadata |
| One-page proof with a small form | HTML + tiny JS, or TSX | Pick one; do not build both |
| Need a downloadable board | HTML → Playwright PNG | Repeatable, editable source |
| Need a component library | TSX only | Components are code, not a board |

For TSX, keep the route a server component. Put state in small `"use client"`
islands. Do not turn the whole page into a client component for a theme toggle or
a password eye.

## 6. Surfaces and routes (if any)

Choose the surface from the host, not from a template. Read
`workspace-contexts.md` for the full matrix.

- **No UI / one deliverable:** `design-system.html` or a board; no router, sitemap
  or llms twin.
- **Product app:** a host route, settings page or Storybook; use the existing
  shell. Do not invent `/design-system`.
- **Docs site:** docs page + live specimens.
- **Portfolio/archive:** case index + case page **only if the brief asks**.
- **Component library:** Storybook/Ladle stories; no page route.
- **Pen/Figma/print:** canvas/exports; no code route.

If a route exists, use the host's convention and update only what exists:
canonical, OG, icons, sitemap, llms, nav/footer, tests. Route moves are a
checklist; run `next typegen` or restart the dev server. Stale generated types are
not source. If no route exists, skip the metadata/route checklist and say
**Not applicable**.

## 7. Acceptance

- [ ] Tokens generate CSS + JSON from one source.
- [ ] 5–10 primitives maximum; each has a documented state.
- [ ] One form with all states; keyboard and error summary verified.
- [ ] Fields share the mark's material (edge, radius, ring); no raw hex in field CSS.
- [ ] Light/dark both intentional; text contrast measured.
- [ ] 1440 and 390; no horizontal scroll.
- [ ] Reduced motion keeps a finished state.
- [ ] Page readable without JS; Markdown twin exists if the host publishes docs.
- [ ] Audit names what is missing.
