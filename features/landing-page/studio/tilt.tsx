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
 * The transform is one hardware-accelerated string built from springs, so the
 * pointer never re-renders React. Touch and reduced-motion readers get the
 * finished, flat object; there is no layout or behavior change.
 */
export function Tilt({
  children,
  className,
  max = 5,
  perspective = 900,
}: {
  children: ReactNode
  className?: string
  max?: number
  perspective?: number
}) {
  const reduced = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 140, damping: 18, mass: 0.45 })
  const sy = useSpring(py, { stiffness: 140, damping: 18, mass: 0.45 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const transform = useMotionTemplate`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn(styles.tilt, className)}
      style={{ transform }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
