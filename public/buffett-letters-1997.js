/**
 * Warren Buffett's 1997 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1997.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1997 letter to shareholders.
 */

const buffettLetter1997 = {
  year: 1997,
  
  keyInsights: [
    {
      topic: "Market Efficiency",
      insight: "In our opinion, the real risk that an investor must assess is whether his aggregate after-tax receipts from an investment (including those he receives on sale) will, over his prospective holding period, give him at least as much purchasing power as he had to begin with, plus a modest rate of interest on that initial stake. Though this risk cannot be calculated with engineering precision, it can in some cases be judged with a degree of accuracy that is useful.",
      context: "Discussing market risk in a period of high stock valuations",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Circle of Competence",
      insight: "If we have a strength, it is in recognizing when we are operating well within our circle of competence and when we are approaching the perimeter. Predicting the long-term economics of companies that operate in fast-changing industries is simply far beyond our perimeter. If John Maynard Keynes, who by all accounts was a genius with an IQ of 190, couldn't outperform the market consistently by trying to predict what others were going to predict, I don't like my chances of doing it successfully.",
      context: "Explaining Berkshire's limited involvement in technology stocks during the emerging tech boom",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Principles",
      insight: "So, as the old saying goes, what the wise man does in the beginning, the fool does in the end. The current foolishness is not confined to investments in Internet stocks. The market is awash in large deals, whether they make sense or not. It appears that part of the current enthusiasm for big deals comes from management's fear that if they don't do something on the external front, their personal options will become less valuable.",
      context: "Warning about the growing trend of overpriced acquisitions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Economics",
      insight: "Our major competitive advantage lies in our culture, which enables us to attract and retain talented managers who find working for Berkshire to be more satisfying than alternatives, including retirement. That's hardly a line found in a management text, but it's true. Cultures self-perpetuate - and at Berkshire, managers want to manage, and results speak for themselves. We have no committees, no management meetings, and no organizational charts.",
      context: "Discussing Berkshire's management advantages in the insurance business",
      relevantCompanies: ["BRK.A", "GEICO"]
    },
    {
      topic: "Valuation Principles",
      insight: "The key to investing is not assessing how much an industry is going to affect society, or how much it will grow, but rather determining the competitive advantage of any given company and, above all, the durability of that advantage. The products or services that have wide, sustainable moats around them are the ones that deliver rewards to investors. The most important thing to me is figuring out how big a moat there is around the business. What I love, of course, is a big castle and a big moat with piranhas and crocodiles.",
      context: "Explaining his focus on competitive advantage rather than growth projections",
      relevantCompanies: ["BRK.A", "KO", "AXP", "GEICO"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased substantially to $2.83 billion in 1997 from $2.49 billion in 1996.",
      bookValueGrowth: "Book value increased 34.1% during 1997 to $25,488 per share from $19,011.",
      shareholdersEquity: "$31.40 billion at year-end 1997, up from $23.40 billion at year-end 1996."
    },
    
    insuranceOperations: {
      description: "Insurance operations had an exceptional year.",
      underwritingResult: "Underwriting profit of $338.9 million compared to $142.8 million in 1996.",
      investmentIncome: "Investment income increased to $997.9 million from $726.2 million in 1996.",
      superCatBusiness: "The super-catastrophe business contributed significantly to underwriting profit, with no major catastrophe losses during the year.",
      buffettComment: "Because leverage of 2:1 comes with our territory, Berkshire's insurance business, excellent though it is, presents us with a worrisome problem: Though we have never had a loss from a single event that has been material to the company, it is not difficult to think of scenarios in which we could lose $500 million or more from a single catastrophe."
    },
    
    geico: {
      description: "GEICO continued its excellent performance.",
      policyGrowth: "Policies-in-force grew by 16.0% in 1997.",
      marketShare: "4.6% of the private passenger auto insurance market, up from 3.7% in 1995.",
      buffettComment: "GEICO is managed by Tony Nicely, who brings both extraordinary talents and a strong passion to the job. If we could clone Tony, our management problems would be solved: GEICO would be the company that GM, Ford, and Chrysler sell 'automobile insurance' side by side with cars."
    },
    
    seesCandy: {
      description: "See's Candies set new records in sales and earnings.",
      sales: "$258.4 million, up 4.8% from $246.5 million in 1996.",
      earnings: "$65.0 million pre-tax, up 9.4% from $59.4 million in 1996.",
      buffettComment: "See's performance has been truly extraordinary. Chuck Huggins took over as CEO in 1972, the year we purchased the company. In 1997, See's pre-tax operating earnings were $65.0 million, more than 13 times the $4.9 million achieved in 1972, and a record for the company."
    },
    
    flightSafetyInternational: {
      description: "FlightSafety performed well in 1997.",
      buffettComment: "With 222 simulators installed, FlightSafety is by far the world's largest provider of pilot training services to commercial airlines, corporate aircraft owners, and the military. Al Ueltschi, who founded the company in 1951, continues to run operations with the same enthusiasm and dedication that has always characterized his brilliant leadership."
    }
  },
  
  notableInvestments: [
    {
      company: "International Dairy Queen",
      industryCategory: "Food/Restaurant",
      acquisitionYear: 1997,
      purchasePrice: "$585 million",
      businessDescription: "Leading franchisor of quick-service restaurants with 5,792 Dairy Queen stores worldwide",
      metricsAtPurchase: {
        storeCount: "5,792 units worldwide",
        systemSales: "Approximately $2.3 billion"
      },
      buffettComment: "International Dairy Queen distributes more than 95 million Blizzards annually - something I may match on a personal basis. IDQ has both a large and extremely loyal constituency, and we are delighted to be in partnership with them."
    },
    {
      company: "Star Furniture",
      industryCategory: "Retail/Furniture",
      acquisitionYear: 1997,
      purchasePrice: "Not disclosed",
      businessDescription: "High-quality furniture retailer based in Houston, Texas",
      buffettComment: "Star Furniture was brilliantly run by Melvyn Wolff, who started as a teenager in the business that his Polish immigrant father had founded. Melvyn's passion for the business and focus on customer service has created an outstanding operation that we are proud to own."
    },
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      ownership: "Approximately 8% of the company",
      performance: "Coca-Cola continued to expand its global market share and earnings.",
      marketValue: "$13.3 billion at year-end 1997, up from $10.5 billion at year-end 1996",
      buffettComment: "In 1997, the world consumed 13.8 billion unit cases of Coca-Cola's products. The growth potential for Coca-Cola remains enormous: Currently, annual per-capita consumption of Coca-Cola products is about 296 servings in the U.S., 191 in Mexico, 69 in China, and just 11 in India."
    },
    {
      company: "American Express",
      industryCategory: "Financial Services",
      ownership: "Approximately 10.7% of the company",
      performance: "American Express continued to strengthen its market position and performance.",
      marketValue: "$6.2 billion at year-end 1997, up from $4.3 billion at year-end 1996",
      buffettComment: "Harvey Golub and Ken Chenault have done a terrific job in reestablishing American Express's global prominence in charge cards and travel. The company's growth opportunities, already abundant, will be even greater in a world that increasingly wants to pay with plastic."
    }
  ],
  
  economicContext: "1997 saw continued strong economic growth in the United States, with low inflation and unemployment. The stock market continued its powerful bull run, with the Dow Jones Industrial Average crossing the 8,000 mark. The 'Asian Financial Crisis' that began in mid-1997 created significant turmoil in overseas markets but had only limited impact on the U.S. economy.",
  
  letterHighlights: {
    overallMessage: "Buffett expressed concerns about high stock market valuations and the proliferation of overpriced acquisitions, while emphasizing Berkshire's focus on businesses with sustainable competitive advantages.",
    acquisitionStrategy: "Continued focus on acquiring businesses with predictable economics, strong management, and reasonable prices, exemplified by the International Dairy Queen acquisition.",
    marketOutlook: "Expressed growing concern about overall market valuations while maintaining confidence in Berkshire's major holdings."
  },
  
  keyMetrics: {
    bookValue: "$25,488 per share, up 34.1% from 1996",
    operatingEarnings: "$2.83 billion in 1997 vs. $2.49 billion in 1996",
    seesCandy: {
      sales: "$258.4 million in 1997 vs. $246.5 million in 1996",
      earnings: "$65.0 million pre-tax in 1997 vs. $59.4 million in 1996"
    },
    geico: {
      policiesInForce: "16.0% growth in 1997",
      marketShare: "4.6% of private passenger auto insurance market"
    }
  },
  
  investmentLessons: [
    "The importance of operating within your circle of competence, especially regarding fast-changing industries",
    "The focus on businesses with sustainable competitive advantages ('moats') rather than high-growth industries",
    "The value of a decentralized management structure that attracts and retains talented managers",
    "The dangers of following market trends and making acquisitions at inflated prices",
    "The long-term benefits of businesses with global growth potential and pricing power"
  ]
};

// Make available globally
window.buffettLetter1997 = buffettLetter1997;
