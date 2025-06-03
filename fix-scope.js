// Fix the scope issue - move code inside renderD3Sankey function
const fs = require('fs');
const path = './public/d3-sankey.js';

let content = fs.readFileSync(path, 'utf8');

// The issue is that the renderD3Sankey function closes at line 3045,
// but all the assignLinkSlots and execution code is outside it.
// We need to move the closing of renderD3Sankey to the very end.

// Find where renderD3Sankey currently ends and remove that closing
content = content.replace(
  /(\s+}\s+(?:\/\/ .*)?)\s*\/\/ Implement the missing assignLinkSlots function/,
  '\n// Implement the missing assignLinkSlots function'
);

// The closing should be where we currently have "}; // Close renderD3Sankey function"
// That's the correct place for it to end.

fs.writeFileSync(path, content);
console.log('Fixed function scope - moved closing brace');
