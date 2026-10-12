/* ==========================================================================
   The Holy Drop — shared header, footer, product cards and toasts
   ========================================================================== */
(function () {
  'use strict';

  var esc = HD.esc;
  var fmt = HD.formatINR;
  var page = document.body.getAttribute('data-page');

  var ICONS = {
    logo: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path d="M16 2.5C11.2 9.2 6 14.6 6 20.2a10 10 0 0 0 20 0C26 14.6 20.8 9.2 16 2.5z" fill="#0f5161"/><path d="M9.6 21.2c2.1-1.5 4.3-1.5 6.4 0s4.3 1.5 6.4 0" stroke="#f1b434" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    logoLight: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path d="M16 2.5C11.2 9.2 6 14.6 6 20.2a10 10 0 0 0 20 0C26 14.6 20.8 9.2 16 2.5z" fill="#f4ecdc"/><path d="M9.6 21.2c2.1-1.5 4.3-1.5 6.4 0s4.3 1.5 6.4 0" stroke="#d9742b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  HD.icons = ICONS;

  var NAV = [
    { href: 'index.html', label: 'Home', page: 'home' },
    { href: 'shop.html', label: 'Shop', page: 'shop' },
    { href: 'about.html', label: 'Our Story', page: 'about' },
    { href: 'faq.html', label: 'FAQ', page: 'faq' },
    { href: 'contact.html', label: 'Contact', page: 'contact' }
  ];

  function renderHeader() {
    var mount = document.getElementById('site-header');
    if (!mount) return;
    var nav = NAV.map(function (n) {
      var current = n.page === page || (page === 'product' && n.page === 'shop');
      return '<li><a href="' + n.href + '"' + (current ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>';
    }).join('');

    mount.outerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      (HD.config.demoMode
        ? '<div class="demo-bar"><strong>Demo store</strong> — browse freely; orders are not processed and no payment is taken.</div>'
        : '') +
      '<header class="site-header">' +
        '<div class="container header-inner">' +
          '<a class="logo" href="index.html" aria-label="' + esc(HD.config.storeName) + ' — home">' + ICONS.logo + '<span>' + esc(HD.config.storeName) + '</span></a>' +
          '<nav class="main-nav" id="main-nav" aria-label="Main"><ul>' + nav + '</ul></nav>' +
          '<div class="header-actions">' +
            '<a class="cart-link" href="cart.html" aria-label="Cart">' + ICONS.bag +
              '<span class="cart-count" data-cart-count hidden>0</span></a>' +
            '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">' + ICONS.menu + '</button>' +
          '</div>' +
        '</div>' +
      '</header>';

    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('main-nav');
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.innerHTML = open ? ICONS.close : ICONS.menu;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) toggle.click();
    });
  }

  function renderFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;
    var year = new Date().getFullYear();
    mount.outerHTML =
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a class="logo" href="index.html">' + ICONS.logoLight + '<span>' + esc(HD.config.storeName) + '</span></a>' +
              '<p>Sacred Gangajal from five holy places along the Ganga, sealed at the source and delivered to your home.</p>' +
            '</div>' +
            '<div><h3>Shop</h3><ul>' +
              '<li><a href="shop.html">All products</a></li>' +
              '<li><a href="shop.html?category=gangajal">Gangajal</a></li>' +
              '<li><a href="shop.html?category=gift">Gift sets</a></li>' +
              '<li><a href="shop.html?category=bulk">Bulk packs</a></li>' +
            '</ul></div>' +
            '<div><h3>Help</h3><ul>' +
              '<li><a href="faq.html">FAQ</a></li>' +
              '<li><a href="shipping.html">Shipping &amp; returns</a></li>' +
              '<li><a href="contact.html">Contact us</a></li>' +
              '<li><a href="about.html">Our story</a></li>' +
            '</ul></div>' +
            '<div><h3>Legal</h3><ul>' +
              '<li><a href="privacy.html">Privacy policy</a></li>' +
              '<li><a href="terms.html">Terms of sale</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-note">' +
            '<span><strong>For puja and ritual use only. Not for drinking.</strong></span>' +
            '<span>© ' + year + ' ' + esc(HD.config.storeName) + '. All rights reserved.</span>' +
          '</div>' +
        '</div>' +
      '</footer>' +
      '<div class="toast-region" aria-live="polite" aria-atomic="true"></div>';
  }

  function updateCartCount(animate) {
    var count = HD.cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count > 99 ? '99+' : String(count);
      el.hidden = count === 0;
      if (animate && count) {
        el.classList.remove('bump');
        void el.offsetWidth;
        el.classList.add('bump');
      }
    });
    var link = document.querySelector('.cart-link');
    if (link) link.setAttribute('aria-label', 'Cart, ' + count + (count === 1 ? ' item' : ' items'));
  }

  var toastTimer;
  function toast(message, action) {
    var region = document.querySelector('.toast-region');
    if (!region) return;
    clearTimeout(toastTimer);
    region.innerHTML = '<div class="toast"><span>' + esc(message) + '</span>' +
      (action ? '<a href="' + action.href + '">' + esc(action.label) + '</a>' : '') + '</div>';
    toastTimer = setTimeout(function () { region.innerHTML = ''; }, 3800);
  }

  function badgeClass(badge) {
    if (badge === 'Gift') return ' badge-gift';
    if (badge === 'New') return ' badge-new';
    return '';
  }

  function productCard(p) {
    var v = p.variants[0];
    var multi = p.variants.length > 1;
    var url = 'product.html?id=' + encodeURIComponent(p.id);
    return '<article class="product-card">' +
      '<a class="product-media" href="' + url + '" style="--tint:' + p.tint + '" tabindex="-1" aria-hidden="true">' +
        (p.badge ? '<span class="badge' + badgeClass(p.badge) + '">' + esc(p.badge) + '</span>' : '') +
        '<img src="' + p.image + '" alt="" loading="lazy" width="400" height="400">' +
      '</a>' +
      '<div class="product-body">' +
        '<p class="product-loc">' + esc(p.location) + '</p>' +
        '<h3 class="product-name"><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
        '<p class="product-price">' + (multi ? '<span class="from">From</span> ' : '') + fmt(v.price) +
          (v.mrp > v.price ? '<s>' + fmt(v.mrp) + '</s>' : '') + '</p>' +
        '<button type="button" class="btn btn-dark btn-sm btn-block" data-add-to-cart data-id="' + esc(p.id) + '" data-size="' + esc(v.size) + '">' +
          (multi ? 'Add ' + esc(v.size) : 'Add to cart') + '</button>' +
      '</div>' +
    '</article>';
  }

  // One handler for every "add to cart" button on every page.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var size = btn.getAttribute('data-size');
    var qty = parseInt(btn.getAttribute('data-qty') || '1', 10);
    var product = HD.getProduct(id);
    if (!product) return;
    HD.cart.add(id, size, qty);
    var redirect = btn.getAttribute('data-redirect');
    if (redirect) { window.location.href = redirect; return; }
    toast('Added ' + product.name + ' (' + size + ')' + (qty > 1 ? ' × ' + qty : ''), { href: 'cart.html', label: 'View cart' });
  });

  renderHeader();
  renderFooter();
  updateCartCount(false);
  window.addEventListener('hd:cartchange', function () { updateCartCount(true); });

  HD.ui = { toast: toast, productCard: productCard, updateCartCount: updateCartCount };
})();
