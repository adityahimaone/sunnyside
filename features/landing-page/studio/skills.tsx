'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Atom, Sun } from './doodles'
import { Reveal } from './reveal'
import { SectionHead, SectionNext } from './section-head'
import { SKILL_GROUPS } from './studio-data'
import styles from './studio.module.css'

type StationId = 'all' | 'build' | 'motion' | 'systems' | 'rest'

const STATIONS: { id: StationId; label: string }[] = [
  { id: 'all', label: 'All machinery' },
  { id: 'build', label: '01. Build' },
  { id: 'motion', label: '02. Motion' },
  { id: 'systems', label: '03. Systems' },
  { id: 'rest', label: '04. The rest' },
]

// Each curve keeps its own spring: the slider moves the ball, the stiffness
// decides how it gets there. Same three curves the old card demonstrated.
const CURVES = [
  { id: 'soft', label: 'Soft', stiffness: 120, damping: 26 },
  { id: 'snap', label: 'Snap', stiffness: 360, damping: 22 },
  { id: 'loose', label: 'Loose', stiffness: 62, damping: 12 },
] as const

type CurveId = (typeof CURVES)[number]['id']
type CurveValues = Record<CurveId, number>

const CURVE_PRESETS: CurveValues[] = [
  { soft: 38, snap: 72, loose: 46 },
  { soft: 62, snap: 88, loose: 24 },
  { soft: 26, snap: 54, loose: 80 },
]

const RIBBONS = ['Design systems', 'Accessibility', 'Performance', 'Playwright']

export function Skills() {
  const [station, setStation] = useState<StationId>('all')
  const [running, setRunning] = useState(true)
  const [curves, setCurves] = useState<CurveValues>(CURVE_PRESETS[0])
  const [run, setRun] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [ribbon, setRibbon] = useState(RIBBONS[0])

  const build = SKILL_GROUPS.find((group) => group.id === 'build')!
  const motionGroup = SKILL_GROUPS.find((group) => group.id === 'motion')!
  const systems = SKILL_GROUPS.find((group) => group.id === 'systems')!
  const also = SKILL_GROUPS.find((group) => group.id === 'also')!

  const playCurves = () => {
    setRun((value) => value + 1)
    setCurves(CURVE_PRESETS[(run + 1) % CURVE_PRESETS.length])
  }

  return (
    <section
      id="skills"
      className={`${styles.skills} scroll-mt-24`}
      aria-labelledby="skills-title"
    >
      <div className={styles.skillsWash} aria-hidden>
        <div className={styles.skillsGlow} />
      </div>
      <div className={styles.shell}>
        <SectionHead
          number="04"
          label="Skills"
          script="in the bag"
          title={
            <span id="skills-title">
              What I
              <br />
              reach for.
            </span>
          }
          intro="A toolbox, not a scoreboard. The split below is honest about what pays the rent, what I sweat, and what keeps either from falling over."
        />

        <div className={styles.controller}>
          <div className={styles.controllerTop}>
            <span>Automation controller</span>
            <button
              type="button"
              className={styles.kinetic}
              aria-pressed={running}
              aria-label="Run the machinery"
              onClick={() => setRunning((value) => !value)}
            >
              <span className={styles.knob} aria-hidden />
            </button>
          </div>
          <div className={styles.pills} role="group" aria-label="Stations">
            {STATIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.pill}
                aria-pressed={station === item.id}
                onClick={() => setStation(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.observatory}
          data-station={station}
          data-running={running}
        >
          <div className={styles.cavity}>
            <div className={styles.stations}>
              <Reveal
                className={cn(styles.station, styles.stationBuild)}
                y={20}
              >
                <StationTop eyebrow={build.eyebrow} index="01 / 04" />
                <div className={styles.stationBody}>
                  <h3 className={styles.stationTitle}>{build.title}</h3>
                  <p className={styles.stationLine}>{build.line}</p>
                </div>

                <div className={styles.buildScene} aria-hidden>
                  <span className={styles.girder} />
                  <span className={styles.cloudTag} data-side="left">
                    space atmosphere
                  </span>
                  <span className={styles.cloudTag} data-side="right">
                    stratosphere
                  </span>

                  <span className={styles.domeUnit}>
                    <span className={styles.dome}>
                      <i className={styles.domeRibs} />
                      <i className={styles.domeSlit} />
                      <i className={styles.domeTicks}>
                        <span>- 05</span>
                        <span>- 2200</span>
                        <span>- 2004</span>
                      </i>
                    </span>
                    <span className={styles.domeBase}>
                      <span>dome-01</span>
                      <i />
                    </span>
                  </span>

                  <span className={styles.towerUnit}>
                    <span className={styles.atomRig}>
                      <Atom className={styles.atomArt} />
                      <span className={styles.springRow}>
                        <CoiledSpring className={styles.coil} />
                        <CoiledSpring className={styles.coil} />
                      </span>
                    </span>
                    <span className={styles.towerDeck}>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className={styles.towerLegs}>
                      <i />
                      <i />
                      <svg viewBox="0 0 50 30" preserveAspectRatio="none">
                        <line x1="1" y1="1" x2="49" y2="29" />
                        <line x1="49" y1="1" x2="1" y2="29" />
                      </svg>
                    </span>
                  </span>
                </div>

                <ul className={styles.chips}>
                  {build.skills.map((skill) => (
                    <li key={skill} className={styles.stationChip}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal
                className={cn(styles.station, styles.stationMotion)}
                delay={0.05}
                y={20}
              >
                <StationTop eyebrow={motionGroup.eyebrow} index="02 / 04" />
                <div className={styles.stationBody}>
                  <h3 className={styles.stationTitle}>{motionGroup.title}</h3>
                  <p className={styles.stationLine}>{motionGroup.line}</p>
                </div>

                <div className={styles.motionScene} aria-hidden>
                  <span className={styles.sunRig}>
                    <i className={styles.sunPulley} />
                    <Gear className={styles.gearTop} size={54} />
                    <Sun className={styles.sunArt} />
                    <Gear className={styles.gearSide} size={40} />
                  </span>
                </div>

                <div className={styles.curveBox}>
                  <div className={styles.curveHead}>
                    <span>Weather &amp; current</span>
                    <span>k / d</span>
                  </div>
                  {CURVES.map((curve) => (
                    <label key={curve.id} className={styles.curveRow}>
                      <span className={styles.curveLabel}>{curve.label}</span>
                      <input
                        type="range"
                        min={8}
                        max={100}
                        value={curves[curve.id]}
                        className={styles.curveInput}
                        aria-label={`${curve.label} curve`}
                        onChange={(event) =>
                          setCurves((values) => ({
                            ...values,
                            [curve.id]: Number(event.target.value),
                          }))
                        }
                        style={
                          {
                            '--pct': `${curves[curve.id]}%`,
                          } as React.CSSProperties
                        }
                      />
                      <span className={styles.curveValue}>
                        {curve.stiffness}/{curve.damping}
                      </span>
                    </label>
                  ))}
                  <span className={styles.curvePedestal}>
                    <button
                      type="button"
                      className={styles.curvePlay}
                      onClick={playCurves}
                    >
                      {run > 0 ? 'Play again' : 'Play the curves'}{' '}
                      <span aria-hidden>→</span>
                    </button>
                    <i aria-hidden />
                  </span>
                  <ul className={styles.chips}>
                    {motionGroup.skills.map((skill) => (
                      <li key={skill} className={styles.stationChip}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal
                className={cn(styles.station, styles.stationSystems)}
                delay={0.08}
                y={20}
              >
                <span className={styles.crenel} aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <StationTop eyebrow={systems.eyebrow} index="03 / 04" />
                <div className={styles.stationBody}>
                  <h3 className={styles.stationTitle}>{systems.title}</h3>
                  <p className={styles.stationLine}>{systems.line}</p>
                </div>

                <div className={styles.systemsScene}>
                  <span className={styles.belt} aria-hidden />
                  <span className={styles.gauges} aria-hidden>
                    <span className={styles.gauge} data-tilt="left">
                      <i className={styles.dial}>
                        <b />
                      </i>
                      <em>04 / 04</em>
                    </span>
                    <span className={styles.gauge} data-tilt="right">
                      <i className={styles.dial}>
                        <b />
                      </i>
                      <em>ok</em>
                    </span>
                  </span>

                  <div className={styles.console}>
                    <span className={styles.plungerRow}>
                      <span className={styles.plunger}>
                        <button type="button" className={styles.consoleBtn}>
                          Hover me
                        </button>
                        <CoiledSpring className={styles.plungerCoil} />
                      </span>
                      <span className={styles.plunger}>
                        <button
                          type="button"
                          className={styles.consoleBtn}
                          aria-pressed={pressed}
                          onClick={() => setPressed((value) => !value)}
                        >
                          {pressed ? 'Pressed! ✓' : 'Press me'}
                        </button>
                        <CoiledSpring className={styles.plungerCoil} />
                      </span>
                    </span>
                    <span className={styles.arch}>
                      <i />
                    </span>
                    <span className={styles.consoleNote}>
                      hover · focus · active · disabled
                    </span>
                  </div>

                  <ul className={styles.ribbons}>
                    {RIBBONS.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          className={styles.ribbon}
                          aria-pressed={ribbon === item}
                          onClick={() => setRibbon(item)}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal
                className={cn(styles.station, styles.stationAlso)}
                delay={0.1}
                y={20}
              >
                <span className={styles.corrugate} aria-hidden />
                <StationTop eyebrow={also.eyebrow} index="04 / 04" />
                <div className={styles.stationBody}>
                  <h3 className={styles.stationTitle}>{also.title}</h3>
                  <p className={styles.stationLine}>{also.line}</p>
                </div>

                <div className={styles.drawerWrap}>
                  <span className={styles.drawerTabs} aria-hidden>
                    <i>design</i>
                    <i>infra</i>
                    <i>data</i>
                    <i>test</i>
                  </span>
                  <div className={styles.drawer}>
                    <span className={styles.drawerHead}>Tool drawer</span>
                    <div className={styles.drawerSlot}>
                      <div className={styles.tools}>
                        {also.skills.map((skill) => (
                          <span
                            key={skill}
                            className={styles.tool}
                            data-figma={skill === 'Figma' ? '' : undefined}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <span className={styles.status}>
                  currently poking: <span>view transitions</span>
                </span>
              </Reveal>
            </div>
          </div>
        </div>

        <div className={styles.skillNote}>
          <span>No percentages. Just what I reach for.</span>
          <span>Last audited · October 2026</span>
        </div>

        <SectionNext href="contact" label="Contact" note="the last page" />
      </div>
    </section>
  )
}

function StationTop({ eyebrow, index }: { eyebrow: string; index: string }) {
  return (
    <div className={styles.stationTop}>
      <span>{eyebrow}</span>
      <span>{index}</span>
    </div>
  )
}

/** Paper coil, drawn twice: ink outline under a light highlight stroke. */
function CoiledSpring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 44" fill="none" className={className} aria-hidden>
      <rect
        x="2"
        y="38"
        width="20"
        height="5"
        rx="2"
        fill="currentColor"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <path
        d="M4 37C4 32 20 32 20 27C20 22 4 22 4 17C4 12 20 12 20 7C20 4 6 4 6 2"
        stroke="var(--ink)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M4 37C4 32 20 32 20 27C20 22 4 22 4 17C4 12 20 12 20 7C20 4 6 4 6 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Corrugated cardboard gear — the machines' joints. */
function Gear({ size = 60, className }: { size?: number; className?: string }) {
  const teeth = 12
  const points = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle = (i * Math.PI) / teeth
    const radius = i % 2 === 0 ? 46 : 36
    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <polygon
        points={points}
        fill="#c89d66"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="#a88149"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      {[0, 90, 180, 270].map((deg) => (
        <circle
          key={deg}
          cx={50 + 14 * Math.cos((deg * Math.PI) / 180)}
          cy={50 + 14 * Math.sin((deg * Math.PI) / 180)}
          r="4.5"
          fill="#27201c"
          stroke="var(--ink)"
          strokeWidth="2"
        />
      ))}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill="#f5f2eb"
        stroke="var(--ink)"
        strokeWidth="2.5"
      />
    </svg>
  )
}
