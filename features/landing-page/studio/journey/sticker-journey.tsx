'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { Bolt, Burst, Daisy, Heart, Smiley, Sun } from '../doodles'
import { FLYERS, type FlyerSpec } from './journey-config'
import { runJourney } from './journey-runtime'
import styles from './sticker-journey.module.css'

const SPARKS = 10

function Art({ spec }: { spec: FlyerSpec }) {
  switch (spec.kind) {
    case 'smiley':
      return <Smiley />
    case 'burst':
      return <Burst text={spec.text ?? 'hi!'} />
    case 'daisy':
      return <Daisy />
    case 'bolt':
      return <Bolt />
    case 'sun':
      return <Sun />
    case 'heart':
      return <Heart />
  }
}

/**
 * Stickers that travel the page.
 *
 * Mounted inside the studio root so it inherits the palette's custom
 * properties, and positioned in document space so a resting sticker scrolls
 * with its section like any other element. All movement is written imperatively
 * by `runJourney`; this component only renders the cast once.
 *
 * Reduced motion renders nothing, and the hero keeps its own stickers.
 */
export function StickerJourney() {
  const reduced = useReducedMotion() ?? false
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !layer.current) return
    return runJourney(layer.current)
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={layer} className={styles.layer} aria-hidden>
      {FLYERS.map((spec) => (
        <div key={spec.id} className={styles.flyer} data-flyer={spec.id}>
          <div className={styles.inner} data-flyer-inner>
            <Art spec={spec} />
          </div>
          {Array.from({ length: SPARKS }, (_, i) => (
            <i key={i} className={styles.spark} data-spark />
          ))}
        </div>
      ))}
      <div className={styles.ring} data-journey-ring />
    </div>
  )
}
