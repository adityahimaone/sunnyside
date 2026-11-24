import * as THREE from 'three'

export type PaperCityController = {
  seek: (seconds: number) => void
  toggleBillboard: () => void
  boostTrains: () => void
  dispose: () => void
}

type MountOptions = {
  el: HTMLElement
  onReadout?: (text: string) => void
  introDelay?: number
  onToggleScale?: () => void
  onIntroComplete?: () => void
}

type HotItem = {
  group: THREE.Group
  name: string
  baseY: number
  lift: number
  vel: number
  kind?: 'billboard' | 'train' | 'card' | 'building'
}

type RoadVehicle = {
  group: THREE.Group
  wheels: THREE.Object3D[]
  wheelRadius: number
  offset: number
}

/* High-contrast Sunnyside palette: no mid-blue on buildings so nothing
   collides with the #2b3da8 cobalt cutting-mat background. */
const PAL = {
  ink: '#191a2e',
  slate: '#232642',
  slateHi: '#34385e',
  paper: '#fffaf1',
  cream: '#f3ecdf',
  creamLo: '#e9dfcf',
  sandstone: '#eadbc4',
  teal: '#2b9e7c',
  tealHi: '#48bd99',
  tealLo: '#1d7359',
  mint: '#b7e4c7',
  pink: '#ffb6e1',
  skyGlass: '#a9c8ff',
  warmGlass: '#ffe58f',
  butter: '#ffd23f',
  mustard: '#f4b928',
  tangerine: '#ff6a2b',
  terracotta: '#df4e22',
  grass: '#38a855',
  grassHi: '#58c474',
  leafLo: '#26783a',
  trunk: '#7c5230',
  steel: '#e8ebff',
  ballast: '#2e3252',
  asphalt: '#181a28',
} as const

export function mountPaperCity({
  el,
  onReadout,
  introDelay = 0,
  onToggleScale,
  onIntroComplete,
}: MountOptions): PaperCityController | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
  } catch {
    el.textContent =
      'Interactive 3D Paper City requires WebGL. Enable hardware acceleration to view.'
    return null
  }

  const isCompactViewport = window.innerWidth <= 768
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    isCompactViewport ? 1.5 : 2,
  )
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.shadowMap.autoUpdate = false
  renderer.shadowMap.needsUpdate = true
  renderer.toneMapping = THREE.NoToneMapping

  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  el.replaceChildren(canvas)

  const disposables = new Set<{ dispose: () => void }>()
  const own = <T extends { dispose: () => void }>(res: T): T => {
    disposables.add(res)
    return res
  }

  const matCache = new Map<string, THREE.MeshLambertMaterial>()
  const mat = (hex: string, emissiveHex?: string, emissiveIntensity = 0) => {
    const key = `${hex}:${emissiveHex ?? ''}:${emissiveIntensity}`
    let m = matCache.get(key)
    if (!m) {
      m = own(
        new THREE.MeshLambertMaterial({
          color: hex,
          ...(emissiveHex
            ? {
                emissive: new THREE.Color(emissiveHex),
                emissiveIntensity,
              }
            : {}),
        }),
      )
      matCache.set(key, m)
    }
    return m
  }

  const edgeMat = own(
    new THREE.LineBasicMaterial({
      color: PAL.ink,
      transparent: true,
      opacity: 0.85,
    }),
  )

  const addEdges = (
    mesh: THREE.Mesh,
    thresholdAngle = 38,
  ): THREE.LineSegments => {
    const eg = own(new THREE.EdgesGeometry(mesh.geometry, thresholdAngle))
    const lines = new THREE.LineSegments(eg, edgeMat)
    lines.renderOrder = 1
    mesh.add(lines)
    return lines
  }

  const boxGeoCache = new Map<string, THREE.BufferGeometry>()
  const getBoxGeo = (w: number, h: number, d: number) => {
    const k = `${w.toFixed(3)}:${h.toFixed(3)}:${d.toFixed(3)}`
    let g = boxGeoCache.get(k)
    if (!g) {
      const minDim = Math.min(w, h, d)
      if (minDim >= 0.34) {
        // Tactile rounded-edge geometry so buildings, trains, and vehicles have smooth chamfered/rounded corners
        const r = Math.min(0.11, minDim * 0.16)
        const iw = Math.max(0.02, w - r * 2)
        const ih = Math.max(0.02, h - r * 2)
        const id = Math.max(0.02, d - r * 2)
        const sh = new THREE.Shape()
        const hw = iw / 2
        const hh = ih / 2
        const cr = Math.min(r * 0.6, hw * 0.4, hh * 0.4)
        sh.moveTo(-hw + cr, -hh)
        sh.lineTo(hw - cr, -hh)
        sh.quadraticCurveTo(hw, -hh, hw, -hh + cr)
        sh.lineTo(hw, hh - cr)
        sh.quadraticCurveTo(hw, hh, hw - cr, hh)
        sh.lineTo(-hw + cr, hh)
        sh.quadraticCurveTo(-hw, hh, -hw, hh - cr)
        sh.lineTo(-hw, -hh + cr)
        sh.quadraticCurveTo(-hw, -hh, -hw + cr, -hh)
        const ext = new THREE.ExtrudeGeometry(sh, {
          depth: id,
          bevelEnabled: true,
          bevelThickness: r,
          bevelSize: r,
          bevelSegments: 2,
          curveSegments: 3,
        })
        ext.translate(0, 0, -id / 2)
        ext.computeVertexNormals()
        g = own(ext)
      } else {
        g = own(new THREE.BoxGeometry(w, h, d))
      }
      boxGeoCache.set(k, g)
    }
    return g
  }

  const addBox = (
    w: number,
    h: number,
    d: number,
    color: string,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D,
    opts: {
      edges?: boolean
      shadow?: boolean
      receive?: boolean
      emissive?: string
      emissiveIntensity?: number
    } = {},
  ) => {
    const m = new THREE.Mesh(
      getBoxGeo(w, h, d),
      mat(color, opts.emissive, opts.emissiveIntensity),
    )
    m.position.set(x, y, z)
    m.castShadow = opts.shadow ?? true
    m.receiveShadow = opts.receive ?? true
    if (opts.edges !== false) addEdges(m)
    parent.add(m)
    return m
  }

  const scene = new THREE.Scene()
  const world = new THREE.Group()
  scene.add(world)

  /* ── Studio Isometric Lighting ─────────────────────────────────────────── */
  const hemi = new THREE.HemisphereLight('#fffdf6', '#5666a8', 1.5)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight('#fff5e0', 2.1)
  sun.position.set(-18, 36, 22)
  sun.castShadow = true
  const shadowRes = isCompactViewport ? 1024 : 1536
  sun.shadow.mapSize.set(shadowRes, shadowRes)
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  sun.shadow.camera.left = -24
  sun.shadow.camera.right = 24
  sun.shadow.camera.top = 22
  sun.shadow.camera.bottom = -22
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 75
  scene.add(sun)

  const fill = new THREE.DirectionalLight('#b5cbff', 0.65)
  fill.position.set(22, 14, -18)
  scene.add(fill)

  /* ── Shadow-Catcher Ground over the Blue Cutting Mat ───────────────────── */
  const shadowPlane = new THREE.Mesh(
    own(new THREE.PlaneGeometry(64, 64)),
    own(new THREE.ShadowMaterial({ color: '#0c1238', opacity: 0.25 })),
  )
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = 0.005
  shadowPlane.receiveShadow = true
  world.add(shadowPlane)

  const hotItems: HotItem[] = []
  const registerHot = (
    group: THREE.Group,
    name: string,
    kind: HotItem['kind'] = 'building',
  ) => {
    group.userData.hotName = name
    hotItems.push({
      group,
      name,
      baseY: group.position.y,
      lift: 0,
      vel: 0,
      kind,
    })
  }

  /* ── Isometric Plinth Pads & Decorative Lawns ──────────────────────────── */
  const addPlinth = (
    w: number,
    d: number,
    x: number,
    z: number,
    h = 0.22,
    topColor: string = PAL.cream,
  ) => {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    addBox(w, h, d, topColor, 0, h / 2, 0, g, {
      shadow: true,
      receive: true,
      edges: true,
    })
    addBox(w + 0.16, 0.06, d + 0.16, PAL.creamLo, 0, 0.03, 0, g, {
      shadow: false,
      receive: true,
      edges: true,
    })
    world.add(g)
    return g
  }

  const addLawnPatch = (
    w: number,
    d: number,
    x: number,
    z: number,
    baseY = 0.22,
  ) => {
    const lg = new THREE.Group()
    lg.position.set(x, baseY, z)
    addBox(w + 0.16, 0.06, d + 0.16, PAL.paper, 0, 0.03, 0, lg)
    addBox(w, 0.08, d, PAL.grass, 0, 0.06, 0, lg)
    world.add(lg)
    return lg
  }

  // City zone plinths + green lawn patches (sized with clean pillar & road clearance)
  addPlinth(10.0, 10.0, -7.8, 7.6, 0.22) // Zone 1: Left loop
  addLawnPatch(6.8, 8.2, -7.6, 7.8, 0.22) // Zone 1 green neighborhood yard

  addPlinth(10.0, 10.0, -6.2, -7.4, 0.22) // Zone 2: Upper-center skyline
  addLawnPatch(4.8, 6.2, -8.2, -5.8, 0.22) // Zone 2 upper park lawn
  addLawnPatch(4.0, 3.8, -4.4, -10.2, 0.22)

  addPlinth(11.0, 9.8, 8.0, -6.8, 0.22) // Zone 3: Right tower block & billboard
  addLawnPatch(5.2, 3.6, 9.0, -9.5, 0.22) // Zone 3 green garden under billboard
  addLawnPatch(3.6, 3.4, 5.2, -9.4, 0.22)

  addPlinth(10.8, 2.8, 7.2, 2.7, 0.18) // Zone 4: Bus stop & house sidewalk strip (clean margin from street curb)
  addLawnPatch(9.8, 1.3, 7.2, 2.25, 0.18) // Zone 4 green verge strip behind bus stop

  /* ── Continuous Figure-8 Railway (C2 Smooth Ramps & INTERFACES Above Rail) ── */
  const VERTS: [number, number][] = [
    [0, 14],
    [0, -14],
    [15, -14],
    [15, 0],
    [-14, 0],
    [-14, 14],
  ]
  const R_FILLET = 4.2
  const NV = VERTS.length

  type Corner = {
    t1: [number, number]
    t2: [number, number]
    org: [number, number]
    r: number
    a1: number
    da: number
  }
  const corners: Corner[] = []
  for (let i = 0; i < NV; i++) {
    const pPrev = VERTS[(i - 1 + NV) % NV]
    const pCurr = VERTS[i]
    const pNext = VERTS[(i + 1) % NV]
    const dx1 = pPrev[0] - pCurr[0]
    const dz1 = pPrev[1] - pCurr[1]
    const l1 = Math.hypot(dx1, dz1)
    const dx2 = pNext[0] - pCurr[0]
    const dz2 = pNext[1] - pCurr[1]
    const l2 = Math.hypot(dx2, dz2)
    const u1: [number, number] = [dx1 / l1, dz1 / l1]
    const u2: [number, number] = [dx2 / l2, dz2 / l2]
    const cosT = Math.max(
      -0.9999,
      Math.min(0.9999, u1[0] * u2[0] + u1[1] * u2[1]),
    )
    const halfT = Math.acos(cosT) / 2
    const tanH = Math.tan(halfT)
    let d = R_FILLET / tanH
    let r = R_FILLET
    const maxD = Math.min(l1, l2) * 0.45
    if (d > maxD) {
      d = maxD
      r = d * tanH
    }
    const t1: [number, number] = [pCurr[0] + u1[0] * d, pCurr[1] + u1[1] * d]
    const t2: [number, number] = [pCurr[0] + u2[0] * d, pCurr[1] + u2[1] * d]
    const bx = u1[0] + u2[0]
    const bz = u1[1] + u2[1]
    const bl = Math.hypot(bx, bz)
    const distBO = r / Math.sin(halfT)
    const org: [number, number] = [
      pCurr[0] + (bx / bl) * distBO,
      pCurr[1] + (bz / bl) * distBO,
    ]
    const a1 = Math.atan2(t1[1] - org[1], t1[0] - org[0])
    const a2 = Math.atan2(t2[1] - org[1], t2[0] - org[0])
    let da = a2 - a1
    while (da > Math.PI) da -= Math.PI * 2
    while (da < -Math.PI) da += Math.PI * 2
    corners.push({ t1, t2, org, r, a1, da })
  }

  // First build the 2D closed path and cumulative 2D arc-length so the elevation
  // ramp is parameterized by continuous arc-length (zero segment boundary steps!)
  const xzPts: [number, number][] = []
  const accXZ: number[] = [0]
  let L_xz = 0
  let sBridgeXZ = 0
  let bridgeMark = false
  const pushXZ = (x: number, z: number) => {
    if (xzPts.length > 0) {
      const pr = xzPts[xzPts.length - 1]
      L_xz += Math.hypot(x - pr[0], z - pr[1])
      accXZ.push(L_xz)
    }
    xzPts.push([x, z])
  }

  for (let i = 0; i < NV; i++) {
    const c0 = corners[i]
    const c1 = corners[(i + 1) % NV]
    const nArc = Math.max(20, Math.ceil((Math.abs(c0.da) * c0.r) / 0.04))
    for (let k = 0; k < nArc; k++) {
      const ang = c0.a1 + c0.da * (k / nArc)
      pushXZ(c0.org[0] + Math.cos(ang) * c0.r, c0.org[1] + Math.sin(ang) * c0.r)
    }
    const slen = Math.hypot(c1.t1[0] - c0.t2[0], c1.t1[1] - c0.t2[1])
    const nSeg = Math.max(16, Math.ceil(slen / 0.04))
    for (let k = 0; k < nSeg; k++) {
      const fSeg = k / nSeg
      const sx = c0.t2[0] + (c1.t1[0] - c0.t2[0]) * fSeg
      const sz = c0.t2[1] + (c1.t1[1] - c0.t2[1]) * fSeg
      pushXZ(sx, sz)
      if (i === 0 && !bridgeMark && sz <= 0) {
        sBridgeXZ = L_xz
        bridgeMark = true
      }
    }
  }
  L_xz += Math.hypot(
    xzPts[0][0] - xzPts[xzPts.length - 1][0],
    xzPts[0][1] - xzPts[xzPts.length - 1][1],
  )

  const LOW_Y = 3.2
  const HIGH_Y = 5.8
  const FLAT_HALF_SPAN = 6.2
  const RAMP_END_SPAN = 20.5

  const elevationAtArcDistance = (ds: number): number => {
    if (ds <= FLAT_HALF_SPAN) return HIGH_Y
    if (ds < RAMP_END_SPAN) {
      const w = 1 - (ds - FLAT_HALF_SPAN) / (RAMP_END_SPAN - FLAT_HALF_SPAN)
      // Quintic C2 smoothstep: zero 1st and 2nd derivative at both ends
      const sm = w * w * w * (w * (w * 6 - 15) + 10)
      return LOW_Y + (HIGH_Y - LOW_Y) * sm
    }
    return LOW_Y
  }

  const dense: [number, number, number][] = []
  const acc: number[] = [0]
  let L = 0
  let prev: [number, number, number] | null = null

  for (let i = 0; i <= xzPts.length; i++) {
    const idx = i % xzPts.length
    const pt = xzPts[idx]
    const sXZ = i === xzPts.length ? L_xz : accXZ[idx]
    let ds = Math.abs(sXZ - sBridgeXZ)
    ds = Math.min(ds, L_xz - ds)
    const y = elevationAtArcDistance(ds)
    if (prev) {
      L += Math.hypot(pt[0] - prev[0], y - prev[1], pt[1] - prev[2])
      acc.push(L)
    }
    prev = [pt[0], y, pt[1]]
    dense.push(prev)
  }

  const M = 440
  const PX: number[] = []
  const PY: number[] = []
  const PZ: number[] = []
  let jIdx = 0
  for (let i = 0; i < M; i++) {
    const s0 = (i * L) / M
    while (jIdx + 1 < acc.length && acc[jIdx + 1] < s0) jIdx++
    const d0 = acc[jIdx + 1] - acc[jIdx]
    const f = d0 > 0 ? (s0 - acc[jIdx]) / d0 : 0
    PX.push(dense[jIdx][0] + (dense[jIdx + 1][0] - dense[jIdx][0]) * f)
    PY.push(dense[jIdx][1] + (dense[jIdx + 1][1] - dense[jIdx][1]) * f)
    PZ.push(dense[jIdx][2] + (dense[jIdx + 1][2] - dense[jIdx][2]) * f)
  }
  const STEP = L / M

  const nearestTrackY = (qx: number, qz: number): number => {
    let bestD = Infinity
    let bestY = LOW_Y
    for (let i = 0; i < M; i++) {
      const d = Math.hypot(PX[i] - qx, PZ[i] - qz)
      if (d < bestD) {
        bestD = d
        bestY = PY[i]
      }
    }
    return bestY
  }

  const atRail = (s: number, out: THREE.Vector3) => {
    const sn = ((s % L) + L) % L
    const k0 = Math.floor(sn / STEP)
    const g = sn / STEP - k0
    const k1 = k0 % M
    const k2 = (k1 + 1) % M
    out.set(
      PX[k1] + (PX[k2] - PX[k1]) * g,
      PY[k1] + (PY[k2] - PY[k1]) * g,
      PZ[k1] + (PZ[k2] - PZ[k1]) * g,
    )
    return out
  }

  const pFront = new THREE.Vector3()
  const pBack = new THREE.Vector3()
  const poseOnRail = (g: THREE.Object3D, s: number, halfSpan: number) => {
    atRail(s + halfSpan, pFront)
    atRail(s - halfSpan, pBack)
    const dx = pFront.x - pBack.x
    const dy = pFront.y - pBack.y
    const dz = pFront.z - pBack.z
    g.position.set(
      (pFront.x + pBack.x) * 0.5,
      (pFront.y + pBack.y) * 0.5,
      (pFront.z + pBack.z) * 0.5,
    )
    g.rotation.order = 'YXZ'
    g.rotation.y = Math.atan2(-dz, dx)
    g.rotation.z = Math.atan2(dy, Math.hypot(dx, dz))
  }

  /* ── Sweep Continuous 3D Track Profiles (No External Stubs) ────────────── */
  type Frame3D = {
    p: THREE.Vector3
    r: THREE.Vector3
    u: THREE.Vector3
    t: THREE.Vector3
  }

  const buildFrames = (pts: THREE.Vector3[], closed: boolean): Frame3D[] => {
    const n = pts.length
    const up = new THREE.Vector3(0, 1, 0)
    return pts.map((p, idx) => {
      const pPrev = pts[closed ? (idx - 1 + n) % n : Math.max(0, idx - 1)]
      const pNext = pts[closed ? (idx + 1) % n : Math.min(n - 1, idx + 1)]
      const t = pNext.clone().sub(pPrev).normalize()
      const r = new THREE.Vector3().crossVectors(t, up).normalize()
      const u = new THREE.Vector3().crossVectors(r, t).normalize()
      return { p, r, u, t }
    })
  }

  const sweepProfile = (
    frames: Frame3D[],
    profile: [number, number][],
    closed: boolean,
  ): THREE.BufferGeometry => {
    const nF = frames.length
    const nP = profile.length
    const positions: number[] = []
    const indices: number[] = []

    const v = new THREE.Vector3()
    for (let i = 0; i < nF; i++) {
      const fr = frames[i]
      for (let j = 0; j < nP; j++) {
        const [px, py] = profile[j]
        v.copy(fr.p).addScaledVector(fr.r, px).addScaledVector(fr.u, py)
        positions.push(v.x, v.y, v.z)
      }
    }

    const ringCount = closed ? nF : nF - 1
    for (let i = 0; i < ringCount; i++) {
      const iNext = (i + 1) % nF
      for (let j = 0; j < nP; j++) {
        const jNext = (j + 1) % nP
        const a = i * nP + j
        const b = iNext * nP + j
        const c = iNext * nP + jNext
        const d = i * nP + jNext
        indices.push(a, b, c, a, c, d)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    const nonIndexed = own(geo.toNonIndexed())
    geo.dispose()
    nonIndexed.computeVertexNormals()
    return nonIndexed
  }

  const loopPts = PX.map(
    (_, idx) => new THREE.Vector3(PX[idx], PY[idx], PZ[idx]),
  )
  const loopFrames = buildFrames(loopPts, true)

  const deckProfile: [number, number][] = [
    [-1.08, -0.36],
    [1.08, -0.36],
    [1.08, 0.14],
    [0.92, 0.14],
    [0.92, 0.0],
    [-0.92, 0.0],
    [-0.92, 0.14],
    [-1.08, 0.14],
  ]
  const ballastProfile: [number, number][] = [
    [-0.78, 0.0],
    [0.78, 0.0],
    [0.72, 0.06],
    [-0.72, 0.06],
  ]
  const leftRailProfile: [number, number][] = [
    [-0.56, 0.06],
    [-0.45, 0.06],
    [-0.45, 0.16],
    [-0.56, 0.16],
  ]
  const rightRailProfile: [number, number][] = [
    [0.45, 0.06],
    [0.56, 0.06],
    [0.56, 0.16],
    [0.45, 0.16],
  ]

  const railwayGroup = new THREE.Group()
  railwayGroup.userData.dropWave = 'viaduct'
  world.add(railwayGroup)

  const buildTrackSegment = (frames: Frame3D[], closed: boolean) => {
    const deckMesh = new THREE.Mesh(
      sweepProfile(frames, deckProfile, closed),
      mat(PAL.slate),
    )
    deckMesh.castShadow = true
    deckMesh.receiveShadow = true
    railwayGroup.add(deckMesh)

    const ballastMesh = new THREE.Mesh(
      sweepProfile(frames, ballastProfile, closed),
      mat(PAL.ballast),
    )
    ballastMesh.receiveShadow = true
    railwayGroup.add(ballastMesh)

    const railL = new THREE.Mesh(
      sweepProfile(frames, leftRailProfile, closed),
      mat(PAL.steel),
    )
    const railR = new THREE.Mesh(
      sweepProfile(frames, rightRailProfile, closed),
      mat(PAL.steel),
    )
    railwayGroup.add(railL, railR)

    for (const side of [-1.08, 1.08]) {
      const curbPts = frames.map((fr) =>
        fr.p.clone().addScaledVector(fr.r, side).addScaledVector(fr.u, 0.14),
      )
      if (closed) curbPts.push(curbPts[0].clone())
      const lg = own(new THREE.BufferGeometry().setFromPoints(curbPts))
      railwayGroup.add(new THREE.Line(lg, edgeMat))
    }
  }

  buildTrackSegment(loopFrames, true)

  // Instanced sleepers (cross-ties) along the figure-8 loop
  const nSleepers = Math.floor(L / 0.58)
  const sleeperGeo = own(new THREE.BoxGeometry(0.18, 0.04, 1.38))
  const sleeperInst = own(
    new THREE.InstancedMesh(sleeperGeo, mat(PAL.creamLo), nSleepers),
  )
  const dummy = new THREE.Object3D()
  for (let i = 0; i < nSleepers; i++) {
    poseOnRail(dummy, i * 0.58, 0.15)
    dummy.position.y += 0.055
    dummy.updateMatrix()
    sleeperInst.setMatrixAt(i, dummy.matrix)
  }
  sleeperInst.instanceMatrix.needsUpdate = true
  railwayGroup.add(sleeperInst)

  /* ── INTERFACES Upper Grand Viaduct (x = 0, z in [-7.6, 7.6]) ─────────── */
  const buildInterfacesViaduct = () => {
    const g = new THREE.Group()
    g.userData.dropWave = 'viaduct'
    g.position.set(0, 0, 0)

    const sh = new THREE.Shape()
    sh.moveTo(-7.6, 0)
    sh.lineTo(-6.1, 0)
    // Arch 1: Terrace promenade arch at z = -4.8
    sh.lineTo(-6.1, 2.9)
    sh.absarc(-4.8, 2.9, 1.3, Math.PI, 0, true)
    sh.lineTo(-3.5, 0)
    sh.lineTo(-1.9, 0)
    // Arch 2: Railway crossing portal at z = 0.0 (lower track passes at y = 3.20)
    sh.lineTo(-1.9, 3.2)
    sh.absarc(0.0, 3.2, 1.9, Math.PI, 0, true)
    sh.lineTo(1.9, 0)
    sh.lineTo(3.6, 0)
    // Arch 3: Street portal arch at z = 5.4 (street & bus pass at y = 0.02)
    sh.lineTo(3.6, 2.5)
    sh.absarc(5.4, 2.5, 1.8, Math.PI, 0, true)
    sh.lineTo(7.2, 0)
    sh.lineTo(7.6, 0)
    // Contour top edge to match exact underside of upper bridge deck
    const nTop = 32
    for (let ti = 0; ti <= nTop; ti++) {
      const sz = 7.6 - (ti / nTop) * 15.2
      const topY = elevationAtArcDistance(Math.abs(sz)) - 0.36
      sh.lineTo(sz, topY)
    }
    sh.closePath()

    const geo = own(
      new THREE.ExtrudeGeometry(sh, {
        depth: 2.16,
        bevelEnabled: false,
        curveSegments: 24,
      }),
    )
    geo.translate(0, 0, -1.08)
    geo.rotateY(Math.PI / 2)

    const mesh = new THREE.Mesh(geo, mat(PAL.cream))
    mesh.castShadow = true
    mesh.receiveShadow = true
    addEdges(mesh, 20)
    g.add(mesh)

    // Classical pier footings, butter-gold belt course & upper parapet beam for INTERFACES letters
    for (const pz of [-6.85, -2.7, 2.75, 7.4]) {
      addBox(2.36, 0.28, 1.3, PAL.paper, 0, 0.14, pz, g)
      addBox(2.28, 0.18, 1.2, PAL.butter, 0, 3.2, pz, g)
    }
    // Dedicated elevated signage shelf along the front-right edge of the upper rail deck
    addBox(0.56, 0.28, 12.2, PAL.slate, 1.12, HIGH_Y + 0.02, 0, g)
    addBox(0.62, 0.1, 12.3, PAL.butter, 1.12, HIGH_Y + 0.18, 0, g)

    world.add(g)
    registerHot(g, 'interfaces grand viaduct')
  }
  buildInterfacesViaduct()

  // 2. Dark Multi-Arch Viaduct Walls under the z = 0 lower train spine
  const buildMultiArchViaduct = (
    xStart: number,
    xEnd: number,
    nArches: number,
  ) => {
    const g = new THREE.Group()
    g.userData.dropWave = 'viaduct'
    const totalW = xEnd - xStart
    const cx = (xStart + xEnd) * 0.5
    g.position.set(cx, 0, 0)

    const H = LOW_Y - 0.36
    const pierW = 0.85
    const span = (totalW - pierW * (nArches + 1)) / nArches
    const archR = span * 0.5
    const springY = Math.max(0.8, H - archR - 0.35)

    const sh = new THREE.Shape()
    sh.moveTo(-totalW / 2, 0)
    for (let i = 0; i < nArches; i++) {
      const aLeft = -totalW / 2 + pierW * (i + 1) + span * i
      const aCenter = aLeft + archR
      const aRight = aLeft + span
      sh.lineTo(aLeft, 0)
      sh.lineTo(aLeft, springY)
      sh.absarc(aCenter, springY, archR, Math.PI, 0, true)
      sh.lineTo(aRight, 0)
    }
    sh.lineTo(totalW / 2, 0)
    sh.lineTo(totalW / 2, H)
    sh.lineTo(-totalW / 2, H)
    sh.closePath()

    const geo = own(
      new THREE.ExtrudeGeometry(sh, {
        depth: 1.76,
        bevelEnabled: false,
        curveSegments: 18,
      }),
    )
    geo.translate(0, 0, -0.88)

    const mesh = new THREE.Mesh(geo, mat(PAL.slate))
    mesh.castShadow = true
    mesh.receiveShadow = true
    addEdges(mesh, 20)
    g.add(mesh)

    for (let i = 0; i <= nArches; i++) {
      const px = -totalW / 2 + pierW * 0.5 + i * (span + pierW)
      addBox(pierW + 0.24, 0.22, 1.96, PAL.cream, px, 0.11, 0, g)
    }
    world.add(g)
  }
  buildMultiArchViaduct(-12.2, -2.4, 3)
  buildMultiArchViaduct(2.4, 13.0, 3)

  // 3. Cylindrical Flanged Viaduct Pillars (zero collision with roads or plinths)
  const pillarXZ: [number, number][] = [
    [0, -9.8],
    [0.8, -12.8],
    [4.2, -14.0],
    [8.0, -14.0],
    [11.8, -13.6],
    [14.8, -10.5],
    [15.0, -6.8],
    [14.6, -3.2],
    [-13.8, 3.4],
    [-14.0, 7.2],
    [-13.6, 11.0],
    [-10.8, 13.8],
    [-7.2, 14.0],
    [-3.8, 13.8],
    [-0.8, 12.6],
  ]
  const baseGeo = own(new THREE.CylinderGeometry(0.66, 0.74, 0.24, 16))
  const capGeo = own(new THREE.CylinderGeometry(0.68, 0.56, 0.32, 16))
  for (const [px, pz] of pillarXZ) {
    const deckY = nearestTrackY(px, pz)
    const h = Math.max(1.2, deckY - 0.36)
    const pg = new THREE.Group()
    pg.userData.dropWave = 'viaduct'
    pg.position.set(px, 0, pz)
    const shaft = new THREE.Mesh(
      own(new THREE.CylinderGeometry(0.46, 0.52, h, 16)),
      mat(PAL.slate),
    )
    shaft.position.y = h * 0.5
    shaft.castShadow = true
    const cap = new THREE.Mesh(capGeo, mat(PAL.ink))
    cap.position.y = h - 0.12
    const footing = new THREE.Mesh(baseGeo, mat(PAL.cream))
    footing.position.y = 0.12
    addEdges(footing, 25)
    pg.add(shaft, cap, footing)
    world.add(pg)
  }

  /* ── INTERFACES True 3D Extruded Block Letters ABOVE the Rail Deck ─────── */
  const poly = (pts: [number, number][]) => {
    const sh = new THREE.Shape()
    pts.forEach(([x, y], idx) => {
      if (idx === 0) sh.moveTo(x, y)
      else sh.lineTo(x, y)
    })
    sh.closePath()
    return sh
  }
  const hole = (pts: [number, number][]) => {
    const pth = new THREE.Path()
    pts.forEach(([x, y], idx) => {
      if (idx === 0) pth.moveTo(x, y)
      else pth.lineTo(x, y)
    })
    pth.closePath()
    return pth
  }

  const makeLetterShape = (ch: string): THREE.Shape => {
    switch (ch) {
      case 'I':
        return poly([
          [-0.22, 0],
          [0.22, 0],
          [0.22, 1.65],
          [-0.22, 1.65],
        ])
      case 'T':
        return poly([
          [-0.2, 0],
          [0.2, 0],
          [0.2, 1.28],
          [0.52, 1.28],
          [0.52, 1.65],
          [-0.52, 1.65],
          [-0.52, 1.28],
          [-0.2, 1.28],
        ])
      case 'F':
        return poly([
          [-0.48, 0],
          [-0.1, 0],
          [-0.1, 0.68],
          [0.36, 0.68],
          [0.36, 1.02],
          [-0.1, 1.02],
          [-0.1, 1.3],
          [0.48, 1.3],
          [0.48, 1.65],
          [-0.48, 1.65],
        ])
      case 'E':
        return poly([
          [-0.48, 0],
          [0.48, 0],
          [0.48, 0.34],
          [-0.1, 0.34],
          [-0.1, 0.66],
          [0.38, 0.66],
          [0.38, 0.98],
          [-0.1, 0.98],
          [-0.1, 1.31],
          [0.48, 1.31],
          [0.48, 1.65],
          [-0.48, 1.65],
        ])
      case 'N':
        return poly([
          [-0.5, 0],
          [-0.14, 0],
          [-0.14, 0.96],
          [0.18, 0],
          [0.5, 0],
          [0.5, 1.65],
          [0.14, 1.65],
          [0.14, 0.68],
          [-0.18, 1.65],
          [-0.5, 1.65],
        ])
      case 'A': {
        const s = poly([
          [-0.54, 0],
          [-0.16, 0],
          [-0.08, 0.36],
          [0.08, 0.36],
          [0.16, 0],
          [0.54, 0],
          [0.2, 1.65],
          [-0.2, 1.65],
        ])
        s.holes.push(
          hole([
            [-0.07, 0.68],
            [0.07, 0.68],
            [0, 1.22],
          ]),
        )
        return s
      }
      case 'R': {
        const s = poly([
          [-0.48, 0],
          [-0.1, 0],
          [-0.1, 0.62],
          [0.04, 0.62],
          [0.18, 0],
          [0.54, 0],
          [0.34, 0.68],
          [0.48, 0.84],
          [0.48, 1.46],
          [0.32, 1.65],
          [-0.48, 1.65],
        ])
        s.holes.push(
          hole([
            [-0.1, 0.94],
            [0.12, 0.94],
            [0.12, 1.32],
            [-0.1, 1.32],
          ]),
        )
        return s
      }
      case 'C':
        return poly([
          [0.48, 0.42],
          [0.48, 0.16],
          [0.3, 0],
          [-0.28, 0],
          [-0.48, 0.2],
          [-0.48, 1.45],
          [-0.28, 1.65],
          [0.3, 1.65],
          [0.48, 1.48],
          [0.48, 1.2],
          [0.12, 1.2],
          [0.12, 1.32],
          [-0.1, 1.32],
          [-0.1, 0.34],
          [0.12, 0.34],
          [0.12, 0.42],
        ])
      case 'S':
      default:
        return poly([
          [-0.48, 0.38],
          [-0.12, 0.38],
          [-0.12, 0.3],
          [0.12, 0.3],
          [0.12, 0.62],
          [-0.32, 0.76],
          [-0.48, 0.94],
          [-0.48, 1.46],
          [-0.28, 1.65],
          [0.28, 1.65],
          [0.48, 1.46],
          [0.48, 1.22],
          [0.12, 1.22],
          [0.12, 1.34],
          [-0.1, 1.34],
          [-0.1, 1.04],
          [0.34, 0.9],
          [0.48, 0.72],
          [0.48, 0.2],
          [0.28, 0],
          [-0.28, 0],
          [-0.48, 0.2],
        ])
    }
  }

  // Stand all 10 letters ON TOP of the upper rail deck parapet (y = HIGH_Y + 0.22 = 6.02, ABOVE the rail!)
  // Positioned at x = 1.04 so the train on x = 0 (width 1.36) glides smoothly behind the letters with zero clipping
  const word = 'INTERFACES'
  const letterFaceMat = mat(PAL.paper, PAL.paper, 0.18)
  const letterSideMat = mat(PAL.ink)
  for (let i = 0; i < word.length; i++) {
    const lz = (4.5 - i) * 1.18
    const ly = HIGH_Y + 0.22
    const lg = new THREE.Group()
    lg.position.set(1.04, ly, lz)
    lg.rotation.y = Math.PI / 2

    const lGeo = own(
      new THREE.ExtrudeGeometry(makeLetterShape(word[i]), {
        depth: 0.44,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2,
      }),
    )
    lGeo.translate(0, 0, -0.22)
    const lMesh = new THREE.Mesh(lGeo, [letterFaceMat, letterSideMat])
    lMesh.castShadow = true
    lMesh.receiveShadow = true
    addEdges(lMesh, 24)
    lg.add(lMesh)
    world.add(lg)
  }

  /* ── Sculpted Articulated Trains ───────────────────────────────────────── */
  const makeSidePlaqueTexture = (label: string, bg: string, fg: string) => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 128
    const ctx = c.getContext('2d')!
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = fg
    ctx.font = '900 78px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, c.width / 2, c.height / 2 + 4)
    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }

  const wheelCylGeo = own(new THREE.CylinderGeometry(0.18, 0.18, 0.14, 12))
  wheelCylGeo.rotateX(Math.PI / 2)

  type CarSpec = {
    bodyColor: string
    roofColor: string
    isLead?: boolean
    isCargo?: boolean
    isCamper?: boolean
    hasTurret?: boolean
    label?: string
  }

  const CAR_LEN = 2.75
  const CAR_GAP = 3.02

  const buildTrainCar = (spec: CarSpec, parent: THREE.Object3D) => {
    const g = new THREE.Group()
    parent.add(g)

    addBox(CAR_LEN - 0.16, 0.22, 1.38, PAL.ink, 0, 0.25, 0, g)
    for (const bx of [-0.82, 0.82]) {
      for (const bz of [-0.62, 0.62]) {
        const w = new THREE.Mesh(wheelCylGeo, mat(PAL.slateHi))
        w.position.set(bx, 0.18, bz)
        g.add(w)
      }
    }

    addBox(CAR_LEN, 1.02, 1.44, spec.bodyColor, 0, 0.84, 0, g)
    addBox(CAR_LEN - 0.2, 0.14, 1.3, spec.roofColor, 0, 1.42, 0, g)
    if (!spec.isCargo) {
      addBox(0.65, 0.1, 0.68, PAL.creamLo, -0.45, 1.52, 0, g)
      addBox(0.65, 0.1, 0.68, PAL.creamLo, 0.45, 1.52, 0, g)
    }

    if (spec.hasTurret) {
      addBox(1.1, 0.36, 1.16, spec.bodyColor, 0.2, 1.62, 0, g)
      addBox(1.14, 0.22, 1.2, PAL.ink, 0.2, 1.62, 0, g, { edges: false })
    }

    if (spec.isCamper) {
      addBox(CAR_LEN + 0.02, 0.46, 1.46, PAL.paper, 0, 1.08, 0, g)
    }

    if (spec.isCargo) {
      for (let rx = -0.9; rx <= 0.9; rx += 0.45) {
        addBox(0.1, 0.86, 1.48, PAL.tealHi, rx, 0.84, 0, g, {
          edges: false,
        })
      }
    } else {
      for (let wx = -0.84; wx <= 0.84; wx += 0.56) {
        addBox(0.42, 0.36, 1.47, PAL.paper, wx, 1.02, 0, g, { edges: false })
        addBox(0.36, 0.3, 1.49, PAL.skyGlass, wx, 1.02, 0, g, { edges: false })
      }
    }

    if (spec.isLead) {
      addBox(0.12, 0.38, 1.24, PAL.ink, CAR_LEN / 2 + 0.02, 1.02, 0, g)
      for (const hz of [-0.42, 0.42]) {
        addBox(0.08, 0.16, 0.2, PAL.butter, CAR_LEN / 2 + 0.03, 0.54, hz, g, {
          edges: false,
          emissive: PAL.butter,
          emissiveIntensity: 0.6,
        })
      }
    } else {
      addBox(0.28, 0.88, 1.05, PAL.slate, CAR_LEN / 2 + 0.14, 0.8, 0, g)
    }

    if (spec.label) {
      const plaqueTex = makeSidePlaqueTexture(
        spec.label,
        spec.bodyColor,
        PAL.ink,
      )
      const plaqueMat = own(new THREE.MeshBasicMaterial({ map: plaqueTex }))
      const plaqueGeo = own(new THREE.PlaneGeometry(CAR_LEN - 0.35, 0.42))
      const p1 = new THREE.Mesh(plaqueGeo, plaqueMat)
      p1.position.set(0, 0.56, 0.735)
      const p2 = new THREE.Mesh(plaqueGeo, plaqueMat)
      p2.position.set(0, 0.56, -0.735)
      p2.rotation.y = Math.PI
      g.add(p1, p2)
    }

    return g
  }

  const orangeGroup = new THREE.Group()
  world.add(orangeGroup)
  const orangeCars = [
    buildTrainCar(
      { bodyColor: PAL.tangerine, roofColor: PAL.paper, isLead: true },
      orangeGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.tangerine, roofColor: PAL.paper, label: 'SIDE A' },
      orangeGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.tangerine, roofColor: PAL.paper, label: 'EXPRESS' },
      orangeGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.teal, roofColor: PAL.cream, isCargo: true },
      orangeGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.tangerine, roofColor: PAL.paper, isCamper: true },
      orangeGroup,
    ),
  ]
  registerHot(orangeGroup, 'side a express train', 'train')

  const yellowGroup = new THREE.Group()
  world.add(yellowGroup)
  const yellowCars = [
    buildTrainCar(
      {
        bodyColor: PAL.butter,
        roofColor: PAL.cream,
        isLead: true,
        hasTurret: true,
      },
      yellowGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.mustard, roofColor: PAL.paper },
      yellowGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.tangerine, roofColor: PAL.paper },
      yellowGroup,
    ),
    buildTrainCar(
      { bodyColor: PAL.tangerine, roofColor: PAL.paper },
      yellowGroup,
    ),
  ]
  registerHot(yellowGroup, 'yellow local train', 'train')

  /* ── Sculpted Architectural Helpers (High-Contrast Palette, Zero Blue) ─── */
  const buildGabledHouse = (
    x: number,
    z: number,
    yaw: number,
    wallColor: string,
    roofColor: string,
    scale = 1,
  ) => {
    const g = new THREE.Group()
    g.position.set(x, 0.22, z)
    g.rotation.y = yaw

    const w = 2.05 * scale
    const h = 1.38 * scale
    const d = 1.85 * scale

    addBox(w + 0.14, 0.14, d + 0.14, PAL.creamLo, 0, 0.07, 0, g)
    addBox(w, h, d, wallColor, 0, 0.14 + h / 2, 0, g)

    const rw = w + 0.34
    const rh = 0.96 * scale
    const rd = d + 0.32
    const rShape = new THREE.Shape()
    rShape.moveTo(-rd / 2, 0)
    rShape.lineTo(rd / 2, 0)
    rShape.lineTo(0, rh)
    rShape.closePath()
    const rGeo = own(
      new THREE.ExtrudeGeometry(rShape, {
        depth: rw,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 2,
      }),
    )
    rGeo.translate(0, 0, -rw / 2)
    rGeo.rotateY(Math.PI / 2)
    const rMesh = new THREE.Mesh(rGeo, mat(roofColor))
    rMesh.position.y = 0.14 + h
    rMesh.castShadow = true
    rMesh.receiveShadow = true
    addEdges(rMesh)
    g.add(rMesh)

    addBox(
      0.34,
      0.65,
      0.34,
      PAL.ink,
      0.48 * scale,
      0.14 + h + rh * 0.55,
      -0.28 * scale,
      g,
    )

    addBox(
      0.42,
      0.78,
      0.08,
      PAL.ink,
      -0.42 * scale,
      0.14 + 0.39,
      d / 2 + 0.02,
      g,
    )
    addBox(0.56, 0.1, 0.28, PAL.creamLo, -0.42 * scale, 0.09, d / 2 + 0.12, g)

    addBox(
      0.52,
      0.48,
      0.07,
      PAL.paper,
      0.44 * scale,
      0.14 + 0.82 * scale,
      d / 2 + 0.02,
      g,
    )
    addBox(
      0.4,
      0.36,
      0.09,
      PAL.warmGlass,
      0.44 * scale,
      0.14 + 0.82 * scale,
      d / 2 + 0.02,
      g,
      {
        edges: false,
      },
    )
    addBox(0.07, 0.46, 0.48, PAL.paper, w / 2 + 0.02, 0.14 + 0.82 * scale, 0, g)
    addBox(
      0.09,
      0.34,
      0.36,
      PAL.warmGlass,
      w / 2 + 0.02,
      0.14 + 0.82 * scale,
      0,
      g,
      {
        edges: false,
      },
    )

    world.add(g)
    registerHot(g, 'gabled house')
    return g
  }

  const buildSkyscraper = (
    x: number,
    z: number,
    w: number,
    d: number,
    h: number,
    kind:
      | 'spire-teal'
      | 'spire-charcoal'
      | 'bands-terracotta'
      | 'bands-charcoal'
      | 'ivory'
      | 'teal',
  ) => {
    const g = new THREE.Group()
    g.position.set(x, 0.22, z)

    // Warm cream limestone base lobby
    addBox(w + 0.28, 0.36, d + 0.28, PAL.paper, 0, 0.18, 0, g)

    if (kind === 'spire-teal' || kind === 'spire-charcoal') {
      const isTeal = kind === 'spire-teal'
      const c1 = isTeal ? PAL.teal : PAL.slate
      const c2 = isTeal ? PAL.tealHi : PAL.slateHi
      const h1 = h * 0.48
      const h2 = h * 0.28
      const h3 = h * 0.24
      addBox(w, h1, d, c1, 0, 0.36 + h1 / 2, 0, g)
      addBox(w + 0.16, 0.16, d + 0.16, PAL.paper, 0, 0.36 + h1, 0, g)
      addBox(w * 0.76, h2, d * 0.76, c2, 0, 0.36 + h1 + h2 / 2, 0, g)
      addBox(w * 0.82, 0.14, d * 0.82, PAL.paper, 0, 0.36 + h1 + h2, 0, g)
      addBox(w * 0.5, h3, d * 0.5, c2, 0, 0.36 + h1 + h2 + h3 / 2, 0, g)
      const dome = new THREE.Mesh(
        own(
          new THREE.SphereGeometry(
            w * 0.23,
            16,
            12,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55,
          ),
        ),
        mat(PAL.butter),
      )
      dome.position.y = 0.36 + h
      dome.castShadow = true
      g.add(dome)
      const cone = new THREE.Mesh(
        own(new THREE.ConeGeometry(w * 0.14, 1.85, 16)),
        mat(PAL.butter),
      )
      cone.position.y = 0.36 + h + 1.05
      cone.castShadow = true
      g.add(cone)
      addBox(0.09, 1.5, 0.09, PAL.ink, 0, 0.36 + h + 2.4, 0, g)
    } else if (kind === 'bands-terracotta' || kind === 'bands-charcoal') {
      const bodyC = kind === 'bands-terracotta' ? PAL.tangerine : PAL.slate
      const capC = kind === 'bands-terracotta' ? PAL.butter : PAL.tealHi
      addBox(w, h, d, bodyC, 0, 0.36 + h / 2, 0, g)
      addBox(w + 0.2, 0.24, d + 0.2, PAL.paper, 0, 0.36 + h + 0.12, 0, g)
      addBox(w * 0.58, 0.65, d * 0.58, capC, 0, 0.36 + h + 0.56, 0, g)
      const nBands = Math.floor(h / 1.05)
      for (let b = 1; b < nBands; b++) {
        addBox(w + 0.08, 0.18, d + 0.08, PAL.paper, 0, 0.36 + b * 1.05, 0, g, {
          edges: false,
        })
      }
      // Rooftop mini garden on banded tower
      addBox(w * 0.82, 0.08, d * 0.82, PAL.grassHi, 0, 0.36 + h + 0.26, 0, g)
    } else if (kind === 'ivory') {
      addBox(w, h, d, PAL.paper, 0, 0.36 + h / 2, 0, g)
      addBox(w + 0.18, 0.26, d + 0.18, PAL.ink, 0, 0.36 + h + 0.13, 0, g)
      addBox(w * 0.48, 0.72, d * 0.48, PAL.butter, 0, 0.36 + h + 0.6, 0, g)
    } else {
      addBox(w, h, d, PAL.teal, 0, 0.36 + h / 2, 0, g)
      addBox(w + 0.2, 0.26, d + 0.2, PAL.ink, 0, 0.36 + h + 0.13, 0, g)
      addBox(
        w * 0.45,
        0.72,
        d * 0.45,
        PAL.tangerine,
        -0.15,
        0.36 + h + 0.6,
        -0.15,
        g,
      )
    }

    if (kind !== 'bands-terracotta' && kind !== 'bands-charcoal') {
      const isSpire = kind === 'spire-teal' || kind === 'spire-charcoal'
      const bodyH = isSpire ? h * 0.48 : h
      const nFl = Math.max(2, Math.floor(bodyH / 1.25))
      const winColor =
        kind === 'ivory'
          ? PAL.slate
          : kind === 'spire-charcoal'
            ? PAL.warmGlass
            : PAL.paper
      for (let fl = 0; fl < nFl; fl++) {
        const wy = 1.15 + fl * 1.22
        if (wy > bodyH - 0.3) break
        for (const wx of [-1, 0, 1]) {
          addBox(
            0.34,
            0.58,
            0.06,
            winColor,
            wx * (w * 0.27),
            wy,
            d / 2 + 0.02,
            g,
            { edges: false },
          )
          addBox(
            0.06,
            0.58,
            0.34,
            winColor,
            w / 2 + 0.02,
            wy,
            wx * (d * 0.27),
            g,
            { edges: false },
          )
        }
      }
    }

    world.add(g)
    registerHot(g, kind.startsWith('spire') ? 'spire skyscraper' : 'skyscraper')
    return g
  }

  /* ── Decorative Trees, Bushes, Flower Beds, Benches & Streetlamps ──────── */
  const foliageGeo = own(new THREE.SphereGeometry(1, 16, 12))
  const buildTree = (
    x: number,
    z: number,
    r = 0.65,
    kind: 'round' | 'tall' | 'gold' | 'spring' = 'round',
    parent: THREE.Object3D = world,
    baseY = 0.28,
  ) => {
    const g = new THREE.Group()
    g.position.set(x, baseY, z)
    addBox(0.18, 0.55, 0.18, PAL.trunk, 0, 0.27, 0, g)
    const cColor =
      kind === 'gold'
        ? PAL.mustard
        : kind === 'spring'
          ? PAL.grassHi
          : PAL.grass
    const crown = new THREE.Mesh(foliageGeo, mat(cColor))
    crown.position.y = kind === 'tall' ? 1.05 : 0.85
    crown.scale.set(r, kind === 'tall' ? r * 1.45 : r * 0.95, r)
    crown.castShadow = true
    addEdges(crown, 28)
    g.add(crown)
    parent.add(g)
  }

  const buildBush = (
    x: number,
    z: number,
    r = 0.36,
    color: string = PAL.grassHi,
    baseY = 0.28,
    parent: THREE.Object3D = world,
  ) => {
    const m = new THREE.Mesh(foliageGeo, mat(color))
    m.position.set(x, baseY + r * 0.65, z)
    m.scale.set(r * 1.15, r * 0.8, r)
    m.castShadow = true
    addEdges(m, 30)
    parent.add(m)
  }

  const buildFlowerBed = (x: number, z: number, yaw = 0, baseY = 0.28) => {
    const g = new THREE.Group()
    g.position.set(x, baseY, z)
    g.rotation.y = yaw
    addBox(1.5, 0.16, 0.62, PAL.paper, 0, 0.08, 0, g)
    addBox(1.34, 0.18, 0.46, PAL.grass, 0, 0.12, 0, g)
    addBox(0.24, 0.18, 0.24, PAL.tangerine, -0.4, 0.24, 0, g)
    addBox(0.24, 0.18, 0.24, PAL.butter, 0, 0.25, 0, g)
    addBox(0.24, 0.18, 0.24, PAL.tangerine, 0.4, 0.24, 0, g)
    world.add(g)
  }

  const lampGlobeGeo = own(new THREE.SphereGeometry(0.17, 14, 10))
  const buildStreetLamp = (x: number, z: number, baseY = 0.22) => {
    const g = new THREE.Group()
    g.position.set(x, baseY, z)
    addBox(0.18, 0.12, 0.18, PAL.ink, 0, 0.06, 0, g)
    addBox(0.07, 1.35, 0.07, PAL.ink, 0, 0.72, 0, g, { edges: false })
    const globe = new THREE.Mesh(
      lampGlobeGeo,
      mat(PAL.butter, PAL.butter, 0.65),
    )
    globe.position.y = 1.48
    g.add(globe)
    world.add(g)
  }

  /* ── Sunnyside Studio Pack: Die-Cut 3D Stickers, Stamps & Milestone Signs ─ */
  const buildDieCutSticker = (
    kind: 'sun' | 'smiley' | 'flower' | 'star',
    x: number,
    y: number,
    z: number,
    scale = 1,
    rotY = 0,
    tiltX = -Math.PI / 2,
    parent: THREE.Object3D = world,
  ) => {
    const sg = new THREE.Group()
    sg.position.set(x, y, z)
    sg.rotation.order = 'YXZ'
    sg.rotation.y = rotY
    sg.rotation.x = tiltX

    // Die-cut white paper backing disc + ink rim
    const rim = new THREE.Mesh(
      own(
        new THREE.CylinderGeometry(0.84 * scale, 0.86 * scale, 0.1 * scale, 24),
      ),
      mat(PAL.paper),
    )
    rim.rotation.x = Math.PI / 2
    rim.castShadow = true
    addEdges(rim, 25)
    sg.add(rim)

    if (kind === 'sun') {
      const tile = new THREE.Mesh(
        own(
          new THREE.CylinderGeometry(
            0.68 * scale,
            0.68 * scale,
            0.13 * scale,
            24,
          ),
        ),
        mat('#3d53d6'),
      )
      tile.rotation.x = Math.PI / 2
      tile.position.z = 0.02 * scale
      sg.add(tile)

      for (let r = 0; r < 12; r++) {
        const ang = (r * Math.PI * 2) / 12
        const ray = new THREE.Mesh(
          own(new THREE.BoxGeometry(0.11 * scale, 0.24 * scale, 0.14 * scale)),
          mat(PAL.butter),
        )
        ray.position.set(
          Math.cos(ang) * 0.48 * scale,
          Math.sin(ang) * 0.48 * scale,
          0.04 * scale,
        )
        ray.rotation.z = ang - Math.PI / 2
        sg.add(ray)
      }
      const core = new THREE.Mesh(
        own(
          new THREE.CylinderGeometry(
            0.32 * scale,
            0.32 * scale,
            0.16 * scale,
            20,
          ),
        ),
        mat(PAL.butter, PAL.butter, 0.2),
      )
      core.rotation.x = Math.PI / 2
      core.position.z = 0.05 * scale
      sg.add(core)
    } else if (kind === 'smiley') {
      const face = new THREE.Mesh(
        own(
          new THREE.CylinderGeometry(
            0.68 * scale,
            0.68 * scale,
            0.13 * scale,
            24,
          ),
        ),
        mat(PAL.butter),
      )
      face.rotation.x = Math.PI / 2
      face.position.z = 0.02 * scale
      addEdges(face, 28)
      sg.add(face)
      for (const ex of [-0.22, 0.22]) {
        addBox(
          0.12 * scale,
          0.18 * scale,
          0.15 * scale,
          PAL.ink,
          ex * scale,
          0.14 * scale,
          0.04 * scale,
          sg,
          { edges: false },
        )
      }
      addBox(
        0.38 * scale,
        0.1 * scale,
        0.15 * scale,
        PAL.ink,
        0,
        -0.18 * scale,
        0.04 * scale,
        sg,
        { edges: false },
      )
    } else if (kind === 'flower') {
      for (let p = 0; p < 5; p++) {
        const ang = (p * Math.PI * 2) / 5
        const petal = new THREE.Mesh(
          own(
            new THREE.CylinderGeometry(
              0.3 * scale,
              0.3 * scale,
              0.13 * scale,
              16,
            ),
          ),
          mat(PAL.pink),
        )
        petal.rotation.x = Math.PI / 2
        petal.position.set(
          Math.cos(ang) * 0.34 * scale,
          Math.sin(ang) * 0.34 * scale,
          0.02 * scale,
        )
        sg.add(petal)
      }
      const center = new THREE.Mesh(
        own(
          new THREE.CylinderGeometry(
            0.24 * scale,
            0.24 * scale,
            0.16 * scale,
            16,
          ),
        ),
        mat(PAL.butter),
      )
      center.rotation.x = Math.PI / 2
      center.position.z = 0.05 * scale
      sg.add(center)
    } else {
      // 8-point starburst
      for (let s = 0; s < 2; s++) {
        const starBox = new THREE.Mesh(
          own(new THREE.BoxGeometry(0.88 * scale, 0.88 * scale, 0.13 * scale)),
          mat(s === 0 ? PAL.tangerine : PAL.butter),
        )
        starBox.rotation.z = (s * Math.PI) / 4
        starBox.position.z = (0.02 + s * 0.02) * scale
        addEdges(starBox, 25)
        sg.add(starBox)
      }
    }

    parent.add(sg)
    return sg
  }

  const makeMilestoneTexture = (num: string, label: string, accent: string) => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 192
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fffaf1'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.strokeStyle = '#191a2e'
    ctx.lineWidth = 12
    ctx.strokeRect(10, 10, c.width - 20, c.height - 20)

    ctx.fillStyle = accent
    ctx.fillRect(16, 16, 136, c.height - 32)
    ctx.fillStyle = '#191a2e'
    ctx.fillRect(148, 16, 8, c.height - 32)

    ctx.fillStyle = '#191a2e'
    ctx.font = '900 72px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(num, 84, c.height / 2 + 4)

    ctx.font = '900 54px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(label, 182, c.height / 2 + 4)

    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }

  const buildMilestoneSign = (
    num: string,
    label: string,
    accent: string,
    x: number,
    z: number,
    yaw = 0,
    baseY = 0.22,
  ) => {
    const mg = new THREE.Group()
    mg.position.set(x, baseY, z)
    mg.rotation.y = yaw
    addBox(0.14, 1.05, 0.14, PAL.ink, -0.55, 0.52, 0, mg)
    addBox(0.14, 1.05, 0.14, PAL.ink, 0.55, 0.52, 0, mg)
    const signMat = own(
      new THREE.MeshBasicMaterial({
        map: makeMilestoneTexture(num, label, accent),
      }),
    )
    const sideM = mat(PAL.paper)
    const board = new THREE.Mesh(own(new THREE.BoxGeometry(1.75, 0.68, 0.16)), [
      sideM,
      sideM,
      sideM,
      sideM,
      signMat,
      signMat,
    ])
    board.position.y = 1.05
    board.castShadow = true
    addEdges(board, 20)
    mg.add(board)
    world.add(mg)
    return mg
  }

  const buildApprovedStamp = (
    x: number,
    z: number,
    yaw = -0.18,
    baseY = 0.22,
  ) => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 192
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#ffb6e1'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.strokeStyle = '#191a2e'
    ctx.lineWidth = 14
    ctx.strokeRect(12, 12, c.width - 24, c.height - 24)
    ctx.setLineDash([14, 10])
    ctx.lineWidth = 4
    ctx.strokeRect(28, 28, c.width - 56, c.height - 56)
    ctx.setLineDash([])
    ctx.fillStyle = '#191a2e'
    ctx.font = '900 54px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('★ APPROVED / CRAFT', c.width / 2, c.height / 2 + 3)
    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    const topMat = own(new THREE.MeshBasicMaterial({ map: tex }))
    const sideM = mat(PAL.pink)
    const sg = new THREE.Group()
    sg.position.set(x, baseY, z)
    sg.rotation.y = yaw
    const tile = new THREE.Mesh(own(new THREE.BoxGeometry(2.35, 0.12, 0.92)), [
      sideM,
      sideM,
      topMat,
      sideM,
      sideM,
      sideM,
    ])
    tile.position.y = 0.06
    tile.castShadow = true
    addEdges(tile, 20)
    sg.add(tile)
    world.add(sg)
    return sg
  }

  /* ── ZONE 1: Large Centered Profile Card (Focused Typography, No Pills) ── */
  const makeCardTexture = () => {
    const c = document.createElement('canvas')
    c.width = 1280
    c.height = 900
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fffaf1'
    ctx.fillRect(0, 0, c.width, c.height)

    // Tactile Sunnyside card border
    ctx.strokeStyle = '#191a2e'
    ctx.lineWidth = 14
    ctx.strokeRect(20, 20, c.width - 40, c.height - 40)

    // Top-left tangerine accent bar
    ctx.fillStyle = '#ff6a2b'
    ctx.fillRect(84, 96, 120, 14)

    // Role Title: Design Engineer
    ctx.fillStyle = '#df4e22'
    ctx.font = '800 44px ui-monospace, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('DESIGN ENGINEER', 84, 168)

    // Giant, ultra-readable Name Headline
    ctx.font = '900 132px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#191a2e'
    ctx.fillText('Aditya Himawan', 80, 296)

    // Crisp editorial divider line with butter accent segment
    ctx.fillStyle = '#191a2e'
    ctx.fillRect(84, 396, c.width - 168, 6)
    ctx.fillStyle = '#ffd23f'
    ctx.fillRect(84, 402, 260, 12)

    // Focused, large, high-impact selling statement (no buttons, no pills)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.font = '800 72px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#191a2e'
    ctx.fillText('Crafting interfaces with', 84, 520)

    // Highlighted second line with warm butter underline wash
    ctx.fillStyle = '#ffd23f'
    ctx.fillRect(80, 622, 870, 32)
    ctx.fillStyle = '#191a2e'
    ctx.fillText('warmth, motion & clarity —', 84, 616)

    ctx.fillStyle = '#34385e'
    ctx.font = '800 68px system-ui, -apple-system, sans-serif'
    ctx.fillText('from design system to code.', 84, 716)

    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }

  // Enlarged profile card (9.2 x 6.5) centered inside the left loop
  const cardGroup = new THREE.Group()
  cardGroup.position.set(-8.3, 0.22, 5.7)
  cardGroup.rotation.y = Math.PI / 2
  const cardFaceMat = own(
    new THREE.MeshBasicMaterial({ map: makeCardTexture() }),
  )
  const cardSideMat = mat(PAL.creamLo)
  // Stepped architectural pedestal
  addBox(7.8, 1.85, 0.96, PAL.slate, 0, 0.92, -0.04, cardGroup)
  addBox(8.2, 0.24, 1.12, PAL.butter, 0, 1.94, -0.04, cardGroup)
  // Offset hard ink shadow plate behind the profile card
  addBox(9.28, 6.58, 0.2, PAL.ink, 0.16, 5.26, -0.26, cardGroup)
  const cardBody = new THREE.Mesh(own(new THREE.BoxGeometry(9.2, 6.5, 0.52)), [
    cardSideMat,
    cardSideMat,
    mat(PAL.paper),
    cardSideMat,
    cardFaceMat,
    cardSideMat,
  ])
  cardBody.position.y = 5.36
  cardBody.castShadow = true
  cardBody.receiveShadow = true
  addEdges(cardBody, 20)
  cardGroup.add(cardBody)
  world.add(cardGroup)
  registerHot(cardGroup, 'Aditya Himawan · Design Engineer', 'card')

  // Low courtyard cottages positioned neatly in front of the centered card
  const leftHouses: [number, number, string, string][] = [
    [-8.6, 10.7, PAL.paper, PAL.mustard],
    [-6.3, 10.7, PAL.cream, PAL.tangerine],
    [-6.3, 8.1, PAL.paper, PAL.tangerine],
    [-4.3, 9.6, PAL.paper, PAL.mustard],
  ]
  for (const [hx, hz, wall, roof] of leftHouses) {
    buildGabledHouse(hx, hz, 0, wall, roof, 0.86)
  }

  const fenceGroup = new THREE.Group()
  for (let fz = 4.2; fz <= 11.8; fz += 0.48) {
    addBox(0.1, 0.42, 0.18, PAL.paper, -11.4, 0.43, fz, fenceGroup)
  }
  for (let fx = -11.2; fx <= -4.2; fx += 0.48) {
    addBox(0.18, 0.42, 0.1, PAL.paper, fx, 0.43, 12.15, fenceGroup)
  }
  world.add(fenceGroup)

  buildTree(-11.2, 4.2, 0.6, 'spring')
  buildTree(-10.8, 11.4, 0.54, 'gold')
  buildBush(-7.5, 9.4, 0.34, PAL.grassHi)
  buildBush(-5.4, 6.8, 0.34, PAL.pink)
  buildFlowerBed(-4.2, 7.6, Math.PI / 2)
  buildStreetLamp(-4.4, 11.6)
  // Die-cut Smiley sticker on the Zone 1 lawn + Milestone Sign 01
  buildDieCutSticker('smiley', -10.8, 0.34, 8.6, 0.72, Math.PI * 0.25)
  buildMilestoneSign('01', 'ABOUT', PAL.butter, -11.0, 12.1, Math.PI * 0.18)

  // Left loop skyscrapers placed cleanly to the right of the enlarged card face
  buildSkyscraper(-2.7, 5.6, 1.95, 1.95, 4.6, 'bands-terracotta')
  buildSkyscraper(-3.2, 2.7, 2.2, 2.2, 8.0, 'spire-teal')

  /* ── ZONE 2: Upper-Center Skyline & Park Terrace ───────────────────────── */
  buildSkyscraper(-5.0, -4.6, 2.65, 2.65, 7.8, 'bands-charcoal')
  buildSkyscraper(-2.8, -8.4, 2.5, 2.5, 9.2, 'spire-charcoal')
  buildGabledHouse(-9.2, -3.5, Math.PI / 2, PAL.paper, PAL.mustard, 0.94)
  buildGabledHouse(-7.0, -7.2, 0, PAL.cream, PAL.tangerine, 0.9)
  buildGabledHouse(-2.8, -11.4, Math.PI / 2, PAL.paper, PAL.tangerine, 0.92)
  buildTree(-9.4, -6.2, 0.68, 'round')
  buildTree(-8.0, -5.2, 0.56, 'spring')
  buildTree(-5.6, -10.6, 0.62, 'tall')
  buildTree(-6.8, -4.2, 0.5, 'gold')
  buildBush(-4.5, -11.4, 0.38, PAL.grassHi)
  buildFlowerBed(-8.6, -8.2, 0)
  buildStreetLamp(-3.6, -3.2)
  buildDieCutSticker('flower', -8.8, 0.34, -9.8, 0.76, Math.PI * 0.15)
  buildMilestoneSign('02', 'SHOW & TELL', PAL.pink, -10.4, -5.0, Math.PI * 0.35)

  /* ── ZONE 3: Auto-Cycling Sunnyside Billboard (Zero Pole Collision, No Sun) */
  const BILLBOARD_SLIDES = [
    {
      bg: '#ffd23f',
      chipBg: '#fffaf1',
      chip: 'OPEN TO GOOD PROBLEMS',
      line1: 'WITH A',
      line2: 'PULSE.',
      accent: '#ff6a2b',
      readout: 'with a pulse',
    },
    {
      bg: '#fffaf1',
      chipBg: '#ffd23f',
      chip: 'DESIGN SYSTEMS · MOTION',
      line1: 'CRAFT &',
      line2: 'CLARITY.',
      accent: '#2b9e7c',
      readout: 'craft & clarity',
    },
    {
      bg: '#b7e4c7',
      chipBg: '#fffaf1',
      chip: 'EXPRESS LINE · TRACK 01',
      line1: 'NOW',
      line2: 'BOARDING.',
      accent: '#df4e22',
      readout: 'now boarding',
    },
  ] as const

  const makeBillboardTexture = (slideIdx: number) => {
    const slide = BILLBOARD_SLIDES[slideIdx % BILLBOARD_SLIDES.length]
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 540
    const ctx = c.getContext('2d')!
    ctx.fillStyle = slide.bg
    ctx.fillRect(0, 0, c.width, c.height)

    // Bold Sunnyside double ink border
    ctx.strokeStyle = '#191a2e'
    ctx.lineWidth = 14
    ctx.strokeRect(18, 18, c.width - 36, c.height - 36)
    ctx.lineWidth = 3
    ctx.strokeRect(34, 34, c.width - 68, c.height - 68)

    // Top studio pill chip
    ctx.fillStyle = '#191a2e'
    ctx.beginPath()
    ctx.roundRect(262, 52, 508, 56, 28)
    ctx.fill()
    ctx.fillStyle = slide.chipBg
    ctx.beginPath()
    ctx.roundRect(258, 48, 508, 56, 28)
    ctx.fill()
    ctx.strokeStyle = '#191a2e'
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = slide.accent
    ctx.beginPath()
    ctx.arc(296, 76, 10, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#191a2e'
    ctx.font = '800 24px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(slide.chip, 524, 77)

    // Line 1 Headline
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '900 116px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#191a2e'
    ctx.fillText(slide.line1, c.width / 2, 192)

    // Hand-drawn Sunnyside double scribble ring around Line 2
    ctx.save()
    ctx.translate(c.width / 2, 372)
    ctx.rotate(-0.025)
    ctx.strokeStyle = slide.accent
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.ellipse(0, 0, 396, 96, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.rotate(0.04)
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.ellipse(0, 0, 382, 84, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // Line 2 Display Word with hard offset ink shadow
    ctx.font = '900 132px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#191a2e'
    ctx.fillText(slide.line2, c.width / 2 + 8, 380)
    ctx.lineWidth = 14
    ctx.strokeStyle = '#191a2e'
    ctx.strokeText(slide.line2, c.width / 2, 372)
    ctx.fillStyle = slide.accent
    ctx.fillText(slide.line2, c.width / 2, 372)

    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }

  const makeTickerTexture = () => {
    const c = document.createElement('canvas')
    c.width = 768
    c.height = 112
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#191a2e'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.strokeStyle = '#ffd23f'
    ctx.lineWidth = 8
    ctx.strokeRect(6, 6, c.width - 12, c.height - 12)
    ctx.fillStyle = '#b7e4c7'
    ctx.beginPath()
    ctx.arc(54, c.height / 2, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fffaf1'
    ctx.font = '800 36px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      '00 / SIDE A · LIVE STUDIO FEED',
      c.width / 2 + 16,
      c.height / 2 + 2,
    )
    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }

  const bbSlideTextures = [
    makeBillboardTexture(0),
    makeBillboardTexture(1),
    makeBillboardTexture(2),
  ]
  const bbFaceMat = own(
    new THREE.MeshBasicMaterial({ map: bbSlideTextures[0] }),
  )
  const tickerMat = own(
    new THREE.MeshBasicMaterial({ map: makeTickerTexture() }),
  )

  const boardGroup = new THREE.Group()
  boardGroup.position.set(9.2, 0.22, -10.3)
  // Sturdy dual support pylon framework terminating BELOW the billboard casing
  // and recessed at z = -0.14 so poles NEVER collide or z-fight with the screen!
  for (const px of [-2.5, 2.5]) {
    addBox(1.2, 0.28, 1.2, PAL.paper, px, 0.14, -0.1, boardGroup)
    addBox(0.92, 0.42, 0.92, PAL.butter, px, 0.42, -0.1, boardGroup)
    addBox(0.56, 3.9, 0.52, PAL.slate, px, 2.15, -0.14, boardGroup)
  }
  addBox(5.2, 0.22, 0.22, PAL.slateHi, 0, 2.1, -0.2, boardGroup)
  addBox(5.2, 0.22, 0.22, PAL.slateHi, 0, 3.3, -0.2, boardGroup)

  // Offset dark ink shadow backing plate + Tangerine outer frame + raised paper board
  addBox(8.6, 4.65, 0.24, PAL.ink, 0.2, 6.45, -0.32, boardGroup)
  addBox(8.5, 4.6, 0.5, PAL.tangerine, 0, 6.62, 0, boardGroup)
  addBox(8.05, 4.15, 0.18, PAL.paper, 0, 6.62, 0.24, boardGroup)

  const bbFace = new THREE.Mesh(
    own(new THREE.PlaneGeometry(7.75, 3.92)),
    bbFaceMat,
  )
  bbFace.position.set(0, 6.62, 0.36)
  boardGroup.add(bbFace)

  // Catwalk maintenance grate + low safety handrail placed cleanly below the screen
  addBox(8.9, 0.22, 0.96, PAL.butter, 0, 4.2, 0.32, boardGroup)
  addBox(8.96, 0.08, 1.0, PAL.ink, 0, 4.06, 0.32, boardGroup)
  for (let gx = -4.1; gx <= 4.1; gx += 1.36) {
    addBox(0.08, 0.28, 0.08, PAL.ink, gx, 4.44, 0.74, boardGroup)
  }
  addBox(8.4, 0.08, 0.08, PAL.ink, 0, 4.58, 0.74, boardGroup)

  // Side maintenance ladder
  for (const lx of [-4.45, -4.15]) {
    addBox(0.08, 3.8, 0.08, PAL.ink, lx, 2.3, 0.32, boardGroup)
  }
  for (let ly = 0.8; ly <= 3.8; ly += 0.5) {
    addBox(0.36, 0.07, 0.07, PAL.ink, -4.3, ly, 0.32, boardGroup)
  }

  // Three gooseneck studio floodlights mounted along the top rim
  for (const fx of [-2.6, 0, 2.6]) {
    addBox(0.28, 0.32, 0.28, PAL.ink, fx, 9.04, 0.08, boardGroup)
    addBox(0.12, 0.12, 0.86, PAL.ink, fx, 9.16, 0.48, boardGroup)
    addBox(0.58, 0.22, 0.42, PAL.slate, fx, 9.04, 0.84, boardGroup)
    addBox(0.46, 0.12, 0.32, PAL.butter, fx, 8.94, 0.84, boardGroup, {
      edges: false,
      emissive: PAL.butter,
      emissiveIntensity: 0.85,
    })
  }

  // Lower sub-banner ticker plaque ("00 / SIDE A · LIVE STUDIO FEED")
  const tickerSide = mat(PAL.ink)
  const tickerBox = new THREE.Mesh(
    own(new THREE.BoxGeometry(5.6, 0.76, 0.28)),
    [tickerSide, tickerSide, tickerSide, tickerSide, tickerMat, tickerSide],
  )
  tickerBox.position.set(0, 3.48, 0.26)
  addEdges(tickerBox, 20)
  boardGroup.add(tickerBox)

  world.add(boardGroup)
  registerHot(boardGroup, 'with a pulse billboard', 'billboard')

  // High-contrast ivory, teal-patina, and charcoal towers in front of billboard
  const z3TowerA = buildSkyscraper(4.4, -5.8, 3.2, 2.3, 4.3, 'ivory')
  // Rooftop Sun Club solar disc on the flat ivory tower
  buildDieCutSticker(
    'sun',
    0,
    0.36 + 4.3 + 0.34,
    0,
    0.85,
    0,
    -Math.PI / 2,
    z3TowerA,
  )
  buildSkyscraper(7.6, -4.4, 2.4, 2.4, 5.2, 'teal')
  buildSkyscraper(11.2, -3.8, 2.45, 2.45, 6.4, 'ivory')
  addBox(1.5, 2.5, 1.5, PAL.butter, 12.8, 0.22 + 1.25, -3.8, world)
  addBox(1.4, 1.6, 1.4, PAL.tangerine, 12.8, 0.22 + 0.8, -2.2, world)

  // Trees & gardens in Zone 3 courtyard
  buildTree(5.2, -9.4, 0.65, 'round')
  buildTree(7.4, -9.0, 0.56, 'gold')
  buildTree(12.2, -8.8, 0.6, 'spring')
  buildBush(11.0, -8.8, 0.36, PAL.grassHi)
  buildFlowerBed(8.8, -8.2, 0)
  buildStreetLamp(6.0, -3.0)
  buildMilestoneSign('03', 'WORK', PAL.tangerine, 3.6, -2.6, -Math.PI * 0.15)

  /* ── ZONE 4: Front Street (Collision-Free), Crosswalks, Bus Stop & Park ── */
  const roadWaypoints: [number, number][] = [
    [-1.4, 5.4],
    [13.0, 5.4],
    [13.0, 9.7],
    [-1.4, 9.7],
  ]
  const R_ROAD = 1.45
  const roadPts: THREE.Vector3[] = []
  for (let i = 0; i < 4; i++) {
    const pPrev = roadWaypoints[(i + 3) % 4]
    const pCurr = roadWaypoints[i]
    const pNext = roadWaypoints[(i + 1) % 4]
    const u1 = [Math.sign(pPrev[0] - pCurr[0]), Math.sign(pPrev[1] - pCurr[1])]
    const u2 = [Math.sign(pNext[0] - pCurr[0]), Math.sign(pNext[1] - pCurr[1])]
    const org = [
      pCurr[0] + (u1[0] + u2[0]) * R_ROAD,
      pCurr[1] + (u1[1] + u2[1]) * R_ROAD,
    ]
    const t1 = [pCurr[0] + u1[0] * R_ROAD, pCurr[1] + u1[1] * R_ROAD]
    const t2 = [pCurr[0] + u2[0] * R_ROAD, pCurr[1] + u2[1] * R_ROAD]
    const a1 = Math.atan2(t1[1] - org[1], t1[0] - org[0])
    const a2 = Math.atan2(t2[1] - org[1], t2[0] - org[0])
    let da = a2 - a1
    while (da > Math.PI) da -= Math.PI * 2
    while (da < -Math.PI) da += Math.PI * 2
    for (let k = 0; k <= 12; k++) {
      const ang = a1 + (da * k) / 12
      roadPts.push(
        new THREE.Vector3(
          org[0] + Math.cos(ang) * R_ROAD,
          0.02,
          org[1] + Math.sin(ang) * R_ROAD,
        ),
      )
    }
  }

  const roadCurve = new THREE.CatmullRomCurve3(roadPts, true, 'centripetal')
  const roadSampled = roadCurve.getSpacedPoints(120)
  roadSampled.pop()
  const roadFrames = buildFrames(roadSampled, true)

  const roadCurbProfile: [number, number][] = [
    [-0.98, 0.0],
    [0.98, 0.0],
    [0.98, 0.08],
    [-0.98, 0.08],
  ]
  const roadSurfaceProfile: [number, number][] = [
    [-0.86, 0.06],
    [0.86, 0.06],
    [0.86, 0.14],
    [-0.86, 0.14],
  ]
  const roadGroup = new THREE.Group()
  roadGroup.userData.dropWave = 'ground'
  const roadCurbMesh = new THREE.Mesh(
    sweepProfile(roadFrames, roadCurbProfile, true),
    mat(PAL.creamLo),
  )
  roadCurbMesh.receiveShadow = true
  const roadSurfMesh = new THREE.Mesh(
    sweepProfile(roadFrames, roadSurfaceProfile, true),
    mat(PAL.asphalt),
  )
  roadSurfMesh.receiveShadow = true
  roadGroup.add(roadCurbMesh, roadSurfMesh)

  // Crisp white zebra crosswalk stripes across the street near viaduct & bus stop
  for (const cx of [2.1, 7.8]) {
    for (let sz = -0.6; sz <= 0.6; sz += 0.3) {
      addBox(0.68, 0.025, 0.16, PAL.paper, cx, 0.155, 5.4 + sz, roadGroup, {
        edges: false,
        shadow: false,
      })
    }
  }

  // Crisp white dashed center line markings on the northern dark asphalt straightaway
  const northDashes = [
    -0.6, 0.3, 1.2, 3.2, 4.1, 5.0, 5.9, 6.8, 8.8, 9.7, 10.6, 11.5, 12.3,
  ]
  for (const dx of northDashes) {
    addBox(0.48, 0.025, 0.08, PAL.paper, dx, 0.155, 5.4, roadGroup, {
      edges: false,
      shadow: false,
    })
  }

  // Southern straight zebra crosswalk near the botanical fountain park
  for (let sz = -0.6; sz <= 0.6; sz += 0.3) {
    addBox(0.68, 0.025, 0.16, PAL.paper, 4.2, 0.155, 9.7 + sz, roadGroup, {
      edges: false,
      shadow: false,
    })
  }

  // Crisp white dashed center line markings on the southern dark asphalt straightaway
  const southDashes = [
    -0.6, 0.3, 1.2, 2.1, 3.0, 5.4, 6.3, 7.2, 8.1, 9.0, 9.9, 10.8, 11.7, 12.4,
  ]
  for (const dx of southDashes) {
    addBox(0.48, 0.025, 0.08, PAL.paper, dx, 0.155, 9.7, roadGroup, {
      edges: false,
      shadow: false,
    })
  }
  world.add(roadGroup)

  // Center green boulevard median island inside the road loop (raised above street)
  addLawnPatch(10.4, 1.85, 5.8, 7.55, 0.14)
  buildTree(2.5, 7.55, 0.5, 'spring', world, 0.26)
  buildTree(5.8, 7.55, 0.54, 'gold', world, 0.26)
  buildTree(9.0, 7.55, 0.5, 'round', world, 0.26)
  buildFlowerBed(4.1, 7.55, 0, 0.26)
  buildFlowerBed(7.4, 7.55, 0, 0.26)
  buildStreetLamp(1.4, 7.55, 0.26)
  buildStreetLamp(10.2, 7.55, 0.26)

  // Roadside house, teal bus stop shelter, trees, and orange ticket kiosk
  buildGabledHouse(4.4, 3.0, 0, PAL.paper, PAL.tangerine, 0.88)
  buildTree(2.5, 2.6, 0.56, 'round', world, 0.24)
  buildTree(6.1, 2.5, 0.48, 'gold', world, 0.24)
  buildTree(11.5, 2.6, 0.54, 'spring', world, 0.24)

  const busStop = new THREE.Group()
  busStop.position.set(7.8, 0.18, 3.1)
  addBox(2.3, 0.16, 1.15, PAL.teal, 0, 1.48, 0, busStop)
  addBox(0.1, 1.42, 0.1, PAL.ink, -0.98, 0.71, -0.42, busStop)
  addBox(0.1, 1.42, 0.1, PAL.ink, 0.98, 0.71, -0.42, busStop)
  addBox(1.85, 1.1, 0.06, PAL.skyGlass, 0, 0.78, -0.42, busStop)
  addBox(1.4, 0.34, 0.42, PAL.butter, 0, 0.28, -0.18, busStop)
  world.add(busStop)
  registerHot(busStop, 'bus stop shelter')

  addBox(0.88, 1.45, 0.78, PAL.tangerine, 10.2, 0.18 + 0.72, 3.1, world)

  // Sunnyside "APPROVED / CRAFT" rose stamp tile & Milestone Sign 04
  buildApprovedStamp(11.4, 12.2, -0.22, 0.02)
  buildMilestoneSign('04', 'SKILLS', PAL.mint, 11.4, 7.55, 0, 0.26)

  // Expanded Front Mini Park + adjacent botanical lawn + Die-cut stickers
  const parkGroup = new THREE.Group()
  parkGroup.position.set(5.4, 0, 13.5)
  addBox(7.8, 0.18, 4.6, PAL.cream, 0, 0.09, 0, parkGroup)
  addBox(7.3, 0.1, 4.1, PAL.grass, 0, 0.2, 0, parkGroup)
  addBox(7.34, 0.04, 0.78, PAL.paper, 0, 0.26, 0, parkGroup, { edges: false })
  addBox(0.78, 0.04, 4.14, PAL.paper, 0, 0.26, 0, parkGroup, { edges: false })

  const basin = new THREE.Mesh(
    own(new THREE.CylinderGeometry(0.98, 1.04, 0.28, 20)),
    mat(PAL.paper),
  )
  basin.position.y = 0.34
  addEdges(basin, 25)
  const water = new THREE.Mesh(
    own(new THREE.CylinderGeometry(0.74, 0.74, 0.1, 20)),
    mat(PAL.skyGlass),
  )
  water.position.y = 0.46
  const sunCenter = new THREE.Mesh(
    own(new THREE.SphereGeometry(0.24, 16, 12)),
    mat(PAL.butter, PAL.butter, 0.35),
  )
  sunCenter.position.y = 0.56
  parkGroup.add(basin, water, sunCenter)
  buildTree(-2.4, -1.2, 0.65, 'round', parkGroup, 0.24)
  buildTree(2.4, 1.1, 0.58, 'tall', parkGroup, 0.24)
  buildTree(-2.2, 1.2, 0.5, 'gold', parkGroup, 0.24)
  buildTree(2.3, -1.15, 0.52, 'spring', parkGroup, 0.24)
  buildBush(-1.2, 1.35, 0.32, PAL.grassHi, 0.24, parkGroup)
  buildBush(1.2, -1.35, 0.32, PAL.mustard, 0.24, parkGroup)
  buildDieCutSticker(
    'flower',
    -1.45,
    0.28,
    -1.15,
    0.55,
    0.3,
    -Math.PI / 2,
    parkGroup,
  )
  // Park benches
  addBox(0.75, 0.22, 0.28, PAL.butter, -1.35, 0.34, -0.58, parkGroup)
  addBox(0.75, 0.22, 0.28, PAL.tangerine, 1.35, 0.34, 0.58, parkGroup)
  world.add(parkGroup)
  registerHot(parkGroup, 'fountain botanical park')

  // Sculpted Bus & Mini Cars
  const roadVehicles: RoadVehicle[] = []
  const buildBus = (offset: number) => {
    const g = new THREE.Group()
    world.add(g)
    addBox(2.55, 1.04, 1.24, PAL.mustard, 0, 0.74, 0, g)
    addBox(2.36, 0.12, 1.12, PAL.paper, 0, 1.32, 0, g)
    addBox(2.38, 0.34, 1.28, PAL.skyGlass, 0, 0.98, 0, g, { edges: false })
    addBox(0.1, 0.38, 1.12, PAL.ink, 1.26, 0.96, 0, g)
    const wheels: THREE.Object3D[] = []
    for (const [wx, wz] of [
      [-0.82, 0.58],
      [0.82, 0.58],
      [-0.82, -0.58],
      [0.82, -0.58],
    ]) {
      const w = new THREE.Mesh(wheelCylGeo, mat(PAL.slateHi))
      w.position.set(wx, 0.22, wz)
      const hub = new THREE.Mesh(
        own(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 8)),
        mat(PAL.steel),
      )
      hub.rotateX(Math.PI / 2)
      w.add(hub)
      g.add(w)
      wheels.push(w)
    }
    registerHot(g, 'city bus')
    roadVehicles.push({ group: g, wheels, wheelRadius: 0.2, offset })
  }

  const buildMiniCar = (color: string, offset: number) => {
    const g = new THREE.Group()
    world.add(g)
    addBox(1.46, 0.44, 0.84, color, 0, 0.4, 0, g)
    addBox(0.82, 0.36, 0.74, PAL.paper, -0.08, 0.78, 0, g)
    addBox(0.86, 0.24, 0.77, PAL.skyGlass, -0.08, 0.78, 0, g, {
      edges: false,
    })
    const wheels: THREE.Object3D[] = []
    for (const [wx, wz] of [
      [-0.46, 0.4],
      [0.46, 0.4],
      [-0.46, -0.4],
      [0.46, -0.4],
    ]) {
      const w = new THREE.Mesh(wheelCylGeo, mat(PAL.slateHi))
      w.scale.setScalar(0.8)
      w.position.set(wx, 0.16, wz)
      const hub = new THREE.Mesh(
        own(new THREE.CylinderGeometry(0.065, 0.065, 0.16, 8)),
        mat(PAL.steel),
      )
      hub.rotateX(Math.PI / 2)
      w.add(hub)
      g.add(w)
      wheels.push(w)
    }
    registerHot(g, 'mini car')
    roadVehicles.push({ group: g, wheels, wheelRadius: 0.15, offset })
  }

  buildBus(0)
  buildMiniCar(PAL.tangerine, 0.36)
  buildMiniCar(PAL.tealHi, 0.68)

  /* ── Sculpted Floating Clouds ──────────────────────────────────────────── */
  const clouds: { group: THREE.Group; baseX: number; phase: number }[] = []
  const cloudConfigs: [number, number, number, number][] = [
    [-9.5, 9.8, -12.5, 1.1],
    [1.5, 10.4, -14.5, 0.92],
    [11.5, 10.0, -15.0, 0.85],
  ]
  cloudConfigs.forEach(([cx, cy, cz, cr], idx) => {
    const cg = new THREE.Group()
    cg.position.set(cx, cy, cz)
    const lobes: [number, number, number, number][] = [
      [0, 0, 0, cr],
      [cr * 0.75, -0.12, 0.1, cr * 0.74],
      [-cr * 0.7, -0.15, -0.1, cr * 0.68],
    ]
    for (const [lx, ly, lz, lr] of lobes) {
      const m = new THREE.Mesh(foliageGeo, mat(PAL.paper))
      m.position.set(lx, ly, lz)
      m.scale.set(lr, lr * 0.72, lr * 0.82)
      addEdges(m, 32)
      cg.add(m)
    }
    world.add(cg)
    clouds.push({ group: cg, baseX: cx, phase: idx * 2.1 })
  })

  /* ── Orthographic Isometric Camera & Auto-Fit ──────────────────────────── */
  const camera = new THREE.OrthographicCamera(-20, 20, 14, -14, 0.1, 160)
  const BASE_AZ = (45 * Math.PI) / 180
  const BASE_EL = (35.264 * Math.PI) / 180
  const CAM_DIST = 64
  const SCENE_BOUNDS = new THREE.Box3(
    new THREE.Vector3(-16.5, -0.4, -16.0),
    new THREE.Vector3(16.8, 11.2, 16.5),
  )

  let camCenterX = 0
  let camCenterY = 0
  let camSpanX = 36
  let camSpanY = 24

  const updateCameraBounds = (az: number, elAng: number) => {
    camera.position.set(
      Math.sin(az) * Math.cos(elAng) * CAM_DIST,
      Math.sin(elAng) * CAM_DIST,
      Math.cos(az) * Math.cos(elAng) * CAM_DIST,
    )
    camera.lookAt(0, 2.4, 0)
    camera.updateMatrixWorld()
  }

  updateCameraBounds(BASE_AZ, BASE_EL)
  {
    const corners3D: THREE.Vector3[] = []
    for (const x of [SCENE_BOUNDS.min.x, SCENE_BOUNDS.max.x]) {
      for (const y of [SCENE_BOUNDS.min.y, SCENE_BOUNDS.max.y]) {
        for (const z of [SCENE_BOUNDS.min.z, SCENE_BOUNDS.max.z]) {
          corners3D.push(
            new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse),
          )
        }
      }
    }
    const minX = Math.min(...corners3D.map((v) => v.x))
    const maxX = Math.max(...corners3D.map((v) => v.x))
    const minY = Math.min(...corners3D.map((v) => v.y))
    const maxY = Math.max(...corners3D.map((v) => v.y))
    camCenterX = (minX + maxX) * 0.5
    camCenterY = (minY + maxY) * 0.5
    // Generous frustum margin so the bottom park corner, railway edges, and clouds never clip
    camSpanX = (maxX - minX) * 0.94
    camSpanY = (maxY - minY) * 0.94
  }

  const fitFrustum = () => {
    const w = Math.max(280, el.clientWidth || 960)
    const h = Math.max(220, el.clientHeight || Math.round(w * (2 / 3)))
    renderer.setSize(w, h, false)
    const aspect = w / h
    let halfW = camSpanX * 0.5
    let halfH = camSpanY * 0.5
    if (halfW / halfH > aspect) {
      halfH = halfW / aspect
    } else {
      halfW = halfH * aspect
    }
    camera.left = camCenterX - halfW
    camera.right = camCenterX + halfW
    camera.top = camCenterY + halfH
    camera.bottom = camCenterY - halfH
    camera.updateProjectionMatrix()
  }
  fitFrustum()

  /* ── Pointer Raycasting, Hover Lift & Click Actions ────────────────────── */
  const raycaster = new THREE.Raycaster()
  const pointerNDC = new THREE.Vector2(0, 0)
  let pointerInside = false
  let pointerDirty = false
  let hoveredItem: HotItem | null = null
  let manualSlideOffset = 0
  let activeSlideIdx = 0
  let trainBoost = 0
  let tiltX = 0
  let tiltY = 0
  let shadowFrameTick = 0
  let lastReadoutText = ''

  // Index only Mesh descendants of interactive HotItems (skipping LineSegments
  // edge helpers, InstancedMesh sleepers, ground planes, and static scenery)
  // so raycasting never walks thousands of edge segments on raw pointermove.
  const meshToHot = new Map<THREE.Object3D, HotItem>()
  const hotMeshes: THREE.Mesh[] = []
  for (const item of hotItems) {
    item.group.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        meshToHot.set(node, item)
        hotMeshes.push(node)
      }
    })
  }

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    const rect = canvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    pointerInside = true
    pointerDirty = true
    canvas.style.cursor = 'pointer'
  }

  const onPointerLeave = () => {
    pointerInside = false
    pointerDirty = false
    hoveredItem = null
    canvas.style.cursor = 'default'
  }

  const toggleBillboard = () => {
    manualSlideOffset = (manualSlideOffset + 1) % bbSlideTextures.length
    activeSlideIdx = (activeSlideIdx + 1) % bbSlideTextures.length
    bbFaceMat.map = bbSlideTextures[activeSlideIdx]
    bbFaceMat.needsUpdate = true
  }

  const boostTrains = () => {
    trainBoost = 4.2
  }

  const onClick = () => {
    if (hoveredItem?.kind === 'billboard') {
      toggleBillboard()
    } else if (hoveredItem?.kind === 'train') {
      boostTrains()
    } else {
      trainBoost = Math.max(trainBoost, 2.2)
    }
    onToggleScale?.()
  }

  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('click', onClick)

  /* ── Sky-Drop Entrance Choreography (Staged Structural Wave + Shuffle) ─── */
  type SkyDropEntry = {
    obj: THREE.Object3D
    baseY: number
    baseRotZ: number
    delay: number
    duration: number
    dropHeight: number
    tiltZ: number
  }

  const seededRand = (seed: number) => {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }

  const evalSkyDrop = (
    elapsed: number,
    delay: number,
    duration: number,
    dropHeight: number,
  ) => {
    if (elapsed <= delay) {
      return { visible: false, yOffset: dropHeight, tiltFactor: 1 }
    }
    if (elapsed >= delay + duration) {
      return { visible: true, yOffset: 0, tiltFactor: 0 }
    }
    const u = (elapsed - delay) / duration
    const impactU = 0.66
    let yOffset = 0
    if (u < impactU) {
      const f = u / impactU
      yOffset = dropHeight * (1 - f * f)
    } else {
      const b = (u - impactU) / (1 - impactU)
      yOffset = Math.sin(b * Math.PI) * (1 - b * 0.45) * (dropHeight * 0.082)
    }
    const tiltFactor = u < impactU ? 1 - u / impactU : 0
    return { visible: true, yOffset, tiltFactor }
  }

  const hotGroupSet = new Set(hotItems.map((h) => h.group))
  const vehicleGroupSet = new Set(roadVehicles.map((rv) => rv.group))
  const skyDropEntries: SkyDropEntry[] = []
  const hotDropMap = new Map<THREE.Group, SkyDropEntry>()

  const railwayIdx = world.children.indexOf(railwayGroup)
  world.children.forEach((child, idx) => {
    if (
      child === shadowPlane ||
      child === orangeGroup ||
      child === yellowGroup ||
      vehicleGroupSet.has(child as THREE.Group)
    ) {
      return
    }

    const r1 = seededRand(idx * 3 + 1)
    const r2 = seededRand(idx * 3 + 2)
    const r3 = seededRand(idx * 3 + 3)

    let minDelay = 0.82
    let maxDelay = 1.42
    let duration = 0.48
    let dropHeight = 21 + r2 * 5

    if (
      child.userData.dropWave === 'ground' ||
      (railwayIdx > 0 && idx < railwayIdx)
    ) {
      // Wave 1: Plinths, lawns, washi tapes & street roadbed (0.00s - 0.28s)
      minDelay = 0.0
      maxDelay = 0.28
      duration = 0.42
      dropHeight = 16 + r2 * 4
    } else if (child.userData.dropWave === 'viaduct') {
      // Wave 2: Viaduct arches, railway track & support pillars (0.20s - 0.62s)
      minDelay = 0.2
      maxDelay = 0.62
      duration = 0.46
      dropHeight = 19 + r2 * 4
    } else if (hotGroupSet.has(child as THREE.Group)) {
      // Wave 3: Skyscrapers, cottages, Profile Card, Billboard, Park (0.45s - 1.18s)
      minDelay = 0.45
      maxDelay = 1.18
      duration = 0.52
      dropHeight = 22 + r2 * 6
    }

    const entry: SkyDropEntry = {
      obj: child,
      baseY: child.position.y,
      baseRotZ: child.rotation.z,
      delay: minDelay + r1 * (maxDelay - minDelay),
      duration,
      dropHeight,
      tiltZ: (r3 - 0.5) * 0.11,
    }
    skyDropEntries.push(entry)
    if (hotGroupSet.has(child as THREE.Group)) {
      hotDropMap.set(child as THREE.Group, entry)
    }
  })

  // Wave 5: Trains & Road Vehicles land last (1.20s - 1.78s)
  const orangeDropDelays = orangeCars.map(
    (_, i) => 1.18 + seededRand(500 + i) * 0.32,
  )
  const yellowDropDelays = yellowCars.map(
    (_, i) => 1.24 + seededRand(600 + i) * 0.32,
  )
  const roadDropDelays = roadVehicles.map(
    (_, i) => 1.28 + seededRand(700 + i) * 0.3,
  )
  const maxIntroEnd = Math.max(
    ...skyDropEntries.map((e) => e.delay + e.duration),
    ...orangeDropDelays.map((d) => d + 0.48),
    ...yellowDropDelays.map((d) => d + 0.48),
    ...roadDropDelays.map((d) => d + 0.46),
  )

  /* ── Animation Clock & Frame Step ──────────────────────────────────────── */
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const STILL_TIME = 20
  let simTime = STILL_TIME
  let introTime = reducedQuery.matches ? 999 : -Math.max(0, introDelay)
  let introCompleted = reducedQuery.matches
  let railDist = STILL_TIME * 3.4
  const roadPos = new THREE.Vector3()
  const roadNext = new THREE.Vector3()
  const roadLen = roadCurve.getLength()

  const stepScene = (t: number, dt: number) => {
    if (trainBoost > 0) trainBoost = Math.max(0, trainBoost - dt * 1.8)
    const speed = 3.4 + trainBoost
    railDist = dt === 0 ? t * 3.4 : railDist + speed * dt

    // Automatically cycle billboard slides on a timer sequence without requiring clicks
    const autoSteps =
      t === STILL_TIME || t === 14
        ? 0
        : Math.floor(Math.max(0, t - STILL_TIME) / 3.0)
    const nextSlide =
      (((autoSteps + manualSlideOffset) % bbSlideTextures.length) +
        bbSlideTextures.length) %
      bbSlideTextures.length
    if (nextSlide !== activeSlideIdx) {
      activeSlideIdx = nextSlide
      bbFaceMat.map = bbSlideTextures[activeSlideIdx]
      bbFaceMat.needsUpdate = true
    }

    for (let c = 0; c < orangeCars.length; c++) {
      poseOnRail(orangeCars[c], railDist - c * CAR_GAP, CAR_LEN * 0.44)
      const drop = evalSkyDrop(introTime, orangeDropDelays[c], 0.48, 18)
      orangeCars[c].visible = drop.visible
      orangeCars[c].position.y += drop.yOffset
    }
    for (let c = 0; c < yellowCars.length; c++) {
      poseOnRail(
        yellowCars[c],
        railDist + L * 0.5 - c * CAR_GAP,
        CAR_LEN * 0.44,
      )
      const drop = evalSkyDrop(introTime, yellowDropDelays[c], 0.48, 18)
      yellowCars[c].visible = drop.visible
      yellowCars[c].position.y += drop.yOffset
    }

    for (let rIdx = 0; rIdx < roadVehicles.length; rIdx++) {
      const rv = roadVehicles[rIdx]
      const u = (((t * 0.055 + rv.offset) % 1) + 1) % 1
      const uNext = (u + 0.008) % 1
      roadCurve.getPointAt(u, roadPos)
      roadCurve.getPointAt(uNext, roadNext)
      const drop = evalSkyDrop(introTime, roadDropDelays[rIdx], 0.46, 16)
      rv.group.visible = drop.visible
      rv.group.position.set(roadPos.x, 0.14 + drop.yOffset, roadPos.z)
      rv.group.rotation.y = Math.atan2(
        -(roadNext.z - roadPos.z),
        roadNext.x - roadPos.x,
      )
      const spinAngle = (u * roadLen) / rv.wheelRadius
      for (const w of rv.wheels) w.rotation.z = -spinAngle
    }

    for (const cl of clouds) {
      cl.group.position.x = cl.baseX + Math.sin(t * 0.28 + cl.phase) * 2.2
    }

    // Apply sky-drop to all non-hot static items
    for (const entry of skyDropEntries) {
      if (hotDropMap.has(entry.obj as THREE.Group)) continue
      const drop = evalSkyDrop(
        introTime,
        entry.delay,
        entry.duration,
        entry.dropHeight,
      )
      entry.obj.visible = drop.visible
      entry.obj.position.y = entry.baseY + drop.yOffset
      entry.obj.rotation.z = entry.baseRotZ + entry.tiltZ * drop.tiltFactor
    }

    const stepDt = Math.min(0.05, dt || 0.016)
    for (const item of hotItems) {
      const target = hoveredItem === item ? 0.38 : 0
      const force = (target - item.lift) * 140 - item.vel * 16
      item.vel += force * stepDt
      item.lift += item.vel * stepDt
      const entry = hotDropMap.get(item.group)
      if (entry) {
        const drop = evalSkyDrop(
          introTime,
          entry.delay,
          entry.duration,
          entry.dropHeight,
        )
        item.group.visible = drop.visible
        item.group.position.y = item.baseY + item.lift + drop.yOffset
        item.group.rotation.z = entry.baseRotZ + entry.tiltZ * drop.tiltFactor
      } else {
        item.group.position.y = item.baseY + item.lift
      }
    }

    const targetTiltX = pointerInside ? pointerNDC.x * 0.038 : 0
    const targetTiltY = pointerInside ? pointerNDC.y * 0.024 : 0
    tiltX += (targetTiltX - tiltX) * 0.1
    tiltY += (targetTiltY - tiltY) * 0.1
    updateCameraBounds(BASE_AZ + tiltX, BASE_EL + tiltY)

    if (pointerDirty && pointerInside) {
      pointerDirty = false
      raycaster.setFromCamera(pointerNDC, camera)
      const hits = raycaster.intersectObjects(hotMeshes, false)
      hoveredItem =
        hits.length > 0 ? (meshToHot.get(hits[0].object) ?? null) : null
    }

    // Refresh shadow map every frame during sky-drop or hover lift, then
    // throttle shadow-map passes to every 3rd frame during steady train cruise.
    const anyLift = hotItems.some(
      (item) => Math.abs(item.lift) > 0.004 || Math.abs(item.vel) > 0.01,
    )
    shadowFrameTick = (shadowFrameTick + 1) % 3
    if (dt === 0 || !introCompleted || anyLift || shadowFrameTick === 0) {
      renderer.shadowMap.needsUpdate = true
    }

    renderer.render(scene, camera)

    if (!introCompleted && introTime >= maxIntroEnd + 0.65) {
      introCompleted = true
      onIntroComplete?.()
    }

    if (onReadout) {
      const nextText = hoveredItem
        ? `${hoveredItem.name} · active`
        : `side a express · ${BILLBOARD_SLIDES[activeSlideIdx].readout}`
      if (nextText !== lastReadoutText) {
        lastReadoutText = nextText
        onReadout(nextText)
      }
    }
  }

  /* ── Lifecycle: Resize, Reduced Motion, Offscreen Pause & Cleanup ─────── */
  let disposed = false
  let inView = true
  let rafId = 0
  let lastNow = performance.now()

  const tickLoop = (now: number) => {
    if (disposed) return
    const dt = Math.min(0.05, (now - lastNow) / 1000)
    lastNow = now
    simTime += dt
    introTime += dt
    stepScene(simTime, dt)
    if (!reducedQuery.matches && inView && !document.hidden) {
      rafId = requestAnimationFrame(tickLoop)
    } else {
      rafId = 0
    }
  }

  const syncRunState = () => {
    if (disposed) return
    if (reducedQuery.matches) {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
      introTime = 999
      stepScene(STILL_TIME, 0)
      return
    }
    if (inView && !document.hidden && !rafId) {
      lastNow = performance.now()
      rafId = requestAnimationFrame(tickLoop)
    } else if ((!inView || document.hidden) && rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    if (disposed) return
    fitFrustum()
    stepScene(simTime, 0)
  })
  resizeObserver.observe(el)

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      inView = entries.some((entry) => entry.isIntersecting)
      syncRunState()
    },
    { threshold: 0.05 },
  )
  intersectionObserver.observe(el)

  document.addEventListener('visibilitychange', syncRunState)
  reducedQuery.addEventListener('change', syncRunState)

  stepScene(STILL_TIME, 0)
  syncRunState()

  const controller: PaperCityController = {
    seek: (seconds: number) => {
      simTime = seconds
      introTime = seconds < 10 ? seconds : 999
      railDist = seconds * 3.4
      stepScene(seconds, 0)
    },
    toggleBillboard,
    boostTrains,
    dispose: () => {
      if (disposed) return
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', syncRunState)
      reducedQuery.removeEventListener('change', syncRunState)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('click', onClick)
      for (const item of disposables) item.dispose()
      disposables.clear()
      renderer.dispose()
    },
  }

  ;(window as Window & { __paperCity?: PaperCityController }).__paperCity =
    controller

  return controller
}
