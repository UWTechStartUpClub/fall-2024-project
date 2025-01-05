import React from 'react';
//import SearchBar from '../components/SearchBar'
import style from './style/home.module.css';
import BigHeader from '../components/BigHeader';
import GLPanel from '../components/GainerLoser';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

/**
 * This is the main home component, rendering the main layout.
 * Home contains sections: a navigation bar, a main header, a "Top Gainers and Losers" section, etc.
 * No direct interaction with the AlphaVantage API
 */

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
            <ContentHeaders />
            <SocialMediaBar />
            <Footer />
        </>
    )
}

const MainHeader = () => {
    const headText = appName;
    const headSubtext = "A historical screener in your browser for free.";
    const bgUrl = "https://wallpapers.com/images/featured/stock-market-pd5zksxr07t7a4xu.jpg";
    const bgGradient = "true";
    const btnText = "Login";
    const btnClass = "header-button";
    const btnHref = "/login";
    return (
        <BigHeader
            headText={headText}
            headSubtext={headSubtext}
            bgUrl={bgUrl}
            bgGradient={bgGradient}
            btnText={btnText}
            btnHref={btnHref}
            btnClass={btnClass}
        />
    );
}

const SocialMediaBar = () => {
    return (
        <div className={style.socialBar}>
            <div className={style.socialBarContent}>
                <div className={style.projectInfo}>
                    A Tech Startup Club at University of Washington Project | Data from Alpha Vantage
                </div>
                <div className={style.socialSection}>
                    <span className={style.socialText}>Follow us on</span>
                    <div className={style.socialLinks}>
                        <a href="https://github.com/UWTechStartUpClub" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/techstartupclub/" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="https://www.instagram.com/techstartupuw/?hl=en" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://discord.gg/SPJnwq5hPk" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-discord"></i>
                        </a>
                        <a href="https://uwtechstartupclub.netlify.app/" target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-globe"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
 }

 const ContentHeaders = () => {
    return (
        <>
            <section className={style.graphicHeader} style={{backgroundImage: 'url("https://images.pexels.com/photos/220237/pexels-photo-220237.jpeg")'}}> {/* Metal chain from Pexels */}
                <div className={style.headerContent}>
                    <h2>Get started with</h2>
                    <h2>UWealth Stock and</h2>
                    <h2>Crypto screeners</h2>                   
                    <p>Track Stocks & Crypto with</p>
                    <p>daily updates on your favorites.</p>
                </div>
            </section>
            
            <section className={`${style.graphicHeader} ${style.graphicHeader2}`} style={{backgroundImage: 'url("https://images.pexels.com/photos/129208/pexels-photo-129208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")'}}> {/* Trading view image */}
                <div className={`${style.headerContent} ${style.headerContentRight}`}>
                    <h2>Recieve Analyst</h2>
                    <h2>Recommendations</h2>  
                    <p>Analyst recommendations are </p>
                    <p>provided by Alpha Vantage and </p>
                    <p>are not financial advice</p>
                </div>
            </section>
        </>
    );
}

export default Home