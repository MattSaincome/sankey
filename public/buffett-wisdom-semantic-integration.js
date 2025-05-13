/**
 * Buffett Wisdom Semantic Integration Layer
 * 
 * This file connects the semantic categorization system with the existing wisdom system,
 * enabling more contextually appropriate and meaningful quote selection.
 * 
 * It analyzes the financial context, business characteristics, and market conditions
 * to find the most relevant wisdom from Buffett and Munger.
 */

const buffettWisdomSemanticIntegration = {
  // Track used insights to avoid repetition
  usedInsightIds: new Set(),
  
  // Initialize the integration system
  initialize: function() {
    this.usedInsightIds = new Set();
    
    // Check if required modules are loaded
    if (!window.buffettWisdomSemantic || !window.buffettLetterInsightsSemantic) {
      console.error("Semantic categorization systems not found");
      return false;
    }
    
    console.log("Buffett Wisdom Semantic Integration initialized successfully");
    return true;
  },
  
  // Reset tracking for a new conversation
  resetConversation: function() {
    this.usedInsightIds = new Set();
    console.log("Reset semantic insights tracking for new conversation");
  },
  
  // Analyze financial text to extract semantic meaning
  analyzeFinancialContext: function(text) {
    if (!text) return null;
    
    const analysis = {
      businessCharacteristics: [],
      financialMetrics: [],
      investorPsychology: [],
      marketConditions: [],
      primaryPrinciples: []
    };
    
    // Analyze for business characteristics
    const characteristicPatterns = [
      { pattern: /high (ROE|ROIC|return on equity|return on capital)/i, category: "HIGH_ROIC" },
      { pattern: /strong brand|brand (value|equity|recognition)/i, category: "STRONG_BRAND" },
      { pattern: /pricing power|raise prices|premium (pricing|prices)/i, category: "PRICING_POWER" },
      { pattern: /good management|excellent leadership|capable management/i, category: "GOOD_MANAGEMENT" },
      { pattern: /consistent|stable|predictable (earnings|results|performance)/i, category: "PREDICTABLE_EARNINGS" },
      { pattern: /capital (light|efficient)|low (capex|capital expenditure|capital intensity)/i, category: "LOW_CAPITAL_NEEDS" },
      { pattern: /high growth|rapid expansion|fast growing/i, category: "HIGH_GROWTH" },
      { pattern: /distressed|troubled|turnaround|struggling/i, category: "DISTRESSED" }
    ];
    
    characteristicPatterns.forEach(item => {
      if (item.pattern.test(text)) {
        analysis.businessCharacteristics.push(item.category);
      }
    });
    
    // Analyze for financial metrics
    const metricPatterns = [
      { pattern: /P\/?E ratio|price[\s-]to[\s-]earnings|earnings multiple/i, category: "PE_RATIO" },
      { pattern: /ROE|return on equity/i, category: "RETURN_ON_EQUITY" },
      { pattern: /debt[\s-]to[\s-]equity|leverage ratio|financial leverage/i, category: "DEBT_LEVELS" },
      { pattern: /profit margin|net margin|gross margin|profitability/i, category: "PROFIT_MARGIN" },
      { pattern: /book value growth|equity growth/i, category: "BOOK_VALUE_GROWTH" }
    ];
    
    metricPatterns.forEach(item => {
      if (item.pattern.test(text)) {
        analysis.financialMetrics.push(item.category);
      }
    });
    
    // Analyze for investor psychology
    const psychologyPatterns = [
      { pattern: /patient|patience|long[\s-]term|time horizon/i, category: "PATIENCE" },
      { pattern: /contrarian|against the crowd|opposite|contrary/i, category: "CONTRARIAN_THINKING" },
      { pattern: /fear|greed|emotion|panic|euphoria/i, category: "FEAR_AND_GREED" },
      { pattern: /rational|logical|reasoned|analytical/i, category: "RATIONALITY" },
      { pattern: /temperament|character|disposition/i, category: "TEMPERAMENT" },
      { pattern: /independent|original|think for (yourself|oneself)/i, category: "INDEPENDENT_THOUGHT" }
    ];
    
    psychologyPatterns.forEach(item => {
      if (item.pattern.test(text)) {
        analysis.investorPsychology.push(item.category);
      }
    });
    
    // Analyze for market conditions
    const marketPatterns = [
      { pattern: /bull market|rising market|market (optimism|enthusiasm)/i, category: "BULL_MARKET" },
      { pattern: /bear market|declining market|market (pessimism|fear)/i, category: "BEAR_MARKET" },
      { pattern: /market crash|severe (correction|decline)|panic/i, category: "MARKET_CRASH" },
      { pattern: /bubble|mania|irrational exuberance|overvalued market/i, category: "BUBBLE" },
      { pattern: /recession|economic (downturn|contraction|slowdown)/i, category: "RECESSION" }
    ];
    
    marketPatterns.forEach(item => {
      if (item.pattern.test(text)) {
        analysis.marketConditions.push(item.category);
      }
    });
    
    // Analyze for primary investment principles
    const principlePatterns = [
      { pattern: /intrinsic value|underlying value|true worth/i, category: "INTRINSIC_VALUE" },
      { pattern: /margin of safety|discount|buffer|protection/i, category: "MARGIN_OF_SAFETY" },
      { pattern: /circle of competence|understand the business/i, category: "CIRCLE_OF_COMPETENCE" },
      { pattern: /long[\s-]term|years|decades|foreseeable future/i, category: "LONG_TERM_THINKING" },
      { pattern: /moat|competitive advantage|barrier to entry/i, category: "ECONOMIC_MOAT" },
      { pattern: /owner earnings|cash flow|free cash/i, category: "OWNER_EARNINGS" },
      { pattern: /quality (business|company)|wonderful (company|business)/i, category: "QUALITY_OVER_PRICE" },
      { pattern: /capital allocation|reinvestment|buybacks|dividends/i, category: "CAPITAL_ALLOCATION" }
    ];
    
    principlePatterns.forEach(item => {
      if (item.pattern.test(text)) {
        analysis.primaryPrinciples.push(item.category);
      }
    });
    
    // If any category has no matches, use tone and context clues for default values
    if (analysis.primaryPrinciples.length === 0) {
      // Default to intrinsic value and long-term thinking as safest principles
      analysis.primaryPrinciples = ["INTRINSIC_VALUE", "LONG_TERM_THINKING"];
    }
    
    return analysis;
  },
  
  // Analyze financial metrics to determine meaningful context
  analyzeMetrics: function(metrics) {
    if (!metrics) return null;
    
    const analysis = {
      businessStrengths: [],
      businessWeaknesses: [],
      keyMetrics: {}
    };
    
    // Analyze P/E ratio
    if (metrics.pe !== undefined) {
      analysis.keyMetrics.PE_RATIO = {
        value: metrics.pe,
        level: metrics.pe > 25 ? 'HIGH' : (metrics.pe < 10 ? 'LOW' : 'MEDIUM'),
        interpretation: metrics.pe > 25 ? 'Premium valuation' : 
                      (metrics.pe < 10 ? 'Potential undervaluation or declining business' : 
                       'Reasonable valuation')
      };
      
      if (metrics.pe < 15 && metrics.pe > 0) {
        analysis.businessStrengths.push("ATTRACTIVE_VALUATION");
      } else if (metrics.pe > 30) {
        analysis.businessWeaknesses.push("EXPENSIVE_VALUATION");
      }
    }
    
    // Analyze ROE
    if (metrics.roe !== undefined || metrics.returnOnEquity !== undefined) {
      const roe = metrics.roe !== undefined ? metrics.roe : metrics.returnOnEquity;
      analysis.keyMetrics.RETURN_ON_EQUITY = {
        value: roe,
        level: roe > 15 ? 'HIGH' : (roe < 8 ? 'LOW' : 'MEDIUM'),
        interpretation: roe > 15 ? 'Excellent returns to shareholders' : 
                      (roe < 8 ? 'Poor returns to shareholders' : 
                       'Acceptable returns to shareholders')
      };
      
      if (roe > 15) {
        analysis.businessStrengths.push("HIGH_ROIC");
      } else if (roe < 8) {
        analysis.businessWeaknesses.push("LOW_RETURNS");
      }
    }
    
    // Analyze Debt to Equity
    if (metrics.debtToEquity !== undefined) {
      analysis.keyMetrics.DEBT_LEVELS = {
        value: metrics.debtToEquity,
        level: metrics.debtToEquity > 1.0 ? 'HIGH' : 
              (metrics.debtToEquity < 0.3 ? 'LOW' : 'MEDIUM'),
        interpretation: metrics.debtToEquity > 1.0 ? 'Significant financial leverage' : 
                      (metrics.debtToEquity < 0.3 ? 'Conservative financial structure' : 
                       'Moderate financial leverage')
      };
      
      if (metrics.debtToEquity < 0.5) {
        analysis.businessStrengths.push("STRONG_BALANCE_SHEET");
      } else if (metrics.debtToEquity > 1.5) {
        analysis.businessWeaknesses.push("HIGH_LEVERAGE");
      }
    }
    
    // Analyze Profit Margin
    if (metrics.profitMargin !== undefined || metrics.netMargin !== undefined) {
      const margin = metrics.profitMargin !== undefined ? metrics.profitMargin : metrics.netMargin;
      analysis.keyMetrics.PROFIT_MARGIN = {
        value: margin,
        level: margin > 15 ? 'HIGH' : (margin < 5 ? 'LOW' : 'MEDIUM'),
        interpretation: margin > 15 ? 'Excellent profitability' : 
                      (margin < 5 ? 'Thin margins' : 
                       'Average profitability')
      };
      
      if (margin > 15) {
        analysis.businessStrengths.push("PRICING_POWER");
      } else if (margin < 5) {
        analysis.businessWeaknesses.push("THIN_MARGINS");
      }
    }
    
    return analysis;
  },
  
  // Find the most relevant letter insight based on context
  findContextualLetterInsight: function(textAnalysis, metricAnalysis) {
    if (!window.buffettLetterInsightsSemantic || 
        !textAnalysis || 
        !metricAnalysis) {
      return null;
    }
    
    // Prioritize metrics for specific metric insights
    if (metricAnalysis.keyMetrics) {
      // For each analyzed metric, try to find a specific insight
      for (const [metricName, metricInfo] of Object.entries(metricAnalysis.keyMetrics)) {
        // Check if we have a direct match for this metric and level
        const metricKey = metricName.toLowerCase();
        
        const insight = window.buffettLetterInsightsSemantic.findRelevantMetricInsight(
          metricKey, 
          metricInfo.value
        );
        
        if (insight) {
          // Generate a unique ID for this insight to track usage
          const insightId = `letter:${insight.year}:${metricKey}:${metricInfo.level}`;
          
          // Check if we've already used this insight
          if (!this.usedInsightIds.has(insightId)) {
            this.usedInsightIds.add(insightId);
            return {
              ...insight,
              metricContext: metricInfo.interpretation,
              semanticId: insightId
            };
          }
        }
      }
    }
    
    // If no specific metric insight, try to match based on business characteristics
    if (textAnalysis.businessCharacteristics.length > 0 || 
        textAnalysis.primaryPrinciples.length > 0) {
      
      const categorySelectors = {};
      
      if (textAnalysis.businessCharacteristics.length > 0) {
        categorySelectors.companyCharacteristics = textAnalysis.businessCharacteristics;
      }
      
      if (textAnalysis.primaryPrinciples.length > 0) {
        categorySelectors.principles = textAnalysis.primaryPrinciples;
      }
      
      if (textAnalysis.financialMetrics.length > 0) {
        categorySelectors.financialMetrics = textAnalysis.financialMetrics;
      }
      
      // Find insights matching these categories
      const matchingInsights = window.buffettLetterInsightsSemantic.findInsightsByCategories(categorySelectors);
      
      if (matchingInsights && matchingInsights.length > 0) {
        // Filter out insights we've already used
        const unusedInsights = matchingInsights.filter(insight => {
          const insightId = `letter:${insight.year}:${insight.insight.substring(0, 40)}`;
          return !this.usedInsightIds.has(insightId);
        });
        
        if (unusedInsights.length > 0) {
          // Use the first unused insight
          const selectedInsight = unusedInsights[0];
          const insightId = `letter:${selectedInsight.year}:${selectedInsight.insight.substring(0, 40)}`;
          this.usedInsightIds.add(insightId);
          
          return {
            ...selectedInsight,
            semanticId: insightId
          };
        }
      }
    }
    
    return null;
  },
  
  // Find the most relevant quote based on context
  findContextualQuote: function(textAnalysis, metricAnalysis) {
    if (!window.buffettWisdomSemantic || 
        !textAnalysis) {
      return null;
    }
    
    const categorySelectors = {};
    
    // Add each set of analyzed categories to the selector
    if (textAnalysis.primaryPrinciples.length > 0) {
      categorySelectors.principles = textAnalysis.primaryPrinciples;
    }
    
    if (textAnalysis.investorPsychology.length > 0) {
      categorySelectors.investorPsychology = textAnalysis.investorPsychology;
    }
    
    if (textAnalysis.marketConditions.length > 0) {
      categorySelectors.marketContext = textAnalysis.marketConditions;
    }
    
    if (textAnalysis.financialMetrics.length > 0) {
      categorySelectors.financialMetrics = textAnalysis.financialMetrics;
    }
    
    // Find quotes matching these categories
    const quotes = window.buffettWisdomSemantic.findQuotesByCategories(categorySelectors);
    
    if (quotes && quotes.length > 0) {
      // Filter out quotes we've already used
      const unusedQuotes = quotes.filter(quote => {
        const quoteId = `quote:${quote.author}:${quote.quote.substring(0, 40)}`;
        return !this.usedInsightIds.has(quoteId);
      });
      
      if (unusedQuotes.length > 0) {
        // Use the first unused quote
        const selectedQuote = unusedQuotes[0];
        const quoteId = `quote:${selectedQuote.author}:${selectedQuote.quote.substring(0, 40)}`;
        this.usedInsightIds.add(quoteId);
        
        return {
          ...selectedQuote,
          semanticId: quoteId
        };
      }
    }
    
    return null;
  },
  
  // Get a contextually appropriate transition text based on the context
  generateTransition: function(insight, textAnalysis, metricAnalysis) {
    if (!insight) return "";
    
    // If insight comes with predefined application context, use that
    if (insight.applicationContext) {
      return `${insight.applicationContext}:`;
    }
    
    let transition = "";
    
    // If we have specific metric information that matches this insight
    if (insight.categories && 
        insight.categories.financialMetrics && 
        metricAnalysis && 
        metricAnalysis.keyMetrics) {
      
      for (const metricId of insight.categories.financialMetrics) {
        const metricKey = metricId.toUpperCase();
        if (metricAnalysis.keyMetrics[metricKey]) {
          const metricInfo = metricAnalysis.keyMetrics[metricKey];
          
          transition = `Regarding the ${metricInfo.interpretation} (${metricInfo.value}), Buffett offers this perspective:`;
          break;
        }
      }
    }
    
    // If no specific metric transition, try principles
    if (!transition && insight.categories && insight.categories.principles) {
      const principle = insight.categories.principles[0];
      
      switch(principle) {
        case "INTRINSIC_VALUE":
          transition = "On the importance of focusing on intrinsic value:";
          break;
        case "MARGIN_OF_SAFETY":
          transition = "About maintaining a margin of safety in investments:";
          break;
        case "CIRCLE_OF_COMPETENCE":
          transition = "Regarding the importance of staying within your circle of competence:";
          break;
        case "LONG_TERM_THINKING":
          transition = "On the value of long-term thinking:";
          break;
        case "ECONOMIC_MOAT":
          transition = "About the importance of sustainable competitive advantages:";
          break;
        case "OWNER_EARNINGS":
          transition = "On focusing on the cash a business can generate:";
          break;
        case "QUALITY_OVER_PRICE":
          transition = "About prioritizing business quality over price:";
          break;
        case "CAPITAL_ALLOCATION":
          transition = "Regarding efficient capital allocation:";
          break;
        default:
          transition = "Warren Buffett offers this insight:";
      }
    }
    
    // Default transition if nothing else works
    if (!transition) {
      transition = "This brings to mind Buffett's wisdom:";
    }
    
    return transition;
  },
  
  // Format the insight with an appropriate transition
  formatInsight: function(insight, textAnalysis, metricAnalysis) {
    if (!insight) return "";
    
    // Validate that the insight has all required fields to prevent undefined errors
    if (insight.type === 'quote' && (!insight.quote || !insight.author || !insight.source)) {
      console.warn('[Buffett Wisdom] Incomplete quote data:', insight);
      return ""; // Return empty string if missing critical data
    } else if (insight.type !== 'quote' && (!insight.insight || !insight.year)) {
      console.warn('[Buffett Wisdom] Incomplete letter insight data:', insight);
      return ""; // Return empty string if missing critical data
    }
    
    const transition = this.generateTransition(insight, textAnalysis, metricAnalysis);
    
    // Add specific metrics context if available
    let metricsContext = '';
    if (metricAnalysis && metricAnalysis.keyMetrics) {
      // Extract the relevant metrics based on the insight category
      const relevantMetrics = [];
      
      if (insight.categories) {
        // Check if this is ROE/ROIC related
        if (insight.categories.financialMetrics && 
            (insight.categories.financialMetrics.includes('return_on_equity') || 
             insight.categories.financialMetrics.includes('return_on_capital'))) {
          if (metricAnalysis.keyMetrics.RETURN_ON_EQUITY) {
            relevantMetrics.push(`ROE of ${metricAnalysis.keyMetrics.RETURN_ON_EQUITY.value.toFixed(2)}%`);
          }
          if (metricAnalysis.keyMetrics.RETURN_ON_CAPITAL) {
            relevantMetrics.push(`ROIC of ${metricAnalysis.keyMetrics.RETURN_ON_CAPITAL.value.toFixed(2)}%`);
          }
        }
        
        // Check if this is PE ratio related
        if (insight.categories.financialMetrics && 
            insight.categories.financialMetrics.includes('pe_ratio')) {
          if (metricAnalysis.keyMetrics.PE_RATIO) {
            relevantMetrics.push(`P/E ratio of ${metricAnalysis.keyMetrics.PE_RATIO.value.toFixed(2)}`);
          }
        }
        
        // Check if this is debt related
        if (insight.categories.financialMetrics && 
            insight.categories.financialMetrics.includes('debt_levels')) {
          if (metricAnalysis.keyMetrics.DEBT_LEVELS) {
            relevantMetrics.push(`debt-to-equity ratio of ${metricAnalysis.keyMetrics.DEBT_LEVELS.value.toFixed(2)}`);
          }
        }
        
        // Check if this is margin related
        if (insight.categories.financialMetrics && 
            insight.categories.financialMetrics.includes('profit_margin')) {
          if (metricAnalysis.keyMetrics.PROFIT_MARGIN) {
            relevantMetrics.push(`profit margin of ${metricAnalysis.keyMetrics.PROFIT_MARGIN.value.toFixed(2)}%`);
          }
        }
      }
      
      // If we have relevant metrics, add them to the context
      if (relevantMetrics.length > 0) {
        metricsContext = ` With this company's ${relevantMetrics.join(' and ')}, `;
      }
    }
    
    // Add metrics context to the transition
    const enhancedTransition = transition + metricsContext;
    
    if (insight.type === 'quote') {
      const author = insight.author || 'Warren Buffett';
      const source = insight.source || 'Investor Insights';
      return `\n\n**${enhancedTransition}** "${insight.quote}"\n— ${author}, ${source}`;
    } else {
      const year = insight.year || 'Annual';
      return `\n\n**${enhancedTransition}** "${insight.insight}"\n— Warren Buffett, ${year} Annual Letter`;
    }
  },
  
  // Find the most semantically relevant wisdom for a given response
  findRelevantWisdom: function(response, metrics) {
    try {
      if (!response) return null;
      
      // Analyze the response text for semantic meaning
      const textAnalysis = this.analyzeFinancialContext(response);
      
      // Analyze the financial metrics if available
      const metricAnalysis = this.analyzeMetrics(metrics);
      
      // First try to find a relevant letter insight
      const letterInsight = this.findContextualLetterInsight(textAnalysis, metricAnalysis);
      if (letterInsight) {
        return {
          insight: letterInsight,
          formattedText: this.formatInsight(letterInsight, textAnalysis, metricAnalysis)
        };
      }
      
      // If no letter insight, try to find a relevant quote
      const quote = this.findContextualQuote(textAnalysis, metricAnalysis);
      if (quote) {
        return {
          insight: quote,
          formattedText: this.formatInsight(quote, textAnalysis, metricAnalysis)
        };
      }
      
      // No relevant wisdom found
      return null;
      
    } catch (err) {
      console.error("Error finding relevant wisdom:", err);
      return null;
    }
  },
  
  // Enrich a response with semantically relevant wisdom
  enrichResponse: function(response, metrics) {
    try {
      if (!response) return response;
      
      // Find relevant wisdom
      const wisdom = this.findRelevantWisdom(response, metrics);
      
      // If we found wisdom, add it to the response
      if (wisdom && wisdom.formattedText) {
        return response + wisdom.formattedText;
      }
      
      // If no relevant wisdom, return the original response
      return response;
      
    } catch (err) {
      console.error("Error enriching response with semantic wisdom:", err);
      return response;
    }
  }
};

// Export the module
if (typeof module !== 'undefined') {
  module.exports = buffettWisdomSemanticIntegration;
} else {
  // Make it available in browser context
  window.buffettWisdomSemanticIntegration = buffettWisdomSemanticIntegration;
}
