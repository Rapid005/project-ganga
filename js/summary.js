/* The Holy Drop — order summary shared by the cart, checkout and confirmation pages */
(function () {
  'use strict';

  var fmt = HD.formatINR;
  var esc = HD.esc;

  // `t` is the result of HD.cart.totals() (or a saved copy of it on an order).
  function rows(t) {
    return '<div class="summary-row"><span>Subtotal</span><span>' + fmt(t.subtotal) + '</span></div>' +
      (t.discount
        ? '<div class="summary-row discount"><span>Discount (' + esc(t.couponCode) + ')</span><span>−' + fmt(t.discount) + '</span></div>'
        : '') +
      '<div class="summary-row"><span>Shipping</span><span>' + (t.shipping ? fmt(t.shipping) : 'Free') + '</span></div>' +
      '<div class="summary-row summary-total"><span>Total</span><span>' + fmt(t.total) + '</span></div>';
  }

  // `lines` are { product, variant, qty, total } objects.
  function items(lines) {
    return '<ul class="summary-items">' + lines.map(function (l) {
      return '<li>' +
        '<span class="thumb" style="--tint:' + l.product.tint + '"><img src="' + l.product.image + '" alt="" width="52" height="52"><b>' + l.qty + '</b></span>' +
        '<span class="name">' + esc(l.product.name) + '<small>' + esc(l.variant.size) + '</small></span>' +
        '<span>' + fmt(l.total) + '</span>' +
      '</li>';
    }).join('') + '</ul>';
  }

  function shippingProgress(t) {
    if (!t.subtotal) return '';
    if (t.freeShippingRemaining === 0) {
      return '<div class="ship-progress">🎉 You’ve unlocked <strong>free shipping</strong>.</div>';
    }
    var pct = Math.min(100, Math.round((1 - t.freeShippingRemaining / HD.config.freeShippingThreshold) * 100));
    return '<div class="ship-progress">Add <strong>' + fmt(t.freeShippingRemaining) + '</strong> more for free shipping.' +
      '<div class="bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div></div>';
  }

  HD.summary = { rows: rows, items: items, shippingProgress: shippingProgress };
})();
