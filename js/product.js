/* The Holy Drop — product detail page */
(function () {
  'use strict';

  var esc = HD.esc;
  var fmt = HD.formatINR;
  var root = document.getElementById('product-root');
  var params = new URLSearchParams(window.location.search);
  var product = HD.getProduct(params.get('id'));

  if (!product) {
    document.title = 'Product not found — ' + HD.config.storeName;
    root.innerHTML =
      '<div class="section"><div class="empty-state">' +
        '<h1>We couldn’t find that product</h1>' +
        '<p>It may have been renamed or is no longer available.</p>' +
        '<a class="btn btn-primary" href="shop.html">Browse all products</a>' +
      '</div></div>';
    return;
  }

  var variant = HD.getVariant(product, params.get('size')) || product.variants[0];
  var qty = 1;

  document.title = product.name + ' — ' + HD.config.storeName;
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', product.short);

  var check = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var warn = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>';

  var sourceNames = product.sources.map(function (id) { return HD.getSource(id).name; });
  var categoryName = HD.categories.find(function (c) { return c.id === product.category; }).name;

  var sizes = product.variants.map(function (v, i) {
    return '<label class="size-option">' +
      '<input type="radio" name="size" value="' + esc(v.size) + '"' + (v === variant ? ' checked' : '') + '>' +
      '<span>' + esc(v.size) + '<small>' + fmt(v.price) + '</small></span>' +
    '</label>';
  }).join('');

  root.innerHTML =
    '<nav class="breadcrumb" aria-label="Breadcrumb" style="padding-top:28px">' +
      '<a href="index.html">Home</a><span aria-hidden="true">/</span>' +
      '<a href="shop.html?category=' + product.category + '">' + esc(categoryName) + '</a><span aria-hidden="true">/</span>' +
      esc(product.name) +
    '</nav>' +
    '<div class="pdp">' +
      '<div class="pdp-media" style="--tint:' + product.tint + '">' +
        (product.badge ? '<span class="badge">' + esc(product.badge) + '</span>' : '') +
        '<img src="' + product.image + '" alt="' + esc(product.name) + '" width="400" height="400">' +
      '</div>' +
      '<div class="pdp-info">' +
        '<p class="pdp-loc">' + esc(product.location) + '</p>' +
        '<h1>' + esc(product.name) + '</h1>' +
        '<p class="pdp-short">' + esc(product.short) + '</p>' +
        '<div class="pdp-price" id="pdp-price"></div>' +
        (product.variants.length > 1
          ? '<fieldset class="option-group"><legend class="label">Size</legend><div class="size-options">' + sizes + '</div></fieldset>'
          : '<div class="option-group"><span class="label">Size</span><div class="size-options">' + sizes + '</div></div>') +
        '<div class="option-group"><label class="label" for="qty-input">Quantity</label>' +
          '<div class="qty">' +
            '<button type="button" data-step="-1" aria-label="Decrease quantity">−</button>' +
            '<input id="qty-input" type="number" inputmode="numeric" min="1" max="' + HD.cart.MAX_QTY + '" value="1">' +
            '<button type="button" data-step="1" aria-label="Increase quantity">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="buy-row">' +
          '<button type="button" class="btn btn-dark btn-lg" id="add-btn" data-add-to-cart data-id="' + esc(product.id) + '">Add to cart</button>' +
          '<button type="button" class="btn btn-primary btn-lg" id="buy-btn" data-add-to-cart data-id="' + esc(product.id) + '" data-redirect="cart.html">Buy now</button>' +
        '</div>' +
        '<ul class="pdp-perks">' +
          '<li>' + check + 'Sealed at the source in a tamper-evident bottle</li>' +
          '<li>' + check + 'Free shipping on orders over ' + fmt(HD.config.freeShippingThreshold) + '</li>' +
          '<li>' + check + 'Ships in 1–2 days, delivered in 3–7 days</li>' +
        '</ul>' +
        '<div class="notice" style="margin-bottom:24px">' + warn +
          '<p><strong>For puja and ritual use only. Not for drinking.</strong> Gangajal is river water and is not treated to drinking-water standards.</p>' +
        '</div>' +
        '<div class="accordion">' +
          '<details open><summary>About this Gangajal</summary><div class="acc-body">' +
            product.description.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
          '</div></details>' +
          '<details><summary>Details</summary><div class="acc-body"><ul>' +
            '<li><strong>Source:</strong> ' + esc(sourceNames.join(', ')) + '</li>' +
            '<li><strong>Collected at:</strong> ' + esc(product.location) + '</li>' +
            '<li><strong>Sizes:</strong> ' + esc(product.variants.map(function (v) { return v.size; }).join(', ')) + '</li>' +
            '<li><strong>Packaging:</strong> Food-grade bottle with tamper-evident cap, packed in a leak-proof box</li>' +
            '<li><strong>Shelf life:</strong> Keep sealed, away from direct sunlight</li>' +
          '</ul></div></details>' +
          '<details><summary>How to use</summary><div class="acc-body">' +
            '<p>Sprinkle during daily puja, add a few drops to your kalash, use for abhishek, or to sanctify a new home, vehicle or workplace during griha pravesh and other ceremonies.</p>' +
          '</div></details>' +
          '<details><summary>Shipping &amp; returns</summary><div class="acc-body">' +
            '<p>Orders ship within 1–2 working days and arrive in 3–7 days across India. If a bottle arrives damaged or leaking, we’ll replace it free. <a href="shipping.html">Full policy</a>.</p>' +
          '</div></details>' +
        '</div>' +
      '</div>' +
    '</div>';

  var priceEl = document.getElementById('pdp-price');
  var qtyInput = document.getElementById('qty-input');
  var addBtn = document.getElementById('add-btn');
  var buyBtn = document.getElementById('buy-btn');

  function update() {
    var save = variant.mrp > variant.price ? Math.round((1 - variant.price / variant.mrp) * 100) : 0;
    priceEl.innerHTML =
      '<span class="now">' + fmt(variant.price * qty) + '</span>' +
      (save ? '<s>' + fmt(variant.mrp * qty) + '</s><span class="save">Save ' + save + '%</span>' : '') +
      '<span class="tax">' + (qty > 1 ? qty + ' × ' + fmt(variant.price) + ' · ' : '') + 'Inclusive of all taxes</span>';
    [addBtn, buyBtn].forEach(function (b) {
      b.setAttribute('data-size', variant.size);
      b.setAttribute('data-qty', String(qty));
    });
  }

  function setQty(value) {
    var n = parseInt(value, 10);
    if (isNaN(n) || n < 1) n = 1;
    qty = Math.min(HD.cart.MAX_QTY, n);
    qtyInput.value = qty;
    update();
  }

  root.querySelectorAll('input[name="size"]').forEach(function (input) {
    input.addEventListener('change', function () {
      variant = HD.getVariant(product, input.value);
      update();
    });
  });
  root.querySelectorAll('.qty [data-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setQty(qty + parseInt(btn.getAttribute('data-step'), 10));
    });
  });
  qtyInput.addEventListener('change', function () { setQty(qtyInput.value); });

  update();

  // Related products: same category first, then the rest.
  var related = HD.products
    .filter(function (p) { return p.id !== product.id; })
    .sort(function (a, b) {
      return (b.category === product.category) - (a.category === product.category);
    })
    .slice(0, 4);
  document.getElementById('related-grid').innerHTML = related.map(HD.ui.productCard).join('');
  document.getElementById('related-section').hidden = related.length === 0;
})();
