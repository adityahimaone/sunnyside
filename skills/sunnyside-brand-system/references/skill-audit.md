# Skill audit: sunnyside-brand-system v2.0 → v2.1

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

## Known gaps (not fixed here)

- **Wordmark outlining still needs `uharfbuzz` + a font file.** `brand-forge`
  consumes the output of `extract-wordmark.py`; it does not shape type itself.
- **No in-repo visual regression.** `sheet.html` is for human review at 16px.
- **Concepts are geometric.** Figurative or hand-drawn marks still need hand
  drawing, then the same family/tokens/forms pipeline.
- **Form kit is native HTML.** Radix/shadcn mapping is documented, not generated.
- **Chromium only** for `qa.mjs` and `render-icons.mjs`.
- **Story quality is a human judgement.** The audit checks structure only.

## Re-run the audit

```bash
node scripts/brand-forge.mjs --init sunburst > brand.json
node scripts/brand-forge.mjs --config brand.json --out public/brand/<slug>
node scripts/audit.mjs --manifest audit.json
bash scripts/sync-skill.sh   # when this skill is mirrored in .agents/skills
```
