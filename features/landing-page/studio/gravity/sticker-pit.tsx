'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, type CSSProperties } from 'react'

import { Bolt, Burst, Daisy, Atom, Smiley } from '../doodles'
import { PIT_STICKERS, type PitSpec } from './pit-config'
import { runPit, type PitRuntime } from './pit-runtime'
import { Stamp } from './stamps'
import styles from './sticker-pit.module.css'

function Art({ spec }: { spec: PitSpec }) {
  switch (spec.id) {
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

/**
 * The release liner: the backing sheet the stickers were peeled from.
 *
 * When it scrolls into view the stickers drop in from above under gravity,
 * pile up, and can be picked up and flung. The faint dashed outlines are the
 * shapes they left behind, and they are also where the stickers sit when
 * motion is reduced, so the tray is complete without the physics.
 *
 * Everything inside is decoration. The one control, "Shake the tray", is a
 * real button so the toy has a keyboard and screen-reader path, and the
 * stickers themselves are hidden from assistive tech.
 */
export function StickerPit() {
  const reduced = useReducedMotion() ?? false
  const pitRef = useRef<HTMLDivElement>(null)
  const runtime = useRef<PitRuntime | null>(null)

  useEffect(() => {
    if (reduced || !pitRef.current) return
    const pit = pitRef.current
    pit.dataset.live = 'true'
    runtime.current = runPit(pit)
    return () => {
      runtime.current?.stop()
      runtime.current = null
      delete pit.dataset.live
    }
  }, [reduced])

  return (
    <div className={styles.wrap}>
      <div ref={pitRef} className={styles.pit} data-gravity-pit>
        <div className={styles.ghosts} aria-hidden>
          {PIT_STICKERS.map((spec) => (
            <i
              key={spec.id}
              style={
                {
                  '--x': `${spec.rest.x * 100}%`,
                  '--y': `${spec.rest.y * 100}%`,
                  '--size': `${spec.size}px`,
                  '--rot': `${spec.rest.rot}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <span className={styles.label} aria-hidden>
          release liner · {PIT_STICKERS.length} stickers
        </span>

        {PIT_STICKERS.map((spec) => (
          <div
            key={spec.id}
            className={styles.sticker}
            data-pit-sticker={spec.id}
            aria-hidden
            style={
              {
                '--x': `${spec.rest.x * 100}%`,
                '--y': `${spec.rest.y * 100}%`,
                '--size': `${spec.size}px`,
                '--rot': `${spec.rest.rot}deg`,
              } as CSSProperties
            }
          >
            <Art spec={spec} />
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <span className={styles.hint} aria-hidden>
          pick one up, throw it
        </span>
        {reduced ? null : (
          <button
            type="button"
            className={styles.shake}
            onClick={() => runtime.current?.shake()}
          >
            Shake the tray
          </button>
        )}
      </div>
    </div>
  )
}
