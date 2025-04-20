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
    
    // --- Product Segments: Explicit Order ---
    if (segments.length > 0) {
      const desiredOrder = ['iPhone', 'Mac', 'iPad', 'Service', 'Accessories'];
      segments.sort((a, b) => desiredOrder.indexOf(a.segment) - desiredOrder.indexOf(b.segment));
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
    
    // --- Cost of Revenue Sub-Details Breakdown ---
    if (detailedExpenses) {
      console.log('DEBUG: detailedExpenses for Cost of Revenue', detailedExpenses);
    }
    const corDetailNames = [
      { key: 'costOfGoodsSold', label: 'COGS' },
      { key: 'depreciation', label: 'Depreciation' },
      { key: 'amortization', label: 'Amortization' },
      { key: 'otherCostOfRevenue', label: 'Other Cost of Revenue' }
    ];
    let hasCorDetails = false;
    let categorizedCor = 0;
    if (detailedExpenses) {
      corDetailNames.forEach(cat => {
        if (detailedExpenses[cat.key] && detailedExpenses[cat.key] > 0) {
          addNode(cat.label);
          addLink('Cost of Revenue', cat.label, detailedExpenses[cat.key]);
          categorizedCor += detailedExpenses[cat.key];
          hasCorDetails = true;
        }
      });
      // Remaining uncategorized
      const remainingCor = data.costOfRevenue - categorizedCor;
      if (hasCorDetails && remainingCor > 0.01 * data.costOfRevenue) {
        addNode('Other Cost of Revenue');
        addLink('Cost of Revenue', 'Other Cost of Revenue', remainingCor);
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

    // --- Universal horizontal gap limiting for connected nodes ---
    // Prevent pathways from being too long and keep horizontally-related nodes close
    const MAX_NODE_X_GAP = 240; // px, as requested
    layoutLinks.forEach(link => {
      if (!link.source || !link.target) return;
      const sourceCenterX = (link.source.x0 + link.source.x1) / 2;
      const targetCenterX = (link.target.x0 + link.target.x1) / 2;
      const xGap = targetCenterX - sourceCenterX;
      if (xGap > MAX_NODE_X_GAP) {
        // Move target node closer, but not overlapping previous node in its column
        const shift = xGap - MAX_NODE_X_GAP;
        // Only move if this won't overlap previous node
        const colNodes = nodes.filter(n => n.x0 === link.target.x0 && n !== link.target).sort((a, b) => a.y0 - b.y0);
        let canMove = true;
        colNodes.forEach(n => {
          // If target node's new x0 would overlap another node, don't move
          if (Math.abs((link.target.x0 - shift) - n.x1) < 2) {
            canMove = false;
          }
        });
        if (canMove && link.target.x0 - shift > link.source.x1 + 10) { // 10px min gap
          link.target.x0 -= shift;
          link.target.x1 -= shift;
        }
      }
    });
    // For expense detail nodes, align their x positions to be close to their parent and preserve width
    const opExNodeFinal = nodes.find(n => n && n.name === 'Operating Expenses');
    if (opExNodeFinal) {
      const opExDetailNodes = nodes.filter(n =>
        links.some(l => l.source === opExNodeFinal && l.target === n)
      );
      const baseX0 = opExNodeFinal.x1 + 30;
      opExDetailNodes.forEach((node, idx) => {
        const width = node.x1 - node.x0;
        node.x0 = baseX0;
        node.x1 = baseX0 + width;
        // Validation: Clamp width if excessive
        if (node.x1 - node.x0 > 160) {
          node.x1 = node.x0 + 160;
        }
        if (node.x1 - node.x0 < 20) {
          node.x1 = node.x0 + 20;
        }
      });
    }

    // --- Validation: Clamp node widths and heights ---
    nodes.forEach(node => {
      if (node.x1 - node.x0 > 220) node.x1 = node.x0 + 220;
      if (node.x1 - node.x0 < 18) node.x1 = node.x0 + 18;
      if (node.y1 - node.y0 < 8) node.y1 = node.y0 + 8;
    });

    // --- Manual Node Position Adjustments ---
    const opExNode = nodes.find(n => n && n.name === 'Operating Expenses');
    if (opExNode && nodes.find(n => n && n.name === 'Net Income') && opExNode.y0 < nodes.find(n => n && n.name === 'Net Income').y1) {
        const originalY0 = opExNode.y0; // Store original position
        const padding = 25; // Vertical space between OpInc bottom and OpEx top
        const currentHeight = opExNode.y1 - opExNode.y0;
        const newY0 = nodes.find(n => n && n.name === 'Net Income').y1 + padding;

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
    // --- Manual Y Adjustment for Net Income and Income Tax Expense ---
    const netIncomeNode2 = nodes.find(n => n && n.name === 'Net Income');
    const taxNode2 = nodes.find(n => n && n.name === 'Income Tax Expense');
    if (netIncomeNode2 && taxNode2 && netIncomeNode2.y0 > taxNode2.y0) {
      // Swap y positions so Net Income is above
      const netIncomeHeight = netIncomeNode2.y1 - netIncomeNode2.y0;
      const taxHeight = taxNode2.y1 - taxNode2.y0;
      const swapGap = 16;
      // Set Net Income at the higher y, then tax below
      const newNetIncomeY0 = Math.max(30, taxNode2.y0 - netIncomeHeight - swapGap);
      const newTaxY0 = newNetIncomeY0 + netIncomeHeight + swapGap;
      const netDelta = newNetIncomeY0 - netIncomeNode2.y0;
      const taxDelta = newTaxY0 - taxNode2.y0;
      netIncomeNode2.y0 = newNetIncomeY0;
      netIncomeNode2.y1 = newNetIncomeY0 + netIncomeHeight;
      taxNode2.y0 = newTaxY0;
      taxNode2.y1 = newTaxY0 + taxHeight;
      // Update links to match new node positions
      links.forEach(link => {
        if (link.source === netIncomeNode2) link.y0 += netDelta;
        if (link.target === netIncomeNode2) link.y1 += netDelta;
        if (link.source === taxNode2) link.y0 += taxDelta;
        if (link.target === taxNode2) link.y1 += taxDelta;
      });
    }
    // --- Manual X Adjustments for Expense Details ---
    if (nodes.find(n => n && n.name === 'Net Income')) {
      // Find all nodes that are direct children of Operating Expenses (i.e., detailed expense nodes)
      const opExDetailNodes = nodes.filter(n =>
          links.some(l => l.source === opExNode && l.target === n)
      );
      // Place them just before Net Income's x0
      const detailX0 = nodes.find(n => n && n.name === 'Net Income').x0 - 5; // 5px gap before Net Income
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
              if (link.source === node) {
                link.y0 += 30;
              }
              if (link.target === node) {
                link.y1 += 30;
              }
          });
      });
    }

    // --- Robust, cascading universal node margin logic for all columns, with overflow handling ---
    const MIN_NODE_MARGIN = 8;
    const xPositions = [...new Set(nodes.map(n => n.x0))];
    xPositions.forEach(x0 => {
      const colNodes = nodes.filter(n => n.x0 === x0).sort((a, b) => a.y0 - b.y0);
      if (colNodes.length === 0) return;
      // Calculate total needed height
      const totalNodeHeight = colNodes.reduce((sum, n) => sum + (n.y1 - n.y0), 0);
      const totalMargin = (colNodes.length - 1) * MIN_NODE_MARGIN;
      const totalNeeded = totalNodeHeight + totalMargin;
      let scale = 1;
      if (typeof chartHeight !== 'undefined' && totalNeeded > chartHeight) {
        // Shrink all node heights proportionally
        scale = (chartHeight - totalMargin) / totalNodeHeight;
      }
      // Place nodes with margin, shrinking if needed
      let yCursor = colNodes[0].y0;
      colNodes.forEach((node, idx) => {
        if (!node) return;
        const origHeight = node.y1 - node.y0;
        const height = origHeight * scale;
        if (idx === 0) {
          node.y0 = yCursor;
          node.y1 = node.y0 + height;
        } else {
          node.y0 = yCursor + MIN_NODE_MARGIN;
          node.y1 = node.y0 + height;
        }
        yCursor = node.y1;
      });
    });
    // After node adjustment, update links' y0/y1 as needed for accuracy
    layoutLinks.forEach(link => {
      if (link.source) {
        link.y0 = link.source.y0 + (link.source.y1 - link.source.y0) / 2;
      }
      if (link.target) {
        link.y1 = link.target.y0 + (link.target.y1 - link.target.y0) / 2;
      }
    });

    // --- Advanced, universal anti-overlap and anti-crossing for ALL multi-link nodes ---
    function isProfitNode(node) {
      if (!node || !node.name) return false;
      const name = node.name.toLowerCase();
      return (
        name.includes('profit') ||
        name.includes('income') && !name.includes('expense')
      );
    }
    function reorderOutgoingLinksProfitAboveCost(nodes, links) {
      nodes.forEach(node => {
        // Find all outgoing links from this node
        const outgoing = links.filter(l => l.source === node);
        if (outgoing.length <= 1) return;
        // First: sort by profit-above-cost (green above red)
        outgoing.sort((a, b) => {
          const aProfit = isProfitNode(a.target);
          const bProfit = isProfitNode(b.target);
          if (aProfit && !bProfit) return -1;
          if (!aProfit && bProfit) return 1;
          // Within group, sort by y0 for smoothness
          return (a.target.y0 || 0) - (b.target.y0 || 0);
        });
        // Calculate total value and vertical space
        const totalValue = outgoing.reduce((sum, l) => sum + l.value, 0);
        let yCursor = node.y0;
        outgoing.forEach(link => {
          // Height of this link proportional to its value
          const linkHeight = (link.value / totalValue) * (node.y1 - node.y0);
          // Center of this link's exit
          link.y0 = yCursor + linkHeight / 2;
          yCursor += linkHeight;
        });
      });
    }
    reorderOutgoingLinksProfitAboveCost(nodes, layoutLinks);
    // --- Enforce consistent vertical order at Revenue node (for incoming) ---
    // (Already handled above for segment flows)
    // --- Custom vertical order and y-positioning for OpEx and CoR detail nodes ---
    const opExDetailNames = [
      'R&D Expenses', 'SG&A Expenses', 'Marketing Expenses', 'Other Operating Expenses'
    ];
    const corDetailNodeNames = [
      'COGS', 'Depreciation', 'Amortization', 'Other Cost of Revenue'
    ];
    const opExYOffset = 50;
    const corYOffset = 120; // Place below OpEx details
    nodes.forEach(node => {
      if (opExDetailNames.includes(node.name)) {
        node.y0 += opExYOffset;
        node.y1 += opExYOffset;
      }
      if (corDetailNodeNames.includes(node.name)) {
        node.y0 += corYOffset;
        node.y1 += corYOffset;
      }
    });
    // Only shift the target side (y1) of links going to OpEx or CoR detail nodes
    layoutLinks.forEach(link => {
      if (opExDetailNames.includes(link.target.name)) {
        link.y1 += opExYOffset;
      }
      if (corDetailNodeNames.includes(link.target.name)) {
        link.y1 += corYOffset;
      }
    });
    // Redraw nodes and links with new positions
    chartGroup.selectAll('*').remove();

    // --- Enforce order-preserving entry for revenue segment links into Revenue node ---
    // After all spacing/margin logic, align segment entry points to match left node order
    const revenueNode = nodes.find(n => n && n.name === 'Revenue');
    if (revenueNode) {
      // Get all segment nodes (sources to Revenue), sorted by y0
      const segmentLinks = layoutLinks.filter(l => l.target === revenueNode && l.source && l.source.x0 < revenueNode.x0);
      const segmentNodesOrdered = segmentLinks.map(l => l.source).sort((a, b) => a.y0 - b.y0);
      // Compute the available height and slot heights
      const totalHeight = revenueNode.y1 - revenueNode.y0;
      const slotHeights = segmentNodesOrdered.map(n => n.y1 - n.y0);
      let yCursor = revenueNode.y0;
      segmentNodesOrdered.forEach((segNode, idx) => {
        const link = segmentLinks.find(l => l.source === segNode);
        const slotHeight = slotHeights[idx];
        if (link) {
          // Center of this slot
          link.y1 = yCursor + slotHeight / 2;
        }
        yCursor += slotHeight;
      });
    }

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
    chartGroup.selectAll('.node-label').remove();
    chartGroup.selectAll('.node-label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('x', d => (d.x0 + d.x1) / 2)
      .attr('y', d => (d.y0 + d.y1) / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', d => Math.max(10, Math.min(16, (d.y1 - d.y0) * 0.7)))
      .attr('fill', d => ['#c0392b', '#555'].includes(nodeColor(d.name)) ? '#fff' : '#222')
      .text(d => d.name.length > 18 ? d.name.slice(0, 16) + '…' : d.name);

    labelGroup = chartGroup.append('g');
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

    // Helper to compute the center of a curved Sankey link
    function getLinkRibbonCenter(d) {
      // For vertical alignment, use the midpoint between the link's y0 and y1 (which are already adjusted for node height)
      // For horizontal, use the midpoint between source.x1 and target.x0
      const x = (d.source.x1 + d.target.x0) / 2;
      const y = (d.y0 + d.y1) / 2;
      return [x, y];
    }

    // --- Add YoY Growth Labels ---
    chartGroup.selectAll('text.yoy-label').data(layoutLinks.filter(link => {
      if (!link || !link.source || !link.target) return false;
      if (segments && segments.length && link.target.name === 'Revenue') {
        const seg = segments.find(s => s.segment === link.source.name);
        return seg && typeof seg.yoy === 'number';
      }
      return typeof growthKeyMap !== 'undefined' && growthKeyMap[link.target.name] && growthData && growthData[growthKeyMap[link.target.name]] != null;
    }))
      .join('text')
      .attr('class', 'yoy-label')
      .attr('x', d => d && d.source && d.target ? getLinkRibbonCenter(d)[0] : 0)
      .attr('y', d => d && d.source && d.target ? getLinkRibbonCenter(d)[1] : 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#222')
      .attr('font-weight', 700)
      .text(d => {
        if (!d || !d.source || !d.target) return '';
        if (segments && segments.length && d.target.name === 'Revenue') {
          const seg = segments.find(s => s.segment === d.source.name);
          if (seg && typeof seg.yoy === 'number') {
            return (seg.yoy > 0 ? '+' : '') + seg.yoy.toFixed(1) + '% YoY';
          }
        }
        const key = growthKeyMap[d.target.name];
        let val = growthData[key];
        if (val == null || isNaN(val)) return '';
        if (Math.abs(val) < 1) val = val * 100;
        return (val > 0 ? '+' : '') + val.toFixed(1) + '% YoY';
      });
    chartGroup.selectAll('text.yoy-label-foreground').data(layoutLinks.filter(link => {
      if (!link || !link.source || !link.target) return false;
      if (segments && segments.length && link.target.name === 'Revenue') {
        const seg = segments.find(s => s.segment === link.source.name);
        return seg && typeof seg.yoy === 'number';
      }
      return typeof growthKeyMap !== 'undefined' && growthKeyMap[link.target.name] && growthData && growthData[growthKeyMap[link.target.name]] != null;
    }))
      .join('text')
      .attr('class', 'yoy-label-foreground')
      .attr('x', d => d && d.source && d.target ? getLinkRibbonCenter(d)[0] : 0)
      .attr('y', d => d && d.source && d.target ? getLinkRibbonCenter(d)[1] : 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#222')
      .attr('font-weight', 700)
      .text(d => {
        if (!d || !d.source || !d.target) return '';
        if (segments && segments.length && d.target.name === 'Revenue') {
          const seg = segments.find(s => s.segment === link.source.name);
          if (seg && typeof seg.yoy === 'number') {
            return (seg.yoy > 0 ? '+' : '') + seg.yoy.toFixed(1) + '% YoY';
          }
        }
        const key = growthKeyMap[d.target.name];
        let val = growthData[key];
        if (val == null || isNaN(val)) return '';
        if (Math.abs(val) < 1) val = val * 100;
        return (val > 0 ? '+' : '') + val.toFixed(1) + '% YoY';
      });

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
