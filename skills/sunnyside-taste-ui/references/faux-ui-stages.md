# Living Faux-UI Stages & Choreography Recipes

Adapted from `stageshow` and wired strictly to Sunnyside `--<prefix>-*` brand tokens.

---

## 1. The Core Faux-UI Stage Philosophy

1. **Never use generic gray wireframe bars for everything.** A realistic faux-UI stage uses **3 to 7 real domain strings** (real project names, real timestamps, real database records), while using quiet placeholder bars only for secondary background metadata.
2. **Bleed off the canvas edge:** Product mocks that sit centered inside a padded box look like template cards. When a `Window` or `Phone` bleeds off the right edge (`margin-right: -80px`) or bottom edge, it reads as a window into a vast living application.
3. **The Static Payoff Law:** In static captures or under `prefers-reduced-motion: reduce`, animations freeze on the final, most impressive "payoff" frame.

---

## 2. Stage 1 · The App Window Stage (`Window`)

```tsx
import styles from './window-stage.module.css'

export function WindowStage({ namespace = '--ss-' }) {
  return (
    <div className={styles.stageWindow}>
      <header className={styles.stageTitlebar}>
        <div className={styles.stageTrafficLights}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.stageAddressBar}>
          <span className={styles.stageProtocol}>https://</span>
          <span className={styles.stageDomain}>app.workspace.io/cluster/alpha</span>
        </div>
        <div className={styles.stageStatusBadge}>Live · 12ms</div>
      </header>

      <div className={styles.stageBody}>
        {/* Left Sidebar */}
        <nav className={styles.stageSidebar}>
          <div className={styles.sidebarItemActive}>Telemetry</div>
          <div className={styles.sidebarItem}>Nodes</div>
          <div className={styles.sidebarItem}>Routes</div>
          <div className={styles.sidebarItem}>Audit Log</div>
        </nav>

        {/* Main Content Area */}
        <main className={styles.stageMain}>
          <div className={styles.cardRow}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Throughput</span>
              <span className={styles.metricValue}>1.42 GB/s</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Error Budget</span>
              <span className={styles.metricValue}>99.992%</span>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableRow}>
              <span className={styles.colActive}>node-eu-west-1</span>
              <span className={styles.colNum}>0.4ms</span>
              <span className={styles.statusPill}>Healthy</span>
            </div>
            <div className={styles.tableRow}>
              <span className={styles.colActive}>node-us-east-4</span>
              <span className={styles.colNum}>1.2ms</span>
              <span className={styles.statusPill}>Healthy</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
```

```css
/* window-stage.module.css */
.stageWindow {
  position: relative;
  border-radius: var(--radius-lg, 16px);
  background: var(--surface-plate, #ffffff);
  border: 1px solid color-mix(in oklab, var(--text-primary, #111) 12%, transparent);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: var(--font-reading, sans-serif);
}

.stageTitlebar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: color-mix(in oklab, var(--surface-plate, #fff) 92%, var(--text-primary, #000));
  border-bottom: 1px solid color-mix(in oklab, var(--text-primary, #111) 8%, transparent);
}

.stageTrafficLights {
  display: flex;
  gap: 6px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--text-primary, #111) 24%, transparent);
}

.stageAddressBar {
  font-size: 11px;
  color: var(--text-secondary, #666);
  padding: 3px 10px;
  background: var(--surface-plate, #fff);
  border-radius: 6px;
  border: 1px solid color-mix(in oklab, var(--text-primary, #111) 8%, transparent);
}

.stageBody {
  display: grid;
  grid-template-columns: 140px 1fr;
  min-height: 280px;
}

.stageSidebar {
  padding: 16px 12px;
  border-right: 1px solid color-mix(in oklab, var(--text-primary, #111) 8%, transparent);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebarItemActive {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 8px;
  border-radius: 6px;
  background: color-mix(in oklab, var(--accent, #d84b2a) 12%, transparent);
  color: var(--accent, #d84b2a);
}

.sidebarItem {
  font-size: 12px;
  padding: 6px 8px;
  color: var(--text-secondary, #666);
}

.stageMain {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
```

---

## 3. Stage 2 · The Terminal Stage (`Terminal`)

```tsx
export function TerminalStage() {
  return (
    <div className="terminalFrame">
      <div className="terminalHeader">
        <span className="terminalPrompt">zsh — 80×24</span>
      </div>
      <div className="terminalBody">
        <p className="line"><span className="prompt">$</span> sunnyside deploy --region auto</p>
        <p className="lineOutput">✓ Ingesting tokens from features/tavola/tokens.json</p>
        <p className="lineOutput">✓ Verified WCAG AA contrast (12 pairs computed, 2 honest fails)</p>
        <p className="lineOutput">✓ Generated 6-mark Kuwayama companion cast</p>
        <p className="linePayoff">→ Production deployment live: https://tavola.sunnyside.studio [48ms]</p>
      </div>
    </div>
  )
}
```

---

## 4. Cursor Choreography (`Act` Protocol)

When creating animated interactive cards:
1. Define a visible SVG pointer (`width: 18px; height: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))`).
2. Move pointer along an ease-out path (`cubic-bezier(0.22, 1, 0.36, 1)`).
3. On arrival at target button or row, apply `scale(0.92)` to the cursor and trigger the active state on the underlying UI control.
4. Keep entire sequence within 3.5 seconds before looping or resting on the payoff state.
