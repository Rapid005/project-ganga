/* The Holy Drop — cart page */
(function () {
  'use strict';

  var esc = HD.esc;
  var fmt = HD.formatINR;
  var root = document.getElementById('cart-root');
  var couponMessage = null; // { ok, text } shown after applying a code

  function itemRow(l) {
    var url = 'product.html?id=' + encodeURIComponent(l.product.id) + '&size=' + encodeURIComponent(l.variant.size);
    var key = 'data-id="' + esc(l.product.id) + '" data-size="' + esc(l.variant.size) + '"';
    return '<div class="cart-item">' +
      '<a class="cart-thumb" href="' + url + '" style="--tint:' + l.product.tint + '" tabindex="-1" aria-hidden="true"><img src="' + l.product.image + '" alt="" width="88" height="88"></a>' +
      '<div class="cart-info">' +
        '<h3><a href="' + url + '">' + esc(l.product.name) + '</a></h3>' +
        '<p class="meta">' + esc(l.variant.size) + ' · ' + fmt(l.variant.price) + ' each</p>' +
      '</div>' +
      '<div class="cart-controls">' +
        '<div class="qty qty-sm">' +
          '<button type="button" data-action="dec" ' + key + ' aria-label="Decrease quantity of ' + esc(l.product.name) + '">−</button>' +
          '<input type="number" inputmode="numeric" min="1" max="' + HD.cart.MAX_QTY + '" value="' + l.qty + '" data-action="set" ' + key + ' aria-label="Quantity of ' + esc(l.product.name) + '">' +
          '<button type="button" data-action="inc" ' + key + ' aria-label="Increase quantity of ' + esc(l.product.name) + '">+</button>' +
        '</div>' +
        '<button type="button" class="remove-btn" data-action="remove" ' + key + '>Remove</button>' +
      '</div>' +
      '<div class="cart-line-total">' + fmt(l.total) + '</div>' +
    '</div>';
  }

  function couponHint() {
    var code = HD.config.featuredCoupon;
    var coupon = code && HD.config.coupons[code];
    if (!coupon) return '';
    return '<p class="coupon-hint">Festive offer: use <code>' + esc(code) + '</code> for ' + esc(coupon.label) + '.</p>';
  }

  function couponBlock(t) {
    var code = HD.cart.couponCode();
    if (code) {
      return '<div class="summary-row" style="font-size:.88rem"><span>Coupon <strong>' + esc(code) + '</strong>' +
        (t.discount ? '' : ' <span class="muted">(not yet applicable)</span>') + '</span>' +
        '<button type="button" class="btn-link" data-action="remove-coupon">Remove</button></div>' +
        (couponMessage ? '<p class="coupon-msg ' + (couponMessage.ok ? 'ok' : 'err') + '">' + esc(couponMessage.text) + '</p>' : '');
    }
    return '<form class="coupon-form" id="coupon-form" novalidate>' +
        '<label for="coupon-input" class="visually-hidden">Coupon code</label>' +
        '<input class="input" id="coupon-input" name="coupon" placeholder="Coupon code" autocomplete="off">' +
        '<button class="btn btn-secondary btn-sm" type="submit">Apply</button>' +
      '</form>' +
      '<p class="coupon-msg ' + (couponMessage && couponMessage.ok ? 'ok' : 'err') + '" aria-live="polite">' + (couponMessage ? esc(couponMessage.text) : '') + '</p>' +
      couponHint();
  }

  function render() {
    var lines = HD.cart.lines();
    if (!lines.length) {
      root.innerHTML =
        '<div class="empty-state" style="margin-bottom:56px">' +
          '<div class="empty-icon">' + HD.icons.bag + '</div>' +
          '<h2>Your cart is empty</h2>' +
          '<p>Find Gangajal from the place that means the most to you.</p>' +
          '<a class="btn btn-primary" href="shop.html">Start shopping</a>' +
        '</div>';
      return;
    }

    var t = HD.cart.totals();
    var count = HD.cart.count();
    root.innerHTML =
      '<div class="cart-layout">' +
        '<div>' +
          '<div class="cart-items">' + lines.map(itemRow).join('') + '</div>' +
          '<p style="margin-top:16px"><a href="shop.html">← Continue shopping</a></p>' +
        '</div>' +
        '<aside class="summary" aria-label="Order summary">' +
          '<h2>Summary</h2>' +
          HD.summary.shippingProgress(t) +
          '<p class="muted" style="font-size:.88rem;margin-bottom:6px">' + count + (count === 1 ? ' item' : ' items') + '</p>' +
          HD.summary.rows(t) +
          couponBlock(t) +
          '<a class="btn btn-primary btn-lg btn-block" href="checkout.html">Proceed to checkout</a>' +
          '<p class="note" style="text-align:center;margin-top:12px">Prices include all taxes.</p>' +
        '</aside>' +
      '</div>';
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || el.tagName === 'INPUT') return;
    var id = el.getAttribute('data-id');
    var size = el.getAttribute('data-size');
    var item = HD.cart.items().find(function (i) { return i.id === id && i.size === size; });
    switch (el.getAttribute('data-action')) {
      case 'inc': if (item) HD.cart.setQty(id, size, item.qty + 1); break;
      case 'dec': if (item) HD.cart.setQty(id, size, item.qty - 1); break;
      case 'remove': HD.cart.remove(id, size); break;
      case 'remove-coupon': couponMessage = null; HD.cart.removeCoupon(); break;
    }
  });

  root.addEventListener('change', function (e) {
    var el = e.target;
    if (el.getAttribute('data-action') !== 'set') return;
    var n = parseInt(el.value, 10);
    HD.cart.setQty(el.getAttribute('data-id'), el.getAttribute('data-size'), isNaN(n) || n < 1 ? 1 : n);
  });

  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'coupon-form') return;
    e.preventDefault();
    var result = HD.cart.applyCoupon(document.getElementById('coupon-input').value);
    couponMessage = { ok: result.ok, text: result.message };
    render();
  });

  window.addEventListener('hd:cartchange', render);
  render();
})();
