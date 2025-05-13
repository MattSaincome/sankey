/**
 * Warren Buffett's 2006 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/2006.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 2006 letter to shareholders.
 */

const buffettLetter2006 = {
  year: 2006,
  
  keyInsights: [
    {
      topic: "Succession Planning",
      insight: "As owners, you are naturally concerned about whether the person who succeeds me as CEO will have the ability to manage Berkshire's many and diverse businesses. But you should be more worried about my health than about my successor. I've reluctantly discarded the notion of my continuing to manage the enterprise until my well-earned 100th birthday. Berkshire's board has fully discussed each of the three CEO candidates and has unanimously agreed on the person who should succeed me if a replacement were needed today.",
      context: "Addressing investor concerns about Berkshire's future leadership",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Insurance Discipline",
      insight: "The big unknown is super-cat insurance. Were the terrible hurricane seasons of 2004-05 aberrations? Or were they the start of a new and more costly era for insurers? We don't know the answer. What we do know is that we have the financial strength to handle a $100 billion industry super-cat, even if it occurs in the near future. When a mega-catastrophe strikes, Berkshire will get its share of the losses and they will be big. Unlike many other insurers, however, we will be looking to add business the next day.",
      context: "Explaining Berkshire's approach to catastrophe insurance following the active 2004-05 hurricane seasons",
      relevantCompanies: ["BRK.A", "GRE"]
    },
    {
      topic: "Investor Expectations",
      insight: "Beware the investment activity that produces applause; the great moves are usually greeted by yawns. You simply cannot get the kind of results we have historically achieved by accepting mediocre returns during good times and experiencing disasters during bad times. It's possible that we will have a blow-up at some point. But our investment managers are more averse to losing money than to missing opportunities.",
      context: "Cautioning investors about the challenges of maintaining Berkshire's historical performance",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Private Equity",
      insight: "The problem with LBOs (leveraged buyouts) isn't that they are bad per se, but that they have the potential to be addictive, producing hangovers of epic proportions. When an LBO is done, the acquirer explains the acquisition with soothing words like 'free cash flow,' 'EBITDA coverage,' and 'exit strategy.' When the cycle enters its down phase, these essentially meaningless terms are replaced by 'Chapter 11' and 'bankruptcy.'",
      context: "Warning about excessive debt in private equity transactions during a period of high activity",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Principles",
      insight: "Our long-avowed goal is to be the 'buyer of choice' for businesses – particularly those built and owned by families. The way to achieve this goal is to deserve it. That means we must keep our promises; avoid leveraging up acquired businesses; grant unusual autonomy to our managers; and hold the purchased companies through thick and thin (though we will sell a few of them occasionally when we are offered extraordinary prices).",
      context: "Summarizing Berkshire's approach to acquiring and managing businesses",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's performance in 2006 was exceptional, with strong results across most business segments.",
      bookValueGrowth: "Book value increased 18.4% during 2006 to $70,281 per share from $59,377.",
      operatingEarnings: "$11.0 billion in 2006, up from $5.6 billion in 2005."
    },
    
    insuranceOperations: {
      description: "Insurance operations had an outstanding year with minimal catastrophe losses and strong premium growth.",
      underwritingResult: "Underwriting profit of $3.8 billion, compared to a loss of $1.07 billion in 2005.",
      investmentIncome: "Investment income increased to $4.3 billion from $3.48 billion in 2005.",
      float: "Insurance float grew to approximately $50.9 billion at year-end 2006 from $49.3 billion at year-end 2005.",
      buffettComment: "Our insurance business was terrific in 2006 – all major units did well – and covered our normal catastrophe exposures with room to spare. Our managers focus on underwriting discipline rather than premium volume and are willing to walk away from business when appropriate pricing is unavailable. That's important because having a profitable insurance operation requires saying 'no' to a lot of business."
    },
    
    geico: {
      description: "GEICO continued its exceptional growth and profitability.",
      policyGrowth: "Voluntary auto policies grew by 7.9% in 2006.",
      marketShare: "About 9.1% of the personal auto insurance market, up from 8.5% in 2005.",
      buffettComment: "GEICO is on a roll, with growth and profitability at record levels. Tony Nicely took over the leadership of GEICO in 1993, and since then the company has been transformed. When I get back to the office I plan to designate a special wing of our Hall of Fame for him. In 2006, GEICO's voluntary auto policies in force grew by 7.9%, and the company moved from 4th to 3rd place among U.S. auto insurers."
    },
    
    utilityBusinesses: {
      description: "Berkshire's utility operations performed well, with MidAmerican making additional acquisitions.",
      performance: "MidAmerican earned $1.1 billion in 2006, up from $889 million in 2005.",
      pge: "Acquired PacifiCorp in March 2006, significantly expanding Berkshire's utility operations.",
      buffettComment: "Dave Sokol and Greg Abel continue to do an extraordinary job in managing our utility operations. They have delivered on all of the promises they made when we purchased MidAmerican in 2000, and have found many ways to grow the business that weren't contemplated at the time."
    },
    
    manufacturingServiceRetail: {
      description: "Manufacturing, service and retail operations delivered excellent results.",
      earnings: "Pre-tax earnings of $4.1 billion, up from $3.5 billion in 2005.",
      buffettComment: "Our non-insurance businesses delivered an excellent performance in 2006. Beyond the figures, what's important is that most of our managers are sizably wealthier than they need to be, yet continue to work with enthusiasm and imagination. They do so because they love their businesses, not because they need the money."
    },
    
    seesCandy: {
      description: "See's Candies continued to deliver excellent results.",
      sales: "$383 million, up 14.0% from $336 million in 2005.",
      earnings: "$82 million pre-tax, up 13.9% from $72 million in 2005.",
      buffettComment: "See's continues to be a dream business. We purchased it for $25 million in 1972, and it has now delivered more than $1.35 billion of pre-tax earnings to Berkshire. Brad Kinstler took over as CEO in 2006 and has done an extraordinary job of maintaining the quality and service that has made See's a California institution."
    }
  },
  
  notableInvestments: [
    {
      company: "ISCAR",
      industryCategory: "Manufacturing/Industrial Tools",
      acquisitionYear: 2006,
      purchasePrice: "$4.0 billion for 80% of the company",
      businessDescription: "World-leading manufacturer of precision carbide cutting tools used in metalworking",
      metricsAtPurchase: {
        global: "Operations in over 60 countries",
        marketPosition: "Second largest manufacturer of metal cutting tools in the world",
        technology: "Industry leader in product innovation and precision manufacturing"
      },
      buffettComment: "ISCAR's performance since our purchase has far exceeded my expectations. Eitan Wertheimer and Jacob Harpaz are brilliant leaders who have built a business that excels in every aspect of machine tool marketing, manufacturing, and innovation. The company's growth potential is unlimited, and its management team is as good as it gets."
    },
    {
      company: "Business Wire",
      industryCategory: "Media/Information Services",
      performanceUpdate: "Excellent first full year as a Berkshire subsidiary.",
      buffettComment: "Cathy Baron Tamraz has done a terrific job of maintaining Business Wire's leadership position in corporate news distribution while finding new ways to grow the business. The company fits perfectly into the Berkshire model and should remain a leader in its field for decades to come."
    },
    {
      company: "Russell",
      industryCategory: "Apparel/Sporting Goods",
      acquisitionYear: 2006,
      purchasePrice: "$600 million",
      businessDescription: "Leading manufacturer and marketer of athletic uniforms, apparel, and sporting goods",
      metricsAtPurchase: {
        history: "Founded in 1902, with deep heritage in athletic apparel",
        marketPosition: "Leader in team uniforms and sporting goods",
        distribution: "Products sold in more than 100 countries worldwide"
      },
      buffettComment: "John Holland, who heads Fruit of the Loom, will now also supervise Russell's operations. The combination of these two companies gives us a strong presence in basic apparel and should lead to significant cost savings and other synergies."
    },
    {
      company: "TTI, Inc.",
      industryCategory: "Electronics Distribution",
      acquisitionYear: 2006,
      purchasePrice: "Not disclosed",
      businessDescription: "Leading specialist distributor of passive, interconnect, and electromechanical electronic components",
      metricsAtPurchase: {
        global: "Operations in 50 locations across North America, Europe, and Asia",
        inventory: "Over 400,000 different electronic components in stock",
        customers: "Over 100,000 customers worldwide"
      },
      buffettComment: "Paul Andrews has built TTI into a distributor of electronic components that's known throughout the industry for its extraordinary service, depth of inventory, and technical expertise. The company has grown consistently through both good and bad economic environments, and I expect that performance to continue under Berkshire's ownership."
    }
  ],
  
  economicContext: "2006 saw continued economic growth in the United States, with GDP growing at about 2.7%. The housing market began to cool after years of rapid price appreciation, though the full extent of housing problems had not yet emerged. The stock market performed well, with the S&P 500 gaining 15.8% for the year. Energy prices remained elevated but volatile. The Federal Reserve continued its cycle of interest rate increases, with the federal funds rate peaking at 5.25% in June before holding steady for the remainder of the year.",
  
  letterHighlights: {
    overallMessage: "Buffett expressed satisfaction with Berkshire's exceptional performance across all major business segments while directly addressing succession planning concerns.",
    successionPlanning: "Provided reassurance that Berkshire's board has identified three potential CEO successors and has unanimously agreed on who would take over if a replacement were needed immediately.",
    privateBubbleWarning: "Warned about excessive debt and inflated prices in private equity transactions, suggesting that many deals would eventually lead to significant problems."
  },
  
  keyMetrics: {
    bookValue: "$70,281 per share, up 18.4% from 2005",
    operatingEarnings: "$11.0 billion in 2006 vs. $5.6 billion in 2005",
    seesCandy: {
      sales: "$383 million in 2006 vs. $336 million in 2005",
      earnings: "$82 million pre-tax in 2006 vs. $72 million in 2005"
    },
    geico: {
      policiesInForce: "7.9% growth in 2006",
      marketShare: "9.1% of the personal auto insurance market"
    }
  },
  
  investmentLessons: [
    "The importance of succession planning, even in a successful and diverse enterprise",
    "The value of maintaining underwriting discipline in insurance, even if it means sacrificing premium volume",
    "The dangers of excessive leverage in private equity transactions during periods of easy credit",
    "The benefits of being a 'buyer of choice' for business owners through maintaining a sterling reputation",
    "The importance of acquiring businesses with excellent managers who work from passion rather than financial necessity"
  ]
};

// Make available globally
window.buffettLetter2006 = buffettLetter2006;
