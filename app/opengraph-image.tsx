import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

/**
 * Sunnyside / Side A social card:
 * Warm paper ground (#f3ecdf), tactile studio card with dark ink border and drop shadow,
 * cobalt sun badge, tangerine "DESIGN ENGINEER" tag, and display title.
 */

const RAY_ANGLES = Array.from({ length: 12 }, (_, index) => index * 30)

/**
 * The Sunnyside mark, rebuilt in Satori's box model: a cobalt tile with the sun
 * clipped by the rounded edge. The vector original is public/brand/sunnyside-mark.svg;
 * this is only here because ImageResponse cannot import an SVG component.
 */
function SunBadge() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: '#3d53d6',
        border: '2.5px solid #191a2e',
        boxShadow: '3px 4px 0px #191a2e',
        overflow: 'hidden',
      }}
    >
      {RAY_ANGLES.map((angle) => (
        <div
          key={angle}
          style={{
            position: 'absolute',
            left: '29.7px',
            top: '25px',
            width: '2.6px',
            height: '9px',
            borderRadius: '2px',
            backgroundColor: '#191a2e',
            transform: `rotate(${angle}deg) translateY(-24px)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: '13.4px',
          top: '11.9px',
          width: '35.2px',
          height: '35.2px',
          borderRadius: '50%',
          backgroundColor: '#ffd23f',
          border: '2.6px solid #191a2e',
          display: 'flex',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '8px',
            top: '10px',
            width: '2.6px',
            height: '6.4px',
            borderRadius: '2px',
            backgroundColor: '#191a2e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '19px',
            top: '10px',
            width: '2.6px',
            height: '6.4px',
            borderRadius: '2px',
            backgroundColor: '#191a2e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '8px',
            top: '17.5px',
            width: '14.8px',
            height: '7.4px',
            borderBottom: '2.6px solid #191a2e',
            borderRadius: '0 0 14px 14px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '3.2px',
            top: '17px',
            width: '6.4px',
            height: '4.2px',
            borderRadius: '50%',
            backgroundColor: '#ff6a2b',
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '23px',
            top: '17px',
            width: '6.4px',
            height: '4.2px',
            borderRadius: '50%',
            backgroundColor: '#ff6a2b',
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  )
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3ecdf',
          backgroundImage:
            'radial-gradient(circle at 20px 20px, rgba(25, 26, 46, 0.08) 1.5px, transparent 0)',
          backgroundSize: '28px 28px',
          padding: '48px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fffaf1',
            borderRadius: '28px',
            border: '3px solid #191a2e',
            boxShadow: '14px 16px 0px #191a2e',
            padding: '52px 64px',
          }}
        >
          {/* Top Bar: Mark, Tag, Telemetry */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <SunBadge />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ff6a2b',
                  color: '#191a2e',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '2px solid #191a2e',
                  boxShadow: '3px 3px 0px #191a2e',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                }}
              >
                <span>✳</span>
                <span>DESIGN ENGINEER</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#5f5b6e',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.1em',
              }}
            >
              <span>JAKARTA, GMT+7</span>
              <span>·</span>
              <span>SIDE A / 2026</span>
            </div>
          </div>

          {/* Main Title & Lede */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#191a2e',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              Interfaces with a pulse.
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: '#5f5b6e',
                lineHeight: 1.4,
                margin: 0,
                maxWidth: '920px',
                fontWeight: 500,
              }}
            >
              Aditya Himawan — building product interfaces in React, Next.js,
              and TypeScript. Tactile design systems, honest motion, and
              thoughtful digital details.
            </p>
          </div>

          {/* Bottom Bar: Stack pills and domain */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '20px',
              borderTop: '2px dashed rgba(25, 26, 46, 0.18)',
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                'React',
                'Next.js',
                'TypeScript',
                'Design Systems',
                'Motion',
              ].map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#191a2e',
                    background: '#e8ebff',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1.5px solid rgba(25, 26, 46, 0.25)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#3d53d6',
                letterSpacing: '0.04em',
              }}
            >
              adityahimaone.space
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
