import { useId } from 'react'

type StampProps = {
  /** Printed round the rim; repeated to fill the circle. */
  text: string
  fill: string
  className?: string
}

/**
 * A round die-cut stamp with its words set on a circle. Drawn like the other
 * stickers: a paper rim, an ink face, one flat colour, no gradient.
 */
export function Stamp({ text, fill, className }: StampProps) {
  const id = useId()
  const ring = `${text} · ${text} · `
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <path id={id} d="M60 60m-37 0a37 37 0 1 1 74 0a37 37 0 1 1 -74 0" />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="52"
        fill={fill}
        stroke="var(--paper-hi, #fffaf1)"
        strokeWidth="8"
      />
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke="var(--ink, #191a2e)"
        strokeWidth="1.6"
        strokeDasharray="2 4"
        strokeLinecap="round"
      />
      <text
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontWeight="700"
        fontSize="10.4"
        letterSpacing="2.4"
        fill="var(--ink, #191a2e)"
      >
        <textPath href={`#${id}`} startOffset="0" textLength="226">
          {ring.toUpperCase()}
        </textPath>
      </text>
      <path
        transform="translate(45 45) scale(0.75)"
        d="M20 2C21 14 26 19 38 20C26 21 21 26 20 38C19 26 14 21 2 20C14 19 19 14 20 2Z"
        fill="var(--ink, #191a2e)"
      />
    </svg>
  )
}
