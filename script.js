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
  
  try {
    const segResponse = await fetch(`/api/revenue-segmentation?ticker=${ticker}`);
    if (segResponse.ok) {
      const segJson = await segResponse.json();
      segments = Array.isArray(segJson.segments) ? segJson.segments.filter(s => s.revenue > 0) : [];
      console.log('DEBUG: Segmentation data received:', segments);
    } else {
      console.error('DEBUG: Segmentation API error', segResponse.status);
    }
    
    // Log detailed expense data
    console.log('DEBUG: Detailed expense data:', detailedExpenses);
  } catch (e) {
    console.error('Fetch error', e);
  }
  
  // Prepare the Plotly Sankey data
  const labels = [];
  const sources = [];
  const targets = [];
  const values = [];
  
  // Mapping of node names to indices
  const nodeMap = {};
  
  // Helper function to add a node
  function addNode(name) {
    if (!(name in nodeMap)) {
      nodeMap[name] = labels.length;
      labels.push(name);
    }
    return nodeMap[name];
  }
  
  // Helper function to add a link
  function addLink(source, target, value) {
    if (value <= 0) return;
    const sourceIdx = addNode(source);
    const targetIdx = addNode(target);
    sources.push(sourceIdx);
    targets.push(targetIdx);
    values.push(value);
  }
  
  // Add product segments if available
  if (segments.length > 0) {
    segments.forEach(segment => {
      addNode(segment.segment);
      addLink(segment.segment, 'Revenue', segment.revenue);
    });
  }
  
  // Add standard nodes
  addNode('Revenue');
  addNode('Gross Profit');
  addNode('Cost of Revenue');

  const hasDetailedOpEx = detailedExpenses && 
                        (detailedExpenses.researchAndDevelopment > 0 || 
                         detailedExpenses.sellingGeneralAdmin > 0 || 
                         detailedExpenses.sellingAndMarketingExpenses > 0 || 
                         detailedExpenses.depreciation > 0);

  // Nodes
  addNode('Operating Expenses'); // Intermediate node

  if (hasDetailedOpEx) {
    if (detailedExpenses.researchAndDevelopment > 0) addNode('R&D Expenses');
    if (detailedExpenses.sellingGeneralAdmin > 0) addNode('SG&A Expenses');
    if (detailedExpenses.sellingAndMarketingExpenses > 0) addNode('Marketing Expenses');
    if (detailedExpenses.depreciation > 0) addNode('Depreciation');
  }

  addNode('Operating Income');
  addNode('Interest Expense');
  addNode('Pre-Tax Income');
  addNode('Income Tax Expense');
  addNode('Net Income');

  // Standard flow: Revenue to Gross Profit and Cost of Revenue
  addLink('Revenue', 'Gross Profit', data.grossProfit);
  addLink('Revenue', 'Cost of Revenue', data.costOfRevenue);

  // Calculate total OpEx for the intermediate node link
  const totalOperatingExpenses = Math.abs(data.operatingExpenses); // Use the total operating expenses value

  // Link from Gross Profit to the intermediate Operating Expenses node
  if (totalOperatingExpenses > 0) {
    addLink('Gross Profit', 'Operating Expenses', totalOperatingExpenses);
  }

  // Link from Gross Profit to Operating Income (Gross Profit = OpEx + OpIncome)
  addLink('Gross Profit', 'Operating Income', data.operatingIncome);

  // Links from the intermediate Operating Expenses node to detailed expenses
  if (hasDetailedOpEx) {
    if (detailedExpenses.researchAndDevelopment > 0) {
      addLink('Operating Expenses', 'R&D Expenses', detailedExpenses.researchAndDevelopment);
    }
    if (detailedExpenses.sellingGeneralAdmin > 0) {
      addLink('Operating Expenses', 'SG&A Expenses', detailedExpenses.sellingGeneralAdmin);
    }
    if (detailedExpenses.sellingAndMarketingExpenses > 0) {
      addLink('Operating Expenses', 'Marketing Expenses', detailedExpenses.sellingAndMarketingExpenses);
    }
    if (detailedExpenses.depreciation > 0) {
      addLink('Operating Expenses', 'Depreciation', detailedExpenses.depreciation);
    }
  }

  if (Math.abs(data.interestExpense) > 0) {
    addLink('Operating Income', 'Interest Expense', Math.abs(data.interestExpense));
  }
  
  addLink('Operating Income', 'Pre-Tax Income', data.incomeBeforeTax);
  
  if (data.incomeTaxExpense > 0) {
    addLink('Pre-Tax Income', 'Income Tax Expense', data.incomeTaxExpense);
  }
  
  addLink('Pre-Tax Income', 'Net Income', data.netIncome);
  
  // Create more visually appealing labels
  const finalLabels = labels.map(label => {
    if (label.includes('Expense') || label.includes('Cost')) {
      return label; // No change for expense/cost labels
    }
    return label; // Return original label
  });
  
  const sankeyData = [{
    type: 'sankey',
    orientation: 'h',
    node: {
      pad: 15,
      thickness: 30,
      line: { color: 'black', width: 0.5 },
      color: labels.map(label => {
        if (segments.map(s => s.segment).includes(label) || label === 'Revenue') return '#aaa';
        if (label.includes('Profit') || label.includes('Income') || label === 'Net Income') return '#3cb371';
        if (label.includes('Expense') || label.includes('Cost')) return '#c0392b';
        return '#bbb';
      }),
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
    // Fetch YoY growth metrics and pass to D3 renderer
    try {
      const growthResp = await fetch(`/api/income-statement-growth?ticker=${ticker}`);
      const growthData = growthResp.ok ? await growthResp.json() : {};
      window.renderD3Sankey(data, segments, ticker, detailedExpenses, growthData);
    } catch (e) {
      console.error('Growth fetch error', e);
      window.renderD3Sankey(data, segments, ticker, detailedExpenses, {});
    }
  }
}
