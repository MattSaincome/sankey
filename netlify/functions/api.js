/**
 * Netlify Function Handler
 * 
 * This file is the entry point for the Netlify Functions serverless deployment.
 * It simply imports the Express app from server.js and exports it as a serverless handler.
 */

const serverless = require('serverless-http');
const app = require('../../server');

// Export the serverless function handler
exports.handler = serverless(app);
