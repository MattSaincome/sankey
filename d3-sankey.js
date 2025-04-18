// D3 Sankey for custom vertical order and no overlaps
// This script assumes the same API and data as Plotly, but renders a D3 Sankey below the Plotly chart

// Load D3 and D3-Sankey from CDN if not present
(function loadD3Deps(cb) {
  if (window.d3 && window.d3.sankey) return cb();
  const d3Script = document.createElement('script');
  d3Script.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
  d3Script.onload = () => {
    const sankeyScript = document.createElement('script');
    sankeyScript.src = 'https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js';
    sankeyScript.onload = cb;
    document.head.appendChild(sankeyScript);
  };
  document.head.appendChild(d3Script);
})(function() {
  // Add a container below the Plotly chart
  let d3Div = document.getElementById('d3-chart');
  if (!d3Div) {
    d3Div = document.createElement('div');
    d3Div.id = 'd3-chart';
    d3Div.style.marginTop = '40px';
    // Place the D3 chart well below the Plotly chart, after the scroll anchor
    const anchor = document.getElementById('d3-chart-scroll-anchor');
    if (anchor) {
      anchor.parentNode.insertBefore(d3Div, anchor.nextSibling);
    } else {
      document.body.appendChild(d3Div);
    }
  }

  window.renderD3Sankey = function(data, segments, ticker) {
    d3Div.innerHTML = '';
    const margin = { left: 60, right: 60, top: 40, bottom: 40 };
    const width = Math.max(900, Math.min(window.innerWidth * 0.95, 1500));
    const height = 600;
    const svg = d3.select(d3Div).append('svg')
      .attr('width', width)
      .attr('height', height);
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Build nodes and links for D3 Sankey
    let nodeNames = [];
    let nodeMap = {};
    let links = [];
    // Segments first if present
    if (segments.length > 0) {
      segments.forEach(s => {
        nodeMap[s.segment] = nodeNames.length;
        nodeNames.push(s.segment);
      });
    }
    // Standard nodes
    const stdNodes = [
      'Revenue', 'Gross Profit', 'Cost of Revenue',
      'Operating Expenses', 'Operating Income',
      'Interest Expense', 'Pre-Tax Income',
      'Income Tax Expense', 'Net Income'
    ];
    stdNodes.forEach(n => { if (!(n in nodeMap)) { nodeMap[n] = nodeNames.length; nodeNames.push(n); }});
    // Segment links to Revenue
    if (segments.length > 0) {
      segments.forEach(s => {
        links.push({ source: nodeMap[s.segment], target: nodeMap['Revenue'], value: s.revenue });
      });
    }
    // Custom vertical order: Gross Profit on top, Cost of Revenue below
    if (data.grossProfit > 0) links.push({ source: nodeMap['Revenue'], target: nodeMap['Gross Profit'], value: data.grossProfit });
    if (data.costOfRevenue > 0) links.push({ source: nodeMap['Revenue'], target: nodeMap['Cost of Revenue'], value: data.costOfRevenue });
    // Only Gross Profit continues horizontally
    if (data.operatingExpenses > 0) links.push({ source: nodeMap['Gross Profit'], target: nodeMap['Operating Expenses'], value: data.operatingExpenses });
    if (data.operatingIncome > 0) links.push({ source: nodeMap['Gross Profit'], target: nodeMap['Operating Income'], value: data.operatingIncome });
    if (Math.abs(data.interestExpense) > 0) links.push({ source: nodeMap['Operating Income'], target: nodeMap['Interest Expense'], value: Math.abs(data.interestExpense) });
    if (data.incomeBeforeTax > 0) links.push({ source: nodeMap['Operating Income'], target: nodeMap['Pre-Tax Income'], value: data.incomeBeforeTax });
    if (Math.abs(data.incomeTaxExpense) > 0) links.push({ source: nodeMap['Pre-Tax Income'], target: nodeMap['Income Tax Expense'], value: Math.abs(data.incomeTaxExpense) });
    if (data.netIncome > 0) links.push({ source: nodeMap['Pre-Tax Income'], target: nodeMap['Net Income'], value: data.netIncome });

    // D3 Sankey layout
    const sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(30)
      .size([chartWidth, chartHeight])
      .nodeSort((a, b) => {
        // Custom: Gross Profit above Cost of Revenue
        if (a.name === 'Gross Profit') return -1;
        if (b.name === 'Gross Profit') return 1;
        if (a.name === 'Cost of Revenue') return 1;
        if (b.name === 'Cost of Revenue') return -1;
        return d3.ascending(a.name, b.name);
      });

    const sankeyData = {
      nodes: nodeNames.map(name => ({ name })),
      links
    };
    const {nodes, links: layoutLinks} = sankey({...sankeyData});

    // Move 'Cost of Revenue' node and its link to be much closer to 'Revenue' (short bar)
    const revenueNode = nodes.find(n => n.name === 'Revenue');
    const costNode = nodes.find(n => n.name === 'Cost of Revenue');
    if (revenueNode && costNode) {
      // Set x0/x1 to a moderate distance after Revenue (middle ground)
      const extra = (chartWidth / 4.5); // just a bit longer than before
      costNode.x0 = revenueNode.x1 + extra;
      costNode.x1 = costNode.x0 + 30;
      layoutLinks.forEach(l => {
        if (l.target.name === 'Cost of Revenue') {
          l.target.x0 = costNode.x0;
          l.target.x1 = costNode.x1;
        }
      });
    }
    const opExpNode = nodes.find(n => n.name === 'Operating Expenses');
    const grossProfitNode = nodes.find(n => n.name === 'Gross Profit');
    if (grossProfitNode && opExpNode) {
      const extraOp = (chartWidth / 4.5);
      opExpNode.x0 = grossProfitNode.x1 + extraOp;
      opExpNode.x1 = opExpNode.x0 + 30;
      layoutLinks.forEach(l => {
        if (l.target.name === 'Operating Expenses') {
          l.target.x0 = opExpNode.x0;
          l.target.x1 = opExpNode.x1;
        }
      });
    }

    // Color logic
    function nodeColor(name) {
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return '#aaa'; // grey
      if (name === 'Gross Profit' || name === 'Operating Income' || name === 'Pre-Tax Income' || name === 'Net Income') return '#3cb371'; // green
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return '#c0392b'; // red
      return '#bbb';
    }
    function linkColor(d) {
      // Revenue segmentation links: grey
      if (segments.length > 0 && segments.map(s => s.segment).includes(d.source.name) && d.target.name === 'Revenue') return '#aaa';
      // Gross Profit and beyond: green
      if (d.source.name === 'Revenue' && d.target.name === 'Gross Profit') return '#3cb371';
      if (['Gross Profit','Operating Income','Pre-Tax Income'].includes(d.source.name) && ['Operating Income','Pre-Tax Income','Net Income'].includes(d.target.name)) return '#3cb371';
      // Expenses and Cost of Revenue: red
      if (d.target.name === 'Cost of Revenue' || d.target.name.includes('Expense')) return '#c0392b';
      return '#bbb';
    }

    // Format as $X.XXB, $X.XXM, etc.
    function formatDollars(val) {
      if (Math.abs(val) >= 1e9) return '$' + (val/1e9).toFixed(2) + 'B';
      if (Math.abs(val) >= 1e6) return '$' + (val/1e6).toFixed(2) + 'M';
      if (Math.abs(val) >= 1e3) return '$' + (val/1e3).toFixed(2) + 'K';
      return '$' + val;
    }

    // Gradient/modern color helpers
    function nodeBgColor(name) {
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return 'linear-gradient(90deg, #bbb 0%, #eee 100%)';
      if (name === 'Gross Profit' || name === 'Operating Income' || name === 'Pre-Tax Income' || name === 'Net Income') return 'linear-gradient(90deg, #3cb371 0%, #b7f8c6 100%)';
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return 'linear-gradient(90deg, #c0392b 0%, #ffbcbc 100%)';
      return 'linear-gradient(90deg, #bbb 0%, #eee 100%)';
    }
    function nodeSolidColor(name) {
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return '#bbb';
      if (name === 'Gross Profit' || name === 'Operating Income' || name === 'Pre-Tax Income' || name === 'Net Income') return '#3cb371';
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return '#c0392b';
      return '#bbb';
    }

    // Draw links
    chartGroup.append('g').selectAll('path')
      .data(layoutLinks)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', linkColor)
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.5);

    // Draw nodes
    chartGroup.append('g').selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('fill', d => nodeColor(d.name));

    // Remove duplicate node labels (by name) and use full names
    const uniqueNodes = [];
    const seen = new Set();
    for (const n of nodes) {
      if (!seen.has(n.name)) { uniqueNodes.push(n); seen.add(n.name); }
    }
    // Use full names for standard nodes
    const fullLabel = name => {
      if (segments.map(s => s.segment).includes(name)) return name;
      if (name === 'Cost of Revenue') return 'Cost of Revenue';
      if (name === 'Gross Profit') return 'Gross Profit';
      if (name === 'Operating Expenses') return 'Operating Expenses';
      if (name === 'Operating Income') return 'Operating Income';
      if (name === 'Interest Expense') return 'Interest Expense';
      if (name === 'Pre-Tax Income') return 'Pre-Tax Income';
      if (name === 'Income Tax Expense') return 'Income Tax Expense';
      if (name === 'Net Income') return 'Net Income';
      if (name === 'Revenue') return 'Revenue';
      return name;
    };

    // Remove unconnected/unknown nodes from rendering
    const connectedNames = new Set();
    layoutLinks.forEach(l => {
      connectedNames.add(l.source.name);
      connectedNames.add(l.target.name);
    });
    const filteredNodes = uniqueNodes.filter(n => connectedNames.has(n.name));

    // --- NEW TITLE STYLE: Clean, sleek, no background rects, just beautiful text with subtle shadow/highlight ---
    chartGroup.append('g').selectAll('text.nodelabel')
      .data(filteredNodes)
      .join('text')
      .attr('class', 'nodelabel')
      .attr('x', d => d.x0 + (d.x1 - d.x0) / 2)
      .attr('y', d => (d.y1 + d.y0) / 2 + 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(d => `${fullLabel(d.name)}${(typeof d.value === 'number' && !isNaN(d.value)) ? '  ' + formatDollars(d.value) : ''}`)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', d => nodeSolidColor(d.name))
      .style('paint-order', 'stroke')
      .style('stroke', 'white')
      .style('stroke-width', 4)
      .style('stroke-linejoin', 'round')
      .style('filter', 'drop-shadow(0px 2px 8px rgba(0,0,0,0.16))');

    // Link labels: value at midpoint of each link, only if enough space
    chartGroup.append('g').selectAll('text.link-label')
      .data(layoutLinks.filter(d => d.width > 40 && Math.abs(d.target.x0 - d.source.x1) > 60))
      .join('text')
      .attr('class', 'link-label')
      .attr('x', d => (d.source.x1 + d.target.x0) / 2)
      .attr('y', d => (d.y0 + d.y1) / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(d => formatDollars(d.value))
      .style('font-size', '12px')
      .style('fill', '#222')
      .style('pointer-events', 'none')
      .style('paint-order', 'stroke')
      .style('stroke', 'white')
      .style('stroke-width', 4)
      .style('stroke-linejoin', 'round');
    chartGroup.selectAll('text.link-label')
      .raise()
      .style('stroke-width', 4)
      .style('stroke', 'white')
      .style('paint-order', 'stroke');
    chartGroup.selectAll('text.link-label')
      .raise();
    chartGroup.selectAll('text.link-label')
      .style('stroke-width', 4)
      .style('stroke', 'white')
      .style('paint-order', 'stroke');

    // Modern, beautiful chart title with gradient
    svg.selectAll('text.chart-title').remove();
    svg.append('defs').append('linearGradient')
      .attr('id', 'title-gradient')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#3cb371' },
        { offset: '50%', color: '#bbb' },
        { offset: '100%', color: '#c0392b' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);
    // Add buffer for chart title
    const titleBuffer = 32;
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', Math.max(width / 2, titleBuffer))
      .attr('y', margin.top / 1.4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('dominant-baseline', 'hanging')
      .style('fill', 'url(#title-gradient)')
      .style('letter-spacing', '1.5px')
      .style('overflow', 'visible')
      .style('text-overflow', 'ellipsis')
      .attr('clip-path', null)
      .attr('width', width - 2 * titleBuffer)
      .text(`${ticker} Income Statement Sankey (D3)`);
  };
});
