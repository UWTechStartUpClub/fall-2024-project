import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from './index.module.css';

const Watchlist = () => {
    const [stockList, setStockList] = useState([]);
    const [error, setError] = useState([]); // Hold error info for each stock request
    const [showAddMenu, setShowAddMenu] = useState(false); // hold state determining whether to show the "Add stock" menu

    // TEMPORARY LIST OF STOCKS
    const stockWatch = ["IBM", "NVDA", "AAPL"];
    const stockWatch2 = ["IBM", "IBM", "IBM"];

    const getRandomNum = () => {
        const min = 1000;
        const max = 10000;

        /*
        https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
        */
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /*
    const fetchStockData = async (symb) => {
        // random number generation for ID
        const randomNum = getRandomNum();
        const theId = symb + randomNum;

        try {
            console.log("Fetching data...");
            const response = await axios.get(`stock/${symb}`);
            // functional update
            setStockList(prevState => {
                let objInsert = [...prevState,
                    {
                        "id": theId,
                        "symbol": symb,
                        "data": response["Global Quote"]
                    }
                ];

                return objInsert;
            });
        } catch (err) {
            console.error("An error occured while fetching data: " + err);
            
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error("Backend responded with error:", err.response);
                setError(prevState => {
                    const objError = {"id": theId, "error": err.response.data};
                    return [...prevState, objError];
                });
            } else if (err.request) {
                // Request was made, but no response received
                console.error("No response from server: ", err.request);
                setError(prevState => {
                    const objError = {"id": theId, "error": "No response from the server. Please try again later"};
                    return [...prevState, objError];
                });
            } else {
                // Other errors
                console.error("An unexpected error occurred: ", err.message);
                setError(prevState => {
                    const objError = {"id": theId, "error": err.message};
                    return [...prevState, objError];
                })
            }
        }
    }*/

    // TEMPORARY GET STOCK DATA HELPER FUNCTION
    const fetchStockData = (symb) => {
        // random number generation for ID
        const randomNum = getRandomNum();
        const theId = symb + randomNum;

        try {
            let response = TemporaryServ(symb);
            // functional update
            setStockList(prevState => {
                let objInsert = [...prevState,
                    {
                        "id": theId,
                        "symbol": symb,
                        "data": response["Global Quote"]
                    }
                ];

                return objInsert;
            });
        } catch (err) {
            console.error('Error occured fetching data', err);

            setError(prevState => {
                let objError = {"id": theId, "error": err};
                return [...prevState, objError];
            })
        }
    }

    // Load stock list on page load
    useEffect(() => {
        for (let i = 0; i < stockWatch.length; i++) {
            fetchStockData(stockWatch[i]);
        }
    }, [])


    const deleteListing = (id) => {
        setStockList(
            stockList.filter(listing => listing.id !== id)
        );
    }

    const deleteErrorMessage = (id) => {
        setError(
            error.filter(listing => listing.id !== id)
        );
    }


    return (
        <div className={`${style.panelWrap} ${style.bgDark} ${style.fgDark}`}>
            
            <div className={style.stockCard}>
                <div className={style.listControlPanelWrap}>
                    <div>
                        <h2>WATCHLIST</h2>
                    </div>
                    <div className={style.listControlPanelRight}>
                        <div>
                            <button
                                className={style.btn1}
                                onClick={() => setShowAddMenu(true)}>
                                + Add to Watchlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {stockList.map(listing => (
                <div key={listing["id"]} className={style.stockCard}>
                    
                        <div className={style.listFlexWrap}>
                            <div className={style.listMainContent}>
                                <Link to={'/stock/' + listing["symbol"]}>
                                    <div className={style.listGrid}>

                                            <div>
                                                <span className={style.stockSymbol}>
                                                    {listing["data"]["01. symbol"]}
                                                </span>
                                            </div>
                                            <div>
                                                <span>{listing["data"]["05. price"]}</span>
                                                <br />
                                                <span className={parseInt(listing["data"]['09. change']) >= 0 ? style.stockGreen : style.stockRed}>
                                                    {parseInt(listing["data"]['09. change']) >= 0 ? '+' : ''}
                                                    {listing["data"]['09. change']}
                                                    &nbsp;({parseInt(listing["data"]['09. change']) >= 0 ? '+' : ''}{listing["data"]['10. change percent']})
                                                </span>
                                            </div>

                                        
                                    </div>
                                </Link>
                            </div>

                            <div>
                                <button
                                    className={style.btn1}
                                    onClick={() => {deleteListing(listing["id"])}}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    
                </div>
            ))}

            {error.map(listing => (
                <div key={listing["id"]} className={style.stockCard}>
                    <div className={style.listFlexWrap}>

                        <div className={style.listMainContent}>
                            <div className={style.listGrid}>
                                <div>
                                    <span className={style.stockError}>
                                        Error - {listing.error.message}
                                    </span>
                                </div>
                                
                            </div>
                        </div>

                        <div>
                            <button
                                className={style.btn1}
                                onClick={() => {deleteErrorMessage(listing["id"])}}>
                                Dismiss
                            </button>
                        </div>

                    </div>
                </div>
            ))}

            {showAddMenu && <AddMenu visibleState={setShowAddMenu} fetchStockData={fetchStockData} />}
        </div>
    );
}

// ***TEMPORARY JSON "SERVER"***
const TemporaryServ = (symbol) => {
    const quotes = {
        "IBM": {
            "Global Quote": {
                "01. symbol": "IBM",
                "02. open": "207.0000",
                "03. high": "208.4150",
                "04. low": "205.3701",
                "05. price": "208.0900",
                "06. volume": "3406045",
                "07. latest trading day": "2024-11-18",
                "08. previous close": "204.9900",
                "09. change": "3.1000",
                "10. change percent": "1.5123%"
            }
        },
    
        "NVDA": {
            "Global Quote": {
                "01. symbol": "NVDA",
                "02. open": "139.0000",
                "03. high": "210.4250",
                "04. low": "102.3701",
                "05. price": "141.5400",
                "06. volume": "3406045",
                "07. latest trading day": "2024-11-18",
                "08. previous close": "204.9900",
                "09. change": "1.1300",
                "10. change percent": "0.8050%"
            }
        }
    };

    if (quotes[symbol] === undefined) {
        throw new Error("Unable to find stock: " + symbol);
    }
    
    return quotes[symbol];
}
// ***END OF TEMPORARY FUNCTION***



/**
 * Add entries to the list. Makes a request to the API.
 * Takes a stock symbol and an array holding the stock
 * data for this component.
 * 
 * @param {*} param0 Props for a (1) stock symbol, (2) array for stock data
 *  and (3) the setter function for the array of stock data
 */
const AddEntry = ({symbol}) => {
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);

    const symbolData = {symbol}.symbol; // get just the symbol itself without encapsulating properties
    
    useEffect(() => {
        const getStockData = async () => {
            try {
                console.log("Fetching data...");
                const response = await axios.get(`stock/${symbolData}`);
                setStockData(response.data);
            } catch (err) {
                console.error("An error occured while fetching data: " + err);
                
                if (err.response) {
                    // Server responded with a status other than 2xx
                    console.error("Backend responded with error:", err.response);
                    setError(`Error ${err.response.status}: ${err.response.data}`);
                } else if (err.request) {
                    // Request was made, but no response received
                    console.error("No response from server: ", err.request);
                    setError("No response from the server. Please try again later.");
                } else {
                    // Other errors
                    console.error("An unexpected error occurred: ", err.message);
                    setError("An error occurred: ", err.message);
                }
            }
        }

        // make the call to getStockData
        //getStockData();
    }, []); // NOTE THE BRACKETS - NECESSARY TO RUN ONLY ON FIRST RUN INSTEAD OF EVERY RENDER!

    //FIXME change to actual request later
    useState(() => {
        try {
            const response = TemporaryServ(symbolData);
            setStockData([response]);
        } catch(err) {
            console.error("An error occured: " + err);
            setError(`${err}`);
        }
    }, []);
    //END FIXME




}


const AddMenu = ({visibleState, fetchStockData}) => {
    const [inputSym, setInputSym] = useState("");
    
    const addStock = () => {
        // insert code to add to user record

        fetchStockData(inputSym);
    }

    return (
        <div className={style.stockCard}>
            <div className={style.listControlPanelWrap}>
                <div>
                    <label htmlFor="txtSymbolInput">Input Ticker Symbol: </label>
                    <input
                        type="text"
                        id="txtSymbolInput"
                        className={style.txtInput1}
                        onChange = {(e) => setInputSym(e.target.value)}
                    />
                    <button className={style.btn1} onClick={() => {addStock()}}>Add</button>
                </div>
                <div className={style.listControlPanelRight}>
                    <button
                        className={style.btn1}
                        onClick={() => {visibleState(false)}}>
                        Close
                    </button>
                </div>
            </div>
            
        </div>
    );
}


export default Watchlist;
