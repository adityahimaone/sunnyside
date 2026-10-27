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

## 4. Page anatomy

One route is enough for a proof page:

1. **Nav** — brand lockup, 3–5 in-page links, theme toggle (if the system has
   dark mode).
2. **Hero** — the one effect, one headline, one sentence, 2 CTAs, 3–4 facts.
3. **Material** — show the signature effect and the rule that keeps it readable.
4. **Components/forms** — one form panel + one anatomy/state aside.
5. **Tokens** — three layers, a small table, contrast pairs, downloads.
6. **Audit** — resources, contract, dither/engine check, named gaps.
7. **Footer** — brand, downloads, links, what the case is not.

Keep the page readable without JavaScript. The prose, tables and downloads are
server-rendered; only the interactive islands need JS.

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

## 6. Case library pattern

When there is more than one system:

- `/design-system` — the index. Cards with cover, number, status, material, role,
  tags, link. Use the project's archive shell.
- `/design-system/<slug>` — the full case.
- `/design-engineering` — the method page. A case section per system, with a
  switch and a link to the full case.
- `<case>/llms.txt` — the Markdown twin.

Route moves: update canonical, OG, icons, sitemap, llms, nav/footer, board URLs,
audit evidence and tests in the same commit. Run `next typegen` or restart the
dev server; stale generated types are not source.

## 7. Acceptance

- [ ] Tokens generate CSS + JSON from one source.
- [ ] 5–10 primitives maximum; each has a documented state.
- [ ] One form with all states; keyboard and error summary verified.
- [ ] Light/dark both intentional; text contrast measured.
- [ ] 1440 and 390; no horizontal scroll.
- [ ] Reduced motion keeps a finished state.
- [ ] Page readable without JS; Markdown twin exists.
- [ ] Audit names what is missing.
