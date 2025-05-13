/**
 * Warren Buffett's 1996 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1996.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1996 letter to shareholders.
 */

const buffettLetter1996 = {
  year: 1996,
  
  keyInsights: [
    {
      topic: "Intrinsic Value",
      insight: "Intrinsic value can be defined simply: It is the discounted value of the cash that can be taken out of a business during its remaining life. Anyone calculating intrinsic value necessarily comes up with a highly subjective figure that will change both as estimates of future cash flows are revised and as interest rates move. Despite its fuzziness, however, intrinsic value is all-important and is the only logical way to evaluate the relative attractiveness of investments and businesses.",
      context: "Discussing how to evaluate business value despite the inherent imprecision",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Economic Reality vs. Accounting",
      insight: "The most common cause of faulty thinking in investing is attachment to the idea that a recognized 'significant trend' will continue. It won't - at least not for all the reasons you think. New economic machines will come along, new industries will displace old ones, and economic cataclysms will disrupt many comfortable assumptions.",
      context: "Explaining why extrapolating past performance is a dangerous investment approach",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Acquisitions",
      insight: "In making acquisitions, we have a strong preference for businesses that generate cash in excess of their need for capital. When an acquisition is evaluated, we estimate both what the business will earn and how much capital it will require. If it needs capital investment roughly equal to its earnings just to hold its economic position, the business is a poor fit for us, no matter how attractive its return on invested capital may be.",
      context: "Explaining Berkshire's acquisition criteria and why excess cash generation is crucial",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Owner Earnings",
      insight: "These represent (a) reported earnings plus (b) depreciation, depletion, amortization, and certain other non-cash charges less (c) the average annual amount of capitalized expenditures for plant and equipment, etc. that the business requires to fully maintain its long-term competitive position and its unit volume. Our owner-earnings equation does not yield the deceptively precise figures provided by GAAP, since (c) must be a guess - and one sometimes very difficult to make. Despite this problem, we consider the owner earnings figure, not the GAAP figure, to be the relevant item for valuation purposes.",
      context: "Defining his concept of 'owner earnings' as superior to accounting earnings for valuation",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Principles",
      insight: "Your goal as an investor should simply be to purchase, at a rational price, a part interest in an easily-understandable business whose earnings are virtually certain to be materially higher five, ten and twenty years from now. Over time, you will find only a few companies that meet these standards - so when you see one that qualifies, you should buy a meaningful amount of stock. You must also resist the temptation to stray from your guidelines: If you aren't willing to own a stock for ten years, don't even think about owning it for ten minutes.",
      context: "Summarizing his philosophy on stock selection and long-term investing",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's net worth increased by $6.2 billion during 1996, a 36.1% gain.",
      bookValueGrowth: "Book value increased to $19,011 per share from $14,426, while per-share market value grew to $34,100.",
      netEarnings: "$2.49 billion, up dramatically from $725 million in 1995."
    },
    
    insuranceOperations: {
      description: "Insurance operations had an exceptional year, with GEICO becoming a standout performer in its first full year under Berkshire ownership.",
      underwritingResult: "Insurance underwriting generated a $142.8 million profit, up from $20.5 million in 1995.",
      investmentIncome: "Insurance investment income rose to $726.2 million from $501.6 million in 1995.",
      buffettComment: "GEICO's results exceeded all expectations, with policies-in-force growing by 10% and underwriting profits increasing substantially. Tony Nicely has proved to be an exceptional business leader whose operating and strategic decisions have been virtually flawless."
    },
    
    flightSafetyInternational: {
      description: "FlightSafety had an excellent first year as part of Berkshire.",
      performance: "The company achieved strong growth in both revenues and earnings.",
      buffettComment: "Al Ueltschi continues to lead FlightSafety with extraordinary passion and expertise. The company dominates its industry and maintains an unmatched reputation for safety and quality of training."
    },
    
    seesCandy: {
      description: "See's Candies continued its pattern of delivering strong returns on minimal investment.",
      sales: "$246.5 million, up 9.0% from $226.1 million in 1995.",
      earnings: "$59.4 million pre-tax, up 18.3% from $50.2 million the previous year.",
      buffettComment: "Chuck Huggins' record at See's continues to dazzle us. Since we purchased See's in 1972, Chuck has increased profits from $4 million pre-tax to more than $59 million in 1996, while employing only minor amounts of additional capital."
    },
    
    rjreynoldsTobacco: {
      description: "Sold entire position in RJR Nabisco.",
      performance: "The investment generated reasonable but not spectacular returns.",
      buffettComment: "Though we sold for a decent profit, our investment in RJR would have looked brilliant had we immediately sold all of our other common equities and put the money into RJR. But who knows which industries or stocks will do best in the future? That's the beauty of the stock market: No matter how high the general level, there are always a few individual bargains to be found."
    }
  },
  
  notableInvestments: [
    {
      company: "Walt Disney Company",
      industryCategory: "Media/Entertainment",
      investmentChange: "Berkshire exchanged its Capital Cities/ABC shares for Disney stock when Disney acquired Cap Cities.",
      ownershipStake: "Approximately 3% of Disney",
      buffettComment: "We now have $1.7 billion invested in Disney, whose dominant entertainment businesses create a moat too wide for even the strongest competitors to cross. Disney's theme parks and worldwide video rights to the company's past and future library of animated films give it a position in the entertainment business unmatched by any other company."
    },
    {
      company: "American Express",
      industryCategory: "Financial Services",
      ownership: "Approximately 10.5% of the company",
      performance: "American Express continued to improve under CEO Harvey Golub.",
      buffettComment: "Harvey Golub's leadership at American Express has been outstanding, and the company's transformation is gaining momentum. The American Express card continues to be a powerful franchise, and the company's travel business leads its industry."
    },
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      ownership: "Approximately 8% of the company",
      performance: "Coca-Cola continued to expand its global market share and earnings.",
      buffettComment: "No company could be better positioned than Coca-Cola to capitalize on the growth of consumer markets worldwide. Roberto Goizueta had a remarkable record of achievement during his leadership of this outstanding company."
    },
    {
      company: "Gillette",
      industryCategory: "Consumer Products",
      ownership: "Approximately 9% of the company",
      performance: "Gillette continued to strengthen its competitive position in razors, blades, and toiletries.",
      buffettComment: "Gillette continues to expand its global reach and dominance in shaving products. With strong positions in batteries (Duracell), toiletries, and stationery products (Paper Mate, Parker, Waterman), the company exemplifies the kind of business we love to own: powerful global brands, high returns on capital, and excellent management."
    }
  ],
  
  economicContext: "1996 saw continued economic expansion in the United States, with low inflation and unemployment. The stock market continued its strong performance, with the Dow Jones Industrial Average crossing the 6,000 mark for the first time. Corporate profits were robust across many sectors.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the importance of focusing on intrinsic value despite its inherently subjective nature, while highlighting the exceptional performance of GEICO and other Berkshire subsidiaries.",
    acquisitionCriteria: "Explained Berkshire's strong preference for businesses that generate cash in excess of their capital needs.",
    marketOutlook: "Expressed concern about high overall market valuations while maintaining confidence in Berkshire's major holdings."
  },
  
  keyMetrics: {
    bookValue: "$19,011 per share, up 31.8% from 1995",
    netEarnings: "$2.49 billion in 1996 vs. $725 million in 1995",
    seesCandy: {
      sales: "$246.5 million in 1996 vs. $226.1 million in 1995",
      earnings: "$59.4 million pre-tax in 1996 vs. $50.2 million in 1995"
    }
  },
  
  investmentLessons: [
    "The importance of focusing on intrinsic value despite its inherent subjectivity",
    "The dangers of extrapolating past performance into the future",
    "The critical importance of excess cash generation in acquisition targets",
    "The concept of owner earnings as superior to GAAP earnings for valuation purposes",
    "The value of purchasing easily-understandable businesses with long-term growth potential at reasonable prices"
  ]
};

// Make available globally
window.buffettLetter1996 = buffettLetter1996;
