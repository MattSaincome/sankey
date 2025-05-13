/**
 * Warren Buffett's 1986 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1986.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1986 letter to shareholders.
 */

const buffettLetter1986 = {
  year: 1986,
  
  keyInsights: [
    {
      topic: "Institutional Imperative",
      insight: "In business school, I was given no hint of the imperative's existence and I did not intuitively understand it when I entered the business world. I thought then that decent, intelligent, and experienced managers would automatically make rational business decisions. But I learned over time that isn't so. Instead, rationality frequently wilts when the institutional imperative comes into play.",
      context: "Introducing the concept of the 'institutional imperative' that causes managers to imitate peers regardless of logic",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Float",
      insight: "Our insurance business has been the superstar of our portfolio in its combination of massive size, satisfactory profitability, and excellent prospects for growth in intrinsic value. The value of our float has been substantially enhanced by our entry into the super-catastrophe reinsurance business at mid-year.",
      context: "Discussing the value of insurance float to Berkshire's operations",
      relevantCompanies: ["BRK.A", "GEICO"]
    },
    {
      topic: "Market Efficiency",
      insight: "I would say that the market is efficient most of the time, about everything. But it's not efficient all of the time about everything. And the times when it's not efficient are what really matter to an active investor. Efficiency doesn't happen because everyone's smart, but because everyone watches everyone else and copies what they do.",
      context: "Discussing the concept of market efficiency and its limitations",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Value vs. Growth Investing",
      insight: "Most analysts feel they must choose between two approaches customarily thought to be in opposition: 'value' and 'growth'. We view that as fuzzy thinking... Growth is always a component in the calculation of value, constituting a variable whose importance can range from negligible to enormous. What investment would be better than a growing savings account if it grew fast enough?",
      context: "Explaining Berkshire's view that the division between 'value' and 'growth' investing is artificial",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Super-Cat Insurance",
      insight: "We are perfectly willing to lose $10 million to $50 million in a single event (and we have the resources to comfortably handle much larger losses). We believe that by writing this coverage we get properly paid for the risk we incur, measured by proper probability math. When that is the case, we want to assume as much risk as we can reasonably handle.",
      context: "Explaining Berkshire's entry into the super-catastrophe reinsurance business",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $156.7 million in 1986 from $125.9 million in 1985.",
      bookValueGrowth: "Book value increased 26.1% during 1986 to $2,073.06 per share from $1,643.71."
    },
    
    insuranceOperations: {
      description: "Insurance operations had an excellent year.",
      underwritingResult: "Underwriting profit of $100.2 million versus $40.0 million in 1985.",
      investmentIncome: "Investment income increased to $107.1 million from $79.7 million in 1985.",
      superCatBusiness: "Mid-year entry into the super-catastrophe reinsurance business, which we expect to be volatile but profitable over time."
    },
    
    scottFetzer: {
      description: "Scott & Fetzer had an outstanding first year under Berkshire ownership.",
      earnings: "$40.2 million net after-tax earnings on $172.6 million of beginning equity, a return of 23.3%.",
      businesses: "Particularly strong performance from World Book encyclopedia and Kirby vacuum cleaners.",
      buffettComment: "We couldn't be more pleased about our acquisition of Scott Fetzer. Ralph Schey has operated with extraordinary autonomy: essentially the only item requiring our specific approval is capital expenditure above a designated threshold. Ralph's operating performance has far exceeded the expectations outlined in our purchase analysis."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$133.5 million, up from $125.0 million in 1985.",
      earnings: "$24.4 million pre-tax, up from $21.3 million the previous year.",
      buffettComment: "See's continues to be superbly run by Chuck Huggins and is an absolutely incredible business. Despite major price increases from the raw materials we use, excellent control of expenses has enabled us to maintain margins."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News improved its performance.",
      performance: "The News had a much improved year, with revenues and operating profit both up substantially from 1985."
    },
    
    fechheimer: {
      description: "Fechheimer had a good year in its first year under Berkshire ownership.",
      performance: "The company achieved a 15.5% return on beginning equity capital, with revenues and profits at record levels.",
      buffettComment: "The Heldman family continues to run things in the same exceptional manner that has marked the business for decades."
    }
  },
  
  notableInvestments: [
    {
      company: "Capital Cities/ABC",
      industryCategory: "Media",
      ownership: "Approximately 18% interest",
      performance: "Capital Cities/ABC had an excellent first year following the merger.",
      buffettComment: "Tom Murphy and Dan Burke are extraordinary managers who have built an outstanding business through a series of unconventional moves. In many ways they are the managers I admire most."
    },
    {
      company: "GEICO",
      industryCategory: "Insurance",
      ownership: "Significant position, approximately 41%",
      performance: "GEICO's performance under Bill Snyder has been exceptional.",
      buffettComment: "GEICO is a magnificent business. The company has a low-cost operation, the world's best group of associates in its business, an extraordinary record of service to policyholders, and enormous growth potential."
    },
    {
      company: "Washington Post Company",
      industryCategory: "Media",
      ownership: "Approximately 13% interest",
      performance: "The Washington Post Company continued to build intrinsic business value at an impressive rate.",
      buffettComment: "Kay Graham's and Dick Simmons' management of the business continues to be superb. Despite major problems in the newspaper industry, the Post has strengthened its position as one of the outstanding newspapers in the United States."
    }
  ],
  
  economicContext: "1986 saw continued economic expansion in the United States, with inflation remaining relatively low. The stock market performed strongly for the third consecutive year, with the Dow Jones Industrial Average gaining over 22% for the year.",
  
  letterHighlights: {
    overallMessage: "Buffett introduced the concept of the 'institutional imperative' that often leads managers to make irrational business decisions, and discussed Berkshire's entry into the super-catastrophe reinsurance business.",
    acquisitionPerformance: "Expressed great satisfaction with the performance of recent acquisitions, particularly Scott & Fetzer.",
    managementEffectiveness: "Continued emphasis on the importance of high-quality, autonomous management in Berkshire's operating businesses."
  },
  
  keyMetrics: {
    bookValue: "$2,073.06 per share, up 26.1% from 1985",
    operatingEarnings: "$156.7 million in 1986 vs. $125.9 million in 1985",
    scottFetzer: {
      earnings: "$40.2 million after-tax",
      beginningEquity: "$172.6 million",
      returnOnEquity: "23.3%"
    },
    seesCandy: {
      sales: "$133.5 million in 1986 vs. $125.0 million in 1985",
      earnings: "$24.4 million pre-tax in 1986 vs. $21.3 million in 1985"
    }
  },
  
  investmentLessons: [
    "The concept of the 'institutional imperative' and its negative influence on management decision-making",
    "The value of insurance float as a source of low-cost capital for investment",
    "The artificial distinction between 'value' and 'growth' investing",
    "The importance of management autonomy in promoting operational excellence",
    "The advantages of businesses with strong competitive positions and high returns on capital"
  ]
};

// Make available globally
window.buffettLetter1986 = buffettLetter1986;
