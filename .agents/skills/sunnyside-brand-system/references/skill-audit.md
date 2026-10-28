# Skill audit: sunnyside-brand-system v2.0 → v2.4

An audit of the skill itself. Findings are ordered by how much they hurt a
real run. Each states the fix and where it landed.

## Findings

| # | Finding | Impact | Fix (v2.1) |
| --- | --- | --- | --- |
| 1 | Logo guidance was prose only. Every run redrew the mark by hand and rebuilt tokens, forms and a proof sheet separately. | Slow, inconsistent, easy to ship a mark that was never tested at 16px. | `scripts/brand-forge.mjs`: one config → full mark family, tokens, form kit, proof sheet, story scaffold. |
| 2 | Only one construction method existed in code terms (Sunnyside's cut sun). | Marks converged on rays and circles. | Six construction concepts: sunburst, aperture, orbit, hatch, stack, facet. Add more as evidence, not as templates. |
| 3 | Storytelling lived in one-line rules ("document the decision"). | Guides described assets and never argued. | `references/storytelling.md`: story spine, one sentence, decision cards, specimen reading order, story audit. |
| 4 | The form kit was specified as controls and ARIA, not as *theme*. Fields looked generic next to a distinctive mark. | Brand broke at the first input. | `references/form-theming.md` + generated `--field-*` tokens and `<slug>-forms.css` from shared theme DNA. |
| 5 | `audit.mjs` checked files, ICO, PNG, contrast. It could not tell a good family from a broken one. | Mismatched viewBoxes, a compact mark more complex than the primary, raw hex in field CSS and an unfinished guide all passed. | New checks: `family`, `formsCss`, `story`. |
| 6 | The skill lives twice: `skills/` and `.agents/skills/`. | Silent drift between the two copies. | `scripts/sync-skill.sh` copies one to the other and verifies with `diff -rq`. |
| 7 | Output contract did not list `story.md`, the form CSS or the proof sheet. | Handoff to `implement-brand-system` missed the narrative and form rules. | Contract and handoff updated. |
| 8 | Missing blank line before `## Pen.dev` in SKILL.md; version still 2.0. | Cosmetic; renders as a run-on heading in some viewers. | Fixed; version 2.1. |
| 9 | `templates/brandkit.html` had a fixed palette and no story panel. | Boards looked like Sunnyside regardless of brand. | Story panel guidance added to `board-and-images.md`; generator emits palette from config. |

## v2.2 findings (from a real output sheet)

| # | Finding | Fix |
| --- | --- | --- |
| 10 | Three brands (Huginn, Riso Co., Hachure) all came out as an initial or a blob with an effect. No family diversity, name meaning ignored, orphan accent, offset that dies at 16px. | `logo-brainstorm.md` (diagnosis, concept bank, six families, design rules); `--bakeoff`. |
| 11 | No objective gate; the skill relied on "looks good". | `score-mark.py`: compact stroke/dot floor, silhouette, 16px contrast, specks, negative space, symmetry note. |
| 12 | Concept set was too narrow (six geometric methods). | Added dotmatrix, lines, overprint, nodes, monogram, fused from the op7418 pattern families; `hatch` rebuilt as a real hachure. |
| 13 | No worked redo to show the method beats the failure. | `examples/brainstorm-huginn-riso-hachure.md` + runnable configs. |

## v2.4 findings (from Case 01)

| # | Finding | Fix |
| --- | --- | --- |
| 14 | The v2.3 constructed gate was applied to every brief. The best warm/editorial result (Sunnyside) could not be produced by the skill. | Added the **drawn track** and its gate in `craft-bar.md`: one subject, one cut line, one fill, one hard offset, 2–3 inks, 16px; a circle only as the subject. The v2.3 gate remains the constructed track. |
| 15 | The mark was treated as the whole identity. Case 01 wins on the wordmark, the cast and the composition. | Added the **mark system**: primary + compact + glyph + drawn wordmark + 4–6 cast + four-movement composition. |
| 16 | No drawn wordmark standard beyond “outline a font”. | `craft-bar.md` §5: drawn/outlined routes, single-stroke 3.3, `skewX(-9)`, no `<text>`, scale and clear space. |
| 17 | No cast generator or cast standard. | `cast-forge.mjs`, `examples/configs/sunnyside-cast.json`, `craft-bar.md` §4. One cut line, one fill, one job per mark. |
| 18 | The marks section in the template was three equal tiles. | `templates/marks-section.html` and the design-system template now use the logo card, wordmark scale, cast drawer and usage rule. |
| 19 | Verification was three commands and a manual pass; the dev origin trap was invisible. | One `qa.mjs` command runs audit + score + browser, normalizes `127.0.0.1` → `localhost`, checks theme/overflow/shader/typography/forms/console, and writes `docs/<slug>-qa.md`. |
| 20 | The Case 01 example listed assets but not the reason it is the bar. | `examples/sunnyside.md` now documents the mark system, the cast, the composition and what not to copy. |

## Known gaps (not fixed here)

- **The cast generator is a draft.** It draws 13 shapes on a 64 grid; a real
  figurative cast still needs hand drawing. The script checks viewBox, live text
  and the shape list; it does not judge the drawing.
- **The drawn wordmark is still hand-drawn.** There is no auto-tracer. The type
  route uses `extract-wordmark.py`; the hand route is a drawing.
- **The cast is exempt from the v2.3 gate**, but it must share one cut line and
  one fill. `score-mark.py` scores the primary family, not the cast.
- **The cast can use a circle** (a face, a sun, an eye). The constructed gate
  does not apply; the drawn gate says a circle is allowed only as the subject.
- **No in-repo visual regression.** `sheet.html` and `cast.html` are for human
  review at 16px/24px.
- **Form kit is native HTML.** Radix/shadcn mapping is documented, not generated.
- **Chromium only** for `qa.mjs` and `render-icons.mjs`; no production build in
  the QA script.
- **Story and cast quality are human judgements.** The audit checks structure and
  the gate, not taste.

## Re-run the audit

```bash
node scripts/brand-forge.mjs --init sunburst > brand.json
node scripts/brand-forge.mjs --config brand.json --out public/brand/<slug>
node scripts/cast-forge.mjs --config brand.json --out public/brand/<slug>
node scripts/qa.mjs --url http://localhost:3000/design-system/<slug> \
  --slug <slug> --manifest audit.json --mark public/brand/<slug> --sections
bash scripts/sync-skill.sh   # when this skill is mirrored in .agents/skills
```
