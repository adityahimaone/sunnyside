import Link from 'next/link'

import styles from '../hachure.module.css'

import {
  LOCKUP_H,
  LOCKUP_W,
  MARK_COMPACT_D,
  MARK_D,
  WORDMARK_D,
  WORDMARK_RATIO,
  WORDMARK_VIEWBOX,
} from '../brand-paths'

/**
 * The mark: a ridge that prints into paper.
 *
 * One silhouette and one operation. The profile is asymmetric on purpose — apex
 * left of centre, a knee, a long right shoulder — and everything above row 42 is
 * solid while the two rows below it break into 4-unit cells whose coverage
 * falls to 44%. The cells are drawn, not masked, so the mark is a single path
 * on any background.
 */
export function HachureMark({
  size = 32,
  compact = false,
  title,
  className,
}: {
  size?: number
  compact?: boolean
  title?: string
  className?: string
}) {
  return (
    <svg
      viewBox={compact ? '0 0 32 32' : '0 0 64 64'}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={compact ? MARK_COMPACT_D : MARK_D} fill="currentColor" />
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
      <HachureMark size={size} />
      <span className={styles.lockupWord} aria-hidden="true">
        <HachureWordmark height={Math.round(size * 0.58)} />
        <span className={styles.lockupSub}>terrain / weather / field data</span>
      </span>
    </Link>
  )
}

/**
 * A benchmark: the cross and tick a surveyor hammers into rock. Used as the
 * section marker, and never as a decorative triangle — the missing centre is
 * the whole point.
 */
export function Benchmark({
  size = 22,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 1v7M12 16v7M1 12h7M16 12h7"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

/**
 * The lockup geometry, exported for the board and the tokens page so nothing
 * has to re-measure the SVGs by hand.
 */
export const LOCKUP_BOX = { width: LOCKUP_W, height: LOCKUP_H } as const
