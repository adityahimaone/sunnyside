'use client'

import * as React from 'react'

import styles from '../riso.module.css'

/**
 * Two controls, both of them press facts rather than preferences: which drum is
 * loaded, and whether the sheet is on the table or under safelight. The page
 * root carries the state so CSS can read it.
 */
export function RisoControls() {
  const [pass, setPass] = React.useState<'a' | 'b'>('a')
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const root = document.querySelector('[data-riso-root]')
    if (!root) return
    root.setAttribute('data-pass', pass)
    root.setAttribute('data-theme', theme)
  }, [pass, theme])

  return (
    <div className={styles.controls}>
      <div className={styles.inkSwitch} role="group" aria-label="Loaded drum">
        <button
          type="button"
          className={styles.inkButton}
          data-ink="a"
          aria-pressed={pass === 'a'}
          onClick={() => setPass('a')}
          title="Orange drum"
        >
          <span aria-hidden="true" />
          <span className={styles.visuallyHidden}>Orange drum</span>
        </button>
        <button
          type="button"
          className={styles.inkButton}
          data-ink="b"
          aria-pressed={pass === 'b'}
          onClick={() => setPass('b')}
          title="Blue drum"
        >
          <span aria-hidden="true" />
          <span className={styles.visuallyHidden}>Blue drum</span>
        </button>
      </div>
      <button
        type="button"
        className={styles.themeButton}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label={`Switch to ${theme === 'light' ? 'safelight' : 'daylight'}`}
      >
        {theme === 'light' ? 'Daylight' : 'Safelight'}
      </button>
    </div>
  )
}

const STOPS = [
  { value: 0, label: 'Registered' },
  { value: 2.5, label: 'House' },
  { value: 6, label: 'Wrong' },
]

/**
 * The rule, made adjustable. Two impressions of the same words: carbon on top,
 * the blue drum behind it, offset by whatever the slider says. At 0 the sheet
 * is in register and looks like a poster; at 6 it looks like a mistake. The
 * house offset is 2.5px, which is the only number this system will defend.
 */
export function RegistrationDemo() {
  const [reg, setReg] = React.useState(2.5)

  return (
    <div className={styles.reg}>
      <div className={styles.regStage} style={{ '--reg': `${reg}px` } as React.CSSProperties}>
        <span className={styles.regGhost} aria-hidden="true">
          two passes
        </span>
        <span className={styles.regInk}>two passes</span>
      </div>

      <div className={styles.regControls}>
        <label className={styles.regSlider}>
          <span className={styles.label}>Registration error</span>
          <input
            type="range"
            min={0}
            max={6}
            step={0.1}
            value={reg}
            onChange={(event) => setReg(Number(event.target.value))}
            aria-valuetext={`${reg.toFixed(1)} pixels`}
          />
        </label>

        <output className={styles.regReadout}>
          <b>{reg.toFixed(1)}</b>
          <span>px</span>
        </output>

        <div className={styles.regPresets} role="group" aria-label="Registration presets">
          {STOPS.map((stop) => (
            <button
              key={stop.label}
              type="button"
              onClick={() => setReg(stop.value)}
              aria-pressed={Math.abs(reg - stop.value) < 0.05}
            >
              {stop.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
