/* The Holy Drop — contact form (demo: shows a confirmation, nothing is sent) */
(function () {
  'use strict';

  var cfg = HD.config;
  var details = document.getElementById('contact-details');
  if (cfg.contactEmail) {
    details.insertAdjacentHTML('afterbegin', '<dt>Email</dt><dd><a style="color:inherit" href="mailto:' + HD.esc(cfg.contactEmail) + '">' + HD.esc(cfg.contactEmail) + '</a></dd>');
  }
  if (cfg.contactPhone) {
    details.insertAdjacentHTML('afterbegin', '<dt>Phone</dt><dd>' + HD.esc(cfg.contactPhone) + '</dd>');
  }

  var form = document.getElementById('contact-form');
  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.'; },
    message: function (v) { return v.trim().length >= 10 || 'Please write a short message (at least 10 characters).'; }
  };

  function check(name) {
    var input = form.elements[name];
    var result = rules[name](input.value);
    var field = input.closest('.field');
    var msg = field.querySelector('.error-msg');
    if (result === true) {
      field.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (msg) msg.textContent = '';
      return true;
    }
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'error-msg';
      msg.id = input.id + '-error';
      input.setAttribute('aria-describedby', msg.id);
      field.appendChild(msg);
    }
    msg.textContent = result;
    return false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (n) { if (!check(n) && !firstBad) firstBad = form.elements[n]; });
    if (firstBad) { firstBad.focus(); return; }

    var name = form.elements.name.value.trim().split(' ')[0];
    document.getElementById('contact-card').innerHTML =
      '<div class="form-success" tabindex="-1" id="contact-success">' +
        '<div class="tick"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
        '<h2>Thank you, ' + HD.esc(name) + '</h2>' +
        '<p class="muted">' + (cfg.demoMode
          ? 'This is a demo store, so your message wasn’t actually sent.'
          : 'We’ve received your message and will reply within one working day.') + '</p>' +
        '<a class="btn btn-secondary" href="shop.html">Back to the shop</a>' +
      '</div>';
    document.getElementById('contact-success').focus();
  });
})();
