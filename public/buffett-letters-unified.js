/**
 * Warren Buffett Letters Unified System
 * 
 * This file integrates all Warren Buffett annual letter modules (1977-1994)
 * into a single unified interface for easy access to Buffett's investment wisdom
 * and historical investment decisions.
 */

const buffettLettersUnified = {
  // Map of all letter modules by year
  letters: {},
  
  // Initialize the system
  initialize: function() {
    // Register all letter modules
    if (window.buffettLetter1977) this.letters[1977] = window.buffettLetter1977;
    if (window.buffettLetter1978) this.letters[1978] = window.buffettLetter1978;
    if (window.buffettLetter1979) this.letters[1979] = window.buffettLetter1979;
    if (window.buffettLetter1980) this.letters[1980] = window.buffettLetter1980;
    if (window.buffettLetter1981) this.letters[1981] = window.buffettLetter1981;
    if (window.buffettLetter1982) this.letters[1982] = window.buffettLetter1982;
    if (window.buffettLetter1983) this.letters[1983] = window.buffettLetter1983;
    if (window.buffettLetter1984) this.letters[1984] = window.buffettLetter1984;
    if (window.buffettLetter1985) this.letters[1985] = window.buffettLetter1985;
    if (window.buffettLetter1986) this.letters[1986] = window.buffettLetter1986;
    if (window.buffettLetter1987) this.letters[1987] = window.buffettLetter1987;
    if (window.buffettLetter1988) this.letters[1988] = window.buffettLetter1988;
    if (window.buffettLetter1989) this.letters[1989] = window.buffettLetter1989;
    if (window.buffettLetter1990) this.letters[1990] = window.buffettLetter1990;
    if (window.buffettLetter1991) this.letters[1991] = window.buffettLetter1991;
    if (window.buffettLetter1992) this.letters[1992] = window.buffettLetter1992;
    if (window.buffettLetter1993) this.letters[1993] = window.buffettLetter1993;
    if (window.buffettLetter1994) this.letters[1994] = window.buffettLetter1994;
    
    // Create indices for faster lookup
    this.buildIndices();
    
    console.log(`Buffett Letters Unified System initialized with ${Object.keys(this.letters).length} years of letters`);
    return true;
  },
  
  // Build search indices for efficient lookups
  buildIndices: function() {
    // Create topic index
    this.topicIndex = {};
    
    // Create company index
    this.companyIndex = {};
    
    // Create investment index (by year of acquisition)
    this.investmentIndex = {};
    
    // Process each letter
    for (const year in this.letters) {
      const letter = this.letters[year];
      
      // Index key insights by topic
      if (letter.keyInsights) {
        letter.keyInsights.forEach(insight => {
          if (!insight.topic) return;
          
          const topic = insight.topic.toLowerCase();
          if (!this.topicIndex[topic]) {
            this.topicIndex[topic] = [];
          }
          
          this.topicIndex[topic].push({
            year: letter.year,
            insight: insight.insight,
            context: insight.context || "",
            relevantCompanies: insight.relevantCompanies || []
          });
        });
      }
      
      // Index company mentions
      if (letter.notableInvestments) {
        letter.notableInvestments.forEach(investment => {
          if (!investment.company) return;
          
          const company = investment.company.toLowerCase();
          if (!this.companyIndex[company]) {
            this.companyIndex[company] = [];
          }
          
          this.companyIndex[company].push({
            year: letter.year,
            industry: investment.industryCategory || "",
            details: investment,
            buffettComment: investment.buffettComment || ""
          });
          
          // If this was an acquisition/initial investment year, add to investment index
          if (investment.acquisitionYear === parseInt(year) || 
              investment.investmentYear === parseInt(year) ||
              investment.investmentInitiation) {
            
            if (!this.investmentIndex[year]) {
              this.investmentIndex[year] = [];
            }
            
            this.investmentIndex[year].push({
              company: investment.company,
              industry: investment.industryCategory || "",
              details: investment
            });
          }
        });
      }
    }
  },
  
  // Get all insights by topic
  getInsightsByTopic: function(topic) {
    if (!topic) return [];
    
    const normalizedTopic = topic.toLowerCase();
    const results = [];
    
    // Check for exact topic match
    if (this.topicIndex[normalizedTopic]) {
      return this.topicIndex[normalizedTopic];
    }
    
    // Check for partial matches
    for (const indexedTopic in this.topicIndex) {
      if (indexedTopic.includes(normalizedTopic) || normalizedTopic.includes(indexedTopic)) {
        results.push(...this.topicIndex[indexedTopic]);
      }
    }
    
    return results;
  },
  
  // Get all mentions of a company across letters
  getCompanyMentions: function(company) {
    if (!company) return [];
    
    const normalizedCompany = company.toLowerCase();
    
    // Check for exact matches
    if (this.companyIndex[normalizedCompany]) {
      return this.companyIndex[normalizedCompany];
    }
    
    // Check for partial matches
    const results = [];
    for (const indexedCompany in this.companyIndex) {
      if (indexedCompany.includes(normalizedCompany) || normalizedCompany.includes(indexedCompany)) {
        results.push(...this.companyIndex[indexedCompany]);
      }
    }
    
    return results;
  },
  
  // Get investments made in a specific year
  getInvestmentsByYear: function(year) {
    if (!year) return [];
    
    return this.investmentIndex[year] || [];
  },
  
  // Get a random insight from a specific letter
  getRandomInsightFromYear: function(year) {
    if (!year || !this.letters[year] || !this.letters[year].keyInsights) return null;
    
    const insights = this.letters[year].keyInsights;
    if (insights.length === 0) return null;
    
    return insights[Math.floor(Math.random() * insights.length)];
  },
  
  // Get a random insight across all letters
  getRandomInsight: function() {
    // Get all available years
    const years = Object.keys(this.letters);
    if (years.length === 0) return null;
    
    // Pick a random year
    const randomYear = years[Math.floor(Math.random() * years.length)];
    
    return this.getRandomInsightFromYear(randomYear);
  },
  
  // Search for insights containing a specific keyword
  searchInsights: function(keyword) {
    if (!keyword) return [];
    
    const normalizedKeyword = keyword.toLowerCase();
    const results = [];
    
    // Search through all letters
    for (const year in this.letters) {
      const letter = this.letters[year];
      
      if (letter.keyInsights) {
        letter.keyInsights.forEach(insight => {
          if (insight.insight && insight.insight.toLowerCase().includes(normalizedKeyword) ||
              insight.topic && insight.topic.toLowerCase().includes(normalizedKeyword) ||
              insight.context && insight.context.toLowerCase().includes(normalizedKeyword)) {
            
            results.push({
              year: letter.year,
              topic: insight.topic || "",
              insight: insight.insight,
              context: insight.context || ""
            });
          }
        });
      }
    }
    
    return results;
  },
  
  // Get financial context for a specific year
  getEconomicContext: function(year) {
    if (!year || !this.letters[year]) return null;
    
    return this.letters[year].economicContext || null;
  },
  
  // Get Buffett's comments on a specific company
  getBuffettCommentsOnCompany: function(company) {
    if (!company) return [];
    
    const mentions = this.getCompanyMentions(company);
    
    return mentions.map(mention => ({
      year: mention.year,
      comment: mention.buffettComment,
      company: mention.details.company
    })).filter(item => item.comment && item.comment.trim() !== "");
  },
  
  // Get insights on a specific business model characteristic
  getInsightsOnBusinessCharacteristic: function(characteristic) {
    const relatedTopics = {
      'pricing power': ['pricing power', 'pricing', 'price', 'inflation'],
      'competitive advantage': ['competitive advantage', 'moat', 'moats', 'competitive', 'advantages'],
      'capital allocation': ['capital allocation', 'allocation', 'capital', 'reinvestment'],
      'management quality': ['management', 'managers', 'ceo', 'executives'],
      'return on capital': ['return on capital', 'roc', 'roic', 'returns', 'return on equity', 'roe'],
      'growth': ['growth', 'expansion', 'growing'],
      'risk': ['risk', 'uncertainty', 'downside', 'loss'],
      'valuation': ['valuation', 'intrinsic value', 'price', 'value', 'undervalued', 'overvalued'],
      'industry economics': ['industry', 'economics', 'market structure', 'competition']
    };
    
    const characteristicLower = characteristic.toLowerCase();
    let searchTerms = [];
    
    // Find related search terms
    for (const topic in relatedTopics) {
      if (topic === characteristicLower || relatedTopics[topic].includes(characteristicLower)) {
        searchTerms = [...searchTerms, ...relatedTopics[topic]];
      }
    }
    
    // If no related terms found, just use the original characteristic
    if (searchTerms.length === 0) {
      searchTerms = [characteristicLower];
    }
    
    // Search for insights using all related terms
    const results = [];
    searchTerms.forEach(term => {
      const insights = this.searchInsights(term);
      results.push(...insights);
    });
    
    // Remove duplicates
    const uniqueResults = [];
    const seen = new Set();
    
    results.forEach(insight => {
      const key = `${insight.year}-${insight.insight}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(insight);
      }
    });
    
    return uniqueResults;
  },
  
  // Get investment metrics for a company at time of purchase
  getInvestmentMetricsAtPurchase: function(company) {
    if (!company) return null;
    
    const mentions = this.getCompanyMentions(company);
    
    // Look for acquisition details
    for (const mention of mentions) {
      if (mention.details) {
        const details = mention.details;
        
        if (details.metricsAtPurchase) {
          return {
            company: details.company,
            year: mention.year,
            metrics: details.metricsAtPurchase,
            price: details.purchasePrice || null,
            buffettComment: details.buffettComment || null
          };
        }
        
        // Some entries have metrics in different formats
        if (details.purchaseDetails && typeof details.purchaseDetails === 'string') {
          return {
            company: details.company,
            year: mention.year,
            description: details.purchaseDetails,
            price: details.purchasePrice || null,
            buffettComment: details.buffettComment || null
          };
        }
      }
    }
    
    return null;
  },
  
  // Extract investment lessons from a specific letter
  getInvestmentLessons: function(year) {
    if (!year || !this.letters[year]) return [];
    
    return this.letters[year].investmentLessons || [];
  },
  
  // Get all investment lessons across letters
  getAllInvestmentLessons: function() {
    const allLessons = [];
    
    for (const year in this.letters) {
      const lessons = this.getInvestmentLessons(year);
      lessons.forEach(lesson => {
        allLessons.push({
          year: parseInt(year),
          lesson: lesson
        });
      });
    }
    
    return allLessons;
  },
  
  // Get business performance metrics for a specific company by year
  getBusinessPerformanceByYear: function(company, year) {
    if (!company || !year || !this.letters[year]) return null;
    
    const letter = this.letters[year];
    if (!letter.businessPerformance) return null;
    
    // Handle common names with slight variations
    const companyLower = company.toLowerCase();
    const nameVariations = {
      'see\'s': ['see\'s', 'sees', 'see\'s candy', 'sees candy', 'see\'s candies', 'sees candies'],
      'nebraska furniture mart': ['nebraska furniture mart', 'nfm', 'furniture mart'],
      'buffalo evening news': ['buffalo evening news', 'buffalo news', 'the news'],
      'geico': ['geico', 'government employees insurance'],
      'scott fetzer': ['scott fetzer', 'scott & fetzer', 'scott and fetzer'],
      'dexter shoe': ['dexter shoe', 'dexter', 'dexter shoes'],
      'h.h. brown': ['h.h. brown', 'h h brown', 'hh brown', 'h. h. brown']
    };
    
    // Find the right property in businessPerformance
    for (const propertyName in letter.businessPerformance) {
      // Check direct match
      if (propertyName.toLowerCase().includes(companyLower)) {
        return letter.businessPerformance[propertyName];
      }
      
      // Check name variations
      for (const standardName in nameVariations) {
        if (nameVariations[standardName].includes(companyLower) && 
            propertyName.toLowerCase().includes(standardName) || 
            nameVariations[standardName].some(variation => propertyName.toLowerCase().includes(variation))) {
          return letter.businessPerformance[propertyName];
        }
      }
    }
    
    return null;
  },
  
  // Format a financial insight for user-friendly display
  formatInsight: function(insight) {
    if (!insight) return "";
    
    return `**Warren Buffett (${insight.year})** on ${insight.topic || 'investing'}: "${insight.insight}"`;
  }
};

// Initialize and make globally available
document.addEventListener('DOMContentLoaded', function() {
  buffettLettersUnified.initialize();
  window.buffettLettersUnified = buffettLettersUnified;
});
