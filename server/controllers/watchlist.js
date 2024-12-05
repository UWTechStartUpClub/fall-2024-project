const pool = require('../config/db');

// Returns the watchlist of stock symbols as a list
const getWatchList = async (userID) => {
    const result = await pool.query(
        `SELECT stock_symbol FROM watchlist WHERE user_id = $1`, [userID]
    );

    return result.rows.map(row => row.stock_symbol);
};

// Adds a stock symbol to the watchlist
const addToWatchlist = async (userID, stockSymbol) => {
    try {
        // check if stock symbol already exists in the database
        const exists = await pool.query(
            `SELECT 1 FROM watchlist WHERE user_id = $1 AND stock_symbol = $2 LIMIT 1`,
            [userID, stockSymbol]
        );
        if (exists.rowCount > 0) throw new Error("Stock symbol already exists");

        await pool.query(
            `INSERT INTO watchlist (user_id, stock_symbol) VALUES ($1, $2)`,
            [userID, stockSymbol]
        );
    } catch (error) {
        console.error("Error adding to watchlist", error);
        throw error;
    }
};

// Deletes a stock symbol from the watchlist
const deleteFromWatchlist = async (userID, stockSymbol) => {
    try {
        const result = await pool.query(
            `DELETE FROM watchlist WHERE user_id = $1 AND stock_symbol = $2`,
            [userID, stockSymbol]
        );
        // 0 meaning not found, 1 meaning found
        if (result.rowCount === 0) throw new Error("Stock symbol not found");

    } catch (error) {
        console.error("Error deleting from watchlist", error);
        throw error;
    }
}

module.exports = { getWatchList, addToWatchlist, deleteFromWatchlist };