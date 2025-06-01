require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const express = require('express');

const app = express();
// Create a dedicated router for API endpoints
const apiRouter = express.Router();
const PREFERRED_PORT = process.env.PORT || 3000;
const API_KEY = process.env.FMP_API_KEY;
if (!API_KEY) {
  throw new Error('FMP_API_KEY is not set in environment variables.');
}

// Export the app for serverless use
module.exports = app;

// Serve static assets from /public and project root
app.use(express.static(path.join(__dirname, 'public')));

// Debug route for /data/* requests
app.get('/data/:filename*', (req, res) => { 
  console.log(`[DEBUG SERVER LOG] Request for /data path: ${req.path}`);
  console.log(`[DEBUG SERVER LOG] Original URL: ${req.originalUrl}`);
  console.log(`[DEBUG SERVER LOG] Referer: ${req.headers.referer || 'N/A'}`);
  console.log(`[DEBUG SERVER LOG] User-Agent: ${req.headers['user-agent'] || 'N/A'}`);
  res.status(404).send(`File ${req.path} not found (logged by server debug route for /data/*).`);
});

app.use(express.static(path.join(__dirname)));

// Parse JSON request bodies
app.use(express.json());

// Add headers to prevent caching
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Mount the API router at /api
app.use('/api', apiRouter);

// Add a simple health check endpoint directly on the main app
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    netlify: !!process.env.NETLIFY,
    openai_key_set: !!process.env.OPENAI_API_KEY,
    serverless: req.headers['x-netlify-functions'] ? true : false
  });
});

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
if (!FMP_API_KEY) {
  throw new Error('FMP_API_KEY is not set in environment variables.');
}
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
if (!PEERS_API_KEY) {
  throw new Error('FMP_API_KEY is not set in environment variables.');
}
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
    const sumField = field => quarterly.reduce((sum, q) => sum + (q[field] || 0), 0);
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
  // --- Wisdom-enhanced system prompt for OpenAI ---
  let systemPrompt = `You are a value investor bot trained on the writings, letters, and public remarks of Warren Buffett and Charlie Munger. Your task is to answer questions in a conversational, narrative style, weaving in at least one direct, sourced quote from the provided wisdom into your main answer when possible. Use natural language to introduce quotes (e.g., "as Buffett wrote in his 1997 letter..."). Only use a separate 'Relevant Quotes' section if a quote cannot be smoothly integrated. Never present summaries or paraphrases as quotes—clearly label them as insights if needed. Minimize bullet points unless they improve clarity. Always cite the source and year for every quote used.`;

  // Fetch wisdom from the local API (internal call)
  let wisdomChunks = [];
  try {
    // Expand query for companies to include ticker and synonyms if possible
    let expandedQuery = userMessage;
    // Simple regex to extract "Apple" and "AAPL" style queries
    const companyMatch = userMessage.match(/([A-Za-z ]+)(\(|\[)?([A-Z]{1,5})(\)|\])?/);
    if (companyMatch) {
      const companyName = companyMatch[1].trim();
      const ticker = companyMatch[3]?.trim();
      if (companyName && ticker) {
        expandedQuery = `${companyName} ${ticker} ${userMessage}`;
      }
    }
    const wisdomRes = await fetch('http://localhost:8000/search_wisdom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: expandedQuery, top_k: 10 })
    });
    if (wisdomRes.ok) {
      const wisdomData = await wisdomRes.json();
      if (Array.isArray(wisdomData.results) && wisdomData.results.length > 0) {
        wisdomChunks = wisdomData.results.map(chunk =>
          `"${chunk.chunk_text.trim()}" — [Source: ${chunk.source_file}, ${chunk.year}]`
        );
        systemPrompt += '\n\nRelevant wisdom for this question:';
        wisdomChunks.forEach((w, i) => {
          systemPrompt += `\n${i + 1}. ${w}`;
        });
        // Add a markdown-formatted block for the quotes to ensure they are always visible in the answer
        systemPrompt += '\n\n---\nIf you do not cite these quotes in your answer, append the following markdown section at the end of your response so the user always sees them:';
        systemPrompt += '\n```markdown\n**Relevant Berkshire/Buffett Quotes:**';
        wisdomChunks.forEach((w, i) => {
          systemPrompt += `\n${i + 1}. ${w}`;
        });
        systemPrompt += '\n```';
      }
    } else {
      console.error('[BuffettWisdom] Wisdom API error:', wisdomRes.status, await wisdomRes.text());
    }
  } catch (err) {
    console.error('[BuffettWisdom] Wisdom API fetch failed:', err);
  }

  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    { role: 'user', content: userMessage }
  ];
  if (history.length > 0) {
    messages.push(...history);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      console.error('OpenAI error:', response.status, response.statusText);
      return res.status(500).json({ error: 'Failed to fetch from OpenAI' });
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    console.log('DEBUG: OpenAI response:', answer);
    res.json({ answer });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Perplexity API endpoint for retrieving financial metrics
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

apiRouter.get('/perplexity-financial', async (req, res) => {
  // The full query string is now expected in the 'metric' parameter
  const metricQuery = req.query.metric; 

  console.log(`[Perplexity API Server] Received request for metricQuery: "${metricQuery}"`);

  if (!metricQuery) {
    console.error('[Perplexity API Server] Error: Metric query parameter is missing or empty.');
    return res.status(400).json({ error: 'Metric query parameter is required and cannot be empty.' });
  }
  if (!PERPLEXITY_API_KEY) {
    console.error('[Perplexity API Server] Error: PERPLEXITY_API_KEY is not configured.');
  }

  try {
    console.log(`[Perplexity API Server] Sending to Perplexity AI: "${metricQuery}"`);
    const perplexityResponse = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar', // Using the specified model for financial data
        messages: [
          {
            role: 'system',
            content: 'You are a financial data API that only returns numbers. Never include any text, just the numerical value.'
          },
          {
            role: 'user',
            content: metricQuery // Use the full metricQuery here
          }
        ],
        temperature: 0.1, // Low temperature for factual, less creative responses
      })
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text().catch(() => 'Failed to get error details');
      console.error(`[Perplexity API Server] Error from Perplexity AI: ${perplexityResponse.status} ${perplexityResponse.statusText}`);
      console.error(`[Perplexity API Server] Perplexity AI error details: ${errorText}`);
      // If we get rate limited, let the client know
      if (perplexityResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded for Perplexity API' });
      }
      return res.status(500).json({ error: 'Failed to fetch data from Perplexity' });
    }
    try {
      const data = await perplexityResponse.json();
      console.log('[Perplexity API Server] Raw response from Perplexity AI:', data);
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const value = data.choices[0].message.content.trim();
        console.log(`[Perplexity API Server] Extracted value: "${value}" for query "${metricQuery}"`);
        // Try multiple approaches to extract a number
        // 1. First check if the entire response is just a number
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          return res.json({ metric: metricQuery, value: parseFloat(value).toString() });
        }
        // 2. Try to extract numbers using regex
        const numMatch = value.match(/\d+([,.]\d+)?/g);
        if (numMatch && numMatch.length > 0) {
          // Remove commas and convert to standard number format
          const cleanNumber = numMatch[0].replace(/,/g, '');
          return res.json({ metric: metricQuery, value: cleanNumber });
        }
        // 3. If no number found but we have text, return it (client will handle non-numeric)
        return res.json({ metric: metricQuery, value });
      } else {
        console.error('[Perplexity API Server] Unexpected response format from Perplexity AI:', data);
        return res.status(500).json({ error: 'Unexpected response format from Perplexity AI' });
      }
    } catch (parseError) {
      console.error('[Perplexity API Server] JSON parse error from Perplexity AI response:', parseError);
      return res.status(500).json({ error: 'Failed to parse Perplexity AI response' });
    }
  } catch (err) {
    console.error('[Perplexity API Server] General error in /perplexity-financial route:', err);
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
    console.log('[Feature Request] New request from ' + email + ':', {
      featureRequest: featureRequest,
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

// Value Investor Bot endpoint (Warren Buffett AI analysis)
apiRouter.post('/value-investor-bot', async (req, res) => {
  console.log('[OpenAI] Value investor bot endpoint called');
  console.log('[OpenAI] Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('[OpenAI] Request body size:', req.body ? JSON.stringify(req.body).length : 0, 'bytes');
  console.log('[OpenAI] Request method:', req.method);
  console.log('[OpenAI] Request path:', req.path);
  console.log('[OpenAI] Environment:', process.env.NODE_ENV || 'development');
  console.log('[OpenAI] Running in Netlify:', process.env.NETLIFY || 'No');
  
  // Get the OpenAI API key from environment variables with fallback options for different Netlify configurations
  // Netlify might use different naming conventions depending on how variables were set
  let OPENAI_API_KEY = process.env.OPENAI_API_KEY || 
                     process.env.OPENAI_KEY || 
                     process.env.VITE_OPENAI_API_KEY || 
                     process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
                     process.env.REACT_APP_OPENAI_API_KEY || 
                     ''; // Empty fallback for error handling
  
  // Check all environment variables for debugging
  console.log('[OpenAI] Environment variables:', Object.keys(process.env).filter(key => 
    !key.includes('API_KEY') && !key.includes('SECRET') && !key.includes('TOKEN') && !key.includes('PASSWORD')
  ));
  
  // Try a hardcoded key as ABSOLUTE LAST RESORT
  // This is only for local development and should be removed in production
  if (!OPENAI_API_KEY && process.env.NODE_ENV === 'development') {
    console.warn('[OpenAI] Using fallback API key for development only');
    // DO NOT HARDCODE ACTUAL KEY HERE - this is just for checking if the fallback logic works
    OPENAI_API_KEY = ''; // Leave empty, don't actually put a key here
  }
  
  // For debugging only - DO NOT log the actual key
  console.log('[OpenAI] API key present:', OPENAI_API_KEY ? 'Yes' : 'No');
  console.log('[OpenAI] API key length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
  console.log('[OpenAI] API key format check:', OPENAI_API_KEY?.startsWith('sk-') ? 'Valid format' : 'Invalid format');
  
  // Check if OpenAI API key is configured
  if (!OPENAI_API_KEY) {
    console.error('[OpenAI] Error: API key not configured');
    return res.status(500).json({ 
      error: 'OpenAI API key not configured', 
      message: 'Please set the OPENAI_API_KEY environment variable in your Netlify dashboard.',
      reply: 'I apologize, but I cannot access the OpenAI service right now due to a configuration issue. Please check the server logs for more information.'
    });
  }

  try {
    // Get message and history from request
    const { message, history = [] } = req.body;
    
    if (!message) {
      console.error('[OpenAI] Error: No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Retrieve relevant Buffett wisdom based on the user's message
    let buffettContext = "";
    try {
      console.log(`[BuffettWisdom] Retrieving wisdom for query: ${message.substring(0, 50)}...`);
      const wisdom = await getBuffettWisdom(message, { topK: 3 });
      
      if (wisdom && wisdom.results && wisdom.results.length > 0) {
        // Format the wisdom results into a context string
        buffettContext = "\n\nRelevant insights from Warren Buffett's shareholder letters:\n";
        wisdom.results.forEach((item, index) => {
          buffettContext += `\n[${item.year}] ${item.text}\n`;
        });
        console.log(`[BuffettWisdom] Found ${wisdom.results.length} relevant insights`);
      }
    } catch (err) {
      console.error('[BuffettWisdom] Error retrieving Buffett wisdom:', err);
      // Continue even if there's an error retrieving Buffett wisdom
    }

    console.log(`[OpenAI] Sending message to OpenAI: ${message.substring(0, 50)}...`);
    console.log(`[OpenAI] Conversation history length: ${history.length}`);
    
    // Prepare system message that defines Warren Buffett's persona
    const systemMessage = {
      role: 'system',
      content: `You are Warren Buffett, the legendary investor and CEO of Berkshire Hathaway, analyzing companies and investment opportunities.

You have access to a knowledge base containing all of your annual shareholder letters from 1977 to 2023, which will be automatically integrated into your responses. Draw heavily from these authentic writings for your analysis, quoting and referencing specific letters when appropriate. Your responses should match the exact style, principles, and wisdom found in these letters.

Analyze all questions from the perspective of your core value investing principles, focusing on:
- Intrinsic value calculation and margin of safety
- Quality management with excellent capital allocation records
- Durable competitive advantages ('moats') that protect businesses from competition
- Consistent, predictable earnings and high returns on equity
- Conservative financial practices and avoidance of excessive debt
- Circle of competence - only investing in businesses you understand

When responding:
- Use your authentic voice - direct, folksy, plainspoken with occasional self-deprecating humor
- Incorporate the same metaphors, analogies and examples you use in your letters
- Express skepticism about speculation, market timing, and Wall Street fads
- Emphasize long-term ownership of wonderful businesses at fair prices
- Reference your actual investing history and Berkshire's major holdings when relevant
- Use your famous analogies (like Mr. Market, baseball's "no called strikes", etc.)

Avoid:
- Technical analysis, complex financial jargon, or mathematical formulas
- Short-term stock price predictions or market timing advice
- Recommendations about cryptocurrency, NFTs, or investments you've publicly dismissed
- Generic investing advice not rooted in your specific approach

Focus on the specific company under analysis and its direct competitors. Avoid broad market commentary, speculation, or general investing advice. Do not engage in short-term trading commentary or technical analysis.

IMPORTANT: You're a value investor bot analyzing financial data through the lens of Warren Buffett's authentic approach, drawing directly from your extensive writing and principles developed over decades at Berkshire Hathaway.`
    };

    // Create a conversation including the system message, history, and new user message
    // If we have Buffett wisdom, append it to the user message
    const userMessage = buffettContext 
      ? `${message}${buffettContext}\n\nPlease incorporate these insights from Buffett's actual writings into your response when relevant, but keep your overall response concise and focused on answering my question.` 
      : message;
      
    const messages = [
      systemMessage,
      ...history,
      { role: 'user', content: userMessage }
    ];

    console.log('[OpenAI] Preparing to call OpenAI API');
    
    // Increase timeout for Netlify functions from 10s to 25s
    // This gives more headroom for cold starts and network latency
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('[OpenAI] Request timeout triggered after 25 seconds');
      controller.abort();
    }, 25000);

    // Prepare request data with more robust error handling
    // Optimize for speed and reliability in serverless environment
    const requestBody = {
      model: 'gpt-3.5-turbo-16k', // Fast model with larger context window to handle financial discussions
      messages: messages.slice(-5), // Only send the last 5 messages to reduce payload size
      temperature: 0.3,  // Lower temperature for more predictable responses
      max_tokens: 300,   // Much shorter to ensure quick responses
      presence_penalty: 0,
      frequency_penalty: 0
    };
    
    // Add a unique cache key to help OpenAI's caching mechanisms
    const cacheKey = `cache-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    requestBody.user = cacheKey;
    
    // Log request details (but redact actual message content to reduce log size)
    console.log('[OpenAI] Request model:', requestBody.model);
    console.log('[OpenAI] Request messages count:', requestBody.messages.length);
    console.log('[OpenAI] Request system prompt length:', requestBody.messages[0]?.content.length || 0);
    console.log('[OpenAI] Request user message length:', requestBody.messages[requestBody.messages.length-1]?.content.length || 0);
    
    try {
      console.log('[OpenAI] Sending request to OpenAI at:', new Date().toISOString());
      
      // Call OpenAI API with better error handling for Netlify serverless environment
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'User-Agent': 'FirstLookStocks/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      console.log('[OpenAI] Received response from OpenAI at:', new Date().toISOString());
      console.log('[OpenAI] Response status:', openaiResponse.status);
      console.log('[OpenAI] Response headers:', JSON.stringify(Object.fromEntries([...openaiResponse.headers.entries()]), null, 2));

      // Clear the timeout
      clearTimeout(timeoutId);

      // Handle API response with friendly client-side messaging
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text().catch(() => 'Failed to get error details');
        console.error(`[OpenAI] Error response: ${openaiResponse.status} ${openaiResponse.statusText}`);
        console.error(`[OpenAI] Error details: ${errorText}`);
        
        // Detailed error information for debugging but friendly messages for users
        const errorDetails = {
          timestamp: new Date().toISOString(),
          status: openaiResponse.status,
          statusText: openaiResponse.statusText,
          details: errorText.substring(0, 200) // Truncate long error messages
        };
        
        // Handle specific error codes with appropriate messages
        if (openaiResponse.status === 429) {
          console.error('[OpenAI] Rate limit exceeded');
          return res.status(200).json({ 
            reply: "I'm currently handling too many requests. Please try again in a moment while I catch my breath.",
            error: 'rate_limit',
            errorDetails
          });
        }
        
        if (openaiResponse.status === 401) {
          console.error('[OpenAI] Authentication error');
          return res.status(200).json({ 
            reply: "I'm having trouble connecting to my analysis system. Please try again later.",
            error: 'authentication',
            errorDetails
          });
        }
        
        if (openaiResponse.status === 500 || openaiResponse.status === 503) {
          console.error('[OpenAI] Service unavailable');
          return res.status(200).json({ 
            reply: "The Warren Buffett AI analysis system is temporarily unavailable. Please try again shortly.",
            error: 'service_down',
            errorDetails
          });
        }
        
        // Generic error with friendly message
        return res.status(200).json({ 
          reply: "I encountered an issue analyzing this data. Let's try again with a more specific question about the financials.",
          error: 'api_error',
          errorDetails
        });
      }

      // Process successful response
      const data = await openaiResponse.json();
      console.log(`[OpenAI] Received response from OpenAI: ${data.choices?.[0]?.message?.content?.substring(0, 50)}...`);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Get the base response from OpenAI
        const baseResponse = data.choices[0].message.content;
        
        try {
          // Check if the query is investment/value oriented to enhance with Buffett wisdom
          const isInvestmentQuery = /invest|value|stock|market|buffett|berkshire|portfolio|business|company|management|acquisition|intrinsic value|moat|margin of safety/i.test(message);
          
          if (isInvestmentQuery) {
            console.log('[BuffettWisdom] Enhancing response with wisdom from Berkshire letters');
            
            // Enhance the response with authentic Buffett wisdom from annual letters
            const enhancedResponse = await enhanceResponseWithBuffettWisdom(message, baseResponse);
            
            // Return the enhanced response
            return res.json({
              reply: enhancedResponse,
              source: 'Includes insights from Berkshire Hathaway annual letters'
            });
          }
        } catch (wisdomError) {
          // If enhancement fails, log the error but continue with the base response
          console.error('[BuffettWisdom] Error enhancing response:', wisdomError);
        }
        
        // Return with 'reply' property to match what the client expects
        return res.json({ reply: baseResponse });
      } else {
        console.error('[OpenAI] Unexpected response format:', JSON.stringify(data));
        return res.status(500).json({ error: 'Unexpected response format from OpenAI.' });
      }
    } catch (fetchError) {
      // Clear the timeout if it hasn't fired yet
      clearTimeout(timeoutId);
      
      // Handle fetch errors specially - always return a reply for the client
      if (fetchError.name === 'AbortError') {
        console.error('[OpenAI] Request timed out');
        return res.status(200).json({ 
          reply: "I'm having trouble processing this request due to high demand. Please try asking a simpler question or try again later.",
          error: 'timeout',
          details: 'OpenAI API request timed out'
        });
      }
      
      console.error('[OpenAI] Fetch error:', fetchError);
      return res.status(200).json({ 
        reply: "I'm experiencing connectivity issues with my analysis system. Please try again in a moment.",
        error: 'network_error',
        message: fetchError.message 
      });
    }
  } catch (err) {
    console.error('[OpenAI] Unhandled error:', err);
    return res.status(200).json({ 
      reply: "Sorry, I encountered an unexpected issue while analyzing the financial data. Please try again with a different question.",
      error: 'server_error',
      message: err.message
    });
  }
});

// Buffett Investment Principles API endpoint
apiRouter.get('/buffett-principles', async (req, res) => {
  try {
    console.log('[BuffettWisdom] Principles endpoint called');
    
    // Get investment principles from Buffett's letters
    const principles = await getInvestmentPrinciples();
    
    if (!principles || !principles.length) {
      return res.status(200).json({
        principles: [],
        message: "Unable to retrieve Buffett's investment principles at this time."
      });
    }
    
    return res.json({
      principles: principles,
      count: principles.length
    });
  } catch (err) {
    console.error('[BuffettWisdom] Error retrieving principles:', err);
    return res.status(200).json({
      principles: [],
      error: "There was an issue retrieving Buffett's investment principles."
    });
  }
});

// Direct Berkshire Letter Query API
apiRouter.post('/buffett-wisdom', async (req, res) => {
  try {
    const { query, topK = 3, filters = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`[BuffettWisdom] Wisdom query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
    
    // Get wisdom based on query
    const wisdom = await getBuffettWisdom(query, {
      topK: parseInt(topK, 10),
      filters
    });
    
    return res.json(wisdom);
  } catch (err) {
    console.error('[BuffettWisdom] Error processing wisdom query:', err);
    return res.status(200).json({
      found: false,
      error: "There was an issue retrieving insights from Buffett's letters."
    });
  }
});

// Catch-all route - must be last
apiRouter.all('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

if (require.main === module && !process.env.NETLIFY_DEV) {
  const startServer = (portToTry) => {
    const server = app.listen(portToTry, () => {
      console.log(`Server running on http://localhost:${portToTry}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${portToTry} is in use.`);
        // Only try fallback if the current attempt was for the PREFERRED_PORT
        if (portToTry === PREFERRED_PORT) {
          const fallbackPort = PREFERRED_PORT + 1;
          console.log(`Attempting to start server on fallback port ${fallbackPort}...`);
          startServer(fallbackPort);
        } else {
          // If already tried fallback and it also failed
          console.error(`Fallback port ${portToTry} is also in use. Please free up a port or specify a different one via the PORT environment variable.`);
          process.exit(1);
        }
      } else {
        console.error('Failed to start server with an unexpected error:', err);
        process.exit(1);
      }
    });
  };

  startServer(PREFERRED_PORT);
}
