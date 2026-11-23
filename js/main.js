/* the engine. the template stays; what it holds comes apart. */
(function (GE) {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const feed = $('#feed'), loader = $('#loader'), sentinel = $('#sentinel'), root = document.documentElement;
  const ARC = GE.ARC;

  /* ---------- fixed decoration (generated once, never changes) ---------- */
  (function decorate() {
    const t = GE.canvas(64, 64), c = t.getContext('2d');
    const col = '#bfe3d6';
    [[8, 10], [40, 6], [24, 30], [52, 40], [12, 50], [36, 56]].forEach(([x, y]) => { c.fillStyle = col; c.fillRect(x, y - 1, 1, 1); c.fillRect(x - 1, y, 1, 1); c.fillRect(x + 1, y, 1, 1); c.fillRect(x, y + 1, 1, 1); });
    c.fillStyle = '#b4dccd'; c.fillRect(30, 18, 2, 1); c.fillRect(31, 17, 1, 3); c.fillRect(56, 22, 1, 1);
    root.style.setProperty('--tile', `url(${t.toDataURL()})`);
    const dv = GE.canvas(48, 8), dc = dv.getContext('2d');
    for (let x = 0; x < 48; x++) { const y = 3 + Math.round(Math.sin(x / 48 * Math.PI * 4) * 2); dc.fillStyle = '#6ec6d9'; dc.fillRect(x, y, 1, 1); dc.fillStyle = '#bfe9f2'; dc.fillRect(x, y + 1, 1, 1); }
    dc.fillStyle = '#e8893a'; dc.fillRect(22, 1, 3, 1); dc.fillRect(21, 2, 5, 1); dc.fillRect(22, 3, 3, 1);
    root.style.setProperty('--divider', `url(${dv.toDataURL()})`);
    const fav = GE.canvas(32, 32), fc = fav.getContext('2d');
    GE.disc(fc, 16, 16, 15, 15, '#6ec6d9'); GE.drawSprite(fc, 'gill', 4, 11, { scale: 1.5 });
    $('#favicon').href = fav.toDataURL();
    GE.drawSprite($('#splash-fish').getContext('2d'), 'gill', 0, 0);
    GE.widgets.construction();
  })();

  /* ---------- splash ---------- */
  const splash = $('#splash');
  let entered = false;
  try { entered = sessionStorage.getItem('ge:entered') === '1'; } catch (e) {}
  if (entered || location.hash.length > 1) splash.hidden = true;
  else if (GE.visits > 1 && GE.lastDepth > 0.5) $('#splash-text').textContent = 'you came back.';
  $('#enter').addEventListener('click', () => {
    splash.hidden = true;
    try { sessionStorage.setItem('ge:entered', '1'); } catch (e) {}
  });

  /* ---------- posts ---------- */
  const stageOf = (i) => i < 6 ? 0 : i < 12 ? 1 : i < 18 ? 2 : i < 24 ? 3 : i < 30 ? 4 : 5;
  let nextIndex = 0, endlessN = 0, loading = false, page = 0;

  function dateHeader(p) { return GE.personalize(p.date || '').replace(/&amp;/g, '&'); }
  function renderPost(p, index) {
    const st = stageOf(index);
    const lvl = p.level != null ? p.level : index / ARC;
    const H = GE.personalize;
    const art = document.createElement('article');
    art.className = 'post st' + st + (p.cls ? ' ' + p.cls : '');
    art.dataset.index = index;
    const meta = [];
    if (p.mood) meta.push(`current mood: <b>${H(p.mood)}</b>`);
    if (p.music) meta.push(`current music: <b>${H(p.music)}</b>`);
    const time = H(p.time || '').toUpperCase();
    art.innerHTML = `<div class="date-header">${dateHeader(p) || '&nbsp;'}</div>
      <h3 class="post-title">${H(p.title) || '(untitled)'}</h3>
      ${meta.length ? `<div class="post-meta">${meta.join(' &middot; ')}</div>` : ''}
      <div class="post-body">${H(p.body)}</div>
      <div class="post-footer">posted by minnow${time ? ' at ' + time : ''}${p.cat ? ' in <a href="#">' + GE.esc(p.cat) + '</a>' : ''}</div>`;
    const name = GE.getName();
    art.querySelectorAll('[data-if-name]').forEach((e) => { if (!name) e.remove(); });
    art.querySelectorAll('[data-if-noname]').forEach((e) => { if (name) e.remove(); });
    if (index === 0 && GE.visits > 1 && GE.lastDepth > 0.4) {
      const w = GE.el('p', 'tiny');
      w.innerHTML = H(`(welcome back${name ? ', {name}' : ''}. you were here before. you got very far down.)`);
      w.dataset.away = '(welcome back.)';
      art.querySelector('.post-body').appendChild(w);
    }
    GE.corruptDOM(art.querySelector('.post-body'), lvl);
    if (lvl > 0.5) GE.corruptDOM(art.querySelector('.post-title'), lvl * 0.7);
    art.querySelectorAll('canvas[data-sprite]').forEach((cv) => GE.mountSprite(cv, lvl));
    GE.mountToys(art);
    art.querySelectorAll('[data-away]').forEach((e) => awayIO && awayIO.observe(e));
    const foot = art.querySelector('.post-footer');
    foot.appendChild(GE.social.reactions(index, st));
    foot.appendChild(GE.social.commentsBlock(p, index, st, art.querySelector('.post-title').textContent));
    return art;
  }

  const awayIO = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting) el.__seen = true;
      else if (el.__seen && el.dataset.away) { el.textContent = el.dataset.away; delete el.dataset.away; awayIO.unobserve(el); }
    });
  }) : null;

  /* ---------- pagination ---------- */
  const LOAD_MSG = [['loading older posts…'], ['loading older posts…', 'loading…'], ['loading older posts…', 'still loading…'],
    ['loading older posts…', "loading older posts… (they're newer)", 'loading…', 'loading'], ['LOADING OLDER POSTS', 'LOADING'], ['loading older posts…', 'there are always older posts', 'loading']];
  function loadMore() {
    if (loading || $('#blog').hidden) return;
    loading = true;
    const st = stageOf(nextIndex);
    loader.classList.add('on');
    $('.load-text', loader).innerHTML = GE.personalize(GE.pick(LOAD_MSG[st]));
    let delay = st === 0 ? 600 : st <= 2 ? GE.rand(600, 1300) : GE.rand(500, 2200);
    if (nextIndex === 18) delay = 3000;
    setTimeout(() => {
      page++;
      if (page > 1) {
        const pg = GE.el('div', 'pager');
        const total = Math.ceil(ARC / 2);
        pg.textContent = `« newer posts · page ${page} of ${total} · older posts »`;
        feed.appendChild(pg);
      }
      for (let k = 0; k < 2; k++) {
        const p = nextIndex < ARC ? GE.POSTS[nextIndex] : GE.makeEndlessPost(endlessN++);
        feed.appendChild(renderPost(p, nextIndex));
        nextIndex++;
      }
      pruneEndless();
      loader.classList.remove('on');
      loading = false;
      requestAnimationFrame(() => { if (!$('#blog').hidden && sentinel.getBoundingClientRect().top < innerHeight + 900) loadMore(); });
    }, nextIndex === 0 ? 0 : delay);
  }
  function pruneEndless() { for (let k = 0; k < 4; k++) if (!pruneOne()) break; }
  function pruneOne() {
    const endless = [...feed.querySelectorAll('.post')].filter((a) => +a.dataset.index >= ARC + 2);
    if (endless.length <= 40) return false;
    const victim = endless[0];
    if (victim.getBoundingClientRect().bottom > 0) return false;
    const prev = victim.previousElementSibling;
    const h = victim.offsetHeight + (prev && prev.classList.contains('pager') ? prev.offsetHeight : 0);
    if (prev && prev.classList.contains('pager')) prev.remove();
    victim.remove();
    window.scrollBy(0, -h);
    return true;
  }
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { if (e[0].isIntersecting) loadMore(); }, { rootMargin: '0px 0px 900px 0px' }).observe(sentinel);
  window.addEventListener('hashchange', () => setTimeout(() => { if (!$('#blog').hidden && sentinel.getBoundingClientRect().top < innerHeight + 900) loadMore(); }, 50));

  /* ---------- derangement (only ever goes up) ---------- */
  function measure() {
    const mid = innerHeight * 0.5;
    let prog = 0;
    const posts = feed.querySelectorAll('.post');
    for (let i = 0; i < posts.length; i++) {
      const a = posts[i], r = a.getBoundingClientRect(), idx = +a.dataset.index;
      if (r.top <= mid && r.bottom >= mid) { prog = idx + (mid - r.top) / r.height; break; }
      if (r.bottom < mid) prog = idx + 1;
    }
    return prog / ARC;
  }
  let dirty = true;
  addEventListener('scroll', () => { dirty = true; }, { passive: true });
  addEventListener('resize', () => { dirty = true; });
  try { const q = new URLSearchParams(location.search).get('depth'); if (q) GE.D = GE.clamp(parseFloat(q) || 0, 0, 1.5); } catch (e) {}

  let lastBucket = -1;
  GE.frameHooks.push(() => {
    if (dirty && !$('#blog').hidden) { dirty = false; const raw = measure(); if (raw > GE.D) GE.D = raw; }
    const bucket = Math.floor(GE.D * 100);
    if (bucket !== lastBucket) {
      lastBucket = bucket;
      GE.refreshSprites();
      GE.widgets.update(GE.D);
      GE.store.set('maxDepth', Math.max(GE.store.get('maxDepth', 0) || 0, GE.dd()));
    }
  });
  document.addEventListener('ge-name', () => { lastBucket = -1; });

  /* ---------- sidebar bits with behaviour ---------- */
  GE.social.shoutbox($('#shoutbox'));
  const counter = $('#sb-counter');
  let hits = 4120 + GE.visits * 7;
  setInterval(() => {
    const d = GE.dd();
    let txt;
    if (d >= 0.85) txt = '000001';
    else if (d > 0.6 && GE.chance(0.3)) txt = '000041';
    else { if (GE.chance(0.25)) hits += GE.randi(1, d > 0.3 ? 41 : 2); txt = String(hits).padStart(6, '0'); }
    counter.textContent = txt;
    $('#sb-countcap').textContent = d >= 0.85 ? 'you are the only visitor.' : 'you are visitor #';
  }, 1500);

  let frogs = GE.store.get('frogs', 0) || 0;
  const frogCv = $('#frog'); GE.drawSprite(frogCv.getContext('2d'), 'frog', 0, 1);
  $('#sb-frogn').textContent = frogs;
  frogCv.addEventListener('click', () => {
    frogs++; GE.store.set('frogs', frogs); $('#sb-frogn').textContent = frogs;
    if (GE.dd() < 0.7) GE.audio.croak();
    frogCv.classList.remove('hop'); void frogCv.offsetWidth; frogCv.classList.add('hop');
  });

  $('#tp-btn').addEventListener('click', () => GE.audio.set('tidepool', GE.audio.levels.tidepool > 0 ? 0 : 0.6, true));
  $('#sb-hush').addEventListener('click', () => GE.audio.hush());
  setInterval(() => {
    const p = GE.audio.playing(), d = GE.dd();
    const names = { rain: 'rain', creek: 'creek', birds: 'birds', chimes: 'chimes', tidepool: 'TIDEPOOL (for sleep)' };
    let html = p.length ? p.map((k) => names[k]).join(' + ') : (d > 0.6 ? 'nothing. (you can still hear it.)' : 'nothing (the window is open)');
    if (GE.audio.levels.tidepool > 0) {
      const el = Math.floor((Date.now() - GE.audio.started) / 1000) + 38 * 60 + 12;
      const len = d < 0.4 ? '74:00' : d < 0.5 ? '81:40' : d < 0.7 ? '96:13' : '∞';
      html += `<br><span class="mono">${Math.floor(el / 60)}:${String(el % 60).padStart(2, '0')} / ${len}</span>`;
    }
    $('#sb-now').innerHTML = html;
    $('#tp-btn').style.display = d > 0.22 ? '' : 'none';
    $('#tp-btn').textContent = GE.audio.levels.tidepool > 0 ? '■ stop tidepool' : '▶ play tidepool (for sleep)';
  }, 500);
  let avKey = -1;
  GE.frameHooks.push(() => {
    const k = Math.round(GE.clamp((GE.dd() - 0.35) / 0.5, 0, 1) * 8);
    if (k === avKey) return; avKey = k;
    const c = $('#avatar').getContext('2d'); c.clearRect(0, 0, 24, 24); GE.PROC.bowl.draw(c, 24, 24, k / 8);
  });

  // mobile sidebar
  const sb = $('#sidebar'), tog = $('#sidebar-toggle');
  tog.addEventListener('click', () => { const o = sb.classList.toggle('open'); tog.setAttribute('aria-expanded', String(o)); tog.textContent = o ? 'sidebar ▴' : 'sidebar ▾'; });

  /* ---------- older posts change when you aren't looking ---------- */
  setInterval(() => {
    const d = GE.dd(); if (d < 0.3 || $('#blog').hidden) return;
    const cur = Math.floor(GE.D * ARC);
    const cands = [...feed.querySelectorAll('.post')].filter((a) => +a.dataset.index < cur - 1);
    if (!cands.length) return;
    const a = GE.pick(cands);
    const r = a.getBoundingClientRect();
    if (d < 0.7 && r.bottom > 0 && r.top < innerHeight) return;
    GE.mutateOnce(a.querySelector('.post-body'), d);
  }, 3500);

  /* ---------- the bubble cursor minnow installed in june ---------- */
  const trail = $('#trail');
  let lastTrail = 0;
  if (!GE.touch && !GE.reducedMotion) addEventListener('pointermove', (e) => {
    const now = performance.now(); if (now - lastTrail < 50) return; lastTrail = now;
    if (trail.childElementCount > 24) return;
    const b = GE.el('span', 'bub' + (GE.dd() > 0.6 && Math.random() < 0.3 ? ' dark' : ''));
    const s = GE.rand(4, 9);
    b.style.left = (e.clientX + GE.rand(-6, 6)) + 'px'; b.style.top = (e.clientY + GE.rand(-4, 4)) + 'px';
    b.style.width = s + 'px'; b.style.height = s + 'px';
    trail.appendChild(b);
    setTimeout(() => b.remove(), 1300);
  }, { passive: true });

  /* ---------- go ---------- */
  GE.scenes.header($('#scene'));
  GE.widgets.update(GE.D);
  GE.router.start();
  loadMore();
})(window.GE);
