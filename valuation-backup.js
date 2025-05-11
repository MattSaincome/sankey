// valuation.js
// Widget for displaying core value-investor metrics using FMP APIs

async function renderValuationWidget(ticker) {
  const container = document.getElementById('valuation-widget');
  if (!container) return;
  container.innerHTML = '<div class="valuation-loading">Loading valuation metrics...</div>';
  
  try {
    // --- Fetch all required endpoints ---
    // Use correct FMP endpoints and field names per docs
    // Add a random query parameter to force the browser to make an actual server request
    const timestamp = Date.now();
    const endpoints = {
      ratiosTTM: `/api/fmp-proxy/data?_=${timestamp}&endpoint=ratios-ttm&symbol=${ticker}`,
      keyMetrics: `/api/fmp-proxy/data?_=${timestamp}&endpoint=key-metrics&symbol=${ticker}&period=quarter&limit=1`,
      keyMetricsTTM: `/api/fmp-proxy/data?_=${timestamp}&endpoint=key-metrics-ttm&symbol=${ticker}`,
      cashflowAnnual: `/api/fmp-proxy/data?_=${timestamp}&endpoint=cash-flow-statement&symbol=${ticker}&period=annual&limit=10`,
      balanceAnnual: `/api/fmp-proxy/data?_=${timestamp}&endpoint=balance-sheet-statement&symbol=${ticker}&period=annual&limit=10`,
      incomeAnnual: `/api/fmp-proxy/data?_=${timestamp}&endpoint=income-statement&symbol=${ticker}&period=annual&limit=11`,
      profile: `/api/fmp-proxy/data?_=${timestamp}&endpoint=profile&symbol=${ticker}`,
      dividends: `/api/fmp-proxy/data?_=${timestamp}&endpoint=historical-price-full/stock_dividend&symbol=${ticker}`,
      enterpriseValues: `/api/fmp-proxy/data?_=${timestamp}&endpoint=enterprise-values&symbol=${ticker}&limit=1`,
      companyRating: `/api/fmp-proxy/data?_=${timestamp}&endpoint=rating&symbol=${ticker}`,
      discountedCashflow: `/api/fmp-proxy/data?_=${timestamp}&endpoint=discounted-cash-flow&symbol=${ticker}`,
      dcfAdvanced: `/api/fmp-proxy/data?_=${timestamp}&endpoint=advanced/dcf&symbol=${ticker}`,
      dcfProjections: `/api/fmp-proxy/data?_=${timestamp}&endpoint=advanced/dcf-projections&symbol=${ticker}`,
      financialGrowth: `/api/fmp-proxy/data?_=${timestamp}&endpoint=financial-growth&symbol=${ticker}&limit=1`,
      earningsEstimates: `/api/fmp-proxy/data?_=${timestamp}&endpoint=analyst-estimates&symbol=${ticker}&limit=1`
    };
    const [ratiosTTM, keyMetrics, keyMetricsTTM, cashflowAnnual, balanceAnnual, incomeAnnual, profile, dividends, enterpriseValues, companyRating, discountedCashflow, dcfAdvanced, dcfProjections, financialGrowth, earningsEstimates] = await Promise.all(Object.values(endpoints).map(async (url, i) => {
      try {
        const r = await fetch(url);
        console.log(`[valuation.js] Fetch[${i}] ${url} status:`, r.status);
        const data = await r.text();
        try { 
          const parsed = JSON.parse(data);
          const endpointName = Object.keys(endpoints)[i];
          console.log(`[valuation.js] ${endpointName} data:`, parsed ? (Array.isArray(parsed) ? `Array with ${parsed.length} items` : 'Object') : 'null');
          return parsed; 
        } catch (e) { 
          console.error(`[valuation.js] JSON parse error for ${url}:`, data); 
          return null; 
        }
      } catch (err) {
        console.error(`[valuation.js] Fetch error for ${url}:`, err);
        return null;
      }
    }));
    // Log raw data for debugging
    console.log('[valuation.js] API responses summary:', {
      ratiosTTM: ratiosTTM ? (Array.isArray(ratiosTTM) ? `Array(${ratiosTTM.length})` : 'Object') : 'null',
      keyMetrics: keyMetrics ? (Array.isArray(keyMetrics) ? `Array(${keyMetrics.length})` : 'Object') : 'null',
      keyMetricsTTM: keyMetricsTTM ? (Array.isArray(keyMetricsTTM) ? `Array(${keyMetricsTTM.length})` : 'Object') : 'null',
      cashflowAnnual: cashflowAnnual ? (Array.isArray(cashflowAnnual) ? `Array(${cashflowAnnual.length})` : 'Object') : 'null',
      balanceAnnual: balanceAnnual ? (Array.isArray(balanceAnnual) ? `Array(${balanceAnnual.length})` : 'Object') : 'null',
      incomeAnnual: incomeAnnual ? (Array.isArray(incomeAnnual) ? `Array(${incomeAnnual.length})` : 'Object') : 'null',
      enterpriseValues: enterpriseValues ? (Array.isArray(enterpriseValues) ? `Array(${enterpriseValues.length})` : 'Object') : 'null',
      companyRating: companyRating ? (Array.isArray(companyRating) ? `Array(${companyRating.length})` : 'Object') : 'null',
      discountedCashflow: discountedCashflow ? (Array.isArray(discountedCashflow) ? `Array(${discountedCashflow.length})` : 'Object') : 'null',
      dcfAdvanced: dcfAdvanced ? (Array.isArray(dcfAdvanced) ? `Array(${dcfAdvanced.length})` : 'Object') : 'null',
      dcfProjections: dcfProjections ? (Array.isArray(dcfProjections) ? `Array(${dcfProjections.length})` : 'Object') : 'null',
      financialGrowth: financialGrowth ? (Array.isArray(financialGrowth) ? `Array(${financialGrowth.length})` : 'Object') : 'null',
      earningsEstimates: earningsEstimates ? (Array.isArray(earningsEstimates) ? `Array(${earningsEstimates.length})` : 'Object') : 'null',
    });
    
    // Defensive: unwrap arrays if needed (FMP often returns [{...}])
    const ratios = Array.isArray(ratiosTTM) ? ratiosTTM[0] : ratiosTTM;
    const key = Array.isArray(keyMetrics) ? keyMetrics[0] : keyMetrics;
    const keyTTM = Array.isArray(keyMetricsTTM) ? keyMetricsTTM : keyMetricsTTM;
    const ev = Array.isArray(enterpriseValues) ? enterpriseValues[0] : enterpriseValues;
    const profileObj = Array.isArray(profile) ? profile[0] : profile;
    const rating = Array.isArray(companyRating) ? companyRating[0] : companyRating;
    const dcf = Array.isArray(discountedCashflow) ? discountedCashflow[0] : discountedCashflow;
    const dcfAdv = Array.isArray(dcfAdvanced) ? dcfAdvanced[0] : dcfAdvanced;
    const dcfProj = Array.isArray(dcfProjections) ? dcfProjections : dcfProjections;
    const growth = Array.isArray(financialGrowth) ? financialGrowth[0] : financialGrowth;
    const estimates = Array.isArray(earningsEstimates) ? earningsEstimates[0] : earningsEstimates;
    // Helper for safe extraction
    function getMetric(obj, path, fallback = '--') {
      if (!obj) return fallback;
      const parts = path.split('.');
      let val = obj;
      for (const p of parts) {
        if (val && typeof val === 'object' && p in val) val = val[p];
        else return fallback;
      }
      if (val === null || val === undefined || Number.isNaN(val)) return fallback;
      if (typeof val === 'number') return Math.abs(val) > 1e9 ? (val/1e9).toFixed(2) + 'B' : val.toLocaleString(undefined, {maximumFractionDigits: 2});
      return val;
    }
    
    // Helper to fetch metric from Perplexity when not available from FMP
    async function fetchFromPerplexity(metricName, ticker) {
      try {
        console.log(`[valuation.js] Requesting Perplexity for ${metricName} of ${ticker}`);
        const response = await fetch(`/api/perplexity-financial?ticker=${ticker}&metric=${encodeURIComponent(metricName)}`);
        
        if (!response.ok) {
          console.error(`[valuation.js] Perplexity API returned status ${response.status}`);
          return null;
        }
        
        const data = await response.json();
        console.log(`[valuation.js] Perplexity API response:`, data);
        
        if (data.error) {
          console.error(`[valuation.js] Perplexity API error: ${data.error}`);
          return null;
        }
        
        // Parse the result - if there's a number in the response, extract it
        if (data.value) {
          // First try to parse as a direct number
          if (!isNaN(parseFloat(data.value))) {
            return parseFloat(data.value).toString();
          }
          
          // Otherwise try to extract a number from the text
          const numberMatch = data.value.match(/\d+(\.\d+)?/g);
          if (numberMatch && numberMatch.length > 0) {
            return numberMatch[0];
          }
          
          // If no number found, return the raw value
          return data.value;
        }
        
        return null;
      } catch (err) {
        console.error(`[valuation.js] Error fetching ${metricName} from Perplexity:`, err);
        return null;
      }
    }
    // Helper for CAGR
    function computeCAGR(start, end, years) {
      if (!start || !end || years < 1) return '--';
      if (start <= 0 || end <= 0) return '--';
      return (((Math.pow(end/start, 1/years))-1)*100).toFixed(2) + '%';
    }
    // Helper for percent
    function percent(val) {
      if (val === null || val === undefined || isNaN(val)) return '--';
      return (val*100).toFixed(2) + '%';
    }
    // --- Extract and calculate metrics ---
    // 1. Simple ratios from ratiosTTM and other sources
    console.log('[valuation.js] Raw ratios object:', ratios);
    console.log('[valuation.js] Raw keyMetricsTTM object:', keyTTM);
    console.log('[valuation.js] Raw rating object:', rating);
    console.log('[valuation.js] Raw DCF object:', dcf);
    console.log('[valuation.js] Raw DCF Advanced object:', dcfAdv);
    console.log('[valuation.js] Raw DCF Projections object:', dcfProj);
    console.log('[valuation.js] Raw growth object:', growth);
    console.log('[valuation.js] Raw estimates object:', estimates);
    
    // Try to get each metric from multiple potential sources
    let pe = getMetric(ratios, 'peRatioTTM') || getMetric(keyTTM, 'peRatioTTM');
    
    let fwdPe = getMetric(key, 'priceEarningsRatio') || 
               getMetric(key, 'peRatioForward') || 
               (estimates ? getMetric(estimates, 'priceEarningsRatio') : null) || 
               (key && key.priceEarningsToGrowthRatio && key.pegRatio ? (key.priceEarningsToGrowthRatio / key.pegRatio) : null);
    
    let pb = getMetric(ratios, 'priceToBookRatioTTM') || getMetric(keyTTM, 'pbRatioTTM');
    
    let earningsYield = getMetric(keyTTM, 'earningsYieldTTM') || 
                      getMetric(keyTTM, 'earningsYieldPercentageTTM') || 
                      (pe && pe !== '--' ? (100 / parseFloat(pe)).toFixed(2) + '%' : '--');
    
    let evEbit = getMetric(ratios, 'evToEbitTTM') || 
               getMetric(keyTTM, 'enterpriseValueOverEBITDATTM') || 
               (ev && keyTTM && keyTTM.ebitTTM ? (ev.enterpriseValue / keyTTM.ebitTTM).toFixed(2) : null);
    
    let priceFCF = getMetric(ratios, 'priceToFreeCashFlowsRatioTTM') || 
                 getMetric(keyTTM, 'pfcfRatioTTM') || 
                 getMetric(keyTTM, 'evToFreeCashFlowTTM');
    
    let fcfYield = getMetric(keyTTM, 'freeCashFlowYieldTTM') || 
                 getMetric(keyTTM, 'freeCashFlowYieldPercentageTTM') || 
                 (priceFCF && priceFCF !== '--' ? (100 / parseFloat(priceFCF)).toFixed(2) + '%' : '--');
    
    let peg = getMetric(ratios, 'pegRatioTTM') || 
            getMetric(keyTTM, 'pegRatioTTM') || 
            (estimates ? getMetric(estimates, 'pegRatio') : null);
    
    let roe = percent(getMetric(ratios, 'returnOnEquityTTM', null) || 
                    getMetric(keyTTM, 'roeTTM', null) || 
                    (rating ? getMetric(rating, 'roe', null) : null));
    
    let roic = percent(getMetric(ratios, 'returnOnCapitalEmployedTTM', null) || 
                     getMetric(keyTTM, 'roicTTM', null) || 
                     (keyTTM ? getMetric(keyTTM, 'returnOnTangibleAssetsTTM', null) : null));
    
    let profitMargin = percent(getMetric(ratios, 'netProfitMarginTTM', null) || 
                             getMetric(keyTTM, 'netIncomePerShareTTM', null) / getMetric(keyTTM, 'revenuePerShareTTM', null));
    
    let operatingMargin = percent(getMetric(ratios, 'operatingProfitMarginTTM', null) || 
                                (incomeAnnual && incomeAnnual[0] ? incomeAnnual[0].operatingIncome / incomeAnnual[0].revenue : null));
    
    let debtEquity = getMetric(ratios, 'debtEquityRatioTTM') || 
                   getMetric(keyTTM, 'debtToEquityTTM') || 
                   (balanceAnnual && balanceAnnual[0] ? (balanceAnnual[0].totalDebt / balanceAnnual[0].totalStockholdersEquity).toFixed(2) : null);
    
    let currentRatio = getMetric(ratios, 'currentRatioTTM') || 
                     getMetric(keyTTM, 'currentRatioTTM') || 
                     (balanceAnnual && balanceAnnual[0] ? (balanceAnnual[0].totalCurrentAssets / balanceAnnual[0].totalCurrentLiabilities).toFixed(2) : null);
    
    let interestCoverage = getMetric(ratios, 'interestCoverageTTM') || 
                         getMetric(keyTTM, 'interestCoverageTTM') || 
                         (incomeAnnual && incomeAnnual[0] && incomeAnnual[0].ebit && incomeAnnual[0].interestExpense ? (incomeAnnual[0].ebit / incomeAnnual[0].interestExpense).toFixed(2) : null);
    
    // Log extracted values for debugging
    console.log('[valuation.js] Extracted metrics:', {
      pe, fwdPe, pb, earningsYield, evEbit, priceFCF, fcfYield, peg, roe, roic, profitMargin, operatingMargin, debtEquity, currentRatio, interestCoverage
    });
    
    // Comprehensive fetch of all missing metrics
    const fetchAllMissingMetrics = async () => {
      console.log('[valuation.js] Fetching all missing metrics from Perplexity for ' + ticker);
      
      // Define all metrics that might need Perplexity fallback, with proper query formatting
      const metricDefinitions = {
        earningsYield: {
          value: earningsYield,
          query: `earnings yield percentage for ${ticker} stock`,
          formatter: val => val + '%'
        },
        evEbit: {
          value: evEbit,
          query: `enterprise value to EBIT ratio for ${ticker} stock`,
          formatter: val => val
        },
        fcfYield: {
          value: fcfYield,
          query: `free cash flow yield percentage for ${ticker} stock`,
          formatter: val => val + '%'
        },
        fwdPe: {
          value: fwdPe,
          query: `forward price to earnings ratio for ${ticker} stock`,
          formatter: val => val
        },
        currentRatio: {
          value: currentRatio,
          query: `current ratio for ${ticker} stock`,
          formatter: val => val
        },
        interestCoverage: {
          value: interestCoverage,
          query: `interest coverage ratio for ${ticker} stock`,
          formatter: val => val
        },
        peg: {
          value: peg,
          query: `PEG ratio for ${ticker} stock`,
          formatter: val => val
        },
        roe: {
          value: roe,
          query: `return on equity percentage for ${ticker} stock`,
          formatter: val => val + '%'
        },
        roic: {
          value: roic,
          query: `return on invested capital percentage for ${ticker} stock`,
          formatter: val => val + '%'
        },
        profitMargin: {
          value: profitMargin,
          query: `profit margin percentage for ${ticker} stock`,
          formatter: val => val + '%'
        },
        operatingMargin: {
          value: operatingMargin, 
          query: `operating margin percentage for ${ticker} stock`,
          formatter: val => val + '%'
        }
      };
      
      // Create array of metrics to fetch in parallel (only missing ones)
      const metricsToFetch = [];
      
      // Check which metrics are missing
      for (const [name, def] of Object.entries(metricDefinitions)) {
        if (def.value === '--') {
          metricsToFetch.push({
            name: name,
            query: def.query,
            formatter: def.formatter
          });
          console.log(`[valuation.js] Will fetch missing metric: ${name}`);
        }
      }
      
      // Results object to track updates
      const updatedMetrics = {};
      
      // Fetch all missing metrics in batches to avoid overwhelming the API
      for (let i = 0; i < metricsToFetch.length; i += 3) { // Process in batches of 3
        const batch = metricsToFetch.slice(i, i + 3);
        console.log(`[valuation.js] Processing batch ${i/3 + 1}:`, batch.map(m => m.name));
        
        const batchResults = await Promise.all(batch.map(async metric => {
          try {
            const value = await fetchFromPerplexity(metric.query, ticker);
            console.log(`[valuation.js] Perplexity returned for ${metric.name}: ${value}`);
            return { 
              name: metric.name, 
              value: value ? metric.formatter(value) : '--'
            };
          } catch (err) {
            console.error(`[valuation.js] Error fetching ${metric.name}:`, err);
            return { name: metric.name, value: '--' };
          }
        }));
        
        // Update metrics with the fetched values
        batchResults.forEach(result => {
          if (result.value !== '--') {
            updatedMetrics[result.name] = result.value;
          }
        });
        
        // Small delay between batches to avoid rate limits
        if (i + 3 < metricsToFetch.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Update all the original variables based on fetched results
      if (updatedMetrics.earningsYield) earningsYield = updatedMetrics.earningsYield;
      if (updatedMetrics.evEbit) evEbit = updatedMetrics.evEbit;
      if (updatedMetrics.fcfYield) fcfYield = updatedMetrics.fcfYield;
      if (updatedMetrics.fwdPe) fwdPe = updatedMetrics.fwdPe;
      if (updatedMetrics.currentRatio) currentRatio = updatedMetrics.currentRatio;
      if (updatedMetrics.interestCoverage) interestCoverage = updatedMetrics.interestCoverage;
      if (updatedMetrics.peg) peg = updatedMetrics.peg;
      if (updatedMetrics.roe) roe = updatedMetrics.roe;
      if (updatedMetrics.roic) roic = updatedMetrics.roic;
      if (updatedMetrics.profitMargin) profitMargin = updatedMetrics.profitMargin;
      if (updatedMetrics.operatingMargin) operatingMargin = updatedMetrics.operatingMargin;
      
      console.log('[valuation.js] Metrics updated with Perplexity data:', updatedMetrics);
      return updatedMetrics;
    };
    
    // Execute the fetch with a timeout to ensure it completes
    const perplexityMetrics = await Promise.race([
      fetchAllMissingMetrics(),
      new Promise(resolve => setTimeout(() => {
        console.log('[valuation.js] Timeout waiting for Perplexity, continuing with available data');
        resolve({});
      }, 8000)) // Wait up to 8 seconds for Perplexity calls before giving up
    ]);
    
    const dividendYield = percent(getMetric(ratios, 'dividendYieldTTM', null) || 
                               getMetric(keyTTM, 'dividendYieldTTM', null) || 
                               getMetric(keyTTM, 'dividendYieldPercentageTTM', null) / 100 || 
                               (profileObj ? getMetric(profileObj, 'lastDiv', null) / getMetric(profileObj, 'price', null) : null));
    // 2. Free Cash Flow (absolute, trailing)
    let fcfAbs = '--';
    if (cashflowAnnual && Array.isArray(cashflowAnnual) && cashflowAnnual.length > 0) {
      const latest = cashflowAnnual[0];
      fcfAbs = getMetric(latest, 'freeCashFlow');
    }
    // 3. EPS CAGR (5yr), Revenue CAGR (10yr)
    let epsCAGR = '--', revCAGR = '--';
    if (incomeAnnual && Array.isArray(incomeAnnual)) {
      // EPS CAGR (5yr):
      if (incomeAnnual.length >= 6) {
        const start = incomeAnnual[5]?.eps || incomeAnnual[5]?.epsdiluted || null;
        const end = incomeAnnual[0]?.eps || incomeAnnual[0]?.epsdiluted || null;
        epsCAGR = computeCAGR(start, end, 5);
      }
      // Revenue CAGR (5yr):
      if (incomeAnnual.length >= 6) {
        const start = incomeAnnual[5]?.revenue || null;
        const end = incomeAnnual[0]?.revenue || null;
        revCAGR = computeCAGR(start, end, 5);
      }
    }
    // 4. Retained Earnings Growth (10yr)
    let retainedEarningsGrowth = '--';
    if (balanceAnnual && Array.isArray(balanceAnnual) && balanceAnnual.length >= 11) {
      const start = balanceAnnual[10]?.retainedEarnings || null;
      const end = balanceAnnual[0]?.retainedEarnings || null;
      retainedEarningsGrowth = computeCAGR(start, end, 10);
    }
    // 5. Consecutive Profitable Years
    let profitableYears = '--';
    if (incomeAnnual && Array.isArray(incomeAnnual)) {
      let count = 0;
      for (let i = 0; i < incomeAnnual.length; ++i) {
        if ((incomeAnnual[i]?.netIncome || 0) > 0) count++;
        else break;
      }
      profitableYears = count;
    }
    // 6. Dividend Growth (5yr CAGR)
    let dividendGrowth = '--';
    if (dividends && dividends.historical && dividends.historical.length >= 6) {
      const start = dividends.historical[5]?.dividend || null;
      const end = dividends.historical[0]?.dividend || null;
      dividendGrowth = computeCAGR(start, end, 5);
    }
    // --- Render UI ---
    // Calculate DCF metrics
    let dcfValue = '--';
    let dcfMargin = '--';
    let dcfGrowthRate = '--';
    let dcfWACC = '--';
    let dcfTerminalValue = '--';
    
    if (dcf) {
      dcfValue = getMetric(dcf, 'dcf');
      const stockPrice = getMetric(profileObj, 'price', null) || getMetric(ev, 'stockPrice', null);
      if (dcfValue !== '--' && stockPrice && stockPrice !== '--') {
        const dcfVal = parseFloat(dcfValue.replace(/[^0-9.-]+/g, ''));
        const priceVal = parseFloat(stockPrice.toString().replace(/[^0-9.-]+/g, ''));
        if (!isNaN(dcfVal) && !isNaN(priceVal) && priceVal > 0) {
          dcfMargin = ((dcfVal - priceVal) / priceVal * 100).toFixed(2) + '%';
        }
      }
    }
    
    if (dcfAdv) {
      dcfWACC = dcfAdv.wacc ? (dcfAdv.wacc * 100).toFixed(2) + '%' : dcfWACC;
      dcfGrowthRate = dcfAdv.growthRate ? (dcfAdv.growthRate * 100).toFixed(2) + '%' : dcfGrowthRate;
      dcfTerminalValue = dcfAdv.terminalValue ? dcfAdv.terminalValue.toLocaleString(undefined, {maximumFractionDigits: 2}) : dcfTerminalValue;
    }

    // If any DCF metrics are still missing, try to get them from Perplexity
    if (dcfWACC === '--') {
      const perplexityWACC = await fetchFromPerplexity(`weighted average cost of capital (WACC) percentage for ${ticker} stock`, ticker);
      if (perplexityWACC) dcfWACC = perplexityWACC + '%';
    }
    
    if (dcfGrowthRate === '--') {
      const perplexityGrowth = await fetchFromPerplexity(`long-term growth rate percentage for ${ticker} stock DCF model`, ticker);
      if (perplexityGrowth) dcfGrowthRate = perplexityGrowth + '%';
    }
    
    // Get current stock price for comparison with DCF
    const stockPrice = getMetric(profileObj, 'price', null) || getMetric(ev, 'stockPrice', null) || '--';
    
    // Fetch peer companies - we'll first try the normal API, then fall back to hardcoded similar companies if needed
    console.log(`[valuation.js] Fetching peer companies for ${ticker}`);
    const peerResponse = await fetch(`/api/stock-peers?symbol=${ticker}`).catch(err => {
      console.error(`[valuation.js] Error fetching peer companies:`, err);
      return { ok: false };
    });
    
    // Initialize peer averages object
    let peerAverages = {};
    let peerList = [];
    
    // Hardcoded peer companies by sector - will only use these if API fails
    const fallbackPeers = {
      'technology': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'CSCO', 'ORCL', 'IBM', 'INTC'],
      'financial': ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'AXP', 'BLK', 'COF', 'USB'],
      'healthcare': ['JNJ', 'PFE', 'MRK', 'ABBV', 'ABT', 'UNH', 'BMY', 'TMO', 'AMGN', 'MDT'],
      'consumer': ['PG', 'KO', 'PEP', 'WMT', 'MCD', 'SBUX', 'NKE', 'HD', 'TGT', 'COST'],
      'industrial': ['GE', 'BA', 'CAT', 'MMM', 'HON', 'UPS', 'LMT', 'RTX', 'DE', 'EMR'],
      'energy': ['XOM', 'CVX', 'COP', 'EOG', 'SLB', 'PSX', 'VLO', 'OXY', 'MPC', 'KMI'],
      'utilities': ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'XEL', 'ED', 'WEC'],
      'telecom': ['T', 'VZ', 'TMUS', 'CMCSA', 'CHTR', 'NFLX', 'DIS', 'DISH', 'LUMN', 'IPG'],
      'materials': ['LIN', 'APD', 'ECL', 'SHW', 'DD', 'NEM', 'FCX', 'DOW', 'NUE', 'VMC'],
      'real_estate': ['AMT', 'PLD', 'CCI', 'EQIX', 'PSA', 'O', 'DLR', 'WELL', 'SPG', 'AVB']
    };
    
    // Fetch company profile to get the sector if we need fallback peers
    let companySector = 'technology';  // Default fallback sector
    if (profileObj && profileObj.sector) {
      companySector = profileObj.sector.toLowerCase();
      // Map sector name to our fallback peer categories
      if (companySector.includes('tech')) companySector = 'technology';
      else if (companySector.includes('financ')) companySector = 'financial';
      else if (companySector.includes('health')) companySector = 'healthcare';
      else if (companySector.includes('consumer')) companySector = 'consumer';
      else if (companySector.includes('industr')) companySector = 'industrial';
      else if (companySector.includes('energy')) companySector = 'energy';
      else if (companySector.includes('util')) companySector = 'utilities';
      else if (companySector.includes('tele') || companySector.includes('comm')) companySector = 'telecom';
      else if (companySector.includes('mater')) companySector = 'materials';
      else if (companySector.includes('real') || companySector.includes('estate')) companySector = 'real_estate';
    }
    
    if (peerResponse.ok) {
      const peerData = await peerResponse.json();
      if (peerData && peerData[0] && peerData[0].peersList && peerData[0].peersList.length > 0) {
        peerList = peerData[0].peersList.slice(0, 10); // Limit to top 10 peers
        console.log(`[valuation.js] Found ${peerList.length} peers for ${ticker} from API:`, peerList);
      }
    }
    
    // Fall back to using hardcoded peer list if we couldn't get peers from API
    if (peerList.length === 0) {
      // Remove the current ticker from the fallback list if it's there
      peerList = fallbackPeers[companySector].filter(peer => peer !== ticker);
      console.log(`[valuation.js] Using fallback peers for ${ticker} (${companySector}):`, peerList);
    }
    
    if (peerList.length > 0) {
      console.log(`[valuation.js] Processing ${peerList.length} peers for ${ticker}:`, peerList);
      
      // Map FMP API metric names to our internal metric names
        const metricMapping = {
          'pe': 'pe',
          'priceEarningsRatio': 'pe',
          'priceToBookRatio': 'pb',
          'pb': 'pb',
          'evToEbitda': 'evEbit',
          'earningsYield': 'earningsYield',
          'priceToCashFlowsRatio': 'priceFCF',
          'freeCashFlowYield': 'fcfYield',
          'pegRatio': 'peg',
          'returnOnEquityTTM': 'roe',
          'roe': 'roe',
          'returnOnCapitalEmployed': 'roic',
          'roic': 'roic',
          'netProfitMargin': 'profitMargin',
          'operatingProfitMarginTTM': 'operatingMargin',
          'debtToEquityTTM': 'debtEquity',
          'debtToEquity': 'debtEquity',
          'currentRatioTTM': 'currentRatio',
          'currentRatio': 'currentRatio',
          'interestCoverageTTM': 'interestCoverage',
          'interestCoverage': 'interestCoverage',
          'dividendYield': 'dividendYield',
          'dividendYieldTTM': 'dividendYield'
        };
        
        // Use a more comprehensive list of metrics to fetch from peer companies
        // Map FMP API metric field names to our metric names for better coverage
        const metricsToFetch = [
          // P/E ratio (multiple sources) 
          { fmpField: 'priceEarningsRatio', internalMetric: 'pe' },
          { fmpField: 'peRatio', internalMetric: 'pe' },
          { fmpField: 'peRatioTTM', internalMetric: 'pe' },
          
          // P/B ratio (multiple sources)
          { fmpField: 'priceToBookRatio', internalMetric: 'pb' },
          { fmpField: 'pbRatio', internalMetric: 'pb' },
          
          // EV/EBITDA
          { fmpField: 'evToEbitda', internalMetric: 'evEbit' },
          { fmpField: 'enterpriseValueOverEBITDA', internalMetric: 'evEbit' },
          
          // Earnings Yield
          { fmpField: 'earningsYield', internalMetric: 'earningsYield' },
          
          // Price to Cash Flow
          { fmpField: 'priceCashFlowRatio', internalMetric: 'priceFCF' },
          { fmpField: 'priceToOperatingCashFlowsRatio', internalMetric: 'priceFCF' },
          { fmpField: 'priceToCashFlowsRatio', internalMetric: 'priceFCF' },
          
          // FCF Yield
          { fmpField: 'freeCashFlowYield', internalMetric: 'fcfYield' },
          
          // PEG Ratio
          { fmpField: 'pegRatio', internalMetric: 'peg' },
          { fmpField: 'pegRatioTTM', internalMetric: 'peg' },
          
          // ROE
          { fmpField: 'returnOnEquity', internalMetric: 'roe' },
          { fmpField: 'returnOnEquityTTM', internalMetric: 'roe' },
          { fmpField: 'roe', internalMetric: 'roe' },
          
          // ROIC 
          { fmpField: 'returnOnCapitalEmployed', internalMetric: 'roic' },
          { fmpField: 'roic', internalMetric: 'roic' },
          
          // Profit Margin
          { fmpField: 'netProfitMargin', internalMetric: 'profitMargin' },
          { fmpField: 'profitMargin', internalMetric: 'profitMargin' },
          
          // Operating Margin
          { fmpField: 'operatingProfitMargin', internalMetric: 'operatingMargin' },
          { fmpField: 'operatingProfitMarginTTM', internalMetric: 'operatingMargin' },
          { fmpField: 'operatingMargin', internalMetric: 'operatingMargin' },
          
          // Debt to Equity
          { fmpField: 'debtToEquity', internalMetric: 'debtEquity' },
          { fmpField: 'debtToEquityTTM', internalMetric: 'debtEquity' },
          
          // Current Ratio
          { fmpField: 'currentRatio', internalMetric: 'currentRatio' },
          { fmpField: 'currentRatioTTM', internalMetric: 'currentRatio' },
          
          // Interest Coverage
          { fmpField: 'interestCoverage', internalMetric: 'interestCoverage' },
          { fmpField: 'interestCoverageTTM', internalMetric: 'interestCoverage' },
          
          // Dividend Yield
          { fmpField: 'dividendYield', internalMetric: 'dividendYield' },
          { fmpField: 'dividendYieldTTM', internalMetric: 'dividendYield' },
        ];
        
        // Add fallback estimates for common metrics if we can't get them from the API
        // These are industry average ranges that provide reasonable fallback values
        const fallbackMetricEstimates = {
          pe: {
            technology: 25.0,
            financial: 12.5,
            healthcare: 18.0,
            consumer: 22.0,
            industrial: 17.0,
            energy: 14.0,
            utilities: 16.0,
            telecom: 19.0,
            materials: 15.0,
            real_estate: 18.5
          },
          pb: {
            technology: 5.5,
            financial: 1.2,
            healthcare: 4.0,
            consumer: 6.5,
            industrial: 3.0,
            energy: 1.8,
            utilities: 1.7,
            telecom: 2.2,
            materials: 2.5,
            real_estate: 2.0
          },
          evEbit: {
            technology: 16.0,
            financial: 9.0,
            healthcare: 14.0,
            consumer: 15.0,
            industrial: 12.0,
            energy: 8.0,
            utilities: 11.0,
            telecom: 13.0,
            materials: 10.0,
            real_estate: 16.0
          },
          roe: {
            technology: 26.0,
            financial: 10.0,
            healthcare: 18.0,
            consumer: 22.0,
            industrial: 15.0,
            energy: 12.0,
            utilities: 9.0,
            telecom: 14.0,
            materials: 13.0,
            real_estate: 8.0
          },
          profitMargin: {
            technology: 20.0,
            financial: 22.0,
            healthcare: 15.0,
            consumer: 10.0,
            industrial: 8.0,
            energy: 9.0,
            utilities: 11.0,
            telecom: 14.0,
            materials: 12.0,
            real_estate: 25.0
          },
          operatingMargin: {
            technology: 25.0,
            financial: 30.0,
            healthcare: 20.0,
            consumer: 15.0,
            industrial: 12.0,
            energy: 15.0,
            utilities: 18.0,
            telecom: 20.0,
            materials: 18.0,
            real_estate: 35.0
          },
          debtEquity: {
            technology: 0.3,
            financial: 2.5,
            healthcare: 0.8,
            consumer: 1.2,
            industrial: 1.0,
            energy: 1.4,
            utilities: 1.8,
            telecom: 1.5,
            materials: 0.9,
            real_estate: 1.2
          },
          dividendYield: {
            technology: 1.0,
            financial: 3.0,
            healthcare: 2.0,
            consumer: 2.5,
            industrial: 2.2,
            energy: 4.0,
            utilities: 3.5,
            telecom: 4.5,
            materials: 2.0,
            real_estate: 3.8
          }
        };
        
        // Try each endpoint in sequence until we find data
        const metricPromises = metricsToFetch.map(metric => 
          fetchPeerAverage(metric.fmpField, peerList, metric.internalMetric));
        
        const results = await Promise.all(metricPromises);
        
        // Process results - use the explicit internalMetric mapping from our function calls
        results.forEach(result => {
          if (result && result.average !== null) {
            const internalMetricName = result.internalMetric;
            
            // Only update if this is a better value than we already have (not null/undefined)
            if (internalMetricName && 
                (!peerAverages[internalMetricName] || peerAverages[internalMetricName] === '--')) {
              // Format the values the same way as the main metrics
              if (internalMetricName === 'dividendYield' || 
                  internalMetricName === 'earningsYield' || 
                  internalMetricName === 'fcfYield' || 
                  internalMetricName === 'roe' || 
                  internalMetricName === 'roic' || 
                  internalMetricName === 'profitMargin' || 
                  internalMetricName === 'operatingMargin') {
                peerAverages[internalMetricName] = percent(result.average);
              } else {
                peerAverages[internalMetricName] = result.average.toFixed(2);
              }
              console.log(`[valuation.js] Updated peer average for ${internalMetricName}: ${peerAverages[internalMetricName]}`);
            }
          }
        });
        
        console.log(`[valuation.js] Peer averages from API:`, peerAverages);
        
        // Apply fallback estimates for any metrics that are still missing
        Object.keys(fallbackMetricEstimates).forEach(metricName => {
          if (!peerAverages[metricName] || peerAverages[metricName] === '--') {
            // Use industry average as fallback
            if (fallbackMetricEstimates[metricName][companySector]) {
              const fallbackValue = fallbackMetricEstimates[metricName][companySector];
              
              // Format percentage values appropriately
              if (['roe', 'profitMargin', 'operatingMargin', 'dividendYield'].includes(metricName)) {
                peerAverages[metricName] = percent(fallbackValue / 100);
              } else {
                peerAverages[metricName] = fallbackValue.toFixed(2);
              }
              
              console.log(`[valuation.js] Using industry fallback for ${metricName}: ${peerAverages[metricName]}`);
            }
          }
        });
        
        console.log(`[valuation.js] Final peer averages with fallbacks:`, peerAverages);
      } else {
        console.log(`[valuation.js] No peers found for ${ticker}`);
        
        // Use industry averages directly since we have no peers
        Object.keys(fallbackMetricEstimates).forEach(metricName => {
          if (fallbackMetricEstimates[metricName][companySector]) {
            const fallbackValue = fallbackMetricEstimates[metricName][companySector];
            
            // Format percentage values appropriately
            if (['roe', 'profitMargin', 'operatingMargin', 'dividendYield'].includes(metricName)) {
              peerAverages[metricName] = percent(fallbackValue / 100);
            } else {
              peerAverages[metricName] = fallbackValue.toFixed(2);
            }
            
            console.log(`[valuation.js] Using industry average for ${metricName}: ${peerAverages[metricName]}`);
          }
        });
      }
    }
    
    // Define helper function to fetch peer average for a specific metric
    const fetchPeerAverage = async (metricName, peerList, internalMetricName) => {
      if (!peerList || peerList.length === 0) return null;
      
      try {
        const symbols = peerList.join(',');
        const response = await fetch(`/api/peer-metrics?symbols=${symbols}&metric=${metricName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch peer metrics for ${metricName}`);
        }
        
        const data = await response.json();
        console.log(`[valuation.js] Peer average for ${metricName} (maps to ${internalMetricName}):`, data.average);
        
        return {
          metric: metricName,
          internalMetric: internalMetricName || metricName,
          average: data.average,
          values: data.values
        };
      } catch (err) {
        console.error(`[valuation.js] Error fetching peer average for ${metricName}:`, err);
        return {
          metric: metricName,
          internalMetric: internalMetricName || metricName,
          average: null,
          values: {}
        };
      }
    };
    
    const metrics = [
      { label: 'P/E (TTM)', value: pe, peerAvg: peerAverages.pe || '--' },
      { label: 'Forward P/E', value: fwdPe, peerAvg: '--' }, // Not typically available in batch
      { label: 'P/B', value: pb, peerAvg: peerAverages.pb || '--' },
      { label: 'Earnings Yield', value: earningsYield, peerAvg: peerAverages.earningsYield || '--' },
      { label: 'EV/EBIT', value: evEbit, peerAvg: peerAverages.evEbit || '--' },
      { label: 'Price/FCF', value: priceFCF, peerAvg: peerAverages.priceFCF || '--' },
      { label: 'FCF Yield', value: fcfYield, peerAvg: peerAverages.fcfYield || '--' },
      { label: 'PEG Ratio', value: peg, peerAvg: peerAverages.peg || '--' },
      { label: 'ROE', value: roe, peerAvg: peerAverages.roe || '--' },
      { label: 'ROIC', value: roic, peerAvg: peerAverages.roic || '--' },
      { label: 'Profit Margin', value: profitMargin, peerAvg: peerAverages.profitMargin || '--' },
      { label: 'Operating Margin', value: operatingMargin, peerAvg: peerAverages.operatingMargin || '--' },
      { label: 'Debt/Equity', value: debtEquity, peerAvg: peerAverages.debtEquity || '--' },
      { label: 'Current Ratio (Assets/Liabilities)', value: currentRatio, peerAvg: peerAverages.currentRatio || '--' },
      { label: 'Interest Coverage (EBIT/Interest)', value: interestCoverage, peerAvg: peerAverages.interestCoverage || '--' },
      { label: 'Dividend Yield', value: dividendYield, peerAvg: peerAverages.dividendYield || '--' },
      { label: 'FCF (abs)', value: fcfAbs, peerAvg: '--' }, // Absolute values not comparable
      { label: 'EPS CAGR (5yr)', value: epsCAGR, peerAvg: '--' }, // Requires historical data
      { label: 'Revenue CAGR (5yr)', value: revCAGR, peerAvg: '--' }, // Requires historical data
      { label: 'Retained Earnings Growth (10yr)', value: retainedEarningsGrowth, peerAvg: '--' }, // Requires historical data
      { label: 'Consecutive Profitable Years', value: profitableYears, peerAvg: '--' }, // Requires historical data
      { label: 'Dividend Growth (5yr)', value: dividendGrowth, peerAvg: '--' }, // Requires historical data
      { label: 'Current Stock Price', value: stockPrice, peerAvg: '--' }, // Not comparable directly
      { label: 'DCF Intrinsic Value', value: dcfValue, peerAvg: '--' }, // Not comparable directly
      { label: 'DCF Margin of Safety', value: dcfMargin, peerAvg: '--' }, // Not comparable directly
      { label: 'WACC', value: dcfWACC, peerAvg: '--' }, // May be available but requires separate calls
      { label: 'Long-term Growth Rate', value: dcfGrowthRate, peerAvg: '--' }, // May be available but requires separate calls
    ];

    // Define explanations for each metric
    const explanations = {
      "P/E (TTM)": "Price-to-Earnings ratio reflects how much investors are willing to pay for each dollar of earnings. Lower values may indicate undervaluation.",
      "Forward P/E": "Price relative to expected future earnings. Useful for companies with changing or cyclical earnings.",
      "P/B": "Price-to-Book ratio compares market price to book value. Values under 1.0 may indicate undervaluation.",
      "Earnings Yield": "Inverse of P/E ratio, shows earnings generated relative to stock price. Higher values are typically better.",
      "EV/EBIT": "Enterprise Value to Earnings Before Interest and Taxes. A capital structure-neutral valuation multiple favored by value investors.",
      "Price/FCF": "Price to Free Cash Flow indicates how expensive a stock is relative to its free cash flow generation.",
      "FCF Yield": "Free Cash Flow relative to market cap. Higher values may indicate better value.",
      "PEG Ratio": "P/E ratio divided by growth rate. Values under 1.0 may indicate undervaluation relative to growth.",
      "ROE": "Return on Equity measures profitability relative to shareholder equity. Higher values indicate efficient use of capital.",
      "ROIC": "Return on Invested Capital shows how efficiently a company generates profits from all invested capital.",
      "Profit Margin": "Net income as a percentage of revenue. Higher margins indicate stronger pricing power and cost control.",
      "Operating Margin": "Operating profit as a percentage of revenue. Shows profitability from core business operations.",
      "Debt/Equity": "Total debt relative to shareholders' equity. Lower values indicate less financial leverage and risk.",
      "Current Ratio (Assets/Liabilities)": "Current assets divided by current liabilities. Values above 1.0 indicate ability to cover short-term obligations.",
      "Interest Coverage (EBIT/Interest)": "How many times a company can cover its interest payments with earnings. Higher is better.",
      "Dividend Yield": "Annual dividend payments as a percentage of stock price. Higher yields provide more current income.",
      "FCF (abs)": "Absolute Free Cash Flow shows cash generated after capital expenditures. Higher values indicate stronger cash generation.",
      "EPS CAGR (5yr)": "Compound Annual Growth Rate of Earnings Per Share over 5 years. Shows earnings growth trajectory.",
      "Revenue CAGR (5yr)": "Compound Annual Growth Rate of Revenue over 5 years. Shows top-line growth trajectory.",
      "Retained Earnings Growth (10yr)": "Growth rate of earnings reinvested in the business. Shows internal capital generation.",
      "Consecutive Profitable Years": "Number of consecutive years with positive earnings. Indicates business stability.",
      "Dividend Growth (5yr)": "Annual growth rate of dividends over 5 years. Shows management's commitment to returning capital.",
      "Current Stock Price": "Current market price per share. The basis for most valuation metrics.",
      "DCF Intrinsic Value": "Discounted Cash Flow valuation estimates the fair value based on projected future cash flows.",
      "DCF Margin of Safety": "Percentage difference between DCF value and current price. Positive values suggest potential undervaluation.",
      "WACC": "Weighted Average Cost of Capital represents the minimum return needed to satisfy all capital providers.",
      "Long-term Growth Rate": "Estimated sustainable growth rate used in long-term projections for DCF analysis."
    };
    
    // Create toggle switch HTML
    const toggleSwitch = `
      <div class="explainer-switch">
        <label class="switch">
          <input type="checkbox" id="explainer-toggle">
          <span class="slider round"></span>
        </label>
        <span class="switch-label">Explainers</span>
      </div>
    `;
    
    // Determine if we have any peer data to display
    const hasPeerData = peerList && peerList.length > 0 && Object.keys(peerAverages).length > 0;
    
    // Render metrics as grid with peer averages and Perplexity data indicators
    container.innerHTML = `
      <div class="valuation-header">
        <div class="valuation-title">Valuation & Quality Metrics</div>
        ${toggleSwitch}
      </div>
      
      <div class="valuation-table-header">
        <div class="header-metric">Metric</div>
        <div class="header-company">${ticker}</div>
        ${hasPeerData ? `<div class="header-peers">Peer Avg. <span class="peers-count">(${peerList.length})</span></div>` : ''}
      </div>
      
      <div class="valuation-metrics-grid ${hasPeerData ? 'with-peers' : ''}">
        ${metrics.map(m => {
          const isPerplex = perplexityMetrics && 
            (m.label === 'Earnings Yield' && perplexityMetrics.earningsYield !== '--' || 
             m.label === 'EV/EBIT' && perplexityMetrics.evEbit !== '--' ||
             m.label === 'FCF Yield' && perplexityMetrics.fcfYield !== '--' ||
             m.label === 'Forward P/E' && perplexityMetrics.fwdPe !== '--');
          
          const explanation = explanations[m.label] ? 
            `<div class="metric-explanation">${explanations[m.label]}</div>` : '';
          
          // Add visual indicators for comparison with peers
          let comparisonIndicator = '';
          if (hasPeerData && m.peerAvg !== '--' && m.value !== '--') {
            // For metrics where lower is better
            if (['P/E (TTM)', 'Forward P/E', 'P/B', 'EV/EBIT', 'Price/FCF', 'PEG Ratio', 'Debt/Equity'].includes(m.label)) {
              if (parseFloat(m.value) < parseFloat(m.peerAvg)) {
                comparisonIndicator = '<span class="better-than-peers">✓</span>';
              }
            } 
            // For metrics where higher is better
            else if (['Earnings Yield', 'FCF Yield', 'ROE', 'ROIC', 'Profit Margin', 'Operating Margin', 
                      'Current Ratio (Assets/Liabilities)', 'Interest Coverage (EBIT/Interest)', 'Dividend Yield'].includes(m.label)) {
              if (parseFloat(m.value) > parseFloat(m.peerAvg)) {
                comparisonIndicator = '<span class="better-than-peers">✓</span>';
              }
            }
          }
          
          return `
          <div class="valuation-metric-label">${m.label}${isPerplex ? ' <span class="perplexity-source" title="Data from Perplexity AI">*</span>' : ''}</div>
          <div class="valuation-metric-value">${m.value}${comparisonIndicator}</div>
          ${hasPeerData ? `<div class="valuation-peer-value">${m.peerAvg}</div>` : ''}
          ${explanation}
          `;
        }).join('')}
      </div>
      
      <div class="valuation-footer">
        * Data sourced from Perplexity AI when not available from financial APIs
        ${hasPeerData ? '<br>✓ Indicates metrics where this company outperforms its peers' : ''}
      </div>
    `;
    
    // Add CSS for Perplexity indicator, peer comparisons, and explainer toggle
    const style = document.createElement('style');
    style.textContent = `
      .valuation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      .valuation-title {
        font-size: 18px;
        font-weight: bold;
      }
      
      /* Table header styles */
      .valuation-table-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px 20px;
        margin-bottom: 10px;
        font-weight: bold;
        border-bottom: 2px solid #ddd;
        padding-bottom: 8px;
      }
      .with-peers {
        grid-template-columns: 1fr 1fr 1fr !important;
      }
      .valuation-table-header.with-peers {
        grid-template-columns: 1fr 1fr 1fr !important;
      }
      .header-metric {
        font-weight: 600;
        color: #333;
      }
      .header-company {
        font-weight: 600;
        text-align: right;
        color: #333;
      }
      .header-peers {
        font-weight: 600;
        text-align: right;
        color: #333;
      }
      .peers-count {
        font-size: 12px;
        color: #666;
      }
      
      /* Metrics grid styles */
      .valuation-metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 20px;
      }
      .valuation-metric-label {
        font-weight: 500;
        color: #444;
      }
      .valuation-metric-value {
        font-weight: 600;
        text-align: right;
      }
      .valuation-peer-value {
        font-weight: 600;
        text-align: right;
        color: #666;
      }
      .perplexity-source {
        color: #3182ce;
        font-size: 12px;
        cursor: help;
      }
      .better-than-peers {
        color: #38a169;
        margin-left: 5px;
        font-weight: bold;
      }
      .valuation-footer {
        margin-top: 16px;
        font-size: 12px;
        color: #666;
        line-height: 1.5;
      }
      
      /* Toggle switch styles */
      .explainer-switch {
        display: flex;
        align-items: center;
      }
      .switch-label {
        margin-left: 8px;
        font-size: 14px;
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
      }
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
      }
      input:checked + .slider {
        background-color: #3182ce;
      }
      input:checked + .slider:before {
        transform: translateX(20px);
      }
      .slider.round {
        border-radius: 34px;
      }
      .slider.round:before {
        border-radius: 50%;
      }
      
      /* Initially hide explanations */
      .metric-explanation {
        display: none;
        grid-column: span 3;
        font-size: 13px;
        color: #666;
        padding: 4px 0 8px 0;
        border-bottom: 1px dashed #eee;
        margin-bottom: 4px;
      }
      /* Adjust explanation span when no peer data */
      .valuation-metrics-grid:not(.with-peers) .metric-explanation {
        grid-column: span 2;
      }
    `;
    document.head.appendChild(style);
    
    // Add toggle functionality
    setTimeout(() => {
      const toggle = document.getElementById('explainer-toggle');
      if (toggle) {
        toggle.addEventListener('change', function() {
          const explanations = document.querySelectorAll('.metric-explanation');
          explanations.forEach(exp => {
            exp.style.display = this.checked ? 'block' : 'none';
          });
          
          // Adjust grid template when explanations are shown
          const grid = document.querySelector('.valuation-metrics-grid');
          if (grid) {
            grid.style.gridTemplateColumns = this.checked ? '1fr 1fr' : '1fr 1fr';
          }
        });
      }
    }, 100);
  } catch (err) {
    container.innerHTML = '<div class="valuation-error">Failed to load valuation metrics.</div>';
  }
}

window.renderValuationWidget = renderValuationWidget;
