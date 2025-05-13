/**
 * Warren Buffett's 1992 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1992.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1992 letter to shareholders.
 */

const buffettLetter1992 = {
  year: 1992,
  
  keyInsights: [
    {
      topic: "Corporate Governance",
      insight: "The typical large American company has a compensation committee composed solely of independent directors who have no financial interest in its decisions. Nevertheless, compensation committees are typically torpid at best. Directors follow a Polonius-like script: 'To thine own CEO be true.' We believe a director whose moderate income is heavily dependent on director fees—and who may wish to do 'the big one' before retirement—is not necessarily going to be the most effective in looking after your interests.",
      context: "Discussing the failures of corporate governance at many large companies",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Long-term Investing",
      insight: "Indeed, we are willing to hold a stock indefinitely so long as we expect the business to increase in intrinsic value at a satisfactory rate and management is both able and shareholder-oriented. We remain very happy with the decisions we have made to invest major sums in Coca-Cola, Gillette, GEICO, and Capital Cities/ABC.",
      context: "Explaining Berkshire's long-term approach to equity investments",
      relevantCompanies: ["BRK.A", "KO", "G", "GEICO", "CCB"]
    },
    {
      topic: "Focus Investing",
      insight: "The strategy we've adopted precludes our following standard diversification dogma. Many pundits would therefore say the strategy must be riskier than that employed by more conventional investors. We disagree. We believe that a policy of portfolio concentration may well decrease risk if it raises, as it should, both the intensity with which an investor thinks about a business and the comfort-level he must feel with its economic characteristics before buying into it.",
      context: "Explaining Berkshire's concentrated investment approach",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Economic Moats",
      insight: "A truly great business must have an enduring 'moat' that protects excellent returns on invested capital. Though capitalism's 'creative destruction' is highly beneficial for society, it precludes investment certainty. A moat that must be continuously rebuilt will eventually be no moat at all.",
      context: "Discussing the importance of sustainable competitive advantages",
      relevantCompanies: ["BRK.A", "KO", "G"]
    },
    {
      topic: "Quality of Management",
      insight: "After some other mistakes, I learned to go into business only with people whom I like, trust, and admire. As Charlie says, this criterion has produced decent results in business, if not in matrimony. We've never succeeded in making a good deal with a bad person.",
      context: "Explaining the importance of management integrity in investment and acquisition decisions",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $470.2 million in 1992 from $398.3 million in 1991.",
      bookValueGrowth: "Book value increased 20.3% during 1992 to $7,745.33 per share from $6,437.11."
    },
    
    insuranceOperations: {
      description: "Insurance operations had strong results, with continued underwriting profitability and growing investment income.",
      underwritingResult: "Underwriting profit of $59.6 million compared to $49.7 million in 1991.",
      investmentIncome: "Investment income increased to $355.9 million from $331.4 million in 1991.",
      superCatBusiness: "Super-catastrophe business performed well despite Hurricane Andrew, the largest insured catastrophe in U.S. history."
    },
    
    seesCandy: {
      description: "See's Candies achieved new records in sales and earnings.",
      sales: "$225.1 million, up 5.8% from $212.8 million in 1991.",
      earnings: "$42.4 million pre-tax, up slightly from $42.2 million the previous year.",
      poundageSold: "28.0 million pounds versus 27.1 million in 1991.",
      buffettComment: "See's achieved record sales and earnings per pound in 1992. Chuck Huggins continues his extraordinary performance, and we are grateful for his continued passion for the business. Charlie and I are extremely proud of Chuck's record."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart set new records for sales and earnings.",
      performance: "Sales increased to $159.1 million with strong profit margins.",
      buffettComment: "The Blumkin family continues to create a retailing miracle in Omaha. We couldn't be more delighted with our investment in NFM, nor more pleased with the Blumkin family's management."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News continued to face economic challenges in its market.",
      performance: "Earnings remained flat despite a weak local economy.",
      buffettComment: "Stan Lipsey, our publisher at the News, continues to do a superb job of maintaining the paper's financial strength despite industry headwinds."
    }
  },
  
  notableInvestments: [
    {
      company: "GEICO",
      industryCategory: "Insurance",
      investmentHistory: "Initial investment of $1 million in 1951, followed by additional purchases in the 1970s and 1980s",
      currentOwnership: "Approximately 48% of the company by year-end 1992",
      totalInvestment: "About $45.7 million for the 48% interest",
      currentValue: "Approximately $1.9 billion",
      buffettComment: "GEICO is a magnificent business. The company has a low-cost operation that sells a commodity-like product at premium prices - an extraordinary business model. Tony Nicely, GEICO's CEO, has done a superb job of building this company to its current market position. Our initial purchase of GEICO was made in 1951, right after I got out of Columbia Business School, where I had learned about the company from Ben Graham. It was assigned a value of zero in his class portfolio because of ballooning unpaid claims that threatened insolvency. But Ben knew this was a remarkable business and helped me see that.",
      investmentThesis: "GEICO possessed a sustainable cost advantage in a huge industry, allowing it to offer low prices while earning above-average returns. Its direct-to-consumer model eliminated the agent commission, creating a durable competitive advantage."
    },
    {
      company: "Wells Fargo",
      industryCategory: "Banking",
      ownership: "Approximately 11% of the company",
      performance: "The market recognized the quality of Wells Fargo's franchise, with the stock price increasing substantially during 1992.",
      buffettComment: "Carl Reichardt and Paul Hazen continue to run the best major bank in the United States. Their shareholder orientation, banking skills, and work ethic have combined to make this a wonderful investment."
    },
    {
      company: "American Express",
      industryCategory: "Financial Services",
      ownership: "Approximately 5% of the company",
      buffettComment: "American Express possesses an exceptional consumer franchise. The company's charge card and Travelers Cheque businesses have strong and durable competitive advantages. Harvey Golub took over as CEO in 1993 and has done a remarkable job of turning around the company."
    }
  ],
  
  economicContext: "1992 saw the U.S. economy slowly recovering from the 1990-1991 recession. Interest rates declined significantly, helping to stimulate economic activity. Hurricane Andrew in August 1992 was the costliest natural disaster in U.S. history to that point, causing major disruption in the insurance industry.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the quality of Berkshire's business portfolio and investment holdings, while criticizing prevalent corporate governance practices.",
    focus: "Explained Berkshire's strategy of concentrated investing in businesses with sustainable competitive advantages.",
    hurricaneAndrew: "Discussed the impact of Hurricane Andrew on the insurance industry and Berkshire's conservative approach to super-catastrophe insurance."
  },
  
  keyMetrics: {
    bookValue: "$7,745.33 per share, up 20.3% from 1991",
    operatingEarnings: "$470.2 million in 1992 vs. $398.3 million in 1991",
    seesCandy: {
      sales: "$225.1 million in 1992 vs. $212.8 million in 1991",
      earnings: "$42.4 million pre-tax in 1992 vs. $42.2 million in 1991",
      poundageSold: "28.0 million pounds vs. 27.1 million in 1991"
    },
    nebraskaFurnitureMart: {
      sales: "$159.1 million"
    }
  },
  
  investmentLessons: [
    "The importance of corporate governance and shareholder-oriented management",
    "The advantages of concentrated investing in businesses you understand deeply",
    "The critical importance of sustainable competitive advantages or 'moats'",
    "The value of a long-term perspective when investing in high-quality businesses",
    "The superiority of businesses with high returns on capital and limited capital requirements"
  ]
};

// Make available globally
window.buffettLetter1992 = buffettLetter1992;
