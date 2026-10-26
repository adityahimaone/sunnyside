import layout from '@/features/archive/archive.module.css'
import styles from '@/features/bookmarks/sunnyside-bookmarks.module.css'

/**
 * The crate's first frame: the same masthead and row rhythm as the page, in
 * paper-lo blocks, so the skeleton does not jump when the rows arrive.
 */
export default function Loading() {
  return (
    <main
      className={`${layout.page} ${styles.page}`}
      id="main-content"
      aria-busy="true"
    >
      <div className={layout.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerTag}>
                <span className={styles.kickerMark} aria-hidden />
                03 / The crate
              </span>
              <span className={styles.kickerText}>Loading the index</span>
            </p>
            <h1 className={layout.title}>The reading rack.</h1>
            <p className={layout.intro}>
              Engineering write-ups, tools and interface references, kept in one
              crate.
            </p>
          </div>
          <div className={styles.heroTools} aria-hidden>
            <span className={styles.searchLabel}>Search the crate</span>
            <div className={styles.searchBar} />
          </div>
        </header>

        <div className={styles.layout} aria-hidden>
          <aside className={styles.index}>
            <div className={styles.indexCard}>
              <p className={styles.indexTitle}>Categories</p>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: 34,
                    borderRadius: 8,
                    background: 'var(--ss-paper-lo)',
                  }}
                />
              ))}
            </div>
          </aside>
          <section className={styles.list}>
            <div className={styles.listHead}>
              <h2 className={styles.listTitle}>The crate</h2>
              <p className={styles.listCount}>Loading links</p>
            </div>
            <div className={styles.deck}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: 76,
                    marginTop: 1,
                    borderBottom: '1px solid var(--ss-line)',
                    background:
                      index % 3 === 0 ? 'var(--ss-paper-hi)' : 'transparent',
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
