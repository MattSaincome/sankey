/**
 * Warren Buffett's 1990 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1990.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1990 letter to shareholders.
 */

const buffettLetter1990 = {
  year: 1990,
  
  keyInsights: [
    {
      topic: "Recession Investing",
      insight: "Errors of commission were common for me - and for much larger mistakes than errors of omission, which were mainly failing to buy excellent businesses at modest prices. We have tried occasionally to buy toads at bargain prices with results that have been chronicled in past reports. Clearly our kisses fell flat. We have done well with a couple of princes - but they were princes when purchased. At least our kisses didn't turn them into toads.",
      context: "Discussing investment mistakes during the 1990-1991 recession",
      relevantCompanies: ["BRK.A", "KO", "WFC"]
    },
    {
      topic: "Circle of Competence",
      insight: "I've said many times that when a management with a reputation for brilliance tackles a business with a reputation for bad economics, it is the reputation of the business that remains intact. I just wish I hadn't been so energetic in creating examples. My behavior has matched that admitted by Mae West: 'I was Snow White, but I drifted.'",
      context: "Reflecting on mistakes with USAir and other challenging businesses",
      relevantCompanies: ["BRK.A", "USAir"]
    },
    {
      topic: "Pricing Power",
      insight: "A truly great business must have an enduring 'moat' that protects excellent returns on invested capital. The dynamics of capitalism guarantee that competitors will repeatedly assault any business 'castle' that is earning high returns. Therefore a formidable barrier such as a company's being the low-cost producer or possessing a powerful world-wide brand is essential for sustained success.",
      context: "Explaining what makes businesses like Coca-Cola exceptional investments",
      relevantCompanies: ["BRK.A", "KO", "GEICO"]
    },
    {
      topic: "Look-Through Earnings",
      insight: "We believe that our look-through earnings have grown at a rate of about 20% annually since 1965. Under present accounting rules, a significant part of that growth has been non-reportable, and because of that, the progress made by Berkshire may have been obscured.",
      context: "Discussing how traditional accounting understates Berkshire's economic progress",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investing vs. Speculating",
      insight: "The market, like the Lord, helps those who help themselves. But, unlike the Lord, the market does not forgive those who know not what they do. For the investor, a too-high purchase price for the stock of an excellent company can undo the effects of a subsequent decade of favorable business developments.",
      context: "Explaining the importance of purchase price even for excellent businesses",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings decreased to $203.0 million in 1990 from $243.6 million in 1989, primarily due to insurance underwriting losses and the general economic recession.",
      bookValueGrowth: "Book value increased 7.3% during 1990 to $4,612.06 per share from $4,296.01."
    },
    
    insuranceOperations: {
      description: "Insurance operations had a difficult year, with significant underwriting losses but strong investment income.",
      underwritingResult: "Underwriting loss of $26.7 million compared to a loss of $24.4 million in 1989.",
      investmentIncome: "Investment income increased to $327.5 million from $243.3 million in 1989."
    },
    
    recessionImpact: {
      description: "The recession that began in 1990 negatively affected several of Berkshire's businesses.",
      buffettComment: "In a difficult environment for business generally, our operations overall performed well. We did not do as well as we should have in a few areas, but most of our managers delivered outstanding results. The recession affected our various businesses quite differently: some experienced profits at record levels and others suffered substantial declines."
    },
    
    seesCandy: {
      description: "See's Candies experienced its first volume decline since we purchased the company in 1972.",
      sales: "$206.4 million, up 3.2% from $200.0 million in 1989 despite the volume decline.",
      earnings: "$39.6 million pre-tax, up 13.8% from $34.8 million the previous year.",
      buffettComment: "Despite the volume decrease, earnings were up substantially because of economies instituted by Chuck Huggins, our long-time manager. These moves, plus a moderate price increase, produced a record operating margin of 19.2%."
    },
    
    nebraskafurnituremart: {
      description: "Nebraska Furniture Mart had a record year despite the recession.",
      performance: "Sales exceeded $130 million, generating excellent profits.",
      buffettComment: "The business continues to grow steadily and in 1990 NFM again gained substantial share of market. This amazing store has the largest volume of any home furnishings store in the country, and we believe it can continue to grow substantially."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News faced serious challenges from the economic downturn.",
      performance: "Earnings declined significantly due to a weak Buffalo economy and decreased advertising.",
      outlook: "The News continues to be the dominant paper in Buffalo, but the economic problems of the city will limit the paper's profit potential."
    }
  },
  
  notableInvestments: [
    {
      company: "Wells Fargo",
      industryCategory: "Banking",
      investmentYear: 1990,
      investment: "Purchased 10% of Wells Fargo (approximately 5 million shares) for $289 million, at about $58 per share",
      metricsAtPurchase: {
        marketCap: "Approximately $2.9 billion",
        bookValue: "Approximately $4 billion",
        priceToBookRatio: "About 0.7x",
        returnOnEquity: "Approximately 20% in normal years",
        californiaRealEstateConcerns: "Market concerns about California real estate exposure created buying opportunity"
      },
      buffettComment: "Our purchases of Wells Fargo in 1990 were helped by a chaotic market in bank stocks. The banking business is no favorite of ours. When assets are twenty times equity, mistakes that involve only a small portion of assets can destroy a major portion of equity. And mistakes have been the rule rather than the exception at many major banks. Nevertheless, we believe Wells Fargo is an exceptional banking operation."
    },
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      ownership: "Increased ownership to 7% of the company by year-end 1990",
      buffettComment: "In our opinion, Coca-Cola's business is the kind that Andy Rooney looks for: one with a leading position in its industry and a growing worldwide business that provides a product which is affordable, useful, and enjoyed by people worldwide. Some people regard this product as a luxury; we regard it as a staple."
    },
    {
      company: "USAir",
      industryCategory: "Airline",
      investmentPerformance: "USAir faced significant challenges in 1990 due to high fuel costs and intense competition",
      buffettComment: "The airline industry's economics have deteriorated dramatically since our purchase, and I have been wrong so far about USAir. Though the company has the best reputation for service among major airlines, the economics of the industry have deteriorated so that the strong don't get a satisfactory return on capital. USAir has been hit particularly hard."
    }
  ],
  
  economicContext: "1990 saw the beginning of a recession in the United States, triggered in part by the savings and loan crisis, high oil prices following Iraq's invasion of Kuwait, and the effects of tight monetary policy. The junk bond market collapsed, and many financial institutions faced serious challenges.",
  
  letterHighlights: {
    overallMessage: "Buffett discussed the challenges of investing during a recession while emphasizing the importance of focusing on businesses with sustainable competitive advantages.",
    bankingInvestment: "Explained Berkshire's major new investment in Wells Fargo despite general concerns about the banking industry.",
    economicMoats: "Continued emphasis on the critical importance of sustainable competitive advantages or 'moats' for long-term business success."
  },
  
  keyMetrics: {
    bookValue: "$4,612.06 per share, up 7.3% from 1989",
    operatingEarnings: "$203.0 million in 1990 vs. $243.6 million in 1989",
    seesCandy: {
      sales: "$206.4 million in 1990 vs. $200.0 million in 1989",
      earnings: "$39.6 million pre-tax in 1990 vs. $34.8 million in 1989",
      operatingMargin: "19.2%, a record high"
    }
  },
  
  investmentLessons: [
    "The value of purchasing high-quality businesses at reasonable prices during market downturns",
    "The importance of sustainable competitive advantages for long-term business success",
    "The dangers of investing in businesses with poor economics, even with good management",
    "The concept of look-through earnings as a better measure of economic performance",
    "The difference between investing based on business fundamentals and speculating based on market movements"
  ]
};

// Make available globally
window.buffettLetter1990 = buffettLetter1990;
