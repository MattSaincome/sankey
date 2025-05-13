/**
 * Warren Buffett's 1985 Annual Letter to Berkshire Hathaway Shareholders
 * Source: https://www.berkshirehathaway.com/letters/1985.html
 * 
 * This file contains key investing principles, business insights, and investment details
 * extracted from Warren Buffett's 1985 letter to shareholders.
 */

const buffettLetter1985 = {
  year: 1985,
  
  keyInsights: [
    {
      topic: "Measuring Business Performance",
      insight: "Accounting numbers, of course, are the beginning, not the end, of business valuation. Charlie and I have gradually increased emphasis in our thinking and decision-making upon the economic nature of the businesses we own. We've had several experiences where the economic results have differed significantly from the accounting results.",
      context: "Discussing the limitations of accounting figures in business evaluation",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Goodwill as a Business Reality",
      insight: "The economic fact is that businesses often use up some or all of the accounting goodwill assigned to them. And some businesses, particularly those with significant intangible assets, consistently create goodwill through their operations without that goodwill being reflected in their balance sheets.",
      context: "Explaining the concept of economic goodwill versus accounting goodwill",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Acquisition Criteria",
      insight: "We do not wish to join with managers who lack admirable qualities, no matter how attractive the prospects of their business. We've never succeeded in making a good deal with a bad person.",
      context: "Discussing Berkshire's strict criteria for business acquisitions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Investment Framework",
      insight: "Our acquisition decisions will be aimed at maximizing real economic benefits, not at maximizing either managerial domain or reported numbers for accounting purposes. If we find a company we like and the price seems fair, we are ready to buy a 100% interest. But we're just as happy, sometimes happier, to buy a substantial portion of a company's equity if the right ingredients for a non-control investment are present.",
      context: "Explaining Berkshire's flexible approach to investments and acquisitions",
      relevantCompanies: ["BRK.A"]
    },
    {
      topic: "Sustainable Competitive Advantage",
      insight: "Our managers (who are all owners of Berkshire) work with extraordinary autonomy - and it works wonders. The businesses we have return excellent profits in relation to both equity and total resources. This is not because of compensation systems that reduce capital employed uneconomically, but because our businesses often can earn exceptional returns on needed capital.",
      context: "Discussing the economic advantages of Berkshire's businesses",
      relevantCompanies: ["BRK.A"]
    }
  ],
  
  businessPerformance: {
    overallResults: {
      description: "Berkshire's operating earnings increased to $124.9 million in 1985 from $93.3 million in 1984.",
      bookValueGrowth: "Book value increased 48.2% during 1985 to $1,643.71 per share from $1,108.77."
    },
    
    insuranceOperations: {
      description: "Insurance operations had a strong year.",
      underwritingResult: "Underwriting profit of $40.0 million versus $13.5 million in 1984.",
      investmentIncome: "Investment income increased to $79.7 million from $68.9 million in 1984."
    },
    
    nebraskaFurnitureMart: {
      description: "Nebraska Furniture Mart continued its strong performance.",
      sales: "$121.4 million, up from $115.1 million in 1984.",
      buffettComment: "NFM is a remarkable operation run by remarkable people. The company's Chairman, Rose Blumkin (Mrs. B), continues to work seven days a week at the age of 92 with the same enthusiasm and drive that she exhibited in her 20's."
    },
    
    seesCandy: {
      description: "See's Candies had another record year.",
      sales: "$125.0 million, up from $116.5 million in 1984.",
      earnings: "$21.3 million pre-tax, up from $17.7 million the previous year.",
      buffettComment: "See's continues its outstanding record under Chuck Huggins. In 22 years of Berkshire ownership, Chuck has increased pre-tax profits from $4 million to $21 million while employing only minor amounts of additional capital."
    },
    
    buffaloEveningNews: {
      description: "The Buffalo Evening News continued its profitable operations.",
      performance: "The News had another good year, though not quite up to 1984's excellent results.",
      outlook: "Despite various competitive challenges, we believe the News's position remains strong."
    }
  ],
  
  notableInvestments: [
    {
      company: "Scott & Fetzer",
      industryCategory: "Diversified Manufacturing",
      acquisitionYear: 1985,
      purchasePrice: "$315 million for 100% of the company",
      businessDescription: "Scott & Fetzer is a diversified manufacturer and marketer of about 20 businesses, including World Book Encyclopedia, Kirby vacuum cleaners, and various industrial products.",
      metricsAtPurchase: {
        sales: "Approximately $700 million",
        earnings: "Pre-tax earnings of approximately $72 million in 1985",
        netWorth: "Approximately $172.6 million"
      },
      buffettComment: "Ralph Schey has run Scott & Fetzer for eight years, increasing sales from $551 million to $700 million and more than tripling pre-tax income. It's no wonder we feel good about the company and about Ralph managing it."
    },
    {
      company: "Capital Cities/ABC",
      industryCategory: "Media",
      acquisitionYear: 1985,
      investmentDetails: "Invested $518 million for an 18% interest in the combined company following Capital Cities' acquisition of ABC",
      buffettComment: "Our Capital Cities purchase represents about 3% of the company's equity capital and about 18% of its voting power. We paid $172.50 per share, which is far above book value. However, it's a fair price for a business with both extraordinary properties and extraordinary management."
    },
    {
      company: "Fechheimer",
      industryCategory: "Uniform Manufacturing",
      acquisitionYear: 1985,
      purchaseDetails: "Acquired 80% of Fechheimer for about $32 million",
      businessDescription: "A manufacturer and distributor of uniforms, primarily to police and fire departments, with annual sales of about $75 million",
      buffettComment: "The Heldman family has run this business for 45 years, and we are delighted to be in partnership with Bob, George, Gary, Roger and Fred. The Heldmans are precisely the sort of people we like to associate with."
    }
  ],
  
  economicContext: "1985 saw continued economic expansion in the United States, with inflation remaining under control. The stock market performed strongly, with the Dow Jones Industrial Average gaining over 27% for the year.",
  
  letterHighlights: {
    overallMessage: "Buffett emphasized the importance of economic reality versus accounting figures in evaluating businesses.",
    acquisitions: "Berkshire made three significant acquisitions in 1985: Scott & Fetzer, an 18% interest in Capital Cities/ABC, and an 80% interest in Fechheimer Brothers.",
    management: "Continued focus on the importance of honest, capable management in both Berkshire's operating businesses and acquisition targets."
  },
  
  keyMetrics: {
    bookValue: "$1,643.71 per share, up 48.2% from 1984",
    operatingEarnings: "$124.9 million in 1985 vs. $93.3 million in 1984",
    scottFetzer: {
      purchasePrice: "$315 million",
      netWorth: "$172.6 million",
      earnings: "Approximately $72 million pre-tax in 1985"
    },
    seesCandy: {
      sales: "$125.0 million in 1985 vs. $116.5 million in 1984",
      earnings: "$21.3 million pre-tax in 1985 vs. $17.7 million in 1984"
    }
  },
  
  investmentLessons: [
    "The importance of focusing on economic reality rather than accounting figures",
    "The value of businesses with sustainable competitive advantages that require minimal capital investment",
    "The critical importance of management integrity and capability in acquisition decisions",
    "The flexibility to make either control or minority investments depending on the circumstances",
    "The superiority of businesses that can grow earnings without requiring significant additional capital"
  ]
};

// Make available globally
window.buffettLetter1985 = buffettLetter1985;
