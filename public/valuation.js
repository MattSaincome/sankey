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
    async function fetchFromPerplexity(metricNameOrQuery) { // Renamed and only one param now
      try {
        // The metricNameOrQuery now contains the full query string including ticker/company name
        console.log(`[valuation.js] Requesting Perplexity for: ${metricNameOrQuery}`);
        const response = await fetch(`/api/perplexity-financial?metric=${encodeURIComponent(metricNameOrQuery)}`); // Removed ticker from here
        
        if (!response.ok) {
          console.error(`[valuation.js] Perplexity API returned status ${response.status} for query: ${metricNameOrQuery}`);
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
        console.error(`[valuation.js] Error fetching ${metricNameOrQuery} from Perplexity:`, err);
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
      
      // Attempt to get a more descriptive name for the Perplexity query
      const companyQueryName = (profile && profile[0] && profile[0].companyName) ? `${profile[0].companyName} (${ticker})` : `${ticker} stock`;

      // Define all metrics that might need Perplexity fallback, with proper query formatting
      const metricDefinitions = {
        earningsYield: {
          value: earningsYield,
          query: `earnings yield percentage for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) + '%' : '--' // Expect a number
        },
        evEbit: {
          value: evEbit,
          query: `enterprise value to EBIT ratio for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : '--' // Expect a number
        },
        fcfYield: {
          value: fcfYield,
          query: `free cash flow yield percentage for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) + '%' : '--' // Expect a number
        },
        fwdPe: {
          value: fwdPe,
          query: `forward price to earnings ratio for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : '--' // Expect a number
        },
        currentRatio: {
          value: currentRatio,
          query: `current ratio for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : '--' // Expect a number
        },
        interestCoverage: {
          value: interestCoverage,
          query: `interest coverage ratio for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : '--' // Expect a number
        },
        peg: {
          value: peg,
          query: `PEG ratio for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : '--' // Expect a number
        },
        roe: {
          value: roe,
          query: `return on equity percentage for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) + '%' : '--' // Expect a number
        },
        roic: {
          value: roic,
          query: `return on invested capital percentage for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) + '%' : '--' // Expect a number
        },
        profitMargin: {
          value: profitMargin,
          query: `profit margin percentage for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) + '%' : '--' // Expect a number
        },
        operatingMargin: { 
          value: operatingMargin, 
          query: `operating margin percentage for ${companyQueryName}`,
          formatter: val => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) + '%' : '--' // Expect a number
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
            // Pass only metric.query, which is self-contained now
            const value = await fetchFromPerplexity(metric.query);
            console.log(`[valuation.js] Perplexity returned for ${metric.name}: ${value}`);
            // Apply formatter which now also handles non-numeric conversion to '--'
            return { 
              name: metric.name, 
              value: value !== null ? metric.formatter(value) : '--' // Ensure null from fetchFromPerplexity becomes '--'
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
      const perplexityWACC = await fetchFromPerplexity(`weighted average cost of capital (WACC) percentage for ${ticker} stock`);
      if (perplexityWACC) dcfWACC = perplexityWACC + '%';
    }
    
    if (dcfGrowthRate === '--') {
      const perplexityGrowth = await fetchFromPerplexity(`long-term growth rate percentage for ${ticker} stock DCF model`);
      if (perplexityGrowth) dcfGrowthRate = perplexityGrowth + '%';
    }
    
    // Get current stock price for comparison with DCF
    const stockPrice = getMetric(profileObj, 'price', null) || getMetric(ev, 'stockPrice', null) || '--';
    
    const metrics = [
      { label: 'P/E (TTM)', value: pe },
      { label: 'Forward P/E', value: fwdPe },
      { label: 'P/B', value: pb },
      { label: 'Earnings Yield', value: earningsYield },
      { label: 'EV/EBIT', value: evEbit },
      { label: 'Price/FCF', value: priceFCF },
      { label: 'FCF Yield', value: fcfYield },
      { label: 'PEG Ratio', value: peg },
      { label: 'ROE', value: roe },
      { label: 'ROIC', value: roic },
      { label: 'Profit Margin', value: profitMargin },
      { label: 'Operating Margin', value: operatingMargin },
      { label: 'Debt/Equity', value: debtEquity },
      { label: 'Current Ratio (Assets/Liabilities)', value: currentRatio },
      { label: 'Interest Coverage (EBIT/Interest)', value: interestCoverage },
      { label: 'Dividend Yield', value: dividendYield },
      { label: 'FCF (abs)', value: fcfAbs },
      { label: 'EPS CAGR (5yr)', value: epsCAGR },
      { label: 'Revenue CAGR (5yr)', value: revCAGR },
      { label: 'Retained Earnings Growth (10yr)', value: retainedEarningsGrowth },
      { label: 'Consecutive Profitable Years', value: profitableYears },
      { label: 'Dividend Growth (5yr)', value: dividendGrowth },
      { label: 'Current Stock Price', value: stockPrice },
      { label: 'DCF Intrinsic Value', value: dcfValue },
      { label: 'DCF Margin of Safety', value: dcfMargin },
      { label: 'WACC', value: dcfWACC },
      { label: 'Long-term Growth Rate', value: dcfGrowthRate },
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
    
    // Render metrics as grid with status indicator for Perplexity-sourced data
    container.innerHTML = `
      <div class="valuation-header">
        <div class="valuation-title">Valuation & Quality Metrics</div>
        ${toggleSwitch}
      </div>
      <div class="valuation-metrics-grid">
        ${metrics.map(m => {
          const isPerplex = perplexityMetrics && 
            (m.label === 'Earnings Yield' && perplexityMetrics.earningsYield !== '--' || 
             m.label === 'EV/EBIT' && perplexityMetrics.evEbit !== '--' ||
             m.label === 'FCF Yield' && perplexityMetrics.fcfYield !== '--' ||
             m.label === 'Forward P/E' && perplexityMetrics.fwdPe !== '--');
          
          const explanation = explanations[m.label] ? 
            `<div class="metric-explanation">${explanations[m.label]}</div>` : '';
          
          return `
          <div class="valuation-metric-label">${m.label}${isPerplex ? ' <span class="perplexity-source" title="Data from Perplexity AI">*</span>' : ''}</div>
          <div class="valuation-metric-value">${m.value}</div>
          ${explanation}
          `;
        }).join('')}
      </div>
      <div class="valuation-footer">* Data sourced from Perplexity AI when not available from financial APIs</div>
    `;
    
    // Add CSS for Perplexity indicator and explainer toggle
    const style = document.createElement('style');
    style.textContent = `
      .valuation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .explainer-switch {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .switch-label {
        color: var(--text-light, #ecf0f3);
        font-size: 12px;
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 36px;
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
        background-color: #2c3e50;
        transition: .4s;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
      }
      input:checked + .slider {
        background-color: #4cc9f0;
      }
      input:checked + .slider:before {
        transform: translateX(16px);
      }
      .slider.round {
        border-radius: 34px;
      }
      .slider.round:before {
        border-radius: 50%;
      }
      .metric-explanation {
        grid-column: span 2;
        font-size: 11px;
        color: #a9b4c4;
        padding: 0 8px 12px;
        display: none;
      }
      .perplexity-source { color: #4cc9f0; font-weight: bold; }
      .valuation-footer { font-size: 10px; color: #a9b4c4; text-align: right; margin-top: 10px; }
    `;
    document.head.appendChild(style);
    
    // Wait for rendering to fully complete, ensure no loading messages are visible
    const waitForRenderComplete = () => {
      // Check if loading message still exists
      const loadingMsg = document.querySelector('.valuation-loading');
      if (loadingMsg) {
        console.log('[Valuation] Loading message still visible, waiting for complete render...');
        setTimeout(waitForRenderComplete, 200); // Check again in 200ms
        return;
      }
      
      // Setup toggle functionality
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
      
      // Now that everything is completely rendered and loading message is gone, 
      // dispatch the event that valuation widget is loaded
      document.dispatchEvent(new CustomEvent('valuation-widget-loaded'));
      console.log(`[Valuation] Dispatched valuation-widget-loaded event - ALL METRICS LOADED`);
    };
    
    // Start the render completion check process
    setTimeout(waitForRenderComplete, 200);
  } catch (err) {
    container.innerHTML = '<div class="valuation-error">Failed to load valuation metrics.</div>';
    // Even on error, dispatch the event that the widget has finished loading
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('valuation-widget-loaded'));
      console.log(`[Valuation] Dispatched valuation-widget-loaded event (after error)`);
    }, 100);
  }
}

window.renderValuationWidget = renderValuationWidget;
