/* The Holy Drop — checkout */
(function () {
  'use strict';

  var STATES = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
    'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal'
  ];

  var form = document.getElementById('checkout-form');
  var summary = document.getElementById('checkout-summary');

  var stateSelect = document.getElementById('state');
  STATES.forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    stateSelect.appendChild(opt);
  });
  document.getElementById('demo-notice').hidden = !HD.config.demoMode;

  var placing = false;
  function renderSummary() {
    if (placing) return;
    var lines = HD.cart.lines();
    document.getElementById('checkout-empty').hidden = lines.length > 0;
    form.hidden = lines.length === 0;
    if (!lines.length) return;
    summary.innerHTML = HD.summary.items(lines) + HD.summary.rows(HD.cart.totals());
  }

  function digits(value) { return value.replace(/\D/g, ''); }

  function normalisePhone(value) {
    var d = digits(value);
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return d;
  }

  var RULES = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your full name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.'; },
    phone: function (v) { return /^[6-9]\d{9}$/.test(normalisePhone(v)) || 'Please enter a valid 10-digit Indian mobile number.'; },
    address1: function (v) { return v.trim().length >= 5 || 'Please enter your house number and street.'; },
    city: function (v) { return v.trim().length >= 2 || 'Please enter your city.'; },
    pin: function (v) { return /^[1-9]\d{5}$/.test(v.trim()) || 'Please enter a valid 6-digit PIN code.'; },
    state: function (v) { return !!v || 'Please select your state.'; }
  };

  function setError(input, message) {
    var field = input.closest('.field');
    var msg = field.querySelector('.error-msg');
    if (message) {
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (!msg) {
        msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.id = input.id + '-error';
        field.appendChild(msg);
        input.setAttribute('aria-describedby', msg.id);
      }
      msg.textContent = message;
    } else {
      field.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (msg) msg.textContent = '';
    }
  }

  function validateField(name) {
    var input = form.elements[name];
    var result = RULES[name](input.value);
    setError(input, result === true ? '' : result);
    return result === true;
  }

  // Re-check a field once the visitor has corrected it.
  Object.keys(RULES).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('blur', function () { if (input.value) validateField(name); });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('has-error')) validateField(name);
    });
  });

  function orderId() {
    var d = new Date();
    var stamp = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    var rand = Math.floor(1000 + Math.random() * 9000);
    return 'THD-' + stamp + '-' + rand;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(RULES).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var lines = HD.cart.lines();
    if (!lines.length) { renderSummary(); return; }

    var get = function (n) { return form.elements[n].value.trim(); };
    var order = {
      id: orderId(),
      placedAt: new Date().toISOString(),
      customer: { name: get('name'), email: get('email'), phone: normalisePhone(get('phone')) },
      address: { line1: get('address1'), line2: get('address2'), city: get('city'), state: get('state'), pin: get('pin') },
      payment: form.elements.payment.value,
      lines: lines.map(function (l) { return { id: l.product.id, size: l.variant.size, qty: l.qty, price: l.variant.price, total: l.total }; }),
      totals: HD.cart.totals()
    };

    placing = true;
    var btn = document.getElementById('place-order');
    btn.disabled = true;
    btn.textContent = 'Placing order…';

    HD.storage.write('hd_last_order', order);
    HD.cart.clear();
    window.location.href = 'order.html';
  });

  window.addEventListener('hd:cartchange', renderSummary);
  renderSummary();
})();
