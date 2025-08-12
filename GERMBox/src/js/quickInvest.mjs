import { qs, setLS, getLS } from './utils.mjs';
import { getExchangeRates } from './api.mjs';

const MODAL_ROOT_ID = 'modal-root';
const PORTFOLIO_KEY = 'germbox:portfolio';

function buildModalHtml(instrument) {
  return `
  <div class="modal-backdrop" id="qi-backdrop">
    <div class="modal">
      <h3>Invest in ${instrument.name}</h3>
      <div class="row"><label>Amount <input id="qi-amount" class="input" type="number" min="${instrument.min}" value="${instrument.min}"></label></div>
      <div class="row"><label>Currency
        <select id="qi-currency">
          <option value="NGN">NGN</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </label></div>
      <div class="row small">Min investment: ${instrument.min.toLocaleString()} NGN</div>
      <div class="row" style="display:flex;gap:8px;justify-content:flex-end">
        <button id="qi-cancel" class="btn-ghost">Cancel</button>
        <button id="qi-submit" class="btn-primary">Invest</button>
      </div>
    </div>
  </div>`;
}

function closeModal() {
  const root = qs(`#${MODAL_ROOT_ID}`);
  if (root) root.innerHTML = '';
}

async function submitInvestment(instrument) {
  const amt = Number(qs('#qi-amount').value || 0);
  const currency = qs('#qi-currency').value;
  if (amt < instrument.min) {
    alert(`Minimum investment is ${instrument.min.toLocaleString()} NGN (enter higher amount)`);
    return;
  }

  const rates = await getExchangeRates();
  const rate = rates.rates[currency] || 1;
  const investedNGN = currency === 'NGN' ? amt : Math.round(amt / rate);

  const portfolio = getLS(PORTFOLIO_KEY) || [];
  portfolio.push({
    id: Date.now(),
    instrumentId: instrument.id,
    instrumentName: instrument.name,
    amountNGN: investedNGN,
    amountDisplay: amt,
    currency,
    createdAt: new Date().toISOString()
  });
  setLS(PORTFOLIO_KEY, portfolio);

  // fire event for UI
  document.dispatchEvent(new CustomEvent('portfolio:updated', { detail: portfolio }));
  closeModal();
  alert('Investment saved (mock).');
}

export function attachQuickInvestListener() {
  // header quick invest button
  const headerBtn = qs('#quickInvestBtnHeader');
  if (headerBtn) headerBtn.addEventListener('click', () => {
    // open a blank modal for demo
    document.dispatchEvent(new CustomEvent('invest:open', {
      detail: { id: 0, name: 'Quick Invest (select instrument)', rate: 0, min: 1000 }
    }));
  });

  // open modal when 'invest:open' fired
  document.addEventListener('invest:open', ev => {
    const instrument = ev.detail;
    const root = qs(`#${MODAL_ROOT_ID}`);
    root.innerHTML = buildModalHtml(instrument);

    qs('#qi-cancel').addEventListener('click', closeModal);
    qs('#qi-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'qi-backdrop') closeModal();
    });
    qs('#qi-submit').addEventListener('click', () => submitInvestment(instrument));
  });
}