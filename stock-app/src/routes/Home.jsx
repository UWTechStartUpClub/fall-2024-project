import React from 'react';
//import SearchBar from '../components/SearchBar'
import style from './style/home.module.css';
import BigHeader from '../components/BigHeader';
import GLPanel from '../components/GainerLoser';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

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
            <NewsAndStats />
            <AboutBlerb />
            <Footer />
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

const NewsAndStats = () => {
    return (
        <section className={style.newsStatsSectionWrap}>
            <div className={style.newsStatsContainer}>

                <div className={style.newsWrap}>
                    <h2 className={style.head}>Market News</h2>
                    
                </div>

                <div className={style.glWrap}>
                    <h2 className={style.head}>Top Gain/Loss</h2>
                    <GLPanel />
                </div>

            </div>
        </section>
    );
}

const AboutBlerb = () => {
    return (
        <section>
            <h2 className="center">About Us</h2>
            <p className={style.aboutParagraph}>
                At Universal Wealth, we aim to connect users with the latest
                stock market moves and news in a simple to use interface. This 
                app formed as part of a project by the Tech Startup Club 
                at the University of Washington Tacoma.
            </p>
        </section>
    );
}

export default Home