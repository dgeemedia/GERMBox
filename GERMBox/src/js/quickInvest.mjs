// quickInvest.js - listens for invest:open and shows a modal to simulate investing
import { qs, setLS, getLS } from './utils.mjs';

function createModalHtml(instrument) {
  return `
    <div class="modal-backdrop" id="invest-backdrop">
      <div class="modal" role="dialog" aria-modal="true">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>Quick Invest: ${instrument.name}</h3>
          <button id="closeInvest">&times;</button>
        </div>
        <div class="row">
          <label>Amount (min ${instrument.min.toLocaleString()} NGN)</label>
          <input id="investAmount" class="input" type="number" value="${instrument.min}" min="${instrument.min}" />
        </div>
        <div class="row">
          <label>Currency</label>
          <select id="investCurrency">
            <option value="NGN">NGN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
          <button id="submitInvest" class="btn-invest">Submit</button>
          <button id="cancelInvest" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function openModal(instrument) {
  const root = qs('#modal-root');
  root.innerHTML = createModalHtml(instrument);

  const backdrop = qs('#invest-backdrop');
  const close = qs('#closeInvest');
  const cancel = qs('#cancelInvest');
  const submit = qs('#submitInvest');

  function closeModal() { root.innerHTML = ''; }

  close.addEventListener('click', closeModal);
  cancel.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (ev) => {
    if (ev.target === backdrop) closeModal();
  });

  submit.addEventListener('click', () => {
    const amount = Number(qs('#investAmount').value);
    const currency = qs('#investCurrency').value;
    if (isNaN(amount) || amount < instrument.min) {
      alert(`Amount must be at least ${instrument.min.toLocaleString()} NGN`);
      return;
    }

    // save to localStorage 'portfolio' (simple mock)
    const portfolio = getLS('portfolio') || [];
    portfolio.push({
      id: Date.now(),
      instrumentId: instrument.id,
      name: instrument.name,
      amount,
      currency,
      date: new Date().toISOString()
    });
    setLS('portfolio', portfolio);

    alert('Investment saved to portfolio (localStorage).');
    closeModal();
    // optional: notify other parts
    document.dispatchEvent(new CustomEvent('portfolio:updated', { detail: portfolio }));
  });
}

// listen to global custom event
export function attachQuickInvestListener() {
  document.addEventListener('invest:open', (ev) => {
    const instrument = ev.detail;
    openModal(instrument);
  });

  // header quick invest button also opens modal with first instrument if clicked:
  document.addEventListener('DOMContentLoaded', () => {
    const headerBtn = qs('#quickInvestBtnHeader');
    if (headerBtn) {
      headerBtn.addEventListener('click', () => {
        // fetch instruments and open first
        fetch('/data/instruments.json').then(r => r.json()).then(list => {
          if (list && list[0]) {
            document.dispatchEvent(new CustomEvent('invest:open', { detail: list[0] }));
          } else alert('No instruments available');
        });
      });
    }
  });
}
