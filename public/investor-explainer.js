/**
 * Investor Term Explainer
 * 
 * This module provides functionality to explain investment terms in bot messages
 * with a toggle switch that shows/hides explanations in real-time.
 */

const investorExplainer = {
  // Collection of financial terms and their explanations
  terms: {
    // Valuation terms
    "P/E ratio": "Price-to-Earnings ratio, which compares a company's stock price to its earnings per share. Lower values may indicate undervaluation.",
    "P/E": "Price-to-Earnings ratio, which compares a company's stock price to its earnings per share. Lower values may indicate undervaluation.",
    "P/B ratio": "Price-to-Book ratio, which compares a company's market value to its book value. Lower values may indicate undervaluation.",
    "P/B": "Price-to-Book ratio, which compares a company's market value to its book value. Lower values may indicate undervaluation.",
    "price to book": "Price-to-Book ratio, which compares a company's market value to its book value. Lower values may indicate undervaluation.",
    "PEG ratio": "Price/Earnings-to-Growth ratio, which factors growth into P/E valuation. Values below 1.0 often suggest undervaluation.",
    "PEG": "Price/Earnings-to-Growth ratio, which factors growth into P/E valuation. Values below 1.0 often suggest undervaluation.",
    "P/S ratio": "Price-to-Sales ratio, which compares a company's stock price to its revenue per share. Lower values may indicate undervaluation.",
    "P/S": "Price-to-Sales ratio, which compares a company's stock price to its revenue per share. Lower values may indicate undervaluation.",
    "price to sales": "Price-to-Sales ratio, which compares a company's stock price to its revenue per share. Lower values may indicate undervaluation.",
    "EV/EBITDA": "Enterprise Value to EBITDA ratio, which helps compare companies with different debt levels. Lower values may indicate undervaluation.",
    "Price/FCF": "Price to Free Cash Flow ratio, comparing market price to free cash flow. Lower values may indicate undervaluation.",
    "DCF": "Discounted Cash Flow, a valuation method that estimates the value of an investment based on its expected future cash flows.",
    "NPV": "Net Present Value, the difference between the present value of cash inflows and outflows over time.",
    "IRR": "Internal Rate of Return, the annual rate of growth an investment is expected to generate.",
    "intrinsic value": "The actual value of a company or asset based on its underlying fundamentals, regardless of market price.",
    "margin of safety": "The difference between a stock's intrinsic value and its market price, providing a buffer against errors in analysis.",
    "WACC": "Weighted Average Cost of Capital, the average rate a company is expected to pay to finance its assets.",
    
    // Financial metrics
    "ROE": "Return on Equity, which measures a company's profitability relative to shareholders' equity.",
    "return on equity": "A measure of a company's profitability relative to shareholders' equity.",
    "ROA": "Return on Assets, which measures a company's profitability relative to its total assets.",
    "return on assets": "A measure of a company's profitability relative to its total assets.",
    "ROIC": "Return on Invested Capital, which measures how efficiently a company uses its capital to generate profits.",
    "return on invested capital": "A measure of how efficiently a company uses its capital to generate profits.",
    "FCF": "Free Cash Flow, the cash a company generates after accounting for capital expenditures.",
    "free cash flow": "The cash a company generates after accounting for capital expenditures and other required investments.",
    "FCF yield": "Free Cash Flow Yield, which compares a company's free cash flow per share to its market price.",
    "EPS": "Earnings Per Share, the portion of a company's profit allocated to each outstanding share of common stock.",
    "earnings per share": "The portion of a company's profit allocated to each outstanding share of common stock.",
    "EBITDA": "Earnings Before Interest, Taxes, Depreciation, and Amortization, a measure of a company's operational performance.",
    "gross margin": "The percentage of revenue that exceeds the cost of goods sold, indicating profitability of core operations.",
    "net margin": "The percentage of revenue remaining after all expenses, taxes, and costs have been deducted.",
    "operating margin": "The percentage of revenue remaining after operating expenses are deducted, showing operational efficiency.",
    "profit margin": "The percentage of revenue that is profit, typically referring to net profit margin.",
    "CAGR": "Compound Annual Growth Rate, the mean annual growth rate over a specified period longer than one year.",
    "YoY": "Year-over-Year, comparing data from one period with the same period in the previous year.",
    "QoQ": "Quarter-over-Quarter, comparing data from one quarter with the previous quarter.",
    
    // Investment concepts
    "moat": "A sustainable competitive advantage that protects a company from competitors, like brand strength or patents.",
    "economic moat": "A sustainable competitive advantage that protects a company from competitors, like brand strength or patents.",
    "competitive advantage": "A condition that puts a company in a favorable position compared to its competitors.",
    "dividend yield": "Annual dividend payments divided by stock price, showing return from dividends as a percentage.",
    "dividend": "A payment made by a corporation to its shareholders, usually in the form of cash or additional shares.",
    "dividend payout ratio": "The percentage of earnings paid to shareholders as dividends.",
    "capital allocation": "How a company distributes its financial resources among different investment opportunities.",
    "balance sheet": "A financial statement showing a company's assets, liabilities, and shareholders' equity at a specific point in time.",
    "income statement": "A financial statement showing revenues, expenses, and profits over a period of time.",
    "cash flow statement": "A financial statement showing cash inflows and outflows during a period of time.",
    "diversification": "Spreading investments across various assets to reduce risk.",
    "compounding": "The process where the value of an investment increases because earnings on an investment earn interest as time passes.",
    "value investing": "An investment strategy that focuses on buying undervalued stocks relative to their intrinsic value.",
    "growth investing": "An investment strategy that focuses on stocks with above-average growth potential, regardless of valuation.",
    "fundamental analysis": "Evaluating a security by examining related economic, financial, and other qualitative and quantitative factors.",
    "technical analysis": "Evaluating investments based on market activity, such as price movements and volume.",
    
    // Financial ratios
    "debt-to-equity": "A ratio comparing a company's total debt to its shareholders' equity, indicating financial leverage.",
    "debt-to-equity ratio": "A ratio comparing a company's total debt to its shareholders' equity, indicating financial leverage.",
    "current ratio": "A ratio comparing a company's current assets to its current liabilities, indicating short-term liquidity.",
    "quick ratio": "A ratio comparing a company's most liquid assets to its current liabilities, indicating immediate liquidity.",
    "acid-test ratio": "Another term for quick ratio, measuring a company's ability to pay short-term obligations with its most liquid assets.",
    "price-to-sales": "A ratio comparing a company's market capitalization to its revenue, useful for valuing unprofitable companies.",
    "price-to-sales ratio": "A ratio comparing a company's market capitalization to its revenue, useful for valuing unprofitable companies.",
    "enterprise value": "The total value of a company, including market cap, debt, and excluding cash.",
    "EV": "Enterprise Value, the total value of a company, including market cap, debt, and excluding cash.",
    "EBITDA margin": "EBITDA as a percentage of total revenue, indicating operational profitability.",
    "interest coverage ratio": "A ratio indicating how easily a company can pay interest on its outstanding debt.",
    "inventory turnover": "A ratio showing how many times a company's inventory is sold and replaced over a period.",
    "asset turnover": "A ratio indicating how efficiently a company is using its assets to generate revenue.",
    
    // Business terms
    "CAPEX": "Capital Expenditure, funds used by a company to acquire or upgrade physical assets like property, plants, or equipment.",
    "capital expenditure": "Funds used by a company to acquire or upgrade physical assets like property, plants, or equipment.",
    "OPEX": "Operating Expense, the ongoing costs a company incurs to run its basic business operations.",
    "operating expense": "The ongoing costs a company incurs to run its basic business operations.",
    "SG&A": "Selling, General and Administrative expenses, which include all daily operational costs not directly related to making a product.",
    "R&D": "Research and Development, activities companies undertake to innovate and introduce new products or services.",
    "COGS": "Cost of Goods Sold, the direct costs attributable to the production of goods sold by a company.",
    "cost of goods sold": "The direct costs attributable to the production of goods sold by a company.",
    "gross profit": "Revenue minus cost of goods sold, representing the profit a company makes after deducting the costs associated with making and selling its products.",
    "net income": "A company's total earnings or profit after all expenses and taxes have been deducted.",
    "revenue": "The total amount of money generated by a company through its business activities.",
    
    // Market terms
    "market cap": "Market Capitalization, the total value of a company's outstanding shares.",
    "market capitalization": "The total value of a company's outstanding shares, calculated by multiplying the stock price by the number of shares outstanding.",
    "float": "The number of shares available for public trading, excluding restricted shares.",
    "short interest": "The percentage of a company's shares that have been sold short by investors.",
    "beta": "A measure of a stock's volatility compared to the overall market. A beta greater than 1 indicates higher volatility.",
    "alpha": "Excess return of an investment relative to a benchmark index.",
    "bull market": "A market condition where prices are rising or expected to rise.",
    "bear market": "A market condition where prices are falling or expected to fall.",
    "volatility": "The degree of variation in trading prices over time, often measured by standard deviation.",
    "liquidity": "How easily an asset can be converted to cash without affecting its market price.",
    "IPO": "Initial Public Offering, when a private company first offers shares to the public.",
    "M&A": "Mergers and Acquisitions, consolidation of companies through various financial transactions.",
    "Yield curve": "A line that plots interest rates of bonds with equal credit quality but differing maturity dates.",
    "book value": "The net asset value of a company, calculated as total assets minus intangible assets and liabilities.",
    "YTD": "Year-to-Date, referring to the period beginning January 1 of the current year up to a specified date."
  },
  
  // Inject CSS fix for height expansion issues
  injectHeightFix: function() {
    // Check if our fix is already injected
    if (document.getElementById('investor-explainer-height-fix')) {
      return;
    }
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'investor-explainer-height-fix';
    
    // Set ultra-specific CSS that targets ONLY height/vertical overflow issues
    // while preserving horizontal constraints
    styleEl.textContent = `
      /* Nuclear height fix for bot messages */
      html body .value-bot-message.bot,
      html body div.value-bot-message.bot,
      html body .bot.message,
      html body .bot.assistant,
      html body .message.bot {
        min-height: auto !important;
        max-height: none !important;
        height: auto !important;
        overflow-y: visible !important;
      }
      
      html body .message-content,
      html body div.message-content,
      html body .value-bot-message.bot .message-content,
      html body .bot .message-content,
      html body .message .message-content {
        min-height: auto !important;
        max-height: none !important;
        height: auto !important;
        overflow-y: visible !important;
        line-height: 1.7 !important;
      }
      
      html body .message-content p,
      html body .value-bot-message.bot p,
      html body .bot p,
      html body .message p {
        margin-bottom: 0.75em !important;
      }
      
      html body .message-content blockquote,
      html body .value-bot-message.bot blockquote,
      html body .bot blockquote,
      html body .message blockquote {
        min-height: auto !important;
        max-height: none !important;
        height: auto !important;
        overflow-y: visible !important;
        margin: 1em 0 1em 20px !important;
        padding-left: 15px !important;
        border-left: 3px solid #555 !important;
        font-style: italic !important;
      }
    `;
    
    // Add to document head
    document.head.appendChild(styleEl);
    console.log('[Investor Explainer] Injected height fix stylesheet');
  },
  
  // Initialize the explainer functionality
  initialize: function() {
    // First inject the height fix
    this.injectHeightFix();
    
    // Then continue with normal initialization
    console.log('[Investor Explainer] Initializing...');
    
    // Add toggles to any existing messages
    this.addExplainerTogglesToBotMessages();
    
    // Set up observer for new messages
    this.setupMessageObserver();
    
    console.log('[Investor Explainer] Initialization complete');
  },
  
  // Add toggles to all bot messages with financial content
  addExplainerTogglesToBotMessages: function() {
    // First, clean up any duplicate toggles that might exist
    this.cleanupDuplicateToggles();
    
    // Find all likely bot message containers
    const botMessages = document.querySelectorAll('.value-bot-message.bot, .bot, .assistant, .message');
    let messagesProcessed = 0;
    let togglesAdded = 0;
    
    // Process each potential bot message
    botMessages.forEach(message => {
      // Skip empty messages
      if (!message.textContent || message.textContent.length < 30) {
        return;
      }
      
      messagesProcessed++;
      
      // Skip if already has an explainer toggle
      if (message.querySelector('.explainer-switch')) {
        // If there is already a toggle, we've processed this message
        return;
      }
      
      // Skip inputs, form elements, or non-message elements
      if (message.querySelector('input') || 
          message.querySelector('button') || 
          message.tagName === 'INPUT' ||
          message.tagName === 'BUTTON') {
        return;
      }
      
      // Find message content - look for a content div or use the message itself
      const messageContent = message.querySelector('.message-content') || message;
      const messageText = messageContent.textContent || '';
      
      // Skip welcome messages that don't need explanation
      if ((messageText.toLowerCase().includes('welcome') && 
           messageText.toLowerCase().includes('help')) ||
          (messageText.toLowerCase().includes('hello') && 
           messageText.toLowerCase().includes('assist'))) {
        return;
      }
      
      // Check if the message contains financial terms that need explaining
      const hasFinancialTerms = this.hasFinancialTerms(messageText);
      
      // Skip messages without financial terms
      if (!hasFinancialTerms) {
        return;
      }
      
      // Create and append toggle
      try {
        // First make sure the message has proper positioning context for absolute positioning
        message.style.setProperty('position', 'relative', 'important');
        message.style.setProperty('overflow', 'hidden', 'important');
        
        // If there's a specific message content container, ensure proper overflow
        const messageContent = message.querySelector('.message-content');
        if (messageContent) {
          messageContent.style.setProperty('overflow', 'hidden', 'important');
        }
        
        // Create the toggle
        const toggle = this.createExplainerToggle();
        
        // Force proper positioning on the parent message container
        message.style.setProperty('position', 'relative', 'important');
        message.style.setProperty('overflow', 'hidden', 'important');
        
        // Add the toggle to the message
        message.appendChild(toggle);
        
        // Ensure the toggle is positioned at the bottom right
        toggle.style.position = 'absolute';
        toggle.style.right = '8px';
        toggle.style.bottom = '8px';
        toggle.style.top = 'auto';
        toggle.style.left = 'auto';
        togglesAdded++;
        
        console.log(`[Investor Explainer] Added toggle to message containing financial terms`);
      } catch (err) {
        console.error('[Investor Explainer] Error adding toggle:', err);
      }
    });
    
    if (togglesAdded > 0) {
      console.log(`[Investor Explainer] Processed ${messagesProcessed} messages, added ${togglesAdded} toggles`);
    }
  },
  
  // Clean up any duplicate toggles
  cleanupDuplicateToggles: function() {
    // Find all bot message containers
    const botMessages = document.querySelectorAll('.value-bot-message.bot, .bot, .assistant, .message');
    
    botMessages.forEach(message => {
      // Find all toggles in this message
      const toggles = message.querySelectorAll('.explainer-switch');
      
      // If there are multiple toggles, remove all but the first one
      if (toggles.length > 1) {
        console.log(`[Investor Explainer] Found ${toggles.length} toggles in one message, removing duplicates`);
        
        // Keep the first toggle, remove the rest
        for (let i = 1; i < toggles.length; i++) {
          toggles[i].remove();
        }
      }
      
      // Ensure message has proper positioning so toggle can be at bottom right
      if (message.querySelector('.explainer-switch')) {
        message.style.setProperty('position', 'relative', 'important');
        message.style.setProperty('overflow', 'hidden', 'important');
      }
    });
  },
  
  // Check if text contains financial terms that need explanation
  hasFinancialTerms: function(text) {
    if (!text) return false;
    
    // Almost always return true for bot messages, unless they're very short
    // or obvious welcome messages - this makes the explainer much more aggressive
    if (text.length > 100 && 
        !text.toLowerCase().includes('welcome') && 
        !text.toLowerCase().includes('hello')) {
      return true;
    }
    
    // Otherwise, check for specific financial terms from our dictionary
    for (const term in this.terms) {
      // Create a regex that matches the term as a whole word
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) return true;
    }
    
    // Also check for common financial indicators
    const financialIndicators = [
      /ratio/i, /margin/i, /equity/i, /debt/i, /asset/i, /liability/i,
      /dividend/i, /earnings/i, /profit/i, /revenue/i, /interest/i, /cash flow/i,
      /investment/i, /capital/i, /stock/i, /share/i, /market/i, /valuation/i,
      /price/i, /growth/i, /value/i, /intrinsic/i, /book value/i, /yield/i,
      /allocation/i, /sector/i, /industry/i, /portfolio/i, /diversification/i,
      /volatility/i, /risk/i, /return/i, /performance/i, /analysis/i, /metric/i,
      /liquidity/i, /solvency/i, /leverage/i, /efficiency/i, /profitability/i,
      /\bROI\b/i, /\bROA\b/i, /\bP\/E\b/i, /\bROE\b/i, /\bROIC\b/i, /\bEBIT/i, /\bEPS\b/i,
      /\bFCF\b/i, /\bDCF\b/i, /\bNPV\b/i, /\bIRR\b/i, /\bWACC\b/i, /\bCAPM\b/i,
      /\bIPO\b/i, /\bM&A\b/i, /\bP\/B\b/i, /\bP\/S\b/i, /\bEV\b/i, /\bPEG\b/i,
      /\bCAPEX\b/i, /\bOPEX\b/i, /\bCOGS\b/i, /\bSG&A\b/i, /\bEBITDA\b/i, /\bFFO\b/i
    ];
    
    return financialIndicators.some(indicator => indicator.test(text));
  },
  
  // Create explainer toggle switch element
  createExplainerToggle: function() {
    // Create container for switch
    const container = document.createElement('div');
    container.className = 'explainer-switch';
    
    // Position in bottom right with improved styling
    container.style.position = 'absolute';
    container.style.right = '10px';
    container.style.bottom = '10px';
    container.style.top = 'auto';
    container.style.left = 'auto';
    container.style.height = 'auto';
    container.style.maxHeight = '28px';
    container.style.minHeight = '0';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.setProperty('background-color', 'rgba(25, 33, 45, 0.95)', 'important');
    container.style.padding = '3px 8px';
    container.style.borderRadius = '20px';
    container.style.boxShadow = 'rgba(76, 201, 240, 0.4) 0px 2px 10px';
    container.style.border = '1px solid rgba(76, 201, 240, 0.6)';
    container.style.cursor = 'pointer';
    container.style.opacity = '1';
    container.style.transition = 'all 0.3s ease';
    container.style.transform = 'scale(1)';
    container.style.animation = 'pulse 1.5s ease'
    
    // IMPORTANT: Apply styles direct to the message container
    const messageContainer = container.closest('.bot') || container;
    messageContainer.style.setProperty('position', 'relative', 'important');
    messageContainer.style.setProperty('overflow', 'hidden', 'important');
    
    // Create toggle UI with modern, sleek design
    container.innerHTML = `
      <label class="switch" style="position: relative; display: inline-block; width: 34px; height: 18px; margin-right: 6px; background: transparent !important; border: none !important;">
        <input type="checkbox" class="explainer-toggle" style="opacity:0; position:absolute; width:1px; height:1px; left:-9999px; top:-9999px; margin:0; padding:0; border:none !important; overflow:hidden; background:transparent !important; -webkit-appearance:none; -moz-appearance:none; appearance:none; visibility: hidden !important;">
        <span class="slider" style="position: absolute; cursor: pointer; inset: 0; background-color: rgba(30, 40, 56, 0.6) !important; border-radius: 20px; transition: all 0.3s ease;">
          <span class="knob" style="position: absolute; height: 14px; width: 14px; left: 2px; top: 2px; background-color: rgb(76, 201, 240); border-radius: 50%; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></span>
        </span>
      </label>
      <span class="switch-label" style="font-size: 0.75em; color: rgb(115, 215, 255); font-weight: 500; letter-spacing: 0.03em; text-shadow: 0 0 3px rgba(76, 201, 240, 0.3);">Explain</span>
    `;
    
    // Add enhanced animations
    if (!document.querySelector('#explainer-pulse-animation')) {
      const style = document.createElement('style');
      style.id = 'explainer-pulse-animation';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .explainer-switch:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 0 12px rgba(76, 201, 240, 0.6) !important;
        }
        
        /* Checked state styles */
        .explainer-switch input:checked + .slider {
          background-color: rgba(76, 201, 240, 0.2) !important;
        }
        
        .explainer-switch input:checked + .slider .knob {
          transform: translateX(16px);
          background-color: rgb(115, 215, 255) !important;
        }
        
        .explanation, .explanation.visible {
          display: inline-block !important;
          max-width: 100% !important;
          white-space: normal !important;
        }
        
        .explanation.typing {
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: opacity 0.3s, max-height 0.5s;
        }
        
        .explanation.typing.visible {
          opacity: 1;
          max-height: 50px;
        }
        
        .value-bot-message.bot, .bot, .assistant, .message {
          max-width: 100% !important;
          width: 100% !important;
          min-width: 0 !important;
          flex: 1 1 auto;
          box-sizing: border-box !important;
          overflow-wrap: break-word !important; /* Ensure text wraps */
          word-wrap: break-word !important; /* Legacy support for text wrapping */
          /* overflow: hidden !important; */ /* Allow inner scroll - COMMENTED OUT */
          max-height: 500px !important; /* Changed back from height */
          display: block !important; /* Ensure block behavior */
        }
        
        .message-content {
          max-width: 100% !important;
          width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
          overflow-wrap: break-word !important; /* Ensure text wraps */
          word-wrap: break-word !important; /* Legacy support for text wrapping */
          overflow-x: hidden !important; /* Hide horizontal scrollbar */
          overflow-y: auto !important;   /* Allow vertical scroll if content overflows */
          max-height: 450px !important;   /* Fixed pixel max-height, < parent */
          display: block !important; /* Ensure block behavior */
          position: relative !important; /* Re-added for positioning context */
          white-space: normal !important; /* Ensure normal whitespace handling */
          line-height: 1.7 !important; /* Increased line height for readability */
        }
        
        .message-content p {
          margin-bottom: 0.75em !important;
        }
        
        .message-content ul, .message-content ol {
          margin-bottom: 0.75em !important;
          padding-left: 1.5em !important; /* Ensure lists are indented */
        }
        
        .message-content li {
          margin-bottom: 0.3em !important;
        }
        
        .message-content blockquote {
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
          margin-top: 1em !important;
          margin-bottom: 1em !important;
          margin-left: 20px !important;
          padding-left: 15px !important;
          border-left: 3px solid #555 !important;
          font-style: italic !important;
          color: #ccc !important; /* Lighter color for quote text if desired */
        }
        
        .explanation {
          display: inline-block !important;
          color: #4CC9F0;
          font-style: italic; /* Restored */
          font-size: 0.9em;
          margin-left: 3px;
          padding: 0.1em 0.3em !important; /* Back to original padding */
          border-radius: 4px;
          cursor: help;
          max-width: 100% !important; /* Ensure it doesn't expand parent */
          
          /* Crucial text wrapping properties */
          overflow-wrap: break-word !important;
          word-wrap: break-word !important; /* Older browsers */
          word-break: break-word !important; /* More aggressive if needed */
          white-space: normal !important;   /* Override any nowrap */
          hyphens: auto !important;
          line-height: 1.5 !important; /* Robust line height */
          vertical-align: baseline !important; /* Standard alignment */
          
          box-sizing: border-box !important;
          
          /* Base transition for non-animation properties like color, background */
          transition: background-color 0.3s, color 0.3s;
        }
        
        .explanation.typing {
          opacity: 0;
          transition: opacity 0.3s ease-out, background-color 0.3s, color 0.3s;
        }
        
        .explanation.visible { /* Class added to .explanation.typing to trigger animation */
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add click event to the entire toggle container
    const self = this; // Store reference to investorExplainer
    container.addEventListener('click', function(e) {
      // Prevent any default behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Find the closest bot message content
      const messageElement = this.closest('.bot');
      const messageContent = messageElement ? messageElement.querySelector('.message-content') : null;
      
      if (!messageContent) {
        console.error('[Investor Explainer] Could not find message content');
        return;
      }
      
      // Get toggle checkbox and toggle it
      const toggleCheckbox = this.querySelector('.explainer-toggle');
      toggleCheckbox.checked = !toggleCheckbox.checked;
      
      const sliderSpan = this.querySelector('.slider'); // Get the slider span

      if (toggleCheckbox.checked) {
        // First, store the original HTML if not already stored
        if (!messageContent.dataset.originalHtml) {
          messageContent.dataset.originalHtml = messageContent.innerHTML;
        }
        
        self.processAndAddExplanations(messageContent);
        
        // Update toggle style for 'on' state
        sliderSpan.style.backgroundColor = 'rgba(76, 201, 240, 0.2)'; // Light blue for 'on'
        sliderSpan.style.borderColor = 'rgba(76, 201, 240, 0.8)'; // Keep border color or adjust as needed
        this.querySelector('.knob').style.transform = 'translateX(12px)';
        this.querySelector('.switch-label').textContent = 'Hide';
      } else {
        self.removeExplanations(messageContent);
        // Update toggle style for 'off' state
        sliderSpan.style.backgroundColor = 'transparent'; // Make slider track transparent when off
        sliderSpan.style.borderColor = 'transparent'; // Invisible border when off
        this.querySelector('.knob').style.transform = 'translateX(0px)';
        this.querySelector('.switch-label').textContent = 'Explain';
      }
    });
    
    // Add hover effects
    container.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.15)';
    });
    
    container.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    return container;
  },
  
  // Process message content and add explanations
  processAndAddExplanations: function(messageContent) {
    if (!messageContent) {
      console.error('[Investor Explainer] No message content to process');
      return;
    }
    
    // Store original content if not already stored
    if (!messageContent.dataset.originalHtml) {
      messageContent.dataset.originalHtml = messageContent.innerHTML;
    }
    
    // Ensure the message container has proper overflow settings
    const messageContainer = messageContent.closest('.bot') || messageContent.parentElement;
    if (messageContainer) {
      messageContainer.style.setProperty('overflow', 'visible', 'important');
      messageContainer.style.setProperty('height', 'auto', 'important');
      messageContainer.style.setProperty('max-height', 'none', 'important');
      messageContainer.style.setProperty('word-wrap', 'break-word', 'important'); // Also ensure word wrap
      messageContainer.style.setProperty('overflow-wrap', 'break-word', 'important'); // And overflow wrap
    }
    
    // Get the message HTML
    let html = messageContent.dataset.originalHtml;
    
    // Track which terms we've already explained in this message
    const explainedTerms = new Set();
    
    // Process financial terms
    Object.entries(this.terms).forEach(([term, explanation]) => {
      // Escape special regex characters
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Match whole words only
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
      
      // Only explain the first occurrence of each term
      let isFirstOccurrence = true;
      
      html = html.replace(regex, (match) => {
        if (isFirstOccurrence && !explainedTerms.has(term.toLowerCase())) {
          explainedTerms.add(term.toLowerCase());
          isFirstOccurrence = false;
          return `${match}<span class="explanation typing" data-term="${term}"> (${explanation})</span>`;
        }
        return match;
      });
    });
    
    // Process acronyms
    const acronyms = {
      'P/E': 'Price-to-Earnings ratio',
      'P/B': 'Price-to-Book ratio',
      'ROE': 'Return on Equity',
      'ROIC': 'Return on Invested Capital',
      'FCF': 'Free Cash Flow',
      'EPS': 'Earnings Per Share',
      'EBITDA': 'Earnings Before Interest, Taxes, Depreciation, and Amortization',
      'PEG': 'Price/Earnings-to-Growth ratio',
      'DCF': 'Discounted Cash Flow',
      'WACC': 'Weighted Average Cost of Capital'
    };
    
    Object.entries(acronyms).forEach(([acronym, fullName]) => {
      // Skip if already explained a similar term
      if (explainedTerms.has(acronym.toLowerCase())) {
        return;
      }
      
      const escapedAcronym = acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedAcronym}s?\\b`, 'gi');
      
      // Check if the term exists in the content
      if (!regex.test(html)) return;
      
      // Only explain the first occurrence
      let isFirstOccurrence = true;
      
      html = html.replace(regex, (match) => {
        if (isFirstOccurrence) {
          explainedTerms.add(acronym.toLowerCase());
          isFirstOccurrence = false;
          
          // Format the explanation to appear on a new line if the explanation is lengthy
          const formattedExplanation = fullName.length > 40 ? 
            `<span class="explanation typing" data-term="${acronym}"><br>→ <i>${fullName}</i></span>` : 
            `<span class="explanation typing" data-term="${acronym}"> (${fullName})</span>`;
          
          return `<span style="color: #4CC9F0">${match}</span>${formattedExplanation}`;
        }
        return match;
      });
    });
    
    // Update content
    messageContent.innerHTML = html;
    
    // Add typing effect
    this.animateExplanations(messageContent.querySelectorAll('.explanation'));
    
    // After all explanations are added and DOM is manipulated:
    // Force override conflicting inline styles that might be set elsewhere.
    const valueBotMessageElement = messageContent.closest('.value-bot-message.bot, .bot, .assistant, .message');
    const messageContentElement = messageContent;

    if (valueBotMessageElement && messageContentElement) {
      const elementsToObserve = [valueBotMessageElement, messageContentElement];
      const blockquotesInMessage = messageContentElement.querySelectorAll('blockquote');
      blockquotesInMessage.forEach(bq => elementsToObserve.push(bq));

      const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const targetElement = mutation.target;
            // Unconditionally re-apply desired styles on any style change for observed elements
            // console.log(`[Investor Explainer] Style mutation on ${targetElement.tagName}, re-enforcing styles.`);
            targetElement.style.setProperty('overflow', 'visible', 'important');
            targetElement.style.setProperty('height', 'auto', 'important');
            targetElement.style.setProperty('max-height', 'none', 'important');

            if (targetElement === valueBotMessageElement) {
              targetElement.style.setProperty('padding', '15px', 'important');
              targetElement.style.setProperty('box-sizing', 'border-box', 'important');
            } else if (targetElement === messageContentElement || targetElement.tagName === 'BLOCKQUOTE') {
              targetElement.style.setProperty('box-sizing', 'border-box', 'important');
            }
          }
        }
      };

      const observer = new MutationObserver(observerCallback);

      elementsToObserve.forEach(el => {
        observer.observe(el, { attributes: true, attributeFilter: ['style'] });
        // Initial forceful application in case the style is already bad
        el.style.setProperty('overflow', 'visible', 'important');
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('max-height', 'none', 'important');
        if (el === valueBotMessageElement) {
            el.style.setProperty('padding', '15px', 'important');
            el.style.setProperty('box-sizing', 'border-box', 'important');
        } else if (el === messageContentElement || el.tagName === 'BLOCKQUOTE') {
            el.style.setProperty('box-sizing', 'border-box', 'important');
        }
      });

      // Disconnect the observer after a period to avoid long-term performance impact
      setTimeout(() => {
        observer.disconnect();
        // console.log('[Investor Explainer] MutationObserver disconnected.');
        // Final check/set after disconnecting
        elementsToObserve.forEach(el => {
            el.style.setProperty('overflow', 'visible', 'important');
            el.style.setProperty('height', 'auto', 'important');
            el.style.setProperty('max-height', 'none', 'important');
            if (el === valueBotMessageElement) {
                el.style.setProperty('padding', '15px', 'important');
                el.style.setProperty('box-sizing', 'border-box', 'important');
            } else if (el === messageContentElement || el.tagName === 'BLOCKQUOTE') {
                el.style.setProperty('box-sizing', 'border-box', 'important');
            }
        });
      }, 7000); // Run for 7 seconds
    }
  },
  
  // Animate explanations with typing effect
  animateExplanations: function(explanations) {
    const explanationsArray = Array.from(explanations);
    const delay = 100; // ms between animations
    
    explanationsArray.forEach((explanation, index) => {
      setTimeout(() => {
        explanation.classList.add('visible');
      }, index * delay);
    });
  },
  
  // Remove explanations and restore original content
  removeExplanations: function(messageContent) {
    if (messageContent.dataset.originalHtml) {
      messageContent.innerHTML = messageContent.dataset.originalHtml;
    }
  },
  
  // Set up mutation observer to catch new messages
  setupMessageObserver: function() {
    // Target any container that might hold messages
    const possibleContainers = document.querySelectorAll('div');
    const messageContainers = Array.from(possibleContainers).filter(div => {
      return div.className && 
             (div.className.includes('message') || 
              div.className.includes('chat') || 
              div.className.includes('conversation'));
    });
    
    if (messageContainers.length === 0) {
      console.log('[Investor Explainer] No message containers found, using body');
      messageContainers.push(document.body);
    }
    
    // Watch for changes
    const observer = new MutationObserver(mutations => {
      let shouldAddToggles = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldAddToggles = true;
        }
      });
      
      if (shouldAddToggles) {
        // Wait briefly for any content to settle
        setTimeout(() => {
          this.addExplainerTogglesToBotMessages();
        }, 200);
      }
    });
    
    // Start observing each container
    messageContainers.forEach(container => {
      observer.observe(container, { childList: true, subtree: true });
      console.log('[Investor Explainer] Observing container:', container);
    });
  }
};

// Initialize and set up aggressive checking
function initializeExplainer() {
  console.log('[Investor Explainer] Starting initialization');
  
  // First attempt
  investorExplainer.initialize();
  
  // Check frequently for new messages
  setInterval(() => {
    investorExplainer.addExplainerTogglesToBotMessages();
  }, 1000);
  
  // Forced check after a delay
  setTimeout(() => {
    console.log('[Investor Explainer] Performing forced check');
    investorExplainer.addExplainerTogglesToBotMessages();
  }, 3000);
  
  // Another check after longer delay
  setTimeout(() => {
    console.log('[Investor Explainer] Performing final forced check');
    investorExplainer.addExplainerTogglesToBotMessages();
  }, 6000);
  
  console.log('[Investor Explainer] Initialization complete');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeExplainer, 500);
});

// Also initialize immediately if document is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  setTimeout(initializeExplainer, 100);
}

// Add global helper function
window.addExplainerToggles = function() {
  investorExplainer.addExplainerTogglesToBotMessages();
  return 'Added explainer toggles';
};
