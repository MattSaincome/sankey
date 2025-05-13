/**
 * Warren Buffett's 1989 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1989.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1989 letter to shareholders.
 */

const buffettLetter1989 = {
  year: 1989,
  
  keyInsights: [
    {
      topic: "Time Value of Businesses",
      insight: "It's far better to buy a wonderful business at a fair price than a fair business at a wonderful price. Time is the friend of the wonderful business, the enemy of the mediocre.",
      context: "Explaining why high-quality businesses increase in value over time",
      relevantCompanies: ["BRK.A", "KO"]
    },
    {
      topic: "Junk Bonds",
      insight: "The most vulnerable of junk bonds may be those issued in the early stages of the boom. These were sold by the investment banks to corporations with shaky credit, in part because no others wanted to borrow and in part because the promoters' money was made on the upfront fees, not on the eventual repayment of bondholders.",
      context: "Discussing Berkshire's selective investments in junk bonds",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Intrinsic Value",
      insight: "Intrinsic value can be defined simply: It is the discounted value of the cash that can be taken out of a business during its remaining life. The calculation of intrinsic value, though, is not so simple... The formula for valuing all assets that are purchased for financial gain has been unchanged since it was first laid out by a very smart man in about 600 B.C. (though he wasn't smart enough to know it was 600 B.C.).",
      context: "Explaining the concept of intrinsic value and its calculation",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Management vs. Business",
      insight: "When a management with a reputation for brilliance tackles a business with a reputation for bad economics, it is the reputation of the business that remains intact.",
      context: "Discussing the limitations of management skill in overcoming poor business economics",
      relevantCompanies: ["BRK.A", "USAir"]
    },
    {
      topic: "Insurance Fundamentals",
      insight: "Insurers offer standardized policies which can be copied by anyone. Their only products are promises. It is impossible to tell how good these promises are until years later. The buyer of insurance receives not even a piece of paper - he receives only a promise to pay. In the meantime, the insurer can decide to change prices tomorrow. This keeps many insurers locked in unfortunate price wars that can wound all participants.",
      context: "Explaining the unique dynamics of the insurance business",
      relevantCompanies: ["BRK.A", "GEICO"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $243.6 million in 1989 from $187.8 million in 1988.",
      bookValueGrowth: "Book value increased 44.4% during 1989 to $4,296.01 per share from $2,974.52."
    },
    
    insuranceOperations: {
      description: "Insurance operations had mixed results, with a strong investment portfolio but underwriting challenges.",
      underwritingResult: "Underwriting loss of $24.4 million versus a profit of $18.6 million in 1988.",
      investmentIncome: "Investment income increased to $243.3 million from $231.4 million in 1988.",
      superCatBusiness: "Super-catastrophe business continued to generate significant premium income with limited exposure."
    },
    
    cocaCola: {
      description: "Berkshire continued to increase its stake in Coca-Cola.",
      ownership: "Increased ownership to 6.3% of the company by year-end 1989.",
      buffettComment: "We expect to maintain our equity interest in Coca-Cola for a very long time. In fact, when we own portions of outstanding businesses with outstanding managements, our favorite holding period is forever."
    },
    
    scottFetzer: {
      description: "Scott & Fetzer continued its excellent performance.",
      earnings: "$50.2 million after-tax, up from $41.5 million in 1988.",
      returnOnEquity: "A return of about 28.8% on beginning equity capital.",
      buffettComment: "Ralph Schey continues to wring extraordinary returns from what seemed at the time of our purchase to be ordinary businesses. What really counts is whether he can continue to wring above-average returns from ordinary businesses. Rest assured that this can be done only by extraordinary managers."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$200.0 million, up from $197.0 million in 1988.",
      earnings: "$34.8 million pre-tax, up from $32.0 million the previous year.",
      buffettComment: "See's performance since we purchased it in 1972 far exceeds our expectations. Chuck Huggins has continued to build the company's strong competitive position while generating extraordinary financial returns."
    },
    
    borsheims: {
      description: "Borsheim's had an excellent year in its first full year under Berkshire ownership.",
      performance: "Sales and profits both substantially exceeded expectations.",
      buffettComment: "The Friedman family has created an extraordinary business, based on offering exceptional value and service to customers. Susan Jacques, at age 30, took over as CEO following Ike Friedman's death in 1991 and has done a magnificent job."
    }
  ],
  
  notableInvestments: [
    {
      company: "H.H. Brown Shoe Company",
      industryCategory: "Footwear Manufacturing",
      acquisitionYear: 1989,
      purchasePrice: "Approximately $53 million for 100% of the company",
      businessDescription: "Manufacturer and distributor of work shoes, boots, and other footwear, with annual sales of about $185 million",
      metricsAtPurchase: {
        sales: "Approximately $185 million",
        netWorth: "About $31.5 million",
        returnOnEquity: "Historically over 20%"
      },
      buffettComment: "We bought H. H. Brown from a group of owner-managers, led by Frank Rooney. The price we paid was about 1.6 times book value and a bit over 10 times earnings. Based on our analysis, we expected after-tax returns from Brown to average at least 15% on the capital invested."
    },
    {
      company: "USAir",
      industryCategory: "Airline",
      investmentYear: 1989,
      investment: "$358 million for preferred stock with a 9.25% dividend yield, convertible into USAir common stock at $60 per share",
      buffettComment: "Our purchases of USAir Preferred helped the company buy a new airplane fleet. Ed Colodny, CEO of USAir, had a reputation as an extraordinary manager. The investment, like our commitments to Gillette and Champion, fits our criteria: We understand the business, we like the people we've joined with, the price was fair, and we're in for the long term."
    },
    {
      company: "Champion International",
      industryCategory: "Paper/Forest Products",
      investmentYear: 1989,
      investment: "$300 million for preferred stock with a 9.25% dividend yield, convertible into Champion common stock",
      buffettComment: "We like the paper industry. It's a business with commodity-like economics, but Champion has advantages that should allow it to earn decent returns on capital over time."
    },
    {
      company: "RJR Nabisco",
      industryCategory: "Food/Tobacco",
      investmentYear: 1989,
      investment: "Purchased junk bonds issued in the leveraged buyout of RJR Nabisco",
      buffettComment: "We purchased RJR debt securities during the leveraged buyout battle. We felt the credit was sound and that there was a reasonable chance for capital appreciation."
    }
  ],
  
  economicContext: "1989 saw continued economic growth in the United States, though there were signs that the long expansion might be slowing. The junk bond market, which had boomed during the 1980s, began to show significant stress by the end of the year.",
  
  letterHighlights: {
    overallMessage: "Buffett discussed the dangers of high debt and high valuation levels in the economy, while emphasizing the importance of focusing on businesses with sustainable competitive advantages.",
    preferredInvestments: "Explained Berkshire's significant investments in preferred stocks of USAir and Champion International, as well as selected junk bonds.",
    lookThrough: "Introduced the concept of 'look-through earnings' to better understand Berkshire's economic performance."
  },
  
  keyMetrics: {
    bookValue: "$4,296.01 per share, up 44.4% from 1988",
    operatingEarnings: "$243.6 million in 1989 vs. $187.8 million in 1988",
    scottFetzer: {
      earnings: "$50.2 million after-tax in 1989 vs. $41.5 million in 1988",
      returnOnEquity: "28.8%"
    },
    seesCandy: {
      sales: "$200.0 million in 1989 vs. $197.0 million in 1988",
      earnings: "$34.8 million pre-tax in 1989 vs. $32.0 million in 1988"
    }
  },
  
  lookThroughEarnings: {
    concept: "Buffett introduced the concept of 'look-through earnings' to better reflect Berkshire's economic performance.",
    explanation: "Look-through earnings consist of: (1) the operating earnings reported in the year, plus; (2) the retained operating earnings of major investees that, under GAAP accounting, are not reflected in Berkshire's profits, less; (3) an allowance for the tax that would be paid by Berkshire if these retained earnings of investees had instead been distributed to Berkshire."
  },
  
  investmentLessons: [
    "The time value advantage of high-quality businesses over mediocre businesses",
    "The risks of excessive debt and leverage in corporate America",
    "The concept of look-through earnings as a better measure of economic performance",
    "The selective opportunity in certain junk bonds with favorable risk-reward profiles",
    "The limitations of management skill in overcoming poor business economics"
  ]
};

// Make available globally
window.buffettLetter1989 = buffettLetter1989;
