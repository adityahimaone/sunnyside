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

Where the two passes coincide, the third colour (\`overprint\`, #2b192e) is rendered as a third solid fill clipped to the orange sheet. No stroke and no \`mix-blend-mode\` is used anywhere, so the identity survives a favicon, a PDF export, and a client with blending disabled.

## Mark

Two sheared, unstroked sheets on a 64 grid: orange \`M24 10H52L36 54H8Z\`, blue \`M34 4H62L46 48H18Z\`, shifted diagonally like two drum passes. The overlap is a sharp overprint polygon (\`#2B192E\`), drawn as a clipped blue sheet — no stroke, no circle, no blend mode. The compact isolates the overprint on a 32 grid; the mono is the union of both sheets in currentColor. Three fills, no outlines. Five families were drawn in the v2.3 bake-off (architectural monogram, offset planes, louvers, ribbon, horizon); offset planes kept the press behaviour.

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

Print output. Every claim above is about the screen build. Drum registration on an actual risograph, ink absorption on 270gsm vellum, and the overprint colour under a real second pass have not been proofed — the #2b192e value is a screen approximation of a subtractive result.

Source: https://adityahimaone.space/design-system/riso
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
