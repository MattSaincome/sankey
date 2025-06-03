// Fix final syntax issues in d3-sankey.js
const fs = require('fs');
const path = './public/d3-sankey.js';

// Read the file
let content = fs.readFileSync(path, 'utf8');

// The renderD3Sankey is assigned like: window.renderD3Sankey = async function(...) {
// So it should end with }; (brace followed by semicolon)
// But the IIFE callback should end with just })

// Replace the incorrect closing pattern
content = content.replace(
  /console\.log\('\[FLOW\] Sankey rendering complete with proper collision detection and viewport sizing'\);\s*\}\); \/\/ Close renderD3Sankey function\s*\}\); \/\/ Close IIFE/,
  "console.log('[FLOW] Sankey rendering complete with proper collision detection and viewport sizing');\n\n}; // Close renderD3Sankey function (async function assignment)\n\n}); // Close IIFE callback function"
);

// Write the file back
fs.writeFileSync(path, content);
console.log('Fixed final syntax structure');
