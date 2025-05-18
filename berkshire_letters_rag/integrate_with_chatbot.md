# Integrating Berkshire Hathaway Knowledge with Your Investor AI Chatbot

This guide explains how to integrate the Berkshire Hathaway letter knowledge system with your existing AI chatbot to enhance responses with Warren Buffett's investment wisdom.

## Integration Steps

### 1. Import the `BerkshireKnowledge` Class

In your chatbot's main file (likely in the API routes or response generation logic), import the Berkshire knowledge module:

```python
from berkshire_letters_rag.berkshire_knowledge import BerkshireKnowledge

# Initialize the knowledge system (do this once, perhaps as a global variable or singleton)
berkshire_knowledge = BerkshireKnowledge()
```

### 2. Enhance Chatbot Responses

Modify your chatbot's response generation logic to incorporate Berkshire wisdom. There are two main approaches:

#### Option A: Enhance Existing Responses

```python
# After generating your base LLM response
def get_chatbot_response(user_query):
    # Get your regular chatbot response first
    base_response = your_existing_llm_function(user_query)
    
    # Enhance it with Berkshire wisdom
    enhanced_response = berkshire_knowledge.generate_response_with_berkshire_wisdom(
        user_query, 
        base_response
    )
    
    return enhanced_response
```

#### Option B: Use as Retrieval Context

If your chatbot uses a retrieval-augmented generation approach already:

```python
def get_rag_context(user_query):
    # Get your existing context sources
    existing_context = your_existing_retrieval_function(user_query)
    
    # Add Berkshire wisdom as additional context
    buffett_wisdom = berkshire_knowledge.get_buffett_wisdom(user_query)
    
    if buffett_wisdom["found"]:
        # Add the top quotes to your context
        for quote in buffett_wisdom["quotes"]:
            existing_context += f"\nFrom Berkshire's {quote['year']} letter: {quote['text']}\n"
    
    return existing_context
```

### 3. Add Special Commands (Optional)

You can also add special commands to explicitly request Buffett's wisdom:

```python
def process_user_query(user_query):
    # Check for special commands
    if "buffett principles" in user_query.lower():
        principles = berkshire_knowledge.get_investment_principles()
        response = "Warren Buffett's key investment principles from his letters:\n\n"
        for i, principle in enumerate(principles):
            response += f"{i+1}. {principle['principle'].title()}: \"{principle['quote']}\" ({principle['year']})\n\n"
        return response
        
    # Otherwise process normally
    return get_chatbot_response(user_query)
```

## API Reference

### Main Methods

1. `get_buffett_wisdom(query, top_k=3, filters=None)`
   - Returns relevant quotes and context from Berkshire letters
   - Optional filters by year or topic

2. `generate_response_with_berkshire_wisdom(user_query, base_response)`
   - Takes a base response and enhances it with relevant Buffett wisdom

3. `get_investment_principles()`
   - Returns a curated list of Buffett's key investment principles

### Example Filters

Filter by specific years:
```python
wisdom = berkshire_knowledge.get_buffett_wisdom(
    "market crashes", 
    filters={"years": [2008, 2009]}
)
```

Filter by topic:
```python
wisdom = berkshire_knowledge.get_buffett_wisdom(
    "insurance operations", 
    filters={"topic": "insurance"}
)
```

## Implementation Example for `api.js`

If your chatbot uses a JavaScript API with the Netlify functions (as seen in your open files), you could add this integration via a Python subprocess call or by setting up a local endpoint that your JS API can call.

For example, in your `netlify/functions/api.js` file:

```javascript
// Add this to your existing API endpoint
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// In your API handler
exports.handler = async function(event, context) {
  const { query } = JSON.parse(event.body);
  
  // Get your basic response from your existing chatbot logic
  const baseResponse = yourExistingChatbotLogic(query);
  
  // Enhance with Berkshire wisdom
  try {
    const { stdout } = await execPromise(
      `python -c "from berkshire_letters_rag.berkshire_knowledge import BerkshireKnowledge; 
      knowledge = BerkshireKnowledge(); 
      print(knowledge.generate_response_with_berkshire_wisdom('${query.replace("'", "\\'")}', '${baseResponse.replace("'", "\\'")}'))"
      `
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ response: stdout })
    };
  } catch (error) {
    // Fallback to base response if enhancement fails
    return {
      statusCode: 200,
      body: JSON.stringify({ response: baseResponse })
    };
  }
};
```

## Next Steps

1. Adjust the chunking and retrieval parameters in `berkshire_knowledge.py` if needed for your specific use case
2. Consider adding a caching layer if your chatbot has high traffic
3. Test thoroughly with various investment-related queries to ensure relevant Buffett wisdom is being incorporated
