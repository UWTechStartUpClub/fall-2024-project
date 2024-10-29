import React from 'react';
import style from './index.module.css';

const GainerLoser = () => {
    /*
        TODO: THIS IS ALL STATIC DATA --
        THIS COMPONENT IS YET TO BE COMPLETED
    */
    return(
        <div
            className={style.panelWrap}
        >
            <div className={style.panel}>
                <h2>Top Gainers</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>SYMBOL</th>
                            <th>PRICE</th>
                            <th>CHANGE</th>
                            <th>%CHG</th>
                        </tr>
                        <tr>
                            <td>NVDA</td>
                            <td>141.54</td>
                            <td>+1.13</td>
                            <td>+0.805</td>
                        </tr>
                        <tr>
                            <td>TSLA</td>
                            <td>269.19</td>
                            <td>+8.71</td>
                            <td>+3.344</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={style.panel}>
                <h2>Bottom Losers</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>SYMBOL</th>
                            <th>PRICE</th>
                            <th>CHANGE</th>
                            <th>%CHG</th>
                        </tr>
                        <tr>
                            <td>LILM</td>
                            <td>0.149</td>
                            <td>-0.06</td>
                            <td>-28.844</td>
                        </tr>
                        <tr>
                            <td>JOBY</td>
                            <td>5.16</td>
                            <td>-0.88</td>
                            <td>-14.57</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GainerLoser;
