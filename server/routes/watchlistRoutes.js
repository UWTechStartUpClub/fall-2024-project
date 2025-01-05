const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, deleteFromWatchlist } = require('../controllers/watchlist');

// Watchlist routes
router.get('/watchlist', async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) return res.status(400).json({ error: "User id is required" });
  
    const watchlist = await getWatchlist(userID);
    if (watchlist.length === 0) return res.status(400).json({ error: "Watchlist is empty" });
  
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

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