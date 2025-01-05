const express = require('express');
const router = express.Router();
const { fetchStockData } = require('../controllers/AlphaVantageService');
const { getWatchlist, addToWatchlist, deleteFromWatchlist } = require('../controllers/watchlist');

// Stock data route
router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  let functionType = req.query.function || 'TIME_SERIES_DAILY';

  try {
    console.log(`Processing request for ${symbol} with function type ${functionType}`);
    
    try {
      const [overviewData, marketData] = await Promise.all([
        fetchStockData(symbol, 'OVERVIEW'),  // Always fetch overview
        fetchStockData(symbol, functionType) // The service will handle intraday params internally
      ]);

      console.log('Overview data received:', !!overviewData);
      console.log('Market data received:', !!marketData);

      // Combine the data into a single response
      const combinedData = {
        overview: overviewData,
        market_data: marketData
      };

      res.json(combinedData);
    } catch (error) {
      console.error('Error in Promise.all:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in stock route:', error);
    
    // Handle specific error cases
    if (error.message.includes('Invalid API key')) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    if (error.message.includes('Invalid request parameters')) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    if (error.message.includes('API Rate Limit')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    // Generic error response
    res.status(500).json({ 
      error: 'Error fetching stock data',
      message: error.message 
    });
  }
});

// Watchlist routes
router.post('/watchlist', async (req, res) => {
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

router.delete('/watchlist', async (req, res) => {
  try {
    const { userID, stockSymbol } = req.body;
    if (!userID || !stockSymbol) {
      return res.status(400).json({ error: "User id and stock symbol is required" });
    }

    await deleteFromWatchlist(userID, stockSymbol);

    res.status(201).send("Successfully deleted stock symbol from watchlist");
  } catch (error) {
    res.status(500).json({ error: "Failed to delete from watchlist" });
  }
});

module.exports = router;