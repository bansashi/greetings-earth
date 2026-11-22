/* painted scenes: the header lagoon, the cafe by the sea, minnow's room */
(function (GE) {
  'use strict';
  GE.scenes = {};

  function ditherSky(ctx, W, H, stops, y0, y1) {
    const img = ctx.createImageData(W, H);
    const bands = 14;
    const cols = [];
    for (let b = 0; b <= bands; b++) cols.push(GE.hex2rgb(GE.ramp(stops, b / bands)));
    for (let y = 0; y < H; y++) {
      const t = GE.clamp((y - y0) / (y1 - y0), 0, 1) * bands;
      const lo = Math.floor(t), fr = t - lo;
      for (let x = 0; x < W; x++) {
        const c = cols[Math.min(bands, fr > GE.bayer(x, y) ? lo + 1 : lo)];
        const i = (y * W + x) * 4;
        img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
      }
    }
    return img;
  }
  GE.ditherSky = ditherSky;

  /* ---------- header lagoon ---------- */
  GE.scenes.header = function (cv) {
    const W = 320, H = 100;
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const sky = document.createElement('canvas'); sky.width = W; sky.height = H;
    const sctx = sky.getContext('2d');
    let skyKey = -1;
    const palms = [{ x: 46, h: 38, lean: -9 }, { x: 70, h: 28, lean: 6 }, { x: 262, h: 44, lean: 10 }, { x: 292, h: 31, lean: -5 }];
    const ridge = []; const ridge2 = [];
    for (let x = 0; x < W; x++) {
      ridge.push(52 - (Math.sin(x * 0.045) * 5 + Math.sin(x * 0.13 + 1) * 2.2 + Math.sin(x * 0.31) * 1.2));
      ridge2.push(61 - (Math.sin(x * 0.08 + 3) * 3 + Math.sin(x * 0.21) * 1.5));
    }
    let jumper = null, nextJump = 3000, blink = 0, nextBlink = 4000;
    const drops = [];
    for (let i = 0; i < 70; i++) drops.push({ x: Math.random() * W, y: Math.random() * H, s: GE.rand(1.4, 2.6) });
    const monos = [{ x: 120, w: 7 }, { x: 160, w: 10 }, { x: 205, w: 6 }];
    const water = document.createElement('canvas'); water.width = W; water.height = H;
    let waterKey = -1;

    function skyStops(d) {
      const top = GE.ramp([[0, '#79c9e2'], [0.4, '#6aa6b8'], [0.62, '#3b4a5a'], [0.8, '#12001a'], [1, '#000000']], d);
      const mid = GE.ramp([[0, '#bfe8e4'], [0.4, '#b3cfc2'], [0.62, '#7a6a6a'], [0.8, '#3a0010'], [1, '#110000']], d);
      const bot = GE.ramp([[0, '#ffe8c2'], [0.4, '#ecd3a2'], [0.62, '#c98a5a'], [0.8, '#aa0000'], [1, '#550000']], d);
      return [[0, top], [0.55, mid], [1, bot]];
    }

    function palm(p, landY, t, d) {
      const trunk = GE.mix('#7a5230', '#1a0d08', GE.smooth(0.5, 0.9, d));
      const ring = GE.mix('#5a3a1e', '#000000', GE.smooth(0.5, 0.9, d));
      const leafA = GE.ramp([[0, '#2f7d4f'], [0.55, '#2b4a35'], [0.8, '#140a0a'], [1, '#000000']], d);
      const leafB = GE.ramp([[0, '#62b86a'], [0.55, '#4a6a48'], [0.8, '#3a0a0a'], [1, '#550000']], d);
      let tx = p.x, ty = landY;
      for (let i = 0; i <= p.h; i++) {
        const k = i / p.h;
        tx = p.x + p.lean * k * k; ty = landY - i;
        ctx.fillStyle = i % 3 === 0 ? ring : trunk;
        ctx.fillRect(Math.round(tx), Math.round(ty), 2, 1);
      }
      const sway = Math.sin(t * 0.0011 + p.x) * 0.08;
      const droop = 0.9 + GE.smooth(0.3, 1, d) * 1.6;
      const fronds = [-2.9, -2.4, -1.9, -1.2, -0.7, -0.2];
      fronds.forEach((a0, fi) => {
        let x = tx + 1, y = ty, a = a0 + sway;
        const len = 13 + (fi % 2) * 3;
        for (let s = 0; s < len; s++) {
          x += Math.cos(a); y += Math.sin(a);
          a += (Math.cos(a) > 0 ? 1 : -1) * 0.012 * droop * s * 0.5;
          ctx.fillStyle = leafA; ctx.fillRect(Math.round(x), Math.round(y), 1, 2);
          if (s % 2 === 0 && s > 2) { ctx.fillStyle = leafB; ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 1); ctx.fillRect(Math.round(x), Math.round(y) + 2, 1, 1); }
        }
      });
      ctx.fillStyle = GE.mix('#8a5a2a', '#550000', d); ctx.fillRect(Math.round(tx), Math.round(ty) + 1, 2, 2);
    }

    function tick(t, dt) {
      const d = GE.dd();
      const key = Math.round(d * 60);
      if (key !== skyKey) { skyKey = key; sctx.putImageData(ditherSky(sctx, W, H, skyStops(d), 0, 64), 0, 0); }
      ctx.drawImage(sky, 0, 0);

      // stars / eyes
      if (d > 0.55) {
        const n = Math.floor((d - 0.55) * 60);
        for (let i = 0; i < n; i++) {
          const sx = (i * 73.3) % W, sy = (i * 31.7) % 40;
          const on = Math.sin(t * 0.002 + i) > -0.6;
          if (d > 0.85 && i % 3 === 0) {
            ctx.fillStyle = on ? '#ffffff' : '#550000'; ctx.fillRect(sx - 1, sy, 3, 1);
            ctx.fillStyle = '#ff5555'; ctx.fillRect(sx, sy, 1, 1);
          } else if (on) { ctx.fillStyle = GE.mix('#fff6d0', '#ffff55', d); ctx.fillRect(sx, sy, 1, 1); }
        }
      }

      // sun becomes an eye
      const sunX = 238, sunY = 26;
      if (d < 0.5) {
        GE.disc(ctx, sunX, sunY, 14, 14, GE.mix('#fff1c4', '#f0b880', d * 2));
        GE.disc(ctx, sunX, sunY, 11, 11, GE.mix('#fffbe6', '#ffd89a', d * 2));
      } else {
        const open = GE.smooth(0.5, 0.6, d);
        nextBlink -= dt; if (nextBlink < 0) { blink = 160; nextBlink = GE.rand(2500, 7000); }
        blink = Math.max(0, blink - dt);
        const ry = Math.max(1, Math.round(8 * open * (blink > 0 ? 0.15 : 1)));
        GE.disc(ctx, sunX, sunY, 16, ry + 1, '#000000');
        GE.disc(ctx, sunX, sunY, 15, ry, GE.mix('#fff6d0', '#f4f0e0', open));
        if (ry > 3) {
          const ix = sunX + Math.round((GE.mouse.nx - 0.5) * 14), iy = sunY + Math.round((GE.mouse.ny - 0.3) * 3);
          GE.disc(ctx, ix, iy, 5, Math.min(5, ry - 1), GE.mix('#d88a3a', '#aa0000', open));
          GE.disc(ctx, ix, iy, 2, Math.min(2, ry - 2), '#000000');
          ctx.fillStyle = '#ffffff'; ctx.fillRect(ix - 2, iy - 2, 1, 1);
        }
      }

      // ridges
      const r1 = GE.ramp([[0, '#5aa58a'], [0.5, '#4a7466'], [0.75, '#1c1416'], [1, '#0a0000']], d);
      const r2 = GE.ramp([[0, '#3f8f6f'], [0.5, '#33584a'], [0.75, '#120a0a'], [1, '#000000']], d);
      for (let x = 0; x < W; x++) {
        ctx.fillStyle = r1; ctx.fillRect(x, Math.round(ridge[x]), 1, 72 - Math.round(ridge[x]));
      }
      for (let x = 0; x < W; x++) {
        ctx.fillStyle = r2; ctx.fillRect(x, Math.round(ridge2[x]), 1, 72 - Math.round(ridge2[x]));
      }

      // cliff + waterfall
      const rock = GE.ramp([[0, '#4f6b5f'], [0.6, '#333a36'], [0.8, '#140a0a'], [1, '#000']], d);
      ctx.fillStyle = rock; ctx.fillRect(0, 24, 30, 50);
      ctx.fillStyle = GE.mix(rock, '#000', 0.25); for (let y = 26; y < 72; y += 5) ctx.fillRect(2 + (y % 3), y, 4, 1), ctx.fillRect(22, y + 2, 5, 1);
      const flow = d > 0.6 ? -0.03 : 0.045;
      const fallA = GE.ramp([[0, '#e9fbff'], [0.6, '#b8c8c8'], [0.8, '#ff5555'], [1, '#aa0000']], d);
      const fallB = GE.ramp([[0, '#9fdcef'], [0.6, '#7a9090'], [0.8, '#aa0000'], [1, '#550000']], d);
      for (let y = 26; y < 73; y++) {
        for (let x = 11; x < 20; x++) {
          const v = ((y + t * flow + x * 2.3) % 7 + 7) % 7;
          ctx.fillStyle = v < 2.5 ? fallA : fallB; ctx.fillRect(x, y, 1, 1);
        }
      }

      // land strip + palms
      const land = GE.ramp([[0, '#2e6b45'], [0.6, '#29402f'], [0.8, '#0a0505'], [1, '#000']], d);
      ctx.fillStyle = land; ctx.fillRect(30, 66, W - 30, 8);
      for (let x = 34; x < W; x += 9) GE.disc(ctx, x + (x % 5), 66, 4, 2, land);
      palms.forEach((p) => palm(p, 70, t, d));

      // water rises
      const wl = Math.round(72 - GE.smooth(0.25, 1, d) * 46);
      const wA = GE.ramp([[0, '#56b9c9'], [0.5, '#3f7f86'], [0.75, '#123034'], [0.85, '#0000aa'], [1, '#00002a']], d);
      const wB = GE.ramp([[0, '#2f8fa6'], [0.5, '#2a5a60'], [0.75, '#0a1a1c'], [0.85, '#000055'], [1, '#000000']], d);
      if (waterKey !== key) {
        waterKey = key;
        const wc = water.getContext('2d');
        wc.clearRect(0, 0, W, H);
        const A = GE.hex2rgb(wA), B = GE.hex2rgb(wB);
        const img = wc.createImageData(W, H);
        for (let y = wl; y < H; y++) {
          const k = (y - wl) / (H - wl);
          for (let x = 0; x < W; x++) {
            const c = k > GE.bayer(x, y) * 0.9 + 0.05 ? B : A, i = (y * W + x) * 4;
            img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
          }
        }
        wc.putImageData(img, 0, 0);
      }
      ctx.drawImage(water, 0, 0);
      const shim = GE.ramp([[0, '#e9fbff'], [0.6, '#a9c0c0'], [0.85, '#55ffff'], [1, '#ff5555']], d);
      ctx.fillStyle = shim;
      for (let i = 0; i < 46; i++) {
        const y = wl + 2 + ((i * 7) % Math.max(1, H - wl - 2));
        const x = ((i * 53 + t * 0.006 * (1 + (i % 3))) % (W + 20)) - 10;
        ctx.fillRect(Math.round(x), y, 3 + (i % 4), 1);
      }
      // monoliths rise out of the water
      if (d > 0.7) {
        const rise = GE.smooth(0.7, 1, d) * 30;
        monos.forEach((m, i) => {
          const top = Math.round(wl - rise * (0.7 + i * 0.15));
          ctx.fillStyle = '#000000'; ctx.fillRect(m.x, top, m.w, H - top);
          ctx.fillStyle = '#aa0000'; ctx.fillRect(m.x + Math.floor(m.w / 2), top + 4, 1, 2);
        });
      }
      // sun reflection
      ctx.fillStyle = d < 0.5 ? '#fff4d0' : '#ff5555';
      for (let y = wl + 1; y < H; y += 3) {
        const w = 10 - (y - wl) * 0.15 + Math.sin(t * 0.004 + y) * 2;
        if (w > 1) ctx.fillRect(Math.round(sunX - w / 2 + Math.sin(t * 0.003 + y) * 2), y, Math.round(w), 1);
      }

      // a fish jumps (until it doesn't)
      nextJump -= dt;
      if (!jumper && nextJump < 0) { jumper = { x: GE.rand(60, 300), t: 0, dir: GE.chance(0.5) ? 1 : -1 }; nextJump = GE.rand(3500, 9000); }
      if (jumper) {
        jumper.t += dt / 1100;
        const k = jumper.t;
        if (k >= 1) jumper = null;
        else {
          const jx = jumper.x + jumper.dir * k * 18, jy = wl - Math.sin(k * Math.PI) * 14;
          if (d < 0.6) {
            ctx.fillStyle = '#f4a259'; ctx.fillRect(Math.round(jx), Math.round(jy), 4, 2);
            ctx.fillStyle = '#b9522e'; ctx.fillRect(Math.round(jx) + (jumper.dir > 0 ? -1 : 4), Math.round(jy), 1, 2);
          } else {
            ctx.fillStyle = '#000'; ctx.fillRect(Math.round(jx), Math.round(jy), 3, 5);
            ctx.fillRect(Math.round(jx) - 1, Math.round(jy) - 1, 1, 2); ctx.fillRect(Math.round(jx) + 3, Math.round(jy) - 1, 1, 2);
          }
          if (k > 0.9 || k < 0.1) { ctx.fillStyle = shim; ctx.fillRect(Math.round(jx) - 2, wl - 1, 7, 1); }
        }
      }

      // rain (later, upward)
      if (d > 0.38) {
        const amt = Math.floor(GE.smooth(0.38, 0.8, d) * drops.length);
        const up = d > 0.82;
        ctx.fillStyle = GE.ramp([[0.38, '#cfe0e8'], [0.8, '#ff5555'], [1, '#ffff55']], d);
        for (let i = 0; i < amt; i++) {
          const r = drops[i];
          r.y += (up ? -1 : 1) * r.s * dt * 0.06;
          r.x -= 0.3 * dt * 0.06;
          if (r.y > H) r.y = -3; if (r.y < -3) r.y = H; if (r.x < 0) r.x = W;
          ctx.fillRect(Math.round(r.x), Math.round(r.y), 1, 2);
        }
      }
    }
    GE.addTicker(cv, tick, false);
  };

  /* ---------- cafe by the sea (post 3) ---------- */
  GE.scenes.cafe = function (host) {
    const W = 200, H = 90;
    const cv = GE.canvas(W, H, 'scene-cv'); host.appendChild(cv);
    const ctx = cv.getContext('2d');
    const sky = GE.canvas(W, H); let skyKey = -1;
    const seaCv = GE.canvas(W, H); let seaKey = -1;
    const ruins = [{ x: 18, w: 14, h: 22 }, { x: 38, w: 9, h: 30 }, { x: 52, w: 16, h: 16 }, { x: 96, w: 11, h: 26 }];
    function tick(t) {
      const d = GE.dd();
      const key = Math.round(d * 30);
      if (key !== skyKey) {
        skyKey = key;
        const s = [[0, GE.mix('#b6a6d9', '#1a0010', GE.smooth(0.5, 1, d))], [0.6, GE.mix('#f4b8a8', '#550000', GE.smooth(0.5, 1, d))], [1, GE.mix('#ffe2b0', '#aa0000', GE.smooth(0.5, 1, d))]];
        sky.getContext('2d').putImageData(ditherSky(ctx, W, H, s, 0, 54), 0, 0);
      }
      ctx.drawImage(sky, 0, 0);
      const sea = 54 - Math.round(GE.smooth(0.3, 1, d) * 18);
      // sunken buildings
      const far = GE.mix('#8f86b0', '#1a0a0a', d);
      ruins.forEach((r) => { ctx.fillStyle = far; ctx.fillRect(r.x, 58 - r.h, r.w, r.h); for (let y = 58 - r.h + 3; y < 56; y += 4) { ctx.fillStyle = GE.mix('#b7aed0', d > 0.6 ? '#aa0000' : '#3a2a2a', d); ctx.fillRect(r.x + 2, y, 2, 2); ctx.fillRect(r.x + r.w - 4, y, 2, 2); } });
      // hill + cafe
      const hill = GE.mix('#6a9a5a', '#1a1410', GE.smooth(0.4, 1, d));
      GE.disc(ctx, 160, 64, 48, 16, hill);
      ctx.fillStyle = GE.mix('#efe3c8', '#3a3030', GE.smooth(0.5, 1, d)); ctx.fillRect(146, 36, 26, 16);
      ctx.fillStyle = GE.mix('#a84a3a', '#2a0000', d);
      for (let i = 0; i < 6; i++) ctx.fillRect(143 + i, 36 - i, 32 - i * 2, 1);
      const lit = d > 0.6 ? '#ff2a2a' : '#ffd36a';
      ctx.fillStyle = lit; ctx.fillRect(150, 41, 6, 5); ctx.fillRect(160, 41, 6, 5);
      ctx.fillStyle = GE.mix('#5a3a2a', '#000', d); ctx.fillRect(167, 43, 3, 9);
      ctx.fillStyle = GE.mix('#3a5a7a', '#000', d); ctx.fillRect(175, 39, 17, 7);
      GE.pixText(ctx, 'CAFE', 177, 41, 1, d > 0.6 ? '#ff5555' : '#f4efe2');
      // poles and wires
      const pole = GE.mix('#4a3a3a', '#000', d);
      [74, 112, 130].forEach((x, i) => { ctx.fillStyle = pole; ctx.fillRect(x, 30 + i * 3, 2, 40); ctx.fillRect(x - 3, 32 + i * 3, 8, 1); });
      ctx.fillStyle = pole;
      for (let x = 76; x < 112; x++) ctx.fillRect(x, 32 + Math.round(Math.sin((x - 76) / 36 * Math.PI) * 4), 1, 1);
      for (let x = 114; x < 130; x++) ctx.fillRect(x, 36 + Math.round(Math.sin((x - 114) / 16 * Math.PI) * 2), 1, 1);
      // streetlight in the water
      ctx.fillStyle = pole; ctx.fillRect(88, 40, 1, 30); ctx.fillRect(88, 40, 5, 1);
      const glow = Math.sin(t * 0.003) > -0.2 ? (d > 0.6 ? '#ff5555' : '#fff2a8') : (d > 0.6 ? '#aa0000' : '#f5d77a');
      ctx.fillStyle = glow; ctx.fillRect(92, 41, 2, 2);
      // sea
      const sA = GE.ramp([[0, '#6fb8d0'], [0.5, '#4a7a8a'], [0.8, '#0a1a2a'], [1, '#000022']], d);
      const sB = GE.ramp([[0, '#4a8fb0'], [0.5, '#2a5060'], [0.8, '#000a14'], [1, '#000']], d);
      if (seaKey !== key) {
        seaKey = key;
        const sc = seaCv.getContext('2d'); sc.clearRect(0, 0, W, H);
        const A = GE.hex2rgb(sA), B = GE.hex2rgb(sB), img = sc.createImageData(W, H);
        for (let y = sea; y < H; y++) for (let x = 0; x < W; x++) { const c = ((y - sea) / (H - sea)) > GE.bayer(x, y) ? B : A, i = (y * W + x) * 4; img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255; }
        sc.putImageData(img, 0, 0);
      }
      ctx.drawImage(seaCv, 0, 0);
      ctx.fillStyle = d > 0.6 ? '#ff5555' : '#fff2a8';
      for (let y = sea + 2; y < H; y += 3) ctx.fillRect(91 + Math.round(Math.sin(t * 0.004 + y) * 2), y, 3, 1);
      ctx.fillStyle = GE.mix('#e6f6ff', '#55ffff', d);
      for (let i = 0; i < 26; i++) { const y = sea + 1 + (i * 5) % (H - sea - 1); const x = (i * 41 + t * 0.005 * (1 + i % 2)) % (W + 10) - 5; ctx.fillRect(Math.round(x), y, 3, 1); }
      // a scooter-sized figure on the road, gone later
      if (d < 0.5) { ctx.fillStyle = '#3a3a4a'; ctx.fillRect(132, 49, 2, 4); ctx.fillStyle = '#2a7f9e'; ctx.fillRect(131, 50, 4, 2); }
    }
    GE.addTicker(cv, tick);
  };

  /* ---------- minnow's room (post 18) ---------- */
  GE.scenes.room = function (host) {
    const W = 200, H = 110;
    const cv = GE.canvas(W, H, 'scene-cv'); host.appendChild(cv);
    const ctx = cv.getContext('2d');
    const rain = []; for (let i = 0; i < 24; i++) rain.push({ x: Math.random() * 40, y: Math.random() * 34 });
    function tick(t, dt) {
      const d = GE.dd();
      // wall + floor
      const wall = GE.mix('#8a8470', '#2a2620', GE.smooth(0.6, 1, d));
      ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = GE.mix(wall, '#000', 0.12);
      for (let x = 0; x < W; x += 12) ctx.fillRect(x, 0, 1, 86);
      ctx.fillStyle = GE.mix('#5a4030', '#1a1008', d); ctx.fillRect(0, 86, W, 24);
      ctx.fillStyle = GE.mix('#4a3020', '#000', d); for (let y = 90; y < H; y += 5) ctx.fillRect(0, y, W, 1);
      // window
      ctx.fillStyle = '#2a2a30'; ctx.fillRect(18, 10, 44, 38);
      ctx.fillStyle = GE.mix('#141a3a', '#000', d); ctx.fillRect(20, 12, 40, 34);
      GE.disc(ctx, 50, 20, 4, 4, d > 0.7 ? '#ff5555' : '#e9e6c8');
      ctx.fillStyle = '#9ab0c0';
      rain.forEach((r) => { r.y += dt * 0.05; if (r.y > 34) r.y = 0; ctx.fillRect(20 + Math.round(r.x), 12 + Math.round(r.y), 1, 2); });
      ctx.fillStyle = '#2a2a30'; ctx.fillRect(39, 12, 2, 34); ctx.fillRect(20, 28, 40, 2);
      // poster: a wave
      ctx.fillStyle = '#e8e2cc'; ctx.fillRect(78, 14, 22, 28);
      for (let x = 0; x < 18; x++) { const y0 = 28 + Math.round(Math.sin(x * 0.5) * 3); ctx.fillStyle = d > 0.75 ? '#aa0000' : '#3a7fa0'; ctx.fillRect(80 + x, y0, 1, 40 - y0); }
      // bed
      ctx.fillStyle = GE.mix('#6a5a8a', '#2a1a2a', d); ctx.fillRect(126, 66, 70, 20);
      ctx.fillStyle = GE.mix('#d8d0e8', '#4a4040', d); ctx.fillRect(128, 62, 16, 8);
      ctx.fillStyle = GE.mix('#8a7aaa', '#3a2a3a', d); ctx.fillRect(146, 64, 48, 6);
      ctx.fillStyle = '#3a2a20'; ctx.fillRect(124, 58, 4, 30); ctx.fillRect(194, 66, 4, 22);
      // desk + crt + stereo + tank
      ctx.fillStyle = '#4a3424'; ctx.fillRect(8, 70, 90, 4); ctx.fillRect(10, 74, 4, 14); ctx.fillRect(92, 74, 4, 14);
      ctx.fillStyle = '#cfc8b4'; ctx.fillRect(14, 50, 26, 20);
      ctx.fillStyle = d > 0.8 ? '#000000' : '#1a4a5a'; ctx.fillRect(17, 53, 20, 13);
      if (d > 0.8) { for (let y = 54; y < 65; y += 2) { ctx.fillStyle = GE.pick(['#ffff55', '#ff5555', '#55ffff']); ctx.fillRect(18, y, GE.randi(4, 18), 1); } }
      else { ctx.fillStyle = '#7fe0e8'; ctx.fillRect(19, 55, 8, 1); ctx.fillRect(19, 58, 12, 1); }
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(44, 62, 22, 8);
      ctx.fillStyle = (Math.floor(t / 700) % 2) ? '#ff3030' : '#601010'; ctx.fillRect(62, 64, 2, 1);
      ctx.fillStyle = '#8a8a8a'; ctx.fillRect(46, 64, 12, 1);
      // unplugged cord on the floor
      ctx.fillStyle = '#1a1a1a'; for (let x = 54; x < 80; x++) ctx.fillRect(x, 88 + Math.round(Math.sin(x * 0.4)), 1, 1); ctx.fillRect(80, 87, 3, 2);
      // tank with bloop, facing the window
      ctx.fillStyle = '#9fd0d8'; ctx.fillRect(70, 56, 24, 14);
      ctx.fillStyle = GE.mix('#5fa8b8', '#0a2a3a', d); ctx.fillRect(71, 58, 22, 11);
      ctx.fillStyle = d > 0.85 ? '#f4f0f0' : '#f7b6c8'; ctx.fillRect(74 + (d > 0.85 ? 0 : 0), 62, 6 + Math.round(d * 10), 4);
      ctx.fillStyle = '#000'; ctx.fillRect(74, 63, 1, 1);
      // the line on the wall
      const line = Math.round(84 - GE.smooth(0.5, 1, d) * 66);
      if (d > 0.82) {
        ctx.fillStyle = 'rgba(0,0,170,0.55)'; ctx.fillRect(0, line, W, H - line);
        ctx.fillStyle = '#55ffff';
        for (let y = line + 4; y < H; y += 9) for (let x = 0; x < W; x += 20) ctx.fillRect(Math.round((x + t * 0.02 + y * 3) % W), y, 6, 1);
      }
      ctx.fillStyle = d > 0.82 ? '#55ffff' : '#2f6fd0';
      for (let x = 0; x < W; x++) ctx.fillRect(x, line + Math.round(Math.sin(x * 0.3 + t * 0.002) * 0.6), 1, 2);
      GE.pixText(ctx, 'HERE', 160, line - 7, 1, d > 0.82 ? '#ffff55' : '#2f6fd0');
    }
    GE.addTicker(cv, tick);
  };
})(window.GE);
