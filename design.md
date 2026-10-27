# Sunnyside — product design reference

Sunnyside is the visual language behind the portfolio’s **Side A** studio landing page and its archive wing. The current design is paper-first, tactile, and direct: warm paper, dark ink, cobalt used with restraint, and small sticker-like marks that make the work feel made by a person.

The live `/sunnyside` page is the interactive design-system specimen. It documents the rules and exports CSS/JSON tokens; it is **not** a separately published component library or a single token package consumed unchanged by every route. For exact values, use the specimen data and live feature styles below as the source of truth.

## Visual reference

- [Side A landing page screenshot](public/readme/landing-page.png)
- [Sunnyside specimen screenshot](public/readme/design-system.png)
- [Sunnyside brand kit](design/brand/sunnyside-brandkit.png)
- [README overview and live links](README.md)

## Design principles

1. **Paper is the room.** Build on warm, slightly textured paper with quiet layered sheets, visible edges, and real breathing space.
2. **One loud field at a time.** Cobalt is the signature field; let the rest of the page stay legible and warm.
3. **Marks are punctuation.** Stickers, doodles, tape, grain, and marker script add personality, but never carry essential structure or meaning alone.
4. **Offsets are deliberate.** Compose with a few considered shifts and overlaps rather than a uniform grid of identical cards.
5. **Type has jobs.** Syne is display; Geist is for reading; Geist Mono is for metadata and small labels; the custom marker hand is for brief annotations.
6. **Edges feel printed, not floating.** Prefer ink outlines, paper layers, and hard directional shadows. Don’t default to glass blur or generic soft card shadows.
7. **Motion earns its place.** Animate to explain a change, keep orientation, or provide feedback. Respect `prefers-reduced-motion` and keep content understandable without motion.
8. **Specificity beats flourish.** Write useful, human copy. A clever label never replaces a clear action or an accessible name.

## Logo

The identity is a **die-cut sun sticker** and the **marker wordmark**. The mark is a
cobalt tile with an ink edge, a butter sun with a face, twelve rays clipped by the
rounded paper, and the same hard offset every other Sunnyside surface uses. The
wordmark is the site's single-stroke marker alphabet frozen as outlines, so it never
depends on a font loading. "A system with a face." is the one-line essence.

- Header: 34px mark, 25px wordmark, 10px gap, 8.5px name at 0.14em. Below 480px the
  name drops, below 360px the wordmark drops and the mark carries the brand.
- Favicon: the compact mark (no shadow, eight rays, larger sun) at 16/32/48 and SVG;
  the apple icon is the full mark on paper at 180.
- The `/sunnyside` **Marks** section documents the lockup, clear space, minimum
  sizes, favicon sizes and downloads; keep it in sync with this file.
- Full files, clear space, minimum sizes, and do/don't rules:
  [`design/brand/README.md`](./design/brand/README.md).

## Palette

| Token       | Value     | Use                                               |
| ----------- | --------- | ------------------------------------------------- |
| Paper       | `#f3ecdf` | Page ground and the default surface               |
| Paper Hi    | `#fffaf1` | Raised sheets and cards                           |
| Paper Lo    | `#e9dfcf` | Underlays and quiet media surfaces                |
| Ink         | `#191a2e` | Text, outlines, and hard shadows                  |
| Muted       | `#5f5b6e` | Secondary text; never the sole carrier of a fact  |
| Cobalt      | `#3d53d6` | The loud field, primary action, or selected state |
| Cobalt Ink  | `#2c3cae` | Deeper cobalt states                              |
| Cobalt Wash | `#e8ebff` | Quiet selected surfaces                           |
| Tangerine   | `#ff6a2b` | Annotations, progress, and occasional marks       |
| Butter      | `#ffd23f` | Tape, sun, and focus accents                      |
| Pink        | `#ffb6e1` | Soft sticker and note accents                     |
| Mint        | `#b7e4c7` | Positive status accents                           |
| Sky         | `#a9c8ff` | Cool secondary accent                             |

Use the palette by role, not as a checklist. Tangerine, butter, pink, mint, and sky are accents—not small body-text colours. Check foreground/background contrast in the specimen before using a combination.

## Typography, shape, and motion

- **Display:** Syne, usually bold, tight, and sentence case. Reserve it for short statements and titles.
- **Reading:** Geist, generally 16px with generous leading and a comfortable measure around 68 characters.
- **Labels:** Geist Mono, small and tracked for dates, section numbers, and metadata—not as decorative headline copy.
- **Marker:** the custom inline-SVG script, used briefly for greetings and annotations.
- **Shape:** use the specimen’s scale (`4`, `8`, `14`, `20`, `28px`, and pill) by role. Ink borders and offset paper shadows provide the tactile depth.
- **Motion:** use short, clear UI feedback and slower entrances only when they help orientation. Avoid perpetual decorative motion; reduced-motion layouts must remain complete.
- **Accessibility:** preserve visible keyboard focus, semantic headings and controls, readable contrast, and meaning that does not depend on colour or animation alone.

## Side A — the studio

The homepage is one continuous studio wall composed of six chapters: Intro, About, Show & tell, Work, Skills, and Contact. Its hero poster, sun, smiley, bursts, flowers, and marker lettering are drawn in the interface from CSS and SVG rather than assembled as one background image. The visual rhythm comes from chapter navigation, layered paper, restrained cobalt and butter fields, and playful marks.

Treat this as the current landing-page direction. The former rack, DAW, device-wall, and LCD concepts are historical and are not the visual source for new landing-page work.

## Archive wing

Projects, bookmarks, skills, and blog pages share a responsive archive shell that carries the Sunnyside paper, ink, cobalt, and typography into a denser browsing context. The archive’s `--ss-*` tokens are namespaced to avoid collisions with global theme and component variables. Each feature still owns its composition and CSS; importing the palette does not mean forcing every page into one layout.

The `/design-engineering` route is a documentation surface built in the same
archive shell and tokens: a sticky contents column, a 760px article, real tables
and figures, stable heading anchors, and a raw Markdown twin for agents. The
Learning wing uses visible sections rather than tabs. It is a composition of this
system, not a second visual language; the docs notes live in
`docs/design-engineering.md`.

Glass, audio, and hardware motifs may exist in other feature-specific experiments, but they are not the default Sunnyside surface language and should not be applied to archive content or the studio without a clear, information-bearing reason.


## Vitrine — Case 02

`/design-system/vitrine` is a **separate** glass-and-dither system, not a Sunnyside
variant. It exists to test the same method against a different material: a glass
container, a halftone information layer, and a form kit. The mark is a V of two
panes (one solid, one dithered), the palette is Case/Frost/Signal/Iris, and the
display face is Space Grotesk rather than Syne. Do not import its `--vt-*`
tokens into Sunnyside, and do not reuse Sunnyside's sun, paper or cobalt there.

The case owns its tokens (`features/vitrine/tokens.json`), a scoped route
(`app/design-system/vitrine/`), a brand kit under `design/brand/vitrine/`, and a raw
Markdown twin at `/design-system/vitrine/llms.txt`. `/design-system` is the case
library that lists Sunnyside and Vitrine. Its dither is a custom field on the
dithercn engine (`lib/dither`), not an example component. The brand-system skill
audit is in `docs/vitrine-design-system-audit.md`; the known gaps are listed
there and on the page, rather than hidden.

### Vitrine implementation map

| Concern | Source |
| --- | --- |
| Case library | `app/design-system/page.tsx`, `features/case-library/` |
| Route and token scope | `app/design-system/vitrine/page.tsx` (imports the token CSS; `.vt-scope` on the page root) |
| Tokens | `features/vitrine/tokens.json` → `vitrine-tokens.css` + public JSON |
| Form controls | `features/vitrine/components/form-demo.tsx` |
| Signature dither | `features/vitrine/components/dither-lens.tsx` |
| Brand kit | `design/brand/vitrine/` |
| Logo and icons | `public/brand/vitrine/` |
| Design-engineering case | `features/design-engineering/` (`#case-vitrine`) |
| Audit | `docs/vitrine-design-system-audit.md` |

## Implementation map

| Concern                                                | Current source                                                    |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| Logo mark, wordmark, lockups, favicon                  | `components/ui/sunnyside-logo.tsx`, `public/brand/`, `design/brand/README.md` |
| Design-engineering docs, Markdown twins and notes      | `features/design-engineering/`, `app/(booth)/design-engineering/llms.txt/route.ts`, `docs/design-engineering.md` |
| Brand-system skill                                     | `skills/sunnyside-brand-system/`                                  |
| Landing chapters and composition                       | `features/landing-page/studio/studio.tsx`                         |
| Landing palette, chapters, and principles              | `features/landing-page/studio/studio-data.ts`                     |
| Landing layout and scoped tokens                       | `features/landing-page/studio/studio.module.css`                  |
| Sunnyside palette, contrast, type, motion, and exports | `features/design-system/sunnyside-data.ts`                        |
| Interactive design-system specimen                     | `features/design-system/sunnyside.tsx` and `sunnyside.module.css` |
| Archive tokens and shell                               | `features/archive/archive-tokens.css` and `archive.module.css`    |
| Cross-feature primitives                               | `components/ui/`                                                  |

The brand-kit board is authored as HTML/CSS and rendered with Playwright, then
downscaled with Lanczos; the mark is SVG and the favicon/app icons are assembled
with Pillow. The installable `sunnyside-brand-system` skill documents that
pipeline exactly, alongside the AI-image rules for atmosphere and photography.

When prose and implementation disagree, inspect the current route and owning feature styles. Update this reference when the system changes; do not revive old concepts by treating a detailed historical proposal as current code.
