import tokens from '@/features/riso/tokens.json'

const rows = (items: { name?: string; value?: string; role: string }[]) =>
  items.map((item) => `| ${item.name ?? item.role} | ${item.value ?? ''} | ${item.role} |`).join('\n')

const pairs = tokens.contrast
  .map(
    (pair) =>
      `| ${pair.label} | ${pair.theme} | ${pair.a} on ${pair.b} | ${pair.ratio.toFixed(2)}:1 | ${pair.level} |`,
  )
  .join('\n')

export function GET() {
  const content = `# Riso Co. / Atelier Ink — design system

> Two passes, one sheet.

Riso Co. is Case 04 in the design-system library: an identity and interface specimen for a risograph print edition workshop. The system is built on a single fact about the machine it imitates — a risograph prints one drum at a time, so the second impression never lands exactly on the first.

## The rule

Misregistration is the identity, not a defect. Every display element is printed twice: fluorescent orange first, federal blue second, offset by \`--rs-reg\` (2.5px screen, 2.2mm on paper) up and to the right. The offset is never corrected. In the specimen a 0–6px slider lets the reader pull the sheet back into register, and the idea visibly disappears.

## Overprint

Where the two passes coincide, the third colour (\`overprint\`, #46212a) is rendered as a third clipped path — a fill, an offset stroke, and an offset stroke clipped to the first path. No \`mix-blend-mode\` is used anywhere, so the identity survives a favicon, a PDF export, and a client with blending disabled.

## Mark

A drawn two-pass rectangle on a 64-unit grid, not a monogram: the bottom edge carries seven ridge points with two deep bites, from a Mulberry32 generator (seed 412), so the sheet reads as torn stock rather than a torn letter. Three points read as a bookmark; seven read as paper. One path, two strokes, optically centred on its drawn bounds rather than its box. Drawn at 64, 32 and 16px; the 16px favicon is a hand-tuned compact variant on a 26-unit grid with two points and a heavier 2.6 stroke so the tear does not disappear. A registration target is part of the family.

## Wordmark

"Riso Co." outlined from Space Grotesk 700 into a single path (viewBox 3514 × 728, ratio 4.83). Never live text, never a webfont dependency. The blue ghost is a second copy of the same path at 1.8% of the cap height, translated up and right.

## Palette

| Primitive | Value | Role |
| --- | --- | --- |
${rows(tokens.primitives)}

## Semantic tokens — light

| Token | Value | Role |
| --- | --- | --- |
${rows(tokens.semantic.light)}

## Semantic tokens — dark (safelight)

| Token | Value | Role |
| --- | --- | --- |
${rows(tokens.semantic.dark)}

## Contrast, measured in the build

Sixteen pairs are computed from the semantic layer by \`scripts/build-riso-brand.mjs\` and written into \`tokens.contrast\`. The ratios below are not typed by hand and are not rounded up.

| Pair | Theme | Colours | Ratio | Level |
| --- | --- | --- | --- | --- |
${pairs}

One pair fails and is kept visible as a rule rather than fixed by drifting the colour: fluorescent orange as body type is ${tokens.contrast
    .find((pair) => pair.level === 'Fail')
    ?.ratio.toFixed(2)}:1 against vellum. The orange drum is therefore a fill-only ink; orange type uses the darker \`accent\` (#c22e08, 4.87:1). The pushpin footer specimen is set with a carbon \`sheetInk\` (5.30:1) instead of the component's white default (3.36:1), which fails.

## Components

- \`features/riso/components/brand.tsx\`: \`RisoMark\`, \`RisoWordmark\`, \`RisoLockup\`, \`RegistrationTarget\`. All SVG, all driven by \`--rs-display-a\`, \`--rs-display-b\`, \`--rs-overprint\` and \`--rs-ghost\`.
- \`features/riso/components/controls.tsx\`: \`RisoControls\` (drum a/b, Daylight/Safelight) and \`RegistrationDemo\` (0–6px slider with Registered / House / Wrong presets).
- \`features/riso/components/form-demo.tsx\`: "Request a print run" — studio, email, edition, sheet count, note, proof checkbox. Errors are summarised above the form with anchor links, and focus moves to the first bad field on submit.
- \`features/riso/components/footer-demo.tsx\`: the \`PushpinTearFooter\` specimen, with a drum switch, a seed control and a "Re-tear" action.
- \`features/riso/components/tear-study.tsx\`: three tear seeds side by side, showing that the deckle is generated from numbers rather than drawn.
- \`components/ui/pushpin-tear-footer.tsx\`: the underlying footer component, unmodified in behaviour.

## Assets and files

- Tokens: \`features/riso/tokens.json\` → \`features/riso/riso-tokens.css\`, \`public/brand/riso/riso-tokens.css\`, \`public/brand/riso/riso-tokens.json\`.
- Generator: \`scripts/build-riso-brand.mjs\` (contrast, mark, wordmark, lockup, favicons, \`features/riso/brand-paths.ts\`).
- Wordmark outlines: \`scripts/riso-wordmark.py\` → \`design/brand/riso/assets/wordmark-path.json\`.
- Board: \`design/brand/riso/brandkit.html\` rendered by \`scripts/render-riso-board.mjs\` → \`public/brand/riso/riso-brandkit.png\` at 1500×1125.
- Vectors: \`public/brand/riso/mark.svg\`, \`mark-compact.svg\`, \`wordmark.svg\`, \`lockup.svg\`, \`favicons/favicon.svg\`, \`favicons/favicon-{16,32,180}.svg\`.
- Route: \`app/design-system/riso/page.tsx\`.
- Styles: \`features/riso/riso.module.css\` (CSS Modules; no Tailwind on this route).

## Not verified

Print output. Every claim above is about the screen build. Drum registration on an actual risograph, ink absorption on 270gsm vellum, and the overprint colour under a real second pass have not been proofed — the #46212a value is a screen approximation of a subtractive result.

Source: https://adityahimaone.space/design-system/riso
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
