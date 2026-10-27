'use client'

import * as React from 'react'

import styles from '../riso.module.css'

type Errors = Partial<Record<'studio' | 'email' | 'quantity' | 'notes', string>>

/**
 * The form kit, in the shop's own words: a print run request. Native elements
 * only — no custom select, no custom checkbox — because a form that cannot be
 * completed with a keyboard and a screen reader is not a form.
 */
export function RisoFormDemo() {
  const [studio, setStudio] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [edition, setEdition] = React.useState('poster')
  const [quantity, setQuantity] = React.useState('100')
  const [notes, setNotes] = React.useState('')
  const [proof, setProof] = React.useState(true)
  const [errors, setErrors] = React.useState<Errors>({})
  const [sent, setSent] = React.useState(false)
  const [filed, setFiled] = React.useState(false)

  const summary = React.useRef<HTMLDivElement>(null)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: Errors = {}

    if (!studio.trim()) next.studio = 'Enter the studio or client name we invoice.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter an address we can reply to.'
    }
    const qty = Number(quantity)
    if (!Number.isFinite(qty) || qty < 25 || qty > 500) {
      next.quantity = 'Runs go from 25 to 500 sheets. Round to the nearest 25.'
    }
    if (notes.trim().length > 0 && notes.trim().length < 10) {
      next.notes = 'Add a little more, or leave the note empty.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      setFiled(false)
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    setFiled(true)
    setSent(true)
  }

  if (sent) {
    return (
      <div className={styles.formDone} role="status">
        <p className={styles.label}>Run {String(412 + Number(quantity)).padStart(4, '0')} / filed</p>
        <h4>We have the request.</h4>
        <p>
          A proof goes out within two working days. If the stock is out, we will say so in the same
          email rather than after the run.
        </p>
        <button
          type="button"
          className={styles.quietButton}
          onClick={() => {
            setSent(false)
            setFiled(false)
          }}
        >
          File another
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div className={styles.formError} role="alert" tabIndex={-1} ref={summary}>
          <strong>Three things to fix before this goes to press.</strong>
          <ul>
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>
                <a href={`#riso-${key}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="riso-studio">Studio</label>
          <input
            id="riso-studio"
            name="studio"
            type="text"
            autoComplete="organization"
            value={studio}
            onChange={(event) => setStudio(event.target.value)}
            aria-invalid={Boolean(errors.studio)}
            aria-describedby={errors.studio ? 'riso-studio-error' : undefined}
            placeholder="Atelier Nord"
          />
          {errors.studio && (
            <p className={styles.fieldError} id="riso-studio-error">
              {errors.studio}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="riso-email">Email</label>
          <input
            id="riso-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'riso-email-error' : undefined}
            placeholder="press@studio.example"
          />
          {errors.email && (
            <p className={styles.fieldError} id="riso-email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="riso-edition">Edition</label>
          <select
            id="riso-edition"
            name="edition"
            value={edition}
            onChange={(event) => setEdition(event.target.value)}
          >
            <option value="poster">Poster / A2, two passes</option>
            <option value="zine">Zine / 32pp, saddle stitch</option>
            <option value="booklet">Booklet / 16pp, two inks</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="riso-quantity">Sheets</label>
          <input
            id="riso-quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            min={25}
            max={500}
            step={25}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? 'riso-quantity-error' : 'riso-quantity-hint'}
          />
          <p className={styles.fieldHint} id="riso-quantity-hint">
            Steps of 25. Above 500 we split the run.
          </p>
          {errors.quantity && (
            <p className={styles.fieldError} id="riso-quantity-error">
              {errors.quantity}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="riso-notes">
          Note <span className={styles.optional}>optional</span>
        </label>
        <textarea
          id="riso-notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? 'riso-notes-error' : undefined}
          placeholder="Two inks, 45° screen, trim to A2."
        />
        {errors.notes && (
          <p className={styles.fieldError} id="riso-notes-error">
            {errors.notes}
          </p>
        )}
      </div>

      <div className={styles.check}>
        <input
          id="riso-proof"
          name="proof"
          type="checkbox"
          checked={proof}
          onChange={(event) => setProof(event.target.checked)}
        />
        <label htmlFor="riso-proof">
          Send a press proof before the full run
          <span>One sheet, both drums, posted. Costs the postage.</span>
        </label>
      </div>

      <div className={styles.formFoot}>
        <button type="submit" className={styles.button}>
          Send the request
        </button>
        <p className={styles.finePrint}>
          We reply within two working days. {filed ? 'Filed.' : ''}
        </p>
      </div>
    </form>
  )
}
