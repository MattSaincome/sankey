// Front-end logic to fetch data and render Sankey chart

// --- Debounce helper ---
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Autocomplete suggestions for ticker/company search
document.getElementById('ticker').addEventListener('input', debounce(async (e) => {
  const q = e.target.value.trim();
  if (!q) return;
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const suggestions = await res.json();
    const list = document.getElementById('ticker-list');
    list.innerHTML = '';
    suggestions.forEach(item => {
      const opt = document.createElement('option');
      opt.value = `${item.symbol} - ${item.name}`;
      list.appendChild(opt);
    });
  } catch (err) {
    console.error('Autocomplete error:', err);
  }
}, 300));

document.getElementById('submit').addEventListener('click', async () => {
  // Extract raw input and resolve to ticker symbol
  let raw = document.getElementById('ticker').value.trim();
  if (!raw) return alert('Please enter a ticker symbol.');
  let ticker;
  // If selected from suggestions 'SYMB - Name'
  if (raw.includes(' - ')) {
    ticker = raw.split(' - ')[0].toUpperCase();
  } else if (/[a-z]/.test(raw) || raw.includes(' ')) {
    // Treat input as company name or free-form, lookup via autocomplete API
    try {
      const sr = await fetch(`/api/search?q=${encodeURIComponent(raw)}`);
      if (sr.ok) {
        const sug = await sr.json();
        ticker = sug.length ? sug[0].symbol : raw.toUpperCase();
      } else {
        ticker = raw.toUpperCase();
      }
    } catch (e) {
      console.error('Name lookup error:', e);
      ticker = raw.toUpperCase();
    }
  } else {
    ticker = raw.toUpperCase();
  }
  // Continue with resolved ticker
  if (!ticker) {
    alert('Please enter a ticker symbol.');
    return;
  }
  
  // Show loading indicator
  const loadingEl = document.getElementById('loading') || createLoadingElement();
  loadingEl.style.display = 'block';
  
  try {
    const response = await fetch(`/api/income-statement?ticker=${encodeURIComponent(ticker)}`);
    const data = await response.json();
    console.log('DEBUG: /api/income-statement response =>', data);
    
    if (response.ok) {
      // Only hide loading when we successfully render
      await renderSankey(data, ticker);
      if (window.renderCompetitorsWidget) {
        renderCompetitorsWidget(ticker);
      }
      if (window.renderValuationWidget) {
        renderValuationWidget(ticker);
      }
      loadingEl.style.display = 'none';
    } else {
      loadingEl.style.display = 'none';
      alert(data.error || 'Error fetching income statement data');
    }
  } catch (error) {
    console.error('Income statement fetch error:', error.message || 'Network or parsing error');
    console.debug('Error details:', { url: `/api/income-statement?ticker=${ticker}`, error });
    loadingEl.style.display = 'none';
    // Only show alert if chart isn't already rendered
    if (!document.querySelector('#d3-chart svg')) {
      alert('Error fetching income statement data');
    }
  }
});

// Create a loading indicator element
function createLoadingElement() {
  const loadingEl = document.createElement('div');
  loadingEl.id = 'loading';
  loadingEl.textContent = 'Loading...';
  loadingEl.style.position = 'absolute';
  loadingEl.style.top = '50%';
  loadingEl.style.left = '50%';
  loadingEl.style.transform = 'translate(-50%, -50%)';
  loadingEl.style.padding = '10px 20px';
  loadingEl.style.background = 'rgba(0,0,0,0.7)';
  loadingEl.style.color = 'white';
  loadingEl.style.borderRadius = '4px';
  loadingEl.style.zIndex = '1000';
  loadingEl.style.display = 'none';
  document.body.appendChild(loadingEl);
  return loadingEl;
}

async function renderSankey(data, ticker) {
  console.log('DEBUG: renderSankey data =>', data);
  hideSegmentationError(); // Clear previous errors

  // --- Fetch Growth Data (YoY from Annual Statements) ---
  let growthData = {};
  try {
    const annualIncomeRes = await fetch(`/api/fmp-proxy/data?endpoint=income-statement&symbol=${ticker}&period=annual&limit=3`);
    if (annualIncomeRes.ok) {
      const annualStatements = await annualIncomeRes.json();
      console.log('DEBUG: Annual income statements for YoY calc:', annualStatements);
      if (annualStatements && annualStatements.length >= 2) {
        const y0 = annualStatements[0]; // Most recent year
        const y1 = annualStatements[1]; // Prior year

        const calculateGrowth = (current, previous) => {
          if (previous === 0 || previous == null) {
            return (current != null && current !== 0) ? null : 0; // Or handle as 'New' or Infinity if current > 0
          }
          if (current == null || previous == null) return null;
          return (current - previous) / Math.abs(previous);
        };

        growthData = {
          growthRevenue: calculateGrowth(y0.revenue, y1.revenue),
          growthCostOfRevenue: calculateGrowth(y0.costOfRevenue, y1.costOfRevenue),
          growthGrossProfit: calculateGrowth(y0.grossProfit, y1.grossProfit),
          growthResearchAndDevelopmentExpenses: calculateGrowth(y0.researchAndDevelopmentExpenses, y1.researchAndDevelopmentExpenses),
          growthSellingGeneralAndAdministrativeExpenses: calculateGrowth(y0.sellingGeneralAndAdministrativeExpenses, y1.sellingGeneralAndAdministrativeExpenses),
          growthOperatingExpenses: calculateGrowth(y0.operatingExpenses, y1.operatingExpenses),
          growthOperatingIncome: calculateGrowth(y0.operatingIncome, y1.operatingIncome),
          growthInterestExpense: calculateGrowth(y0.interestExpense, y1.interestExpense),
          growthIncomeTaxExpense: calculateGrowth(y0.incomeTaxExpense, y1.incomeTaxExpense),
          growthNetIncome: calculateGrowth(y0.netIncome, y1.netIncome),
          growthDepreciationAndAmortization: calculateGrowth(y0.depreciationAndAmortization, y1.depreciationAndAmortization),
          // Add any other specific growth metrics needed by growthKeyMap
        };
      } else {
        console.warn('Not enough annual statements (need at least 2) to calculate YoY growth.');
      }
    }
    console.log('DEBUG: Manually calculated Growth data:', growthData);
  } catch (err) {
    console.error('Error fetching or calculating annual growth data:', err);
    // Fallback to an empty object, so chart still renders without YoY if this fails
    growthData = {}; 
  }

  // --- Fetch Revenue Segmentation Data ---
  let segments = [];
  // We no longer need to make a separate API call since detailed expenses
  // are now included in the main income statement response
  const detailedExpenses = data.expenses;

  try {
    const segResponse = await fetch(`/api/revenue-segmentation?ticker=${ticker}`);
    if (segResponse.ok) {
      const segJson = await segResponse.json();
      segments = Array.isArray(segJson.segments) ? segJson.segments.filter(s => s.revenue > 0) : [];
      console.log('DEBUG: Segmentation data received:', segments);
    } else {
      console.warn('Segmentation data not available:', await segResponse.text());
      segments = [];
      showSegmentationError('No segmentation data available for this ticker/year.');
    }
  } catch (err) {
    console.warn('Segmentation fetch error:', err);
    segments = [];
    showSegmentationError('No segmentation data available for this ticker/year.');
  }

  // Log detailed expense data
  console.log('DEBUG: Detailed expense data:', detailedExpenses);

  // --- D3 Chart Render ---
  if (window.renderD3Sankey) {
    window.renderD3Sankey(data, segments, ticker, detailedExpenses, growthData);
  }
}

// Show a visible error message for segmentation issues
function showSegmentationError(msg) {
  let errDiv = document.getElementById('segmentation-error-msg');
  if (!errDiv) {
    errDiv = document.createElement('div');
    errDiv.id = 'segmentation-error-msg';
    errDiv.style.color = '#c0392b';
    errDiv.style.fontWeight = 'bold';
    errDiv.style.fontSize = '1.1em';
    errDiv.style.position = 'absolute';
    errDiv.style.left = '0';
    errDiv.style.right = '0';
    errDiv.style.bottom = '8px';
    errDiv.style.margin = '0 auto';
    errDiv.style.textAlign = 'center';
    errDiv.style.zIndex = 100;
    errDiv.style.pointerEvents = 'none';
    // Place inside #visualization as a positioned child
    const viz = document.getElementById('visualization') || document.body;
    viz.appendChild(errDiv);
    viz.style.position = 'relative';
  }
  errDiv.textContent = msg;
  errDiv.style.display = 'block';
}

// Hide the segmentation error message
function hideSegmentationError() {
  const errDiv = document.getElementById('segmentation-error-msg');
  if (errDiv) {
    errDiv.style.display = 'none';
  }
}

// Enhanced screenshot-to-clipboard/modal functionality for Mac and all browsers
if (navigator.clipboard && window.HTMLCanvasElement) {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('copy-screenshot');
    const modal = document.getElementById('screenshot-modal');
    const img = document.getElementById('screenshot-img');
    const closeBtn = document.getElementById('close-modal');
    const downloadBtn = document.getElementById('download-screenshot');

    if (btn) {
      btn.addEventListener('click', async () => {
        const chartDiv = document.getElementById('d3-chart');
        if (!chartDiv) return alert('Chart not found!');
        if (window.html2canvas) {
          const canvas = await window.html2canvas(chartDiv, {backgroundColor: null, useCORS: true, scale: 2});
          canvas.toBlob(async blob => {
            let copied = false;
            try {
              if (window.ClipboardItem) {
                await navigator.clipboard.write([
                  new window.ClipboardItem({ 'image/png': blob })
                ]);
                copied = true;
                alert('Chart screenshot copied to clipboard! You can now paste it.');
              } else {
                throw new Error('ClipboardItem not supported');
              }
            } catch (e) {
              // Not fatal, just fallback
            }
            // Always show modal for manual copy/download
            const url = URL.createObjectURL(blob);
            img.src = url;
            modal.style.display = 'flex';
            downloadBtn.onclick = () => {
              const a = document.createElement('a');
              a.href = url;
              a.download = 'chart.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };
            closeBtn.onclick = () => {
              modal.style.display = 'none';
              img.src = '';
              URL.revokeObjectURL(url);
            };
          }, 'image/png');
        } else {
          alert('html2canvas library not loaded!');
        }
      });
    }
  });
}

// Add download chart functionality
function downloadChartAsPNG() {
  const chartDiv = document.getElementById('d3-chart');
  if (!chartDiv || !window.html2canvas) return alert('Chart not found or html2canvas not loaded!');
  window.html2canvas(chartDiv, {backgroundColor: null, useCORS: true, scale: 2}).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('download-chart');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadChartAsPNG);
  }
});

// Threshold for filtering small nodes/links (no minimum – show all values)
const MIN_NODE_VALUE = 0; // Show all positive flows
