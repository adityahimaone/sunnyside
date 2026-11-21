import { useMemo } from 'react'

import { round } from '@/components/ui/sticker-slap-footer'

type ProtractorProps = {
  radius: number
  inner: number
  fill: string
  /** Ink for the ticks. */
  ink?: string
  /** Fills the hollow of the arc, e.g. to turn the tool into a sun arch. */
  core?: string
  coreClassName?: string
  /** Draws the arc's cardboard foot below the flat edge. */
  foot?: boolean
}

/**
 * A half-ring paper protractor: flat edge on y = 0, hub at the origin, ticks
 * every 5°. Pure drawing with no motion of its own, so any section can place,
 * rotate or scale it. The hero turns this one tool from a drafting table
 * instrument into the sun arch of the paper town.
 */
export function Protractor({
  radius,
  inner,
  fill,
  ink = '#191a2e',
  core,
  coreClassName,
  foot = true,
}: ProtractorProps) {
  const ticks = useMemo(
    () =>
      Array.from({ length: 37 }, (_, i) => {
        const deg = i * 5
        const a = (deg * Math.PI) / 180
        const len = deg % 10 === 0 ? 24 : 14
        const r1 = radius - 6
        const r2 = radius - 6 - len
        return {
          key: deg,
          x1: round(-Math.cos(a) * r1),
          y1: round(-Math.sin(a) * r1),
          x2: round(-Math.cos(a) * r2),
          y2: round(-Math.sin(a) * r2),
        }
      }),
    [radius],
  )

  return (
    <g>
      {core ? (
        <path
          className={coreClassName}
          d={`M${-inner} 0 A${inner} ${inner} 0 0 1 ${inner} 0 Z`}
          fill={core}
        />
      ) : null}
      <path
        d={`M${-radius} 0 A${radius} ${radius} 0 0 1 ${radius} 0 L${inner} 0 A${inner} ${inner} 0 0 0 ${-inner} 0 Z`}
        fill={fill}
      />
      {foot ? (
        <rect
          x={-radius}
          y={0}
          width={radius * 2}
          height={24}
          rx={6}
          fill={fill}
        />
      ) : null}
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={ink}
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
      <path
        d={`M${-inner + 14} -6 A${inner - 14} ${inner - 14} 0 0 1 ${inner - 14} -6`}
        fill="none"
        stroke={ink}
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeDasharray="3 9"
        strokeLinecap="round"
      />
      <circle cy={foot ? 12 : 0} r={5} fill={ink} opacity={0.5} />
    </g>
  )
}
