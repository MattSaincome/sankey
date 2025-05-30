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
    
    // Add pattern definitions for negative flows
    const defs = svg.append('defs');
    
    // Cross-hatch pattern for negative flows
    const pattern = defs.append('pattern')
      .attr('id', 'negative-flow-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8);
    
    // Add red background
    pattern.append('rect')
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', '#c0392b')
      .attr('opacity', 0.5);
    
    // Add diagonal lines for cross-hatch effect
    pattern.append('path')
      .attr('d', 'M0,8 L8,0')
      .attr('stroke', '#8b0000')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6);
    
    pattern.append('path')
      .attr('d', 'M0,0 L8,8')
      .attr('stroke', '#8b0000')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6);
    
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
  const isNegative = value < 0;
  if (isNegative) {
    console.log('[DEBUG] Creating negative link:', source, '→', target, 'value:', value);
  }
  links.push({ 
    source: sourceIdx, 
    target: targetIdx, 
    value: absValue,
    isNegative: isNegative // Track if original value was negative
  });
}

    // Helper function to recursively update depths of downstream nodes
function updateDownstreamDepthsRecursive(currentNode, currentDepth, allGraphNodes) {
    // Find outgoing links from the currentNode.
    // currentNode.sourceLinks should ideally be populated by initializeNodeDepths or a similar graph processing step.
    // If not, we might need to search allLinks, but that's less efficient.
    const outgoingLinks = currentNode.sourceLinks || allGraphNodes.flatMap(n => n.sourceLinks || []).filter(l => l.source.name === currentNode.name);

    (outgoingLinks).forEach(link => {
        const targetNode = link.target;
        const newTargetDepth = currentDepth + 1;
        // Only update if new depth is greater, to push things right and avoid issues with cycles (though graph should be DAG)
        if (targetNode.depth < newTargetDepth) {
            console.log(`[Depth Adjust] Updating depth for ${targetNode.name} from ${targetNode.depth} to ${newTargetDepth}`);
            targetNode.depth = newTargetDepth;
            updateDownstreamDepthsRecursive(targetNode, newTargetDepth, allGraphNodes);
        }
    });
}

    // --- Product Segments: Explicit Order ---
    if (segments.length > 0) {
      // Filter out invalid segment names
      const validSegments = segments.filter(s => {
        const name = s.segment ? s.segment.toLowerCase() : '';
        return name && !name.includes('reportable') && name !== 'segment' && s.revenue > 0;
      });
      
      if (validSegments.length > 0) {
        const desiredOrder = ['iPhone', 'Mac', 'iPad', 'Service', 'Accessories'];
        validSegments.sort((a, b) => desiredOrder.indexOf(a.segment) - desiredOrder.indexOf(b.segment));
        validSegments.forEach(s => {
          addNode(s.segment);
        });
      }
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
      'Income Before Taxes',
      'Income Tax Expense', 
      'Net Income',
      'Net Loss' // Add Net Loss to standard nodes so it's always included
    ];
    stdNodes.forEach(addNode);
    
    // --- UNIVERSAL REVENUE SEGMENT AUTO-SCALING FOR PERFECT ALIGNMENT ---
    // Use only the original values for scaling; do not mutate the segment objects yet
    if (segments && Array.isArray(segments) && segments.length > 0 && typeof data.revenue === 'number' && data.revenue > 0) {
      // Filter out invalid segments again for consistency
      const validSegments = segments.filter(s => {
        const name = s.segment ? s.segment.toLowerCase() : '';
        return name && !name.includes('reportable') && name !== 'segment' && s.revenue > 0;
      });
      
      if (validSegments.length > 0) {
        const segSum = validSegments.reduce((sum, s) => sum + (typeof s.revenue === 'number' ? s.revenue : 0), 0);
        // Compute scale factor but do NOT mutate segments
        let scale = 1;
        if (Math.abs(segSum - data.revenue) > 1e-2 && segSum > 0) {
          scale = data.revenue / segSum;
        }
        // Now add links from each segment to Revenue using the scaled value, but keep original segment values for tooltips/labels
        validSegments.forEach(s => {
          addLink(s.segment, 'Revenue', s.revenue * scale);
        });
      }
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
      // Calculate the direct flow from Gross Profit to Operating Income
      // Operating Income = Gross Profit - Operating Expenses
      const operatingExpensesValue = Math.min(totalOperatingExpenses, data.grossProfit);
      const directToOperatingIncome = data.grossProfit - operatingExpensesValue;
      
      // Add link from Gross Profit to Operating Income
      if (directToOperatingIncome > 0) {
        addLink('Gross Profit', 'Operating Income', directToOperatingIncome);
      }
    } else {
      // FINANCIAL ACCURACY PRIORITY: Show Operating Loss as negative money
      // For unprofitable companies, Operating Loss represents expenses exceeding Gross Profit
      
      // Create the Operating Loss node
      addNode('Operating Loss');
      
      // VISUALIZE OPERATING LOSS CORRECTLY AS A DIRECT OVERHANG FROM GROSS PROFIT
      // Create the crucial direct link from Gross Profit to Operating Loss
      // This is the key to showing Operating Loss as an "overhang" from Gross Profit
      // indicating that expenses exceed gross profit, resulting in a loss
      const absLoss = Math.abs(data.operatingIncome);
      // Mark this as a negative flow since it represents a loss
      addLink('Gross Profit', 'Operating Loss', -absLoss);
      
      // We'll handle the positioning after the Sankey layout is created
      
      // NO connection from Operating Expenses to Operating Loss
      // This ensures Operating Loss appears as a direct overhang from Gross Profit
      
      // Remove the original 'Operating Income' node as we're using Operating Loss instead
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
 
    // --- Standard Income Statement Flow ---
    // Step 1: Handle Interest Expense as a deduction from Operating Income
    const interestValue = Math.abs(data.interestExpense || -data.interestIncome || 0);
    
    if (isProfitable) {
      // Link from Operating Income to Interest Expense
      if (data.interestExpense && data.interestExpense > 0) {
        addLink('Operating Income', 'Interest Expense', data.interestExpense);
      }
      
      // Step 2: Link from Operating Income to Income Before Taxes (after interest expense)
      const operatingToIBT = data.operatingIncome - (data.interestExpense || 0);
      if (operatingToIBT > 0) {
        addLink('Operating Income', 'Income Before Taxes', operatingToIBT);
      }
      
      // Step 3: Check if there's any Other Income contributing to Income Before Taxes
      // This captures non-operating income like investment returns, asset sales, etc.
      const otherIncome = data.incomeBeforeTax - operatingToIBT;
      if (otherIncome > 1e6) { // More than $1M to be visible
        addNode('Other Income');
        addLink('Other Income', 'Income Before Taxes', otherIncome);
      }
    } else {
      // For unprofitable companies with our new visualization approach
      
      // Step 1: Connect Operating Loss to Income Before Taxes
      // The Operating Loss directly affects Income Before Taxes
      const absLoss = Math.abs(data.operatingIncome);
      // Mark Operating Loss as negative flow by passing negative value
      addLink('Operating Loss', 'Income Before Taxes', -absLoss);
      
      // Step 2: Check for Other Income (non-operating sources)
      // This represents income from sources other than core operations that may offset the loss
      const otherIncome = data.incomeBeforeTax + absLoss; // If positive, represents additional income
      
      // Add Other Income node if significant
      if (otherIncome > 1e6) { // More than $1M to be visible
        addNode('Other Income');
        addLink('Other Income', 'Income Before Taxes', otherIncome);
      }
    }
    
    // Step 4: Link from Income Before Taxes to Income Tax Expense
    if (data.incomeTaxExpense && data.incomeTaxExpense > 0) {
      addLink('Income Before Taxes', 'Income Tax Expense', data.incomeTaxExpense);
    }
    
    // Step 5: Link from Income Before Taxes to Net Income/Loss
    if (isNetProfitable) {
      const ibtToNetIncome = data.incomeBeforeTax - (data.incomeTaxExpense || 0);
      if (ibtToNetIncome > 0) {
        addLink('Income Before Taxes', 'Net Income', ibtToNetIncome);
      }
    } else {
      // For net loss, connect from Income Before Taxes to Net Loss
      addLink('Income Before Taxes', 'Net Loss', data.netIncome); // Pass negative value to ensure isNegative flag is set
    }
    
    // For debugging purposes, log the key financial values
    console.log(`Financial Summary: OP Income: ${data.operatingIncome}, Interest: ${data.interestExpense || 0}, Income Before Tax: ${data.incomeBeforeTax || 0}, Net Income: ${data.netIncome}`);
    
    // DEBUG: Force logging of all nodes to check if Net Loss is created
    console.log('DEBUG: Node Map Keys:', Object.keys(nodeMap));
    if (!isNetProfitable) {
      console.log('DEBUG: Company is not net profitable, should have Net Loss node');
      // Double check Net Loss node is created
      if (!nodeMap['Net Loss']) {
        console.log('DEBUG: Net Loss node missing, creating it now');
        addNode('Net Loss');
      }
    }
    
    // The Other Income flow is now handled in the standard accounting flow above
    // No need for additional non-operating adjustment calculations
    
    // Net Income/Loss handling is now done in the standard flow above
    // If this is a net loss, make sure we have a Net Loss node and remove Net Income
    if (!isNetProfitable) {
      // Create a dedicated Net Loss node if not already created
      addNode('Net Loss');
      
      // CRITICAL: Make sure there's a link from Income Before Taxes to Net Loss
      // This ensures the Net Loss node is always visible in the diagram
      if (data.netIncome < 0) {
        // Force a direct link from Income Before Taxes to Net Loss with the absolute value of Net Income
        const absNetLoss = Math.abs(data.netIncome);
        // Use a minimum value for the link to ensure it's visible
        const minimumVisibleValue = Math.max(absNetLoss, data.incomeBeforeTax * 0.05); // At least 5% of income before tax
        console.log(`DEBUG: Creating link to Net Loss with value ${absNetLoss}, minimum ${minimumVisibleValue}`);
        
        // Remove any existing links to ensure we don't have duplicates
        links = links.filter(l => !(l.source === 'Income Before Taxes' && l.target === 'Net Loss'));
        
        // Add our properly sized link
        links.push({
          source: 'Income Before Taxes',
          target: 'Net Loss',
          value: absNetLoss > 0 ? absNetLoss : minimumVisibleValue // Ensure positive value
        });
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
      // Use absolute value for sankey thickness
      value: Math.abs(l.value),
      // CRITICAL: Preserve the isNegative flag for negative flows
      isNegative: l.isNegative || false
    }));
    
    // Debug: Check which links have isNegative flag
    links.forEach(l => {
      if (l.isNegative) {
        console.log('[DEBUG] Preserved negative link after filtering:', 
          nodeNames[l.source], '→', nodeNames[l.target], 'isNegative:', l.isNegative);
      }
    });
    
    nodeMap = {};
    nodeNames.forEach((n, i) => { nodeMap[n] = i; });

    // Dynamic Sankey node sizing for adaptive zoom
    const dynamicNodeWidth = Math.max(30, chartWidth * 0.03);
    const dynamicNodePadding = Math.max(8, chartHeight * 0.02);
    
    // Create a D3 Sankey diagram with customized settings
    // First flag critical nodes that need special positioning treatment
    nodeNames.forEach(nodeName => {
      if (['Operating Loss', 'Income Before Taxes', 'Net Loss'].includes(nodeName)) {
        // Mark these nodes for special treatment in layout and path calculation
        if (!nodeMap[nodeName]) nodeMap[nodeName] = {};
        nodeMap[nodeName].forceTop = true;
        nodeMap[nodeName].minHeight = 20; // Ensure minimum visibility
        console.log(`DEBUG: Flagged critical node ${nodeName} for special treatment`);
      }
    });
    
    const sankey = d3.sankey()
      .nodeWidth(30) // px wide sankey boxes
      .nodePadding(dynamicNodePadding)
      .size([chartWidth, chartHeight])
      .nodeSort((a, b) => {
        // Custom vertical ordering with Operating Loss/Income at the very TOP
        // Check for flagged critical nodes first
        if (a.forceTop && !b.forceTop) return -1;
        if (!a.forceTop && b.forceTop) return 1;
        
        // If both or neither are critical, use standard ordering
        if (a.name === 'Operating Loss') return -1;
        if (b.name === 'Operating Loss') return 1;
        // Ensure Income Before Taxes is immediately below Operating Loss
        if (a.name === 'Income Before Taxes') return -1;
        if (b.name === 'Income Before Taxes') return 1;
        // Then other important nodes
        if (a.name === 'Operating Income') return -1;
        if (b.name === 'Operating Income') return 1;
        if (a.name === 'Net Income') return -1;
        if (b.name === 'Net Income') return 1;
        if (a.name === 'Net Loss') return -1;
        if (b.name === 'Net Loss') return 1;
        if (a.name === 'Gross Profit') return -1;
        if (b.name === 'Gross Profit') return 1;
        if (a.name === 'Cost of Revenue') return 1;
        if (b.name === 'Cost of Revenue') return -1;
        return d3.ascending(a.name, b.name);
    });

    const sankeyData = {
      nodes: nodeNames.map(name => ({
        name,
        // flag critical nodes for top placement
        forceTop: ['Operating Loss','Income Before Taxes'].includes(name)
      })),
      links
    };
    let {nodes, links: layoutLinks} = sankey({...sankeyData}); // Changed const to let

    // --- BEGIN CUSTOM DEPTH ADJUSTMENT FOR INTEREST EXPENSE & IBT ---
    const opIncNodeForDepth = nodes.find(n => n.name === 'Operating Income');
    const ibtNodeForDepth = nodes.find(n => n.name === 'Income Before Taxes');
    const intExpNodeForDepth = nodes.find(n => n.name === 'Interest Expense');

    if (opIncNodeForDepth && ibtNodeForDepth && intExpNodeForDepth) {
      console.log(`[Depth Adjust] Initial depths from first layout pass: OpInc (${opIncNodeForDepth.depth}), IBT (${ibtNodeForDepth.depth}), IntExp (${intExpNodeForDepth.depth})`);

      let interestExpenseTargetDepth = opIncNodeForDepth.depth + 1;
      // Only adjust if current depth is less than target, to avoid pulling nodes left or creating cycles if logic is flawed.
      if (intExpNodeForDepth.depth < interestExpenseTargetDepth) { 
        console.log(`[Depth Adjust] Adjusting Interest Expense depth from ${intExpNodeForDepth.depth} to ${interestExpenseTargetDepth}`);
        intExpNodeForDepth.depth = interestExpenseTargetDepth;
        updateDownstreamDepthsRecursive(intExpNodeForDepth, intExpNodeForDepth.depth, nodes); // 'nodes' is allGraphNodes
      }
      
      // IBT should be after Interest Expense
      let ibtTargetDepth = intExpNodeForDepth.depth + 1; 
      if (ibtNodeForDepth.depth < ibtTargetDepth) { // Only adjust if current depth is less
        console.log(`[Depth Adjust] Adjusting IBT depth from ${ibtNodeForDepth.depth} to ${ibtTargetDepth}`);
        ibtNodeForDepth.depth = ibtTargetDepth;
        updateDownstreamDepthsRecursive(ibtNodeForDepth, ibtNodeForDepth.depth, nodes); // 'nodes' is allGraphNodes
      }
      console.log(`[Depth Adjust] Custom depths set to (before re-layout): OpInc (${opIncNodeForDepth.depth}), IBT (${ibtNodeForDepth.depth}), IntExp (${intExpNodeForDepth.depth})`);

      // Prepare graph for re-calculation. 'nodes' contains modified depths and all other properties from the first layout.
      // 'sankeyData.links' (which is 'links' from the closure) holds the original link definitions.
      const graphForRecalculation = { nodes: nodes, links: sankeyData.links }; 
      console.log('[Depth Adjust] Re-running Sankey layout with custom depths using modified nodes and original link structures.');
      
      // Re-run the layout and reassign to 'nodes' and 'layoutLinks' for subsequent code.
      ({nodes, links: layoutLinks} = sankey(graphForRecalculation));
      
      // Log depths after re-layout to see if they were preserved or re-calculated from topology by sankey()
      const finalOpIncNode = nodes.find(n => n.name === 'Operating Income');
      const finalIbtNode = nodes.find(n => n.name === 'Income Before Taxes');
      const finalIntExpNode = nodes.find(n => n.name === 'Interest Expense');
      if (finalOpIncNode && finalIbtNode && finalIntExpNode) {
        console.log(`[Depth Adjust] Depths after re-layout: OpInc (${finalOpIncNode.depth}), IBT (${finalIbtNode.depth}), IntExp (${finalIntExpNode.depth})`);
      }
    }
    // --- END CUSTOM DEPTH ADJUSTMENT ---
    
    // CRITICAL: Map the isNegative property from original links to layoutLinks
    // The sankey layout creates new link objects, so we need to preserve our custom properties
    layoutLinks.forEach((layoutLink) => {
      // Find the corresponding original link by matching source and target indices
      const originalLink = links.find(l => 
        l.source === layoutLink.source.index && 
        l.target === layoutLink.target.index
      );
      
      if (originalLink && originalLink.isNegative) {
        layoutLink.isNegative = true;
        console.log('[DEBUG] Mapped isNegative to layoutLink:', 
          layoutLink.source.name, '→', layoutLink.target.name, 'isNegative:', layoutLink.isNegative);
      }
    });

    // Debug: Log all layoutLinks to check which should be negative
    console.log('[DEBUG] All layoutLinks after mapping:');
    layoutLinks.forEach(link => {
      console.log(`  ${link.source.name} → ${link.target.name}, isNegative: ${link.isNegative || false}`);
    });

    // Define segmentNodes based on layoutNodes and the input segments data
    // This is used to correctly identify nodes that are segments.
    const segmentNodes = segments && segments.length > 0
      ? nodes.filter(node => segments.some(s => s.segment === node.name))
      : [];
      
    // Align Cost of Revenue to Gross Profit column to shorten revenue→CoR path
    const costNode = nodes.find(n => n.name === 'Cost of Revenue');
    const grossNode = nodes.find(n => n.name === 'Gross Profit');
    if (costNode && grossNode) {
      costNode.x0 = grossNode.x0;
      costNode.x1 = grossNode.x1;
    }
    
    // Reposition cost nodes to align them properly and shorten their paths
    // First find all the nodes we need to reposition
    const cogsNode = nodes.find(n => n.name === 'COGS');
    const depreciationNode = nodes.find(n => (n.name === 'Depreciation' || n.name === 'Depreciation & Amortization'));
    const operatingExpensesNode = nodes.find(n => n.name === 'Operating Expenses');
    const sgaNode = nodes.find(n => n.name === 'SG&A Expenses' || n.name === 'SG&A');
    
    // Determine target position for cost nodes
    const targetX = operatingExpensesNode ? operatingExpensesNode.x0 : (grossNode ? grossNode.x0 + 200 : 0);
    console.log(`[NODE DEBUG] Target x-position for cost nodes: ${targetX}`);
    
    // Function to reposition a node and its connected links
    const repositionNode = (node, nodeName) => {
      if (!node) return;
      
      console.log(`[NODE DEBUG] Found ${nodeName} node to reposition`);
      
      // Store original position values before modification
      const originalX0 = node.x0;
      const originalX1 = node.x1;
      
      // Adjust node position to align with other cost nodes
      node.x0 = targetX;
      node.x1 = targetX + 30; // Node width
      
      console.log(`[NODE DEBUG] Repositioned ${nodeName} node: x0=${node.x0.toFixed(1)}, x1=${node.x1.toFixed(1)}`);
      
      // Now we need to adjust all links connected to this node to match its new position
      layoutLinks.forEach(link => {
        // Adjust any links where this node is the target
        if (link.target === node || (link.target.name === nodeName)) {
          // Properly modify the link to connect to the new position
          const linkObject = link.target === node ? link.target : link;
          linkObject.x0 = node.x0;
          linkObject.x1 = node.x1;
          // Update y-coordinates for link end
          link.y1 = node.y0 + (node.y1 - node.y0) / 2;
          console.log(`[NODE DEBUG] Adjusted incoming link to ${nodeName}: y1=${link.y1.toFixed(1)}`);
        }
        
        // Adjust any links where this node is the source
        if (link.source === node || (link.source.name === nodeName)) {
          // Properly modify the link to connect from the new position
          const linkObject = link.source === node ? link.source : link;
          linkObject.x0 = node.x0;
          linkObject.x1 = node.x1;
          // Update y-coordinates for link start
          link.y0 = node.y0 + (node.y1 - node.y0) / 2;
          console.log(`[NODE DEBUG] Adjusted outgoing link from ${nodeName}: y0=${link.y0.toFixed(1)}`);
        }
      });
    };
    
    // Apply special positioning to SG&A, Depreciation and COGS nodes
    // First find Income Before Taxes to use as reference for horizontal alignment
    const ibtNode = nodes.find(n => n.name === 'Income Before Taxes');
    
    // For Depreciation and COGS, we'll stack them vertically at the bottom
    const costNodes = [];
    if (depreciationNode) costNodes.push({ node: depreciationNode, name: 'Depreciation', priority: 1 });
    if (cogsNode) costNodes.push({ node: cogsNode, name: 'COGS', priority: 2 });
    
    // Determine proper vertical spacing for the bottom cost nodes
    const VERTICAL_GAP = 25; // Gap between cost nodes
    let lastBottom = operatingExpensesNode ? operatingExpensesNode.y1 + 50 : 300; // Push these lower
    
    // Sort cost nodes by priority (order they should appear vertically, top to bottom)
    costNodes.sort((a, b) => a.priority - b.priority);
    
    // Adjust y-positions to stack nodes vertically with proper spacing
    costNodes.forEach(({ node, name }, index) => {
      // Store original height to maintain visual size
      const originalHeight = node.y1 - node.y0;
      
      // Position the node below the previous node with gap
      node.y0 = lastBottom + VERTICAL_GAP;
      node.y1 = node.y0 + originalHeight;
      
      // Immediately update any connected links' vertical positions
      layoutLinks.forEach(link => {
        // Update source endpoint if this is the source
        if (link.source === node || (link.source.name === name)) {
          link.y0 = node.y0 + (node.y1 - node.y0) / 2;
          console.log(`[VERTICAL DEBUG] Updated source link for ${name}: y0=${link.y0.toFixed(1)}`);
        }
        
        // Update target endpoint if this is the target
        if (link.target === node || (link.target.name === name)) {
          link.y1 = node.y0 + (node.y1 - node.y0) / 2;
          console.log(`[VERTICAL DEBUG] Updated target link for ${name}: y1=${link.y1.toFixed(1)}`);
        }
      });
      
      // Update lastBottom for next node
      lastBottom = node.y1;
      
      console.log(`[VERTICAL DEBUG] Positioned ${name} vertically: y0=${node.y0.toFixed(1)}, y1=${node.y1.toFixed(1)}`);
    });
    
    // First handle special positioning for SG&A node to align with Income Before Taxes
    if (sgaNode && ibtNode) {
      console.log(`[SG&A DEBUG] Repositioning SG&A to align horizontally with IBT`);
      
      // Store original height to maintain visual size
      const originalHeight = sgaNode.y1 - sgaNode.y0;
      
      // Set SG&A's horizontal position to match Income Before Taxes
      sgaNode.x0 = ibtNode.x0;
      sgaNode.x1 = ibtNode.x1;
      
      // Position it vertically at the same level as Operating Expenses but to the right
      sgaNode.y0 = operatingExpensesNode ? operatingExpensesNode.y0 : 200;
      sgaNode.y1 = sgaNode.y0 + originalHeight;
      
      console.log(`[SG&A DEBUG] Repositioned SG&A node to align with IBT: x0=${sgaNode.x0.toFixed(1)}, y0=${sgaNode.y0.toFixed(1)}`);
      
      // Update all links connected to SG&A to maintain proper connections
      layoutLinks.forEach(link => {
        // Update source endpoint if SG&A is the source
        if (link.source === sgaNode || (link.source.name === 'SG&A' || link.source.name === 'SG&A Expenses')) {
          link.y0 = sgaNode.y0 + (sgaNode.y1 - sgaNode.y0) / 2;
          console.log(`[SG&A DEBUG] Updated source link: y0=${link.y0.toFixed(1)}`);
        }
        
        // Update target endpoint if SG&A is the target
        if (link.target === sgaNode || (link.target.name === 'SG&A' || link.target.name === 'SG&A Expenses')) {
          link.y1 = sgaNode.y0 + (sgaNode.y1 - sgaNode.y0) / 2;
          console.log(`[SG&A DEBUG] Updated target link: y1=${link.y1.toFixed(1)}`);
        }
      });
    }
    
    // Now apply horizontal repositioning to the remaining cost nodes
    costNodes.forEach(({ node, name }) => {
      repositionNode(node, name);
    });
    
    // OVERRIDE the original renderer's text placement for SG&A
    // Define a custom renderer that will inject directly into SVG creation process
    const originalCreateTextNodes = window.renderD3Sankey.createTextNodes;
    if (originalCreateTextNodes) {
      console.log('[OVERRIDE] Found original text node creator, will override for SG&A');
    }
    
    // AGGRESSIVE intervention: Force the SG&A label position to be below the rect
    // Add a comprehensive style tag for CSS-based positioning
    const styleTag = document.createElement('style');
    styleTag.id = 'sankey-label-fix';
    styleTag.textContent = `
      /* Universal selector for SG&A text positioning */
      text:contains('SG&A') {
        transform: translateY(30px) !important;
      }
      
      /* Value text that follows SG&A label */
      text:contains('SG&A') ~ text:contains('$'), text:contains('SG&A Expenses') ~ text:contains('$') {
        transform: translateY(30px) !important;
      }
      
      /* More aggressive targeting using custom attributes we'll add */
      text[data-node-type="sga-label"] {
        transform: translateY(30px) !important;
        y: attr(data-bottom-position) !important;
      }
      
      text[data-node-type="sga-value"] {
        transform: translateY(45px) !important;
        y: attr(data-bottom-position) !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    // Register a function to run after SVG rendering that uses a MutationObserver
    // to ensure our changes persist even if the chart is re-rendered
    const originalSankeyRenderComplete = window.sankeyRenderComplete;
    window.sankeyRenderComplete = function() {
      // First call the original function
      if (originalSankeyRenderComplete) originalSankeyRenderComplete();
      
      console.log('[URGENT] Forcefully repositioning SG&A labels');
      
      // DIRECT rewrite approach - create new elements and replace the old ones
      const fixSGALabels = () => {
        // Find the SG&A rect - need to be more flexible in our selector
        // SG&A rect could be at different x positions in different charts
        // Look for any rect that has an SG&A text label near it
        const allRects = document.querySelectorAll('rect');
        const allTexts = document.querySelectorAll('text');
        let sgaRect = null;
        let sgaLabel = null;
        let sgaValue = null;
        
        // First find the SG&A label
        allTexts.forEach(text => {
          const content = text.textContent || '';
          if ((content.includes('SG&A') || content.includes('SG&A Expenses')) && !content.includes('$')) {
            sgaLabel = text;
            console.log('[FORCE] Found SG&A label:', content);
          }
          
          // Also look for the value text that might accompany SG&A
          if (content.includes('$') && sgaLabel && !sgaValue) {
            // This could be the value text for SG&A if it's close to the label
            const labelRect = sgaLabel.getBoundingClientRect();
            const valueRect = text.getBoundingClientRect();
            const distance = Math.sqrt(
              Math.pow(labelRect.left - valueRect.left, 2) + 
              Math.pow(labelRect.top - valueRect.top, 2)
            );
            
            // If this text is close to the SG&A label, it's likely the value
            if (distance < 100) {
              sgaValue = text;
              console.log('[FORCE] Found SG&A value:', content);
            }
          }
        });
        
        // If we found the SG&A label, now find its associated rect
        if (sgaLabel) {
          const labelRect = sgaLabel.getBoundingClientRect();
          
          // Find the rect that's closest to the SG&A label
          let closestRect = null;
          let closestDistance = Infinity;
          
          allRects.forEach(rect => {
            const rectBox = rect.getBoundingClientRect();
            const distance = Math.sqrt(
              Math.pow(labelRect.left - rectBox.left, 2) + 
              Math.pow(labelRect.top - rectBox.top, 2)
            );
            
            // Update closest rect if this one is closer
            if (distance < closestDistance) {
              closestDistance = distance;
              closestRect = rect;
            }
          });
          
          // If we found a rect close to the SG&A label, it's likely the SG&A rect
          if (closestRect && closestDistance < 150) {
            sgaRect = closestRect;
            console.log('[FORCE] Found SG&A rect:', sgaRect);
          }
        }
        
        // If we couldn't find all necessary elements, try again later
        if (!sgaRect || !sgaLabel) {
          console.log('[SG&A DEBUG] Could not find all SG&A elements, will retry');
          return false;
        }
        
        // Get rect dimensions
        const rectY = parseFloat(sgaRect.getAttribute('y'));
        const rectHeight = parseFloat(sgaRect.getAttribute('height'));
        const rectBottom = rectY + rectHeight;
        
        // Create a completely new text element to replace the SG&A label
        const newLabel = sgaLabel.cloneNode(true);
        newLabel.setAttribute('y', rectBottom + 20);
        newLabel.setAttribute('alignment-baseline', 'hanging');
        newLabel.removeAttribute('transform'); // Remove any transform that might interfere
        newLabel.style.fill = sgaLabel.style.fill;
        
        // Add data attributes for CSS targeting
        newLabel.setAttribute('data-node-type', 'sga-label');
        newLabel.setAttribute('data-bottom-position', rectBottom + 20);
        
        // Set inline styles aggressively
        newLabel.style.position = 'absolute';
        newLabel.style.top = (rectBottom + 20) + 'px';
        newLabel.style.transform = 'translateY(30px)';
        
        // Replace the old label
        sgaLabel.parentNode.replaceChild(newLabel, sgaLabel);
        console.log(`[FORCE] Replaced SG&A label with new position: y=${rectBottom + 20}`);
        
        // If we found the value text, also reposition it
        if (sgaValue) {
          const newValue = sgaValue.cloneNode(true);
          newValue.setAttribute('y', rectBottom + 45);
          newValue.setAttribute('alignment-baseline', 'hanging');
          newValue.removeAttribute('transform'); // Remove any transform that might interfere
          newValue.style.fill = sgaValue.style.fill;
          
          // Add data attributes for CSS targeting
          newValue.setAttribute('data-node-type', 'sga-value');
          newValue.setAttribute('data-bottom-position', rectBottom + 45);
          
          // Set inline styles aggressively
          newValue.style.position = 'absolute';
          newValue.style.top = (rectBottom + 45) + 'px';
          newValue.style.transform = 'translateY(45px)';
          
          // Replace the old value
          sgaValue.parentNode.replaceChild(newValue, sgaValue);
          console.log(`[FORCE] Replaced SG&A value with new position: y=${rectBottom + 45}`);
          
          return true;
        }
        
        return true; // We at least fixed the label
      };
      
      // Try immediately
      let success = fixSGALabels();
      
      // If not successful, retry a few times with increasing delays
      if (!success) {
        setTimeout(() => {
          success = fixSGALabels();
          if (!success) {
            setTimeout(fixSGALabels, 500);
          }
        }, 200);
      }
      
      // Set up a MutationObserver to watch for changes and reapply our fixes
      const svgContainer = document.querySelector('#d3-chart');
      if (svgContainer) {
        const observer = new MutationObserver((mutations) => {
          // Check if our SG&A label position needs fixing again
          setTimeout(fixSGALabels, 100);
        });
        
        // Observe changes to the SVG container
        observer.observe(svgContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['y', 'transform']
        });
      }
    };
        
    // Add a second function to the sankeyRenderComplete function to handle other nodes
    const originalSankeyRenderCompleteFinal = window.sankeyRenderComplete;
    window.sankeyRenderComplete = function() {
      // First call our previous implementation that fixes SG&A
      if (originalSankeyRenderCompleteFinal) originalSankeyRenderCompleteFinal();
      
      console.log('[DEBUG] Running final handler for other nodes');
      setTimeout(() => {
        // Handle COGS and Depreciation nodes
        const nodesToFix = ['COGS', 'Depreciation', 'Depreciation & Amortization'];
        const allTexts = document.querySelectorAll('text');
        
        allTexts.forEach(text => {
          const content = text.textContent || '';
          // Check if this text is related to our nodes of interest
          const matchesNode = nodesToFix.some(nodeName => content.includes(nodeName));
          
          if (matchesNode) {
            // For COGS node
            if (content.includes('COGS')) {
              const cogsRect = document.querySelector('rect[x="402"]');
              if (cogsRect) {
                const newX = parseFloat(cogsRect.getAttribute('x')) + 15; // center of rect
                text.setAttribute('x', newX);
                console.log(`[COGS DEBUG] Updated COGS text position: x=${newX}`);
              }
            }
            
            // For Depreciation node
            if (content.includes('Depreciation')) {
              const depRect = document.querySelector('rect[x="402"][y="450"]');
              if (depRect) {
                const newX = parseFloat(depRect.getAttribute('x')) + 15; // center of rect
                text.setAttribute('x', newX);
                console.log(`[DEP DEBUG] Updated Depreciation text position: x=${newX}`);
              }
            }
          }
        });
      }, 300); // Extra delay to ensure all previous handlers have completed
    };
    
    // Force a direct CSS fix for SG&A text
    // This runs immediately without waiting for rendering
    setTimeout(() => {
      console.log('[DIRECT CSS] Adding SG&A text fix to document head');
      const style = document.createElement('style');
      style.textContent = `
        /* Direct CSS fix for SG&A text */
        text:contains('SG&A') {
          transform: translateY(160px) !important;
        }
      `;
      document.head.appendChild(style);
    }, 100);

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
        console.log(`[NODE DEBUG] Shifted ${curr.name} down by ${shift}px for spacing`);
        
        // Update connected links
        layoutLinks.forEach(link => {
          if (link.source === curr) {
            link.y0 = curr.y0 + (curr.y1 - curr.y0) / 2;
          }
          if (link.target === curr) {
            link.y1 = curr.y0 + (curr.y1 - curr.y0) / 2;
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
  const rightNodes = sankeyData.nodes.filter(n => n.x0 === rightmostX).sort((a, b) => a.y0 - b.y0);
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
    
    // Special sorting for Gross Profit node to ensure Operating Loss path is on top
    if (node.name === 'Gross Profit') {
      // Custom sort that puts Operating Loss path first (at the top)
      outgoing.sort((a, b) => {
        // Operating Loss path comes first (negative = first)
        if (a.target.name === 'Operating Loss') return -1;
        if (b.target.name === 'Operating Loss') return 1;
        // Other paths sorted by target y-position
        return (a.target.y0 || 0) - (b.target.y0 || 0);
      });
      console.log('[Path DEBUG] Sorted Gross Profit outgoing paths to prioritize Operating Loss');
    } else {
      // Normal sorting for other nodes
      outgoing.sort((a, b) => (a.target.y0 || 0) - (b.target.y0 || 0));
    }
    
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
      // CRITICAL: Treat Operating Loss like Operating Income for positioning
      if (node.name === 'Operating Loss') return true;
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
      // Skip grouping for critical columns (OL and IBT)
      const _olNode = nodes.find(n => n.name === 'Operating Loss');
      const _ibtNode = nodes.find(n => n.name === 'Income Before Taxes');
      const _skipCols = [];
      if (_olNode) _skipCols.push(_olNode.x0);
      if (_ibtNode) _skipCols.push(_ibtNode.x0);
      if (_skipCols.includes(colNodes[0].x0)) return;
      // Column-specific override: add spacing for Operating Expenses column
      const opExpNode = nodes.find(n => n.name === 'Operating Expenses');
      if (opExpNode && Math.abs(colNodes[0].x0 - opExpNode.x0) < 1e-6) {
        const detailLabels = corDetailNames.map(c => c.label);
        colNodes.sort((a, b) => {
           const getPri = name =>
             name === 'Operating Loss' ? 0 :
             name === 'Income Before Taxes' ? 1 :
             name === 'Operating Income' ? 2 :
             name === 'Net Income' ? 3 :
             name === 'Net Loss' ? 4 :
             name === 'Operating Expenses' ? 5 :
             detailLabels.includes(name) ? 6 :
             7;
          const ap = getPri(a.name), bp = getPri(b.name);
          return ap - bp || a.y0 - b.y0;
        });
        const gapIncomeToOpExp = 10; // px cushion between Operating Income and Operating Expenses
        const gapOpExpToDetails = 60; // px cushion between Operating Expenses and cost details
        let y = colNodes[0].y0;
        if (colNodes[0] && (colNodes[0].name === 'Operating Loss' || colNodes[0].name === 'Income Before Taxes')) {
          colNodes[0].y0 = colNodes[0].name === 'Operating Loss' ? 0 : -20;
          colNodes[0].y1 = colNodes[0].y0 + (colNodes[0].y1 - colNodes[0].y0);
          y = colNodes[0].y1;
        }
        colNodes.forEach((node, i) => {
          if (i === 1) y += gapIncomeToOpExp;
          if (i === 2) y += gapOpExpToDetails;
          if (i >= 3) y += 10; // px cushion between cost detail nodes
          const h = node.y1 - node.y0;
          node.y0 = y;
          node.y1 = y + h;
          y += h;
        });
        return; // skip default grouping for this column
      }
      // Sort: profit nodes first, then others, then expense nodes
       colNodes.sort((a, b) => {
         // Name-based priority: OL first, then IBT, then OP Inc
         const namePri = name =>
           name === 'Operating Loss' ? 0 :
           name === 'Income Before Taxes' ? 1 :
           name === 'Operating Income' ? 2 :
           name === 'Net Income' ? 3 :
           name === 'Net Loss' ? 4 :
           isProfitNode({name}) ? 5 :
           isExpenseNode({name}) ? 7 :
           6;
         const ap = namePri(a.name), bp = namePri(b.name);
         if (ap !== bp) return ap - bp;
         // fallback to original logic
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
        // Add universal spacing between all nodes
        if (i < colNodes.length - 1) { // Don't add spacing after the last node
          y += 20;
        }
      }
    });


    // Create true UPWARD wave pattern for financial statement nodes
    console.log('[Wave DEBUG] --- Starting TRUE upward wave positioning ---');
    
    // Identify key nodes for the upward wave pattern
    const opLoss = nodes.find(n => n.name === 'Operating Loss');
    const ibt = nodes.find(n => n.name === 'Income Before Taxes');
    const netLoss = nodes.find(n => n.name === 'Net Loss');
    
    if (opLoss && ibt) {
      console.log('[Wave DEBUG] Found essential nodes for upward wave');
      
      // Store original heights to maintain their visual size
      const heightOL = opLoss.y1 - opLoss.y0;
      const heightIBT = ibt.y1 - ibt.y0;
      
      // Position Operating Loss at a moderate height
      const topPosition = 0; // Starting position for Operating Loss
      opLoss.y0 = topPosition;
      opLoss.y1 = opLoss.y0 + heightOL;
      console.log(`[Wave DEBUG] Operating Loss positioned at top: y0=${opLoss.y0.toFixed(1)}, y1=${opLoss.y1.toFixed(1)}`);
      
      // Position Income Before Taxes HIGHER than Operating Loss for upward wave
      ibt.y0 = opLoss.y0 - 20; // 20px higher than Operating Loss
      ibt.y1 = ibt.y0 + heightIBT;
      console.log(`[Wave DEBUG] IBT positioned higher than Operating Loss: y0=${ibt.y0.toFixed(1)}, y1=${ibt.y1.toFixed(1)}`);
      
      // Position Net Loss even higher if it exists
      if (netLoss) {
        const heightNL = netLoss.y1 - netLoss.y0;
        netLoss.y0 = ibt.y0 - 20; // 20px higher than IBT
        netLoss.y1 = netLoss.y0 + heightNL;
        console.log(`[Wave DEBUG] Net Loss positioned highest: y0=${netLoss.y0.toFixed(1)}, y1=${netLoss.y1.toFixed(1)}`);
      }
      
      // Force all y-coordinates to be at least 0 to stay in view
      if (ibt.y0 < 0) {
        const shift = Math.abs(ibt.y0) + 5; // Add 5px padding
        console.log(`[Wave DEBUG] Shifting all nodes down by ${shift}px to ensure visibility`);
        
        // Shift everything down by the negative amount
        opLoss.y0 += shift;
        opLoss.y1 += shift;
        ibt.y0 += shift;
        ibt.y1 += shift;
        if (netLoss) {
          netLoss.y0 += shift;
          netLoss.y1 += shift;
        }
      }
      
      // Modify links connected to the wave nodes to ensure proper visual flow
      // First, find the Gross Profit node to get its dimensions
      const gpNode = nodes.find(n => n.name === 'Gross Profit');
      
      layoutLinks.forEach(link => {
        // Special handling for Gross Profit to Operating Loss path
        // Make this path come from the TOP of Gross Profit
        if (link.source === gpNode && link.target === opLoss) {
          // Force path to start at top of Gross Profit rect (not middle)
          link.y0 = gpNode.y0 + 10; // Fixed position near top of Gross Profit
          console.log(`[Wave DEBUG] Modified GP→OL path to start at top: y0=${link.y0.toFixed(1)}`);
          
          // Mark this as a critical path for special styling
          link.critical = true;
        }
        
        // Normal midpoint updates for Operating Loss
        if (link.source === opLoss || link.source.name === 'Operating Loss') {
          link.y0 = opLoss.y0 + (opLoss.y1 - opLoss.y0) / 2;
          console.log(`[Wave DEBUG] Updated source link for Operating Loss: y0=${link.y0.toFixed(1)}`);
        }
        
        if (link.target === opLoss || link.target.name === 'Operating Loss') {
          // This is the path coming from Gross Profit - make it arrive at top of Operating Loss
          if (link.source === gpNode) {
            link.y1 = opLoss.y0 + 10; // Fixed position near top of Operating Loss
            console.log(`[Wave DEBUG] Modified GP→OL path to arrive at top: y1=${link.y1.toFixed(1)}`);
          } else {
            link.y1 = opLoss.y0 + (opLoss.y1 - opLoss.y0) / 2;
          }
        }
        
        // Update Income Before Taxes links
        if (link.source === ibt || link.source.name === 'Income Before Taxes') {
          link.y0 = ibt.y0 + (ibt.y1 - ibt.y0) / 2;
          console.log(`[Wave DEBUG] Updated source link for IBT: y0=${link.y0.toFixed(1)}`);
        }
        
        if (link.target === ibt || link.target.name === 'Income Before Taxes') {
          link.y1 = ibt.y0 + (ibt.y1 - ibt.y0) / 2;
          console.log(`[Wave DEBUG] Updated target link for IBT: y1=${link.y1.toFixed(1)}`);
        }
        
        // Update Net Loss links if it exists
        if (netLoss) {
          if (link.source === netLoss || link.source.name === 'Net Loss') {
            link.y0 = netLoss.y0 + (netLoss.y1 - netLoss.y0) / 2;
          }
          if (link.target === netLoss || link.target.name === 'Net Loss') {
            link.y1 = netLoss.y0 + (netLoss.y1 - netLoss.y0) / 2;
          }
        }
      });
      
      // Link slots will be reassigned globally after all node movements are complete.
      console.log('[Wave DEBUG] Node positions adjusted for upward wave; link slots will be updated later.');
    } else {
      console.log('[Wave DEBUG] Not enough nodes for upward wave effect');
    }
    
    console.log('[Wave DEBUG] --- Wave positioning complete ---');
    
    // Ensure minimum spacing after Operating Loss and other wave nodes
    const MIN_SPACING_FROM_WAVE = 40; // Minimum space between wave nodes and expense nodes
    
    // Find the lowest wave node
    let lowestWaveY = 0;
    if (opLoss) lowestWaveY = Math.max(lowestWaveY, opLoss.y1);
    if (ibt) lowestWaveY = Math.max(lowestWaveY, ibt.y1);
    if (netLoss) lowestWaveY = Math.max(lowestWaveY, netLoss.y1);
    
    // Adjust all expense nodes below the wave if they're too close
    nodes.forEach(node => {
      if (isExpenseNode(node) && node.y0 < lowestWaveY + MIN_SPACING_FROM_WAVE) {
        const shift = (lowestWaveY + MIN_SPACING_FROM_WAVE) - node.y0;
        node.y0 += shift;
        node.y1 += shift;
        console.log(`[Wave DEBUG] Shifted ${node.name} down by ${shift}px for spacing`);
        
        // Link properties will be fully updated by the global assignLinkSlots call later.
      }
    });
    
    // Finalize link y-coordinates and widths after all node movements and adjustments
    assignLinkSlots(nodes, layoutLinks);

    // Sort links to ensure Operating Loss path appears on top
    // Sort links to ensure specific paths appear on top by rendering them later
    console.log('[Links DEBUG] Sorting links to prioritize Operating Loss path');
    layoutLinks.sort((a, b) => {
      const getPriority = (link) => {
        // Higher number means rendered later (more on top)
        if (link.source.name === 'Gross Profit' && link.target.name === 'Operating Loss') return 4; // GP -> OL is top-most
        if (link.source.name === 'Operating Loss') return 3; // Then other links FROM OL
        if (link.target.name === 'Operating Loss') return 2; // Then other links TO OL
        return 1; // All other links
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      // Sort by priority: higher priority value means it comes later in the sorted array.
      // If priorityA > priorityB, priorityA - priorityB is positive, so 'a' comes after 'b'.
      return priorityA - priorityB;
    });
    console.log('[Links DEBUG] Link sorting complete - Operating Loss path should appear on top');
    
    // Create a direct manipulation for link z-index by targeting specific paths
    console.log('[DOM DEBUG] Adding SVG rendering function to lift important paths to top');
    
    // We need to insert this CSS for SVG stacking context
    // This is the most reliable way to control z-index in SVG
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Critical path styling */
      path.sankey-link[data-path-type="critical"] {
        fill: #daa520 !important; /* Gold color for critical paths */
        stroke: #fff !important;
        stroke-opacity: 0.5 !important;
        stroke-width: 0.5px !important;
        fill-opacity: 0.7 !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    // This function tags critical paths with special attributes and moves them to the end of the DOM
    window.sankeyRenderComplete = function() {
      // First call the original function
      if (originalSankeyRenderComplete) originalSankeyRenderComplete();
      
      console.log('[DOM DEBUG] Tagging and lifting critical paths');
      
      // Find and tag all critical paths
      const allPaths = document.querySelectorAll('path.sankey-link');
      console.log(`[DOM DEBUG] Processing ${allPaths.length} sankey paths...`);
      
      // Find all paths to Operating Loss and mark them
      allPaths.forEach(path => {
        // Tag Operating Loss-related paths (from Gross Profit)
        if ((path.parentNode && path.parentNode.__data__ && 
            path.parentNode.__data__.source && path.parentNode.__data__.target) &&
            ((path.parentNode.__data__.source.name === 'Gross Profit' && 
              path.parentNode.__data__.target.name === 'Operating Loss') ||
             (path.parentNode.__data__.source.name === 'Operating Loss' && 
              path.parentNode.__data__.target.name === 'Income Before Taxes'))) {
          
          // Tag with data attribute so we can easily identify it
          path.setAttribute('data-path-type', 'critical');
          // Force move to end of parent to be on top
          const parent = path.parentNode;
          parent.removeChild(path);
          parent.appendChild(path);
          console.log('[DOM DEBUG] Tagged and lifted critical path', 
                     path.parentNode.__data__.source.name, '→', 
                     path.parentNode.__data__.target.name);
        }
      });
    };
    
    // Add script to call our function after page load
    const script = document.createElement('script');
    script.textContent = `
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
          if (window.sankeyRenderComplete) window.sankeyRenderComplete();
        }, 500);
      });
    `;
    document.head.appendChild(script);
    // end wave

    // Color logic - accounts for profitability status
    function nodeColor(name) {
      // Special handling for Operating Loss - use cross-hatch pattern
      if (name === 'Operating Loss') {
        console.log('[DEBUG] Applying cross-hatch pattern to Operating Loss node');
        return 'url(#negative-flow-pattern)';
      }
      
      // Income Before Taxes - use cross-hatch when negative
      if (name === 'Income Before Taxes' && data.incomeBeforeTax < 0) {
        console.log('[DEBUG] Applying cross-hatch pattern to negative Income Before Taxes node');
        return 'url(#negative-flow-pattern)';
      }
      
      // Net Loss - use cross-hatch pattern
      if (name === 'Net Loss') {
        console.log('[DEBUG] Applying cross-hatch pattern to Net Loss node');
        return 'url(#negative-flow-pattern)';
      }
      
      // Gross Profit is always green
      if (name === 'Gross Profit') {
        return '#3cb371'; // Always green
      }
      
      // Income nodes are green (except Gross Profit handled above)
      if (name === 'Operating Income' || 
          name === 'Income Before Taxes' ||
          name === 'Net Income' ||
          name === 'Other Income' ||
          name === 'Additional Income') {
        return isProfitable ? '#3cb371' : '#daa520'; // green for profit, gold for loss
      }
      
      // Expense nodes are red
      if (name === 'Operating Expenses' || 
          name === 'Cost of Revenue' || 
          name === 'Income Tax Expense' || 
          name === 'Interest Expense' ||
          name === 'Other Expense') {
        return '#c0392b'; // Red for expenses
      }
      
      // Adjust for unprofitable companies - make income/profit nodes red instead of green
      if (name === 'Operating Income' && !isProfitable) return '#c0392b'; // dark red for negative operating income
      if (name === 'Net Income' && !isNetProfitable) return '#c0392b'; // dark red for negative net income
      
      // Normal profitable nodes are green
      if (name === 'Operating Income' || name === 'Net Income') return '#3cb371'; // green
      
      // Cost of Revenue detail nodes
      if (['COGS','Depreciation & Amortization','Other Cost of Revenue'].includes(name)) return '#c0392b';
      if (name === 'Cost of Revenue' || name === 'Operating Expenses' || name.includes('Expense')) return '#c0392b'; // red
      return '#bbb';
    }
    function linkColor(d) {
      // Negative flows (like Operating Loss) should be red
      if (d.isNegative) {
        console.log('[DEBUG] Negative flow detected:', d.source.name, '→', d.target.name);
        return 'url(#negative-flow-pattern)';
      }
      
      // Cost of Revenue paths are red
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
      const cx = isSeg ? d.x0 - 35 : d.x0 + (d.x1 - d.x0) / 2; // Increased from -20 to -35 for more spacing
      const anchor = isSeg ? 'end' : 'middle';
      
      // Debug logging to verify segment detection
      if (isSeg) {
        console.log(`[Segment Label] ${d.name}: x0=${d.x0}, cx=${cx} (offset -35)`);
      }
      
      const marginText = getMargin(d.name, data);
      const belowBar = (d.name === 'Cost of Revenue' || d.name === 'Operating Expenses' || d.name === 'SG&A Expenses');
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
            yBase = d.y1 + minOffset + labelHeight / 2 - 8; // Move up by 12px total (was +4, now -8)
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
        const isCostDetailNode = ['COGS','Depreciation & Amortization','Other Cost of Revenue'].includes(d.name);
        const rightEdge = isCostDetailNode || d.x1 > chartWidth - 40;
        let labelX = cx;
        let labelAnchor = anchor;
        if (rightEdge) {
          labelX = d.x1 + 8;
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
          const nodeSpecificLabelGroup = labelGroup.append('g')
            .attr('id', `label-group-right-${d.id || d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`)
            .attr('data-label-set-id', `labelset-right-${d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`);
          const displayName = d.name.replace(/\s*expenses?$/i, '');
          const midY = (d.y0 + d.y1) / 2;
          const rectHeight = d.y1 - d.y0;
          // Ensure negative values are displayed with appropriate styling
          // Directly check the global profit status rather than just the local value
          let isNegative = false;
          let forceAmount = null;
          
          // Force loss labels based on the company's overall profitability status
          if (displayName === 'Operating Income' || displayName.includes('Operating')) {
              isNegative = !isProfitable;
              forceAmount = Math.abs(data.operatingIncome);
          }
          if (displayName === 'Operating Loss') {
              // For Operating Loss nodes, always get the right amount
              forceAmount = Math.abs(data.operatingIncome);
              d.value = forceAmount; // Set the actual value for use in the value label
              isNegative = true; // Operating Loss is always negative
              d.isNegative = true; // Store on node data for later use
              console.log('[DEBUG] Operating Loss detected, setting isNegative=true, value=', forceAmount);
          }
          if (displayName === 'Net Income' || displayName.includes('Net')) {
              isNegative = !isNetProfitable;
              forceAmount = Math.abs(data.netIncome);
          }
          if (displayName === 'Net Loss') {
              // For Net Loss nodes, always get the right amount
              isNegative = true; // Net Loss is always negative by definition
              forceAmount = Math.abs(data.netIncome);
              d.value = forceAmount; // Set the actual value for use in the value label
          }
          if (displayName === 'Gross Profit' || displayName.includes('Gross')) {
              isNegative = !isGrossProfitable;
              forceAmount = Math.abs(data.grossProfit);
          }
          if (displayName === 'Gross Loss') {
              // For Gross Loss nodes, always get the right amount
              forceAmount = Math.abs(data.grossProfit);
              d.value = forceAmount; // Set the actual value for use in the value label
          }
          if (displayName === 'Income Before Taxes') {
              // Income Before Taxes is negative when operating income is negative
              if (data.operatingIncome < 0) {
                  isNegative = true;
                  d.isNegative = true;
                  forceAmount = Math.abs(data.incomeBeforeTax);
                  console.log('[DEBUG] Income Before Taxes marked as negative, value=', forceAmount);
              }
          }
          
          // For negative values, display only the label with loss amount already included
          const displayLabel = isNegative && forceAmount ? formatNodeLabel(displayName, forceAmount) : displayName;
          // Value for display  
          const dollarValue = d.value; // Use the node's value directly
          // --- Smart single-line if rect is small ---
          const SMALL_RECT_HEIGHT = 10; // px, threshold for single-line label
          if (rectHeight < SMALL_RECT_HEIGHT) {
            // Render as one line: "$1.60B - Income Tax"
            // Render as one line, but split into tspans for color
            const textEl = nodeSpecificLabelGroup.append('text')
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
          nodeSpecificLabelGroup.append('text')
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
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))')
            .attr('data-label-set-id', `labelset-right-${d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`);
          // Then add the dollar amount below
          nodeSpecificLabelGroup.append('text')
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
            isNegative = true; // Operating Loss is always negative
            d.isNegative = true; // Store on node data for later use
            console.log('[DEBUG] Operating Loss detected, setting isNegative=true, value=', forceAmount);
        }
        if (d.name === 'Net Income' || d.name.includes('Net Income')) {
            isNegative = !isNetProfitable;
            forceAmount = Math.abs(data.netIncome);
        }
        if (d.name === 'Net Loss') {
            // For Net Loss nodes, always get the right amount
            isNegative = true; // Net Loss is always negative by definition
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
        if (d.name === 'Income Before Taxes') {
            // Income Before Taxes is negative when operating income is negative
            if (data.operatingIncome < 0) {
                isNegative = true;
                d.isNegative = true;
                forceAmount = Math.abs(data.incomeBeforeTax);
                console.log('[DEBUG] Income Before Taxes marked as negative, value=', forceAmount);
            }
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
          .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))')
          .attr('data-label-set-id', `labelset-general-${d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`); 
        if (typeof d.value === 'number' && !isNaN(d.value)) {
          // Consistent negative value styling for dollar amounts
          const isNegative = d.isNegative || d.value < 0; // Check node's stored flag first
          
          // Always show the dollar amount for all nodes, including Loss nodes
          {
            labelGroup.append('text')
              .attr('class', 'nodelabel-value')
              .attr('x', labelX)
              .attr('y', yBase + VALUE_OFFSET + rightEdgeYOffset + topEdgeYOffset)
              .attr('text-anchor', labelAnchor)
              .attr('alignment-baseline', 'hanging')
              .text(formatDollars(isNegative ? -d.value : d.value))
              .style('font-size', '15px')
              .style('font-weight', 'bold')
              .style('fill', isNegative ? '#e74c3c' : nodeSolidColor(d.name)) // Bright red for negative
              .style('paint-order', 'stroke')
              .style('stroke', 'white')
              .style('stroke-width', 5)
              .style('stroke-linejoin', 'round')
              .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))')
          .attr('data-label-set-id', `labelset-general-${d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`);
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
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))')
          .attr('data-label-set-id', `labelset-general-${d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`);
        }
      } else {
        // Universal three-line label logic for left-edge (segment) nodes
        const rectHeight = d.y1 - d.y0;
        const THREE_LINE_THRESHOLD = 34; // px, threshold for three-line label
        const TWO_LINE_THRESHOLD = 18; // px, threshold for two-line label
        const labelFontSize = 13;
        const valueFontSize = 12;
        const centerY = (d.y0 + d.y1) / 2;
        const leftLabelTextOffset = 15; // Offset for labels to the left of nodes (e.g., Revenue Segments)
        const nodeSpecificLabelGroup = labelGroup.append('g')
          .attr('id', `label-group-left-${d.id || d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`)
          .attr('data-label-set-id', `labelset-left-${d.name.replace(/[^a-zA-Z0-9-_]/g, '')}`);
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
          nodeSpecificLabelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-title')
            .attr('x', d.x0 - leftLabelTextOffset) // For the combined text in 1-line layoutSize)
            .attr('text-anchor', 'end')
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
            nodeSpecificLabelGroup.append('text')
              .attr('class', 'nodelabel-left nodelabel-left-title')
              .attr('x', d.x0 - leftLabelTextOffset)
              .attr('y', centerY)
              .attr('text-anchor', 'end')
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
          nodeSpecificLabelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-value')
            .attr('x', d.x0 - leftLabelTextOffset)
            .attr('y', centerY + labelFontSize + 2)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .text(formatDollars(d.value))
            .style('font-size', valueFontSize + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#bbb')
            .style('paint-order', 'stroke')
            .style('stroke', 'white')
            .style('stroke-width', 4)
            .style('stroke-linejoin', 'round')
            .style('filter', 'drop-shadow(0px 3px 12px rgba(0,0,0,0.35))')

        } else if (rectHeight >= TWO_LINE_THRESHOLD) {
          // Render as two lines: segment name and value
          nodeSpecificLabelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-title')
            .attr('x', d.x0 - leftLabelTextOffset)
            .attr('y', centerY - 4)
            .attr('text-anchor', 'end')
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
          nodeSpecificLabelGroup.append('text')
            .attr('class', 'nodelabel-left nodelabel-left-value')
            .attr('x', d.x0 - leftLabelTextOffset)
            .attr('y', centerY + labelFontSize + 2)
            .attr('text-anchor', 'end')
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
          nodeSpecificLabelGroup.append('text')
            .attr('class', 'nodelabel-left')
            .attr('x', d.x0 - leftLabelTextOffset)
            .attr('y', centerY)
            .attr('text-anchor', 'end')
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
    }); // CRITICAL: Must be }); to close nodes.each()
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
    // Remove any duplicate declaration for Operating Loss node
    
    // DISABLED: Comprehensive node and path position correction
    if (false) {
    // COMPREHENSIVE NODE AND PATH POSITION CORRECTION
    // Log initial positions for diagnosis
    console.log('BEFORE POSITION CORRECTION - Critical nodes:', 
      nodes.filter(n => ['Operating Loss', 'Income Before Taxes', 'Net Loss'].includes(n.name))
      .map(n => `${n.name}: y0=${n.y0}, y1=${n.y1}`))
    
    // Step 1: Fix all node positions - ensure no negative y values
    nodes.forEach(node => {
      // Check if this is a critical node or if it has negative position
      if (node.forceTop || node.y0 < 0) {
        const originalHeight = Math.max(20, node.y1 - node.y0); // Preserve original height, minimum 20px
        const originalMidpoint = node.y0 + (node.y1 - node.y0)/2;
        
        // Force node to be at top of chart if it has forceTop flag
        if (node.forceTop) {
          node.y0 = 0;
          node.y1 = originalHeight;
          console.log(`Fixed position for node: ${node.name}, new y0=${node.y0}, y1=${node.y1}`);
        } 
        // Otherwise just make sure it's not negative
        else if (node.y0 < 0) {
          node.y0 = 0;
          node.y1 = originalHeight;
          console.log(`Corrected negative position for node: ${node.name}, new y0=${node.y0}, y1=${node.y1}`);
        }
      }
    });
    
    // Step 2: Regenerate all affected path coordinates based on corrected node positions
    console.log('CRITICAL PATH COORDINATES BEFORE FIXES:');
    layoutLinks.forEach(link => {
      const sourceName = link.source.name;  // ADD THIS LINE
      const targetName = link.target.name;  // ADD THIS LINE
      
      // Check if this is a critical path based on source/target nodes
      if (['Operating Loss', 'Income Before Taxes', 'Net Loss', 'Gross Profit'].includes(sourceName) ||
    ['Operating Loss', 'Income Before Taxes', 'Net Loss'].includes(targetName)) {
        console.log(`${sourceName} → ${targetName}: y0=${link.y0.toFixed(2)}, y1=${link.y1.toFixed(2)}`);
        
        // Update both source and target y-coordinates based on current node positions
        const sourceNode = link.source;
        const targetNode = link.target;
        
        // Calculate new midpoints of source and target nodes
        const sourceY = sourceNode.y0 + (sourceNode.y1 - sourceNode.y0)/2;
        const targetY = targetNode.y0 + (targetNode.y1 - targetNode.y0)/2;
        
        // Update path coordinates
        link.y0 = sourceY;
        link.y1 = targetY;
        
        console.log(`Fixed path from ${sourceName} to ${targetName}: new y0=${link.y0.toFixed(2)}, y1=${link.y1.toFixed(2)}`);
      }
    });
    
    // Final check for any disconnected paths
    let disconnected = 0;
    let totalPaths = 0;
    layoutLinks.forEach(link => {
      totalPaths++;
      const sourceNode = link.source;
      const targetNode = link.target;
      
      // Check if source or target coordinate is outside node boundaries
      const sourceY = sourceNode.y0 + (sourceNode.y1 - sourceNode.y0)/2;
      const targetY = targetNode.y0 + (targetNode.y1 - targetNode.y0)/2;
      
      if (Math.abs(link.y0 - sourceY) > 0.5 || Math.abs(link.y1 - targetY) > 0.5) {
        disconnected++;
        console.log(`Disconnected path from ${sourceNode.name} to ${targetNode.name}`);
      }
    });
    console.log(`PATH-NODE ALIGNMENT CHECK: Found ${disconnected} disconnected paths out of ${totalPaths} total paths`);
    
    // Special handling for Operating Loss node
    const opLossNode = nodes.find(n => n.name === 'Operating Loss');
    if (opLossNode) {
      console.log('TARGETED FIX: Operating Loss node before fix', 
                { y0: opLossNode.y0, y1: opLossNode.y1, height: opLossNode.y1 - opLossNode.y0 });
      
      // Store original heights to maintain their visual size
      const heightOL = opLossNode.y1 - opLossNode.y0;
      
      // Ensure it's at the absolute top with proper height
      const originalHeight = Math.max(20, opLossNode.y1 - opLossNode.y0);
      opLossNode.y0 = 0;
      opLossNode.y1 = originalHeight;
      
      // Extra step: Find all paths connected to Operating Loss and ensure they align precisely
      const opLossNodeMidpoint = opLossNode.y0 + (opLossNode.y1 - opLossNode.y0)/2;
      
      // Direct and targeted path adjustment for Operating Loss connections
      layoutLinks.forEach(link => {
        // Check if this link connects to Operating Loss
        if (link.source === opLossNode) {
          console.log('FIXING Operating Loss outgoing link to', link.target.name);
          link.y0 = opLossNodeMidpoint; // Fix the source y-coordinate
        }
        if (link.target === opLossNode) {
          // This is the path coming from Gross Profit - make it arrive at top of Operating Loss
          if (link.source === gpNode) {
            link.y1 = opLossNodeMidpoint; // Fixed position near top of Operating Loss
            console.log(`[Wave DEBUG] Modified GP→OL path to arrive at top: y1=${link.y1.toFixed(1)}`);
          } else {
            link.y1 = opLossNodeMidpoint; // Fix the target y-coordinate
          }
        }
      });
      
      console.log('TARGETED FIX: Operating Loss node after fix', 
                { y0: opLossNode.y0, y1: opLossNode.y1, height: opLossNode.y1 - opLossNode.y0, midpoint: opLossNodeMidpoint });
    }
    // Special handling for Income Before Taxes node
    const ibcNode = nodes.find(n => n.name === 'Income Before Taxes');
    if (ibcNode) {
      console.log('TARGETED FIX: Income Before Taxes node before fix', 
                { y0: ibcNode.y0, y1: ibcNode.y1, height: ibcNode.y1 - ibcNode.y0 });
      
      // Ensure it has proper positioning and sufficient height
      const minHeight = 20;
      const originalHeight = Math.max(minHeight, ibcNode.y1 - ibcNode.y0);
      
      // Make sure it's positioned at a visible position
      if (ibcNode.y0 < 0) {
        ibcNode.y0 = 0;
      }
      ibcNode.y1 = ibcNode.y0 + originalHeight;
      
      // Calculate the midpoint for path alignment
      const ibcMidpoint = ibcNode.y0 + (ibcNode.y1 - ibcNode.y0)/2;
      
      // Direct and targeted path adjustment for Income Before Taxes connections
      layoutLinks.forEach(link => {
        // Check if this link connects to Income Before Taxes
        if (link.source === ibcNode) {
          console.log('FIXING Income Before Taxes outgoing link to', link.target.name);
          link.y0 = ibcMidpoint; // Fix the source y-coordinate
        }
        if (link.target === ibcNode) {
          console.log('FIXING Income Before Taxes incoming link from', link.source.name);
          link.y1 = ibcMidpoint; // Fix the target y-coordinate
        }
      });
      
      console.log('TARGETED FIX: Income Before Taxes node after fix', 
                { y0: ibcNode.y0, y1: ibcNode.y1, height: ibcNode.y1 - ibcNode.y0, midpoint: ibcMidpoint });
    }
    
    // Special handling for Net Loss node
    const netLossNode = nodes.find(n => n.name === 'Net Loss');
    if (netLossNode && !isNetProfitable) {
      console.log('TARGETED FIX: Net Loss node before fix', 
                { y0: netLossNode.y0, y1: netLossNode.y1, height: netLossNode.y1 - netLossNode.y0 });
      
      // Ensure it has sufficient visibility and proper positioning
      const minHeight = 20;
      const originalHeight = Math.max(minHeight, netLossNode.y1 - netLossNode.y0);
      
      // For Net Loss, make sure it's positioned at a visible position but not necessarily at y=0
      if (netLossNode.y0 < 0) {
        netLossNode.y0 = 0;
      }
      netLossNode.y1 = netLossNode.y0 + originalHeight;
      
      // Calculate the midpoint for path alignment
      const netLossMidpoint = netLossNode.y0 + (netLossNode.y1 - netLossNode.y0)/2;
      
      // Direct and targeted path adjustment for Net Loss connections
      layoutLinks.forEach(link => {
        // Check if this link connects to Net Loss
        if (link.source === netLossNode) {
          console.log('FIXING Net Loss outgoing link to', link.target.name);
          link.y0 = netLossMidpoint; // Fix the source y-coordinate
        }
        if (link.target === netLossNode) {
          console.log('FIXING Net Loss incoming link from', link.source.name);
          link.y1 = netLossMidpoint; // Fix the target y-coordinate
        }
      });
      
      console.log('TARGETED FIX: Net Loss node after fix', 
                { y0: netLossNode.y0, y1: netLossNode.y1, height: netLossNode.y1 - netLossNode.y0, midpoint: netLossMidpoint });
    }
    }
    // end disabled manual corrections

    // Debug: Print y0/y1 for critical nodes before final link assignment
    const criticalNames = ['Operating Loss', 'Income Before Taxes'];
    nodes.forEach(n => {
      if (criticalNames.includes(n.name)) {
        console.log(`[Sankey DEBUG] ${n.name}: y0=${n.y0}, y1=${n.y1}`);
      }
    });
    // Clamp critical nodes to top and update links
    criticalNames.forEach(name => {
      const n = nodes.find(d => d.name === name);
      if (n && n.y0 < 0) {
        const h = n.y1 - n.y0;
        n.y0 = 0;
        n.y1 = h;
      }
    });
    // Update link positions for clamped nodes
    layoutLinks.forEach(link => {
      const sourceName = link.source.name;
      const targetName = link.target.name;
      if (criticalNames.includes(sourceName)) {
        const n = nodes.find(d => d.name === sourceName);
        link.y0 = n.y0 + (n.y1 - n.y0) / 2;
      }
      if (criticalNames.includes(targetName)) {
        const n = nodes.find(d => d.name === targetName);
        link.y1 = n.y0 + (n.y1 - n.y0) / 2;
      }
    });
    // Final re-assign for leftmost column and all nodes
    assignLinkSlots(nodes, layoutLinks);

    // Render all rectangles for connected nodes regardless of size/value
    const importantNodes = nodes.filter(n => {
      const isConnected = layoutLinks.some(l => l.source === n || l.target === n);
      const hasName = n.name && n.name.trim().length > 0;
      return isConnected && hasName;
    });

    // Render the nodes as rectangles
    chartGroup.append('g')
      .selectAll('rect')
      .data(importantNodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0) // Use the modified y0 position
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => {
        // For consistent rendering, we need to round heights to exact pixel values
        // to match the path rendering (which uses the same coordinates)
        return Math.floor(Math.max(1, d.y1 - d.y0));
      })
      .attr('fill', d => nodeColor(d.name));
    
    // Draw links
    chartGroup.selectAll('path.sankey-link')
      .data(layoutLinks)
      .join('path')
      .attr('class', 'sankey-link')
      .attr('d', d => {
        // Special case for Operating Loss link in unprofitable companies
        if (!isProfitable && d.source.name === 'Gross Profit' && d.target.name === 'Operating Loss') {
          const x0 = d.source.x0; // Use x0 instead of x1 to start from left edge
          const x1 = d.target.x0;
          const y0a = d._sy0, y0b = d._sy1;
          const y1a = d._ty0, y1b = d._ty1;
          
          console.log('[DEBUG] Extending Operating Loss path over Gross Profit rect');
          
          // Create a path that covers the rect from left to right
          const curvature = 0.5;
          const xi = d3.interpolateNumber(x0, x1);
          const x2 = xi(curvature), x3 = xi(1 - curvature);
          
          // First draw over the rect horizontally, then curve to target
          const rectEnd = d.source.x1;
          return [
            'M', x0, y0a,                    // Start at left edge of rect
            'L', rectEnd, y0a,               // Draw to right edge of rect
            'C', x2, y0a, x3, y1a, x1, y1a, // Then curve to target
            'L', x1, y1b,
            'C', x3, y1b, x2, y0b, rectEnd, y0b,
            'L', x0, y0b,                    // Return to left edge
            'Z'
          ].join(' ');
        }
        
        // Special case for Revenue to Gross Profit link - enhanced wave with more curvature
        if (d.source.name === 'Revenue' && d.target.name === 'Gross Profit') {
          const x0 = d.source.x1, x1 = d.target.x0;
          const y0a = d._sy0, y0b = d._sy1;
          
          // Connect to the BOTTOM of the Gross Profit rect
          const grossProfitBottom = d.target.y1;
          const pathHeight = y0b - y0a;
          const y1a = grossProfitBottom - pathHeight;
          const y1b = grossProfitBottom;
          
          console.log('[DEBUG] Creating enhanced wave for Revenue to Gross Profit path - connecting to bottom');
          
          // Use moderate curvature with vertical offset for wave effect
          const curvature = 0.5;
          const xi = d3.interpolateNumber(x0, x1);
          const x2 = xi(curvature), x3 = xi(1 - curvature);
          const waveOffset = 15; // Reduced from 30 for subtler wave
          return [
            'M', x0, y0a,
            'C', x2, y0a - waveOffset, x3, y1a + waveOffset, x1, y1a,
            'L', x1, y1b,
            'C', x3, y1b + waveOffset, x2, y0b - waveOffset, x0, y0b,
            'Z'
          ].join(' ');
        }
        
        // Special case for Operating Expenses to SG&A Expenses link - enhanced wave
        if (d.source.name === 'Operating Expenses' && d.target.name === 'SG&A Expenses') {
          const x0 = d.source.x1, x1 = d.target.x0;
          const y0a = d._sy0, y0b = d._sy1;
          const y1a = d._ty0, y1b = d._ty1;
          const curvature = 0.5;
          const xi = d3.interpolateNumber(x0, x1);
          const x2 = xi(curvature), x3 = xi(1 - curvature);
          const waveOffset = 10; // Reduced from 25 for subtler wave
          return [
            'M', x0, y0a,
            'C', x2, y0a + waveOffset, x3, y1a - waveOffset, x1, y1a,
            'L', x1, y1b,
            'C', x3, y1b - waveOffset, x2, y0b + waveOffset, x0, y0b,
            'Z'
          ].join(' ');
        }
        
        // Normal path generation for all other links
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
      .attr('fill', d => {
        if (d.isNegative) {
          console.log('[DEBUG] Negative flow detected:', d.source.name, '→', d.target.name, 'isNegative:', d.isNegative);
          return 'url(#negative-flow-pattern)';
        }
        const color = linkColor(d);
        console.log('[DEBUG] Regular flow:', d.source.name, '→', d.target.name, 'color:', color);
        return color;
      })
      .attr('opacity', 0.5)
      .attr('stroke', d => d.isNegative ? 'url(#negative-flow-pattern)' : linkColor(d))
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
    if (segments && segments.length > 0) {
      // Calculate vertical spacing and font size for dense segments
      const segmentLinkSources = layoutLinks.filter(l => 
        l.target.name === 'Revenue' && 
        l.source && 
        l.source.x0 < l.target.x0 && 
        segmentNodes.some(sn => sn.name === l.source.name) // Ensure the source is a known segment
      ).map(l => l.source).sort((a, b) => a.y0 - b.y0);

      const totalSegs = segmentLinkSources.length;
      const nodeHeight = nodes.find(n => n.name === 'Revenue').y1 - nodes.find(n => n.name === 'Revenue').y0;
      // Minimum spacing and font size
      let minSpacing = 18;
      const fontSize = 10; // reduced size for segment YoY labels
      if (totalSegs > 10) {
        minSpacing = Math.max(12, nodeHeight / totalSegs);
      }
      // Prepare label positions for collision avoidance
    // Helper to check if two bounding boxes overlap
    function checkOverlap(bbox1, bbox2, padding = 0) {
      const overlapX = bbox1.x < bbox2.x + bbox2.width + padding && bbox1.x + bbox1.width + padding > bbox2.x;
      const overlapY = bbox1.y < bbox2.y + bbox2.height + padding && bbox1.y + bbox1.height + padding > bbox2.y;
      return overlapX && overlapY;
    }

    // Helper to get the BBox of a label group <g> element in SVG coordinates,
    // considering its 'transform' attribute.
    function getLabelGroupSVGScreenBBox(groupElement) {
      if (!groupElement || typeof groupElement.getBBox !== 'function') {
        console.warn('[Collision DEBUG] Invalid groupElement to getLabelGroupSVGScreenBBox:', groupElement);
        return { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, midY: 0 };
      }
      const bbox = groupElement.getBBox(); // BBox in parent's coords, before this element's transform

      const transform = d3.select(groupElement).attr('transform');
      let currentTranslateX = 0; 
      let currentTranslateY = 0;
      if (transform) {
        const R = /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/;
        const match = R.exec(transform);
        if (match) {
          currentTranslateX = parseFloat(match[1]);
          currentTranslateY = parseFloat(match[2]);
        }
      }
      
      return {
        x: bbox.x + currentTranslateX,
        y: bbox.y + currentTranslateY,
        width: bbox.width,
        height: bbox.height,
        top: bbox.y + currentTranslateY,
        right: bbox.x + currentTranslateX + bbox.width,
        bottom: bbox.y + currentTranslateY + bbox.height,
        left: bbox.x + currentTranslateX,
        midY: (bbox.y + currentTranslateY) + (bbox.height / 2)
      };
    }

    // --- Function to adjust Text vs (Rect/Path) Collisions with Grouped Movement ---
    function adjustNodeTextRectCollisions(layoutNodes, padding = 2) {
    const getBBoxString = (bbox) => `x:${bbox.x.toFixed(1)},y:${bbox.y.toFixed(1)},w:${bbox.width.toFixed(1)},h:${bbox.height.toFixed(1)}`;

  function getTranslateValues(transformString) {
    if (!transformString) return { translateX: 0, translateY: 0 };
    const match = /translate\(\s*([0-9.-]+)(?:\s*[, ]\s*([0-9.-]+))?\s*\)/.exec(transformString);
    if (match) {
      const x = parseFloat(match[1]);
      const y = match[2] !== undefined ? parseFloat(match[2]) : 0;
      return { translateX: x, translateY: y };
    }
    return { translateX: 0, translateY: 0 };
  }
      console.log('[Collision DEBUG] Starting NEW Text vs (Rect/Path) collision adjustment...');
  const nodeRects = chartGroup.selectAll('g > rect').nodes().map(r => ({ el: r, type: 'rect', bbox: r.getBBox() }));

  // Get Sankey layout data for smarter collision decisions
  const allSankeyNodes = layoutNodes; // Use passed-in nodes
  const maxDepth = d3.max(allSankeyNodes, d => d.depth);
  const sankeyNodeMap = new Map(allSankeyNodes.map(n => [n.name, n])); // Assuming 'data-label-set-id' uses node.name

  const linkPathElements = chartGroup.selectAll('path.sankey-link');
  const linkPaths = linkPathElements.data().map((linkDataItem, i) => {
    const pathElement = linkPathElements.nodes()[i];
    if (!pathElement) return null;
    const bbox = pathElement.getBBox();
    if (bbox.width <= 1 || bbox.height <= 1) return null;
    return { el: pathElement, type: 'path', bbox: bbox, data: linkDataItem }; // Store original link data
  }).filter(p => p !== null);

      const allLabelGroupElements = labelGroup.selectAll('g[data-label-set-id]').nodes();
      console.log(`[Collision DEBUG] Found ${allLabelGroupElements.length} label groups to process.`);

      if (allLabelGroupElements.length === 0) {
        console.log('[Collision DEBUG] No label groups found to adjust.');
        return;
      }

      allLabelGroupElements.forEach(gEl => {
        const currentTransform = d3.select(gEl).attr('transform');
        if (currentTransform) {
          const match = /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(currentTransform);
          if (match) {
            const currentX = parseFloat(match[1]); // Preserve current X
            const currentY = parseFloat(match[2]); // Preserve current Y
            d3.select(gEl).attr('transform', `translate(${currentX}, ${currentY})`);
          } else {
            d3.select(gEl).attr('transform', 'translate(0,0)');
          }
        } else {
          d3.select(gEl).attr('transform', 'translate(0,0)');
        }
      });

      const MAX_GLOBAL_ITERATIONS = 75;
      const ADJUSTMENT_AMOUNT = 4;
      let globalIterationCount = 0;
      let adjustmentsMadeInLastPass = true;

      while (adjustmentsMadeInLastPass && globalIterationCount < MAX_GLOBAL_ITERATIONS) {
        adjustmentsMadeInLastPass = false;
        globalIterationCount++;
        // console.log(`\n[Collision DEBUG] Global Iteration: ${globalIterationCount}`);

        const currentCycleLabelBBoxes = new Map();
        allLabelGroupElements.forEach(gEl => {
          currentCycleLabelBBoxes.set(gEl, getLabelGroupSVGScreenBBox(gEl));
        });

        for (let i = 0; i < allLabelGroupElements.length; i++) {
          const groupA_element = allLabelGroupElements[i];
          const groupA_id = d3.select(groupA_element).attr('data-label-set-id') || `group-${i}`;
          
          let groupA_workingBBox = getLabelGroupSVGScreenBBox(groupA_element);

      // NEW LOGGING: Initial position of the label group
      const initialGroupTransform_A = d3.select(groupA_element).attr('transform');
      const initialTranslate_A = getTranslateValues(initialGroupTransform_A);
      const groupA_nodeName_for_log = sankeyNodeMap.get(groupA_id) ? sankeyNodeMap.get(groupA_id).name : groupA_id;
      console.log(`[Collision DEBUG] Processing Label Group for "${groupA_nodeName_for_log}". Initial Y: ${initialTranslate_A.translateY.toFixed(1)}, Initial X: ${initialTranslate_A.translateX.toFixed(1)}, BBox: ${getBBoxString(groupA_workingBBox)}`);

          const transformAttrA = d3.select(groupA_element).attr('transform');
          let currentTranslateX_A = 0; // To store current X
          let currentTranslateY_A = 0;
          // Regex now captures both X and Y, X can be non-zero
          const matchA = /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(transformAttrA);
          if (matchA) {
            currentTranslateX_A = parseFloat(matchA[1]);
            currentTranslateY_A = parseFloat(matchA[2]);
          }
          
          const initialY_A_for_turn = currentTranslateY_A;
          let newTargetY_A = currentTranslateY_A;

          for (const obstacle of [...nodeRects, ...linkPaths]) {
        let skipCollisionForThisObstacle = false;
        const groupA_nodeId = d3.select(groupA_element).attr('data-label-set-id');
        const groupA_sankeyNode = sankeyNodeMap.get(groupA_nodeId);

        if (groupA_sankeyNode && obstacle.type === 'path' && obstacle.data) {
          // Check if groupA is a right-edge node
          if (groupA_sankeyNode.depth === maxDepth) {
        console.log(`[Collision DEBUG] Node "${groupA_sankeyNode.name}" (ID: ${groupA_id}) IS a right-edge node (depth ${groupA_sankeyNode.depth}, maxDepth ${maxDepth}).`);
            // console.log(`[Collision DEBUG] Right-edge label "${groupA_nodeId}" (depth ${groupA_sankeyNode.depth}) vs path target "${obstacle.data.target.name}". Max depth: ${maxDepth}`);
            // If it's a right-edge node and the obstacle is a path, check if it's its own incoming link
            if (obstacle.data.target === groupA_sankeyNode) {
          const textElementsForLog = d3.select(groupA_element).selectAll('text').nodes();
          const firstTextContent = textElementsForLog.length > 0 ? d3.select(textElementsForLog[0]).text().substring(0,20)+'...' : 'N/A';
          console.log(`[Collision DEBUG] Right-edge node "${groupA_sankeyNode.name}" (text: "${firstTextContent}") potential collision with OWN INCOMING path: ${obstacle.data.source.name} -> ${obstacle.data.target.name}. ` +
                                    `TextGroupBBox: ${getBBoxString(groupA_workingBBox)}, PathBBox: ${getBBoxString(obstacle.bbox)}`);
              skipCollisionForThisObstacle = true;
              const textElementsForSkipLog = d3.select(groupA_element).selectAll('text').nodes();
          const firstTextContentForSkip = textElementsForSkipLog.length > 0 ? d3.select(textElementsForSkipLog[0]).text().substring(0,20)+'...' : 'N/A';
          console.log(`[Collision DEBUG] SKIPPING collision for right-edge label "${groupA_sankeyNode.name}" (text: "${firstTextContentForSkip}") with its OWN incoming link (Target: "${obstacle.data.target.name}")`);
            } else {
              // console.log(`[Collision DEBUG] NOT skipping for "${groupA_nodeId}": path target "${obstacle.data.target.name}" is NOT this node.`);
            }
          } else {
            // console.log(`[Collision DEBUG] Label "${groupA_nodeId}" (depth ${groupA_sankeyNode.depth}) is NOT right-edge (maxDepth ${maxDepth}). No special link skipping.`);
          }
        } else if (groupA_sankeyNode && obstacle.type === 'path' && !obstacle.data) {
          // console.warn(`[Collision DEBUG] Obstacle path for label "${groupA_nodeId}" is missing .data property.`);
        } else if (!groupA_sankeyNode && obstacle.type === 'path'){
          // console.warn(`[Collision DEBUG] groupA_sankeyNode not found for ID "${groupA_nodeId}" when checking path obstacle.`);
        }

        if (!skipCollisionForThisObstacle && checkOverlap(groupA_workingBBox, obstacle.bbox, 0)) { // Use 0 for direct overlap check
            const textElementsForCollisionLog = d3.select(groupA_element).selectAll('text').nodes();
            const firstTextContentForCollision = textElementsForCollisionLog.length > 0 ? d3.select(textElementsForCollisionLog[0]).text().substring(0,20)+'...' : 'N/A';
            const obstacleNodeName = obstacle.type === 'rect' ? (obstacle.el.__data__ ? obstacle.el.__data__.name : 'UnknownRect') : 'N/A';
            const obstacleSourceNodeName = obstacle.type === 'path' && obstacle.data && obstacle.data.source ? obstacle.data.source.name : 'N/A';
            const obstacleTargetNodeName = obstacle.type === 'path' && obstacle.data && obstacle.data.target ? obstacle.data.target.name : 'N/A';

            console.log(`[Collision DEBUG] COLLISION! Label Group for "${groupA_sankeyNode ? groupA_sankeyNode.name : groupA_id}" (text: "${firstTextContentForCollision}") ` +
                                    `TextGroupBBox: ${getBBoxString(groupA_workingBBox)} ` +
                                    `colliding with ${obstacle.type} of "${obstacle.type === 'rect' ? obstacleNodeName : `${obstacleSourceNodeName} -> ${obstacleTargetNodeName}`}" (ObstacleBBox: ${getBBoxString(obstacle.bbox)}).`);
              newTargetY_A += ADJUSTMENT_AMOUNT;
              adjustmentsMadeInLastPass = true;
              groupA_workingBBox.y += ADJUSTMENT_AMOUNT;
              groupA_workingBBox.top += ADJUSTMENT_AMOUNT;
              groupA_workingBBox.bottom += ADJUSTMENT_AMOUNT;
              groupA_workingBBox.midY += ADJUSTMENT_AMOUNT;
          }
            }

          for (let j = 0; j < allLabelGroupElements.length; j++) {
            if (i === j) continue;
            const groupB_element = allLabelGroupElements[j];
            const groupB_snapshotBBox = currentCycleLabelBBoxes.get(groupB_element);
            if (checkOverlap(groupA_workingBBox, groupB_snapshotBBox, padding)) {
              if (groupA_workingBBox.midY >= groupB_snapshotBBox.midY - 1e-3) { 
                newTargetY_A += ADJUSTMENT_AMOUNT;
                adjustmentsMadeInLastPass = true;
                groupA_workingBBox.y += ADJUSTMENT_AMOUNT;
                groupA_workingBBox.top += ADJUSTMENT_AMOUNT;
                groupA_workingBBox.bottom += ADJUSTMENT_AMOUNT;
                groupA_workingBBox.midY += ADJUSTMENT_AMOUNT;
              }
            }
          }
          
          if (newTargetY_A !== initialY_A_for_turn) {
            d3.select(groupA_element).attr('transform', `translate(${currentTranslateX_A}, ${newTargetY_A})`);
          }
        }
      }

      if (globalIterationCount >= MAX_GLOBAL_ITERATIONS) {
        console.warn('[Collision DEBUG] Max global iterations reached. Layout may not be fully resolved.');
      } else {
        console.log(`[Collision DEBUG] Collision adjustment completed in ${globalIterationCount} global iterations.`);
      }
    }

    // [Cascade] Attempting to run collision adjustments after main D3 transitions.
    const activeTransitionPromises = [];
    if (typeof nodeTransition !== 'undefined' && typeof nodeTransition.end === 'function') {
        console.log('[Cascade] Using nodeTransition.');
        activeTransitionPromises.push(nodeTransition.end());
    }
    if (typeof linkTransition !== 'undefined' && typeof linkTransition.end === 'function') {
        console.log('[Cascade] Using linkTransition.');
        activeTransitionPromises.push(linkTransition.end());
    }
    // If specific node/link transitions weren't found (or if only one is used, e.g., for both), check for a generic 't'
    if (activeTransitionPromises.length === 0 && typeof t !== 'undefined' && typeof t.end === 'function') {
        console.log('[Cascade] Using generic transition object t.');
        activeTransitionPromises.push(t.end());
    }

    if (activeTransitionPromises.length > 0) {
        Promise.all(activeTransitionPromises).then(() => {
            console.log('[Cascade] Identified D3 transitions ended. Running collision adjustments.');
            adjustNodeTextRectCollisions(nodes, 10);
        }).catch(error => {
            console.error('[Cascade] Error waiting for D3 transitions, running collision adjustments anyway:', error);
            adjustNodeTextRectCollisions(nodes, 10);
        });
    } else {
        console.warn('[Cascade] No suitable D3 transition objects (nodeTransition, linkTransition, or t) found in scope or they lack .end(). Running collision adjustments immediately. Please ensure these variables are defined and hold the main D3 transitions if this behavior is incorrect.');
        adjustNodeTextRectCollisions(nodes, 10);
    }

      const labelPos = [];
      chartGroup.selectAll('text.yoy-label-segment')
        .data(segmentLinkSources) // Use segmentLinkSources for this specific labeling
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
    chartGroup.selectAll('text.yoy-label-general').data(layoutLinks.filter(link => {
      if (!link || !link.source || !link.target) return false;

      // If revenue segments are present and this link targets 'Revenue'
      if (segments && segments.length > 0 && link.target.name === 'Revenue') {
        // Check if the source of this link is one of the defined segment nodes.
        const isSegmentSource = segmentNodes.some(segmentNode => segmentNode.name === link.source.name);
        if (isSegmentSource) {
          return false; // Exclude: Handled by yoy-label-segment (the white ones)
        }
      }

      // For all other links, check if they have YoY growth data
      // Use the parameter 'link' from the filter function, not a global 'link' variable
      const hasGrowthData = typeof growthKeyMap !== 'undefined' && 
                            link.target && growthKeyMap[link.target.name] && 
                            growthData && 
                            growthData[growthKeyMap[link.target.name]] != null;
      return hasGrowthData;
    }))
      .join('text')
      .attr('class', 'yoy-label yoy-label-general') 
      .attr('x', d => d && d.source && d.target ? getLinkRibbonCenter(d)[0] : 0)
      .attr('y', d => d && d.source && d.target ? getLinkRibbonCenter(d)[1] : 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#999') 
      .attr('font-weight', 400) 
      .style('opacity', 0.6) 
      .text(d => {
        const targetKey = growthKeyMap[d.target.name];
        const yoyDecimal = growthData[targetKey]; // Assuming this is like 0.05 for 5%
        if (yoyDecimal == null || isNaN(yoyDecimal)) return '';
        const yoyPercent = yoyDecimal * 100;
        return (yoyPercent > 0 ? '+' : '') + yoyPercent.toFixed(1) + '% YoY';
      });

    // DYNAMICALLY ADJUST YoY LABELS TO AVOID OVERLAP
    console.log('[YoY Adjust DEBUG] Starting dynamic YoY label adjustment...');
    chartGroup.selectAll('text.yoy-label-general').each(function(linkData) {
      const yoyLabelElement = this;
      const yoyLabel = d3.select(yoyLabelElement);
      const yoyLabelText = yoyLabel.text(); // Get text once for logging
      console.log(`[YoY Adjust DEBUG] Processing YoY Label: ${yoyLabelText}, Link: ${linkData && linkData.source ? linkData.source.name : 'N/A'}->${linkData && linkData.target ? linkData.target.name : 'N/A'}`);

      let yoyBBox;
      try {
        yoyBBox = yoyLabelElement.getBBox();
        console.log(`[YoY Adjust DEBUG]   YoY BBox: x=${yoyBBox.x.toFixed(1)}, y=${yoyBBox.y.toFixed(1)}, w=${yoyBBox.width.toFixed(1)}, h=${yoyBBox.height.toFixed(1)}`);
      } catch (e) {
        console.warn(`[YoY Adjust DEBUG]   Could not get BBox for YoY label: ${yoyLabelText}`, e);
        return;
      }

      if (!linkData || !linkData.source || !linkData.target || !yoyBBox || yoyBBox.width === 0 || yoyBBox.height === 0) {
        console.log(`[YoY Adjust DEBUG]   Skipping YoY label ${yoyLabelText} due to invalid data or BBox.`);
        return;
      }
      
      const potentialCollisionNodesData = [linkData.source, linkData.target];
      let movedThisYoYLabel = false;

      // console.log(`[YoY Adjust DEBUG]   Potential collision nodes for ${yoyLabelText}: ${potentialCollisionNodesData.map(n=>n.name).join(', ')}`);

      chartGroup.selectAll('.nodelabel, .nodelabel-right, .nodelabel-left, .nodelabel-value').each(function(nodeLabelData) {
        const nodeLabelElement = this;
        const nodeLabelText = d3.select(nodeLabelElement).text();

        if (movedThisYoYLabel) return;

        let nodeLabelBBox;
        try {
          nodeLabelBBox = nodeLabelElement.getBBox();
        } catch (e) {
          // console.warn(`[YoY Adjust DEBUG]     Could not get BBox for node label: "${nodeLabelText}"`, e);
          return;
        }

        if (!nodeLabelBBox || nodeLabelBBox.width === 0 || nodeLabelBBox.height === 0) {
          // console.log(`[YoY Adjust DEBUG]     Skipping node label "${nodeLabelText}" due to invalid BBox.`);
          return; 
        }
        
        let nodeNameForCheck = 'N/A';
        let nameSource = 'unknown'; // To track where the name was found

        // 1. Try direct __data__.name on the text element itself (CORRECTED TYPO: .name instead of __data__name)
        if (nodeLabelText.__data__ && typeof nodeLabelText.__data__.name === 'string' && nodeLabelText.__data__.name.trim() !== '') {
            nodeNameForCheck = nodeLabelText.__data__.name;
            nameSource = 'text_data';
        } else {
            // 2. Traverse upwards to find parent g.node and its __data__.name
            let parent = nodeLabelText.parentNode;
            let depth = 0;
            let foundOnGNode = false;
            while (parent && depth < 5) {
                if (parent.classList && parent.classList.contains('node') && parent.__data__ && typeof parent.__data__.name === 'string' && parent.__data__.name.trim() !== '') {
                    nodeNameForCheck = parent.__data__.name;
                    nameSource = `parent_g_node_depth_${depth}`;
                    foundOnGNode = true;
                    break; 
                }
                parent = parent.parentNode;
                depth++;
            }
            if (nodeNameForCheck === 'N/A') nameSource = 'not_found_via_traversal';
        }

        // const isNodeRelevant = potentialCollisionNodesData.some(n => n.name === nodeNameForCheck);

        // if (!isNodeRelevant) {
            // Optional: Log skipped non-relevant elements for debugging if needed, but can be verbose.
            // console.log(`[YoY Adjust DEBUG]     Skipping Text: "${nodeLabelText.textContent.trim()}" (Sankey Node: "${nodeNameForCheck}", Source: ${nameSource}) - not relevant to YoY for ${linkData.source.name}->${linkData.target.name}.`);
            // return; // Skip to next textElement if not relevant
        // }

        // If relevant, log details and proceed with overlap check
        console.log(`[YoY Adjust DEBUG]     Relevant Text Element: "${nodeLabelText.trim()}" (Belongs to Sankey Node: "${nodeNameForCheck}", Name Source: ${nameSource}). BBox: x=${Math.round(nodeLabelBBox.x)}, y=${Math.round(nodeLabelBBox.y)}, w=${Math.round(nodeLabelBBox.width)}, h=${Math.round(nodeLabelBBox.height)}`);

        // Check for overlap if relevant
        const overlapX = yoyBBox.x < nodeLabelBBox.x + nodeLabelBBox.width &&
                         yoyBBox.x + yoyBBox.width > nodeLabelBBox.x;
        const overlapY = yoyBBox.y < nodeLabelBBox.y + nodeLabelBBox.height &&
                         yoyBBox.y + yoyBBox.height > nodeLabelBBox.y;

        if (overlapX && overlapY) {
          console.log(`[YoY Adjust DEBUG]       OVERLAP DETECTED: YoY ("${yoyLabelText}") vs NodeLabel ("${nodeLabelText}")`);
          const currentYoyCenterY = parseFloat(yoyLabel.attr('y'));
          const newYoyTop = nodeLabelBBox.y + nodeLabelBBox.height + 5; 
          const newYoyCenterY = newYoyTop + (yoyBBox.height / 2); 

          console.log(`[YoY Adjust DEBUG]         Current YoY Y: ${currentYoyCenterY.toFixed(1)}, New Proposed YoY Y: ${newYoyCenterY.toFixed(1)} (NodeLabel Bottom: ${(nodeLabelBBox.y + nodeLabelBBox.height).toFixed(1)}, YoY Height: ${yoyBBox.height.toFixed(1)})`);

          if (newYoyCenterY > currentYoyCenterY + 1) { 
            yoyLabel.attr('y', newYoyCenterY);
            console.log(`[YoY Adjust DEBUG]         MOVED YoY label "${yoyLabelText}" to Y=${newYoyCenterY.toFixed(2)} to avoid "${nodeLabelText}"`);
            movedThisYoYLabel = true;
          } else {
            console.log(`[YoY Adjust DEBUG]         Overlap detected, but new Y not significantly greater. No move for YoY: "${yoyLabelText}"`);
            // Do not set movedThisYoYLabel = true here, allow further checks if no significant move was made.
          }
        // The 'else if (isYoYForOpExDebug ...)' block previously here was part of an old debugging approach and has been removed.
        // The general overlap logic should now correctly handle all relevant cases.
        }
      });
    });
    console.log('[YoY Adjust DEBUG] Finished dynamic YoY label adjustment.');
    // END DYNAMIC ADJUSTMENT;

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
        // Ensure d is not null or undefined before accessing properties
        if (!d) return;
        
        const name = (d && d.name) ? d.name : (typeof d === 'string' ? d : 'Unknown');
        let val = (d && typeof d.value === 'number') ? formatDollars(d.value) : '';
        let margin = '';
        
        if (name && growthKeyMap && growthData && growthKeyMap[name] && growthData[growthKeyMap[name]] != null) {
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
        // Ensure d and its properties are not null or undefined
        if (!d || !d.source || !d.target) return;
        
        const src = d.source.name || 'Unknown';
        const tgt = d.target.name || 'Unknown';
        let val = typeof d.value === 'number' ? formatDollars(d.value) : '';
        let margin = '';
        
        if (tgt && growthKeyMap && growthData && growthKeyMap[tgt] && growthData[growthKeyMap[tgt]] != null) {
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
      
// ADD VERTICAL OFFSETS TO CREATE NATURAL WAVES
// This ensures the Sankey diagram has beautiful flowing curves instead of straight lines
nodes.forEach(node => {
  let offsetY = 0;
  
  // For Gross Profit, move it slightly down for unprofitable companies
  // This creates a natural wave from Revenue flowing up into it
  if (node.name === 'Gross Profit' && !isProfitable) {
    offsetY = 10; // Move down 10 pixels
  }
  
  // For SG&A Expenses, move it down to create a wave from Operating Expenses
  else if (node.name === 'SG&A Expenses' || node.name === 'SG&A') {
    offsetY = 35; // Increased from 25 pixels for more noticeable offset
  }
  
  // For Cost of Revenue, move it slightly up
  else if (node.name === 'Cost of Revenue') {
    offsetY = -8; // Move up 8 pixels
  }
  
  // For Operating Loss, keep at top (no offset)
  else if (node.name === 'Operating Loss') {
    offsetY = 0;
  }
  
  // For Income Before Taxes, slight downward movement
  else if (node.name === 'Income Before Taxes') {
    offsetY = 5;
  }
  
  // Apply the offset to both y0 and y1
  if (offsetY !== 0) {
    node.y0 += offsetY;
    node.y1 += offsetY;
    
    console.log(`[Wave Offset] ${node.name}: offset=${offsetY}, new y0=${node.y0}, y1=${node.y1}`);
  }
});
  
// CRITICAL: Update all link positions to match the new node positions
// This ensures paths connect properly to the offset nodes
layoutLinks.forEach(link => {
  // Recalculate where links connect based on flow conservation
  // This is critical to ensure the math is correct after offsetting nodes
  
  // For links where we've moved the source node
  if (link.source.name === 'Cost of Revenue' || 
      (link.source.name === 'Gross Profit' && !isProfitable) ||
      link.source.name === 'SG&A Expenses' ||
      link.source.name === 'Income Before Taxes') {
    // The link should follow the node's movement
    const nodeOffset = link.source.y0 - link.sy;
    if (nodeOffset !== 0 && link.sy !== undefined) {
      link.sy += nodeOffset;
    }
  }
  
  // For links where we've moved the target node
  if (link.target.name === 'Cost of Revenue' || 
      (link.target.name === 'Gross Profit' && !isProfitable) ||
      link.target.name === 'SG&A Expenses' ||
      link.target.name === 'Income Before Taxes') {
    // The link should follow the node's movement
    const nodeOffset = link.target.y0 - link.ty;
    if (nodeOffset !== 0 && link.ty !== undefined) {
      link.ty += nodeOffset;
    }
  }
});

  // Custom alignment for Interest Expense node position (X and Y)
  console.log('!!! REACHED CUSTOM INTEREST EXPENSE ALIGNMENT BLOCK !!!'); 
  console.log('[Custom Alignment DEBUG] All node names before find:', nodes.map(n => n.name));
  const incomeBeforeTaxesNode = nodes.find(n => n.name === 'Income Before Taxes');
  console.log('[Custom Alignment DEBUG] incomeBeforeTaxesNode:', incomeBeforeTaxesNode ? incomeBeforeTaxesNode.name : 'not found');

  console.log('[Custom Alignment DEBUG] Attempting to find Interest Expense node...');
  const interestExpenseNode = nodes.find(n => n.name === 'Interest' || n.name === 'Interest Expense');
  console.log('[Custom Alignment DEBUG] interestExpenseNode:', interestExpenseNode ? interestExpenseNode.name : 'not found');

  console.log('[Custom Alignment DEBUG] Checking if both nodes were found...');
  const ibtNodeExists = !!incomeBeforeTaxesNode;
  const ieNodeExists = !!interestExpenseNode;
  console.log(`[Custom Alignment DEBUG] Pre-check: incomeBeforeTaxesNode exists? ${ibtNodeExists}, interestExpenseNode exists? ${ieNodeExists}`);
  console.log('[Custom Alignment DEBUG] incomeBeforeTaxesNode object (pre-check):', incomeBeforeTaxesNode);
  console.log('[Custom Alignment DEBUG] interestExpenseNode object (pre-check):', interestExpenseNode);

  const conditionMet = incomeBeforeTaxesNode && interestExpenseNode;
  console.log('[Custom Alignment DEBUG] Condition (incomeBeforeTaxesNode && interestExpenseNode) evaluated to:', conditionMet);

  if (conditionMet) {
    console.log(`[Custom Alignment DEBUG] Both nodes found. Proceeding with alignment.`);
    console.log(`[Custom Alignment DEBUG] Found 'Income Before Taxes' node: x0=${incomeBeforeTaxesNode.x0}, y0=${incomeBeforeTaxesNode.y0}, x1=${incomeBeforeTaxesNode.x1}, y1=${incomeBeforeTaxesNode.y1}`);
    console.log(`[Custom Alignment DEBUG] Found 'Interest Expense' node: x0=${interestExpenseNode.x0}, y0=${interestExpenseNode.y0}, x1=${interestExpenseNode.x1}, y1=${interestExpenseNode.y1}`);

    const padding = 10; // Define padding between nodes
    const originalInterestExpenseHeight = interestExpenseNode.y1 - interestExpenseNode.y0;

    // Align X coordinates
    interestExpenseNode.x0 = incomeBeforeTaxesNode.x0;
    interestExpenseNode.x1 = incomeBeforeTaxesNode.x1;

    // Position Interest Expense Y coordinates below Income Before Taxes
    interestExpenseNode.y0 = incomeBeforeTaxesNode.y1 + padding;
    interestExpenseNode.y1 = interestExpenseNode.y0 + originalInterestExpenseHeight;

    console.log(`[Custom Alignment DEBUG] Adjusted 'Interest Expense' node: x0=${interestExpenseNode.x0}, y0=${interestExpenseNode.y0}, x1=${interestExpenseNode.x1}, y1=${interestExpenseNode.y1}`);

    // Log information about the link from Operating Income to Interest Expense
    if (operatingIncomeNode) {
        const relevantLink = layoutLinks.find(l =>
            l.source === operatingIncomeNode &&
            l.target === interestExpenseNode
        );
        if (relevantLink) {
            // Log current target point of the link. assignLinkSlots will use the updated node coords.
            console.log(`[Custom Alignment Link Check] Link ${relevantLink.source.name} -> ${relevantLink.target.name}. Node target coords (pre-slot-reassignment): target.x0=${relevantLink.target.x0.toFixed(1)}, target.y0+height/2=${(relevantLink.target.y0 + (relevantLink.target.y1 - relevantLink.target.y0)/2).toFixed(1)}`);
        } else {
            console.warn(`[Custom Alignment] Could not find link from '${operatingIncomeNode.name}' to '${interestExpenseNode.name}' for logging.`);
        }
    } else {
        console.warn("[Custom Alignment] 'Operating Income' node not found for link logging.");
    }

  } else {
    if (!incomeBeforeTaxesNode) console.warn("[Custom Alignment] 'Income Before Taxes' node not found for alignment.");
    if (!interestExpenseNode) console.warn("[Custom Alignment] 'Interest' or 'Interest Expense' node not found for alignment.");
  }



    }
  };
});
