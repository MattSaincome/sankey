// competitors.js
// Widget for displaying top 4 competitors using FMP Stock Peer Comparison API

async function renderCompetitorsWidget(ticker) {
  const container = document.getElementById('competitors-widget');
  if (!container) return;
  container.innerHTML = '<div class="competitors-loading">Loading competitors...</div>';
  try {
    const resp = await fetch(`/api/competitors?ticker=${encodeURIComponent(ticker)}`);
    if (!resp.ok) throw new Error('Failed to fetch competitors');
    const peers = await resp.json();
    if (!Array.isArray(peers) || peers.length === 0) {
      container.innerHTML = '<div class="competitors-error">No competitor data found.</div>';
      return;
    }
    // Limit to top 4 by market cap
    peers.sort((a, b) => (b.mktCap || 0) - (a.mktCap || 0));
    const topPeers = peers.slice(0, 4);
    container.innerHTML = `
      <div class="competitors-title">Top Competitors</div>
      <div class="competitors-header-row">
        <span class="competitor-symbol header">Symbol</span>
        <span class="competitor-name header">Name</span>
        <span class="competitor-price header">Price</span>
        <span class="competitor-mktcap header">Market Cap</span>
      </div>
      <ul class="competitors-list">
        ${topPeers.map(peer => `
          <li class="competitor-item">
            <span class="competitor-symbol">${peer.symbol}</span>
            <span class="competitor-name competitor-link" data-symbol="${peer.symbol}">${peer.companyName || ''}</span>
            <span class="competitor-price">$${peer.price?.toFixed(2) ?? '--'}</span>
            <span class="competitor-mktcap">${formatMarketCap(peer.mktCap)}</span>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = '<div class="competitors-error">Failed to load competitors.</div>';
  }
  // Add click handlers to competitor names
  setTimeout(() => {
    document.querySelectorAll('.competitor-link').forEach(el => {
      el.addEventListener('click', function(e) {
        const symbol = this.getAttribute('data-symbol');
        if (!symbol) return;
        // Set ticker input value and trigger submit click
        const tickerInput = document.getElementById('ticker');
        if (tickerInput) tickerInput.value = symbol;
        const submitBtn = document.getElementById('submit');
        if (submitBtn) submitBtn.click();
      });
    });
  }, 0);
}

function formatMarketCap(val) {
  if (!val || isNaN(val)) return '--';
  if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
  if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
  if (val >= 1e3) return (val / 1e3).toFixed(2) + 'K';
  return val.toString();
}

// Optionally: auto-fetch on page load if ticker is present
if (window.defaultTicker) {
  renderCompetitorsWidget(window.defaultTicker);
}

window.renderCompetitorsWidget = renderCompetitorsWidget;
