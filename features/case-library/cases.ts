import { LEDGER } from '@/features/ledger/data'

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
  tone:
    | 'sunnyside'
    | 'vitrine'
    | 'huginn'
    | 'riso'
    | 'hachure'
    | 'cove'
    | 'strand'
    | 'clearing'
    | 'ledger'
    | 'porphyry'
    | 'jakarta'
    | 'bluewater'
    | 'wildflower'
}

/**
 * The documented design-system cases. Sunnyside anchors the shelf at index 0;
 * everything after it runs newest first.
 *
 * The array order is the display order for both `/design-system` and the
 * landing-page shelf. `number` is the case's permanent identity (its own brand
 * docs and tokens quote it), so the shelf reads 01, then 11 → 02 as the newest
 * release leads. This list is deliberately short: it is the design-engineering
 * shelf, not every project. Add a case only when it has a brief, a mark, a
 * system and a proof page to link to.
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
    number: '13',
    name: 'Wildflower Wind',
    href: '/design-system/wildflower-wind',
    tagline: 'A meadow, seen through a pane of glass.',
    description:
      'A seed house under glass: five translucent petals that multiply where they cross, so the darkest thing in the mark is the crossing and not a stroke. A haze ground, panes with one lit edge and a long shadow, nested radii, and a violet that is the cosmos refracted rather than the pink in the photograph. Fifteen contrast pairs recomputed from hex, with the two that fail published instead of fixed.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · mark family · docs',
    material: 'Frosted glass + haze + one refracted violet',
    cover: '/brand/wildflower-wind/wildflower-wind-brandkit.png',
    coverAlt:
      'The Wildflower Wind board: five translucent glass petals with one taken, the wordmark in Instrument Serif, nine swatches from haze to refracted violet, and two plates of the same meadow.',
    tags: ['Glass', 'Seed house', 'Blur', 'Computed contrast'],
    tone: 'wildflower',
  },
  {
number: '12',
    name: 'Bluewater Freight',
    href: '/design-system/bluewater',
    tagline: 'The wake is the only bright thing.',
    description:
      'A passage system for maritime operators: a near-black sea, one silver wake that marks only what is moving, 1px chart rules, zero radius, and mono tabular numbers. A fullwidth crossing, a hull-and-waterline mark in two drawings, and an audit that publishes the one contrast pair it refuses to hide.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · docs',
    material: 'Deep water + silver wake + chart rule',
    cover: '/brand/bluewater/bluewater-brandkit.webp',
    coverAlt:
      'The Bluewater Freight hero: last light over open water with a container ship small on the horizon.',
    tags: ['Maritime', 'Chart', 'Zero radius', 'Mono'],
    tone: 'bluewater',
  },
  {
    number: '11',
    name: 'Jakarta',
    href: '/design-system/jakarta',
    tagline: 'Bergerak Menuju Era Baru Jakarta.',
    description:
      'One stroke that turns a corner and one stop where it turns, drawn from a single unit S. Nine district ramps named after Jakarta places, a palette that is a map rather than a mood, and the six contrast pairs that fail published instead of fixed. Enamel, vinyl, a transit card and a bus.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · wayfinding · docs',
    material: 'Enamel + vinyl + one orange',
    cover: '/brand/jakarta/jakarta-brandkit.webp',
    coverAlt:
      'The Jakarta brand board: the junction mark on paper, ink and Senja, nine district ramps in four steps, the outlined wordmark and the night scope.',
    tags: ['City', 'Transit', 'Nine Ramps', 'Wayfinding'],
    tone: 'jakarta',
  },
  {
    number: '10',
    name: 'Porphyry',
    href: '/design-system/porphyry',
    tagline: 'A page composed like a stage: one stone, one light, one cast.',
    description:
      'A classical diorama as an interface system. A stage opening cut into a block of stone, with a gold threshold, a loader that fills the wordmark with marble from the floor, three photographs keyed off their own black ground by luminance, a real vellum theme, a ten-part form kit and a detach score against every sibling.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · stage · form kit',
    material: 'Porphyry + marble + gold leaf + one dark stage',
    cover: '/brand/porphyry/porphyry-brandkit.png',
    coverAlt:
      'The Porphyry brand board: the stone block with its gold threshold, the porphyry and marble palette, the outlined Cinzel wordmark, the keyed statue and the stage tokens.',
    tags: ['Porphyry', 'Marble', 'Gold Leaf', 'Stage'],
    tone: 'porphyry',
  },
  {
    number: '09',
    name: LEDGER.name,
    href: LEDGER.href,
    tagline: LEDGER.tagline,
    description: LEDGER.description,
    status: LEDGER.status,
    role: LEDGER.role,
    material: LEDGER.material,
    cover: '/brand/ledger/ledger-brandkit.png',
    coverAlt:
      'The Ledger brand board: the grid mark with one lifted tile, the indigo harbor ramp, the glass recipe, the type scale and a dashboard specimen.',
    tags: LEDGER.tags,
    tone: 'ledger',
  },
  {
    number: '08',
    name: 'Clearing',
    href: '/design-system/clearing',
    tagline: 'A sighting, not a sticker.',
    description:
      'Painted emerald light seen through one pane of glass. A drawn stag on a tapered horizon, an outlined wordmark whose i-tittle is a light disc, five cast marks on one cut line, and an audit that names what it could not verify. No form kit, by request.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · docs',
    material: 'Painted emerald + cream + glass',
    cover: '/brand/clearing/clearing-brandkit.png',
    coverAlt:
      'The Clearing brand board: the stag on a tapered horizon, the outlined clearing wordmark with a disc tittle, six inks sampled from the painting, and the glass recipe.',
    tags: ['Painted', 'Emerald', 'Glass', 'Wildlife'],
    tone: 'clearing',
  },
  {
    number: '07',
    name: 'Strand',
    href: '/design-system/strand',
    tagline: 'Where the dunes meet the tide.',
    description:
      'A quiet coastal interface system: flat white quartz reading plates, marine basalt ink, one shallow-tide green signal, a Dune Crest S monogram, ten native controls and a panoramic vista framing hero and footer.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · form kit',
    material: 'Quartz sand + marine basalt + shallow tide',
    cover: '/brand/strand/strand-brandkit.png',
    coverAlt:
      'The Strand brand board: the architectural S mark, coastal shoreline palette, quartz reading plates and form kit.',
    tags: ['Coastal', 'Minimalist', 'Monogram', 'Forms'],
    tone: 'strand',
  },
  {
    number: '06',
    name: 'Cove',
    href: '/design-system/cove',
    tagline: 'A calmer kind of depth.',
    description:
      'One glass layer over one blue field, a solid reading plate, a squared C with an ice waterline, ten native controls and a measured audit. Case 06 asks what happens when glass is minimal instead of everywhere.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · liquid glass',
    material: 'Blue glass + ice',
    cover: '/brand/cove/cove-brandkit.png',
    coverAlt:
      'The Cove brand board: the squared C mark with an ice inlay, the Abyss and Foam palette, Instrument Serif and Sans, the glass recipe and the form kit.',
    tags: ['Liquid Glass', 'Blue', 'Instrument Serif', 'Forms'],
    tone: 'cove',
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
  {
    number: '04',
    name: 'Riso Co.',
    href: '/design-system/riso',
    tagline:
      'One pin holds the sheet. The tear is what the second drum prints.',
    description:
      'A sheet pinned at the top and torn from the pin: the right flap sits 4,3 out of register because the other drum made it. Two drums, never three, zero rounded corners, a tear edge cut from one clip-path, and sixteen contrast pairs measured in the build — including the two that fail.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · form kit · print proof',
    material: 'Vellum + two drums + one pin',
    cover: '/brand/riso/riso-brandkit.png',
    coverAlt:
      'The Riso Co. brand board: the pinned sheet torn from the pin, the orange and blue drums, the outlined wordmark at three favicon sizes, and a torn edge cut from one polygon.',
    tags: ['Risograph', 'Pinned Sheet', 'Two Drums', 'Tear'],
    tone: 'riso',
  },
  {
    number: '03',
    name: 'Huginn Studio',
    href: '/design-system/huginn',
    tagline: 'A picture becomes cells. A name becomes cells.',
    description:
      'One 14-unit cell draws Arbo’s Åsgårdsreien through an ordered dither, draws the wordmark in 22 rows, and draws the mark — five cells hold the picture and the sixth has left the grid. No font in the logo, no rounded corners, and an audit that names what it could not verify.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · dither',
    material: 'Vermilion field + ink + bone',
    cover: '/brand/huginn/huginn-brandkit.png',
    coverAlt:
      'The Huginn brand board: the vermilion field with the cell-drawn wordmark, the cell mark with one cell off the grid, and the painting dissolving into the field through an ordered dither.',
    tags: ['Cells', 'Dither', 'Vermilion', 'Print'],
    tone: 'huginn',
  },
  {
    number: '02',
    name: 'Vitrine',
    href: '/design-system/vitrine',
    tagline: 'A glass case for a low-resolution light.',
    description:
      'Glass containers, a dithered information layer, a half-light V mark, ten native form controls and an honest audit. Case 02 asks whether depth can stay legible.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · dither',
    material: 'Glass + dither + Signal',
    cover: '/brand/vitrine/vitrine-brandkit.png',
    coverAlt:
      'The Vitrine brand board: the half-light V mark, one glass arm and one Signal arm, Case and Frost palette, Signal field, type specimens, favicon and form specimen.',
    tags: ['Glass', 'Dither', 'Case', 'Forms'],
    tone: 'vitrine',
  }
]
