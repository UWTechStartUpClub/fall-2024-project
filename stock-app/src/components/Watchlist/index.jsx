import React from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.css';

const Watchlist = () => {
    return (
        <div className={`${style.panelWrap} ${style.bgDark} ${style.fgDark}`}>
            <div className={style.stockCard}>
                <h2>WATCHLIST</h2>
            </div>

            <ListBuilder />

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
    
    return quotes[symbol];
}
// ***END OF TEMPORARY FUNCTION***



/**
 * 
 * @param {*} num Number to be adjusted
 * @param {*} precision number of decimal places
 * @returns 
 */
function setPrecision(num, precision) {
    return num.toPrecision(precision);
}

// Build the individual entry
const EntryBuilder = ({symbol}) => {
    //FIXME change to actual request later
    const request = TemporaryServ({symbol}.symbol);
    if (request === undefined) {
        return (
            <div className={style.stockCard}>
                <span className={style.stockError}>Unable to find stock: {{symbol}.symbol}</span>
            </div>
        );
    }

    // set equal to stock data itself so you don't have to type ['Global Quote'] every time
    const stockData = request['Global Quote'];

    // + or - based on change in stock price
    const changeSign = parseInt(stockData['09. change']) >= 0 ? '+' : '';
    const changeColor = parseInt(stockData['09. change']) >= 0 ? style.stockGreen : style.stockRed;

    return (
        <div className={style.stockCard}>
                <Link to={'/stock/:symbol?symbol=' + {symbol}.symbol}>
                    <div className={style.listGrid}>

                        <div>
                            <span className={style.stockSymbol}>
                                {stockData["01. symbol"]}
                            </span>
                        </div>
                        <div>
                            <span>{stockData["05. price"]}</span>
                            <br />
                            <span className={changeColor}>
                                {changeSign}{stockData['09. change']} ({changeSign}{stockData['10. change percent']})
                            </span>
                        </div>

                    </div>
                </Link>
            </div>
    );
}

const ListBuilder = () => {
    // TEMPORARY
    const listOfSymbols = ['IBM', 'IBM', 'NVDA', 'AAPL'];
    let items = [];

    for (let i = 0; i < listOfSymbols.length; i++) {
        items.push(<EntryBuilder symbol={listOfSymbols[i]} key={i} />);
    }

    return (
        items
    );
}

export default Watchlist;
