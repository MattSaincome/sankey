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

  // --- Helper to fetch image and convert to data URL ---
async function toDataURL(url) {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url, {mode: 'cors'});
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('Failed to convert image to data URL:', url, e);
    return url; // fallback to original
  }
}

window.renderD3Sankey = async function(data, segments, ticker, detailedExpenses, growthData) {
    // Flag if company is profitable overall (used for coloring and flow handling)
    const isProfitable = data.operatingIncome > 0;
    const isNetProfitable = data.netIncome > 0;
    const isGrossProfitable = data.grossProfit > 0;
    console.log(`DEBUG: Company profitability status: Gross=${isGrossProfitable}, Operating=${isProfitable}, Net=${isNetProfitable}`);
    console.log(`DEBUG: Values - Gross=${data.grossProfit}, Operating=${data.operatingIncome}, Net=${data.netIncome}`);
    d3Div.innerHTML = '';
    console.log('DEBUG renderD3 data:', data);
    // Improved relabeler for revenue segments to ensure descriptive, meaningful labels
function shortenSegmentName(name, full = false) {
  // Show full name if requested
  if (full) return name;
  const overrides = [
    {regex: /cloud/i, label: 'Cloud'},
    {regex: /office/i, label: 'Office'},
    {regex: /linkedin/i, label: 'LinkedIn'}
  ];
  for (const {regex,label} of overrides) if (regex.test(name)) return label;
  const generic = ['corporation','corporations','inc','inc.','co','company','ltd','plc','systems','system','services','service','products','product','solutions','solution','division','and','&'];
  let parts = name.split(/\s+/).filter(w => !generic.includes(w.toLowerCase()));
  if (parts.length === 0) parts = name.split(/\s+/);
  if (parts.length > 2) {
    return parts.join(' ');
  }
  return parts.map(w => w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');
}

// Universal label formatter for segment/other nodes
function formatSegmentLabel(segmentName, value, isOther = false) {
  if (isOther) {
    return `Other Segments – ${formatDollars(value)}`;
  }
  // Use full segment name for clarity
  return `${segmentName} – ${formatDollars(value)}`;
}
    // Dynamic margins: left based on ACTUAL label width after splitting, so chart is as big as possible
    // Helper to split segment name for margin calculation (same as label rendering logic)
    function splitSegmentNameForLines(name) {
      let clean = String(name).trim();
      if (clean.length < 16) return [clean];
      let hyphenIdx = clean.indexOf('-');
      if (hyphenIdx > 3 && hyphenIdx < clean.length - 3) {
        return [clean.slice(0, hyphenIdx + 1), clean.slice(hyphenIdx + 1).trim()];
      }
      let mid = Math.floor(clean.length / 2);
      let best = clean.length;
      let splitAt = -1;
      for (let i = 3; i < clean.length - 3; ++i) {
        if (clean[i] === ' ') {
          let dist = Math.abs(i - mid);
          if (dist < best) {
            best = dist;
            splitAt = i;
          }
        }
      }
      if (splitAt > 0) {
        return [clean.slice(0, splitAt), clean.slice(splitAt + 1)];
      }
      return [clean.slice(0, mid), clean.slice(mid)];
    }
    // Compute the max width of any split segment label (across up to two lines)
    let tempText = document.createElement('span');
    tempText.style.visibility = 'hidden';
    tempText.style.position = 'absolute';
    tempText.style.fontSize = '13px';
    tempText.style.fontWeight = 'bold';
    document.body.appendChild(tempText);
    let maxLabelWidth = 0;
    segments.forEach(s => {
      const lines = splitSegmentNameForLines(shortenSegmentName(s.segment));
      lines.forEach(line => {
        tempText.textContent = line;
        maxLabelWidth = Math.max(maxLabelWidth, tempText.offsetWidth);
      });
    });
    document.body.removeChild(tempText);
    // Add buffer for value line and a little extra for stroke
    const leftMargin = Math.max(36, maxLabelWidth + 18);

    // Substantially increased margins on both sides to prevent any label cropping
    const margin = { top: 50, right: 180, bottom: 30, left: 180 };
    // Use container width so chart always fits display area
    const width = d3Div.clientWidth;
    const height = 600;
    // Make SVG responsive to container width to avoid clipping labels
    const svg = d3.select(d3Div).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    // Header: logo, title, and subtitles
    const headerOffset = 80;
    const titleY = 30;
    const subtitle1Y = 50;
    const subtitle2Y = 70;
    const nameText = data.companyName || data.symbol || ticker;
    const logoSize = 60;
    const spacing = 10;
    // Measure company name width
    const temp = svg.append('text').attr('x',0).attr('y',-9999).style('font-size','20px').style('font-weight','bold').text(nameText);
    const textBBox = temp.node().getBBox(); temp.remove();
    const totalW = logoSize + spacing + textBBox.width;
    const extraLogoOffset = 50; // push logo further left
    const startX = 0; // align flush to left edge of display area
    // Logo on left (embed as data URL for html2canvas)
    let logoDataUrl = data.logo ? await toDataURL(data.logo) : null;
    if (logoDataUrl) {
      svg.append('image').attr('x', startX).attr('y', titleY - logoSize / 2).attr('width', logoSize).attr('height', logoSize).attr('xlink:href', logoDataUrl);
    }
    // Company name text
    svg.append('text').attr('x', startX + logoSize + spacing).attr('y', titleY).attr('text-anchor','start').style('font-size','20px').style('font-weight','bold').text(nameText);
    // Subtitles
    svg.append('text').attr('x', startX + logoSize + spacing).attr('y', subtitle1Y).attr('text-anchor','start').style('font-size','12px').text('TTM Income Statement');
    svg.append('text').attr('x', startX + logoSize + spacing).attr('y', subtitle2Y).attr('text-anchor','start').style('font-size','12px').text(`TTM as of ${data.date}`);
    // FirstLookStocks watermark logo at bottom right (embed as data URL for html2canvas)
    let watermarkUrl = await toDataURL('/firstlookstocks-watermark.png');
    svg.append('image')
      .attr('x', width - 160)
      .attr('y', height - 100)
      .attr('width', 160)
      .attr('height', 100)
      .attr('href', watermarkUrl)
      .attr('xlink:href', watermarkUrl)
      .attr('opacity', 0.8);
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top + headerOffset})`);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom - headerOffset;
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
    
    // Helper to add a link with proper handling of negative values
    function addLink(source, target, value) {
  // For sankey visualization, we need positive values
  // But we'll track if it was originally negative
  let absValue = Math.abs(value || 0);
  if (!absValue) return; // Skip zero values only (do not filter by threshold)
  const sourceIdx = nodeMap[source];
  const targetIdx = nodeMap[target];
  links.push({ 
    source: sourceIdx, 
    target: targetIdx, 
    value: absValue,
    isNegative: value < 0 // Track if original value was negative
  });
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
    
    // Ensure Cost of Revenue exists before sub-breakdown
    addNode('Cost of Revenue');
    
    // --- Cost of Revenue Sub-Details Breakdown ---
    if (detailedExpenses) {
      console.log('DEBUG: detailedExpenses for Cost of Revenue', detailedExpenses);
    }
    const corDetailNames = [
      { key: 'costOfGoodsSold', label: 'COGS' },
      { key: 'depreciation', label: 'Depreciation & Amortization' },
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

    // Rest of standard nodes
    const stdNodes = [
      'Operating Income',
      'Interest Expense', 
      'Income Tax Expense', 
      'Net Income'
    ];
    stdNodes.forEach(addNode);
    
    // --- UNIVERSAL REVENUE SEGMENT AUTO-SCALING FOR PERFECT ALIGNMENT ---
    // Use only the original values for scaling; do not mutate the segment objects yet
    if (segments && Array.isArray(segments) && segments.length > 0 && typeof data.revenue === 'number' && data.revenue > 0) {
      const segSum = segments.reduce((sum, s) => sum + (typeof s.revenue === 'number' ? s.revenue : 0), 0);
      // Compute scale factor but do NOT mutate segments
      let scale = 1;
      if (Math.abs(segSum - data.revenue) > 1e-2 && segSum > 0) {
        scale = data.revenue / segSum;
      }
      // Now add links from each segment to Revenue using the scaled value, but keep original segment values for tooltips/labels
      segments.forEach(s => {
        addLink(s.segment, 'Revenue', s.revenue * scale);
      });
    }
    
    // Revenue to Gross Profit and Cost of Revenue
    // For negative gross profit, handle specially
    if (isGrossProfitable) {
      // Normal case: positive gross profit
      addLink('Revenue', 'Gross Profit', data.grossProfit);
      addLink('Revenue', 'Cost of Revenue', data.costOfRevenue);
    } else {
      // Negative gross profit case - costs exceed revenue
      // Show full revenue going to Cost of Revenue
      addLink('Revenue', 'Cost of Revenue', data.revenue);
      
      // Then show the excess cost beyond revenue as a separate flow
      // This makes it clear that costs exceeded revenue
      const excessCost = data.costOfRevenue - data.revenue;
      if (excessCost > 0) {
        // Connect Cost of Revenue directly to Gross Profit to show the excess
        addLink('Cost of Revenue', 'Gross Profit', Math.abs(data.grossProfit));
      }
    }

    // --- Updated Operating Expenses Flow --- 
    const totalOperatingExpenses = Math.abs(data.operatingExpenses);

    // Link from Gross Profit to the intermediate Operating Expenses node
    if (totalOperatingExpenses > 0) {
        // Ensure Operating Expenses doesn't exceed Gross Profit
        const opExpValue = Math.min(totalOperatingExpenses, data.grossProfit);
        addLink('Gross Profit', 'Operating Expenses', opExpValue);
    }

    // --- Financially accurate handling for Operating Income/Loss flows ---
    if (isProfitable) {
      // Normal profitable case: connect Gross Profit to Operating Income
      addLink('Gross Profit', 'Operating Income', data.operatingIncome);
    } else {
      // FINANCIAL ACCURACY PRIORITY: Use the actual loss amount
      // For unprofitable companies, create a dedicated Operating Loss node with accurate value
      // Rather than trying to show flows to a negative value, which isn't possible in Sankey
      
      // Create a dedicated node with exactly the right size
      addNode('Operating Loss');
      
      // Use a minimal connection to ensure the node appears in the correct position
      // But has the accurate size representing the actual loss
      const MINIMUM_VISIBLE_FLOW = 1e5; // $100k minimum visibility
      
      // Connect using the absolute value of the operating loss
      // This ensures the node size accurately reflects the financial reality
      const absLoss = Math.abs(data.operatingIncome);
      addLink('Operating Expenses', 'Operating Loss', Math.max(absLoss, MINIMUM_VISIBLE_FLOW));
      
      // Remove the original 'Operating Income' node by not creating any links to it
      nodeMap['Operating Income'] = undefined;
    }

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
    // Link from Operating Income to Income Tax Expense
    if (data.incomeTaxExpense && data.incomeTaxExpense > 0) {
      addLink('Operating Income', 'Income Tax Expense', data.incomeTaxExpense);
    }
    
    // Link from Operating Income to Interest Expense
    if (data.interestExpense && data.interestExpense > 0) {
      addLink('Operating Income', 'Interest Expense', data.interestExpense);
    }
    
    // --- Financially accurate Net Income/Loss handling ---
    if (isNetProfitable) {
      // For profitable companies, show standard flow
      if (isProfitable) {
        // Normal case: operating income flows to net income
        addLink('Operating Income', 'Net Income', data.netIncome);
      } else {
        // Unusual case: operating loss but net profit (tax credits, one-time gains)
        // Connect from Operating Loss to Net Income
        addLink('Operating Loss', 'Net Income', data.netIncome);
      }
    } else {
      // FINANCIAL ACCURACY PRIORITY: For unprofitable net results
      // Create a dedicated Net Loss node with the exact right size
      addNode('Net Loss');
      
      // Use absolute value to accurately represent the loss amount
      const absNetLoss = Math.abs(data.netIncome);
      const MINIMUM_VISIBLE_FLOW = 1e5; // $100k minimum visibility
      
      if (isProfitable) {
        // Case: Operating profit turned into net loss (due to taxes/interest/writedowns)
        // Show flows from the expense items that caused the loss
        if (data.incomeTaxExpense > 0 && data.interestExpense > 0) {
          // Split between tax and interest if both present
          addLink('Income Tax Expense', 'Net Loss', absNetLoss * 0.5);
          addLink('Interest Expense', 'Net Loss', absNetLoss * 0.5);
        } else if (data.incomeTaxExpense > 0) {
          // Just tax expense
          addLink('Income Tax Expense', 'Net Loss', absNetLoss);
        } else if (data.interestExpense > 0) {
          // Just interest expense
          addLink('Interest Expense', 'Net Loss', absNetLoss);
        } else {
          // Fallback if no clear source
          addLink('Operating Income', 'Net Loss', Math.max(absNetLoss, MINIMUM_VISIBLE_FLOW));
        }
      } else {
        // Case: Operating loss led to net loss
        // Connect from Operating Loss to Net Loss
        addLink('Operating Loss', 'Net Loss', Math.max(absNetLoss, MINIMUM_VISIBLE_FLOW));
      }
      
      // Remove the original 'Net Income' node by not creating any links to it
      nodeMap['Net Income'] = undefined;
    }

    // Ensure growthData is defined and map node names to growth keys
    growthData = growthData || {};
    // Map node names to actual FMP API growth fields
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
      'Depreciation': 'growthDepreciationAndAmortization',
      'COGS': 'growthCostOfRevenue',
      'Depreciation & Amortization': 'growthDepreciationAndAmortization',
      'Other Cost of Revenue': 'growthCostOfRevenue'
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

    // Dynamic Sankey node sizing for adaptive zoom
    const dynamicNodeWidth = Math.max(30, chartWidth * 0.03);
    const dynamicNodePadding = Math.max(8, chartHeight * 0.02);
    // D3 Sankey layout
    const sankey = d3.sankey()
      .nodeWidth(dynamicNodeWidth)
      .nodePadding(dynamicNodePadding)
      .size([chartWidth, chartHeight])
      .nodeSort((a, b) => {
        // Custom vertical ordering: Net Income > Operating Income > Gross Profit > others > Cost of Revenue
        if (a.name === 'Net Income') return -1;
        if (b.name === 'Net Income') return 1;
        if (a.name === 'Operating Income') return -1;
        if (b.name === 'Operating Income') return 1;
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

    // Align Cost of Revenue detail nodes under Operating Expenses column
    const opExpNode = nodes.find(n => n.name === 'Operating Expenses');
    if (opExpNode) {
      corDetailNames.forEach(cat => {
        const detNode = nodes.find(n => n.name === cat.label);
        if (detNode) {
          detNode.x0 = opExpNode.x0;
          detNode.x1 = opExpNode.x1;
        }
      });
    }

    // Move Cost of Revenue to Gross Profit column to shorten revenue→CoR path
    const costNode = nodes.find(n => n.name === 'Cost of Revenue');
    const grossNode = nodes.find(n => n.name === 'Gross Profit');
    if (costNode && grossNode) {
      costNode.x0 = grossNode.x0;
      costNode.x1 = grossNode.x1;
    }

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

    // --- UNIVERSAL PIXEL-PERFECT NODE AND LINK ALIGNMENT ---
    function assignLinkSlots(nodes, links) {
  // --- UNIVERSAL GLOBAL SCALING FOR ALL LINKS/NODES ---
  // Find the maximum sum of incoming/outgoing for any node (the largest flow in the chart)
  const MIN_NODE_HEIGHT = 0; // No minimum node height, allow true proportionality
  const chartHeight = nodes.length > 0 ? Math.max(...nodes.map(n => (n.y1 || 0) - (n.y0 || 0))) : 400;
  // Compute the largest node value sum (to set the scale)
  const maxNodeSum = nodes.length > 0 ? Math.max(...nodes.map(node => {
    const outgoing = links.filter(l => l.source === node);
    const incoming = links.filter(l => l.target === node);
    const outSum = outgoing.reduce((sum, l) => sum + l.value, 0);
    const inSum = incoming.reduce((sum, l) => sum + l.value, 0);
    return Math.max(outSum, inSum, node.value || 0);
  })) : 1;
  // Use 90% of chart height for flows
  const usableHeight = chartHeight * 0.9;
  const pxPerValue = maxNodeSum > 0 ? usableHeight / maxNodeSum : 1;
  // Assign node heights
  nodes.forEach(node => {
    const outgoing = links.filter(l => l.source === node);
    const incoming = links.filter(l => l.target === node);
    const outSum = outgoing.reduce((sum, l) => sum + l.value, 0);
    const inSum = incoming.reduce((sum, l) => sum + l.value, 0);
    const nodeHeight = Math.max(outSum, inSum, MIN_NODE_HEIGHT);
    node._trueHeight = nodeHeight * pxPerValue;
    node.y1 = node.y0 + node._trueHeight;
  });

  // --- ENFORCE MINIMUM VERTICAL MARGIN FOR RIGHTMOST COLUMN ---
  const MIN_NODE_MARGIN = 18; // px
  // Find rightmost x0
  const rightmostX = Math.max(...nodes.map(n => n.x0));
  const rightNodes = nodes.filter(n => n.x0 === rightmostX).sort((a, b) => a.y0 - b.y0);
  // Calculate total height with margins
  let totalHeight = rightNodes.reduce((sum, n) => sum + n._trueHeight, 0) + (rightNodes.length - 1) * MIN_NODE_MARGIN;
  // If totalHeight > chartHeight, proportionally shrink node heights (except maybe largest)
  let y = 0;
  rightNodes.forEach(node => {
    node.y0 = y;
    node.y1 = y + node._trueHeight;
    y = node.y1 + MIN_NODE_MARGIN;
  });

  // Assign link slots using global pxPerValue
  nodes.forEach(node => {
    const outgoing = links.filter(l => l.source === node);
    let y = node.y0;
    outgoing.sort((a, b) => (a.target.y0 || 0) - (b.target.y0 || 0));
    outgoing.forEach(link => {
      let h = link.value * pxPerValue;
      link._sy0 = y;
      link._sy1 = y + h;
      link.y0 = y + h / 2;
      // Debug log for link width
      if (window.DEBUG_SAR_SANK) {
        console.log(`[Sankey] Link ${link.source.name} → ${link.target.name} value=${link.value}, pxWidth=${h}`);
      }
      y += h;
    });
  });
  nodes.forEach(node => {
    const incoming = links.filter(l => l.target === node);
    let y = node.y0;
    incoming.sort((a, b) => (a.source.y0 || 0) - (b.source.y0 || 0));
    incoming.forEach(link => {
      let h = link.value * pxPerValue;
      link._ty0 = y;
      link._ty1 = y + h;
      link.y1 = y + h / 2;
      y += h;
    });
  });
}


    assignLinkSlots(nodes, layoutLinks);

    // --- UNIVERSAL NODE VERTICAL ORDERING: PROFIT NODES ABOVE EXPENSES, WITH GROUP SEPARATION, AFTER CHILD GAPS ---
    function isProfitNode(node) {
      if (!node || !node.name) return false;
      // Special cases for highest priority nodes
      if (node.name === 'Net Income') return true;
      if (node.name === 'Operating Income') return true;
      const name = node.name.toLowerCase();
      return (
        name.includes('profit') ||
        (name.includes('income') && !name.includes('expense'))
      );
    }
    function isExpenseNode(node) {
      if (!node || !node.name) return false;
      const name = node.name.toLowerCase();
      return (
        name.includes('expense') ||
        name.includes('cost')
      );
    }
    const MIN_GROUP_GAP = 16;
    const columns = {};
    nodes.forEach(node => {
      const x = node.x0;
      if (!columns[x]) columns[x] = [];
      columns[x].push(node);
    });
    Object.values(columns).forEach(colNodes => {
      // Column-specific override: add spacing for Operating Expenses column
      if (opExpNode && Math.abs(colNodes[0].x0 - opExpNode.x0) < 1e-6) {
        const detailLabels = corDetailNames.map(c => c.label);
        colNodes.sort((a, b) => {
          const getPri = name =>
            name === 'Operating Income' ? 0 :
            name === 'Operating Expenses' ? 1 :
            detailLabels.includes(name) ? 2 :
            3;
          const ap = getPri(a.name), bp = getPri(b.name);
          return ap - bp || a.y0 - b.y0;
        });
        const gapIncomeToOpExp = 10; // px cushion between Operating Income and Operating Expenses
        const gapOpExpToDetails = 60; // px cushion between Operating Expenses and cost details
        const gapDetailNodes = 10; // px cushion between cost detail nodes
        let y = colNodes[0] ? colNodes[0].y0 : 0;
        colNodes.forEach((node, i) => {
          if (i === 1) y += gapIncomeToOpExp;
          if (i === 2) y += gapOpExpToDetails;
          if (i >= 3) y += gapDetailNodes;
          const h = node.y1 - node.y0;
          node.y0 = y;
          node.y1 = y + h;
          y += h;
        });
        return; // skip default grouping for this column
      }
      // Sort: profit nodes first, then others, then expense nodes
      colNodes.sort((a, b) => {
        const aProfit = isProfitNode(a), bProfit = isProfitNode(b);
        if (aProfit && !bProfit) return -1;
        if (!aProfit && bProfit) return 1;
        const aExpense = isExpenseNode(a), bExpense = isExpenseNode(b);
        if (aExpense && !bExpense) return 1;
        if (!aExpense && bExpense) return -1;
        // Both in same group: for expense group, bring Operating Income children up
        if (aExpense && bExpense) {
          const aFromOpInc = layoutLinks.some(l => l.target === a && l.source.name === 'Operating Income');
          const bFromOpInc = layoutLinks.some(l => l.target === b && l.source.name === 'Operating Income');
          if (aFromOpInc && !bFromOpInc) return -1;
          if (!aFromOpInc && bFromOpInc) return 1;
        }
        // Fallback: preserve current vertical order
        return a.y0 - b.y0;
      });
      let y = colNodes[0] ? colNodes[0].y0 : 0;
      // Find group boundaries
      let lastProfitIdx = -1, firstExpenseIdx = -1;
      for (let i = 0; i < colNodes.length; ++i) {
        if (isProfitNode(colNodes[i])) lastProfitIdx = i;
        if (firstExpenseIdx === -1 && isExpenseNode(colNodes[i])) firstExpenseIdx = i;
      }
      for (let i = 0; i < colNodes.length; ++i) {
        const node = colNodes[i];
        const h = node.y1 - node.y0;
        node.y0 = y;
        node.y1 = y + h;
        y += h;
        // Insert gap after last profit node, before first expense node
        if (i === lastProfitIdx && firstExpenseIdx > lastProfitIdx) {
          y += MIN_GROUP_GAP;
        }
      }
    });
    // Final re-assign link slots after all stacking
    assignLinkSlots(nodes, layoutLinks);

    // Wave effect: float profit nodes upward progressively
    const profitNodes = nodes.filter(isProfitNode).sort((a, b) => a.x0 - b.x0);
    const waveAmp = 50; // increased amplitude for visible wave effect
    const stepY = profitNodes.length > 1 ? waveAmp / (profitNodes.length - 1) : 0;
    profitNodes.forEach((n, i) => {
      n.y0 -= stepY * i;
      n.y1 -= stepY * i;
    });
    assignLinkSlots(nodes, layoutLinks);

    // --- UNIVERSAL MINIMUM VERTICAL GAP BETWEEN LEAF (END) NODES ONLY ---
    const MIN_LEAF_GAP = 18;
    const leafColumns = {};
    nodes.forEach(node => {
      const isLeaf = !layoutLinks.some(l => l.source === node);
      if (!isLeaf) return;
      const x = node.x0;
      if (!leafColumns[x]) leafColumns[x] = [];
      leafColumns[x].push(node);
    });
    Object.values(leafColumns).forEach(leafNodes => {
      if (leafNodes.length < 2) return;
      leafNodes.sort((a, b) => {
        const aProfit = isProfitNode(a), bProfit = isProfitNode(b);
        if (aProfit && !bProfit) return -1;
        if (!aProfit && bProfit) return 1;
        const aFromOpInc = layoutLinks.some(l => l.target === a && l.source.name === 'Operating Income');
        const bFromOpInc = layoutLinks.some(l => l.target === b && l.source.name === 'Operating Income');
        if (aFromOpInc && !bFromOpInc) return -1;
        if (!aFromOpInc && bFromOpInc) return 1;
        return a.y0 - b.y0;
      });
      let y0 = leafNodes[0].y0;
      leafNodes.forEach(n => {
        const h = n.y1 - n.y0;
        n.y0 = y0;
        n.y1 = y0 + h;
        y0 += h + MIN_LEAF_GAP;
      });
    });
    // Final re-assign for leafs
    assignLinkSlots(nodes, layoutLinks);

    // --- UNIVERSAL MINIMUM GAP BETWEEN REVENUE SEGMENTATION NODES (LEFTMOST COLUMN) ---
    const MIN_LEFT_GAP = 18;
    const minX = Math.min(...nodes.map(n => n.x0));
    const leftNodes = nodes.filter(n => n.x0 === minX);
    if (leftNodes.length > 1) {
      leftNodes.sort((a, b) => a.y0 - b.y0);
      let y1 = leftNodes[0].y0;
      leftNodes.forEach(n => {
        const h = n.y1 - n.y0;
        n.y0 = y1;
        n.y1 = y1 + h;
        y1 += h + MIN_LEFT_GAP;
      });
    }
    // Final re-assign for leftmost column
    assignLinkSlots(nodes, layoutLinks);

    // Color logic - accounts for profitability status
    function nodeColor(name) {
      if (segments.map(s => s.segment).includes(name) || name === 'Revenue') return '#555'; // grey
      
      // Adjust for unprofitable companies - make income/profit nodes red instead of green
      if (name === 'Operating Income' && !isProfitable) return '#c0392b'; // dark red for negative operating income
      if (name === 'Net Income' && !isNetProfitable) return '#c0392b'; // dark red for negative net income
      
      // Gross profit might be positive even when operating income is negative
      // Calculate if gross profit is positive
      const isGrossProfitable = data.grossProfit > 0;
      if (name === 'Gross Profit' && !isGrossProfitable) return '#c0392b'; // dark red for negative
      if (name === 'Gross Profit' && isGrossProfitable) return '#3cb371'; // green for positive
      
      // Normal profitable nodes are green
      if (name === 'Operating Income' || name === 'Net Income') return '#3cb371'; // green
      
      // Cost of Revenue detail nodes
      if (['COGS','Depreciation & Amortization','Other Cost of Revenue'].includes(name)) return '#c0392b';
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return '#c0392b'; // red
      return '#bbb';
    }
    function linkColor(d) {
      // Color links from Cost of Revenue red
      if (d.source.name === 'Cost of Revenue') return '#c0392b';
      
      // All expense paths are red
      const expenseNames = ['Cost of Revenue', 'Operating Expenses', 'Income Tax Expense'];
      if (d.target.name.includes('Expense') || expenseNames.includes(d.target.name)) {
          return '#c0392b';
      }
      
      // Adjust colors based on profitability
      if (d.target.name === 'Operating Income' && !isProfitable) return '#c0392b';
      if (d.target.name === 'Net Income' && !isNetProfitable) return '#c0392b';
      
      // Check gross profit specifically
      if (d.target.name === 'Gross Profit') {
        const isGrossProfitable = data.grossProfit > 0;
        return isGrossProfitable ? '#3cb371' : '#c0392b';
      }
      
      // Normal profit/income flows are green
      if (['Operating Income', 'Net Income'].includes(d.target.name)) {
        return '#3cb371';
      }
      
      return '#bbb'; // Default gray
    }

    // Format as $X.XXB, $X.XXM, etc.
    // Enhanced formatDollars to clearly show negative values with parentheses
    function formatDollars(val) {
      // Guards against NaN, undefined, etc.
      if (val === null || val === undefined || isNaN(val)) {
        return '$0.00';
      }
      
      // Handle negative values with parentheses for clearer visualization
      const isNegative = val < 0;
      const absVal = Math.abs(val);
      let formatted;
      
      if (absVal >= 1e9) {
        formatted = '$' + (absVal/1e9).toFixed(2) + 'B';
      } else if (absVal >= 1e6) {
        formatted = '$' + (absVal/1e6).toFixed(2) + 'M';
      } else if (absVal >= 1e3) {
        formatted = '$' + (absVal/1e3).toFixed(2) + 'K';
      } else {
        formatted = '$' + absVal.toFixed(2);
      }
      
      return isNegative ? '(' + formatted + ')' : formatted;
    }
    
    // Format node label with profit/loss terminology and include the amount in the label
    function formatNodeLabel(name, val) {
      // Guard against bad values
      if (val === null || val === undefined || isNaN(val)) {
        return name; // Just return the original name if value is invalid
      }
      
      // Special formatting for income-related nodes when value is negative
      const isNegative = val < 0;
      
      // For income nodes, check also the global flags for more reliable detection
      if (isNegative) {
        const absVal = Math.abs(val);
        const dollarAmount = formatDollars(-absVal); // Ensure negative format
        
        // More aggressive checks for unprofitable nodes
        if (name === 'Operating Income' || name.includes('Operating Income')) 
          return `Operating Loss ${dollarAmount}`;
        if (name === 'Net Income' || name.includes('Net Income')) 
          return `Net Loss ${dollarAmount}`;
        if (name === 'Gross Profit' || name.includes('Gross Profit')) 
          return `Gross Loss ${dollarAmount}`;
      }
      
      return name;
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

    // --- UNIVERSAL NODE LABELING AND FILTERING LOGIC ---
    // Only render labels for connected nodes regardless of size/value
    const importantNodesForLabels = nodes.filter(n => {
      const isConnected = layoutLinks.some(l => l.source === n || l.target === n);
      const hasName = n.name && n.name.trim().length > 0;
      return isConnected && hasName;
    });

    // --- STANDARDIZED LABEL OFFSETS ---
    const TITLE_OFFSET = 0;
    const VALUE_OFFSET = 16;
    const MARGIN_OFFSET = 32;
    const GROWTH_OFFSET = 32; // Add offset for Revenue YoY growth line

    function getMargin(name, data) {
      if (name === 'Gross Profit' && data.revenue > 0) return (data.grossProfit / data.revenue * 100).toFixed(0) + '% margin';
      if (name === 'Operating Income' && data.revenue > 0) return (data.operatingIncome / data.revenue * 100).toFixed(0) + '% margin';
      if (name === 'Net Income' && data.revenue > 0) return (data.netIncome / data.revenue * 100).toFixed(0) + '% margin';
      if (name === 'Cost of Revenue' && data.revenue > 0) return (data.costOfRevenue / data.revenue * 100).toFixed(0) + '% of revenue';
      if (name === 'Operating Expenses' && data.revenue > 0) return (data.operatingExpenses / data.revenue * 100).toFixed(0) + '% of revenue';
      return '';
    }

    chartGroup.selectAll('.node-label').remove();
    labelGroup = chartGroup.append('g');
    importantNodesForLabels.forEach(d => {
      const isSeg = segments.map(s => s.segment).includes(d.name);
      const cx = isSeg ? d.x0 - 10 : d.x0 + (d.x1 - d.x0) / 2;
      const anchor = isSeg ? 'end' : 'middle';
      const marginText = getMargin(d.name, data);
      const belowBar = (d.name === 'Cost of Revenue' || d.name === 'Operating Expenses');
      let yBase;
      if (!isSeg) {
        // Dynamic vertical offset for below-bar labels
        if (belowBar) {
          const rectHeight = d.y1 - d.y0;
          const labelHeight = 18; // px, adjust if your label is taller
          const minOffset = 12;
          // Space above
          let spaceAbove = d.y0;
          const nodesAbove = nodes.filter(n => n.x0 === d.x0 && n.y1 < d.y0);
          if (nodesAbove.length > 0) {
            spaceAbove = d.y0 - Math.max(...nodesAbove.map(n => n.y1));
          }
          // Space below
          let spaceBelow = chartHeight - d.y1;
          const nodesBelow = nodes.filter(n => n.x0 === d.x0 && n.y0 > d.y1);
          if (nodesBelow.length > 0) {
            spaceBelow = Math.min(...nodesBelow.map(n => n.y0)) - d.y1;
          }
          // Try below first if enough space
          if (spaceBelow >= labelHeight + minOffset) {
            yBase = d.y1 + minOffset + labelHeight / 2 + 4; // Nudge down by 4px
          } else if (spaceAbove >= labelHeight + minOffset) {
            yBase = d.y0 - minOffset - labelHeight / 2;
          } else if (spaceBelow >= spaceAbove) {
            // Clamp to whatever space is available below
            yBase = d.y1 + Math.max(minOffset, spaceBelow / 2);
          } else {
            // Clamp to whatever space is available above
            yBase = d.y0 - Math.max(minOffset, spaceAbove / 2);
          }
        } else {
          yBase = d.y0 - 22;
        }
        const isCostDetailNode = ['COGS', 'Depreciation & Amortization', 'Other Cost of Revenue'].includes(d.name);
        const rightEdge = isCostDetailNode || d.x1 > chartWidth - 40;
        let labelX = cx;
        let labelAnchor = anchor;
        if (rightEdge) {
          labelX = d.x1 + 10;
          labelAnchor = 'start';
        }
        const rightEdgeYOffset = rightEdge ? 20 : 0; // Increase Y-offset to align right-edge labels closer to rects
        let topEdgeYOffset = 0;
        if (d.name === 'Revenue') {
          topEdgeYOffset = -35;
        } else if (yBase < 100 || ['Gross Profit', 'Operating Income', 'Net Income'].includes(d.name)) {
          topEdgeYOffset = -25;
        }
        // --- Universal vertical spacing for right-edge labels ---
const LABEL_VERTICAL_SPACING = 12; // px, adjust this for tighter/looser spacing
// Collapsed right-edge labels into one line
        if (rightEdge) {
          const displayName = d.name.replace(/\s*expenses?$/i, '');
          const midY = (d.y0 + d.y1) / 2;
          const rectHeight = d.y1 - d.y0;
          // Ensure negative values are displayed with appropriate styling
          // Directly check the global profit status rather than just the local value
          let isNegative = false;
          let valueToUse = d.value;
          // Set loss status based on overall company profitability
          if (displayName === 'Operating Income' || displayName.includes('Operating')) {
              isNegative = !isProfitable;
              valueToUse = -Math.abs(data.operatingIncome); // Force negative for correct display
          }
          if (displayName === 'Operating Loss') {
              isNegative = true;
              valueToUse = -Math.abs(data.operatingIncome); // Force negative for correct display
              d.value = Math.abs(data.operatingIncome); // Set for value label
          }
          if (displayName === 'Net Income' || displayName.includes('Net')) {
              isNegative = !isNetProfitable;
              valueToUse = -Math.abs(data.netIncome); // Force negative for correct display
          }
          if (displayName === 'Net Loss') {
              isNegative = true;
              valueToUse = -Math.abs(data.netIncome); // Force negative for correct display
              d.value = Math.abs(data.netIncome); // Set for value label
          }
          if (displayName === 'Gross Profit' || displayName.includes('Gross')) {
              isNegative = !isGrossProfitable;
              valueToUse = -Math.abs(data.grossProfit); // Force negative for correct display
          }
          if (displayName === 'Gross Loss') {
              isNegative = true;
              valueToUse = -Math.abs(data.grossProfit); // Force negative for correct display
              d.value = Math.abs(data.grossProfit); // Set for value label
          }
          // For negative values, display only the label with loss amount already included
          const displayLabel = isNegative ? formatNodeLabel(displayName, valueToUse) : displayName;
          // Value for display  
          const dollarValue = isNegative ? 
                Math.abs(valueToUse || d.value) : // Use absolute value for the display 
                d.value;
          // --- Smart single-line if rect is small ---
          const SMALL_RECT_HEIGHT = 10; // px, threshold for single-line label
          if (rectHeight < SMALL_RECT_HEIGHT) {
            // Render as one line: "$1.60B - Income Tax"
            // Render as one line, but split into tspans for color
            const textEl = labelGroup.append('text')
              .attr('class', 'nodelabel-right nodelabel-right-single')
              .attr('x', labelX)
              .attr('y', midY)
              .attr('text-anchor', labelAnchor)
              .attr('alignment-baseline', 'middle')
              .style('font-size', '14px')
              .style('font-weight', '600')
              .style('paint-order', 'stroke')
              .style('stroke', 'white')
              .style('stroke-width', 4)
              .style('stroke-linejoin', 'round')
              .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
            // Force red for expense nodes
            const isExpenseNode = ['COGS','Depreciation & Amortization','Other Cost of Revenue'].includes(d.name) || d.name === 'Cost of Revenue' || d.name === 'Operating Expenses' || d.name.includes('Expense');
            textEl.append('tspan')
              .text(formatDollars(isNegative ? -dollarValue : dollarValue))
              .style('fill', (isNegative || isExpenseNode) ? '#e74c3c' : nodeSolidColor(d.name));
            textEl.append('tspan')
              .text(' - ' + displayLabel)
              .style('fill', '#eceff4');
            return;
          }
          // Otherwise, use two-line layout
          labelGroup.append('text')
            .attr('class', 'nodelabel-right')
            .attr('x', labelX)
            .attr('y', midY - LABEL_VERTICAL_SPACING/2) // Universal spacing above value
            .attr('text-anchor', labelAnchor)
            .attr('alignment-baseline', 'middle')
            .text(displayLabel) // Just show the label (Net Loss, etc.)
            .style('font-size', '15px')
            .style('font-weight', 'bold')
            .style('fill', isNegative ? '#c0392b' : nodeSolidColor(d.name)) // Dark red for negative
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 6)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
          // Then add the dollar amount below
          labelGroup.append('text')
            .attr('class', 'nodelabel-right-value')
            .attr('x', labelX)
            .attr('y', midY + LABEL_VERTICAL_SPACING/2) // Universal spacing below title
            .attr('text-anchor', labelAnchor)
            .attr('alignment-baseline', 'middle')
            .text(formatDollars(isNegative ? -dollarValue : dollarValue)) // Show formatted value
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            // Force red for expense nodes
            .style('fill', (isNegative || ['COGS','Depreciation & Amortization','Other Cost of Revenue','Cost of Revenue','Operating Expenses'].includes(d.name) || d.name.includes('Expense')) ? '#e74c3c' : nodeSolidColor(d.name)) // Bright red for negative dollar amounts
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 4)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
          return;
        }
            // Use formatNodeLabel to potentially change terminology (e.g., income → loss)
        // Always check the global profit status first for accurate labeling
        let isNegative = false;
        let forceAmount = null;
        
        // Force loss labels based on the company's overall profitability status
        if (d.name === 'Operating Income' || d.name.includes('Operating Income')) {
            isNegative = !isProfitable;
            forceAmount = Math.abs(data.operatingIncome);
        }
        if (d.name === 'Operating Loss') {
            // For Operating Loss nodes, always get the right amount
            forceAmount = Math.abs(data.operatingIncome);
            d.value = forceAmount; // Set the actual value for use in the value label
        }
        if (d.name === 'Net Income' || d.name.includes('Net Income')) {
            isNegative = !isNetProfitable;
            forceAmount = Math.abs(data.netIncome);
        }
        if (d.name === 'Net Loss') {
            // For Net Loss nodes, always get the right amount
            forceAmount = Math.abs(data.netIncome);
            d.value = forceAmount; // Set the actual value for use in the value label
        }
        if (d.name === 'Gross Profit' || d.name.includes('Gross Profit')) {
            isNegative = !isGrossProfitable;
            forceAmount = Math.abs(data.grossProfit);
        }
        if (d.name === 'Gross Loss') {
            // For Gross Loss nodes, always get the right amount
            forceAmount = Math.abs(data.grossProfit);
            d.value = forceAmount; // Set the actual value for use in the value label
        }
        
        // If we've detected a loss situation, use the actual values from data
        const valueToUse = isNegative && forceAmount ? -forceAmount : d.value;
        const displayLabel = formatNodeLabel(d.name, valueToUse);
        
        labelGroup.append('text')
          .attr('class', 'nodelabel')
          .attr('x', labelX)
          .attr('y', yBase + TITLE_OFFSET + rightEdgeYOffset + topEdgeYOffset)
          .attr('text-anchor', labelAnchor)
          .attr('alignment-baseline', 'hanging')
          .text(displayLabel) // Use the potentially modified label
          .style('font-size', '15px')
          .style('font-weight', 'bold')
          .style('fill', isNegative ? '#c0392b' : nodeSolidColor(d.name)) // Red for negative
          .style('paint-order', 'stroke')
          .style('stroke', 'white')
          .style('stroke-width', 6)
          .style('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))'); 
        if (typeof d.value === 'number' && !isNaN(d.value)) {
          // Consistent negative value styling for dollar amounts
          const isNegative = d.value < 0;
          
          // Always show the dollar amount for all nodes, including Loss nodes
          {
            labelGroup.append('text')
              .attr('class', 'nodelabel-value')
              .attr('x', labelX)
              .attr('y', yBase + VALUE_OFFSET + rightEdgeYOffset + topEdgeYOffset)
              .attr('text-anchor', labelAnchor)
              .attr('alignment-baseline', 'hanging')
              .text(formatDollars(d.value))
              .style('font-size', '15px')
              .style('font-weight', 'bold')
              .style('fill', isNegative ? '#e74c3c' : nodeSolidColor(d.name)) // Bright red for negative
              .style('paint-order', 'stroke')
              .style('stroke', 'white')
              .style('stroke-width', 5)
              .style('stroke-linejoin', 'round')
              .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
          }
        }
        if (d.name === 'Revenue' && growthData[growthKeyMap['Revenue']] != null) {
          const yoy = growthData[growthKeyMap['Revenue']];
          labelGroup.append('text')
            .attr('class', 'nodelabel-growth')
            .attr('x', labelX)
            .attr('y', yBase + GROWTH_OFFSET + rightEdgeYOffset + topEdgeYOffset)
            .attr('text-anchor', labelAnchor)
            .attr('alignment-baseline', 'hanging')
            .text((yoy > 0 ? '+' : '') + (yoy * 100).toFixed(1) + '% YoY')
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .style('fill', nodeSolidColor(d.name))
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 4)
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
        // Universal three-line label logic for left-edge (segment) nodes
        const rectHeight = d.y1 - d.y0;
        const THREE_LINE_THRESHOLD = 34; // px, threshold for three-line label
        const TWO_LINE_THRESHOLD = 18; // px, threshold for two-line label
        const labelFontSize = 13;
        const valueFontSize = 12;
        const centerY = (d.y0 + d.y1) / 2;
        // Helper to split a segment name into up to two lines, breaking at spaces or hyphens
        function splitSegmentNameForLines(name) {
          // Prefer breaking at space nearest to middle, or hyphen
          let clean = String(name).trim();
          if (clean.length < 16) return [clean];
          // Try hyphen first
          let hyphenIdx = clean.indexOf('-');
          if (hyphenIdx > 3 && hyphenIdx < clean.length - 3) {
            return [clean.slice(0, hyphenIdx + 1), clean.slice(hyphenIdx + 1).trim()];
          }
          // Otherwise, break at nearest space to middle
          let mid = Math.floor(clean.length / 2);
          let best = clean.length;
          let splitAt = -1;
          for (let i = 3; i < clean.length - 3; ++i) {
            if (clean[i] === ' ') {
              let dist = Math.abs(i - mid);
              if (dist < best) {
                best = dist;
                splitAt = i;
              }
            }
          }
          if (splitAt > 0) {
            return [clean.slice(0, splitAt), clean.slice(splitAt + 1)];
          }
          // Fallback: just split into two near the middle
          return [clean.slice(0, mid), clean.slice(mid)];
        }
        const segLines = splitSegmentNameForLines(shortenSegmentName(d.name));
        if (rectHeight >= THREE_LINE_THRESHOLD) {
          // Render as three lines: segment name split across two lines, value on third
          labelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-title')
            .attr('x', cx)
            .attr('y', centerY - labelFontSize)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(segLines[0] || '')
            .style('font-size', labelFontSize + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#999')
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
          if (segLines[1]) {
            labelGroup.append('text')
              .attr('class', 'nodelabel-left nodelabel-left-title')
              .attr('x', cx)
              .attr('y', centerY)
              .attr('text-anchor', anchor)
              .attr('alignment-baseline', 'middle')
              .text(segLines[1])
              .style('font-size', labelFontSize + 'px')
              .style('font-weight', 'bold')
              .style('fill', '#999')
              .style('paint-order', 'stroke')
              .style('stroke', 'white')
              .style('stroke-width', 5)
              .style('stroke-linejoin', 'round')
              .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
          }
          labelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-value')
            .attr('x', cx)
            .attr('y', centerY + labelFontSize + 2)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(formatDollars(d.value))
            .style('font-size', valueFontSize + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#bbb')
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 4)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        } else if (rectHeight >= TWO_LINE_THRESHOLD) {
          // Render as two lines: segment name and value
          labelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-title')
            .attr('x', cx)
            .attr('y', centerY - 4)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(segLines.join(' '))
            .style('font-size', labelFontSize + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#999')
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
          labelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-value')
            .attr('x', cx)
            .attr('y', centerY + labelFontSize + 2)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(formatDollars(d.value))
            .style('font-size', valueFontSize + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#bbb')
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 4)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        } else {
          // Collapsed left-edge labels into one line (Title - Dollar Amount)
          labelGroup.append('text')
            .attr('class', 'nodelabel-left')
            .attr('x', cx)
            .attr('y', centerY)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', 'middle')
            .text(segLines.join(' ') + ' - ' + formatDollars(d.value))
            .style('font-size', labelFontSize + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#999')
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))');
        }
        return;
      }
    });
    // Remove stroke and filters, then apply hierarchical text styling
    labelGroup.selectAll('text')
      .style('stroke', 'none')
      .style('stroke-width', 0)
      .style('filter', 'none');
    // Primary labels (node names)
    labelGroup.selectAll('.nodelabel, .nodelabel-right, .nodelabel-left')
      .style('fill', '#eceff4')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('opacity', 1);
    // Values
    labelGroup.selectAll('.nodelabel-value')
      .style('fill', '#bbb')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('opacity', 0.9);
    // Growth % (less prominent)
    labelGroup.selectAll('.nodelabel-growth')
      .style('fill', '#999')
      .style('font-size', '12px')
      .style('font-style', 'italic')
      .style('opacity', 0.7);
    // Margin text (least prominent)
    labelGroup.selectAll('.nodelabel-margin')
      .style('fill', '#777')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('opacity', 0.7);

    // --- UNIVERSAL NODE RENDERING FILTER ---
    // Render all rectangles for connected nodes regardless of size/value
    const importantNodes = nodes.filter(n => {
      const isConnected = layoutLinks.some(l => l.source === n || l.target === n);
      const hasName = n.name && n.name.trim().length > 0;
      return isConnected && hasName;
    });

    chartGroup.append('g').selectAll('rect')
      .data(importantNodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('fill', d => nodeColor(d.name));

    // Draw links
    chartGroup.selectAll('path.sankey-link')
      .data(layoutLinks)
      .join('path')
      .attr('class', 'sankey-link')
      .attr('d', d => {
        const x0 = d.source.x1, x1 = d.target.x0;
        const y0a = d._sy0, y0b = d._sy1;
        const y1a = d._ty0, y1b = d._ty1;
        // Use cubic Bezier for smoothness, but endpoints always flush
        const curvature = 0.5;
        const xi = d3.interpolateNumber(x0, x1);
        const x2 = xi(curvature), x3 = xi(1 - curvature);
        return [
          'M', x0, y0a,
          'C', x2, y0a, x3, y1a, x1, y1a,
          'L', x1, y1b,
          'C', x3, y1b, x2, y0b, x0, y0b,
          'Z'
        ].join(' ');
      })
      .attr('fill', d => linkColor(d))
      .attr('opacity', 0.5)
      .attr('stroke', '#bbb')
      .attr('stroke-width', 0); // No outline, just filled band

    // Helper to compute the center of a curved Sankey link
    function getLinkRibbonCenter(d) {
      // For vertical alignment, use the midpoint between the link's y0 and y1 (which are already adjusted for node height)
      // For horizontal, use the midpoint between source.x1 and target.x0
      const x = (d.source.x1 + d.target.x0) / 2;
      const y = (d.y0 + d.y1) / 2;
      return [x, y];
    }

    // --- Add YoY Growth Labels ---
    // For segment-to-Revenue links, show only one YoY label per segment, centered in the segment node, vertically spaced
    if (segments && segments.length) {
      // Calculate vertical spacing and font size for dense segments
      const segNodes = layoutLinks.filter(l => l.target === nodes.find(n => n.name === 'Revenue') && l.source && l.source.x0 < nodes.find(n => n.name === 'Revenue').x0);
      const segmentNodesOrdered = segNodes.map(l => l.source).sort((a, b) => a.y0 - b.y0);
      const totalSegs = segmentNodesOrdered.length;
      const nodeHeight = nodes.find(n => n.name === 'Revenue').y1 - nodes.find(n => n.name === 'Revenue').y0;
      // Minimum spacing and font size
      let minSpacing = 18;
      const fontSize = 10; // reduced size for segment YoY labels
      if (totalSegs > 10) {
        minSpacing = Math.max(12, nodeHeight / totalSegs);
      }
      // Prepare label positions for collision avoidance
      const labelPos = [];
      chartGroup.selectAll('text.yoy-label-segment')
        .data(segmentNodesOrdered)
        .join('text')
        .attr('class', 'yoy-label yoy-label-segment')
        .attr('x', d => d.x1 + 8)
        .attr('y', (d, i) => {
          const base = (d.y0 + d.y1) / 2;
          labelPos.push({y: base, height: fontSize, setY: y => d._labelY = y});
          return base;
        })
        .attr('text-anchor', 'start')
        .attr('font-size', fontSize + 'px')
        .attr('fill', '#222')
        .attr('font-weight', 700)
        .style('cursor', 'pointer')
        .text(d => {
          const seg = segments.find(s => s.segment === d.name);
          if (seg && typeof seg.yoy === 'number') {
            return (seg.yoy > 0 ? '+' : '') + seg.yoy.toFixed(1) + '% YoY';
          }
          return '';
        })
        .append('title')
        .text(d => d.name);
      // Apply collision avoidance after initial render
      function avoidLabelOverlap(labels, minSpacing = 16) {
        // labels: array of {y: initialY, height, setY: fn(newY)}
        labels.sort((a, b) => a.y - b.y);
        for (let i = 1; i < labels.length; ++i) {
          const prev = labels[i-1];
          const curr = labels[i];
          if (curr.y - prev.y < minSpacing) {
            curr.y = prev.y + minSpacing;
            curr.setY(curr.y);
          }
        }
      }
      avoidLabelOverlap(labelPos, minSpacing);
      chartGroup.selectAll('text.yoy-label-segment')
        .attr('y', (d, i) => d._labelY || (d.y0 + d.y1) / 2);
    }
    // For all other links, show YoY label at link center, but only one per link
    chartGroup.selectAll('text.yoy-label-general')
      .data(layoutLinks.filter(link => {
        if (!link || !link.source || !link.target) return false;
        // Exclude segment-to-revenue links (handled above)
        if (segments && segments.length && link.target.name === 'Revenue' && segments.some(s => s.segment === link.source.name)) {
          return false;
        }
        return typeof growthKeyMap !== 'undefined' && growthKeyMap[link.target.name] && growthData && growthData[growthKeyMap[link.target.name]] != null;
      }))
      .join('text')
      .attr('class', 'yoy-label yoy-label-general')
      .attr('x', d => d && d.source && d.target ? getLinkRibbonCenter(d)[0] : 0)
      .attr('y', d => d && d.source && d.target ? getLinkRibbonCenter(d)[1] : 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px') // Changed from 14px to 12px
      .attr('fill', '#999') // Changed from #222 to #999
      .attr('font-weight', 400) // Changed from 700 to 400
      .style('opacity', 0.6) // Added opacity
      .text(d => {
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
      .attr('font-size', '12px') // Changed from 14px to 12px
      .attr('fill', '#999') // Changed from #222 to #999
      .attr('font-weight', 400) // Changed from 700 to 400
      .style('opacity', 0.6) // Added opacity
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

    // If no segments, do not render segment nodes/links or segment YoY labels
    if (!segments || !segments.length) {
      // Remove any segment-specific YoY labels
      chartGroup.selectAll('text.yoy-label-segment').remove();
    }

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
