import type { Metadata } from 'next'
import Image from 'next/image'

/**
 * Single-page brand case scaffold. For a design-system specimen, use templates/design-system.html.
 *
 * Copy this into app/design-system/<slug>/page.tsx, replace SLUG and the token
 * block, and adapt the sections to the brief. It is a server component; for an
 * interactive form, extract the form into a small "use client" island and use
 * the project's shadcn/Radix primitives.
 *
 * The inline CSS keeps the template one file. In a real project, move it to a
 * CSS module (or Tailwind utilities) and read the tokens from one source.
 */

const SLUG = '<slug>'

export const metadata: Metadata = {
  title: 'Brand — Case',
  description:
    'A brand kit and design system: the idea, the mark, the tokens, the forms and the audit.',
  alternates: { canonical: `/design-system/${SLUG}` },
}

const TOKENS = [
  ['--paper', '#f3ecdf', 'Page ground'],
  ['--ink', '#191a2e', 'Text and edges'],
  ['--accent', '#3d53d6', 'One loud field'],
  ['--accent-ink', '#fffaf1', 'Text on accent'],
  ['--focus', '#ffd23f', 'Focus ring'],
] as const

export default function CasePage() {
  return (
    <div className="vt-page" id="top">
      <a className="vt-skip" href="#case">
        Skip to the case
      </a>

      <header className="vt-nav">
        <a className="vt-brand" href="#top" aria-label="Brand, back to top">
          <Image
            src={`/brand/${SLUG}/mark.svg`}
            alt=""
            width={34}
            height={34}
          />
          <span>Brand</span>
        </a>
        <nav aria-label="Case contents">
          <a href="#case">Case</a>
          <a href="#forms">Forms</a>
          <a href="#tokens">Tokens</a>
          <a href="#audit">Audit</a>
        </nav>
      </header>

      <main>
        {/* hero: B · relation beside · photograph runs off the right edge · no eyebrow, no chips */}
        <section className="vt-hero" aria-labelledby="hero-title">
          <div className="vt-hero__copy">
            <h1 id="hero-title">One idea, drawn once.</h1>
            <p className="vt-lead">
              Replace this with the promise in the audience&apos;s words. One
              sentence, 44 characters a line; the page is the proof, not the
              pitch.
            </p>
            <div className="vt-actions">
              <a className="vt-button" href="#forms">
                Try the controls
              </a>
              <a className="vt-more" href="#tokens">
                Read the tokens
              </a>
            </div>
            <dl className="vt-facts">
              <div>
                <dt>Material</dt>
                <dd>Paper and ink</dd>
              </div>
              <div>
                <dt>Mark</dt>
                <dd>64-unit grid</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Daylight only</dd>
              </div>
              <div>
                <dt>Contrast</dt>
                <dd>11 of 14 pass</dd>
              </div>
            </dl>
          </div>
          <figure className="vt-plate">
            <Image
              src={`/brand/${SLUG}/${SLUG}-hero.webp`}
              alt="The brand's own photograph, described plainly"
              width={1672}
              height={941}
            />
            <figcaption>Plate 01 · the handoff</figcaption>
          </figure>
        </section>

        <section className="vt-section" id="case" aria-labelledby="case-title">
          <div className="vt-head">
            <h2 id="case-title">The case</h2>
            <p>One material, one loud field, one idea.</p>
          </div>
          <div className="vt-grid three">
            <article>
              <h3>01 / The idea</h3>
              <p>What the mark means in one sentence, without naming the visual.</p>
            </article>
            <article>
              <h3>02 / The rules</h3>
              <p>Colour by role, type by voice, one loud field at a time.</p>
            </article>
            <article>
              <h3>03 / The proof</h3>
              <p>
                The page, the form, the 16px favicon. A system that cannot ship
                is a moodboard.
              </p>
            </article>
          </div>
        </section>

        <section
          className="vt-section"
          id="forms"
          aria-labelledby="forms-title"
        >
          <div className="vt-head">
            <h2 id="forms-title">Forms</h2>
            <p>
              Labels, hints, errors, focus and disabled. One real form proves the
              system more than twenty cards.
            </p>
          </div>
          <form className="vt-form" action="#" method="post">
            <div className="vt-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </div>
            <div className="vt-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                required
              />
            </div>
            <div className="vt-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="design-engineer">
                <option value="design-engineer">Design engineer</option>
                <option value="product-designer">Product designer</option>
                <option value="frontend-engineer">Frontend engineer</option>
              </select>
            </div>
            <div className="vt-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="What are you building?"
              />
            </div>
            <fieldset className="vt-fieldset">
              <legend>Team size</legend>
              <label>
                <input type="radio" name="team" value="1-5" defaultChecked />
                1–5
              </label>
              <label>
                <input type="radio" name="team" value="6-20" />6–20
              </label>
              <label>
                <input type="radio" name="team" value="21+" />21+
              </label>
            </fieldset>
            <label className="vt-check">
              <input type="checkbox" name="updates" defaultChecked />
              Send the field notes
            </label>
            <div className="vt-field">
              <label htmlFor="intensity">Dither intensity</label>
              <input
                id="intensity"
                name="intensity"
                type="range"
                min={0}
                max={100}
                defaultValue={64}
              />
            </div>
            <div className="vt-field">
              <label htmlFor="file">Reference</label>
              <input id="file" name="file" type="file" />
            </div>
            <div className="vt-actions">
              <button className="vt-button" type="submit">
                Send request
              </button>
              <button className="vt-button vt-secondary" type="reset">
                Reset
              </button>
            </div>
          </form>
        </section>

        <section
          className="vt-section"
          id="tokens"
          aria-labelledby="tokens-title"
        >
          <div className="vt-head">
            <h2 id="tokens-title">Tokens</h2>
            <p>Primitive → semantic → component. One source; no raw hex in components.</p>
          </div>
          <table className="vt-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Value</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.map(([token, value, role]) => (
                <tr key={token}>
                  <th scope="row">
                    <code>{token}</code>
                  </th>
                  <td>
                    <code>{value}</code>
                  </td>
                  <td>{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="vt-section" id="audit" aria-labelledby="audit-title">
          <div className="vt-head">
            <h2 id="audit-title">Audit</h2>
            <p>
              Resources, contract, engine check and named gaps. A case without
              gaps is a brochure.
            </p>
          </div>
          <ul className="vt-list">
            <li>16/16 resources present; 10 used, 4 substituted, 2 not used.</li>
            <li>12/12 output-contract items shipped.</li>
            <li>One effect, one live shader; reduced motion holds a still frame.</li>
            <li>Gap: no visual regression CI; add one before the next release.</li>
          </ul>
        </section>
      </main>

      {/* footer: F5 · plate and receipt · the plate uses a DIFFERENT asset from the hero */}
      <footer className="vt-footer">
        <figure className="vt-footer__plate">
          <Image
            src={`/brand/${SLUG}/${SLUG}-closing.webp`}
            alt="The closing photograph, described plainly"
            width={1672}
            height={941}
          />
          <figcaption>Plate 02 · the closing cut</figcaption>
        </figure>
        <div className="vt-footer__in">
          <div className="vt-footer__id">
            <Image
              src={`/brand/${SLUG}/lockup.svg`}
              alt="Brand lockup"
              width={187}
              height={40}
            />
            <p className="vt-footer__say">
              One idea, drawn once and kept.
            </p>
          </div>
          <dl className="vt-footer__rec">
            <div>
              <dt>Built</dt>
              <dd>2026</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>Paper and ink</dd>
            </div>
            <div>
              <dt>Licence</dt>
              <dd>All rights reserved</dd>
            </div>
          </dl>
          <p className="vt-footer__back">
            <a href="/design-system">Back to the shelf</a>
          </p>
        </div>
      </footer>

      <style>{`
        .vt-page {
          --paper: #f3ecdf;
          --paper-hi: #fffaf1;
          --ink: #191a2e;
          --muted: #5f5b6e;
          --line: rgb(25 26 46 / 0.16);
          --accent: #3d53d6;
          --accent-ink: #fffaf1;
          --focus: #ffd23f;
          --display: 'Your Display', ui-sans-serif, system-ui, sans-serif;
          --reading: 'Your Reading', ui-sans-serif, system-ui, sans-serif;
          --mono: ui-monospace, 'SFMono-Regular', monospace;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--reading);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .vt-page * { box-sizing: border-box; }
        .vt-page a { color: inherit; }
        .vt-page :focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }
        .vt-page main, .vt-nav, .vt-footer { width: min(1120px, 100% - 2rem); margin-inline: auto; }
        .vt-skip { position: absolute; top: -80px; left: 1rem; z-index: 10; padding: .6rem .8rem; background: var(--focus); color: var(--ink); }
        .vt-skip:focus { top: 1rem; }
        .vt-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block: 1.1rem; }
        .vt-brand { display: flex; align-items: center; gap: .7rem; text-decoration: none; font-family: var(--display); font-weight: 700; letter-spacing: -.03em; }
        .vt-nav nav { display: flex; gap: 1.4rem; font-size: .9rem; }
        .vt-nav nav a { color: var(--muted); text-decoration: none; }
        .vt-nav nav a:hover { color: var(--ink); }
        .vt-hero { display: grid; gap: 2rem; padding-block: clamp(3rem, 8vw, 7rem); }
        @media (min-width: 900px) { .vt-hero { grid-template-columns: 1.1fr .9fr; align-items: center; } }
        .vt-page h1 { margin: 0; font-family: var(--display); font-size: clamp(2.4rem, 4.6vw, 4.25rem); line-height: .96; letter-spacing: -.032em; max-width: 18ch; color: var(--ink); }
        .vt-lead { max-width: 44ch; margin: 1rem 0 0; color: var(--ink); font-size: 1.03rem; line-height: 1.56; }
        .vt-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1.2rem; margin-top: 1.5rem; }
        .vt-button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 1.1rem; border: 0; border-radius: 0; background: var(--accent); color: var(--accent-ink); font-family: var(--body, var(--display)); font-size: .92rem; font-weight: 600; text-decoration: none; cursor: pointer; }
        .vt-button:hover { background: var(--accent-deep, var(--accent)); }
        .vt-secondary { background: var(--paper-hi); color: var(--ink); }
        .vt-secondary:hover { background: var(--paper); }
        .vt-more { font-size: .92rem; font-weight: 600; color: var(--ink); text-decoration: none; }
        .vt-more::after { content: ' →'; }
        .vt-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.75rem; margin: clamp(.6rem, 2.2vh, 1.9rem) 0 0; padding: 0; }
        .vt-facts dt { font-size: .8rem; color: color-mix(in srgb, var(--ink) 62%, transparent); }
        .vt-facts dd { margin: .15rem 0 0; font-size: .94rem; font-weight: 600; font-variant-numeric: tabular-nums; }
        .vt-plate { position: relative; margin: 0; overflow: hidden; }
        .vt-plate img { display: block; width: 100%; height: 100%; min-height: 320px; object-fit: cover; object-position: center top; }
        .vt-plate figcaption { position: absolute; left: 1.2rem; bottom: 1.1rem; color: var(--paper-hi); font-size: .8rem; text-shadow: 0 1px 2px rgb(0 0 0 / .55), 0 2px 18px rgb(0 0 0 / .35); }
        .vt-footer { margin-top: clamp(4rem, 8vw, 7rem); }
        .vt-footer__plate { position: relative; margin: 0; overflow: hidden; }
        .vt-footer__plate img { display: block; width: 100%; height: clamp(14rem, 25vw, 22rem); object-fit: cover; object-position: 34% 50%; }
        .vt-footer__plate figcaption { position: absolute; left: 1.2rem; bottom: 1.1rem; padding: .3rem .55rem; background: var(--paper); color: var(--ink); font-size: .78rem; }
        .vt-footer__in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) auto; gap: 1.75rem; padding-block: 2.1rem 1.9rem; }
        .vt-footer__id img { display: block; width: auto; height: 22px; }
        .vt-footer__say { margin: .9rem 0 0; max-width: 22ch; font-family: var(--display); font-size: clamp(1.4rem, 2.2vw, 1.9rem); line-height: 1.1; letter-spacing: -.02em; color: var(--ink); }
        .vt-footer__rec { margin: 0; padding-left: 1.75rem; border-left: 1px solid color-mix(in srgb, var(--ink) 26%, transparent); }
        .vt-footer__rec div + div { margin-top: .7rem; }
        .vt-footer__rec dt { font-size: .8rem; color: color-mix(in srgb, var(--ink) 62%, transparent); }
        .vt-footer__rec dd { margin: .1rem 0 0; font-size: .9rem; font-weight: 600; }
        .vt-footer__back { margin: 0; align-self: start; font-size: .88rem; font-weight: 600; }
        .vt-footer__back a { color: var(--ink); text-decoration: none; }
        .vt-footer__back a::after { content: ' ↗'; }
        @media (max-width: 900px) {
          .vt-hero { grid-template-columns: 1fr; }
          .vt-plate { order: 2; }
          .vt-plate img { min-height: 0; height: clamp(15rem, 52vw, 24rem); }
          .vt-footer__in { grid-template-columns: 1fr; gap: 1.4rem; }
          .vt-footer__rec { padding-left: 0; border-left: 0; }
        }
        .vt-fieldset input, .vt-check input { width: 18px; height: 18px; accent-color: var(--accent); }
        .vt-table { width: 100%; border-collapse: collapse; font-size: .8rem; }
        .vt-table th, .vt-table td { padding: .6rem .7rem; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
        .vt-table thead th { font-family: var(--mono); font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
        .vt-table code { font-family: var(--mono); font-size: .72rem; }
        .vt-list { margin: 0; padding-left: 1.2rem; color: var(--muted); font-size: .9rem; line-height: 1.6; }
        .vt-footer { padding-block: 2rem; border-top: 1.5px solid var(--ink); font-family: var(--mono); font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
      `}</style>
    </div>
  )
}
