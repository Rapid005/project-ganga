/* The Holy Drop — immersive scenes.
   Builds a layered, gently moving picture inside any <div class="scene" data-scene="name">.
   Layers and overlay positions come from js/scene-data.js (1200 × 800 units). */
(function () {
  'use strict';

  var DATA = window.HD_SCENES || {};
  var NS = 'http://www.w3.org/2000/svg';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  // How far each layer moves with the pointer and on scroll: far things move least.
  var DEPTH = { sky: 0, clouds: 0.06, far: 0.14, mid: 0.32, front: 0.7, mist: 0.55, rays: 0 };

  var FLAG = 'c18 4 30 12 40 22c-14 0-28-4-40-10z';
  var BIRD = 'M0 0q5 -5 10 0q5 -5 10 0';

  function esc(t) { return t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function rand(seed) {
    // small deterministic generator, so each visit looks the same
    return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  }

  function overlays(name, layer, d) {
    var r = rand(name.length * 977 + layer.length), s = '';
    if (layer === 'far') {
      s += '<g class="scene-birds">';
      [[0, 0, 1], [26, 14, 0.8], [48, -6, 0.7], [-34, 20, 0.6]].forEach(function (b, i) {
        s += '<g transform="translate(' + b[0] + ' ' + (250 + b[1]) + ') scale(' + b[2] + ')">' +
          '<path class="scene-wing" style="animation-delay:-' + (i * 0.17).toFixed(2) + 's" d="' + BIRD +
          '" stroke="#41506a" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';
      });
      s += '</g>';
    }
    if (layer !== 'front') return s;
    (d.sparkles || []).forEach(function (p) {
      var delay = (r() * 4).toFixed(2), size = (0.9 + r() * 1.3).toFixed(2);
      s += '<path class="scene-sparkle" style="animation-delay:-' + delay + 's" transform="translate(' + p[0] + ' ' + p[1] + ')" ' +
        'd="M0 -' + size * 3 + 'L' + size * 0.6 + ' 0L0 ' + size * 3 + 'L-' + size * 0.6 + ' 0zM-' + size * 3 + ' 0L0 ' + size * 0.6 + 'L' + size * 3 + ' 0L0 -' + size * 0.6 + 'z" fill="#fff"/>';
    });
    (d.diyas || []).forEach(function (p) {
      s += '<circle class="scene-flicker" style="animation-delay:-' + (r() * 2).toFixed(2) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="url(#scene-glow-' + name + ')"/>';
    });
    (d.flags || []).forEach(function (f, i) {
      s += '<path class="scene-flag" style="animation-delay:-' + (i * 0.7).toFixed(1) + 's" d="M' + f[0] + ' ' + f[1] + FLAG + '" fill="' + f[2] + '"/>';
    });
    if (d.kalash) {
      var kx = d.kalash[0], ky = d.kalash[1] + 8;
      for (var i = 0; i < 3; i++) {
        s += '<ellipse class="scene-ripple" style="animation-delay:-' + (i * 1.4).toFixed(1) + 's" cx="' + kx + '" cy="' + ky +
          '" rx="40" ry="6" fill="none" stroke="#fff" stroke-width="1.6"/>';
      }
    }
    return s;
  }

  function build(el) {
    var name = el.getAttribute('data-scene'), d = DATA[name];
    if (!d) return;
    var svg = '<svg class="scene-svg" xmlns="' + NS + '" viewBox="0 0 1200 800" preserveAspectRatio="xMidY' + (el.getAttribute('data-align') === 'bottom' ? 'Max' : 'Mid') + ' slice" role="img" focusable="false" aria-label="' + esc(el.getAttribute('data-label') || '') + '">' +
      '<defs><radialGradient id="scene-glow-' + name + '"><stop offset="0" stop-color="#ffe08a" stop-opacity=".95"/>' +
      '<stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient></defs><g class="scene-zoom">';
    d.layers.forEach(function (layer) {
      var img = '<image href="' + d.src[layer] + '" width="1200" height="800" preserveAspectRatio="none"/>';
      if (layer === 'clouds') img = '<g class="scene-drift">' + img + '</g>';
      if (layer === 'mist') img = '<g class="scene-mist">' + img + '</g>';
      if (layer === 'rays') img = '<g class="scene-rays">' + img + '</g>';
      svg += '<g class="scene-layer" data-depth="' + (DEPTH[layer] || 0) + '">' + img + overlays(name, layer, d) + '</g>';
    });
    svg += '</g></svg>';
    el.insertAdjacentHTML('afterbegin', svg);
    focus(el);
    window.addEventListener('resize', function () { focus(el); });

    // fade in once every layer has loaded
    var pending = d.layers.length;
    d.layers.forEach(function (layer) {
      var im = new Image();
      im.onload = im.onerror = function () { if (--pending === 0) el.classList.add('is-ready'); };
      im.src = d.src[layer];
    });

    // pause the animations while the scene is off screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        el.classList.toggle('is-paused', !entries[0].isIntersecting);
      }).observe(el);
    }
    if (!reduceMotion) parallax(el);
    if (el.hasAttribute('data-sound') && window.HDAmbience) window.HDAmbience.button(el, el.getAttribute('data-sound'));
  }

  // On narrow screens the picture is cropped at the sides: keep its point of interest in view.
  function focus(el) {
    var svgEl = el.querySelector('.scene-svg'), fx = +(el.getAttribute('data-focus') || 600);
    var ratio = el.clientWidth / Math.max(1, el.clientHeight), x = 0;
    if (ratio < 1.5) {
      var half = 400 * ratio;
      x = Math.max(half, Math.min(1200 - half, fx)) - 600;
    }
    svgEl.setAttribute('viewBox', x.toFixed(1) + ' 0 1200 800');
  }

  function parallax(el) {
    var layers = [].slice.call(el.querySelectorAll('.scene-layer'));
    var tx = 0, ty = 0, cx = 0, cy = 0, scrollY = 0, raf = 0;

    function frame() {
      raf = 0;
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(function (g) {
        var k = +g.getAttribute('data-depth');
        g.setAttribute('transform', 'translate(' + (-cx * k * 22).toFixed(2) + ' ' + (-cy * k * 10 - scrollY * k).toFixed(2) + ')');
      });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    if (finePointer) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width * 2 - 1;
        ty = (e.clientY - r.top) / r.height * 2 - 1;
        kick();
      });
      el.addEventListener('pointerleave', function () { tx = ty = 0; kick(); });
    }
    window.addEventListener('scroll', function () {
      var r = el.getBoundingClientRect();
      scrollY = Math.max(0, Math.min(r.height, -r.top)) * 0.05;
      kick();
    }, { passive: true });
  }

  function init() { [].forEach.call(document.querySelectorAll('.scene[data-scene]'), build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
