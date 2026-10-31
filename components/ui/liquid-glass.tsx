'use client'

import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Liquid glass.
 *
 * A surface that behaves like a sheet of thick glass: it refracts what is behind
 * it, catches a specular highlight along its top edge, and bends light at the
 * rim. Three stacked layers do the work — a backdrop blur pushed through an SVG
 * displacement map, a translucent tint, and inset highlights — with the content
 * lifted above all three so type never gets distorted.
 *
 * The recipe is from the liquid-glass component on 21st.dev (see the filter
 * below); it is packaged here as a surface instead of a demo, because the site
 * needs it on the top bar, not on a dock.
 *
 * Costs, so nobody is surprised later:
 * - `backdrop-filter` plus an SVG `filter` on the same layer is a full re-render
 *   of that layer whenever the backdrop changes. Keep these surfaces short.
 * - `feTurbulence` is the expensive node. One instance per page, never animated.
 * - `prefers-reduced-transparency` gets a solid sheet instead.
 */

export const GLASS_FILTER_ID = 'liquid-glass-distortion'

type GlassFilterProps = {
  id?: string
  /** How far the glass bends what is behind it. 200 is a heavy pane. */
  scale?: number
  /**
   * Size of the ripples, in objectBoundingBox units. The 21st.dev default
   * (`0.001 0.005`) is tuned for a large square; on a 64px-tall bar it is so
   * low-frequency that the pane looks flat, so a short element needs a higher
   * frequency to show any liquid at all.
   */
  baseFrequency?: string
}

/**
 * The displacement map. Hidden, mounted once per page, referenced by
 * `filter: url(#…)` from every glass surface.
 */
export function GlassFilter({
  id = GLASS_FILTER_ID,
  scale = 200,
  baseFrequency = '0.001 0.005',
}: GlassFilterProps) {
  return (
    <svg aria-hidden focusable="false" style={{ display: 'none' }}>
      <filter
        id={id}
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  )
}

type GlassSurfaceProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Blur applied to the backdrop before it is displaced. */
  blur?: number
  /** Colour washed over the blurred backdrop. */
  tint?: string
  /** Corner radius. `0` gives a full-bleed sheet. */
  radius?: number | string
  /** Strength of the top and rim highlights, 0–1. */
  sheen?: number
  filterId?: string
}

/**
 * The glass itself. Drop it behind content: children render above the layers,
 * so a heading inside it stays sharp while the pane behind it ripples.
 */
export function GlassSurface({
  children,
  className,
  style,
  blur = 6,
  tint = 'rgba(255, 255, 255, 0.25)',
  radius = 0,
  sheen = 1,
  filterId = GLASS_FILTER_ID,
}: GlassSurfaceProps) {
  const r = typeof radius === 'number' ? `${radius}px` : radius

  return (
    <div
      className={cn('relative isolate overflow-hidden', className)}
      style={{ borderRadius: r, ...style }}
    >
      {/* Refraction: the backdrop is blurred, then bent through the map. */}
      <span
        aria-hidden
        className="glass-refract"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          borderRadius: r,
          WebkitBackdropFilter: `blur(${blur}px) saturate(1.6)`,
          backdropFilter: `blur(${blur}px) saturate(1.6)`,
          filter: `url(#${filterId})`,
        }}
      />
      {/* Tint: the body of the glass. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          borderRadius: r,
          background: tint,
        }}
      />
      {/* Specular: a bright top rim and a soft inner bounce. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          borderRadius: r,
          boxShadow: `inset 2px 2px 1px 0 rgba(255, 255, 255, ${0.5 * sheen}), inset -1px -1px 1px 1px rgba(255, 255, 255, ${0.5 * sheen})`,
        }}
      />
      {children ? (
        <div style={{ position: 'relative', zIndex: 3 }}>{children}</div>
      ) : null}
    </div>
  )
}
