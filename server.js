const fetch = require('node-fetch');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'IjDyocJmKTZRC0bhbpvFyvkoJetdtGHJ';

// Serve static assets from /public and project root
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route to serve the FirstLookStocks watermark image
app.get('/firstlookstocks-watermark.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'firstlookstocks-watermark.png'));
});

app.use(express.static(path.join(__dirname)));

// Autocomplete endpoint: resolve ticker symbols by name or symbol
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  try {
    const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(q)}&limit=10&exchange=NASDAQ,NYSE&apikey=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    res.json(json.map(item => ({ symbol: item.symbol, name: item.name })));  
  } catch (err) {
    console.error('Search endpoint error:', err);
    res.status(500).json([]);
  }
});

app.get('/api/income-statement', async (req, res) => {
  const ticker = req.query.ticker;
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });
  try {
    // Get a more detailed income statement with multiple periods for trend analysis
    const url = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=4&apikey=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log('DEBUG: Raw API response for income-statement', JSON.stringify(json, null, 2));
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    const statement = json[0];
    
    // Extract detailed operating expenses breakdown if available
    // Different companies report these differently, so we check multiple fields
    const detailedExpenses = {
      // Core expense items
      researchAndDevelopment: statement.researchAndDevelopmentExpenses || 0,
      sellingGeneralAdmin: statement.sellingGeneralAndAdministrativeExpenses || 0,
      
      // Other detailed items that might be present
      sellingAndMarketingExpenses: statement.sellingAndMarketingExpenses || 0,
      generalAndAdministrativeExpenses: statement.generalAndAdministrativeExpenses || 0,
      otherExpenses: statement.otherExpenses || 0,
      operatingExpenses: statement.operatingExpenses || 0,
      
      // Product costs
      costOfRevenue: statement.costOfRevenue || 0,
      depreciation: statement.depreciationAndAmortization || 0,
      costOfGoodsSold: (statement.costOfRevenue || 0) - (statement.depreciationAndAmortization || 0),
      date: statement.date,
      period: statement.period,
      symbol: statement.symbol,
      currency: statement.reportedCurrency
    };
    
    // Fetch profile for official company name and logo
    let companyName = statement.symbol;
    let logo = null;
    try {
      const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${API_KEY}`);
      const profileJson = await profileRes.json();
      console.log('DEBUG: profileJson raw:', profileJson);
      const profileData = Array.isArray(profileJson) && profileJson.length ? profileJson[0] : profileJson;
      if (profileData.companyName) companyName = profileData.companyName;
      if (profileData.image) logo = profileData.image;
    } catch (e) {
      console.error('Profile fetch error:', e);
    }
    
    // Fetch last 4 quarters for TTM calculation
    const ttmUrl = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=quarter&limit=4&apikey=${API_KEY}`;
    const ttmRes = await fetch(ttmUrl);
    const quarterly = await ttmRes.json();
    console.log('DEBUG: Quarterly API response for TTM:', JSON.stringify(quarterly, null, 2));
    if (!quarterly || quarterly.length < 4) {
      return res.status(404).json({ error: 'Insufficient data for TTM' });
    }
    const latestDate = quarterly[0].date;
    const sumField = field => quarterly.reduce((sum, q) => sum + (q[field] || 0), 0);
    const ttmValues = {
      revenue: sumField('revenue'),
      costOfRevenue: sumField('costOfRevenue'),
      grossProfit: sumField('grossProfit'),
      operatingExpenses: sumField('operatingExpenses'),
      operatingIncome: sumField('operatingIncome'),
      interestExpense: sumField('interestExpense'),
      incomeBeforeTax: sumField('incomeBeforeTax'),
      incomeTaxExpense: sumField('incomeTaxExpense'),
      netIncome: sumField('netIncome')
    };
    // Detailed expense breakdown for TTM
    const detailedExpensesTTM = {
      researchAndDevelopment: sumField('researchAndDevelopmentExpenses'),
      sellingGeneralAdmin: sumField('sellingGeneralAndAdministrativeExpenses'),
      sellingAndMarketingExpenses: sumField('sellingAndMarketingExpenses'),
      generalAndAdministrativeExpenses: sumField('generalAndAdministrativeExpenses'),
      otherExpenses: sumField('otherExpenses'),
      operatingExpenses: ttmValues.operatingExpenses,
      costOfRevenue: ttmValues.costOfRevenue,
      depreciation: sumField('depreciationAndAmortization'),
      costOfGoodsSold: sumField('costOfRevenue') - sumField('depreciationAndAmortization'),
      date: latestDate,
      symbol: statement.symbol,
      currency: quarterly[0].reportedCurrency
    };
    
    // Debug: output payload to verify companyName and logo
    console.log('DEBUG: /api/income-statement payload =>', { companyName, logo, symbol: statement.symbol, date: latestDate });
    res.json({
      companyName,
      logo,
      symbol: statement.symbol,
      date: latestDate, // TTM as of
      costOfRevenue: ttmValues.costOfRevenue,
      grossProfit: ttmValues.grossProfit,
      operatingExpenses: ttmValues.operatingExpenses,
      operatingIncome: ttmValues.operatingIncome,
      interestExpense: ttmValues.interestExpense,
      incomeBeforeTax: ttmValues.incomeBeforeTax,
      incomeTaxExpense: ttmValues.incomeTaxExpense,
      netIncome: ttmValues.netIncome,
      expenses: detailedExpensesTTM,
      revenue: ttmValues.revenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// New endpoint for revenue segmentation with segment-level YoY growth
app.get('/api/revenue-segmentation', async (req, res) => {
  const ticker = req.query.ticker;
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });
  try {
    // Fetch two years for YoY calculation
    const url = `https://financialmodelingprep.com/stable/revenue-product-segmentation?symbol=${ticker}&structure=flat&period=annual&limit=2&apikey=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log('[DEBUG] Segmentation API raw response:', JSON.stringify(json, null, 2));
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'No segmentation data found' });
    }
    // Sort by date descending (latest first)
    const sorted = json.filter(j => j.data && Object.keys(j.data).length > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length === 0) {
      return res.status(404).json({ error: 'No segmentation data found' });
    }
    const latest = sorted[0];
    const prev = sorted[1];
    console.log('[DEBUG] Latest segmentation:', latest);
    console.log('[DEBUG] Previous segmentation:', prev);
    // Build segment array with YoY growth if possible
    const segments = Object.entries(latest.data)
      .map(([segment, revenue]) => {
        let yoy = null;
        if (prev && prev.data && prev.data[segment] != null && prev.data[segment] !== 0) {
          yoy = ((Number(revenue) - Number(prev.data[segment])) / Number(prev.data[segment])) * 100;
        }
        return {
          segment,
          revenue: Number(revenue),
          yoy: yoy != null && !isNaN(yoy) && isFinite(yoy) ? yoy : null
        };
      })
      .filter(s => s.revenue > 0);
    console.log('[DEBUG] Segments with YoY:', segments);
    res.json({ date: latest.date, segments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// New endpoint for income statement YoY growth metrics
app.get('/api/income-statement-growth', async (req, res) => {
  const ticker = req.query.ticker;
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });
  try {
    // TTM YoY growth: compare sum of last 4 vs previous 4 quarters
    const qUrl = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=quarter&limit=8&apikey=${API_KEY}`;
    const qRes = await fetch(qUrl);
    const quarterly = await qRes.json();
    if (!quarterly || quarterly.length < 8) {
      return res.status(404).json({ error: 'Insufficient data for YoY TTM growth' });
    }
    const recent = quarterly.slice(0, 4);
    const prev = quarterly.slice(4, 8);
    const sumField = (arr, field) => arr.reduce((s, item) => s + (item[field] || 0), 0);
    const computeGrowth = field => {
      const currSum = sumField(recent, field);
      const prevSum = sumField(prev, field);
      return prevSum !== 0 ? (currSum - prevSum) / prevSum : null;
    };
    const growthData = {
      growthRevenue: computeGrowth('revenue'),
      growthCostOfRevenue: computeGrowth('costOfRevenue'),
      growthGrossProfit: computeGrowth('grossProfit'),
      growthOperatingExpenses: computeGrowth('operatingExpenses'),
      growthOperatingIncome: computeGrowth('operatingIncome'),
      growthIncomeBeforeTax: computeGrowth('incomeBeforeTax'),
      growthIncomeTaxExpense: computeGrowth('incomeTaxExpense'),
      growthNetIncome: computeGrowth('netIncome'),
      growthResearchAndDevelopmentExpenses: computeGrowth('researchAndDevelopmentExpenses'),
      growthGeneralAndAdministrativeExpenses: computeGrowth('generalAndAdministrativeExpenses'),
      growthSellingAndMarketingExpenses: computeGrowth('sellingAndMarketingExpenses'),
      growthOtherExpenses: computeGrowth('otherExpenses'),
      growthDepreciationAndAmortization: computeGrowth('depreciationAndAmortization')
    };
    res.json(growthData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
