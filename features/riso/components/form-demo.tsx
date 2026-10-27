'use client'

import * as React from 'react'

export function RisoFormDemo() {
  const [email, setEmail] = React.useState('')
  const [format, setFormat] = React.useState('poster')
  const [notes, setNotes] = React.useState('')
  const [paperWeight, setPaperWeight] = React.useState('270gsm')
  const [proofRequested, setProofRequested] = React.useState(true)
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid studio or client email address.'
    }
    if (!notes || notes.trim().length < 5) {
      nextErrors.notes = 'Please include details on ink colors or edition quantities.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
    } else {
      setErrors({})
      setStatus('success')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {status === 'error' && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fff0ee',
            border: '1.5px solid #d72c0d',
            color: '#d72c0d',
            padding: '0.875rem 1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <strong>Print run request incomplete:</strong> Please resolve the highlighted fields below.
        </div>
      )}

      {status === 'success' && (
        <div
          role="status"
          style={{
            backgroundColor: '#edf9f0',
            border: '1.5px solid #108043',
            color: '#108043',
            padding: '0.875rem 1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <strong>Edition registered:</strong> Your print order draft has been logged on the press run.
        </div>
      )}

      {/* Field 1: Email */}
      <div>
        <label
          htmlFor="riso-email"
          style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}
        >
          Studio Contact Email <span style={{ color: 'var(--rs-sheet-vermilion)' }}>*</span>
        </label>
        <input
          id="riso-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="press@yourstudio.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'riso-email-err' : undefined}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 0.875rem',
            fontSize: '0.9375rem',
            borderRadius: '4px',
            border: `1.5px solid ${errors.email ? '#d72c0d' : 'var(--rs-field-border)'}`,
            backgroundColor: 'var(--rs-field-bg)',
            color: 'var(--rs-text)',
            outlineOffset: '2px',
          }}
        />
        {errors.email && (
          <p id="riso-email-err" style={{ color: '#d72c0d', fontSize: '0.8125rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Field 2: Format & Paper Weight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label
            htmlFor="riso-format"
            style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}
          >
            Edition Format
          </label>
          <select
            id="riso-format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 0.875rem',
              fontSize: '0.9375rem',
              borderRadius: '4px',
              border: '1.5px solid var(--rs-field-border)',
              backgroundColor: 'var(--rs-field-bg)',
              color: 'var(--rs-text)',
            }}
          >
            <option value="poster">Broadside Poster (A2)</option>
            <option value="zine">Saddle-stitched Zine (A5)</option>
            <option value="cards">Tactile Art Cards (A6)</option>
            <option value="custom">Custom Die-cut &amp; Deckle</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="riso-paper"
            style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}
          >
            Vellum Stock
          </label>
          <select
            id="riso-paper"
            value={paperWeight}
            onChange={(e) => setPaperWeight(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 0.875rem',
              fontSize: '0.9375rem',
              borderRadius: '4px',
              border: '1.5px solid var(--rs-field-border)',
              backgroundColor: 'var(--rs-field-bg)',
              color: 'var(--rs-text)',
            }}
          >
            <option value="270gsm">270gsm Warm Rag Vellum</option>
            <option value="175gsm">175gsm Recycled Pulp</option>
            <option value="90gsm">90gsm Newsprint Laid</option>
          </select>
        </div>
      </div>

      {/* Field 3: Notes */}
      <div>
        <label
          htmlFor="riso-notes"
          style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}
        >
          Ink Drum Colors &amp; Run Notes <span style={{ color: 'var(--rs-sheet-vermilion)' }}>*</span>
        </label>
        <textarea
          id="riso-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. 2-color pass: Electric Vermilion + Iron Carbon, deckle edge tear at bottom."
          aria-invalid={!!errors.notes}
          aria-describedby={errors.notes ? 'riso-notes-err' : undefined}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            borderRadius: '4px',
            border: `1.5px solid ${errors.notes ? '#d72c0d' : 'var(--rs-field-border)'}`,
            backgroundColor: 'var(--rs-field-bg)',
            color: 'var(--rs-text)',
            fontFamily: 'inherit',
          }}
        />
        {errors.notes && (
          <p id="riso-notes-err" style={{ color: '#d72c0d', fontSize: '0.8125rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>
            {errors.notes}
          </p>
        )}
      </div>

      {/* Checkbox: Physical Proof */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.875rem' }}>
        <input
          type="checkbox"
          checked={proofRequested}
          onChange={(e) => setProofRequested(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--rs-sheet-vermilion)' }}
        />
        <span>Dispatch 1:1 physical deckle press proof before edition run</span>
      </label>

      {/* Disabled field showcase */}
      <div>
        <label
          htmlFor="riso-specimen"
          style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--rs-text-subtle)', marginBottom: '0.35rem' }}
        >
          Archival Edition Certificate (Disabled in demo)
        </label>
        <input
          id="riso-specimen"
          disabled
          value="RUN-0412-SEALED-2026"
          style={{
            width: '100%',
            height: '40px',
            padding: '0 0.875rem',
            fontSize: '0.875rem',
            borderRadius: '4px',
            border: '1px dashed var(--rs-border)',
            backgroundColor: 'var(--rs-surface)',
            color: 'var(--rs-text-subtle)',
            cursor: 'not-allowed',
          }}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        style={{
          height: '48px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--rs-button-bg)',
          color: 'var(--rs-button-fg)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.02em',
        }}
      >
        Submit Edition Request ↘
      </button>
    </form>
  )
}
