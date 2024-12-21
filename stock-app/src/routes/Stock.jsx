import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import style from './style/stock.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const functionOptions = [
    { value: 'TIME_SERIES_DAILY', label: 'Daily Time Series' },
    { value: 'TIME_SERIES_WEEKLY', label: 'Weekly Time Series' },
    { value: 'TIME_SERIES_MONTHLY', label: 'Monthly Time Series' },
    { value: 'GLOBAL_QUOTE', label: 'Global Quote' }
];

const Stock = () => {
    const { symbol } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    
    // Get the function from URL params or default to TIME_SERIES_DAILY
    const [selectedFunction, setSelectedFunction] = useState(
        searchParams.get('function') || 'TIME_SERIES_DAILY'
    );

    const handleFunctionChange = (newFunction) => {
        setSelectedFunction(newFunction);
        setSearchParams({ function: newFunction });
        // Reset states
        setStockData(null);
        setIsLoading(true);
        setError(null);
        setRetryCount(0);
    };

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log(`Requesting stock data for symbol: ${symbol}, function: ${selectedFunction}`);
                
                const response = await axios.get(`/stock/${symbol}`, {
                    params: { function: selectedFunction }
                });
                
                console.log('Response received from backend:', response.data);
                setStockData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error occurred during fetchStockData:', err);
                
                let errorMessage = 'An unexpected error occurred';
                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            errorMessage = 'Authentication failed. Please check API key.';
                            break;
                        case 429:
                            errorMessage = 'Rate limit exceeded. Please try again later.';
                            break;
                        case 400:
                            errorMessage = 'Invalid request parameters.';
                            break;
                        default:
                            errorMessage = err.response.data?.error || 'Server error occurred';
                    }
                    setError(`Error ${err.response.status}: ${errorMessage}`);
                } else if (err.request) {
                    setError("No response from server. Please check your connection.");
                } else {
                    setError(`An error occurred: ${err.message}`);
                }
                setIsLoading(false);
            }
        };

        if (symbol) {
            fetchStockData();
        }
    }, [symbol, selectedFunction, retryCount]);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    return (
        <>
            <NavBar />
            <div className={style.stockMainWrap}>
                <div className={style.stockMainContent}>
                    <div className={style.functionSelector}>
                        <select 
                            value={selectedFunction}
                            onChange={(e) => handleFunctionChange(e.target.value)}
                            className={style.functionSelect}
                            disabled={isLoading}
                        >
                            {functionOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {isLoading && (
                        <div className={style.loadingIndicator}>
                            Loading stock data...
                        </div>
                    )}

                    {error && (
                        <div className={style.error}>
                            {error}
                            <button 
                                onClick={handleRetry}
                                className={style.retryButton}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            <StockName stockData={stockData} />
                            <StockPriceSummary stockData={stockData} />
                            <div>
                                Placeholder for graph.
                            </div>
                            <StockStats stockData={stockData} selectedFunction={selectedFunction} />
                            <div>
                                Latest news on Company Name [Placeholder]
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

// StockStats component to handle different data structures
const StockStats = ({ stockData, selectedFunction }) => {
    if (!stockData) return null;

    // Different data handling based on the selected function
    let stats = {};
    let lastDate = null;

    switch (selectedFunction) {
        case 'TIME_SERIES_DAILY':
            lastDate = stockData['Time Series (Daily)'] ? 
                Object.keys(stockData['Time Series (Daily)'])[0] : null;
            stats = lastDate ? stockData['Time Series (Daily)'][lastDate] : {};
            break;
        case 'TIME_SERIES_WEEKLY':
            lastDate = stockData['Weekly Time Series'] ? 
                Object.keys(stockData['Weekly Time Series'])[0] : null;
            stats = lastDate ? stockData['Weekly Time Series'][lastDate] : {};
            break;
        case 'TIME_SERIES_MONTHLY':
            lastDate = stockData['Monthly Time Series'] ? 
                Object.keys(stockData['Monthly Time Series'])[0] : null;
            stats = lastDate ? stockData['Monthly Time Series'][lastDate] : {};
            break;
        case 'GLOBAL_QUOTE':
            stats = stockData['Global Quote'] || {};
            break;
        default:
            break;
    }

    return (
        <div className={style.stockStatsBox}>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Open</td>
                            <td>{stats['1. open'] || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>High</td>
                            <td>{stats['2. high'] || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Low</td>
                            <td>{stats['3. low'] || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Close</td>
                            <td>{stats['4. close'] || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Volume</td>
                            <td>{stats['5. volume'] || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// StockName and StockPriceSummary components remain the same
export default Stock;