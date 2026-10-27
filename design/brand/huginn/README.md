# Huginn Studio — identity and system guide

> A thought crosses the threshold and returns in print.

Huginn is Case 03 of the design-system library. Its identity pairs bone paper and iron ink with one vermilion field. Ordered dither is the signature: a repeatable print boundary, not a texture placed over every surface.

- Live case: `/design-system/huginn`
- Case library: `/design-system`
- Brief: [`brief.md`](./brief.md)
- Board source: [`brandkit.html`](./brandkit.html)
- Board: `/brand/huginn/huginn-brandkit.png` (1500 × 1125; source rendered at `design/brand/huginn/brandkit.html`)
- Assets and token exports: `/brand/huginn/`
- Public guide copy: `/brand/huginn/README.md`
- Markdown twin: `/design-system/huginn/llms.txt`

## Idea and mark

The mark is **Threshold / Print**: a solid H-like frame interrupted by a small field of ordered dots. It means an image crossing a plane and leaving a trace. The compact form removes the dot field and keeps the H silhouette for 16px. It is not a raven, rune or shield.

Six directions are compared in the board: Threshold / Print (kept), raven profile, rune ring, crossed wings, eye aperture and feather ladder. The five rejected studies are included to record the category defaults this system avoids.

- Grid: 64 × 64 units.
- Compact: one solid silhouette, minimum 16px.
- Full mark: minimum 32px.
- Clear space: half the full mark height on each side.
- Horizontal lockup minimum width: 130px.
- Wordmark artwork is SVG paths, never live text in a logo.

## Palette and type

The CSS and JSON exports are generated from `features/huginn/tokens.json`.

| Role | Token | Value |
| --- | --- | --- |
| Ground | `--hg-bone` | `#F2E8D8` |
| Structure | `--hg-ink` | `#171210` |
| One loud field | `--hg-vermilion` | `#B82117` |
| Reverse lettering | `--hg-cream` | `#F4EFE5` |
| Registration / focus | `--hg-brass` | `#E6B84B` |

Display uses a system serif, reading uses a system sans and coordinates use a system mono. No downloaded font is required. Body text sits on solid paper/ink surfaces; the red field is reserved for display and primary actions.

## Material and motion

The ordered-dither dissolve is the only signature effect. A painting can fade into a solid red plane through a Bayer threshold while a separately supplied subject matte stays crisp above it. Grain is restrained print finish, not a second effect. The bitmap word resolves to single cells; a brief swash and the data captions follow.

Motion is entrance-only and pointer response is optional. Under reduced motion the picture and lettering render in their completed state; all copy and controls remain understandable without animation. The photo is decorative in the footer demo; its attribution appears in adjacent case copy.

## Components and forms

The case documents the configurable Wild Hunt Footer and a compact native form kit: text, email, select, textarea, checkbox, radio, switch and submit. Each has a visible label, focus, invalid, disabled and success treatment where relevant. The route is a specimen, not a published component library.

## Do / don't

**Do** use the red as a single field, keep body text on opaque surfaces, attribute the painting, test at 16px, and preserve the no-cutout mode.

**Don't** add a raven mascot, distribute runes as decoration, place small copy on the painting, use colour as the only state cue, or attach this footer to the portfolio's global shell.

## Gaps

The mark studies are a compact design record rather than a separate vector exploration application. Browser coverage outside the locally executed Chromium/Playwright pass is not claimed. No generated imagery or font asset is part of this identity.
