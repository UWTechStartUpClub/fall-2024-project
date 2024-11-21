const express = require('express');
const app = express();
const { getStockData } = require('./AlphaVantageService'); // Import the service function

// Define the /stock/:symbol route
app.get('/stock/:symbol', async (req, res) => {
    console.log('inside the get stock symbol route');
    const symbol = req.params.symbol; // Get the stock symbol from the request URL
    try {
      console.log('');
      const stockData = await getStockData(symbol)
      // respond not responding
      res.json(stockData);  // Send the data as JSON
    } catch (error) {
      res.status(500).send('Error fetching stock data');
    }
  });