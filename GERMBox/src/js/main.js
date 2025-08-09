// main.js - app bootstrap
import { loadTemplate, renderWithTemplate } from './utils.mjs';
import { loadAndRenderInstruments } from './instruments.mjs';
import { attachQuickInvestListener } from './quickInvest.mjs';

async function init() {
  // load header/footer from public/partials so fetch('/partials/...') works in production
  try {
    const headerHtml = await loadTemplate('/partials/header.html');
    const footerHtml = await loadTemplate('/partials/footer.html');

    const headerEl = document.getElementById('main-header');
    const footerEl = document.getElementById('main-footer');

    renderWithTemplate(headerHtml, headerEl);
    renderWithTemplate(footerHtml, footerEl);
  } catch (err) {
    console.warn('Header/footer load failed:', err);
  }

  // attach modal listener (listens for invest:open)
  attachQuickInvestListener();

  // load and render instruments into table
  await loadAndRenderInstruments();

  // listen for portfolio updates (demo)
  document.addEventListener('portfolio:updated', (ev) => {
    console.log('Portfolio now:', ev.detail);
  });
}

init().catch(err => console.error(err));
