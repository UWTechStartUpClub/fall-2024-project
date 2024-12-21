const axios = require('axios');
require('dotenv').config();

// Configuration
const CONFIG = {
  baseURL: 'https://www.alphavantage.co/query',
  timeout: 10000, // 10 seconds timeout
  maxRetries: 3,
  retryDelay: 1000, // 1 second between retries
};

// Validate API key on startup
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
if (!API_KEY) {
  throw new Error('API Key is missing. Please set ALPHA_VANTAGE_API_KEY in your .env file');
}

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: CONFIG.baseURL,
  timeout: CONFIG.timeout,
  headers: {
    'User-Agent': 'StockDataClient/1.0',
  }
});

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch stock data with retries
const getStockData = async (symbol, functionType = 'TIME_SERIES_DAILY') => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Fetching ${functionType} data for ${symbol}`);
      
      const response = await apiClient.get('', {
        params: {
          function: functionType,
          symbol: symbol,
          apikey: API_KEY
        }
      });

      // Log rate limit information if available
      const rateLimitLimit = response.headers['x-ratelimit-limit'];
      const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
      if (rateLimitLimit && rateLimitRemaining) {
        console.log(`API Rate Limit: ${rateLimitRemaining}/${rateLimitLimit} remaining`);
      }

      const data = response.data;

      // Check for API-specific error responses
      if (data.Note) {
        throw new Error(`API Rate Limit: ${data.Note}`);
      }

      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      // Validate response data structure
      const timeSeriesKey = getTimeSeriesKey(functionType);
      if (!data[timeSeriesKey]) {
        throw new Error(`No ${timeSeriesKey} data found in response`);
      }

      return data;

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);

      // Don't retry on certain errors
      if (error.response?.status === 401) { // Invalid API key
        throw new Error('Invalid API key');
      }

      if (error.response?.status === 422) { // Invalid parameters
        throw new Error('Invalid request parameters');
      }

      // If we haven't exceeded retry attempts, wait before trying again
      if (attempt < CONFIG.maxRetries) {
        const waitTime = CONFIG.retryDelay * attempt; // Exponential backoff
        console.log(`Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw new Error(`Failed after ${CONFIG.maxRetries} attempts. Last error: ${lastError.message}`);
};

// Helper function to get the correct time series key based on function type
const getTimeSeriesKey = (functionType) => {
  const keyMap = {
    'TIME_SERIES_DAILY': 'Time Series Daily',
    'TIME_SERIES_WEEKLY': 'Weekly Time Series',
    'TIME_SERIES_MONTHLY': 'Monthly Time Series',
    'GLOBAL_QUOTE': 'Global Quote',
    // Add more mappings as needed
  };
  return keyMap[functionType] || 'Time Series Daily';
};

// Example usage with different function types
const fetchStockData = async (symbol, functionType) => {
  try {
    const data = await getStockData(symbol, functionType);
    console.log('Successfully retrieved stock data');
    return data;
  } catch (error) {
    console.error('Failed to fetch stock data:', error.message);
    throw error;
  }
};

module.exports = {
  getStockData,
  fetchStockData
};