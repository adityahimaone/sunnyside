'use client'

import { useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  return (
    <button
      type="button"
      className="hg-theme-toggle"
      aria-pressed={dark}
      onClick={() => {
        const next = !dark
        document
          .querySelector('[data-huginn-root]')
          ?.setAttribute('data-theme', next ? 'dark' : 'light')
        setDark(next)
      }}
    >
      <span aria-hidden="true">{dark ? '◐' : '◑'}</span>
      {dark ? 'Ink ground' : 'Bone ground'}
    </button>
  )
}
