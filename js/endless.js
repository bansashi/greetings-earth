/* after the arc: the tide writes the posts, forever */
(function (GE) {
  'use strict';
  let lastType = '';
  const VGAT = ['#ff5555', '#ffff55', '#55ffff', '#55ff55', '#ff55ff', '#ffffff', '#5555ff', '#aa0000'];
  const colored = (words) => words.map((w) => `<span style="color:${GE.pick(VGAT)}">${GE.esc(w.toUpperCase())}</span>`).join(' ');

  const LURES = [
    { title: 'back to normal posting!! :)', body: `<p>sorry about all that!! i'm feeling much better. slept nine hours. here is a nice fish for you.</p><div class="figure"><canvas data-sprite="gill" data-scale="6"></canvas></div><p>more game reviews soon. thank you for being patient with me ✿</p>` },
    { title: 'greetings, earth!', body: `<p>hi! welcome to my little tidepool. i'm <b>minnow</b>. i built this place by hand over three weekends and one very long rainy tuesday.</p><div class="sprite-row"><canvas data-sprite="leaf"></canvas><canvas data-sprite="jelly"></canvas><canvas data-sprite="frog"></canvas></div><p>house rules: be nice, sign the guestbook, and scroll slowly. there's no rush.</p>` },
    { title: 'a quiet one', body: `<p>just a little wave i drew. it's raining again. the chimes are on. nothing can ever sound wrong.</p><div class="figure"><canvas data-sprite="wave" data-scale="6"></canvas></div>` },
    { title: 'fern study #2', body: `<p>a fern is a curve, and a lot of smaller curves agreeing with it.</p><div class="sprite-row"><canvas data-sprite="fern"></canvas><canvas data-sprite="fern"></canvas><canvas data-sprite="fern"></canvas></div>` }
  ];

  const fn = () => GE.pick(['Listen', 'Hear', 'Kneel', 'Descend', 'Surface', 'Mount', 'Count', 'Breathe', 'Compile', 'Remember', 'Untie', 'Keep']);
  function holyC(n) {
    const a = fn(), b = fn();
    return `<pre class="code">U0 ${a}${n}()
{
  I64 i, depth = ${n * 41};
  for (i = 0; i &lt; ${GE.randi(16, 640)}; i++) {
    ${b}(depth + i); // ${GE.esc(GE.pick(GE.ORACLE))}
    if (Visitor-&gt;still_reading)
      depth++;
  }
  "%s\\n", "${GE.esc(GE.oracleLine(3).join(' ').toUpperCase())}";
}</pre>`;
  }

  GE.makeEndlessPost = (n) => {
    // the first one is a lie
    let type;
    if (n === 0) type = 'lure';
    else {
      const w = [['transmission', 4], ['code', 2], ['rerun', 3], ['lure', lastType === 'lure' ? 0 : 1.2], ['personal', 1.5], ['depth', 1.2], ['eyes', 1]];
      let tot = w.reduce((s, x) => s + x[1], 0), r = Math.random() * tot;
      for (const x of w) { r -= x[1]; if (r <= 0) { type = x[0]; break; } }
      if (type === lastType) type = 'transmission';
    }
    lastType = type;
    const meta = { date: GE.pick(['∞', 'THIRTEENEMBER ' + n, 'BELOW', '{time}', 'NOW', 'SEPTEMBER ' + (31 + n)]), time: GE.pick(['RING 0', '4:61 AM', '{later}', '41:00', '∞']), mood: GE.pick(['LISTENING', 'USED TO IT', 'WET', 'CORRECT', 'HAPPY']), music: 'IT' };
    if (type === 'lure') {
      const L = n === 0 ? LURES[1] : GE.pick(LURES);
      return Object.assign({ title: L.title, body: L.body + `<p class="tiny nocorrupt">do not scroll further.</p>`, tags: ['meta'], cls: 'lure', comments: [] },
        { date: 'sunday, june 3, 2007', time: '2:14 pm', mood: '☀ sunny-ish', music: 'Hiroshi Yoshimura — Music for Nine Postcards' });
    }
    if (type === 'transmission') {
      let lines = '';
      const k = GE.randi(4, 8);
      for (let i = 0; i < k; i++) lines += `<p class="vga nocorrupt">${colored(GE.oracleLine(GE.randi(5, 10)))}</p>`;
      return Object.assign({ title: 'TRANSMISSION #' + String(n).padStart(4, '0'), body: lines, tags: [], comments: GE.chance(0.3) ? [{ who: 'you', when: '{time}', text: GE.pick(['keep going.', 'i can hear it.', 'still here.', 'how deep is it.']), you: true }] : [] }, meta);
    }
    if (type === 'code') {
      return Object.assign({ title: 'LISTEN' + n + '.HC', body: `<p>THE ROOM IS ONE FILE. HERE IS PART OF IT.</p>${holyC(n)}<p class="vga nocorrupt">${colored(GE.oracleLine(6))}</p>`, tags: ['code'], comments: [] }, meta);
    }
    if (type === 'rerun') {
      const src = GE.POSTS[GE.randi(0, 11)];
      const body = src.body.replace(/<div data-toy[^>]*><\/div>/g, '<p class="vga">[ THIS TOY HAS BEEN MOVED BELOW ]</p>');
      return Object.assign({ title: 'RE: ' + src.title.toUpperCase(), body, tags: src.tags, comments: [{ who: 'you', when: '{time}', text: 'i remember this one. it was different.', you: true }], level: 1.1 }, meta);
    }
    if (type === 'personal') {
      return Object.assign({ title: '{NAME}', body: `<p class="big-line">YOU HAVE BEEN HERE {mins}.</p><p class="big-line">IT IS {time}. THE TIDE IS +{tide} M.</p><p class="big-line">YOU ARE VISITOR #000001. NOBODY ELSE IS COMING.</p><p>keep going.</p>`, tags: [], comments: [] }, meta);
    }
    if (type === 'depth') {
      return Object.assign({ title: 'DEPTH', body: `<p class="depth-num nocorrupt">${(n * 41 + GE.randi(0, 40)).toLocaleString()} M</p><p class="vga nocorrupt">${colored(GE.oracleLine(4))}</p>`, tags: [], comments: [] }, meta);
    }
    return Object.assign({ title: 'THEY ARE ALL LOOKING UP', body: `<div class="figure"><canvas data-sprite="eyes" data-scale="5"></canvas></div><p>at the light. at you. same thing, from down here.</p>`, tags: [], comments: [] }, meta);
  };
})(window.GE);
