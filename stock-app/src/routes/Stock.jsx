import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import style from './style/stock.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line, Brush} from 'recharts';

/**
 * Stock chart component. creates a visual representation of data recieved by alphavantage 
 * Time series function. X-axis representing the time/day/week/month of a price of a stock
 * in history, with dashed lines (axis line, tick line) representing important dates.
 * Left Y-axis represents cost of one share, with a tick line at an important value. Right
 * Y-axis represents volume. Bar graph represents volume, line chart represents cost of one share.
 * 
 * @param {*} marketData Json AlphaVantage stock market data
 * @param {*} selectedFunction Function sent to AlphaVantage
 * @returns 
 */
const PriceChart = ({ marketData, selectedFunction }) => {
    if (!marketData) return null;

    const timeSeriesKey = {
        'TIME_SERIES_INTRADAY': 'Time Series (5min)',
        'TIME_SERIES_DAILY': 'Time Series (Daily)',
        'TIME_SERIES_WEEKLY': 'Weekly Time Series',
        'TIME_SERIES_MONTHLY': 'Monthly Time Series'
    }[selectedFunction];

    const timeSeriesData = marketData[timeSeriesKey];
    if (!timeSeriesData) return null;

    // Get current price for percentage calculations
    const currentPrice = parseFloat(Object.values(timeSeriesData)[0]['4. close']);

    /**
     * Formats the date and time into a 2 digit string.
     * 
     * @param {dateTimeString} a String represen
     * @returns 
     */
    const formatDateTime = (dateTimeString) => {
        if (selectedFunction === 'TIME_SERIES_INTRADAY') {
            const date = new Date(dateTimeString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            
            // Only show labels for market open (9:30 AM) and close (4:00 PM)
            if ((hours === 9 && minutes === 30) || (hours === 16 && minutes === 0)) {
                return date.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
            }
            return ''; // Return empty string for other times
        }
        // For other timeframes, show the date
        return new Date(dateTimeString).toLocaleDateString();
    };

    /**
     * 
     */
    const chartData = Object.entries(timeSeriesData)
        .reverse()
        .map(([dateTime, data]) => {
            const price = parseFloat(data['4. close']);
            const percentChange = ((price - currentPrice) / currentPrice * 100).toFixed(2);
            
            return {
                dateTime: dateTime,
                displayTime: formatDateTime(dateTime),
                price: price.toFixed(2),
                percentChange: percentChange,
                volume: parseInt(data['5. volume'])
            };
        }
    );

    const prices = chartData.map(item => parseFloat(item.price));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    const yAxisPadding = (maxPrice - minPrice) * 0.05;
    const yAxisMax = maxPrice + yAxisPadding;
    const yAxisMin = Math.max(0, minPrice - yAxisPadding);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const isPositive = parseFloat(payload[1].payload.percentChange) >= 0;
            return (
                <div className={style.customTooltip}>
                    <p className={style.tooltipDate}>
                        {selectedFunction === 'TIME_SERIES_INTRADAY' 
                            ? new Date(payload[1].payload.dateTime).toLocaleString() // Show full date and time for intraday
                            : label
                        }
                    </p>
                    <p className={style.tooltipPrice}>
                        Price: ${payload[1].value}
                        <span style={{ 
                            color: isPositive ? 'green' : 'red',
                            marginLeft: '8px'
                        }}>
                            {isPositive ? '+' : ''}{payload[1].payload.percentChange}%
                        </span>
                    </p>
                    <p className={style.tooltipVolume}>
                        Volume: {parseInt(payload[0].value).toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={style.priceChartSection}>
            <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={chartData}>
                        <XAxis 
                            dataKey="displayTime"
                            tick={{ 
                                fill: '#fff', 
                                fontSize: 12 
                            }}
                            axisLine={{ stroke: '#454545' }}
                            tickLine={{ stroke: '#454545' }}
                            interval={selectedFunction === 'TIME_SERIES_INTRADAY' 
                                ? 'preserveStartEnd'
                                : Math.ceil(chartData.length / 10)
                            }
                            angle={-45}
                            textAnchor="end"
                            height={50}
                        />
                        <YAxis 
                            yAxisId="price"
                            domain={[yAxisMin, yAxisMax]}
                            tick={{ fill: '#fff' }}
                            axisLine={{ stroke: '#454545' }}
                            tickLine={{ stroke: '#454545' }}
                            tickFormatter={(value) => `$${Math.round(value)}`}
                            width={80}
                        />
                        <YAxis 
                            yAxisId="volume"
                            orientation="right"
                            tick={{ 
                                fill: '#fff',
                                fontSize: 16,
                                angle: 25
                            }}
                            axisLine={{ stroke: '#454545' }}
                            tickLine={{ stroke: '#454545' }}
                            tickFormatter={(value) => {
                                if (value >= 1000000) {
                                    return `${(value / 1000000).toFixed(1)}M`;
                                } else if (value >= 1000) {
                                    return `${(value / 1000).toFixed(1)}K`;
                                }
                                return value;
                            }}
                            width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#454545" />
                        <Bar 
                            dataKey="volume" 
                            yAxisId="volume" 
                            fill="#454545" 
                            opacity={0.3} 
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#198bd2"
                            yAxisId="price"
                            dot={false}
                            strokeWidth={2}
                        />
                        <Brush
                            dataKey="dateTime"
                            height={20}       // Made thinner
                            stroke="#198bd2"
                            fill="#18191A" 
                            travellerWidth={8}  // Made handles slightly thinner
                            startIndex={Math.max(0, chartData.length - 50)}
                            className={style.customBrush}
                            y={380}
                            tickFormatter={() => ''} // Remove the date labels
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const FinancialMetrics = ({ overviewData }) => {
    if (!overviewData) return null;

    const formatMetric = (value, prefix = '') => {
        if (!value) return 'N/A';
        return `${prefix}${value}`;
    };

    return (
        <div className={style.financialMetricsSection}>
            <div className={style.metricGroup}>
                <div className={style.metric}>
                    <span className={style.metricLabel}>52 Week High</span>
                    <span className={style.metricValue}>
                        ${parseFloat(overviewData?.['52WeekHigh']).toFixed(2)}
                    </span>
                </div>
                <div className={style.metric}>
                    <span className={style.metricLabel}>52 Week Low</span>
                    <span className={style.metricValue}>
                        ${parseFloat(overviewData?.['52WeekLow']).toFixed(2)}
                    </span>
                </div>
                <div className={style.metric}>
                    <span className={style.metricLabel}>50 Day Moving Average</span>
                    <span className={style.metricValue}>
                        ${parseFloat(overviewData?.['50DayMovingAverage']).toFixed(2)}
                    </span>
                </div>
            </div>
            <div className={style.metricGroup}>
                <div className={style.metric}>
                    <span className={style.metricLabel}>Quarterly Earnings Growth</span>
                    <span className={style.metricValue}>
                        {(parseFloat(overviewData?.QuarterlyEarningsGrowthYOY) * 100).toFixed(2)}%
                    </span>
                </div>
                <div className={style.metric}>
                    <span className={style.metricLabel}>Quarterly Revenue Growth</span>
                    <span className={style.metricValue}>
                        {(parseFloat(overviewData?.QuarterlyRevenueGrowthYOY) * 100).toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

const AnalystSentiment = ({ overviewData }) => {
    if (!overviewData) return null;

    const targetPrice = overviewData.AnalystTargetPrice;

    // Extract analyst ratings from overview data
    const sentimentData = [
        {
            sentiment: 'Strong Buy',
            count: parseInt(overviewData.AnalystRatingStrongBuy) || 0,
            color: '#22c55e' // Green
        },
        {
            sentiment: 'Buy',
            count: parseInt(overviewData.AnalystRatingBuy) || 0,
            color: '#86efac' // Light green
        },
        {
            sentiment: 'Hold',
            count: parseInt(overviewData.AnalystRatingHold) || 0,
            color: '#fcd34d' // Yellow
        },
        {
            sentiment: 'Sell',
            count: parseInt(overviewData.AnalystRatingSell) || 0,
            color: '#f87171' // Light red
        },
        {
            sentiment: 'Strong Sell',
            count: parseInt(overviewData.AnalystRatingStrongSell) || 0,
            color: '#dc2626' // Red
        }
    ];

    // Calculate total recommendations for Y axis
    const totalRecommendations = sentimentData.reduce((sum, item) => sum + item.count, 0);

    // Check if there's any data to display
    if (totalRecommendations === 0) return null;

    return (
        <div className={style.sentimentSection}>
            <h2 className={style.sectionTitle}>Analyst Recommendations</h2>
            {targetPrice && (
                <div className={style.targetPrice}>
                    <span>Analyst Target Price:</span>
                    <span className={style.priceValue}>${parseFloat(targetPrice).toFixed(2)}</span>
                </div>
            )}
            <div className={style.sentimentChart}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sentimentData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#454545" vertical={false} />
                        <XAxis 
                            dataKey="sentiment" 
                            tick={{ fill: '#fff' }}
                            axisLine={{ stroke: '#454545' }}
                        />
                        <YAxis 
                            tick={{ fill: '#fff' }}
                            axisLine={{ stroke: '#454545' }}
                            domain={[0, 'dataMax']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e1f20',
                                border: '1px solid #adadad',
                                borderRadius: '4px'
                            }}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar 
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                        >
                            {sentimentData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const StockDescription = ({ overviewData }) => {
    if (!overviewData?.Description) return null;

    return (
        <div className={style.descriptionSection}>
            <h2 className={style.sectionTitle}>About</h2>
            <div className={style.descriptionContent}>
                <p>{overviewData.Description}</p>
            </div>
        </div>
    );
};

const StockStats = ({ marketData, selectedFunction, showFullData }) => {
    if (!marketData) return null;
 
    if (selectedFunction === 'GLOBAL_QUOTE') {
        const quote = marketData['Global Quote'];
        console.log('Global Quote data:', quote);
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
        } else {
            console.log('No quote data available');
            return null;
        }
    } 
    
    // Handle time series data
    const timeSeriesKey = {
        'TIME_SERIES_INTRADAY': 'Time Series (5min)',
        'TIME_SERIES_DAILY': 'Time Series (Daily)',
        'TIME_SERIES_WEEKLY': 'Weekly Time Series',
        'TIME_SERIES_MONTHLY': 'Monthly Time Series'
    }[selectedFunction];
    
    console.log('Looking for timeSeriesKey:', timeSeriesKey);
    
    const timeSeriesData = marketData[timeSeriesKey];
    console.log('Found timeSeriesData:', !!timeSeriesData);
    
    if (!timeSeriesData) {
        console.log('No time series data available');
        return null;
    }
 
    if (showFullData) {
        return (
            <div className={style.stockStatsBox}>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Open</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Close</th>
                                <th>Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(timeSeriesData).map(([date, data]) => (
                                <tr key={date}>
                                    <td>{date}</td>
                                    <td>${parseFloat(data['1. open']).toFixed(2)}</td>
                                    <td>${parseFloat(data['2. high']).toFixed(2)}</td>
                                    <td>${parseFloat(data['3. low']).toFixed(2)}</td>
                                    <td>${parseFloat(data['4. close']).toFixed(2)}</td>
                                    <td>{parseInt(data['5. volume']).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
 
    // Show only latest date
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

const StockName = ({ marketData, overviewData }) => {
    if (!marketData && !overviewData) return null;

    let symbol = 'N/A';
    let name = 'N/A';
    let sector = null;
    let industry = null;
    let website = null;
    
    if (overviewData) {
        symbol = overviewData.Symbol;
        name = overviewData.Name;
        sector = overviewData.Sector;
        industry = overviewData.Industry;
        website = overviewData.OfficialSite;
    } else if (marketData['Global Quote']) {
        symbol = marketData['Global Quote']['01. symbol'];
    } else if (marketData['Meta Data']) {
        symbol = marketData['Meta Data']['2. Symbol'];
    }

    return (
        <div className={style.stockNameBlock}>
            <h1>
                {website ? (
                    <a href={website} target="_blank" rel="noopener noreferrer" className={style.companyLink}>
                        {name}
                    </a>
                ) : (
                    name
                )}
            </h1>
            <div className={style.stockDetails}>
                <span>{symbol}</span>
                <span className={style.separator}>&#x2022;</span>
                <span>{sector}</span>
                <span className={style.separator}>&#x2022;</span>
                <span>USD</span>
            </div>
            {industry && (
                <div className={style.industryDetails}>
                    {industry}
                </div>
            )}
        </div>
    );
};

const StockPriceSummary = ({ marketData }) => {
    if (!marketData) return null;

    let price = 'N/A';
    let change = '0';
    let changePercent = '0%';
    let latestDate = null;
    let isIntraday = false;

    if (marketData['Global Quote']) {
        price = parseFloat(marketData['Global Quote']['05. price']).toFixed(2);
        change = parseFloat(marketData['Global Quote']['09. change']).toFixed(2);
        changePercent = parseFloat(marketData['Global Quote']['10. change percent'].replace('%', '')).toFixed(2) + '%';
        latestDate = marketData['Global Quote']['07. latest trading day'];
    } else {
        const timeSeriesData = marketData['Time Series (5min)'] ||
                             marketData['Time Series (Daily)'] || 
                             marketData['Weekly Time Series'] || 
                             marketData['Monthly Time Series'];
        
        isIntraday = !!marketData['Time Series (5min)'];
        
        if (timeSeriesData) {
            latestDate = Object.keys(timeSeriesData)[0];
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
    
    // Format the date based on whether it's intraday or not
    const formattedDate = latestDate ? (
        isIntraday 
            ? new Date(latestDate).toLocaleString()
            : new Date(latestDate).toLocaleDateString()
    ) : 'N/A';

    return (
        <div className={style.stockPriceSummaryBox}>
            <div style={{ color: '#adadad' }}>{formattedDate} previous market close </div>
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
    const [marketData, setMarketData] = useState(null);
    const [overviewData, setOverviewData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showFullData, setShowFullData] = useState(false);
    
    const [selectedFunction, setSelectedFunction] = useState(
        searchParams.get('function') || 'TIME_SERIES_DAILY'
    );

    const handleFunctionChange = (newFunction) => {
        setSelectedFunction(newFunction);
        setSearchParams({ function: newFunction });
        setMarketData(null);
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
    
                // If the response has the new structure with market_data
                if (response.data.market_data) {
                    setMarketData(response.data.market_data);
                    setOverviewData(response.data.overview);
                } else {
                    // Handle the current response structure where data comes directly
                    setMarketData(response.data);
                    setOverviewData(null);
                }
    
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSettingsOpen && !event.target.closest(`.${style.settingsContainer}`)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isSettingsOpen]);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    return (
        <>
            <NavBar />
            <div className={style.stockMainWrap}>
                <div className={style.stockMainContent}>
                    {error ? (
                        <div className={style.error}>
                            There was an error while fetching the Stock data.
                            If this error persists you may be out of AlphaVantage requests. API rate limit is 25 a day, this page uses 3 each refresh.
                            <button 
                                onClick={handleRetry}
                                className={style.retryButton}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={style.headerSection}>
                                {!isLoading && (
                                    <StockName 
                                        marketData={marketData}
                                        overviewData={overviewData}
                                    />
                                )}
                            </div>
    
                            {!isLoading && (
                                <StockPriceSummary marketData={marketData} />
                            )}
    
                            <div className={style.functionBar}>
                                <div className={style.functionButtons}>
                                    <button 
                                        className={`${style.functionButton} ${selectedFunction === 'TIME_SERIES_INTRADAY' ? style.active : ''}`}
                                        onClick={() => handleFunctionChange('TIME_SERIES_INTRADAY')}
                                        disabled={isLoading}
                                    >
                                        Intraday
                                    </button>
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
                                <div className={style.settingsContainer}>
                                    <button 
                                        className={`${style.settingsButton} ${isSettingsOpen ? style.active : ''}`}
                                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                        disabled={isLoading}
                                    >
                                        <i className="fas fa-cog"></i>
                                    </button>
                                    {isSettingsOpen && (
                                        <div className={style.settingsDropdown}>
                                            <div className={style.settingsOption}>
                                                <span>Full History</span>
                                                <label className={style.switch}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={showFullData}
                                                        onChange={() => setShowFullData(!showFullData)}
                                                    />
                                                    <span className={style.slider}></span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
    
                            {isLoading ? (
                                <div className={style.loadingIndicator}>
                                    Loading stock data...
                                </div>
                            ) : (
                                <>
                                    <PriceChart 
                                        marketData={marketData}
                                        selectedFunction={selectedFunction}
                                    />
                                    <StockStats 
                                        marketData={marketData}
                                        selectedFunction={selectedFunction} 
                                        showFullData={showFullData}
                                    />
                                    <FinancialMetrics overviewData={overviewData} />
                                    <StockDescription overviewData={overviewData} />
                                    <AnalystSentiment overviewData={overviewData} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Stock;