'use client'

import { Atom, Bolt, Burst, Daisy, Smiley } from '../doodles'
import styles from './sticker-art.module.css'
import type { PitKind } from './pit-config'
import { Stamp } from './stamps'

/**
 * The sticker art itself, shared by the About release liner and the Work mat so
 * both scenes peel the same die-cut shapes instead of inventing new ones.
 */
export function StickerArt({ id }: { id: PitKind }) {
  switch (id) {
    case 'smiley':
      return <Smiley />
    case 'burst':
      return <Burst text="wow!" />
    case 'daisy':
      return <Daisy />
    case 'bolt':
      return <Bolt />
    case 'atom':
      return (
        <span className={styles.atomDisc}>
          <Atom />
        </span>
      )
    case 'stampCity':
      return <Stamp text="Jakarta · GMT+7" fill="var(--mint)" />
    case 'stampRole':
      return <Stamp text="Design engineer" fill="var(--butter)" />
  }
}
