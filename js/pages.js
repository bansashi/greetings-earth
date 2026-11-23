/* the other rooms of the site. same frame, different page. */
(function (GE) {
  'use strict';
  const P = {};
  const esc = GE.esc;
  const back = '<p class="crumb"><a href="#" data-route="home">« back to the tidepool</a></p>';
  const uc = () => { const cv = GE.canvas(88, 31, 'uc'); const c = cv.getContext('2d'); c.fillStyle = '#ffd000'; c.fillRect(0, 0, 88, 31); c.fillStyle = '#111'; for (let x = -31; x < 88; x += 10) { c.beginPath(); c.moveTo(x, 31); c.lineTo(x + 5, 31); c.lineTo(x + 36, 0); c.lineTo(x + 31, 0); c.fill(); } c.fillStyle = '#ffd000'; c.fillRect(4, 8, 80, 15); GE.pixText(c, 'UNDER', 6, 9, 1, '#111'); GE.pixText(c, 'CONSTRUCTION', 6, 16, 1, '#111'); return cv; };

  /* ---------- about ---------- */
  P.about = (host, d) => {
    const row = (k, v) => `<tr><td>${k}</td><td>${v}</td></tr>`;
    const likes = d < 0.45 ? 'rain, old cartridges, the sound right before a thunderstorm, axolotls, scanlation groups who leave notes, slow manga, kankyō ongaku, the smell of a game store that is also a laundromat'
      : d < 0.7 ? 'rain, water, the sound right before, axolotls, slow, slower, the cd' : 'listening. listening. listening.';
    const dislikes = d < 0.45 ? 'loud ringtones, rushing, people who skip the opening of Mushishi' : d < 0.7 ? 'sleeping, mirrors that fog by themselves, the dry part of the room' : 'the surface';
    const faves = d < 0.55 ? "LSD: Dream Emulator, Aquanaut's Holiday, Mizzurna Falls, Echo Night, Chulip, Ecco" : 'Ecco (the part where you sing into the dark)';
    host.innerHTML = `${back}<h2>about me</h2>
      <p>${d < 0.5 ? "hi!! this is the about page. i never know what to put on these. here's a table:" : d < 0.8 ? "this is the about page. i don't know what to put here anymore." : 'THIS IS THE ABOUT PAGE. THERE IS NOTHING TO ABOUT.'}</p>
      <table class="profile">
        ${row('name', d < 0.85 ? 'minnow' : 'minnow (not available)')}
        ${row('age', d < 0.7 ? '22' : d < 0.85 ? '22 (i think)' : '41:00')}
        ${row('location', d < 0.5 ? 'a rainy town by a creek' : d < 0.8 ? 'by the creek' : 'below the line on the wall')}
        ${row('likes', esc(likes))}
        ${row('dislikes', esc(dislikes))}
        ${row('favorite games', esc(faves))}
        ${row('currently obsessed with', d < 0.25 ? 'making this site!!' : d < 0.5 ? 'a cd-r i found at a rummage sale' : 'TIDEPOOL (for sleep)')}
        ${row('my pets', d < 0.5 ? 'Professor Gill (fish), Bloop (axolotl, website), a frog in the sidebar' : d < 0.8 ? 'Bloop (bigger)' : 'it')}
        ${row('contact', d < 0.6 ? 'minnow [at] this website. or leave a comment!! or the shoutbox!!' : 'i do not check email anymore. leave a comment. i will hear it.')}
      </table>
      <h3>why this site exists</h3>
      <p>${d < 0.3 ? "i wanted a place on the internet that felt like a tidepool: small, quiet, full of little things you only notice if you crouch down. no ads. no feeds. just stuff i like, arranged nicely, for whoever wanders in. that's it. that's the whole plan."
        : d < 0.55 ? "i wanted a place on the internet that felt like a tidepool. small. quiet. that's still the plan. i think it's still the plan."
          : d < 0.8 ? "i wanted a place that felt like a tidepool. i don't remember what i meant by that. a tidepool is just the part of the sea that got left behind. it waits for the tide to come back."
            : 'the tide came back.'}</p>`;
  };

  /* ---------- shrines ---------- */
  const SHRINES = {
    ecco: { title: 'ecco the dolphin shrine', sprite: 'gill', closeAt: 0.74,
      body: () => `<p>a shrine to <i>Ecco the Dolphin</i> (Sega Genesis, 1992), created by Ed Annunziata and developed by Novotrade. the loneliest game i know.</p>
        <h3>facts</h3><ul><li>your pod is taken in the first minutes of the game, by a storm that pulls everything up out of the sea.</li><li>you use sonar to talk, to see, and to read the glyphs, big crystals that hold memories.</li><li>you have to go up for air. the game never lets you forget it.</li><li>it is famous for being hard. it is also very quiet.</li></ul>
        <h3>favorite levels</h3><ul><li>Home Bay (before anything happens)</li><li>The Undercaves</li><li>The Marble Sea</li><li>The Library (a whole level that is just remembering)</li><li>Welcome to the Machine</li></ul>
        <h3>quotes i like</h3><p><i>(i'll type these up later)</i></p>` },
    yoshimura: { title: 'hiroshi yoshimura shrine', sprite: 'wave', closeAt: 0.74,
      body: () => `<p>a small shrine to Hiroshi Yoshimura (1940–2003), who made music for rooms, gardens, train stations and model homes, music that leaves space for the room to be in it.</p>
        <h3>records i love</h3><ul><li><b>Music for Nine Postcards</b> (1982). written for the Hara Museum of Contemporary Art in Tokyo. i put it on when i draw.</li><li><b>Green</b> (1986). like sitting inside a fern.</li><li><b>Surround</b> (1986). made for a prefab house company to play in their model homes. the most beautiful commercial ever made.</li><li><b>Wet Land</b> (1993). water, standing still.</li></ul>
        <h3>how to listen</h3><p>don't. let it be in the room with you while you do something else. that's the point.</p>` },
    ykk: { title: 'yokohama kaidashi kikou shrine', sprite: 'shell', closeAt: 0.9,
      body: () => `<p>a shrine to <i>Yokohama Kaidashi Kikou</i> by Hitoshi Ashinano, serialized from 1994 to 2006. 14 volumes. every one of them a quiet afternoon.</p>
        <h3>people</h3><ul><li><b>Alpha</b> — a robot who runs Café Alpha while her owner is away. he has been away a long time.</li><li><b>Kokone</b> — her friend, who delivers coffee and visits when she can.</li><li><b>Ojisan</b> — the old man at the gas station, who has watched the coast change his whole life.</li><li><b>Takahiro &amp; Makki</b> — kids who grow up over the course of the series while Alpha doesn't.</li></ul>
        <h3>why i love it</h3><p>because the end of the world happens so slowly that everyone gets to be kind about it.</p>` },
    bloop: { title: 'bloop shrine ♡', sprite: 'jelly', closeAt: 2,
      body: (d) => d < 0.6 ? `<p>a shrine to Bloop, the tidepool's axolotl. born june 18, 2007 (website years).</p><h3>bloop facts</h3><ul><li>favorite food: pellets, attention</li><li>favorite song: whatever you sing to him</li><li>he always smiles. it's how his face works.</li></ul>`
        : d < 0.85 ? `<p>a shrine to Bloop.</p><h3>bloop facts</h3><ul><li>favorite food: not food anymore</li><li>favorite song: the one under the waves</li><li>he always faces the window</li><li>he is bigger than the shrine</li></ul>` : '<p class="huge red center">LARGER</p>' },
    tide: { title: 'TIDEPOOL (for sleep) shrine', sprite: 'cdr', openAt: 0.53,
      body: (d) => `<p>a shrine to the cd. everything i know.</p>
        <table class="timeline"><tr><th>night</th><th>length</th><th>breaths at</th></tr>
        <tr><td>1</td><td>74:00</td><td>41:00</td></tr><tr><td>2</td><td>74:00</td><td>41:00</td></tr><tr><td>9</td><td>81:40</td><td>41:00, 52:00</td></tr><tr><td>11</td><td>82:15</td><td>41:00, 52:00, 63:00, 74:00</td></tr><tr><td>14</td><td>96:13</td><td>every 11 minutes</td></tr><tr><td>?</td><td>∞</td><td>∞</td></tr></table>
        <h3>transcriptions</h3><blockquote class="words">keel. vestibule. untie. carpet. minnow. upward. gills. sixteen. lantern. down. down. down. hallway. keep.</blockquote>
        ${d > 0.7 ? `<blockquote class="words big">${esc(GE.oracleLine(14).join('. '))}.</blockquote>` : ''}
        <h3>where it came from</h3><p>an estate. "from out by the water." nobody at the church remembers whose.</p>` }
  };
  P.shrines = (host, d) => {
    const list = Object.keys(SHRINES).filter((k) => !SHRINES[k].openAt || d >= SHRINES[k].openAt);
    host.innerHTML = `${back}<h2>${d < 0.85 ? 'shrines' : 'SHRINE'}</h2>
      <p>${d < 0.5 ? 'little pages for things i love. most of them are not finished. that is how shrines work.' : d < 0.85 ? 'little pages for things i loved.' : 'there is one shrine. the others have been moved below.'}</p>
      <ul class="shrine-list"></ul>`;
    const ul = host.querySelector('.shrine-list');
    list.forEach((k) => {
      const s = SHRINES[k];
      const closed = (s.closeAt && d >= s.closeAt) || (d >= 0.85 && k !== 'tide');
      const li = GE.el('li', closed ? 'closed' : '');
      const cv = document.createElement('canvas'); cv.dataset.sprite = s.sprite; cv.dataset.scale = '4';
      li.appendChild(cv);
      const t = GE.el('div');
      t.innerHTML = closed ? `<b>${esc(s.title)}</b><br><span class="small">(closed)</span>` : `<a href="#shrine-${k}" data-route="shrine-${k}"><b>${esc(s.title)}</b></a><br><span class="small">${k === 'tide' ? 'updated constantly' : 'under construction'}</span>`;
      li.appendChild(t); ul.appendChild(li);
      GE.mountSprite(cv, closed ? 1 : 0);
      cv.style.width = '64px';
    });
  };
  P.shrine = (host, d, k) => {
    const s = SHRINES[k];
    if (!s || (s.openAt && d < s.openAt)) return P.notfound(host, d, '/shrines/' + k + '/');
    if ((s.closeAt && d >= s.closeAt) || (d >= 0.85 && k !== 'tide')) {
      host.innerHTML = `${back}<h2>${esc(s.title)}</h2><p>this shrine has been ${d >= 0.85 ? 'moved below' : 'closed'}.</p>`;
      return;
    }
    host.innerHTML = `<p class="crumb"><a href="#shrines" data-route="shrines">« shrines</a></p><h2>${esc(s.title)}</h2>`;
    if (k !== 'tide') host.appendChild(uc());
    const b = GE.el('div'); b.innerHTML = s.body(d); host.appendChild(b);
    host.appendChild(GE.el('p', 'small', k === 'tide' ? 'this shrine is complete. this shrine will never be complete.' : 'last edited ' + (d < 0.4 ? 'june' : 'july') + ' 2007. more soon!!'));
  };

  /* ---------- links ---------- */
  const FRIENDS = [['sakura_fishy\'s buttons', 'SAKURA', 'FISHY', '#ff8fb8', 'cute buttons + stamps, will link exchange'], ['56k warrior', '56K', 'WARRIOR', '#555577', 'old game reviews, extremely long'],
    ["mossbat's cave", 'MOSSBAT', 'CAVE', '#3f6a4a', 'field recordings & bats. my best friend'], ['~pearl~ diary', 'PEARL', 'DIARY', '#c8a8f0', 'homework playlists'], ["kappa's game log", 'KAPPA', 'GAMES', '#e8893a', 'every game kappa plays, with stars']];
  P.links = (host, d) => {
    host.innerHTML = `${back}<h2>links</h2><p>${d < 0.6 ? 'cool sites made by cool people. go visit them!!' : d < 0.85 ? 'cool sites. some of them are gone.' : 'there is only one site.'}</p><ul class="linklist"></ul>
      <h3>link to me!</h3><p>please don't hotlink, save the button to your own space ✿</p>
      <div class="lm"></div>
      <textarea class="linkcode" readonly aria-label="code to link to this site">&lt;a href="http://tidepool.example/"&gt;&lt;img src="tidepool.gif" alt="greetings, earth!"&gt;&lt;/a&gt;</textarea>`;
    const ul = host.querySelector('.linklist');
    FRIENDS.forEach((f, i) => {
      const li = GE.el('li');
      li.appendChild(GE.widgets.badge([f[1], f[2]], d >= 0.85 ? '#000000' : f[3]));
      const t = GE.el('div');
      const dead = d >= 0.66 && i !== 2;
      t.innerHTML = `<a href="#404-${i}" data-route="404-${i}">${esc(f[0])}</a><br><span class="small">${dead ? '(dead link)' : esc(f[4])}</span>`;
      li.appendChild(t); ul.appendChild(li);
    });
    host.querySelector('.lm').appendChild(GE.widgets.badge(['GREETINGS', 'EARTH!'], '#23938a'));
  };

  /* ---------- guestbook ---------- */
  P.guestbook = (host, d) => {
    host.innerHTML = `${back}<h2>${d < 0.8 ? 'guestbook' : 'GUESTBOOK'}</h2><p>${d < 0.5 ? 'thank you for visiting the tidepool!! please sign my guestbook ✿ no spam pls' : d < 0.8 ? 'please sign my guestbook. i will remember you.' : 'I REMEMBER EVERYONE.'}</p>`;
    const g = GE.el('div'); host.appendChild(g);
    GE.social.guestbook(g, {});
  };

  /* ---------- the listening room (late nav item) ---------- */
  P.listen = (host) => {
    host.innerHTML = `${back}<h2>LISTEN</h2><div class="toy" data-toy="terminal"></div><div class="toy" data-toy="oracle"></div>`;
    GE.mountToys(host);
  };

  /* ---------- hidden: an index ---------- */
  const FILES = {
    'tidepool.wav': () => 'binary file. cannot display.\n\n(it is playing anyway.)',
    '41.txt': () => '41:00\n52:00\n63:00\n74:00\n85:00\n96:00\n...\nevery eleven minutes. laps.',
    'transcripts.txt': () => 'night 1: keel. vestibule. untie. carpet. minnow. upward. gills. sixteen. lantern. down. down. down. hallway. keep.\n\nnight 2: ' + GE.oracleLine(12).join('. ') + '.\n\nnight 3: ' + GE.oracleLine(12).join('. ').toUpperCase() + '.',
    'todo_old.txt': () => '- make a little website\n- put the things i love on it\n- make it feel like a tidepool\n- small, quiet\n- for whoever wanders in',
    'you.txt': () => { const n = new Date(); return `name: ${GE.getName() || '(not given. it does not matter.)'}\nlocal time: ${GE.fmtTime(n)}, ${GE.DAYS[n.getDay()]}\nwindow: ${innerWidth}x${innerHeight}\nvisits: ${GE.visits}\nminutes here: ${GE.minutesHere()}\nstatus: still reading`; },
    'mossbat_voicemail.txt': () => '"minnow it\'s me again. i\'m outside. the door\'s open. i can hear the water from the hallway. i\'m coming in, ok? i\'m coming in."'
  };
  P.below = (host, d) => {
    const size = (74 + Math.round(GE.dd() * 4000)) + 'M';
    const rows = [['../', '', '-'], ['minnow/', '03-Sep-2007 04:04', '-'], ['tidepool.wav', '08-Jul-2007 23:59', size], ['41.txt', '12-Aug-2007 03:47', '1K'],
      ['transcripts.txt', '31-Aug-2007 ??:??', '4K'], ['todo_old.txt', '01-Jun-2007 13:20', '1K'], ['mossbat_voicemail.txt', '04-Sep-2007 21:12', '1K'], ['you.txt', new Date().toDateString().slice(4).replace(/ /g, '-') + ' ' + GE.fmtTime(new Date()), '1K']];
    const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));
    host.innerHTML = `<div class="index"><h1>Index of /below</h1><hr><pre>${pad('Name', 26)}${pad('Last modified', 22)}Size\n<hr>${rows.map(([n, t, s]) => `<a href="#below/${esc(n)}" data-route="below/${esc(n)}">${esc(n)}</a>${' '.repeat(Math.max(1, 26 - n.length))}${pad(t, 22)}${s}`).join('\n')}</pre><hr><address>Apache/2.2.4 (Unix) Server at tidepool Port 80</address></div>`;
  };
  P.belowfile = (host, d, f) => {
    if (f === 'minnow/') { host.innerHTML = `<div class="index"><h1>Index of /below/minnow</h1><hr><pre><a href="#below" data-route="below">../</a>\n\n(this directory is full of water.)</pre><hr></div>`; return; }
    if (f === '../') { GE.router.go('home'); return; }
    const fn = FILES[f];
    if (!fn) return P.notfound(host, d, '/below/' + f);
    host.innerHTML = `<div class="index"><p><a href="#below" data-route="below">« /below</a></p><pre></pre></div>`;
    host.querySelector('pre').textContent = fn();
  };

  /* ---------- 404 ---------- */
  P.notfound = (host, d, path) => {
    const extra = d >= 0.66 ? '<p>Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request.</p>' : '';
    host.innerHTML = `<div class="notfound"><h1>Not Found</h1><p>The requested URL ${esc(path)} was not found on this server.</p>${extra}<hr><address>Apache/2.2.4 (Unix) Server at ${esc(path.split('/')[1] || 'localhost')} Port 80</address></div><p class="crumb"><a href="#" data-route="home">« back to the tidepool</a></p>`;
  };

  /* ---------- router ---------- */
  const blog = document.getElementById('blog'), page = document.getElementById('page');
  let blogScroll = 0, current = 'home';
  function render(route) {
    const d = GE.dd();
    page.innerHTML = '';
    if (route === 'about') P.about(page, d);
    else if (route === 'shrines') P.shrines(page, d);
    else if (route.indexOf('shrine-') === 0) P.shrine(page, d, route.slice(7));
    else if (route === 'links') P.links(page, d);
    else if (route === 'guestbook') P.guestbook(page, d);
    else if (route === 'listen') P.listen(page, d);
    else if (route === 'below') P.below(page, d);
    else if (route.indexOf('below/') === 0) P.belowfile(page, d, decodeURIComponent(route.slice(6)));
    else if (route.indexOf('404-') === 0) P.notfound(page, d, '/~' + ['sakura', 'dan', 'mossbat', 'pearl', 'kappa'][+route.slice(4)] + '/');
    else P.notfound(page, d, '/' + route);
  }
  function show(route) {
    route = route || 'home';
    if (route === current && route !== 'home') { render(route); return; }
    if (current === 'home') blogScroll = window.scrollY;
    current = route;
    document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('here', a.dataset.route === route || (route.indexOf('shrine') === 0 && a.dataset.route === 'shrines')));
    if (route === 'home') {
      page.hidden = true; page.innerHTML = ''; blog.hidden = false;
      window.scrollTo(0, blogScroll);
      return;
    }
    blog.hidden = true; page.hidden = false;
    render(route);
    const top = document.getElementById('columns').getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.min(window.scrollY, top));
  }
  GE.router = {
    go(route) { const h = route === 'home' ? '' : '#' + route; if (location.hash !== h) { if (h) location.hash = h; else history.pushState(null, '', location.pathname + location.search); } show(route); },
    current: () => current
  };
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
  window.addEventListener('popstate', () => show(location.hash.slice(1)));
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('[data-route]');
    if (!a) return;
    e.preventDefault();
    GE.router.go(a.dataset.route);
  });
  GE.router.start = () => { if (location.hash.length > 1) show(location.hash.slice(1)); };
})(window.GE);
