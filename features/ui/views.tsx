import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './components/ui'
import { ComponentDemo } from './components/component-demo'
import { CopyButton } from './components/copy-button'
import { DocsShell } from './components/docs-shell'
import {
  componentDocs,
  componentGroups,
  type ComponentDoc,
} from './docs/registry'
import styles from './ui-docs.module.css'

export function UiCatalogPage() {
  return (
    <DocsShell>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Component library · Side A</p>
        <h1>
          Useful parts.
          <br />
          <em>Sunny edges.</em>
        </h1>
        <p className={styles.heroCopy}>
          Production-ready React primitives shaped by Sunnyside: warm paper,
          crisp ink, one disciplined cobalt, and motion that explains what
          changed.
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.metaPill}>20 components</span>
          <span className={styles.metaPill}>Radix behavior</span>
          <span className={styles.metaPill}>Copyable source</span>
          <span className={styles.metaPill}>WCAG-minded</span>
        </div>
      </section>
      {componentGroups.map((group, groupIndex) => {
        const items = componentDocs.filter((item) => item.group === group)
        const offset = componentDocs.findIndex((item) => item.group === group)
        return (
          <section
            className={styles.section}
            key={group}
            aria-labelledby={`group-${groupIndex}`}
          >
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.eyebrow}>
                  Collection {String(groupIndex + 1).padStart(2, '0')}
                </p>
                <h2 id={`group-${groupIndex}`}>{group}</h2>
              </div>
              <span className={styles.sectionIndex}>
                {items.length} {items.length === 1 ? 'part' : 'parts'}
              </span>
            </div>
            <div className={styles.componentGrid}>
              {items.map((item, index) => (
                <article className={styles.componentCard} key={item.slug}>
                  <div className={styles.cardPreview} aria-hidden="true" inert>
                    <ComponentDemo slug={item.slug} compact />
                  </div>
                  <div className={styles.cardInfo}>
                    <div>
                      <h3>
                        <Link
                          className={styles.cardLink}
                          href={`/ui/components/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p>{item.summary}</p>
                    </div>
                    <span className={styles.cardNumber}>
                      {String(offset + index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </DocsShell>
  )
}

export function UiComponentPage({ component }: { component: ComponentDoc }) {
  const code =
    component.slug === 'button'
      ? `<Button variant="primary">Save changes</Button>`
      : component.slug === 'select'
        ? `<Select defaultValue="studio">\n  <SelectItem value="studio">Sunnyside Studio</SelectItem>\n  <SelectItem value="archive">Archive Room</SelectItem>\n</Select>`
        : component.usage

  return (
    <DocsShell activeSlug={component.slug}>
      <section className={styles.detailHero}>
        <Link className={styles.backLink} href="/ui">
          <ArrowLeft size={14} />
          All components
        </Link>
        <p className={cn(styles.eyebrow, styles.detailEyebrow)}>
          {component.group}
        </p>
        <h1>{component.name}</h1>
        <p className={styles.detailLead}>{component.description}</p>
      </section>
      <div className={styles.detailGrid}>
        <article className={styles.detailMain}>
          <section className={styles.demoPanel} aria-labelledby="preview-title">
            <div className={styles.demoToolbar}>
              <div className={styles.demoDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <span className={styles.meta} id="preview-title">
                Interactive preview
              </span>
            </div>
            <ComponentDemo slug={component.slug} />
          </section>
          <section
            className={styles.docSection}
            aria-labelledby="install-title"
          >
            <h2 id="install-title">Import</h2>
            <p>
              The public feature boundary keeps application imports stable and
              makes a later standalone package extraction mechanical.
            </p>
            <pre className={styles.codeBlock}>
              <code>{component.importLine}</code>
            </pre>
            <div className={styles.copyRow}>
              <CopyButton value={component.importLine} label="Copy import" />
            </div>
          </section>
          <section className={styles.docSection} aria-labelledby="usage-title">
            <h2 id="usage-title">Usage</h2>
            <pre className={styles.codeBlock}>
              <code>{code}</code>
            </pre>
            <div className={styles.copyRow}>
              <CopyButton value={code} />
            </div>
          </section>
          <section className={styles.docSection} aria-labelledby="access-title">
            <h2 id="access-title">Accessibility</h2>
            <p>{component.accessibility}</p>
          </section>
        </article>
        <aside className={styles.detailAside}>
          <div className={styles.asideCard}>
            <h2>Component notes</h2>
            <dl className={styles.asideList}>
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge tone="success">Ready</Badge>
                </dd>
              </div>
              <div>
                <dt>States shown</dt>
                <dd>
                  <ul className={styles.stateList}>
                    {component.states.map((state) => (
                      <li key={state}>
                        <Badge>{state}</Badge>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Motion</dt>
                <dd>
                  160–220ms feedback. Transform and opacity only. Reduced motion
                  removes travel.
                </dd>
              </div>
              <div>
                <dt>Source model</dt>
                <dd>
                  Native HTML where it holds; Radix where focus, collision, or
                  keyboard behavior is expensive.
                </dd>
              </div>
            </dl>
            <Link
              className={cn(styles.backLink, styles.asideBackLink)}
              href="/sunnyside"
            >
              Read foundations <ArrowUpRight size={13} />
            </Link>
          </div>
        </aside>
      </div>
    </DocsShell>
  )
}
