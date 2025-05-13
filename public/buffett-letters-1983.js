/**
 * Warren Buffett's 1983 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1983.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1983 letter to shareholders.
 */

const buffettLetter1983 = {
  year: 1983,
  
  keyInsights: [
    {
      topic: "Economic Goodwill",
      insight: "Businesses logically are worth far more than net tangible assets when they can be expected to produce earnings on such assets considerably in excess of market rates of return. The capitalized value of this excess return is economic Goodwill.",
      context: "Explaining the concept of economic goodwill as the premium above tangible assets that a business can command",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Competitive Advantages",
      insight: "The primary factor determining a business's ability to generate high returns on assets is the strength of its 'franchise'. Strong franchise businesses can charge more for their products, raise prices when necessary, and require relatively small investments to maintain their market positions.",
      context: "Discussing why some businesses can consistently earn high returns on capital",
      relevantCompanies: ["BRK.A", "KO", "WPO"]
    },
    {
      topic: "Consistent Operations",
      insight: "Experience indicates that the best business returns are usually achieved by companies that are doing something quite similar today to what they were doing five or ten years ago. That is no argument for managerial complacency. Businesses always have opportunities to improve service, product lines, manufacturing techniques, and the like, and these opportunities usually should be pursued.",
      context: "Explaining why businesses with consistent operations often outperform those pursuing rapid change",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Capital-Intensive Businesses",
      insight: "A business that increases its earnings by 15% annually and pays out 40% of those earnings as dividends, would provide you with a compounded annual dividend growth rate of 15%. But that would be true only if the company originally earned, and could continue to earn, a good return on equity capital.",
      context: "Discussing the importance of return on equity for long-term investment success",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Approach",
      insight: "Our approach to stock selection is to identify businesses we consider exceptional, run by people whom we trust, priced at levels that make business sense. This investment strategy makes sense to us, but may not be applicable to everyone. We have a clear thought pattern that works for us, but may not work for you.",
      context: "Summarizing Berkshire's investment philosophy",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $37.9 million in 1983 from $31.5 million in 1982.",
      bookValueGrowth: "Book value increased 29.0% during 1983 to $973.93 per share from $737.43."
    },
    
    insuranceOperations: {
      description: "Insurance operations showed improved results.",
      underwritingResult: "Underwriting losses were reduced to $9.2 million from $11.3 million in 1982.",
      investmentIncome: "Investment income increased to $43.8 million from $31.4 million in 1982."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart continued its exceptional performance.",
      sales: "$98.4 million, up from $88.3 million in 1982.",
      buffettComment: "NFM's business continues to grow in both sales volume and profits, and we expect that growth to continue. NFM is by far the largest home furnishings store in the country with the largest sales of any single store in the country."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$111.9 million, up from $106.7 million in 1982.",
      earnings: "$15.0 million pre-tax, up from $13.7 million the previous year.",
      buffettComment: "These results reflect the continued excellent management of Chuck Huggins. Despite a modest physical volume increase of only 1.7%, See's pre-tax profits improved 9.3% to slightly over $15 million."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News had its first full year of profitable operations.",
      performance: "The News reported an excellent year with both circulation and advertising showing good increases.",
      outlook: "The News should continue to improve financially, but major gains from this point will be difficult."
    }
  },
  
  notableInvestments: [
    {
      company: "Washington Post Company",
      industryCategory: "Media",
      ownership: "13% ownership stake",
      performance: "The Washington Post Company continued to build intrinsic business value at an exceptional rate.",
      buffettComment: "We are lucky to be associated with Kay Graham and Dick Simmons, both extraordinary managers who combine talent and integrity in a way that maximizes the interests of shareholders."
    },
    {
      company: "GEICO",
      industryCategory: "Insurance",
      ownership: "Significant minority stake, approximately 35%",
      performance: "GEICO continued its excellent performance under Jack Byrne's leadership.",
      buffettComment: "GEICO's underwriting performance continues to excel in a difficult industry environment."
    },
    {
      company: "Blue Chip Stamps",
      industryCategory: "Retail/Trading Stamps",
      ownershipChange: "Increased ownership to 60.7% from 60.6% in 1982",
      buffettComment: "Our interest in Blue Chip continues to increase by small increments."
    }
  ],
  
  acquisitions: [
    {
      company: "Blue Chip Stamps",
      details: "Berkshire announced a merger agreement with Blue Chip, which would be completed in 1983.",
      rationale: "The merger will simplify our corporate structure and increase Berkshire's ownership of several outstanding businesses that we already, in effect, control through BCS."
    }
  ],
  
  economicContext: "1983 saw a strong economic recovery begin following the deep recession of 1981-82. Inflation declined significantly, and the stock market rose sharply, with the Dow Jones Industrial Average gaining over 20% for the year.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the concept of economic goodwill and the value of businesses with strong competitive advantages or 'franchises.'",
    acquisitionStrategy: "Continued focus on acquiring businesses with consistent operations and strong financial performance.",
    shareRepurchases: "Discussed the value of share repurchases when a company's stock is trading below intrinsic value."
  },
  
  keyMetrics: {
    bookValue: "$973.93 per share, up 29.0% from 1982",
    operatingEarnings: "$37.9 million in 1983 vs. $31.5 million in 1982",
    seesCandy: {
      sales: "$111.9 million in 1983 vs. $106.7 million in 1982",
      earnings: "$15.0 million pre-tax in 1983 vs. $13.7 million in 1982"
    },
    nebraskaFurnitureMart: {
      sales: "$98.4 million in 1983 vs. $88.3 million in 1982"
    }
  },
  
  investmentLessons: [
    "The importance of economic goodwill as a component of business value",
    "The value of businesses with strong competitive advantages or 'franchises'",
    "The superiority of consistent operations over frequent business transformations",
    "The critical importance of return on equity for long-term investment success",
    "The advantage of businesses that can raise prices to offset inflation without requiring significant additional capital"
  ]
};

// Make available globally
window.buffettLetter1983 = buffettLetter1983;
