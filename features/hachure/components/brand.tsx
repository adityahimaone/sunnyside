import Link from 'next/link'

import styles from '../hachure.module.css'

import {
  COMPACT,
  MARK,
  WORDMARK_D,
  WORDMARK_RATIO,
  WORDMARK_VIEWBOX,
} from '../brand-paths'

/**
 * The mark: a rising ridge of solid bars.
 *
 * Four wedge-bars rise and thicken left to right; the gaps are the negative
 * channels and the widths carry the density. A lichen diamond sits on the
 * summit. No circle, no strokes. The compact drops to three bars and widens the
 * channels; `mono` collapses the apex to currentColor.
 */
export function HachureMark({
  size = 32,
  compact = false,
  mono = false,
  title,
  className,
}: {
  size?: number
  compact?: boolean
  mono?: boolean
  title?: string
  className?: string
}) {
  const v = compact ? COMPACT : MARK

  return (
    <svg
      viewBox={`0 0 ${v.box} ${v.box}`}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={v.bars} fill="var(--hx-mark-ink, #141413)" />
      <path d={v.apex} fill={mono ? 'currentColor' : '#B8CC3B'} />
    </svg>
  )
}

/** The name, outlined once from Geist Mono 700. Never live text. */
export function HachureWordmark({
  height = 26,
  className,
}: {
  height?: number
  className?: string
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      height={height}
      width={Math.round(height * WORDMARK_RATIO)}
      className={className}
      role="img"
      aria-label="hachure"
      focusable="false"
    >
      <path d={WORDMARK_D} fill="currentColor" />
    </svg>
  )
}

export function HachureLockup({ size = 30 }: { size?: number }) {
  return (
    <Link
      href="/design-system/hachure"
      className={styles.lockup}
      aria-label="Hachure — design system"
    >
      <HachureMark size={size} compact={size <= 32} />
      <span className={styles.lockupWord} aria-hidden="true">
        <HachureWordmark height={Math.round(size * 0.58)} />
        <span className={styles.lockupSub}>terrain / weather / field data</span>
      </span>
    </Link>
  )
}
