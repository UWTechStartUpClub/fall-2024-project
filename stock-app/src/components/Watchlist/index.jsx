import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from './index.module.css';

const Watchlist = () => {
    const [stockList, setStockList] = useState([]);
    const [showAddMenu, setShowAddMenu] = useState(false);

    const handleAddToList = (theSymbol, theData) => {
        // Add to shared hook

        if (!(theSymbol === undefined || theData === undefined)) {
            setStockList([
                ...stockList,
                {"symbol": theSymbol, "data": theData}
            ]);
        }
    }

    const getStockDataTemp = (sym) => {
        try {
            const response = TemporaryServ(sym);
            return response;
        } catch(err) {
            console.error("An error occured: " + err);
        }
    }


    // ***Load user's existing list data***
    const buildListFromArray = (theArray) => {
        const data = [];

        for (let i = 0; i < theArray.length; i++) {
            const quote = getStockDataTemp(theArray[i]);

            if (quote === undefined) {
                data.push({"symbol": theArray[i], "status": "error", "data": {}});
            } else {
                data.push({"symbol": theArray[i], "status": "success", "data": getStockDataTemp(theArray[i])["Global Quote"]});
            }
        }
        
        setStockList(data);
    }

    useState(() => {
        const testArray = ["IBM", "NVDA", "AAPL"];

        buildListFromArray(testArray);
    }, []);
    // ***^^^Load user's existing list data^^^***


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
                <div key={listing["data"]["symbol"]} className={style.stockCard}>
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
                                    {parseInt(listing["data"]['09. change']) >= 0 ? '+' : ''}{listing["data"]['09. change']} ({parseInt(listing["data"]['09. change']) >= 0 ? '+' : ''}{listing["data"]['10. change percent']})
                                </span>
                            </div>

                        </div>
                    </Link>
                </div>
            ))}

            {showAddMenu && <AddMenu visibleState={setShowAddMenu} getStockData={getStockDataTemp} setStockList={handleAddToList} />}
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
 * 
 * @param {*} num Number to be adjusted
 * @param {*} precision number of decimal places
 * @returns Adjusted number
 */
function setPrecision(num, precision) {
    return num.toPrecision(precision);
}


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

/*
// Build the individual entry
const EntryBuilder = ({symbol}) => {
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
            setStockData(response);
        } catch(err) {
            console.error("An error occured: " + err);
            setError(`${err}`);
        }
    }, []);
    //END FIXME
    
    if (stockData === null) {
        return (
            <div className={style.stockCard}>
                Loading...
                {error && <div className={style.stockError}>{error}</div>}
            </div>
        );
    }


    // set equal to stock data itself so you don't have to type ['Global Quote'] every time
    const stockQuote = stockData['Global Quote'];

    // + or - based on change in stock price
    const changeSign = parseInt(stockQuote['09. change']) >= 0 ? '+' : '';
    const changeColor = parseInt(stockQuote['09. change']) >= 0 ? style.stockGreen : style.stockRed;

    return (
        <div className={style.stockCard}>
                <Link to={'/stock/' + symbolData}>
                    <div className={style.listGrid}>

                        <div>
                            <span className={style.stockSymbol}>
                                {stockQuote["01. symbol"]}
                            </span>
                        </div>
                        <div>
                            <span>{stockQuote["05. price"]}</span>
                            <br />
                            <span className={changeColor}>
                                {changeSign}{stockQuote['09. change']} ({changeSign}{stockQuote['10. change percent']})
                            </span>
                        </div>

                    </div>
                </Link>
            </div>
    );
}


const ListBuilder = () => {
    // TEMPORARY
    const listOfSymbols = ['IBM', 'NVDA', 'AAPL'];
    let items = [];

    for (let i = 0; i < listOfSymbols.length; i++) {
        items.push(<EntryBuilder symbol={listOfSymbols[i]} key={i} />);
    }

    return (
        items
    );
}
*/

const AddMenu = ({visibleState, getStockData, setStockList}) => {
    const [inputSym, setInputSym] = useState("");
    
    const addStock = () => {
        // insert code to add to user record

        const data = getStockData(inputSym);
        setStockList(inputSym, data["Global Quote"]);
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