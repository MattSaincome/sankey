// This file is used for local development with Netlify CLI
// It proxies requests to the Netlify Functions
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Parse JSON request bodies
app.use(express.json());

// Proxy all API requests to the serverless function
app.use('/api', (req, res) => {
  console.log(`[Netlify Proxy] ${req.method} ${req.url}`);
  res.redirect(307, `/.netlify/functions/api${req.url}`);
});

// All other routes serve the index.html file (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running for local Netlify development on http://localhost:${PORT}`);
});
