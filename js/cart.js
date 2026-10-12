/* ==========================================================================
   The Holy Drop — cart (stored in the visitor's browser)
   ========================================================================== */
(function () {
  'use strict';

  var CART_KEY = 'hd_cart';
  var COUPON_KEY = 'hd_coupon';
  var MAX_QTY = 20;

  // Fallback for browsers where localStorage is blocked (private mode etc.).
  var memory = {};

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return key in memory ? memory[key] : fallback;
    }
  }

  function write(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory only */ }
  }

  function erase(key) {
    delete memory[key];
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  function notify() {
    window.dispatchEvent(new CustomEvent('hd:cartchange'));
  }

  function clampQty(qty) {
    qty = parseInt(qty, 10);
    if (isNaN(qty)) return 1;
    return Math.max(0, Math.min(MAX_QTY, qty));
  }

  // Only keep items that still exist in the catalogue.
  function items() {
    var list = read(CART_KEY, []);
    if (!Array.isArray(list)) return [];
    return list.filter(function (item) {
      return HD.getVariant(HD.getProduct(item.id), item.size) && item.qty > 0;
    });
  }

  function save(list) {
    write(CART_KEY, list);
    notify();
  }

  function find(list, id, size) {
    return list.findIndex(function (i) { return i.id === id && i.size === size; });
  }

  var cart = {
    MAX_QTY: MAX_QTY,

    items: items,

    add: function (id, size, qty) {
      if (!HD.getVariant(HD.getProduct(id), size)) return;
      var list = items();
      var idx = find(list, id, size);
      var add = clampQty(qty || 1) || 1;
      if (idx > -1) list[idx].qty = Math.min(MAX_QTY, list[idx].qty + add);
      else list.push({ id: id, size: size, qty: add });
      save(list);
    },

    setQty: function (id, size, qty) {
      var list = items();
      var idx = find(list, id, size);
      if (idx === -1) return;
      qty = clampQty(qty);
      if (qty === 0) list.splice(idx, 1);
      else list[idx].qty = qty;
      save(list);
    },

    remove: function (id, size) {
      var list = items();
      var idx = find(list, id, size);
      if (idx > -1) { list.splice(idx, 1); save(list); }
    },

    clear: function () {
      erase(CART_KEY);
      erase(COUPON_KEY);
      notify();
    },

    count: function () {
      return items().reduce(function (n, i) { return n + i.qty; }, 0);
    },

    lines: function () {
      return items().map(function (i) {
        var product = HD.getProduct(i.id);
        var variant = HD.getVariant(product, i.size);
        return { product: product, variant: variant, qty: i.qty, total: variant.price * i.qty };
      });
    },

    couponCode: function () {
      return read(COUPON_KEY, null);
    },

    applyCoupon: function (code) {
      code = String(code || '').trim().toUpperCase();
      if (!code) return { ok: false, message: 'Enter a coupon code.' };
      var coupon = HD.config.coupons[code];
      if (!coupon) return { ok: false, message: 'That code isn’t valid.' };
      write(COUPON_KEY, code);
      notify();
      var t = cart.totals();
      if (!t.discount) {
        return { ok: true, message: 'Code saved. It applies on orders above ' + HD.formatINR(coupon.min) + '.' };
      }
      return { ok: true, message: coupon.label + ' applied.' };
    },

    removeCoupon: function () {
      erase(COUPON_KEY);
      notify();
    },

    totals: function () {
      var cfg = HD.config;
      var subtotal = cart.lines().reduce(function (s, l) { return s + l.total; }, 0);
      var code = cart.couponCode();
      var coupon = code ? cfg.coupons[code] : null;
      var discount = 0;
      if (coupon && subtotal >= (coupon.min || 0)) {
        discount = coupon.type === 'percent'
          ? Math.round(subtotal * coupon.value / 100)
          : Math.min(coupon.value, subtotal);
      }
      var afterDiscount = subtotal - discount;
      var shipping = subtotal === 0 || afterDiscount >= cfg.freeShippingThreshold ? 0 : cfg.shippingFee;
      return {
        subtotal: subtotal,
        couponCode: coupon ? code : null,
        coupon: coupon,
        discount: discount,
        shipping: shipping,
        total: afterDiscount + shipping,
        freeShippingRemaining: Math.max(0, cfg.freeShippingThreshold - afterDiscount)
      };
    }
  };

  HD.cart = cart;
  HD.storage = { read: read, write: write, erase: erase };

  // Keep several open tabs in sync.
  window.addEventListener('storage', function (e) {
    if (e.key === CART_KEY || e.key === COUPON_KEY) notify();
  });
})();
