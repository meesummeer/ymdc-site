(function () {
  const WA_NUMBER = '923356733777';
  const listEl = document.getElementById('pharmacyList');
  const emptyEl = document.getElementById('pharmacyEmpty');
  const countEl = document.getElementById('pharmacyCount');
  const searchEl = document.getElementById('pharmacySearch');
  const tabs = document.querySelectorAll('.pharmacy-tab');

  if (!listEl || !searchEl) return;

  let inventory = [];
  let activeCategory = 'Medicine';
  let query = '';

  function waOrderUrl(itemName) {
    const text = encodeURIComponent(`Hi, I'd like to order ${itemName} from the pharmacy`);
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  }

  function getFiltered() {
    const q = query.trim().toLowerCase();
    return inventory.filter((item) => {
      if (item.category !== activeCategory) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q);
    });
  }

  function render() {
    const filtered = getFiltered();
    countEl.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

    listEl.replaceChildren();
    if (!filtered.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    const frag = document.createDocumentFragment();
    filtered.forEach((item) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'pharmacy-card';
      card.dataset.name = item.name;
      card.textContent = item.name;
      card.setAttribute('aria-label', `Order ${item.name} via WhatsApp`);
      frag.appendChild(card);
    });
    listEl.appendChild(frag);
  }

  function setCategory(category) {
    activeCategory = category;
    tabs.forEach((tab) => {
      const on = tab.dataset.category === category;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    render();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setCategory(tab.dataset.category));
  });

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    render();
  });

  listEl.addEventListener('click', (e) => {
    const card = e.target.closest('.pharmacy-card');
    if (!card) return;
    window.open(waOrderUrl(card.dataset.name), '_blank', 'noopener');
  });

  fetch('data/pharmacy-inventory.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load inventory');
      return res.json();
    })
    .then((data) => {
      inventory = Array.isArray(data) ? data : [];
      render();
    })
    .catch(() => {
      countEl.textContent = 'Unable to load inventory.';
      emptyEl.hidden = false;
      emptyEl.textContent = 'Please try again later, or message us on WhatsApp to order.';
    });
})();
