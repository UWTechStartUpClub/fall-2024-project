import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios for making the API request
import style from './style/stock.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Stock = () => {
    const { symbol } = useParams(); // Extract the symbol from the URL (e.g., /stock/AAPL)
    
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch stock data from the backend Express server
        const fetchStockData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/stock/${symbol}`);
                // const response = await axios.get(`stock/${symbol}`);
                setStockData(response.data); // Store stock data in state
            } catch (err) {
                if (err.response) {
                    // The server responded with a status other than 2xx
                    setError(`Error ${err.response.status}: ${err.response.data}`);
                    console.error("Server responded with an error:", err.response);
                } else if (err.request) {
                    // The request was made, but no response was received
                    setError("No response from the server. Please try again later.");
                    console.error("No response from server:", err.request);
                } else {
                    // Other errors (e.g., invalid request or network issues)
                    setError(`An error occurred: ${err.message}`);
                    console.error("Error during request:", err.message);
                }
            }
        };

        if (symbol) {
            fetchStockData(); // Fetch data when the component is mounted or symbol changes
        }
    }, [symbol]); // Re-fetch when the symbol changes

    return (
        <>
            <NavBar />
            <div className={style.stockMainWrap}>
                <div className={style.stockMainContent}>
                    {error && <div className={style.error}>{error}</div>}  {/* Render the error message if there is an error */}
                    <StockName stockData={stockData} />
                    <StockPriceSummary stockData={stockData} />
                    <div>
                        Placeholder for graph.
                    </div>
                    <StockStats stockData={stockData} />
                    <div>
                        Latest news on Company Name [Placeholder]
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};



// StockName Component to display company name and symbol
const StockName = ({ stockData }) => {
    if (!stockData) return <div>Loading...</div>; // Show loading while data is being fetched

    const companyName = stockData['Global Quote'] ? stockData['Global Quote']['01. symbol'] : 'N/A';
    return (
        <div className={style.stockNameBlock}>
            <h1>{companyName}</h1>
            <span>{stockData['Global Quote'] ? stockData['Global Quote']['01. symbol'] : 'symbol'}</span>
            <span>  &#x2022;  </span>
            <span>USD</span>
        </div>
    );
};

// StockPriceSummary Component to display stock price and change
const StockPriceSummary = ({ stockData }) => {
    if (!stockData) return <div>Loading...</div>;

    const stockPrice = stockData['Global Quote'] ? stockData['Global Quote']['05. price'] : 'N/A';
    const change = stockData['Global Quote'] ? stockData['Global Quote']['09. change'] : 'N/A';
    const changePercent = stockData['Global Quote'] ? stockData['Global Quote']['10. change percent'] : 'N/A';
    const isPositiveChange = parseFloat(change) >= 0;

    return (
        <div className={style.stockPriceSummaryBox}>
            <div>{new Date().toLocaleDateString()}</div>
            <div className={style.stockSummaryWrap}>
                <div className={style.stockSummaryHead}>{stockPrice}</div>
                <div className={style.stockSummaryChange} style={{ color: isPositiveChange ? 'green' : 'red' }}>
                    <i className={`fa-solid fa-caret-${isPositiveChange ? 'up' : 'down'}`} />
                    <span>{change}</span>
                    <span> ({changePercent})</span>
                </div>
            </div>
        </div>
    );
};

// StockStats Component to display stock stats like Open, Day High, Day Low, etc.
const StockStats = ({ stockData }) => {
    if (!stockData) return <div>Loading...</div>;

    const { 'Time Series (Daily)': timeSeries } = stockData;

    // Extract the most recent trading day's data
    const lastDate = timeSeries ? Object.keys(timeSeries)[0] : null;
    const stats = lastDate ? timeSeries[lastDate] : {};

    return (
        <div className={style.stockStatsBox}>
            <div>
                <table>
                    <tr>
                        <td>Open</td>
                        <td>{stats['1. open'] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Day High</td>
                        <td>{stats['2. high'] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Day Low</td>
                        <td>{stats['3. low'] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Prev Close</td>
                        <td>{stats['4. close'] || 'N/A'}</td>
                    </tr>
                </table>
            </div>
            <div>
                <table>
                    <tr>
                        <td>52 Week High</td>
                        <td>{stats['2. high'] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>52 Week High Date</td>
                        <td>{lastDate || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>52 Week Low</td>
                        <td>{stats['3. low'] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>52 Week Low Date</td>
                        <td>{lastDate || 'N/A'}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default Stock;