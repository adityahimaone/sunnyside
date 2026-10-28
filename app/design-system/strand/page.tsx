import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import '@/features/strand/strand-tokens.css'

import {
  BUDGET,
  BUDGET_RULES,
  DECISIONS,
  DETACH_SCORES,
  GAPS,
  HORIZON_RULES,
  HORIZON_SPEC,
  MARK_GEOMETRY,
  MARK_GATE,
  MARK_SPECS,
  MOTION_RULES,
  NAV,
  OUTPUT_CONTRACT,
  STORY_BEATS,
  TYPE_GATE,
} from '@/features/strand/strand-data'
import { CopyButton } from '@/features/strand/components/actions'
import {
  StrandLockup,
  StrandMark,
  StrandWordmark,
} from '@/features/strand/components/brand'
import { StrandChrome } from '@/features/strand/components/strand-chrome'
import { StrandThemeToggle } from '@/features/strand/components/theme-toggle'
import { FormDemo } from '@/features/strand/components/form-demo'
import tokens from '@/features/strand/tokens.json'
import styles from '@/features/strand/strand.module.css'

export const metadata: Metadata = {
  title: 'Strand — Case 07 | Design System',
  description:
    'Strand is a quiet coastal design system: flat white quartz reading plates with no lift, marine basalt ink, one shallow-tide green signal, and an atmospheric dune vista framing both hero and footer.',
  alternates: {
    canonical: '/design-system/strand',
    types: { 'text/markdown': '/design-system/strand/llms.txt' },
  },
  openGraph: {
    title: 'Strand — Case 07 | Design System',
    description:
      'Where the dunes meet the tide. An architectural coastal interface system.',
    type: 'website',
    url: '/design-system/strand',
    images: [
      {
        url: '/brand/strand/strand-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Strand brand board: the architectural S mark, coastal shoreline palette, quartz reading plates and form kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strand — Design System',
    description:
      'Where the dunes meet the tide. White sand reading plates, marine basalt ink, and a coastal vista framing both ends of the page.',
    images: [
      {
        url: '/brand/strand/strand-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Strand brand board: the architectural S mark with a tidal channel, the sand and sea palette, and the native form kit',
      },
    ],
  },
}

export default function StrandPage() {
  return (
    <div className={styles.root} id="top">
      <StrandChrome />

      {/* ── Sticky Topbar ──────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={`${styles.shell} ${styles.topbarInner}`}>
          <Link
            href="#top"
            className={styles.brandLink}
            aria-label="Strand, back to top"
          >
            <StrandLockup priority />
          </Link>

          <nav className={styles.nav} aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.topbarTools}>
            <StrandThemeToggle />
            <Link
              href="/design-system"
              className={`${styles.navLink} ${styles.libraryLink}`}
            >
              Case Library <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Below 960px the topbar nav is hidden. Eleven sections with no way to
          reach them is not a responsive layout, it is a missing one. */}
      <nav className={styles.navScroll} aria-label="Sections">
        {NAV.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={styles.navChip}>
            {item.label}
          </a>
        ))}
      </nav>

      <main className={styles.shell}>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>
            Case 07 · Architectural Monogram · v1.1
          </div>
          <h1 className={styles.heroTitle}>Where the dunes meet the tide.</h1>
          <p className={styles.heroDeck}>
            Strand is a quiet coastal design system for contemplative,
            high-craft interfaces: flat quartz reading plates with no lift,
            marine basalt ink, one shallow-tide green signal, and a single
            panoramic dune vista framing the entrance and the departure.
          </p>

          {/* Hero Vista Image Frame */}
          <div className={styles.heroVistaWrap}>
            <Image
              src="/brand/strand/strand-vista.webp"
              alt="Coastal sand dunes sloping down to the calm ocean tide under soft morning sunlight"
              width={1672}
              height={941}
              priority
              className={styles.heroVistaImg}
            />
            <div className={styles.heroVistaCaption}>
              <span>Plate 01 · Coastal Sand Dunes & Tidal Horizon</span>
              <span>Sampled Material: Silica Sand 98.4% · Marine Basalt</span>
            </div>
          </div>

          {/* Four Core Tenet Cards */}
          <div className={`${styles.cardGrid} ${styles.cardGrid3}`}>
            <div className={styles.card}>
              <span className={styles.sectionLabel}>01 · Material</span>
              <h3
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                }}
              >
                Quartz Sand Plate
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--st-muted)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                }}
              >
                Content never floats over busy imagery. All readable prose rests
                on solid quartz plates with an unyielding 16.5:1 contrast ratio.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.sectionLabel}>02 · Mark</span>
              <h3
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                }}
              >
                Dune Crest S
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--st-muted)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                }}
              >
                An architectural monogram cut by one shoreline at 7.1°, with a
                1.1-unit strand left open between the sand and the sea. Zero
                circles, fill-only, v3.0 craft pass.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.sectionLabel}>03 · Color Law</span>
              <h3
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                }}
              >
                5 + 1 Focal Budget
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--st-muted)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                }}
              >
                Sampled from coastal geology. The tide signal is budgeted to
                2% of the viewport — quietness is a ratio, not a mood.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 01: Foundation ────────────────────────────────────── */}
        <section id="foundation" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>01 / Foundation</span>
            <h2 className={styles.sectionTitle}>Six Architectural Decisions</h2>
            <p className={styles.sectionDesc}>
              Every rule in Strand exists to remove digital friction and
              preserve the calm of an open shoreline.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {DECISIONS.map((d) => (
              <div key={d.title} className={styles.decisionCard}>
                <h3 className={styles.decisionTitle}>{d.title}</h3>
                <div className={styles.decisionRow}>
                  <div className={styles.decisionHead}>Decision</div>
                  <p className={styles.decisionBody}>{d.decision}</p>
                </div>
                <div className={styles.decisionRow}>
                  <div className={styles.decisionHead}>Because</div>
                  <p className={styles.decisionBody}>{d.because}</p>
                </div>
                <div className={styles.decisionRow}>
                  <div className={styles.decisionHead}>Not When</div>
                  <p className={styles.decisionBody}>{d.notWhen}</p>
                </div>
                <div className={styles.decisionRow}>
                  <div className={styles.decisionHead}>Breaks Next</div>
                  <p className={styles.decisionBody}>{d.breaksNext}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cardGrid} style={{ marginTop: '1.5rem' }}>
            {STORY_BEATS.map((beat) => (
              <div key={beat.beat} className={styles.decisionCard}>
                <h3 className={styles.decisionTitle}>{beat.beat}</h3>
                <p className={styles.decisionBody}>{beat.line}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 02: Material & Palette ────────────────────────────── */}
        <section id="material" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>02 / Material & Colour</span>
            <h2 className={styles.sectionTitle}>
              The Coastal Shoreline Palette
            </h2>
            <p className={styles.sectionDesc}>
              Directly sampled from the attached coastal vista: bleached dune
              sand, dark basalt sea-stone, distant headland mist, and ocean
              surf.
            </p>
          </div>

          <div className={styles.paletteGrid}>
            {tokens.primitives.slice(0, 6).map((p) => (
              <div key={p.name} className={styles.swatchCard}>
                <div
                  className={styles.swatchColor}
                  style={{ background: p.value }}
                />
                <div className={styles.swatchMeta}>
                  <div className={styles.swatchName}>{p.name}</div>
                  <div className={styles.swatchHex}>{p.value}</div>
                  <p className={styles.swatchRole}>{p.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Measured Contrast Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Foreground</th>
                  <th>Background</th>
                  <th>Contrast Ratio</th>
                  <th>Role & Verification</th>
                </tr>
              </thead>
              <tbody>
                {tokens.contrast.map((c) => (
                  <tr key={c.label}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{c.fg}</span> (
                      {c.label.split(' on ')[0]})
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{c.bg}</span> (
                      {c.label.split(' on ')[1]})
                    </td>
                    <td className={styles.ratioPass}>{c.ratio}:1</td>
                    <td>{c.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 03: Marks ─────────────────────────────────────────── */}
        <section id="marks" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>03 / Marks</span>
            <h2 className={styles.sectionTitle}>The Tide Line Mark</h2>
            <p className={styles.sectionDesc}>
              Four movements instead of a contact sheet: the logo card, the
              wordmark scale, the construction drawing, and the one rule that
              keeps the mark intact.
            </p>
          </div>

          {/* Movement 1 — logo card */}
          <div className={styles.logoCard}>
            <div className={styles.logoCardPlate}>
              <StrandMark size={200} />
              <span className={styles.logoCardCaption}>
                Primary · 64 grid · 2 solids
              </span>
            </div>
            <div>
              <span className={styles.specLabel}>Movement 1 · Logo card</span>
              <h3 className={styles.logoCardTitle}>
                One letter, cut by the tide
              </h3>
              <p className={styles.logoCardText}>
                The S is a single carved monogram, not a letter wearing a badge.
                A shoreline crosses the whole letter at 7.1°, and everything
                below it is tide — so the accent is the lower 48% of the mark,
                not a shard resting on the arm. The cut itself is 1.1 units
                wide: sand and sea are held apart by the strand, which is what
                a strand is.
              </p>
              <div className={styles.specGrid}>
                {MARK_SPECS.map((s) => (
                  <div key={s.label} className={styles.specGridItem}>
                    <div className={styles.specGridLabel}>{s.label}</div>
                    <div className={styles.specGridValue}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Movement 2 — wordmark scale */}
          <div className={styles.movement}>
            <div className={styles.movementHead}>
              <span className={styles.movementIndex}>2</span>
              <h3 className={styles.movementTitle}>Wordmark scale</h3>
            </div>
            <p className={styles.movementNote}>
              The wordmark is outlined geometry, never live text — a missing
              webfont cannot change the logo. 14px is the floor; below that the
              lockup carries the name instead.
            </p>
            <div className={styles.wordScale}>
              {[
                { h: 40, cap: '40px · hero' },
                { h: 28, cap: '28px · default' },
                { h: 14, cap: '14px · minimum' },
              ].map((w) => (
                <div key={w.h} className={styles.wordScaleItem}>
                  <StrandWordmark height={w.h} />
                  <span className={styles.wordScaleCap}>{w.cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Movement 3 — construction */}
          <div className={styles.movement}>
            <div className={styles.movementHead}>
              <span className={styles.movementIndex}>3</span>
              <h3 className={styles.movementTitle}>Construction</h3>
            </div>
            <p className={styles.movementNote}>
              Everything sits on the 64 grid. The only number that is not a
              multiple of four is the shoreline drop, and that is the point: 8
              units across 64 is 7.1°, which reads as water rather than as a
              decorative diagonal.
            </p>
            <div className={styles.construction}>
              <div className={styles.constructionPlate}>
                <svg
                  className={styles.constructionSvg}
                  viewBox="0 0 64 64"
                  role="img"
                  aria-label="Construction drawing of the Strand mark on the 64 grid, with the shoreline marked"
                >
                  {[8, 16, 24, 32, 40, 48, 56].map((v) => (
                    <g key={v} stroke="var(--st-line)" strokeWidth="0.25">
                      <line x1={v} y1="0" x2={v} y2="64" />
                      <line x1="0" y1={v} x2="64" y2={v} />
                    </g>
                  ))}
                  <defs>
                    <clipPath id="strand-construction-s">
                      <path d={MARK_GEOMETRY.sPath} />
                    </clipPath>
                    <clipPath id="strand-construction-sea">
                      <path d={MARK_GEOMETRY.seaClip} />
                    </clipPath>
                  </defs>
                  <path
                    d={MARK_GEOMETRY.sPath}
                    fill="var(--st-fg)"
                    fillOpacity="0.07"
                  />
                  {/* The wash is the tide inside the letter, not a band across
                      the plate — clip it to the sea side of the strand or it
                      reads as a background. */}
                  <g clipPath="url(#strand-construction-s)">
                    <g clipPath="url(#strand-construction-sea)">
                      <path
                        d={MARK_GEOMETRY.sPath}
                        fill="var(--st-signal)"
                        fillOpacity="0.22"
                      />
                    </g>
                  </g>
                  <path
                    d={MARK_GEOMETRY.sPath}
                    fill="none"
                    stroke="var(--st-fg)"
                    strokeWidth="0.5"
                    strokeOpacity="0.7"
                  />
                  {/* The shoreline is the centre of the gap, not one of its
                      edges — draw the axis, so the 1.1-unit strand reads as
                      designed width rather than a seam. */}
                  <line
                    x1="0"
                    y1={MARK_GEOMETRY.waterY}
                    x2="64"
                    y2={MARK_GEOMETRY.waterY - MARK_GEOMETRY.waterDrop}
                    stroke="var(--st-signal)"
                    strokeWidth="0.5"
                    strokeDasharray="2 1.5"
                  />
                </svg>
              </div>
              <ol className={styles.constructionList}>
                <li className={styles.constructionItem}>
                  <span className={styles.constructionNum}>01</span>
                  <span className={styles.constructionText}>
                    <strong>Grid.</strong> The letter occupies 50 × 48 of the 64
                    box, which leaves 8 units of air on the long axis and 7 on
                    the short. <em>Nothing is optically nudged off the grid.</em>
                  </span>
                </li>
                <li className={styles.constructionItem}>
                  <span className={styles.constructionNum}>02</span>
                  <span className={styles.constructionText}>
                    <strong>Counters.</strong> Two openings, 5.2 and 8.5 units —
                    8.1% and 13.3% of the grid. Both clear the 8% floor, which is
                    why the S still reads as two openings at 16px.
                  </span>
                </li>
                <li className={styles.constructionItem}>
                  <span className={styles.constructionNum}>03</span>
                  <span className={styles.constructionText}>
                    <strong>Shoreline.</strong> One straight cut, 8 units of drop
                    across the full width — and the cut is 1.1 units wide. The
                    sand and the sea never touch: the strand is the gap between
                    them, not the seam where they meet.
                  </span>
                </li>
                <li className={styles.constructionItem}>
                  <span className={styles.constructionNum}>04</span>
                  <span className={styles.constructionText}>
                    <strong>Tide.</strong> Everything under the line is tide —
                    48% of the letter&rsquo;s ink. It is a region of the letter,
                    not an ornament sitting on top of it.
                  </span>
                </li>
                <li className={styles.constructionItem}>
                  <span className={styles.constructionNum}>05</span>
                  <span className={styles.constructionText}>
                    <strong>Compact.</strong> Below 32px a different drawing
                    takes over: one path, heavier stroke, no shoreline.{' '}
                    <em>Same letter, fewer claims.</em>
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* Movement 4 — one rule, drawn */}
          <div className={styles.movement}>
            <div className={styles.movementHead}>
              <span className={styles.movementIndex}>4</span>
              <h3 className={styles.movementTitle}>
                One rule: clear space and minimum size
              </h3>
            </div>
            <div className={styles.ruleGrid}>
              <div className={styles.ruleCard}>
                <span className={styles.ruleTag}>Clear space</span>
                <div className={styles.ruleStage}>
                  <span className={styles.clearSpaceBox}>
                    <StrandMark size={64} decorative />
                  </span>
                </div>
                <p className={styles.ruleText}>
                  Keep <strong>25% of the mark height</strong> clear on every
                  side. The dashed box is the margin itself, not a caption about
                  it — nothing enters, including the wordmark in a lockup.
                </p>
              </div>
              <div className={styles.ruleCard}>
                <span className={styles.ruleTag}>Minimum size</span>
                <div className={styles.ruleStage}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '2rem',
                    }}
                  >
                    <span className={styles.wordScaleItem}>
                      <StrandMark size={16} compact decorative />
                      <span className={styles.wordScaleCap}>16px mark</span>
                    </span>
                    <span className={styles.wordScaleItem}>
                      <StrandWordmark height={14} />
                      <span className={styles.wordScaleCap}>14px word</span>
                    </span>
                  </div>
                </div>
                <p className={styles.ruleText}>
                  The mark bottoms out at <strong>16px</strong> using the
                  compact drawing; the wordmark at <strong>14px</strong>. Two
                  tones at 16px is information the eye cannot use, so the
                  compact does not pretend to carry it.
                </p>
              </div>
            </div>
          </div>

          {/* Downloads Card */}
          <div
            className={styles.card}
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                Vector Assets Package
              </div>
              <div style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
                SVGs, Favicons, Brand Board and Standalone Form Kit
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="/brand/strand/mark.svg"
                download
                className={styles.btnSecondary}
                style={{ textDecoration: 'none' }}
              >
                Download mark.svg
              </a>
              <a
                href="/brand/strand/strand-brandkit.png"
                download
                className={styles.btnPrimary}
                style={{ textDecoration: 'none' }}
              >
                Brand Board PNG
              </a>
            </div>
          </div>
        </section>


        {/* ── Section 04: Horizon ───────────────────────────────────────── */}
        <section id="horizon" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>04 / Horizon</span>
            <h2 className={styles.sectionTitle}>One vista, two placements</h2>
            <p className={styles.sectionDesc}>
              The photograph is the system&rsquo;s only image. It appears twice
              and nowhere else: at the entrance and at the departure, with a
              caption that measures the place instead of naming it.
            </p>
          </div>

          <div className={styles.horizonGrid}>
            <div>
              {HORIZON_RULES.map((r) => (
                <div key={r.rule} className={styles.horizonRule}>
                  <h3 className={styles.horizonRuleTitle}>{r.rule}</h3>
                  <p className={styles.horizonRuleBody}>{r.decision}</p>
                  <p className={styles.horizonRuleBecause}>{r.because}</p>
                </div>
              ))}
            </div>

            <div>
              <span className={styles.sectionLabel}>Field image spec</span>
              <div className={styles.horizonSpec}>
                {HORIZON_SPEC.map((s) => (
                  <div key={s.key} className={styles.horizonSpecRow}>
                    <div className={styles.horizonSpecKey}>{s.key}</div>
                    <div className={styles.horizonSpecValue}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 05: Typography ────────────────────────────────────── */}
        <section id="type" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>05 / Typography</span>
            <h2 className={styles.sectionTitle}>
              Precision Meets Coastal Space
            </h2>
            <p className={styles.sectionDesc}>
              Display Syne for quiet architectural titles, Geist for body
              reading, and Geist Mono for exact measurements.
            </p>
          </div>

          <div className={styles.card}>
            <div
              style={{
                borderBottom: '1px solid var(--st-line)',
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className={styles.specLabel}>
                Display · Syne Bold 800 · -0.04em tracking · 0.96 leading
              </div>
              <div
                style={{
                  fontFamily: 'var(--st-font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  margin: '0.75rem 0',
                }}
              >
                The wind shapes the surface.
              </div>
            </div>
            <div>
              <div className={styles.specLabel}>
                Reading · Geist Regular 400 · 1.6 leading · 62ch measure
              </div>
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.6,
                  color: 'var(--st-fg)',
                  maxWidth: '62ch',
                  margin: '0.75rem 0 0',
                }}
              >
                Sand is not static; it is sculpted by the prevailing breeze into
                aerodynamic curves and sharp crests. In the same way, interfaces
                under Strand discard decorative weight so that user intent flows
                without obstruction across solid reading surfaces.
              </p>
            </div>
          </div>

          <div className={styles.tableWrap} style={{ marginTop: '1.5rem' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type Rule</th>
                  <th>Result</th>
                  <th>Implementation</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_GATE.map((t) => (
                  <tr key={t.rule}>
                    <td style={{ fontWeight: 600 }}>{t.rule}</td>
                    <td className={styles.ratioPass}>PASS</td>
                    <td>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 06: Forms & Interactive Demo ──────────────────────── */}
        <section id="forms" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>06 / Form Kit</span>
            <h2 className={styles.sectionTitle}>Accessible Native Controls</h2>
            <p className={styles.sectionDesc}>
              Cut from the same theme DNA as the S monogram: 10px radius, 1px
              sand-cut border, and a tide gap ring on focus — a plate-coloured
              spacer, not a glow. Test validation, inputs and state changes
              below.
            </p>
          </div>

          <FormDemo />
        </section>


        {/* ── Section 07: Motion ────────────────────────────────────────── */}
        <section id="motion" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>07 / Motion</span>
            <h2 className={styles.sectionTitle}>One ladder, one curve</h2>
            <p className={styles.sectionDesc}>
              Motion here is a duration and a property list, not a personality.
              Three steps, one easing, and nothing that moves the layout.
            </p>
          </div>

          <div className={styles.motionGrid}>
            {MOTION_RULES.map((m) => (
              <div key={m.rule} className={styles.motionCard}>
                <span className={styles.sectionLabel}>{m.rule}</span>
                <div className={styles.motionValue}>{m.value}</div>
                <p className={styles.motionNote}>{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 08: Budget ────────────────────────────────────────── */}
        <section id="budget" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>08 / Budget</span>
            <h2 className={styles.sectionTitle}>The 5 + 1 law, measured</h2>
            <p className={styles.sectionDesc}>
              Quietness is a ratio. These are the shares of a 1440 &times; 900
              viewport at the top of the page, and the signal is two percent of
              it.
            </p>
          </div>

          <div
            className={styles.budgetBar}
            role="img"
            aria-label={BUDGET.map((b) => `${b.name} ${b.share} percent`).join(', ')}
          >
            {BUDGET.map((b) => (
              <div
                key={b.name}
                className={styles.budgetSeg}
                style={{
                  flex: b.share,
                  background: b.swatch,
                  color:
                    b.token === '--st-fg'
                      ? 'var(--st-plate)'
                      : 'var(--st-fg)',
                }}
              >
                {b.share >= 6 ? `${b.share}%` : ''}
              </div>
            ))}
          </div>

          <div className={styles.budgetLegend}>
            {BUDGET.map((b) => (
              <div key={b.name} className={styles.budgetRow}>
                <div className={styles.budgetName}>
                  <span
                    className={styles.budgetDot}
                    style={{ background: b.swatch }}
                  />
                  {b.name}
                  <code className={styles.budgetToken}>{b.token}</code>
                </div>
                <div className={styles.budgetShare}>{b.share}%</div>
                <p className={styles.budgetNote}>{b.note}</p>
              </div>
            ))}
          </div>

          <ul className={styles.budgetRules}>
            {BUDGET_RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        {/* ── Section 10: Applications ──────────────────────────────────── */}
        <section id="applications" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>10 / Applications</span>
            <h2 className={styles.sectionTitle}>Component Proof in Context</h2>
            <p className={styles.sectionDesc}>
              Demonstrating the calm harmony of cards, status tags, action
              buttons, and metric callouts.
            </p>
          </div>

          <div className={`${styles.cardGrid} ${styles.cardGrid3}`}>
            <div className={styles.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span className={styles.heroTag} style={{ margin: 0 }}>
                  Active Basin
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--st-font-mono)',
                    color: 'var(--st-muted)',
                  }}
                >
                  08:42 AM
                </span>
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--st-font-display)',
                  margin: '0 0 0.25rem',
                }}
              >
                98.4%
              </div>
              <div style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
                Silica Quartz Purity
              </div>
            </div>

            <div className={styles.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span className={styles.heroTag} style={{ margin: 0 }}>
                  Tidal Cycle
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--st-font-mono)',
                    color: 'var(--st-muted)',
                  }}
                >
                  GMT+7
                </span>
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--st-font-display)',
                  margin: '0 0 0.25rem',
                }}
              >
                +1.4 m
              </div>
              <div style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
                Ebb to Shoreline Slack
              </div>
            </div>

            <div className={styles.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span className={styles.heroTag} style={{ margin: 0 }}>
                  Audit Pass
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--st-font-mono)',
                    color: 'var(--st-muted)',
                  }}
                >
                  v2.5
                </span>
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--st-font-display)',
                  margin: '0 0 0.25rem',
                }}
              >
                16.5 : 1
              </div>
              <div style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
                Contrast Margin Level
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 09: Tokens ────────────────────────────────────────── */}
        <section id="tokens" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>09 / Tokens</span>
            <h2 className={styles.sectionTitle}>CSS Custom Properties</h2>
            <p className={styles.sectionDesc}>
              124 token declarations namespaced under --st-*. Primitive,
              semantic, and component levels.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Role</th>
                  <th>Copy</th>
                </tr>
              </thead>
              <tbody>
                {tokens.semantic.light.map((t) => (
                  <tr key={t.name}>
                    <td
                      style={{
                        fontFamily: 'var(--st-font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      --st-{t.name}
                    </td>
                    <td
                      style={{
                        fontFamily: 'var(--st-font-mono)',
                        color: 'var(--st-muted)',
                      }}
                    >
                      {t.value}
                    </td>
                    <td>{t.role}</td>
                    <td>
                      <CopyButton text={`var(--st-${t.name})`} label="Copy" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 11: Honest Audit ──────────────────────────────────── */}
        <section id="audit" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>11 / Audit</span>
            <h2 className={styles.sectionTitle}>Verification & Gate Status</h2>
            <p className={styles.sectionDesc}>
              Zero-claim verification: every rule is measured against the code,
              the SVGs and a browser. The detach gate is run against the weakest
              neighbour, not the average.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Gate Rule</th>
                  <th>Result</th>
                  <th>Verification Note</th>
                </tr>
              </thead>
              <tbody>
                {MARK_GATE.map((r) => (
                  <tr key={r.rule}>
                    <td style={{ fontWeight: 600 }}>{r.rule}</td>
                    <td className={styles.ratioPass}>PASS</td>
                    <td>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableWrap} style={{ marginTop: '1.5rem' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Detach gate</th>
                  <th>v1.0</th>
                  <th>v1.1</th>
                  <th>Finding</th>
                </tr>
              </thead>
              <tbody>
                {DETACH_SCORES.map((r) => {
                  const fell = r.after < r.before
                  return (
                    <tr key={r.ref}>
                      <td style={{ fontWeight: 600 }}>{r.ref}</td>
                      <td
                        style={{
                          fontFamily: 'var(--st-font-mono)',
                          color:
                            r.before < 70
                              ? 'var(--st-danger)'
                              : 'var(--st-muted)',
                        }}
                      >
                        {r.before}
                      </td>
                      <td
                        className={fell ? styles.ratioHeld : styles.ratioPass}
                        style={{ fontFamily: 'var(--st-font-mono)' }}
                      >
                        {r.after}
                        {fell && (
                          <span className={styles.ratioArrow}> ↓</span>
                        )}
                      </td>
                      <td>{r.finding}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p
            style={{
              margin: '0.75rem 0 0',
              fontSize: '0.8125rem',
              lineHeight: 1.55,
              color: 'var(--st-muted)',
            }}
          >
            Green clears the 70-point gate. Amber clears it too, but lost
            ground against that neighbour — the move to tide green bought
            separation from Cove and spent it against Clearing. Red was below
            the gate in v1.0.
          </p>

          <div className={styles.card} style={{ marginTop: '1.5rem' }}>
            <div
              className={styles.specLabel}
              style={{ marginBottom: '0.5rem' }}
            >
              Known Gaps & Truthful Disclosures
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.25rem',
                color: 'var(--st-muted)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
              }}
            >
              {GAPS.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>

          <div className={styles.tableWrap} style={{ marginTop: '1.5rem' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Output</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {OUTPUT_CONTRACT.map((o) => (
                  <tr key={o.path}>
                    <td>
                      <code style={{ fontSize: '0.8125rem' }}>{o.path}</code>
                    </td>
                    <td>{o.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── Footer Vista Departure ──────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.shell}>
          {/* Footer Vista Image Frame */}
          <div className={styles.footerVistaWrap}>
            <Image
              src="/brand/strand/strand-vista.webp"
              alt="Panoramic view across sand dunes to the quiet ocean horizon"
              width={1672}
              height={941}
              className={styles.footerVistaImg}
            />
            <div className={styles.footerVistaOverlay}>
              <div className={styles.footerVistaQuote}>
                Where the dunes meet the tide.
              </div>
              <p className={styles.footerVistaSub}>
                Strand Design System · Case 07 · End of the coastline.
              </p>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <StrandLockup />
              <span className={styles.footerNote}>
                Case 07 · Sunnyside Portfolio
              </span>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
            >
              <a href="#top" className={styles.footerLink}>
                Back to top ↑
              </a>
              <Link href="/design-system" className={styles.footerLink}>
                All Design Systems ↗
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
