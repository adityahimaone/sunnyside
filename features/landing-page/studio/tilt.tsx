'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import styles from './studio.module.css'

/**
 * A small pointer-tracking 3D tilt for paper objects.
 *
 * One transform string, three springs: the tilt follows the pointer, and a
 * second spring owns the hover lift/scale so it settles with the same physics
 * instead of a separate CSS transition fighting the tilt. Pointer moves never
 * touch React state, so the card stays on the compositor.
 */
export function Tilt({
  children,
  className,
  max = 5,
  perspective = 900,
  lift = 3,
}: {
  children: ReactNode
  className?: string
  max?: number
  perspective?: number
  lift?: number
}) {
  const reduced = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const hover = useMotionValue(0)

  // Stiff enough to track the pointer, damped enough to settle without wobble.
  const tiltX = useSpring(px, { stiffness: 220, damping: 26, mass: 0.4 })
  const tiltY = useSpring(py, { stiffness: 220, damping: 26, mass: 0.4 })
  const liftSpring = useSpring(hover, {
    stiffness: 280,
    damping: 28,
    mass: 0.4,
  })

  const rotateX = useTransform(tiltY, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-max, max])
  const translateY = useTransform(liftSpring, [0, 1], [0, -lift])
  const transform = useMotionTemplate`perspective(${perspective}px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const onPointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    hover.set(1)
  }

  const reset = () => {
    px.set(0)
    py.set(0)
    hover.set(0)
  }

  return (
    <div
      ref={ref}
      className={cn(styles.tiltHit, className)}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        className={styles.tiltInner}
        style={reduced ? undefined : { transform }}
      >
        {children}
      </motion.div>
    </div>
  )
}
