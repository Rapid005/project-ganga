/* The Holy Drop — home page */
(function () {
  'use strict';

  var featuredIds = ['haridwar-gangajal', 'kashi-gangajal', 'gangotri-gangajal', 'pancha-tirtha-set'];
  var featured = featuredIds.map(HD.getProduct).filter(Boolean);
  document.getElementById('featured-grid').innerHTML = featured.map(HD.ui.productCard).join('');

  document.getElementById('sources-grid').innerHTML = HD.sources.map(function (s, i) {
    return '<a class="source-card" href="shop.html?source=' + s.id + '">' +
      '<span class="source-num">0' + (i + 1) + '</span>' +
      '<h3>' + HD.esc(s.name) + '</h3>' +
      '<span class="source-place">' + HD.esc(s.place) + '</span>' +
      '<p>' + HD.esc(s.blurb) + '</p>' +
      '<span class="source-link">Shop ' + HD.esc(s.name) + ' →</span>' +
    '</a>';
  }).join('');

  var gift = HD.getProduct('pancha-tirtha-set');
  if (gift) {
    var v = gift.variants[0];
    document.getElementById('promo-price').innerHTML =
      HD.formatINR(v.price) + (v.mrp > v.price ? '<s>' + HD.formatINR(v.mrp) + '</s>' : '');
  }
})();
