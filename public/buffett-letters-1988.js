/**
 * Warren Buffett's 1988 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1988.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1988 letter to shareholders.
 */

const buffettLetter1988 = {
  year: 1988,
  
  keyInsights: [
    {
      topic: "Wonderful Businesses",
      insight: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price. Charlie understood this early; I was a slow learner. But now, when buying companies or common stocks, we look for first-class businesses accompanied by first-class managements.",
      context: "Explaining Berkshire's evolution from buying cheap, mediocre businesses to buying high-quality businesses at reasonable prices",
      relevantCompanies: ["BRK.A", "KO"]
    },
    {
      topic: "The Coca-Cola Investment",
      insight: "We expect to hold these securities for a long time. In fact, when we own portions of outstanding businesses with outstanding managements, our favorite holding period is forever. We are just the opposite of those who hurry to sell and book profits when companies perform well but who tenaciously hang on to businesses that disappoint.",
      context: "Discussing Berkshire's major new investment in Coca-Cola",
      relevantCompanies: ["BRK.A", "KO"]
    },
    {
      topic: "Business vs. Stock",
      insight: "In our approach to acquisitions, we first calculate the amount Berkshire might lose if results fall far short of our expectations. If we can limit that loss to an acceptable level, we focus on the upside, which usually is a multiple of our downside exposure.",
      context: "Explaining Berkshire's risk assessment process for acquisitions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Bad News First",
      insight: "A manager who always promises to 'make the numbers' will at some point be tempted to make up the numbers. Charlie and I tell Berkshire managers to run their businesses as if these are the only businesses that they and their families will own over the next century. Therefore, we tell our managers we want the business to be run for the long-term welfare of all stakeholders.",
      context: "Discussing Berkshire's management philosophy",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Float",
      insight: "The value of our float is one reason Berkshire has outperformed other businesses in building net worth. When Berkshire's growth in net worth exceeds its growth in book value, the inexpensive use of borrowed money as float is the most important reason. Our acquisition of GEICO will increase float substantially and is likely to be a significant aid in our future rate of progress.",
      context: "Explaining the critical role of insurance float in Berkshire's success",
      relevantCompanies: ["BRK.A", "GEICO"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $187.8 million in 1988 from $136.7 million in 1987.",
      bookValueGrowth: "Book value increased 20.1% during 1988 to $2,974.52 per share from $2,477.88."
    },
    
    insuranceOperations: {
      description: "Insurance operations had improved results, with higher underwriting profit and investment income.",
      underwritingResult: "Underwriting profit of $18.6 million versus a loss in the previous year.",
      investmentIncome: "Investment income increased to $231.4 million from $152.1 million in 1987.",
      superCatBusiness: "Super-catastrophe reinsurance business continued to generate substantial float with limited risk."
    },
    
    stockMarketPerformance: {
      description: "The stock market recovery from the 1987 crash increased the market value of Berkshire's investments.",
      buffettComment: "We neither buy nor sell securities based on what other investors or commentators think. Instead, we form our own opinions about the intrinsic value of businesses."
    },
    
    scottFetzer: {
      description: "Scott & Fetzer continued its excellent performance.",
      earnings: "$41.5 million after-tax, up from $39.3 million in 1987.",
      returnOnEquity: "A return of about 24% on beginning equity capital.",
      buffettComment: "Ralph Schey continues to rationalize operations and focus on businesses where returns on invested capital are highest."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$197.0 million, up from $162.2 million in 1987.",
      earnings: "$32.0 million pre-tax, up from $28.2 million the previous year.",
      buffettComment: "See's business continues to be exceptional, a fact making us very thankful to Chuck Huggins, who has run the business since our purchase in 1972."
    },
    
    fechheimer: {
      description: "Fechheimer continued to perform well.",
      return: "About 20% after-tax on beginning equity capital.",
      buffettComment: "The Heldman brothers continue to run this business exceptionally well, combining excellent financial performance with high standards of product quality and service."
    }
  },
  
  notableInvestments: [
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      ownership: "6.3% of the company acquired during 1988",
      investmentAmount: "Approximately $592 million invested for 14.2 million shares at an average price of about $42 per share",
      metricsAtPurchase: {
        marketCap: "Approximately $14.8 billion",
        earningsPerShare: "$1.38 (1988)",
        dividendYield: "About 3%",
        peRatio: "Approximately 30x"
      },
      buffettComment: "We expect to hold these securities for a long time. In fact, when we own portions of outstanding businesses with outstanding managements, our favorite holding period is forever. Coca-Cola is in this category - a business we wouldn't sell even if it took a long time for the stock market to recognize its intrinsic value.",
      investmentThesis: "Coca-Cola possesses an unassailable competitive position due to its powerful global brand, worldwide distribution network, and exceptional economics. The business requires minimal capital investment to grow and has the ability to raise prices over time without losing market share."
    },
    {
      company: "Borsheim's",
      industryCategory: "Jewelry Retail",
      acquisitionYear: 1988,
      purchaseDetails: "Acquired 80% of Borsheim's, a single-location jewelry retailer in Omaha",
      buffettComment: "Borsheim's is the largest independent jewelry store in the country, with sales more than three times those of Tiffany's main store in New York. The Friedman family has built a remarkable business based on exceptional value and service. We are delighted to have the family continue to operate the business, with Ike Friedman as Chairman and his son, Alan, as President."
    },
    {
      company: "Capital Cities/ABC",
      industryCategory: "Media",
      ownership: "Approximately 18% interest",
      performance: "Capital Cities/ABC continued its excellent performance under Tom Murphy and Dan Burke.",
      buffettComment: "Operating efficiencies continue to be pursued and achieved by Capital Cities with no sacrifice in quality of product. The company's dedication to this principle has been a hallmark of the Murphy-Burke management style for decades."
    }
  ],
  
  economicContext: "1988 saw continued economic growth in the United States, with the economy recovering fully from the shock of the 1987 stock market crash. Inflation remained under control, and the stock market showed strong gains for the year.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized his evolution as an investor from buying cheap, mediocre businesses to buying high-quality businesses at reasonable prices.",
    cocaCola: "Detailed Berkshire's significant new investment in Coca-Cola, explaining the exceptional economics of the business.",
    managementPhilosophy: "Discussed Berkshire's approach to managing its subsidiaries with a focus on long-term welfare rather than short-term numbers."
  },
  
  keyMetrics: {
    bookValue: "$2,974.52 per share, up 20.1% from 1987",
    operatingEarnings: "$187.8 million in 1988 vs. $136.7 million in 1987",
    scottFetzer: {
      earnings: "$41.5 million after-tax in 1988 vs. $39.3 million in 1987",
      returnOnEquity: "Approximately 24%"
    },
    seesCandy: {
      sales: "$197.0 million in 1988 vs. $162.2 million in 1987",
      earnings: "$32.0 million pre-tax in 1988 vs. $28.2 million in 1987"
    }
  },
  
  investmentLessons: [
    "The superiority of buying wonderful businesses at fair prices rather than fair businesses at wonderful prices",
    "The importance of a long-term holding period for investments in exceptional businesses",
    "The value of management integrity and capability in both operating businesses and investment targets",
    "The critical role of insurance float in Berkshire's investment strategy",
    "The advantage of businesses with strong competitive positions and high returns on capital"
  ]
};

// Make available globally
window.buffettLetter1988 = buffettLetter1988;
