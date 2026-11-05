import { Daisy, Sparkle, Sun } from '../doodles'
import s from './diorama.module.css'
import { u } from './geometry'

/**
 * The pop-up book the diorama stands up out of.
 *
 * It is drawn in the same pixel space as the panels (see geometry.ts): an open
 * spread whose spine is the vertical line x = 511.5, 406.5 units either side.
 * Two pieces make it:
 *
 *   BookBase  the right-hand page and the back cover under it. It never moves.
 *   Leaf      the front cover and, on its back, the left-hand page. It turns
 *             180° about the spine, so what is the cover when the book is shut
 *             is the left page when it is open.
 *
 * Everything here is decoration; the section's real heading sits above it.
 */

const SPINE = 511.5
const HALF = 406.5
const TOP = 80
const HEIGHT = 467

const GOLD = '#f2c23a'

/** Position inside the leaf, in the leaf's own units, as percentages. */
const leaf = (x: number, y: number) => ({
  left: `${((x / HALF) * 100).toFixed(2)}%`,
  top: `${((y / HEIGHT) * 100).toFixed(2)}%`,
})

function Corner({ x, y, flip }: { x: number; y: number; flip: number }) {
  // a paper photo-corner, the kind that holds a page flat
  return (
    <path
      d={`M${x} ${y}L${x - 22 * flip} ${y}L${x} ${y - 22}Z`}
      fill="#c9a46a"
      stroke="#7c5c34"
      strokeWidth="0.8"
      opacity="0.95"
    />
  )
}

/** The right-hand page, the back cover under it, and the block of pages beside them. */
export function BookBase() {
  return (
    <svg
      viewBox="105 80 813 467"
      preserveAspectRatio="none"
      className={s.art}
      data-art="book-base"
      aria-hidden
      focusable="false"
    >
      {/* a block of pages showing under the right and bottom edges */}
      <rect
        x={SPINE}
        y="86"
        width="411"
        height="468"
        rx="7"
        fill="#e9e1cd"
        stroke="#8c7a55"
        strokeWidth="0.8"
      />
      <path
        d="M918 92V546M920.5 94V548M923 96V550"
        stroke="#a89873"
        strokeWidth="0.7"
      />
      <path
        d="M520 547H915M522 549.5H917M524 552H919"
        stroke="#a89873"
        strokeWidth="0.7"
      />

      {/* the cloth back cover */}
      <path
        d={`M${SPINE} ${TOP}H908a10 10 0 0 1 10 10V537a10 10 0 0 1-10 10H${SPINE}Z`}
        fill="url(#bk-cloth-in)"
        stroke="#1b2670"
        strokeWidth="1"
      />

      {/* the page */}
      <path
        d={`M${SPINE} 92H902a3 3 0 0 1 3 3V532a3 3 0 0 1-3 3H${SPINE}Z`}
        fill="#f4eee0"
      />
      <path
        d={`M${SPINE} 92H902a3 3 0 0 1 3 3V532a3 3 0 0 1-3 3H${SPINE}Z`}
        fill="url(#bk-dots)"
      />
      <rect x={SPINE} y="92" width="60" height="443" fill="url(#bk-gutter-r)" />
      <path
        d={`M${SPINE} 92H905V535H${SPINE}`}
        fill="none"
        stroke="#b9a981"
        strokeWidth="0.6"
      />

      <g
        fill="#8c7a55"
        fontSize="5.2"
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        letterSpacing="0.9"
      >
        <text x="895" y="105" textAnchor="end">
          A POP-UP BOOK OF TOOLS
        </text>
        <text x="893" y="529" textAnchor="end">
          09
        </text>
      </g>
      <Corner x={905} y={535} flip={1} />
    </svg>
  )
}

/** The turning leaf: cloth cover on its front, left-hand page on its back. */
export function Leaf() {
  return (
    <div className={s.leaf} aria-hidden>
      <div className={`${s.leafFace} ${s.leafFront}`}>
        <svg
          viewBox={`${SPINE} ${TOP} ${HALF} ${HEIGHT}`}
          preserveAspectRatio="none"
          className={s.art}
          focusable="false"
        >
          <path
            d={`M${SPINE} ${TOP}H908a10 10 0 0 1 10 10V537a10 10 0 0 1-10 10H${SPINE}Z`}
            fill="url(#bk-cloth)"
            stroke="#1b2670"
            strokeWidth="1"
          />
          <path
            d={`M${SPINE} ${TOP}H908a10 10 0 0 1 10 10V537a10 10 0 0 1-10 10H${SPINE}Z`}
            fill="url(#bk-weave)"
            opacity="0.5"
          />
          {/* the hinge, where the cover bends */}
          <rect
            x={SPINE}
            y={TOP}
            width="19"
            height={HEIGHT}
            fill="#000"
            opacity="0.2"
          />
          <path
            d={`M${SPINE + 19} ${TOP}V${TOP + HEIGHT}`}
            stroke="#fff"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <path
            d={`M${SPINE + 21} ${TOP}V${TOP + HEIGHT}`}
            stroke="#000"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
          {/* gold foil: a stitched line and a plain one */}
          <rect
            x={SPINE + 36}
            y={TOP + 20}
            width={HALF - 58}
            height={HEIGHT - 40}
            rx="4"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.3"
            strokeDasharray="5 3.4"
          />
          <rect
            x={SPINE + 43}
            y={TOP + 27}
            width={HALF - 72}
            height={HEIGHT - 54}
            rx="2"
            fill="none"
            stroke={GOLD}
            strokeWidth="0.7"
            opacity="0.8"
          />
          {/* a ribbon bookmark hanging off the bottom */}
          <path
            d={`M${SPINE + 300} ${TOP + HEIGHT - 2}V${TOP + HEIGHT + 22}L${SPINE + 308} ${TOP + HEIGHT + 15}L${SPINE + 316} ${TOP + HEIGHT + 22}V${TOP + HEIGHT - 2}Z`}
            fill="#ff6a2b"
            stroke="#a63d0e"
            strokeWidth="0.8"
          />
        </svg>

        <p
          className={s.coverKicker}
          style={{ ...leaf(56, 52), fontSize: u(8.4) }}
        >
          04 &nbsp;·&nbsp; Skills
        </p>
        <p
          className={s.coverTitle}
          style={{ ...leaf(54, 104), fontSize: u(46) }}
        >
          What I
          <br />
          reach for.
        </p>
        <p
          className={s.coverSub}
          style={{ ...leaf(56, 262), fontSize: u(9.4) }}
        >
          a pop-up book of
          <br />
          what is in the bag
        </p>
        <p
          className={s.coverCue}
          style={{ ...leaf(56, 326), fontSize: u(8.2) }}
        >
          Scroll to open <span aria-hidden>↓</span>
        </p>
        <Sun className={s.coverSun} />
        <Sparkle className={s.coverSpark} />
        <Daisy className={s.coverDaisy} />
      </div>

      <div className={`${s.leafFace} ${s.leafBack}`}>
        <svg
          viewBox={`105 ${TOP} ${HALF} ${HEIGHT}`}
          preserveAspectRatio="none"
          className={s.art}
          focusable="false"
        >
          <rect
            x="97"
            y="86"
            width="415"
            height="468"
            rx="7"
            fill="#e9e1cd"
            stroke="#8c7a55"
            strokeWidth="0.8"
          />
          <path
            d="M104 92V546M101.5 94V548M99 96V550"
            stroke="#a89873"
            strokeWidth="0.7"
          />
          <path
            d={`M105 ${TOP + 10}a10 10 0 0 1 10-10H${SPINE}V${TOP + HEIGHT}H115a10 10 0 0 1-10-10Z`}
            fill="url(#bk-cloth-in)"
            stroke="#1b2670"
            strokeWidth="1"
          />
          <path
            d={`M118 95a3 3 0 0 1 3-3H${SPINE}V535H121a3 3 0 0 1-3-3Z`}
            fill="#f4eee0"
          />
          <path
            d={`M118 95a3 3 0 0 1 3-3H${SPINE}V535H121a3 3 0 0 1-3-3Z`}
            fill="url(#bk-dots)"
          />
          <rect
            x={SPINE - 60}
            y="92"
            width="60"
            height="443"
            fill="url(#bk-gutter-l)"
          />
          <path
            d={`M${SPINE} 92H118V535H${SPINE}`}
            fill="none"
            stroke="#b9a981"
            strokeWidth="0.6"
          />
          <g
            fill="#8c7a55"
            fontSize="5.2"
            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            letterSpacing="0.9"
          >
            <text x="130" y="105">
              NO PERCENTAGES. JUST WHAT I REACH FOR.
            </text>
            <text x="130" y="529">
              08
            </text>
          </g>
          <Corner x={118} y={535} flip={-1} />
        </svg>
      </div>
    </div>
  )
}
