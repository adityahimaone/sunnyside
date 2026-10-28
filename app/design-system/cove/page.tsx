import type { Metadata } from 'next'
import Image from 'next/image'

import '@/features/cove/cove-tokens.css'

import {
  COLOUR_MAIN,
  DECISIONS,
  GAPS,
  MARK_FAMILIES,
  MARK_GATE,
  MOTION,
  NAV,
  OUTPUT_CONTRACT,
  RESOURCES,
  STORY_BEATS,
  TYPE_GATE,
  TYPE_RESEARCH,
  VOICE,
  type MarkPath,
} from '@/features/cove/cove-data'
import { CopyButton } from '@/features/cove/components/actions'
import {
  CoveLockup,
  CoveMark,
  CoveStacked,
  CoveWordmark,
} from '@/features/cove/components/brand'
import { CoveChrome } from '@/features/cove/components/cove-chrome'
import { CoveThemeToggle } from '@/features/cove/components/theme-toggle'
import { FormDemo } from '@/features/cove/components/form-demo'
import tokens from '@/features/cove/tokens.json'
import styles from '@/features/cove/cove.module.css'

export const metadata: Metadata = {
  title: 'Cove — Design System',
  description:
    'Cove v1.0 is a blue liquid-glass design system: one glass layer, one solid reading plate, a C monogram, Instrument Serif and Sans, ten native controls and an honest audit.',
  alternates: {
    canonical: '/design-system/cove',
    types: { 'text/markdown': '/design-system/cove/llms.txt' },
  },
  openGraph: {
    title: 'Cove — Design System',
    description:
      'A calmer kind of depth. One glass layer over one blue field, a solid reading plate, and a C that is the cove.',
    type: 'website',
    url: '/design-system/cove',
    images: [
      {
        url: '/brand/cove/cove-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Cove brand board: the squared C mark with an ice inlay, the Abyss and Foam palette, Instrument Serif and Sans, the glass recipe and the form kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cove — Design System',
    description:
      'A calmer kind of depth. One glass layer over one blue field, a solid reading plate, and a C that is the cove.',
    images: [
      {
        url: '/brand/cove/cove-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Cove brand board: the squared C mark with an ice inlay, the Abyss and Foam palette, Instrument Serif and Sans, the glass recipe and the form kit',
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
const deepSemantic = tokens.semantic.dark as Token[]
const frostSemantic = tokens.semantic.light as Token[]
const deepComponents = tokens.components.dark as Token[]
const frostComponents = tokens.components.light as Token[]
const typeTokens = tokens.type as Token[]

const TOKEN_COUNT =
  Object.keys(tokens.theme).length +
  primitives.length +
  deepSemantic.length +
  frostSemantic.length +
  deepComponents.length +
  frostComponents.length +
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
  'field-image',
]

const SEMANTIC_TABLE = deepSemantic.map((deep) => ({
  deep,
  frost: frostSemantic.find((token) => token.name === deep.name),
}))

const RESOURCE_SUMMARY = {
  present: RESOURCES.length,
  used: RESOURCES.filter((resource) => resource.status === 'used').length,
  substituted: RESOURCES.filter((resource) => resource.status === 'substituted')
    .length,
  untouched: RESOURCES.filter((resource) => resource.status === 'not used')
    .length,
}

const CONTRACT_SUMMARY = {
  shipped: OUTPUT_CONTRACT.filter((item) => item.status === 'shipped').length,
  total: OUTPUT_CONTRACT.length,
}

const GATE_SUMMARY = {
  passed: MARK_GATE.filter((check) => check.result === 'pass').length,
  total: MARK_GATE.length,
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

function InlineMark({
  paths,
  label,
}: {
  paths: readonly MarkPath[]
  label: string
}) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={label}>
      {paths.map((path, index) => (
        <path
          key={`${path.d}-${index}`}
          d={path.d}
          fillRule="evenodd"
          fill={path.accent ? 'var(--cv-ice)' : 'currentColor'}
        />
      ))}
    </svg>
  )
}

export default function CovePage() {
  return (
    <div className={`${styles.page} cv-scope`} id="top">
      <CoveChrome />
      <a href="#collection" className={styles.skipLink}>
        Skip to the system
      </a>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a
            href="#top"
            className={styles.navBrand}
            aria-label="Cove, back to top"
          >
            <CoveLockup priority />
          </a>
          <nav className={styles.navLinks} aria-label="Case contents">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>
          <CoveThemeToggle className={styles.navTheme} />
        </div>
      </header>

      <main id="collection">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroField} aria-hidden />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowDot} aria-hidden />
                Case 06 / v1.0 design system
              </p>
              <h1 id="hero-title" className={styles.heroTitle}>
                A calmer
                <br />
                <em className={styles.heroTitleEm}>kind of depth.</em>
              </h1>
              <p className={styles.heroLead}>
                Cove is a blue liquid-glass system for interfaces that sit over
                the world: one glass layer, one solid reading plate, and a type
                hierarchy calm enough to disappear.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#material">
                  See the glass <span aria-hidden>↗</span>
                </a>
                <a className={styles.ghostButton} href="#forms">
                  Try the controls
                </a>
              </div>
              <dl className={styles.heroStats}>
                <div>
                  <dt>Material</dt>
                  <dd>Glass + water</dd>
                </div>
                <div>
                  <dt>Mark</dt>
                  <dd>C monogram</dd>
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

            <aside
              className={`${styles.heroPlate} ${styles.glassPanel} ${styles.onDeep}`}
            >
              <div className={styles.plateHead}>
                <span className={styles.cardLabel}>Case file / 1.0</span>
                <span className={styles.liveTag}>
                  <span aria-hidden /> Live surface
                </span>
              </div>
              <div className={styles.plateBrand}>
                <CoveMark size={56} decorative />
                <div>
                  <CoveWordmark height={26} />
                  <p className={styles.plateSub}>
                    Identity &amp; interface system
                  </p>
                </div>
              </div>
              <dl className={styles.plateSpecs}>
                <div>
                  <dt>Material</dt>
                  <dd>Glass + water</dd>
                </div>
                <div>
                  <dt>Family</dt>
                  <dd>Architectural monogram</dd>
                </div>
                <div>
                  <dt>Contrast</dt>
                  <dd>17.14:1</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>1.0 / 2026</dd>
                </div>
              </dl>
              <div className={styles.plateFoot}>
                <span>Case 06</span>
                <a href="/brand/cove/cove-brandkit.png" download>
                  Board <span aria-hidden>↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <div className={styles.metaStrip} aria-label="Case metadata">
          <span>Identity / Cove 1.0</span>
          <span>Mark / C monogram</span>
          <span>Type / Instrument Serif + Sans</span>
          <span>Status / Shipped</span>
        </div>

        <section
          id="foundation"
          className={styles.section}
          aria-labelledby="foundation-title"
        >
          <SectionHead
            id="foundation"
            number="01"
            label="Foundation"
            title={
              <>
                Depth, without
                <br />
                the fog.
              </>
            }
            lead="Cove is not glass everywhere. It is one translucent layer over one field, a solid plate for anything you have to read, and a single ice accent. The restraint is the system."
          />

          <div className={styles.storyGrid}>
            <div className={styles.storySpine}>
              <p className={styles.cardLabel}>Story spine / seven beats</p>
              <dl className={styles.storyBeats}>
                {STORY_BEATS.map((beat) => (
                  <div key={beat.beat} className={styles.storyBeat}>
                    <dt>{beat.beat}</dt>
                    <dd>{beat.line}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className={`${styles.storyStatement} ${styles.onDeep}`}>
              <div>
                <p className={styles.cardLabel} style={{ color: '#93a3ac' }}>
                  One sentence
                </p>
                <blockquote>
                  Cove keeps <em>depth</em> readable: one glass layer over one
                  field, a solid reading plate, and an ice accent that never
                  becomes a mood.
                </blockquote>
              </div>
              <div className={styles.storyStatementFoot}>
                <span>Reject it if a second glass layer appears</span>
                <span>2026</span>
              </div>
            </aside>
          </div>

          <div className={styles.decisionHead}>
            <div>
              <p className={styles.cardLabel}>Decision cards</p>
              <h3>Six rules, each with a failure</h3>
            </div>
            <p className={styles.tableNote}>
              Decision / because / not when / breaks next. The last line is the
              audit backlog.
            </p>
          </div>

          <div className={styles.decisionGrid}>
            {DECISIONS.map((decision) => (
              <article key={decision.title} className={styles.decisionCard}>
                <h4>{decision.title}</h4>
                <dl className={styles.decisionRows}>
                  <div className={styles.decisionRow}>
                    <dt>Decision</dt>
                    <dd>{decision.decision}</dd>
                  </div>
                  <div className={styles.decisionRow}>
                    <dt>Because</dt>
                    <dd>{decision.because}</dd>
                  </div>
                  <div className={styles.decisionRow}>
                    <dt>Not when</dt>
                    <dd>{decision.notWhen}</dd>
                  </div>
                  <div className={styles.decisionRow}>
                    <dt>Breaks next</dt>
                    <dd>{decision.breaksNext}</dd>
                  </div>
                </dl>
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
            title={
              <>
                Glass holds.
                <br />
                The field moves.
              </>
            }
            number="02"
            label="Material"
            lead="A single translucent sheet with a lit cut edge and one specular. Behind it, the field; on it, nothing you need to read. The copy sits on a solid plate."
          />

          <div className={styles.materialGrid}>
            <div className={`${styles.materialStage} ${styles.onDeep}`}>
              <div className={styles.stageFieldBg} aria-hidden />
              <div className={styles.stageTop}>
                <span className={styles.cardLabel} style={{ color: '#93a3ac' }}>
                  Material study / 01
                </span>
                <span className={styles.stageTag}>backdrop-filter</span>
              </div>
              <div className={`${styles.stageCard} ${styles.glassPanel}`}>
                <div className={styles.stageCardHead}>
                  <CoveMark size={30} decorative />
                  <span>Glass surface</span>
                </div>
                <p>
                  One translucent sheet with a lit cut edge and a top specular.
                  The field stays outside the text block; the copy gets a solid
                  plate.
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
                <span>04 Grain</span>
              </div>
            </div>

            <div className={styles.materialNotes}>
              <p className={styles.cardLabel}>The recipe</p>
              <ol className={styles.recipe}>
                <li>
                  <span>Fill</span>
                  <code>var(--cv-glass-fill)</code>
                  <p>
                    8% foam on Deep, 62% white on Frost. One layer, never a
                    stack.
                  </p>
                </li>
                <li>
                  <span>Edge</span>
                  <code>1px var(--cv-glass-edge)</code>
                  <p>
                    A lit cut edge, not a glow. It tells the eye the sheet has a
                    boundary.
                  </p>
                </li>
                <li>
                  <span>Specular</span>
                  <code>inset 0 1px 0 var(--cv-glass-highlight)</code>
                  <p>
                    One highlight, top only. A second turns the material into
                    plastic.
                  </p>
                </li>
                <li>
                  <span>Grain</span>
                  <code>feTurbulence / 0.16</code>
                  <p>
                    A low-opacity grain on the field, never on the reading
                    plate.
                  </p>
                </li>
              </ol>

              <div className={styles.doDont}>
                <div>
                  <p className={styles.doDontTitle}>Do</p>
                  <ul>
                    <li>Use glass for chrome over the field.</li>
                    <li>Put every paragraph on a solid plate.</li>
                    <li>Measure the composite, not the page.</li>
                  </ul>
                </div>
                <div>
                  <p className={styles.doDontTitle}>Don’t</p>
                  <ul>
                    <li>Stack two glass layers.</li>
                    <li>Put body copy on the blur.</li>
                    <li>Animate the blur or the field.</li>
                  </ul>
                </div>
              </div>

              <p className={styles.fieldNote}>
                The supplied background image was not in the workspace. The page
                ships a CSS caustic field; set <code>--cv-field-image</code> to
                the image and it replaces the gradients everywhere.
              </p>
            </div>
          </div>
        </section>

        <section
          id="marks"
          className={styles.section}
          aria-labelledby="marks-title"
        >
          <SectionHead
            id="marks"
            title={
              <>
                One letter,
                <br />
                one cove.
              </>
            }
            number="03"
            label="Marks"
            lead="The C is the cove: a squared letterform with 45° walls and one ice inlay on the lower lip. It works in one colour first; the inlay is punctuation, not structure."
          />

          <div className={styles.marksLayout}>
            <div className={`${styles.markStage} ${styles.onDeep}`}>
              <div className={styles.markStageTop}>
                <span className={styles.cardLabel}>Construction / 64 grid</span>
                <span className={styles.stageTag}>v1.0</span>
              </div>
              <div className={styles.markStageCenter}>
                <CoveMark size={190} decorative />
                <CoveLockup />
              </div>
              <div className={styles.markStageFoot}>
                <span>Frame / 8 units</span>
                <span>Opening / 24</span>
                <span>Arm / 12</span>
                <span>Inlay / 16 × 8</span>
                <span>Primitives / 2 · 1</span>
              </div>
            </div>

            <aside className={styles.markNotes}>
              <p className={styles.cardLabel}>Hard gate / six checks</p>
              <p>
                The family is <strong>architectural monogram</strong>. One
                squared C with 45° walls; the ink letter is the cove, the ice
                inlay is the waterline. Remove the inlay and the letter still
                stands.
              </p>
              <div className={styles.gateGrid}>
                {MARK_GATE.map((check) => (
                  <div key={check.gate} className={styles.gateCard}>
                    <div className={styles.gateCardHead}>
                      <strong>
                        {check.gate}. {check.title}
                      </strong>
                      <StatusPill tone="pass">Pass</StatusPill>
                    </div>
                    <p>{check.evidence}</p>
                  </div>
                ))}
              </div>
              <div className={styles.applicationNote}>
                <code>score-mark.py</code> returns PASS: no circle, no stroke,
                two primitives in the primary, one in the compact, and a C that
                still reads at 16px.
              </div>
            </aside>
          </div>

          <div className={styles.bakeoffHead}>
            <div>
              <p className={styles.cardLabel}>Four directions / one material</p>
              <h3>Why the C won</h3>
            </div>
            <p className={styles.tableNote}>
              All four were drawn on the same 64 grid. The choice is silhouette
              and meaning, not a defect.
            </p>
          </div>

          <div className={styles.bakeoffGrid}>
            {MARK_FAMILIES.map((family) => (
              <article
                key={family.id}
                className={styles.bakeoffCard}
                data-kept={family.verdict === 'kept'}
              >
                <div className={styles.bakeoffTop}>
                  <div className={styles.bakeoffMark}>
                    <InlineMark
                      paths={family.paths}
                      label={`${family.name} mark`}
                    />
                  </div>
                  <span className={styles.bakeoffFamily}>{family.family}</span>
                </div>
                <div>
                  <p className={styles.bakeoffName}>{family.name}</p>
                  <StatusPill
                    tone={family.verdict === 'kept' ? 'pass' : 'unused'}
                  >
                    {family.verdict}
                  </StatusPill>
                </div>
                <p className={styles.bakeoffReason}>{family.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="colour"
          className={styles.section}
          aria-labelledby="colour-title"
        >
          <SectionHead
            id="colour"
            title={
              <>
                Blue,
                <br />
                by role.
              </>
            }
            number="04"
            label="Colour"
            lead="Abyss is the ground; Foam is the text; Ice is the one loud field. Horizon and Mist are structure. Clay, Moss and Amber are status, never decoration. Every pair is measured."
          />

          <div className={styles.colourGrid}>
            {COLOUR_MAIN.map((colour) => (
              <article key={colour.name} className={styles.colourCard}>
                <div
                  className={styles.colourSwatch}
                  style={{ background: colour.value }}
                  aria-hidden
                />
                <div className={styles.colourBody}>
                  <p className={styles.colourName}>{colour.name}</p>
                  <p className={styles.colourValue}>
                    {colour.value} · {colour.ratio}
                  </p>
                  <p className={styles.colourRole}>{colour.role}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.colourRule}>
            <span>One loud field / Ice</span>
            <span>Glass is a material, not a colour</span>
            <span>Body 4.5:1 · large 3:1</span>
          </div>

          <div className={styles.tableBlock}>
            <div className={styles.tableHead}>
              <div>
                <p className={styles.cardLabel}>Contrast</p>
                <h3>Pairs that ship</h3>
              </div>
              <p className={styles.tableNote}>
                Accents are checked before they carry text. Status colours are
                roles, not fields.
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
        </section>

        <section
          id="type"
          className={styles.section}
          aria-labelledby="type-title"
        >
          <SectionHead
            id="type"
            title={
              <>
                Serif for the
                <br />
                name, sans
                <br />
                for the work.
              </>
            }
            number="05"
            label="Type"
            lead="Instrument Serif gives the hero and the wordmark their calm; Instrument Sans carries every field, label and paragraph; Geist Mono keeps the facts. The pairing was chosen for contrast, not novelty."
          />

          <div className={styles.typeBlock}>
            <div className={styles.typeBlockHead}>
              <p className={styles.cardLabel}>Specimen</p>
              <p className={styles.typeBlockNote}>
                Instrument Serif / Instrument Sans / Geist Mono
              </p>
            </div>

            <div className={styles.typeResearch}>
              <h3>{TYPE_RESEARCH.title}</h3>
              <p>{TYPE_RESEARCH.body}</p>
              <ul className={styles.researchList} aria-label="Type sources">
                {TYPE_RESEARCH.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <p className={styles.typeSpecimen}>A calmer kind of depth.</p>
            <div className={styles.typeRows}>
              <div>
                <span>Display</span>
                <strong className={styles.typeDisplay}>Instrument Serif</strong>
                <code>400 / 6.2rem / −0.035em</code>
              </div>
              <div>
                <span>Reading</span>
                <strong className={styles.typeReading}>
                  Depth is a surface.
                </strong>
                <code>Instrument Sans / 16–18</code>
              </div>
              <div>
                <span>Label</span>
                <strong className={styles.typeMono}>MATERIAL / 04</strong>
                <code>Geist Mono 500 / 0.14em</code>
              </div>
            </div>
            <ul className={styles.typeGate}>
              {TYPE_GATE.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="forms"
          className={styles.section}
          aria-labelledby="forms-title"
        >
          <SectionHead
            id="forms"
            title={
              <>
                Controls that
                <br />
                survive the glass.
              </>
            }
            number="06"
            label="Forms"
            lead="Ten native controls. The field sits on a solid plate; the glass is beside it, never under it. Labels visible, focus a 3px ring, errors linked, and the error summary takes focus."
          />

          <div className={styles.formsLayout}>
            <div className={styles.formPanel}>
              <div className={styles.formPanelHead}>
                <div>
                  <p className={styles.cardLabel}>Form / 01</p>
                  <h3>Request a key</h3>
                </div>
                <span className={styles.formBadge}>Specimen</span>
              </div>
              <p className={styles.formLead}>
                The whole kit in one place: text, email, password, select, radio
                group, textarea, checkbox, switch, range and file. Submit with
                the fields empty to see the summary.
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
                    <strong>Plate</strong>
                    <p>The input sits on a solid token ground, not the blur.</p>
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
                  Theme DNA: lit cut edge, halo ring, airy density. The field
                  reads <code>--cv-field-*</code>; the mark reads the same
                  material.
                </p>
                <CopyButton
                  text={`<input className="cv-input" aria-describedby="email-hint" />`}
                  label="Copy input"
                  copiedLabel="Input copied"
                />
              </div>

              <div className={styles.asideNote}>
                <p>
                  Focus is a 3px ring plus a border change. It is never removed,
                  and it is never the only state.
                </p>
                <a
                  className={styles.textLink}
                  href="/brand/cove/cove-forms.css"
                  download
                >
                  Download the form kit <span aria-hidden>↓</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="motion"
          className={styles.section}
          aria-labelledby="motion-title"
        >
          <SectionHead
            id="motion"
            title={
              <>
                One ease.
                <br />
                No drift.
              </>
            }
            number="07"
            label="Motion"
            lead="Movement is a response, not an atmosphere. Hover and press in 120ms, state in 240ms, entrance in 480ms; one ease. The field is a still frame."
          />

          <div className={styles.motionGrid}>
            {MOTION.map((item) => (
              <article key={item.name} className={styles.motionCard}>
                <p className={styles.motionValue}>{item.value}</p>
                <p>{item.name}</p>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="voice"
          className={styles.section}
          aria-labelledby="voice-title"
        >
          <SectionHead
            id="voice"
            title={
              <>
                Calm, exact,
                <br />
                unhurried.
              </>
            }
            number="08"
            label="Voice"
            lead="The voice is museum wall text, not a launch post. It says what happened and what to do next. The empty state and the error are where the brand is tested."
          />

          <div className={styles.voiceGrid}>
            <article className={styles.voiceCard}>
              <h3>We are / We are not</h3>
              <ul className={styles.voiceList}>
                <li>
                  <strong>We are</strong> {VOICE.weAre}
                </li>
                <li>
                  <strong>We are not</strong> {VOICE.weAreNot}
                </li>
              </ul>
              <p className={styles.voiceQuote}>{VOICE.quote}</p>
            </article>

            <article className={styles.voiceCard}>
              <h3>Say / Don’t say</h3>
              <ul className={styles.voiceList}>
                {VOICE.say.map((line) => (
                  <li key={line}>
                    <strong>Say</strong> {line}
                  </li>
                ))}
                {VOICE.dontSay.map((line) => (
                  <li key={line}>
                    <strong>Don’t say</strong> {line}
                  </li>
                ))}
              </ul>
              <div className={styles.voiceContext}>
                {VOICE.contexts.map(([label, line]) => (
                  <p key={label}>
                    <strong>{label}</strong> {line}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section
          id="applications"
          className={styles.section}
          aria-labelledby="applications-title"
        >
          <SectionHead
            id="applications"
            title={
              <>
                One mark,
                <br />
                every size.
              </>
            }
            number="09"
            label="Applications"
            lead="The compact C carries 16–24px; the primary C carries the inlay above 32. Clear space is half the mark height. The favicon is the one place Ice leads."
          />

          <div className={styles.applicationsGrid}>
            <article className={styles.applicationCard}>
              <p className={styles.cardLabel}>Lockups</p>
              <div className={styles.applicationRow}>
                <div>
                  <CoveLockup />
                  <p className={styles.applicationLabel}>
                    Horizontal / 108 × 34
                  </p>
                </div>
                <div>
                  <CoveStacked height={88} />
                  <p className={styles.applicationLabel}>Stacked / 72 × 88</p>
                </div>
              </div>
              <div className={styles.applicationRow}>
                {[16, 32, 64, 128].map((size) => (
                  <div key={size}>
                    <CoveMark size={size} decorative />
                    <p className={styles.applicationLabel}>{size}px</p>
                  </div>
                ))}
              </div>
              <p className={styles.applicationNote}>
                The full mark is used at 32px and above. The compact is a
                separate one-path C for 16–24px; it drops the inlay rather than
                shrinking the waterline into a speck.
              </p>
              <div className={styles.applicationDownloads}>
                <a href="/brand/cove/mark.svg" download>
                  Mark SVG
                </a>
                <a href="/brand/cove/lockup.svg" download>
                  Lockup SVG
                </a>
                <a href="/brand/cove/lockup-stacked.svg" download>
                  Stacked SVG
                </a>
                <a href="/brand/cove/wordmark.svg" download>
                  Wordmark SVG
                </a>
              </div>
            </article>

            <article className={styles.applicationCard}>
              <p className={styles.cardLabel}>Favicon and app icon</p>
              <div className={styles.applicationRow}>
                {[16, 32, 48].map((size) => (
                  <div key={size}>
                    <span className={styles.iconChip}>
                      <Image
                        src={`/brand/cove/favicon-${size}.png`}
                        width={size}
                        height={size}
                        alt={`Cove favicon at ${size} pixels`}
                      />
                    </span>
                    <p className={styles.applicationLabel}>{size}px</p>
                  </div>
                ))}
                <div>
                  <Image
                    src="/brand/cove/icon-192.png"
                    width={72}
                    height={72}
                    alt="Cove app icon"
                    style={{ display: 'block' }}
                  />
                  <p className={styles.applicationLabel}>App / 192</p>
                </div>
              </div>
              <p className={styles.applicationNote}>
                The favicon is an Ice field and the compact C, so it survives
                dark browser chrome. The app icon returns to Abyss and the full
                C with its inlay.
              </p>
              <div className={styles.applicationDownloads}>
                <a href="/brand/cove/favicon.ico" download>
                  Favicon ICO
                </a>
                <a href="/brand/cove/icon.svg" download>
                  Icon SVG
                </a>
                <a href="/brand/cove/icon-192.png" download>
                  Icon 192
                </a>
              </div>
            </article>
          </div>
        </section>

        <section
          id="tokens"
          className={styles.section}
          aria-labelledby="tokens-title"
        >
          <SectionHead
            id="tokens"
            title={
              <>
                Four layers,
                <br />
                one source.
              </>
            }
            number="10"
            label="Tokens"
            lead="Theme DNA feeds primitive values, primitives feed semantic roles, and roles feed component decisions. The CSS and JSON are generated from features/cove/tokens.json."
          />

          <div className={styles.tokenGrid}>
            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>00 / Theme DNA</span>
                <span className={styles.tokenCount}>
                  {Object.keys(tokens.theme).length}
                </span>
              </div>
              <h3>The same edge for mark and field</h3>
              <p>
                One small object drives the glass, the field radius, the focus
                ring and the label. Change it here, not in a screenshot.
              </p>
              <div className={styles.componentList}>
                {Object.entries(tokens.theme).map(([name, value]) => (
                  <div key={name} className={styles.componentRow}>
                    <code>--cv-dna-{name}</code>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>01 / Primitive</span>
                <span className={styles.tokenCount}>{primitives.length}</span>
              </div>
              <h3>Named values</h3>
              <p>
                Abyss, Foam, Ice, Horizon, Mist, Moss. Raw values only; no role
                in the name.
              </p>
              <div className={styles.swatchGrid}>
                {primitives.map((token) => (
                  <div key={token.name} className={styles.swatchChip}>
                    <span
                      className={styles.swatchColor}
                      style={{ background: `var(--cv-${token.name})` }}
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
                  {deepSemantic.length * 2}
                </span>
              </div>
              <h3>Roles, Deep and Frost</h3>
              <p>
                One role, two surfaces. Components read these names, not the
                primitives.
              </p>
              <div className={styles.tokenMiniTable}>
                {SEMANTIC_PREVIEW.map((name) => {
                  const deep = deepSemantic.find((token) => token.name === name)
                  const frost = frostSemantic.find(
                    (token) => token.name === name,
                  )
                  return (
                    <div key={name} className={styles.tokenMiniRow}>
                      <code>--cv-{name}</code>
                      <span
                        className={styles.miniChip}
                        style={{ background: deep?.value }}
                        title={deep?.value}
                      />
                      <span
                        className={styles.miniChip}
                        style={{ background: frost?.value }}
                        title={frost?.value}
                      />
                    </div>
                  )
                })}
              </div>
              <p className={styles.tokenNote}>
                10 of {deepSemantic.length} roles shown; the table and the
                download have all {deepSemantic.length}.
              </p>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>03 / Component</span>
                <span className={styles.tokenCount}>
                  {deepComponents.length * 2}
                </span>
              </div>
              <h3>Decisions, not palettes</h3>
              <p>
                Field, button, card and chip read from the semantic layer. The
                field kit reads the theme DNA.
              </p>
              <div className={styles.componentList}>
                {deepComponents.map((deep) => {
                  const frost = frostComponents.find(
                    (token) => token.name === deep.name,
                  )
                  return (
                    <div key={deep.name} className={styles.componentRow}>
                      <code>--cv-{deep.name}</code>
                      <span>{deep.value}</span>
                      <span className={styles.componentDark}>
                        frost: {frost?.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </article>
          </div>

          <div className={styles.tokenDownloads}>
            <a href="/brand/cove/cove-tokens.css" download>
              Download CSS <span aria-hidden>↓</span>
            </a>
            <a href="/brand/cove/cove-tokens.json" download>
              Download JSON <span aria-hidden>↓</span>
            </a>
            <a href="/brand/cove/cove-forms.css" download>
              Download forms <span aria-hidden>↓</span>
            </a>
            <a href="/brand/cove/cove-brandkit.png" download>
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
                <h3>One role, two surfaces</h3>
              </div>
              <CopyButton
                text={deepSemantic
                  .slice(0, 6)
                  .map((token) => `--cv-${token.name}: ${token.value};`)
                  .join('\n')}
                label="Copy sample"
                copiedLabel="Sample copied"
              />
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  Cove semantic tokens, Deep and Frost values, and their role
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Deep</th>
                    <th scope="col">Frost</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {SEMANTIC_TABLE.map(({ deep, frost }) => (
                    <tr key={deep.name}>
                      <th scope="row">
                        <code>--cv-{deep.name}</code>
                      </th>
                      <td>
                        <span className={styles.valueCell}>
                          <span
                            className={styles.valueDot}
                            style={{ background: deep.value }}
                            aria-hidden
                          />
                          {deep.resolved ?? deep.value}
                        </span>
                      </td>
                      <td>
                        <span className={styles.valueCell}>
                          <span
                            className={styles.valueDot}
                            style={{ background: frost?.value }}
                            aria-hidden
                          />
                          {frost?.resolved ?? frost?.value}
                        </span>
                      </td>
                      <td>{deep.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            title={
              <>
                What shipped,
                <br />
                what is missing.
              </>
            }
            number="11"
            label="Audit"
            lead="The v2.4 method lists its resources; the mark scorer gives a verdict. Both were checked on disk. Present is not the same as used, and a pass is not the same as a finished kit."
          />

          <div className={styles.auditSummary}>
            <div>
              <span className={styles.auditNumber}>
                {GATE_SUMMARY.passed}/{GATE_SUMMARY.total}
              </span>
              <p>Hard-gate checks pass</p>
            </div>
            <div>
              <span className={styles.auditNumber}>PASS</span>
              <p>Mark score / no failures</p>
            </div>
            <div>
              <span className={styles.auditNumber}>
                {RESOURCE_SUMMARY.present}/{RESOURCES.length}
              </span>
              <p>v2.4 resources present</p>
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
                    v2.4 brand-system resources, whether they are present, and
                    how the Cove build used them
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Resource</th>
                      <th scope="col">Use</th>
                      <th scope="col">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESOURCES.map((resource) => (
                      <tr key={resource.path}>
                        <th scope="row">
                          <code>{resource.path}</code>
                        </th>
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
                    <StatusPill
                      tone={item.status === 'shipped' ? 'shipped' : 'note'}
                    >
                      {item.status}
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
          </div>

          <div className={styles.auditGrid}>
            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>C / Verification</p>
                  <h3>One command, then eyes</h3>
                </div>
                <span className={styles.auditMeta}>Chromium / this pass</span>
              </div>
              <ul className={styles.passList}>
                <li>
                  <StatusPill tone="pass">Pass</StatusPill>
                  <div>
                    <strong>Mark score</strong>
                    <code>score-mark.py --dir public/brand/cove</code>
                    <p>No failures at 16, 32 and 128px.</p>
                  </div>
                </li>
                <li>
                  <StatusPill tone="pass">Pass</StatusPill>
                  <div>
                    <strong>Static audit</strong>
                    <code>audit.mjs --manifest audit.json</code>
                    <p>Required files, SVG, ICO, PNG, tokens and forms.</p>
                  </div>
                </li>
                <li>
                  <StatusPill tone="pass">Pass</StatusPill>
                  <div>
                    <strong>Browser pass</strong>
                    <code>qa.mjs --url /design-system/cove</code>
                    <p>1440/390, Deep/Frost, reduced motion, form errors.</p>
                  </div>
                </li>
              </ul>
              <div className={styles.auditLinks}>
                <a
                  href="/design-system/cove/llms.txt"
                  className={styles.textLink}
                >
                  Read the raw Markdown twin <span aria-hidden>↗</span>
                </a>
                <a href="/design-system" className={styles.textLink}>
                  Compare with the other cases <span aria-hidden>↗</span>
                </a>
              </div>
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
            </article>
          </div>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.onDeep}`}>
        <div className={styles.footerTop}>
          <CoveWordmark height={44} />
          <p className={styles.footerStatement}>
            Depth, without the fog.
            <br />
            One layer is enough.
          </p>
        </div>
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.cardLabel}>Brand</p>
            <a href="/brand/cove/lockup.svg" download>
              Lockup SVG
            </a>
            <a href="/brand/cove/mark.svg" download>
              Mark SVG
            </a>
            <a href="/brand/cove/favicon.ico" download>
              Favicon ICO
            </a>
            <a href="/brand/cove/cove-brandkit.png" download>
              Brand board
            </a>
          </div>
          <div>
            <p className={styles.cardLabel}>System</p>
            <a href="/brand/cove/cove-tokens.css" download>
              Tokens CSS
            </a>
            <a href="/brand/cove/cove-tokens.json" download>
              Tokens JSON
            </a>
            <a href="/brand/cove/cove-forms.css" download>
              Form kit CSS
            </a>
            <a href="/design-system/cove/llms.txt">Markdown twin</a>
            <a href="#top">Back to top</a>
          </div>
          <div>
            <p className={styles.cardLabel}>Elsewhere</p>
            <a href="/design-system">Case library</a>
            <a href="/design-system/vitrine">Vitrine</a>
            <a href="/sunnyside">Sunnyside</a>
            <a href="/design-engineering">Design engineering</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>Cove 1.0 · 2026 · Aditya Himawan</span>
          <span>Case 06 · liquid glass · no generated imagery</span>
        </div>
      </footer>
    </div>
  )
}
