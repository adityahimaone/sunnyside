import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import '@/features/riso/riso-tokens.css'
import {
  FooterDemo,
  RegistrationDemo,
  RegistrationTarget,
  RisoControls,
  RisoFormDemo,
  RisoLockup,
  RisoMark,
  RisoWordmark,
  TearStudy,
} from '@/features/riso'
import tokens from '@/features/riso/tokens.json'
import styles from '@/features/riso/riso.module.css'

export const metadata: Metadata = {
  title: 'Riso Co. / Atelier Ink — Design System',
  description:
    'Case 04: a risograph print shop whose identity is the registration error. Two drums, one sheet, and a second impression that is always 2.5px out — a drawn mark, five measured ink pairs, and a footer that tears from its pin.',
  alternates: {
    canonical: '/design-system/riso',
    types: { 'text/markdown': '/design-system/riso/llms.txt' },
  },
  openGraph: {
    title: 'Riso Co. / Atelier Ink — Design System',
    description: 'Two passes, one sheet. A print shop whose identity is the registration error.',
    url: '/design-system/riso',
    type: 'website',
    images: [
      {
        url: '/brand/riso/riso-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Riso Co. brand board: an orange poster reading “two passes, one sheet”, the torn-sheet mark, five inks and the deckle tear.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riso Co. / Atelier Ink — Design System',
    description: 'Two passes, one sheet.',
    images: ['/brand/riso/riso-brandkit.png'],
  },
}

type Token = { name: string; value: string; role: string }
type Pair = { label: string; theme: string; a: string; b: string; ratio: number; level: string; use: string }

const primitives = tokens.primitives as Token[]
const light = tokens.semantic.light as Token[]
const contrast = tokens.contrast as Pair[]
const measured = contrast.length
const failing = contrast.filter((pair) => pair.level === 'Fail').length

const NAV = [
  { id: 'rule', label: 'Rule' },
  { id: 'mark', label: 'Mark' },
  { id: 'ink', label: 'Ink' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'tear', label: 'Tear' },
  { id: 'specimen', label: 'Specimen' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
]

const EXPLORATIONS = [
  { n: '01', name: 'Sheet, torn, keylined', verdict: 'kept', note: 'two shapes, three colours' },
  { n: '02', name: 'Pushpin alone', verdict: 'cut', note: 'hardware, not the shop' },
  { n: '03', name: 'Two overlapping circles', verdict: 'cut', note: 'reads as a Venn diagram' },
  { n: '04', name: 'Halftone R', verdict: 'cut', note: 'a letter in dots is still a letter' },
  { n: '05', name: 'Drum as a ring', verdict: 'cut', note: 'no edge, so no tear' },
  { n: '06', name: 'Folded corner', verdict: 'cut', note: 'a folder icon, not a sheet' },
]

const SCALE = [
  ['Display', 'Space Grotesk 700', '104 / 0.90 / −0.05em'],
  ['Headline', 'Space Grotesk 700', '54 / 0.95 / −0.045em'],
  ['Subhead', 'Space Grotesk 700', '23 / 1.20 / −0.03em'],
  ['Body', 'Geist 400', '17 / 1.60'],
  ['Caption', 'Geist 400', '13 / 1.50'],
  ['Label', 'Geist Mono 400', '11 / 0.16em'],
]

const RECIPE = [
  {
    term: 'Ridge',
    copy: '84 x-positions from one seed, floored so the tear never crosses the chrome above it.',
  },
  {
    term: 'Rim',
    copy: 'The sheet is lifted 1.2–4.8px per point and the gap filled with the fibre colour.',
  },
  {
    term: 'Flaps',
    copy: 'Six curls, alternating up and down, each hung off its own stretch of the ridge.',
  },
  {
    term: 'Pin',
    copy: 'Click it and the seed advances: lift, stab, and a new edge ripped from the pin out.',
  },
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
        <p className={styles.sectionNumber}>
          {number} <span>/ {label}</span>
        </p>
        <h2 id={`${id}-title`} className={styles.displayFace}>
          {title}
        </h2>
      </div>
      <p className={styles.sectionLead}>{lead}</p>
    </div>
  )
}

export default function RisoPage() {
  return (
    <div className={styles.page} id="top" data-riso-root data-theme="light" data-pass="a">
      <a className={styles.skip} href="#main">
        Skip to the sheet
      </a>

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
          <RisoControls />
        </div>
      </header>

      <main id="main">
        <div className={styles.shell}>
          <section className={styles.hero} aria-labelledby="hero-title">
            <div>
              <p className={styles.eyebrow}>Case 04 / Identity and interface system</p>
              <h1 id="hero-title" className={styles.display}>
                <span className={styles.displayInk}>
                  Two passes,
                  <br />
                  one sheet.
                </span>
                <span className={styles.displayGhost} aria-hidden="true">
                  Two passes,
                  <br />
                  one sheet.
                </span>
              </h1>
              <p className={styles.heroLead}>
                Riso Co. is a print shop and a paper lab in Berlin. The identity is built from the
                one thing a risograph cannot do: hold registration. Two drums, one sheet, and a
                second impression that is always 2.5px out.
              </p>
              <div className={styles.actions}>
                <a className={styles.button} href="#specimen">
                  Open the specimen
                  <span aria-hidden="true">↓</span>
                </a>
                <a className={styles.quietButton} href="#rule">
                  Read the rule
                </a>
              </div>
            </div>

            <aside className={styles.poster} aria-label="Riso Co. poster, orange drum">
              <span className={styles.crop} data-at="tl" aria-hidden="true" />
              <span className={styles.crop} data-at="tr" aria-hidden="true" />
              <span className={styles.crop} data-at="bl" aria-hidden="true" />
              <span className={styles.crop} data-at="br" aria-hidden="true" />
              <div className={styles.posterTop}>
                <RisoMark size={56} title="The Riso Co. mark" />
                <div className={styles.posterRun}>
                  Run 0412
                  <br />
                  270gsm vellum
                </div>
              </div>
              <div className={styles.posterWord}>
                <RisoWordmark height={86} ghostScale={1.8} />
              </div>
              <div className={styles.posterFoot}>
                <span>
                  A · B
                  <br />
                  2.2mm
                </span>
                <span>
                  Berlin
                  <br />
                  1 / 250
                </span>
              </div>
            </aside>
          </section>

          <dl className={styles.specStrip} aria-label="Case facts">
            <div>
              <dt>Stock</dt>
              <dd>270gsm vellum</dd>
            </div>
            <div>
              <dt>Drums</dt>
              <dd>Orange + federal blue</dd>
            </div>
            <div>
              <dt>Mark</dt>
              <dd>A torn sheet, twice</dd>
            </div>
            <div>
              <dt>Component</dt>
              <dd>Pushpin tear footer</dd>
            </div>
          </dl>

          {/* 01 — the rule */}
          <section className={styles.section} id="rule" aria-labelledby="rule-title">
            <SectionHead
              id="rule"
              number="01"
              label="The rule"
              title="The second pass is never corrected."
              lead="Every surface prints twice. Carbon goes down first; the blue drum follows 2.5px up and to the right. Where the two land on the same fibre, the sheet shows a third colour — and that overlap, not the orange, is the identity."
            />

            <div className={styles.ruleGrid}>
              <RegistrationDemo />

              <ul className={styles.notes}>
                <li>
                  <b>01</b>
                  <div>
                    <h4>The offset is the mark</h4>
                    <p>
                      2.5px on screen, 2.2mm on paper. Wide enough to read as a second impression,
                      narrow enough that the first one stays legible.
                    </p>
                  </div>
                </li>
                <li>
                  <b>02</b>
                  <div>
                    <h4>Register is allowed</h4>
                    <p>
                      At zero the sheet is in register: it looks like a poster and says nothing
                      about how it was made. Keep it for legal copy and nothing else.
                    </p>
                  </div>
                </li>
                <li>
                  <b>03</b>
                  <div>
                    <h4>The third colour is measured</h4>
                    <p>
                      Orange over blue is <span className={styles.mono}>#46212A</span>, sampled
                      from a press sheet — not a blend mode, not a filter. It only appears where
                      the passes cross.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 02 — the mark */}
          <section className={styles.section} id="mark" aria-labelledby="mark-title">
            <SectionHead
              id="mark"
              number="02"
              label="The mark"
              title="A sheet, torn, printed twice."
              lead="The mark is not a letter. It is the sheet itself: a rectangle with its bottom edge torn away, filled by the orange drum and keylined by the blue one. Two shapes, three colours, and it still reads at 16px."
            />

            <div className={styles.markGrid}>
              <div className={styles.markStage}>
                <RisoMark size={260} title="The mark on a 64 grid" />
                <span className={styles.markStageNote}>64 grid / 1 unit = 1px at 64</span>
              </div>

              <div className={styles.markFamily}>
                <div className={styles.familyRow}>
                  <div className={styles.familyItem}>
                    <RisoMark size={64} title="Primary mark" />
                    <span className={styles.label}>Primary</span>
                  </div>
                  <div className={styles.familyItem}>
                    <RisoMark size={32} compact title="Compact mark" />
                    <span className={styles.label}>Compact</span>
                  </div>
                  <div className={styles.familyItem}>
                    <RisoMark size={16} compact title="Favicon, 16px" />
                    <span className={styles.label}>16</span>
                  </div>
                  <div className={styles.familyItem}>
                    <RegistrationTarget size={44} />
                    <span className={styles.label}>Register</span>
                  </div>
                </div>

                <p className={styles.familyNote}>
                  At 16px the tear softens into a ragged edge and the keyline becomes the mark
                  itself, so the compact drawing drops two teeth and thickens the frame. Clear space
                  is one tooth on every side; the stray keyline counts as part of the drawing.
                </p>

                <div>
                  <p className={styles.label} style={{ marginBottom: 10 }}>
                    Six drawn, one kept
                  </p>
                  <ul className={styles.explorations}>
                    {EXPLORATIONS.map((item) => (
                      <li key={item.n} data-kept={item.verdict === 'kept'}>
                        <span>{item.n}</span>
                        <span>{item.name}</span>
                        <em>{item.verdict === 'kept' ? 'kept' : item.note}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 03 — ink */}
          <section className={styles.section} id="ink" aria-labelledby="ink-title">
            <SectionHead
              id="ink"
              number="03"
              label="Ink"
              title="Two drums, five values."
              lead="Riso ink is opaque, so the palette stays short: two drums, one carbon, one stock. The fifth value is not an ink you can buy — it is what the sheet does where two drums meet."
            />

            <div className={styles.inkGrid}>
              {['ink-orange', 'ink-blue', 'ink-overprint', 'ink-carbon', 'stock-paper']
                .map((name) => primitives.find((token) => token.name === name))
                .filter((token): token is Token => Boolean(token))
                .map((token) => (
                  <div className={styles.inkChip} key={token.name}>
                    <div className={styles.inkPatch} style={{ background: token.value }} aria-hidden="true" />
                    <div className={styles.inkMeta}>
                      <b>{token.name.replace('ink-', '').replace('stock-', '')}</b>
                      <code>{token.value.toUpperCase()}</code>
                      <span>{token.role}</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className={styles.inkNotes}>
              <div>
                <p className={styles.label} style={{ marginBottom: 12 }}>
                  Overprint, not a blend mode
                </p>
                <div className={styles.overprint}>
                  <figure>
                    <div className={styles.swatch} style={{ background: 'var(--rs-display-a)' }} aria-hidden="true" />
                    <figcaption>A / orange</figcaption>
                  </figure>
                  <span className={styles.op} aria-hidden="true">
                    +
                  </span>
                  <figure>
                    <div className={styles.swatch} style={{ background: 'var(--rs-display-b)' }} aria-hidden="true" />
                    <figcaption>B / blue</figcaption>
                  </figure>
                  <span className={styles.op} aria-hidden="true">
                    =
                  </span>
                  <figure>
                    <div className={styles.swatch} style={{ background: 'var(--rs-overprint)' }} aria-hidden="true" />
                    <figcaption>#46212A</figcaption>
                  </figure>
                </div>
                <p className={styles.familyNote} style={{ marginTop: 14 }}>
                  The overprint is a token, not a CSS effect. It has to survive a favicon, a PDF and a
                  browser with no blend support.
                </p>
              </div>

              <div>
                <p className={styles.label} style={{ marginBottom: 12 }}>
                  Screen, three coverages
                </p>
                <div className={styles.halftone}>
                  <div
                    style={{
                      background:
                        'radial-gradient(circle at center, #ff4a1c 1.9px, transparent 2px) 0 0 / 5px 5px, #f1ede4',
                    }}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      background:
                        'radial-gradient(circle at center, #ff4a1c 1.1px, transparent 1.2px) 0 0 / 5px 5px, #f1ede4',
                    }}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      background:
                        'radial-gradient(circle at center, #ff4a1c 0.6px, transparent 0.7px) 0 0 / 5px 5px, #f1ede4',
                    }}
                    aria-hidden="true"
                  />
                </div>
                <p className={styles.familyNote} style={{ marginTop: 12 }}>
                  Solid, 50%, 25%. Tints are made with the dot, never with opacity: an ink is either
                  on the fibre or it is not.
                </p>
              </div>
            </div>
          </section>

          {/* 04 — type */}
          <section className={styles.section} id="type" aria-labelledby="type-title">
            <SectionHead
              id="type"
              number="04"
              label="Type"
              title="One display face, one reading face, one label."
              lead="Space Grotesk carries the display because it has flat terminals and a narrow waist — it survives being printed twice. Geist reads. Geist Mono labels anything that is a measurement."
            />

            <div className={styles.typeGrid}>
              <div>
                <p className={styles.specimenBig}>
                  Aa
                  <span>
                    Space Grotesk 700
                    <br />
                    −0.05em / 0.90
                  </span>
                </p>
                <table className={styles.scaleTable}>
                  <caption className={styles.visuallyHidden}>Type scale</caption>
                  <thead>
                    <tr>
                      <th scope="col">Role</th>
                      <th scope="col">Face</th>
                      <th scope="col">Size / leading / tracking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCALE.map((row) => (
                      <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.typeSpecimen}>
                <p className={styles.small}>
                  The shop writes the way a press sheet reads: what went on, in what order, and what
                  it cost.
                </p>
                <p>
                  Two inks on 270gsm vellum. The orange drum lays down first and the sheet dries on
                  the rack; the blue drum follows the next morning, and it never lands where the
                  first one did.
                </p>
                <p className={styles.small}>
                  We do not correct it. A sheet that is perfectly in register looks like it was made
                  by a machine that did not care, and the whole point of a two-drum run is that a
                  person stood there twice.
                </p>
                <p className={styles.ruleCallout}>
                  Fluorescent orange as type is <strong>2.88:1</strong> on vellum — under the 3:1
                  floor even for display. If you need orange letters, you need a second impression:{' '}
                  <span className={styles.mono}>#C22E08</span> at 4.87:1.
                </p>
              </div>
            </div>
          </section>

          {/* 05 — parts */}
          <section className={styles.section} id="parts" aria-labelledby="parts-title">
            <SectionHead
              id="parts"
              number="05"
              label="Parts"
              title="Controls, in two drums."
              lead="Native elements with a printed skin: square corners, one-pixel borders, a focus ring you can see on paper, on orange and on blue. The form is the shop's actual request form, states and all."
            />

            <div className={styles.partsGrid}>
              <div>
                <div className={styles.partsBlock}>
                  <p className={styles.label}>Actions</p>
                  <div className={styles.partsRow}>
                    <button type="button" className={styles.button}>
                      Send the request
                    </button>
                    <button type="button" className={styles.quietButton}>
                      Save draft
                    </button>
                  </div>
                </div>

                <div className={styles.partsBlock}>
                  <p className={styles.label}>Labels</p>
                  <div className={styles.partsRow}>
                    <span className={styles.tag} data-tone="a">
                      Run 0412
                    </span>
                    <span className={styles.tag} data-tone="b">
                      Blue drum
                    </span>
                    <span className={styles.tag} data-tone="quiet">
                      Sold out
                    </span>
                  </div>
                </div>

                <div className={styles.partsBlock}>
                  <p className={styles.label}>Switch</p>
                  <label className={styles.switch}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.switchTrack} aria-hidden="true" />
                    Send a press proof
                  </label>
                </div>

                <div className={styles.partsBlock}>
                  <p className={styles.label}>Field states</p>
                  <div className={styles.states}>
                    <div className={styles.stateRow}>
                      <span className={styles.label}>Default</span>
                      <input type="text" defaultValue="Atelier Nord" readOnly />
                    </div>
                    <div className={styles.stateRow}>
                      <span className={styles.label}>Focus</span>
                      <input type="text" defaultValue="press@studio.example" data-state="focus" readOnly />
                    </div>
                    <div className={styles.stateRow}>
                      <span className={styles.label}>Invalid</span>
                      <input type="text" defaultValue="not-an-address" data-state="invalid" readOnly />
                    </div>
                    <div className={styles.stateRow}>
                      <span className={styles.label}>Disabled</span>
                      <input type="text" defaultValue="Stock reserved" data-state="disabled" disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formPanel}>
                <div className={styles.formPanelHead}>
                  <h3 className={styles.displayFace}>Request a print run</h3>
                  <span className={styles.label}>Form specimen</span>
                </div>
                <p className={styles.formLead}>
                  Submit it empty to see the error summary, then tab through: every control keeps a
                  visible ring, and every error names its own recovery.
                </p>
                <RisoFormDemo />
              </div>
            </div>
          </section>

          {/* 06 — tear */}
          <section className={styles.section} id="tear" aria-labelledby="tear-title">
            <SectionHead
              id="tear"
              number="06"
              label="The tear"
              title="84 points, six flaps, one seed."
              lead="The component's edge is drawn, not traced: a ridge of 84 points from a seeded generator, a fibre rim lifted a few pixels, and six curled flaps. Same seed, same tear — on the server, in the browser, and in a screenshot."
            />

            <TearStudy />

            <dl className={styles.recipe}>
              {RECIPE.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.copy}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* 07 — specimen */}
        <section className={styles.specimenSection} id="specimen" aria-labelledby="specimen-title">
          <div className={styles.specimenIntro}>
            <div>
              <p className={styles.sectionNumber}>
                07 <span>/ Specimen</span>
              </p>
              <h2 id="specimen-title" className={styles.displayFace}>
                The footer, as printed.
              </h2>
            </div>
            <p>
              The real component, not a screenshot of one. Scroll it into view: the chrome
              assembles, the pin drops, and the sheet rips from the pin outward. Change the drum and
              the master does not change.
            </p>
          </div>
          <FooterDemo />
        </section>

        <div className={styles.shell}>
          {/* 08 — tokens */}
          <section className={styles.section} id="tokens" aria-labelledby="tokens-title">
            <SectionHead
              id="tokens"
              number="08"
              label="Tokens"
              title="Three tiers, one source."
              lead="Primitives are materials; semantic roles are decisions; component values are shapes. The CSS and the JSON are generated from features/riso/tokens.json, and the contrast column is computed from the values rather than typed beside them."
            />

            <div className={styles.tokenGrid}>
              <article className={styles.tokenCard}>
                <p className={styles.label}>01 / Primitives</p>
                <h3 className={styles.displayFace}>Materials</h3>
                <p>Inks, stock and hardware. Nothing here knows what it is for.</p>
                <div className={styles.swatchList}>
                  {primitives.map((token) => (
                    <div className={styles.swatchRow} key={token.name}>
                      <i style={{ background: token.value }} aria-hidden="true" />
                      <span>{token.name}</span>
                      <code>{token.value}</code>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.tokenCard}>
                <p className={styles.label}>02 / Semantic</p>
                <h3 className={styles.displayFace}>Roles</h3>
                <p>Stable names for surfaces, ink, rules and focus. Light and dark share them.</p>
                <div className={styles.swatchList}>
                  {light.slice(0, 10).map((token) => (
                    <div className={styles.swatchRow} key={token.name}>
                      <i style={{ background: token.value }} aria-hidden="true" />
                      <span>{token.name}</span>
                      <code>{token.value}</code>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.tokenCard}>
                <p className={styles.label}>03 / Component</p>
                <h3 className={styles.displayFace}>Press settings</h3>
                <p>Values that describe the sheet rather than a colour.</p>
                <div className={styles.swatchList}>
                  <div className={styles.swatchRow}>
                    <i style={{ background: 'var(--rs-display-a)' }} aria-hidden="true" />
                    <span>registration</span>
                    <code>2.5px / 2.2mm</code>
                  </div>
                  <div className={styles.swatchRow}>
                    <i style={{ background: 'var(--rs-surface-alt)' }} aria-hidden="true" />
                    <span>radius</span>
                    <code>0px</code>
                  </div>
                  <div className={styles.swatchRow}>
                    <i style={{ background: 'var(--rs-field)' }} aria-hidden="true" />
                    <span>field height</span>
                    <code>44px</code>
                  </div>
                  <div className={styles.swatchRow}>
                    <i style={{ background: 'var(--rs-accent)' }} aria-hidden="true" />
                    <span>focus ring</span>
                    <code>2px / 3px offset</code>
                  </div>
                  <div className={styles.swatchRow}>
                    <i style={{ background: 'var(--rs-rule)' }} aria-hidden="true" />
                    <span>hairline</span>
                    <code>1px</code>
                  </div>
                </div>
              </article>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption className={styles.visuallyHidden}>
                  Measured contrast pairs, computed from the token values
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Pair</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Where it is used</th>
                  </tr>
                </thead>
                <tbody>
                  {contrast.map((pair) => (
                    <tr key={`${pair.theme}-${pair.label}`}>
                      <th scope="row">{pair.label}</th>
                      <td>
                        {pair.ratio.toFixed(2)}:1
                        <span className={styles.level} data-level={pair.level}>
                          {pair.level}
                        </span>
                      </td>
                      <td>{pair.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.downloads}>
              <a href="/brand/riso/riso-tokens.css" download>
                Tokens CSS ↓
              </a>
              <a href="/brand/riso/riso-tokens.json" download>
                Tokens JSON ↓
              </a>
              <a href="/brand/riso/riso-brandkit.png" download>
                Brand board ↓
              </a>
              <a href="/brand/riso/mark.svg" download>
                Mark SVG ↓
              </a>
              <a href="/brand/riso/wordmark.svg" download>
                Wordmark SVG ↓
              </a>
            </div>
          </section>

          {/* 09 — audit */}
          <section className={styles.section} id="audit" aria-labelledby="audit-title">
            <SectionHead
              id="audit"
              number="09"
              label="Audit"
              title="What is measured, and what is not."
              lead="A specimen that hides its gaps is a brochure. These are the numbers this page can defend, the files they live in, and the checks that were not run."
            />

            <div className={styles.auditGrid}>
              <article className={styles.auditCard}>
                <p className={styles.label}>Measured</p>
                <h3 className={styles.displayFace}>Numbers</h3>
                <ul>
                  <li>
                    {measured} contrast pairs computed from token values; {measured - failing} pass
                    AA, and the one that fails is fluorescent orange as type — which the rule
                    forbids.
                  </li>
                  <li>
                    The footer prints carbon on orange at 5.30:1. The component&apos;s white default
                    is 3.36:1 and would have failed every link on the sheet.
                  </li>
                  <li>
                    Both drums hold carbon type: 5.30:1 on orange, 4.53:1 on federal blue. White
                    fails on both.
                  </li>
                  <li>Every edge, tear and mark is a path. The page loads no images at runtime.</li>
                  <li>
                    Reduced motion is honoured by the page and by the footer: the tear jumps to its
                    finished edge instead of ripping.
                  </li>
                </ul>
              </article>

              <article className={styles.auditCard}>
                <p className={styles.label}>Files</p>
                <h3 className={styles.displayFace}>Where it lives</h3>
                <ul>
                  <li>
                    Tokens: <code>features/riso/tokens.json</code> →{' '}
                    <code>riso-tokens.css</code>.
                  </li>
                  <li>
                    Marks: <code>public/brand/riso/</code> — mark, compact, wordmark, lockup,
                    favicons.
                  </li>
                  <li>
                    Board: <code>design/brand/riso/brandkit.html</code> →{' '}
                    <code>riso-brandkit.png</code>.
                  </li>
                  <li>
                    Component: <code>components/ui/pushpin-tear-footer.tsx</code>.
                  </li>
                  <li>
                    Generators: <code>scripts/build-riso-brand.mjs</code>,{' '}
                    <code>scripts/riso-wordmark.py</code>.
                  </li>
                </ul>
              </article>
            </div>

            <p className={styles.gap} style={{ marginTop: 22 }}>
              <strong>Not verified:</strong> print output. The board is a screen render of a paper
              artefact, and the registration figure of 2.2mm is a decision, not a measurement off a
              press. Nothing here has been proofed on a real risograph.
            </p>
          </section>
        </div>
      </main>

      <footer className={styles.colophon}>
        <div className={styles.shell}>
          <div className={styles.colophonInner}>
            <div>
              <RisoMark size={36} title="Riso Co." />
            </div>
            <div className={styles.colophonLinks}>
              <Link href="/design-system">Case library</Link>
              <Link href="/design-engineering">Design engineering</Link>
              <a href="/design-system/riso/llms.txt">Markdown twin</a>
              <a href="/brand/riso/riso-tokens.json">Tokens</a>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
          <p className={styles.colophonNote}>
            Riso Co. is a fictional shop. The mark, wordmark and tear are drawn from geometry; the
            wordmark is outlined from Space Grotesk 700 (SIL OFL) and is never set as live text. The
            component is the supplied <span className={styles.mono}>pushpin-tear-footer</span>,
            re-tokenised rather than rebuilt. Case 04 / 2026.
          </p>
        </div>
      </footer>
    </div>
  )
}
