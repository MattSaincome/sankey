/**
 * Buffett Wisdom Integration
 * 
 * This module provides a JavaScript interface to the Python-based Berkshire Hathaway
 * knowledge system, allowing the investor AI chatbot to incorporate authentic
 * Buffett wisdom from shareholder letters into its responses.
 */
const { spawn } = require('child_process');
const path = require('path');

// Path to the wisdom script
const WISDOM_SCRIPT_PATH = path.join(__dirname, 'buffett_wisdom_bridge.py');

/**
 * Get relevant Buffett wisdom for a query
 * 
 * @param {string} query - The user's question or topic
 * @param {Object} options - Optional parameters
 * @param {number} options.topK - Number of results to return
 * @param {Object} options.filters - Optional filters (year, topic)
 * @returns {Promise<Object>} - Buffett wisdom including quotes and contexts
 */
async function getBuffettWisdom(query, options = {}) {
  return new Promise((resolve, reject) => {
    // Default options
    const topK = options.topK || 3;
    const filters = options.filters || {};
    
    // Prepare arguments for the Python script using the new command-line interface
    const args = [
      WISDOM_SCRIPT_PATH,
      'query',
      query
    ];
    
    // Add top-k parameter
    args.push('--top-k', topK.toString());
    
    // Add filters if provided
    if (filters.year) {
      args.push('--year', filters.year.toString());
    }
    
    if (filters.topic) {
      args.push('--topic', filters.topic);
    }
    
    if (filters.years && Array.isArray(filters.years)) {
      args.push('--years', filters.years.join(','));
    }
    
    // Run the Python script
    console.log('[BuffettWisdom] Running Python script with args:', args);
    const pythonProcess = spawn('python', args);
    
    let output = '';
    let errorOutput = '';
    
    // Collect output
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    // Collect errors
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`[BuffettWisdom] Error: ${data.toString()}`);
    });
    
    // Handle completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[BuffettWisdom] Process exited with code ${code}`);
        console.error(`[BuffettWisdom] Error: ${errorOutput}`);
        // Return empty results instead of failing completely
        resolve({
          found: false,
          error: errorOutput,
          message: "Could not retrieve Buffett wisdom at this time."
        });
        return;
      }
      
      try {
        // Parse the JSON output
        const result = JSON.parse(output);
        resolve(result);
      } catch (error) {
        console.error('[BuffettWisdom] Failed to parse JSON output:', error);
        console.error('[BuffettWisdom] Raw output:', output);
        resolve({
          found: false,
          error: 'JSON parse error',
          message: "Error processing Buffett wisdom data."
        });
      }
    });
  });
}

/**
 * Enhance a chatbot response with relevant Buffett wisdom
 * 
 * @param {string} query - The user's original question
 * @param {string} response - The original AI response without Buffett wisdom
 * @returns {Promise<string>} - Enhanced response with Buffett wisdom
 */
async function enhanceResponseWithBuffettWisdom(query, response) {
  return new Promise((resolve, reject) => {
    try {
      // Using the new 'enhance' command
      const args = [
        WISDOM_SCRIPT_PATH,
        'enhance',
        query,
        response
      ];
      
      console.log('[BuffettWisdom] Running Python enhance script');
      const pythonProcess = spawn('python', args);
      
      let output = '';
      let errorOutput = '';
      
      // Collect output
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      // Collect errors
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`[BuffettWisdom] Error: ${data.toString()}`);
      });
      
      // Handle completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`[BuffettWisdom] Enhance process exited with code ${code}`);
          console.error(`[BuffettWisdom] Error: ${errorOutput}`);
          resolve(response); // Return original response on error
          return;
        }
        
        // The output should be the enhanced response
        if (output.trim()) {
          resolve(output.trim());
        } else {
          console.error('[BuffettWisdom] Empty response from enhance command');
          resolve(response);
        }
      });
    } catch (error) {
      console.error('[BuffettWisdom] Error enhancing response:', error);
      resolve(response); // Fall back to original response if enhancement fails
    }
  });
}

/**
 * Get a list of Buffett's investment principles based on letters
 * 
 * @returns {Promise<Array>} - List of investment principles with quotes
 */
async function getInvestmentPrinciples() {
  return new Promise((resolve, reject) => {
    try {
      // Using the new 'principles' command
      const args = [
        WISDOM_SCRIPT_PATH,
        'principles'
      ];
      
      console.log('[BuffettWisdom] Running Python principles script');
      const pythonProcess = spawn('python', args);
      
      let output = '';
      let errorOutput = '';
      
      // Collect output
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      // Collect errors
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`[BuffettWisdom] Error: ${data.toString()}`);
      });
      
      // Handle completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`[BuffettWisdom] Principles process exited with code ${code}`);
          console.error(`[BuffettWisdom] Error: ${errorOutput}`);
          resolve([]); // Return empty array on error
          return;
        }
        
        try {
          // Parse the JSON output
          const result = JSON.parse(output);
          resolve(result);
        } catch (error) {
          console.error('[BuffettWisdom] Failed to parse principles JSON:', error);
          console.error('[BuffettWisdom] Raw output:', output);
          resolve([]);
        }
      });
    } catch (error) {
      console.error('[BuffettWisdom] Error getting investment principles:', error);
      resolve([]); // Return empty array if something goes wrong
    }
  });
}

module.exports = {
  getBuffettWisdom,
  enhanceResponseWithBuffettWisdom,
  getInvestmentPrinciples
};
