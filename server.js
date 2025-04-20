const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'IjDyocJmKTZRC0bhbpvFyvkoJetdtGHJ';

app.use(express.static(path.join(__dirname)));

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
      
      // Full data
      date: statement.date,
      period: statement.period,
      symbol: statement.symbol,
      currency: statement.reportedCurrency
    };
    
    res.json({
      // Standard data we were already providing
      costOfRevenue: statement.costOfRevenue,
      grossProfit: statement.grossProfit,
      operatingExpenses: statement.operatingExpenses,
      operatingIncome: statement.operatingIncome,
      interestExpense: statement.interestExpense,
      incomeBeforeTax: statement.incomeBeforeTax,
      incomeTaxExpense: statement.incomeTaxExpense,
      netIncome: statement.netIncome,
      
      // Add the detailed expense breakdown
      expenses: detailedExpenses,
      
      // Add revenue for ratio calculations
      revenue: statement.revenue
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
    const url = `https://financialmodelingprep.com/stable/income-statement-growth?symbol=${ticker}&limit=1&period=FY&apikey=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'No growth data found' });
    }
    res.json(json[0]);
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
