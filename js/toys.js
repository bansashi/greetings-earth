/* the web toys */
(function (GE) {
  'use strict';
  const T = GE.toys = {};

  function cap(host, html) { const c = GE.el('div', 'cap', html); host.appendChild(c); return c; }
  function toCanvas(cv, e) {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * cv.width, (e.clientY - r.top) / r.height * cv.height];
  }

  /* ================= aquarium ================= */
  T.aquarium = function (host, opts) {
    const W = 192, H = 104;
    const cv = GE.canvas(W, H); host.appendChild(cv);
    const ctx = cv.getContext('2d');
    const letters = opts.mode === 'letters';
    const caption = cap(host, letters ? 'they are spelling something. click to scatter them.' : 'click the water to drop food ✿ <span class="muted">(Professor Gill is the orange one)</span>');
    const bg = GE.canvas(W, H); let bgKey = -1;
    const plants = [];
    for (let i = 0; i < 9; i++) plants.push({ x: 8 + i * 21 + GE.randi(-4, 4), h: GE.randi(14, 34), ph: Math.random() * 6, c: GE.pick(['#2f7d4f', '#3f9a5c', '#5fb06a']) });
    const fish = [];
    const add = (kind, x, y) => fish.push({ kind, x, y, vx: GE.rand(-0.4, 0.4), vy: 0, tx: GE.rand(20, W - 20), ty: GE.rand(15, H - 30), wait: 0, target: null });
    if (!letters) {
      add('gill', 70, 40);
      for (let i = 0; i < 6; i++) add('tetra', GE.rand(20, 170), GE.rand(20, 70));
    } else {
      for (let i = 0; i < 110; i++) add('mini', GE.rand(10, W - 10), GE.rand(10, H - 25));
    }
    const food = [], bubbles = [];
    let phraseT = 0, phraseIdx = 0, scatter = 0;
    const phrases = () => {
      const n = (GE.getName() || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 9).trim();
      return [n || 'HELLO', 'LOOK UP', 'STILL HERE', 'KEEP GOING', 'BELOW'];
    };
    function assignLetters(str) {
      const s = 3, gap = 4 * s;
      const width = str.length * gap - s;
      const ox = Math.round((W - width) / 2), oy = 30;
      const tgts = [];
      for (let ci = 0; ci < str.length; ci++) {
        const g = GE.glyph(str[ci]);
        for (let i = 0; i < 15; i++) if (g[i] === '1') tgts.push([ox + ci * gap + (i % 3) * s + 1, oy + Math.floor(i / 3) * s + 1]);
      }
      fish.forEach((f, i) => { f.target = tgts[i] || null; });
    }
    if (letters) assignLetters(phrases()[0]);

    cv.addEventListener('pointerdown', (e) => {
      const [x, y] = toCanvas(cv, e);
      if (letters) { scatter = 1600; fish.forEach((f) => { f.vx = GE.rand(-2, 2); f.vy = GE.rand(-2, 2); }); return; }
      const up = GE.dd() > 0.55;
      for (let i = 0; i < 3; i++) food.push({ x: x + GE.rand(-4, 4), y: up ? Math.min(H - 14, y) : Math.max(2, y), vy: (up ? -1 : 1) * GE.rand(0.1, 0.2) });
    });

    function buildBg(d) {
      const b = bg.getContext('2d');
      const top = GE.ramp([[0, '#86d6dc'], [0.4, '#5fa8a8'], [0.6, '#2a4a4a'], [0.8, '#00002a'], [1, '#000000']], d);
      const bot = GE.ramp([[0, '#2f7f99'], [0.4, '#2a5a66'], [0.6, '#0a1a1c'], [0.8, '#000000'], [1, '#000000']], d);
      b.putImageData(GE.ditherSky(b, W, H, [[0, top], [1, bot]], 0, H - 12), 0, 0);
      if (d < 0.55) {
        b.fillStyle = 'rgba(255,255,255,0.07)';
        for (let i = 0; i < 4; i++) { b.beginPath(); b.moveTo(30 + i * 45, 0); b.lineTo(48 + i * 45, 0); b.lineTo(20 + i * 45, H); b.lineTo(8 + i * 45, H); b.fill(); }
      }
      const sand = GE.ramp([[0, '#ecd9a8'], [0.5, '#b8ab8a'], [0.75, '#3a3530'], [1, '#110000']], d);
      b.fillStyle = sand; b.fillRect(0, H - 11, W, 11);
      for (let x = 0; x < W; x += 2) if (GE.bayer(x, 0) > 0.5) { b.fillStyle = GE.mix(sand, '#000', 0.15); b.fillRect(x, H - 11 + (x * 7) % 9, 2, 1); }
      // sunken cartridge, a little castle of a thing
      b.save(); GE.drawSprite(b, 'cart', 140, H - 19, { corrupt: GE.smooth(0.5, 0.9, d) }); b.restore();
      GE.drawSprite(b, 'shell', 30, H - 9, { corrupt: GE.smooth(0.5, 0.9, d) });
    }

    function tick(t, dt) {
      const d = GE.dd();
      const key = Math.round(d * 40);
      if (key !== bgKey) { bgKey = key; buildBg(d); }
      ctx.drawImage(bg, 0, 0);
      const k = dt / 16;
      // plants
      plants.forEach((p) => {
        const col = GE.ramp([[0, p.c], [0.6, '#1f3328'], [0.85, '#aa0000']], d);
        for (let i = 0; i < p.h; i++) {
          const sway = Math.sin(t * 0.0015 + p.ph + i * 0.18) * (i / p.h) * 3;
          ctx.fillStyle = col; ctx.fillRect(Math.round(p.x + sway), H - 11 - i, 2, 1);
          if (i % 5 === 3) ctx.fillRect(Math.round(p.x + sway) + (i % 2 ? 2 : -2), H - 11 - i, 2, 1);
        }
      });
      // bubbles
      if (Math.random() < 0.05 * k) bubbles.push({ x: 160 + GE.rand(-2, 2), y: H - 14, down: d > 0.4 && GE.chance(0.4) });
      ctx.fillStyle = d > 0.8 ? '#ff5555' : 'rgba(235,252,255,0.85)';
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y += (b.down ? 0.25 : -0.35) * k; b.x += Math.sin(t * 0.005 + i) * 0.15;
        if (b.y < 0 || b.y > H - 10) { bubbles.splice(i, 1); continue; }
        ctx.fillRect(Math.round(b.x), Math.round(b.y), 1, 1);
      }
      // food
      ctx.fillStyle = d > 0.6 ? '#ff5555' : '#c9962a';
      for (let i = food.length - 1; i >= 0; i--) {
        const f = food[i];
        f.y += f.vy * k;
        if (f.y > H - 12) f.y = H - 12;
        if (f.y < 1) { food.splice(i, 1); continue; }
        ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2);
      }
      // letters
      if (letters) {
        phraseT += dt; scatter = Math.max(0, scatter - dt);
        if (phraseT > 7000) { phraseT = 0; phraseIdx = (phraseIdx + 1) % phrases().length; assignLetters(phrases()[phraseIdx]); }
      }
      // fish
      fish.forEach((f) => {
        let tx = f.tx, ty = f.ty, speed = f.kind === 'mini' ? 0.9 : 0.35;
        if (f.target && !scatter) { tx = f.target[0]; ty = f.target[1]; speed = 1.1; }
        else if (food.length && f.kind !== 'mini') {
          let best = null, bd = 1e9;
          food.forEach((p) => { const dd = (p.x - f.x) ** 2 + (p.y - f.y) ** 2; if (dd < bd) { bd = dd; best = p; } });
          tx = best.x; ty = best.y; speed = 0.7;
          if (bd < 30) { food.splice(food.indexOf(best), 1); }
        } else {
          f.wait -= dt;
          if (f.wait < 0 || Math.hypot(tx - f.x, ty - f.y) < 4) { f.tx = GE.rand(16, W - 16); f.ty = GE.rand(12, H - 28); f.wait = GE.rand(2000, 6000); }
        }
        const dx = tx - f.x, dy = ty - f.y, dist = Math.hypot(dx, dy) || 1;
        const ax = dx / dist * speed * 0.05, ay = dy / dist * speed * 0.05;
        f.vx = (f.vx + ax * k) * 0.97; f.vy = (f.vy + ay * k) * 0.95;
        const sp = Math.hypot(f.vx, f.vy); if (sp > speed) { f.vx *= speed / sp; f.vy *= speed / sp; }
        if (f.target && !scatter) {
          f.x += (tx - f.x) * 0.07 * k + GE.rand(-0.15, 0.15); f.y += (ty - f.y) * 0.07 * k + GE.rand(-0.1, 0.1);
          f.vx = (tx - f.x) || f.vx;
        } else { f.x += f.vx * k; f.y += f.vy * k; }
        f.x = GE.clamp(f.x, 2, W - 2); f.y = GE.clamp(f.y, 2, H - 14);
        const facingLeft = f.vx < 0;
        if (f.kind === 'gill') {
          const backwards = d > 0.2;
          GE.drawSprite(ctx, 'gill', f.x - 8, f.y - 4 + Math.sin(t * 0.004) * 0.6, { flip: backwards ? !facingLeft : facingLeft, corrupt: GE.smooth(0.55, 0.95, d), pal: d > 0.6 ? { w: '#000000', k: '#ff0000' } : null });
        } else if (f.kind === 'tetra') {
          GE.drawSprite(ctx, 'tetra', f.x - 4, f.y - 2, { flip: facingLeft, corrupt: GE.smooth(0.55, 0.95, d), pal: d > 0.6 ? { k: '#ff0000' } : null });
        } else {
          ctx.fillStyle = d > 0.85 ? '#ff5555' : '#7fd3ff'; ctx.fillRect(Math.round(f.x) - 1, Math.round(f.y), 3, 2);
          ctx.fillStyle = '#ff0000'; ctx.fillRect(Math.round(f.x) + (facingLeft ? -1 : 1), Math.round(f.y), 1, 1);
        }
      });
      if (!letters && d > 0.62 && Math.random() < 0.002 * k) caption.innerHTML = GE.pick(['they all face the same way now.', 'click the water to drop food', 'he is not hungry. he is listening.', 'click the water to drop food ✿']);
    }
    GE.addTicker(cv, tick);
  };

  /* ================= ambient mixer ================= */
  T.mixer = function (host) {
    const CH = [['rain', 'rain on the gutter'], ['creek', 'creek, close up'], ['birds', 'morning birds'], ['chimes', 'pentatonic chimes'], ['tidepool', 'tidepool (for sleep)']];
    const box = GE.el('div', 'mixer');
    const vu = GE.canvas(64, 16, 'vu');
    box.appendChild(vu);
    const rows = {};
    CH.forEach(([k, label]) => {
      const row = GE.el('label', 'mix-row');
      row.innerHTML = `<span class="mix-name">${label}</span><input type="range" min="0" max="100" value="${Math.round(GE.audio.levels[k] * 100)}" data-ch="${k}" aria-label="${label} volume"><span class="mix-val">${Math.round(GE.audio.levels[k] * 100)}</span>`;
      const inp = row.querySelector('input');
      inp.addEventListener('input', () => GE.audio.set(k, inp.value / 100, true));
      if (k === 'tidepool') row.classList.add('ch-tidepool');
      rows[k] = row;
      box.appendChild(row);
    });
    const bar = GE.el('div', 'mix-btns');
    const hush = GE.el('button', 'btn', 'hush');
    hush.addEventListener('click', () => GE.audio.hush());
    bar.appendChild(hush);
    box.appendChild(bar);
    host.appendChild(box);
    const c = cap(host, 'sound is made live in your browser. start low.');
    document.addEventListener('ge-audio', (e) => {
      const r = rows[e.detail.name]; if (!r) return;
      r.querySelector('input').value = Math.round(e.detail.v * 100);
      r.querySelector('.mix-val').textContent = Math.round(e.detail.v * 100);
    });
    const vctx = vu.getContext('2d');
    const data = new Uint8Array(32);
    let lastD = -1;
    GE.addTicker(vu, () => {
      const d = GE.dd();
      rows.tidepool.style.display = d > 0.22 ? '' : 'none';
      if (Math.round(d * 10) !== lastD) {
        lastD = Math.round(d * 10);
        hush.textContent = d > 0.8 ? 'hush (it will not help)' : d > 0.5 ? 'hush.' : 'hush';
        c.textContent = d > 0.7 ? 'nothing can ever sound wrong. nothing can ever sound wrong.' : d > 0.4 ? 'sound is made live in your browser. some of it.' : 'sound is made live in your browser. start low.';
        rows.chimes.querySelector('.mix-name').textContent = d > 0.55 ? 'chimes (detuned?)' : 'pentatonic chimes';
        rows.birds.querySelector('.mix-name').textContent = d > 0.6 ? 'birds (?)' : 'morning birds';
      }
      vctx.fillStyle = d > 0.8 ? '#000' : '#10302e'; vctx.fillRect(0, 0, 64, 16);
      if (GE.audio.analyser) GE.audio.analyser.getByteFrequencyData(data);
      for (let i = 0; i < 16; i++) {
        const v = GE.audio.analyser ? data[i + 1] / 255 : 0;
        const h = Math.round(v * 14);
        for (let y = 0; y < h; y++) { vctx.fillStyle = y > 10 ? '#ff5555' : y > 6 ? '#ffd36a' : (d > 0.8 ? '#55ffff' : '#7fe0b0'); vctx.fillRect(i * 4, 15 - y, 3, 1); }
      }
    });
  };

  /* ================= bloop the axolotl ================= */
  GE.pet = GE.pet || { hunger: 30, joy: 70, said: 'blub!' };
  const PET_LINES = [
    ['blub!', '♪ blub blub ♪', '(happy wiggle)', 'thank u', '*blinks slowly*', '(smiles. he always smiles.)'],
    ['blub.', 'the water is cold', 'did you hear that?', 'blub blub', '(looks past you)'],
    ["i'm not hungry", 'the window', "she's listening to it again", 'blub', '(faces the window)'],
    ['why do you keep scrolling', "it's warmer below", '{name}', 'i can see you', 'she is in the walls now'],
    ['FEED IT', 'LARGER', 'THE TIDE FEEDS ME', "don't look at the cd player", 'I REGREW SOMETHING I NEVER HAD', '{NAME}']
  ];
  const petStage = (d) => d < 0.2 ? 0 : d < 0.4 ? 1 : d < 0.6 ? 2 : d < 0.8 ? 3 : 4;
  T.pet = function (host, opts) {
    const huge = opts.mode === 'huge';
    const W = 96, H = 56;
    const cv = GE.canvas(W, H); host.appendChild(cv);
    const ctx = cv.getContext('2d');
    const ui = GE.el('div', 'pet-ui');
    ui.innerHTML = `<div class="bubble"></div><div class="pet-bars"><span>tummy <i class="bar"><b class="hunger"></b></i></span><span>joy <i class="bar"><b class="joy"></b></i></span></div><div class="pet-btns"><button class="btn feed">feed</button><button class="btn pat">pet</button><button class="btn sing">sing</button></div>`;
    host.appendChild(ui);
    const bubble = ui.querySelector('.bubble');
    const hb = ui.querySelector('.hunger'), jb = ui.querySelector('.joy');
    const [bf, bp, bs] = ui.querySelectorAll('button');
    let anim = 0, blinkT = 3000, blinking = 0, hearts = [];
    const say = (s) => { GE.pet.said = s; bubble.innerHTML = GE.personalize(GE.esc(s).replace(/\{(\w+)\}/g, (m) => m)); };
    say(huge ? 'LARGER' : GE.pet.said);
    const line = () => GE.pick(PET_LINES[petStage(GE.dd())]);
    bf.addEventListener('click', () => {
      const d = GE.dd();
      if (d > 0.6) { GE.pet.hunger = 100; say(d > 0.8 ? 'FEED IT' : "he doesn't eat it."); return; }
      GE.pet.hunger = Math.max(0, GE.pet.hunger - 30); anim = 400; say(d < 0.2 ? 'nom nom ♡' : 'nom.');
    });
    bp.addEventListener('click', () => {
      const d = GE.dd();
      if (d > 0.8) { say("DON'T"); return; }
      GE.pet.joy = Math.min(100, GE.pet.joy + 18);
      for (let i = 0; i < 3; i++) hearts.push({ x: 48 + GE.rand(-8, 8), y: 20, life: 1 });
      say(d < 0.2 ? '(happy wiggle)' : line());
    });
    bs.addEventListener('click', () => {
      GE.audio.ensure();
      const d = GE.dd();
      [0, 4, 7, 12].forEach((s, i) => setTimeout(() => GE.audio.blip(440 * Math.pow(2, (s - d * 7 * i / 3) / 12), 0.25, 0.05, 'sine'), i * 160));
      say(d > 0.6 ? 'it sings back' : '♪ ~ ♪');
    });
    let sayT = 6000, lastStage = -1;
    function tick(t, dt) {
      const d = huge ? Math.max(GE.dd(), 0.85) : GE.dd();
      const st = petStage(d);
      if (st !== lastStage) {
        lastStage = st;
        bf.textContent = st >= 4 ? 'feed it' : 'feed';
        bp.textContent = st >= 4 ? "don't" : 'pet';
        bs.textContent = st >= 3 ? 'listen' : 'sing';
      }
      GE.pet.hunger = Math.min(100, GE.pet.hunger + dt * 0.0006 * (1 + d * 6));
      GE.pet.joy = Math.max(0, GE.pet.joy - dt * 0.0004 * (1 + d * 6));
      hb.style.width = (100 - GE.pet.hunger) + '%'; jb.style.width = GE.pet.joy + '%';
      sayT -= dt; if (sayT < 0) { sayT = GE.rand(5000, 9000); say(line()); }
      // tank
      ctx.fillStyle = GE.ramp([[0, '#8fd8e0'], [0.5, '#4a8a90'], [0.8, '#00002a'], [1, '#000']], d); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = GE.ramp([[0, '#d8c79a'], [0.6, '#5a5040'], [1, '#110000']], d); ctx.fillRect(0, H - 6, W, 6);
      for (let i = 0; i < 4; i++) { const px = 8 + i * 26; for (let j = 0; j < 12; j++) { ctx.fillStyle = GE.mix('#3f9a5c', '#330000', d); ctx.fillRect(px + Math.round(Math.sin(t * 0.002 + j * 0.3 + i) * 1.5), H - 6 - j, 2, 1); } }
      // bloop
      const sc = huge ? 3 : 1;
      const bob = Math.sin(t * 0.003) * 1.5 * (anim > 0 ? 2 : 1); anim = Math.max(0, anim - dt);
      const cx = huge ? 48 : 46 + Math.sin(t * 0.0007) * 10, cy = (huge ? 30 : 30) + bob;
      const pink = GE.ramp([[0, '#f7b6c8'], [0.5, '#e8c8d0'], [0.8, '#f4f0ea'], [1, '#ffffff']], d);
      const dark = GE.ramp([[0, '#d97a9a'], [0.5, '#b89aa4'], [0.8, '#aa0000'], [1, '#550000']], d);
      const gillC = GE.ramp([[0, '#e8577e'], [0.6, '#b04a5a'], [0.8, '#ff5555'], [1, '#aa0000']], d);
      const facing = st >= 2 && !huge ? -1 : 1; // later he faces the window (left)
      ctx.save();
      ctx.translate(Math.round(cx), Math.round(cy)); ctx.scale(sc * facing, sc);
      const growth = 1 + GE.smooth(0.55, 1, d) * 0.5;
      // tail + body
      GE.disc(ctx, -12 * growth, 2, 9 * growth, 3, dark); GE.disc(ctx, -12 * growth, 2, 8 * growth, 2, pink);
      ctx.fillStyle = dark; ctx.fillRect(Math.round(-22 * growth), 1, 4, 2);
      GE.disc(ctx, -2, 2, 9, 5, dark); GE.disc(ctx, -2, 2, 8, 4, pink);
      // legs
      ctx.fillStyle = dark; ctx.fillRect(-6, 6, 2, 3); ctx.fillRect(2, 6, 2, 3); ctx.fillRect(-14, 5, 2, 2);
      // head
      GE.disc(ctx, 8, -1, 8, 6, dark); GE.disc(ctx, 8, -1, 7, 5, pink);
      // gills
      const fronds = 3 + Math.floor(GE.smooth(0.6, 1, d) * 5);
      for (let f = 0; f < fronds; f++) {
        const a = -2.2 + f * (1.6 / Math.max(1, fronds - 1)) + Math.sin(t * 0.006 + f) * 0.1;
        for (let s = 0; s < 6 + f % 2 * 2; s++) {
          const gx = 2 + Math.cos(a) * s * 1.2, gy = -4 + Math.sin(a) * s * 1.2;
          ctx.fillStyle = gillC; ctx.fillRect(Math.round(gx), Math.round(gy), 1, 1);
          if (s % 2) ctx.fillRect(Math.round(gx) + 1, Math.round(gy) - 1, 1, 1);
        }
      }
      // eye(s)
      blinkT -= dt; if (blinkT < 0) { blinking = 140; blinkT = GE.rand(2000, 6000); }
      blinking = Math.max(0, blinking - dt);
      const eyeR = d > 0.6 ? 2 : 1;
      if (blinking > 0 && d < 0.8) { ctx.fillStyle = '#1a1a1a'; ctx.fillRect(9, -3, 3, 1); }
      else {
        if (d > 0.6) { ctx.fillStyle = '#ffffff'; ctx.fillRect(9 - eyeR, -4 - eyeR, 3 + eyeR, 2 + eyeR * 2); }
        const r = cv.getBoundingClientRect();
        const lx = d > 0.6 ? GE.clamp(((GE.mouse.x - r.left) / r.width - 0.5) * 4 * facing, -1, 1) : 0;
        const ly = d > 0.6 ? GE.clamp(((GE.mouse.y - r.top) / r.height - 0.5) * 4, -1, 1) : 0;
        ctx.fillStyle = d > 0.8 ? '#aa0000' : '#1a1a1a'; ctx.fillRect(Math.round(10 + lx), Math.round(-3 + ly), 2, 2);
        if (d < 0.6) { ctx.fillStyle = '#fff'; ctx.fillRect(10, -3, 1, 1); }
      }
      // mouth: a smile, then not
      ctx.fillStyle = dark;
      if (d < 0.6) { ctx.fillRect(10, 2, 4, 1); ctx.fillRect(14, 1, 1, 1); }
      else { ctx.fillStyle = '#000'; ctx.fillRect(10, 1, 5, 2 + Math.round(GE.smooth(0.7, 1, d) * 2)); }
      ctx.restore();
      // hearts
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i]; h.y -= dt * 0.02; h.life -= dt * 0.0012;
        if (h.life <= 0) { hearts.splice(i, 1); continue; }
        ctx.fillStyle = d > 0.6 ? '#aa0000' : '#ff6b8a';
        ctx.fillRect(Math.round(h.x), Math.round(h.y), 1, 1); ctx.fillRect(Math.round(h.x) + 2, Math.round(h.y), 1, 1); ctx.fillRect(Math.round(h.x), Math.round(h.y) + 1, 3, 1); ctx.fillRect(Math.round(h.x) + 1, Math.round(h.y) + 2, 1, 1);
      }
      if (huge) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1); }
    }
    GE.addTicker(cv, tick);
  };

  /* ================= pixel painter ================= */
  const GREEN = ['#1e3b2f', '#2f6b4f', '#4fa36b', '#9fd38a', '#e8f5c8', '#f2a65a', '#c8643c', '#6ec6d9', '#2f7f9e', '#7a5a3c', '#fffdf5'];
  const VGA_NAMES = ['the dark between', 'deep', 'kelp', 'shallow', 'what is under the skin', 'bruise', 'rust', 'fog',
    'ash', 'the line on the wall', 'algae', 'glass', 'warning', 'gums', 'the lantern', 'nothing'];
  const EYE16 = [
    '0000000000000000',
    '0000000000000000',
    '0000077777700000',
    '000777ffff777000',
    '0077ffffffff7700',
    '07ffff4cc4ffff70',
    '7ffff4c00c4ffff7',
    '7fff4c0000c4fff7',
    '7fff4c0000c4fff7',
    '7ffff4c00c4ffff7',
    '07ffff4cc4ffff70',
    '0077ffffffff7700',
    '000777ffff777000',
    '0000077777700000',
    '0000000000000000',
    '0000000000000000'];
  T.painter = function (host, opts) {
    const corrected = opts.mode === 'corrected';
    const N = 16, C = 12;
    const cv = GE.canvas(N * C, N * C, 'painter-cv'); host.appendChild(cv);
    const ctx = cv.getContext('2d');
    const pal = corrected ? GE.VGA.slice() : GREEN.slice();
    const grid = new Array(N * N).fill(-1);
    if (!corrected) {
      const map = { g: 0, G: 2, h: 3, l: 4 };
      GE.SPRITES.leaf.rows.forEach((row, y) => row.split('').forEach((ch, x) => { if (map[ch] != null) grid[y * N + x] = map[ch]; }));
    }
    let cur = corrected ? 12 : 2, drawing = false, idle = 0, done = false;
    const sw = GE.el('div', 'swatches');
    pal.forEach((c, i) => {
      const b = GE.el('button', 'sw'); b.style.background = c; b.title = corrected ? 'COLOR ' + i + ': ' + VGA_NAMES[i].toUpperCase() : c;
      b.setAttribute('aria-label', b.title);
      b.addEventListener('click', () => { cur = i; sw.querySelectorAll('.sw').forEach((x) => x.classList.remove('on')); b.classList.add('on'); });
      if (i === cur) b.classList.add('on');
      sw.appendChild(b);
    });
    const er = GE.el('button', 'btn small', corrected ? 'undo (no)' : 'eraser'); er.addEventListener('click', () => { cur = -1; });
    const cl = GE.el('button', 'btn small', 'clear'); cl.addEventListener('click', () => { grid.fill(-1); done = false; idle = 0; msg.textContent = corrected ? 'IT WILL HELP YOU FINISH.' : 'a blank page. good.'; });
    sw.appendChild(er); sw.appendChild(cl);
    host.appendChild(sw);
    const msg = cap(host, corrected ? 'IT WILL HELP YOU FINISH.' : 'here\'s my leaf. click + drag to paint over it. it doesn\'t save.');
    function paint(e) {
      const [x, y] = toCanvas(cv, e);
      const gx = Math.floor(x / C), gy = Math.floor(y / C);
      if (gx < 0 || gy < 0 || gx >= N || gy >= N) return;
      grid[gy * N + gx] = cur; idle = 0;
      if (corrected) done = false;
    }
    cv.addEventListener('pointerdown', (e) => { drawing = true; cv.setPointerCapture(e.pointerId); paint(e); e.preventDefault(); });
    cv.addEventListener('pointermove', (e) => { if (drawing) paint(e); });
    cv.addEventListener('pointerup', () => { drawing = false; });
    cv.addEventListener('pointercancel', () => { drawing = false; });
    let step = 0, rot = 0;
    function tick(t, dt) {
      const d = GE.dd();
      idle += dt;
      if (corrected && idle > 1400 && !done) {
        step += dt;
        while (step > 70) {
          step -= 70;
          const wrong = [];
          for (let i = 0; i < N * N; i++) { const tv = parseInt(EYE16[Math.floor(i / N)][i % N], 16); if (grid[i] !== tv) wrong.push(i); }
          if (!wrong.length) { done = true; msg.textContent = "THERE. ISN'T THAT BETTER?"; break; }
          const i = GE.pick(wrong); grid[i] = parseInt(EYE16[Math.floor(i / N)][i % N], 16);
          if (wrong.length > 60) msg.textContent = 'IT IS HELPING.';
        }
      }
      if (!corrected && d > 0.7) { rot += dt; if (rot > 3500) { rot = 0; const i = GE.randi(0, N * N - 1); grid[i] = 0; } }
      ctx.fillStyle = corrected ? '#000' : GE.mix('#fffdf5', '#d8d2b8', d);
      ctx.fillRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < N * N; i++) {
        const x = (i % N) * C, y = Math.floor(i / N) * C;
        if (grid[i] >= 0) { ctx.fillStyle = pal[grid[i]]; ctx.fillRect(x, y, C, C); }
      }
      ctx.fillStyle = corrected ? 'rgba(85,85,255,0.35)' : 'rgba(40,64,61,0.12)';
      for (let i = 1; i < N; i++) { ctx.fillRect(i * C, 0, 1, cv.height); ctx.fillRect(0, i * C, cv.width, 1); }
    }
    GE.addTicker(cv, tick);
  };

  /* ================= omikuji capsule machine ================= */
  const FORTUNES = [
    [['大吉 great blessing', 'a long nap is in your future.'], ['吉 blessing', 'you will find a rare cartridge at a yard sale.'], ['小吉 small blessing', 'the rain will start exactly when you want it to.'],
      ['末吉 future blessing', 'a fish will remember you.'], ['中吉 middle blessing', 'someone is about to send you a mixtape.'], ['凶 curse', 'you will step on a lego. tie it here.']],
    [['吉 blessing', 'the water is kind (for now).'], ['末吉 future blessing', "you're not the only one reading."], ['凶 curse', 'do not rewind it.'], ['小吉 small blessing', 'sleep comes easy. maybe too easy.'], ['凶 curse', 'something will answer your sonar.']],
    [['凶 curse', '41:00.'], ['大凶 great curse', 'it heard you turn the handle.'], ['凶 curse', 'the tap is running.'], ['末吉 future blessing', 'you will get used to it.'], ['凶 curse', 'the capsule is wet inside.']],
    [['大凶 great curse', 'the capsule is empty. the capsule was always empty.'], ['凶凶凶', 'kneel at the tide line.'], ['大凶 great curse', '{name}, it is {time}. it knows.'], ['凶 curse', 'there is no tree to tie this to. there is only water.'], ['大大凶', 'keep scrolling.']]
  ];
  T.omikuji = function (host) {
    const wrap = GE.el('div', 'omikuji');
    const cv = GE.canvas(40, 56, 'gacha'); wrap.appendChild(cv);
    const side = GE.el('div', 'omi-side');
    const btn = GE.el('button', 'btn', 'turn the handle ↻');
    const card = GE.el('div', 'fortune', '<span class="muted">(no fortune yet)</span>');
    const tie = GE.el('button', 'btn small tie', 'tie it here');
    const held = GE.el('div', 'cap');
    side.appendChild(btn); side.appendChild(card); side.appendChild(tie); side.appendChild(held);
    wrap.appendChild(side);
    host.appendChild(wrap);
    tie.style.display = 'none';
    const ctx = cv.getContext('2d');
    let shake = 0, dropped = null;
    const caps = []; for (let i = 0; i < 14; i++) caps.push({ x: GE.randi(9, 29), y: GE.randi(9, 24), c: GE.pick(['#ff8fa8', '#8fd3ff', '#ffe08f', '#a8f08f', '#d8a8ff']) });
    const showHeld = () => {
      const n = GE.store.get('tied', 0) || 0;
      const d = GE.dd();
      held.textContent = n ? (d > 0.6 ? `the tidepool is holding ${n} bad fortune${n > 1 ? 's' : ''} for you. it is getting heavy.` : `the tidepool is holding ${n} bad fortune${n > 1 ? 's' : ''} for you.`) : '';
    };
    showHeld();
    btn.addEventListener('click', () => {
      shake = 600; GE.audio.blip && GE.audio.ctx && GE.audio.blip(300, 0.08, 0.04);
      card.classList.remove('show');
      setTimeout(() => {
        const d = GE.dd();
        const pool = FORTUNES[d < 0.2 ? 0 : d < 0.45 ? 1 : d < 0.7 ? 2 : 3];
        const f = GE.pick(pool);
        dropped = { y: 40, c: GE.pick(['#ff8fa8', '#8fd3ff', '#ffe08f']) };
        card.innerHTML = `<b>${GE.esc(f[0])}</b><br>${GE.personalize(GE.esc(f[1]).replace(/&#39;/g, "'"))}`;
        card.classList.add('show');
        tie.style.display = f[0].indexOf('凶') >= 0 ? '' : 'none';
      }, 650);
    });
    tie.addEventListener('click', () => {
      GE.store.set('tied', (GE.store.get('tied', 0) || 0) + 1);
      tie.style.display = 'none';
      card.innerHTML = '<span class="muted">(tied. walk home lighter.)</span>';
      showHeld();
    });
    let lastBucket = -1;
    GE.addTicker(cv, (t, dt) => {
      const d = GE.dd();
      const b = Math.round(d * 10);
      if (b !== lastBucket) { lastBucket = b; btn.textContent = d > 0.75 ? 'turn it' : 'turn the handle ↻'; showHeld(); }
      shake = Math.max(0, shake - dt);
      const ox = shake ? Math.round(Math.sin(t * 0.08) * 1.5) : 0;
      ctx.clearRect(0, 0, 40, 56);
      ctx.save(); ctx.translate(ox, 0);
      GE.disc(ctx, 19, 16, 15, 14, GE.mix('#d8f4ff', '#55ffff', GE.smooth(0.7, 1, d)));
      caps.forEach((c) => { GE.disc(ctx, c.x, c.y, 2, 2, d > 0.75 ? GE.nearestVGA(c.c) : c.c); if (d > 0.85) { ctx.fillStyle = '#000'; ctx.fillRect(c.x, c.y, 1, 1); } });
      ctx.fillStyle = '#ffffff'; ctx.fillRect(9, 7, 2, 4);
      const red = GE.ramp([[0, '#e2474b'], [0.7, '#8a1e1e'], [1, '#aa0000']], d);
      ctx.fillStyle = red; ctx.fillRect(5, 29, 29, 22);
      ctx.fillStyle = GE.mix(red, '#000', 0.3); ctx.fillRect(5, 49, 29, 3);
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(13, 41, 12, 7);
      GE.disc(ctx, 19, 35, 4, 4, '#f4efe2');
      ctx.fillStyle = '#5a5a5a';
      const a = shake ? t * 0.02 : 0;
      ctx.fillRect(Math.round(19 + Math.cos(a) * 3) - 1, Math.round(35 + Math.sin(a) * 3) - 1, 2, 2);
      if (dropped) { GE.disc(ctx, 19, 44, 3, 2, dropped.c); }
      ctx.restore();
    });
  };

  /* ================= guestbook (embedded, read-only) ================= */
  T.guestbook = function (host, opts) { GE.social.guestbook(host, { mode: opts.mode, readonly: true }); };

  /* ================= the creek (ripple) ================= */
  T.ripple = function (host) {
    const W = 128, H = 72;
    const cv = GE.canvas(W, H); host.appendChild(cv);
    const ctx = cv.getContext('2d');
    const c = cap(host, 'drag across the water. (hydrophone not included.)');
    let a = new Float32Array(W * H), b = new Float32Array(W * H);
    const img = ctx.createImageData(W, H);
    const poke = (x, y, s) => { x = Math.round(x); y = Math.round(y); if (x > 1 && y > 1 && x < W - 2 && y < H - 2) { a[y * W + x] += s; a[y * W + x + 1] += s * 0.5; a[(y + 1) * W + x] += s * 0.5; } };
    let lastPoke = 0;
    cv.addEventListener('pointermove', (e) => { const [x, y] = toCanvas(cv, e); const now = performance.now(); if (now - lastPoke > 16) { poke(x, y, 260); lastPoke = now; } });
    cv.addEventListener('pointerdown', (e) => { const [x, y] = toCanvas(cv, e); poke(x, y, 900); });
    let wordT = 0, lastB = -1;
    const pebbles = []; for (let i = 0; i < 70; i++) pebbles.push([GE.randi(0, W - 1), GE.randi(0, H - 1), Math.random()]);
    function tick(t, dt) {
      const d = GE.dd();
      if (Math.round(d * 10) !== lastB) { lastB = Math.round(d * 10); c.textContent = d > 0.6 ? 'drag across the water. it will drag back.' : 'drag across the water. (hydrophone not included.)'; }
      if (Math.random() < 0.06) poke(GE.rand(2, W - 2), GE.rand(2, H - 2), GE.rand(80, 200));
      wordT += dt;
      if (d > 0.45 && wordT > 4200) {
        wordT = 0;
        const word = GE.pick(['LISTEN', '41:00', 'MINNOW', 'BELOW', 'HERE', (GE.getName() || 'YOU').toUpperCase().slice(0, 8)]);
        const s = 3, w = GE.pixTextWidth(word, s), ox = Math.round((W - w) / 2), oy = 28;
        for (let ci = 0; ci < word.length; ci++) { const g = GE.glyph(word[ci]); for (let i = 0; i < 15; i++) if (g[i] === '1') for (let yy = 0; yy < s; yy++) for (let xx = 0; xx < s; xx++) poke(ox + ci * 4 * s + (i % 3) * s + xx, oy + Math.floor(i / 3) * s + yy, -160 * d); }
      }
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        b[i] = ((a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) / 2 - b[i]) * 0.965;
      }
      const tmp = a; a = b; b = tmp;
      const base = GE.hex2rgb(GE.ramp([[0, '#3a8a8a'], [0.5, '#2a5048'], [0.8, '#00002a'], [1, '#000']], d));
      const base2 = GE.hex2rgb(GE.ramp([[0, '#327b80'], [0.5, '#25463f'], [0.8, '#000018'], [1, '#0a0000']], d));
      const hi = GE.hex2rgb(GE.ramp([[0, '#d8fbff'], [0.5, '#a0c8b8'], [0.8, '#55ffff'], [1, '#ff5555']], d));
      const mid = GE.hex2rgb(GE.ramp([[0, '#7cc4c4'], [0.5, '#5a8478'], [0.8, '#0000aa'], [1, '#550000']], d));
      const lo = GE.hex2rgb(GE.ramp([[0, '#1a4a5a'], [0.5, '#0a2420'], [0.8, '#000000'], [1, '#000']], d));
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const s = x > 0 && x < W - 1 && y > 0 && y < H - 1 ? (a[i - 1] - a[i + 1]) + (a[i - W] - a[i + W]) * 0.6 : 0;
        const k = GE.clamp(s / 70, -1, 1);
        const th = GE.bayer(x, y);
        const caust = Math.sin(x * 0.21 + t * 0.0013) + Math.sin(y * 0.33 - t * 0.0009 + x * 0.05) > 1.1;
        let col = caust ? base2 : base;
        if (k > 0) col = k > 0.55 + th * 0.4 ? hi : k > 0.12 + th * 0.45 ? mid : col;
        else if (-k > 0.15 + th * 0.5) col = lo;
        const p = i * 4;
        img.data[p] = col[0]; img.data[p + 1] = col[1]; img.data[p + 2] = col[2]; img.data[p + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = d > 0.8 ? '#330000' : 'rgba(30,50,40,0.35)';
      pebbles.forEach((p) => { if (p[2] < 0.6) ctx.fillRect(p[0], p[1], 2, 1); });
    }
    GE.addTicker(cv, tick);
  };

  /* ================= air meter ================= */
  T.air = function (host) {
    const box = GE.el('div', 'air');
    box.innerHTML = '<div class="air-label">AIR</div><div class="air-bar"></div><div class="air-num" aria-hidden="true"></div><button class="btn small">surface ↑</button>';
    host.appendChild(box);
    const bar = box.querySelector('.air-bar'), num = box.querySelector('.air-num'), btn = box.querySelector('button');
    const SEG = 30;
    for (let i = 0; i < SEG; i++) bar.appendChild(GE.el('i'));
    const segs = bar.querySelectorAll('i');
    let air = SEG, acc = 0, drowned = 0, lastN = -1;
    const c = cap(host, 'the meter only runs while you can see it.');
    btn.addEventListener('click', () => { air = SEG; num.textContent = ''; GE.audio.ctx && GE.audio.blip(880, 0.08, 0.04, 'sine'); });
    GE.addTicker(box, (t, dt) => {
      const d = GE.dd();
      btn.textContent = d > 0.85 ? 'there is no surface' : 'surface ↑';
      if (drowned > 0) {
        drowned -= dt;
        if (drowned <= 0) { host.closest('.post') && host.closest('.post').classList.remove('drowned'); air = SEG; c.textContent = 'you came back up. this time.'; }
        return;
      }
      acc += dt;
      if (acc > 1000) {
        acc = 0; air--;
        if (air <= 5 && air > 0 && GE.audio.ctx) GE.audio.blip(440 + (5 - air) * 90, 0.12, 0.05);
        if (air <= 0) {
          drowned = 3800; num.textContent = '';
          const p = host.closest('.post'); if (p) p.classList.add('drowned');
          c.textContent = '...';
        }
      }
      segs.forEach((s, i) => s.classList.toggle('on', i < air));
      const n = air <= 5 && air > 0 ? air : 0;
      if (n !== lastN) { lastN = n; num.textContent = n ? String(n) : ''; num.classList.toggle('pulse', !!n); }
    });
  };

  /* ================= the tide oracle ================= */
  T.oracle = function (host) {
    const box = GE.el('div', 'oracle');
    const btn = GE.el('button', 'btn big', 'ASK THE TIDE');
    const out = GE.el('div', 'oracle-out', '<span class="muted">THE TIDE IS WAITING.</span>');
    const count = GE.el('div', 'cap');
    box.appendChild(btn); box.appendChild(out); box.appendChild(count);
    host.appendChild(box);
    let n = GE.store.get('asked', 0) || 0, typing = null;
    const upd = () => { count.textContent = n ? `THE TIDE HAS SPOKEN ${n} TIME${n > 1 ? 'S' : ''}. EVERY WORD WAS CHOSEN.` : ''; };
    upd();
    btn.addEventListener('click', () => {
      n++; GE.store.set('asked', n); upd();
      clearInterval(typing);
      out.innerHTML = '';
      const words = GE.oracleLine(GE.randi(7, 14));
      let i = 0;
      typing = setInterval(() => {
        if (i >= words.length) { clearInterval(typing); return; }
        const s = GE.el('span', 'ow'); s.textContent = words[i].toUpperCase() + ' ';
        s.style.color = GE.pick(['#ff5555', '#ffff55', '#55ffff', '#55ff55', '#ff55ff', '#ffffff', '#5555ff']);
        out.appendChild(s);
        if (GE.audio.ctx) GE.audio.blip(GE.pick([110, 146.8, 164.8, 220, 233]), 0.12, 0.035, 'square');
        i++;
      }, 120);
    });
  };

  /* ================= LAGOON/OS terminal ================= */
  T.terminal = function (host) {
    const box = GE.el('div', 'term');
    const pre = GE.el('div', 'term-out');
    const form = GE.el('form', 'term-in', '<span class="prompt">C:/LAGOON&gt;</span><input aria-label="terminal input" autocomplete="off" spellcheck="false" maxlength="60">');
    box.appendChild(pre); box.appendChild(form);
    host.appendChild(box);
    form.style.visibility = 'hidden';
    const input = form.querySelector('input');
    const name = () => GE.getName() || 'visitor';
    const print = (s, cls) => { const l = GE.el('div', cls || ''); l.textContent = s; pre.appendChild(l); pre.scrollTop = pre.scrollHeight; return l; };
    const boot = () => [
      ['LAGOON/OS v0.41   (C) THE TIDE.   RING 0.   NO NETWORK.   16 COLORS.   640x480.', 'y'],
      ['', ''],
      ['loading kernel ........................ wet', ''],
      ['mounting /dev/cdrom0 (TIDEPOOL, for sleep) ... 74:00 -> 81:40 -> 96:13 -> ∞', ''],
      ['checking minnow ....................... NOT FOUND', 'r'],
      ['checking ' + name() + ' ' + '.'.repeat(Math.max(3, 29 - name().length)) + ' PRESENT', 'c'],
      ['checking permissions .................. NONE (as given)', ''],
      ['starting listener ..................... ok', ''],
      ['the tide says: ' + GE.oracleLine(6).join(' ').toUpperCase(), 'm'],
      ['', ''],
      ["type 'help'.", '']
    ];
    let booted = false;
    GE.addTicker(box, () => {
      if (booted) return;
      booted = true;
      const lines = boot(); let i = 0;
      const iv = setInterval(() => {
        if (i >= lines.length) { clearInterval(iv); form.style.visibility = ''; return; }
        print(lines[i][0], lines[i][1]); i++;
        if (GE.audio.ctx) GE.audio.blip(60 + i * 7, 0.05, 0.03);
      }, 260);
    });
    const files = { 'tidepool.wav': 'binary file. 4,294,967,296 minutes. playing.', 'you.txt': '', 'bloop.sav': 'SIZE: LARGER THAN THE TANK', 'minnow/': 'is a directory. it is full of water.', 'rules.txt': '640x480. 16 colors. no network. ring 0. one file. it is not a program. it is a place.' };
    const cmds = {
      help: () => 'there is no help. there is listening. try: ls, cat, whoami, minnow, surface, sleep, exit',
      ls: () => Object.keys(files).join('   '),
      dir: () => cmds.ls(),
      whoami: () => name() + '. visitor #000001. the only visitor.',
      minnow: () => 'minnow is in the vestibule. minnow is happy. do not disturb minnow.',
      surface: () => 'there is no surface. the surface is a rumor told by air.',
      exit: () => 'there is nowhere to exit to. you are already home.',
      quit: () => cmds.exit(),
      sleep: () => 'you can sleep now. it will keep playing.',
      clear: () => { pre.innerHTML = ''; return 'cleared. it is still there.'; },
      sudo: () => 'there are no permissions to escalate. everything is ring 0. everything was always allowed.',
      reboot: () => 'rebooting into the same room.',
      rm: () => 'nothing is ever deleted. it only sinks.',
      hello: () => 'GREETINGS, ' + name().toUpperCase() + '.',
      hi: () => cmds.hello()
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim(); input.value = '';
      if (!v) return;
      print('C:/LAGOON> ' + v, 'echo');
      const [c0, arg] = v.toLowerCase().split(/\s+/);
      let out;
      if (c0 === 'cat' || c0 === 'type') {
        if (arg === 'you.txt') {
          const now = new Date();
          out = `name: ${name()}\nlocal time: ${GE.fmtTime(now)}, ${GE.DAYS[now.getDay()]}\nwindow: ${innerWidth}x${innerHeight}\nvisits: ${GE.visits}\nminutes here: ${GE.minutesHere()}\nstatus: still reading`;
        } else out = files[arg] || ('cat: ' + (arg || '?') + ': it was here a moment ago');
      } else if (cmds[c0]) out = cmds[c0]();
      else out = GE.oracleLine(GE.randi(5, 9)).join(' ').toUpperCase();
      out.split('\n').forEach((l) => print(l, cmds[c0] || c0 === 'cat' ? '' : 'm'));
    });
  };

  /* ================= scenes as toys ================= */
  T.scene = function (host, opts) { (GE.scenes[opts.scene] || (() => {}))(host); };

  GE.mountToys = (root) => {
    root.querySelectorAll('[data-toy]').forEach((el) => {
      const name = el.dataset.toy;
      el.classList.add('toy', 'toy-' + name);
      if (T[name]) { try { T[name](el, el.dataset); } catch (e) { console.error('toy failed', name, e); } }
    });
  };
})(window.GE);
