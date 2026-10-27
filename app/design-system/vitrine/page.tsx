import type { Metadata } from 'next'
import Link from 'next/link'

import '@/features/vitrine/vitrine-tokens.css'

import {
  GAPS,
  DITHER_AUDIT,
  NAV,
  OUTPUT_CONTRACT,
  SKILL_RESOURCES,
} from '@/features/vitrine/audit'
import { CopyButton } from '@/features/vitrine/components/actions'
import { CaseChrome } from '@/features/vitrine/components/case-chrome'
import {
  VitrineLockup,
  VitrineMark,
  VitrineWordmark,
} from '@/features/vitrine/components/brand'
import { DitherLens } from '@/features/vitrine/components/dither-lens'
import { FormDemo } from '@/features/vitrine/components/form-demo'
import { ThemeToggle } from '@/features/vitrine/components/theme-toggle'
import tokens from '@/features/vitrine/tokens.json'
import styles from '@/features/vitrine/vitrine.module.css'

export const metadata: Metadata = {
  title: 'Vitrine — Design System',
  description:
    'Vitrine is a glass-and-dither design system: three token layers, a mark family, ten form controls and a case study. A glass case for a low-resolution light.',
  alternates: {
    canonical: '/design-system/vitrine',
    types: { 'text/markdown': '/design-system/vitrine/llms.txt' },
  },
  openGraph: {
    title: 'Vitrine — Design System',
    description:
      'A glass case for a low-resolution light. Tokens, form controls, a mark family and the audit behind them.',
    type: 'website',
    url: '/design-system/vitrine',
    images: [
      {
        url: '/brand/vitrine/vitrine-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Vitrine brand board: the Split V mark, Case and Frost palette, Signal field, type and form specimen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitrine — Design System',
    description:
      'Glass is the container. Dither is the label. The form is the proof.',
    images: [
      {
        url: '/brand/vitrine/vitrine-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Vitrine brand board: the Split V mark, Case and Frost palette, Signal field, type and form specimen',
      },
    ],
  },
}

type Token = {
  name: string
  value: string
  resolved?: string
  role: string
}

const primitives = tokens.primitives as Token[]
const semanticLight = tokens.semantic.light as Token[]
const semanticDark = tokens.semantic.dark as Token[]
const componentsLight = tokens.components.light as Token[]
const componentsDark = tokens.components.dark as Token[]
const typeTokens = tokens.type as Token[]

const TOKEN_COUNT =
  primitives.length +
  semanticLight.length +
  semanticDark.length +
  componentsLight.length +
  componentsDark.length +
  typeTokens.length +
  tokens.space.length +
  tokens.radius.length +
  tokens.motion.length

const SEMANTIC_PREVIEW = [
  'bg',
  'fg',
  'muted',
  'border',
  'surface',
  'accent',
  'focus',
  'danger',
  'glass-fill',
  'dither-ink',
]

const SEMANTIC_TABLE = semanticLight.map((light) => ({
  light,
  dark: semanticDark.find((token) => token.name === light.name),
}))

const RESOURCE_SUMMARY = {
  present: SKILL_RESOURCES.filter((resource) => resource.present).length,
  used: SKILL_RESOURCES.filter((resource) => resource.status === 'used').length,
  substituted: SKILL_RESOURCES.filter(
    (resource) => resource.status === 'substituted',
  ).length,
  untouched: SKILL_RESOURCES.filter(
    (resource) => resource.status === 'not used',
  ).length,
}

const CONTRACT_SUMMARY = {
  shipped: OUTPUT_CONTRACT.filter((item) => item.status === 'shipped').length,
  total: OUTPUT_CONTRACT.length,
}

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
  title: React.ReactNode
  lead: string
}) {
  return (
    <div className={styles.sectionHead}>
      <p className={styles.sectionLabel}>
        <span>{number}</span> {label}
      </p>
      <h2 id={`${id}-title`} className={styles.sectionTitle}>
        {title}
      </h2>
      <p className={styles.sectionLead}>{lead}</p>
    </div>
  )
}

const STATUS_TONE = {
  pass: styles.status_pass,
  note: styles.status_note,
  used: styles.status_used,
  substituted: styles.status_substituted,
  unused: styles.status_unused,
  shipped: styles.status_shipped,
} as const

function StatusPill({
  tone,
  children,
}: {
  tone: keyof typeof STATUS_TONE
  children: React.ReactNode
}) {
  return (
    <span className={`${styles.statusPill} ${STATUS_TONE[tone]}`}>
      {children}
    </span>
  )
}

export default function DesignSystemPage() {
  return (
    <div className={`${styles.page} vt-scope`} id="top">
      <CaseChrome />
      <a href="#case" className={styles.skipLink}>
        Skip to the case
      </a>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a
            href="#top"
            className={styles.navBrand}
            aria-label="Vitrine, back to top"
          >
            <VitrineLockup priority />
          </a>
          <nav className={styles.navLinks} aria-label="Case contents">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle className={styles.navTheme} />
        </div>
      </header>

      <main>
        <section
          className={`${styles.hero} ${styles.onCase}`}
          aria-labelledby="hero-title"
        >
          <div className={styles.heroDither} aria-hidden>
            <DitherLens />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowDot} aria-hidden />
                Case 02 / Design system
              </p>
              <h1 id="hero-title" className={styles.heroTitle}>
                A glass case for a{' '}
                <span className={styles.signalText}>low‑resolution</span> light.
              </h1>
              <p className={styles.heroLead}>
                Vitrine is a design system for depth you can read: one glass
                container, one dithered information layer, and a form kit that
                refuses to disappear into the blur.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#forms">
                  Try the controls <span aria-hidden>↗</span>
                </a>
                <a className={styles.ghostButton} href="#audit">
                  Read the audit
                </a>
              </div>
              <dl className={styles.heroStats}>
                <div>
                  <dt>Material</dt>
                  <dd>Glass + dither</dd>
                </div>
                <div>
                  <dt>Grid</dt>
                  <dd>64 units</dd>
                </div>
                <div>
                  <dt>Tokens</dt>
                  <dd>{TOKEN_COUNT}</dd>
                </div>
                <div>
                  <dt>Controls</dt>
                  <dd>10</dd>
                </div>
              </dl>
            </div>

            <aside className={`${styles.heroPlate} ${styles.glassPanel}`}>
              <div className={styles.ditherEdge} aria-hidden />
              <div className={styles.plateHead}>
                <span className={styles.cardLabel}>Case file</span>
                <span className={styles.liveTag}>
                  <span aria-hidden /> Live specimen
                </span>
              </div>
              <div className={styles.plateBrand}>
                <VitrineMark size={56} />
                <div>
                  <VitrineWordmark height={26} />
                  <p className={styles.plateSub}>
                    Identity &amp; interface system
                  </p>
                </div>
              </div>
              <dl className={styles.plateSpecs}>
                <div>
                  <dt>Material</dt>
                  <dd>Glass + dither</dd>
                </div>
                <div>
                  <dt>Dither cell</dt>
                  <dd>4px</dd>
                </div>
                <div>
                  <dt>Contrast</dt>
                  <dd>17.9:1</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>1.0 / 2026</dd>
                </div>
              </dl>
              <div className={styles.plateFoot}>
                <span>Case 02</span>
                <a href="/brand/vitrine/vitrine-brandkit.png" download>
                  Board <span aria-hidden>↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <div className={styles.metaStrip} aria-label="Case metadata">
          <span>Identity / Vitrine</span>
          <span>Type / Space Grotesk + Geist</span>
          <span>Method / Glass, dithered label</span>
          <span>Status / Shipped</span>
        </div>

        <section
          id="case"
          className={styles.section}
          aria-labelledby="case-title"
        >
          <SectionHead
            id="case"
            number="01"
            label="The case"
            title={
              <>
                Two materials,
                <br />
                one object.
              </>
            }
            lead="The glass is a container, not a filter. The dither is the printed label inside it, not a texture sprayed over the page. Everything else is clearance."
          />

          <div className={styles.caseGrid}>
            <article
              className={`${styles.caseQuote} ${styles.glassPanel} ${styles.onCase}`}
            >
              <div className={styles.caseDither} aria-hidden />
              <div className={styles.quoteTop}>
                <VitrineMark size={58} />
                <span className={styles.cardLabel}>One idea</span>
              </div>
              <p className={styles.quote}>
                The case holds one object.
                <br />
                The clearance is the design.
              </p>
              <p className={styles.quoteFoot}>
                A design system for interfaces that need depth without fog.
              </p>
              <div className={styles.quoteFootRow}>
                <span>Vitrine / Case 02</span>
                <span>2026</span>
              </div>
            </article>

            <aside className={styles.caseFile}>
              <p className={styles.cardLabel}>Case file</p>
              <dl className={styles.caseFileList}>
                <div>
                  <dt>Category</dt>
                  <dd>Component system and brand kit</dd>
                </div>
                <div>
                  <dt>Promise</dt>
                  <dd>Depth without fog</dd>
                </div>
                <div>
                  <dt>Audience</dt>
                  <dd>Design engineers, product teams</dd>
                </div>
                <div>
                  <dt>Metaphor</dt>
                  <dd>A lit vitrine with a printed label</dd>
                </div>
                <div>
                  <dt>Not this</dt>
                  <dd>A frosted card with an unreadable paragraph</dd>
                </div>
                <div>
                  <dt>Voice</dt>
                  <dd>Precise, lit, unhurried</dd>
                </div>
              </dl>
            </aside>
          </div>

          <div className={styles.principles}>
            {[
              {
                number: '01',
                title: 'Glass is the container',
                copy: 'One material, one job. Glass carries controls and floating surfaces; body copy always sits on a solid ground.',
              },
              {
                number: '02',
                title: 'Dither is the label',
                copy: 'The halftone is information-bearing. It appears behind, around or above a surface, never under the words that explain it.',
              },
              {
                number: '03',
                title: 'The form is the proof',
                copy: 'A system that cannot make an email field legible has not finished. Ten controls ship here, with labels, hints, errors and focus.',
              },
            ].map((principle) => (
              <article key={principle.number} className={styles.principle}>
                <span className={styles.principleNumber}>
                  {principle.number}
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="material"
          className={styles.section}
          aria-labelledby="material-title"
        >
          <SectionHead
            id="material"
            number="02"
            label="Material"
            title={
              <>
                Glass holds.
                <br />
                Dither tells.
              </>
            }
            lead="The panel is a translucent fill with a cut edge, a top specular and a hard 1px shadow. The dither is a dot field behind it, never a gradient pretending to be one."
          />

          <div className={styles.materialGrid}>
            <div className={`${styles.materialStage} ${styles.onCase}`}>
              <div className={styles.stageDither} aria-hidden />
              <div className={styles.stageTop}>
                <span className={styles.cardLabel} style={{ color: '#93a3ac' }}>
                  Material study / 01
                </span>
                <span className={styles.stageTag}>backdrop-filter</span>
              </div>
              <div className={`${styles.stageCard} ${styles.glassPanel}`}>
                <div className={styles.stageCardHead}>
                  <VitrineMark size={30} decorative />
                  <span>Glass panel</span>
                </div>
                <p>
                  A translucent sheet with a 1px cut edge and a top highlight.
                  The dots stay outside the text block.
                </p>
                <div className={styles.stageField}>
                  <span>you@studio.com</span>
                  <span className={styles.stageFieldFocus} aria-hidden>
                    focus
                  </span>
                </div>
                <div className={styles.stageButton}>Request a key</div>
              </div>
              <div className={styles.stageLayers}>
                <span>01 Fill</span>
                <span>02 Edge</span>
                <span>03 Specular</span>
                <span>04 Hard shadow</span>
              </div>
            </div>

            <div className={styles.materialNotes}>
              <p className={styles.cardLabel}>The recipe</p>
              <ol className={styles.recipe}>
                <li>
                  <span>Fill</span>
                  <code>var(--vt-glass-fill)</code>
                  <p>
                    58% white on light, 9% white on case. Never a solid card
                    with a blur bolted on.
                  </p>
                </li>
                <li>
                  <span>Edge</span>
                  <code>1px var(--vt-glass-edge)</code>
                  <p>
                    A cut edge, not a glow. It is what tells the eye the sheet
                    has a boundary.
                  </p>
                </li>
                <li>
                  <span>Specular</span>
                  <code>inset 0 1px 0 var(--vt-glass-highlight)</code>
                  <p>
                    One highlight, top only. A second one turns the material
                    into plastic.
                  </p>
                </li>
                <li>
                  <span>Shadow</span>
                  <code>0 1px 0 var(--vt-glass-edge)</code>
                  <p>
                    The hard 1px line is the brand. The soft lift is lighting,
                    not decoration.
                  </p>
                </li>
              </ol>

              <div className={styles.doDont}>
                <div>
                  <p className={styles.doDontTitle}>Do</p>
                  <ul>
                    <li>Use glass for a container with one object.</li>
                    <li>Keep the dither outside the text block.</li>
                    <li>Let one Signal field carry the page.</li>
                  </ul>
                </div>
                <div>
                  <p className={styles.doDontTitle}>Don’t</p>
                  <ul>
                    <li>Put body copy on a translucent card.</li>
                    <li>Dither the input surface.</li>
                    <li>Add a second loud field.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="forms"
          className={styles.section}
          aria-labelledby="forms-title"
        >
          <SectionHead
            id="forms"
            number="03"
            label="Forms"
            title={
              <>
                Controls that
                <br />
                survive the material.
              </>
            }
            lead="Ten native controls in one specimen form. Keyboard labels, visible focus, hint text, an error summary and a live status message. The material is glass; the control is still a control."
          />

          <div className={styles.formsLayout}>
            <div className={styles.formPanel}>
              <div className={styles.ditherEdge} aria-hidden />
              <div className={styles.formPanelHead}>
                <div>
                  <p className={styles.cardLabel}>Form / 01</p>
                  <h3>Request access</h3>
                </div>
                <span className={styles.formBadge}>Specimen</span>
              </div>
              <p className={styles.formLead}>
                This is the whole kit in one place: text, email, password,
                select, radio group, textarea, checkbox, switch, range and file.
                Submit with the fields empty to see the error summary.
              </p>
              <FormDemo />
            </div>

            <aside className={styles.formAside}>
              <p className={styles.cardLabel}>Anatomy</p>
              <ol className={styles.anatomy}>
                <li>
                  <span>01</span>
                  <div>
                    <strong>Label</strong>
                    <p>Always visible. The placeholder never replaces it.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Control</strong>
                    <p>
                      Native input, select, textarea, radio, checkbox, range,
                      file.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Hint</strong>
                    <p>Quiet, but never the only place a requirement lives.</p>
                  </div>
                </li>
                <li>
                  <span>04</span>
                  <div>
                    <strong>Error</strong>
                    <p>
                      Linked with aria-describedby; the summary takes focus.
                    </p>
                  </div>
                </li>
              </ol>

              <div className={styles.stateList}>
                <p className={styles.cardLabel}>States</p>
                <div className={styles.stateChips}>
                  <span>Default</span>
                  <span>Hover</span>
                  <span className={styles.stateFocus}>Focus</span>
                  <span className={styles.stateInvalid}>Invalid</span>
                  <span className={styles.stateDisabled}>Disabled</span>
                </div>
              </div>

              <div className={styles.asideNote}>
                <p>
                  The control is native. The material is CSS. The dither stays
                  behind the panel, never on the field.
                </p>
                <CopyButton
                  text={`<input className="vt-input" aria-describedby="email-hint" />`}
                  label="Copy input"
                  copiedLabel="Input copied"
                />
              </div>

              <div className={styles.asideNote}>
                <p>
                  Focus is a 3px ring plus a border change. It is never removed,
                  and it is never the only state.
                </p>
                <a className={styles.textLink} href="#tokens">
                  See the focus tokens <span aria-hidden>↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="tokens"
          className={styles.section}
          aria-labelledby="tokens-title"
        >
          <SectionHead
            id="tokens"
            number="04"
            label="Tokens"
            title={
              <>
                Three layers,
                <br />
                one source.
              </>
            }
            lead="Primitive values feed semantic roles; semantic roles feed component decisions. The CSS and the JSON are generated from features/vitrine/tokens.json, so the page and the download cannot drift."
          />

          <div className={styles.tokenGrid}>
            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>01 / Primitive</span>
                <span className={styles.tokenCount}>{primitives.length}</span>
              </div>
              <h3>Named values</h3>
              <p>
                Case, Frost, Graphite, Signal, Iris, Clay. Raw values only; no
                role in the name.
              </p>
              <div className={styles.swatchGrid}>
                {primitives.map((token) => (
                  <div key={token.name} className={styles.swatchChip}>
                    <span
                      className={styles.swatchColor}
                      style={{ background: `var(--vt-${token.name})` }}
                      aria-hidden
                    />
                    <span className={styles.swatchName}>{token.name}</span>
                    <code>{token.value}</code>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>02 / Semantic</span>
                <span className={styles.tokenCount}>
                  {semanticLight.length * 2}
                </span>
              </div>
              <h3>Roles, light and dark</h3>
              <p>
                One role, two values. Components read these names, not the
                primitives.
              </p>
              <div className={styles.tokenMiniTable}>
                {SEMANTIC_PREVIEW.map((name) => {
                  const light = semanticLight.find(
                    (token) => token.name === name,
                  )
                  const dark = semanticDark.find((token) => token.name === name)
                  return (
                    <div key={name} className={styles.tokenMiniRow}>
                      <code>--vt-{name}</code>
                      <span
                        className={styles.miniChip}
                        style={{ background: light?.value }}
                        title={light?.value}
                      />
                      <span
                        className={styles.miniChip}
                        style={{ background: dark?.value }}
                        title={dark?.value}
                      />
                    </div>
                  )
                })}
              </div>
              <p className={styles.tokenNote}>
                10 of 22 roles shown; the table and the download have all 22.
              </p>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>03 / Component</span>
                <span className={styles.tokenCount}>
                  {componentsLight.length * 2}
                </span>
              </div>
              <h3>Decisions, not palettes</h3>
              <p>Field, button, card and chip read from the semantic layer.</p>
              <div className={styles.componentList}>
                {componentsLight.map((light) => {
                  const dark = componentsDark.find(
                    (token) => token.name === light.name,
                  )
                  return (
                    <div key={light.name} className={styles.componentRow}>
                      <code>--vt-{light.name}</code>
                      <span>{light.value}</span>
                      <span className={styles.componentDark}>
                        dark: {dark?.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </article>
          </div>

          <div className={styles.tokenDownloads}>
            <a href="/brand/vitrine/vitrine-tokens.css" download>
              Download CSS <span aria-hidden>↓</span>
            </a>
            <a href="/brand/vitrine/vitrine-tokens.json" download>
              Download JSON <span aria-hidden>↓</span>
            </a>
            <a href="/brand/vitrine/vitrine-brandkit.png" download>
              Download board <span aria-hidden>↓</span>
            </a>
            <span className={styles.tokenTotal}>
              {TOKEN_COUNT} declarations
            </span>
          </div>

          <div className={styles.tableBlock}>
            <div className={styles.tableHead}>
              <div>
                <p className={styles.cardLabel}>Semantic tokens</p>
                <h3>One role, two themes</h3>
              </div>
              <CopyButton
                text={semanticLight
                  .slice(0, 6)
                  .map((token) => `--vt-${token.name}: ${token.value};`)
                  .join('\n')}
                label="Copy sample"
                copiedLabel="Sample copied"
              />
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  Vitrine semantic tokens, light and dark values, and their role
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Light</th>
                    <th scope="col">Dark</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {SEMANTIC_TABLE.map(({ light, dark }) => (
                    <tr key={light.name}>
                      <th scope="row">
                        <code>--vt-{light.name}</code>
                      </th>
                      <td>
                        <span className={styles.valueCell}>
                          <span
                            className={styles.valueDot}
                            style={{ background: light.value }}
                            aria-hidden
                          />
                          {light.resolved ?? light.value}
                        </span>
                      </td>
                      <td>
                        <span className={styles.valueCell}>
                          <span
                            className={styles.valueDot}
                            style={{ background: dark?.value }}
                            aria-hidden
                          />
                          {dark?.resolved ?? dark?.value}
                        </span>
                      </td>
                      <td>{light.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.tableBlock}>
            <div className={styles.tableHead}>
              <div>
                <p className={styles.cardLabel}>Contrast</p>
                <h3>Pairs that ship</h3>
              </div>
              <p className={styles.tableNote}>
                Body 4.5:1. Large 3:1. Accents are checked before they carry
                text.
              </p>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  Colour pairs with measured contrast ratios and intended use
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Pair</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.contrast.map((pair) => (
                    <tr key={pair.label}>
                      <th scope="row">
                        <span className={styles.pairCell}>
                          <span
                            className={styles.pairChip}
                            style={{ background: pair.bg }}
                            aria-hidden
                          >
                            <span style={{ color: pair.fg }}>Aa</span>
                          </span>
                          {pair.label}
                        </span>
                      </th>
                      <td>
                        <span className={styles.ratio}>
                          {pair.ratio.toFixed(2)}:1
                        </span>
                      </td>
                      <td>{pair.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.typeBlock}>
            <div className={styles.typeBlockHead}>
              <p className={styles.cardLabel}>Type</p>
              <p className={styles.typeBlockNote}>
                Space Grotesk / Geist / Geist Mono
              </p>
            </div>
            <p className={styles.typeSpecimen}>vitrine</p>
            <div className={styles.typeRows}>
              <div>
                <span>Display</span>
                <strong className={styles.typeDisplay}>
                  Space Grotesk 700
                </strong>
                <code>64–190 / -0.055em</code>
              </div>
              <div>
                <span>Reading</span>
                <strong className={styles.typeReading}>
                  Depth without fog.
                </strong>
                <code>Geist 400 / 16–18</code>
              </div>
              <div>
                <span>Label</span>
                <strong className={styles.typeMono}>Material / 04</strong>
                <code>Geist Mono 500 / 0.14em</code>
              </div>
            </div>
          </div>
        </section>

        <section
          id="audit"
          className={styles.section}
          aria-labelledby="audit-title"
        >
          <SectionHead
            id="audit"
            number="05"
            label="Audit"
            title={
              <>
                What the method
                <br />
                asked for.
              </>
            }
            lead="The sunnyside-brand-system skill lists its resources, and the dithercn skill lists its engine. Both were checked on disk. This is the honest scorecard: present is not the same as used."
          />

          <div className={styles.auditSummary}>
            <div>
              <span className={styles.auditNumber}>
                {RESOURCE_SUMMARY.present}/{SKILL_RESOURCES.length}
              </span>
              <p>Skill resources present</p>
            </div>
            <div>
              <span className={styles.auditNumber}>
                {CONTRACT_SUMMARY.shipped}/{CONTRACT_SUMMARY.total}
              </span>
              <p>Output contract shipped</p>
            </div>
            <div>
              <span className={styles.auditNumber}>31</span>
              <p>dithercn files installed</p>
            </div>
            <div>
              <span className={styles.auditNumber}>{GAPS.length}</span>
              <p>Gaps named below</p>
            </div>
          </div>

          <div className={styles.auditWide}>
            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>A / Skill resources</p>
                  <h3>Every advertised path</h3>
                </div>
                <span className={styles.auditMeta}>
                  {RESOURCE_SUMMARY.used} used · {RESOURCE_SUMMARY.substituted}{' '}
                  substituted · {RESOURCE_SUMMARY.untouched} not used
                </span>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>
                    Brand-system skill resources, whether they are present, and
                    how the Vitrine build used them
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Resource</th>
                      <th scope="col">Present</th>
                      <th scope="col">Use</th>
                      <th scope="col">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SKILL_RESOURCES.map((resource) => (
                      <tr key={resource.path}>
                        <th scope="row">
                          <code>
                            {resource.path.replace(
                              'skills/sunnyside-brand-system/',
                              '',
                            )}
                          </code>
                        </th>
                        <td>
                          <StatusPill tone={resource.present ? 'pass' : 'note'}>
                            {resource.present ? 'Yes' : 'No'}
                          </StatusPill>
                        </td>
                        <td>
                          <StatusPill
                            tone={
                              resource.status === 'used'
                                ? 'used'
                                : resource.status === 'substituted'
                                  ? 'substituted'
                                  : 'unused'
                            }
                          >
                            {resource.status}
                          </StatusPill>
                        </td>
                        <td>
                          {resource.evidence}
                          {resource.note ? (
                            <span className={styles.tableSub}>
                              {resource.note}
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>B / Output contract</p>
                  <h3>What the kit contains</h3>
                </div>
                <span className={styles.auditMeta}>
                  {CONTRACT_SUMMARY.shipped}/{CONTRACT_SUMMARY.total} shipped
                </span>
              </div>
              <ul className={styles.contractList}>
                {OUTPUT_CONTRACT.map((item) => (
                  <li key={item.item}>
                    <StatusPill tone="shipped">Shipped</StatusPill>
                    <div>
                      <strong>{item.item}</strong>
                      <code>{item.evidence}</code>
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className={styles.auditGrid}>
            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>C / Dithercn</p>
                  <h3>Engine and skill check</h3>
                </div>
                <span className={styles.auditMeta}>1 custom field</span>
              </div>
              <ul className={styles.passList}>
                {DITHER_AUDIT.map((item) => (
                  <li key={item.item}>
                    <StatusPill tone={item.status === 'pass' ? 'pass' : 'note'}>
                      {item.status === 'pass' ? 'Pass' : 'Note'}
                    </StatusPill>
                    <div>
                      <strong>{item.item}</strong>
                      <code>{item.evidence}</code>
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>D / Gaps</p>
                  <h3>What is not here</h3>
                </div>
                <span className={styles.auditMeta}>Named, not hidden</span>
              </div>
              <ol className={styles.gapList}>
                {GAPS.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ol>
              <div className={styles.auditLinks}>
                <a
                  href="/design-system/vitrine/llms.txt"
                  className={styles.textLink}
                >
                  Read the raw Markdown twin <span aria-hidden>↗</span>
                </a>
                <a href="/sunnyside" className={styles.textLink}>
                  Compare with Sunnyside <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.onCase}`}>
        <div className={styles.footerTop}>
          <VitrineWordmark height={44} />
          <p className={styles.footerStatement}>
            One case. One object.
            <br />
            The rest is clearance.
          </p>
        </div>
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.cardLabel}>Brand</p>
            <a href="/brand/vitrine/lockup.svg" download>
              Lockup SVG
            </a>
            <a href="/brand/vitrine/mark.svg" download>
              Mark SVG
            </a>
            <a href="/brand/vitrine/favicon.ico" download>
              Favicon ICO
            </a>
            <a href="/brand/vitrine/vitrine-brandkit.png" download>
              Brand board
            </a>
          </div>
          <div>
            <p className={styles.cardLabel}>System</p>
            <a href="/brand/vitrine/vitrine-tokens.css" download>
              Tokens CSS
            </a>
            <a href="/brand/vitrine/vitrine-tokens.json" download>
              Tokens JSON
            </a>
            <a href="/design-system/vitrine/llms.txt">Markdown twin</a>
            <a href="#top">Back to top</a>
          </div>
          <div>
            <p className={styles.cardLabel}>Elsewhere</p>
            <a href="https://dithercn.dev" target="_blank" rel="noreferrer">
              dithercn <span aria-hidden>↗</span>
            </a>
            <Link href="/design-system">
              Case library <span aria-hidden>↗</span>
            </Link>
            <Link href="/sunnyside">
              Sunnyside <span aria-hidden>↗</span>
            </Link>
            <Link href="/design-engineering">
              Design engineering <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>Vitrine 1.0 · 2026 · Aditya Himawan</span>
          <span>Glass + dither · no generated imagery</span>
        </div>
      </footer>
    </div>
  )
}
