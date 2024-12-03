import React from 'react';
import style from './style/dashboard.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Watchlist from '../components/Watchlist';
import GLPanel from '../components/GainerLoser';

const Dashboard = () => {
    return(
        <>
            <NavBar />

            <div className={style.dashMainWrap}>
                <div className={style.dashMainContent}>
                    <h1>Dashboard</h1>

                    <div className={style.dashMainGrid}>
                        <div className={style.dashWatchlist}>
                            <Watchlist />
                        </div>
                        <div>
                            <GLPanel />
                        </div>
                        <div>
                            <GLPanel />
                        </div>
                        <div className={style.dashStockDetails}>
                            <GLPanel />
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}

export default Dashboard;
