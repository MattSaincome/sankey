/**
 * Buffett-Munger Wisdom Semantic Categorization System
 * 
 * This file creates a semantic classification system for Buffett and Munger's wisdom,
 * allowing for more meaningful and contextually appropriate quote matching.
 * 
 * Each quote and insight is categorized by:
 * 1. Primary principle - The core investment philosophy being expressed
 * 2. Market context - The market conditions where this wisdom is most applicable
 * 3. Company characteristics - The types of businesses this wisdom applies to
 * 4. Financial metrics - The specific financial indicators this relates to
 * 5. Investor psychology - The mental/emotional aspects of investing addressed
 */

const buffettWisdomSemantic = {
  // Semantic categories for investment wisdom
  categories: {
    // Primary investment principles - core philosophies
    principles: {
      INTRINSIC_VALUE: {
        id: "intrinsic_value",
        name: "Intrinsic Value Focus",
        description: "Focusing on the underlying value of a business rather than market price",
        keywords: ["intrinsic value", "underlying value", "true worth", "real value"]
      },
      MARGIN_OF_SAFETY: {
        id: "margin_of_safety",
        name: "Margin of Safety",
        description: "Buying with a significant discount to intrinsic value to provide protection",
        keywords: ["margin of safety", "discount", "buffer", "protection"]
      },
      CIRCLE_OF_COMPETENCE: {
        id: "circle_of_competence",
        name: "Circle of Competence",
        description: "Investing only in businesses you can understand and evaluate",
        keywords: ["circle of competence", "understanding", "knowledge", "expertise"]
      },
      LONG_TERM_THINKING: {
        id: "long_term_thinking",
        name: "Long-term Thinking",
        description: "Focusing on long-term business performance, not short-term market movements",
        keywords: ["long-term", "permanent", "enduring", "lasting", "time horizon"]
      },
      ECONOMIC_MOAT: {
        id: "economic_moat",
        name: "Economic Moat",
        description: "Businesses with sustainable competitive advantages",
        keywords: ["moat", "competitive advantage", "barriers to entry", "pricing power"]
      },
      OWNER_EARNINGS: {
        id: "owner_earnings",
        name: "Owner Earnings Focus",
        description: "Focusing on cash that can be extracted from a business over its lifetime",
        keywords: ["owner earnings", "cash flow", "free cash", "cash generation"]
      },
      QUALITY_OVER_PRICE: {
        id: "quality_over_price",
        name: "Quality Over Price",
        description: "Preferring wonderful companies at fair prices over fair companies at wonderful prices",
        keywords: ["quality", "wonderful company", "first-class business", "excellent business"]
      },
      CAPITAL_ALLOCATION: {
        id: "capital_allocation",
        name: "Capital Allocation",
        description: "How companies reinvest profits and create shareholder value",
        keywords: ["capital allocation", "reinvestment", "buybacks", "acquisitions"]
      }
    },
    
    // Market context - when this wisdom is most relevant
    marketContext: {
      BULL_MARKET: {
        id: "bull_market",
        name: "Bull Market",
        description: "Periods of general market optimism and rising prices",
        keywords: ["bull market", "rising market", "optimism", "enthusiasm"]
      },
      BEAR_MARKET: {
        id: "bear_market",
        name: "Bear Market",
        description: "Periods of general market pessimism and falling prices",
        keywords: ["bear market", "falling market", "pessimism", "fear"]
      },
      MARKET_CRASH: {
        id: "market_crash",
        name: "Market Crash",
        description: "Sudden, severe market downturns",
        keywords: ["crash", "panic", "collapse", "severe correction"]
      },
      BUBBLE: {
        id: "bubble",
        name: "Market Bubble",
        description: "Periods of extreme overvaluation and speculation",
        keywords: ["bubble", "mania", "euphoria", "irrational exuberance"]
      },
      RECESSION: {
        id: "recession",
        name: "Economic Recession",
        description: "Periods of economic contraction affecting business fundamentals",
        keywords: ["recession", "economic downturn", "contraction", "slowdown"]
      },
      NORMAL_MARKET: {
        id: "normal_market",
        name: "Normal Market Conditions",
        description: "Relatively stable market conditions without extremes",
        keywords: ["normal", "stable", "steady", "moderate"]
      }
    },
    
    // Company characteristics - what types of businesses
    companyCharacteristics: {
      HIGH_ROIC: {
        id: "high_roic",
        name: "High Return on Invested Capital",
        description: "Businesses that generate high returns on the capital they employ",
        keywords: ["high ROIC", "high returns", "capital efficient", "high ROE"]
      },
      LOW_CAPITAL_NEEDS: {
        id: "low_capital_needs",
        name: "Low Capital Requirements",
        description: "Businesses that need minimal reinvestment to maintain operations",
        keywords: ["low capital", "capital light", "minimal reinvestment", "low maintenance capex"]
      },
      PREDICTABLE_EARNINGS: {
        id: "predictable_earnings",
        name: "Predictable Earnings",
        description: "Businesses with consistent, forecastable earnings patterns",
        keywords: ["predictable", "consistent", "stable earnings", "forecastable"]
      },
      PRICING_POWER: {
        id: "pricing_power",
        name: "Pricing Power",
        description: "Ability to raise prices without losing significant business",
        keywords: ["pricing power", "price increases", "premium pricing", "inelastic demand"]
      },
      STRONG_BRAND: {
        id: "strong_brand",
        name: "Strong Brand Value",
        description: "Companies with valuable, recognized brands that create loyalty",
        keywords: ["brand", "reputation", "loyalty", "recognition"]
      },
      GOOD_MANAGEMENT: {
        id: "good_management",
        name: "Quality Management",
        description: "Companies led by honest, capable, shareholder-oriented management",
        keywords: ["management", "leadership", "executives", "CEO", "honest"]
      },
      HIGH_GROWTH: {
        id: "high_growth",
        name: "High Growth",
        description: "Companies experiencing rapid revenue or earnings expansion",
        keywords: ["growth", "expanding", "rapid increase", "growing"]
      },
      DISTRESSED: {
        id: "distressed",
        name: "Distressed Business",
        description: "Companies facing significant financial or operational challenges",
        keywords: ["distressed", "turnaround", "problems", "trouble", "challenges"]
      }
    },
    
    // Financial metrics - specific quantitative aspects
    financialMetrics: {
      PE_RATIO: {
        id: "pe_ratio",
        name: "P/E Ratio",
        description: "Price to earnings ratio - market price relative to earnings",
        keywords: ["P/E", "price to earnings", "earnings multiple", "PE ratio"],
        metricRanges: {
          HIGH: { threshold: "> 25", context: "Elevated expectations and premium pricing" },
          MEDIUM: { threshold: "10-25", context: "Moderate pricing relative to earnings" },
          LOW: { threshold: "< 10", context: "Potentially undervalued or declining business" }
        }
      },
      DEBT_LEVELS: {
        id: "debt_levels",
        name: "Debt Levels",
        description: "Company's leverage and financial obligations",
        keywords: ["debt", "leverage", "liabilities", "obligations", "debt to equity"],
        metricRanges: {
          HIGH: { threshold: "Debt/Equity > 1.0", context: "Significant financial leverage" },
          MEDIUM: { threshold: "Debt/Equity 0.3-1.0", context: "Moderate financial leverage" },
          LOW: { threshold: "Debt/Equity < 0.3", context: "Conservative financial structure" }
        }
      },
      RETURN_ON_EQUITY: {
        id: "roe",
        name: "Return on Equity",
        description: "Profitability relative to shareholders' equity",
        keywords: ["ROE", "return on equity", "equity returns", "shareholder returns"],
        metricRanges: {
          HIGH: { threshold: "> 15%", context: "Excellent returns to shareholders" },
          MEDIUM: { threshold: "8-15%", context: "Solid returns to shareholders" },
          LOW: { threshold: "< 8%", context: "Poor returns to shareholders" }
        }
      },
      PROFIT_MARGIN: {
        id: "profit_margin",
        name: "Profit Margin",
        description: "Profitability as a percentage of revenue",
        keywords: ["margin", "profit margin", "net margin", "gross margin"],
        metricRanges: {
          HIGH: { threshold: "> 15%", context: "Excellent profitability" },
          MEDIUM: { threshold: "5-15%", context: "Standard profitability" },
          LOW: { threshold: "< 5%", context: "Thin margins or unprofitable" }
        }
      },
      BOOK_VALUE_GROWTH: {
        id: "book_value_growth",
        name: "Book Value Growth",
        description: "Rate of increase in company's book value per share over time",
        keywords: ["book value growth", "equity growth", "increased book value"],
        metricRanges: {
          HIGH: { threshold: "> 15%", context: "Rapid growth in intrinsic value" },
          MEDIUM: { threshold: "8-15%", context: "Solid growth in intrinsic value" },
          LOW: { threshold: "< 8%", context: "Slow growth in intrinsic value" }
        }
      }
    },
    
    // Investor psychology - mental and emotional aspects
    investorPsychology: {
      PATIENCE: {
        id: "patience",
        name: "Patience",
        description: "Willingness to wait for the right opportunity or for investments to work out",
        keywords: ["patience", "wait", "long-term", "time", "delayed gratification"]
      },
      CONTRARIAN_THINKING: {
        id: "contrarian",
        name: "Contrarian Thinking",
        description: "Going against prevailing market sentiment",
        keywords: ["contrarian", "against the crowd", "different", "unconventional"]
      },
      FEAR_AND_GREED: {
        id: "fear_greed",
        name: "Fear and Greed",
        description: "Managing emotions that drive poor investment decisions",
        keywords: ["fear", "greed", "emotion", "panic", "excitement"]
      },
      RATIONALITY: {
        id: "rationality",
        name: "Rationality",
        description: "Making decisions based on logic rather than emotion",
        keywords: ["rational", "logical", "reasoned", "analytical", "clear thinking"]
      },
      TEMPERAMENT: {
        id: "temperament",
        name: "Temperament",
        description: "Personal qualities needed for successful investing",
        keywords: ["temperament", "character", "disposition", "personality"]
      },
      INDEPENDENT_THOUGHT: {
        id: "independent_thought",
        name: "Independent Thought",
        description: "Thinking for yourself rather than following others",
        keywords: ["independent", "original", "your own", "think for yourself"]
      }
    }
  },
  
  // Sample categorization of specific quotes
  categorizedQuotes: [
    {
      quote: "Price is what you pay. Value is what you get.",
      author: "Warren Buffett",
      source: "2008 Shareholder Letter",
      categories: {
        principles: ["INTRINSIC_VALUE", "MARGIN_OF_SAFETY"],
        investorPsychology: ["RATIONALITY"],
        marketContext: ["NORMAL_MARKET", "BUBBLE"], // Especially relevant during bubbles
        financialMetrics: ["PE_RATIO"]
      },
      sentiment: "neutral",
      complexity: "simple",
      applicationContext: "Evaluating whether a stock's market price reflects its intrinsic value"
    },
    {
      quote: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
      author: "Warren Buffett",
      source: "1989 Shareholder Letter",
      categories: {
        principles: ["QUALITY_OVER_PRICE", "ECONOMIC_MOAT"],
        companyCharacteristics: ["HIGH_ROIC", "STRONG_BRAND", "PREDICTABLE_EARNINGS"],
        financialMetrics: ["PE_RATIO", "RETURN_ON_EQUITY"]
      },
      sentiment: "instructive",
      complexity: "moderate",
      applicationContext: "When deciding between a higher-quality business at higher valuation vs. lower-quality business at bargain price"
    },
    {
      quote: "Be fearful when others are greedy, and greedy when others are fearful.",
      author: "Warren Buffett",
      source: "2004 Shareholder Letter",
      categories: {
        principles: ["MARGIN_OF_SAFETY"],
        investorPsychology: ["CONTRARIAN_THINKING", "FEAR_AND_GREED"],
        marketContext: ["BUBBLE", "MARKET_CRASH"]
      },
      sentiment: "instructive",
      complexity: "simple",
      applicationContext: "During extreme market conditions when emotions are driving market behavior"
    }
  ],
  
  // Initialize the semantic categorization system
  initialize: function() {
    console.log("Buffett Wisdom Semantic Categorization System initialized");
    return true;
  },
  
  // Find quotes that match specific semantic categories
  findQuotesByCategories: function(categorySelectors, limit = 3) {
    // Example implementation - would need to be expanded
    const matches = this.categorizedQuotes.filter(quote => {
      // Check if this quote matches all the requested category selectors
      let isMatch = true;
      
      // Check each category type (principles, market context, etc.)
      Object.keys(categorySelectors).forEach(categoryType => {
        // If this category type exists in the quote
        if (quote.categories[categoryType]) {
          // Check if any of the requested category values match
          const hasMatchingCategory = categorySelectors[categoryType].some(
            categoryId => quote.categories[categoryType].includes(categoryId)
          );
          
          // If no match in this category type, this quote is not a match
          if (!hasMatchingCategory) {
            isMatch = false;
          }
        } else {
          // If the category type doesn't exist in this quote, it's not a match
          isMatch = false;
        }
      });
      
      return isMatch;
    });
    
    // Return the matching quotes, limited to the requested number
    return matches.slice(0, limit);
  },
  
  // Find the most semantically relevant quote for a specific business context
  findRelevantQuote: function(companyMetrics, marketCondition, investmentThesis) {
    // This would use the metrics, market condition and thesis to find semantically matching quotes
    // Implementation would involve sophisticated matching based on the categorization
    
    // Placeholder implementation
    return this.categorizedQuotes[0];
  }
};

// Export the module
if (typeof module !== 'undefined') {
  module.exports = buffettWisdomSemantic;
} else {
  // Make it available in browser context
  window.buffettWisdomSemantic = buffettWisdomSemantic;
}
