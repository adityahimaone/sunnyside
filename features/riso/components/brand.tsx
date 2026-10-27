import Link from 'next/link'

import {
  COMPACT_OFFSET,
  COMPACT_STROKE,
  MARK_OFFSET,
  MARK_STROKE,
  SHEET,
  SHEET_COMPACT,
  WORDMARK_D,
  WORDMARK_GHOST,
  WORDMARK_RATIO,
  WORDMARK_VIEWBOX,
} from '../brand-paths'

/**
 * The mark: one sheet, two passes.
 *
 * The orange drum fills the sheet. The blue drum is the same drawing keylined
 * 2.2 units up and right — the plate that never quite registered. Where the
 * keyline lands on the sheet both drums hit the same fibre, so that stretch is
 * the overprint colour. Three clipped paths, no blend modes, no images.
 */
export function RisoMark({
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
  const d = compact ? SHEET_COMPACT : SHEET
  const offset = compact ? COMPACT_OFFSET : MARK_OFFSET
  const stroke = compact ? COMPACT_STROKE : MARK_STROKE
  const box = compact ? 32 : 64
  const clip = `riso-sheet-${compact ? 'c' : 'f'}-${size}`
  const t = `translate(${offset} ${-offset})`

  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill="var(--rs-display-a)" />
      <path
        d={d}
        transform={t}
        fill="none"
        stroke="var(--rs-display-b)"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <g clipPath={`url(#${clip})`}>
        <path
          d={d}
          transform={t}
          fill="none"
          stroke="var(--rs-overprint)"
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

/** The name, outlined once from Space Grotesk 700. Never live text. */
export function RisoWordmark({
  height = 28,
  ghost = true,
  ghostScale = 1,
  className,
}: {
  height?: number
  ghost?: boolean
  /** The second impression is 1.8% of the height; on a drum it needs more. */
  ghostScale?: number
  className?: string
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      height={height}
      width={Math.round(height * WORDMARK_RATIO)}
      className={className}
      role="img"
      aria-label="riso co."
      focusable="false"
    >
      {ghost && (
        <path
          d={WORDMARK_D}
          fill="var(--rs-ghost)"
          transform={`translate(${WORDMARK_GHOST * ghostScale} ${-WORDMARK_GHOST * ghostScale})`}
          opacity={0.9}
        />
      )}
      <path d={WORDMARK_D} fill="currentColor" />
    </svg>
  )
}

export function RisoLockup({ size = 30 }: { size?: number }) {
  return (
    <Link href="/design-system/riso" className="riso-lockup" aria-label="Riso Co. — design system">
      <RisoMark size={size} />
      <span className="riso-lockup-word">
        <RisoWordmark height={Math.round(size * 0.66)} />
        <span className="riso-lockup-sub">Atelier ink / Berlin</span>
      </span>
    </Link>
  )
}

/**
 * A registration target: two circles, the blue one 2.2 units off. Used as a
 * section marker, and as the only decorative thing on the page that is allowed
 * to be off-centre.
 */
export function RegistrationTarget({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M50 2V28M50 72v26M2 50h26M72 50h26" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="52.2" cy="47.8" r="30" fill="none" stroke="var(--rs-display-b)" strokeWidth="1.6" />
      <circle cx="52.2" cy="47.8" r="2.6" fill="var(--rs-overprint)" />
    </svg>
  )
}
