/* The Holy Drop — immersive scenes.
   Builds a layered, gently moving picture inside any <div class="scene" data-scene="name">.
   Each depth layer is its own composited element, so the browser only moves finished
   pictures around instead of repainting them. Layer files and overlay positions come
   from js/scene-data.js; overlay positions are in the painting's own units. */
(function () {
  'use strict';

  var DATA = window.HD_SCENES || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  // How far each layer moves with the pointer and on scroll: far things move least.
  var DEPTH = { sky: 0, clouds: 0.06, far: 0.14, mid: 0.32, front: 0.7, mist: 0.55, rays: 0 };
  var WRAP = { clouds: 'scene-drift', mist: 'scene-mist', rays: 'scene-rays' };

  var FLAG = 'c18 4 30 12 40 22c-14 0-28-4-40-10z';
  var BIRD = 'M0 0q5 -5 10 0q5 -5 10 0';
  // small flocks crossing at different heights and speeds: [height, birds, size, seconds, delay]
  var FLOCKS = [[250, 4, 1, 48, 0], [185, 3, 0.75, 62, -22], [300, 2, 0.85, 41, -30], [150, 1, 0.6, 75, -55], [215, 3, 0.65, 68, -10]];
  var V = [[0, 0], [24, 13], [46, -5], [-30, 18]];

  function rand(seed) {
    // small deterministic generator, so each visit looks the same
    return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  }

  function overlays(name, layer, d) {
    var r = rand(name.length * 977 + layer.length), s = '';
    if (layer === 'far') {
      FLOCKS.forEach(function (fl, n) {
        s += '<g transform="translate(0 ' + fl[0] + ')"><g class="scene-birds" style="animation-duration:' + fl[3] + 's;animation-delay:' + fl[4] + 's">';
        for (var i = 0; i < fl[1]; i++) {
          s += '<g transform="translate(' + V[i % 4][0] * fl[2] + ' ' + V[i % 4][1] * fl[2] + ') scale(' + fl[2] + ')">' +
            '<path class="scene-wing" style="animation-delay:-' + ((i + n) * 0.17).toFixed(2) + 's" d="' + BIRD +
            '" stroke="#41506a" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';
        }
        s += '</g></g>';
      });
    }
    if (layer !== 'front') return s;
    (d.sparkles || []).forEach(function (p) {
      var delay = (r() * 4).toFixed(2), z = 0.9 + r() * 1.3;
      s += '<path class="scene-sparkle" style="animation-delay:-' + delay + 's" transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + z.toFixed(2) + ')" ' +
        'd="M0 -3L.6 0L0 3L-.6 0zM-3 0L0 .6L3 0L0 -.6z" fill="#fff"/>';
    });
    (d.diyas || []).forEach(function (p) {
      s += '<circle class="scene-flicker" style="animation-delay:-' + (r() * 2).toFixed(2) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="url(#scene-glow-' + name + ')"/>';
    });
    (d.flags || []).forEach(function (f, i) {
      s += '<path class="scene-flag" style="animation-delay:-' + (i * 0.7).toFixed(1) + 's" d="M' + f[0] + ' ' + f[1] + FLAG + '" fill="' + f[2] + '"/>';
    });
    if (d.kalash) {
      for (var i = 0; i < 3; i++) {
        s += '<ellipse class="scene-ripple" style="animation-delay:-' + (i * 1.4).toFixed(1) + 's" cx="' + d.kalash[0] + '" cy="' + d.kalash[1] +
          '" rx="40" ry="6" fill="none" stroke="#fff" stroke-width="1.6"/>';
      }
    }
    if (!s) return '';
    return '<svg class="scene-ov" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<defs><radialGradient id="scene-glow-' + name + '"><stop offset="0" stop-color="#ffe08a" stop-opacity=".95"/>' +
      '<stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient></defs>' + s + '</svg>';
  }

  function layerEl(depth, html) {
    var div = document.createElement('div');
    div.className = 'scene-layer';
    div.setAttribute('data-depth', depth);
    div.innerHTML = html;
    return div;
  }

  function build(el) {
    var name = el.getAttribute('data-scene'), d = DATA[name];
    if (!d) return;
    var stage = document.createElement('div');
    stage.className = 'scene-stage';
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', el.getAttribute('data-label') || '');
    d.layers.forEach(function (layer) {
      var img = '<img class="scene-img" src="' + d.src[layer] + '" alt="" decoding="async" draggable="false">';
      if (WRAP[layer]) img = '<div class="' + WRAP[layer] + '">' + img + '</div>';
      stage.appendChild(layerEl(DEPTH[layer] || 0, img));
      var ov = overlays(name, layer, d);
      if (ov) stage.appendChild(layerEl(DEPTH[layer] || 0, ov));   // its own layer, so animating it never repaints the picture
    });
    el.insertBefore(stage, el.firstChild);

    var fit = function () { focus(el, d); };
    fit();
    window.addEventListener('resize', fit);

    // show the scene, and start its motion, only once every layer is decoded
    var imgs = [].slice.call(stage.querySelectorAll('img'));
    Promise.all(imgs.map(function (im) { return im.decode ? im.decode().catch(function () {}) : null; })).then(function () {
      requestAnimationFrame(function () {
        el.classList.add('is-ready');
        if (!reduceMotion) parallax(el);
      });
    });

    // pause the animations while the scene is off screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        el.classList.toggle('is-paused', !entries[0].isIntersecting);
      }).observe(el);
    }
    if (el.hasAttribute('data-sound') && window.HDAmbience) window.HDAmbience.button(el, el.getAttribute('data-sound'));
  }

  // Crop the painting to the box like `object-fit: cover`, centred on data-focus (an x position in
  // painting units), and line the overlays up with the same crop. data-focus-wide, if set, is used
  // instead on wider screens, where the text panel sits over the left of the picture.
  function focus(el, d) {
    var art = d.art || [0, 0, 1200, 800], ax = art[0], ay = art[1], aw = art[2], ah = art[3];
    var box = el.querySelector('.scene-layer'), bw = box.clientWidth, bh = Math.max(1, box.clientHeight);
    var wide = el.getAttribute('data-focus-wide');
    var fx = +((wide && bw >= 760 ? wide : el.getAttribute('data-focus')) || ax + aw / 2), r = bw / bh, vx, vy, vw, vh;
    if (r < aw / ah) {
      vh = ah; vw = ah * r; vy = ay;
      vx = Math.max(ax, Math.min(ax + aw - vw, fx - vw / 2));
    } else {
      vw = aw; vh = aw / r; vx = ax;
      vy = el.getAttribute('data-align') === 'bottom' ? ay + ah - vh : ay + (ah - vh) / 2;
    }
    var pos = (aw > vw ? (vx - ax) / (aw - vw) * 100 : 50).toFixed(2) + '% ' + (ah > vh ? (vy - ay) / (ah - vh) * 100 : 50).toFixed(2) + '%';
    [].forEach.call(el.querySelectorAll('.scene-img'), function (im) { im.style.objectPosition = pos; });
    [].forEach.call(el.querySelectorAll('.scene-ov'), function (s) {
      s.setAttribute('viewBox', [vx, vy, vw, vh].map(function (v) { return v.toFixed(1); }).join(' '));
    });
  }

  function parallax(el) {
    var layers = [].slice.call(el.querySelectorAll('.scene-layer'));
    var tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, raf = 0;

    function frame() {
      raf = 0;
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(function (g) {
        var k = +g.getAttribute('data-depth');
        if (k) g.style.transform = 'translate3d(' + (-cx * k * 18).toFixed(2) + 'px,' + (-cy * k * 8 - sy * k).toFixed(2) + 'px,0)';
      });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    if (finePointer) {
      el.addEventListener('pointermove', function (e) {
        var b = el.getBoundingClientRect();
        tx = (e.clientX - b.left) / b.width * 2 - 1;
        ty = (e.clientY - b.top) / b.height * 2 - 1;
        kick();
      });
      el.addEventListener('pointerleave', function () { tx = ty = 0; kick(); });
    }
    window.addEventListener('scroll', function () {
      var b = el.getBoundingClientRect();
      sy = Math.max(0, Math.min(b.height, -b.top)) * 0.05;
      kick();
    }, { passive: true });
  }

  function init() { [].forEach.call(document.querySelectorAll('.scene[data-scene]'), build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
