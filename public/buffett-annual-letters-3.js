/**
 * Berkshire Hathaway Annual Letters - Key Lessons and Insights (Part 3)
 * Source: https://www.berkshirehathaway.com/letters/letters.html
 * 
 * This database contains the key investing principles, business insights,
 * and wisdom extracted from Warren Buffett's annual letters to Berkshire
 * shareholders from 2008-2012, covering the financial crisis and recovery.
 */

const buffettAnnualLetters3 = {
  // Financial Crisis and Recovery Years (2008-2012)
  crisisLetters: {
    // 2012 Annual Letter
    "2012": {
      year: 2012,
      keyInsights: [
        {
          topic: "Productive Assets",
          insight: "The basic choices available to investors are (1) currency-based investments such as money-market funds, bonds, mortgages, bank deposits, and other instruments; (2) investments in assets like stocks, real estate, and farms that potentially offer appreciation above inflation; and (3) assets that will never produce anything, but might increase in value, like gold and Bitcoin. The first category's return will always be inadequate, the second gives the investor a piece of a business, and the third is simply hoping someone else will pay more in the future.",
          context: "Explaining investment choices and why productive assets are superior long-term",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Newspapers",
          insight: "Berkshire bought 28 daily newspapers during the past fifteen months. Why? Charlie and I believe that papers delivering comprehensive and reliable information to tightly-bound communities and having a sensible Internet strategy will remain viable for a long time. I do not have a formula that tells me what a newspaper is worth to a potential buyer. Purchasing papers at 3-4 times current earnings is unusual in a world where benchmark acquisitions go for 6-10 times EBITDA.",
          context: "Explaining Berkshire's contrarian investment in newspapers",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Insurance 'Float'",
          insight: "Our insurance operations continued their delivery of costless capital that funds a myriad of other opportunities. This business produces 'float' – money that doesn't belong to us, but that we temporarily hold. If we can earn more than an appropriate interest charge on the funds, they produce profits; if not, insurance is unprofitable. Since 1967, when we entered insurance via the purchase of National Indemnity Company, our float has grown from $20 million to $73 billion.",
          context: "Describing the unique advantage of Berkshire's insurance business model",
          relevantCompanies: ["BRK.A", "BRK.B", "GEICO"]
        },
        {
          topic: "Moats and Pricing Power",
          insight: "The single most important decision in evaluating a business is pricing power. If you've got the power to raise prices without losing business to a competitor, you've got a very good business. And if you have to have a prayer session before raising the price by 10%, then you've got a terrible business.",
          context: "Emphasizing the importance of pricing power in business evaluation",
          relevantCompanies: ["BRK.A", "BRK.B", "KO", "AXP"]
        }
      ],
      notableInvestments: ["WFC", "IBM", "KO", "AXP"],
      economicContext: "Slow economic recovery, European debt crisis"
    },
    
    // 2011 Annual Letter
    "2011": {
      year: 2011,
      keyInsights: [
        {
          topic: "Housing Market",
          insight: "Housing remains in a depression of its own. We made large investments in several housing-related companies and currently have particularly large unrealized losses in a couple of these positions. I was dead wrong about the timing of their recovery. But we are more than holding our own in these businesses, and in aggregate they earn decent returns on invested capital.",
          context: "Discussing housing-related investments during the slow recovery",
          relevantCompanies: ["BRK.A", "BRK.B", "HOME CAPITAL"]
        },
        {
          topic: "Acquisitions",
          insight: "A thought for my fellow CEOs: Of course, the immediate future is uncertain; America has faced the unknown since 1776. It's just that sometimes people focus on the myriad of uncertainties that always exist while at other times they ignore them (usually because the recent past has been uneventful). American business will do fine over time. And stocks will do well just as certainly, since their fate is tied to business performance. Periodic setbacks will occur, yes, but investors and managers are in a game that is heavily stacked in their favor.",
          context: "Encouraging corporate leaders to make investments despite uncertainty",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Share Repurchases",
          insight: "Charlie and I favor repurchases when two conditions are met: first, a company has ample funds to take care of the operational and liquidity needs of its business; second, its stock is selling at a material discount to the company's intrinsic business value, conservatively calculated. We have witnessed many bouts of repurchasing that failed our second test. But these buybacks were often made to pump or support the stock price, not because the company's management thought its shares were undervalued.",
          context: "Explaining when share repurchases create or destroy value",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "IBM Investment",
          insight: "Now, IBM has been successful in many fields of endeavor for a long time, and its success has come for good reasons. As was the case with Coca-Cola in 1988 and the railroads in 2006, I was late to the IBM party. But our investments are usually in place for decades, and I'm confident IBM will be earning considerably more money a decade from now than it is today.",
          context: "Explaining Berkshire's significant investment in IBM",
          relevantCompanies: ["IBM", "BRK.A", "BRK.B"]
        }
      ],
      notableInvestments: ["IBM", "WFC", "KO", "AXP"],
      economicContext: "Slow economic recovery, European debt crisis, market volatility"
    },
    
    // 2010 Annual Letter
    "2010": {
      year: 2010,
      keyInsights: [
        {
          topic: "Burlington Northern Santa Fe Railway",
          insight: "It now appears that owning this railroad will increase Berkshire's 'normal' earning power by nearly 40% pre-tax and by well over 30% after-tax. Railroads build America in a major way and will continue to do so. BNSF is the largest artery of American commerce, which makes it an indispensable asset for America as well as for Berkshire. Come by our annual meeting and let us sell you a new set of Berkshire-made underwear – mine are emblazoned with 'BNSF'.",
          context: "Discussing Berkshire's major acquisition of BNSF Railway",
          relevantCompanies: ["BRK.A", "BRK.B", "BNSF"]
        },
        {
          topic: "Housing Recovery",
          insight: "A housing recovery will probably begin within a year or so. In any event, it is certain to occur at some point. Fortunately, there are several ways in which it will benefit our subsidiaries – and, therefore, Berkshire's earnings. A housing recovery will benefit our numerous subsidiaries that are connected to housing – Clayton, Shaw, Acme, Johns Manville, MiTek, and HomeServices. While their profits are depressed, we are preparing for better times. When they arrive, demographics and our many housing-related businesses assure us we will do well.",
          context: "Predicting the eventual recovery of the housing market",
          relevantCompanies: ["BRK.A", "BRK.B", "Clayton Homes"]
        },
        {
          topic: "Derivatives Contracts",
          insight: "I believe each contract we own was mispriced at inception, sometimes dramatically so. I both initiated these positions and monitor them, a set of responsibilities consistent with my belief that the CEO of any large financial organization must be the Chief Risk Officer as well. If we lose money on our derivatives, it will be my fault.",
          context: "Explaining Berkshire's unusual derivatives positions",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Lubrizol Acquisition",
          insight: "On March 14, 2011, Berkshire announced its acquisition of Lubrizol, a worldwide producer of additives and other specialty chemicals. The company has been a continuing star, earning about $1 billion pre-tax in each of the last three years. This business is one we understand well and James Hambrick is the CEO whom I had hoped to find.",
          context: "Announcing a major acquisition in the specialty chemicals business",
          relevantCompanies: ["BRK.A", "BRK.B", "Lubrizol"]
        }
      ],
      notableInvestments: ["WFC", "KO", "AXP", "WMT"],
      economicContext: "Early economic recovery, lingering housing market weakness"
    },
    
    // 2009 Annual Letter
    "2009": {
      year: 2009,
      keyInsights: [
        {
          topic: "BNSF Acquisition",
          insight: "Our BNSF operation, it should be noted, has certain important economic characteristics that resemble those of our electric utilities. In both cases we provide fundamental services that are, and will remain, essential to the economic well-being of our customers, the communities we serve, and indeed the nation. Both will require heavy investment that greatly exceeds depreciation allowances for decades to come. Both must also plan far ahead to satisfy demand that will arise 5, 10 or 20 years hence.",
          context: "Explaining the long-term economic characteristics of Berkshire's largest acquisition",
          relevantCompanies: ["BRK.A", "BRK.B", "BNSF"]
        },
        {
          topic: "Economic Recovery",
          insight: "The economy will be in shambles throughout 2009 – and, for that matter, probably well beyond – but that conclusion does not tell us whether the stock market will rise or fall. We're certain, for example, that the economy will be in shambles throughout 2009 – and, for that matter, probably well beyond – but that conclusion does not tell us whether the market will rise or fall.",
          context: "Separating economic predictions from market predictions",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "America's Best Days",
          insight: "We've put a lot of money to work during the chaos of the last two years. It's been an ideal period for investors: A climate of fear is their best friend. Those who invest only when commentators are upbeat end up paying a heavy price for meaningless reassurance. In the end, what counts in investing is what you pay for a business – through the purchase of a small piece of it in the stock market – and what that business earns in the succeeding decade or two.",
          context: "Explaining Berkshire's investment approach during the financial crisis",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Munger's Wisdom",
          insight: "Charlie Munger, Berkshire's vice chairman and my partner, and I avoid businesses whose futures we can't evaluate, no matter how exciting their products may be. In the past, it required no brilliance for people to foresee the fabulous growth that awaited such industries as autos (in 1910), aircraft (in 1930) and television sets (in 1950). But the future then also included competitive dynamics that would decimate almost all of the companies entering those industries. Even the survivors tended to come away bleeding.",
          context: "Explaining why certain high-growth industries can be poor investments",
          relevantCompanies: ["BRK.A", "BRK.B"]
        }
      ],
      notableInvestments: ["WFC", "KO", "AXP", "WMT"],
      economicContext: "Financial crisis recovery, high unemployment, government stimulus"
    },
    
    // 2008 Annual Letter
    "2008": {
      year: 2008,
      keyInsights: [
        {
          topic: "Financial Crisis",
          insight: "By the fourth quarter, the credit crisis, coupled with tumbling home and stock prices, had produced a paralyzing fear that engulfed the country. A freefall in business activity ensued, accelerating at a pace that I have never before witnessed. The U.S. – and much of the world – became trapped in a vicious negative-feedback cycle. Fear led to business contraction, and that in turn led to even greater fear.",
          context: "Describing the severity of the 2008 financial crisis",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "America's Future",
          insight: "Amid this bad news, however, never forget that our country has faced far worse travails in the past. In the 20th Century alone, we dealt with two great wars (one of which we initially appeared to be losing); a dozen or so panics and recessions; virulent inflation that led to a 21½% prime rate in 1980; and the Great Depression of the 1930s, when unemployment ranged between 15% and 25% for many years. America has had no shortage of challenges. Without fail, however, we've overcome them.",
          context: "Expressing optimism about America's long-term prospects despite crisis",
          relevantCompanies: ["BRK.A", "BRK.B"]
        },
        {
          topic: "Investment Mistakes",
          insight: "During 2008, I did some dumb things in investments. I made at least one major mistake of commission and several lesser ones that also hurt. I will tell you more about these later. Furthermore, I made some errors of omission, sucking my thumb when new facts came in that should have caused me to re-examine my thinking and promptly take action.",
          context: "Admitting investment mistakes during the financial crisis",
          relevantCompanies: ["BRK.A", "BRK.B", "COF", "USB"]
        },
        {
          topic: "Capital Allocation",
          insight: "Long ago, Ben Graham taught me that 'Price is what you pay; value is what you get.' Whether we're talking about socks or stocks, I like buying quality merchandise when it is marked down. We've put a lot of money to work during the chaos of the last two years. It's been an ideal period for investors: A climate of fear is their best friend.",
          context: "Explaining Berkshire's approach to investing during market panics",
          relevantCompanies: ["BRK.A", "BRK.B", "GE", "GS"]
        }
      ],
      notableInvestments: ["WFC", "GE", "GS", "KO"],
      economicContext: "Financial crisis, housing market collapse, bank failures"
    }
  },
  
  // Methods to retrieve relevant insights
  getInsightsByYear: function(year) {
    // Return all insights from a specific year
    if (this.crisisLetters[year]) {
      return this.crisisLetters[year].keyInsights;
    }
    return [];
  },
  
  getInsightsByTopic: function(topic) {
    // Find insights across all years related to a specific topic
    let results = [];
    
    for (const year in this.crisisLetters) {
      const yearData = this.crisisLetters[year];
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
  
  getRandomInsight: function() {
    // Get a random insight from any year
    const years = Object.keys(this.crisisLetters);
    const randomYear = years[Math.floor(Math.random() * years.length)];
    const insights = this.crisisLetters[randomYear].keyInsights;
    return {
      year: this.crisisLetters[randomYear].year,
      ...insights[Math.floor(Math.random() * insights.length)]
    };
  }
};

// Make available globally
window.buffettAnnualLetters3 = buffettAnnualLetters3;
