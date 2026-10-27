import type { FlightParams } from './journey-math'

/**
 * Who flies where.
 *
 * Every dock lives in the empty padding band at the top (or bottom) edge of a
 * section, never in the middle of one, so a resting sticker can never sit on
 * copy. `x` is a share of the section's width, `oy` is px in from the chosen
 * edge, and `tint` is the colour of the shockwave the sun throws when it lands.
 */
export type StickerKind =
  | 'smiley'
  | 'burst'
  | 'daisy'
  | 'bolt'
  | 'sun'
  | 'heart'

export type DockSpec = {
  /** CSS selector of the section the dock sits in. */
  at: string
  x: number
  edge?: 'top' | 'bottom'
  oy?: number
  rot: number
  size: number
  tint?: string
}

export type FlyerSpec = {
  id: string
  kind: StickerKind
  /** Marker text for the burst. */
  text?: string
  /** Hero sticker this one peels off, by its `data-journey-from` value. */
  from?: string
  /** Spawns at its first dock with a pop instead of peeling off the hero. */
  spawn?: boolean
  /** Throws a shockwave tinted by each dock's `tint` when it lands. */
  shockwave?: boolean
  /** Confetti when it lands on its last dock. */
  confetti?: boolean
  mobile: boolean
  params: FlightParams
  docks: readonly DockSpec[]
}

export const TINT = {
  about: '#ffd23f',
  showcase: '#ffb6e1',
  work: '#a9c8ff',
  skills: '#b7e4c7',
  contact: '#ff6a2b',
} as const

export const SPARK_COLOURS = [
  '#ffd23f',
  '#ff6a2b',
  '#ffb6e1',
  '#a9c8ff',
  '#b7e4c7',
  '#3d53d6',
] as const

export const FLYERS: readonly FlyerSpec[] = [
  {
    id: 'smiley',
    kind: 'smiley',
    from: 'smiley',
    mobile: true,
    params: { lane: -0.1, arc: 0.1, hop: 0.12, spin: 1, wobble: 7, delay: 0 },
    docks: [
      { at: '#about', x: 0.92, oy: 46, rot: 10, size: 70 },
      { at: '#showcase', x: 0.08, oy: 46, rot: -10, size: 72 },
      { at: '#work', x: 0.9, oy: 46, rot: 8, size: 70 },
      { at: '#skills', x: 0.1, oy: 46, rot: -6, size: 72 },
      { at: '#contact', x: 0.9, oy: 46, rot: 6, size: 78 },
    ],
  },
  {
    id: 'burst',
    kind: 'burst',
    text: 'wow!',
    from: 'burst',
    mobile: true,
    params: {
      lane: 0.12,
      arc: -0.12,
      hop: 0.06,
      spin: -2,
      wobble: 5,
      delay: 0.1,
    },
    docks: [
      { at: '#about', x: 0.07, oy: 46, rot: -12, size: 74 },
      { at: '#showcase', x: 0.93, oy: 46, rot: 12, size: 74 },
      { at: '#skills', x: 0.5, oy: 46, rot: -8, size: 74 },
      { at: '#contact', x: 0.1, edge: 'bottom', oy: 46, rot: 10, size: 80 },
    ],
  },
  {
    id: 'daisy',
    kind: 'daisy',
    from: 'daisy',
    mobile: false,
    params: {
      lane: -0.16,
      arc: 0.14,
      hop: 0.04,
      spin: 1.5,
      wobble: 4,
      delay: 0.18,
    },
    docks: [
      { at: '#about', x: 0.9, edge: 'bottom', oy: 46, rot: 8, size: 72 },
      { at: '#work', x: 0.5, oy: 46, rot: -10, size: 72 },
      { at: '#skills', x: 0.08, edge: 'bottom', oy: 46, rot: 12, size: 76 },
      { at: '#contact', x: 0.06, oy: 46, rot: -8, size: 76 },
    ],
  },
  {
    id: 'bolt',
    kind: 'bolt',
    from: 'bolt',
    mobile: false,
    params: {
      lane: 0.06,
      arc: 0.2,
      hop: 0.16,
      spin: 0,
      wobble: 16,
      delay: 0.26,
    },
    docks: [
      { at: '#about', x: 0.14, edge: 'bottom', oy: 46, rot: -14, size: 60 },
      { at: '#showcase', x: 0.7, oy: 46, rot: 10, size: 60 },
      { at: '#work', x: 0.07, oy: 46, rot: -10, size: 62 },
      { at: '#skills', x: 0.92, oy: 46, rot: 14, size: 62 },
    ],
  },
  {
    id: 'sun',
    kind: 'sun',
    spawn: true,
    shockwave: true,
    mobile: true,
    params: { lane: 0, arc: 0, hop: 0.22, spin: 0.5, wobble: 0, delay: 0.04 },
    docks: [
      {
        at: '#showcase',
        x: 0.5,
        oy: 46,
        rot: 0,
        size: 84,
        tint: TINT.showcase,
      },
      { at: '#work', x: 0.22, oy: 46, rot: 0, size: 84, tint: TINT.work },
      { at: '#skills', x: 0.78, oy: 46, rot: 0, size: 84, tint: TINT.skills },
      { at: '#contact', x: 0.5, oy: 46, rot: 0, size: 92, tint: TINT.contact },
    ],
  },
  {
    id: 'heart',
    kind: 'heart',
    spawn: true,
    confetti: true,
    mobile: false,
    params: {
      lane: -0.1,
      arc: 0.08,
      hop: 0.1,
      spin: 0,
      wobble: 10,
      delay: 0.1,
    },
    docks: [
      { at: '#skills', x: 0.3, edge: 'bottom', oy: 46, rot: -8, size: 64 },
      { at: '#contact', x: 0.2, oy: 46, rot: 8, size: 70 },
      { at: '#outro', x: 0.5, oy: 40, rot: 0, size: 84 },
    ],
  },
]
