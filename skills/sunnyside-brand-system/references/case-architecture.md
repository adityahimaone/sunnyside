# Case architecture

A design-system case is two folders, one token source and one page. The shape is
boring on purpose: nine cases that share a skeleton are reviewable, and the
identity lives in the tokens, the mark and the copy — not in a bespoke file
layout.

```
features/<slug>/
  tokens.json                 the source of truth
  <slug>-tokens.css           generated from tokens.json
  <slug>.module.css           layout, hand-written, tokens only
  <slug>-data.ts              copy, decisions, gate records
  components/
    brand.tsx                 Mark, Wordmark, Lockup, Stacked
    theme-toggle.tsx          the only stateful island
    form-demo.tsx             the form kit, if the system has one

app/design-system/<slug>/
  page.tsx                    the specimen
  layout.tsx                  scope class + metadata
  llms.txt/route.ts           the agent-readable twin
  icon.svg                    route icon

public/brand/<slug>/
  mark.svg, mark-reverse.svg
  mark-compact.svg, mark-compact-reverse.svg
  glyph.svg
  wordmark.svg, wordmark-reverse.svg
  lockup.svg, lockup-reverse.svg
  lockup-stacked.svg, lockup-stacked-reverse.svg
  favicon.ico, favicon-16/32/48.png, apple-icon-180.png, icon-192/512.png
  <slug>-tokens.css, <slug>-tokens.json     the downloadable copies
  <slug>-forms.css, forms.html               the standalone form kit
  <slug>-brandkit.png                        the board
```

`scripts/init-system.mjs` writes the first block, a compiling `page.tsx` and an
empty `public/brand/<slug>/`. The mark, the wordmark and the board come from
`brand-forge.mjs` and a human hand.

## 1. One token source

`tokens.json` is the only file anyone edits for colour or type. The CSS is
generated; a hand edit to `<slug>-tokens.css` is a bug that will be overwritten.

```json
{
  "meta": {
    "name": "Strand", "case": "Case 07", "namespace": "--st-",
    "essence": "Where the dunes meet the tide.",
    "oneSentence": "…", "track": "constructed", "gate": "v3.0"
  },
  "theme": { "family": "…", "material": "…", "radius": "10px", "…": "…" },
  "sections": ["foundation", "material", "marks", "…"],
  "primitives": [{ "name": "aquamarine", "value": "#327B8A", "role": "Tidal ocean signal" }],
  "semantic": { "light": [{ "name": "surface-page", "value": "var(--st-linen)", "role": "…" }] },
  "type": [{ "name": "font-display", "value": "var(--font-syne), 'Syne', sans-serif" }],
  "contrast": [{ "label": "ink on plate", "fg": "#152026", "bg": "#FFFFFF", "ratio": 15.1 }]
}
```

Three fields do double duty and must not be skipped:

- `namespace` — the two-letter prefix. Unique across the portfolio; `H1` in the
  detach gate.
- `theme` — the twelve DNA keys. The mark, the surfaces and the fields all read
  this object. A `TODO` here becomes a copy of the neighbour.
- `sections` — the section ids, in order. The detach gate compares these. If
  absent, it reads the `NAV` array from `<slug>-data.ts`.

## 2. Two ramps, one set of names

The classic dark-mode failure is renaming primitives per theme
(`--night-ground`, `--night-text`). The semantic layer then points at names that
do not exist in the other theme, and the page half-breaks on the first toggle.

Both ramps declare the **same** primitive names. Only the values change:

```css
.st-scope {
  --st-ground: #faf7f2;      /* light ramp */
  --st-ink: #152026;
  --st-surface-page: var(--st-ground);
  --st-text-primary: var(--st-ink);
}

html[data-strand='night'] .st-scope {
  --st-ground: #0d1417;      /* same names, night values */
  --st-ink: #f2efe9;
}
```

The semantic and component layers are written once and never repeated per theme.
A component that reads `var(--st-text-primary)` is theme-correct by construction.

**One rule** switches the logo assets, anchored on `<html>`:

```css
.onlyLight { display: block; }
.onlyDark { display: block; }

:global(html:not([data-strand='night'])) .onlyDark { display: none; }
```

Do not write `.scope:not([data-x='night'])`. The scope element never carries the
attribute, so that selector matches everywhere and both logos render.

## 3. The brand component contract

Every case exports the same four components from `components/brand.tsx`. The
page never touches an SVG path directly.

| Export | Renders | Rules |
| --- | --- | --- |
| `<Slug>Mark` | Primary mark | `size < 32` switches to `mark-compact.svg`; `role="img"` + `aria-label` |
| `<Slug>Wordmark` | Outlined wordmark | Height prop only; never live text |
| `<Slug>Lockup` | Horizontal lockup | `priority` on the one above the fold |
| `<Slug>Stacked` | Stacked lockup | For narrow headers and the footer |

Two rules hold across all four:

- **Both inks are always rendered**, and CSS picks. A JS-driven logo swap breaks
  on first paint and flashes the wrong mark.
- **Decorative uses pass `aria-hidden`.** A mark next to the word "Strand" in an
  `aria-label` is announced twice otherwise.

## 4. Page anatomy

The specimen is a server component. The order is stable; the content is not.

| # | Section | What it proves | Optional |
| --- | --- | --- | --- |
| — | Hero | the one sentence, the field image, three tenets | no |
| 01 | Foundation | six decisions: decision / because / breaks next | no |
| 02 | Material & colour | swatches with roles + measured contrast table | no |
| 03 | Marks | logo card, specs, suite row, downloads | no |
| 04 | Typography | display specimen, reading specimen, type gate table | no |
| 05 | Form kit | real controls in every state | if the system has no forms |
| 06 | Tokens | semantic table with copy buttons | yes |
| 07 | Applications | cards, tags, metrics in context | yes |
| 08 | Motion / voice | one effect, one voice card | yes |
| 09 | Audit | gate table, known gaps, output contract | no |

Replace at least two ids with sections this system actually needs. The audit
stays last: it is the page admitting what it has not proved.

## 5. Copy lives in data, not JSX

`<slug>-data.ts` holds `NAV`, `DECISIONS`, `STORY_BEATS`, `MARK_GATE`,
`TYPE_GATE`, `GAPS`, `OUTPUT_CONTRACT`. The page maps over them.

The reason is not tidiness. It is that `llms.txt` reads the same arrays, so the
human page and the agent twin cannot drift. A page with prose inline in JSX has
no agent twin worth reading.

## 6. `llms.txt`

A `route.ts` under `app/design-system/<slug>/llms.txt/` that returns Markdown:
name, one sentence, case, namespace, track, sections, decisions, tokens, gaps,
outputs — all from the same imports as the page.

```ts
export const dynamic = 'force-static'

export function GET() {
  const body = [`# ${tokens.meta.name}`, '', tokens.meta.oneSentence, …].join('\n')
  return new NextResponse(body, { headers: { 'content-type': 'text/markdown; charset=utf-8' } })
}
```

Only add it if the host already serves `llms.txt` for other routes. Inventing the
convention for one page is a route the project does not have.

## 7. Anti-patterns

- **Raw hex in a CSS module.** Colour comes from tokens. The audit greps for it.
- **Mode-prefixed primitive names.** Breaks the semantic layer on toggle.
- **A per-page copy of the token file.** Two sources, one of them wrong.
- **Logo swaps in JS.** Flash of the wrong mark; also fails with JS disabled.
- **Prose inline in JSX.** No agent twin, and the copy cannot be reviewed alone.
- **A form kit with only the happy path.** Focus, invalid, disabled, success are
  the point; the default state is the easy one.
- **Nine sections because the template has nine.** Delete what has nothing true
  to say.
