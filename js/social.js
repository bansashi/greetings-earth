/* comments, reactions, word verification, shoutbox, guestbook */
(function (GE) {
  'use strict';
  const S = GE.social = {};
  const anon = () => GE.getName() || 'Anonymous';
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const nowStamp = () => { const d = new Date(); return GE.fmtTime(d).toUpperCase(); };
  const stageOfD = (d) => d < 0.2 ? 0 : d < 0.4 ? 1 : d < 0.6 ? 2 : d < 0.8 ? 3 : 4;
  const setName = (n) => { if (n && !GE.getName()) { GE.store.set('name', n.slice(0, 24)); document.dispatchEvent(new CustomEvent('ge-name')); } };

  /* ---------------- word verification ---------------- */
  const CV = 'bcdfghjklmnprstvwz', VV = 'aeiou';
  function nonsense() { let w = ''; const n = GE.randi(5, 7); for (let i = 0; i < n; i++) w += i % 2 ? GE.pick(VV.split('')) : GE.pick(CV.split('')); return w; }
  function captchaWord(st) {
    if (st <= 1) return nonsense();
    if (st === 2) return GE.chance(0.6) ? nonsense() : GE.pick(['tidal', 'salty', 'gills', 'drawer', 'keel', 'laps']);
    if (st === 3) return GE.pick(['below', 'listen', 'awake', 'warmer', (GE.getName() || 'minnow').toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'minnow']);
    return 'listen';
  }
  function drawCaptcha(cv, word, st) {
    const c = cv.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = st >= 4 ? '#000' : '#fff'; c.fillRect(0, 0, cv.width, cv.height);
    c.strokeStyle = st >= 4 ? '#5555ff' : '#bbb';
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(0, GE.rand(0, 40)); c.bezierCurveTo(40, GE.rand(0, 40), 90, GE.rand(0, 40), 130, GE.rand(0, 40)); c.stroke(); }
    c.font = 'italic 24px Georgia, serif'; c.textBaseline = 'middle';
    let x = 10;
    for (const ch of word) {
      c.save(); c.translate(x, 20 + GE.rand(-4, 4)); c.rotate(GE.rand(-0.35, 0.35));
      c.fillStyle = st >= 4 ? '#ff5555' : GE.pick(['#334', '#2a4a6a', '#553']);
      c.fillText(ch, 0, 0); c.restore();
      x += c.measureText(ch).width + GE.rand(-1, 2);
    }
  }

  /* ---------------- reactions ---------------- */
  const RX = [['cute', 'funny', 'cool'], ['cute', 'cool', 'spooky'], ['cute', 'spooky', 'are you ok?'], ['spooky', 'are you ok?', 'wet'], ['LISTENING', 'KNEELING', 'HERE'], ['LISTENING', 'KNEELING', 'HERE']];
  const rxTicking = [];
  S.reactions = (index, st) => {
    const box = GE.el('div', 'rx');
    box.appendChild(document.createTextNode('Reactions: '));
    RX[st].forEach((label, k) => {
      const key = 'rx:' + index + ':' + k;
      const mine = !!GE.store.get(key, false);
      let base = st >= 4 ? 16 + ((index * 41 + k * 7) % 25) : ((index * 7 + k * 5 + 3) % (st >= 2 && k === 2 ? 6 : 9));
      if (st <= 1 && k === 0) base += 2;
      const lab = GE.el('label');
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = mine;
      const span = GE.el('span'); span.textContent = `${label} (${base + (mine ? 1 : 0)})`;
      lab.appendChild(cb); lab.appendChild(span);
      cb.addEventListener('change', () => {
        GE.store.set(key, cb.checked);
        if (st >= 4 && !cb.checked) { cb.checked = true; GE.store.set(key, true); span.textContent = `${label} (${base + 1}) — it heard you`; return; }
        span.textContent = `${label} (${base + (cb.checked ? 1 : 0)})`;
      });
      box.appendChild(lab);
      if (st >= 4) rxTicking.push({ span, label, get: () => base + (cb.checked ? 1 : 0), inc: () => base++ });
    });
    return box;
  };
  setInterval(() => {
    if (!rxTicking.length || document.hidden) return;
    const r = GE.pick(rxTicking);
    if (!r.span.isConnected) { rxTicking.splice(rxTicking.indexOf(r), 1); return; }
    r.inc(); r.span.textContent = `${r.label} (${r.get()})`;
  }, 2600);

  /* ---------------- recent comments ---------------- */
  const recent = [];
  S.pushRecent = (who, title, text, index) => {
    recent.unshift({ who, title, text, index });
    if (recent.length > 8) recent.length = 8;
    renderRecent();
  };
  function renderRecent() {
    const ul = document.getElementById('sb-recent'); if (!ul) return;
    ul.innerHTML = '';
    recent.slice(0, 6).forEach((r) => {
      const li = GE.el('li');
      const b = GE.el('b'); b.textContent = r.who;
      li.appendChild(b); li.appendChild(document.createTextNode(' on '));
      const a = GE.el('a'); a.textContent = r.title; a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); S.jumpTo(r.index); });
      li.appendChild(a);
      const q = GE.el('div', 'small'); q.textContent = '"' + (r.text.length > 60 ? r.text.slice(0, 58) + '…' : r.text) + '"';
      li.appendChild(q);
      ul.appendChild(li);
    });
  }
  S.jumpTo = (index) => {
    if (GE.router) GE.router.go('home');
    const a = document.querySelector(`.post[data-index="${index}"]`);
    if (a) { a.scrollIntoView({ block: 'start' }); const c = a.querySelector('.comments'); if (c) c.classList.add('open'); }
  };

  /* ---------------- comments ---------------- */
  const REPLY = [
    ['thank you {name}!! ✿', 'omg hi {name}! welcome to the tidepool ♡', 'hehe yes!! thanks for reading ✿', 'aaa thank you!! come back anytime'],
    ['thank you {name} ✿', 'hi {name}! yes!!', 'thanks for reading. sorry, tired today', 'hehe. ✿'],
    ['thanks {name}.', 'you too?', 'did you hear it too?', 'sorry. sleeping badly. thank you for reading', 'i read this at 4am and thought you were mossbat'],
    ['{name}, how long have you been here?', "i didn't write that.", 'who told you about this post', "it's warm where you are too, isn't it", 'please stop leaving comments at {time}'],
    ['{NAME}.', 'IT HEARD YOU.', 'KEEP GOING, {NAME}.', 'YOU ALREADY SAID THAT.']
  ];
  function fmtWhen(w) {
    if (!w) return '';
    if (/[{]/.test(w)) return GE.personalize(w).toUpperCase();
    return cap1(w) + (/^[a-z]+ \d+$/i.test(w) ? ', 2007' : '');
  }
  function liFor(c, cls) {
    const li = GE.el('li', cls || '');
    const who = GE.el('div');
    const b = GE.el('span', 'who'); b.textContent = c.who;
    who.appendChild(b); who.appendChild(document.createTextNode(' said...'));
    const p = GE.el('p'); p.textContent = c.text;
    const w = GE.el('div', 'when'); w.textContent = c.when;
    li.appendChild(who); li.appendChild(p); li.appendChild(w);
    return li;
  }

  S.commentsBlock = (post, index, st, title) => {
    const key = 'cm:' + index;
    const box = GE.el('div', 'comments');
    const toggle = GE.el('button', 'c-toggle'); toggle.type = 'button';
    const preview = GE.el('p', 'c-preview');
    const body = GE.el('div', 'c-body');
    const h4 = GE.el('h4');
    const list = GE.el('ol', 'c-list');
    body.appendChild(h4); body.appendChild(list);
    box.appendChild(toggle); box.appendChild(preview); box.appendChild(body);
    const preset = (post.comments || []).map((c) => ({
      who: c.you ? anon() : c.who,
      text: GE.personalize(c.text).replace(/&amp;/g, '&').replace(/&#39;/g, "'"),
      when: fmtWhen(c.when), author: c.who === 'minnow', you: !!c.you
    }));
    preset.forEach((c) => S.pushRecent(c.who, title, c.text, index));
    function mine() { return GE.store.get(key, []) || []; }
    function render() {
      list.innerHTML = '';
      const all = preset.slice();
      const now = Date.now();
      mine().forEach((m) => {
        if (m.removedAt && now >= m.removedAt) all.push({ who: m.who, text: 'This comment has been removed by the author.', when: m.when, removed: true, you: true });
        else all.push({ who: m.who, text: m.alteredAt && now >= m.alteredAt ? m.altered : m.text, when: m.when, you: true });
        if (m.reply && now >= m.reply.at) all.push({ who: 'minnow', text: m.reply.text, when: m.reply.when, author: true });
      });
      all.forEach((c) => list.appendChild(liFor(c, (c.author ? 'author ' : '') + (c.you ? 'you ' : '') + (c.removed ? 'removed-c' : ''))));
      const n = all.length;
      toggle.textContent = n ? `${n} comment${n === 1 ? '' : 's'}` : (post.closed ? 'comments are closed' : 'post a comment');
      h4.textContent = n ? `${n} comment${n === 1 ? '' : 's'}:` : 'no comments yet.';
      const last = all[all.length - 1];
      preview.textContent = (st >= 2 && last && !box.classList.contains('open')) ? `latest: ${last.who} — "${last.text.length > 70 ? last.text.slice(0, 68) + '…' : last.text}"` : '';
    }
    toggle.addEventListener('click', () => { box.classList.toggle('open'); render(); });

    // the form
    if (post.closed) {
      body.appendChild(GE.el('p', 'c-closed', 'Comments are closed. Comments were always closed.'));
    } else {
      const form = GE.el('form', 'c-form');
      form.innerHTML = `<h5>Post a Comment</h5>
        <label>Comment as: <input type="text" name="n" maxlength="24" placeholder="Name/URL" autocomplete="nickname"></label>
        <textarea name="t" maxlength="500" aria-label="your comment"></textarea>
        <div class="captcha"><canvas width="130" height="40" aria-hidden="true"></canvas><label>Word Verification: <input type="text" name="v" maxlength="20" autocomplete="off" spellcheck="false"></label><button type="button" class="mini cv-new">new word</button></div>
        <div class="c-err" role="status"></div>
        <button type="submit" class="pub">Publish Your Comment</button>`;
      body.appendChild(form);
      const nIn = form.querySelector('[name=n]'), tIn = form.querySelector('[name=t]'), vIn = form.querySelector('[name=v]');
      const cv = form.querySelector('canvas'), err = form.querySelector('.c-err');
      if (GE.getName()) nIn.value = GE.getName();
      let word = '';
      const newWord = () => { word = captchaWord(st); cv.__word = word; drawCaptcha(cv, word, st); };
      newWord();
      form.querySelector('.cv-new').addEventListener('click', newWord);
      if (st >= 4) form.querySelector('.captcha label').firstChild.nodeValue = 'Word Verification (type the word you hear): ';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = tIn.value.trim();
        if (!text) { err.textContent = 'Please enter a comment.'; return; }
        if (st < 4 && vIn.value.trim().toLowerCase() !== word.toLowerCase()) { err.textContent = 'Please enter the letters as they are shown in the image above.'; newWord(); vIn.value = ''; return; }
        err.textContent = '';
        const name = nIn.value.trim().slice(0, 24) || 'Anonymous';
        if (name !== 'Anonymous') setName(name);
        const now = Date.now();
        const m = { who: name, text: text.slice(0, 500), when: new Date().toDateString().replace(/^\w+ /, '') + ' ' + nowStamp() };
        const d = GE.dd();
        const rs = Math.max(st, stageOfD(d) - 1);
        if (rs >= 4 && st >= 5) { m.alteredAt = now + 3500; m.altered = "i'm still here"; }
        else if (rs >= 4) m.removedAt = now + 4000;
        const replyText = GE.pick(REPLY[Math.min(4, rs)]);
        m.reply = { at: now + GE.rand(2500, 6500), text: GE.personalize(replyText).replace(/&amp;/g, '&').replace(/&#39;/g, "'"), when: rs >= 4 ? 'RING 0' : 'just now' };
        if (rs >= 4) m.reply.text = m.reply.text + ' ' + GE.oracleLine(4).join(' ').toUpperCase();
        const arr = mine(); arr.push(m); GE.store.set(key, arr.slice(-12));
        tIn.value = ''; vIn.value = ''; newWord();
        S.pushRecent(name, title, m.text, index);
        render();
        [m.reply.at, m.removedAt, m.alteredAt].forEach((t) => { if (t) setTimeout(() => { render(); if (t === m.reply.at) S.pushRecent('minnow', title, m.reply.text, index); }, t - now + 50); });
      });
    }
    render();
    return box;
  };

  /* ---------------- shoutbox ---------------- */
  const SHOUTS = [
    [0, 'sakura_fishy', 'cute layout!! ✿', 'jun 3'],
    [0, 'kappa_kun', 'first', 'jun 3'],
    [0, 'dial-up-dan', 'this shoutbox loads faster than my email', 'jun 4'],
    [0, 'mossbat', 'proud of u minnow', 'jun 5'],
    [0.12, '~pearl~', 'when is the next bloop update!!', 'jun 22'],
    [0.2, 'kappa_kun', 'anyone playing echo night 2', 'jul 3'],
    [0.27, 'mossbat', 'ginko rules. drawer.', 'jul 15'],
    [0.36, 'kappa_kun', 'is the site slow for anyone else', 'jul 30'],
    [0.42, 'sakura_fishy', 'minnow ur scaring me lol', 'aug 9'],
    [0.47, '~pearl~', 'the tap thing!!!', 'aug 9'],
    [0.52, 'mossbat', 'minnow call me', 'aug 19'],
    [0.56, 'guest_4127', 'hi', 'aug 20'],
    [0.6, '{you}', 'i can hear it too', 'aug 23'],
    [0.66, 'sakura_fishy', 'taking a break from the webring for a while. sorry minnow', 'aug 26'],
    [0.7, 'mossbat', "i'm driving over", 'sep 4'],
    [0.75, '{you}', "it's warm", '{time}'],
    [0.82, '{you}', "i'm still here", '{time}'],
    [0.88, 'mossbat', 'the door was open', 'sep ?'],
    [0.93, '{you}', '{name}', '{time}'],
    [1.0, '{you}', 'keep going', '{time}'],
    [1.2, '{you}', 'keep going', '{time}'],
    [1.5, '{you}', 'how deep is it', '{time}']
  ];
  let shoutsEl = null, shown = 0;
  S.shoutbox = (host) => {
    host.innerHTML = '<div class="shouts" aria-live="polite"></div><form><input name="n" maxlength="20" placeholder="name" aria-label="name" autocomplete="nickname"><input name="m" maxlength="100" placeholder="message" aria-label="message"><button class="mini" type="submit">shout!</button></form>';
    shoutsEl = host.querySelector('.shouts');
    const form = host.querySelector('form');
    const nIn = form.querySelector('[name=n]');
    if (GE.getName()) nIn.value = GE.getName();
    (GE.store.get('shouts', []) || []).forEach((s) => addShout(s.n, s.m, s.t, true, false));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const m = form.querySelector('[name=m]').value.trim().slice(0, 100);
      if (!m) return;
      const n = nIn.value.trim().slice(0, 20) || 'guest';
      if (n !== 'guest') setName(n);
      const t = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase();
      const arr = GE.store.get('shouts', []) || []; arr.push({ n, m, t }); GE.store.set('shouts', arr.slice(-20));
      addShout(n, m, t, true, true);
      form.querySelector('[name=m]').value = '';
      const st = stageOfD(GE.dd());
      setTimeout(() => {
        if (st <= 1) addShout(GE.pick(['sakura_fishy', '~pearl~', 'kappa_kun']), GE.pick([`hi ${n}!! ✿`, `welcome ${n}!`, `hiii ${n}`]), 'just now', false, true);
        else if (st === 2) addShout('mossbat', GE.pick([`${n}, do you know minnow irl?`, `hi ${n}. has minnow said anything to you?`]), 'just now', false, true);
        else if (st === 3) addShout(n, m, 'just now', true, true);
        else addShout(n, GE.oracleLine(3).join(' '), '{time}', true, true);
      }, GE.rand(2500, 5000));
    });
  };
  function addShout(n, m, t, you, fresh) {
    if (!shoutsEl) return;
    const d = GE.el('div', 'shout' + (you ? ' you' : '') + (fresh ? ' new' : ''));
    const b = GE.el('b'); b.textContent = n + ':';
    const tt = GE.el('span', 't'); tt.textContent = ' ' + GE.personalize(t).replace(/&amp;/g, '&');
    d.appendChild(b); d.appendChild(document.createTextNode(' ' + m)); d.appendChild(tt);
    shoutsEl.appendChild(d);
    shoutsEl.scrollTop = shoutsEl.scrollHeight;
  }
  S.updateShouts = (D) => {
    while (shown < SHOUTS.length && SHOUTS[shown][0] <= D) {
      const [, who, msg, when] = SHOUTS[shown];
      const you = who === '{you}';
      const name = you ? anon() : who;
      addShout(name, GE.personalize(msg).replace(/&amp;/g, '&').replace(/&#39;/g, "'"), when, you, shown > 3);
      shown++;
    }
  };

  /* ---------------- guestbook ---------------- */
  const GB_PRESET = [
    { name: 'mossbat', loc: 'the next town over', how: 'i know minnow irl', home: 'mossbat.cave', msg: 'hi minnow. proud of you for finishing this. sorry about the hydrophone thing, keep it as long as you want', when: 'July 30, 2007' },
    { name: '~pearl~', loc: 'my room', how: 'webring', home: '', msg: 'bloop says hi!! (he told me)', when: 'July 29, 2007' },
    { name: 'kappa_kun', loc: 'ohio', how: 'a friend', home: 'kappa-games-log', msg: 'first!!! (not first)', when: 'July 29, 2007' },
    { name: 'dial-up-dan', loc: 'basement, 56k', how: 'search engine', home: '56k-warrior', msg: 'the ecco post. yes. exactly. also your site is 340kb, please have mercy', when: 'July 29, 2007' },
    { name: 'sakura_fishy', loc: 'canada ✿', how: 'webring', home: 'sakura-buttons', msg: 'cute site!!! linked u from my buttons page ✿ ✿ ✿ can we link exchange', when: 'July 29, 2007' }
  ];
  const HOW = ['webring', 'search engine', 'a friend', 'a link on another site', "i don't remember"];
  const HOW_LATE = ['webring', 'search engine', 'a friend', "i don't remember", 'the water', 'i was always here'];
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }
  function entryTable(e, mine) {
    const t = GE.el('table', 'gb-entry' + (mine ? ' mine' : ''));
    const rows = [['name', e.name], ['from', e.loc || '—'], ['found me via', e.how || '—'], ['date', e.when]];
    if (e.home) rows.splice(2, 0, ['homepage', e.home]);
    rows.forEach(([k, v]) => { const tr = GE.el('tr'); const a = GE.el('td', 'k'); a.textContent = k; const b = GE.el('td'); b.textContent = v; tr.appendChild(a); tr.appendChild(b); t.appendChild(tr); });
    const tr = GE.el('tr', 'msg'); const td = GE.el('td'); td.colSpan = 2; td.textContent = e.msg; tr.appendChild(td); t.appendChild(tr);
    return t;
  }
  function lateEntries() {
    const n = GE.getName() || 'visitor';
    const lines = ["i'm still here", "i'm still here", 'is anyone reading this', "it's warm", "i can't find the top of the page", n, n, 'LET ME', 'the line is above my head', "i'm still here"];
    (GE.store.get('gb', []) || []).forEach((e) => lines.unshift(e.msg.split('').reverse().join('')));
    const now = Date.now();
    const out = lines.map((m, i) => ({ name: n, loc: tz() || 'here', how: GE.pick(HOW_LATE), msg: m, when: GE.fmtTime(new Date(now + (3 - i) * 41 * 60000)) + (i < 3 ? ' (later)' : i === 3 ? ' (now)' : '') }));
    out.push({ name: 'mossbat', loc: "minnow's apartment", how: 'i know minnow irl', msg: 'minnow please', when: 'September ?, 2007' });
    return out;
  }
  S.guestbook = (host, opts) => {
    opts = opts || {};
    const d = GE.dd();
    const late = opts.mode === 'late' || d >= 0.8;
    host.innerHTML = '';
    if (!opts.readonly) {
      const form = GE.el('form', 'gb-form');
      const hows = (d > 0.6 ? HOW_LATE : HOW).map((h) => `<option>${GE.esc(h)}</option>`).join('');
      form.innerHTML = `<label>your name: <input name="name" maxlength="24" autocomplete="nickname" required></label>
        <label>email: <input name="email" maxlength="60" placeholder="(won't be shown)" autocomplete="off"></label>
        <label>homepage: <input name="home" maxlength="60" placeholder="http://"></label>
        <label>where are you from? <input name="loc" maxlength="40"></label>
        <label>how did you find me? <select name="how">${hows}</select></label>
        <label>message: <textarea name="msg" maxlength="400" required></textarea></label>
        <div class="smilies" aria-label="smilies">${[':)', ':D', ';)', ':P', '^_^', '>_<', ':(', '♡', '✿', '><>'].map((s) => `<button type="button">${GE.esc(s)}</button>`).join('')}</div>
        <div><button class="pub" type="submit">${late ? 'SIGN' : 'sign the guestbook!'}</button> <button class="pub" type="reset">clear</button></div>`;
      host.appendChild(form);
      const msg = form.querySelector('[name=msg]');
      if (GE.getName()) form.querySelector('[name=name]').value = GE.getName();
      if (late) form.querySelector('[name=loc]').placeholder = tz() || 'here';
      form.querySelectorAll('.smilies button').forEach((b) => b.addEventListener('click', () => { msg.value += (msg.value ? ' ' : '') + b.textContent; msg.focus(); }));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(form);
        const name = String(f.get('name') || '').trim().slice(0, 24) || 'visitor';
        GE.store.set('name', name); document.dispatchEvent(new CustomEvent('ge-name'));
        let m = String(f.get('msg') || '').trim().slice(0, 400) || 'hi!';
        if (late) m = "i'm still here";
        const arr = GE.store.get('gb', []) || [];
        arr.push({ name, msg: m, loc: String(f.get('loc') || '').trim().slice(0, 40), how: String(f.get('how') || ''), home: String(f.get('home') || '').trim().slice(0, 60), when: new Date().toDateString().replace(/^\w+ /, ''), ts: Date.now() });
        GE.store.set('gb', arr.slice(-20));
        S.guestbook(host, opts);
      });
    }
    const list = GE.el('div', 'gb-entries');
    const entries = late ? lateEntries() : (GE.store.get('gb', []) || []).slice().reverse().map((e) => Object.assign({ mine: true }, e)).concat(GB_PRESET);
    const cnt = GE.el('p', 'gb-count');
    cnt.textContent = late ? `${entries.length} entries. I REMEMBER EVERYONE.` : `${entries.length} entries · newest first · stored only in your own browser, i'll remember you`;
    host.appendChild(cnt);
    entries.forEach((e) => list.appendChild(entryTable(e, e.mine || (late && e.name !== 'mossbat'))));
    host.appendChild(list);
  };
})(window.GE);
