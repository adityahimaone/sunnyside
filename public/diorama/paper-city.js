/* paper-city · a hero: a paper city on the blue cutting mat.
   One elevated figure-8 railway, turned across the mat, crosses itself on a
   bridge: two trains run it forever, one over the other. Cobalt towers,
   gabled houses, a roundabout park, a road with a bus and two cars. Words:
   INTERFACES on the bridge, SIDE A EXPRESS on the orange train, a billboard
   (tap it to change the message). */
Diorama.figure({
  name: 'paper-city',
  size: 'hero',
  title: 'Paper City',
  means: 'A figure-8 railway crosses itself on a bridge; two trains ride it while a bus and cars circle the park.',
  hint: 'Hover a train or a tower; tap the billboard to change its message.',
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
      leafDark: '#2f8a3f', leafLight: '#7cc15a', asphalt: '#e8dfc9', line: '#fffaf1', steel: '#191a2e',
      mist: '#c9cde8', slate: '#2a2c45', sky: '#9fb1ff', wood: '#d9a441', trunk: '#8a5a2b'
    }
  },
  camera: { az: 37, el: 35.264, pad: 1.02 },
  tilt: 3,
  still: 9,
  build: function (o) {
    var D = o.D, pal = o.pal, hot = [], R = 7;
    var TAU = Math.PI * 2;
    var rnd = function () { R = (R * 16807) % 2147483647; return R / 2147483647; };

    /* ---------- the figure-8 centreline, resampled by arc length ---------- */
    var A = 17, B = 25, TH = -0.78, CS = Math.cos(TH), SN = Math.sin(TH);
    function raw(t, out) {
      var s = Math.sin(t), c = Math.cos(t), k = 1 + s * s, u = A * c / k, v = B * s * c / k;
      out.x = u * CS - v * SN; out.z = u * SN + v * CS; out.y = 3.7 - 2.1 * s; return out;
    }
    var tmp = { x: 0, y: 0, z: 0 }, dense = [], acc = [0], i, L = 0, prev = null;
    for (i = 0; i <= 3000; i++) {
      raw(i / 3000 * TAU, tmp);
      if (prev) { L += Math.sqrt(Math.pow(tmp.x - prev[0], 2) + Math.pow(tmp.y - prev[1], 2) + Math.pow(tmp.z - prev[2], 2)); acc.push(L); }
      prev = [tmp.x, tmp.y, tmp.z]; dense.push(prev);
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
      s = ((s % L) + L) % L; var k = Math.floor(s / STEP), g = s / STEP - k, k2 = (k + 1) % M; k = k % M;
      out.x = PX[k] + (PX[k2] - PX[k]) * g; out.y = PY[k] + (PY[k2] - PY[k]) * g; out.z = PZ[k] + (PZ[k2] - PZ[k]) * g; return out;
    }
    var pa = { x: 0, y: 0, z: 0 }, pb = { x: 0, y: 0, z: 0 };
    /* pose a group centred at arc length s on the rail, spanning 2h */
    function pose(g, s, h) {
      at(s + h, pa); at(s - h, pb);
      var dx = pa.x - pb.x, dy = pa.y - pb.y, dz = pa.z - pb.z;
      g.position.x = (pa.x + pb.x) / 2; g.position.y = (pa.y + pb.y) / 2; g.position.z = (pa.z + pb.z) / 2;
      g.rotation.y = Math.atan2(-dz, dx); g.rotation.z = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
    }
    /* horizontal distance from a ground point to the nearest rail sample */
    function railDist(x, z, skipLow) {
      var m = 1e9, k, dx, dz, dd;
      for (k = 0; k < M; k += 2) { dx = PX[k] - x; dz = PZ[k] - z; dd = dx * dx + dz * dz; if (dd < m) m = dd; }
      return Math.sqrt(m);
    }

    /* ---------- the track: deck, rails, piers ---------- */
    var SEG = 3, k;
    for (k = 0; k < M; k += SEG) {
      var a = k, b = (k + SEG) % M, dx = PX[b] - PX[a], dy = PY[b] - PY[a], dz = PZ[b] - PZ[a], len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      var g = D.group((PX[a] + PX[b]) / 2, (PY[a] + PY[b]) / 2, (PZ[a] + PZ[b]) / 2);
      g.rotation.y = Math.atan2(-dz, dx); g.rotation.z = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
      D.box(len + .14, .38, 2.1, pal.ink, 0, -.19, 0, g, { shadow: false });
      D.box(len + .1, .1, .12, pal.mist, 0, .05, .72, g, { shadow: false });
      D.box(len + .1, .1, .12, pal.mist, 0, .05, -.72, g, { shadow: false });
    }
    /* piers where the deck is high enough, away from the other branch */
    var pierAt = 6, lastPier = -99, px = { x: 0, y: 0, z: 0 }, pq = { x: 0, y: 0, z: 0 };
    for (var ps = 1.5; ps < L; ps += pierAt) {
      at(ps, px); if (px.y < 1.2) continue;
      var cl = 99, kk, ddx, ddz;
      for (kk = 0; kk < M; kk += 2) {
        var arc = Math.abs(kk * STEP - ps); arc = Math.min(arc, L - arc); if (arc < 9) continue;
        ddx = PX[kk] - px.x; ddz = PZ[kk] - px.z; cl = Math.min(cl, Math.sqrt(ddx * ddx + ddz * ddz));
      }
      if (cl < 3.4) continue;
      var pg = D.group(px.x, 0, px.z); at(ps + .5, pq);
      pg.rotation.y = Math.atan2(-(pq.z - px.z), pq.x - px.x);
      var ph = px.y - .38;
      D.box(1, ph, 1, pal.cobalt, 0, ph / 2, .72, pg);
      D.box(1, ph, 1, pal.cobalt, 0, ph / 2, -.72, pg);
      D.box(1.1, .5, 2.9, pal.slate, 0, ph - .25, 0, pg);
    }

    /* ---------- trains ---------- */
    var CAR = 3, GAP = 3.2;
    function car(parent, body, roof, text) {
      var g = D.group(0, 0, 0, parent);
      D.box(CAR, 1.15, 1.45, body, 0, .75, 0, g);
      D.box(CAR - .3, .12, 1.3, roof, 0, 1.38, 0, g);
      D.box(CAR - .2, .22, 1.5, pal.ink, 0, .22, 0, g, { shadow: false });
      D.box(CAR - .5, .38, 1.48, pal.sky, 0, 1.0, 0, g, { shadow: false });
      if (text) {
        var l1 = D.label(text, CAR - .4, .5, { color: pal.ink, size: 60 }); l1.position.set(0, .56, .74); g.add(l1);
        var l2 = D.label(text, CAR - .4, .5, { color: pal.ink, size: 60 }); l2.position.set(0, .56, -.74); l2.rotation.y = Math.PI; g.add(l2);
      }
      return g;
    }
    function train(name, n, body, roof, texts) {
      var t = D.group(0, 0, 0); t.name = name; var cars = [];
      for (var c = 0; c < n; c++) cars.push(car(t, c === 0 ? body : body, c === 0 ? pal.ink : roof, texts ? texts[c] : null));
      hot.push(t); return { g: t, cars: cars };
    }
    var orange = train('orange express', 5, pal.coral, pal.paper, [null, 'SIDE A', 'EXPRESS', null, null]);
    var yellow = train('yellow local', 4, pal.mustard, pal.paper, null);

    /* ---------- the city ---------- */
    function uv(x, z) { return [x * CS + z * SN, -x * SN + z * CS]; }
    function inPoly(poly, x, z) {
      var inside = false, n = poly.length, q, w;
      for (q = 0, w = n - 1; q < n; w = q++) {
        if (((poly[q][1] > z) !== (poly[w][1] > z)) && (x < (poly[w][0] - poly[q][0]) * (z - poly[q][1]) / (poly[w][1] - poly[q][1]) + poly[q][0])) inside = !inside;
      }
      return inside;
    }
    /* the two loops as polygons, for "which loop is this lot in" */
    var loopA = [], loopB = [], cA = [0, 0], cB = [0, 0], tt;
    for (tt = 0; tt < 40; tt++) {
      raw(Math.PI / 2 + tt / 40 * Math.PI, tmp); loopA.push([tmp.x, tmp.z]); cA[0] += tmp.x / 40; cA[1] += tmp.z / 40;
      raw(-Math.PI / 2 + tt / 40 * Math.PI, tmp); loopB.push([tmp.x, tmp.z]); cB[0] += tmp.x / 40; cB[1] += tmp.z / 40;
    }

    function house(x, z, yaw, wall, roof, s) {
      s = s || 1; var g = D.group(x, 0, z); g.rotation.y = yaw;
      D.box(2.3 * s, 1.5 * s, 2.0 * s, wall, 0, .75 * s, 0, g);
      D.wedge(2.6 * s, 1.1 * s, 2.3 * s, roof, 0, 1.5 * s, 0, g);
      D.box(.4, .7, .4, pal.ink, .6 * s, 2.2 * s, -.3, g);
      D.box(.5, .85, .06, pal.ink, -.45 * s, .43, 1.02 * s, g, { shadow: false });
      D.box(.55, .5, .06, pal.sky, .5 * s, .95 * s, 1.02 * s, g, { shadow: false });
      g.name = 'house'; hot.push(g); return g;
    }
    function tower(x, z, h, kind, yaw) {
      var g = D.group(x, 0, z); g.rotation.y = yaw || 0; var w = 2.6, d = 2.6, fl, wx;
      if (kind === 'spire') {
        D.box(3.2, h * .45, 3.2, pal.cobalt, 0, h * .225, 0, g);
        D.box(2.4, h * .3, 2.4, pal.cobalt, 0, h * .45 + h * .15, 0, g);
        D.box(1.5, h * .25, 1.5, pal.cobalt, 0, h * .75 + h * .125, 0, g);
        D.cone(.55, 2.4, pal.cobalt, 0, h + 1.2, 0, g, 4);
        D.cyl(.04, .04, 1.6, pal.ink, 0, h + 3.2, 0, g, 6);
        w = 3.2; d = 3.2;
      } else if (kind === 'fin') {
        D.box(2.8, h, 2.8, pal.cobalt, 0, h / 2, 0, g);
        D.box(.5, h + 1.6, 2.4, pal.paper, 1.5, (h + 1.6) / 2, 0, g);
        D.box(2.4, .35, 2.4, pal.ink, 0, h + .17, 0, g);
        w = 2.8; d = 2.8;
      } else if (kind === 'step') {
        D.box(3.0, h * .7, 3.0, pal.cobalt, 0, h * .35, 0, g);
        D.box(1.9, h * .3, 1.9, pal.cobalt, 0, h * .7 + h * .15, 0, g);
        D.box(1.2, .9, 1.2, pal.mustard, 0, h + .45, 0, g);
        w = 3.0; d = 3.0;
      } else {
        D.box(w, h, d, pal.cobalt, 0, h / 2, 0, g);
        D.box(w + .3, .3, d + .3, pal.ink, 0, h + .15, 0, g);
        D.box(.8, 1.0, .8, pal.paper, .5, h + .8, -.4, g);
      }
      for (fl = 0; fl < Math.floor(h / 1.5) - 1; fl++) for (wx = -1; wx <= 1; wx += 1) {
        D.box(.42, .75, .05, pal.paper, wx * .8, 1.6 + fl * 1.5, d / 2 + .02, g, { shadow: false });
        D.box(.05, .75, .42, pal.paper, w / 2 + .02, 1.6 + fl * 1.5, wx * .8, g, { shadow: false });
      }
      g.name = kind === 'spire' ? 'spire tower' : kind === 'fin' ? 'fin tower' : 'tower'; hot.push(g); return g;
    }

    /* the road ring inside loop A, a scaled copy of the loop */
    var ringPts = [], RS = .56;
    for (tt = 0; tt < 40; tt += 2) ringPts.push([cA[0] + (loopA[tt][0] - cA[0]) * RS, cA[1] + (loopA[tt][1] - cA[1]) * RS]);
    var ring = D.path(ringPts, true, 3.2), ringSegs = [];
    for (tt = 0; tt < ringPts.length; tt++) {
      var r0 = ringPts[tt], r1 = ringPts[(tt + 1) % ringPts.length], rl = Math.sqrt(Math.pow(r1[0] - r0[0], 2) + Math.pow(r1[1] - r0[1], 2));
      var rg = D.group((r0[0] + r1[0]) / 2, 0, (r0[1] + r1[1]) / 2); rg.rotation.y = Math.atan2(-(r1[1] - r0[1]), r1[0] - r0[0]);
      D.box(rl + .5, .05, 1.8, pal.asphalt, 0, .03, 0, rg, { shadow: false });
    }
    var ringR = 0; for (tt = 0; tt < ringPts.length; tt++) ringR = Math.max(ringR, Math.sqrt(Math.pow(ringPts[tt][0] - cA[0], 2) + Math.pow(ringPts[tt][1] - cA[1], 2)));
    /* the park in the middle */
    var parkR = Math.max(2.4, ringR * .42);
    D.cyl(parkR, parkR, .08, pal.grass, cA[0], .04, cA[1], null, 28);
    D.props.tree(cA[0] + parkR * .35, cA[1] + parkR * .2, null, { r: .7, kind: 'round' });
    D.props.tree(cA[0] - parkR * .4, cA[1] - parkR * .25, null, { r: .6, kind: 'round' });
    D.props.bush(cA[0] - parkR * .1, cA[1] + parkR * .5, null, { r: .35 });
    D.cyl(.7, .7, .3, pal.paper, cA[0], .2, cA[1], null, 16); D.cyl(.5, .5, .1, pal.sky, cA[0], .38, cA[1], null, 16);
    function ringDist(x, z) { var m = 1e9, q; for (q = 0; q < ringPts.length; q++) m = Math.min(m, Math.hypot(ringPts[q][0] - x, ringPts[q][1] - z)); return m; }

    /* vehicles */
    function bus() {
      var g = D.group(0, 0, 0); D.box(2.8, 1.1, 1.3, pal.mustard, 0, .75, 0, g); D.box(2.6, .35, 1.34, pal.sky, 0, 1.05, 0, g, { shadow: false });
      D.box(2.6, .1, 1.2, pal.paper, 0, 1.34, 0, g);
      var w = [[-.9, .6], [.9, .6], [-.9, -.6], [.9, -.6]].map(function (q) { return D.wheel(.24, .2, pal.ink, q[0], .24, q[1], g); });
      g.name = 'bus'; hot.push(g); return { g: g, w: w };
    }
    function minicar(c) {
      var g = D.group(0, 0, 0); D.box(1.5, .5, .85, c, 0, .4, 0, g); D.box(.8, .38, .78, pal.paper, -.1, .8, 0, g);
      var w = [[-.5, .4], [.5, .4], [-.5, -.4], [.5, -.4]].map(function (q) { return D.wheel(.16, .14, pal.ink, q[0], .16, q[1], g); });
      g.name = 'car'; hot.push(g); return { g: g, w: w };
    }
    var vehicles = [bus(), minicar(pal.coral), minicar(pal.cobalt)];

    /* lots */
    var lotList = [], gx, gz, kinds = ['house', 'house', 'tower', 'house', 'tower', 'step'];
    var WALLS = [pal.paper, pal.mustard, pal.paper, pal.coral], ROOFS = [pal.coral, pal.mustard, pal.coral, pal.ink];
    var nT = 0, nH = 0, spireDone = false, finDone = false;
    for (gx = -34; gx <= 34; gx += 3.6) for (gz = -34; gz <= 34; gz += 3.6) {
      var jx = gx + (rnd() - .5) * 1.2, jz = gz + (rnd() - .5) * 1.2, q2 = uv(jx, jz);
      if (Math.abs(q2[0]) > A + 8 || Math.abs(q2[1]) > 17) continue;
      if (railDist(jx, jz) < 3.9) continue;
      if (Math.hypot(jx, jz) < 12) continue;
      if (inPoly(loopA, jx, jz)) continue;
      lotList.push([jx, jz, inPoly(loopB, jx, jz), q2[0], q2[1]]);
    }
    var bb = { x: 0, z: 0 }, bestB = -1;
    lotList.forEach(function (lt) { if (!lt[2] || lt[3] < 4) { var sc = lt[3] * 1 + Math.abs(lt[4]) * 1.1; if (lt[3] > 10 && sc > bestB) { bestB = sc; bb.x = lt[0]; bb.z = lt[1]; } } });
    lotList.forEach(function (lt, n) {
      if (Math.hypot(lt[0] - bb.x, lt[1] - bb.z) < 9.5) return;
      var x = lt[0], z = lt[1], inB = lt[2], r = rnd(), yaw = Math.floor(rnd() * 4) * Math.PI / 2;
      if (r < .14) return;
      if (r < .24) { D.props.tree(x, z, null, { r: .6 + rnd() * .2, kind: rnd() < .5 ? 'round' : 'tall', yaw: n }); return; }
      if (r < .3) { D.props.bush(x, z, null, { r: .35 }); return; }
      if (inB && r < .62 || (!inB && r < .5)) {
        var h = 3.5 + rnd() * 3, kind = 'plain'; if (railDist(x, z) < 5.6) { house(x, z, yaw, WALLS[n % 4], ROOFS[(n + 1) % 4], 1); return; }
        if (!spireDone && inB && lt[3] > 5) { kind = 'spire'; h = 9; spireDone = true; }
        else if (!finDone && !inB && Math.abs(lt[4]) > 9) { kind = 'fin'; h = 8; finDone = true; }
        else if (rnd() < .3) kind = 'step';
        tower(x, z, h, kind, 0); return;
      }
      var hs = house(x, z, yaw, WALLS[n % 4], ROOFS[(n + 1) % 4], .9 + rnd() * .3);
      if (rnd() < .4) D.props.tree(x + 1.7, z + 1.5, null, { r: .45, kind: 'pine' });
    });

    tower(cB[0] - 1.5, cB[1] + .5, 6, 'step', 0); house(cB[0] + 2.2, cB[1] - 1.8, 0.6, pal.paper, pal.coral, .9);
    D.props.tree(cB[0] + 1.4, cB[1] + 2.4, null, { r: .6, kind: 'round' });
    /* billboard: on a post beside the right-hand loop */
    var board = D.group(bb.x, 0, bb.z); board.rotation.y = 0; board.name = 'billboard'; hot.push(board);
    D.cyl(.18, .22, 5.2, pal.ink, -1.8, 2.6, 0, board, 8); D.cyl(.18, .22, 5.2, pal.ink, 1.8, 2.6, 0, board, 8);
    D.box(6.4, 3.3, .4, pal.coral, 0, 6.2, 0, board);
    D.box(5.8, 2.7, .1, pal.mustard, 0, 6.2, .24, board, { shadow: false });
    var msgA = D.group(0, 6.2, .32, board), msgB = D.group(0, 6.2, .32, board);
    var a1 = D.label('WITH A', 5.2, 1.0, { color: pal.ink, size: 58 }); a1.position.set(0, .55, 0); msgA.add(a1);
    var a2 = D.label('PULSE.', 5.2, 1.2, { color: pal.coral, size: 58 }); a2.position.set(0, -.6, 0); msgA.add(a2);
    var b1 = D.label('NOW', 5.2, 1.0, { color: pal.ink, size: 58 }); b1.position.set(0, .55, 0); msgB.add(b1);
    var b2 = D.label('BOARDING', 5.2, 1.2, { color: pal.cobalt, size: 58 }); b2.position.set(0, -.6, 0); msgB.add(b2);

    /* INTERFACES on the bridge: at the high crossing, laid along the deck */
    var bridge = D.group(0, 0, 0); at(3 * L / 4 + 1.8, pa); at(3 * L / 4 + 2.8, pb);
    var byaw = Math.atan2(-(pb.z - pa.z), pb.x - pa.x);
    var bTop = pa.y;
    bridge.position.set(pa.x, bTop + .05, pa.z); bridge.rotation.y = byaw;
    D.box(10.8, .3, 1.5, pal.ink, 0, -.1, 2.0, bridge, { shadow: false });
    D.box(10.8, 3.3, .24, pal.ink, 0, 1.75, 2.55, bridge);
    var layers = [], ly;
    for (ly = 0; ly < 3; ly++) {
      var lab = D.label('INTERFACES', 10.2, 2.6, { color: ly === 2 ? pal.paper : '#4a4d78', size: 78, weight: 900 });
      lab.position.set(0, 1.75, 2.7 + ly * .08); bridge.add(lab); layers.push(lab);
    }
    /* clouds */
    var clouds = [D.props.cloud(-24, 8, -14, null, { r: 1.6 }), D.props.cloud(10, 9, 16, null, { r: 1.3 }), D.props.cloud(24, 8.5, -6, null, { r: 1.1 })];

    /* ---------- the parts ---------- */
    var lift = hot.map(function () { return D.spring(120, 14); });
    return { hot: hot, lift: lift, orange: orange, yellow: yellow, at: at, pose: pose, L: L, GAP: GAP, CAR: CAR, ring: ring, vehicles: vehicles, clouds: clouds,
      board: board, msgA: msgA, msgB: msgB, msgSet: -1 };
  },
  tick: function (ctx) {
    var p = ctx.parts, t = ctx.t, L = p.L, speed = 3.2, d = t * speed, c, i, v, dist, RT = p.ring.length / 1.7;
    for (c = 0; c < p.orange.cars.length; c++) p.pose(p.orange.cars[c], d - c * p.GAP, p.CAR / 2 - .2);
    for (c = 0; c < p.yellow.cars.length; c++) p.pose(p.yellow.cars[c], d + L / 2 - c * p.GAP, p.CAR / 2 - .2);
    for (i = 0; i < p.vehicles.length; i++) {
      v = p.vehicles[i]; dist = ((t / RT) + i / 3) % 1 * p.ring.length;
      Diorama.place(v.g, p.ring, dist); Diorama.spin(v.w, dist, i ? .16 : .24);
    }
    for (i = 0; i < p.clouds.length; i++) { var cl = p.clouds[i]; cl.position.x = -30 + ((t * (.5 + i * .12) + i * 22) % 60); }
    var on = ctx.active === p.board ? 1 : 0;
    p.msgA.visible = !on; p.msgB.visible = !!on;
    for (i = 0; i < p.hot.length; i++) {
      var g = p.hot[i]; p.lift[i].t = (ctx.hover === g) ? .45 : 0; p.lift[i].step(ctx.dt); g.position.y = p.lift[i].x;
    }
    ctx.read = 'orange express · ' + Math.round(((d % L) + L) % L / L * 100) + '% round';
  }
});
