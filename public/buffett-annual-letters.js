/**
 * Berkshire Hathaway Annual Letters - Key Lessons and Insights
 * Source: https://www.berkshirehathaway.com/letters/letters.html
 * 
 * This database contains the key investing principles, business insights,
 * and wisdom extracted from Warren Buffett's annual letters to Berkshire
 * shareholders from the most recent years.
 */

const buffettAnnualLetters = {
  // Most recent 5 years
  recentLetters: {
    // 2022 Annual Letter
    "2022": {
      year: 2022,
      keyInsights: [
        {
          topic: "Investment Philosophy",
          insight: "The investing world is populated by many who have much higher IQs than ours and operate in far more investment-friendly environments. Therefore, Berkshire's competitive advantage has been attitude. We adhere to a couple of rules: 1) Never risk permanent loss of capital and 2) Never risk enough capital to jeopardize Berkshire's well-being.",
          context: "Discussing Berkshire's long-term approach to capital allocation and risk management",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Stock Buybacks",
          insight: "There are three ways that a company can make use of its earnings: 1) Reinvestment in operations, 2) Share repurchases, and 3) Dividends. Repurchases only make sense if the shares are bought at a price below intrinsic value. When that rule is followed, Berkshire's remaining shareholders may benefit because our ownership of every corporate asset has increased without the need for us to commit any capital.",
          context: "Explaining Berkshire's approach to share repurchases",
          relevantCompanies: ["BRK.A", "BRK.B", "AAPL"]
        },
        {
          topic: "Operating Businesses",
          insight: "At Berkshire, our whole goal is to increase the normalized operating earnings of our subsidiaries and to make sensible capital-allocation decisions – whether these involve the repurchase of shares, the purchase of businesses, or the sale of subsidiaries or business operations that have limited opportunities for growth.",
          context: "Explaining Berkshire's focus on operating earnings rather than quarterly EPS",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Market Fluctuations",
          insight: "Charlie and I have endured similar periods before. Eventually, conditions change. Sometimes this takes quite a while but, in the end, good businesses earn good returns.",
          context: "Discussing market volatility and the patience required for long-term investing",
          relevantCompanies: ["BRK.A", "BRK.B"]
        }
      ],
      notableInvestments: ["AAPL", "OXY", "CVX"],
      economicContext: "Post-pandemic recovery with inflation concerns and market volatility"
    },
    
    // 2021 Annual Letter
    "2021": {
      year: 2021,
      keyInsights: [
        {
          topic: "Business Ownership",
          insight: "Our goal in both forms of ownership is to make meaningful investments in businesses with favorable and durable economic characteristics. We also need talented and honest managers to run these businesses. Cultures self-propagate, which means our job is to find managers who have the talent and desire to build long-lasting corporate cultures.",
          context: "Explaining Berkshire's approach to both partial ownership (stocks) and full ownership of businesses",
          relevantCompanies: ["BRK.A", "BRK.B", "AAPL"]
        },
        {
          topic: "Capital Allocation",
          insight: "The challenge for CEOs is capital allocation, determining what to do with retained earnings. Some will focus on efficiently running their existing businesses, others will waste money on egotistical acquisitions, and some will play games hoping to make their per-share earnings look better than they really are.",
          context: "Discussing the importance of management's capital allocation decisions",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Apple Investment",
          insight: "Apple is a different sort of holding. Here, our ownership is a mere 5.55%, up from 5.39% a year earlier. That increase sounds like small potatoes. But consider that each 0.1% of Apple's 2021 earnings amounted to $100 million – that's profit, not sales.",
          context: "Discussing the significant value of Berkshire's Apple investment",
          relevantCompanies: ["AAPL", "BRK.A", "BRK.B"]
        },
        {
          topic: "Insurance Float",
          insight: "The insurance business has provided Berkshire with truly extraordinary economics. Our float – money we hold but don't own – cost us less than nothing and, in fact, has delivered significant underwriting profits. Berkshire's major investment in property/casualty insurance companies has been the most important factor in our business's success.",
          context: "Explaining the value of insurance float in Berkshire's business model",
          relevantCompanies: ["BRK.A", "BRK.B"]
        }
      ],
      notableInvestments: ["AAPL", "BAC", "AXP"],
      economicContext: "COVID-19 recovery, supply chain disruptions, and inflation concerns"
    },
    
    // 2020 Annual Letter
    "2020": {
      year: 2020,
      keyInsights: [
        {
          topic: "Betting Against America",
          insight: "In its brief 232 years of existence, there has been no incubator for unleashing human potential like America. Despite some severe interruptions, our country's economic progress has been breathtaking. Beyond that, we retain our constitutional aspiration of becoming 'a more perfect union.' Progress on that front has been slow, uneven and often discouraging. We have, however, moved forward and will continue to do so.",
          context: "Discussing the long-term optimism about America despite short-term challenges",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Bonds as Investments",
          insight: "Bonds are not the place to be these days. Fixed-income investors worldwide – whether pension funds, insurance companies or retirees – face a bleak future. Some insurers, as well as other bond investors, may try to juice the pathetic returns now available by shifting their purchases to obligations backed by shaky borrowers. Risky loans, however, are not the answer to inadequate interest rates.",
          context: "Warning about the poor prospects for bonds in a low-interest-rate environment",
          relevantCompanies: ["BRK.A", "BRK.B", "US Treasury bonds"]
        },
        {
          topic: "Investment Mistakes",
          insight: "I paid too much for Precision Castparts. No one misled me in any way – I was simply too optimistic about PCC's normalized profit potential. Last year, my miscalculation was laid bare by adverse developments throughout the aerospace industry.",
          context: "Admitting a major acquisition mistake, demonstrating accountability",
          relevantCompanies: ["BRK.A", "BRK.B", "PCC"]
        },
        {
          topic: "The Secret Sauce",
          insight: "Charlie and I are not stock-pickers; we are business-pickers. It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
          context: "Reiterating Berkshire's fundamental investing approach",
          relevantCompanies: ["BRK.A", "BRK.B"]
        }
      ],
      notableInvestments: ["AAPL", "BAC", "KO"],
      economicContext: "COVID-19 pandemic, massive government stimulus, and economic disruption"
    },
    
    // 2019 Annual Letter
    "2019": {
      year: 2019,
      keyInsights: [
        {
          topic: "Focus on Operating Earnings",
          insight: "Charlie and I urge you to focus on operating earnings and to ignore both quarterly and annual gains or losses from investments, whether these are realized or unrealized. Our hope is that the per-share value of Berkshire common stock increases in line with the long-term growth in the per-share intrinsic value of the business.",
          context: "Explaining why Berkshire focuses on operating earnings rather than accounting earnings affected by unrealized gains/losses",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Acquisitions",
          insight: "In the years ahead, we hope to move much of our excess liquidity into businesses that Berkshire will permanently own. The immediate prospects for that, however, are not good: Prices are sky-high for businesses possessing decent long-term prospects.",
          context: "Discussing the challenge of finding attractively-priced acquisition targets",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "American Tailwind",
          insight: "Berkshire's success has been due to my having surrounded myself with associates who have both high intelligence and exemplary character. Some of these men and women were building value at Berkshire before I arrived; others have joined us in subsequent decades. In most cases, they have lived far more productive lives than I, and their contributions to communities have often been exceptional.",
          context: "Crediting Berkshire's success to the quality of its managers and business partners",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Retained Earnings Test",
          insight: "We continue to believe that the retention of earnings by companies with significant growth opportunities and other sensible acquisition plays will be tax-efficient, usually by a lot. But let the facts tell the story. Companies we own such as BNSF and Berkshire Hathaway Energy reinvest more of their earnings in productive operational assets than virtually any other American business. Both are outstanding citizens, making smart investments in response to societal needs.",
          context: "Explaining when retaining earnings rather than paying dividends is appropriate",
          relevantCompanies: ["BRK.A", "BRK.B", "BNSF", "BHE"]
        }
      ],
      notableInvestments: ["AAPL", "BAC", "KO"],
      economicContext: "Strong economic growth, low unemployment, and market highs"
    },
    
    // 2018 Annual Letter
    "2018": {
      year: 2018,
      keyInsights: [
        {
          topic: "Intrinsic Value",
          insight: "Intrinsic value can be defined simply: It is the discounted value of the cash that can be taken out of a business during its remaining life. The calculation of intrinsic value, though, is not so simple. Often, the cash flow pattern will be far from smooth. Instead, a business may consistently shrink, consistently expand, or do some of each during various periods. But no matter the pattern, Charlie and I try to value the net cash that the enterprise will deliver to us, discounted at a proper rate.",
          context: "Explaining Berkshire's approach to calculating intrinsic value",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Non-Insurance Businesses",
          insight: "Our expectation is that earnings from our non-insurance businesses will continue to increase, and we also expect our insurance companies to generate an underwriting profit over time. Another positive is that Berkshire's operating earnings in future years will include whatever is produced by our recent acquisition of Pilot Flying J (PFJ), America's top truckstop operator.",
          context: "Discussing the diverse business holdings in Berkshire's portfolio",
          relevantCompanies: ["BRK.A", "BRK.B", "PFJ"]
        },
        {
          topic: "Investing Expectations",
          insight: "In the years ahead, Berkshire will focus on using our excess cash to buy businesses, in whole or in part. Our goal is to substantially increase the earnings of Berkshire's non-insurance group. We will also continue to look for ways to increase our ownership of companies in which we already have a stake and that we find attractive.",
          context: "Setting expectations for Berkshire's capital allocation in coming years",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Market Forecasts",
          insight: "Forecasts that tell you – precisely – what will happen in the economy, interest rates, or the stock market are worse than useless. The thoughts of even the most intelligent investors on what lies ahead are at least as likely to be wrong as right. Charlie and I never have an opinion on the market because it wouldn't be any good and it might interfere with the opinions we have that are good.",
          context: "Warning against market predictions and timing",
          relevantCompanies: ["BRK.A", "BRK.B"]
        }
      ],
      notableInvestments: ["AAPL", "BAC", "KO"],
      economicContext: "Market volatility, interest rate concerns, and trade tensions"
    }
  },
  
  // Methods to retrieve relevant insights
  getInsightsByYear: function(year) {
    // Return all insights from a specific year
    if (this.recentLetters[year]) {
      return this.recentLetters[year].keyInsights;
    }
    return [];
  },
  
  getInsightsByTopic: function(topic) {
    // Find insights across all years related to a specific topic
    let results = [];
    
    for (const year in this.recentLetters) {
      const yearData = this.recentLetters[year];
      const matchingInsights = yearData.keyInsights.filter(insight => 
        insight.topic.toLowerCase().includes(topic.toLowerCase()) ||
        insight.insight.toLowerCase().includes(topic.toLowerCase())
      );
      
      if (matchingInsights.length > 0) {
        results = results.concat(matchingInsights.map(insight => {
          return {
            year: yearData.year,
            ...insight
          };
        }));
      }
    }
    
    return results;
  },
  
  getInsightsByCompany: function(ticker) {
    // Find insights that mention a specific company
    let results = [];
    
    for (const year in this.recentLetters) {
      const yearData = this.recentLetters[year];
      
      // Check notable investments
      if (yearData.notableInvestments && yearData.notableInvestments.includes(ticker)) {
        const relevantInsights = yearData.keyInsights.filter(insight => 
          insight.relevantCompanies && insight.relevantCompanies.includes(ticker)
        );
        
        if (relevantInsights.length > 0) {
          results = results.concat(relevantInsights.map(insight => {
            return {
              year: yearData.year,
              ...insight
            };
          }));
        }
      }
    }
    
    return results;
  },
  
  getRandomInsight: function() {
    // Get a random insight from any year
    const years = Object.keys(this.recentLetters);
    const randomYear = years[Math.floor(Math.random() * years.length)];
    const insights = this.recentLetters[randomYear].keyInsights;
    return {
      year: this.recentLetters[randomYear].year,
      ...insights[Math.floor(Math.random() * insights.length)]
    };
  }
};

// Make available globally
window.buffettAnnualLetters = buffettAnnualLetters;
