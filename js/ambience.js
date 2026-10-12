/* The Holy Drop — optional ambient sound for the scenes.
   Everything is synthesised in the browser (no audio files): flowing water,
   a distant temple bell and, at Gangotri, birdsong. Off until the visitor asks. */
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

  function river() {
    // a deep, steady rush ...
    var low = ctx.createGain(); low.gain.value = 0.55;
    loop(noiseBuffer(true)).connect(low).connect(master);
    // ... plus a lighter babble whose brightness wanders like water over stones
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.9;
    var g = ctx.createGain(); g.gain.value = 0.05;
    loop(noiseBuffer(false)).connect(bp).connect(g).connect(master);
    (function wander() {
      var t = ctx.currentTime;
      bp.frequency.setTargetAtTime(900 + Math.random() * 1600, t, 0.25);
      g.gain.setTargetAtTime(0.03 + Math.random() * 0.05, t, 0.3);
      timers.push(setTimeout(wander, 280 + Math.random() * 400));
    })();
  }

  function bell() {
    var t = ctx.currentTime + 0.05, f0 = 470 + Math.random() * 60;
    [[1, 0.22, 6], [2.02, 0.12, 4.2], [2.74, 0.08, 3.2], [3.76, 0.05, 2.4], [5.4, 0.03, 1.6]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f0 * p[0];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(p[1], t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g).connect(master); o.start(t); o.stop(t + p[2] + 0.1);
    });
  }

  function chirps() {
    var t = ctx.currentTime + 0.05, n = 2 + Math.floor(Math.random() * 3), base = 2600 + Math.random() * 900;
    for (var i = 0; i < n; i++) {
      var o = ctx.createOscillator(), g = ctx.createGain(), s = t + i * 0.13;
      o.frequency.setValueAtTime(base, s);
      o.frequency.exponentialRampToValueAtTime(base * 1.5, s + 0.05);
      o.frequency.exponentialRampToValueAtTime(base * 1.2, s + 0.09);
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.035, s + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.1);
      o.connect(g).connect(master); o.start(s); o.stop(s + 0.12);
    }
  }

  function every(fn, min, max, first) {
    timers.push(setTimeout(function tick() { fn(); timers.push(setTimeout(tick, min + Math.random() * (max - min))); }, first));
  }

  function start(kind) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.0001; master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.5);
    river();
    every(bell, 16000, 28000, 2500);
    if (kind === 'river') every(chirps, 5000, 12000, 1500);
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
      b.setAttribute('data-label', kind === 'ghat' ? 'Hear the ghat' : 'Hear the river');
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
