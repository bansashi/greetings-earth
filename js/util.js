/* greetings, earth! — shared helpers */
window.GE = window.GE || {};
(function (GE) {
  'use strict';

  GE.D = 0;            // derangement, 0..1 over the authored arc, >1 in the endless region
  GE.ARC = 30;         // number of authored posts
  GE.startTime = Date.now();

  GE.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  GE.lerp = (a, b, t) => a + (b - a) * t;
  GE.smooth = (a, b, v) => { const t = GE.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  GE.rand = (a, b) => a + Math.random() * (b - a);
  GE.randi = (a, b) => Math.floor(GE.rand(a, b + 1));
  GE.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  GE.chance = (p) => Math.random() < p;
  GE.dd = () => GE.clamp(GE.D, 0, 1);

  let reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  GE.reducedMotion = reduced;
  GE.touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* storage, always wrapped */
  GE.store = {
    get(k, def) {
      try { const v = localStorage.getItem('ge:' + k); return v == null ? def : JSON.parse(v); }
      catch (e) { return def; }
    },
    set(k, v) { try { localStorage.setItem('ge:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  GE.visits = (GE.store.get('visits', 0) || 0) + 1;
  GE.store.set('visits', GE.visits);
  GE.lastDepth = GE.store.get('maxDepth', 0) || 0;

  /* colour */
  GE.hex2rgb = (h) => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  GE.rgb2hex = (r, g, b) => '#' + [r, g, b].map((v) => GE.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  GE.mix = (a, b, t) => {
    const A = GE.hex2rgb(a), B = GE.hex2rgb(b);
    return GE.rgb2hex(GE.lerp(A[0], B[0], t), GE.lerp(A[1], B[1], t), GE.lerp(A[2], B[2], t));
  };
  // sample a list of [pos, hex] stops
  GE.ramp = (stops, t) => {
    if (t <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        const a = stops[i - 1], b = stops[i];
        return GE.mix(a[1], b[1], (t - a[0]) / (b[0] - a[0]));
      }
    }
    return stops[stops.length - 1][1];
  };

  GE.VGA = ['#000000', '#0000aa', '#00aa00', '#00aaaa', '#aa0000', '#aa00aa', '#aa5500', '#aaaaaa',
    '#555555', '#5555ff', '#55ff55', '#55ffff', '#ff5555', '#ff55ff', '#ffff55', '#ffffff'];
  const vgaRGB = GE.VGA.map(GE.hex2rgb);
  const vgaCache = {};
  GE.nearestVGA = (hex) => {
    if (vgaCache[hex]) return vgaCache[hex];
    const c = GE.hex2rgb(hex);
    let best = 0, bd = 1e9;
    vgaRGB.forEach((v, i) => {
      const d = (v[0] - c[0]) ** 2 + (v[1] - c[1]) ** 2 + (v[2] - c[2]) ** 2;
      if (d < bd) { bd = d; best = i; }
    });
    return (vgaCache[hex] = GE.VGA[best]);
  };

  GE.BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  GE.bayer = (x, y) => GE.BAYER[(y & 3) * 4 + (x & 3)];

  /* text */
  GE.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  GE.getName = () => (GE.store.get('name', '') || '').trim();
  GE.DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  GE.fmtTime = (d) => {
    let h = d.getHours(); const m = d.getMinutes();
    const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
  };
  GE.minutesHere = () => Math.max(1, Math.round((Date.now() - GE.startTime) / 60000));
  GE.personalize = (s) => {
    if (!s) return '';
    const name = GE.getName() || 'visitor';
    const now = new Date();
    return String(s).replace(/\{(\w+)\}/g, (m, k) => {
      switch (k) {
        case 'name': return GE.esc(name);
        case 'NAME': return GE.esc(name.toUpperCase());
        case 'time': return GE.fmtTime(now);
        case 'later': return GE.fmtTime(new Date(Date.now() + GE.randi(3, 41) * 60000));
        case 'day': return GE.DAYS[now.getDay()];
        case 'minutes': return String(GE.minutesHere());
        case 'mins': { const m = GE.minutesHere(); return m + (m === 1 ? ' minute' : ' minutes'); }
        case 'width': return String(window.innerWidth);
        case 'visits': return String(GE.visits);
        case 'tide': return (0.2 + GE.dd() * 40.8).toFixed(1);
        default: return m;
      }
    });
  };

  /* tiny 3x5 pixel font */
  const F = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
    E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
    I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
    Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111',
    0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010',
    8: '111101111101111', 9: '111101111001110',
    ' ': '000000000000000', '!': '010010010000010', '?': '110001010000010', '.': '000000000000010',
    ',': '000000000010100', ':': '000010000010000', '-': '000000111000000', '+': '000010111010000',
    '/': '001001010100100', '#': '101111101111101', '*': '101010101000000', "'": '010010000000000',
    '(': '010100100100010', ')': '010001001001010', '=': '000111000111000', '<': '001010100010001',
    '>': '100010001010100', '%': '101001010100101', '_': '000000000000111', '~': '000011110000000'
  };
  GE.FONT = F;
  GE.glyph = (ch) => F[String(ch).toUpperCase()] || F['?'];
  GE.pixText = (ctx, str, x, y, s, color) => {
    ctx.fillStyle = color;
    let cx = x;
    for (const ch of String(str)) {
      const g = GE.glyph(ch);
      for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(cx + (i % 3) * s, y + Math.floor(i / 3) * s, s, s);
      cx += 4 * s;
    }
  };
  GE.pixTextWidth = (str, s) => String(str).length * 4 * s - s;

  /* canvases */
  GE.canvas = (w, h, cls) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    if (cls) c.className = cls;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return c;
  };
  GE.px = (ctx, x, y, c, w, h) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w || 1, h || 1); };
  GE.disc = (ctx, cx, cy, rx, ry, c) => {
    ctx.fillStyle = c;
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry + 0.0001))));
      ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1);
    }
  };

  /* animation loop + visibility gating */
  const tickers = new Set();
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((ents) => {
    ents.forEach((e) => { const t = e.target.__ticker; if (t) t.vis = e.isIntersecting; });
  }, { rootMargin: '120px' }) : null;
  GE.addTicker = (el, fn, always) => {
    const t = { el, fn, vis: !!always || !io, always: !!always };
    el.__ticker = t;
    tickers.add(t);
    if (io && !always) io.observe(el);
    return t;
  };
  GE.frameHooks = [];
  let last = performance.now();
  function frame(ts) {
    const dt = Math.min(64, ts - last); last = ts;
    tickers.forEach((t) => {
      if (!t.el.isConnected) { tickers.delete(t); return; }
      if (t.vis || t.always) { try { t.fn(ts, dt); } catch (e) { console.error(e); tickers.delete(t); } }
    });
    GE.frameHooks.forEach((f) => { try { f(ts, dt); } catch (e) { console.error(e); } });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* mouse position (viewport + normalised) */
  GE.mouse = { x: innerWidth / 2, y: innerHeight / 2, nx: 0.5, ny: 0.5 };
  window.addEventListener('pointermove', (e) => {
    GE.mouse.x = e.clientX; GE.mouse.y = e.clientY;
    GE.mouse.nx = e.clientX / innerWidth; GE.mouse.ny = e.clientY / innerHeight;
  }, { passive: true });

  GE.el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
})(window.GE);
