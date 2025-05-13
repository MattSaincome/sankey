/**
 * Warren Buffett's 1991 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1991.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1991 letter to shareholders.
 */

const buffettLetter1991 = {
  year: 1991,
  
  keyInsights: [
    {
      topic: "Economic Goodwill",
      insight: "Businesses logically are worth far more than net tangible assets when they can be expected to produce earnings on such assets considerably in excess of market rates of return. The capitalized value of this excess return is economic Goodwill.",
      context: "Explaining the concept of economic goodwill versus accounting goodwill",
      relevantCompanies: ["BRK.A", "KO", "GEICO", "WFC"]
    },
    {
      topic: "Market Fluctuations",
      insight: "In the short run, the market is a voting machine, but in the long run it is a weighing machine. The speed at which a business's success is recognized, furthermore, is not that important as long as the company's intrinsic value is increasing at a satisfactory rate. In fact, delayed recognition can be an advantage: It may give us the chance to buy more of a good thing at a bargain price.",
      context: "Discussing the disconnect between short-term market prices and long-term business value",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Management Quality",
      insight: "In making acquisitions, we have a strong preference for businesses that have been consistently profitable over a long period and that earn good returns on equity while employing little or no debt. Furthermore, we want management in place with a proven track record and an interest in being our partner.",
      context: "Explaining Berkshire's acquisition criteria",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Principles",
      insight: "Charlie and I decided long ago that in an investment lifetime it's too hard to make hundreds of smart decisions. Therefore, we adopted a strategy that required our being smart - and not too smart at that - only a very few times. Indeed, we'll now settle for one good idea a year. (Charlie says it's my turn.)",
      context: "Discussing Berkshire's concentrated investment approach",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Business vs. Stock",
      insight: "Your goal as an investor should be simply to purchase, at a rational price, a part interest in an easily understandable business whose earnings are virtually certain to be materially higher, five, ten, and twenty years from now. Over time, you will find only a few companies that meet these standards - so when you see one that qualifies, you should buy a meaningful amount of stock.",
      context: "Explaining Berkshire's philosophy of focusing on the business, not the stock",
      relevantCompanies: ["BRK.A", "KO", "GIS"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $398.3 million in 1991 from $203.0 million in 1990, primarily due to improved insurance results.",
      bookValueGrowth: "Book value increased 39.6% during 1991 to $6,437.11 per share from $4,612.06."
    },
    
    insuranceOperations: {
      description: "Insurance operations had significantly improved results, with a return to underwriting profitability and strong investment income.",
      underwritingResult: "Underwriting profit of $49.7 million compared to a loss of $26.7 million in 1990.",
      investmentIncome: "Investment income increased to $331.4 million from $327.5 million in 1990.",
      superCatBusiness: "Super-catastrophe business had a record year for premium volume and profitability."
    },
    
    seesCandy: {
      description: "See's Candies rebounded strongly from a difficult 1990.",
      sales: "$212.8 million, up 3.1% from $206.4 million in 1990.",
      earnings: "$42.2 million pre-tax, up 6.6% from $39.6 million the previous year.",
      poundageSold: "27.1 million pounds versus 25.8 million in 1990.",
      buffettComment: "Chuck Huggins continues to set new records at See's, delivering exceptional results in both operations and financial performance. The business now generates impressive returns on capital while requiring almost no additional investment to grow."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News continued to face challenges.",
      performance: "Earnings remained under pressure due to the weak Buffalo economy and structural challenges in the newspaper industry.",
      buffettComment: "Stan Lipsey continues to do a first-class job running the paper, but the economic strength of newspapers has clearly diminished from the days when they were the only game in town for advertising."
    },
    
    hhbrown: {
      description: "H.H. Brown continued its excellent performance.",
      performance: "Sales increased to $236.5 million, with pre-tax earnings of $28.2 million.",
      returnOnCapital: "About 43% on average invested capital of $65.9 million.",
      buffettComment: "Frank Rooney has done an absolutely first-class job of running H.H. Brown, generating exceptional returns on capital while expanding the business intelligently."
    }
  },
  
  notableInvestments: [
    {
      company: "Gillette",
      industryCategory: "Consumer Products",
      investmentYear: 1991,
      investment: "$600 million for convertible preferred stock with an 8.25% dividend yield",
      ownership: "Convertible into approximately 11% of Gillette's common stock",
      metricsAtPurchase: {
        marketCap: "Approximately $5.5 billion",
        peRatio: "About 15x",
        returnOnEquity: "Approximately 30%",
        globalMarketShare: "60% of the blade market, dominant position in razors, toiletries, and writing instruments"
      },
      buffettComment: "Gillette's business is pretty simple to understand: a couple of blades, a little chrome, and some great advertising... and men look forward to shaving everyday. Gillette has an incredible consumer franchise built on delivering an outstanding product that requires a 'useful', but low-cost, consumer item that customers have to keep buying. Gillette's profitability is not dependent on excessive capital investment or leverage. It's a business that would be great fun to manage—if you know what you're doing."
    },
    {
      company: "Wells Fargo",
      industryCategory: "Banking",
      ownership: "Approximately 10% of the company",
      performance: "The stock declined significantly during 1991 due to concerns about California real estate and the banking industry generally.",
      buffettComment: "Our unrealized gain in Wells Fargo is now about $130 million. In our view, these investments are quite attractive compared to many other businesses in which we might invest. Carl Reichardt is superb, and Wells Fargo continues to increase its share of the California market."
    },
    {
      company: "The Guinness PLC",
      industryCategory: "Beverages",
      investment: "Increased position to about 2% of the company",
      buffettComment: "We continue to have a high regard for the company's products and management. Guinness, along with Coca-Cola, represents the kind of international consumer franchise that we find particularly attractive."
    }
  ],
  
  economicContext: "1991 saw the continuation and eventual end of the recession that began in 1990. The Gulf War and its aftermath impacted oil prices and consumer confidence. The banking and real estate sectors remained under significant pressure, particularly in California and the Northeast.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the quality of Berkshire's business portfolio and investment holdings, particularly those with sustainable competitive advantages.",
    gillette: "Explained Berkshire's major new investment in Gillette, highlighting the company's exceptional consumer franchise.",
    economicMoats: "Continued emphasis on the critical importance of sustainable competitive advantages or 'moats' for long-term business success."
  },
  
  keyMetrics: {
    bookValue: "$6,437.11 per share, up 39.6% from 1990",
    operatingEarnings: "$398.3 million in 1991 vs. $203.0 million in 1990",
    seesCandy: {
      sales: "$212.8 million in 1991 vs. $206.4 million in 1990",
      earnings: "$42.2 million pre-tax in 1991 vs. $39.6 million in 1990",
      poundageSold: "27.1 million pounds vs. 25.8 million in 1990"
    },
    hhbrown: {
      sales: "$236.5 million",
      earnings: "$28.2 million pre-tax",
      returnOnCapital: "43% on average invested capital of $65.9 million"
    }
  },
  
  investmentLessons: [
    "The importance of focusing on businesses with sustainable competitive advantages",
    "The value of a long-term perspective when market prices diverge from business value",
    "The advantages of concentrating investments in a small number of exceptional businesses",
    "The critical role of management quality in both operating businesses and investment targets",
    "The superiority of businesses with high returns on capital and limited capital requirements"
  ]
};

// Make available globally
window.buffettLetter1991 = buffettLetter1991;
