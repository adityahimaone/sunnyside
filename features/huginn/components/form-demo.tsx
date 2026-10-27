'use client'

import { useRef, useState, type FormEvent } from 'react'

export function HuginnFormDemo() {
  const [errors, setErrors] = useState<string[]>([])
  const [sent, setSent] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: string[] = []
    if (!String(data.get('name') ?? '').trim()) next.push('name')
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email') ?? '')))
      next.push('email')
    setErrors(next)
    setSent(next.length === 0)
    if (next.length) requestAnimationFrame(() => summaryRef.current?.focus())
  }

  const errorId = (field: string) =>
    errors.includes(field) ? `${field}-error` : undefined

  return (
    <form className="hg-form" onSubmit={submit} noValidate>
      {errors.length ? (
        <div
          className="hg-error-summary"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
        >
          <strong>Two details need another look.</strong>
          <ul>
            {errors.map((field) => (
              <li key={field}>
                <a href={`#${field}`}>
                  {field === 'name'
                    ? 'Add your name.'
                    : 'Enter a valid email address.'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {sent ? (
        <p className="hg-success" role="status">
          Thanks. Your note is ready for the studio.
        </p>
      ) : null}
      <div className="hg-form-grid">
        <div className="hg-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            aria-invalid={errors.includes('name')}
            aria-describedby={errorId('name')}
            onChange={() =>
              setErrors((items) => items.filter((item) => item !== 'name'))
            }
          />
          {errors.includes('name') ? (
            <span className="hg-error" id="name-error">
              Add your name so we know how to reply.
            </span>
          ) : (
            <span className="hg-hint">The name you use in the studio.</span>
          )}
        </div>
        <div className="hg-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.includes('email')}
            aria-describedby={errorId('email')}
            onChange={() =>
              setErrors((items) => items.filter((item) => item !== 'email'))
            }
          />
          {errors.includes('email') ? (
            <span className="hg-error" id="email-error">
              Use an address like name@example.com.
            </span>
          ) : (
            <span className="hg-hint">Used only to answer this note.</span>
          )}
        </div>
        <div className="hg-field">
          <label htmlFor="topic">What are you making?</label>
          <select id="topic" name="topic" defaultValue="identity">
            <option value="identity">An identity</option>
            <option value="interface">An interface</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div className="hg-field">
          <label htmlFor="note">A short note</label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="The idea you're trying to keep."
          />
        </div>
        <fieldset className="hg-fieldset">
          <legend>How did you find the studio?</legend>
          <label>
            <input type="radio" name="source" value="print" defaultChecked />{' '}
            Printed matter
          </label>
          <label>
            <input type="radio" name="source" value="friend" /> A person
          </label>
          <label>
            <input type="radio" name="source" value="web" /> The web
          </label>
        </fieldset>
        <label className="hg-check">
          <input type="checkbox" name="reply" defaultChecked /> A reply is
          welcome
        </label>
        <label className="hg-switch-row" htmlFor="quiet-mode">
          <span>
            <strong>Quiet correspondence</strong>
            <small>One note, no mailing list.</small>
          </span>
          <input
            id="quiet-mode"
            name="quiet-mode"
            type="checkbox"
            role="switch"
            aria-label="Quiet correspondence"
            defaultChecked
          />
        </label>
        <div className="hg-field hg-disabled">
          <label htmlFor="reference">Reference image</label>
          <input
            id="reference"
            name="reference"
            type="file"
            disabled
            aria-describedby="reference-hint"
          />
          <span className="hg-hint" id="reference-hint">
            Disabled in this local specimen; the label and state remain visible.
          </span>
        </div>
      </div>
      <div className="hg-form-actions">
        <button className="hg-button" type="submit">
          Send a note <span aria-hidden="true">↗</span>
        </button>
        <button
          className="hg-button hg-button-quiet"
          type="reset"
          onClick={() => {
            setErrors([])
            setSent(false)
          }}
        >
          Reset
        </button>
      </div>
    </form>
  )
}
