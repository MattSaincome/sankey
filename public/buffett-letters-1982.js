/**
 * Warren Buffett's 1982 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1982.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1982 letter to shareholders.
 */

const buffettLetter1982 = {
  year: 1982,
  
  keyInsights: [
    {
      topic: "Wonderful Companies vs. Bargains",
      insight: "The time to buy stocks is when they are selling below what they are worth. Some say they shouldn't be bought above book value, but that's nonsense. A company with the ability to earn 20% or 25% on equity can be bought at a significant premium and still make sense.",
      context: "Discussing investment philosophy in the sections on acquisition criteria",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Float",
      insight: "We have been able to develop a business that produces funds with an expected cost below the rate on long-term corporate bonds. That's remarkable. And we get to use these funds to buy businesses, which is even more remarkable.",
      context: "Explaining the value of insurance operations in the Berkshire model",
      relevantCompanies: ["BRK.A", "GEICO"]
    },
    {
      topic: "Capital Allocation",
      insight: "When companies with outstanding businesses and comfortable financial positions find their shares selling far below intrinsic value in the marketplace, no alternative action can benefit shareholders as surely as repurchases.",
      context: "Discussing how companies should allocate capital when their shares are undervalued",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Equity Investments",
      insight: "Stocks are simple. All you do is buy shares in a great business for less than the business is intrinsically worth, with management of the highest integrity and ability. Then you own those shares forever. That's it.",
      context: "Buffett's simplified explanation of his investment approach",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Business Conservatism",
      insight: "Our experience has been that pro-rata portions of truly outstanding businesses sometimes sell in the securities markets at very large discounts from the prices they would command in negotiated transactions involving entire companies. Consequently, bargains in business ownership, which simply are not available directly through corporate acquisition, can be obtained indirectly through stock ownership.",
      context: "Discussing the advantage of buying shares in exceptional businesses versus whole companies",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings declined to $31.5 million in 1982 from $39.7 million in 1981, primarily due to insurance underwriting losses.",
      bookValueGrowth: "Book value increased 32.3% during 1982 to $737.43 per share from $566.93."
    },
    
    insuranceOperations: {
      description: "Insurance underwriting operations had a difficult year.",
      underwritingResult: "An underwriting loss of $11.3 million versus a loss of $1.5 million in 1981.",
      investmentIncome: "Investment income increased to $31.4 million from $24.9 million in 1981."
    },
    
    seesCandy: {
      description: "See's Candies continued its stellar performance.",
      sales: "$106.7 million, up from $96.2 million in 1981.",
      earnings: "$13.7 million pre-tax, up from $13.0 million the previous year.",
      buffettComment: "These results were achieved while our return on invested capital decreased slightly to about 27%. This still exceptional level is a testimonial to the exceptional management of Chuck Huggins."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News turned profitable in 1982.",
      events: "The competitive environment improved as the newspaper's main competitor, the Courier-Express, ceased operations in September 1982.",
      outlook: "Now alone in the field, the News will maximize its profits neither by reducing its product, raising its prices, nor shrinking its news hole."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart had an outstanding year in its first year under Berkshire's ownership.",
      sales: "$88.3 million, up 7.1% from 1981.",
      buffettComment: "Mrs. B and her family have created a business that in several respects is one-of-a-kind in the world. By selling for cash, carrying low inventories, and turning rapidly, NFM is able to operate with minimal investment of capital."
    }
  },
  
  notableInvestments: [
    {
      company: "General Foods",
      industryCategory: "Consumer Products",
      ownershipIncrease: "Continued to add to position",
      investment: "Ownership increased to 1.6 million shares, representing about 3.3% of the company.",
      buffettComment: "We like the business, we like the management, and we like the price at which we made our purchases."
    },
    {
      company: "R.J. Reynolds Industries",
      industryCategory: "Tobacco/Consumer Products",
      acquisition: "New position established in 1982",
      investment: "Purchased 1.4 million shares",
      buffettComment: "This company possesses a valuable consumer franchise and a long history of increasing earnings through thick and thin."
    },
    {
      company: "Blue Chip Stamps",
      industryCategory: "Retail/Trading Stamps",
      ownership: "Increased ownership to 60.6% from 60.0% in 1981",
      buffettComment: "Our interest in Blue Chip continues to grow, and we now have effective ownership of the Wesco Financial Corporation at about 48% (through BCS's 80.1% ownership of Wesco and our 60.6% ownership of BCS)."
    }
  ],
  
  economicContext: "1982 saw the beginnings of the disinflation process as the Federal Reserve's tight monetary policy began to bring inflation under control. The recession that began in 1981 continued, with unemployment reaching a post-World War II high of 10.8% in December 1982.",
  
  letterHighlights: {
    overallMessage: "Buffett continued to refine his investment philosophy, emphasizing the value of high-quality businesses even when purchased at prices above traditional value metrics like book value.",
    acquisitionStrategy: "Discussed Berkshire's preference for 'businesses that generate cash, not those that consume it.'",
    shareholderOrientation: "Emphasized the importance of shareholder-friendly management practices, including prudent share repurchases when stocks are undervalued."
  },
  
  keyMetrics: {
    bookValue: "$737.43 per share, up 32.3% from 1981",
    operatingEarnings: "$31.5 million in 1982 vs. $39.7 million in 1981",
    seesCandy: {
      sales: "$106.7 million in 1982 vs. $96.2 million in 1981",
      earnings: "$13.7 million pre-tax in 1982 vs. $13.0 million in 1981",
      returnOnCapital: "About 27% on invested capital"
    },
    nebraskaFurnitureMart: {
      sales: "$88.3 million in 1982, up 7.1% from 1981",
      inventory: "Only about $6.2 million, an extraordinarily low level for the sales volume"
    }
  },
  
  investmentLessons: [
    "The advantage of buying high-quality businesses even at prices above traditional value metrics",
    "The importance of insurance float as a source of low-cost capital for investment",
    "The value of businesses with minimal capital requirements and high returns on invested capital",
    "The benefit of shareholder-friendly capital allocation, particularly share repurchases when stocks are undervalued",
    "The superiority of buying partial interests in outstanding businesses through the stock market versus acquiring whole companies"
  ]
};

// Make available globally
window.buffettLetter1982 = buffettLetter1982;
