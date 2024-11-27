const express = require('express');
const { getStockData } = require('./AlphaVantageService');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// const stockRoutes = require('./routes/stockRoutes');

// Initialize the Express app
const app = express();

/** CORS */
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

/** Middleware */
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet()); // Secure HTTP headers

/** Set the view engine */
app.set('view engine', 'ejs');
app.use(express.static('public'));

/** Define routes */

/** Stock symbol route */
// this is what we want to use
// app.use('/stock/:symbol', stockRoutes);

// debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// this is working
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

/** About route */
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

/** Contact route */
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

/** Auth routes */
app.use('/auth', authRoutes);

/** Contact form submission */
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  // Process form data (e.g., save to database, send email, etc.)
  res.send(`Thank you, ${name}, we will get back to you soon!`);
});

/** Set the port and start the server */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
