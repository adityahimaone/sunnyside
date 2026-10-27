# Tokens and docs

A brand kit that only exists as images is a poster. The system is the tokens, the
components and the docs that let the next person use it without asking you.

## 1. Token layers

Three layers, in order:

```css
:root {
  /* 1. Primitive — raw values, no roles */
  --brand-paper: #f3ecdf;
  --brand-paper-hi: #fffaf1;
  --brand-ink: #191a2e;
  --brand-cobalt: #3d53d6;
  --brand-butter: #ffd23f;
  --brand-tangerine: #ff6a2b;

  /* 2. Semantic — roles */
  --surface-page: var(--brand-paper);
  --surface-sheet: var(--brand-paper-hi);
  --text-primary: var(--brand-ink);
  --text-secondary: #5f5b6e;
  --border-strong: var(--brand-ink);
  --accent-loud: var(--brand-cobalt);
  --accent-mark: var(--brand-tangerine);
  --accent-tape: var(--brand-butter);

  /* 3. Component — one job each */
  --button-bg: var(--accent-loud);
  --button-ink: var(--surface-sheet);
  --focus-ring: 0 0 0 3px var(--accent-tape);
  --card-border: 1.5px solid var(--border-strong);
}
```

Rules:

- Components read semantic or component tokens, never primitive hex.
- Namespace the brand tokens (`--brand-*`) when the host app already owns
  `--muted`, `--border`, `--primary`, etc.
- Export the same values as CSS and JSON from one source.
- Type, spacing, radius, shadow and motion are tokens too. A palette alone is
  not a system.
- Contrast pairs are part of the token file, not a separate PDF.

## 2. What to export

```json
{
  "name": "Sunnyside",
  "version": "1.0",
  "color": {
    "paper": "#f3ecdf",
    "ink": "#191a2e",
    "cobalt": "#3d53d6",
    "butter": "#ffd23f",
    "tangerine": "#ff6a2b"
  },
  "semantic": {
    "surfacePage": "var(--brand-paper)",
    "surfaceLoud": "var(--brand-cobalt)",
    "textPrimary": "var(--brand-ink)",
    "accentMark": "var(--brand-tangerine)"
  },
  "type": { "display": "Syne", "reading": "Geist", "label": "Geist Mono" },
  "radius": { "sm": 4, "md": 14, "lg": 20, "pill": 999 },
  "motion": { "fast": 160, "ui": 220, "ease": "cubic-bezier(.22,1,.36,1)" }
}
```

Ship both formats. A Figma/design-tool team needs JSON; the product needs CSS.

## 3. Docs structure

A brand guide that can be used:

1. **Cover** — name, essence, version, date.
2. **The idea** — audience, promise, the one metaphor.
3. **The mark** — construction, clear space, minimums, favicon.
4. **The wordmark and lockups** — ratios, responsiveness, reversed versions.
5. **Colour** — roles, swatches, contrast pairs, one loud field.
6. **Type** — display, reading, label, specimens, scale.
7. **Applications** — navbar, social, favicon, sticker, card.
8. **Do / don't** — the mistakes you actually made.
9. **Implementation** — file paths, tokens, component names.
10. **Still open** — the honest gaps.

Write for a maintainer six months from now. "Cobalt is the loud field, one per
page" is better than "bold and vibrant".

## 4. Docs that are readable by humans and agents

- **Server-render the content.** Do not hide the only copy of a rule in a tab,
  an accordion or an image.
- **One h1; then h2 and h3 in order.** Never skip a level.
- **Every section gets an `id`** and a visible anchor link. Agents and humans can
  both cite the URL.
- **Real tables** for tokens, sizes and checks, with `<th scope>`.
- **Descriptive links.** "Read the brand guide", not "click here".
- **Alt text** for the board and figures; the caption should explain the decision.
- **A raw Markdown twin** at a stable URL, e.g. `/design-engineering/llms.txt`,
  linked from the page. It can be generated from the same data.
- **No fake text.** No lorem, no invented metrics, no screenshot of a table.
- **A visible "last updated" and version.**
- **One canonical URL** and a sitemap entry.
- **Stable file links** to the SVGs, tokens, board and source.
- **A "what is missing" section.** Agents should not infer completeness from a
  polished page.

## 5. The `llms.txt` pattern

A plain-text version is the cheapest agent affordance. It should contain:

```md
# Design engineering — field manual
> A one-paragraph summary.

Canonical: https://example.com/design-engineering

## The practice
...

## Standards
- **Design contract** — ...
- **Interface standard** — ...

## The case
...

## Install the skill
npx skills add ...
```

Keep it in sync with the page from one data source, not by hand.

## 6. Accessibility of docs

- body 4.5:1, large text 3:1;
- visible focus, 44px controls, 8px apart;
- links underlined, not colour alone;
- no motion-only state;
- reduced-motion route;
- tables with headers and a linear reading order;
- code blocks with `overflow: auto` and a visible copy action.

## 7. The Sunnyside docs

- `/sunnyside` — interactive specimen and token export
- `/design-engineering` — the manual and case
- `/design-engineering/learning` — field notes
- `/brand/...` — downloadable assets
- `design/brand/README.md` — the brand guide
- `design.md` — the visual reference
- `design/manifest.json` — the design-source map

The page is the product. The PDF is a snapshot of the page.
