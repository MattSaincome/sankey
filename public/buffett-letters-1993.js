/**
 * Warren Buffett's 1993 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1993.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1993 letter to shareholders.
 */

const buffettLetter1993 = {
  year: 1993,
  
  keyInsights: [
    {
      topic: "Intrinsic Value",
      insight: "Intrinsic value can be defined simply: It is the discounted value of the cash that can be taken out of a business during its remaining life. The calculation of intrinsic value, though, is not so simple... Calculations of intrinsic value, though all-important, are necessarily imprecise and often seriously wrong. The more uncertain the future of a business, the more possibility there is that the calculation will be wildly off-base.",
      context: "Discussing the concept of intrinsic value and its application to investment decisions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Business Analysis",
      insight: "We've done better by avoiding dragons than by slaying them. Over the years, a number of very smart people have learned the hard way that a long string of impressive numbers multiplied by a single zero always equals zero. Most of our large investments at Berkshire have been in businesses about which Charlie and I have felt pretty much the same way: good businesses, but not extraordinary ones.",
      context: "Explaining Berkshire's approach to risk management and business evaluation",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Risk and Uncertainty",
      insight: "Take the case of a business earning $50 million pre-tax with long-term assets of $200 million, return on equity capital of 25%, little long-term debt, growing capacity, and good management. This business might well be worth $500 million or more, and our interest in buying it would be high. But what if a long-term contract setting prices for the business's key product at a level that would produce the $50 million of earnings was due to expire in a few years. In this case, we might decide the business was worth only $250 million, and correspondingly reduce our interest in buying it.",
      context: "Discussing how future uncertainty affects business valuation",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Intelligent Investing",
      insight: "The strategy we've adopted precludes our following standard diversification dogma. Many pundits would therefore say the strategy must be riskier than that employed by more conventional investors. We disagree. We believe that a policy of portfolio concentration may well decrease risk if it raises, as it should, both the intensity with which an investor thinks about a business and the comfort-level he must feel with its economic characteristics before buying into it.",
      context: "Explaining Berkshire's concentrated investment approach",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Value of Insurance Float",
      insight: "Since our float has cost us virtually nothing over the years, it has in effect served as equity. Of course, it is not as good as true equity because there are strings attached to it: we must pay policyholders for their losses when they are incurred. However, the perennial availability of the funds has made them of much greater value to us than their apparent dollar size.",
      context: "Discussing the value of insurance float to Berkshire's operations",
      relevantCompanies: ["BRK.A", "GEICO"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $517.2 million in 1993 from $470.2 million in 1992.",
      bookValueGrowth: "Book value increased 14.3% during 1993 to $8,854.00 per share from $7,745.33."
    },
    
    insuranceOperations: {
      description: "Insurance operations had mixed results, with excellent investment income but reduced underwriting profits.",
      underwritingResult: "Underwriting profit of $30.9 million compared to $59.6 million in 1992.",
      investmentIncome: "Investment income increased to $375.6 million from $355.9 million in 1992.",
      superCatBusiness: "Super-catastrophe business continued to generate substantial premium volume but experienced higher-than-average losses."
    },
    
    seesCandy: {
      description: "See's Candies achieved new records in sales and earnings.",
      sales: "$240.0 million, up 6.6% from $225.1 million in 1992.",
      earnings: "$46.3 million pre-tax, up 9.2% from $42.4 million the previous year.",
      poundageSold: "29.1 million pounds versus 28.0 million in 1992.",
      buffettComment: "Chuck Huggins, CEO of See's since 1972, continues his remarkable record of achieving both high sales growth and exceptional profit margins. The business now operates 198 retail stores in California, Oregon, Washington, and Nevada."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart continued its strong performance.",
      performance: "Sales of $170.7 million, up 7.3% from $159.1 million in 1992, with healthy profit margins.",
      buffettComment: "The Blumkin family continues to operate an extraordinary retail business. Irv Blumkin and Ron Blumkin, along with their mother Mrs. B (who still comes to work every day at age 100), have created a shopping experience that no competitor can match."
    },
    
    dexter: {
      description: "Dexter Shoe Company was acquired in 1993.",
      acquisitionDetails: "Purchased for approximately $433 million in Berkshire stock.",
      performance: "The business generates about $40 million in annual pre-tax earnings on approximately $250 million in sales.",
      buffettComment: "Dexter, under the leadership of Harold Alfond and Peter Lunder, has built an extraordinary business with strong brand recognition, consistent profitability, and high returns on invested capital."
    }
  ],
  
  notableInvestments: [
    {
      company: "Dexter Shoe",
      industryCategory: "Footwear Manufacturing",
      acquisitionYear: 1993,
      purchasePrice: "Approximately $433 million in Berkshire stock (25,203 shares)",
      businessDescription: "A leading manufacturer of high-quality, branded shoes, selling primarily in the U.S.",
      metricsAtPurchase: {
        sales: "Approximately $250 million",
        earnings: "Pre-tax earnings of approximately $40 million",
        returnOnTangibleAssets: "Over 25%"
      },
      buffettComment: "Dexter, led by Harold Alfond and Peter Lunder, has created a business with extraordinary economics and a dominant position in its market niche. Harold and Peter are precisely the type of people with whom we like to be associated. We couldn't be more delighted with this acquisition."
    },
    {
      company: "General Dynamics",
      industryCategory: "Defense",
      investmentOutcome: "Sold the entire position in 1993",
      originalInvestment: "Purchased in 1992 at an average price of $63.90 per share",
      salesPrice: "Sold at an average price of $102.75 per share",
      buffettComment: "General Dynamics instituted a dividend policy and share repurchase program that substantially enhanced the value of our investment. Bill Anders, the company's CEO, did a remarkable job of enhancing shareholder value."
    },
    {
      company: "Coca-Cola",
      industryCategory: "Beverages",
      ownership: "Increased ownership to approximately 7.7% of the company by year-end 1993",
      buffettComment: "Coca-Cola remains our largest holding. The company possesses an extraordinary global business with high returns on capital, minimal capital requirements, and the ability to price its product to offset inflation. Roberto Goizueta and Don Keough have done a magnificent job of building shareholder value."
    },
    {
      company: "Guinness",
      industryCategory: "Beverages",
      currentOwnership: "2% of the company",
      buffettComment: "Guinness possesses extraordinary brand recognition worldwide and earns high returns on capital. The company's management, led by Anthony Tennant, has done an excellent job building long-term value."
    }
  ],
  
  economicContext: "1993 saw moderate economic growth in the United States, with inflation remaining under control. Interest rates declined further, stimulating economic activity. The stock market performed well, with the Dow Jones Industrial Average gaining approximately 14% for the year.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the concept of intrinsic value and the importance of focusing on businesses with sustainable competitive advantages.",
    dexter: "Explained Berkshire's acquisition of Dexter Shoe Company, highlighting the exceptional economics of the business.",
    investmentPhilosophy: "Continued emphasis on portfolio concentration and focus on businesses with predictable economics and strong management."
  },
  
  keyMetrics: {
    bookValue: "$8,854.00 per share, up 14.3% from 1992",
    operatingEarnings: "$517.2 million in 1993 vs. $470.2 million in 1992",
    seesCandy: {
      sales: "$240.0 million in 1993 vs. $225.1 million in 1992",
      earnings: "$46.3 million pre-tax in 1993 vs. $42.4 million in 1992",
      poundageSold: "29.1 million pounds vs. 28.0 million in 1992"
    },
    nebraskaFurnitureMart: {
      sales: "$170.7 million in 1993 vs. $159.1 million in 1992"
    }
  },
  
  investmentLessons: [
    "The concept of intrinsic value as the discounted value of future cash flows",
    "The importance of avoiding businesses with uncertain futures rather than trying to predict outcomes",
    "The advantages of concentrated investing versus broad diversification",
    "The value of insurance float as a source of low-cost capital for investment",
    "The critical importance of management integrity and capability in acquisition decisions"
  ]
};

// Make available globally
window.buffettLetter1993 = buffettLetter1993;
