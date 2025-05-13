/**
 * Warren Buffett's 1978 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1978.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1978 letter to shareholders.
 */

const buffettLetter1978 = {
  year: 1978,
  
  keyInsights: [
    {
      topic: "Business Evaluation",
      insight: "Businesses logically are worth far more than net tangible assets when they can be expected to produce earnings on such assets considerably in excess of market rates of return.",
      context: "Explaining the concept of economic goodwill and its relation to earnings on tangible assets",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Capital Allocation",
      insight: "Capital-intensive businesses generally earn low rates of return - rates that often barely provide enough capital to fund the inflationary needs of the existing business, with nothing left over for real growth, for distribution to owners, or for acquisition of new businesses.",
      context: "Comparing returns on capital across different business types",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Return on Capital",
      insight: "The primary test of managerial economic performance is the achievement of a high earnings rate on equity capital employed (without undue leverage, accounting gimmickry, etc.) and not the achievement of consistent gains in earnings per share.",
      context: "Explaining how Berkshire evaluates business performance",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Industry Economics",
      insight: "While we always were aware of the inferior nature of the textile business, we had no idea that its economics could deteriorate so dramatically... A textile business both requires substantial capital investment and, in our case, produces very little in the way of positive cash flow.",
      context: "Discussing the challenges of the textile business",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Competitive Environment",
      insight: "The Buffalo Evening News operated at a significant loss during 1978... The News now competes in every respect with The Buffalo Courier-Express. Such all-out competition has resulted in operating losses in 1978 to both papers, with our losses the more substantial.",
      context: "Discussing the competitive challenges at the Buffalo Evening News acquisition",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    insuranceOperations: {
      description: "Insurance operations had a good year, with both underwriting and investment areas contributing to overall performance.",
      premiumVolume: "Insurance companies achieved $151.0 million in premium volume versus $134.3 million in 1977.",
      investmentResults: "Investment income increased to $19.7 million from $17.4 million in 1977."
    },
    
    seesCandy: {
      description: "See's Candies continued its outstanding record in 1978.",
      salesIncrease: "Sales increased 13% from 1977 and pre-tax margins widened slightly in a remarkable achievement considering the industry-wide cost pressures on sugar and chocolate.",
      management: "Chuck Huggins continued to keep tight control over operations while maintaining the outstanding quality of products."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News faced significant competition and operated at a substantial loss.",
      competitiveEnvironment: "All-out competition with The Buffalo Courier-Express resulted in operating losses for both papers.",
      outlook: "Buffalo remains a viable and prosperous market, and we are hopeful that the escalating losses at both papers will cause eventually some reassessment of competitive marketing arrangements."
    }
  },
  
  notableInvestments: [
    {
      company: "Blue Chip Stamps",
      industryCategory: "Retail/Trading Stamps",
      ownershipChange: "Increased ownership from 49% to 58%",
      buffettComment: "We increased our interest in Blue Chip during the year to approximately 58% from 49% at year-end 1977. Blue Chip has a history dating back to 1960, and operates a trading stamp and retail business. It also owns See's Candies and the Buffalo Evening News."
    },
    {
      company: "GEICO",
      industryCategory: "Insurance",
      ownership: "Significant minority stake",
      buffettComment: "We have a very major interest in GEICO, the outstanding insurance company in the country run by the outstanding manager, Jack Byrne."
    }
  ],
  
  economicContext: "1978 saw continuing high inflation (over 9% in the US) with significant pressures on businesses with capital-intensive operations. Interest rates continued to rise and many traditional businesses struggled to maintain profitability.",
  
  letterHighlights: {
    overallMessage: "Buffett continued to refine his investment philosophy, particularly stressing the importance of return on capital employed and the challenges of capital-intensive businesses.",
    performanceMeasurement: "Emphasized return on equity as the primary measure of business performance rather than consistent earnings growth.",
    businessQuality: "Demonstrated a growing preference for businesses that require minimal capital investment to maintain competitive position and growth."
  },
  
  keyMetrics: {
    bookValue: "$156.4 million ($160.22 per share) vs. $142.6 million ($146.10 per share) in 1977",
    increase: "9.7% gain in book value",
    insurancePremium: "$151.0 million vs. $134.3 million in 1977",
    insuranceInvestmentIncome: "$19.7 million vs. $17.4 million in 1977"
  },
  
  investmentLessons: [
    "The importance of return on capital employed as the primary metric for business evaluation",
    "The dangers of capital-intensive businesses, especially in inflationary environments",
    "The difference between accounting goodwill and economic goodwill",
    "The challenges of turning around businesses in structurally disadvantaged industries",
    "The competitive dynamics in media markets and their impact on profitability"
  ]
};

// Make available globally
window.buffettLetter1978 = buffettLetter1978;
