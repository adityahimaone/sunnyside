import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import styles from './design-engineering.module.css'

export function DocsHeading({
  id,
  kicker,
  level = 2,
  children,
}: {
  id: string
  kicker?: string
  level?: 2 | 3
  children: ReactNode
}) {
  const Tag = level === 2 ? 'h2' : 'h3'

  return (
    <div className={styles.headingGroup}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <Tag
        id={id}
        className={cn(styles.heading, level === 3 && styles.subheading)}
      >
        {children}
        <a
          href={`#${id}`}
          className={styles.anchor}
          aria-label="Link to this section"
        >
          #
        </a>
      </Tag>
    </div>
  )
}
