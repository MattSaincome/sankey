/**
 * Unified System for Warren Buffett's Annual Letters to Berkshire Hathaway Shareholders (1977-2008)
 * 
 * This file integrates all Buffett annual letters into a single knowledge system
 * for easy access to historical investment wisdom, principles, and insights.
 */

const buffettLettersUnified = {
  timespan: "1977-2008",
  totalLetters: 32,
  
  // All letters organized by year for easy reference
  lettersByYear: {
    1977: window.buffettLetter1977,
    1978: window.buffettLetter1978,
    1979: window.buffettLetter1979,
    1980: window.buffettLetter1980,
    1981: window.buffettLetter1981,
    1982: window.buffettLetter1982,
    1983: window.buffettLetter1983,
    1984: window.buffettLetter1984,
    1985: window.buffettLetter1985,
    1986: window.buffettLetter1986,
    1987: window.buffettLetter1987,
    1988: window.buffettLetter1988,
    1989: window.buffettLetter1989,
    1990: window.buffettLetter1990,
    1991: window.buffettLetter1991,
    1992: window.buffettLetter1992,
    1993: window.buffettLetter1993,
    1994: window.buffettLetter1994,
    1995: window.buffettLetter1995,
    1996: window.buffettLetter1996,
    1997: window.buffettLetter1997,
    1998: window.buffettLetter1998,
    1999: window.buffettLetter1999,
    2000: window.buffettLetter2000,
    2001: window.buffettLetter2001,
    2002: window.buffettLetter2002,
    2003: window.buffettLetter2003,
    2004: window.buffettLetter2004,
    2005: window.buffettLetter2005,
    2006: window.buffettLetter2006,
    2007: window.buffettLetter2007,
    2008: window.buffettLetter2008
  },
  
  // Core investment principles extracted from all letters
  coreInvestmentPrinciples: [
    {
      principle: "Circle of Competence",
      description: "Invest only within your area of knowledge and understanding.",
      buffettQuote: "What counts for most people in investing is not how much they know, but rather how realistically they define what they don't know.",
      letterReferences: [1996, 1997, 1999, 2001]
    },
    {
      principle: "Margin of Safety",
      description: "Always invest with a margin of safety to allow for errors, bad luck, or extreme events.",
      buffettQuote: "The three most important words in investing are 'margin of safety.'",
      letterReferences: [1993, 1997, 2001, 2004]
    },
    {
      principle: "Long-Term Outlook",
      description: "Approach investments with the intention to hold them for very long periods, ideally forever.",
      buffettQuote: "If you aren't willing to own a stock for ten years, don't even think about owning it for ten minutes.",
      letterReferences: [1988, 1996, 1998, 2003]
    },
    {
      principle: "Economic Moats",
      description: "Seek businesses with sustainable competitive advantages that protect high returns on capital.",
      buffettQuote: "A truly great business must have an enduring 'moat' that protects excellent returns on invested capital.",
      letterReferences: [1986, 1991, 1995, 2000, 2007]
    },
    {
      principle: "Owner Earnings",
      description: "Focus on the cash that can be extracted from a business over its lifetime.",
      buffettQuote: "Intrinsic value can be defined simply: It is the discounted value of the cash that can be taken out of a business during its remaining life.",
      letterReferences: [1986, 1990, 1994, 2000]
    },
    {
      principle: "Management Quality",
      description: "Invest in businesses with honest, talented management teams.",
      buffettQuote: "Managers who always promise to 'make the numbers' will at some point be tempted to make up the numbers.",
      letterReferences: [1980, 1989, 1994, 2002]
    },
    {
      principle: "Price Discipline",
      description: "The price you pay determines your rate of return.",
      buffettQuote: "For the investor, a too-high purchase price for the stock of an excellent company can undo the effects of a subsequent decade of favorable business developments.",
      letterReferences: [1982, 1988, 1992, 1999, 2005]
    },
    {
      principle: "Avoid Leverage",
      description: "Use minimal debt to reduce risk and maintain flexibility.",
      buffettQuote: "When you combine ignorance and leverage, you get some pretty interesting results.",
      letterReferences: [1987, 1990, 1994, 2002, 2007]
    }
  ],
  
  // Historical context of major investment eras
  historicalEras: [
    {
      era: "High Inflation Period (1977-1982)",
      economicContext: "Period of stagflation with high inflation, high interest rates, and slow economic growth.",
      buffettFocus: "Emphasized businesses with pricing power, low capital intensity, and ability to maintain real returns during inflation.",
      keyLetters: [1977, 1979, 1981],
      notableQuote: "Inflation is a far more devastating tax than anything that has been enacted by our legislatures. The inflation tax has a fantastic ability to simply consume capital. If you feel you can dance in and out of securities in a way that defeats the inflation tax, I would like to be your broker—but not your partner."
    },
    {
      era: "Bull Market Beginnings (1983-1987)",
      economicContext: "Start of a long bull market, declining interest rates, and market optimism.",
      buffettFocus: "Warned about market excitement while finding value in consumer franchises like Coca-Cola.",
      keyLetters: [1983, 1985, 1987],
      notableQuote: "We simply attempt to be fearful when others are greedy and to be greedy only when others are fearful."
    },
    {
      era: "Market Crash and Recovery (1988-1992)",
      economicContext: "Recovery from 1987 crash, Savings & Loan crisis, Gulf War, and recession.",
      buffettFocus: "Emphasized fundamental value and long-term thinking during market turmoil.",
      keyLetters: [1988, 1990, 1992],
      notableQuote: "In the short run, the market is a voting machine but in the long run, it is a weighing machine."
    },
    {
      era: "Early Tech Boom (1993-1996)",
      economicContext: "Strong economic growth, early internet adoption, and beginning of tech stock momentum.",
      buffettFocus: "Avoided tech stocks while emphasizing businesses with predictable economics.",
      keyLetters: [1993, 1995, 1996],
      notableQuote: "An investor needs to do very few things right as long as he or she avoids big mistakes."
    },
    {
      era: "Dot-Com Bubble (1997-1999)",
      economicContext: "Extreme tech stock valuations, IPO frenzy, and 'new economy' theories.",
      buffettFocus: "Warned about market irrationality while sticking to value principles despite underperformance.",
      keyLetters: [1997, 1998, 1999],
      notableQuote: "The line separating investment and speculation, which is never bright and clear, becomes blurred still further when most market participants have recently enjoyed triumphs. Nothing sedates rationality like large doses of effortless money."
    },
    {
      era: "Dot-Com Crash and Recovery (2000-2004)",
      economicContext: "Collapse of tech valuations, corporate scandals (Enron, WorldCom), 9/11 attacks.",
      buffettFocus: "Emphasized accounting integrity, corporate governance, and investor psychology.",
      keyLetters: [2000, 2001, 2002, 2003],
      notableQuote: "You only find out who is swimming naked when the tide goes out."
    },
    {
      era: "Housing Bubble and Financial Crisis Onset (2005-2008)",
      economicContext: "Housing bubble, excessive financial leverage, complex derivatives, and credit crisis.",
      buffettFocus: "Warned about systemic risks in the financial system, derivatives dangers, and excessive leverage.",
      keyLetters: [2005, 2006, 2007, 2008],
      notableQuote: "It's only when the tide goes out that you learn who's been swimming naked."
    }
  ],
  
  // Wisdom on different business categories
  businessCategoryInsights: [
    {
      category: "Insurance",
      keyInsights: [
        "The economics of the property/casualty insurance industry can produce excellent returns when underwriting discipline is maintained",
        "Float (premiums received before claims paid) provides a valuable source of investment funds for insurers",
        "Catastrophe insurance requires appropriate pricing for low-frequency, high-severity events",
        "GEICO's low-cost direct model gives it a sustainable competitive advantage"
      ],
      notableCompanies: ["GEICO", "General Re", "National Indemnity"],
      letterReferences: [1978, 1985, 1995, 2001, 2005]
    },
    {
      category: "Banking & Finance",
      keyInsights: [
        "Banking leverages society's trust, making integrity and risk management essential",
        "Financial institutions tend toward excessive leverage when regulations and management discipline are weak",
        "Derivatives create systemic risks through complexity and interconnection",
        "Financial innovation often disguises risk rather than eliminating it"
      ],
      notableCompanies: ["Wells Fargo", "American Express", "Salomon Brothers"],
      letterReferences: [1990, 1991, 2002, 2006, 2007]
    },
    {
      category: "Consumer Products",
      keyInsights: [
        "Strong brands create pricing power and customer loyalty",
        "Consumer habits change slowly, creating stability for well-positioned businesses",
        "Return on invested capital matters more than growth",
        "See's Candies demonstrates the value of a beloved brand requiring minimal capital reinvestment"
      ],
      notableCompanies: ["See's Candies", "Coca-Cola", "Gillette", "Fruit of the Loom"],
      letterReferences: [1983, 1988, 1993, 1996, 2004]
    },
    {
      category: "Manufacturing",
      keyInsights: [
        "Commodity manufacturers are price-takers, making low-cost production essential",
        "Scale advantages can create sustainable competitive positions",
        "Capital intensity reduces returns unless offset by pricing power",
        "International competition has permanently changed manufacturing economics in many industries"
      ],
      notableCompanies: ["Shaw Industries", "Benjamin Moore", "ISCAR", "Marmon Group"],
      letterReferences: [1985, 1991, 1999, 2006]
    },
    {
      category: "Utilities & Energy",
      keyInsights: [
        "Regulated utilities offer stable returns with limited downside and upside",
        "Energy assets benefit from inflation protection and essential-service status",
        "Appropriate capital structure is crucial in capital-intensive regulated businesses",
        "Scale and geographic diversification provide advantages"
      ],
      notableCompanies: ["MidAmerican Energy", "PacifiCorp"],
      letterReferences: [1999, 2000, 2002, 2007]
    },
    {
      category: "Media & Entertainment",
      keyInsights: [
        "Local media monopolies (newspapers) were once exceptional businesses but faced technological disruption",
        "Media businesses with strong competitive positions can generate high returns on capital",
        "Content creation versus distribution economics differ significantly",
        "Brand and reputation create valuable franchises"
      ],
      notableCompanies: ["Buffalo News", "Washington Post", "Capital Cities/ABC", "Disney"],
      letterReferences: [1982, 1984, 1991, 1996]
    },
    {
      category: "Retail",
      keyInsights: [
        "Retail businesses face constant competitive pressure",
        "Scale and cost advantages are critical to retail success",
        "Location, management execution, and capital discipline determine retail success",
        "Online competition has fundamentally changed retail economics"
      ],
      notableCompanies: ["Nebraska Furniture Mart", "Borsheims", "Jordan's Furniture", "RC Willey"],
      letterReferences: [1983, 1988, 1995, 2000, 2005]
    }
  ],
  
  // Timeline of key Berkshire investments and acquisitions
  majorInvestmentsTimeline: [
    {
      year: 1977,
      investments: ["Buffalo News", "GEICO (significant minority stake)"],
      buffettInsight: "The economics of owning a monopoly media property proved extraordinary until internet disruption."
    },
    {
      year: 1983,
      investments: ["Nebraska Furniture Mart"],
      buffettInsight: "Rose Blumkin's business demonstrated the remarkable economics of a well-run retailer with sustainable competitive advantages."
    },
    {
      year: 1985,
      investments: ["Capital Cities/ABC"],
      buffettInsight: "Tom Murphy and Dan Burke exemplified the type of owner-oriented management Berkshire seeks in partners."
    },
    {
      year: 1988,
      investments: ["Coca-Cola"],
      buffettInsight: "The Coca-Cola Company exemplifies a business with an enduring competitive advantage, global growth potential, and outstanding economics."
    },
    {
      year: 1989,
      investments: ["Borsheims"],
      buffettInsight: "The combination of exceptional management and a sustainable competitive advantage creates a powerful business model."
    },
    {
      year: 1991,
      investments: ["H.H. Brown Shoe Company"],
      buffettInsight: "Even in a mundane business like shoe manufacturing, superior management and financial discipline can create excellent returns."
    },
    {
      year: 1995,
      investments: ["GEICO (100% acquisition)", "FlightSafety International"],
      buffettInsight: "GEICO's low-cost business model and focus on direct marketing create a sustainable advantage in an industry where cost matters tremendously."
    },
    {
      year: 1996,
      investments: ["Walt Disney Company"],
      buffettInsight: "Disney's library of characters and content creates a moat too wide for competitors to cross."
    },
    {
      year: 1998,
      investments: ["General Re", "Executive Jet"],
      buffettInsight: "The insurance industry can generate substantial investment float, but only with disciplined underwriting."
    },
    {
      year: 1999,
      investments: ["MidAmerican Energy", "Jordan's Furniture"],
      buffettInsight: "Regulated utilities with exceptional management can deploy large amounts of capital at satisfactory rates of return."
    },
    {
      year: 2000,
      investments: ["Shaw Industries", "Johns Manville"],
      buffettInsight: "Leading positions in basic industries can create sustainable advantages when paired with operational excellence."
    },
    {
      year: 2001,
      investments: ["Fruit of the Loom"],
      buffettInsight: "Brand strength can provide a competitive advantage even in basic apparel."
    },
    {
      year: 2003,
      investments: ["Clayton Homes", "McLane Company"],
      buffettInsight: "Clayton's vertical integration and financial discipline allowed it to prosper when most of its competitors failed."
    },
    {
      year: 2004,
      investments: ["Business Wire", "Forest River"],
      buffettInsight: "Market-leading positions in niche industries can create excellent economics and growth opportunities."
    },
    {
      year: 2005,
      investments: ["PacifiCorp", "Medical Protective"],
      buffettInsight: "Regulated energy assets can create predictable returns with appropriate capital allocation."
    },
    {
      year: 2006,
      investments: ["ISCAR", "Russell"],
      buffettInsight: "ISCAR's cutting-edge technology and global reach create a sustainable competitive advantage in metalworking."
    },
    {
      year: 2007,
      investments: ["Marmon Group", "Equitas"],
      buffettInsight: "The Marmon Group demonstrates how a diversified collection of businesses can thrive under decentralized management."
    },
    {
      year: 2008,
      investments: ["Wrigley (participation in Mars acquisition)"],
      buffettInsight: "During financial crises, Berkshire's financial strength allows it to make investments when others cannot."
    }
  ],
  
  // Evolving perspectives on key topics over the years
  topicalWisdom: {
    marketTiming: [
      {
        period: "1977-1987",
        perspective: "Focused on individual business value rather than market timing, but noted periods of general overvaluation or undervaluation.",
        notableQuote: "We don't have to be smarter than the rest. We have to be more disciplined than the rest.",
        letterReferences: [1978, 1982, 1985]
      },
      {
        period: "1988-1999",
        perspective: "Increasingly concerned about overall market valuation as the bull market progressed, especially during the dot-com bubble.",
        notableQuote: "The fact that people will be full of greed, fear, or folly is predictable. The sequence is not predictable.",
        letterReferences: [1988, 1994, 1999]
      },
      {
        period: "2000-2008",
        perspective: "Found more opportunities after the dot-com crash, but warned about new bubbles in credit markets and housing.",
        notableQuote: "Be fearful when others are greedy, and be greedy when others are fearful.",
        letterReferences: [2001, 2004, 2008]
      }
    ],
    
    corporateGovernance: [
      {
        period: "1977-1989",
        perspective: "Emphasized shareholder-oriented management and capital allocation.",
        notableQuote: "Managers forget that they are merely employee-agents, not owner-principals.",
        letterReferences: [1979, 1983, 1988]
      },
      {
        period: "1990-2001",
        perspective: "Increasingly focused on board independence and executive compensation issues.",
        notableQuote: "The boardroom is still too often a place where managerial criticism is as welcome as poison ivy at a garden party.",
        letterReferences: [1993, 1997, 2001]
      },
      {
        period: "2002-2008",
        perspective: "In wake of Enron and other scandals, sharply criticized governance failures and compensation excess.",
        notableQuote: "The job of the board is to hire, monitor, and when necessary, replace the CEO. Too often, boards have instead become advisory committees to the CEO.",
        letterReferences: [2002, 2003, 2006]
      }
    ],
    
    economicMoats: [
      {
        period: "1977-1989",
        perspective: "Focused on businesses with sustainable competitive advantages, particularly consumer franchises and low-cost producers.",
        notableQuote: "An economic franchise arises from a product or service that: (1) is needed or desired; (2) is thought by its customers to have no close substitute; and (3) is not subject to price regulation.",
        letterReferences: [1981, 1983, 1988]
      },
      {
        period: "1990-2001",
        perspective: "Refined the concept of moats, distinguishing between enduring advantages and temporary ones.",
        notableQuote: "The key to investing is not assessing how much an industry is going to affect society, or how much it will grow, but rather determining the competitive advantage of any given company and, above all, the durability of that advantage.",
        letterReferences: [1991, 1993, 1996, 1999]
      },
      {
        period: "2002-2008",
        perspective: "Emphasized that technology and globalization were making many moats narrower or eliminating them entirely.",
        notableQuote: "A truly great business must have an enduring 'moat' that protects excellent returns on invested capital.",
        letterReferences: [2003, 2005, 2007]
      }
    ],
    
    risksAndLeverage: [
      {
        period: "1977-1989",
        perspective: "Conservative approach to risk, with emphasis on margin of safety and avoiding permanent capital loss.",
        notableQuote: "Risk comes from not knowing what you're doing.",
        letterReferences: [1980, 1984, 1987]
      },
      {
        period: "1990-2001",
        perspective: "Warned about derivatives risks and the dangers of complex financial instruments.",
        notableQuote: "In our view, however, derivatives are financial weapons of mass destruction, carrying dangers that, while now latent, are potentially lethal.",
        letterReferences: [1990, 1994, 1998, 2001]
      },
      {
        period: "2002-2008",
        perspective: "Increasingly concerned about systemic risks from leverage and interconnection in the financial system.",
        notableQuote: "When leverage works, it magnifies your gains. Your spouse thinks you're clever, and your neighbors get envious. But leverage is addictive. Once having profited from its wonders, very few people retreat to more conservative practices.",
        letterReferences: [2002, 2006, 2007, 2008]
      }
    ]
  },
  
  // Function to retrieve insights by topic across all years
  getInsightsByTopic: function(topic) {
    const insights = [];
    
    // Search through all letters for the specified topic
    for (let year = 1977; year <= 2008; year++) {
      const letter = this.lettersByYear[year];
      
      if (!letter || !letter.keyInsights) continue;
      
      // Find insights matching the topic
      const matchingInsights = letter.keyInsights.filter(insight => 
        insight.topic.toLowerCase().includes(topic.toLowerCase())
      );
      
      // Add matching insights with year reference
      matchingInsights.forEach(insight => {
        insights.push({
          year: year,
          topic: insight.topic,
          insight: insight.insight,
          context: insight.context
        });
      });
    }
    
    return insights;
  },
  
  // Function to retrieve all insights for a specific year
  getLetterHighlights: function(year) {
    const letter = this.lettersByYear[year];
    if (!letter) return null;
    
    return {
      year: year,
      keyInsights: letter.keyInsights,
      overallMessage: letter.letterHighlights.overallMessage,
      businessPerformance: letter.businessPerformance.overallResults.description,
      notableInvestments: letter.notableInvestments.map(inv => inv.company),
      economicContext: letter.economicContext,
      investmentLessons: letter.investmentLessons
    };
  },
  
  // Function to compare Buffett's approach across different time periods
  compareEras: function(era1, era2) {
    const firstEra = this.historicalEras.find(e => e.era.includes(era1));
    const secondEra = this.historicalEras.find(e => e.era.includes(era2));
    
    if (!firstEra || !secondEra) return null;
    
    return {
      comparison: {
        firstEra: firstEra.era,
        firstEraContext: firstEra.economicContext,
        firstEraFocus: firstEra.buffettFocus,
        
        secondEra: secondEra.era,
        secondEraContext: secondEra.economicContext,
        secondEraFocus: secondEra.buffettFocus,
        
        contrastsAndSimilarities: {
          economicEnvironment: `${firstEra.era} featured ${firstEra.economicContext} while ${secondEra.era} saw ${secondEra.economicContext}`,
          buffettApproach: `Buffett's focus shifted from ${firstEra.buffettFocus} to ${secondEra.buffettFocus}`,
          consistentPrinciples: "Despite changing economic environments, Buffett maintained his focus on business quality, management integrity, and fair prices across both periods."
        }
      }
    };
  },
  
  // Function to track evolution of a company's performance in Buffett's portfolio
  trackCompany: function(companyName) {
    const mentions = [];
    
    // Search through all letters for mentions of the company
    for (let year = 1977; year <= 2008; year++) {
      const letter = this.lettersByYear[year];
      
      if (!letter) continue;
      
      // Check for company in notableInvestments
      const investmentMention = letter.notableInvestments.find(inv => 
        inv.company.toLowerCase().includes(companyName.toLowerCase())
      );
      
      // Check for company in businessPerformance
      let performanceMention = null;
      for (const key in letter.businessPerformance) {
        const section = letter.businessPerformance[key];
        if (typeof section === 'object' && key.toLowerCase().includes(companyName.toLowerCase())) {
          performanceMention = section;
          break;
        }
      }
      
      // If found in either section, add to mentions
      if (investmentMention || performanceMention) {
        mentions.push({
          year: year,
          investmentDetails: investmentMention,
          performanceDetails: performanceMention,
          buffettComment: investmentMention ? investmentMention.buffettComment : 
                          (performanceMention && performanceMention.buffettComment ? 
                           performanceMention.buffettComment : null)
        });
      }
    }
    
    return mentions;
  },
  
  // Function to get business wisdom by industry category
  getIndustryInsights: function(industryCategory) {
    const category = this.businessCategoryInsights.find(cat => 
      cat.category.toLowerCase().includes(industryCategory.toLowerCase())
    );
    
    if (!category) return null;
    
    // Find all companies in this category across years
    const companies = new Set();
    for (let year = 1977; year <= 2008; year++) {
      const letter = this.lettersByYear[year];
      
      if (!letter || !letter.notableInvestments) continue;
      
      letter.notableInvestments.forEach(inv => {
        if (inv.industryCategory && inv.industryCategory.toLowerCase().includes(industryCategory.toLowerCase())) {
          companies.add(inv.company);
        }
      });
    }
    
    return {
      category: category.category,
      keyInsights: category.keyInsights,
      notableCompanies: [...companies],
      letterReferences: category.letterReferences
    };
  }
};

// Make available globally
window.buffettLettersUnified = buffettLettersUnified;
