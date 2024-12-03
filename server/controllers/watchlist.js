const pool = require('../config/db');

// returns watchlist of stock symbols as a list
const getWatchList = async (userID) => {
    const result = await pool.query(); // get watchlist
};

// adds a stock symbol to watchlist
const addToWatchlist = async (userID, stockSymbol) => {
    const exists = await pool.query(); // checking if stock symbol already exists

    await pool.query(); // add to watch list
};

module.exports = { getWatchList, addToWatchlist };