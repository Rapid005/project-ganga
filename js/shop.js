/* The Holy Drop — shop page with filters */
(function () {
  'use strict';

  var grid = document.getElementById('product-grid');
  var empty = document.getElementById('empty-state');
  var count = document.getElementById('result-count');
  var chips = document.querySelectorAll('#category-chips .chip');
  var sourceSelect = document.getElementById('filter-source');
  var sizeSelect = document.getElementById('filter-size');
  var sortSelect = document.getElementById('sort');

  HD.sources.forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    sourceSelect.appendChild(opt);
  });

  function valid(value, allowed) {
    return allowed.indexOf(value) > -1 ? value : 'all';
  }

  var params = new URLSearchParams(window.location.search);
  var state = {
    category: valid(params.get('category'), HD.categories.map(function (c) { return c.id; })),
    source: valid(params.get('source'), HD.sources.map(function (s) { return s.id; })),
    size: valid(params.get('size'), ['100 ml', '250 ml', '500 ml', '1 L']),
    sort: valid(params.get('sort'), ['price-asc', 'price-desc', 'name'])
  };
  if (state.sort === 'all') state.sort = 'featured';

  function syncControls() {
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-category') === state.category));
    });
    sourceSelect.value = state.source;
    sizeSelect.value = state.size;
    sortSelect.value = state.sort;
  }

  function syncUrl() {
    var p = new URLSearchParams();
    if (state.category !== 'all') p.set('category', state.category);
    if (state.source !== 'all') p.set('source', state.source);
    if (state.size !== 'all') p.set('size', state.size);
    if (state.sort !== 'featured') p.set('sort', state.sort);
    var qs = p.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  function render() {
    var list = HD.products.filter(function (p) {
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.source !== 'all' && p.sources.indexOf(state.source) === -1) return false;
      if (state.size !== 'all' && !HD.getVariant(p, state.size)) return false;
      return true;
    });

    if (state.sort === 'price-asc') list.sort(function (a, b) { return HD.minPrice(a) - HD.minPrice(b); });
    if (state.sort === 'price-desc') list.sort(function (a, b) { return HD.minPrice(b) - HD.minPrice(a); });
    if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });

    grid.innerHTML = list.map(HD.ui.productCard).join('');
    grid.hidden = list.length === 0;
    empty.hidden = list.length !== 0;
    count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    syncControls();
    syncUrl();
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.category = chip.getAttribute('data-category');
      render();
    });
  });
  sourceSelect.addEventListener('change', function () { state.source = sourceSelect.value; render(); });
  sizeSelect.addEventListener('change', function () { state.size = sizeSelect.value; render(); });
  sortSelect.addEventListener('change', function () { state.sort = sortSelect.value; render(); });
  document.getElementById('clear-filters').addEventListener('click', function () {
    state.category = 'all'; state.source = 'all'; state.size = 'all';
    render();
  });

  render();
})();
