import Image from 'next/image'

import { cn } from '@/lib/utils'

import styles from '../strand.module.css'

export function StrandLockup({
  className,
  priority = false,
  label = 'Strand',
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
        src="/brand/strand/lockup.svg"
        alt=""
        width={130}
        height={36}
        priority={priority}
        className={styles.onlyLight}
      />
      <Image
        src="/brand/strand/lockup-reverse.svg"
        alt=""
        width={130}
        height={36}
        priority={priority}
        className={styles.onlyDark}
      />
    </span>
  )
}

export function StrandStacked({
  className,
  height = 96,
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
      aria-label="Strand"
    >
      <Image
        src="/brand/strand/lockup-stacked.svg"
        alt=""
        width={96}
        height={96}
        priority={priority}
        className={styles.onlyLight}
      />
      <Image
        src="/brand/strand/lockup-stacked-reverse.svg"
        alt=""
        width={96}
        height={96}
        priority={priority}
        className={styles.onlyDark}
      />
    </span>
  )
}

export function StrandMark({
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
    ? '/brand/strand/mark-compact.svg'
    : '/brand/strand/mark.svg'
  const dark = useCompact
    ? '/brand/strand/mark-compact-reverse.svg'
    : '/brand/strand/mark-reverse.svg'

  return (
    <span
      className={cn(styles.mark, className)}
      style={{ width: size, height: size }}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img' })}
      aria-label={decorative ? undefined : 'Strand'}
    >
      <Image
        src={light}
        alt=""
        width={64}
        height={64}
        className={styles.onlyLight}
      />
      <Image
        src={dark}
        alt=""
        width={64}
        height={64}
        className={styles.onlyDark}
      />
    </span>
  )
}

export function StrandWordmark({
  className,
  height = 24,
}: {
  className?: string
  height?: number
}) {
  return (
    <span
      className={cn(styles.wordmark, className)}
      style={{ height }}
      role="img"
      aria-label="Strand"
    >
      <Image
        src="/brand/strand/wordmark.svg"
        alt=""
        width={132}
        height={25}
        className={styles.onlyLight}
      />
      <Image
        src="/brand/strand/wordmark-reverse.svg"
        alt=""
        width={132}
        height={25}
        className={styles.onlyDark}
      />
    </span>
  )
}
