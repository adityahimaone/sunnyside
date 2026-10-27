import { ImageResponse } from 'next/og'
import { WORK_PROJECTS } from '@/data/projects'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  const topStack = [
    'React',
    'Next.js',
    'TypeScript',
    'Go',
    'Tailwind CSS',
    'Vite',
  ]

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
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: '#3d53d6',
                  border: '2px solid #191a2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fffaf1',
                  fontSize: '22px',
                  fontWeight: 900,
                  boxShadow: '3px 3px 0px #191a2e',
                }}
              >
                AH
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffd23f',
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
                <span>01 / DISCOGRAPHY</span>
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
              <span>{WORK_PROJECTS.length} SHIPPED RELEASES</span>
              <span>·</span>
              <span>2022–26</span>
            </div>
          </div>

          {/* Main Title & Lede */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              Shipped Work & Experiments
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
              Production design engineering systems, tactile interfaces, and creative digital experiments.
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
              {topStack.map((tech) => (
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
              adityahimaone.space/projects
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
