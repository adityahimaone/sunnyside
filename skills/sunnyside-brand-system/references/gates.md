# The gates

Six checks. Each one failed a shipped case, so each one is a command, not a discussion. Run
them in this order — the first two can invalidate the work that follows.

## 1 · Detach — 100 points, five hard fails

```bash
node scripts/detach-check.mjs --new features/<slug>/tokens.json \
  --ref features/<sibling>/tokens.json --ref features/<sibling2>/tokens.json
node scripts/detach-check.mjs --scan features --min 70     # the whole shelf, weakest first
```

**Pass at 70 against every sibling**, not the average. Five hard fails that no score rescues:

1. Same namespace (`--st-` twice).
2. Same material string.
3. Same display face.
4. Same accent hex.
5. One-sentence overlap above 60%.

| Dimension | Points | Full marks |
| --- | --- | --- |
| Hue | 25 | ≥ 25° apart in OKLCH (chroma ≥ 0.045 only) |
| Value | 15 | different mean lightness, chroma and spread |
| Material | 15 | 10+ of the 12 DNA keys differ |
| Geometry | 15 | radius, edge, tile, offset, stroke all differ |
| Type | 10 | different display face |
| Structure | 10 | section ids not present in the reference |
| Copy | 10 | no shared nouns in the claim |

Read the breakdown, not the total. `hue 25 · structure 5` is a new colour on the old skeleton;
`hue 5 · structure 10` is an old colour on a new one. Neither is finished.

**A placeholder scores zero.** A `TODO` in the DNA, an unnamed display face or an unfilled one
sentence is worth nothing — which is why a fresh scaffold scores about 40 and that is the gate
working.

**When the wheel is full** — normal at eight cases — hue is only 25 points. Move value
structure (dark mode), then material, then geometry, then structure.

**A low score is not always a collision.** If the scored side has no `tokens.json` the gate
reports `incomplete tokens`; fix the tokens, do not move the hue.

## 2 · Font registered

The one that hides. A token file can name a family that the root layout never loads, and the
page silently falls back on every machine without it installed.

```bash
grep -o "var(--font-[a-z-]*)" features/<slug>/<slug>-tokens.css | sort -u
grep "next/font/google" -A 20 app/layout.tsx    # every alias must appear here
```

Cove shipped `--cv-font-display: var(--font-sora)` with no Sora in `app/layout.tsx`. Every
`--font-*` in a token file must be declared in the layout and applied to `<body>`. Declare
`--deck-font-*` aliases on `body`, not `:root`: `next/font` injects `--font-*` on `<body>`, and
`var()` resolves on the element where the property is *declared*.

## 3 · Contrast — computed, and one failure published

Every pair comes from the semantic layer, not from a swatch. Compute, do not estimate.

- Body text 4.5:1; large text (24px+, or 19px bold) 3:1; graphics 3:1.
- A mid-tone field usually carries one ink and refuses the other. Riso's drum B is 3.63:1 with
  carbon — large text only. Huginn's field is 4.54:1 with bone — the reason the field never
  takes 13px.
- **Publish at least one failing pair** with the job it is therefore not allowed to do.
  Fluorescent orange as type is 2.96:1; steel as a border is 2.03:1. A palette that only
  publishes its passes is a brochure.

## 4 · Mark at 16px

- The compact is a **separate drawing**, with fewer shapes than the primary. If it is a scaled
  primary, the gaps close and the accent becomes a speck.
- Test at 16, 24, 32, 64. If it fails at 16 it is not a mark yet.
- Fill only. A fill plus a stroke on the same shape is a wireframe that dies at 32px.
- No circle unless the circle is the subject. No Venn, no orbit badge, no concentric rings.
- 2–4 solid primitives, one accent.

```bash
python3 scripts/score-mark.py --dir public/brand/<slug>
```

## 5 · Reduced motion

Every animation needs a still frame that **is the design**, not a frozen one. Under
`prefers-reduced-motion: reduce`:

- durations collapse to zero, not to 1ms;
- the entrance state is applied immediately (`startAt = 0`, `is-in` added);
- a scroll-driven surface shows its finished composition.

## 6 · The browser pass

```bash
node scripts/qa.mjs --url http://localhost:3000/design-system/<slug> \
  --slug <slug> --manifest audit.json --mark public/brand/<slug> --quick
```

It checks 1440 and 390, light and dark, reduced motion, theme switching, overflow, typography,
form errors, console and page errors, and failed requests. Use `localhost`, never `127.0.0.1`:
Next 16 blocks dev resources from the IP and hydration appears to fail.

Then inspect only what a script cannot judge:

- the mark at 16px, on the real ground;
- the lockup and the header at 390;
- the board at 100% and 50%;
- one form in focus, error, disabled and success;
- one dark section and one light section side by side;
- the marks composition;
- no horizontal scroll at 390;
- **no text touching a rule.** A stat row or a table cell with a divider needs padding on both
  sides of it, and the cell that starts a row needs its outer padding removed again at each
  breakpoint. This is the most common spacing bug in a data row and it survives every
  screenshot review that only looks at 1440.

Write **Not verified** for anything you did not look at.

## The audit table

Ship it as a page section and as `docs/<slug>-design-system-audit.md`. Ten to twelve rows,
each with a result and evidence, plus a named gap list.

| Check | Result | Evidence |
| --- | --- | --- |
| mark / 32px | Pass | both flaps and the pin legible on vellum and on stage |
| compact / 16px | Pass | separate drawing, two shapes, wider channel |
| wordmark | Pass | outlined; no `<text>` in any logo file |
| contrast | Pass | 13 pairs computed; 5.19:1 lowest body pair; 2 published failures |
| keyboard | Pass | 2px focus ring, 2px offset, on every control |
| reduced motion | Pass | transitions collapse; the still frame is the design |
| 390 / 1440 | Pass | single column, no horizontal scroll |
| night surface | Pass | `html[data-<slug>]`; primitives unchanged |
| forms | Partial | field tokens ship; error summary does not |
| print proof | Open | no pull on real stock |

The last two rows are the point. A table of ten passes is a brochure; a table with a Partial
and an Open is an audit.

## Stop rule

Fix only what fails, then stop. A second pass that adds a section because the page looked thin
is how a system becomes a moodboard. If the page is thin, the marks composition is usually the
missing part — not another section.
