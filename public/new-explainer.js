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
    
    // Add toggles to any existing messages
    this.addExplainerTogglesToBotMessages();
    
    // Set up observer for new messages
    this.setupMessageObserver();
    
    console.log('[Investor Explainer] Initialization complete');
  },
  
  // Add toggles to all bot messages with financial content
  addExplainerTogglesToBotMessages: function() {
    console.log('[Investor Explainer] Adding toggles to ALL possible bot messages...');
    
    // Get all divs that might contain messages
    const allDivs = document.querySelectorAll('div');
    let togglesAdded = 0;
    
    allDivs.forEach(div => {
      // Skip if div is too small or already has a toggle
      if (!div.textContent || 
          div.textContent.length < 100 || 
          div.querySelector('.explainer-switch')) {
        return;
      }
      
      // Skip inputs or form elements
      if (div.querySelector('input') || 
          div.querySelector('button') || 
          div.querySelector('textarea')) {
        return;
      }
      
      // Skip if parent already has a toggle (avoid duplicates)
      if (div.parentElement && div.parentElement.querySelector('.explainer-switch')) {
        return;
      }
      
      // Skip welcome messages
      if (div.textContent.includes('Hello') && 
          div.textContent.includes('welcome') && 
          div.textContent.includes('Bot')) {
        return;
      }
      
      // Check if the content looks like it has financial terms
      const hasFinancialTerms = /(growth|revenue|profit|margin|capital|segment|defense|industrial|process|management|performance|equity|earnings|price|value|stock|dividend|ratio|cash|flow|YoY|ROE|ROIC|EPS)/i.test(div.textContent);
      
      if (hasFinancialTerms) {
        // Force proper positioning
        if (getComputedStyle(div).position === 'static') {
          div.style.position = 'relative';
        }
        
        // Create and append toggle
        const toggle = this.createExplainerToggle();
        div.appendChild(toggle);
        togglesAdded++;
      }
    });
    
    console.log(`[Investor Explainer] Added ${togglesAdded} toggles`);
  },
  
  // Create explainer toggle switch element
  createExplainerToggle: function() {
    // Create container for switch
    const container = document.createElement('div');
    container.className = 'explainer-switch';
    
    // Position in bottom right
    container.style.position = 'absolute';
    container.style.right = '8px';
    container.style.bottom = '8px';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.backgroundColor = 'rgba(30, 38, 51, 0.9)';
    container.style.padding = '3px 6px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    container.style.border = '1px solid rgba(76, 201, 240, 0.8)';
    container.style.cursor = 'pointer';
    container.style.opacity = '0.9';
    container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    container.style.transform = 'scale(1)';
    
    // Hover effects
    container.addEventListener('mouseenter', function() {
      this.style.opacity = '1';
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 3px 8px rgba(76, 201, 240, 0.3)';
    });
    
    container.addEventListener('mouseleave', function() {
      this.style.opacity = '0.9';
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    });
    
    // Create toggle UI
    container.innerHTML = `
      <label class="switch" style="position: relative; display: inline-block; width: 24px; height: 14px; margin-right: 4px;">
        <input type="checkbox" class="explainer-toggle" style="opacity: 0; width: 0; height: 0;">
        <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #2b3240; border: 1px solid rgba(76, 201, 240, 0.5); border-radius: 14px; transition: .3s;"><span style="position: absolute; content: ''; height: 8px; width: 8px; left: 3px; bottom: 2px; background-color: #8f96a3; transition: .3s; border-radius: 50%;"></span></span>
      </label>
      <span class="switch-label" style="font-size: 0.7em; color: rgba(76, 201, 240, 0.85); font-weight: 400;">Explain</span>
    `;
    
    // Add toggle functionality
    const toggleInput = container.querySelector('.explainer-toggle');
    toggleInput.addEventListener('change', event => {
      const isChecked = event.target.checked;
      const message = event.target.closest('div');
      const messageContent = message.querySelector('.message-content') || message;
      
      // Update toggle appearance
      const slider = event.target.nextElementSibling;
      const sliderKnob = slider.querySelector('span');
      const label = container.querySelector('.switch-label');
      
      if (isChecked) {
        // Active state
        slider.style.backgroundColor = '#1c2538';
        slider.style.borderColor = '#4cc9f0';
        sliderKnob.style.transform = 'translateX(12px)';
        sliderKnob.style.backgroundColor = '#4cc9f0';
        label.style.color = '#4cc9f0';
        
        // Add explanations
        this.processAndAddExplanations(messageContent);
      } else {
        // Inactive state
        slider.style.backgroundColor = '#2b3240';
        slider.style.borderColor = 'rgba(76, 201, 240, 0.5)';
        sliderKnob.style.transform = 'translateX(0)';
        sliderKnob.style.backgroundColor = '#8f96a3';
        label.style.color = 'rgba(76, 201, 240, 0.85)';
        
        // Remove explanations
        this.removeExplanations(messageContent);
      }
    });
    
    // Add attention-grabbing animation
    setTimeout(() => {
      container.style.animation = 'pulse 1.5s';
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); box-shadow: 0 3px 10px rgba(76, 201, 240, 0.5); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }, 500);
    
    return container;
  },
  
  // Process message content and add explanations
  processAndAddExplanations: function(messageContent) {
    // Store original HTML
    if (!messageContent.dataset.originalHtml) {
      messageContent.dataset.originalHtml = messageContent.innerHTML;
    }
    
    let html = messageContent.dataset.originalHtml;
    
    // Track terms already explained in this message
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
      const regex = new RegExp(`\\b${escapedAcronym}\\b`, 'g');
      
      // Only explain the first occurrence
      let isFirstOccurrence = true;
      
      html = html.replace(regex, (match) => {
        if (isFirstOccurrence) {
          explainedTerms.add(acronym.toLowerCase());
          isFirstOccurrence = false;
          return `${match}<span class="explanation typing" data-term="${acronym}"> (${fullName})</span>`;
        }
        return match;
      });
    });
    
    // Update content
    messageContent.innerHTML = html;
    
    // Add typing effect
    this.animateExplanations(messageContent.querySelectorAll('.explanation'));
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
