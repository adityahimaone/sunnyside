import { Fragment } from 'react'

import styles from './design-engineering.module.css'

/**
 * Renders the inline code the content uses without pulling in a Markdown
 * pipeline. A segment between backticks becomes a <code>; everything else is
 * left as text. Keeps file names, token names and routes in the page’s mono.
 */
export function CodeText({ children }: { children: string }) {
  const parts = children.split(/(`[^`]+`)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className={styles.inlineCode}>
              {part.slice(1, -1)}
            </code>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}
