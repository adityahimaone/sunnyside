/* paper-city · a hero: an isometric paper city on the blue cutting mat.
   Axis-aligned 45° isometric figure-8 railway with a central arch crossing
   over the INTERFACES bridge, cobalt skyscrapers, gabled houses, standing
   about/intro UI card, ground avenue through the blue viaduct arch, bus stop,
   mini park, and WITH A PULSE. billboard. */
Diorama.figure({
  name: 'paper-city',
  size: 'hero',
  title: 'Paper City',
  means: 'An isometric figure-8 railway arches over the INTERFACES bridge while two trains, a bus and cars bring the paper city to life.',
  hint: 'Hover a train, house or tower; tap the billboard to change its message.',
  theme: {
    base: 'print',
    bg: 'transparent',
    halo: 0,
    accent: '#ff6a2b',
    stroke: '#191a2e',
    strokeWidth: 1,
    palette: {
      ink: '#191a2e', paper: '#fffaf1', cloud: '#fffaf1', cobalt: '#3d53d6', cobaltSoft: '#6f82ee',
      mustard: '#ffd23f', coral: '#ff6a2b', terracotta: '#ff6a2b', grass: '#3f9f4a', leaf: '#4fae4f',
      leafDark: '#2f8a3f', leafLight: '#7cc15a', asphalt: '#f3ecdf', line: '#fffaf1', steel: '#191a2e',
      mist: '#c9cde8', slate: '#2a2c45', sky: '#9fb1ff', wood: '#d9a441', trunk: '#8a5a2b'
    }
  },
  camera: { az: 45, el: 35.264, pad: 1.02 },
  tilt: 3,
  still: 14,
  build: function (o) {
    var D = o.D, pal = o.pal, hot = [];

    /* ---------- pure isometric axis-aligned figure-8 track ---------- */
    var VERTS = [[0, 15], [0, -15], [16, -15], [16, 0], [-15, 0], [-15, 15]];
    var R_FILLET = 4.2, NV = VERTS.length, corners = [], i, k;
    for (i = 0; i < NV; i++) {
      var pPrev = VERTS[(i - 1 + NV) % NV], pCurr = VERTS[i], pNext = VERTS[(i + 1) % NV];
      var dx1 = pPrev[0] - pCurr[0], dz1 = pPrev[1] - pCurr[1], l1 = Math.hypot(dx1, dz1);
      var dx2 = pNext[0] - pCurr[0], dz2 = pNext[1] - pCurr[1], l2 = Math.hypot(dx2, dz2);
      var u1 = [dx1 / l1, dz1 / l1], u2 = [dx2 / l2, dz2 / l2];
      var cosT = Math.max(-0.9999, Math.min(0.9999, u1[0] * u2[0] + u1[1] * u2[1]));
      var halfT = Math.acos(cosT) / 2, tanH = Math.tan(halfT);
      var d = R_FILLET / tanH, r = R_FILLET, maxD = Math.min(l1, l2) * 0.45;
      if (d > maxD) { d = maxD; r = d * tanH; }
      var t1 = [pCurr[0] + u1[0] * d, pCurr[1] + u1[1] * d];
      var t2 = [pCurr[0] + u2[0] * d, pCurr[1] + u2[1] * d];
      var bx = u1[0] + u2[0], bz = u1[1] + u2[1], bl = Math.hypot(bx, bz);
      var distBO = r / Math.sin(halfT);
      var org = [pCurr[0] + bx / bl * distBO, pCurr[1] + bz / bl * distBO];
      var a1 = Math.atan2(t1[1] - org[1], t1[0] - org[0]);
      var a2 = Math.atan2(t2[1] - org[1], t2[0] - org[0]);
      var da = a2 - a1;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      corners.push({ t1: t1, t2: t2, org: org, r: r, a1: a1, da: da });
    }

    var xzPts = [], accXZ = [0], L_xz = 0, sArchXZ = 0, archMark = false;
    function pushXZ(x, z) {
      if (xzPts.length) {
        var pr = xzPts[xzPts.length - 1];
        L_xz += Math.hypot(x - pr[0], z - pr[1]);
        accXZ.push(L_xz);
      }
      xzPts.push([x, z]);
    }
    for (i = 0; i < NV; i++) {
      var c0 = corners[i], c1 = corners[(i + 1) % NV];
      var nArc = Math.max(12, Math.ceil(Math.abs(c0.da) * c0.r / 0.04));
      for (k = 0; k < nArc; k++) {
        var ang = c0.a1 + c0.da * (k / nArc);
        pushXZ(c0.org[0] + Math.cos(ang) * c0.r, c0.org[1] + Math.sin(ang) * c0.r);
      }
      var slen = Math.hypot(c1.t1[0] - c0.t2[0], c1.t1[1] - c0.t2[1]);
      var nSeg = Math.max(8, Math.ceil(slen / 0.04));
      for (k = 0; k < nSeg; k++) {
        var fSeg = k / nSeg;
        var sx = c0.t2[0] + (c1.t1[0] - c0.t2[0]) * fSeg;
        var sz = c0.t2[1] + (c1.t1[1] - c0.t2[1]) * fSeg;
        pushXZ(sx, sz);
        /* midpoint of segment 3->4 (z=0 crossing at x=0) gets the high arch */
        if (i === 3 && !archMark && sx <= 0) { sArchXZ = L_xz; archMark = true; }
      }
    }
    L_xz += Math.hypot(xzPts[0][0] - xzPts[xzPts.length - 1][0], xzPts[0][1] - xzPts[xzPts.length - 1][1]);

    var dense = [], acc = [0], L = 0, prev = null;
    for (i = 0; i <= xzPts.length; i++) {
      var idx = i % xzPts.length, pt = xzPts[idx], sXZ = i === xzPts.length ? L_xz : accXZ[idx];
      var ds = Math.abs(sXZ - sArchXZ); ds = Math.min(ds, L_xz - ds);
      var y = 3.6;
      if (ds < 6.5) {
        var w = 1 - ds / 6.5, sm = w * w * (3 - 2 * w);
        y = 3.6 + 3.2 * sm;
      }
      if (prev) { L += Math.hypot(pt[0] - prev[0], y - prev[1], pt[1] - prev[2]); acc.push(L); }
      prev = [pt[0], y, pt[1]]; dense.push(prev);
    }

    var DS = .4, M = Math.round(L / DS), PX = [], PY = [], PZ = [], j = 0, d0, f;
    for (i = 0; i < M; i++) {
      var s0 = i * L / M; while (acc[j + 1] < s0) j++;
      d0 = acc[j + 1] - acc[j]; f = d0 > 0 ? (s0 - acc[j]) / d0 : 0;
      PX.push(dense[j][0] + (dense[j + 1][0] - dense[j][0]) * f);
      PY.push(dense[j][1] + (dense[j + 1][1] - dense[j][1]) * f);
      PZ.push(dense[j][2] + (dense[j + 1][2] - dense[j][2]) * f);
    }
    var STEP = L / M;
    function at(s, out) {
      s = ((s % L) + L) % L; var kk = Math.floor(s / STEP), g = s / STEP - kk, k2 = (kk + 1) % M; kk = kk % M;
      out.x = PX[kk] + (PX[k2] - PX[kk]) * g; out.y = PY[kk] + (PY[k2] - PY[kk]) * g; out.z = PZ[kk] + (PZ[k2] - PZ[kk]) * g; return out;
    }
    var pa = { x: 0, y: 0, z: 0 }, pb = { x: 0, y: 0, z: 0 };
    function pose(g, s, h) {
      at(s + h, pa); at(s - h, pb);
      var dx = pa.x - pb.x, dy = pa.y - pb.y, dz = pa.z - pb.z;
      g.position.x = (pa.x + pb.x) / 2; g.position.y = (pa.y + pb.y) / 2; g.position.z = (pa.z + pb.z) / 2;
      g.rotation.y = Math.atan2(-dz, dx); g.rotation.z = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
    }

    /* ---------- the track deck, rails, extensions & viaduct arches ---------- */
    function trackBox(cx, cy, cz, len, yaw, pitch) {
      var g = D.group(cx, cy, cz); g.rotation.y = yaw; g.rotation.z = pitch || 0;
      D.box(len + .14, .38, 2.1, pal.ink, 0, -.19, 0, g, { shadow: false });
      D.box(len + .1, .1, .12, pal.mist, 0, .05, .72, g, { shadow: false });
      D.box(len + .1, .1, .12, pal.mist, 0, .05, -.72, g, { shadow: false });
    }
    var SEG = 3;
    for (k = 0; k < M; k += SEG) {
      var a = k, b = (k + SEG) % M, dx = PX[b] - PX[a], dy = PY[b] - PY[a], dz = PZ[b] - PZ[a], len = Math.hypot(dx, dy, dz);
      trackBox((PX[a] + PX[b]) / 2, (PY[a] + PY[b]) / 2, (PZ[a] + PZ[b]) / 2, len, Math.atan2(-dz, dx), Math.atan2(dy, Math.hypot(dx, dz)));
    }
    /* static extensions continuing the two main axes to the mat edges */
    trackBox(0, 3.6, -17.5, 9, Math.PI / 2, 0);
    trackBox(17.5, 3.6, 0, 9, 0, 0);

    /* Cobalt Blue Arch Viaduct under the INTERFACES bridge (x = 0, z in [1.5, 9.5]) */
    var blueArch = D.group(0, 0, 5.4); blueArch.name = 'cobalt viaduct'; hot.push(blueArch);
    D.box(2.1, 3.15, 1.8, pal.cobalt, 0, 1.57, -2.9, blueArch);
    D.box(2.1, 3.15, 1.7, pal.cobalt, 0, 1.57, 2.5, blueArch);
    D.box(2.1, 1.05, 7.1, pal.cobalt, 0, 2.62, -.2, blueArch);
    D.box(.08, .5, .6, pal.paper, 1.07, 2.62, -2.9, blueArch, { shadow: false });
    D.box(.08, .5, .6, pal.paper, 1.07, 2.62, 2.5, blueArch, { shadow: false });

    /* Dark multi-arch viaduct piers along z = 0 (left & right of center) */
    function archWall(xStart, xEnd, zPos) {
      var wg = D.group(0, 0, zPos), xs;
      D.box(xEnd - xStart + 1.2, .75, 1.75, pal.slate, (xStart + xEnd) / 2, 2.9, 0, wg);
      for (xs = xStart; xs <= xEnd + .1; xs += 3.1) D.box(1.1, 3.2, 1.75, pal.slate, xs, 1.6, 0, wg);
    }
    archWall(-11, -3.2, 0);
    archWall(3.2, 12.6, 0);

    /* Slender pillars under the curved left loop & right loop */
    [[-14.6, 4.2], [-14.2, 11.2], [-10.8, 14.6], [-4.2, 14.8], [0, -6.5], [0, -11.5], [11.5, -14.8], [15.6, -11.0], [15.6, -4.0]].forEach(function (pt) {
      D.box(.95, 3.25, .95, pal.ink, pt[0], 1.62, pt[1]);
    });

    /* ---------- INTERFACES 3D block letters along x = 0 bridge ---------- */
    var word = 'INTERFACES', wi;
    for (wi = 0; wi < word.length; wi++) {
      var lz = 5.4 - wi * 1.32;
      var lg = D.group(1.36, 3.65, lz); lg.rotation.y = Math.PI / 2;
      D.box(1.18, 1.95, .68, pal.ink, 0, 1.0, 0, lg);
      var lface = D.label(word[wi], 1.12, 1.75, { color: pal.paper, size: 330, weight: 900, font: 'system-ui, -apple-system, sans-serif' });
      lface.position.set(0, 1.0, .36); lg.add(lface);
    }

    /* ---------- trains ---------- */
    var CAR = 2.8, GAP = 3.0;
    function car(parent, body, roof, text) {
      var g = D.group(0, 0, 0, parent);
      D.box(CAR, 1.12, 1.4, body, 0, .74, 0, g);
      D.box(CAR - .25, .12, 1.26, roof, 0, 1.36, 0, g);
      D.box(CAR - .2, .2, 1.45, pal.ink, 0, .2, 0, g, { shadow: false });
      D.box(CAR - .45, .36, 1.43, pal.sky, 0, .98, 0, g, { shadow: false });
      if (text) {
        var l1 = D.label(text, CAR - .3, .46, { color: pal.ink, size: 54, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); l1.position.set(0, .54, .72); g.add(l1);
        var l2 = D.label(text, CAR - .3, .46, { color: pal.ink, size: 54, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); l2.position.set(0, .54, -.72); l2.rotation.y = Math.PI; g.add(l2);
      }
      return g;
    }
    function train(name, n, body, roof, texts) {
      var t = D.group(0, 0, 0); t.name = name; var cars = [];
      for (var c = 0; c < n; c++) cars.push(car(t, body, c === 0 ? pal.ink : roof, texts ? texts[c] : null));
      hot.push(t); return { g: t, cars: cars };
    }
    var orange = train('orange express', 5, pal.coral, pal.paper, [null, 'SIDE A', 'EXPRESS', null, null]);
    var yellow = train('yellow local', 4, pal.mustard, pal.paper, null);

    /* ---------- isometric building helpers ---------- */
    function house(x, z, yaw, wall, roof, s) {
      s = s || 1; var g = D.group(x, 0, z); g.rotation.y = yaw;
      D.box(2.1 * s, 1.4 * s, 1.9 * s, wall, 0, .7 * s, 0, g);
      D.wedge(2.35 * s, 1.0 * s, 2.15 * s, roof, 0, 1.4 * s, 0, g);
      D.box(.35, .6, .35, pal.ink, .55 * s, 2.0 * s, -.25, g);
      D.box(.42, .75, .05, pal.ink, -.4 * s, .38, .97 * s, g, { shadow: false });
      D.box(.48, .44, .05, pal.sky, .45 * s, .88 * s, .97 * s, g, { shadow: false });
      g.name = 'house'; hot.push(g); return g;
    }
    function tower(x, z, w, d, h, kind) {
      var g = D.group(x, 0, z), fl, wx;
      if (kind === 'spire') {
        D.box(w, h * .48, d, pal.cobalt, 0, h * .24, 0, g);
        D.box(w * .76, h * .3, d * .76, pal.cobalt, 0, h * .48 + h * .15, 0, g);
        D.box(w * .48, h * .22, d * .48, pal.cobalt, 0, h * .78 + h * .11, 0, g);
        D.cone(.48, 2.0, pal.cobalt, 0, h + 1.0, 0, g, 4);
        D.cyl(.04, .04, 1.4, pal.ink, 0, h + 2.6, 0, g, 6);
      } else if (kind === 'fin') {
        D.box(w, h, d, pal.cobalt, 0, h / 2, 0, g);
        D.box(w * .85, .32, d * .85, pal.ink, 0, h + .16, 0, g);
        D.box(.5, h + 1.1, d * .82, pal.paper, w / 2 + .22, (h + 1.1) / 2, 0, g);
      } else {
        D.box(w, h, d, pal.cobalt, 0, h / 2, 0, g);
        D.box(w + .22, .26, d + .22, pal.ink, 0, h + .13, 0, g);
        D.box(w * .38, .75, d * .38, pal.paper, -.2, h + .55, -.2, g);
      }
      var nFl = Math.max(2, Math.floor((h * (kind === 'spire' ? .48 : 1)) / 1.4));
      for (fl = 0; fl < nFl; fl++) for (wx = -1; wx <= 1; wx++) {
        D.box(.36, .62, .05, pal.paper, wx * (w * .28), 1.2 + fl * 1.3, d / 2 + .02, g, { shadow: false });
        D.box(.05, .62, .36, pal.paper, w / 2 + .02, 1.2 + fl * 1.3, wx * (d * .28), g, { shadow: false });
      }
      g.name = kind === 'spire' ? 'spire tower' : 'tower'; hot.push(g); return g;
    }

    /* ---------- ZONE 1: Inside Left Loop (x in [-14,-2], z in [2,14]) ---------- */
    var card = D.group(-11.6, 0, 8.2); card.rotation.y = Math.PI / 2; card.name = 'about/intro card'; hot.push(card);
    D.box(6.8, 4.8, .48, pal.paper, 0, 2.6, 0, card);
    D.box(6.8, .42, .52, pal.ink, 0, 4.85, 0, card, { shadow: false });
    var clab = D.label('about/intro', 5.6, .8, { color: pal.ink, size: 52, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); clab.position.set(-.4, 3.85, .26); card.add(clab);
    D.box(5.2, .18, .06, pal.mist, -.2, 2.95, .26, card, { shadow: false });
    D.box(4.6, .18, .06, pal.mist, -.5, 2.45, .26, card, { shadow: false });
    D.box(3.8, .18, .06, pal.mist, -.9, 1.95, .26, card, { shadow: false });
    D.box(2.0, .48, .1, pal.coral, -1.4, 1.05, .27, card, { shadow: false });
    D.box(2.0, .48, .1, pal.mustard, 1.1, 1.05, .27, card, { shadow: false });

    [
      [-9.2, 11.4, pal.mustard], [-9.2, 8.2, pal.coral],
      [-6.5, 11.4, pal.coral], [-6.5, 8.2, pal.mustard], [-6.5, 4.8, pal.coral]
    ].forEach(function (h) {
      house(h[0], h[1], 0, pal.paper, h[2], .95);
    });
    D.box(.12, .35, 3.2, pal.paper, -10.5, .18, 9.8, null, { shadow: false });
    D.box(3.4, .35, .12, pal.paper, -7.8, .18, 12.8, null, { shadow: false });

    tower(-3.6, 7.6, 2.4, 2.4, 6.2, 'plain');
    tower(-3.6, 3.8, 2.6, 2.6, 8.2, 'spire');

    /* ---------- ZONE 2: Upper-Center Skyline (x in [-11,-2], z in [-13,-3]) ---------- */
    tower(-5.0, -4.6, 2.7, 2.7, 7.8, 'fin');
    tower(-2.9, -8.4, 2.5, 2.5, 9.2, 'spire');
    house(-9.2, -3.5, Math.PI / 2, pal.paper, pal.mustard, .95);
    house(-7.0, -7.2, 0, pal.paper, pal.mustard, .9);
    house(-2.8, -12.2, Math.PI / 2, pal.paper, pal.coral, .95);
    D.props.tree(-8.8, -6.4, null, { r: .65, kind: 'round' });
    D.props.tree(-5.8, -10.5, null, { r: .55, kind: 'pine' });
    D.props.bush(-1.6, -10.2, null, { r: .38 });

    /* ---------- ZONE 3: Right Quadrant & Billboard (x in [3,14], z in [-13,-2.5]) ---------- */
    var board = D.group(9.5, 0, -10.5); board.name = 'billboard'; hot.push(board);
    D.box(.75, 5.4, .75, pal.cobalt, 0, 2.7, 0, board);
    D.box(6.6, 3.5, .42, pal.coral, 0, 6.4, 0, board);
    D.box(6.9, .26, .68, pal.coral, 0, 4.6, .1, board);
    D.box(6.0, 2.9, .1, pal.mustard, 0, 6.4, .24, board, { shadow: false });
    var msgA = D.group(0, 6.4, .32, board), msgB = D.group(0, 6.4, .32, board);
    var a1 = D.label('WITH A', 5.4, 1.0, { color: pal.ink, size: 58, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); a1.position.set(0, .58, 0); msgA.add(a1);
    var a2 = D.label('PULSE.', 5.4, 1.2, { color: pal.coral, size: 58, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); a2.position.set(0, -.58, 0); msgA.add(a2);
    var b1 = D.label('NOW', 5.4, 1.0, { color: pal.ink, size: 58, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); b1.position.set(0, .58, 0); msgB.add(b1);
    var b2 = D.label('BOARDING', 5.4, 1.2, { color: pal.cobalt, size: 58, weight: 800, font: 'system-ui, -apple-system, sans-serif' }); b2.position.set(0, -.58, 0); msgB.add(b2);

    /* buildings in front of billboard */
    var hall = D.group(4.4, 0, -5.8); hall.name = 'pavilion'; hot.push(hall);
    D.box(3.4, 4.2, 2.4, pal.paper, 0, 2.1, 0, hall);
    D.box(3.6, .35, 2.6, pal.ink, 0, 4.3, 0, hall);
    tower(7.6, -4.4, 2.4, 2.4, 6.0, 'plain');
    tower(11.2, -3.8, 2.6, 2.6, 7.6, 'plain');
    D.box(1.5, 2.4, 1.5, pal.mustard, 12.6, 1.2, -3.8);
    D.box(1.4, 3.0, 1.4, pal.paper, 10.6, 1.5, -5.8);

    /* ---------- ZONE 4: Ground Street, Bus Stop, Vehicles & Mini Park ---------- */
    var roadPts = [[-1.8, 5.4], [13.0, 5.4], [13.0, 10.2], [-1.8, 10.2]];
    var road = D.path(roadPts, true, 1.6), tt, nRoad = 28;
    for (tt = 0; tt < nRoad; tt++) {
      var q0 = road.at(tt / nRoad * road.length), q1 = road.at(((tt + 1) % nRoad) / nRoad * road.length);
      var rl = Math.hypot(q1.x - q0.x, q1.z - q0.z);
      var rg = D.group((q0.x + q1.x) / 2, 0, (q0.z + q1.z) / 2); rg.rotation.y = Math.atan2(-(q1.z - q0.z), q1.x - q0.x);
      D.box(rl + .4, .05, 1.75, pal.asphalt, 0, .03, 0, rg, { shadow: false });
    }

    house(4.4, 2.8, 0, pal.paper, pal.coral, .9);
    var stop = D.group(7.8, 0, 3.0); stop.name = 'bus stop'; hot.push(stop);
    D.box(2.2, .18, 1.1, pal.cobalt, 0, 1.45, 0, stop);
    D.cyl(.06, .06, 1.4, pal.ink, -.9, .7, -.4, stop, 8);
    D.cyl(.06, .06, 1.4, pal.ink, .9, .7, -.4, stop, 8);
    D.box(1.5, .45, .5, pal.cobalt, 0, .3, -.2, stop);
    D.box(.85, 1.4, .75, pal.coral, 10.2, .7, 3.1);

    /* Front Mini Park */
    var park = D.group(4.8, 0, 13.5); park.name = 'mini park'; hot.push(park);
    D.box(5.2, .08, 4.4, pal.grass, 0, .04, 0, park, { shadow: false });
    D.box(5.2, .04, .75, pal.paper, 0, .09, 0, park, { shadow: false });
    D.box(.75, .04, 4.4, pal.paper, 0, .09, 0, park, { shadow: false });
    D.cyl(.95, .95, .28, pal.paper, 0, .2, 0, park, 18);
    D.cyl(.68, .68, .12, pal.sky, 0, .36, 0, park, 18);
    D.props.tree(-1.6, -1.2, park, { r: .65, kind: 'round' });
    D.props.tree(1.7, 1.1, park, { r: .55, kind: 'tall' });
    D.props.bush(-1.7, 1.3, park, { r: .34 });

    /* Road vehicles */
    function bus() {
      var g = D.group(0, 0, 0); D.box(2.6, 1.05, 1.25, pal.mustard, 0, .72, 0, g);
      D.box(2.4, .34, 1.29, pal.sky, 0, 1.02, 0, g, { shadow: false });
      D.box(2.4, .1, 1.15, pal.paper, 0, 1.28, 0, g);
      var w = [[-.85, .58], [.85, .58], [-.85, -.58], [.85, -.58]].map(function (q) { return D.wheel(.22, .18, pal.ink, q[0], .22, q[1], g); });
      g.name = 'bus'; hot.push(g); return { g: g, w: w };
    }
    function minicar(c) {
      var g = D.group(0, 0, 0); D.box(1.4, .46, .8, c, 0, .38, 0, g); D.box(.75, .36, .72, pal.paper, -.1, .76, 0, g);
      var w = [[-.46, .38], [.46, .38], [-.46, -.38], [.46, -.38]].map(function (q) { return D.wheel(.15, .13, pal.ink, q[0], .15, q[1], g); });
      g.name = 'car'; hot.push(g); return { g: g, w: w };
    }
    var vehicles = [bus(), minicar(pal.coral), minicar(pal.paper)];

    /* clouds */
    var clouds = [D.props.cloud(-9, 9.2, -12, null, { r: 1.15 }), D.props.cloud(1, 9.8, -14, null, { r: .95 }), D.props.cloud(11, 9.6, -15, null, { r: .85 })];

    var lift = hot.map(function () { return D.spring(120, 14); });
    return {
      hot: hot, lift: lift, orange: orange, yellow: yellow, pose: pose, L: L, GAP: GAP, CAR: CAR,
      road: road, vehicles: vehicles, clouds: clouds, board: board, msgA: msgA, msgB: msgB
    };
  },
  tick: function (ctx) {
    var p = ctx.parts, t = ctx.t, L = p.L, speed = 3.2, d = t * speed, c, i, v, dist, RT = p.road.length / 1.8;
    for (c = 0; c < p.orange.cars.length; c++) p.pose(p.orange.cars[c], d - c * p.GAP, p.CAR / 2 - .2);
    for (c = 0; c < p.yellow.cars.length; c++) p.pose(p.yellow.cars[c], d + L / 2 - c * p.GAP, p.CAR / 2 - .2);
    for (i = 0; i < p.vehicles.length; i++) {
      v = p.vehicles[i]; dist = ((t / RT) + i / 3) % 1 * p.road.length;
      Diorama.place(v.g, p.road, dist); Diorama.spin(v.w, dist, i ? .15 : .22);
    }
    for (i = 0; i < p.clouds.length; i++) { var cl = p.clouds[i]; cl.position.x = (-9 + i * 10) + Math.sin(t * .25 + i * 2.1) * 2.4; }
    var on = ctx.active === p.board ? 1 : 0;
    p.msgA.visible = !on; p.msgB.visible = !!on;
    for (i = 0; i < p.hot.length; i++) {
      var g = p.hot[i]; p.lift[i].t = (ctx.hover === g) ? .42 : 0; p.lift[i].step(ctx.dt); g.position.y = p.lift[i].x;
    }
    ctx.read = 'orange express · ' + Math.round(((d % L) + L) % L / L * 100) + '% round';
  }
});
