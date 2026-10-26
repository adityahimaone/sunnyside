import styles from '@/features/bookmarks/sunnyside-bookmarks.module.css'

export default function Loading() {
  return (
    <main className={styles.page} id="main-content" aria-busy="true">
      <div className={styles.shell}>
        <div style={{ padding: '2rem 0' }}>
          <div
            style={{
              width: '180px',
              height: '24px',
              borderRadius: '999px',
              background: 'var(--paper-lo)',
              marginBottom: '1rem',
            }}
          />
          <div
            style={{
              width: '320px',
              height: '48px',
              borderRadius: '8px',
              background: 'var(--paper-lo)',
              marginBottom: '1.5rem',
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '1rem',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '90px',
                  borderRadius: '12px',
                  background: 'var(--paper-hi)',
                  border: '1.5px solid var(--line)',
                  boxShadow: '2px 2px 0 var(--line)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
