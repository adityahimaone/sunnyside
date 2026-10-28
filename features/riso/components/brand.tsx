import Link from 'next/link'

import {
  COMPACT,
  MARK,
  WORDMARK_D,
  WORDMARK_GHOST,
  WORDMARK_RATIO,
  WORDMARK_VIEWBOX,
} from '../brand-paths'

/**
 * The mark: two passes, one overprint.
 *
 * Two sheared, unstroked sheets. Orange first, blue second, shifted like two
 * drum passes; the overlap is a sharp overprint polygon, not a circle and not
 * a blend mode. `compact` isolates the overprint; `mono` is the union of the
 * two sheets in currentColor. There are no strokes anywhere.
 */
export function RisoMark({
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
  const clip = `riso-${compact ? 'c' : 'f'}-${size}`
  const a = compact ? COMPACT.a : MARK.a
  const b = compact ? COMPACT.b : MARK.b

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
      {mono ? (
        <>
          <path d={MARK.a} fill="currentColor" />
          <path d={MARK.b} fill="currentColor" />
        </>
      ) : compact ? (
        <>
          <defs>
            <clipPath id={clip}>
              <path d={a} />
            </clipPath>
          </defs>
          <path
            d={b}
            fill="var(--rs-compact-ink, var(--rs-overprint))"
            clipPath={`url(#${clip})`}
          />
        </>
      ) : (
        <>
          <defs>
            <clipPath id={clip}>
              <path d={a} />
            </clipPath>
          </defs>
          <path d={a} fill="var(--rs-display-a)" />
          <path d={b} fill="var(--rs-display-b)" />
          <path
            d={b}
            fill="var(--rs-overprint)"
            clipPath={`url(#${clip})`}
          />
        </>
      )}
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
    <Link
      href="/design-system/riso"
      className="riso-lockup"
      aria-label="Riso Co. — design system"
    >
      <RisoMark size={size} />
      <span className="riso-lockup-word">
        <RisoWordmark height={Math.round(size * 0.66)} />
        <span className="riso-lockup-sub">Atelier ink / Berlin</span>
      </span>
    </Link>
  )
}
