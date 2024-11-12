import React from 'react';
import style from './style/stock.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Stock = () => {

    return (
        <>
            <NavBar />
            <div className={style.stockMainWrap}>
                <div className={style.stockMainContent}>
                    <StockName />
                    <StockPriceSummary />
                    <div>
                        Placeholder for graph.
                    </div>
                    <StockStats />
                    <div>
                        Latest news on Company Name [Placeholder]
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

const StockName = () => {
    return (
        <div className={style.stockNameBlock}>
            <h1>Company Name</h1>
            <span>SYMB</span>
            <span>  &#x2022;  </span>
            <span>USD</span>
        </div>
    )
}

const StockPriceSummary = () => {
    return (
        <div className={style.stockPriceSummaryBox}>
            <div>MM/DD/YYYY</div>
            <div className={style.stockSummaryWrap}>
                <div className={style.stockSummaryHead}>419.02</div>
                <div className={style.stockSummaryChange} style={{color: "green"}}>
                    <i className="fa-solid fa-caret-up" />
                    <span> +1.084</span>
                    <span> (+0.29%)</span>
                </div>
            </div>
        </div>
    );
}

const StockStats = () => {
    return (
        <div className={style.stockStatsBox}>
            <div>
                <table>
                    <tr>
                        <td>Open</td>
                        <td>????</td>
                    </tr>
                    <tr>
                        <td>Day High</td>
                        <td>???</td>
                    </tr>
                    <tr>
                        <td>Day Low</td>
                        <td>???</td>
                    </tr>
                    <tr>
                        <td>Prev Close</td>
                        <td>????</td>
                    </tr>
                </table>
            </div>
            <div>
                <table>
                    <tr>
                        <td>52 Week High</td>
                        <td>???</td>
                    </tr>
                    <tr>
                        <td>52 Week High Date</td>
                        <td>????</td>
                    </tr>
                    <tr>
                        <td>52 Week Low</td>
                        <td>????</td>
                    </tr>
                    <tr>
                        <td>52 Week Low Date</td>
                        <td>???</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Stock