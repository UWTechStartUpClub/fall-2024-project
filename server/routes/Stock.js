const express = require('express');
const app = express();
const { getStockData } = require('./AlphaVantageService'); // Import the service function

// Define the /stock/:symbol route
app.get('/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol; // Extract symbol from the URL
    try {
        const stockData = await getStockData(symbol); // Fetch stock data
        res.json(stockData); // Send the data back to the frontend
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error fetching stock data');
    }
});

const PORT = 3001; // Ensure the backend runs on port 3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
