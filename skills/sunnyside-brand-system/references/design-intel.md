# Design intelligence: using the database as a negative prior

`ui-ux-pro-max` ships a searchable corpus — 67 styles, 96 palettes, 57 type
pairings, 99 UX rules, 25 chart types across 13 stacks. It answers the question
"what does a product in this category usually look like?"

That is a useful question and a dangerous answer. This reference explains how to
use the corpus without becoming it.

## 1. The inversion

A recommendation engine returns the **category default**. The detach gate fails
the category default. These two facts are not in conflict — they are the same
fact seen from two sides.

So the corpus is used as a **negative prior**: query it to learn what the obvious
answer is, then treat that answer as the list of things to avoid. The value is
not the palette it returns; the value is knowing precisely which palette the next
agent will also pick.

> Use the database to find the centre of the category, so you can stand outside
> it on purpose.

A system that ignores the corpus and a system that obeys it both fail: the first
misses the category's real conventions (form fields, contrast, focus rings), the
second has no identity. The gate is what separates the two.

## 2. Running it

```bash
S=~/.workbuddy-ai/plugins/cache/cb_teams_marketplace/modern-webapp/1.0.0/skills/ui-ux-pro-max

# the category prior, with reasoning and anti-patterns
python3 $S/scripts/search.py "<product type> <industry> <keywords>" --design-system -p "<Name>"

# what the category does structurally — hero, proof, pricing
python3 $S/scripts/search.py "hero social-proof pricing" --domain landing

# the rules that are universal, not stylistic
python3 $S/scripts/search.py "focus keyboard aria contrast" --domain ux
python3 $S/scripts/search.py "form validation error state" --stack shadcn

# the style the category reaches for — read it to reject it
python3 $S/scripts/search.py "glassmorphism minimal editorial" --domain style
```

Run it **after** the brief and **before** the palette. Running it first is how
the brief becomes the corpus.

## 3. What to take, what to refuse

| Domain | Take | Refuse |
| --- | --- | --- |
| `product` | the information architecture, the sections a buyer expects | the visual direction |
| `landing` | the order of proof (claim → evidence → objection → action) | the hero layout it recommends verbatim |
| `ux` | everything. Focus, keyboard, contrast, loading, error states | nothing — this is the law, not a style |
| `web` | semantics, `aria`, virtualisation, `lang`/`dir` | — |
| `typography` | the pairing *logic* (contrast of width, not of weight) | the named faces. A shared display face is hard fail H3 |
| `color` | nothing. This is the category palette | all of it. Using it is hard fail H4 by construction |
| `style` | the effect's failure mode (the trap it names) | the effect itself, unless the brief asked for it |
| `chart` | the chart type for the data shape | default chart-library colours |
| stack files | API shape, a11y wiring, form state handling | component look |

The pattern: **take structure and behaviour, refuse appearance.** Structure is
what the category genuinely knows. Appearance is what the category has already
done to death.

## 4. The rules that survive every style

Ported because they are correct regardless of the direction, and because they are
the failures that make a system look amateur next to a good mark.

| Rule | Do | Don't |
| --- | --- | --- |
| Icons | one SVG set, fixed 24×24 viewBox | emoji as UI icons |
| Hover | colour, border or opacity transition | scale transforms that shift layout |
| Cursor | `cursor: pointer` on anything clickable | default cursor on a card that acts |
| Transitions | 150–300ms, colour/opacity | instant swaps, or > 500ms |
| Focus | visible ring in every theme, never removed | `outline: none` without a replacement |
| Light-mode text | ink at ≥ 7:1 on the reading plate | muted grey at 3:1 "for elegance" |
| Light-mode borders | a real border colour | `white/10`, invisible on a light ground |
| Glass on light | fill ≥ 80% opacity | 10% white on white |
| Motion | honour `prefers-reduced-motion` | parallax and shader loops by default |
| Colour alone | never the only signal for an error or a state | red text with no icon, no message |

Two of these are worth repeating because they appear in almost every failed
review: **emoji icons** (they render differently on every OS, cannot be themed,
and cannot be sized) and **hover scale** (it reflows the row and makes a static
page feel unstable).

## 5. Where the corpus and the gate disagree

They will disagree, and the gate wins.

| Situation | Corpus says | Gate says | Resolution |
| --- | --- | --- | --- |
| Fintech | trust-blue, #2563EB | H4: that hex is taken | keep the *structure* (dense tables, tabular figures), move the hue |
| Wellness | sage green, soft serif | may collide with an existing warm case | keep the calm spacing, change the material |
| Developer tool | dark slate + violet accent | dark is legitimate, violet may be taken | take dark (value separation is 12 points), change the accent |
| Luxury | high-contrast serif, cream | cream is the most-copied ground | keep the type contrast, make the ground a material instead of a colour |

The corpus is describing what the category *means*. The gate is protecting what
this portfolio *already is*. Meaning travels; the hex does not.

## 6. Sequence

1. **Brief** — one sentence, one track, five concepts. No database yet.
2. **Query** — `--design-system` for the category prior. Write down the palette
   it returns; that is the list of hexes to avoid.
3. **Query `ux` and the stack** — take these wholesale.
4. **Palette** — from a hue seed and a material, `init-system.mjs --hue`.
5. **Detach** — `detach-check.mjs` against every sibling.
6. **Build** — `case-architecture.md`.
7. **Audit** — `verification.md`; the corpus checklist is a subset of it.

Step 2 exists to be contradicted. If the palette from step 4 is the palette from
step 2, the work has not started.
