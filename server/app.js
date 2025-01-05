const express = require('express');
const { fetchStockData } = require('./controllers/AlphaVantageService');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

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
app.use('/stock', stockRoutes);

/** Auth routes */
app.use('/auth', authRoutes);

/** Watchlist routes */
app.use('/stock', stockRoutes);

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
