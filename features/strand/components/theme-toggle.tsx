'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../strand.module.css'

type Surface = 'dune' | 'night'

const KEY = 'strand-surface'

function applySurface(surface: Surface) {
  const root = document.documentElement
  root.dataset.strand = surface
  root.dataset.theme = surface === 'night' ? 'dark' : 'light'
}

export function StrandThemeToggle({ className }: { className?: string }) {
  const [surface, setSurface] = useState<Surface>('dune')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'dune' || saved === 'night') {
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
      /* storage unavailable */
    }
  }

  return (
    <div
      className={cn(styles.themeToggle, className)}
      role="group"
      aria-label="Surface Theme"
    >
      <button
        type="button"
        className={cn(
          styles.themeButton,
          surface === 'dune' && styles.themeButtonOn,
        )}
        aria-pressed={surface === 'dune'}
        aria-label="Dune theme (Light)"
        onClick={() => choose('dune')}
      >
        Dune
      </button>
      <button
        type="button"
        className={cn(
          styles.themeButton,
          surface === 'night' && styles.themeButtonOn,
        )}
        aria-pressed={surface === 'night'}
        aria-label="Night theme (Dark)"
        onClick={() => choose('night')}
      >
        Night
      </button>
    </div>
  )
}
