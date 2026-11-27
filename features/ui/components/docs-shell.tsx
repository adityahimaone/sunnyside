'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { componentDocs, componentGroups } from '../docs/registry'
import styles from '../ui-docs.module.css'

export function DocsShell({
  children,
  activeSlug,
}: {
  children: React.ReactNode
  activeSlug?: string
}) {
  const [query, setQuery] = React.useState('')
  const normalized = query.trim().toLowerCase()

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#ui-main">
        Skip to content
      </a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/ui">
          <span className={styles.brandMark}>S</span>
          <span className={styles.brandText}>
            <strong>Sunnyside UI</strong>
            <span>Components · v1.0</span>
          </span>
        </Link>
        <nav
          className={styles.headerActions}
          aria-label="Related design resources"
        >
          <Link className={styles.headerLink} href="/sunnyside">
            Foundations
          </Link>
          <Link className={styles.headerLink} href="/design-system">
            Case studies
          </Link>
          <a
            className={styles.headerLink}
            href="https://github.com/adityahimawan"
            target="_blank"
            rel="noreferrer"
          >
            Source <ArrowUpRight size={13} />
          </a>
        </nav>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Component catalog">
          <div className={styles.searchWrap}>
            <Search
              className={styles.searchIcon}
              aria-hidden="true"
              size={15}
            />
            <input
              className={styles.search}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a component…"
              aria-label="Find a component"
            />
          </div>
          <nav className={styles.nav}>
            {componentGroups.map((group) => {
              const items = componentDocs.filter(
                (item) =>
                  item.group === group &&
                  (!normalized ||
                    `${item.name} ${item.summary}`
                      .toLowerCase()
                      .includes(normalized)),
              )
              if (!items.length) return null
              return (
                <div className={styles.navGroup} key={group}>
                  <p className={styles.groupLabel}>{group}</p>
                  {items.map((item) => (
                    <Link
                      className={styles.navLink}
                      data-active={activeSlug === item.slug || undefined}
                      href={`/ui/components/${item.slug}`}
                      key={item.slug}
                    >
                      <span>{item.name}</span>
                      <span>
                        {String(componentDocs.indexOf(item) + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              )
            })}
            {normalized &&
              componentDocs.every(
                (item) =>
                  !`${item.name} ${item.summary}`
                    .toLowerCase()
                    .includes(normalized),
              ) && (
                <p className={styles.navEmpty}>
                  No component matches “{query}”.
                </p>
              )}
          </nav>
        </aside>
        <main className={styles.main} id="ui-main">
          {children}
        </main>
      </div>
    </div>
  )
}
