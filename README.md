# Financial Analysis App with Sankey Income Statement Chart

A powerful financial analysis application that visualizes company income statements as interactive Sankey diagrams. The application provides in-depth analysis of publicly traded companies, including valuation metrics, competitor analysis, and AI-powered investment insights.

## Features

- **Interactive Sankey Chart**: Visualize income statements as flow diagrams showing how revenue translates to profit or loss
- **Value Investor Bot**: AI-powered assistant that provides Warren Buffett-style analysis of stocks
- **Competitor Analysis**: Compare with industry peers to understand competitive positioning
- **Valuation Metrics**: Key financial ratios and metrics to assess investment potential
- **Feature Request System**: Collect user feedback for future enhancements

## Deployment Instructions

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- API keys for the following services:
  - Financial Modeling Prep (FMP) for financial data
  - OpenAI for the Value Investor Bot
  - Perplexity (optional) for additional financial metrics

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd financial-analysis-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys to the `.env` file

   ```
   cp .env.example .env
   # Edit .env with your API keys
   ```

### Local Development

Run the application locally:

```
npm start
```

The application will be available at `http://localhost:3000`.

### Deployment Options

#### Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
3. Set up environment variables in Heroku:
   ```
   heroku config:set FMP_API_KEY=your_fmp_api_key
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set PERPLEXITY_API_KEY=your_perplexity_api_key
   ```
4. Deploy the application:
   ```
   git push heroku main
   ```

#### Deploying to Netlify/Vercel with Serverless Functions

1. Create a `netlify.toml` or `vercel.json` configuration file
2. Set up environment variables in the Netlify/Vercel dashboard
3. Deploy using the Netlify/Vercel CLI or connect to your GitHub repository

## Security Considerations

- **API Keys**: All API keys are stored as environment variables and never exposed in client-side code
- **Input Validation**: Implemented to prevent injection attacks
- **Rate Limiting**: Consider implementing rate limiting for production deployments
- **HTTPS**: Ensure your deployment uses HTTPS to encrypt data in transit

## License

MIT