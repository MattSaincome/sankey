/**
 * Warren Buffett's 2004 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/2004.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 2004 letter to shareholders.
 */

const buffettLetter2004 = {
  year: 2004,
  
  keyInsights: [
    {
      topic: "Economic Moats",
      insight: "Long-term competitive advantage in a stable industry is what we seek in a business. If that comes with rapid organic growth, great. But even without organic growth, such a business is rewarding. We will simply take the lush earnings of the business and use them to buy similar businesses elsewhere. There's no rule that you have to reinvest your 'earnings' in the same industry, just as there's no rule that stipulates you need to invest in one with similar economics.",
      context: "Explaining Berkshire's acquisition philosophy and the value of businesses with sustainable competitive advantages",
      relevantCompanies: ["BRK.A", "KO", "AXP", "GEICO"]
    },
    {
      topic: "Trade Deficit",
      insight: "A country that consistently imports more than it exports will inevitably find its currency weakening over time. America has been running a persistent trade deficit for decades, and it's intensifying. During 2004, our trade deficit hit a staggering $618 billion - more than 5% of GDP. As a consequence, we are transferring ownership of our assets to the rest of the world at an alarming rate. The consequences of this are unpredictable, but far from benign.",
      context: "Discussing the long-term implications of America's growing trade deficit",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Float",
      insight: "At Berkshire, we have now operated at an underwriting profit for two years in a row, and during that period our float has cost us less than nothing. In aggregate, our float has delivered terrific results for us in most years, and it has never given us a big problem. So, we will continue to aim for an underwriting profit, though we realize it's not possible in every year. Our long-term goal is to generate underwriting profits while our float grows.",
      context: "Explaining Berkshire's insurance strategy of profitable underwriting combined with float growth",
      relevantCompanies: ["BRK.A", "GEICO"]
    },
    {
      topic: "Liquidity Preference",
      insight: "Investors should remember that their scorecard is not computed using Olympic-diving methods: Degree-of-difficulty doesn't count. If you are right about a business whose value is largely dependent on a single key factor that is both easy to understand and enduring, the payoff is the same as if you had correctly analyzed an investment alternative characterized by many constantly shifting and complex variables. We prefer the former approach, but will look at any analytically sound investment.",
      context: "Advising investors to focus on businesses they can understand rather than complex investments",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Board Effectiveness",
      insight: "True independence - meaning the willingness to challenge a forceful CEO when something is wrong or foolish - is an enormously valuable trait in a director. It is also rare. The place to look for it is among high-grade people whose interests are in line with those of shareholders. Independence should be measured by a director's willingness to challenge management when needed, even when this would mean dismissing a friend, resigning a fees, or re-examining a long-standing position.",
      context: "Discussing the qualities of an effective board of directors",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's performance in 2004 was strong, with gains in most business segments.",
      bookValueGrowth: "Book value increased 10.5% during 2004 to $55,824 per share from $50,498.",
      operatingEarnings: "$7.5 billion in 2004, up from $5.4 billion in 2003."
    },
    
    insuranceOperations: {
      description: "Insurance operations had another excellent year with strong underwriting profits and growth in float.",
      underwritingResult: "Underwriting profit of $1.55 billion, down slightly from $1.72 billion in 2003 but still exceptional.",
      investmentIncome: "Investment income increased to $3.03 billion from $2.92 billion in 2003.",
      float: "Insurance float grew to approximately $46.1 billion at year-end 2004 from $44.2 billion at year-end 2003.",
      buffettComment: "Our insurance operations again delivered outstanding results in 2004, with the second highest underwriting profit in our history. For the third consecutive year, GEICO led the way with triple-digit underwriting profits. A key feature of our insurance performance is the low cost of our float, which is money that doesn't belong to us but that we temporarily control."
    },
    
    geico: {
      description: "GEICO continued its outstanding performance with strong growth and profitability.",
      policyGrowth: "Voluntary auto policies grew by 9.7% in 2004.",
      marketShare: "About 7.8% of the personal auto insurance market, up from 7.2% in 2003.",
      buffettComment: "GEICO's performance continues to be nothing short of phenomenal. Under Tony Nicely's leadership, the company has grown its market share from 2.5% in 1996 to 7.8% at yearend 2004. GEICO's combination of low costs and high customer satisfaction is a formula for sustained growth and profitability."
    },
    
    midAmericanEnergy: {
      description: "MidAmerican Energy continued to perform well and expanded its operations.",
      performance: "The company generated $523 million in net income, up 26% from $416 million in 2003.",
      naturalGasExpansion: "Added significant natural gas pipeline capacity through acquisitions and internal expansion.",
      buffettComment: "Dave Sokol and Greg Abel have done a remarkable job in building MidAmerican's energy businesses through both acquisition and internal growth. MidAmerican now serves 6.6 million electricity and natural gas customers, making it a major player in the U.S. energy market."
    },
    
    businessWire: {
      description: "Acquired Business Wire, a leading distributor of corporate news releases.",
      acquisition: "Paid approximately $500 million.",
      buffettComment: "Business Wire's CEO, Cathy Baron Tamraz, has built an extraordinary franchise that is the gold standard in its industry. The company's dominance in corporate news distribution makes it a perfect fit for Berkshire."
    },
    
    seesCandy: {
      description: "See's Candies continued to deliver solid results despite challenging conditions.",
      sales: "$329 million, up slightly from $326 million in 2003.",
      earnings: "$67 million pre-tax, up 13.6% from $59 million in 2003.",
      buffettComment: "See's continues to produce extraordinary results, setting new records for sales and profits in 2004. Since our purchase in 1972, this remarkable business has generated more than $1.1 billion in pre-tax earnings while requiring only minimal additional capital. Brad Kinstler is building on the legacy of excellence established by Chuck Huggins."
    }
  },
  
  notableInvestments: [
    {
      company: "Business Wire",
      industryCategory: "Media/Information Services",
      acquisitionYear: 2004,
      purchasePrice: "Approximately $500 million",
      businessDescription: "Leading global distributor of corporate news releases and regulatory filings",
      metricsAtPurchase: {
        marketPosition: "Industry leader in corporate news distribution",
        clients: "More than 25,000 companies worldwide",
        distribution: "Global reach with offices throughout North America, Europe, and Asia"
      },
      buffettComment: "Business Wire is the premier company in its field, transmitting full-text news releases from companies and organizations worldwide to news media, financial markets, and disclosure systems. Cathy Baron Tamraz, who has spent 25 years with the company, has done a superb job of building and managing this outstanding franchise."
    },
    {
      company: "Forest River",
      industryCategory: "Recreational Vehicles",
      acquisitionYear: 2004,
      purchasePrice: "Not disclosed",
      businessDescription: "Leading manufacturer of recreational vehicles, cargo trailers, and buses",
      metricsAtPurchase: {
        annualRevenues: "Approximately $1.6 billion",
        facilities: "75 production plants in multiple states",
        productLines: "Over 100 different models of RVs, trailers, and buses"
      },
      buffettComment: "Pete Liegl has built Forest River from a startup into the industry leader in just 8 years. The company's growth has been entirely organic, not from acquisitions, illustrating Pete's exceptional business acumen. Forest River exemplifies the kind of business we love to own: well-managed, profitable, and with excellent growth prospects."
    },
    {
      company: "Marmon Group",
      industryCategory: "Manufacturing",
      investmentYear: 2004,
      ownership: "Initial minority investment",
      businessDescription: "Diverse collection of manufacturing and service businesses, including wire and cable, transportation services, retail store fixtures, and industrial products",
      buffettComment: "The Marmon Group, built by the brilliant Pritzker family over many decades, is a collection of outstanding businesses with strong market positions and excellent management. Our initial investment will likely lead to a larger stake in future years."
    },
    {
      company: "PacifiCorp",
      industryCategory: "Utilities",
      acquisitionYear: 2004,
      acquisitionStatus: "Announced agreement to acquire from Scottish Power for $5.1 billion plus $4.3 billion in assumed debt, to be completed in 2005",
      businessDescription: "Major western utility serving 1.6 million customers in six states",
      buffettComment: "The pending acquisition of PacifiCorp represents a major expansion of our utility operations. MidAmerican is making this acquisition and will use its expertise to enhance PacifiCorp's electrical service to communities in the western United States."
    }
  ],
  
  economicContext: "2004 saw continued U.S. economic growth, with real GDP growing at about 3.6%. The Federal Reserve began raising interest rates gradually, with the federal funds rate increasing from 1% to 2.25% by year-end. The U.S. dollar weakened further against major currencies, falling about 7% against the euro. The trade deficit continued to widen, reaching a record $618 billion for the year. The housing market remained robust, with home prices continuing to rise rapidly in many areas.",
  
  letterHighlights: {
    overallMessage: "Buffett expressed satisfaction with Berkshire's strong operational performance while reiterating concerns about the growing U.S. trade deficit and its potential long-term consequences.",
    insuranceSuccess: "Highlighted the extraordinary results of Berkshire's insurance operations, particularly GEICO's continued growth and profitability.",
    acquisitionStrategy: "Emphasized Berkshire's focus on acquiring businesses with sustainable competitive advantages in stable industries, regardless of growth rates."
  },
  
  keyMetrics: {
    bookValue: "$55,824 per share, up 10.5% from 2003",
    operatingEarnings: "$7.5 billion in 2004 vs. $5.4 billion in 2003",
    seesCandy: {
      sales: "$329 million in 2004 vs. $326 million in 2003",
      earnings: "$67 million pre-tax in 2004 vs. $59 million in 2003"
    },
    geico: {
      policiesInForce: "9.7% growth in 2004",
      marketShare: "7.8% of the personal auto insurance market"
    }
  },
  
  investmentLessons: [
    "The value of businesses with long-term competitive advantages in stable industries, even those with limited organic growth",
    "The potential consequences of persistent trade deficits on currency values and national economic health",
    "The importance of generating underwriting profits in insurance operations while growing float",
    "The benefits of focusing on simple, understandable businesses rather than complex investments",
    "The critical role of truly independent directors who are willing to challenge management when necessary"
  ]
};

// Make available globally
window.buffettLetter2004 = buffettLetter2004;
