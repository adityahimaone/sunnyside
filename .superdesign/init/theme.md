# Theme — Sunnyside (Next.js 15 + React 19 + Tailwind v4 + CSS Modules)

## Part 1 — Token summary

Framework: Next.js App Router. Styling: Tailwind v4 (`@import 'tailwindcss'` in `app/globals.css`), plus per-feature CSS Modules. Fonts via `next/font`: `--font-syne` (display), `--font-geist-sans` (body), `--font-geist-mono` (metadata), `--font-space-grotesk` (fallback display).

Landing palette (declared on `.root` in `features/landing-page/studio/studio.module.css:3-17`):

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f3ecdf` | page ground |
| `--paper-hi` | `#fffaf1` | raised sheets |
| `--paper-lo` | `#e9dfcf` | underlays, media surfaces |
| `--ink` | `#191a2e` | text, 2px outlines, hard shadows |
| `--muted` | `#5f5b6e` | secondary text |
| `--line` | `rgb(25 26 46 / 0.16)` | hairlines |
| `--cobalt` | `#3d53d6` | signature field (the work room background) |
| `--cobalt-ink` | `#2c3cae` | cobalt text on paper |
| `--cobalt-wash` | `#e8ebff` | tint |
| `--tangerine` | `#ff6a2b` | accent marks |
| `--butter` | `#ffd23f` | tape / highlight |
| `--pink` | `#ffb6e1` | tape |
| `--mint` | `#b7e4c7` | accent |
| `--sky` | `#a9c8ff` | accent |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | motion |

Gallery-local tokens (`work-gallery.module.css:1-10`): `--card:#faf4e8`, `--card-ink:#18181b`, `--tape-yellow:#facc15`, `--tape-pink:#f4a8d4`, `--ease-spring:cubic-bezier(0.16,1,0.3,1)`.

Shape language: 2px ink outlines, `border-radius` 12–18px on paper pieces, 999px on pills/tape badges, hard offset shadows (`4px 4px 0 var(--ink)`), rotated washi tape strips, `clip-path` torn/jagged edges, dot-grid mat backgrounds.

Type: Syne 800 with `letter-spacing:-0.045em` for display; Geist Mono 8.5–10px uppercase `letter-spacing:.14em` for metadata; no soft glass shadows — printed edges only.

Breakpoints: Tailwind defaults (sm 640, md 768, lg 1024).

## Part 2 — Raw sources

`features/landing-page/studio/studio.module.css:1-20`:

```css
.root {
  --paper: #f3ecdf;
  --paper-hi: #fffaf1;
  --paper-lo: #e9dfcf;
  --ink: #191a2e;
  --muted: #5f5b6e;
  --line: rgb(25 26 46 / 0.16);
  --cobalt: #3d53d6;
  --cobalt-ink: #2c3cae;
  --cobalt-wash: #e8ebff;
  --tangerine: #ff6a2b;
  --butter: #ffd23f;
  --pink: #ffb6e1;
  --mint: #b7e4c7;
  --sky: #a9c8ff;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

`features/landing-page/studio/work-gallery/work-gallery.module.css:1-10`:

```css
.gallery {
  --card: #faf4e8;
  --card-ink: #18181b;
  --tape-yellow: #facc15;
  --tape-pink: #f4a8d4;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
}
```

`app/globals.css` (1542 lines) is the Tailwind v4 entry: `@import 'tailwindcss'`, `@import './deck-theme.css'`, `@import '../features/archive/archive-tokens.css'`, `@import '../features/ledger/ledger-tokens.css'`, `@plugin '@tailwindcss/typography'`, `@custom-variant dark (&:is(.dark *))`. It carries no landing-page palette — landing tokens live on `.root`.
