import Link from 'next/link'

export function RisoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 18L52 18L52 38L44 34L36 42L28 36L20 44L12 36Z" fill="var(--rs-sheet-vermilion)" />
      <ellipse cx="28" cy="46" rx="6" ry="2" fill="var(--rs-ink-carbon)" opacity="0.25" />
      <path d="M31 32L33 32L32.4 46L31.6 46Z" fill="var(--rs-steel-needle)" />
      <path d="M26 14H38V18C38 21 34 23 34 26H30C30 23 26 21 26 18Z" fill="var(--rs-ink-carbon)" />
      <ellipse cx="32" cy="14" rx="7" ry="3.5" fill="var(--rs-ink-carbon)" />
      <ellipse cx="30.5" cy="13" rx="2.5" ry="1" fill="#ffffff" opacity="0.6" />
      <ellipse cx="32" cy="27" rx="5" ry="1.8" fill="var(--rs-ink-carbon)" />
    </svg>
  )
}

export function RisoLockup({ size = 28 }: { size?: number }) {
  return (
    <Link
      href="/design-system/riso"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        textDecoration: 'none',
        color: 'inherit',
      }}
      aria-label="Riso Co. — Design System Home"
    >
      <RisoMark size={size} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
          ink.
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--rs-sheet-vermilion)',
            letterSpacing: '-0.01em',
          }}
        >
          riso co.
        </span>
      </div>
    </Link>
  )
}
