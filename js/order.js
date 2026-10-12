/* The Holy Drop — order confirmation */
(function () {
  'use strict';

  var esc = HD.esc;
  var root = document.getElementById('order-root');
  var order = HD.storage.read('hd_last_order', null);

  if (!order || !order.id) {
    root.innerHTML =
      '<div class="empty-state">' +
        '<h1>No recent order</h1>' +
        '<p>We couldn’t find a recent order in this browser.</p>' +
        '<a class="btn btn-primary" href="shop.html">Continue shopping</a>' +
      '</div>';
    return;
  }

  // Rebuild display lines from the saved order (prices as they were at checkout).
  var lines = order.lines.map(function (l) {
    var product = HD.getProduct(l.id) || { name: l.id, image: 'img/favicon.svg', tint: '#f4ecdc' };
    return { product: product, variant: { size: l.size, price: l.price }, qty: l.qty, total: l.total };
  });

  var placed = new Date(order.placedAt);
  function addDays(d, n) { var c = new Date(d); c.setDate(c.getDate() + n); return c; }
  var dayFmt = { day: 'numeric', month: 'short' };
  var eta = addDays(placed, 3).toLocaleDateString('en-IN', dayFmt) + ' – ' + addDays(placed, 7).toLocaleDateString('en-IN', dayFmt);
  var a = order.address;
  var firstName = order.customer.name.split(' ')[0];

  var tick = '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  document.title = 'Order ' + order.id + ' — ' + HD.config.storeName;

  root.innerHTML =
    '<div class="order-card">' +
      '<div class="order-hero">' +
        '<div class="tick">' + tick + '</div>' +
        '<h1>Thank you, ' + esc(firstName) + '!</h1>' +
        '<p class="muted">Your order has been placed. A confirmation would be sent to <strong>' + esc(order.customer.email) + '</strong>.</p>' +
      '</div>' +
      (HD.config.demoMode
        ? '<div class="notice notice-info" style="margin-bottom:24px"><p><strong>This is a demo order.</strong> No payment was taken and nothing will be shipped.</p></div>'
        : '') +
      '<dl class="order-meta">' +
        '<div><dt>Order number</dt><dd>' + esc(order.id) + '</dd></div>' +
        '<div><dt>Date</dt><dd>' + placed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + '</dd></div>' +
        '<div><dt>Payment</dt><dd>' + esc(order.payment) + '</dd></div>' +
        '<div><dt>Estimated delivery</dt><dd>' + eta + '</dd></div>' +
      '</dl>' +
      HD.summary.items(lines) +
      HD.summary.rows(order.totals) +
      '<div class="order-cols">' +
        '<div><h3>Delivering to</h3><p>' +
          esc(order.customer.name) + '<br>' +
          esc(a.line1) + (a.line2 ? '<br>' + esc(a.line2) : '') + '<br>' +
          esc(a.city) + ', ' + esc(a.state) + ' ' + esc(a.pin) + '<br>' +
          '+91 ' + esc(order.customer.phone) +
        '</p></div>' +
        '<div><h3>What happens next</h3><p>We pack your order within 1–2 working days and send tracking details by SMS and email.</p></div>' +
      '</div>' +
      '<div style="text-align:center;margin-top:32px"><a class="btn btn-primary" href="shop.html">Continue shopping</a></div>' +
    '</div>';
})();
