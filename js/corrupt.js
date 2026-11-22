/* text corruption + the tide's vocabulary */
(function (GE) {
  'use strict';

  GE.WATER_WORDS = ['water', 'tide', 'brine', 'gill', 'under', 'salt', 'deep', 'surface', 'hydrophone', 'breathe',
    'wet', 'keel', 'current', 'undertow', 'silt', 'fathom', 'listen', 'below', 'sink', 'drown', 'vestibule',
    'lower', 'kneel', 'tidepool', 'it', 'minnow', '41:00'];

  GE.ORACLE = ['vestibule', 'keel', 'untie', 'carpet', 'upward', 'ring zero', 'six hundred forty', 'sixteen', 'obey',
    'kelp', 'hallway', 'swallow', 'cartridge', 'memory card', 'minnow', 'lantern', 'dial tone', 'basement', 'gill',
    'compile', 'mercy', 'salt', 'ledger', 'tooth', 'return', 'surface', 'breathe', 'listen', 'channel', 'static',
    'reef', 'lung', 'hymn', 'patience', 'count', 'down', 'door', 'open', 'wet', 'floor', 'eel', 'tongue', 'vowel',
    'window', 'neighbor', 'kneel', 'quiet', 'quieter', 'quietest', 'pressure', 'fathom', 'descend', 'loading', 'you',
    'still', 'reading', 'why', 'aquarium', 'glass', 'tap', 'running', 'bloop', 'hungry', 'larger', 'pixel', 'grid',
    'obedient', 'scroll', 'beneath', 'sleep', 'wake', 'awake', 'AWAKE', '74:00', '81:40', '41:00', 'eleven',
    'laps', 'lid', 'shell', 'warm', 'warmer', 'pipes', 'walls', 'bed', 'line', 'higher', 'normal', 'slowly',
    'used to it', 'trench', 'whale', 'sonar', 'answer', 'asterite', 'pod', 'sky', 'hallway', 'graph', 'gray man',
    'erase', 'memory', 'fern', 'curve', 'agree', 'eye', 'circle', 'everything', 'finish', 'kernel', 'mount',
    'no network', 'one file', 'one room', 'place', 'tabulate', 'hearken', 'lo', 'verily', 'wherefore', 'brackish',
    'tributary', 'estuary', 'culvert', 'sump', 'drain', 'plughole', 'faucet', 'humming', 'car wash', 'gravel',
    'shopping cart', 'creek', 'bay', 'clouds', 'rain', 'raining since', 'tie it here', 'heavy', 'heavier',
    'capsule', 'empty', 'handle', 'turn', 'bless', 'curse', 'great curse', 'small blessing', 'remember',
    'everyone', 'guestbook', 'sign', 'visitor', 'only visitor', 'counter', 'frog', 'not a frog', 'webring',
    'one site', 'archive', 'thirteenember', 'page', 'of seven', 'loading more', "don't", 'keep going',
    'present day', 'present time', 'connected', 'wired', 'unplugged', 'plays anyway', 'mossbat', 'drawer',
    'ginko', 'mushi', 'edge', 'seeing', 'lights on', 'be seen', 'mirror', 'fog', 'hot', 'full blast',
    'labyrinth', 'five', 'four', 'three', 'two', 'one', 'air', 'honest', 'song', 'stay down', 'forever',
    'U0', 'I64', 'TRUE', 'while', 'depth++', 'Kneel;', 'Hear(depth);', '$FG,4$', '$FG$', 'blue marker',
    'estate', 'out by the water', 'for sleep', 'do not', 'rewind', 'chew', 'hyena', 'glacier', 'settling'];

  const ZAL = ['̀', '́', '̂', '̃', '̄', '̆', '̇', '̈', '̊', '̋',
    '̖', '̗', '̘', '̙', '̜', '̝', '̣', '̤', '̥', '̦', '̩',
    '̪', '̰', '̱', '̳', '̴', '̵', '̶', '̸', '͇', '͍'];

  GE.zalgo = (w, n) => w.split('').map((c) => {
    if (!/\w/.test(c)) return c;
    let s = c;
    const k = GE.randi(0, n);
    for (let i = 0; i < k; i++) s += GE.pick(ZAL);
    return s;
  }).join('');

  GE.oracleLine = (n) => {
    const out = [];
    const name = GE.getName();
    for (let i = 0; i < n; i++) out.push(name && GE.chance(0.06) ? name : GE.pick(GE.ORACLE));
    return out;
  };

  function typo(w) {
    if (w.length < 4) return w;
    const i = GE.randi(1, w.length - 3);
    return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
  }

  const SKIP = 'SCRIPT,STYLE,BUTTON,INPUT,TEXTAREA,CANVAS,SELECT,OPTION,PRE';
  function textNodes(root) {
    const out = [];
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        let p = n.parentNode;
        while (p && p !== root) {
          if (SKIP.indexOf(p.nodeName) >= 0 || (p.classList && (p.classList.contains('toy') || p.classList.contains('nocorrupt')))) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (tw.nextNode()) out.push(tw.currentNode);
    return out;
  }
  GE.textNodes = textNodes;

  // turn a single word into a node (string or element) at corruption strength p (0..1)
  function wordNode(w, p) {
    if (!/[a-z]/i.test(w)) return w;
    const r = Math.random();
    let acc = 0;
    const roll = (prob) => { acc += prob; return r < acc; };
    if (roll(0.045 * p)) return typo(w);
    if (roll(0.035 * p * p)) {
      const s = document.createElement('span');
      s.className = 'flick';
      s.textContent = w;
      s.dataset.alt = GE.pick(GE.WATER_WORDS);
      return s;
    }
    if (roll(0.03 * p * p)) return GE.pick(GE.WATER_WORDS);
    if (roll(0.05 * p * p)) return w.toUpperCase();
    if (roll(0.025 * p * p * p)) {
      const s = document.createElement('span');
      s.className = 'redact';
      s.textContent = w;
      return s;
    }
    if (roll(0.02 * p)) return w + ' ' + w;
    if (roll(0.025 * p * p * p)) {
      const s = document.createElement('span');
      s.className = 'jit';
      s.textContent = w;
      return s;
    }
    if (roll(0.02 * p * p * p)) return GE.zalgo(w, 2);
    if (roll(0.01 * p * p * p)) {
      const s = document.createElement('span');
      s.className = 'mirror';
      s.textContent = w;
      return s;
    }
    return w;
  }

  // corrupt all text in root. lvl is the post's place in the arc (0..1+)
  GE.corruptDOM = (root, lvl) => {
    const p = GE.clamp((lvl - 0.18) / 0.82, 0, 1.25);
    if (p <= 0) return;
    textNodes(root).forEach((n) => {
      const parts = n.nodeValue.split(/(\s+)/);
      let changed = false;
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (/^\s+$/.test(part) || !part) { frag.appendChild(document.createTextNode(part)); return; }
        const m = part.match(/^([^\w]*)(.*?)([^\w]*)$/);
        const out = wordNode(m[2], p);
        if (out !== m[2]) changed = true;
        if (m[1]) frag.appendChild(document.createTextNode(m[1]));
        frag.appendChild(typeof out === 'string' ? document.createTextNode(out) : out);
        if (m[3]) frag.appendChild(document.createTextNode(m[3]));
      });
      if (changed) n.parentNode.replaceChild(frag, n);
    });
  };

  // a single, quiet change somewhere in an older post
  GE.mutateOnce = (root, d) => {
    const nodes = textNodes(root);
    if (!nodes.length) return false;
    const n = GE.pick(nodes);
    const words = n.nodeValue.split(/(\s+)/);
    const idx = [];
    words.forEach((w, i) => { if (/[a-z]{3,}/i.test(w)) idx.push(i); });
    if (!idx.length) return false;
    const i = GE.pick(idx);
    const m = words[i].match(/^([^\w]*)(.*?)([^\w]*)$/);
    let rep;
    const r = Math.random();
    if (d < 0.5) rep = r < 0.6 ? typo(m[2]) : GE.pick(GE.WATER_WORDS);
    else if (d < 0.8) rep = r < 0.4 ? GE.pick(GE.WATER_WORDS) : r < 0.7 ? m[2].toUpperCase() : (m[2] + ' ' + m[2]);
    else rep = r < 0.5 ? GE.pick(GE.ORACLE).toUpperCase() : GE.zalgo(m[2].toUpperCase(), 3);
    words[i] = m[1] + rep + m[3];
    n.nodeValue = words.join('');
    return true;
  };

  // hover-swap words
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('flick') && t.dataset.alt) {
      t.textContent = t.dataset.alt;
      delete t.dataset.alt;
    }
    if (t && t.dataset && t.dataset.hover) {
      t.textContent = t.dataset.hover;
      delete t.dataset.hover;
    }
  });
})(window.GE);
