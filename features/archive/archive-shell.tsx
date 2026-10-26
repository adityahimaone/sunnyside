'use client'

import type { ReactNode } from 'react'

import { ArchiveFooter } from './archive-footer'
import { ArchiveHeader } from './archive-header'
import styles from './archive.module.css'

/**
 * The archive wing's shell: paper, a sticky bar, the cobalt sign-off.
 *
 * It replaces the booth's ambient room. That room was built for glass controls
 * over a coloured wash; these pages are paper, so the wash had nothing to do
 * but sit invisible behind an opaque page. The grain stays because paper has a
 * tooth, and the header and footer are here rather than in each page so the
 * four rooms cannot drift apart again.
 */
export function ArchiveShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skip}>
        Skip to content
      </a>
      <ArchiveHeader />
      <div className={styles.grain} aria-hidden />
      {children}
      <ArchiveFooter />
    </div>
  )
}
