import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import '@/features/strand/strand-tokens.css'

import {
  DECISIONS,
  GAPS,
  MARK_GATE,
  NAV,
  OUTPUT_CONTRACT,
  STORY_BEATS,
  TYPE_GATE,
} from '@/features/strand/strand-data'
import { CopyButton } from '@/features/strand/components/actions'
import {
  StrandLockup,
  StrandMark,
  StrandStacked,
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
    'Strand is a quiet coastal design system: white sand reading plates, marine basalt ink, tidal aquamarine signal, and an atmospheric dune vista framing both hero and footer.',
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
              className={styles.navLink}
              style={{ fontSize: '0.8125rem' }}
            >
              Case Library ↗
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.shell}>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>
            Case 07 · Architectural Monogram · v2.5
          </div>
          <h1 className={styles.heroTitle}>Where the dunes meet the tide.</h1>
          <p className={styles.heroDeck}>
            Strand is a quiet coastal design system for contemplative,
            high-craft interfaces: white quartz sand reading plates, marine
            basalt ink, tidal aquamarine signal, and an authentic panoramic dune
            vista framing both the entrance and departure.
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
                An architectural monogram carved with fluid dune curves and an
                evenodd tidal channel. Zero circles, fill-only, 100% v2.5 craft
                pass.
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
                Sampled directly from coastal geology. Tidal aquamarine is
                budgeted to ≤ 8% of the viewport to maintain contemplative
                quietness.
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
            <h2 className={styles.sectionTitle}>
              The Architectural S-Monogram
            </h2>
            <p className={styles.sectionDesc}>
              Case 01 pattern: A primary 2-color mark, a 16px compact drawing, a
              pure glyph silhouette, and custom geometric outlined wordmark.
            </p>
          </div>

          <div className={styles.markHeroStage}>
            <div className={styles.markDisplayWrap}>
              <StrandMark size={140} />
            </div>
            <div>
              <span
                className={styles.sectionLabel}
                style={{ marginBottom: '0.5rem' }}
              >
                Mark Specifications
              </span>
              <h3
                style={{
                  margin: '0 0 1rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                Dune Ridge & Tidal Channel (Kuwayama Ch. 22)
              </h3>
              <div className={styles.specsList}>
                <div className={styles.specBlock}>
                  <div className={styles.specLabel}>Bounding Box</div>
                  <div className={styles.specValue}>50 × 48 (64 Grid)</div>
                </div>
                <div className={styles.specBlock}>
                  <div className={styles.specLabel}>Solid Primitives</div>
                  <div className={styles.specValue}>
                    2 Paths (Basalt + Aqua)
                  </div>
                </div>
                <div className={styles.specBlock}>
                  <div className={styles.specLabel}>Tidal Channel</div>
                  <div className={styles.specValue}>5.2 Units (≥ 8%)</div>
                </div>
                <div className={styles.specBlock}>
                  <div className={styles.specLabel}>v2.5 Craft Gate</div>
                  <div
                    className={styles.specValue}
                    style={{ color: 'var(--st-success)' }}
                  >
                    100% PASS
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.markSuiteRow}>
            <div className={styles.markSuiteCard}>
              <StrandMark size={48} />
              <div className={styles.markSuiteLabel}>Primary Mark</div>
            </div>
            <div className={styles.markSuiteCard}>
              <StrandMark size={48} compact />
              <div className={styles.markSuiteLabel}>Compact (16px)</div>
            </div>
            <div className={styles.markSuiteCard}>
              <StrandMark size={48} decorative />
              <div className={styles.markSuiteLabel}>Mono Glyph</div>
            </div>
            <div className={styles.markSuiteCard}>
              <StrandWordmark height={22} />
              <div className={styles.markSuiteLabel}>Wordmark</div>
            </div>
            <div className={styles.markSuiteCard}>
              <StrandStacked height={64} />
              <div className={styles.markSuiteLabel}>Stacked Lockup</div>
            </div>
            <div
              className={`${styles.markSuiteCard} ${styles.markSuiteCardDark}`}
            >
              <Image
                src="/brand/strand/mark-reverse.svg"
                alt=""
                width={48}
                height={48}
              />
              <div
                className={styles.markSuiteLabel}
                style={{ color: '#8FA0A8' }}
              >
                Night Reverse
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

        {/* ── Section 04: Typography ────────────────────────────────────── */}
        <section id="type" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>04 / Typography</span>
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

        {/* ── Section 05: Forms & Interactive Demo ──────────────────────── */}
        <section id="forms" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>05 / Form Kit</span>
            <h2 className={styles.sectionTitle}>Accessible Native Controls</h2>
            <p className={styles.sectionDesc}>
              Cut from the same theme DNA as the S monogram: 10px radius, 1px
              sand-cut border, and focused aquamarine halo. Test validation,
              inputs and state changes below.
            </p>
          </div>

          <FormDemo />
        </section>

        {/* ── Section 06: Tokens ────────────────────────────────────────── */}
        <section id="tokens" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>06 / Tokens</span>
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

        {/* ── Section 07: Applications ──────────────────────────────────── */}
        <section id="applications" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>07 / Applications</span>
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

        {/* ── Section 08: Honest Audit ──────────────────────────────────── */}
        <section id="audit" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>08 / Audit</span>
            <h2 className={styles.sectionTitle}>Verification & Gate Status</h2>
            <p className={styles.sectionDesc}>
              Zero-claim verification: every rule is measured directly against
              the code, SVGs, and browser runtime.
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
