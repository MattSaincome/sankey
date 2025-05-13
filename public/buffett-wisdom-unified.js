/**
 * Unified Buffett-Munger Wisdom Access System
 * 
 * This file integrates all Buffett-Munger wisdom sources into a single
 * interface that makes it easy to retrieve relevant investing wisdom
 * based on company, topic, or financial metrics.
 * 
 * The system focuses on providing contextual, high-value insights rather than
 * overwhelming data, helping users benefit from Buffett and Munger's most
 * relevant wisdom for their specific investment analysis.
 */

const buffettWisdomUnified = {
  // Integration with all Buffett wisdom sources
  // Track quotes already used in the current conversation to avoid repetition
  usedQuotesInCurrentConversation: new Set(),
  
  // Initialize the wisdom system
  initialize: function() {
    // Reset the conversation tracking on initialization
    this.usedQuotesInCurrentConversation = new Set();
    
    // Verify that all required wisdom modules are loaded
    const requiredModules = [
      'buffettMungerWisdom',
      'buffettAnnualLetters',
      'buffettAnnualLetters2',
      'buffettAnnualLetters3',
      'buffettLettersUnified'
    ];
    
    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
      console.error("Missing Buffett wisdom modules:", missingModules.join(', '));
      return false;
    }
    
    console.log("Buffett Wisdom Unified System initialized successfully");
    return true;
  },
  
  // Reset the conversation tracking (called when starting a new conversation)
  resetConversation: function() {
    this.usedQuotesInCurrentConversation = new Set();
    console.log("Reset conversation quote tracking");
  },
  
  // Get company-specific investment wisdom (from direct Berkshire investments)
  getCompanyWisdom: function(ticker) {
    if (!ticker) return null;
    
    // Check our quotable wisdom database first
    const investmentWisdom = window.buffettMungerWisdom.getInvestmentWisdom(ticker);
    if (investmentWisdom) {
      return investmentWisdom;
    }
    
    // No direct investment wisdom found
    return null;
  },
  
  // Get insights from annual letters by topic - now including the complete unified system
  getLetterInsightsByTopic: function(topic) {
    if (!topic) return [];
    
    let allInsights = [];
    
    // First try the unified letters system (1977-2008) which is most comprehensive
    if (window.buffettLettersUnified) {
      try {
        const unifiedInsights = window.buffettLettersUnified.getInsightsByTopic(topic);
        if (unifiedInsights && unifiedInsights.length > 0) {
          allInsights = allInsights.concat(unifiedInsights);
        }
      } catch (err) {
        console.warn("Error accessing unified letters system:", err);
      }
    }
    
    // Add insights from other letter collections to supplement
    if (window.buffettAnnualLetters) {
      const recentInsights = window.buffettAnnualLetters.getInsightsByTopic(topic);
      allInsights = allInsights.concat(recentInsights);
    }
    
    if (window.buffettAnnualLetters2) {
      const previousInsights = window.buffettAnnualLetters2.getInsightsByTopic(topic);
      allInsights = allInsights.concat(previousInsights);
    }
    
    if (window.buffettAnnualLetters3) {
      const crisisInsights = window.buffettAnnualLetters3.getInsightsByTopic(topic);
      allInsights = allInsights.concat(crisisInsights);
    }
    
    // Sort by year (most recent first) and remove duplicates
    allInsights.sort((a, b) => b.year - a.year);
    
    // Remove duplicates by creating a map keyed by content
    const uniqueInsights = Array.from(
      new Map(allInsights.map(insight => [insight.insight, insight])).values()
    );
    
    return uniqueInsights;
  },
  
  // Get quotes by investing topic or concept
  getQuotesByTopic: function(topic) {
    if (!topic) return [];
    
    return window.buffettMungerWisdom.getQuotesByTopic(topic);
  },
  
  // Get random wisdom about investing principles
  getRandomWisdom: function() {
    const sources = [
      // Original quotes
      () => { 
        const quotes = window.buffettMungerWisdom.getAllQuotes();
        if (quotes.length === 0) return null;
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return {
          type: 'quote',
          content: randomQuote.quote,
          author: randomQuote.author,
          source: randomQuote.source,
          topic: randomQuote.topic || 'investing'
        };
      },
      
      // Letter insights
      () => {
        // Get a list of all topics we can find insights for
        const topicSets = [
          window.buffettAnnualLetters ? window.buffettAnnualLetters.getAllTopics() : [],
          window.buffettAnnualLetters2 ? window.buffettAnnualLetters2.getAllTopics() : [],
          window.buffettAnnualLetters3 ? window.buffettAnnualLetters3.getAllTopics() : []
        ];
        
        const allTopics = [].concat(...topicSets);
        if (allTopics.length === 0) return null;
        
        const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
        
        // Get insights for this topic
        const insights = this.getLetterInsightsByTopic(randomTopic);
        if (insights.length === 0) return null;
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        return {
          type: 'letter_insight',
          content: randomInsight.insight,
          year: randomInsight.year,
          topic: randomTopic
        };
      }
    ];
    
    // Try each source until we get a non-null result
    for (let i = 0; i < sources.length; i++) {
      const wisdom = sources[i]();
      if (wisdom) return wisdom;
    }
    
    // Fallback if all sources failed
    return {
      type: 'quote',
      content: "Be fearful when others are greedy, and greedy when others are fearful.",
      author: "Warren Buffett",
      source: "Shareholder Letter",
      topic: "market psychology"
    };
  },
  
  // Get wisdom relevant to a specific financial analysis, with enhanced context
  getWisdomForFinancialAnalysis: function(metrics, companyName) {
    if (!metrics) return [];
    
    const results = [];
    
    // Check for specific metrics and add relevant wisdom with explicit transitions
    
    // P/E Ratio
    if (metrics.pe !== undefined) {
      let peWisdom = null;
      const peValue = metrics.pe.toFixed(2);
      
      // High P/E
      if (metrics.pe > 20) {
        peWisdom = {
          type: 'metric_insight',
          content: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
          author: "Warren Buffett",
          source: "1989 Shareholder Letter",
          topic: "valuation",
          metricContext: `Looking at the P/E ratio of ${peValue}`,
          transitionText: `This P/E ratio of ${peValue} is relatively high. When evaluating premium-priced companies like this, Buffett cautions:`
        };
      }
      // Moderate P/E
      else if (metrics.pe >= 10 && metrics.pe <= 20) {
        peWisdom = {
          type: 'metric_insight',
          content: "The best business returns are usually achieved by companies that are doing something quite similar today to what they were doing five or ten years ago.",
          author: "Warren Buffett",
          source: "1992 Shareholder Letter",
          topic: "business consistency",
          metricContext: `With a moderate P/E ratio of ${peValue}`,
          transitionText: `With a P/E ratio of ${peValue}, which is in the moderate range, it's worth considering Buffett's perspective on sustainable business models:`
        };
      }
      // Low P/E
      else if (metrics.pe < 10) {
        peWisdom = {
          type: 'metric_insight',
          content: "Price is what you pay. Value is what you get.",
          author: "Warren Buffett",
          source: "2008 Shareholder Letter",
          topic: "valuation",
          metricContext: `With a low P/E ratio of ${peValue}`,
          transitionText: `With a P/E ratio of ${peValue}, which appears relatively low, it's important to remember Buffett's distinction:`
        };
      }
      
      if (peWisdom) results.push(peWisdom);
    }
    
    // Return on Equity
    if (metrics.roe !== undefined) {
      let roeWisdom = null;
      const roeValue = metrics.roe.toFixed(2);
      
      // High ROE
      if (metrics.roe > 15) {
        roeWisdom = {
          type: 'metric_insight',
          content: "The best business to own is one that over an extended period can employ large amounts of incremental capital at very high rates of return.",
          author: "Warren Buffett",
          source: "1992 Shareholder Letter",
          topic: "return on equity",
          metricContext: `Looking at the impressive ROE of ${roeValue}%`,
          transitionText: `The return on equity of ${roeValue}% is quite strong. Buffett particularly values high ROE businesses:`
        };
      }
      // Moderate ROE
      else if (metrics.roe >= 10 && metrics.roe <= 15) {
        roeWisdom = {
          type: 'metric_insight',
          content: "It's better to have a partial interest in the Hope diamond than to own all of a rhinestone.",
          author: "Warren Buffett",
          source: "1996 Shareholder Letter",
          topic: "business quality",
          metricContext: `With a solid ROE of ${roeValue}%`,
          transitionText: `With a respectable ROE of ${roeValue}%, this company shows reasonable capital efficiency. As Buffett explains:`
        };
      }
      // Low ROE
      else if (metrics.roe < 10) {
        roeWisdom = {
          type: 'metric_insight',
          content: "When a management with a reputation for brilliance tackles a business with a reputation for bad economics, it is the reputation of the business that remains intact.",
          author: "Warren Buffett",
          source: "1989 Shareholder Letter",
          topic: "business economics",
          metricContext: `Regarding the low ROE of ${roeValue}%`,
          transitionText: `The return on equity of ${roeValue}% is relatively low, which raises questions about the business economics. Buffett is quite clear on this point:`
        };
      }
      
      if (roeWisdom) results.push(roeWisdom);
    }
    
    // Debt to Equity
    if (metrics.debtToEquity !== undefined) {
      let debtWisdom = null;
      const debtValue = metrics.debtToEquity.toFixed(2);
      
      // High Debt
      if (metrics.debtToEquity > 1.0) {
        debtWisdom = {
          type: 'metric_insight',
          content: "We never want to count on the kindness of strangers in order to meet tomorrow's obligations.",
          author: "Warren Buffett",
          source: "2008 Shareholder Letter",
          topic: "debt",
          metricContext: `Regarding the high debt-to-equity ratio of ${debtValue}`,
          transitionText: `The debt-to-equity ratio of ${debtValue} indicates significant leverage. Buffett is typically cautious about high debt levels:`
        };
      }
      // Moderate Debt
      else if (metrics.debtToEquity >= 0.3 && metrics.debtToEquity <= 1.0) {
        debtWisdom = {
          type: 'metric_insight',
          content: "The most important thing to do when you find yourself in a hole is to stop digging.",
          author: "Warren Buffett",
          source: "Various Interviews",
          topic: "capital discipline",
          metricContext: `With a moderate debt-to-equity of ${debtValue}`,
          transitionText: `The debt-to-equity ratio of ${debtValue} is moderate. When thinking about financial leverage, Buffett often emphasizes prudence:`
        };
      }
      // Low Debt
      else if (metrics.debtToEquity < 0.3) {
        debtWisdom = {
          type: 'metric_insight',
          content: "A good business generates more cash than it consumes. We prefer companies that can fund their own growth without excessive debt.",
          author: "Warren Buffett",
          source: "Various Letters",
          topic: "capital allocation",
          metricContext: `Looking at the conservative debt-to-equity ratio of ${debtValue}`,
          transitionText: `The debt-to-equity ratio of ${debtValue} is quite conservative. This aligns with Buffett's preference for financially strong companies:`
        };
      }
      
      if (debtWisdom) results.push(debtWisdom);
    }
    
    // Free Cash Flow
    if (metrics.fcfMargin !== undefined) {
      let fcfWisdom = null;
      const fcfValue = metrics.fcfMargin.toFixed(2);
      
      // Strong FCF
      if (metrics.fcfMargin > 10) {
        fcfWisdom = {
          type: 'metric_insight',
          content: "The primary test of managerial economic performance is the achievement of a high earnings rate on equity capital employed and not the achievement of consistent gains in earnings per share.",
          author: "Warren Buffett",
          source: "1979 Shareholder Letter",
          topic: "cash flow",
          metricContext: `Regarding the strong free cash flow margin of ${fcfValue}%`,
          transitionText: `The free cash flow margin of ${fcfValue}% is impressive. Buffett places high value on businesses that generate substantial free cash flow:`
        };
      }
      // Low FCF
      else if (metrics.fcfMargin < 5) {
        fcfWisdom = {
          type: 'metric_insight',
          content: "Owner earnings represent the real economic earnings of a business, not the accounting earnings. These are the cash flows available to owners after all necessary expenses and reinvestment needs.",
          author: "Warren Buffett",
          source: "1986 Shareholder Letter",
          topic: "cash flow",
          metricContext: `Looking at the limited free cash flow margin of ${fcfValue}%`,
          transitionText: `The free cash flow margin of ${fcfValue}% is relatively low. When evaluating cash generation capacity, Buffett focuses on what he calls 'owner earnings':`
        };
      }
      
      if (fcfWisdom) results.push(fcfWisdom);
    }
    
    // Gross Margin
    if (metrics.grossMargin !== undefined) {
      let marginWisdom = null;
      const marginValue = metrics.grossMargin.toFixed(2);
      
      // High Margins
      if (metrics.grossMargin > 40) {
        marginWisdom = {
          type: 'metric_insight',
          content: "The single most important decision in evaluating a business is pricing power. If you've got the power to raise prices without losing business to a competitor, you've got a very good business.",
          author: "Warren Buffett",
          source: "Interview with the Financial Crisis Inquiry Commission, 2010",
          topic: "pricing power",
          metricContext: `Considering the strong gross margin of ${marginValue}%`,
          transitionText: `The gross margin of ${marginValue}% indicates significant pricing power. Buffett considers this a crucial business characteristic:`
        };
      }
      // Low Margins
      else if (metrics.grossMargin < 20) {
        marginWisdom = {
          type: 'metric_insight',
          content: "You've got a wonderful business when your customers need your product and have trouble comparing your offerings with those of your competitors.",
          author: "Charlie Munger",
          source: "Wesco Financial Annual Meeting, 2010",
          topic: "business differentiation",
          metricContext: `Regarding the modest gross margin of ${marginValue}%`,
          transitionText: `The gross margin of ${marginValue}% suggests limited pricing power. This brings to mind Munger's thoughts on business differentiation:`
        };
      }
      
      if (marginWisdom) results.push(marginWisdom);
    }
    
    return results;
  },
  
  // Get historical investment comparisons for a company/industry
  getHistoricalComparisons: function(ticker, industry, metrics) {
    // If we don't have ticker or industry, we can't make comparisons
    if (!ticker && !industry) return null;
    
    // Try to find similar investments from Buffett's history
    let comparisons = [];
    
    // Check if we have unified letters system available
    if (window.buffettLettersUnified) {
      try {
        // If we have a company/ticker, look for similar companies
        if (industry) {
          const industryInsights = window.buffettLettersUnified.getIndustryInsights(industry);
          if (industryInsights) {
            comparisons.push({
              type: 'industry',
              industry: industry,
              insights: industryInsights.keyInsights,
              companies: industryInsights.notableCompanies,
              source: 'Buffett Letters (1977-2008)'
            });
          }
        }
        
        // If metrics are provided, find investments with similar characteristics
        if (metrics) {
          // Look for metrics-based comparisons (PE ratio, ROE, etc.)
          // This is a simplified approach - in reality, you would implement more sophisticated matching
          if (metrics.pe) {
            // Find examples of companies Buffett invested in with similar P/E ratios
            let peComparisons = [];
            
            // High P/E (>20)
            if (metrics.pe > 20) {
              peComparisons.push({
                company: "Coca-Cola",
                year: 1988,
                comment: "I'm willing to pay up for a business with extraordinary economics." 
              });
            }
            // Medium P/E (10-20)
            else if (metrics.pe >= 10) {
              peComparisons.push({
                company: "American Express",
                year: 1991,
                comment: "Our focus is not on P/E ratios but on business quality and growth potential."
              });
            }
            // Low P/E (<10)
            else if (metrics.pe < 10) {
              peComparisons.push({
                company: "Washington Post",
                year: 1973,
                comment: "We're willing to buy an extraordinary business at an ordinary price."
              });
            }
            
            if (peComparisons.length > 0) {
              comparisons.push({
                type: 'metrics',
                metric: 'P/E Ratio',
                value: metrics.pe,
                examples: peComparisons
              });
            }
          }
        }
      } catch (err) {
        console.warn("Error finding historical comparisons:", err);
      }
    }
    
    return comparisons.length > 0 ? comparisons : null;
  },
  
  // Format wisdom as markdown for inclusion in bot responses with improved context and transitions
  formatWisdomAsMarkdown: function(wisdom, context = {}) {
    if (!wisdom) return '';
    
    // Generate a unique identifier for this quote to track usage
    const quoteId = wisdom.type + ':' + (wisdom.content || '').substring(0, 40);
    
    // Check if we've already used this quote in the current conversation
    if (this.usedQuotesInCurrentConversation.has(quoteId)) {
      return ''; // Don't repeat quotes in the same conversation
    }
    
    // Add to our set of used quotes
    this.usedQuotesInCurrentConversation.add(quoteId);
    
    // Create natural transitions based on the type of wisdom and conversation context
    let transitionIntro = '';
    
    // Format based on the type of wisdom with better transitions
    if (wisdom.type === 'quote') {
      // Create contextual transitions for quotes
      if (wisdom.transitionText) {
        transitionIntro = wisdom.transitionText;
      } else if (context.metricName && wisdom.topic) {
        transitionIntro = `When analyzing ${context.metricName}, I'm reminded of Buffett's wisdom on ${wisdom.topic}:`;
      } else {
        transitionIntro = `This reminds me of an important perspective on ${wisdom.topic || 'investing'}:`;
      }
      
      return `\n\n${transitionIntro} "${wisdom.content}"\n— ${wisdom.author}, ${wisdom.source}`;
    } else if (wisdom.type === 'letter_insight') {
      // For letter insights, create stronger connections to the analysis
      let contextualLink = '';
      
      if (wisdom.transitionText) {
        contextualLink = wisdom.transitionText;
      } else if (context.metricName && wisdom.context) {
        contextualLink = `This ${context.metricName} analysis aligns with Buffett's thoughts when discussing ${wisdom.context}:`;
      } else if (wisdom.context) {
        contextualLink = `When discussing ${wisdom.context}, Buffett provided valuable insight:`;
      } else if (context.companyName) {
        contextualLink = `Looking at ${context.companyName}'s situation, I'm reminded of this insight from Buffett's ${wisdom.year} letter:`;
      } else {
        contextualLink = `In his ${wisdom.year} letter to shareholders, Buffett offered this perspective:`;
      }
      
      return `\n\n${contextualLink} "${wisdom.content}"`;
    } else if (wisdom.type === 'comparison') {
      // For historical investment comparisons, make the connection more explicit
      let comparisonContext = '';
      
      if (wisdom.transitionText) {
        comparisonContext = wisdom.transitionText;
      } else if (context.companyName && context.metricName) {
        comparisonContext = `${context.companyName}'s ${context.metricName} is comparable to Buffett's approach with ${wisdom.company} (${wisdom.year}), where he noted:`;
      } else {
        comparisonContext = `This is similar to Buffett's approach with ${wisdom.company} (${wisdom.year}), where he explained:`;
      }
      
      return `\n\n${comparisonContext} "${wisdom.comment}"`;
    } else if (wisdom.type === 'metric_insight') {
      // For metric-specific insights
      return `\n\n**${wisdom.metricContext}:** "${wisdom.content}"\n— ${wisdom.author}, ${wisdom.source}`;
    }
    
    return '';
  },
  
  // Enhanced method to enrich bot responses with relevant Buffett/Munger wisdom
  // Now uses the semantic categorization system for better context-matching
  enrichBotResponse: function(botResponse, ticker, metrics) {
    try {
      if (!botResponse) return '';

      // First, check if we have the semantic system available
      if (window.buffettWisdomSemanticIntegration) {
        console.log('[Buffett Wisdom] Using semantic wisdom system');
        
        // Try to get a semantically relevant quote
        try {
          // Make sure the semantic system is initialized
          if (!window.buffettWisdomSemanticIntegration.initialized) {
            window.buffettWisdomSemanticIntegration.initialize();
            window.buffettWisdomSemanticIntegration.initialized = true;
          }
          
          // Use the semantic system to enrich the response
          const enrichedResponse = window.buffettWisdomSemanticIntegration.enrichResponse(botResponse, metrics);
          
          // If successful, return the enriched response
          if (enrichedResponse && enrichedResponse !== botResponse) {
            console.log('[Buffett Wisdom] Successfully added semantic wisdom');
            return enrichedResponse;
          }
        } catch (semErr) {
          console.warn('[Buffett Wisdom] Error using semantic system:', semErr);
          // Fall back to legacy system if semantic system fails
        }
      }
      
      // If semantic system isn't available or didn't produce a result, use legacy system
      console.log('[Buffett Wisdom] Using legacy wisdom system');
      
      // Extract company name from the bot response if available
      const companyNameRegex = /\b([A-Z][A-Za-z\-\s\.]+?)\s+(?:Corporation|Corp|Inc|Company|Co|Ltd)\b/;
      const companyMatch = botResponse.match(companyNameRegex);
      const companyName = ticker || (companyMatch ? companyMatch[0].trim() : null);
      
      // If we have a ticker, first try company-specific wisdom
      if (ticker) {
        const companyWisdom = this.getCompanyWisdom(ticker);
        if (companyWisdom && companyWisdom.buffettComment) {
          const quoteId = `company:${companyWisdom.company}`;
          
          // Check if we've used this quote before
          if (!this.usedQuotesInCurrentConversation.has(quoteId)) {
            this.usedQuotesInCurrentConversation.add(quoteId);
            
            // Create company-specific insight with better contextual transition
            const contextIntro = companyWisdom.context ? 
              `When discussing ${companyWisdom.context}, Warren Buffett said this about ${companyWisdom.company}:` : 
              `When explaining his investment in ${companyWisdom.company}, Warren Buffett noted:`;
            
            return botResponse + `\n\n**${contextIntro}** "${companyWisdom.buffettComment}"`;
          }
        }
      }
      
      // Identify key topics in the bot response
      const topicKeywords = {
        'valuation': ['valuation', 'intrinsic value', 'price-to-earnings', 'p/e ratio'],
        'competitive advantage': ['competitive advantage', 'moat', 'market position', 'brand value'],
        'management': ['management', 'capital allocation', 'leadership', 'executives'],
        'risk': ['risk', 'debt', 'leverage', 'financial strength', 'balance sheet'],
        'patience': ['long-term', 'compounding', 'patience', 'time horizon'],
        'circle of competence': ['circle of competence', 'understanding the business'],
        'margin of safety': ['margin of safety', 'downside protection'],
        'return on capital': ['return on equity', 'return on capital', 'ROIC', 'ROE']
      };
      
      // Find the most relevant topic
      let bestTopic = null;
      let bestMatches = 0;
      
      // Look for topic matches in the response
      const text = botResponse.toLowerCase();
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        let matches = 0;
        for (const keyword of keywords) {
          if (text.includes(keyword.toLowerCase())) {
            matches++;
          }
        }
        
        if (matches > bestMatches) {
          bestTopic = topic;
          bestMatches = matches;
        }
      }
      
      // If we found a relevant topic, and it had multiple keyword matches
      if (bestTopic && bestMatches >= 2) {
        // Try to get a letter insight first (usually more substantive)
        const insights = this.getLetterInsightsByTopic(bestTopic);
        
        if (insights && insights.length > 0) {
          for (let i = 0; i < Math.min(2, insights.length); i++) {
            const insight = insights[i];
            const insightId = `letter:${insight.year}:${insight.insight.substring(0, 40)}`;
            
            if (!this.usedQuotesInCurrentConversation.has(insightId)) {
              this.usedQuotesInCurrentConversation.add(insightId);
              
              // Create a contextual transition based on the topic
              let transition;
              switch(bestTopic) {
                case 'valuation':
                  transition = `When evaluating company valuation, Buffett emphasized in his ${insight.year} letter:`;
                  break;
                case 'competitive advantage':
                  transition = `On the importance of competitive advantages, Buffett wrote in ${insight.year}:`;
                  break;
                case 'management':
                  transition = `Regarding management quality, in his ${insight.year} letter Buffett stated:`;
                  break;
                case 'risk':
                  transition = `When considering investment risks, Buffett noted in ${insight.year}:`;
                  break;
                case 'patience':
                  transition = `On the virtue of patience in investing, Buffett wrote in ${insight.year}:`;
                  break;
                case 'circle of competence':
                  transition = `About staying within one's circle of competence, Buffett emphasized in ${insight.year}:`;
                  break;
                case 'margin of safety':
                  transition = `On maintaining a margin of safety, in ${insight.year} Buffett explained:`;
                  break;
                case 'return on capital':
                  transition = `When discussing returns on capital in ${insight.year}, Buffett wrote:`;
                  break;
                default:
                  transition = `In his ${insight.year} letter to shareholders, Buffett offered this insight:`;
              }
              
              return botResponse + `\n\n**${transition}** "${insight.insight}"`;
            }
          }
        }
      }
      
      // If we have metrics, try to find metric-specific wisdom
      if (metrics) {
        // Prioritize the most important metrics
        const metricPriorities = ['pe', 'roe', 'debtToEquity', 'profitMargin', 'fcfMargin'];
        
        for (const metricName of metricPriorities) {
          if (metrics[metricName] !== undefined) {
            const metricValue = metrics[metricName];
            let wisdom = null;
            
            // Find relevant metric-specific wisdom
            switch(metricName) {
              case 'pe':
                if (metricValue > 25) {
                  wisdom = {
                    content: "The value of any stock, bond or business today is determined by the cash inflows and outflows – discounted at an appropriate interest rate – that can be expected to occur during the remaining life of the asset.",
                    author: "Warren Buffett",
                    source: "1996 Shareholder Letter",
                    transition: `With a P/E ratio of ${metricValue.toFixed(2)}, which is relatively high, it's worth remembering Buffett's emphasis on intrinsic value:`
                  };
                } else if (metricValue < 10 && metricValue > 0) {
                  wisdom = {
                    content: "Price is what you pay. Value is what you get.",
                    author: "Warren Buffett",
                    source: "2008 Shareholder Letter",
                    transition: `With a P/E ratio of ${metricValue.toFixed(2)}, which appears attractive, it's important to remember Buffett's distinction:`
                  };
                }
                break;
                
              case 'roe':
                if (metricValue > 15) {
                  wisdom = {
                    content: "The best business to own is one that over an extended period can employ large amounts of incremental capital at very high rates of return.",
                    author: "Warren Buffett",
                    source: "1992 Shareholder Letter",
                    transition: `With a strong return on equity of ${metricValue.toFixed(2)}%, this business exemplifies one of Buffett's key principles:`
                  };
                } else if (metricValue < 8) {
                  wisdom = {
                    content: "When a management with a reputation for brilliance tackles a business with a reputation for bad economics, it is the reputation of the business that remains intact.",
                    author: "Warren Buffett",
                    source: "1989 Shareholder Letter",
                    transition: `The return on equity of ${metricValue.toFixed(2)}% is relatively low, which brings to mind Buffett's observation:`
                  };
                }
                break;
                
              case 'debtToEquity':
                if (metricValue > 1.0) {
                  wisdom = {
                    content: "We never want to count on the kindness of strangers in order to meet tomorrow's obligations.",
                    author: "Warren Buffett",
                    source: "2008 Shareholder Letter",
                    transition: `With a debt-to-equity ratio of ${metricValue.toFixed(2)}, which indicates significant leverage, it's worth considering Buffett's cautious approach to debt:`
                  };
                } else if (metricValue < 0.3) {
                  wisdom = {
                    content: "The most important thing to do when you find yourself in a hole is to stop digging.",
                    author: "Warren Buffett",
                    source: "Various Interviews",
                    transition: `The conservative debt-to-equity ratio of ${metricValue.toFixed(2)} aligns with Buffett's prudent approach to financial leverage:`
                  };
                }
                break;
            }
            
            if (wisdom) {
              const wisdomId = `metric:${metricName}:${wisdom.content.substring(0, 40)}`;
              
              if (!this.usedQuotesInCurrentConversation.has(wisdomId)) {
                this.usedQuotesInCurrentConversation.add(wisdomId);
                
                // Add specific metrics in the transition when available
                let enhancedTransition = wisdom.transition;
                
                // For ROE/ROIC related content
                if (metricName === 'roe' && metrics.roe !== undefined) {
                  enhancedTransition = `${wisdom.transition} With this company's ROE of ${metrics.roe.toFixed(2)}%,`;
                } 
                else if (metricName === 'debtToEquity' && metrics.debtToEquity !== undefined) {
                  enhancedTransition = `${wisdom.transition} With this company's debt-to-equity ratio of ${metrics.debtToEquity.toFixed(2)},`;
                }
                else if (metricName === 'pe' && metrics.pe !== undefined) {
                  enhancedTransition = `${wisdom.transition} With this company's P/E ratio of ${metrics.pe.toFixed(2)},`;
                }
                
                return botResponse + `\n\n**${enhancedTransition}** "${wisdom.content}"\n— ${wisdom.author}, ${wisdom.source}`;
              }
            }
          }
        }
      }
      
      // If we still haven't found appropriate wisdom, return the original response
      // Better no quote than an irrelevant one
      return botResponse;
      
    } catch (err) {
      console.warn('[Buffett Wisdom] Error enriching response:', err);
      // Return original response if there was an error
      return botResponse;
    }
  }
};

// Initialize the unified wisdom system when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  buffettWisdomUnified.initialize();
  // Make it globally available
  window.buffettWisdomUnified = buffettWisdomUnified;
});
