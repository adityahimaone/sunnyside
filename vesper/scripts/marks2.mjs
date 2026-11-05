// Round two. Round one failed for one reason: every concept stood on a wide
// plinth, and a wide plinth under a head is a trophy, not a lamp. Round two
// replaces the plinth with a horizon — the line the artwork is actually about —
// and tests three other readings of the same assets.

export const GRID = 64
export const INK = '#0d1526'
export const CREAM = '#f4ebda'

export const round2 = [
  {
    id: 'horizon-star',
    name: 'Horizon Star',
    line: 'The star that stayed.',
    why: 'Round one’s star, with the plinth replaced by a 40-unit horizon. It reads as a lamp standing on a line rather than an award on a base.',
    risk: 'The star is still a star; the horizon has to do all the differentiating.',
    primitives: 3,
    paths: [
      'M32 2 L35.4 21.6 L55 25 L35.4 28.4 L32 48 L28.6 28.4 L9 25 L28.6 21.6 Z',
      'M29.5 44 H34.5 V55 H29.5 Z',
      'M12 55 H52 V58 H12 Z',
    ],
  },
  {
    id: 'way',
    name: 'Way',
    line: 'A road to a light.',
    why: 'The ladder in the artwork, in perspective: two rails converging on a vanishing point with three ties. It is a V for Vesper and a path at the same time.',
    risk: 'Three ties plus two rails is five thin elements; below 24px the ties blur into a wedge.',
    primitives: 5,
    paths: [
      'M13 58 L27 16 H33 L19 58 Z',
      'M51 58 L37 16 H31 L45 58 Z',
      'M24 44 H40 V49 H24 Z',
      'M27 33 H37 V38 H27 Z',
      'M29 22 H35 V27 H29 Z',
      'M32 4 L34.4 10 L40 11.6 L34.4 13.2 L32 19 L29.6 13.2 L24 11.6 L29.6 10 Z',
    ],
  },
  {
    id: 'halo',
    name: 'Halo',
    line: 'The light, not the lamp.',
    why: 'A lantern head with six marks of light around it, on a thin post. The only concept where the light is drawn as separate objects, which is what the artwork does with stipple.',
    risk: 'Six floating dots are six detached specks at 16px; they will merge or vanish.',
    primitives: 3,
    paths: [
      'M30 5 H34 V10 H30 Z',
      'M25 10 H39 L41 27 H23 Z',
      'M30 27 H34 V56 H30 Z',
      'M15 18 m-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',
      'M49 18 m-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',
      'M19 6 m-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',
      'M45 6 m-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',
      'M14 33 m-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',
      'M50 33 m-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',
    ],
  },
  {
    id: 'moonline',
    name: 'Moonline',
    line: 'Evening, on the line.',
    why: 'The crescent from the artwork resting on the horizon. Two primitives, no post, no base — the simplest object in the set and the only one that is pure silhouette.',
    risk: 'Says night, not lamp; and a crescent is a widely used shape.',
    primitives: 2,
    paths: [
      'M52.76 35.27 A22 22 0 1 1 36.79 6.53 A17 17 0 1 0 52.76 35.27 Z',
      'M8 46 H56 V51 H8 Z',
    ],
  },
  {
    id: 'post',
    name: 'Post',
    line: 'One column, cut twice.',
    why: 'A single column with the light cut out of it: two notches on the upper third read as a lantern window. One primitive, one counter-form, no floating parts.',
    risk: 'Reads as a door or a keyhole until the notches are noticed.',
    primitives: 1,
    paths: [
      'M24 4 H40 V58 H24 Z M28 11 H36 V27 H28 Z',
    ],
  },
]

export const svg = (paths, { fill = INK, bg = null } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" role="img">${
    bg ? `<rect width="${GRID}" height="${GRID}" fill="${bg}"/>` : ''
  }<g fill="${fill}" fill-rule="evenodd">${paths.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`
