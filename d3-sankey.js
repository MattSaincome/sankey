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

  window.renderD3Sankey = function(data, segments, ticker, detailedExpenses, growthData) {
    d3Div.innerHTML = '';
    const margin = { left: 90, right: 130, top: 40, bottom: 80 };
    const width = Math.max(900, Math.min(window.innerWidth * 0.95, 1500));
    const height = 600;
    const svg = d3.select(d3Div).append('svg')
      .attr('width', width)
      .attr('height', height);
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Threshold for filtering small nodes/links
    const MIN_NODE_VALUE = 1e6; // $1M

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
      if (value <= MIN_NODE_VALUE) return;
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
    
    // Use the detailed expenses data now directly from the income statement
    const hasDetailedOpEx = detailedExpenses && (
        (detailedExpenses.researchAndDevelopment || 0) > 0 ||
        (detailedExpenses.sellingGeneralAdmin || 0) > 0 ||
        (detailedExpenses.sellingAndMarketingExpenses || 0) > 0
    );

    // Always add the intermediate Operating Expenses node
    addNode('Operating Expenses');

    // Add expense nodes based on available detail
    if (hasDetailedOpEx) {
      // Add nodes only for categories with values > 0
      if (detailedExpenses.researchAndDevelopment > 0) {
        addNode('R&D Expenses');
      }
      
      if (detailedExpenses.sellingGeneralAdmin > 0) {
        addNode('SG&A Expenses');
      }
      
      if (detailedExpenses.sellingAndMarketingExpenses > 0) {
        addNode('Marketing Expenses');
      }
      
      // Calculate remaining uncategorized expenses
      const categorizedExpenses = (detailedExpenses.researchAndDevelopment || 0) + 
                               (detailedExpenses.sellingGeneralAdmin || 0) +
                               (detailedExpenses.sellingAndMarketingExpenses || 0);
                               
      const remainingOpEx = data.operatingExpenses - categorizedExpenses;
      
      if (remainingOpEx > 0) {
        addNode('Other Operating Expenses');
      }
    }
    
    // Add standard Cost of Revenue node
    addNode('Cost of Revenue');
    
    // Rest of standard nodes
    const stdNodes = [
      'Operating Income',
      'Interest Expense', 
      'Income Tax Expense', 
      'Net Income'
    ];
    stdNodes.forEach(addNode);
    
    // Segment links to Revenue
    if (segments.length > 0) {
      segments.forEach(s => {
        addLink(s.segment, 'Revenue', s.revenue);
      });
    }
    
    // Revenue to Gross Profit and Cost of Revenue
    addLink('Revenue', 'Gross Profit', data.grossProfit);
    addLink('Revenue', 'Cost of Revenue', data.costOfRevenue);

    // --- Updated Operating Expenses Flow --- 
    const totalOperatingExpenses = Math.abs(data.operatingExpenses);

    // Link from Gross Profit to the intermediate Operating Expenses node
    if (totalOperatingExpenses > 0) {
        addLink('Gross Profit', 'Operating Expenses', totalOperatingExpenses);
    }

    // Link from Gross Profit to Operating Income
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
      
      // Calculate remaining uncategorized expenses
      const categorizedExpenses = (detailedExpenses.researchAndDevelopment || 0) + 
                               (detailedExpenses.sellingGeneralAdmin || 0) +
                               (detailedExpenses.sellingAndMarketingExpenses || 0);
                               
      const remainingOpEx = data.operatingExpenses - categorizedExpenses;
      
      if (remainingOpEx > 0) { // Link remaining OpEx from the intermediate node
          addLink('Operating Expenses', 'Other Operating Expenses', remainingOpEx);
      }
    } 
    // --- End Updated Operating Expenses Flow ---
 
    // Handle Interest Expense/Income
    const interestValue = Math.abs(data.interestExpense || -data.interestIncome || 0);
    if (interestValue > 0) {
      addLink('Operating Income', 'Interest Expense', interestValue);
    }
    
    // Directly branch Income Tax Expense and Net Income from Operating Income
    addLink('Operating Income', 'Income Tax Expense', data.incomeTaxExpense);
    addLink('Operating Income', 'Net Income', data.netIncome);

    // Ensure growthData is defined and map node names to growth keys
    growthData = growthData || {};
    const growthKeyMap = {
      'Revenue': 'growthRevenue',
      'Cost of Revenue': 'growthCostOfRevenue',
      'Gross Profit': 'growthGrossProfit',
      'Operating Expenses': 'growthOperatingExpenses',
      'Operating Income': 'growthOperatingIncome',
      'Pre-Tax Income': 'growthIncomeBeforeTax',
      'Income Tax Expense': 'growthIncomeTaxExpense',
      'Net Income': 'growthNetIncome',
      'R&D Expenses': 'growthResearchAndDevelopmentExpenses',
      'SG&A Expenses': 'growthGeneralAndAdministrativeExpenses',
      'Marketing Expenses': 'growthSellingAndMarketingExpenses',
      'Other Operating Expenses': 'growthOtherExpenses',
      'Other Expenses': 'growthOtherExpenses',
      'Depreciation': 'growthDepreciationAndAmortization'
    };

    // Remove nodes with no incoming or outgoing links, or with very small value
    const nodeValues = Array(nodeNames.length).fill(0);
    links.forEach(l => {
      nodeValues[l.source] += l.value;
      nodeValues[l.target] += l.value;
    });
    const keepNode = nodeValues.map(v => v >= MIN_NODE_VALUE);
    nodeNames = nodeNames.filter((_, i) => keepNode[i]);
    const oldToNew = {};
    nodeNames.forEach((n, i) => { oldToNew[nodeMap[n]] = i; });
    links = links.filter(l => keepNode[l.source] && keepNode[l.target]).map(l => ({
      source: oldToNew[l.source],
      target: oldToNew[l.target],
      value: l.value
    }));
    nodeMap = {};
    nodeNames.forEach((n, i) => { nodeMap[n] = i; });

    // D3 Sankey layout
    const sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(32)
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

    // --- POST-PROCESS: Separate rightmost nodes if too close ---
    const rightEdgeThreshold = chartWidth - 40;
    const minRightGap = 10;
    // Get all rightmost nodes
    const rightNodes = sankeyData.nodes.filter(n => n.x1 > rightEdgeThreshold);
    // Sort by y0
    rightNodes.sort((a, b) => a.y0 - b.y0);
    for (let i = 1; i < rightNodes.length; i++) {
      const prev = rightNodes[i - 1];
      const curr = rightNodes[i];
      if (curr.y0 < prev.y1 + minRightGap) {
        const shift = prev.y1 + minRightGap - curr.y0;
        curr.y0 += shift;
        curr.y1 += shift;
        // Also shift all links connected to this node
        sankeyData.links.forEach(link => {
          if (link.target === curr) {
            link.y1 += shift;
          }
          if (link.source === curr) {
            link.y0 += shift;
          }
        });
      }
    }

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

    // Find Operating Income node once for reuse
    const opIncomeNode = nodes.find(n => n.name === 'Operating Income');
    // --- Custom Split for Net Income and Income Tax Expense ---
    const netIncomeNode2 = nodes.find(n => n.name === 'Net Income');
    const taxNode2 = nodes.find(n => n.name === 'Income Tax Expense');
    if (opIncomeNode && netIncomeNode2 && taxNode2) {
      // Find the two outgoing links
      const netLink = links.find(l => l.source === opIncomeNode && l.target === netIncomeNode2);
      const taxLink = links.find(l => l.source === opIncomeNode && l.target === taxNode2);
      if (netLink && taxLink) {
        // Compute total outgoing value and proportions
        const total = netLink.value + taxLink.value;
        const opIncomeHeight = opIncomeNode.y1 - opIncomeNode.y0;
        const netRatio = netLink.value / total;
        const taxRatio = taxLink.value / total;
        // Calculate proper section heights based on values
        const netSectionHeight = opIncomeHeight * netRatio;
        const taxSectionHeight = opIncomeHeight * taxRatio;
        // Net Income starts at the exact top of Operating Income bar
        const netStartY = opIncomeNode.y0;
        // Income Tax Expense starts at the bottom and goes up
        const taxStartY = opIncomeNode.y1 - taxSectionHeight;
        // Set link y0 for source
        netLink.y0 = netStartY + netSectionHeight / 2;
        taxLink.y0 = taxStartY + taxSectionHeight / 2;
        // Adjust target node y0/y1 to match
        const netTargetHeight = netIncomeNode2.y1 - netIncomeNode2.y0;
        const taxTargetHeight = taxNode2.y1 - taxNode2.y0;
        // Place Net Income node at the top, Income Tax Expense below
        netIncomeNode2.y0 = netStartY;
        netIncomeNode2.y1 = netStartY + netSectionHeight;
        taxNode2.y0 = netIncomeNode2.y1 + 16; // 16px gap
        taxNode2.y1 = taxNode2.y0 + taxSectionHeight;
        // Update link targets
        netLink.y1 = (netIncomeNode2.y0 + netIncomeNode2.y1) / 2;
        taxLink.y1 = (taxNode2.y0 + taxNode2.y1) / 2;
      }
    }
    // --- End Custom Split ---
    // --- Manual Node Position Adjustments ---
    const opExNode = nodes.find(n => n.name === 'Operating Expenses');

    if (opExNode && opIncomeNode && opExNode.y0 < opIncomeNode.y1) {
        const originalY0 = opExNode.y0; // Store original position
        const padding = 25; // Vertical space between OpInc bottom and OpEx top
        const currentHeight = opExNode.y1 - opExNode.y0;
        const newY0 = opIncomeNode.y1 + padding;

        opExNode.y0 = newY0;
        opExNode.y1 = newY0 + currentHeight;

        const deltaY = opExNode.y0 - originalY0; // Calculate the shift amount

        // Update connected links
        layoutLinks.forEach(link => {
            if (link.source === opExNode) {
                link.y0 += deltaY; // Shift link start point
            }
            if (link.target === opExNode) {
                link.y1 += deltaY; // Shift link end point
            }
        });
    }
    // --- End Manual Adjustments ---

    // Find Net Income node x0/x1 (reuse for both Y and X adjustments)
    const netIncomeNode = nodes.find(n => n.name === 'Net Income');
    // --- Manual Y Adjustment for Net Income and Income Tax Expense ---
    // Ensure Net Income is above Income Tax Expense
    if (netIncomeNode) {
      const taxNode = nodes.find(n => n.name === 'Income Tax Expense');
      if (taxNode && netIncomeNode.y0 > taxNode.y0) {
        // Swap y positions so Net Income is above
        const netIncomeHeight = netIncomeNode.y1 - netIncomeNode.y0;
        const taxHeight = taxNode.y1 - taxNode.y0;
        const swapGap = 16;
        // Set Net Income at the higher y, then tax below
        const newNetIncomeY0 = Math.max(30, taxNode.y0 - netIncomeHeight - swapGap);
        const newTaxY0 = newNetIncomeY0 + netIncomeHeight + swapGap;
        const netDelta = newNetIncomeY0 - netIncomeNode.y0;
        const taxDelta = newTaxY0 - taxNode.y0;
        netIncomeNode.y0 = newNetIncomeY0;
        netIncomeNode.y1 = newNetIncomeY0 + netIncomeHeight;
        taxNode.y0 = newTaxY0;
        taxNode.y1 = newTaxY0 + taxHeight;
        // Update links to match new node positions
        links.forEach(link => {
          if (link.source === netIncomeNode) link.y0 += netDelta;
          if (link.target === netIncomeNode) link.y1 += netDelta;
          if (link.source === taxNode) link.y0 += taxDelta;
          if (link.target === taxNode) link.y1 += taxDelta;
        });
      }
    }
    // --- End Manual Y Adjustment ---
    // --- Manual X Adjustments for Expense Details ---
    if (netIncomeNode) {
      // Find all nodes that are direct children of Operating Expenses (i.e., detailed expense nodes)
      const opExDetailNodes = nodes.filter(n =>
          links.some(l => l.source === opExNode && l.target === n)
      );
      // Place them just before Net Income's x0
      const detailX0 = netIncomeNode.x0 - 5; // 5px gap before Net Income
      const detailX1 = detailX0 + (opExDetailNodes[0]?.x1 - opExDetailNodes[0]?.x0 || 30); // Keep width
      // Optionally stagger y for clarity
      const detailSpacing = 10;
      opExDetailNodes.forEach((node, idx) => {
          node.x0 = detailX0;
          node.x1 = detailX1;
          // Lower all detailed expense nodes by 30px
          node.y0 += 30;
          node.y1 += 30;
          // Update links to match new node position
          links.forEach(link => {
              if (link.source === node) link.y0 += 30;
              if (link.target === node) link.y1 += 30;
          });
      });
    }
    // --- End Manual X Adjustments ---

    // Color logic
    function nodeColor(name) {
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return '#555'; // grey
      if (name === 'Gross Profit' || name === 'Operating Income' || name === 'Net Income') return '#3cb371'; // green
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return '#c0392b'; // red
      return '#bbb';
    }
    function linkColor(d) {
      // All expense paths are red
      const expenseNames = ['Cost of Revenue', 'Operating Expenses', 'Income Tax Expense'];
      if (d.target.name.includes('Expense') || expenseNames.includes(d.target.name)) {
          return '#c0392b';
      }
      // Only profit/income flows are green
      if (['Gross Profit', 'Operating Income', 'Net Income'].includes(d.target.name)) {
        return '#3cb371';
      }
      return '#bbb'; // Default gray
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
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return 'linear-gradient(90deg, #555 0%, #eee 100%)';
      if (name === 'Gross Profit' || name === 'Operating Income' || name === 'Net Income') return 'linear-gradient(90deg, #3cb371 0%, #b7f8c6 100%)';
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return 'linear-gradient(90deg, #c0392b 0%, #ffbcbc 100%)';
      return 'linear-gradient(90deg, #555 0%, #eee 100%)';
    }
    function nodeSolidColor(name) {
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return '#555';
      if (name === 'Gross Profit' || name === 'Operating Income' || name === 'Net Income') return '#3cb371';
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return '#c0392b';
      return '#555';
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

    // --- STANDARDIZED LABEL OFFSETS ---
    const TITLE_OFFSET = 0;
    const VALUE_OFFSET = 16;
    const MARGIN_OFFSET = 32;

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
        // Detect if node is at the right edge
        const rightEdge = d.x1 > chartWidth - 40; // 40px threshold
        let labelX = cx;
        let labelAnchor = anchor;
        if (rightEdge) {
          labelX = d.x1 + 10; // 10px to the right of node
          labelAnchor = 'start';
        }
        const rightEdgeYOffset = rightEdge ? 10 : 0;
        // Move top-end node labels higher if at the top of the chart
        const isTopNode = yBase < 100 || ['Gross Profit', 'Operating Income', 'Net Income'].includes(d.name);
        const topEdgeYOffset = isTopNode ? -12 : 0;
        labelGroup.append('text')
          .attr('class', 'nodelabel')
          .attr('x', labelX)
          .attr('y', yBase + TITLE_OFFSET + rightEdgeYOffset + topEdgeYOffset)
          .attr('text-anchor', labelAnchor)
          .attr('alignment-baseline', 'hanging')
          .text(fullLabel(d.name))
          .style('font-size', '15px')
          .style('font-weight', 'bold')
          .style('fill', nodeSolidColor(d.name))
          .style('paint-order', 'stroke')
          .style('stroke', 'white')
          .style('stroke-width', 6)
          .style('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        if (typeof d.value === 'number' && !isNaN(d.value)) {
          labelGroup.append('text')
            .attr('class', 'nodelabel-value')
            .attr('x', labelX)
            .attr('y', yBase + VALUE_OFFSET + rightEdgeYOffset + topEdgeYOffset)
            .attr('text-anchor', labelAnchor)
            .attr('alignment-baseline', 'hanging')
            .text(formatDollars(d.value))
            .style('font-size', '15px')
            .style('font-weight', 'bold')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        }
        if (marginText) {
          labelGroup.append('text')
            .attr('class', 'nodelabel-margin')
            .attr('x', labelX)
            .attr('y', yBase + MARGIN_OFFSET + rightEdgeYOffset + topEdgeYOffset)
            .attr('text-anchor', labelAnchor)
            .attr('alignment-baseline', 'hanging')
            .text(marginText)
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 4)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        }
      } else {
        // Segmentation node: label left, value below
        labelGroup.append('text')
          .attr('class', 'nodelabel')
          .attr('x', cx)
          .attr('y', (d.y0 + d.y1) / 2 + TITLE_OFFSET)
          .attr('text-anchor', anchor)
          .attr('alignment-baseline', 'middle')
          .text(fullLabel(d.name))
          .style('font-size', '14px')
          .style('font-weight', 'bold')
          .style('fill', nodeSolidColor(d.name))
          .style('paint-order', 'stroke')
          .style('stroke', 'white')
          .style('stroke-width', 6)
          .style('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        if (typeof d.value === 'number' && !isNaN(d.value)) {
          labelGroup.append('text')
            .attr('class', 'nodelabel-value')
            .attr('x', cx)
            .attr('y', (d.y0 + d.y1) / 2 + VALUE_OFFSET)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(formatDollars(d.value))
            .style('font-size', '13px')
            .style('font-weight', 'normal')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        }
      }
    });

    // Draw link labels: show y/y growth for all links if available, fallback to dollar values
    chartGroup.selectAll('text.link-label').remove();
    chartGroup.selectAll('text.link-label')
      .data(layoutLinks.filter(d => d.width > 40 && Math.abs(d.target.x0 - d.source.x1) > 60))
      .enter().append('text')
      .each(function(d) {
        const key = growthKeyMap[d.target.name];
        const val = key && growthData[key] != null ? growthData[key] : null;
        if (typeof val === 'number') {
          d3.select(this)
            .attr('stroke', 'none')
            .attr('stroke-width', 0)
            .attr('filter', 'none')
            .attr('paint-order', 'normal');
        } else {
          d3.select(this)
            .attr('stroke', 'white')
            .attr('stroke-width', 6)
            .attr('paint-order', 'stroke')
            .attr('stroke-linejoin', 'round')
            .attr('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        }
      })
      .attr('x', d => (d.source.x1 + d.target.x0) / 2)
      .attr('y', d => (d.y0 + d.y1) / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', '#222')
      .style('pointer-events', 'none')
      .text(d => {
        const key = growthKeyMap[d.target.name];
        const val = key && growthData[key] != null ? growthData[key] : null;
        if (typeof val === 'number') {
          const pct = (val * 100).toFixed(1) + '% YoY';
          return (val > 0 ? '+' : '') + pct;
        }
        return formatDollars(d.value);
      });
    chartGroup.selectAll('text.link-label')
      .raise()
      .style('stroke-width', 6)
      .style('stroke', 'white')
      .style('paint-order', 'stroke');
    chartGroup.selectAll('text.link-label')
      .raise();
    chartGroup.selectAll('text.link-label')
      .style('stroke-width', 6)
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
        { offset: '50%', color: '#555' },
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

    // --- Tooltip ---
    const tooltip = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('z-index', 1000)
      .style('background', 'rgba(255,255,255,0.96)')
      .style('border', '1px solid #aaa')
      .style('border-radius', '6px')
      .style('padding', '8px 14px')
      .style('font-size', '15px')
      .style('box-shadow', '0 2px 10px rgba(0,0,0,0.13)')
      .style('pointer-events', 'none')
      .style('display', 'none');

    function showTooltip(html, evt) {
      tooltip.html(html)
        .style('left', (evt.pageX + 18) + 'px')
        .style('top', (evt.pageY - 6) + 'px')
        .style('display', 'block');
    }
    function hideTooltip() { tooltip.style('display', 'none'); }

    // Node tooltips
    chartGroup.selectAll('.node rect, .node text, .nodelabel, .nodelabel-value, .nodelabel-margin')
      .on('mouseover', function(evt, d) {
        const name = d.name || d;
        let val = typeof d.value === 'number' ? formatDollars(d.value) : '';
        let margin = '';
        if (growthKeyMap[name] && growthData[growthKeyMap[name]] != null) {
          const yoy = growthData[growthKeyMap[name]];
          margin = `<br><span style='color:#3cb371'>YoY: ${(yoy > 0 ? '+' : '') + (yoy * 100).toFixed(1)}%</span>`;
        }
        showTooltip(`<b>${name}</b><br>${val}${margin}`, evt);
      })
      .on('mousemove', function(evt) { tooltip.style('left', (evt.pageX + 18) + 'px').style('top', (evt.pageY - 6) + 'px'); })
      .on('mouseleave', hideTooltip);

    // Link tooltips
    chartGroup.selectAll('path.sankey-link, .link-label')
      .on('mouseover', function(evt, d) {
        const src = d.source.name, tgt = d.target.name;
        let val = formatDollars(d.value);
        let margin = '';
        if (growthKeyMap[tgt] && growthData[growthKeyMap[tgt]] != null) {
          const yoy = growthData[growthKeyMap[tgt]];
          margin = `<br><span style='color:#3cb371'>YoY: ${(yoy > 0 ? '+' : '') + (yoy * 100).toFixed(1)}%</span>`;
        }
        showTooltip(`<b>${src} → ${tgt}</b><br>${val}${margin}`, evt);
      })
      .on('mousemove', function(evt) { tooltip.style('left', (evt.pageX + 18) + 'px').style('top', (evt.pageY - 6) + 'px'); })
      .on('mouseleave', hideTooltip);

    // --- Tooltip CSS ---
    if (!document.getElementById('d3-tooltip-style')) {
      const style = document.createElement('style');
      style.id = 'd3-tooltip-style';
      style.innerHTML = `.d3-tooltip { pointer-events: none; transition: opacity 0.1s; }`;
      document.head.appendChild(style);
    }
  };
});
