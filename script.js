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
  try {
    const segResponse = await fetch(`/api/revenue-segmentation?ticker=${ticker}`);
    if (segResponse.ok) {
      const segJson = await segResponse.json();
      segments = Array.isArray(segJson.segments) ? segJson.segments.filter(s => s.revenue > 0) : [];
      console.log('DEBUG: Segmentation data received:', segments);
    } else {
      console.error('DEBUG: Segmentation API error', segResponse.status);
    }
  } catch (e) {
    console.error('Segmentation fetch error', e);
  }

  // Build links: only connect nodes if value > 0, and stop at terminal nodes
  const originalLabels = [
    'Revenue',        // 0
    'Gross Profit',   // 1
    'Cost of Revenue',// 2
    'Operating Expenses', // 3
    'Operating Income',   // 4
    'Interest Expense',   // 5
    'Pre-Tax Income',     // 6
    'Income Tax Expense', // 7
    'Net Income'          // 8
  ];
  // We'll build sources/targets/values dynamically
  let sources = [], targets = [], values = [];
  // Revenue splits to Gross Profit and Cost of Revenue
  if (data.grossProfit > 0) {
    sources.push(0); targets.push(1); values.push(data.grossProfit);
  }
  if (data.costOfRevenue > 0) {
    sources.push(0); targets.push(2); values.push(data.costOfRevenue);
  }
  // Gross Profit to Operating Expenses and Operating Income
  if (data.operatingExpenses > 0) {
    sources.push(1); targets.push(3); values.push(data.operatingExpenses);
  }
  if (data.operatingIncome > 0) {
    sources.push(1); targets.push(4); values.push(data.operatingIncome);
  }
  // Operating Income to Interest Expense and Pre-Tax Income
  if (Math.abs(data.interestExpense) > 0) {
    sources.push(4); targets.push(5); values.push(Math.abs(data.interestExpense));
  }
  if (data.incomeBeforeTax > 0) {
    sources.push(4); targets.push(6); values.push(data.incomeBeforeTax);
  }
  // Pre-Tax Income to Income Tax Expense and Net Income
  if (Math.abs(data.incomeTaxExpense) > 0) {
    sources.push(6); targets.push(7); values.push(Math.abs(data.incomeTaxExpense));
  }
  if (data.netIncome > 0) {
    sources.push(6); targets.push(8); values.push(data.netIncome);
  }

  // Segmentation: each segment flows into Revenue (0)
  if (segments.length > 0) {
    const segCount = segments.length;
    const segLabels = segments.map(s => s.segment);
    // Shift all original indices by segCount
    const labels = segLabels.concat(originalLabels);
    const segSources = segments.map((_, i) => i);
    const segTargets = segments.map(_ => segCount); // Revenue is at segCount
    const segValues = segments.map(s => s.revenue);
    // Shift all other sources/targets by segCount
    sources = segSources.concat(sources.map(x => x + segCount));
    targets = segTargets.concat(targets.map(x => x + segCount));
    values = segValues.concat(values);
    // Use new labels
    var finalLabels = labels;
  } else {
    var finalLabels = originalLabels;
  }

  const sankeyData = [{
    type: 'sankey',
    orientation: 'h',
    node: {
      pad: 30,
      thickness: 30,
      line: { color: '#000', width: 0.5 },
      label: finalLabels
    },
    link: { source: sources, target: targets, value: values },
    arrangement: 'snap' // allow some auto spacing, but no forced carry
  }];

  const layout = {
    title: `${ticker} Income Statement Sankey Diagram`,
    font: { size: 12 },
    width: undefined, // let Plotly auto-fit
    height: 600,
    margin: { l: 0, r: 0, t: 40, b: 0 }
  };

  Plotly.react('chart', sankeyData, layout);

  // --- D3 Chart Render ---
  if (window.renderD3Sankey) {
    // Render D3 chart below Plotly chart
    window.renderD3Sankey(data, segments, ticker);
  }
}
