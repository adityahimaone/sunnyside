'use client'

import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from '../strand.module.css'

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLES = [
  { value: 'architect', label: 'Architectural studio' },
  { value: 'product-engineer', label: 'Design engineer' },
  { value: 'creative-director', label: 'Creative director' },
  { value: 'researcher', label: 'Spatial researcher' },
]

export function FormDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES[0].value)
  const [message, setMessage] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const summaryRef = useRef<HTMLDivElement>(null)

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Please provide a name for the log.'
    if (!email.trim()) next.email = 'An email address is required.'
    else if (!EMAIL.test(email))
      next.email = 'Use a valid format like name@strand.space.'
    return next
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      summaryRef.current?.focus()
      return
    }
    setSubmitted(true)
  }

  return (
    <form className={styles.formCard} onSubmit={onSubmit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-label="Form validation error summary"
          className={styles.errorSummary}
        >
          <div className={styles.errorTitle}>Validation alert</div>
          <ul className={styles.errorList}>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {submitted ? (
        <div className={styles.successCard} role="status">
          <div className={styles.successTitle}>Dispatch Received</div>
          <p className={styles.successMsg}>
            Thank you, {name}. Your strand inquiry has been logged on the quiet
            plate.
          </p>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => {
              setSubmitted(false)
              setName('')
              setEmail('')
              setMessage('')
            }}
          >
            Submit Another Query
          </button>
        </div>
      ) : (
        <div className={styles.formFields}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldCol}>
              <label className={styles.fieldLabel} htmlFor="st-name">
                <span>Name</span>
                <span className={styles.fieldHint}>Required</span>
              </label>
              <input
                id="st-name"
                type="text"
                className={cn(styles.input, errors.name && styles.inputInvalid)}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  clearError('name')
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'st-name-error' : undefined}
                placeholder="Aditya Himawan"
                required
              />
              {errors.name && (
                <span id="st-name-error" className={styles.fieldError}>
                  {errors.name}
                </span>
              )}
            </div>

            <div className={styles.fieldCol}>
              <label className={styles.fieldLabel} htmlFor="st-email">
                <span>Email</span>
                <span className={styles.fieldHint}>Required</span>
              </label>
              <input
                id="st-email"
                type="email"
                className={cn(
                  styles.input,
                  errors.email && styles.inputInvalid,
                )}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError('email')
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'st-email-error' : undefined}
                placeholder="aditya@example.space"
                required
              />
              {errors.email && (
                <span id="st-email-error" className={styles.fieldError}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldCol}>
            <label className={styles.fieldLabel} htmlFor="st-role">
              <span>Organization Type</span>
            </label>
            <select
              id="st-role"
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldCol}>
            <label className={styles.fieldLabel} htmlFor="st-msg">
              <span>Observation Notes</span>
              <span className={styles.fieldHint}>Optional</span>
            </label>
            <textarea
              id="st-msg"
              className={styles.textarea}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notes on shoreline conditions, sand geometry, or coastal deployment…"
            />
          </div>

          <div className={styles.checkRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
              />
              <span>
                Receive monthly tide reports and quiet interface notes
              </span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>
              Send Observation
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setName('')
                setEmail('')
                setMessage('')
                setErrors({})
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
