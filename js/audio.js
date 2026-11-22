/* generative ambient sound. nothing is recorded; it is all made here. */
(function (GE) {
  'use strict';

  const A = {};
  GE.audio = A;
  A.levels = { rain: 0, creek: 0, birds: 0, chimes: 0, tidepool: 0 };
  A.ctx = null;
  A.started = 0;       // when tidepool started playing
  let master, analyser, noiseBuf, ch = {}, chimeBus, schedTimer;
  let creeps = 0;

  function makeNoise(ctx) {
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
    return buf;
  }
  function noiseSrc() {
    const s = A.ctx.createBufferSource();
    s.buffer = noiseBuf; s.loop = true;
    s.loopStart = Math.random() * 3;
    s.start(0, Math.random() * 3);
    return s;
  }
  function gain(v) { const g = A.ctx.createGain(); g.gain.value = v; return g; }
  function filt(type, f, q) { const b = A.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q != null) b.Q.value = q; return b; }
  function lfo(freq, depth, target) {
    const o = A.ctx.createOscillator(); o.frequency.value = freq;
    const g = gain(depth); o.connect(g); g.connect(target); o.start();
    return o;
  }

  A.ensure = () => {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return A.ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = A.ctx = new AC();
    noiseBuf = makeNoise(ctx);
    master = gain(0.9);
    const comp = ctx.createDynamicsCompressor();
    analyser = ctx.createAnalyser(); analyser.fftSize = 64; analyser.smoothingTimeConstant = 0.8;
    master.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
    A.analyser = analyser;

    // rain
    ch.rain = gain(0);
    { const n = noiseSrc(); const hp = filt('highpass', 450); const lp = filt('lowpass', 5200); n.connect(hp); hp.connect(lp); lp.connect(ch.rain); }
    ch.rain.connect(master);

    // creek: two burbling bands
    ch.creek = gain(0);
    { const n = noiseSrc(); const bp = filt('bandpass', 700, 2.2); lfo(0.23, 280, bp.frequency); n.connect(bp); const g = gain(1.4); bp.connect(g); g.connect(ch.creek);
      const n2 = noiseSrc(); const bp2 = filt('bandpass', 1900, 5); lfo(0.71, 700, bp2.frequency); n2.connect(bp2); const g2 = gain(0.9); lfo(0.4, 0.5, g2.gain); bp2.connect(g2); g2.connect(ch.creek); }
    ch.creek.connect(master);

    ch.birds = gain(0); ch.birds.connect(master);

    // chimes through a soft delay
    ch.chimes = gain(0);
    chimeBus = gain(1);
    { const dl = ctx.createDelay(2); dl.delayTime.value = 0.47; const fb = gain(0.42); const lp = filt('lowpass', 2400);
      chimeBus.connect(ch.chimes); chimeBus.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(ch.chimes); }
    ch.chimes.connect(master);

    // tidepool (for sleep): waves on rocks + a drone under it
    ch.tidepool = gain(0);
    { const n = noiseSrc(); const lp = filt('lowpass', 650); const wg = gain(0.6); lfo(0.085, 0.55, wg.gain); n.connect(lp); lp.connect(wg); wg.connect(ch.tidepool);
      const n2 = noiseSrc(); const hp = filt('bandpass', 2600, 0.7); const sg = gain(0.18); lfo(0.085, 0.16, sg.gain); n2.connect(hp); hp.connect(sg); sg.connect(ch.tidepool);
      A.drone = [];
      [55, 82.4].forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const g = gain(i ? 0.05 : 0.08); o.connect(g); g.connect(ch.tidepool); o.start(); A.drone.push(o); });
      A.sub = ctx.createOscillator(); A.sub.frequency.value = 41; A.subGain = gain(0); A.sub.connect(A.subGain); A.subGain.connect(ch.tidepool); A.sub.start();
      // the voice: formant-filtered breath
      A.voice = gain(0);
      const vn = noiseSrc(); A.f1 = filt('bandpass', 700, 9); A.f2 = filt('bandpass', 1200, 9);
      vn.connect(A.f1); vn.connect(A.f2); A.f1.connect(A.voice); A.f2.connect(A.voice);
      const vg = gain(2.2); A.voice.connect(vg); vg.connect(master);
    }
    ch.tidepool.connect(master);

    schedTimer = setInterval(schedule, 120);
    return ctx;
  };

  const PENTA = [0, 2, 4, 7, 9];
  let nextBird = 0, nextChime = 0, nextDrop = 0, nextVoice = 0;
  function chirp(t, f0, f1, dur, vol) {
    const ctx = A.ctx; const o = ctx.createOscillator(); o.type = 'sine';
    const g = gain(0);
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ch.birds); o.start(t); o.stop(t + dur + 0.05);
  }
  function pluck(t, freq, vol, dest) {
    const ctx = A.ctx;
    [1, 2.01, 3.02].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = i ? 'sine' : 'triangle';
      o.frequency.value = freq * m;
      const g = gain(0);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol / (i + 1), t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8 / (i + 1));
      o.connect(g); g.connect(dest || chimeBus); o.start(t); o.stop(t + 3);
    });
  }

  function schedule() {
    const ctx = A.ctx; if (!ctx) return;
    const t = ctx.currentTime, d = GE.dd(), L = A.levels;
    if (L.birds > 0 && t > nextBird) {
      const pitch = 1 - d * 0.65;
      const n = GE.randi(2, 5);
      for (let i = 0; i < n; i++) {
        const f = GE.rand(2600, 3800) * pitch;
        chirp(t + 0.05 + i * GE.rand(0.09, 0.16) * (1 + d), f, f * GE.rand(1.15, 1.5) * (d > 0.6 ? 0.6 : 1), GE.rand(0.05, 0.1) * (1 + d * 2), 0.18);
      }
      nextBird = t + GE.rand(1.2, 4) * (1 + d * 1.5);
    }
    if (L.chimes > 0 && t > nextChime) {
      const base = d > 0.7 ? 110 : 523.25;
      let semis = GE.pick(PENTA) + 12 * GE.randi(0, 1);
      let cents = 0;
      if (d > 0.3) cents = GE.rand(-1, 1) * (d - 0.3) * 160;
      if (d > 0.55 && GE.chance(0.4)) semis += GE.pick([1, 6, 11]);
      const f = base * Math.pow(2, (semis + cents / 100) / 12);
      pluck(t + 0.02, f, 0.22);
      if (d > 0.65 && GE.chance(0.5)) pluck(t + 0.03, f * Math.pow(2, 1 / 12), 0.14);
      nextChime = t + GE.rand(0.9, 3.2) * (1 + d);
    }
    if (L.rain > 0 && t > nextDrop) {
      // single drops on a gutter
      const s = noiseSrc(); const bp = filt('bandpass', GE.rand(1800, 5200), 12); const g = gain(0);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      s.connect(bp); bp.connect(g); g.connect(ch.rain); s.stop(t + 0.1);
      nextDrop = t + GE.rand(0.03, 0.4);
    }
    // the voice under the waves
    const anyOn = L.rain + L.creek + L.birds + L.chimes + L.tidepool > 0;
    const vAmt = (L.tidepool > 0 ? GE.smooth(0.35, 0.7, d) : 0) + (anyOn ? GE.smooth(0.6, 0.95, d) * 0.6 : 0);
    if (vAmt > 0 && t > nextVoice && A.voice) {
      const V = [[700, 1200], [300, 2300], [400, 800], [500, 1700], [350, 900]];
      const syl = GE.randi(2, 6);
      let tt = t + 0.05;
      for (let i = 0; i < syl; i++) {
        const v = GE.pick(V), dur = GE.rand(0.25, 0.6);
        A.f1.frequency.setValueAtTime(v[0], tt); A.f2.frequency.setValueAtTime(v[1], tt);
        A.voice.gain.setValueAtTime(0, tt);
        A.voice.gain.linearRampToValueAtTime(0.11 * vAmt, tt + dur * 0.4);
        A.voice.gain.linearRampToValueAtTime(0, tt + dur);
        tt += dur + GE.rand(0.05, 0.25);
      }
      nextVoice = tt + GE.rand(4, 11) * (1.4 - Math.min(1, vAmt));
    }
    if (A.drone) {
      A.drone[1].frequency.setTargetAtTime(82.4 * (1 - d * 0.07), t, 1);
      A.subGain.gain.setTargetAtTime(L.tidepool > 0 ? GE.smooth(0.6, 1, d) * 0.12 : 0, t, 1);
    }
  }

  const MAX = { rain: 0.55, creek: 0.5, birds: 0.7, chimes: 0.6, tidepool: 0.9 };
  A.set = (name, v, fromUser) => {
    v = GE.clamp(+v || 0, 0, 1);
    if (v > 0) A.ensure();
    if (name === 'tidepool' && v > 0 && !A.levels.tidepool) A.started = Date.now();
    if (name === 'tidepool' && v === 0 && fromUser && GE.dd() > 0.8 && creeps < 2) {
      creeps++;
      setTimeout(() => { if (!A.hushed) A.set('tidepool', 0.22); }, 1800);
    }
    A.levels[name] = v;
    if (v > 0) A.hushed = false;
    if (A.ctx && ch[name]) ch[name].gain.setTargetAtTime(v * MAX[name], A.ctx.currentTime, 0.4);
    document.dispatchEvent(new CustomEvent('ge-audio', { detail: { name, v } }));
  };
  A.hush = () => {
    A.hushed = true;
    Object.keys(A.levels).forEach((k) => A.set(k, 0));
    if (A.voice && A.ctx) A.voice.gain.cancelScheduledValues(A.ctx.currentTime), A.voice.gain.setValueAtTime(0, A.ctx.currentTime);
  };
  A.playing = () => Object.keys(A.levels).filter((k) => A.levels[k] > 0);

  A.croak = () => {
    const ctx = A.ensure(); if (!ctx) return;
    const t = ctx.currentTime, d = GE.dd();
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const g = gain(0); const lp = filt('lowpass', 900 - d * 500, 6);
    o.frequency.setValueAtTime(180 - d * 120, t); o.frequency.linearRampToValueAtTime(120 - d * 90, t + 0.25);
    g.gain.setValueAtTime(0, t);
    for (let i = 0; i < 3; i++) { g.gain.linearRampToValueAtTime(0.25, t + i * 0.08 + 0.02); g.gain.linearRampToValueAtTime(0.02, t + i * 0.08 + 0.07); }
    g.gain.linearRampToValueAtTime(0, t + 0.3);
    o.connect(lp); lp.connect(g); g.connect(master); o.start(t); o.stop(t + 0.35);
  };
  A.blip = (f, dur, vol, type) => {
    if (!A.ctx) return;
    const t = A.ctx.currentTime;
    const o = A.ctx.createOscillator(); o.type = type || 'square'; o.frequency.value = f;
    const g = gain(0); g.gain.setValueAtTime(vol || 0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.1));
    o.connect(g); g.connect(master); o.start(t); o.stop(t + (dur || 0.1) + 0.02);
  };
})(window.GE);
