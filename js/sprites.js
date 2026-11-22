/* pixel sprites — hand-placed strings and a few procedural ones */
(function (GE) {
  'use strict';

  const S = {};

  S.gill = {
    pal: { o: '#b9522e', y: '#f4a259', s: '#fff4e0', w: '#ffffff', k: '#1b1b1b', f: '#e07b3c' },
    rows: [
      '.....oooooo.....',
      '...ooyyyyyyoo...',
      'o.oyysyyyyyyyo..',
      'ooyyysyyyyyywko.',
      'ofyyysyyyyyyyyyo',
      'ooyyysyyyyyyyyo.',
      'o.oyysyyyyyyoo..',
      '...ooyyyyyyo....',
      '.....oooooo.....'
    ]
  };

  S.tetra = {
    pal: { c: '#3a7fc4', b: '#7fd3ff', r: '#e2474b', k: '#10141a' },
    rows: [
      'c..bbb..',
      'ccbrrrbk',
      'ccbbbbbb',
      'c..bbb..'
    ]
  };

  S.leaf = {
    pal: { g: '#1f5a3a', G: '#3f9a5c', h: '#7ccf7a', l: '#c6ef9c' },
    rows: [
      '........gg......',
      '.......gGGg.....',
      '......gGhGGg....',
      '.....gGhGlGGg...',
      '....gGhGGlGGGg..',
      '...gGhGGGlGGGGg.',
      '...gGGGGGlGGGGg.',
      '..gGG.GGGlGG.GGg',
      '..gGGGGGGlGGGGGg',
      '..gGhGGGGlGGGGGg',
      '...gGG.GGlG.GGg.',
      '...gGGGGGlGGGGg.',
      '....gGGGGlGGGg..',
      '.....ggGGlGgg...',
      '.........l......',
      '.........l......'
    ]
  };

  S.fern = {
    pal: { g: '#1f5a3a', G: '#3f9a5c', h: '#8fd47e', s: '#6b4a2a' },
    rows: [
      '.......hh.......',
      '......hGG.......',
      '....hh.G.hh.....',
      '...hGG.G.GGh....',
      '.....G.GGG......',
      '..hhGG.G.GGhh...',
      '.hGG...G...GGh..',
      '....GGGG.GG.....',
      '.hhGG..G..GGhh..',
      'hGG....G....GGh.',
      '...GGGGG.GGG....',
      '.gGG...G...GGg..',
      'gG.....G.....Gg.',
      '.......s........',
      '......sss.......',
      '.....sssss......'
    ]
  };

  S.jelly = {
    pal: { j: '#c86fb4', J: '#f3b6e6', w: '#ffffff', k: '#3a1838', t: '#e08fd2' },
    rows: [
      '...jjjjj...',
      '.jjJJJJJjj.',
      'jJJwJJJJJJj',
      'jJJJJJJJJJj',
      'jJJkJJJkJJj',
      'jjjjjjjjjjj',
      '.t.t.t.t.t.',
      '.t..t.t..t.',
      't..t...t..t',
      '.t..t.t..t.',
      '..t..t..t..',
      '.t.......t.'
    ]
  };

  S.frog = {
    pal: { w: '#ffffff', k: '#141414', g: '#2f7d3f', G: '#6cc24a', y: '#e9f59a', r: '#d0574f' },
    rows: [
      '..ww....ww..',
      '.wkkw..wkkw.',
      '.gwwggggwwg.',
      'gGGGGGGGGGGg',
      'gGGrrrrrrGGg',
      'gGGGGGGGGGGg',
      '.gGyyyyyyGg.',
      'gg.gg..gg.gg'
    ]
  };

  S.sub = {
    pal: { y: '#f4c542', Y: '#c9962a', w: '#bfe9ff', k: '#24323a', r: '#e2474b' },
    rows: [
      '......Yy........',
      '......Yy........',
      '....YYyyyy......',
      '..Yyyyyyyyyyy...',
      '.Yyywyyywyyyyy.r',
      'Yyyyyyyyyyyyyyyr',
      '.YyyyyyyyyyyyyYr',
      '..YYYYYYYYYYY...'
    ]
  };

  S.cart = {
    pal: { g: '#3a3a44', G: '#6b6b7a', l: '#d9d2c3', L: '#f4efe2', r: '#e2474b', b: '#3a7fc4', y: '#c9962a' },
    rows: [
      '.gggggggggggg.',
      'gGGGGGGGGGGGGg',
      'gGllllllllllGg',
      'gGlLrrLLbbLlGg',
      'gGlLrrLLbbLlGg',
      'gGlLLLLLLLLlGg',
      'gGllllllllllGg',
      'gGGGGGGGGGGGGg',
      'gGGgGGgGGgGGGg',
      '.gggggggggggg.',
      '..y.y.y.y.y...'
    ]
  };

  S.shell = {
    pal: { s: '#f2b8a2', S: '#d9826a', w: '#fff1e8' },
    rows: [
      '....SSSS....',
      '..SSwsswSS..',
      '.SwsSwsSswS.',
      'SwsSswwsSswS',
      'SssSsssSsssS',
      '.SSssssssSS.',
      '...SSSSSS...'
    ]
  };

  S.eye = {
    pal: { k: '#000000', w: '#ffffff', r: '#aa0000', R: '#ff5555' },
    rows: [
      '.....kkkkkk.....',
      '...kkwwwwwwkk...',
      '.kkwwwRRRRwwwkk.',
      'kwwwwRrkkrRwwwwk',
      'kwwwwRkkkkRwwwwk',
      'kwwwwRrkkrRwwwwk',
      '.kkwwwRRRRwwwkk.',
      '...kkwwwwwwkk...',
      '.....kkkkkk.....'
    ]
  };

  GE.SPRITES = S;

  /* palette corruption: c in 0..1 */
  function corruptColor(hex, c, rnd) {
    if (c <= 0) return hex;
    let out = c > 0.6 ? GE.nearestVGA(hex) : GE.mix(hex, GE.nearestVGA(hex), c / 0.6);
    if (c > 0.4 && rnd < (c - 0.4) * 0.12) out = GE.pick(['#aa0000', '#ff5555', '#000000', '#ffff55']);
    return out;
  }

  GE.drawSprite = (ctx, name, x, y, opts) => {
    opts = opts || {};
    const sp = S[name]; if (!sp) return;
    const sc = opts.scale || 1, flip = !!opts.flip, c = opts.corrupt || 0, pal = Object.assign({}, sp.pal, opts.pal || {});
    const h = sp.rows.length, w = sp.rows[0].length;
    for (let j = 0; j < h; j++) {
      const row = sp.rows[j];
      for (let i = 0; i < w; i++) {
        const ch = row[i];
        if (ch === '.') continue;
        let col = pal[ch]; if (!col) continue;
        if (c > 0) col = corruptColor(col, c, opts.seeded ? opts.seeded(i, j) : Math.random());
        ctx.fillStyle = col;
        const px = flip ? (w - 1 - i) : i;
        ctx.fillRect(Math.round(x + px * sc), Math.round(y + j * sc), sc, sc);
      }
    }
  };
  GE.spriteSize = (name) => { const sp = S[name]; return sp ? [sp.rows[0].length, sp.rows.length] : [0, 0]; };

  /* procedural sprites: fn(ctx, w, h, c) */
  const P = {};

  P.cdr = { w: 24, h: 24, draw(ctx, w, h, c) {
    const cx = 11.5, cy = 11.5;
    const label = c > 0.5 ? '#2a2a30' : '#f2f0ea';
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const r = Math.hypot(x - cx, y - cy);
      if (r > 11.6) continue;
      let col;
      if (r < 1.6) continue;
      else if (r < 3.2) col = '#b8c2c8';
      else if (r < 4) col = '#e9eef0';
      else {
        const a = Math.atan2(y - cy, x - cx);
        const band = (Math.sin(a * 2 + r * 0.6) + 1) / 2;
        col = y < 12 ? label : GE.mix('#cfd8dc', GE.pick(['#bfa6ff', '#9fe8ff', '#ffd59f']), band * 0.5);
        if (r > 11) col = '#9aa4aa';
      }
      ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1);
    }
    // blue marker scribble
    ctx.fillStyle = c > 0.5 ? '#ff5555' : '#2846c8';
    const scrib = [[5, 6], [6, 5], [7, 6], [8, 5], [9, 6], [10, 5], [11, 6], [13, 5], [14, 6], [15, 5], [16, 6], [17, 5], [18, 6], [8, 8], [9, 9], [10, 8], [11, 9], [12, 8], [13, 9], [14, 8], [15, 9]];
    scrib.forEach((p) => ctx.fillRect(p[0], p[1], 1, 1));
    if (c > 0.75) { ctx.fillStyle = '#000'; ctx.fillRect(10, 10, 4, 4); }
  } };

  P.bowl = { w: 24, h: 24, draw(ctx, w, h, c) {
    const glass = GE.mix('#bfe9f2', '#55ffff', c), water = GE.mix('#5fb3c9', '#0000aa', c), rim = GE.mix('#e9fbff', '#ffffff', c);
    GE.disc(ctx, 12, 13, 10, 9, glass);
    GE.disc(ctx, 12, 14, 9, 7, water);
    ctx.fillStyle = glass; ctx.fillRect(3, 6, 18, 2);
    ctx.fillStyle = rim; ctx.fillRect(6, 4, 12, 2);
    ctx.fillStyle = GE.mix('#e3d39a', '#555555', c); ctx.fillRect(5, 19, 14, 2);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(5, 10, 1, 3); ctx.fillRect(6, 9, 1, 1);
    if (c < 0.6) {
      GE.drawSprite(ctx, 'tetra', 8, 12, { pal: { b: GE.mix('#f4a259', '#aaaaaa', c), c: '#b9522e', r: '#fff4e0' } });
    } else {
      // it faces you now
      GE.disc(ctx, 12, 14, 3, 2, '#ffffff');
      ctx.fillStyle = '#aa0000'; ctx.fillRect(11, 13, 3, 3);
      ctx.fillStyle = '#000'; ctx.fillRect(12, 14, 1, 1);
    }
    ctx.fillStyle = '#ffffff'; ctx.fillRect(16, 9, 1, 1); ctx.fillRect(17, 7, 1, 1);
  } };

  P.dreamgraph = { w: 64, h: 64, draw(ctx, w, h, c) {
    const q = [[GE.mix('#ffd0e6', '#aa00aa', c), 0, 0], [GE.mix('#fff1b8', '#aa5500', c), 32, 0], [GE.mix('#cdb8ff', '#0000aa', c), 0, 32], [GE.mix('#b8e3ff', '#000000', c), 32, 32]];
    q.forEach((a) => { ctx.fillStyle = a[0]; ctx.fillRect(a[1], a[2], 32, 32); });
    ctx.fillStyle = GE.mix('#4a4a5a', '#ff5555', c); ctx.fillRect(0, 31, 64, 2); ctx.fillRect(31, 0, 2, 64);
    const ink = GE.mix('#4a4a5a', '#ffff55', c);
    GE.pixText(ctx, 'UP', 2, 2, 1, ink); GE.pixText(ctx, 'DOWN', 2, 58, 1, ink);
    GE.pixText(ctx, 'STA', 50, 34, 1, ink); GE.pixText(ctx, 'DYN', 2, 34, 1, ink);
    const n = 3 + Math.floor(c * 30);
    for (let i = 0; i < n; i++) {
      const x = c > 0.6 ? GE.randi(40, 60) : GE.randi(6, 58), y = c > 0.6 ? GE.randi(44, 60) : GE.randi(6, 58);
      ctx.fillStyle = i === n - 1 ? '#e2474b' : GE.mix('#2a6fb0', '#ff5555', c);
      ctx.fillRect(x, y, 2, 2);
    }
  } };

  P.eyes = { w: 96, h: 32, draw(ctx, w, h) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < 3; y++) for (let x = 0; x < 6; x++) {
      if (Math.random() < 0.2) { ctx.fillStyle = '#aa0000'; ctx.fillRect(x * 16 + 2, y * 10 + 5, 12, 1); continue; }
      ctx.save(); ctx.translate(x * 16, y * 10 + 1);
      ctx.scale(1, 0.95);
      GE.drawSprite(ctx, 'eye', 0, 0, { corrupt: Math.random() * 0.3 });
      ctx.restore();
    }
  } };

  P.wave = { w: 64, h: 16, draw(ctx, w, h, c) {
    for (let x = 0; x < w; x++) {
      const y0 = 6 + Math.round(Math.sin(x * 0.2) * 2.5);
      for (let y = y0; y < h; y++) {
        ctx.fillStyle = y === y0 ? GE.mix('#e9fbff', '#ffff55', c) : GE.mix(y < y0 + 3 ? '#6ec6d9' : '#2f7f9e', y < y0 + 3 ? '#0000aa' : '#000000', c);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  } };

  GE.PROC = P;

  /* registry so old sprites can rot as the page does */
  const mounted = [];
  GE.mountSprite = (cv, level) => {
    const name = cv.dataset.sprite;
    const scale = +(cv.dataset.scale || 4);
    let w, h;
    if (P[name]) { w = P[name].w; h = P[name].h; }
    else if (S[name]) { [w, h] = GE.spriteSize(name); }
    else return;
    cv.width = w; cv.height = h;
    cv.style.width = (w * scale) + 'px';
    cv.classList.add('sprite');
    const m = { cv, name, level: level || 0, last: -1 };
    mounted.push(m);
    renderMounted(m);
  };
  function corruptionFor(m) {
    return GE.clamp(Math.max((m.level - 0.45) / 0.45, (GE.dd() - 0.5) / 0.4), 0, 1);
  }
  function renderMounted(m) {
    const c = corruptionFor(m);
    const key = Math.round(c * 12);
    if (key === m.last) return;
    m.last = key;
    const ctx = m.cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, m.cv.width, m.cv.height);
    if (P[m.name]) P[m.name].draw(ctx, m.cv.width, m.cv.height, c);
    else {
      GE.drawSprite(ctx, m.name, 0, 0, { corrupt: c });
      if (c > 0.7 && m.name !== 'eye') {
        // something has grown an eye
        const [w, h] = GE.spriteSize(m.name);
        const ex = GE.randi(2, w - 4), ey = GE.randi(1, h - 3);
        ctx.fillStyle = '#fff'; ctx.fillRect(ex - 1, ey, 3, 2);
        ctx.fillStyle = '#aa0000'; ctx.fillRect(ex, ey, 1, 2);
      }
    }
  }
  GE.refreshSprites = () => { for (let i = mounted.length - 1; i >= 0; i--) { if (!mounted[i].cv.isConnected) mounted.splice(i, 1); else renderMounted(mounted[i]); } };

  /* data URLs for css decoration */
  GE.spriteURL = (name, scale, opts) => {
    const [w, h] = GE.spriteSize(name);
    const cv = GE.canvas(w * scale, h * scale);
    GE.drawSprite(cv.getContext('2d'), name, 0, 0, Object.assign({ scale }, opts || {}));
    return cv.toDataURL();
  };
})(window.GE);
