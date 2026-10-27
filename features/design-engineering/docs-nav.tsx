'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { SunnysideMark } from '@/components/ui/sunnyside-logo'

import styles from './design-engineering.module.css'

export type DocsNavItem = {
  href: string
  label: string
  number?: string
  sectionId?: string
}

type DocsNavProps = {
  title: string
  subtitle: string
  items: DocsNavItem[]
  markdownHref: string
  footerLabel: string
  footerHref: string
}

export function DocsNav({
  title,
  subtitle,
  items,
  markdownHref,
  footerLabel,
  footerHref,
}: DocsNavProps) {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string>('')
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const sections = items
      .flatMap((item) =>
        item.sectionId ? [document.getElementById(item.sectionId)] : [],
      )
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) return

    let frame = 0
    const read = () => {
      frame = 0
      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 140) current = section.id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  const links = items.map((item) => {
    const isAnchor = item.href.startsWith('#')
    const active = isAnchor
      ? activeId === item.sectionId
      : pathname === item.href

    const content = (
      <>
        {item.number ? <span>{item.number}</span> : null}
        {item.label}
      </>
    )

    return isAnchor ? (
      <a
        key={item.href}
        href={item.href}
        className={styles.navLink}
        aria-current={active ? 'location' : undefined}
        onClick={close}
      >
        {content}
      </a>
    ) : (
      <Link
        key={item.href}
        href={item.href}
        className={styles.navLink}
        aria-current={active ? 'page' : undefined}
        onClick={close}
      >
        {content}
      </Link>
    )
  })

  return (
    <>
      <details className={styles.mobileToc} ref={detailsRef}>
        <summary>
          On this page
          <span>{items.length}</span>
        </summary>
        <nav aria-label="On this page">{links}</nav>
      </details>

      <nav className={styles.toc} aria-label="Contents">
        <Link href="/design-engineering" className={styles.tocBrand}>
          <SunnysideMark className={styles.tocMark} />
          <span>
            <b>{title}</b>
            <small>{subtitle}</small>
          </span>
        </Link>

        <p className={styles.tocLabel}>On this page</p>
        <div className={styles.tocLinks}>{links}</div>

        <div className={styles.tocFoot}>
          <a href={markdownHref}>Read as Markdown</a>
          <Link href={footerHref}>{footerLabel}</Link>
        </div>
      </nav>
    </>
  )
}
