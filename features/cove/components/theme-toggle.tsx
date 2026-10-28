'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../cove.module.css'

type Surface = 'deep' | 'frost'

const KEY = 'cove-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  root.dataset.cove = surface
  // A stable hook for QA and for the browser's own light/dark heuristics.
  root.dataset.theme = surface === 'frost' ? 'light' : 'dark'
}

/**
 * Cove is a deep-first system; Frost is the same material on a light ground.
 * The switch is local to the case so it cannot repaint the rest of the site.
 */
export function CoveThemeToggle({ className }: { className?: string }) {
  const [surface, setSurface] = useState<Surface>('deep')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'frost' || saved === 'deep') {
      // Bootstrap the stored surface after hydration; the server render is Deep.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurface(saved)
      applySurface(saved)
    }
  }, [])

  const choose = (next: Surface) => {
    setSurface(next)
    applySurface(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* storage can be unavailable */
    }
  }

  return (
    <div
      className={cn(styles.themeToggle, className)}
      role="group"
      aria-label="Surface"
    >
      <button
        type="button"
        className={cn(
          styles.themeButton,
          surface === 'deep' && styles.themeButtonOn,
        )}
        aria-pressed={surface === 'deep'}
        aria-label="Deep theme (Dark)"
        onClick={() => choose('deep')}
      >
        Deep
      </button>
      <button
        type="button"
        className={cn(
          styles.themeButton,
          surface === 'frost' && styles.themeButtonOn,
        )}
        aria-pressed={surface === 'frost'}
        aria-label="Frost theme (Light)"
        onClick={() => choose('frost')}
      >
        Frost
      </button>
    </div>
  )
}
