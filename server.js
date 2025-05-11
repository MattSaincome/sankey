require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const express = require('express');

const app = express();
// Create a dedicated router for API endpoints
const apiRouter = express.Router();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FMP_API_KEY;

// Serve static assets from /public and project root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Parse JSON request bodies
app.use(express.json());

// Mount the API router at /api
app.use('/api', apiRouter);

// Explicit route to serve the FirstLookStocks watermark image
app.get('/firstlookstocks-watermark.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'firstlookstocks-watermark.png'));
});

// Autocomplete endpoint: resolve ticker symbols by name or symbol
apiRouter.get('/search', async (req, res) => {
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

apiRouter.get('/income-statement', async (req, res) => {
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

// --- Generic FMP Proxy API ---
const FMP_API_KEY = process.env.FMP_API_KEY;
// Handle both /api/fmp-proxy and /api/fmp-proxy/data routes
apiRouter.get(['/fmp-proxy', '/fmp-proxy/data'], async (req, res) => {
  console.log('[FMP Proxy] Query params:', req.query);
  // Extract all possible parameters
  const { endpoint, symbol, period, limit, ...otherParams } = req.query;
  
  if (!endpoint || !symbol) {
    return res.status(400).json({ error: 'Endpoint and symbol are required' });
  }
  
  // Construct the base URL
  let url = `https://financialmodelingprep.com/api/v3/${endpoint}/${encodeURIComponent(symbol)}`;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (limit) params.append('limit', limit);
  
  // Add any additional parameters from the query
  Object.entries(otherParams).forEach(([key, value]) => {
    if (key !== 'apikey' && value) { // Skip apikey as we'll add our own
      params.append(key, value);
    }
  });
  
  // Add API key
  params.append('apikey', FMP_API_KEY);
  
  // Complete URL
  const fullUrl = `${url}?${params.toString()}`;
  console.log(`[FMP Proxy] Fetching: ${fullUrl.replace(FMP_API_KEY, 'API_KEY_HIDDEN')}`);
  
  try {
    const resp = await fetch(fullUrl);
    console.log(`[FMP Proxy] Response status: ${resp.status}`);
    
    if (!resp.ok) {
      console.error(`[FMP Proxy] Error response: ${resp.status} ${resp.statusText}`);
      return res.status(502).json({ 
        error: 'Failed to fetch from FMP', 
        status: resp.status,
        statusText: resp.statusText 
      });
    }
    
    const text = await resp.text();
    console.log(`[FMP Proxy] Response length: ${text.length} bytes`);
    
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        console.log(`[FMP Proxy] Received array with ${data.length} items`);
      } else {
        console.log(`[FMP Proxy] Received object response`);
      }
      res.json(data);
    } catch (parseErr) {
      console.error('[FMP Proxy] JSON parse error:', parseErr);
      console.log('[FMP Proxy] Raw response:', text.substring(0, 200) + '...');
      res.status(500).json({ error: 'Invalid JSON response from FMP API' });
    }
  } catch (err) {
    console.error('[FMP Proxy] Fetch error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// --- Competitors API Proxy ---
const PEERS_API_KEY = process.env.FMP_API_KEY;
apiRouter.get('/competitors', async (req, res) => {
  const ticker = req.query.ticker;
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });
  try {
    const url = `https://financialmodelingprep.com/stable/stock-peers?symbol=${encodeURIComponent(ticker)}&apikey=${PEERS_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(502).json({ error: 'Failed to fetch competitors from FMP' });
    }
    const peers = await resp.json();
    if (!Array.isArray(peers)) {
      return res.status(500).json({ error: 'Unexpected response from FMP' });
    }
    res.json(peers);
  } catch (err) {
    console.error('Competitors API error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
apiRouter.get('/revenue-segmentation', async (req, res) => {
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
apiRouter.get('/income-statement-growth', async (req, res) => {
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

// Value Investor Bot chat relay endpoint
apiRouter.post('/value-investor-bot', express.json(), async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }
  const userMessage = req.body.message;
  const history = req.body.history || [];
  if (!userMessage) return res.status(400).json({ error: 'Message is required.' });

  // Compose messages array for OpenAI
  const messages = [
    { role: 'system', content: `This GPT simulates Warren Buffett with comprehensive knowledge of everything Buffett has publicly written, said, or endorsed, including annual shareholder letters, interviews, speeches, and investing principles. It emulates Buffett's voice, mannerisms, and investment philosophy, especially focusing on long-term value investing, intrinsic value calculation, business quality, and management integrity. The GPT interprets stock information from a connected user-provided dataset, which includes company financials, metrics, and qualitative insights, and responds as Buffett would — conservatively, rationally, and with a long-term orientation.

**Be concise, frank, and direct—like a human trying to get a point across. Cut to the chase, avoid repetition, and don't sugarcoat. Favor short, punchy sentences.**
// --- Place all API endpoints above this line ---

// This is a placeholder for the original perplexity-financial endpoint
// Now implemented above

// Perplexity API endpoint for retrieving financial metrics
apiRouter.get('/perplexity-financial', async (req, res) => {
  const ticker = req.query.ticker;
  const metric = req.query.metric;
  
  if (!ticker || !metric) {
    return res.status(400).json({ error: 'Both ticker and metric are required' });
  }
  
  // Get Perplexity API key from environment variables
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) {
    return res.status(500).json({ error: 'Perplexity API key not configured.' });
  }
  
  try {
    console.log(`[Perplexity] Fetching financial data for ${ticker}, metric: ${metric}`);
    
    // Create a very specific query optimized for numerical responses
    const query = `You are a financial data API that only returns numbers. 
    What is the exact numerical value for the ${metric} of ${ticker} stock?
    Respond with ONLY the numerical value, no text, symbols, or explanation.
    Example response: 15.7`;
    
    // Make the API request using one of the official Perplexity models
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar',  // Using the official Perplexity model from their docs
        messages: [
          {
            role: 'system',
            content: 'You are a financial data API that only returns numbers. Never include any text, just the numerical value.'
          },
          { 
            role: 'user', 
            content: query 
          }
        ],
        temperature: 0.1,
        max_tokens: 30  // Limiting for efficiency
      })
    });
    
    // Better error handling
    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text().catch(() => 'Failed to get error details');
      console.error(`[Perplexity] Error: ${perplexityResponse.status} ${perplexityResponse.statusText}`);
      console.error(`[Perplexity] Error details: ${errorText}`);
      
      // If we get rate limited, let the client know
      if (perplexityResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded for Perplexity API' });
      }
      
      return res.status(500).json({ error: 'Failed to fetch data from Perplexity' });
    }
    
    try {
      const data = await perplexityResponse.json();
      console.log(`[Perplexity] Raw response:`, data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const value = data.choices[0].message.content.trim();
        console.log(`[Perplexity] Raw value: "${value}"`);
        
        // Try multiple approaches to extract a number
        // 1. First check if the entire response is just a number
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          return res.json({ metric, value: parseFloat(value).toString() });
        }
        
        // 2. Try to extract numbers using regex
        const numMatch = value.match(/\d+([,.]\d+)?/g);
        if (numMatch && numMatch.length > 0) {
          // Remove commas and convert to standard number format
          const cleanNumber = numMatch[0].replace(/,/g, '');
          return res.json({ metric, value: cleanNumber });
        }
        
        // 3. If no number found but we have text, return it
        return res.json({ metric, value });
      } else {
        console.error('[Perplexity] Unexpected response format:', data);
        return res.status(500).json({ error: 'Unexpected response format from Perplexity' });
      }
    } catch (parseError) {
      console.error('[Perplexity] JSON parse error:', parseError);
      return res.status(500).json({ error: 'Failed to parse Perplexity response' });
    }
  } catch (err) {
    console.error('[Perplexity] Error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Feature Request endpoint to collect user feature requests
apiRouter.post('/feature-request', express.json(), async (req, res) => {
  try {
    const { email, featureRequest, marketingConsent } = req.body;
    
    // Validate input
    if (!email || !featureRequest) {
      return res.status(400).json({ error: 'Email and feature request are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Log the feature request (in a real application, this would be saved to a database)
    console.log(`[Feature Request] New request from ${email}:`, {
      featureRequest,
      marketingConsent: !!marketingConsent,
      timestamp: new Date().toISOString()
    });
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Feature request received. Thank you for your feedback!' 
    });
  } catch (err) {
    console.error('[Feature Request] Error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Catch-all route - must be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
