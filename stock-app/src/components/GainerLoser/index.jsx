import React from 'react';
import style from './index.module.css';

const GainerLoser = () => {
    /*
        TODO: THIS IS ALL STATIC DATA --
        THIS COMPONENT IS YET TO BE COMPLETED
    */
    return(
        <div className={`${style.panelWrap} ${style.bgDark} ${style.fgDark}`}>
            <div>
                <div className={style.stockCard}>
                    <h2>TOP GAINERS</h2>
                </div>
                <div className={style.stockCard}>
                    <a href="">
                        <div>
                            <span className={style.stockSymbol}>NVDA</span>
                        </div>
                        <div>
                            <span>141.54</span>
                        </div>
                        <div>
                            <span className={style.stockGreen}>+1.13</span>
                        </div>
                        <div>
                            <span className={style.stockGreen}>(+0.805%)</span>
                        </div>
                    </a>
                </div>
                
                <div className={style.stockCard}>
                    <a href="">
                        <div>
                            <span className={style.stockSymbol}>TSLA</span>
                        </div>
                        <div>
                            <span>269.19</span>
                        </div>
                        <div>
                            <span className={style.stockGreen}>+8.71</span>
                        </div>
                        <div>
                            <span className={style.stockGreen}>(+3.344%)</span>
                        </div>
                    </a>
                </div>
            </div>

            <div>
            <div className={style.stockCard}>
                    <h2>TOP LOSERS</h2>
                </div>
                <div className={style.stockCard}>
                    <a href="">
                        <div>
                            <span className={style.stockSymbol}>LILM</span>
                        </div>
                        <div>
                            <span>0.149</span>
                        </div>
                        <div>
                            <span className={style.stockRed}>-0.06</span>
                        </div>
                        <div>
                            <span className={style.stockRed}>(-28.844%)</span>
                        </div>
                    </a>
                </div>
                <div className={style.stockCard}>
                    <a href="">
                        <div>
                            <span className={style.stockSymbol}>JOBY</span>
                        </div>
                        <div>
                            <span>5.16</span>
                        </div>
                        <div>
                            <span className={style.stockRed}>-0.88</span>
                        </div>
                        <div>
                            <span className={style.stockRed}>(-14.57%)</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default GainerLoser;
