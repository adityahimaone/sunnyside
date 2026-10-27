'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import {
  MOTE_FRAGMENT,
  MOTE_VERTEX,
  SUN_FRAGMENT,
  SUN_VERTEX,
} from './sun-shader'
import { flareFromVelocity, sunFrame } from './sun-path'

/**
 * What the scroll bus writes and the render loop reads. A plain mutable object
 * rather than React state: it changes every frame while the page moves, and a
 * re-render per scroll event would cost far more than the sun itself.
 */
export type SunLive = {
  progress: number
  velocity: number
  pointerX: number
  pointerY: number
  dark: boolean
}

const damp = THREE.MathUtils.damp

/**
 * The sun disc, corona, rays and ghosts: one quad drawn in clip space, so the
 * camera never touches it and it always fills the viewport.
 */
function SunQuad({ live }: { live: { current: SunLive } }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const smoothed = useRef({ x: 0.84, y: 0.2, flare: 0, dark: 0, px: 0, py: 0 })

  useFrame(({ clock, size, gl }, delta) => {
    const mat = material.current
    if (!mat) return
    const frame = sunFrame(live.current.progress)
    const s = smoothed.current
    // Damping is what turns Lenis' steps into a sun that glides.
    s.x = damp(s.x, frame.x, 3.2, delta)
    s.y = damp(s.y, frame.y, 3.2, delta)
    s.flare = damp(
      s.flare,
      flareFromVelocity(live.current.velocity),
      4.5,
      delta,
    )
    s.dark = damp(s.dark, live.current.dark ? 1 : 0, 3, delta)
    s.px = damp(s.px, live.current.pointerX, 2.4, delta)
    s.py = damp(s.py, live.current.pointerY, 2.4, delta)

    const u = mat.uniforms
    ;(u.uRes.value as THREE.Vector2).set(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio(),
    )
    ;(u.uSun.value as THREE.Vector2).set(s.x, s.y)
    ;(u.uColor.value as THREE.Color).setRGB(
      frame.color[0],
      frame.color[1],
      frame.color[2],
    )
    ;(u.uPointer.value as THREE.Vector2).set(s.px, s.py)
    u.uRadius.value = frame.radius
    u.uIntensity.value = frame.intensity
    u.uFlare.value = s.flare
    u.uDark.value = s.dark
    u.uTime.value = clock.elapsedTime
  })

  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uSun: { value: new THREE.Vector2(0.84, 0.2) },
      uColor: { value: new THREE.Color(1, 0.6, 0.42) },
      uPointer: { value: new THREE.Vector2() },
      uRadius: { value: 0.05 },
      uIntensity: { value: 0.55 },
      uFlare: { value: 0 },
      uTime: { value: 0 },
      uDark: { value: 0 },
    }),
    [],
  )

  return (
    <mesh frustumCulled={false} renderOrder={0}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={SUN_VERTEX}
        fragmentShader={SUN_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/**
 * Dust in the light. A few dozen soft points at different depths: they drift up
 * on their own and slide against the page as it scrolls, deeper ones slower,
 * which is the cheapest honest way to say "there is air in front of this".
 */
function Motes({ live, count }: { live: { current: SunLive }; count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const smoothed = useRef({ scroll: 0, flare: 0, dark: 0, px: 0, py: 0 })

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const depths = new Float32Array(count)
    // Deterministic scatter: the same field on every load, no Math.random in
    // render, and nothing for hydration to disagree about.
    let state = 1337
    const rand = () => {
      state = (state * 1664525 + 1013904223) % 4294967296
      return state / 4294967296
    }
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (rand() - 0.5) * 14
      positions[i * 3 + 1] = (rand() - 0.5) * 12
      positions[i * 3 + 2] = -rand() * 5
      seeds[i] = rand()
      depths[i] = 1 - -positions[i * 3 + 2] / 5
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1))
    return g
  }, [count])

  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uFlare: { value: 0 },
      uDark: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color(1, 0.82, 0.55) },
    }),
    [],
  )

  useFrame(({ clock, gl }, delta) => {
    const mat = material.current
    if (!mat) return
    const s = smoothed.current
    const frame = sunFrame(live.current.progress)
    s.scroll = damp(s.scroll, live.current.progress, 2.2, delta)
    s.flare = damp(s.flare, flareFromVelocity(live.current.velocity), 4, delta)
    s.dark = damp(s.dark, live.current.dark ? 1 : 0, 3, delta)
    s.px = damp(s.px, live.current.pointerX, 2, delta)
    s.py = damp(s.py, live.current.pointerY, 2, delta)
    const u = mat.uniforms
    u.uTime.value = clock.elapsedTime
    u.uScroll.value = s.scroll
    u.uFlare.value = s.flare
    u.uDark.value = s.dark
    u.uPixelRatio.value = gl.getPixelRatio()
    ;(u.uPointer.value as THREE.Vector2).set(s.px, s.py)
    // The dust takes the light's colour, pulled toward white so it reads as
    // lit particles rather than tinted ones.
    ;(u.uColor.value as THREE.Color).setRGB(
      0.5 + frame.color[0] * 0.5,
      0.5 + frame.color[1] * 0.5,
      0.45 + frame.color[2] * 0.5,
    )
  })

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={1}>
      <shaderMaterial
        ref={material}
        vertexShader={MOTE_VERTEX}
        fragmentShader={MOTE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Frame-budget watchdog. If the page is already struggling, the sun is the
 * first thing to go: drop to 1x pixel ratio, and if that is not enough, tell
 * the parent to unmount the canvas. The sun is atmosphere; it never gets to
 * cost the page its scroll.
 */
function Watchdog({ onGiveUp }: { onGiveUp: () => void }) {
  const slow = useRef({ frames: 0, total: 0, downgraded: false, gaveUp: false })

  useFrame(({ setDpr }, delta) => {
    const w = slow.current
    if (w.gaveUp || delta > 0.5) return
    w.frames += 1
    w.total += delta
    if (w.frames < 90) return
    const average = w.total / w.frames
    w.frames = 0
    w.total = 0
    if (average < 0.03) return
    if (!w.downgraded) {
      w.downgraded = true
      setDpr(1)
      return
    }
    w.gaveUp = true
    onGiveUp()
  })

  return null
}

export default function SunCanvas({
  live,
  compact,
  active,
  onReady,
  onGiveUp,
}: {
  live: { current: SunLive }
  compact: boolean
  active: boolean
  onReady: () => void
  onGiveUp: () => void
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? 1 : [1, 1.35]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: 50, near: 0.1, far: 30, position: [0, 0, 6] }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={() => {
        requestAnimationFrame(() => requestAnimationFrame(onReady))
      }}
    >
      <SunQuad live={live} />
      <Motes live={live} count={compact ? 44 : 110} />
      <Watchdog onGiveUp={onGiveUp} />
    </Canvas>
  )
}
