# Typography gate

Typography is the cheapest quality signal in a brand kit or design system. Run
this gate before the first screenshot and again before the audit.

This is a local distillation for the brand-system workflow. The upstream source
is [better-typography by Jakub Krehel](https://www.ui-skills.com/skills/jakubkrehel/better-typography)
(`npx skills add jakubkrehel/skills --skill better-typography`). Load it when the
task is primarily a typography review; this file covers the brand/system case.

## 1. Choose the voices

Use three at most:

| Voice | Job | Default |
| --- | --- | --- |
| Display | The brand's voice in 1–3 places | A characterful sans or serif, 700–800 |
| Reading | Body, UI, long copy | A neutral sans, 400–500 |
| Label | Metadata, dates, sizes, tags | Mono, 500, tracked uppercase |

Two near-identical sans-serifs read as a mistake. Pair for contrast: display
against reading, not two versions of the same texture.

Brand type rules:

- Set the wordmark in **outlines**, never live text.
- If the display face is used for the wordmark, freeze the same weight and
  tracking as the shipping face.
- Load every weight/style the design uses. Do not rely on synthesis.
- Keep a local `@font-face` in the board HTML so it renders offline.
- Record the license and the exact file used in the guide.

## 2. Define a role-based scale

One size + line-height + weight = one role. Do not scatter 17 arbitrary sizes.

Example scale:

| Role | Size | Line-height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| `display-xl` | `clamp(2.5rem, 6vw, 4.5rem)` | 0.95–1.0 | 700–800 | -0.04em |
| `display-lg` | 2.5rem | 1.05 | 700 | -0.03em |
| `heading` | 1.5rem | 1.2 | 650 | -0.02em |
| `body` | 1rem–1.125rem | 1.5–1.6 | 400 | 0 |
| `label` | 0.6875rem | 1.2 | 500 | 0.08–0.14em |
| `caption` | 0.8125rem | 1.4 | 400 | 0 |

Use `rem` for font sizes and unitless line-heights.

## 3. The exact checks

| Check | Pass |
| --- | --- |
| Families | ≤3; each has a job |
| Small weight | ≥400 below 18px |
| Body size | 16–18px; inputs/menus ≥14px; captions ≥13px |
| Line-height | Unitless; display 1.1, headings 1.2–1.3, body 1.5–1.6 |
| Measure | 60–75 characters; a max-width exists |
| Tracking | `em`, not `px`; -0.01 to -0.02 at 24px+, +0.05 on small uppercase |
| Wrapping | `balance` on headings, `pretty` on paragraphs |
| Long words | `overflow-wrap: break-word` where needed |
| Numbers | `tabular-nums` on timers, counters, prices, table columns |
| Truncation | Ellipsis + a way to the full value |
| Mobile inputs | 16px, or the documented scale alternative |
| Punctuation | Curly quotes, en/em dashes, ellipsis; code stays straight |
| Smoothing | Applied once on the root |
| Language | `lang`, `dir`, `<bdi>` for mixed-direction values |
| Selection | Text selectable; `user-select: none` only on gestures |

## 4. Wrapping and truncation

```css
/* heading */
text-wrap: balance;

/* paragraph */
text-wrap: pretty;

/* long token or URL */
overflow-wrap: break-word;

/* one-line truncation */
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;

/* multi-line clamp */
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
```

A truncated value needs a title, a tooltip, a detail view or an accessible
description. Never truncate the only copy of a fact.

## 5. Forms and mobile

- Inputs under 16px make iOS Safari zoom the page. Use `text-base sm:text-sm`
  or the scale-alternative; state which one in the guide.
- Labels are always visible. A placeholder never replaces a label.
- Placeholder contrast must still be readable; do not use a 2:1 grey.
- Error text is not colour alone; prefix or icon plus text.
- Tabular numbers on any dynamic value.

## 6. Specimens in the kit

A type specimen should show the real thing, not lorem:

- one large display line (the brand's own words),
- one reading paragraph at the shipping measure,
- one label row with real metadata,
- one numeric row with `tabular-nums`,
- the font files, weights and license.

Do not set a paragraph in the display face. Do not use the label face as a
headline. Do not use the wordmark as a type specimen.

## 7. Quick review format

For an audit, group by root cause and report only what breaks:

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `path:line` | `font-size: 12px` on body | 16px | Readability |
| MEDIUM | `path:line` | fixed line-height | unitless 1.5 | Wrapping |
| LOW | `path:line` | `...` | `…` | Typographic punctuation |

`HIGH` is unreadable, clipped or inaccessible. `MEDIUM` breaks the type system.
`LOW` is polish. If you could not inspect something, write **Not verified**.

## 8. Brand-specific trap list

- A wordmark set in live text.
- A display face with a weight the font does not ship.
- A board where the specimen is lorem.
- Labels at 0.4rem in a 3000px board that become 3px at the web size.
- A form where the placeholder is the only label.
- A dark section where the body text is 300 weight.
- `text-wrap: balance` on a paragraph.
- `letter-spacing` in px.
- A font loaded from a CDN in a deliverable that must work offline.
