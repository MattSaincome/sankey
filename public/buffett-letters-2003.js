/**
 * Warren Buffett's 2003 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/2003.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 2003 letter to shareholders.
 */

const buffettLetter2003 = {
  year: 2003,
  
  keyInsights: [
    {
      topic: "Currency Risk",
      insight: "During 2002 we entered the foreign currency market for the first time in my life, and in 2003 we enlarged our position. I felt then, and still feel, that our trade policies will put unremitting pressure on the dollar for many years to come. As our current-account deficit grows, so will the ownership of U.S. assets by foreign nationals. This force-feeding of American wealth to the rest of the world is now proceeding at the rate of $1.5 billion daily.",
      context: "Explaining Berkshire's first major currency investments amid growing U.S. trade deficits",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Junk Bonds",
      insight: "The profound recent changes in our economy have significantly widened the tolerance for loose monetary policies. People no longer have the job security that was long the norm, and households must now save for retirement. At Berkshire, we've therefore backed away from the junk bond market, in which inflationary effects can be particularly painful for investors. We're not, however, abandoning our investments in high-grade bonds of corporations, which should be more sheltered from inflation than junk bonds.",
      context: "Discussing changes in Berkshire's fixed income strategy due to economic developments",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Managerial Excellence",
      insight: "Our prototype for occupational fervor is the Catholic tailor who used his small savings of many years to finance a pilgrimage to the Vatican. When he returned, his parish held a special meeting to get his first-hand account of the Pope. 'Tell us,' said the eager faithful, 'just what sort of fellow is he?' Our hero wasted no words: 'He's a forty-four medium.' Now that's focus. That's also the way our managers look at their businesses.",
      context: "Illustrating the intense focus of Berkshire's managers on their businesses",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Approach",
      insight: "When Charlie and I read reports, we have no interest in pictures of personnel, plants or products. References to EBITDA make us shudder—does management think the tooth fairy pays for capital expenditures? We're very suspicious of accounting methodology that is vague or unclear, since too often that means management wishes to hide something. And we don't want to read messages that a public relations department or consultant has turned out. Instead, we expect a company's CEO to explain in his or her own words what's happening.",
      context: "Describing Berkshire's approach to evaluating financial reports and management communications",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Charitable Giving",
      insight: "Most corporate contributions simply follow the desires of the CEO (who often wants his donations to be aimed at gaining him respect, admiration, or maybe even a hospital wing) or that of employees (who want the corporation to give to things they wouldn't, or don't, give to on their own). Additionally, gifts to charitable foundations often become bureaucratic, with much of the money going to salaries and overhead, and with the donors' money funding charitable activities only many years after the decision to give is made.",
      context: "Discussing the inefficiencies of corporate charitable giving programs",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's performance improved significantly in 2003, with gains in most business segments and strong investment returns.",
      bookValueGrowth: "Book value increased 21.0% during 2003 to $50,498 per share from $41,727.",
      operatingEarnings: "$5.4 billion in 2003, up from $4.1 billion in 2002."
    },
    
    insuranceOperations: {
      description: "Insurance operations had an excellent year with strong underwriting profits and growth in float.",
      underwritingResult: "Underwriting profit of $1.72 billion, up from $534 million in 2002.",
      investmentIncome: "Investment income increased to $2.92 billion from $3.05 billion in 2002.",
      float: "Insurance float grew to approximately $44.2 billion at year-end 2003 from $41.2 billion at year-end 2002.",
      buffettComment: "In a remarkable year for the insurance industry, our underwriting profit of $1.72 billion before taxes was the largest in our history and perhaps the largest in the history of the insurance industry. General Re continued its turnaround with substantial underwriting profits and GEICO delivered record underwriting results."
    },
    
    geico: {
      description: "GEICO continued its exceptional performance with strong growth and profitability.",
      policyGrowth: "Voluntary auto policies grew by 8.5% in 2003.",
      marketShare: "About 7.2% of the personal auto insurance market, up from 6.7% in 2002.",
      buffettComment: "GEICO's underwriting profit of $452 million was a record, reflecting Tony Nicely's disciplined underwriting and low-cost operational model. GEICO continues to have enormous growth potential, and I hope to see us double our market share to about 14% within a decade."
    },
    
    midAmericanEnergy: {
      description: "MidAmerican had an excellent year and expanded through major acquisitions.",
      performance: "The company generated $416 million in net income.",
      acquisition: "Acquired PacifiCorp, a major western utility, for $5.1 billion.",
      buffettComment: "MidAmerican continues to perform superbly under the leadership of David Sokol and Greg Abel. The company has become a major player in the energy industry with operations in electricity generation, transmission, and distribution, as well as natural gas pipelines and residential real estate brokerage."
    },
    
    claytonHomes: {
      description: "Acquired Clayton Homes, a leading manufactured housing company.",
      acquisitionCost: "$1.7 billion.",
      buffettComment: "Kevin Clayton is a prototype Berkshire manager. His company, founded by his father, Jim, leads the manufactured housing industry with sound practices, excellent products, and fair treatment of customers. Though the industry is currently in a severe slump, Clayton has continued to prosper while many competitors have failed."
    },
    
    seesCandy: {
      description: "See's Candies continued to perform well despite minimal growth.",
      sales: "$326 million, up 2.2% from $319 million in 2002.",
      earnings: "$59 million pre-tax, down 21.8% from $75.4 million in 2002 due to increased costs.",
      buffettComment: "See's faced substantial increases in costs, particularly for butter and chocolate, which pressured margins despite modest price increases. Nevertheless, the business remains an extraordinary performer, having generated more than $1 billion in profits for Berkshire while requiring very little additional capital since our purchase in 1972."
    }
  },
  
  notableInvestments: [
    {
      company: "Clayton Homes",
      industryCategory: "Manufactured Housing",
      acquisitionYear: 2003,
      purchasePrice: "$1.7 billion",
      businessDescription: "Leading manufacturer and retailer of manufactured homes, with additional operations in financing, insurance, and community development",
      metricsAtPurchase: {
        marketShare: "Approximately 12% of manufactured home production",
        distribution: "1,200 retail outlets, including 297 company-owned stores",
        verticalIntegration: "Manufacturing, retailing, financing, and community development"
      },
      buffettComment: "Clayton is the class act of the manufactured housing industry, with sound lending practices that have allowed it to prosper while most of its competitors have fallen by the wayside. Kevin Clayton is an exceptional manager who runs his business with both integrity and passion."
    },
    {
      company: "McLane Company",
      industryCategory: "Distribution",
      acquisitionYear: 2003,
      purchasePrice: "$1.5 billion",
      businessDescription: "Leading wholesale distributor of groceries and non-food items to convenience stores, wholesale clubs, mass merchandisers, quick service restaurants, and more",
      metricsAtPurchase: {
        annualRevenues: "Approximately $23 billion",
        customers: "Over 50,000 customer locations",
        fleetSize: "Over 2,600 tractors and 5,900 trailers"
      },
      buffettComment: "McLane is an extraordinarily efficient business operating on paper-thin margins. Grady Rosier has managed this business flawlessly since 1995, and he has been with the company for 25 years. Grady focuses on the smallest details, and his company employs the most advanced logistics and information technology in the distribution industry."
    },
    {
      company: "PacifiCorp",
      industryCategory: "Utilities",
      acquisitionYear: 2003,
      purchasePrice: "$5.1 billion, acquired by MidAmerican Energy",
      businessDescription: "Major western utility serving 1.5 million customers in six states with 8,600 megawatts of generation capacity",
      metricsAtPurchase: {
        customers: "1.5 million electricity customers",
        generation: "8,600 megawatts of generation capacity",
        service: "Six western states"
      },
      buffettComment: "The acquisition of PacifiCorp by MidAmerican represents a major expansion of our utility operations. The business is capital intensive but has predictable earnings and represents the kind of stable, essential service that makes sense for Berkshire's long-term oriented capital."
    },
    {
      company: "Foreign Currencies",
      industryCategory: "Foreign Exchange",
      investmentYear: 2002-2003,
      investmentSize: "Approximately $12 billion",
      description: "Direct positions in several foreign currencies, representing Berkshire's first significant foray into currency markets",
      buffettComment: "We have entered into foreign currency positions because we believe that large trade and fiscal deficits have made the dollar vulnerable. Our direct currency positions, as well as the foreign earnings of many of our businesses, should benefit if the dollar weakens substantially."
    }
  ],
  
  economicContext: "2003 saw an improving U.S. economy, with real GDP growth accelerating to about 3%. The stock market rebounded strongly from three consecutive down years, with the S&P 500 gaining 28.7%. The Federal Reserve maintained its accommodative stance with the federal funds rate at 1%, the lowest level in four decades. The U.S. dollar weakened significantly against major currencies, while commodity prices began a strong upward trend.",
  
  letterHighlights: {
    overallMessage: "Buffett expressed satisfaction with Berkshire's strong operational performance while highlighting concerns about the U.S. dollar and growing trade deficits.",
    majorAcquisitions: "Detailed Berkshire's major acquisitions of Clayton Homes, McLane Company, and PacifiCorp (through MidAmerican Energy).",
    currencyPositions: "Explained Berkshire's unprecedented move into direct currency positions to hedge against potential dollar weakness."
  },
  
  keyMetrics: {
    bookValue: "$50,498 per share, up 21.0% from 2002",
    operatingEarnings: "$5.4 billion in 2003 vs. $4.1 billion in 2002",
    seesCandy: {
      sales: "$326 million in 2003 vs. $319 million in 2002",
      earnings: "$59 million pre-tax in 2003 vs. $75.4 million in 2002"
    },
    geico: {
      policiesInForce: "8.5% growth in 2003",
      marketShare: "7.2% of the personal auto insurance market"
    }
  },
  
  investmentLessons: [
    "The importance of considering macroeconomic factors, such as trade deficits and currency values, in investment decisions",
    "The value of businesses with strong competitive positions even in troubled industries (Clayton Homes)",
    "The benefits of well-managed, low-margin, high-volume businesses with efficient operations (McLane)",
    "The challenges of maintaining margins when input costs rise significantly and cannot be fully passed on to customers (See's)",
    "The importance of management integrity and focus in business success and acquisition decisions"
  ]
};

// Make available globally
window.buffettLetter2003 = buffettLetter2003;
