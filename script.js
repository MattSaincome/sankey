// Front-end logic to fetch data and render Sankey chart

document.getElementById('submit').addEventListener('click', async () => {
  const ticker = document.getElementById('ticker').value.trim().toUpperCase();
  if (!ticker) {
    alert('Please enter a ticker symbol.');
    return;
  }
  try {
    const response = await fetch(`/api/income-statement?ticker=${ticker}`);
    const data = await response.json();
    if (response.ok) {
      await renderSankey(data, ticker);
    } else {
      alert(data.error || 'Error fetching data');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching data');
  }
});

async function renderSankey(data, ticker) {
  // fetch segmentation and prepare sankey data
  let segments = [];
  // We no longer need to make a separate API call since detailed expenses
  // are now included in the main income statement response
  const detailedExpenses = data.expenses;

  // --- FETCH GROWTH DATA (YoY) ---
  let growthData = null;
  try {
    const growthResponse = await fetch(`/api/income-statement-growth?ticker=${ticker}`);
    if (growthResponse.ok) {
      growthData = await growthResponse.json();
      console.log('DEBUG: Growth data received:', growthData);
    } else {
      console.error('[ERROR] Growth fetch error', await growthResponse.json());
    }
  } catch (err) {
    console.error('[ERROR] Growth fetch error', err);
  }

  try {
    const segResponse = await fetch(`/api/revenue-segmentation?ticker=${ticker}`);
    if (segResponse.ok) {
      const segJson = await segResponse.json();
      segments = Array.isArray(segJson.segments) ? segJson.segments.filter(s => s.revenue > 0) : [];
      console.log('DEBUG: Segmentation data received:', segments);
    } else {
      console.error('[ERROR] Segmentation fetch error', await segResponse.json());
    }
  } catch (err) {
    console.error('[ERROR] Segmentation fetch error', err);
  }

  // Log detailed expense data
  console.log('DEBUG: Detailed expense data:', detailedExpenses);

  // --- D3 Chart Render ---
  if (window.renderD3Sankey) {
    window.renderD3Sankey(data, segments, ticker, detailedExpenses, growthData);
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
