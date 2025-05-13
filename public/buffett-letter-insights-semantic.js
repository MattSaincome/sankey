/**
 * Semantically Categorized Buffett Letter Insights
 * 
 * This file contains carefully categorized insights from Warren Buffett's annual letters,
 * organized by the semantic framework to enable more contextually relevant matching.
 * 
 * Each insight is tagged with detailed semantic categories for precise matching with
 * specific financial situations and investment contexts.
 */

const buffettLetterInsightsSemantic = {
  // Collection of carefully categorized letter insights
  insights: [
    // 1977-1980 Letter Insights
    {
      year: 1977,
      insight: "The primary test of managerial economic performance is the achievement of a high earnings rate on equity capital employed without undue leverage, accounting gimmickry, etc.",
      categories: {
        principles: ["QUALITY_OVER_PRICE", "CAPITAL_ALLOCATION"], 
        companyCharacteristics: ["HIGH_ROIC", "GOOD_MANAGEMENT"],
        financialMetrics: ["RETURN_ON_EQUITY", "DEBT_LEVELS"]
      },
      sentiment: "instructive",
      complexity: "moderate",
      applicationContext: "Evaluating management performance based on return on equity"
    },
    {
      year: 1979,
      insight: "The primary test of managerial economic performance is the achievement of a high earnings rate on equity capital employed rather than the achievement of consistent gains in earnings per share.",
      categories: {
        principles: ["OWNER_EARNINGS", "CAPITAL_ALLOCATION"], 
        companyCharacteristics: ["HIGH_ROIC", "GOOD_MANAGEMENT"],
        financialMetrics: ["RETURN_ON_EQUITY"]
      },
      sentiment: "instructive",
      complexity: "moderate",
      applicationContext: "Focusing on ROE rather than EPS growth when evaluating management"
    },
    
    // 1981-1985 Letter Insights
    {
      year: 1982,
      insight: "Businesses logically are worth far more than net tangible assets when they can be expected to produce earnings on such assets considerably in excess of market rates of return.",
      categories: {
        principles: ["INTRINSIC_VALUE", "ECONOMIC_MOAT"], 
        companyCharacteristics: ["HIGH_ROIC"],
        financialMetrics: ["RETURN_ON_EQUITY"]
      },
      sentiment: "explanatory",
      complexity: "moderate",
      applicationContext: "Understanding why some businesses command a premium to book value"
    },
    {
      year: 1984,
      insight: "When returns on capital are ordinary, an earn-more-by-putting-up-more situation is no great treasure. You can get the same result personally while drilling your teeth.",
      categories: {
        principles: ["CAPITAL_ALLOCATION", "QUALITY_OVER_PRICE"], 
        companyCharacteristics: ["LOW_CAPITAL_NEEDS"],
        financialMetrics: ["RETURN_ON_EQUITY"]
      },
      sentiment: "critical",
      complexity: "moderate",
      applicationContext: "Evaluating businesses with low returns on capital that require continuous reinvestment"
    },
    
    // 1986-1990 Letter Insights
    {
      year: 1987,
      insight: "What counts for most people in investing is not how much they know, but rather how realistically they define what they don't know.",
      categories: {
        principles: ["CIRCLE_OF_COMPETENCE"], 
        investorPsychology: ["RATIONALITY", "INDEPENDENT_THOUGHT"]
      },
      sentiment: "cautionary",
      complexity: "moderate",
      applicationContext: "Knowing the boundaries of your knowledge when making investment decisions"
    },
    {
      year: 1988,
      insight: "The strategy we've adopted precludes our following standard diversification dogma. Many pundits would therefore say the strategy must be riskier than that employed by more conventional investors. We believe that a policy of portfolio concentration may well decrease risk if it raises, as it should, both the intensity with which an investor thinks about a business and the comfort-level he must feel with its economic characteristics before buying into it.",
      categories: {
        principles: ["CIRCLE_OF_COMPETENCE", "QUALITY_OVER_PRICE"], 
        investorPsychology: ["INDEPENDENT_THOUGHT", "RATIONALITY"]
      },
      sentiment: "contrarian",
      complexity: "high",
      applicationContext: "Approach to portfolio concentration vs. diversification"
    },
    
    // 1991-1995 Letter Insights
    {
      year: 1992,
      insight: "The best business to own is one that over an extended period can employ large amounts of incremental capital at very high rates of return.",
      categories: {
        principles: ["CAPITAL_ALLOCATION", "QUALITY_OVER_PRICE"], 
        companyCharacteristics: ["HIGH_ROIC", "HIGH_GROWTH"],
        financialMetrics: ["RETURN_ON_EQUITY", "BOOK_VALUE_GROWTH"]
      },
      sentiment: "instructive",
      complexity: "moderate",
      applicationContext: "Identifying optimal business characteristics that can reinvest at high rates"
    },
    {
      year: 1993,
      insight: "We've long felt that the only value of stock forecasters is to make fortune tellers look good. Even now, Charlie and I continue to believe that short-term market forecasts are poison and should be kept locked up in a safe place, away from children and also from grown-ups who behave in the market like children.",
      categories: {
        principles: ["LONG_TERM_THINKING"], 
        investorPsychology: ["RATIONALITY", "INDEPENDENT_THOUGHT", "PATIENCE"],
        marketContext: ["BULL_MARKET", "BEAR_MARKET"]
      },
      sentiment: "dismissive",
      complexity: "moderate",
      applicationContext: "Avoiding short-term market predictions"
    },
    
    // 1996-2000 Letter Insights
    {
      year: 1996,
      insight: "Your goal as an investor should simply be to purchase, at a rational price, a part interest in an easily-understandable business whose earnings are virtually certain to be materially higher five, ten and twenty years from now.",
      categories: {
        principles: ["INTRINSIC_VALUE", "LONG_TERM_THINKING", "CIRCLE_OF_COMPETENCE"], 
        companyCharacteristics: ["PREDICTABLE_EARNINGS"],
        investorPsychology: ["PATIENCE"]
      },
      sentiment: "instructive",
      complexity: "moderate",
      applicationContext: "Fundamental approach to selecting investments"
    },
    {
      year: 1999,
      insight: "The key to investing is not assessing how much an industry is going to affect society, or how much it will grow, but rather determining the competitive advantage of any given company and, above all, the durability of that advantage.",
      categories: {
        principles: ["ECONOMIC_MOAT", "INTRINSIC_VALUE"], 
        companyCharacteristics: ["PRICING_POWER", "STRONG_BRAND"],
        marketContext: ["BUBBLE"]
      },
      sentiment: "instructive",
      complexity: "high",
      applicationContext: "Evaluating companies in rapidly growing or changing industries"
    },
    
    // 2001-2005 Letter Insights
    {
      year: 2001,
      insight: "When a management with a reputation for brilliance tackles a business with a reputation for bad economics, it is the reputation of the business that remains intact.",
      categories: {
        principles: ["QUALITY_OVER_PRICE", "ECONOMIC_MOAT"], 
        companyCharacteristics: ["HIGH_ROIC", "GOOD_MANAGEMENT"],
        financialMetrics: ["RETURN_ON_EQUITY", "PROFIT_MARGIN"]
      },
      sentiment: "cautionary",
      complexity: "moderate",
      applicationContext: "Considering investments in challenging industries despite strong management"
    },
    {
      year: 2003,
      insight: "Long-term competitive advantage in a stable industry is what we seek in a business. If that comes with rapid organic growth, great. But even without organic growth, such a business is rewarding. We will simply take the lush earnings of the business and use them to buy similar businesses elsewhere.",
      categories: {
        principles: ["ECONOMIC_MOAT", "CAPITAL_ALLOCATION"], 
        companyCharacteristics: ["PREDICTABLE_EARNINGS", "PRICING_POWER"],
        financialMetrics: ["RETURN_ON_EQUITY", "PROFIT_MARGIN"]
      },
      sentiment: "explanatory",
      complexity: "moderate",
      applicationContext: "Valuing stable businesses with strong competitive advantages even without growth"
    },
    
    // 2006-2010 Letter Insights
    {
      year: 2008,
      insight: "We never want to count on the kindness of strangers in order to meet tomorrow's obligations. When forced to choose, I will not trade even a night's sleep for the chance of extra profits.",
      categories: {
        principles: ["MARGIN_OF_SAFETY"], 
        financialMetrics: ["DEBT_LEVELS"],
        investorPsychology: ["RATIONALITY", "FEAR_AND_GREED"],
        marketContext: ["MARKET_CRASH", "RECESSION"]
      },
      sentiment: "cautionary",
      complexity: "moderate",
      applicationContext: "Maintaining financial safety and avoiding excessive leverage"
    },
    {
      year: 2010,
      insight: "A horse that can count to ten is a remarkable horse—not a remarkable mathematician. In business, I look for economic castles protected by unbreachable moats.",
      categories: {
        principles: ["ECONOMIC_MOAT", "QUALITY_OVER_PRICE"], 
        companyCharacteristics: ["PRICING_POWER", "STRONG_BRAND", "HIGH_ROIC"]
      },
      sentiment: "metaphorical",
      complexity: "moderate",
      applicationContext: "Seeking businesses with sustainable competitive advantages"
    },
    
    // 2011-2015 Letter Insights
    {
      year: 2012,
      insight: "The riskiness of an investment is not measured by beta but rather by the probability of that investment causing its owner a loss of purchasing power over his contemplated holding period.",
      categories: {
        principles: ["INTRINSIC_VALUE", "LONG_TERM_THINKING"], 
        investorPsychology: ["INDEPENDENT_THOUGHT"],
        marketContext: ["NORMAL_MARKET"]
      },
      sentiment: "contrarian",
      complexity: "high",
      applicationContext: "Defining risk in terms of permanent loss rather than volatility"
    },
    {
      year: 2014,
      insight: "Investors should remember that excitement and expenses are their enemies. And if they insist on trying to time their participation in equities, they should try to be fearful when others are greedy and greedy only when others are fearful.",
      categories: {
        principles: ["MARGIN_OF_SAFETY"], 
        investorPsychology: ["CONTRARIAN_THINKING", "FEAR_AND_GREED", "PATIENCE"],
        marketContext: ["BULL_MARKET", "BEAR_MARKET"]
      },
      sentiment: "cautionary",
      complexity: "moderate",
      applicationContext: "Maintaining emotional discipline during market extremes"
    },
    
    // 2016-2020 Letter Insights
    {
      year: 2017,
      insight: "The less the prudence with which others conduct their affairs, the greater the prudence with which we should conduct our own affairs.",
      categories: {
        principles: ["MARGIN_OF_SAFETY", "INDEPENDENT_THOUGHT"], 
        investorPsychology: ["CONTRARIAN_THINKING", "RATIONALITY"],
        marketContext: ["BUBBLE"]
      },
      sentiment: "cautionary",
      complexity: "moderate",
      applicationContext: "Maintaining discipline when markets become speculative"
    },
    {
      year: 2020,
      insight: "Never bet against America. That remains true today. In its brief 232 years of existence, there has been no incubator for unleashing human potential like America.",
      categories: {
        principles: ["LONG_TERM_THINKING"], 
        investorPsychology: ["OPTIMISM"],
        marketContext: ["RECESSION", "MARKET_CRASH"]
      },
      sentiment: "optimistic",
      complexity: "simple",
      applicationContext: "Maintaining long-term optimism despite short-term challenges"
    }
  ],
  
  // Financial metric-specific insights that directly address valuation metrics
  metricInsights: {
    // P/E Ratio specific insights
    pe_ratio: {
      high: [
        {
          year: 1996,
          insight: "The value of any stock, bond or business today is determined by the cash inflows and outflows – discounted at an appropriate interest rate – that can be expected to occur during the remaining life of the asset.",
          categories: {
            principles: ["INTRINSIC_VALUE"], 
            financialMetrics: ["PE_RATIO"]
          },
          applicationContext: "Evaluating stocks with high P/E ratios to determine if they're justified by future cash flows"
        }
      ],
      medium: [
        {
          year: 1992,
          insight: "We believe that according the name 'investors' to institutions that trade actively is like calling someone who repeatedly engages in one-night stands a 'romantic.'",
          categories: {
            principles: ["LONG_TERM_THINKING"], 
            investorPsychology: ["PATIENCE"]
          },
          applicationContext: "Focusing on business fundamentals rather than short-term price movements for reasonably valued companies"
        }
      ],
      low: [
        {
          year: 2001,
          insight: "To buy dollar bills for 40 cents takes intelligence; to buy dollar bills for 80 cents takes extraordinary discipline. Most investors are much more comfortable doing the former, but we think we can do better with the latter.",
          categories: {
            principles: ["MARGIN_OF_SAFETY", "INTRINSIC_VALUE"], 
            investorPsychology: ["PATIENCE", "CONTRARIAN_THINKING"]
          },
          applicationContext: "Evaluating companies with low P/E ratios that might be undervalued"
        }
      ]
    },
    
    // Return on Equity specific insights
    roe: {
      high: [
        {
          year: 1987,
          insight: "We like businesses that generate lots of cash and that have high returns on capital. Those are the businesses that create the most value for shareholders.",
          categories: {
            principles: ["QUALITY_OVER_PRICE", "OWNER_EARNINGS"], 
            companyCharacteristics: ["HIGH_ROIC"],
            financialMetrics: ["RETURN_ON_EQUITY"]
          },
          applicationContext: "Appreciating companies that generate high returns on equity"
        }
      ],
      medium: [
        {
          year: 1981,
          insight: "Our experience has been that pro-rata portions of truly outstanding businesses sometimes sell in the securities markets at very large discounts from the prices they would command in negotiated transactions involving entire companies.",
          categories: {
            principles: ["INTRINSIC_VALUE", "MARGIN_OF_SAFETY"], 
            financialMetrics: ["RETURN_ON_EQUITY"]
          },
          applicationContext: "Finding value in public markets for businesses with solid returns"
        }
      ],
      low: [
        {
          year: 2007,
          insight: "When a management team with a reputation for brilliance tackles a business with a reputation for bad economics, it is the reputation of the business that remains intact.",
          categories: {
            principles: ["ECONOMIC_MOAT"], 
            companyCharacteristics: ["HIGH_ROIC"],
            financialMetrics: ["RETURN_ON_EQUITY"]
          },
          applicationContext: "Being cautious about businesses showing poor returns on equity despite strong management"
        }
      ]
    },
    
    // Debt Levels specific insights
    debt_levels: {
      high: [
        {
          year: 2008,
          insight: "We never want to count on the kindness of strangers in order to meet tomorrow's obligations. When forced to choose, I will not trade even a night's sleep for the chance of extra profits.",
          categories: {
            principles: ["MARGIN_OF_SAFETY"], 
            financialMetrics: ["DEBT_LEVELS"]
          },
          applicationContext: "Evaluating companies with high debt during uncertain economic conditions"
        }
      ],
      medium: [
        {
          year: 2002,
          insight: "Borrowed money often causes a person or organization to do foolish things. It happens in business as well as with individuals. We do not want to risk what we have and need for something we don't have and don't need.",
          categories: {
            principles: ["MARGIN_OF_SAFETY"], 
            financialMetrics: ["DEBT_LEVELS"],
            investorPsychology: ["RATIONALITY"]
          },
          applicationContext: "Considering the risk of moderate leverage in a business"
        }
      ],
      low: [
        {
          year: 1995,
          insight: "We will reject interesting opportunities rather than over-leverage our balance sheet. We will never become dependent on the kindness of strangers.",
          categories: {
            principles: ["MARGIN_OF_SAFETY"], 
            financialMetrics: ["DEBT_LEVELS"]
          },
          applicationContext: "Appreciating companies with conservative financial structures"
        }
      ]
    },
    
    // Profit Margin specific insights
    profit_margin: {
      high: [
        {
          year: 1991,
          insight: "The best business is a royalty on the growth of others, requiring little capital itself.",
          categories: {
            principles: ["ECONOMIC_MOAT", "CAPITAL_ALLOCATION"], 
            companyCharacteristics: ["LOW_CAPITAL_NEEDS", "PRICING_POWER"],
            financialMetrics: ["PROFIT_MARGIN"]
          },
          applicationContext: "Appreciating businesses with high profit margins and capital-light models"
        }
      ],
      medium: [
        {
          year: 1986,
          insight: "The really great business produces quite extraordinary economics, doing business in an exceptional way with good-to-excellent managers.",
          categories: {
            principles: ["ECONOMIC_MOAT", "QUALITY_OVER_PRICE"], 
            companyCharacteristics: ["GOOD_MANAGEMENT", "PRICING_POWER"],
            financialMetrics: ["PROFIT_MARGIN", "RETURN_ON_EQUITY"]
          },
          applicationContext: "Evaluating businesses with solid profit margins and competitive advantages"
        }
      ],
      low: [
        {
          year: 1982,
          insight: "Should you find yourself in a chronically leaking boat, energy devoted to changing vessels is likely to be more productive than energy devoted to patching leaks.",
          categories: {
            principles: ["CIRCLE_OF_COMPETENCE", "QUALITY_OVER_PRICE"], 
            companyCharacteristics: ["DISTRESSED"],
            financialMetrics: ["PROFIT_MARGIN"]
          },
          applicationContext: "Considering companies with persistently weak margins"
        }
      ]
    }
  },
  
  // Function to find the most contextually relevant insight based on financial metrics
  findRelevantMetricInsight: function(metricName, metricValue) {
    if (!metricName || metricValue === undefined) return null;
    
    // Normalize metric name to our internal keys
    const metricKey = metricName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    // Check if we have insights for this metric
    if (!this.metricInsights[metricKey]) return null;
    
    // Determine if the metric is high, medium, or low
    let level = 'medium'; // Default
    
    switch(metricKey) {
      case 'pe_ratio':
        level = metricValue > 25 ? 'high' : (metricValue < 10 ? 'low' : 'medium');
        break;
      case 'roe':
        level = metricValue > 15 ? 'high' : (metricValue < 8 ? 'low' : 'medium');
        break;
      case 'debt_levels':
      case 'debt_to_equity':
        level = metricValue > 1.0 ? 'high' : (metricValue < 0.3 ? 'low' : 'medium');
        break;
      case 'profit_margin':
        level = metricValue > 15 ? 'high' : (metricValue < 5 ? 'low' : 'medium');
        break;
      // Add other metrics as needed
    }
    
    // Get insights for this level
    const levelInsights = this.metricInsights[metricKey][level];
    if (!levelInsights || levelInsights.length === 0) return null;
    
    // Return a random insight from this level
    return levelInsights[Math.floor(Math.random() * levelInsights.length)];
  },
  
  // Find insights based on multiple semantic categories
  findInsightsByCategories: function(categorySelectors) {
    return this.insights.filter(insight => {
      // For each category type (principles, marketContext, etc.)
      for (const categoryType in categorySelectors) {
        // Skip if this insight doesn't have this category type
        if (!insight.categories[categoryType]) return false;
        
        // Check if any requested category IDs match this insight's categories
        const requestedCategories = categorySelectors[categoryType];
        const matchFound = requestedCategories.some(requestedCat => 
          insight.categories[categoryType].includes(requestedCat)
        );
        
        // If no match found for this category type, this insight doesn't match
        if (!matchFound) return false;
      }
      
      // If we get here, all requested category types had matches
      return true;
    });
  }
};

// Export the module
if (typeof module !== 'undefined') {
  module.exports = buffettLetterInsightsSemantic;
} else {
  // Make it available in browser context
  window.buffettLetterInsightsSemantic = buffettLetterInsightsSemantic;
}
