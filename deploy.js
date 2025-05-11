#!/usr/bin/env node

/**
 * Deployment helper script for the Financial Analysis App with Sankey Charts
 * 
 * This script helps prepare the application for deployment by:
 * 1. Validating environment variables
 * 2. Checking for any hardcoded API keys
 * 3. Creating necessary deployment files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting deployment preparation for Sankey Financial Analysis App');

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.error('❌ ERROR: .env file not found!');
  console.log('Please create a .env file based on .env.example and add your API keys.');
  process.exit(1);
}

// Check for required environment variables
const requiredEnvVars = ['FMP_API_KEY', 'OPENAI_API_KEY'];
const missingEnvVars = [];

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  
  requiredEnvVars.forEach(envVar => {
    if (!envContent.includes(`${envVar}=`) || envContent.includes(`${envVar}=''`) || envContent.includes(`${envVar}=""`)) {
      missingEnvVars.push(envVar);
    }
  });
  
  if (missingEnvVars.length > 0) {
    console.warn(`⚠️ WARNING: The following required environment variables are missing or empty: ${missingEnvVars.join(', ')}`);
    console.log('Your app may not function correctly without these API keys.');
  } else {
    console.log('✅ All required environment variables found.');
  }
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
}

// Function to check for potential API keys in code
function checkForApiKeys(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Common API key patterns
    const apiKeyPatterns = [
      /['"]([a-zA-Z0-9]{32,})['"]/, // General 32+ char strings
      /['"]sk-[a-zA-Z0-9]{32,}['"]/, // OpenAI-like
      /['"]key-[a-zA-Z0-9]{24,}['"]/, // Various API keys
      /['"]pk_[a-zA-Z0-9]{24,}['"]/, // Stripe-like
      /['"]pplx-[a-zA-Z0-9]{24,}['"]/ // Perplexity-like
    ];
    
    let foundKeys = false;
    
    apiKeyPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        console.warn(`⚠️ WARNING: Potential hardcoded API key found in ${fileName}`);
        foundKeys = true;
      }
    });
    
    return foundKeys;
  } catch (error) {
    console.error(`❌ Error checking for API keys in ${fileName}:`, error.message);
    return false;
  }
}

// Check key files for hardcoded API keys
console.log('\n🔍 Checking for potentially hardcoded API keys in server files...');
const filesToCheck = [
  { path: path.join(__dirname, 'server.js'), name: 'server.js' },
  { path: path.join(__dirname, 'netlify/functions/api.js'), name: 'netlify/functions/api.js' },
  { path: path.join(__dirname, 'netlify.js'), name: 'netlify.js' }
];

let foundHardcodedKeys = false;

filesToCheck.forEach(file => {
  if (fs.existsSync(file.path)) {
    const hasKeys = checkForApiKeys(file.path, file.name);
    if (hasKeys) foundHardcodedKeys = true;
  }
});

if (!foundHardcodedKeys) {
  console.log('✅ No potential hardcoded API keys found.');
}

// Create or ensure deployment-specific files exist
console.log('\n📦 Checking deployment configuration files...');

const filesToEnsure = [
  { path: 'vercel.json', message: '✅ Vercel configuration file exists.' },
  { path: 'netlify.toml', message: '✅ Netlify configuration file exists.' },
  { path: '.env.example', message: '✅ Environment variables example file exists.' }
];

filesToEnsure.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file.path))) {
    console.log(file.message);
  } else {
    console.warn(`⚠️ Missing ${file.path} file for deployment.`);
  }
});

// Final checks
console.log('\n🔒 Security check complete.');
console.log('\n✨ Deployment preparation finished.');
console.log(`
📝 Deployment Notes:
1. Make sure all API keys are properly configured in your hosting provider's environment variables.
2. For Netlify deployment, run 'netlify deploy' command.
3. For Vercel deployment, run 'vercel' command.
4. For Heroku deployment, commit changes and run 'git push heroku main'.

For more information, see the README.md file.
`);
