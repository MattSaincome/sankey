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
    const url = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=1&apikey=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    const statement = json[0];
    res.json({
      costOfRevenue: statement.costOfRevenue,
      grossProfit: statement.grossProfit,
      operatingExpenses: statement.operatingExpenses,
      operatingIncome: statement.operatingIncome,
      interestExpense: statement.interestExpense,
      incomeBeforeTax: statement.incomeBeforeTax,
      incomeTaxExpense: statement.incomeTaxExpense,
      netIncome: statement.netIncome
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// New endpoint for revenue segmentation
app.get('/api/revenue-segmentation', async (req, res) => {
  const ticker = req.query.ticker;
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });
  try {
    const url = `https://financialmodelingprep.com/stable/revenue-product-segmentation?symbol=${ticker}&structure=flat&period=annual&apikey=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'No segmentation data found' });
    }
    // Find the most recent record with a non-empty data object
    const latestWithData = json.find(j => j.data && Object.keys(j.data).length > 0);
    if (!latestWithData) {
      return res.status(404).json({ error: 'No segmentation data found' });
    }
    const segments = Object.entries(latestWithData.data)
      .map(([segment, revenue]) => ({ segment, revenue: Number(revenue) }))
      .filter(s => s.revenue > 0);
    res.json({ date: latestWithData.date, segments });
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
