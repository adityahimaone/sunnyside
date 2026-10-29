import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  SunnysideMark,
  SunnysideWordmark,
} from '@/components/ui/sunnyside-logo'
import layout from '@/features/archive/archive.module.css'
import { cn } from '@/lib/utils'

import { CopyCommand } from './copy-command'
import { CodeText } from './code-text'
import { DocsHeading } from './docs-heading'
import { DocsNav, type DocsNavItem } from './docs-nav'
import {
  AGENT_SKILLS,
  BRAND_SKILL,
  CAPABILITIES,
  CASE,
  CASE_FINDINGS,
  CASE_STATS,
  CASES,
  GAPS,
  LOOP,
  PRACTICE,
  PRINCIPLES,
  RESOURCES,
  STANDARDS,
  SYSTEM,
} from './design-engineering-data'
import { LEARNING_TRACKS } from './learning-data'
import styles from './design-engineering.module.css'

const NAV: DocsNavItem[] = [
  { href: '#overview', label: 'Overview', number: '00', sectionId: 'overview' },
  {
    href: '#practice',
    label: 'The practice',
    number: '01',
    sectionId: 'practice',
  },
  {
    href: '#standards',
    label: 'Standards',
    number: '02',
    sectionId: 'standards',
  },
  { href: '#system', label: 'The system', number: '03', sectionId: 'system' },
  { href: '#case', label: 'The cases', number: '04', sectionId: 'case' },
  {
    href: '#case-findings',
    label: 'What they prove',
    number: '04b',
    sectionId: 'case-findings',
  },
  {
    href: '#case-deep',
    label: 'Sunnyside in full',
    number: '04c',
    sectionId: 'case-deep',
  },
  { href: '#skills', label: 'Capabilities', number: '05', sectionId: 'skills' },
  { href: '#skill', label: 'The skill', number: '06', sectionId: 'skill' },
  {
    href: '/design-engineering/learning',
    label: 'Field notes',
    number: '07',
  },
  {
    href: '#resources',
    label: 'Sources',
    number: '08',
    sectionId: 'resources',
  },
]

function SmartLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  if (href.startsWith('http') || href.startsWith('/brand/')) {
    return (
      <a
        href={href}
        className={className}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        download={href.startsWith('/brand/') ? true : undefined}
      >
        {children}
        <ArrowUpRight className={styles.linkIcon} aria-hidden />
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight className={styles.linkIcon} aria-hidden />
    </Link>
  )
}

function Table({
  caption,
  head,
  rows,
  className,
}: {
  caption: string
  head: string[]
  rows: ReactNode[][]
  className?: string
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={cn(styles.table, className)}>
        <caption className={styles.srOnly}>{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} data-label={head[cellIndex]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DesignEngineeringPage() {
  return (
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <div className={styles.docs}>
          <DocsNav
            title="Design engineering"
            subtitle="Field manual / v2.0"
            items={NAV}
            markdownHref="/design-engineering/llms.txt"
            footerLabel="Open the system"
            footerHref="/sunnyside"
          />

          <article className={styles.doc}>
            <header className={styles.docHeader} id="overview">
              <p className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span>/</span>
                Design engineering
              </p>
              <p className={styles.kicker}>Field manual · v2.0 · 2026</p>
              <h1>Design engineering</h1>
              <p className={styles.lede}>{PRACTICE.standfirst}</p>
              <p className={styles.intro}>{PRACTICE.intro}</p>

              <div className={styles.metaRow}>
                <span>Updated 2026</span>
                <span>~18 min read</span>
                <span>For humans and agents</span>
                <a href="/design-engineering/llms.txt">Read as Markdown</a>
              </div>
            </header>

            <section className={styles.docSection}>
              <DocsHeading id="practice" kicker="01 / Practice">
                The practice
              </DocsHeading>
              <p className={styles.prose}>{PRACTICE.body}</p>

              <DocsHeading id="loop" level={3} kicker="The loop">
                How the work moves
              </DocsHeading>
              <ol className={styles.steps}>
                {LOOP.map((step) => (
                  <li key={step.number}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <div>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p>{step.line}</p>
                      <p className={styles.example}>
                        <b>Sunnyside</b>
                        <CodeText>{step.example}</CodeText>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <DocsHeading id="principles" level={3} kicker="The rules">
                What survives a deadline
              </DocsHeading>
              <ul className={styles.principles}>
                {PRINCIPLES.map((principle) => (
                  <li key={principle.number}>
                    <span>{principle.number}</span>
                    <div>
                      <b>{principle.title}</b>
                      <p>{principle.line}</p>
                      {principle.origin ? (
                        <small>{principle.origin}</small>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.docSection}>
              <DocsHeading id="standards" kicker="02 / Standards">
                The standards
              </DocsHeading>
              <p className={styles.prose}>
                The checks that keep a page legible after the moodboard leaves
                the room. Each one names the artefact it is judged against.
              </p>

              {STANDARDS.map((standard) => (
                <section
                  key={standard.number}
                  className={styles.standard}
                  aria-labelledby={`standard-${standard.number}`}
                >
                  <DocsHeading
                    id={`standard-${standard.number}`}
                    level={3}
                    kicker={`${standard.number} / ${standard.file}`}
                  >
                    {standard.title}
                  </DocsHeading>
                  <p>{standard.line}</p>
                  <ul className={styles.checks}>
                    {standard.checks.map((check) => (
                      <li key={check}>
                        <Check className={styles.checkIcon} aria-hidden />
                        <CodeText>{check}</CodeText>
                      </li>
                    ))}
                  </ul>
                  <SmartLink
                    href={standard.source.href}
                    className={styles.sourceLink}
                  >
                    {standard.source.label}
                  </SmartLink>
                </section>
              ))}
            </section>

            <section className={styles.docSection}>
              <DocsHeading id="system" kicker="03 / System">
                The system
              </DocsHeading>
              <p className={styles.prose}>{SYSTEM.lede}</p>

              <figure className={styles.figure}>
                <div className={styles.lockupFigure}>
                  <SunnysideMark className={styles.figureMark} />
                  <div>
                    <SunnysideWordmark className={styles.figureWord} />
                    <span className={styles.figureName}>Aditya Himawan</span>
                  </div>
                </div>
                <figcaption>
                  The mark is the sun from the sticker drawer; the wordmark is
                  the marker hand. Both are drawn, not sourced.
                </figcaption>
              </figure>

              <DocsHeading id="system-colour" level={3} kicker="Colour">
                One paper, one loud field
              </DocsHeading>
              <Table
                caption="Sunnyside colour tokens"
                head={['Swatch', 'Token', 'Hex', 'Role']}
                rows={SYSTEM.swatches.map((swatch) => [
                  <span
                    key={swatch.name}
                    className={styles.swatch}
                    style={{ background: swatch.hex }}
                    aria-hidden
                  />,
                  <span
                    key={`${swatch.name}-token`}
                    className={styles.tokenCell}
                  >
                    <b>{swatch.name}</b>
                    <code>{swatch.token}</code>
                  </span>,
                  <code key={`${swatch.name}-hex`}>{swatch.hex}</code>,
                  swatch.role,
                ])}
              />

              <DocsHeading id="system-type" level={3} kicker="Type">
                Four voices, one hierarchy
              </DocsHeading>
              <Table
                caption="Sunnyside type voices"
                head={['Role', 'Face', 'Specimen']}
                rows={SYSTEM.voices.map((voice) => [
                  voice.role,
                  <b key={voice.name}>{voice.name}</b>,
                  <span key={voice.sample} className={styles.typeSample}>
                    {voice.sample}
                  </span>,
                ])}
              />

              <DocsHeading id="system-chain" level={3} kicker="The chain">
                Primitive → page
              </DocsHeading>
              <ol className={styles.chain}>
                {SYSTEM.chain.map((item, index) => (
                  <li key={item.label}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <b>{item.label}</b>
                    <p>{item.line}</p>
                  </li>
                ))}
              </ol>

              <div className={styles.linkRow}>
                {SYSTEM.links.map((link) => (
                  <SmartLink
                    key={link.href}
                    href={link.href}
                    className={styles.textLink}
                  >
                    {link.label}
                  </SmartLink>
                ))}
              </div>
            </section>

            <section className={styles.docSection}>
              <DocsHeading id="case" kicker="04 / Cases">
                Eight cases, one method
              </DocsHeading>
              <p className={styles.caseLede}>
                Every case in the library is a whole identity: a mark system, a
                token layer, a proof page, a board and an audit. They are not
                eight variations on one theme — they are eight answers to eight
                different briefs, and the distance between them is the work.
              </p>

              <div className={styles.caseStats}>
                {CASE_STATS.map((stat) => (
                  <div key={stat.label} className={styles.caseStat}>
                    <b>{stat.value}</b>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className={styles.caseGrid}>
                {CASES.map((item) => (
                  <Link
                    key={item.number}
                    href={item.href}
                    className={styles.caseCard}
                  >
                    <span className={styles.caseCardMedia}>
                      <Image
                        src={item.cover}
                        alt={item.coverAlt}
                        width={1500}
                        height={1125}
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px"
                      />
                    </span>
                    <span className={styles.caseCardBody}>
                      <span className={styles.caseCardTop}>
                        <span className={styles.caseCardNumber}>
                          {item.number}
                        </span>
                        <span className={styles.caseCardTrack}>
                          {item.track}
                        </span>
                      </span>
                      <b className={styles.caseCardName}>{item.name}</b>
                      <span className={styles.caseCardTagline}>
                        {item.tagline}
                      </span>
                      <span className={styles.caseCardMeta}>
                        <span className={styles.caseCardSignal}>
                          <i style={{ background: item.signal }} aria-hidden />
                          {item.signalName}
                        </span>
                        <span>{item.material}</span>
                        <span>{item.display}</span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <DocsHeading
                id="case-findings"
                level={3}
                kicker="What they prove"
              >
                Eight findings, each with a case behind it
              </DocsHeading>
              <p className={styles.prose}>
                A portfolio of systems is only worth reading if it can say what
                the eight have in common and where they disagree. These are the
                claims the cases actually support — including the two that are
                failures.
              </p>

              <ol className={styles.findings}>
                {CASE_FINDINGS.map((finding) => (
                  <li key={finding.number}>
                    <span className={styles.findingNumber}>
                      {finding.number}
                    </span>
                    <div>
                      <b>{finding.claim}</b>
                      <p>{finding.evidence}</p>
                      <small>Cases {finding.case}</small>
                    </div>
                  </li>
                ))}
              </ol>

              <DocsHeading id="case-deep" level={3} kicker="The worked example">
                Sunnyside, from brief to browser
              </DocsHeading>
              <p className={styles.prose}>
                One case in full, because the grid shows the range and the range
                is not the method. The other seven are on their own pages, with
                their own decisions and their own audits.
              </p>

              <p className={styles.caseLede}>{CASE.subtitle}</p>

              <dl className={styles.caseMeta}>
                <div>
                  <dt>Role</dt>
                  <dd>{CASE.role}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{CASE.status}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>Next.js · TypeScript · CSS Modules · Cloudflare</dd>
                </div>
                <div>
                  <dt>System</dt>
                  <dd>One paper world, the archive rooms, one specimen</dd>
                </div>
              </dl>

              <figure className={styles.figure}>
                <Image
                  src={CASE.cover}
                  alt={CASE.coverAlt}
                  width={2000}
                  height={1500}
                  sizes="(max-width: 900px) 100vw, 760px"
                />
                <figcaption>
                  The brand kit — board, mark and favicon family. Rendered from
                  HTML, not generated as one image.
                </figcaption>
              </figure>

              <DocsHeading id="case-brief" level={3} kicker="Brief">
                What it had to do
              </DocsHeading>
              <p className={styles.prose}>{CASE.brief}</p>

              <DocsHeading id="case-constraints" level={3} kicker="Constraints">
                The edges
              </DocsHeading>
              <ul className={styles.list}>
                {CASE.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>

              <DocsHeading id="case-decisions" level={3} kicker="Decisions">
                What I chose
              </DocsHeading>
              <ol className={styles.decisions}>
                {CASE.decisions.map((decision, index) => (
                  <li key={decision.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <b>{decision.title}</b>
                      <p>
                        <CodeText>{decision.line}</CodeText>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <DocsHeading id="case-outcome" level={3} kicker="Outcome">
                What shipped
              </DocsHeading>
              <ul className={styles.list}>
                {CASE.outcomes.map((outcome) => (
                  <li key={outcome} className={styles.checkLine}>
                    <Check className={styles.checkIcon} aria-hidden />
                    {outcome}
                  </li>
                ))}
              </ul>

              <DocsHeading id="case-evidence" level={3} kicker="Evidence">
                Open the files
              </DocsHeading>
              <ul className={styles.evidence}>
                {CASE.evidence.map((item) => (
                  <li key={item.label}>
                    <SmartLink href={item.href} className={styles.evidenceLink}>
                      {item.label}
                    </SmartLink>
                    <span>{item.note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.docSection}>
              <DocsHeading id="skills" kicker="05 / Capabilities">
                What is actually in the bag
              </DocsHeading>
              <p className={styles.prose}>
                A capability with evidence, and the next gap beside it. A skill
                list without a shipped artefact is a horoscope.
              </p>

              <Table
                caption="Capabilities, evidence and next steps"
                head={['Capability', 'Evidence', 'Next']}
                rows={CAPABILITIES.map((capability) => [
                  <div key={capability.id}>
                    <span className={styles.rowNumber}>
                      {capability.number}
                    </span>
                    <b>{capability.title}</b>
                    <p className={styles.rowNote}>{capability.line}</p>
                  </div>,
                  <CodeText key={`${capability.id}-evidence`}>
                    {capability.evidence}
                  </CodeText>,
                  <CodeText key={`${capability.id}-next`}>
                    {capability.next}
                  </CodeText>,
                ])}
              />

              <DocsHeading id="gaps" level={3} kicker="Honest gaps">
                What this example has not solved
              </DocsHeading>
              <div className={styles.gapCallout}>
                <p>
                  The page is more useful when it names the holes. These are the
                  next moves, not a disclaimer.
                </p>
                <ul>
                  {GAPS.map((gap) => (
                    <li key={gap.label}>
                      <b>{gap.label}</b>
                      <span>{gap.line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <DocsHeading id="agents" level={3} kicker="Agent stack">
                Tools, not a personality
              </DocsHeading>
              <p className={styles.prose}>
                The skills that changed the workflow in this workspace. They
                draft, check and challenge; the judgement stays human.
              </p>
              <Table
                caption="Agent skills used in this workspace"
                head={['Tool', 'Use', 'Source']}
                rows={AGENT_SKILLS.map((skill) => [
                  <code key={skill.name}>{skill.name}</code>,
                  skill.use,
                  <span key={`${skill.name}-note`} className={styles.rowNote}>
                    {skill.note}
                  </span>,
                ])}
              />
              <div className={styles.linkRow}>
                <SmartLink
                  href="https://skills.sh/"
                  className={styles.textLink}
                >
                  Browse the skill catalogue
                </SmartLink>
              </div>
            </section>

            <section className={styles.docSection}>
              <DocsHeading id="skill" kicker="06 / Skill">
                Take the method with you
              </DocsHeading>
              <p className={styles.prose}>{BRAND_SKILL.description}</p>
              <p className={styles.prose}>
                v3.1 is the first version written from shipped evidence rather
                than from a survey. The eight cases above are the source: every
                gate in the skill failed something in one of them, every
                immersive recipe was proved on a real page, and the two
                references that never earned a citation were removed. It reads
                as one file, not twenty.
              </p>

              <div className={styles.install}>
                <div className={styles.installHead}>
                  <span>Install</span>
                  <CopyCommand text={BRAND_SKILL.install} />
                </div>
                <pre tabIndex={0}>
                  <code>{BRAND_SKILL.install}</code>
                </pre>
              </div>

              <DocsHeading id="skill-inside" level={3} kicker="Inside">
                What is in the package
              </DocsHeading>
              <ul className={styles.list}>
                {BRAND_SKILL.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.linkRow}>
                <SmartLink href={BRAND_SKILL.file} className={styles.textLink}>
                  Read SKILL.md
                </SmartLink>
                <SmartLink href={BRAND_SKILL.repo} className={styles.textLink}>
                  Browse the package
                </SmartLink>
                <SmartLink
                  href="https://skills.sh/"
                  className={styles.textLink}
                >
                  skills.sh
                </SmartLink>
              </div>
            </section>

            <section className={styles.learningCallout}>
              <DocsHeading id="learning" kicker="07 / Learning">
                Field notes
              </DocsHeading>
              <p>
                Pen.dev first, Figma for the handoff, Craft for the second look.
                The notes are written to be tried in a spike, not admired.
              </p>
              <div className={styles.trackLinks}>
                {LEARNING_TRACKS.map((track) => (
                  <Link
                    key={track.id}
                    href={`/design-engineering/learning#${track.id}`}
                  >
                    <span>{track.number}</span>
                    {track.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/design-engineering/learning"
                className={styles.primary}
              >
                Open the field notes
                <ArrowRight className={styles.linkIcon} aria-hidden />
              </Link>
            </section>

            <section className={styles.docSection}>
              <DocsHeading id="resources" kicker="08 / Resources">
                Sources
              </DocsHeading>
              <p className={styles.prose}>
                A short shelf, not a link dump. Each one earns its place in the
                loop; the note says which part.
              </p>
              <Table
                caption="Sources and references"
                head={['Type', 'Resource', 'Note']}
                rows={RESOURCES.map((resource) => [
                  <span
                    key={`${resource.label}-group`}
                    className={styles.resourceGroup}
                  >
                    {resource.group}
                  </span>,
                  <a
                    key={resource.label}
                    href={resource.href}
                    className={styles.resourceLink}
                    target={
                      resource.href.startsWith('http') ? '_blank' : undefined
                    }
                    rel={
                      resource.href.startsWith('http')
                        ? 'noreferrer'
                        : undefined
                    }
                  >
                    {resource.label}
                    <ArrowUpRight className={styles.linkIcon} aria-hidden />
                  </a>,
                  resource.note,
                ])}
              />

              <p className={styles.backTop}>
                <a href="#overview">Back to top</a>
                <span>·</span>
                <a href="/design-engineering/llms.txt">Read as Markdown</a>
              </p>
            </section>
          </article>
        </div>
      </div>
    </main>
  )
}
