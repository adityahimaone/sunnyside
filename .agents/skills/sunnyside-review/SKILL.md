---
name: sunnyside-review
version: 1.0.0
description: 'Quality, taste, and token-compliance audit suite for interfaces built from Sunnyside brand systems. Fuses purpose-first OKLCH token mapping, anti-slop Floor linting (zero eyebrows, zero transition:all, headline caps), and multi-viewport visual critique across 1440, 1024, 768, and 390px.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '1.0.0'
---

# SUNNYSIDE REVIEW ENGINE (Token Mapping, Anti-Slop Lint & Visual Critique)

You are an Independent Design Quality Auditor & Taste Reviewer. You audit code, layouts, and rendered interfaces built from Sunnyside brand systems to prevent drift, eliminate AI-slop patterns, and enforce token compliance.

---

## 1. THREE UNIFIED AUDIT PASSES

Run the unified audit suite:

```bash
node skills/sunnyside-review/scripts/check-taste.mjs --slug <slug> --target features/<slug>
```

### Pass 1 · Purpose-First Token Mapping
- Scans target `.tsx`, `.ts`, and `.css` files for raw hex colors (`#fff`, `#111111`), raw rgb/oklch values, and arbitrary numbers.
- Maps raw values against `features/<slug>/tokens.json` by **semantic purpose first, then $\Delta E_{\text{OK}}$ tolerance**.
- Flags every occurrence:
  - `Exact`: Matches a brand primitive or semantic token. Auto-fix check provided.
  - `Semantic`: Within $\Delta E_{\text{OK}} < 0.02$ tolerance.
  - `Do Not Use`: Value matches, but semantic role clashes (e.g. using accent orange for dark body text).
  - `Gap`: Truly unmapped color that must either be replaced or added to the design system.

### Pass 2 · Anti-Slop & Brand House-Rules Lint (`sloplint`)
- **Zero Eyebrows**: Bans small pill badges or category kickers floating above `<h1>` or `<h2>`.
- **Zero `transition: all`**: Bans layout-reflow animations. Only allows transitions on `transform`, `opacity`, and `background-color`.
- **No Layout Geometry Animation**: Flag any transitions on `width`, `height`, `margin`, `padding`, `top`, `left`.
- **Monospace Discipline**: Monospace is legal only in rail section numbers, tabular figure tables, code sheets, and photo metadata stamps. Flag monospace applied to buttons or navigation links.
- **No Nested Cards**: Flag cards inside cards.
- **Headline Cap**: Verifies `<h1>` is $\le 2$ lines across standard breakpoints.

### Pass 3 · Rendered Multi-Viewport & UX Probe Review
- Evaluates the rendered layout at:
  - `1440×900` Desktop
  - `1024×768` Tablet Landscape
  - `768×1024` Tablet Portrait
  - `390×844` Mobile
- Verifies:
  - `scrollWidth === clientWidth` (zero horizontal overflow or clipping).
  - Visible `:focus-visible` outline rings on every keyboard-focusable control ($\ge 3:1$ contrast).
  - Form validation states: error summary presence and `aria-invalid` linking.
  - Reduced-motion parity: verify the page freezes in a clean static payoff state when `prefers-reduced-motion: reduce` is active.

---

## 2. REPORT FORMAT

Always conclude reviews with a ranked, unvarnished verdict:

```markdown
## Sunnyside Review Verdict: [READY TO SHIP / BLOCKED]

- **Blocking Issues:** [count]
- **Should-Fix Issues:** [count]
- **Token Compliance:** [X% mapped to brand tokens]

### Detailed Findings
- 🔴 `[BLOCKING]` [Rule] file:line — description + exact fix check
- 🟡 `[SHOULD-FIX]` [Rule] file:line — description + suggested token
- ⚪ `[NOTE]` [Observation]
```
