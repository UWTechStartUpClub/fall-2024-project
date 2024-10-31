import React from 'react'
//import SearchBar from '../components/SearchBar'
import style from './style/home.module.css';
import BigHeader from '../components/BigHeader';
import GLPanel from '../components/GainerLoser';
import NavBar from '../components/NavBar';

const appName = "Universal Wealth";

const Home = () => {

    /**
     * Hierarchy:
     *  Nav bar + search and sign in
     *  Main header
     *  Top Gainers and Losers (Stocks to watch, not watchlist)
     *  Market news
     *  About us blerb
     */
    return (
        <>
            <NavBar />
            <MainHeader />
            <GainersLosers />
            <AboutBlerb />
        </>
    )
}

const MainHeader = () => {
    const headText = appName;
    const headSubtext = "SEE WHAT'S MOVING THE MARKET";
    const bgUrl = "https://wallpapers.com/images/featured/stock-market-pd5zksxr07t7a4xu.jpg";
    const bgGradient = "true";
    const btnText = "GET STARTED";
    const btnHref = "https://i.gifer.com/origin/7a/7a47d1014b0ac74e8db76bb7e2253e01_w200.gif";

    return (
        <BigHeader
            headText={headText}
            headSubtext={headSubtext}
            bgUrl={bgUrl}
            bgGradient={bgGradient}
            btnText={btnText}
            btnHref={btnHref}
        />
    );
}

const GainersLosers = () => {
    return (
        <section>
            <div className={style.glSection}>
                <h2 className={style.head}>Stocks to Watch</h2>
                <div className={style.glContainer}>
                    <GLPanel />
                    <br /><br />
                </div>
            </div>
        </section>
    );
}

const AboutBlerb = () => {
    return (
        <section>
            <h2 className="center">About Us</h2>
        </section>
    );
}

export default Home