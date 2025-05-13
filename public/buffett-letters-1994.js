/**
 * Warren Buffett's 1994 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1994.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1994 letter to shareholders.
 */

const buffettLetter1994 = {
  year: 1994,
  
  keyInsights: [
    {
      topic: "Capital Allocation",
      insight: "Intelligent investing is not complex, though that is far from saying that it is easy. What an investor needs is the ability to correctly evaluate selected businesses. Note that word 'selected': You don't have to be an expert on every company, or even many. You only have to be able to evaluate companies within your circle of competence. The size of that circle is not very important; knowing its boundaries, however, is vital.",
      context: "Discussing the importance of staying within one's circle of competence when investing",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Airline Industry Economics",
      insight: "As of yearend, we have begun to feel the effects of USAir's fiscal problems. The company has suspended its dividend on our preferred stock. At yearend, we carried this holding at $358 million, our cost. This valuation reflects both a large unrealized loss and an accrual for unpaid dividends. Regarding the small dividend we were paid last year, most of that looked shakier by the day and was written off in the fourth quarter. The business as a whole has been a disaster for many carriers, with aggregate losses since the advent of deregulation running to many billions, and continuing to rise. The temptation to be in this business is always there because the revenues are so enormous, but the economics mean that for most participants, it's also likely to deliver disaster.",
      context: "Explaining the challenges of the airline industry and Berkshire's investment mistake with USAir",
      relevantCompanies: ["BRK.A", "USAir"]
    },
    {
      topic: "Acquisition Criteria",
      insight: "We are searching for businesses that we can understand, with favorable long-term prospects, operated by honest and competent people, and available at attractive prices. We don't discuss our investment ideas - good, bad, or indifferent - unless legally required to do so, and you should be suspicious of anyone who offers to tell you what we are buying or selling.",
      context: "Explaining Berkshire's acquisition and investment criteria",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Float",
      insight: "Since our insurance operation is our core strength, it is worth talking about in some detail. Our super-cat business was developed from scratch by Ajit Jain, who has contributed to Berkshire's success in a way that goes well beyond the bottom-line numbers. Charlie and I knew nothing about this specialized field until Ajit came along, and we continue to rely totally on his assessment and underwriting of super-cat risks.",
      context: "Discussing the value of Berkshire's insurance operations and Ajit Jain's contributions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Share Repurchases",
      insight: "When companies with outstanding businesses and comfortable financial positions find their shares selling far below intrinsic value in the marketplace, no alternative action can benefit shareholders as surely as repurchases. Buying dollar bills for 60¢ is a good business, whether the bills are wrapped in a stock certificate, real estate, or something else.",
      context: "Discussing the value of share repurchases when stock prices are below intrinsic value",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings decreased to $464.2 million in 1994 from $517.2 million in 1993, primarily due to insurance underwriting losses.",
      bookValueGrowth: "Book value increased 13.9% during 1994 to $10,083.00 per share from $8,854.00."
    },
    
    insuranceOperations: {
      description: "Insurance operations had mixed results, with strong investment income but underwriting losses.",
      underwritingResult: "Underwriting loss of $20.5 million compared to a profit of $30.9 million in 1993.",
      investmentIncome: "Investment income increased to $419.4 million from $375.6 million in 1993.",
      catastropheExposure: "The super-catastrophe business faced elevated risk levels due to significant price competition."
    },
    
    seesCandy: {
      description: "See's Candies achieved new records in sales and earnings.",
      sales: "$244.5 million, up 1.9% from $240.0 million in 1993.",
      earnings: "$48.4 million pre-tax, up 4.5% from $46.3 million the previous year.",
      poundageSold: "29.4 million pounds versus 29.1 million in 1993.",
      buffettComment: "Chuck Huggins continues to set records at See's, delivering exceptional results in a difficult retailing environment. The business continues to provide excellent returns on invested capital with minimal additional investment required for growth."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart continued its strong performance.",
      performance: "Sales of $179.5 million, up 5.2% from $170.7 million in 1993, with strong profit margins.",
      buffettComment: "The Blumkin family operates a retail miracle in Omaha. Mrs. B (Rose Blumkin), our 101-year-old founder, retired in 1994 after 57 years of running the store. Her son, Louie, and grandsons, Irv and Ron, continue to operate the business with extraordinary skill."
    },
    
    helzbergDiamonds: {
      description: "Helzberg Diamonds was acquired in 1994.",
      acquisitionDetails: "Purchased for Berkshire stock (approximately $335 million).",
      businessDescription: "A 134-store jewelry retailer with operations in 23 states.",
      buffettComment: "The Helzberg acquisition came about in a typically Berkshire way. I met Jeff Comment, the company's CEO, when he wrote me expressing enthusiasm about Barnett Helzberg, then the owner of the company. Soon thereafter, I met Barnett, who began to think about selling to Berkshire. We completed the deal in a single, two-hour meeting."
    }
  ],
  
  notableInvestments: [
    {
      company: "Helzberg Diamonds",
      industryCategory: "Jewelry Retail",
      acquisitionYear: 1994,
      purchasePrice: "Approximately $335 million in Berkshire stock",
      businessDescription: "A 134-store jewelry retailer founded in 1915, with operations in 23 states",
      buffettComment: "Barnett Helzberg has succeeded in building a successful nationwide jewelry business, featuring excellent merchandise and outstanding value. Jeff Comment will continue as CEO, bringing his exceptional leadership and merchandising skills to the business."
    },
    {
      company: "USAir",
      industryCategory: "Airline",
      investmentPerformance: "USAir suspended dividends on Berkshire's preferred stock due to financial difficulties",
      valueAdjustment: "Carried at $358 million at year-end, reflecting significant unrealized losses",
      buffettComment: "I've previously described our USAir investment as 'the most expensive seat in the history of American commercial aviation.' My impatience caused me to overlook something I've emphasized for decades: the primacy of economics over excitement. The airline industry's economics are inherently challenging, making it a poor long-term investment in most cases."
    },
    {
      company: "American Express",
      industryCategory: "Financial Services",
      ownership: "Increased ownership to approximately 10.2% of the company",
      buffettComment: "American Express continues to benefit from an exceptional consumer franchise and outstanding leadership under Harvey Golub. The company has made significant progress in improving its operations and competitive position."
    },
    {
      company: "Gannett",
      industryCategory: "Media",
      investment: "New position established in 1994",
      buffettComment: "Gannett is a leader in newspaper publishing with outstanding economics and a strong management team led by John Curley."
    }
  ],
  
  economicContext: "1994 saw moderate economic growth in the United States, with the Federal Reserve raising interest rates several times during the year to prevent inflation. The stock market was essentially flat for the year after several years of strong gains. The competitive environment in many industries intensified, particularly in insurance and retail.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the importance of staying within one's circle of competence and acknowledged mistakes in the USAir investment.",
    helzberg: "Explained Berkshire's acquisition of Helzberg Diamonds, highlighting the importance of management quality and business economics.",
    insuranceCompetition: "Discussed the increasingly competitive environment in the insurance industry and Berkshire's discipline in maintaining underwriting standards."
  },
  
  keyMetrics: {
    bookValue: "$10,083.00 per share, up 13.9% from 1993",
    operatingEarnings: "$464.2 million in 1994 vs. $517.2 million in 1993",
    seesCandy: {
      sales: "$244.5 million in 1994 vs. $240.0 million in 1993",
      earnings: "$48.4 million pre-tax in 1994 vs. $46.3 million in 1993",
      poundageSold: "29.4 million pounds vs. 29.1 million in 1993"
    },
    nebraskaFurnitureMart: {
      sales: "$179.5 million in 1994 vs. $170.7 million in 1993"
    }
  },
  
  investmentLessons: [
    "The importance of staying within one's circle of competence when investing",
    "The dangers of overlooking challenging industry economics even for well-managed companies",
    "The value of share repurchases when stock prices are below intrinsic value",
    "The critical importance of management integrity and capability in acquisition decisions",
    "The advantages of a simple, straightforward approach to business valuation"
  ]
};

// Make available globally
window.buffettLetter1994 = buffettLetter1994;
