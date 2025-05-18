// Example integration with your Netlify functions API

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');

/**
 * Enhances a chatbot response with Berkshire Hathaway investment wisdom
 * @param {string} query - The user's original question
 * @param {string} baseResponse - The chatbot's initial response 
 * @returns {Promise<string>} - Enhanced response with Buffett wisdom
 */
async function enhanceWithBerkshireWisdom(query, baseResponse) {
  try {
    // Path to the Python script that will call the BerkshireKnowledge class
    const scriptPath = path.resolve(__dirname, '../berkshire_letters_rag/get_wisdom.py');
    
    // Sanitize inputs for shell command
    const sanitizedQuery = query.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const sanitizedResponse = baseResponse.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    // Execute the Python script to get Berkshire wisdom
    const { stdout } = await execPromise(
      `python "${scriptPath}" "${sanitizedQuery}" "${sanitizedResponse}"`
    );
    
    return stdout.trim();
  } catch (error) {
    console.error('Error enhancing response with Berkshire wisdom:', error);
    // Fallback to original response if enhancement fails
    return baseResponse;
  }
}

// Example of how to use this in your API handler
exports.handleInvestmentQuestion = async function(event) {
  // Get user query from event
  const { query } = JSON.parse(event.body);
  
  // Your existing logic to generate a base response
  const baseResponse = "Your existing AI response would go here";
  
  // Detect if query is related to investment principles or strategies
  const isInvestmentQuery = /invest|stock|market|value|buffett|berkshire|portfolio|dividend/i.test(query);
  
  if (isInvestmentQuery) {
    // Enhance the response with Berkshire wisdom
    const enhancedResponse = await enhanceWithBerkshireWisdom(query, baseResponse);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        response: enhancedResponse,
        source: "Includes wisdom from Berkshire Hathaway letters"
      })
    };
  }
  
  // For non-investment queries, return regular response
  return {
    statusCode: 200,
    body: JSON.stringify({ response: baseResponse })
  };
};
