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
    "beta": "A measure of a stock's volatility compared to the overall market.",
    "alpha": "Excess return of an investment relative to a benchmark index.",
    "bull market": "A market condition where prices are rising or expected to rise.",
    "bear market": "A market condition where prices are falling or expected to fall."
  },
  
  // Initialize the explainer functionality
  initialize: function() {
    // Add toggle switches to all bot messages
    this.addExplainerTogglesToBotMessages();
    
    // Set up a mutation observer to watch for new messages
    this.setupMessageObserver();
    
    console.log('[Investor Explainer] Initialized');
  },
  
  // Create and add explainer toggle to bot messages
  addExplainerTogglesToBotMessages: function() {
    console.log('[Investor Explainer] Adding toggles to bot messages...');
    const botMessages = document.querySelectorAll('.value-bot-message.bot');
    console.log('[Investor Explainer] Found', botMessages.length, 'bot messages');
    
    botMessages.forEach((message, index) => {
      // Skip if already has an explainer toggle
      if (message.querySelector('.explainer-switch')) {
        console.log('[Investor Explainer] Message', index, 'already has toggle');
        return;
      }
      
      console.log('[Investor Explainer] Adding toggle to message', index);
      
      // Ensure the message has proper positioning for absolute elements
      message.style.position = 'relative';
      
      // Create the toggle switch
      const toggleSwitch = this.createExplainerToggle();
      
      // Make sure toggle is visible
      toggleSwitch.style.opacity = '1';
      toggleSwitch.style.visibility = 'visible';
      toggleSwitch.style.display = 'flex';
      
      // Add toggle switch to the message
      message.appendChild(toggleSwitch);
      
      console.log('[Investor Explainer] Toggle added to message', index);
    });
  },
  
  // Create explainer toggle switch element
  createExplainerToggle: function() {
    const switchContainer = document.createElement('div');
    switchContainer.className = 'explainer-switch';
    
    // Ensure the switch is positioned correctly and visible
    switchContainer.style.position = 'absolute';
    switchContainer.style.right = '15px';
    switchContainer.style.top = '15px';
    switchContainer.style.zIndex = '10';
    switchContainer.style.display = 'flex';
    switchContainer.style.alignItems = 'center';
    switchContainer.style.backgroundColor = 'rgba(42, 43, 50, 0.9)';
    switchContainer.style.padding = '5px 8px';
    switchContainer.style.borderRadius = '12px';
    switchContainer.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
    
    // Create the label and toggle elements with explicit styling
    switchContainer.innerHTML = `
      <label class="switch" style="position: relative; display: inline-block; width: 36px; height: 20px; margin-right: 8px;">
        <input type="checkbox" class="explainer-toggle" style="opacity: 0; width: 0; height: 0;">
        <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #2b3240; border: 1px solid #3a4356; border-radius: 20px; transition: .4s;"></span>
      </label>
      <span class="switch-label" style="font-size: 0.8em; color: #8f96a3; font-weight: 500;">Explainers</span>
    `;
    
    // Style the slider button
    const slider = switchContainer.querySelector('.slider');
    slider.innerHTML = `<span style="position: absolute; content: ''; height: 14px; width: 14px; left: 3px; bottom: 2px; background-color: #8f96a3; transition: .3s; border-radius: 50%;"></span>`;
    
    // Add event listener for toggle change
    const toggleInput = switchContainer.querySelector('.explainer-toggle');
    toggleInput.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const messageContent = e.target.closest('.value-bot-message').querySelector('.message-content');
      
      // Update toggle appearance
      const switchLabel = e.target.closest('.explainer-switch').querySelector('.switch-label');
      const sliderElement = e.target.nextElementSibling;
      
      if (isChecked) {
        sliderElement.style.backgroundColor = '#1c2538';
        sliderElement.style.borderColor = '#4cc9f0';
        sliderElement.querySelector('span').style.transform = 'translateX(16px)';
        sliderElement.querySelector('span').style.backgroundColor = '#4cc9f0';
        switchLabel.style.color = '#4cc9f0';
        this.processAndAddExplanations(messageContent);
      } else {
        sliderElement.style.backgroundColor = '#2b3240';
        sliderElement.style.borderColor = '#3a4356';
        sliderElement.querySelector('span').style.transform = 'translateX(0)';
        sliderElement.querySelector('span').style.backgroundColor = '#8f96a3';
        switchLabel.style.color = '#8f96a3';
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
    
    // Process the content to find and explain financial terms
    Object.entries(this.terms).forEach(([term, explanation]) => {
      // Create regex that matches whole words, case insensitive
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      
      // Replace all occurrences with the term + explanation
      html = html.replace(regex, (match) => {
        return `${match}<span class="explanation typing" data-term="${term}"> (${explanation})</span>`;
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

// Initialize the explainer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => investorExplainer.initialize(), 500); // Slight delay to ensure DOM is ready
});

// For existing page, initialize immediately if DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  // Wait for any ongoing DOM updates to complete
  setTimeout(() => {
    console.log('[Investor Explainer] Initializing explainer on existing page...');
    investorExplainer.initialize();
    
    // Additional attempt after a delay to catch any late-rendered messages
    setTimeout(() => {
      console.log('[Investor Explainer] Making second pass to catch any missed messages...');
      investorExplainer.addExplainerTogglesToBotMessages();
    }, 2000);
  }, 500);
}
