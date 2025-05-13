/**
 * Warren Buffett's 1977 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1977.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1977 letter to shareholders.
 */

const buffettLetter1977 = {
  year: 1977,
  
  keyInsights: [
    {
      topic: "Investment Principles",
      insight: "We make no attempt to predict how security markets, interest rates, or business statistics will behave in the coming year. We're not interested in such predictions, and have no skills or insights that would make such predictions likely to be profitable.",
      context: "Explaining Berkshire's lack of interest in short-term market predictions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Business Performance Measurement",
      insight: "Accounting based on conventional generally accepted accounting principles (GAAP) is inadequate for our purposes in measuring the short-term progress of Berkshire. The major problem is that the amortization of goodwill charges required by GAAP do not reflect in any manner the economics of the business. GAAP accounting requires that we amortize intangible assets at rates determined at the time of acquisition which are not necessarily appropriate for expected intrinsic economic values.",
      context: "Discussing issues with accounting standards and how Berkshire measures business performance",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Business",
      insight: "While obviously the insurance business fluctuates much more than most, we believe that our performance over a period of years will surpass the average of our competition, including companies like Hartford, Travelers, Aetna, etc. But we also believe that the superiority of our performance will be totally random — sometimes better, sometimes poorer — when measured against the results of any given competitor.",
      context: "Explaining Berkshire's insurance business philosophy and competitive expectations",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Capital Allocation",
      insight: "Our experience has been that pro-rata portions of truly outstanding businesses sometimes sell in the securities markets at very large discounts from the prices they would command in negotiated transactions involving entire companies. Consequently our insurance subsidiaries may invest a substantial portion of their assets in common stocks.",
      context: "Early explanation of Buffett's approach to investing insurance float in undervalued securities",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    insuranceInvestments: {
      description: "In 1977, our insurance subsidiaries primarily owned diversified marketable securities, including government bonds and stocks in major corporations",
      majorHoldings: [
        "Government bonds",
        "Blue-chip common stocks"
      ],
      performance: "The overall results from insurance operations were satisfactory in 1977, showing significant improvement from 1976"
    },
    
    manufacturingAndRetail: {
      description: "Berkshire owned diversified businesses including a textile operation, See's Candies, and the Buffalo Evening News",
      performance: "Results were mixed across subsidiaries, with See's Candies showing particularly strong performance and growth potential",
      challengedOperations: "The textile business continued to face significant competitive challenges"
    }
  },
  
  notableInvestments: [
    {
      company: "See's Candies",
      industryCategory: "Retail/Confectionery",
      acquisitionYear: 1972,
      purchaseDetails: "Acquired in 1972 for approximately $25 million when the business was earning about $4 million pre-tax on $30 million of sales",
      metricsAtPurchase: {
        salesAtPurchase: "$30 million",
        preTaxEarnings: "$4 million",
        purchasePrice: "$25 million"
      },
      buffettComment: "See's has been growing at an unusually consistent rate, and has an outstanding record in the candy industry. Both sales and profits were at record levels in 1977. It is a 'have-your-cake-and-eat-it-too' business which, even in mundane times, will grow in value."
    },
    {
      company: "Buffalo Evening News",
      industryCategory: "Media/Newspaper",
      acquisitionYear: 1977, 
      purchaseDetails: "Acquired in 1977 for approximately $32.5 million",
      buffettComment: "The Buffalo Evening News was acquired in April of 1977. It had been privately held and operated for 96 years prior to our purchase."
    }
  ],
  
  economicContext: "High inflation environment with the beginning of a period that would lead to interest rates in excess of 20% in the early 1980s. Stock market was generally depressed with many value opportunities available.",
  
  letterHighlights: {
    overallMessage: "The letter demonstrates the early foundations of Buffett's investment philosophy, emphasizing long-term business ownership over speculation, the importance of honest accounting and measurement, and the value of investing in businesses with sustainable competitive advantages.",
    managementPrinciples: "Buffett emphasized focusing on businesses with good economics and strong management, avoiding businesses requiring significant capital expenditures with low returns.",
    acquisitionCriteria: "Strong preference for businesses with consistent earning power, good returns on equity, little debt, simple business models, and honest, capable management."
  },
  
  investmentLessons: [
    "Focus on the economics of businesses rather than short-term market movements",
    "GAAP accounting can often obscure the true economic performance of a business",
    "Insurance operations can provide significant 'float' for investment purposes",
    "The market often significantly undervalues partial interests in great businesses",
    "Sustainable competitive advantages (though not yet termed 'moats') are crucial for long-term business success"
  ]
};

// Make available globally
window.buffettLetter1977 = buffettLetter1977;
