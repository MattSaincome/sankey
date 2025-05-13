/**
 * Warren Buffett's 2005 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/2005.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 2005 letter to shareholders.
 */

const buffettLetter2005 = {
  year: 2005,
  
  keyInsights: [
    {
      topic: "Pension Accounting",
      insight: "The actuarial assumptions that companies use in calculating pension-fund assets and liabilities are their own responsibility. And many managements have chosen assumptions that are wildly optimistic. I've been told that some CEOs are unaware of what pension returns they've signed up for. These people might be surprised by what they learn—and so, some day, might their shareholders. Companies with lush pension assumptions may be living in a fool's paradise. The cost is usually hidden, but the check is in the mail.",
      context: "Warning about unrealistic pension fund assumptions that hide future problems",
      relevantCompanies: ["BRK.A", "GM", "F"]
    },
    {
      topic: "Catastrophe Insurance",
      insight: "We and the rest of the industry included in our premium rates the possibility of a mega-catastrophe, and here it was. The surprise was not the occurrence, but rather the strength of Katrina and the confluence of other difficult conditions. We're certain to have another big hurricane someday, but we have no idea when. Prudence demands that we take a long-term view and build our catastrophe business based on sound rates, not simply a desire to write more business. At Berkshire, we would rather miss a good opportunity than engage in improper pricing.",
      context: "Discussing Hurricane Katrina's impact on insurance pricing and Berkshire's disciplined approach",
      relevantCompanies: ["BRK.A", "GRE"]
    },
    {
      topic: "Corporate Giving",
      insight: "When A takes money from B to give to C and A is a corporation, it is B who should make the decision. Even when the corporate charitable gift makes some form of business sense, the philanthropic aspect of it is almost always better handled personally by the individual shareholders. Giving at the corporate level often reflects the CEO's personal predilections or desire for prominence rather than corporate benefit.",
      context: "Explaining Berkshire's unusual approach to corporate philanthropy",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Business Acquisitions",
      insight: "There is far more discipline in today's acquisition market than existed 10-20 years ago, but we still find sellers who don't really want to sell but are tempted, nevertheless, to engage in an auction 'process.' This sort of process usually works well for the seller. But it's poison for us. When we see an opportunity that looks sensible for us, we move quickly and don't play games. If the seller has another objective -- or if we encounter a corporate culture that's not compatible with Berkshire's -- we simply move on.",
      context: "Describing Berkshire's no-nonsense approach to acquisitions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Discipline",
      insight: "I've mentioned that we strongly prefer businesses with increasing earnings. There's an exception, though, when we think a company's competitive advantage is so formidable and enduring that its current earnings can rise substantially over an extended period. Of course, the promise of growth alone is not enough. A promise is only as good as the person or institution making it. When evaluating long-term competitive advantage, we place the greatest weight on demonstrated performance as well as the sustainability of demand for the product or service we're considering.",
      context: "Explaining when Berkshire is willing to invest in businesses without current earnings growth",
      relevantCompanies: ["BRK.A", "KO", "AXP"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's performance in 2005 was solid despite hurricane losses, with gains in non-insurance businesses offsetting insurance challenges.",
      bookValueGrowth: "Book value increased 6.4% during 2005 to $59,377 per share from $55,824.",
      operatingEarnings: "$5.6 billion in 2005, down from $7.5 billion in 2004 due primarily to hurricane losses."
    },
    
    insuranceOperations: {
      description: "Insurance operations had a challenging year due to hurricane losses, but maintained underwriting discipline.",
      underwritingResult: "Underwriting loss of $1.07 billion, compared to a profit of $1.55 billion in 2004.",
      hurricaneImpact: "Hurricane losses totaled approximately $3.4 billion pre-tax.",
      investmentIncome: "Investment income increased to $3.48 billion from $3.03 billion in 2004.",
      float: "Insurance float grew to approximately $49.3 billion at year-end 2005 from $46.1 billion at year-end 2004.",
      buffettComment: "We had three major catastrophes in 2005 – Hurricanes Katrina, Rita, and Wilma – that caused Berkshire to record the largest insurance loss in its history. Despite this, we estimate our cost of float for the year at 3.4%, a result that, under the circumstances, I consider satisfactory. GEICO achieved excellent growth while delivering an underwriting profit for the 8th consecutive year."
    },
    
    geico: {
      description: "GEICO continued its strong growth despite challenging conditions.",
      policyGrowth: "Voluntary auto policies grew by 9.9% in 2005.",
      marketShare: "About 8.5% of the personal auto insurance market, up from 7.8% in 2004.",
      buffettComment: "GEICO's performance continues to exceed all expectations. Under Tony Nicely's leadership, the company has more than tripled its market share since 1996 while maintaining underwriting profitability. Tony has built a business that combines low costs, high customer satisfaction, and enormous growth potential."
    },
    
    midAmericanEnergy: {
      description: "MidAmerican Energy continued to perform well and completed the PacifiCorp acquisition.",
      performance: "The company generated $889 million in net income, up 70% from $523 million in 2004.",
      pacifiCorpAcquisition: "Completed the $5.1 billion acquisition of PacifiCorp in March.",
      buffettComment: "Dave Sokol and Greg Abel have done a masterful job in growing MidAmerican's energy businesses. We now serve 3 million electric customers and 3.3 million natural gas customers in the U.S. and U.K., and our energy pipeline business transports approximately 16% of all natural gas consumed in the United States."
    },
    
    businessAcquisitions: {
      description: "Made several bolt-on acquisitions and invested in new businesses.",
      russellAcquisition: "Shaw Industries acquired Russell carpet manufacturing operations.",
      medicalProtectiveAcquisition: "Acquired Medical Protective, a leading provider of medical malpractice insurance.",
      buffettComment: "Our managers continued to find attractive bolt-on acquisitions for their existing businesses, while we also added new companies to the Berkshire family. Though the acquisition environment has become more competitive, we continue to find businesses that meet our criteria."
    },
    
    seesCandy: {
      description: "See's Candies continued to deliver solid results with modest growth.",
      sales: "$336 million, up 2.1% from $329 million in 2004.",
      earnings: "$72 million pre-tax, up 7.5% from $67 million in 2004.",
      buffettComment: "See's continues to delight its customers while generating extraordinary returns on invested capital. Brad Kinstler has maintained the traditions of quality and customer service that have made See's a unique business. Despite minimal capital investment requirements, See's consistently increases its earnings year after year."
    }
  },
  
  notableInvestments: [
    {
      company: "PacifiCorp",
      industryCategory: "Utilities",
      acquisitionYear: 2005,
      purchasePrice: "$5.1 billion plus $4.3 billion in assumed debt",
      businessDescription: "Major western utility serving 1.6 million customers in six states",
      metricsAtPurchase: {
        customers: "1.6 million electricity customers",
        generation: "8,700 megawatts of generation capacity",
        serviceArea: "Six western states covering 136,000 square miles"
      },
      buffettComment: "The acquisition of PacifiCorp makes MidAmerican the largest electric utility in terms of customers served in the states it operates, and gives us a significant presence in the western power market. PacifiCorp's operations in Utah, Wyoming, Idaho, Oregon, Washington, and California complement MidAmerican's existing utility footprint."
    },
    {
      company: "Medical Protective",
      industryCategory: "Insurance",
      acquisitionYear: 2005,
      purchasePrice: "Approximately $825 million",
      businessDescription: "Leading provider of malpractice insurance for physicians, dentists, and other healthcare providers",
      metricsAtPurchase: {
        history: "Founded in 1899, making it America's oldest professional liability carrier",
        marketPosition: "Among the top five medical malpractice insurers in the U.S.",
        financial: "A.M. Best 'A++' (Superior) rating"
      },
      buffettComment: "Medical Protective, acquired from GE, brings to Berkshire a 100-year history of specializing in medical professional liability insurance. The company has maintained disciplined underwriting through both hard and soft markets, which fits perfectly with our approach to insurance. Tim Kenesey has done an excellent job leading this business."
    },
    {
      company: "ISCAR Metalworking",
      industryCategory: "Manufacturing/Industrial Tools",
      acquisitionYear: 2005,
      acquisitionStatus: "Agreement in principle reached in 2005, to be completed in 2006",
      purchasePrice: "Approximately $4 billion for 80% of the company",
      businessDescription: "A world-leading manufacturer of precision carbide cutting tools used in metalworking",
      metricsAtPurchase: {
        global: "Operations in over 50 countries",
        marketPosition: "Second largest manufacturer of metal cutting tools in the world",
        technology: "Industry leader in product innovation and precision manufacturing"
      },
      buffettComment: "ISCAR is one of the world's two largest producers of cutting tools, which are used in manufacturing. The company has achieved extraordinary growth while maintaining profit margins that are among the highest in its industry. Eitan Wertheimer and Jacob Harpaz have built a remarkable company with a culture of innovation and cost-consciousness that makes it a perfect fit for Berkshire."
    },
    {
      company: "Anheuser-Busch",
      industryCategory: "Beverages",
      investmentYear: 2005,
      ownership: "Approximately 5.6% of the company",
      businessDescription: "Leading global brewer with dominant U.S. market share",
      buffettComment: "Anheuser-Busch has a dominant market position in the U.S. beer industry, with brands that command premium pricing. The company's distribution network and marketing prowess give it significant competitive advantages that should endure for decades."
    }
  ],
  
  economicContext: "2005 saw continued U.S. economic growth of about 3.5%, despite the devastation of Hurricane Katrina and other natural disasters. The Federal Reserve continued gradually raising interest rates, with the federal funds rate increasing from 2.25% to 4.25% by year-end. The housing boom continued with rapid price appreciation in many markets. Energy prices rose substantially, with oil prices briefly exceeding $70 per barrel following Hurricane Katrina. The U.S. trade deficit widened to a record $716 billion.",
  
  letterHighlights: {
    overallMessage: "Buffett acknowledged the significant impact of hurricane losses on Berkshire's insurance operations while highlighting the strong performance of non-insurance businesses and the continued growth of investment opportunities.",
    hurricaneImpact: "Detailed the financial impact of hurricanes Katrina, Rita, and Wilma, which collectively produced the largest insurance loss in Berkshire's history.",
    acquisitionStrategy: "Emphasized Berkshire's straightforward approach to acquisitions and willingness to walk away from opportunities that don't meet its criteria."
  },
  
  keyMetrics: {
    bookValue: "$59,377 per share, up 6.4% from 2004",
    operatingEarnings: "$5.6 billion in 2005 vs. $7.5 billion in 2004",
    seesCandy: {
      sales: "$336 million in 2005 vs. $329 million in 2004",
      earnings: "$72 million pre-tax in 2005 vs. $67 million in 2004"
    },
    geico: {
      policiesInForce: "9.9% growth in 2005",
      marketShare: "8.5% of the personal auto insurance market"
    }
  },
  
  investmentLessons: [
    "The importance of realistic pension fund assumptions and the dangers of hiding costs through accounting choices",
    "The need for disciplined underwriting in catastrophe insurance, even if it means sacrificing premium volume",
    "The value of moving quickly and decisively when attractive acquisition opportunities arise",
    "The potential issues with corporate charitable giving and why individual shareholder giving is often more appropriate",
    "The circumstances under which a company with currently flat earnings might still be an attractive investment"
  ]
};

// Make available globally
window.buffettLetter2005 = buffettLetter2005;
