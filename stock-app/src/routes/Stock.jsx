import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import style from './style/stock.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const StockStats = ({ stockData, selectedFunction }) => {
    if (!stockData) return null;

    if (selectedFunction === 'GLOBAL_QUOTE') {
        const quote = stockData['Global Quote'];
        if (quote) {
            // Split the data into two columns
            const leftColumnStats = {
                'Symbol': quote['01. symbol'],
                'Open': `$${parseFloat(quote['02. open']).toFixed(2)}`,
                'High': `$${parseFloat(quote['03. high']).toFixed(2)}`,
                'Low': `$${parseFloat(quote['04. low']).toFixed(2)}`,
                'Price': `$${parseFloat(quote['05. price']).toFixed(2)}`
            };

            const rightColumnStats = {
                'Volume': parseInt(quote['06. volume']).toLocaleString(),
                'Latest Trading Day': quote['07. latest trading day'],
                'Previous Close': `$${parseFloat(quote['08. previous close']).toFixed(2)}`,
                'Change': `$${parseFloat(quote['09. change']).toFixed(2)}`,
                'Change Percent': parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2) + '%'
            };

            return (
                <div className={style.stockStatsBox}>
                    <div className={style.globalQuoteColumns}>
                        <div className={style.column}>
                            <table>
                                <tbody>
                                    {Object.entries(leftColumnStats).map(([label, value]) => (
                                        <tr key={label}>
                                            <td>{label}</td>
                                            <td>{value || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={style.column}>
                            <table>
                                <tbody>
                                    {Object.entries(rightColumnStats).map(([label, value]) => (
                                        <tr key={label}>
                                            <td>{label}</td>
                                            <td>{value || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    } 
    
    // Handle time series data
    const timeSeriesKey = {
        'TIME_SERIES_DAILY': 'Time Series (Daily)',
        'TIME_SERIES_WEEKLY': 'Weekly Time Series',
        'TIME_SERIES_MONTHLY': 'Monthly Time Series'
    }[selectedFunction];

    const timeSeriesData = stockData[timeSeriesKey];
    if (!timeSeriesData) return null;

    const latestDate = Object.keys(timeSeriesData)[0];
    const rawStats = timeSeriesData[latestDate];
    const stats = {
        'Open': `$${parseFloat(rawStats['1. open']).toFixed(2)}`,
        'High': `$${parseFloat(rawStats['2. high']).toFixed(2)}`,
        'Low': `$${parseFloat(rawStats['3. low']).toFixed(2)}`,
        'Close': `$${parseFloat(rawStats['4. close']).toFixed(2)}`,
        'Volume': parseInt(rawStats['5. volume']).toLocaleString()
    };

    return (
        <div className={style.stockStatsBox}>
            <div>
                <table>
                    <tbody>
                        {Object.entries(stats).map(([label, value]) => (
                            <tr key={label}>
                                <td>{label}</td>
                                <td>{value || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StockName = ({ stockData }) => {
    if (!stockData) return null;

    let symbol = 'N/A';
    
    if (stockData['Global Quote']) {
        symbol = stockData['Global Quote']['01. symbol'];
    } else if (stockData['Meta Data']) {
        symbol = stockData['Meta Data']['2. Symbol'];
    }

    return (
        <div className={style.stockNameBlock}>
            <h1>{symbol}</h1>
            <span>{symbol}</span>
            <span>  &#x2022;  </span>
            <span>USD</span>
        </div>
    );
};

const StockPriceSummary = ({ stockData }) => {
    if (!stockData) return null;

    let price = 'N/A';
    let change = '0';
    let changePercent = '0%';

    if (stockData['Global Quote']) {
        price = parseFloat(stockData['Global Quote']['05. price']).toFixed(2);
        change = parseFloat(stockData['Global Quote']['09. change']).toFixed(2);
        changePercent = parseFloat(stockData['Global Quote']['10. change percent'].replace('%', '')).toFixed(2) + '%';
    } else {
        const timeSeriesData = stockData['Time Series (Daily)'] || 
                             stockData['Weekly Time Series'] || 
                             stockData['Monthly Time Series'];
        if (timeSeriesData) {
            const latestDate = Object.keys(timeSeriesData)[0];
            const latestData = timeSeriesData[latestDate];
            price = latestData['4. close'];
            const prevDate = Object.keys(timeSeriesData)[1];
            if (prevDate) {
                const prevData = timeSeriesData[prevDate];
                change = (parseFloat(price) - parseFloat(prevData['4. close'])).toFixed(2);
                changePercent = ((change / parseFloat(prevData['4. close'])) * 100).toFixed(2) + '%';
            }
        }
    }

    const isPositiveChange = parseFloat(change) >= 0;

    return (
        <div className={style.stockPriceSummaryBox}>
            <div>{new Date().toLocaleDateString()}</div>
            <div className={style.stockSummaryWrap}>
                <div className={style.stockSummaryHead}>
                    ${parseFloat(price).toFixed(2)}
                </div>
                <div className={style.stockSummaryChange} 
                     style={{ color: isPositiveChange ? 'green' : 'red' }}>
                    <i className={`fa-solid fa-caret-${isPositiveChange ? 'up' : 'down'}`} />
                    <span>{change}</span>
                    <span> ({changePercent})</span>
                </div>
            </div>
        </div>
    );
};

const Stock = () => {
    const { symbol } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    
    const [selectedFunction, setSelectedFunction] = useState(
        searchParams.get('function') || 'TIME_SERIES_DAILY'
    );

    const handleFunctionChange = (newFunction) => {
        setSelectedFunction(newFunction);
        setSearchParams({ function: newFunction });
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
                console.error('Error fetching stock data:', err);
                
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
                } else if (err.request) {
                    errorMessage = 'No response from server. Please check your connection.';
                }
                
                setError(errorMessage);
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
                    <div className={style.headerSection}>
                        {!isLoading && !error && <StockName stockData={stockData} />}
                    </div>
                    
                    <div className={style.functionBar}>
                        <div className={style.functionButtons}>
                            <button 
                                className={`${style.functionButton} ${selectedFunction === 'TIME_SERIES_DAILY' ? style.active : ''}`}
                                onClick={() => handleFunctionChange('TIME_SERIES_DAILY')}
                                disabled={isLoading}
                            >
                                Daily
                            </button>
                            <button 
                                className={`${style.functionButton} ${selectedFunction === 'TIME_SERIES_WEEKLY' ? style.active : ''}`}
                                onClick={() => handleFunctionChange('TIME_SERIES_WEEKLY')}
                                disabled={isLoading}
                            >
                                Weekly
                            </button>
                            <button 
                                className={`${style.functionButton} ${selectedFunction === 'TIME_SERIES_MONTHLY' ? style.active : ''}`}
                                onClick={() => handleFunctionChange('TIME_SERIES_MONTHLY')}
                                disabled={isLoading}
                            >
                                Monthly
                            </button>
                            <button 
                                className={`${style.functionButton} ${selectedFunction === 'GLOBAL_QUOTE' ? style.active : ''}`}
                                onClick={() => handleFunctionChange('GLOBAL_QUOTE')}
                                disabled={isLoading}
                            >
                                Quote
                            </button>
                        </div>
                        <button className={style.settingsButton} disabled={isLoading}>
                            <i className="fas fa-cog"></i>
                        </button>
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
                            <StockPriceSummary stockData={stockData} />
                            <StockStats stockData={stockData} selectedFunction={selectedFunction} />
                            <div>
                                Latest news on StockName [Placeholder]
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Stock;