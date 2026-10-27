'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import styles from './design-engineering.module.css'

export function CopyCommand({
  text,
  label = 'Copy command',
}: {
  text: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }

    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? (
        <Check className={styles.copyIcon} aria-hidden />
      ) : (
        <Copy className={styles.copyIcon} aria-hidden />
      )}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
