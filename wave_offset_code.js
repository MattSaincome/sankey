    // ADD VERTICAL OFFSETS TO CREATE NATURAL WAVES
    // This ensures the Sankey diagram has beautiful flowing curves instead of straight lines
    nodes.forEach(node => {
      let offsetY = 0;
      
      // For Gross Profit, move it slightly down for unprofitable companies
      // This creates a natural wave from Revenue flowing up into it
      if (node.name === 'Gross Profit' && !isProfitable) {
        offsetY = 10; // Move down 10 pixels
      }
      
      // For SG&A Expenses, move it down to create a wave from Operating Expenses
      else if (node.name === 'SG&A Expenses') {
        offsetY = 15; // Move down 15 pixels
      }
      
      // For Cost of Revenue, move it slightly up
      else if (node.name === 'Cost of Revenue') {
        offsetY = -8; // Move up 8 pixels
      }
      
      // For Operating Loss, keep at top (no offset)
      else if (node.name === 'Operating Loss') {
        offsetY = 0;
      }
      
      // For Income Before Taxes, slight downward movement
      else if (node.name === 'Income Before Taxes') {
        offsetY = 5;
      }
      
      // Apply the offset to both y0 and y1
      if (offsetY !== 0) {
        node.y0 += offsetY;
        node.y1 += offsetY;
        
        console.log(`[Wave Offset] ${node.name}: offset=${offsetY}, new y0=${node.y0}, y1=${node.y1}`);
      }
    });
    
    // Re-run assignLinkSlots to update link positions after node offsets
    assignLinkSlots(nodes, layoutLinks);
