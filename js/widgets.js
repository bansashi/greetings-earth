/* the sidebar and header text minnow keeps editing. layout never changes; the words do. */
(function (GE) {
  'use strict';
  const W = GE.widgets = {};
  const $ = (id) => document.getElementById(id);
  const at = (list, d) => { let v = list[0][1]; list.forEach((x) => { if (d >= x[0]) v = x[1]; }); return v; };
  W.at = at;

  const TAGLINE = [[0, 'a tidepool of small things'], [0.3, 'a tidepool of small things (under water)'], [0.5, 'a tidepool. the water is coming up slowly.'],
    [0.7, 'a tidepool. a tidepool. it is coming up slowly enough.'], [0.85, 'a listening room. 640×480. 16 colors.'], [1, 'a tidepool of small things']];
  const TITLE = [[0, 'greetings, earth! ~ a tidepool of small things'], [0.3, 'greetings, earth! ~ a tidepool'], [0.5, 'greetings, earth'], [0.7, 'greetings, earth (listening)'], [0.85, 'LISTEN'], [1, 'greetings, earth! ~ a tidepool of small things']];
  const MARQUEE = [
    [0, '~*~ welcome to the tidepool!! ~*~ please sign my guestbook ~*~ new: the rain machine (see sounds) ~*~ link exchanges welcome ~*~'],
    [0.2, '~*~ welcome to the tidepool ~*~ new: omikuji machine! ~*~ the guestbook is open!! ~*~ now listening: tidepool (for sleep) ~*~'],
    [0.4, '~*~ welcome to the tidepool ~*~ sorry for slow updates ~*~ does anyone know how long a cd-r can be ~*~'],
    [0.55, '~*~ welcome ~*~ welcome ~*~ is 41:00 a normal length for a breath ~*~ welcome ~*~'],
    [0.7, '~*~ please sign my guestbook ~*~ i will remember you ~*~ it is coming up slowly enough ~*~'],
    [0.82, '~*~ 640 BY 480 ~*~ SIXTEEN COLORS ~*~ NO NETWORK ~*~ RING ZERO ~*~ IT IS NOT A PROGRAM IT IS A PLACE ~*~'],
    [0.95, '~*~ welcome to the tidepool!! ~*~ please sign my guestbook ~*~ welcome {name} ~*~ you can stop scrolling ~*~ you won\'t ~*~']
  ];
  const ABOUT = [[0, "hi! i like old games nobody finished, slow manga, and sounds recorded near water. this is my tidepool. stay as long as you like ✿"],
    [0.25, "hi! i like old games, slow manga, and sounds recorded near water. this is my tidepool. stay ✿"],
    [0.45, "hi. i like old games, manga, and water. i'm sleeping fine."],
    [0.62, "i like water. i like water. stay as long as you like."],
    [0.8, 'minnow is listening.'], [0.95, 'there is no minnow. there is the tide. there is {name}.']];
  const WHERE = [[0, 'a rainy town by a creek'], [0.5, 'by the creek'], [0.7, 'in the creek'], [0.85, 'below the line on the wall']];
  const STATUS = [[0, ['☀ finally finished the guestbook!!', '2 days ago']], [0.15, ['☁ playing aquanaut\'s holiday before bed', 'yesterday']], [0.25, ['♫ sleeping to the tidepool cd. best sleep ever', '6 hours ago']],
    [0.38, ['≈ awake', '3:12 am']], [0.48, ['the tap was running', '2:58 am']], [0.55, ['listening', '4:04 am']], [0.65, ['listening', '1 minute ago']],
    [0.78, ['building the room', 'just now']], [0.88, ['listening properly', '0 seconds ago']], [1, ['', 'a moment from now']]];
  const CUR = {
    playing: [[0, "Aquanaut's Holiday"], [0.2, 'Chulip'], [0.4, 'Echo Night'], [0.55, '—'], [0.8, 'LISTENING']],
    reading: [[0, 'Yokohama Kaidashi Kikou, vol. 9'], [0.2, 'Aria, vol. 3'], [0.4, 'Aria, vol. 3 (same page)'], [0.55, 'the waves'], [0.8, 'LISTENING']],
    watching: [[0, 'Haibane Renmei'], [0.2, 'Mushishi'], [0.4, 'Serial Experiments Lain'], [0.55, 'the line on the wall'], [0.8, 'LISTENING']],
    mood: [[0, '☀ sunny-ish'], [0.2, '☾ sleepy'], [0.4, '≈ awake'], [0.55, 'AWAKE'], [0.7, 'wet'], [0.8, 'used to it']]
  };
  const UPDATES = [
    [0, 'jun 3', 'the tidepool is open!! hi!!'],
    [0.05, 'jun 12', 'added the rain machine (sounds)'],
    [0.12, 'jun 21', 'bloop moved in ♡'],
    [0.17, 'jun 27', 'pixel painter! it doesn\'t save, on purpose'],
    [0.22, 'jul 8', 'new widget: now listening'],
    [0.3, 'jul 19', 'omikuji machine'],
    [0.36, 'jul 29', 'GUESTBOOK IS UP. sign it pls'],
    [0.38, 'jul 30', 'shoutbox!! say hi'],
    [0.42, 'aug 3', 'added the creek'],
    [0.47, 'aug 12', 'removed the now listening widget'],
    [0.48, 'aug 12', 'put it back'],
    [0.53, 'aug 19', 'new shrine: transcriptions'],
    [0.58, 'aug 23', 'unplugged the stereo. the widget still works'],
    [0.62, 'aug 26', "i don't remember adding the shouts from \"you\""],
    [0.7, 'sep 1', 'back to normal posting!! :)'],
    [0.74, 'sep ?', 'closed the ecco shrine. closed the yoshimura shrine.'],
    [0.82, 'sep ?', 'fixed the sun in the banner. it was wrong.'],
    [0.86, 'sep 31', 'added a link to the listening room'],
    [0.9, '∞', 'the site is the room now'],
    [0.98, '∞', 'minnow is not available.']
  ];
  const TODO = [
    [0, [['guestbook', 0], ['finish ecco shrine', 0], ['link exchange w/ sakura', 0], ['make a favicon', 1], ['fix the fish', 1]]],
    [0.36, [['guestbook', 1], ['finish ecco shrine', 0], ['link exchange w/ sakura', 0], ['give mossbat the hydrophone back', 0], ['sleep', 0]]],
    [0.55, [['finish ecco shrine', 0], ['give mossbat the hydrophone back', 0], ['call mossbat back', 0], ['sleep', 0], ['sleep', 0]]],
    [0.72, [['sleep', 0], ['sleep', 0], ['remember what this site was for', 0], ['listen', 1], ['listen', 1], ['listen', 1]]],
    [0.86, [['LISTEN', 1], ['LISTEN', 1], ['LISTEN', 1], ['LISTEN', 1], ['LISTEN', 1], ['LISTEN', 1], ['LISTEN', 1]]]
  ];
  const BLOGS = [
    ['sakura_fishy\'s buttons', [[0, ['new stamps!! ✿', '1 day ago']], [0.42, ["minnow's site is being weird lol", '3 days ago']], [0.66, ['taking a break from the webring', '12 days ago']], [0.85, ['taking a break from the webring', '41 days ago']]]],
    ['56k warrior', [[0, ['review: Klonoa (PS1)', '2 days ago']], [0.5, ['link rot, and why your favorite sites will die', '4 days ago']], [0.8, ['link rot, and why your favorite sites will die', '29 days ago']]]],
    ["mossbat's cave", [[0, ['field recording: the train yard', '3 days ago']], [0.45, ['lending out my hydrophone was a mistake?', '1 day ago']], [0.6, ['has anyone heard from minnow', '5 hours ago']], [0.8, ['i went to her apartment', '2 hours ago']]]],
    ['~pearl~ diary', [[0, ['summer homework playlist', '5 days ago']], [0.55, ['hiatus', '9 days ago']], [0.8, ['[this blog has been removed]', '']]]],
    ["kappa's game log", [[0, ['echo night 2 > echo night (fight me)', '1 day ago']], [0.6, ['echo night 2 > echo night (fight me)', '18 days ago']], [0.85, ['echo night 2 > echo night (fight me)', '44 days ago']]]]
  ];
  const ARCHIVE = [[0, ['▼ 2007 (30)', '► september (7)', '► august (11)', '► july (6)', '► june (6)']],
    [0.6, ['▼ 2007 (30)', '► september (7)', '► august (∞)', '► july (6)', '► june (6)']],
    [0.85, ['▼ 2007 (30)', '► thirteenember (∞)', '► september (7)', '► august (∞)', '► july (6)', '► june (6)', '▼ below (∞)']]];
  const RING = [[0, '« prev · ✦ tidepool webring ✦ · next »<br>(5 sites)'], [0.5, '« prev · ✦ tidepool webring ✦ · next »<br>(3 sites)'], [0.66, '« prev · ✦ tidepool webring ✦ · next »<br>(1 site)'], [0.82, 'there is only one site in the ring.']];
  const FROG = [[0, 'click the frog!'], [0.5, 'click the frog.'], [0.7, 'the frog is not a frog.'], [0.85, 'it counts too.']];
  const STAMPS = [[0, [['I ♥', 'AXOLOTLS', '#f7b6c8'], ['AMBIENT', 'MUSIC FAN', '#9fd3c7'], ['PS1 KID', 'FOREVER', '#c8c8f0'], ['RAIN', 'APPRECIATOR', '#a9c9e8']]],
    [0.6, [['I ♥', 'AXOLOTLS', '#f7b6c8'], ['AMBIENT', 'MUSIC FAN', '#9fd3c7'], ['I SLEEP TO', 'TIDEPOOL', '#d8d0a0'], ['RAIN', 'APPRECIATOR', '#a9c9e8']]],
    [0.85, [['I ♥', 'LISTENING', '#f7b6c8'], ['16 COLORS', 'ONLY', '#55ffff'], ['I SLEEP TO', 'TIDEPOOL', '#d8d0a0'], ['RING 0', 'KID', '#ffff55']]]];
  const BLINKIES = [[0, ['~ FISH FRIEND ~', 'I LOVE RAIN']], [0.4, ['~ FISH FRIEND ~', 'INSOMNIAC']], [0.75, ['~ LISTENING ~', 'INSOMNIAC']]];
  const BTNS = [[0, [['AMBIENT', 'NOW!'], ['VIEW AT', '1024X768'], ['POWERED', 'BY KELP'], ['SATURN', 'FOREVER'], ['MADE IN', 'NOTEPAD'], ['TIDEPOOL', 'WEBRING']]],
    [0.6, [['AMBIENT', 'NOW!'], ['VIEW AT', '640X480'], ['POWERED', 'BY KELP'], ['VIEW', 'UNDERWATER'], ['MADE IN', 'NOTEPAD'], ['IT IS', 'LISTENING']]]];

  function badge(lines, bg, w, h, s) {
    const cv = GE.canvas(w, h), c = cv.getContext('2d');
    c.fillStyle = bg; c.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (GE.bayer(x, y) < y / (h * 2)) { c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(x, y, 1, 1); }
    c.fillStyle = 'rgba(255,255,255,0.6)'; c.fillRect(0, 0, w, 1); c.fillRect(0, 0, 1, h);
    c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(0, h - 1, w, 1); c.fillRect(w - 1, 0, 1, h);
    const lh = 5 * s + 4, top = Math.round((h - (lines.filter(Boolean).length * lh - 4)) / 2);
    lines.filter(Boolean).forEach((l, i) => { const tw = GE.pixTextWidth(l, s); GE.pixText(c, l, Math.round((w - tw) / 2) + 1, top + i * lh + 1, s, 'rgba(0,0,0,0.35)'); GE.pixText(c, l, Math.round((w - tw) / 2), top + i * lh, s, '#ffffff'); });
    return cv;
  }
  W.badge = (lines, bg) => badge(lines, bg || GE.pick(['#2f7f9e', '#23938a', '#ef9a4b', '#c86fb4', '#3f9a5c', '#6a5a8a']), 88, 31, 2);
  function stamp(a, b, bg) {
    const cv = GE.canvas(99, 56), c = cv.getContext('2d');
    c.fillStyle = bg; c.fillRect(0, 0, 99, 56);
    c.fillStyle = '#ffffff'; for (let x = 0; x < 99; x += 4) { c.fillRect(x, 0, 2, 2); c.fillRect(x, 54, 2, 2); } for (let y = 0; y < 56; y += 4) { c.fillRect(0, y, 2, 2); c.fillRect(97, y, 2, 2); }
    GE.drawSprite(c, a.indexOf('AXOLOTL') >= 0 || b.indexOf('AXOLOTL') >= 0 ? 'jelly' : b.indexOf('TIDEPOOL') >= 0 ? 'eye' : 'gill', 6, 8, { scale: 2 });
    [a, b].forEach((l, i) => { const tw = GE.pixTextWidth(l, 1); GE.pixText(c, l, Math.min(99 - tw - 5, 46), 18 + i * 9, 1, '#1a1a1a'); });
    return cv;
  }
  const blinkies = [];
  function blinky(text) {
    const cv = GE.canvas(150, 20);
    blinkies.push({ cv, text });
    drawBlinky(cv, text, 0);
    return cv;
  }
  function drawBlinky(cv, text, f) {
    const c = cv.getContext('2d');
    const bgs = [['#ffb6d9', '#c86fb4'], ['#bfe9ff', '#2f7f9e']], [bg, fg] = bgs[f % 2];
    c.fillStyle = bg; c.fillRect(0, 0, 150, 20);
    c.fillStyle = fg; c.fillRect(0, 0, 150, 1); c.fillRect(0, 19, 150, 1);
    const tw = GE.pixTextWidth(text, 2); GE.pixText(c, text, Math.round((150 - tw) / 2), 5, 2, f % 2 ? '#ffffff' : fg);
  }
  if (!GE.reducedMotion) { let f = 0; setInterval(() => { f++; blinkies.forEach((b) => { if (b.cv.isConnected) drawBlinky(b.cv, b.text, f); }); }, 600); }

  W.construction = () => {
    const cv = $('construction'); if (!cv) return;
    const c = cv.getContext('2d');
    c.fillStyle = '#ffd000'; c.fillRect(0, 0, 88, 31);
    c.fillStyle = '#111'; for (let x = -31; x < 88; x += 10) { c.beginPath(); c.moveTo(x, 31); c.lineTo(x + 5, 31); c.lineTo(x + 36, 0); c.lineTo(x + 31, 0); c.fill(); }
    c.fillStyle = '#ffd000'; c.fillRect(4, 8, 80, 15);
    GE.pixText(c, 'UNDER', 6, 9, 1, '#111'); GE.pixText(c, 'CONSTRUCTION', 6, 16, 1, '#111');
    GE.drawSprite(c, 'frog', 66, 10, {});
  };

  const keys = {};
  const once = (k, v, fn) => { const s = JSON.stringify(v); if (keys[k] === s) return; keys[k] = s; fn(v); };
  W.update = (D) => {
    const d = GE.clamp(D, 0, 1);
    const P = (s) => GE.personalize(s);
    once('tag', at(TAGLINE, D), (v) => { $('tagline').innerHTML = P(v); });
    once('title', at(TITLE, D), (v) => { document.title = P(v).replace(/&amp;/g, '&'); });
    once('mq', at(MARQUEE, D), (v) => { $('marquee').innerHTML = P(GE.esc(v).replace(/&#39;/g, "'")); });
    once('about', at(ABOUT, D), (v) => { $('sb-about').innerHTML = P(v); });
    once('where', at(WHERE, d), (v) => { $('sb-where').textContent = v; });
    once('status', at(STATUS, D), (v) => { $('sb-status').textContent = v[0] || '(empty)'; $('sb-status-when').textContent = v[1]; });
    ['playing', 'reading', 'watching', 'mood'].forEach((k) => once('cur' + k, at(CUR[k], d), (v) => { $('sb-' + k).textContent = v; }));
    once('upd', UPDATES.filter((u) => u[0] <= D).length, (n) => {
      const ul = $('sb-updates'); const prev = ul.childElementCount;
      ul.innerHTML = '';
      UPDATES.slice(0, n).reverse().forEach((u, i) => { const li = GE.el('li', i < n - prev && prev ? 'new' : ''); li.innerHTML = `<b>${u[1]}</b> ${GE.esc(u[2])}`; ul.appendChild(li); });
      $('sb-lastupdate').textContent = 'last updated: ' + (UPDATES[n - 1][1] === '∞' ? 'now' : UPDATES[n - 1][1] + ', 2007');
    });
    once('todo', at(TODO, d), (v) => { $('sb-todo').innerHTML = v.map(([t, done]) => `<li class="${done ? 'done' : ''}">${GE.esc(t)}</li>`).join(''); });
    once('blogs', BLOGS.map((b) => at(b[1], d)), (v) => {
      $('sb-blogs').innerHTML = BLOGS.map((b, i) => `<li><a href="#404-${i}" data-route="404-${i}">${GE.esc(b[0])}</a><br>${GE.esc(v[i][0])} <span class="ago">${v[i][1]}</span></li>`).join('');
    });
    once('arch', at(ARCHIVE, d), (v) => { $('sb-archive').innerHTML = v.map((x, i) => `<li class="${i ? 'm' : ''}">${GE.esc(x)}</li>`).join(''); });
    once('ring', at(RING, d), (v) => { $('sb-ring').innerHTML = v; });
    once('frog', at(FROG, d), (v) => { $('sb-frogcap').textContent = v; });
    once('stamps', at(STAMPS, d), (v) => { const h = $('sb-stamps'); h.innerHTML = ''; v.forEach((s) => h.appendChild(stamp(s[0], s[1], s[2]))); });
    once('blink', at(BLINKIES, d), (v) => { const h = $('sb-blinkies'); h.innerHTML = ''; blinkies.length = 0; v.forEach((t) => h.appendChild(blinky(t))); });
    once('btns', at(BTNS, d), (v) => { const h = $('sb-buttons'); h.innerHTML = ''; v.forEach((l) => h.appendChild(W.badge(l))); });
    once('tide', Math.round(d * 40), () => { $('sb-tide').textContent = `tide: +${(0.2 + d * 40.8).toFixed(1)} m${d > 0.4 ? ' and rising' : ''}`; $('sb-tidebar').style.width = (4 + d * 96) + '%'; });
    once('online', d < 0.55 ? 1 : d < 0.8 ? 2 : 3, (v) => { $('sb-online').textContent = v === 3 ? '2 (one of them is you)' : String(v); });
    once('built', d < 0.6 ? 0 : d < 0.85 ? 1 : 2, (v) => { $('sb-built').textContent = ['this site is always under construction', 'this site is under construction. i forget what i was building.', 'construction is finished. it is a room.'][v]; });
    once('listen', d >= 0.86, (v) => { $('nav-listen').hidden = !v; });
    GE.social.updateShouts(D);
  };
  W.HOW = null;
})(window.GE);
