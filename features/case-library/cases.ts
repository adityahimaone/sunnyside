export type DesignCase = {
  number: string
  name: string
  href: string
  tagline: string
  description: string
  status: string
  role: string
  material: string
  cover: string
  coverAlt: string
  tags: readonly string[]
  tone: 'sunnyside' | 'vitrine' | 'huginn' | 'riso' | 'hachure'
}

/**
 * The documented design-system cases. This list is deliberately short: it is the
 * design-engineering shelf, not every project. Add a case only when it has a
 * brief, a mark, a system and a proof page to link to.
 */
export const DESIGN_CASES: readonly DesignCase[] = [
  {
    number: '01',
    name: 'Sunnyside',
    href: '/sunnyside',
    tagline: 'A studio wall, not a template.',
    description:
      'Warm paper, dark ink, one cobalt field and a sticker drawer. A sun cut from paper, a marker wordmark, and an archive wing that shares one shell.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · frontend · docs',
    material: 'Paper + ink + cobalt',
    cover: '/brand/sunnyside-brandkit.png',
    coverAlt:
      'The Sunnyside brand kit: paper and ink identity board with the sun mark, palette, type specimens and favicon sizes.',
    tags: ['Paper', 'Cobalt', 'Marker', 'Stickers'],
    tone: 'sunnyside',
  },
  {
    number: '02',
    name: 'Vitrine',
    href: '/design-system/vitrine',
    tagline: 'A glass case for a low-resolution light.',
    description:
      'Glass containers, a dithered information layer, a folded ribbon V, ten native form controls and an honest audit. Case 02 asks whether depth can stay legible.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · dither',
    material: 'Glass + dither + Signal',
    cover: '/brand/vitrine/vitrine-brandkit.png',
    coverAlt:
      'The Vitrine brand board: the folded V mark with a Signal label, Case and Frost palette, Signal field, type specimens, favicon and form specimen.',
    tags: ['Glass', 'Dither', 'Ribbon', 'Forms'],
    tone: 'vitrine',
  },
  {
    number: '03',
    name: 'Huginn Studio',
    href: '/design-system/huginn',
    tagline: 'A picture becomes cells. A name becomes cells.',
    description:
      'Arbo’s Åsgårdsreien dissolved into one vermilion field by an ordered dither, and a blackletter wordmark cut from a 22-row cell grid. No webfont, no rounded corners, and an audit that names what it could not verify.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · component proof',
    material: 'Paper + ink + vermilion',
    cover: '/brand/huginn/huginn-brandkit.png',
    coverAlt:
      'The Huginn brand board: the two-bracket keystone mark, the drawn blackletter wordmark, the vermilion field, and the painting dissolving into it through an ordered dither.',
    tags: ['Print', 'Dither', 'Blackletter', 'Forms'],
    tone: 'huginn',
  },
  {
    number: '04',
    name: 'Riso Co.',
    href: '/design-system/riso',
    tagline: 'Two passes, one sheet.',
    description:
      'Fluorescent orange and federal blue, printed one drum at a time. The 2.5px misregistration is the rule, the overprint is a third clipped path instead of a blend mode, and sixteen contrast pairs are measured in the build — including the one that fails.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · form kit · print proof',
    material: 'Paper + orange + blue',
    cover: '/brand/riso/riso-brandkit.png',
    coverAlt:
      'The Riso Co. brand board: an orange sheet pulled 2.2mm off its blue pass, the two-sheet overprint mark, five ink chips, the outlined wordmark at three favicon sizes and a torn sheet edge.',
    tags: ['Risograph', 'Misregistration', 'Overprint', 'Deckle Tear'],
    tone: 'riso',
  },
  {
    number: '05',
    name: 'Hachure',
    href: '/design-system/hachure',
    tagline: 'Relief drawn by density, never by shadow.',
    description:
      'A cartographic interface system built from the supplied ridgeline footer: six ridges from one seed, seven tones from one paper, a lichen-capped ridge of solid bars, and a footer you can read an altitude off. Every contrast pair is measured in the build.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · dither engine · form kit',
    material: 'Survey paper + lichen + ordered dither',
    cover: '/brand/hachure/hachure-brandkit.png',
    coverAlt:
      'The Hachure brand board: a 3 × 3 identity deck on a night table — the solid ridge mark, the outlined mono wordmark, the dither plate, the seven-tone ramp, the field sheet and the form kit.',
    tags: ['Hachure', 'Bayer Dither', 'Survey', 'Altimeter'],
    tone: 'hachure',
  },
]
