/**
 * The cast of the About tray.
 *
 * `size` is the sticker's drawn diameter at the full-width tray; the runtime
 * scales it down on narrow screens. `rest` is where the sticker sits in the
 * tray's ghost outline: it is the whole layout for reduced motion, and the
 * silhouettes printed on the liner, so the live pile reads as having been
 * peeled from exactly these places. `x` is a share of the tray width and `y`
 * is the share of the tray height the sticker's centre sits at.
 */
export type PitKind =
  | 'smiley'
  | 'burst'
  | 'daisy'
  | 'bolt'
  | 'atom'
  | 'stampCity'
  | 'stampRole'

export type PitSpec = {
  id: PitKind
  size: number
  /** Hero sticker this one peels off, by `data-hero-sticker`. */
  from?: 'smiley' | 'burst' | 'daisy' | 'bolt'
  rest: { x: number; y: number; rot: number }
}

export const PIT_STICKERS: readonly PitSpec[] = [
  { id: 'stampRole', size: 104, rest: { x: 0.1, y: 0.58, rot: -8 } },
  {
    id: 'smiley',
    size: 80,
    from: 'smiley',
    rest: { x: 0.24, y: 0.62, rot: 9 },
  },
  { id: 'daisy', size: 84, from: 'daisy', rest: { x: 0.37, y: 0.6, rot: -6 } },
  { id: 'burst', size: 88, from: 'burst', rest: { x: 0.5, y: 0.6, rot: 12 } },
  { id: 'atom', size: 78, rest: { x: 0.63, y: 0.64, rot: -10 } },
  { id: 'bolt', size: 70, from: 'bolt', rest: { x: 0.75, y: 0.62, rot: 14 } },
  { id: 'stampCity', size: 100, rest: { x: 0.89, y: 0.58, rot: 6 } },
] as const

/** Share of a sticker's drawn size that collides. Rims and rays are soft. */
export const HIT = 0.44
