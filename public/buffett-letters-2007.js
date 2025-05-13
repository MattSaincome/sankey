/**
 * Warren Buffett's 2007 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/2007.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 2007 letter to shareholders.
 */

const buffettLetter2007 = {
  year: 2007,
  
  keyInsights: [
    {
      topic: "Financial Engineering",
      insight: "Three decades ago, a good bank needed $10 of equity capital for every $100 of assets it owned. Now, many major banks operate with $3 of equity for every $100 of assets – with some investment banks leveraged at 30 to 1. These institutions have become enormous in relation to the overall economy and often employ exotic strategies using derivatives. The parties to these instruments have enormous claims on each other that are poorly disclosed. The system is almost impossible to untangle in troubled times. The Federal Reserve and other regulators are acutely aware of the situation, but their task is as complex as it is necessary.",
      context: "Warning about systemic risks in the financial system shortly before the 2008 crisis",
      relevantCompanies: ["BRK.A", "C", "BAC", "JPM", "GS"]
    },
    {
      topic: "Derivatives Risk",
      insight: "Derivatives are financial weapons of mass destruction. The dangers that they pose now are multiple and include the following: First, there are huge concentrations of risk that may be unrecognized by both participants and regulators. Second, the effects can cascade. When one derivative transaction goes bad, it triggers another. What we don't know is where, how much, who, and what will be affected. A big surprise could well await us at some future date.",
      context: "Reiterating long-standing concerns about derivatives as financial crisis loomed",
      relevantCompanies: ["BRK.A", "AIG", "C", "GS"]
    },
    {
      topic: "Housing Bubble",
      insight: "The housing bubble burst in 2006, though the intoxicating effects of easy money temporarily masked its effects. Financial institutions then took on more leverage, enhancing their returns but also their risks. Much of the real estate that backs the loans they've originated is certainly worth less than its appraisal on the day the check was issued. We will see much more from this disaster, despite the recent palliative measures adopted by the Federal Reserve.",
      context: "Analyzing the housing bubble and predicting continued fallout",
      relevantCompanies: ["BRK.A", "BAC", "C", "WFC"]
    },
    {
      topic: "Insurance Complacency",
      insight: "It's been over two years since we had a loss from a major hurricane or earthquake. If we have a year free of mega-catastrophes, our P/C insurance operations will likely deliver an underwriting profit. A moderate-to-large catastrophe would push us into a small loss, and a mega-catastrophe would cost us a large loss. When the industry has experienced a catastrophe-free period of a few years, a dangerous amount of complacency sets in. It's human nature to assume that what recently occurred is likely to persist.",
      context: "Warning about complacency in catastrophe insurance after several quiet years",
      relevantCompanies: ["BRK.A", "GRE", "TPRE"]
    },
    {
      topic: "Investment Principles",
      insight: "A truly great business must have an enduring 'moat' that protects excellent returns on invested capital. The dynamics of capitalism guarantee that competitors will repeatedly assault any business 'castle' that is earning high returns. Therefore a formidable barrier such as a company's being the low-cost producer or possessing a powerful world-wide brand is essential for sustained success. Business history is filled with 'Roman Candles,' companies whose moats proved illusory and were soon crossed.",
      context: "Reiterating the importance of sustainable competitive advantages",
      relevantCompanies: ["BRK.A", "KO", "AAPL", "GEICO"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's performance in 2007 was solid, though insurance results moderated after the exceptional 2006.",
      bookValueGrowth: "Book value increased 11.0% during 2007 to $78,008 per share from $70,281.",
      operatingEarnings: "$9.5 billion in 2007, down from $11.0 billion in 2006."
    },
    
    insuranceOperations: {
      description: "Insurance operations remained profitable but returned to more normal levels after the extraordinary 2006.",
      underwritingResult: "Underwriting profit of $1.8 billion, down from $3.8 billion in 2006.",
      investmentIncome: "Investment income increased to $4.7 billion from $4.3 billion in 2006.",
      float: "Insurance float grew to approximately $58.7 billion at year-end 2007 from $50.9 billion at year-end 2006.",
      buffettComment: "Our insurance operations continued their stellar performance in 2007, though underwriting results were not as extraordinary as in 2006. Our largest business, however – private passenger auto insurance – had an unusually good year. GEICO's underwriting profit in 2007 amounted to 14.3% of premium volume, a record that is far above its previous high of 10.9%."
    },
    
    geico: {
      description: "GEICO had an exceptional year with record profitability and continued strong growth.",
      policyGrowth: "Voluntary auto policies grew by 9.4% in 2007.",
      marketShare: "About 9.9% of the personal auto insurance market, up from 9.1% in 2006.",
      buffettComment: "GEICO's business continues to flourish. In 2007, its voluntary auto policies in force grew by 9.4%, a particularly meaningful gain because 2006 auto policies had risen by 7.9%. In both 2006 and 2007, we added more policies than did our three largest competitors combined. Tony Nicely continues to work his magic at GEICO, and I think the best is yet to come."
    },
    
    utilityBusinesses: {
      description: "Berkshire's utility operations performed well despite challenging conditions.",
      performance: "MidAmerican earned $1.1 billion in 2007, equal to 2006's result.",
      buffettComment: "In the electric utility industry, MidAmerican has a major advantage because it has maintained a strong balance sheet and a high credit rating. Many utilities, in contrast, have consumed all or most of their earnings and also taken on large amounts of debt in order to satisfy shareholders' desire for dividends. David Sokol and Greg Abel have run our utilities superbly."
    },
    
    manufacturingServiceRetail: {
      description: "Manufacturing, service and retail operations delivered good results overall.",
      earnings: "Pre-tax earnings of $4.3 billion, up from $4.1 billion in 2006.",
      buffettComment: "Our non-insurance operations delivered solid results in 2007, led by exceptional performances at Shaw, Johns Manville, MiTek, and TTI. It's amazing how many of our managers continue to widen the moats around their businesses."
    },
    
    marmonGroup: {
      description: "Agreed to acquire a 60% interest in Marmon Holdings, with plans to acquire 100% over time.",
      acquisition: "Paid $4.5 billion for the initial 60% stake in this diversified manufacturing business.",
      buffettComment: "Marmon provides an excellent addition to the Berkshire family of businesses. The company has more than 125 manufacturing and service businesses with operations in 20 countries and about $7 billion in revenue. Frank Ptak has done a superb job of managing this diverse collection of businesses."
    },
    
    seesCandy: {
      description: "See's Candies continued to deliver excellent results with modest growth.",
      sales: "$410 million, up 7.0% from $383 million in 2006.",
      earnings: "$84 million pre-tax, up 2.4% from $82 million in 2006.",
      buffettComment: "See's remains one of our oldest and most cherished businesses. The company achieved record sales and profits in 2007, its 36th year under Berkshire ownership. Brad Kinstler has maintained See's uncompromising focus on product quality and customer service, which makes the brand a California institution."
    }
  },
  
  notableInvestments: [
    {
      company: "Marmon Holdings",
      industryCategory: "Manufacturing/Industrial",
      acquisitionYear: 2007,
      purchasePrice: "$4.5 billion for 60% of the company, with agreement to acquire the remaining 40% over the next 5-6 years",
      businessDescription: "Diversified collection of more than 125 manufacturing and service businesses across 20 countries",
      metricsAtPurchase: {
        annualRevenues: "Approximately $7 billion",
        businesses: "More than 125 individual operations",
        businessSegments: "Wire and Cable, Transportation Equipment, Highway Technologies, Building Products, Water Treatment, Industrial Products, and Distribution Services"
      },
      buffettComment: "Marmon is a perfect fit for Berkshire. The company has been under the Pritzker family's enlightened ownership for over 50 years, and has earned exceptional returns on capital while growing substantially. We will acquire 100% of the business by 2014, with the price of each future purchase determined by a formula based upon earnings."
    },
    {
      company: "Equitas",
      industryCategory: "Insurance/Reinsurance",
      transactionYear: 2007,
      transactionDescription: "Completed the acquisition of Equitas, the run-off vehicle for Lloyd's pre-1993 liabilities, providing reinsurance coverage of up to $13.5 billion",
      businessDescription: "Entity established to reinsure and run off all liabilities under Lloyd's policies written before 1993",
      buffettComment: "Our acquisition of Equitas brings closure to a problem that has hung over Lloyd's for many years. The liabilities we've assumed were written as far back as the 1930s, but I'm confident that our insurance team, led by Ajit Jain, has secured appropriate compensation for the risks involved."
    },
    {
      company: "TXU Corp Bonds",
      industryCategory: "Utilities/Energy",
      investmentYear: 2007,
      investmentSize: "$2.1 billion in bonds",
      buffettComment: "During the year we bought $2.1 billion of TXU bonds that we believed were substantially undervalued. Although we've since sold about 40% of our holdings, the prices we received were four times what we paid only months earlier. Sometimes the market offers extraordinary values, and we try to be ready when those opportunities arise."
    },
    {
      company: "Burlington Northern Santa Fe",
      industryCategory: "Railroads",
      investmentYear: 2007,
      ownership: "Increased stake to 18.9% of the company",
      investment: "Total investment of approximately $4.7 billion",
      buffettComment: "BNSF continued to be our largest equity investment. The company has a strong competitive position and excellent management led by Matt Rose. Railroads have major cost and environmental advantages over trucking, which should benefit the industry for decades to come."
    }
  ],
  
  economicContext: "2007 was a year of transition in the U.S. economy, with the housing market continuing to deteriorate and the first signs of serious stress appearing in financial markets. The subprime mortgage crisis emerged in mid-2007, leading to the collapse of several mortgage lenders and hedge funds. Credit markets began to seize up in August, prompting the Federal Reserve to begin cutting interest rates in September. Despite these warning signs, the broader economy remained relatively stable through most of the year, with the S&P 500 gaining 5.5%.",
  
  letterHighlights: {
    overallMessage: "Buffett expressed satisfaction with Berkshire's solid operational performance while sounding increasingly urgent warnings about systemic risks in the financial system.",
    financialWarnings: "Provided prescient analysis of leverage in the banking system, derivatives risks, and the bursting housing bubble just months before the full-blown financial crisis.",
    marmonAcquisition: "Highlighted the acquisition of a 60% stake in Marmon Holdings as a significant addition to Berkshire's family of businesses."
  },
  
  keyMetrics: {
    bookValue: "$78,008 per share, up 11.0% from 2006",
    operatingEarnings: "$9.5 billion in 2007 vs. $11.0 billion in 2006",
    seesCandy: {
      sales: "$410 million in 2007 vs. $383 million in 2006",
      earnings: "$84 million pre-tax in 2007 vs. $82 million in 2006"
    },
    geico: {
      policiesInForce: "9.4% growth in 2007",
      marketShare: "9.9% of the personal auto insurance market"
    }
  },
  
  investmentLessons: [
    "The dangers of excessive leverage in the financial system and the systemic risks posed by complex derivatives",
    "The importance of recognizing and responding to asset bubbles, such as the housing bubble that began to burst in 2006",
    "The value of maintaining financial strength and discipline during periods of market excess",
    "The risk of complacency in catastrophe insurance after extended periods without major events",
    "The enduring importance of sustainable competitive advantages or 'moats' in business success"
  ]
};

// Make available globally
window.buffettLetter2007 = buffettLetter2007;
