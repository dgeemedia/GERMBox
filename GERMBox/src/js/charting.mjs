// If Chart.js not loaded, render a simple fallback.
// Assumes Chart.js is included via CDN or bundle if needed for portfolio page.
export function renderPortfolioChart(containerId, dataset = []) {
  const el = document.getElementById(containerId);
  if (!el) return;
  // If Chart available, draw a simple line; otherwise show JSON.
  if (window.Chart) {
    const ctx = el.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataset.map((d,i)=>`T${i+1}`),
        datasets: [{
          label: 'Portfolio Value',
          data: dataset,
          fill: false,
          tension: 0.2,
          borderColor: '#4CAF50',
          backgroundColor: '#4CAF50'
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  } else {
    el.style.padding = '12px';
    el.style.background = '#fff';
    el.textContent = 'Chart fallback: ' + JSON.stringify(dataset);
  }
}