# sunnyside-brand-system

An installable agent skill for shipping **brand kits** and **design systems** from a brief:
one idea, a mark family, a board, tokens, an immersive proof page, and an audit that names what
it could not verify.

Built from eight shipped cases — Sunnyside, Vitrine, Huginn, Riso Co., Hachure, Cove, Strand
and Clearing. The method travels; the marks do not.

## v3.1 — written from the evidence

The first version written from shipped work rather than from a survey.

- **Faster.** The whole method is `SKILL.md`: a ten-step fast path, six gates, seven immersive
  recipes. Twenty-two references became seven, and only four of them are part of the normal
  read.
- **Gates that failed something.** Detach (Strand vs Clearing measured 59/100), display face
  (Vitrine and Riso both set Space Grotesk), font registration (Cove shipped `--font-sora`
  with no Sora in the layout), contrast, 16px mark, reduced motion. Each is a command.
- **Immersive, not decorated.** Full-bleed field, clip-path edge, computed dither, register
  ghost, field + plate, and a surface that *is* the mark — with the numbers that make them
  read as printed.
- **Lighter.** Eighteen references retired. The method they carried is folded into `SKILL.md`,
  `references/gates.md` and `references/case-evidence.md`.

## What is in the box

```
SKILL.md                      the whole method in one read
references/case-evidence.md   the eight cases, their numbers, the recurring decisions
references/immersive.md       the six recipes with code
references/gates.md           detach, fonts, contrast, 16px, motion, QA
references/tokens-and-docs.md token layers and the llms twin
references/logo-system.md     grid, family, favicon
references/form-theming.md    the form kit every case ships
references/craft-bar.md       the drawn-track bar and the marks composition
scripts/                      init, detach, forge, cast, score, audit, qa, board, icons
templates/                    specimen, board, marks composition, case page, audit manifest
examples/                     Sunnyside and Vitrine, with the Case 02 audit
```

## Install

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
```

Companion: **`implement-brand-system`** turns an approved kit into an HTML/TSX proof without
redesigning it.
