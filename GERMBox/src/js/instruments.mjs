// instruments.js - loads mock JSON and renders instruments table
import { qs } from './utils.mjs';

export async function loadAndRenderInstruments(tableSelector = '#instrumentsTable') {
  const table = qs(tableSelector);
  const tbody = table.querySelector('tbody');

  // fetch mock data placed in public/data/instruments.json
  const res = await fetch('/data/instruments.json');
  if (!res.ok) {
    tbody.innerHTML = '<tr><td colspan="5">Failed to load instruments.</td></tr>';
    return;
  }
  const list = await res.json();

  function rowHtml(item) {
    return `<tr>
      <td>${item.name}</td>
      <td>${item.rate}</td>
      <td>${item.tenure}</td>
      <td>${item.min.toLocaleString()}</td>
      <td><button class="btn-invest" data-id="${item.id}">Invest</button></td>
    </tr>`;
  }

  tbody.innerHTML = list.map(rowHtml).join('');

  // click delegation: open invest modal
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-invest');
    if (!btn) return;
    const id = btn.dataset.id;
    const instrument = list.find(i => String(i.id) === String(id));
    // fire a custom event that other modules can listen to
    document.dispatchEvent(new CustomEvent('invest:open', { detail: instrument }));
  });

  // wire simple filter by type if exists
  const filter = document.getElementById('filterType');
  if (filter) {
    filter.addEventListener('change', () => {
      const type = filter.value;
      const filtered = type ? list.filter(i => i.type === type) : list;
      tbody.innerHTML = filtered.map(rowHtml).join('');
    });
  }

  // simple sort button
  const sortBtn = document.getElementById('sortRateBtn');
  if (sortBtn) {
    let desc = true;
    sortBtn.addEventListener('click', () => {
      desc = !desc;
      const sorted = [...list].sort((a,b) => desc ? b.rate - a.rate : a.rate - b.rate);
      tbody.innerHTML = sorted.map(rowHtml).join('');
      sortBtn.textContent = `Sort by Rate ${desc ? '↓' : '↑'}`;
    });
  }
}
