/**
 * Buffett and Munger Investing Wisdom Database
 * This file contains categorized quotes and investment history from Warren Buffett and Charlie Munger
 * Used by the Value Investor Bot to provide context-aware investing wisdom
 */

const buffettMungerWisdom = {
  // Quotes organized by investing concept
  quotes: {
    // Market behavior and psychology
    marketPsychology: [
      {
        author: "Warren Buffett",
        quote: "Be fearful when others are greedy, and greedy when others are fearful.",
        source: "2004 Berkshire Hathaway Annual Letter",
        context: "Discussing market timing and contrarian investing",
        tags: ["market timing", "contrarian investing", "psychology"]
      },
      {
        author: "Charlie Munger",
        quote: "The big money is not in the buying and selling, but in the waiting.",
        source: "Berkshire Hathaway Annual Meeting, 1999",
        context: "Explaining patience in investing",
        tags: ["patience", "long-term", "holding period"]
      },
      {
        author: "Warren Buffett",
        quote: "The stock market is designed to transfer money from the active to the patient.",
        source: "Berkshire Hathaway Annual Meeting, 2004",
        context: "Discussing the benefits of long-term investing vs. trading",
        tags: ["patience", "trading", "market timing"]
      }
    ],
    
    // Valuation principles
    valuation: [
      {
        author: "Warren Buffett",
        quote: "Price is what you pay. Value is what you get.",
        source: "2008 Berkshire Hathaway Annual Letter",
        context: "Explaining the difference between price and intrinsic value",
        tags: ["intrinsic value", "price", "market efficiency"]
      },
      {
        author: "Charlie Munger",
        quote: "All intelligent investing is value investing - acquiring more than you are paying for.",
        source: "Wesco Financial Annual Meeting, 2011",
        context: "Discussing the fundamentals of sound investing",
        tags: ["intrinsic value", "margin of safety", "investment philosophy"]
      },
      {
        author: "Warren Buffett",
        quote: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
        source: "1989 Berkshire Hathaway Annual Letter",
        context: "Shift from Ben Graham's deep value approach to quality businesses",
        tags: ["quality", "price", "business fundamentals"]
      }
    ],
    
    // Business quality assessment
    businessQuality: [
      {
        author: "Warren Buffett",
        quote: "In business, I look for economic castles protected by unbreachable moats.",
        source: "2007 Berkshire Hathaway Annual Meeting",
        context: "Explaining his focus on companies with strong competitive advantages",
        tags: ["moat", "competitive advantage", "business model"]
      },
      {
        author: "Charlie Munger",
        quote: "Over the long term, it's hard for a stock to earn a much better return than the business which underlies it earns.",
        source: "Poor Charlie's Almanack",
        context: "Discussing how stock returns ultimately depend on business performance",
        tags: ["business performance", "returns", "long-term"]
      },
      {
        author: "Warren Buffett",
        quote: "Only buy something that you'd be perfectly happy to hold if the market shut down for 10 years.",
        source: "Forbes, 1974",
        context: "Emphasizing the importance of business quality over market liquidity",
        tags: ["long-term", "business quality", "market timing"]
      }
    ],
    
    // Management and capital allocation
    management: [
      {
        author: "Warren Buffett",
        quote: "When we own portions of outstanding businesses with outstanding managements, our favorite holding period is forever.",
        source: "1988 Berkshire Hathaway Annual Letter",
        context: "Discussing the value of great management and high-quality businesses",
        tags: ["management", "holding period", "business quality"]
      },
      {
        author: "Charlie Munger",
        quote: "You don't need to be a rocket scientist. Investing is not a game where the guy with the 160 IQ beats the guy with 130 IQ.",
        source: "Wesco Annual Meeting, 2007",
        context: "Explaining that successful investing is more about temperament than intelligence",
        tags: ["temperament", "intelligence", "simplicity"]
      },
      {
        author: "Warren Buffett",
        quote: "We try to buy businesses with good management in place. When we fail, we try to correct the situation or sell.",
        source: "Berkshire Hathaway Annual Meeting, 2012",
        context: "Discussing their approach to management of acquired businesses",
        tags: ["management", "acquisitions", "business operations"]
      }
    ],
    
    // Financial metrics and ratios
    financialMetrics: [
      {
        author: "Warren Buffett",
        quote: "Accounting is the language of business, and you have to learn it like a language.",
        source: "University of Florida Business School, 1998",
        context: "Emphasizing the importance of understanding financial statements",
        tags: ["accounting", "financial statements", "business analysis"]
      },
      {
        author: "Charlie Munger",
        quote: "You're looking for a mispriced gamble. That's what investing is. And you have to know enough to know whether the gamble is mispriced.",
        source: "Wesco Annual Meeting, 2007",
        context: "On understanding valuation and probabilities in investing",
        tags: ["valuation", "probability", "margin of safety"]
      },
      {
        author: "Warren Buffett",
        quote: "We've long felt that the only value of stock forecasters is to make fortune tellers look good.",
        source: "1992 Berkshire Hathaway Annual Letter",
        context: "Criticizing short-term market and stock price predictions",
        tags: ["forecasting", "market predictions", "stock analysts"]
      }
    ],
    
    // Risk management
    riskManagement: [
      {
        author: "Warren Buffett",
        quote: "Rule No.1: Never lose money. Rule No.2: Never forget rule No.1.",
        source: "Various speeches and interviews",
        context: "Emphasizing capital preservation as the foundation of investing",
        tags: ["capital preservation", "risk", "losses"]
      },
      {
        author: "Charlie Munger",
        quote: "The first rule of compounding is to never interrupt it unnecessarily.",
        source: "Berkshire Hathaway Annual Meeting, 2004",
        context: "On avoiding losses that interrupt the power of compound returns",
        tags: ["compounding", "losses", "long-term"]
      },
      {
        author: "Warren Buffett",
        quote: "We believe that a policy of portfolio concentration may well decrease risk if it raises, as it should, both the intensity with which an investor thinks about a business and the comfort level he must feel with its economic characteristics before buying into it.",
        source: "1993 Berkshire Hathaway Annual Letter",
        context: "Explaining why concentration can reduce risk for knowledgeable investors",
        tags: ["concentration", "diversification", "knowledge"]
      }
    ],
    
    // Circle of competence
    circleOfCompetence: [
      {
        author: "Warren Buffett",
        quote: "Risk comes from not knowing what you're doing.",
        source: "Fortune Magazine, 1993",
        context: "Discussing the importance of investing within your circle of competence",
        tags: ["knowledge", "risk", "understanding"]
      },
      {
        author: "Charlie Munger",
        quote: "Knowing what you don't know is more useful than being brilliant.",
        source: "USC Business School, 1994",
        context: "On the importance of recognizing the limits of your knowledge",
        tags: ["limits", "knowledge", "humility"]
      },
      {
        author: "Warren Buffett",
        quote: "The most important thing to do when you find yourself in a hole is to stop digging.",
        source: "Berkshire Hathaway Annual Meeting, 2005",
        context: "On recognizing mistakes and avoiding escalation of commitment",
        tags: ["mistakes", "decision-making", "psychology"]
      }
    ]
  },
  
  // Historical investments with commentary
  investments: {
    // Tech sector investments
    tech: [
      {
        company: "Apple Inc.",
        ticker: "AAPL",
        initialInvestment: {
          year: 2016,
          sharesPurchased: 9.8e7,
          approximateCost: "$6.75 billion",
          keyMetricsAtPurchase: {
            pe: 10.8,
            marketCap: "$586 billion",
            returnOnEquity: "46%"
          }
        },
        buffettComment: "Apple is an extraordinary business. I can very easily determine the competitive position of Apple now and who is trying to chase them and what they're trying to do in the future.",
        mungerComment: "Apple is one of the strongest companies in the world. I judge the strength of the company based on how much the customers love it.",
        context: "Initially viewed as a break from avoiding tech stocks, Buffett recognized Apple as a consumer products company with extraordinary brand loyalty and pricing power."
      },
      {
        company: "IBM",
        ticker: "IBM",
        initialInvestment: {
          year: 2011,
          sharesPurchased: 6.4e7,
          approximateCost: "$10.7 billion",
          keyMetricsAtPurchase: {
            pe: 14,
            marketCap: "$213 billion",
            returnOnEquity: "73%"
          }
        },
        sale: {
          year: 2018,
          reason: "Changed view on long-term competitive position"
        },
        buffettComment: "I don't value IBM the same way that I did six years ago when I started buying... I've revalued it somewhat downward.",
        mungerComment: "The forecasting of anything is difficult, and forecasting technology is particularly difficult.",
        context: "One of Buffett's admitted mistakes, with IBM struggling to adapt to cloud computing and new technology paradigms. Shows willingness to exit when investment thesis breaks."
      }
    ],
    
    // Financial sector investments
    financials: [
      {
        company: "Bank of America",
        ticker: "BAC",
        initialInvestment: {
          year: 2011,
          description: "$5 billion in preferred stock with warrants to purchase 700 million common shares at $7.14 per share",
          keyMetricsAtPurchase: {
            priceToBook: 0.33,
            marketCap: "$65 billion",
            returnOnEquity: "Below 5%"
          }
        },
        buffettComment: "Bank of America is a well-led bank. They made some big mistakes in mortgages, and they're cleaning it up. But that doesn't mean they didn't have a great underlying business.",
        context: "Made during financial crisis aftermath, showing Buffett's contrarian strategy of buying financially strong companies during times of market fear."
      },
      {
        company: "Wells Fargo",
        ticker: "WFC",
        initialInvestment: {
          year: 1989,
          description: "Initial stake with significant additions over the decades",
          keyMetricsAtEarlyPurchase: {
            priceToBook: 1.5,
            returnOnEquity: "15%"
          }
        },
        reductionInHoldings: {
          year: 2020,
          reason: "Governance and risk management concerns"
        },
        buffettComment: "If I can buy a great business with management I like and trust for a discount, then I'm going to do that.",
        mungerComment: "Banking has turned out to be a better business than we thought it would be. We made a few mistakes, but we stumbled into some good decisions.",
        context: "Long-term financial sector investment that Berkshire reduced after scandals related to sales practices emerged."
      }
    ],
    
    // Consumer products investments
    consumerProducts: [
      {
        company: "Coca-Cola",
        ticker: "KO",
        initialInvestment: {
          year: 1988,
          sharesPurchased: 2.3e8,
          approximateCost: "$1.3 billion",
          keyMetricsAtPurchase: {
            pe: 15,
            marketCap: "$14.8 billion",
            returnOnEquity: "31%"
          }
        },
        buffettComment: "If you gave me $100 billion and said, 'Take away the soft drink leadership of Coca-Cola,' I'd give it back to you and say it can't be done.",
        mungerComment: "It's the most remarkable business in the world. It sells sugar water for a premium price with huge market shares everywhere.",
        context: "Iconic Buffett investment showcasing the value of a global brand and distribution network. Has been held for decades with no intention to sell."
      },
      {
        company: "Kraft Heinz",
        ticker: "KHC",
        initialInvestment: {
          year: 2015,
          description: "Partnered with 3G Capital in Heinz acquisition and subsequent Kraft merger",
          approximateValue: "$9.5 billion",
          keyMetricsAtPurchase: {
            pe: 33,
            marketCap: "$88 billion",
            returnOnEquity: "6%"
          }
        },
        writedown: {
          year: 2019,
          amount: "$3 billion"
        },
        buffettComment: "We overpaid for Kraft. It's still a wonderful business in that it uses about $7 billion of tangible assets and earns $6 billion pre-tax on that.",
        context: "Example of paying too high a price for a good business, with changing consumer preferences in packaged foods creating headwinds."
      }
    ],
    
    // Transportation and energy sector investments
    transportationEnergy: [
      {
        company: "BNSF Railway",
        ticker: "Acquired fully in 2010",
        initialInvestment: {
          year: "2009 (full acquisition)",
          approximateCost: "$44 billion (including debt)",
          keyMetricsAtPurchase: {
            operatingMargin: "35%",
            returnOnInvestedCapital: "12%"
          }
        },
        buffettComment: "It's got a terrific competitive position. It's the most efficient way to move goods across the country by far. You've got a huge investment that has to be made by anyone that competes with you.",
        mungerComment: "Railroads are good to own if they don't face heavy competition from other railroads.",
        context: "Example of Buffett buying capital-intensive businesses with strong competitive positions and regulatory advantages."
      }
    ]
  },
  
  // Methods to integrate quotes into bot responses
  getQuotesByTopic: function(topic) {
    // Find all quotes that match the given topic across different categories
    let results = [];
    
    // Search through all categories
    for (const category in this.quotes) {
      const quotesInCategory = this.quotes[category].filter(q => 
        q.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      );
      results = results.concat(quotesInCategory);
    }
    
    return results;
  },
  
  getRandomQuote: function(topic) {
    const quotes = this.getQuotesByTopic(topic);
    if (quotes.length === 0) return null;
    
    // Return a random quote from the matching quotes
    return quotes[Math.floor(Math.random() * quotes.length)];
  },
  
  // Get investment wisdom about a specific company or company type
  getInvestmentWisdom: function(ticker) {
    let wisdom = null;
    
    // Check for direct Berkshire investment experience with this company
    for (const sector in this.investments) {
      const matchingInvestments = this.investments[sector].filter(investment => 
        investment.ticker === ticker
      );
      
      if (matchingInvestments.length > 0) {
        wisdom = matchingInvestments[0];
        break;
      }
    }
    
    return wisdom;
  },
  
  // Add relevant quote to a bot response based on financial metrics
  enrichResponseWithQuote: function(metrics, response) {
    // Determine which topics might be relevant based on financial metrics
    const relevantTopics = [];
    
    // High P/E ratio? Add valuation quote
    if (metrics.pe && metrics.pe > 25) {
      relevantTopics.push("valuation");
    }
    
    // Low ROE? Add business quality quote
    if (metrics.roe && metrics.roe < 10) {
      relevantTopics.push("business quality");
    }
    
    // High debt? Add risk management quote
    if (metrics.debtToEquity && metrics.debtToEquity > 1) {
      relevantTopics.push("risk");
    }
    
    // If we have relevant topics, get a random quote
    if (relevantTopics.length > 0) {
      const randomTopic = relevantTopics[Math.floor(Math.random() * relevantTopics.length)];
      const quote = this.getRandomQuote(randomTopic);
      
      if (quote) {
        // Add the quote to the response with proper formatting
        response += `\n\n*"${quote.quote}"* - ${quote.author}, ${quote.source}`;
      }
    }
    
    return response;
  }
};

// Make available globally
window.buffettMungerWisdom = buffettMungerWisdom;
