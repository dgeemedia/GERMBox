import "../css/style.css";

import { getExchangeRates } from './api.mjs';
import { loadTemplate, renderWithTemplate } from './utils.mjs';
import { loadAndRenderInstruments } from './instruments.mjs';
import { attachQuickInvestListener } from './quickInvest.mjs';
import { renderInstitutionsMap } from './mapbox.mjs';

async function updateTicker() {
  try {
    const { base, rates } = await getExchangeRates();

    // Always show NGN-USD, USD-NGN, EUR-NGN, NGN-EUR
    const ngnUsd = (base === 'NGN' ? rates.USD : 1 / rates.NGN).toFixed(4);
    const usdNgn = (base === 'USD' ? rates.NGN : 1 / rates.USD).toFixed(2);
    const eurNgn = (base === 'EUR' ? rates.NGN : 1 / rates.EUR).toFixed(2);
    const ngnEur = (base === 'NGN' ? rates.EUR : 1 / rates.NGN).toFixed(4);

    const tickerEl = document.getElementById('exchangeTicker');
    tickerEl.textContent = `💱 NGN → USD: ${ngnUsd} | USD → NGN: ${usdNgn} | EUR → NGN: ${eurNgn} | NGN → EUR: ${ngnEur}`;
  } catch (err) {
    console.error('Failed to update ticker:', err);
    document.getElementById('exchangeTicker').textContent =
      'Exchange rates unavailable';
  }
}

async function init() {
  try {
    const headerHtml = await loadTemplate('./partials/header.html');
    const footerHtml = await loadTemplate('./partials/footer.html');
    renderWithTemplate(headerHtml, document.getElementById('main-header'));
    renderWithTemplate(footerHtml, document.getElementById('main-footer'));

    const toggleButton = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggleButton && navMenu) {
      toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('open');
        navMenu.classList.toggle('open');
      });
    }
  } catch (err) {
    console.warn('Header/footer load failed:', err);
  }

  attachQuickInvestListener();
  await loadAndRenderInstruments();
  await updateTicker();
  await renderInstitutionsMap('institutions-map');

  document.addEventListener('portfolio:updated', ev => {
    console.log('Portfolio updated (mock):', ev.detail);
  });
}

init().catch(err => console.error(err));
