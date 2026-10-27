import Image from 'next/image'

export function HuginnMark({
  size = 48,
  compact = false,
}: {
  size?: number
  compact?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="var(--hg-vermilion)"
        d={
          compact
            ? 'M8 8h48v10H18v38H8zM28 28h10v28H28z'
            : 'M8 8h48v8H16v40H8zM28 28h8v28h-8z'
        }
      />
      {!compact ? (
        <g fill="var(--hg-ink)">
          <circle cx="36" cy="36" r="3" />
          <circle cx="43" cy="43" r="2" />
          <circle cx="50" cy="50" r="1.4" />
        </g>
      ) : null}
    </svg>
  )
}

export function HuginnLockup({ size = 42 }: { size?: number }) {
  return (
    <a
      href="#top"
      className="hg-lockup"
      aria-label="Huginn Studio, back to top"
    >
      <Image
        src="/brand/huginn/mark-compact.svg"
        width={size}
        height={size}
        alt=""
        priority
      />
      <span>
        Huginn <small>Studio</small>
      </span>
    </a>
  )
}
