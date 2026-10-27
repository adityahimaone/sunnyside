import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import '@/features/riso/riso-tokens.css'
import { FooterDemo, RisoFormDemo, RisoLockup, ThemeToggle } from '@/features/riso'
import tokens from '@/features/riso/tokens.json'
import styles from '@/features/riso/riso.module.css'

export const metadata: Metadata = {
  title: 'Riso Co. / Atelier Ink — Design System',
  description:
    'A torn poster pinned to studio cork. Riso Co. is an electric vermilion and warm rag vellum identity featuring algorithmic deckle-edge physics, native form states, and documented tokens.',
  alternates: {
    canonical: '/design-system/riso',
    types: { 'text/markdown': '/design-system/riso/llms.txt' },
  },
  openGraph: {
    title: 'Riso Co. / Atelier Ink — Design System',
    description: 'A torn poster pinned to studio cork.',
    url: '/design-system/riso',
    type: 'website',
    images: [
      {
        url: '/brand/riso/riso-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Riso Co. identity board: Vermilion sheet, pushpin, warm vellum, and typography.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riso Co. / Atelier Ink — Design System',
    description: 'A torn poster pinned to studio cork.',
    images: ['/brand/riso/riso-brandkit.png'],
  },
}

type Token = { name: string; value: string; role: string }
const primitives = tokens.primitives as Token[]
const semantic = tokens.semantic.light as Token[]
const contrast = tokens.contrast
const NAV = [
  { id: 'case', label: 'Case' },
  { id: 'material', label: 'Material' },
  { id: 'system', label: 'System' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
  { id: 'specimen', label: 'Specimen' },
]

function SectionHead({
  id,
  number,
  label,
  title,
  lead,
}: {
  id: string
  number: string
  label: string
  title: string
  lead: string
}) {
  return (
    <div className={styles.sectionHead}>
      <div>
        <p className={styles.label}>
          {number} / {label}
        </p>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      <p>{lead}</p>
    </div>
  )
}

export default function RisoPage() {
  return (
    <div className={`${styles.page} rs-scope`} id="top" data-riso-root data-theme="light">
      <a className={styles.skip} href="#main">
        Skip to the case
      </a>

      {/* Navigation */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <RisoLockup />
          <nav className={styles.navLinks} aria-label="Case contents">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <p className={styles.eyebrow}>Case 04 / Brand &amp; interface system</p>
            <h1 id="hero-title">
              A torn poster pinned to <span>studio cork.</span>
            </h1>
            <p className={styles.lead}>
              Riso Co. translates the physical engineering of the risograph print shop to web
              interfaces. Electric vermilion and federal cobalt meet raw 270gsm vellum, anchored by
              a mechanical pushpin and an algorithmic deckle tear.
            </p>
            <div className={styles.actions}>
              <a className={styles.button} href="#specimen">
                See the component <span aria-hidden="true">↘</span>
              </a>
              <a className={styles.quietButton} href="#tokens">
                Read the tokens
              </a>
            </div>
          </div>

          <aside className={styles.heroPlate} aria-label="Riso identity specimen">
            <div className={styles.plateTop}>
              <span>Riso Co. / 04</span>
              <span>Berlin Edition</span>
            </div>
            <svg
              className={styles.plateMark}
              viewBox="0 0 64 64"
              role="img"
              aria-label="The Pin &amp; Deckle mark"
            >
              <path d="M12 18L52 18L52 38L44 34L36 42L28 36L20 44L12 36Z" fill="#ff4a1c" />
              <ellipse cx="28" cy="46" rx="6" ry="2" fill="#1b1712" opacity="0.25" />
              <path d="M31 32L33 32L32.4 46L31.6 46Z" fill="#a3a9b2" />
              <path
                d="M26 14H38V18C38 21 34 23 34 26H30C30 23 26 21 26 18Z"
                fill="#1b1712"
              />
              <ellipse cx="32" cy="14" rx="7" ry="3.5" fill="#1b1712" />
              <ellipse cx="30.5" cy="13" rx="2.5" ry="1" fill="#ffffff" opacity="0.6" />
              <ellipse cx="32" cy="27" rx="5" ry="1.8" fill="#1b1712" />
            </svg>
            <div className={styles.plateMain}>
              <strong>ink. riso co.</strong>
              <span>Workshop edition / run 0412</span>
            </div>
            <div className={styles.plateBottom}>
              <span>Vermilion / Vellum / Steel</span>
              <span>2026</span>
            </div>
          </aside>
        </section>

        {/* Fact strip */}
        <dl className={styles.facts} aria-label="Case facts">
          <div>
            <dt>Material</dt>
            <dd>270gsm Vellum + Soy Ink</dd>
          </div>
          <div>
            <dt>Hardware</dt>
            <dd>Steel Pushpin</dd>
          </div>
          <div>
            <dt>Physics</dt>
            <dd>Mulberry32 Ridge</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Brand &amp; Interface Kit</dd>
          </div>
        </dl>

        {/* Section 01: The Case */}
        <section className={styles.section} id="case" aria-labelledby="case-title">
          <SectionHead
            id="case"
            number="01"
            label="The case"
            title="A puncture and a deckle tear."
            lead="Riso Co. honors the tangible resistance of physical paper: a vibrant sheet torn downwards from a mechanical pushpin, revealing raw unbleached pulp underneath."
          />
          <div className={styles.caseGrid}>
            <article className={styles.quoteCard}>
              <p>The sheet yields to tension. The tear reveals the fiber beneath.</p>
              <div className={styles.quoteFoot}>
                <span>One idea / one mark</span>
                <span>Riso Co. Workshop</span>
              </div>
            </article>
            <dl className={styles.caseFacts}>
              <div>
                <dt>Category</dt>
                <dd>Risograph print editions &amp; bespoke publisher</dd>
              </div>
              <div>
                <dt>Promise</dt>
                <dd>Tactile print engineering without external dependencies</dd>
              </div>
              <div>
                <dt>Audience</dt>
                <dd>Design engineers, publishers, and typographers</dd>
              </div>
              <div>
                <dt>Not this</dt>
                <dd>Generic CMYK dots, digital noise filters, or sterile SaaS cards</dd>
              </div>
              <div>
                <dt>Voice</dt>
                <dd>Tangible, editorial, mechanical, precise</dd>
              </div>
              <div>
                <dt>Mark idea</dt>
                <dd>The Pin &amp; Deckle: Pushpin piercing a serrated paper corner</dd>
              </div>
            </dl>
          </div>

          <div className={styles.principles}>
            {[
              {
                n: '01',
                title: 'The field is vermilion',
                copy: 'A single hyper-saturated poster sheet per view. The remainder is unbleached vellum and carbon soot.',
              },
              {
                n: '02',
                title: 'Math replaces raster assets',
                copy: 'The tear ridge, white fiber rim, and curled flaps are SVG math from Mulberry32 PRNG. Zero heavy bitmap files.',
              },
              {
                n: '03',
                title: 'Hardware anchors the sheet',
                copy: 'The pushpin is a physical focal point. Pulling it lifts the needle, re-seeds the generator, and stabs a fresh tear.',
              },
            ].map((item) => (
              <article className={styles.principle} key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>

          <figure className={styles.board}>
            <Image
              src="/brand/riso/riso-brandkit.png"
              alt="Riso Co. brand board: Vermilion poster, pushpin, warm paper stock, and color specifications."
              width={1500}
              height={1125}
              sizes="(max-width: 850px) 100vw, 1180px"
            />
            <figcaption>Brand board / 1500 × 1125 / vermilion, cobalt, vellum, steel</figcaption>
          </figure>
        </section>

        {/* Section 02: Material */}
        <section className={styles.section} id="material" aria-labelledby="material-title">
          <SectionHead
            id="material"
            number="02"
            label="Material"
            title="The sheet breaks into fibers."
            lead="The torn poster is the core visual metaphor. An electric-dyed stock sheet carries high-frequency interactive chrome, while the torn edge reveals the quiet unbleached paper below."
          />
          <div className={styles.materialGrid}>
            <div className={styles.materialStage}>
              <div className={styles.stageTop}>
                <span>Material study / 01</span>
                <span>Mulberry32 Ridge</span>
              </div>
              <div className={styles.stageType}>
                Electric vermilion
                <span>Pulp paper revealed underneath</span>
              </div>
              <div className={styles.stageBottom}>
                <span>Dyed sheet above</span>
                <span>Deckle rim boundary below</span>
              </div>
            </div>

            <ol className={styles.recipe}>
              <li>
                <strong>01 / Sheet &amp; Chrome</strong>
                <code>#ff4a1c or #1a7ff0</code>
                <p>
                  Carries back-to-top, newsletter pill, availability beacon, live city clock, and
                  link columns.
                </p>
              </li>
              <li>
                <strong>02 / Seedable Mulberry32 PRNG</strong>
                <code>84 ridge coordinates + 6 curling flaps</code>
                <p>
                  Deterministic mathematical ridge ensures identical tear morphology across SSR and
                  client rehydration.
                </p>
              </li>
              <li>
                <strong>03 / Exposed White Deckle Rim</strong>
                <code>lifted by off-pixels per point</code>
                <p>
                  Emulates the natural unbleached cellulose fibers exposed when heavy rag stock is
                  hand-torn.
                </p>
              </li>
              <li>
                <strong>04 / Mechanical Pushpin Interaction</strong>
                <code>idle → lift → stab state machine</code>
                <p>
                  Interactive trigger re-pins a fresh seed and recalculates flap lift with cubic
                  bezier overshoot.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* Section 03: System Proof */}
        <section className={styles.section} id="system" aria-labelledby="system-title">
          <SectionHead
            id="system"
            number="03"
            label="System proof"
            title="Form kit with complete states."
            lead="Interface inputs use semantic, accessible native controls. Test empty submission to inspect error summaries, tab for focus outlines, and review disabled states."
          />
          <div className={styles.proofLayout}>
            <div className={styles.formPanel}>
              <div className={styles.formPanelHead}>
                <div>
                  <p className={styles.label}>Form specimen / 01</p>
                  <h3>Register an edition</h3>
                </div>
                <span className={styles.formTag}>Print run draft</span>
              </div>
              <p className={styles.formLead}>
                Inputs maintain legible labels, high-contrast borders, explicit error linking with
                aria-describedby, and vermilion focus rings.
              </p>
              <RisoFormDemo />
            </div>

            <aside className={styles.aside}>
              <div>
                <p className={styles.label}>Anatomy</p>
                <h3>Label → Input → Error recovery</h3>
                <p>
                  Controls feature high-contrast carbon borders and accessible error banners. Focus
                  is verified with an explicit 2px outline.
                </p>
              </div>
              <div>
                <p className={styles.label}>State set</p>
                <div className={styles.states}>
                  <span>Default</span>
                  <span className={styles.stateFocus}>Focus</span>
                  <span className={styles.stateInvalid}>Invalid</span>
                  <span className={styles.stateDisabled}>Disabled</span>
                  <span>Success</span>
                </div>
                <p>
                  Error states do not rely on color alone; descriptive contextual text accompanies
                  all invalid inputs.
                </p>
              </div>
              <div>
                <p className={styles.label}>Component link</p>
                <h3>Pushpin tear footer</h3>
                <p>
                  The interactive footer component is demonstrated below as a standalone specimen.
                  It runs independently without global side-effects.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Section 04: Tokens */}
        <section className={styles.section} id="tokens" aria-labelledby="tokens-title">
          <SectionHead
            id="tokens"
            number="04"
            label="Tokens"
            title="Three tiers, single source of truth."
            lead="The design system reads `features/riso/tokens.json`. CSS custom properties and JSON specifications are synchronized without drift."
          />
          <div className={styles.tokenGrid}>
            <article className={styles.tokenCard}>
              <header>
                <span className={styles.label}>01 / Primitives</span>
                <span className={styles.tokenCount}>{primitives.length} values</span>
              </header>
              <h3>Materials &amp; Dyes</h3>
              <p>Raw values representing physical inks, metals, and vellum stock.</p>
              <div className={styles.swatches}>
                {primitives.map((token) => (
                  <div className={styles.swatch} key={token.name}>
                    <i style={{ background: token.value }} aria-hidden="true" />
                    <span>{token.name}</span>
                    <code>{token.value}</code>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.tokenCard}>
              <header>
                <span className={styles.label}>02 / Semantic</span>
                <span className={styles.tokenCount}>{semantic.length} roles</span>
              </header>
              <h3>Contextual Roles</h3>
              <p>Stable names for surfaces, text, fields, and focus boundaries.</p>
              <div className={styles.swatches}>
                {semantic.slice(0, 9).map((token) => (
                  <div className={styles.swatch} key={token.name}>
                    <i style={{ background: `var(--rs-${token.name})` }} aria-hidden="true" />
                    <span>{token.name}</span>
                    <code>{token.value}</code>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.tokenCard}>
              <header>
                <span className={styles.label}>03 / Component</span>
                <span className={styles.tokenCount}>Physical specs</span>
              </header>
              <h3>Hardware decisions</h3>
              <p>Geometry definitions for buttons, fields, and pushpin chrome.</p>
              <div className={styles.swatches}>
                <div className={styles.swatch}>
                  <i style={{ background: 'var(--rs-button-bg)' }} aria-hidden="true" />
                  <span>button</span>
                  <code>48px touch target</code>
                </div>
                <div className={styles.swatch}>
                  <i style={{ background: 'var(--rs-field-bg)' }} aria-hidden="true" />
                  <span>field</span>
                  <code>44px input height</code>
                </div>
                <div className={styles.swatch}>
                  <i style={{ background: 'var(--rs-border-focus)' }} aria-hidden="true" />
                  <span>focus outline</span>
                  <code>2px offset solid</code>
                </div>
              </div>
            </article>
          </div>

          <div className={styles.tokenTableWrap}>
            <table className={styles.tokenTable}>
              <caption className={styles.srOnly}>
                Riso Co. measured contrast pairings and intended usage
              </caption>
              <thead>
                <tr>
                  <th scope="col">Pairing</th>
                  <th scope="col">Contrast Ratio</th>
                  <th scope="col">WCAG Rating &amp; Purpose</th>
                </tr>
              </thead>
              <tbody>
                {contrast.map((pair) => (
                  <tr key={pair.label}>
                    <th scope="row">{pair.label}</th>
                    <td>
                      <strong>{pair.ratio.toFixed(1)}:1</strong>
                    </td>
                    <td>{pair.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.downloads}>
            <a href="/brand/riso/riso-tokens.css" download>
              Download Tokens CSS ↓
            </a>
            <a href="/brand/riso/riso-tokens.json" download>
              Download Tokens JSON ↓
            </a>
            <a href="/brand/riso/riso-brandkit.png" download>
              Download Brand Board PNG ↓
            </a>
            <a href="/brand/riso/mark.svg" download>
              Download SVG Mark ↓
            </a>
          </div>
        </section>

        {/* Section 05: Audit */}
        <section className={styles.section} id="audit" aria-labelledby="audit-title">
          <SectionHead
            id="audit"
            number="05"
            label="Audit"
            title="Shipped assets and explicit boundaries."
            lead="An honest design system states what has been built and what remains outside scope."
          />
          <div className={styles.auditGrid}>
            <article className={styles.auditCard}>
              <p className={styles.label}>Shipped / File paths</p>
              <h3>Case Deliverables</h3>
              <ul>
                <li>Brief and decision log: `design/brand/riso/`.</li>
                <li>Token specifications: `features/riso/tokens.json`.</li>
                <li>Public vectors and tokens: `public/brand/riso/`.</li>
                <li>Component in UI library: `components/ui/pushpin-tear-footer.tsx`.</li>
                <li>Standalone demo: `components/ui/demo.tsx`.</li>
                <li>Full interactive case route: `/design-system/riso`.</li>
                <li>Agent twin: `/design-system/riso/llms.txt`.</li>
              </ul>
            </article>

            <article className={styles.auditCard}>
              <p className={styles.label}>Verified / Explicit gaps</p>
              <h3>Check Boundaries</h3>
              <ul>
                <li>WCAG AA compliance verified across all copy and control pairings.</li>
                <li>Reduced motion (`prefers-reduced-motion`) verified for zero lag.</li>
                <li>Tested down to 390px mobile viewport width without layout blowout.</li>
                <li>Mulberry32 PRNG verified for deterministic rehydration.</li>
                <li>Automated browser regression CI is left to the host application suite.</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Section 06: Component Specimen */}
        <section className={styles.section} id="specimen" aria-labelledby="specimen-title">
          <SectionHead
            id="specimen"
            number="06"
            label="Component specimen"
            title="Interactive Pushpin Tear Footer."
            lead="Toggle between Vermilion and Cobalt editions, re-pin a new deckle tear edge, test email subscription, and copy address to clipboard."
          />
          <div className={styles.footerDemo}>
            <FooterDemo />
          </div>
        </section>
      </main>

      {/* Case Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <RisoLockup size={28} />
          <p>A torn poster pinned to studio cork. Handcrafted in Berlin &amp; shipped 2026.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/design-system">Case Library</Link>
          <Link href="/design-engineering">Design Engineering</Link>
          <a href="/design-system/riso/llms.txt">Markdown Twin</a>
          <a href="/brand/riso/README.md">Brand Guide</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}
