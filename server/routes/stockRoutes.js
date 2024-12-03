const express = require('express');
const app = express();
const { getStockData } = require('../controllers/AlphaVantageService'); // import the service function

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

// Get all watchlist symbols as a list
app.get('/watchlist', async (req, res) => {
  try {
    const userID = req.query;
    if (!userID) return res.status(400).json({ error: "User id is required" });

    const watchlist = await getWatchlist(userID);
    if (watchlist.length === 0) return res.status(400).json({ error: "Watchlist is empty" });

    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// Add stock symbols to the watchlist
app.post('/watchlist', async (req, res) => {
  try {
    const { userID, stockSymbol } = req.body;
    if (!userID || !stockSymbol) {
      return res.status(400).json({ error: "User id and stock symbol is required" });
    }

    await addToWatchlist(userID, stockSymbol);

    res.status(201).send("Successfully added stock symbol to watchlist")
  } catch (error) {
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
});