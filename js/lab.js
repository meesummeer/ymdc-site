(function () {
  const WA_NUMBER = '923356733777';
  const listEl = document.getElementById('labList');
  const emptyEl = document.getElementById('labEmpty');
  const countEl = document.getElementById('labCount');
  const searchEl = document.getElementById('labSearch');

  if (!listEl || !searchEl) return;

  let tests = [];
  let query = '';

  function waAskUrl(testName) {
    const text = encodeURIComponent(`Hi, I'd like to ask about the ${testName} test`);
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
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
      const heading = document.createElement('h3');
      heading.className = 'lab-category-heading';
      heading.textContent = category;
      frag.appendChild(heading);

      const table = document.createElement('table');
      table.className = 'pharmacy-table lab-table';
      const tbody = document.createElement('tbody');

      items.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = 'pharmacy-row lab-row';
        tr.dataset.name = item.name;

        const nameTd = document.createElement('td');
        nameTd.className = 'pharmacy-name';
        nameTd.textContent = item.name;

        const catTd = document.createElement('td');
        catTd.className = 'pharmacy-category';
        catTd.textContent = item.category;

        tr.append(nameTd, catTd);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      frag.appendChild(table);
    });

    listEl.appendChild(frag);
  }

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    render();
  });

  listEl.addEventListener('click', (e) => {
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
