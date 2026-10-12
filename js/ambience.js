/* The Holy Drop — optional ambient sound for the scenes.
   Everything is synthesised in the browser (no audio files), and nothing plays until
   the visitor asks.
   - "dawn" (home): a mountain breeze, the river far below, birdsong with a koel's call
     and a temple bell somewhere down the valley.
   - "ghat" (Our story): water lapping at the steps, the glug of a kalash filling, the
     temple bell close by and now and then the small aarti bell. */
(function () {
  'use strict';

  var ctx = null, master = null, timers = [], playing = false, buttons = [];

  function noiseBuffer(brown) {
    var len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * w) / 1.02; data[i] = last * 3.5; } else data[i] = w;
    }
    return buf;
  }

  function loop(buf) {
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.start(); return src;
  }

  function filter(type, freq, q) {
    var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7; return f;
  }

  function gain(v) { var g = ctx.createGain(); g.gain.value = v; return g; }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function every(fn, min, max, first) {
    later(function tick() { fn(); later(tick, min + Math.random() * (max - min)); }, first);
  }

  // ---------- sounds shared by both scenes

  function bell(level, pitch) {
    var t = ctx.currentTime + 0.05, f0 = pitch * (0.95 + Math.random() * 0.1);
    [[1, 0.22, 6], [2.02, 0.12, 4.2], [2.74, 0.08, 3.2], [3.76, 0.05, 2.4], [5.4, 0.03, 1.6]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f0 * p[0];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(p[1] * level, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g).connect(master); o.start(t); o.stop(t + p[2] + 0.1);
    });
  }

  // ---------- dawn at Gangotri

  function breeze() {
    var lp = filter('lowpass', 420), g = gain(0.25);
    loop(noiseBuffer(true)).connect(lp).connect(g).connect(master);
    (function swell() {
      var t = ctx.currentTime;
      g.gain.setTargetAtTime(0.12 + Math.random() * 0.35, t, 1.8);
      lp.frequency.setTargetAtTime(300 + Math.random() * 400, t, 2);
      later(swell, 3000 + Math.random() * 4000);
    })();
    // the river far below: a soft, steady murmur
    loop(noiseBuffer(false)).connect(filter('bandpass', 700, 0.6)).connect(gain(0.035)).connect(master);
  }

  function chirps() {
    var t = ctx.currentTime + 0.05, n = 2 + Math.floor(Math.random() * 4), base = 2600 + Math.random() * 1200;
    for (var i = 0; i < n; i++) {
      var o = ctx.createOscillator(), g = ctx.createGain(), s = t + i * (0.1 + Math.random() * 0.06);
      o.frequency.setValueAtTime(base, s);
      o.frequency.exponentialRampToValueAtTime(base * 1.5, s + 0.05);
      o.frequency.exponentialRampToValueAtTime(base * 1.2, s + 0.09);
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.03, s + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.1);
      o.connect(g).connect(master); o.start(s); o.stop(s + 0.12);
    }
  }

  function trill() {
    // a fast flutter (tremolo) inside a short swell
    var t = ctx.currentTime + 0.05, o = ctx.createOscillator(), am = ctx.createOscillator(), trem = gain(0.5), env = gain(0);
    o.frequency.value = 3800 + Math.random() * 900;
    am.frequency.value = 22 + Math.random() * 8;
    am.connect(gain(0.5)).connect(trem.gain);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.025, t + 0.05);
    env.gain.linearRampToValueAtTime(0.0001, t + 0.7);
    o.connect(trem).connect(env).connect(master);
    o.start(t); am.start(t); o.stop(t + 0.75); am.stop(t + 0.75);
  }

  function koel() {
    // "ku-oo", rising a little each time, three or four times over
    var t = ctx.currentTime + 0.05, times = 3 + Math.floor(Math.random() * 2), f = 620 + Math.random() * 60;
    for (var i = 0; i < times; i++) {
      var s = t + i * 1.1, o = ctx.createOscillator(), g = ctx.createGain(), ff = f * (1 + i * 0.06);
      o.type = 'sine';
      o.frequency.setValueAtTime(ff, s);
      o.frequency.linearRampToValueAtTime(ff * 1.32, s + 0.16);
      o.frequency.setValueAtTime(ff * 1.18, s + 0.2);
      o.frequency.linearRampToValueAtTime(ff * 1.36, s + 0.48);
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.05, s + 0.04);
      g.gain.setValueAtTime(0.05, s + 0.15);
      g.gain.exponentialRampToValueAtTime(0.012, s + 0.2);
      g.gain.exponentialRampToValueAtTime(0.045, s + 0.26);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.55);
      o.connect(g).connect(master); o.start(s); o.stop(s + 0.6);
    }
  }

  function dawn() {
    breeze();
    every(chirps, 2500, 7000, 800);
    every(trill, 6000, 14000, 3500);
    every(koel, 14000, 26000, 6000);
    every(function () { bell(0.35, 470); }, 26000, 42000, 9000);
  }

  // ---------- at the ghat

  function lapping() {
    var lp = filter('lowpass', 700), g = gain(0.05);
    loop(noiseBuffer(true)).connect(lp).connect(g).connect(master);
    (function wave() {
      var t = ctx.currentTime, peak = 0.35 + Math.random() * 0.35;
      g.gain.cancelScheduledValues(t);
      g.gain.setTargetAtTime(peak, t, 0.25);              // a wave washes up the step ...
      g.gain.setTargetAtTime(0.06, t + 0.7, 0.6);         // ... and draws back
      lp.frequency.setTargetAtTime(900 + Math.random() * 500, t, 0.3);
      lp.frequency.setTargetAtTime(500, t + 0.7, 0.6);
      later(wave, 2200 + Math.random() * 1800);
    })();
  }

  function glugs() {
    // the kalash filling: bubbles that rise in pitch as the pot fills, over a soft pour
    var t = ctx.currentTime + 0.05, n = 8 + Math.floor(Math.random() * 5), at = t;
    var pour = ctx.createBufferSource(), pg = gain(0), bp = filter('bandpass', 1100, 1.2);
    pour.buffer = noiseBuffer(false); pour.connect(bp).connect(pg).connect(master);
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.linearRampToValueAtTime(0.05, t + 0.15);
    for (var i = 0; i < n; i++) {
      var o = ctx.createOscillator(), g = ctx.createGain(), f = 190 + i * 22 + Math.random() * 40;
      o.frequency.setValueAtTime(f, at);
      o.frequency.exponentialRampToValueAtTime(f * 2.3, at + 0.05);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.16, at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.08);
      o.connect(g).connect(master); o.start(at); o.stop(at + 0.1);
      at += 0.11 + Math.random() * 0.09;
    }
    pg.gain.linearRampToValueAtTime(0.0001, at + 0.3);
    pour.start(t); pour.stop(at + 0.4);
  }

  function aartiBell() {
    // the small brass hand bell, rung quickly
    var t = ctx.currentTime + 0.05, n = 8 + Math.floor(Math.random() * 6);
    for (var i = 0; i < n; i++) {
      var s = t + i * 0.13;
      [[1, 0.05], [2.4, 0.025], [4.1, 0.012]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = 1750 * p[0];
        g.gain.setValueAtTime(0.0001, s);
        g.gain.exponentialRampToValueAtTime(p[1], s + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, s + 0.45);
        o.connect(g).connect(master); o.start(s); o.stop(s + 0.5);
      });
    }
  }

  function ghat() {
    lapping();
    every(glugs, 8000, 13000, 1500);
    every(function () { bell(1, 470); }, 15000, 26000, 4000);
    every(aartiBell, 28000, 45000, 12000);
  }

  // ---------- controls

  function start(kind) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.0001; master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.5);
    if (kind === 'ghat') ghat(); else dawn();
    return true;
  }

  function stop() {
    timers.forEach(clearTimeout); timers = [];
    if (!ctx) return;
    var c = ctx; ctx = null;
    master.gain.setTargetAtTime(0.0001, c.currentTime, 0.2);
    setTimeout(function () { c.close(); }, 800);
  }

  var ICON_ON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

  function render() {
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', playing ? 'true' : 'false');
      b.innerHTML = (playing ? ICON_ON : ICON_OFF) + '<span>' + (playing ? 'Sound on' : b.getAttribute('data-label')) + '</span>';
    });
  }

  window.HDAmbience = {
    button: function (scene, kind) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'scene-sound';
      b.setAttribute('data-label', kind === 'ghat' ? 'Hear the ghat' : 'Hear the dawn');
      b.addEventListener('click', function () {
        if (playing) { stop(); playing = false; } else { playing = start(kind); }
        render();
      });
      scene.appendChild(b);
      buttons.push(b);
      render();
    }
  };

  // go quiet when the tab is hidden; resume when it comes back
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
})();
