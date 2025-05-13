/**
 * Warren Buffett's 1981 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1981.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1981 letter to shareholders.
 */

const buffettLetter1981 = {
  year: 1981,
  
  keyInsights: [
    {
      topic: "Understanding Business Economics",
      insight: "The primary test of managerial economic performance is the achievement of a high earnings rate on equity capital employed (without undue leverage, accounting gimmickry, etc.) and not the achievement of consistent gains in earnings per share.",
      context: "Discussing the proper measurement of business performance",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Acquisition Criteria",
      insight: "We look for first-class businesses accompanied by first-class managements. Chain acquisitions generally lead to the opposite result - management of reputation leads to the hiring of a manager of reputation, etc.",
      context: "Explaining Berkshire's acquisition strategy",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Social Responsibility in Business",
      insight: "I can't resist pointing out that a business that needs to continue to get an ROE of 20% when interest rates are 5% probably is being run as needed. When current rates are 15%, you can tie a full-page ad in Forbes to a really good company and it will still be a great business. But when 5% rates return, it may turn out that it all was a bunch of nonsense... a business that must continue to provide a good return in ultra-high interest rates is a good business.",
      context: "Discussing the evaluation of business quality through different interest rate environments",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Understanding Goodwill",
      insight: "Businesses logically are worth far more than net tangible assets when they can be expected to produce earnings on such assets considerably in excess of market rates of return. The capitalized value of this excess return is economic Goodwill.",
      context: "Explaining the concept of economic goodwill versus accounting goodwill",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Low-Return Businesses",
      insight: "Experience indicates that the best business returns are usually achieved by companies that are doing something quite similar today to what they were doing five or ten years ago.",
      context: "Explaining why businesses with simple, consistent operations often outperform those constantly seeking new opportunities",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings improved to $39.7 million in 1981 from $41.9 million in 1980.",
      bookValueGrowth: "Book value increased 31.4% during 1981 to $566.93 per share from $431.48."
    },
    
    insuranceOperations: {
      description: "Insurance operations had mixed results.",
      underwritingResult: "The combined ratio for primary insurance was approximately 103, meaning a $3 loss on each $100 of business written.",
      investmentIncome: "Investment income remained strong, helping offset underwriting challenges."
    },
    
    seesCandy: {
      description: "See's Candies achieved another record year despite a sluggish economy.",
      sales: "$96.2 million, up from $87.3 million in 1980.",
      earnings: "$13.0 million pre-tax, up from $12.4 million the previous year.",
      buffettComment: "See's achieved a record pre-tax earnings rate of 35% on year-end invested capital, a remarkable performance considering our recent major investment in a new production facility."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News remained unprofitable but showed significant improvement.",
      events: "The first full year of Sunday publication contributed to improved results.",
      outlook: "We now believe that our circulation is approaching a level at which the paper will be profitable."
    },
    
    illinoisNationalBank: {
      description: "Illinois National Bank again had an outstanding year.",
      earnings: "$4.1 million versus $3.8 million in 1980.",
      returnOnAssets: "About 2.3% of average assets, among the highest figures for large banks in the country."
    }
  },
  
  notableInvestments: [
    {
      company: "Nebraska Furniture Mart",
      industryCategory: "Retail/Furniture",
      acquisitionYear: 1981,
      purchaseDetails: "Acquired in 1981",
      buffettComment: "We negotiated the purchase of 90% of the business from Rose Blumkin (Mrs. B) and her family. Mrs. B, who is 88, is a remarkable woman and an extraordinary businessperson. She came to the United States 40 years ago, unable to speak English and with $500. She has built the largest home furnishings store in the country from scratch and continues to drive a hard bargain every day."
    },
    {
      company: "GEICO",
      industryCategory: "Insurance",
      performance: "Jack Byrne's record at GEICO continues to be extraordinary.",
      valuationChange: "GEICO's stock price increased modestly during the year to $46 from $42 at year-end 1980.",
      buffettComment: "Our total holdings of GEICO were valued at about $47 million at year-end 1981 vs. our cost of $20 million."
    },
    {
      company: "General Foods",
      industryCategory: "Consumer Products",
      ownershipIncrease: "Added to position significantly",
      investment: "Ownership increased to 434,550 shares from 232,000 shares at the end of 1980.",
      buffettComment: "We have significantly increased our holdings and now own about 1% of the company."
    }
  ],
  
  economicContext: "1981 saw extremely high interest rates, with the prime rate peaking at 21.5% as the Federal Reserve under Paul Volcker fought inflation. The economy entered a severe recession, with unemployment rising significantly.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the importance of owning businesses with strong economic characteristics rather than trying to predict interest rates or economic cycles.",
    acquisitionStrategy: "Outlined Berkshire's acquisition criteria, focusing on businesses with strong earnings records, simple operations, and capable management.",
    economicGoodwill: "Discussed the concept of economic goodwill and its increasing importance in Berkshire's portfolio."
  },
  
  keyMetrics: {
    bookValue: "$566.93 per share, up 31.4% from 1980",
    operatingEarnings: "$39.7 million in 1981 vs. $41.9 million in 1980",
    seesCandy: {
      sales: "$96.2 million in 1981 vs. $87.3 million in 1980",
      earnings: "$13.0 million pre-tax in 1981 vs. $12.4 million in 1980",
      returnOnCapital: "35% on year-end invested capital"
    }
  },
  
  acquisitionCriteria: [
    "Large businesses that we can understand",
    "Favorable long-term economic prospects",
    "Operated by honest and competent people",
    "Businesses available at a sensible price"
  ],
  
  investmentLessons: [
    "The importance of focusing on return on equity as the primary measure of business performance",
    "The value of businesses with consistent operations rather than those constantly seeking new opportunities",
    "The superiority of businesses that generate rather than consume capital",
    "The concept of economic goodwill as distinct from accounting goodwill",
    "The advantage of simple, understandable businesses with proven economic characteristics"
  ]
};

// Make available globally
window.buffettLetter1981 = buffettLetter1981;
