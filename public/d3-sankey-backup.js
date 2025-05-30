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

  window.renderD3Sankey = function(data, segments, ticker, detailedExpenses) {
    console.log('D3 render starting with data:', data);
    console.log('Detailed expenses:', detailedExpenses);
    
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
    
    // Helper to add a node and get its index
    function addNode(name) {
      if (!(name in nodeMap)) {
        nodeMap[name] = nodeNames.length;
        nodeNames.push(name);
      }
      return nodeMap[name];
    }
    
    // Helper to add a link if the value is positive
    function addLink(source, target, value) {
      if (value <= 0) return;
      const sourceIdx = nodeMap[source];
      const targetIdx = nodeMap[target];
      links.push({ source: sourceIdx, target: targetIdx, value });
    }
    
    // Segments first if present
    if (segments.length > 0) {
      segments.forEach(s => {
        addNode(s.segment);
      });
    }
    
    // Standard nodes
    addNode('Revenue');
    addNode('Gross Profit');
    addNode('Cost of Revenue');
    addNode('Operating Expenses');
    addNode('Operating Income');
    
    // Use the detailed expenses data if available
    const hasDetailedOpEx = detailedExpenses && 
                         (detailedExpenses.researchAndDevelopment > 0 || 
                          detailedExpenses.sellingGeneralAdmin > 0);
    
    // Add expense nodes based on available detail
    if (hasDetailedOpEx) {
      if (detailedExpenses.researchAndDevelopment > 0) {
        addNode('R&D Expenses');
      }
      
      if (detailedExpenses.sellingGeneralAdmin > 0) {
        addNode('SG&A Expenses');
      }
      
      if (detailedExpenses.sellingAndMarketingExpenses > 0) {
        addNode('Marketing Expenses');
      }
      
      if (detailedExpenses.depreciation > 0) {
        addNode('Depreciation');
      }
      
      // Calculate remaining uncategorized expenses
      const categorizedExpenses = (detailedExpenses.researchAndDevelopment || 0) + 
                               (detailedExpenses.sellingGeneralAdmin || 0) +
                               (detailedExpenses.sellingAndMarketingExpenses || 0) +
                               (detailedExpenses.depreciation || 0);
                               
      const remainingOpEx = data.operatingExpenses - categorizedExpenses;
      
      if (remainingOpEx > 0) {
        addNode('Other Operating Expenses');
      }
    }
    
    // Rest of standard nodes
    addNode('Interest Expense');
    addNode('Pre-Tax Income');
    addNode('Income Tax Expense');
    addNode('Net Income');
    
    // Segment links to Revenue
    if (segments.length > 0) {
      segments.forEach(s => {
        addLink(s.segment, 'Revenue', s.revenue);
      });
    }
    
    // Revenue to Gross Profit and Cost of Revenue
    addLink('Revenue', 'Gross Profit', data.grossProfit);
    addLink('Revenue', 'Cost of Revenue', data.costOfRevenue);
    
    // Operating expenses breakdown
    addLink('Gross Profit', 'Operating Expenses', data.operatingExpenses);
    addLink('Gross Profit', 'Operating Income', data.operatingIncome);
    
    // If we have detailed operating expenses, connect them
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
      
      // Calculate and add remaining expenses if any
      const categorizedExpenses = (detailedExpenses.researchAndDevelopment || 0) + 
                               (detailedExpenses.sellingGeneralAdmin || 0) +
                               (detailedExpenses.sellingAndMarketingExpenses || 0) +
                               (detailedExpenses.depreciation || 0);
                               
      const remainingOpEx = data.operatingExpenses - categorizedExpenses;
      
      if (remainingOpEx > 0) {
        addLink('Operating Expenses', 'Other Operating Expenses', remainingOpEx);
      }
    }
    
    // Connect operating income onward
    if (Math.abs(data.interestExpense) > 0) {
      addLink('Operating Income', 'Interest Expense', Math.abs(data.interestExpense));
    }
    
    addLink('Operating Income', 'Pre-Tax Income', data.incomeBeforeTax);
    
    if (Math.abs(data.incomeTaxExpense) > 0) {
      addLink('Pre-Tax Income', 'Income Tax Expense', Math.abs(data.incomeTaxExpense));
    }
    
    addLink('Pre-Tax Income', 'Net Income', data.netIncome);

    // D3 Sankey layout
    const sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(20)
      .extent([[0, 0], [chartWidth, chartHeight]])
      .nodeId(d => d.name)
      .nodeSort((a, b) => {
        // Critical nodes need specific ordering
        if (a.name === 'Gross Profit') return -1;
        if (b.name === 'Gross Profit') return 1;
        
        // Keep Operating Income above Operating Expenses
        if (a.name === 'Operating Income' && b.name === 'Operating Expenses') return -1;
        if (a.name === 'Operating Expenses' && b.name === 'Operating Income') return 1;
        
        // Keep Cost of Revenue below Operating Expenses
        if (a.name === 'Cost of Revenue') return 1;
        if (b.name === 'Cost of Revenue') return -1;
        
        // Expense categories go below Operating Expenses
        if (a.name.includes('Expenses') && !a.name.includes('Operating')) return 1;
        if (b.name.includes('Expenses') && !b.name.includes('Operating')) return -1;
        
        // Default to alphabetical sort
        return a.name.localeCompare(b.name);
      });

    // Prepare data for Sankey layout
    const sankeyData = {
      nodes: nodeNames.map(name => ({ name })),
      links
    };
    
    // Run the sankey layout
    const {nodes, links: layoutLinks} = sankey(sankeyData);
    
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

    // --- NODE LABELS: Enhanced for clarity and matching reference example ---
    function getMargin(name, data) {
      // Only calculate margin for select nodes
      if (name === 'Gross Profit' && data.revenue > 0) return (data.grossProfit / data.revenue * 100).toFixed(0) + '% margin';
      if (name === 'Operating Income' && data.revenue > 0) return (data.operatingIncome / data.revenue * 100).toFixed(0) + '% margin';
      if (name === 'Net Income' && data.revenue > 0) return (data.netIncome / data.revenue * 100).toFixed(0) + '% margin';
      if (name === 'Cost of Revenue' && data.revenue > 0) return (data.costOfRevenue / data.revenue * 100).toFixed(0) + '% of revenue';
      if (name === 'Operating Expenses' && data.revenue > 0) return (data.operatingExpenses / data.revenue * 100).toFixed(0) + '% of revenue';
      return '';
    }
    const labelGroup = chartGroup.append('g');
    filteredNodes.forEach(d => {
      const isSeg = segments.map(s => s.segment).includes(d.name);
      const cx = isSeg ? d.x0 - 10 : d.x0 + (d.x1 - d.x0) / 2;
      const anchor = isSeg ? 'end' : 'middle';
      const marginText = getMargin(d.name, data);
      // Special: Cost of Revenue & Operating Expenses label below bar, others above
      const belowBar = (d.name === 'Cost of Revenue' || d.name === 'Operating Expenses');
      let yBase;
      if (!isSeg) {
        yBase = belowBar ? d.y1 + 8 : d.y0 - 22;
        // Line 1: Name/Title
        labelGroup.append('text')
          .attr('class', 'nodelabel')
          .attr('x', cx)
          .attr('y', yBase)
          .attr('text-anchor', anchor)
          .attr('alignment-baseline', belowBar ? 'hanging' : 'baseline')
          .text(fullLabel(d.name))
          .style('font-size', '15px')
          .style('font-weight', 'bold')
          .style('fill', nodeSolidColor(d.name))
          .style('paint-order', 'stroke')
          .style('stroke', 'white')
          .style('stroke-width', 4)
          .style('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0px 2px 8px rgba(0,0,0,0.16))');
        // Line 2: Dollar Amount
        if (typeof d.value === 'number' && !isNaN(d.value)) {
          labelGroup.append('text')
            .attr('class', 'nodelabel-value')
            .attr('x', cx)
            .attr('y', yBase + (belowBar ? 18 : 16))
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'hanging')
            .text(formatDollars(d.value))
            .style('font-size', '15px')
            .style('font-weight', 'bold')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 3)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 2px 8px rgba(0,0,0,0.10))');
        }
        // Line 3: Margin (if available)
        if (marginText) {
          labelGroup.append('text')
            .attr('class', 'nodelabel-margin')
            .attr('x', cx)
            .attr('y', yBase + (belowBar ? 34 : 32))
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'hanging')
            .text(marginText)
            .style('font-size', '13px')
            .style('font-weight', 'normal')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))');
        }
      } else {
        // Segmentation node: label left, value below
        labelGroup.append('text')
          .attr('class', 'nodelabel')
          .attr('x', cx)
          .attr('y', (d.y0 + d.y1) / 2 - 8)
          .attr('text-anchor', anchor)
          .attr('alignment-baseline', 'middle')
          .text(fullLabel(d.name))
          .style('font-size', '14px')
          .style('font-weight', 'bold')
          .style('fill', nodeSolidColor(d.name))
          .style('paint-order', 'stroke')
          .style('stroke', 'white')
          .style('stroke-width', 4)
          .style('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0px 2px 8px rgba(0,0,0,0.16))');
        if (typeof d.value === 'number' && !isNaN(d.value)) {
          labelGroup.append('text')
            .attr('class', 'nodelabel-value')
            .attr('x', cx)
            .attr('y', (d.y0 + d.y1) / 2 + 10)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(formatDollars(d.value))
            .style('font-size', '13px')
            .style('font-weight', 'normal')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 3)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 2px 8px rgba(0,0,0,0.10))');
        }
      }
    });

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
