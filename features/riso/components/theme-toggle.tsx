'use client'

import * as React from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    const root = document.querySelector('[data-riso-root]')
    if (root) {
      root.setAttribute('data-theme', next)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8125rem',
        fontWeight: 600,
        padding: '0.4rem 0.8rem',
        borderRadius: '99px',
        border: '1px solid var(--rs-border)',
        backgroundColor: 'var(--rs-surface-card)',
        color: 'var(--rs-text)',
        cursor: 'pointer',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'darkroom' : 'daylight'} mode`}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: theme === 'light' ? 'var(--rs-sheet-vermilion)' : '#ffffff',
          display: 'inline-block',
        }}
      />
      {theme === 'light' ? 'Daylight' : 'Darkroom'}
    </button>
  )
}
