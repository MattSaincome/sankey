/**
 * Warren Buffett's 1984 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1984.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1984 letter to shareholders.
 */

const buffettLetter1984 = {
  year: 1984,
  
  keyInsights: [
    {
      topic: "Business Economics",
      insight: "Severe change and exceptional returns usually don't mix. Most investors, both institutional and individual, will find the best way to own common stocks is through an index fund that charges minimal fees. Those following this path are sure to beat the net results (after fees and expenses) delivered by the great majority of investment professionals.",
      context: "Discussing investment performance expectations and how most active managers underperform",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Competitive Moats",
      insight: "The dynamics of capitalism guarantee that competitors will repeatedly assault any business 'castle' that is earning high returns. Therefore a formidable barrier such as a company's being the low-cost producer or possessing a powerful world-wide brand is essential for sustained success.",
      context: "Introducing the concept of economic moats as essential for long-term business success",
      relevantCompanies: ["BRK.A", "KO", "AXP", "WPO"]
    },
    {
      topic: "Owner Earnings",
      insight: "We suggest that you concentrate on the figure of 'owner earnings.' If our hypothetical business paid no dividends or made no capital expenditures, and simply added its retained earnings to its cash, then owner earnings would equal reported earnings. But, companies almost never operate this way. Instead, they both spend money to maintain their competitive position and frequently use additional cash to strengthen and expand their operations.",
      context: "Explaining the concept of owner earnings as opposed to reported earnings",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Management Quality",
      insight: "When a management with a reputation for brilliance tackles a business with a reputation for poor fundamental economics, it is the reputation of the business that remains intact.",
      context: "Discussing the limitation of management skill in overcoming poor business fundamentals",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Capital Allocation",
      insight: "The most common cause of low prices is pessimism - sometimes pervasive, sometimes specific to a company or industry. We want to do business in such an environment, not because we like pessimism but because we like the prices it produces. It's optimism that is the enemy of the rational buyer.",
      context: "Explaining Berkshire's contrarian investment approach",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $90.7 million in 1984 from $69.5 million in 1983.",
      bookValueGrowth: "Book value increased 13.6% during 1984 to $1,108.77 per share from $973.93."
    },
    
    insuranceOperations: {
      description: "Insurance operations showed substantially improved results.",
      underwritingResult: "Underwriting profit of $13.5 million versus a loss of $9.2 million in 1983.",
      investmentIncome: "Investment income increased to $68.9 million from $43.8 million in 1983."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart continued its exceptional performance.",
      sales: "$115.1 million, up from $98.4 million in 1983.",
      buffettComment: "In its first two years with Berkshire, NFM has achieved pre-tax earnings of about $15 million on an original purchase price of $60 million - and those earnings may well improve. NFM is by far the largest furniture, carpet, appliance and electronics store in the country, with annual sales of about $115 million."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$116.5 million, up from $111.9 million in 1983.",
      earnings: "$17.7 million pre-tax, up from $15.0 million the previous year.",
      buffettComment: "The business continues its excellent record under Chuck Huggins. We now have a significant Easter season as well as Christmas. In 1984, See's made 22 million pounds of candy, up from 18 million in 1983."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News continued its profitable operations.",
      performance: "The News had another excellent year, with both circulation and advertising showing good increases.",
      outlook: "The long-term economics of the newspaper business remain excellent, since newspapers continue to be the primary means of delivering information and advertising to a community."
    }
  ],
  
  notableInvestments: [
    {
      company: "American Express",
      industryCategory: "Financial Services",
      ownership: "New position acquired in 1984",
      investmentContext: "American Express faced challenges related to its insurance subsidiary, Fireman's Fund, which Buffett saw as a temporary problem that didn't affect AmEx's core business",
      buffettComment: "Our favorite holding period is forever. We are willing to look foolish as long as we don't feel we have done anything foolish. In 1964, the company went through the Salad Oil Scandal. In 1984, the company's earnings from its main business took a dive, from Fireman's Fund insurance. But its core business, which is one of the best in the world, wasn't damaged at all."
    },
    {
      company: "Scott & Fetzer",
      industryCategory: "Diversified Manufacturing",
      purchaseAttempt: "Berkshire made an offer to purchase Scott & Fetzer in 1984, but the deal was not completed.",
      buffettComment: "We attempted the acquisition of Scott & Fetzer, a diversified company with several excellent businesses. While our offer was unsuccessful, we remain interested in acquiring businesses with consistent earning power, good returns on equity, little or no debt, simple business models, and honest, capable management."
    },
    {
      company: "Washington Post Company",
      industryCategory: "Media",
      ownership: "13% ownership stake",
      performance: "The Washington Post Company continued to build intrinsic business value at an exceptional rate.",
      buffettComment: "Both the Post and Capital Cities possess extraordinary properties in both the television and newspaper businesses, run by extraordinary managers."
    }
  ],
  
  economicContext: "1984 saw continued economic expansion following the 1981-82 recession. Inflation remained under control, but the Federal budget deficit expanded significantly. The stock market was relatively flat for the year after the strong performance of 1983.",
  
  letterHighlights: {
    overallMessage: "Buffett introduced the concept of economic moats and emphasized the importance of sustainable competitive advantages for long-term business success.",
    ownerEarnings: "Introduced the concept of 'owner earnings' as a more accurate representation of a business's true economic performance than reported earnings.",
    acquisitionStrategy: "Continued focus on acquiring businesses with consistent operations, good returns on equity, and sustainable competitive advantages."
  },
  
  keyMetrics: {
    bookValue: "$1,108.77 per share, up 13.6% from 1983",
    operatingEarnings: "$90.7 million in 1984 vs. $69.5 million in 1983",
    seesCandy: {
      sales: "$116.5 million in 1984 vs. $111.9 million in 1983",
      earnings: "$17.7 million pre-tax in 1984 vs. $15.0 million in 1983",
      productionVolume: "22 million pounds of candy in 1984, up from 18 million in 1983"
    },
    nebraskaFurnitureMart: {
      sales: "$115.1 million in 1984 vs. $98.4 million in 1983",
      earningsSinceAcquisition: "About $15 million pre-tax on original purchase price of $60 million"
    }
  },
  
  investmentLessons: [
    "The critical importance of sustainable competitive advantages or 'moats' for long-term business success",
    "The concept of owner earnings as a more accurate measure of economic performance than reported earnings",
    "The limitations of management skill in overcoming poor business fundamentals",
    "The value of contrarian investing during periods of market pessimism",
    "The superiority of businesses with consistent operations over those requiring frequent transformation"
  ]
};

// Make available globally
window.buffettLetter1984 = buffettLetter1984;
