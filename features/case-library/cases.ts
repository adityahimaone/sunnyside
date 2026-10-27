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
  tone: 'sunnyside' | 'vitrine' | 'huginn' | 'riso'
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
      'Glass containers, a dithered information layer, a Split V mark, ten native form controls and an honest audit. Case 02 asks whether depth can stay legible.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · dither',
    material: 'Glass + dither + Signal',
    cover: '/brand/vitrine/vitrine-brandkit.png',
    coverAlt:
      'The Vitrine brand board: Split V mark, Case and Frost palette, Signal field, type specimens, favicon and form specimen.',
    tags: ['Glass', 'Dither', 'Signal', 'Forms'],
    tone: 'vitrine',
  },
  {
    number: '03',
    name: 'Huginn Studio',
    href: '/design-system/huginn',
    tagline: 'A thought crosses the threshold and returns in print.',
    description:
      'Bone paper, iron ink, one vermilion field and an ordered-dither boundary. A bitmap wordmark, native form states and a configurable footer component make the print system tangible.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · component proof',
    material: 'Paper + ink + vermilion',
    cover: '/brand/huginn/huginn-brandkit.png',
    coverAlt:
      'The Huginn Studio brand board: Threshold Print mark, six mark studies, bone paper, ink, vermilion and ordered-dither field.',
    tags: ['Print', 'Dither', 'Vermilion', 'Forms'],
    tone: 'huginn',
  },
  {
    number: '04',
    name: 'Riso Co.',
    href: '/design-system/riso',
    tagline: 'A torn poster pinned to studio cork.',
    description:
      'Electric vermilion and cobalt sheets meet 270gsm vellum. Mathematical deckle-edge physics from Mulberry32 PRNG and a mechanical pushpin anchor tactile print engineering.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · tear physics',
    material: 'Vellum + soy ink + steel',
    cover: '/brand/riso/riso-brandkit.png',
    coverAlt:
      'The Riso Co. brand board: Pin & Deckle mark, vermilion sheet, pushpin, warm vellum, and typography.',
    tags: ['Risograph', 'Pushpin', 'Deckle Tear', 'Vellum'],
    tone: 'riso',
  },
]
