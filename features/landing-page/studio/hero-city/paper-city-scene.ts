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
  ink: '#141626',
  slate: '#1f233b',
  slateHi: '#2f3556',
  paper: '#fffaf1',
  cream: '#f5ede0',
  creamLo: '#e2d5c0',
  sandstone: '#eadbc4',
  teal: '#2b9e7c',
  tealHi: '#48bd99',
  tealLo: '#1d7359',
  skyGlass: '#b8dcff',
  warmGlass: '#ffe58f',
  butter: '#ffd23f',
  mustard: '#f2b72c',
  tangerine: '#ff6a2b',
  terracotta: '#df4e22',
  grass: '#3ca650',
  grassHi: '#56bf68',
  leafLo: '#287a38',
  trunk: '#7c5230',
  steel: '#dde4f7',
  ballast: '#363b5c',
  asphalt: '#f7f0e2',
} as const

export function mountPaperCity({
  el,
  onReadout,
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

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
    thresholdAngle = 24,
  ): THREE.LineSegments => {
    const eg = own(new THREE.EdgesGeometry(mesh.geometry, thresholdAngle))
    const lines = new THREE.LineSegments(eg, edgeMat)
    lines.renderOrder = 1
    mesh.add(lines)
    return lines
  }

  const boxGeoCache = new Map<string, THREE.BoxGeometry>()
  const getBoxGeo = (w: number, h: number, d: number) => {
    const k = `${w.toFixed(3)}:${h.toFixed(3)}:${d.toFixed(3)}`
    let g = boxGeoCache.get(k)
    if (!g) {
      g = own(new THREE.BoxGeometry(w, h, d))
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
  sun.shadow.mapSize.set(1536, 1536)
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

  /* ── Isometric Plinth Pads & Decorative Green Lawns ────────────────────── */
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
    addBox(w + 0.16, 0.06, d + 0.16, PAL.paper, x, baseY + 0.03, z, world)
    addBox(w, 0.08, d, PAL.grass, x, baseY + 0.06, z, world)
  }

  // City zone plinths + green lawn patches
  addPlinth(11.4, 11.4, -7.8, 8.0, 0.22) // Zone 1: Left loop
  addLawnPatch(6.6, 8.8, -7.8, 8.2, 0.22) // Zone 1 green neighborhood yard

  addPlinth(10.6, 11.4, -6.0, -7.6, 0.22) // Zone 2: Upper-center skyline
  addLawnPatch(4.8, 6.4, -8.2, -5.8, 0.22) // Zone 2 upper park lawn
  addLawnPatch(4.2, 4.2, -4.2, -11.0, 0.22)

  addPlinth(11.8, 10.6, 8.2, -6.8, 0.22) // Zone 3: Right tower block & billboard
  addLawnPatch(5.2, 3.8, 9.2, -9.8, 0.22) // Zone 3 green garden under billboard
  addLawnPatch(3.6, 3.4, 5.2, -9.6, 0.22)

  addPlinth(10.8, 3.4, 7.2, 3.0, 0.18) // Zone 4: Bus stop & house sidewalk strip
  addLawnPatch(9.8, 1.3, 7.2, 2.35, 0.18) // Zone 4 green verge strip behind bus stop

  /* ── Continuous Figure-8 Railway (INTERFACES Bridge ABOVE at x = 0) ────── */
  const VERTS: [number, number][] = [
    [0, 15],
    [0, -15],
    [16, -15],
    [16, 0],
    [-15, 0],
    [-15, 15],
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
    const nArc = Math.max(16, Math.ceil((Math.abs(c0.da) * c0.r) / 0.04))
    for (let k = 0; k < nArc; k++) {
      const ang = c0.a1 + c0.da * (k / nArc)
      pushXZ(c0.org[0] + Math.cos(ang) * c0.r, c0.org[1] + Math.sin(ang) * c0.r)
    }
    const slen = Math.hypot(c1.t1[0] - c0.t2[0], c1.t1[1] - c0.t2[1])
    const nSeg = Math.max(12, Math.ceil(slen / 0.04))
    for (let k = 0; k < nSeg; k++) {
      const fSeg = k / nSeg
      const sx = c0.t2[0] + (c1.t1[0] - c0.t2[0]) * fSeg
      const sz = c0.t2[1] + (c1.t1[1] - c0.t2[1]) * fSeg
      pushXZ(sx, sz)
      /* Segment 0->1 (x = 0 spine, [0,15]->[0,-15]) is the upper INTERFACES bridge! */
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

  const LOW_Y = 3.4
  const HIGH_Y = 6.25
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
    let y = LOW_Y
    // Smooth elevated bridge plateau across the x = 0 INTERFACES spine
    if (ds <= 3.6) {
      y = HIGH_Y
    } else if (ds < 11.2) {
      const w = 1 - (ds - 3.6) / (11.2 - 3.6)
      const sm = w * w * (3 - 2 * w)
      y = LOW_Y + (HIGH_Y - LOW_Y) * sm
    }
    if (prev) {
      L += Math.hypot(pt[0] - prev[0], y - prev[1], pt[1] - prev[2])
      acc.push(L)
    }
    prev = [pt[0], y, pt[1]]
    dense.push(prev)
  }

  const M = 380
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

  // Helper to get exact upper bridge deck height at any z along x = 0
  const bridgeHeightAtZ = (z: number) => {
    const ds = Math.abs(z)
    if (ds <= 3.6) return HIGH_Y
    if (ds < 11.2) {
      const w = 1 - (ds - 3.6) / (11.2 - 3.6)
      const sm = w * w * (3 - 2 * w)
      return LOW_Y + (HIGH_Y - LOW_Y) * sm
    }
    return LOW_Y
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

  const buildTrackSegment = (frames: Frame3D[], closed: boolean) => {
    const deckMesh = new THREE.Mesh(
      sweepProfile(frames, deckProfile, closed),
      mat(PAL.slate),
    )
    deckMesh.castShadow = true
    deckMesh.receiveShadow = true
    world.add(deckMesh)

    const ballastMesh = new THREE.Mesh(
      sweepProfile(frames, ballastProfile, closed),
      mat(PAL.ballast),
    )
    ballastMesh.receiveShadow = true
    world.add(ballastMesh)

    const railL = new THREE.Mesh(
      sweepProfile(frames, leftRailProfile, closed),
      mat(PAL.steel),
    )
    const railR = new THREE.Mesh(
      sweepProfile(frames, rightRailProfile, closed),
      mat(PAL.steel),
    )
    world.add(railL, railR)

    for (const side of [-1.08, 1.08]) {
      const curbPts = frames.map((fr) =>
        fr.p.clone().addScaledVector(fr.r, side).addScaledVector(fr.u, 0.14),
      )
      if (closed) curbPts.push(curbPts[0].clone())
      const lg = own(new THREE.BufferGeometry().setFromPoints(curbPts))
      world.add(new THREE.Line(lg, edgeMat))
    }
  }

  buildTrackSegment(loopFrames, true)

  // Instanced sleepers (cross-ties) along the figure-8 loop
  const nSleepers = Math.floor(L / 0.58)
  const sleeperGeo = getBoxGeo(0.18, 0.04, 1.38)
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
  world.add(sleeperInst)

  /* ── Extruded Semicircular Viaduct Arches (Warm Sandstone & Slate) ────── */
  // 1. Central Grand Arch Viaduct under the upper INTERFACES bridge (x = 0, z in [1.6, 9.2])
  const buildCentralArchViaduct = () => {
    const g = new THREE.Group()
    g.position.set(0, 0, 5.4)
    const W = 7.2
    const archR = 1.85
    const archH = 2.05
    const sh = new THREE.Shape()
    sh.moveTo(-W / 2, 0)
    sh.lineTo(-archR, 0)
    sh.lineTo(-archR, archH)
    sh.absarc(0, archH, archR, Math.PI, 0, true)
    sh.lineTo(archR, 0)
    sh.lineTo(W / 2, 0)
    // Follow the exact underside of the upper bridge ramp so the viaduct never pokes through the track
    const nTop = 20
    for (let ti = 0; ti <= nTop; ti++) {
      const sz = W / 2 - (ti / nTop) * W
      const worldZ = 5.4 - sz
      sh.lineTo(sz, bridgeHeightAtZ(worldZ) - 0.35)
    }
    sh.closePath()

    const geo = own(
      new THREE.ExtrudeGeometry(sh, {
        depth: 2.02,
        bevelEnabled: false,
        curveSegments: 24,
      }),
    )
    geo.translate(0, 0, -1.01)
    geo.rotateY(Math.PI / 2)

    // Warm teal-patina / sandstone architectural bridge that pops against the blue cutting mat
    const mesh = new THREE.Mesh(geo, mat(PAL.teal))
    mesh.castShadow = true
    mesh.receiveShadow = true
    addEdges(mesh, 20)
    g.add(mesh)

    // Cream stone pier footings, tangerine belt course & louvered vent grilles
    for (const pz of [-2.75, 2.75]) {
      addBox(2.24, 0.28, 2.0, PAL.paper, 0, 0.14, pz, g)
      addBox(2.14, 0.2, 1.9, PAL.butter, 0, 3.35, pz, g)
      addBox(0.1, 0.65, 0.65, PAL.paper, 1.03, 2.85, pz, g)
      for (let sl = -0.16; sl <= 0.16; sl += 0.16) {
        addBox(0.13, 0.05, 0.48, PAL.ink, 1.04, 2.85 + sl, pz, g, {
          edges: false,
          shadow: false,
        })
      }
    }
    world.add(g)
    registerHot(g, 'interfaces grand arch viaduct')
  }
  buildCentralArchViaduct()

  // 2. Dark Multi-Arch Viaduct Walls under the z = 0 lower train spine
  const buildMultiArchViaduct = (
    xStart: number,
    xEnd: number,
    nArches: number,
  ) => {
    const g = new THREE.Group()
    const totalW = xEnd - xStart
    const cx = (xStart + xEnd) * 0.5
    g.position.set(cx, 0, 0)

    const H = 3.04
    const pierW = 0.85
    const span = (totalW - pierW * (nArches + 1)) / nArches
    const archR = span * 0.5
    const springY = Math.max(0.85, H - archR - 0.38)

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
  buildMultiArchViaduct(-11.8, -2.4, 3)
  buildMultiArchViaduct(2.4, 13.2, 3)

  // 3. Cylindrical Flanged Viaduct Pillars under outer curves (auto-sized to track height)
  const pillarCoords: [number, number, number][] = [
    [-14.7, 4.2, LOW_Y],
    [-14.5, 10.8, LOW_Y],
    [-10.8, 14.7, LOW_Y],
    [-4.2, 14.8, LOW_Y],
    [0, -4.5, bridgeHeightAtZ(-4.5)],
    [0, -9.8, bridgeHeightAtZ(-9.8)],
    [11.5, -14.8, LOW_Y],
    [15.7, -10.8, LOW_Y],
    [15.7, -4.2, LOW_Y],
  ]
  const baseGeo = own(new THREE.CylinderGeometry(0.66, 0.72, 0.24, 14))
  const capGeo = own(new THREE.CylinderGeometry(0.68, 0.56, 0.32, 14))
  for (const [px, pz, deckY] of pillarCoords) {
    const h = Math.max(1.2, deckY - 0.36)
    const pg = new THREE.Group()
    pg.position.set(px, 0, pz)
    const shaft = new THREE.Mesh(
      own(new THREE.CylinderGeometry(0.46, 0.52, h, 14)),
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

  /* ── INTERFACES True 3D Extruded Block Letters on the Upper Bridge ─────── */
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

  const word = 'INTERFACES'
  const letterFaceMat = mat(PAL.paper, PAL.paper, 0.18)
  const letterSideMat = mat(PAL.ink)
  for (let i = 0; i < word.length; i++) {
    const lz = 5.65 - i * 1.26
    const ly = bridgeHeightAtZ(lz) + 0.1
    const lg = new THREE.Group()
    lg.position.set(1.02, ly, lz)
    lg.rotation.y = Math.PI / 2

    const lGeo = own(
      new THREE.ExtrudeGeometry(makeLetterShape(word[i]), {
        depth: 0.62,
        bevelEnabled: false,
      }),
    )
    lGeo.translate(0, 0, -0.31)
    const lMesh = new THREE.Mesh(lGeo, [letterFaceMat, letterSideMat])
    lMesh.castShadow = true
    lMesh.receiveShadow = true
    addEdges(lMesh, 15)
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
        bevelEnabled: false,
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
      const cone = new THREE.Mesh(
        own(new THREE.ConeGeometry(w * 0.24, 1.9, 4)),
        mat(PAL.butter),
      )
      cone.position.y = 0.36 + h + 0.95
      cone.rotation.y = Math.PI / 4
      cone.castShadow = true
      addEdges(cone)
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
  const foliageGeo = own(new THREE.IcosahedronGeometry(1, 1))
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

  const buildStreetLamp = (x: number, z: number, baseY = 0.22) => {
    const g = new THREE.Group()
    g.position.set(x, baseY, z)
    addBox(0.18, 0.12, 0.18, PAL.ink, 0, 0.06, 0, g)
    addBox(0.07, 1.35, 0.07, PAL.ink, 0, 0.72, 0, g, { edges: false })
    addBox(0.26, 0.22, 0.26, PAL.butter, 0, 1.46, 0, g, {
      emissive: PAL.butter,
      emissiveIntensity: 0.55,
    })
    world.add(g)
  }

  /* ── ZONE 1: Inside Left Loop (about/intro Card, 5 Houses, Gardens, 2 Towers) */
  const makeCardTexture = () => {
    const c = document.createElement('canvas')
    c.width = 720
    c.height = 520
    const ctx = c.getContext('2d')!
    ctx.fillStyle = PAL.paper
    ctx.fillRect(0, 0, c.width, c.height)

    ctx.fillStyle = PAL.creamLo
    ctx.fillRect(48, 42, c.width - 96, 10)

    ctx.fillStyle = PAL.ink
    ctx.font = '900 76px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('about/intro', 54, 118)

    ctx.fillStyle = '#afa89c'
    ctx.fillRect(54, 184, 570, 20)
    ctx.fillRect(54, 224, 520, 20)
    ctx.fillRect(54, 264, 440, 20)

    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }

  const cardGroup = new THREE.Group()
  cardGroup.position.set(-12.0, 0.22, 8.2)
  cardGroup.rotation.y = Math.PI / 2
  const cardFaceMat = own(
    new THREE.MeshBasicMaterial({ map: makeCardTexture() }),
  )
  const cardSideMat = mat(PAL.creamLo)
  const cardBody = new THREE.Mesh(getBoxGeo(7.0, 5.2, 0.52), [
    cardSideMat,
    cardSideMat,
    mat(PAL.paper),
    cardSideMat,
    cardFaceMat,
    cardSideMat,
  ])
  cardBody.position.y = 2.6
  cardBody.castShadow = true
  cardBody.receiveShadow = true
  addEdges(cardBody)
  cardGroup.add(cardBody)
  addBox(2.05, 0.56, 0.18, PAL.tangerine, -1.7, 1.55, 0.3, cardGroup)
  addBox(2.05, 0.56, 0.18, PAL.butter, 0.75, 1.55, 0.3, cardGroup)
  world.add(cardGroup)
  registerHot(cardGroup, 'about/intro card', 'card')

  const leftHouses: [number, number, string, string][] = [
    [-9.2, 11.4, PAL.paper, PAL.mustard],
    [-9.2, 8.2, PAL.cream, PAL.tangerine],
    [-6.5, 11.4, PAL.paper, PAL.tangerine],
    [-6.5, 8.2, PAL.paper, PAL.mustard],
    [-6.5, 4.8, PAL.cream, PAL.tangerine],
  ]
  for (const [hx, hz, wall, roof] of leftHouses) {
    buildGabledHouse(hx, hz, 0, wall, roof, 0.94)
  }
  for (let fz = 6.8; fz <= 12.4; fz += 0.45) {
    addBox(0.1, 0.42, 0.18, PAL.paper, -10.55, 0.43, fz, world)
  }
  for (let fx = -10.2; fx <= -5.2; fx += 0.45) {
    addBox(0.18, 0.42, 0.1, PAL.paper, fx, 0.43, 12.85, world)
  }
  buildTree(-9.0, 4.8, 0.62, 'spring')
  buildTree(-10.4, 5.8, 0.52, 'gold')
  buildBush(-7.8, 9.8, 0.34, PAL.grassHi)
  buildBush(-7.8, 6.4, 0.32, PAL.mustard)
  buildFlowerBed(-5.2, 9.8, Math.PI / 2)
  buildStreetLamp(-5.2, 12.2)

  // Left loop skyscrapers: high-contrast terracotta/ivory & teal spire (no blue!)
  buildSkyscraper(-3.6, 7.6, 2.35, 2.35, 6.2, 'bands-terracotta')
  buildSkyscraper(-3.6, 3.8, 2.55, 2.55, 8.4, 'spire-teal')

  /* ── ZONE 2: Upper-Center Skyline & Park Terrace ───────────────────────── */
  buildSkyscraper(-5.0, -4.6, 2.65, 2.65, 7.8, 'bands-charcoal')
  buildSkyscraper(-2.8, -8.4, 2.5, 2.5, 9.2, 'spire-charcoal')
  buildGabledHouse(-9.2, -3.5, Math.PI / 2, PAL.paper, PAL.mustard, 0.94)
  buildGabledHouse(-7.0, -7.2, 0, PAL.cream, PAL.tangerine, 0.9)
  buildGabledHouse(-2.8, -12.2, Math.PI / 2, PAL.paper, PAL.tangerine, 0.94)
  buildTree(-9.4, -6.2, 0.68, 'round')
  buildTree(-8.0, -5.2, 0.56, 'spring')
  buildTree(-5.6, -10.6, 0.62, 'tall')
  buildTree(-6.8, -4.2, 0.5, 'gold')
  buildBush(-4.5, -12.0, 0.38, PAL.grassHi)
  buildFlowerBed(-8.6, -8.2, 0)
  buildStreetLamp(-3.6, -3.2)

  /* ── ZONE 3: Right Quadrant, Gardens & Interactive Billboard ───────────── */
  const makeBillboardTexture = (alt: boolean) => {
    const c = document.createElement('canvas')
    c.width = 768
    c.height = 384
    const ctx = c.getContext('2d')!
    ctx.fillStyle = PAL.butter
    ctx.fillRect(0, 0, c.width, c.height)

    ctx.strokeStyle = PAL.ink
    ctx.lineWidth = 10
    ctx.strokeRect(14, 14, c.width - 28, c.height - 28)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '900 112px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = PAL.ink
    ctx.fillText(alt ? 'NOW' : 'WITH A', c.width / 2, 124)

    ctx.font = '900 116px system-ui, -apple-system, sans-serif'
    ctx.lineWidth = 14
    ctx.strokeStyle = PAL.ink
    const line2 = alt ? 'BOARDING' : 'PULSE.'
    ctx.strokeText(line2, c.width / 2, 262)
    ctx.fillStyle = alt ? PAL.teal : PAL.tangerine
    ctx.fillText(line2, c.width / 2, 262)

    const tex = own(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }

  const bbTexA = makeBillboardTexture(false)
  const bbTexB = makeBillboardTexture(true)
  const bbFaceMat = own(new THREE.MeshBasicMaterial({ map: bbTexA }))

  const boardGroup = new THREE.Group()
  boardGroup.position.set(9.5, 0.22, -10.5)
  addBox(1.3, 0.24, 1.3, PAL.paper, 0, 0.12, 0, boardGroup)
  addBox(0.76, 5.2, 0.76, PAL.slate, 0, 2.6, 0, boardGroup)
  addBox(6.7, 3.6, 0.44, PAL.tangerine, 0, 6.25, 0, boardGroup)
  addBox(7.0, 0.26, 0.78, PAL.tangerine, 0, 4.45, 0.16, boardGroup)
  addBox(6.5, 3.5, 0.18, PAL.paper, 0.12, 6.38, -0.26, boardGroup)

  const bbFace = new THREE.Mesh(
    own(new THREE.PlaneGeometry(6.15, 3.05)),
    bbFaceMat,
  )
  bbFace.position.set(0, 6.25, 0.24)
  boardGroup.add(bbFace)
  world.add(boardGroup)
  registerHot(boardGroup, 'with a pulse billboard', 'billboard')

  // High-contrast ivory, teal-patina, and charcoal towers in front of billboard
  buildSkyscraper(4.4, -5.8, 3.2, 2.3, 4.5, 'ivory')
  buildSkyscraper(7.6, -4.4, 2.45, 2.45, 6.0, 'teal')
  buildSkyscraper(11.2, -3.8, 2.55, 2.55, 7.6, 'ivory')
  addBox(1.5, 2.5, 1.5, PAL.butter, 12.8, 0.22 + 1.25, -3.8, world)
  addBox(1.4, 1.6, 1.4, PAL.tangerine, 12.8, 0.22 + 0.8, -2.2, world)

  // Trees & gardens in Zone 3 courtyard
  buildTree(5.2, -9.6, 0.65, 'round')
  buildTree(7.4, -9.2, 0.56, 'gold')
  buildTree(12.2, -8.8, 0.6, 'spring')
  buildBush(11.0, -8.8, 0.36, PAL.grassHi)
  buildFlowerBed(8.8, -8.2, 0)
  buildStreetLamp(6.0, -3.0)

  /* ── ZONE 4: Front Street, Crosswalk, Bus Stop, Vehicles & Mini Park ───── */
  const roadWaypoints: [number, number][] = [
    [-1.8, 5.4],
    [13.0, 5.4],
    [13.0, 10.2],
    [-1.8, 10.2],
  ]
  const R_ROAD = 1.6
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
    [-1.02, 0.0],
    [1.02, 0.0],
    [1.02, 0.08],
    [-1.02, 0.08],
  ]
  const roadSurfaceProfile: [number, number][] = [
    [-0.86, 0.08],
    [0.86, 0.08],
    [0.86, 0.12],
    [-0.86, 0.12],
  ]
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
  world.add(roadCurbMesh, roadSurfMesh)

  // Center green boulevard median island inside the road loop!
  addLawnPatch(10.6, 2.2, 5.6, 7.8, 0.02)
  buildTree(2.4, 7.8, 0.52, 'spring', world, 0.14)
  buildTree(5.6, 7.8, 0.56, 'gold', world, 0.14)
  buildTree(8.8, 7.8, 0.52, 'round', world, 0.14)
  buildFlowerBed(4.0, 7.8, 0, 0.14)
  buildFlowerBed(7.2, 7.8, 0, 0.14)
  buildStreetLamp(1.2, 7.8, 0.14)
  buildStreetLamp(10.0, 7.8, 0.14)

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

  // Expanded Front Mini Park + adjacent botanical lawn
  const parkGroup = new THREE.Group()
  parkGroup.position.set(5.4, 0, 13.6)
  addBox(7.8, 0.18, 4.8, PAL.cream, 0, 0.09, 0, parkGroup)
  addBox(7.3, 0.1, 4.3, PAL.grass, 0, 0.2, 0, parkGroup)
  addBox(7.34, 0.04, 0.78, PAL.paper, 0, 0.26, 0, parkGroup, { edges: false })
  addBox(0.78, 0.04, 4.34, PAL.paper, 0, 0.26, 0, parkGroup, { edges: false })

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
  parkGroup.add(basin, water)
  buildTree(-2.4, -1.25, 0.65, 'round', parkGroup, 0.24)
  buildTree(2.4, 1.15, 0.58, 'tall', parkGroup, 0.24)
  buildTree(-2.2, 1.25, 0.5, 'gold', parkGroup, 0.24)
  buildTree(2.3, -1.2, 0.52, 'spring', parkGroup, 0.24)
  buildBush(-1.2, 1.4, 0.32, PAL.grassHi, 0.24, parkGroup)
  buildBush(1.2, -1.4, 0.32, PAL.mustard, 0.24, parkGroup)
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
      const w = new THREE.Mesh(wheelCylGeo, mat(PAL.ink))
      w.position.set(wx, 0.22, wz)
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
      const w = new THREE.Mesh(wheelCylGeo, mat(PAL.ink))
      w.scale.setScalar(0.8)
      w.position.set(wx, 0.16, wz)
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
    new THREE.Vector3(-16.0, -0.2, -15.6),
    new THREE.Vector3(16.4, 10.4, 15.6),
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
    camSpanX = (maxX - minX) * 0.92
    camSpanY = (maxY - minY) * 0.92
  }

  const fitFrustum = () => {
    const rect = el.getBoundingClientRect()
    const w = Math.max(280, rect.width || 960)
    const h = Math.max(220, rect.height || Math.round(w * (2 / 3)))
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
  let hoveredItem: HotItem | null = null
  let billboardAlt = false
  let trainBoost = 0
  let tiltX = 0
  let tiltY = 0

  const findHot = (obj: THREE.Object3D | null): HotItem | null => {
    let curr: THREE.Object3D | null = obj
    while (curr) {
      const found = hotItems.find((h) => h.group === curr)
      if (found) return found
      curr = curr.parent
    }
    return null
  }

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    pointerInside = true

    raycaster.setFromCamera(pointerNDC, camera)
    const hits = raycaster.intersectObjects(world.children, true)
    let matched: HotItem | null = null
    for (const hit of hits) {
      if (hit.object === shadowPlane) continue
      matched = findHot(hit.object)
      if (matched) break
    }
    hoveredItem = matched
    canvas.style.cursor = matched ? 'pointer' : 'default'
  }

  const onPointerLeave = () => {
    pointerInside = false
    hoveredItem = null
    canvas.style.cursor = 'default'
  }

  const toggleBillboard = () => {
    billboardAlt = !billboardAlt
    bbFaceMat.map = billboardAlt ? bbTexB : bbTexA
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
      toggleBillboard()
    }
  }

  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('click', onClick)

  /* ── Animation Clock & Frame Step ──────────────────────────────────────── */
  const STILL_TIME = 20
  let simTime = STILL_TIME
  let railDist = STILL_TIME * 3.4
  const roadPos = new THREE.Vector3()
  const roadNext = new THREE.Vector3()
  const roadLen = roadCurve.getLength()

  const stepScene = (t: number, dt: number) => {
    if (trainBoost > 0) trainBoost = Math.max(0, trainBoost - dt * 1.8)
    const speed = 3.4 + trainBoost
    railDist = dt === 0 ? t * 3.4 : railDist + speed * dt

    for (let c = 0; c < orangeCars.length; c++) {
      poseOnRail(orangeCars[c], railDist - c * CAR_GAP, CAR_LEN * 0.44)
    }
    for (let c = 0; c < yellowCars.length; c++) {
      poseOnRail(
        yellowCars[c],
        railDist + L * 0.5 - c * CAR_GAP,
        CAR_LEN * 0.44,
      )
    }

    for (const rv of roadVehicles) {
      const u = (((t * 0.055 + rv.offset) % 1) + 1) % 1
      const uNext = (u + 0.008) % 1
      roadCurve.getPointAt(u, roadPos)
      roadCurve.getPointAt(uNext, roadNext)
      rv.group.position.set(roadPos.x, 0.12, roadPos.z)
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

    const stepDt = Math.min(0.05, dt || 0.016)
    for (const item of hotItems) {
      const target = hoveredItem === item ? 0.38 : 0
      const force = (target - item.lift) * 140 - item.vel * 16
      item.vel += force * stepDt
      item.lift += item.vel * stepDt
      item.group.position.y = item.baseY + item.lift
    }

    const targetTiltX = pointerInside ? pointerNDC.x * 0.038 : 0
    const targetTiltY = pointerInside ? pointerNDC.y * 0.024 : 0
    tiltX += (targetTiltX - tiltX) * 0.1
    tiltY += (targetTiltY - tiltY) * 0.1
    updateCameraBounds(BASE_AZ + tiltX, BASE_EL + tiltY)

    renderer.render(scene, camera)

    if (onReadout) {
      if (hoveredItem) {
        onReadout(`${hoveredItem.name} · active`)
      } else {
        const pct = Math.round(((((railDist % L) + L) % L) / L) * 100)
        onReadout(
          `side a express · ${pct}% lap · ${
            billboardAlt ? 'now boarding' : 'with a pulse'
          }`,
        )
      }
    }
  }

  /* ── Lifecycle: Resize, Reduced Motion, Offscreen Pause & Cleanup ─────── */
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let disposed = false
  let inView = true
  let rafId = 0
  let lastNow = performance.now()

  const tickLoop = (now: number) => {
    if (disposed) return
    const dt = Math.min(0.05, (now - lastNow) / 1000)
    lastNow = now
    simTime += dt
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
