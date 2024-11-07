const axios = require('axios');
require('dotenv').config(); // Load API key from .env file

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; // Store API key in environment variables
const BASE_URL = 'https://www.alphavantage.co/query';

// Function to fetch stock data
const getStockData = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',  // You can change this to other functions like 'TIME_SERIES_INTRADAY'
        symbol: symbol,                 // Stock symbol, e.g., 'AAPL'
        apikey: API_KEY
      }
    });

    const data = response.data;
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    return data;  // Process or filter the data here if needed
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

module.exports = { getStockData };
