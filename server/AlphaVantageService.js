const axios = require('axios');
require('dotenv').config(); // Load API key from .env file

console.log('getting api key');
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; // Declare with 'let' instead of 'const' to allow reassignment
if (!API_KEY) {
  throw new Error('API Key is missing or invalid. Please provide a valid API key.');
}

const BASE_URL = 'https://www.alphavantage.co/query?';

// Function to fetch stock data
const getStockData = async (symbol) => {
  console.log(`Fetching stock data for symbol: ${symbol}`);
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',  // need to make this into a variable where user chooses which function they want.
        symbol: symbol,                 // Stock symbol, e.g., 'AAPL'
        apikey: API_KEY
      }
    });

    console.log('API Response:', response.data);

    const data = response.data;
    if (response.headers['X-RateLimit-Limit'] && response.headers['X-RateLimit-Remaining']) {
      console.log(`API Rate Limit Status: ${response.headers['X-RateLimit-Remaining']} remaining out of ${response.headers['X-RateLimit-Limit']}`);
    }

    // Check if the response contains a rate limit message
    if (data.Note) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (!data['Time Series (Daily)']) {
      throw new Error('No time series data found');
    }

    return data;  // Process or filter the data here if needed
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

module.exports = { getStockData };
