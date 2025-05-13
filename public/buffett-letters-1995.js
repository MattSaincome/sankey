/**
 * Warren Buffett's 1995 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1995.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1995 letter to shareholders.
 */

const buffettLetter1995 = {
  year: 1995,
  
  keyInsights: [
    {
      topic: "Economic Franchise",
      insight: "An economic franchise arises from a product or service that: (1) is needed or desired; (2) is thought by its customers to have no close substitute; and (3) is not subject to price regulation. The existence of all three conditions will be demonstrated by a company's ability to regularly price its product or service aggressively and thereby to earn high rates of return on capital. Moreover, franchises can tolerate mismanagement. Inept managers may diminish a franchise's profitability, but they cannot inflict mortal damage.",
      context: "Discussing the concept of economic franchises and their importance in business valuation",
      relevantCompanies: ["BRK.A", "KO", "GEICO", "WPO"]
    },
    {
      topic: "GEICO Acquisition",
      insight: "GEICO is the seventh largest auto insurer in the United States with a market share of about 3.7%, achieved with an advertising budget that's about 2% of the industry's. There are only two brand-new ideas in the world: the Bible and GEICO direct marketing. And I'm not that sure about the former. GEICO is the low-cost operator in a huge business, it has no mandatory retirement age, and its culture rewards productivity without regard to age, gender, or race.",
      context: "Explaining Berkshire's complete acquisition of GEICO after being a part-owner for many years",
      relevantCompanies: ["BRK.A", "GEICO"]
    },
    {
      topic: "Capital Allocation",
      insight: "At Berkshire, we can - without incurring taxes or much in the way of other costs - move huge sums from businesses that have limited opportunities for incremental investment to other sectors with greater promise. Moreover, we are free of historical biases created by lifelong association with a given industry and are not subject to pressures from colleagues having a vested interest in maintaining the status quo. That's important: If horses had controlled investment decisions, there would have been no auto industry.",
      context: "Explaining the capital allocation advantages of Berkshire's structure",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Management Incentives",
      insight: "At Berkshire, we use an incentive compensation system that rewards key managers for meeting targets in their own bailiwicks. If See's does well, that does not produce incentive compensation at the Buffalo News - nor vice versa. Neither does Berkshire's stock price. We believe good unit performance should be rewarded whether Berkshire's stock rises, falls, or stays even. Similarly, we think average performance should earn no special rewards even if our stock should soar.",
      context: "Discussing Berkshire's approach to management incentives and compensation",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Compounding Power",
      insight: "Indeed, if you aren't willing to own a stock for ten years, don't even think about owning it for ten minutes. Put together a portfolio of companies whose aggregate earnings march upward over the years, and so also will the portfolio's market value.",
      context: "Explaining Berkshire's long-term investment approach",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's net worth increased by $5.3 billion during 1995.",
      bookValueGrowth: "Book value increased 45.0% during 1995 to $14,426 per share from $9,943.",
      netEarnings: "$725 million, up from $603 million in 1994."
    },
    
    insuranceOperations: {
      description: "Insurance operations performed exceptionally well, with the acquisition of GEICO being the highlight of the year.",
      underwritingResult: "Underwriting profit of $20.5 million compared to a loss of $20.5 million in 1994.",
      investmentIncome: "Investment income increased to $501.6 million from $419.4 million in 1994.",
      buffettComment: "The GEICO acquisition for $2.3 billion is the largest purchase in Berkshire's history, and a significant event in our insurance operations. Our ownership of GEICO dates back to 1976, and we're delighted to finally own 100% of this extraordinary company."
    },
    
    flightSafetyInternational: {
      description: "Acquired 80.1% of FlightSafety International, the world's leading provider of professional aviation training.",
      acquisition: "Paid approximately $1.5 billion for our stake.",
      buffettComment: "FlightSafety has a durable competitive advantage, the world's premier trainer of pilots and aviation maintenance workers, with 42 simulators installed at 22 U.S. and Canadian centers. Al Ueltschi founded the company in1951 and still possesses the entrepreneurial drive that has built this business. He is a remarkable man who has my admiration and respect."
    },
    
    seesCandy: {
      description: "See's Candies had another record year despite modest volume growth.",
      sales: "$226.1 million, up slightly from $224.5 million in 1994.",
      earnings: "$50.2 million pre-tax, up 3.7% from $48.4 million the previous year.",
      buffettComment: "See's has achieved extraordinary results since we purchased it in 1972. The business now operates 206 retail stores located primarily in California. Chuck Huggins, See's long-time CEO, continues to deliver exceptional results."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News faced continued challenges.",
      performance: "Earnings remained under pressure due to rising newsprint costs and advertising revenue challenges.",
      buffettComment: "Stan Lipsey continues to do an excellent job managing the paper in a difficult environment with increasing competitive pressure from other media."
    }
  },
  
  notableInvestments: [
    {
      company: "GEICO",
      industryCategory: "Insurance",
      acquisitionYear: 1995,
      purchasePrice: "$2.3 billion for the remaining 49% of the company (total valuation approximately $4.7 billion)",
      metricsAtPurchase: {
        premiumVolume: "Over $3 billion",
        marketShare: "3.7% of the U.S. auto insurance market",
        costAdvantage: "GEICO's expense ratio is about 24% versus 30% or more for agency companies",
        growthRate: "8.3% compound annual growth in policies-in-force from 1985-1995"
      },
      buffettComment: "GEICO is the seventh largest auto insurer in the United States. The company has an enormously efficient direct marketing operation and is the low-cost operator in a business in which cost is essential. Tony Nicely, GEICO's CEO, has been with the company for 34 years. He receives no stock options nor restricted stock--we could not in good conscience recommend that he receive such awards when we are not going to accept them ourselves."
    },
    {
      company: "FlightSafety International",
      industryCategory: "Professional Training",
      acquisitionYear: 1995,
      purchasePrice: "Approximately $1.5 billion for 80.1% of the company",
      businessDescription: "World's leading provider of professional aviation training with a dominant market position in providing pilot and maintenance training to major airlines and corporate aviation departments",
      metricsAtPurchase: {
        simulators: "42 simulators at 22 training centers",
        customers: "Nearly all major airlines and 1,400 corporate aviation departments",
        returnOnCapital: "High returns on invested capital"
      },
      buffettComment: "FlightSafety's simulators cost an average of about $7.5 million each to build and operate around the clock to earn maximum returns. Al Ueltschi, now 78, continues to run the business with the same enthusiasm and competitive drive that he has exhibited since founding the company in 1951."
    },
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      ownership: "Approximately 8% of the company",
      performance: "Coca-Cola continued to increase its global market share and earnings.",
      buffettComment: "Roberto Goizueta and his management team continue to set the standard for operational excellence and shareholder-oriented decisions. Coca-Cola's brand recognition and distribution network create an extraordinary global franchise."
    },
    {
      company: "American Express",
      industryCategory: "Financial Services",
      ownership: "Approximately 10.5% of the company",
      performance: "American Express showed continued improvement under CEO Harvey Golub.",
      buffettComment: "Harvey Golub and his team have dramatically improved American Express's operations and competitive position. The company's powerful brand and financial strength position it well for continued prosperity."
    }
  ],
  
  economicContext: "1995 saw continued economic growth in the United States, with low inflation and strong corporate profits. The bull market in stocks continued, with the Dow Jones Industrial Average gaining over 33% for the year.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the value of businesses with economic franchises and sustainable competitive advantages, while highlighting Berkshire's major acquisitions of GEICO and FlightSafety.",
    investmentProcess: "Continued focus on acquiring businesses with consistent earnings power, good returns on equity, capable management, and reasonable prices.",
    marketOutlook: "Expressed concerns about high overall stock market valuations but maintained confidence in Berkshire's major holdings."
  },
  
  keyMetrics: {
    bookValue: "$14,426 per share, up 45.0% from 1994",
    netEarnings: "$725 million in 1995 vs. $603 million in 1994",
    seesCandy: {
      sales: "$226.1 million in 1995 vs. $224.5 million in 1994",
      earnings: "$50.2 million pre-tax in 1995 vs. $48.4 million in 1994"
    }
  },
  
  investmentLessons: [
    "The critical importance of economic franchises in creating sustainable competitive advantages",
    "The advantages of Berkshire's structure in efficient capital allocation across diverse businesses",
    "The value of management incentives tied to business-unit performance rather than overall company or stock performance",
    "The power of compounding through long-term ownership of excellent businesses",
    "The importance of management quality and integrity in acquisition decisions"
  ]
};

// Make available globally
window.buffettLetter1995 = buffettLetter1995;
