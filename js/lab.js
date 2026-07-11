(function () {
  const WA_NUMBER = '923356733777';
  const PAGE_SIZE = 10;
  const listEl = document.getElementById('labList');
  const emptyEl = document.getElementById('labEmpty');
  const countEl = document.getElementById('labCount');
  const searchEl = document.getElementById('labSearch');

  if (!listEl || !searchEl) return;

  let tests = [];
  let query = '';
  /** @type {Map<string, { expanded: boolean, page: number }>} */
  const categoryState = new Map();

  function waAskUrl(testName) {
    const text = encodeURIComponent(`Hi, I'd like to ask about the ${testName} test`);
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  }

  function ensureState(category) {
    if (!categoryState.has(category)) {
      categoryState.set(category, { expanded: false, page: 1 });
    }
    return categoryState.get(category);
  }

  function getFiltered() {
    const q = query.trim().toLowerCase();
    if (!q) return tests.slice();
    return tests.filter((item) => item.name.toLowerCase().includes(q));
  }

  function groupByCategory(items) {
    const groups = new Map();
    items.forEach((item) => {
      const key = item.category || 'Other';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return groups;
  }

  function isSearching() {
    return query.trim().length > 0;
  }

  function renderCategoryPanel(category, items) {
    const state = ensureState(category);
    const searching = isSearching();
    const expanded = searching ? true : state.expanded;

    const panel = document.createElement('div');
    panel.className = 'lab-accordion' + (expanded ? ' is-open' : '');
    panel.dataset.category = category;

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'lab-accordion-header';
    header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    header.innerHTML = `<span class="lab-accordion-title">${category}</span>
      <span class="lab-accordion-meta">${items.length} test${items.length === 1 ? '' : 's'}</span>
      <span class="lab-accordion-chevron" aria-hidden="true"></span>`;
    panel.appendChild(header);

    const body = document.createElement('div');
    body.className = 'lab-accordion-body';
    if (!expanded) {
      body.hidden = true;
      panel.appendChild(body);
      return panel;
    }

    const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    if (!searching && state.page > pageCount) state.page = pageCount;
    const page = searching ? 1 : state.page;
    const pageItems = searching
      ? items
      : items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const table = document.createElement('table');
    table.className = 'pharmacy-table lab-table';
    const tbody = document.createElement('tbody');
    pageItems.forEach((item) => {
      const tr = document.createElement('tr');
      tr.className = 'pharmacy-row lab-row';
      tr.dataset.name = item.name;
      const nameTd = document.createElement('td');
      nameTd.className = 'pharmacy-name';
      nameTd.textContent = item.name;
      tr.appendChild(nameTd);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    body.appendChild(table);

    if (!searching && pageCount > 1) {
      const pager = document.createElement('div');
      pager.className = 'lab-pagination';
      pager.setAttribute('role', 'navigation');
      pager.setAttribute('aria-label', `${category} pages`);

      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lab-page-btn' + (i === page ? ' is-active' : '');
        btn.textContent = String(i);
        btn.dataset.page = String(i);
        btn.dataset.category = category;
        btn.setAttribute('aria-label', `Page ${i}`);
        if (i === page) btn.setAttribute('aria-current', 'page');
        pager.appendChild(btn);
      }
      body.appendChild(pager);
    }

    panel.appendChild(body);
    return panel;
  }

  function render() {
    const filtered = getFiltered();
    countEl.textContent = `${filtered.length} test${filtered.length === 1 ? '' : 's'}`;

    listEl.replaceChildren();
    if (!filtered.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    const frag = document.createDocumentFragment();
    groupByCategory(filtered).forEach((items, category) => {
      frag.appendChild(renderCategoryPanel(category, items));
    });
    listEl.appendChild(frag);
  }

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    if (!isSearching()) {
      // Collapse all again when search clears
      categoryState.forEach((state) => {
        state.expanded = false;
        state.page = 1;
      });
    }
    render();
  });

  listEl.addEventListener('click', (e) => {
    const pageBtn = e.target.closest('.lab-page-btn');
    if (pageBtn) {
      const category = pageBtn.dataset.category;
      const state = ensureState(category);
      state.page = Number(pageBtn.dataset.page) || 1;
      state.expanded = true;
      render();
      return;
    }

    const header = e.target.closest('.lab-accordion-header');
    if (header) {
      if (isSearching()) return; // keep search matches expanded
      const panel = header.closest('.lab-accordion');
      const category = panel.dataset.category;
      const state = ensureState(category);
      state.expanded = !state.expanded;
      if (state.expanded) state.page = 1;
      render();
      return;
    }

    const row = e.target.closest('.lab-row');
    if (!row) return;
    window.open(waAskUrl(row.dataset.name), '_blank', 'noopener');
  });

  fetch('data/lab-tests.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load lab tests');
      return res.json();
    })
    .then((data) => {
      tests = Array.isArray(data) ? data : [];
      render();
    })
    .catch(() => {
      countEl.textContent = 'Unable to load tests.';
      emptyEl.hidden = false;
      emptyEl.textContent = 'Please try again later, or message us on WhatsApp.';
    });
})();
