const express = require('express');
const { getStockData } = require('./AlphaVantageService');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));


/** Body parser */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

/** helmet */
const helmet = require('helmet');
app.use(helmet());


// Define routes

/** Stock symbol */
app.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol; // Get the stock symbol from the request URL
  try {
    const stockData = await getStockData(symbol);
    res.json(stockData);  // Send the data as JSON
  } catch (error) {
    res.status(500).send('Error fetching stock data');
  }
});

/** about route */
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

/** contact route */
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

/** Set the port and start the server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Form submissions

/** Contact form submission */
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  // Process form data (e.g., save to database, send email, etc.)
  res.send(`Thank you, ${name}, we will get back to you soon!`);
});
