# implement-brand-system

The execution half of the brand-system flow. It takes an approved kit and ships
the proof page, not a new identity. Its rules are fused from the
[ui-skills audit](../sunnyside-brand-system/references/ui-skills-fusion.md).

```text
brief → sunnyside-brand-system → approved kit → implement-brand-system → page
```

## Install

```bash
npx skills add adityahimaone/sunnyside --skill implement-brand-system --full-depth
```

Install the brand skill too; this skill consumes its brief, tokens, assets,
board and `DESIGN.md`:

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
```

## What it does

- audits the kit before writing code and names gaps;
- maps primitive → semantic → component tokens without inventing values;
- chooses a system specimen, app route, Storybook, standalone HTML, pen or print;
- uses the `/sunnyside`-style specimen anatomy when a full page is wanted;
- builds the shell, sections, one effect, components and one real form;
- uses shadcn/Radix for accessible primitives, native controls for the rest;
- applies the fused UI Skills rules: type, colour, craft, motion, a11y, metadata;
- runs the static audit and one browser pass, then stops.

## What it refuses

- Redesigning the mark, palette, type or effect.
- A component museum with no real form.
- Live-text wordmarks, custom selects/dialogs, `transition: all`, gradient soup.
- Shipping without keyboard, 390, dark and reduced-motion checks.

## Files

- `SKILL.md` — inputs, handoff, sequence, recipes, QA gate, fidelity contract.
- `../sunnyside-brand-system/references/ui-skills-fusion.md` — the audit of the
  ui-skills registry and the fused rules.
- `../sunnyside-brand-system/templates/` — `design-system.html`, HTML/TSX scaffolds.
- `../sunnyside-brand-system/references/visual-directions.md` — modern material systems.
- `../sunnyside-brand-system/references/workspace-contexts.md` — surface selection.
- `../sunnyside-brand-system/scripts/` — `audit.mjs` and `qa.mjs`.
