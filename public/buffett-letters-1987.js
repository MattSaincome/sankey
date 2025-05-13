/**
 * Warren Buffett's 1987 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1987.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1987 letter to shareholders.
 */

const buffettLetter1987 = {
  year: 1987,
  
  keyInsights: [
    {
      topic: "Mr. Market",
      insight: "We've long felt that the only value of stock forecasters is to make fortune tellers look good. Even now, Charlie and I continue to believe that short-term market forecasts are poison and should be kept locked up in a safe place, away from children and also from grown-ups who behave in the market like children.",
      context: "Discussing market volatility after the October 1987 crash",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Market Crashes",
      insight: "What's required is the perspective supplied by Ben Graham's image of Mr. Market: 'Mr. Market is your servant, not your guide.' Though markets generally reflect valuations quite well, they occasionally do crazy things. Inconsequential and sometimes non-existent changes in business can dramatically affect stock prices.",
      context: "Explaining how to view the 1987 stock market crash",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Permanent Capital Loss",
      insight: "The market may ignore business success for a while, but eventually will confirm it. As Ben Graham said: 'In the short-run, the market is a voting machine - reflecting a voter-registration test that requires only money, not intelligence or emotional stability - but in the long-run, the market is a weighing machine.'",
      context: "Discussing the difference between market volatility and permanent loss of capital",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Float Growth",
      insight: "We have tried to expand our insurance float at a zero or better cost, not because this goal fits neatly into some management consultant's package but because we believe that long-term cost-free (or better than free) float to be an objective that makes sense for Berkshire shareholders.",
      context: "Explaining the value of insurance float as an investment funding source",
      relevantCompanies: ["BRK.A", "GEICO"]
    },
    {
      topic: "Business Fundamentals",
      insight: "In our view, investment students need only two well-taught courses - How to Value a Business, and How to Think About Market Prices... Your goal as an investor should simply be to purchase, at a rational price, a part interest in an easily-understandable business whose earnings are virtually certain to be materially higher five, ten and twenty years from now.",
      context: "Explaining the fundamental approach to investment",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings decreased to $136.7 million in 1987 from $156.7 million in 1986, primarily due to lower insurance underwriting profits.",
      bookValueGrowth: "Book value increased 19.5% during 1987 to $2,477.88 per share from $2,073.06."
    },
    
    insuranceOperations: {
      description: "Insurance operations had lower underwriting profit but increased investment income.",
      underwritingResult: "Underwriting profit of $55.9 million versus $100.2 million in 1986.",
      investmentIncome: "Investment income increased to $152.1 million from $107.1 million in 1986.",
      superCatBusiness: "Super-catastrophe reinsurance business had no major losses during the year despite several industry-wide catastrophic events."
    },
    
    stockMarketCrash: {
      description: "The stock market crash of October 1987 reduced the market value of Berkshire's investments but did not affect the underlying business values.",
      buffettComment: "We have no idea how long the excesses will last, nor do we know what will change the attitudes of the government, lender, and buyer that fuel them. But we do know that the less the prudence with which others conduct their affairs, the greater the prudence with which we must conduct our own."
    },
    
    scottFetzer: {
      description: "Scott & Fetzer continued its excellent performance.",
      earnings: "$39.3 million after-tax, slightly lower than 1986's $40.2 million.",
      returnOnEquity: "A return of 22.7% on beginning equity of $172.6 million.",
      buffettComment: "If we had not made the Scott Fetzer acquisition, both our operating earnings and our book value would be far lower than they are. This is a business with excellent economics and superb management."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$162.2 million, up from $133.5 million in 1986.",
      earnings: "$28.2 million pre-tax, up from $24.4 million the previous year.",
      buffettComment: "The nominal price for See's, $25 million, was insignificant given that its intrinsic value was vastly greater. Charlie and I, however, didn't realize how vastly greater when we bought it. We have been very lucky. See's has provided us with lots of exceedingly low-cost funds that we've used to buy other attractive businesses."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News had a good year but faces long-term industry challenges.",
      performance: "Revenues and profits continued at satisfactory levels.",
      outlook: "Long-term, the economic strength of newspapers continues to erode, with circulation on a per-capita basis declining each year. Berkshire's media businesses face significant challenges from changing technology and consumer habits."
    },
    
    fechheimer: {
      description: "Fechheimer continued to perform well.",
      return: "18.6% after-tax on beginning equity capital, with revenues and profits at record levels.",
      buffettComment: "The Heldman managers are precisely the type we love to work with, and we are delighted with our purchase of Fechheimer."
    }
  },
  
  notableInvestments: [
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      investmentInitiation: "Initial stake purchased in 1987",
      buffettComment: "We expect to hold these securities for a long time. In fact, when we own portions of outstanding businesses with outstanding managements, our favorite holding period is forever. We are just the opposite of those who hurry to sell and book profits when companies perform well but who tenaciously hang on to businesses that disappoint."
    },
    {
      company: "Capital Cities/ABC",
      industryCategory: "Media",
      ownership: "Approximately 18% interest",
      performance: "Capital Cities/ABC continued its excellent performance under Tom Murphy and Dan Burke.",
      buffettComment: "The combination of Capital Cities' and ABC's properties is certain to provide exceptional returns to business owners. This will be true even though network television will gradually lose audience share to cable, VCRs, and other means of delivery."
    },
    {
      company: "Salomon Inc.",
      industryCategory: "Investment Banking",
      investmentYear: 1987,
      investment: "$700 million in convertible preferred stock, representing approximately 12% of Salomon's equity capital",
      buffettComment: "Salomon is the only business we have agreed to buy into without first knowing its price. We've never been in the investment banking business, but we've always been in the business of evaluating managements, and we think this management is outstanding."
    }
  ],
  
  economicContext: "1987 saw continued economic growth, but in October, the stock market experienced its largest one-day percentage decline in history, with the Dow Jones Industrial Average falling 22.6% on October 19, 1987. Despite this 'Black Monday' crash, the economic expansion continued.",
  
  letterHighlights: {
    overallMessage: "Buffett provided extensive commentary on the 1987 stock market crash and reiterated his long-term, business-focused investment philosophy.",
    marketPerspective: "Emphasized that market volatility creates opportunities rather than risks for the long-term investor.",
    acquisitionStrategy: "Continued focus on acquiring businesses with strong economic characteristics and outstanding management."
  },
  
  keyMetrics: {
    bookValue: "$2,477.88 per share, up 19.5% from 1986",
    operatingEarnings: "$136.7 million in 1987 vs. $156.7 million in 1986",
    scottFetzer: {
      earnings: "$39.3 million after-tax in 1987 vs. $40.2 million in 1986",
      returnOnEquity: "22.7% in 1987 vs. 23.3% in 1986"
    },
    seesCandy: {
      sales: "$162.2 million in 1987 vs. $133.5 million in 1986",
      earnings: "$28.2 million pre-tax in 1987 vs. $24.4 million in 1986"
    }
  },
  
  investmentLessons: [
    "The importance of viewing market volatility as an opportunity rather than a risk",
    "The distinction between market prices (voting machine) and intrinsic value (weighing machine)",
    "The value of focusing on business fundamentals rather than short-term market movements",
    "The advantages of investing in businesses with strong economics and capable management",
    "The benefit of taking a long-term perspective and ignoring short-term market forecasts"
  ]
};

// Make available globally
window.buffettLetter1987 = buffettLetter1987;
