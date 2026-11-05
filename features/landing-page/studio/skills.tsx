'use client'

import { useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  BuildArt,
  DioramaDefs,
  MotionArt,
  RestArt,
  SystemsArt,
} from './diorama/diorama-art'
import { BookBase, Leaf } from './diorama/book'
import { useBookScroll } from './diorama/book-scroll'
import styles from './diorama/diorama.module.css'
import { at, atRight, fs, u, vars } from './diorama/geometry'
import { SectionHead, SectionNext } from './section-head'
import { SKILL_GROUPS } from './studio-data'

type StationId = 'all' | 'build' | 'motion' | 'systems' | 'rest'

const STATIONS: { id: StationId; label: string }[] = [
  { id: 'all', label: 'All Machinery' },
  { id: 'build', label: '01. Build' },
  { id: 'motion', label: '02. Motion' },
  { id: 'systems', label: '03. Systems' },
  { id: 'rest', label: '04. The rest' },
]

// Each curve keeps its own spring: the slider moves the thumb, the stiffness
// decides how it gets there when "Play the curves" sends it somewhere new.
const CURVES = [
  { id: 'soft', label: 'Soft', stiffness: 120, damping: 26, dot: '#161727' },
  { id: 'snap', label: 'Snap', stiffness: 360, damping: 22, dot: '#3f5fd0' },
  { id: 'loose', label: 'Loose', stiffness: 62, damping: 12, dot: '#ee6f5a' },
] as const

type CurveId = (typeof CURVES)[number]['id']
type CurveValues = Record<CurveId, number>

const CURVE_PRESETS: CurveValues[] = [
  { soft: 40, snap: 90, loose: 28 },
  { soft: 70, snap: 38, loose: 84 },
  { soft: 92, snap: 74, loose: 98 },
]

/** Where each Build tag hangs on the scaffold. The first overhangs the panel edge. */
const TAGS = [
  { x: 150, w: 32 },
  { x: 197, w: 46 },
  { x: 253, w: 51 },
  { x: 312, w: 57 },
  { x: 382, w: 41 },
] as const

const RIBBONS = [
  { x: 529, y: 388, w: 41, h: 24, tone: 'hot' },
  { x: 530, y: 419, w: 60, h: 16, tone: 'pale' },
  { x: 530, y: 440, w: 53, h: 16, tone: 'cream' },
  { x: 530, y: 460, w: 53, h: 17, tone: 'green' },
] as const

/** The six tools that sit on the drawer front; anything else becomes a folder. */
const DRAWER_TOOLS = [
  'Figma',
  'Git',
  'Cloudflare',
  'PostgreSQL',
  'Vitest',
  'Go',
]
const HOT_TOOLS = new Set(['Git', 'PostgreSQL'])
const FOLDER_X = [641, 704, 761, 819]

/**
 * Each station's footprint in the reference capture (relative to the frame's
 * corner): where to crop the scene on a phone, and how big that crop is.
 */
const CROPS = {
  build: { '--ox': 41, '--oy': 32, '--pw': 402, '--ph': 272 },
  motion: { '--ox': 414, '--oy': 32, '--pw': 361, '--ph': 274 },
  systems: { '--ox': 38, '--oy': 242, '--pw': 451, '--ph': 214 },
  rest: { '--ox': 467, '--oy': 292, '--pw': 328, '--ph': 156 },
} as const

/**
 * On desktop a card is invisible plumbing (`display: contents`) and the layer
 * inside it is positioned on the stage. On a phone the card is a framed window
 * onto its own piece of the scene, with the readable controls underneath.
 */
function Card({
  id,
  below,
  children,
}: {
  id: keyof typeof CROPS
  below: ReactNode
  children: ReactNode
}) {
  return (
    <div className={styles.card} data-id={id} style={vars(CROPS[id])}>
      <div className={styles.view}>{children}</div>
      <div className={styles.below}>{below}</div>
    </div>
  )
}

export function Skills() {
  const [station, setStation] = useState<StationId>('all')
  const [running, setRunning] = useState(true)
  const [curves, setCurves] = useState<CurveValues>({
    soft: 92,
    snap: 74,
    loose: 98,
  })
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ribbon, setRibbon] = useState(0)

  const stage = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  useBookScroll(rail, stage)

  const build = SKILL_GROUPS.find((group) => group.id === 'build')!
  const motionGroup = SKILL_GROUPS.find((group) => group.id === 'motion')!
  const systems = SKILL_GROUPS.find((group) => group.id === 'systems')!
  const also = SKILL_GROUPS.find((group) => group.id === 'also')!

  const folders = also.skills
    .filter((skill) => !DRAWER_TOOLS.includes(skill))
    .slice(0, 4)
  const tools = also.skills.filter((skill) => !folders.includes(skill))

  const playCurves = () => {
    setPlaying(true)
    setCurves(CURVE_PRESETS[run % CURVE_PRESETS.length])
    setRun((value) => value + 1)
  }

  const lever = ((curves.soft + curves.snap + curves.loose) / 3 - 50) * -0.28

  return (
    <section
      id="skills"
      className={`${styles.section} scroll-mt-24`}
      aria-labelledby="skills-title"
    >
      <div className={styles.glow} aria-hidden />
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
          intro="The split below says what pays the rent, what I sweat, and what keeps either from falling over."
        />
      </div>

      <div ref={rail} className={styles.rail}>
        <div className={styles.pinned}>
          <div className={styles.room}>
            <div className={styles.stageWrap}>
              <div
                ref={stage}
                className={styles.stage}
                data-station={station}
                data-running={running}
                style={vars({ '--lever': `${lever.toFixed(1)}deg` })}
              >
                <DioramaDefs />

                <div className={styles.controller}>
                  <div className={styles.controllerTop}>
                    <span>Automation Controller</span>
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
                  <div
                    className={styles.pills}
                    role="group"
                    aria-label="Stations"
                  >
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

                <div className={styles.book}>
                  <div className={styles.scene}>
                    <div className={styles.layerBase}>
                      <BookBase />
                    </div>
                    <div className={styles.shade} />
                    <Leaf />

                    {/* 04 · The rest */}
                    <Card
                      id="rest"
                      below={<p className={styles.belowLine}>{also.line}</p>}
                    >
                      <div
                        className={styles.layer}
                        data-id="rest"
                        style={vars({ '--depth': 0.45, '--n': 0 })}
                      >
                        <RestArt folderCount={folders.length} />
                        <Eyebrow
                          x={610}
                          y={401}
                          text={also.eyebrow}
                          index="04 / 04"
                          xr={879}
                        />
                        <h3
                          className={cn(styles.title, styles.titleInk)}
                          style={{ ...at(610, 416), fontSize: u(26.5) }}
                        >
                          {also.title}
                        </h3>
                        <p className={styles.deskLine}>{also.line}</p>

                        <div
                          className={styles.sticky}
                          style={{ ...at(808, 411, 80, 37), fontSize: u(6.3) }}
                        >
                          currently poking:
                          <br />
                          <span>view transitions</span>
                        </div>

                        <ul
                          className={styles.folderLabels}
                          aria-label="Also in the drawer"
                        >
                          {folders.map((name, i) => (
                            <li
                              key={name}
                              style={{
                                ...at(FOLDER_X[i], 452.5),
                                fontSize: u(5.6),
                              }}
                            >
                              {name}
                            </li>
                          ))}
                        </ul>

                        <ul
                          className={styles.drawerTools}
                          style={{ ...at(630, 478, 255, 19), fontSize: u(7.2) }}
                        >
                          {tools.map((tool) => (
                            <li
                              key={tool}
                              data-hot={HOT_TOOLS.has(tool) || undefined}
                            >
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>

                    {/* 01 · Build */}
                    <Card
                      id="build"
                      below={<p className={styles.belowLine}>{build.line}</p>}
                    >
                      <div
                        className={styles.layer}
                        data-id="build"
                        style={vars({ '--depth': 0.8, '--n': 1 })}
                      >
                        <BuildArt />
                        <Eyebrow
                          x={172}
                          y={129}
                          text={build.eyebrow}
                          index="01 / 04"
                          xr={527}
                        />
                        <h3
                          className={cn(styles.title, styles.titleCream)}
                          style={{ ...at(172, 148), fontSize: u(24.5) }}
                        >
                          {build.title}
                        </h3>
                        <p className={styles.deskLine}>{build.line}</p>

                        <span
                          className={styles.cloudText}
                          style={{ ...at(159, 183), fontSize: u(4.8) }}
                          aria-hidden
                        >
                          space atmosphere
                        </span>
                        <span
                          className={styles.cloudText}
                          style={{ ...at(478, 156), fontSize: u(4.8) }}
                          aria-hidden
                        >
                          stratosphere
                        </span>

                        <ul className={styles.tags} aria-label="Build tools">
                          {build.skills
                            .slice(0, TAGS.length)
                            .map((skill, i) => (
                              <li
                                key={skill}
                                className={styles.tag}
                                data-skill={skill}
                                style={{
                                  ...at(TAGS[i].x, 283, TAGS[i].w, 17),
                                  fontSize: u(6.7),
                                  ...vars({ '--delay': `${i * 0.4}s` }),
                                }}
                              >
                                {skill}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </Card>

                    {/* 02 · Motion */}
                    <Card
                      id="motion"
                      below={
                        <p className={styles.belowLine}>{motionGroup.line}</p>
                      }
                    >
                      <div
                        className={styles.layer}
                        data-id="motion"
                        style={vars({ '--depth': 0.8, '--n': 2 })}
                      >
                        <MotionArt />
                        <Eyebrow
                          x={565}
                          y={129}
                          text={motionGroup.eyebrow}
                          index="02 / 04"
                          xr={858}
                        />
                        <h3
                          className={cn(styles.title, styles.titleInk)}
                          style={{ ...at(565, 146), fontSize: u(27) }}
                        >
                          {motionGroup.title}
                        </h3>
                        <p className={styles.deskLine}>{motionGroup.line}</p>

                        <ul
                          className={styles.windTags}
                          aria-label="Motion tools"
                        >
                          {motionGroup.skills.map((skill, i) => (
                            <li
                              key={skill}
                              data-slot={i}
                              style={{
                                ...at(
                                  [833, 840, 588, 592][i] ?? 588,
                                  [165, 216, 343, 358][i] ?? 343,
                                ),
                                fontSize: u(i < 2 ? 5.6 : 5.8),
                              }}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>

                        <div
                          className={styles.weather}
                          style={{ ...at(764, 237, 100, 70), fontSize: u(6.2) }}
                        >
                          <span className={styles.weatherHead}>
                            Weather &amp; current machine
                          </span>
                          {CURVES.map((curve, i) => (
                            <label
                              key={curve.id}
                              className={styles.curveRow}
                              data-curve={curve.id}
                              data-playing={playing || undefined}
                              style={{
                                top: u(25.5 + i * 18.5),
                                ...vars({ '--pct': curves[curve.id] }),
                              }}
                            >
                              <span className={styles.curveLabel}>
                                {curve.label}
                              </span>
                              <i
                                className={styles.curveDot}
                                style={{ background: curve.dot }}
                                aria-hidden
                              />
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={curves[curve.id]}
                                className={styles.curveInput}
                                aria-label={`${curve.label} curve`}
                                aria-valuetext={`${curve.label}: stiffness ${curve.stiffness}, damping ${curve.damping}`}
                                onPointerDown={() => setPlaying(false)}
                                onChange={(event) => {
                                  setPlaying(false)
                                  setCurves((values) => ({
                                    ...values,
                                    [curve.id]: Number(event.target.value),
                                  }))
                                }}
                              />
                              <span className={styles.srOnly}>
                                {curve.stiffness} / {curve.damping}
                              </span>
                            </label>
                          ))}
                        </div>

                        <button
                          type="button"
                          className={styles.play}
                          style={{ ...at(742, 342, 86, 22), fontSize: u(6.6) }}
                          onClick={playCurves}
                        >
                          {run > 0 ? 'Play again' : 'Play the curves'}{' '}
                          <span aria-hidden>→</span>
                        </button>
                      </div>
                    </Card>

                    {/* 03 · Systems */}
                    <Card
                      id="systems"
                      below={<p className={styles.belowLine}>{systems.line}</p>}
                    >
                      <div
                        className={styles.layer}
                        data-id="systems"
                        style={vars({ '--depth': 1.35, '--n': 3 })}
                      >
                        <SystemsArt />
                        <Eyebrow
                          x={357}
                          y={334}
                          text={systems.eyebrow}
                          index="03 / 04"
                          xr={563}
                        />
                        <h3
                          className={cn(styles.title, styles.titleInk)}
                          style={{ ...at(357, 348), fontSize: u(27) }}
                        >
                          {systems.title}
                        </h3>
                        <p className={styles.deskLine}>{systems.line}</p>

                        <span
                          className={styles.deck}
                          aria-hidden
                          style={{ ...at(357, 388, 116, 17), fontSize: u(6.8) }}
                        >
                          Barometric Control Deck
                        </span>

                        <span
                          className={styles.gateTitle}
                          style={{ ...at(367, 451), fontSize: u(15) }}
                          aria-hidden
                        >
                          Systems
                        </span>

                        <div
                          className={styles.consoleRow}
                          style={at(356, 409, 116, 31)}
                        >
                          <button
                            type="button"
                            className={cn(styles.consoleBtn, styles.hoverBtn)}
                            style={{ fontSize: u(7) }}
                          >
                            Hover me
                          </button>
                          <button
                            type="button"
                            className={cn(styles.consoleBtn, styles.pressBtn)}
                            style={{ fontSize: u(7) }}
                            aria-pressed={pressed}
                            onClick={() => setPressed((value) => !value)}
                          >
                            Press me
                            <svg
                              viewBox="0 0 10 8"
                              aria-hidden
                              className={styles.tick}
                            >
                              <path
                                d="M1 4.2L3.8 7L9 1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <ul
                          className={styles.ribbons}
                          aria-label="Systems practices"
                        >
                          {systems.skills
                            .slice(0, RIBBONS.length)
                            .map((item, i) => (
                              <li
                                key={item}
                                style={{
                                  ...at(
                                    RIBBONS[i].x,
                                    RIBBONS[i].y,
                                    RIBBONS[i].w,
                                    RIBBONS[i].h,
                                  ),
                                  ...vars({ '--delay': `${i * 0.45}s` }),
                                }}
                              >
                                <button
                                  type="button"
                                  className={styles.ribbon}
                                  data-tone={RIBBONS[i].tone}
                                  aria-pressed={ribbon === i}
                                  onClick={() => setRibbon(i)}
                                  style={{ fontSize: u(6.6) }}
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.shell}>
        <SectionNext href="contact" label="Contact" note="the last page" />
      </div>
    </section>
  )
}

function Eyebrow({
  x,
  y,
  text,
  index,
  xr,
}: {
  x: number
  y: number
  text: string
  index: string
  xr: number
}) {
  const size = { fontSize: fs(7.4) } as CSSProperties
  return (
    <>
      <span className={styles.eyebrow} style={{ ...at(x, y), ...size }}>
        {text}
      </span>
      <span className={styles.eyebrow} style={{ ...atRight(xr, y), ...size }}>
        {index}
      </span>
    </>
  )
}
