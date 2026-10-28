import Image from 'next/image'

import { cn } from '@/lib/utils'

import styles from '../cove.module.css'

/**
 * The shipped SVGs are the logo. Deep is the default surface and Frost is the
 * light scope; the CSS swaps the two-image pair. The mark is opaque, so a
 * favicon that inherited currentColor would disappear in browser chrome.
 */
export function CoveLockup({
  className,
  priority = false,
  label = 'Cove',
}: {
  className?: string
  priority?: boolean
  label?: string
}) {
  return (
    <span
      className={cn(styles.lockup, className)}
      role="img"
      aria-label={label}
    >
      <Image
        src="/brand/cove/lockup.svg"
        alt=""
        width={108}
        height={34}
        priority={priority}
        className={styles.onlyFrost}
      />
      <Image
        src="/brand/cove/lockup-reverse.svg"
        alt=""
        width={108}
        height={34}
        priority={priority}
        className={styles.onlyDeep}
      />
    </span>
  )
}

export function CoveStacked({
  className,
  height = 88,
  priority = false,
}: {
  className?: string
  height?: number
  priority?: boolean
}) {
  return (
    <span
      className={cn(styles.stacked, className)}
      style={{ height }}
      role="img"
      aria-label="Cove"
    >
      <Image
        src="/brand/cove/lockup-stacked.svg"
        alt=""
        width={72}
        height={88}
        priority={priority}
        className={styles.onlyFrost}
      />
      <Image
        src="/brand/cove/lockup-stacked-reverse.svg"
        alt=""
        width={72}
        height={88}
        priority={priority}
        className={styles.onlyDeep}
      />
    </span>
  )
}

export function CoveMark({
  className,
  size = 32,
  decorative = false,
  compact = false,
}: {
  className?: string
  size?: number
  decorative?: boolean
  compact?: boolean
}) {
  const useCompact = compact || size < 32
  const light = useCompact
    ? '/brand/cove/mark-compact.svg'
    : '/brand/cove/mark.svg'
  const dark = useCompact
    ? '/brand/cove/mark-compact-reverse.svg'
    : '/brand/cove/mark-reverse.svg'

  return (
    <span
      className={cn(styles.mark, className)}
      style={{ width: size, height: size }}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img' })}
      aria-label={decorative ? undefined : 'Cove'}
    >
      <Image
        src={light}
        alt=""
        width={64}
        height={64}
        className={styles.onlyFrost}
      />
      <Image
        src={dark}
        alt=""
        width={64}
        height={64}
        className={styles.onlyDeep}
      />
    </span>
  )
}

export function CoveWordmark({
  className,
  height = 26,
}: {
  className?: string
  height?: number
}) {
  return (
    <span
      className={cn(styles.wordmark, className)}
      style={{ height }}
      role="img"
      aria-label="Cove"
    >
      <Image
        src="/brand/cove/wordmark.svg"
        alt=""
        width={1422}
        height={555}
        className={styles.onlyFrost}
      />
      <Image
        src="/brand/cove/wordmark-reverse.svg"
        alt=""
        width={1422}
        height={555}
        className={styles.onlyDeep}
      />
    </span>
  )
}
