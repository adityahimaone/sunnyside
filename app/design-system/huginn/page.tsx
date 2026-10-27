import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import '@/features/huginn/huginn-tokens.css'
import {
  FooterDemo,
  HuginnFormDemo,
  HuginnLockup,
  ThemeToggle,
} from '@/features/huginn'
import tokens from '@/features/huginn/tokens.json'
import styles from '@/features/huginn/huginn.module.css'

export const metadata: Metadata = {
  title: 'Huginn Studio — Design System',
  description:
    'A thought crosses the threshold and returns in print. Huginn Studio is a vermilion-and-bone identity with an ordered-dither component proof, native form states and documented tokens.',
  alternates: {
    canonical: '/design-system/huginn',
    types: { 'text/markdown': '/design-system/huginn/llms.txt' },
  },
  openGraph: {
    title: 'Huginn Studio — Design System',
    description: 'A thought crosses the threshold and returns in print.',
    url: '/design-system/huginn',
    type: 'website',
    images: [
      {
        url: '/brand/huginn/huginn-brandkit.png',
        width: 1200,
        height: 900,
        alt: 'Huginn Studio identity board in bone, ink and vermilion.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huginn Studio — Design System',
    description: 'A thought crosses the threshold and returns in print.',
    images: ['/brand/huginn/cover.svg'],
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

export default function HuginnPage() {
  return (
    <div
      className={`${styles.page} hg-scope`}
      id="top"
      data-huginn-root
      data-theme="light"
    >
      <a className={styles.skip} href="#main">
        Skip to the case
      </a>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <HuginnLockup />
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
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <p className={styles.eyebrow}>
              Case 03 / Brand &amp; interface system
            </p>
            <h1 id="hero-title">
              A thought crosses the <span>threshold.</span>
            </h1>
            <p className={styles.lead}>
              Huginn Studio makes considered software feel vivid without making
              every surface loud. Bone paper, iron ink and one vermilion field
              meet an ordered-dither boundary that lets the image give way to
              print.
            </p>
            <div className={styles.actions}>
              <a className={styles.button} href="#material">
                See the material <span aria-hidden="true">↘</span>
              </a>
              <a className={styles.quietButton} href="#tokens">
                Read the system
              </a>
            </div>
          </div>
          <aside
            className={styles.heroPlate}
            aria-label="Huginn identity specimen"
          >
            <div className={styles.plateTop}>
              <span>Huginn / 03</span>
              <span>Thought in print</span>
            </div>
            <svg
              className={styles.plateMark}
              viewBox="0 0 64 64"
              role="img"
              aria-label="Threshold Print mark"
            >
              <path fill="currentColor" d="M8 8h48v8H16v40H8zM28 28h8v28h-8z" />
              <circle cx="36" cy="36" r="3" fill="#171210" />
              <circle cx="43" cy="43" r="2" fill="#171210" />
              <circle cx="50" cy="50" r="1.4" fill="#171210" />
            </svg>
            <div className={styles.plateMain}>
              <strong>HUGINN</strong>
              <span>A studio for slow software</span>
            </div>
            <div className={styles.plateBottom}>
              <span>Bone / Ink / Vermilion</span>
              <span>2026</span>
            </div>
          </aside>
        </section>
        <dl className={styles.facts} aria-label="Case facts">
          <div>
            <dt>Material</dt>
            <dd>Paper + print</dd>
          </div>
          <div>
            <dt>Signature</dt>
            <dd>Ordered dither</dd>
          </div>
          <div>
            <dt>Structure</dt>
            <dd>64-unit mark grid</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Identity + interface</dd>
          </div>
        </dl>

        <section
          className={styles.section}
          id="case"
          aria-labelledby="case-title"
        >
          <SectionHead
            id="case"
            number="01"
            label="The case"
            title="A message, not a mascot."
            lead="Huginn is named for thought, but its identity does not draw a bird. The mark is a threshold crossed by a signal: an image enters, print carries it through."
          />
          <div className={styles.caseGrid}>
            <article className={styles.quoteCard}>
              <p>
                Thought flies out at dawn. The print remembers its way home.
              </p>
              <div className={styles.quoteFoot}>
                <span>One idea / one mark</span>
                <span>Huginn Studio</span>
              </div>
            </article>
            <dl className={styles.caseFacts}>
              <div>
                <dt>Category</dt>
                <dd>Independent software studio identity</dd>
              </div>
              <div>
                <dt>Promise</dt>
                <dd>Make thoughtful software vivid and legible.</dd>
              </div>
              <div>
                <dt>Audience</dt>
                <dd>Design engineers, artists and product teams</dd>
              </div>
              <div>
                <dt>Not this</dt>
                <dd>A mythology crest, game brand or retro toy</dd>
              </div>
              <div>
                <dt>Voice</dt>
                <dd>Considered, vivid, exact</dd>
              </div>
              <div>
                <dt>Mark idea</dt>
                <dd>Threshold / Print: a frame broken by a halftone trace</dd>
              </div>
            </dl>
          </div>
          <div className={styles.principles}>
            {[
              {
                n: '01',
                title: 'The field is vermilion',
                copy: 'One loud surface per view. The rest is bone, ink and breathing room.',
              },
              {
                n: '02',
                title: 'The dots carry the edge',
                copy: 'Dither has a job: it is the image boundary, not a wallpaper pattern.',
              },
              {
                n: '03',
                title: 'The print holds still',
                copy: 'Motion resolves to a finished frame. Copy and controls work without it.',
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
              src="/brand/huginn/cover.svg"
              alt="Huginn Studio brand board: Threshold Print mark, HUGINN wordmark, bone paper, ink and vermilion."
              width={1200}
              height={900}
              sizes="(max-width: 850px) 100vw, 1180px"
            />
            <figcaption>
              Brand board / source SVG / bone, ink, vermilion, brass
            </figcaption>
          </figure>
        </section>

        <section
          className={styles.section}
          id="material"
          aria-labelledby="material-title"
        >
          <SectionHead
            id="material"
            number="02"
            label="Material"
            title="The picture breaks into print."
            lead="The ordered threshold is the one signature effect. It converts a smooth image into a dotted edge, then leaves an opaque field behind. No blur, glow or second material competes with the boundary."
          />
          <div className={styles.materialGrid}>
            <div className={styles.materialStage}>
              <div className={styles.stageTop}>
                <span>Material study / 01</span>
                <span>Bayer 8 × 8</span>
              </div>
              <div className={styles.stageType}>
                Source / field<span>Threshold → solid red</span>
              </div>
              <div className={styles.stageBottom}>
                <span>Image above</span>
                <span>Print boundary below</span>
              </div>
            </div>
            <ol className={styles.recipe}>
              <li>
                <strong>01 / Source</strong>
                <code>image + optional alpha matte</code>
                <p>
                  The painting is decorative; attribution sits in readable copy
                  beside the component.
                </p>
              </li>
              <li>
                <strong>02 / Threshold</strong>
                <code>ordered Bayer pattern</code>
                <p>
                  Pixel density changes at a defined dissolve point, not through
                  a gradient mesh.
                </p>
              </li>
              <li>
                <strong>03 / Field</strong>
                <code>opaque vermilion</code>
                <p>
                  All controls and footer copy remain on a solid,
                  contrast-checked surface.
                </p>
              </li>
              <li>
                <strong>04 / Still state</strong>
                <code>prefers-reduced-motion</code>
                <p>
                  Reduced motion skips the reveal and presents the complete
                  image and lettering.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section
          className={styles.section}
          id="system"
          aria-labelledby="system-title"
        >
          <SectionHead
            id="system"
            number="03"
            label="System proof"
            title="A small form, with real states."
            lead="The interface proof uses native fields. Submit empty to see an error summary; tab through the controls to inspect focus; choose values to see the system stay legible."
          />
          <div className={styles.proofLayout}>
            <div className={styles.formPanel}>
              <div className={styles.formPanelHead}>
                <div>
                  <p className={styles.label}>Form / 01</p>
                  <h3>Send a note</h3>
                </div>
                <span className={styles.formTag}>Local specimen</span>
              </div>
              <p className={styles.formLead}>
                Names stay visible, errors explain recovery, disabled controls
                retain their context. The accent is reserved for the action;
                focus uses a brass outline.
              </p>
              <HuginnFormDemo />
            </div>
            <aside className={styles.aside}>
              <div>
                <p className={styles.label}>Anatomy</p>
                <h3>Label → control → hint → error</h3>
                <p>
                  Each field has a visible label. Hints are optional; error text
                  links to the field through `aria-describedby`.
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
                  States use labels and borders as well as colour; errors do not
                  rely on red alone.
                </p>
              </div>
              <div>
                <p className={styles.label}>Component proof</p>
                <h3>Wild Hunt footer</h3>
                <p>
                  The configurable canvas footer is demonstrated below as a case
                  component. It is not installed as the portfolio-wide footer.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section
          className={styles.section}
          id="tokens"
          aria-labelledby="tokens-title"
        >
          <SectionHead
            id="tokens"
            number="04"
            label="Tokens"
            title="Three layers, one source."
            lead="The case reads `features/huginn/tokens.json`. A small generator exports namespaced CSS and a JSON download; components consume semantic roles instead of inventing local hex values."
          />
          <div className={styles.tokenGrid}>
            <article className={styles.tokenCard}>
              <header>
                <span className={styles.label}>01 / Primitive</span>
                <span className={styles.tokenCount}>
                  {primitives.length} values
                </span>
              </header>
              <h3>Ink and stock</h3>
              <p>
                Raw values name the material, not the component that happens to
                use them.
              </p>
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
                <span className={styles.tokenCount}>
                  {semantic.length} roles
                </span>
              </header>
              <h3>Roles, not palette slots</h3>
              <p>
                Surface, field, focus and error use stable names. The route
                theme switch changes semantic roles together.
              </p>
              <div className={styles.swatches}>
                {semantic.slice(0, 10).map((token) => (
                  <div className={styles.swatch} key={token.name}>
                    <i
                      style={{ background: `var(--hg-${token.name})` }}
                      aria-hidden="true"
                    />
                    <span>{token.name}</span>
                    <code>{token.value}</code>
                  </div>
                ))}
              </div>
            </article>
            <article className={styles.tokenCard}>
              <header>
                <span className={styles.label}>03 / Component</span>
                <span className={styles.tokenCount}>3 groups</span>
              </header>
              <h3>Print decisions</h3>
              <p>
                Button, field and card treatments share one hard edge and a
                clear focus ring.
              </p>
              <div className={styles.swatches}>
                <div className={styles.swatch}>
                  <i
                    style={{ background: 'var(--hg-button-bg)' }}
                    aria-hidden="true"
                  />
                  <span>button</span>
                  <code>48px</code>
                </div>
                <div className={styles.swatch}>
                  <i
                    style={{ background: 'var(--hg-field-bg)' }}
                    aria-hidden="true"
                  />
                  <span>field</span>
                  <code>48px</code>
                </div>
                <div className={styles.swatch}>
                  <i
                    style={{ background: 'var(--hg-card-bg)' }}
                    aria-hidden="true"
                  />
                  <span>card</span>
                  <code>5px edge</code>
                </div>
              </div>
            </article>
          </div>
          <div className={styles.tokenTableWrap}>
            <table className={styles.tokenTable}>
              <caption className={styles.srOnly}>
                Huginn measured contrast pairs and intended use
              </caption>
              <thead>
                <tr>
                  <th scope="col">Pair</th>
                  <th scope="col">Ratio</th>
                  <th scope="col">Use</th>
                </tr>
              </thead>
              <tbody>
                {contrast.map((pair) => (
                  <tr key={pair.label}>
                    <th scope="row">{pair.label}</th>
                    <td>{pair.ratio.toFixed(2)}:1</td>
                    <td>{pair.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.downloads}>
            <a href="/brand/huginn/huginn-tokens.css" download>
              Download CSS ↓
            </a>
            <a href="/brand/huginn/huginn-tokens.json" download>
              Download JSON ↓
            </a>
            <a href="/brand/huginn/cover.svg" download>
              Download board ↓
            </a>
            <a href="/brand/huginn/mark.svg" download>
              Download mark ↓
            </a>
          </div>
        </section>

        <section
          className={styles.section}
          id="audit"
          aria-labelledby="audit-title"
        >
          <SectionHead
            id="audit"
            number="05"
            label="Audit"
            title="What shipped, what stays open."
            lead="A case is useful when its limits are visible. This route records the shipped files and avoids claims about checks that have not been run."
          />
          <div className={styles.auditGrid}>
            <article className={styles.auditCard}>
              <p className={styles.label}>Shipped / paths</p>
              <h3>Case kit</h3>
              <ul>
                <li>Brief and guide: `design/brand/huginn/`.</li>
                <li>Token source: `features/huginn/tokens.json`.</li>
                <li>Generated CSS/JSON and marks: `/brand/huginn/`.</li>
                <li>Footer specimen: `components/ui/wild-hunt-footer.tsx`.</li>
                <li>Case and Markdown twin: `/design-system/huginn`.</li>
              </ul>
            </article>
            <article className={styles.auditCard}>
              <p className={styles.label}>Gap / Not verified</p>
              <h3>Next checks</h3>
              <ul>
                <li>
                  Six directions have a recorded comparison; a separately
                  rendered 16px favicon browser-chrome pass still needs visual
                  review.
                </li>
                <li>
                  Chromium local viewports need checking; Firefox and Safari are
                  not claimed here.
                </li>
                <li>
                  Remote painting and cutout availability depend on the source
                  host.
                </li>
                <li>
                  No visual regression or automated axe CI is added by this
                  case.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="footer-demo-title">
          <SectionHead
            id="footer-demo"
            number="06"
            label="Component specimen"
            title="Wild Hunt footer."
            lead="Image, optional subject matte, wordmark, palette, captions, link columns and interaction are configurable. Keyboard actions remain normal anchors and a button; pointer response is decorative."
          />
          <div className={styles.footerDemo}>
            <FooterDemo />
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <HuginnLockup size={34} />
          <p>One print boundary. One field. The rest is clearance.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/design-system">Case library</Link>
          <Link href="/design-engineering">Design engineering</Link>
          <a href="/design-system/huginn/llms.txt">Markdown twin</a>
          <a href="/brand/huginn/README.md">Guide</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}
