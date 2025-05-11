require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const apiRouter = express.Router();

// Parse JSON request bodies
app.use(express.json());

// API keys from environment variables
const FMP_API_KEY = process.env.FMP_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Validate all API keys are present
if (!FMP_API_KEY) console.warn('Warning: FMP_API_KEY is not configured');
if (!OPENAI_API_KEY) console.warn('Warning: OPENAI_API_KEY is not configured');
if (!PERPLEXITY_API_KEY) console.warn('Warning: PERPLEXITY_API_KEY is not configured');

// Income Statement endpoint
apiRouter.get('/income-statement', async (req, res) => {
  const ticker = req.query.ticker;
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });
  
  try {
    const url = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=4&apikey=${FMP_API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    
    // Process data and return the income statement data for Sankey diagram
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Value Investor Bot endpoint
apiRouter.post('/value-investor-bot', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }
  
  const userMessage = req.body.message;
  const history = req.body.history || [];
  if (!userMessage) return res.status(400).json({ error: 'Message is required.' });

  try {
    // Call OpenAI API securely with the API key from environment variables
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a Warren Buffett-style value investor bot.' },
          ...history,
          { role: 'user', content: userMessage }
        ]
      })
    });
    
    const data = await openaiResponse.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get a response from the value investor bot.' });
  }
});

// Financial metrics from Perplexity API
apiRouter.get('/perplexity-financial', async (req, res) => {
  const ticker = req.query.ticker;
  const metric = req.query.metric;
  
  if (!ticker || !metric) {
    return res.status(400).json({ error: 'Both ticker and metric are required' });
  }
  
  if (!PERPLEXITY_API_KEY) {
    return res.status(500).json({ error: 'Perplexity API key not configured.' });
  }
  
  try {
    // Create a specific query for the financial metric
    const query = `You are a financial data API that only returns numbers. 
    What is the exact numerical value for the ${metric} of ${ticker} stock?
    Respond with ONLY the numerical value, no text, symbols, or explanation.
    Example response: 15.7`;
    
    // Call Perplexity API securely with the API key from environment variables
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar',
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
        max_tokens: 30
      })
    });
    
    const data = await perplexityResponse.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const value = data.choices[0].message.content.trim();
      // Extract numerical value if possible
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return res.json({ metric, value: parseFloat(value).toString() });
      }
      return res.json({ metric, value });
    } else {
      return res.status(500).json({ error: 'Unexpected response format from Perplexity' });
    }
  } catch (err) {
    console.error('[Perplexity] Error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Feature Request endpoint
apiRouter.post('/feature-request', async (req, res) => {
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
    
    // Log the feature request (in a production app, you would save to a database)
    console.log(`[Feature Request] New request from ${email}:`, {
      featureRequest,
      marketingConsent: !!marketingConsent,
      timestamp: new Date().toISOString()
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Feature request received. Thank you for your feedback!' 
    });
  } catch (err) {
    console.error('[Feature Request] Error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Mount the router
app.use('/.netlify/functions/api', apiRouter);

// Export the serverless function
module.exports.handler = serverless(app);
