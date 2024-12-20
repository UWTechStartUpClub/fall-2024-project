import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from './index.module.css';

const Watchlist = () => {
    const [auth, setAuth] = useState(null); // hold authentication state, including the user id used to access watchlist
    const [isLoading, setIsLoading] = useState(true); // determine if the authentication system is still loading
    const [stockList, setStockList] = useState([]);
    const [error, setError] = useState([]); // Hold error info for each stock request
    const [showAddMenu, setShowAddMenu] = useState(false); // hold state determining whether to show the "Add stock" menu

    // Watchlist API URL
    const watchlistUrl = "http://localhost:3001/watchlist/watchlist"; //FIXME how to forward 3000 to 3001 like /stock???

    // Get User ID
    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/auth/verify",
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setAuth(response.data.user)
                }
            } catch (err) {
                setAuth(null);
            }
            setIsLoading(false);
        };

        verifySession();
    }, [setAuth]);

    /**
     * Generate a random number to be used as part of a
     * unique ID for identifying each request made.
     * 
     * @returns an integer between 1000 and 10000
     */
    const getRandomNum = () => {
        const min = 1000;
        const max = 10000;

        /*
        https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
        */
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * Get data from the UWealth API and store it in the StockList state hook.
     * 
     * @param {*} symb Stock symbol to look up
     */
    /*
    const fetchStockData = (symb) => {
        // random number generation for ID
        const randomNum = getRandomNum();
        const theId = symb + randomNum;

        return new Promise(async (resolve) => {
            try {
                console.log("Fetching data...");
                const response = await axios.get(`stock/${symb}`);
                // functional update
                setStockList(prevState => {
                    let objInsert = [...prevState,
                        {
                            "id": theId,
                            "symbol": symb,
                            "data": response.data
                        }
                    ];
                    console.log(objInsert);
                    return objInsert;
                });

                resolve(symb);
            } catch (err) {
                console.error("An error occured while fetching data: " + err);
                
                if (err.response) {
                    // Server responded with a status other than 2xx
                    console.error("Backend responded with error:", err.response);
                    setError(prevState => {
                        const objError = {"id": theId, "symbol": symb, "error": err.response.data};
                        return [...prevState, objError];
                    });
                } else if (err.request) {
                    // Request was made, but no response received
                    console.error("No response from server: ", err.request);
                    setError(prevState => {
                        const objError = {"id": theId, "symbol": symb, "error": "No response from the server. Please try again later"};
                        return [...prevState, objError];
                    });
                } else {
                    // Other errors
                    console.error("An unexpected error occurred: ", err.message);
                    setError(prevState => {
                        const objError = {"id": theId, "symbol": symb, "error": err.message};
                        return [...prevState, objError];
                    })
                }
            }
        });
    }*/
    
    // TEMPORARY GET STOCK DATA HELPER FUNCTION
    const fetchStockData = (symb) => {
        // random number generation for ID
        const randomNum = getRandomNum();
        const theId = symb + randomNum;

        return new Promise((resolve) => {
            try {
                let response = TemporaryServ(symb);
                // functional update
                setStockList(prevState => {
                    let objInsert = [...prevState,
                        {
                            "id": theId,
                            "symbol": symb,
                            "data": response
                        }
                    ];

                    return objInsert;
                });

                resolve(symb);
            } catch (err) {
                console.error('Error occured fetching data', err);

                setError(prevState => {
                    let objError = {"id": theId, "symbol": symb, "error": err};
                    return [...prevState, objError];
                })
            }
        });
    }

    /**
     * Load the user's initial list of saved watchlist stocks
     * on page load.
     */
    useEffect(() => {
        let userList = [];
        const getWatchlistData = async () => {
            try {
                const response = await axios.get(
                    `${watchlistUrl}`, {params: {userID: auth.userId}}
                );
                if (response.status === 200) {
                    userList = response.data; // FIXME
                    for (let i = 0; i < userList.length; i++) {
                        fetchStockData(userList[i]);
                    }
                }
            } catch (err) {
                if (err.response.data.error) {
                    console.error(err.response.data.error);
                }
                
                userList = [];
            }
        }

        if (!isLoading) {
            getWatchlistData();
        }
    }, [isLoading])


    /**
     * Delete a stock from the list of saved watchlist stock.
     * The ID is autogenerated each time, but is inserted into the
     * event firing mechanism.
     * 
     * @param {*} id Request identifier used to find and delete the stock from the list.
     */
    const deleteListing = (id) => {
        const symb = (stockList.filter(listing => listing.id == id))[0].symbol;
        
        const deleteSymb = async () => {
            try {
                const deleteData = {"userID": auth.userId, "stockSymbol": symb};
                const response = await axios.delete(`${watchlistUrl}`, {data: deleteData});
                if (response.status === 201) {
                    console.log("Deleted " + symb);
                }
            } catch (err) {
                if (err.response.data.error) {
                    console.error(err.response.data.error);
                } else {
                    console.error(err);
                }
            }
        }

        deleteSymb();

        setStockList(
            stockList.filter(listing => listing.id !== id)
        );
    }

    /**
     * Dismiss an error message.
     * 
     * @param {*} id Request identifier used to find and delete an error message.
     */
    const deleteErrorMessage = (id) => {
        setError(
            error.filter(listing => listing.id !== id)
        );
    }
    
    /**
     * Check if a stock symbol has already been added
     * @param {*} symb 
     */
    const checkIfStockExists = (symb) => {
        for (let i = 0; i < stockList.length; i++) {
            if (stockList[i].symbol == symb) {
                return true;
            }
        }
        return false;
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
                                                    {listing["data"]["Global Quote"]["01. symbol"]}
                                                </span>
                                            </div>
                                            <div>
                                                <span>{listing["data"]["Global Quote"]["05. price"]}</span>
                                                <br />
                                                <span className={parseInt(listing["data"]["Global Quote"]['09. change']) >= 0 ? style.stockGreen : style.stockRed}>
                                                    {parseInt(listing["data"]["Global Quote"]['09. change']) >= 0 ? '+' : ''}
                                                    {listing["data"]["Global Quote"]['09. change']}
                                                    &nbsp;({parseInt(listing["data"]["Global Quote"]['09. change']) >= 0 ? '+' : ''}{listing["data"]["Global Quote"]['10. change percent']})
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

            {showAddMenu && 
                <AddMenu
                    visibleState={setShowAddMenu}
                    fetchStockData={fetchStockData}
                    watchlistUrl={watchlistUrl}
                    userId={auth.userId}
                    checkIfStockExists={checkIfStockExists}
                    setError={setError}
                    randomNum={getRandomNum}
                />
            }
        </div>
    );
}

// ***TEMPORARY JSON "SERVER"***
const TemporaryServ = (symbol) => {
    const quotes = {
        "IBM": {
            "Global Quote": {
                "01. symbol": "IBM",
                "02. open": "232.6900",
                "03. high": "233.0000",
                "04. low": "229.1300",
                "05. price": "230.1200",
                "06. volume": "3872680",
                "07. latest trading day": "2024-12-11",
                "08. previous close": "231.7200",
                "09. change": "-1.6000",
                "10. change percent": "-0.6905%"
            }
        },
    
        "MSFT": {
            "Global Quote": {
                "01. symbol": "MSFT",
                "02. open": "444.0500",
                "03. high": "450.3500",
                "04. low": "444.0500",
                "05. price": "448.9900",
                "06. volume": "19200208",
                "07. latest trading day": "2024-12-11",
                "08. previous close": "443.3300",
                "09. change": "5.6600",
                "10. change percent": "1.2767%"
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
 * Component to add and load a stock to the watchlist.
 * 
 * @param {*} param0 Props for the visibleState (whether to display or not) and function to get the stock data.
 * @returns Renderable HTML code for display.
 */
const AddMenu = ({visibleState, fetchStockData, watchlistUrl, userId, checkIfStockExists, setError, randomNum}) => {
    const [inputSym, setInputSym] = useState("");
    
    const addStock = () => {
        if (checkIfStockExists(inputSym)) {
            console.log("already exists");
            setError(prevState => {
                let objError = {"id": inputSym + randomNum(), "symbol": inputSym, "error": {message: "Symbol already added."}};
                return [...prevState, objError];
            })
        } else {
            fetchStockData(inputSym).then(async (symb) => {
                try {
                    const addData = {"userID": userId, "stockSymbol": symb};
                    const response = await axios.post(`${watchlistUrl}`, addData);
                    if (response.status === 201) {
                        console.log("Added " + inputSym);
                    }
                } catch (err) {
                    if (err.response.data.error) {
                        console.error(err.response.data.error);
                    } else {
                        console.error(err);
                    }
                }
            });
        }

    };

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
