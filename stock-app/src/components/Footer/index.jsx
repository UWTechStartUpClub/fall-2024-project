import React from 'react'
import style from './index.module.css';
import { Link } from 'react-router-dom';

const appName = "Universal Wealth";

const Footer = () => {
    return(
        <footer className={style.footer}>
            <div className={style.footerContainer}>
                <div class={style.footerLinks}>
                    <a href="#privacy-policy">Privacy Policy</a>
                    <a href="#terms-of-service">Terms of Service</a>
                    <a href="#mission">Our Mission</a>
                    <a href="#contact">Contact Us</a>
                </div>
                <p>
                    Copyright &#169; 2024 {appName}. Data courtesy of Alpha Vantage.
                    <br />
                    Universal Wealth is a project of The Tech Startup Club at
                    the University of Washington Tacoma.
                    <br />
                    Project code available under the MIT license
                    on <a
                        href="https://github.com/UWTechStartUpClub/fall-2024-project"
                        target="_blank" rel="noreferrer">GitHub</a>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
