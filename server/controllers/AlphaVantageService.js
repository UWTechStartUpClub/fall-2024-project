const axios = require('axios');
require('dotenv').config();

// Configuration
const CONFIG = {
  baseURL: 'https://www.alphavantage.co/query',
  timeout: 10000, // 10 seconds timeout
  maxRetries: 3,
  retryDelay: 1000, // 1 second between retries
};

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
      
      // Add params object to handle intraday interval
      const params = {
        function: functionType,
        symbol: symbol,
        apikey: API_KEY
      };

      // Add interval parameter for intraday
      if (functionType === 'TIME_SERIES_INTRADAY') {
        params.interval = '5min';
      }
      
      const response = await apiClient.get('', { params });

      // Rest of your existing error handling and response processing
      const rateLimitLimit = response.headers['x-ratelimit-limit'];
      const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
      if (rateLimitLimit && rateLimitRemaining) {
        console.log(`API Rate Limit: ${rateLimitRemaining}/${rateLimitLimit} remaining`);
      }

      const data = response.data;

      console.log('Full API Response Data:', data);

      // Check for API-specific error responses
      if (data.Note) {
        throw new Error(`API Rate Limit: ${data.Note}`);
      }

      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      // Special handling for OVERVIEW function
      if (functionType === 'OVERVIEW') {
        if (!data.Symbol) {
          console.error('Overview data missing Symbol:', data);
          throw new Error('Invalid overview data received');
        }
        return data;
      }

      // ***VALIDATION***
      // For other function types, validate the time series key
      const timeSeriesKey = getTimeSeriesKey(functionType);
      if (timeSeriesKey && !data[timeSeriesKey]) {
        console.error('Expected data key missing:', timeSeriesKey);
        console.error('Received data:', data);
        throw new Error(`No ${timeSeriesKey} data found in response`);
      }
      /* Global quote validation - check if the Global Quote block is empty or not
       * by checking if it contains a symbol key. If not, the data might be malformed
       * or missing altogether.
      */
      if (data[timeSeriesKey]
        && (data[timeSeriesKey]["01. symbol"] === undefined || data[timeSeriesKey]["01. symbol"] === null)) {
        throw new Error(`${timeSeriesKey} data for requested symbol was malformed or absent altogether.`);
      }

      return data;

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);

      // Don't retry on certain errors
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }

      if (error.response?.status === 422) {
        throw new Error('Invalid request parameters');
      }

      // If we haven't exceeded retry attempts, wait before trying again
      if (attempt < CONFIG.maxRetries) {
        const waitTime = CONFIG.retryDelay * attempt;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }

  throw new Error(`Failed after ${CONFIG.maxRetries} attempts. Last error: ${lastError.message}`);
};

// Helper function to get the correct time series key based on function type
const getTimeSeriesKey = (functionType) => {
  const keyMap = {
    'TIME_SERIES_INTRADAY': 'Time Series (5min)',
    'TIME_SERIES_DAILY': 'Time Series (Daily)',
    'TIME_SERIES_WEEKLY': 'Weekly Time Series',
    'TIME_SERIES_MONTHLY': 'Monthly Time Series',
    'GLOBAL_QUOTE': 'Global Quote',
    // Add more mappings as needed
  };
  return keyMap[functionType] || 'Time Series (Daily)';
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