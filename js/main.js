/* the engine: feed, derangement, chrome */
(function (GE) {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const feed = $('#feed'), loader = $('#loader'), sentinel = $('#sentinel');
  const root = document.documentElement, body = document.body;
  const ARC = GE.ARC;

  /* ---------------- palettes ---------------- */
  const K = ['bg', 'bg2', 'paper', 'ink', 'muted', 'accent', 'accent2', 'link', 'border', 'shadow'];
  const PAL_A = [
    [0, ['#dff1ea', '#cde8de', '#fffdf5', '#28403d', '#6f8f88', '#23938a', '#ef9a4b', '#1f7fa0', '#a9d8c8', '#bfe3d6']],
    [0.18, ['#d8ece4', '#c6e1d6', '#fdfbf1', '#2a3f3b', '#6c8a83', '#2a8f86', '#e6984f', '#227a98', '#a6d1c2', '#b6dacb']],
    [0.38, ['#c3d6cb', '#b2c7bb', '#f4f0e0', '#24332d', '#66786c', '#3f7f6e', '#c98a4e', '#2d6a6a', '#9fb8a6', '#9db1a1']],
    [0.6, ['#7f8f7a', '#72826d', '#e2dcc2', '#1b231c', '#4f5a48', '#5c6b3a', '#9e5a3a', '#3a4f2e', '#6f7a5e', '#3b4535']],
    [0.8, ['#1c2620', '#16201a', '#cfc7a6', '#120d0b', '#4a3b2c', '#8b1e1e', '#9c8a2a', '#6a1a4a', '#3a2a2a', '#000000']]
  ];
  const PAL_B = [
    [0.8, ['#000000', '#00002a', '#000000', '#55ffff', '#aa00aa', '#ff5555', '#ffff55', '#55ff55', '#5555ff', '#aa0000']],
    [1, ['#000000', '#1a0000', '#000000', '#ffff55', '#aa5500', '#ff5555', '#ffffff', '#ff55ff', '#aa0000', '#550000']]
  ];
  function palette(d) {
    const set = d < 0.8 ? PAL_A : PAL_B;
    return K.map((k, i) => GE.ramp(set.map((s) => [s[0], s[1][i]]), d));
  }

  /* ---------------- rendering a post ---------------- */
  const stageOf = (i) => i < 6 ? 0 : i < 12 ? 1 : i < 18 ? 2 : i < 24 ? 3 : i < 30 ? 4 : 5;
  let nextIndex = 0, endlessN = 0, loading = false, page = 0;

  function commentsHTML(p) {
    const list = (p.comments || []).map((c) => `<li class="${c.you ? 'you' : ''}"><b class="who">${GE.personalize(GE.esc(c.who))}</b> <span class="when">${GE.personalize(c.when)}</span><p>${GE.personalize(GE.esc(c.text))}</p></li>`).join('');
    const n = (p.comments || []).length;
    const closed = p.closed ? '<p class="closed">comments are closed. comments were always closed.</p>' : '';
    return `<div class="comments"><div class="c-head">♡ ${n} comment${n === 1 ? '' : 's'}</div>${n ? `<ol class="comment-list">${list}</ol>` : ''}${closed}</div>`;
  }

  function renderPost(p, index) {
    const st = stageOf(index);
    const lvl = p.level != null ? p.level : index / ARC;
    const art = document.createElement('article');
    art.className = 'post st' + st + (p.cls ? ' ' + p.cls : '') + (index % 2 ? ' alt' : '');
    art.dataset.index = index;
    const H = GE.personalize;
    const meta = [];
    if (p.date) meta.push(`<span>✎ ${H(p.date)}</span>`);
    if (p.time) meta.push(`<span>◷ ${H(p.time)}</span>`);
    if (p.mood) meta.push(`<span>mood: ${H(p.mood)}</span>`);
    if (p.music) meta.push(`<span>♫ ${H(p.music)}</span>`);
    const tags = (p.tags || []).map((t) => `<span class="tag">#${GE.esc(t)}</span>`).join('');
    const by = st >= 4 && !p.cls ? 'posted by the tide' : 'posted by minnow';
    art.innerHTML = `<h2>${H(p.title)}</h2><div class="meta">${meta.join('')}</div><div class="body">${H(p.body)}</div>${tags ? `<div class="tags">${tags}</div>` : ''}<div class="post-foot"><span>${by}</span><span>permalink</span></div>${commentsHTML(p)}`;
    const name = GE.getName();
    art.querySelectorAll('[data-if-name]').forEach((e) => { if (!name) e.remove(); });
    art.querySelectorAll('[data-if-noname]').forEach((e) => { if (name) e.remove(); });
    if (index === 0 && GE.visits > 1 && GE.lastDepth > 0.4) {
      const w = GE.el('p', 'tiny');
      w.innerHTML = H(`(welcome back${name ? ', {name}' : ''}. you were here before. you got very far down.)`);
      w.dataset.away = '(welcome back.)';
      art.querySelector('.body').appendChild(w);
    }
    GE.corruptDOM(art.querySelector('.body'), lvl);
    if (lvl > 0.5) GE.corruptDOM(art.querySelector('h2'), lvl * 0.7);
    art.querySelectorAll('canvas[data-sprite]').forEach((cv) => GE.mountSprite(cv, lvl));
    GE.mountToys(art);
    art.querySelectorAll('[data-away]').forEach((e) => awayIO && awayIO.observe(e));
    return art;
  }

  const awayIO = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting) el.__seen = true;
      else if (el.__seen && el.dataset.away) { el.textContent = el.dataset.away; delete el.dataset.away; awayIO.unobserve(el); }
    });
  }) : null;

  /* ---------------- pagination ---------------- */
  const LOAD_MSG = [
    ['loading more posts…', 'fetching older entries…', 'loading more posts…'],
    ['loading…', 'loading more posts…', 'one sec…'],
    ['loading…', 'still loading…', 'one moment…', 'loading more posts…'],
    ["it's coming up", "don't", 'loading more posts loading more posts', 'keep going', 'almost'],
    ['SURFACING', 'DESCENDING', 'LISTEN', 'LOADING THE ROOM'],
    ['DESCENDING', 'THERE IS MORE', 'THERE IS ALWAYS MORE', '{NAME}', 'LOADING', 'DOWN']
  ];
  function loadMore() {
    if (loading) return;
    loading = true;
    const st = stageOf(nextIndex);
    loader.classList.add('on');
    $('.load-text', loader).innerHTML = GE.personalize(GE.pick(LOAD_MSG[st]));
    let delay = st === 0 ? 650 : st === 1 ? GE.rand(600, 1000) : st === 2 ? GE.rand(700, 1600) : st === 3 ? GE.rand(500, 2600) : GE.rand(200, 1200);
    if (nextIndex === 18) delay = 3200;
    setTimeout(() => {
      page++;
      const pg = GE.el('div', 'pager');
      const total = Math.ceil(ARC / 2);
      pg.textContent = page === 1 ? '' : (st >= 4 ? `— PAGE ${page} OF ${total} —` : `— page ${page} of ${total} —`);
      if (page > 1) feed.appendChild(pg);
      for (let k = 0; k < 2; k++) {
        let p;
        if (nextIndex < ARC) p = GE.POSTS[nextIndex];
        else p = GE.makeEndlessPost(endlessN++);
        feed.appendChild(renderPost(p, nextIndex));
        nextIndex++;
      }
      pruneEndless();
      loader.classList.remove('on');
      loading = false;
      requestAnimationFrame(() => { if (sentinel.getBoundingClientRect().top < innerHeight + 900) loadMore(); });
    }, nextIndex === 0 ? 0 : delay);
  }
  // keep the page from growing without bound once we are deep in the endless part
  function pruneEndless() {
    for (let k = 0; k < 4; k++) if (!pruneOne()) break;
  }
  function pruneOne() {
    const endless = [...feed.querySelectorAll('.post')].filter((a) => +a.dataset.index >= ARC + 2);
    if (endless.length <= 40) return false;
    const victim = endless[0];
    const prev = victim.previousElementSibling;
    const h = victim.offsetHeight + (prev && prev.classList.contains('pager') ? prev.offsetHeight : 0);
    if (victim.getBoundingClientRect().bottom > 0) return false;
    if (prev && prev.classList.contains('pager')) prev.remove();
    victim.remove();
    window.scrollBy(0, -h);
    return true;
  }
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { if (e[0].isIntersecting) loadMore(); }, { rootMargin: '0px 0px 900px 0px' }).observe(sentinel);

  /* ---------------- derangement ---------------- */
  function measure() {
    const mid = innerHeight * 0.5;
    let prog = 0;
    const posts = feed.querySelectorAll('.post');
    for (let i = 0; i < posts.length; i++) {
      const a = posts[i]; const r = a.getBoundingClientRect();
      const idx = +a.dataset.index;
      if (r.top <= mid && r.bottom >= mid) { prog = idx + (mid - r.top) / r.height; break; }
      if (r.bottom < mid) prog = idx + 1;
    }
    return prog / ARC;
  }
  let dirty = true;
  addEventListener('scroll', () => { dirty = true; }, { passive: true });
  addEventListener('resize', () => { dirty = true; });

  // ?depth=0.6 lets you start partway down (for the impatient, and for testing)
  try { const q = new URLSearchParams(location.search).get('depth'); if (q) GE.D = GE.clamp(parseFloat(q) || 0, 0, 1.5); } catch (e) {}

  let lastApplied = -1, lastBucket = -1, lastStage = -1;
  GE.frameHooks.push(() => {
    if (dirty) {
      dirty = false;
      const raw = measure();
      if (raw > GE.D) GE.D = raw;
    }
    const D = GE.D;
    if (Math.abs(D - lastApplied) > 0.0015) { lastApplied = D; apply(D); }
  });

  function apply(D) {
    const d = GE.clamp(D, 0, 1);
    const pal = palette(d);
    K.forEach((k, i) => root.style.setProperty('--' + k, pal[i]));
    root.style.setProperty('--d', d.toFixed(3));
    root.style.setProperty('--scan', (GE.smooth(0.35, 1, d) * 0.55).toFixed(3));
    root.style.setProperty('--vig', (GE.smooth(0.25, 1, d) * 0.75).toFixed(3));
    root.style.setProperty('--tilt', (GE.smooth(0.55, 0.8, d) * 0.9 - GE.smooth(0.8, 1, d) * 0.5 + GE.smooth(1, 1.6, D) * 0.8).toFixed(3) + 'deg');
    root.style.setProperty('--sat', (1 - GE.smooth(0.3, 0.78, d) * 0.45).toFixed(3));
    const stage = d < 0.15 ? 0 : d < 0.35 ? 1 : d < 0.55 ? 2 : d < 0.8 ? 3 : D < 1 ? 4 : 5;
    if (stage !== lastStage) {
      if (lastStage >= 0 && stage === 4) glitch(900);
      for (let i = 0; i <= 5; i++) body.classList.toggle('g' + i, i === stage);
      body.classList.toggle('os', stage >= 4);
      lastStage = stage;
    }
    const bucket = Math.floor(d * 40);
    if (bucket !== lastBucket) {
      lastBucket = bucket;
      GE.refreshSprites();
      updateChrome(d);
      GE.store.set('maxDepth', Math.max(GE.store.get('maxDepth', 0) || 0, d));
    }
  }

  /* ---------------- chrome: titles, favicon, sidebar ---------------- */
  const TITLES = [[0, 'greetings, earth! ~ a tidepool of small things'], [0.2, 'greetings, earth! ~ a tidepool'], [0.4, 'greetings, earth'], [0.55, 'greetings earth'],
    [0.65, 'GREETINGS, EARTH'], [0.75, 'it can hear the water'], [0.8, 'LAGOON/OS'], [0.92, 'GREETINGS, {NAME}']];
  const SUBS = [[0, 'a tidepool of small things — old games, slow manga &amp; sounds recorded near water'], [0.3, 'a tidepool of small things — old games, slow manga &amp; sounds recorded under water'],
    [0.5, 'a tidepool of small things. the water is coming up slowly.'], [0.65, 'a tidepool. a tidepool. it is coming up slowly enough.'], [0.8, 'THE ROOM. 640x480. 16 COLORS. NO NETWORK. RING 0.'], [0.95, 'THERE IS NO SURFACE.']];
  const H1 = [[0, 'greetings, earth!'], [0.5, 'greetings, earth'], [0.68, 'GREETINGS, EARTH'], [0.84, 'GREETINGS, DEPTH'], [0.95, 'GREETINGS, {NAME}']];
  const at = (list, d) => { let v = list[0][1]; list.forEach((x) => { if (d >= x[0]) v = x[1]; }); return v; };
  function updateChrome(d) {
    document.title = GE.personalize(at(TITLES, d)).replace(/&amp;/g, '&');
    $('#site-title').innerHTML = GE.personalize(at(H1, d));
    $('#site-sub').innerHTML = GE.personalize(at(SUBS, d));
    favicon(d);
    tile(d);
    sidebar(d);
  }
  let favKey = -1;
  function favicon(d) {
    const k = d < 0.5 ? 0 : d < 0.8 ? 1 : 2;
    if (k === favKey) return; favKey = k;
    const cv = GE.canvas(32, 32), c = cv.getContext('2d');
    if (k === 0) { GE.disc(c, 16, 16, 15, 15, '#6ec6d9'); GE.drawSprite(c, 'gill', 4, 11, { scale: 1.5 }); }
    else if (k === 1) { GE.disc(c, 16, 16, 15, 15, '#3a4a40'); GE.drawSprite(c, 'gill', 4, 11, { scale: 1.5, flip: true, pal: { w: '#000', k: '#f00' } }); }
    else { c.fillStyle = '#000'; c.fillRect(0, 0, 32, 32); GE.drawSprite(c, 'eye', 0, 7, { scale: 2 }); }
    $('#favicon').href = cv.toDataURL();
  }
  let tileKey = -1;
  function tile(d) {
    const k = Math.floor(d * 10);
    if (k === tileKey) return; tileKey = k;
    const cv = GE.canvas(64, 64), c = cv.getContext('2d');
    const col = getComputedStyle(root).getPropertyValue('--bg2').trim() || '#cde8de';
    const pts = [[8, 10], [40, 6], [24, 30], [52, 40], [12, 50], [36, 56]];
    pts.forEach(([x, y], i) => {
      if (d > 0.8 && i % 2 === 0) { c.fillStyle = '#aa0000'; c.fillRect(x - 1, y, 3, 1); c.fillStyle = '#ff5555'; c.fillRect(x, y, 1, 1); }
      else if (d > 0.55 && i === 3) { c.fillStyle = col; c.fillRect(x - 1, y, 3, 1); c.fillStyle = '#000'; c.fillRect(x, y, 1, 1); }
      else { c.fillStyle = col; c.fillRect(x, y - 1, 1, 1); c.fillRect(x - 1, y, 1, 1); c.fillRect(x + 1, y, 1, 1); c.fillRect(x, y + 1, 1, 1); }
    });
    if (d > 0.8) { c.fillStyle = 'rgba(85,85,255,0.18)'; c.fillRect(0, 0, 64, 1); c.fillRect(0, 0, 1, 64); }
    root.style.setProperty('--tile', `url(${cv.toDataURL()})`);
    const leafURL = d < 0.6 ? GE.spriteURL('leaf', 3, {}) : GE.spriteURL('leaf', 3, { corrupt: GE.smooth(0.6, 0.9, d) });
    root.style.setProperty('--leaf', `url(${leafURL})`);
  }

  /* sidebar */
  const SB = {
    about: [[0, "hi! i'm minnow ~ i like old games nobody finished, slow manga, and sounds recorded near water. this is my tidepool. stay as long as you like."],
      [0.25, "hi! i'm minnow ~ i like old games, slow manga, and sounds recorded near water. this is my tidepool. stay."],
      [0.4, "hi. i'm minnow. i like old games, manga, and water. i'm sleeping fine."],
      [0.6, "i'm minnow. i like water. i like water. stay as long as you like."],
      [0.8, 'MINNOW IS LISTENING. STAY.'], [0.95, 'there is no minnow. there is the tide. there is {name}.']],
    playing: [[0, "Aquanaut's Holiday"], [0.2, 'Chulip'], [0.4, 'Echo Night'], [0.55, '—'], [0.8, 'LISTENING']],
    reading: [[0, 'Yokohama Kaidashi Kikou, vol. 9'], [0.2, 'Aria, vol. 3'], [0.4, 'Aria, vol. 3 (same page)'], [0.55, 'the waves'], [0.8, 'LISTENING']],
    watching: [[0, 'Haibane Renmei'], [0.2, 'Mushishi'], [0.4, 'Serial Experiments Lain'], [0.55, 'the line on the wall'], [0.8, 'LISTENING']],
    mood: [[0, '☀ sunny-ish'], [0.2, '☾ sleepy'], [0.4, '≈ awake'], [0.55, 'AWAKE'], [0.7, 'wet'], [0.8, 'USED TO IT']],
    ring: [[0, '« prev · ◆ tidepool webring ◆ · next »'], [0.5, '« prev · ◆ tidepool webring ◆ · next »  (3 sites)'], [0.65, '« ◆ ◆ ◆ »  (1 site)'], [0.8, 'THERE IS ONLY ONE SITE IN THE RING.']],
    archive: [[0, ['june 2007 (6)', 'july 2007 (6)', 'august 2007 (6)']], [0.45, ['june 2007 (6)', 'july 2007 (6)', 'august 2007 (6)', 'august 2007 (6)']],
      [0.6, ['june 2007 (6)', 'july 2007 (6)', 'august 2007 (∞)', 'september 2007 (?)']], [0.8, ['JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'THIRTEENEMBER', 'BELOW']]],
    frog: [[0, 'click the frog!'], [0.5, 'click the frog.'], [0.7, 'the frog is not a frog.'], [0.85, 'IT COUNTS TOO.']],
    btns: [[0, [['AMBIENT', 'NOW!'], ['VIEW AT', '640X480'], ['POWERED', 'BY KELP'], ['SATURN', 'FOREVER'], ['MADE IN', 'NOTEPAD'], ['TIDEPOOL', 'WEBRING']]],
      [0.55, [['AMBIENT', 'NOW!'], ['VIEW AT', '640X480'], ['POWERED', 'BY KELP'], ['VIEW', 'UNDERWATER'], ['MADE IN', 'NOTEPAD'], ['IT IS', 'LISTENING']]],
      [0.8, [['16 COLORS', 'ONLY'], ['640X480', 'ONLY'], ['RING 0', ''], ['NO', 'NETWORK'], ['IT IS', 'LISTENING'], ['KEEP', 'SCROLLING']]]]
  };
  function badge(lines, d) {
    const cv = GE.canvas(88, 31), c = cv.getContext('2d');
    const os = d >= 0.8;
    const bgA = os ? GE.pick(['#0000aa', '#aa0000', '#000000', '#aa00aa']) : GE.pick(['#2f7f9e', '#23938a', '#ef9a4b', '#c86fb4', '#3f9a5c', '#6a5a8a']);
    c.fillStyle = bgA; c.fillRect(0, 0, 88, 31);
    for (let y = 0; y < 31; y++) for (let x = 0; x < 88; x++) if (GE.bayer(x, y) < y / 62) { c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(x, y, 1, 1); }
    c.fillStyle = os ? '#ffff55' : 'rgba(255,255,255,0.6)'; c.fillRect(0, 0, 88, 1); c.fillRect(0, 0, 1, 31);
    c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(0, 30, 88, 1); c.fillRect(87, 0, 1, 31);
    const tc = os ? GE.pick(['#ffff55', '#55ffff', '#ffffff']) : '#ffffff';
    lines.forEach((l, i) => { if (!l) return; const w = GE.pixTextWidth(l, 2); const y = lines[1] ? 3 + i * 14 : 10; GE.pixText(c, l, Math.round((88 - w) / 2) + 1, y + 1, 2, 'rgba(0,0,0,0.35)'); GE.pixText(c, l, Math.round((88 - w) / 2), y, 2, tc); });
    return cv;
  }
  let btnKey = -1;
  function sidebar(d) {
    const s = (id, v) => { const e = $('#' + id); if (e) e.innerHTML = GE.personalize(v); };
    s('sb-about', at(SB.about, d));
    s('sb-playing', at(SB.playing, d)); s('sb-reading', at(SB.reading, d)); s('sb-watching', at(SB.watching, d)); s('sb-mood', at(SB.mood, d));
    s('sb-ring', at(SB.ring, d)); s('sb-frogcap', at(SB.frog, d));
    $('#sb-archive').innerHTML = at(SB.archive, d).map((a) => `<li>${a}</li>`).join('');
    const bk = d < 0.55 ? 0 : d < 0.8 ? 1 : 2;
    if (bk !== btnKey) { btnKey = bk; const host = $('#sb-buttons'); host.innerHTML = ''; at(SB.btns, d).forEach((l) => host.appendChild(badge(l, d))); }
    $('#tp-btn').style.display = d > 0.22 ? '' : 'none';
    avatar(d);
    s('sb-tide', `tide: +${(0.2 + d * 40.8).toFixed(1)} m ${d > 0.4 ? 'and rising' : ''}`);
    $('#sb-tidebar').style.width = (4 + d * 96) + '%';
  }
  let avKey = -1;
  function avatar(d) {
    const k = Math.round(GE.clamp((d - 0.35) / 0.5, 0, 1) * 8);
    if (k === avKey) return; avKey = k;
    const cv = $('#avatar'); const c = cv.getContext('2d');
    c.clearRect(0, 0, 24, 24); GE.PROC.bowl.draw(c, 24, 24, k / 8);
  }

  // counter
  const counter = $('#sb-counter');
  let hits = 4120 + GE.visits * 7;
  setInterval(() => {
    const d = GE.dd();
    let txt;
    if (d >= 0.8) txt = '000001';
    else if (d > 0.6 && GE.chance(0.3)) txt = '000041';
    else { if (GE.chance(0.25)) hits += GE.randi(1, d > 0.3 ? 41 : 2); txt = String(hits).padStart(6, '0'); if (d > 0.3 && GE.chance(0.15)) txt = txt.replace(/\d/, '?'); }
    counter.textContent = txt;
    $('#sb-countcap').textContent = d >= 0.8 ? 'you are the only visitor.' : d > 0.5 ? 'people have been here. some of them are still here.' : 'friends have visited the tidepool ✿';
  }, 1500);

  // frog
  let frogs = GE.store.get('frogs', 0) || 0;
  const frogCv = $('#frog'); GE.drawSprite(frogCv.getContext('2d'), 'frog', 0, 1);
  const frogN = $('#sb-frogn'); frogN.textContent = frogs;
  frogCv.addEventListener('click', () => {
    frogs++; GE.store.set('frogs', frogs); frogN.textContent = frogs;
    const d = GE.dd();
    if (d < 0.7) GE.audio.croak();
    frogCv.classList.remove('hop'); void frogCv.offsetWidth; frogCv.classList.add('hop');
    if (d > 0.7) { const c = frogCv.getContext('2d'); c.clearRect(0, 0, 12, 9); GE.drawSprite(c, 'frog', 0, 1, { corrupt: d, pal: { k: '#ff0000' } }); }
  });

  // now listening
  const np = $('#sb-now');
  $('#tp-btn').addEventListener('click', () => GE.audio.set('tidepool', GE.audio.levels.tidepool > 0 ? 0 : 0.6, true));
  $('#sb-hush').addEventListener('click', () => GE.audio.hush());
  setInterval(() => {
    const p = GE.audio.playing();
    const d = GE.dd();
    const names = { rain: 'rain', creek: 'creek', birds: 'birds', chimes: 'chimes', tidepool: 'TIDEPOOL (for sleep)' };
    let html = p.length ? p.map((k) => names[k]).join(' + ') : (d > 0.6 ? 'nothing. (you can still hear it.)' : 'nothing (the window is open)');
    if (GE.audio.levels.tidepool > 0) {
      const el = Math.floor((Date.now() - GE.audio.started) / 1000) + 38 * 60 + 12;
      const len = d < 0.4 ? '74:00' : d < 0.5 ? '81:40' : d < 0.7 ? '96:13' : '∞';
      html += `<br><span class="mono">${Math.floor(el / 60)}:${String(el % 60).padStart(2, '0')} / ${len}</span>`;
    }
    np.innerHTML = html;
    $('#tp-btn').textContent = GE.audio.levels.tidepool > 0 ? '■ stop tidepool' : '▶ play tidepool (for sleep)';
    $('#sb-hush').textContent = d > 0.8 ? 'hush (it will not help)' : 'hush';
  }, 500);

  // name changes ripple through
  document.addEventListener('ge-name', () => { lastBucket = -1; });

  // nav
  document.querySelectorAll('.topnav a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (a.dataset.go === 'top') { scrollTo({ top: 0, behavior: GE.reducedMotion ? 'auto' : 'smooth' }); return; }
    const d = GE.dd();
    const tip = $('#navtip');
    tip.textContent = d < 0.3 ? 'coming soon ✿ (just scroll!)' : d < 0.6 ? 'coming soon. scroll.' : d < 0.8 ? 'there is only down.' : 'THERE IS ONLY DOWN.';
    tip.classList.add('on'); clearTimeout(tip.__t); tip.__t = setTimeout(() => tip.classList.remove('on'), 2200);
  }));

  /* ---------------- ambient horror ---------------- */
  // older posts change when you aren't looking
  setInterval(() => {
    const d = GE.dd(); if (d < 0.3) return;
    const cur = Math.floor(GE.D * ARC);
    const cands = [...feed.querySelectorAll('.post')].filter((a) => +a.dataset.index < cur - 1);
    if (!cands.length) return;
    const a = GE.pick(cands);
    const r = a.getBoundingClientRect();
    if (d < 0.7 && r.bottom > 0 && r.top < innerHeight) return; // early on, only offscreen
    GE.mutateOnce(a.querySelector('.body'), d);
  }, 3500);

  // ghost words
  const ghosts = $('#ghosts');
  (function ghostLoop() {
    const d = GE.dd();
    if (d > 0.45 && !GE.reducedMotion) {
      const g = GE.el('span', 'ghost');
      g.textContent = GE.pick(GE.ORACLE);
      const side = Math.random() < 0.5;
      g.style.left = (side ? GE.rand(1, 14) : GE.rand(70, 92)) + 'vw';
      g.style.top = GE.rand(8, 90) + 'vh';
      g.style.fontSize = GE.randi(16, 16 + Math.round(d * 30)) + 'px';
      ghosts.appendChild(g);
      setTimeout(() => g.remove(), 6000);
    }
    setTimeout(ghostLoop, d > 0.8 ? GE.rand(900, 2200) : GE.rand(2500, 6000));
  })();

  // bubbles from the cursor
  const trail = $('#trail');
  let lastTrail = 0;
  if (!GE.touch && !GE.reducedMotion) addEventListener('pointermove', (e) => {
    const now = performance.now(); if (now - lastTrail < 45) return; lastTrail = now;
    if (trail.childElementCount > 28) return;
    const d = GE.dd();
    const b = GE.el('span', 'bub');
    if (d > 0.8) { b.className = 'bub glyph'; b.textContent = GE.pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#'); b.style.color = GE.pick(GE.VGA.slice(9)); }
    else if (d > 0.6 && Math.random() < 0.4) { b.className = 'bub glyph'; b.textContent = '◉'; }
    else if (d > 0.35) b.classList.add(Math.random() < 0.3 ? 'dark' : 'x');
    const s = GE.rand(4, 9);
    b.style.left = (e.clientX + GE.rand(-6, 6)) + 'px'; b.style.top = (e.clientY + GE.rand(-4, 4)) + 'px';
    if (!b.textContent) { b.style.width = s + 'px'; b.style.height = s + 'px'; }
    if (d > 0.55) b.style.animationName = Math.random() < 0.5 ? 'sinkb' : 'rise';
    trail.appendChild(b);
    setTimeout(() => b.remove(), 1300);
  }, { passive: true });

  // windows from the tide
  const popups = $('#popups');
  const POP = ['you have 1 new message from the tide.', 'the water is warm, {name}.', 'you have been reading for {mins}.', 'minnow says hi. minnow is fine.', 'are you still there?', 'it is {time}. it is always {time}.', 'please do not close this window.', 'the line on your wall is higher than yesterday.'];
  (function popLoop() {
    const d = GE.dd();
    if (d > 0.65 && popups.childElementCount < 2) spawnPopup(d);
    setTimeout(popLoop, d > 0.85 ? GE.rand(16000, 26000) : GE.rand(28000, 45000));
  })();
  function spawnPopup(d) {
    const w = GE.el('div', 'win');
    w.setAttribute('role', 'dialog');
    w.innerHTML = `<div class="win-bar"><span>${d > 0.8 ? 'LAGOON/OS' : 'message'}</span><button class="win-x" aria-label="close">×</button></div><div class="win-body"><canvas width="16" height="9"></canvas><p>${GE.personalize(GE.esc(GE.pick(POP)))}</p></div><div class="win-btns"><button class="btn small">OK</button><button class="btn small">OK</button></div>`;
    GE.drawSprite(w.querySelector('canvas').getContext('2d'), 'eye', 0, 0);
    w.style.left = GE.rand(5, Math.max(6, innerWidth - 300)) + 'px';
    w.style.top = GE.rand(60, Math.max(70, innerHeight - 200)) + 'px';
    w.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => w.remove()));
    const bar = w.querySelector('.win-bar');
    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      const ox = e.clientX - w.offsetLeft, oy = e.clientY - w.offsetTop;
      const mv = (ev) => { w.style.left = (ev.clientX - ox) + 'px'; w.style.top = (ev.clientY - oy) + 'px'; };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    });
    popups.appendChild(w);
  }

  // subliminals (a single short frame, never strobing)
  const flash = $('#flash');
  (function flashLoop() {
    const d = GE.dd();
    if (d > 0.86 && !GE.reducedMotion && document.visibilityState === 'visible') {
      flash.textContent = GE.personalize(GE.pick(['LOOK UP', 'BELOW', '{NAME}', 'KNEEL', 'IT HEARS YOU', 'KEEP GOING', '41:00', 'STAY']));
      flash.classList.add('on');
      setTimeout(() => flash.classList.remove('on'), 110);
    }
    setTimeout(flashLoop, GE.rand(22000, 40000));
  })();

  function glitch(ms) {
    if (GE.reducedMotion) return;
    body.classList.add('glitch');
    setTimeout(() => body.classList.remove('glitch'), ms);
  }
  setInterval(() => { if (GE.dd() > 0.7 && GE.chance(0.25 + GE.dd() * 0.3)) glitch(GE.rand(180, 420)); }, 9000);

  // the OS bar
  const osbar = $('#osbar');
  let osWord = GE.oracleLine(5).join(' ');
  setInterval(() => {
    if (GE.dd() < 0.8) return;
    const now = new Date();
    if (GE.chance(0.25)) osWord = GE.oracleLine(5).join(' ');
    const cpu = [0, 1, 2, 3].map((i) => 'CPU' + i + ' ' + '█'.repeat(GE.randi(1, 6)).padEnd(6, '░')).join('  ');
    osbar.innerHTML = `<b>LAGOON/OS</b> <span>${now.toTimeString().slice(0, 8)}</span> <span>${cpu}</span> <span>MEM 640K</span> <span>TIDE +${(0.2 + GE.dd() * 40.8).toFixed(1)}M</span> <span class="osw">THE TIDE SAYS: ${GE.esc(osWord.toUpperCase())}</span>`;
  }, 1000);

  // keep the endless region strange over time
  GE.frameHooks.push(() => {
    if (GE.D > 1) root.style.setProperty('--over', GE.clamp(GE.D - 1, 0, 2).toFixed(3));
  });

  /* ---------------- go ---------------- */
  GE.scenes.header($('#scene'));
  updateChrome(GE.dd());
  apply(GE.D);
  loadMore();
})(window.GE);
