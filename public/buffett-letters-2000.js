/**
 * Warren Buffett's 2000 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/2000.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 2000 letter to shareholders.
 */

const buffettLetter2000 = {
  year: 2000,
  
  keyInsights: [
    {
      topic: "Intrinsic Value",
      insight: "Intrinsic value can be defined simply: It is the discounted value of the cash that can be taken out of a business during its remaining life. The calculation of intrinsic value, though, is not so simple. As our definition suggests, intrinsic value is an estimate rather than a precise figure, and it is additionally an estimate that must be changed if interest rates move or forecasts of future cash flows are revised.",
      context: "Discussing how to think about business valuation despite its inherent imprecision",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Market Volatility",
      insight: "The line separating investment and speculation, which is never bright and clear, becomes blurred still further when most market participants have recently enjoyed triumphs. Nothing sedates rationality like large doses of effortless money. After a heady experience of that kind, normally sensible people drift into behavior akin to that of Cinderella at the ball. They know that overstaying the festivities will eventually bring on pumpkins and mice. But they nevertheless hate to miss a single minute of what is one helluva party. Therefore, the giddy participants all plan to leave just seconds before midnight. There's a problem, though: They are dancing in a room in which the clocks have no hands.",
      context: "Warning about the dot-com bubble and market excesses",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Internet Investing",
      insight: "The Internet has been valuably reshaping the economic landscape, but most Internet companies possess business models that are far from proven and that may never become profitable. When we buy a business, we look for durable competitive advantage, management we like and can trust, and a sensible purchase price. Frequently, we can determine whether the business has the first two qualities. But usually, this is not the case with young companies in rapidly changing industries where the market's expectations for growth and future profitability are highly speculative.",
      context: "Explaining Berkshire's cautious approach to Internet companies amid extreme valuations",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Economic Goodwill",
      insight: "Businesses logically are worth far more than net tangible assets when they can be expected to produce earnings on such assets considerably in excess of market rates of return. The capitalized value of this excess return is economic goodwill. In businesses that possess substantial economic goodwill, accounting goodwill amortization charges typically understate true economic costs. That is not the case, however, at companies with little or no economic goodwill.",
      context: "Discussing the concept of economic goodwill and its relation to accounting goodwill",
      relevantCompanies: ["BRK.A", "KO", "GEICO"]
    },
    {
      topic: "Investment Principles",
      insight: "Common stocks, of course, are the most fun. When conditions are right - that is, when companies with outstanding businesses and management sell well below intrinsic value - we become outright buyers. But occasionally successful investing requires inactivity. Sometimes we identify a business we like but only at prices far higher than current market. We wait. Eventually, we may get an opportunity to buy such businesses, on our terms and at our prices, but we may well have to wait a considerable time.",
      context: "Explaining the patience required in value investing and the importance of waiting for the right opportunity",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's performance improved substantially in 2000, with gains in book value and operating earnings.",
      bookValueGrowth: "Book value increased 6.5% during 2000 to $40,442 per share from $37,987.",
      operatingEarnings: "$2.2 billion in 2000, up from $1.56 billion in 1999."
    },
    
    insuranceOperations: {
      description: "Insurance operations rebounded with significantly improved underwriting results.",
      underwritingResult: "Underwriting loss of $219 million, a substantial improvement from the $1.39 billion loss in 1999.",
      investmentIncome: "Investment income decreased to $2.28 billion from $2.82 billion in 1999, reflecting lower interest rates and portfolio adjustments.",
      generalRe: "General Re's results improved significantly, though the company still posted an underwriting loss.",
      buffettComment: "Tony Nicely's GEICO turned in a superb performance, growing voluntary auto policies by 16.9% and achieving excellent underwriting results. Our reinsurance operations also improved substantially, though we have much work to do at General Re."
    },
    
    geico: {
      description: "GEICO had an outstanding year with accelerating growth and strong profitability.",
      policyGrowth: "Voluntary auto policies grew by 16.9% in 2000.",
      marketShare: "About 5.6% of the personal auto insurance market, up from 5.1% in 1999.",
      buffettComment: "GEICO's performance continues to be extraordinary, and Tony Nicely's leadership has made it one of the great business stories of our time. GEICO's cost advantage, combined with the quality of its service and Tony's marketing talents, virtually guarantee the company an ever-increasing market share in the years ahead."
    },
    
    midAmericanEnergy: {
      description: "MidAmerican Energy performed well in its first full year as a Berkshire subsidiary.",
      performance: "The company generated $197 million in net income on $4.7 billion in revenues.",
      buffettComment: "David Sokol and Greg Abel have done an outstanding job running MidAmerican. The company's Iowa utility operation earned record profits, its UK electricity distribution business performed well, and its natural gas pipelines maintained their strong performance. We see this as an operation that can deploy large amounts of capital at attractive returns in the years ahead."
    },
    
    seesCandy: {
      description: "See's Candies had another excellent year with modest volume growth.",
      sales: "$323 million, up 5.6% from $306 million in 1999.",
      earnings: "$75.7 million pre-tax, up 1.6% from $74.5 million in 1999.",
      buffettComment: "See's had record Christmas volume, impressive in light of a slowing economy in California. Chuck Huggins continues to generate exceptional returns on invested capital, which remains only modestly above the $7 million level when we purchased the company in 1972."
    },
    
    carpentersJewelry: {
      description: "Acquired Carpenter's Jewelry, a high-quality retailer based in Alabama.",
      acquisition: "The company was acquired for an undisclosed sum.",
      buffettComment: "Frank Carpenter has built an outstanding jewelry business with a deserved reputation for exceptional quality, service, and value. The business fits perfectly with our acquisition criteria and culture."
    }
  },
  
  notableInvestments: [
    {
      company: "Shaw Industries",
      industryCategory: "Manufacturing/Carpeting",
      acquisitionYear: 2000,
      purchasePrice: "$2.1 billion for 87.3% of the company",
      businessDescription: "World's largest carpet manufacturer with over $4 billion in annual sales",
      metricsAtPurchase: {
        marketShare: "Approximately 31% of U.S. carpet market",
        manufacturingFacilities: "47 plants in 6 states",
        annualProduction: "Over 600 million square yards of carpet annually"
      },
      buffettComment: "Shaw's business is a classic example of a leader in a basic industry with a well-defended market position and superior management. Bob Shaw and Julian Saul have built an extraordinary business with strong growth potential. They're joining our family with substantial stakes in the company, a sign of their confidence in Shaw's future."
    },
    {
      company: "Johns Manville",
      industryCategory: "Building Materials",
      acquisitionYear: 2000,
      purchasePrice: "$1.8 billion",
      businessDescription: "Leading manufacturer of insulation and commercial roofing, with a 142-year history and $2.2 billion in annual sales",
      metricsAtPurchase: {
        marketPosition: "Global leader in fiberglass insulation, commercial roofing, and filtration systems",
        manufacturingFacilities: "46 manufacturing facilities in North America, Europe, and China",
        employees: "Approximately 9,500 worldwide"
      },
      buffettComment: "Johns Manville has superb brands and outstanding management led by Jerry Henry. The company is a market leader in most of its product lines and has a low-cost manufacturing position. We see JM as a company with excellent prospects in an industry with attractive economics."
    },
    {
      company: "CORT Business Services",
      industryCategory: "Furniture Rental",
      acquisitionYear: 2000,
      purchasePrice: "$386 million",
      businessDescription: "Nation's leading provider of rental furniture with 115 showrooms and a presence in the top 80 U.S. markets",
      metricsAtPurchase: {
        showrooms: "115 across the country",
        marketCoverage: "Top 80 U.S. metropolitan areas",
        marketPosition: "Leader in furniture rental industry"
      },
      buffettComment: "Paul Arnold has built CORT into the national leader in its industry, with a reputation for quality, service, and reliability. CORT fits perfectly into the Berkshire model: It's a leader with a sustainable competitive advantage in an industry with favorable economics."
    },
    {
      company: "The Coca-Cola Company",
      industryCategory: "Beverages",
      ownership: "Approximately 8% of the company",
      performance: "The market value of Berkshire's Coca-Cola shares decreased to $10.9 billion from $11.7 billion in 1999.",
      buffettComment: "Though Coca-Cola's stock has disappointed for several years, the company's fundamental competitive position and long-term economics remain outstanding. We expect Coca-Cola to be a significantly better business ten years from now than it is today."
    }
  ],
  
  economicContext: "2000 was a year of transition, with the dot-com bubble beginning to burst in March and the economy showing signs of slowing by year-end. The Federal Reserve continued raising interest rates early in the year, then paused as economic growth moderated. Many Internet companies failed or experienced dramatic stock price declines, while the broader market experienced increased volatility. The NASDAQ index fell 39% for the year, while the S&P 500 declined by 9%.",
  
  letterHighlights: {
    overallMessage: "Buffett expressed satisfaction with Berkshire's substantial improvement in operating earnings and book value, while continuing to warn about market excesses, particularly in technology and Internet stocks.",
    acquisitionStrategy: "Highlighted Berkshire's major acquisitions of Shaw Industries, Johns Manville, and CORT Business Services - all market leaders in their respective industries, but in 'old economy' sectors.",
    marketOutlook: "Expressed continued concern about general market valuations while noting that many traditional businesses had become relatively more attractive as investors focused on technology stocks."
  },
  
  keyMetrics: {
    bookValue: "$40,442 per share, up 6.5% from 1999",
    operatingEarnings: "$2.2 billion in 2000 vs. $1.56 billion in 1999",
    seesCandy: {
      sales: "$323 million in 2000 vs. $306 million in 1999",
      earnings: "$75.7 million pre-tax in 2000 vs. $74.5 million in 1999"
    },
    geico: {
      policiesInForce: "16.9% growth in 2000",
      marketShare: "5.6% of the personal auto insurance market"
    }
  },
  
  investmentLessons: [
    "The importance of understanding intrinsic value as the discounted value of future cash flows despite the inherent imprecision of the calculation",
    "The dangers of market euphoria and the tendency of investors to engage in speculative behavior during bull markets",
    "The risks of investing in businesses with unproven business models, regardless of industry growth expectations",
    "The concept of economic goodwill and its importance in business valuation",
    "The value of patience in investing and the willingness to wait for the right opportunities"
  ]
};

// Make available globally
window.buffettLetter2000 = buffettLetter2000;
