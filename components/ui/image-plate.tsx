'use client'

import Image, { type ImageProps } from 'next/image'
import { useState, type SyntheticEvent } from 'react'

import styles from './image-plate.module.css'

/**
 * Tracks whether a cover has decoded, for the plate that covers it until then.
 *
 * The ref check is not belt-and-braces: a cover that is already in the browser
 * cache is complete before hydration runs, so its load event fires before this
 * component exists and the plate would never lift. `naturalWidth` keeps the
 * plate down for a request that failed — an errored image also reports
 * `complete`, and lifting for it would trade a plate for a blank frame.
 */
export function useDeveloped() {
  const [developed, setDeveloped] = useState(false)

  // A failed request can still report `load` in some engines, so the signal is
  // the decoded width, not the event's arrival.
  const lift = (element: HTMLImageElement | null) => {
    if (element?.complete && element.naturalWidth > 0) setDeveloped(true)
  }

  return {
    developed,
    onLoad: (event: SyntheticEvent<HTMLImageElement>) =>
      lift(event.currentTarget),
    ref: lift,
  }
}

/** The cream plate, hatched grid and sweeping sheen that stand in for a cover. */
export function ImagePlate({
  developed,
  label,
}: {
  developed: boolean
  label: string
}) {
  return (
    <span className={styles.plate} data-developed={developed} aria-hidden>
      <span className={styles.grid} />
      <span className={styles.sheen} />
      <span className={styles.note}>{label}</span>
    </span>
  )
}

/**
 * A next/image that shows a developing plate until its pixels arrive.
 *
 * Sized by its parent: every call site positions it with `fill` inside a frame
 * that already owns the aspect ratio.
 */
export function DevelopingImage({
  label = 'Developing',
  alt = '',
  ...image
}: ImageProps & { label?: string }) {
  const { developed, onLoad, ref } = useDeveloped()

  return (
    <>
      <ImagePlate developed={developed} label={label} />
      <Image {...image} alt={alt} onLoad={onLoad} ref={ref} />
    </>
  )
}
