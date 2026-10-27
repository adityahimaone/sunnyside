'use client'

import * as React from 'react'

import { flapPoly, makeTear, polyD, sheetD, START } from '@/components/ui/pushpin-tear-footer'

import styles from '../riso.module.css'

const W = 340
const H = 190
const SEEDS = [7, 23, 41]

/**
 * Three tears from the component's own geometry — same function, different
 * seed. This is the proof that the edge is drawn and not traced: nothing here
 * is an image, and every seed is reproducible on the server and in the browser.
 */
export function TearStudy() {
  return (
    <div className={styles.tearStrip}>
      {SEEDS.map((seed) => {
        const tear = makeTear(seed)
        const ys = tear.ys
        return (
          <figure className={styles.tearCell} key={seed}>
            <svg viewBox={`0 0 ${W} ${H}`} className={styles.tearSvg} role="img" aria-label={`Tear from seed ${seed}`}>
              <rect width={W} height={H} fill="var(--rs-surface-alt)" />
              <path d={sheetD(ys, W, H)} fill="var(--rs-surface)" />
              <path d={sheetD(ys, W, H, tear.rim)} fill="var(--rs-display-a)" />
              {tear.flaps.map((flap, index) => (
                <path
                  key={index}
                  d={polyD(flapPoly(ys, flap, W, H, 1))}
                  fill="var(--rs-surface-alt)"
                  stroke="var(--rs-overprint)"
                  strokeWidth="0.7"
                  strokeOpacity={0.45}
                />
              ))}
            </svg>
            <figcaption className={styles.tearCaption}>
              <span className={styles.label}>Seed {seed}</span>
              <span>
                {tear.ys.length} points / {tear.flaps.length} flaps / start {START}
              </span>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
