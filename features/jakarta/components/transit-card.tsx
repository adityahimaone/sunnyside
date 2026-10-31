import { JAKARTA_PRIMARY } from './brand'
import { WORDMARK_BOX, WORDMARK_PATHS } from '../wordmark-paths'
import styles from '../jakarta.module.css'

/**
 * The JakLingko card, drawn from scratch in the Jakarta tokens.
 *
 * Composition: a cream card, a Laut field cut on the same diagonal as the hero,
 * a Senja edge, one route drawing with right-angle turns (the mark's own
 * geometry), and the outlined Jakarta lockup — mark and wordmark — at the top
 * left. The card is a carrier for the city's identity, not a stock transit
 * template: the lockup is the same drawing as `public/brand/jakarta/lockup.svg`,
 * so the card cannot drift from the brand folder.
 */

const LOCKUP_HEIGHT = 64
const MARK_SCALE = LOCKUP_HEIGHT / JAKARTA_PRIMARY.box.h
const WORDMARK_CAP = LOCKUP_HEIGHT * 0.72
const WORDMARK_SCALE = WORDMARK_CAP / WORDMARK_BOX.h
const WORDMARK_X =
  64 +
  (JAKARTA_PRIMARY.box.w * LOCKUP_HEIGHT) / JAKARTA_PRIMARY.box.h +
  LOCKUP_HEIGHT * 1.6 * (100 / JAKARTA_PRIMARY.box.h)

export function TransitCard() {
  return (
    <svg
      className={styles.cardSvg}
      viewBox="0 0 1000 630"
      role="img"
      aria-labelledby="jk-card-title"
    >
      <title id="jk-card-title">
        The JakLingko card, redrawn in the Jakarta palette: a cream card with a
        Laut field cut on a diagonal, a Senja edge, a right-angle route drawing,
        the outlined Jakarta mark and wordmark, a gold chip and the card number
        4990 2026 0001.
      </title>

      <defs>
        <clipPath id="jk-card-field">
          <path d="M470 0H1000V630H340Z" />
        </clipPath>
      </defs>

      {/* card face */}
      <rect
        width="1000"
        height="630"
        rx="34"
        fill="var(--jk-kertas, #F7F4EE)"
      />

      {/* the field, cut on the same diagonal the hero field paints */}
      <path d="M470 0H1000V630H340Z" fill="var(--jk-laut-100, #148BCD)" />

      {/* one Senja edge; the accent is a line, not a second field */}
      <path
        d="M470 0L340 630"
        stroke="var(--jk-senja-100, #F7481B)"
        strokeWidth="14"
      />

      {/* the mark at card scale, screened onto the field */}
      <g clipPath="url(#jk-card-field)">
        <g
          transform="translate(560 236) scale(0.5)"
          fill="var(--jk-kertas, #F7F4EE)"
          opacity="0.12"
        >
          <path d={JAKARTA_PRIMARY.path} />
          <circle
            cx={JAKARTA_PRIMARY.stop.cx}
            cy={JAKARTA_PRIMARY.stop.cy}
            r={JAKARTA_PRIMARY.stop.r}
          />
        </g>

        {/* two routes; every turn is a right angle, which is the mark's grammar */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M520 560V420H650V300H790V180H900"
            stroke="var(--jk-kertas, #F7F4EE)"
            strokeWidth="12"
            strokeOpacity="0.94"
          />
          <path
            d="M560 140H700V250H830V380H940"
            stroke="var(--jk-kertas, #F7F4EE)"
            strokeWidth="8"
            strokeOpacity="0.42"
          />
        </g>

        {/* stops, filled: the same one ink that the mark ends on */}
        <g fill="var(--jk-kertas, #F7F4EE)">
          <circle cx="650" cy="420" r="13" />
          <circle cx="790" cy="300" r="13" />
          <circle cx="900" cy="180" r="13" />
        </g>
        <g fill="var(--jk-kertas, #F7F4EE)" opacity="0.55">
          <circle cx="700" cy="140" r="9" />
          <circle cx="830" cy="250" r="9" />
          <circle cx="940" cy="380" r="9" />
        </g>
      </g>

      {/* the Jakarta lockup, outlined from the same geometry as the brand folder */}
      <g
        transform={`translate(64 64) scale(${MARK_SCALE})`}
        fill="var(--jk-tinta, #1B2126)"
      >
        <path d={JAKARTA_PRIMARY.path} />
        <circle
          cx={JAKARTA_PRIMARY.stop.cx}
          cy={JAKARTA_PRIMARY.stop.cy}
          r={JAKARTA_PRIMARY.stop.r}
        />
      </g>
      <g
        transform={`translate(${WORDMARK_X} ${64 + LOCKUP_HEIGHT - WORDMARK_CAP}) scale(${WORDMARK_SCALE})`}
        fill="var(--jk-tinta, #1B2126)"
      >
        {WORDMARK_PATHS.map((glyph) => (
          <path key={glyph.t} transform={glyph.t} d={glyph.d} />
        ))}
      </g>

      <text className={styles.cardLabel} x="64" y="166">
        KOTA KOLABORASI · HUT KE–499
      </text>

      {/* chip and the contactless mark, drawn flat */}
      <g transform="translate(64 220)">
        <rect
          width="86"
          height="64"
          rx="10"
          fill="var(--jk-kebayoran-100, #FCD260)"
        />
        <g stroke="#8A6A22" strokeWidth="2" strokeOpacity="0.5">
          <path d="M0 21H86" />
          <path d="M0 43H86" />
          <path d="M29 0V64" />
          <path d="M57 0V64" />
        </g>
        <rect
          width="86"
          height="64"
          rx="10"
          fill="none"
          stroke="#8A6A22"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      </g>

      <g
        transform="translate(186 232)"
        fill="none"
        stroke="var(--jk-tinta, #1B2126)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.48"
      >
        <path d="M0 10Q13 30 0 50" />
        <path d="M13 2Q31 30 13 58" />
        <path d="M26 -6Q46 30 26 66" />
      </g>

      <path
        d="M64 388H300"
        stroke="var(--jk-tinta, #1B2126)"
        strokeWidth="2"
        strokeOpacity="0.16"
      />

      <text className={styles.cardLabel} x="64" y="422">
        KARTU WARGA
      </text>
      <text className={styles.cardNumber} x="64" y="462">
        4990 2026 0001
      </text>
      <text className={styles.cardMeta} x="64" y="496">
        BERLAKU SAMPAI 12/2031
      </text>

      {/* operator mark on the field, the city mark on the paper: two voices,
          one surface, which is the whole test of a city identity */}
      <g transform="translate(760 64)">
        <rect
          width="176"
          height="36"
          rx="18"
          fill="var(--jk-senja-100, #F7481B)"
        />
        <text
          x="88"
          y="24"
          textAnchor="middle"
          fill="var(--jk-tinta, #1B2126)"
          style={{
            fontFamily: 'var(--jk-font-display)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '2.2px',
          }}
        >
          KORIDOR 1
        </text>
      </g>

      <text className={styles.cardOperator} x="940" y="548" textAnchor="end">
        JAKLINGKO
      </text>
    </svg>
  )
}
