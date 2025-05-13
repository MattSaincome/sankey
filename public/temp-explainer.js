//
Temporary
file

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
    "P/B ratio": "Price-to-Book ratio, which compares a company's market value to its book value. Lower values may indicate undervaluation.",
    "PEG ratio": "Price/Earnings-to-Growth ratio, which factors growth into P/E valuation. Values below 1.0 often suggest undervaluation.",
    "DCF": "Discounted Cash Flow, a valuation method that estimates the value of an investment based on its expected future cash flows.",
    "intrinsic value": "The actual value of a company or asset based on its underlying fundamentals, regardless of market price.",
    "margin of safety": "The difference between a stock's intrinsic value and its market price, providing a buffer against errors in analysis.",
    
    // Financial metrics
    "ROE": "Return on Equity, which measures a company's profitability relative to shareholders' equity.",
    "ROIC": "Return on Invested Capital, which measures how efficiently a company uses its capital to generate profits.",
    "FCF": "Free Cash Flow, the cash a company generates after accounting for capital expenditures.",
    "EPS": "Earnings Per Share, the portion of a company's profit allocated to each outstanding share of common stock.",
    "EBITDA": "Earnings Before Interest, Taxes, Depreciation, and Amortization, a measure of a company's operational performance.",
    "gross margin": "The percentage of revenue that exceeds the cost of goods sold, indicating profitability of core operations.",
    "net margin": "The percentage of revenue remaining after all expenses, taxes, and costs have been deducted.",
    "operating margin": "The percentage of revenue remaining after operating expenses are deducted, showing operational efficiency.",
    
    // Investment concepts
    "moat": "A sustainable competitive advantage that protects a company from competitors, like brand strength or patents.",
    "dividend yield": "Annual dividend payments divided by stock price, showing return from dividends as a percentage.",
    "dividend payout ratio": "The percentage of earnings paid to shareholders as dividends.",
    "capital allocation": "How a company distributes its financial resources among different investment opportunities.",
    "balance sheet": "A financial statement showing a company's assets, liabilities, and shareholders' equity at a specific point in time.",
    "income statement": "A financial statement showing revenues, expenses, and profits over a period of time.",
    "cash flow statement": "A financial statement showing cash inflows and outflows during a period of time.",
    
    // Financial ratios
    "debt-to-equity": "A ratio comparing a company's total debt to its shareholders' equity, indicating financial leverage.",
    "current ratio": "A ratio comparing a company's current assets to its current liabilities, indicating short-term liquidity.",
    "quick ratio": "A ratio comparing a company's most liquid assets to its current liabilities, indicating immediate liquidity.",
    "price-to-sales": "A ratio comparing a company's market capitalization to its revenue, useful for valuing unprofitable companies.",
    "enterprise value": "The total value of a company, including market cap, debt, and excluding cash.",
    "EBITDA margin": "EBITDA as a percentage of total revenue, indicating operational profitability.",
    
    // Market terms
    "market cap": "Market Capitalization, the total value of a company's outstanding shares.",
    "float": "The number of shares available for public trading, excluding restricted shares.",
    "short interest": "The percentage of a company's shares that have been sold short by investors.",
    "beta": "A measure of a stock's volatility relative to the overall market.",
    "alpha": "Excess return of an investment relative to a benchmark index.",
    "bull market": "A market condition where prices are rising or expected to rise.",
    "bear market": "A market condition where prices are falling or expected to fall."
  },
  
  // Initialize the explainer functionality
  initialize: function() {
    console.log('[Investor Explainer] Initializing...');
    // Set up observer for new messages
    this.setupMessageObserver();
    
    // Add toggles to any existing messages
    this.addExplainerTogglesToBotMessages();
    
    console.log('[Investor Explainer] Initialization complete');
  },
  
  // Create and add explainer toggle to bot messages
  addExplainerTogglesToBotMessages: function() {
    console.log('[Investor Explainer] Adding toggles to bot messages...');
    const botMessages = document.querySelectorAll('.value-bot-message.bot');
    console.log('[Investor Explainer] Found', botMessages.length, 'bot messages');
    
    botMessages.forEach((message, index) => {
      // Skip if already has an explainer toggle
      if (message.querySelector('.explainer-switch')) {
        return;
      }
      
      // Ensure message has relative positioning to contain toggle
      if (getComputedStyle(message).position === 'static') {
        message.style.position = 'relative';
      }
      
      // Create toggle switch
      const toggleSwitch = this.createExplainerToggle(message);
      
      // Add toggle switch to the message
      message.appendChild(toggleSwitch);
      
      console.log('[Investor Explainer] Toggle added to message', index);
    });
  },
  
  // Create explainer toggle switch element
  createExplainerToggle: function(message) {
    // Create a container for the switch
    const switchContainer = document.createElement('div');
    switchContainer.className = 'explainer-switch';
    
    // Position the switch in the bottom right corner with fixed positioning
    switchContainer.style.position = 'fixed';
    switchContainer.style.right = '8px';
    switchContainer.style.bottom = '8px';
    switchContainer.style.zIndex = '10';
    switchContainer.style.display = 'flex';
    switchContainer.style.alignItems = 'center';
    switchContainer.style.backgroundColor = 'rgba(30, 38, 51, 0.8)';
    switchContainer.style.padding = '4px 8px';
    switchContainer.style.borderRadius = '10px';
    switchContainer.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)';
    switchContainer.style.border = '1px solid rgba(76, 201, 240, 0.5)';
    switchContainer.style.cursor = 'pointer';
    switchContainer.style.opacity = '0.8';
    switchContainer.style.transition = 'opacity 0.2s ease';
    switchContainer.style.height = 'fit-content';
    switchContainer.style.width = 'auto';
    switchContainer.style.maxHeight = '24px'; // Explicitly limit height
    
    // Make it more visible on hover
    switchContainer.addEventListener('mouseenter', function() {
      this.style.opacity = '1';
    });
    switchContainer.addEventListener('mouseleave', function() {
      this.style.opacity = '0.8';
    });
    
    // Create the label and toggle elements with explicit styling - making them smaller
    switchContainer.innerHTML = `
      <label class="switch" style="position: relative; display: inline-block; width: 28px; height: 16px; margin-right: 6px;">
        <input type="checkbox" class="explainer-toggle" style="opacity: 0; width: 0; height: 0;">
        <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #2b3240; border: 1px solid rgba(76, 201, 240, 0.6); border-radius: 16px; transition: .3s;"></span>
      </label>
      <span class="switch-label" style="font-size: 0.75em; color: rgba(76, 201, 240, 0.9); font-weight: 500;">Explainers</span>
    `;
    
    // Style the slider button - making it smaller
    const slider = switchContainer.querySelector('.slider');
    slider.innerHTML = `<span style="position: absolute; content: ''; height: 10px; width: 10px; left: 3px; bottom: 3px; background-color: #8f96a3; transition: .3s; border-radius: 50%;"></span>`;
    
    // Add event listener for toggle change
    const toggleInput = switchContainer.querySelector('.explainer-toggle');
    toggleInput.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const messageContent = e.target.closest('.value-bot-message').querySelector('.message-content');
      
      // Update toggle appearance
      const sliderElement = e.target.nextElementSibling;
      const switchLabel = e.target.closest('.explainer-switch').querySelector('.switch-label');
      const switchContainer = e.target.closest('.explainer-switch');
      
      if (isChecked) {
        sliderElement.style.backgroundColor = '#1c2538';
        sliderElement.style.borderColor = '#4cc9f0';
        sliderElement.querySelector('span').style.transform = 'translateX(12px)';
        sliderElement.querySelector('span').style.backgroundColor = '#4cc9f0';
        switchLabel.style.color = '#4cc9f0';
        switchContainer.style.boxShadow = '0 1px 6px rgba(76, 201, 240, 0.3)';
        switchContainer.style.opacity = '1';
        this.processAndAddExplanations(messageContent);
      } else {
        sliderElement.style.backgroundColor = '#2b3240';
        sliderElement.style.borderColor = 'rgba(76, 201, 240, 0.6)';
        sliderElement.querySelector('span').style.transform = 'translateX(0)';
        sliderElement.querySelector('span').style.backgroundColor = '#8f96a3';
        switchLabel.style.color = 'rgba(76, 201, 240, 0.9)';
        switchContainer.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)';
        switchContainer.style.opacity = '0.8';
        this.removeExplanations(messageContent);
      }
    });
    
    return switchContainer;
  },
  
  // Process message content and add explanations
  processAndAddExplanations: function(messageContent) {
    // Store original HTML to restore later if needed
    if (!messageContent.dataset.originalHtml) {
      messageContent.dataset.originalHtml = messageContent.innerHTML;
    }
    
    let html = messageContent.dataset.originalHtml;
    let explanationCount = 0;
    
    // Process the content to find and explain financial terms
    Object.entries(this.terms).forEach(([term, explanation]) => {
      // Need to escape special regex characters in the term
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create regex that matches whole words, case insensitive, globally
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
      
      // Replace ALL occurrences with the term + explanation
      // The global flag 'g' ensures we replace every instance
      html = html.replace(regex, (match) => {
        explanationCount++;
        return `${match}<span class="explanation typing" data-term="${term}" data-count="${explanationCount}"> (${explanation})</span>`;
      });
    });
    
    // Also look for common financial acronyms and explain them
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
      const escapedAcronym = acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedAcronym}\\b`, 'g');
      
      html = html.replace(regex, (match) => {
        explanationCount++;
        return `${match}<span class="explanation typing" data-term="${acronym}" data-count="${explanationCount}"> (${fullName})</span>`;
      });
    });
    
    // Update the message content
    messageContent.innerHTML = html;
    
    // Sequentially show explanations with typing effect
    const explanations = messageContent.querySelectorAll('.explanation');
    this.sequentiallyShowExplanations(explanations);
  },
  
  // Sequentially show explanations with typing effect
  sequentiallyShowExplanations: function(explanations) {
    const explanationsArray = Array.from(explanations);
    const maxDelay = 100; // ms between starting each explanation
    
    explanationsArray.forEach((explanation, index) => {
      setTimeout(() => {
        explanation.classList.add('visible');
      }, index * maxDelay);
    });
  },
  
  // Remove explanations and restore original content
  removeExplanations: function(messageContent) {
    if (messageContent.dataset.originalHtml) {
      messageContent.innerHTML = messageContent.dataset.originalHtml;
    }
  },
  
  // Set up mutation observer to watch for new messages
  setupMessageObserver: function() {
    const messageContainer = document.querySelector('.value-bot-messages');
    if (!messageContainer) return;
    
    const config = { childList: true, subtree: true };
    
    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
      let shouldAddToggles = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added node is a bot message
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('value-bot-message') && 
                node.classList.contains('bot')) {
              shouldAddToggles = true;
            }
          });
        }
      });
      
      if (shouldAddToggles) {
        // Add toggles to new messages
        this.addExplainerTogglesToBotMessages();
      }
    });
    
    // Start observing
    observer.observe(messageContainer, config);
  }
};

// Ensure explainer is added to every message by regularly checking for new messages
function setupRecurringCheck() {
  // First initialization
  investorExplainer.initialize();
  
  // Set up a recurring check every 2 seconds to catch any new messages
  setInterval(() => {
    investorExplainer.addExplainerTogglesToBotMessages();
  }, 2000);
  
  console.log('[Investor Explainer] Set up recurring checks for new messages');
}

// Initialize the explainer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => setupRecurringCheck(), 500); // Slight delay to ensure DOM is ready
});

// For existing page, initialize immediately if DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  // Wait for any ongoing DOM updates to complete
  setTimeout(() => {
    console.log('[Investor Explainer] Initializing explainer on existing page...');
    setupRecurringCheck();
    
    // Immediately try to add toggles to any existing messages
    investorExplainer.addExplainerTogglesToBotMessages();
  }, 500);
}

// Also add a global helper to manually add toggles if needed
window.addExplainerToggles = function() {
  console.log('[Investor Explainer] Manually adding explainer toggles...');
  investorExplainer.addExplainerTogglesToBotMessages();
  return 'Added explainer toggles to bot messages';
};
